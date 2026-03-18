---
title: "Tasks: cli-claude-code Skill"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli-claude-code tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: cli-claude-code Skill

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
## Phase 1: Setup

- [x] T001 Create skill directory structure (.opencode/skill/cli-claude-code/{references,assets})
- [x] T002 Read cli-codex as template reference (.opencode/skill/cli-codex/)
- [x] T003 [P] Read agent definitions (.opencode/agent/*.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create SKILL.md with 8 sections and smart routing (.opencode/skill/cli-claude-code/SKILL.md)
- [x] T005 [P] Create cli_reference.md — CLI flags, commands, models, auth (.opencode/skill/cli-claude-code/references/cli_reference.md)
- [x] T006 [P] Create agent_delegation.md — 9 agents, routing table (.opencode/skill/cli-claude-code/references/agent_delegation.md)
- [x] T007 [P] Create claude_tools.md — unique capabilities, 3-way comparison (.opencode/skill/cli-claude-code/references/claude_tools.md)
- [x] T008 [P] Create integration_patterns.md — 10 reversed orchestration patterns (.opencode/skill/cli-claude-code/references/integration_patterns.md)
- [x] T009 Create prompt_templates.md — 10 template categories (.opencode/skill/cli-claude-code/assets/prompt_templates.md)
- [x] T010 Create README.md companion guide (.opencode/skill/cli-claude-code/README.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Register in skill_advisor.py — 3 booster sections (.opencode/skill/scripts/skill_advisor.py)
- [x] T012 Create symlink (.claude/skills/cli-claude-code)
- [x] T013 [P] Update .opencode/skill/README.md
- [x] T014 [P] Update .opencode/README.md
- [x] T015 [P] Update root README.md
- [x] T016 Run skill_advisor.py confidence test (>= 0.8)
- [x] T017 Verify symlink resolves
- [x] T018 Create spec folder documentation (.opencode/specs/03--commands-and-skills/cli-003-claude-code/)
- [x] T019 Create implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (skill_advisor.py confidence 0.95, symlink resolves)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
