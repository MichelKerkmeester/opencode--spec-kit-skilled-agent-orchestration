---
title: "033 -- Query complexity router (R15)"
description: "This scenario validates Query complexity router (R15) for `033`. It focuses on Confirm query-class routing."
---

# 033 -- Query complexity router (R15)

## 1. OVERVIEW

This scenario validates Query complexity router (R15) for `033`. It focuses on Confirm query-class routing.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `033` and confirm the expected signals without contradicting evidence.

- Objective: Confirm query-class routing
- Prompt: `Verify query complexity router (R15). Capture the evidence needed to prove Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing
- Pass/fail: PASS: Channel count increases with complexity class; disabled flag uses default routing; FAIL: All queries use same channels or flag-disabled produces error

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 033 | Query complexity router (R15) | Confirm query-class routing | `Verify query complexity router (R15). Capture the evidence needed to prove Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Run simple/moderate/complex 2) Inspect selected channels 3) Disable flag fallback | Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing | Channel selection trace for simple/moderate/complex queries + flag-disabled fallback behavior | PASS: Channel count increases with complexity class; disabled flag uses default routing; FAIL: All queries use same channels or flag-disabled produces error | Verify complexity classification logic → Check channel mapping per class → Inspect feature flag fallback behavior |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [12--query-intelligence/01-query-complexity-router.md](../../feature_catalog/12--query-intelligence/01-query-complexity-router.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 033
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `12--query-intelligence/033-query-complexity-router-r15.md`
