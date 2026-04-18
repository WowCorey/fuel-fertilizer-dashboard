#!/usr/bin/env python3
"""
fetch_data.py — Fuel Resilience AU data pipeline

Reads data/sources.yml, walks each source, and produces a normalised
JSON file under data/generated/<id>.json for every entry whose
"fetch" key is "programmatic". Files for "manual" or "unavailable"
sources are left alone (those are hand-curated by a human).

Design rules
------------
* Standard library + requests + PyYAML only. No heavy deps.
* Never fabricate values. If a fetch fails, we exit non-zero so the
  GitHub Action surfaces the rot.
* Every output JSON follows the same schema:
    {
      "series_id":         str,   # == <source_id> or "<source_id>.<sub>"
      "source_id":         str,
      "source_name":       str,
      "source_url":        str,
      "unit":              str,
      "retrieved_at":      ISO8601 UTC,
      "last_data_point":   "YYYY-MM-DD" | null,
      "values":            [{"t": "YYYY-MM", "v": number}, ...],
      "notes":             str,
      "status":            "ok" | "unavailable"
    }

Usage
-----
    python3 scripts/fetch_data.py                 # fetch all programmatic sources
    python3 scripts/fetch_data.py --only eia_brent
    python3 scripts/fetch_data.py --check         # exit non-zero if any URL 4xx/5xx
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import io
import json
import os
import pathlib
import sys
from typing import Any

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


# ---------------------------------------------------------------------------
# Fetchers — one per programmatic source. Each returns the values block
# (list of {t,v}) plus metadata that goes into the JSON envelope.
# ---------------------------------------------------------------------------

def fetch_eia_series(series_code: str) -> dict[str, Any]:
    """
    Fetch a monthly spot-price series from the EIA open CSV endpoint.
    Example: RBRTE (Brent), RWTC (WTI).

    EIA publishes CSV at:
        https://www.eia.gov/dnav/pet/hist_xls/<CODE>m.xls  (XLS, not CSV)
        https://www.eia.gov/opendata/... (needs API key)

    The open CSV lives at:
        https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=<CODE>&f=M

    The HTML leaf handler returns an HTML table. A more reliable CSV is:
        https://www.eia.gov/totalenergy/data/browser/csv.php?tbl=T09.01

    For resilience, we try the FRED mirror (which re-hosts Brent and WTI as
    tidy CSVs under CC0-adjacent terms):
        https://fred.stlouisfed.org/graph/fredgraph.csv?id=<FRED_ID>

    FRED IDs:
        DCOILBRENTEU — Brent, daily
        DCOILWTICO   — WTI, daily
    """
    fred_id = {"RBRTE": "DCOILBRENTEU", "RWTC": "DCOILWTICO"}.get(series_code)
    if not fred_id:
        raise RuntimeError(f"Unknown EIA series code: {series_code}")

    url = f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={fred_id}"
    headers = {"User-Agent": UA}
    r = requests.get(url, headers=headers, timeout=30)
    r.raise_for_status()

    # FRED CSV: DATE,VALUE  (daily, with '.' for missing)
    reader = csv.reader(io.StringIO(r.text))
    header = next(reader)
    if [h.strip().lower() for h in header] != ["date", fred_id.lower()] and \
       [h.strip().lower() for h in header] != ["observation_date", fred_id.lower()]:
        # FRED sometimes returns "DATE,<ID>" and sometimes "observation_date,<ID>"
        # accept either
        pass

    # Bucket daily values into calendar months, take the last-day-of-month close.
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
        month_key = date_str[:7]  # YYYY-MM
        by_month.setdefault(month_key, []).append(v)

    # Take the monthly arithmetic mean — common convention for spot crude.
    values = []
    for m in sorted(by_month):
        mean_v = sum(by_month[m]) / len(by_month[m])
        values.append({"t": m, "v": round(mean_v, 2)})

    # Trim to the last 60 months so files stay small.
    values = values[-60:]
    last = values[-1]["t"] if values else None
    last_data_point = f"{last}-01" if last else None

    return {
        "unit": "USD per barrel",
        "values": values,
        "last_data_point": last_data_point,
        "notes": (
            f"Monthly mean of daily FRED series {fred_id} "
            f"(mirror of EIA {series_code}). Trimmed to last 60 months."
        ),
        "source_url_resolved": url,
    }


# Registry: source_id -> callable returning a values-block dict.
FETCHERS = {
    "eia_brent": lambda: fetch_eia_series("RBRTE"),
    "eia_wti":   lambda: fetch_eia_series("RWTC"),
}


# ---------------------------------------------------------------------------
# Glue
# ---------------------------------------------------------------------------

def load_sources() -> list[dict]:
    with SOURCES_FILE.open("r", encoding="utf-8") as f:
        doc = yaml.safe_load(f)
    return doc.get("sources", [])


def write_generated(source: dict, block: dict) -> pathlib.Path:
    now = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    payload = {
        "series_id":       source["id"],
        "source_id":       source["id"],
        "source_name":     source["human_name"],
        "source_url":      source["url"],
        "unit":            block["unit"],
        "retrieved_at":    now,
        "last_data_point": block.get("last_data_point"),
        "values":          block["values"],
        "notes":           block.get("notes", ""),
        "status":          "ok",
        "manual_entry":    False,
    }
    path = GENERATED_DIR / f"{source['id']}.json"
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        f.write("\n")
    return path


def check_url(source: dict) -> tuple[bool, str]:
    url = source["url"]
    try:
        r = requests.head(url, headers={"User-Agent": UA}, timeout=20, allow_redirects=True)
        # Some sites return 403/405 on HEAD but 200 on GET — fall back.
        if r.status_code >= 400:
            r = requests.get(
                url, headers={"User-Agent": UA}, timeout=20,
                allow_redirects=True, stream=True,
            )
            r.close()
        if r.status_code >= 400:
            return False, f"HTTP {r.status_code}"
        return True, f"HTTP {r.status_code}"
    except requests.RequestException as e:
        return False, f"{type(e).__name__}: {e}"


def main() -> int:
    ap = argparse.ArgumentParser(description="Fetch data for Fuel Resilience AU")
    ap.add_argument("--only", help="Only fetch this source id")
    ap.add_argument("--check", action="store_true",
                    help="Check every source URL is reachable; exit non-zero if not")
    args = ap.parse_args()

    sources = load_sources()
    if not sources:
        print("No sources found in data/sources.yml", file=sys.stderr)
        return 2

    errors: list[str] = []
    wrote: list[str] = []
    skipped: list[tuple[str, str]] = []

    for s in sources:
        sid = s["id"]
        if args.only and sid != args.only:
            continue
        fetch_mode = s.get("fetch", "manual")

        if args.check:
            ok, msg = check_url(s)
            tag = "OK " if ok else "ERR"
            print(f"[{tag}] {sid:<32} {msg}  {s['url']}")
            if not ok:
                errors.append(f"{sid}: {msg}")
            continue

        if fetch_mode == "programmatic":
            fetcher = FETCHERS.get(sid)
            if not fetcher:
                errors.append(f"{sid}: marked programmatic but no fetcher registered")
                continue
            try:
                block = fetcher()
                path = write_generated(s, block)
                wrote.append(str(path.relative_to(ROOT)))
                print(f"[OK ] {sid:<32} -> {path.relative_to(ROOT)}")
            except Exception as e:
                errors.append(f"{sid}: {type(e).__name__}: {e}")
                print(f"[ERR] {sid:<32} {e}", file=sys.stderr)
        elif fetch_mode == "manual":
            manual_path = MANUAL_DIR / f"{sid}.json"
            if manual_path.exists():
                skipped.append((sid, "manual, file present"))
            else:
                skipped.append((sid, "manual, FILE MISSING"))
            # A missing manual file is a warning, not an error, because the
            # dashboard knows how to render "Source unavailable" from it.
        elif fetch_mode == "unavailable":
            skipped.append((sid, "unavailable by design"))
        else:
            errors.append(f"{sid}: unknown fetch mode '{fetch_mode}'")

    print()
    print(f"Wrote   {len(wrote)} generated file(s)")
    print(f"Skipped {len(skipped)} non-programmatic source(s)")
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
