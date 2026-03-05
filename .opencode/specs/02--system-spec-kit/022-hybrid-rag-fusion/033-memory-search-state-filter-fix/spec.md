---
title: "Spec: Memory Search State Filter Fix"
description: "Fix Stage 4 filtering so memory_search does not drop candidate rows when memoryState is missing."
importance_tier: "normal"
contextType: "implementation"
---
# Specification: Memory Search State Filter Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-03-05 |
| **Branch** | `033-memory-search-state-filter-fix` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`memory_search` can return zero results even when indexed memories exist because Stage 4 applies a state filter that drops rows where `memoryState` is missing. This creates false-negative searches for broad queries and breaks expected behavior in quick, focused, and deep modes.

### Purpose
Ensure state filtering is safe and deterministic so valid candidate rows are preserved without mutating score values.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix Stage 4 filtering logic to handle rows with missing `memoryState` safely.
- Define fallback strategy for state evaluation (derived state or non-dropping strategy).
- Add regression coverage for broad known queries and mode consistency.

### Out of Scope
- Filename slug or task-enrichment behavior from phase 032 - separate scope.
- Unrelated ranking/scoring algorithm changes - unnecessary for this bug.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/pipeline/stage4-filter.ts` | Modify | Prevent false drops when `memoryState` is absent |
| `mcp_server/lib/search/pipeline/types.ts` | Modify | Align candidate row typing for safe state handling |
| `mcp_server/lib/search/pipeline/stage*.ts` | Modify (if needed) | Ensure upstream candidate rows provide state inputs consistently |
| `mcp_server/tests/pipeline-v2.vitest.ts` | Modify | Add regression tests for missing-state and mode consistency |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `memory_search` must return non-empty results for broad known queries when indexed memories exist. | Regression test demonstrates non-empty results for representative broad query fixtures. |
| REQ-002 | Missing `memoryState` rows must be handled safely (fallback derivation or non-dropping strategy) without mutating scores. | Stage 4 no longer drops rows solely due to missing state; score values before/after Stage 4 are identical for retained rows. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | quick/focused/deep behavior remains logically consistent after the fix. | Mode-specific tests show no contradictory filtering outcomes attributable to missing `memoryState`. |
| REQ-004 | Regression tests are added and passing in CI/local test command. | `mcp_server/tests/pipeline-v2.vitest.ts` includes new test cases and they pass. |
| REQ-005 | Stage-filter observability remains explicit for unknown inputs. | `stateStats.before` continues to report unresolved states as `UNKNOWN`, while post-filter stats report resolved fallback tiers. |
<!-- /ANCHOR:requirements -->

---

## 4.1 ACCEPTANCE SCENARIOS

- **Given** a Stage 4 input set with at least one row missing `memoryState`, **when** `minState` is `WARM`, **then** the missing-state row is retained through fallback instead of being dropped.
- **Given** a row with invalid `memoryState` text, **when** Stage 4 filtering runs, **then** the row is handled via fallback and evaluated against the active `minState` threshold.
- **Given** equivalent candidate rows for focused (`WARM`) and deep (`COLD`) paths, **when** filtering executes, **then** deep-mode retained IDs are a superset of focused-mode retained IDs.
- **Given** many fallback-resolved rows and `applyStateLimits=true`, **when** per-tier caps are applied, **then** fallback-tier cap limits are enforced deterministically without score mutation.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Broad known queries no longer collapse to zero due to missing state metadata.
- **SC-002**: Missing-state handling preserves ranking input integrity by keeping score immutability.
- **SC-003**: New regression tests protect quick/focused/deep consistency for this failure mode.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Upstream pipeline row construction (`stage1`-`stage3`) | Missing provenance can hide true root cause | Validate candidate-row shape before and after Stage 4 in tests |
| Risk | Overly permissive fallback may include low-quality rows | Medium | Keep existing mode/state policy; only change missing-state behavior |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope is intentionally narrow to Stage 4 state filtering and regression coverage.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No measurable regression in `memory_search` latency for existing pipeline tests.
- **NFR-P02**: Fix adds at most constant-time fallback checks per candidate row.

### Security
- **NFR-S01**: No change to authentication or authorization behavior.
- **NFR-S02**: No new sensitive data fields introduced by fallback handling.

### Reliability
- **NFR-R01**: Searches with indexed data should not fail closed because of missing optional state metadata.
- **NFR-R02**: Regression tests cover the previously failing path and remain stable.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: Existing query-validation behavior remains unchanged.
- Missing `memoryState`: Row is handled via fallback path instead of being dropped unconditionally.
- Invalid state value: Treated as unknown and processed by safe fallback strategy.

### Error Scenarios
- Incomplete candidate row metadata: Stage 4 keeps row if fallback permits.
- Upstream shape mismatch: Tests should fail with explicit fixture expectation mismatch.
- Concurrent searches: No change; pipeline remains read-only per request.

### State Transitions
- Rows with explicit state continue existing filtering behavior.
- Rows without state transition through fallback branch without score mutation.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 2-4 pipeline files plus regression tests |
| Risk | 18/25 | Search quality impact if fallback is incorrect |
| Research | 10/20 | Need to confirm upstream candidate row construction |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. REFERENCES

- `mcp_server/lib/search/pipeline/stage4-filter.ts`
- `mcp_server/lib/search/pipeline/types.ts`
- `mcp_server/lib/search/pipeline/` (upstream candidate-row builders)
- `mcp_server/tests/pipeline-v2.vitest.ts`
