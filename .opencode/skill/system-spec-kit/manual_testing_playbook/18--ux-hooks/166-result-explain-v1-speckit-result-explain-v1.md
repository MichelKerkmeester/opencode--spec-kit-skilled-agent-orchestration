---
title: "166 -- Result explain v1 (SPECKIT_RESULT_EXPLAIN_V1)"
description: "This scenario validates result explain v1 (SPECKIT_RESULT_EXPLAIN_V1) for `166`. It focuses on enabling the flag, running a search, and verifying `why.summary` + `topSignals` in results."
---

# 166 -- Result explain v1 (SPECKIT_RESULT_EXPLAIN_V1)

## 1. OVERVIEW

This scenario validates result explain v1 (SPECKIT_RESULT_EXPLAIN_V1) for `166`. It focuses on enabling the flag, running a search, and verifying `why.summary` + `topSignals` in results.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `166` and confirm the expected signals without contradicting evidence.

- Objective: Verify two-tier explainability attachment to search results
- Prompt: `Test SPECKIT_RESULT_EXPLAIN_V1=true. Run a search and verify each result contains a why.summary (natural-language explanation) and topSignals array (scoring signal labels). Then test with debug enabled to verify channelContribution map is included. Capture the evidence needed to prove the slim tier (summary + topSignals) always present when flag ON, and debug tier (channelContribution) only when debug.enabled=true. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Each result has why.summary string (non-empty); why.topSignals array with SignalLabel entries (e.g., 'semantic_match', 'graph_boosted', 'anchor:decisions'); channelContribution with vector/fts/graph numbers only in debug mode; no why field when flag OFF
- Pass/fail: PASS if slim tier (summary + topSignals) present on all results when flag ON, debug tier includes channelContribution, and no why field when flag OFF; FAIL if summary missing, topSignals empty, or channelContribution leaks in non-debug mode

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 166 | Result explain v1 (SPECKIT_RESULT_EXPLAIN_V1) | Verify why.summary + topSignals in results | `Test SPECKIT_RESULT_EXPLAIN_V1=true. Run a search, verify why.summary and topSignals on each result. Test debug mode for channelContribution. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_RESULT_EXPLAIN_V1=true` 2) `memory_search({ query: "test explainability" })` 3) Inspect each result for why.summary + why.topSignals 4) Re-run with debug.enabled=true 5) Verify channelContribution present in debug mode | why.summary non-empty; topSignals array with valid SignalLabel entries; channelContribution (vector/fts/graph) in debug only; no why when flag OFF | Result JSON with why field + debug channelContribution | PASS if slim tier present and debug tier includes channelContribution; FAIL if summary missing, topSignals empty, or channelContribution leaks in non-debug | Verify isResultExplainEnabled() → Inspect extractSignals() for PipelineRow → Check resolveEffectiveScore() → Verify channelAttribution detection → Check SignalLabel types |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/14-result-explainability.md](../../feature_catalog/18--ux-hooks/14-result-explainability.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/result-explainability.ts`

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 166
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/166-result-explain-v1-speckit-result-explain-v1.md`
