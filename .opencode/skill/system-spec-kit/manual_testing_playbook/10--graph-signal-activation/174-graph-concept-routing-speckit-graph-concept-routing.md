---
title: "174 -- Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING)"
description: "This scenario validates graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING) for `174`. It focuses on the default-on graduated rollout and verifying query-time alias matching activates the graph channel for matched concepts."
audited_post_018: true
---

# 174 -- Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING)

## 1. OVERVIEW

This scenario validates graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING) for `174`. It focuses on the default-on graduated rollout and verifying query-time alias matching activates the graph channel for matched concepts.

---

## 2. SCENARIO CONTRACT


- Objective: Verify query-time alias matching activates graph channel for matched concepts.
- Real user request: `Please validate Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING) against SPECKIT_GRAPH_CONCEPT_ROUTING and tell me whether the expected signals are present: noun phrases extracted from query; concept alias table matched in SQLite; canonical concept names returned; graph channel activated in stage1-candidate-gen for matched concepts; isGraphConceptRoutingEnabled() returns true by default.`
- RCAF Prompt: `As a graph-signal validation operator, validate Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING) against SPECKIT_GRAPH_CONCEPT_ROUTING. Verify query-time alias matching activates graph channel for matched concepts. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: noun phrases extracted from query; concept alias table matched in SQLite; canonical concept names returned; graph channel activated in stage1-candidate-gen for matched concepts; isGraphConceptRoutingEnabled() returns true by default
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if indirect concept references activate graph channel via alias matching; FAIL if noun phrase extraction fails, alias table not consulted, or graph channel not activated for matched concepts

---

## 3. TEST EXECUTION

### Prompt

```
As a graph-signal validation operator, verify query-time alias matching activates graph channel for matched concepts against SPECKIT_GRAPH_CONCEPT_ROUTING. Verify isGraphConceptRoutingEnabled() returns true; noun phrases extracted from query; alias table consulted in SQLite; canonical concept names returned; graph channel activated for matched concepts. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Confirm `SPECKIT_GRAPH_CONCEPT_ROUTING` is unset or `true`
2. `memory_search({ query: "how does memory decay work" })`
3. Inspect entity-linker output for noun phrase extraction
4. Verify alias table matching returns canonical concepts
5. Confirm graph channel activated for matched concepts in stage1-candidate-gen

### Expected

isGraphConceptRoutingEnabled() returns true; noun phrases extracted from query; alias table consulted in SQLite; canonical concept names returned; graph channel activated for matched concepts

### Evidence

Entity linker output + concept matches + graph channel activation log + test transcript

### Pass / Fail

- **Pass**: indirect concept references activate graph channel via noun phrase extraction and alias matching
- **Fail**: noun phrases not extracted, alias table skipped, or graph channel not activated

### Failure Triage

Verify isGraphConceptRoutingEnabled() → Confirm flag is not forced off → Check entity-linker.ts noun phrase extraction → Inspect alias table in SQLite → Verify stage1-candidate-gen graph channel activation logic

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [12--query-intelligence/11-graph-concept-routing.md](../../feature_catalog/12--query-intelligence/11-graph-concept-routing.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/entity-linker.ts`

---

## 5. SOURCE METADATA

- Group: Graph signal activation
- Playbook ID: 174
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--graph-signal-activation/174-graph-concept-routing-speckit-graph-concept-routing.md`
