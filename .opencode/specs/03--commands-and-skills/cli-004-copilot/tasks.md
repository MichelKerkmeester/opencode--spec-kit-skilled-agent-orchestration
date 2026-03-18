---
title: "Tasks: cli-copilot Skill"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli-copilot tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: cli-copilot Skill

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

- [ ] T001 Create skill directory structure (.opencode/skill/cli-copilot/{references,assets})
- [ ] T002 Read cli-claude-code as template reference (.opencode/skill/cli-claude-code/)
- [ ] T003 [P] Compile Copilot CLI research data (web research)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation (Gemini CLI)

- [ ] T004 Create SKILL.md with 8 sections and smart routing (.opencode/skill/cli-copilot/SKILL.md)
- [ ] T005 [P] Create cli_reference.md — CLI flags, 7+ models, auth (.opencode/skill/cli-copilot/references/cli_reference.md)
- [ ] T006 [P] Create agent_delegation.md — built-in + custom agents (.opencode/skill/cli-copilot/references/agent_delegation.md)
- [ ] T007 [P] Create copilot_tools.md — unique capabilities, 4-way comparison (.opencode/skill/cli-copilot/references/copilot_tools.md)
- [ ] T008 [P] Create integration_patterns.md — 10 orchestration patterns (.opencode/skill/cli-copilot/references/integration_patterns.md)
- [ ] T009 Create prompt_templates.md — 10 template categories (.opencode/skill/cli-copilot/assets/prompt_templates.md)
- [ ] T010 Create README.md companion guide (.opencode/skill/cli-copilot/README.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Review & Verification

- [ ] T011 Review Gemini output for structure and accuracy
- [ ] T012 Verify AI-agnostic language (no hardcoded conductor)
- [ ] T013 Register in skill_advisor.py — 3 booster sections (.opencode/skill/scripts/skill_advisor.py)
- [ ] T014 Create symlink (.claude/skills/cli-copilot)
- [ ] T015 [P] Update .opencode/skill/README.md
- [ ] T016 [P] Update .opencode/README.md
- [ ] T017 [P] Update root README.md
- [ ] T018 Run skill_advisor.py confidence test (>= 0.8)
- [ ] T019 Create implementation-summary.md
- [ ] T020 Create changelog v1.0.0.0.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (skill_advisor.py confidence >= 0.8, symlink resolves)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
