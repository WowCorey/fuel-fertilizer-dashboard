#!/usr/bin/env python3
"""Run repository tests with deterministic pytest settings.

This wrapper keeps local developer runs and CI behavior aligned. It disables
third-party pytest plugin autoload by default so unrelated global plugins do
not interfere with this repository's test suite.
"""

from __future__ import annotations

import os
import subprocess
import sys


def main() -> int:
    env = os.environ.copy()
    env.setdefault("PYTEST_DISABLE_PLUGIN_AUTOLOAD", "1")
    cmd = [sys.executable, "-m", "pytest", "-q"]
    return subprocess.call(cmd, env=env)


if __name__ == "__main__":
    raise SystemExit(main())
