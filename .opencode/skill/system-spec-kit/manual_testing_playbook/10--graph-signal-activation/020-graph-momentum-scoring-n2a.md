---
title: "020 -- Graph momentum scoring (N2a)"
description: "This scenario validates Graph momentum scoring (N2a) for `020`. It focuses on Confirm 7-day delta bonus."
audited_post_018: true
---

# 020 -- Graph momentum scoring (N2a)

## 1. OVERVIEW

This scenario validates Graph momentum scoring (N2a) for `020`. It focuses on Confirm 7-day delta bonus.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm 7-day delta bonus.
- Real user request: `Please validate Graph momentum scoring (N2a) against the documented validation surface and tell me whether the expected signals are present: 7-day momentum delta bonus applied and capped; nodes with no history get zero bonus; cap enforced.`
- RCAF Prompt: `As a graph-signal validation operator, validate Graph momentum scoring (N2a) against the documented validation surface. Verify 7-day momentum delta bonus applied and capped; nodes with no history get zero bonus; cap enforced. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: 7-day momentum delta bonus applied and capped; nodes with no history get zero bonus; cap enforced
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Momentum bonus = capped(current - 7d_ago); zero for no-history nodes; cap enforced; FAIL: Uncapped bonus or non-zero for missing history

---

## 3. TEST EXECUTION

### Prompt

```
As a graph-signal validation operator, confirm 7-day delta bonus against the documented validation surface. Verify 7-day momentum delta bonus applied and capped; nodes with no history get zero bonus; cap enforced. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Seed snapshots now/7d
2. Query
3. Verify capped bonus

### Expected

7-day momentum delta bonus applied and capped; nodes with no history get zero bonus; cap enforced

### Evidence

Momentum scoring output with delta values + cap verification + zero-history node check

### Pass / Fail

- **Pass**: Momentum bonus = capped(current - 7d_ago); zero for no-history nodes; cap enforced
- **Fail**: Uncapped bonus or non-zero for missing history

### Failure Triage

Verify snapshot comparison window → Check cap configuration → Inspect delta computation formula

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [10--graph-signal-activation/05-graph-momentum-scoring.md](../../feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--graph-signal-activation/020-graph-momentum-scoring-n2a.md`
