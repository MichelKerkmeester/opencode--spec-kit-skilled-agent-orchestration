---
title: "Causal graph statistics (memory_causal_stats)"
description: "Covers the causal graph health metrics tool reporting edge counts, relationship breakdowns and link coverage percentage."
---

# Causal graph statistics (memory_causal_stats)

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Covers the causal graph health metrics tool reporting edge counts, relationship breakdowns and link coverage percentage.

This gives you a health report on the web of connections between your spec-doc records. It tells you how many connections exist, how strong they are and whether enough spec-doc records are linked together. If too many records are isolated with no edges, the system warns you because it means the decision-lineage network is too thin to be useful for tracing decisions.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Returns the health metrics of the causal graph in a single call. Total edge count, breakdown by relationship type (how many caused edges, how many supports edges and so on), average edge strength across all edges, unique source and target spec-doc record counts and the link coverage percentage.

Link coverage is the most important metric: what percentage of memories participate in at least one causal relationship? The target is 60% (CHK-065). Below that, the graph is too sparse for the graph search channel to contribute meaningfully. The tool reports pass or fail against that target.

Orphaned edges (edges referencing source or target spec-doc records that no longer exist in `memory_index`) are detected and counted. When orphans exist, the health status changes from "healthy" to "has_orphans." You can use `memory_drift_why` to find the edge IDs and `memory_causal_unlink` to clean them up.

The response now also reports rolling-window deltas and balance metrics: `deltaByRelation` (per-relation count of new edges in the active window), `dominantRelation` and `dominantRelationShare` (largest relation type and its share of the window total), `balanceStatus` (one of `balanced`, `relation_skewed`, `insufficient_data`), `remediationHint` (a string naming the producer when skew is detected, e.g. prediction-error supersede burst), and `windowStartedAt`. `by_relation` is zero-filled across all 6 relation types so a missing type appears as 0 rather than disappearing. When `dominantRelationShare > 0.80` AND total new edges in window >= 50, `balanceStatus` is `relation_skewed` and `remediationHint` is set. Auto-edge insertion on PE / reconsolidation paths now respects a per-relation per-window cap routed through shared cap logic so supersedes bursts cannot dominate the graph.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
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

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/causal-edges-unit.vitest.ts` | Causal edge unit tests |
| `mcp_server/tests/causal-edges.vitest.ts` | Causal edge storage tests |
| `mcp_server/tests/handler-causal-graph.vitest.ts` | Causal graph handler validation |
| `mcp_server/tests/integration-causal-graph.vitest.ts` | Causal graph integration |
| `mcp_server/tests/graph-signals.vitest.ts` | Graph signal computation tests |

<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA
- Group: Analysis
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--analysis/02-causal-graph-statistics-memorycausalstats.md`

### MANUAL PLAYBOOK COVERAGE

| Scenario | Role |
|----------|------|
| `EX-020` | Direct manual validation for causal graph statistics and coverage reporting |

<!-- /ANCHOR:source-metadata -->
