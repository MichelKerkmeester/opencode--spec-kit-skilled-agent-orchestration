---
title: "020 -- Graph momentum scoring (N2a)"
description: "This scenario validates Graph momentum scoring (N2a) for `020`. It focuses on Confirm 7-day delta bonus."
---

# 020 -- Graph momentum scoring (N2a)

## 1. OVERVIEW

This scenario validates Graph momentum scoring (N2a) for `020`. It focuses on Confirm 7-day delta bonus.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `020` and confirm the expected signals without contradicting evidence.

- Objective: Confirm 7-day delta bonus
- Prompt: `Verify graph momentum scoring (N2a). Capture the evidence needed to prove 7-day momentum delta bonus applied and capped; nodes with no history get zero bonus; cap enforced. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: 7-day momentum delta bonus applied and capped; nodes with no history get zero bonus; cap enforced
- Pass/fail: PASS: Momentum bonus = capped(current - 7d_ago); zero for no-history nodes; cap enforced; FAIL: Uncapped bonus or non-zero for missing history

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 020 | Graph momentum scoring (N2a) | Confirm 7-day delta bonus | `Verify graph momentum scoring (N2a). Capture the evidence needed to prove 7-day momentum delta bonus applied and capped; nodes with no history get zero bonus; cap enforced. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Seed snapshots now/7d 2) Query 3) Verify capped bonus | 7-day momentum delta bonus applied and capped; nodes with no history get zero bonus; cap enforced | Momentum scoring output with delta values + cap verification + zero-history node check | PASS: Momentum bonus = capped(current - 7d_ago); zero for no-history nodes; cap enforced; FAIL: Uncapped bonus or non-zero for missing history | Verify snapshot comparison window → Check cap configuration → Inspect delta computation formula |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/05-graph-momentum-scoring.md](../../feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md)

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 020
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/020-graph-momentum-scoring-n2a.md`
