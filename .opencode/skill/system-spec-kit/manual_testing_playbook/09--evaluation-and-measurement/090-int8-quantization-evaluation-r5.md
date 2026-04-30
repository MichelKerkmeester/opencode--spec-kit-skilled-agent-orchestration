---
title: "090 -- INT8 quantization evaluation (R5)"
description: "This scenario validates INT8 quantization evaluation (R5) for `090`. It focuses on Confirm no-go decision remains valid."
---

# 090 -- INT8 quantization evaluation (R5)

## 1. OVERVIEW

This scenario validates INT8 quantization evaluation (R5) for `090`. It focuses on Confirm no-go decision remains valid.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm no-go decision remains valid.
- Real user request: `Please validate INT8 quantization evaluation (R5) against the documented validation surface and tell me whether the expected signals are present: Quality degradation metrics exceed acceptable threshold; no-go criteria still met; decision rationale documented with current data.`
- RCAF Prompt: `As an evaluation validation operator, validate INT8 quantization evaluation (R5) against the documented validation surface. Verify quality degradation metrics exceed acceptable threshold; no-go criteria still met; decision rationale documented with current data. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Quality degradation metrics exceed acceptable threshold; no-go criteria still met; decision rationale documented with current data
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if no-go decision is reaffirmed with current metrics or criteria change warrants re-evaluation with documented rationale

---

## 3. TEST EXECUTION

### Prompt

```
As an evaluation validation operator, confirm no-go decision remains valid against the documented validation surface. Verify quality degradation metrics exceed acceptable threshold; no-go criteria still met; decision rationale documented with current data. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. gather thresholds metrics
2. compare go/no-go criteria
3. record decision

### Expected

Quality degradation metrics exceed acceptable threshold; no-go criteria still met; decision rationale documented with current data

### Evidence

Threshold metrics summary + go/no-go criteria comparison + documented decision with evidence

### Pass / Fail

- **Pass**: no-go decision is reaffirmed with current metrics or criteria change warrants re-evaluation with documented rationale
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Review original no-go rationale; gather updated benchmark data; compare quality degradation thresholds with current acceptable limits

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/16-int8-quantization-evaluation.md](../../feature_catalog/09--evaluation-and-measurement/16-int8-quantization-evaluation.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 090
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--evaluation-and-measurement/090-int8-quantization-evaluation-r5.md`
- audited_post_018: true
