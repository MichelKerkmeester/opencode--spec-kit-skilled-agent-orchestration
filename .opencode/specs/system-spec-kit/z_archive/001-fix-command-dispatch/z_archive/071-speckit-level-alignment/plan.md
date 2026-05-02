---
title: "Plan: SpecKit [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/071-speckit-level-alignment/plan]"
description: "Spec Folder: .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/071-speckit-level-alignment"
trigger_phrases:
  - "plan"
  - "speckit"
  - "level"
  - "based"
  - "template"
  - "071"
importance_tier: "important"
contextType: "planning"
---
# Plan: SpecKit Level-Based Template Alignment

**Spec Folder**: `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/071-speckit-level-alignment`
**Level**: 3 (Complex - Multi-agent analysis with architectural implications)
**Status**: VERIFIED - Ready for Implementation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v2.2 -->

---

<!-- ANCHOR:summary -->
## Verification Status 

**Verified on 2026-01-16, RE-VERIFIED after spec 069 closure:**

| Check | Status | Evidence |
|-------|--------|----------|
| Level folders populated | ✅ VERIFIED | `ls -la templates/level_*/` shows 4/5/6/6 files |
| Scripts reference flat templates | ✅ STILL NEEDS FIX | `create-spec-folder.sh:521` uses `$TEMPLATES_DIR/$template_name` |
| level_2/checklist.md markers | ✅ STILL NEEDS FIX | COMPLEXITY_GATE markers still present |
| features.js obsolete paths | ✅ STILL NEEDS FIX | Lines 18,33,43,53 reference `templates/complexity/` |
| Tests passing | ✅ VERIFIED | 171/171 tests pass via `run-tests.sh` |

**Conclusion**: Spec 069 created the level folders and templates, but did NOT update scripts/docs to use them. This alignment work is still required.

---

<!-- /ANCHOR:summary -->
## Executive Summary

Align ALL SpecKit scripts, lib modules, and documentation with the new level-based template architecture from Spec 069. The architecture changed from COMPLEXITY_GATE markers in flat templates to dedicated pre-expanded templates in level folders (`level_1/`, `level_2/`, `level_3/`, `level_3+/`).

**Verified Scope**: 20+ files need updates across scripts, lib modules, documentation, and templates.

<!-- /ANCHOR:summary -->
---

## Current State Analysis

**New Architecture (Spec 069 v1.1)**:
```
templates/
├── level_1/     # 4 files: spec, plan, tasks, implementation-summary ✅
├── level_2/     # 5 files: + checklist ✅
├── level_3/     # 6 files: + decision-record ✅
└── level_3+/    # 6 files: extended content, AI protocols ✅
```

**Problem**: Scripts and documentation still reference the OLD flat structure with COMPLEXITY_GATE markers.

---

<!-- ANCHOR:summary -->
## Alignment Status Summary

| Category | Files Analyzed | Needs Update | Aligned |
|----------|----------------|--------------|---------|
| **Scripts** | 18 | 2 | 16 |
| **Lib Modules** | 15 | 4 | 11 |
| **Documentation** | 10 | 10 | 0 |
| **Templates** | 25 | 3 | 22 |

<!-- /ANCHOR:summary -->
---

## Phase 1: Script Updates (CRITICAL)

### 1.1 create-spec-folder.sh
**Path**: `.opencode/skill/system-spec-kit/scripts/create-spec-folder.sh`
**Changes**:
- **Line 373**: Add `get_level_templates_dir()` function
- **Lines 391-405**: Replace conditional copying with level folder iteration
- **Lines 515-547**: Same updates for main mode
- **Lines 41-44**: Add support for "3+" level validation

```bash
# NEW: Add after line 265
get_level_templates_dir() {
    local level="$1"
    local base_dir="$2"
    case "$level" in
        1|2|3) echo "$base_dir/level_$level" ;;
        "3+"|4) echo "$base_dir/level_3+" ;;
        *) echo "$base_dir/level_1" ;;
    esac
}

# REPLACE lines 391-405:
for template_file in "$TEMPLATES_DIR"/*.md; do
    [ -f "$template_file" ] && copy_template "$(basename "$template_file")"
done
```

### 1.2 expand-template.js
**Path**: `.opencode/skill/system-spec-kit/scripts/expand-template.js`
**Changes**:
- **Lines 157-159**: Update `getTemplatesDir(level)` to return level folder
- **Lines 171-176**: Add fallback to root templates

```javascript
// MODIFY getTemplatesDir():
function getTemplatesDir(level = null) {
  const baseDir = path.join(__dirname, '..', 'templates');
  if (!level) return baseDir;

  const levelFolder = level === '3+' ? 'level_3+' : `level_${level}`;
  const levelDir = path.join(baseDir, levelFolder);
  return fs.existsSync(levelDir) ? levelDir : baseDir;
}
```

---

## Phase 2: Lib Module Updates (HIGH)

### 2.1 lib/expansion/preprocessor.js
**Changes**:
- **Lines 219-252**: Refactor `processTemplateDirectory()` for folder selection
- **Lines 260-303**: Update `expand()` for level-aware path resolution
- Add `selectLevelFolder(level)` helper function

### 2.2 lib/complexity/features.js
**Changes**:
- **Lines 17-92**: Remove obsolete `templatePath` fields (point to old `complexity/` folder)
- **Lines 166-179**: Keep COMPLEXITY_GATE functions but add deprecation notice

### 2.3 lib/expansion/marker-parser.js
**Changes**: Add deprecation notice only (keep for backward compat)

### 2.4 lib/expansion/generators/user-stories.js
**Changes**:
- **Line 208**: Remove COMPLEXITY_GATE syntax from `generatePlaceholder()`

---

## Phase 3: Documentation Updates (HIGH - EXPANDED SCOPE)

**Note**: Grep verification found significantly more documentation files needing updates.

### 3.1 SKILL.md (P0)
**Path**: `.opencode/skill/system-spec-kit/SKILL.md`
**Changes**:
- Update Resource Inventory table to show level folders
- Replace COMPLEXITY_GATE workflow with folder selection
- Add Template Folder Architecture documentation

### 3.2 README.md (P1)
**Path**: `.opencode/skill/system-spec-kit/README.md`
**Changes** (multiple locations):
- Lines 412, 428, 466: Update copy commands for Level 1-3
- Lines 1003-1004, 1553-1554, 1559: Update test fixture commands
- Lines 1655-1656, 1891: Update manual copy examples

### 3.3 level_specifications.md (P1)
**Path**: `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`
**Changes**:
- Lines 46-47, 97-100: Level 1 sources → `templates/level_1/`
- Lines 173-178: Level 2 sources → `templates/level_2/`
- Lines 275-278: Level 3 sources → `templates/level_3/`
- Lines 397-400: Level 3+ sources → `templates/level_3+/`
- Lines 639-642: Update template links

### 3.4 template_guide.md (P1)
**Path**: `.opencode/skill/system-spec-kit/references/templates/template_guide.md`
**Changes**:
- Lines 56-57, 107, 400, 685: Update copy commands
- Lines 999-1002: Update template links

### 3.5 complexity_guide.md (P1)
**Path**: `.opencode/skill/system-spec-kit/references/templates/complexity_guide.md`
**Changes**:
- Lines 325-328: Update main template paths
- Lines 331-334: Update complexity/ references (or remove)

### 3.6 quick_reference.md (P2)
**Path**: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
**Changes**:
- Lines 53-54, 63: Update copy commands
- Lines 552-555: Update template links

### 3.7 template_mapping.md (P2)
**Path**: `.opencode/skill/system-spec-kit/assets/template_mapping.md`
**Changes**:
- Lines 53-54, 61, 258-259, 266: Update copy commands
- Lines 313-316: Update template links

### 3.8 validation_rules.md (P2)
**Path**: `.opencode/skill/system-spec-kit/references/validation/validation_rules.md`
**Changes**:
- Line 119: Update copy command example

### 3.9 phase_checklists.md (P2)
**Path**: `.opencode/skill/system-spec-kit/references/validation/phase_checklists.md`
**Changes**:
- Line 176: Update checklist.md link

### 3.10 Root Template References (P2)
**Paths**: `templates/plan.md`, `templates/tasks.md`
**Changes**:
- plan.md line 464: Update checklist.md reference
- tasks.md line 359: Update checklist.md reference

---

## Phase 4: Template Cleanup (MEDIUM)

### 4.1 level_2/checklist.md (BUG FIX)
**Issue**: Contains 6 COMPLEXITY_GATE markers (lines 107-137) - should be pre-expanded
**Fix**: Remove markers, keep content

### 4.2 complexity/ Folder
**Decision**: KEEP for backward compatibility (used by expand-template.js)

### 4.3 Root Templates
**Decision**: KEEP as fallback for dynamic expansion workflow

---

## Critical Files List (VERIFIED)

| Priority | File | Change Type | Lines Affected |
|----------|------|-------------|----------------|
| **P0 - CRITICAL** | | | |
| P0 | `scripts/create-spec-folder.sh` | Modify - level folder selection | 265, 373, 391-405, 515-547 |
| P0 | `scripts/expand-template.js` | Modify - level folder selection | 157-159, 171-176 |
| P0 | `SKILL.md` | Modify - document level folders | 247-262, 379-382 |
| **P1 - HIGH** | | | |
| P1 | `lib/expansion/preprocessor.js` | Modify - folder-based selection | 219-252 |
| P1 | `templates/level_2/checklist.md` | Modify - remove COMPLEXITY_GATE | 107-137 |
| P1 | `README.md` | Modify - update copy commands | ~15 locations |
| P1 | `references/templates/level_specifications.md` | Modify - update paths | ~12 locations |
| P1 | `references/templates/template_guide.md` | Modify - update commands | ~8 locations |
| P1 | `references/templates/complexity_guide.md` | Modify - deprecate markers | 325-334 |
| **P2 - MEDIUM** | | | |
| P2 | `lib/complexity/features.js` | Modify - remove templatePath | 18, 33, 43, 53 |
| P2 | `references/workflows/quick_reference.md` | Modify - update commands | ~6 locations |
| P2 | `assets/template_mapping.md` | Modify - update copy commands | ~8 locations |
| P2 | `templates/plan.md` | Modify - update reference | 464 |
| P2 | `templates/tasks.md` | Modify - update reference | 359 |
| **P3 - LOW** | | | |
| P3 | `lib/expansion/marker-parser.js` | Modify - add deprecation notice | Header |
| P3 | `lib/expansion/generators/user-stories.js` | Modify - remove marker syntax | 208 |
| P3 | `references/validation/validation_rules.md` | Modify - update example | 119 |
| P3 | `references/validation/phase_checklists.md` | Modify - update link | 176 |

**Total Files**: 18 files requiring modification

---

## Verification Plan

### Pre-Implementation Checks
```bash
# Verify level folders exist and are populated
ls -la .opencode/skill/system-spec-kit/templates/level_*/

# Verify level templates are clean (no COMPLEXITY_GATE except level_2/checklist)
grep -r "COMPLEXITY_GATE" .opencode/skill/system-spec-kit/templates/level_*/
```

### Post-Implementation Checks
```bash
# Test create-spec-folder at each level
for level in 1 2 3; do
  ./scripts/create-spec-folder.sh "Test Level $level" --level $level --skip-branch
done

# Test expand-template for level selection
node scripts/expand-template.js --template spec.md --level 2 --dry-run

# Verify no broken paths
grep -r "templates/spec.md" .opencode/skill/system-spec-kit/scripts/
grep -r "templates/plan.md" .opencode/skill/system-spec-kit/scripts/
```

### Run Existing Tests
```bash
cd .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/069-speckit-template-complexity
bash tests/run-tests.sh
```

---

## Estimated Effort (UPDATED)

| Phase | Files | Estimated Changes |
|-------|-------|-------------------|
| Phase 1: Scripts | 2 | ~100 lines modified |
| Phase 2: Lib Modules | 4 | ~150 lines modified |
| Phase 3: Documentation | 10 | ~350 lines modified |
| Phase 4: Templates | 3 | ~40 lines modified |
| **Total** | **19** | **~640 lines** |

**Note**: Documentation scope expanded significantly based on grep verification.

---

## Success Criteria

1. ✅ `create-spec-folder.sh --level N` copies from `templates/level_N/`
2. ✅ `expand-template.js --level N` resolves from level folder
3. ✅ SKILL.md documents level folder structure
4. ✅ All reference docs point to correct level folder paths
5. ✅ `level_2/checklist.md` has no COMPLEXITY_GATE markers
6. ✅ All 171 existing tests pass
7. ✅ Backward compatibility maintained (root templates still work)
