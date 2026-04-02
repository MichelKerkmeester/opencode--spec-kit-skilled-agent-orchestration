---
title: "INT-001 -- Semantic queries stay on the semantic path via query-intent classifier"
description: "This scenario validates that semantic queries stay on the semantic retrieval path when the Spec Kit Memory query-intent classifier is active."
---

# INT-001 -- Semantic queries stay on the semantic path via query-intent classifier

## 1. OVERVIEW

This scenario validates that the query-intent classifier in Spec Kit Memory correctly routes semantic/conceptual queries to the semantic path rather than the structural code graph path.

---

## 2. CURRENT REALITY

- Objective: Verify that semantic queries (containing keywords like "find examples", "how to", "similar to", "explain") are classified as semantic and do not trigger structural graph augmentation in `memory_context`.
- Prompt: `Send a semantic query like "find examples of error handling patterns in this codebase" to memory_context. Capture the evidence needed to prove: (1) query-intent classifier returns intent=semantic, (2) routedBackend is semantic when routing metadata is present, (3) no code graph symbols/edges are appended via graphContext, and (4) the response still returns a normal semantic memory_context payload. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Intent classified as 'semantic', routedBackend is `semantic` when present, no `graphContext` block in the response, no structural graph data injected into primary results
- Pass/fail: PASS if semantic routing is confirmed and no graph augmentation is added; FAIL if the query routes to the structural path or graphContext is injected unexpectedly


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| INT-001 | Query-intent semantic routing | Semantic query stays on the semantic path, not the graph path | `Send "find examples of error handling patterns" to memory_context and verify semantic routing` | 1. `memory_context({ input: "find examples of error handling patterns in this codebase" })` | Intent classified as 'semantic', `queryIntentRouting.routedBackend` is `semantic` when present, no `graphContext` block | memory_context response showing routing metadata and semantic result shape | PASS if intent=semantic and no graph augmentation is injected; FAIL if structural routing or graphContext appears unexpectedly | Check SEMANTIC_KEYWORDS in query-intent-classifier.ts and graph augmentation guard in memory-context.ts |


---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)


---

## 5. SOURCE METADATA

- Group: Code Graph Integration
- Playbook ID: INT-001
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--code-graph-integration/001-query-intent-semantic-routing.md`
