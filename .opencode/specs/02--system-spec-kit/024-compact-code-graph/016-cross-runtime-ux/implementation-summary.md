---
title: "Implementation Summary: Cross-Runtime UX & Documentation [024/016]"
description: "Near-exact seed resolution, auto-reindex on branch switch, cross-runtime Session Start Protocol, recovery doc consolidation, truth-sync annotations. 11/14 items completed."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-compact-code-graph/016-cross-runtime-ux |
| **Completed** | 2026-03-31 (3 items deferred) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Seed resolution is now more precise with a near-exact tier, the index auto-refreshes on branch switches, and all 5 runtimes have session start instructions that auto-trigger code graph and memory context loading.

### Near-Exact Seed Resolution (Item 39)

A new resolution tier sits between exact match and enclosing symbol. When a seed's file and line don't produce an exact match, the resolver queries within a +/-5 line window: `ABS(start_line - requestedLine) <= 5`. Confidence graduates from 0.95 (exact neighbor) down by 0.02 per line of distance. A composite index `idx_file_line ON code_nodes(file_path, start_line)` keeps this fast.

### Auto-Reindex on Branch Switch (Item 41)

`code_graph_scan` now checks `git rev-parse HEAD` against a stored `last_git_head` value in the `code_graph_metadata` table. When HEAD changes (branch switch, rebase, pull), a full reindex is triggered automatically. Stale DB entries for files no longer present after the switch are pruned.

### Seed-Resolver Error Handling (Item 44)

DB query failures in the seed resolver previously degraded silently to file-level placeholder anchors. Now they throw with logged context via `throwResolutionError()`, so callers know resolution actually failed rather than getting a misleading low-confidence anchor.

### Cross-Runtime Session Start Protocol (Item 42)

All instruction files now include a Session Start Protocol section:
- **CODEX.md**: Calls `memory_context()` with resume profile + `code_graph_status()` on first turn
- **AGENTS.md**: Code graph auto-trigger for Copilot CLI and Gemini CLI agents
- **OpenCode context.md**: Graph health check integrated into the exploration workflow with tool reference table
- **GEMINI.md**: Shares AGENTS.md content via symlink

### Recovery Documentation Consolidation (Item 43)

Universal recovery instructions moved to root CLAUDE.md (works on all runtimes). `.claude/CLAUDE.md` trimmed to Claude-specific hook-aware behavior only. No more overlapping authority between the two files.

### Truth-Sync Checklist Annotations (Item 46)

Five v1 checklist items that overstated shipped behavior now carry PARTIAL annotations with specific reasons: resume profile documentation gaps, tree-sitter vs regex indexer description, 3-source hook pipeline overclaiming, CocoIndex semantic neighbors not retrieved, and working-set-driven ranking not wired.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/code-graph/seed-resolver.ts` | Modified | Near-exact tier, error handling |
| `lib/code-graph/code-graph-db.ts` | Modified | idx_file_line index, code_graph_metadata table |
| `handlers/code-graph/scan.ts` | Modified | Git HEAD detection, auto-reindex |
| `CODEX.md` | Modified | Session Start Protocol |
| `AGENTS.md` | Modified | Code graph auto-trigger |
| `.opencode/agent/context.md` | Modified | Code graph integration |
| `CLAUDE.md` | Modified | Universal recovery |
| `.claude/CLAUDE.md` | Modified | Claude-specific only |
| Root `checklist.md` | Modified | PARTIAL annotations |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two Codex CLI agents (GPT-5.4, high reasoning). Agent 016-A handled seed resolution, auto-reindex, and DB changes. Agent 016-B handled all documentation updates and truth-sync annotations. New test coverage added for seed resolver (near-exact tier) and scan (git HEAD tracking). Verified with focused test suites and git diff checks on documentation files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| +/-5 line window for near-exact | Covers common line-shift scenarios (added imports, reformatting) without false matches. 5 lines is ~2x the typical diff hunk context. |
| Graduated confidence (0.95 - 0.02*distance) | Closer matches rank higher. At distance=5, confidence is 0.85 which is still above enclosing (0.7). |
| Throw on DB failure instead of placeholder | Silent degradation masked real problems. Callers need to know when resolution actually fails. |
| Shared Session Start Protocol across runtimes | One pattern for all runtimes means consistent documentation and testing. Runtime-specific hooks add reliability but the baseline works everywhere. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tests/code-graph-seed-resolver.vitest.ts` | PASS (new tests for near-exact tier) |
| `tests/code-graph-scan.vitest.ts` | PASS (git HEAD tracking tests) |
| `tests/crash-recovery.vitest.ts` | PASS (metadata table, index verification) |
| `git diff --check` on doc files | PASS |
| Phase 016 checklist | 11/14 items (3 deferred) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Intent pre-classifier not implemented (Item 40).** Requires CocoIndex API integration for semantic vs structural routing. Structural queries currently go to code graph, semantic queries require explicit CocoIndex tool use.
2. **SessionStart scope alignment deferred (Item 45).** Spec describes source-scoped matchers but settings.local.json has a single unscoped entry. Requires settings schema changes.
3. **CocoIndex score propagation not implemented.** Near-exact confidence is based on line distance only. Blending with CocoIndex relevance scores requires API work.
4. **Runtime verification is manual.** Each instruction file needs testing on its target runtime to confirm it loads correctly. Automated verification would require CI integration with all 5 CLIs.
<!-- /ANCHOR:limitations -->
