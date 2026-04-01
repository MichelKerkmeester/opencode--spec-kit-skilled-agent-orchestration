---
title: "Code graph auto-trigger"
description: "ensureCodeGraphReady() provides lazy indexing that automatically detects graph freshness and triggers full scans or selective reindexing before queries."
---

# Code graph auto-trigger

## 1. OVERVIEW

ensureCodeGraphReady() provides lazy indexing that automatically detects graph freshness and triggers full scans or selective reindexing before queries.

The ensure-ready module checks graph state (fresh/stale/empty) by comparing the current git HEAD against the last indexed HEAD and scanning for stale files. When the graph is empty, a full scan is triggered. When files are stale but below the selective reindex threshold (50 files), only changed files are reindexed. Above the threshold, a full rescan is performed. A 10-second timeout prevents blocking on large codebases. Shared by code_graph_context, code_graph_query, and code_graph_status handlers.

---

## 2. CURRENT REALITY

mcp_server/lib/code-graph/ensure-ready.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/code-graph/ensure-ready.ts` | Lib | Auto-trigger with git HEAD comparison and staleness detection |
| `mcp_server/lib/code-graph/code-graph-db.ts` | Lib | DB helpers: getLastGitHead, setLastGitHead, ensureFreshFiles, isFileStale |
| `mcp_server/handlers/code-graph/` | Handler | Consumers: context, query, status handlers call ensureCodeGraphReady() |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Code graph auto-trigger
- Current reality source: spec 024-compact-code-graph phase 019
