---
title: "Learned Stage 2 weight combiner"
description: "A regularized linear ranker that learns combination weights from accumulated Stage 2 signals, running in shadow-only mode behind the SPECKIT_LEARNED_STAGE2_COMBINER flag."
---

# Learned Stage 2 weight combiner

## 1. OVERVIEW

A regularized linear ranker that learns combination weights from accumulated Stage 2 signals, running in shadow-only mode behind the `SPECKIT_LEARNED_STAGE2_COMBINER` flag.

The search pipeline combines scores from eight different sources (semantic, keyword overlap, graph signals, session context, causal boost, feedback, validation quality, and artifact routing). Currently these weights are set manually. This feature trains a linear model on actual usage data to find the optimal combination. It runs in shadow mode only — computing what would have happened with learned weights but never changing the real rankings. This lets operators validate the learned approach before committing to it.

---

## 2. CURRENT REALITY

The learned combiner uses Ridge Regression with an inline matrix math implementation (no external ML dependencies). The 8-feature canonical vector covers: `rrf`, `overlap`, `graph`, `session`, `causal`, `feedback`, `validation`, `artifact`. Each feature is clamped to [0, 1] via `extractFeatureVector()`.

Training uses the closed-form solution `w = (X^T X + lambda * I)^{-1} X^T y` with default regularization `DEFAULT_LAMBDA = 0.1`. The bias term is not regularized. Training requires at least 2 examples. The model includes R-squared on training data and is versioned (`MODEL_VERSION = 1`) for forward compatibility.

Validation uses Leave-One-Out Cross-Validation (`runLOOCV()`), and feature importance is computed via SHAP-style analysis (`computeSHAP()`): `importance_i = |weight_i| * std(feature_i)`. Exact linear SHAP values are also available via `computeExactLinearSHAP()`.

Shadow scoring via `shadowScore()` returns both the learned and manual scores when the flag is ON, or `null` with zero overhead when OFF. Model persistence uses `saveModel()` / `loadModel()` with JSON serialization and strict field validation.

Enabled by default (graduated). Set `SPECKIT_LEARNED_STAGE2_COMBINER=false` to disable.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `shared/ranking/learned-combiner.ts` | Shared | Ridge regression training, prediction, LOOCV, SHAP, shadow scoring, model persistence |
| `shared/index.ts` | Shared barrel | Exports `shadowScore`, `trainRegularizedLinearRanker`, `predict`, `extractFeatureVector` |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Pipeline | Calls `shadowScore()` after step 6 (feedback signals), gated by `isLearnedStage2CombinerEnabled()` |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isLearnedStage2CombinerEnabled()` flag accessor |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/learned-combiner.vitest.ts` | Training, prediction, LOOCV, SHAP, shadow scoring, model serialization, flag behavior |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Learned Stage 2 weight combiner
- Current reality source: shared/ranking/learned-combiner.ts module header and implementation
