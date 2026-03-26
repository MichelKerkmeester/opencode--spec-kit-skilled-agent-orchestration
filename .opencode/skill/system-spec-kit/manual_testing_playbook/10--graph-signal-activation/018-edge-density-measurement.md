---
title: "018 -- Edge density measurement"
description: "This scenario validates Edge density measurement for `018`. It focuses on Confirm edges-per-node thresholding."
---

# 018 -- Edge density measurement

## 1. OVERVIEW

This scenario validates Edge density measurement for `018`. It focuses on Confirm edges-per-node thresholding.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `018` and confirm the expected signals without contradicting evidence.

- Objective: Confirm edges-per-node thresholding
- Prompt: `Verify edge density measurement and gate behavior. Capture the evidence needed to prove Edge density ratio computed correctly (edges/nodes); threshold gate activates/deactivates at boundary. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Edge density ratio computed correctly (edges/nodes); threshold gate activates/deactivates at boundary
- Pass/fail: PASS: Ratio = edges/nodes matches manual calculation; gate state correct at boundary; FAIL: Ratio miscalculated or gate ignores threshold

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 018 | Edge density measurement | Confirm edges-per-node thresholding | `Verify edge density measurement and gate behavior. Capture the evidence needed to prove Edge density ratio computed correctly (edges/nodes); threshold gate activates/deactivates at boundary. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Query edge+node counts 2) Compute ratio 3) Check threshold handling | Edge density ratio computed correctly (edges/nodes); threshold gate activates/deactivates at boundary | Edge+node counts + computed ratio + threshold gate activation state | PASS: Ratio = edges/nodes matches manual calculation; gate state correct at boundary; FAIL: Ratio miscalculated or gate ignores threshold | Verify edge/node count queries → Check threshold configuration → Inspect gate activation logic |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/03-edge-density-measurement.md](../../feature_catalog/10--graph-signal-activation/03-edge-density-measurement.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 018
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/018-edge-density-measurement.md`
