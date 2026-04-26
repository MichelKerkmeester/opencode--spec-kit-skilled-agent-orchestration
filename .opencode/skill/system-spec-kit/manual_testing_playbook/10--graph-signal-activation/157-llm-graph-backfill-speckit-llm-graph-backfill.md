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

Operators run the exact prompt and command sequence for `157` and confirm the expected signals without contradicting evidence.

- Objective: Verify backfill hook registration and scheduling for high-value documents
- Prompt: `As a graph-signal validation operator, validate LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL) against SPECKIT_LLM_GRAPH_BACKFILL=true. Verify backfill hook registration and scheduling for high-value documents. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: onIndex() returns llmBackfillScheduled=true when qualityScore >= threshold; backfill callback is invoked via setImmediate; low-value docs (qualityScore < 0.7) do not trigger backfill
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

## 4. REFERENCES

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
