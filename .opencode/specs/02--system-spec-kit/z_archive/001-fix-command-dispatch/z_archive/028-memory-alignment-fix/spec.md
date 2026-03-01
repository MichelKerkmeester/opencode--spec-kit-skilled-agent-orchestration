---
title: "Memory Alignment Fix - Three-Layer Defense System [028-memory-alignment-fix/spec]"
description: "Implement a comprehensive 3-layer defense system to prevent memory saves to incorrect spec folders."
trigger_phrases:
  - "memory"
  - "alignment"
  - "fix"
  - "three"
  - "layer"
  - "spec"
  - "028"
importance_tier: "important"
contextType: "decision"
---
# Memory Alignment Fix - Three-Layer Defense System

## Overview

Implement a comprehensive 3-layer defense system to prevent memory saves to incorrect spec folders.

## Problem Statement

Memory saves were being directed to wrong spec folders due to:
1. **Gate Bypass**: AI skipping Phase 1 validation in `/memory:save` command
2. **Context Contamination**: Following previous session's folder without verification
3. **Missing Content Analysis**: Not matching content keywords to folder name

### Evidence

- Memory #95 saved to `007-skill-system-improvements` but content was about Code Context integration
- Should have been saved to `006-mcp-code-context-provider`
- Root cause: `generate-context.js` alignment check bypassed when `SPEC_FOLDER` provided explicitly

## Solution Architecture

### Three-Layer Defense

```
Layer A (AI Gate) → Layer C (Content Analysis) → Layer B (Script Safety Net)
      ↓                      ↓                           ↓
  HARD BLOCK            SUGGESTION                   VALIDATION
  if no arg             with scores                  < 50% = prompt
```

### Layer A: AI Gate Compliance

- Update AGENTS.md Gate 5 with explicit Phase 1 enforcement
- Update `/memory:save` command to HARD BLOCK when no argument
- Require folder selection before proceeding

### Layer B: Mandatory Alignment Check

- Modify `generate-context.js` to ALWAYS run alignment scoring
- Remove bypass when `SPEC_FOLDER` is provided explicitly
- Prompt user if alignment < 50%

### Layer C: Content-Based Suggestion

- Add `suggestSpecFolder()` function to analyze JSON content
- Extract keywords from sessionSummary, triggerPhrases
- Score against all spec folder names
- Return top 3 matches with scores

## Success Criteria

1. Memory saves ALWAYS validate folder against content
2. User prompted when significant mismatch detected (< 50%)
3. Suggestion provided for better-matching folders
4. No more incorrectly-placed memories

## Files to Modify

| File | Change |
|------|--------|
| `AGENTS.md` | Gate 5 enforcement update |
| `.opencode/command/memory/save.md` | Phase 1 HARD BLOCK |
| `.opencode/skills/system-memory/scripts/generate-context.js` | Alignment check + suggestion |

## Thresholds

- Layer C (AI-side): Warn if selected folder not in top 3 matches
- Layer B (Script): Prompt if alignment < 50%
