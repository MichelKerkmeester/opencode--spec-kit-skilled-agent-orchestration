# Graph momentum scoring

## Current Reality

Graph connectivity changes over time, and that trajectory carries signal. A memory gaining three new edges this week is more actively relevant than one whose connections have been static for months.

Graph momentum computes a temporal degree delta: `current_degree - degree_7d_ago`. The `degree_snapshots` table records per-node degree counts at daily granularity with a UNIQUE constraint on `(memory_id, snapshot_date)`. The `snapshotDegrees()` function captures the current state, and `computeMomentum()` looks back 7 days to calculate the delta.

The momentum signal applies as an additive bonus in Stage 2 of the pipeline, capped at +0.05 per result. Batch computation via `computeMomentumScores()` is session-cached to avoid repeated database queries within a single search request. Cache invalidation follows the established pattern from `graph-search-fn.ts`: caches clear on edge mutations via `clearGraphSignalsCache()`.

When no snapshot exists for the 7-day lookback (common during initial rollout), the momentum defaults to zero rather than penalizing the memory. Runs behind the `SPECKIT_GRAPH_SIGNALS` flag (default ON, shared with N2b).

## Source Metadata

- Group: Graph signal activation
- Source feature title: Graph momentum scoring
- Summary match found: Yes
- Summary source feature title: Graph momentum scoring
- Current reality source: feature_catalog.md
