#!/usr/bin/env python3
"""Install tracked git hooks from .githooks into .git/hooks."""

from __future__ import annotations

import os
import pathlib
import shutil
import stat
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / ".githooks"
DST = ROOT / ".git" / "hooks"
HOOKS = ("pre-commit", "commit-msg", "pre-push")


def main() -> int:
    if not SRC.exists():
        print(f"[X] Missing hook source directory: {SRC}")
        return 1
    if not DST.exists():
        print(f"[X] Missing git hooks directory: {DST}")
        return 1

    for name in HOOKS:
        src = SRC / name
        dst = DST / name
        if not src.exists():
            print(f"[X] Missing hook file: {src}")
            return 1
        shutil.copy2(src, dst)
        mode = os.stat(dst).st_mode
        os.chmod(dst, mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
        print(f"[OK] Installed {name}")

    print("[OK] Hooks installed from .githooks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
