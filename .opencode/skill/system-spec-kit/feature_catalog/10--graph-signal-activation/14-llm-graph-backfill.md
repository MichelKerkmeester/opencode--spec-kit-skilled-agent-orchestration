---
title: "Async LLM graph backfill"
description: "Async LLM graph backfill enriches high-value documents with probabilistic graph edges via an LLM call after deterministic extraction, gated by the SPECKIT_LLM_GRAPH_BACKFILL flag."
---

# Async LLM graph backfill

## 1. OVERVIEW

Async LLM graph backfill enriches high-value documents with probabilistic graph edges via an LLM call after deterministic extraction, gated by the `SPECKIT_LLM_GRAPH_BACKFILL` flag.

The default save path extracts graph edges using deterministic heuristics (no LLM calls). This feature adds a second pass for documents that are deemed high-value: an asynchronous LLM call generates additional edges that the heuristic pass would miss. Think of it as a careful second opinion that only runs for the most important documents. It never blocks the save operation and is enabled by default unless `SPECKIT_LLM_GRAPH_BACKFILL=false`.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_LLM_GRAPH_BACKFILL=false` to disable. High-value documents (quality score >= 0.7 threshold) receive an async LLM-based enrichment pass after the synchronous deterministic extraction completes.

The backfill runs inside the `onIndex()` path in `graph-lifecycle.ts`, which is called by the post-insert handler when `isGraphRefreshEnabled() || isEntityLinkingEnabled()`. The backfill is gated independently by `isLlmGraphBackfillEnabled()` from `search-flags.ts` and does not depend on the specific `SPECKIT_GRAPH_REFRESH_MODE` value (`write_local` vs `scheduled`). As long as the `onIndex()` code path is reached and `SPECKIT_LLM_GRAPH_BACKFILL` is not `false`, the backfill will be scheduled for qualifying documents.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/graph-lifecycle.ts` | Lib | `isLlmGraphBackfillEnabled()` flag and async backfill orchestration |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isLlmGraphBackfillEnabled()` unified flag accessor |
| `mcp_server/handlers/save/post-insert.ts` | Handler | Post-insert wiring that schedules backfill |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/graph-lifecycle.vitest.ts` | LLM backfill flag behavior, async enrichment scheduling |

---

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Async LLM graph backfill
- Current reality source: graph-lifecycle.ts module header and implementation
