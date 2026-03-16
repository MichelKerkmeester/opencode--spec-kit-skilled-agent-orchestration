---
title: "Tasks: graph-signal-activation [template:level_2/tasks.md]"
description: "Graph-signal audit backlog fully closed: all 11 items remediated or verified with current evidence"
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
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
| P0 | 4 | 4 closed |
| P1 | 5 | 5 closed |
| P2 | 2 | 2 closed |
| **Total** | **11** | **11** items reconciled to verified implementation evidence |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Remediated In Task #2

- [x] T001 Make `touchEdgeAccess()` failure behavior observable (`mcp_server/lib/storage/causal-edges.ts`)
  - **Priority:** P0 | **Feature:** F-04 Weight history audit tracking
  - **Evidence:** Task #2 updated `causal-edges.ts` and `causal-edges.vitest.ts` so write failures are surfaced and regression-covered.
- [x] T002 Make `weight_history` ordering and rollback deterministic (`mcp_server/lib/storage/causal-edges.ts`, `mcp_server/tests/causal-edges.vitest.ts`)
  - **Priority:** P0 | **Feature:** F-04 Weight history audit tracking
  - **Evidence:** Task #2 implemented deterministic ordering and rollback behavior, then verified it with targeted DB assertions.
- [x] T005 Add fail-closed constitutional lookup throw-path coverage (`mcp_server/tests/degree-computation.vitest.ts`)
  - **Priority:** P1 | **Feature:** F-01 Typed-weighted degree channel
  - **Evidence:** Task #2 added explicit coverage for lookup-failure handling so constitutional exclusion remains fail-closed.
- [x] T006 Add explicit co-activation env clamp coverage (`mcp_server/tests/co-activation.vitest.ts`)
  - **Priority:** P1 | **Feature:** F-02 Co-activation boost strength increase
  - **Evidence:** Task #2 verified clamp behavior for values `>1`, `<0`, and non-numeric inputs.
- [x] T008 Add causal-boost seed-cap and relation-precedence coverage (`mcp_server/tests/causal-boost.vitest.ts`)
  - **Priority:** P1 | **Feature:** F-10 Causal neighbor boost and injection
  - **Evidence:** Task #2 added behavioral coverage for seed-cap handling and relation precedence, and the strengthened `causal-boost.vitest.ts` regression now passes (`6/6` tests in that file).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Backlog Closed In Completion Pass

- [x] T003 Fix missing-snapshot momentum to return zero (`mcp_server/lib/graph/graph-signals.ts`)
  - **Priority:** P0 | **Feature:** F-05 Graph momentum scoring
  - **Evidence:** `computeMomentum()` returns `0` when no 7-day snapshot exists and regression coverage confirms this path.
- [x] T004 Invalidate graph-signals cache on causal-edge mutation (`mcp_server/lib/storage/causal-edges.ts`)
  - **Priority:** P0 | **Feature:** F-05 Graph momentum scoring
  - **Evidence:** `invalidateDegreeCache()` now clears both degree and graph-signals caches, and hook wiring tests verify mutation-triggered graph cache invalidation.
- [x] T007 Align edge-density docs with global denominator semantics (`mcp_server/lib/eval/edge-density.ts`)
  - **Priority:** P1 | **Feature:** F-03 Edge density measurement
  - **Evidence:** Runtime denominator semantics are documented as `edge_count / total_memories` (with node fallback) and aligned in graph feature docs/playbook text.
- [x] T009 Enforce `MAX_WINDOW` clamping in temporal contiguity (`mcp_server/lib/cognitive/temporal-contiguity.ts`)
  - **Priority:** P1 | **Feature:** F-11 Temporal contiguity layer
  - **Evidence:** `vectorSearchWithContiguity()` and `getTemporalNeighbors()` clamp windows to valid bounds and new targeted tests cover min/max clamp behavior.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Documentation And Test Backlog

- [x] T010 Update graph/cognitive fixes feature source and test traceability (`.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md`)
  - **Priority:** P2 | **Feature:** F-08 Graph and cognitive memory fixes
  - **Evidence:** F-08 current-reality narrative now matches live handler behavior for the double-decay fix scope.
- [x] T011 Add negative ANCHOR parsing test (`mcp_server/tests/*anchor*`)
  - **Priority:** P2 | **Feature:** F-09 ANCHOR tags as graph nodes
  - **Evidence:** Existing `anchor-metadata.vitest.ts` and parser suites already include unmatched/unclosed/mismatched ANCHOR negative-path coverage.

### Verification Evidence

- [x] Targeted Vitest closure suite passed: `6` files / `185` tests.
- [x] Alignment drift verifier passed: `0` findings.
- [x] `npx tsc --noEmit` passes in `.opencode/skill/system-spec-kit/mcp_server` (revalidated 2026-03-12).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Full 11-item audit backlog complete
- [x] No `[B]` blocked tasks remaining
- [x] Task closure claims match the verified implementation evidence
- [x] Targeted verification passed for the remediated items
- [x] `mcp_server` TypeScript verification clean (`npx tsc --noEmit`)
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
