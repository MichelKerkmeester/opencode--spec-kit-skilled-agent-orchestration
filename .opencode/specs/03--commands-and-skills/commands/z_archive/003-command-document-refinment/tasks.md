---
title: "Command Document Refinement - Tasks [003-command-document-refinment/tasks]"
description: "Location: .opencode/skill/sk-doc/assets/command_template.md"
trigger_phrases:
  - "command"
  - "document"
  - "refinement"
  - "tasks"
  - "003"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Command Document Refinement - Tasks

<!-- ANCHOR:task-tracking -->
## Task Tracking

| ID | Task | Priority | Status | Assignee | Notes |
|----|------|----------|--------|----------|-------|
| T1 | Define step numbering standard | P0 | ✅ Done | Analysis | Full steps only |
| T2 | Define emoji vocabulary | P0 | ✅ Done | Analysis | 16 standard emojis |
| T3 | Define structure standard | P0 | ✅ Done | Analysis | Workflow vs Search |
| T4 | Update command_template.md | P0 | 🔲 Pending | - | Add all standards |
| T5 | Fix resume.md half-steps | P1 | 🔲 Pending | - | Lines 77, 399, 448 |
| T6 | Fix research.md half-steps | P1 | 🔲 Pending | - | Line 96 |
| T7 | Fix complete.md half-steps | P1 | 🔲 Pending | - | Lines 283, 297 |
| T8 | Fix handover.md half-steps | P1 | 🔲 Pending | - | Line 321 |
| T9 | Fix implement.md half-steps | P1 | 🔲 Pending | - | Line 311 |
| T10 | Fix install_guide.md half-steps | P1 | 🔲 Pending | - | Lines 244, 252 |
| T11 | Fix folder_readme.md half-steps | P1 | 🔲 Pending | - | Lines 256, 266 |
| T12 | Fix skill_asset.md half-steps | P1 | 🔲 Pending | - | Lines 283, 293 |
| T13 | Fix skill_reference.md half-steps | P1 | 🔲 Pending | - | Lines 313, 323 |
| T14 | Fix skill.md half-steps | P1 | 🔲 Pending | - | Lines 327, 337 |
| T15 | Standardize PURPOSE emoji (📋→🎯) | P1 | 🔲 Pending | - | All 21 files |
| T16 | Standardize EXAMPLES emoji | P1 | 🔲 Pending | - | 💡→🔍 in create/* |
| T17 | Align section structure | P2 | 🔲 Pending | - | As needed |
| T18 | Add missing sections | P2 | 🔲 Pending | - | ERROR HANDLING, etc. |
| T19 | Validate all changes | P0 | 🔲 Pending | - | Final verification |

<!-- /ANCHOR:task-tracking -->

## Detailed Task Breakdown

### T4: Update command_template.md

**Location**: `.opencode/skill/sk-doc/assets/command_template.md`

**Changes Required**:
1. Add "Step Numbering Rules" section
   - Full integer steps only (1, 2, 3, 4...)
   - No decimal sub-steps
   - Sub-activities use bullets or letters

2. Add "Emoji Vocabulary" table
   - 16 standard emojis with purposes
   - Semantic vs decorative distinction

3. Update "Section Format" rules
   - H2 format: "## N. [EMOJI] SECTION-NAME"
   - Remove "no decorative emoji" rule

4. Add structure templates
   - Workflow command template
   - Search command template

5. Add blocking patterns
   - Multi-phase blocking structure
   - Status verification table
   - Violation self-detection section

### T5-T14: Fix Half-Steps

**Pattern for each file**:
1. Find decimal sub-steps (X.Y format)
2. Convert to full sequential numbers
3. Update any references to old numbers
4. Verify document flow still makes sense

**Example Conversion**:
- Before: "## 🔒 PHASE 1.5: CONTINUATION VALIDATION"
- After: "## 🔒 PHASE 2: CONTINUATION VALIDATION" (renumber subsequent phases)

OR for sub-sections:
- Before: "## 5.1 🔧 MCP TOOL USAGE"
- After: "## 6. 🔧 MCP TOOL USAGE" (promote to full section)

### T15-T16: Standardize Emojis

**Files to update for PURPOSE (📋→🎯)**:
All files currently using "📋 PURPOSE" should use "🎯 PURPOSE"

**Files to update for EXAMPLES (💡→🔍)**:
- create/install_guide.md
- create/folder_readme.md
- create/skill_asset.md
- create/skill_reference.md
- create/skill.md

## Dependencies

```
T1, T2, T3 (Done)
    ↓
T4 (Template update)
    ↓
T5-T14 (Half-step fixes) ← Can run in parallel
    ↓
T15-T16 (Emoji standardization) ← Can run in parallel
    ↓
T17-T18 (Structure alignment)
    ↓
T19 (Validation)
```
