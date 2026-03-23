---
title: "Implementation Summary: 014-agents-md-alignment"
description: "Summary of changes made to align AGENTS.md Quick Reference tables with the 7-command memory suite."
trigger_phrases:
  - "013 summary"
  - "013 implementation"
importance_tier: "important"
contextType: "implementation-summary"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: 014-agents-md-alignment

> **Note:** The alignment changes from this phase were partially reverted by a subsequent AGENTS.md restructuring.

## What Changed

Updated Quick Reference workflow tables in all 3 AGENTS.md governance framework files to reflect the complete 7-command memory suite established by Phase 011 (command alignment).

## Changes by File

### 1. `AGENTS.md` (Universal Template)
- **Line 53**: Constitutional memory row — added `list | edit | remove | budget` subcommands
- **Line 55**: Database maintenance row — added `ingest` to operations list
- **Line 56**: Added new Analysis/evaluation row for `/memory:analyze`
- **Line 57**: Added new Shared memory row for `/memory:shared`

### 2. `AGENTS_example_fs_enterprises.md` (Full-Stack Template)
- **Line 64**: Research/exploration row — added `memory_context()` (unified) OR alternative
- **Line 80**: Constitutional memory row — added subcommands (same as Universal)
- **Line 82**: Database maintenance row — added `ingest` (same as Universal)
- **Line 83**: Added Analysis/evaluation row (same as Universal)
- **Line 84**: Added Shared memory row (same as Universal)

### 3. `Barter/coder/AGENTS.md` (Barter Multi-Repo Template)
- **Line 89**: Constitutional memory row — added subcommands (same as Universal)
- **Line 91**: Database maintenance row — added `ingest` (same as Universal)
- **Line 92**: Added Analysis/evaluation row (same as Universal)
- **Line 93**: Added Shared memory row (same as Universal)

## Verification Results

| Check | Result |
|-------|--------|
| `/memory:analyze` in all 3 files | 3/3 matches |
| `/memory:shared` in all 3 files | 3/3 matches |
| `ingest operations` in all 3 files | 3/3 matches |
| `list.*edit.*remove.*budget` in all 3 files | 3/3 matches |
| Barter `GIT POLICY: READ-ONLY` preserved | 1/1 match |
| FS-Enterprises `memory_context()` aligned | 1/1 match |

## Impact

- **LOC**: ~36 lines modified/added across 3 files
- **Commands visible**: 7 (was 5) — `continue`, `save`, `learn`, `manage`, `analyze`, `shared`, `context`
- **No code changes**: Documentation-only updates to markdown tables
- **No breaking changes**: Additive content only; existing rows preserved

## Refinement Pass (2026-03-16)

Four consistency gaps discovered during post-implementation verification:

| ID | Severity | File | Fix |
|----|----------|------|-----|
| G-01 | P1 | `AGENTS_example_fs_enterprises.md` | **Resume prior work** row: added `/memory:continue` command and `memory_search()` alternative (was missing, present in Universal + Barter) |
| G-02 | P1 | `AGENTS_example_fs_enterprises.md` | **Save context** row: added `/memory:save` command alternative (was missing, present in Universal + Barter) |
| G-03 | P2 | `AGENTS.md` | **Claim completion** row: removed trailing `  \|` (extra pipe) |
| G-04 | P2 | `Barter/coder/AGENTS.md` | **Claim completion** row: removed trailing `  \|` (extra pipe) |

All 3 AGENTS.md files now have identical command references for Resume prior work and Save context rows. Trailing pipe artifacts removed.

Two additional gaps found via GPT-5.4 ultra-think cross-AI review:

| ID | Severity | File | Fix |
|----|----------|------|-----|
| G-05 | P2 | `AGENTS_example_fs_enterprises.md` | **Documentation** row: added `validate_document.py` reference (was missing, present in Universal + Barter + CLAUDE.md) |
| G-06 | P2 | All 4 files | **File modification** row: reordered `Gate 1 → Gate 2 → Gate 3` to `Gate 3 → Gate 1 → Gate 2` to match Gate 3's "Overrides Gates 1-2" priority rule |

Gate ordering fix applied to: `AGENTS.md`, `AGENTS_example_fs_enterprises.md`, `Barter/coder/AGENTS.md`, `CLAUDE.md`.

### Quick Reference New Rows (Universal)

Added 3 skill workflow rows to Universal AGENTS.md Quick Reference table:
- **Web code** → `sk-code--web` skill
- **OpenCode system code** → `sk-code--opencode` skill
- **Git workflow** → `sk-git` skill

### Skill Section Overhaul

Replaced Barter-specific skill sections in both Universal and FS templates:

**Universal AGENTS.md:**
- `sk-code` (Barter multi-repo) → `sk-code--opencode` (OpenCode system code) with language table (JS, TS, Python, Shell, JSON/JSONC) and system-spec-kit + Spec Kit Memory references
- `sk-git` (read-only analysis) → `sk-git` (full workflow: Worktree / Commit / Finish)

**FS-Enterprises AGENTS.md:**
- `sk-code` (Barter multi-repo) → `sk-code--full-stack` (stack-agnostic orchestrator) with 3-phase lifecycle and stack verification table
- `sk-git` (read-only analysis) → `sk-git` (full workflow: Worktree / Commit / Finish)

### Changelog

Created `v2.2.0.0.md` in `.opencode/changelog/02--agents-md/` covering all refinement work.

## Status

**CLOSED** — All tasks complete (14/14), all checklist items verified, changelog created.
