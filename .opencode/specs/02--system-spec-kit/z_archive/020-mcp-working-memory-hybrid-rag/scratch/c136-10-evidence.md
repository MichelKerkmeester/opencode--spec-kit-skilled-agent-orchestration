# C136-10 Evidence: Adaptive Hybrid Fusion

## Files Created

1. **`mcp_server/lib/search/adaptive-fusion.ts`** — Adaptive hybrid fusion module
2. **`mcp_server/tests/adaptive-fusion.vitest.ts`** — 15 tests covering all requirements

## Implementation Summary

- **FusionWeights** interface: `{ semanticWeight, keywordWeight, recencyWeight }` (all 0-1)
- **Weight profiles** per intent (no fixed global weights):
  - understand/find_spec: semantic=0.7, keyword=0.2, recency=0.1
  - fix_bug/debug: semantic=0.4, keyword=0.4, recency=0.2
  - add_feature: semantic=0.5, keyword=0.3, recency=0.2
  - refactor: semantic=0.6, keyword=0.3, recency=0.1
  - default: semantic=0.5, keyword=0.3, recency=0.2
- **`getAdaptiveWeights(intent, documentType?)`** — computes dynamic weights with document-type shifts
- **`adaptiveFuse(semanticResults, keywordResults, weights)`** — weighted RRF fusion via `fuseResultsMulti`
- **Feature flag**: `SPECKIT_ADAPTIVE_FUSION` (default OFF, respects rollout-policy)
- **Flag OFF**: deterministic standard RRF fallback (`standardFuse`)
- **Dark-run mode**: computes both, logs diff, returns standard
- **DegradedModeContract** interface: `{ failure_mode, fallback_mode, confidence_impact(0-1), retry_recommendation }`

## Test Results

```
 15 tests passed (0 failed)
 Tests: T1-T5 (intent weight profiles), T6-T7 (sum<=1.0 invariant),
        T8 (deterministic output), T9 (flag OFF), T10 (flag ON),
        T11 (dark-run diff), T12 (degraded contract shape),
        T13 (empty inputs), T14-T15 (intent differentiation)
```

## Verification

- **Unit tests**: `npm run test --workspace=mcp_server -- tests/adaptive-fusion.vitest.ts` -> 15/15 passed
- **Type check**: `npx tsc --noEmit -p mcp_server/tsconfig.json` -> clean (0 new errors)
- **Full suite**: 138 test files, 4377 tests passed, 0 failures, 0 regressions
