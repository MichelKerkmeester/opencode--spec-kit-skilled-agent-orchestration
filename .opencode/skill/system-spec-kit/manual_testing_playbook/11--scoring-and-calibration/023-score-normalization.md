---
title: "023 -- Score normalization"
description: "This scenario validates Score normalization for `023`. It focuses on Confirm batch min-max behavior."
audited_post_018: true
---

# 023 -- Score normalization

## 1. OVERVIEW

This scenario validates Score normalization for `023`. It focuses on Confirm batch min-max behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm batch min-max behavior.
- Real user request: `Please validate Score normalization against the documented validation surface and tell me whether the expected signals are present: Normalized scores in [0,1] range; min-max normalization correct; equal-score and single-result edge cases handled.`
- RCAF Prompt: `As a scoring validation operator, validate Score normalization against the documented validation surface. Verify normalized scores in [0,1] range; min-max normalization correct; equal-score and single-result edge cases handled. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Normalized scores in [0,1] range; min-max normalization correct; equal-score and single-result edge cases handled
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All normalized scores in [0,1]; equal scores produce uniform output; single result = 0.0 (composite min-max with zero range returns 0); FAIL: Out-of-range values or division-by-zero on equal scores

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, confirm batch min-max behavior against the documented validation surface. Verify normalized scores in [0,1] range; min-max normalization correct; equal-score and single-result edge cases handled. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run varied-score query
2. Inspect normalized range
3. Check equal/single cases

### Expected

Normalized scores in [0,1] range; min-max normalization correct; equal-score and single-result edge cases handled

### Evidence

Normalized output with range verification + edge case test results

### Pass / Fail

- **Pass**: All normalized scores in [0,1]; equal scores produce uniform output; single result = 1.0
- **Fail**: Out-of-range values or division-by-zero on equal scores

### Failure Triage

Verify min-max formula → Check edge case guards (single result, all-equal) → Inspect batch processing order

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/01-score-normalization.md](../../feature_catalog/11--scoring-and-calibration/01-score-normalization.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/023-score-normalization.md`
