---
title: "Feature Specification: Integration Testing"
description: "Verify end-to-end integration behavior across the full pipeline."
---
# Feature Specification: Integration Testing

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
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 10 of 16 |
| **Predecessor** | 009-embedding-optimization |
| **Successor** | 011-session-source-validation |
| **Handoff Criteria** | validate.sh + test suite passing |
| **R-Item** | R-10 |
| **Sequence** | A4, D3 |
<!-- /ANCHOR:metadata -->

---

### Phase Context

This is **Phase 10** of the Perfect Session Capturing specification.

**Scope Boundary**: The save pipeline needed direct filesystem-backed proof beyond the heavily mocked unit lanes.
**Dependencies**: 009-embedding-optimization
**Deliverables**: Added `workflow-e2e.vitest.ts`, `test-integration.vitest.ts`, and `tests/fixtures/session-data-factory.ts`; the save pipeline now has direct temp-repo E2E coverage plus Vitest parity for the legacy integration runner.

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The runtime gap is now closed: `workflow-e2e.vitest.ts` exercises the real save path with temp-repo isolation, real markdown writes, real `description.json` mutation, and real post-write indexing handoff behavior. `test-integration.vitest.ts` also migrated the legacy integration runner into the active Vitest lane so the coverage lives inside the regular scripts suite instead of a sidecar JS-only test.

### Purpose

Record the shipped E2E integration coverage truthfully, using the live test files and current verification results as evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `workflow-e2e.vitest.ts` with a temp repo factory producing realistic spec folder + JSON input fixtures
- Six test cases: happy-path save, alignment block abort, duplicate save dedup, insufficiency abort, indexing failure resilience, tree-thinning merge notes
- Post-write bookkeeping verification: `description.json` mutation, sequence increment, memory file on disk
- Real gate chain exercised without mocks for the critical path (write + index boundary)
- Shared `SessionData` fixture factory in `tests/fixtures/session-data-factory.ts`

### Out of Scope

- Further widening the integration lane beyond the shipped six-case E2E coverage
- Modifying existing unit tests or their mock strategies
- Adding performance benchmarks to the E2E suite

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/tests/workflow-e2e.vitest.ts` | Create | New E2E test with temp repo fixture factory and 6 test cases |
| `scripts/tests/fixtures/session-data-factory.ts` | Create | Shared SessionData fixture factory for E2E tests |
| `scripts/tests/test-integration.vitest.ts` | Create | Vitest migration of `test-integration.js` (REQ-006 completed) |
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

- **SC-001**: **Given** the `workflow-e2e.vitest.ts` suite in CI, **Then** all 6 target test cases pass.
- **SC-002**: **Given** the critical save path (write plus index boundary), **Then** the E2E suite exercises the chain without mocks on file writer, quality scorer, or sufficiency evaluator.
- **SC-003**: **Given** post-write bookkeeping requirements, **Then** happy-path saves mutate `description.json`, increment sequence state, and persist the memory file on disk.
- **SC-004**: **Given** failure-path scenarios (alignment block, insufficiency, dedup), **Then** no unintended write or sequence mutation occurs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | R-01 (quality scorer unification) | Quality scorer unified first so tests use canonical 0.0-1.0 scale | E2E tests can use score01 interface; if R-01 not landed, tests adapt to current scale |
| Dependency | R-04 (type consolidation) | Types stable before E2E test fixtures are defined | Fixture types can be updated when R-04 lands; core test logic is type-agnostic |
| Risk | Temp repo factory leaks files on test failure | Low | Use Vitest `afterEach` with `fs.rm(tempDir, { recursive: true, force: true })` cleanup |
| Risk | E2E tests are slow due to real I/O | Medium | Limit to 6 focused test cases; use minimal fixture data; set 30s timeout |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **OQ-001**: ~~Minimal 3-case fixture (current) or extended coverage?~~ Resolved: extended to 6 cases including insufficiency, indexing resilience, and tree-thinning.
<!-- /ANCHOR:questions -->
