---
title: "Feature Specification: Integration Testing"
---
# Feature Specification: Integration Testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [010-perfect-session-capturing](../spec.md) |
| **R-Item** | R-10 |
| **Sequence** | A4, D3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

22 Vitest + 25 legacy JS + 4 shell + 1 Python tests exist, but the real gate chain runs under heavy mocks. Post-write orchestration (description tracking, indexing, retry) has no end-to-end coverage. `task-enrichment.vitest.ts` mocks the file writer, both scorers, sufficiency, the indexer, and the retry manager. `test-integration.js` checks cleanup helpers and export presence, not live orchestration. There is no test that exercises the full save pipeline with real file I/O and real gate evaluation.

### Purpose

Add `workflow-e2e.vitest.ts` targeting the real gate chain with real write and description tracking, using a temp repo factory pattern to create isolated, realistic test environments that exercise the pipeline without mocks on the critical path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `workflow-e2e.vitest.ts` with a temp repo factory producing realistic spec folder + JSON input fixtures
- Three test cases: happy-path save, alignment block abort, duplicate save dedup
- Post-write bookkeeping verification: `description.json` mutation, sequence increment, memory file on disk
- Real gate chain exercised without mocks for the critical path (write + index boundary)

### Out of Scope

- Migrating `test-integration.js` to Vitest (P1 — tracked as REQ-006)
- Modifying existing unit tests or their mock strategies
- Adding performance benchmarks to the E2E suite

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/tests/workflow-e2e.vitest.ts` | Create | New E2E test with temp repo fixture factory and 3 test cases |
| `scripts/tests/fixtures/` | Create | Minimal spec folder structure + JSON input fixtures for E2E tests |
| `scripts/tests/test-integration.js` | Modify | Consider migration to Vitest (P2 scope, light touch only in this phase) |
| `scripts/tests/task-enrichment.vitest.ts` | Reference | Heavily-mocked test to compare against E2E coverage (research baseline) |
| `scripts/tests/memory-render-fixture.vitest.ts` | Reference | Heavily-mocked test to compare against E2E coverage (research baseline) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Vitest E2E test with temp repo factory creating realistic spec folder + JSON input | Factory produces isolated temp directory with valid spec folder structure, `description.json`, and JSON input file |
| REQ-002 | Test case 1: Happy-path save -- explicit JSON through real gate chain with real write and description tracking | Save completes successfully; memory file exists on disk; `description.json` updated with new entry |
| REQ-003 | Test case 2: Alignment block -- stateless capture with wrong spec affinity triggers `ALIGNMENT_BLOCK` abort | Save aborts with `ALIGNMENT_BLOCK`; no memory file written; no description entry added |
| REQ-004 | Test case 3: Duplicate save -- second save of same content triggers dedup skip, no double-write | Second save is skipped; only one memory file exists; sequence number does not increment twice |
| REQ-005 | Post-write bookkeeping verified: `description.json` mutation, sequence increment, memory file on disk | After happy-path save, all three artifacts reflect the save; after abort/dedup, artifacts are unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Migrate legacy JS integration tests (`test-integration.js`) to Vitest | `test-integration.js` logic ported to Vitest; runs in `npm test`; legacy file removed or marked deprecated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `workflow-e2e.vitest.ts` passes in CI with `npm test` -- all 3 test cases green
- **SC-002**: Real gate chain exercised without mocks for the critical path (write + index boundary) -- no mock on file writer, quality scorer, or sufficiency evaluator in the E2E tests
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | R-01 (quality scorer unification) | Quality scorer unified first so tests use canonical 0.0-1.0 scale | E2E tests can use score01 interface; if R-01 not landed, tests adapt to current scale |
| Dependency | R-04 (type consolidation) | Types stable before E2E test fixtures are defined | Fixture types can be updated when R-04 lands; core test logic is type-agnostic |
| Risk | Temp repo factory leaks files on test failure | Low | Use Vitest `afterEach` with `fs.rm(tempDir, { recursive: true, force: true })` cleanup |
| Risk | E2E tests are slow due to real I/O | Medium | Limit to 3 focused test cases; use minimal fixture data; set reasonable timeout |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **OQ-001**: Minimal 3-case fixture (current) or extended coverage including filter pipeline + tree thinning interaction?
<!-- /ANCHOR:questions -->
