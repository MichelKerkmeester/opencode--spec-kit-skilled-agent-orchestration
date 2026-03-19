---
title: "NEW-017 -- Co-activation boost strength increase (A7)"
description: "This scenario validates Co-activation boost strength increase (A7) for `NEW-017`. It focuses on Confirm multiplier impact."
---

# NEW-017 -- Co-activation boost strength increase (A7)

## 1. OVERVIEW

This scenario validates Co-activation boost strength increase (A7) for `NEW-017`. It focuses on Confirm multiplier impact.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-017` and confirm the expected signals without contradicting evidence.

- Objective: Confirm multiplier impact
- Prompt: `Compare co-activation strength values for A7. Capture the evidence needed to prove Increased co-activation strength produces measurably higher contribution delta vs baseline. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Increased co-activation strength produces measurably higher contribution delta vs baseline
- Pass/fail: PASS: Contribution delta >0 when strength increased; proportional to multiplier change; FAIL: No measurable difference or inverse effect

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-017 | Co-activation boost strength increase (A7) | Confirm multiplier impact | `Compare co-activation strength values for A7. Capture the evidence needed to prove Increased co-activation strength produces measurably higher contribution delta vs baseline. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Baseline run 2) Increase strength 3) Compare contribution | Increased co-activation strength produces measurably higher contribution delta vs baseline | Baseline vs increased strength output comparison + contribution delta calculation | PASS: Contribution delta >0 when strength increased; proportional to multiplier change; FAIL: No measurable difference or inverse effect | Verify strength parameter propagation → Check co-activation formula → Inspect baseline measurement accuracy |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [10--graph-signal-activation/02-co-activation-boost-strength-increase.md](../../feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: NEW-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--graph-signal-activation/017-co-activation-boost-strength-increase-a7.md`
