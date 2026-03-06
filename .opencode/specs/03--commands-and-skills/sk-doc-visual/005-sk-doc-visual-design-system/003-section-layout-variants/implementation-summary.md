---
title: "Implementation Summary: Section Layout Variants"
description: "Two-phase prompt-driven generation system for 80 structurally distinct HTML layout variants across 8 documentation sections using Untitled UI and Shadcn Zinc design systems."
trigger_phrases:
  - "section layout summary"
  - "variant generation results"
  - "layout variants implementation"
  - "untitled ui variants summary"
  - "shadcn zinc variants summary"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/03--commands-and-skills/sk-doc-visual/006-sk-doc-visual-design-system/003-section-layout-variants` |
| **Started** | 2026-02-28 |
| **Updated** | 2026-03-01 |
| **Status** | In Progress (Prompt engineering complete. Generation pending.) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Overview

A two-phase prompt-driven generation system for producing 80 layout variant HTML files across 8 documentation sections using two distinct professional design systems. Each phase has a complete master CSS vocabulary template and 8 section-specific prompts. The system is ready for generation via Gemini CLI.

### Research Foundation

Two research briefs anchor the generation prompts. The shadcn layout brief mapped 8 reusable layout motifs (Inset Dashboard, Bento Feature Grid, Stepper List, Tabbed Terminal, Split Pane, Accordion FAQ, File Tree, Navigation Footer) to the 8 sections with anti-flashy adaptation rules and uniqueness levers. The best practices brief codified typography constraints, WCAG accessibility requirements and a QA checklist covering squint tests, overflow checks and reduced-motion verification.

### Phase 1: Untitled UI Master Template

The Untitled UI master template (`phase-1—untitled-ui/prompts/00-master-template.prompt.md`) encodes the complete design system vocabulary:

| Category | Content |
|----------|---------|
| CSS Variables | Full `:root` block with backgrounds (15 tokens), text (15 tokens), foreground (10 tokens), borders (7 tokens), brand scale (12-stop), gray scale (12-stop), error/warning/success scales, utility aliases |
| Typography | Inter (body/display) + Roboto Mono (code) via Google Fonts CDN |
| Component Recipes | 7 CSS-only components: Featured Icon, Badge Pill, Card, Button (primary/secondary with skeumorphic `::before`), Background Grid Pattern, Section Divider, Code Block |
| Base Styles | Box-sizing reset, smooth rendering, container, reduced-motion query, SVG defaults, focus visible, link reset, details/summary |
| Boilerplate | Complete HTML skeleton with required meta tags and font links |
| Self-Validation | Token adherence, required elements, forbidden patterns, quality targets |

### Phase 2: Shadcn Zinc Master Template

The Shadcn Zinc master template (`phase-2—shadcn/prompts/00-master-template.prompt.md`) encodes a fundamentally different design system:

| Category | Content |
|----------|---------|
| CSS Variables | Full `:root` block with bare HSL triplets (applied via `hsl(var(--token))`), semantic colors (background through ring), status colors, chart colors, calc-based radii from `--radius` base |
| Typography | Geist Sans + Geist Mono via system-ui fallback (no CDN link) |
| Component Recipes | 10 CSS-only components: Button (6 variants, no `::before`), Card (ring-1 elevation), Badge (opacity-based), Input, Table, Accordion, Alert, Separator, Code Block, Kbd |
| Base Styles | Same accessibility baseline with Shadcn-specific styling (ring-based focus, underline links) |
| Boilerplate | Complete HTML skeleton with `color-scheme: light` (not "light dark") and no Google Fonts link |
| Self-Validation | HSL token pattern, ring elevation, calc radii, explicit forbidden list of UntitledUI patterns |

### Design System Isolation

The two phases enforce strict design system isolation through their self-validation checklists:

| Check | Phase 1 (Untitled UI) | Phase 2 (Shadcn Zinc) |
|-------|----------------------|----------------------|
| Color tokens | `var(--bg-primary)`, `var(--text-secondary)` | `hsl(var(--background))`, `hsl(var(--foreground))` |
| Opacity | Direct alpha in rgb | `hsl(var(--token) / 0.1)` |
| Elevation | `var(--shadow-sm/md/lg)` + skeumorphic `::before` | `0 0 0 1px hsl(var(--foreground) / 0.1)` ring-1 |
| Radii | `var(--radius-xl)` (fixed values) | `calc(var(--radius) + Npx)` |
| Fonts | Inter + Roboto Mono via Google Fonts | Geist Sans + Geist Mono via system-ui |
| Color scheme meta | `light dark` | `light` |

### Section Prompts

Each phase has 8 section-specific prompts following the TIDD-EC framework:

| Prompt | Section | Variants |
|--------|---------|----------|
| `01-hero.prompt.md` | Hero | 5 |
| `02-quick-start.prompt.md` | Quick Start | 5 |
| `03-feature-grid.prompt.md` | Feature Grid | 5 |
| `04-operations-overview.prompt.md` | Operations Overview | 5 |
| `05-setup-and-usage.prompt.md` | Setup and Usage | 5 |
| `06-support.prompt.md` | Support | 5 |
| `07-extensibility.prompt.md` | Extensibility | 5 |
| `08-related-documents.prompt.md` | Related Documents | 5 |
| **Total per phase** | **8 sections** | **40** |

Each prompt defines 5 DNA seeds requiring differentiation across 3+ axes: container strategy, grouping logic, emphasis model, visual rhythm and navigation treatment.

### Skill Documentation

Created `sk-doc-visual/README.md` (300 lines) matching the sk-doc README style with YAML frontmatter, 8 numbered sections, ANCHOR pairs, HVR-compliant prose and comprehensive coverage of the skill's 4-phase workflow, 10 intent signals, composable asset architecture and pinned library versions.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/phase-1—untitled-ui/prompts/00-master-template.prompt.md` | Created | Full Untitled UI CSS vocabulary, 7 component recipes, boilerplate and self-validation |
| `scratch/phase-1—untitled-ui/prompts/01-08-*.prompt.md` | Created | 8 section-specific prompts with 5 DNA seeds each |
| `scratch/phase-1—untitled-ui/untitled-ui/` | Added | Design system source code reference |
| `scratch/phase-2—shadcn/prompts/00-master-template.prompt.md` | Created | Full Shadcn Zinc CSS vocabulary, 10 component recipes, boilerplate and self-validation |
| `scratch/phase-2—shadcn/prompts/01-08-*.prompt.md` | Created | 8 section-specific prompts with 5 DNA seeds each |
| `scratch/phase-2—shadcn/shadcn/` | Added | Design system source code reference |
| `.opencode/skill/sk-doc-visual/README.md` | Created | Skill README (300 lines, 8 sections, HVR-compliant) |
| `spec.md` | Updated | Aligned with 2-phase approach |
| `plan.md` | Updated | Aligned with 2-phase approach |
| `tasks.md` | Updated | Aligned with 2-phase approach |
| `checklist.md` | Updated | Aligned with 2-phase approach |
| `implementation-summary.md` | Updated | Aligned with 2-phase approach |

### Legacy Artifacts (Preserved)

| File | Purpose |
|------|---------|
| `scratch/run_section_variants.py` | Original wave-based variant generator (~440 LOC) |
| `scratch/run_section_variants_engaged.py` | Original enhanced generator with review loop (~560 LOC) |
| `scratch/run_enhanced_variants.py` | Original enhanced variant runner |
| `scratch/research/shadcn-layout-brief.md` | Shared research brief |
| `scratch/research/layout-best-practices.md` | Shared research brief |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work proceeded in three stages:

**Stage 1 (Research):** Two research briefs were written covering layout patterns and documentation best practices. These are shared across both phases and referenced by the section prompts.

**Stage 2 (Prompt Engineering):** Two complete master templates were created by extracting the full design system vocabularies from the Untitled UI and Shadcn source code repositories. Each master template includes `:root` CSS variables, component recipes, base styles, an HTML boilerplate skeleton and a self-validation checklist. Then 8 section-specific prompts were created for each phase, each defining 5 structurally distinct DNA seeds with the TIDD-EC framework (role, task, context injection, instructions, validation).

**Stage 3 (Documentation):** The sk-doc-visual README.md was created and all spec folder documentation was updated to reflect the 2-phase approach.

All outputs live exclusively in `scratch/`. No production section templates were modified. The README.md was created as a new file in the skill directory.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two distinct design systems (Untitled UI + Shadcn Zinc) | Provides two contrasting visual languages for the variant library: skeumorphic vs minimal |
| Prompt-driven over Python automation | Embeds design system constraints directly in prompts, giving the AI model explicit self-checking capabilities |
| 5 variants per section (not 7) | Focused exploration with stronger DNA seed differentiation per variant |
| Master template + section prompt separation | Master template is reusable context. Section prompts are specific. Separation enables independent updates |
| Self-validation checklists in prompts | Model validates its own output before delivery. Reduces post-generation error fixing |
| Design system source code as reference | Gives the model access to the original source for ambiguous pattern decisions |
| Explicit cross-contamination forbidden lists | Phase 2 explicitly forbids UntitledUI patterns (skeumorphic borders, brand tokens, Google Fonts link) |
| All outputs in scratch/ | Keeps exploration separate from production assets. Variants are candidates, not deployments |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Phase 1 master template | PASS. Complete Untitled UI vocabulary with 7 component recipes and self-validation checklist |
| Phase 2 master template | PASS. Complete Shadcn Zinc vocabulary with 10 component recipes and self-validation checklist |
| Phase 1 section prompts | PASS. 8 prompts with 5 DNA seeds each, TIDD-EC framework |
| Phase 2 section prompts | PASS. 8 prompts with 5 DNA seeds each, TIDD-EC framework |
| Design system isolation | PASS. Forbidden pattern lists prevent cross-contamination |
| sk-doc-visual README.md | PASS. 300 lines, 8 sections, anchors, HVR-compliant |
| Phase 1 output generation | PENDING. 40 variants to generate |
| Phase 2 output generation | PENDING. 40 variants to generate |
| Output validation | PENDING. Awaits generation |
| Production file safety | PASS. No production files modified (README.md is a new file) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Generation not yet executed.** Prompts are ready but no HTML variants have been generated yet. This summary will be updated after generation.
2. **Variant quality is model-dependent.** Different Gemini model versions may produce different results.
3. **Light theme only.** Both phases target light themes. Dark theme variants are out of scope.
4. **No browser-based visual QA planned.** Outputs will pass self-validation checklists but automated browser rendering checks are not included.
5. **No cross-variant deduplication.** Some variants within a section may share similar sub-patterns despite different DNA seeds.
<!-- /ANCHOR:limitations -->
