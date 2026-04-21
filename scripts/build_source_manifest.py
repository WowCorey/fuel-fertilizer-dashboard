#!/usr/bin/env python3
"""Build the browser source manifest from data/sources.yml.

The dashboards can use this manifest to know whether a source is expected in
data/generated/ or data/manual/. That avoids noisy, expected 404s for manual
sources while keeping a fallback path for older deployments.
"""

from __future__ import annotations

import argparse
import json
import pathlib
import sys
from typing import Any

try:
    import yaml
except ImportError:
    sys.stderr.write("PyYAML is required. Install with: pip install pyyaml\n")
    sys.exit(2)

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES_FILE = ROOT / "data" / "sources.yml"
GENERATED_DIR = ROOT / "data" / "generated"
MANUAL_DIR = ROOT / "data" / "manual"
MANIFEST_FILE = ROOT / "data" / "source_manifest.json"


def build_manifest() -> dict[str, Any]:
    with SOURCES_FILE.open("r", encoding="utf-8") as f:
        doc = yaml.safe_load(f)

    sources: dict[str, Any] = {}
    for source in doc.get("sources", []):
        sid = source["id"]
        mode = source.get("fetch")
        has_generated = (GENERATED_DIR / f"{sid}.json").exists()
        has_manual = (MANUAL_DIR / f"{sid}.json").exists()
        preferred_dir = "generated" if mode in {"programmatic", "derived"} else "manual"
        sources[sid] = {
            "id": sid,
            "human_name": source.get("human_name"),
            "publisher": source.get("publisher"),
            "fetch": mode,
            "update_cadence": source.get("update_cadence"),
            "used_by": source.get("used_by", []),
            "canonical_url": source.get("canonical_url") or source.get("url"),
            "rights": source.get("rights"),
            "citation": source.get("citation"),
            "preferred_dir": preferred_dir,
            "has_generated": has_generated,
            "has_manual": has_manual,
        }

    return {
        "schema": "fuel_resilience_source_manifest.v1",
        "sources": dict(sorted(sources.items())),
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="Build data/source_manifest.json")
    ap.add_argument("--check", action="store_true", help="fail if the committed manifest is stale")
    args = ap.parse_args()

    manifest = build_manifest()
    rendered = json.dumps(manifest, indent=2, ensure_ascii=False) + "\n"

    if args.check:
        if not MANIFEST_FILE.exists():
            print(f"{MANIFEST_FILE.relative_to(ROOT)} is missing", file=sys.stderr)
            return 1
        current = MANIFEST_FILE.read_text(encoding="utf-8")
        if current != rendered:
            print(f"{MANIFEST_FILE.relative_to(ROOT)} is stale; run scripts/build_source_manifest.py", file=sys.stderr)
            return 1
        print("source manifest ok")
        return 0

    MANIFEST_FILE.write_text(rendered, encoding="utf-8")
    print(f"Wrote {MANIFEST_FILE.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
