---
title: "Tasks: CLI Self-Invocation Guards [03--commands-and-skills/009-cli-self-invocation-guards/tasks]"
description: "Task breakdown for adding self-invocation guard language to the CLI bridge skills."
trigger_phrases:
  - "tasks"
  - "cli"
  - "self"
  - "invocation"
  - "guards"
  - "009"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: CLI Self-Invocation Guards

<!-- SPECKIT_LEVEL: 1 -->
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

---
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Review all four CLI bridge skills for existing self-invocation or nesting guidance.
- [x] T002 Define a shared guard pattern that is conceptual, actionable, and runtime-aware where possible.
- [x] T003 Confirm the spec-folder scope for the documentation update.

---
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update `cli-claude-code` to broaden existing nesting guidance into a self-invocation guard.
- [x] T005 Update `cli-gemini` with new self-invocation guidance.
- [x] T006 Update `cli-codex` with new self-invocation guidance.
- [x] T007 Update `cli-copilot` to strengthen its self-invocation guidance.

---
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase 3: Verification

- [x] T008 Confirm all targeted skills include the guard pattern and native fallback guidance.
- [x] T009 Confirm detection wording is aligned where runtime hints exist.
- [x] T010 Validate the spec-folder structure.

---
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed

---
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`

---
<!-- /ANCHOR:cross-refs -->

---
