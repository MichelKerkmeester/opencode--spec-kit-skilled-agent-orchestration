---
title: "Checklist: Make Debug Command Stack-Agnostic [006-debug-stack-agnostic/checklist]"
description: "Final file sizes"
trigger_phrases:
  - "checklist"
  - "make"
  - "debug"
  - "command"
  - "stack"
  - "006"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Checklist: Make Debug Command Stack-Agnostic

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] **P0** Identified frontend-specific references in debug.md
- [x] **P0** Confirmed no stack detection/selection needed (user feedback)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Phase 1: Universal Debugging Methodology

- [x] **P0** Created `universal_debugging_methodology.md` in system-spec-kit/references/
- [x] **P0** Documented 4-phase approach (Observe → Analyze → Hypothesize → Fix)
- [x] **P0** Aligned with skill_reference_template.md (emoji section headers)
- [x] **P1** Content applies to ANY technology (not frontend-specific)
- [x] **P1** Included verification checklist
- [x] **P1** Added to system-spec-kit SKILL.md resource inventory

---

## Phase 2: debug.md Updates

- [x] **P0** Updated lint_error indicators (removed ESLint, Prettier)
- [x] **P0** Updated Related Templates to reference system-spec-kit location
- [x] **P1** Updated Integration section to be stack-agnostic
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Phase 3: Validation

- [x] **P0** Works for Python backend debugging (mental test)
- [x] **P0** Works for Go microservice debugging (mental test)
- [x] **P0** Works for Docker/infrastructure debugging (mental test)
- [x] **P0** Still works for frontend debugging (mental test)
- [x] **P1** No broken references in debug.md
- [x] **P1** Old file deleted from workflows-code
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:docs -->
## Post-Implementation

- [x] **P0** Updated spec folder docs with correct file location
- [x] **P0** Updated implementation-summary.md
- [x] **P1** All P0 items marked complete
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:arch-verify -->
## Phase 4: YAML Refactoring (Workflow Logic Extraction)

- [x] **P0** Moved all phase logic from debug.md to YAML files
- [x] **P0** Moved all step logic from debug.md to YAML files
- [x] **P0** Updated spec_kit_debug_auto.yaml (243 → 446 lines)
- [x] **P0** Updated spec_kit_debug_confirm.yaml (312 → 571 lines)
- [x] **P0** Refactored debug.md to be concise reference (661 → 173 lines)
- [x] **P1** YAML files are now single source of truth for workflow execution
- [x] **P1** debug.md references YAML files for execution details
- [x] **P1** Both modes (auto/confirm) have aligned 2-phase + 5-step structure
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:summary -->
## Phase 5: Structural Alignment (Final Refactoring)

- [x] **P0** Moved phases BACK to debug.md (proper pattern: phases in .md, steps in YAML)
- [x] **P0** Removed `phases:` sections from YAML files (incorrect pattern)
- [x] **P0** Removed `phase_verification:` sections from YAML files
- [x] **P0** Removed `violation_detection:` sections from YAML files
- [x] **P0** YAML `user_inputs:` now references "Phase X of debug.md" as source
- [x] **P1** debug.md structure aligned with complete.md/handover.md pattern
- [x] **P1** Phases at TOP of debug.md as BLOCKING ENFORCEMENT sections
- [x] **P1** YAML files contain only workflow execution logic (steps 1-5)

**Final file sizes:**
- debug.md: 485 lines (phases + command reference)
- spec_kit_debug_auto.yaml: 343 lines (workflow execution)
- spec_kit_debug_confirm.yaml: 432 lines (workflow + checkpoints)
<!-- /ANCHOR:summary -->

---

## Priority Legend

| Priority | Meaning |
|----------|---------|
| **P0** | Must complete - blocks completion claim |
| **P1** | Should complete - required for quality |
