#!/usr/bin/env python3
"""Report manual source envelopes that need review.

This is an operational helper, not a validator. It reads data/sources.yml and
the committed JSON envelopes, then flags manual sources that are unavailable,
missing, or older than the same freshness windows used by validate_data.py.
"""

from __future__ import annotations

import argparse
import datetime as dt
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
MANUAL_DIR = ROOT / "data" / "manual"
GENERATED_DIR = ROOT / "data" / "generated"

STALE_GRACE_DAYS = {
    "daily": 7,
    "weekly": 21,
    "monthly": 75,
    "quarterly": 140,
    "annual": 820,
    "ad-hoc": None,
}


def parse_args() -> argparse.Namespace:
    ap = argparse.ArgumentParser(description="Report source envelopes due for manual review")
    ap.add_argument("--json", action="store_true", help="emit machine-readable JSON")
    ap.add_argument("--used-by", help="filter by dashboard key, e.g. national_status or resource_value")
    ap.add_argument("--include-generated", action="store_true", help="also report generated/derived sources")
    ap.add_argument("--fail-on-due", action="store_true", help="exit 1 when any source is due")
    return ap.parse_args()


def load_sources() -> list[dict[str, Any]]:
    with SOURCES_FILE.open("r", encoding="utf-8") as f:
        doc = yaml.safe_load(f)
    return list(doc.get("sources", []))


def load_json(path: pathlib.Path) -> dict[str, Any] | None:
    if not path.exists():
        return None
    with path.open("r", encoding="utf-8") as f:
        doc = json.load(f)
    return doc if isinstance(doc, dict) else None


def parse_date(value: Any) -> dt.date | None:
    if not value:
        return None
    try:
        return dt.date.fromisoformat(str(value))
    except ValueError:
        return None


def envelope_path(source: dict[str, Any]) -> pathlib.Path:
    sid = source["id"]
    if source.get("fetch") in {"programmatic", "derived"}:
        return GENERATED_DIR / f"{sid}.json"
    return MANUAL_DIR / f"{sid}.json"


def review_status(source: dict[str, Any], today: dt.date) -> dict[str, Any]:
    sid = source["id"]
    path = envelope_path(source)
    env = load_json(path)
    cadence = source.get("update_cadence")
    grace = STALE_GRACE_DAYS.get(cadence)
    result = {
        "id": sid,
        "dashboard": source.get("used_by", []),
        "fetch": source.get("fetch"),
        "cadence": cadence,
        "path": path.relative_to(ROOT).as_posix(),
        "status": None,
        "last_data_point": None,
        "days_old": None,
        "due": False,
        "reason": "",
    }

    if env is None:
        result.update({"status": "missing", "due": True, "reason": "envelope is missing"})
        return result

    result["status"] = env.get("status")
    result["last_data_point"] = env.get("last_data_point")
    if source.get("fetch") == "unavailable":
        result.update({
            "due": True,
            "reason": "intentionally unavailable; review only if a named source or defensible method now exists",
        })
        return result
    if env.get("status") != "ok":
        result.update({"due": True, "reason": env.get("notes") or "source unavailable"})
        return result

    last = parse_date(env.get("last_data_point"))
    if last is None:
        result.update({"due": True, "reason": "ok envelope has no parseable last_data_point"})
        return result

    days_old = (today - last).days
    result["days_old"] = days_old
    if grace is not None and days_old > grace:
        result.update({"due": True, "reason": f"older than {grace}-day {cadence} review window"})
    else:
        result["reason"] = "within review window" if grace is not None else "ad-hoc source; review when publisher changes"
    return result


def main() -> int:
    args = parse_args()
    today = dt.datetime.now(dt.timezone.utc).date()
    rows = []
    for source in load_sources():
        mode = source.get("fetch")
        if not args.include_generated and mode not in {"manual", "unavailable"}:
            continue
        if args.used_by and args.used_by not in source.get("used_by", []):
            continue
        rows.append(review_status(source, today))

    due = [row for row in rows if row["due"]]
    report = {"checked": len(rows), "due_count": len(due), "due": due, "all": rows}

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print(f"checked {len(rows)} source(s); {len(due)} due for review")
        for row in due:
            age = "unknown age" if row["days_old"] is None else f"{row['days_old']} days old"
            print(f"- {row['id']} ({row['fetch']}, {row['cadence']}): {age}; {row['reason']}")

    return 1 if args.fail_on_due and due else 0


if __name__ == "__main__":
    sys.exit(main())
