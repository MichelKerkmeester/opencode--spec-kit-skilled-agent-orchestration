---
title: "Tasks: Create Commands Codex Compatibility [012-create-codex-compatibility/tasks]"
description: "level: 3"
trigger_phrases:
  - "tasks"
  - "create"
  - "commands"
  - "codex"
  - "compatibility"
  - "012"
importance_tier: "normal"
contextType: "implementation"
completed: 2026-02-17
created: 2026-02-17
level: 3
status: done
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Tasks: Create Commands Codex Compatibility

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
## Phase 1: Spec Folder Creation

- [x] T001 Create spec folder structure (`.opencode/specs/03--commands-and-skills/cmd-012-create-codex-compatibility/`)

**Completion Criteria**: Spec folder exists with initial spec.md.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: skill.md + 2 YAMLs (3-agent)

- [x] T002 Strip `## Agent Routing` (3-agent table: @context, @speckit, @review), remove `<!-- REFERENCE ONLY/END -->` guards, add `## CONSTRAINTS` (`.opencode/command/create/skill.md`)
- [x] T003 Restructure 3 `agent_routing:` blocks to `agent_availability:` with `condition:` and `not_for:` fields (`.opencode/command/create/assets/create_skill_auto.yaml`)
- [x] T004 Restructure 3 `agent_routing:` blocks to `agent_availability:` (`.opencode/command/create/assets/create_skill_confirm.yaml`)

**Completion Criteria**: skill.md has CONSTRAINTS, no Agent Routing; both YAMLs have 3 agent_availability blocks each.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: agent.md + 2 YAMLs (3-agent)

- [x] T005 Strip `## Agent Routing` (3-agent table: @context, @speckit, @review), remove guards, add `## CONSTRAINTS` (`.opencode/command/create/agent.md`)
- [x] T006 Restructure 3 `agent_routing:` blocks to `agent_availability:` (`.opencode/command/create/assets/create_agent_auto.yaml`)
- [x] T007 Restructure 3 `agent_routing:` blocks to `agent_availability:` (`.opencode/command/create/assets/create_agent_confirm.yaml`)

**Completion Criteria**: agent.md has CONSTRAINTS, no Agent Routing; both YAMLs have 3 agent_availability blocks each.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: folder_readme.md + 2 YAMLs (1-agent + emoji)

- [x] T008 Strip `## Agent Routing` (1-agent: @review), remove guards, add `## CONSTRAINTS`, remove emoji optionality line (`.opencode/command/create/folder_readme.md`)
- [x] T009 Restructure 1 `agent_routing:` block + emoji cleanup + rename `emoji_conventions:` to `section_icons:` (`.opencode/command/create/assets/create_folder_readme_auto.yaml`)
- [x] T010 Restructure 1 `agent_routing:` block + emoji cleanup + rename `emoji_conventions:` to `section_icons:` (`.opencode/command/create/assets/create_folder_readme_confirm.yaml`)

**Completion Criteria**: folder_readme.md has CONSTRAINTS, no Agent Routing, no emoji line; both YAMLs have agent_availability, section_icons, no emoji language.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: install_guide.md + 2 YAMLs (1-agent + emoji)

- [x] T011 Strip `## Agent Routing` (1-agent: @review), remove guards, add `## CONSTRAINTS` (`.opencode/command/create/install_guide.md`)
- [x] T012 Restructure 1 `agent_routing:` block + emoji cleanup (`.opencode/command/create/assets/create_install_guide_auto.yaml`)
- [x] T013 Restructure 1 `agent_routing:` block + emoji cleanup (`.opencode/command/create/assets/create_install_guide_confirm.yaml`)

**Completion Criteria**: install_guide.md has CONSTRAINTS, no Agent Routing; both YAMLs have agent_availability, no emoji language.
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: skill_asset.md + 2 YAMLs (1-agent + emoji)

- [x] T014 Strip `## Agent Routing` (1-agent: @review), remove guards, add `## CONSTRAINTS` (`.opencode/command/create/skill_asset.md`)
- [x] T015 Restructure 1 `agent_routing:` block + emoji cleanup (`.opencode/command/create/assets/create_skill_asset_auto.yaml`)
- [x] T016 Restructure 1 `agent_routing:` block + emoji cleanup (`.opencode/command/create/assets/create_skill_asset_confirm.yaml`)

**Completion Criteria**: skill_asset.md has CONSTRAINTS, no Agent Routing; both YAMLs have agent_availability, no emoji language.
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: skill_reference.md + 2 YAMLs (1-agent + emoji)

- [x] T017 Strip `## Agent Routing` (1-agent: @review), remove guards, add `## CONSTRAINTS` (`.opencode/command/create/skill_reference.md`)
- [x] T018 Restructure 1 `agent_routing:` block + emoji cleanup (`.opencode/command/create/assets/create_skill_reference_auto.yaml`)
- [x] T019 Restructure 1 `agent_routing:` block + emoji cleanup (`.opencode/command/create/assets/create_skill_reference_confirm.yaml`)

**Completion Criteria**: skill_reference.md has CONSTRAINTS, no Agent Routing; both YAMLs have agent_availability, no emoji language.
<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:phase-8 -->
## Phase 8: Cross-File Emoji Cleanup

- [x] T020 Verify all emoji optionality language removed from .md files
- [x] T021 Verify all emoji optionality language removed from YAML files
- [x] T022 Confirm `emoji_conventions:` renamed to `section_icons:` in folder_readme YAMLs only
- [x] T023 Run `grep -ri "[Ee]moji" create/` and confirm 0 matches

**Completion Criteria**: Zero emoji references remain in any create command file.
<!-- /ANCHOR:phase-8 -->

---

<!-- ANCHOR:phase-9 -->
## Phase 9: Final Verification

- [x] T024 Run all 7 verification checks and document results

| # | Check | Expected | Result |
|---|-------|----------|--------|
| 1 | `agent_routing:` in create/ | 0 | 0 |
| 2 | `agent_availability:` in assets/ | 20 | 20 |
| 3 | `dispatch:.*@` in assets/ | 0 | 0 |
| 4 | `## Agent Routing` in *.md | 0 | 0 |
| 5 | `## CONSTRAINTS` in *.md | 6 | 6 |
| 6 | `REFERENCE ONLY` in *.md | 0 | 0 |
| 7 | `[Ee]moji` in create/ | 0 | 0 |

**Completion Criteria**: All 7 checks pass with expected values.
<!-- /ANCHOR:phase-9 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 24 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 7 verification checks pass (Phase 9)
- [x] implementation-summary.md documents final state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (REQ-001 to REQ-008)
- **Plan**: See `plan.md` (9-phase approach with ADRs)
- **Verification**: See `checklist.md` (P0/P1 items)
- **Decisions**: See `decision-record.md` (ADR-001, ADR-002)
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS
- 24 tasks across 9 phases
- All tasks completed (2026-02-17)
- Clear completion criteria per phase
-->
