---
title: "Tasks: Make spec_kit Commands Codex-Compatible [010-speckit-codex-compatibility/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "make"
  - "spec"
  - "kit"
  - "commands"
  - "010"
  - "speckit"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Make spec_kit Commands Codex-Compatible

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Create spec folder with Level 2 artifacts (`.opencode/specs/.../010-speckit-codex-compatibility/`)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: complete.md + YAMLs

- [x] T002 Modify complete.md: strip `## AGENT ROUTING`, dispatch templates; add `## CONSTRAINTS` (`.opencode/command/spec_kit/complete.md`)
- [x] T003 Modify spec_kit_complete_auto.yaml: rename `agent_routing` to `agent_availability`, remove `dispatch:`, add `condition:` and `not_for:` (`.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`)
- [x] T004 Modify spec_kit_complete_confirm.yaml: rename `agent_routing` to `agent_availability`, remove `dispatch:`, add `condition:` and `not_for:` (`.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: implement.md + YAMLs

- [x] T005 Modify implement.md: strip `## AGENT ROUTING`, dispatch templates; add `## CONSTRAINTS` (`.opencode/command/spec_kit/implement.md`)
- [x] T006 Modify spec_kit_implement_auto.yaml: rename `agent_routing` to `agent_availability`, remove `dispatch:`, add `condition:` and `not_for:` (`.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`)
- [x] T007 Modify spec_kit_implement_confirm.yaml: rename `agent_routing` to `agent_availability`, remove `dispatch:`, add `condition:` and `not_for:` (`.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml`)

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: debug.md + YAMLs

- [x] T008 Modify debug.md: strip `## AGENT ROUTING` + `## SUB-AGENT DELEGATION`, dispatch templates; add `## CONSTRAINTS` (`.opencode/command/spec_kit/debug.md`)
- [x] T009 Modify spec_kit_debug_auto.yaml: rename `agent_routing` to `agent_availability`, remove `dispatch:`, add `condition:` and `not_for:` (`.opencode/command/spec_kit/assets/spec_kit_debug_auto.yaml`)
- [x] T010 Modify spec_kit_debug_confirm.yaml: rename `agent_routing` to `agent_availability`, remove `dispatch:`, add `condition:` and `not_for:` (`.opencode/command/spec_kit/assets/spec_kit_debug_confirm.yaml`)

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: handover.md + YAML

- [x] T011 Modify handover.md: strip `## SUB-AGENT DELEGATION`; add `## CONSTRAINTS` (`.opencode/command/spec_kit/handover.md`)
- [x] T012 Modify spec_kit_handover_full.yaml: rename `agent_routing` to `agent_availability`, remove `dispatch:`, add `condition:` and `not_for:` (`.opencode/command/spec_kit/assets/spec_kit_handover_full.yaml`)

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: plan.md + YAMLs

- [x] T013 Modify plan.md: strip `## AGENT ROUTING`, dispatch templates; add `## CONSTRAINTS` (`.opencode/command/spec_kit/plan.md`)
- [x] T014 Modify spec_kit_plan_auto.yaml: rename `agent_routing` to `agent_availability`, remove `dispatch:`, add `condition:` and `not_for:` (`.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`)
- [x] T015 Modify spec_kit_plan_confirm.yaml: rename `agent_routing` to `agent_availability`, remove `dispatch:`, add `condition:` and `not_for:` (`.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`)

<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: research.md + YAMLs

- [x] T016 Modify research.md: strip `## AGENT ROUTING`, dispatch templates; add `## CONSTRAINTS` (`.opencode/command/spec_kit/research.md`)
- [x] T017 Modify spec_kit_research_auto.yaml: rename `agent_routing` to `agent_availability`, remove `dispatch:`, add `condition:` and `not_for:` (`.opencode/command/spec_kit/assets/spec_kit_research_auto.yaml`)
- [x] T018 Modify spec_kit_research_confirm.yaml: rename `agent_routing` to `agent_availability`, remove `dispatch:`, add `condition:` and `not_for:` (`.opencode/command/spec_kit/assets/spec_kit_research_confirm.yaml`)

<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:phase-8 -->
## Phase 8: resume.md + Final Verification

- [x] T019 Modify resume.md: add `## CONSTRAINTS` only, no YAML changes needed (`.opencode/command/spec_kit/resume.md`)
- [x] T020 Verify symlink `.claude/commands/spec_kit/` covers both locations

<!-- /ANCHOR:phase-8 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 20 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All grep-based success criteria pass (SC-001 through SC-005)
- [x] Checklist.md fully verified
- [x] Implementation-summary.md created

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS - Make spec_kit Commands Codex-Compatible
- 20 tasks across 8 phases
- All tasks completed (2026-02-17)
- Serial execution: one command at a time
-->
