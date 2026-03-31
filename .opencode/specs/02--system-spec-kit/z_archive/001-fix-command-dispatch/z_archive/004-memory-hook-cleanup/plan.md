---
title: "Implementation Plan [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/004-memory-hook-cleanup/plan]"
description: "Implementation plan for removing Claude Code Hook references from workflows-memory skill."
trigger_phrases:
  - "implementation"
  - "plan"
  - "memory"
  - "hook"
  - "cleanup"
  - "004"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Memory Hook Cleanup - Technical Approach

Implementation plan for removing Claude Code Hook references from workflows-memory skill.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

<!-- ANCHOR:summary -->
## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: workflows-memory, documentation-fix
- **Priority**: P1
- **Branch**: `004-memory-hook-cleanup`
- **Date**: 2025-12-13
- **Spec**: .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/004-memory-hook-cleanup/spec.md

### Summary
Remove 2 misleading Claude Code Hook references from README.md in the workflows-memory skill. The system uses triggers and MCP tools, not hooks. Most "hook" mentions are correct (stating hooks are NOT required) and should be kept.

### Technical Context
- **Language/Version**: Markdown documentation
- **Primary Dependencies**: None (documentation only)
- **Testing**: Manual verification
- **Target Platform**: OpenCode AI agent environment

---

<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready (DoR)
- [x] Problem statement clear; scope documented
- [x] Files identified with exact line numbers
- [x] Changes are minimal and targeted

### Definition of Done (DoD)
- [ ] README.md architecture diagram updated
- [ ] README.md storage table updated
- [ ] No other files require changes
- [ ] Verification complete

<!-- /ANCHOR:quality-gates -->
---

## 3. PROJECT STRUCTURE

### Documentation (This Feature)
```
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/004-memory-hook-cleanup/
  spec.md              # Feature specification
  plan.md              # This file
  tasks.md             # Task breakdown
  scratch/             # Temporary files (git-ignored)
  memory/              # Session context
```

### Target Files
```
.opencode/skills/workflows-memory/
  README.md            # 2 edits required (lines 599-601, 639)
```

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Edit README.md

**Goal**: Remove/update the 2 problematic hook references

**Changes**:
1. Lines 599-601: Update architecture diagram to remove "UserPromptSubmit Hook" reference
2. Line 639: Change "hook execution" to "trigger execution"

**Duration**: 5 minutes

<!-- /ANCHOR:phases -->
---

## 5. SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| Problematic references removed | 2 | grep verification |
| Correct references preserved | 3 | grep verification |
| Documentation accuracy | 100% | Manual review |

---

## 6. RISKS & MITIGATIONS

### Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Accidentally remove correct hook references | Med | Low | Verify each change against analysis |

### Rollback Plan
- **Rollback Trigger**: If correct references are accidentally removed
- **Rollback Procedure**: Revert README.md to previous state
