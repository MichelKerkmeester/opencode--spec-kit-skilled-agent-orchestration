---
title: "187 -- Quick search (memory_quick_search)"
description: "This scenario validates the memory_quick_search tool for `187`. It focuses on Verify simplified query-only retrieval returns results with optional spec-folder scoping and governed retrieval boundaries."
---

# 187 -- Quick search (memory_quick_search)

## 1. OVERVIEW

This scenario validates the memory_quick_search tool for `187`. It focuses on Verify simplified query-only retrieval returns results with optional spec-folder scoping and governed retrieval boundaries.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `187` and confirm the expected signals without contradicting evidence.

- Objective: Verify `memory_quick_search` returns relevant results for a query string, respects optional `specFolder` scoping, honors governed retrieval boundaries (`tenantId`, `userId`, `agentId`, `sharedSpaceId`), and respects `limit` parameter
- Prompt: `Validate memory_quick_search via /memory:search retrieval mode. Capture the evidence needed to prove Query-only retrieval returns results; specFolder scoping narrows results; limit parameter is respected; governed boundaries filter correctly. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Query-only retrieval returns results; specFolder scoping narrows results to the specified folder; limit parameter caps the result count; governed retrieval boundaries filter results appropriately
- Pass/fail: PASS: Quick search returns relevant results, specFolder narrows scope, limit is respected, governed boundaries filter; FAIL: Quick search returns no results for a known query, specFolder is ignored, limit is exceeded, or governed boundaries do not filter

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 187 | Quick search (memory_quick_search) | Verify `memory_quick_search` simplified query-only retrieval | `Validate memory_quick_search via /memory:search retrieval mode. Capture the evidence needed to prove Query-only retrieval returns results; specFolder scoping narrows results; limit parameter is respected; governed boundaries filter correctly. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Call `memory_quick_search({ query: "authentication" })` with no optional parameters and verify results are returned 2) Call `memory_quick_search({ query: "authentication", specFolder: "specs/<known-spec>" })` and verify results are scoped to the specified folder 3) Call `memory_quick_search({ query: "authentication", limit: 3 })` and verify at most 3 results are returned 4) Call `memory_quick_search({ query: "authentication", tenantId: "tenant-1" })` and verify governed retrieval boundary is respected 5) Compare `memory_quick_search` results with `memory_context` results for the same query to confirm quick_search provides a simplified fast-path alternative | Query-only retrieval returns results; specFolder scoping narrows results to the specified folder; limit parameter caps the result count; governed retrieval boundaries filter results appropriately | Tool outputs for each call showing result count, specFolder scoping, limit adherence, and tenant filtering | PASS: Quick search returns relevant results, specFolder narrows scope, limit is respected, governed boundaries filter; FAIL: Quick search returns no results for a known query, specFolder is ignored, limit is exceeded, or governed boundaries do not filter | Verify `memory_quick_search` tool is listed in search.md allowed-tools → Check L2 layer routing → Confirm query parameter is required → Inspect optional parameter handling for specFolder, limit, tenantId, userId, agentId, sharedSpaceId |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/10-fast-delegated-search-memory-quick-search.md](../../feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md)
- Command file: [.opencode/command/memory/search.md](../../../../command/memory/search.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 187
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/187-quick-search-memory-quick-search.md`
