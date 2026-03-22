---
title: "Calibrated overlap bonus"
description: "Calibrated overlap bonus replaces the flat convergence bonus in RRF fusion with a query-aware scaled bonus that accounts for the number of overlapping channels and the mean normalized top score, gated by the SPECKIT_CALIBRATED_OVERLAP_BONUS flag."
---

# Calibrated overlap bonus

## 1. OVERVIEW

Calibrated overlap bonus replaces the flat convergence bonus in RRF fusion with a query-aware scaled bonus that accounts for the number of overlapping channels and the mean normalized top score, gated by the `SPECKIT_CALIBRATED_OVERLAP_BONUS` flag.

When multiple retrieval channels (vector, BM25, graph) all return the same result, the system rewards that agreement with a bonus score. The flat bonus gives a fixed reward regardless of how strong the agreement is. This calibrated version scales the reward based on how many channels agree and how strongly they scored the result. The bonus is capped at `CALIBRATED_OVERLAP_MAX = 0.06` to prevent any single overlap bonus from dominating the fused ranking.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_CALIBRATED_OVERLAP_BONUS=false` to revert to the flat convergence bonus.

The `isCalibratedOverlapBonusEnabled()` function in `rrf-fusion.ts` checks the flag. When enabled, the `fuseResultsMulti()` function computes a query-aware overlap bonus using `CALIBRATED_OVERLAP_BETA = 0.15` as the scaling factor and the mean normalized top score across channels. The bonus is clamped to `CALIBRATED_OVERLAP_MAX = 0.06`. When disabled, the standard flat `CONVERGENCE_BONUS = 0.10` is applied instead.

Key constants: `CALIBRATED_OVERLAP_BETA = 0.15`, `CALIBRATED_OVERLAP_MAX = 0.06`, `CONVERGENCE_BONUS = 0.10` (flat fallback).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `shared/algorithms/rrf-fusion.ts` | Shared | `isCalibratedOverlapBonusEnabled()`, calibrated bonus computation in `fuseResultsMulti()` |
| `mcp_server/lib/search/search-flags.ts` | Lib | Central flag registry reference |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/calibrated-overlap-bonus.vitest.ts` | Calibrated overlap bonus behavior and flag gating |
| `mcp_server/tests/rrf-fusion.vitest.ts` | RRF fusion integration tests |
| `mcp_server/tests/unit-rrf-fusion.vitest.ts` | RRF fusion unit tests |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Calibrated overlap bonus
- Current reality source: shared/algorithms/rrf-fusion.ts module constants and `isCalibratedOverlapBonusEnabled()` implementation
