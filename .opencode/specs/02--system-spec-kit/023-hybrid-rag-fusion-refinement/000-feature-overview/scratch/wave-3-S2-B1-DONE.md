# Wave 3 S2-B1: Score Normalization + K-Value Analysis — DONE

## Files Modified

1. **`mcp_server/lib/search/rrf-fusion.ts`** — Added score normalization
   - Added `isScoreNormalizationEnabled()` function (checks `SPECKIT_SCORE_NORMALIZATION` env var)
   - Added `normalizeRrfScores()` function (min-max normalization to [0,1])
   - Integrated normalization into `fuseResultsMulti()` (gated behind flag)
   - Integrated normalization into `fuseResultsCrossVariant()` (gated behind flag)
   - Added both functions to exports (no existing exports removed)

2. **`mcp_server/lib/scoring/composite-scoring.ts`** — Added batch normalization
   - Added `isCompositeNormalizationEnabled()` function
   - Added `normalizeCompositeScores()` function (min-max normalization, gated behind same flag)
   - Verified existing `calculateFiveFactorScore` and `calculateCompositeScore` both already clamp to [0,1] via `Math.max(0, Math.min(1, ...))`

## Files Created

3. **`mcp_server/lib/eval/k-value-analysis.ts`** (NEW) — K-value sensitivity analysis
   - `analyzeKValueSensitivity()` — runs fusion with K in {20, 40, 60, 80, 100}
   - `kendallTau()` — Kendall tau rank correlation between two rankings
   - `mrr5()` — Mean Reciprocal Rank at cutoff 5
   - Returns per-K metrics: {mrr5, kendallTau, avgScore}

4. **`mcp_server/tests/t018-score-normalization.vitest.ts`** (NEW) — 30 tests

## Tests Added (30 total, all passing)

### RRF Score Normalization (8 tests)
- normalizes scores to [0,1] range
- single result normalizes to 1.0
- equal scores normalize to 1.0
- empty array is a no-op
- produces [0,1] scores when normalization enabled
- normalization disabled when flag is false
- normalization disabled when flag is explicitly "false"
- cross-variant fusion normalizes to [0,1] when enabled

### Composite Score Normalization (5 tests)
- normalizes a batch of composite scores to [0,1]
- returns scores unchanged when flag is disabled
- handles empty array
- equal scores normalize to 1.0
- single score normalizes to 1.0

### K-Value Sensitivity Analysis (8 tests)
- produces results for all 5 K values
- baseline K is 60
- K=60 has kendallTau = 1.0 (correlation with itself)
- K=60 has highest mrr5 (self-retrieval)
- Kendall tau is in [-1, 1] range for all K values
- MRR@5 is in [0, 1] range for all K values
- avgScore is non-negative for all K values
- totalItems reflects unique IDs across all fusions
- handles empty lists gracefully

### Kendall Tau Unit Tests (5 tests)
- identical rankings have tau = 1.0
- reversed rankings have tau = -1.0
- single element has tau = 1.0
- empty rankings have tau = 1.0
- partially shuffled ranking has 0 < tau < 1

### MRR@5 Unit Tests (3 tests)
- identical rankings produce correct MRR@5
- empty baseline returns 0
- items shifted down reduce MRR

## Test Results
- **t018 tests: 30/30 passing**
- **adaptive-fusion tests: 24/24 passing** (no regression)
- Full suite: pre-existing failures only (50 files, all related to @spec-kit/shared workspace resolution)

## Decisions Made

1. **Normalization method**: Min-max normalization (maps scores linearly to [0,1]). Chosen for simplicity and interpretability.

2. **Feature gate**: Single env var `SPECKIT_SCORE_NORMALIZATION=true` gates both RRF and composite normalization. Default: disabled for backward compatibility.

3. **Edge cases**:
   - Empty result set: no-op
   - Single result: normalizes to 1.0
   - All equal scores: normalizes to 1.0

4. **`normalizeRrfScores` is exported separately**: Allows callers to apply normalization independently (e.g., after `fuseScoresAdvanced` which adds term match bonuses post-fusion).

5. **`fuseResults` (two-list) not normalized**: Only `fuseResultsMulti` and `fuseResultsCrossVariant` have integrated normalization, since `fuseResults` is the simpler legacy path.

6. **MRR@5 semantics**: MRR@5 for identical rankings is ~0.457, not 1.0. This is mathematically correct — MRR averages 1/rank for each baseline item, so items at ranks 2-5 contribute less than 1.0.

7. **Kendall tau on subset**: When rankings have different items, correlation is computed on the intersection only. This handles the case where different K values may produce slightly different result sets.

8. **Test mocking**: Used vi.mock for @spec-kit/shared dependencies (folder-scoring, access-tracker, importance-tiers) since workspace linking is not available in worktree environments. This is consistent with how the pre-existing composite-scoring tests would need to be fixed.
