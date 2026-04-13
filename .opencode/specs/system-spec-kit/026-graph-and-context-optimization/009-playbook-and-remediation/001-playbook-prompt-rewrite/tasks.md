---
title: "Tasks: Phase 014 — Manual Testing Playbook Prompt Rewrite [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases: ["tasks", "phase 014", "packet repair"]
importance_tier: "important"
contextType: "implementation"
level: 2
status: "complete"
parent: "009-playbook-and-remediation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/001-playbook-prompt-rewrite"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "speckit"
    recent_action: "Tasks file added"
    next_safe_action: "Keep tasks synced"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phase 014 — Manual Testing Playbook Prompt Rewrite

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

- [x] T001 Review strict validator output for the target phase folder (`014-playbook-prompt-rewrite/`)
- [x] T002 Read the active Level 2 templates for `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`
- [x] T003 Confirm the real playbook index path (`.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite `spec.md` to the Level 2 scaffold (`spec.md`)
- [x] T005 Rewrite `plan.md` to the Level 2 scaffold (`plan.md`)
- [x] T006 [P] Create the required task tracker and verification checklist (`tasks.md`, `checklist.md`)
- [x] T007 Replace broken packet references with the real playbook index path (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run strict packet validation (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh`)
- [x] T009 Confirm only target spec-folder markdown files were edited for this repair
- [x] T010 Synchronize `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` for Phase 014
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All packet-repair tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Strict validation no longer reports Level 2 structural errors
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook Index**: See `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`
<!-- /ANCHOR:cross-refs -->

---
