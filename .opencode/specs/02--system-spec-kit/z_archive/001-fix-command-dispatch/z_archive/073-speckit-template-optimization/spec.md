---
title: "Feature Specification: SpecKit Template Optimization [073-speckit-template-optimization/spec]"
description: "This specification defines a comprehensive restructuring of the SpecKit template system from monolithic templates to a CORE + ADDENDUM compositional architecture. The optimizati..."
trigger_phrases:
  - "feature"
  - "specification"
  - "speckit"
  - "template"
  - "optimization"
  - "spec"
  - "073"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: SpecKit Template Optimization

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v2.0 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-01-19 |
| **Completed** | 2026-01-19 |

---

## 2. EXECUTIVE SUMMARY

This specification defines a comprehensive restructuring of the SpecKit template system from monolithic templates to a CORE + ADDENDUM compositional architecture. The optimization addresses three critical issues: template bloat from unused sections, lack of meaningful differentiation between levels, and absence of parallel sub-agent support for spec creation.

**Key Decisions:**
- CORE + ADDENDUM architecture replacing monolithic templates
- Value-based level scaling (each level adds distinct VALUE, not just length)
- Workstream notation for parallel agent coordination
- Tiered spec creation architecture for 40% faster creation

**Critical Impact:**
- 64-79% reduction in template verbosity
- Clear L1≠L2≠L3≠L3+ differentiation with distinct value at each tier
- Enables parallel sub-agent spec creation with workstream isolation

---

## 3. PROBLEM & PURPOSE

### Problem Statement

The existing SpecKit templates suffered from three critical issues:

1. **Template Bloat**: Real usage analysis of 9+ spec folders revealed that many sections were never used:
   - Stakeholders (0% usage)
   - Traceability Mapping (0% usage)
   - Assumptions Validation Checklist (0% usage)
   - KPI Targets Table (0% usage)
   - Full NFR questionnaire (5% usage)
   - Given/When/Then format (10% usage)

2. **No Level Differentiation**: tasks.md L1 vs L2 were 100% identical (278 lines each). Higher levels added boilerplate, not value.

3. **No Parallel Support**: Templates had no mechanism for workstream coordination or parallel sub-agent spec creation.

### Purpose

Create a template architecture where:
- Core content is shared across all levels (~270 LOC)
- Each level adds meaningful VALUE through addendums
- Parallel sub-agent spec creation is supported via workstream notation
- Templates are concise, focused, and reflect real usage patterns

---

## 4. SCOPE

### In Scope

- Create CORE templates (spec-core.md, plan-core.md, tasks-core.md, impl-summary-core.md)
- Create Level 2 addendum templates (+Verification)
- Create Level 3 addendum templates (+Architecture)
- Create Level 3+ addendum templates (+Governance)
- Regenerate all composed templates (level_1, level_2, level_3, level_3+)
- Update parallel_dispatch_config.md with workstream support
- Update create.sh script documentation
- Update SKILL.md to v1.8.0
- Update level_specifications.md reference documentation

### Out of Scope

- Changes to the MCP server or memory system
- Validation script modifications
- Automated compose script creation (templates pre-composed manually)
- Level calculator unification (deferred to future work)

### Files Changed

| File | Action | Description |
|------|--------|-------------|
| `templates/core/spec-core.md` | Created | Core specification template (~93 lines) |
| `templates/core/plan-core.md` | Created | Core plan template (~101 lines) |
| `templates/core/tasks-core.md` | Created | Core tasks template (~66 lines) |
| `templates/core/impl-summary-core.md` | Created | Core summary template (~58 lines) |
| `templates/addendum/level2-verify/*.md` | Created | L2 verification addendum (3 files) |
| `templates/addendum/level3-arch/*.md` | Created | L3 architecture addendum (3 files) |
| `templates/addendum/level3plus-govern/*.md` | Created | L3+ governance addendum (3 files) |
| `templates/level_1/*.md` | Regenerated | Composed L1 templates (4 files) |
| `templates/level_2/*.md` | Regenerated | Composed L2 templates (5 files) |
| `templates/level_3/*.md` | Regenerated | Composed L3 templates (6 files) |
| `templates/level_3+/*.md` | Regenerated | Composed L3+ templates (6 files) |
| `assets/parallel_dispatch_config.md` | Modified | Added workstream and tiered creation |
| `scripts/spec/create.sh` | Modified | Updated documentation |
| `SKILL.md` | Modified | Updated to v1.8.0 |
| `references/templates/level_specifications.md` | Modified | Comprehensive update |

---

## 5. REQUIREMENTS

### P0 (Blockers)

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-001 | Create CORE templates | 4 core templates created with essential content only | [x] Complete |
| REQ-002 | Create Level addendums | Each level has distinct addendum adding VALUE | [x] Complete |
| REQ-003 | Regenerate composed templates | All level_1/2/3/3+ folders have composed templates | [x] Complete |
| REQ-004 | Clear level differentiation | L1≠L2≠L3≠L3+ with meaningful differences | [x] Complete |

### P1 (Required)

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-005 | Workstream notation support | [W-A], [W-B], [SYNC] notation documented | [x] Complete |
| REQ-006 | Tiered creation config | parallel_dispatch_config.md has tier1/2/3 | [x] Complete |
| REQ-007 | Update SKILL.md | Document new architecture, bump to v1.8.0 | [x] Complete |
| REQ-008 | Update level_specifications.md | Comprehensive template path updates | [x] Complete |

### P2 (Optional)

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-009 | Compose script | Automated template composition | [ ] Deferred |
| REQ-010 | Level calculator unification | Single unified scoring system | [ ] Deferred |

---

## 6. COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Scope** | 22/25 | 28+ files created/modified, ~2000 LOC |
| **Risk** | 15/25 | Template changes affect all future specs |
| **Research** | 18/20 | Extensive analysis of 9+ real spec folders |
| **Parallel Potential** | 12/15 | Multiple template files parallelizable |
| **Coordination** | 10/15 | Documentation must stay synchronized |
| **Total** | **77/100** | **Level 3** |

*Note: Originally assessed at Level 3, documented at Level 3+ for comprehensive governance documentation given architectural significance.*

---

## 7. L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
| ID | Requirement | Target | Actual |
|----|-------------|--------|--------|
| NFR-P01 | Template line reduction | 64-79% | 74-82% achieved |
| NFR-P02 | Spec creation time | 40% reduction | Enabled via tiered architecture |

### Maintainability
| ID | Requirement | Achieved |
|----|-------------|----------|
| NFR-M01 | Single source of truth for core content | Yes - core/ folder |
| NFR-M02 | Modular addendum updates | Yes - addendum/ structure |

---

## 8. L2: EDGE CASES

### Template Boundaries
- **Empty addendum**: Composed templates work with core only (L1)
- **Missing level folder**: create.sh falls back with warning

### Error Scenarios
- **Template not found**: create.sh creates empty file with warning
- **Invalid level**: create.sh validates 1/2/3/3+ only

---

## 9. L3: STAKEHOLDERS

| Role | Responsibility | Sign-off |
|------|----------------|----------|
| Developer | Template design, implementation | [x] Complete |
| System | SpecKit skill user | [x] Verified |

---

## 10. L3+: APPROVAL WORKFLOW

| Checkpoint | Status | Date |
|------------|--------|------|
| Design Review | [x] Approved | 2026-01-19 |
| Implementation | [x] Complete | 2026-01-19 |
| Documentation | [x] Complete | 2026-01-19 |

---

## 11. SUCCESS CRITERIA

- [x] SC-001: All core templates created (~270 LOC total)
- [x] SC-002: All addendum templates created (L2: 184 LOC, L3: 220 LOC, L3+: 190 LOC)
- [x] SC-003: All composed templates regenerated with clear differentiation
- [x] SC-004: Workstream notation documented in parallel_dispatch_config.md
- [x] SC-005: SKILL.md updated to v1.8.0 with new architecture
- [x] SC-006: level_specifications.md comprehensively updated

---

## 12. RISKS & DEPENDENCIES

| Risk | Impact | Likelihood | Mitigation | Status |
|------|--------|------------|------------|--------|
| Existing specs incompatible | Medium | Low | Composed templates backward-compatible | Mitigated |
| Missing value at higher levels | High | Low | Each addendum justified by real usage data | Mitigated |
| Parallel conflicts | Medium | Medium | Strict workstream file ownership | Documented |

---

## 13. OPEN QUESTIONS

*All questions resolved during implementation.*

---

## CROSS-REFERENCES

- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Implementation**: See `implementation-summary.md`
- **Analysis**: See `claude_analysis.md`, `final_recommendations.md`
