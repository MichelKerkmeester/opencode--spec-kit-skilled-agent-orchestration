---
title: "RRF K experimental tuning"
description: "RRF K experimental tuning enables judged K-value selection for Reciprocal Rank Fusion, sweeping candidate K values and selecting the one that maximizes NDCG@10 per query intent, gated by the SPECKIT_RRF_K_EXPERIMENTAL flag."
---

# RRF K experimental tuning

## 1. OVERVIEW

RRF K experimental tuning enables per-intent K-value selection for Reciprocal Rank Fusion, sweeping candidate K values and selecting the one that maximizes NDCG@10 per query intent, gated by the `SPECKIT_RRF_K_EXPERIMENTAL` flag.

The RRF smoothing constant `k` in the formula `1/(k + rank)` controls how much top-ranked results dominate the fused score. A lower `k` makes the system more sensitive to early ranks; a higher `k` flattens the effect. Rather than using a single fixed `k=60` for all queries, this feature runs a sweep over candidate K values for each query intent and picks the one that produces the best ranking quality (measured by NDCG@10), with ties broken by lower K values.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_RRF_K_EXPERIMENTAL=false` to revert to the default K=60 for all intents.

The `isKExperimentalEnabled()` function in `k-value-analysis.ts` checks the flag. When enabled, `runJudgedKSweep()` groups judged queries by intent, evaluates each against `JUDGED_K_SWEEP_VALUES`, and selects the K that maximizes NDCG@10 via `argmaxNdcg10()`. The `evalQueriesAtK()` function computes aggregate NDCG@10 and MRR@5 metrics for a given K. When disabled, K=60 is used for all intents without running the sweep.

Additionally, the runtime override `SPECKIT_RRF_K` allows a single global K override in `rrf-fusion.ts`, accepted only when parseable as a finite positive number.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/k-value-analysis.ts` | Lib | `isKExperimentalEnabled()`, `runJudgedKSweep()`, K-value sensitivity analysis, NDCG/MRR computation |
| `shared/algorithms/rrf-fusion.ts` | Shared | `resolveRrfK()` with `SPECKIT_RRF_K` runtime override, `DEFAULT_K = 60` |
| `mcp_server/lib/search/search-flags.ts` | Lib | Central flag registry reference |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/k-value-judged-sweep.vitest.ts` | Judged K sweep, per-intent selection, flag gating |
| `mcp_server/tests/k-value-optimization.vitest.ts` | K-value optimization and flag behavior |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: RRF K experimental tuning
- Current reality source: mcp_server/lib/eval/k-value-analysis.ts module header and `isKExperimentalEnabled()` implementation
