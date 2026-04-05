## P2-007: FTS query sanitization preserves punctuation that BM25 splits
- **Decision**: FIX
- **Reason**: The audit finding is real: BM25 `search()` was still tokenizing the raw query while SQLite FTS used a separate sanitizer, so path/code-style queries could split on one lexical lane but not the other. I added a shared lexical-query normalization path and routed both channels through it before their channel-specific processing.
- **Evidence**: `lib/search/bm25-index.ts:128-153,312-317,467-481`; `lib/search/sqlite-fts.ts:9,55-59`; verified with `tests/bm25-index.vitest.ts`, `tests/sqlite-fts.vitest.ts`, `tests/bm25-security.vitest.ts`
- **Impact**: medium

## P2-008: Thinning cannot discard anchor-only noise under current weights
- **Decision**: FIX
- **Reason**: The finding is real because an anchor-only chunk started at `0.6` composite score from anchor weight alone, which easily cleared the `0.3` threshold even when meaningful content was effectively empty. I added an anchored-signal floor so anchored chunks now need minimum density and minimum meaningful characters before they can be retained.
- **Evidence**: `lib/chunking/chunk-thinning.ts:47-48,54-59,89-96,105-121,148-150`; verified with `tests/chunk-thinning.vitest.ts`
- **Impact**: medium

## P2-018: Router prunes channels for short spec/decision lookups
- **Decision**: FIX
- **Reason**: The router was classifying short artifact lookups as `simple` and dropping BM25 entirely, which is a bad trade for terse spec/decision retrieval prompts. I preserved BM25 for simple queries that classify as `find_spec` / `find_decision` or resolve to doc-like artifact classes.
- **Evidence**: `lib/search/query-router.ts:13-14,48-56,113-121,154-161`; verified with `tests/query-router.vitest.ts`, `tests/query-router-channel-interaction.vitest.ts`
- **Impact**: medium

## P2-019: Multi-facet queries collapsed to one dominant intent
- **Decision**: DEFER
- **Reason**: The limitation is real, but a meaningful fix needs ranked-intent or decomposition metadata to propagate through `hybrid-search` and handler weighting code outside my ownership; changing `intent-classifier.ts` alone would not change runtime retrieval behavior. The current deep-mode decomposition path already preserves multi-facet retrieval coverage for the queries that reach Stage 1 decomposition.
- **Evidence**: `lib/search/hybrid-search.ts:1031-1034`; `lib/search/pipeline/stage1-candidate-gen.ts:377-415`
- **Impact**: medium

## P2-005: Traversal reads not snapshot-consistent under concurrent link/unlink
- **Decision**: DEFER
- **Reason**: The handler performs multiple independent traversal and memory-detail reads without a read transaction, so concurrent edge mutations can produce a mixed snapshot. The fix belongs in `handlers/causal-graph.ts`, which is outside my ownership scope for this pass.
- **Evidence**: `handlers/causal-graph.ts:350-364,383-432`; `lib/storage/causal-edges.ts:337-452`
- **Impact**: medium

## P2-006: Traversal silently truncates high-degree nodes after 100 edges
- **Decision**: DEFER
- **Reason**: The silent cap is real because `getEdgesFrom()`, `getEdgesTo()`, and `getAllEdges()` all default to `MAX_EDGES_LIMIT = 100`, and `getCausalChain()` does not surface that truncation to the caller. Fixing this cleanly requires storage/API contract work outside my owned files.
- **Evidence**: `lib/storage/causal-edges.ts:39-40,337-391,403-452`
- **Impact**: medium

## P2-027: Stale degree cache after external reinitialization
- **Decision**: DEFER
- **Reason**: The review note points at the degree cache, but the broader issue is that graph search is created as a DB-bound closure at startup and `db-state` reuses that same function on rebind; fixing this correctly needs `db-state` / graph rebind changes outside my ownership. The per-DB `WeakMap` cache in `graph-search-fn.ts` already prevents cross-DB cache reuse by itself, so the remaining problem is lifecycle wiring rather than the local cache implementation.
- **Evidence**: `lib/search/graph-search-fn.ts:312-320,482-512`; `context-server.ts:966-975`; `core/db-state.ts:133-141,241-259`
- **Impact**: high
