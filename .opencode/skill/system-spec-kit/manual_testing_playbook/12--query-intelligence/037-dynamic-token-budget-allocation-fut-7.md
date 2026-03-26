---
title: "037 -- Dynamic token budget allocation (FUT-7)"
description: "This scenario validates Dynamic token budget allocation (FUT-7) for `037`. It focuses on Confirm complexity-tier budgets."
---

# 037 -- Dynamic token budget allocation (FUT-7)

## 1. OVERVIEW

This scenario validates Dynamic token budget allocation (FUT-7) for `037`. It focuses on Confirm complexity-tier budgets.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `037` and confirm the expected signals without contradicting evidence.

- Objective: Confirm complexity-tier budgets
- Prompt: `Verify dynamic token budgets (FUT-7). Capture the evidence needed to prove Token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget
- Pass/fail: PASS: Budget proportional to complexity tier; disabled flag uses default; total budget within system limits; FAIL: All tiers get same budget or flag-disabled produces error

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 037 | Dynamic token budget allocation (FUT-7) | Confirm complexity-tier budgets | `Verify dynamic token budgets (FUT-7). Capture the evidence needed to prove Token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Run classed queries 2) Inspect budgets 3) Disable flag fallback | Token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget | Budget allocation per complexity tier + default fallback budget verification | PASS: Budget proportional to complexity tier; disabled flag uses default; total budget within system limits; FAIL: All tiers get same budget or flag-disabled produces error | Verify budget allocation formula → Check complexity tier detection → Inspect system budget limits |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [12--query-intelligence/05-dynamic-token-budget-allocation.md](../../feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 037
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `12--query-intelligence/037-dynamic-token-budget-allocation-fut-7.md`
