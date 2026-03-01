---
title: "State Simplification: Implementation Plan [001-state-simplification/plan]"
description: "Current"
trigger_phrases:
  - "state"
  - "simplification"
  - "implementation"
  - "plan"
  - "001"
importance_tier: "important"
contextType: "decision"
---
# State Simplification: Implementation Plan
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

## 1. Overview

| Field | Value |
|-------|-------|
| **Estimated LOC** | ~85 |
| **Risk Level** | Low |
| **Approach** | Single phase refactoring |

## 2. Changes Required

### 2.1 generate-context.js (~50 LOC)

**Current:**
- Has updateStateFile() function
- Calls updateStateFile() after writing memory file
- Writes state to separate STATE.md

**Change to:**
- Remove updateStateFile() function call (keep function for reference)
- Add "Project State Snapshot" section to memory file template
- State section at TOP of memory file, before session content

**State Section Format:**
```markdown
## Project State Snapshot

| Field | Value |
|-------|-------|
| **Phase** | ${phase} |
| **Active File** | ${activeFile} |
| **Last Action** | ${lastAction} |
| **Next Action** | ${nextAction} |

### File Progress
${fileProgressList}

### Blockers
${blockers || 'None'}
```

### 2.2 Resume Files (~20 LOC)

**Files:**
- resume.md
- spec_kit_resume_auto.yaml
- spec_kit_resume_confirm.yaml

**Current Priority:**
1. quick-continue.md
2. STATE.md
3. handover.md
4. memory/*.md

**New Priority:**
1. quick-continue.md
2. handover.md (if <24h)
3. memory/*.md (now contains state)

### 2.3 AGENTS.md Gate 0.5 (~10 LOC)

**Current:**
- Validates CONTINUATION against STATE.md

**Change to:**
- Validate against quick-continue.md fields
- Or validate against latest memory file's state section

### 2.4 SKILL.md (~5 LOC)

- Remove state.md from templates list
- Add note that memory files contain state section

### 2.5 Cleanup

- Archive state.md template (move to z_archive or delete)
- Update implementation-summary.md

## 3. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Resume breaks | Low | Medium | Test resume flow after changes |
| State data loss | Low | Low | Memory files more comprehensive than STATE.md |
| Gate 0.5 validation issues | Low | Low | Simplify to quick-continue validation only |

## 4. Rollback Plan

If issues arise:
1. Restore updateStateFile() call in generate-context.js
2. Revert resume priority chain
3. STATE.md template still exists in archive
