---
title: "Verification Checklist: sk-doc README and HVR Improvements"
description: "Quality verification for HVR rules upgrade, README template upgrade and readme_creation reference."
trigger_phrases:
  - "hvr checklist"
  - "readme checklist"
  - "sk-doc verification"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: sk-doc README and HVR Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] All exemplar READMEs read and patterns extracted
- [ ] CHK-004 [P1] Agent briefs prepared with format requirements
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:d1-hvr-rules -->
## D1: HVR Rules (hvr_rules.md)

- [ ] CHK-010 [P0] File has correct frontmatter (title, description)
- [ ] CHK-011 [P0] All sections use numbered H2 ALL CAPS with `<!-- ANCHOR:slug -->` markers
- [ ] CHK-012 [P0] Structural AI-tell patterns section added (heading format, TOC, dividers, blockquote tagline)
- [ ] CHK-013 [P0] Existing word-level and phrase-level rules preserved (no deletions)
- [ ] CHK-014 [P1] Recommended structural patterns section added (comparison tables, two-tier voice)
- [ ] CHK-015 [P1] Scoring calibration updated with category weights
- [ ] CHK-016 [P1] File passes its own pre-publish checklist (0 hard blockers)
- [ ] CHK-017 [P2] Additional banned patterns added ("In simple terms" overuse, stacked analogies)
<!-- /ANCHOR:d1-hvr-rules -->

---

<!-- ANCHOR:d2-readme-template -->
## D2: README Template (readme_template.md)

- [ ] CHK-020 [P0] Overview section includes "How This Compares" table placeholder
- [ ] CHK-021 [P0] Overview section includes Key Statistics table placeholder
- [ ] CHK-022 [P0] Features section shows two-tier voice pattern (narrative 3.1 + reference 3.2)
- [ ] CHK-023 [P0] Features section uses numbered H3/H4 ALL CAPS with `---` dividers
- [ ] CHK-024 [P0] Section 14 (Complete Template) updated to match all new patterns
- [ ] CHK-025 [P1] Section 5 (Section Deep Dives) updated with two-tier voice guidance
- [ ] CHK-026 [P1] Section 7 (Style Reference) heading format table matches actual practice
- [ ] CHK-027 [P1] Existing content preserved (no removals, additions only)
- [ ] CHK-028 [P2] Before/After comparison table pattern documented in Overview patterns
<!-- /ANCHOR:d2-readme-template -->

---

<!-- ANCHOR:d3-readme-creation -->
## D3: README Creation Reference (readme_creation.md)

- [ ] CHK-030 [P0] File has correct frontmatter (title, description, trigger_phrases)
- [ ] CHK-031 [P0] All sections use numbered H2 ALL CAPS with `<!-- ANCHOR:slug -->` markers
- [ ] CHK-032 [P0] README type decision tree included (Project, Skill, Feature, Component, Code Folder)
- [ ] CHK-033 [P0] Section writing standards cover all 9 README sections
- [ ] CHK-034 [P0] Pre-publish checklist included with HVR compliance items
- [ ] CHK-035 [P1] Quality criteria section with DQI components (Structure, Content, Style)
- [ ] CHK-036 [P1] Two-tier voice principle explained with examples
- [ ] CHK-037 [P1] Cross-references to readme_template.md, hvr_rules.md, core_standards.md
- [ ] CHK-038 [P2] Analogy placement rules documented
<!-- /ANCHOR:d3-readme-creation -->

---

<!-- ANCHOR:cross-refs -->
## Cross-Reference Integrity

- [ ] CHK-040 [P0] readme_creation.md links to readme_template.md (relative path correct)
- [ ] CHK-041 [P0] readme_creation.md links to hvr_rules.md (relative path correct)
- [ ] CHK-042 [P1] readme_template.md Related Resources section links to readme_creation.md
- [ ] CHK-043 [P1] hvr_rules.md Related Resources section links to readme_creation.md
- [ ] CHK-044 [P2] All external cross-references point to real files
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:quality -->
## Quality

- [ ] CHK-050 [P0] All three files pass HVR pre-publish checklist (0 hard blockers)
- [ ] CHK-051 [P0] No content duplication between readme_creation.md and readme_template.md
- [ ] CHK-052 [P1] Voice quality reviewed (no GPT-sounding passages)
- [ ] CHK-053 [P1] install_guide_creation.md unchanged (no regressions)
- [ ] CHK-054 [P2] Consistent terminology across all three files
<!-- /ANCHOR:quality -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P1] Spec folder docs synchronized (spec.md, plan.md, tasks.md)
- [ ] CHK-061 [P1] implementation-summary.md created after completion
- [ ] CHK-062 [P2] Memory context saved
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | [ ]/16 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 5 | [ ]/5 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

---
