---
title: "Featur [system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/005-e2e-integration-test/spec]"
description: "Describe the shipped adaptive ranking lifecycle suite: real SQLite state, targeted runtime mocks, scheduled replay coverage, and corrected signal counts."
trigger_phrases:
  - "phase 5 integration"
  - "adaptive ranking e2e"
  - "scheduled replay coverage"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/005-e2e-integration-test"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["spec.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-fix-access-signal-path |
| **Successor** | 006-default-on-boost-rollout |
| **Handoff Criteria** | Lifecycle coverage proves the Phase 3 and Phase 4 seams compose correctly under real SQLite state |

### Phase Context

This is **Phase 5** of the adaptive-ranking packet.

**Scope Boundary**: Document the shipped lifecycle test boundary. The suite uses real in-memory SQLite state and real adaptive ranking logic, while mocking runtime dependencies outside that boundary.

**Dependencies**:
- Phases 1-4 behavior exists in the runtime under test
- Scheduled replay can be driven through a mocked `executePipeline()`
- Adaptive env flags can be restored between tests

**Deliverables**:
- Accurate description of the four-scenario lifecycle suite
- Correct signal-count documentation
- Explicit coverage of replay and access seams
# Feature Specification: Phase 5 — End-to-End Integration Test

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
The lifecycle suite existed, but the docs overstated what it covered. The shipped file uses real in-memory SQLite state and real adaptive ranking logic, yet it still mocks a small set of runtime dependencies such as embedding readiness, boost flags, and `executePipeline()`.

### Purpose
Document the actual test boundary so the phase describes the shipped regression suite instead of an idealized no-mock version.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `mcp_server/tests/adaptive-ranking-e2e.vitest.ts` as the lifecycle regression suite
- Real `better-sqlite3` `:memory:` state created in `beforeEach`
- Real adaptive ranking, replay, tuning, and reset logic
- Scheduled replay coverage through `runScheduledShadowEvaluationCycle()`
- Correct seed-count documentation for the full lifecycle and scheduled replay cases

### Out of Scope
- Running the full live search pipeline without mocks - the suite uses targeted runtime stubs
- Embedding boot or networked dependencies - those are mocked away
- Performance benchmarking - not the goal of this phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/tests/adaptive-ranking-e2e.vitest.ts` | Modify | Lifecycle regression suite with four focused scenarios |
| `mcp_server/lib/feedback/shadow-evaluation-runtime.ts` | Read-only | Scheduled replay runtime under test |
| `mcp_server/lib/cognitive/adaptive-ranking.ts` | Read-only | Adaptive ranking and threshold logic under test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Real SQLite state drives the suite | `beforeEach` opens `new Database(':memory:')` and calls `ensureAdaptiveTables(db)` |
| REQ-002 | Replay seam is covered | Query-scoped outcome and correction signals are seeded and consumed during replay |
| REQ-003 | Access seam is covered | Lifecycle setup includes access rows that later phases can consume |
| REQ-004 | Scheduled replay is covered | Suite calls `runScheduledShadowEvaluationCycle()` with deterministic holdout settings |
| REQ-005 | Reset behavior is verified | Full lifecycle case asserts `clearedSignals: 23` and `clearedRuns: 2` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Mock boundary is documented honestly | Docs state the suite uses targeted mocks for external runtime dependencies |
| REQ-007 | Seed counts match the shipped assertions | Docs describe the 23-signal full lifecycle case and the 10-signal scheduled replay case |

### Acceptance Scenarios

**Given** a fresh in-memory database, **when** the full lifecycle case seeds access, outcome, and correction rows, **then** proposal, evaluation, tuning, and reset all run on real SQLite state.

**Given** the scheduled replay case, **when** `executePipeline()` is mocked with deterministic results, **then** `runScheduledShadowEvaluationCycle()` still exercises the replay seam and threshold tuning logic.

**Given** the suite restores env flags in teardown, **when** tests finish, **then** adaptive-ranking flags do not leak into the next case.

**Given** the full lifecycle case completes, **when** reset runs, **then** the suite asserts the exact stored counts `23` signals and `2` runs.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Docs describe the shipped four-scenario file instead of a single no-mock scenario
- **SC-002**: Docs call out the real SQLite boundary and the targeted runtime mocks accurately
- **SC-003**: Signal-count documentation matches the assertions in the test file
- **SC-004**: Phase 3 and Phase 4 seam coverage is explicit in the phase packet
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 1-4 runtime behavior | Lifecycle assertions drift if earlier seams regress | The suite exercises replay, access, tuning, and reset together |
| Risk | Overstating test coverage | Readers expect a full live pipeline run that does not exist | Docs now call out the targeted mocks explicitly |
| Risk | Seed counts drift from assertions | Operators misunderstand the reset and replay expectations | Docs now record the exact shipped counts used by the suite |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The suite should stay small enough to run as a targeted regression check
- **NFR-P02**: Real SQLite state must remain in-memory only

### Security
- **NFR-S01**: Test data stays synthetic and local to the suite
- **NFR-S02**: Env cleanup restores prior values after every test case

### Reliability
- **NFR-R01**: The suite uses deterministic seeds and holdout settings where replay is involved
- **NFR-R02**: Targeted mocks isolate runtime dependencies outside the adaptive lifecycle boundary
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Full lifecycle case: 23 total signals before reset
- Scheduled replay case: 10 query-scoped replay signals before evaluation
- Fresh DB per test: no cross-test state leakage

### Error Scenarios
- Runtime dependency unavailable: suite uses explicit mocks instead of booting the real service
- Replay inputs missing: scheduled case injects deterministic pipeline results through `executePipeline()`
- Env flag pollution: teardown restores previous values

### State Transitions
- Before each test: new SQLite state and clean env setup
- After each test: thresholds reset and DB closed
- Scheduled replay case: replay feeds directly into promotion tuning assertions
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | One test file covers multiple lifecycle seams |
| Risk | 16/25 | Accuracy matters because the docs previously overstated the boundary |
| Research | 10/20 | Required tracing the suite, runtime mocks, and seed counts |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None at this phase. The suite boundary, seam coverage, and seed counts are all confirmed against the current test file.
<!-- /ANCHOR:questions -->

---
