---
title: "Code graph auto-trigger"
description: "ensureCodeGraphReady() provides lazy indexing that automatically detects graph freshness and triggers full scans or selective reindexing before queries."
audited_post_018: true
---

# Code graph auto-trigger

## 1. OVERVIEW

ensureCodeGraphReady() provides lazy indexing that automatically detects graph freshness and triggers full scans or selective reindexing before queries.

The ensure-ready module checks graph state (fresh/stale/empty) by comparing the current git HEAD against the last indexed HEAD and scanning for stale files. When the graph is empty, a full scan is required. When files are stale but below the selective reindex threshold (50 files), only changed files are reindexed inline. Above the threshold, a full rescan is required. A 10-second timeout prevents unbounded inline work.

Packet 013 made this visible to callers instead of leaving it as an internal helper concern. When `code_graph_query` or `code_graph_context` hits a `full_scan` readiness result and inline indexing does not complete, the handlers return an explicit blocked payload with:

- `status: "blocked"` and a `code_graph_full_scan_required: ...` message
- `blocked: true`, `degraded: true`, and `graphAnswersOmitted: true`
- `requiredAction: "code_graph_scan"` and `blockReason: "full_scan_required"`
- readiness metadata (`readiness`, `canonicalReadiness`, `trustState`, `lastPersistedAt`) so operators can see whether the graph is stale or empty and act on the correct follow-up

`code_graph_query` also preserves the original `operation` and `subject`, while `code_graph_context` preserves the requested `queryMode`. This page therefore describes both the helper's auto-trigger behavior and the caller-visible blocked contract layered on top of it.

---

## 2. CURRENT REALITY

mcp_server/code_graph/lib/ensure-ready.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/code_graph/lib/ensure-ready.ts` | Lib | Auto-trigger with git HEAD comparison and staleness detection |
| `mcp_server/code_graph/lib/code-graph-db.ts` | Lib | DB helpers: getLastGitHead, setLastGitHead, ensureFreshFiles, isFileStale |
| `mcp_server/code_graph/handlers/query.ts` | Handler | Returns the caller-visible blocked `code_graph_query` payload when readiness requires a full scan |
| `mcp_server/code_graph/handlers/context.ts` | Handler | Returns the caller-visible blocked `code_graph_context` payload when readiness requires a full scan |
| `mcp_server/code_graph/handlers/status.ts` | Handler | Reports freshness plus `graphQualitySummary` without using the blocked read contract |
| `mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts` | Test | Verifies the explicit blocked query payload for `full_scan` readiness |
| `mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts` | Test | Verifies the explicit blocked context payload for `full_scan` readiness |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Code graph auto-trigger
- Current reality source: spec 024-compact-code-graph phase 019
