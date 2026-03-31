---
title: "Feature Specificatio [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/071-speckit-level-alignment/spec]"
description: "Align ALL SpecKit scripts, lib modules, and documentation with the new level-based template architecture from Spec 069."
trigger_phrases:
  - "feature"
  - "specification"
  - "speckit"
  - "level"
  - "based"
  - "spec"
  - "071"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: SpecKit Level-Based Template Alignment

Align ALL SpecKit scripts, lib modules, and documentation with the new level-based template architecture from Spec 069.

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. OBJECTIVE

### Metadata
- **Category**: Enhancement
- **Level**: 3
- **Tags**: spec-kit, templates, level-alignment
- **Priority**: P1
- **Feature Branch**: `071-speckit-level-alignment`
- **Created**: 2026-01-16
- **Status**: ✅ Complete
- **Input**: Spec 069 created level folders but scripts/docs not updated to use them

### Stakeholders
- OpenCode/SpecKit users who create spec folders
- AI assistants that use templates
- Developers maintaining the system-spec-kit skill

### Complexity Assessment

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | 18 files, ~640 LOC, documentation + scripts |
| Risk | 12/25 | Backward compatibility concerns |
| Research | 8/20 | Grep analysis completed |
| Multi-Agent | 8/15 | Documentation parallelizable |
| Coordination | 10/15 | Script and doc dependencies |
| **Overall** | **56/100** | **Level 3** |

### Executive Summary

Spec 069 created the level-based template architecture (`level_1/`, `level_2/`, `level_3/`, `level_3+/`) with pre-expanded templates, but the scripts and documentation still reference the OLD flat structure. This spec aligns all 18 files with the new architecture.

**Key Decisions**:
- Keep root templates as fallback for backward compatibility
- Keep `templates/complexity/` folder for dynamic expansion workflow
- Add deprecation notices to marker-parser.js (don't remove)

**Critical Dependencies**:
- Level folders must exist and be populated (VERIFIED ✅)
- 171 existing tests must continue to pass

### Problem Statement
Scripts (`create-spec-folder.sh`, `expand-template.js`) copy from root templates instead of level-specific folders. Documentation references obsolete `templates/spec.md` paths instead of `templates/level_N/spec.md`. `level_2/checklist.md` still contains COMPLEXITY_GATE markers that should have been pre-expanded.

### Purpose
Enable the SpecKit system to automatically use level-appropriate pre-expanded templates, eliminating runtime marker parsing and providing appropriate template depth for each documentation level.

### Assumptions
- Level folders are correctly populated (VERIFIED)
- Backward compatibility is required (root templates remain)
- Tests must continue to pass after changes

---

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:scope -->
## 2. SCOPE

### In Scope
- Update `create-spec-folder.sh` to copy from level folders
- Update `expand-template.js` to resolve templates from level folders
- Update 10 documentation files with correct template paths
- Remove COMPLEXITY_GATE markers from `level_2/checklist.md`
- Update lib modules (`preprocessor.js`, `features.js`) for level awareness
- Add deprecation notices to marker-related code

### Out of Scope
- Removing backward compatibility (root templates stay)
- Removing marker-parser.js entirely (keep for dynamic expansion)
- Auto-migration of existing spec folders
- GUI changes (CLI-only)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/create-spec-folder.sh` | Modify | Level folder selection |
| `scripts/expand-template.js` | Modify | Level folder selection |
| `SKILL.md` | Modify | Document level folders |
| `lib/expansion/preprocessor.js` | Modify | Folder-based selection |
| `templates/level_2/checklist.md` | Modify | Remove COMPLEXITY_GATE markers |
| `README.md` | Modify | Update copy commands (~15 locations) |
| `references/templates/level_specifications.md` | Modify | Update paths (~12 locations) |
| `references/templates/template_guide.md` | Modify | Update commands (~8 locations) |
| `references/templates/complexity_guide.md` | Modify | Deprecate markers |
| `lib/complexity/features.js` | Modify | Remove obsolete templatePath |
| `references/workflows/quick_reference.md` | Modify | Update commands (~6 locations) |
| `assets/template_mapping.md` | Modify | Update copy commands (~8 locations) |
| `templates/plan.md` | Modify | Update reference |
| `templates/tasks.md` | Modify | Update reference |
| `lib/expansion/marker-parser.js` | Modify | Add deprecation notice |
| `lib/expansion/generators/user-stories.js` | Modify | Remove marker syntax |
| `references/validation/validation_rules.md` | Modify | Update example |
| `references/validation/phase_checklists.md` | Modify | Update link |

<!-- /ANCHOR:scope -->
---

## 3. USERS & STORIES

### User Story 1 - Level-Aware Spec Folder Creation (Priority: P0)

As a developer using `create-spec-folder.sh`, I need the script to copy templates from the appropriate level folder so that simple tasks get streamlined templates and complex tasks get comprehensive ones.

**Acceptance Scenarios**:
1. **Given** `--level 1`, **When** spec folder is created, **Then** templates are copied from `templates/level_1/`
2. **Given** `--level 3`, **When** spec folder is created, **Then** templates are copied from `templates/level_3/` including decision-record.md

---

### User Story 2 - Level-Aware Template Expansion (Priority: P0)

As a developer using `expand-template.js`, I need the script to resolve templates from level folders so that level-appropriate content is provided.

**Acceptance Scenarios**:
1. **Given** `--level 2`, **When** expanding spec.md, **Then** template resolves from `templates/level_2/spec.md`
2. **Given** non-existent level folder, **When** expanding, **Then** fallback to root templates

---

### User Story 3 - Clean Level Templates (Priority: P1)

As a template maintainer, I need level folders to contain pre-expanded templates without COMPLEXITY_GATE markers so that runtime parsing is not required.

**Acceptance Scenarios**:
1. **Given** `level_2/checklist.md`, **Then** no COMPLEXITY_GATE markers present
2. **Given** any level folder template, **Then** content is level-appropriate without conditional markers

---

### User Story 4 - Updated Documentation (Priority: P1)

As a SpecKit user, I need documentation to reference level-specific template paths so that copy commands work correctly.

**Acceptance Scenarios**:
1. **Given** README.md, **Then** copy commands reference `templates/level_N/`
2. **Given** template_guide.md, **Then** all examples use level folders

---

<!-- ANCHOR:requirements -->
## 4. FUNCTIONAL REQUIREMENTS

- **REQ-FUNC-001:** `create-spec-folder.sh` MUST copy templates from `templates/level_N/` based on `--level` flag
- **REQ-FUNC-002:** `expand-template.js` MUST resolve templates from level folders when level is specified
- **REQ-FUNC-003:** System MUST fall back to root templates if level folder does not exist
- **REQ-FUNC-004:** `level_2/checklist.md` MUST NOT contain COMPLEXITY_GATE markers
- **REQ-FUNC-005:** All documentation copy commands MUST reference level folder paths
- **REQ-FUNC-006:** System MUST maintain backward compatibility with root templates

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:requirements -->
## 5. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Template copying MUST complete in < 2 seconds

### Reliability
- **NFR-R01**: All 171 existing tests MUST pass after changes

### Compatibility
- **NFR-C01**: Root templates MUST continue to work as fallback
- **NFR-C02**: Existing spec folders MUST not be affected

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 6. EDGE CASES

### Error Scenarios
- Missing level folder: Fall back to root templates with warning
- Invalid level value: Default to level 1

### State Transitions
- Level 3+ specified: Map to `level_3+/` folder

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:success-criteria -->
## 7. SUCCESS CRITERIA

1. ✅ `create-spec-folder.sh --level N` copies from `templates/level_N/`
2. ✅ `expand-template.js --level N` resolves from level folder
3. ✅ SKILL.md documents level folder structure
4. ✅ All reference docs point to correct level folder paths
5. ✅ `level_2/checklist.md` has no COMPLEXITY_GATE markers
6. ✅ All 171 existing tests pass
7. ✅ Backward compatibility maintained (root templates still work)

<!-- /ANCHOR:success-criteria -->
---

## 8. DEPENDENCIES & RISKS

### Dependencies
| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Level folders populated | Internal | ✅ Green | None - verified |
| Existing test suite | Internal | ✅ Green | Regression detection |

### Risks
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Backward compatibility break | High | Low | Keep root templates as fallback |
| Documentation inconsistency | Medium | Medium | Systematic grep-based updates |

---

## 9. VERIFICATION

### Pre-Implementation
```bash
# Verify level folders exist
ls -la .opencode/skill/system-spec-kit/templates/level_*/

# Verify markers in level_2/checklist.md
grep "COMPLEXITY_GATE" .opencode/skill/system-spec-kit/templates/level_2/checklist.md
```

### Post-Implementation
```bash
# Test script at each level
for level in 1 2 3; do
  ./scripts/create-spec-folder.sh "Test Level $level" --level $level --skip-branch
done

# Run full test suite
bash .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/069-speckit-template-complexity/tests/run-tests.sh
```

---

## 10. CHANGELOG

### v1.0 (2026-01-16)
- Initial specification from verified plan
- 18 files identified for modification
- ~640 lines of changes estimated
