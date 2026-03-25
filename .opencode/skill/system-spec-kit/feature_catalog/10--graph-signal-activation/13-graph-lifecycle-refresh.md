---
title: "Graph lifecycle refresh"
description: "Graph lifecycle refresh manages dirty-node tracking and graph recomputation after write operations, with synchronous local or scheduled background modes controlled by the SPECKIT_GRAPH_REFRESH_MODE flag."
---

# Graph lifecycle refresh

## 1. OVERVIEW

Graph lifecycle refresh manages dirty-node tracking and graph recomputation after write operations, with synchronous local or scheduled background modes controlled by the `SPECKIT_GRAPH_REFRESH_MODE` flag.

When you save or update a memory that has graph edges, the nearby graph nodes become "dirty" and need recalculating. This feature controls how that recalculation happens. In local mode, small clusters are recomputed right away during the save. In scheduled mode, larger clusters are queued for a background pass. By default, graph refresh runs in `write_local` mode; set `SPECKIT_GRAPH_REFRESH_MODE=off` if you want zero refresh overhead.

---

## 2. CURRENT REALITY

Enabled by default (graduated). `SPECKIT_GRAPH_REFRESH_MODE` defaults to `write_local`; set `SPECKIT_GRAPH_REFRESH_MODE=off` to disable graph refresh entirely. Small connected components (up to 50 nodes by default, configurable via `SPECKIT_GRAPH_LOCAL_THRESHOLD`) are recomputed synchronously during the save operation, while `scheduled` queues larger components for a background global refresh.

Additionally, `SPECKIT_LLM_GRAPH_BACKFILL` is enabled by default (graduated); set it to `false` to disable async LLM-based enrichment for high-value documents after deterministic extraction completes. This adds probabilistic edges via an LLM call — separate from the deterministic extraction path.

Key constants: `DEFAULT_LOCAL_RECOMPUTE_THRESHOLD = 50`, `LOCAL_RECOMPUTE_EDGE_LIMIT = 500`. Component size estimation uses BFS expansion bounded by the edge limit.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/graph-lifecycle.ts` | Lib | Dirty-node tracking, component estimation, onWrite orchestration |
| `mcp_server/lib/search/deterministic-extractor.ts` | Lib | Deterministic save-time extraction and typed-edge creation reused by graph lifecycle orchestration |
| `mcp_server/lib/search/search-flags.ts` | Lib | `getGraphRefreshMode()` and `isLlmGraphBackfillEnabled()` flag accessors |
| `mcp_server/handlers/save/post-insert.ts` | Handler | Post-insert wiring that invokes graph refresh |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/graph-lifecycle.vitest.ts` | Refresh mode resolution, dirty-node tracking, local vs scheduled routing, LLM backfill flag |

---

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Graph lifecycle refresh
- Current reality source: graph-lifecycle.ts module header and implementation
- Source list updated 2026-03-25 per deep review
