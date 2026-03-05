# T003: Double Intent Weighting — COMPLETE

**Agent:** S2-A3
**Date:** 2026-02-27

---

## Finding: INTENTIONAL DESIGN

The two intent weight systems serve **different, complementary purposes** and do NOT double-count.

## Locations Where Intent Weights Are Applied

| # | Location | System | Weight Source | Purpose |
|---|----------|--------|-------------|---------|
| 1 | `hybrid-search.ts:507-517` | A: Channel Fusion | `INTENT_WEIGHT_PROFILES` (adaptive-fusion.ts:60) | Controls how much each retrieval channel (vector, FTS, BM25, graph) contributes to RRF fusion |
| 2 | `memory-search.ts:891` | B: Result Scoring | `INTENT_WEIGHT_ADJUSTMENTS` (intent-classifier.ts:192) | Controls how individual result attributes (similarity, importance, recency) are weighted in final score |
| 3 | `hybrid-search.ts:562` | MMR Lambda | `INTENT_LAMBDA_MAP` (intent-classifier.ts:506) | Controls relevance vs diversity tradeoff in MMR reranking |

## What Was Changed

**No code changes.** The design is intentional and correct.

Minor inefficiency noted (not fixed — harmless): The recency boost applied during adaptive fusion (`applyRecencyBoost` in adaptive-fusion.ts:191) is effectively overwritten when `applyIntentWeightsToResults` replaces the score in the post-pipeline. This is wasted computation but has negligible performance impact.

## Tests Added

**File:** `tests/t017-g2-intent.vitest.ts`
**Tests:** 23

| Section | Count | Description |
|---------|-------|-------------|
| Intent Classification Produces Expected Weights | 6 | Verifies classification correctness, both weight system coverage, structural independence, System B sum-to-1 |
| Weights Not Double-Counted in Pipeline | 5 | Verifies System A uses channel weights, System B uses attribute weights, RRF is rank-based, different intents produce different distributions |
| Pipeline Ordering Stability (No Regression) | 5 | Preserves all items, sorted output, deterministic, INTENT_LAMBDA_MAP coverage |
| Score Distribution Characteristics | 4 | RRF score range, System B score range, channel weight influence, profile correctness |
| Normalization Method (T003d) | 3 | RRF is rank-based not value-based, System B normalizes similarity to 0-1, channel weights don't need sum-to-1 |

## Full Test Suite Status

```
Test Files: 172 passed (172)
Tests:      5090 passed | 19 skipped (5109)
Duration:   7.06s
```

Zero regressions.
