# Agent 4 — Phase 4 Indexing Quality Assessment

## Gap Analysis

| Task | Status | Notes |
|------|--------|-------|
| 1. AST Parsing (structure-aware-chunker) | **DONE** | Exists at `scripts/lib/structure-aware-chunker.ts` (parent dir, 223 LOC). Test: `mcp_server/tests/structure-aware-chunker.vitest.ts` (167 LOC). |
| 2. Batch PageRank | **DONE** | `mcp_server/lib/manage/pagerank.ts` (134 LOC). Test: `mcp_server/tests/pagerank.vitest.ts` (178 LOC, 10 tests). |
| 3. Embedding Centroids | **NOT DONE — DEFERRED** | Would require embedding model dependency. Current regex+keyword approach in `intent-classifier.ts` works and tests pass. See blocker note. |
| 4. Tier Decay Modulation | **DONE** | `TIER_MULTIPLIER` in `mcp_server/lib/cognitive/fsrs-scheduler.ts:240-247`. 6 tiers (constitutional=0.1 to scratch=3.0). Tests in `fsrs-scheduler.vitest.ts:624-668`. |
| 5. Read-Time Prediction Error | **DONE** | `mcp_server/lib/cognitive/prediction-error-gate.ts` (538 LOC). Full `detectContradiction()`, 8 pattern types, conflict logging. Tests: `mcp_server/tests/prediction-error-gate.vitest.ts` (517 LOC). |

## Summary: 4 of 5 tasks DONE, 1 DEFERRED

All files referenced by base path `.opencode/skill/system-spec-kit/`:

| File | Location | LOC |
|------|----------|-----|
| structure-aware-chunker.ts | `scripts/lib/` | 223 |
| pagerank.ts | `mcp_server/lib/manage/` | 134 |
| fsrs-scheduler.ts (TIER_MULTIPLIER) | `mcp_server/lib/cognitive/` | 281 |
| prediction-error-gate.ts | `mcp_server/lib/cognitive/` | 538 |
| intent-classifier.ts | `mcp_server/lib/search/` | 386 (no centroids) |

## Blocker: Task 3 (Embedding Centroids)

The spec calls for replacing regex classification with centroid-based cosine similarity. This requires:
1. An embedding model/API (e.g., OpenAI embeddings or local model)
2. Pre-computed 7 centroid vectors (one per intent type)
3. `dotProduct()` math for classification

The current `intent-classifier.ts` uses keyword+pattern regex scoring, which works reliably (>80% accuracy per tests). Adding centroid-based classification is an architectural change requiring external dependencies, not a single-file modification. Recommend as a separate workstream.

## No Implementation Needed

All 4 achievable tasks were already implemented by prior workstreams. No new code was written.
