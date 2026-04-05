---
title: "Tasks: Wire PromotionGate to Action"
description: "Task breakdown for wiring promotionGate result to tuneAdaptiveThresholdsAfterEvaluation"
trigger_phrases:
  - "promotion gate tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Wire PromotionGate to Action

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

**Task Format**: `T### [P0/P1] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Import `tuneAdaptiveThresholdsAfterEvaluation` and `getAdaptiveMode` into `mcp_server/lib/feedback/shadow-evaluation-runtime.ts`
- [x] T002 [P0] Add the guarded tuning call immediately after `runShadowEvaluation()` returns in the scheduler cycle
- [x] T003 [P0] Verify the evaluation result shape is compatible with the tuning function contract
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Add test: gate pass + adaptive enabled triggers tuning in `mcp_server/tests/shadow-evaluation-runtime.vitest.ts`
- [x] T005 [P0] Add test: gate fail skips tuning in `mcp_server/tests/shadow-evaluation-runtime.vitest.ts`
- [x] T006 [P0] Add test: adaptive disabled exits as a no-op in `mcp_server/tests/shadow-evaluation-runtime.vitest.ts`
- [x] T007 [P0] Keep the change local to runtime wiring and tests so the phase stays inside the planned 30-50 LOC scope
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Run the phase-specific shadow evaluation test paths and confirm pass/fail/no-op behavior
- [x] T009 [P0] Run the full Vitest suite for closure
- [x] T010 [P0] Run `npx tsc --noEmit` and confirm the phase remains type-safe
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks marked `[x]`
- [x] No `[B]` blocked tasks remain
- [x] Gate-pass, gate-fail, and adaptive-disabled paths are covered by tests
- [x] `npx tsc --noEmit` passes
- [x] Handoff criteria met: promotionGate results now drive adaptive tuning when the gate is ready
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Successor**: See `../002-persist-tuned-thresholds/spec.md`
<!-- /ANCHOR:cross-refs -->
