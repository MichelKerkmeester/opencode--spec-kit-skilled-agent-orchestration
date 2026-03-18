---
title: "Implementation Plan: workflows-code Skill Bug Fixes [005-skill-bug-fixes/plan]"
description: "Systematic plan to fix all identified bugs in the workflows-code skill."
trigger_phrases:
  - "implementation"
  - "plan"
  - "workflows"
  - "code"
  - "skill"
  - "024"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: workflows-code Skill Bug Fixes

Systematic plan to fix all identified bugs in the workflows-code skill.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

<!-- ANCHOR:summary -->
## 1. IMPLEMENTATION OVERVIEW

### Approach
Sequential file-by-file fixes with verification after each change. Start with highest priority (CRITICAL) and work down.

### Phases

| Phase | Description | Files | Priority |
|-------|-------------|-------|----------|
| 1 | Fix script references | SKILL.md | CRITICAL |
| 2 | Add Phase 1.5 to tables | SKILL.md | HIGH |
| 3 | Fix cross-references | 8 reference files | HIGH |
| 4 | Verify all fixes | All modified files | REQUIRED |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:architecture -->
## 2. PHASE 1: FIX SCRIPT REFERENCES

### Problem
Lines 706-715 reference scripts that were deleted:
- `scripts/minify-webflow.mjs`
- `scripts/verify-minification.mjs`
- `scripts/test-minified-runtime.mjs`

### Solution
Remove the script command references and update documentation to reflect current state (manual minification or alternative workflow).

### Changes

**File**: `SKILL.md`
**Lines**: 706-715

**Before**:
```bash
node scripts/minify-webflow.mjs src/2_javascript/[file].js
node scripts/verify-minification.mjs src/2_javascript/[file].js
node scripts/test-minified-runtime.mjs src/2_javascript/z_minified/[file].min.js
```

**After**:
Update to reference the deployment guide without specific script commands, or note that scripts are not currently bundled.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 3. PHASE 2: ADD PHASE 1.5 TO TABLES

### Problem
Phase 1.5 (Code Quality Gate) is documented in Resource Router but missing from:
1. Phase Overview table (lines 52-56)
2. WHERE AM I? table (lines 614-619)

### Solution
Add Phase 1.5 row to both tables.

### Changes

**File**: `SKILL.md`

**Location 1**: Lines 52-56 (Phase Overview)

Add row:
```markdown
| Phase 1.5: Code Quality | Validate against style standards | P0 items pass |
```

**Location 2**: Lines 614-619 (WHERE AM I?)

Add row:
```markdown
| **1.5: Code Quality** | Implementation done, running checklist | All P0 items passing |
```

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. PHASE 3: FIX CROSS-REFERENCES

### Problem
17 broken paths using `./filename.md` instead of `../correct_directory/filename.md`

### Solution Matrix

| File | Line | Current | Corrected |
|------|------|---------|-----------|
| verification_workflows.md | 600 | `./implementation_workflows.md` | `../implementation/implementation_workflows.md` |
| verification_workflows.md | 601 | `./debugging_workflows.md` | `../debugging/debugging_workflows.md` |
| verification_workflows.md | 602 | `./shared_patterns.md` | `../standards/shared_patterns.md` |
| debugging_workflows.md | 25 | `./webflow_patterns.md` | `../implementation/webflow_patterns.md` |
| security_patterns.md | 561 | `./verification_workflows.md` | `../verification/verification_workflows.md` |
| performance_patterns.md | 492 | `./debugging_workflows.md` | `../debugging/debugging_workflows.md` |
| performance_patterns.md | 493 | `./verification_workflows.md` | `../verification/verification_workflows.md` |
| minification_guide.md | 509 | `./implementation_workflows.md` | `../implementation/implementation_workflows.md` |
| minification_guide.md | 510 | `./debugging_workflows.md` | `../debugging/debugging_workflows.md` |
| code_style_guide.md | 751 | `./implementation_workflows.md` | `../implementation/implementation_workflows.md` |
| code_style_guide.md | 752 | `./debugging_workflows.md` | `../debugging/debugging_workflows.md` |
| code_style_guide.md | 753 | `./verification_workflows.md` | `../verification/verification_workflows.md` |
| code_quality_standards.md | 1063 | `./implementation_workflows.md` | `../implementation/implementation_workflows.md` |
| quick_reference.md | 382 | `./webflow_patterns.md` | `../implementation/webflow_patterns.md` |
| quick_reference.md | 383 | `./performance_patterns.md` | `../implementation/performance_patterns.md` |
| quick_reference.md | 384 | `./security_patterns.md` | `../implementation/security_patterns.md` |

<!-- /ANCHOR:testing -->

---

## 5. PHASE 4: VERIFICATION

### Verification Steps

1. **Script References**:
   - [ ] No references to deleted scripts in SKILL.md
   - [ ] Alternative documentation is clear

2. **Phase Tables**:
   - [ ] Phase 1.5 appears in Section 1 overview table
   - [ ] Phase 1.5 appears in Section 9 WHERE AM I? table
   - [ ] Entry/exit criteria are consistent

3. **Cross-References**:
   - [ ] All 17 paths corrected
   - [ ] Each corrected path verified to resolve

---

<!-- ANCHOR:rollback -->
## 6. ROLLBACK PLAN

If fixes introduce issues:
1. Git stash or revert individual file changes
2. Document what broke and why
3. Re-analyze before re-attempting

<!-- /ANCHOR:rollback -->

---

## 7. ESTIMATED EFFORT

| Phase | Files | Estimated Changes |
|-------|-------|-------------------|
| 1 | 1 | ~10 lines |
| 2 | 1 | ~6 lines |
| 3 | 8 | ~20 lines |
| 4 | - | Verification only |
| **Total** | **9** | **~36 lines** |

---

<!-- ANCHOR:dependencies -->
## 8. DEPENDENCIES

- All files must be read before editing
- Edits should be atomic (one logical change per edit)
- Verification after each phase

<!-- /ANCHOR:dependencies -->

---

## 9. CHANGELOG

### v1.0 (2026-01-24)
Initial plan based on analysis findings
