---
title: "Tasks: cli-gemini Model Consolidation + cli-codex Skill"
description: "Task breakdown for model consolidation and skill creation."
trigger_phrases:
  - "cli-codex tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: cli-gemini Model Consolidation + cli-codex Skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task List

### T001: Consolidate cli-gemini models
- [x] Replace gemini-2.5-pro → gemini-3.1-pro-preview in all files
- [x] Replace gemini-2.5-flash → gemini-3.1-pro-preview in all files
- [x] Replace gemini-2.5-flash-lite → gemini-3.1-pro-preview in all files
- [x] Replace gemini-3-pro-preview → gemini-3.1-pro-preview in cli_reference.md
- [x] Simplify model selection tables to single model
- [x] Update routing logic to remove complexity-based model selection

### T002: Create cli-codex skill files
- [x] Create directory structure
- [x] Write SKILL.md with 8 sections
- [x] Write references/cli_reference.md
- [x] Write references/agent_delegation.md
- [x] Write references/codex_tools.md
- [x] Write references/integration_patterns.md
- [x] Write assets/prompt_templates.md

### T003: Register cli-codex in ecosystem
- [x] Add INTENT_BOOSTERS entries in skill_advisor.py
- [x] Add MULTI_SKILL_BOOSTERS entries in skill_advisor.py
- [x] Add PHRASE_INTENT_BOOSTERS entries in skill_advisor.py
- [x] Create .claude/skills/cli-codex symlink
- [x] Add cli-codex to .opencode/skill/README.md
- [x] Add cli-codex to root README.md
- [x] Add cli-codex to .opencode/README.md

### T004: Create spec folder documentation
- [x] spec.md
- [x] plan.md
- [x] tasks.md
- [x] checklist.md
<!-- /ANCHOR:notation -->
