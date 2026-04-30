---
title: "006 -- Core metric computation (R13-S1)"
description: "This scenario validates Core metric computation (R13-S1) for `006`. It focuses on Confirm metric battery outputs."
---

# 006 -- Core metric computation (R13-S1)

## 1. OVERVIEW

This scenario validates Core metric computation (R13-S1) for `006`. It focuses on Confirm metric battery outputs.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm metric battery outputs.
- Real user request: `Please validate Core metric computation (R13-S1) against the documented validation surface and tell me whether the expected signals are present: Metric battery returns precision, recall, MRR, NDCG values; all within valid ranges.`
- RCAF Prompt: `As an evaluation validation operator, validate Core metric computation (R13-S1) against the documented validation surface. Verify metric battery returns precision, recall, MRR, NDCG values; all within valid ranges. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Metric battery returns precision, recall, MRR, NDCG values; all within valid ranges
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All core metrics computed with values in [0,1] range; FAIL: Missing metrics or out-of-range values

---

## 3. TEST EXECUTION

### Prompt

```
As an evaluation validation operator, confirm metric battery outputs against the documented validation surface. Verify metric battery returns precision, recall, MRR, NDCG values; all within valid ranges. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Seed ground truth
2. Run eval metrics
3. Verify metric set

### Expected

Metric battery returns precision, recall, MRR, NDCG values; all within valid ranges

### Evidence

Eval metric output with ground truth comparison + per-metric values

### Pass / Fail

- **Pass**: All core metrics computed with values in [0,1] range
- **Fail**: Missing metrics or out-of-range values

### Failure Triage

Verify ground truth corpus is seeded → Check metric computation functions → Inspect edge cases (empty results, single result)

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/02-core-metric-computation.md](../../feature_catalog/09--evaluation-and-measurement/02-core-metric-computation.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--evaluation-and-measurement/006-core-metric-computation-r13-s1.md`
- audited_post_018: true
