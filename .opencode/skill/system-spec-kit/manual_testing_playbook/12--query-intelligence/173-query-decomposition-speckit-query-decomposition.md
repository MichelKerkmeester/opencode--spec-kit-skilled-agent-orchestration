---
title: "173 -- Query decomposition (SPECKIT_QUERY_DECOMPOSITION)"
description: "This scenario validates query decomposition (SPECKIT_QUERY_DECOMPOSITION) for `173`. It focuses on the default-on graduated rollout and verifying bounded facet detection decomposes multi-faceted queries into max 3 sub-queries."
audited_post_018: true
---

# 173 -- Query decomposition (SPECKIT_QUERY_DECOMPOSITION)

## 1. OVERVIEW

This scenario validates query decomposition (SPECKIT_QUERY_DECOMPOSITION) for `173`. It focuses on the default-on graduated rollout and verifying bounded facet detection decomposes multi-faceted queries into max 3 sub-queries.

---

## 2. SCENARIO CONTRACT


- Objective: Verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries.
- Real user request: `Please validate Query decomposition (SPECKIT_QUERY_DECOMPOSITION) against SPECKIT_QUERY_DECOMPOSITION and tell me whether the expected signals are present: conjunction splitting on "and"/"or"/"also"/"plus"/"as well as"/"along with"; multiple wh-question word detection; MAX_FACETS=3 cap enforced; no LLM calls; deep-mode only activation; graceful fallback returns original query on error.`
- RCAF Prompt: `As a query-intelligence validation operator, validate Query decomposition (SPECKIT_QUERY_DECOMPOSITION) against SPECKIT_QUERY_DECOMPOSITION. Verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: conjunction splitting on "and"/"or"/"also"/"plus"/"as well as"/"along with"; multiple wh-question word detection; MAX_FACETS=3 cap enforced; no LLM calls; deep-mode only activation; graceful fallback returns original query on error
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if multi-faceted query decomposes into <= 3 sub-queries in deep mode with rule-based splitting; FAIL if decomposition exceeds 3 sub-queries, runs outside deep mode, uses LLM, or crashes instead of falling back

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries against SPECKIT_QUERY_DECOMPOSITION. Verify isQueryDecompositionEnabled() returns true; conjunction splitting on coordinating conjunctions; wh-question word detection; MAX_FACETS=3 enforced; no LLM calls; deep-mode only; graceful fallback on error. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Confirm `SPECKIT_QUERY_DECOMPOSITION` is unset or `true`
2. `memory_search({ query: "What is the spec-doc record save workflow and how does query expansion work?", mode: "deep" })`
3. Inspect decomposition output for sub-queries
4. Verify sub-query count <= 3
5. Run same query in non-deep mode, verify no decomposition

### Expected

isQueryDecompositionEnabled() returns true; conjunction splitting on coordinating conjunctions; wh-question word detection; MAX_FACETS=3 enforced; no LLM calls; deep-mode only; graceful fallback on error

### Evidence

Decomposed sub-query list + retrieval results per facet + test transcript

### Pass / Fail

- **Pass**: multi-faceted query decomposes into <= 3 focused sub-queries in deep mode using rule-based heuristics
- **Fail**: > 3 sub-queries, runs outside deep mode, uses LLM, or fails without fallback

### Failure Triage

Verify isQueryDecompositionEnabled() → Confirm flag is not forced off → Check MAX_FACETS=3 constant → Inspect conjunction splitting regex → Verify deep-mode gate in stage1-candidate-gen → Check graceful fallback path

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [12--query-intelligence/10-query-decomposition.md](../../feature_catalog/12--query-intelligence/10-query-decomposition.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/query-decomposer.ts`

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 173
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `12--query-intelligence/173-query-decomposition-speckit-query-decomposition.md`
