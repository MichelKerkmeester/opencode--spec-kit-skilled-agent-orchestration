---
title: "Tasks: Fix Create Command Dispatch Vulnerability + Defensive Hardening [008-fix-create-dispatch/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "fix"
  - "create"
  - "command"
  - "dispatch"
  - "008"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Fix Create Command Dispatch Vulnerability + Defensive Hardening

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
## Phase 1: Critical Fix (skill.md)

- [ ] T001 Remove `Task` from allowed-tools frontmatter (`.opencode/command/create/skill.md`)
- [ ] T002 Add imperative guardrail block at line 7 (`.opencode/command/create/skill.md`)
- [ ] T003 Add YAML loading prominence to guardrail sequence (`.opencode/command/create/skill.md`)
- [ ] T004 Verify `/create:skill` executes directly without phantom dispatch

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Defensive Hardening

- [ ] T005 [P] Add guardrail block to agent.md — Fix A only, no YAML loading (`.opencode/command/create/agent.md`)
- [ ] T006 [P] Add guardrail block to skill_reference.md — Fix A+B (`.opencode/command/create/skill_reference.md`)
- [ ] T007 [P] Add guardrail block to skill_asset.md — Fix A+B (`.opencode/command/create/skill_asset.md`)
- [ ] T008 [P] Add guardrail block to install_guide.md — Fix A+B (`.opencode/command/create/install_guide.md`)
- [ ] T009 [P] Add guardrail block to folder_readme.md — Fix A+B (`.opencode/command/create/folder_readme.md`)
- [ ] T010 Verify all @write refs remain properly fenced across all 6 files

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: YAML Asset Hardening

- [ ] T011 [P] Add `# REFERENCE ONLY` comment to create_skill.yaml (`.opencode/command/create/assets/`)
- [ ] T012 [P] Add `# REFERENCE ONLY` comment to create_agent.yaml
- [ ] T013 [P] Add `# REFERENCE ONLY` comment to create_skill_reference.yaml
- [ ] T014 [P] Add `# REFERENCE ONLY` comment to create_skill_asset.yaml
- [ ] T015 [P] Add `# REFERENCE ONLY` comment to create_install_guide.yaml
- [ ] T016 [P] Add `# REFERENCE ONLY` comment to create_folder_readme.yaml
- [ ] T017 Investigate orphaned create_agent.yaml (not loaded by agent.md)

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Release

- [ ] T018 Update CHANGELOG with v2.0.1.2 entry
- [ ] T019 Commit all changes with descriptive message
- [ ] T020 Tag v2.0.1.2
- [ ] T021 Push and create GitHub release

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `/create:skill` verified: no phantom dispatch
- [ ] All 6 .md files have guardrail blocks
- [ ] All 6 YAML files have REFERENCE ONLY comments

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Prior Work**: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch` (Spec 118)

<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 4 phases: Critical Fix, Hardening, YAML Assets, Release
- Add L2/L3 addendums for complexity
-->
