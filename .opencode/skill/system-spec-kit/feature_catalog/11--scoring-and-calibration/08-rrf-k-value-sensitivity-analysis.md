---
title: "RRF K-value sensitivity analysis"
description: "Documents the grid search over K values [10, 20, 40, 60, 80, 100, 120] that empirically grounded the RRF K parameter choice using MRR@5 delta and Kendall tau correlation."
---

# RRF K-value sensitivity analysis

## 1. OVERVIEW

Documents the grid search over K values [10, 20, 40, 60, 80, 100, 120] that empirically grounded the RRF K parameter choice using MRR@5 delta and Kendall tau correlation.

When combining results from different search methods, a single tuning knob controls how much "being ranked first" matters versus "appearing in multiple lists." This analysis tested seven different settings for that knob and measured which one produced the best results. Before this work, the setting was chosen by gut feeling. Now it is chosen by data.

---

## 2. CURRENT REALITY

The K parameter in Reciprocal Rank Fusion controls how much rank position matters. A low K amplifies rank differences while a high K compresses them.

A grid search over K values [10, 20, 40, 60, 80, 100, 120] measured MRR@5 delta per value using Kendall tau correlation for ranking stability. The optimal K was identified and documented. Before this analysis, K was chosen by convention rather than measurement. Now it is empirically grounded.

---

## 3. SOURCE FILES

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

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: RRF K-value sensitivity analysis
- Current reality source: FEATURE_CATALOG.md
