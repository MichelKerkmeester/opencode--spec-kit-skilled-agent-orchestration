---
title: "037 -- Dynamic token budget allocation (FUT-7)"
description: "This scenario validates Dynamic token budget allocation (FUT-7) for `037`. It focuses on Confirm complexity-tier budgets."
audited_post_018: true
---

# 037 -- Dynamic token budget allocation (FUT-7)

## 1. OVERVIEW

This scenario validates Dynamic token budget allocation (FUT-7) for `037`. It focuses on Confirm complexity-tier budgets.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `037` and confirm the expected signals without contradicting evidence.

- Objective: Confirm complexity-tier budgets
- Prompt: `As a query-intelligence validation operator, validate Dynamic token budget allocation (FUT-7) against the documented validation surface. Verify token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget
- Pass/fail: PASS: Budget proportional to complexity tier; disabled flag uses default; total budget within system limits; FAIL: All tiers get same budget or flag-disabled produces error

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, confirm complexity-tier budgets against the documented validation surface. Verify token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run classed queries
2. Inspect budgets
3. Disable flag fallback

### Expected

Token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget

### Evidence

Budget allocation per complexity tier + default fallback budget verification

### Pass / Fail

- **Pass**: Budget proportional to complexity tier; disabled flag uses default; total budget within system limits
- **Fail**: All tiers get same budget or flag-disabled produces error

### Failure Triage

Verify budget allocation formula → Check complexity tier detection → Inspect system budget limits

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [12--query-intelligence/05-dynamic-token-budget-allocation.md](../../feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 037
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `12--query-intelligence/037-dynamic-token-budget-allocation-fut-7.md`
