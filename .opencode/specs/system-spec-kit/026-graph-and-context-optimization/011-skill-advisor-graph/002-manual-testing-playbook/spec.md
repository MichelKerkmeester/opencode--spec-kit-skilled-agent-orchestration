---
title: "Feature Specification: Playbook Template Alignment"
description: "Align the full 24-scenario playbook package and root operator guide with live skill-advisor/scripts paths and the correct template contract."
trigger_phrases:
  - "002-manual-testing-playbook"
  - "playbook alignment"
  - "playbook template"
  - "RCAF prompts"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/002-manual-testing-playbook"
    last_updated_at: "2026-04-13T21:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Loaded deep-review findings and identified stale scope, path, and metadata language across the packet"
    next_safe_action: "Normalize routing-accuracy prose paths and refresh packet acceptance criteria for the full 24-scenario corpus"
    key_files: ["spec.md", "plan.md", "tasks.md"]
---
# Feature Specification: Playbook Template Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

Align the full manual testing playbook package with current reality: all 24 scenario snippets follow the sk-doc 5-section/RCAF snippet contract, the root `manual_testing_playbook.md` remains a multi-section operator guide, and every Skill Advisor runtime path reference uses `.opencode/skill/skill-advisor/scripts/...` rather than bare `skill-advisor/...` or the retired `.opencode/skill/scripts/...` location.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-13 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `001-research-findings-fixes` |

---

## 2. PROBLEM STATEMENT

The 24 scenario snippets are already template-aligned, but the packet still carries stale follow-up language: several packet docs still describe the retired path policy, the routing-accuracy prose still mentions bare `skill_advisor.py` / `skill-graph.json`, and the root guide understates the live feature-catalog surface. This inconsistency means:

- Operators receive conflicting guidance about which runtime paths are valid
- Auditors cannot tell whether the root guide is intentionally different from the 24 scenario snippets
- Cross-reference evidence understates the live feature-catalog surface
- Packet acceptance criteria and playbook prose no longer describe the live runtime paths or full playbook package

### Current State (per category)

| Category | Files | Template Aligned? | Format |
|----------|-------|-------------------|--------|
| 01--routing-accuracy | 8 | Yes | 5-section, RCAF, frontmatter |
| 02--graph-boosts | 7 | Yes | 5-section, RCAF, frontmatter |
| 03--compiler | 5 | Yes | 5-section, RCAF, frontmatter |
| 04--regression-safety | 4 | Yes | 5-section, RCAF, frontmatter |
| Root playbook | 1 | Distinct by design | Multi-section operator guide with TOC, review policy, and cross-reference index |

---

## 3. SCOPE

### In Scope
- Verify that all 24 scenario snippets follow the sk-doc 5-section/RCAF snippet contract
- Preserve the root `manual_testing_playbook.md` as the canonical multi-section operator guide for the package
- Normalize every Skill Advisor runtime path reference to `.opencode/skill/skill-advisor/scripts/skill_advisor.py` or `.opencode/skill/skill-advisor/scripts/skill-graph.json`
- Refresh packet metadata, verification language, and task wording so they describe the full 24-scenario corpus plus the root guide

### Out of Scope
- Creating new test scenarios beyond the existing 24
- Changing the skill_advisor.py code
- Replacing live `.opencode/skill/skill-advisor/scripts/` runtime paths with bare `skill-advisor/` references or the retired `.opencode/skill/scripts/` location

---

## 4. TEMPLATE CONTRACT

### Snippet Template (sk-doc)

Source: `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md`

Required sections:
1. **OVERVIEW** — scenario description + "Why This Matters"
2. **CURRENT REALITY** — objective, real user request, RCAF prompt, expected signals, pass/fail
3. **TEST EXECUTION** — prompt, commands, expected, evidence, pass/fail, failure triage
4. **SOURCE FILES** — playbook sources + implementation/test anchors table
5. **SOURCE METADATA** — group, playbook ID, root source, file path

### RCAF Prompt Pattern

```
As a {ROLE} validation operator, {ACTION} against {TARGET}. Verify {EXPECTED_OUTCOME}. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Reference Example

Already-aligned file: `.opencode/skill/skill-advisor/manual_testing_playbook/01--routing-accuracy/001-git-routing.md`

---

## 5. KEY FILES

| File | Action |
|------|--------|
| `.opencode/skill/skill-advisor/manual_testing_playbook/01--routing-accuracy/001-git-routing.md` through `008-semantic-search-routing.md` | Normalize prose path references (8) |
| `.opencode/skill/skill-advisor/manual_testing_playbook/02--graph-boosts/001-dependency-pullup.md` through `007-prerequisite-for.md` | Verify rewritten snippet contract (7) |
| `.opencode/skill/skill-advisor/manual_testing_playbook/03--compiler/001-schema-validation.md` through `005-health-check.md` | Verify rewritten snippet contract (5) |
| `.opencode/skill/skill-advisor/manual_testing_playbook/04--regression-safety/001-full-regression.md` through `004-abstain-noise.md` | Verify rewritten snippet contract (4) |
| `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md` | Refresh root guide and feature-catalog cross-reference |

---

## 6. SUCCESS CRITERIA

- [ ] All 24 scenario snippets follow the 5-section sk-doc template structure
- [ ] All 24 scenario snippets contain RCAF-pattern prompts in sections 2 and 3
- [ ] All 24 scenario snippets have frontmatter with title and description
- [ ] All 24 scenario snippets have "Why This Matters" in section 1
- [ ] All 24 scenario snippets have failure triage in section 3
- [ ] All 24 scenario snippets have source files table in section 4
- [ ] Root playbook is treated as a multi-section operator guide, not a 5-section snippet
- [ ] All Skill Advisor command paths use `.opencode/skill/skill-advisor/scripts/skill_advisor.py` rather than bare `skill-advisor/skill_advisor.py` or `.opencode/skill/scripts/skill_advisor.py`
- [ ] All `skill-graph.json` references use `.opencode/skill/skill-advisor/scripts/skill-graph.json`
- [ ] Root playbook matches system-spec-kit root playbook format
- [ ] Root playbook points to the live `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md` surface
