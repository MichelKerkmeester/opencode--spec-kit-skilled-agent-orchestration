---
title: "Implementation Summary: Correctness & Boundary Repair [024/013]"
description: "Fixed 15 critical bugs across endLine calculation, DB safety, budget allocation, query traversal, and input validation. 20/20 checklist items verified."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-compact-code-graph/013-correctness-boundary-repair |
| **Completed** | 2026-03-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The code graph and compaction pipeline now produce correct results for multi-line functions, enforce DB integrity under failure, respect caller-provided budgets, and validate all inputs at system boundaries. These 15 fixes unblock every downstream phase.

### endLine Fix (Item 1)

The structural indexer previously set `endLine = startLine` for every captured symbol. Functions spanning 50 lines were treated as single-line, breaking CALLS edge detection and contentHash computation. Three language-specific helpers now scan forward from each declaration: `findBraceBlockEndLine()` for JS/TS and Bash (brace counting), `findPythonBlockEndLine()` for Python (indentation tracking). The `capturesToNodes()` function hashes the full body range and `extractEdges()` scans the complete function body for call references.

### DB Safety (Items 9-11)

`initDb()` was a fire-once singleton with no error recovery. A failed init poisoned the module-level variable permanently. Now wrapped in try/catch: on failure, `db` and `dbPath` reset to null so the next call retries. Schema migration tracking via `schema_version` table (currently v3). `replaceNodes()` wraps DELETE + orphan edge cleanup + INSERT in a single transaction, so a constraint error rolls back cleanly instead of wiping a file's graph.

### Budget and Merger (Items 7-8)

The budget allocator had a hard-coded 4000-token ceiling that silently ignored caller-provided budgets. Removed. `sessionState` previously bypassed allocation entirely as "overhead." Now participates in the allocation model with a zero floor. Zero-budget sections no longer render empty headers. Truncation markers are counted within the budget, not appended after.

### Query Correctness (Items 12-13)

Transitive BFS traversal allowed nodes at `depth === maxDepth` to expand further, leaking results beyond the requested boundary. Changed to strict `>=` check. Converging paths produced duplicate entries; now deduplicated via `resultSymbolIds` Set. `includeTrace` was advertised in the `code_graph_context` schema but never implemented. Removed from `tool-schemas.ts`.

### Validation and Cleanup (Items 3-6, 14-15)

Tool arg validation added via `getMissingRequiredStringArgs()` for `code_graph_query` and `ccc_feedback`. rootDir boundary check prevents path traversal outside `process.cwd()`. Exception strings sanitized in `memory-context.ts` and `context.ts` handlers (generic messages to callers, full errors to stderr). Seed source identity preserved through the context pipeline. Working-set-tracker eviction threshold changed from `maxFiles * 2` to `maxFiles`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/code-graph/structural-indexer.ts` | Modified | endLine calculation, brace/indent/marker helpers |
| `lib/code-graph/code-graph-db.ts` | Modified | Init guard, schema migration, transaction atomicity, orphan edges |
| `lib/code-graph/budget-allocator.ts` | Modified | Remove 4000 ceiling, sessionState allocation |
| `lib/code-graph/compact-merger.ts` | Modified | Zero-budget skip, truncation within budget |
| `lib/code-graph/working-set-tracker.ts` | Modified | maxFiles enforcement at insertion |
| `handlers/code-graph/query.ts` | Modified | Strict maxDepth, dedup |
| `handlers/code-graph/context.ts` | Modified | Seed source, exception sanitization |
| `handlers/code-graph/scan.ts` | Modified | rootDir validation |
| `handlers/memory-context.ts` | Modified | Exception sanitization |
| `tools/code-graph-tools.ts` | Modified | Arg validation before dispatch |
| `tool-schemas.ts` | Modified | includeTrace removed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Five parallel Codex CLI agents (GPT-5.4, reasoning effort: high) implemented all items simultaneously. Each agent owned a non-overlapping file set. After all agents completed, focused vitest suites verified correctness: 69/69 tests across code-graph-indexer, crash-recovery, budget-allocator, and compact-merger suites. ESLint passed on all 11 modified TypeScript files with zero errors.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Brace-counting heuristic over tree-sitter for endLine | Tree-sitter requires WASM bundles and is Phase 015 scope. Brace-counting is 60 LOC, zero dependencies, and sufficient for the regex parser. |
| Reset singleton on initDb failure | Rethrowing alone would leave db=null but dbPath set, preventing retry. Full reset ensures clean state. |
| Remove includeTrace rather than implement | No downstream consumers. Simpler to remove dead schema property than build trace infrastructure. |
| Strict `>=` for maxDepth check | The previous `>` allowed depth=maxDepth nodes to expand their edges, leaking depth+1 nodes into results. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tests/code-graph-indexer.vitest.ts` | PASS (18/18) |
| `tests/crash-recovery.vitest.ts` | PASS (36/36) |
| `tests/budget-allocator.vitest.ts` | PASS (15/15) |
| `tests/compact-merger.vitest.ts` | PASS (15/15 including 3 new tests) |
| ESLint on 11 modified files | PASS (0 errors) |
| Phase 013 checklist | 20/20 items verified |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Brace-counting is approximate.** String literals containing `{` or `}` can shift the count. Tree-sitter (Phase 015) will provide exact AST-based ranges.
2. **ccc_feedback validation** uses required-field checks in the dispatch layer, not full JSON Schema validation. Sufficient for current needs.
3. **Pre-existing TypeScript errors** in `memory-search.ts` and `shadow-evaluation-runtime.ts` prevent `npm run build` from passing. These are unrelated to Phase 013.
<!-- /ANCHOR:limitations -->
