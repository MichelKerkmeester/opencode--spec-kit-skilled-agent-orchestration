---
title: 'Testing Playbook: Graph Retrieval Improvements (Phase 009)'
spec: 02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion/009-graph-retrieval-improvements
---

# Testing Playbook: Graph Retrieval Improvements

## Summary Table

| # | Feature | Flag | Unit Tests | Manual Test |
|---|---------|------|-----------|-------------|
| 1 | Community Summaries | SPECKIT_COMMUNITY_SUMMARIES | community-detection.vitest.ts | memory_search with global mode |
| 2 | Query Concept Expansion | SPECKIT_QUERY_CONCEPT_EXPANSION | concept-extraction.vitest.ts | Search 'Semantic Search' with concept expansion |
| 3 | Graph-Expanded Fallback | SPECKIT_GRAPH_FALLBACK | recovery-payload integration | Search weak query, verify graph expansion |
| 4 | Community Search Fallback | SPECKIT_COMMUNITY_SEARCH_FALLBACK | community-search.vitest.ts | Search weak query, verify community results |
| 5 | Dual-Level Retrieval | SPECKIT_DUAL_RETRIEVAL | community-search.vitest.ts | memory_search with retrievalLevel: global |
| 6 | Always-On Graph Injection | SPECKIT_GRAPH_CONTEXT_INJECTION | causal-boost.vitest.ts | Verify graph signals without seed results |
| 7 | Result Provenance | SPECKIT_RESULT_PROVENANCE | provenance-envelope.vitest.ts | Check graphEvidence in search results |
| 8 | Temporal Edges | SPECKIT_TEMPORAL_EDGES | temporal-edges.vitest.ts | Check valid_at and invalid_at on edges |
| 9 | Contradiction Detection | SPECKIT_TEMPORAL_EDGES | contradiction-detection.vitest.ts | Insert conflicting edges, verify invalidation |
| 10 | Usage-Weighted Ranking | SPECKIT_USAGE_RANKING | usage-weighted-ranking.vitest.ts | Check access_count increments |
| 11 | Ontology Hooks | SPECKIT_ONTOLOGY_HOOKS | TypeScript compile-time verification | Load custom schema, validate extraction |

## Per-Feature Test Steps

### 1. Community Summaries (SPECKIT_COMMUNITY_SUMMARIES)
**Unit tests:** `community-detection.vitest.ts`
**Manual test:**
1. Run `memory_search({ query: 'semantic search', retrievalLevel: 'global' })`
2. Verify community-level results appear
3. Disable flag: `SPECKIT_COMMUNITY_SUMMARIES=false`
4. Verify community search no longer activates

### 2. Query Concept Expansion (SPECKIT_QUERY_CONCEPT_EXPANSION)
**Unit tests:** `concept-extraction.vitest.ts` (5 tests)
**Manual test:**
1. Run `memory_search({ query: 'Semantic Search', includeTrace: true })`
2. Check trace for concept expansion terms such as retrieval, query, and lookup
3. Verify expanded terms improve result relevance

### 3. Graph-Expanded Fallback (SPECKIT_GRAPH_FALLBACK)
**Unit tests:** recovery-payload integration coverage
**Manual test:**
1. Search a weak or empty-result query
2. Verify `buildGraphExpandedFallback()` fires in trace
3. Check expanded terms come from causal edge neighbors

### 4. Community Search Fallback (SPECKIT_COMMUNITY_SEARCH_FALLBACK)
**Unit tests:** `community-search.vitest.ts` (5 tests)
**Manual test:**
1. Search a weak query that returns fewer than 3 results
2. Verify community fallback activates (`appliedBoosts.communityFallback` in response)
3. Verify community member IDs are injected into results

### 5. Dual-Level Retrieval (SPECKIT_DUAL_RETRIEVAL)
**Unit tests:** `community-search.vitest.ts`
**Manual test:**
1. `memory_search({ query: 'search pipeline', retrievalLevel: 'local' })` - entity results only
2. `memory_search({ query: 'search pipeline', retrievalLevel: 'global' })` - community results
3. `memory_search({ query: 'search pipeline', retrievalLevel: 'auto' })` - local with fallback

### 6. Always-On Graph Injection (SPECKIT_GRAPH_CONTEXT_INJECTION)
**Unit tests:** `causal-boost.vitest.ts`
**Manual test:**
1. Search a query without a dedicated causal boost trigger
2. Verify graph signals still appear in results (`graph_contribution` or graph-derived context in response)

### 7. Result Provenance (SPECKIT_RESULT_PROVENANCE)
**Unit tests:** `provenance-envelope.vitest.ts` (5 tests)
**Manual test:**
1. Run `memory_search` with `includeTrace: true`
2. Check each result for `graphEvidence { edges, communities, boostFactors }`
3. Verify edge IDs and community IDs are valid

### 8. Temporal Edges (SPECKIT_TEMPORAL_EDGES)
**Unit tests:** `temporal-edges.vitest.ts` (24 tests)
**Manual test:**
1. Check `causal_edges` for `valid_at` and `invalid_at` columns
2. Verify `getValidEdges()` excludes invalidated edges
3. Verify `ensureTemporalColumns()` is idempotent

### 9. Contradiction Detection (SPECKIT_TEMPORAL_EDGES)
**Unit tests:** `contradiction-detection.vitest.ts` (5 tests)
**Manual test:**
1. Insert edge with `supports` relation
2. Insert edge with `contradicts` on the same source and target
3. Verify the old edge gets an `invalid_at` timestamp

### 10. Usage-Weighted Ranking (SPECKIT_USAGE_RANKING)
**Unit tests:** `usage-weighted-ranking.vitest.ts` (6 tests)
**Manual test:**
1. Search the same query multiple times
2. Verify `access_count` increments for returned results
3. Verify `computeUsageBoost()` produces a `0-0.10` range boost

### 11. Ontology Hooks (SPECKIT_ONTOLOGY_HOOKS)
**Unit tests:** TypeScript compile-time verification (no dedicated vitest suite)
**Manual test:**
1. Create a custom ontology schema JSON
2. Call `loadOntologySchema()`
3. Call `validateExtraction()` with valid and invalid entity and relation pairs

## Regression Checks
- `memory_health()` returns healthy status
- `memory_match_triggers()` is unaffected by new code
- `memory_list()` returns correct counts
- Existing search quality is maintained with no score regression
- TypeScript compiles without errors (`npx tsc --noEmit`)
- Full targeted Phase 009 regression set passes, and the repo baseline `npx vitest run` remains healthy
