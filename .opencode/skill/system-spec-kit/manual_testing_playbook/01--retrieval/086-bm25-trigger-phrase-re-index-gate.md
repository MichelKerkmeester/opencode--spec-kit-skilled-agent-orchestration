---
title: "086 -- BM25 trigger phrase re-index gate"
description: "This scenario validates BM25 trigger phrase re-index gate for `086`. It focuses on Confirm trigger edit causes re-index."
---

# 086 -- BM25 trigger phrase re-index gate

## 1. OVERVIEW

This scenario validates BM25 trigger phrase re-index gate for `086`. It focuses on Confirm trigger edit causes re-index.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `086` and confirm the expected signals without contradicting evidence.

- Objective: Confirm trigger edit causes re-index
- Prompt: `Validate BM25 trigger phrase re-index gate. Capture the evidence needed to prove Trigger phrase edit triggers BM25 re-index; new trigger is searchable after re-index; old trigger phrase still works if not removed. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Trigger phrase edit triggers BM25 re-index; new trigger is searchable after re-index; old trigger phrase still works if not removed
- Pass/fail: PASS if editing trigger phrases causes automatic BM25 re-index and new triggers are immediately searchable

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 086 | BM25 trigger phrase re-index gate | Confirm trigger edit causes re-index | `Validate BM25 trigger phrase re-index gate. Capture the evidence needed to prove Trigger phrase edit triggers BM25 re-index; new trigger is searchable after re-index; old trigger phrase still works if not removed. Return a concise user-facing pass/fail verdict with the main reason.` | 1) edit trigger phrases 2) verify re-index activity 3) query new trigger | Trigger phrase edit triggers BM25 re-index; new trigger is searchable after re-index; old trigger phrase still works if not removed | Re-index activity log + search output for new trigger phrase + search output for old trigger | PASS if editing trigger phrases causes automatic BM25 re-index and new triggers are immediately searchable | Verify re-index gate detects trigger mutations; check FTS5 rebuild logic; inspect trigger phrase storage format |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [01--retrieval/06-bm25-trigger-phrase-re-index-gate.md](../../feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 086
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--retrieval/086-bm25-trigger-phrase-re-index-gate.md`
