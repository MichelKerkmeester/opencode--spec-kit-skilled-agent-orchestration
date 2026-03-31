---
title: "Implementation [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/071-speckit-level-alignment/checklist]"
description: "Validation checklist for ensuring SpecKit alignment with level-based template architecture."
trigger_phrases:
  - "implementation"
  - "checklist"
  - "speckit"
  - "level"
  - "based"
  - "071"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Checklist: SpecKit Level-Based Template Alignment

Validation checklist for ensuring SpecKit alignment with level-based template architecture.

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v1.0 -->

---

<!-- ANCHOR:protocol -->
## 1. OBJECTIVE

### Metadata
- **Category**: Checklist
- **Level**: 3
- **Tags**: spec-kit, templates, level-alignment
- **Priority**: P1-high - essential quality gate
- **Type**: Testing & QA - validation during/after implementation

### Purpose
Verify that all SpecKit scripts, lib modules, and documentation are aligned with the level-based template architecture from Spec 069.

### Context
- **Created**: 2026-01-16
- **Feature**: [spec.md](./spec.md)
- **Status**: ✅ Complete

---

<!-- /ANCHOR:protocol -->
## 2. LINKS

### Related Documents
- **Specification**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Task List**: [tasks.md](./tasks.md)
- **Related Spec**: [069-speckit-template-complexity](../069-speckit-template-complexity/)

---

## 3. CHECKLIST CATEGORIES

### Pre-Implementation Readiness

- [x] CHK001 [P0] Level folders exist and are populated | Evidence: `ls -la templates/level_*/` shows 4/5/6/6 files
- [x] CHK002 [P0] Existing tests pass (171 tests) | Evidence: `run-tests.sh` output: 171 passed
- [x] CHK003 [P1] Spec.md completed with requirements | Evidence: spec.md has 18 files, 7 success criteria
- [x] CHK004 [P1] Plan.md completed with implementation details | Evidence: 4 phases, 19 files documented
- [x] CHK005 [P1] Tasks.md organized by phase | Evidence: 17 tasks across 4 phases

### Phase 1: Script Updates (P0)

- [x] CHK010 [P0] `create-spec-folder.sh` uses level folders | Evidence: get_level_templates_dir() added at line 267-279, LEVEL_TEMPLATES_DIR used at lines 390, 520
- [x] CHK011 [P0] `expand-template.js` resolves from level folders | Evidence: getTemplatesDir(level) at lines 157-169, getBaseTemplatesDir() at 171-177
- [x] CHK012 [P0] Script test: Level 1 copies from `templates/level_1/` | Evidence: spec.md=389 lines (matches level_1 template)
- [x] CHK013 [P0] Script test: Level 2 copies from `templates/level_2/` | Evidence: spec.md=469 lines, checklist.md=261 lines
- [x] CHK014 [P0] Script test: Level 3 copies from `templates/level_3/` | Evidence: spec.md=522 lines, checklist.md=289 lines
- [x] CHK015 [P1] Fallback to root templates works if level folder missing | Evidence: fallback logic in copy_template() lines 546-550

### Phase 2: Lib Module Updates (P1)

- [x] CHK020 [P1] `preprocessor.js` updated for folder selection | Evidence: selectLevelFolder() added lines 61-74, processTemplateDirectory() refactored lines 228-297
- [x] CHK021 [P2] `features.js` obsolete templatePath fields removed | Evidence: 4 templatePath properties removed, deprecation notice added lines 7-16
- [x] CHK022 [P3] `marker-parser.js` has deprecation notice | Evidence: @deprecated JSDoc added lines 18-23
- [x] CHK023 [P3] `user-stories.js` COMPLEXITY_GATE syntax removed | Evidence: generatePlaceholder() updated lines 192-223, markers removed

### Phase 3: Documentation Updates (P1-P2)

- [x] CHK030 [P0] `SKILL.md` documents level folder structure | Evidence: Resource Inventory updated lines 245-269, new Template Folder Architecture section
- [x] CHK031 [P1] `README.md` copy commands updated (~15 locations) | Evidence: 17 copy commands updated to level_N/ paths
- [x] CHK032 [P1] `level_specifications.md` paths updated (~12 locations) | Evidence: All level sections updated with correct folder paths
- [x] CHK033 [P1] `template_guide.md` commands updated (~8 locations) | Evidence: Copy commands updated, new Templates section lines 999-1028
- [x] CHK034 [P1] `complexity_guide.md` markers deprecated | Evidence: Deprecation notice added lines 175-177, Templates section restructured lines 328-353
- [x] CHK035 [P2] `quick_reference.md` commands updated | Evidence: Section 3 and 19 updated with level-based paths (30 references)
- [x] CHK036 [P2] `template_mapping.md` commands updated | Evidence: Sections 3, 8, 9 updated (45 references to level paths)
- [x] CHK037 [P2] `validation_rules.md` example updated | Evidence: Line 119 updated to templates/level_1/spec.md
- [x] CHK038 [P2] `phase_checklists.md` link updated | Evidence: Line 176 updated to templates/level_2/checklist.md
- [x] CHK039 [P2] Root templates references updated | Evidence: plan.md line 464, tasks.md line 359 updated

### Phase 4: Template Cleanup (P1)

- [x] CHK040 [P1] `level_2/checklist.md` COMPLEXITY_GATE markers removed | Evidence: 6 markers removed, grep returns no matches
- [x] CHK041 [P1] Content from markers preserved (Research, Bug Fix, Refactoring sections) | Evidence: CHK-R01-06, CHK-B01-06, CHK-RF01-05 preserved

### Final Verification

- [x] CHK050 [P0] All 171 existing tests still pass | Evidence: run-tests.sh output: 171 passed, 0 failed
- [x] CHK051 [P0] No COMPLEXITY_GATE markers in any level folder | Evidence: grep -r "COMPLEXITY_GATE" templates/level_*/ returns no matches
- [x] CHK052 [P0] `grep "templates/spec.md" scripts/` returns no matches | Evidence: grep returned "No broken paths found"
- [x] CHK053 [P1] New spec folders use level-appropriate templates | Evidence: Level 1-3+ tests show different file sizes
- [x] CHK054 [P1] Backward compatibility verified (root templates still work) | Evidence: fallback logic tested, root templates remain

---

<!-- ANCHOR:protocol -->
## VERIFICATION PROTOCOL

### Priority Enforcement

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0] Critical** | HARD BLOCKER | Cannot claim done until complete |
| **[P1] High** | Required | Must complete OR get user approval to defer |
| **[P2] Medium** | Optional | Can defer with documented reason |
| **[P3] Low** | Nice to have | Can skip if time-constrained |

### Evidence Format

When marking items complete, include evidence:

```markdown
- [x] CHK010 [P0] create-spec-folder.sh uses level folders | Evidence: git diff shows line 521 updated
- [x] CHK050 [P0] All tests pass | Evidence: 171/171 tests pass
```

### Verification Summary

| Category | P0 | P1 | P2 | P3 | Total |
|----------|----|----|----|----|-------|
| Pre-Implementation | 2/2 | 3/3 | 0/0 | 0/0 | 5/5 |
| Phase 1: Scripts | 5/5 | 1/1 | 0/0 | 0/0 | 6/6 |
| Phase 2: Lib Modules | 0/0 | 1/1 | 1/1 | 2/2 | 4/4 |
| Phase 3: Documentation | 1/1 | 4/4 | 5/5 | 0/0 | 10/10 |
| Phase 4: Templates | 0/0 | 2/2 | 0/0 | 0/0 | 2/2 |
| Final Verification | 3/3 | 2/2 | 0/0 | 0/0 | 5/5 |
| **Total** | **11/11** | **13/13** | **6/6** | **2/2** | **32/32** |

<!-- /ANCHOR:protocol -->
---

## 4. USAGE NOTES

### Checking Items Off
- Mark completed items: `[x]`
- Add evidence after `|` separator
- Link to relevant files or command outputs

### Quick Commands

```bash
# Verify level folders
ls -la .opencode/skill/system-spec-kit/templates/level_*/

# Check for COMPLEXITY_GATE markers
grep -r "COMPLEXITY_GATE" .opencode/skill/system-spec-kit/templates/level_*/

# Run test suite
bash .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/069-speckit-template-complexity/tests/run-tests.sh

# Test script at each level
for level in 1 2 3; do
  ./scripts/create-spec-folder.sh "Test Level $level" --level $level --skip-branch
done
```

---

**Last Updated**: 2026-01-16
