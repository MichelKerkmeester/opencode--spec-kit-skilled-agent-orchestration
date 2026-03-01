---
title: "Tasks: Spec 017 - Agent Provider Switching [017-agent-provider-switch/tasks]"
description: "tasks document for 017-agent-provider-switch."
trigger_phrases:
  - "tasks"
  - "spec"
  - "017"
  - "agent"
  - "provider"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Spec 017 - Agent Provider Switching

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:phase-0 -->
## Phase 0: Spec and Level Validation

| ID | Task | File | Status |
|----|------|------|--------|
| T000 | Validate/upgrade level with script | `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh` | [x] Complete (already Level 3) |
| T001 | Populate `spec.md` with feature scope and requirements | `spec.md` | [x] Complete |
| T002 | Populate `plan.md` with architecture and phases | `plan.md` | [x] Complete |
| T003 | Populate `tasks.md` with execution tasks | `tasks.md` | [x] Complete |
| T004 | Populate `checklist.md` with verification gates | `checklist.md` | [x] Complete |
| T005 | Populate `decision-record.md` with ADRs | `decision-record.md` | [x] Complete |
<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Provider Profile Baseline

| ID | Task | File | Status |
|----|------|------|--------|
| T010 | Create/verify Copilot profile folder with 8 agent files | `.opencode/agent/copilot/` | [x] Complete |
| T011 | Verify ChatGPT profile folder contains all managed agents | `.opencode/agent/chatgpt/` | [x] Complete |
| T012 | Define managed runtime agent list (8 files) | `.opencode/agent/scripts/` | [x] Complete |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Core Switching Scripts

| ID | Task | File | Status |
|----|------|------|--------|
| T020 | Implement provider activation script with arg validation | `.opencode/agent/scripts/activate-provider.sh` | [x] Complete |
| T021 | Add backup and rollback handling | `.opencode/agent/scripts/activate-provider.sh` | [x] Complete |
| T022 | Add post-copy verification of runtime frontmatter | `.opencode/agent/scripts/activate-provider.sh` | [x] Complete |
| T023 | Implement provider status command | `.opencode/agent/scripts/provider-status.sh` | [x] Complete |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification and Documentation

| ID | Task | File | Status |
|----|------|------|--------|
| T030 | Verify switch flow: copilot -> chatgpt -> copilot | `.opencode/agent/*.md` | [x] Complete |
| T031 | Verify failure path restores previous runtime state | `.opencode/agent/scripts/activate-provider.sh` | [x] Complete |
| T032 | Document operator workflow and troubleshooting | `.opencode/README.md` | [x] Complete |
| T033 | Update implementation summary with final outcomes | `implementation-summary.md` | [x] Complete |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 checklist items complete
- [x] Scripts verified for success and rollback behavior
- [x] Runtime path remains `.opencode/agent/*.md` in all references
- [x] Implementation summary finalized
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:execution-task-list -->
## Execution Task List

- [x] T000 Validate level via upgrade script dry-run (`upgrade-level.sh`)
- [x] T001 Populate Level 3 spec artifacts for this folder
- [x] T010 Create/verify `.opencode/agent/copilot/` profile files
- [x] T011 Verify `.opencode/agent/chatgpt/` profile parity
- [x] T020 Implement `activate-provider.sh` argument validation
- [x] T021 Implement backup and rollback flow
- [x] T022 Implement runtime frontmatter verification
- [x] T023 Implement `provider-status.sh`
- [x] T030 Run two-way provider switch validation
- [x] T031 Run induced failure rollback validation
- [x] T032 Update `.opencode/README.md` with operator workflow
- [x] T033 Finalize `implementation-summary.md` after implementation
<!-- /ANCHOR:execution-task-list -->
