---
title: "Tasks: sk-doc Template Folder Reorganization"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc template tasks"
  - "template folder tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: sk-doc Template Folder Reorganization

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
## Phase 1: File Moves

- [x] T001 Move skill_md_template.md to assets/skill/
- [x] T002 [P] Move skill_asset_template.md to assets/skill/
- [x] T003 [P] Move skill_reference_template.md to assets/skill/
- [x] T004 [P] Move agent_template.md to assets/agents/
- [x] T005 [P] Move command_template.md to assets/agents/
- [x] T006 Delete empty assets/opencode/ directory
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Reference Updates

- [x] T007 Update path references in sk-doc/SKILL.md (7 replacements)
- [x] T008 [P] Update path references in sk-doc/references/quick_reference.md
- [x] T009 [P] Update path references in sk-doc/references/core_standards.md
- [x] T010 [P] Update path references in sk-doc/references/optimization.md
- [x] T011 [P] Update path references in sk-doc/references/validation.md
- [x] T012 [P] Update path references in sk-doc/references/workflows.md
- [x] T013 [P] Update path references in sk-doc/references/skill_creation.md
- [x] T014 [P] Update path references in command/create/assets/ YAML files (8 files)
- [x] T015 [P] Update path references in command/create/ markdown files (4 files)
- [x] T016 Update self-references in moved template files (agent_template.md, skill_md_template.md)
- [x] T019 [P] Update path references in install_guides/ (2 files)
- [x] T020 [P] Update path references in agent/write.md and agent/chatgpt/write.md
- [x] T021 [P] Update path references in skill/README.md
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Grep verification: zero active `assets/opencode` references in .opencode/ (27 remaining are historical: specs archives, changelogs, own spec folder)
- [x] T018 Verify correct new paths exist and are valid (5 files confirmed in assets/skill/ and assets/agents/)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
