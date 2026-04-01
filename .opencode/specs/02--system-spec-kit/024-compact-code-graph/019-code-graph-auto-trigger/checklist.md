---
title: "Checklist: Code Graph Auto-Trigger [024/019]"
description: "10 items across P1/P2 for phase 019."
---
# Checklist: Phase 019 — Code Graph Auto-Trigger

## P1 — Must Pass

- [x] ensureCodeGraphReady() checks empty graph → full scan — detectState() empty branch
- [x] ensureCodeGraphReady() checks git HEAD change → full rescan — detectState() HEAD comparison
- [x] ensureCodeGraphReady() checks file mtimes → selective reindex — detectState() mtime branch
- [x] code_graph_context calls ensureCodeGraphReady before building context — handlers/code-graph/context.ts
- [x] code_graph_query calls ensureCodeGraphReady before running query — handlers/code-graph/query.ts
- [x] 10-second timeout prevents blocking on long reindex — AUTO_INDEX_TIMEOUT_MS = 10_000

## P2 — Should Pass

- [x] code_graph_status reports true freshness (fresh/stale/empty) — getGraphFreshness() in status.ts
- [x] Selective reindex threshold limits full rescan — SELECTIVE_REINDEX_THRESHOLD = 50
- [ ] F048: includeGlobs receives proper glob patterns, not raw paths — DEFERRED
- [ ] F049: AbortController actually cancels indexFiles operation — DEFERRED (fire-and-forget acceptable)
