---
title: "Implementation Plan: Fix Access Signal Path"
description: "Describe the shipped batched access write path in stage 2 and the lifecycle coverage that verifies it stays aligned with `trackAccess`."
trigger_phrases:
  - "fix access signal plan"
  - "batched access signal plan"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Fix Access Signal Path

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM) |
| **Framework** | MCP server search pipeline |
| **Storage** | SQLite `adaptive_signal_events` |
| **Testing** | `mcp_server/tests/adaptive-ranking-e2e.vitest.ts` |

### Overview
Phase 4 shipped by adding a dedicated access-write helper to `stage2-fusion.ts`. The helper uses one prepared insert statement, one transaction over the accessed results, and one call site inside the existing `trackAccess` branch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Batched access helper exists in stage 2
- [x] Query text is stored on access rows
- [x] Failure handling logs warnings and stays non-blocking
- [x] Docs updated to match the shipped batched path
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-call-site stage-2 augmentation behind the existing `trackAccess` guard.

### Key Components
- **`stage2-fusion.ts`**: Owns the `trackAccess` branch and the batched access-write helper
- **`ensureAdaptiveTables(db)`**: Guarantees the adaptive write target exists before inserts
- **`adaptive-ranking-e2e.vitest.ts`**: Proves later lifecycle phases can consume the stored access rows

### Data Flow
Search with `trackAccess=true` -> stage 2 applies FSRS write-back -> stage 2 calls `recordAdaptiveAccessSignals(db, results, config.query)` -> helper writes one transaction into `adaptive_signal_events`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Trace the `trackAccess` branch in `stage2-fusion.ts`
- [x] Confirm schema bootstrapping is available through `ensureAdaptiveTables(db)`
- [x] Confirm lifecycle coverage can verify the seam later

### Phase 2: Core Implementation
- [x] Add `recordAdaptiveAccessSignals(db, results, query)`
- [x] Reuse one prepared insert statement for the full batch
- [x] Wrap inserts in one transaction over `results`
- [x] Pass `config.query` into stored access rows
- [x] Log warnings without surfacing adaptive-write failures to callers

### Phase 3: Verification
- [x] Verify the helper is called only inside `trackAccess`
- [x] Verify empty result sets exit cleanly
- [x] Verify lifecycle coverage can consume the access rows in later phases
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Runtime seam | Batched access helper and guarded call site | Code inspection |
| Regression | Access rows consumed by replay and tuning later | Vitest E2E suite |
| Failure-path review | Warning log and non-blocking behavior | Code inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Stage-2 `trackAccess` guard | Internal | Green | No safe call site for adaptive access writes |
| Adaptive tables | Internal | Green | Inserts have no destination |
| Phase 5 lifecycle suite | Internal | Green | No regression proof for the seam |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Search-time access writes become noisy or lifecycle coverage stops finding stored access rows
- **Procedure**: Revert the stage-2 helper and call site together, then re-run the lifecycle suite to confirm stage 2 returns to the earlier no-adaptive-access state
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (trace stage 2) ──► Phase 2 (batched writes) ──► Phase 3 (verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Verify |
| Core | Setup | Verify |
| Verify | Core | Phase 5 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 20-30 min |
| Core Implementation | Medium | 45-60 min |
| Verification | Medium | 30-45 min |
| **Total** | | **~1.5-2.25 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Stage-2 guard traced before doc updates
- [x] Batched helper behavior verified in code
- [x] Lifecycle regression coverage identified

### Rollback Procedure
1. Remove the stage-2 adaptive access helper call
2. Remove the helper implementation if no longer referenced
3. Re-run lifecycle coverage to confirm later phases no longer depend on stored access rows
4. Update docs to remove the batched-path description

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Existing access rows can remain in SQLite; rollback only changes whether new stage-2 searches continue to emit them
<!-- /ANCHOR:enhanced-rollback -->

---
