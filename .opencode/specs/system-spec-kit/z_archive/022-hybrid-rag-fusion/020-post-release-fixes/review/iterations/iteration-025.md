# Iteration 025 -- Wave 1 Search Stages, Routing, And Confidence

**Agent:** GPT-5.4 (Codex main run)
**Dimension:** correctness, maintainability
**Status:** complete
**Timestamp:** 2026-03-27T16:04:00+01:00

## Findings

- `HRF-DR-021 [P2]` Tail results get synthetic `large_margin` confidence because `computeMargin()` returns `1.0` when there is no next score.
- `HRF-DR-022 [P2]` `query-router` enforces a minimum array length, not a minimum distinct-channel count.
- `HRF-DR-023 [P2]` Stage-2b enrichment has a fail-open contract but no direct regression coverage for the real failure path.

## Evidence
- `lib/search/confidence-scoring.ts:177-181,224-254`
- `lib/search/query-router.ts:72-101`
- `lib/search/pipeline/stage2b-enrichment.ts:25-48`
- `tests/d5-confidence-scoring.vitest.ts:142-148`
- `tests/query-router.vitest.ts:222-230`
- `tests/stage2-fusion.vitest.ts:40-46`

## Next Adjustment
- Finish wave 1 with provider, retry, cache, and shutdown behavior to see whether lifecycle handling hides another release-blocking defect.
