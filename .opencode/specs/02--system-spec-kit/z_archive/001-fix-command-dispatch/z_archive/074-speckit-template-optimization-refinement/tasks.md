---
title: "Tasks: SpecKit Template Optimization Refinement [074-speckit-template-optimization-refinement/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "speckit"
  - "template"
  - "optimization"
  - "refinement"
  - "074"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: SpecKit Template Optimization Refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

**Workstream Notation**:
| Prefix | Meaning |
|--------|---------|
| `[W-A]` | Research Workstream |
| `[W-B]` | Implementation Workstream |
| `[SYNC]` | Verification/Sync Point |

---

## Phase 1: Research [W-A]

### Agent Dispatch (Parallel)

- [x] T001 [P][W-A] Dispatch Research Agent 1 - Core templates analysis
- [x] T002 [P][W-A] Dispatch Research Agent 2 - Addendum templates analysis
- [x] T003 [P][W-A] Dispatch Research Agent 3 - Composed templates analysis
- [x] T004 [P][W-A] Dispatch Research Agent 4 - Script system analysis (bash)
- [x] T005 [P][W-A] Dispatch Research Agent 5 - Script system analysis (js)
- [x] T006 [P][W-A] Dispatch Research Agent 6 - Reference documentation analysis
- [x] T007 [P][W-A] Dispatch Research Agent 7 - Asset files analysis
- [x] T008 [P][W-A] Dispatch Research Agent 8 - Validation rules analysis
- [x] T009 [P][W-A] Dispatch Research Agent 9 - Memory system analysis
- [x] T010 [P][W-A] Dispatch Research Agent 10 - SKILL.md and config analysis

### Research Outputs

- [x] T011 [W-A] Collect findings from Agent 1 (core templates)
- [x] T012 [W-A] Collect findings from Agent 2 (addendum templates)
- [x] T013 [W-A] Collect findings from Agent 3 (composed templates)
- [x] T014 [W-A] Collect findings from Agent 4 (bash scripts)
- [x] T015 [W-A] Collect findings from Agent 5 (js scripts)
- [x] T016 [W-A] Collect findings from Agent 6 (references)
- [x] T017 [W-A] Collect findings from Agent 7 (assets)
- [x] T018 [W-A] Collect findings from Agent 8 (validation)
- [x] T019 [W-A] Collect findings from Agent 9 (memory)
- [x] T020 [W-A] Collect findings from Agent 10 (config)

---

## Phase 2: Analysis Aggregation [SYNC-001]

- [x] T021 [SYNC] Aggregate all 10 agent findings
- [x] T022 [SYNC] Identify patterns across subsystems
- [x] T023 [SYNC] Calculate quality metrics
- [x] T024 [SYNC] Generate analysis.md (specs/074-*/analysis.md)
- [x] T025 [SYNC] Generate review.md (specs/074-*/review.md)
- [x] T026 [SYNC] Generate refinement-recommendations.md (specs/074-*/refinement-recommendations.md)
- [x] T027 [SYNC] Present findings to user for approval
- [x] T028 [SYNC] User selects recommendations for implementation

---

## Phase 3: Implementation [W-B]

### P0 Critical Implementations

- [x] T029 [W-B] REC-001: Document verbose template variant concept
  - File: `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`
  - Action: Add verbose variant section for future implementation

- [x] T030 [W-B] REC-002: Document compose script architecture
  - File: `.opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md`
  - Action: Add compose script specification for future implementation

### P1 High Priority Implementations

- [x] T031 [W-B] REC-003: Clarify template path conventions
  - File: `.opencode/skill/system-spec-kit/SKILL.md`
  - Action: Add explicit path documentation table

- [x] T032 [W-B] REC-005: Document template selection preference
  - File: `.opencode/skill/system-spec-kit/config/config.jsonc`
  - Action: Add template style configuration option

- [x] T033 [W-B] REC-006: Restore WHEN TO USE sections
  - Files: All composed template files
  - Action: Ensure HTML comment guidance present

### Version Update

- [x] T034 [W-B] Update SKILL.md version to v1.9.0
- [x] T035 [W-B] Update changelog with refinement summary
- [x] T036 [W-B] Update cross-references for new documents

---

## Phase 4: Verification [SYNC-002]

### Agent Dispatch (Parallel)

- [x] T037 [P][SYNC] Dispatch Verify Agent 1 - Core template integrity
- [x] T038 [P][SYNC] Dispatch Verify Agent 2 - Addendum template integrity
- [x] T039 [P][SYNC] Dispatch Verify Agent 3 - Composed template consistency
- [x] T040 [P][SYNC] Dispatch Verify Agent 4 - Script functionality
- [x] T041 [P][SYNC] Dispatch Verify Agent 5 - Reference accuracy
- [x] T042 [P][SYNC] Dispatch Verify Agent 6 - Asset consistency
- [x] T043 [P][SYNC] Dispatch Verify Agent 7 - Validation rules pass
- [x] T044 [P][SYNC] Dispatch Verify Agent 8 - Memory system integrity
- [x] T045 [P][SYNC] Dispatch Verify Agent 9 - Cross-reference validation
- [x] T046 [P][SYNC] Dispatch Verify Agent 10 - Integration test

### Verification Outputs

- [x] T047 [SYNC] Collect verification status from all 10 agents
- [x] T048 [SYNC] Generate verification report
- [x] T049 [SYNC] Confirm 0 critical failures, 0 blocking warnings

---

## Phase 5: Release [SYNC-003]

- [x] T050 [SYNC] Aggregate final verification results
- [x] T051 [SYNC] Confirm all P0 checklist items complete
- [x] T052 [SYNC] Confirm all P1 checklist items complete
- [x] T053 [SYNC] Update implementation-summary.md
- [x] T054 [SYNC] Request final user approval
- [x] T055 [SYNC] Mark spec folder complete

---

## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] All 10 research agents completed
- [x] All 10 verification agents passed
- [x] User approved release

---

## Task Statistics

| Phase | Total Tasks | Completed | Pending | Blocked |
|-------|-------------|-----------|---------|---------|
| Phase 1: Research | 20 | 20 | 0 | 0 |
| Phase 2: Aggregation | 8 | 8 | 0 | 0 |
| Phase 3: Implementation | 8 | 8 | 0 | 0 |
| Phase 4: Verification | 13 | 13 | 0 | 0 |
| Phase 5: Release | 6 | 6 | 0 | 0 |
| **Total** | **55** | **55** | **0** | **0** |

---

## Agent Assignment Matrix

| Agent ID | Phase | Subsystem | Tasks | Status |
|----------|-------|-----------|-------|--------|
| Research-1 | 1 | Core Templates | T001, T011 | Complete |
| Research-2 | 1 | Addendum Templates | T002, T012 | Complete |
| Research-3 | 1 | Composed Templates | T003, T013 | Complete |
| Research-4 | 1 | Bash Scripts | T004, T014 | Complete |
| Research-5 | 1 | JS Scripts | T005, T015 | Complete |
| Research-6 | 1 | References | T006, T016 | Complete |
| Research-7 | 1 | Assets | T007, T017 | Complete |
| Research-8 | 1 | Validation | T008, T018 | Complete |
| Research-9 | 1 | Memory | T009, T019 | Complete |
| Research-10 | 1 | Config | T010, T020 | Complete |
| Impl-1 | 3 | REC-001 | T029 | Complete |
| Impl-2 | 3 | REC-002 | T030 | Complete |
| Impl-3 | 3 | REC-003 | T031 | Complete |
| Impl-4 | 3 | REC-005 | T032 | Complete |
| Impl-5 | 3 | REC-006 | T033-T036 | Complete |
| Verify-1 | 4 | Core Templates | T037 | Complete |
| Verify-2 | 4 | Addendum Templates | T038 | Complete |
| Verify-3 | 4 | Composed Templates | T039 | Complete |
| Verify-4 | 4 | Scripts | T040 | Complete |
| Verify-5 | 4 | References | T041 | Complete |
| Verify-6 | 4 | Assets | T042 | Complete |
| Verify-7 | 4 | Validation | T043 | Complete |
| Verify-8 | 4 | Memory | T044 | Complete |
| Verify-9 | 4 | Cross-refs | T045 | Complete |
| Verify-10 | 4 | Integration | T046 | Complete |

---

## Workstream Timeline

```
Time (seconds)  0   30   60   90   120  150  180  ...30min...
                │    │    │    │    │    │    │    │
[W-A] Research  ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░
                ↑Start         ↑Complete
                                    │
[SYNC-001]      ░░░░░░░░░░░░░░░░████░░░░░░░░░░░░░░░░░░░░░░░
                                ↑Aggregate
                                    │ User Approval
[W-B] Impl      ░░░░░░░░░░░░░░░░░░░░████████████████████████
                                    ↑Start              ↑Done
                                                        │
[SYNC-002]      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████░░
                                                    ↑Verify
[SYNC-003]      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
                                                        ↑Release
```

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3+ TASKS - Enterprise Governance
- Full workstream notation [W-A], [W-B], [SYNC]
- Agent assignment matrix with 25 agents
- Timeline visualization
- Task statistics per phase
-->
