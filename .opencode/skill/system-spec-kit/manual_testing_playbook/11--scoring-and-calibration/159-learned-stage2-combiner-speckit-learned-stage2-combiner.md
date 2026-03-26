---
title: "159 -- Learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER)"
description: "This scenario validates learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER) for `159`. It focuses on enabling the flag and verifying shadow scoring produces comparison output."
---

# 159 -- Learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER)

## 1. OVERVIEW

This scenario validates learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER) for `159`. It focuses on enabling the flag and verifying shadow scoring produces comparison output.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `159` and confirm the expected signals without contradicting evidence.

- Objective: Verify shadow scoring produces learned vs manual comparison output
- Prompt: `Test SPECKIT_LEARNED_STAGE2_COMBINER=true. Train a model with sample data, run shadowScore() with the learned model and a manual score, and verify the ShadowResult contains learnedScore, manualScore, and delta. Capture the evidence needed to prove the learned combiner produces scores in [0,1] without affecting live ranking. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: shadowScore() returns ShadowResult with learnedScore in [0,1], manualScore matching input, and delta = |learned - manual|; trainRegularizedLinearRanker() produces valid weights; predict() clamps output to [0,1]; flag OFF returns null (no overhead)
- Pass/fail: PASS if shadowScore() returns non-null ShadowResult with valid learnedScore, manualScore, and delta when flag ON, and null when flag OFF; FAIL if shadow scoring affects live ranking or produces out-of-range values

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 159 | Learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER) | Verify shadow scoring produces comparison output | `Test SPECKIT_LEARNED_STAGE2_COMBINER=true. Train a model, run shadowScore(), and verify ShadowResult shape with learnedScore, manualScore, and delta. Capture the evidence needed to prove learned combiner produces [0,1] scores without affecting live ranking. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_LEARNED_STAGE2_COMBINER=true` 2) Train model via `trainRegularizedLinearRanker(examples)` 3) Call `shadowScore(model, features, manualScore, true)` 4) Verify ShadowResult shape 5) `npx vitest run tests/learned-combiner.vitest.ts` | shadowScore() returns ShadowResult with learnedScore in [0,1], manualScore matching input, delta = abs(learned - manual); null when flag OFF | ShadowResult output + test transcript showing shadow-only behavior | PASS if shadowScore() returns non-null ShadowResult with valid scores when flag ON, null when OFF; FAIL if shadow scoring affects live ranking or scores out of range | Verify isLearnedStage2CombinerEnabled() → Check model training succeeded (non-null) → Inspect predict() clamping → Verify FEATURE_NAMES order matches extractFeatureVector() |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [11--scoring-and-calibration/19-learned-stage2-weight-combiner.md](../../feature_catalog/11--scoring-and-calibration/19-learned-stage2-weight-combiner.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `shared/ranking/learned-combiner.ts`

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 159
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/159-learned-stage2-combiner-speckit-learned-stage2-combiner.md`
