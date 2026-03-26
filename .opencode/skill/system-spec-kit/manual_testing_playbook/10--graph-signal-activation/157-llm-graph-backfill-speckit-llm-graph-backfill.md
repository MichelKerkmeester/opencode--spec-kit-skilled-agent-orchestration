---
title: "157 -- LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL)"
description: "This scenario validates LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL) for `157`. It focuses on enabling the flag and verifying the backfill hook is registered."
---

# 157 -- LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL)

## 1. OVERVIEW

This scenario validates LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL) for `157`. It focuses on enabling the flag and verifying the backfill hook is registered.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `157` and confirm the expected signals without contradicting evidence.

- Objective: Verify backfill hook registration and scheduling for high-value documents
- Prompt: `Test SPECKIT_LLM_GRAPH_BACKFILL=true. Register a backfill callback via registerLlmBackfillFn(), save a high-quality memory (qualityScore >= 0.7), and verify the LLM backfill is scheduled. Capture the evidence needed to prove onIndex() returns llmBackfillScheduled=true for high-value docs and false for low-value docs. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: onIndex() returns llmBackfillScheduled=true when qualityScore >= threshold; backfill callback is invoked via setImmediate; low-value docs (qualityScore < 0.7) do not trigger backfill
- Pass/fail: PASS if onIndex() returns llmBackfillScheduled=true for high-quality doc and false for low-quality doc; FAIL if backfill scheduled regardless of quality or never scheduled

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 157 | LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL) | Verify backfill hook registration and scheduling | `Test SPECKIT_LLM_GRAPH_BACKFILL=true. Register a backfill callback via registerLlmBackfillFn(), save a high-quality memory (qualityScore >= 0.7), and verify the LLM backfill is scheduled. Capture the evidence needed to prove onIndex() returns llmBackfillScheduled=true for high-value docs and false for low-value docs. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_LLM_GRAPH_BACKFILL=true` 2) Register callback via `registerLlmBackfillFn()` 3) Call `onIndex(db, memoryId, content, { qualityScore: 0.8 })` 4) Verify OnIndexResult.llmBackfillScheduled 5) `npx vitest run tests/graph-lifecycle.vitest.ts` | onIndex() returns llmBackfillScheduled=true when qualityScore >= threshold; backfill callback is invoked via setImmediate; low-value docs do not trigger backfill | OnIndexResult output with llmBackfillScheduled field + test transcript | PASS if onIndex() returns llmBackfillScheduled=true for high-quality doc and false for low-quality doc; FAIL if backfill scheduled regardless of quality or never scheduled | Check isLlmGraphBackfillEnabled() → Verify registerLlmBackfillFn() was called → Inspect qualityScore vs llmBackfillThreshold (default 0.7) → Check setImmediate scheduling |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [10--graph-signal-activation/14-llm-graph-backfill.md](../../feature_catalog/10--graph-signal-activation/14-llm-graph-backfill.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/search/graph-lifecycle.ts`

---

## 5. SOURCE METADATA

- Group: Graph Signal Activation
- Playbook ID: 157
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `10--graph-signal-activation/157-llm-graph-backfill-speckit-llm-graph-backfill.md`
