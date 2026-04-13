---
title: "Feature Specification: Skill Advisor Packaging"
description: "Rename scripts/ to skill-advisor/, create sk-doc-aligned manual testing playbook (24 scenarios) and feature catalog, update all references."
trigger_phrases:
  - "003-skill-advisor-packaging"
  - "skill advisor packaging"
  - "skill-advisor playbook"
  - "skill-advisor feature catalog"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/003-skill-advisor-packaging"
    last_updated_at: "2026-04-13T18:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "18 catalog files + root created by copilot GPT-5.4; scripts moved to scripts/ subfolder; paths need update in catalog/playbook"
    next_safe_action: "Update command paths in catalog and playbook from skill-advisor/skill_advisor.py to skill-advisor/scripts/skill_advisor.py"
    key_files: ["spec.md"]

---
# Feature Specification: Skill Advisor Packaging

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

Promote the skill advisor from a loose `scripts/` folder to a proper skill package at `.opencode/skill/skill-advisor/`. Add a manual testing playbook (24 scenarios, 4 categories) and feature catalog (~20 features, 4 categories) aligned with sk-doc templates and matching the system-spec-kit examples.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-13 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `002-manual-testing-playbook` |

---

## 2. WHAT CHANGED SO FAR

### Done
- The legacy shared scripts directory under `.opencode/skill` was renamed to `.opencode/skill/skill-advisor/` (Copilot GPT-5.4 session)
- `skill_advisor.py`, `skill_graph_compiler.py`, `skill-graph.json`, regression harness all work at new path (self-relative paths)
- Empty `manual_testing_playbook/` and `feature_catalog/` directory structures created with category subdirs
- `01--routing-accuracy/` playbook snippets (8 files) rewritten to sk-doc template format with RCAF prompts

### Pending
- Rewrite remaining 16 playbook snippets (02--graph-boosts, 03--compiler, 04--regression-safety) to sk-doc template
- Rewrite root `MANUAL_TESTING_PLAYBOOK.md` to match system-spec-kit root playbook format
- Create root `FEATURE_CATALOG.md` matching system-spec-kit root catalog format
- Create all ~20 per-feature catalog files matching sk-doc snippet template
- Update references in CLAUDE.md from `scripts/` to `skill-advisor/`
- Update `skill_advisor.py` Gate 2 invocation path in CLAUDE.md
- Add `graph-metadata.json` for skill-advisor skill folder

---

## 3. SCOPE

### In Scope
- Manual testing playbook: 24 scenarios across 4 categories
  - 01--routing-accuracy (8): git, review, figma, CLI, spec, deep-review, prompt, search
  - 02--graph-boosts (7): dependency pull-up, enhances, ghost guard, family, evidence separation, hub edges, prerequisite_for
  - 03--compiler (5): schema validation, zero-edge warnings, signals, size, health
  - 04--regression-safety (4): full suite, P0 cases, graph cases, noise abstain
- Feature catalog: ~20 features across 4 categories
  - 01--routing-pipeline (6): discovery, normalization, keyword boosting, phrase boosting, calibration, filtering
  - 02--graph-system (8): metadata, compiler, compiled graph, transitive boosts, family affinity, conflict penalty, ghost guard, evidence separation
  - 03--semantic-search (2): CocoIndex integration, auto-triggers
  - 04--testing (2): regression harness, health check
- All files must use sk-doc templates with RCAF prompt pattern
- Root files must match system-spec-kit style (frontmatter, TOC, numbered all-caps H2s)

### Out of Scope
- Creating a SKILL.md for skill-advisor (could be future work)
- Moving graph-metadata.json files from individual skill folders
- Changing the skill_advisor.py code

---

## 4. TEMPLATES TO FOLLOW

| Artifact | Template | Example |
|----------|----------|---------|
| Playbook snippet | `sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md` | `system-spec-kit/manual_testing_playbook/01--retrieval/001-unified-context-retrieval-memory-context.md` |
| Playbook root | (system-spec-kit root playbook pattern) | `system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` |
| Catalog snippet | `sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md` | `system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md` |
| Catalog root | (system-spec-kit root catalog pattern) | `system-spec-kit/feature_catalog/FEATURE_CATALOG.md` |

### Prompt Pattern (RCAF)
All playbook prompts MUST use: `As a {role} validation operator, {action} against {target}. Verify {expected}. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Snippet Structure (5 sections)
1. OVERVIEW (with "Why This Matters")
2. CURRENT REALITY (objective, real user request, prompt, expected signals, pass/fail)
3. TEST EXECUTION (prompt, commands, expected, evidence, pass/fail, failure triage)
4. SOURCE FILES (implementation + test anchors table)
5. SOURCE METADATA (group, playbook ID, root source, file path)

---

## 5. KEY FILES

| File | Status |
|------|--------|
| `.opencode/skill/skill-advisor/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` | Needs rewrite |
| `.opencode/skill/skill-advisor/manual_testing_playbook/01--routing-accuracy/*.md` (8) | Done |
| `.opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/*.md` (7) | Needs rewrite |
| `.opencode/skill/skill-advisor/manual_testing_playbook/03--compiler/*.md` (5) | Needs rewrite |
| `.opencode/skill/skill-advisor/manual_testing_playbook/04--regression-safety/*.md` (4) | Needs rewrite |
| `.opencode/skill/skill-advisor/feature_catalog/FEATURE_CATALOG.md` | Needs creation |
| `.opencode/skill/skill-advisor/feature_catalog/01--routing-pipeline/*.md` (6) | Needs creation |
| `.opencode/skill/skill-advisor/feature_catalog/02--graph-system/*.md` (8) | Needs creation |
| `.opencode/skill/skill-advisor/feature_catalog/03--semantic-search/*.md` (2) | Needs creation |
| `.opencode/skill/skill-advisor/feature_catalog/04--testing/*.md` (2) | Needs creation |
