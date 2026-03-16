---
title: "Implementation Plan: Integration Testing"
---
# Implementation Plan: Integration Testing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | generate-context.js pipeline |
| **Storage** | Filesystem (temp repo with spec folders, JSON input, description.json) |
| **Testing** | Vitest |

### Overview

This plan implements an E2E test factory pattern: create a temp repo factory that produces isolated spec folder structures with JSON input fixtures, then exercise three test cases through the real gate chain (happy-path save, alignment block abort, duplicate dedup) with real file I/O and real gate evaluation. The goal is to close the gap between heavily-mocked unit tests and the live orchestration pipeline, catching regressions in the write + index + description tracking boundary.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (R-01, R-04 -- can proceed with current interfaces)

### Definition of Done

- [ ] All acceptance criteria met (REQ-001 through REQ-005)
- [ ] Tests passing -- `workflow-e2e.vitest.ts` runs green in `npm test`
- [ ] Docs updated (spec/plan in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

E2E test factory -- temp repo factory creates isolated filesystem environments, test cases exercise the real pipeline, teardown removes all artifacts.

### Key Components

- **Temp repo factory (`tests/workflow-e2e.vitest.ts`)**: Creates isolated temp directories with realistic spec folder structures, `description.json` seed files, and JSON input data
- **Fixture data (`tests/fixtures/`)**: Minimal spec folder templates and JSON input payloads for each test scenario
- **Real gate chain**: The test imports and calls the actual workflow orchestrator, not mocked versions of individual gates

### Data Flow

1. `beforeEach`: Factory creates temp directory, copies fixture spec folder structure, seeds `description.json` with initial state
2. Test case prepares JSON input (happy-path, wrong-affinity, or duplicate content)
3. Test invokes the real workflow orchestrator pointing at the temp spec folder
4. Orchestrator runs the real gate chain: quality scoring, sufficiency evaluation, alignment check, dedup detection
5. On success: file writer creates memory file, description tracker updates `description.json`, sequence increments
6. On abort: no file written, no description mutation, appropriate rejection code returned
7. `afterEach`: Recursive cleanup of temp directory
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Temp Repo Factory

- [ ] Create `tests/workflow-e2e.vitest.ts` with `createTempRepo()` factory function
- [ ] Factory creates: temp dir, `.opencode/` marker, spec folder with `spec.md`, seed `description.json`
- [ ] Factory returns: `{ tempDir, specFolder, descriptionPath, cleanup() }`
- [ ] Wire `beforeEach`/`afterEach` for automatic setup and teardown

### Phase 2: Fixture Data

- [ ] Create `tests/fixtures/` directory
- [ ] Add minimal spec folder template (spec.md with required frontmatter and ANCHOR blocks)
- [ ] Add JSON input fixture for happy-path scenario (rich content, correct spec affinity)
- [ ] Add JSON input fixture for wrong-affinity scenario (valid content, wrong spec target)
- [ ] Add JSON input fixture for duplicate scenario (identical to happy-path)

### Phase 3: Test Case Implementation

- [ ] Test case 1 (happy-path): Invoke workflow with happy-path JSON input; assert memory file exists, `description.json` has new entry, sequence incremented
- [ ] Test case 2 (alignment block): Invoke workflow with wrong-affinity input; assert `ALIGNMENT_BLOCK` rejection, no memory file, `description.json` unchanged
- [ ] Test case 3 (duplicate dedup): Run happy-path first, then invoke again with identical content; assert no second memory file, sequence not double-incremented
- [ ] Verify post-write bookkeeping in each test case: read `description.json`, check file system, compare sequence numbers

### Phase 4: CI Integration

- [ ] Ensure `workflow-e2e.vitest.ts` is discovered by existing Vitest config
- [ ] Set appropriate timeout for real I/O operations (e.g., 30s per test)
- [ ] Run full test suite (`npm test`) and confirm no interference with existing tests
- [ ] Verify cleanup: no temp artifacts left after test run
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| E2E | Happy-path save: real write, real gates, real description tracking | Vitest |
| E2E | Alignment block: wrong spec affinity produces `ALIGNMENT_BLOCK` abort | Vitest |
| E2E | Duplicate dedup: second identical save is skipped | Vitest |
| Regression | Existing unit and integration tests unaffected by new E2E suite | Vitest, legacy JS test runners |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| R-01 (quality scorer unification) | Internal | Yellow | Tests use scorer output; can adapt to current scale if R-01 not yet landed |
| R-04 (type consolidation) | Internal | Yellow | Fixture types may need update; core test logic is type-agnostic |
| Workflow orchestrator API | Internal | Green | Existing entry point; tests import and call it directly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: E2E tests cause CI flakiness, excessive runtime, or conflict with existing test infrastructure
- **Procedure**: Remove `tests/workflow-e2e.vitest.ts` and `tests/fixtures/`; no production code is modified by this phase, so rollback has zero impact on runtime behavior
<!-- /ANCHOR:rollback -->
