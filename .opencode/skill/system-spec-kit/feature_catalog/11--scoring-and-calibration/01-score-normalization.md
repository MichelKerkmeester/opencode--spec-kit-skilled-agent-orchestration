---
title: "Score normalization"
description: "Covers how raw retrieval scores from RRF and composite scoring are min-max normalized to a common [0,1] range before fusion, so relevance signals compete on comparable scale."
---

# Score normalization

## 1. OVERVIEW

Covers how raw retrieval scores from RRF and composite scoring are min-max normalized to a common [0,1] range before fusion, so relevance signals compete on comparable scale.

Different search methods produce scores on different scales, like comparing grades from different schools. This feature puts all scores on the same 0-to-1 scale so they can be compared fairly before picking the best results. Without it, one method might always win just because its numbers happen to be bigger, not because its results are actually better.

---

## 2. CURRENT REALITY

Before normalization, RRF and composite scoring used different raw scales. In `shared/algorithms/rrf-fusion.ts`, RRF uses `1 / (k + rank)` with `DEFAULT_K = 60`, so a top-ranked per-source contribution starts near `1/61 ~= 0.016` and decays by rank (with convergence bonuses potentially pushing combined raw scores above `0.1`). Composite scoring already operates in a `0-1` band.

Min-max normalization now maps both outputs to `0-1`, letting relevance signals compete on comparable scale instead of whichever subsystem emits larger raw magnitudes. Single-result queries and equal-score edge cases normalize to `1.0`.

Normalization is batch-relative (the same memory can score differently across different queries), which is expected for min-max. Runtime gating uses `SPECKIT_SCORE_NORMALIZATION`: `isScoreNormalizationEnabled()`/`normalizeRrfScores()` in `shared/algorithms/rrf-fusion.ts` and `isCompositeNormalizationEnabled()`/`normalizeCompositeScores()` in `mcp_server/lib/scoring/composite-scoring.ts`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/composite-scoring.ts` | Lib | Composite score computation |
| `mcp_server/lib/scoring/folder-scoring.ts` | Lib | Folder scoring implementation |
| `mcp_server/lib/scoring/importance-tiers.ts` | Lib | Importance tier definitions |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
| `mcp_server/lib/storage/access-tracker.ts` | Lib | Access pattern tracking |
| `mcp_server/lib/telemetry/scoring-observability.ts` | Lib | Scoring observability |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/scoring/folder-scoring.ts` | Shared | Shared folder scoring |
| `shared/types.ts` | Shared | Type definitions |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/access-tracker-extended.vitest.ts` | Access tracker extended |
| `mcp_server/tests/access-tracker.vitest.ts` | Access tracker tests |
| `mcp_server/tests/composite-scoring.vitest.ts` | Composite scoring tests |
| `mcp_server/tests/folder-scoring.vitest.ts` | Folder scoring tests |
| `mcp_server/tests/importance-tiers.vitest.ts` | Importance tier tests |
| `mcp_server/tests/interference.vitest.ts` | Interference scoring tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/score-normalization.vitest.ts` | Score normalization tests |
| `mcp_server/tests/scoring-observability.vitest.ts` | Scoring observability tests |
| `mcp_server/tests/scoring.vitest.ts` | General scoring tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-normalization-roundtrip.vitest.ts` | Normalization roundtrip |
| `mcp_server/tests/unit-normalization.vitest.ts` | Normalization unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |

### Score Normalization Traceability

| Behavior | Implementing source | Validating test |
|----------|----------------------|-----------------|
| RRF normalization gate and transform (`SPECKIT_SCORE_NORMALIZATION`, `isScoreNormalizationEnabled`, `normalizeRrfScores`) | `shared/algorithms/rrf-fusion.ts` | `mcp_server/tests/score-normalization.vitest.ts` |
| Cross-variant RRF normalization path | `shared/algorithms/rrf-fusion.ts` (`fuseResultsCrossVariant`) | `mcp_server/tests/score-normalization.vitest.ts` |
| Composite normalization gate and transform (`isCompositeNormalizationEnabled`, `normalizeCompositeScores`) | `mcp_server/lib/scoring/composite-scoring.ts` | `mcp_server/tests/score-normalization.vitest.ts` |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Score normalization
- Current reality source: FEATURE_CATALOG.md
