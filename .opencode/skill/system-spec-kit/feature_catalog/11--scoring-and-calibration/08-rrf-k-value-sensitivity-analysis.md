# RRF K-value sensitivity analysis

## Current Reality

The K parameter in Reciprocal Rank Fusion controls how much rank position matters. A low K amplifies rank differences while a high K compresses them.

A grid search over K values {20, 40, 60, 80, 100} measured MRR@5 delta per value using Kendall tau correlation for ranking stability. The optimal K was identified and documented. Before this analysis, K was chosen by convention rather than measurement. Now it is empirically grounded.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/k-value-analysis.ts` | Lib | RRF k-value sensitivity analysis |
| `shared/algorithms/rrf-fusion.ts` | Shared | RRF fusion algorithm |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/rrf-fusion.vitest.ts` | RRF fusion validation |
| `mcp_server/tests/unit-rrf-fusion.vitest.ts` | RRF unit tests |

## Source Metadata

- Group: Scoring and calibration
- Source feature title: RRF K-value sensitivity analysis
- Current reality source: feature_catalog.md
