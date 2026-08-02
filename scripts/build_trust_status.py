#!/usr/bin/env python3
"""Generate the public Trust Status v2 manifest from repository evidence.

The manifest is descriptive, not a certification. It reports only what can be
calculated from committed source metadata, data envelopes, validator output,
refresh metadata and the optional classified link-health report.
"""

from __future__ import annotations

import argparse
import collections
import datetime as dt
import json
import pathlib
import re
import subprocess
import sys
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCE_MANIFEST = ROOT / "data" / "source_manifest.json"
REFRESH_STATUS = ROOT / "data" / "last_successful_refresh.json"
LINK_HEALTH = ROOT / "data" / "source_link_health.json"
TRUST_MANIFEST = ROOT / "data" / "trust_status_manifest.json"
GENERATED_DIR = ROOT / "data" / "generated"
MANUAL_DIR = ROOT / "data" / "manual"
VALIDATOR = ROOT / "scripts" / "validate_project.py"
SOURCE_MODES = ("programmatic", "manual", "derived", "unavailable")
PRESENCE_MODES = ("generated_only", "manual_only", "both", "missing")
ENVELOPE_FIELDS = (
    "files_total",
    "generated_files",
    "manual_files",
    "unreadable",
    "status_ok",
    "status_unavailable",
    "status_other",
    "manual_entry_true",
    "manual_entry_false",
)
WARNING_CATEGORIES = (
    "manual_stale",
    "generated_stale",
    "rights_metadata",
    "source_name_mismatch",
    "source_url_mismatch",
    "other",
)


def read_json(path: pathlib.Path, *, required: bool = True) -> dict[str, Any] | None:
    if not path.exists():
        if required:
            raise FileNotFoundError(path)
        return None
    with path.open("r", encoding="utf-8") as handle:
        value = json.load(handle)
    if not isinstance(value, dict):
        raise ValueError(f"{path.relative_to(ROOT)} must contain a JSON object")
    return value


def run_validator() -> dict[str, Any]:
    process = subprocess.run(
        [sys.executable, str(VALIDATOR), "--json"],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=False,
    )
    if not process.stdout.strip():
        detail = process.stderr.strip() or f"exit status {process.returncode}"
        raise RuntimeError(f"project validator produced no JSON: {detail}")
    try:
        report = json.loads(process.stdout)
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"project validator returned invalid JSON: {exc}") from exc
    if not isinstance(report, dict):
        raise RuntimeError("project validator report must be an object")
    return report


def source_inventory(source_manifest: dict[str, Any]) -> tuple[dict[str, int], dict[str, int], list[dict[str, Any]]]:
    sources = source_manifest.get("sources")
    if not isinstance(sources, dict):
        raise ValueError("data/source_manifest.json must contain a sources object")

    modes = collections.Counter({mode: 0 for mode in SOURCE_MODES})
    envelope_presence = collections.Counter({mode: 0 for mode in PRESENCE_MODES})
    unavailable_by_dashboard = collections.Counter()

    for source_id, source in sources.items():
        if not isinstance(source, dict):
            raise ValueError(f"source manifest entry {source_id!r} must be an object")
        mode = source.get("fetch")
        if mode not in SOURCE_MODES:
            raise ValueError(f"source manifest entry {source_id!r} has unknown fetch mode {mode!r}")
        modes[mode] += 1
        has_generated = source.get("has_generated") is True
        has_manual = source.get("has_manual") is True
        if has_generated and has_manual:
            envelope_presence["both"] += 1
        elif has_generated:
            envelope_presence["generated_only"] += 1
        elif has_manual:
            envelope_presence["manual_only"] += 1
        else:
            envelope_presence["missing"] += 1

        if mode == "unavailable":
            used_by = source.get("used_by")
            if isinstance(used_by, list):
                for dashboard in used_by:
                    if isinstance(dashboard, str) and dashboard:
                        unavailable_by_dashboard[dashboard] += 1

    modes["total"] = len(sources)
    top_gaps = [
        {"dashboard": dashboard, "unavailable_sources": count}
        for dashboard, count in unavailable_by_dashboard.most_common(12)
    ]
    return dict(modes), dict(envelope_presence), top_gaps


def envelope_inventory() -> dict[str, int]:
    counts = collections.Counter({field: 0 for field in ENVELOPE_FIELDS})
    for directory, location in ((GENERATED_DIR, "generated"), (MANUAL_DIR, "manual")):
        for path in sorted(directory.glob("*.json")):
            counts["files_total"] += 1
            counts[f"{location}_files"] += 1
            try:
                envelope = read_json(path)
            except (OSError, ValueError, json.JSONDecodeError):
                counts["unreadable"] += 1
                continue
            status = envelope.get("status")
            if status == "ok":
                counts["status_ok"] += 1
            elif status == "unavailable":
                counts["status_unavailable"] += 1
            else:
                counts["status_other"] += 1
            if envelope.get("manual_entry") is True:
                counts["manual_entry_true"] += 1
            elif envelope.get("manual_entry") is False:
                counts["manual_entry_false"] += 1
    return dict(counts)


def validation_summary(report: dict[str, Any]) -> dict[str, Any]:
    errors = report.get("errors") if isinstance(report.get("errors"), list) else []
    warnings = report.get("warnings") if isinstance(report.get("warnings"), list) else []
    buckets = collections.Counter({category: 0 for category in WARNING_CATEGORIES})
    examples: dict[str, list[dict[str, str]]] = collections.defaultdict(list)

    for warning in warnings:
        if not isinstance(warning, dict):
            continue
        path = public_diagnostic_text(warning.get("path"), limit=180)
        message = public_diagnostic_text(warning.get("message"), limit=320)
        lowered = message.lower()
        if "stale" in lowered and path.startswith("data/manual/"):
            bucket = "manual_stale"
        elif "stale" in lowered and path.startswith("data/generated/"):
            bucket = "generated_stale"
        elif "rights_url is blank" in lowered:
            bucket = "rights_metadata"
        elif "source_name differs" in lowered:
            bucket = "source_name_mismatch"
        elif "source_url differs" in lowered:
            bucket = "source_url_mismatch"
        else:
            bucket = "other"
        buckets[bucket] += 1
        if len(examples[bucket]) < 8:
            examples[bucket].append({"path": path, "message": message})

    return {
        "ok": not errors,
        "error_count": len(errors),
        "warning_count": len(warnings),
        "warning_categories": dict(sorted(buckets.items())),
        "warning_examples": dict(sorted(examples.items())),
        "errors": [public_diagnostic(item) for item in errors[:12] if isinstance(item, dict)],
        "evidence_path": "scripts/validate_project.py",
    }


def public_diagnostic(item: dict[str, Any]) -> dict[str, str]:
    """Publish only bounded validator path/message fields."""
    return {
        "path": public_diagnostic_text(item.get("path"), limit=180),
        "message": public_diagnostic_text(item.get("message"), limit=320),
    }


def public_diagnostic_text(value: Any, *, limit: int) -> str:
    """Keep public validator examples useful without publishing tokens or local paths."""
    text = str(value or "").replace(str(ROOT), ".")
    text = re.sub(
        r"([?&](?:api[_-]?key|access[_-]?token|token|secret|signature|key)=)[^&\s]+",
        r"\1[redacted]",
        text,
        flags=re.IGNORECASE,
    )
    if len(text) > limit:
        return text[: limit - 1].rstrip() + "…"
    return text


def refresh_summary(refresh: dict[str, Any] | None) -> dict[str, Any]:
    if not refresh:
        return {
            "status": "not_recorded",
            "refreshed_at": None,
            "workflow": None,
            "run_id": None,
            "reported_git_sha": None,
            "sha_semantics": "No committed refresh marker was available.",
            "evidence_path": "data/last_successful_refresh.json",
        }
    return {
        "status": refresh.get("status") or "unknown",
        "refreshed_at": refresh.get("refreshed_at"),
        "workflow": refresh.get("workflow"),
        "run_id": refresh.get("run_id"),
        "run_attempt": refresh.get("run_attempt"),
        "reported_git_sha": refresh.get("git_sha"),
        "sha_semantics": (
            "Under the current v1 marker, git_sha records the workflow input commit and may not be "
            "the later commit that contains the published refresh."
        ),
        "evidence_path": "data/last_successful_refresh.json",
    }


def link_health_summary(report: dict[str, Any] | None) -> dict[str, Any]:
    if not report:
        return {
            "status": "not_yet_generated",
            "generated_at": None,
            "advisory": True,
            "repair_required_count": None,
            "registered_source_count": None,
            "classified_source_count": None,
            "checker_failure_count": None,
            "classification_complete": None,
            "categories": {},
            "claim_boundary": (
                "No classified link-health report is committed yet. This does not imply that all "
                "source pages are healthy or broken."
            ),
            "evidence_path": "data/source_link_health.json",
        }
    categories = report.get("summary") if isinstance(report.get("summary"), dict) else {}
    return {
        "status": "available",
        "generated_at": report.get("generated_at"),
        "advisory": report.get("advisory") is True,
        "repair_required_count": report.get("repair_required_count"),
        "registered_source_count": report.get("registered_source_count"),
        "classified_source_count": report.get("classified_source_count"),
        "checker_failure_count": report.get("checker_failure_count"),
        "classification_complete": report.get("classification_complete"),
        "categories": categories,
        "claim_boundary": report.get("claim_boundary"),
        "evidence_path": "data/source_link_health.json",
    }


def overall_status(validation: dict[str, Any], refresh: dict[str, Any], links: dict[str, Any]) -> str:
    if validation["error_count"]:
        return "validation_failed"
    if refresh.get("status") != "success":
        return "refresh_status_unknown"
    repairs = links.get("repair_required_count")
    if (
        validation["warning_count"]
        or links.get("status") != "available"
        or links.get("classification_complete") is not True
        or (isinstance(repairs, int) and repairs > 0)
    ):
        return "operational_with_warnings"
    return "operational"


def build_manifest() -> dict[str, Any]:
    source_manifest = read_json(SOURCE_MANIFEST)
    refresh = read_json(REFRESH_STATUS, required=False)
    link_report = read_json(LINK_HEALTH, required=False)
    validator_report = run_validator()

    modes, envelope_presence, top_gaps = source_inventory(source_manifest)
    envelopes = envelope_inventory()
    validation = validation_summary(validator_report)
    refresh_info = refresh_summary(refresh)
    links = link_health_summary(link_report)

    workflows = [
        {
            "id": "continuous_integration",
            "label": "Continuous integration",
            "status": "configured",
            "evidence_path": ".github/workflows/ci.yml",
            "meaning": "Pushes and pull requests run source, validation, unit and browser checks. This describes configuration, not the latest run conclusion."
        },
        {
            "id": "weekly_data_refresh",
            "label": "Weekly data refresh",
            "status": "configured",
            "evidence_path": ".github/workflows/refresh-data.yml",
            "meaning": "The configured scheduled workflow fetches and validates programmatic sources. This is configuration evidence, not the latest run conclusion; manual sources remain human-reviewed."
        },
        {
            "id": "manual_review",
            "label": "Manual source review",
            "status": "configured",
            "evidence_path": ".github/workflows/manual-data-review.yml",
            "meaning": "The configured advisory workflow reports manual, unavailable and overdue evidence without inventing replacement values. This is not the latest run conclusion."
        },
        {
            "id": "pages_deployment",
            "label": "GitHub Pages deployment",
            "status": "configured",
            "evidence_path": ".github/workflows/pages.yml",
            "meaning": "The repository contains a Pages deployment workflow. This does not assert the conclusion of the latest deployment run."
        },
    ]

    return {
        "schema": "fuel_resilience_trust_status.v2",
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "status": overall_status(validation, refresh_info, links),
        "project": {
            "name": "Fuel Resilience AU",
            "repository": "WowCorey/fuel-fertilizer-dashboard",
            "purpose": "Independent public-source Australian resilience data audit.",
            "official_status": "not_official",
        },
        "source_inventory": {
            "modes": modes,
            "envelope_presence": envelope_presence,
            "envelopes": envelopes,
            "evidence_path": "data/source_manifest.json",
        },
        "validation": validation,
        "latest_refresh": refresh_info,
        "link_health": links,
        "workflow_configuration": workflows,
        "unavailable_coverage": {
            "top_dashboards": top_gaps,
            "meaning": "Counts show how many registry entries marked unavailable are associated with each dashboard. They are visibility gaps, not risk scores or evidence of wrongdoing.",
        },
        "confidence_bands": [
            {
                "id": "programmatic",
                "label": "Programmatic public feed",
                "meaning": "Fetched from a named machine-readable endpoint and validated before publication.",
            },
            {
                "id": "manual",
                "label": "Manual public-source snapshot",
                "meaning": "Hand-entered from a named public page or document and required to retain its date and caveats.",
            },
            {
                "id": "derived",
                "label": "Derived from named envelopes",
                "meaning": "Calculated or selected from traceable parent evidence; not an independent observed series.",
            },
            {
                "id": "unavailable",
                "label": "Source-gated or unavailable",
                "meaning": "No verified public field, period, unit and reuse path is loaded; the dashboard must not estimate it.",
            },
        ],
        "trust_rules": [
            "No made-up data or unsupported estimates.",
            "Manual public-source values remain labelled as manual.",
            "Derived values retain traceable parent evidence.",
            "Unavailable rows remain visible as public-data gaps.",
            "A successful automated refresh does not prove every manual source is current.",
            "A blocked or timed-out landing page does not, by itself, prove the underlying dataset is unavailable.",
            "Workflow configuration is not presented as the latest workflow result.",
        ],
        "claim_boundary": (
            "Trust Status reports repository evidence, validation output, refresh metadata and public-source "
            "coverage. It is not a certification, not an official government assessment, not a security audit, "
            "not proof that every upstream value is correct, not proof that every source is reachable, and not "
            "a risk score."
        ),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Build data/trust_status_manifest.json")
    parser.add_argument("--check", action="store_true", help="fail if the committed manifest differs, ignoring generated_at")
    args = parser.parse_args()

    try:
        manifest = build_manifest()
    except (OSError, ValueError, RuntimeError, json.JSONDecodeError) as exc:
        print(f"trust-status build failed: {exc}", file=sys.stderr)
        return 1

    if args.check:
        try:
            current = read_json(TRUST_MANIFEST)
        except (OSError, ValueError, json.JSONDecodeError) as exc:
            print(f"trust-status check failed: {exc}", file=sys.stderr)
            return 1
        expected = dict(manifest)
        actual = dict(current)
        expected.pop("generated_at", None)
        actual.pop("generated_at", None)
        if actual != expected:
            print("data/trust_status_manifest.json is stale; run scripts/build_trust_status.py", file=sys.stderr)
            return 1
        print("trust status manifest ok")
        return 0

    TRUST_MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {TRUST_MANIFEST.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
