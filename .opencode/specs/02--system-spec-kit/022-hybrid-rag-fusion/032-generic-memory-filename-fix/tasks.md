---
title: "Tasks: Generic Memory Filename Fix in Stateless Mode"
description: "Task Format: T### [P?] Description (file path)"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Generic Memory Filename Fix in Stateless Mode
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[ ]` | Pending |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Implementation

- [x] T001 Keep stateless enrichment flow in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`
- [x] T002 Add explicit stateless-only enrichment guard in `.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts`
- [x] T003 Align generic task detection in `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts`
- [x] T004 Add explicit `Implementation and updates` generic coverage via slug classification
- [x] T005 Keep `generateContentSlug()` and `buildMemoryTitle()` consumers using `enrichedTask`
- [x] T006 Verify `IMPL_TASK` remains original `implSummary.task` (no template honesty regression)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Build & Verify

- [x] T007 `npx tsc --noEmit` passes (0 errors)
- [x] T008 `npm run build` succeeds
- [x] T009 Add regression tests in `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts`
- [x] T010 `npm run test:task-enrichment` passes (from `.opencode/skill/system-spec-kit`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks completed
- [x] REQ-004 satisfied: enrichment is blocked in JSON mode and allowed only for stateless generic tasks
- [x] Stateless mode produces descriptive filenames from spec.md title for generic task labels
- [x] Regression coverage exists for JSON-vs-stateless behavior and slug outcomes
<!-- /ANCHOR:completion -->
