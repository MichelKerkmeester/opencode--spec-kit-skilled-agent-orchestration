---
title: "022 -- Community detection (N2c)"
description: "This scenario validates Community detection (N2c) for `022`. It focuses on Confirm community boost injection."
audited_post_018: true
---

# 022 -- Community detection (N2c)

## 1. OVERVIEW

This scenario validates Community detection (N2c) for `022`. It focuses on Confirm community boost injection.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm community boost injection.
- Real user request: `Please validate Community detection (N2c) against the documented validation surface and tell me whether the expected signals are present: Community detection assigns cluster IDs; co-member boost injected; boost capped at configured maximum.`
- RCAF Prompt: `As a graph-signal validation operator, validate Community detection (N2c) against the documented validation surface. Verify community detection assigns cluster IDs; co-member boost injected; boost capped at configured maximum. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Community detection assigns cluster IDs; co-member boost injected; boost capped at configured maximum
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Cluster IDs assigned; co-members receive boost within cap; non-members get zero boost; FAIL: Missing cluster IDs or boost exceeds cap

---

## 3. TEST EXECUTION

### Prompt

```
As a graph-signal validation operator, confirm community boost injection against the documented validation surface. Verify community detection assigns cluster IDs; co-member boost injected; boost capped at configured maximum. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Create communities
2. Recompute
3. Verify co-member injection/caps

### Expected

Community detection assigns cluster IDs; co-member boost injected; boost capped at configured maximum

### Evidence

Community assignment output + co-member boost values + cap verification

### Pass / Fail

- **Pass**: Cluster IDs assigned; co-members receive boost within cap; non-members get zero boost
- **Fail**: Missing cluster IDs or boost exceeds cap

### Failure Triage

Verify community detection algorithm → Check boost injection point in pipeline → Inspect cap enforcement

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [10--graph-signal-activation/07-community-detection.md](../../feature_catalog/10--graph-signal-activation/07-community-detection.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 022
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--graph-signal-activation/022-community-detection-n2c.md`
