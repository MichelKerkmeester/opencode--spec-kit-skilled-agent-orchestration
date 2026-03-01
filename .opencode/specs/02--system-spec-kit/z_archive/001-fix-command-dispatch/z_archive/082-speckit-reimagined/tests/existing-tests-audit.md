# Existing Tests Audit

**Generated:** 2026-02-01
**Location:** `.opencode/skill/system-spec-kit/mcp_server/tests/`

---

## Executive Summary

| Metric | Count |
|--------|-------|
| **Total Test Files** | 29 |
| **Estimated Total Tests** | 500+ |
| **Modules WITH Tests** | 25 |
| **Modules WITHOUT Tests** | 29 |
| **Test Coverage Gap** | ~54% of modules lack dedicated tests |

---

## Test Files Analysis

### 1. tier-classifier.test.js

| Metric | Value |
|--------|-------|
| **Test Count** | 78 tests |
| **Lines of Code** | 1,049 |
| **Task Coverage** | T200-T280 |

**Coverage Areas:**
- State classification (5-state model: HOT, WARM, COLD, DORMANT, ARCHIVED)
- Archive detection (90-day threshold)
- Retrievability calculation (FSRS formula)
- Context window management (limits: 5 HOT, 10 WARM)
- Edge cases (null, missing fields, clamping)
- State-to-tier mapping (backward compatibility)
- State statistics
- Archive helpers
- Content retrieval by state
- Legacy 3-tier backward compatibility
- Days since calculation
- Threshold configuration
- Format state response
- Context inclusion

**Gaps Identified:**
- No stress testing for large memory sets (1000+ memories)
- No concurrent access tests
- No database integration tests for tier updates

**Enhancement Recommendations:**
- Add performance benchmarks for filtering 10k+ memories
- Add edge case tests for timestamp timezone handling
- Add integration tests with actual SQLite database

---

### 2. five-factor-scoring.test.js

| Metric | Value |
|--------|-------|
| **Test Count** | 65 tests |
| **Lines of Code** | 599 |
| **Task Coverage** | T032-T035, REQ-017 |

**Coverage Areas:**
- Five-factor weight configuration (temporal, usage, importance, pattern, citation)
- Temporal score (FSRS retrievability)
- Usage score (access boost)
- Importance score (tier multipliers)
- Citation recency score
- Pattern alignment score
- Five-factor composite calculation
- Batch operations
- Score breakdown
- Attention decay integration
- Backward compatibility with legacy scoring
- Relevance improvement validation (CHK-056)

**Gaps Identified:**
- No tests for extreme weight configurations
- No tests for scoring with missing fields across all factors
- Limited edge case coverage for pattern matching

**Enhancement Recommendations:**
- Add tests for custom weight overrides
- Add tests for scoring stability across version upgrades
- Add randomized fuzz tests for input validation

---

### 3. causal-edges.test.js

| Metric | Value |
|--------|-------|
| **Test Count** | 29 tests |
| **Lines of Code** | 430 |
| **Task Coverage** | T043-T047, CHK-061, CHK-063, CHK-065 |

**Coverage Areas:**
- Relation types (6 types: caused, enabled, supersedes, contradicts, derived_from, supports)
- Edge insertion with validation
- Edge retrieval (from/to/all)
- Causal chain traversal with depth limiting
- Cycle prevention
- Edge management (update/delete)
- Graph statistics
- Batch insertion

**Gaps Identified:**
- No tests for very deep causal chains (>100 edges)
- No tests for concurrent edge modifications
- Limited tests for edge strength calculations

**Enhancement Recommendations:**
- Add stress tests for large graphs
- Add tests for graph visualization data export
- Add tests for edge conflict resolution

---

### 4. cross-encoder.test.js

| Metric | Value |
|--------|-------|
| **Test Count** | 22 tests |
| **Lines of Code** | 292 |
| **Task Coverage** | T048-T051, REQ-013, REQ-008 |

**Coverage Areas:**
- Configuration (enable flag, max candidates, latency threshold)
- Length penalty calculation (REQ-008: 100 char threshold, 0.8-1.0 penalty range)
- Cache operations
- Provider availability (Voyage, Cohere, local)
- Reranker status
- Rerank function behavior (CHK-048)

**Gaps Identified:**
- No actual API integration tests (mocked only)
- No latency measurement tests under load
- No tests for provider failover scenarios

**Enhancement Recommendations:**
- Add integration tests with real cross-encoder APIs (conditional)
- Add performance tests measuring actual reranking latency
- Add tests for cache invalidation strategies

---

### 5. provider-chain.test.js

| Metric | Value |
|--------|-------|
| **Test Count** | 28 tests |
| **Lines of Code** | 690 |
| **Task Coverage** | T091-T095, REQ-030, CHK-171-175 |

**Coverage Areas:**
- EmbeddingProviderChain class initialization
- Configurable primary provider (Voyage, OpenAI)
- Local provider as secondary fallback
- BM25-only mode as tertiary fallback
- Fallback logging with provider name and reason
- Fallback order verification (Primary -> Local -> BM25)
- Timeout handling
- ENABLE_LOCAL_FALLBACK configuration

**Gaps Identified:**
- No tests for rate limiting scenarios
- No tests for partial batch embedding failures
- Limited tests for provider health recovery

**Enhancement Recommendations:**
- Add tests for automatic provider recovery after transient failures
- Add tests for embedding dimension compatibility validation
- Add stress tests for high-volume batch embedding

---

### 6. archival-manager.test.js

| Metric | Value |
|--------|-------|
| **Test Count** | 32 tests |
| **Lines of Code** | 594 |
| **Task Coverage** | T059 |

**Coverage Areas:**
- Initialization (database schema, columns)
- Archival candidate detection (90-day threshold)
- Protected tiers (constitutional, critical)
- Archival actions (mark, log_only)
- Batch archival
- Archival scan
- Background job (start/stop/status)
- Statistics tracking
- Memory archival status check

**Gaps Identified:**
- No tests for concurrent archival operations
- No tests for archival rollback
- Limited tests for memory unarchival side effects

**Enhancement Recommendations:**
- Add tests for archival with active sessions
- Add tests for archival recovery after crash
- Add performance tests for bulk archival operations

---

### 7. attention-decay.test.js

| Metric | Value |
|--------|-------|
| **Test Count** | ~70 tests (estimated from patterns) |
| **Lines of Code** | 904 |
| **Task Coverage** | T301-T340 |

**Coverage Areas:**
- DECAY_CONFIG validation
- Init function validation
- Decay rate by tier (constitutional, critical, normal, temporary)
- Legacy exponential decay calculation
- FSRS integration
- FSRS configuration constants
- Batch decay processing
- Decay curve validation (monotonicity, bounds)
- Backward compatibility
- Database-dependent functions
- FSRS activation with testing effect
- Module exports

**Gaps Identified:**
- No tests for decay during active sessions
- No tests for decay rate interpolation
- Limited precision tests for floating point calculations

**Enhancement Recommendations:**
- Add tests for decay visualization data export
- Add tests for decay prediction accuracy
- Add tests for decay rate tuning based on user behavior

---

### 8. preflight.test.js

| Metric | Value |
|--------|-------|
| **Test Count** | 19 tests |
| **Lines of Code** | 434 |
| **Task Coverage** | T067-T070, CHK-156-160 |

**Coverage Areas:**
- Anchor format validation (CHK-156)
  - Valid anchors, unclosed, invalid ID, duplicate
- Duplicate detection (CHK-157)
  - Content hash computation (SHA-256)
- Token budget estimation (CHK-158)
  - Token estimation, budget limits, warnings
- Content size validation
- Unified preflight (CHK-159)
- Dry-run mode (CHK-160)
- PreflightError class

**Gaps Identified:**
- No tests for nested anchor structures
- No tests for large file preflight performance
- Limited tests for custom token estimation models

**Enhancement Recommendations:**
- Add tests for streaming preflight validation
- Add tests for preflight with external validation hooks
- Add performance tests for 100MB+ files

---

### 9. crash-recovery.test.js

| Metric | Value |
|--------|-------|
| **Test Count** | 9 tests |
| **Lines of Code** | 383 |
| **Task Coverage** | T071-T075 |

**Coverage Areas:**
- Session state table schema (T073)
- Save session state
- Reset interrupted sessions (T074)
- Recover state with _recovered flag (T075)
- Interrupted sessions list
- Generate CONTINUE_SESSION.md (T071)
- Write CONTINUE_SESSION.md on checkpoint (T072)

**Gaps Identified:**
- No tests for partial session recovery
- No tests for corrupted session state handling
- Limited tests for concurrent crash/recovery

**Enhancement Recommendations:**
- Add tests for session state migration
- Add tests for recovery with missing spec folders
- Add stress tests for rapid crash/recovery cycles

---

### 10. intent-classifier.test.js

| Metric | Value |
|--------|-------|
| **Test Count** | ~25 tests |
| **Lines of Code** | 308 |
| **Task Coverage** | T036-T039, CHK-039 |

**Coverage Areas:**
- Intent types (add_feature, fix_bug, refactor, security_audit, understand)
- Query classifier structure and edge cases
- Detection accuracy per intent type
- Intent weight adjustments
- Weight validation (sum to 1.0)
- Validation functions
- Overall accuracy test (>80% target)

**Gaps Identified:**
- No tests for multi-intent queries
- No tests for non-English queries
- Limited tests for intent confidence thresholds

**Enhancement Recommendations:**
- Add tests for intent disambiguation
- Add tests for context-dependent intent classification
- Add benchmark tests against labeled query datasets

---

### 11. fuzzy-match.test.js

| Metric | Value |
|--------|-------|
| **Test Count** | ~40 tests |
| **Lines of Code** | 640 |
| **Task Coverage** | T076-T078, CHK-137-140, REQ-018, REQ-027 |

**Coverage Areas:**
- Levenshtein distance (CHK-137)
- Is fuzzy match threshold
- ACRONYM_MAP (CHK-138) - 30+ entries
- Acronym lookup (exact and case-insensitive)
- Fuzzy acronym lookup
- Query expansion with fuzzy (CHK-139)
- Typo correction (CHK-140)
- Configuration (MAX_EDIT_DISTANCE, MIN_FUZZY_TERM_LENGTH)
- Legacy camelCase aliases
- Edge cases (long queries, special characters, unicode)

**Gaps Identified:**
- No tests for acronym map updates
- No tests for fuzzy match performance with large dictionaries
- Limited tests for domain-specific acronym conflicts

**Enhancement Recommendations:**
- Add tests for custom acronym injection
- Add tests for fuzzy match with code identifiers
- Add performance benchmarks for batch fuzzy matching

---

### 12. Additional Test Files (Summary)

| File | Tests | Lines | Coverage Focus |
|------|-------|-------|----------------|
| **composite-scoring.test.js** | ~60 | 1,185 | Weight config, score components, batch scoring |
| **fsrs-scheduler.test.js** | ~75 | 1,308 | FSRS algorithm, stability, scheduling |
| **memory-save-integration.test.js** | ~50 | 1,500 | End-to-end save flow, validation, indexing |
| **memory-search-integration.test.js** | ~45 | 1,148 | Search pipeline, hybrid search, results |
| **schema-migration.test.js** | ~40 | 1,109 | Database migrations, version tracking |
| **prediction-error-gate.test.js** | ~35 | 973 | Prediction error, learning, adaptation |
| **summary-generator.test.js** | ~30 | 594 | Summary extraction, formatting |
| **co-activation.test.js** | ~25 | 456 | Spreading activation, related memories |
| **working-memory.test.js** | ~30 | 545 | Working memory limits, eviction |
| **retry.test.js** | ~25 | 611 | Retry logic, backoff, circuit breaker |
| **transaction-manager.test.js** | ~12 | 348 | Atomic writes, rollback, pending files |
| **continue-session.test.js** | ~20 | 313 | Session continuation, context loading |
| **corrections.test.js** | ~15 | 390 | User corrections, learning feedback |
| **incremental-index.test.js** | ~12 | 307 | Incremental indexing, delta updates |
| **tool-cache.test.js** | ~15 | 252 | Tool result caching, TTL, eviction |
| **api-key-validation.test.js** | ~12 | 256 | API key validation, provider config |
| **interfaces.test.js** | ~8 | 308 | Interface contracts, type checking |
| **modularization.test.js** | ~15 | 416 | Module structure, exports |

---

## Modules WITHOUT Test Files

The following modules in `/lib/` do not have dedicated `.test.js` files:

### Critical Priority (Core Functionality)

| Module | Location | Description | Risk |
|--------|----------|-------------|------|
| **session-manager.js** | lib/session/ | Session lifecycle management | HIGH - Used in crash recovery |
| **rrf-fusion.js** | lib/search/ | Reciprocal Rank Fusion | HIGH - Core search ranking |
| **bm25-index.js** | lib/search/ | BM25 lexical search | HIGH - Fallback search |
| **hybrid-search.js** | lib/search/ | Combines vector + BM25 | HIGH - Main search entry |
| **envelope.js** | lib/response/ | Response formatting | MEDIUM - All responses use this |
| **consolidation.js** | lib/cognitive/ | Memory consolidation | MEDIUM - Background process |

### High Priority (Data Integrity)

| Module | Location | Description | Risk |
|--------|----------|-------------|------|
| **access-tracker.js** | lib/storage/ | Access count tracking | MEDIUM - Affects scoring |
| **checkpoints.js** | lib/storage/ | Checkpoint management | MEDIUM - Recovery relies on this |
| **history.js** | lib/storage/ | History tracking | MEDIUM - Used for patterns |
| **vector-index.js** | lib/search/ | Vector embedding storage | HIGH - Core search |
| **index-refresh.js** | lib/storage/ | Index refresh logic | MEDIUM - Data consistency |

### Medium Priority (Parsing/Utilities)

| Module | Location | Description | Risk |
|--------|----------|-------------|------|
| **memory-parser.js** | lib/parsing/ | Memory file parsing | MEDIUM - Import accuracy |
| **trigger-matcher.js** | lib/parsing/ | Trigger phrase matching | MEDIUM - Memory activation |
| **trigger-extractor.js** | lib/parsing/ | Trigger phrase extraction | LOW - Preprocessing |
| **entity-scope.js** | lib/parsing/ | Entity scope resolution | LOW - Context detection |
| **format-helpers.js** | lib/utils/ | Formatting utilities | LOW - Display only |
| **token-budget.js** | lib/utils/ | Token budget calculation | LOW - Advisory only |

### Lower Priority (Configuration/Supporting)

| Module | Location | Description | Risk |
|--------|----------|-------------|------|
| **memory-types.js** | lib/config/ | Memory type definitions | LOW - Static config |
| **type-inference.js** | lib/config/ | Type inference logic | LOW - Heuristics |
| **importance-tiers.js** | lib/scoring/ | Tier definitions | LOW - Static config |
| **folder-scoring.js** | lib/scoring/ | Folder-based scoring | LOW - Optional feature |
| **confidence-tracker.js** | lib/scoring/ | Confidence tracking | LOW - Analytics |
| **temporal-contiguity.js** | lib/cognitive/ | Temporal relationships | LOW - Enhancement |
| **reranker.js** | lib/search/ | Reranking utilities | LOW - Wrapper |
| **embeddings.js** | lib/providers/ | Embedding utilities | LOW - Wrapper |
| **retry-manager.js** | lib/providers/ | Retry management | LOW - Shared utility |
| **layer-definitions.js** | lib/architecture/ | Architecture layers | LOW - Documentation |
| **recovery-hints.js** | lib/errors/ | Error recovery suggestions | LOW - UX |
| **embedding-provider.js** | lib/interfaces/ | Provider interface | LOW - Abstract |
| **vector-store.js** | lib/interfaces/ | Store interface | LOW - Abstract |

---

## Test Quality Assessment

### Strengths

1. **Comprehensive unit tests** for cognitive modules (tier-classifier, attention-decay)
2. **Good edge case coverage** in most test files
3. **Task IDs mapped** to tests for traceability (T###)
4. **Backward compatibility tests** for API stability
5. **Integration tests** for critical flows (memory-save, memory-search)

### Weaknesses

1. **Missing tests for 29 modules** (~54% coverage gap)
2. **No performance/stress tests** in the test suite
3. **Limited concurrent access tests** across modules
4. **No end-to-end tests** spanning multiple systems
5. **No tests for error recovery paths** in most modules

### Test Infrastructure Gaps

1. **No test fixtures framework** - Each test creates its own data
2. **No mocking library** - Tests use manual mocks
3. **No coverage reporting** - No way to measure line/branch coverage
4. **No CI integration** - Tests run manually only
5. **No test data generators** - Limited randomized testing

---

## Recommendations

### Immediate Actions (P0)

1. **Add tests for hybrid-search.js** - Core user-facing feature
2. **Add tests for rrf-fusion.js** - Critical for search quality
3. **Add tests for session-manager.js** - Used in crash recovery
4. **Add tests for bm25-index.js** - Fallback search mechanism

### Short-term Actions (P1)

1. **Implement test fixtures** - Standardize test data creation
2. **Add performance benchmarks** - Track regression in key operations
3. **Create end-to-end test suite** - Cover full user flows
4. **Add tests for vector-index.js** - Core embedding storage

### Medium-term Actions (P2)

1. **Integrate coverage reporting** - Istanbul/nyc
2. **Add property-based testing** - Fast-check for edge cases
3. **Create test data generators** - Randomized memory content
4. **Document test patterns** - Standardize test structure

---

## Test Execution Reference

```bash
# Run all tests
cd .opencode/skill/system-spec-kit/mcp_server
node tests/tier-classifier.test.js
node tests/five-factor-scoring.test.js
# ... etc

# Run specific test file
node tests/<test-name>.test.js

# Expected pass rate: 100% when all dependencies are available
```

---

## Appendix: Test File Statistics

| Metric | Value |
|--------|-------|
| Total test files | 29 |
| Total lines of code | 18,342 |
| Average tests per file | ~17 |
| Largest test file | memory-save-integration.test.js (1,500 lines) |
| Smallest test file | tool-cache.test.js (252 lines) |

---

*This audit was generated as part of the SpecKit Test Suite Reimagining effort (spec 083).*
