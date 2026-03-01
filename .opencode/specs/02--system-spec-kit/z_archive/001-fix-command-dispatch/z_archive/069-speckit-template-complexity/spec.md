---
title: "Feature Specification: Level-Based Template Architecture [069-speckit-template-complexity/spec]"
description: "Transform static system-spec-kit templates into a level-based folder system with pre-expanded templates for each documentation level."
trigger_phrases:
  - "feature"
  - "specification"
  - "level"
  - "based"
  - "template"
  - "spec"
  - "069"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Level-Based Template Architecture

Transform static system-spec-kit templates into a level-based folder system with pre-expanded templates for each documentation level.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Feature
- **Level**: 3
- **Tags**: spec-kit, templates, complexity-detection
- **Priority**: P1
- **Feature Branch**: `069-speckit-template-complexity`
- **Created**: 2026-01-16
- **Status**: Complete
- **Input**: Analysis of specs 056-068 showing documentation ranges from 60 LOC to 3,315 LOC

### Stakeholders
- OpenCode/SpecKit users who create spec folders
- AI assistants that populate templates
- Developers maintaining the system-spec-kit skill

### Problem Statement
Current templates use a single set of files for all documentation levels:
- Same template structure regardless of task complexity
- Simple tasks get bloated with unnecessary sections
- Complex tasks lack AI execution protocols, dependency graphs, decision records
- Runtime marker parsing adds complexity and potential failure points
- Template maintainers must understand marker syntax

Evidence: Spec 064 (bug analysis) has 1,482 lines in tasks.md with AI protocols; spec 067 (simple upgrade) has 15 lines.

### Purpose
Provide level-appropriate templates through dedicated folder structure, eliminating runtime marker parsing while ensuring simple tasks get streamlined templates and complex tasks get comprehensive documentation scaffolding.

### Assumptions
- Complexity can be reliably estimated from task descriptions and project characteristics
- The existing `recommend-level.sh` scoring algorithm provides a valid foundation to extend
- Pre-expanded templates in level folders are easier to maintain than marker-based conditional content
- Users will accept complexity detection recommendations (with override capability)

---

## 2. SCOPE

### In Scope
- 5-dimension complexity detection algorithm (Scope, Risk, Research, Multi-Agent, Coordination)
- Level-specific template folders (`level_1/`, `level_2/`, `level_3/`, `level_3+/`)
- Pre-expanded templates with appropriate section counts per level
- Level 3+ extended templates with AI execution protocols and decision records
- CLI tools for complexity detection and template folder selection
- 4 new validation rules for level consistency
- Integration with existing `create-spec-folder.sh` and `recommend-level.sh`

### Out of Scope
- GUI for complexity configuration (CLI-only)
- Machine learning-based complexity prediction (rule-based only)
- Automatic template migration for existing specs
- Real-time complexity re-assessment during implementation
- Runtime marker parsing (replaced by pre-expanded templates)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/lib/complexity/` | Create | Core complexity detection infrastructure |
| `.opencode/skill/system-spec-kit/lib/expansion/` | Create | Template folder selection system |
| `.opencode/skill/system-spec-kit/templates/level_1/` | Create | Minimal templates (spec, plan, tasks, implementation-summary) |
| `.opencode/skill/system-spec-kit/templates/level_2/` | Create | Standard templates + checklist |
| `.opencode/skill/system-spec-kit/templates/level_3/` | Create | Full templates + decision-record |
| `.opencode/skill/system-spec-kit/templates/level_3+/` | Create | Extended templates + AI protocols, workstreams |
| `.opencode/skill/system-spec-kit/scripts/create-spec-folder.sh` | Modify | Add --complexity flag, folder selection logic |
| `.opencode/skill/system-spec-kit/scripts/detect-complexity.js` | Create | CLI detection tool |
| `.opencode/skill/system-spec-kit/scripts/expand-template.js` | Create | CLI folder selection tool |
| `.opencode/skill/system-spec-kit/config/complexity-config.jsonc` | Create | Configuration file |

---

## 3. USERS & STORIES

### User Story 1 - Automatic Complexity Detection (Priority: P0)

As a developer creating a new spec folder, I need the system to automatically analyze my task description and recommend an appropriate documentation level so that I don't have to manually estimate complexity.

**Why This Priority**: P0 because without complexity detection, the entire feature provides no value - this is the foundation.

**Independent Test**: Run `detect-complexity.js` with various task descriptions and verify scores align with manual assessment.

**Acceptance Scenarios**:
1. **Given** a task description "Add user authentication with OAuth2", **When** running complexity detection, **Then** it returns a score with breakdown showing Risk dimension elevated due to auth keywords.
2. **Given** a simple task "Fix typo in README", **When** running complexity detection, **Then** it returns a low score (< 25) recommending Level 1.

---

### User Story 2 - Level-Based Template Selection (Priority: P0)

As a developer using `create-spec-folder.sh`, I need the system to copy templates from the appropriate level folder so that simple tasks get streamlined templates and complex tasks get comprehensive ones.

**Why This Priority**: P0 because without template selection, complexity detection alone provides limited value.

**Independent Test**: Create spec folders at different levels and verify template content matches level specifications.

**Acceptance Scenarios**:
1. **Given** complexity Level 1, **When** spec folder is created, **Then** templates from `level_1/` are copied (spec.md, plan.md, tasks.md, implementation-summary.md).
2. **Given** complexity Level 3+, **When** spec folder is created, **Then** templates from `level_3+/` are copied including AI execution protocols and decision-record.md.

---

### User Story 3 - Pre-Expanded Template Folders (Priority: P1)

As a template maintainer, I need dedicated folders for each documentation level so that I can maintain level-appropriate templates without complex marker syntax.

**Why This Priority**: P1 because folder structure is the implementation mechanism for US2.

**Independent Test**: Verify each level folder contains the correct set of templates with appropriate content depth.

**Acceptance Scenarios**:
1. **Given** the `level_1/` folder, **Then** it contains only: spec.md, plan.md, tasks.md, implementation-summary.md with minimal sections.
2. **Given** the `level_3+/` folder, **Then** it contains all templates plus AI protocols, workstream sections, and decision-record.md.

---

### User Story 4 - Complexity Validation Rules (Priority: P1)

As a developer completing a spec, I need validation rules that verify my documentation depth matches the declared complexity level so that I don't under-document complex features or over-document simple ones.

**Why This Priority**: P1 because validation ensures quality but the system works without it initially.

**Independent Test**: Run validation on specs with mismatched content/level and verify appropriate warnings/errors.

**Acceptance Scenarios**:
1. **Given** a Level 3 spec with only 2 user stories, **When** validation runs, **Then** it warns about insufficient user stories for the declared level.
2. **Given** a Level 1 spec with AI protocols, **When** validation runs, **Then** it suggests upgrading to Level 3.

---

### User Story 5 - CLI Integration (Priority: P2)

As a power user, I need CLI tools for detecting complexity and expanding templates so that I can integrate these into custom workflows.

**Why This Priority**: P2 because the main use case is through create-spec-folder.sh integration.

**Independent Test**: Run CLI tools directly with various flags and verify expected outputs.

**Acceptance Scenarios**:
1. **Given** running `detect-complexity.js --request "Complex OAuth implementation"`, **Then** JSON output includes score, breakdown, and recommended level.
2. **Given** running `expand-template.js --level 3 --spec-folder ./specs/test/`, **Then** templates are expanded with Level 3 content.

---

## 4. FUNCTIONAL REQUIREMENTS

- **REQ-FUNC-001:** System MUST calculate complexity score (0-100) from 5 weighted dimensions
- **REQ-FUNC-002:** System MUST map scores to levels: <25=L1, 26-55=L2, 56-79=L3, 80-100=L3+
- **REQ-FUNC-003:** System MUST maintain pre-expanded templates in level-specific folders
- **REQ-FUNC-004:** System MUST copy templates from the appropriate level folder based on detected/selected level
- **REQ-FUNC-005:** System MUST support `--complexity` flag in create-spec-folder.sh
- **REQ-FUNC-006:** System MUST output complexity breakdown in JSON format
- **REQ-FUNC-007:** System MUST allow manual level override after detection
- **REQ-FUNC-008:** System MUST preserve backward compatibility with existing templates

### Traceability Mapping

| User Story | Related Requirements | Notes |
|------------|---------------------|-------|
| US1 - Complexity Detection | REQ-FUNC-001, REQ-FUNC-002, REQ-FUNC-006 | Core detection |
| US2 - Template Selection | REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-008 | Folder-based selection |
| US3 - Template Folders | REQ-FUNC-003 | Level folder structure |
| US4 - Validation | REQ-FUNC-002 | Level consistency |
| US5 - CLI Integration | REQ-FUNC-005, REQ-FUNC-006, REQ-FUNC-007 | User interface |

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Complexity detection MUST complete in < 500ms for typical task descriptions
- **NFR-P02**: Template expansion MUST complete in < 2 seconds per template file

### Reliability
- **NFR-R01**: Missing level folder MUST fail gracefully with clear error message suggesting fallback
- **NFR-R02**: Legacy templates (root level) MUST continue to work for backward compatibility

### Usability
- **NFR-U01**: Complexity display MUST include visual breakdown for user understanding
- **NFR-U02**: Override process MUST be single-keystroke (Y/1/2/3)

### Operability
- **NFR-O01**: All JavaScript tools MUST work with Node.js 16+
- **NFR-O02**: Bash scripts MUST work on macOS and Linux

---

## 6. EDGE CASES

### Data Boundaries
- Empty task description: Use default/minimum complexity (Level 1)
- Very long descriptions (>10000 chars): Truncate to first 10000 chars for analysis
- Non-ASCII characters: Support full Unicode in task descriptions

### Error Scenarios
- Missing complexity config file: Fall back to hardcoded defaults
- Missing level folder: Fall back to root templates with warning
- Template file not found in level folder: Error with specific file path and suggestion

### State Transitions
- User overrides detected level: Use override, document in spec metadata
- Complexity changes during implementation: No automatic re-assessment, manual update

---

## 7. SUCCESS CRITERIA

### Measurable Outcomes
- **SC-001**: Complexity detection accuracy >= 85% match with manual assessment on specs 056-068
- **SC-002**: All level folders contain valid, complete templates
- **SC-003**: All 4 validation rules catch appropriate mismatches
- **SC-004**: Zero breaking changes to existing spec folders

### KPI Targets

| Category | Metric | Target | Measurement Method |
|----------|--------|--------|-------------------|
| Accuracy | Detection alignment with manual review | >= 85% | Retrospective on specs 056-068 |
| Quality | Validation rule effectiveness | 100% catch rate for test cases | Unit tests |
| Compatibility | Existing specs pass validation | 100% | Integration tests |
| Performance | Detection/expansion time | < 3 seconds combined | Benchmarks |

---

## 8. DEPENDENCIES & RISKS

### Dependencies

| Dependency | Type | Owner | Status | Impact if Blocked |
|------------|------|-------|--------|-------------------|
| recommend-level.sh | Internal | SpecKit | Green | Core extension point |
| create-spec-folder.sh | Internal | SpecKit | Green | Integration target |
| Node.js 16+ | Technical | Runtime | Green | Required for JS tools |

### Risk Assessment

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-------------|--------|------------|---------------------|-------|
| R-001 | Over-detection of complexity | Med | Med | Configurable thresholds, user override | Dev |
| R-002 | Template duplication across levels | Low | Med | Shared components, clear inheritance model | Dev |
| R-003 | Backward compatibility breaks | High | Low | Keep root templates as fallback, extensive testing | Dev |

### Rollback Plan
- **Rollback Trigger**: Existing specs fail validation after changes
- **Rollback Procedure**:
  1. Revert to using root-level templates
  2. Disable complexity detection in create-spec-folder.sh
  3. Keep level folders but don't use them
- **Data Migration Reversal**: N/A - no data migration

---

## 9. OUT OF SCOPE

**Explicit Exclusions**:
- Auto-upgrading existing specs when templates change - too risky without user consent
- Real-time complexity re-assessment during implementation - unnecessary complexity
- ML-based prediction - overkill for rule-based system
- GUI configuration - CLI-first approach

---

## 10. OPEN QUESTIONS

Resolved during planning:
- Complexity detection will be opt-in via environment variable initially, default-on later
- No auto-upgrade of existing specs
- Level 3+ threshold set at 80/100 points
- Architecture changed from COMPLEXITY_GATE markers to dedicated level folders

---

## 11. APPENDIX

### References
- **Related Specs**: Analysis of specs 056-068 in prior planning
- **Existing Scripts**: recommend-level.sh (534 LOC), create-spec-folder.sh (822 LOC)

### Diagrams

```
Complexity Detection and Template Selection Flow:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Task      │────▶│  5-Dim      │────▶│  Level      │
│   Input     │     │  Scoring    │     │  Mapping    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │                    │
                           ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  JSON       │     │  Folder     │
                    │  Output     │     │  Selection  │
                    └─────────────┘     └─────────────┘
                                              │
                           ┌──────────────────┼──────────────────┐
                           │                  │                  │
                           ▼                  ▼                  ▼
                    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
                    │  level_1/   │    │  level_2/   │    │  level_3+/  │
                    │  templates  │    │  templates  │    │  templates  │
                    └─────────────┘    └─────────────┘    └─────────────┘

Template Folder Structure:
templates/
├── level_1/           # Minimal (spec, plan, tasks, impl-summary)
├── level_2/           # Standard + checklist
├── level_3/           # Full + decision-record
└── level_3+/          # Extended + AI protocols, workstreams
```

---

## 12. WORKING FILES

### File Organization During Development
- `scratch/` - For test scripts, complexity analysis drafts
- `memory/` - Session context for continuity
- Root - Final documentation (spec.md, plan.md, tasks.md, checklist.md, decision-record.md)

---

## 13. CHANGELOG

### Version History

#### v1.1 (2026-01-16)
**Architecture update**
- Changed from COMPLEXITY_GATE markers to level-specific template folders
- Updated user stories to reflect folder-based approach
- Revised functional requirements for folder selection instead of marker parsing

#### v1.0 (2026-01-16)
**Initial specification**
- Defined 5-dimension complexity scoring
- Specified COMPLEXITY_GATE marker system (superseded by v1.1)
- Established dynamic section scaling requirements
- Defined 5 user stories covering detection, expansion, validation, and CLI
