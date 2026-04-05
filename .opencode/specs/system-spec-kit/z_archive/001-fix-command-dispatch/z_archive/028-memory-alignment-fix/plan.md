---
title: "Implementation Plan [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/028-memory-alignment-fix/plan]"
description: "Location: Lines around Gate 5 (Memory Save Validation)"
trigger_phrases:
  - "implementation"
  - "plan"
  - "memory"
  - "alignment"
  - "fix"
  - "028"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan - Memory Alignment Fix

<!-- ANCHOR:summary -->
## Phase 1: Immediate Fix (Memory Relocation)

### Task 1.1: Move Memory #95
- Source: `.opencode/specs/03--commands-and-skills/skills/007-skill-system-improvements/memory/22-12-25_12-08__skill-system-improvements.md`
- Destination: `.opencode/specs/03--commands-and-skills/skills/006-mcp-code-context-provider/memory/22-12-25_12-08__mcp-code-context.md`
- Update spec_folder in YAML metadata

### Task 1.2: Re-index Memory
- Delete old index entry (ID: 95)
- Index new file location

<!-- /ANCHOR:summary -->
## Phase 2: Layer A - AI Gate Compliance

### Task 2.1: Update AGENTS.md Gate 5
Location: Lines around Gate 5 (Memory Save Validation)

Changes:
```markdown
│ GATE 5: MEMORY SAVE VALIDATION [HARD BLOCK]                                 │
│ Trigger: "save context", "save memory", /memory:save, memory file creation  │
│ Action:  1. If no spec folder argument: HARD BLOCK → List recent folders    │
│          2. WAIT for user selection (A/B/C/D response)                      │
│          3. Analyze content keywords against selected folder name           │
│          4. If mismatch detected: WARN and suggest alternatives             │
│          5. MUST use generate-context.js → Verify ANCHOR format             │
│ Block:   HARD - Cannot proceed without explicit folder selection            │
```

### Task 2.2: Update /memory:save Command Phase 1
Location: `.opencode/command/memory/save.md`

Changes:
- Add HARD BLOCK enforcement when `$ARGUMENTS` is empty
- Add content analysis step before folder selection
- Add mismatch warning with folder suggestions

## Phase 3: Layer B - Script Mandatory Alignment Check

### Task 3.1: Modify detectSpecFolder() in generate-context.js
Location: Lines 2207-2420

Changes:
- Remove bypass when `SPEC_FOLDER` is provided
- ALWAYS call alignment scoring function
- Add prompt when score < 50%

### Task 3.2: Enhance calculateFolderScore()
Location: Around line 2440

Changes:
- Improve keyword extraction from content
- Better matching algorithm for folder names
- Return confidence percentage

## Phase 4: Layer C - Content-Based Suggestion

### Task 4.1: Add suggestSpecFolder() function
Location: New function in generate-context.js (after normalizeInputData)

```javascript
function suggestSpecFolder(jsonContent) {
  // Extract keywords from sessionSummary, triggerPhrases, keyInsights
  // Scan all spec folders in workspace
  // Score each folder against keywords
  // Return top 3 matches with scores
}
```

### Task 4.2: Integrate into detectSpecFolder()
- Call suggestSpecFolder() before finalizing
- Compare suggestion with provided folder
- Prompt if significant mismatch

## Phase 5: Testing & Verification

### Test Cases
1. Save with no argument → Should prompt for folder selection
2. Save with mismatched folder → Should warn and suggest alternatives
3. Save with correct folder → Should proceed normally
4. Script always validates → Even when folder provided explicitly

<!-- ANCHOR:rollback -->
## Rollback Plan

If issues arise:
1. Revert AGENTS.md changes
2. Revert save.md changes
3. Revert generate-context.js changes (keep suggestSpecFolder for future use)
<!-- /ANCHOR:rollback -->
