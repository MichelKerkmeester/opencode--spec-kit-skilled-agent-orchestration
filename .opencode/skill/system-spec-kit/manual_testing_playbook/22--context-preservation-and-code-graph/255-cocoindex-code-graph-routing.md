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


- Objective: Verify that the CocoIndex bridge correctly routes between semantic and structural queries; The seed resolver (`seed-resolver.ts`) normalizes CocoIndex file:line results to ArtifactRef via a resolution chain (exact symbol, enclosing symbol, file anchor); `code_graph_context` expands resolved anchors in 3 modes: neighborhood (1-hop graph neighbors), outline (file symbol listing), and impact (reverse callers); The post-013 contract must also surface an explicit blocked-read payload when readiness requires a suppressed full scan and structured `metadata.partialOutput` details when deadline or budget pressure omits work.
- Real user request: `` Please validate Semantic vs structural query routing against Manual: call mcp__cocoindex_code__search({ query: "memory search pipeline" }) and tell me whether the expected signals are present: Semantic query ("how does memory search work") returns conceptually related code files via CocoIndex embedding similarity; Structural query ("what calls allocateBudget") returns exact callers/callees from code graph edges; Seed resolver resolves CocoIndex results to graph nodes via: exact symbol match, then enclosing symbol fallback, then file-level anchor; `code_graph_context` neighborhood mode returns 1-hop connected symbols; `code_graph_context` outline mode returns all symbols in a file; `code_graph_context` impact mode returns reverse callers (who depends on this); `code_graph_context` returns `status: "blocked"` plus `blocked`, `graphAnswersOmitted`, and `requiredAction: "code_graph_scan"` when readiness requires a full scan that the handler will not run inline; `code_graph_context` returns structured `metadata.partialOutput` fields (`isPartial`, `reasons`, `omittedSections`, `omittedAnchors`, `truncatedText`) when bounded execution omits work. ``
- RCAF Prompt: `As a context-and-code-graph validation operator, validate Semantic vs structural query routing against Manual: call mcp__cocoindex_code__search({ query: "memory search pipeline" }). Verify the CocoIndex bridge correctly routes between semantic and structural queries. The seed resolver (seed-resolver.ts) normalizes CocoIndex file:line and filePath seeds to ArtifactRef via a resolution chain (exact symbol, enclosing symbol, file anchor). code_graph_context expands resolved anchors in neighborhood, outline, and impact modes, returns an explicit blocked payload when readiness requires a suppressed full scan, and reports structured metadata.partialOutput details when deadline or budget pressure omits work. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Semantic query ("how does memory search work") returns conceptually related code files via CocoIndex embedding similarity; Structural query ("what calls allocateBudget") returns exact callers/callees from code graph edges; Seed resolver resolves CocoIndex results to graph nodes via: exact symbol match, then enclosing symbol fallback, then file-level anchor; `code_graph_context` neighborhood mode returns 1-hop connected symbols; `code_graph_context` outline mode returns all symbols in a file; `code_graph_context` impact mode returns reverse callers (who depends on this); `code_graph_context` returns `status: "blocked"` plus `blocked`, `graphAnswersOmitted`, and `requiredAction: "code_graph_scan"` when readiness requires a full scan that the handler will not run inline; `code_graph_context` returns structured `metadata.partialOutput` fields (`isPartial`, `reasons`, `omittedSections`, `omittedAnchors`, `truncatedText`) when bounded execution omits work
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Semantic and structural queries produce distinct, appropriate result sets; seed resolver correctly resolves CocoIndex seeds to graph nodes; the context handler proves all 3 expansion modes, blocked-read payloads, and `partialOutput` metadata; FAIL: Semantic query returns structural results (or vice versa), seed resolver fails to resolve valid CocoIndex results, the playbook still points at stale suites, or the context contract misses blocked/partial-output evidence

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

---

### Prompt

```
As a context-and-code-graph validation operator, validate cocoindex_code fork telemetry presence on search responses against mcp__cocoindex_code__search({ query:"memory search pipeline", limit:5 }). Verify each result carries dedupedAliases (int), uniqueResultCount (int, response-level), path_class (string ∈ documented enum), rankingSignals (array of strings), source_realpath (string), content_hash (string), raw_score (number). Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `mcp__cocoindex_code__search({ query:"memory search pipeline", limit:5 })`
2. Inspect each result for the 7 telemetry fields and the response-level `uniqueResultCount`

### Expected

All 7 fork telemetry fields present per result (`rankingSignals` is a non-empty array of strings — see `mcp_server/schemas/tool-input-schemas.ts:482-492` for the canonical Zod shape `z.array(z.string()).optional()`); `dedupedAliases` reflects symlink alias collapsing; `uniqueResultCount` reflects post-dedup count; `path_class` value is from the documented enum; `source_realpath` is a canonical path; `content_hash` is a stable digest; `raw_score` is a finite number.

### Evidence

cocoindex_code search response with telemetry fields highlighted

### Pass / Fail

- **Pass**: every telemetry field present and well-formed across all results; `rankingSignals` validates as `Array<string>`
- **Fail**: any field missing, `rankingSignals` empty or not an array of strings, path_class outside documented enum, or aliases not deduped

### Failure Triage

Inspect the cocoindex fork search handler telemetry serializer; confirm packet 004 dist marker on the cocoindex bridge; cross-check `dedupedAliases` against the symlink fixture

---

### Prompt

```
As a context-and-code-graph validation operator, validate seed-telemetry passthrough on code_graph_context anchors. Verify when seeds carry raw_score/path_class/rankingSignals (snake_case wire) OR rawScore/pathClass/rankingSignals (camelCase internal), the returned anchors carry rawScore, pathClass, rankingSignals next to existing score/snippet/range. Backward-compat: seeds without telemetry produce anchors without those fields (byte-equal envelope to pre-packet-015 baseline). Return a concise pass/fail verdict.
```

### Commands

1. `code_graph_context({ seeds:[{ ..., raw_score, path_class, rankingSignals }] })` — anchors should carry camelCase telemetry fields
2. `code_graph_context({ seeds:[{ ..., rawScore, pathClass, rankingSignals }] })` — anchors should preserve fields verbatim
3. `code_graph_context({ seeds:[{ ... no telemetry ... }] })` — anchors should be byte-equal to pre-packet-015 baseline (no extra keys)

### Expected

Telemetry survives expansion as additive metadata; score/confidence/resolution/ordering byte-equal pre vs post; no second rerank in the cocoindex bridge (verify via static grep on `lib/search`).

### Evidence

code_graph_context anchor payloads for all three seed shapes plus a diff against the pre-packet-015 baseline

### Pass / Fail

- **Pass**: telemetry passes through additively; baseline byte-equal when telemetry absent; no rerank introduced
- **Fail**: telemetry stripped, anchor ordering changes, baseline drift, or new rerank pass detected

### Failure Triage

Inspect `mcp_server/code_graph/lib/seed-resolver.ts` and `code_graph/handlers/context.ts` anchor builder; confirm packet 015 dist marker; grep `lib/search` for any new rerank function

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md](../../feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 255
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`
