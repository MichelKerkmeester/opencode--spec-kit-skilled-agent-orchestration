---
title: "State Simplification: Tasks [001-state-simplification/tasks]"
description: "1. Find the memory file template section"
trigger_phrases:
  - "state"
  - "simplification"
  - "tasks"
  - "001"
importance_tier: "normal"
contextType: "implementation"
---
# State Simplification: Tasks
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.1 -->

## Tasks

### T1: Modify generate-context.js
- **File:** `.opencode/skill/system-memory/scripts/generate-context.js`
- **Changes:**
  1. Find the memory file template section
  2. Add "Project State Snapshot" section at TOP (after frontmatter)
  3. Include: Phase, Active File, Last/Next Action, File Progress, Blockers
  4. Remove or comment out the updateStateFile() call
- **LOC:** ~50
- **Priority:** P0

### T2: Update resume priority chain
- **Files:** 
  - `.opencode/skill/system-spec-kit/references/resume.md`
  - `.opencode/skill/system-spec-kit/commands/spec_kit_resume_auto.yaml`
  - `.opencode/skill/system-spec-kit/commands/spec_kit_resume_confirm.yaml`
- **Changes:**
  1. Remove STATE.md from priority order
  2. Change to 3-level: quick-continue → handover → memory
  3. Update loading messages
- **LOC:** ~20
- **Priority:** P0

### T3: Update AGENTS.md Gate 0.5
- **File:** `AGENTS.md`
- **Changes:**
  1. Remove reference to STATE.md validation
  2. Change to validate against quick-continue.md or memory file
- **LOC:** ~10
- **Priority:** P1

### T4: Update SKILL.md
- **File:** `.opencode/skill/system-spec-kit/SKILL.md`
- **Changes:**
  1. Remove state.md from templates list
  2. Add note about memory files containing state
- **LOC:** ~5
- **Priority:** P1

### T5: Cleanup and documentation
- **Changes:**
  1. Archive or delete state.md template from `.opencode/skill/system-spec-kit/templates/`
  2. Update implementation-summary.md in parent spec folder
- **Priority:** P2

## Dependencies

```
T1 (generate-context.js)
    ↓
T2 (resume files)
    ↓
T3 (AGENTS.md)
    ↓
T4 (SKILL.md)
    ↓
T5 (cleanup)
```

All tasks are sequential - T1 must complete first as it changes the core behavior.

## Summary

| Task | Files | LOC | Priority |
|------|-------|-----|----------|
| T1 | generate-context.js | ~50 | P0 |
| T2 | resume.md, 2x yaml | ~20 | P0 |
| T3 | AGENTS.md | ~10 | P1 |
| T4 | SKILL.md | ~5 | P1 |
| T5 | cleanup | - | P2 |

**Total LOC:** ~85
