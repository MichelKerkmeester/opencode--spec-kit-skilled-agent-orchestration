---
title: "INT-002 -- Hybrid intent queries add graph context on top of semantic retrieval"
description: "This scenario validates that hybrid intent queries append structural graph context while the normal semantic retrieval payload remains intact."
---

# INT-002 -- Hybrid intent queries add graph context on top of semantic retrieval

## 1. OVERVIEW

This scenario validates that queries classified as `hybrid` by the query-intent classifier append code-graph context to the standard semantic retrieval response.

---

## 2. SCENARIO CONTRACT

- Objective: Verify that hybrid queries (mixing structural keywords like "function", "calls" with semantic keywords like "explain", "examples") are classified as hybrid and append `graphContext` metadata to the normal `memory_context` response.
- Real user request: `Please verify that hybrid queries (mixing structural keywords like "function", "calls" with semantic keywords like "explain", "examples") are classified as hybrid and append graphContext metadata to the normal memory_context response.`
- RCAF Prompt: `As a manual-testing orchestrator, send a hybrid query like "find all validation functions and explain their error handling approach" to memory_context against the current Spec Kit Memory recovery surfaces in this repository. Verify the intent is classified as hybrid, queryIntentRouting is present, graphContext appears when graph seeds resolve, and the normal semantic response body remains present. Return a concise user-visible pass/fail verdict with the main reason.`
- Expected execution process: Run the TEST EXECUTION command sequence for `INT-002`, capture the listed evidence, compare observed output with the expected signals, and return the verdict to the user.
- Expected signals: Intent classified as `hybrid`, response contains `queryIntentRouting`, `graphContext` appears when graph seeds resolve, and the normal semantic response body remains present
- Desired user-visible outcome: A concise user-visible PASS/FAIL verdict naming whether the scenario satisfied the objective and the main reason.
- Pass/fail: PASS if hybrid routing is confirmed and graphContext is appended successfully; FAIL if graph augmentation is missing when expected or the response structure breaks


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| INT-002 | Hybrid query result augmentation | Hybrid intent appends graphContext to the semantic response | `As a manual-testing orchestrator, send a hybrid query like "find all validation functions and explain their error handling approach" to memory_context against the current Spec Kit Memory recovery surfaces in this repository. Verify the intent is classified as hybrid, queryIntentRouting is present, graphContext appears when graph seeds resolve, and the normal semantic response body remains present. Return a concise user-visible pass/fail verdict with the main reason.` | 1. `memory_context({ input: "find all validation functions and explain their error handling approach" })` | Intent classified as `hybrid`, `queryIntentRouting` present, `graphContext` appended when graph anchors resolve | memory_context response showing routing metadata plus graphContext | PASS if hybrid routing and graphContext augmentation are both present; FAIL if graph augmentation never appears when the graph has matching anchors | Check hybrid scoring threshold in query-intent-classifier.ts and graph augmentation path in memory-context.ts |


---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: Code Graph Integration
- Playbook ID: INT-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--code-graph-integration/002-hybrid-query-merges-results.md`
