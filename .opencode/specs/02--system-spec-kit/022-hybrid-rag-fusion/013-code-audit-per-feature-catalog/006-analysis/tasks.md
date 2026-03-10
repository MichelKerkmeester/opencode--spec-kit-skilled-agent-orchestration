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

- [ ] T001 Confirm Analysis feature inventory (feature_catalog/06--analysis)
- [ ] T002 Confirm citation paths for handlers/storage/tests (mcp_server/**)
- [ ] T003 [P] Normalize audit terminology and status mapping (spec.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P0] Fix orphan-inflated causal coverage computation (handlers/causal-graph.ts)
- [ ] T005 [P0] Add orphan-edge coverage regression test (tests/causal-edges-unit.vitest.ts)
- [ ] T006 [P0] Fix false-positive `max_depth_reached` flag (handlers/causal-graph.ts)
- [ ] T007 [P0] Add natural-leaf vs truncated-chain tests (tests/handler-causal-graph.vitest.ts)
- [ ] T008 [P1] Replace wildcard barrel exports in error modules (lib/errors.ts, lib/errors/index.ts)
- [ ] T009 [P1] Replace deferred causal-edge placeholder tests with DB-backed assertions (tests/causal-edges.vitest.ts)
- [ ] T010 [P1] Add DB-backed unlink workflow tests (tests/causal-edges.vitest.ts)
- [ ] T011 [P1] Add preflight overwrite-guard regression test (tests/handler-session-learning.vitest.ts)
- [ ] T012 [P1] Add LI formula and interpretation band tests (tests/handler-session-learning.vitest.ts)
- [ ] T013 [P1] Add learning-history ordering and threshold tests (tests/learning-stats-filters.vitest.ts)
- [ ] T014 [P1] Add causal-stats handler integration coverage (tests/integration-causal-graph.vitest.ts)
- [ ] T015 [P1] Add drift_why handler integration coverage (tests/integration-causal-graph.vitest.ts)
- [ ] T016 [P2] Remove stale retry.vitest.ts reference for F-01 (feature_catalog/06--analysis/01-*.md)
- [ ] T017 [P2] Remove stale retry.vitest.ts reference for F-02 (feature_catalog/06--analysis/02-*.md)
- [ ] T018 [P2] Remove stale retry.vitest.ts reference for F-03 (feature_catalog/06--analysis/03-*.md)
- [ ] T019 [P2] Remove stale retry.vitest.ts reference for F-04 (feature_catalog/06--analysis/04-*.md)
- [ ] T020 [P2] Remove stale retry.vitest.ts reference for F-05 (feature_catalog/06--analysis/05-*.md)
- [ ] T021 [P2] Remove stale retry.vitest.ts reference for F-06 (feature_catalog/06--analysis/06-*.md)
- [ ] T022 [P2] Remove stale retry.vitest.ts reference for F-07 (feature_catalog/06--analysis/07-*.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T023 Verify P0 findings are reproducible and fixed with evidence (spec.md, checklist.md)
- [ ] T024 Verify P1/P2 deferrals are explicitly tracked with rationale (tasks.md)
- [ ] T025 Update cross-doc consistency and final verification totals (checklist.md)
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
