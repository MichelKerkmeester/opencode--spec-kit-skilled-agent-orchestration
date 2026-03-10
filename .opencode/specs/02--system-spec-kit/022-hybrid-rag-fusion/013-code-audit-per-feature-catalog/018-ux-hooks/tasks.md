---
title: "Tasks: ux-hooks [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "ux hooks tasks"
  - "audit backlog"
  - "mutation hooks"
  - "feature catalog"
  - "verification tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: ux-hooks

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

- [x] T001 Inventory UX Hooks feature set and source files (`feature_catalog/18--ux-hooks/`)
- [x] T002 Define audit criteria and acceptance targets (`spec.md`)
- [x] T003 [P] Establish priority allocation and tracking model (`tasks.md`)
- [x] Priority baseline preserved: **P0=2, P1=8, P2=7 (17 total findings/tasks)**
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] [P0] Fix aggregate repair reporting for mixed outcomes (`mcp_server/handlers/memory-crud-health.ts`)
- [ ] T005 [P] [P0] Make `CheckpointDeleteArgs.confirmName` required across all layers (`mcp_server/handlers/checkpoints.ts`, `mcp_server/tools/types.ts`)
- [ ] T006 [P] [P1] Add warning-level logging to mutation hook catch blocks (`mcp_server/handlers/mutation-hooks.ts`)
- [ ] T007 [P] [P1] Add integration test for hook wiring across save/update/delete/bulk-delete/atomic-save (`mcp_server/tests`)
- [ ] T008 [P] [P1] Add mixed-outcome autoRepair regression test and align catalog references (`mcp_server/tests/memory-crud-extended.vitest.ts`, `feature_catalog/18--ux-hooks/02-memory-health-autorepair-metadata.md`)
- [ ] T009 [P] [P1] Include deletion metadata in checkpoint delete success response and tests (`mcp_server/handlers/checkpoints.ts`, `mcp_server/tests/handler-checkpoints.vitest.ts`)
- [ ] T010 [P] [P1] Replace wildcard exports in hooks barrel with explicit named exports (`mcp_server/hooks/index.ts`)
- [ ] T011 [P] [P1] Preserve diagnosable hook failure details and assert expanded postMutationHooks fields (`mcp_server/handlers/mutation-hooks.ts`, `mcp_server/tests`)
- [ ] T012 [P] [P1] Add observable warning logs and parse-failure regression coverage for hint append (`mcp_server/hooks/response-hints.ts`, `mcp_server/tests/context-server.vitest.ts`)
- [ ] T013 [P] [P1] Enforce hooks README/export alignment with regression test and stale-reference cleanup (`mcp_server/hooks/README.md`, `mcp_server/hooks/index.ts`)
- [ ] T014 [P] [P2] Add explicit mutation response UX payload contract tests and update feature table (`mcp_server/tests/memory-save-ux-regressions.vitest.ts`, `feature_catalog/18--ux-hooks/07-mutation-response-ux-payload-exposure.md`)
- [ ] T015 [P] [P2] Add atomic duplicate no-op regression assertion (`mcp_server/tests/memory-save-ux-regressions.vitest.ts`)
- [ ] T016 [P] [P2] Add partial-indexing hint branch test for atomic save (`mcp_server/handlers/memory-save.ts`, `mcp_server/tests`)
- [ ] T017 [P] [P2] Add tests section to final token metadata recomputation feature doc (`feature_catalog/18--ux-hooks/11-final-token-metadata-recomputation.md`)
- [ ] T018 [P] [P2] Add end-to-end success-envelope mapping to feature test table (`feature_catalog/18--ux-hooks/13-end-to-end-success-envelope-verification.md`)
- [ ] T019 [P] [P2] Add handler-level expanded contract assertions for mutation hook result expansion (`mcp_server/tests`)
- [ ] T020 [P] [P2] Add parse-failure telemetry assertion for success-path hint append (`mcp_server/tests/context-server.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Validate all 13 feature findings retain `PASS/WARN/FAIL` status and mapped fixes (`checklist.md`)
- [ ] T022 Validate task priority totals and cross-references with `spec.md` and `plan.md`
- [ ] T023 Update final documentation alignment and markdown integrity (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`)
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
