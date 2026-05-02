---
title: "Tasks: CLI Skills Codebase-Agnostic Standards Contract"
description: "Task list for packet 041 — 10 file edits."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "041-cli-skills-baseline-overlay-contract tasks"
importance_tier: "important"
contextType: "implementation"
---

# Tasks: CLI Skills Codebase-Agnostic Standards Contract

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Phase 1: Canonical-rule inserts (5 SKILL.md files)

- [x] T-001 Insert canonical rule as ALWAYS item 9 in `.opencode/skill/cli-claude-code/SKILL.md`
- [x] T-002 Insert canonical rule as ALWAYS item 11 in `.opencode/skill/cli-codex/SKILL.md`
- [x] T-003 Insert canonical rule as ALWAYS item 9 in `.opencode/skill/cli-gemini/SKILL.md`
- [x] T-004 Insert canonical rule as ALWAYS item 8 in `.opencode/skill/cli-copilot/SKILL.md`
- [x] T-005 Insert canonical rule as ALWAYS item 12 in `.opencode/skill/cli-opencode/SKILL.md`

## Phase 2: Direct-mention replacements

- [x] T-006 cli-codex/references/hook_contract.md line 112: `sk-code-opencode` → `sk-code` in advisor-brief example
- [x] T-007 cli-codex/SKILL.md Skill Integration table: collapse 2 `sk-code` rows into 1 baseline+overlay row
- [x] T-008 cli-opencode/SKILL.md line 397: cross-reference text → baseline+overlay phrasing
- [x] T-009 cli-opencode/SKILL.md line 514: Skill Integration `sk-code-opencode` row → baseline+overlay row
- [x] T-010 cli-opencode/references/opencode_tools.md line 37: skill access list updated
- [x] T-011 cli-opencode/manual_testing_playbook/manual_testing_playbook.md line 113: notation note → `sk-code` baseline compatible
- [x] T-012 cli-opencode/manual_testing_playbook/07--prompt-templates/003-template-applied-to-real-dispatch.md line 49: prompt body 2 lines updated (replace_all=true matched both contract bullet + table cell)
- [x] T-013 cli-opencode/assets/prompt_templates.md TEMPLATE 5 lines 193, 196-197: canonical Code Review prompt template updated

## Phase 3: Verification

- [x] T-014 Sweep — `sk-code-review` / `sk-code-opencode` matches in active CLI skill files limited to NEVER-clause anti-pattern examples
- [x] T-015 Canonical insert presence count: 5/5 SKILL.md contain "Code Standards Loading (codebase-agnostic baseline+overlay contract)"
- [x] T-016 `validate_document.py` per modified file: 9/10 VALID; 1 INVALID (hook_contract.md) with pre-existing `missing_required_section: overview` quirk not introduced by this packet
- [x] T-017 Cross-skill consistency: canonical insert text identical across all 5 SKILL.md files
