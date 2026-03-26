---
title: "4-stage pipeline refactor"
description: "The 4-stage pipeline structures retrieval into candidate generation, fusion, reranking and filtering with a strict score-immutability invariant in the final stage."
---

# 4-stage pipeline refactor

## 1. OVERVIEW

The 4-stage pipeline structures retrieval into candidate generation, fusion, reranking and filtering with a strict score-immutability invariant in the final stage.

When you ask the system a question, your search goes through four clear steps: gather candidates, combine and score them, rerank the best ones and finally filter the results. This is like an assembly line where each station has one job and passes its work to the next. The old system tried to do everything in one messy step, which made it hard to find and fix problems. The new structure makes each step predictable and testable.

---

## 2. CURRENT REALITY

The retrieval pipeline was restructured into four bounded stages with clear responsibilities, a single authoritative scoring point and a strict score-immutability invariant in the final stage.

Stage 1 (Candidate Generation) executes search channels based on query type: multi-concept, deep mode with query expansion, embedding expansion with R15 mutual exclusion, or standard hybrid search. The R8 memory summary channel runs in parallel when the scale gate is met (>5K memories), merging and deduplicating results by memory ID. Summary candidates now pass through the same `minQualityScore` filter as other candidates (Sprint 8 fix). Constitutional memory injection and quality/tier filtering run at the end of Stage 1.

**Phase 017 update:** The query embedding is now cached at function scope for reuse in the constitutional injection path, saving one API call per search. The constitutional injection count is tracked and passed through the orchestrator to Stage 4 output metadata (previously hardcoded to 0).

Stage 2 (Fusion and Signal Integration) applies scoring/enrichment in a fixed order: session boost, causal boost, co-activation spreading, community co-retrieval (N2c from precomputed `community_assignments`), graph signals (N2a+N2b: additive momentum/depth bonuses), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection (N2c) runs before graph signals (N2a+N2b) so injected rows also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.

**Phase 017 update:** Stage 2 now uses the shared `resolveEffectiveScore()` function from `pipeline/types.ts` (aliased as `resolveBaseScore`) for consistent score resolution. The five-factor composite weights auto-normalize to sum 1.0 after partial overrides. Cross-variant RRF fusion no longer double-counts convergence bonuses (per-variant bonus subtracted before cross-variant bonus). Adaptive fusion core weights (semantic + keyword + recency) normalize after doc-type adjustments.

Stage 3 (Rerank and Aggregate) handles optional cross-encoder reranking (gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly preserving document order.

Stage 4 (Filter and Annotate) enforces the "no score changes" invariant via dual enforcement: compile-time `Stage4ReadonlyRow` readonly fields plus runtime `verifyScoreInvariant()` assertion checking all six score fields. Within this invariant, it applies memory state filtering, TRM evidence gap detection and annotation metadata.

**Phase 017 update:** The legacy `postSearchPipeline` path was removed entirely, leaving the 4-stage pipeline as the only code path. A shared `resolveEffectiveScore()` function in `pipeline/types.ts` replaced both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`, ensuring a consistent fallback chain (`intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1]) across all stages.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/pipeline/orchestrator.ts` | Lib | Pipeline orchestration — dispatches Stage 1-4 in sequence |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Stage 1: candidate generation across search channels |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Stage 2: fusion and signal integration (session boost, causal boost, co-activation, graph signals, FSRS, intent, feedback) |
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Lib | Stage 3: cross-encoder reranking and MPAB chunk collapse |
| `mcp_server/lib/search/pipeline/stage4-filter.ts` | Lib | Stage 4: filter and annotate with score-immutability invariant (`Stage4ReadonlyRow`, `verifyScoreInvariant()`) |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Shared pipeline types including `resolveEffectiveScore()` |
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Entry point: invokes orchestrator, applies post-pipeline steps |
| `shared/algorithms/rrf-fusion.ts` | Shared | RRF fusion algorithm used in Stage 2 |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/pipeline-v2.vitest.ts` | V2 pipeline orchestration |
| `mcp_server/tests/pipeline-integration.vitest.ts` | Pipeline integration tests |
| `mcp_server/tests/integration-search-pipeline.vitest.ts` | Search pipeline integration |
| `mcp_server/tests/stage2-fusion.vitest.ts` | Stage 2 fusion validation |
| `mcp_server/tests/hybrid-search.vitest.ts` | Hybrid search orchestration |

---

## 4. SOURCE METADATA

- Group: Pipeline architecture
- Source feature title: 4-stage pipeline refactor
- Current reality source: FEATURE_CATALOG.md
