---
title: "Checklist - Memory Alignment Fix [028-memory-alignment-fix/checklist]"
description: "Originally planned as separate layers"
trigger_phrases:
  - "checklist"
  - "memory"
  - "alignment"
  - "fix"
  - "028"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist - Memory Alignment Fix

## P0 - Critical (HARD BLOCK)

### Phase 1: Immediate Fix
- [x] Move Memory #95 to correct location (006-mcp-code-context-provider)
- [x] Update metadata in moved file (spec_folder field)
- [x] Delete old index entry (ID: 95)
- [x] Re-index at new location (new ID: 97)

### Phase 2: Layer A - AI Gate
- [x] Update AGENTS.md Gate 5 with HARD BLOCK when no argument
- [x] Add content analysis requirement to Gate 5 (Phase 1B alignment check)
- [x] Update /memory:save Phase 1 with folder selection enforcement
- [x] Add mismatch warning logic to save.md (Phase 1B)

### Phase 3: Layer B - Script Alignment
- [x] Remove SPEC_FOLDER bypass in detectSpecFolder() (line ~2254)
- [x] Make alignment check ALWAYS run (`validateFolderAlignment()` added)
- [x] Add prompt when alignment < 50% (WARNING_THRESHOLD)
- [x] Add alternative folder suggestion (top 3 with scores)

### Phase 4: Layer C - Content Suggestion (Consolidated into Layer B)
- [x] Implement suggestSpecFolder() function → Consolidated into `validateFolderAlignment()`
- [x] Extract keywords from JSON content → Via `extractConversationTopics()`
- [x] Score against all spec folder names → Via `calculateAlignmentScore()`
- [x] Return top 3 matches with confidence scores → In `validateFolderAlignment()`
- [x] Integrate into detectSpecFolder() flow → Calls added at lines 2263, 2282

## P1 - Must Complete

### Testing
- [ ] Test: Save with no argument → Prompt for selection
- [ ] Test: Save with mismatched folder → Warning + suggestion
- [ ] Test: Save with correct folder → Proceed normally
- [ ] Test: Script validates even when folder provided

### Documentation
- [x] Update spec.md with final implementation details → See this checklist
- [x] Document threshold values chosen → THRESHOLD: 70%, WARNING_THRESHOLD: 50%
- [x] Update skill documentation with three-tier system
  - [x] alignment_scoring.md - Score interpretation table + interactive prompt trigger
  - [x] spec_folder_detection.md - Flowchart, threshold table, edge cases
  - [x] SKILL.md - Three threshold references (lines 169, 357, 696)
- [x] Add usage examples → Added Section 8 to alignment_scoring.md with 3 tier examples

## P2 - Can Defer

- [x] Add metrics/logging for alignment scores → `📊 Alignment check:` log output
- [ ] Create automated test suite for memory save flow
- [ ] Document rollback procedure if issues arise

## Implementation Summary

### Files Modified

| File | Changes |
|------|---------|
| `AGENTS.md` | Gate 5 expanded with PRE-SAVE VALIDATION section |
| `.opencode/command/memory/save.md` | Added Phase 1B: Content Alignment Check |
| `.opencode/skills/system-memory/scripts/generate-context.js` | Added `validateFolderAlignment()`, `WARNING_THRESHOLD` config |

### Key Thresholds (ALIGNMENT_CONFIG)

| Threshold | Value | Behavior |
|-----------|-------|----------|
| THRESHOLD | 70% | Good alignment - proceed without warning |
| WARNING_THRESHOLD | 50% | Below this = LOW ALIGNMENT WARNING + prompt |

### Design Decision: Layer B+C Consolidation

Originally planned as separate layers:
- Layer C: AI-side content analysis before calling script
- Layer B: Script-side validation as safety net

**Implemented as consolidated Layer B** because:
1. Single source of truth for alignment logic (no duplication)
2. Script ALWAYS validates, regardless of AI behavior
3. Same keyword extraction and scoring functions used
4. More reliable defense (script cannot be bypassed)
