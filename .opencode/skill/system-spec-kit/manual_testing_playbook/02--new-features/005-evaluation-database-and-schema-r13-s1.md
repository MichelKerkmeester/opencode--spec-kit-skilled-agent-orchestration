---
title: "NEW-005 -- Evaluation database and schema (R13-S1)"
description: "This scenario validates Evaluation database and schema (R13-S1) for `NEW-005`. It focuses on Confirm eval data isolation."
---

# NEW-005 -- Evaluation database and schema (R13-S1)

## 1. OVERVIEW

This scenario validates Evaluation database and schema (R13-S1) for `NEW-005`. It focuses on Confirm eval data isolation.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `NEW-005` and confirm the expected signals without contradicting evidence.

- Objective: Confirm eval data isolation
- Prompt: `Verify evaluation DB/schema writes.`
- Expected signals: Eval tables created in separate DB/schema; retrieval events logged without affecting main memory DB
- Pass/fail: PASS: Eval data isolated in dedicated tables; main DB unaffected; FAIL: Eval writes pollute main memory tables

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NEW-005 | Evaluation database and schema (R13-S1) | Confirm eval data isolation | `Verify evaluation DB/schema writes.` | 1) Trigger retrieval events 2) Query eval DB tables 3) Confirm isolation | Eval tables created in separate DB/schema; retrieval events logged without affecting main memory DB | Eval DB schema dump + retrieval event rows + main DB integrity check | PASS: Eval data isolated in dedicated tables; main DB unaffected; FAIL: Eval writes pollute main memory tables | Check eval DB path configuration → Verify schema migration ran → Inspect table isolation boundaries |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [09--evaluation-and-measurement/01-evaluation-database-and-schema.md](../../feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md)

---

## 5. SOURCE METADATA

- Group: New Features
- Playbook ID: NEW-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--new-features/005-evaluation-database-and-schema-r13-s1.md`
