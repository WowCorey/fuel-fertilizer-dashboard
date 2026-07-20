#!/usr/bin/env python3
"""Validate the Fuel Resilience AU trust status manifest.

This is intentionally conservative. The trust layer is allowed to be simple, but
it must not reference missing repository evidence paths or publish malformed
health signals.
"""

from __future__ import annotations

import json
import pathlib
import sys
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parent.parent
TRUST_MANIFEST = ROOT / "data" / "trust_status_manifest.json"
ALLOWED_HEALTH_STATUSES = {"configured", "manual", "source_gated", "unavailable", "unknown"}
REQUIRED_TOP_LEVEL = {
    "schema",
    "status",
    "project",
    "public_health_signals",
    "source_confidence_bands",
    "trust_rules",
    "known_gaps",
    "next_build_steps",
    "claim_boundary",
}


def fail(message: str) -> None:
    print(f"trust-status validation failed: {message}", file=sys.stderr)
    sys.exit(1)


def require_list(doc: dict[str, Any], key: str) -> list[Any]:
    value = doc.get(key)
    if not isinstance(value, list) or not value:
        fail(f"{key} must be a non-empty list")
    return value


def main() -> None:
    if not TRUST_MANIFEST.exists():
        fail("data/trust_status_manifest.json is missing")

    try:
        doc = json.loads(TRUST_MANIFEST.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"manifest is not valid JSON: {exc}")

    missing = sorted(REQUIRED_TOP_LEVEL - set(doc))
    if missing:
        fail("missing top-level fields: " + ", ".join(missing))

    if doc.get("schema") != "fuel_resilience_trust_status.v1":
        fail("schema must be fuel_resilience_trust_status.v1")

    if not isinstance(doc.get("claim_boundary"), str) or "official" not in doc["claim_boundary"].lower():
        fail("claim_boundary must explicitly avoid official-status confusion")

    health = require_list(doc, "public_health_signals")
    seen_ids: set[str] = set()
    for idx, item in enumerate(health):
        if not isinstance(item, dict):
            fail(f"public_health_signals[{idx}] must be an object")
        signal_id = item.get("id")
        if not isinstance(signal_id, str) or not signal_id:
            fail(f"public_health_signals[{idx}].id must be a non-empty string")
        if signal_id in seen_ids:
            fail(f"duplicate public health signal id: {signal_id}")
        seen_ids.add(signal_id)
        if item.get("status") not in ALLOWED_HEALTH_STATUSES:
            fail(f"{signal_id} has unsupported status {item.get('status')!r}")
        evidence_path = item.get("evidence_path")
        if not isinstance(evidence_path, str) or not evidence_path:
            fail(f"{signal_id} must include evidence_path")
        resolved = (ROOT / evidence_path).resolve()
        if ROOT not in resolved.parents and resolved != ROOT:
            fail(f"{signal_id} evidence_path escapes repository root")
        if not resolved.exists():
            fail(f"{signal_id} evidence_path does not exist: {evidence_path}")
        if not isinstance(item.get("plain_english"), str) or not item["plain_english"].strip():
            fail(f"{signal_id} must include plain_english")

    bands = require_list(doc, "source_confidence_bands")
    for idx, item in enumerate(bands):
        if not isinstance(item, dict):
            fail(f"source_confidence_bands[{idx}] must be an object")
        for key in ("id", "label", "trust_level", "render_rule", "meaning"):
            if not isinstance(item.get(key), str) or not item[key].strip():
                fail(f"source_confidence_bands[{idx}].{key} must be a non-empty string")

    for key in ("trust_rules", "known_gaps", "next_build_steps"):
        require_list(doc, key)

    print("trust-status validation passed")


if __name__ == "__main__":
    main()
