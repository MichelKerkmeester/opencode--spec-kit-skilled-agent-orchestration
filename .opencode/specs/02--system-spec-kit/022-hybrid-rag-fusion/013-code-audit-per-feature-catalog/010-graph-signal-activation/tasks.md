---
title: "Tasks: graph-signal-activation [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "graph signal activation tasks"
  - "typed weighted degree"
  - "co-activation boost"
  - "edge density"
  - "graph momentum"
  - "causal depth"
  - "community detection"
  - "anchor tags"
  - "causal neighbor boost"
  - "temporal contiguity"
importance_tier: "normal"
contextType: "general"
---
# Tasks: graph-signal-activation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

### Priority Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | 4 | FAIL-status correctness bugs and behavior mismatches |
| P1 | 5 | WARN-status behavior mismatches and significant code issues |
| P2 | 2 | WARN-status documentation/test gaps only |
| **Total** | **11** | Remediation backlog from feature audit |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Wire `touchEdgeAccess` into read/traversal paths (`mcp_server/lib/storage/causal-edges.ts`)
  - **Priority:** P0 | **Feature:** F-04 Weight history audit tracking
  - **Issue:** `last_accessed` updater exists but is not wired into read/traversal paths; silent catch hides failures.
  - **Fix:** Call `touchEdgeAccess` from read/traversal operations and surface write failures via telemetry.
- [ ] T002 Replace placeholder causal-edge tests with real DB assertions (`mcp_server/tests/causal-edges.vitest.ts`)
  - **Priority:** P0 | **Feature:** F-04 Weight history audit tracking
  - **Issue:** Placeholder `expect(true)` patterns leave rollback/audit/access tracking unverified.
  - **Fix:** Add concrete assertions including same-millisecond rollback fallback-to-oldest behavior.
- [ ] T003 Fix missing-snapshot momentum to return zero (`mcp_server/lib/graph/graph-signals.ts`)
  - **Priority:** P0 | **Feature:** F-05 Graph momentum scoring
  - **Issue:** Missing 7-day snapshot currently yields positive momentum (`current - 0`) rather than zero.
  - **Fix:** Treat missing historical snapshot as zero momentum and update affected tests.
- [ ] T004 Invalidate graph-signals cache on causal-edge mutation (`mcp_server/lib/storage/causal-edges.ts`)
  - **Priority:** P0 | **Feature:** F-05 Graph momentum scoring
  - **Issue:** Mutation paths clear degree cache but not graph-signals cache, allowing stale momentum.
  - **Fix:** Add `clearGraphSignalsCache()` on mutation paths and validate with regression tests.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Fail closed for constitutional exclusion on lookup failure (`mcp_server/lib/search/graph-search-fn.ts`)
  - **Priority:** P1 | **Feature:** F-01 Typed-weighted degree channel
  - **Issue:** Constitutional exclusion can be bypassed if `memory_index` lookup throws.
  - **Fix:** Assign score 0 for constitutional IDs on lookup failure and emit structured warning.
- [ ] T006 Clamp co-activation strength override to documented safe band (`mcp_server/lib/cognitive/co-activation.ts`)
  - **Priority:** P1 | **Feature:** F-02 Co-activation boost strength increase
  - **Issue:** `SPECKIT_COACTIVATION_STRENGTH` accepts unbounded finite values.
  - **Fix:** Clamp override range or update documentation; add contribution-isolation test.
- [ ] T007 Align edge-density docs with global denominator semantics (`mcp_server/lib/eval/edge-density.ts`)
  - **Priority:** P1 | **Feature:** F-03 Edge density measurement
  - **Issue:** Type/interface comments describe edges-per-node while runtime uses total-memories denominator.
  - **Fix:** Update docs/comments and add integration test for density guard behavior.
- [ ] T008 Align causal-boost relation multipliers with documented taxonomy (`mcp_server/lib/search/causal-boost.ts`)
  - **Priority:** P1 | **Feature:** F-10 Causal neighbor boost and injection
  - **Issue:** Relation hierarchy text diverges from implemented relation labels/weights.
  - **Fix:** Align implementation or docs and add tests for seed-cap + precedence behavior.
- [ ] T009 Enforce `MAX_WINDOW` clamping in temporal contiguity (`mcp_server/lib/cognitive/temporal-contiguity.ts`)
  - **Priority:** P1 | **Feature:** F-11 Temporal contiguity layer
  - **Issue:** `MAX_WINDOW` exists but callers can pass values over 24h.
  - **Fix:** Clamp incoming windows to `[1, MAX_WINDOW]` and align naming/docs for exported API.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Update graph/cognitive fixes feature source and test traceability (`feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md`)
  - **Priority:** P2 | **Feature:** F-08 Graph and cognitive memory fixes
  - **Issue:** Claimed fix coverage does not fully match listed implementation files; wildcard export pattern remains.
  - **Fix:** Correct source/test mapping, add focused regression suite, replace wildcard export with explicit exports.
- [ ] T011 Add negative ANCHOR parsing test (`mcp_server/tests/*anchor*`)
  - **Priority:** P2 | **Feature:** F-09 ANCHOR tags as graph nodes
  - **Issue:** No explicit negative test ensures ANCHOR parsing is metadata-only and never mutates `causal_edges`.
  - **Fix:** Add integration test asserting no graph node/edge mutation occurs during ANCHOR parsing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
