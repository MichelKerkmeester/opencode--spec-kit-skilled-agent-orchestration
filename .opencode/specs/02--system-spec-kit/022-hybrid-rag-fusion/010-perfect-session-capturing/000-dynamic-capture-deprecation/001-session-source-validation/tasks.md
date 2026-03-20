---
title: "Tasks: Session Source Validation [template:level_2/tasks.md]"
---
# Tasks: Session Source Validation

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

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
## 2. PHASE 1: SETUP

- [x] T001 Review the shipped native capture seams (`scripts/extractors/claude-code-capture.ts`, related loaders and workflow code)
- [x] T002 Review the quality and divergence seams that consume the session-source data (`quality-scorer`, `collect-session-data`, render path)
- [x] T003 Review the focused proof files for this phase (`claude-code-capture.vitest.ts`, `quality-scorer-calibration.vitest.ts`, `task-enrichment.vitest.ts`, `memory-render-fixture.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] T004 Rewrite the phase docs around the shipped session-source behavior (`spec.md`, `plan.md`)
- [x] T005 Replace placeholder task and checklist language with current evidence-backed completion (`tasks.md`, `checklist.md`)
- [x] T006 Replace the placeholder implementation summary with the shipped provenance, file-count, and validation narrative (`implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T007 Run the focused four-file session-source proof lane (`claude-code-capture.vitest.ts`, `task-enrichment.vitest.ts`, `memory-render-fixture.vitest.ts`, `quality-scorer-calibration.vitest.ts`)
- [x] T008 Run the memory-quality lane that proves the same quality and divergence surface (`node test-memory-quality-lane.js`)
- [x] T009 Verify strict phase validation/completion after memory-save closeout
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
