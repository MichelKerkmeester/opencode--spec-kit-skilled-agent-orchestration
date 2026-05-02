---
title: "Tasks: Confid [system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/005-confidence-calibration/tasks]"
description: 'title: "Tasks: Confidence Calibration [template:level_2/tasks.md]"'
trigger_phrases:
  - "tasks"
  - "confid"
  - "005"
  - "confidence"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/005-confidence-calibration"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Confidence Calibration

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

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
## 2. PHASE 1: SETUP

- [x] T001 Add `CHOICE_CONFIDENCE: number` (0.0-1.0) to `DecisionRecord` type (REQ-001) (`scripts/types/session-types.ts`). Evidence: added canonical field to `DecisionRecord`.
- [x] T002 Add `RATIONALE_CONFIDENCE: number` (0.0-1.0) to `DecisionRecord` type (REQ-001) (`scripts/types/session-types.ts`). Evidence: added canonical field to `DecisionRecord`.
- [x] T003 Add derived `CONFIDENCE` computation as `Math.min(CHOICE_CONFIDENCE, RATIONALE_CONFIDENCE)` (REQ-002) (`scripts/extractors/decision-extractor.ts`). Evidence: all decision creation paths now derive legacy confidence conservatively.
- [x] T004 Verify all existing references to `CONFIDENCE` compile without changes (REQ-002). Evidence: `npm run typecheck` passed on 2026-03-16.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

### Extractor Update
- [x] T005 Refactor confidence computation in decision extractor to produce dual values (REQ-001) (`scripts/extractors/decision-extractor.ts`). Evidence: added shared `buildDecisionConfidence()` helper for manual and observation-derived decisions.
- [x] T006 Implement `CHOICE_CONFIDENCE` signals: alternatives count > 0 (+0.15), explicit preference language (+0.10), option specificity (+0.10) (`scripts/extractors/decision-extractor.ts`). Evidence: scoring now uses alternatives, explicit choice, and specific choice checks with placeholder filtering.
- [x] T007 Implement `RATIONALE_CONFIDENCE` signals: rationale text present (+0.15), trade-off articulation (+0.10), evidence citations (+0.10) (`scripts/extractors/decision-extractor.ts`). Evidence: scoring now uses explicit rationale, tradeoff language, and evidence presence.
- [x] T008 Base confidence starts at 0.50 for both, caps at 1.0 (`scripts/extractors/decision-extractor.ts`). Evidence: helper normalizes/clamps both dual fields into `0.0-1.0`.
- [x] T009 Verify existing heuristic ladder outcomes are preserved through the derived field (`scripts/extractors/decision-extractor.ts`). Evidence: explicit single-value confidence overrides still map to both dual fields and preserve legacy behavior.

### Consumer Updates
- [x] T010 [P] Update decision tree generator to show split confidence on tree nodes when values diverge by > 0.1 (REQ-003) (`scripts/lib/decision-tree-generator.ts`). Evidence: `DecisionNode` now carries dual confidence fields and forwards them to header rendering.
- [x] T011 [P] Update renderer templates to include `Choice: X% / Rationale: Y%` labels when dual values are present (REQ-004) (`.opencode/skill/system-spec-kit/templates/context_template.md`). Evidence: decision sections render split confidence only when the values materially diverge.
- [x] T012 [P] Update `workflow.ts` percent conversion to use legacy `CONFIDENCE` with new type shape (`scripts/core/workflow.ts`). Evidence: workflow now converts overall, choice, and rationale confidence to percentages and tags divergent cases.
- [x] T013 [P] Update confidence validation to understand dual fields (`scripts/memory/validate-memory-quality.ts`). Evidence: no validator logic change was required for Phase 1. Render fixtures were updated and validated without changing quality-gate semantics.
- [x] T014 [P] Add dual confidence display placeholders for decision sections (`.opencode/skill/system-spec-kit/templates/context_template.md`). Evidence: added `HAS_SPLIT_CONFIDENCE` branch with choice/rationale formatting.
- [x] T015 [P] Render split confidence in decision box labels when values diverge (`scripts/lib/ascii-boxes.ts`). Evidence: ASCII decision headers now render split confidence when the delta exceeds 10 percentage points.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T016 Add unit tests for dual confidence computation with various input combinations. Evidence: added `scripts/tests/decision-confidence.vitest.ts` covering alternatives-only, rationale-heavy, split, override, and clamping cases.
- [x] T017 Add regression tests verifying legacy `CONFIDENCE` matches `Math.min` of the two new fields. Evidence: extractor/loaders regression and Vitest assertions validate `CONFIDENCE === Math.min(choice, rationale)`.
- [x] T018 Verify decision tree output includes split labels for divergent confidence cases. Evidence: `memory-render-fixture.vitest.ts` and `test-scripts-modules.js` both exercise split rendering.
- [x] T019 Verify existing test baselines still pass with the derived field. Evidence: `node scripts/tests/test-scripts-modules.js` passed with `384` passed / `0` failed / `5` skipped on 2026-03-17.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- [x] All tasks marked `[x]`. Evidence: T001-T019 are complete after the 2026-03-17 baseline rerun.
- [x] No `[B]` blocked tasks remaining. Evidence: T001-T019 are complete and no blocked or deferred task remains in this phase.
- [x] Manual verification passed. Evidence: `npm run typecheck`, targeted Vitest suites, and `node scripts/tests/test-extractors-loaders.js` all passed, with the baseline rerun refreshed on 2026-03-17.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
