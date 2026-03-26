---
title: "174 -- Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING)"
description: "This scenario validates graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING) for `174`. It focuses on the default-on graduated rollout and verifying query-time alias matching activates the graph channel for matched concepts."
---

# 174 -- Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING)

## 1. OVERVIEW

This scenario validates graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING) for `174`. It focuses on the default-on graduated rollout and verifying query-time alias matching activates the graph channel for matched concepts.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `174` and confirm the expected signals without contradicting evidence.

- Objective: Verify query-time alias matching activates graph channel for matched concepts
- Prompt: `Test the default-on SPECKIT_GRAPH_CONCEPT_ROUTING behavior. Run a search with a natural language query that references a known concept indirectly (e.g., "how does memory decay work" for the FSRS decay concept). Verify noun phrase extraction identifies concept references, alias table matching returns canonical concept names, and the graph channel is activated for matched concepts. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: noun phrases extracted from query; concept alias table matched in SQLite; canonical concept names returned; graph channel activated in stage1-candidate-gen for matched concepts; isGraphConceptRoutingEnabled() returns true by default
- Pass/fail: PASS if indirect concept references activate graph channel via alias matching; FAIL if noun phrase extraction fails, alias table not consulted, or graph channel not activated for matched concepts

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 174 | Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING) | Verify query-time alias matching activates graph channel for matched concepts | `Test the default-on SPECKIT_GRAPH_CONCEPT_ROUTING behavior. Run a query with indirect concept references and verify graph channel activation via alias matching. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_GRAPH_CONCEPT_ROUTING` is unset or `true` 2) `memory_search({ query: "how does memory decay work" })` 3) Inspect entity-linker output for noun phrase extraction 4) Verify alias table matching returns canonical concepts 5) Confirm graph channel activated for matched concepts in stage1-candidate-gen | isGraphConceptRoutingEnabled() returns true; noun phrases extracted from query; alias table consulted in SQLite; canonical concept names returned; graph channel activated for matched concepts | Entity linker output + concept matches + graph channel activation log + test transcript | PASS if indirect concept references activate graph channel via noun phrase extraction and alias matching; FAIL if noun phrases not extracted, alias table skipped, or graph channel not activated | Verify isGraphConceptRoutingEnabled() → Confirm flag is not forced off → Check entity-linker.ts noun phrase extraction → Inspect alias table in SQLite → Verify stage1-candidate-gen graph channel activation logic |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [12--query-intelligence/11-graph-concept-routing.md](../../feature_catalog/12--query-intelligence/11-graph-concept-routing.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/entity-linker.ts`

---

## 5. SOURCE METADATA

- Group: Graph signal activation
- Playbook ID: 174
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/174-graph-concept-routing-speckit-graph-concept-routing.md`
