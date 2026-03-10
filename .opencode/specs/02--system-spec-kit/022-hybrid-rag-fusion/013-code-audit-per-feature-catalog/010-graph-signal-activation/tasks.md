# Tasks — 010 Graph Signal Activation

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0       | 4     | FAIL-status correctness bugs and behavior mismatches |
| P1       | 5     | WARN-status behavior mismatches and significant code issues |
| P2       | 2     | WARN-status documentation/test gaps only |
| **Total**| **11**|  |

---

## P0 — FAIL (Immediate Fix Required)

### T-01: Wire touchEdgeAccess into read/traversal paths
- **Priority:** P0
- **Feature:** F-04 Weight history audit tracking
- **Status:** TODO
- **Source:** `mcp_server/lib/storage/causal-edges.ts:750-758`
- **Issue:** `last_accessed` tracking is effectively inactive: updater function exists but has no in-repo call sites, so access timestamps are not automatically maintained. Current Reality claims edge usage tracking via `last_accessed` but the function is never called from read/traversal operations. Silent best-effort catch in `touchEdgeAccess` also hides write failures.
- **Fix:** Call `touchEdgeAccess` from edge read/traversal paths. Surface `touchEdgeAccess` failures via telemetry instead of silent catch.

### T-02: Replace placeholder causal-edges tests with real assertions
- **Priority:** P0
- **Feature:** F-04 Weight history audit tracking
- **Status:** TODO
- **Source:** `mcp_server/tests/causal-edges.vitest.ts:15-53, 73-107, 141-220`
- **Issue:** `causal-edges.vitest.ts` is largely placeholder (`expect(true)`) with tautological assertions, so critical audit, rollback, and access tracking behaviors are not tested. No listed test asserts same-millisecond rollback fallback-to-oldest behavior.
- **Fix:** Replace placeholder tests with real DB assertions for audit, rollback, and access tracking. Add test for same-millisecond rollback fallback-to-oldest behavior.

### T-03: Fix missing-snapshot momentum to return zero
- **Priority:** P0
- **Feature:** F-05 Graph momentum scoring
- **Status:** TODO
- **Source:** `mcp_server/lib/graph/graph-signals.ts:129-137, 150-154`
- **Issue:** Missing 7-day snapshot yields positive momentum (`current - 0`) rather than 0, contradicting Current Reality statement that no 7-day snapshot should default momentum to zero. Tests currently encode the mismatched behavior.
- **Fix:** Treat missing historical snapshot as zero-momentum condition. Update tests at `graph-signals.vitest.ts:218-227, 244-250` to enforce corrected semantics.

### T-04: Invalidate graph-signals cache on causal-edge mutations
- **Priority:** P0
- **Feature:** F-05 Graph momentum scoring
- **Status:** TODO
- **Source:** `mcp_server/lib/storage/causal-edges.ts:202-205, 474-476, 493-495`, `mcp_server/lib/graph/graph-signals.ts:42-45`
- **Issue:** Edge mutation paths clear degree cache but not graph-signals cache, leading to stale momentum values after graph changes. No listed test verifies cache invalidation on causal-edge mutation.
- **Fix:** Add `clearGraphSignalsCache()` call to causal-edge mutation paths alongside existing degree cache clears. Add test for cache invalidation on mutation.

---

## P1 — WARN with Behavior Mismatch or Significant Code Issues

### T-05: Fail closed for constitutional exclusion on lookup failure
- **Priority:** P1
- **Feature:** F-01 Typed-weighted degree channel
- **Status:** TODO
- **Source:** `mcp_server/lib/search/graph-search-fn.ts:378-390`
- **Issue:** Constitutional exclusion is bypassed on lookup failure; `computeDegreeScores` silently proceeds without exclusion when the `memory_index` query throws. Constitutional memories are not strictly guaranteed to stay excluded under DB/read failure conditions.
- **Fix:** Fail closed for constitutional IDs when lookup fails (assign score 0) and emit structured warning. Add regression test for `memory_index` failure path.

### T-06: Clamp co-activation strength env override
- **Priority:** P1
- **Feature:** F-02 Co-activation boost strength increase
- **Status:** TODO
- **Source:** `mcp_server/lib/cognitive/co-activation.ts:20-25`
- **Issue:** `SPECKIT_COACTIVATION_STRENGTH` accepts any finite value with no upper bound, despite documented 0.25-0.3 operating band. Dark-run measurement workflow (R4-only vs R4+A7 isolation) is described but not implemented in this module.
- **Fix:** Clamp env override to a documented safe range or update docs to reflect unbounded support. Add integration test comparing with/without co-activation contribution isolation.

### T-07: Align edge-density docs with global denominator semantics
- **Priority:** P1
- **Feature:** F-03 Edge density measurement
- **Status:** TODO
- **Source:** `mcp_server/lib/eval/edge-density.ts:36-39, 94-97`
- **Issue:** Type/interface docs still describe density as edges-per-node while runtime uses total-memories denominator (with fallback). Listed tests cover `measureEdgeDensity` but not runtime density-guard behavior in entity-linking.
- **Fix:** Align edge-density docs/comments to global denominator semantics. Add integration test for density guard in entity-linking at `entity-linker.ts:295-303, 359-363`.

### T-08: Align causal-boost relation multipliers with documented taxonomy
- **Priority:** P1
- **Feature:** F-10 Causal neighbor boost and injection
- **Status:** TODO
- **Source:** `mcp_server/lib/search/causal-boost.ts:29-36, 122-147`
- **Issue:** Relation multiplier implementation does not include `leads_to`/`relates_to` terms from Current Reality wording. Current Reality relation hierarchy text diverges from implemented relation taxonomy. Tests do not cover explicit 25% seed-cap behavior or relation-weight precedence.
- **Fix:** Align feature text with implemented relations or add support for documented relation labels. Add tests for seed-limit and relation multiplier precedence.

### T-09: Enforce MAX_WINDOW clamping in temporal contiguity
- **Priority:** P1
- **Feature:** F-11 Temporal contiguity layer
- **Status:** TODO
- **Source:** `mcp_server/lib/cognitive/temporal-contiguity.ts:14-16, 55, 105`
- **Issue:** `MAX_WINDOW` is declared but not enforced; callers can pass windows above 24h. Current Reality names `queryTemporalNeighbors`/`buildSpecFolderTimeline` while implementation exports `getTemporalNeighbors`/`buildTimeline`.
- **Fix:** Clamp incoming windows to `[1, MAX_WINDOW]`. Add aliases or update docs to match exported API names. Add tests for max-window enforcement.

---

## P2 — WARN with Documentation/Test Gaps Only

### T-10: Update graph/cognitive fixes feature source/test mapping
- **Priority:** P2
- **Feature:** F-08 Graph and cognitive memory fixes
- **Status:** TODO
- **Source:** `.../08-graph-and-cognitive-memory-fixes.md`
- **Issue:** Feature traceability is weak: several claimed fixes are in files outside the listed Implementation table (notably `causal-edges.ts`, `causal-graph.ts`, `memory-bulk-delete.ts`). Wildcard barrel export in `folder-scoring.ts:7` conflicts with explicit-export preference. Co-activation cache clearing after bulk delete is indirect via mutation hooks rather than direct handler call.
- **Fix:** Update feature source/test mapping to include true implementation files. Add targeted regression suite for fixes #24/#25/#27/#28/#29/#30/#32. Replace wildcard re-export with explicit exports.

### T-11: Add negative ANCHOR parsing test
- **Priority:** P2
- **Feature:** F-09 ANCHOR tags as graph nodes
- **Status:** TODO
- **Source:** (no existing negative test)
- **Issue:** No explicit negative test confirms ANCHOR parsing never mutates graph edges/nodes. Feature is PASS status but has this minor test coverage gap.
- **Fix:** Add negative integration test asserting ANCHOR parsing remains metadata-only (no `causal_edges` mutation).
