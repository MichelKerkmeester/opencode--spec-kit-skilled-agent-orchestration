---
title: "Implementation Plan: Phase 5 — End-to-End Integration Test"
description: "Describe the shipped lifecycle suite: fresh in-memory SQLite per test, targeted runtime mocks, scheduled replay coverage, and corrected signal counts."
trigger_phrases:
  - "phase 5 plan"
  - "adaptive ranking e2e plan"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Phase 5 — End-to-End Integration Test

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + Vitest |
| **Framework** | Lifecycle regression tests |
| **Storage** | `better-sqlite3` `:memory:` databases |
| **Testing** | `mcp_server/tests/adaptive-ranking-e2e.vitest.ts` |

### Overview
The shipped Phase 5 suite uses one file with four focused scenarios. Each test starts from a fresh in-memory database, restores env flags in teardown, and exercises a different adaptive-ranking seam while mocking only runtime dependencies outside the lifecycle boundary.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Suite boundary documented honestly
- [x] Signal counts aligned with the shipped assertions
- [x] Phase 3 and Phase 4 seams called out explicitly
- [x] Docs updated across spec, plan, tasks, checklist, and summary
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fresh per-test SQLite harness with targeted runtime mocks around the adaptive lifecycle.

### Key Components
- **`beforeEach` / `afterEach` harness**: Creates fresh SQLite state and restores env flags
- **Full lifecycle case**: Covers proposal, evaluation, tuning, and reset
- **Scheduled replay case**: Covers `runScheduledShadowEvaluationCycle()` with mocked pipeline results
- **Direct signal cases**: Cover score deltas and threshold persistence

### Data Flow
`beforeEach` -> seed SQLite state -> run lifecycle scenario -> assert thresholds, replay metrics, or reset counts -> `afterEach` restores env and closes the DB
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the current test file and identify the real harness boundary
- [x] Trace env setup and teardown behavior
- [x] Trace the mocked runtime dependencies

### Phase 2: Core Implementation
- [x] Document the four focused scenarios in the shipped suite
- [x] Document the real SQLite boundary used by every test
- [x] Document the exact seed counts used in the full lifecycle and scheduled replay cases
- [x] Document the targeted mocks around `executePipeline()` and runtime readiness

### Phase 3: Verification
- [x] Confirm the scheduled replay case exercises the Phase 3 and Phase 4 seams
- [x] Confirm the full lifecycle case asserts `clearedSignals: 23` and `clearedRuns: 2`
- [x] Update docs so they no longer claim a fully unmocked, single-scenario suite
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Lifecycle regression | Proposal, evaluation, tuning, and reset | Vitest + real SQLite state |
| Scheduled replay seam | Query-aware replay and promotion tuning | Vitest + mocked `executePipeline()` |
| Isolation | Env snapshot, restore, and DB teardown | Vitest harness |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 1-4 runtime behavior | Internal | Green | Lifecycle assertions lose meaning if earlier seams regress |
| Targeted runtime mocks | Internal | Green | Scheduled replay case cannot stay deterministic |
| Env restoration harness | Internal | Green | Test pollution leaks between adaptive-ranking scenarios |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Docs drift again from the shipped lifecycle boundary or the seed-count assertions
- **Procedure**: Reconcile the docs against `tests/adaptive-ranking-e2e.vitest.ts`, then rerun targeted validation for the phase packet
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (trace suite) ──► Phase 2 (document boundary) ──► Phase 3 (verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Verify |
| Core | Setup | Verify |
| Verify | Core | Packet completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 20-30 min |
| Core Implementation | Medium | 45-60 min |
| Verification | Medium | 20-30 min |
| **Total** | | **~1.5-2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Current suite boundary traced
- [x] Seed counts confirmed from the test file
- [x] Scheduled replay seam confirmed from the current assertions

### Rollback Procedure
1. Re-read the current test file
2. Update the docs to match the active suite structure and counts
3. Re-run phase validation
4. Re-check the file count and touched paths

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. This phase documents a test suite and does not change stored production data
<!-- /ANCHOR:enhanced-rollback -->

---
