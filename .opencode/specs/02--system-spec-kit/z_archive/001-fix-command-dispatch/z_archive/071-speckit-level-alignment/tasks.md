---
title: "Tasks: SpecKit Level-Based Template Alignment [071-speckit-level-alignment/tasks]"
description: "Implementation tasks for aligning SpecKit with level-based template architecture."
trigger_phrases:
  - "tasks"
  - "speckit"
  - "level"
  - "based"
  - "template"
  - "071"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: SpecKit Level-Based Template Alignment

Implementation tasks for aligning SpecKit with level-based template architecture.

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.0 -->

---

## Task Overview

| Phase | Tasks | Priority | Status |
|-------|-------|----------|--------|
| Phase 1: Scripts | 2 | P0 | ✅ Complete |
| Phase 2: Lib Modules | 4 | P1-P3 | ✅ Complete |
| Phase 3: Documentation | 10 | P0-P2 | ✅ Complete |
| Phase 4: Templates | 1 | P1 | ✅ Complete |
| **Total** | **17** | | **100% Complete** |

---

## Phase 1: Script Updates (P0 - CRITICAL)

### TASK-001: Update create-spec-folder.sh [P0]
**File**: `.opencode/skill/system-spec-kit/scripts/create-spec-folder.sh`
**Status**: ✅ Complete
**Estimated**: ~50 lines

**Changes Required**:
1. Add `get_level_templates_dir()` function after line 265
2. Update subfolder mode (lines 373-405) to use level folder
3. Update main mode (lines 515-547) to use level folder

**Implementation**:
```bash
# Add after line 265:
get_level_templates_dir() {
    local level="$1"
    local base_dir="$2"
    case "$level" in
        1|2|3) echo "$base_dir/level_$level" ;;
        "3+"|4) echo "$base_dir/level_3+" ;;
        *) echo "$base_dir/level_1" ;;
    esac
}
```

**Verification**:
```bash
./scripts/create-spec-folder.sh "Test L1" --level 1 --skip-branch
./scripts/create-spec-folder.sh "Test L2" --level 2 --skip-branch
./scripts/create-spec-folder.sh "Test L3" --level 3 --skip-branch
```

---

### TASK-002: Update expand-template.js [P0]
**File**: `.opencode/skill/system-spec-kit/scripts/expand-template.js`
**Status**: ✅ Complete
**Estimated**: ~20 lines

**Changes Required**:
1. Modify `getTemplatesDir()` to accept level parameter (lines 157-159)
2. Add fallback logic for missing level folders (lines 171-176)

**Implementation**:
```javascript
function getTemplatesDir(level = null) {
  const baseDir = path.join(__dirname, '..', 'templates');
  if (!level) return baseDir;

  const levelFolder = level === '3+' ? 'level_3+' : `level_${level}`;
  const levelDir = path.join(baseDir, levelFolder);
  return fs.existsSync(levelDir) ? levelDir : baseDir;
}
```

**Verification**:
```bash
node scripts/expand-template.js --template spec.md --level 2 --dry-run
```

---

## Phase 2: Lib Module Updates (P1 - HIGH)

### TASK-003: Update preprocessor.js [P1]
**File**: `.opencode/skill/system-spec-kit/lib/expansion/preprocessor.js`
**Status**: ✅ Complete
**Estimated**: ~40 lines

**Changes Required**:
1. Refactor `processTemplateDirectory()` for folder selection (lines 219-252)
2. Add `selectLevelFolder(level)` helper function

**Evidence**: selectLevelFolder() added lines 61-74, processTemplateDirectory() refactored lines 228-297

---

### TASK-004: Update features.js [P2]
**File**: `.opencode/skill/system-spec-kit/lib/complexity/features.js`
**Status**: ✅ Complete
**Estimated**: ~20 lines

**Changes Required**:
1. Remove obsolete `templatePath` fields (lines 18, 33, 43, 53)
2. Add deprecation notice to COMPLEXITY_GATE functions

**Evidence**: 4 templatePath properties removed, deprecation notice added lines 7-16

---

### TASK-005: Add deprecation to marker-parser.js [P3]
**File**: `.opencode/skill/system-spec-kit/lib/expansion/marker-parser.js`
**Status**: ✅ Complete
**Estimated**: ~5 lines

**Changes Required**:
1. Add deprecation notice to file header

**Evidence**: @deprecated JSDoc added lines 18-23

---

### TASK-006: Update user-stories.js [P3]
**File**: `.opencode/skill/system-spec-kit/lib/expansion/generators/user-stories.js`
**Status**: ✅ Complete
**Estimated**: ~5 lines

**Changes Required**:
1. Remove COMPLEXITY_GATE syntax from `generatePlaceholder()` (line 208)

**Evidence**: generatePlaceholder() updated lines 192-223, markers removed

---

## Phase 3: Documentation Updates (P1-P2)

### TASK-007: Update SKILL.md [P0]
**File**: `.opencode/skill/system-spec-kit/SKILL.md`
**Status**: ✅ Complete
**Estimated**: ~30 lines

**Changes Required**:
1. Update Resource Inventory table to show level folders
2. Replace COMPLEXITY_GATE workflow with folder selection
3. Add Template Folder Architecture section

**Evidence**: Resource Inventory updated lines 245-269, new Template Folder Architecture section added

---

### TASK-008: Update README.md [P1]
**File**: `.opencode/skill/system-spec-kit/README.md`
**Status**: ✅ Complete
**Estimated**: ~50 lines

**Changes Required**:
Update copy commands at lines 412, 428, 466, 1003-1004, 1553-1554, 1559, 1655-1656, 1891

**Evidence**: 17 copy commands updated to level_N/ paths

---

### TASK-009: Update level_specifications.md [P1]
**File**: `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`
**Status**: ✅ Complete
**Estimated**: ~40 lines

**Changes Required**:
Update template paths at lines 46-47, 97-100, 173-178, 275-278, 397-400, 639-642

**Evidence**: All level sections updated with correct folder paths

---

### TASK-010: Update template_guide.md [P1]
**File**: `.opencode/skill/system-spec-kit/references/templates/template_guide.md`
**Status**: ✅ Complete
**Estimated**: ~30 lines

**Changes Required**:
Update copy commands at lines 56-57, 107, 400, 685, 999-1002

**Evidence**: Copy commands updated, new Templates section lines 999-1028

---

### TASK-011: Update complexity_guide.md [P1]
**File**: `.opencode/skill/system-spec-kit/references/templates/complexity_guide.md`
**Status**: ✅ Complete
**Estimated**: ~20 lines

**Changes Required**:
Update template paths at lines 325-328, 331-334

**Evidence**: Deprecation notice added lines 175-177, Templates section restructured lines 328-353

---

### TASK-012: Update quick_reference.md [P2]
**File**: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
**Status**: ✅ Complete
**Estimated**: ~20 lines

**Changes Required**:
Update copy commands at lines 53-54, 63, 552-555

**Evidence**: Section 3 and 19 updated with level-based paths (30 references)

---

### TASK-013: Update template_mapping.md [P2]
**File**: `.opencode/skill/system-spec-kit/assets/template_mapping.md`
**Status**: ✅ Complete
**Estimated**: ~25 lines

**Changes Required**:
Update copy commands at lines 53-54, 61, 258-259, 266, 313-316

**Evidence**: Sections 3, 8, 9 updated (45 references to level paths)

---

### TASK-014: Update validation_rules.md [P2]
**File**: `.opencode/skill/system-spec-kit/references/validation/validation_rules.md`
**Status**: ✅ Complete
**Estimated**: ~5 lines

**Changes Required**:
Update copy command at line 119

**Evidence**: Line 119 updated to templates/level_1/spec.md

---

### TASK-015: Update phase_checklists.md [P2]
**File**: `.opencode/skill/system-spec-kit/references/validation/phase_checklists.md`
**Status**: ✅ Complete
**Estimated**: ~5 lines

**Changes Required**:
Update checklist.md link at line 176

**Evidence**: Line 176 updated to templates/level_2/checklist.md

---

### TASK-016: Update root templates [P2]
**Files**: `templates/plan.md`, `templates/tasks.md`
**Status**: ✅ Complete
**Estimated**: ~5 lines

**Changes Required**:
- plan.md line 464: Update checklist.md reference
- tasks.md line 359: Update checklist.md reference

**Evidence**: plan.md line 464, tasks.md line 359 updated

---

## Phase 4: Template Cleanup (P1)

### TASK-017: Remove COMPLEXITY_GATE markers from level_2/checklist.md [P1]
**File**: `.opencode/skill/system-spec-kit/templates/level_2/checklist.md`
**Status**: ✅ Complete
**Estimated**: ~30 lines (remove markers, keep content)

**Changes Required**:
Remove 6 COMPLEXITY_GATE markers at lines 107, 116, 118, 127, 129, 137

**Content to Keep**:
- Research Completeness section (lines 108-115)
- Bug Fix Verification section (lines 119-126)
- Refactoring Safety section (lines 130-136)

**Evidence**: 6 markers removed, content preserved (CHK-R01-06, CHK-B01-06, CHK-RF01-05), grep returns no matches

---

## Verification Tasks

### VERIFY-001: Run Existing Test Suite
```bash
bash .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/069-speckit-template-complexity/tests/run-tests.sh
```
**Expected**: 171/171 tests pass

### VERIFY-002: Test Script at Each Level
```bash
for level in 1 2 3; do
  ./scripts/create-spec-folder.sh "Test Level $level" --level $level --skip-branch
done
```

### VERIFY-003: Verify No Broken Paths
```bash
grep -r "templates/spec.md" .opencode/skill/system-spec-kit/scripts/
```
**Expected**: No matches (all should reference level folders)

### VERIFY-004: Verify No COMPLEXITY_GATE in Level Folders
```bash
grep -r "COMPLEXITY_GATE" .opencode/skill/system-spec-kit/templates/level_*/
```
**Expected**: No matches

---

## Completion Summary

| Status | Symbol | Count |
|--------|--------|-------|
| Completed | ✅ | 17 |
| In Progress | 🔄 | 0 |
| Pending | ⬜ | 0 |
| Blocked | ❌ | 0 |

**Last Updated**: 2026-01-16 (ALL PHASES COMPLETE)
