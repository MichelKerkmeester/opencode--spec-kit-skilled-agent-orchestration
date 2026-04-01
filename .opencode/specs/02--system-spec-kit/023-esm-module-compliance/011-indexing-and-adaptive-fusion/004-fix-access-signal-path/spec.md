---
title: "Feature Specification: Fix Access Signal Path"
description: "Wire adaptive access writes into the main search pipeline so `trackAccess` persists query-aware access signals through one batched transaction."
trigger_phrases:
  - "fix access signal path"
  - "trackAccess adaptive signal"
  - "batched access signals"
importance_tier: "normal"
contextType: "implementation"
---

<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-real-feedback-labels |
| **Successor** | 005-e2e-integration-test |
| **Handoff Criteria** | `trackAccess` writes adaptive access signals through the batched stage-2 path |

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 4** of the adaptive-ranking packet.

**Scope Boundary**: Document and verify the shipped stage-2 access write path. This phase does not change access-tracker scheduling for non-pipeline callers.

**Dependencies**:
- Stage-2 fusion already owns the `trackAccess` guard
- Adaptive tables exist before writes
- Phase 5 lifecycle coverage can consume access rows later

**Deliverables**:
- Batched stage-2 access writes
- Query-aware access rows
- Non-blocking warning logs on failure
<!-- /ANCHOR:phase-context -->

# Feature Specification: Fix Access Signal Path

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
| **Created** | 2026-03-31 |
| **Branch** | `system-speckit/023-esm-module-compliance` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Adaptive ranking needed access events from the main search pipeline, not only from storage-side batching paths. The stage-2 pipeline now owns that seam, and the final implementation writes all accessed results through one transaction instead of documenting a slower per-result path.

### Purpose
Keep adaptive access signals aligned with the existing `trackAccess` guard so search writes both FSRS and adaptive access state from one predictable location.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Batched access writes in `mcp_server/lib/search/pipeline/stage2-fusion.ts`
- Query propagation into `adaptive_signal_events`
- Warning-log failure handling that does not break search delivery
- Lifecycle regression coverage in `mcp_server/tests/adaptive-ranking-e2e.vitest.ts`

### Out of Scope
- Refactoring `access-tracker.ts` for callers outside stage 2 - not needed for this path
- Changing FSRS scoring behavior - stage 2 still calls the existing path unchanged
- Retuning adaptive thresholds - covered in later phases

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modify | Add batched adaptive access writes inside the `trackAccess` branch |
| `mcp_server/tests/adaptive-ranking-e2e.vitest.ts` | Modify | Verify lifecycle coverage can consume stored access signals |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Access writes stay behind `trackAccess` | `recordAdaptiveAccessSignals()` is only called inside the guarded branch |
| REQ-002 | Writes are batched | Access inserts use one prepared statement and one transaction over the full result set |
| REQ-003 | Query context is preserved | Stored access rows receive `config.query` |
| REQ-004 | Failures are observable but non-blocking | Catch path logs `console.warn` and returns search results normally |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Regression coverage reaches the seam | The lifecycle suite persists access rows before replay and tuning assertions |
| REQ-006 | Empty-result path is safe | Helper exits without writes when the result set is empty |

### Acceptance Scenarios

**Given** a search runs with `trackAccess=true`, **when** stage 2 finishes, **then** adaptive access rows are inserted through the batched helper.

**Given** multiple results are returned, **when** the helper writes access rows, **then** the inserts run inside one transaction over the whole result set.

**Given** a query string is present in the search config, **when** access rows are written, **then** that query text is persisted with each adaptive access row.

**Given** SQLite rejects the adaptive write batch, **when** the catch path runs, **then** the pipeline logs a warning and still returns search results.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Stage 2 writes adaptive access rows from the main pipeline
- **SC-002**: Access writes are batched in one transaction rather than one transaction per result
- **SC-003**: Query text is preserved on stored access rows
- **SC-004**: Lifecycle coverage can consume the stored access rows in later phases
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Adaptive tables | No write target means the path cannot persist access rows | `ensureAdaptiveTables(db)` runs before inserts |
| Risk | High result counts | Frequent writes could add lock churn | One transaction handles the whole result set |
| Risk | Adaptive write failures | Operators could miss failures if the path is silent | Catch block logs `console.warn` without breaking search |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Access writes reuse one prepared statement for the entire batch
- **NFR-P02**: Empty result sets return before any write attempt

### Security
- **NFR-S01**: Stored access rows carry only memory IDs, query text, and empty actor metadata in this path
- **NFR-S02**: Search responses remain unaffected if the adaptive write path fails

### Reliability
- **NFR-R01**: Adaptive writes stay behind `trackAccess`
- **NFR-R02**: Failure logging remains observable through `console.warn`
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty result set: helper exits before any inserts
- Adaptive mode disabled: helper exits before schema checks or writes
- Query string absent: helper stores an empty string in the `query` column

### Error Scenarios
- Missing table in older state: helper bootstraps schema first
- SQLite write failure: catch path logs the error and preserves search delivery
- Large result set: helper still writes through one transaction, not one transaction per row

### State Transitions
- Search with `trackAccess=false`: stage 2 skips the adaptive helper entirely
- Search with `trackAccess=true`: stage 2 applies FSRS and adaptive access writes together
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Small source change, but it sits on the live search path |
| Risk | 17/25 | Search-time writes must stay non-blocking and observable |
| Research | 9/20 | Required tracing of stage-2 fusion and lifecycle tests |
| **Total** | **41/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None at this phase. The shipped path is batched, query-aware, and verified against the current stage-2 implementation.
<!-- /ANCHOR:questions -->

---
