---
title: "Verification Checklist: SpecKit Reimagined Test Suite [083-speckit-reimagined-test-suite/checklist]"
description: "When marking items complete, include evidence references using this format"
trigger_phrases:
  - "verification"
  - "checklist"
  - "speckit"
  - "reimagined"
  - "test"
  - "083"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: SpecKit Reimagined Test Suite

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3plus-govern | v2.0 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## Evidence Documentation

When marking items complete, include evidence references using this format:
- `[E:test-file.test.js]` - Test file reference
- `[E:coverage:XX%]` - Jest coverage percentage
- `[E:pass:X/Y]` - Test pass ratio (X passing of Y total)
- `[E:commit:abc1234]` - Git commit reference
- `[E:run:YYYY-MM-DD]` - Test run date

Example: `- [x] CHK-001: Session manager unit tests complete [E:session-manager.test.js] [E:pass:25/25] [E:coverage:85%]`

---

## Test Verification Requirements

**Coverage Targets:**
- Unit tests: 80%+ line coverage per module
- Integration tests: 70%+ branch coverage
- E2E tests: 50%+ critical path coverage
- No flaky tests: 3+ consecutive passes required

**Test Infrastructure:**
- Framework: Node.js built-in test runner or Jest
- Location: `mcp_server/tests/`
- Naming: `*.test.js` convention

---

## P0 REQUIREMENTS: Unit Test Coverage (CHK-001 to CHK-050)

### Session Management Module

| ID | Check | Test File | Coverage Target | Status |
|----|-------|-----------|-----------------|--------|
| CHK-001 | SessionManager class unit tests | `crash-recovery.test.js` | 80% | [ ] |
| CHK-002 | `shouldSendMemory()` tests with hash collisions | `crash-recovery.test.js` | 80% | [ ] |
| CHK-003 | `markMemorySent()` persistence tests | `crash-recovery.test.js` | 80% | [ ] |
| CHK-004 | Session TTL expiration tests | `crash-recovery.test.js` | 80% | [ ] |
| CHK-005 | `resetInterruptedSessions()` tests | `crash-recovery.test.js` | 80% | [ ] |
| CHK-006 | `recoverState()` with _recovered flag tests | `crash-recovery.test.js` | 80% | [ ] |
| CHK-007 | CONTINUE_SESSION.md generation tests | `continue-session.test.js` | 80% | [ ] |
| CHK-008 | Session state persistence to SQLite | `crash-recovery.test.js` | 80% | [ ] |

### Decay & Scoring Module

| ID | Check | Test File | Coverage Target | Status |
|----|-------|-----------|-----------------|--------|
| CHK-009 | FSRS retrievability formula tests | `fsrs-scheduler.test.js` | 80% | [ ] |
| CHK-010 | Type-specific half-life calculations | `tier-classifier.test.js` | 80% | [ ] |
| CHK-011 | 5-state memory model (HOT/WARM/COLD/DORMANT/ARCHIVED) | `tier-classifier.test.js` | 80% | [ ] |
| CHK-012 | `calculate_retrievability()` boundary tests | `attention-decay.test.js` | 80% | [ ] |
| CHK-013 | Stability calculation tests | `fsrs-scheduler.test.js` | 80% | [ ] |
| CHK-014 | Difficulty factor tests | `fsrs-scheduler.test.js` | 80% | [ ] |
| CHK-015 | Five-factor composite scoring | `five-factor-scoring.test.js` | 80% | [ ] |
| CHK-016 | Temporal decay factor tests | `composite-scoring.test.js` | 80% | [ ] |
| CHK-017 | Usage boost factor tests | `composite-scoring.test.js` | 80% | [ ] |
| CHK-018 | Importance multiplier tests | `composite-scoring.test.js` | 80% | [ ] |
| CHK-019 | Pattern alignment detection tests | `composite-scoring.test.js` | 80% | [ ] |
| CHK-020 | Citation recency scoring tests | `composite-scoring.test.js` | 80% | [ ] |

### Search & Retrieval Module

| ID | Check | Test File | Coverage Target | Status |
|----|-------|-----------|-----------------|--------|
| CHK-021 | RRF fusion with k=60 tests | `memory-search-integration.test.js` | 80% | [ ] |
| CHK-022 | Convergence bonus (10%) calculation | `memory-search-integration.test.js` | 80% | [ ] |
| CHK-023 | Graph weight boost (1.5x) tests | `memory-search-integration.test.js` | 80% | [ ] |
| CHK-024 | BM25 scoring algorithm tests | `memory-search-integration.test.js` | 80% | [ ] |
| CHK-025 | FTS5 + BM25 hybrid tests | `memory-search-integration.test.js` | 80% | [ ] |
| CHK-026 | Intent classifier unit tests | `intent-classifier.test.js` | 80% | [ ] |
| CHK-027 | Query weight adjustments by intent | `intent-classifier.test.js` | 80% | [ ] |
| CHK-028 | Cross-encoder reranking tests | `cross-encoder.test.js` | 80% | [ ] |
| CHK-029 | Length penalty calculation tests | `cross-encoder.test.js` | 80% | [ ] |
| CHK-030 | P95 latency threshold auto-disable | `cross-encoder.test.js` | 80% | [ ] |
| CHK-031 | Fuzzy match Levenshtein distance | `fuzzy-match.test.js` | 80% | [ ] |
| CHK-032 | ACRONYM_MAP expansion tests | `fuzzy-match.test.js` | 80% | [ ] |
| CHK-033 | Query expansion with typo correction | `fuzzy-match.test.js` | 80% | [ ] |

### Infrastructure Module

| ID | Check | Test File | Coverage Target | Status |
|----|-------|-----------|-----------------|--------|
| CHK-034 | Tool cache with 60s TTL | `tool-cache.test.js` | 80% | [ ] |
| CHK-035 | Cache key generation tests | `tool-cache.test.js` | 80% | [ ] |
| CHK-036 | Cache invalidation on write | `tool-cache.test.js` | 80% | [ ] |
| CHK-037 | Preflight ANCHOR validation | `preflight.test.js` | 80% | [ ] |
| CHK-038 | Duplicate detection tests | `preflight.test.js` | 80% | [ ] |
| CHK-039 | Token budget estimation tests | `preflight.test.js` | 80% | [ ] |
| CHK-040 | Incremental indexing mtime check | `incremental-index.test.js` | 80% | [ ] |
| CHK-041 | Content hash computation tests | `incremental-index.test.js` | 80% | [ ] |
| CHK-042 | `shouldReindex()` decision logic | `incremental-index.test.js` | 80% | [ ] |

### Embedding Resilience Module

| ID | Check | Test File | Coverage Target | Status |
|----|-------|-----------|-----------------|--------|
| CHK-043 | API key validation tests | `api-key-validation.test.js` | 80% | [ ] |
| CHK-044 | Provider fallback chain tests | `provider-chain.test.js` | 80% | [ ] |
| CHK-045 | Retry with exponential backoff | `retry.test.js` | 80% | [ ] |
| CHK-046 | Transient vs permanent error classification | `retry.test.js` | 80% | [ ] |
| CHK-047 | Transaction manager atomicity | `transaction-manager.test.js` | 80% | [ ] |
| CHK-048 | File rollback on index failure | `transaction-manager.test.js` | 80% | [ ] |
| CHK-049 | Pending file recovery tests | `transaction-manager.test.js` | 80% | [ ] |
| CHK-050 | BM25-only fallback mode tests | `provider-chain.test.js` | 80% | [ ] |

---

## P1 REQUIREMENTS: Integration Test Coverage (CHK-051 to CHK-100)

### Search Pipeline Integration

| ID | Check | Test File | Coverage Target | Status |
|----|-------|-----------|-----------------|--------|
| CHK-051 | Vector + BM25 + FTS5 combined search | `memory-search-integration.test.js` | 70% | [ ] |
| CHK-052 | RRF fusion end-to-end | `memory-search-integration.test.js` | 70% | [ ] |
| CHK-053 | Intent detection -> weight adjustment flow | `memory-search-integration.test.js` | 70% | [ ] |
| CHK-054 | Cross-encoder reranking integration | `memory-search-integration.test.js` | 70% | [ ] |
| CHK-055 | Session deduplication in search results | `memory-search-integration.test.js` | 70% | [ ] |
| CHK-056 | Cache hit/miss scenarios | `memory-search-integration.test.js` | 70% | [ ] |
| CHK-057 | Query expansion with acronyms | `memory-search-integration.test.js` | 70% | [ ] |
| CHK-058 | Empty query handling | `memory-search-integration.test.js` | 70% | [ ] |
| CHK-059 | Large result set pagination | `memory-search-integration.test.js` | 70% | [ ] |
| CHK-060 | Multi-anchor search filtering | `memory-search-integration.test.js` | 70% | [ ] |

### Memory Lifecycle Integration

| ID | Check | Test File | Coverage Target | Status |
|----|-------|-----------|-----------------|--------|
| CHK-061 | Memory save with embedding success | `memory-save-integration.test.js` | 70% | [ ] |
| CHK-062 | Memory save with deferred indexing | `memory-save-integration.test.js` | 70% | [ ] |
| CHK-063 | Preflight validation -> save flow | `memory-save-integration.test.js` | 70% | [ ] |
| CHK-064 | Type inference during indexing | `memory-save-integration.test.js` | 70% | [ ] |
| CHK-065 | Causal link extraction on save | `memory-save-integration.test.js` | 70% | [ ] |
| CHK-066 | BM25 index update on save | `memory-save-integration.test.js` | 70% | [ ] |
| CHK-067 | Memory update with re-indexing | `memory-save-integration.test.js` | 70% | [ ] |
| CHK-068 | Memory delete with index cleanup | `memory-save-integration.test.js` | 70% | [ ] |
| CHK-069 | Atomic file + index transaction | `memory-save-integration.test.js` | 70% | [ ] |
| CHK-070 | Response envelope structure validation | `memory-save-integration.test.js` | 70% | [ ] |

### Session Recovery Integration

| ID | Check | Test File | Coverage Target | Status |
|----|-------|-----------|-----------------|--------|
| CHK-071 | Crash recovery flow end-to-end | `crash-recovery.test.js` | 70% | [ ] |
| CHK-072 | Session state persistence + recovery | `crash-recovery.test.js` | 70% | [ ] |
| CHK-073 | CONTINUE_SESSION.md generation + parsing | `continue-session.test.js` | 70% | [ ] |
| CHK-074 | Interrupted session reactivation | `crash-recovery.test.js` | 70% | [ ] |
| CHK-075 | Session dedup state restoration | `crash-recovery.test.js` | 70% | [ ] |

### Causal Graph Integration

| ID | Check | Test File | Coverage Target | Status |
|----|-------|-----------|-----------------|--------|
| CHK-076 | Edge insertion with validation | `causal-edges.test.js` | 70% | [ ] |
| CHK-077 | Causal chain traversal depth limiting | `causal-edges.test.js` | 70% | [ ] |
| CHK-078 | Cycle detection in graph traversal | `causal-edges.test.js` | 70% | [ ] |
| CHK-079 | Relation type filtering | `causal-edges.test.js` | 70% | [ ] |
| CHK-080 | memory_drift_why tool integration | `causal-edges.test.js` | 70% | [ ] |

### Learning & Corrections Integration

| ID | Check | Test File | Coverage Target | Status |
|----|-------|-----------|-----------------|--------|
| CHK-081 | Correction recording with penalty | `corrections.test.js` | 70% | [ ] |
| CHK-082 | Stability penalty application (0.5x) | `corrections.test.js` | 70% | [ ] |
| CHK-083 | Replacement boost application (1.2x) | `corrections.test.js` | 70% | [ ] |
| CHK-084 | Undo correction with restoration | `corrections.test.js` | 70% | [ ] |
| CHK-085 | Correction type classification | `corrections.test.js` | 70% | [ ] |

### Cognitive Module Integration

| ID | Check | Test File | Coverage Target | Status |
|----|-------|-----------|-----------------|--------|
| CHK-086 | Co-activation network updates | `co-activation.test.js` | 70% | [ ] |
| CHK-087 | Working memory capacity limits | `working-memory.test.js` | 70% | [ ] |
| CHK-088 | Prediction error gating | `prediction-error-gate.test.js` | 70% | [ ] |
| CHK-089 | Archival manager background job | `archival-manager.test.js` | 70% | [ ] |
| CHK-090 | Summary generation from memories | `summary-generator.test.js` | 70% | [ ] |

### Schema Migration Integration

| ID | Check | Test File | Coverage Target | Status |
|----|-------|-----------|-----------------|--------|
| CHK-091 | v4 -> v5 migration tests | `schema-migration.test.js` | 70% | [ ] |
| CHK-092 | v5 -> v6 migration tests | `schema-migration.test.js` | 70% | [ ] |
| CHK-093 | v6 -> v7 migration tests | `schema-migration.test.js` | 70% | [ ] |
| CHK-094 | v7 -> v8 migration tests | `schema-migration.test.js` | 70% | [ ] |
| CHK-095 | v8 -> v9 migration tests | `schema-migration.test.js` | 70% | [ ] |
| CHK-096 | Migration rollback tests | `schema-migration.test.js` | 70% | [ ] |
| CHK-097 | Column existence validation | `schema-migration.test.js` | 70% | [ ] |
| CHK-098 | Index creation validation | `schema-migration.test.js` | 70% | [ ] |
| CHK-099 | Data preservation during migration | `schema-migration.test.js` | 70% | [ ] |
| CHK-100 | Constraint enforcement tests | `schema-migration.test.js` | 70% | [ ] |

---

## P2 REQUIREMENTS: E2E & Performance Tests (CHK-101 to CHK-150)

### MCP Tool E2E Tests

| ID | Check | Test File | Coverage Target | Status |
|----|-------|-----------|-----------------|--------|
| CHK-101 | memory_search tool E2E | TBD: `mcp-tools-e2e.test.js` | 50% | [ ] |
| CHK-102 | memory_save tool E2E | TBD: `mcp-tools-e2e.test.js` | 50% | [ ] |
| CHK-103 | memory_context tool E2E | TBD: `mcp-tools-e2e.test.js` | 50% | [ ] |
| CHK-104 | memory_drift_why tool E2E | TBD: `mcp-tools-e2e.test.js` | 50% | [ ] |
| CHK-105 | memory_causal_link tool E2E | TBD: `mcp-tools-e2e.test.js` | 50% | [ ] |
| CHK-106 | memory_match_triggers tool E2E | TBD: `mcp-tools-e2e.test.js` | 50% | [ ] |
| CHK-107 | checkpoint_create/restore tool E2E | TBD: `mcp-tools-e2e.test.js` | 50% | [ ] |
| CHK-108 | memory_index_scan tool E2E | TBD: `mcp-tools-e2e.test.js` | 50% | [ ] |
| CHK-109 | memory_health tool E2E | TBD: `mcp-tools-e2e.test.js` | 50% | [ ] |
| CHK-110 | memory_consolidate tool E2E | TBD: `mcp-tools-e2e.test.js` | 50% | [ ] |

### Performance Regression Tests

| ID | Check | Test File | Target | Status |
|----|-------|-----------|--------|--------|
| CHK-111 | MCP startup time < 500ms | TBD: `performance.test.js` | <500ms | [ ] |
| CHK-112 | Query latency P95 < 150ms | TBD: `performance.test.js` | <150ms | [ ] |
| CHK-113 | Cross-encoder P95 < 500ms | TBD: `performance.test.js` | <500ms | [ ] |
| CHK-114 | Cache hit rate > 50% | TBD: `performance.test.js` | >50% | [ ] |
| CHK-115 | Session dedup token savings > 25% | TBD: `performance.test.js` | >25% | [ ] |
| CHK-116 | BM25 index build < 1s per 100 docs | TBD: `performance.test.js` | <1s | [ ] |
| CHK-117 | Incremental index 10x faster | TBD: `performance.test.js` | 10x | [ ] |
| CHK-118 | Memory usage < 500MB for 10K memories | TBD: `performance.test.js` | <500MB | [ ] |
| CHK-119 | Fallback chain < 100ms switch | TBD: `performance.test.js` | <100ms | [ ] |
| CHK-120 | Consolidation pipeline < 60s | TBD: `performance.test.js` | <60s | [ ] |

### Error Handling E2E Tests

| ID | Check | Test File | Coverage Target | Status |
|----|-------|-----------|-----------------|--------|
| CHK-121 | API key invalid at startup | TBD: `error-scenarios.test.js` | 50% | [ ] |
| CHK-122 | API key invalid at runtime | TBD: `error-scenarios.test.js` | 50% | [ ] |
| CHK-123 | All providers fail scenario | TBD: `error-scenarios.test.js` | 50% | [ ] |
| CHK-124 | Network timeout during embed | TBD: `error-scenarios.test.js` | 50% | [ ] |
| CHK-125 | Database corruption recovery | TBD: `error-scenarios.test.js` | 50% | [ ] |
| CHK-126 | Concurrent session conflicts | TBD: `error-scenarios.test.js` | 50% | [ ] |
| CHK-127 | Large query (>10K chars) handling | TBD: `error-scenarios.test.js` | 50% | [ ] |
| CHK-128 | Malformed ANCHOR format | TBD: `error-scenarios.test.js` | 50% | [ ] |
| CHK-129 | Memory file corruption | TBD: `error-scenarios.test.js` | 50% | [ ] |
| CHK-130 | SQLite lock contention | TBD: `error-scenarios.test.js` | 50% | [ ] |

### Edge Case Tests

| ID | Check | Test File | Coverage Target | Status |
|----|-------|-----------|-----------------|--------|
| CHK-131 | Empty query returns top memories | TBD: `edge-cases.test.js` | 50% | [ ] |
| CHK-132 | Zero search results handling | TBD: `edge-cases.test.js` | 50% | [ ] |
| CHK-133 | Unicode content in memories | TBD: `edge-cases.test.js` | 50% | [ ] |
| CHK-134 | Very long memory content (>100KB) | TBD: `edge-cases.test.js` | 50% | [ ] |
| CHK-135 | Memory with no anchors | TBD: `edge-cases.test.js` | 50% | [ ] |
| CHK-136 | Circular causal references | TBD: `edge-cases.test.js` | 50% | [ ] |
| CHK-137 | Deep causal chain (>10 hops) | TBD: `edge-cases.test.js` | 50% | [ ] |
| CHK-138 | Simultaneous checkpoint operations | TBD: `edge-cases.test.js` | 50% | [ ] |
| CHK-139 | Memory type inference ambiguity | TBD: `edge-cases.test.js` | 50% | [ ] |
| CHK-140 | Session with 1000+ surfaced memories | TBD: `edge-cases.test.js` | 50% | [ ] |

### Stability & Flakiness Tests

| ID | Check | Test File | Requirement | Status |
|----|-------|-----------|-------------|--------|
| CHK-141 | All unit tests pass 3 consecutive runs | All `*.test.js` | 3/3 passes | [ ] |
| CHK-142 | All integration tests pass 3 consecutive runs | Integration files | 3/3 passes | [ ] |
| CHK-143 | No timing-dependent test failures | All `*.test.js` | 0 flaky | [ ] |
| CHK-144 | Tests run in isolation (no shared state) | All `*.test.js` | Isolated | [ ] |
| CHK-145 | Tests clean up temp files/DBs | All `*.test.js` | Clean | [ ] |

### Coverage Reporting

| ID | Check | Metric | Target | Status |
|----|-------|--------|--------|--------|
| CHK-146 | Overall line coverage | Jest coverage | 75% | [ ] |
| CHK-147 | Overall branch coverage | Jest coverage | 65% | [ ] |
| CHK-148 | lib/cognitive coverage | Jest coverage | 80% | [ ] |
| CHK-149 | lib/search coverage | Jest coverage | 80% | [ ] |
| CHK-150 | lib/storage coverage | Jest coverage | 80% | [ ] |

---

## Test Infrastructure Verification

### Test Framework Setup

- [ ] CHK-151 [P0] Jest or Node test runner configured
- [ ] CHK-152 [P0] Coverage reporting enabled (--coverage flag)
- [ ] CHK-153 [P1] Test fixtures directory with sample data
- [ ] CHK-154 [P1] Mock implementations for external APIs
- [ ] CHK-155 [P2] CI/CD integration for automated runs

### Test Data Management

- [ ] CHK-156 [P1] Sample memory files for integration tests
- [ ] CHK-157 [P1] Mock embedding provider for unit tests
- [ ] CHK-158 [P1] Test database isolation (in-memory SQLite)
- [ ] CHK-159 [P2] Seed data for performance benchmarks
- [ ] CHK-160 [P2] Snapshot testing for response envelopes

---

## Code Quality

- [ ] CHK-161 [P0] All test files pass `node --check` syntax validation
- [ ] CHK-162 [P0] No skipped tests (`.skip` or `.only`)
- [ ] CHK-163 [P1] Test names follow describe/it convention
- [ ] CHK-164 [P1] Assertion messages are descriptive
- [ ] CHK-165 [P2] Tests grouped by functionality

---

## L3+: Performance Verification

| Category | Metric | Target | CHK |
|----------|--------|--------|-----|
| Unit Tests | Execution time | < 30s total | CHK-166 |
| Integration Tests | Execution time | < 120s total | CHK-167 |
| Coverage Generation | Time | < 60s | CHK-168 |
| Memory Usage | Peak during tests | < 1GB | CHK-169 |

- [ ] CHK-166 [P1] Unit test suite completes in < 30s
- [ ] CHK-167 [P1] Integration test suite completes in < 120s
- [ ] CHK-168 [P2] Coverage report generation < 60s
- [ ] CHK-169 [P2] Peak memory usage during tests < 1GB

---

## L3+: Architecture Verification

- [ ] CHK-170 [P1] Test structure mirrors lib/ module structure
- [ ] CHK-171 [P1] Mock implementations conform to interfaces
- [ ] CHK-172 [P1] No direct file system access in unit tests
- [ ] CHK-173 [P2] Test utilities extracted to shared helpers
- [ ] CHK-174 [P2] Error scenarios documented with expected behaviors

---

## L3+: Deployment Readiness

- [ ] CHK-175 [P0] All P0 tests pass before merge
- [ ] CHK-176 [P0] No regression in existing functionality
- [ ] CHK-177 [P1] Test documentation in README
- [ ] CHK-178 [P1] CI pipeline runs all test suites
- [ ] CHK-179 [P2] Test coverage badges in repo

---

## L3+: Compliance Verification

- [ ] CHK-180 [P1] Tests verify security requirements (input validation)
- [ ] CHK-181 [P1] Tests verify API key masking in logs
- [ ] CHK-182 [P1] Tests verify session isolation
- [ ] CHK-183 [P2] Tests verify data privacy (no PII in test logs)

---

## L3+: Risk Mitigation

| Risk | Test Coverage Required | CHK Range |
|------|------------------------|-----------|
| R1 (Cross-encoder latency) | Auto-disable threshold tests | CHK-030 |
| R2 (Cache invalidation) | Write-through invalidation tests | CHK-036 |
| R3 (Half-life misconfiguration) | Reset/validation tests | CHK-010 |
| R9 (Embedding provider) | Fallback chain tests | CHK-044, CHK-050 |
| R14 (Consolidation data loss) | Dry-run/backup tests | TBD |

- [ ] CHK-184 [P0] R1 mitigation verified: cross-encoder auto-disable
- [ ] CHK-185 [P0] R2 mitigation verified: cache invalidation on write
- [ ] CHK-186 [P0] R3 mitigation verified: half-life reset command
- [ ] CHK-187 [P1] R9 mitigation verified: fallback chain complete
- [ ] CHK-188 [P2] R14 mitigation verified: consolidation dry-run

---

## Existing Test File Verification

The following test files from 082-speckit-reimagined must be verified as passing:

### Verified Test Files (from mcp_server/tests/)

| Test File | Purpose | Tests | Status |
|-----------|---------|-------|--------|
| CHK-189 | `attention-decay.test.js` | FSRS decay calculations | [ ] |
| CHK-190 | `tier-classifier.test.js` | 5-state model + type half-lives | [ ] |
| CHK-191 | `fsrs-scheduler.test.js` | Retrievability + stability | [ ] |
| CHK-192 | `composite-scoring.test.js` | Multi-factor scoring | [ ] |
| CHK-193 | `five-factor-scoring.test.js` | 5-factor composite | [ ] |
| CHK-194 | `memory-search-integration.test.js` | Search pipeline | [ ] |
| CHK-195 | `memory-save-integration.test.js` | Save lifecycle | [ ] |
| CHK-196 | `crash-recovery.test.js` | Session persistence | [ ] |
| CHK-197 | `continue-session.test.js` | CONTINUE_SESSION.md | [ ] |
| CHK-198 | `tool-cache.test.js` | Cache operations | [ ] |
| CHK-199 | `preflight.test.js` | Validation gates | [ ] |
| CHK-200 | `incremental-index.test.js` | Indexing optimization | [ ] |
| CHK-201 | `provider-chain.test.js` | Embedding fallback | [ ] |
| CHK-202 | `retry.test.js` | Exponential backoff | [ ] |
| CHK-203 | `transaction-manager.test.js` | Atomic saves | [ ] |
| CHK-204 | `causal-edges.test.js` | Graph operations | [ ] |
| CHK-205 | `corrections.test.js` | Learning from mistakes | [ ] |
| CHK-206 | `intent-classifier.test.js` | Query classification | [ ] |
| CHK-207 | `fuzzy-match.test.js` | Acronym/typo handling | [ ] |
| CHK-208 | `cross-encoder.test.js` | Reranking | [ ] |
| CHK-209 | `schema-migration.test.js` | DB migrations | [ ] |
| CHK-210 | `interfaces.test.js` | Protocol abstractions | [ ] |
| CHK-211 | `co-activation.test.js` | Network updates | [ ] |
| CHK-212 | `working-memory.test.js` | Capacity limits | [ ] |
| CHK-213 | `prediction-error-gate.test.js` | PE gating | [ ] |
| CHK-214 | `archival-manager.test.js` | Background archival | [ ] |
| CHK-215 | `summary-generator.test.js` | Summary creation | [ ] |
| CHK-216 | `modularization.test.js` | Module organization | [ ] |
| CHK-217 | `api-key-validation.test.js` | Startup validation | [ ] |

---

## L3+: Sign-off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Implementation Lead | Technical Review | [ ] Pending | - |
| QA Lead | Test Adequacy | [ ] Pending | - |
| Product Owner | Acceptance | [ ] Pending | - |

---

## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 66 | 0/66 | [ ] Pending |
| P1 Items | 81 | 0/81 | [ ] Pending |
| P2 Items | 70 | 0/70 | [ ] Pending |

**Total Items:** 217
**Total Verified:** 0/217 (0%)

| Priority | Count | Description |
|----------|-------|-------------|
| **P0** | 66 | HARD BLOCKER - Unit tests (80%+ coverage) |
| **P1** | 81 | Required - Integration tests (70%+ coverage) |
| **P2** | 70 | Optional - E2E, performance, edge cases |
| **Total** | 217 | |

**Verification Date**: Pending

---

## Evidence Log

### Test Execution Records

| Run Date | Test Suite | Pass/Fail | Coverage | Verified By |
|----------|------------|-----------|----------|-------------|
| - | Unit Tests | - | - | - |
| - | Integration Tests | - | - | - |
| - | E2E Tests | - | - | - |

### Coverage Snapshots

| Date | Lines | Branches | Functions | Statements |
|------|-------|----------|-----------|------------|
| - | - | - | - | - |

---

<!--
Level 3+ checklist for test suite verification
Mark [x] with evidence when verified
P0: Unit tests (80%+ coverage per module)
P1: Integration tests (70%+ coverage)
P2: E2E, performance, edge cases (50%+ coverage)
Source: 082-speckit-reimagined spec.md, tasks.md, checklist.md
-->
