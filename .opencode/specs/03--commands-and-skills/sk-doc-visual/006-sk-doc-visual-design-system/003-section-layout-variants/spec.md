---
title: "Feature Specification: Section Layout Variants"
description: "Generate structurally distinct HTML layout variants across 8 documentation sections using two design systems (Untitled UI and Shadcn Zinc) via prompt-driven AI generation."
trigger_phrases:
  - "section layout variants"
  - "sk-doc-visual variants"
  - "layout exploration"
  - "section design alternatives"
  - "untitled ui variants"
  - "shadcn zinc variants"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: Section Layout Variants

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-02-28 |
| **Updated** | 2026-03-01 |
| **Parent** | `006-sk-doc-visual-design-system` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each of the 8 standard documentation sections (hero, quick-start, feature-grid, operations-overview, setup-and-usage, support, extensibility, related-documents) has only one layout. This limits visual diversity, makes it difficult to evaluate alternative information architectures and provides no basis for selecting the best layout per use case.

### Purpose
Generate structurally distinct layout variants for each of the 8 sections using two professional design systems as aesthetic foundations. Phase 1 uses the Untitled UI design system (light theme, purple brand, skeumorphic shadows). Phase 2 uses the Shadcn Zinc design system (light theme, minimal ring elevation, HSL tokens). Each phase produces 5 variants per section (40 per phase, 80 total) so the design system has a curated library of layout alternatives across two distinct visual languages.

### Evolution
This spec evolved from an initial Python-scripted approach (58 variants via `run_section_variants.py` and `run_section_variants_engaged.py`) to a structured prompt-driven approach. The new method uses master CSS vocabulary templates paired with section-specific prompts, giving finer control over design system adherence and enabling generation via direct Gemini CLI invocation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research layout patterns and documentation best practices (completed)
- Create master CSS variable vocabulary and component recipe templates for Untitled UI and Shadcn Zinc
- Create 8 section-specific generation prompts per design system (16 total)
- Generate 5 layout variants per section per design system (80 total HTML files)
- Include design system source code as reference material for each phase
- Validate outputs against design-system-specific token adherence, accessibility and anti-pattern guardrails
- Create `README.md` for the sk-doc-visual skill

### Out of Scope
- Selecting or promoting any variant into the production section library
- Modifying existing baseline section templates
- Browser-based visual QA or cross-browser testing
- Integration of variants into the sk-doc-visual skill pipeline
- Dark theme variants (both phases are light-theme only)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/phase-1—untitled-ui/prompts/00-master-template.prompt.md` | Created | Full Untitled UI CSS vocabulary, component recipes, boilerplate and validation checklist |
| `scratch/phase-1—untitled-ui/prompts/01-08-*.prompt.md` | Created | 8 section-specific prompts for Untitled UI (5 variants each) |
| `scratch/phase-1—untitled-ui/output-from-gemini/{section}/` | Pending | 40 standalone HTML layout variants |
| `scratch/phase-1—untitled-ui/logs/{section}/` | Pending | Generation logs per section |
| `scratch/phase-2—shadcn/prompts/00-master-template.prompt.md` | Created | Full Shadcn Zinc CSS vocabulary, component recipes, boilerplate and validation checklist |
| `scratch/phase-2—shadcn/prompts/01-08-*.prompt.md` | Created | 8 section-specific prompts for Shadcn Zinc (5 variants each) |
| `scratch/phase-2—shadcn/output-from-gemini/{section}/` | Pending | 40 standalone HTML layout variants |
| `scratch/phase-2—shadcn/logs/{section}/` | Pending | Generation logs per section |
| `.opencode/skill/sk-doc-visual/README.md` | Created | Skill README matching sk-doc style |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 5 layout variants per section per phase, 8 sections, 2 phases | 80 HTML files across `scratch/phase-1—untitled-ui/output-from-gemini/` and `scratch/phase-2—shadcn/output-from-gemini/` |
| REQ-002 | Each variant follows a structurally distinct layout strategy | 5 DNA seeds per section prompt enforce different information architecture |
| REQ-003 | Phase 1 outputs use Untitled UI token vocabulary exclusively | All colors via `var(--token)`, skeumorphic shadows, Inter + Roboto Mono fonts |
| REQ-004 | Phase 2 outputs use Shadcn Zinc token vocabulary exclusively | All colors via `hsl(var(--token))`, ring-1 elevation, Geist Sans + Geist Mono fonts |
| REQ-005 | No flashy or forbidden patterns in any outputs | No `neon`, `particle`, `parallax`, `3d transform`, `setInterval`, no JavaScript |
| REQ-006 | Accessibility baseline in all outputs | `prefers-reduced-motion` media query, `color-scheme` meta tag, semantic HTML |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Master templates provide complete design system vocabulary | Full `:root` tokens, component recipes, base styles, boilerplate and self-validation checklist per phase |
| REQ-008 | Prompts are self-contained and reproducible | Each prompt contains role, task, context injection point, instructions, validation checklist |
| REQ-009 | Design system source code included as reference | `untitled-ui/` and `shadcn/` directories contain original source for cross-referencing |
| REQ-010 | sk-doc-visual README.md created | README follows sk-doc style with 8 sections, anchors, HVR compliance |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 80 standalone HTML variant files generated across 2 phases and 8 sections
- **SC-002**: Each variant is structurally distinct from others in the same section (different information flow, container strategy or grouping logic)
- **SC-003**: Phase 1 outputs pass Untitled UI self-validation checklist (token adherence, skeumorphic patterns, Google Fonts link)
- **SC-004**: Phase 2 outputs pass Shadcn Zinc self-validation checklist (HSL tokens, ring elevation, no Google Fonts link, calc radii)
- **SC-005**: No cross-contamination between design systems (no Shadcn patterns in Phase 1, no Untitled UI patterns in Phase 2)
- **SC-006**: Generation process is documented and reproducible via structured prompts
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Gemini CLI availability | High | Prompts are CLI-agnostic and can run via API fallback |
| Dependency | Untitled UI source code in `scratch/phase-1—untitled-ui/untitled-ui/` | Medium | Master template is self-contained with all tokens extracted |
| Dependency | Shadcn source code in `scratch/phase-2—shadcn/shadcn/` | Medium | Master template is self-contained with all tokens extracted |
| Risk | Model output quality variance | Medium | Self-validation checklist embedded in each prompt, forbidden pattern lists |
| Risk | Cross-contamination between design systems | Medium | Separate master templates with explicit forbidden patterns (e.g. Phase 2 forbids skeumorphic `::before`) |
| Risk | Variant homogeneity despite different DNA seeds | Medium | 5 DNA seeds per prompt require 3+ axis differentiation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Generation Quality
- **NFR-G01**: Each variant 600-900 lines of HTML
- **NFR-G02**: Inline SVG icons (Lucide-style: 24x24, stroke-based)
- **NFR-G03**: All CSS inline in `<style>` block (self-contained HTML)

### Accessibility
- **NFR-A01**: All outputs include `prefers-reduced-motion` media query
- **NFR-A02**: Phase 1 outputs include `<meta name="color-scheme" content="light dark">`
- **NFR-A03**: Phase 2 outputs include `<meta name="color-scheme" content="light">`
- **NFR-A04**: All outputs use semantic `<section>` elements

### Design System Isolation
- **NFR-D01**: Phase 1 uses Inter + Roboto Mono via Google Fonts CDN
- **NFR-D02**: Phase 2 uses Geist Sans + Geist Mono via system-ui fallback (no CDN link)
- **NFR-D03**: Phase 1 uses box-shadow based elevation with skeumorphic `::before` on buttons
- **NFR-D04**: Phase 2 uses ring-1 based elevation with no `::before` pseudo-elements on buttons
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Generation Edge Cases
- Gemini returns markdown fences around HTML: must be stripped before saving
- Gemini concatenates 5 variants without clear separator: prompts specify `---VARIANT-SEPARATOR---` delimiter
- Model uses wrong design system tokens: self-validation checklist catches cross-contamination

### Validation Edge Cases
- Output missing required CSS variables: caught by per-phase validation checklist
- Output uses Tailwind utility classes or React/JSX syntax: explicitly forbidden in prompts
- Output contains JavaScript: forbidden in both phases
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 2 master templates, 16 section prompts, 80 generated outputs, 1 README |
| Risk | 8/25 | AI generation quality variance, design system cross-contamination, no production impact |
| Research | 14/20 | Layout pattern research, two design system translations, component recipe extraction |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Prompts are created and ready for generation.
<!-- /ANCHOR:questions -->
