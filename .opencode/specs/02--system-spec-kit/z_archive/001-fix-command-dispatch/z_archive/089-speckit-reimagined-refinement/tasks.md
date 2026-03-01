---
title: "Tasks: system-spec-kit Reimagined Refinement [089-speckit-reimagined-refinement/tasks]"
description: "title: \"Tasks: system-spec-kit Reimagined Refinement\""
trigger_phrases:
  - "tasks"
  - "system"
  - "spec"
  - "kit"
  - "reimagined"
  - "089"
  - "speckit"
importance_tier: "normal"
contextType: "implementation"
spec: "089"
total-tasks: 28
---
# Tasks: system-spec-kit Reimagined Refinement

---

## Phase 1: CRITICAL (P0)

| # | Task | File(s) | Status | Notes |
|---|------|---------|--------|-------|
| 1.1 | Fix filters.jsonc path in content-filter.js | `mcp_server/tools/memory-save.js` chain | [ ] | Path resolves 2 dirs up, needs 3 + config/ |
| 1.2 | Fix camelCase/snake_case mismatch in filters config | `config/filters.jsonc` + `content-filter.js` | [ ] | Keys don't match between config and code |
| 1.3 | Fix LIKE injection in resolve_memory_reference | `mcp_server/tools/memory-save.js` | [ ] | Escape %, _ in user input for LIKE patterns |
| 1.4 | Reconcile LOC counts across 3 documents | `SKILL.md`, `level_specifications.md`, `level_selection_guide.md` | [ ] | Count actual LOC, update all 3 |
| 1.5 | Fix Voyage model version contradiction | `embedding_resilience.md`, `environment_variables.md` | [ ] | voyage-3 vs voyage-4 |

## Phase 2: HIGH (P1)

| # | Task | File(s) | Status | Notes |
|---|------|---------|--------|-------|
| 2.1 | Replace eval in validate.sh get_rule_severity | `scripts/spec/validate.sh` | [ ] | Security: use case/array instead |
| 2.2 | Fix create.sh %d truncation for "3+" | `scripts/spec/create.sh` | [ ] | String handling, not printf %d |
| 2.3 | Verify 6x AGENTS.md references in SKILL.md (reverted incorrect CLAUDE.md changes) | `SKILL.md` | [ ] | AGENTS.md is canonical name per Spec 087 |
| 2.4 | Fix SKILL.md command format (.yaml → .md) | `SKILL.md` | [ ] | Command files are markdown |
| 2.5 | Fix validate-spec.sh → validate.sh in SKILL.md | `SKILL.md` | [ ] | Script was renamed |
| 2.6 | Fix generate-context.js line count (142 → 277) | `SKILL.md` | [ ] | Outdated line count |
| 2.7 | Fix Level range "1-3" → "1-3+" in SKILL.md | `SKILL.md` | [ ] | Missing 3+ level |
| 2.8 | Fix template architecture version v2.0/v2.2 | `SKILL.md` | [ ] | Inconsistent version refs |
| 2.9 | Fix BUG-01: validate-spec.sh path (3 files) | `path_scoped_rules.md`, `template_style_guide.md` | [ ] | → spec/validate.sh |
| 2.10 | Fix BUG-02: non-existent scripts/rules/ dir | `template_style_guide.md` | [ ] | Remove or correct refs |
| 2.11 | Fix BUG-03: memory_system.md wrong subdir | `environment_variables.md` | [ ] | workflows/ → memory/ |
| 2.12 | Fix BUG-04/05: template paths in five-checks.md | `five-checks.md` | [ ] | Add level subdirectory |
| 2.13 | Fix BUG-06: complexity_guide → level_selection_guide | `level_specifications.md` | [ ] | File was renamed |
| 2.14 | Fix BUG-07: AGENTS.md relative path depth | `decision-format.md` | [ ] | 4 levels → 6 levels |
| 2.15 | Fix BUG-08: non-existent root README.md ref | `troubleshooting.md` | [ ] | → SKILL.md or correct path |
| 2.16 | Fix assets broken spec.md references (2 files) | `level_decision_matrix.md`, `parallel_dispatch_config.md` | [ ] | spec.md doesn't exist |
| 2.17 | Fix assets template_guide.md broken link | `template_mapping.md` | [ ] | Add proper relative path |
| 2.18 | Add Level 3+ to template_mapping.md | `template_mapping.md` | [ ] | Currently absent |
| 2.19 | Fix orchestrate.md mode: primary → agent | `agent/orchestrate.md` | [ ] | Invalid frontmatter value |
| 2.20 | Fix write.md mode: all → agent + add task permission | `agent/write.md` | [ ] | Invalid mode, missing tool |
| 2.21 | Add intro paragraph to review.md | `agent/review.md` | [ ] | Missing mandatory section |
| 2.22 | Add @handover to orchestrate capability map | `agent/orchestrate.md` | [ ] | Agent missing from map |
| 2.23 | Add Section 0 to orchestrate.md | `agent/orchestrate.md` | [ ] | Missing Model Preference |
| 2.24 | Remove project-specific Spec 082 ref from speckit.md | `agent/speckit.md` | [ ] | Framework file, not project |

## Phase 3: MEDIUM (P2)

| # | Task | File(s) | Status | Notes |
|---|------|---------|--------|-------|
| 3.1 | Clean up dead config sections (2-11) or wire them | `config/config.jsonc` | [ ] | Document active vs dead |
| 3.2 | Remove/deprecate complexity-config.jsonc | `config/complexity-config.jsonc` | [ ] | Entirely unused |
| 3.3 | Fix config/README.md false function claims | `config/README.md` | [ ] | Claims non-existent functions |
| 3.4 | Remove phantom entries from scripts-registry.json | `scripts/scripts-registry.json` | [ ] | check-completion.sh, setup.sh |
| 3.5 | Consolidate deprecated content in level_selection_guide | `references/templates/level_selection_guide.md` | [ ] | ~70 lines of deprecated COMPLEXITY_GATE |
| 3.6 | Archive 081 pre-analysis as SUPERSEDED | `specs/003-*/081-*/` (8 files) | [ ] | Add headers, create summary |

## Phase 4: LOW

| # | Task | File(s) | Status | Notes |
|---|------|---------|--------|-------|
| 4.1 | Fix indentation in memory-search.js | `mcp_server/tools/memory-search.js` | [ ] | Multi-concept validation |
| 4.2 | Consolidate ALLOWED_BASE_PATHS to single import | Multiple MCP files | [ ] | Currently duplicated in 3 files |
| 4.3 | Fix extractKeyTopics min word length | `scripts/memory/generate-context.js` | [ ] | 3 misses "db", "ui", "js" |
| 4.4 | Add block comment support to JSONC parser | `scripts/utils/parse-jsonc.js` | [ ] | Only handles // comments |
| 4.5 | Update agent model versions (Opus 4.5 → 4.6) | All agent .md files | [ ] | Staleness issue |
| 4.6 | Reconcile MCP tool count (22 vs 14) | `SKILL.md`, `memory_system.md` | [ ] | Discrepancy |
| 4.7 | Standardize memory file date format | `folder_structure.md`, `save_workflow.md` | [ ] | ISO vs DD-MM-YY |

---

## Summary

| Phase | Tasks | Priority | Status |
|-------|-------|----------|--------|
| Phase 1 | 5 | P0 CRITICAL | [ ] Not started |
| Phase 2 | 19 | P1 HIGH | [ ] Not started |
| Phase 3 | 6 | P2 MEDIUM | [ ] Not started |
| Phase 4 | 7 | LOW | [ ] Not started |
| **Total** | **37** | | |
