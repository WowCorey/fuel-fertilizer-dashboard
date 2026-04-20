"""Resolve the active GitHub repo for scripts running in CI or locally.

Resolution order:
1. ``GITHUB_REPOSITORY`` env var (set by GitHub Actions to ``<owner>/<repo>``).
2. ``git remote get-url origin`` parsed from the working tree.
3. Upstream fallback ``WowCorey/fuel-fertilizer-dashboard``.

Used so User-Agent strings and any other repo-identifying metadata track
whichever fork is actually running the code rather than hardcoding the
upstream project.
"""

from __future__ import annotations

import os
import re
import subprocess

UPSTREAM_FALLBACK = "WowCorey/fuel-fertilizer-dashboard"

_REMOTE_PATTERNS = (
    re.compile(r"^https?://github\.com/(?P<slug>[^/]+/[^/]+?)(?:\.git)?/?$"),
    re.compile(r"^git@github\.com:(?P<slug>[^/]+/[^/]+?)(?:\.git)?/?$"),
    re.compile(r"^ssh://git@github\.com/(?P<slug>[^/]+/[^/]+?)(?:\.git)?/?$"),
)


def _from_env() -> str | None:
    slug = os.environ.get("GITHUB_REPOSITORY", "").strip()
    return slug or None


def _from_git_remote() -> str | None:
    try:
        url = subprocess.check_output(
            ["git", "remote", "get-url", "origin"],
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
    except (subprocess.CalledProcessError, FileNotFoundError, OSError):
        return None
    for pattern in _REMOTE_PATTERNS:
        m = pattern.match(url)
        if m:
            return m.group("slug")
    return None


def repo_slug() -> str:
    """Return ``<owner>/<repo>`` for the active repo."""
    return _from_env() or _from_git_remote() or UPSTREAM_FALLBACK


def repo_url() -> str:
    """Return the canonical ``https://github.com/<owner>/<repo>`` URL."""
    return f"https://github.com/{repo_slug()}"


def repo_issues_url() -> str:
    return f"{repo_url()}/issues"


def repo_wiki_url() -> str:
    return f"{repo_url()}/wiki"
