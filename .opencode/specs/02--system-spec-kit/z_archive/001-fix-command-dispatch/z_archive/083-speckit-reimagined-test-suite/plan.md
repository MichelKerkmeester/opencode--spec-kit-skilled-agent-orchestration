---
title: "Implementation Plan: SpecKit Reimagined Test Suite [083-speckit-reimagined-test-suite/plan]"
description: "This test suite provides comprehensive coverage for the SpecKit Reimagined implementation (082-speckit-reimagined), covering all 33 features and 107 tasks across 5 workstreams. ..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "speckit"
  - "reimagined"
  - "test"
  - "083"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: SpecKit Reimagined Test Suite

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ES6+), Node.js 18+ |
| **Framework** | MCP Server (Model Context Protocol) |
| **Storage** | SQLite with FTS5, better-sqlite3 |
| **Testing** | Jest 29.x, node:test for unit tests |

### Overview

This test suite provides comprehensive coverage for the SpecKit Reimagined implementation (082-speckit-reimagined), covering all 33 features and 107 tasks across 5 workstreams. The suite is organized into 4 phases: Unit Tests (core algorithms and components), Integration Tests (cross-component workflows), E2E Tests (full MCP tool validation), and Coverage & Reporting (CI/CD integration). Given the complexity (85/100 from parent spec), this plan includes AI execution protocols for multi-agent test development.

**Test Coverage Targets:**
- Unit Tests: 95% line coverage for core algorithms
- Integration Tests: 85% coverage for cross-component flows
- E2E Tests: 100% coverage for 22 MCP tools
- Overall: 90% combined coverage

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Source implementation complete (082-speckit-reimagined all tasks done)
- [x] Feature specification reviewed (spec.md 33 features documented)
- [x] Test targets identified (107 tasks mapped to test cases)
- [x] Test framework configured (Jest 29.x installed)
- [x] Test database strategy defined (in-memory SQLite)

### Definition of Done
- [ ] All test files created and passing
- [ ] Coverage targets met (90%+ overall)
- [ ] CI/CD pipeline configured
- [ ] Test documentation complete
- [ ] Performance benchmarks established

---

## 3. ARCHITECTURE

### Pattern
Test Pyramid with Jest - Following standard Node.js testing patterns

### Key Components
- **Unit Tests** (`tests/unit/`): Individual function and class tests
- **Integration Tests** (`tests/integration/`): Cross-component workflow tests
- **E2E Tests** (`tests/e2e/`): Full MCP tool tests via handler invocation
- **Fixtures** (`tests/fixtures/`): Test data, mock memories, sample queries
- **Helpers** (`tests/helpers/`): Shared test utilities, database setup/teardown

### Test Directory Structure
```
mcp_server/tests/
├── unit/
│   ├── session/
│   │   └── session-manager.test.js
│   ├── search/
│   │   ├── rrf-fusion.test.js
│   │   ├── bm25-index.test.js
│   │   ├── hybrid-search.test.js
│   │   ├── intent-classifier.test.js
│   │   ├── fuzzy-match.test.js
│   │   └── cross-encoder.test.js
│   ├── decay/
│   │   ├── tier-classifier.test.js
│   │   ├── composite-scoring.test.js
│   │   ├── attention-decay.test.js
│   │   └── archival-manager.test.js
│   ├── graph/
│   │   ├── causal-edges.test.js
│   │   └── corrections.test.js
│   └── infra/
│       ├── preflight.test.js
│       ├── retry.test.js
│       ├── transaction-manager.test.js
│       └── provider-chain.test.js
├── integration/
│   ├── search-pipeline.test.js
│   ├── memory-lifecycle.test.js
│   └── session-recovery.test.js
├── e2e/
│   ├── mcp-tools.test.js
│   ├── multi-agent-workflow.test.js
│   └── performance-regression.test.js
├── fixtures/
│   ├── memories/
│   ├── queries/
│   └── sessions/
└── helpers/
    ├── db-setup.js
    ├── mock-providers.js
    └── test-utils.js
```

### Data Flow
```
Test Runner (Jest)
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                     Test Categories                          │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│   Unit      │ Integration │    E2E      │   Performance    │
│  (fastest)  │  (moderate) │  (slowest)  │   (benchmarks)   │
└──────┬──────┴──────┬──────┴──────┬──────┴────────┬─────────┘
       │             │             │               │
       ▼             ▼             ▼               ▼
   In-Memory     Test DB      Full MCP       Benchmark
   Functions     SQLite       Handlers        Runner
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Unit Tests (Weeks 1-2)

#### Week 1: Core Algorithm Tests

**Day 1-2: Session Management Tests**
- [ ] SessionManager class instantiation and lifecycle
- [ ] Hash-based duplicate tracking (`shouldSendMemory()`, `markMemorySent()`)
- [ ] Session persistence to SQLite
- [ ] CONTINUE_SESSION.md generation
- [ ] Crash recovery state management

**Day 3-4: Search Algorithm Tests**
- [ ] RRF fusion with k=60 parameter validation
- [ ] Convergence bonus calculation (10% for multi-source)
- [ ] Source tracking (vector, bm25, graph)
- [ ] BM25 index construction and querying
- [ ] BM25 document scoring with k1=1.2, b=0.75

**Day 5: Hybrid Search Tests**
- [ ] Vector + BM25 combination
- [ ] FTS5 integration
- [ ] Query expansion with fuzzy matching
- [ ] Intent classification accuracy

#### Week 2: Decay & Graph Tests

**Day 1-2: Decay Algorithm Tests**
- [ ] Tier classifier state thresholds (HOT>0.80, WARM, COLD, DORMANT, ARCHIVED)
- [ ] 9 memory type half-lives validation
- [ ] FSRS formula: `Math.pow(1 + 0.235 * (days/stability), -0.5)`
- [ ] 5-factor composite scoring weights

**Day 3-4: Scoring Component Tests**
- [ ] Temporal decay calculation
- [ ] Usage boost: `min(1.5, 1.0 + count * 0.05)`
- [ ] Citation recency: `1 / (1 + days * 0.1)`
- [ ] Pattern alignment detection
- [ ] Attention decay composites

**Day 5: Graph Algorithm Tests**
- [ ] Causal edge insertion with 6 relation types
- [ ] Depth-limited traversal (max 10, default 3)
- [ ] Cycle detection
- [ ] Corrections tracking with 0.5x stability penalty
- [ ] Replacement boost 1.2x

### Phase 2: Integration Tests (Week 3)

**Day 1-2: Search Pipeline Integration**
- [ ] Vector search -> RRF fusion -> reranking flow
- [ ] BM25 + FTS5 -> RRF fusion flow
- [ ] Graph boost integration with search results
- [ ] Intent-aware weight adjustment pipeline
- [ ] Cross-encoder reranking (top-20 candidates)

**Day 3: Memory Lifecycle Integration**
- [ ] Full save workflow: preflight -> write -> index -> respond
- [ ] Deferred indexing on embedding failure
- [ ] Background retry job execution
- [ ] Atomic save with rollback on failure
- [ ] Pending file recovery

**Day 4-5: Session Recovery Integration**
- [ ] Crash simulation -> state recovery
- [ ] Session interruption marking on startup
- [ ] CONTINUE_SESSION.md generation and parsing
- [ ] Multi-session isolation verification
- [ ] Session deduplication across queries

### Phase 3: E2E Tests (Week 4)

**Day 1-2: Core MCP Tool Tests (L1-L2)**
- [ ] `memory_context` (L1 Orchestration) - 5 modes
- [ ] `memory_search` (L2 Core) - full parameter matrix
- [ ] `memory_match_triggers` (L2 Core)
- [ ] `memory_save` (L2 Core) - with all options

**Day 3: Discovery & Mutation Tools (L3-L4)**
- [ ] `memory_list` (L3 Discovery)
- [ ] `memory_stats` (L3 Discovery)
- [ ] `memory_health` (L3 Discovery)
- [ ] `memory_delete` (L4 Mutation)
- [ ] `memory_update` (L4 Mutation)

**Day 4: Lifecycle & Analysis Tools (L5-L6)**
- [ ] `checkpoint_create` (L5 Lifecycle)
- [ ] `checkpoint_restore` (L5 Lifecycle)
- [ ] `memory_validate` (L5 Lifecycle)
- [ ] `memory_drift_why` (L6 Analysis)
- [ ] `memory_causal_link` (L6 Analysis)
- [ ] `memory_causal_stats` (L6 Analysis)

**Day 5: Multi-Agent & Performance**
- [ ] Multi-agent workflow simulation (3 concurrent agents)
- [ ] Workstream coordination test (W-S, W-R, W-D, W-G, W-I)
- [ ] Performance regression baseline establishment
- [ ] P95 latency validation (<150ms for queries)
- [ ] MCP startup time validation (<500ms)

### Phase 4: Coverage & Reporting (Week 5)

**Day 1-2: Coverage Analysis**
- [ ] Run full test suite with coverage collection
- [ ] Generate coverage reports (HTML, JSON, lcov)
- [ ] Identify coverage gaps
- [ ] Add missing tests for uncovered paths
- [ ] Verify 90%+ overall coverage target

**Day 3: Test Documentation**
- [ ] Test case documentation (what each test validates)
- [ ] Fixture documentation (data structure expectations)
- [ ] Helper function documentation
- [ ] Troubleshooting guide for common test failures

**Day 4-5: CI/CD Integration**
- [ ] GitHub Actions workflow configuration
- [ ] Test parallelization setup
- [ ] Coverage threshold enforcement
- [ ] Performance benchmark automation
- [ ] Test result reporting to PR comments

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Coverage Target | Run Time |
|-----------|-------|-------|-----------------|----------|
| Unit | Individual functions/classes | Jest, node:test | 95% | <30s |
| Integration | Cross-component flows | Jest, SQLite in-memory | 85% | <60s |
| E2E | Full MCP tool handlers | Jest, mock MCP client | 100% tools | <120s |
| Performance | Latency, throughput | custom benchmark | P95 <150ms | <60s |

### Test Categories by Feature

| Feature Group | Unit Tests | Integration Tests | E2E Tests |
|---------------|------------|-------------------|-----------|
| Session Management (T001-T004, T071-T075) | 25 | 10 | 5 |
| Search/Retrieval (T020-T031, T036-T039, T048-T051, T076-T078) | 50 | 15 | 8 |
| Decay & Scoring (T005-T008, T024-T027, T032-T035, T056-T059, T079-T083) | 40 | 12 | 5 |
| Graph/Relations (T043-T047, T052-T055) | 20 | 8 | 6 |
| Infrastructure (T009-T019, T040-T042, T060-T070, T084-T107) | 45 | 15 | 8 |
| **Total** | **180** | **60** | **32** |

### Test Data Strategy

**Fixtures:**
- 50 sample memory files with varied content
- 20 session state snapshots
- 100 search queries with expected results
- 10 causal graph structures
- 5 multi-agent workflow scenarios

**Mocks:**
- Embedding provider (returns consistent vectors)
- Cross-encoder (returns predetermined scores)
- File system (in-memory for speed)
- Database (SQLite in-memory mode)

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 082-speckit-reimagined | Internal | Green | Cannot test - no code |
| Jest 29.x | External | Green | Use node:test fallback |
| better-sqlite3 | External | Green | Critical - DB tests fail |
| Mock embedding provider | Internal | Yellow | Must create mocks first |
| CI/CD infrastructure | Internal | Green | Manual runs only |

---

## 7. ROLLBACK PLAN

- **Trigger**: Tests reveal critical bugs in implementation requiring fixes
- **Procedure**:
  1. Document failures in test suite
  2. Create bug tickets for 082-speckit-reimagined
  3. Pause test development on affected components
  4. Resume after fixes merged

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Unit Tests) ────────────────────────────────────────┐
       │                                                      │
       ├──────► Phase 2 (Integration) ──► Phase 3 (E2E) ────┴──► Phase 4 (Coverage)
       │              │                        │
       │              │                        │
       └──────────────┴────────────────────────┘
                 (can run in parallel where independent)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Unit | 082 implementation complete | Phase 2, Phase 3 |
| Phase 2: Integration | Phase 1 core tests | Phase 3 (partially) |
| Phase 3: E2E | Phase 1 + Phase 2 | Phase 4 |
| Phase 4: Coverage | Phase 1 + 2 + 3 | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort | Calendar Time |
|-------|------------|------------------|---------------|
| Phase 1: Unit Tests | High | 60 hours | Week 1-2 |
| Phase 2: Integration Tests | Medium | 24 hours | Week 3 |
| Phase 3: E2E Tests | Medium | 24 hours | Week 4 |
| Phase 4: Coverage & CI | Low | 20 hours | Week 5 |
| **Total** | | **128 hours (~16 days)** | **5 weeks** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All existing tests still pass
- [ ] No regressions in 082 implementation
- [ ] Test database cleanup verified
- [ ] CI/CD dry run successful

### Rollback Procedure
1. **Immediate**: Revert test commits if breaking CI
2. **Revert code**: `git revert HEAD~N` for test commits
3. **Verify**: Ensure no test artifacts pollute codebase
4. **Notify**: Post in #speckit-dev channel

### Data Reversal
- **Has data migrations?** No (tests use ephemeral DBs)
- **Reversal procedure**: Delete test databases, clear fixture caches

---

## L3: DEPENDENCY GRAPH

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Phase 1: Unit Tests                             │
├─────────────────┬─────────────────┬─────────────────┬──────────────────────┤
│   Session (W-S) │   Search (W-R)  │   Decay (W-D)   │   Graph (W-G)        │
│   T001-T004     │   T020-T031     │   T005-T008     │   T043-T047          │
│   T071-T075     │   T036-T039     │   T024-T027     │   T052-T055          │
│                 │   T048-T051     │   T032-T035     │                      │
│                 │   T076-T078     │   T056-T059     │                      │
│                 │                 │   T079-T083     │                      │
└────────┬────────┴────────┬────────┴────────┬────────┴──────────┬───────────┘
         │                 │                 │                   │
         │                 └─────────────────┼───────────────────┘
         │                                   │
         ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Phase 2: Integration Tests                          │
├─────────────────────────┬───────────────────────┬──────────────────────────┤
│   Search Pipeline       │   Memory Lifecycle    │   Session Recovery       │
│   (vector+BM25+graph)   │   (save→search→arch)  │   (crash→resume→cont)    │
└────────────┬────────────┴───────────┬───────────┴──────────────┬───────────┘
             │                        │                          │
             └────────────────────────┼──────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Phase 3: E2E Tests                                │
├─────────────────────────┬───────────────────────┬──────────────────────────┤
│   MCP Tools (22 tools)  │   Multi-Agent Sim     │   Performance Regression │
└────────────┬────────────┴───────────┬───────────┴──────────────┬───────────┘
             │                        │                          │
             └────────────────────────┼──────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Phase 4: Coverage & Reporting                         │
├─────────────────────────┬───────────────────────┬──────────────────────────┤
│   Coverage Analysis     │   Test Documentation  │   CI/CD Integration      │
└─────────────────────────┴───────────────────────┴──────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Unit: Session | None | Session test coverage | Integration: Recovery |
| Unit: Search | None | Search test coverage | Integration: Pipeline |
| Unit: Decay | None | Decay test coverage | Integration: Lifecycle |
| Unit: Graph | None | Graph test coverage | Integration: Pipeline |
| Integration: Pipeline | Unit: Search, Graph | Pipeline coverage | E2E: Tools |
| Integration: Lifecycle | Unit: Decay | Lifecycle coverage | E2E: Tools |
| Integration: Recovery | Unit: Session | Recovery coverage | E2E: Multi-agent |
| E2E: Tools | Integration: All | Tool coverage | Coverage: Analysis |
| E2E: Performance | Integration: All | Benchmarks | Coverage: CI/CD |
| Coverage: Analysis | E2E: All | Coverage report | None |
| Coverage: CI/CD | Coverage: Analysis | Pipeline | None |

---

## L3: CRITICAL PATH

1. **Unit: Search Tests** - 20 hours - CRITICAL (blocks Integration: Pipeline)
2. **Unit: Decay Tests** - 16 hours - CRITICAL (blocks Integration: Lifecycle)
3. **Integration: Search Pipeline** - 12 hours - CRITICAL (blocks E2E: Tools)
4. **E2E: MCP Tools** - 16 hours - CRITICAL (blocks Coverage)
5. **Coverage: Analysis** - 8 hours - CRITICAL (blocks CI/CD)
6. **Coverage: CI/CD** - 8 hours - CRITICAL (final deliverable)

**Total Critical Path**: 80 hours (~10 working days)

**Parallel Opportunities**:
- Unit: Session, Search, Decay, Graph can all run in parallel (Week 1-2)
- Unit: Infrastructure tests can run in parallel with core algorithm tests
- E2E: Multi-agent and Performance can run in parallel with MCP Tool tests

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Unit Tests Complete | 180 unit tests passing, 95% coverage | Week 2 EOD |
| M2 | Integration Complete | 60 integration tests passing, 85% coverage | Week 3 EOD |
| M3 | E2E Complete | All 22 MCP tools tested, 100% tool coverage | Week 4 EOD |
| M4 | Coverage Met | 90%+ overall coverage | Week 5 Day 2 |
| M5 | CI/CD Live | All tests run automatically on PR | Week 5 EOD |

---

## L3: ARCHITECTURE DECISION SUMMARY

### ADR-001: Jest Over Node:test

**Status**: Accepted

**Context**: Need a test framework with good coverage reporting, parallel execution, and ecosystem support.

**Decision**: Use Jest 29.x as primary test framework.

**Consequences**:
- Positive: Rich assertion library, coverage built-in, parallel execution
- Negative: Slower startup than node:test (mitigated by watch mode)

### ADR-002: In-Memory SQLite for Tests

**Status**: Accepted

**Context**: Tests need database but should be fast and isolated.

**Decision**: Use SQLite in-memory mode (`:memory:`) for all test databases.

**Consequences**:
- Positive: Fast, no disk I/O, perfect isolation between tests
- Negative: Cannot test persistence edge cases (mitigated by specific file-based tests)

### ADR-003: Mock Embedding Provider

**Status**: Accepted

**Context**: Real embedding calls are slow and require API keys.

**Decision**: Create mock embedding provider returning consistent deterministic vectors.

**Consequences**:
- Positive: Fast tests, no API dependency, deterministic results
- Negative: Doesn't test real embedding quality (covered by manual validation)

---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation (Primary Agent)
**Files**: spec.md, plan.md, tests/helpers/*.js
**Duration**: ~90s
**Agent**: Primary
**Tasks**: Initial setup, test helper creation, fixture preparation

### Tier 2: Parallel Test Development
| Agent | Focus | Files | Duration |
|-------|-------|-------|----------|
| Search Agent | Search tests | tests/unit/search/*.js | ~180s |
| Decay Agent | Decay tests | tests/unit/decay/*.js | ~150s |
| Session Agent | Session tests | tests/unit/session/*.js | ~120s |
| Graph Agent | Graph tests | tests/unit/graph/*.js | ~100s |
| Infra Agent | Infra tests | tests/unit/infra/*.js | ~120s |

**Sync Point**: SYNC-001 after all unit tests complete

### Tier 3: Integration Testing (Primary Agent)
**Agent**: Primary + Integration Agent
**Task**: Create integration tests, verify cross-component flows
**Duration**: ~180s

**Sync Point**: SYNC-002 after integration tests

### Tier 4: E2E & Finalization (Primary Agent)
**Agent**: Primary
**Task**: E2E tests, coverage analysis, CI/CD setup
**Duration**: ~240s

---

## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Test Files | Status |
|----|------|-------|------------|--------|
| W-TS | Session Tests | Session Agent | tests/unit/session/*.js | Pending |
| W-TR | Search Tests | Search Agent | tests/unit/search/*.js | Pending |
| W-TD | Decay Tests | Decay Agent | tests/unit/decay/*.js | Pending |
| W-TG | Graph Tests | Graph Agent | tests/unit/graph/*.js | Pending |
| W-TI | Infra Tests | Infra Agent | tests/unit/infra/*.js | Pending |
| W-INT | Integration Tests | Primary | tests/integration/*.js | Blocked on W-T* |
| W-E2E | E2E Tests | Primary | tests/e2e/*.js | Blocked on W-INT |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | All W-T* complete | All unit test agents | Unit test baseline |
| SYNC-002 | W-INT complete | Primary + Integration | Integration baseline |
| SYNC-003 | W-E2E complete | All agents | Full test suite |
| SYNC-004 | Coverage analyzed | Primary | Final report |

### File Ownership Rules
- Each test file owned by ONE workstream
- Cross-workstream test dependencies documented in helpers/
- Shared fixtures in fixtures/ (read-only for test agents)
- Conflicts resolved at sync points

---

## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per Test File**: Update tasks.md with test count
- **Per Phase**: Coverage report generated
- **Daily**: Progress summary to stakeholders
- **Blockers**: Immediate escalation if implementation bugs found

### Escalation Path
1. Test failures revealing bugs -> 082 spec folder for fixes
2. Coverage gaps -> Additional test development
3. Performance issues -> Architecture review
4. CI/CD issues -> DevOps team

### Test Mapping to 082 Tasks

| 082 Task Range | Test Category | Priority |
|----------------|---------------|----------|
| T001-T004 | Session deduplication | P0 |
| T005-T008 | Type-specific half-lives | P0 |
| T009-T011 | Recovery hints | P0 |
| T012-T015 | Tool output caching | P0 |
| T016-T019 | Lazy embedding loading | P0 |
| T020-T023 | RRF fusion | P1 |
| T024-T027 | Usage boost | P1 |
| T028-T031 | BM25 hybrid | P1 |
| T032-T035 | Multi-factor composite | P1 |
| T036-T039 | Intent-aware retrieval | P1 |
| T040-T042 | Standardized responses | P1 |
| T043-T047 | Causal memory graph | P1 |
| T048-T051 | Cross-encoder reranking | P1 |
| T052-T055 | Learning from corrections | P1 |
| T056-T059 | 5-state memory model | P1 |
| T060-T063 | Layered tools | P1 |
| T064-T070 | Incremental indexing, preflight | P1 |
| T071-T075 | Crash recovery | P0 |
| T076-T078 | Fuzzy matching | P1 |
| T079-T083 | Consolidation pipeline | P1 |
| T084-T086 | Protocol abstractions | P1 |
| T087-T107 | Embedding resilience | P0 |
| T108-T126 | Template & commands | P1 |

---

## TEST CASE INVENTORY

### Unit Test Cases (180 total)

#### Session Management (25 tests)
| Test ID | Description | Task Ref |
|---------|-------------|----------|
| UT-S001 | SessionManager instantiation | T001 |
| UT-S002 | Hash generation for memory IDs | T001 |
| UT-S003 | shouldSendMemory returns true for new memory | T002 |
| UT-S004 | shouldSendMemory returns false for sent memory | T002 |
| UT-S005 | markMemorySent updates tracking | T002 |
| UT-S006 | Session persistence to SQLite | T003 |
| UT-S007 | Session recovery from SQLite | T003 |
| UT-S008 | Session integration in memory_search | T004 |
| UT-S009 | Token savings calculation | T004 |
| UT-S010 | generateContinueSessionMd output format | T071 |
| UT-S011 | CONTINUE_SESSION.md content completeness | T071 |
| UT-S012 | Checkpoint triggers MD generation | T072 |
| UT-S013 | session_state table creation | T073 |
| UT-S014 | Session status tracking (active/completed/interrupted) | T073 |
| UT-S015 | resetInterruptedSessions on startup | T074 |
| UT-S016 | recoverState with _recovered flag | T075 |
| UT-S017 | getInterruptedSessions list | T075 |
| UT-S018 | Session isolation between clients | T073 |
| UT-S019 | Session TTL expiration (30min) | T073 |
| UT-S020 | Session cap enforcement (100 entries) | T073 |
| UT-S021 | checkpointSession combines save + MD | T072 |
| UT-S022 | State persistence on crash | T073 |
| UT-S023 | Recovery continuation validation | T075 |
| UT-S024 | Session dedup savings metrics | T004 |
| UT-S025 | Session fingerprint hash generation | T001 |

#### Search Algorithm Tests (50 tests)
| Test ID | Description | Task Ref |
|---------|-------------|----------|
| UT-R001 | RRF fusion with default k=60 | T020 |
| UT-R002 | RRF formula: 1/(k + rank) | T020 |
| UT-R003 | Source tracking (vector, bm25, graph) | T021 |
| UT-R004 | Per-source rank position tracking | T021 |
| UT-R005 | Convergence bonus 10% for 2+ sources | T022 |
| UT-R006 | Convergence bonus formula validation | T022 |
| UT-R007 | unified_search entry point | T023 |
| UT-R008 | Single-source optimization bypass | T023 |
| UT-R009 | BM25 index construction | T029 |
| UT-R010 | BM25 tokenization | T029 |
| UT-R011 | BM25 Porter stemmer subset | T029 |
| UT-R012 | BM25 IDF calculation | T029 |
| UT-R013 | BM25 k1=1.2 parameter | T029 |
| UT-R014 | BM25 b=0.75 parameter | T029 |
| UT-R015 | BM25 document indexing | T030 |
| UT-R016 | BM25 metadata attachment | T030 |
| UT-R017 | BM25 + RRF integration | T031 |
| UT-R018 | combined_lexical_search FTS5 + BM25 | T031 |
| UT-R019 | Intent type: add_feature | T036 |
| UT-R020 | Intent type: fix_bug | T036 |
| UT-R021 | Intent type: refactor | T036 |
| UT-R022 | Intent type: security_audit | T036 |
| UT-R023 | Intent type: understand | T036 |
| UT-R024 | classify_intent keyword matching | T037 |
| UT-R025 | classify_intent pattern matching | T037 |
| UT-R026 | classify_intent confidence scoring | T037 |
| UT-R027 | detect_intent quick helper | T037 |
| UT-R028 | Intent weight adjustments per type | T038 |
| UT-R029 | apply_intent_weights merging | T038 |
| UT-R030 | get_query_weights full pipeline | T038 |
| UT-R031 | memory_search intent parameter | T039 |
| UT-R032 | autoDetectIntent default true | T039 |
| UT-R033 | Cross-encoder provider config | T048 |
| UT-R034 | Voyage rerank-2 integration | T048 |
| UT-R035 | Cross-encoder cache key generation | T049 |
| UT-R036 | Cross-encoder cache TTL (5min) | T049 |
| UT-R037 | Cross-encoder P95 tracking | T049 |
| UT-R038 | Length penalty threshold=100 | T050 |
| UT-R039 | Length penalty minPenalty=0.8 | T050 |
| UT-R040 | Length penalty linear interpolation | T050 |
| UT-R041 | Reranking top-20 candidates | T051 |
| UT-R042 | Reranking preserves raw score | T051 |
| UT-R043 | Levenshtein distance calculation | T076 |
| UT-R044 | is_fuzzy_match with max_distance=2 | T076 |
| UT-R045 | ACRONYM_MAP 50+ entries | T077 |
| UT-R046 | Acronym expansion (RRF, BM25, FSRS) | T077 |
| UT-R047 | Stop words filtering | T077 |
| UT-R048 | expand_query_with_fuzzy options | T078 |
| UT-R049 | Fuzzy match typo corrections | T078 |
| UT-R050 | ENABLE_FUZZY_MATCH feature flag | T078 |

#### Decay & Scoring Tests (40 tests)
| Test ID | Description | Task Ref |
|---------|-------------|----------|
| UT-D001 | 9 memory types defined | T005 |
| UT-D002 | working type half-life (1d) | T005 |
| UT-D003 | episodic type half-life (7d) | T005 |
| UT-D004 | prospective type half-life (14d) | T005 |
| UT-D005 | implicit type half-life (30d) | T005 |
| UT-D006 | declarative type half-life (60d) | T005 |
| UT-D007 | procedural type half-life (90d) | T005 |
| UT-D008 | semantic type half-life (180d) | T005 |
| UT-D009 | autobiographical type half-life (365d) | T005 |
| UT-D010 | meta-cognitive type (no decay) | T005 |
| UT-D011 | memory_type column schema | T006 |
| UT-D012 | Type inference from path | T007 |
| UT-D013 | Type inference from frontmatter | T007 |
| UT-D014 | Type inference confidence | T007 |
| UT-D015 | tier-classifier type-specific half-lives | T008 |
| UT-D016 | get_effective_half_life priority | T008 |
| UT-D017 | STATE_THRESHOLDS HOT>0.80 | T056 |
| UT-D018 | STATE_THRESHOLDS WARM | T056 |
| UT-D019 | STATE_THRESHOLDS COLD | T056 |
| UT-D020 | STATE_THRESHOLDS DORMANT | T056 |
| UT-D021 | STATE_THRESHOLDS ARCHIVED | T056 |
| UT-D022 | classifyState function | T057 |
| UT-D023 | filter_by_memory_state in search | T058 |
| UT-D024 | minState/applyStateLimits params | T058 |
| UT-D025 | Automatic archival detection | T059 |
| UT-D026 | Protected tiers (constitutional) | T059 |
| UT-D027 | Archival background job | T059 |
| UT-D028 | access_count column exists | T024 |
| UT-D029 | last_accessed_at timestamp | T025 |
| UT-D030 | Usage boost formula validation | T026 |
| UT-D031 | Usage boost cap at 1.5x | T026 |
| UT-D032 | memory_search increments access_count | T027 |
| UT-D033 | 5-factor composite score | T032 |
| UT-D034 | Temporal weight 0.25 | T032 |
| UT-D035 | Usage weight 0.15 | T032 |
| UT-D036 | Importance weight 0.25 | T032 |
| UT-D037 | Pattern weight 0.20 | T032 |
| UT-D038 | Citation weight 0.15 | T032 |
| UT-D039 | Citation recency calculation | T033 |
| UT-D040 | Pattern alignment detection | T034 |

#### Graph Algorithm Tests (20 tests)
| Test ID | Description | Task Ref |
|---------|-------------|----------|
| UT-G001 | causal_edges table schema | T043 |
| UT-G002 | Relation type: caused | T044 |
| UT-G003 | Relation type: enabled | T044 |
| UT-G004 | Relation type: supersedes | T044 |
| UT-G005 | Relation type: contradicts | T044 |
| UT-G006 | Relation type: derived_from | T044 |
| UT-G007 | Relation type: supports | T044 |
| UT-G008 | Edge insertion validation | T045 |
| UT-G009 | Edge strength bounds (0-1) | T045 |
| UT-G010 | Self-referential edge prevention | T045 |
| UT-G011 | get_causal_chain default depth=3 | T046 |
| UT-G012 | get_causal_chain max depth=10 | T046 |
| UT-G013 | Direction: outgoing | T046 |
| UT-G014 | Direction: incoming | T046 |
| UT-G015 | Direction: both | T046 |
| UT-G016 | Cycle detection | T046 |
| UT-G017 | memory_drift_why tool | T047 |
| UT-G018 | memory_corrections table | T052 |
| UT-G019 | 0.5x stability penalty | T053 |
| UT-G020 | 1.2x replacement boost | T055 |

#### Infrastructure Tests (45 tests)
| Test ID | Description | Task Ref |
|---------|-------------|----------|
| UT-I001 | Error catalog creation | T009 |
| UT-I002 | 49 error codes defined | T009 |
| UT-I003 | getRecoveryHint function | T010 |
| UT-I004 | Tool-specific hints override | T010 |
| UT-I005 | DEFAULT_HINT fallback | T010 |
| UT-I006 | Recovery hints in 22 tools | T011 |
| UT-I007 | Tool cache 60s TTL | T012 |
| UT-I008 | Cache max 1000 entries | T012 |
| UT-I009 | LRU-style eviction | T012 |
| UT-I010 | generate_cache_key SHA-256 | T013 |
| UT-I011 | canonicalize_args sorting | T013 |
| UT-I012 | Cache bypass option | T014 |
| UT-I013 | Cache invalidation on write | T015 |
| UT-I014 | Lazy singleton pattern | T016 |
| UT-I015 | Deferred model init | T017 |
| UT-I016 | SPECKIT_EAGER_WARMUP env var | T018 |
| UT-I017 | vector-index lazy provider | T019 |
| UT-I018 | Response envelope structure | T040 |
| UT-I019 | createSuccessResponse | T040 |
| UT-I020 | createErrorResponse | T040 |
| UT-I021 | MCP response wrappers | T040 |
| UT-I022 | 21 tools standardized | T041 |
| UT-I023 | Recovery hints in errors | T042 |
| UT-I024 | 7-layer architecture | T060 |
| UT-I025 | Layer token budgets | T060 |
| UT-I026 | memory_context unified entry | T061 |
| UT-I027 | 5 context modes | T061 |
| UT-I028 | L3 Discovery layer tools | T062 |
| UT-I029 | Layer info in descriptions | T063 |
| UT-I030 | Content hash tracking | T064 |
| UT-I031 | mtime tracking | T064 |
| UT-I032 | should_reindex function | T065 |
| UT-I033 | Incremental mode in scan | T066 |
| UT-I034 | Preflight validation framework | T067 |
| UT-I035 | ANCHOR format validation | T068 |
| UT-I036 | Duplicate check before save | T069 |
| UT-I037 | Token budget estimation | T070 |
| UT-I038 | IVectorStore interface | T084 |
| UT-I039 | IEmbeddingProvider interface | T085 |
| UT-I040 | EmbeddingProviderChain class | T091 |
| UT-I041 | Fallback chain ordering | T091 |
| UT-I042 | BM25-only mode fallback | T094 |
| UT-I043 | retryWithBackoff utility | T101 |
| UT-I044 | Transient error retry | T102 |
| UT-I045 | Permanent error fail-fast | T103 |

### Integration Test Cases (60 total)

| Test ID | Description | Phase 2 Focus |
|---------|-------------|---------------|
| IT-001 | Vector search -> RRF fusion | Search Pipeline |
| IT-002 | BM25 search -> RRF fusion | Search Pipeline |
| IT-003 | Graph search -> RRF fusion | Search Pipeline |
| IT-004 | 3-source RRF with convergence | Search Pipeline |
| IT-005 | Intent detection -> weight adjustment | Search Pipeline |
| IT-006 | Cross-encoder reranking integration | Search Pipeline |
| IT-007 | Length penalty application | Search Pipeline |
| IT-008 | Fuzzy expansion in search | Search Pipeline |
| IT-009 | BM25 + FTS5 combined | Search Pipeline |
| IT-010 | Full hybrid search flow | Search Pipeline |
| ... | (50 more integration tests) | ... |

### E2E Test Cases (32 total)

| Test ID | Tool | Description |
|---------|------|-------------|
| E2E-001 | memory_context | Mode: auto |
| E2E-002 | memory_context | Mode: quick |
| E2E-003 | memory_context | Mode: deep |
| E2E-004 | memory_context | Mode: focused |
| E2E-005 | memory_context | Mode: resume |
| E2E-006 | memory_search | Full parameter test |
| E2E-007 | memory_search | With intent detection |
| E2E-008 | memory_search | With reranking |
| E2E-009 | memory_match_triggers | Trigger matching |
| E2E-010 | memory_save | Full save flow |
| E2E-011 | memory_save | Deferred indexing |
| E2E-012 | memory_list | List with filters |
| E2E-013 | memory_stats | Statistics generation |
| E2E-014 | memory_health | Health check |
| E2E-015 | memory_delete | Deletion flow |
| E2E-016 | memory_update | Update flow |
| E2E-017 | checkpoint_create | Create checkpoint |
| E2E-018 | checkpoint_list | List checkpoints |
| E2E-019 | checkpoint_restore | Restore checkpoint |
| E2E-020 | checkpoint_delete | Delete checkpoint |
| E2E-021 | memory_validate | Validation flow |
| E2E-022 | memory_drift_why | Causal chain |
| E2E-023 | memory_causal_link | Create link |
| E2E-024 | memory_causal_stats | Graph stats |
| E2E-025 | memory_causal_unlink | Remove link |
| E2E-026 | task_preflight | Preflight validation |
| E2E-027 | task_postflight | Postflight processing |
| E2E-028 | memory_get_learning_history | Learning history |
| E2E-029 | memory_index_scan | Full index scan |
| E2E-030 | Multi-agent workflow | 3 concurrent agents |
| E2E-031 | Performance: query latency | P95 <150ms |
| E2E-032 | Performance: startup time | <500ms |

---

## CROSS-REFERENCES

- **Parent Specification**: See `../082-speckit-reimagined/spec.md`
- **Parent Tasks**: See `../082-speckit-reimagined/tasks.md`
- **Implementation**: See `../../.opencode/skill/system-spec-kit/mcp_server/`
- **Existing Tests**: See `../../.opencode/skill/system-spec-kit/mcp_server/tests/`

---

<!--
LEVEL 3+ PLAN (~750 lines)
- Comprehensive test suite for 33 features, 107 tasks
- 4 phases: Unit (180), Integration (60), E2E (32), Coverage
- 5 weeks implementation timeline
- AI execution framework for multi-agent test development
- Full test case inventory with task references
- Coverage targets: 95% unit, 85% integration, 100% tools, 90% overall
-->
