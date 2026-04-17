---
title: "268 -- Post-insert retry budget"
description: "This scenario validates the post-insert retry budget for `268`. It focuses on proving deferred enrichment stops retrying after the documented budget is exhausted."
---

# 268 -- Post-insert retry budget

## 1. OVERVIEW

This scenario validates the post-insert retry budget for `268`. It focuses on proving deferred enrichment stops retrying after the documented budget is exhausted.

---

## 2. CURRENT REALITY

- Objective: Verify deferred enrichment retries stop after three `(memoryId, step, reason)` failures and reset on success
- Prompt: `As a lifecycle validation operator, validate Post-insert retry budget against the deferred enrichment path. Verify the same unresolved post-insert failure is retried only three times for one memory and step, the fourth attempt is skipped with a structured exhaustion signal, and a successful completion clears the budget. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: first three retries allowed; fourth skipped; structured exhaustion signal present; successful completion clears the memory-specific budget
- Pass/fail: PASS if the retry budget caps repeat failures deterministically and resets after success

---

## 3. TEST EXECUTION

### Prompt

```
As a lifecycle validation operator, validate the deferred enrichment retry budget. Verify the same unresolved post-insert failure is retried only three times for one memory and step, the fourth attempt is skipped with a structured exhaustion signal, and a successful completion clears the budget. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Trigger the deferred enrichment path with a reproducible `partial_causal_link_unresolved` outcome
2. Repeat the same failure three times and confirm retries are still scheduled
3. Trigger the same failure a fourth time and confirm the retry is skipped
4. Clear or resolve the condition and confirm a successful run resets the memory-specific budget

### Expected

First three retries allowed; fourth skipped; successful completion clears the budget

### Evidence

Deferred enrichment traces for attempts one through four plus a successful post-reset run

### Pass / Fail

- **Pass**: the retry budget caps repeat failures deterministically and resets after success
- **Fail**: the same failing condition keeps requeueing indefinitely or does not reset after a successful run

### Failure Triage

Inspect `mcp_server/lib/enrichment/retry-budget.ts`, `mcp_server/handlers/save/post-insert.ts`, and the retry-budget tests

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [05--lifecycle/09-post-insert-retry-budget.md](../../feature_catalog/05--lifecycle/09-post-insert-retry-budget.md)

---

## 5. SOURCE METADATA

- Group: Lifecycle
- Playbook ID: 268
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--lifecycle/268-post-insert-retry-budget.md`
