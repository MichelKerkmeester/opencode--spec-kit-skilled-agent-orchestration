# Double intent weighting investigation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. HYBRID PIPELINE TRACE (ISHYBRID GATE PATH)](#3--hybrid-pipeline-trace-ishybrid-gate-path)
- [4. REGRESSION COVERAGE](#4--regression-coverage)
- [5. SOURCE FILES](#5--source-files)
- [6. SOURCE/TEST TRACEABILITY](#6--sourcetest-traceability)
- [7. SOURCE METADATA](#7--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Double intent weighting investigation.

## 2. CURRENT REALITY

A full pipeline trace through `hybrid-search.ts`, `intent-classifier.ts` and `adaptive-fusion.ts` investigated whether intent weights applied at two separate points was a bug. The answer: intentional design.

System A (`INTENT_WEIGHT_PROFILES` in adaptive fusion) controls how much each channel contributes during RRF fusion. System B (`INTENT_WEIGHT_ADJUSTMENTS` in the intent classifier) controls how result attributes (similarity, importance, recency) are weighted after fusion. These operate on different dimensions at different pipeline stages and serve complementary purposes.

A minor inefficiency exists (recency boost from System A is discarded when System B re-scores), but it is harmless. No code change needed. The 4-stage pipeline (R6) resolved this structurally: Stage 2 applies intent weights only for non-hybrid search types via an `isHybrid` boolean gate, so the code path for double-weighting is absent by design.

## 3. HYBRID PIPELINE TRACE (ISHYBRID GATE PATH)

1. `hybrid-search.ts` classifies query intent and applies System A channel fusion with `hybridAdaptiveFuse(...)` for hybrid retrieval (`mcp_server/lib/search/hybrid-search.ts`).
2. Stage 2 receives `searchType: 'hybrid'` and computes `const isHybrid = config.searchType === 'hybrid'` (`mcp_server/lib/search/pipeline/stage2-fusion.ts`).
3. The System B branch is explicitly gated: `if (!isHybrid && config.intentWeights) { ... }`.
4. For hybrid requests, `!isHybrid` is `false`, so `applyIntentWeightsToResults(...)` does not run in Stage 2.
5. Result: hybrid path uses System A in fusion, while System B is skipped, preventing double-weighting by control-flow design.

## 4. REGRESSION COVERAGE

The no-double-weighting behavior is validated by `mcp_server/tests/intent-weighting.vitest.ts`, especially the `T017-G2: Weights Not Double-Counted in Pipeline` suite. The Stage 2 contract also tracks G2 guard metadata (`intentWeightsApplied`) in `mcp_server/tests/pipeline-v2.vitest.ts` (`R6-T24`).

## 5. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/intent-classifier.ts` | Lib | Intent detection |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/intent-classifier.vitest.ts` | Intent classification accuracy |
| `mcp_server/tests/intent-weighting.vitest.ts` | Regression coverage for no double-counting (T017-G2) |
| `mcp_server/tests/pipeline-v2.vitest.ts` | Stage 2 contract includes G2 guard metadata (`intentWeightsApplied`) |

## 6. SOURCE/TEST TRACEABILITY

| Claim | Source | Test |
|------|--------|------|
| System A uses channel-level weights | `shared/algorithms/adaptive-fusion.ts` (`INTENT_WEIGHT_PROFILES`, `hybridAdaptiveFuse`) | `mcp_server/tests/intent-weighting.vitest.ts` |
| System B uses attribute-level weights | `mcp_server/lib/search/intent-classifier.ts` (`INTENT_WEIGHT_ADJUSTMENTS`) | `mcp_server/tests/intent-weighting.vitest.ts` |
| Hybrid path skips Stage 2 System B weighting | `mcp_server/lib/search/pipeline/stage2-fusion.ts` (`isHybrid` + `if (!isHybrid && config.intentWeights)`) | `mcp_server/tests/intent-weighting.vitest.ts`, `mcp_server/tests/pipeline-v2.vitest.ts` |

## 7. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Double intent weighting investigation
- Current reality source: feature_catalog.md
