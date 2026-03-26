---
title: "161 -- LLM reformulation (SPECKIT_LLM_REFORMULATION)"
description: "This scenario validates LLM reformulation (SPECKIT_LLM_REFORMULATION) for `161`. It focuses on deep mode behavior and verifying the reformulation pipeline runs."
---

# 161 -- LLM reformulation (SPECKIT_LLM_REFORMULATION)

## 1. OVERVIEW

This scenario validates LLM reformulation (SPECKIT_LLM_REFORMULATION) for `161`. It focuses on deep mode behavior and verifying the reformulation pipeline runs.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `161` and confirm the expected signals without contradicting evidence.

- Objective: Verify reformulation pipeline runs in deep mode with corpus-grounded seeds
- Prompt: `Run a deep-mode search and verify the graduated reformulation pipeline produces a step-back abstract and corpus-grounded variants. Capture the evidence needed to prove cheapSeedRetrieve() returns FTS5/BM25 seeds, the LLM generates an abstract + variants (max 2), and the shared LLM cache is populated. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: cheapSeedRetrieve() returns up to 3 seed results from FTS5; ReformulationResult contains abstract (>= 5 chars) and variants array (max 2 entries); LLM cache hit on repeated query; pipeline is no-op when mode != deep
- Pass/fail: PASS if reformulation produces valid abstract and variants in deep mode, and is skipped in non-deep mode; FAIL if abstract empty, variants exceed MAX_VARIANTS (2), or pipeline runs outside deep mode

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 161 | LLM reformulation (SPECKIT_LLM_REFORMULATION) | Verify reformulation pipeline runs in deep mode | `Run a deep-mode search and verify step-back abstract and corpus-grounded variants are produced. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `memory_search({ query: "complex multi-faceted query", mode: "deep" })` 2) Inspect reformulation output for abstract + variants 3) Verify cache populated 4) Re-run same query, verify cache hit | cheapSeedRetrieve() returns FTS5/BM25 seeds; abstract >= 5 chars; variants array max 2; LLM cache hit on repeat; no-op in non-deep mode | ReformulationResult output + cache hit log + test transcript | PASS if reformulation produces valid abstract + variants in deep mode and skips in non-deep; FAIL if abstract empty, variants > 2, or runs outside deep mode | Verify isLlmReformulationEnabled() → Check LLM_REFORMULATION_ENDPOINT configured → Inspect cheapSeedRetrieve() for FTS5 results → Verify normalizeQuery() cache key → Check REFORMULATION_TIMEOUT_MS (8000) |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [12--query-intelligence/07-llm-query-reformulation.md](../../feature_catalog/12--query-intelligence/07-llm-query-reformulation.md)
- Feature flag reference: [01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/llm-reformulation.ts`

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 161
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `12--query-intelligence/161-llm-reformulation-speckit-llm-reformulation.md`
