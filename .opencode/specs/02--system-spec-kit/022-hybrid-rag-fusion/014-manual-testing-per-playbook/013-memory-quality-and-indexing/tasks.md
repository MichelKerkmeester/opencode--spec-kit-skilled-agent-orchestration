---
title: "Tasks: manual-testing-per-playbook memory quality and indexing phase [template:level_2/tasks.md]"
description: "Task tracker for 34 exact IDs across 27 scenario files in the memory quality and indexing category. One task per exact ID, all PENDING."
trigger_phrases:
  - "memory quality tasks"
  - "phase 013 tasks"
  - "manual testing memory quality tasks"
  - "tasks core memory indexing"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: manual-testing-per-playbook memory quality and indexing phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Verify playbook files accessible at `../../manual_testing_playbook/13--memory-quality-and-indexing/`
- [ ] T002 Confirm feature catalog accessible at `../../feature_catalog/13--memory-quality-and-indexing/`
- [ ] T003 Load review protocol from `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] T004 Verify MCP runtime healthy (`memory_save`, `memory_index_scan`, quality gate pipeline)
- [ ] T005 [P] Record baseline feature flag values for SPECKIT_SAVE_QUALITY_GATE, SPECKIT_RECONSOLIDATION, SPECKIT_BATCH_LEARNED_FEEDBACK, SPECKIT_ASSISTIVE_RECONSOLIDATION, SPECKIT_IMPLICIT_FEEDBACK_LOG, SPECKIT_HYBRID_DECAY_POLICY, SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS
- [ ] T006 [P] Prepare sandbox data and named checkpoint for destructive scenarios (M-005, M-006, 044)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Group 1: Core Pipeline Scenarios (M-003, M-005 family, M-006 family)

| Task | Scenario ID | Scenario Name | Status | Evidence |
|------|-------------|---------------|--------|----------|
| T010 | M-003 | Context Save + Index Update | PENDING | -- |
| T011 | M-005 | Outsourced Agent Memory Capture Round-Trip | PENDING | -- |
| T012 | M-005a | JSON-mode hard-fail | PENDING | -- |
| T013 | M-005b | nextSteps persistence | PENDING | -- |
| T014 | M-005c | Verification freshness | PENDING | -- |
| T015 | M-006 | Session Enrichment and Alignment Guardrails | PENDING | -- |
| T016 | M-006a | Unborn-HEAD and dirty snapshot fallback | PENDING | -- |
| T017 | M-006b | Detached-HEAD snapshot preservation | PENDING | -- |
| T018 | M-006c | Similar-folder boundary protection | PENDING | -- |

### Group 2: Quality Loop and Signal Scenarios (039-048)

| Task | Scenario ID | Scenario Name | Status | Evidence |
|------|-------------|---------------|--------|----------|
| T020 | 039 | Verify-fix-verify memory quality loop (PI-A5) | PENDING | -- |
| T021 | 040 | Signal vocabulary expansion (TM-08) | PENDING | -- |
| T022 | 041 | Pre-flight token budget validation (PI-A3) | PENDING | -- |
| T023 | 042 | Spec folder description discovery (PI-B3) | PENDING | -- |
| T024 | 043 | Pre-storage quality gate (TM-04) | PENDING | -- |
| T025 | 044 | Reconsolidation-on-save (TM-06) | PENDING | -- |
| T026 | 045 | Smarter memory content generation (S1) | PENDING | -- |
| T027 | 046 | Anchor-aware chunk thinning (R7) | PENDING | -- |
| T028 | 047 | Encoding-intent capture at index time (R16) | PENDING | -- |
| T029 | 048 | Auto entity extraction (R10) | PENDING | -- |

### Group 3: Consolidation and Persistence Scenarios (069-119)

| Task | Scenario ID | Scenario Name | Status | Evidence |
|------|-------------|---------------|--------|----------|
| T030 | 069 | Entity normalization consolidation | PENDING | -- |
| T031 | 073 | Quality gate timer persistence | PENDING | -- |
| T032 | 092 | Implemented: auto entity extraction (R10) | PENDING | -- |
| T033 | 111 | Deferred lexical-only indexing | PENDING | -- |
| T034 | 119 | Memory filename uniqueness (ensureUniqueMemoryFilename) | PENDING | -- |

### Group 4: Validation and Preflight Scenarios (131-133)

| Task | Scenario ID | Scenario Name | Status | Evidence |
|------|-------------|---------------|--------|----------|
| T035 | 131 | Description.json batch backfill validation (PI-B3) | PENDING | -- |
| T036 | 132 | description.json schema field validation | PENDING | -- |
| T037 | 133 | Dry-run preflight for memory_save | PENDING | -- |

### Group 5: Post-Save and Review Scenarios (155, 155-F)

| Task | Scenario ID | Scenario Name | Status | Evidence |
|------|-------------|---------------|--------|----------|
| T040 | 155 | Post-save quality review | PENDING | -- |
| T041 | 155-F | Score penalty advisory logging | PENDING | -- |

### Group 6: Advanced Quality Features (164-178)

| Task | Scenario ID | Scenario Name | Status | Evidence |
|------|-------------|---------------|--------|----------|
| T050 | 164 | Batch learned feedback (SPECKIT_BATCH_LEARNED_FEEDBACK) | PENDING | -- |
| T051 | 165 | Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION) | PENDING | -- |
| T052 | 176 | Implicit feedback log (SPECKIT_IMPLICIT_FEEDBACK_LOG) | PENDING | -- |
| T053 | 177 | Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY) | PENDING | -- |
| T054 | 178 | Save quality gate exceptions (SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS) | PENDING | -- |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T060 Record verdict for each of the 34 exact IDs (PASS, PARTIAL, or FAIL) with rationale
- [ ] T061 Confirm 34/34 exact IDs executed with no skipped test IDs
- [ ] T062 Verify sub-scenarios M-005a/b/c, M-006a/b/c, and 155-F have independent verdicts
- [ ] T063 Update checklist.md with evidence references for all P0 items
- [ ] T064 Complete implementation-summary.md with aggregate results
- [ ] T065 Restore all feature flags to baseline values
- [ ] T066 Restore sandbox checkpoint if needed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 34 scenario tasks (T010-T054) marked complete
- [ ] All verification tasks (T060-T066) complete
- [ ] No `[B]` blocked tasks remaining without documented reason
- [ ] Manual verification passed per review protocol
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
