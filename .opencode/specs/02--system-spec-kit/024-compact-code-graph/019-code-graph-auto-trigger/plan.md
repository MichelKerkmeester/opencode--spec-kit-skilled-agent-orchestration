---
title: "Plan: Code Graph Auto-Trigger [024/019]"
description: "Implementation order for automatic code graph freshness checking and reindexing."
---
# Plan: Phase 019 — Code Graph Auto-Trigger

## Implementation Order

1. **ensure-ready.ts shared helper** (100-120 LOC)
   - Create `lib/code-graph/ensure-ready.ts`
   - Implement `ensureCodeGraphReady(rootDir)` that checks three freshness conditions
   - Implement `detectState()`: empty graph, git HEAD changed, file mtimes drifted
   - Add 10-second timeout guard (`AUTO_INDEX_TIMEOUT_MS = 10_000`)
   - Add selective reindex threshold (`SELECTIVE_REINDEX_THRESHOLD = 50`)

2. **Three freshness conditions in detectState()** (40-60 LOC)
   - Empty graph check: node count === 0 triggers full scan
   - Git HEAD check: compare stored HEAD vs `git rev-parse HEAD`
   - File mtime check: compare stored mtimes vs filesystem, selective reindex changed files

3. **Wire into code_graph_context** (10-15 LOC)
   - Call `ensureCodeGraphReady(process.cwd())` at top of context handler
   - Best-effort auto-index attempt before building context

4. **Wire into code_graph_query** (10-15 LOC)
   - Call `ensureCodeGraphReady(process.cwd())` at top of query handler
   - Best-effort auto-index attempt before query dispatch

5. **Freshness reporting in code_graph_status** (20-30 LOC)
   - Implement `getGraphFreshness()` returning `fresh` / `stale` / `empty`
   - Fresh = graph is non-empty and `detectState()` finds no HEAD or tracked-file drift
   - Stale = git HEAD changed or tracked files changed since last index
   - Empty = never indexed
   - No separate 5-minute age window is enforced in the current implementation

6. **Per-file mtime tracking** (30-40 LOC)
   - Add `ensureFreshFiles()` to code-graph-db.ts
   - Store and compare per-file modification timestamps
   - Return list of changed tracked files for selective reindex

## Current Runtime Notes

- `code_graph_context` and `code_graph_query` attempt auto-indexing before use, but failures are logged and not surfaced as blocking errors.
- `code_graph_status` reports freshness only. It does not trigger reindexing.
- New files are not detected until a broader scan runs, because freshness checks only cover tracked paths.
- Deleted-file cleanup still depends on the scan handler full-scan path and is bypassed by the direct auto-trigger indexing path.
- Selective reindex remains partially degraded by F048, so stale-file refresh can fall back to broader scanning behavior.

## Dependencies
- None — can be done independently

## Estimated Total LOC: 170-360
