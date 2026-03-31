---
title: "Feature Specification: sk-doc README and HVR [03--commands-and-skills/032-sk-doc-readme-hvr-improvements/spec]"
description: "Upgrade HVR rules, README template and create a new readme_creation reference to align sk-doc with production-quality exemplars from system-spec-kit."
trigger_phrases:
  - "hvr rules upgrade"
  - "readme template improvement"
  - "readme creation reference"
  - "sk-doc documentation standards"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: sk-doc README and HVR Improvements

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
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-doc HVR rules (`../../../skill/sk-doc/references/global/hvr_rules.md`) cover word-level and punctuation-level AI tells but lack structural patterns, section-level guidance and scoring calibration learned from writing production READMEs. The README template (`../../../skill/sk-doc/assets/documentation/readme_template.md`) is comprehensive but does not reflect patterns proven in the system-spec-kit exemplars (two-tier voice, numbered Feature subsections with `---` dividers, comparison tables, analogy patterns). There is no `../../../skill/sk-doc/references/specific/readme_creation.md` reference to guide the creation workflow the way `../../../skill/sk-doc/references/specific/install_guide_creation.md` guides install guide writing.

### Purpose

Bring HVR rules, the README template and README creation guidance up to production quality by extracting patterns from the best existing READMEs (system-spec-kit README, MCP server README, Shared Memory README) and encoding them as reusable standards.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **D1: HVR Rules upgrade** -- Improve `../../../skill/sk-doc/references/global/hvr_rules.md` with structural patterns, section-level rules, scoring calibration and additional banned patterns. Maintain `../../../skill/sk-doc/assets/skill/skill_reference_template.md` format (numbered H2 ALL CAPS, anchors, frontmatter).
- **D2: README template upgrade** -- Upgrade `../../../skill/sk-doc/assets/documentation/readme_template.md` with patterns from `.opencode/skill/system-spec-kit/README.md`, `.opencode/skill/system-spec-kit/mcp_server/README.md`, and `.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md`: two-tier voice, numbered Feature subsections, comparison tables, analogy placement, `---` dividers between subsections.
- **D3: New readme_creation reference** -- Create `../../../skill/sk-doc/references/specific/readme_creation.md` modeled on `../../../skill/sk-doc/references/specific/install_guide_creation.md`. Covers workflow, section standards, quality criteria, pre-publish checklist and cross-references.

### Out of Scope

- Modifying other sk-doc reference files (core_standards.md, validation.md, etc.) -- separate task
- Changing `../../../skill/sk-doc/references/specific/install_guide_creation.md` or the related install guide template -- no regressions
- Updating `../../../skill/sk-doc/SKILL.md` routing logic -- follow-up if needed
- Changing existing production READMEs that use the current template -- those are grandfathered

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-doc/references/global/hvr_rules.md` | Modify | Add structural patterns, section-level rules, scoring calibration |
| `.opencode/skill/sk-doc/assets/documentation/readme_template.md` | Modify | Upgrade with two-tier voice, numbered subsections, comparison tables, dividers |
| `.opencode/skill/sk-doc/references/specific/readme_creation.md` | Create | New reference file for README creation workflow and standards |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | HVR rules include structural AI-tell patterns (section-level, not just word-level) | New section covering: heading casing patterns, numbered subsection format, `---` divider usage, TOC format, two-tier voice pattern |
| REQ-002 | HVR rules maintain `../../../skill/sk-doc/assets/skill/skill_reference_template.md` format | Numbered H2 ALL CAPS sections, `ANCHOR:slug` markers, frontmatter with title/description |
| REQ-003 | README template includes two-tier voice (narrative + reference) | Features section split into narrative subsection (3.1 HOW IT WORKS) and reference subsection (3.2 TECHNICAL REFERENCE) with clear guidance |
| REQ-004 | README template includes numbered Feature subsections with `---` dividers | H3 numbered ALL CAPS (e.g., `### 3.1 TOPIC`), H4 numbered ALL CAPS (e.g., `#### 3.1.1 SUBTOPIC`), horizontal rules between subsections |
| REQ-005 | `.opencode/skill/sk-doc/references/specific/readme_creation.md` follows `.opencode/skill/sk-doc/assets/skill/skill_reference_template.md` format | Frontmatter, numbered H2 ALL CAPS sections, anchors, cross-references |
| REQ-006 | `../../../skill/sk-doc/references/specific/readme_creation.md` covers the full README creation workflow | Phase-based workflow with validation checkpoints, decision tree for README type, section-specific writing guidance |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | HVR scoring system refined with weighted categories | Category weights documented (punctuation, structure, content, words, voice) with clear point penalties |
| REQ-008 | HVR rules add comparison table patterns as recommended structure | Guidance on "How This Compares" tables, Before/After tables, Key Statistics tables |
| REQ-009 | README template includes comparison table patterns in Overview section | "How This Compares" placeholder table, Key Statistics table, Key Features table |
| REQ-010 | `../../../skill/sk-doc/references/specific/readme_creation.md` includes quality criteria (DQI components) | Structure, Content, Style weights defined for README type |
| REQ-011 | `../../../skill/sk-doc/references/specific/readme_creation.md` includes pre-publish checklist | Checklist covering structure, content, quality, style and HVR compliance |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three deliverables pass `.opencode/skill/sk-doc/assets/skill/skill_reference_template.md` format validation (frontmatter, anchors, numbered H2 ALL CAPS)
- **SC-002**: HVR rules cover both word-level AND structural-level AI tells
- **SC-003**: README template, when followed, produces output matching the quality of `.opencode/skill/system-spec-kit/README.md`, `.opencode/skill/system-spec-kit/mcp_server/README.md`, and `.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md`
- **SC-004**: `../../../skill/sk-doc/references/specific/readme_creation.md` provides a complete workflow from "decide to create README" through "pre-publish checklist"
- **SC-005**: No regressions in `../../../skill/sk-doc/references/specific/install_guide_creation.md` or other sk-doc references
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | GPT-5.4 agents produce AI-sounding prose that needs heavy editing | Med | Claude reviews all agent output before acceptance. Agents handle structure/research, Claude handles voice refinement |
| Risk | HVR rule changes could retroactively invalidate existing READMEs | Low | Changes are additive (new rules), not breaking. Existing docs grandfathered |
| Dependency | `.opencode/skill/system-spec-kit/README.md`, `.opencode/skill/system-spec-kit/mcp_server/README.md`, and `.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md` as exemplars | None (already committed) | Files exist and are stable |
| Risk | `.opencode/skill/sk-doc/references/specific/readme_creation.md` overlaps with `.opencode/skill/sk-doc/assets/documentation/readme_template.md` content | Med | Clear separation: template = scaffold to fill, creation reference = workflow + standards + quality criteria |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Quality

- **NFR-Q01**: All output files score 0 hard blocker violations when checked against HVR rules
- **NFR-Q02**: All files use consistent heading hierarchy (H1 > H2 > H3 > H4, no skips)

### Maintainability

- **NFR-M01**: `.opencode/skill/sk-doc/references/specific/readme_creation.md` cross-references `.opencode/skill/sk-doc/assets/documentation/readme_template.md` and `.opencode/skill/sk-doc/references/global/hvr_rules.md` without duplicating their content
- **NFR-M02**: HVR rule additions use the same YAML/table/code-block patterns as existing rules

### Compatibility

- **NFR-C01**: Changes are backward-compatible with existing READMEs using the prior template version
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Content Boundaries

- Minimal README (Component/Code Folder type): template must still work when optional sections are removed
- Feature-heavy README (20+ features): numbered subsection format must scale without ambiguity

### Template Usage

- User fills the template without reading `.opencode/skill/sk-doc/references/specific/readme_creation.md`: template placeholders must be self-explanatory
- AI agent fills template: anchors and placeholder format must be parseable

### HVR Scoring

- Document with 0 hard blockers but many soft deductions: scoring guidance must clarify pass/fail thresholds
- Technical content with legitimate use of "scalable" or "robust": context-dependent rules must be clear
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 3 files, ~400 LOC changes, single skill domain |
| Risk | 8/25 | Low risk -- documentation changes only, no code logic |
| Research | 10/20 | Moderate -- need to extract patterns from exemplar READMEs |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. All requirements are clear from the existing exemplar files and the user's instruction.
<!-- /ANCHOR:questions -->

---
