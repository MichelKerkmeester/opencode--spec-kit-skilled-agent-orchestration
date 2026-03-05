---
title: "Tasks: Foundation Package (Phase 0, 1, 1.5) [001-foundation-phases-0-1-1-5/tasks]"
description: "Tracking document synchronized with root execution state; remaining open items are human/ops-gated."
trigger_phrases:
  - "tasks"
  - "foundation"
  - "package"
  - "phase"
  - "001"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Foundation Package (Phase 0, 1, 1.5)

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-tasks | v1.1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked by dependency |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:package-task-groups -->
## 1. Package Task Groups

### Group A - Phase 0 Prerequisites
- [x] FDN-001 Complete hook pipeline tasks (`T000a-T000d`).
- [x] FDN-002 Complete tokenUsage contract tasks (`T000e-T000g`).
- [x] FDN-003 Complete evaluation bootstrap tasks (`T000h-T000k`).
- [x] FDN-004 [B:FDN-001,FDN-002,FDN-003] Phase 0 sign-off complete (`T000l`).

### Group B - Phase 1 Core Automation
- [x] FDN-010 Complete config and event-decay tasks (`T001-T009`).
- [x] FDN-011 Complete session-boost tasks (`T010-T015`).
- [x] FDN-012 Complete pressure monitor tasks (`T016-T021`).
- [x] FDN-013 [B:FDN-010,FDN-011,FDN-012] Complete Phase 1 evaluation/sign-off (`T022-T028`). [Evidence: root `tasks.md` marks `T027` and `T028` complete with sign-off/dark-launch checklist artifacts.]

### Group C - Phase 1.5 Hardening Gate
- [x] FDN-020 Complete dataset expansion and rank gate tasks (`T027a-T027d`).
- [x] FDN-021 Complete redaction calibration tasks (`T027e-T027j`).
- [x] FDN-022 Complete session lifecycle contract tasks (`T027k-T027n`).
- [x] FDN-023 [B:FDN-020,FDN-021,FDN-022] Complete go/no-go hard gate (`T027o`).
<!-- /ANCHOR:package-task-groups -->

<!-- ANCHOR:handoff-sync -->
## 2. Handoff and Synchronization Tasks

- [x] FDN-030 Publish handoff artifact list for package 002 (`eval-dataset-1000.json`, `phase1-5-eval-results.md`, `redaction-calibration.md`).
- [x] FDN-031 Confirm hard-gate status and dependencies in root `../tasks.md` mapping section.
- [x] FDN-032 Confirm package references in root `../spec.md`, `../plan.md`, and `../checklist.md` remain current.
<!-- /ANCHOR:handoff-sync -->

<!-- ANCHOR:evidence -->

## 3. Evidence Requirements

- [x] FDN-E01 Correlation evidence attached (`phase1-5-eval-results.md`).
- [x] FDN-E02 Redaction FP evidence attached (`redaction-calibration.md`).
- [x] FDN-E03 Session lifecycle test evidence attached (integration test output).
<!-- /ANCHOR:evidence -->

<!-- ANCHOR:completion -->
## 4. Completion Conditions

- [x] All `FDN-001` through `FDN-023` completed.
- [x] All `FDN-E01` through `FDN-E03` completed.
- [x] Hard-gate outputs available for package 002.
- [x] Root mapping remains synchronized.

Tracking document synchronized with root execution state; remaining open items are human/ops-gated.
<!-- /ANCHOR:completion -->
