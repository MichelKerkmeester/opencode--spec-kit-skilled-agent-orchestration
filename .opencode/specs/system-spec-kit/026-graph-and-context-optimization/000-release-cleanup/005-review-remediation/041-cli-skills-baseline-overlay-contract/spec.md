---
title: "Spec: CLI Skills Codebase-Agnostic Standards Contract"
description: "Update 5 CLI orchestrator skills to mirror review.md's baseline+overlay code-standards contract instead of hardcoded sk-code-review / sk-code-opencode references."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
trigger_phrases:
  - "041-cli-skills-baseline-overlay-contract spec"
importance_tier: "important"
contextType: "implementation"
---

# Spec: CLI Skills Codebase-Agnostic Standards Contract

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## 1. PROBLEM AND PURPOSE

The 5 CLI orchestrator skills (`cli-claude-code`, `cli-codex`, `cli-gemini`, `cli-copilot`, `cli-opencode`) currently mention specific overlay skills (`sk-code-review`, `sk-code-opencode`) by name when describing how dispatched sessions should load code-quality standards. This is brittle: the moment a different stack is in play (Webflow, React/Next.js, Go) the dispatch prompt instructs the dispatched session to load the wrong overlay.

The `review` agent already solved this with a baseline+overlay standards contract: load `sk-code` baseline first, then load exactly one overlay skill matching `sk-code-*` based on stack/codebase signals. The same contract belongs in the CLI skills.

---

## 2. SCOPE

**In scope** (10 files, ~15 edits):
- Add canonical "Code Standards Loading" rule to all 5 CLI SKILL.md files (numbered ALWAYS rule)
- Replace 7 direct overlay-skill mentions with codebase-agnostic phrasing (1 in cli-codex hook_contract example, 6 in cli-opencode SKILL/refs/playbook/assets)
- Cross-skill consistency: identical canonical insert wording across all 5 SKILL.md files

**Out of scope**: changelog files (historical), spec-folder logs (historical), runtime data files (auto-regenerated), pre-existing validator quirks (e.g. `missing_required_section: overview` on hook_contract.md is a pre-existing issue not introduced or in scope).

---

## 3. REQUIREMENTS

| ID | Priority | Requirement | Acceptance |
|---|---|---|---|
| REQ-001 | P0 | All 5 CLI SKILL.md files contain identical "Code Standards Loading (codebase-agnostic baseline+overlay contract)" canonical rule | `grep -l "Code Standards Loading (codebase-agnostic" .opencode/skill/cli-*/SKILL.md \| wc -l` returns 5 |
| REQ-002 | P0 | Zero non-anti-pattern mentions of `sk-code-review` / `sk-code-opencode` in active CLI skill files | manual inspection confirms remaining mentions are only inside the canonical NEVER-clause as anti-pattern examples |
| REQ-003 | P0 | All modified `.md` files pass `validate_document.py` (excluding pre-existing quirks not introduced by this packet) | 9/10 modified files VALID; 1 (hook_contract.md) INVALID with pre-existing `missing_required_section: overview` |
| REQ-004 | P1 | cli-codex Skill Integration table de-duplicates the two `sk-code` rows into one baseline+overlay row | visual inspection of SKILL.md §7 |
| REQ-005 | P1 | cli-opencode TEMPLATE 5 (Code Review) prompt template uses codebase-agnostic phrasing | `prompt_templates.md` TEMPLATE 5 has no `sk-code-review` / `sk-code-opencode` mentions |

---

## 4. SUCCESS CRITERIA

- All 5 CLI SKILL.md files contain the canonical baseline+overlay rule
- No hardcoded overlay-skill names propagate from CLI skills into dispatched sessions
- Cross-skill consistency: 5 identical canonical inserts
- Validator outcomes match expectations

---

## 5. RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Implementation Summary: `implementation-summary.md`
- Pattern donor: `.opencode/agent/review.md` §1 step 3, §3 capability scan, §6 fallback rule
- Approved external plan: `/Users/michelkerkmeester/.claude/plans/not-all-manual-testing-prancy-biscuit.md`
