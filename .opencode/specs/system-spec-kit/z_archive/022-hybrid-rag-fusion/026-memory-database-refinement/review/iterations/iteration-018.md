# Iteration 018: Graph signals and degree boost

## Findings

### [P1] Self-loop degrees are snapshotted twice but measured once for momentum
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts`

**Issue**
`snapshotDegrees()` and `getCurrentDegree()` use different degree semantics for self-referential edges. A `source_id = target_id` edge is counted twice in the historical snapshot path but only once in the live current-degree path, so `computeMomentum()` can report negative momentum even when the graph is unchanged.

**Evidence**
`snapshotDegrees()` expands each edge into both `source_id` and `target_id` via `UNION ALL` before counting at lines 71-79, so a self-loop contributes two rows to `degree_count`. `getCurrentDegree()` instead runs `COUNT(*)` over the original table with `WHERE source_id = ? OR target_id = ?` at lines 118-123, so the same self-loop contributes one row. `computeMomentum()` then subtracts the snapshotted value from the current value at lines 156-161. For a graph containing only `1 -> 1`, the snapshot path records degree `2` while the live path returns degree `1`, producing a false momentum of `-1`.

**Fix**
Make current and historical degree computation use the same definition. If total in-degree plus out-degree is intended, compute current degree with the same `UNION ALL` shape used by `snapshotDegrees()`. If incident-edge count is intended instead, change the snapshot query to count each self-loop once. Add a regression test that snapshots a stable self-loop graph and asserts zero momentum afterward.

### [P1] Degree-cache invalidation only covers one mutation surface
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts`

**Issue**
The file documents cache invalidation as if all causal-edge mutations flow through `storage/causal-edges.ts`, but the codebase has several direct `causal_edges` writers outside that module. When those paths run, the per-DB degree cache can retain stale scores and continue feeding old degree rankings into fusion.

**Evidence**
The cache contract in this file says invalidation happens through `clearDegreeCache()` / `clearDegreeCacheForDb()` on causal-edge mutations at lines 289-307 and the cache is then reused in `computeDegreeScores()` at lines 479-490. That assumption is incomplete: direct causal-edge mutations also happen in `vector-index-mutations.ts:73-80` (delete edges during memory removal), `corrections.ts:486-495` and `corrections.ts:601-628` (insert/delete correction edges), `reconsolidation.ts:251-254` (insert `supersedes` edge), `graph-lifecycle.ts:275-284` (update strengths), and `entity-linker.ts:640-643` (insert support edges). None of those paths call `clearDegreeCacheForDb()`, so any cached score computed before the mutation can survive afterward.

**Fix**
Centralize all `causal_edges` writes behind a shared mutation helper that always invalidates both the degree cache and graph-signal caches, or add explicit `clearDegreeCacheForDb(database)` and `clearGraphSignalsCache()` calls to every direct mutation path. A graph-version token checked by `computeDegreeScores()` would make this harder to miss in future write paths.

### [P1] The advertised `0.15` degree cap does not cap fusion influence
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts`

**Issue**
`normalizeDegreeToBoostedScore()` presents degree as a bounded additive score in `[0, 0.15]`, but the downstream fusion pipeline does not use that magnitude as a final cap. It converts the degree results into a separate ranked RRF channel with fixed weight, so the bounded value only affects intra-channel ordering, not the channel's total contribution to fused ranking.

**Evidence**
This file documents the output as a bounded boost score at lines 352-368 and returns those values from `computeDegreeScores()` at lines 486-490. Hybrid search then takes those rows, sorts them, and pushes them into fusion as a `degree` list with fixed `weight: 0.4` in `hybrid-search.ts:942-960`. `fuseResultsMulti()` computes contributions from rank and list weight (`weight * (1 / (k + rank))`) rather than the raw `degreeScore` magnitude in `.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:288-324`. The tests already encode the consequence: `feature-eval-graph-signals.vitest.ts:269-287` expects the top degree-only result to normalize to an `rrfScore` of `1.0`, not to stay under `0.15`. That means the "cap" does not actually prevent degree from becoming a strong extra fusion channel and convergence source.

**Fix**
If the intent is a true bounded boost, apply the degree score after fusion as an additive adjustment, similar to `applyGraphSignals()`, instead of turning it into a full ranked channel. If degree must remain a channel, derive its list weight from the bounded score distribution or otherwise map the `0.15` cap into the fusion weight. At minimum, rename the helper/docs so they stop implying the current value is an end-to-end fusion cap.

## Summary
I found three concrete issues in the reviewed surfaces: one correctness bug in momentum's degree accounting, one cache-staleness bug caused by incomplete mutation invalidation coverage, and one degree-normalization mismatch where the documented cap does not bound real fusion impact. I did not find a separate disconnected-component bug in these two files; the SCC depth logic in `graph-signals.ts` looks internally consistent, and the actual community-partitioning behavior lives outside the reviewed scope.
