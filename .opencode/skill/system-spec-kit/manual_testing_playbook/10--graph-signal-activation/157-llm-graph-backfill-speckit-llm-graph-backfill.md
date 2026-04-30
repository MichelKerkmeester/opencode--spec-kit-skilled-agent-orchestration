---
title: "157 -- LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL)"
description: "This scenario validates LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL) for `157`. It focuses on enabling the flag and verifying the backfill hook is registered."
audited_post_018: true
---

# 157 -- LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL)

## 1. OVERVIEW

This scenario validates LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL) for `157`. It focuses on enabling the flag and verifying the backfill hook is registered.

---

## 2. SCENARIO CONTRACT


- Objective: Verify backfill hook registration and scheduling for high-value documents.
- Real user request: `Please validate LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL) against SPECKIT_LLM_GRAPH_BACKFILL=true and tell me whether the expected signals are present: onIndex() returns llmBackfillScheduled=true when qualityScore >= threshold; backfill callback is invoked via setImmediate; low-value docs (qualityScore < 0.7) do not trigger backfill.`
- RCAF Prompt: `As a graph-signal validation operator, validate LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL) against SPECKIT_LLM_GRAPH_BACKFILL=true. Verify backfill hook registration and scheduling for high-value documents. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: onIndex() returns llmBackfillScheduled=true when qualityScore >= threshold; backfill callback is invoked via setImmediate; low-value docs (qualityScore < 0.7) do not trigger backfill
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if onIndex() returns llmBackfillScheduled=true for high-quality doc and false for low-quality doc; FAIL if backfill scheduled regardless of quality or never scheduled

---

## 3. TEST EXECUTION

### Prompt

```
As a graph-signal validation operator, verify backfill hook registration and scheduling against SPECKIT_LLM_GRAPH_BACKFILL=true. Verify onIndex() returns llmBackfillScheduled=true when qualityScore >= threshold; backfill callback is invoked via setImmediate; low-value docs do not trigger backfill. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `SPECKIT_LLM_GRAPH_BACKFILL=true`
2. Register callback via `registerLlmBackfillFn()`
3. Call `onIndex(db, memoryId, content, { qualityScore: 0.8 })`
4. Verify OnIndexResult.llmBackfillScheduled
5. `npx vitest run tests/graph-lifecycle.vitest.ts`

### Expected

onIndex() returns llmBackfillScheduled=true when qualityScore >= threshold; backfill callback is invoked via setImmediate; low-value docs do not trigger backfill

### Evidence

OnIndexResult output with llmBackfillScheduled field + test transcript

### Pass / Fail

- **Pass**: onIndex() returns llmBackfillScheduled=true for high-quality doc and false for low-quality doc
- **Fail**: backfill scheduled regardless of quality or never scheduled

### Failure Triage

Check isLlmGraphBackfillEnabled() → Verify registerLlmBackfillFn() was called → Inspect qualityScore vs llmBackfillThreshold (default 0.7) → Check setImmediate scheduling

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [10--graph-signal-activation/14-llm-graph-backfill.md](../../feature_catalog/10--graph-signal-activation/14-llm-graph-backfill.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/graph-lifecycle.ts`

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 157
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `10--graph-signal-activation/157-llm-graph-backfill-speckit-llm-graph-backfill.md`
