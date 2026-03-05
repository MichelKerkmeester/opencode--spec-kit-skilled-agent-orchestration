---
title: "Plan: Memory Search State Filter Fix"
description: "Adjust Stage 4 state filtering to avoid dropping rows with missing memoryState and add focused pipeline regressions."
importance_tier: "normal"
contextType: "implementation"
---
# Plan: Memory Search State Filter Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js MCP server) |
| **Framework** | Internal pipeline modules |
| **Storage** | SQLite-backed memory index (already in place) |
| **Testing** | Vitest (`pipeline-v2.vitest.ts`) |

### Overview
This bugfix keeps the current search pipeline design but changes Stage 4 behavior for rows missing `memoryState`. The implementation introduces a safe fallback path (derived state or non-dropping strategy) and verifies score immutability plus mode consistency (quick/focused/deep) through targeted regressions.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md`)
- [x] Success criteria measurable (`REQ-001`..`REQ-004`)
- [x] Dependencies identified (pipeline stage boundaries)

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (`mcp_server/tests/pipeline-v2.vitest.ts`)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline bugfix in existing staged search architecture.

### Key Components
- **Stage 4 filter (`stage4-filter.ts`)**: Applies state-based filtering and will receive missing-state safety logic.
- **Candidate row types (`types.ts`)**: Defines row contract and nullable/optional state semantics.
- **Upstream stage modules**: Build candidate rows consumed by Stage 4.
- **Pipeline tests (`pipeline-v2.vitest.ts`)**: Verify regression coverage.

### Data Flow
Query enters pipeline -> upstream stages build candidate rows -> Stage 4 applies state filtering -> later stages rank/return results. Fix is constrained to missing-state handling at Stage 4 boundary and corresponding test fixtures.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm current Stage 4 assumptions for `memoryState` presence
- [x] Confirm upstream candidate row sources that may omit state

### Phase 2: Core Implementation
- [x] Add missing-state-safe filter logic in `stage4-filter.ts`
- [x] Update row typing/guards in `types.ts` (and upstream modules if required)
- [x] Preserve score immutability for retained rows

### Phase 3: Verification
- [x] Add regression cases for broad known queries with indexed memories
- [x] Add mode-consistency tests for quick/focused/deep
- [x] Run relevant vitest suite and capture outcomes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Stage 4 filter helpers and state fallback behavior | Vitest |
| Integration | Pipeline end-to-end behavior in `pipeline-v2.vitest.ts` | Vitest |
| Manual | Optional ad hoc `memory_search` sanity query | Local MCP invocation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Upstream candidate-row producers | Internal | Green | Missing-state root source may require small upstream guard update |
| Existing test fixtures for indexed memories | Internal | Green | Without fixture coverage, regression cannot be proven |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Result quality regression or mode inconsistency after Stage 4 fix.
- **Procedure**: Revert Stage 4/type changes and re-run pipeline tests to restore prior behavior.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Inspect pipeline contracts) ──► Phase 2 (Fix filter/type guards) ──► Phase 3 (Regression verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inspect | None | Fix, Verify |
| Fix | Inspect | Verify |
| Verify | Fix | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inspect pipeline contracts | Medium | 1-2 hours |
| Core implementation | Medium | 2-4 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **4-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Snapshot baseline test output for comparison
- [x] Confirm no unrelated test failures in touched suite
- [x] Confirm scope excludes phase 032 filename/slug behavior

### Rollback Procedure
1. Revert Stage 4/state-type patch set.
2. Re-run `pipeline-v2.vitest.ts` to confirm baseline behavior.
3. Re-check broad query fixtures for non-empty baseline behavior.
4. Re-open spec task with captured failing evidence.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
