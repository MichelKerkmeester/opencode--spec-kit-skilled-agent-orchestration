---
title: "090 -- INT8 quantization evaluation (R5)"
description: "This scenario validates INT8 quantization evaluation (R5) for `090`. It focuses on Confirm no-go decision remains valid."
---

# 090 -- INT8 quantization evaluation (R5)

## 1. OVERVIEW

This scenario validates INT8 quantization evaluation (R5) for `090`. It focuses on Confirm no-go decision remains valid.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `090` and confirm the expected signals without contradicting evidence.

- Objective: Confirm no-go decision remains valid
- Prompt: `Re-evaluate INT8 quantization decision criteria. Capture the evidence needed to prove Quality degradation metrics exceed acceptable threshold; no-go criteria still met; decision rationale documented with current data. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Quality degradation metrics exceed acceptable threshold; no-go criteria still met; decision rationale documented with current data
- Pass/fail: PASS if no-go decision is reaffirmed with current metrics or criteria change warrants re-evaluation with documented rationale

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 090 | INT8 quantization evaluation (R5) | Confirm no-go decision remains valid | `Re-evaluate INT8 quantization decision criteria. Capture the evidence needed to prove Quality degradation metrics exceed acceptable threshold; no-go criteria still met; decision rationale documented with current data. Return a concise user-facing pass/fail verdict with the main reason.` | 1) gather thresholds metrics 2) compare go/no-go criteria 3) record decision | Quality degradation metrics exceed acceptable threshold; no-go criteria still met; decision rationale documented with current data | Threshold metrics summary + go/no-go criteria comparison + documented decision with evidence | PASS if no-go decision is reaffirmed with current metrics or criteria change warrants re-evaluation with documented rationale | Review original no-go rationale; gather updated benchmark data; compare quality degradation thresholds with current acceptable limits |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [09--evaluation-and-measurement/16-int8-quantization-evaluation.md](../../feature_catalog/09--evaluation-and-measurement/16-int8-quantization-evaluation.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 090
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `09--evaluation-and-measurement/090-int8-quantization-evaluation-r5.md`
