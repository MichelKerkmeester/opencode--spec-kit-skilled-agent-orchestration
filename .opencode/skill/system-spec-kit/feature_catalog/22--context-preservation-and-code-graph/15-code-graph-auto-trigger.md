---
title: "Code graph auto-trigger"
description: "ensureCodeGraphReady() provides lazy indexing that automatically detects graph freshness and triggers full scans or selective reindexing before queries."
audited_post_018: true
---

# Code graph auto-trigger

## 1. OVERVIEW

ensureCodeGraphReady() provides lazy indexing that automatically detects graph freshness and triggers full scans or selective reindexing before queries.

The ensure-ready module checks graph state (fresh/stale/empty) by comparing the current git HEAD against the last indexed HEAD and scanning for stale files. When the graph is empty, a full scan is required. When files are stale but below the selective reindex threshold (50 files), only changed files are reindexed inline. Above the threshold, a full rescan is required. A 10-second timeout prevents unbounded inline work.

Spec `024-compact-code-graph` packet 013 made this visible to callers instead of leaving it as an internal helper concern. When `code_graph_query` or `code_graph_context` hits a `full_scan` readiness result and inline indexing does not complete, the handlers return an explicit blocked payload with:

- `status: "blocked"` and a `code_graph_full_scan_required: ...` message
- `blocked: true`, `degraded: true`, and `graphAnswersOmitted: true`
- `requiredAction: "code_graph_scan"` and `blockReason: "full_scan_required"`
- readiness metadata (`readiness`, `canonicalReadiness`, `trustState`, `lastPersistedAt`) so operators can see whether the graph is stale or empty and act on the correct follow-up
- `fallbackDecision: { nextTool, reason, retryAfter? }` for caller routing. Empty/stale full-scan states return `nextTool:"code_graph_scan"`, `reason:"full_scan_required"`, `retryAfter:"scan_complete"`. Selective-reindex and fresh paths emit no `fallbackDecision`. Readiness-crash states return `nextTool:"rg"`, `reason:"scan_failed"`.

`code_graph_query` also preserves the original `operation` and `subject`, while `code_graph_context` preserves the requested `queryMode`. This page therefore describes both the helper's auto-trigger behavior and the caller-visible blocked contract layered on top of it. The readiness contract now also exposes a non-mutating `getGraphReadinessSnapshot()` helper that returns the same `{action, freshness, reason}` triplet without triggering cache mutation, deleted-file cleanup, or inline indexing — used by `code_graph_status` for diagnostic reporting. The `SELECTIVE_REINDEX_THRESHOLD` (50 files) constant is exported for callers that want to predict which branch the auto-trigger will take.

---

## 2. CURRENT REALITY

mcp_server/code_graph/lib/ensure-ready.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/code_graph/lib/ensure-ready.ts` | Lib | Auto-trigger with git HEAD comparison and staleness detection; also exports read-only sibling `getGraphReadinessSnapshot()` returning `{action, freshness, reason}` without mutating cache, deleted-file cleanup, or inline indexer; exports `SELECTIVE_REINDEX_THRESHOLD` constant |
| `mcp_server/code_graph/lib/code-graph-db.ts` | Lib | DB helpers: getLastGitHead, setLastGitHead, ensureFreshFiles, isFileStale |
| `mcp_server/code_graph/handlers/query.ts` | Handler | Returns the caller-visible blocked `code_graph_query` payload (with `fallbackDecision`) when readiness requires a full scan |
| `mcp_server/code_graph/handlers/context.ts` | Handler | Returns the caller-visible blocked `code_graph_context` payload (with `fallbackDecision`) when readiness requires a full scan |
| `mcp_server/code_graph/handlers/status.ts` | Handler | Reports freshness plus `readiness.action`, `graphQualitySummary` via `getGraphReadinessSnapshot()` without using the blocked read contract |
| `mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts` | Test | Verifies the explicit blocked query payload for `full_scan` readiness |
| `mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts` | Test | Verifies the explicit blocked context payload for `full_scan` readiness |
| `mcp_server/tests/code-graph-degraded-sweep.vitest.ts` | Test | Five-cell sweep: empty, broad-stale, bounded-stale, fresh, readiness-crash. Asserts `fallbackDecision` routing alongside readiness state |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Code graph auto-trigger
- Current reality source: spec 024-compact-code-graph phase 019
