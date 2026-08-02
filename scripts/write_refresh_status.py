#!/usr/bin/env python3
"""Prepare or finalize the machine-readable refresh publication marker.

Marker v2 uses two commits to avoid claiming that a commit contains its own
SHA. The prepared marker travels with the generated data commit. After that
commit is pushed, a second commit records its SHA and the successful push.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import pathlib
import re
import subprocess
import sys
from typing import Any, Mapping

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "last_successful_refresh.json"
SCHEMA_V2 = "fuel_resilience_refresh_status.v2"
SHA_PATTERN = re.compile(r"^[0-9a-f]{40}$")


def git_sha() -> str | None:
    env_sha = os.environ.get("GITHUB_SHA")
    if env_sha:
        return env_sha.lower()
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "HEAD"],
            cwd=ROOT,
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip().lower()
    except (OSError, subprocess.CalledProcessError):
        return None


def prepare_payload(
    *,
    now: dt.datetime | None = None,
    environ: Mapping[str, str] | None = None,
    input_sha: str | None = None,
) -> dict[str, Any]:
    env = environ if environ is not None else os.environ
    refreshed_at = (now or dt.datetime.now(dt.timezone.utc)).astimezone(dt.timezone.utc).isoformat(
        timespec="seconds"
    )
    workflow_input_sha = (input_sha or git_sha())
    if workflow_input_sha:
        workflow_input_sha = workflow_input_sha.lower()
    return {
        "schema": SCHEMA_V2,
        "status": "pending_publication",
        "publication_state": "prepared",
        "refreshed_at": refreshed_at,
        "source_data_refreshed_at": refreshed_at,
        "git_sha": workflow_input_sha,
        "workflow_input_sha": workflow_input_sha,
        "workflow": env.get("GITHUB_WORKFLOW"),
        "run_id": env.get("GITHUB_RUN_ID"),
        "run_attempt": env.get("GITHUB_RUN_ATTEMPT"),
        "workflow_run_id": env.get("GITHUB_RUN_ID"),
        "workflow_run_attempt": env.get("GITHUB_RUN_ATTEMPT"),
        "ref": env.get("GITHUB_REF"),
        "branch": env.get("GITHUB_REF_NAME"),
        "output_commit_sha": None,
        "output_commit_pushed": False,
        "sha_semantics": (
            "workflow_input_sha identifies the workflow input commit. output_commit_sha remains null "
            "until the generated refresh output commit has been pushed."
        ),
    }


def finalize_payload(payload: dict[str, Any], output_commit_sha: str, *, pushed: bool) -> dict[str, Any]:
    if payload.get("schema") != SCHEMA_V2:
        raise ValueError("only a prepared v2 refresh marker can be finalized")
    normalized_sha = output_commit_sha.lower()
    if not SHA_PATTERN.fullmatch(normalized_sha):
        raise ValueError("output commit SHA must contain exactly 40 hexadecimal characters")
    if not pushed:
        raise ValueError("finalization requires proof that the output commit push succeeded")

    finalized = dict(payload)
    finalized.update(
        {
            "status": "success",
            "publication_state": "published",
            "output_commit_sha": normalized_sha,
            "output_commit_pushed": True,
            "sha_semantics": (
                "workflow_input_sha identifies the workflow input commit. output_commit_sha identifies "
                "the earlier pushed commit containing the generated refresh output; it is not the later "
                "marker commit and is not proof of the latest deployed commit."
            ),
        }
    )
    return finalized


def write_payload(payload: dict[str, Any]) -> None:
    OUT.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT.relative_to(ROOT)} ({payload.get('publication_state')})")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--finalize",
        metavar="OUTPUT_COMMIT_SHA",
        help="finalize an existing prepared marker after this output commit was pushed",
    )
    parser.add_argument(
        "--pushed",
        action="store_true",
        help="confirm that the output commit push completed successfully",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.finalize:
        try:
            existing = json.loads(OUT.read_text(encoding="utf-8"))
            if not isinstance(existing, dict):
                raise ValueError("prepared marker must be a JSON object")
            payload = finalize_payload(existing, args.finalize, pushed=args.pushed)
        except (OSError, json.JSONDecodeError, ValueError) as exc:
            print(f"ERROR: cannot finalize refresh marker: {exc}", file=sys.stderr)
            return 1
    else:
        if args.pushed:
            print("ERROR: --pushed requires --finalize OUTPUT_COMMIT_SHA", file=sys.stderr)
            return 1
        payload = prepare_payload()
    write_payload(payload)
    return 0


if __name__ == "__main__":
    sys.exit(main())
