---
title: "INT-001 -- Semantic queries route to CocoIndex via query-intent classifier"
description: "This scenario validates that semantic queries still route to CocoIndex when the Spec Kit Memory query-intent classifier is active."
---

# INT-001 -- Semantic queries route to CocoIndex via query-intent classifier

## 1. OVERVIEW

This scenario validates that the query-intent classifier in Spec Kit Memory correctly routes semantic/conceptual queries to CocoIndex rather than the code graph.

---

## 2. CURRENT REALITY

- Objective: Verify that semantic queries (containing keywords like "find examples", "how to", "similar to", "explain") are routed to the standard memory pipeline which includes CocoIndex for vector similarity, not to the structural code graph.
- Prompt: `Send a semantic query like "find examples of error handling patterns in this codebase" to memory_context. Capture the evidence needed to prove: (1) query-intent classifier returns intent=semantic, (2) CocoIndex search is invoked as part of the retrieval pipeline, (3) results include file paths with similarity scores from vector search, (4) no code graph symbols/edges in the primary results. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Intent classified as 'semantic', results contain vector similarity matches with file paths and scores from CocoIndex, no structural graph data in primary results
- Pass/fail: PASS if semantic routing confirmed and CocoIndex results present; FAIL if query routed to code graph or CocoIndex not invoked


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| INT-001 | Query-intent semantic routing | Semantic query routes to CocoIndex, not code graph | `Send "find examples of error handling patterns" to memory_context and verify CocoIndex routing` | 1. `memory_context({ input: "find examples of error handling patterns in this codebase" })` | Intent classified as 'semantic', results include file paths with similarity scores, no code graph edges | memory_context response showing semantic results | PASS if intent=semantic AND CocoIndex results present AND no graph data in primary results; FAIL if structural routing or empty results | Check SEMANTIC_KEYWORDS in query-intent-classifier.ts; verify CocoIndex daemon running via `ccc status` |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: Code Graph Integration
- Playbook ID: INT-001
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--code-graph-integration/001-query-intent-semantic-routing.md`
