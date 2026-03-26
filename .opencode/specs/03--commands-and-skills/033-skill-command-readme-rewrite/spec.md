---
title: "Feature Specification: Skill and Command README Rewrite"
description: "Rewrite all skill READMEs and command READMEs from scratch using the upgraded readme_creation.md standards, two-tier voice and HVR v0.210 compliance."
trigger_phrases:
  - "skill readme rewrite"
  - "command readme rewrite"
  - "readme overhaul"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: Skill and Command README Rewrite

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-26 |
| **Branch** | `main` |
| **Predecessor** | `specs/03--commands-and-skills/032-sk-doc-readme-hvr-improvements` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Skill READMEs and command READMEs vary in quality, structure and voice. Most lack two-tier voice, comparison tables, numbered Feature subsections and HVR compliance. The recently upgraded `readme_creation.md` and `hvr_rules.md` (spec 032) define production-quality standards that no existing skill README meets except the system-spec-kit exemplars.

### Purpose

Rewrite all 23 READMEs from scratch to match the quality demonstrated by `system-spec-kit/README.md` and `mcp_server/README.md`, applying the full `readme_creation.md` workflow and `hvr_rules.md` v0.210 standards.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**19 Skill READMEs** (rewrite from scratch as `.md`):

| # | Skill | Path |
|---|-------|------|
| 1 | Skill root | `.opencode/skill/README.md` |
| 2 | cli-claude-code | `.opencode/skill/cli-claude-code/README.md` |
| 3 | cli-codex | `.opencode/skill/cli-codex/README.md` |
| 4 | cli-copilot | `.opencode/skill/cli-copilot/README.md` |
| 5 | cli-gemini | `.opencode/skill/cli-gemini/README.md` |
| 6 | mcp-chrome-devtools | `.opencode/skill/mcp-chrome-devtools/README.md` |
| 7 | mcp-clickup | `.opencode/skill/mcp-clickup/README.md` |
| 8 | mcp-coco-index | `.opencode/skill/mcp-coco-index/README.md` |
| 9 | mcp-code-mode | `.opencode/skill/mcp-code-mode/README.md` |
| 10 | mcp-figma | `.opencode/skill/mcp-figma/README.md` |
| 11 | scripts | `.opencode/skill/scripts/README.md` |
| 12 | sk-code--full-stack | `.opencode/skill/sk-code--full-stack/README.md` |
| 13 | sk-code--opencode | `.opencode/skill/sk-code--opencode/README.md` |
| 14 | sk-code--review | `.opencode/skill/sk-code--review/README.md` |
| 15 | sk-code--web | `.opencode/skill/sk-code--web/README.md` |
| 16 | sk-deep-research | `.opencode/skill/sk-deep-research/README.md` |
| 17 | sk-doc | `.opencode/skill/sk-doc/README.md` |
| 18 | sk-git | `.opencode/skill/sk-git/README.md` |
| 19 | sk-prompt-improver | `.opencode/skill/sk-prompt-improver/README.md` |

**4 Command READMEs** (rewrite from scratch, convert `.txt` to `.md`):

| # | Command | Current Path | New Path |
|---|---------|-------------|----------|
| 20 | Command root | `.opencode/command/README.txt` | `.opencode/command/README.md` |
| 21 | create | `.opencode/command/create/README.txt` | `.opencode/command/create/README.md` |
| 22 | memory | `.opencode/command/memory/README.txt` | `.opencode/command/memory/README.md` |
| 23 | spec_kit | `.opencode/command/spec_kit/README.txt` | `.opencode/command/spec_kit/README.md` |

### Out of Scope

- `system-spec-kit/README.md` -- exemplar, do not touch
- `system-spec-kit/mcp_server/README.md` -- exemplar, do not touch
- `system-spec-kit/SHARED_MEMORY_DATABASE.md` -- exemplar, do not touch
- SKILL.md files -- only READMEs are in scope
- Any non-README documentation

### Standards to Apply

Every README must follow:
- `readme_creation.md` workflow (Section 5 structural format rules, Section 7 pre-publish checklist)
- `readme_template.md` 9-section structure (use Skill type: Overview, Quick Start, Features, Structure, Configuration, Usage Examples, Troubleshooting, FAQ, Related Documents)
- `hvr_rules.md` v0.210 (0 hard blockers, structural patterns, voice personality)
- Two-tier voice (narrative + reference) for all Skill type READMEs
- Blockquote tagline after H1
- Numbered H2 ALL CAPS, numbered H3/H4 ALL CAPS for Feature subsections
- TOC with double-dash anchors
- Key Statistics table, Key Features table in Overview
- Comparison table where applicable
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every README follows 9-section structure | All applicable sections present per readme_creation.md Section 3 type matrix |
| REQ-002 | Every README has blockquote tagline after H1 | One-sentence tagline in `>` blockquote |
| REQ-003 | Every README uses numbered H2 ALL CAPS with anchors | `## N. SECTION NAME` + `<!-- ANCHOR:slug -->` markers |
| REQ-004 | Every README passes HVR pre-publish checklist | 0 hard blocker words, 0 em dashes, 0 semicolons |
| REQ-005 | Command READMEs converted from .txt to .md | Old .txt files removed, new .md files in place |
| REQ-006 | Content sourced from each skill's SKILL.md | README explains the skill accurately based on its SKILL.md |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Two-tier voice in Features section | Narrative subsection (3.1) + Reference subsection (3.2) with --- dividers |
| REQ-008 | Key Statistics and Key Features tables in Overview | At least one metrics table per README |
| REQ-009 | TOC with double-dash anchor format | All H2 entries, subsection entries for Features |
| REQ-010 | Troubleshooting section with 3+ entries | "What you see / Common causes / Fix" format |
| REQ-011 | FAQ section with 2+ questions per category | Bold Q: / A: format |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 23 READMEs match the quality standard of system-spec-kit/README.md
- **SC-002**: 0 HVR hard blocker violations across all files
- **SC-003**: Every README is self-contained (understandable without reading SKILL.md)
- **SC-004**: Command .txt files replaced with .md files
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Context window exhaustion (23 files) | High | Batch in groups of 4-5 per session, or use parallel agents |
| Risk | Skill-specific content requires reading each SKILL.md | Med | Read SKILL.md before writing each README |
| Dependency | readme_creation.md and hvr_rules.md (spec 032) | Green | Completed in this session |
| Dependency | system-spec-kit READMEs as exemplars | Green | Stable, do not modify |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 23 files, ~500-800 LOC each, single domain |
| Risk | 5/25 | Low risk, documentation only |
| Research | 12/20 | Must read each SKILL.md to extract content |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Standards, exemplars and file list are all defined.
<!-- /ANCHOR:questions -->

---
