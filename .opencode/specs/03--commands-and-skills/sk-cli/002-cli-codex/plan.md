---
title: "Implementation Plan: cli-gemini Model Consolidation + cli-codex Skill"
description: "Plan for consolidating cli-gemini to single model and creating cli-codex skill."
trigger_phrases:
  - "cli-codex plan"
  - "codex skill plan"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: cli-gemini Model Consolidation + cli-codex Skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (documentation-only skill) |
| **Framework** | OpenCode Skill System (8-section SKILL.md standard) |
| **Testing** | grep verification, skill_advisor.py test |

### Overview
Two work items: (1) consolidate cli-gemini to use only `gemini-3.1-pro-preview`, (2) create cli-codex skill for OpenAI Codex CLI mirroring cli-gemini's structure.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:phases -->
## 2. IMPLEMENTATION PHASES

### Phase A: cli-gemini Model Consolidation
- [x] Replace model references in SKILL.md
- [x] Replace model references in cli_reference.md
- [x] Replace model references in integration_patterns.md
- [x] Replace model references in gemini_tools.md
- [x] Replace model references in prompt_templates.md
- [x] Simplify model selection tables to single model

### Phase B: cli-codex Skill Creation
- [x] Create directory structure: cli-codex/{references,assets}
- [x] Create SKILL.md (8 sections, smart routing)
- [x] Create references/cli_reference.md
- [x] Create references/agent_delegation.md
- [x] Create references/codex_tools.md
- [x] Create references/integration_patterns.md
- [x] Create assets/prompt_templates.md

### Phase C: Ecosystem Registration
- [x] Add entries to skill_advisor.py (INTENT_BOOSTERS, MULTI_SKILL_BOOSTERS, PHRASE_INTENT_BOOSTERS)
- [x] Create .claude/skills/cli-codex symlink
- [x] Update .opencode/skill/README.md
- [x] Update root README.md
- [x] Update .opencode/README.md

### Phase D: Spec Folder Documentation
- [x] Create spec.md
- [x] Create plan.md
- [x] Create tasks.md
- [x] Create checklist.md
<!-- /ANCHOR:phases -->
