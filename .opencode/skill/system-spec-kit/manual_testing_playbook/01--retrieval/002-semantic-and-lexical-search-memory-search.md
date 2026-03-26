---
title: "EX-002 -- Semantic and lexical search (memory_search)"
description: "This scenario validates Semantic and lexical search (memory_search) for `EX-002`. It focuses on Hybrid precision check."
---

# EX-002 -- Semantic and lexical search (memory_search)

## 1. OVERVIEW

This scenario validates Semantic and lexical search (memory_search) for `EX-002`. It focuses on Hybrid precision check.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `EX-002` and confirm the expected signals without contradicting evidence.

- Objective: Hybrid precision check
- Prompt: `Search for checkpoint restore clearExisting transaction rollback. Capture the evidence needed to prove Relevant ranked results with hybrid signals. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Relevant ranked results with hybrid signals
- Pass/fail: PASS if top results match query intent

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EX-002 | Semantic and lexical search (memory_search) | Hybrid precision check | `Search for checkpoint restore clearExisting transaction rollback. Capture the evidence needed to prove Relevant ranked results with hybrid signals. Return a concise user-facing pass/fail verdict with the main reason.` | `memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20 })` -> `memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20, bypassCache:true })` | Relevant ranked results with hybrid signals | Search output snapshot | PASS if top results match query intent | Lower minState; disable cache and retry |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/02-semantic-and-lexical-search-memorysearch.md](../../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: EX-002
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/002-semantic-and-lexical-search-memory-search.md`
