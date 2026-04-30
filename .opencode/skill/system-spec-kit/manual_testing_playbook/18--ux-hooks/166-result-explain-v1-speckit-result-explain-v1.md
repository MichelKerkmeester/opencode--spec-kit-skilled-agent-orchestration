---
title: "166 -- Result explain v1 (SPECKIT_RESULT_EXPLAIN_V1)"
description: "This scenario validates result explain v1 (SPECKIT_RESULT_EXPLAIN_V1) for `166`. It focuses on enabling the flag, running a search, and verifying `why.summary` + `topSignals` in results."
---

# 166 -- Result explain v1 (SPECKIT_RESULT_EXPLAIN_V1)

## 1. OVERVIEW

This scenario validates result explain v1 (SPECKIT_RESULT_EXPLAIN_V1) for `166`. It focuses on enabling the flag, running a search, and verifying `why.summary` + `topSignals` in results.

---

## 2. SCENARIO CONTRACT


- Objective: Verify two-tier explainability attachment to search results.
- Real user request: `Please validate Result explain v1 (SPECKIT_RESULT_EXPLAIN_V1) against SPECKIT_RESULT_EXPLAIN_V1=true and tell me whether the expected signals are present: Each result has why.summary string (non-empty); why.topSignals array with SignalLabel entries (e.g., 'semantic_match', 'graph_boosted', 'anchor:decisions'); channelContribution with vector/fts/graph numbers only in debug mode; no why field when flag OFF.`
- RCAF Prompt: `As a runtime-hook validation operator, validate Result explain v1 (SPECKIT_RESULT_EXPLAIN_V1) against SPECKIT_RESULT_EXPLAIN_V1=true. Verify each result has why.summary string (non-empty); why.topSignals array with SignalLabel entries (e.g., 'semantic_match', 'graph_boosted', 'anchor:decisions'); channelContribution with vector/fts/graph numbers only in debug mode; no why field when flag OFF. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Each result has why.summary string (non-empty); why.topSignals array with SignalLabel entries (e.g., 'semantic_match', 'graph_boosted', 'anchor:decisions'); channelContribution with vector/fts/graph numbers only in debug mode; no why field when flag OFF
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if slim tier (summary + topSignals) present on all results when flag ON, debug tier includes channelContribution, and no why field when flag OFF; FAIL if summary missing, topSignals empty, or channelContribution leaks in non-debug mode

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, verify why.summary + topSignals in results against SPECKIT_RESULT_EXPLAIN_V1=true. Verify why.summary non-empty; topSignals array with valid SignalLabel entries; channelContribution (vector/fts/graph) in debug only; no why when flag OFF. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `SPECKIT_RESULT_EXPLAIN_V1=true`
2. `memory_search({ query: "test explainability" })`
3. Inspect each result for why.summary + why.topSignals
4. Re-run with debug.enabled=true
5. Verify channelContribution present in debug mode

### Expected

why.summary non-empty; topSignals array with valid SignalLabel entries; channelContribution (vector/fts/graph) in debug only; no why when flag OFF

### Evidence

Result JSON with why field + debug channelContribution

### Pass / Fail

- **Pass**: slim tier present and debug tier includes channelContribution
- **Fail**: summary missing, topSignals empty, or channelContribution leaks in non-debug

### Failure Triage

Verify isResultExplainEnabled() → Inspect extractSignals() for PipelineRow → Check resolveEffectiveScore() → Verify channelAttribution detection → Check SignalLabel types

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/14-result-explainability.md](../../feature_catalog/18--ux-hooks/14-result-explainability.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/result-explainability.ts`

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 166
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/166-result-explain-v1-speckit-result-explain-v1.md`
- audited_post_018: true
