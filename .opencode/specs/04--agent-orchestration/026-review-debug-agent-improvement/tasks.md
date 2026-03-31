
---
title: "Tasks: Adversarial Self-Check for Review, Debug, Ultra-Think Agents [04--agent-orchestration/026-review-debug-agent-improvement/tasks]"
description: "Task Format: T### [P?] Description"
trigger_phrases:
  - "tasks"
  - "review"
  - "debug"
  - "ultra-think"
  - "026"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Adversarial Self-Check for Review, Debug, Ultra-Think Agents

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

Task format: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the canonical review, debug, and ultra-think agent files.
- [x] T002 Identify the surviving Claude, Gemini-style, and Codex runtime variants.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add adversarial self-check guidance to the review variants.
- [x] T004 Add adversarial hypothesis validation to the debug variants.
- [x] T005 Add adversarial cross-critique guidance to the ultra-think variants.
- [x] T006 Keep removed historical runtime variants documented only in prose.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Verify the protocol appears across all surviving runtime variants.
- [x] T008 Verify Codex TOML variants remain syntactically valid.
- [x] T009 Re-run spec validation and fix compliance drift.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All surviving runtime variants are covered.
- [x] No out-of-scope agent families were changed.
- [x] The spec folder validates without errors.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
