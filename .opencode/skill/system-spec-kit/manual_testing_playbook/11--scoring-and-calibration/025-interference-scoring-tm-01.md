---
title: "025 -- Interference scoring (TM-01)"
description: "This scenario validates Interference scoring (TM-01) for `025`. It focuses on Confirm cluster penalty."
audited_post_018: true
---

# 025 -- Interference scoring (TM-01)

## 1. OVERVIEW

This scenario validates Interference scoring (TM-01) for `025`. It focuses on Confirm cluster penalty.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm cluster penalty.
- Real user request: `Please validate Interference scoring (TM-01) against the documented validation surface and tell me whether the expected signals are present: Active near-duplicate cluster receives penalty; penalty reduces effective score; non-duplicates unaffected; inactive or deprecated siblings do not increase the active interference count.`
- RCAF Prompt: `As a scoring validation operator, validate Interference scoring (TM-01) against the documented validation surface. Verify active near-duplicate cluster receives penalty; penalty reduces effective score; non-duplicates unaffected; inactive or deprecated siblings do not increase the active interference count. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Active near-duplicate cluster receives penalty; penalty reduces effective score; non-duplicates unaffected; inactive or deprecated siblings do not increase the active interference count
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Active duplicates are penalized with lower effective score while inactive or deprecated copies stay ignored; FAIL: No penalty is applied, inactive rows still count, or false positive penalties appear

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, confirm cluster penalty against the documented validation surface. Verify active near-duplicate cluster receives penalty; penalty reduces effective score; non-duplicates unaffected; inactive or deprecated siblings do not increase the active interference count. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Save two or more active near-duplicate memories in the same spec folder plus one inactive or deprecated near-duplicate sibling
2. Query the cluster topic
3. Verify the active duplicates receive the penalty while the inactive or deprecated sibling does not inflate the active interference count
4. Compare against a non-duplicate control memory in the same folder

### Expected

Active near-duplicate cluster receives penalty; penalty reduces effective score; non-duplicates unaffected; inactive or deprecated siblings do not increase the active interference count

### Evidence

Query output showing penalized vs unpenalized scores + state/tier verification for the inactive sibling

### Pass / Fail

- **Pass**: Active duplicates are penalized while inactive siblings stay ignored and non-duplicates retain their scores
- **Fail**: No penalty applies, inactive rows still count, or false positives appear

### Failure Triage

Verify similarity threshold, retrievable-row predicates, and penalty formula in `interference-scoring.ts`

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/03-interference-scoring.md](../../feature_catalog/11--scoring-and-calibration/03-interference-scoring.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/025-interference-scoring-tm-01.md`
