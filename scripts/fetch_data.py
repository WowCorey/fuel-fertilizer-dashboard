#!/usr/bin/env python3
"""
fetch_data.py — Fuel Resilience AU data pipeline

Reads data/sources.yml, walks each source, and produces a normalised JSON file
under data/generated/<id>.json for every entry whose "fetch" key is
"programmatic". Files for "manual" or "unavailable" sources are left alone.

Design rules
------------
* Standard library + requests + PyYAML only. No heavy deps.
* Never fabricate values. If a programmatic fetch fails, exit non-zero.
* Blocking URL checks apply only to programmatic fetch_url endpoints.
* Broad source landing-page link health is available as a separate, non-blocking
  report mode for CI/workflow logs.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import io
import json
import pathlib
import sys
import urllib.parse
from typing import Any, Callable

try:
    import yaml
except ImportError:
    sys.stderr.write("PyYAML is required. Install with: pip install pyyaml\n")
    sys.exit(2)

try:
    import requests
except ImportError:
    sys.stderr.write("requests is required. Install with: pip install requests\n")
    sys.exit(2)

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES_FILE = ROOT / "data" / "sources.yml"
GENERATED_DIR = ROOT / "data" / "generated"
MANUAL_DIR = ROOT / "data" / "manual"

UA = "FuelResilienceAU-DataBot/1.0 (+https://github.com/WowCorey/fuel-fertilizer-dashboard)"


def fetch_eia_series(series_code: str, url: str | None = None) -> dict[str, Any]:
    """Fetch a daily EIA crude spot-price series via the FRED CSV mirror."""
    fred_id = {"RBRTE": "DCOILBRENTEU", "RWTC": "DCOILWTICO"}.get(series_code)
    if not fred_id:
        raise RuntimeError(f"Unknown EIA series code: {series_code}")

    url = url or f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={fred_id}"
    r = requests.get(url, headers={"User-Agent": UA}, timeout=30)
    r.raise_for_status()

    reader = csv.reader(io.StringIO(r.text))
    try:
        header = next(reader)
    except StopIteration as exc:
        raise RuntimeError("FRED CSV was empty") from exc

    normalized_header = [h.strip().lower() for h in header]
    accepted_headers = [["date", fred_id.lower()], ["observation_date", fred_id.lower()]]
    if normalized_header not in accepted_headers:
        raise RuntimeError(f"Unexpected FRED CSV header: {header!r}")

    by_month: dict[str, list[float]] = {}
    for row in reader:
        if len(row) < 2:
            continue
        date_str, val_str = row[0], row[1]
        if val_str in ("", "."):
            continue
        try:
            v = float(val_str)
        except ValueError:
            continue
        month_key = date_str[:7]
        by_month.setdefault(month_key, []).append(v)

    values = []
    for month in sorted(by_month):
        mean_v = sum(by_month[month]) / len(by_month[month])
        values.append({"t": month, "v": round(mean_v, 2)})

    values = values[-60:]
    if not values:
        raise RuntimeError(f"No numeric observations found in {fred_id}")

    last = values[-1]["t"]
    return {
        "unit": "USD per barrel",
        "values": values,
        "last_data_point": f"{last}-01",
        "notes": (
            f"Monthly mean of daily FRED series {fred_id} "
            f"(mirror of EIA {series_code}). Trimmed to last 60 months."
        ),
        "source_url_resolved": url,
    }


def fetch_abs_sdmx(dataflow: str, key: str, start_period: str | None = None) -> dict[str, Any]:
    """Fetch one ABS SDMX-JSON time series from the ABS Data API."""
    if not dataflow or not key:
        raise RuntimeError("ABS SDMX fetch requires dataflow and key")

    query = {"format": "jsondata"}
    if start_period:
        query["startPeriod"] = start_period
    url = f"https://api.data.abs.gov.au/data/{dataflow}/{key}?{urllib.parse.urlencode(query)}"

    r = requests.get(
        url,
        headers={
            "User-Agent": UA,
            "Accept": "application/vnd.sdmx.data+json",
        },
        timeout=45,
    )
    r.raise_for_status()

    try:
        doc = r.json()
    except ValueError as exc:
        raise RuntimeError("ABS SDMX response was not valid JSON") from exc

    data_node = doc.get("data", doc)
    data_sets = data_node.get("dataSets")
    structures = data_node.get("structures")
    structure = doc.get("structure")
    if structure is None and isinstance(structures, list) and structures:
        structure = structures[0]

    if not isinstance(data_sets, list) or not data_sets:
        raise RuntimeError("ABS SDMX response contained no dataSets")
    if not isinstance(structure, dict):
        raise RuntimeError("ABS SDMX response contained no usable structure")

    data_set = data_sets[0]
    series = data_set.get("series")
    if not isinstance(series, dict) or not series:
        raise RuntimeError("ABS SDMX response contained no series")
    non_empty_series = [
        item for item in series.values()
        if isinstance(item, dict) and item.get("observations")
    ]
    if not non_empty_series:
        raise RuntimeError("ABS SDMX response contained no observations")
    if len(non_empty_series) != 1:
        raise RuntimeError(f"ABS SDMX key returned {len(non_empty_series)} series; expected exactly one")

    dimensions = structure.get("dimensions")
    if not isinstance(dimensions, dict):
        raise RuntimeError("ABS SDMX structure contained no dimensions")
    obs_dimensions = dimensions.get("observation")
    if not isinstance(obs_dimensions, list) or not obs_dimensions:
        raise RuntimeError("ABS SDMX structure contained no observation dimensions")
    time_values = obs_dimensions[0].get("values")
    if not isinstance(time_values, list) or not time_values:
        raise RuntimeError("ABS SDMX structure contained no time values")

    values: list[dict[str, Any]] = []
    period_ends: dict[str, str] = {}
    observations = non_empty_series[0].get("observations", {})
    for obs_idx, obs in observations.items():
        try:
            time_value = time_values[int(obs_idx)]
        except (ValueError, IndexError) as exc:
            raise RuntimeError(f"ABS SDMX observation index {obs_idx!r} has no matching time period") from exc
        if not isinstance(obs, list) or not obs:
            continue
        raw_value = obs[0]
        if raw_value is None:
            continue
        if isinstance(raw_value, bool) or not isinstance(raw_value, (int, float)):
            raise RuntimeError(f"ABS SDMX observation for {time_value.get('id')} was not numeric")
        period = time_value.get("id") or time_value.get("name")
        if not isinstance(period, str) or not period:
            raise RuntimeError("ABS SDMX time value was missing an id")
        period_end = time_value.get("end")
        if isinstance(period_end, str) and len(period_end) >= 10:
            period_ends[period] = period_end[:10]
        values.append({"t": period, "v": raw_value})

    values = sorted(values, key=lambda point: point["t"])[-60:]
    if not values:
        raise RuntimeError("ABS SDMX response contained no numeric observations")

    def attr_label(attr_id: str) -> str | None:
        attrs = structure.get("attributes", {})
        if not isinstance(attrs, dict):
            return None
        for group in ("dataSet", "series", "observation"):
            for attr in attrs.get(group, []) or []:
                if attr.get("id") != attr_id:
                    continue
                attr_values = attr.get("values") or []
                if not attr_values:
                    return None
                value_id = str(attr_values[0].get("id", "")).strip()
                value_name = str(attr_values[0].get("name", "")).strip()
                return value_id or value_name or None
        return None

    unit_measure = attr_label("UNIT_MEASURE") or "AUD"
    unit_mult = attr_label("UNIT_MULT")
    unit = unit_measure
    if unit_measure == "AUD" and unit_mult == "3":
        unit = "AUD thousands"
    elif unit_mult:
        unit = f"{unit_measure} (unit multiplier {unit_mult})"

    last = values[-1]["t"]
    last_data_point = period_ends.get(last) or (f"{last}-01" if len(last) == 7 else last)
    return {
        "unit": unit,
        "values": values,
        "last_data_point": last_data_point,
        "notes": (
            f"Fetched from ABS Data API dataflow {dataflow}, key {key}. "
            "Values are sorted by TIME_PERIOD and trimmed to the last 60 monthly observations. "
            "ABS MERCH_IMP is a SITC commodity dataflow; this source uses SITC 33 "
            "(petroleum, petroleum products and related materials) because the live API "
            "does not expose an HS 27 monthly value series in this dataflow."
        ),
        "source_url_resolved": url,
    }


Fetcher = Callable[[dict[str, Any]], dict[str, Any]]
FETCHERS: dict[str, Fetcher] = {
    "eia_brent": lambda source: fetch_eia_series("RBRTE", source.get("fetch_url")),
    "eia_wti": lambda source: fetch_eia_series("RWTC", source.get("fetch_url")),
    "abs_petroleum_imports": lambda source: fetch_abs_sdmx(
        source["fetch_dataflow"], source["fetch_key"], source.get("fetch_start_period")
    ),
}


def load_sources() -> list[dict[str, Any]]:
    with SOURCES_FILE.open("r", encoding="utf-8") as f:
        doc = yaml.safe_load(f)
    return doc.get("sources", [])


def write_generated(source: dict[str, Any], block: dict[str, Any]) -> pathlib.Path:
    now = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    payload = {
        "series_id": source["id"],
        "source_id": source["id"],
        "source_name": source["human_name"],
        "source_url": source.get("canonical_url") or source["url"],
        "unit": block["unit"],
        "retrieved_at": now,
        "last_data_point": block.get("last_data_point"),
        "values": block["values"],
        "notes": block.get("notes", ""),
        "status": "ok",
        "manual_entry": False,
    }
    if source.get("rights"):
        payload["source_rights"] = source["rights"]
    if source.get("citation"):
        payload["citation"] = source["citation"]

    path = GENERATED_DIR / f"{source['id']}.json"
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        f.write("\n")
    return path


def check_url(url: str) -> tuple[bool, str]:
    try:
        r = requests.head(url, headers={"User-Agent": UA}, timeout=20, allow_redirects=True)
        if r.status_code >= 400:
            r = requests.get(url, headers={"User-Agent": UA}, timeout=20, allow_redirects=True, stream=True)
            r.close()
        if r.status_code >= 400:
            return False, f"HTTP {r.status_code}"
        return True, f"HTTP {r.status_code}"
    except requests.RequestException as e:
        return False, f"{type(e).__name__}: {e}"


def source_check_url(source: dict[str, Any], *, all_links: bool) -> str:
    if all_links:
        return source.get("canonical_url") or source["url"]
    return source.get("fetch_url") or source.get("canonical_url") or source["url"]


def main() -> int:
    ap = argparse.ArgumentParser(description="Fetch data for Fuel Resilience AU")
    ap.add_argument("--only", help="Only fetch this source id")
    ap.add_argument("--check", action="store_true", help="Check programmatic fetch URLs only")
    ap.add_argument("--check-all-links", action="store_true", help="Check every canonical source URL")
    args = ap.parse_args()

    sources = load_sources()
    if not sources:
        print("No sources found in data/sources.yml", file=sys.stderr)
        return 2

    errors: list[str] = []
    wrote: list[str] = []
    skipped: list[tuple[str, str]] = []

    for source in sources:
        sid = source["id"]
        if args.only and sid != args.only:
            continue
        fetch_mode = source.get("fetch", "manual")

        if args.check or args.check_all_links:
            if args.check and fetch_mode != "programmatic":
                skipped.append((sid, "not programmatic; skipped blocking fetch check"))
                continue
            url = source_check_url(source, all_links=args.check_all_links)
            ok, msg = check_url(url)
            tag = "OK " if ok else "ERR"
            print(f"[{tag}] {sid:<32} {msg}  {url}")
            if not ok:
                errors.append(f"{sid}: {msg}")
            continue

        if fetch_mode == "programmatic":
            fetcher = FETCHERS.get(sid)
            if not fetcher:
                errors.append(f"{sid}: marked programmatic but no fetcher registered")
                continue
            try:
                block = fetcher(source)
                path = write_generated(source, block)
                wrote.append(str(path.relative_to(ROOT)))
                print(f"[OK ] {sid:<32} -> {path.relative_to(ROOT)}")
            except Exception as e:
                errors.append(f"{sid}: {type(e).__name__}: {e}")
                print(f"[ERR] {sid:<32} {e}", file=sys.stderr)
        elif fetch_mode == "manual":
            manual_path = MANUAL_DIR / f"{sid}.json"
            skipped.append((sid, "manual, file present" if manual_path.exists() else "manual, FILE MISSING"))
        elif fetch_mode == "unavailable":
            skipped.append((sid, "unavailable by design"))
        else:
            errors.append(f"{sid}: unknown fetch mode '{fetch_mode}'")

    print()
    print(f"Wrote   {len(wrote)} generated file(s)")
    print(f"Skipped {len(skipped)} source(s)")
    for sid, why in skipped:
        print(f"        - {sid}: {why}")

    if errors:
        print()
        print(f"ERRORS ({len(errors)}):", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
