#!/usr/bin/env python3
"""Validate Fuel Resilience AU source registry and data envelopes.

The validator is intentionally light on dependencies: stdlib + PyYAML. It
checks the source registry, generated/manual envelope structure, and the source
IDs referenced by dashboard loader arrays.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import pathlib
import re
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
DASHBOARD_DIR = ROOT / "ui_kits"

FETCH_MODES = {"programmatic", "manual", "unavailable"}
FORMATS = {"CSV", "JSON", "PDF", "HTML_TABLE", "XLSX", "MIXED"}
CADENCES = {"daily", "weekly", "monthly", "quarterly", "annual", "ad-hoc"}
REQUIRED_SOURCE_FIELDS = {
    "id",
    "human_name",
    "publisher",
    "url",
    "canonical_url",
    "format",
    "update_cadence",
    "last_verified",
    "rights",
    "rights_url",
    "citation",
    "reuse_notes",
    "fetch",
    "used_by",
}
REQUIRED_ENVELOPE_FIELDS = {
    "series_id",
    "source_id",
    "source_name",
    "source_url",
    "unit",
    "retrieved_at",
    "last_data_point",
    "values",
    "notes",
    "status",
    "manual_entry",
}
STALE_GRACE_DAYS = {
    "daily": 7,
    "weekly": 21,
    "monthly": 75,
    "quarterly": 140,
    "annual": 460,
    "ad-hoc": None,
}


def parse_args() -> argparse.Namespace:
    ap = argparse.ArgumentParser(description="Validate Fuel Resilience AU data")
    ap.add_argument("--json", action="store_true", help="emit machine-readable JSON")
    ap.add_argument("--strict", action="store_true", help="treat stale data warnings as errors")
    return ap.parse_args()


def add(issue_list: list[dict[str, str]], path: str, message: str) -> None:
    issue_list.append({"path": path, "message": message})


def rel(path: pathlib.Path) -> str:
    return path.relative_to(ROOT).as_posix()


def load_yaml(path: pathlib.Path, errors: list[dict[str, str]]) -> dict[str, Any]:
    try:
        with path.open("r", encoding="utf-8") as f:
            doc = yaml.safe_load(f)
    except Exception as e:
        add(errors, rel(path), f"cannot parse YAML: {type(e).__name__}: {e}")
        return {}
    if not isinstance(doc, dict):
        add(errors, rel(path), "top-level YAML document must be a mapping")
        return {}
    return doc


def load_json(path: pathlib.Path, errors: list[dict[str, str]]) -> dict[str, Any] | None:
    try:
        with path.open("r", encoding="utf-8") as f:
            doc = json.load(f)
    except Exception as e:
        add(errors, rel(path), f"cannot parse JSON: {type(e).__name__}: {e}")
        return None
    if not isinstance(doc, dict):
        add(errors, rel(path), "top-level JSON value must be an object")
        return None
    return doc


def is_iso_datetime(value: Any) -> bool:
    if not isinstance(value, str) or not value:
        return False
    try:
        dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
        return True
    except ValueError:
        return False


def is_iso_date(value: Any) -> bool:
    # PyYAML parses unquoted YYYY-MM-DD scalars as datetime.date. JSON envelopes
    # still arrive as strings, so accept both shapes.
    if isinstance(value, dt.datetime):
        return False
    if isinstance(value, dt.date):
        return True
    if not isinstance(value, str) or not value:
        return False
    try:
        dt.date.fromisoformat(value)
        return True
    except ValueError:
        return False


def as_date(value: Any) -> dt.date:
    if isinstance(value, dt.datetime):
        return value.date()
    if isinstance(value, dt.date):
        return value
    return dt.date.fromisoformat(value)


def validate_sources(errors: list[dict[str, str]], warnings: list[dict[str, str]]) -> dict[str, dict[str, Any]]:
    doc = load_yaml(SOURCES_FILE, errors)
    raw_sources = doc.get("sources")
    if not isinstance(raw_sources, list):
        add(errors, rel(SOURCES_FILE), "sources must be a list")
        return {}

    seen: set[str] = set()
    sources: dict[str, dict[str, Any]] = {}
    for idx, source in enumerate(raw_sources):
        path = f"{rel(SOURCES_FILE)}:sources[{idx}]"
        if not isinstance(source, dict):
            add(errors, path, "source entry must be a mapping")
            continue
        missing = sorted(REQUIRED_SOURCE_FIELDS - source.keys())
        if missing:
            add(errors, path, f"missing required fields: {', '.join(missing)}")
        sid = source.get("id")
        if not isinstance(sid, str) or not re.fullmatch(r"[a-z][a-z0-9_]*", sid):
            add(errors, path, "id must be a lowercase slug")
            continue
        if sid in seen:
            add(errors, path, f"duplicate source id: {sid}")
        seen.add(sid)
        sources[sid] = source

        if source.get("fetch") not in FETCH_MODES:
            add(errors, path, "fetch must be one of: programmatic, manual, unavailable")
        if source.get("format") not in FORMATS:
            add(errors, path, "format is not in the allowed set")
        if source.get("update_cadence") not in CADENCES:
            add(errors, path, "update_cadence is not in the allowed set")
        if not is_iso_date(source.get("last_verified")):
            add(errors, path, "last_verified must be YYYY-MM-DD")
        if not isinstance(source.get("used_by"), list) or not source.get("used_by"):
            add(errors, path, "used_by must be a non-empty list")
        if source.get("fetch") == "programmatic" and not source.get("fetch_url"):
            add(errors, path, "programmatic sources must define fetch_url")
        if not source.get("rights"):
            add(errors, path, "rights must describe upstream source rights")
        if not source.get("citation"):
            add(errors, path, "citation must describe required attribution")
        if source.get("rights_url") == "":
            add(warnings, path, "rights_url is blank; verify upstream terms before publication")

    return sources


def validate_values(path: pathlib.Path, values: Any, errors: list[dict[str, str]]) -> None:
    if not isinstance(values, list):
        add(errors, rel(path), "values must be a list")
        return
    for idx, point in enumerate(values):
        loc = f"{rel(path)}:values[{idx}]"
        if not isinstance(point, dict):
            add(errors, loc, "value point must be an object")
            continue
        if not isinstance(point.get("t"), str) or not point.get("t"):
            add(errors, loc, "t must be a non-empty string")
        v = point.get("v")
        if isinstance(v, bool) or not isinstance(v, (int, float)):
            add(errors, loc, "v must be numeric")


def has_structured_extra(env: dict[str, Any]) -> bool:
    extra = env.get("extra")
    if extra is None:
        return False
    if not isinstance(extra, dict):
        return False
    return isinstance(extra.get("schema"), str) and isinstance(extra.get("fields"), (dict, list))


def validate_envelope(
    path: pathlib.Path,
    env: dict[str, Any],
    sources: dict[str, dict[str, Any]],
    expected_manual: bool,
    errors: list[dict[str, str]],
    warnings: list[dict[str, str]],
) -> None:
    missing = sorted(REQUIRED_ENVELOPE_FIELDS - env.keys())
    if missing:
        add(errors, rel(path), f"missing required envelope fields: {', '.join(missing)}")

    sid = env.get("source_id")
    file_id = path.stem
    if sid != file_id:
        add(errors, rel(path), f"source_id must match file name ({file_id})")
    source = sources.get(file_id)
    if not source:
        add(errors, rel(path), "envelope has no matching source registry entry")
        return

    if env.get("manual_entry") is not expected_manual:
        expected = "true" if expected_manual else "false"
        add(errors, rel(path), f"manual_entry must be {expected} for this directory")

    status = env.get("status")
    if status not in {"ok", "unavailable"}:
        add(errors, rel(path), "status must be 'ok' or 'unavailable'")

    values = env.get("values")
    validate_values(path, values, errors)

    if status == "ok":
        if not is_iso_datetime(env.get("retrieved_at")):
            add(errors, rel(path), "ok envelope requires ISO retrieved_at")
        if not values and not has_structured_extra(env):
            add(errors, rel(path), "ok envelope requires non-empty values or typed extra.schema + extra.fields")
        if values and not is_iso_date(env.get("last_data_point")):
            add(errors, rel(path), "ok time-series envelope requires last_data_point as YYYY-MM-DD")
        check_stale(path, env, source, warnings)
    elif status == "unavailable":
        if env.get("retrieved_at") is not None:
            add(errors, rel(path), "unavailable envelope must set retrieved_at to null")
        if env.get("last_data_point") is not None:
            add(errors, rel(path), "unavailable envelope must set last_data_point to null")
        if values:
            add(errors, rel(path), "unavailable envelope must not contain display values")
        if not env.get("notes"):
            add(errors, rel(path), "unavailable envelope needs notes explaining the gap")
        if env.get("stub_created_at") is not None and not is_iso_datetime(env.get("stub_created_at")):
            add(errors, rel(path), "stub_created_at must be ISO datetime when present")

    if env.get("source_name") != source.get("human_name"):
        add(warnings, rel(path), "source_name differs from data/sources.yml human_name")
    expected_url = source.get("canonical_url") or source.get("url")
    if env.get("source_url") != expected_url:
        add(warnings, rel(path), "source_url differs from source canonical_url")


def check_stale(path: pathlib.Path, env: dict[str, Any], source: dict[str, Any], warnings: list[dict[str, str]]) -> None:
    cadence = source.get("update_cadence")
    grace = STALE_GRACE_DAYS.get(cadence)
    if grace is None:
        return
    last = env.get("last_data_point")
    if not is_iso_date(last):
        return
    last_date = as_date(last)
    today = dt.datetime.now(dt.timezone.utc).date()
    if (today - last_date).days > grace:
        add(warnings, rel(path), f"last_data_point may be stale for {cadence} cadence")


def validate_envelopes(sources: dict[str, dict[str, Any]], errors: list[dict[str, str]], warnings: list[dict[str, str]]) -> None:
    generated = {p.stem: p for p in GENERATED_DIR.glob("*.json")}
    manual = {p.stem: p for p in MANUAL_DIR.glob("*.json")}

    for sid, path in sorted(generated.items()):
        env = load_json(path, errors)
        if env is not None:
            validate_envelope(path, env, sources, False, errors, warnings)
    for sid, path in sorted(manual.items()):
        env = load_json(path, errors)
        if env is not None:
            validate_envelope(path, env, sources, True, errors, warnings)

    all_envelopes = set(generated) | set(manual)
    for sid in all_envelopes - set(sources):
        add(errors, f"data/*/{sid}.json", "envelope exists without registry entry")

    for sid, source in sorted(sources.items()):
        mode = source.get("fetch")
        if mode == "programmatic" and sid not in generated:
            add(errors, rel(GENERATED_DIR / f"{sid}.json"), "programmatic source is missing generated envelope")
        if mode in {"manual", "unavailable"} and sid not in manual:
            add(errors, rel(MANUAL_DIR / f"{sid}.json"), "manual/unavailable source is missing manual envelope")


def extract_dashboard_refs() -> dict[str, set[str]]:
    refs: dict[str, set[str]] = {}
    files = list((DASHBOARD_DIR / "fuel-dashboard").glob("data.js"))
    files += list(DASHBOARD_DIR.glob("*-dashboard/index.html"))
    files += list((DASHBOARD_DIR / "oil-and-production").glob("index.html"))
    files += list((DASHBOARD_DIR / "who-pays-what").glob("index.html"))

    array_re = re.compile(r"(?:const\s+SERIES|window\.FUEL_SERIES)\s*=\s*\[(.*?)\]", re.S)
    company_re = re.compile(r"id:\s*['\"]([a-z][a-z0-9_]+)['\"]")
    string_re = re.compile(r"['\"]([a-z][a-z0-9_]+)['\"]")

    for path in files:
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        found: set[str] = set(company_re.findall(text))
        for block in array_re.findall(text):
            found.update(string_re.findall(block))
        if found:
            refs[rel(path)] = found
    return refs


def validate_dashboard_refs(sources: dict[str, dict[str, Any]], errors: list[dict[str, str]]) -> None:
    source_ids = set(sources)
    for path, refs in extract_dashboard_refs().items():
        for sid in sorted(refs):
            if sid not in source_ids:
                add(errors, path, f"dashboard references unknown source id: {sid}")


def main() -> int:
    args = parse_args()
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []

    sources = validate_sources(errors, warnings)
    if sources:
        validate_envelopes(sources, errors, warnings)
        validate_dashboard_refs(sources, errors)

    if args.strict and warnings:
        errors.extend({"path": w["path"], "message": "strict: " + w["message"]} for w in warnings)

    report = {"ok": not errors, "errors": errors, "warnings": warnings}
    if args.json:
        print(json.dumps(report, indent=2))
    else:
        for item in errors:
            print(f"ERROR {item['path']}: {item['message']}", file=sys.stderr)
        for item in warnings:
            print(f"WARN  {item['path']}: {item['message']}")
        if errors:
            print(f"\nvalidation failed: {len(errors)} error(s), {len(warnings)} warning(s)", file=sys.stderr)
        else:
            print(f"validation ok: {len(warnings)} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
