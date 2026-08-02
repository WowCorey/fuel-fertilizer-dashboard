#!/usr/bin/env python3
"""Validate the generated Trust Status v2 manifest and public page contract."""

from __future__ import annotations

import json
import pathlib
import re
import sys
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "data" / "trust_status_manifest.json"
SOURCE_MANIFEST_PATH = ROOT / "data" / "source_manifest.json"
PAGE_PATH = ROOT / "ui_kits" / "trust-status-dashboard" / "index.html"

ALLOWED_STATUSES = {
    "operational",
    "operational_with_warnings",
    "refresh_status_unknown",
    "validation_failed",
}
SOURCE_MODES = {"programmatic", "manual", "derived", "unavailable"}
ALLOWED_MODES = SOURCE_MODES | {"total"}
PRESENCE_MODES = {"generated_only", "manual_only", "both", "missing"}
ENVELOPE_FIELDS = {
    "files_total",
    "generated_files",
    "manual_files",
    "unreadable",
    "status_ok",
    "status_unavailable",
    "status_other",
    "manual_entry_true",
    "manual_entry_false",
}
WARNING_CATEGORIES = {
    "manual_stale",
    "generated_stale",
    "rights_metadata",
    "source_name_mismatch",
    "source_url_mismatch",
    "other",
}
REQUIRED_TOP_LEVEL = {
    "schema",
    "generated_at",
    "status",
    "project",
    "source_inventory",
    "validation",
    "latest_refresh",
    "link_health",
    "workflow_configuration",
    "unavailable_coverage",
    "confidence_bands",
    "trust_rules",
    "claim_boundary",
}


def add(errors: list[str], message: str) -> None:
    errors.append(message)


def is_nonnegative_int(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool) and value >= 0


def load_manifest(errors: list[str]) -> dict[str, Any]:
    try:
        with MANIFEST_PATH.open("r", encoding="utf-8") as handle:
            doc = json.load(handle)
    except Exception as exc:
        add(errors, f"cannot read data/trust_status_manifest.json: {type(exc).__name__}: {exc}")
        return {}
    if not isinstance(doc, dict):
        add(errors, "trust status manifest must be a JSON object")
        return {}
    return doc


def expected_source_inventory(errors: list[str]) -> tuple[dict[str, int], dict[str, int]]:
    modes = {mode: 0 for mode in SOURCE_MODES}
    presence = {mode: 0 for mode in PRESENCE_MODES}
    try:
        with SOURCE_MANIFEST_PATH.open("r", encoding="utf-8") as handle:
            manifest = json.load(handle)
    except Exception as exc:
        add(errors, f"cannot read data/source_manifest.json: {type(exc).__name__}: {exc}")
        return modes | {"total": 0}, presence

    sources = manifest.get("sources") if isinstance(manifest, dict) else None
    if not isinstance(sources, dict):
        add(errors, "data/source_manifest.json must contain a sources object")
        return modes | {"total": 0}, presence

    for source_id, source in sources.items():
        if not isinstance(source, dict):
            add(errors, f"source manifest entry {source_id!r} must be an object")
            continue
        mode = source.get("fetch")
        if mode not in SOURCE_MODES:
            add(errors, f"source manifest entry {source_id!r} has unknown fetch mode {mode!r}")
        else:
            modes[mode] += 1
        has_generated = source.get("has_generated") is True
        has_manual = source.get("has_manual") is True
        if has_generated and has_manual:
            presence["both"] += 1
        elif has_generated:
            presence["generated_only"] += 1
        elif has_manual:
            presence["manual_only"] += 1
        else:
            presence["missing"] += 1

    modes["total"] = len(sources)
    return modes, presence


def expected_envelope_inventory() -> dict[str, int]:
    counts = {field: 0 for field in ENVELOPE_FIELDS}
    for directory, location in ((ROOT / "data" / "generated", "generated"), (ROOT / "data" / "manual", "manual")):
        for path in sorted(directory.glob("*.json")):
            counts["files_total"] += 1
            counts[f"{location}_files"] += 1
            try:
                with path.open("r", encoding="utf-8") as handle:
                    envelope = json.load(handle)
                if not isinstance(envelope, dict):
                    raise ValueError("envelope must be an object")
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
            manual_entry = envelope.get("manual_entry")
            if manual_entry is True:
                counts["manual_entry_true"] += 1
            elif manual_entry is False:
                counts["manual_entry_false"] += 1
    return counts


def validate_refresh(refresh: Any, errors: list[str]) -> None:
    if not isinstance(refresh, dict):
        add(errors, "latest_refresh must be an object")
        return

    status = refresh.get("status")
    evidence = refresh.get("evidence_path")
    semantics = str(refresh.get("sha_semantics") or "").lower()
    if status == "not_recorded":
        for field in (
            "marker_schema",
            "publication_state",
            "refreshed_at",
            "source_data_refreshed_at",
            "workflow",
            "run_id",
            "run_attempt",
            "ref",
            "branch",
            "reported_git_sha",
            "workflow_input_sha",
            "output_commit_sha",
            "output_commit_pushed",
        ):
            if refresh.get(field) is not None:
                add(errors, f"latest_refresh.{field} must be null when no marker is recorded")
        if "no committed refresh marker" not in semantics:
            add(errors, "latest_refresh.sha_semantics must disclose that no committed marker is available")
        return

    if status not in {"success", "pending_publication", "failed", "unknown"}:
        add(errors, "latest_refresh.status is invalid")
    if not isinstance(evidence, str) or not (ROOT / evidence).exists():
        add(errors, "latest_refresh.evidence_path must reference the committed refresh marker")

    marker_schema = refresh.get("marker_schema")
    if marker_schema == "fuel_resilience_refresh_status.v2":
        for field in (
            "refreshed_at",
            "source_data_refreshed_at",
            "workflow",
            "run_id",
            "run_attempt",
            "ref",
            "branch",
            "workflow_input_sha",
        ):
            if not isinstance(refresh.get(field), str) or not refresh.get(field):
                add(errors, f"latest_refresh.{field} is required for a v2 marker")
        workflow_input_sha = refresh.get("workflow_input_sha")
        if isinstance(workflow_input_sha, str) and not re.fullmatch(r"[0-9a-f]{40}", workflow_input_sha):
            add(errors, "latest_refresh.workflow_input_sha must be a full lowercase Git SHA")
        if refresh.get("reported_git_sha") != workflow_input_sha:
            add(errors, "latest_refresh.reported_git_sha must preserve the workflow input SHA compatibility field")

        publication_state = refresh.get("publication_state")
        if publication_state == "prepared":
            if status != "pending_publication":
                add(errors, "a prepared v2 marker must remain pending_publication")
            if refresh.get("output_commit_sha") is not None:
                add(errors, "a prepared v2 marker must not claim an output commit SHA")
            if refresh.get("output_commit_pushed") is not False:
                add(errors, "a prepared v2 marker must report output_commit_pushed as false")
            if "not established" not in semantics:
                add(errors, "a prepared v2 marker must disclose that publication is not established")
        elif publication_state == "published":
            if status != "success":
                add(errors, "a published v2 marker must report success")
            output_sha = refresh.get("output_commit_sha")
            if not isinstance(output_sha, str) or not re.fullmatch(r"[0-9a-f]{40}", output_sha):
                add(errors, "a published v2 marker requires a full lowercase output commit SHA")
            if refresh.get("output_commit_pushed") is not True:
                add(errors, "a published v2 marker must prove output_commit_pushed")
            for phrase in ("earlier pushed commit", "not the later marker commit", "not proof of the latest deployed commit"):
                if phrase not in semantics:
                    add(errors, f"published v2 SHA semantics must include: {phrase}")
        else:
            add(errors, "latest_refresh.publication_state is invalid for marker v2")
        return

    if marker_schema not in {"fuel_resilience_refresh_status.v1", None}:
        add(errors, "latest_refresh.marker_schema is unsupported")
    if status == "success":
        for field in ("refreshed_at", "workflow", "run_id", "reported_git_sha"):
            if not isinstance(refresh.get(field), str) or not refresh.get(field):
                add(errors, f"latest_refresh.{field} is required for a successful legacy marker")
    if refresh.get("publication_state") != "legacy_unverified":
        add(errors, "legacy refresh evidence must remain explicitly unverified")
    if refresh.get("output_commit_sha") is not None or refresh.get("output_commit_pushed") is not None:
        add(errors, "legacy refresh evidence must not claim output publication fields")
    if "input commit" not in semantics or "published refresh" not in semantics or "no output commit" not in semantics:
        add(errors, "legacy SHA semantics must disclose the marker ambiguity")


def validate_link_health(links: Any, errors: list[str]) -> None:
    if not isinstance(links, dict):
        add(errors, "link_health must be an object")
        return
    status = links.get("status")
    if status not in {"available", "not_yet_generated"}:
        add(errors, "link_health.status is invalid")
    if links.get("advisory") is not True:
        add(errors, "link health must remain advisory")
    boundary = str(links.get("claim_boundary") or "").lower()
    if "not" not in boundary or not any(term in boundary for term in ("proof", "imply", "does not")):
        add(errors, "link_health.claim_boundary must reject over-interpretation")

    categories = links.get("categories")
    if not isinstance(categories, dict):
        add(errors, "link_health.categories must be an object")
        return
    for category, count in categories.items():
        if not isinstance(category, str) or not category:
            add(errors, "link_health category names must be non-empty strings")
        if not is_nonnegative_int(count):
            add(errors, f"link_health.categories.{category} must be a non-negative integer")

    if status == "not_yet_generated":
        if categories:
            add(errors, "missing link-health evidence must not publish category counts")
        for field in (
            "repair_required_count",
            "registered_source_count",
            "classified_source_count",
            "checker_failure_count",
            "classification_complete",
        ):
            if links.get(field) is not None:
                add(errors, f"link_health.{field} must be null when no report is generated")
        return

    evidence = links.get("evidence_path")
    if not isinstance(evidence, str) or not (ROOT / evidence).exists():
        add(errors, "link_health.evidence_path must reference the committed classified report")
    for field in ("repair_required_count", "registered_source_count", "classified_source_count", "checker_failure_count"):
        if not is_nonnegative_int(links.get(field)):
            add(errors, f"link_health.{field} must be a non-negative integer")
    if not isinstance(links.get("classification_complete"), bool):
        add(errors, "link_health.classification_complete must be a boolean")
    classified = links.get("classified_source_count")
    if is_nonnegative_int(classified) and sum(count for count in categories.values() if is_nonnegative_int(count)) != classified:
        add(errors, "link-health category counts do not sum to classified_source_count")
    complete = links.get("classification_complete") is True
    registered = links.get("registered_source_count")
    failures = links.get("checker_failure_count")
    if complete and (classified != registered or failures != 0):
        add(errors, "complete link-health classification must cover all registered sources with no checker failures")


def validate_manifest(doc: dict[str, Any], errors: list[str]) -> None:
    missing = sorted(REQUIRED_TOP_LEVEL - doc.keys())
    if missing:
        add(errors, "missing top-level fields: " + ", ".join(missing))
    if doc.get("schema") != "fuel_resilience_trust_status.v2":
        add(errors, "schema must be fuel_resilience_trust_status.v2")
    if doc.get("status") not in ALLOWED_STATUSES:
        add(errors, "status is not in the allowed set")
    if "bootstrap_notice" in doc:
        add(errors, "bootstrap trust manifests are not publication evidence")

    project = doc.get("project")
    if not isinstance(project, dict):
        add(errors, "project must be an object")
    else:
        if project.get("official_status") != "not_official":
            add(errors, "project.official_status must be not_official")
        if project.get("repository") != "WowCorey/fuel-fertilizer-dashboard":
            add(errors, "project.repository is incorrect")

    inventory = doc.get("source_inventory")
    if not isinstance(inventory, dict):
        add(errors, "source_inventory must be an object")
    else:
        modes = inventory.get("modes")
        if not isinstance(modes, dict):
            add(errors, "source_inventory.modes must be an object")
        else:
            if set(modes) != ALLOWED_MODES:
                add(errors, "source_inventory.modes must contain exactly the four known modes and total")
            for key, value in modes.items():
                if not is_nonnegative_int(value):
                    add(errors, f"source_inventory.modes.{key} must be a non-negative integer")
            expected_total = sum(modes.get(mode, 0) for mode in ("programmatic", "manual", "derived", "unavailable"))
            if modes.get("total") != expected_total:
                add(errors, "source mode counts do not sum to total")

        presence = inventory.get("envelope_presence")
        if not isinstance(presence, dict):
            add(errors, "source_inventory.envelope_presence must be an object")
        elif isinstance(modes, dict):
            if set(presence) != PRESENCE_MODES:
                add(errors, "source_inventory.envelope_presence must contain all four explicit presence states")
            for key, value in presence.items():
                if not is_nonnegative_int(value):
                    add(errors, f"source_inventory.envelope_presence.{key} must be a non-negative integer")
            if sum(value for value in presence.values() if is_nonnegative_int(value)) != modes.get("total"):
                add(errors, "envelope presence counts do not sum to total sources")

        expected_modes, expected_presence = expected_source_inventory(errors)
        if modes != expected_modes:
            add(errors, "source mode counts do not match data/source_manifest.json")
        if presence != expected_presence:
            add(errors, "envelope presence counts do not match data/source_manifest.json")
        envelopes = inventory.get("envelopes")
        if not isinstance(envelopes, dict):
            add(errors, "source_inventory.envelopes must be an object")
        else:
            if set(envelopes) != ENVELOPE_FIELDS:
                add(errors, "source_inventory.envelopes must contain the explicit envelope inventory fields")
            for key, value in envelopes.items():
                if not is_nonnegative_int(value):
                    add(errors, f"source_inventory.envelopes.{key} must be a non-negative integer")
            if envelopes != expected_envelope_inventory():
                add(errors, "envelope file counts do not match committed generated and manual envelopes")
        if inventory.get("evidence_path") != "data/source_manifest.json":
            add(errors, "source_inventory.evidence_path must be data/source_manifest.json")

    validation = doc.get("validation")
    if not isinstance(validation, dict):
        add(errors, "validation must be an object")
    else:
        for field in ("error_count", "warning_count"):
            if not is_nonnegative_int(validation.get(field)):
                add(errors, f"validation.{field} must be a non-negative integer")
        if validation.get("ok") is not (validation.get("error_count") == 0):
            add(errors, "validation.ok does not match error_count")
        categories = validation.get("warning_categories")
        if not isinstance(categories, dict):
            add(errors, "validation.warning_categories must be an object")
        else:
            if set(categories) != WARNING_CATEGORIES:
                add(errors, "validation.warning_categories must contain all explicit warning categories")
            for category, count in categories.items():
                if not is_nonnegative_int(count):
                    add(errors, f"validation.warning_categories.{category} must be a non-negative integer")
            if sum(count for count in categories.values() if is_nonnegative_int(count)) != validation.get("warning_count"):
                add(errors, "validation warning categories do not sum to warning_count")
        examples = validation.get("warning_examples")
        if not isinstance(examples, dict):
            add(errors, "validation.warning_examples must be an object")
        else:
            unexpected_examples = set(examples) - WARNING_CATEGORIES
            if unexpected_examples:
                add(errors, "validation.warning_examples contains an unknown warning category")
            for category, items in examples.items():
                if not isinstance(items, list) or len(items) > 8:
                    add(errors, f"validation.warning_examples.{category} must contain at most eight items")
                    continue
                for index, item in enumerate(items):
                    if not isinstance(item, dict):
                        add(errors, f"validation.warning_examples.{category}[{index}] must be an object")
                        continue
                    path = item.get("path")
                    message = item.get("message")
                    if not isinstance(path, str) or len(path) > 180:
                        add(errors, f"validation.warning_examples.{category}[{index}].path is invalid")
                    if not isinstance(message, str) or len(message) > 320:
                        add(errors, f"validation.warning_examples.{category}[{index}].message is invalid")
        evidence = validation.get("evidence_path")
        if not isinstance(evidence, str) or not (ROOT / evidence).exists():
            add(errors, "validation.evidence_path must reference an existing repository file")

    validate_refresh(doc.get("latest_refresh"), errors)
    validate_link_health(doc.get("link_health"), errors)

    workflows = doc.get("workflow_configuration")
    if not isinstance(workflows, list) or not workflows:
        add(errors, "workflow_configuration must be a non-empty list")
    else:
        seen: set[str] = set()
        for index, item in enumerate(workflows):
            if not isinstance(item, dict):
                add(errors, f"workflow_configuration[{index}] must be an object")
                continue
            workflow_id = item.get("id")
            if not isinstance(workflow_id, str) or not workflow_id:
                add(errors, f"workflow_configuration[{index}].id is required")
            elif workflow_id in seen:
                add(errors, f"duplicate workflow id: {workflow_id}")
            else:
                seen.add(workflow_id)
            if item.get("status") != "configured":
                add(errors, f"workflow_configuration[{index}] may claim configuration only")
            forbidden_run_fields = {"conclusion", "run_conclusion", "latest_run", "last_run_status"}
            if forbidden_run_fields & item.keys():
                add(errors, f"workflow_configuration[{index}] contains an unverified run-result field")
            evidence = item.get("evidence_path")
            if not isinstance(evidence, str) or not (ROOT / evidence).exists():
                add(errors, f"workflow_configuration[{index}].evidence_path does not exist")
            meaning = str(item.get("meaning") or "").strip().lower()
            if not meaning:
                add(errors, f"workflow_configuration[{index}].meaning is required")
            if any(term in meaning for term in (" workflow passed", " workflow succeeded", " latest run passed", " latest run succeeded")):
                add(errors, f"workflow_configuration[{index}] must not claim an unverified run result")

    bands = doc.get("confidence_bands")
    expected_bands = {"programmatic", "manual", "derived", "unavailable"}
    if not isinstance(bands, list):
        add(errors, "confidence_bands must be a list")
    else:
        actual = {item.get("id") for item in bands if isinstance(item, dict)}
        if actual != expected_bands:
            add(errors, "confidence_bands must define programmatic, manual, derived and unavailable")

    rules = doc.get("trust_rules")
    if not isinstance(rules, list) or len(rules) < 5:
        add(errors, "trust_rules must contain at least five rules")

    boundary = str(doc.get("claim_boundary") or "").lower()
    required_terms = (
        "not a certification",
        "not an official government",
        "not a security audit",
        "not proof that every upstream value is correct",
        "not proof that every source is reachable",
        "not a risk score",
    )
    for term in required_terms:
        if term not in boundary:
            add(errors, f"claim_boundary must include: {term}")


def validate_page(errors: list[str]) -> None:
    if not PAGE_PATH.exists():
        add(errors, "ui_kits/trust-status-dashboard/index.html is missing")
        return
    text = PAGE_PATH.read_text(encoding="utf-8")
    required = [
        "Trust Status",
        "trust_status_manifest.json",
        "Not an official government dashboard",
        "not a certification",
        "Source inventory",
        "Validation and review debt",
        "Link health",
    ]
    for phrase in required:
        if phrase not in text:
            add(errors, f"trust status page is missing required phrase: {phrase}")
    forbidden = [
        "unpkg.com/react",
        "react.development.js",
        "react-dom.development.js",
        "innerHTML",
        "outerHTML",
        "insertAdjacentHTML",
        "document.write",
    ]
    for phrase in forbidden:
        if phrase in text:
            add(errors, f"trust status page contains forbidden runtime pattern: {phrase}")
    if re.search(r"<script\b[^>]*\bsrc\s*=\s*['\"]https?://", text, flags=re.IGNORECASE):
        add(errors, "trust status page must not load external JavaScript")


def main() -> int:
    errors: list[str] = []
    doc = load_manifest(errors)
    if doc:
        validate_manifest(doc, errors)
    validate_page(errors)

    if errors:
        for error in errors:
            print(f"ERROR {error}", file=sys.stderr)
        print(f"trust status validation failed: {len(errors)} error(s)", file=sys.stderr)
        return 1
    print("trust status v2 ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())
