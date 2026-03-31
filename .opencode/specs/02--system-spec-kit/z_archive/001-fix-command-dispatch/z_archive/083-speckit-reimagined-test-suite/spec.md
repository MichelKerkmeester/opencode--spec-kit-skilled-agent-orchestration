---
title: "Feature Specif [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/083-speckit-reimagined-test-suite/spec]"
description: "This specification defines comprehensive test coverage for the SpecKit Reimagined implementation (082-speckit-reimagined). The test suite covers 33 features across 8 categories ..."
trigger_phrases:
  - "feature"
  - "specification"
  - "speckit"
  - "reimagined"
  - "test"
  - "spec"
  - "083"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: SpecKit Reimagined Test Suite

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

This specification defines comprehensive test coverage for the SpecKit Reimagined implementation (082-speckit-reimagined). The test suite covers 33 features across 8 categories (Search, Decay, Session, Graph, Performance, UX, Architecture, Specialized Tools), extending existing test files and adding new test coverage for 107 implementation tasks across 5 workstreams (W-S, W-R, W-D, W-G, W-I).

**Key Objectives**: Achieve 80%+ unit test coverage, 70%+ integration test coverage, and 50%+ end-to-end test coverage. Ensure all P0 requirements have dedicated test cases, validate NFRs for performance and reliability, and establish regression protection for future changes.

**Critical Dependencies**: All tests depend on the implemented modules from 082-speckit-reimagined. Key modules under test include session-manager.js, tier-classifier.js, composite-scoring.js, rrf-fusion.js, bm25-index.js, cross-encoder.js, causal-edges.js, corrections.js, archival-manager.js, provider-chain.js, envelope.js, and memory-context.js.

---

<!-- /ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-01 |
| **Parent Spec** | 082-speckit-reimagined |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 082-speckit-reimagined implementation introduced 33 features with 107 implementation tasks. While some existing tests cover core functionality, comprehensive test coverage is incomplete. Current test files provide foundation coverage but gaps exist in integration testing, edge case validation, and end-to-end workflows.

**Current Test Coverage (Baseline):**

| Test File | Test Count | Coverage Area |
|-----------|------------|---------------|
| tier-classifier.test.js | 78 | 5-state model, state classification, backward compatibility |
| five-factor-scoring.test.js | 65 | Multi-factor decay, composite scoring, factor weights |
| causal-edges.test.js | 29 | Causal graph, edge management, chain traversal |
| cross-encoder.test.js | 22 | Length penalty, reranking, provider availability |
| provider-chain.test.js | 28 | Embedding fallback, BM25-only mode, fallback logging |
| archival-manager.test.js | 32 | Archival detection, background jobs, statistics |
| **Total Existing** | **254** | **Partial coverage of 6 modules** |

**Gaps Requiring New Test Coverage:**
- Session deduplication (T001-T004) - No dedicated tests
- RRF fusion with convergence bonus (T020-T023) - Minimal coverage
- BM25 hybrid search (T028-T031) - No dedicated tests
- Intent-aware retrieval (T036-T039) - No dedicated tests
- Layered tool organization (T060-T063) - No dedicated tests
- Consolidation pipeline (T079-T083) - No dedicated tests
- Transaction atomicity (T105-T107) - Minimal coverage
- Memory context unified entry (T061) - No dedicated tests

### Purpose

Create a comprehensive test suite that:
1. Validates all 33 features from 082-speckit-reimagined
2. Achieves target coverage metrics (unit: 80%+, integration: 70%+, e2e: 50%+)
3. Protects against regressions during future development
4. Provides executable documentation of system behavior
5. Validates NFRs (performance, reliability, security)

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Unit tests for all new modules (W-S, W-R, W-D, W-G, W-I workstreams)
- Integration tests for cross-module workflows
- End-to-end tests for complete user journeys
- Performance benchmarks for NFR validation
- Regression tests for backward compatibility
- Edge case and error condition coverage
- Test fixtures and mock data generators

### Out of Scope

- Load/stress testing (P2 - separate infrastructure needed)
- Security penetration testing (P3 - requires specialized tools)
- UI/visual regression testing (N/A - CLI-only system)
- Cross-platform compatibility testing (P2 - macOS primary target)

### Files to Create

| File Path | Test Type | Description |
|-----------|-----------|-------------|
| `tests/session-manager.test.js` | Unit | Session deduplication, crash recovery |
| `tests/rrf-fusion.test.js` | Unit | RRF fusion, convergence bonus |
| `tests/bm25-index.test.js` | Unit | BM25 indexing, tokenization |
| `tests/intent-classifier.test.js` | Unit | Intent detection, weight adjustments |
| `tests/fuzzy-match.test.js` | Unit | Levenshtein distance, acronym expansion |
| `tests/consolidation.test.js` | Unit | 5-phase consolidation pipeline |
| `tests/memory-context.test.js` | Unit | Unified context entry, mode strategies |
| `tests/layer-definitions.test.js` | Unit | Layer organization, token budgets |
| `tests/envelope.test.js` | Unit | Response structure, error formatting |
| `tests/transaction-manager.test.js` | Unit | Atomic saves, rollback |
| `tests/recovery-hints.test.js` | Unit | Error catalog, hint retrieval |
| `tests/incremental-index.test.js` | Unit | Content hash, mtime tracking |
| `tests/integration/search-pipeline.test.js` | Integration | Vector + BM25 + reranking flow |
| `tests/integration/memory-lifecycle.test.js` | Integration | Save + index + search + archive |
| `tests/integration/session-workflow.test.js` | Integration | Session start + dedup + checkpoint + recovery |
| `tests/e2e/full-workflow.test.js` | E2E | Complete user journey tests |

### Files to Extend

| File Path | Test Type | Tests to Add |
|-----------|-----------|--------------|
| `tests/tier-classifier.test.js` | Unit | Type-specific half-lives (T005-T008) |
| `tests/five-factor-scoring.test.js` | Unit | Citation recency, pattern alignment |
| `tests/causal-edges.test.js` | Unit | Corrections integration (T052-T055) |
| `tests/cross-encoder.test.js` | Unit | Integration with RRF fusion |
| `tests/provider-chain.test.js` | Unit | Retry logic (T101-T104) |
| `tests/archival-manager.test.js` | Unit | Consolidation integration |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Coverage Targets (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-T001 | Unit Test Coverage | 80%+ line coverage on all new modules |
| REQ-T002 | Integration Test Coverage | 70%+ coverage on cross-module workflows |
| REQ-T003 | E2E Test Coverage | 50%+ coverage on user journeys |
| REQ-T004 | P0 Feature Coverage | 100% of P0 requirements have dedicated tests |
| REQ-T005 | Test Isolation | All tests run independently, no shared state |
| REQ-T006 | Test Determinism | All tests produce consistent results across runs |

### P1 - Module Coverage (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-T007 | Session Management Tests | Tests for T001-T004, T071-T075 (session dedup, crash recovery) |
| REQ-T008 | Search/Retrieval Tests | Tests for T020-T023, T028-T031, T036-T039, T048-T051 |
| REQ-T009 | Decay/Scoring Tests | Tests for T005-T008, T024-T027, T032-T035, T056-T059, T079-T083 |
| REQ-T010 | Graph/Relations Tests | Tests for T043-T047, T052-T055 |
| REQ-T011 | Infrastructure Tests | Tests for T009-T011, T012-T015, T016-T019, T040-T042, T060-T070 |
| REQ-T012 | Embedding Resilience Tests | Tests for T087-T107 |

### P2 - Quality Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-T013 | Edge Case Coverage | Each module has tests for boundary conditions |
| REQ-T014 | Error Handling Coverage | All error paths have dedicated tests |
| REQ-T015 | Performance Benchmarks | NFR-P01, NFR-P02, NFR-P03 validated with timing tests |
| REQ-T016 | Backward Compatibility | Legacy API tests verify no breaking changes |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Metric | Target | Measurement Method |
|----|--------|--------|-------------------|
| SC-T001 | Unit test coverage | >=80% | Istanbul/NYC coverage report |
| SC-T002 | Integration test coverage | >=70% | Coverage report for integration paths |
| SC-T003 | E2E test coverage | >=50% | Manual verification + journey mapping |
| SC-T004 | Test execution time | <60s for unit, <300s for integration | Test runner timing |
| SC-T005 | Test reliability | 100% consistent results | 10 consecutive runs without flakes |
| SC-T006 | P0 requirement coverage | 100% | Traceability matrix verification |
| SC-T007 | Bug detection rate | >90% | Mutation testing score |

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | R-T001: Flaky tests from timing issues | High | Use mocked timers, deterministic delays |
| Risk | R-T002: Database state leakage between tests | High | In-memory SQLite per test, cleanup hooks |
| Risk | R-T003: External API dependencies in tests | Medium | Mock embedding providers, offline-capable tests |
| Risk | R-T004: Test suite execution time bloat | Medium | Parallel test execution, selective test runs |
| Risk | R-T005: Coverage gaps in async code paths | Medium | Async-aware coverage tools, explicit async tests |
| Dependency | D-T001: 082-speckit-reimagined modules | Blocks all tests | All implementation must be complete |
| Dependency | D-T002: Test framework (Node.js built-in or Jest) | Blocks test execution | Verify framework availability |
| Dependency | D-T003: SQLite better-sqlite3 for test databases | Blocks DB tests | Include as dev dependency |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-T01**: Full unit test suite completes in <60 seconds
- **NFR-T02**: Full integration test suite completes in <300 seconds
- **NFR-T03**: Individual test case executes in <1 second (unit), <5 seconds (integration)
- **NFR-T04**: Test suite memory usage <512MB peak

### Test Quality

- **NFR-T05**: Zero flaky tests (100% reproducibility)
- **NFR-T06**: All tests must be isolated (no shared mutable state)
- **NFR-T07**: Clear test names following format: `should [behavior] when [condition]`
- **NFR-T08**: Each test validates exactly one behavior (single assertion principle relaxed for related assertions)

### Maintainability

- **NFR-T09**: Test code follows same style guidelines as production code
- **NFR-T10**: Test fixtures centralized in `tests/fixtures/` directory
- **NFR-T11**: Mock implementations in `tests/mocks/` directory
- **NFR-T12**: Test utilities in `tests/helpers/` directory

<!-- /ANCHOR:requirements -->
---

## 8. TEST CATEGORIES

### Category 1: Search Tests (W-R)

| Test Suite | Module | Tests | Priority |
|------------|--------|-------|----------|
| rrf-fusion.test.js | lib/search/rrf-fusion.js | 35 | P0 |
| bm25-index.test.js | lib/search/bm25-index.js | 25 | P0 |
| intent-classifier.test.js | lib/search/intent-classifier.js | 30 | P1 |
| fuzzy-match.test.js | lib/search/fuzzy-match.js | 40 | P1 |
| hybrid-search.test.js (extend) | lib/search/hybrid-search.js | 20 | P1 |

**Test Coverage Focus:**
- RRF fusion with k=60 parameter
- 10% convergence bonus for multi-source results
- BM25 tokenization and IDF calculation
- Intent detection accuracy (target: 80%)
- Fuzzy matching with Levenshtein distance <= 2
- Acronym expansion from ACRONYM_MAP

### Category 2: Decay & Scoring Tests (W-D)

| Test Suite | Module | Tests | Priority |
|------------|--------|-------|----------|
| tier-classifier.test.js (extend) | lib/cognitive/tier-classifier.js | 20 | P0 |
| five-factor-scoring.test.js (extend) | lib/scoring/composite-scoring.js | 15 | P0 |
| consolidation.test.js | lib/cognitive/consolidation.js | 45 | P1 |
| memory-types.test.js | lib/config/memory-types.js | 20 | P1 |

**Test Coverage Focus:**
- 9 memory types with distinct half-lives
- Type inference from file path and frontmatter
- 5-factor composite scoring formula
- Consolidation 5-phase pipeline (REPLAY, ABSTRACT, INTEGRATE, PRUNE, STRENGTHEN)
- State transitions: HOT -> WARM -> COLD -> DORMANT -> ARCHIVED

### Category 3: Session Tests (W-S)

| Test Suite | Module | Tests | Priority |
|------------|--------|-------|----------|
| session-manager.test.js | lib/session/session-manager.js | 50 | P0 |
| continue-session.test.js (extend) | lib/session/session-manager.js | 15 | P1 |
| crash-recovery.test.js (extend) | lib/session/session-manager.js | 10 | P1 |

**Test Coverage Focus:**
- Hash-based duplicate detection
- `shouldSendMemory()` and `markMemorySent()` behavior
- Session persistence to SQLite
- CONTINUE_SESSION.md generation
- Crash recovery with `_recovered` flag

### Category 4: Graph Tests (W-G)

| Test Suite | Module | Tests | Priority |
|------------|--------|-------|----------|
| causal-edges.test.js (extend) | lib/storage/causal-edges.js | 15 | P0 |
| corrections.test.js | lib/learning/corrections.js | 30 | P1 |

**Test Coverage Focus:**
- 6 relation types validation
- Causal chain traversal with depth limiting
- Cycle detection in graph traversal
- Correction recording with 0.5x stability penalty
- Replacement memory 1.2x stability boost

### Category 5: Infrastructure Tests (W-I)

| Test Suite | Module | Tests | Priority |
|------------|--------|-------|----------|
| envelope.test.js | lib/response/envelope.js | 25 | P0 |
| recovery-hints.test.js | lib/errors/recovery-hints.js | 20 | P0 |
| tool-cache.test.js (extend) | lib/cache/tool-cache.js | 15 | P1 |
| incremental-index.test.js | lib/storage/incremental-index.js | 20 | P1 |
| layer-definitions.test.js | lib/architecture/layer-definitions.js | 25 | P1 |
| memory-context.test.js | handlers/memory-context.js | 30 | P1 |
| transaction-manager.test.js (extend) | lib/storage/transaction-manager.js | 15 | P1 |
| preflight.test.js (extend) | lib/validation/preflight.js | 10 | P1 |

**Test Coverage Focus:**
- Response envelope structure validation
- Error code to recovery hint mapping
- Cache TTL and LRU eviction
- Content hash + mtime incremental indexing
- 7-layer token budget enforcement
- Atomic file save with rollback

### Category 6: Embedding Resilience Tests

| Test Suite | Module | Tests | Priority |
|------------|--------|-------|----------|
| provider-chain.test.js (extend) | lib/embeddings/provider-chain.js | 20 | P0 |
| api-key-validation.test.js (extend) | shared/embeddings/factory.js | 15 | P0 |
| retry.test.js (extend) | lib/utils/retry.js | 10 | P1 |

**Test Coverage Focus:**
- Fallback order: Primary -> Local -> BM25-only
- API key validation at startup
- Exponential backoff (1s, 2s, 4s)
- Permanent vs transient error classification
- Deferred indexing with embedding_status

### Category 7: Integration Tests

| Test Suite | Modules | Tests | Priority |
|------------|---------|-------|----------|
| search-pipeline.test.js | rrf-fusion, bm25, vector-index, cross-encoder | 40 | P0 |
| memory-lifecycle.test.js | memory-save, vector-index, archival-manager | 35 | P0 |
| session-workflow.test.js | session-manager, checkpoints, memory-search | 30 | P1 |

**Test Coverage Focus:**
- Complete search flow: query -> intent -> vector + BM25 -> RRF -> rerank -> filter
- Memory lifecycle: save -> index -> search -> access -> decay -> archive
- Session workflow: start -> dedup -> checkpoint -> crash -> recover

### Category 8: End-to-End Tests

| Test Suite | Workflow | Tests | Priority |
|------------|----------|-------|----------|
| full-workflow.test.js | Complete user journeys | 25 | P1 |

**Test Coverage Focus:**
- New memory creation and retrieval
- Session continuation after compaction
- Decision lineage tracing via causal graph
- Learning from corrections workflow

---

## 9. TEST EXECUTION PLAN

### Phase 1: Unit Tests (Week 1-2)

| Day | Test Files | Module Focus |
|-----|------------|--------------|
| 1-2 | session-manager.test.js | T001-T004 Session deduplication |
| 3-4 | rrf-fusion.test.js, bm25-index.test.js | T020-T031 Search |
| 5-6 | intent-classifier.test.js, fuzzy-match.test.js | T036-T039, T076-T078 |
| 7-8 | consolidation.test.js | T079-T083 Consolidation pipeline |
| 9-10 | envelope.test.js, recovery-hints.test.js, layer-definitions.test.js | T040-T042, T060-T063 |

### Phase 2: Integration Tests (Week 2-3)

| Day | Test Files | Integration Focus |
|-----|------------|-------------------|
| 11-12 | search-pipeline.test.js | Vector + BM25 + RRF + Rerank |
| 13-14 | memory-lifecycle.test.js | Save -> Index -> Search -> Archive |
| 15-16 | session-workflow.test.js | Session state management |

### Phase 3: E2E Tests (Week 3-4)

| Day | Test Files | E2E Focus |
|-----|------------|-----------|
| 17-18 | full-workflow.test.js | User journey tests |
| 19-20 | Coverage gaps, edge cases | Final coverage push |

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 16 new + 8 extend, LOC: 2000+, Modules: 12 |
| Risk | 15/25 | DB isolation: Y, Async complexity: Y, External mocks: Y |
| Research | 12/20 | Existing test patterns, coverage tools, mock strategies |
| Multi-Agent | 8/15 | Single workstream (testing), parallelizable by category |
| Coordination | 10/15 | Dependencies on 082 implementation, test data fixtures |
| **Total** | **63/100** | **Level 3+ appropriate for comprehensive test coverage** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

### Data Boundaries

- Empty query string -> graceful handling with default results
- Query > 10000 chars -> E040 error with truncation hint
- Zero search results -> empty array with suggestions
- Memory with no embeddings -> BM25-only search fallback

### Error Scenarios

- Database connection failure -> appropriate error code and recovery hint
- Embedding API timeout -> fallback to local or BM25-only
- Concurrent write conflicts -> transaction rollback and retry
- Corrupt memory file -> skip with warning, continue processing

### Concurrency

- Parallel session access -> isolated session state
- Concurrent memory saves -> transaction-safe indexing
- Background job conflicts -> job lock mechanism

<!-- /ANCHOR:edge-cases -->
---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Tech Lead | Pending | - |
| Unit Test Coverage Review | QA | Pending | - |
| Integration Test Review | Senior Engineer | Pending | - |
| Final Coverage Sign-off | Product Owner | Pending | - |

---

## 13. COMPLIANCE CHECKPOINTS

### Test Quality Compliance

- [ ] All tests follow naming convention: `should [behavior] when [condition]`
- [ ] No hardcoded paths (use path.join and __dirname)
- [ ] No time-dependent tests (use mocked timers)
- [ ] All async operations properly awaited
- [ ] Test database cleanup in afterEach hooks

### Coverage Compliance

- [ ] Unit coverage >= 80% verified via Istanbul/NYC
- [ ] Integration coverage >= 70% verified
- [ ] All P0 requirements have traceability to tests
- [ ] No untested public API methods

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Developer Users | End User | High | Test examples, coverage reports |
| OpenCode Team | Engineering | High | PR reviews, CI integration |
| QA | Quality | Critical | Coverage metrics, failure analysis |
| Product Owner | Product | Medium | Feature validation status |

---

## 15. CHANGE LOG

### v1.0 (2026-02-01)

**Initial specification**
- Defined test coverage targets: unit 80%+, integration 70%+, e2e 50%+
- Identified 16 new test files and 8 files to extend
- Established 8 test categories aligned with 082 workstreams
- Documented NFRs for test execution time and reliability
- Created 3-week execution plan

---

## 16. TEST FILE INVENTORY

### Existing Tests to Extend

| File | Current Tests | Tests to Add | Total |
|------|---------------|--------------|-------|
| tier-classifier.test.js | 78 | +20 | 98 |
| five-factor-scoring.test.js | 65 | +15 | 80 |
| causal-edges.test.js | 29 | +15 | 44 |
| cross-encoder.test.js | 22 | +10 | 32 |
| provider-chain.test.js | 28 | +20 | 48 |
| archival-manager.test.js | 32 | +10 | 42 |
| **Subtotal** | **254** | **+90** | **344** |

### New Test Files

| File | Tests | Category |
|------|-------|----------|
| session-manager.test.js | 50 | Session |
| rrf-fusion.test.js | 35 | Search |
| bm25-index.test.js | 25 | Search |
| intent-classifier.test.js | 30 | Search |
| fuzzy-match.test.js | 40 | Search |
| consolidation.test.js | 45 | Decay |
| memory-types.test.js | 20 | Decay |
| corrections.test.js | 30 | Graph |
| envelope.test.js | 25 | Infrastructure |
| recovery-hints.test.js | 20 | Infrastructure |
| layer-definitions.test.js | 25 | Infrastructure |
| memory-context.test.js | 30 | Infrastructure |
| incremental-index.test.js | 20 | Infrastructure |
| search-pipeline.test.js | 40 | Integration |
| memory-lifecycle.test.js | 35 | Integration |
| session-workflow.test.js | 30 | Integration |
| full-workflow.test.js | 25 | E2E |
| **Subtotal** | **525** | **New** |

### Total Test Count

| Category | Tests |
|----------|-------|
| Extended Existing | 344 |
| New Unit | 395 |
| New Integration | 105 |
| New E2E | 25 |
| **Grand Total** | **869** |

---

## RELATED DOCUMENTS

- **Parent Implementation**: See `../082-speckit-reimagined/spec.md`
- **Implementation Tasks**: See `../082-speckit-reimagined/tasks.md`
- **Feature Summary**: See `../082-speckit-reimagined/consolidated-analysis.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

---

## TRACEABILITY MATRIX

### P0 Requirements to Test Coverage

| Requirement | Test File(s) | Test IDs |
|-------------|--------------|----------|
| REQ-001 Session Deduplication | session-manager.test.js | T-SM-001 to T-SM-015 |
| REQ-002 Type-Specific Half-Lives | tier-classifier.test.js | T-TC-080 to T-TC-098 |
| REQ-003 Lazy Embedding Loading | provider-chain.test.js | T-PC-030 to T-PC-040 |
| REQ-004 Recovery Hints | recovery-hints.test.js | T-RH-001 to T-RH-020 |
| REQ-005 Usage Boost | five-factor-scoring.test.js | T-FF-066 to T-FF-080 |
| REQ-006 Intent-Aware Retrieval | intent-classifier.test.js | T-IC-001 to T-IC-030 |
| REQ-007 Tool Output Caching | tool-cache.test.js | T-TC-001 to T-TC-015 |
| REQ-008 Length Penalty | cross-encoder.test.js | T-CE-023 to T-CE-032 |
| REQ-010 5-State Memory Model | tier-classifier.test.js | T-TC-001 to T-TC-078 |
| REQ-011 RRF Search Fusion | rrf-fusion.test.js | T-RF-001 to T-RF-035 |
| REQ-012 Causal Memory Graph | causal-edges.test.js | T-CG-001 to T-CG-044 |
| REQ-029 API Key Validation | api-key-validation.test.js | T-AK-001 to T-AK-015 |
| REQ-030 Fallback Provider Chain | provider-chain.test.js | T-PC-001 to T-PC-048 |
| REQ-033 Memory Save Atomicity | transaction-manager.test.js | T-TM-001 to T-TM-015 |

---

<!--
LEVEL 3+ SPEC (~500 lines)
- Core + L2 + L3 + L3+ addendums
- Comprehensive test coverage for 082-speckit-reimagined
- 8 test categories, 869 total tests planned
- Coverage targets: Unit 80%+, Integration 70%+, E2E 50%+
- Traceability matrix for P0 requirements
- 3-week execution plan
-->
