#!/usr/bin/env python3
"""Apply governed canonical URL overrides to data envelopes.

`data/sources.yml` remains the source-definition registry. This narrow migration
layer exists for official landing pages that moved or redirect while a larger
registry cleanup is in progress. It changes provenance URLs only; it never
changes values, dates, statuses, fetch modes, units, or citations.
"""

from __future__ import annotations

import argparse
import json
import pathlib
import sys
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parent.parent
GOVERNANCE_FILE = ROOT / "data" / "source_url_governance.json"
GENERATED_DIR = ROOT / "data" / "generated"
MANUAL_DIR = ROOT / "data" / "manual"


def load_governance() -> dict[str, Any]:
    with GOVERNANCE_FILE.open("r", encoding="utf-8") as handle:
        doc = json.load(handle)
    if not isinstance(doc, dict):
        raise ValueError("source URL governance must be a JSON object")
    if doc.get("schema") != "fuel_resilience_source_url_governance.v1":
        raise ValueError("unexpected source URL governance schema")
    overrides = doc.get("overrides")
    if not isinstance(overrides, dict):
        raise ValueError("source URL governance overrides must be an object")
    return doc


def envelope_path(source_id: str) -> pathlib.Path | None:
    generated = GENERATED_DIR / f"{source_id}.json"
    manual = MANUAL_DIR / f"{source_id}.json"
    if generated.exists():
        return generated
    if manual.exists():
        return manual
    return None


def expected_metadata(doc: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "canonical_url": override["canonical_url"],
        "reviewed_at": doc["reviewed_at"],
        "reason": override["reason"],
    }
    if override.get("legacy_urls"):
        payload["legacy_urls"] = override["legacy_urls"]
    if override.get("supporting_urls"):
        payload["supporting_urls"] = override["supporting_urls"]
    return payload


def apply_one(path: pathlib.Path, doc: dict[str, Any], override: dict[str, Any], *, check: bool) -> bool:
    with path.open("r", encoding="utf-8") as handle:
        envelope = json.load(handle)

    expected_url = override.get("canonical_url")
    if not isinstance(expected_url, str) or not expected_url:
        raise ValueError(f"{path.name}: canonical_url must be a non-empty string")

    expected_governance = expected_metadata(doc, override)
    changed = False
    if envelope.get("source_url") != expected_url:
        envelope["source_url"] = expected_url
        changed = True
    if envelope.get("source_url_governance") != expected_governance:
        envelope["source_url_governance"] = expected_governance
        changed = True

    if changed and not check:
        path.write_text(json.dumps(envelope, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return changed


def main() -> int:
    parser = argparse.ArgumentParser(description="Apply source URL governance to envelopes")
    parser.add_argument("--check", action="store_true", help="fail when an envelope is not canonicalised")
    parser.add_argument("--only", help="limit processing to one source id")
    args = parser.parse_args()

    try:
        doc = load_governance()
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"source URL governance error: {exc}", file=sys.stderr)
        return 1

    changed_paths: list[str] = []
    missing: list[str] = []
    for source_id, override in sorted(doc["overrides"].items()):
        if args.only and source_id != args.only:
            continue
        if not isinstance(override, dict):
            print(f"{source_id}: override must be an object", file=sys.stderr)
            return 1
        path = envelope_path(source_id)
        if path is None:
            missing.append(source_id)
            continue
        try:
            changed = apply_one(path, doc, override, check=args.check)
        except (OSError, ValueError, json.JSONDecodeError) as exc:
            print(f"{source_id}: {exc}", file=sys.stderr)
            return 1
        if changed:
            changed_paths.append(path.relative_to(ROOT).as_posix())

    if missing:
        print("missing governed envelope(s): " + ", ".join(missing), file=sys.stderr)
        return 1

    if args.check and changed_paths:
        for path in changed_paths:
            print(f"stale governed URL metadata: {path}", file=sys.stderr)
        return 1

    if changed_paths:
        print(f"Updated {len(changed_paths)} governed envelope(s)")
        for path in changed_paths:
            print(f"  - {path}")
    else:
        print("Source URL governance already applied")
    return 0


if __name__ == "__main__":
    sys.exit(main())
