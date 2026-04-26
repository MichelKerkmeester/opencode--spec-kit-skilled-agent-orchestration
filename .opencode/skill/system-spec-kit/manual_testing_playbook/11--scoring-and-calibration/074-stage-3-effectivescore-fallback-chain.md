---
title: "074 -- Stage 3 effectiveScore fallback chain"
description: "This scenario validates Stage 3 effectiveScore fallback chain for `074`. It focuses on Confirm fallback order correctness."
audited_post_018: true
---

# 074 -- Stage 3 effectiveScore fallback chain

## 1. OVERVIEW

This scenario validates Stage 3 effectiveScore fallback chain for `074`. It focuses on Confirm fallback order correctness.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `074` and confirm the expected signals without contradicting evidence.

- Objective: Confirm fallback order correctness
- Prompt: `As a scoring validation operator, validate Stage 3 effectiveScore fallback chain against the documented validation surface. Verify fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score
- Pass/fail: PASS if fallback chain follows correct priority order and produces valid scores for all missing-field combinations

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, confirm fallback order correctness against the documented validation surface. Verify fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. craft rows missing score fields
2. run stage 3
3. verify fallback order

### Expected

Fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score

### Evidence

Stage 3 output with score field trace showing fallback path taken for each test row

### Pass / Fail

- **Pass**: fallback chain follows correct priority order and produces valid scores for all missing-field combinations
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect resolveEffectiveScore implementation; verify fallback priority constants; test all combinations of missing fields

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md](../../feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 074
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/074-stage-3-effectivescore-fallback-chain.md`
