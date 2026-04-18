#!/usr/bin/env python3
"""
init_manual_stubs.py — create placeholder manual JSON files.

For every source in data/sources.yml whose fetch mode is "manual" or
"unavailable", drop a stub into data/manual/<id>.json with status
"unavailable" and empty values, unless a richer hand-keyed file
already exists there.

This script is idempotent and never overwrites an existing file.
"""

from __future__ import annotations

import datetime as dt
import json
import pathlib
import sys

try:
    import yaml
except ImportError:
    sys.stderr.write("PyYAML is required\n")
    sys.exit(2)


ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES_FILE = ROOT / "data" / "sources.yml"
MANUAL_DIR = ROOT / "data" / "manual"


def main() -> int:
    with SOURCES_FILE.open("r", encoding="utf-8") as f:
        sources = yaml.safe_load(f).get("sources", [])

    MANUAL_DIR.mkdir(parents=True, exist_ok=True)
    created = 0
    for s in sources:
        if s.get("fetch") not in ("manual", "unavailable"):
            continue
        path = MANUAL_DIR / f"{s['id']}.json"
        if path.exists():
            continue
        now = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
        stub = {
            "series_id":       s["id"],
            "source_id":       s["id"],
            "source_name":     s["human_name"],
            "source_url":      s["url"],
            "unit":            "",
            "retrieved_at":    now,
            "last_data_point": None,
            "values":          [],
            "notes": (
                "Awaiting hand-keyed values from the named public source. "
                "Populate this file with figures copied directly from the "
                "publisher's latest report, keep 'manual_entry' set to true, "
                "and set 'status' to 'ok'."
            ),
            "status":          "unavailable",
            "manual_entry":    True,
        }
        with path.open("w", encoding="utf-8") as f:
            json.dump(stub, f, indent=2, ensure_ascii=False)
            f.write("\n")
        created += 1
        print(f"created {path.relative_to(ROOT)}")

    print(f"\ncreated {created} stub(s); existing files left untouched")
    return 0


if __name__ == "__main__":
    sys.exit(main())
