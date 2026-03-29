---
title: "086 -- BM25 trigger phrase re-index gate"
description: "This scenario validates BM25 trigger phrase re-index gate for `086`. It focuses on confirming trigger edits cause re-index when BM25 is explicitly enabled."
---

# 086 -- BM25 trigger phrase re-index gate

## 1. OVERVIEW

This scenario validates BM25 trigger phrase re-index gate for `086`. It focuses on confirming trigger edits cause re-index when BM25 is explicitly enabled.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `086` and confirm the expected signals without contradicting evidence.

- Objective: Confirm trigger edit causes re-index when BM25 is enabled
- Prompt: `Validate BM25 trigger phrase re-index gate. Capture the evidence needed to prove ENABLE_BM25=true is required for the in-memory BM25 path; trigger phrase edit triggers BM25 re-index when enabled; new trigger is searchable after re-index; old trigger phrase still works if not removed; and FTS5 remains the default lexical engine when BM25 is not enabled. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: `ENABLE_BM25=true` activates the in-memory BM25 path; trigger phrase edit triggers BM25 re-index; new trigger is searchable after re-index; old trigger phrase still works if not removed; FTS5 remains default when BM25 is disabled
- Pass/fail: PASS if editing trigger phrases causes automatic BM25 re-index only when BM25 is explicitly enabled and new triggers are immediately searchable

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 086 | BM25 trigger phrase re-index gate | Confirm trigger edit causes re-index | `Validate BM25 trigger phrase re-index gate. Capture the evidence needed to prove ENABLE_BM25=true is required, trigger phrase edits trigger BM25 re-index when enabled, and FTS5 remains the default lexical engine otherwise. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Start with `ENABLE_BM25=true` and verify `isBm25Enabled()` activates the in-memory BM25 path 2) Edit trigger phrases and confirm the update handler re-index condition still checks title OR trigger phrases when BM25 is enabled 3) Query the new trigger phrase and confirm it becomes searchable without a blocking full rebuild 4) Optionally unset `ENABLE_BM25` and confirm the BM25-specific re-index path stays inactive while FTS5 remains available | `ENABLE_BM25=true` activates the in-memory BM25 path; trigger phrase edit triggers BM25 re-index; new trigger is searchable after re-index; old trigger phrase still works if not removed; FTS5 remains available as the default lexical path when BM25 is off | Re-index activity evidence + search output for new trigger phrase + optional evidence that default lexical retrieval remains FTS5 when BM25 is disabled | PASS if editing trigger phrases causes automatic BM25 re-index only when BM25 is explicitly enabled and new triggers are immediately searchable | Verify the re-index gate detects trigger mutations, confirm BM25 enablement state, inspect `syncChangedRows()` maintenance behavior, and avoid treating FTS5-only lexical updates as BM25 evidence |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/06-bm25-trigger-phrase-re-index-gate.md](../../feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 086
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/086-bm25-trigger-phrase-re-index-gate.md`
