---
title: "Feature [system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/001-quality-scorer-unification/spec]"
description: "Unify the dual quality scoring systems (V1 0-100, V2 0.0-1.0) onto a single canonical 0.0-1.0 scale with contamination score penalty."
trigger_phrases:
  - "feature"
  - "spec"
  - "001"
  - "quality"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Quality Scorer Unification

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-16 |
| **Completed** | 2026-03-16 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 1 |
| **Predecessor** | [000-dynamic-capture-deprecation](../000-dynamic-capture-deprecation/spec.md) |
| **Successor** | [002-contamination-detection](../002-contamination-detection/spec.md) |
| **Handoff Criteria** | validate.sh + test suite passing |
| **R-Item** | R-01 |
| **Sequence** | A3 |
<!-- /ANCHOR:metadata -->

---

### Phase Context

This is **Phase 1** of the Perfect Session Capturing specification.

**Scope Boundary**: The pipeline runs three quality checks with a split contract: stored/indexed quality uses the 0.0-1.0 scale, but workflow gating uses 0-100.
**Dependencies**: None
**Deliverables**: Unified QualityScoreResult interface with score01 (canonical) and score100 (compatibility); contamination penalty added to V2 scorer
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The pipeline runs three quality checks with a split contract: stored/indexed quality uses the 0.0-1.0 scale, but workflow gating uses 0-100. The `qualityAbortThreshold` config is validated as 1-100 with a default of 15. The V1 scorer covers 7 dimensions on the 0-100 scale. The V2 scorer covers 9 dimensions on 0.0-1.0. Neither scorer accounts for contamination detection results -- contamination produces a flag but no score penalty.

### Purpose

Make `score01` (0.0-1.0) the canonical quality scale across the entire pipeline, keep `score100` as a backward-compatible alias, migrate the abort threshold to the canonical scale, and ensure contamination detection produces a measurable score penalty rather than just a boolean flag.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Define a unified `QualityScoreResult` interface with `score01` (canonical), `score100` (compatibility), typed flags, and dimensional breakdown
- Add contamination penalty to V2 scorer at `hadContamination`
- Extend V1 scorer signature to accept `hadContamination` with matching sufficiency cap
- Migrate `qualityAbortThreshold` from 1-100 to 0.0-1.0 with backward compatibility

### Out of Scope

- Changing the number of quality dimensions in either scorer -- dimension counts stay at 7 (V1) and 9 (V2)
- Removing the V1 scorer -- it remains active for backward compatibility
- Modifying the quality-loop retry logic -- only the threshold comparison changes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/core/quality-scorer.ts` | Modify | V1 scorer -- add contamination input, expose `score01` alongside `score100` |
| `scripts/extractors/quality-scorer.ts` | Modify | V2 scorer -- add contamination penalty at `hadContamination` |
| `scripts/core/workflow.ts` | Modify | Migrate `qualityAbortThreshold` comparison to 0.0-1.0 scale |
| `scripts/core/config.ts` | Modify | Update threshold validation range from 1-100 to 0.0-1.0 |
| `scripts/tests/quality-scorer-calibration.vitest.ts` | Modify | Update test baselines from 0-100 to 0.0-1.0 scale expectations |
| `scripts/tests/runtime-memory-inputs.vitest.ts` | Modify | Update threshold comparison and workflow integration tests for new 0.0-1.0 scale |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Unified `QualityScoreResult` interface with `score01` (canonical), `score100` (compat), typed flags, dimensional breakdown | Both scorers return the unified interface; `score01` is used for all downstream comparisons |
| REQ-002 | V2 contamination penalty: `qualityScore -= 0.25; sufficiencyCap = Math.min(sufficiencyCap ?? 1, 0.6)` at `hadContamination` | V2 score drops by 0.25 and is capped at 0.6 when contamination is detected |
| REQ-003 | V1 extended signature accepts `hadContamination` with matching cap | V1 scorer accepts contamination flag and applies equivalent penalty |
| REQ-004 | `qualityAbortThreshold` migrated from 1-100 to 0.0-1.0 with backward compat | Existing configs using integer thresholds are auto-converted; new configs use 0.0-1.0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Canonical docs and checklists use explicit evidence for completed verification items | Completed checklist entries include parsable evidence markers that map to this phase's verification commands and outputs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All quality scores stored as 0.0-1.0 with no silent scale mismatch anywhere in the pipeline
- **SC-002**: Contamination detection produces a score penalty (not just a flag) -- contaminated memories score at least 0.25 lower and are capped at 0.6

### Acceptance Scenarios

1. **Given** a quality result returned by either scorer, **when** the pipeline consumes it, **then** `score01` is available and is used for threshold comparisons.
2. **Given** `hadContamination = true`, **when** scoring runs, **then** the score is penalized and capped as defined by the contamination rule.
3. **Given** an integer `qualityAbortThreshold` in legacy config, **when** config normalization runs, **then** the threshold is converted to `0.0-1.0` and used safely.
4. **Given** completed checklist items for this phase, **when** validation parses evidence markers, **then** each completed item has explicit evidence text.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None -- foundational change | N/A | This phase has no upstream dependencies and can begin immediately |
| Risk | Existing tests hardcode 0-100 scale expectations | Medium | Update test baselines as part of threshold migration |
| Risk | Third-party consumers of `score100` break silently | Low | `score100` remains available as a computed compat field |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **OQ-001**: Contamination penalty implementation is shared with `000-dynamic-capture-deprecation/001-session-source-validation`. 001 owns the unified scorer interface; the archived branch phase owns the session-validation trigger. Handoff: 001 adds the `hadContamination` parameter to both scorers, and the branch phase calls it.
<!-- /ANCHOR:questions -->
