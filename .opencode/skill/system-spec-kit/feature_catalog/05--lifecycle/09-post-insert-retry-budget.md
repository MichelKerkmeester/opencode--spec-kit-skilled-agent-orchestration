---
title: "Post-insert retry budget"
description: "Phase 017 added a bounded retry budget for save-time enrichment so structurally non-retryable post-insert failures stop after three attempts instead of looping indefinitely."
---

# Post-insert retry budget

## 1. OVERVIEW

Phase 017 added a bounded retry budget for save-time enrichment so structurally non-retryable post-insert failures stop after three attempts instead of looping indefinitely.

This is lifecycle control for the enrichment pipeline. It keeps the save path from re-scheduling the same doomed repair work forever and gives operators a deterministic reset point when a memory is retried successfully or the process restarts.

---

## 2. CURRENT REALITY

Commit `61f93c9bf` introduced `mcp_server/lib/enrichment/retry-budget.ts` and wired it into the `partial_causal_link_unresolved` branch of `handlers/save/post-insert.ts`.

The retry budget keys attempts on `(memoryId, step, reason)` tuples. `shouldRetry()` allows the first three attempts, `recordFailure()` increments the budget when the same unresolved condition recurs, and `clearBudget(memoryId?)` clears either one memory's counters or the whole in-memory budget. `getBudgetSize()` is exposed for diagnostics and tests.

The current `N=3` cap is a heuristic bounded hot-loop budget, not an empirically calibrated threshold. Runtime retry decisions now emit structured `retry_attempt` events with `{memoryId, step, reason, attempt, outcome, timestamp}` so future tuning can use real attempt histograms instead of guesswork.

The current consumer is the deferred post-insert enrichment path. If causal-link backfill keeps returning `partial_causal_link_unresolved`, the save pipeline now stops requeueing after the third failure and emits a structured warning instead of continuing an unbounded retry loop. A successful completion clears the memory-specific budget.

The budget is intentionally process-local. It resets on restart, which is acceptable for the current save lifecycle because the feature is designed to prevent hot-loop retry churn inside one MCP process rather than to persist retry state across deployments.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/enrichment/retry-budget.ts` | Lib | In-memory retry budget keyed by memory ID, enrichment step, and failure reason |
| `mcp_server/handlers/save/post-insert.ts` | Handler | Consults the retry budget before re-scheduling deferred enrichment |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/retry-budget.vitest.ts` | Budget counting, isolation, exhaustion, and reset behavior |
| `mcp_server/tests/post-insert-deferred.vitest.ts` | Deferred enrichment interactions with retry-budget reset behavior |

---

## 4. SOURCE METADATA

- Group: Lifecycle
- Source feature title: Post-insert retry budget
- Phase 017 commits: `61f93c9bf`
- Current reality source: `026-graph-and-context-optimization/016-foundational-runtime/003-cluster-consumers/implementation-summary.md`
