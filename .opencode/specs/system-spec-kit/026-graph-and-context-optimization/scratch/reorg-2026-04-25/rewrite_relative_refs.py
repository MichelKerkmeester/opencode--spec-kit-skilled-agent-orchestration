#!/usr/bin/env python3
"""
Fix relative path cross-references inside reorged child packets.

The first-pass rewrite operated on full-spec-path strings like
`026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning`.
That missed two patterns:
  1. `../NNN-old-name/` sibling references that need renumbering after the move
  2. Cross-tree pointers (`../old-sibling-now-moved-to-008-or-007/`)

This script handles both. Per-tree rules are explicit. Skips iteration/logs.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

REPO_ROOT = Path("/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public")
SPEC_ROOT = REPO_ROOT / ".opencode/specs/system-spec-kit/026-graph-and-context-optimization"
LOG_DIR = SPEC_ROOT / "scratch/reorg-2026-04-25/logs"

SKIP_PATH_REGEXES = [
    re.compile(r"/iterations/"),
    re.compile(r"/logs/"),
    re.compile(r"/review-archive-"),
    re.compile(r"/scratch/reorg-2026-04-25/"),
    re.compile(r"/\.git/"),
    re.compile(r"/prompts/iteration-"),
]

SKIP_EXTS = {".log", ".jsonl"}


# Inside-tree renumber maps: old slot name → new slot name.
INTERNAL_RENUMBER = {
    "010-hook-parity": {
        "003-hook-parity-remediation":           "001-hook-parity-remediation",
        "004-copilot-hook-parity-remediation":   "002-copilot-hook-parity-remediation",
        "005-codex-hook-parity-remediation":     "003-codex-hook-parity-remediation",
        "006-claude-hook-findings-remediation":  "004-claude-hook-findings-remediation",
        "007-opencode-plugin-loader-remediation": "005-opencode-plugin-loader-remediation",
        "010-copilot-wrapper-schema-fix":        "006-copilot-wrapper-schema-fix",
        "011-copilot-writer-wiring":             "007-copilot-writer-wiring",
        "012-docs-impact-remediation":           "008-docs-impact-remediation",
    },
    "008-skill-advisor": {
        # 006-search-routing-advisor children: only renumber those that closed the gap at 004.
        "005-skill-advisor-docs-and-code-alignment":         "004-skill-advisor-docs-and-code-alignment",
        "006-smart-router-remediation-and-opencode-plugin":  "005-smart-router-remediation-and-opencode-plugin",
        "007-deferred-remediation-and-telemetry-run":        "006-deferred-remediation-and-telemetry-run",
        # 010-hook-package advisor children → 008 with new slots 007-011.
        # Old slot referenced via ../001-skill-advisor-hook-surface (when sibling INSIDE 010).
        "001-skill-advisor-hook-surface":                    "007-skill-advisor-hook-surface",
        "002-skill-graph-daemon-and-advisor-unification":    "008-skill-graph-daemon-and-advisor-unification",
        "008-skill-advisor-plugin-hardening":                "009-skill-advisor-plugin-hardening",
        "009-skill-advisor-standards-alignment":             "010-skill-advisor-standards-alignment",
        "014-skill-advisor-hook-improvements":               "011-skill-advisor-hook-improvements",
    },
    "007-code-graph": {
        # 010 → 007 children get new slots 004 and 005. Internal sibling refs to those.
        "013-code-graph-hook-improvements":                  "004-code-graph-hook-improvements",
        "015-code-graph-advisor-refinement":                 "005-code-graph-advisor-refinement",
    },
}

# Cross-tree relocations: when an advisor or code-graph packet moved OUT of 010 into another wrapper,
# refs to it from inside 010-hook-parity must traverse up two levels.
# Map: old child name → (new wrapper, new child name)
ADVISOR_RELOCATIONS = {
    "001-skill-advisor-hook-surface":                    ("008-skill-advisor", "007-skill-advisor-hook-surface"),
    "002-skill-graph-daemon-and-advisor-unification":    ("008-skill-advisor", "008-skill-graph-daemon-and-advisor-unification"),
    "008-skill-advisor-plugin-hardening":                ("008-skill-advisor", "009-skill-advisor-plugin-hardening"),
    "009-skill-advisor-standards-alignment":             ("008-skill-advisor", "010-skill-advisor-standards-alignment"),
    "014-skill-advisor-hook-improvements":               ("008-skill-advisor", "011-skill-advisor-hook-improvements"),
    "013-code-graph-hook-improvements":                  ("007-code-graph", "004-code-graph-hook-improvements"),
    "015-code-graph-advisor-refinement":                 ("007-code-graph", "005-code-graph-advisor-refinement"),
}

# Top-level wrapper renumbering applied across all trees (from user's first-pass renumber that wasn't reflected in cross-refs).
TOP_LEVEL_RENUMBER = {
    "002-continuity-memory-runtime":           "003-continuity-memory-runtime",
    "008-runtime-executor-hardening":          "004-runtime-executor-hardening",
    "010-memory-indexer-invariants":           "005-memory-indexer-invariants",
    "010-memory-indexer-lineage-and-concurrency-fix": "005-memory-indexer-invariants",
    "011-resource-map-template":               "002-resource-map-template",
    "011-index-scope-and-constitutional-tier-invariants": "005-memory-indexer-invariants",
    "003-code-graph-package":                  "007-code-graph",
    "005-release-cleanup-playbooks":           "000-release-cleanup-playbooks",
    "006-search-routing-advisor":              "008-skill-advisor",
    "009-hook-package":                        "010-hook-parity",
    "010-hook-package":                        "010-hook-parity",
}

# Fully-qualified relative refs of the form `../../<wrapper>/<oldslot>/` — globally rewritten regardless of source tree.
# Order matters: longest specifics first.
QUALIFIED_RELOCATIONS = [
    # 010-hook-parity slots: renumber stays in same wrapper.
    ("../../010-hook-parity/003-hook-parity-remediation/",            "../../010-hook-parity/001-hook-parity-remediation/"),
    ("../../010-hook-parity/004-copilot-hook-parity-remediation/",    "../../010-hook-parity/002-copilot-hook-parity-remediation/"),
    ("../../010-hook-parity/005-codex-hook-parity-remediation/",      "../../010-hook-parity/003-codex-hook-parity-remediation/"),
    ("../../010-hook-parity/006-claude-hook-findings-remediation/",   "../../010-hook-parity/004-claude-hook-findings-remediation/"),
    ("../../010-hook-parity/007-opencode-plugin-loader-remediation/", "../../010-hook-parity/005-opencode-plugin-loader-remediation/"),
    ("../../010-hook-parity/010-copilot-wrapper-schema-fix/",         "../../010-hook-parity/006-copilot-wrapper-schema-fix/"),
    ("../../010-hook-parity/011-copilot-writer-wiring/",              "../../010-hook-parity/007-copilot-writer-wiring/"),
    ("../../010-hook-parity/012-docs-impact-remediation/",            "../../010-hook-parity/008-docs-impact-remediation/"),
    # 010-hook-parity slots that MOVED OUT to 008/007.
    ("../../010-hook-parity/001-skill-advisor-hook-surface/",         "../../008-skill-advisor/007-skill-advisor-hook-surface/"),
    ("../../010-hook-parity/002-skill-graph-daemon-and-advisor-unification/", "../../008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/"),
    ("../../010-hook-parity/008-skill-advisor-plugin-hardening/",     "../../008-skill-advisor/009-skill-advisor-plugin-hardening/"),
    ("../../010-hook-parity/009-skill-advisor-standards-alignment/",  "../../008-skill-advisor/010-skill-advisor-standards-alignment/"),
    ("../../010-hook-parity/014-skill-advisor-hook-improvements/",    "../../008-skill-advisor/011-skill-advisor-hook-improvements/"),
    ("../../010-hook-parity/013-code-graph-hook-improvements/",       "../../007-code-graph/004-code-graph-hook-improvements/"),
    ("../../010-hook-parity/015-code-graph-advisor-refinement/",      "../../007-code-graph/005-code-graph-advisor-refinement/"),
    # 008-skill-advisor close-the-gap renumber for 006-children (005→004, 006→005, 007→006).
    ("../../008-skill-advisor/005-skill-advisor-docs-and-code-alignment/",      "../../008-skill-advisor/004-skill-advisor-docs-and-code-alignment/"),
    ("../../008-skill-advisor/006-smart-router-remediation-and-opencode-plugin/", "../../008-skill-advisor/005-smart-router-remediation-and-opencode-plugin/"),
    ("../../008-skill-advisor/007-deferred-remediation-and-telemetry-run/",      "../../008-skill-advisor/006-deferred-remediation-and-telemetry-run/"),
    # Top-level wrapper renames at fully-qualified depth.
    ("../../008-runtime-executor-hardening/", "../../004-runtime-executor-hardening/"),
    ("../../002-continuity-memory-runtime/",  "../../003-continuity-memory-runtime/"),
    ("../../010-memory-indexer-invariants/",  "../../005-memory-indexer-invariants/"),
    ("../../011-resource-map-template/",      "../../002-resource-map-template/"),
    ("../../005-release-cleanup-playbooks/",  "../../000-release-cleanup-playbooks/"),
    ("../../003-code-graph-package/",         "../../007-code-graph/"),
    ("../../006-search-routing-advisor/",     "../../008-skill-advisor/"),
    ("../../009-hook-package/",               "../../010-hook-parity/"),
    ("../../010-hook-package/",               "../../010-hook-parity/"),
]

# Per-source-tree CROSS-tree relocations: when a sibling moved to a different wrapper, the relative path
# changes from `../<old>/` to `../../<new-wrapper>/<new>/`.
# Already covered for 010-hook-parity in ADVISOR_RELOCATIONS. Add for 008/007 trees.
CROSS_TREE_FROM_008 = {
    # When the file is inside 008-skill-advisor and references something that USED TO live in 010 alongside it
    # but is now in 010-hook-parity (after rename + renumber):
    "003-hook-parity-remediation":           ("010-hook-parity", "001-hook-parity-remediation"),
    "004-copilot-hook-parity-remediation":   ("010-hook-parity", "002-copilot-hook-parity-remediation"),
    "005-codex-hook-parity-remediation":     ("010-hook-parity", "003-codex-hook-parity-remediation"),
    "006-claude-hook-findings-remediation":  ("010-hook-parity", "004-claude-hook-findings-remediation"),
    "007-opencode-plugin-loader-remediation": ("010-hook-parity", "005-opencode-plugin-loader-remediation"),
    "010-copilot-wrapper-schema-fix":        ("010-hook-parity", "006-copilot-wrapper-schema-fix"),
    "011-copilot-writer-wiring":             ("010-hook-parity", "007-copilot-writer-wiring"),
    "012-docs-impact-remediation":           ("010-hook-parity", "008-docs-impact-remediation"),
    # And to 007-code-graph for code-graph slots that were in 010:
    "013-code-graph-hook-improvements":      ("007-code-graph", "004-code-graph-hook-improvements"),
    "015-code-graph-advisor-refinement":     ("007-code-graph", "005-code-graph-advisor-refinement"),
}

CROSS_TREE_FROM_007 = {
    # Files in 007-code-graph/004 or /005 (came from 010) referencing old 010 siblings.
    "001-skill-advisor-hook-surface":         ("008-skill-advisor", "007-skill-advisor-hook-surface"),
    "002-skill-graph-daemon-and-advisor-unification": ("008-skill-advisor", "008-skill-graph-daemon-and-advisor-unification"),
    "008-skill-advisor-plugin-hardening":     ("008-skill-advisor", "009-skill-advisor-plugin-hardening"),
    "009-skill-advisor-standards-alignment":  ("008-skill-advisor", "010-skill-advisor-standards-alignment"),
    "014-skill-advisor-hook-improvements":    ("008-skill-advisor", "011-skill-advisor-hook-improvements"),
    "003-hook-parity-remediation":            ("010-hook-parity", "001-hook-parity-remediation"),
    "004-copilot-hook-parity-remediation":    ("010-hook-parity", "002-copilot-hook-parity-remediation"),
    "005-codex-hook-parity-remediation":      ("010-hook-parity", "003-codex-hook-parity-remediation"),
    "006-claude-hook-findings-remediation":   ("010-hook-parity", "004-claude-hook-findings-remediation"),
    "007-opencode-plugin-loader-remediation": ("010-hook-parity", "005-opencode-plugin-loader-remediation"),
}


def should_skip(path: Path) -> bool:
    rel = str(path)
    if any(rx.search(rel) for rx in SKIP_PATH_REGEXES):
        return True
    if path.suffix.lower() in SKIP_EXTS:
        return True
    return False


def find_owning_tree(path: Path) -> str | None:
    """Return the immediate child of SPEC_ROOT that contains path, e.g. '010-hook-parity'."""
    try:
        rel = path.relative_to(SPEC_ROOT)
    except ValueError:
        return None
    parts = rel.parts
    return parts[0] if parts else None


def apply_to_text(text: str, tree: str) -> tuple[str, list[tuple[str, str, int]]]:
    applied: list[tuple[str, str, int]] = []

    def replace(patt: str, replacement: str) -> None:
        nonlocal text
        if patt in text:
            count = text.count(patt)
            text = text.replace(patt, replacement)
            applied.append((patt, replacement, count))

    # 1. Fully-qualified relocations (../../<wrapper>/<oldslot>/) — globally rewritten.
    for patt, replacement in QUALIFIED_RELOCATIONS:
        replace(patt, replacement)

    # 2. Tree-specific cross-tree from 008 to other wrappers (sibling form `../<oldslot>/`).
    if tree == "008-skill-advisor":
        for old, (new_wrapper, new_name) in CROSS_TREE_FROM_008.items():
            replace(f"../{old}/", f"../../{new_wrapper}/{new_name}/")

    # 3. Tree-specific cross-tree from 007 to other wrappers.
    if tree == "007-code-graph":
        for old, (new_wrapper, new_name) in CROSS_TREE_FROM_007.items():
            replace(f"../{old}/", f"../../{new_wrapper}/{new_name}/")

    # 4. Cross-tree from 010-hook-parity to 008/007 (sibling form).
    if tree == "010-hook-parity":
        for old, (new_wrapper, new_name) in ADVISOR_RELOCATIONS.items():
            replace(f"../{old}/", f"../../{new_wrapper}/{new_name}/")

    # 5. Internal renumber: `../OLD/` → `../NEW/` (per-tree).
    if tree in INTERNAL_RENUMBER:
        for old, new in INTERNAL_RENUMBER[tree].items():
            replace(f"../{old}/", f"../{new}/")

    # 6. Top-level wrapper rename via single `../` (e.g. ../008-runtime-executor-hardening/).
    for old, new in TOP_LEVEL_RENUMBER.items():
        if new is None:
            continue
        replace(f"../{old}/", f"../{new}/")

    return text, applied


def main() -> int:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    files_scanned = 0
    files_changed = 0
    total_replacements = 0
    log_rows: list[str] = []

    # Walk only the three reorged trees + root.
    targets: list[Path] = []
    for tree in ("007-code-graph", "008-skill-advisor", "010-hook-parity"):
        targets.append(SPEC_ROOT / tree)
    targets.append(SPEC_ROOT)  # for root files

    seen: set[Path] = set()
    for root in targets:
        for path in root.rglob("*"):
            if path in seen or not path.is_file() or should_skip(path):
                continue
            seen.add(path)
            files_scanned += 1
            tree = find_owning_tree(path) or ""
            try:
                text = path.read_text(encoding="utf-8")
            except (UnicodeDecodeError, OSError):
                continue
            new_text, applied = apply_to_text(text, tree)
            if applied:
                files_changed += 1
                count = sum(c for _, _, c in applied)
                total_replacements += count
                log_rows.append(f"{path}\t{count}\t{len(applied)}")
                path.write_text(new_text, encoding="utf-8")

    print(f"Files scanned     : {files_scanned}")
    print(f"Files changed     : {files_changed}")
    print(f"Total replacements: {total_replacements}")

    log_file = LOG_DIR / "rewrite_relative.log"
    log_file.write_text("\n".join(log_rows) + "\n", encoding="utf-8")
    print(f"Log: {log_file}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
