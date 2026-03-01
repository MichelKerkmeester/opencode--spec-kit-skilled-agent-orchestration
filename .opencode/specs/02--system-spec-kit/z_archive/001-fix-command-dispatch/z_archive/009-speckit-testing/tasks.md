---
title: "Tasks: SpecKit Post-Rename Testing [009-speckit-testing/tasks]"
description: "Task breakdown for parallel agent testing."
trigger_phrases:
  - "tasks"
  - "speckit"
  - "post"
  - "rename"
  - "testing"
  - "009"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: SpecKit Post-Rename Testing

Task breakdown for parallel agent testing.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.1 -->

---

## 1. AGENT TASKS

### Agent 1: Script Functionality Testing
- [x] T001 [P] Test common.sh loads without errors
- [x] T002 [P] Test create-spec-folder.sh --help works
- [x] T003 [P] Test check-prerequisites.sh on existing spec folder
- [x] T004 [P] Test calculate-completeness.sh on existing spec folder
- [x] T005 [P] Test recommend-level.sh functionality
- [x] T006 [P] Test archive-spec.sh --help works

### Agent 2: Template Validation
- [x] T007 [P] Verify spec.md template exists and has SPECKIT_TEMPLATE_SOURCE
- [x] T008 [P] Verify plan.md template exists and has proper placeholders
- [x] T009 [P] Verify tasks.md template exists
- [x] T010 [P] Verify checklist.md template exists
- [x] T011 [P] Verify decision-record.md template exists
- [x] T012 [P] Verify research.md, research-spike.md, handover.md, debug-delegation.md exist
- [x] T013 [P] Verify scratch/.gitkeep exists

### Agent 3: Reference Documentation Check
- [x] T014 [P] Compare level_specifications.md with AGENTS.md Section 2
- [x] T015 [P] Verify quick_reference.md accuracy
- [x] T016 [P] Check template_guide.md is current
- [x] T017 [P] Verify path_scoped_rules.md paths are updated

### Agent 4: Path Verification
- [x] T018 [P] Search for "workflows-spec-kit" references in codebase
- [x] T019 [P] Search for ".opencode/speckit/" references in codebase
- [x] T020 [P] Verify SKILL.md uses "system-spec-kit" throughout
- [x] T021 [P] Check AGENTS.md references are updated

### Agent 5: E2E Integration Testing
- [x] T022 [P] Run create-spec-folder.sh to create test folder in scratch/
- [x] T023 [P] Run check-prerequisites.sh on new test folder
- [x] T024 [P] Run calculate-completeness.sh on new test folder
- [x] T025 [P] Verify test folder structure matches expected

---

## 2. ORCHESTRATOR TASKS

- [x] T100 Synthesize agent outputs
- [x] T101 Create test report
- [x] T102 Document any failures or issues found

---
