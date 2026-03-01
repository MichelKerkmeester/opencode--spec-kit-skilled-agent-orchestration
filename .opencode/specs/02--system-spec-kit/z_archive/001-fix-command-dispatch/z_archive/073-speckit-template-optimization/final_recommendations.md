# SpecKit Template Optimization: Final Recommendations

> **Analysis Date:** 2026-01-19
> **Methodology:** 13 Opus 4.5 agents analyzing system-spec-kit
> **Scope:** Concise templates with PROPER LEVEL SCALING + parallel sub-agent architecture

---

## Executive Summary

This document synthesizes findings from comprehensive parallel analysis. **Three goals:**

| Goal | Approach | Outcome |
|------|----------|---------|
| **1. Concise templates** | Remove unused sections, based on real usage | 64-79% reduction |
| **2. Proper level scaling** | CORE + ADDENDUM architecture | Higher levels = more VALUE |
| **3. Parallel sub-agent creation** | Tiered architecture | 35-45% faster |

### Critical Insight: Value Scaling, Not Just Reduction

**Problem Found:** tasks.md L1 and L2 are **100% identical** (278 lines). Higher levels have more *boilerplate*, not more *value*.

**Solution:** Each level should ADD sections that provide REAL VALUE for that complexity tier:

| Level | Added Value | Example Sections |
|-------|-------------|------------------|
| **L1** (Core) | Essential what/why/how | Problem, Scope, Requirements, Success |
| **L2** (+Verify) | Quality gates | NFRs, Edge Cases, Checklist, Effort Est. |
| **L3** (+Arch) | Architecture decisions | Executive Summary, ADRs, Risk Matrix |
| **L3+** (+Govern) | Enterprise governance | Approval Workflow, AI Protocols |

---

## Table of Contents

1. [Real Usage Evidence](#1-real-usage-evidence)
2. [CORE + ADDENDUM Architecture](#2-core--addendum-architecture)
3. [Template Specifications by Level](#3-template-specifications-by-level)
4. [Parallel Sub-Agent Architecture](#4-parallel-sub-agent-architecture)
5. [Level Calculator Improvements](#5-level-calculator-improvements)
6. [Implementation Roadmap](#6-implementation-roadmap)
7. [Files to Modify](#7-files-to-modify)

---

## 1. Real Usage Evidence

Analysis of 9+ real spec folders revealed what's ACTUALLY used vs template bloat.

### Sections ALWAYS FILLED (Keep These)

| Section | Usage Rate | Evidence |
|---------|------------|----------|
| Problem Statement | 100% | Every spec has this |
| Scope (In/Out) | 100% | Always clearly defined |
| Requirements | 100% | Often simplified vs template |
| Success Criteria | 100% | Always filled |
| Files to Change | 95% | When implementation planned |
| Risks | 80% | Simple list preferred |

### Sections NEVER/RARELY USED (Remove These)

| Section | Usage Rate | Evidence |
|---------|------------|----------|
| Stakeholders | **0%** | Deleted in every examined spec |
| Traceability Mapping | **0%** | Never used |
| Assumptions Validation Checklist | **0%** | Never filled |
| KPI Targets Table | **0%** | Never used |
| Full NFR questionnaire | **5%** | Usually deleted |
| Given/When/Then format | **10%** | Simple requirements preferred |
| WORKING FILES section | **0%** | Template cruft |
| WHEN TO USE section | **0%** | Template cruft |

### Custom Files Agents CREATE (Missing from Templates)

| File | Frequency | Purpose |
|------|-----------|---------|
| `research.md` | Common | Prior art, alternatives |
| `handover.md` | Common | Session continuation |
| `test-summary.md` | Occasional | Test coverage |
| `verification-commands.md` | Occasional | Pre/post verification |

**Recommendation:** Add `research.md` and `handover.md` templates.

---

## 2. CORE + ADDENDUM Architecture

### Design Principle

Instead of duplicating entire templates, use a **compositional model**:

```
LEVEL 1 = CORE template (focused, minimal)
LEVEL 2 = CORE + VERIFICATION addendum
LEVEL 3 = CORE + VERIFICATION + ARCHITECTURE addendum
LEVEL 3+ = CORE + VERIFICATION + ARCHITECTURE + GOVERNANCE addendum
```

### Template Directory Structure

```
templates/
├── core/                        # SHARED across all levels
│   ├── spec-core.md             (~80 lines)
│   ├── plan-core.md             (~90 lines)
│   ├── tasks-core.md            (~60 lines)
│   └── impl-summary-core.md     (~40 lines)
│
├── addendum/                    # Level-specific VALUE additions
│   ├── level2-verify/
│   │   ├── spec-verify.md       (+35 lines)
│   │   ├── plan-verify.md       (+40 lines)
│   │   └── checklist.md         (~100 lines) ← NEW FILE
│   │
│   ├── level3-arch/
│   │   ├── spec-arch.md         (+45 lines)
│   │   ├── plan-arch.md         (+50 lines)
│   │   └── decision-record.md   (~120 lines) ← NEW FILE
│   │
│   └── level3plus-govern/
│       ├── spec-govern.md       (+40 lines)
│       ├── plan-govern.md       (+50 lines)
│       └── checklist-ext.md     (+50 lines)
│
└── composed/                    # Pre-merged for convenience
    ├── level_1/                 # Core only
    ├── level_2/                 # Core + L2 addendum
    ├── level_3/                 # Core + L2 + L3 addendum
    └── level_3+/                # All addendums
```

### Why This Works

| Benefit | Explanation |
|---------|-------------|
| **Single source of truth** | Core content maintained once |
| **Intentional scaling** | Each level adds VALUE, not boilerplate |
| **Easier maintenance** | Change core → all levels update |
| **Clear level justification** | Each addendum has clear purpose |

---

## 3. Template Specifications by Level

### Level 1: CORE (~270 total lines)

**Use case:** Simple features, bug fixes, 1-2 developers, low risk

#### spec-core.md (~80 lines)

```markdown
# Feature Specification: [NAME]

## 1. METADATA
- Level: 1 | Priority: [P0|P1|P2] | Status: [Draft|Complete]
- Created: YYYY-MM-DD

## 2. PROBLEM & PURPOSE
### Problem Statement
[What is broken/missing/inefficient?]

### Purpose
[One-sentence outcome statement]

## 3. SCOPE
### In Scope
- [Deliverable 1]
- [Deliverable 2]

### Out of Scope
- [Excluded item] - [reason]

### Files to Change
| File | Change | Description |
|------|--------|-------------|

## 4. REQUIREMENTS
### P0 (Blockers)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|

### P1 (Required)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|

## 5. SUCCESS CRITERIA
- [Measurable outcome 1]
- [Measurable outcome 2]

## 6. RISKS & DEPENDENCIES
| Risk/Dep | Impact | Mitigation |
|----------|--------|------------|
```

**REMOVED from L1:** Stakeholders, Assumptions Validation, Traceability, NFRs, User Stories (use Requirements), CHANGELOG, WORKING FILES, WHEN TO USE

#### plan-core.md (~90 lines)

```markdown
# Implementation Plan: [NAME]

## 1. SUMMARY
[2-3 sentence technical approach]

## 2. TECHNICAL CONTEXT
- Language: [X] | Framework: [Y]
- Testing: [approach]

## 3. QUALITY GATES
### Definition of Ready
- [ ] Requirements clear
- [ ] Dependencies available

### Definition of Done
- [ ] Code complete
- [ ] Tests pass
- [ ] Docs updated

## 4. IMPLEMENTATION PHASES
### Phase 1: Setup
- Tasks, deliverable

### Phase 2: Core Implementation
- Tasks, deliverable

### Phase 3: Verification
- Tasks, deliverable

## 5. TESTING STRATEGY
- Unit: [scope]
- Integration: [scope]

## 6. DEPENDENCIES
| Dependency | Status | Impact |
|------------|--------|--------|
```

**REMOVED:** Test Pyramid ASCII, Project structure options, Communication section, Success Metrics KPIs

#### tasks-core.md (~60 lines)

```markdown
# Tasks: [NAME]

## NOTATION
| Prefix | Meaning |
|--------|---------|
| [x]/[ ] | Complete/Pending |
| [P] | Parallelizable |

---

## PHASE 1: Setup
- [ ] T001 [setup task]
- [ ] T002 [P] [parallel setup]

## PHASE 2: Implementation
- [ ] T010 [P0] [core feature]
- [ ] T011 [P1] [P] [enhancement]

## PHASE 3: Verification
- [ ] T020 Write tests
- [ ] T021 Update docs

---

## COMPLETION CRITERIA
- [ ] All tasks complete
- [ ] Lint and tests pass
- [ ] No console errors
```

---

### Level 2: CORE + VERIFICATION (~390 total lines)

**Use case:** Features needing QA, moderate complexity, verification required

#### Level 2 Adds: spec-verify.md (+35 lines)

```markdown
<!-- LEVEL 2 ADDENDUM: Verification -->

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-P01 | Response time | <200ms |

### Security
| ID | Requirement |
|----|-------------|
| NFR-S01 | No hardcoded secrets |
| NFR-S02 | Input validation |

## L2: EDGE CASES

### Data Boundaries
- Empty input: [handling]
- Max size: [handling]

### Error Scenarios
- External failure: [handling]
- Timeout: [handling]
```

#### Level 2 Adds: plan-verify.md (+40 lines)

```markdown
<!-- LEVEL 2 ADDENDUM: Verification -->

## L2: PHASE DEPENDENCIES
| Phase | Depends On | Blocks |
|-------|------------|--------|
| P1 | - | P2, P3 |
| P2 | P1 | P3 |
| P3 | P2 | - |

## L2: EFFORT ESTIMATION
| Phase | Estimate | Confidence |
|-------|----------|------------|
| Setup | 2h | High |
| Implementation | 8h | Medium |
| Verification | 4h | High |

## L2: ROLLBACK PLAN
- **Trigger:** [when to rollback]
- **Procedure:** [steps]
- **Verification:** [how to confirm]
```

#### Level 2 Adds: checklist.md (~100 lines) - NEW FILE

```markdown
# Verification Checklist: [NAME]

## PRE-IMPLEMENTATION
- [ ] CHK001 [P0] Requirements documented
- [ ] CHK002 [P0] Dependencies available
- [ ] CHK003 [P1] Technical approach reviewed

## CODE QUALITY
- [ ] CHK010 [P0] Lint passes
- [ ] CHK011 [P0] No console errors
- [ ] CHK012 [P1] Error handling implemented
- [ ] CHK013 [P1] Follows conventions

## TESTING
- [ ] CHK020 [P0] Acceptance criteria met
- [ ] CHK021 [P0] Tests pass
- [ ] CHK022 [P1] Edge cases tested

## SECURITY (if applicable)
- [ ] CHK030 [P0] No hardcoded secrets
- [ ] CHK031 [P1] Input validation

## DOCUMENTATION
- [ ] CHK040 [P1] README updated
- [ ] CHK041 [P2] Code comments where needed
```

---

### Level 3: CORE + VERIFICATION + ARCHITECTURE (~540 total lines)

**Use case:** Complex features, architecture changes, multi-system coordination

#### Level 3 Adds: spec-arch.md (+45 lines)

```markdown
<!-- LEVEL 3 ADDENDUM: Architecture -->

## L3: EXECUTIVE SUMMARY

[2-3 sentences for stakeholders]

**Key Decisions:**
- Decision 1: [summary]
- Decision 2: [summary]

**Critical Dependencies:**
- [External system or team]

## L3: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | /25 | [files, LOC] |
| Risk | /25 | [auth, breaking] |
| Research | /20 | [unknowns] |
| Parallel | /15 | [workstreams] |
| Coordination | /15 | [dependencies] |
| **Total** | /100 | Level 3 |

## L3: STAKEHOLDERS

| Role | Name | Responsibility |
|------|------|----------------|
| Tech Lead | [name] | Architecture approval |
| Product | [name] | Requirements sign-off |
```

#### Level 3 Adds: plan-arch.md (+50 lines)

```markdown
<!-- LEVEL 3 ADDENDUM: Architecture -->

## L3: DEPENDENCY GRAPH

```
Phase 0 ──► Phase 1 ──► Phase 2
                 │
                 ▼
            Phase 3 ──► Phase 4
```

## L3: CRITICAL PATH

| Path | Phases | Total Duration |
|------|--------|----------------|
| Main | P0→P1→P2→P4 | [X days] |

## L3: MILESTONES

| Milestone | Phase | Success Criteria |
|-----------|-------|------------------|
| Foundation | P1 | [criteria] |
| MVP | P3 | [criteria] |
| Complete | P5 | [criteria] |

## L3: RISK MATRIX

| ID | Risk | Impact | Likelihood | Mitigation |
|----|------|--------|------------|------------|
| R1 | [risk] | High | Medium | [plan] |
```

#### Level 3 Adds: decision-record.md (~120 lines) - NEW FILE

```markdown
# Architecture Decision Record: [NAME]

## METADATA
- Decision ID: ADR-###
- Status: [Proposed | Decided | Deprecated]
- Date: YYYY-MM-DD

## CONTEXT

### Problem Statement
[Why we need to decide]

### Constraints
- [Constraint 1]
- [Constraint 2]

## OPTIONS CONSIDERED

### Option 1: [Name] ← CHOSEN
| Aspect | Assessment |
|--------|------------|
| Pros | [list] |
| Cons | [list] |
| Score | [X/10] |

### Option 2: [Name]
| Aspect | Assessment |
|--------|------------|
| Pros | [list] |
| Cons | [list] |
| Score | [X/10] |

## DECISION

**Chosen:** Option 1 - [Name]

**Rationale:** [Why this option]

## CONSEQUENCES

### Positive
- [Outcome 1]

### Negative
- [Outcome 1] → Mitigation: [plan]

### Technical Debt
- [Debt item] → Address by: [when]
```

---

### Level 3+: FULL STACK (~640 total lines)

**Use case:** Enterprise, multi-team, compliance, regulatory requirements

#### Level 3+ Adds: spec-govern.md (+40 lines)

```markdown
<!-- LEVEL 3+ ADDENDUM: Governance -->

## L3+: APPROVAL WORKFLOW

| Checkpoint | Approver | Required | Status |
|------------|----------|----------|--------|
| Design Review | Tech Lead | Yes | [ ] |
| Security Review | Security | Yes | [ ] |
| Product Sign-off | PM | Yes | [ ] |
| Launch Approval | Director | Yes | [ ] |

## L3+: COMPLIANCE CHECKPOINTS

- [ ] Data privacy requirements met
- [ ] Security scan completed
- [ ] Audit trail documented
- [ ] Change management approved
```

#### Level 3+ Adds: plan-govern.md (+50 lines)

```markdown
<!-- LEVEL 3+ ADDENDUM: Governance -->

## L3+: AI EXECUTION FRAMEWORK

### Pre-Task Protocol
1. Load spec.md, verify scope alignment
2. Load plan.md, identify current phase
3. Find next uncompleted task
4. Verify dependencies met
5. Execute with evidence

### Execution Rules
| Rule | Enforcement |
|------|-------------|
| TASK-SEQ: Follow dependencies | HARD |
| TASK-SCOPE: Stay in bounds | HARD |
| TASK-VERIFY: Evidence required | HARD |

### Status Reporting
```markdown
## Task T### Status: [STATUS]
**Evidence:** [verification]
**Files Modified:** [list]
**Next Steps:** [action]
```

## L3+: WORKSTREAM COORDINATION

| Workstream | Owner | Files | Sync Points |
|------------|-------|-------|-------------|
| W-A | Agent 1 | [files] | T030, T050 |
| W-B | Agent 2 | [files] | T030, T050 |

**Rules:**
- ISOLATE: Each workstream owns specific files
- NO CONFLICTS: Never modify another's files
- SYNC: Integration at defined points only
```

---

## 4. Parallel Sub-Agent Architecture

### Tiered Creation Architecture

```
                    USER REQUEST
                         │
                         ▼
    ┌────────────────────────────────────────────┐
    │      TIER 1: SPEC CORE (Sequential)        │
    │      ~60s - Creates hub document           │
    │                                            │
    │   Agent: spec_core_drafter                 │
    │   Output: spec.md sections 1-3             │
    └────────────────────────────────────────────┘
                         │
                         ▼
    ┌────────────────────────────────────────────┐
    │     TIER 2: PARALLEL EXPANSION (~90s)      │
    │                                            │
    │   ┌─────────┐ ┌─────────┐ ┌─────────┐     │
    │   │ plan.md │ │checklist│ │spec 4-6 │     │
    │   │  Agent  │ │ Agent   │ │ Agent   │     │
    │   └─────────┘ └─────────┘ └─────────┘     │
    │       (all)      (L2+)       (all)        │
    └────────────────────────────────────────────┘
                         │
                         ▼
    ┌────────────────────────────────────────────┐
    │     TIER 3: INTEGRATION (Sequential)       │
    │     ~60s - Creates tasks.md                │
    │                                            │
    │   Agent: tasks_integrator                  │
    │   Merges all outputs, validates            │
    └────────────────────────────────────────────┘
```

### Time Impact

| Metric | Current | Optimized | Change |
|--------|---------|-----------|--------|
| Spec creation | 5-7 min | 3-4 min | **-40%** |
| Tier 1 | - | 60s | Sequential |
| Tier 2 | - | 90s | Parallel |
| Tier 3 | - | 60s | Sequential |

### Workstream Notation for tasks.md

```markdown
| Prefix | Meaning |
|--------|---------|
| [W-A] | Workstream A (same agent owns) |
| [W-B] | Workstream B (different agent) |
| [SYNC] | Sync point (all must complete) |

### Implementation (Parallel Workstreams)

**Workstream A (Auth domain)**
- [ ] T012 [P] [W-A] Create User model
- [ ] T013 [P] [W-A] Create Session model

**Workstream B (Product domain)**
- [ ] T020 [P] [W-B] Create Product model

**Sync Point**
- [ ] T030 [SYNC] Integration testing
```

### Configuration (parallel_dispatch_config.md)

```yaml
spec_creation_parallel:
  enabled: true
  auto_dispatch_mode: true  # Always parallel

  tier1:
    agent: spec_core_drafter
    output: "spec.md (sections 1-3)"

  tier2:
    - agent: plan_agent
      output: "plan.md"
      condition: "always"
    - agent: requirements_agent
      output: "spec.md (sections 4-6)"
      condition: "always"
    - agent: checklist_agent
      output: "checklist.md"
      condition: "level >= 2"

  tier3:
    agent: tasks_integrator
    output: "tasks.md"
    reads: ["spec.md", "plan.md", "checklist.md"]
```

---

## 5. Level Calculator Improvements

### Current Problem: Two Inconsistent Systems

| System | Location | Issue |
|--------|----------|-------|
| Shell Script | `recommend-level.sh` | 4-factor, defines Level 0 |
| JSONC Config | `complexity-config.jsonc` | 5-factor, no Level 0 |

### Unified Scoring Model

| Dimension | Weight | Measures |
|-----------|--------|----------|
| Scope | 25% | Files, LOC estimate |
| Risk | 25% | Security, auth, breaking |
| Research | 15% | Investigation needed |
| Parallel Potential | 20% | Independent workstreams |
| Coordination | 15% | Cross-system deps |

### Level Boundaries

| Score | Level | Parallel Dispatch |
|-------|-------|-------------------|
| 0-25 | Level 1 | Optional |
| 26-55 | Level 2 | Recommended |
| 56-79 | Level 3 | Recommended |
| 80-100 | Level 3+ | **Mandatory** |

### Implementation

1. Create unified Node.js calculator reading `complexity-config.jsonc`
2. Add `--parallel-opportunity` flag
3. Remove Level 0 from shell script
4. Auto-recommend parallel dispatch when score ≥ 56

---

## 6. Implementation Roadmap

### Phase 1: Create Core Templates (Day 1-2)

| Task | Output | Risk |
|------|--------|------|
| Write spec-core.md | ~80 lines | Low |
| Write plan-core.md | ~90 lines | Low |
| Write tasks-core.md | ~60 lines | Low |
| Write impl-summary-core.md | ~40 lines | Low |

### Phase 2: Create Addendums (Day 2-3)

| Task | Output | Risk |
|------|--------|------|
| L2 verify addendums | spec, plan, checklist | Low |
| L3 arch addendums | spec, plan, decision-record | Medium |
| L3+ govern addendums | spec, plan, checklist-ext | Medium |

### Phase 3: Compose & Test (Day 3-4)

| Task | Output | Risk |
|------|--------|------|
| Create compose script | `compose-template.sh` | Low |
| Generate level_1/ through level_3+/ | Composed templates | Medium |
| Test with real spec folder | Validation | Medium |

### Phase 4: Update Infrastructure (Day 4-5)

| Task | Files | Risk |
|------|-------|------|
| Update create.sh | Script changes | Medium |
| Update SKILL.md | Documentation | Low |
| Update parallel_dispatch_config.md | Config | Medium |
| Unify level calculator | New script | Medium |

---

## 7. Files to Modify

### New Files (Create)

```
.opencode/skill/system-spec-kit/templates/core/
├── spec-core.md
├── plan-core.md
├── tasks-core.md
└── impl-summary-core.md

.opencode/skill/system-spec-kit/templates/addendum/
├── level2-verify/
│   ├── spec-verify.md
│   ├── plan-verify.md
│   └── checklist.md
├── level3-arch/
│   ├── spec-arch.md
│   ├── plan-arch.md
│   └── decision-record.md
└── level3plus-govern/
    ├── spec-govern.md
    ├── plan-govern.md
    └── checklist-extended.md
```

### Existing Files (Regenerate)

```
.opencode/skill/system-spec-kit/templates/
├── level_1/*.md   (from core only)
├── level_2/*.md   (core + L2)
├── level_3/*.md   (core + L2 + L3)
└── level_3+/*.md  (all addendums)
```

### Configuration Files (Update)

```
.opencode/skill/system-spec-kit/
├── assets/parallel_dispatch_config.md
├── config/complexity-config.jsonc
├── scripts/spec/create.sh
└── SKILL.md
```

---

## Expected Outcomes

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| spec.md L1 | 390 | ~80 | **-79%** |
| spec.md L2 | 470 | ~115 | **-76%** |
| spec.md L3 | 523 | ~160 | **-69%** |
| spec.md L3+ | 552 | ~200 | **-64%** |
| L1 vs L2 differentiation | Identical | Distinct | ✅ |
| Each level adds | Boilerplate | VALUE | ✅ |
| Spec creation time | 5-7 min | 3-4 min | **-40%** |
| Parallel dispatch | Ask user | Auto | ✅ |

---

## Conclusion

This optimization achieves all three goals:

1. **Concise Templates:** 64-79% reduction based on real usage evidence
2. **Proper Level Scaling:** CORE + ADDENDUM architecture where each level adds VALUE
3. **Parallel Sub-Agents:** Tiered architecture with workstream support for 40% faster creation

The key insight is **value scaling, not just reduction**. Higher levels should provide more USEFUL content (NFRs, ADRs, approval workflows), not just more boilerplate.
