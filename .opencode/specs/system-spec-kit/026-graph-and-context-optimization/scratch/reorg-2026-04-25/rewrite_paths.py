#!/usr/bin/env python3
"""
Apply ordered path-string substitutions across the 026 spec tree.

Order: longest-prefix-first to avoid prefix collisions
(e.g. `009-hook-package/008-skill-advisor-plugin-hardening` is replaced
before the bare `009-hook-package` → `010-hook-parity` rule fires).

Skips iteration logs and review iteration files (point-in-time audit
artifacts) and the mapping.json sidecar itself.

Usage:
    python3 rewrite_paths.py [--dry-run]

Run from repo root.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Iterable, Iterator

REPO_ROOT = Path("/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public")
SPEC_ROOT = REPO_ROOT / ".opencode/specs/system-spec-kit/026-graph-and-context-optimization"
MAPPING_PATH = SPEC_ROOT / "scratch/reorg-2026-04-25/mapping.json"
LOG_DIR = SPEC_ROOT / "scratch/reorg-2026-04-25/logs"

# Skip file extensions that are binary/non-textual.
BINARY_EXTS = {".db", ".sqlite", ".sqlite3", ".so", ".dylib", ".png", ".jpg", ".jpeg", ".pdf", ".zip", ".tar", ".gz", ".pyc"}

# Skip extensions for historical CLI captures.
SKIP_EXTS = {".log"}

# Skip files matching any of these regex patterns (preserve historical truth).
SKIP_PATH_REGEXES = [
    re.compile(r"/iterations/"),       # /research/.../iterations/ and /review/iterations/
    re.compile(r"/logs/"),             # /research/.../logs/
    re.compile(r"/review-archive-"),   # archived review packets
    re.compile(r"/scratch/reorg-2026-04-25/"),
    re.compile(r"/\.git/"),
    re.compile(r"/prompts/iteration-"),  # iteration prompts are point-in-time
]

# Specifically preserve old-path strings in this file (audit trail).
PRESERVE_FILES = {"merged-phase-map.md"}


def load_substitutions() -> list[tuple[str, str]]:
    with MAPPING_PATH.open() as fh:
        data = json.load(fh)
    rules = []
    for entry in data["substitutions_ordered"]:
        if isinstance(entry, dict):
            rules.append((entry["old"], entry["new"]))
    # Verify: rules already sorted longest-first by construction in mapping.json.
    # Re-sort defensively.
    rules.sort(key=lambda r: -len(r[0]))
    return rules


def should_skip(path: Path) -> bool:
    rel = str(path)
    if any(rx.search(rel) for rx in SKIP_PATH_REGEXES):
        return True
    if path.suffix.lower() in BINARY_EXTS or path.suffix.lower() in SKIP_EXTS:
        return True
    if path.name in PRESERVE_FILES:
        return True
    return False


def iter_files(root: Path) -> Iterator[Path]:
    for dirpath, dirnames, filenames in os.walk(root):
        rel = dirpath + "/"
        if any(rx.search(rel) for rx in SKIP_PATH_REGEXES):
            dirnames[:] = []
            continue
        for name in filenames:
            yield Path(dirpath) / name


def apply_substitutions(content: str, rules: list[tuple[str, str]]) -> tuple[str, list[tuple[str, str, int]]]:
    """Return (new_content, applied) where applied = [(old, new, count), ...]."""
    applied: list[tuple[str, str, int]] = []
    out = content
    for old, new in rules:
        if old in out:
            count = out.count(old)
            out = out.replace(old, new)
            applied.append((old, new, count))
    return out, applied


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Report what would change without writing")
    args = parser.parse_args()

    LOG_DIR.mkdir(parents=True, exist_ok=True)
    rules = load_substitutions()
    print(f"Loaded {len(rules)} substitution rules from mapping.json")
    print(f"Walking {SPEC_ROOT}")

    files_scanned = 0
    files_changed = 0
    files_skipped = 0
    total_substitutions = 0
    rule_counts: dict[tuple[str, str], int] = {r: 0 for r in rules}
    log_rows: list[str] = []

    for path in iter_files(SPEC_ROOT):
        files_scanned += 1
        if should_skip(path):
            files_skipped += 1
            continue
        try:
            raw = path.read_bytes()
        except OSError as e:
            print(f"  read-error {path}: {e}", file=sys.stderr)
            continue
        try:
            text = raw.decode("utf-8")
        except UnicodeDecodeError:
            files_skipped += 1
            continue

        new_text, applied = apply_substitutions(text, rules)
        if applied:
            files_changed += 1
            for old, new, count in applied:
                total_substitutions += count
                rule_counts[(old, new)] += count
            log_rows.append(f"{path}\t{sum(c for _, _, c in applied)}\t{len(applied)}")
            if not args.dry_run:
                path.write_text(new_text, encoding="utf-8")

    print()
    print(f"Files scanned : {files_scanned}")
    print(f"Files changed : {files_changed}")
    print(f"Files skipped : {files_skipped}")
    print(f"Total replacements: {total_substitutions}")
    print()
    print("Per-rule replacement counts:")
    for (old, new), count in sorted(rule_counts.items(), key=lambda kv: -kv[1]):
        if count:
            # Show the differentiating tail of each path for readability.
            old_tail = "/".join(old.split("/")[-2:]) if "/" in old else old
            new_tail = "/".join(new.split("/")[-2:]) if "/" in new else new
            print(f"  {count:5d}  {old_tail:60s}  ->  {new_tail}")

    log_file = LOG_DIR / ("rewrite-dry-run.log" if args.dry_run else "rewrite.log")
    log_file.write_text("\n".join(log_rows) + "\n", encoding="utf-8")
    print(f"\nPer-file log: {log_file}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
