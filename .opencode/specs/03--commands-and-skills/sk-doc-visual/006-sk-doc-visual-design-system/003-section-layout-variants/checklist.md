---
title: "Verification Checklist: Section Layout Variants"
description: "QA verification for two-phase section layout variant generation using Untitled UI and Shadcn Zinc design systems."
trigger_phrases:
  - "section layout checklist"
  - "variant verification"
  - "untitled ui checklist"
  - "shadcn zinc checklist"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Section Layout Variants

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

- [x] CHK-001 [P0] Research briefs completed (`scratch/research/shadcn-layout-brief.md`, `scratch/research/layout-best-practices.md`)
- [x] CHK-002 [P0] Untitled UI master template created with full `:root` vocabulary, 7 component recipes, base styles, boilerplate and self-validation checklist
- [x] CHK-003 [P0] Shadcn Zinc master template created with full `:root` vocabulary (bare HSL triplets), 10 component recipes, base styles, boilerplate and self-validation checklist
- [x] CHK-004 [P1] 8 section prompts created for Phase 1 with 5 DNA seeds each
- [x] CHK-005 [P1] 8 section prompts created for Phase 2 with 5 DNA seeds each
- [x] CHK-006 [P1] Baseline section templates accessible in `sk-doc-visual/assets/sections/`
- [x] CHK-007 [P1] Theme variables accessible in `sk-doc-visual/assets/variables/`
- [x] CHK-008 [P1] Untitled UI source code included as reference
- [x] CHK-009 [P1] Shadcn source code included as reference
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:prompt-quality -->
## Prompt Quality

- [x] CHK-010 [P0] Phase 1 master template contains all required token categories (backgrounds, text, foreground, borders, brand scale, gray scale, typography, spacing, radii, shadows, focus, transitions)
- [x] CHK-011 [P0] Phase 2 master template contains all required token categories (semantic colors, status colors, chart colors, radii with calc pattern, typography, spacing, shadows, focus, transitions)
- [x] CHK-012 [P1] Phase 1 self-validation checklist covers: token adherence, required elements, forbidden patterns, quality targets
- [x] CHK-013 [P1] Phase 2 self-validation checklist covers: HSL token pattern, ring elevation, calc radii, forbidden UntitledUI patterns
- [x] CHK-014 [P1] Section prompts use TIDD-EC framework with role, task, context, instructions, validation phases
- [x] CHK-015 [P1] DNA seeds require 3+ axis differentiation (container strategy, grouping logic, emphasis model, etc.)
<!-- /ANCHOR:prompt-quality -->

---

<!-- ANCHOR:phase-1-output -->
## Phase 1 Output (Untitled UI) - Pending

- [ ] CHK-020 [P0] 40 HTML files exist in `scratch/phase-1—untitled-ui/output-from-gemini/` (5 per section x 8 sections)
- [ ] CHK-021 [P0] All outputs use `var(--token)` references for colors (no raw hex/rgb outside `:root`)
- [ ] CHK-022 [P0] All outputs include `prefers-reduced-motion` media query
- [ ] CHK-023 [P0] All outputs include `<meta name="color-scheme" content="light dark">`
- [ ] CHK-024 [P0] All outputs use semantic `<section>` elements
- [ ] CHK-025 [P1] All outputs use Inter + Roboto Mono via Google Fonts CDN link
- [ ] CHK-026 [P1] All outputs use skeumorphic `::before` inner borders on buttons
- [ ] CHK-027 [P1] No outputs contain forbidden patterns (neon, particle, parallax, 3D transform, setInterval, JavaScript)
- [ ] CHK-028 [P1] No outputs contain Shadcn-specific patterns (`hsl(var(...))`, Geist fonts, ring-1 as primary elevation)
- [ ] CHK-029 [P1] Each variant is 600-900 lines
<!-- /ANCHOR:phase-1-output -->

---

<!-- ANCHOR:phase-2-output -->
## Phase 2 Output (Shadcn Zinc) - Pending

- [ ] CHK-030 [P0] 40 HTML files exist in `scratch/phase-2—shadcn/output-from-gemini/` (5 per section x 8 sections)
- [ ] CHK-031 [P0] All outputs use `hsl(var(--token))` references for colors (bare HSL triplets in `:root`)
- [ ] CHK-032 [P0] All outputs include `prefers-reduced-motion` media query
- [ ] CHK-033 [P0] All outputs include `<meta name="color-scheme" content="light">`
- [ ] CHK-034 [P0] All outputs use semantic `<section>` elements
- [ ] CHK-035 [P1] All outputs use Geist Sans + Geist Mono via system-ui fallback (no CDN link)
- [ ] CHK-036 [P1] All outputs use ring-1 pattern (`0 0 0 1px hsl(...)`) as primary elevation
- [ ] CHK-037 [P1] No outputs contain forbidden patterns (neon, particle, parallax, 3D transform, setInterval, JavaScript)
- [ ] CHK-038 [P1] No outputs contain UntitledUI-specific patterns (`--bg-brand-*`, `--shadow-skeumorphic`, `::before` inner borders, Google Fonts link)
- [ ] CHK-039 [P1] Each variant is 600-900 lines
<!-- /ANCHOR:phase-2-output -->

---

<!-- ANCHOR:traceability -->
## Traceability

- [x] CHK-040 [P1] Master templates preserved in `phase-*/prompts/00-master-template.prompt.md`
- [x] CHK-041 [P1] Section prompts preserved in `phase-*/prompts/01-08-*.prompt.md`
- [ ] CHK-042 [P1] Generation logs saved in `phase-*/logs/`
<!-- /ANCHOR:traceability -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] spec.md updated to reflect 2-phase approach
- [x] CHK-051 [P1] plan.md updated to reflect 2-phase approach
- [x] CHK-052 [P1] tasks.md updated to reflect 2-phase approach
- [x] CHK-053 [P1] checklist.md updated to reflect 2-phase approach
- [ ] CHK-054 [P1] implementation-summary.md updated after generation completes
- [x] CHK-055 [P1] sk-doc-visual README.md created
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Phase 1 directory structure: `prompts/`, `output-from-gemini/`, `logs/`, `untitled-ui/`
- [x] CHK-061 [P1] Phase 2 directory structure: `prompts/`, `output-from-gemini/`, `logs/`, `shadcn/`
- [ ] CHK-062 [P1] All generated outputs in `scratch/` only (no production files modified)
- [x] CHK-063 [P2] Research preserved in `scratch/research/`
- [x] CHK-064 [P2] Legacy Python scripts preserved in `scratch/` for reference
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 3/13 (prompts verified, generation pending) |
| P1 Items | 24 | 14/24 (prompts and docs verified, output checks pending) |
| P2 Items | 2 | 2/2 |

**Last Updated**: 2026-03-01
**Status**: Prompt engineering complete. Generation and output verification pending.
<!-- /ANCHOR:summary -->
