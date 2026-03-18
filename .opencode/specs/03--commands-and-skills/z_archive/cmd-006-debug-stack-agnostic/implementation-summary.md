---
title: "Implementation Summary: Make Debug Command Stack-Agnostic [006-debug-stack-agnostic/implementation-summary]"
description: "Made the /spec_kit:debug command inherently universal by removing frontend-specific references and creating a stack-agnostic debugging methodology in the system-spec-kit skill. ..."
trigger_phrases:
  - "implementation"
  - "summary"
  - "make"
  - "debug"
  - "command"
  - "implementation summary"
  - "006"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Implementation Summary: Make Debug Command Stack-Agnostic

<!-- ANCHOR:metadata -->
## Overview

Made the `/spec_kit:debug` command inherently universal by removing frontend-specific references and creating a stack-agnostic debugging methodology in the system-spec-kit skill. Additionally, refactored the command structure to align with sk-doc standards (phases at top in .md, workflow steps in YAML).
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## Changes Made

### 1. Created Universal Debugging Methodology

**File:** `.opencode/skill/system-spec-kit/references/universal_debugging_methodology.md`

**Content (~150 lines):**
- Aligned with `skill_reference_template.md` format (emoji section headers)
- 4-phase debugging approach (Observe → Analyze → Hypothesize → Fix)
- Universal verification checklist
- Common pitfalls applicable to all stacks
- Stack-specific tools reference table
- Self-contained (no cross-references to workflows-code)

**Section Structure:**
1. 📖 OVERVIEW - Purpose, When to Use, Core Principle
2. 🔄 THE FOUR PHASES - Observe, Analyze, Hypothesize, Fix
3. ✅ VERIFICATION CHECKLIST - Post-debugging checks
4. ⚠️ COMMON PITFALLS - Universal debugging mistakes
5. 🚨 WHEN TO ESCALATE - Debug delegation triggers
6. 🛠️ STACK-SPECIFIC NOTES - Tools by technology
7. 🔗 RELATED RESOURCES - Commands and templates

### 2. Updated debug.md Command

**File:** `.opencode/command/spec_kit/debug.md`

**Changes (~8 lines):**

| Section | Before | After |
|---------|--------|-------|
| Line 548 (lint_error) | "ESLint, Prettier, style violations" | "Linter errors, code style violations" |
| Line 564 (Related Templates) | Referenced `workflows-code/.../universal_debugging_methodology.md` | References `system-spec-kit/references/universal_debugging_methodology.md` |
| Lines 619-623 (Integration) | "Use workflows-code for standard debugging" | "Uses universal debugging methodology applicable to any technology stack" |

### 3. Updated system-spec-kit SKILL.md

**File:** `.opencode/skill/system-spec-kit/SKILL.md`

**Change:** Added `universal_debugging_methodology.md` to References table (~2 lines)

---

### 4. Structural Alignment (Phase 4-5)

**Goal:** Align `/spec_kit:debug` with other spec_kit commands (complete.md, handover.md, implement_auto.yaml)

**Pattern learned:** Phases (blocking gates) belong in `.md` file, workflow steps belong in YAML

**debug.md changes (now 485 lines):**
- Added `# 🚨 MANDATORY PHASES - BLOCKING ENFORCEMENT` at top
- Added `## 🔒 PHASE 1: CONTEXT DETECTION` with full decision tree
- Added `## 🔒 PHASE 2: MODEL SELECTION [MANDATORY - ALWAYS ASK]`
- Added `## ⚡ GATE 3 CLARIFICATION` section
- Added `## ✅ PHASE STATUS VERIFICATION (BLOCKING)` table
- Added `## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)` section
- Added `# 📊 WORKFLOW EXECUTION (5 STEPS) - MANDATORY TRACKING` with tracking table
- Main command content uses proper numbered sections with emoji vocabulary

**YAML refactoring:**
- Removed `phases:`, `phase_verification:`, `violation_detection:` sections (these don't belong in YAML)
- `user_inputs:` now references "Phase X of debug.md" as source
- Workflow steps (`step_1_*` through `step_5_*`) remain in YAML
- spec_kit_debug_auto.yaml: 343 lines (down from 447)
- spec_kit_debug_confirm.yaml: 432 lines (down from 572)
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:decisions -->
## What Was NOT Changed

- **Sub-agent prompt template** - Already generic, no changes needed
- **debug-delegation.md template** - No Technology Stack field added
- **workflows-code SKILL.md** - File was never added there
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Validation

The debug command now works for any stack without asking or detecting:

| Scenario | Validation |
|----------|------------|
| Python backend error | Sub-agent sees traceback format, adapts approach |
| Go panic | Sub-agent sees panic output, applies Go debugging |
| Docker/K8s issue | Sub-agent sees container logs, applies infra debugging |
| Frontend JS error | Sub-agent sees browser error, uses DevTools approach |

The sub-agent naturally adapts based on:
- Error message format (reveals technology)
- File extensions (reveals language)
- Code snippets (reveals syntax)

---

## Files Modified

| File | Lines Changed |
|------|---------------|
| `.opencode/skill/system-spec-kit/references/universal_debugging_methodology.md` | +150 (new) |
| `.opencode/command/spec_kit/debug.md` | Major refactor (485 lines final) |
| `.opencode/command/spec_kit/assets/spec_kit_debug_auto.yaml` | Major refactor (343 lines final) |
| `.opencode/command/spec_kit/assets/spec_kit_debug_confirm.yaml` | Major refactor (432 lines final) |
| `.opencode/skill/system-spec-kit/SKILL.md` | ~2 |

---

## File Locations

| Purpose | Location |
|---------|----------|
| Debug command (phases + reference) | `.opencode/command/spec_kit/debug.md` |
| Debug auto mode workflow | `.opencode/command/spec_kit/assets/spec_kit_debug_auto.yaml` |
| Debug confirm mode workflow | `.opencode/command/spec_kit/assets/spec_kit_debug_confirm.yaml` |
| Universal debugging methodology | `.opencode/skill/system-spec-kit/references/universal_debugging_methodology.md` |
| Debug delegation template | `.opencode/skill/system-spec-kit/templates/debug-delegation.md` |

---

## Testing Notes

Mental validation performed:
- ✅ Python: Traceback would be captured, sub-agent applies pdb/logging approach
- ✅ Go: Panic output captured, sub-agent applies Delve approach
- ✅ Docker: Container logs captured, sub-agent applies container debugging
- ✅ Frontend: Browser errors captured, sub-agent applies DevTools approach

No actual code execution testing required - changes are documentation and reference updates.
<!-- /ANCHOR:verification -->

---

## Related Spec Folder

`.opencode/specs/03--commands-and-skills/z_archive/cmd-006-debug-stack-agnostic`
