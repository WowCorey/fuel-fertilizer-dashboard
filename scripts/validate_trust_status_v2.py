#!/usr/bin/env python3
"""Validate the generated Trust Status v2 manifest and public page contract."""

from __future__ import annotations

import json
import pathlib
import sys
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "data" / "trust_status_manifest.json"
PAGE_PATH = ROOT / "ui_kits" / "trust-status-dashboard" / "index.html"

ALLOWED_STATUSES = {
    "operational",
    "operational_with_warnings",
    "refresh_status_unknown",
    "validation_failed",
}
ALLOWED_MODES = {"programmatic", "manual", "derived", "unavailable", "total"}
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


def validate_manifest(doc: dict[str, Any], errors: list[str]) -> None:
    missing = sorted(REQUIRED_TOP_LEVEL - doc.keys())
    if missing:
        add(errors, "missing top-level fields: " + ", ".join(missing))
    if doc.get("schema") != "fuel_resilience_trust_status.v2":
        add(errors, "schema must be fuel_resilience_trust_status.v2")
    if doc.get("status") not in ALLOWED_STATUSES:
        add(errors, "status is not in the allowed set")

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
            unexpected = sorted(set(modes) - ALLOWED_MODES)
            if unexpected:
                add(errors, "unexpected source modes: " + ", ".join(unexpected))
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
            for key, value in presence.items():
                if not is_nonnegative_int(value):
                    add(errors, f"source_inventory.envelope_presence.{key} must be a non-negative integer")
            if sum(value for value in presence.values() if is_nonnegative_int(value)) != modes.get("total"):
                add(errors, "envelope presence counts do not sum to total sources")

    validation = doc.get("validation")
    if not isinstance(validation, dict):
        add(errors, "validation must be an object")
    else:
        for field in ("error_count", "warning_count"):
            if not is_nonnegative_int(validation.get(field)):
                add(errors, f"validation.{field} must be a non-negative integer")
        if validation.get("ok") is not (validation.get("error_count") == 0):
            add(errors, "validation.ok does not match error_count")
        evidence = validation.get("evidence_path")
        if not isinstance(evidence, str) or not (ROOT / evidence).exists():
            add(errors, "validation.evidence_path must reference an existing repository file")

    refresh = doc.get("latest_refresh")
    if not isinstance(refresh, dict):
        add(errors, "latest_refresh must be an object")
    else:
        evidence = refresh.get("evidence_path")
        if not isinstance(evidence, str) or not (ROOT / evidence).exists():
            add(errors, "latest_refresh.evidence_path must reference the committed refresh marker")
        semantics = str(refresh.get("sha_semantics") or "").lower()
        if "input commit" not in semantics or "published refresh" not in semantics:
            add(errors, "latest_refresh.sha_semantics must disclose the current marker ambiguity")

    links = doc.get("link_health")
    if not isinstance(links, dict):
        add(errors, "link_health must be an object")
    else:
        if links.get("status") not in {"available", "not_yet_generated"}:
            add(errors, "link_health.status is invalid")
        if links.get("advisory") is not True:
            add(errors, "link health must remain advisory")
        boundary = str(links.get("claim_boundary") or "").lower()
        if "not" not in boundary or not any(term in boundary for term in ("proof", "imply", "does not")):
            add(errors, "link_health.claim_boundary must reject over-interpretation")

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
            evidence = item.get("evidence_path")
            if not isinstance(evidence, str) or not (ROOT / evidence).exists():
                add(errors, f"workflow_configuration[{index}].evidence_path does not exist")
            meaning = str(item.get("meaning") or "").lower()
            if "configuration" not in meaning and "configured" not in meaning:
                add(errors, f"workflow_configuration[{index}] must distinguish configuration from a run result")

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
    required_terms = ("not a certification", "not an official government", "not a security audit")
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
        "innerHTML =",
        "insertAdjacentHTML",
    ]
    for phrase in forbidden:
        if phrase in text:
            add(errors, f"trust status page contains forbidden runtime pattern: {phrase}")


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
