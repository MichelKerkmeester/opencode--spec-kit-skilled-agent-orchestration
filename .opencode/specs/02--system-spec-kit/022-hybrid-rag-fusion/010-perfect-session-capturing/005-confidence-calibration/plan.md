---
title: "Implementation Plan: Confidence Calibration"
---
# Implementation Plan: Confidence Calibration

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | generate-context.js pipeline |
| **Storage** | None (in-memory decision records) |
| **Testing** | Vitest |

### Overview

This plan implements a type extension pattern: add `CHOICE_CONFIDENCE` and `RATIONALE_CONFIDENCE` to the `DecisionRecord` type, update the decision extractor to compute both values from conversation evidence (alternatives presence, rationale depth, evidence anchors), derive legacy `CONFIDENCE` as `Math.min(choice, rationale)` for backward compatibility, and propagate the dual model through the decision tree generator, template renderers, and workflow percent conversion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (R-04 type consolidation)

### Definition of Done

- [ ] All acceptance criteria met (REQ-001 through REQ-004)
- [ ] Tests passing -- dual confidence computed correctly and legacy field derived
- [ ] Docs updated (spec/plan in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Type extension -- add fields to a core data type, update the producer (extractor), update consumers (generators, renderers, workflow), and verify backward compatibility through a derived legacy field.

### Key Components

- **`DecisionRecord` type (`scripts/types/session-types.ts`)**: Extended with `CHOICE_CONFIDENCE` and `RATIONALE_CONFIDENCE` alongside derived `CONFIDENCE`
- **Decision extractor (`scripts/extractors/decision-extractor.ts`)**: Produces dual confidence from conversation evidence signals
- **Decision tree generator (`scripts/lib/decision-tree-generator.ts`)**: Consumes dual confidence for richer node labeling
- **Template renderers (`scripts/renderers/`)**: Display split confidence in decision sections
- **Workflow (`scripts/core/workflow.ts`)**: Percent conversion updated for dual model

### Data Flow

1. Decision extractor analyzes conversation exchange for decision signals
2. For each decision: compute `CHOICE_CONFIDENCE` from alternatives count, option specificity, and explicit preference signals
3. Compute `RATIONALE_CONFIDENCE` from rationale depth, evidence citations, and trade-off articulation
4. Derive `CONFIDENCE = Math.min(CHOICE_CONFIDENCE, RATIONALE_CONFIDENCE)`
5. Decision tree generator reads dual values for visualization; template renderers display both when they diverge
6. Workflow percent conversion uses legacy `CONFIDENCE` for threshold comparisons (unchanged behavior)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Type Extension

- [ ] Add `CHOICE_CONFIDENCE: number` (0.0-1.0) to `DecisionRecord`
- [ ] Add `RATIONALE_CONFIDENCE: number` (0.0-1.0) to `DecisionRecord`
- [ ] Add derived `CONFIDENCE` computation as `Math.min(CHOICE_CONFIDENCE, RATIONALE_CONFIDENCE)`
- [ ] Ensure all existing references to `CONFIDENCE` compile without changes

### Phase 2: Extractor Update

- [ ] Refactor confidence computation in `decision-extractor.ts` to produce dual values
- [ ] `CHOICE_CONFIDENCE` signals: alternatives count > 0 (+0.15), explicit preference language (+0.10), option specificity (+0.10)
- [ ] `RATIONALE_CONFIDENCE` signals: rationale text present (+0.15), trade-off articulation (+0.10), evidence citations (+0.10)
- [ ] Base confidence starts at 0.50 for both, caps at 1.0
- [ ] Verify existing heuristic ladder outcomes are preserved through the derived field

### Phase 3: Consumer Updates

- [ ] Update `decision-tree-generator.ts` to show split confidence on tree nodes when values diverge by > 0.1
- [ ] Update renderer templates to include `Choice: X% / Rationale: Y%` labels when dual values are present
- [ ] Update `workflow.ts` percent conversion to use legacy `CONFIDENCE` (no behavioral change, but code path must handle the new type shape)

### Phase 4: Verification

- [ ] Add unit tests for dual confidence computation with various input combinations
- [ ] Add regression tests verifying legacy `CONFIDENCE` matches `Math.min` of the two new fields
- [ ] Verify decision tree output includes split labels for divergent confidence cases
- [ ] Verify existing test baselines still pass with the derived field
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Dual confidence computation for various evidence combinations | Vitest |
| Unit | Legacy `CONFIDENCE` derivation as `Math.min(choice, rationale)` | Vitest |
| Unit | Decision tree node labeling with split confidence | Vitest |
| Integration | End-to-end decision extraction through rendering with dual confidence | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| R-04 type consolidation (004-type-consolidation) | Internal | Yellow | `DecisionRecord` type must be canonical before extending; blocked until A1 completes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Dual confidence computation breaks downstream decision rendering or quality validation
- **Procedure**: Revert type changes and restore the single-field heuristic ladder; legacy `CONFIDENCE` field remains the primary output so downstream consumers are unaffected during rollback
<!-- /ANCHOR:rollback -->
