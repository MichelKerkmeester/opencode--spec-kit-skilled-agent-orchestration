---
title: "Graph concept routing"
description: "Graph concept routing extracts noun phrases from a query and matches them against a concept alias table, recording matched concepts as Stage 1 trace metadata when SPECKIT_GRAPH_CONCEPT_ROUTING is enabled."
---

# Graph concept routing

## 1. OVERVIEW

Graph concept routing extracts noun phrases from a query and matches them against a concept alias table, recording matched concepts as Stage 1 trace metadata when `SPECKIT_GRAPH_CONCEPT_ROUTING` is enabled.

Normally, the graph retrieval channel only activates when a query explicitly references known entities. This feature adds a lightweight concept-routing pass over natural-language queries: it extracts noun phrases, matches them against canonical concept names and aliases, and records the resulting concepts in retrieval trace metadata. Today that gives downstream observability into which concepts were recognized, but it does not directly switch Stage 1 into a graph retrieval branch.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_GRAPH_CONCEPT_ROUTING=false` to disable.

The `isGraphConceptRoutingEnabled()` function in `search-flags.ts` checks the flag. The entity linker module (`entity-linker.ts`) provides query-time concept routing alongside its cross-document entity linking role. It extracts noun phrases from the query, matches them against the concept alias table in SQLite, and returns canonical concept names plus a `graphActivated` boolean. `stage1-candidate-gen.ts` currently uses that output only to append a `d2-concept-routing` trace entry with `matchedConcepts` and `graphActivated: true`; that trace field mirrors the routing result for observability, but it does not switch the Stage 1 search path or directly activate a graph retrieval channel. Note that the inline comment on `isGraphConceptRoutingEnabled()` in `search-flags.ts` overstates this behavior by saying it is "activating the graph channel"; current runtime behavior is trace-only at this stage.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/entity-linker.ts` | Lib | Query-time concept routing, noun phrase extraction, alias table matching |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Stage-1 orchestration, records concept-routing results into retrieval trace metadata |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isGraphConceptRoutingEnabled()` flag accessor |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/concept-routing.vitest.ts` | Concept routing logic and alias matching |
| `mcp_server/tests/memory-search-ux-hooks.vitest.ts` | Live search integration coverage for graduated routing-adjacent UX hooks |

---

## 4. SOURCE METADATA

- Group: Query intelligence
- Source feature title: Graph concept routing
- Current reality source: mcp_server/lib/search/entity-linker.ts and mcp_server/lib/search/pipeline/stage1-candidate-gen.ts concept-routing trace branch
