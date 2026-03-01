---
title: "Implementation Plan: Section Layout Variants"
description: "Two-phase prompt-driven generation of 80 structurally distinct HTML layout variants across 8 documentation sections using Untitled UI and Shadcn Zinc design systems via Gemini CLI."
trigger_phrases:
  - "section layout plan"
  - "variant generation plan"
  - "layout automation"
  - "untitled ui phase"
  - "shadcn zinc phase"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Section Layout Variants

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown prompts, HTML/CSS output |
| **Framework** | None (standalone HTML) |
| **AI Model** | Gemini (via `gemini` CLI) |
| **Validation** | Self-validation checklists embedded in each prompt |
| **Design Systems** | Untitled UI (Phase 1), Shadcn Zinc (Phase 2) |

### Overview
Generate 5 layout variants for each of the 8 standard sk-doc-visual documentation sections across two distinct design systems. Each phase uses a master CSS variable vocabulary template (full `:root` tokens, component recipes, base styles, boilerplate and self-validation checklist) paired with 8 section-specific prompts. The Untitled UI phase produces variants with skeumorphic shadows, purple brand accents and Inter typography. The Shadcn Zinc phase produces variants with ring-based elevation, HSL color tokens and Geist Sans typography. Research briefs on layout patterns and design system source code are included as reference material.

### Evolution from Original Approach
The initial approach used Python scripts (`run_section_variants.py` and `run_section_variants_engaged.py`) to generate 58 variants programmatically. That work produced useful research and automation patterns but lacked fine-grained control over design system adherence. The current approach replaces the Python automation with structured prompt files that encode the complete design system vocabulary and validation rules directly, giving the AI model explicit constraints and self-checking capabilities per variant.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 8 baseline section templates exist in `sk-doc-visual/assets/sections/`
- [x] Theme tokens (CSS variables) documented in `sk-doc-visual/assets/variables/`
- [x] Gemini CLI installed and accessible
- [x] Untitled UI source code available as reference
- [x] Shadcn source code available as reference

### Definition of Done
- [ ] 40 HTML variant files generated in `scratch/phase-1—untitled-ui/output-from-gemini/`
- [ ] 40 HTML variant files generated in `scratch/phase-2—shadcn/output-from-gemini/`
- [ ] All Phase 1 outputs pass Untitled UI self-validation checklist
- [ ] All Phase 2 outputs pass Shadcn Zinc self-validation checklist
- [ ] No cross-contamination between design systems
- [x] Generation prompts preserved for reproducibility
- [x] Research briefs completed
- [x] sk-doc-visual README.md created
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Structured prompt-driven generation with embedded design system vocabulary and self-validation.

### Key Components
- **Research Briefs**: Two markdown documents defining layout patterns and best practices (`scratch/research/`)
- **Master Templates**: Complete CSS variable vocabulary, component recipes, base styles and boilerplate per design system
- **Section Prompts**: 8 section-specific prompts per phase with 5 DNA seeds, role definition, TIDD-EC framework and self-validation checklist
- **Design System References**: Original source code for Untitled UI and Shadcn included for cross-referencing
- **Legacy Scripts**: Original Python automation preserved in `scratch/` for reference

### Data Flow
```
Master Template (CSS vocabulary + component recipes + boilerplate)
    ↓ injected as CONTEXT
Section Prompt (role + task + 5 DNA seeds + instructions + validation checklist)
    ↓
Gemini CLI → 5 raw HTML variants (separated by ---VARIANT-SEPARATOR---)
    ↓
Split + save to output-from-gemini/{section}/
    ↓
Log generation metadata to logs/{section}/
```

### Phase Structure
```
scratch/
├── phase-1—untitled-ui/
│   ├── prompts/          # 00-master-template + 01-08 section prompts
│   ├── output-from-gemini/  # 8 section dirs, 5 variants each
│   ├── logs/             # Generation logs
│   └── untitled-ui/      # Design system source reference
├── phase-2—shadcn/
│   ├── prompts/          # 00-master-template + 01-08 section prompts
│   ├── output-from-gemini/  # 8 section dirs, 5 variants each
│   ├── logs/             # Generation logs
│   └── shadcn/           # Design system source reference
├── research/             # Layout briefs (shared)
├── run_section_variants.py          # Legacy script (reference)
├── run_section_variants_engaged.py  # Legacy script (reference)
└── run_enhanced_variants.py         # Legacy script (reference)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Research (Complete)
- [x] Research layout patterns for enterprise documentation
- [x] Document best practices for typography, accessibility and section design
- [x] Map layout motifs to the 8 standard sections
- [x] Extract Untitled UI token vocabulary and component recipes
- [x] Extract Shadcn Zinc token vocabulary and component recipes

### Phase B: Prompt Engineering (Complete)
- [x] Create Untitled UI master template (`phase-1—untitled-ui/prompts/00-master-template.prompt.md`)
- [x] Create Shadcn Zinc master template (`phase-2—shadcn/prompts/00-master-template.prompt.md`)
- [x] Create 8 section prompts for Phase 1 with 5 DNA seeds each
- [x] Create 8 section prompts for Phase 2 with 5 DNA seeds each
- [x] Embed self-validation checklists in each master template
- [x] Include design system source code as reference material

### Phase C: Skill Documentation (Complete)
- [x] Create `sk-doc-visual/README.md` following sk-doc style (8 sections, anchors, HVR)
- [x] Update spec folder documentation to align with 2-phase plan

### Phase D: Generation - Phase 1 Untitled UI (Pending)
- [ ] Run 8 section prompts with Untitled UI master template via Gemini CLI
- [ ] Split generated output into individual variant files
- [ ] Validate each output against Untitled UI self-validation checklist
- [ ] Regenerate any variants that fail validation
- [ ] Save generation logs

### Phase E: Generation - Phase 2 Shadcn Zinc (Pending)
- [ ] Run 8 section prompts with Shadcn Zinc master template via Gemini CLI
- [ ] Split generated output into individual variant files
- [ ] Validate each output against Shadcn Zinc self-validation checklist
- [ ] Regenerate any variants that fail validation
- [ ] Save generation logs

### Phase F: Verification (Pending)
- [ ] Confirm 40 HTML files in Phase 1 output directories
- [ ] Confirm 40 HTML files in Phase 2 output directories
- [ ] Verify no cross-contamination (no Shadcn patterns in Phase 1, no Untitled UI patterns in Phase 2)
- [ ] Spot-check sample outputs in browser
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Self-validation | Token adherence, accessibility, forbidden patterns | Checklist embedded in each prompt |
| Cross-contamination | Design system isolation between phases | Manual grep for forbidden token patterns |
| Visual spot-check | Layout quality, hierarchy clarity | Browser inspection of sample outputs |
| File count | Expected output count per phase | `find` command on output directories |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Gemini CLI (`gemini`) | External | Green | Cannot generate variants |
| `sk-doc-visual/assets/sections/*.html` | Internal | Green | Referenced as baseline context in prompts |
| Untitled UI source (`scratch/phase-1—untitled-ui/untitled-ui/`) | Internal | Green | Available for cross-referencing |
| Shadcn source (`scratch/phase-2—shadcn/shadcn/`) | Internal | Green | Available for cross-referencing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Variant quality is unacceptable or design system tokens are wrong
- **Procedure**: Delete `output-from-gemini/` contents in the affected phase and regenerate with updated prompts
- **Impact**: Zero production impact. All outputs are in scratch/. Prompts are preserved and rerunnable.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase A (Research) ──► Phase B (Prompts) ──► Phase C (Docs)
                                          ──► Phase D (Gen: Untitled UI) ──► Phase F (Verify)
                                          ──► Phase E (Gen: Shadcn Zinc) ──► Phase F (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| A: Research | None | B: Prompts |
| B: Prompts | A: Research | C: Docs, D: Gen Phase 1, E: Gen Phase 2 |
| C: Docs | B: Prompts | None |
| D: Gen Phase 1 | B: Prompts | F: Verify |
| E: Gen Phase 2 | B: Prompts | F: Verify |
| F: Verify | D + E | None |

Note: Phases D and E can run in parallel.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| A: Research | Low | Completed |
| B: Prompt Engineering | Medium | Completed |
| C: Skill Documentation | Low | Completed |
| D: Generation Phase 1 | Medium | 2-3 hours (Gemini execution + validation) |
| E: Generation Phase 2 | Medium | 2-3 hours (Gemini execution + validation) |
| F: Verification | Low | 1 hour |
| **Remaining** | | **5-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] All outputs in `scratch/` (no production files modified)
- [x] Baseline sections unchanged
- [x] Prompts preserved independently of outputs

### Rollback Procedure
1. Delete `output-from-gemini/` contents in the affected phase directory
2. Optionally update prompts or master template
3. Rerun generation via Gemini CLI
4. No production assets affected

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (scratch-only outputs)
<!-- /ANCHOR:enhanced-rollback -->
