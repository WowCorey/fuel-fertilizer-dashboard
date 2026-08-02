#!/usr/bin/env python3
"""Validate the fail-closed national status-model readiness gate."""

from __future__ import annotations

import datetime as dt
import json
import pathlib
import sys
from collections import Counter
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parent.parent
GATE_PATH = ROOT / "data" / "national_status_model_gate.json"
SOURCE_MANIFEST_PATH = ROOT / "data" / "source_manifest.json"
TRUST_MANIFEST_PATH = ROOT / "data" / "trust_status_manifest.json"
ROUTES_PATH = ROOT / "data" / "site_routes.json"

SCHEMA = "fuel_resilience_national_status_model_gate.v1"
SOURCE_MODES = ("programmatic", "manual", "derived", "unavailable")
READINESS_STATUSES = {"blocked", "partially_ready", "ready"}
READINESS_DIMENSIONS = {
    "coverage_readiness",
    "freshness_readiness",
    "methodology_readiness",
    "rights_readiness",
    "operational_readiness",
    "communication_readiness",
}
DECISIONS = {
    "blocked",
    "partially_ready",
    "ready_for_experimental_internal_modelling",
    "ready_for_public_non_composite_indicators",
    "ready_for_public_composite_model",
}
OUTCOMES = {
    "blocked",
    "partially_ready",
    "ready_for_experimental_internal_modelling",
    "ready_for_public_non_composite_indicators",
    "ready_for_public_composite_model",
}
CLAIMS = {
    "fuel_availability_status",
    "fuel_security_status",
    "supply_chain_status",
    "resilience_status",
    "national_risk_level",
    "composite_national_score",
}
CLAIM_STATUSES = {
    "blocked",
    "ready_for_experimental_internal_modelling",
    "ready_for_public_non_composite_indicators",
    "ready_for_public_composite_model",
}
REQUIRED_INDICATORS = {
    "fuel_security_status_model",
    "fuel_security_live_station_outage_feed",
    "fuel_security_live_vessel_tracking",
    "fuel_security_terminal_capacity",
    "fuel_security_petrol_days_remaining",
    "fuel_security_diesel_days_remaining",
    "fuel_security_jet_days_remaining",
    "pmc_mso_fuel_reserves",
    "pmc_forward_import_orders",
    "pmc_tankers_on_water",
    "pmc_retail_stockouts",
}
APPROVED_INVARIANT_THRESHOLDS = {
    "maximum_unknown_source_modes",
    "maximum_missing_source_envelopes",
    "maximum_unresolved_contributing_rights",
    "maximum_stale_critical_inputs",
    "maximum_unvalidated_derived_inputs",
}
UNRESOLVED_THRESHOLD_IDS = {
    "minimum_current_outage_geographic_coverage_percent",
    "maximum_unavailable_contributing_input_percent",
    "minimum_historical_baseline_periods",
    "maximum_single_publisher_weight_percent",
    "source_specific_freshness_windows",
}
REQUIRED_BLOCKERS = {
    "model_definition_conflict",
    "national_outage_coverage_missing",
    "terminal_capacity_unavailable",
    "vessel_shipping_rights_blocked",
    "programmatic_national_snapshot_contract_missing",
    "source_specific_freshness_thresholds_unapproved",
    "historical_baseline_missing",
    "transition_rules_and_tests_missing",
    "coverage_thresholds_unapproved",
    "publisher_concentration_unmeasured",
    "approved_methodology_missing",
}


def load_json(path: pathlib.Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        value = json.load(handle)
    if not isinstance(value, dict):
        raise ValueError(f"{path.relative_to(ROOT).as_posix()} must contain a JSON object")
    return value


def is_integer(value: Any) -> bool:
    return type(value) is int


def valid_date(value: Any) -> bool:
    if not isinstance(value, str):
        return False
    try:
        dt.date.fromisoformat(value)
        return True
    except ValueError:
        return False


def nonempty(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def add(errors: list[str], path: str, message: str) -> None:
    errors.append(f"{path}: {message}")


def require_exact_keys(errors: list[str], path: str, value: Any, expected: set[str]) -> dict[str, Any]:
    if not isinstance(value, dict):
        add(errors, path, "must be an object")
        return {}
    actual = set(value)
    if actual != expected:
        missing = sorted(expected - actual)
        unknown = sorted(actual - expected)
        if missing:
            add(errors, path, f"missing required keys: {', '.join(missing)}")
        if unknown:
            add(errors, path, f"unknown keys: {', '.join(unknown)}")
    return value


def source_inventory(source_manifest: dict[str, Any], errors: list[str]) -> tuple[dict[str, int], dict[str, int]]:
    if source_manifest.get("schema") != "fuel_resilience_source_manifest.v1":
        add(errors, "data/source_manifest.json:schema", "unexpected source-manifest schema")
    sources = source_manifest.get("sources")
    if not isinstance(sources, dict):
        add(errors, "data/source_manifest.json:sources", "must be an object")
        return {}, {}

    mode_counts: Counter[str] = Counter()
    presence_counts: Counter[str] = Counter()
    for source_id, source in sources.items():
        path = f"data/source_manifest.json:sources.{source_id}"
        if not isinstance(source, dict):
            add(errors, path, "must be an object")
            continue
        mode = source.get("fetch")
        if mode not in SOURCE_MODES:
            add(errors, f"{path}.fetch", f"unknown source mode {mode!r}")
        else:
            mode_counts[mode] += 1

        generated = source.get("has_generated")
        manual = source.get("has_manual")
        if type(generated) is not bool or type(manual) is not bool:
            add(errors, path, "has_generated and has_manual must be booleans")
            continue
        if generated and manual:
            presence_counts["both"] += 1
        elif generated:
            presence_counts["generated_only"] += 1
        elif manual:
            presence_counts["manual_only"] += 1
        else:
            presence_counts["missing"] += 1

    expected_modes = {mode: mode_counts[mode] for mode in SOURCE_MODES}
    expected_modes["total"] = len(sources)
    expected_presence = {key: presence_counts[key] for key in ("generated_only", "manual_only", "both", "missing")}
    expected_presence["total"] = len(sources)
    return expected_modes, expected_presence


def trust_warning_counts(trust_manifest: dict[str, Any], errors: list[str]) -> dict[str, int]:
    validation = trust_manifest.get("validation")
    if not isinstance(validation, dict):
        add(errors, "data/trust_status_manifest.json:validation", "must be an object")
        return {}
    categories = validation.get("warning_categories")
    expected_keys = (
        "manual_stale",
        "generated_stale",
        "rights_metadata",
        "source_name_mismatch",
        "source_url_mismatch",
        "other",
    )
    if not isinstance(categories, dict):
        add(errors, "data/trust_status_manifest.json:validation.warning_categories", "must be an object")
        return {}
    result: dict[str, int] = {}
    for key in expected_keys:
        value = categories.get(key)
        if not is_integer(value) or value < 0:
            add(errors, f"data/trust_status_manifest.json:validation.warning_categories.{key}", "must be a non-negative integer")
        else:
            result[key] = value
    warning_count = validation.get("warning_count")
    if not is_integer(warning_count) or warning_count < 0:
        add(errors, "data/trust_status_manifest.json:validation.warning_count", "must be a non-negative integer")
    else:
        result["total"] = warning_count
        if len(result) == len(expected_keys) + 1 and sum(result[key] for key in expected_keys) != warning_count:
            add(errors, "data/trust_status_manifest.json:validation", "warning categories do not sum to warning_count")
    return result


def public_route_count(routes: dict[str, Any], errors: list[str]) -> int | None:
    raw_routes = routes.get("routes")
    if not isinstance(raw_routes, list):
        add(errors, "data/site_routes.json:routes", "must be an array")
        return None
    count = 0
    for index, route in enumerate(raw_routes):
        if not isinstance(route, dict) or type(route.get("public")) is not bool:
            add(errors, f"data/site_routes.json:routes[{index}]", "must be an object with boolean public")
        elif route["public"]:
            count += 1
    return count


def load_indicator_states(root: pathlib.Path, errors: list[str]) -> dict[str, str]:
    result: dict[str, str] = {}
    for source_id in sorted(REQUIRED_INDICATORS):
        candidates = [root / "data" / directory / f"{source_id}.json" for directory in ("generated", "manual")]
        existing = [path for path in candidates if path.exists()]
        if not existing:
            add(errors, f"current_repository.required_indicator_states.{source_id}", "evidence envelope is missing")
            continue
        statuses: set[str] = set()
        for path in existing:
            try:
                envelope = load_json(path)
            except (OSError, ValueError, json.JSONDecodeError) as exc:
                add(errors, path.relative_to(root).as_posix(), f"cannot read indicator envelope: {exc}")
                continue
            status = envelope.get("status")
            if not nonempty(status):
                add(errors, path.relative_to(root).as_posix(), "status must be a non-empty string")
            else:
                statuses.add(status)
        if len(statuses) > 1:
            add(errors, f"current_repository.required_indicator_states.{source_id}", "generated/manual envelope statuses conflict")
        elif statuses:
            result[source_id] = next(iter(statuses))
    return result


def validate_snapshot(
    gate: dict[str, Any],
    source_manifest: dict[str, Any],
    trust_manifest: dict[str, Any],
    routes: dict[str, Any],
    indicator_states: dict[str, str],
    errors: list[str],
) -> None:
    current = gate.get("current_repository")
    if not isinstance(current, dict):
        add(errors, "current_repository", "must be an object")
        return

    expected_modes, expected_presence = source_inventory(source_manifest, errors)
    expected_warnings = trust_warning_counts(trust_manifest, errors)
    expected_routes = public_route_count(routes, errors)

    for field, expected in (("source_modes", expected_modes), ("envelope_presence", expected_presence), ("validation_warnings", expected_warnings)):
        actual = current.get(field)
        if not isinstance(actual, dict):
            add(errors, f"current_repository.{field}", "must be an object")
            continue
        if any(not is_integer(value) or value < 0 for value in actual.values()):
            add(errors, f"current_repository.{field}", "all counts must be non-negative integers; null and booleans are not counts")
        if expected and actual != expected:
            add(errors, f"current_repository.{field}", f"count mismatch: expected {expected}, found {actual}")

    actual_routes = current.get("public_routes")
    if not is_integer(actual_routes) or actual_routes < 0:
        add(errors, "current_repository.public_routes", "must be a non-negative integer")
    elif expected_routes is not None and actual_routes != expected_routes:
        add(errors, "current_repository.public_routes", f"count mismatch: expected {expected_routes}, found {actual_routes}")

    actual_indicators = require_exact_keys(
        errors,
        "current_repository.required_indicator_states",
        current.get("required_indicator_states"),
        REQUIRED_INDICATORS,
    )
    if actual_indicators and actual_indicators != indicator_states:
        add(errors, "current_repository.required_indicator_states", f"state mismatch: expected {indicator_states}, found {actual_indicators}")


def validate_thresholds(gate: dict[str, Any], errors: list[str]) -> None:
    thresholds = gate.get("thresholds")
    if not isinstance(thresholds, list):
        add(errors, "thresholds", "must be an array")
        return
    by_id: dict[str, dict[str, Any]] = {}
    required_text = (
        "rationale",
        "measurement_method",
        "sensitivity_justification",
        "failure_behavior",
        "owner",
    )
    for index, threshold in enumerate(thresholds):
        path = f"thresholds[{index}]"
        if not isinstance(threshold, dict):
            add(errors, path, "must be an object")
            continue
        threshold_id = threshold.get("id")
        if not nonempty(threshold_id):
            add(errors, f"{path}.id", "must be a non-empty string")
            continue
        if threshold_id in by_id:
            add(errors, f"{path}.id", "duplicate threshold id")
        by_id[threshold_id] = threshold
        for field in required_text:
            if not nonempty(threshold.get(field)):
                add(errors, f"{path}.{field}", "must be a non-empty string")
        if not valid_date(threshold.get("reviewed_at")):
            add(errors, f"{path}.reviewed_at", "must be an ISO date")
        if threshold.get("kind") not in {"minimum", "maximum", "maximum_age"}:
            add(errors, f"{path}.kind", "unknown threshold kind")
        if not nonempty(threshold.get("unit")):
            add(errors, f"{path}.unit", "must be a non-empty string")

    actual_ids = set(by_id)
    required_ids = APPROVED_INVARIANT_THRESHOLDS | UNRESOLVED_THRESHOLD_IDS
    if actual_ids != required_ids:
        if required_ids - actual_ids:
            add(errors, "thresholds", f"missing required threshold ids: {', '.join(sorted(required_ids - actual_ids))}")
        if actual_ids - required_ids:
            add(errors, "thresholds", f"unknown threshold ids: {', '.join(sorted(actual_ids - required_ids))}")

    for threshold_id in sorted(APPROVED_INVARIANT_THRESHOLDS):
        threshold = by_id.get(threshold_id)
        if not threshold:
            continue
        if threshold.get("status") != "approved_invariant":
            add(errors, f"thresholds.{threshold_id}.status", "must remain approved_invariant in schema v1")
        if not is_integer(threshold.get("value")) or threshold.get("value") != 0:
            add(errors, f"thresholds.{threshold_id}.value", "must be integer zero; null, booleans and silent coercion are forbidden")

    for threshold_id in sorted(UNRESOLVED_THRESHOLD_IDS):
        threshold = by_id.get(threshold_id)
        if not threshold:
            continue
        if threshold.get("status") != "unresolved_approval_gate":
            add(errors, f"thresholds.{threshold_id}.status", "must remain unresolved_approval_gate until schema and validator review")
        if threshold.get("value") is not None:
            add(errors, f"thresholds.{threshold_id}.value", "must be null while unresolved; null-to-zero conversion is forbidden")


def validate_blockers(gate: dict[str, Any], errors: list[str]) -> tuple[dict[str, dict[str, Any]], set[str]]:
    blockers = gate.get("blocking_conditions")
    if not isinstance(blockers, list):
        add(errors, "blocking_conditions", "must be an array")
        return {}, set()
    by_id: dict[str, dict[str, Any]] = {}
    open_ids: set[str] = set()
    for index, blocker in enumerate(blockers):
        path = f"blocking_conditions[{index}]"
        if not isinstance(blocker, dict):
            add(errors, path, "must be an object")
            continue
        blocker_id = blocker.get("id")
        if not nonempty(blocker_id):
            add(errors, f"{path}.id", "must be a non-empty string")
            continue
        if blocker_id in by_id:
            add(errors, f"{path}.id", "duplicate blocking-condition id")
        by_id[blocker_id] = blocker
        status = blocker.get("status")
        if status not in {"open", "resolved"}:
            add(errors, f"{path}.status", "must be open or resolved")
        elif status == "open":
            open_ids.add(blocker_id)
        for field in ("summary", "condition_to_clear"):
            if not nonempty(blocker.get(field)):
                add(errors, f"{path}.{field}", "must be a non-empty string")
        claims = blocker.get("affected_claims")
        if not isinstance(claims, list) or not claims or any(claim not in CLAIMS for claim in claims):
            add(errors, f"{path}.affected_claims", "must be a non-empty array of known claim ids")
        paths = blocker.get("evidence_paths")
        if not isinstance(paths, list) or not paths or any(not nonempty(item) for item in paths):
            add(errors, f"{path}.evidence_paths", "must be a non-empty array of paths")
    if set(by_id) != REQUIRED_BLOCKERS:
        if REQUIRED_BLOCKERS - set(by_id):
            add(errors, "blocking_conditions", f"missing required ids: {', '.join(sorted(REQUIRED_BLOCKERS - set(by_id)))}")
        if set(by_id) - REQUIRED_BLOCKERS:
            add(errors, "blocking_conditions", f"unknown ids: {', '.join(sorted(set(by_id) - REQUIRED_BLOCKERS))}")
    return by_id, open_ids


def validate_references(gate: dict[str, Any], blockers: dict[str, dict[str, Any]], open_ids: set[str], errors: list[str]) -> None:
    dimensions = require_exact_keys(errors, "readiness_dimensions", gate.get("readiness_dimensions"), READINESS_DIMENSIONS)
    for dimension_id, dimension in dimensions.items():
        path = f"readiness_dimensions.{dimension_id}"
        if not isinstance(dimension, dict):
            add(errors, path, "must be an object")
            continue
        status = dimension.get("status")
        if status not in READINESS_STATUSES:
            add(errors, f"{path}.status", f"unknown readiness category {status!r}")
        if not nonempty(dimension.get("rationale")):
            add(errors, f"{path}.rationale", "must be a non-empty string")
        refs = dimension.get("blocking_condition_ids")
        if not isinstance(refs, list) or any(ref not in blockers for ref in refs):
            add(errors, f"{path}.blocking_condition_ids", "must reference only known blocking conditions")
            refs = []
        if status == "ready" and refs:
            add(errors, f"{path}.status", "cannot be ready while blocking conditions are referenced")
        if status == "blocked" and not any(ref in open_ids for ref in refs):
            add(errors, f"{path}.blocking_condition_ids", "blocked dimension must reference an open condition")
        evidence = dimension.get("evidence_paths")
        if not isinstance(evidence, list) or not evidence or any(not nonempty(item) for item in evidence):
            add(errors, f"{path}.evidence_paths", "must be a non-empty array of paths")

    claims = require_exact_keys(errors, "claim_assessments", gate.get("claim_assessments"), CLAIMS)
    for claim_id, assessment in claims.items():
        path = f"claim_assessments.{claim_id}"
        if not isinstance(assessment, dict):
            add(errors, path, "must be an object")
            continue
        status = assessment.get("status")
        if status not in CLAIM_STATUSES:
            add(errors, f"{path}.status", f"unknown claim readiness category {status!r}")
        if not nonempty(assessment.get("rationale")):
            add(errors, f"{path}.rationale", "must be a non-empty string")
        refs = assessment.get("blocking_condition_ids")
        if not isinstance(refs, list) or any(ref not in blockers for ref in refs):
            add(errors, f"{path}.blocking_condition_ids", "must reference only known blocking conditions")
            refs = []
        if status != "blocked" and any(ref in open_ids for ref in refs):
            add(errors, f"{path}.status", "cannot be ready while an open blocking condition is referenced")
        if status == "blocked" and not any(ref in open_ids for ref in refs):
            add(errors, f"{path}.blocking_condition_ids", "blocked claim must reference an open condition")


def validate_publication(gate: dict[str, Any], open_ids: set[str], errors: list[str]) -> None:
    decision = gate.get("decision")
    if decision not in DECISIONS:
        add(errors, "decision", f"unknown decision {decision!r}")
    outcome = gate.get("current_outcome")
    if outcome not in OUTCOMES:
        add(errors, "current_outcome", f"unknown outcome {outcome!r}")
    if not nonempty(gate.get("decision_summary")):
        add(errors, "decision_summary", "must be a non-empty string")

    publication = gate.get("publication")
    if not isinstance(publication, dict):
        add(errors, "publication", "must be an object")
        return
    boolean_fields = (
        "public_composite_model_ready",
        "composite_score_allowed",
        "project_status_label_allowed",
        "methodology_approved",
    )
    for field in boolean_fields:
        if type(publication.get(field)) is not bool:
            add(errors, f"publication.{field}", "must be a boolean")
    active = publication.get("active_blocking_condition_ids")
    if not isinstance(active, list) or set(active) != open_ids or len(active) != len(set(active)):
        add(errors, "publication.active_blocking_condition_ids", "must exactly list each open blocking condition once")

    ready_flags = any(publication.get(field) is True for field in ("public_composite_model_ready", "composite_score_allowed", "project_status_label_allowed"))
    if open_ids and ready_flags:
        add(errors, "publication", "public-ready or publication flags cannot be true while blocking conditions remain")
    if publication.get("methodology_approved") is not True and ready_flags:
        add(errors, "publication", "score/status publication requires approved methodology")
    if publication.get("composite_score_allowed") is not True and publication.get("published_score") is not None:
        add(errors, "publication.published_score", "must be null when composite score publication is not allowed")
    if publication.get("project_status_label_allowed") is not True and publication.get("published_status_label") is not None:
        add(errors, "publication.published_status_label", "must be null when project status-label publication is not allowed")
    if publication.get("methodology_approved") is not True and (
        publication.get("published_score") is not None or publication.get("published_status_label") is not None
    ):
        add(errors, "publication", "published score/status values require approved methodology")
    if open_ids and decision == "ready_for_public_composite_model":
        add(errors, "decision", "cannot be public-composite ready while blocking conditions remain")
    if open_ids and outcome == "ready_for_public_composite_model":
        add(errors, "current_outcome", "cannot be public-composite ready while blocking conditions remain")
    if decision == "ready_for_public_composite_model" or outcome == "ready_for_public_composite_model":
        required_ready = (
            publication.get("public_composite_model_ready") is True
            and publication.get("composite_score_allowed") is True
            and publication.get("project_status_label_allowed") is True
            and publication.get("methodology_approved") is True
        )
        if not required_ready:
            add(errors, "publication", "public-composite readiness requires every publication and methodology flag")

    approval = publication.get("approval")
    if not isinstance(approval, dict):
        add(errors, "publication.approval", "must be an object")
    else:
        status = approval.get("status")
        if status not in {"not_approved", "approved"}:
            add(errors, "publication.approval.status", "must be not_approved or approved")
        if status == "not_approved" and (approval.get("approved_by") is not None or approval.get("approved_at") is not None):
            add(errors, "publication.approval", "unapproved gate must keep approver and approval time null")
        if status == "approved" and (not nonempty(approval.get("approved_by")) or not nonempty(approval.get("approved_at"))):
            add(errors, "publication.approval", "approved gate requires approver and approval time")


def validate_paths_and_boundary(gate: dict[str, Any], root: pathlib.Path, errors: list[str]) -> None:
    paths: set[str] = set()
    top_paths = gate.get("evidence_paths")
    if not isinstance(top_paths, list) or not top_paths:
        add(errors, "evidence_paths", "must be a non-empty array")
    else:
        paths.update(item for item in top_paths if nonempty(item))
    current = gate.get("current_repository")
    if isinstance(current, dict):
        current_paths = current.get("evidence_paths")
        if not isinstance(current_paths, list) or not current_paths:
            add(errors, "current_repository.evidence_paths", "must be a non-empty array")
        else:
            paths.update(item for item in current_paths if nonempty(item))
    dimensions = gate.get("readiness_dimensions")
    if isinstance(dimensions, dict):
        for dimension in dimensions.values():
            if isinstance(dimension, dict) and isinstance(dimension.get("evidence_paths"), list):
                paths.update(item for item in dimension["evidence_paths"] if nonempty(item))
    blockers = gate.get("blocking_conditions")
    if isinstance(blockers, list):
        for blocker in blockers:
            if isinstance(blocker, dict) and isinstance(blocker.get("evidence_paths"), list):
                paths.update(item for item in blocker["evidence_paths"] if nonempty(item))
    for relative in sorted(paths):
        candidate = pathlib.PurePosixPath(relative)
        if candidate.is_absolute() or ".." in candidate.parts:
            add(errors, "evidence_paths", f"unsafe path {relative!r}")
        elif not (root / pathlib.Path(*candidate.parts)).exists():
            add(errors, "evidence_paths", f"missing repository evidence path {relative!r}")

    boundary = gate.get("claim_boundary")
    if not isinstance(boundary, list) or any(not nonempty(item) for item in boundary):
        add(errors, "claim_boundary", "must be an array of non-empty strings")
        return
    joined = " ".join(boundary).lower()
    required_phrases = ("government", "every upstream", "private fuel stocks", "every terminal", "all disruptions", "predicts shortages", "security assessment")
    for phrase in required_phrases:
        if phrase not in joined:
            add(errors, "claim_boundary", f"missing required boundary phrase {phrase!r}")


def validate_gate(
    gate: dict[str, Any],
    source_manifest: dict[str, Any],
    trust_manifest: dict[str, Any],
    routes: dict[str, Any],
    indicator_states: dict[str, str],
    *,
    root: pathlib.Path = ROOT,
) -> list[str]:
    errors: list[str] = []
    if gate.get("schema") != SCHEMA:
        add(errors, "schema", f"must equal {SCHEMA}")
    if not valid_date(gate.get("reviewed_at")):
        add(errors, "reviewed_at", "must be an ISO date")
    validate_snapshot(gate, source_manifest, trust_manifest, routes, indicator_states, errors)
    validate_thresholds(gate, errors)
    blockers, open_ids = validate_blockers(gate, errors)
    validate_references(gate, blockers, open_ids, errors)
    validate_publication(gate, open_ids, errors)
    validate_paths_and_boundary(gate, root, errors)
    return errors


def main() -> int:
    try:
        gate = load_json(GATE_PATH)
        source_manifest = load_json(SOURCE_MANIFEST_PATH)
        trust_manifest = load_json(TRUST_MANIFEST_PATH)
        routes = load_json(ROUTES_PATH)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"national status gate bootstrap error: {exc}", file=sys.stderr)
        return 1
    bootstrap_errors: list[str] = []
    indicator_states = load_indicator_states(ROOT, bootstrap_errors)
    errors = bootstrap_errors + validate_gate(gate, source_manifest, trust_manifest, routes, indicator_states)
    if errors:
        for error in errors:
            print(f"ERROR {error}", file=sys.stderr)
        print(f"national status gate invalid: {len(errors)} error(s)", file=sys.stderr)
        return 1
    print("national status gate ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())
