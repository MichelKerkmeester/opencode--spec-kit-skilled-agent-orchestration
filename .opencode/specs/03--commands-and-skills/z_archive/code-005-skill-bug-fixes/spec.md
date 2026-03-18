---
title: "Feature Specification: workflows-code Skill Bug Fixes [005-skill-bug-fixes/spec]"
description: "Fix critical bugs, broken cross-references, and template compliance issues in the workflows-code skill identified through comprehensive multi-agent analysis."
trigger_phrases:
  - "feature"
  - "specification"
  - "workflows"
  - "code"
  - "skill"
  - "spec"
  - "024"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: workflows-code Skill Bug Fixes

Fix critical bugs, broken cross-references, and template compliance issues in the workflows-code skill identified through comprehensive multi-agent analysis.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. OBJECTIVE

### Metadata
- **Category**: Bug Fix
- **Level**: 2
- **Tags**: workflows-code, bug-fix, cross-references, template-compliance
- **Priority**: P0
- **Feature Branch**: `078-speckit-test-suite`
- **Created**: 2026-01-24
- **Status**: In Progress
- **Input**: Multi-agent analysis revealing 12 SKILL.md bugs, 17 broken cross-references, 6 missing files

### Stakeholders
- OpenCode AI Assistant (primary skill user)
- Developers using workflows-code for frontend development

### Problem Statement
The workflows-code skill has accumulated multiple issues:
1. **CRITICAL**: Script references point to deleted files (`scripts/minify-webflow.mjs`, etc.)
2. **HIGH**: Phase 1.5 (Code Quality Gate) missing from overview tables
3. **HIGH**: 17 broken cross-reference paths using wrong relative paths
4. **MEDIUM**: Template compliance at 78/100 with structural violations

### Purpose
Resolve all identified bugs to restore skill functionality and improve template compliance.

### Assumptions

- Existing skill structure is correct; only fixing specific bugs
- Script references should be removed or updated (scripts were intentionally deleted)
- Cross-reference path fixes are straightforward corrections
- No major architectural changes required

**Assumptions Validation Checklist**:
- [x] All assumptions reviewed with stakeholders
- [x] Technical feasibility verified for each assumption
- [x] Risk assessment completed for critical assumptions
- [x] Fallback plans identified for uncertain assumptions

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:scope -->
## 2. SCOPE

### In Scope
- Fix/remove broken script references in SKILL.md (lines 706-715)
- Add Phase 1.5 to overview tables (lines 52-56, 614-619)
- Fix 17 broken cross-reference paths across 8 files
- Update inconsistent naming (camelCase vs snake_case in examples)

### Out of Scope
- Major restructuring (flattening references/ folder)
- Adding README.md (optional improvement)
- Refactoring Resource Router (complexity is acceptable)
- Changes to asset files (97% health, no fixes needed)

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:user-stories -->
## 3. USERS & STORIES

### User Story 1 - Working Script References (Priority: P0)

As the AI assistant using workflows-code, I need script references to point to valid files or be removed, so that I don't instruct users to run non-existent scripts.

**Acceptance Scenarios**:
1. **Given** I read minification instructions, **When** scripts are referenced, **Then** they exist or instructions are updated

---

### User Story 2 - Complete Phase Documentation (Priority: P0)

As the AI assistant, I need Phase 1.5 to appear in all phase tables, so that the Code Quality Gate is consistently documented.

**Acceptance Scenarios**:
1. **Given** I look at the phase overview, **When** all phases are listed, **Then** Phase 1.5 appears with correct entry/exit criteria

---

### User Story 3 - Valid Cross-References (Priority: P1)

As the AI assistant, I need all internal links to resolve correctly, so that I can navigate between reference documents.

**Acceptance Scenarios**:
1. **Given** I click any internal link, **When** following the path, **Then** the target file exists at that location

<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:requirements -->
## 4. FUNCTIONAL REQUIREMENTS

- **REQ-FUNC-001:** SKILL.md MUST NOT reference non-existent script files
- **REQ-FUNC-002:** All phase overview tables MUST include Phase 1.5
- **REQ-FUNC-003:** All cross-reference paths MUST use correct relative paths
- **REQ-FUNC-004:** Code examples MUST use consistent snake_case naming

### Traceability Mapping

| User Story | Related Requirements | Notes |
|------------|---------------------|-------|
| Story 1 - Script References | REQ-FUNC-001 | Remove or update |
| Story 2 - Phase Documentation | REQ-FUNC-002 | Add to 2 tables |
| Story 3 - Cross-References | REQ-FUNC-003 | Fix 17 paths |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:nfr -->
## 5. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Fixes should not introduce new issues
- **NFR-M02**: Cross-references should use relative paths consistently

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 6. EDGE CASES

### Error Scenarios
- What if a referenced file was moved, not deleted? Verify file locations before fixing.
- What if Phase 1.5 trigger logic needs updating? Only update documentation, not logic.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:success-criteria -->
## 7. SUCCESS CRITERIA

### Measurable Outcomes

- **SC-001**: Zero broken cross-references (currently 17)
- **SC-002**: Zero references to deleted scripts (currently 3)
- **SC-003**: Phase 1.5 appears in all phase tables (currently missing from 2)
- **SC-004**: Template compliance improves (currently 78/100)

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 8. DEPENDENCIES & RISKS

### Dependencies

| Dependency | Type | Owner | Status | Impact if Blocked |
|------------|------|-------|--------|-------------------|
| SKILL.md | Internal | Existing | Green | Primary fix target |
| 8 reference files | Internal | Existing | Green | Cross-reference targets |

### Risk Assessment

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy |
|---------|-------------|--------|------------|---------------------|
| R-001 | Fixing paths breaks other references | Medium | Low | Verify all paths before/after |
| R-002 | Missing context for script deletion | Low | Low | Remove references, note in changelog |

<!-- /ANCHOR:risks -->

---

## 9. OUT OF SCOPE

- Restructuring references/ folder to flat structure
- Adding missing README.md
- Refactoring Resource Router complexity
- Fixing asset files (already healthy)

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

All questions resolved through prior analysis.

<!-- /ANCHOR:questions -->

---

## 11. APPENDIX

### References

- **Analysis Source**: Multi-agent research (10 opus agents)
- **Skill Location**: `.opencode/skill/sk-code--web/`
- **Prior Specs**: `.opencode/specs/03--commands-and-skills/z_archive/code-004-quality-enforcement/`

### Files to Modify

1. **SKILL.md** - Lines 52-56, 614-619, 706-715
2. **references/verification/verification_workflows.md** - Lines 600-602
3. **references/debugging/debugging_workflows.md** - Line 25
4. **references/implementation/security_patterns.md** - Line 561
5. **references/implementation/performance_patterns.md** - Lines 492-493
6. **references/deployment/minification_guide.md** - Lines 509-510
7. **references/standards/code_style_guide.md** - Lines 751-753
8. **references/standards/code_quality_standards.md** - Line 1063
9. **references/standards/quick_reference.md** - Lines 382-384

---

<!-- ANCHOR:changelog -->
## 12. CHANGELOG

### Version History

#### v1.0 (2026-01-24)
**Initial specification** - Based on comprehensive multi-agent analysis

<!-- /ANCHOR:changelog -->
