---
title: "Tasks: Quality Scorer Unification [template:level_1/tasks.md]"
---
# Tasks: Quality Scorer Unification

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup — Shared Interface

- [ ] T001 Define `QualityScoreResult` interface with `score01`, `score100`, `hadContamination`, `insufficiency`, `dimensions[]`, and typed flags (`scripts/core/quality-scorer.ts`) — REQ-001
- [ ] T002 [P] Ensure V2 scorer can import `QualityScoreResult` from shared location (`scripts/extractors/quality-scorer.ts`) — REQ-001
- [ ] T003 [P] Ensure V1 scorer can import `QualityScoreResult` from shared location (`scripts/core/quality-scorer.ts`) — REQ-001
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation — Scorer Updates and Threshold Migration

### V2 Scorer Update

- [ ] T004 Add `hadContamination` parameter to V2 scoring function (`scripts/extractors/quality-scorer.ts`) — REQ-002
- [ ] T005 Apply contamination penalty: `qualityScore -= 0.25` when `hadContamination` is true (`scripts/extractors/quality-scorer.ts`) — REQ-002
- [ ] T006 Apply sufficiency cap: `sufficiencyCap = Math.min(sufficiencyCap ?? 1, 0.6)` when contaminated (`scripts/extractors/quality-scorer.ts`) — REQ-002
- [ ] T007 Return `QualityScoreResult` with both `score01` and computed `score100` (`scripts/extractors/quality-scorer.ts`) — REQ-001

### V1 Scorer Update

- [ ] T008 Extend V1 scorer signature to accept `hadContamination` parameter (`scripts/core/quality-scorer.ts`) — REQ-003
- [ ] T009 Apply matching contamination penalty and sufficiency cap in V1 scorer (`scripts/core/quality-scorer.ts`) — REQ-003
- [ ] T010 Expose `score01` as primary output, compute `score100` from it (`scripts/core/quality-scorer.ts`) — REQ-001

### Threshold Migration

- [ ] T011 Update `config.ts` validation to accept 0.0-1.0 range for `qualityAbortThreshold` (`scripts/core/config.ts`) — REQ-004
- [ ] T012 Add backward-compat: detect integer thresholds (>1) and auto-convert by dividing by 100 (`scripts/core/config.ts`) — REQ-004
- [ ] T013 Log deprecation warning when integer threshold is auto-converted (`scripts/core/config.ts`) — REQ-004
- [ ] T014 Update `workflow.ts` to compare `score01` against the migrated 0.0-1.0 threshold (`scripts/core/workflow.ts`) — REQ-004
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification — Test Baseline Rework

- [ ] T015 Update all quality scorer test expectations from 0-100 to 0.0-1.0 scale (`scripts/tests/quality-scorer.vitest.ts`) — REQ-001
- [ ] T016 [P] Add test cases for V2 contamination penalty application (`scripts/tests/quality-scorer.vitest.ts`) — REQ-002
- [ ] T017 [P] Add test cases for V1 contamination penalty application (`scripts/tests/quality-scorer.vitest.ts`) — REQ-003
- [ ] T018 [P] Add test cases for backward-compat integer threshold conversion (`scripts/tests/workflow.vitest.ts`) — REQ-004
- [ ] T019 Verify no silent scale mismatch in any test fixture (`scripts/tests/`) — SC-001
- [ ] T020 Run full Vitest suite and confirm all tests pass — SC-001, SC-002
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] All quality scores stored as 0.0-1.0 with no silent scale mismatch (SC-001)
- [ ] Contamination detection produces a score penalty, not just a flag (SC-002)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Handoff**: 001 adds `hadContamination` parameter; 011-session-source-validation calls it (OQ-001)
<!-- /ANCHOR:cross-refs -->
