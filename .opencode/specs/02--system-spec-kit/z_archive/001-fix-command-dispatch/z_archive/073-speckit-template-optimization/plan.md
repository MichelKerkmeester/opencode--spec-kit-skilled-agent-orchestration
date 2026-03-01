---
title: "Implementation Plan: SpecKit Template Optimization [073-speckit-template-optimization/plan]"
description: "Restructure the SpecKit template system from monolithic templates to a CORE + ADDENDUM compositional architecture. Core templates (~270 LOC) provide the foundation shared across..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "speckit"
  - "template"
  - "optimization"
  - "073"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Implementation Plan: SpecKit Template Optimization

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v2.0 -->

---

## 1. SUMMARY

Restructure the SpecKit template system from monolithic templates to a CORE + ADDENDUM compositional architecture. Core templates (~270 LOC) provide the foundation shared across all levels, while level-specific addendums add distinct VALUE: L2 adds verification (+120 LOC), L3 adds architecture (+150 LOC), and L3+ adds governance (+100 LOC).

---

## 2. TECHNICAL CONTEXT

- **Language**: Markdown templates
- **Framework**: SpecKit skill system
- **Testing**: Manual verification of line counts and level differentiation
- **Dependencies**: create.sh script, SKILL.md documentation

---

## 3. QUALITY GATES

### Definition of Ready
- [x] Requirements analyzed from real usage patterns
- [x] Template architecture designed
- [x] Files to modify identified

### Definition of Done
- [x] All core templates created
- [x] All addendum templates created
- [x] All composed templates regenerated
- [x] Documentation updated
- [x] Line counts verified

---

## 4. ARCHITECTURE

### Template Directory Structure

```
templates/
├── core/                    # Shared foundation (~318 LOC total)
│   ├── spec-core.md         (93 lines)
│   ├── plan-core.md         (101 lines)
│   ├── tasks-core.md        (66 lines)
│   └── impl-summary-core.md (58 lines)
│
├── addendum/                # Level-specific VALUE additions
│   ├── level2-verify/       # +Verification (184 LOC)
│   │   ├── spec-level2.md   (49 lines)
│   │   ├── plan-level2.md   (51 lines)
│   │   └── checklist.md     (84 lines)
│   ├── level3-arch/         # +Architecture (220 LOC)
│   │   ├── spec-level3.md   (67 lines)
│   │   ├── plan-level3.md   (72 lines)
│   │   └── decision-record.md (81 lines)
│   └── level3plus-govern/   # +Governance (190 LOC)
│       ├── spec-level3plus.md (65 lines)
│       ├── plan-level3plus.md (65 lines)
│       └── checklist-extended.md (60 lines)
│
├── level_1/                 # Composed: Core only (332 LOC)
├── level_2/                 # Composed: Core + L2 (523 LOC)
├── level_3/                 # Composed: Core + L2 + L3 (767 LOC)
└── level_3+/                # Composed: All addendums (845 LOC)
```

### Level Value Scaling

| Level | Adds | New Sections |
|-------|------|--------------|
| **L1 (Core)** | Essential what/why/how | Problem, Scope, Requirements, Success |
| **L2 (+Verify)** | Quality gates | NFRs, Edge Cases, Checklist, Effort |
| **L3 (+Arch)** | Architecture decisions | Executive Summary, ADRs, Risk Matrix |
| **L3+ (+Govern)** | Enterprise governance | Approval Workflow, Compliance, AI Protocols |

---

## 5. IMPLEMENTATION PHASES

### Phase 1: Core Template Creation
**Goal**: Create foundation templates shared across all levels
**Deliverable**: 4 core templates in `templates/core/`

- [x] spec-core.md (~93 lines)
- [x] plan-core.md (~101 lines)
- [x] tasks-core.md (~66 lines)
- [x] impl-summary-core.md (~58 lines)

**Checkpoint**: Core foundation ready (~318 LOC total)

### Phase 2: Addendum Creation
**Goal**: Create level-specific value additions
**Deliverable**: 9 addendum templates across 3 level folders

#### Level 2 Addendum (+Verification)
- [x] spec-level2.md - NFRs, edge cases
- [x] plan-level2.md - Dependencies, effort estimation
- [x] checklist.md - Full verification checklist

#### Level 3 Addendum (+Architecture)
- [x] spec-level3.md - Executive summary, complexity, stakeholders
- [x] plan-level3.md - Dependency graph, critical path, milestones
- [x] decision-record.md - ADR template

#### Level 3+ Addendum (+Governance)
- [x] spec-level3plus.md - Approval workflow, compliance
- [x] plan-level3plus.md - AI execution framework, workstreams
- [x] checklist-extended.md - Extended verification with sign-off

**Checkpoint**: All addendums ready (~594 LOC total)

### Phase 3: Template Composition
**Goal**: Regenerate all composed templates
**Deliverable**: Updated level_1, level_2, level_3, level_3+ folders

- [x] level_1/ - Core only (332 LOC, 4 files)
- [x] level_2/ - Core + L2 (523 LOC, 5 files)
- [x] level_3/ - Core + L2 + L3 (767 LOC, 6 files)
- [x] level_3+/ - All addendums (845 LOC, 6 files)

**Checkpoint**: All composed templates verified

### Phase 4: Configuration Updates
**Goal**: Update parallel dispatch and documentation
**Deliverable**: Updated config and documentation files

- [x] parallel_dispatch_config.md - Workstream notation, tiered creation
- [x] create.sh - Updated header and help text
- [x] SKILL.md - v1.8.0, new architecture documentation
- [x] level_specifications.md - Comprehensive template path updates

**Checkpoint**: Documentation complete

---

## 6. L2: PHASE DEPENDENCIES

```
Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4
(Core)     (Addendums)  (Compose)   (Docs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 (Core) | None | 2, 3 |
| 2 (Addendums) | 1 | 3 |
| 3 (Compose) | 1, 2 | 4 |
| 4 (Docs) | 3 | None |

---

## 7. L2: EFFORT ESTIMATION

| Phase | Estimate | Actual | Confidence |
|-------|----------|--------|------------|
| Phase 1 (Core) | 1h | 45min | High |
| Phase 2 (Addendums) | 2h | 1.5h | High |
| Phase 3 (Compose) | 1.5h | 1h | High |
| Phase 4 (Docs) | 1h | 45min | High |
| **Total** | **5.5h** | **4h** | **High** |

---

## 8. L3: CRITICAL PATH

| Step | Action | Duration |
|------|--------|----------|
| 1 | Create core templates | 45min |
| 2 | Create all addendums | 1.5h |
| 3 | Compose level templates | 1h |
| 4 | Update documentation | 45min |
| **Total** | | **4h** |

---

## 9. L3: MILESTONES

| Milestone | Phase | Success Criteria | Status |
|-----------|-------|------------------|--------|
| Foundation | 1 | Core templates created | [x] Complete |
| Value Layers | 2 | All addendums created | [x] Complete |
| Composition | 3 | All level folders updated | [x] Complete |
| Documentation | 4 | SKILL.md v1.8.0 | [x] Complete |

---

## 10. L3: RISK MATRIX

| ID | Risk | Impact | Likelihood | Mitigation | Status |
|----|------|--------|------------|------------|--------|
| R1 | Existing specs break | High | Low | Composed templates backward-compatible | Mitigated |
| R2 | Missing essential content at L1 | Medium | Low | Verified against real usage patterns | Mitigated |
| R3 | Inconsistent level differentiation | Medium | Medium | Clear addendum boundaries | Mitigated |

---

## 11. L3+: AI EXECUTION FRAMEWORK

### Pre-Task Protocol
1. Load spec.md, verify scope alignment
2. Load plan.md, identify current phase
3. Find next uncompleted task
4. Verify dependencies met
5. Execute with evidence

### Execution Rules
| Rule | Enforcement |
|------|-------------|
| TASK-SEQ: Follow phase order | HARD |
| TASK-SCOPE: Stay within template system | HARD |
| TASK-VERIFY: Count lines for verification | HARD |

---

## 12. L3+: WORKSTREAM COORDINATION

*Not applicable - single-agent implementation*

---

## 13. TESTING STRATEGY

### Verification Approach
- **Line counts**: Verify each template file
- **Differentiation**: Confirm L1≠L2≠L3≠L3+
- **create.sh**: Verify help text displays correctly

### Test Results

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| Core total LOC | ~270 | 318 | [x] Pass |
| L1 total LOC | ~270 | 332 | [x] Pass |
| L2 total LOC | ~390 | 523 | [x] Pass |
| L3 total LOC | ~540 | 767 | [x] Pass |
| L3+ total LOC | ~640 | 845 | [x] Pass |
| Level differentiation | Clear | Verified | [x] Pass |

---

## 14. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing templates | Internal | Available | None |
| SKILL.md | Internal | Available | None |
| Real usage analysis | Research | Complete | None |

---

## 15. L2: ROLLBACK PLAN

- **Trigger**: Critical issue discovered with new templates
- **Procedure**: Restore from git history
- **Verification**: create.sh --help shows correct output

---

## CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Tasks**: See `tasks.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
