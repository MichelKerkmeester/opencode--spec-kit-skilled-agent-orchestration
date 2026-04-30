---
title: "066 -- Scoring and ranking corrections"
description: "This scenario validates Scoring and ranking corrections for `066`. It focuses on Confirm Sprint 8 scoring fixes."
audited_post_018: true
---

# 066 -- Scoring and ranking corrections

## 1. OVERVIEW

This scenario validates Scoring and ranking corrections for `066`. It focuses on Confirm Sprint 8 scoring fixes.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm Sprint 8 scoring fixes.
- Real user request: `Please validate Scoring and ranking corrections against the documented validation surface and tell me whether the expected signals are present: Score values fall within expected ranges; ranking order matches relevance; no score inversions or NaN values.`
- RCAF Prompt: `As a scoring validation operator, validate Scoring and ranking corrections against the documented validation surface. Verify score values fall within expected ranges; ranking order matches relevance; no score inversions or NaN values. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Score values fall within expected ranges; ranking order matches relevance; no score inversions or NaN values
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if scoring corrections produce expected rank ordering and no anomalous score values

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, confirm Sprint 8 scoring fixes against the documented validation surface. Verify score values fall within expected ranges; ranking order matches relevance; no score inversions or NaN values. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. run targeted queries
2. inspect score/rank outputs
3. verify corrected behavior

### Expected

Score values fall within expected ranges; ranking order matches relevance; no score inversions or NaN values

### Evidence

Query output with score/rank values + before/after comparison where applicable

### Pass / Fail

- **Pass**: scoring corrections produce expected rank ordering and no anomalous score values
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect scoring formula changes; verify normalization bounds; check for edge-case inputs that produce NaN

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [11--scoring-and-calibration/11-scoring-and-ranking-corrections.md](../../feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md)

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 066
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `11--scoring-and-calibration/066-scoring-and-ranking-corrections.md`
