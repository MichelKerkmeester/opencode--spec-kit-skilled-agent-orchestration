---
title: "Feature Specification: Real Feedback Labels for Evaluation"
description: "Align shadow replay with real query-scoped validation feedback so holdout evaluation uses stored outcome and correction signals instead of self-referential labels."
trigger_phrases:
  - "real feedback labels"
  - "buildReplayRanks"
  - "query-scoped feedback"
  - "feedback-informed evaluation"
importance_tier: "normal"
contextType: "implementation"
---

<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-persist-tuned-thresholds |
| **Successor** | 004-fix-access-signal-path |
| **Handoff Criteria** | Replay uses query-scoped feedback, centered normalization, and skips unlabeled holdout queries |

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 3** of the adaptive-ranking packet.

**Scope Boundary**: Update replay labeling and the shared validation metadata that replay depends on. This phase does not change access-signal writes or live ranking order.

**Dependencies**:
- Validation feedback is already persisted to `adaptive_signal_events`
- `memory_validate` can resolve a query text for stored validation events
- Phase 5 regression coverage is available to lock the seam down

**Deliverables**:
- Query-scoped replay feedback lookup
- Centered normalization for outcome and correction totals
- `queryText` persistence in validation feedback metadata
<!-- /ANCHOR:phase-context -->

# Feature Specification: Real Feedback Labels for Evaluation

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
`buildReplayRanks()` originally derived replay relevance from the shadow proposal itself. That made the shadow evaluation loop self-referential and let correction-heavy feedback flatten to the floor instead of influencing ranking with the same direction users expressed.

### Purpose
Use stored query-matched validation feedback as replay truth so holdout evaluation measures real user signals and skips replay when no query-scoped labels exist.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Query-scoped outcome and correction lookup in `mcp_server/lib/feedback/shadow-evaluation-runtime.ts`
- Centered replay normalization based on the maximum absolute raw total
- `queryText` persistence in `mcp_server/handlers/checkpoints.ts`
- Regression coverage in `mcp_server/tests/adaptive-ranking-e2e.vitest.ts`

### Out of Scope
- Access-signal write-path changes - handled in Phase 4
- Threshold persistence logic - already handled in Phase 2
- Live result reordering outside replay evaluation - future work

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/feedback/shadow-evaluation-runtime.ts` | Modify | Filter replay feedback by query and normalize raw outcome/correction totals |
| `mcp_server/handlers/checkpoints.ts` | Modify | Persist `queryText` beside `queryId` for validation feedback |
| `mcp_server/tests/adaptive-ranking-e2e.vitest.ts` | Modify | Cover replay, scheduled evaluation, and threshold-tuning seams |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Replay feedback is query-scoped | `getRelevanceFeedback()` filters by `query = ?` or `json_extract(metadata, '$.queryText') = ?` |
| REQ-002 | Replay labels aggregate real feedback | Runtime sums `outcome_total - correction_total` per memory |
| REQ-003 | Replay preserves correction direction | Normalization uses `(raw + maxAbs) / (2 * maxAbs)` instead of flattening corrections to `0` |
| REQ-004 | Unlabeled holdout queries are skipped | `buildReplayRanks()` returns `null` when no query-scoped feedback exists |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Validation feedback stores `queryText` | `memory_validate` passes `queryText` in the signal payload and metadata |
| REQ-006 | Regression coverage reaches the seam | `adaptive-ranking-e2e.vitest.ts` exercises replay and scheduled evaluation with query-aware signals |

### Acceptance Scenarios

**Given** a replay query with matching outcome and correction rows, **when** `buildReplayRanks()` runs, **then** it uses the stored query-scoped totals instead of shadow-score labels.

**Given** a replay set where a correction total outweighs the outcome total, **when** normalization runs, **then** the resulting relevance lands below the midpoint instead of being clamped to `0`.

**Given** validation feedback stored through `memory_validate`, **when** replay loads feedback, **then** it can match on `queryText` from the signal payload or metadata.

**Given** a holdout query with no query-scoped feedback, **when** replay tries to build ranks, **then** the runtime skips the query by returning `null`.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Replay labels come from real query-matched feedback instead of self-referential shadow scores
- **SC-002**: Correction-heavy feedback demotes replay labels through centered normalization
- **SC-003**: `memory_validate` writes `queryText` so replay can match validation events to the original search
- **SC-004**: E2E coverage proves the replay seam works under real SQLite state
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Validation feedback metadata | Replay cannot match stored feedback without query text | `checkpoints.ts` now persists `queryText` beside `queryId` |
| Risk | Historical rows missing `queryText` | Older feedback is invisible to replay | Skip unlabeled holdout queries instead of fabricating labels |
| Risk | Raw totals vary widely between memories | Replay scores could compress unpredictably | Normalize against the maximum absolute total in the replay set |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Replay feedback lookup stays batched over the replay memory ID set, not per-memory queries
- **NFR-P02**: Query-scoped filtering does not add a second database pass for the same replay set

### Security
- **NFR-S01**: Replay reads only validation metadata already stored in SQLite
- **NFR-S02**: No new sensitive fields are added beyond query text already recorded by `memory_validate`

### Reliability
- **NFR-R01**: Empty or missing query-scoped feedback returns an empty map rather than throwing
- **NFR-R02**: Replay skips unlabeled queries cleanly by returning `null`
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty replay memory set: returns an empty feedback map immediately
- Zero raw totals after aggregation: replay assigns a neutral `0.5` score
- Mixed outcome and correction rows: runtime aggregates them before normalization

### Error Scenarios
- `adaptive_signal_events` table missing: helper returns an empty map
- Query text absent from historical rows: replay skips that holdout query
- Validation metadata incomplete: replay still checks the top-level `query` field first

### State Transitions
- New validation event arrives after replay selection: later cycles can consume it once the same query is replayed
- Old unlabeled events remain in the table: they are ignored without mutating stored data
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | Runtime helper, shared validation metadata, and regression coverage all move together |
| Risk | 18/25 | Replay correctness depends on runtime and validation metadata aligning |
| Research | 11/20 | Required code tracing across runtime, handler, and tests |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None at this phase. Query-scoped replay, `queryText` persistence, and unlabeled-query skipping are all implemented and verified.
<!-- /ANCHOR:questions -->

---
