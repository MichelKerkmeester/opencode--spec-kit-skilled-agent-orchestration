---
title: "Tasks: Code Graph Auto-Trigger [024/019]"
description: "Task tracking for automatic code graph freshness and reindexing."
---
# Tasks: Phase 019 — Code Graph Auto-Trigger

## Completed

- [x] ensure-ready.ts shared helper created — lib/code-graph/ensure-ready.ts (217 lines)
- [x] detectState() with three freshness conditions (empty/HEAD/mtime) — lines 56-105
- [x] context.ts auto-trigger wired — ensureCodeGraphReady(process.cwd()) before buildContext
- [x] query.ts auto-trigger wired — ensureCodeGraphReady(process.cwd()) before query dispatch
- [x] status.ts true freshness reporting — getGraphFreshness() returns fresh/stale/empty
- [x] 10-second timeout guard — AUTO_INDEX_TIMEOUT_MS = 10_000
- [x] Selective reindex for stale files — SELECTIVE_REINDEX_THRESHOLD = 50
- [x] Per-file mtime tracking — ensureFreshFiles() in code-graph-db.ts

## Deferred

- [ ] F048: Selective reindex passes raw file paths as includeGlobs — needs glob pattern wrapping (P2)
- [ ] F049: Timeout via AbortController doesn't cancel indexFiles — fire-and-forget is acceptable (P2)
