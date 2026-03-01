---
title: "Tasks: Section Layout Variants"
description: "Task tracking for two-phase section layout variant generation across 8 documentation sections using Untitled UI and Shadcn Zinc design systems."
trigger_phrases:
  - "section layout tasks"
  - "variant generation tasks"
  - "untitled ui tasks"
  - "shadcn zinc tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Section Layout Variants

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-a -->
## Phase A: Research (Complete)

- [x] T001 Research layout patterns for enterprise documentation (`scratch/research/shadcn-layout-brief.md`)
- [x] T002 Document layout best practices: typography, accessibility, section design (`scratch/research/layout-best-practices.md`)
- [x] T003 Map reusable layout motifs to the 8 standard sections
- [x] T004 Define anti-flashy adaptation rules and forbidden patterns
- [x] T005 Define uniqueness levers for variant differentiation (3+ axis requirement)
<!-- /ANCHOR:phase-a -->

---

<!-- ANCHOR:phase-b -->
## Phase B: Prompt Engineering (Complete)

- [x] T006 Extract Untitled UI token vocabulary to CSS custom properties (`phase-1—untitled-ui/prompts/00-master-template.prompt.md`)
- [x] T007 Create Untitled UI component recipes: Featured Icon, Badge, Card, Button, Code Block, Grid Pattern, Divider
- [x] T008 Create Untitled UI HTML boilerplate and self-validation checklist
- [x] T009 Create 8 section-specific prompts for Untitled UI with 5 DNA seeds each (`phase-1—untitled-ui/prompts/01-08-*.prompt.md`)
- [x] T010 Extract Shadcn Zinc token vocabulary to bare HSL CSS custom properties (`phase-2—shadcn/prompts/00-master-template.prompt.md`)
- [x] T011 Create Shadcn Zinc component recipes: Button, Card, Badge, Input, Table, Accordion, Alert, Separator, Code Block, Kbd
- [x] T012 Create Shadcn Zinc HTML boilerplate and self-validation checklist
- [x] T013 Create 8 section-specific prompts for Shadcn Zinc with 5 DNA seeds each (`phase-2—shadcn/prompts/01-08-*.prompt.md`)
- [x] T014 Include Untitled UI source code as reference (`phase-1—untitled-ui/untitled-ui/`)
- [x] T015 Include Shadcn source code as reference (`phase-2—shadcn/shadcn/`)
- [x] T016 Set up output and log directory structure for both phases
<!-- /ANCHOR:phase-b -->

---

<!-- ANCHOR:phase-c -->
## Phase C: Skill Documentation (Complete)

- [x] T017 Create `sk-doc-visual/README.md` following sk-doc style (`.opencode/skill/sk-doc-visual/README.md`)
- [x] T018 Update spec folder documentation to align with 2-phase plan
<!-- /ANCHOR:phase-c -->

---

<!-- ANCHOR:phase-d -->
## Phase D: Generation - Phase 1 Untitled UI (Pending)

- [ ] T019 [P] Run hero prompt via Gemini CLI, split into 5 variants (`phase-1—untitled-ui/output-from-gemini/hero/`)
- [ ] T020 [P] Run quick-start prompt, split into 5 variants (`phase-1—untitled-ui/output-from-gemini/quick-start/`)
- [ ] T021 [P] Run feature-grid prompt, split into 5 variants (`phase-1—untitled-ui/output-from-gemini/feature-grid/`)
- [ ] T022 [P] Run operations-overview prompt, split into 5 variants (`phase-1—untitled-ui/output-from-gemini/operations-overview/`)
- [ ] T023 [P] Run setup-and-usage prompt, split into 5 variants (`phase-1—untitled-ui/output-from-gemini/setup-and-usage/`)
- [ ] T024 [P] Run support prompt, split into 5 variants (`phase-1—untitled-ui/output-from-gemini/support/`)
- [ ] T025 [P] Run extensibility prompt, split into 5 variants (`phase-1—untitled-ui/output-from-gemini/extensibility/`)
- [ ] T026 [P] Run related-documents prompt, split into 5 variants (`phase-1—untitled-ui/output-from-gemini/related-documents/`)
- [ ] T027 Validate all 40 Phase 1 outputs against Untitled UI self-validation checklist
- [ ] T028 Regenerate any Phase 1 variants that fail validation
<!-- /ANCHOR:phase-d -->

---

<!-- ANCHOR:phase-e -->
## Phase E: Generation - Phase 2 Shadcn Zinc (Pending)

- [ ] T029 [P] Run hero prompt via Gemini CLI, split into 5 variants (`phase-2—shadcn/output-from-gemini/hero/`)
- [ ] T030 [P] Run quick-start prompt, split into 5 variants (`phase-2—shadcn/output-from-gemini/quick-start/`)
- [ ] T031 [P] Run feature-grid prompt, split into 5 variants (`phase-2—shadcn/output-from-gemini/feature-grid/`)
- [ ] T032 [P] Run operations-overview prompt, split into 5 variants (`phase-2—shadcn/output-from-gemini/operations-overview/`)
- [ ] T033 [P] Run setup-and-usage prompt, split into 5 variants (`phase-2—shadcn/output-from-gemini/setup-and-usage/`)
- [ ] T034 [P] Run support prompt, split into 5 variants (`phase-2—shadcn/output-from-gemini/support/`)
- [ ] T035 [P] Run extensibility prompt, split into 5 variants (`phase-2—shadcn/output-from-gemini/extensibility/`)
- [ ] T036 [P] Run related-documents prompt, split into 5 variants (`phase-2—shadcn/output-from-gemini/related-documents/`)
- [ ] T037 Validate all 40 Phase 2 outputs against Shadcn Zinc self-validation checklist
- [ ] T038 Regenerate any Phase 2 variants that fail validation
<!-- /ANCHOR:phase-e -->

---

<!-- ANCHOR:phase-f -->
## Phase F: Verification (Pending)

- [ ] T039 Confirm 40 HTML files in Phase 1 output directories (5 per section x 8 sections)
- [ ] T040 Confirm 40 HTML files in Phase 2 output directories (5 per section x 8 sections)
- [ ] T041 Verify no cross-contamination (grep for forbidden patterns per phase)
- [ ] T042 Spot-check sample outputs in browser for visual quality
- [ ] T043 Confirm all outputs in `scratch/` (no production files modified)
<!-- /ANCHOR:phase-f -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] 80 HTML variant files generated (40 per phase)
- [ ] Research, prompts, outputs and logs preserved
- [x] sk-doc-visual README.md created
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
