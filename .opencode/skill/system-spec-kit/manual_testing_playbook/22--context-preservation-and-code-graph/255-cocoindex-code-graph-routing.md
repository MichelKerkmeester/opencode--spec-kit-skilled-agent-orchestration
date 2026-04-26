---
title: "255 -- Semantic vs structural query routing"
description: "This scenario validates CocoIndex bridge for 255. It focuses on CocoIndex used for semantic, code_graph for structural."
audited_post_018: true
---

# 255 -- Semantic vs structural query routing

## 1. OVERVIEW

This scenario validates CocoIndex bridge.

---

## 2. SCENARIO CONTRACT

- **Objective**: Verify that the CocoIndex bridge correctly routes between semantic and structural queries. The seed resolver (`seed-resolver.ts`) normalizes CocoIndex file:line results to ArtifactRef via a resolution chain (exact symbol, enclosing symbol, file anchor). `code_graph_context` expands resolved anchors in 3 modes: neighborhood (1-hop graph neighbors), outline (file symbol listing), and impact (reverse callers). The post-013 contract must also surface an explicit blocked-read payload when readiness requires a suppressed full scan and structured `metadata.partialOutput` details when deadline or budget pressure omits work.
- **Schema contract examples**:
  - Semantic: `mcp__cocoindex_code__search({ query: "memory search pipeline" })`
  - Structural: `code_graph_query({ operation: "calls_to", subject: "allocateBudget" })` (`operation` + `subject` are required)
- **Prerequisites**:
  - Node.js installed and `npx vitest` available
  - Working directory is the project root
  - CocoIndex Code MCP server available (for semantic search), or mocked in tests
  - Code graph database populated with indexed files (for structural queries)
- **Prompt**: `As a context-and-code-graph validation operator, validate Semantic vs structural query routing against Manual: call mcp__cocoindex_code__search({ query: "memory search pipeline" }). Verify the CocoIndex bridge correctly routes between semantic and structural queries. The seed resolver (seed-resolver.ts) normalizes CocoIndex file:line and filePath seeds to ArtifactRef via a resolution chain (exact symbol, enclosing symbol, file anchor). code_graph_context expands resolved anchors in neighborhood, outline, and impact modes, returns an explicit blocked payload when readiness requires a suppressed full scan, and reports structured metadata.partialOutput details when deadline or budget pressure omits work. Return a concise pass/fail verdict with the main reason and cited evidence.`
- **Expected signals**:
  - Semantic query ("how does memory search work") returns conceptually related code files via CocoIndex embedding similarity
  - Structural query ("what calls allocateBudget") returns exact callers/callees from code graph edges
  - Seed resolver resolves CocoIndex results to graph nodes via: exact symbol match, then enclosing symbol fallback, then file-level anchor
  - `code_graph_context` neighborhood mode returns 1-hop connected symbols
  - `code_graph_context` outline mode returns all symbols in a file
  - `code_graph_context` impact mode returns reverse callers (who depends on this)
  - `code_graph_context` returns `status: "blocked"` plus `blocked`, `graphAnswersOmitted`, and `requiredAction: "code_graph_scan"` when readiness requires a full scan that the handler will not run inline
  - `code_graph_context` returns structured `metadata.partialOutput` fields (`isPartial`, `reasons`, `omittedSections`, `omittedAnchors`, `truncatedText`) when bounded execution omits work
- **Pass/fail criteria**:
  - PASS: Semantic and structural queries produce distinct, appropriate result sets; seed resolver correctly resolves CocoIndex seeds to graph nodes; the context handler proves all 3 expansion modes, blocked-read payloads, and `partialOutput` metadata
  - FAIL: Semantic query returns structural results (or vice versa), seed resolver fails to resolve valid CocoIndex results, the playbook still points at stale suites, or the context contract misses blocked/partial-output evidence

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
As a context-and-code-graph validation operator, validate the live routing contracts against `cd .opencode/skill/system-spec-kit/mcp_server && npm exec -- vitest run code-graph/tests/code-graph-context-handler.vitest.ts code-graph/tests/code-graph-query-handler.vitest.ts code-graph/tests/code-graph-seed-resolver.vitest.ts`. Verify the seed resolver preserves CocoIndex file and filePath seeds, neighborhood returns 1-hop neighbors, outline returns file symbols, impact returns reverse callers, `code_graph_context` returns an explicit blocked payload when readiness requires a suppressed full scan, and `metadata.partialOutput` reports omitted work when bounded execution trims output. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server && npm exec -- vitest run code-graph/tests/code-graph-context-handler.vitest.ts code-graph/tests/code-graph-query-handler.vitest.ts code-graph/tests/code-graph-seed-resolver.vitest.ts`

### Expected

Seed resolver preserves CocoIndex file/filePath seeds, neighborhood returns 1-hop neighbors, outline returns file symbols, impact returns reverse callers, blocked reads surface `requiredAction: "code_graph_scan"`, and bounded runs expose structured `metadata.partialOutput`

### Evidence

Vitest output for `code-graph-context-handler`, `code-graph-query-handler`, and `code-graph-seed-resolver`, including blocked-read and `partialOutput` assertions

### Pass / Fail

- **Pass**: the referenced suites pass and their assertions confirm seed fidelity, mode-specific expansion, explicit blocked-read payloads, and structured `partialOutput` metadata
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `code-graph-context.ts`, `handlers/context.ts`, `handlers/query.ts`, and `seed-resolver.ts` for mode handling, blocked-read payloads, and seed normalization logic

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md](../../feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 255
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`
