---
title: "Scoring and fusion corrections"
description: "Covers nine scoring fixes including intent weight recency, five-factor weight normalization, stack overflow prevention, BM25 specFolder filter, shared `resolveEffectiveScore` consolidation, RRF ID canonicalization, and a later single-pass fusion refinement."
---

# Scoring and fusion corrections

## 1. OVERVIEW

Covers nine scoring fixes including intent weight recency, five-factor weight normalization, stack overflow prevention, BM25 specFolder filter, shared `resolveEffectiveScore` consolidation, and RRF ID canonicalization, plus a later single-pass fusion refinement.

These nine fixes address problems in how scores are calculated and combined. Issues ranged from weights that did not add up to 100% to a method that crashed when processing large batches and a filter that compared apples to oranges. Each fix makes the scoring math more accurate and stable, ensuring the final ranking truly reflects which results are most relevant to your question.

---

## 2. CURRENT REALITY

Nine scoring issues were fixed:

- **Intent weight recency (#5):** `applyIntentWeights` now includes timestamp-based recency scoring. Uses loop-based min/max to find timestamp range (no spread operator stack overflow).
- **Five-factor weight normalization (#6):** Composite scoring weights auto-normalize to sum 1.0 after partial overrides. Without this, overriding one weight broke weighted-average semantics.
- **Stack overflow prevention (#7):** `normalizeCompositeScores` replaced `Math.max(...scores)` / `Math.min(...scores)` with a for-loop. The spread operator causes stack overflow on arrays >100K elements.
- **BM25 specFolder filter (#8):** The BM25 index stores document IDs as stringified numbers (e.g., "42"). The old filter compared these against spec folder paths, which never matched. Replaced with a DB lookup to resolve `spec_folder` per result.
- **RRF convergence double-count (#9):** Cross-variant fusion now merges each variant's fused `rrfScore` as-is, then applies one cross-variant convergence bonus based on how many distinct variants contained the result. The implementation no longer subtracts any per-variant bonus during the merge step.
- **Adaptive fusion normalization (#10):** Core weights (semantic + keyword + recency) now normalize to sum 1.0 after doc-type adjustments. Only applied when doc-type shifts alter the balance.
- **Shared resolveEffectiveScore (#11):** A single function in `pipeline/types.ts` replaces both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`. Uses the canonical fallback chain: `intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1].
- **Configurable interference threshold (#12):** `computeInterferenceScoresBatch()` now accepts an optional `threshold` parameter (defaults to `INTERFERENCE_SIMILARITY_THRESHOLD`).
- **RRF ID canonicalization (#13):** `fuseResultsMulti()` and `fuseResultsCrossVariant()` now use `canonicalRrfId()` for map keys and variant appearance tracking, preventing numeric/string ID splits such as `42` vs "42" from surfacing as duplicate fused items.

A later performance follow-up (T315) now keeps the live hybrid fusion path single-pass. `mcp_server/lib/search/hybrid-search.ts` computes the active channel weights once, using `getAdaptiveWeights(intent, documentType)` as the shared helper surface and fixed 1.0/1.0 weights when adaptive fusion is disabled, then builds the weighted `fusionLists` directly for `fuseResultsMulti(...)`. This avoids running a standard fuse first just to recover weight information for the live merge.

In the non-hybrid flow, after Step 4 applies `intentAdjustedScore`, subsequent pipeline steps (artifact routing, feedback signals, session boost, and causal boost) can mutate `score`. Since `resolveEffectiveScore()` prefers `intentAdjustedScore` over `score`, later modifications were invisible in final ranking. A synchronization pass now flat-overwrites the score aliases by clamping the current value and writing the same number into `score`, `rrfScore`, and `intentAdjustedScore` via `withSyncedScoreAliases()` and `syncScoreAliasesInPlace()`. This keeps downstream ranking consistent with the latest pipeline score; it does not preserve the prior value with `Math.max(...)`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk aggregation |
| ~~`mcp_server/lib/search/rsf-fusion.ts`~~ | ~~Lib~~ | Deleted — RSF module removed as dead code |
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Builds the live weighted `fusionLists` once before `fuseResultsMulti(...)` |
| `shared/algorithms/adaptive-fusion.ts` | Shared | Exposes `getAdaptiveWeights(...)` for the single-pass live fusion weighting path |
| `shared/algorithms/rrf-fusion.ts` | Shared | RRF fusion algorithm |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/mpab-aggregation.vitest.ts` | MPAB aggregation tests |
| `mcp_server/tests/rrf-fusion.vitest.ts` | RRF fusion validation |
| ~~`mcp_server/tests/rsf-fusion-edge-cases.vitest.ts`~~ | Deleted — RSF tests removed with RSF module |
| ~~`mcp_server/tests/rsf-fusion.vitest.ts`~~ | Deleted — RSF tests removed with RSF module |
| `mcp_server/tests/unit-rrf-fusion.vitest.ts` | RRF unit tests |

### Fix Traceability Matrix

| Fix | Implementing source | Validating test |
|-----|----------------------|-----------------|
| #5 Intent weight recency | `mcp_server/lib/search/intent-classifier.ts` (`applyIntentWeights`) | `mcp_server/tests/intent-weighting.vitest.ts` |
| #6 Five-factor weight normalization | `mcp_server/lib/scoring/composite-scoring.ts` (`calculateFiveFactorScore`) | `mcp_server/tests/composite-scoring.vitest.ts` |
| #7 Composite normalization stack-safety | `mcp_server/lib/scoring/composite-scoring.ts` (`normalizeCompositeScores`) | `mcp_server/tests/score-normalization.vitest.ts` |
| #8 BM25 specFolder filter | `mcp_server/lib/search/hybrid-search.ts` (`bm25Search`) | `mcp_server/tests/hybrid-search.vitest.ts` |
| #9 RRF convergence double-count | `shared/algorithms/rrf-fusion.ts` (`fuseResultsCrossVariant`) | `mcp_server/tests/unit-rrf-fusion.vitest.ts` |
| #10 Adaptive fusion normalization | `shared/algorithms/adaptive-fusion.ts` (`getAdaptiveWeights`) | `mcp_server/tests/adaptive-fusion.vitest.ts` |
| #11 Shared resolveEffectiveScore | `mcp_server/lib/search/pipeline/types.ts` (`resolveEffectiveScore`), wired in `pipeline/stage2-fusion.ts` and `pipeline/stage3-rerank.ts` | `mcp_server/tests/pipeline-v2.vitest.ts` |
| #12 Configurable interference threshold | `mcp_server/lib/scoring/interference-scoring.ts` (`computeInterferenceScoresBatch`) | `mcp_server/tests/interference.vitest.ts` |
| #13 RRF ID canonicalization | `shared/algorithms/rrf-fusion.ts` (`canonicalRrfId`, `fuseResultsMulti`, `fuseResultsCrossVariant`) | `mcp_server/tests/unit-rrf-fusion.vitest.ts` |
| T315 Single-pass fusion precomputation | `mcp_server/lib/search/hybrid-search.ts` (`fusionLists`, `fuseResultsMulti(...)`), `shared/algorithms/adaptive-fusion.ts` (`getAdaptiveWeights`) | `mcp_server/tests/hybrid-search.vitest.ts`, `mcp_server/tests/adaptive-fusion.vitest.ts` |

---

## 4. SOURCE METADATA

- Group: Opus review remediation (Phase 017)
- Source feature title: Scoring and fusion corrections
- Current reality source: FEATURE_CATALOG.md
