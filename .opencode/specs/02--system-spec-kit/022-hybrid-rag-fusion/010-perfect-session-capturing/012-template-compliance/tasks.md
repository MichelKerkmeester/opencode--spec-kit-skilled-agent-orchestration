---
title: "Tasks: Template Compliance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "template compliance"
importance_tier: "high"
contextType: "general"
---
# Tasks: Template Compliance

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

- [x] T001 Review parent `010` docs and prior child phases for repo-aligned context (`.opencode/specs/.../010-perfect-session-capturing/`)
- [x] T002 Locate the actual runtime prompt surfaces that replace the stale draft references (`.opencode/agent/`, `.claude/agents/`, `.gemini/agents/`, `.opencode/command/spec_kit/assets/`)
- [x] T003 Confirm no repo-local or home-directory Codex speckit runtime file exists to patch (`/Users/michelkerkmeester/.codex`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] T004 Create the shared live template contract helper at `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`
- [x] T005 Update `check-template-headers.sh` for live required-header order, checklist H1, and `CHK-NNN` enforcement
- [x] T006 [P] Update `check-anchors.sh` for live required-anchor comparison and custom-anchor warnings
- [x] T007 Update `validate.sh` so `TEMPLATE_HEADERS` structural mismatches are errors in normal validation
- [x] T008 [P] Update the shared/OpenCode runtime speckit agent docs under `.agents/agents/` and `.opencode/agent/`
- [x] T009 [P] Update the Claude and Gemini runtime speckit agent docs
- [x] T010 Update `/spec_kit` plan/implement/complete auto+confirm workflow assets with inline scaffolds and strict post-write validation
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T011 Add compliant and mutation fixtures for pass/warn/fail template-compliance paths under `scripts/test-fixtures/053-060-*`
- [x] T012 Add Vitest coverage for template contract resolution and optional-section handling in `scripts/tests/template-structure.vitest.ts`
- [x] T013 Extend workflow prompt assertions to include `.agents`, OpenCode x2, Claude, and Gemini runtime agent docs in `scripts/tests/test-phase-command-workflows.js`
- [x] T014 Update targeted shell validation categories to use the new compliant/mutation fixture lane in the `scripts/tests/test-validation*` runners
- [x] T015 Validate the compliant fixture and targeted shell/Vitest commands, then align this phase’s docs and summary with the shipped implementation
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

- **Specification**: See the specification document in this phase folder
- **Plan**: See the implementation plan document in this phase folder
<!-- /ANCHOR:cross-refs -->
