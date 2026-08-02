#!/usr/bin/env python3
"""Classify public source-link health without blocking valid data refreshes.

The old broad link check emitted a flat list of HTTP failures. This report keeps
materially different conditions separate: confirmed broken links, access blocks,
transient failures, malformed registry URLs, missing internal documents, and
cases where the machine fetch endpoint remains healthy while the public landing
page is inaccessible to the runner.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import datetime as dt
import json
import pathlib
import sys
import urllib.parse
from dataclasses import asdict, dataclass
from typing import Any, Iterable

try:
    import requests
except ImportError:
    sys.stderr.write("requests is required. Install with: pip install requests\n")
    sys.exit(2)

try:
    import yaml
except ImportError:
    sys.stderr.write("PyYAML is required. Install with: pip install pyyaml\n")
    sys.exit(2)

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES_FILE = ROOT / "data" / "sources.yml"
GOVERNANCE_FILE = ROOT / "data" / "source_url_governance.json"
DEFAULT_OUTPUT = ROOT / "data" / "source_link_health.json"
UA = "FuelResilienceAU-LinkHealth/2.0 (+https://github.com/WowCorey/fuel-fertilizer-dashboard)"

HEALTHY_CATEGORIES = {"healthy", "healthy_redirect", "healthy_internal", "canonical_blocked_fetch_healthy"}
REPAIR_CATEGORIES = {"confirmed_broken", "canonical_broken_fetch_healthy", "malformed_url", "internal_missing"}


@dataclass(frozen=True)
class LinkResult:
    category: str
    detail: str
    requested_url: str
    final_url: str | None = None
    http_status: int | None = None


def classify_http_status(status: int, *, requested_url: str, final_url: str | None = None) -> LinkResult:
    final = final_url or requested_url
    if 200 <= status < 400:
        category = "healthy_redirect" if final.rstrip("/") != requested_url.rstrip("/") else "healthy"
        return LinkResult(category, f"HTTP {status}", requested_url, final, status)
    if status in {401, 403, 429}:
        return LinkResult("access_blocked", f"HTTP {status}", requested_url, final, status)
    if status in {404, 410}:
        return LinkResult("confirmed_broken", f"HTTP {status}", requested_url, final, status)
    if status in {408, 425} or 500 <= status < 600:
        return LinkResult("transient_error", f"HTTP {status}", requested_url, final, status)
    return LinkResult("http_error", f"HTTP {status}", requested_url, final, status)


def validate_public_url(url: Any) -> tuple[bool, str]:
    if not isinstance(url, str) or not url.strip():
        return False, "blank URL"
    parsed = urllib.parse.urlparse(url.strip())
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return False, "URL must use http or https and include a host"
    return True, ""


def local_path_for_project_url(url: str, *, root: pathlib.Path = ROOT) -> pathlib.Path | None:
    parsed = urllib.parse.urlparse(url)
    if parsed.netloc.lower() != "wowcorey.github.io":
        return None
    prefix = "/fuel-fertilizer-dashboard/"
    if not parsed.path.startswith(prefix):
        return None
    rel = urllib.parse.unquote(parsed.path[len(prefix):])
    if not rel:
        rel = "index.html"
    path = root / rel
    if path.is_dir():
        path = path / "index.html"
    return path


def check_url_once(url: Any, *, root: pathlib.Path = ROOT, timeout: float = 20.0, session: Any = requests) -> LinkResult:
    ok, message = validate_public_url(url)
    requested = url.strip() if isinstance(url, str) else ""
    if not ok:
        return LinkResult("malformed_url", message, requested)

    local_path = local_path_for_project_url(requested, root=root)
    if local_path is not None:
        relative = local_path.relative_to(root).as_posix()
        if local_path.exists():
            return LinkResult("healthy_internal", f"local file exists: {relative}", requested, requested)
        return LinkResult("internal_missing", f"local file missing: {relative}", requested, requested)

    try:
        response = session.get(
            requested,
            headers={"User-Agent": UA, "Accept": "text/html,application/json,application/pdf,*/*;q=0.8"},
            timeout=timeout,
            allow_redirects=True,
            stream=True,
        )
        try:
            return classify_http_status(
                int(response.status_code),
                requested_url=requested,
                final_url=str(getattr(response, "url", requested)),
            )
        finally:
            close = getattr(response, "close", None)
            if callable(close):
                close()
    except requests.Timeout as exc:
        return LinkResult("transient_error", f"Timeout: {exc}", requested)
    except requests.ConnectionError as exc:
        return LinkResult("transient_error", f"ConnectionError: {exc}", requested)
    except requests.RequestException as exc:
        return LinkResult("http_error", f"{type(exc).__name__}: {exc}", requested)


def load_sources() -> list[dict[str, Any]]:
    with SOURCES_FILE.open("r", encoding="utf-8") as handle:
        doc = yaml.safe_load(handle)
    sources = doc.get("sources") if isinstance(doc, dict) else None
    if not isinstance(sources, list):
        raise ValueError("data/sources.yml must contain a sources list")
    return [source for source in sources if isinstance(source, dict)]


def load_governance() -> dict[str, Any]:
    with GOVERNANCE_FILE.open("r", encoding="utf-8") as handle:
        doc = json.load(handle)
    if not isinstance(doc, dict) or doc.get("schema") != "fuel_resilience_source_url_governance.v1":
        raise ValueError("invalid source URL governance document")
    if not isinstance(doc.get("overrides"), dict):
        raise ValueError("source URL governance overrides must be an object")
    return doc


def effective_canonical(source: dict[str, Any], overrides: dict[str, Any]) -> tuple[Any, dict[str, Any] | None]:
    override = overrides.get(source.get("id"))
    if isinstance(override, dict):
        return override.get("canonical_url"), override
    return source.get("canonical_url") or source.get("url"), None


def check_many(urls: Iterable[Any], *, workers: int, timeout: float) -> dict[str, LinkResult]:
    unique = sorted({str(url).strip() for url in urls if isinstance(url, str) and url.strip()})
    results: dict[str, LinkResult] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, workers)) as pool:
        futures = {pool.submit(check_url_once, url, timeout=timeout): url for url in unique}
        for future in concurrent.futures.as_completed(futures):
            url = futures[future]
            try:
                results[url] = future.result()
            except Exception as exc:  # Defensive: one checker must not abort the report.
                results[url] = LinkResult(
                    "checker_failure",
                    f"unexpected checker failure: {type(exc).__name__}: {exc}",
                    url,
                )
    return results


def combine_category(canonical: LinkResult, fetch: LinkResult | None) -> str:
    if fetch and fetch.category in HEALTHY_CATEGORIES:
        if canonical.category in {"access_blocked", "transient_error", "http_error"}:
            return "canonical_blocked_fetch_healthy"
        if canonical.category == "confirmed_broken":
            return "canonical_broken_fetch_healthy"
    return canonical.category


def build_report(*, only: str | None, workers: int, timeout: float) -> dict[str, Any]:
    sources = load_sources()
    governance = load_governance()
    overrides = governance["overrides"]
    if only:
        sources = [source for source in sources if source.get("id") == only]
        if not sources:
            raise ValueError(f"unknown source id: {only}")

    canonical_urls: list[Any] = []
    resolved: dict[str, tuple[dict[str, Any], Any, dict[str, Any] | None]] = {}
    for source in sources:
        source_id = source.get("id")
        if not isinstance(source_id, str):
            continue
        canonical, override = effective_canonical(source, overrides)
        resolved[source_id] = (source, canonical, override)
        canonical_urls.append(canonical)

    canonical_checks = check_many(canonical_urls, workers=workers, timeout=timeout)

    fetch_candidates: list[str] = []
    for source_id, (source, canonical, _override) in resolved.items():
        canonical_key = str(canonical).strip() if isinstance(canonical, str) else ""
        canonical_result = canonical_checks.get(canonical_key) or check_url_once(canonical)
        fetch_url = source.get("fetch_url")
        if (
            isinstance(fetch_url, str)
            and fetch_url.strip()
            and fetch_url.strip() != canonical_key
            and canonical_result.category not in HEALTHY_CATEGORIES
        ):
            fetch_candidates.append(fetch_url)

    fetch_checks = check_many(fetch_candidates, workers=workers, timeout=timeout)

    entries: dict[str, Any] = {}
    summary: dict[str, int] = {}
    for source_id, (source, canonical, override) in sorted(resolved.items()):
        canonical_key = str(canonical).strip() if isinstance(canonical, str) else ""
        canonical_result = canonical_checks.get(canonical_key) or check_url_once(canonical)
        fetch_url = source.get("fetch_url")
        fetch_result = None
        if isinstance(fetch_url, str) and fetch_url.strip() and fetch_url.strip() != canonical_key:
            fetch_result = fetch_checks.get(fetch_url.strip())

        category = combine_category(canonical_result, fetch_result)
        summary[category] = summary.get(category, 0) + 1
        entry: dict[str, Any] = {
            "source_id": source_id,
            "category": category,
            "canonical_check": asdict(canonical_result),
            "registry_canonical_url": source.get("canonical_url") or source.get("url"),
            "effective_canonical_url": canonical,
            "override_applied": override is not None,
            "fetch_mode": source.get("fetch"),
        }
        if fetch_result is not None:
            entry["fetch_check"] = asdict(fetch_result)
        if override is not None:
            entry["governance"] = {
                "reason": override.get("reason"),
                "legacy_urls": override.get("legacy_urls", []),
                "supporting_urls": override.get("supporting_urls", []),
            }
        entries[source_id] = entry

    generated_at = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    checker_failure_count = summary.get("checker_failure", 0)
    return {
        "schema": "fuel_resilience_source_link_health.v2",
        "generated_at": generated_at,
        "advisory": True,
        "claim_boundary": "A failed automated landing-page request is not, by itself, proof that the underlying dataset is unavailable. Categories distinguish broken links from access blocks and transient failures.",
        "registered_source_count": len(sources),
        "classified_source_count": len(entries),
        "checker_failure_count": checker_failure_count,
        "classification_complete": len(entries) == len(sources) and checker_failure_count == 0,
        "summary": dict(sorted(summary.items())),
        "repair_required_count": sum(summary.get(category, 0) for category in REPAIR_CATEGORIES),
        "sources": entries,
    }


def printable_output_path(output: pathlib.Path, *, root: pathlib.Path = ROOT) -> str:
    try:
        return output.relative_to(root).as_posix()
    except ValueError:
        return str(output)


def main() -> int:
    parser = argparse.ArgumentParser(description="Classify source landing-page link health")
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT), help="JSON report path")
    parser.add_argument("--only", help="check one source id")
    parser.add_argument("--workers", type=int, default=8, help="maximum concurrent requests")
    parser.add_argument("--timeout", type=float, default=20.0, help="request timeout in seconds")
    parser.add_argument("--strict", action="store_true", help="exit non-zero for definite repair categories")
    parser.add_argument("--no-write", action="store_true", help="print summary without writing JSON")
    args = parser.parse_args()

    try:
        report = build_report(only=args.only, workers=args.workers, timeout=args.timeout)
    except (OSError, ValueError, json.JSONDecodeError, yaml.YAMLError) as exc:
        print(f"source link health error: {exc}", file=sys.stderr)
        return 1

    if not args.no_write:
        output = pathlib.Path(args.output)
        if not output.is_absolute():
            output = ROOT / output
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"Wrote {printable_output_path(output)}")

    for category, count in report["summary"].items():
        print(f"{category}: {count}")
    print(
        "classification coverage: "
        f"{report['classified_source_count']}/{report['registered_source_count']} "
        f"(complete: {str(report['classification_complete']).lower()})"
    )
    print(f"definite repair categories: {report['repair_required_count']}")

    if args.strict and report["repair_required_count"]:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
