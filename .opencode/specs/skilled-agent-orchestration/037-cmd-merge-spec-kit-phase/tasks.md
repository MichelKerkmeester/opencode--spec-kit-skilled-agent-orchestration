---
title: "Tasks: Merge spec_kit:phase into plan and complete [skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "merge"
  - "spec"
  - "kit"
  - "phase"
  - "037"
  - "cmd"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/037-cmd-merge-spec-kit-phase"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Merge spec_kit:phase into plan and complete

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

- [x] T001 Read and understand current `phase` command, `plan` command, `complete` command, and all YAML assets
- [x] T002 Read `:with-research` pattern in `spec_kit_complete_auto.yaml` to use as blueprint
- [x] T003 Identify all cross-references to `spec_kit:phase` in primary docs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `:with-phases` flag to `plan` command frontmatter argument-hint and execution protocol (`.opencode/command/spec_kit/plan.md`)
- [x] T005 Add phase decomposition section to `plan` command with workflow description, flag parsing, and examples (`.opencode/command/spec_kit/plan.md`)
- [x] T006 [P] Add `:with-phases` flag to spec_kit:complete frontmatter argument-hint and execution protocol
- [x] T007 [P] Add phase decomposition section to spec_kit:complete with workflow description, flag parsing, and examples
- [x] T008 Add `phase_decomposition` optional workflow to `spec_kit_plan_auto.yaml` (`.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`)
- [x] T009 [P] Add `phase_decomposition` optional workflow to `spec_kit_plan_confirm.yaml` (`.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`)
- [x] T010 [P] Add `phase_decomposition` optional workflow to `spec_kit_complete_auto.yaml` (`.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`)
- [x] T011 [P] Add `phase_decomposition` optional workflow to `spec_kit_complete_confirm.yaml` (`.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Delete standalone spec_kit:phase command file
- [x] T013 [P] Delete `spec_kit_phase_auto.yaml` (`.opencode/command/spec_kit/assets/spec_kit_phase_auto.yaml`)
- [x] T014 [P] Delete `spec_kit_phase_confirm.yaml` (`.opencode/command/spec_kit/assets/spec_kit_phase_confirm.yaml`)
- [x] T015 Update `README.txt` to remove phase entry and document `:with-phases` (`.opencode/command/spec_kit/README.txt`)
- [x] T016 Update `CLAUDE.md` quick reference table to replace `/spec_kit:phase` with `:with-phases` note
- [ ] T017 Verify `/spec_kit:plan` without `:with-phases` works unchanged (manual test)
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
