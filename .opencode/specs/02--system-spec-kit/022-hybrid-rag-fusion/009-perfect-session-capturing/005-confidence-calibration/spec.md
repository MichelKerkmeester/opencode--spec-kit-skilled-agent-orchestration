---
title: "Feature Specif [02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/005-confidence-calibration/spec]"
description: "Calibrate confidence signals and gating behavior with proper threshold validation."
trigger_phrases:
  - "feature"
  - "specif"
  - "spec"
  - "005"
  - "confidence"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Confidence Calibration

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-16 |
| **Completed** | 2026-03-16 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 5 |
| **Predecessor** | [004-type-consolidation](../004-type-consolidation/spec.md) |
| **Successor** | [006-description-enrichment](../006-description-enrichment/spec.md) |
| **Handoff Criteria** | validate.sh + test suite passing |
| **R-Item** | R-05 |
| **Sequence** | C1 |
<!-- /ANCHOR:metadata -->

---

### Phase Context

This is **Phase 5** of the Perfect Session Capturing specification.

**Scope Boundary**: The single CONFIDENCE field on DecisionRecord conflates two independent dimensions: certainty about the chosen option and certainty about the captured rationale.
**Dependencies**: 004-type-consolidation
**Deliverables**: Added CHOICE_CONFIDENCE and RATIONALE_CONFIDENCE to DecisionRecord type; derived legacy CONFIDENCE as Math.min for backward compatibility
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The single `CONFIDENCE` field on `DecisionRecord` conflates two independent dimensions: certainty about the chosen option and certainty about the captured rationale. The current algorithm normalizes to 0-1 using a heuristic ladder (0.70 if alternatives present, 0.65 if rationale present, else 0.50). This blended value loses diagnostic power -- a decision with a strong choice but a weak rationale looks the same as one with a moderate choice and moderate rationale. Downstream consumers (`DecisionRecord`, `decision-tree-generator`, ascii-boxes renderer, `workflow.ts` percent conversion, the live context template, and `validate-memory-quality.ts`) all treat this single number as ground truth.

### Purpose

Replace the single blended confidence with dual fields (`CHOICE_CONFIDENCE` and `RATIONALE_CONFIDENCE`) on `DecisionRecord`, derive the legacy `CONFIDENCE` as `Math.min(choice, rationale)` for conservative backward compatibility, and update all downstream consumers to use or display the richer signal where applicable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `CHOICE_CONFIDENCE` (0.0-1.0) and `RATIONALE_CONFIDENCE` (0.0-1.0) to the `DecisionRecord` type
- Derive legacy `CONFIDENCE = Math.min(CHOICE_CONFIDENCE, RATIONALE_CONFIDENCE)` for backward compatibility
- Update the decision extractor to compute dual confidence values from conversation evidence
- Update the decision tree generator to consume and visualize dual confidence
- Update template renderers to display both confidence values when available
- Update `workflow.ts` percent conversion to work with the dual model

### Out of Scope

- Changing the confidence scoring algorithm for non-decision contexts (e.g., quality scores) -- those remain separate
- Adding confidence to observation types -- only decisions get the dual model
- Modifying the decision tree layout structure -- only the confidence labels change

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/types/session-types.ts` | Modify | Add `CHOICE_CONFIDENCE` and `RATIONALE_CONFIDENCE` to `DecisionRecord`; keep legacy `CONFIDENCE` as derived |
| `scripts/extractors/decision-extractor.ts` | Modify | Compute dual confidence values from alternatives presence, rationale depth, and evidence quality |
| `scripts/lib/decision-tree-generator.ts` | Modify | Consume dual confidence for richer node labeling and branch weight visualization |
| `.opencode/skill/system-spec-kit/templates/context_template.md` | Modify | Display dual confidence values in decision-related template sections |
| `scripts/core/workflow.ts` | Modify | Update percent conversion logic to handle dual confidence model |
| `scripts/lib/ascii-boxes.ts` | Modify | Render split confidence in decision box labels when values diverge |
| `scripts/lib/simulation-factory.ts` | Modify | Add `CHOICE_CONFIDENCE` and `RATIONALE_CONFIDENCE` fields to simulation fixture data |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `DecisionRecord` has `CHOICE_CONFIDENCE` (0.0-1.0) and `RATIONALE_CONFIDENCE` (0.0-1.0) | Type definition includes both fields; existing code compiles without errors |
| REQ-002 | Legacy `CONFIDENCE` derived as `Math.min(CHOICE_CONFIDENCE, RATIONALE_CONFIDENCE)` | All existing consumers that read `CONFIDENCE` continue to work without modification |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Decision tree generator uses dual confidence for richer visualization | Tree nodes show split confidence when both values differ by more than 0.1 |
| REQ-004 | Template renderers display both confidence values when available | Rendered output includes choice and rationale confidence labels for decisions that have them |
| REQ-005 | Phase status remains synchronized with open checklist and task-state outcomes | Spec metadata status and checklist/task completion state do not conflict |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Decisions with strong choice but weak rationale show appropriately split confidence -- e.g., CHOICE_CONFIDENCE=0.85 / RATIONALE_CONFIDENCE=0.45 produces legacy CONFIDENCE=0.45
- **SC-002**: All existing consumers continue to work via the derived `CONFIDENCE` field with no behavioral regression

### Acceptance Scenarios

1. **Given** a decision with divergent confidence dimensions, **when** rendered output is generated, **then** both choice and rationale confidence values are displayed.
2. **Given** legacy consumers that read `CONFIDENCE`, **when** dual fields are present, **then** legacy value remains conservative via `Math.min(...)`.
3. **Given** simulation and fixture decision data, **when** type and render paths execute, **then** dual fields remain within `0.0-1.0` and compile cleanly.
4. **Given** open checklist or task-state items, **when** spec status is reviewed, **then** metadata status reflects the current review/incomplete state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | R-04 type consolidation (004-type-consolidation) | High -- type system must be canonical before adding fields | Sequence as C1 after A1 completion |
| Risk | Existing test fixtures hardcode single confidence values | Medium | Update test baselines alongside type changes |
| Risk | Decision extractor heuristic changes affect downstream quality scores | Low | Legacy `CONFIDENCE` uses conservative `Math.min`, so scores can only decrease or stay the same |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **OQ-001 Resolved**: This implementation stops at Phase 1 only. Counts and importance continue to use derived legacy `CONFIDENCE`.
<!-- /ANCHOR:questions -->
