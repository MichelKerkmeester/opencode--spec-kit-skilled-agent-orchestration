---
title: "Graph concept routing"
description: "Graph concept routing extracts noun phrases from a query and matches them against a concept alias table, activating the graph channel for matched concepts to improve retrieval via causal edge traversal, gated by the SPECKIT_GRAPH_CONCEPT_ROUTING flag."
---

# Graph concept routing

## 1. OVERVIEW

Graph concept routing extracts noun phrases from a query and matches them against a concept alias table, activating the graph channel for matched concepts to improve retrieval via causal edge traversal, gated by the `SPECKIT_GRAPH_CONCEPT_ROUTING` flag.

Normally, the graph retrieval channel only activates when a query explicitly references known entities. This feature bridges the gap by automatically detecting concept references in natural language queries. It extracts noun phrases, matches them against a table of canonical concept names and their aliases, and routes the matched concepts to the graph channel. This means queries like "how does memory decay work" can activate graph traversal for the "FSRS decay" concept even though the user never mentioned FSRS directly.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_GRAPH_CONCEPT_ROUTING=false` to disable.

The `isGraphConceptRoutingEnabled()` function in `search-flags.ts` checks the flag. The entity linker module (`entity-linker.ts`) provides query-time concept routing alongside its cross-document entity linking role. It extracts noun phrases from the query, matches them against the concept alias table in SQLite, and returns canonical concept names. The matched concepts are used by `stage1-candidate-gen.ts` to activate the graph retrieval channel for those concepts.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/entity-linker.ts` | Lib | Query-time concept routing, noun phrase extraction, alias table matching |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Stage-1 orchestration, graph channel activation from concept matches |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isGraphConceptRoutingEnabled()` flag accessor |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/concept-routing.vitest.ts` | Concept routing logic and alias matching |
| `mcp_server/tests/graph-concept-routing.vitest.ts` | Graph concept routing integration tests |

---

## 4. SOURCE METADATA

- Group: Query intelligence
- Source feature title: Graph concept routing
- Current reality source: mcp_server/lib/search/entity-linker.ts module header and search-flags.ts `isGraphConceptRoutingEnabled()` implementation
