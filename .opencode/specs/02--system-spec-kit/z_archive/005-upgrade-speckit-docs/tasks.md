---
title: "Tasks: OpenCode Documentation Quality Upgrade [122-upgrade-speckit-docs/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "opencode"
  - "documentation"
  - "quality"
  - "upgrade"
  - "122"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: OpenCode Documentation Quality Upgrade

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[ ]` | Pending |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Identify documentation quality issues across OpenCode system
- [x] T002 Define prose tightening patterns (remove superlatives, marketing language)
- [x] T003 [P] Define style consistency rules (Oxford comma, em dashes, terminology)
- [x] T004 Scope target files (81 primary files + ~85 total modified across .opencode/ directory)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### System Spec Kit Documentation (61 files)
- [x] T005 Apply quality improvements to mcp_server/ README files
- [x] T006 Apply quality improvements to scripts/ README files
- [x] T007 Apply quality improvements to shared/ README files
- [x] T008 Apply quality improvements to templates/ README files
- [x] T009 Apply quality improvements to config/ README files
- [x] T010 Apply quality improvements to constitutional/ README files

### Other Skills Documentation (11 files)
- [x] T011 Improve mcp-code-mode README.md
- [x] T012 Improve mcp-figma README.md
- [x] T013 Improve mcp-chrome-devtools README.md
- [x] T014 Improve sk-code--full-stack README.md
- [x] T015 Improve sk-code--opencode README.md
- [x] T016 Improve workflows-code--web-dev README.md
- [x] T017 Improve sk-doc README.md
- [x] T018 Improve sk-git README.md

### Core Documentation (6 files)
- [x] T019 Tighten .opencode/README.md
- [x] T020 Tighten install_guides/README.md
- [x] T021 Tighten install_guides/install_scripts/README.md
- [x] T022 Tighten .opencode/scripts/README.md
- [x] T023 Tighten root README.md
- [x] T024 Improve sk-doc/SKILL.md

**NOTE**: Covered 63% of documentation scope (81/127 files). Uncovered files (46) include:
- 8 agent definition files (.opencode/agent/*.md)
- 7 SKILL.md files (skill-level documentation)
- 14 command files (.opencode/command/*/*.md)
- 9 install guides (setup/configuration docs)
- 8 miscellaneous files (configs, templates, etc.)
These represent future work for comprehensive documentation quality.

### Version & Template Management
- [x] T025 Bump sk-doc SKILL.md version to 1.0.6.0
- [x] T026 Restructure readme_template.md (+191 lines of improvements)

### Configuration Cleanup
- [x] T027 Remove Antigravity plugin config from opencode.json (-78 lines)
- [x] T028 Update package.json for config changes
- [x] T029 Update bun.lock for dependency changes

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Review all 81 files for technical content preservation
- [x] T031 Verify style consistency across all changes
- [x] T032 Validate markdown formatting and structure
- [x] T033 Confirm LOC changes (~4,864 total LOC changed: +2,649/−2,215, net +434 increase)
- [x] T034 Verify no broken cross-references or links
- [x] T035 Confirm file count (~85 modified files: 81 Spec 122 docs + 3 Spec 124 TS + 1 karabiner + 13 untracked new files)

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (all technical content preserved)
- [x] LOC changes confirmed (~4,864 total: +2,649/−2,215, net +434 increase)
- [x] File modifications verified (~85 files: 81 Spec 122 docs + 3 Spec 124 TS + 1 karabiner + 13 untracked)
- [ ] **Status**: Implementation Complete — Awaiting Commit

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
