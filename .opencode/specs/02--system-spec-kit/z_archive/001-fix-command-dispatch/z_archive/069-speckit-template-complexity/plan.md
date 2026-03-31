---
title: "Implementation [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/069-speckit-template-complexity/plan]"
description: "Technical approach and architecture for complexity detection and level-based template folder system."
trigger_phrases:
  - "implementation"
  - "plan"
  - "level"
  - "based"
  - "template"
  - "069"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Level-Based Template Architecture

Technical approach and architecture for complexity detection and level-based template folder system.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

<!-- ANCHOR:summary -->
## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: spec-kit, complexity-detection, template-expansion
- **Priority**: P1
- **Branch**: `069-speckit-template-complexity`
- **Date**: 2026-01-16
- **Spec**: [spec.md](./spec.md)

### Input
Feature specification from `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/069-speckit-template-complexity/spec.md`

### Summary
Implement a complexity detection module that scores task descriptions across 5 dimensions, then use those scores to select the appropriate template folder (level_1/, level_2/, level_3/, level_3+/). Integration with existing `create-spec-folder.sh` ensures seamless user experience with pre-expanded, level-appropriate templates.

### Technical Context

- **Language/Version**: JavaScript (Node.js 16+), Bash 3.2+
- **Primary Dependencies**: None (vanilla JS), existing shell scripts
- **Storage**: JSONC configuration file
- **Testing**: Shell script assertions, manual verification
- **Target Platform**: macOS, Linux
- **Project Type**: Single project - existing skill structure
- **Constraints**: Must maintain backward compatibility with existing templates

---

<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready (DoR)
- [x] Problem statement clear; scope documented
- [x] Stakeholders identified; decisions path agreed
- [x] Constraints known; risks captured
- [x] Success criteria measurable

### Definition of Done (DoD)
- [ ] All acceptance criteria met; tests passing
- [ ] Docs updated (spec/plan/tasks/checklist)
- [ ] Backward compatibility verified
- [ ] Validation rules working

### Rollback Guardrails
- **Stop Signals**: Existing specs fail validation, template parsing errors > 5%
- **Recovery Procedure**: Revert template changes, disable complexity flag

<!-- /ANCHOR:quality-gates -->
---

## 3. PROJECT STRUCTURE

### Architecture Overview

Event-driven pipeline: Input → Detection → Scoring → Folder Selection → Copy

**Key Architectural Decisions:**
- **Pattern**: Modular library with CLI wrappers
- **Data Flow**: Request → Scorers → Classifier → Folder Selector → Templates
- **State Management**: Stateless (each invocation independent)
- **Template Strategy**: Pre-expanded templates in level-specific folders (no runtime marker parsing)

```
Level-Based Template Architecture:

┌─────────────────────────────────────────────────────────────────┐
│                        CLI Layer                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │ detect-complexity.js │  │ expand-template.js  │               │
│  └──────────┬──────────┘  └──────────┬──────────┘               │
└─────────────┼────────────────────────┼──────────────────────────┘
              │                        │
┌─────────────┼────────────────────────┼──────────────────────────┐
│             ▼          Library Layer ▼                          │
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │   lib/complexity/   │  │   lib/expansion/    │               │
│  │  ├── detector.js    │  │  ├── folder-select  │               │
│  │  ├── classifier.js  │  │  └── preprocessor   │               │
│  │  └── scorers/       │  │       (optional)    │               │
│  │      ├── scope.js   │  │                     │               │
│  │      ├── risk.js    │  │                     │               │
│  │      ├── research.js│  │                     │               │
│  │      ├── multi-ag.js│  │                     │               │
│  │      └── coord.js   │  │                     │               │
│  └─────────────────────┘  └─────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
              │                        │
              ▼                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Template Layer                               │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │  level_1/  │ │  level_2/  │ │  level_3/  │ │  level_3+/ │   │
│  │ spec.md    │ │ spec.md    │ │ spec.md    │ │ spec.md    │   │
│  │ plan.md    │ │ plan.md    │ │ plan.md    │ │ plan.md    │   │
│  │ tasks.md   │ │ tasks.md   │ │ tasks.md   │ │ tasks.md   │   │
│  │ impl-sum.md│ │ checklist  │ │ decision   │ │ ai-proto   │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Documentation (This Feature)

```
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/069-speckit-template-complexity
  spec.md              # Feature specification
  plan.md              # This file
  tasks.md             # Implementation task breakdown
  checklist.md         # Validation checklist
  decision-record.md   # Architectural decisions
  scratch/             # Temporary files
  memory/              # Session context
```

### Source Code (New Files)

```
.opencode/skill/system-spec-kit/
├── lib/
│   ├── complexity/
│   │   ├── index.js           # Main exports
│   │   ├── detector.js        # Core detection logic
│   │   ├── classifier.js      # Score → Level mapping
│   │   ├── features.js        # Feature trigger definitions
│   │   └── scorers/
│   │       ├── scope.js       # Scope dimension scorer
│   │       ├── risk.js        # Risk dimension scorer
│   │       ├── research.js    # Research dimension scorer
│   │       ├── multi-agent.js # Multi-agent dimension scorer
│   │       └── coordination.js# Coordination dimension scorer
│   └── expansion/
│       ├── index.js           # Main exports
│       ├── folder-selector.js # Level folder selection logic
│       └── preprocessor.js    # Optional template preprocessing
├── config/
│   └── complexity-config.jsonc    # Configuration
├── scripts/
│   ├── detect-complexity.js       # CLI detection tool
│   ├── expand-template.js         # CLI folder selection tool
│   └── rules/
│       ├── check-complexity.sh    # Complexity validation
│       ├── check-section-counts.sh# Section count validation
│       ├── check-ai-protocols.sh  # AI protocol validation
│       └── check-level-match.sh   # Level consistency validation
└── templates/
    ├── level_1/                   # Minimal templates
    │   ├── spec.md
    │   ├── plan.md
    │   ├── tasks.md
    │   └── implementation-summary.md
    ├── level_2/                   # Standard templates
    │   ├── spec.md
    │   ├── plan.md
    │   ├── tasks.md
    │   ├── checklist.md
    │   └── implementation-summary.md
    ├── level_3/                   # Full templates
    │   ├── spec.md
    │   ├── plan.md
    │   ├── tasks.md
    │   ├── checklist.md
    │   ├── decision-record.md
    │   └── implementation-summary.md
    └── level_3+/                  # Extended templates
        ├── spec.md                # With AI protocol sections
        ├── plan.md                # With dependency graphs
        ├── tasks.md               # With workstream support
        ├── checklist.md           # Extended checklist
        ├── decision-record.md
        └── implementation-summary.md
```

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Core Infrastructure (lib/complexity/)

- **Goal**: Implement 5-dimension complexity detection with score calculation
- **Deliverables**:
  - `lib/complexity/` module with all scorers
  - Configuration file with weights and thresholds
  - JSON output format for detection results
- **Owner**: AI
- **Estimated LOC**: 600-800

**Tasks**:
1. Create configuration file with weights (scope:25%, risk:25%, research:20%, multi-agent:15%, coordination:15%)
2. Implement individual dimension scorers with signal extraction
3. Implement classifier for score → level mapping
4. Implement detector orchestrating all components
5. Add JSON output formatting

### Phase 2: Template Folder Selection System (lib/expansion/)

- **Goal**: Implement level-based folder selection and template copying
- **Deliverables**:
  - Folder selector for level → folder mapping
  - Template copy utility
  - Optional preprocessor for variable substitution
- **Owner**: AI
- **Estimated LOC**: 200-300

**Tasks**:
1. Define level → folder mapping (1→level_1, 2→level_2, 3→level_3, 3+→level_3+)
2. Implement folder selector with fallback to root templates
3. Implement template copy utility with validation
4. Add optional preprocessor for variable substitution (e.g., {{SPEC_NAME}})
5. Add error handling for missing folders/templates

### Phase 3: Level-Specific Template Creation

- **Goal**: Create pre-expanded templates for each level folder
- **Deliverables**:
  - level_1/ templates (minimal: spec, plan, tasks, implementation-summary)
  - level_2/ templates (standard + checklist)
  - level_3/ templates (full + decision-record)
  - level_3+/ templates (extended + AI protocols, workstreams)
- **Owner**: AI
- **Estimated LOC**: 1200-1800

**Tasks**:
1. Create level_1/ templates with minimal sections (1-2 user stories, 2-3 phases)
2. Create level_2/ templates with standard sections (2-4 user stories, 3-5 phases, checklist)
3. Create level_3/ templates with full sections (4-8 user stories, 5-8 phases, decision-record)
4. Create level_3+/ templates with AI protocols, workstreams, extended checklists (8-15 user stories, 8-12 phases)
5. Validate all templates produce valid markdown

### Phase 4: Validation Rules

- **Goal**: Implement 4 validation rules for level consistency
- **Deliverables**:
  - check-complexity.sh - Level consistency rule
  - check-section-counts.sh - Section count validation for declared level
  - check-ai-protocols.sh - AI protocol presence check for Level 3+
  - check-level-match.sh - Cross-file level consistency
- **Owner**: AI
- **Estimated LOC**: 200-300

**Tasks**:
1. Implement level consistency checker (declared level vs. content depth)
2. Implement section count validator (minimum counts per level)
3. Implement AI protocol presence checker (required for Level 3+)
4. Implement cross-file level validator (all files match declared level)
5. Register rules with validate-spec.sh

### Phase 5: Integration

- **Goal**: Integrate with existing scripts and create CLI tools
- **Deliverables**:
  - detect-complexity.js CLI tool
  - expand-template.js CLI tool (selects folder, copies templates)
  - Updated create-spec-folder.sh with --complexity flag and folder selection
  - Updated SKILL.md with Gate 3 complexity flow
- **Owner**: AI
- **Estimated LOC**: 300-400

**Tasks**:
1. Create detect-complexity.js CLI wrapper
2. Create expand-template.js CLI wrapper (folder selection + copy)
3. Add --complexity flag to create-spec-folder.sh with folder selection
4. Update SKILL.md Gate 3 documentation
5. Add environment variable for opt-in

### Phase 6: Documentation & Testing

- **Goal**: Complete documentation and verify implementation
- **Deliverables**:
  - References documentation for level folder system
  - Test fixtures for retrospective validation
  - Verification against specs 056-068
- **Owner**: AI
- **Estimated LOC**: 200-300

**Tasks**:
1. Create complexity_guide.md reference (with folder structure explanation)
2. Update level_specifications.md with Level 3+ and folder details
3. Create test fixtures for each level folder
4. Run retrospective validation on specs 056-068

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Test Pyramid

```
        /\
       /E2E\      <- Retrospective validation on real specs
      /------\
     /  INTEG \   <- Template expansion with markers
    /----------\
   /   UNIT     \  <- Individual scorers and parsers
  /--------------\
```

### Unit Tests
- **Scope**: Individual dimension scorers, folder selector
- **Tools**: Node.js assertions, shell script tests
- **Coverage Target**: All scoring functions, folder mapping logic

### Integration Tests
- **Scope**: Full detection pipeline, folder selection and copying
- **Coverage Target**: All complexity levels, all template folders

### End-to-End Tests
- **Scope**: create-spec-folder.sh with complexity detection and folder selection
- **Coverage Target**: Level 1, 2, 3, 3+ folder creation with correct templates

### Test Fixtures
- **Location**: `scripts/test-fixtures/069-complexity/`
- **Contents**: Sample task descriptions with expected scores and folder selections

<!-- /ANCHOR:testing -->
---

## 6. SUCCESS METRICS

### Functional Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Detection accuracy | >= 85% | Retrospective on specs 056-068 |
| Template validity | 100% | Markdown lint on all level folder templates |
| Validation catch rate | 100% | Unit tests for each rule |

### Quality Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Backward compatibility | 100% | Existing specs pass validation |
| No breaking changes | 0 | Manual verification |
| Documentation completeness | 100% | Checklist verification |

---

## 7. RISKS & MITIGATIONS

### Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-------------|--------|------------|---------------------|-------|
| R-001 | Over-detection complexity | Med | Med | Configurable thresholds, user override | AI |
| R-002 | Template duplication overhead | Low | Med | Clear inheritance model, shared components | AI |
| R-003 | Backward compat breaks | High | Low | Keep root templates as fallback, extensive testing | AI |
| R-004 | Performance regression | Low | Low | < 3 second target, simple file copy | AI |

### Rollback Plan
- **Rollback Trigger**: Existing specs fail validation, folder selection errors
- **Rollback Procedure**:
  1. Revert to using root templates
  2. Disable --complexity flag
  3. Keep level folders but don't use them

---

<!-- ANCHOR:dependencies -->
## 8. DEPENDENCIES

### Internal Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| recommend-level.sh | Extend | Green | Core algorithm to build upon |
| create-spec-folder.sh | Integrate | Green | Main entry point |
| validate-spec.sh | Extend | Green | Validation rule registration |

### External Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js 16+ | Runtime | Green | Required for JS tools |
| Bash 3.2+ | Runtime | Green | Required for shell scripts |

<!-- /ANCHOR:dependencies -->
---

## 9. REFERENCES

### Related Documents
- **Feature Specification**: See `spec.md` for requirements
- **Task Breakdown**: See `tasks.md` for implementation tasks
- **Checklist**: See `checklist.md` for validation

### Existing Infrastructure
- `recommend-level.sh`: 534 LOC, scoring algorithm foundation
- `create-spec-folder.sh`: 822 LOC, spec folder creation
- `validate-spec.sh`: Validation rule orchestrator

---

## Level Folder Contents

### Template Files Per Level

| File | Level 1 | Level 2 | Level 3 | Level 3+ |
|------|---------|---------|---------|----------|
| spec.md | Minimal | Standard | Full | Extended + AI |
| plan.md | Minimal | Standard | Full | Extended + DAG |
| tasks.md | Minimal | Standard | Full | Extended + Workstreams |
| checklist.md | - | Yes | Yes | Extended |
| decision-record.md | - | - | Yes | Yes |
| implementation-summary.md | Yes | Yes | Yes | Yes |

### Section Scaling Per Level

| Section | Level 1 | Level 2 | Level 3 | Level 3+ |
|---------|---------|---------|---------|----------|
| User Stories | 1-2 | 2-4 | 4-8 | 8-15 |
| Phases | 2-3 | 3-5 | 5-8 | 8-12 |
| Tasks | 5-15 | 15-50 | 50-100 | 100+ |
| Checklist Items | N/A | 30-50 | 60-100 | 100-150 |
| AI Protocol | None | None | Optional | Required |
| Dependency Graph | None | Table | ASCII | Full DAG |

### Folder Selection Logic

```javascript
function selectFolder(level) {
  if (level >= 80) return 'level_3+';  // Score 80-100
  if (level >= 56) return 'level_3';   // Score 56-79
  if (level >= 26) return 'level_2';   // Score 26-55
  return 'level_1';                     // Score 0-25
}
```

---

## Gate 3 Integration Flow

```
1. USER: "B" (create new spec folder)

2. AI: [Runs complexity detection]
   → node detect-complexity.js --request "task description"
   → Estimates LOC, files, risk factors from task description

3. AI DISPLAYS:
   ┌─────────────────────────────────────────────────────────────┐
   │ COMPLEXITY ANALYSIS                                         │
   │                                                             │
   │   Recommended Level: 2 (Verification)                       │
   │   Score: 52/100 | Confidence: 85%                           │
   │   Template Folder: level_2/                                 │
   │                                                             │
   │   Breakdown:                                                │
   │   ├── Scope: 15/25 (5 files, ~200 LOC)                     │
   │   ├── Risk: 18/25 (auth, api detected)                     │
   │   ├── Research: 8/20 (some investigation)                  │
   │   ├── Multi-Agent: 6/15 (single workstream)                │
   │   └── Coordination: 5/15 (few dependencies)                │
   │                                                             │
   │   Templates: spec.md, plan.md, tasks.md, checklist.md,     │
   │              implementation-summary.md                      │
   │                                                             │
   │   Accept Level 2? (Y) or Override (1/2/3):                  │
   └─────────────────────────────────────────────────────────────┘

4. USER: "Y" (or 1/2/3 to override)

5. AI: [Runs create-spec-folder.sh --level N --complexity detected]
   → Copies templates from selected level folder (e.g., level_2/)
```
