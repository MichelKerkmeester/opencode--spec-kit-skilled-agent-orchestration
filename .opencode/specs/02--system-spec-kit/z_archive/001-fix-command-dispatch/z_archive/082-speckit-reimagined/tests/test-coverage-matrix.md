# Test Coverage Matrix

> Comprehensive mapping of 107 implementation tasks (T001-T126) to test files, coverage targets, and gap analysis.

**Generated:** 2026-02-01
**Source:** 082-speckit-reimagined/tasks.md
**Test Location:** `.opencode/skill/system-spec-kit/mcp_server/tests/`

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total Implementation Tasks | 107 |
| Tasks with Test Coverage | 89 |
| Tasks Without Test Coverage | 18 |
| Coverage Rate | 83.2% |
| Total Test Files | 29 |
| Estimated Total Tests | ~850 |

---

## Coverage by Workstream

| Workstream | Tasks | Covered | Gap | Coverage % |
|------------|-------|---------|-----|------------|
| **W-S** (Session) | 22 | 18 | 4 | 81.8% |
| **W-R** (Search/Retrieval) | 22 | 20 | 2 | 90.9% |
| **W-D** (Decay/Scoring) | 22 | 20 | 2 | 90.9% |
| **W-G** (Graph/Relations) | 9 | 9 | 0 | 100.0% |
| **W-I** (Infrastructure) | 32 | 22 | 10 | 68.8% |

---

## W-S: Session Management Tasks

### T001-T004: Session Deduplication

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T001 | Session hash generation | continue-session.test.js | determine_session_status, estimate_completion_percent | 5 | 5 | 0 |
| T002 | Duplicate detection algorithm | continue-session.test.js | extract_pending_tasks tests | 5 | 5 | 0 |
| T003 | Session merge logic | continue-session.test.js | generate_context_summary tests | 5 | 5 | 0 |
| T004 | Session boundary detection | continue-session.test.js | build_continue_session_data tests | 8 | 15 | 0 |

**Test File:** `continue-session.test.js`
**Test Count:** ~40 tests
**Status:** COMPLETE

---

### T071-T075: Crash Recovery

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T071 | Dirty flag tracking | crash-recovery.test.js | T071 dirty flag tests | 3 | 2 | 1 |
| T072 | Recovery file generation | crash-recovery.test.js | T072 recovery file tests | 3 | 2 | 1 |
| T073 | State reconstruction | crash-recovery.test.js | T073 reconstruction tests | 3 | 2 | 1 |
| T074 | Recovery validation | crash-recovery.test.js | T074 validation tests | 3 | 2 | 1 |
| T075 | CONTINUE_SESSION.md auto-gen | crash-recovery.test.js | T075 auto-gen tests | 3 | 2 | 1 |

**Test File:** `crash-recovery.test.js`
**Test Count:** 9 tests
**Status:** NEEDS EXPANSION (Target: 15 tests)

---

### T108-T113: Template Updates

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T108 | CORE template structure | - | Template validation tests | 5 | 0 | 5 |
| T109 | ADDENDUM template structure | - | Addendum section tests | 5 | 0 | 5 |
| T110 | Template variable extraction | - | Variable parsing tests | 5 | 0 | 5 |
| T111 | Template rendering | - | Render output tests | 5 | 0 | 5 |
| T112 | Template validation | - | Schema validation tests | 5 | 0 | 5 |
| T113 | Template versioning | - | Version tracking tests | 5 | 0 | 5 |

**Test File:** NOT CREATED
**Test Count:** 0 tests
**Status:** GAP - Needs `template-rendering.test.js`
**Priority:** P1 - Templates are critical path

---

### T114-T117: Command Documentation

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T114 | /memory:save command | - | Save command tests | 5 | 0 | 5 |
| T115 | /memory:search command | memory-search-integration.test.js | Search integration tests | 5 | 3 | 2 |
| T116 | /memory:checkpoint command | - | Checkpoint command tests | 5 | 0 | 5 |
| T117 | Command help text | - | Help text validation | 3 | 0 | 3 |

**Test File:** Partial coverage
**Test Count:** 3 tests
**Status:** GAP - Needs `command-interface.test.js`

---

### T118-T122: New Commands

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T118 | /memory:continue command | continue-session.test.js | Continue session tests | 5 | 5 | 0 |
| T119 | /memory:context command | - | Context retrieval tests | 5 | 0 | 5 |
| T120 | /memory:why command | - | Decision lineage tests | 5 | 0 | 5 |
| T121 | /memory:correct command | corrections.test.js | Correction handling tests | 5 | 5 | 0 |
| T122 | /memory:learn command | corrections.test.js | Learning capture tests | 5 | 5 | 0 |

**Test Files:** Partial coverage via corrections.test.js
**Status:** GAP - Needs `context-command.test.js`, `why-command.test.js`

---

### T123-T126: MCP Enhancements

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T123 | MCP session dedup | continue-session.test.js | Session dedup tests | 5 | 3 | 2 |
| T124 | CONTINUE_SESSION script | continue-session.test.js | Script generation tests | 8 | 8 | 0 |
| T125 | Indexer memory_type | memory-save-integration.test.js | Memory type tests | 5 | 3 | 2 |
| T126 | Causal links tracking | causal-edges.test.js | Link tracking tests | 8 | 8 | 0 |

**Status:** Mostly complete, minor gaps

---

## W-R: Search & Retrieval Tasks

### T020-T023: RRF Fusion Enhancement

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T020 | RRF k-parameter tuning | - | K-parameter tests | 5 | 0 | 5 |
| T021 | Score normalization | composite-scoring.test.js | Normalization tests | 5 | 5 | 0 |
| T022 | Multi-signal fusion | composite-scoring.test.js | Fusion algorithm tests | 8 | 8 | 0 |
| T023 | Fusion weight config | composite-scoring.test.js | Weight config tests | 5 | 5 | 0 |

**Test File:** `composite-scoring.test.js`
**Test Count:** ~60 tests
**Status:** GAP - Needs RRF-specific tests

---

### T024-T027: Usage Boost

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T024 | Access frequency tracking | composite-scoring.test.js | Access tracking tests | 5 | 5 | 0 |
| T025 | Recency weighting | composite-scoring.test.js | Recency boost tests | 5 | 5 | 0 |
| T026 | Usage score calculation | composite-scoring.test.js | Usage score tests | 5 | 5 | 0 |
| T027 | Boost cap limits | composite-scoring.test.js | Cap limit tests | 5 | 5 | 0 |

**Test File:** `composite-scoring.test.js`
**Test Count:** ~20 tests for usage
**Status:** COMPLETE

---

### T028-T031: BM25 Hybrid Search

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T028 | BM25 indexing | fuzzy-match.test.js | BM25 index tests | 5 | 3 | 2 |
| T029 | Term frequency calc | fuzzy-match.test.js | TF calculation tests | 5 | 3 | 2 |
| T030 | IDF calculation | fuzzy-match.test.js | IDF tests | 5 | 3 | 2 |
| T031 | Hybrid score merge | fuzzy-match.test.js | Merge algorithm tests | 5 | 5 | 0 |

**Test File:** `fuzzy-match.test.js`
**Test Count:** ~50 tests
**Status:** Partial - BM25 tests integrated with fuzzy match

---

### T036-T039: Intent-Aware Retrieval

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T036 | Intent classification | intent-classifier.test.js | Classification tests | 8 | 8 | 0 |
| T037 | Query type detection | intent-classifier.test.js | Query type tests | 5 | 5 | 0 |
| T038 | Weight adjustment | intent-classifier.test.js | Weight adjustment tests | 5 | 5 | 0 |
| T039 | Intent confidence | intent-classifier.test.js | Confidence tests | 5 | 5 | 0 |

**Test File:** `intent-classifier.test.js`
**Test Count:** 25 tests
**Status:** COMPLETE

---

### T048-T051: Cross-Encoder Reranking

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T048 | Rerank function | cross-encoder.test.js | Rerank tests | 8 | 8 | 0 |
| T049 | Length penalty | cross-encoder.test.js | Length penalty tests | 8 | 8 | 0 |
| T050 | Provider config | cross-encoder.test.js | Provider tests | 5 | 5 | 0 |
| T051 | Latency thresholds | cross-encoder.test.js | Latency tests | 5 | 5 | 0 |

**Test File:** `cross-encoder.test.js`
**Test Count:** ~30 tests
**Status:** COMPLETE

---

### T076-T078: Fuzzy Matching

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T076 | Levenshtein distance | fuzzy-match.test.js | Distance calculation tests | 10 | 15 | 0 |
| T077 | Acronym expansion | fuzzy-match.test.js | Acronym tests | 10 | 12 | 0 |
| T078 | Query expansion | fuzzy-match.test.js | Expansion tests | 10 | 15 | 0 |

**Test File:** `fuzzy-match.test.js`
**Test Count:** ~50 tests
**Status:** COMPLETE

---

## W-D: Decay & Scoring Tasks

### T005-T008: Type-Specific Half-Lives

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T005 | Half-life configuration | attention-decay.test.js | Config tests | 5 | 10 | 0 |
| T006 | Type-based decay rates | attention-decay.test.js | Decay rate tests | 8 | 15 | 0 |
| T007 | Decay curve validation | attention-decay.test.js | Curve validation tests | 8 | 20 | 0 |
| T008 | Half-life bounds | attention-decay.test.js | Bounds tests | 5 | 10 | 0 |

**Test File:** `attention-decay.test.js`
**Test Count:** ~85 tests
**Status:** COMPLETE (Exceeds targets)

---

### T032-T035: Multi-Factor Decay

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T032 | Temporal factor | five-factor-scoring.test.js | Temporal tests | 10 | 12 | 0 |
| T033 | Usage factor | five-factor-scoring.test.js | Usage tests | 10 | 12 | 0 |
| T034 | Importance factor | five-factor-scoring.test.js | Importance tests | 10 | 12 | 0 |
| T035 | Pattern/Citation factors | five-factor-scoring.test.js | Pattern tests | 10 | 15 | 0 |

**Test File:** `five-factor-scoring.test.js`
**Test Count:** 65 tests
**Status:** COMPLETE

---

### T056-T059: 5-State Model Verification

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T056 | State classification | tier-classifier.test.js | Classification tests | 15 | 20 | 0 |
| T057 | Retrievability calc | tier-classifier.test.js | Retrievability tests | 10 | 15 | 0 |
| T058 | State transitions | tier-classifier.test.js | Transition tests | 10 | 15 | 0 |
| T059 | Automatic archival | archival-manager.test.js | Archival tests | 10 | 32 | 0 |

**Test File:** `tier-classifier.test.js`, `archival-manager.test.js`
**Test Count:** ~80 + 32 tests
**Status:** COMPLETE

---

### T079-T083: Memory Consolidation

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T079 | Consolidation triggers | - | Trigger detection tests | 5 | 0 | 5 |
| T080 | Memory merging | - | Merge algorithm tests | 8 | 0 | 8 |
| T081 | Conflict resolution | - | Conflict handling tests | 5 | 0 | 5 |
| T082 | Consolidation scheduling | - | Schedule tests | 5 | 0 | 5 |
| T083 | Consolidation validation | - | Validation tests | 5 | 0 | 5 |

**Test File:** NOT CREATED
**Test Count:** 0 tests
**Status:** GAP - Needs `consolidation.test.js`
**Priority:** P2 - Future enhancement

---

## W-G: Graph & Relations Tasks

### T043-T047: Causal Memory Graph

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T043 | Edge insertion | causal-edges.test.js | Insert tests | 5 | 5 | 0 |
| T044 | Edge retrieval | causal-edges.test.js | Retrieval tests | 5 | 5 | 0 |
| T045 | Chain traversal | causal-edges.test.js | Traversal tests | 5 | 5 | 0 |
| T046 | Cycle detection | causal-edges.test.js | Cycle tests | 5 | 5 | 0 |
| T047 | Edge validation | causal-edges.test.js | Validation tests | 5 | 5 | 0 |

**Test File:** `causal-edges.test.js`
**Test Count:** ~25 tests
**Status:** COMPLETE

---

### T052-T055: Learning from Corrections

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T052 | Correction recording | corrections.test.js | Recording tests | 5 | 5 | 0 |
| T053 | Penalty application | corrections.test.js | Penalty tests | 5 | 5 | 0 |
| T054 | Improvement tracking | corrections.test.js | Tracking tests | 5 | 5 | 0 |
| T055 | Correction validation | corrections.test.js | Validation tests | 5 | 5 | 0 |

**Test File:** `corrections.test.js`
**Test Count:** ~15 tests
**Status:** COMPLETE

---

## W-I: Infrastructure Tasks

### T009-T011: Recovery Hints

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T009 | Hint generation | crash-recovery.test.js | Hint tests | 5 | 2 | 3 |
| T010 | Hint formatting | - | Format tests | 5 | 0 | 5 |
| T011 | Hint validation | - | Validation tests | 5 | 0 | 5 |

**Test File:** Partial coverage
**Status:** GAP - Needs expansion

---

### T012-T015: Tool Output Caching

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T012 | Cache key generation | tool-cache.test.js | Key generation tests | 5 | 5 | 0 |
| T013 | Cache storage | tool-cache.test.js | Storage tests | 5 | 5 | 0 |
| T014 | Cache invalidation | tool-cache.test.js | Invalidation tests | 5 | 5 | 0 |
| T015 | Cache TTL | tool-cache.test.js | TTL tests | 5 | 5 | 0 |

**Test File:** `tool-cache.test.js`
**Test Count:** ~20 tests
**Status:** COMPLETE

---

### T016-T019: Lazy Model Loading

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T016 | Lazy initialization | - | Init tests | 5 | 0 | 5 |
| T017 | Model warm-up | - | Warm-up tests | 5 | 0 | 5 |
| T018 | Memory management | - | Memory tests | 5 | 0 | 5 |
| T019 | Load timing | - | Timing tests | 5 | 0 | 5 |

**Test File:** NOT CREATED
**Test Count:** 0 tests
**Status:** GAP - Needs `lazy-loading.test.js`
**Priority:** P2

---

### T040-T042: Standardized Response Format

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T040 | Response structure | modularization.test.js | Structure tests | 5 | 3 | 2 |
| T041 | Error formatting | modularization.test.js | Error format tests | 5 | 3 | 2 |
| T042 | Metadata inclusion | modularization.test.js | Metadata tests | 5 | 3 | 2 |

**Test File:** `modularization.test.js`
**Test Count:** Partial coverage (~9 relevant tests)
**Status:** NEEDS EXPANSION

---

### T060-T063: Layered Tool Organization

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T060 | Tool registry | modularization.test.js | Registry tests | 5 | 5 | 0 |
| T061 | Handler routing | modularization.test.js | Routing tests | 5 | 5 | 0 |
| T062 | Permission checking | - | Permission tests | 5 | 0 | 5 |
| T063 | Tool validation | modularization.test.js | Validation tests | 5 | 5 | 0 |

**Test File:** `modularization.test.js`
**Test Count:** ~50 tests
**Status:** Mostly complete

---

### T064-T066: Incremental Indexing

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T064 | Content hash tracking | incremental-index.test.js | Hash tests | 5 | 4 | 1 |
| T065 | shouldReindex logic | incremental-index.test.js | Reindex tests | 5 | 6 | 0 |
| T066 | Batch categorization | incremental-index.test.js | Batch tests | 3 | 2 | 1 |

**Test File:** `incremental-index.test.js`
**Test Count:** ~10 tests
**Status:** MOSTLY COMPLETE

---

### T067-T070: Pre-Flight Quality Gates

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T067 | Anchor validation | preflight.test.js | Anchor tests | 5 | 5 | 0 |
| T068 | Duplicate detection | preflight.test.js | Duplicate tests | 5 | 5 | 0 |
| T069 | Token budget check | preflight.test.js | Token tests | 5 | 5 | 0 |
| T070 | Quality score calc | preflight.test.js | Score tests | 5 | 4 | 1 |

**Test File:** `preflight.test.js`
**Test Count:** 19 tests
**Status:** MOSTLY COMPLETE

---

### T084-T086: Protocol Abstractions

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T084 | IVectorStore interface | interfaces.test.js | Interface tests | 10 | 10 | 0 |
| T085 | IEmbeddingProvider interface | interfaces.test.js | Provider tests | 12 | 12 | 0 |
| T086 | SQLiteVectorStore | interfaces.test.js | SQLite tests | 8 | 8 | 0 |

**Test File:** `interfaces.test.js`
**Test Count:** ~30 tests
**Status:** COMPLETE

---

### T087-T090: API Key Validation

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T087 | Validation timeout | api-key-validation.test.js | Timeout tests | 3 | 2 | 1 |
| T088 | Missing key handling | api-key-validation.test.js | Missing key tests | 3 | 2 | 1 |
| T089 | Actionable guidance | api-key-validation.test.js | Guidance tests | 3 | 2 | 1 |
| T090 | Valid key success | api-key-validation.test.js | Success tests | 3 | 2 | 1 |

**Test File:** `api-key-validation.test.js`
**Test Count:** 6 tests
**Status:** COMPLETE (minimal viable)

---

### T091-T095: Fallback Chain

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T091 | Primary provider | provider-chain.test.js | Primary tests | 5 | 7 | 0 |
| T092 | Local fallback | provider-chain.test.js | Local tests | 5 | 7 | 0 |
| T093 | BM25-only mode | provider-chain.test.js | BM25 tests | 5 | 7 | 0 |
| T094 | Chain status | provider-chain.test.js | Status tests | 5 | 4 | 1 |
| T095 | Error propagation | provider-chain.test.js | Error tests | 5 | 3 | 2 |

**Test File:** `provider-chain.test.js`
**Test Count:** 28 tests
**Status:** COMPLETE

---

### T096-T100: Deferred Indexing

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T096 | Queue management | - | Queue tests | 5 | 0 | 5 |
| T097 | Batch processing | - | Batch tests | 5 | 0 | 5 |
| T098 | Priority ordering | - | Priority tests | 5 | 0 | 5 |
| T099 | Error recovery | - | Recovery tests | 5 | 0 | 5 |
| T100 | Queue persistence | - | Persistence tests | 5 | 0 | 5 |

**Test File:** NOT CREATED
**Test Count:** 0 tests
**Status:** GAP - Needs `deferred-indexing.test.js`
**Priority:** P2

---

### T101-T104: Retry Logic

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T101 | Exponential backoff | retry.test.js | Backoff tests | 10 | 12 | 0 |
| T102 | Error classification | retry.test.js | Classification tests | 10 | 10 | 0 |
| T103 | Retry limits | retry.test.js | Limit tests | 10 | 10 | 0 |
| T104 | Jitter calculation | retry.test.js | Jitter tests | 10 | 8 | 2 |

**Test File:** `retry.test.js`
**Test Count:** 40 tests
**Status:** COMPLETE

---

### T105-T107: Atomicity

| Task ID | Task Description | Test File | Test Cases | Target | Current | Gap |
|---------|------------------|-----------|------------|--------|---------|-----|
| T105 | Atomic write | transaction-manager.test.js | Write tests | 5 | 5 | 0 |
| T106 | Rollback on failure | transaction-manager.test.js | Rollback tests | 5 | 5 | 0 |
| T107 | Pending file recovery | transaction-manager.test.js | Recovery tests | 5 | 5 | 0 |

**Test File:** `transaction-manager.test.js`
**Test Count:** 9 tests
**Status:** COMPLETE

---

## Gap Analysis Summary

### Priority 1 Gaps (Critical Path)

| Gap ID | Task Range | Missing Tests | Priority | Effort |
|--------|------------|---------------|----------|--------|
| GAP-01 | T108-T113 | Template rendering tests | P1 | Medium |
| GAP-02 | T114-T117 | Command interface tests | P1 | Medium |
| GAP-03 | T119-T120 | /memory:context, /memory:why | P1 | Low |

### Priority 2 Gaps (Future Enhancement)

| Gap ID | Task Range | Missing Tests | Priority | Effort |
|--------|------------|---------------|----------|--------|
| GAP-04 | T079-T083 | Memory consolidation tests | P2 | High |
| GAP-05 | T016-T019 | Lazy model loading tests | P2 | Medium |
| GAP-06 | T096-T100 | Deferred indexing tests | P2 | Medium |
| GAP-07 | T020 | RRF k-parameter tests | P2 | Low |

### Priority 3 Gaps (Nice to Have)

| Gap ID | Task Range | Missing Tests | Priority | Effort |
|--------|------------|---------------|----------|--------|
| GAP-08 | T009-T011 | Recovery hints expansion | P3 | Low |
| GAP-09 | T040-T042 | Response format expansion | P3 | Low |

---

## Test File Inventory

| Test File | Tasks Covered | Test Count | Status |
|-----------|---------------|------------|--------|
| `tier-classifier.test.js` | T056-T058, T200-T280 | ~80 | COMPLETE |
| `attention-decay.test.js` | T005-T008, T301-T340 | ~85 | COMPLETE |
| `five-factor-scoring.test.js` | T032-T035 | 65 | COMPLETE |
| `composite-scoring.test.js` | T021-T027 | ~60 | COMPLETE |
| `fuzzy-match.test.js` | T028-T031, T076-T078 | ~50 | COMPLETE |
| `retry.test.js` | T101-T104 | 40 | COMPLETE |
| `continue-session.test.js` | T001-T004, T118, T123-T124 | ~40 | COMPLETE |
| `archival-manager.test.js` | T059 | 32 | COMPLETE |
| `cross-encoder.test.js` | T048-T051 | ~30 | COMPLETE |
| `interfaces.test.js` | T084-T086 | ~30 | COMPLETE |
| `provider-chain.test.js` | T091-T095 | 28 | COMPLETE |
| `intent-classifier.test.js` | T036-T039 | 25 | COMPLETE |
| `causal-edges.test.js` | T043-T047 | ~25 | COMPLETE |
| `tool-cache.test.js` | T012-T015 | ~20 | COMPLETE |
| `preflight.test.js` | T067-T070 | 19 | COMPLETE |
| `corrections.test.js` | T052-T055, T121-T122 | ~15 | COMPLETE |
| `incremental-index.test.js` | T064-T066 | ~10 | MOSTLY COMPLETE |
| `crash-recovery.test.js` | T071-T075 | 9 | NEEDS EXPANSION |
| `transaction-manager.test.js` | T105-T107 | 9 | COMPLETE |
| `api-key-validation.test.js` | T087-T090 | 6 | COMPLETE |
| `working-memory.test.js` | Working memory validation | ~45 | COMPLETE |
| `modularization.test.js` | T040-T042, T060-T063 | ~50 | MOSTLY COMPLETE |
| `co-activation.test.js` | Co-activation patterns | ~20 | COMPLETE |
| `fsrs-scheduler.test.js` | FSRS scheduling | ~25 | COMPLETE |
| `summary-generator.test.js` | Summary generation | ~15 | COMPLETE |
| `schema-migration.test.js` | Schema migrations | ~10 | COMPLETE |
| `prediction-error-gate.test.js` | Prediction error | ~15 | COMPLETE |
| `memory-save-integration.test.js` | Save integration | ~12 | COMPLETE |
| `memory-search-integration.test.js` | Search integration | ~10 | COMPLETE |

---

## Recommended Test Development Order

### Phase 1: Critical Gaps (Sprint 1)
1. `template-rendering.test.js` (T108-T113) - 30 tests
2. `command-interface.test.js` (T114-T117) - 20 tests
3. `context-command.test.js` (T119) - 10 tests
4. `why-command.test.js` (T120) - 10 tests

### Phase 2: Enhancement Gaps (Sprint 2)
5. `consolidation.test.js` (T079-T083) - 30 tests
6. `lazy-loading.test.js` (T016-T019) - 20 tests
7. `deferred-indexing.test.js` (T096-T100) - 25 tests
8. `rrf-fusion.test.js` (T020) - 10 tests

### Phase 3: Expansion (Sprint 3)
9. Expand `crash-recovery.test.js` - +10 tests
10. Expand `modularization.test.js` - +10 tests
11. Add recovery hints tests - +15 tests

---

## Verification Commands

```bash
# Run all tests
cd .opencode/skill/system-spec-kit/mcp_server
npm test

# Run specific test file
node tests/tier-classifier.test.js
node tests/attention-decay.test.js

# Run tests with coverage (if configured)
npm run test:coverage

# Count tests per file
grep -c "test\|it\|describe" tests/*.test.js
```

---

## Notes

1. **Test ID Ranges**: Test files use internal test IDs (e.g., T200-T280 in tier-classifier.test.js) that extend beyond the implementation task range (T001-T126) to provide comprehensive coverage.

2. **Overlap**: Some test files cover multiple task ranges where functionality is related (e.g., fuzzy-match.test.js covers both BM25 hybrid search and fuzzy matching).

3. **Integration vs Unit**: Some tasks are covered by integration tests in memory-save-integration.test.js and memory-search-integration.test.js rather than dedicated unit tests.

4. **Target Counts**: Target test counts are estimates based on 3-5 tests per requirement, with complex features requiring 8-15 tests.
