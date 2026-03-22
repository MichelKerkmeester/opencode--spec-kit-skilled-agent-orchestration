---
title: "Async LLM graph backfill"
description: "Async LLM graph backfill enriches high-value documents with probabilistic graph edges via an LLM call after deterministic extraction, gated by the SPECKIT_LLM_GRAPH_BACKFILL flag."
---

# Async LLM graph backfill

## 1. OVERVIEW

Async LLM graph backfill enriches high-value documents with probabilistic graph edges via an LLM call after deterministic extraction, gated by the `SPECKIT_LLM_GRAPH_BACKFILL` flag.

The default save path extracts graph edges using deterministic heuristics (no LLM calls). This feature adds a second pass for documents that are deemed high-value: an asynchronous LLM call generates additional edges that the heuristic pass would miss. Think of it as a careful second opinion that only runs for the most important documents. It never blocks the save operation and defaults to off.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_LLM_GRAPH_BACKFILL=false` to disable. High-value documents receive an async LLM-based enrichment pass after the synchronous deterministic extraction completes, and the backfill is also scheduled when `SPECKIT_GRAPH_REFRESH_MODE` is `write_local` or `scheduled`.

The feature is implemented in the graph lifecycle module and wired into the post-insert handler. It shares the graph lifecycle's dirty-node tracking to mark nodes affected by LLM-generated edges. The function `isLlmGraphBackfillEnabled()` checks the environment variable.

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
