---
title: "204 -- Embedding retry orchestrator"
description: "This scenario validates Embedding retry orchestrator for `204`. It focuses on verifying lexical-only fallback, pending retry state, cache-aware background retries, and successful vector refresh after provider recovery."
---

# 204 -- Embedding retry orchestrator

## 1. OVERVIEW

This scenario validates Embedding retry orchestrator for `204`. It focuses on verifying lexical-only fallback, pending retry state, cache-aware background retries, and successful vector refresh after provider recovery.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `204` and confirm the expected signals without contradicting evidence.

- Objective: Verify failed embeddings fall back to pending lexical-only storage and are later repaired by the background retry manager with retry/backoff tracking
- Prompt: "Validate the embedding retry orchestrator. Capture the evidence needed to prove a save or index operation can persist a memory with `embedding_status='pending'` when the provider is unavailable; the retry manager later picks up pending items in batch; cache dedup avoids redundant embedding calls where possible; retry counts/backoff state advance on repeated failures; and a successful retry refreshes the stored vector/index state. Return a concise user-facing pass/fail verdict with the main reason."
- Expected signals: Provider outage yields saved memory with pending embedding status and lexical-only fallback; retry manager scans and processes pending items; embedding cache participates in deduplication; retry count/progressive backoff state changes across failures; successful retry updates memory index and vector storage
- Pass/fail: PASS if pending memories remain searchable lexically during outage and are later upgraded with vectors by retry orchestration; FAIL if failed embeddings are dropped, pending items are never retried, or success does not refresh index/vector state

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 204 | Embedding retry orchestrator | Verify failed embeddings fall back to pending lexical-only storage and are later repaired by the background retry manager with retry/backoff tracking | "Validate the embedding retry orchestrator. Capture the evidence needed to prove a save or index operation can persist a memory with `embedding_status='pending'` when the provider is unavailable; the retry manager later picks up pending items in batch; cache dedup avoids redundant embedding calls where possible; retry counts/backoff state advance on repeated failures; and a successful retry refreshes the stored vector/index state. Return a concise user-facing pass/fail verdict with the main reason." | 1) Simulate embedding-provider unavailability during `memory_save` or `memory_index_scan` 2) Confirm the memory is still saved and marked pending without vectors, with lexical-only fallback intact 3) Restore provider availability and run or wait for the retry manager batch job 4) Confirm pending items are retried, retry counters/backoff metadata update appropriately, and cache reuse is visible when content was embedded before 5) Verify successful retry clears the pending state and refreshes vector/index rows for the affected memory | Provider outage yields saved memory with pending embedding status and lexical-only fallback; retry manager scans and processes pending items; embedding cache participates in deduplication; retry count/progressive backoff state changes across failures; successful retry updates memory index and vector storage | Save/index transcript during outage + pending status evidence + retry-manager run output + cache/retry stats + final vector/index state after recovery | PASS if pending memories remain searchable lexically during outage and are later upgraded with vectors by retry orchestration; FAIL if failed embeddings are dropped, pending items are never retried, or success does not refresh index/vector state | Inspect retry-manager batch selection and backoff logic; verify embedding cache reuse; check pending-status persistence during fallback; confirm retry success path clears stale vector rows and writes refreshed embeddings |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/19-embedding-retry-orchestrator.md](../../feature_catalog/14--pipeline-architecture/19-embedding-retry-orchestrator.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 204
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/204-embedding-retry-orchestrator.md`
