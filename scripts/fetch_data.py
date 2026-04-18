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
import os
import pathlib
import re
import sys
import urllib.parse
import xml.etree.ElementTree as ET
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


def fetch_abs_petroleum_imports_yoy(source: dict[str, Any]) -> dict[str, Any]:
    """Derive YoY percentage change from the generated ABS petroleum imports envelope."""
    parent_id = source.get("derived_from") or "abs_petroleum_imports"
    parent_path = GENERATED_DIR / f"{parent_id}.json"
    if not parent_path.exists():
        raise RuntimeError(f"Cannot derive {source['id']}; missing {parent_path.relative_to(ROOT)}")

    with parent_path.open("r", encoding="utf-8") as f:
        parent = json.load(f)

    if parent.get("status") != "ok":
        raise RuntimeError(f"Cannot derive {source['id']}; parent {parent_id} status is not ok")
    parent_values = parent.get("values")
    if not isinstance(parent_values, list) or len(parent_values) < 13:
        raise RuntimeError(f"Cannot derive {source['id']}; parent {parent_id} has fewer than 13 observations")

    by_month: dict[str, float] = {}
    for point in parent_values:
        if not isinstance(point, dict):
            continue
        t = point.get("t")
        v = point.get("v")
        if isinstance(t, str) and isinstance(v, (int, float)) and not isinstance(v, bool):
            by_month[t] = float(v)

    values: list[dict[str, Any]] = []
    for month in sorted(by_month):
        try:
            current_month = dt.date.fromisoformat(f"{month}-01")
        except ValueError:
            continue
        prior_year = current_month.year - 1
        prior_month = f"{prior_year:04d}-{current_month.month:02d}"
        previous = by_month.get(prior_month)
        if previous in (None, 0):
            continue
        yoy = (by_month[month] - previous) / previous * 100
        values.append({"t": month, "v": round(yoy, 1)})

    if not values:
        raise RuntimeError(f"Cannot derive {source['id']}; no comparable year-on-year observations")

    return {
        "unit": "%",
        "values": values[-60:],
        "last_data_point": parent.get("last_data_point"),
        "notes": (
            "Derived from abs_petroleum_imports by comparing each month to the same month one year earlier. "
            "Source: ABS International Merchandise Trade."
        ),
        "source_url_resolved": parent.get("source_url"),
    }


def fetch_rba_f11(url: str) -> dict[str, Any]:
    """Fetch RBA Table F11.1 CSV and return monthly mean AUD/USD values."""
    r = requests.get(url, headers={"User-Agent": UA}, timeout=45)
    r.raise_for_status()

    reader = list(csv.reader(io.StringIO(r.content.decode("utf-8-sig"))))
    if len(reader) < 12:
        raise RuntimeError("RBA F11.1 CSV was too short")

    header_idx = None
    usd_col = None
    for idx, row in enumerate(reader):
        if row and row[0] == "Title":
            header_idx = idx
            try:
                usd_col = row.index("A$1=USD")
            except ValueError as exc:
                raise RuntimeError("RBA F11.1 CSV did not contain A$1=USD column") from exc
            break
    if header_idx is None or usd_col is None:
        raise RuntimeError("RBA F11.1 CSV did not contain a Title header row")

    data_start = None
    for idx, row in enumerate(reader[header_idx + 1 :], start=header_idx + 1):
        if row and row[0] == "Series ID":
            data_start = idx + 1
            break
    if data_start is None:
        raise RuntimeError("RBA F11.1 CSV did not contain a Series ID row")

    by_month: dict[str, list[float]] = {}
    latest_date: dt.date | None = None
    for row in reader[data_start:]:
        if len(row) <= usd_col or not row or not row[0].strip():
            continue
        try:
            obs_date = dt.datetime.strptime(row[0].strip(), "%d-%b-%Y").date()
            value = float(row[usd_col])
        except (ValueError, TypeError):
            continue
        latest_date = max(latest_date, obs_date) if latest_date else obs_date
        by_month.setdefault(obs_date.strftime("%Y-%m"), []).append(value)

    values = [
        {"t": month, "v": round(sum(month_values) / len(month_values), 4)}
        for month, month_values in sorted(by_month.items())
        if month_values
    ][-60:]
    if not values or latest_date is None:
        raise RuntimeError("RBA F11.1 CSV contained no numeric AUD/USD observations")

    return {
        "unit": "USD per AUD",
        "values": values,
        "last_data_point": latest_date.isoformat(),
        "notes": "Monthly mean of daily AUD/USD observations from RBA Table F11.1. Trimmed to last 60 months.",
        "source_url_resolved": url,
    }


def warn_skip(label: str, message: str) -> None:
    print(f"[WARN] {label}: {message}", file=sys.stderr)


def retail_result(state: str, prices: list[float], source_date: str, detail: str) -> dict[str, Any] | None:
    prices = [p for p in prices if p > 0]
    if not prices:
        return None
    return {
        "state": state,
        "average": round(sum(prices) / len(prices), 1),
        "stations": len(prices),
        "date": source_date,
        "detail": detail,
    }


def fetch_wa_fuelwatch(url: str) -> dict[str, Any] | None:
    try:
        r = requests.get(url, headers={"User-Agent": UA}, timeout=45)
        if r.status_code != 200:
            warn_skip("WA FuelWatch", f"HTTP {r.status_code}")
            return None
        root = ET.fromstring(r.content)
    except Exception as exc:
        warn_skip("WA FuelWatch", f"{type(exc).__name__}: {exc}")
        return None

    prices: list[float] = []
    dates: set[str] = set()
    for item in root.findall("./channel/item"):
        price_text = item.findtext("price")
        date_text = item.findtext("date")
        try:
            price = float(price_text) if price_text is not None else None
        except ValueError:
            continue
        if price is None:
            continue
        prices.append(price)
        if date_text:
            dates.add(date_text)

    source_date = sorted(dates)[-1] if dates else dt.datetime.now(dt.timezone.utc).date().isoformat()
    return retail_result("WA", prices, source_date, "FuelWatch ULP 91 RSS feed")


def latest_qld_resource(package_id: str, ckan_base: str) -> dict[str, Any] | None:
    url = f"{ckan_base.rstrip('/')}/api/3/action/package_show?id={urllib.parse.quote(package_id)}"
    try:
        r = requests.get(url, headers={"User-Agent": UA}, timeout=45)
        if r.status_code != 200:
            warn_skip("QLD Fuel Prices", f"package_show HTTP {r.status_code}")
            return None
        package = r.json().get("result", {})
    except Exception as exc:
        warn_skip("QLD Fuel Prices", f"package lookup {type(exc).__name__}: {exc}")
        return None

    month_names = {
        "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6,
        "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12,
    }
    candidates: list[tuple[tuple[int, int], dict[str, Any]]] = []
    for resource in package.get("resources", []):
        if str(resource.get("format", "")).upper() != "CSV" or not resource.get("datastore_active"):
            continue
        text = f"{resource.get('name', '')} {resource.get('url', '')}".lower()
        year = None
        month = None
        if found := re.search(r"20\d{2}[-_](\d{2})", text):
            year_match = re.search(r"(20\d{2})[-_]\d{2}", text)
            if year_match:
                year = int(year_match.group(1))
                month = int(found.group(1))
        if year is None:
            if year_match := re.search(r"20\d{2}", text):
                year = int(year_match.group(0))
            for name, value in month_names.items():
                if name in text:
                    month = value
                    break
        if year and month:
            candidates.append(((year, month), resource))

    if not candidates:
        warn_skip("QLD Fuel Prices", "no datastore-backed monthly CSV resource found")
        return None
    return sorted(candidates, key=lambda item: item[0])[-1][1]


def fetch_qld_open_data(ckan_base: str, package_id: str) -> dict[str, Any] | None:
    resource = latest_qld_resource(package_id, ckan_base)
    if not resource:
        return None
    rid = resource.get("id")
    if not rid:
        warn_skip("QLD Fuel Prices", "latest resource did not have an id")
        return None

    sql = (
        f'SELECT "SiteId", "Price", "TransactionDateutc" FROM "{rid}" '
        'WHERE "Fuel_Type"=\'Unleaded\' AND "Price" < 9999'
    )
    url = f"{ckan_base.rstrip('/')}/api/3/action/datastore_search_sql?{urllib.parse.urlencode({'sql': sql})}"
    try:
        r = requests.get(url, headers={"User-Agent": UA}, timeout=60)
        if r.status_code != 200:
            warn_skip("QLD Fuel Prices", f"datastore_search_sql HTTP {r.status_code}")
            return None
        records = r.json().get("result", {}).get("records", [])
    except Exception as exc:
        warn_skip("QLD Fuel Prices", f"datastore query {type(exc).__name__}: {exc}")
        return None

    latest_by_site: dict[str, tuple[str, float]] = {}
    for record in records:
        site_id = str(record.get("SiteId", "")).strip()
        date_text = str(record.get("TransactionDateutc", "")).strip()
        try:
            price = float(record.get("Price")) / 10
        except (TypeError, ValueError):
            continue
        if not site_id or not date_text:
            continue
        previous = latest_by_site.get(site_id)
        if previous is None or date_text > previous[0]:
            latest_by_site[site_id] = (date_text, price)

    if not latest_by_site:
        warn_skip("QLD Fuel Prices", "latest public dataset contained no Unleaded prices")
        return None
    latest_date = max(date_text[:10] for date_text, _ in latest_by_site.values())
    detail = f"Queensland Open Data latest public monthly file: {resource.get('name', rid)}"
    return retail_result("QLD", [price for _, price in latest_by_site.values()], latest_date, detail)


def fetch_nsw_fuelcheck(url: str) -> dict[str, Any] | None:
    token = os.environ.get("NSW_FUELCHECK_API_KEY", "").strip()
    if not token:
        warn_skip("NSW FuelCheck", "NSW_FUELCHECK_API_KEY is not set")
        return None
    try:
        r = requests.get(
            url,
            headers={
                "User-Agent": UA,
                "Authorization": f"Bearer {token}",
                "apikey": token,
                "Accept": "application/json",
            },
            timeout=45,
        )
        if r.status_code != 200:
            warn_skip("NSW FuelCheck", f"HTTP {r.status_code}")
            return None
        doc = r.json()
    except Exception as exc:
        warn_skip("NSW FuelCheck", f"{type(exc).__name__}: {exc}")
        return None

    prices: list[float] = []
    dates: set[str] = set()
    price_nodes = doc.get("prices") or doc.get("Prices") or doc.get("fuelPrices") or []
    if isinstance(price_nodes, dict):
        price_nodes = list(price_nodes.values())
    for item in price_nodes if isinstance(price_nodes, list) else []:
        if not isinstance(item, dict):
            continue
        fuel_type = str(item.get("fueltype") or item.get("fuelType") or item.get("FuelType") or "").upper()
        if fuel_type and fuel_type not in {"U91", "ULP", "UNLEADED", "REGULAR UNLEADED"}:
            continue
        try:
            price = float(item.get("price") or item.get("Price"))
        except (TypeError, ValueError):
            continue
        if price > 0:
            prices.append(price)
        date_text = item.get("lastupdated") or item.get("lastUpdated") or item.get("TransactionDateUtc")
        if isinstance(date_text, str) and len(date_text) >= 10:
            dates.add(date_text[:10])

    source_date = sorted(dates)[-1] if dates else dt.datetime.now(dt.timezone.utc).date().isoformat()
    return retail_result("NSW", prices, source_date, "NSW FuelCheck API")


def fetch_retail_multistate(source: dict[str, Any]) -> dict[str, Any]:
    today = dt.datetime.now(dt.timezone(dt.timedelta(hours=10))).date().isoformat()
    contributors = [
        fetch_nsw_fuelcheck(source.get("nsw_fetch_url", "https://api.onegov.nsw.gov.au/FuelPriceCheck/v2/fuel/prices")),
        fetch_qld_open_data(
            source.get("qld_ckan_base", "https://www.data.qld.gov.au"),
            source.get("qld_package_id", f"fuel-price-reporting-{today[:4]}"),
        ),
        fetch_wa_fuelwatch(source.get("wa_fetch_url", "https://www.fuelwatch.wa.gov.au/fuelwatch/fuelWatchRSS?Product=1&Day=today")),
    ]
    states = [state for state in contributors if state]
    if not states:
        return {
            "status": "unavailable",
            "unit": "cents per litre",
            "values": [],
            "last_data_point": None,
            "notes": "No public state retail fuel feed returned usable ULP 91 observations during this fetch.",
            "extra": {
                "schema": "retail_fuel_multistate.v1",
                "fields": {"states": [], "skipped": ["NSW", "QLD", "WA"]},
            },
        }

    total_stations = sum(state["stations"] for state in states)
    weighted = sum(state["average"] * state["stations"] for state in states) / total_stations
    labels = [
        f"{state['state']}: {state['stations']} stations, avg {state['average']} c/L, source date {state['date']}"
        for state in states
    ]
    return {
        "unit": "cents per litre",
        "values": [{"t": today, "v": round(weighted, 1)}],
        "last_data_point": today,
        "notes": (
            "Multi-state ULP 91 average weighted by station count. "
            + "; ".join(labels)
            + ". NSW contributes only when NSW_FUELCHECK_API_KEY is configured."
        ),
        "extra": {
            "schema": "retail_fuel_multistate.v1",
            "fields": {"states": states},
        },
    }


Fetcher = Callable[[dict[str, Any]], dict[str, Any]]
FETCHERS: dict[str, Fetcher] = {
    "eia_brent": lambda source: fetch_eia_series("RBRTE", source.get("fetch_url")),
    "eia_wti": lambda source: fetch_eia_series("RWTC", source.get("fetch_url")),
    "abs_petroleum_imports": lambda source: fetch_abs_sdmx(
        source["fetch_dataflow"], source["fetch_key"], source.get("fetch_start_period")
    ),
    "abs_petroleum_imports_yoy": fetch_abs_petroleum_imports_yoy,
    "rba_aud_usd": lambda source: fetch_rba_f11(source["fetch_url"]),
    "aus_retail_fuel_multistate": fetch_retail_multistate,
}


def load_sources() -> list[dict[str, Any]]:
    with SOURCES_FILE.open("r", encoding="utf-8") as f:
        doc = yaml.safe_load(f)
    return doc.get("sources", [])


def write_generated(source: dict[str, Any], block: dict[str, Any]) -> pathlib.Path:
    now = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    status = block.get("status", "ok")
    payload = {
        "series_id": source["id"],
        "source_id": source["id"],
        "source_name": source["human_name"],
        "source_url": source.get("canonical_url") or source["url"],
        "unit": block["unit"],
        "retrieved_at": now if status == "ok" else None,
        "last_data_point": block.get("last_data_point"),
        "values": block["values"],
        "notes": block.get("notes", ""),
        "status": status,
        "manual_entry": False,
    }
    if source.get("rights"):
        payload["source_rights"] = source["rights"]
    if source.get("citation"):
        payload["citation"] = source["citation"]
    if block.get("extra") is not None:
        payload["extra"] = block["extra"]

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

    derived_by_parent: dict[str, list[dict[str, Any]]] = {}
    for source in sources:
        if source.get("fetch") == "derived" and source.get("derived_from"):
            derived_by_parent.setdefault(source["derived_from"], []).append(source)

    wrote_ids: set[str] = set()

    def fetch_and_write(source: dict[str, Any]) -> None:
        sid = source["id"]
        if sid in wrote_ids:
            return
        fetcher = FETCHERS.get(sid)
        if not fetcher:
            errors.append(f"{sid}: marked {source.get('fetch')} but no fetcher registered")
            return
        try:
            block = fetcher(source)
            path = write_generated(source, block)
            wrote_ids.add(sid)
            wrote.append(str(path.relative_to(ROOT)))
            print(f"[OK ] {sid:<32} -> {path.relative_to(ROOT)}")
        except Exception as e:
            errors.append(f"{sid}: {type(e).__name__}: {e}")
            print(f"[ERR] {sid:<32} {e}", file=sys.stderr)

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

        if fetch_mode in {"programmatic", "derived"}:
            fetch_and_write(source)
            if fetch_mode == "programmatic":
                for derived in derived_by_parent.get(sid, []):
                    fetch_and_write(derived)
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
