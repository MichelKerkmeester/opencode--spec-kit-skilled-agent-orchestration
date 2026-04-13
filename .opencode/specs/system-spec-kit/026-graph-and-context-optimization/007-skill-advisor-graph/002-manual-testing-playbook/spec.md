---
title: "Feature Specification: Playbook Template Alignment"
description: "Rewrite 16 playbook snippets (02/03/04 categories) and root playbook to sk-doc template format with RCAF prompts."
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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/002-manual-testing-playbook"
    last_updated_at: "2026-04-13T21:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "16 snippets + root rewritten by copilot GPT-5.4; paths need scripts/ update"
    next_safe_action: "Update command paths in all playbook files from skill-advisor/skill_advisor.py to skill-advisor/scripts/skill_advisor.py"
    key_files: ["spec.md", "plan.md", "tasks.md"]
---
# Feature Specification: Playbook Template Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

Rewrite 16 playbook snippets (categories 02--graph-boosts, 03--compiler, 04--regression-safety) and the root `manual_testing_playbook.md` to match the sk-doc playbook snippet template with RCAF-pattern prompts. The 01--routing-accuracy category (8 files) is already aligned and serves as the reference pattern.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-13 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `001-research-findings-fixes` |

---

## 2. PROBLEM STATEMENT

The 01--routing-accuracy playbook snippets follow the sk-doc template (5 sections, RCAF prompts, frontmatter, "Why This Matters", failure triage, source files tables). The remaining 16 snippets across 3 categories are minimal 15-25 line stubs with only a command, expected output, and pass/fail. This inconsistency means:

- Operators cannot follow a uniform testing process
- No structured failure triage for graph boost, compiler, or regression scenarios
- No source file anchors linking scenarios to implementation code
- Root playbook references stale `scripts/` paths

### Current State (per category)

| Category | Files | Template Aligned? | Format |
|----------|-------|-------------------|--------|
| 01--routing-accuracy | 8 | Yes | 5-section, RCAF, frontmatter |
| 02--graph-boosts | 7 | No | 15-20 line stubs |
| 03--compiler | 5 | No | 15-20 line stubs |
| 04--regression-safety | 4 | No | 15-20 line stubs |
| Root playbook | 1 | Partial | Has TOC but uses `scripts/` paths, missing execution policy |

---

## 3. SCOPE

### In Scope
- Rewrite 7 graph-boost snippets to sk-doc template (5 sections, RCAF prompts)
- Rewrite 5 compiler snippets to sk-doc template
- Rewrite 4 regression-safety snippets to sk-doc template
- Rewrite root `manual_testing_playbook.md` to match system-spec-kit root format
- Fix all `scripts/` → `skill-advisor/` path references in all 17 files

### Out of Scope
- 01--routing-accuracy snippets (already aligned)
- Creating new test scenarios beyond the existing 24
- Changing the skill_advisor.py code
- Feature catalog (covered by Phase 003)

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
| `02--graph-boosts/001-dependency-pullup.md` through `007-prerequisite-for.md` | Rewrite (7) |
| `03--compiler/001-schema-validation.md` through `005-health-check.md` | Rewrite (5) |
| `04--regression-safety/001-full-regression.md` through `004-abstain-noise.md` | Rewrite (4) |
| `manual_testing_playbook.md` | Rewrite root |
| `01--routing-accuracy/001-git-routing.md` | Reference (read-only) |

---

## 6. SUCCESS CRITERIA

- [ ] All 16 snippets follow the 5-section sk-doc template structure
- [ ] All 16 snippets contain RCAF-pattern prompts in sections 2 and 3
- [ ] All 16 snippets have frontmatter with title and description
- [ ] All 16 snippets have "Why This Matters" in section 1
- [ ] All 16 snippets have failure triage in section 3
- [ ] All 16 snippets have source files table in section 4
- [ ] Root playbook uses `skill-advisor/` paths (not `scripts/`)
- [ ] Root playbook matches system-spec-kit root playbook format
- [ ] Zero references to `scripts/` remain in any playbook file
