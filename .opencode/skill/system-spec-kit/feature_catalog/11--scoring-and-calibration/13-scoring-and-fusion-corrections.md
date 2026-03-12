# Scoring and fusion corrections

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Scoring and fusion corrections.

## 2. CURRENT REALITY

Eight scoring issues were fixed:

- **Intent weight recency (#5):** `applyIntentWeights` now includes timestamp-based recency scoring. Uses loop-based min/max to find timestamp range (no spread operator stack overflow).
- **Five-factor weight normalization (#6):** Composite scoring weights auto-normalize to sum 1.0 after partial overrides. Without this, overriding one weight broke weighted-average semantics.
- **Stack overflow prevention (#7):** `normalizeCompositeScores` replaced `Math.max(...scores)` / `Math.min(...scores)` with a for-loop. The spread operator causes stack overflow on arrays >100K elements.
- **BM25 specFolder filter (#8):** The BM25 index stores document IDs as stringified numbers (e.g., "42"). The old filter compared these against spec folder paths, which never matched. Replaced with a DB lookup to resolve `spec_folder` per result.
- **RRF convergence double-count (#9):** Cross-variant fusion now merges each variant's fused `rrfScore` as-is, then applies one cross-variant convergence bonus based on how many distinct variants contained the result. The implementation no longer subtracts any per-variant bonus during the merge step.
- **Adaptive fusion normalization (#10):** Core weights (semantic + keyword + recency) now normalize to sum 1.0 after doc-type adjustments. Only applied when doc-type shifts alter the balance.
- **Shared resolveEffectiveScore (#11):** A single function in `pipeline/types.ts` replaces both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`. Uses the canonical fallback chain: `intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1].
- **Configurable interference threshold (#12):** `computeInterferenceScoresBatch()` now accepts an optional `threshold` parameter (defaults to `INTERFERENCE_SIMILARITY_THRESHOLD`).

In the non-hybrid flow, after Step 4 applies `intentAdjustedScore`, subsequent pipeline steps (artifact routing, feedback signals) write to the `score` field. Since `resolveEffectiveScore()` prefers `intentAdjustedScore` over `score`, later modifications were invisible in final ranking. A synchronization pass now updates `intentAdjustedScore` from the post-signal `score` using `Math.max(intentAdjustedScore, score)` to preserve the higher value while ensuring all pipeline signal contributions are reflected in the final ranking.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk aggregation |
| `mcp_server/lib/search/rsf-fusion.ts` | Lib | Relative score fusion |
| `shared/algorithms/rrf-fusion.ts` | Shared | RRF fusion algorithm |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/mpab-aggregation.vitest.ts` | MPAB aggregation tests |
| `mcp_server/tests/rrf-fusion.vitest.ts` | RRF fusion validation |
| `mcp_server/tests/rsf-fusion-edge-cases.vitest.ts` | RSF fusion edge cases |
| `mcp_server/tests/rsf-fusion.vitest.ts` | RSF fusion scoring |
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
| #11 Shared resolveEffectiveScore | `mcp_server/lib/search/pipeline/types.ts` (`resolveEffectiveScore`), wired in `stage2-fusion.ts` and `stage3-rerank.ts` | `mcp_server/tests/pipeline-v2.vitest.ts` |
| #12 Configurable interference threshold | `mcp_server/lib/scoring/interference-scoring.ts` (`computeInterferenceScoresBatch`) | `mcp_server/tests/interference.vitest.ts` |

## 4. SOURCE METADATA

- Group: Opus review remediation (Phase 017)
- Source feature title: Scoring and fusion corrections
- Current reality source: feature_catalog.md
