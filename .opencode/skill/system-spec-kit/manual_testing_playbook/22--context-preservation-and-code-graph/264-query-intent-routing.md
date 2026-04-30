---
title: "264 -- Query-intent routing in memory_context"
description: "This scenario validates Query-intent routing for 264. It focuses on verifying structural queries route to code graph and semantic queries route to CocoIndex."
audited_post_018: true
---

# 264 -- Query-intent routing in memory_context

## 1. OVERVIEW

This scenario validates Query-intent routing in memory_context.

---

## 2. SCENARIO CONTRACT


- Objective: Verify that memory_context auto-routes queries based on the query-intent classifier; Structural queries (containing keywords like "calls", "imports", "callers", "function", "class") must route to the code graph backend; Semantic queries (containing keywords like "similar", "find examples", "how to") must route to the standard memory/CocoIndex pipeline; Hybrid queries must trigger both backends and merge results; The classifier confidence score and matched keywords must be available in the response metadata.
- Real user request: `Please validate Query-intent routing in memory_context against memory_context({ input: "what functions call handleMemoryContext" }) and tell me whether the expected signals are present: Structural query: response includes code graph symbols/edges, classifier intent === 'structural'; Semantic query: response includes memory hits with similarity scores, classifier intent === 'semantic'; Hybrid query: response includes both code graph and memory results, classifier intent === 'hybrid'.`
- RCAF Prompt: `As a context-and-code-graph validation operator, validate Query-intent routing in memory_context against memory_context({ input: "what functions call handleMemoryContext" }). Verify memory_context auto-routes queries based on the query-intent classifier. Structural queries (containing keywords like "calls", "imports", "callers", "function", "class") must route to the code graph backend. Semantic queries (containing keywords like "similar", "find examples", "how to") must route to the standard memory/CocoIndex pipeline. Hybrid queries must trigger both backends and merge results. The classifier confidence score and matched keywords must be available in the response metadata. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Structural query: response includes code graph symbols/edges, classifier intent === 'structural'; Semantic query: response includes memory hits with similarity scores, classifier intent === 'semantic'; Hybrid query: response includes both code graph and memory results, classifier intent === 'hybrid'
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Each query type routes to the correct backend(s) and returns appropriate result types; FAIL: Structural query returns only memory results, semantic query hits code graph, or hybrid missing one backend

---

## 3. TEST EXECUTION

### Prompt

```
As a context-and-code-graph validation operator, validate Structural query routes to code graph against memory_context({ input: "what functions call handleMemoryContext" }). Verify response includes code graph data (symbols, edges), intent classified as 'structural'. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `memory_context({ input: "what functions call handleMemoryContext" })`

### Expected

Response includes code graph data (symbols, edges), intent classified as 'structural'

### Evidence

memory_context response with code graph results

### Pass / Fail

- **Pass**: code graph results present and classifier shows structural intent
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check STRUCTURAL_KEYWORDS in query-intent-classifier.ts and memory_context integration

---

### Prompt

```
As a context-and-code-graph validation operator, validate Semantic query routes to memory pipeline against memory_context({ input: "find examples of error handling patterns" }). Verify response includes memory hits with similarity scores, intent classified as 'semantic'. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `memory_context({ input: "find examples of error handling patterns" })`

### Expected

Response includes memory hits with similarity scores, intent classified as 'semantic'

### Evidence

memory_context response with memory results

### Pass / Fail

- **Pass**: memory/semantic results present and classifier shows semantic intent
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check SEMANTIC_KEYWORDS and memory_context fallback path

---

### Prompt

```
As a context-and-code-graph validation operator, validate Hybrid query merges both backends against memory_context({ input: "find all validation functions and explain their approach" }). Verify response includes both code graph and memory results, intent classified as 'hybrid'. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Call `memory_context({ input: "find all validation functions and explain their approach" })`

### Expected

Response includes both code graph and memory results, intent classified as 'hybrid'

### Evidence

memory_context response with merged results

### Pass / Fail

- **Pass**: both backends contribute results
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check hybrid scoring threshold and merge logic

---

### Prompt

```
As a context-and-code-graph validation operator, validate the canonical IntentTelemetry envelope shape across runtimes against memory_context({ input:"any structural-keyword query" }). Verify the response carries IntentTelemetry { intent, confidence, matchedKeywords, classifierVersion, runtimeId } at the documented response path. Aggregate runtimeId across cli-copilot, cli-codex, cli-claude-code, cli-gemini calls and confirm shape parity for cross-CLI aggregation. Return a concise pass/fail verdict.
```

### Commands

1. `memory_context({ input:"what calls handleMemoryContext" })` from cli-copilot — capture IntentTelemetry envelope
2. `memory_context({ input:"what calls handleMemoryContext" })` from cli-codex — capture envelope
3. `memory_context({ input:"what calls handleMemoryContext" })` from cli-claude-code — capture envelope
4. Compare the envelopes for shape parity (keys, field types, classifierVersion stability)

### Expected

A single shape across runtimes; `confidence` is a number ∈ [0,1]; `matchedKeywords` is an array of strings; `classifierVersion` is identical across runtimes for the same source build; `runtimeId` reflects the active CLI executor.

### Evidence

IntentTelemetry envelopes from all three runtimes side-by-side

### Pass / Fail

- **Pass**: envelope shape is byte-stable across runtimes; only `runtimeId` differs
- **Fail**: any envelope key missing, confidence outside [0,1], classifierVersion drift across runtimes, or matchedKeywords not an array of strings

### Failure Triage

Inspect `mcp_server/handlers/memory/context.ts` IntentTelemetry serializer and the query-intent-classifier; confirm packet 007 dist marker present across all runtimes

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/19-query-intent-routing.md](../../feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 264
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/264-query-intent-routing.md`
