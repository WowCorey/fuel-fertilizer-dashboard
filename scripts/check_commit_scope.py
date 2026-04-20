#!/usr/bin/env python3
"""Fail commits that are too large or broad by default."""

from __future__ import annotations

import os
import subprocess
import sys

MAX_FILES = int(os.environ.get("MAX_COMMIT_FILES", "15"))
MAX_TOTAL_LINES = int(os.environ.get("MAX_COMMIT_LINES", "800"))
OVERRIDE_ENV = "ALLOW_LARGE_COMMIT"


def run(cmd: list[str]) -> str:
    cp = subprocess.run(cmd, check=True, capture_output=True, text=True)
    return cp.stdout.strip()


def main() -> int:
    if os.environ.get(OVERRIDE_ENV, "").strip() == "1":
        print(f"[OK] Scope guard bypassed ({OVERRIDE_ENV}=1).")
        return 0

    try:
        files = [line for line in run(["git", "diff", "--cached", "--name-only"]).splitlines() if line.strip()]
    except subprocess.CalledProcessError as exc:
        print(f"[X] Failed to inspect staged files: {exc}")
        return 1

    if not files:
        print("[X] No staged files. Stage changes before committing.")
        return 1

    if len(files) > MAX_FILES:
        print(f"[X] Commit too broad: {len(files)} staged files (limit {MAX_FILES}).")
        print("Split into smaller, targeted commits or set ALLOW_LARGE_COMMIT=1 for one-off bypass.")
        return 1

    total = 0
    try:
        numstat = run(["git", "diff", "--cached", "--numstat"])
    except subprocess.CalledProcessError as exc:
        print(f"[X] Failed to inspect staged diff stats: {exc}")
        return 1

    for line in numstat.splitlines():
        cols = line.split("\t")
        if len(cols) < 2:
            continue
        added, deleted = cols[0], cols[1]
        if added.isdigit():
            total += int(added)
        if deleted.isdigit():
            total += int(deleted)

    if total > MAX_TOTAL_LINES:
        print(f"[X] Commit too large: {total} changed lines (limit {MAX_TOTAL_LINES}).")
        print("Split into smaller, targeted commits or set ALLOW_LARGE_COMMIT=1 for one-off bypass.")
        return 1

    print(f"[OK] Commit scope guard passed ({len(files)} files, {total} changed lines).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
