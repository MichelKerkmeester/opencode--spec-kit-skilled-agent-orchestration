---
title: "Tasks: analysis [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "analysis"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
# Tasks: analysis

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm Analysis feature inventory (feature_catalog/06--analysis) — 7 files (F-01 through F-07) confirmed
- [x] T002 Confirm citation paths for handlers/storage/tests (mcp_server/**) — causal-graph.ts, session-learning.ts, causal-edges.ts, errors.ts, 5 test files, 7 catalog files verified
- [x] T003 [P] Normalize audit terminology and status mapping (spec.md) — Level 2 template structure with PASS/WARN/FAIL status mapping confirmed
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Fix orphan-inflated causal coverage computation (handlers/causal-graph.ts) — SQL filtered to exclude orphaned IDs via EXISTS subquery; 75/75 unit tests pass
- [x] T005 [P0] Add orphan-edge coverage regression test (tests/causal-edges-unit.vitest.ts) — 4 tests (T005-R1, T005-R2, T005-HL1, T005-HL2) added; orphan detection and non-orphan verification
- [x] T006 [P0] Fix false-positive `max_depth_reached` flag (handlers/causal-graph.ts) — condition changed from `child.depth >= maxDepth - 1` to `child.depth >= maxDepth`; eliminates natural-leaf false positives
- [x] T007 [P0] Add natural-leaf vs truncated-chain tests (tests/causal-edges-unit.vitest.ts) — 2 tests (T007-NL1, T007-NL2) validating depth behavior
- [x] T008 [P1] Replace wildcard barrel exports in error modules (lib/errors.ts, lib/errors/index.ts) — `export *` replaced with named exports; tsc --noEmit clean
- [x] T009 [P1] Replace deferred causal-edge placeholder tests with DB-backed assertions (tests/causal-edges.vitest.ts) — all `expect(true).toBe(true)` stubs replaced; 77/77 tests pass with real DB
- [x] T010 [P1] Add DB-backed unlink workflow tests (tests/causal-edges.vitest.ts) — 4 tests (T010-U1 through T010-U4) for deleteEdge and deleteEdgesForMemory
- [x] T011 [P1] Add preflight overwrite-guard regression test (tests/handler-session-learning.vitest.ts) — T011-OG1 validates E030 or DB error path for completed records
- [x] T012 [P1] Add LI formula and interpretation band tests (tests/handler-session-learning.vitest.ts) — 10 tests (T012-LI1 through T012-LI10) covering formula weights, max/zero/negative LI, all 4 interpretation bands
- [x] T013 [P1] Add learning-history ordering and threshold tests (tests/learning-stats-filters.vitest.ts) — 5 tests (T013-O1 through T013-O5) for limit clamping, DESC ordering, default limit, summary interpretation; 11/11 pass
- [x] T014 [P1] Add causal-stats handler integration coverage (tests/integration-causal-graph.vitest.ts) — 3 tests (T014-CS1 through T014-CS3) for data structure, targetCoverage, and summary
- [x] T015 [P1] Add drift_why handler integration coverage (tests/integration-causal-graph.vitest.ts) — 5 tests (T015-DW1 through T015-DW5) for chain structure, maxDepth, direction, invalid relations, clamping
- [x] T016 [P2] Remove stale retry.vitest.ts reference for F-01 (feature_catalog/06--analysis/01-*.md) — line removed, grep confirms 0 matches
- [x] T017 [P2] Remove stale retry.vitest.ts reference for F-02 (feature_catalog/06--analysis/02-*.md) — line removed
- [x] T018 [P2] Remove stale retry.vitest.ts reference for F-03 (feature_catalog/06--analysis/03-*.md) — line removed
- [x] T019 [P2] Remove stale retry.vitest.ts reference for F-04 (feature_catalog/06--analysis/04-*.md) — line removed
- [x] T020 [P2] Remove stale retry.vitest.ts reference for F-05 (feature_catalog/06--analysis/05-*.md) — line removed
- [x] T021 [P2] Remove stale retry.vitest.ts reference for F-06 (feature_catalog/06--analysis/06-*.md) — line removed
- [x] T022 [P2] Remove stale retry.vitest.ts reference for F-07 (feature_catalog/06--analysis/07-*.md) — line removed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T023 Verify P0 findings are reproducible and fixed with evidence (spec.md, checklist.md) — 211 tests pass across 5 files; tsc --noEmit clean; dist rebuilt
- [x] T024 Verify P1/P2 deferrals are explicitly tracked with rationale (tasks.md) — all P1 and P2 tasks completed; integration tests run conditionally when DB is available
- [x] T025 Update cross-doc consistency and final verification totals (checklist.md) — all 20 checklist items verified with evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
