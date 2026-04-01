---
title: "INT-002 -- Hybrid intent queries merge code graph and CocoIndex results"
description: "This scenario validates that hybrid intent queries produce merged results from both the structural code graph and CocoIndex semantic search."
---

# INT-002 -- Hybrid intent queries merge code graph and CocoIndex results

## 1. OVERVIEW

This scenario validates that queries classified as 'hybrid' by the query-intent classifier trigger both the code graph (structural) and CocoIndex (semantic) backends, and that results from both are merged into the response.

---

## 2. CURRENT REALITY

- Objective: Verify that hybrid queries (mixing structural keywords like "function", "calls" with semantic keywords like "explain", "examples") trigger both backends and merge results. The merged response must contain code graph data (symbols, edges) alongside CocoIndex semantic matches (file paths, similarity scores).
- Prompt: `Send a hybrid query like "find all validation functions and explain their error handling approach" to memory_context. Capture the evidence needed to prove: (1) query-intent classifier returns intent=hybrid, (2) code graph results include function symbols matching "validation", (3) CocoIndex results include files with error handling patterns, (4) both result sets are present in the merged response. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Intent classified as 'hybrid', response contains both structural (code graph symbols) and semantic (CocoIndex file matches) results, confidence scores present for both
- Pass/fail: PASS if both backends contribute results in merged response; FAIL if only one backend's results present or merge fails


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| INT-002 | Hybrid query result merging | Hybrid intent triggers both code graph and CocoIndex | `Send "find all validation functions and explain their error handling approach" to memory_context` | 1. `memory_context({ input: "find all validation functions and explain their error handling approach" })` | Intent classified as 'hybrid', response includes code graph symbols AND CocoIndex semantic matches | memory_context response showing merged results | PASS if both code graph and CocoIndex results present in response; FAIL if only one backend represented | Check hybrid scoring threshold in query-intent-classifier.ts; verify both code graph and CocoIndex are available via `code_graph_status` and `ccc status` |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: Code Graph Integration
- Playbook ID: INT-002
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--code-graph-integration/002-hybrid-query-merges-results.md`
