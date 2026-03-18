---
title: "Tasks: Create Commands YAML-First Architecture Refactor [009-create-yaml-architecture/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "create"
  - "commands"
  - "yaml"
  - "first"
  - "009"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Create Commands YAML-First Architecture Refactor

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
## Phase 1: Bug Fixes

- [ ] T001 Fix step count metadata in existing YAMLs — counts must match actual step count (`create_*.yaml`)
- [ ] T002 Fix orphaned create_agent.yaml — agent.md must correctly reference it (`agent.md`, `create_agent.yaml`)
- [ ] T003 Document current state of all 6 commands (baseline for regression testing)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: .md Refactor

### Phase 2a: Golden Reference

- [ ] T004 Refactor skill.md as golden reference — add EXECUTION PROTOCOL banner (`skill.md`)
- [ ] T005 Add YAML-first routing logic to skill.md (`skill.md`)
- [ ] T006 Annotate inline workflow content as REFERENCE ONLY in skill.md (`skill.md`)
- [ ] T007 Verify Phase 0 (@write verification) preserved in skill.md (`skill.md`)
- [ ] T008 Test skill.md golden reference end-to-end (manual execution)

### Phase 2b: Replication

- [ ] T009 [P] Replicate golden reference pattern to agent.md (`agent.md`)
- [ ] T010 [P] Replicate golden reference pattern to folder_readme.md (`folder_readme.md`)
- [ ] T011 [P] Replicate golden reference pattern to install_guide.md (`install_guide.md`)
- [ ] T012 [P] Replicate golden reference pattern to skill_asset.md (`skill_asset.md`)
- [ ] T013 [P] Replicate golden reference pattern to skill_reference.md (`skill_reference.md`)
- [ ] T014 Verify all 6 .md files structurally match golden reference

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: YAML Refactor

### Phase 3a: Rename Existing YAMLs to _confirm

- [ ] T015 [P] Rename create_skill.yaml to create_skill_confirm.yaml
- [ ] T016 [P] Rename create_agent.yaml to create_agent_confirm.yaml
- [ ] T017 [P] Rename create_folder_readme.yaml to create_folder_readme_confirm.yaml
- [ ] T018 [P] Rename create_install_guide.yaml to create_install_guide_confirm.yaml
- [ ] T019 [P] Rename create_skill_asset.yaml to create_skill_asset_confirm.yaml
- [ ] T020 [P] Rename create_skill_reference.yaml to create_skill_reference_confirm.yaml

### Phase 3b: Create _auto YAML Variants

- [ ] T021 [P] Create create_skill_auto.yaml (based on _confirm, remove confirmation pauses)
- [ ] T022 [P] Create create_agent_auto.yaml
- [ ] T023 [P] Create create_folder_readme_auto.yaml
- [ ] T024 [P] Create create_install_guide_auto.yaml
- [ ] T025 [P] Create create_skill_asset_auto.yaml
- [ ] T026 [P] Create create_skill_reference_auto.yaml

### Phase 3c: Add Missing Structural Sections

- [ ] T027 Add circuit_breaker section to all 12 YAMLs
- [ ] T028 Add workflow_enforcement section to all 12 YAMLs
- [ ] T029 Add validation gates to all 12 YAMLs
- [ ] T030 Add mode-specific configuration to all 12 YAMLs
- [ ] T031 Verify YAML-MD cross-references are correct across all 18 files

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Workflows-Documentation Alignment

- [ ] T032 Integrate validate_document.py calls in YAML verification steps
- [ ] T033 Add DQI enforcement configuration to all 12 YAMLs
- [ ] T034 Verify canonical template references are correct
- [ ] T035 Test all 6 commands in confirm mode (regression check)
- [ ] T036 Test all 6 commands in auto mode (new functionality check)
- [ ] T037 Update .md routing to pass mode parameter to YAML correctly

<!-- /ANCHOR:phase-4 -->

---

## Post-Implementation

- [ ] T038 Create implementation-summary.md
- [ ] T039 Complete checklist.md verification
- [ ] T040 Save context to memory/ via generate-context.js

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 6 commands tested in both auto and confirm modes
- [ ] Checklist.md fully verified
- [ ] Implementation-summary.md created

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS - Create Commands YAML-First Architecture Refactor
- 40 tasks across 4 phases + post-implementation
- Phase 2b and Phase 3a/3b tasks are parallelizable
- Serial phase dependencies: 1 → 2 → 3 → 4
-->
