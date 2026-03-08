<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/implementation-summary.md -->
---
title: "Implementation Summary: Refactor /memory:learn → Constitutional Memory Manager"
status: done
level: 2
created: 2025-12-01
updated: 2026-03-08
description: "Complete rewrite of /memory:learn from a generic learning capture tool into a focused constitutional memory manager with 5 subcommands."
trigger_phrases:
  - "learn refactor summary"
  - "constitutional learn implementation"
  - "memory learn rewrite"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-constitutional-learn-refactor |
| **Completed** | 2026-03-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `/memory:learn` command was completely rewritten from a generic learning capture tool (620 lines, 5 learning types: pattern, mistake, insight, optimization, constraint) into a focused Constitutional Memory Manager (550 lines, 5 subcommands). Constitutional memories are always-surface rules that appear at the top of every search result with a 3.0x boost, never decay, and share a ~2000 token budget.

### Constitutional Memory Manager

The new command provides a dedicated lifecycle for constitutional memories. You can create new rules with guided qualification and budget checking, list all constitutional files with token counts, edit existing memories with re-indexing, remove memories with destructive-action confirmation, and check the token budget status. Each subcommand has a visual dashboard with action hints.

### Argument Routing

The command routes on `$ARGUMENTS`: empty shows the overview dashboard, recognized keywords (`list`, `edit`, `remove`, `budget`) route to their respective modes, and any other text triggers the CREATE workflow with that text as the rule description. A mandatory first-action block handles edge cases (missing filenames for edit/remove).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/command/memory/learn.md` | Rewritten | Complete replacement: 620-line generic learner → 550-line constitutional manager |
| `.opencode/command/memory/README.txt` | Modified | Updated learn command description, subcommands table, and examples |
| `CLAUDE.md` | Modified | Updated Quick Reference table: constitutional memory workflow |
| `.opencode/skill/system-spec-kit/README.md` | Modified | Updated /memory:learn description |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The learn.md file was rewritten in a single pass, replacing all generic learning capture logic with constitutional memory management. Cross-references in README.txt, CLAUDE.md, and system-spec-kit README.md were updated to match. No MCP server code was changed — the existing `memory_save()`, `memory_search()`, and `memory_index_scan()` tools already support constitutional indexing. Verification confirmed zero stale references to old learning types or subcommands.

### LOC Drift Note

The spec estimated ~250 lines for learn.md, but the actual implementation is 550 lines. The increase is justified: 5 subcommands each require dedicated workflow sections (CREATE at 130 lines, OVERVIEW/LIST/EDIT/REMOVE/BUDGET each at 30-60 lines), plus the mandatory first-action routing block, tool signatures table, error handling table, examples, and related commands section.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Complete rewrite instead of incremental edit | The old command had a fundamentally different purpose (generic learning → constitutional management). No code could be reused. |
| 550 lines instead of estimated 250 | Each of 5 subcommands needs a self-contained workflow section. Trimming further would lose critical step-by-step guidance. |
| Dashboard-first pattern for empty args | Shows current state (files, budget) before asking what to do. Reduces round-trips for users who just want status. |
| No new MCP tools | Existing `memory_save()` and `memory_search()` already handle constitutional tier correctly. Adding tools would duplicate functionality. |
| Destructive confirmation for remove | Constitutional memories affect every search result. Accidental deletion has high impact. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Old learning types removed | PASS — grep for pattern/mistake/insight/optimization/constraint finds only "constraint" in a qualification question (safe context) |
| Old subcommands removed | PASS — grep for correct/undo/history returns 0 matches |
| New subcommands present | PASS — list, edit, remove, budget all documented with full workflows |
| Constitutional directory path | PASS — `.opencode/skill/system-spec-kit/constitutional/` used consistently |
| Token budget referenced | PASS — ~2000 token budget in sections 4, 5, 6, 7, 10 |
| README.txt cross-references | PASS — learn command description and subcommands table updated |
| CLAUDE.md cross-references | PASS — Quick Reference table shows constitutional memory workflow |
| system-spec-kit README.md | PASS — /memory:learn description updated |
| Test suite (111 tests) | PASS — all 5 learning test files pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No migration path for old learnings.** Memories saved via the old `/memory:learn` (pattern, mistake, insight types) remain in their spec folder `memory/` directories. They are not automatically converted to constitutional memories.
2. **Feature flag comment stale in MCP server code.** `learned-feedback.ts` line 20 says "default OFF" but the feature graduated to default ON. This is out of scope for this spec (MCP server code changes excluded) but noted for a future fix.
3. **SHADOW_PERIOD_MS placement.** In `learned-feedback.ts`, the constant and `isInShadowPeriod()` function are placed between a JSDoc comment and its target function. Style issue, out of scope.
<!-- /ANCHOR:limitations -->
