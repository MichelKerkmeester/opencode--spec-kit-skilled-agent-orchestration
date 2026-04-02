---
title: "INT-002 -- Hybrid intent queries add graph context on top of semantic retrieval"
description: "This scenario validates that hybrid intent queries append structural graph context while the normal semantic retrieval payload remains intact."
---

# INT-002 -- Hybrid intent queries add graph context on top of semantic retrieval

## 1. OVERVIEW

This scenario validates that queries classified as `hybrid` by the query-intent classifier append code-graph context to the standard semantic retrieval response.

---

## 2. CURRENT REALITY

- Objective: Verify that hybrid queries (mixing structural keywords like "function", "calls" with semantic keywords like "explain", "examples") are classified as hybrid and append `graphContext` metadata to the normal `memory_context` response.
- Prompt: `Send a hybrid query like "find all validation functions and explain their error handling approach" to memory_context. Capture the evidence needed to prove: (1) query-intent classifier returns intent=hybrid, (2) routedBackend is hybrid or structural as appropriate, (3) graphContext is present when the graph has matching anchors, and (4) the base memory_context response still remains intact. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Intent classified as `hybrid`, response contains `queryIntentRouting`, `graphContext` appears when graph seeds resolve, and the normal semantic response body remains present
- Pass/fail: PASS if hybrid routing is confirmed and graphContext is appended successfully; FAIL if graph augmentation is missing when expected or the response structure breaks


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| INT-002 | Hybrid query result augmentation | Hybrid intent appends graphContext to the semantic response | `Send "find all validation functions and explain their error handling approach" to memory_context` | 1. `memory_context({ input: "find all validation functions and explain their error handling approach" })` | Intent classified as `hybrid`, `queryIntentRouting` present, `graphContext` appended when graph anchors resolve | memory_context response showing routing metadata plus graphContext | PASS if hybrid routing and graphContext augmentation are both present; FAIL if graph augmentation never appears when the graph has matching anchors | Check hybrid scoring threshold in query-intent-classifier.ts and graph augmentation path in memory-context.ts |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: Code Graph Integration
- Playbook ID: INT-002
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--code-graph-integration/002-hybrid-query-merges-results.md`
