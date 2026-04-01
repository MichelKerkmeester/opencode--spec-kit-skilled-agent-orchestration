---
title: "264 -- Query-intent routing in memory_context"
description: "This scenario validates Query-intent routing for 264. It focuses on verifying structural queries route to code graph and semantic queries route to CocoIndex."
---

# 264 -- Query-intent routing in memory_context

## 1. OVERVIEW

This scenario validates Query-intent routing in memory_context.

---

## 2. CURRENT REALITY

- **Objective**: Verify that memory_context auto-routes queries based on the query-intent classifier. Structural queries (containing keywords like "calls", "imports", "callers", "function", "class") must route to the code graph backend. Semantic queries (containing keywords like "similar", "find examples", "how to") must route to the standard memory/CocoIndex pipeline. Hybrid queries must trigger both backends and merge results. The classifier confidence score and matched keywords must be available in the response metadata.
- **Prerequisites**:
  - MCP server running with code graph populated (at least one scan)
  - At least some memories in the database for semantic results
- **Prompt**: `Validate 264 Query-intent routing. Send three queries to memory_context: (1) a structural query like "what functions call handleMemoryContext", (2) a semantic query like "find examples of error handling patterns", (3) a hybrid query like "find all validation functions and explain their approach". Confirm: (1) structural query returns code graph results, (2) semantic query returns memory/CocoIndex results, (3) hybrid query returns merged results from both backends.`
- **Expected signals**:
  - Structural query: response includes code graph symbols/edges, classifier intent === 'structural'
  - Semantic query: response includes memory hits with similarity scores, classifier intent === 'semantic'
  - Hybrid query: response includes both code graph and memory results, classifier intent === 'hybrid'
- **Pass/fail criteria**:
  - PASS: Each query type routes to the correct backend(s) and returns appropriate result types
  - FAIL: Structural query returns only memory results, semantic query hits code graph, or hybrid missing one backend

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 264a | Query-intent routing | Structural query routes to code graph | `Validate 264a structural routing` | Call `memory_context({ input: "what functions call handleMemoryContext" })` | Response includes code graph data (symbols, edges), intent classified as 'structural' | memory_context response with code graph results | PASS if code graph results present and classifier shows structural intent | Check STRUCTURAL_KEYWORDS in query-intent-classifier.ts and memory_context integration |
| 264b | Query-intent routing | Semantic query routes to memory pipeline | `Validate 264b semantic routing` | Call `memory_context({ input: "find examples of error handling patterns" })` | Response includes memory hits with similarity scores, intent classified as 'semantic' | memory_context response with memory results | PASS if memory/semantic results present and classifier shows semantic intent | Check SEMANTIC_KEYWORDS and memory_context fallback path |
| 264c | Query-intent routing | Hybrid query merges both backends | `Validate 264c hybrid routing` | Call `memory_context({ input: "find all validation functions and explain their approach" })` | Response includes both code graph and memory results, intent classified as 'hybrid' | memory_context response with merged results | PASS if both backends contribute results | Check hybrid scoring threshold and merge logic |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/19-query-intent-routing.md](../../feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 264
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/264-query-intent-routing.md`
