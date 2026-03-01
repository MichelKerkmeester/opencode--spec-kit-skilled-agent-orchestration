---
title: "Tasks: SpecKit Reimagined Test Suite [083-speckit-reimagined-test-suite/tasks]"
description: "Task Format: T### [P?] [B:T###?] Description (target file)"
trigger_phrases:
  - "tasks"
  - "speckit"
  - "reimagined"
  - "test"
  - "suite"
  - "083"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: SpecKit Reimagined Test Suite

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3plus-govern | v2.0 -->

---

## TASK NOTATION

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B:T###]` | Blocked by task T### |

**Task Format**: `T### [P?] [B:T###?] Description (target file)`

**Workstream Prefixes**:
- **W-TS**: Test Suite - Session Management
- **W-TR**: Test Suite - Retrieval/Search
- **W-TD**: Test Suite - Decay & Scoring
- **W-TG**: Test Suite - Graph/Relations
- **W-TI**: Test Suite - Infrastructure

---

> **TEST SUITE OVERVIEW:** This test suite validates all features implemented in 082-speckit-reimagined.
> Organized by workstream matching the implementation structure for traceability.
> Target: ~150 test tasks covering session, retrieval, decay, graph, and infrastructure.

---

## W-TS: Test Suite - Session Management (T001-T020)

### Session Deduplication Tests

- [ ] T001 [W-TS] Test SessionManager class instantiation with default config (`tests/session-manager.test.js`)
- [ ] T002 [W-TS][B:T001] Test hash generation for memory content fingerprinting
- [ ] T003 [W-TS][B:T001] Test `shouldSendMemory()` returns true for new memories
- [ ] T004 [W-TS][B:T001] Test `shouldSendMemory()` returns false for already-sent memories in same session
- [ ] T005 [W-TS][B:T001] Test `markMemorySent()` correctly tracks sent memory IDs
- [ ] T006 [W-TS][B:T001] Test session ID generation is unique per session
- [ ] T007 [W-TS][B:T001] Test memory filtering removes duplicates from search results
- [ ] T008 [W-TS][B:T001] Test dedup_savings_tokens calculation accuracy

### Crash Recovery Tests

- [ ] T009 [W-TS] Test session_state table schema creation on first startup (`tests/crash-recovery.test.js`)
- [ ] T010 [W-TS][B:T009] Test `saveSessionState()` persists to SQLite immediately
- [ ] T011 [W-TS][B:T009] Test session status transitions: active -> completed
- [ ] T012 [W-TS][B:T009] Test session status transitions: active -> interrupted (on crash)
- [ ] T013 [W-TS][B:T009] Test `resetInterruptedSessions()` marks active as interrupted on startup
- [ ] T014 [W-TS][B:T009] Test `recoverState()` retrieves interrupted session data
- [ ] T015 [W-TS][B:T009] Test `_recovered` flag is set to true after recovery
- [ ] T016 [W-TS][B:T009] Test `getInterruptedSessions()` lists all recoverable sessions

### CONTINUE_SESSION.md Generation Tests

- [ ] T017 [W-TS] Test `generateContinueSessionMd()` creates valid markdown (`tests/continue-session.test.js`)
- [ ] T018 [W-TS][B:T017] Test session state table is included in generated markdown
- [ ] T019 [W-TS][B:T017] Test context summary is included in generated markdown
- [ ] T020 [W-TS][B:T017] Test quick resume command is correctly formatted

---

## W-TR: Test Suite - Retrieval/Search (T021-T050)

### RRF Fusion Tests

- [ ] T021 [W-TR] Test RRF fusion with default k=60 parameter (`tests/rrf-fusion.test.js`)
- [ ] T022 [W-TR][B:T021] Test RRF score formula: 1/(k + rank) produces correct values
- [ ] T023 [W-TR][B:T021] Test source tracking marks results with in_vector, in_fts, in_graph flags
- [ ] T024 [W-TR][B:T021] Test source_count correctly reflects number of sources
- [ ] T025 [W-TR][B:T021] Test 10% convergence bonus applied when source_count >= 2
- [ ] T026 [W-TR][B:T021] Test convergence bonus NOT applied for single-source results
- [ ] T027 [W-TR][B:T021] Test ENABLE_RRF_FUSION feature flag disables fusion when false
- [ ] T028 [W-TR][B:T021] Test single-source optimization bypasses fusion overhead
- [ ] T029 [W-TR][B:T021] Test rank positions (vector_rank, fts_rank, graph_rank) tracked correctly
- [ ] T030 [W-TR][B:T021] Test unified_search() combines vector + BM25 + graph sources

### BM25 Tests

- [ ] T031 [W-TR] Test BM25Index class instantiation (`tests/bm25-index.test.js`)
- [ ] T032 [W-TR][B:T031] Test tokenization splits text correctly
- [ ] T033 [W-TR][B:T031] Test Porter stemmer subset reduces words to stems
- [ ] T034 [W-TR][B:T031] Test inverted index construction from documents
- [ ] T035 [W-TR][B:T031] Test IDF calculation for term importance
- [ ] T036 [W-TR][B:T031] Test BM25 scoring with k1=1.2, b=0.75 parameters
- [ ] T037 [W-TR][B:T031] Test ENABLE_BM25 feature flag controls activation
- [ ] T038 [W-TR][B:T031] Test BM25 integration with hybrid search pipeline
- [ ] T039 [W-TR][B:T031] Test combined_lexical_search() merges FTS5 + BM25 results

### Cross-Encoder Tests

- [ ] T040 [W-TR] Test cross-encoder provider configuration for Voyage (`tests/cross-encoder.test.js`)
- [ ] T041 [W-TR][P] Test cross-encoder provider configuration for Cohere
- [ ] T042 [W-TR][P] Test cross-encoder provider configuration for local model
- [ ] T043 [W-TR][B:T040] Test provider auto-resolution fallback order: voyage -> cohere -> local
- [ ] T044 [W-TR][B:T040] Test rerank cache key generation with SHA-256
- [ ] T045 [W-TR][B:T040] Test cache TTL of 5 minutes (300000ms)
- [ ] T046 [W-TR][B:T040] Test cache max size of 1000 entries
- [ ] T047 [W-TR][B:T040] Test LRU-style eviction when cache full
- [ ] T048 [W-TR][B:T040] Test P95 latency tracking with auto-disable if > 500ms
- [ ] T049 [W-TR][B:T040] Test length penalty calculation for short content
- [ ] T050 [W-TR][B:T040] Test MAX_RERANK_CANDIDATES = 20 limit enforced

### Intent Classifier Tests

- [ ] T051 [W-TR] Test intent classification for add_feature queries (`tests/intent-classifier.test.js`)
- [ ] T052 [W-TR][P] Test intent classification for fix_bug queries
- [ ] T053 [W-TR][P] Test intent classification for refactor queries
- [ ] T054 [W-TR][P] Test intent classification for security_audit queries
- [ ] T055 [W-TR][P] Test intent classification for understand queries
- [ ] T056 [W-TR][B:T051] Test keyword scoring with primary=1.0, secondary=0.5
- [ ] T057 [W-TR][B:T051] Test pattern matching combined with keyword scoring (60/40 weight)
- [ ] T058 [W-TR][B:T051] Test intent-specific weight adjustments applied correctly
- [ ] T059 [W-TR][B:T051] Test autoDetectIntent parameter in memory_search
- [ ] T060 [W-TR][B:T051] Test 80% overall detection accuracy target

### Fuzzy Matching Tests

- [ ] T061 [W-TR] Test Levenshtein distance calculation (`tests/fuzzy-match.test.js`)
- [ ] T062 [W-TR][B:T061] Test MAX_EDIT_DISTANCE = 2 threshold
- [ ] T063 [W-TR][B:T061] Test ACRONYM_MAP expansion for technical terms (RRF, BM25, FSRS, etc.)
- [ ] T064 [W-TR][B:T061] Test stop words filtering prevents false positives
- [ ] T065 [W-TR][B:T061] Test COMMON_TYPOS correction map
- [ ] T066 [W-TR][B:T061] Test expand_query_with_fuzzy() returns expanded query
- [ ] T067 [W-TR][B:T061] Test ENABLE_FUZZY_MATCH feature flag

---

## W-TD: Test Suite - Decay & Scoring (T068-T097)

### Type-Specific Half-Lives Tests

- [ ] T068 [W-TD] Test MEMORY_TYPES object contains 9 types (`tests/memory-types.test.js`)
- [ ] T069 [W-TD][B:T068] Test working memory half-life = 1 day
- [ ] T070 [W-TD][B:T068] Test episodic memory half-life = 7 days
- [ ] T071 [W-TD][B:T068] Test prospective memory half-life = 14 days
- [ ] T072 [W-TD][B:T068] Test implicit memory half-life = 30 days
- [ ] T073 [W-TD][B:T068] Test declarative memory half-life = 60 days
- [ ] T074 [W-TD][B:T068] Test procedural memory half-life = 90 days
- [ ] T075 [W-TD][B:T068] Test semantic memory half-life = 180 days
- [ ] T076 [W-TD][B:T068] Test autobiographical memory half-life = 365 days
- [ ] T077 [W-TD][B:T068] Test meta-cognitive memory half-life = null (no decay)
- [ ] T078 [W-TD][B:T068] Test type inference from file path patterns
- [ ] T079 [W-TD][B:T068] Test type inference from frontmatter
- [ ] T080 [W-TD][B:T068] Test type inference from importance_tier mapping
- [ ] T081 [W-TD][B:T068] Test type inference from keywords in title
- [ ] T082 [W-TD][B:T068] Test default type fallback when no pattern matches

### Composite Scoring Tests

- [ ] T083 [W-TD] Test 5-factor composite score calculation (`tests/composite-scoring.test.js`)
- [ ] T084 [W-TD][B:T083] Test temporal factor weight = 0.25
- [ ] T085 [W-TD][B:T083] Test usage factor weight = 0.15
- [ ] T086 [W-TD][B:T083] Test importance factor weight = 0.25
- [ ] T087 [W-TD][B:T083] Test pattern factor weight = 0.20
- [ ] T088 [W-TD][B:T083] Test citation factor weight = 0.15
- [ ] T089 [W-TD][B:T083] Test FSRS formula: Math.pow(1 + 0.235 * (days/stability), -0.5)
- [ ] T090 [W-TD][B:T083] Test usage boost formula: min(1.5, 1.0 + count * 0.05)
- [ ] T091 [W-TD][B:T083] Test citation recency formula: 1 / (1 + days * 0.1)
- [ ] T092 [W-TD][B:T083] Test pattern alignment bonuses (exact=0.3, partial=0.15, anchor=0.25, type=0.2)
- [ ] T093 [W-TD][B:T083] Test score normalization to 0-1 range

### 5-State Model Tests

- [ ] T094 [W-TD] Test STATE_THRESHOLDS configuration (`tests/tier-classifier.test.js`)
- [ ] T095 [W-TD][B:T094] Test HOT state threshold > 0.80
- [ ] T096 [W-TD][B:T094] Test WARM state threshold 0.50-0.80
- [ ] T097 [W-TD][B:T094] Test COLD state threshold 0.25-0.50
- [ ] T098 [W-TD][B:T094] Test DORMANT state threshold 0.10-0.25
- [ ] T099 [W-TD][B:T094] Test ARCHIVED state threshold < 0.10
- [ ] T100 [W-TD][B:T094] Test classifyState() returns correct state for given retrievability
- [ ] T101 [W-TD][B:T094] Test state transitions are monotonic (no skipping states)
- [ ] T102 [W-TD][B:T094] Test filter_by_memory_state() in memory_search
- [ ] T103 [W-TD][B:T094] Test minState parameter excludes lower states

### Archival Tests

- [ ] T104 [W-TD] Test archival detection for memories > 90 days inactive (`tests/archival-manager.test.js`)
- [ ] T105 [W-TD][B:T104] Test is_archived column values: 0=active, 1=archived, 2=soft_deleted
- [ ] T106 [W-TD][B:T104] Test background archival job runs at configured interval
- [ ] T107 [W-TD][B:T104] Test ARCHIVAL_SCAN_INTERVAL_MS configuration
- [ ] T108 [W-TD][B:T104] Test constitutional memories never archived (protected tier)
- [ ] T109 [W-TD][B:T104] Test critical memories never archived (protected tier)
- [ ] T110 [W-TD][B:T104] Test ARCHIVAL_ACTION='mark' sets is_archived=1
- [ ] T111 [W-TD][B:T104] Test ARCHIVAL_ACTION='soft_delete' sets is_archived=2
- [ ] T112 [W-TD][B:T104] Test ARCHIVAL_ACTION='log_only' does not modify records

### Consolidation Tests (5 Phases)

- [ ] T113 [W-TD] Test REPLAY phase selects episodic > 7 days (`tests/consolidation.test.js`)
- [ ] T114 [W-TD][B:T113] Test REPLAY phase respects minAgeDays configuration
- [ ] T115 [W-TD][B:T113] Test ABSTRACT phase extracts patterns with 2+ occurrences
- [ ] T116 [W-TD][B:T113] Test ABSTRACT phase groups by content hash
- [ ] T117 [W-TD][B:T113] Test ABSTRACT phase groups by trigger similarity
- [ ] T118 [W-TD][B:T113] Test ABSTRACT phase groups by title similarity
- [ ] T119 [W-TD][B:T115] Test INTEGRATE phase creates semantic memories from patterns
- [ ] T120 [W-TD][B:T119] Test INTEGRATE phase strength threshold = 0.6
- [ ] T121 [W-TD][B:T119] Test INTEGRATE phase dry-run mode
- [ ] T122 [W-TD][B:T119] Test PRUNE phase archives redundant episodic memories
- [ ] T123 [W-TD][B:T122] Test PRUNE phase preserves at least 1 representative per pattern
- [ ] T124 [W-TD][B:T122] Test PRUNE phase backup creation before pruning
- [ ] T125 [W-TD][B:T122] Test STRENGTHEN phase boosts memories with 5+ accesses
- [ ] T126 [W-TD][B:T125] Test STRENGTHEN phase applies 30% stability boost
- [ ] T127 [W-TD][B:T125] Test STRENGTHEN phase caps stability at 365 days

---

## W-TG: Test Suite - Graph/Relations (T128-T147)

### Causal Edges Tests

- [ ] T128 [W-TG] Test causal_edges table schema (v8 migration) (`tests/causal-edges.test.js`)
- [ ] T129 [W-TG][B:T128] Test RELATION_TYPES constant contains 6 types
- [ ] T130 [W-TG][B:T128] Test 'caused' relation type
- [ ] T131 [W-TG][B:T128] Test 'enabled' relation type
- [ ] T132 [W-TG][B:T128] Test 'supersedes' relation type
- [ ] T133 [W-TG][B:T128] Test 'contradicts' relation type
- [ ] T134 [W-TG][B:T128] Test 'derived_from' relation type
- [ ] T135 [W-TG][B:T128] Test 'supports' relation type
- [ ] T136 [W-TG][B:T128] Test insert_edge() validates required fields
- [ ] T137 [W-TG][B:T128] Test insert_edge() validates strength bounds 0-1
- [ ] T138 [W-TG][B:T128] Test insert_edge() prevents self-referential edges
- [ ] T139 [W-TG][B:T128] Test get_causal_chain() depth-limited traversal (max 10)
- [ ] T140 [W-TG][B:T128] Test get_causal_chain() cycle detection via visited Set
- [ ] T141 [W-TG][B:T128] Test memory_drift_why tool returns decision lineage

### Corrections Tests

- [ ] T142 [W-TG] Test memory_corrections table schema (v9 migration) (`tests/corrections.test.js`)
- [ ] T143 [W-TG][B:T142] Test CORRECTION_TYPES: superseded, deprecated, refined, merged
- [ ] T144 [W-TG][B:T142] Test record_correction() applies 0.5x stability penalty
- [ ] T145 [W-TG][B:T142] Test CORRECTION_STABILITY_PENALTY = 0.5
- [ ] T146 [W-TG][B:T142] Test replacement memory gets REPLACEMENT_STABILITY_BOOST = 1.2x
- [ ] T147 [W-TG][B:T142] Test correction_type tracking in database

---

## W-TI: Test Suite - Infrastructure (T148-T200)

### Response Envelope Tests

- [ ] T148 [W-TI] Test response envelope structure: summary, data, hints, meta (`tests/envelope.test.js`)
- [ ] T149 [W-TI][B:T148] Test createResponse() returns valid envelope
- [ ] T150 [W-TI][B:T148] Test createSuccessResponse() sets isError=false
- [ ] T151 [W-TI][B:T148] Test createEmptyResponse() handles no results
- [ ] T152 [W-TI][B:T148] Test createErrorResponse() includes recovery hints
- [ ] T153 [W-TI][B:T148] Test meta.tokenCount estimation accuracy
- [ ] T154 [W-TI][B:T148] Test meta.latencyMs measurement
- [ ] T155 [W-TI][B:T148] Test meta.cacheHit flag

### Preflight Validation Tests

- [ ] T156 [W-TI] Test run_preflight() combines all validation checks (`tests/preflight.test.js`)
- [ ] T157 [W-TI][B:T156] Test PreflightError class structure
- [ ] T158 [W-TI][B:T156] Test PreflightErrorCodes enum values
- [ ] T159 [W-TI][B:T156] Test anchor format validation - valid ID format
- [ ] T160 [W-TI][B:T156] Test anchor format validation - unique IDs
- [ ] T161 [W-TI][B:T156] Test anchor format validation - matching open/close tags
- [ ] T162 [W-TI][B:T156] Test anchor format validation - unclosed anchor detection
- [ ] T163 [W-TI][B:T156] Test duplicate check - exact match via content hash
- [ ] T164 [W-TI][B:T156] Test duplicate check - similar match via vector (threshold 0.95)
- [ ] T165 [W-TI][B:T156] Test token budget estimation (~3.5 chars/token)
- [ ] T166 [W-TI][B:T156] Test token budget warning at 80% threshold

### Provider Chain Tests

- [ ] T167 [W-TI] Test EmbeddingProviderChain class instantiation (`tests/provider-chain.test.js`)
- [ ] T168 [W-TI][B:T167] Test fallback order: Primary API -> Local -> BM25-only
- [ ] T169 [W-TI][B:T167] Test Voyage provider as primary
- [ ] T170 [W-TI][B:T167] Test OpenAI provider as alternative primary
- [ ] T171 [W-TI][B:T167] Test HfLocalProvider as secondary fallback
- [ ] T172 [W-TI][B:T167] Test ENABLE_LOCAL_FALLBACK env var control
- [ ] T173 [W-TI][B:T167] Test BM25OnlyProvider as tertiary fallback
- [ ] T174 [W-TI][B:T167] Test BM25OnlyProvider returns null for embed methods
- [ ] T175 [W-TI][B:T167] Test getFallbackLog() returns full fallback history
- [ ] T176 [W-TI][B:T167] Test fallback reason classification (API_KEY_INVALID, TIMEOUT, etc.)

### API Key Validation Tests

- [ ] T177 [W-TI] Test validateApiKey() for Voyage provider (`tests/api-validation.test.js`)
- [ ] T178 [W-TI][P] Test validateApiKey() for OpenAI provider
- [ ] T179 [W-TI][B:T177] Test validateApiKey() skips local providers (hf-local, ollama)
- [ ] T180 [W-TI][B:T177] Test validation timeout of 5 seconds (VALIDATION_TIMEOUT_MS)
- [ ] T181 [W-TI][B:T177] Test auth error detection (401, 403)
- [ ] T182 [W-TI][B:T177] Test rate limit detection (429)
- [ ] T183 [W-TI][B:T177] Test service error detection (5xx)
- [ ] T184 [W-TI][B:T177] Test SPECKIT_SKIP_API_VALIDATION bypass flag

### Retry Logic Tests

- [ ] T185 [W-TI] Test retryWithBackoff() basic functionality (`tests/retry.test.js`)
- [ ] T186 [W-TI][B:T185] Test exponential backoff: 1s, 2s, 4s intervals
- [ ] T187 [W-TI][B:T185] Test transient error retry: 5xx status codes
- [ ] T188 [W-TI][B:T185] Test transient error retry: ETIMEDOUT, ECONNRESET, ECONNREFUSED
- [ ] T189 [W-TI][B:T185] Test permanent error fail-fast: 401, 403 status codes
- [ ] T190 [W-TI][B:T185] Test isPermanent flag on permanent errors
- [ ] T191 [W-TI][B:T185] Test retry attempt logging with error classification

### Transaction Atomicity Tests

- [ ] T192 [W-TI] Test execute_atomic_save() wraps file + index in transaction (`tests/transaction-manager.test.js`)
- [ ] T193 [W-TI][B:T192] Test temp file + rename strategy for atomic writes
- [ ] T194 [W-TI][B:T192] Test file rollback (deletion) on index failure
- [ ] T195 [W-TI][B:T192] Test file renamed with _pending suffix on failure (alternative)
- [ ] T196 [W-TI][B:T192] Test recover_pending_files() on MCP startup
- [ ] T197 [W-TI][B:T192] Test find_pending_files() scans recursively
- [ ] T198 [W-TI][B:T192] Test recover_all_pending_files() processes up to 50 files
- [ ] T199 [W-TI][B:T192] Test pending file recovery re-indexes after rename
- [ ] T200 [W-TI][B:T192] Test metrics tracking for rollback count

---

## COMPLETION CRITERIA

- [ ] All W-TS tasks (T001-T020) marked `[x]` - Session Management tests
- [ ] All W-TR tasks (T021-T067) marked `[x]` - Retrieval/Search tests
- [ ] All W-TD tasks (T068-T127) marked `[x]` - Decay & Scoring tests
- [ ] All W-TG tasks (T128-T147) marked `[x]` - Graph/Relations tests
- [ ] All W-TI tasks (T148-T200) marked `[x]` - Infrastructure tests
- [ ] No `[B]` blocked tasks remaining - All dependencies satisfied
- [ ] All tests passing in Jest test runner
- [ ] Test coverage report generated
- [ ] Integration tests verified against live SQLite database

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

Before starting each test task, verify:

1. [ ] Corresponding implementation task from 082-speckit-reimagined is complete
2. [ ] Target test file exists or create it
3. [ ] Understand the function/module being tested
4. [ ] Identify edge cases and boundary conditions
5. [ ] Check test dependencies are satisfied (`[B:T###]` markers)
6. [ ] Review existing tests for patterns to follow
7. [ ] Confirm test isolation (no cross-test state leakage)
8. [ ] Begin test implementation only after all checks pass

### Execution Rules

| Rule | Description |
|------|-------------|
| TEST-ISOLATION | Each test must be independent and repeatable |
| TEST-NAMING | Use descriptive names: `test_[function]_[scenario]_[expected]` |
| TEST-ARRANGE | Follow Arrange-Act-Assert pattern |
| TEST-MOCK | Mock external dependencies (APIs, file system) |
| TEST-PARALLEL | Tasks marked `[P]` can run concurrently |

### HALT Conditions

The AI agent MUST stop execution and escalate when:

| Condition | Trigger | Action |
|-----------|---------|--------|
| **Missing Implementation** | Test target function doesn't exist | HALT -> Verify 082 task complete -> Resume |
| **Flaky Test** | Test passes/fails inconsistently | HALT -> Investigate timing/state -> Fix isolation |
| **Coverage Gap** | Critical path not covered | HALT -> Add missing tests -> Document gap |
| **Dependency Conflict** | Test requires unavailable resource | HALT -> Mock or skip with reason |

### Test File Organization

```
mcp_server/tests/
├── session-manager.test.js      # W-TS T001-T008
├── crash-recovery.test.js       # W-TS T009-T016
├── continue-session.test.js     # W-TS T017-T020
├── rrf-fusion.test.js           # W-TR T021-T030
├── bm25-index.test.js           # W-TR T031-T039
├── cross-encoder.test.js        # W-TR T040-T050
├── intent-classifier.test.js    # W-TR T051-T060
├── fuzzy-match.test.js          # W-TR T061-T067
├── memory-types.test.js         # W-TD T068-T082
├── composite-scoring.test.js    # W-TD T083-T093
├── tier-classifier.test.js      # W-TD T094-T103
├── archival-manager.test.js     # W-TD T104-T112
├── consolidation.test.js        # W-TD T113-T127
├── causal-edges.test.js         # W-TG T128-T141
├── corrections.test.js          # W-TG T142-T147
├── envelope.test.js             # W-TI T148-T155
├── preflight.test.js            # W-TI T156-T166
├── provider-chain.test.js       # W-TI T167-T176
├── api-validation.test.js       # W-TI T177-T184
├── retry.test.js                # W-TI T185-T191
└── transaction-manager.test.js  # W-TI T192-T200
```

---

## WORKSTREAM ORGANIZATION

### W-TS: Test Suite - Session Management

| Task Range | Description | Test File |
|------------|-------------|-----------|
| T001-T008 | Session deduplication | session-manager.test.js |
| T009-T016 | Crash recovery | crash-recovery.test.js |
| T017-T020 | CONTINUE_SESSION.md generation | continue-session.test.js |

### W-TR: Test Suite - Retrieval/Search

| Task Range | Description | Test File |
|------------|-------------|-----------|
| T021-T030 | RRF fusion (k=60, convergence bonus) | rrf-fusion.test.js |
| T031-T039 | BM25 (tokenization, scoring) | bm25-index.test.js |
| T040-T050 | Cross-encoder (providers, caching) | cross-encoder.test.js |
| T051-T060 | Intent classifier (5 intents) | intent-classifier.test.js |
| T061-T067 | Fuzzy matching (Levenshtein, acronyms) | fuzzy-match.test.js |

### W-TD: Test Suite - Decay & Scoring

| Task Range | Description | Test File |
|------------|-------------|-----------|
| T068-T082 | Type-specific half-lives (9 types) | memory-types.test.js |
| T083-T093 | Composite scoring (5 factors) | composite-scoring.test.js |
| T094-T103 | 5-state model (thresholds, transitions) | tier-classifier.test.js |
| T104-T112 | Archival (detection, background job) | archival-manager.test.js |
| T113-T127 | Consolidation (5 phases) | consolidation.test.js |

### W-TG: Test Suite - Graph/Relations

| Task Range | Description | Test File |
|------------|-------------|-----------|
| T128-T141 | Causal edges (6 relations, traversal) | causal-edges.test.js |
| T142-T147 | Corrections (penalties, boosts) | corrections.test.js |

### W-TI: Test Suite - Infrastructure

| Task Range | Description | Test File |
|------------|-------------|-----------|
| T148-T155 | Response envelope | envelope.test.js |
| T156-T166 | Preflight validation | preflight.test.js |
| T167-T176 | Provider chain (fallback, logging) | provider-chain.test.js |
| T177-T184 | API key validation | api-validation.test.js |
| T185-T191 | Retry logic (backoff, transient errors) | retry.test.js |
| T192-T200 | Transaction atomicity | transaction-manager.test.js |

---

## CROSS-REFERENCES

- **Implementation Spec**: See `../082-speckit-reimagined/spec.md`
- **Implementation Tasks**: See `../082-speckit-reimagined/tasks.md`
- **Implementation Plan**: See `../082-speckit-reimagined/plan.md`
- **Test Runner**: `npm test` in `mcp_server/` directory
- **Coverage Report**: `npm run test:coverage`

---

<!--
LEVEL 3+ TEST SUITE TEMPLATE (~450 lines)
- 200 test tasks across 5 workstreams
- W-TS: Session Management (T001-T020)
- W-TR: Retrieval/Search (T021-T067)
- W-TD: Decay & Scoring (T068-T127)
- W-TG: Graph/Relations (T128-T147)
- W-TI: Infrastructure (T148-T200)
- Dependency tracking with [B:T###] notation
- Test file organization and naming conventions
- AI execution protocol for test implementation
-->
