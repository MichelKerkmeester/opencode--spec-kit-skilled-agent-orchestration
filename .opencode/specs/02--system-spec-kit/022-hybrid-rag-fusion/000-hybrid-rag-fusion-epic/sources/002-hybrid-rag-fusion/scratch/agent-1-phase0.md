# Agent-1 Phase 0: Gap Analysis & Implementation Report

## Gap Analysis

| Task | Status | Evidence |
|------|--------|----------|
| 1. Replace hardcoded weights with `hybridAdaptiveFuse(intent)` | DONE (by 003) | hybrid-search.ts L453-462: calls `hybridAdaptiveFuse()` and overwrites list weights |
| 2. Activate Graph Routing (`useGraph: true` default) | DONE (by 003) | hybrid-search.ts L266/L418: `useGraph` defaults to `true`, graph channel in pipeline with metrics |
| 3. Activate Co-Activation (`spreadActivation` post-RRF) | DONE (by 003) | hybrid-search.ts L479-501: `spreadActivation(topIds)` called after RRF fusion with score boosting |
| 4. Implement Adaptive Fallback (two-pass retry) | NOT DONE | `searchWithFallback` had simple chain (FTS->BM25) without two-pass min_similarity retry |

## Additional Gap Found
- Graph channel weight not using adaptive fusion `graphWeight` — hardcoded to 0.5 instead of using the intent-specific value from `adaptiveResult.weights.graphWeight`

## What Was Implemented

### 1. Graph weight from adaptive fusion applied (hybrid-search.ts ~L461)
- Added `graphWeight` extraction from `adaptiveResult.weights`
- Applied to graph source in fusion lists (was hardcoded 0.5, now uses intent-specific value e.g. 0.15 for understand, 0.30 for find_spec)

### 2. Two-pass adaptive fallback in `searchWithFallback` (hybrid-search.ts ~L519-555)
- Primary pass uses `minSimilarity=0.3` (or caller-specified)
- If 0 results AND threshold >= 0.17, retries at `minSimilarity=0.17`
- Tags all fallback results with `fallbackRetry=true` metadata flag
- Falls through to FTS-only and BM25-only chains if both passes fail

### 3. Tests added to hybrid-search.vitest.ts
- `C138-P0: useGraph:true Default Routing` suite (5 tests): verifies graph defaults on, can be disabled, metrics tracked, adaptive weight applied
- `C138-P0: Adaptive Fallback in searchWithFallback` suite (1 test): verifies two-pass chain

### 4. Existing test coverage (already adequate, no changes needed)
- adaptive-fusion.vitest.ts: Already has C138 intent-weighted RRF tests (T019 suite + C138 suite)
- co-activation.vitest.ts: Already has C138 pipeline integration tests
- adaptive-fallback.vitest.ts: Already has 7 tests for two-pass logic (extracted helper)

## Files Modified
- `/Users/michelkerkmeester/.../mcp_server/lib/search/hybrid-search.ts` (L461: graph weight, L519-555: two-pass fallback)
- `/Users/michelkerkmeester/.../mcp_server/tests/hybrid-search.vitest.ts` (6 new tests in 2 suites)

## No Blockers
