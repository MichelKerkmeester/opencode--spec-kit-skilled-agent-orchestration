---
title: "Weekly batch feedback learning"
description: "Weekly batch feedback learning aggregates implicit feedback events from the ledger, computes confidence-weighted signal scores per memory, and records shadow rank deltas with min-support and boost-cap guards, gated by the SPECKIT_BATCH_LEARNED_FEEDBACK flag."
---

# Weekly batch feedback learning

## 1. OVERVIEW

Weekly batch feedback learning aggregates implicit feedback events from the ledger, computes confidence-weighted signal scores per memory, and records shadow rank deltas with min-support and boost-cap guards, gated by the `SPECKIT_BATCH_LEARNED_FEEDBACK` flag.

Over time, users interact with search results in ways that reveal which memories are most helpful. This feature collects those interaction signals weekly, weighs them by confidence, and calculates how much each memory should be boosted. Strong signals like explicit selections count more than passive ones. Safety guards prevent any single memory from getting an outsized boost in one cycle, and a minimum number of distinct sessions must contribute before a signal is taken seriously. Everything runs in shadow mode first — recording what would change without actually changing anything.

---

## 2. CURRENT REALITY

The batch learning pipeline runs on a 7-day window (`BATCH_WINDOW_MS`). It reads implicit feedback events from the `feedback_events` table (via `feedback-ledger.ts`) and aggregates per-memory signals with confidence-weighted scoring: strong = 1.0, medium = 0.5, weak = 0.1 (`CONFIDENCE_WEIGHTS`).

Guards: `MIN_SUPPORT_SESSIONS = 3` distinct sessions required before a signal is eligible for promotion. `MAX_BOOST_DELTA = 0.10` per cycle prevents runaway amplification. Results are logged to the `batch_learning_log` table for auditability, recording memory ID, batch timestamp, session count, weighted score, computed boost, shadow rank delta, and promotion status.

The `runBatchLearning()` function accepts configurable options for run timestamp, look-back window, minimum support, and max boost delta. Returns a `BatchLearningResult` with counts of candidates evaluated, shadow-applied, and skipped due to insufficient support.

Key invariant: shadow-only — no live ranking columns are mutated. Default ON (graduated), controlled by `SPECKIT_BATCH_LEARNED_FEEDBACK`.

`runBatchLearning()` is called from `context-server.ts` during server startup, after the retry manager initializes. The call is wrapped in a try/catch so a failure does not crash the server. The feature flag check inside `runBatchLearning()` is the sole gate — if the flag is disabled, the function returns a zero-count no-op result immediately.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/context-server.ts` | Server | Startup caller — invokes `runBatchLearning(database)` once at server startup after retry manager |
| `mcp_server/lib/feedback/batch-learning.ts` | Lib | Aggregation, confidence weighting, boost computation, shadow apply, batch_learning_log |
| `mcp_server/lib/feedback/feedback-ledger.ts` | Lib | Feedback event storage and retrieval |
| `mcp_server/lib/search/search-flags.ts` | Lib | Flag accessor (indirectly, via feature flag pattern) |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/batch-learning.vitest.ts` | Flag behavior, aggregation, min-support guard, boost cap, shadow rank delta, table schema |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Weekly batch feedback learning
- Current reality source: mcp_server/lib/feedback/batch-learning.ts module header and implementation
