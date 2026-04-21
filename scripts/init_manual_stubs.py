#!/usr/bin/env python3
"""Create placeholder manual JSON files.

For every source in data/sources.yml whose fetch mode is "manual" or
"unavailable", create data/manual/<id>.json with status "unavailable" unless a
richer hand-keyed file already exists there.

Unavailable stubs are not retrieved data. They keep retrieved_at null and record
stub_created_at separately so page freshness cannot mistake a placeholder for a
verified value.
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
    for source in sources:
        if source.get("fetch") not in ("manual", "unavailable"):
            continue
        path = MANUAL_DIR / f"{source['id']}.json"
        if path.exists():
            continue
        now = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
        stub = {
            "series_id": source["id"],
            "source_id": source["id"],
            "source_name": source["human_name"],
            "source_url": source.get("canonical_url") or source["url"],
            "unit": "",
            "retrieved_at": None,
            "stub_created_at": now,
            "last_data_point": None,
            "values": [],
            "notes": (
                "Awaiting hand-keyed values from the named public source. "
                "Populate this file with figures copied directly from the "
                "publisher's latest report, keep 'manual_entry' set to true, "
                "set 'retrieved_at' to the data-entry timestamp, and set "
                "'status' to 'ok'."
            ),
            "status": "unavailable",
            "manual_entry": True,
        }
        if source.get("rights"):
            stub["source_rights"] = source["rights"]
        if source.get("citation"):
            stub["citation"] = source["citation"]
        with path.open("w", encoding="utf-8") as f:
            json.dump(stub, f, indent=2, ensure_ascii=False)
            f.write("\n")
        created += 1
        print(f"created {path.relative_to(ROOT)}")

    print(f"\ncreated {created} stub(s); existing files left untouched")
    return 0


if __name__ == "__main__":
    sys.exit(main())
