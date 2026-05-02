---
title: "Plan: CLI Skills Codebase-Agnostic Standards Contract"
description: "Implementation plan for inserting canonical baseline+overlay rule into 5 CLI SKILL.md files and replacing 7 direct overlay-skill mentions."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "041-cli-skills-baseline-overlay-contract plan"
importance_tier: "important"
contextType: "implementation"
---

# Plan: CLI Skills Codebase-Agnostic Standards Contract

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

| Field | Value |
|---|---|
| **Level** | 1 |
| **LOC** | <100 (15 edits across 10 files) |
| **Approach** | Mirror `review.md` baseline+overlay pattern across 5 CLI SKILL.md as identical numbered ALWAYS rule, then replace 7 direct overlay mentions in supporting refs/playbook/assets/template files |
| **Risk** | Low — pure documentation rewrite; no behavior changes |

---

## 2. EXECUTION

1. Insert canonical "Code Standards Loading (codebase-agnostic baseline+overlay contract)" rule as the next ALWAYS item before `### NEVER` (or `### CONCURRENCY LIMIT` for cli-copilot) in each of 5 CLI SKILL.md files.
2. Replace cli-codex hook_contract.md `additionalContext` example: drop `sk-code-opencode` reference.
3. Update cli-codex SKILL.md Skill Integration table: collapse two duplicate `sk-code` rows into one baseline+overlay row.
4. Update cli-opencode SKILL.md line 397 (validation cross-reference) + line 514 (Skill Integration table) to use baseline+overlay phrasing.
5. Update cli-opencode references/opencode_tools.md line 37 (skill access list).
6. Update cli-opencode manual_testing_playbook root line 113 (file-reference notation note).
7. Update cli-opencode test scenario CO-025 prompt body (003-template-applied-to-real-dispatch.md line 49) — replaces both occurrences in scenario contract bullet + table cell.
8. Update cli-opencode TEMPLATE 5 (assets/prompt_templates.md lines 193, 196-197) — the canonical Code Review prompt template.
9. Verify: sweep + per-file validators + canonical-insert presence count.

---

## 3. DEPENDENCIES

- Donor pattern: `.opencode/agent/review.md`
- Validator: `.opencode/skill/sk-doc/scripts/validate_document.py`

---

## 4. ROLLBACK

`git restore` on the 10 files reverts all changes. No moves, deletes, or schema changes.
