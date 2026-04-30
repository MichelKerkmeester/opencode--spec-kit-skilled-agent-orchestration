---
title: "018 -- Edge density measurement"
description: "This scenario validates Edge density measurement for `018`. It focuses on Confirm edges-per-node thresholding."
audited_post_018: true
---

# 018 -- Edge density measurement

## 1. OVERVIEW

This scenario validates Edge density measurement for `018`. It focuses on Confirm edges-per-node thresholding.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm edges-per-node thresholding.
- Real user request: `Please validate Edge density measurement against the documented validation surface and tell me whether the expected signals are present: Edge density ratio computed correctly (edges/nodes); threshold gate activates/deactivates at boundary.`
- RCAF Prompt: `As a graph-signal validation operator, validate Edge density measurement against the documented validation surface. Verify edge density ratio computed correctly (edges/nodes); threshold gate activates/deactivates at boundary. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Edge density ratio computed correctly (edges/nodes); threshold gate activates/deactivates at boundary
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Ratio = edges/nodes matches manual calculation; gate state correct at boundary; FAIL: Ratio miscalculated or gate ignores threshold

---

## 3. TEST EXECUTION

### Prompt

```
As a graph-signal validation operator, confirm edges-per-node thresholding against the documented validation surface. Verify edge density ratio computed correctly (edges/nodes); threshold gate activates/deactivates at boundary. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Query edge+node counts
2. Compute ratio
3. Check threshold handling

### Expected

Edge density ratio computed correctly (edges/nodes); threshold gate activates/deactivates at boundary

### Evidence

Edge+node counts + computed ratio + threshold gate activation state

### Pass / Fail

- **Pass**: Ratio = edges/nodes matches manual calculation; gate state correct at boundary
- **Fail**: Ratio miscalculated or gate ignores threshold

### Failure Triage

Verify edge/node count queries → Check threshold configuration → Inspect gate activation logic

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [10--graph-signal-activation/03-edge-density-measurement.md](../../feature_catalog/10--graph-signal-activation/03-edge-density-measurement.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 018
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--graph-signal-activation/018-edge-density-measurement.md`
