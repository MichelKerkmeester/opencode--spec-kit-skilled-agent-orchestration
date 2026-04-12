---
title: "255 -- Semantic vs structural query routing"
description: "This scenario validates CocoIndex bridge for 255. It focuses on CocoIndex used for semantic, code_graph for structural."
audited_post_018: true
---

# 255 -- Semantic vs structural query routing

## 1. OVERVIEW

This scenario validates CocoIndex bridge.

---

## 2. CURRENT REALITY

- **Objective**: Verify that the CocoIndex bridge correctly routes between semantic and structural queries. The seed resolver (`seed-resolver.ts`) normalizes CocoIndex file:line results to ArtifactRef via a resolution chain (exact symbol, enclosing symbol, file anchor). `code_graph_context` expands resolved anchors in 3 modes: neighborhood (1-hop graph neighbors), outline (file symbol listing), and impact (reverse callers). Budget-aware truncation must apply to context output.
- **Schema contract examples**:
  - Semantic: `mcp__cocoindex_code__search({ query: "memory search pipeline" })`
  - Structural: `code_graph_query({ operation: "calls_to", subject: "allocateBudget" })` (`operation` + `subject` are required)
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - CocoIndex Code MCP server available (for semantic search), or mocked in tests
  - Code graph database populated with indexed files (for structural queries)
- **Prompt**: `As a context-and-code-graph validation operator, validate Semantic vs structural query routing against Manual: call mcp__cocoindex_code__search({ query: "memory search pipeline" }). Verify the CocoIndex bridge correctly routes between semantic and structural queries. The seed resolver (seed-resolver.ts) normalizes CocoIndex file:line results to ArtifactRef via a resolution chain (exact symbol, enclosing symbol, file anchor). code_graph_context expands resolved anchors in 3 modes: neighborhood (1-hop graph neighbors), outline (file symbol listing), and impact (reverse callers). Budget-aware truncation must apply to context output. Return a concise pass/fail verdict with the main reason and cited evidence.`
- **Expected signals**:
  - Semantic query ("how does memory search work") returns conceptually related code files via CocoIndex embedding similarity
  - Structural query ("what calls allocateBudget") returns exact callers/callees from code graph edges
  - Seed resolver resolves CocoIndex results to graph nodes via: exact symbol match, then enclosing symbol fallback, then file-level anchor
  - `code_graph_context` neighborhood mode returns 1-hop connected symbols
  - `code_graph_context` outline mode returns all symbols in a file
  - `code_graph_context` impact mode returns reverse callers (who depends on this)
  - Budget-aware truncation prevents oversized context output
- **Pass/fail criteria**:
  - PASS: Semantic and structural queries produce distinct, appropriate result sets; seed resolver correctly resolves to graph nodes; all 3 context expansion modes work
  - FAIL: Semantic query returns structural results (or vice versa), seed resolver fails to resolve valid CocoIndex results, or context expansion returns empty for populated graph

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 255a | CocoIndex bridge | Semantic query routes to CocoIndex and returns meaning-based results | `As a context-and-code-graph validation operator, validate Semantic query routes to CocoIndex and returns meaning-based results against Manual: call mcp__cocoindex_code__search({ query: "memory search pipeline" }). Verify results are semantically related files (e.g., search handler, query router) rather than exact string matches. Return a concise pass/fail verdict with the main reason and cited evidence.` | `Manual: call mcp__cocoindex_code__search({ query: "memory search pipeline" })` | Results are semantically related files (e.g., search handler, query router) rather than exact string matches | CocoIndex search output listing relevant file paths with similarity scores | PASS if results are conceptually relevant to the query meaning | Verify CocoIndex MCP server is running and index is built |
| 255b | CocoIndex bridge | Structural query routes to code_graph and returns edge-based results | `As a context-and-code-graph validation operator, validate Structural query routes to code_graph and returns edge-based results against Manual: call code_graph_query({ operation: "calls_to", subject: "allocateBudget" }). Verify returns exact caller functions with file paths and line numbers from code_edges table. Return a concise pass/fail verdict with the main reason and cited evidence.` | `Manual: call code_graph_query({ operation: "calls_to", subject: "allocateBudget" })` | Returns exact caller functions with file paths and line numbers from code_edges table | Code graph query output showing caller/callee relationships | PASS if callers are exact function references from the graph database | Verify code graph is indexed and contains allocateBudget node |
| 255c | CocoIndex bridge | code_graph_context expands in neighborhood, outline, and impact modes | `As a context-and-code-graph validation operator, validate code_graph_context expands in neighborhood, outline, and impact modes against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts. Verify neighborhood returns 1-hop neighbors, outline returns file symbols, impact returns reverse callers. Return a concise pass/fail verdict with the main reason and cited evidence.` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts` | Neighborhood returns 1-hop neighbors, outline returns file symbols, impact returns reverse callers | Test output showing each mode's distinct results | PASS if all 3 modes return non-empty, mode-appropriate results | Check `code-graph-context.ts` for mode handling logic |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md](../../feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 255
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`
