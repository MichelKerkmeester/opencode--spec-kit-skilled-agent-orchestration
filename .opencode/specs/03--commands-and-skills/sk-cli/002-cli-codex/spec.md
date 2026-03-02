---
title: "Specification: cli-gemini Model Consolidation + cli-codex Skill"
description: "Consolidate cli-gemini to gemini-3.1-pro-preview only, and create a new cli-codex skill for OpenAI Codex CLI orchestration."
trigger_phrases:
  - "cli-codex spec"
  - "codex skill spec"
importance_tier: "normal"
contextType: "implementation"
---
# Specification: cli-gemini Model Consolidation + cli-codex Skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Problem Statement

Two related needs:
1. The `cli-gemini` skill references 5 different Gemini models, causing confusion. It should use only `gemini-3.1-pro-preview`.
2. No `cli-codex` skill exists for OpenAI's Codex CLI, despite existing Codex infrastructure (`.codex/agents/*.toml`, `config.toml`).

### Proposed Solution

1. Replace all non-`gemini-3.1-pro-preview` model references in `cli-gemini` with the single model.
2. Create a new `cli-codex` skill mirroring `cli-gemini`'s structure for OpenAI Codex CLI, standardized on `gpt-5.3-codex` with `xhigh` reasoning.

### Success Criteria

- Zero references to `gemini-2.5-*` or `gemini-3-pro-preview` in `cli-gemini` skill files
- Complete `cli-codex` skill with SKILL.md + 4 reference files + 1 asset file
- Ecosystem registration: skill_advisor.py, README files, symlink
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:scope -->
## 2. SCOPE

### In Scope

- cli-gemini: Model consolidation across SKILL.md, cli_reference.md, integration_patterns.md, gemini_tools.md, prompt_templates.md
- cli-codex: New skill creation with full file structure
- Ecosystem: skill_advisor.py entries, .claude/skills symlink, README updates

### Out of Scope

- Changes to .codex/agents/*.toml configurations
- Changes to Gemini agent definitions in .gemini/agents/
- Install guide creation for Codex CLI
- Changelog entries
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:technical-context -->
## 3. TECHNICAL CONTEXT

| Aspect | Value |
|--------|-------|
| **Type** | Documentation-only skill (no MCP server, no scripts) |
| **Pattern** | Progressive disclosure (SKILL.md → references → assets) |
| **Standard** | 8-section SKILL.md format with smart routing |
| **Models** | gemini-3.1-pro-preview (Gemini), gpt-5.3-codex xhigh (Codex) |
<!-- /ANCHOR:technical-context -->
