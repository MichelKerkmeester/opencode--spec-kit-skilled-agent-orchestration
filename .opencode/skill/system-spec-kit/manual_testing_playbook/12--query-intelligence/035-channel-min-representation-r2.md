---
title: "035 -- Channel min-representation (R2)"
description: "This scenario validates Channel min-representation (R2) for `035`. It focuses on Confirm top-k channel diversity rule."
audited_post_018: true
---

# 035 -- Channel min-representation (R2)

## 1. OVERVIEW

This scenario validates Channel min-representation (R2) for `035`. It focuses on Confirm top-k channel diversity rule.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm top-k channel diversity rule.
- Real user request: `Please validate Channel min-representation (R2) against the documented validation surface and tell me whether the expected signals are present: Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection.`
- RCAF Prompt: `As a query-intelligence validation operator, validate Channel min-representation (R2) against the documented validation surface. Verify each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All active channels have >=1 representative in top-k; quality floor prevents sub-threshold entries; FAIL: Channel missing from top-k or sub-threshold results injected

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, confirm top-k channel diversity rule against the documented validation surface. Verify each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run dominance query
2. Inspect pre/post representation
3. Verify quality floor

### Expected

Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection

### Evidence

Pre/post representation counts per channel + quality floor threshold verification

### Pass / Fail

- **Pass**: All active channels have >=1 representative in top-k; quality floor prevents sub-threshold entries
- **Fail**: Channel missing from top-k or sub-threshold results injected

### Failure Triage

Verify min-representation algorithm → Check quality floor threshold → Inspect channel priority ordering

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [12--query-intelligence/03-channel-min-representation.md](../../feature_catalog/12--query-intelligence/03-channel-min-representation.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 035
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `12--query-intelligence/035-channel-min-representation-r2.md`
