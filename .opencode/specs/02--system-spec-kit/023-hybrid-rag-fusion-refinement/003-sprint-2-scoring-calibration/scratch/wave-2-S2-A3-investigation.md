# T003: Double Intent Weighting Investigation (G2)

**Agent:** S2-A3
**Date:** 2026-02-27
**Finding:** INTENTIONAL DESIGN (two separate systems, different purposes)

---

## 1. Weight Systems Identified

There are **two independent intent weight systems** operating in the search pipeline:

### System A: Channel Fusion Weights (`adaptive-fusion.ts`)
- **Location:** `INTENT_WEIGHT_PROFILES` (line 60-68)
- **Structure:** `{ semanticWeight, keywordWeight, recencyWeight, graphWeight, graphCausalBias }`
- **Purpose:** Controls how much each retrieval CHANNEL (vector, FTS/BM25, graph) contributes to the fused ranking during RRF
- **Applied in:** `hybridSearchEnhanced()` at `hybrid-search.ts:508-517`
- **Mechanism:** Sets `list.weight` for each channel list, then `fuseResultsMulti()` uses `weight * (1/(k + rank + 1))` per item

### System B: Result Scoring Weights (`intent-classifier.ts`)
- **Location:** `INTENT_WEIGHT_ADJUSTMENTS` (line 192-200)
- **Structure:** `{ recency, importance, similarity, contextType }`
- **Purpose:** Controls how individual result ATTRIBUTES (similarity score, importance tier, recency) are combined into a final score
- **Applied in:** `postSearchPipeline()` at `memory-search.ts:891` via `applyIntentWeightsToResults()`
- **Mechanism:** Computes `intentScore = similarity * w.similarity + importance * w.importance + recencyRaw * w.recency`

## 2. Data Flow Trace

```
Query enters memory_search handler
    |
    v
[1] classifyIntent(query) --> detectedIntent + intentWeights (System B: INTENT_WEIGHT_ADJUSTMENTS)
    |
    v
[2] hybridSearch.searchWithFallback(query, embedding, options)
    |
    +---> hybridSearchEnhanced()
    |       |
    |       v
    |     [3] classifyIntent(query) --> intent  (SECOND call, line 507)
    |       |
    |       v
    |     [4] hybridAdaptiveFuse(semanticResults, keywordResults, intent)
    |       |   --> returns FusionWeights (System A: INTENT_WEIGHT_PROFILES)
    |       |   --> { semanticWeight, keywordWeight, recencyWeight, graphWeight }
    |       |
    |       v
    |     [5] Updates list.weight for each channel (lines 513-517)
    |       |
    |       v
    |     [6] fuseResultsMulti(lists) --> FusionResult[] with rrfScore
    |       |   Each item's rrfScore = sum of weighted rank contributions
    |       |
    |       v
    |     [7] MMR reranking (optional, uses INTENT_LAMBDA_MAP)
    |       |
    |       v
    |     [8] Co-activation spreading (boost scores)
    |       |
    |       v
    |     Returns HybridSearchResult[] (score = rrfScore from RRF fusion)
    |
    v
[9] postSearchPipeline(hybridResults, ...)
    |
    v
[10] filterByMemoryState()
    |
    v
[11] sessionBoost (optional)
    |
    v
[12] causalBoost (optional)
    |
    v
[13] applyIntentWeightsToResults(results, intentWeights)  <-- System B applied here
    |   For each result:
    |     similarity = raw_similarity / 100  (normalized 0-1)
    |     importance = importance_weight     (already 0-1)
    |     recency = min-max normalized timestamp (0-1)
    |     intentScore = sim * w.similarity + imp * w.importance + rec * w.recency
    |     result.score = intentScore  <-- REPLACES the rrfScore from step [6]
    |
    v
[14] Cross-encoder reranking (optional)
    |
    v
Final results returned
```

## 3. Analysis: Bug or Intentional?

### NOT a double-counting bug

The two weight systems operate on **completely different dimensions**:

| Aspect | System A (Channel Fusion) | System B (Result Scoring) |
|--------|--------------------------|--------------------------|
| **What it weights** | Retrieval channels (vector, FTS, BM25, graph) | Result attributes (similarity, importance, recency) |
| **When applied** | During RRF fusion (step 5-6) | After fusion, in post-pipeline (step 13) |
| **What it affects** | Which results survive fusion and their initial ordering | Final score used for display ranking |
| **Score type** | RRF rank-based score | Weighted attribute combination |
| **Weight source** | `INTENT_WEIGHT_PROFILES` in adaptive-fusion.ts | `INTENT_WEIGHT_ADJUSTMENTS` in intent-classifier.ts |

### Analogy
- System A is like choosing which fishing nets to use (deep sea vs shallow)
- System B is like sorting the caught fish by size vs freshness vs species

### Minor inefficiency found (NOT a bug)

The `recencyWeight` in System A's `adaptive-fusion.ts:applyRecencyBoost()` (line 191-212) adds a recency bonus to `rrfScore`. But at step 13, `applyIntentWeightsToResults()` **replaces** `result.score` entirely with `intentScore`, discarding the RRF recency boost. The recency boost from adaptive fusion is wasted computation when the post-pipeline always re-scores.

This is harmless (tiny computation cost) and the recency IS still applied correctly via System B's `recency` weight factor.

### Note: classifyIntent() called twice

`classifyIntent(query)` is called at two points:
1. `memory-search.ts:1144` -- for System B weights
2. `hybrid-search.ts:507` -- for System A weights (when `options.intent` is not passed)

This is a minor redundancy (the function is cheap/deterministic), not a correctness issue. The memory-search handler could pass `detectedIntent` through the options to avoid the double call, but it does not cause incorrect behavior.

## 4. Recommendation

**No code changes needed.** The design is intentional and correct.

The two systems serve complementary purposes:
- System A ensures the right retrieval channels are weighted properly for the intent
- System B ensures individual results are ranked by the most relevant attributes for the intent

Document this in tests to prevent future confusion.

## 5. Score Distribution Observations

### RRF Scores (System A output)
- Range: `1/(60+1) = 0.0164` to `sum of weighted ranks across channels`
- Typical max with 3 channels: ~0.05
- Convergence bonus: +0.10 per additional source
- These are RANK-based, not value-based

### Intent Adjusted Scores (System B output)
- Range: 0.0 to 1.0 (all factors normalized to 0-1)
- `similarity/100 * w_sim + importance * w_imp + recency * w_rec`
- Sum of weights = 1.0 for each intent profile

System B scores are inherently more interpretable than RRF scores, which is one reason the post-pipeline re-scoring is valuable.
