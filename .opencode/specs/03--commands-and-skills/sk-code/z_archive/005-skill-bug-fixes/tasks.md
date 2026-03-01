---
title: "Task Breakdown: workflows-code Skill Bug Fixes [005-skill-bug-fixes/tasks]"
description: "Granular task list for implementing all bug fixes."
trigger_phrases:
  - "task"
  - "breakdown"
  - "workflows"
  - "code"
  - "skill"
  - "tasks"
  - "024"
importance_tier: "normal"
contextType: "implementation"
---
# Task Breakdown: workflows-code Skill Bug Fixes

Granular task list for implementing all bug fixes.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.0 -->

---

<!-- ANCHOR:notation -->
## Task Summary

| ID | Task | Priority | Status | Assignee |
|----|------|----------|--------|----------|
| T-001 | Fix script references in SKILL.md | P0 | Pending | - |
| T-002 | Add Phase 1.5 to overview table | P0 | Pending | - |
| T-003 | Add Phase 1.5 to WHERE AM I table | P0 | Pending | - |
| T-004 | Fix verification_workflows.md paths | P1 | Pending | - |
| T-005 | Fix debugging_workflows.md path | P1 | Pending | - |
| T-006 | Fix security_patterns.md path | P1 | Pending | - |
| T-007 | Fix performance_patterns.md paths | P1 | Pending | - |
| T-008 | Fix minification_guide.md paths | P1 | Pending | - |
| T-009 | Fix code_style_guide.md paths | P1 | Pending | - |
| T-010 | Fix code_quality_standards.md path | P1 | Pending | - |
| T-011 | Fix quick_reference.md paths | P1 | Pending | - |
| T-012 | Verify all fixes | P0 | Pending | - |

<!-- /ANCHOR:notation -->

---

## Detailed Tasks

<!-- ANCHOR:phase-1 -->
### T-001: Fix script references in SKILL.md

**Priority**: P0 (CRITICAL)
**File**: `.opencode/skill/workflows-code/SKILL.md`
**Lines**: 706-715

**Description**: Remove or update references to deleted scripts:
- `scripts/minify-webflow.mjs`
- `scripts/verify-minification.mjs`
- `scripts/test-minified-runtime.mjs`

**Acceptance**: No references to non-existent scripts

---

### T-002: Add Phase 1.5 to overview table

**Priority**: P0 (HIGH)
**File**: `.opencode/skill/workflows-code/SKILL.md`
**Lines**: 52-56

**Description**: Add Phase 1.5 row to the phase overview table.

**Expected Result**:
```markdown
| Phase 1.5: Code Quality | Validate against style standards | P0 items pass |
```

---

### T-003: Add Phase 1.5 to WHERE AM I table

**Priority**: P0 (HIGH)
**File**: `.opencode/skill/workflows-code/SKILL.md`
**Lines**: 614-619

**Description**: Add Phase 1.5 row to the WHERE AM I? detection table.

**Expected Result**:
```markdown
| **1.5: Code Quality** | Implementation done, running checklist | All P0 items passing |
```

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
### T-004: Fix verification_workflows.md paths

**Priority**: P1
**File**: `.opencode/skill/workflows-code/references/verification/verification_workflows.md`
**Lines**: 600-602

**Changes**:
| Line | Current | Corrected |
|------|---------|-----------|
| 600 | `./implementation_workflows.md` | `../implementation/implementation_workflows.md` |
| 601 | `./debugging_workflows.md` | `../debugging/debugging_workflows.md` |
| 602 | `./shared_patterns.md` | `../standards/shared_patterns.md` |

---

### T-005: Fix debugging_workflows.md path

**Priority**: P1
**File**: `.opencode/skill/workflows-code/references/debugging/debugging_workflows.md`
**Line**: 25

**Change**: `./webflow_patterns.md` → `../implementation/webflow_patterns.md`

---

### T-006: Fix security_patterns.md path

**Priority**: P1
**File**: `.opencode/skill/workflows-code/references/implementation/security_patterns.md`
**Line**: 561

**Change**: `./verification_workflows.md` → `../verification/verification_workflows.md`

---

### T-007: Fix performance_patterns.md paths

**Priority**: P1
**File**: `.opencode/skill/workflows-code/references/implementation/performance_patterns.md`
**Lines**: 492-493

**Changes**:
| Line | Current | Corrected |
|------|---------|-----------|
| 492 | `./debugging_workflows.md` | `../debugging/debugging_workflows.md` |
| 493 | `./verification_workflows.md` | `../verification/verification_workflows.md` |

---

### T-008: Fix minification_guide.md paths

**Priority**: P1
**File**: `.opencode/skill/workflows-code/references/deployment/minification_guide.md`
**Lines**: 509-510

**Changes**:
| Line | Current | Corrected |
|------|---------|-----------|
| 509 | `./implementation_workflows.md` | `../implementation/implementation_workflows.md` |
| 510 | `./debugging_workflows.md` | `../debugging/debugging_workflows.md` |

---

### T-009: Fix code_style_guide.md paths

**Priority**: P1
**File**: `.opencode/skill/workflows-code/references/standards/code_style_guide.md`
**Lines**: 751-753

**Changes**:
| Line | Current | Corrected |
|------|---------|-----------|
| 751 | `./implementation_workflows.md` | `../implementation/implementation_workflows.md` |
| 752 | `./debugging_workflows.md` | `../debugging/debugging_workflows.md` |
| 753 | `./verification_workflows.md` | `../verification/verification_workflows.md` |

---

### T-010: Fix code_quality_standards.md path

**Priority**: P1
**File**: `.opencode/skill/workflows-code/references/standards/code_quality_standards.md`
**Line**: 1063

**Change**: `./implementation_workflows.md` → `../implementation/implementation_workflows.md`

---

### T-011: Fix quick_reference.md paths

**Priority**: P1
**File**: `.opencode/skill/workflows-code/references/standards/quick_reference.md`
**Lines**: 382-384

**Changes**:
| Line | Current | Corrected |
|------|---------|-----------|
| 382 | `./webflow_patterns.md` | `../implementation/webflow_patterns.md` |
| 383 | `./performance_patterns.md` | `../implementation/performance_patterns.md` |
| 384 | `./security_patterns.md` | `../implementation/security_patterns.md` |

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
### T-012: Verify all fixes

**Priority**: P0
**Dependencies**: T-001 through T-011

**Verification Checklist**:
- [ ] SKILL.md has no references to deleted scripts
- [ ] Phase 1.5 appears in both tables
- [ ] All 17 cross-reference paths resolve correctly
- [ ] No new issues introduced

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Progress Tracking

**Total Tasks**: 12
**Completed**: 0
**In Progress**: 0
**Blocked**: 0

<!-- /ANCHOR:completion -->

---

## Changelog

### v1.0 (2026-01-24)
Initial task breakdown
