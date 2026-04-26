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

Operators run the exact prompt and command sequence for `173` and confirm the expected signals without contradicting evidence.

- Objective: Verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries
- Prompt: `As a query-intelligence validation operator, validate Query decomposition (SPECKIT_QUERY_DECOMPOSITION) against SPECKIT_QUERY_DECOMPOSITION. Verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: conjunction splitting on "and"/"or"/"also"/"plus"/"as well as"/"along with"; multiple wh-question word detection; MAX_FACETS=3 cap enforced; no LLM calls; deep-mode only activation; graceful fallback returns original query on error
- Pass/fail: PASS if multi-faceted query decomposes into <= 3 sub-queries in deep mode with rule-based splitting; FAIL if decomposition exceeds 3 sub-queries, runs outside deep mode, uses LLM, or crashes instead of falling back

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries against SPECKIT_QUERY_DECOMPOSITION. Verify isQueryDecompositionEnabled() returns true; conjunction splitting on coordinating conjunctions; wh-question word detection; MAX_FACETS=3 enforced; no LLM calls; deep-mode only; graceful fallback on error. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Confirm `SPECKIT_QUERY_DECOMPOSITION` is unset or `true`
2. `memory_search({ query: "What is the memory save workflow and how does query expansion work?", mode: "deep" })`
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

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [12--query-intelligence/10-query-decomposition.md](../../feature_catalog/12--query-intelligence/10-query-decomposition.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/query-decomposer.ts`

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 173
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `12--query-intelligence/173-query-decomposition-speckit-query-decomposition.md`
