---
title: "Tasks: Confidence Calibration [template:level_1/tasks.md]"
---
# Tasks: Confidence Calibration

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
## Phase 1: Setup — Type Extension

- [ ] T001 Add `CHOICE_CONFIDENCE: number` (0.0-1.0) to `DecisionRecord` type (REQ-001) (`scripts/types/session-types.ts`)
- [ ] T002 Add `RATIONALE_CONFIDENCE: number` (0.0-1.0) to `DecisionRecord` type (REQ-001) (`scripts/types/session-types.ts`)
- [ ] T003 Add derived `CONFIDENCE` computation as `Math.min(CHOICE_CONFIDENCE, RATIONALE_CONFIDENCE)` (REQ-002) (`scripts/types/session-types.ts`)
- [ ] T004 Verify all existing references to `CONFIDENCE` compile without changes (REQ-002)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation — Extractor & Consumer Updates

### Extractor Update
- [ ] T005 Refactor confidence computation in decision extractor to produce dual values (REQ-001) (`scripts/extractors/decision-extractor.ts`)
- [ ] T006 Implement `CHOICE_CONFIDENCE` signals: alternatives count > 0 (+0.15), explicit preference language (+0.10), option specificity (+0.10) (`scripts/extractors/decision-extractor.ts`)
- [ ] T007 Implement `RATIONALE_CONFIDENCE` signals: rationale text present (+0.15), trade-off articulation (+0.10), evidence citations (+0.10) (`scripts/extractors/decision-extractor.ts`)
- [ ] T008 Base confidence starts at 0.50 for both, caps at 1.0 (`scripts/extractors/decision-extractor.ts`)
- [ ] T009 Verify existing heuristic ladder outcomes are preserved through the derived field (`scripts/extractors/decision-extractor.ts`)

### Consumer Updates
- [ ] T010 [P] Update decision tree generator to show split confidence on tree nodes when values diverge by > 0.1 (REQ-003) (`scripts/lib/decision-tree-generator.ts`)
- [ ] T011 [P] Update renderer templates to include `Choice: X% / Rationale: Y%` labels when dual values are present (REQ-004) (`scripts/renderers/`)
- [ ] T012 [P] Update `workflow.ts` percent conversion to use legacy `CONFIDENCE` with new type shape (`scripts/core/workflow.ts`)
- [ ] T013 [P] Update confidence validation to understand dual fields (`scripts/validators/validate-memory-quality.ts`)
- [ ] T014 [P] Add dual confidence display placeholders for decision sections (`templates/core/context_template.md`)
- [ ] T015 [P] Render split confidence in decision box labels when values diverge (`scripts/lib/ascii-box-renderer.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Add unit tests for dual confidence computation with various input combinations
- [ ] T017 Add regression tests verifying legacy `CONFIDENCE` matches `Math.min` of the two new fields
- [ ] T018 Verify decision tree output includes split labels for divergent confidence cases
- [ ] T019 Verify existing test baselines still pass with the derived field
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
