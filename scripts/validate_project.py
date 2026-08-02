#!/usr/bin/env python3
"""Run the base data validator plus source-URL governance checks.

The legacy validator still compares envelope URLs directly with data/sources.yml.
During the governed URL migration, those expected mismatch warnings are replaced
with stronger checks against data/source_url_governance.json. All other base
errors and warnings are preserved.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import pathlib
import subprocess
import sys
import urllib.parse
from typing import Any

try:
    import yaml
except ImportError:
    sys.stderr.write("PyYAML is required. Install with: pip install pyyaml\n")
    sys.exit(2)

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE_VALIDATOR = ROOT / "scripts" / "validate_data.py"
SOURCES_FILE = ROOT / "data" / "sources.yml"
GOVERNANCE_FILE = ROOT / "data" / "source_url_governance.json"
GENERATED_DIR = ROOT / "data" / "generated"
MANUAL_DIR = ROOT / "data" / "manual"


def add(items: list[dict[str, str]], path: str, message: str) -> None:
    items.append({"path": path, "message": message})


def envelope_path(source_id: str) -> pathlib.Path | None:
    for directory in (GENERATED_DIR, MANUAL_DIR):
        path = directory / f"{source_id}.json"
        if path.exists():
            return path
    return None


def valid_date(value: Any) -> bool:
    if not isinstance(value, str):
        return False
    try:
        dt.date.fromisoformat(value)
        return True
    except ValueError:
        return False


def valid_http_url(value: Any) -> bool:
    if not isinstance(value, str) or value != value.strip():
        return False
    parsed = urllib.parse.urlparse(value)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def expected_governance_metadata(governance: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    metadata: dict[str, Any] = {
        "canonical_url": override.get("canonical_url"),
        "reviewed_at": governance.get("reviewed_at"),
        "reason": override.get("reason"),
    }
    if override.get("legacy_urls"):
        metadata["legacy_urls"] = override["legacy_urls"]
    if override.get("supporting_urls"):
        metadata["supporting_urls"] = override["supporting_urls"]
    return metadata


def run_base_validator() -> dict[str, Any]:
    process = subprocess.run(
        [sys.executable, str(BASE_VALIDATOR), "--json"],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=False,
    )
    if not process.stdout.strip():
        raise RuntimeError(f"base validator produced no JSON: {process.stderr.strip()}")
    try:
        report = json.loads(process.stdout)
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"base validator returned invalid JSON: {exc}") from exc
    if not isinstance(report, dict):
        raise RuntimeError("base validator report must be an object")
    return report


def load_sources() -> dict[str, dict[str, Any]]:
    with SOURCES_FILE.open("r", encoding="utf-8") as handle:
        doc = yaml.safe_load(handle)
    raw = doc.get("sources") if isinstance(doc, dict) else None
    if not isinstance(raw, list):
        raise ValueError("data/sources.yml must contain a sources list")
    return {source["id"]: source for source in raw if isinstance(source, dict) and isinstance(source.get("id"), str)}


def load_governance() -> dict[str, Any]:
    with GOVERNANCE_FILE.open("r", encoding="utf-8") as handle:
        doc = json.load(handle)
    if not isinstance(doc, dict):
        raise ValueError("source URL governance must be a JSON object")
    return doc


def governance_checks(
    sources: dict[str, dict[str, Any]],
    governance: dict[str, Any],
    errors: list[dict[str, str]],
    warnings: list[dict[str, str]],
) -> set[str]:
    path = "data/source_url_governance.json"
    if governance.get("schema") != "fuel_resilience_source_url_governance.v1":
        add(errors, path, "unexpected schema")
    if not valid_date(governance.get("reviewed_at")):
        add(errors, path, "reviewed_at must be YYYY-MM-DD")
    overrides = governance.get("overrides")
    if not isinstance(overrides, dict):
        add(errors, path, "overrides must be an object")
        return set()

    governed_ids: set[str] = set()
    for source_id, override in sorted(overrides.items()):
        item_path = f"{path}:overrides.{source_id}"
        if source_id not in sources:
            add(errors, item_path, "override references an unknown source id")
            continue
        governed_ids.add(source_id)
        if not isinstance(override, dict):
            add(errors, item_path, "override must be an object")
            continue
        canonical = override.get("canonical_url")
        if not valid_http_url(canonical):
            add(errors, item_path, "canonical_url must be a non-empty http(s) URL")
        if not isinstance(override.get("reason"), str) or not override.get("reason", "").strip():
            add(errors, item_path, "reason must be a non-empty string")
        for field in ("legacy_urls", "supporting_urls"):
            values = override.get(field, [])
            if not isinstance(values, list) or any(not valid_http_url(value) for value in values):
                add(errors, item_path, f"{field} must be a list of http(s) URLs")
            elif len(values) != len(set(values)):
                add(errors, item_path, f"{field} must not contain duplicate URLs")
        if canonical in override.get("legacy_urls", []):
            add(errors, item_path, "canonical_url must not also be listed as legacy")
        if canonical in override.get("supporting_urls", []):
            add(errors, item_path, "canonical_url must not also be listed as supporting")

        env_path = envelope_path(source_id)
        if env_path is None:
            add(errors, item_path, "governed source has no envelope")
            continue
        try:
            envelope = json.loads(env_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            add(errors, env_path.relative_to(ROOT).as_posix(), f"cannot read governed envelope: {exc}")
            continue
        if envelope.get("source_url") != canonical:
            add(errors, env_path.relative_to(ROOT).as_posix(), "source_url does not match governed canonical_url; run scripts/apply_source_url_governance.py")
        metadata = envelope.get("source_url_governance")
        if not isinstance(metadata, dict):
            add(errors, env_path.relative_to(ROOT).as_posix(), "missing source_url_governance metadata")
        elif metadata != expected_governance_metadata(governance, override):
            add(errors, env_path.relative_to(ROOT).as_posix(), "source_url_governance metadata does not exactly match the governed override")

    if len(governed_ids) > 50:
        add(warnings, path, "governance overrides are becoming broad; fold mature URL changes back into data/sources.yml")
    return governed_ids


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate project data and source URL governance")
    parser.add_argument("--json", action="store_true", help="emit machine-readable JSON")
    parser.add_argument("--strict", action="store_true", help="treat remaining warnings as errors")
    args = parser.parse_args()

    try:
        base = run_base_validator()
        sources = load_sources()
        governance = load_governance()
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError, yaml.YAMLError) as exc:
        print(f"validation bootstrap error: {exc}", file=sys.stderr)
        return 1

    errors = list(base.get("errors", []))
    warnings = list(base.get("warnings", []))
    governed_ids = governance_checks(sources, governance, errors, warnings)

    expected_warning_paths = {
        (GENERATED_DIR / f"{source_id}.json").relative_to(ROOT).as_posix()
        for source_id in governed_ids
    } | {
        (MANUAL_DIR / f"{source_id}.json").relative_to(ROOT).as_posix()
        for source_id in governed_ids
    }
    warnings = [
        warning
        for warning in warnings
        if not (
            warning.get("path") in expected_warning_paths
            and warning.get("message") == "source_url differs from source canonical_url"
        )
    ]

    if args.strict and warnings:
        errors.extend({"path": warning["path"], "message": "strict: " + warning["message"]} for warning in warnings)

    report = {"ok": not errors, "errors": errors, "warnings": warnings}
    if args.json:
        print(json.dumps(report, indent=2))
    else:
        for item in errors:
            print(f"ERROR {item['path']}: {item['message']}", file=sys.stderr)
        for item in warnings:
            print(f"WARN  {item['path']}: {item['message']}")
        if errors:
            print(f"validation failed: {len(errors)} error(s), {len(warnings)} warning(s)", file=sys.stderr)
        else:
            print(f"validation ok: {len(warnings)} warning(s)")
    return 0 if not errors else 1


if __name__ == "__main__":
    sys.exit(main())
