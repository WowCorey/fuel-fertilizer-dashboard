#!/usr/bin/env python3
"""Download source corpus and generate structure manifests.

Targets: APS, ATO, ACCC, and company report sources.
Outputs:
  - data/raw/<source_id>/<YYYYMMDD>/source.<ext>
  - data/corpus_manifests/<source_id>.json
"""

from __future__ import annotations

import datetime as dt
import hashlib
import io
import json
import pathlib
import re
import urllib.parse
from typing import Any

import requests
import yaml

try:
    import openpyxl
except ImportError:
    openpyxl = None

try:
    import pdfplumber
except ImportError:
    pdfplumber = None

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES_FILE = ROOT / "data" / "sources.yml"
RAW_DIR = ROOT / "data" / "raw"
MANIFEST_DIR = ROOT / "data" / "corpus_manifests"

UA = "FuelResilienceAU-CorpusBot/1.0 (+https://github.com/WowCorey/fuel-fertilizer-dashboard)"
TIMEOUT = 25
RETRY = 2

TARGET_IDS = {
    "aps_monthly",
    "aps_production_petrol",
    "aps_production_diesel",
    "aps_production_jet",
    "aps_production_fuel_oil",
    "aps_refinery_utilisation",
    "ato_corporate_tax",
    "accc_petroleum_monitoring",
    "accc_petrol_wholesale_component",
    "accc_petrol_excise_component",
    "accc_petrol_gst_component",
    "accc_petrol_retail_margin_component",
    "accc_petrol_breakdown_series",
    "company_exxonmobil_au",
    "company_chevron_au",
    "company_viva_energy",
    "company_ampol",
    "company_bp_au",
    "company_shell_au",
    "company_woodside",
    "company_santos",
}

SOURCE_URL_OVERRIDES = {
    "aps_monthly": "https://www.data.gov.au/data/dataset/australian-petroleum-statistics",
    "aps_production_petrol": "https://www.data.gov.au/data/dataset/australian-petroleum-statistics",
    "aps_production_diesel": "https://www.data.gov.au/data/dataset/australian-petroleum-statistics",
    "aps_production_jet": "https://www.data.gov.au/data/dataset/australian-petroleum-statistics",
    "aps_production_fuel_oil": "https://www.data.gov.au/data/dataset/australian-petroleum-statistics",
    "aps_refinery_utilisation": "https://www.data.gov.au/data/dataset/australian-petroleum-statistics",
    "ato_corporate_tax": "https://data.gov.au/data/dataset/c2524c87-cea4-4636-acac-599a82048a26",
    "accc_petroleum_monitoring": "https://www.accc.gov.au/publications/quarterly-reports-on-the-australian-petroleum-industry",
    "accc_petrol_wholesale_component": "https://www.accc.gov.au/publications/quarterly-reports-on-the-australian-petroleum-industry",
    "accc_petrol_excise_component": "https://www.accc.gov.au/publications/quarterly-reports-on-the-australian-petroleum-industry",
    "accc_petrol_gst_component": "https://www.accc.gov.au/publications/quarterly-reports-on-the-australian-petroleum-industry",
    "accc_petrol_retail_margin_component": "https://www.accc.gov.au/publications/quarterly-reports-on-the-australian-petroleum-industry",
    "accc_petrol_breakdown_series": "https://www.accc.gov.au/publications/quarterly-reports-on-the-australian-petroleum-industry",
}


def load_sources() -> list[dict[str, Any]]:
    with SOURCES_FILE.open("r", encoding="utf-8") as f:
        doc = yaml.safe_load(f)
    return [s for s in doc.get("sources", []) if isinstance(s, dict)]


def find_links(html: str, base_url: str) -> list[str]:
    out = []
    for match in re.finditer(r'href=["\']([^"\']+)["\']', html, flags=re.IGNORECASE):
        href = match.group(1).strip()
        if not href or href.startswith("#"):
            continue
        out.append(urllib.parse.urljoin(base_url, href))
    return out


def score(url: str, fmt: str) -> int:
    lower = url.lower()
    sc = 0
    if fmt == "PDF" and ".pdf" in lower:
        sc += 10
    if fmt == "XLSX" and ".xlsx" in lower:
        sc += 10
    if any(k in lower for k in ("latest", "current", "report", "data", "download")):
        sc += 2
    if any(k in lower for k in ("quarterly", "annual", "statistics")):
        sc += 1
    return sc


def request_get(url: str) -> requests.Response:
    last_exc = None
    for _ in range(RETRY + 1):
        try:
            return requests.get(url, headers={"User-Agent": UA}, timeout=TIMEOUT)
        except Exception as exc:
            last_exc = exc
    assert last_exc is not None
    raise last_exc


def resolve_file_url(source: dict[str, Any]) -> tuple[str, str]:
    sid = source.get("id")
    canonical = SOURCE_URL_OVERRIDES.get(str(sid), source.get("canonical_url") or source.get("url"))
    fmt = str(source.get("format", "MIXED"))
    if not isinstance(canonical, str) or not canonical:
        raise RuntimeError("missing canonical_url/url")
    if fmt == "HTML_TABLE":
        return canonical, "canonical_html"
    resp = request_get(canonical)
    resp.raise_for_status()
    links = find_links(resp.text, canonical)
    if not links:
        return canonical, "canonical_no_links"
    ranked = sorted(links, key=lambda u: (score(u, fmt), u), reverse=True)
    best = ranked[0]
    if score(best, fmt) <= 0:
        return canonical, "canonical_no_scored_doc"
    return best, f"discovered_{fmt.lower()}"


def refine_download_url(url: str, fmt: str) -> tuple[str, str]:
    resp = request_get(url)
    ctype = (resp.headers.get("content-type") or "").lower()
    text_like = "text/html" in ctype or "<html" in resp.text[:300].lower()
    if not text_like:
        return url, "direct"
    links = find_links(resp.text, url)
    ranked = sorted(links, key=lambda u: (score(u, fmt), u), reverse=True)
    for link in ranked:
        if score(link, fmt) > 0:
            return link, "refined_from_html"
    return url, "html_no_artifact"


def ext_from(url: str, fmt: str) -> str:
    lower = url.lower()
    if ".xlsx" in lower:
        return "xlsx"
    if ".pdf" in lower:
        return "pdf"
    if fmt == "XLSX":
        return "xlsx"
    if fmt == "PDF":
        return "pdf"
    return "bin"


def sha256(blob: bytes) -> str:
    h = hashlib.sha256()
    h.update(blob)
    return h.hexdigest()


def xlsx_manifest(blob: bytes) -> dict[str, Any]:
    if openpyxl is None:
        return {"kind": "xlsx", "error": "openpyxl missing"}
    wb = openpyxl.load_workbook(io.BytesIO(blob), data_only=True, read_only=True)
    sheets = []
    for ws in wb.worksheets:
        rows_preview = []
        row_count = 0
        for row in ws.iter_rows(values_only=True):
            row_count += 1
            if len(rows_preview) < 8:
                rows_preview.append([str(c)[:120] if c is not None else "" for c in row[:12]])
        sheets.append({"name": ws.title, "rows_seen": row_count, "preview": rows_preview})
    return {"kind": "xlsx", "sheets": sheets}


def pdf_manifest(blob: bytes) -> dict[str, Any]:
    if pdfplumber is None:
        return {"kind": "pdf", "error": "pdfplumber missing"}
    out = {"kind": "pdf", "pages": []}
    with pdfplumber.open(io.BytesIO(blob)) as pdf:
        for i, page in enumerate(pdf.pages[:20], start=1):
            text = page.extract_text() or ""
            tables = page.extract_tables() or []
            out["pages"].append(
                {
                    "page": i,
                    "chars": len(text),
                    "table_count": len(tables),
                    "text_preview": text[:400],
                }
            )
        out["page_count"] = len(pdf.pages)
    return out


def write_json(path: pathlib.Path, doc: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(doc, f, indent=2, ensure_ascii=False)
        f.write("\n")


def main() -> int:
    date_tag = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%d")
    MANIFEST_DIR.mkdir(parents=True, exist_ok=True)
    sources = {s["id"]: s for s in load_sources() if s.get("id") in TARGET_IDS}
    if not sources:
        print("No target sources found.")
        return 0

    ok = 0
    fail = 0
    for sid in sorted(sources):
        source = sources[sid]
        fmt = str(source.get("format", "MIXED"))
        manifest: dict[str, Any] = {
            "source_id": sid,
            "human_name": source.get("human_name"),
            "format": fmt,
            "captured_at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        }
        try:
            url, resolution = resolve_file_url(source)
            dl_url, refine = refine_download_url(url, fmt)
            resp = request_get(dl_url)
            resp.raise_for_status()
            blob = resp.content

            ext = ext_from(dl_url, fmt)
            raw_path = RAW_DIR / sid / date_tag / f"source.{ext}"
            raw_path.parent.mkdir(parents=True, exist_ok=True)
            raw_path.write_bytes(blob)

            manifest.update(
                {
                    "resolved_url": url,
                    "resolution": f"{resolution}:{refine}",
                    "http_status": resp.status_code,
                    "content_type": resp.headers.get("content-type", ""),
                    "bytes": len(blob),
                    "sha256": sha256(blob),
                    "raw_path": str(raw_path.relative_to(ROOT)).replace("\\", "/"),
                }
            )

            if ext == "xlsx":
                manifest["structure"] = xlsx_manifest(blob)
            elif ext == "pdf":
                manifest["structure"] = pdf_manifest(blob)
            else:
                manifest["structure"] = {"kind": ext, "note": "no parser configured"}

            write_json(MANIFEST_DIR / f"{sid}.json", manifest)
            ok += 1
            print(f"[OK ] {sid}")
        except Exception as exc:
            manifest["error"] = f"{type(exc).__name__}: {exc}"
            write_json(MANIFEST_DIR / f"{sid}.json", manifest)
            fail += 1
            print(f"[ERR] {sid} {exc}")

    print()
    print(f"Corpus pass complete: ok={ok}, fail={fail}, total={ok + fail}")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
