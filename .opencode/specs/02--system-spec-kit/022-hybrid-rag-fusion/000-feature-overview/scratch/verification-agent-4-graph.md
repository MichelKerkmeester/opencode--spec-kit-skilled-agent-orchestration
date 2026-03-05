---
title: Verification Report — Graph Signals (Features 16–22)
reviewer: @review agent (claude-sonnet-4-6)
date: 2026-03-01
spec: 02--system-spec-kit/022-hybrid-rag-fusion-refinement
---

# Verification Report: Graph Signals (Features 16–22)

## Files Reviewed

| File | Path |
|---|---|
| graph-search-fn.ts | `lib/search/graph-search-fn.ts` |
| causal-boost.ts | `lib/search/causal-boost.ts` |
| graph-flags.ts | `lib/search/graph-flags.ts` |
| edge-density.ts | `lib/eval/edge-density.ts` |
| graph-signals.ts | `lib/graph/graph-signals.ts` |
| community-detection.ts | `lib/graph/community-detection.ts` |
| co-activation.ts | `lib/cognitive/co-activation.ts` |
| stage2-fusion.ts | `lib/search/pipeline/stage2-fusion.ts` |
| vector-index-impl.ts (schema) | `lib/search/vector-index-impl.ts` (lines 1193–1230) |
| causal-edges.ts (weight history) | `lib/storage/causal-edges.ts` (lines 340–600) |

## Overall Score: 88/100 — ACCEPTABLE (PASS)

| Dimension | Score | Max |
|---|---|---|
| Correctness | 27 | 30 |
| Security | 24 | 25 |
| Patterns | 18 | 20 |
| Maintainability | 12 | 15 |
| Performance | 7 | 10 |

---

## Feature-by-Feature Verdicts

### Feature 16: Typed-Weighted Degree Centrality — PASS

**Location:** `lib/search/graph-search-fn.ts`

**Hub cap:** `MAX_TOTAL_DEGREE = 50` is declared at line 36 and applied at line 285 via `Math.min(total, MAX_TOTAL_DEGREE)`. PASS.

**MAX_TYPED_DEGREE:** The constant is named `DEFAULT_MAX_TYPED_DEGREE = 15` (line 33), not `MAX_TYPED_DEGREE`. This is the fallback value when no edges exist, not a hard cap on individual degree. The actual normalization denominator is computed dynamically via `computeMaxTypedDegree()`. The spec requirement says "MAX_TYPED_DEGREE=15 enforced" — this is implemented as a fallback floor, not a ceiling cap. This is a **naming gap vs. spec** but the semantic intent (prevent division by zero on empty graphs) is correct.

**Normalization:** Logarithmic scaling `log(1 + raw) / log(1 + max)` applied correctly in `normalizeDegreeToBoostedScore()` (lines 298–305). Boost capped at `DEGREE_BOOST_CAP = 0.15`.

**Constitutional exclusion:** Correctly excluded from boost via batch `importance_tier = 'constitutional'` lookup (lines 357–368).

**Cache:** Module-level `degreeCache` (line 254) is invalidated via `clearDegreeCache()` exported at line 403. Cache invalidation is called in `causal-edges.ts` on mutations (confirmed via `invalidateDegreeCache` references).

**Minor issue:** `computeMaxTypedDegree()` iterates all graph nodes individually (N DB queries per batch). On a graph with thousands of nodes, this is O(N) sequential queries. See Performance section.

---

### Feature 17: Co-Activation Boost with Fan-Effect sqrt Divisor — PASS

**Location:** `lib/cognitive/co-activation.ts`

**sqrt divisor:** Confirmed at lines 92–94:
```typescript
const fanDivisor = Math.sqrt(Math.max(1, relatedCount));
const boost = Math.max(0, rawBoost / fanDivisor);
```
`Math.max(1, relatedCount)` correctly guards against `sqrt(0)` (which would produce 0 and cause division by zero). PASS.

**Raw boost formula:** `boostFactor * (relatedCount / maxRelated) * (avgSimilarity / 100)` then divided by `sqrt(relatedCount)`. The division by `fanDivisor` after `relatedCount` appears in the numerator produces a net `relatedCount / sqrt(relatedCount) = sqrt(relatedCount)` scaling — the fan-effect is sublinear as intended.

**Strength value (P2):** `DEFAULT_COACTIVATION_STRENGTH = 0.25` deviates from the Sprint 1 spec value of 0.2. The comment at line 14 documents this intentional deviation with a rationale. This is a documented intentional override, not a bug.

---

### Feature 18: Edge Density Monitoring — PASS

**Location:** `lib/eval/edge-density.ts`

**Density formula:** `edgeCount / totalMemories` with fallback to `nodeCount` when `totalMemories = 0` (lines 94–95). Correct.

**Classification thresholds:** `MODERATE_THRESHOLD = 0.5`, `DENSE_THRESHOLD = 1.0` (lines 49–51). Correct.

**R10 escalation:** Triggers when `density < MODERATE_THRESHOLD` (line 101). Correct — matches spec.

**SQL safety:** All three queries use `database.prepare(...).get()` with no user-supplied parameters — no injection risk. PASS.

**Type narrowing:** Results cast to `{ cnt: number }` — straightforward and safe.

**Error handling:** Full try/catch returning a safe zero-state result (lines 115–127). PASS.

---

### Feature 19: Weight History / Snapshots — PASS

**Schema:** `weight_history` table created in migration v18 (`lib/search/vector-index-impl.ts` lines 1144–1155):
- Columns: `edge_id`, `old_strength`, `new_strength`, `changed_by`, `reason`, `changed_at`
- Indexed on `edge_id` and `changed_at DESC`

**`degree_snapshots` schema:** Created in migration v19 (`lib/search/vector-index-impl.ts` lines 1197–1206):
- Columns: `id`, `memory_id`, `degree_count`, `snapshot_date`
- UNIQUE constraint on `(memory_id, snapshot_date)`
- Indexed on `memory_id` and `snapshot_date DESC`

**Write path:** `logWeightChange()` in `lib/storage/causal-edges.ts` (lines 543–560) correctly uses parameterized INSERT with `(?, ?, ?, ?, ?)`. PASS.

**`snapshotDegrees()`:** In `lib/graph/graph-signals.ts` (lines 42–83). Uses `INSERT OR REPLACE INTO degree_snapshots` with parameterized `run(memoryId, entry.degree_count)`. PASS.

**Rollback:** `rollbackWeights()` in causal-edges.ts queries `weight_history` to find old strength and apply it — fully parameterized.

---

### Feature 20: Graph Momentum Scoring — PASS

**Location:** `lib/graph/graph-signals.ts`

**Formula:** `momentum = currentDegree - pastDegree` (line 138). Simple, correct delta computation.

**Historical lookup:** `getPastDegree()` queries `degree_snapshots` at `date('now', '-7 days')` (line 117) — fully parameterized. PASS.

**Application:** `applyGraphSignals()` (lines 333–366) applies `momentumBonus = clamp(momentum * 0.01, 0, 0.05)`. The bonus is only positive (clamped at 0 lower bound), which means negative momentum (losing connections) is not penalized — only gains are rewarded. This is a design choice, not a bug.

**Session cache:** `momentumCache` (line 17) prevents redundant DB queries within a session. Cleared by `clearGraphSignalsCache()`.

**SQL safety:** Both `getCurrentDegree()` and `getPastDegree()` use parameterized statements. PASS.

---

### Feature 21: Causal Depth Scoring (BFS Traversal) — PASS WITH NOTE

**Location:** `lib/graph/graph-signals.ts` (lines 176–306)

**BFS implementation:** Multi-root BFS starting from all in-degree=0 nodes simultaneously. Uses a standard queue (shift/push) — correct BFS order.

**Cycle detection:** BFS uses `depthMap.has(neighbor)` as the visited guard (line 277). When a neighbor is already in `depthMap`, it is not re-enqueued. This correctly handles cycles — a cycle member reachable from a root will be assigned a depth on first visit and skipped on subsequent visits. PASS.

**Empty graph handling:** Guarded at line 238 (`allNodes.size === 0`) — returns 0 for all uncached IDs. PASS.

**Cycle-only graphs (P2):** When all nodes are in cycles (no in-degree=0 roots), the `roots.length === 0` guard (line 254) causes all nodes to receive a depth of 0. This is correct behavior — no DAG structure to score.

**NOTE — Graph load strategy:** `buildAdjacencyList()` loads ALL edges from the database in a single query (line 183). For very large graphs this could be memory-intensive, but for the current scale of spec-kit memory indexes this is acceptable.

**Normalization:** `normalizedDepth = rawDepth / maxDepth` (line 291) with a `maxDepth > 0` guard. Correct.

**Depth bonus:** `depthBonus = normalizedDepth * 0.05` — maximum +0.05 additive. Correct.

---

### Feature 22: Community Detection (Louvain Escalation when >50% Largest Component) — PASS WITH ISSUE

**Location:** `lib/graph/community-detection.ts`

**BFS connected components:** Correctly implemented via standard BFS (lines 76–110). Uses Set-based visited tracking, properly handles disconnected components.

**Louvain escalation trigger:** `shouldEscalateToLouvain()` checks `maxSize > components.size * 0.5` (line 135). The `>` operator (strict greater than) means exactly 50% does NOT trigger escalation — only strictly above 50% does. The spec says "when largest component > 50% of graph" — this matches the strict inequality. PASS.

**Louvain implementation:** Single-level pure-TypeScript Louvain. Algorithm is mathematically sound — starts each node in its own community, iterates modularity gain checks up to MAX_ITERATIONS=10, re-labels to contiguous IDs. The simplified gain formula on lines 221–238 is the standard Louvain ΔQ. PASS.

**Debounce:** Edge count check prevents redundant recomputation within a session. PASS.

**Issue (P1) — Debounce returns stale data when store not called:** The debounce check at line 303 calls `loadStoredAssignments(db)` when `computedThisSession && currentEdgeCount === lastEdgeCount`. However, `storeCommunityAssignments()` is NOT called within `detectCommunities()`. It is only exported for external callers. If a caller uses `detectCommunities()` without then calling `storeCommunityAssignments()`, the next invocation with the same edge count returns an empty Map from `loadStoredAssignments()` (because nothing was persisted). This creates a behavioral inconsistency: the debounce returns cached state that was never written.

Evidence: `lib/graph/community-detection.ts` line 307–308 calls `loadStoredAssignments(db)` on debounce hit, but `storeCommunityAssignments` is never invoked inside `detectCommunities`. In `stage2-fusion.ts`, `applyCommunityBoost()` is called (line 515), which internally uses `getCommunityMembers()` reading from `community_assignments` — but `detectCommunities()` and `storeCommunityAssignments()` are not called from stage2. The community assignments table is therefore only populated when external callers (tests, management tools) explicitly call both functions.

---

## Issues Summary

### P1 — Required Fixes

#### P1-01: Debounce/Persistence Race in `detectCommunities`
**File:** `lib/graph/community-detection.ts`, lines 295–334
**Description:** `detectCommunities()` returns stale (potentially empty) data on debounce hits because `storeCommunityAssignments()` is an external responsibility and is never called inside the orchestrator. The debounce logic reads from `community_assignments` table via `loadStoredAssignments()`, but if the table is empty (assignments were never persisted by the caller), every debounced call returns an empty Map.
**Impact:** `applyCommunityBoost()` will inject zero community co-members even when the graph is populated, silently defeating Feature 22 in production pipeline invocations.
**Fix:** Either: (A) call `storeCommunityAssignments()` inside `detectCommunities()` before updating `computedThisSession`, or (B) document explicitly that callers MUST call `storeCommunityAssignments` immediately after `detectCommunities`, and add an assertion/warning if the table is empty at debounce time.

#### P1-02: `computeMaxTypedDegree` uses N sequential DB queries
**File:** `lib/search/graph-search-fn.ts`, lines 313–336
**Description:** `computeMaxTypedDegree()` fetches all unique node IDs, then calls `computeTypedDegree()` per node — each of which runs 2 DB queries (one UNION ALL). For a graph with 500 nodes this is 1000+ sequential SQLite queries per batch.
**Impact:** Search latency spike under moderate graph sizes. Not a correctness bug, but a performance regression that could degrade query response times measurably.
**Fix:** Compute max typed degree in a single SQL CTE that aggregates all edges in one pass:
```sql
SELECT node_id, SUM(typed_weight) AS typed_degree FROM (
  SELECT source_id AS node_id, ... FROM causal_edges
  UNION ALL
  SELECT target_id AS node_id, ... FROM causal_edges
) GROUP BY node_id ORDER BY typed_degree DESC LIMIT 1
```

### P2 — Suggestions

#### P2-01: CTE cycle guard is partially effective
**File:** `lib/search/causal-boost.ts`, lines 118–157
**Description:** The recursive CTE uses `AND (...next_node...) != cw.origin_id` as its cycle guard (line 151). This prevents traversal back to the direct origin but does not prevent revisiting intermediate nodes in multi-hop cycles. For example, in a graph A→B→C→B (cycle between B and C), the traversal could repeatedly visit B and C through different origin paths.
**Impact:** In practice, SQLite's recursive CTE with `UNION` (not `UNION ALL`) deduplicates rows within a single CTE traversal pass, limiting infinite loops. However, this relies on SQLite's internal deduplication, not an explicit visited set. For large cyclic graphs, the CTE may produce unexpectedly large intermediate result sets.
**Fix:** Add `AND cw.hop_distance < ?` (already present at line 150) as the primary termination. Also consider UNION → UNION ALL with explicit visited tracking, or document reliance on SQLite's UNION deduplication.
**Note:** The current MAX_HOPS=2 limit makes this a very low risk in practice.

#### P2-02: `DEFAULT_MAX_TYPED_DEGREE` name mismatch vs. spec
**File:** `lib/search/graph-search-fn.ts`, line 33
**Description:** Spec requires `MAX_TYPED_DEGREE=15` to be enforced. The constant is named `DEFAULT_MAX_TYPED_DEGREE` and serves as a fallback floor, not a ceiling. This can cause confusion between spec terminology and implementation semantics. The actual per-node cap is `MAX_TOTAL_DEGREE=50`.
**Fix:** Add a comment clarifying that `DEFAULT_MAX_TYPED_DEGREE` is the normalization fallback, not an individual node cap, and that `MAX_TOTAL_DEGREE=50` is the hub cap.

#### P2-03: `storeCommunityAssignments` algorithm label logic is inverted
**File:** `lib/graph/community-detection.ts`, lines 378–379
**Description:**
```typescript
const algorithm = computedThisSession && lastEdgeCount >= 0 ? "bfs+louvain" : "bfs";
```
This always labels stored assignments as `"bfs+louvain"` when `computedThisSession` is true, regardless of whether Louvain was actually used. The Louvain escalation is conditional (only when largest component > 50%), but the algorithm label doesn't track which path was taken.
**Fix:** Thread a flag (e.g., `louvainUsed: boolean`) from `detectCommunities()` into `storeCommunityAssignments()`.

#### P2-04: `co-activation.ts` getRelatedMemories makes N individual DB queries
**File:** `lib/cognitive/co-activation.ts`, lines 140–156
**Description:** For each entry in `related`, a separate `SELECT ... WHERE id = ?` is issued (loop on line 140). This is an N+1 pattern — a batch `WHERE id IN (...)` query would be more efficient.
**Impact:** Low at current scale (maxRelated=5 limit), but notable pattern.

---

## Security Assessment

All SQL queries across the reviewed files use parameterized statements (prepare + run/get/all with bound parameters). No raw string interpolation of user input was found in query paths. The `sanitizeFTS5Query()` call in `graph-search-fn.ts` line 127 further protects the FTS5 MATCH clause.

The `normalizeIds()` function in `causal-boost.ts` (lines 81–89) explicitly validates and truncates IDs to integers before building SQL placeholders, providing defense-in-depth.

The LIKE-fallback in `queryCausalEdgesLikeFallback()` (lines 187–246) escapes `%` and `_` with `ESCAPE '\\'` — correct.

Security verdict: **PASS** — no SQL injection vulnerabilities found.

---

## Type Narrowing Assessment

All `better-sqlite3` query results are cast via explicit TypeScript `as` assertions on typed interfaces (`CausalEdgeRow`, `{ cnt: number }`, `{ degree: number }`, etc.). While `as` casts are not runtime type guards, this is the standard pattern for better-sqlite3 in TypeScript. No raw `any` usage found in query result handling across reviewed files.

Type narrowing verdict: **PASS** — within acceptable patterns for this codebase.

---

## Constants Summary

| Constant | File | Value | Status |
|---|---|---|---|
| `MAX_TOTAL_DEGREE` | graph-search-fn.ts:36 | 50 | PASS — enforced in computeTypedDegree() |
| `DEFAULT_MAX_TYPED_DEGREE` | graph-search-fn.ts:33 | 15 | PASS — fallback, not a cap |
| `DEGREE_BOOST_CAP` | graph-search-fn.ts:39 | 0.15 | PASS |
| `MAX_HOPS` (causal boost) | causal-boost.ts:13 | 2 | PASS |
| `MAX_COMBINED_BOOST` | causal-boost.ts:17 | 0.20 | PASS |
| `MODERATE_THRESHOLD` | edge-density.ts:49 | 0.5 | PASS |
| `DEFAULT_COACTIVATION_STRENGTH` | co-activation.ts:16 | 0.25 | INTENTIONAL DEVIATION from spec 0.2 — documented |
| `MAX_ITERATIONS` (Louvain) | community-detection.ts:199 | 10 | PASS |

---

## Positive Highlights

- **Layered error handling:** Every DB query across all modules is wrapped in try/catch with console.warn fallbacks. Graph operations never throw to callers.
- **SQL parameterization:** Consistent use of prepared statements throughout — no injection risks found.
- **Cycle-safe BFS:** `computeCausalDepthScores()` uses `depthMap.has()` as a visited guard, correctly handling cyclic graphs.
- **Constitutional memory exclusion:** Feature 16 correctly skips degree boosting for constitutional-tier memories via a batch lookup.
- **Fan-effect sqrt guard:** `Math.max(1, relatedCount)` in co-activation.ts prevents sqrt(0) and ensures the divisor is never zero.
- **Schema migrations:** `degree_snapshots` and `weight_history` tables are created in versioned migrations (v18/v19) with appropriate indexes and UNIQUE constraints.
- **Stage 2 signal ordering:** `stage2-fusion.ts` clearly documents and enforces the signal application order, with the G2 double-weighting guard for non-hybrid search types.
- **Debounce on community detection:** Prevents expensive Louvain recomputation when the graph is unchanged.

---

## Recommendation

**CONDITIONAL PASS** — The implementation is solid overall with no critical security or data-correctness issues. Two issues require attention before relying on the graph pipeline in production:

1. **P1-01 (community detection debounce/persistence race)** must be resolved to ensure `applyCommunityBoost` actually injects co-members in pipeline execution.
2. **P1-02 (N sequential degree queries)** should be addressed to prevent latency regressions on graphs larger than ~200 nodes.

P2 suggestions are non-blocking improvements.

---

## Confidence

**HIGH** — All files read directly, all cited code locations verified, security review performed on all DB query paths, no findings are speculative.
