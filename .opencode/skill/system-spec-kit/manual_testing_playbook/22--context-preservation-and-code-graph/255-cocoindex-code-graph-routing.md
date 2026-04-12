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

### Prompt

```
As a context-and-code-graph validation operator, validate Semantic query routes to CocoIndex and returns meaning-based results against Manual: call mcp__cocoindex_code__search({ query: "memory search pipeline" }). Verify results are semantically related files (e.g., search handler, query router) rather than exact string matches. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Manual: call mcp__cocoindex_code__search({ query: "memory search pipeline" })

### Expected

Results are semantically related files (e.g., search handler, query router) rather than exact string matches

### Evidence

CocoIndex search output listing relevant file paths with similarity scores

### Pass / Fail

- **Pass**: results are conceptually relevant to the query meaning
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify CocoIndex MCP server is running and index is built

---

### Prompt

```
As a context-and-code-graph validation operator, validate Structural query routes to code_graph and returns edge-based results against Manual: call code_graph_query({ operation: "calls_to", subject: "allocateBudget" }). Verify returns exact caller functions with file paths and line numbers from code_edges table. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Manual: call code_graph_query({ operation: "calls_to", subject: "allocateBudget" })

### Expected

Returns exact caller functions with file paths and line numbers from code_edges table

### Evidence

Code graph query output showing caller/callee relationships

### Pass / Fail

- **Pass**: callers are exact function references from the graph database
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify code graph is indexed and contains allocateBudget node

---

### Prompt

```
As a context-and-code-graph validation operator, validate code_graph_context expands in neighborhood, outline, and impact modes against cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts. Verify neighborhood returns 1-hop neighbors, outline returns file symbols, impact returns reverse callers. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/code-graph-indexer.vitest.ts

### Expected

Neighborhood returns 1-hop neighbors, outline returns file symbols, impact returns reverse callers

### Evidence

Test output showing each mode's distinct results

### Pass / Fail

- **Pass**: all 3 modes return non-empty, mode-appropriate results
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `code-graph-context.ts` for mode handling logic

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md](../../feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 255
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`
