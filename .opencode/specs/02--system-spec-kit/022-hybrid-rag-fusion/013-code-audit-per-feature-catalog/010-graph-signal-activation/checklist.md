## F-01: Typed-weighted degree channel
- **Status:** WARN
- **Code Issues:** 1. Constitutional exclusion is bypassed on lookup failure; `computeDegreeScores` silently proceeds without exclusion when the `memory_index` query throws (`mcp_server/lib/search/graph-search-fn.ts:378-390`).
- **Standards Violations:** 1. Silent catch with no surfaced error in constitutional exclusion path (`mcp_server/lib/search/graph-search-fn.ts:388-390`).
- **Behavior Mismatch:** Constitutional memories are not strictly guaranteed to stay excluded under DB/read failure conditions.
- **Test Gaps:** 1. No failure-path test for constitutional exclusion query errors; only happy-path constitutional assertions are covered (`mcp_server/tests/degree-computation.vitest.ts:197-209`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Fail closed for constitutional IDs when lookup fails (score 0) and emit structured warning. 2. Add regression test for `memory_index` failure path.

## F-02: Co-activation boost strength increase
- **Status:** WARN
- **Code Issues:** 1. `SPECKIT_COACTIVATION_STRENGTH` accepts any finite value with no upper bound, despite documented 0.25-0.3 operating band (`mcp_server/lib/cognitive/co-activation.ts:20-25`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** Dark-run measurement workflow (R4-only vs R4+A7 isolation) is described but not implemented in this module; only boost computation primitives are present (`mcp_server/lib/cognitive/co-activation.ts:86-100`).
- **Test Gaps:** 1. Tests validate default/config math but not dark-run contribution isolation (`mcp_server/tests/co-activation.vitest.ts:41-265`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Clamp env override to a documented safe range or update docs to reflect unbounded support. 2. Add integration test comparing with/without co-activation.

## F-03: Edge density measurement
- **Status:** WARN
- **Code Issues:** 1. Type/interface docs still describe density as edges-per-node while runtime uses total-memories denominator (with fallback) (`mcp_server/lib/eval/edge-density.ts:36-39`, `mcp_server/lib/eval/edge-density.ts:94-97`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. Listed tests cover `measureEdgeDensity`, but not runtime density-guard behavior in entity-linking (`mcp_server/tests/edge-density.vitest.ts:95-422`; guard path in `mcp_server/lib/search/entity-linker.ts:295-303`, `mcp_server/lib/search/entity-linker.ts:359-363`).
- **Playbook Coverage:** NEW-060 (partial); otherwise MISSING
- **Recommended Fixes:** 1. Align edge-density docs/comments to global denominator semantics. 2. Add integration test for density guard in entity-linking.

## F-04: Weight history audit tracking
- **Status:** FAIL
- **Code Issues:** 1. `last_accessed` tracking is effectively inactive: updater exists but has no in-repo call sites, so access timestamps are not automatically maintained (`mcp_server/lib/storage/causal-edges.ts:750-758`). 2. Rollback/audit behavior is complex but under-verified in listed tests (`mcp_server/lib/storage/causal-edges.ts:678-727`).
- **Standards Violations:** 1. Silent best-effort catch in `touchEdgeAccess` hides write failures (`mcp_server/lib/storage/causal-edges.ts:756-758`).
- **Behavior Mismatch:** Current Reality claims edge usage tracking via `last_accessed`; implementation exposes the function but does not wire it into read/traversal operations.
- **Test Gaps:** 1. `causal-edges.vitest.ts` is largely placeholder (`expect(true)`), so critical behaviors are not asserted (`mcp_server/tests/causal-edges.vitest.ts:15-53`, `mcp_server/tests/causal-edges.vitest.ts:73-107`, `mcp_server/tests/causal-edges.vitest.ts:141-220`). 2. No listed test asserts same-millisecond rollback fallback-to-oldest behavior.
- **Playbook Coverage:** NEW-058 (partial); otherwise MISSING
- **Recommended Fixes:** 1. Call `touchEdgeAccess` from edge read/traversal paths. 2. Replace placeholder tests with real DB assertions for audit, rollback, and access tracking. 3. Surface `touchEdgeAccess` failures via telemetry.

## F-05: Graph momentum scoring
- **Status:** FAIL
- **Code Issues:** 1. Missing 7-day snapshot yields positive momentum (`current - 0`) rather than 0 (`mcp_server/lib/graph/graph-signals.ts:129-137`, `mcp_server/lib/graph/graph-signals.ts:150-154`). 2. Edge mutation paths clear degree cache but not graph-signals cache (`mcp_server/lib/storage/causal-edges.ts:202-205`, `mcp_server/lib/storage/causal-edges.ts:474-476`, `mcp_server/lib/storage/causal-edges.ts:493-495`; `clearGraphSignalsCache` in `mcp_server/lib/graph/graph-signals.ts:42-45`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** Contradicts Current Reality statement that no 7-day snapshot should default momentum to zero.
- **Test Gaps:** 1. Tests currently encode the mismatched behavior (`mcp_server/tests/graph-signals.vitest.ts:218-227`, `mcp_server/tests/graph-signals.vitest.ts:244-250`). 2. No listed test verifies cache invalidation on causal-edge mutation.
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Treat missing historical snapshot as zero-momentum condition. 2. Invalidate graph-signals cache on causal-edge mutations. 3. Update tests to enforce corrected semantics.

## F-06: Causal depth signal
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** NONE

## F-07: Community detection
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** NONE

## F-08: Graph and cognitive memory fixes
- **Status:** WARN
- **Code Issues:** 1. Feature traceability is weak: several claimed fixes are implemented in files outside the listed Implementation table (notably `mcp_server/lib/storage/causal-edges.ts`, `mcp_server/handlers/causal-graph.ts`, `mcp_server/handlers/memory-bulk-delete.ts`).
- **Standards Violations:** 1. Wildcard barrel export in scoring shim (`mcp_server/lib/scoring/folder-scoring.ts:7`) conflicts with explicit-export preference.
- **Behavior Mismatch:** 1. Co-activation cache clearing after bulk delete is indirect via mutation hooks (`mcp_server/handlers/memory-bulk-delete.ts:211`, `mcp_server/handlers/mutation-hooks.ts:54`) rather than a direct bulk-delete handler call.
- **Test Gaps:** 1. Listed tests are broad but do not form a focused regression suite covering all seven named fixes end-to-end.
- **Playbook Coverage:** NEW-058 (partial); otherwise MISSING
- **Recommended Fixes:** 1. Update feature source/test mapping to include true implementation files. 2. Add targeted regression suite for fixes #24/#25/#27/#28/#29/#30/#32. 3. Replace wildcard re-export with explicit exports.

## F-09: ANCHOR tags as graph nodes
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** 1. No explicit negative test confirms ANCHOR parsing never mutates graph edges/nodes.
- **Playbook Coverage:** NEW-052
- **Recommended Fixes:** 1. Add negative integration test asserting ANCHOR parsing remains metadata-only (no `causal_edges` mutation).

## F-10: Causal neighbor boost and injection
- **Status:** WARN
- **Code Issues:** 1. Relation multiplier implementation does not include `leads_to`/`relates_to` terms from Current Reality wording (`mcp_server/lib/search/causal-boost.ts:29-36`, `mcp_server/lib/search/causal-boost.ts:122-147`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** Current Reality relation hierarchy text diverges from implemented relation taxonomy.
- **Test Gaps:** 1. Tests cover traversal/injection basics but not explicit 25% seed-cap behavior or relation-weight precedence assertions (`mcp_server/tests/causal-boost.vitest.ts:75-117`, `mcp_server/tests/phase2-integration.vitest.ts:109-115`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Align feature text with implemented relations or add support for documented relation labels. 2. Add tests for seed-limit and relation multiplier precedence.

## F-11: Temporal contiguity layer
- **Status:** WARN
- **Code Issues:** 1. `MAX_WINDOW` is declared but not enforced; callers can pass windows above 24h (`mcp_server/lib/cognitive/temporal-contiguity.ts:14-16`, `mcp_server/lib/cognitive/temporal-contiguity.ts:55`, `mcp_server/lib/cognitive/temporal-contiguity.ts:105`).
- **Standards Violations:** NONE
- **Behavior Mismatch:** Current Reality names `queryTemporalNeighbors` / `buildSpecFolderTimeline`, while implementation exports `getTemporalNeighbors` / `buildTimeline` (`mcp_server/lib/cognitive/temporal-contiguity.ts:103`, `mcp_server/lib/cognitive/temporal-contiguity.ts:145`).
- **Test Gaps:** 1. Tests do not verify >24h window clamping or naming/alias compatibility (`mcp_server/tests/temporal-contiguity.vitest.ts:71-181`).
- **Playbook Coverage:** MISSING
- **Recommended Fixes:** 1. Clamp incoming windows to `[1, MAX_WINDOW]`. 2. Add aliases or update docs to match exported API names. 3. Add tests for max-window enforcement.
