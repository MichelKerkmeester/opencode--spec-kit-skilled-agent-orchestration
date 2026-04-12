---
title: "020 -- Graph momentum scoring (N2a)"
description: "This scenario validates Graph momentum scoring (N2a) for `020`. It focuses on Confirm 7-day delta bonus."
audited_post_018: true
---

# 020 -- Graph momentum scoring (N2a)

## 1. OVERVIEW

This scenario validates Graph momentum scoring (N2a) for `020`. It focuses on Confirm 7-day delta bonus.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `020` and confirm the expected signals without contradicting evidence.

- Objective: Confirm 7-day delta bonus
- Prompt: `As a graph-signal validation operator, validate Graph momentum scoring (N2a) against the documented validation surface. Verify 7-day momentum delta bonus applied and capped; nodes with no history get zero bonus; cap enforced. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: 7-day momentum delta bonus applied and capped; nodes with no history get zero bonus; cap enforced
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

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/05-graph-momentum-scoring.md](../../feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 020
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/020-graph-momentum-scoring-n2a.md`
