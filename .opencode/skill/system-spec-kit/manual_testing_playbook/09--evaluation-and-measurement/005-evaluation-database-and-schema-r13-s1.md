---
title: "005 -- Evaluation database and schema (R13-S1)"
description: "This scenario validates Evaluation database and schema (R13-S1) for `005`. It focuses on Confirm eval data isolation."
---

# 005 -- Evaluation database and schema (R13-S1)

## 1. OVERVIEW

This scenario validates Evaluation database and schema (R13-S1) for `005`. It focuses on Confirm eval data isolation.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `005` and confirm the expected signals without contradicting evidence.

- Objective: Confirm eval data isolation
- Prompt: `As an evaluation validation operator, validate Evaluation database and schema (R13-S1) against the documented validation surface. Verify eval tables created in separate DB/schema; retrieval events logged without affecting main memory DB. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Eval tables created in separate DB/schema; retrieval events logged without affecting main memory DB
- Pass/fail: PASS: Eval data isolated in dedicated tables; main DB unaffected; FAIL: Eval writes pollute main memory tables

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 005 | Evaluation database and schema (R13-S1) | Confirm eval data isolation | `As an evaluation validation operator, confirm eval data isolation against the documented validation surface. Verify eval tables created in separate DB/schema; retrieval events logged without affecting main memory DB. Return a concise pass/fail verdict with the main reason and cited evidence.` | 1) Trigger retrieval events 2) Query eval DB tables 3) Confirm isolation | Eval tables created in separate DB/schema; retrieval events logged without affecting main memory DB | Eval DB schema dump + retrieval event rows + main DB integrity check | PASS: Eval data isolated in dedicated tables; main DB unaffected; FAIL: Eval writes pollute main memory tables | Check eval DB path configuration → Verify schema migration ran → Inspect table isolation boundaries |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [09--evaluation-and-measurement/01-evaluation-database-and-schema.md](../../feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md)

---

## 5. SOURCE METADATA

- Group: Evaluation and Measurement
- Playbook ID: 005
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `09--evaluation-and-measurement/005-evaluation-database-and-schema-r13-s1.md`
- audited_post_018: true
