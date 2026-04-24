---
title: "Implem [system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/003-real-feedback-labels/plan]"
description: "Describe the shipped query-scoped replay path, the shared queryText persistence change, and the regression coverage that verifies the seam."
trigger_phrases:
  - "real feedback labels plan"
  - "query-scoped replay plan"
  - "shadow evaluation plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/003-real-feedback-labels"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Real Feedback Labels for Evaluation

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM) |
| **Framework** | MCP server runtime + Vitest |
| **Storage** | SQLite `adaptive_signal_events` |
| **Testing** | `mcp_server/tests/adaptive-ranking-e2e.vitest.ts` |

### Overview
Phase 3 shipped by tightening three connected seams. Replay feedback is now query-scoped, validation writes now persist `queryText`, and the E2E suite proves scheduled replay and threshold tuning see the same stored signals.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Query-scoped replay filtering implemented
- [x] `queryText` persisted in validation feedback metadata
- [x] Replay skips unlabeled holdout queries
- [x] Regression coverage updated and passing
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime seam alignment between replay evaluation and validation feedback persistence.

### Key Components
- **`shadow-evaluation-runtime.ts`**: Loads query-scoped replay feedback and normalizes raw totals
- **`checkpoints.ts`**: Persists `queryText` beside `queryId` when `memory_validate` records feedback
- **`adaptive-ranking-e2e.vitest.ts`**: Verifies replay, scheduled evaluation, and tuning across real SQLite state

### Data Flow
Validation event -> `recordAdaptiveSignal(queryText, metadata.queryText)` -> SQLite feedback rows -> `getRelevanceFeedback(queryText)` -> `buildReplayRanks()` -> scheduled replay and tuning
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Trace replay feedback lookup in `shadow-evaluation-runtime.ts`
- [x] Trace validation feedback persistence in `handlers/checkpoints.ts`
- [x] Confirm E2E coverage is the correct regression home for the seam

### Phase 2: Core Implementation
- [x] Add query-scoped filtering over `query` and `metadata.queryText`
- [x] Aggregate raw totals as `outcome_total - correction_total`
- [x] Normalize replay labels with the maximum absolute raw total
- [x] Persist `queryText` in the validation feedback payload and metadata
- [x] Return `null` from `buildReplayRanks()` when no query-scoped feedback exists

### Phase 3: Verification
- [x] Verify the full lifecycle case seeds query-aware signals
- [x] Verify the scheduled replay case consumes query-aware signals and tunes thresholds
- [x] Update docs so they describe the shipped seam instead of the earlier self-referential design
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Runtime seam | Query-scoped replay feedback and unlabeled-query skipping | Direct code inspection + E2E assertions |
| Shared metadata | `memory_validate` writes `queryText` for replay matching | Code inspection |
| Regression | Scheduled replay and threshold tuning | Vitest E2E suite |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Validation feedback rows | Internal | Green | Replay has no truth labels to consume |
| Query text persistence | Internal | Green | Replay cannot scope feedback to the holdout query |
| Phase 5 E2E suite | Internal | Green | No regression safety net for replay and tuning |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Replay stops finding query-scoped labels or scheduled evaluation loses signal coverage
- **Procedure**: Revert the query-scoped replay changes and the `checkpoints.ts` metadata write together so replay and validation stay aligned
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (trace seams) ──► Phase 2 (runtime + metadata) ──► Phase 3 (verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Verify |
| Core | Setup | Verify |
| Verify | Core | Phase 4, Phase 5 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 30-45 min |
| Core Implementation | Medium | 60-90 min |
| Verification | Medium | 45-60 min |
| **Total** | | **~2.5-3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Replay and validation metadata traced together
- [x] E2E coverage identified before doc updates
- [x] Query-scoped skip behavior understood

### Rollback Procedure
1. Revert the replay feedback filter and normalization changes
2. Revert `queryText` persistence in `checkpoints.ts`
3. Re-run the E2E suite to confirm replay returns to the prior behavior
4. Update docs so replay is not described as query-scoped anymore

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Existing feedback rows can remain; the runtime simply stops reading `queryText` for replay matching
<!-- /ANCHOR:enhanced-rollback -->

---
