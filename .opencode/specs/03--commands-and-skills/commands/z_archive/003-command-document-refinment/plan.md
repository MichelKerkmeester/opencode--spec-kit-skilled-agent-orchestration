---
title: "Command Document Refinement - Plan [003-command-document-refinment/plan]"
description: "Systematic refinement in 4 phases, each building on the previous."
trigger_phrases:
  - "command"
  - "document"
  - "refinement"
  - "plan"
  - "003"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Command Document Refinement - Plan

<!-- ANCHOR:summary -->
## Approach

Systematic refinement in 4 phases, each building on the previous.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Define Standards (Research Complete)

**Status**: ✅ COMPLETE

Standards defined based on analysis of all 21 files:

### Step Numbering Standard
- Use full integer steps only: 1, 2, 3, 4, 5...
- No decimal sub-steps (1.5, 2.5, 3.1, 3.2)
- For sub-activities within a step, use bullet points or lettered lists (a, b, c)
- Phase numbering: PHASE 1, PHASE 2, PHASE 3 (no PHASE 1.5)

### Emoji Vocabulary Standard

| Purpose | Emoji | Notes |
|---------|-------|-------|
| Critical alerts | 🚨 | MANDATORY sections |
| Phase/Gate headers | 🔒 | Blocking enforcement |
| Status PASSED | ✅ | Verification |
| Status N/A/Skip | ⏭️ | Conditional skip |
| HARD STOP | ⛔ | Blocking errors |
| Warnings | ⚠️ | Non-blocking alerts |
| PURPOSE | 🎯 | Standardize from 📋 |
| CONTRACT | 📝 | Input/Output |
| WORKFLOW | 📊 | Process flow |
| INSTRUCTIONS | ⚡ | Action steps |
| REFERENCE | 📌 | Related resources |
| EXAMPLES | 🔍 | Usage demos |
| RELATED | 🔗 | Related commands |
| TOOLS | 🔧 | MCP/tool config |
| ROUTING | 🔀 | Mode detection |
| DOCUMENTATION | 📚 | Full docs link |

### Structure Standard

**For Workflow Commands (spec_kit/*, create/*, prompt/*):**
1. Frontmatter (YAML)
2. Gate exemption (if applicable)
3. 🚨 MANDATORY PHASES (H1)
4. 🔒 PHASE 1-N (H2)
5. ✅ PHASE STATUS VERIFICATION (H2)
6. ⚠️ VIOLATION SELF-DETECTION (H2)
7. 📊 WORKFLOW EXECUTION (H1, if multi-step)
8. [Command Title] (H1)
9. 1. 🎯 PURPOSE (H2)
10. 2. 📝 CONTRACT (H2)
11. 3. 📊 WORKFLOW OVERVIEW (H2, if applicable)
12. 4. ⚡ INSTRUCTIONS (H2)
13. 5. 📌 REFERENCE (H2)
14. 6. 🔍 EXAMPLES (H2)
15. 7. 🔗 RELATED COMMANDS (H2, if applicable)

**For Search Commands (search/*):**
1. Frontmatter (YAML)
2. 🔍 PRE-SEARCH VALIDATION (H1)
3. [Command Title] (H1)
4. 1. 📝 CONTRACT (H2)
5. 2. 🔀 ARGUMENT ROUTING (H2)
6. 3. 🔧 TOOL SIGNATURES (H2)
7. 4-N. [MODE] MODE (H2)
8. N+1. ⚠️ ERROR HANDLING (H2)
9. N+2. 📌 QUICK REFERENCE (H2)
10. N+3. 🔗 RELATED (H2)

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Update Template

**Status**: ✅ COMPLETE

Updated `.opencode/skill/sk-doc/assets/command_template.md`:
1. ✅ Added emoji vocabulary table (Section 6)
2. ✅ Added step numbering rules (Section 5)
3. ✅ Added structure templates for workflow, search, and simple commands (Section 17)
4. ✅ Corrected "no decorative emoji" rule → emojis ARE used and standardized
5. ✅ Added multi-phase blocking pattern (Section 18-19)
6. ✅ Added status verification table template (Section 18)
7. ✅ Added violation self-detection template (Section 18)

**Changes Summary:**
- Lines: 1329 → 1631 (+302 lines)
- New sections added: 5 (Step Numbering), 6 (Emoji Vocabulary), 17 (Structure Templates), 18 (Blocking Patterns)
- All subsequent sections renumbered (7→7, 8→8... through 20→23)
- Updated style standard in header to embrace emojis
- Updated validation checklist to reflect new emoji policy

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Update Command Files

**Status**: 🔲 PENDING

Update all 21 files in priority order:

### Priority 1: Fix Half-Steps (10 files)
1. spec_kit/resume.md
2. spec_kit/research.md
3. spec_kit/complete.md
4. spec_kit/handover.md
5. spec_kit/implement.md
6. create/install_guide.md
7. create/folder_readme.md
8. create/skill_asset.md
9. create/skill_reference.md
10. create/skill.md

### Priority 2: Standardize Emojis (all 21 files)
- Replace 📋 with 🎯 for PURPOSE sections
- Ensure consistent emoji usage per vocabulary

### Priority 3: Standardize Structure (as needed)
- Align section order
- Fix heading levels
- Add missing sections

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
## Phase 4: Validation

**Status**: 🔲 PENDING

1. Verify all files use full steps only
2. Verify emoji consistency
3. Verify structure alignment
4. Test command execution (no regressions)

<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:effort -->
## Timeline

| Phase | Effort | Dependencies |
|-------|--------|--------------|
| Phase 1 | ✅ Done | None |
| Phase 2 | ~30 min | Phase 1 |
| Phase 3 | ~2 hours | Phase 2 |
| Phase 4 | ~30 min | Phase 3 |

<!-- /ANCHOR:effort -->
