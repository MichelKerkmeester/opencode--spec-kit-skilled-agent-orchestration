---
title: "159 -- Learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER)"
description: "This scenario validates learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER) for `159`. It focuses on enabling the flag and verifying shadow scoring produces comparison output."
audited_post_018: true
---

# 159 -- Learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER)

## 1. OVERVIEW

This scenario validates learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER) for `159`. It focuses on enabling the flag and verifying shadow scoring produces comparison output.

---

## 2. SCENARIO CONTRACT


- Objective: Verify shadow scoring produces learned vs manual comparison output.
- Real user request: `Please validate Learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER) against SPECKIT_LEARNED_STAGE2_COMBINER=true and tell me whether the expected signals are present: shadowScore() returns ShadowResult with learnedScore in [0,1], manualScore matching input, and delta = |learned - manual|; trainRegularizedLinearRanker() produces valid weights; predict() clamps output to [0,1]; flag OFF returns null (no overhead).`
- RCAF Prompt: `As a scoring validation operator, validate Learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER) against SPECKIT_LEARNED_STAGE2_COMBINER=true. Verify shadow scoring produces learned vs manual comparison output. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: shadowScore() returns ShadowResult with learnedScore in [0,1], manualScore matching input, and delta = |learned - manual|; trainRegularizedLinearRanker() produces valid weights; predict() clamps output to [0,1]; flag OFF returns null (no overhead)
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if shadowScore() returns non-null ShadowResult with valid learnedScore, manualScore, and delta when flag ON, and null when flag OFF; FAIL if shadow scoring affects live ranking or produces out-of-range values

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, verify shadow scoring produces comparison output against SPECKIT_LEARNED_STAGE2_COMBINER=true. Verify shadowScore() returns ShadowResult with learnedScore in [0,1], manualScore matching input, delta = abs(learned - manual); null when flag OFF. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `SPECKIT_LEARNED_STAGE2_COMBINER=true`
2. Train model via `trainRegularizedLinearRanker(examples)`
3. Call `shadowScore(model, features, manualScore, true)`
4. Verify ShadowResult shape
5. `npx vitest run tests/learned-combiner.vitest.ts`

### Expected

shadowScore() returns ShadowResult with learnedScore in [0,1], manualScore matching input, delta = abs(learned - manual); null when flag OFF

### Evidence

ShadowResult output + test transcript showing shadow-only behavior

### Pass / Fail

- **Pass**: shadowScore() returns non-null ShadowResult with valid scores when flag ON, null when OFF
- **Fail**: shadow scoring affects live ranking or scores out of range

### Failure Triage

Verify isLearnedStage2CombinerEnabled() → Check model training succeeded (non-null) → Inspect predict() clamping → Verify FEATURE_NAMES order matches extractFeatureVector()

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/19-learned-stage2-weight-combiner.md](../../feature_catalog/11--scoring-and-calibration/19-learned-stage2-weight-combiner.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `shared/ranking/learned-combiner.ts`

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 159
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/159-learned-stage2-combiner-speckit-learned-stage2-combiner.md`
