---
title: "Implementation Plan: Quality Scorer Unification"
---
# Implementation Plan: Quality Scorer Unification

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
| **Storage** | None (in-memory scoring) |
| **Testing** | Vitest |

### Overview

This plan implements a pipeline modification pattern: define a shared `QualityScoreResult` interface, update the V2 scorer to add contamination penalties, extend the V1 scorer with matching contamination support, migrate the workflow abort threshold from 0-100 to 0.0-1.0, and rework test baselines to use the canonical scale. The goal is to eliminate the silent scale mismatch between stored quality (0.0-1.0) and workflow gating (0-100).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (none -- foundational)

### Definition of Done

- [ ] All acceptance criteria met (REQ-001 through REQ-004)
- [ ] Tests passing -- all quality scorer tests use 0.0-1.0 scale
- [ ] Docs updated (spec/plan in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pipeline modification -- shared interface definition propagated through scorer implementations and workflow consumption.

### Key Components

- **`QualityScoreResult` interface**: Canonical return type for both V1 and V2 scorers, exposing `score01`, `score100`, `hadContamination`, `insufficiency`, and `dimensions[]`
- **V2 scorer (`scripts/extractors/quality-scorer.ts`)**: 9-dimension scorer updated with contamination penalty logic
- **V1 scorer (`scripts/core/quality-scorer.ts`)**: 7-dimension scorer extended to accept contamination input
- **Workflow threshold (`scripts/core/workflow.ts`)**: Abort comparison migrated to `score01`
- **Config validation (`scripts/core/config.ts`)**: Threshold range updated to 0.0-1.0

### Data Flow

1. Extractor pipeline produces session data with `hadContamination` flag
2. V1/V2 scorers receive session data including contamination flag
3. Scorers return `QualityScoreResult` with `score01` as canonical and `score100` as computed compat
4. Workflow compares `score01` against `qualityAbortThreshold` (now 0.0-1.0)
5. Contaminated memories receive a 0.25 penalty and a 0.6 sufficiency cap
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Shared Interface

- [ ] Define `QualityScoreResult` interface in a shared location (or within `scripts/core/quality-scorer.ts`)
- [ ] Include fields: `score01`, `score100`, `hadContamination`, `insufficiency`, `dimensions`, typed flags
- [ ] Ensure both V1 and V2 can import/implement the interface

### Phase 2: V2 Scorer Update

- [ ] Add `hadContamination` parameter to V2 scoring function
- [ ] Apply contamination penalty: `qualityScore -= 0.25`
- [ ] Apply sufficiency cap: `sufficiencyCap = Math.min(sufficiencyCap ?? 1, 0.6)`
- [ ] Return `QualityScoreResult` with both `score01` and `score100`

### Phase 3: V1 Scorer Update

- [ ] Extend V1 scorer signature to accept `hadContamination`
- [ ] Apply matching contamination penalty and cap
- [ ] Expose `score01` as primary output, compute `score100` from it

### Phase 4: Threshold Migration

- [ ] Update `config.ts` validation to accept 0.0-1.0 range
- [ ] Add backward-compat: detect integer thresholds (>1) and auto-convert by dividing by 100
- [ ] Update `workflow.ts` to compare `score01` against the migrated threshold
- [ ] Log a deprecation warning when integer threshold is auto-converted

### Phase 5: Test Baseline Rework

- [ ] Update all quality scorer test expectations to use 0.0-1.0 scale
- [ ] Add test cases for contamination penalty application
- [ ] Add test cases for backward-compat integer threshold conversion
- [ ] Verify no silent scale mismatch in any test fixture
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | V1 scorer contamination penalty, V2 scorer contamination penalty, threshold conversion | Vitest |
| Unit | `QualityScoreResult` interface compliance for both scorers | Vitest |
| Integration | End-to-end scoring with contamination flag through workflow abort check | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | N/A | Green | This is a foundational change with no upstream dependencies |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Quality scores break downstream consumers or test suites fail after migration
- **Procedure**: Revert `QualityScoreResult` changes and restore integer threshold validation; `score100` remains available as the legacy field so downstream consumers are unaffected during rollback
<!-- /ANCHOR:rollback -->
