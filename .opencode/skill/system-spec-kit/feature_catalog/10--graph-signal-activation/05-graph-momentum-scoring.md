---
title: "Graph momentum scoring"
description: "Describes the temporal degree delta signal that scores memories higher when they gain new graph edges recently, applied as a capped +0.05 additive bonus in Stage 2."
---

# Graph momentum scoring

## 1. OVERVIEW

Describes the temporal degree delta signal that scores memories higher when they gain new graph edges recently, applied as a capped +0.05 additive bonus in Stage 2.

This tracks how quickly a piece of knowledge is gaining connections to other knowledge. Think of it like a trending topic: the faster something connects to related ideas, the more likely it is to be relevant right now. A memory that gained three new links this week gets a small search boost compared to one whose connections have not changed in months.

---

## 2. CURRENT REALITY

Graph connectivity changes over time, and that trajectory carries signal. A memory gaining three new edges this week is more actively relevant than one whose connections have been static for months.

Graph momentum computes a temporal degree delta: `current_degree - degree_7d_ago`. The `degree_snapshots` table records per-node degree counts at daily granularity with a UNIQUE constraint on `(memory_id, snapshot_date)`. The `snapshotDegrees()` function captures the current state, and `computeMomentum()` looks back 7 days to calculate the delta.

The momentum signal applies as an additive bonus in Stage 2 of the pipeline, capped at +0.05 per result. Batch computation via `computeMomentumScores()` is session-cached to avoid repeated database queries within a single search request. Cache invalidation follows the established pattern from `graph-search-fn.ts`: caches clear on edge mutations via `clearGraphSignalsCache()`.

When no snapshot exists for the 7-day lookback (common during initial rollout), the momentum defaults to zero rather than penalizing the memory. Runs behind the `SPECKIT_GRAPH_SIGNALS` flag (default ON, shared with N2b).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/graph/graph-signals.ts` | Lib | Graph momentum and depth signals |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/feature-eval-graph-signals.vitest.ts` | Graph signal evaluation |
| `mcp_server/tests/graph-signals.vitest.ts` | Graph signal computation |

---

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Graph momentum scoring
- Current reality source: FEATURE_CATALOG.md
