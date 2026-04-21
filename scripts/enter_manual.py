#!/usr/bin/env python3
"""Safely enter verified values for manual source envelopes.

This helper keeps hand-entered data aligned with the JSON envelope contract.
It only writes sources marked ``fetch: manual`` in data/sources.yml and runs
the validator after saving so broken manual data is not left behind silently.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import pathlib
import subprocess
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


def load_sources() -> dict[str, dict[str, Any]]:
    with SOURCES_FILE.open("r", encoding="utf-8") as f:
        doc = yaml.safe_load(f)
    return {source["id"]: source for source in doc.get("sources", [])}


def parse_point(raw: str) -> dict[str, Any]:
    if "=" not in raw:
        raise ValueError("point must be formatted as YYYY-MM=123.4 or YYYY-MM-DD=123.4")
    period, value_text = raw.split("=", 1)
    period = period.strip()
    if not period:
        raise ValueError("point period is blank")
    try:
        value = float(value_text.strip())
    except ValueError as exc:
        raise ValueError(f"point value is not numeric: {value_text!r}") from exc
    return {"t": period, "v": value}


def period_to_date(period: str) -> dt.date:
    if len(period) == 7:
        year, month = [int(part) for part in period.split("-")]
        if not 1 <= month <= 12:
            raise ValueError(f"invalid month in period {period!r}")
        if month == 12:
            next_month = dt.date(year + 1, 1, 1)
        else:
            next_month = dt.date(year, month + 1, 1)
        return next_month - dt.timedelta(days=1)
    return dt.date.fromisoformat(period)


def normalize_values(points: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return sorted(points, key=lambda point: point["t"])


def merge_values(
    existing: list[dict[str, Any]],
    incoming: list[dict[str, Any]],
    *,
    force: bool = False,
) -> list[dict[str, Any]]:
    merged: dict[str, dict[str, Any]] = {}
    for point in existing:
        if isinstance(point, dict) and isinstance(point.get("t"), str):
            merged[point["t"]] = point
    for point in incoming:
        period = point["t"]
        if period in merged and not force:
            raise ValueError(f"value for {period} already exists; use --force to replace it")
        merged[period] = point
    return normalize_values(list(merged.values()))


def build_manual_envelope(
    source: dict[str, Any],
    values: list[dict[str, Any]],
    *,
    unit: str,
    notes: str,
) -> dict[str, Any]:
    now = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    last_period = values[-1]["t"]
    return {
        "series_id": source["id"],
        "source_id": source["id"],
        "source_name": source["human_name"],
        "source_url": source.get("canonical_url") or source["url"],
        "unit": unit,
        "retrieved_at": now,
        "last_data_point": period_to_date(last_period).isoformat(),
        "values": values,
        "notes": notes,
        "status": "ok",
        "manual_entry": True,
        "source_rights": source.get("rights", ""),
        "citation": source.get("citation", ""),
    }


def load_existing(path: pathlib.Path) -> dict[str, Any] | None:
    if not path.exists():
        return None
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def run_validator() -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "validate_data.py")],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=False,
    )


def prompt_if_missing(value: str | None, label: str) -> str:
    if value:
        return value
    entered = input(f"{label}: ").strip()
    if not entered:
        raise ValueError(f"{label} is required")
    return entered


def main() -> int:
    ap = argparse.ArgumentParser(description="Enter verified manual source values")
    ap.add_argument("--list", action="store_true", help="list editable manual sources")
    ap.add_argument("--source", help="source id from data/sources.yml")
    ap.add_argument(
        "--point",
        action="append",
        default=[],
        help="value point, e.g. 2026-03=123.4 or 2026-03-31=123.4; repeatable",
    )
    ap.add_argument("--unit", help="unit label for this envelope")
    ap.add_argument("--notes", help="short note citing the checked table/page/report")
    ap.add_argument("--force", action="store_true", help="replace existing points with the same period")
    ap.add_argument("--dry-run", action="store_true", help="print envelope without writing it")
    args = ap.parse_args()

    sources = load_sources()
    manual_sources = {sid: source for sid, source in sources.items() if source.get("fetch") == "manual"}

    if args.list:
        for sid in sorted(manual_sources):
            print(f"{sid}\t{manual_sources[sid].get('human_name', '')}")
        return 0

    sid = args.source or prompt_if_missing(None, "Source id")
    source = sources.get(sid)
    if not source:
        print(f"Unknown source id: {sid}", file=sys.stderr)
        return 1
    if source.get("fetch") != "manual":
        print(f"{sid} is fetch: {source.get('fetch')}; enter_manual.py only writes manual sources", file=sys.stderr)
        return 1

    raw_points = args.point or [prompt_if_missing(None, "Point (YYYY-MM=123.4 or YYYY-MM-DD=123.4)")]
    try:
        incoming = [parse_point(raw) for raw in raw_points]
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    path = MANUAL_DIR / f"{sid}.json"
    existing = load_existing(path)
    existing_values = existing.get("values", []) if isinstance(existing, dict) else []
    try:
        values = merge_values(existing_values, incoming, force=args.force)
        if not values:
            raise ValueError("at least one value is required")
        unit = args.unit or (existing.get("unit") if existing else None) or source.get("fetch_unit") or prompt_if_missing(None, "Unit")
        notes = args.notes or prompt_if_missing(None, "Notes / source table checked")
        envelope = build_manual_envelope(source, values, unit=unit, notes=notes)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    rendered = json.dumps(envelope, indent=2, ensure_ascii=False) + "\n"
    if args.dry_run:
        print(rendered)
        return 0

    MANUAL_DIR.mkdir(parents=True, exist_ok=True)
    previous = path.read_text(encoding="utf-8") if path.exists() else None
    path.write_text(rendered, encoding="utf-8")
    result = run_validator()
    if result.returncode != 0:
        if previous is None:
            path.unlink(missing_ok=True)
        else:
            path.write_text(previous, encoding="utf-8")
        sys.stderr.write(result.stdout)
        sys.stderr.write(result.stderr)
        print("Manual envelope failed validation; previous file restored.", file=sys.stderr)
        return result.returncode

    print(f"Wrote {path.relative_to(ROOT)}")
    if result.stdout.strip():
        print(result.stdout.strip())
    return 0


if __name__ == "__main__":
    sys.exit(main())
