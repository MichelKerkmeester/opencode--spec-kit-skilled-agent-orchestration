---
title: "Causal graph statistics (memory_causal_stats)"
description: "Covers the causal graph health metrics tool reporting edge counts, relationship breakdowns and link coverage percentage."
---

# Causal graph statistics (memory_causal_stats)

## 1. OVERVIEW

Covers the causal graph health metrics tool reporting edge counts, relationship breakdowns and link coverage percentage.

This gives you a health report on the web of connections between your memories. It tells you how many connections exist, how strong they are and whether enough memories are linked together. If too many memories are isolated with no connections, the system warns you because it means the relationship network is too thin to be useful for tracing decisions.

---

## 2. CURRENT REALITY

Returns the health metrics of the causal graph in a single call. Total edge count, breakdown by relationship type (how many caused edges, how many supports edges and so on), average edge strength across all edges, unique source and target memory counts and the link coverage percentage.

Link coverage is the most important metric: what percentage of memories participate in at least one causal relationship? The target is 60% (CHK-065). Below that, the graph is too sparse for the graph search channel to contribute meaningfully. The tool reports pass or fail against that target.

Orphaned edges (edges referencing source or target memories that no longer exist in `memory_index`) are detected and counted. When orphans exist, the health status changes from "healthy" to "has_orphans." You can use `memory_drift_why` to find the edge IDs and `memory_causal_unlink` to clean them up.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/causal-graph.ts` | MCP handler for `memory_causal_stats` |
| `mcp_server/lib/storage/causal-edges.ts` | Causal edge storage: edge counts, relationship breakdown, orphan detection |
| `mcp_server/lib/graph/graph-signals.ts` | Graph momentum and depth signals |
| `mcp_server/lib/search/causal-boost.ts` | Causal boost scoring for edge-connected results |
| `mcp_server/lib/search/graph-search-fn.ts` | Graph degree scoring for link coverage computation |
| `mcp_server/lib/response/envelope.ts` | MCP success/error envelope helpers |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for causal stats arguments |
| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `memory_causal_stats` |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/causal-edges-unit.vitest.ts` | Causal edge unit tests |
| `mcp_server/tests/causal-edges.vitest.ts` | Causal edge storage tests |
| `mcp_server/tests/handler-causal-graph.vitest.ts` | Causal graph handler validation |
| `mcp_server/tests/integration-causal-graph.vitest.ts` | Causal graph integration |
| `mcp_server/tests/graph-signals.vitest.ts` | Graph signal computation tests |

---

## 4. MANUAL PLAYBOOK COVERAGE

| Scenario | Role |
|----------|------|
| `EX-020` | Direct manual validation for causal graph statistics and coverage reporting |

---

## 5. SOURCE METADATA

- Group: Analysis
- Source feature title: Causal graph statistics (memory_causal_stats)
- Current reality source: FEATURE_CATALOG.md
