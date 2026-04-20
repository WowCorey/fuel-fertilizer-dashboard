#!/usr/bin/env python3
"""Calculate and optionally apply semantic version bumps from commit messages."""

from __future__ import annotations

import argparse
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
VERSION_FILE = ROOT / "VERSION"

CC_RE = re.compile(r"^(?P<type>[a-z]+)(\([^)]+\))?(?P<bang>!)?: ")


def run(cmd: list[str]) -> str:
    cp = subprocess.run(cmd, check=True, capture_output=True, text=True)
    return cp.stdout.strip()


def read_version() -> tuple[int, int, int]:
    raw = VERSION_FILE.read_text(encoding="utf-8").strip()
    parts = raw.split(".")
    if len(parts) != 3 or not all(p.isdigit() for p in parts):
        raise ValueError(f"Invalid VERSION value: {raw!r}")
    return int(parts[0]), int(parts[1]), int(parts[2])


def write_version(v: tuple[int, int, int]) -> None:
    VERSION_FILE.write_text(f"{v[0]}.{v[1]}.{v[2]}\n", encoding="utf-8")


def latest_tag() -> str | None:
    try:
        tag = run(["git", "describe", "--tags", "--abbrev=0", "--match", "v[0-9]*"])
        return tag or None
    except subprocess.CalledProcessError:
        return None


def commit_subjects(since_ref: str | None) -> list[str]:
    revspec = f"{since_ref}..HEAD" if since_ref else "HEAD"
    out = run(["git", "log", "--format=%s%n%b<<END>>", revspec])
    chunks = [c.strip() for c in out.split("<<END>>") if c.strip()]
    return chunks


def classify_bump(messages: list[str]) -> str | None:
    bump = None
    for msg in messages:
        first = msg.splitlines()[0] if msg.splitlines() else ""
        body = "\n".join(msg.splitlines()[1:])
        m = CC_RE.match(first)
        if not m:
            continue
        typ = m.group("type")
        bang = bool(m.group("bang"))
        breaking = bang or ("BREAKING CHANGE:" in body)
        if breaking:
            return "major"
        if typ == "feat":
            bump = "minor" if bump != "minor" else bump
        elif typ in {"fix", "perf", "refactor", "data", "docs", "test", "chore", "ci", "build", "style"}:
            if bump is None:
                bump = "patch"
    return bump


def increment(v: tuple[int, int, int], bump: str) -> tuple[int, int, int]:
    major, minor, patch = v
    if bump == "major":
        return major + 1, 0, 0
    if bump == "minor":
        return major, minor + 1, 0
    if bump == "patch":
        return major, minor, patch + 1
    return v


def main() -> int:
    ap = argparse.ArgumentParser(description="Semver bump from Conventional Commits")
    ap.add_argument("--write", action="store_true", help="Write bumped version to VERSION")
    ap.add_argument("--tag", action="store_true", help="Create git tag for the bumped version")
    ap.add_argument("--base-ref", default="", help="Optional base ref/tag for commit scan")
    args = ap.parse_args()

    if not VERSION_FILE.exists():
        print(f"[X] Missing VERSION file at {VERSION_FILE}")
        return 1

    base = args.base_ref.strip() or latest_tag()
    messages = commit_subjects(base)
    bump = classify_bump(messages)
    current = read_version()
    if bump is None:
        print(f"[OK] No semver bump required. Current version: {current[0]}.{current[1]}.{current[2]}")
        return 0

    new_version = increment(current, bump)
    new_text = f"{new_version[0]}.{new_version[1]}.{new_version[2]}"
    print(f"[OK] Bump type: {bump}")
    print(f"[OK] Version: {current[0]}.{current[1]}.{current[2]} -> {new_text}")

    if args.write:
        write_version(new_version)
        print("[OK] VERSION updated")

    if args.tag:
        tag = f"v{new_text}"
        try:
            subprocess.run(["git", "tag", tag], check=True)
            print(f"[OK] Tag created: {tag}")
        except subprocess.CalledProcessError as exc:
            print(f"[X] Failed to create tag {tag}: {exc}")
            return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
