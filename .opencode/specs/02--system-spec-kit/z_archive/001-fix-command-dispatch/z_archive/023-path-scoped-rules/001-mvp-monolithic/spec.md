---
title: "Path-Scoped Validation Rules [001-mvp-monolithic/spec]"
description: "1. No quality enforcement: Incomplete specs pass silently"
trigger_phrases:
  - "path"
  - "scoped"
  - "validation"
  - "rules"
  - "spec"
  - "001"
  - "mvp"
importance_tier: "important"
contextType: "decision"
---
# Path-Scoped Validation Rules
<!-- SPECKIT_TEMPLATE_SOURCE: spec.md | v1.0 -->

## Metadata

| Field | Value |
|-------|-------|
| **Type** | Feature |
| **Area** | system-spec-kit, validation |
| **Priority** | P1 |
| **Spec Folder** | 012-path-scoped-rules |
| **Created** | 2024-12-24 |
| **Status** | Draft |
| **Level** | 3 |
| **Estimated LOC** | ~800 |
| **Risk** | High (affects all spec folder operations) |

---

## 1. Problem Statement

### Current State
- No automated validation exists for spec folder content
- `check-prerequisites.sh` only verifies file existence
- `calculate-completeness.sh` only counts checklist items
- Validation rules are AI instructions in SKILL.md (no enforcement)
- All paths treated uniformly (scratch/, memory/, templates/, specs/)

### Pain Points
1. **No quality enforcement**: Incomplete specs pass silently
2. **Uniform treatment**: Scratch prototypes held to same standard as production specs
3. **Manual verification**: Gate 6 completion check relies on AI discipline
4. **No CI/CD integration**: Can't automate spec quality checks

### Desired State
- Automated validation of spec folder content
- Path-scoped rules (different strictness for different contexts)
- Level-appropriate validation (L1 vs L2 vs L3)
- Integration with existing workflows and gates

---

## 2. Requirements

### Functional Requirements

#### FR-1: Core Validation Engine
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | Validate required files exist based on documentation level | P0 |
| FR-1.2 | Detect unfilled placeholders (`[YOUR_VALUE_HERE:]`, etc.) | P0 |
| FR-1.3 | Verify required sections present in each template | P0 |
| FR-1.4 | Validate priority tags (P0/P1/P2) in checklists | P1 |
| FR-1.5 | Verify evidence citations on completed checklist items | P1 |
| FR-1.6 | Validate ANCHOR tag format in memory files | P1 |
| FR-1.7 | Detect documentation level (explicit or inferred) | P0 |

#### FR-2: Path Scoping
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Skip all validation for `**/scratch/**` paths | P0 |
| FR-2.2 | Minimal validation for `**/memory/**` paths | P1 |
| FR-2.3 | Skip content validation for template files | P1 |
| FR-2.4 | Apply level-appropriate rules to spec files | P0 |
| FR-2.5 | Support glob pattern matching for paths | P1 |

#### FR-3: Configuration
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Support `.speckit.yaml` configuration file | P1 |
| FR-3.2 | Allow environment variable overrides | P1 |
| FR-3.3 | Provide sensible defaults when no config exists | P0 |
| FR-3.4 | Support rule enable/disable per pattern | P2 |

#### FR-4: Integration
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Integrate with `check-prerequisites.sh` | P1 |
| FR-4.2 | Support Gate 6 completion verification | P0 |
| FR-4.3 | Integrate with `/spec_kit:complete` workflow | P1 |
| FR-4.4 | Provide JSON output for tooling integration | P1 |

### Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | Validation completes in <2 seconds for typical spec folder | Performance |
| NFR-2 | Clear, actionable error messages | Usability |
| NFR-3 | No false positives on well-formed specs | Accuracy |
| NFR-4 | Backward compatible with existing spec folders | Compatibility |
| NFR-5 | Works on macOS and Linux | Portability |

---

## 3. User Stories

### US-1: Developer Validates Spec Before Completion
**As a** developer finishing a feature
**I want to** run validation on my spec folder
**So that** I catch issues before claiming completion

**Acceptance Criteria:**
- [ ] Can run `validate-spec.sh specs/007-feature/`
- [ ] See clear list of issues with severity
- [ ] Understand how to fix each issue
- [ ] Exit code reflects pass/fail status

### US-2: CI Pipeline Enforces Spec Quality
**As a** team lead
**I want to** enforce spec quality in CI/CD
**So that** incomplete specs don't merge

**Acceptance Criteria:**
- [ ] Can run validation in CI environment
- [ ] JSON output for machine parsing
- [ ] Environment variables control strictness
- [ ] Non-zero exit on validation failure

### US-3: Developer Works in Scratch Without Friction
**As a** developer prototyping
**I want** scratch files exempt from validation
**So that** I can iterate quickly without bureaucracy

**Acceptance Criteria:**
- [ ] Files in `scratch/` never trigger validation errors
- [ ] Can explicitly validate scratch if desired
- [ ] Clear documentation of scratch exemption

### US-4: AI Applies Appropriate Rigor
**As an** AI assistant
**I want** clear rules about validation strictness per context
**So that** I apply appropriate rigor consistently

**Acceptance Criteria:**
- [ ] Level 1 specs validated against L1 requirements only
- [ ] Level 3 specs validated against full requirements
- [ ] Path context (scratch/memory/specs) influences validation

---

## 4. Scope

### In Scope
- New `validate-spec.sh` script
- Path pattern matching with glob syntax
- Level detection (explicit and inferred)
- Configuration via `.speckit.yaml`
- Integration with existing check-prerequisites.sh
- Gate 6 validation integration
- Documentation updates

### Out of Scope
- IDE/editor integration (future)
- Real-time validation (future)
- Autofix capabilities (future)
- Custom rule authoring (future)
- Git hooks installation (user responsibility)

---

## 5. Success Criteria

- [ ] `validate-spec.sh` passes own test suite
- [ ] All existing spec folders validate without false positives
- [ ] scratch/ files exempt from validation
- [ ] Level 3 specs require decision-record.md
- [ ] Gate 6 can use validation results
- [ ] Documentation complete and accurate

---

## 6. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| False positives frustrate users | Medium | High | Start lenient, tighten over time; easy disable |
| Shell script complexity grows unmanageable | Medium | Medium | Define migration path to Node.js |
| Performance issues on large folders | Low | Medium | Profile and optimize; add timeouts |
| Breaking existing workflows | Medium | High | Extensive backward compatibility testing |

---

## 7. Dependencies

- Existing shell scripts (common.sh utilities)
- Bash 4.0+ (for associative arrays)
- grep, sed, awk (standard tools)
- Optional: jq for JSON output formatting

---

## 8. Related Documents

- [plan.md](./plan.md) - Technical implementation plan
- [tasks.md](./tasks.md) - Task breakdown
- [checklist.md](./checklist.md) - Verification checklist
- [decision-record.md](./decision-record.md) - Architectural decisions
- [path_scoped_rules.md](/.opencode/skill/system-spec-kit/references/path_scoped_rules.md) - Original design document
