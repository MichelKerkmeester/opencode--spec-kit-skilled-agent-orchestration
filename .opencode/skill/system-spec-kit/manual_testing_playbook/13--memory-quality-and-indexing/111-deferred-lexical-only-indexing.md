---
title: "111 -- Deferred lexical-only indexing"
description: "This scenario validates Deferred lexical-only indexing for `111`. It focuses on Confirm embedding-failure fallback and BM25 searchability."
---

# 111 -- Deferred lexical-only indexing

## 1. OVERVIEW

This scenario validates Deferred lexical-only indexing for `111`. It focuses on Confirm embedding-failure fallback and BM25 searchability.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `111` and confirm the expected signals without contradicting evidence.

- Objective: Confirm embedding-failure fallback and BM25 searchability
- Prompt: `Validate deferred lexical-only indexing fallback. Capture the evidence needed to prove Memory saved with embedding_status='pending' on embedding failure; BM25/FTS5 lexical search returns the memory; reindex transitions status to 'success'; vector search works after reindex. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Memory saved with embedding_status='pending' on embedding failure; BM25/FTS5 lexical search returns the memory; reindex transitions status to 'success'; vector search works after reindex
- Pass/fail: PASS if embedding failure falls back to lexical-only indexing, BM25 search works, and reindex recovers full embedding

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 111 | Deferred lexical-only indexing | Confirm embedding-failure fallback and BM25 searchability | `Validate deferred lexical-only indexing fallback. Capture the evidence needed to prove Memory saved with embedding_status='pending' on embedding failure; BM25/FTS5 lexical search returns the memory; reindex transitions status to 'success'; vector search works after reindex. Return a concise user-facing pass/fail verdict with the main reason.` | 1) simulate embedding failure (e.g., set invalid `OPENAI_API_KEY`) 2) `memory_save(filePath)` → verify memory saved with `embedding_status='pending'` 3) `memory_search({query:"<title of saved memory>"})` → verify BM25/FTS5 retrieval works (lexical match) 4) restore valid API key 5) run `node cli.js reindex` → verify `embedding_status` transitions to `'success'` and `retry_count` increments 6) `memory_search({query:"<semantic query>"})` → verify vector search now works | Memory saved with embedding_status='pending' on embedding failure; BM25/FTS5 lexical search returns the memory; reindex transitions status to 'success'; vector search works after reindex | Save output showing pending status + lexical search result + reindex output + post-reindex semantic search result | PASS if embedding failure falls back to lexical-only indexing, BM25 search works, and reindex recovers full embedding | Verify embedding_status column exists in schema; check BM25/FTS5 index includes pending memories; inspect reindex retry logic and retry_count tracking |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md](../../feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 111
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/111-deferred-lexical-only-indexing.md`
