---
title: "Tasks: Command Agent Utilization Audit [014-command-agent-utilization/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "command"
  - "agent"
  - "utilization"
  - "audit"
  - "014"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Command Agent Utilization Audit

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
## Phase 1: Route Spec Folder Creation Through @speckit

- [x] T001 [P] Update spec_folder_setup with @speckit routing (`create_skill_auto.yaml`)
- [x] T002 [P] Update spec_folder_setup with @speckit routing (`create_skill_confirm.yaml`)
- [x] T003 [P] Update spec_folder_setup with @speckit routing (`create_agent_auto.yaml`)
- [x] T004 [P] Update spec_folder_setup with @speckit routing (`create_agent_confirm.yaml`)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Route Discovery Through @context

- [x] T005 [P] Replace inline Glob/Grep with @context dispatch (`create_skill_auto.yaml`)
- [x] T006 [P] Replace inline Glob/Grep with @context dispatch (`create_skill_confirm.yaml`)
- [x] T007 [P] Replace inline Glob/Grep with @context dispatch (`create_agent_auto.yaml`)
- [x] T008 [P] Replace inline Glob/Grep with @context dispatch (`create_agent_confirm.yaml`)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Add @review Quality Gate

### Auto YAML files (no checkpoint)
- [x] T009 [P] Add quality_review step (`create_skill_auto.yaml`)
- [x] T010 [P] Add quality_review step (`create_agent_auto.yaml`)
- [x] T011 [P] Add quality_review step (`create_folder_readme_auto.yaml`)
- [x] T012 [P] Add quality_review step (`create_install_guide_auto.yaml`)
- [x] T013 [P] Add quality_review step (`create_skill_asset_auto.yaml`)
- [x] T014 [P] Add quality_review step (`create_skill_reference_auto.yaml`)

### Confirm YAML files (with checkpoint)
- [x] T015 [P] Add quality_review step with checkpoint (`create_skill_confirm.yaml`)
- [x] T016 [P] Add quality_review step with checkpoint (`create_agent_confirm.yaml`)
- [x] T017 [P] Add quality_review step with checkpoint (`create_folder_readme_confirm.yaml`)
- [x] T018 [P] Add quality_review step with checkpoint (`create_install_guide_confirm.yaml`)
- [x] T019 [P] Add quality_review step with checkpoint (`create_skill_asset_confirm.yaml`)
- [x] T020 [P] Add quality_review step with checkpoint (`create_skill_reference_confirm.yaml`)

### MD Reference Files
- [x] T021 Add Agent Routing section with 3 agents (`skill.md`)
- [x] T022 Add Agent Routing section with 3 agents (`agent.md`)
- [x] T023 [P] Add Agent Routing section with 1 agent (`folder_readme.md`)
- [x] T024 [P] Add Agent Routing section with 1 agent (`install_guide.md`)
- [x] T025 [P] Add Agent Routing section with 1 agent (`skill_asset.md`)
- [x] T026 [P] Add Agent Routing section with 1 agent (`skill_reference.md`)

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [x] T027 Grep verification: no inline patterns remain in modified steps
- [x] T028 Review agent: Phase 1+2 structural checks (72/72 passed)
- [x] T029 Review agent: Phase 3 structural checks (132/132 passed)
- [x] T030 Manual: verify all 6 MD Agent Routing sections

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 30 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] 204/204 verification checks passed

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE — 30 tasks across 4 phases, all completed
-->
