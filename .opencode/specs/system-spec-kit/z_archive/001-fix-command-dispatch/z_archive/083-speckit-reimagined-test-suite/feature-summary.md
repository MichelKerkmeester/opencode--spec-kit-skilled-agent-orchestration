# SpecKit Reimagined Test Suite: Feature Summary

> **Test coverage for 33 features** organized by functional category with current vs. target test state analysis.

---

## Overview

This document maps the complete test coverage requirements for the SpecKit Reimagined specification (082). Each feature is documented with:
- **Test file location** - Where tests exist or should be created
- **Current state** - What tests exist today
- **Target state** - What tests are required for complete coverage
- **Key test cases** - Critical scenarios that must be verified

**Test Location:** `.opencode/skill/system-spec-kit/mcp_server/tests/`

---

## CATEGORY A: SEARCH & RETRIEVAL TESTS (Features 1-6)

### Feature 1: RRF Search Fusion Tests

**Test File:** `rrf-fusion.test.js` (to create) | Related: `composite-scoring.test.js`

**Current State:**
- RRF fusion exists in `lib/search/rrf-fusion.js`
- No dedicated unit tests for RRF algorithm
- Composite scoring tests exist but don't cover RRF-specific behavior

**Target State:**
- Dedicated RRF fusion test suite
- Coverage for k=60 parameter behavior
- Multi-source ranking verification
- Convergence bonus calculation

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| RRF-001 | Verify k=60 fusion constant produces expected ranking | P0 |
| RRF-002 | Verify 10% convergence bonus for multi-source results | P0 |
| RRF-003 | Verify RRF formula: `score = weight / (k + rank + 1)` | P0 |
| RRF-004 | Verify results from single source rank correctly | P1 |
| RRF-005 | Verify triple-hybrid fusion (vector + BM25 + graph) | P1 |
| RRF-006 | Verify source weights (vector 1.0x, BM25 1.0x, graph 1.5x) | P1 |
| RRF-007 | Verify empty source lists don't break fusion | P1 |
| RRF-008 | Verify tie-breaking behavior for equal scores | P2 |

---

### Feature 2: BM25 Hybrid Search Tests

**Test File:** `bm25-index.test.js` (to create)

**Current State:**
- FTS5 used for keyword search
- No dedicated BM25 implementation tests
- No WASM fallback tests

**Target State:**
- BM25 algorithm verification
- Tokenization tests
- FTS5 integration tests
- WASM vs JS fallback tests

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| BM25-001 | Verify BM25 tokenization handles code identifiers | P0 |
| BM25-002 | Verify k1=1.5 and b=0.75 parameter behavior | P0 |
| BM25-003 | Verify BM25 scoring ranks exact matches higher | P0 |
| BM25-004 | Verify FTS5 integration produces BM25-compatible scores | P1 |
| BM25-005 | Verify WASM implementation matches JS fallback results | P1 |
| BM25-006 | Verify graceful fallback when WASM unavailable | P1 |
| BM25-007 | Verify acronym handling (FSRS, RRF, etc.) | P1 |
| BM25-008 | Verify document length normalization | P2 |

---

### Feature 3: Cross-Encoder Reranking Tests

**Test File:** `cross-encoder.test.js` (exists)

**Current State:**
- Test file exists with basic structure
- Provider fallback tests needed
- Latency limit tests needed

**Target State:**
- Complete provider fallback chain tests
- Result caching verification
- Latency threshold enforcement
- Length penalty verification

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| XE-001 | Verify provider fallback chain (Voyage -> Cohere -> skip) | P0 |
| XE-002 | Verify result caching reduces API calls | P0 |
| XE-003 | Verify P95 latency <500ms or auto-disable | P0 |
| XE-004 | Verify length penalty (0.8-1.0x) for content <100 chars | P0 |
| XE-005 | Verify top-20 candidate selection | P1 |
| XE-006 | Verify cross-encoder score normalization | P1 |
| XE-007 | Verify timeout handling (skip reranking on timeout) | P1 |
| XE-008 | Verify `options.rerank` parameter controls behavior | P2 |

---

### Feature 4: Query Expansion Tests

**Test File:** `fuzzy-match.test.js` (exists) | `query-expansion.test.js` (to create)

**Current State:**
- Fuzzy match tests exist
- Levenshtein distance tests present
- No acronym expansion tests

**Target State:**
- Comprehensive typo tolerance tests
- Acronym-to-expansion mapping tests
- Query rewriting verification

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| QE-001 | Verify Levenshtein distance max 2 catches common typos | P0 |
| QE-002 | Verify "FFRS" matches "FSRS" | P0 |
| QE-003 | Verify "RFF" matches "RRF" | P0 |
| QE-004 | Verify acronym expansion (FSRS -> "spaced repetition") | P1 |
| QE-005 | Verify ACRONYM_MAP fuzzy lookup | P1 |
| QE-006 | Verify expansion doesn't occur for exact matches | P1 |
| QE-007 | Verify case-insensitive matching | P2 |
| QE-008 | Verify multi-word query expansion | P2 |

---

### Feature 5: Intent-Aware Retrieval Tests

**Test File:** `intent-classifier.test.js` (exists)

**Current State:**
- Intent classifier tests exist
- Basic intent detection verified
- Weight adjustment tests needed

**Target State:**
- 5 intent types verified
- Intent-specific weight profiles
- Auto-detection from query phrasing
- Parameter override tests

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| INT-001 | Verify 5 intents classified: add_feature, fix_bug, refactor, security_audit, understand | P0 |
| INT-002 | Verify fix_bug weights error-related memories higher | P0 |
| INT-003 | Verify intent auto-detection from query phrasing | P0 |
| INT-004 | Verify explicit `intent` parameter overrides detection | P1 |
| INT-005 | Verify add_feature weights architecture memories higher | P1 |
| INT-006 | Verify security_audit weights security-related memories | P1 |
| INT-007 | Verify default weights when intent unclear | P2 |
| INT-008 | Verify intent persists across session queries | P2 |

---

### Feature 6: Graph-Enhanced Search Tests

**Test File:** `causal-edges.test.js` (exists) | `graph-search.test.js` (to create)

**Current State:**
- Causal edges tests exist for relationship storage
- No graph traversal in search tests
- No fusion weight tests for graph results

**Target State:**
- Graph traversal integration with search
- 1.5x weight verification for graph results
- Depth limit enforcement

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| GS-001 | Verify graph results included in RRF fusion | P0 |
| GS-002 | Verify graph results weighted 1.5x | P0 |
| GS-003 | Verify 3-hop traversal limit respected | P0 |
| GS-004 | Verify `includeGraph` parameter controls behavior | P1 |
| GS-005 | Verify "caused", "supersedes", "supports" traversal | P1 |
| GS-006 | Verify circular reference handling | P1 |
| GS-007 | Verify empty graph doesn't break search | P2 |
| GS-008 | Verify graph + semantic results deduplicated | P2 |

---

## CATEGORY B: MEMORY DECAY & LIFECYCLE TESTS (Features 7-10)

### Feature 7: Type-Specific Half-Lives Tests

**Test File:** `tier-classifier.test.js` (exists) | `attention-decay.test.js` (exists)

**Current State:**
- Tier classifier tests exist
- Attention decay tests exist
- Type inference tests needed
- 9 memory type tests needed

**Target State:**
- All 9 memory types verified with distinct half-lives
- Type inference from path + frontmatter
- Constitutional "infinite" half-life verified

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| THL-001 | Verify 9 memory types configured with distinct half-lives | P0 |
| THL-002 | Verify constitutional memories never decay (infinite half-life) | P0 |
| THL-003 | Verify type inference from file path | P0 |
| THL-004 | Verify type inference from frontmatter fallback | P0 |
| THL-005 | Verify procedural half-life (90+ days) | P1 |
| THL-006 | Verify semantic half-life (60 days) | P1 |
| THL-007 | Verify episodic half-life (14 days) | P1 |
| THL-008 | Verify working memory half-life (1 day) | P1 |
| THL-009 | Verify +20% tier accuracy improvement | P2 |

---

### Feature 8: Multi-Factor Decay Tests

**Test File:** `five-factor-scoring.test.js` (exists) | `composite-scoring.test.js` (exists)

**Current State:**
- Five-factor scoring tests exist
- Composite scoring tests exist
- 5-factor composite calculation verified
- Usage tracking column tests needed

**Target State:**
- Full 5-factor multiplication verified
- Individual factor contribution tests
- Factor capping verified (e.g., usage max 1.5x)

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| MFD-001 | Verify 5-factor composite: temporal x usage x importance x pattern x citation | P0 |
| MFD-002 | Verify temporal factor uses FSRS formula | P0 |
| MFD-003 | Verify usage factor capped at 1.5x | P0 |
| MFD-004 | Verify importance factor by tier (critical=1.5x, high=1.2x) | P0 |
| MFD-005 | Verify pattern factor +20% for task alignment | P1 |
| MFD-006 | Verify citation factor +10% for recent citations | P1 |
| MFD-007 | Verify factor interaction (multiplicative, not additive) | P1 |
| MFD-008 | Verify score normalization to 0-1 range | P2 |

---

### Feature 9: 5-State Memory Model Tests

**Test File:** `tier-classifier.test.js` (exists)

**Current State:**
- 5 states implemented (HOT/WARM/COLD/DORMANT/ARCHIVED)
- Basic threshold tests exist
- State transition tests needed
- Search filtering by state tests needed

**Target State:**
- All 5 state thresholds verified
- Bidirectional state transitions
- Search filter enforcement

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| SM-001 | Verify HOT threshold (0.80-1.00) | P0 |
| SM-002 | Verify WARM threshold (0.25-0.80) | P0 |
| SM-003 | Verify COLD threshold (0.05-0.25) | P0 |
| SM-004 | Verify DORMANT threshold (0.02-0.05) | P0 |
| SM-005 | Verify ARCHIVED threshold (0.00-0.02) | P0 |
| SM-006 | Verify ARCHIVED excluded from default search | P0 |
| SM-007 | Verify state transitions on score change | P1 |
| SM-008 | Verify explicit request retrieves DORMANT | P1 |
| SM-009 | Verify state computed from attention score | P2 |

---

### Feature 10: Usage Boost Tests

**Test File:** `attention-decay.test.js` (exists) | `access-tracker.test.js` (to create)

**Current State:**
- Attention decay tests exist
- Access tracking incomplete
- Boost formula tests needed

**Target State:**
- Access count tracking verified
- Boost formula (count x 0.05, max 1.5x) verified
- Write overhead acceptable

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| UB-001 | Verify access_count incremented on retrieval | P0 |
| UB-002 | Verify boost formula: count x 0.05 | P0 |
| UB-003 | Verify boost capped at 1.5x | P0 |
| UB-004 | Verify last_accessed_at updated | P1 |
| UB-005 | Verify +15% relevance for frequently accessed | P1 |
| UB-006 | Verify zero access count defaults to no boost | P1 |
| UB-007 | Verify batch retrieval updates all accessed | P2 |
| UB-008 | Verify write overhead <10ms per search | P2 |

---

## CATEGORY C: SESSION MANAGEMENT TESTS (Features 11-14)

### Feature 11: Session Deduplication Tests

**Test File:** `session-dedup.test.js` (to create)

**Current State:**
- No session deduplication tests
- No SessionManager tests
- No token savings verification

**Target State:**
- SessionManager functionality verified
- Hash-based dedup working
- Token savings measured

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| SD-001 | Verify sentMemories Set tracks surfaced memories | P0 |
| SD-002 | Verify shouldSendMemory returns false for duplicates | P0 |
| SD-003 | Verify O(1) lookup performance | P0 |
| SD-004 | Verify -50% tokens on follow-up queries | P0 |
| SD-005 | Verify session isolation (no cross-session state) | P1 |
| SD-006 | Verify state persisted to SQLite | P1 |
| SD-007 | Verify 30min TTL for session state | P1 |
| SD-008 | Verify 100-entry cap per session | P2 |

---

### Feature 12: Tool Output Caching Tests

**Test File:** `tool-cache.test.js` (exists)

**Current State:**
- Tool cache tests exist
- Basic caching verified
- TTL and invalidation tests needed

**Target State:**
- 60-second TTL verified
- Write-through invalidation verified
- -60% API call reduction measured

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| TC-001 | Verify 60-second TTL expiry | P0 |
| TC-002 | Verify cache key includes session + query + options | P0 |
| TC-003 | Verify write-through invalidation on memory_save | P0 |
| TC-004 | Verify write-through invalidation on memory_update | P0 |
| TC-005 | Verify _cached: true flag in cached responses | P1 |
| TC-006 | Verify -60% redundant API calls | P1 |
| TC-007 | Verify cache miss triggers fresh query | P1 |
| TC-008 | Verify cache size bounded | P2 |

---

### Feature 13: Crash Recovery Tests

**Test File:** `crash-recovery.test.js` (exists)

**Current State:**
- Crash recovery tests exist
- Immediate save tests needed
- Session recovery tests needed

**Target State:**
- Zero data loss verified
- Interrupted session detection
- State recovery functional

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| CR-001 | Verify immediate SQLite save after state change | P0 |
| CR-002 | Verify resetInterruptedSessions on startup | P0 |
| CR-003 | Verify zero data loss on crash | P0 |
| CR-004 | Verify recoverState returns session with _recovered flag | P1 |
| CR-005 | Verify session_state table schema | P1 |
| CR-006 | Verify interrupted sessions marked correctly | P1 |
| CR-007 | Verify checkpoint consistency | P2 |
| CR-008 | Verify write overhead acceptable (<20ms) | P2 |

---

### Feature 14: CONTINUE_SESSION.md Tests

**Test File:** `continue-session.test.js` (exists)

**Current State:**
- Continue session tests exist
- File generation tests needed
- Content format verification needed

**Target State:**
- File generation verified
- Human-readable format validated
- Resume command included

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| CS-001 | Verify CONTINUE_SESSION.md generated on session save | P0 |
| CS-002 | Verify file contains active task | P0 |
| CS-003 | Verify file contains last action | P0 |
| CS-004 | Verify file contains context summary | P0 |
| CS-005 | Verify file contains resume command | P1 |
| CS-006 | Verify human-readable markdown format | P1 |
| CS-007 | Verify file updated on state change | P1 |
| CS-008 | Verify file complements (not replaces) SQLite state | P2 |

---

## CATEGORY D: GRAPH & RELATIONSHIPS TESTS (Features 15-18)

### Feature 15: Causal Memory Graph Tests

**Test File:** `causal-edges.test.js` (exists)

**Current State:**
- Causal edges tests exist
- Relationship storage verified
- Traversal depth tests needed

**Target State:**
- All 6 relationship types verified
- 3-hop traversal working
- "Why" query support verified

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| CG-001 | Verify causal_edges table schema | P0 |
| CG-002 | Verify 6 relationship types: caused, enabled, supersedes, contradicts, derived_from, supports | P0 |
| CG-003 | Verify 3-hop traversal limit | P0 |
| CG-004 | Verify memory_drift_why traces causal chain | P0 |
| CG-005 | Verify strength field (0-1) affects traversal | P1 |
| CG-006 | Verify evidence field stored | P1 |
| CG-007 | Verify maxDepthReached indicator | P1 |
| CG-008 | Verify 60% memories with causal links target | P2 |

---

### Feature 16: Corrections Tracking Tests

**Test File:** `corrections.test.js` (exists)

**Current State:**
- Corrections tests exist
- Basic tracking verified
- Penalty application tests needed

**Target State:**
- All correction types verified
- 0.5x penalty applied correctly
- Pattern extraction working

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| CT-001 | Verify memory_corrections table schema | P0 |
| CT-002 | Verify 4 correction types: superseded, deprecated, refined, merged | P0 |
| CT-003 | Verify 0.5x stability penalty applied | P0 |
| CT-004 | Verify pattern_extracted field captured | P1 |
| CT-005 | Verify new_memory_id reference | P1 |
| CT-006 | Verify corrected memories decay faster | P1 |
| CT-007 | Verify memory_correct() tool functionality | P2 |
| CT-008 | Verify correction history queryable | P2 |

---

### Feature 17: Learning from Corrections Tests

**Test File:** `corrections.test.js` (exists) | `learning.test.js` (to create)

**Current State:**
- Basic corrections tests exist
- Confidence adjustment tests needed
- Feedback loop tests needed

**Target State:**
- Confidence adjustment formula verified
- Feedback loop working
- Pattern extraction feeding learning

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| LC-001 | Verify accepted outcome: +5% confidence | P0 |
| LC-002 | Verify modified outcome: -5% confidence | P0 |
| LC-003 | Verify rejected outcome: -20% confidence | P0 |
| LC-004 | Verify correction type applies 0.5x penalty | P0 |
| LC-005 | Verify adjustConfidence() function | P1 |
| LC-006 | Verify patterns inform future scoring | P1 |
| LC-007 | Verify feature flag controls learning | P1 |
| LC-008 | Verify undo capability for corrections | P2 |

---

### Feature 18: Memory Consolidation Pipeline Tests

**Test File:** `consolidation.test.js` (to create) | `archival-manager.test.js` (exists)

**Current State:**
- Archival manager tests exist
- No consolidation pipeline tests
- No 5-phase verification

**Target State:**
- All 5 phases verified
- Episodic -> semantic promotion working
- Storage reduction measured

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| CP-001 | Verify REPLAY phase: select episodic >7 days | P0 |
| CP-002 | Verify ABSTRACT phase: find facts 2+ occurrences | P0 |
| CP-003 | Verify INTEGRATE phase: create/update semantic | P0 |
| CP-004 | Verify PRUNE phase: archive redundant episodes | P0 |
| CP-005 | Verify STRENGTHEN phase: boost frequent access | P0 |
| CP-006 | Verify consolidation_run tool | P1 |
| CP-007 | Verify dry-run mode | P1 |
| CP-008 | Verify backup before prune | P1 |
| CP-009 | Verify storage reduction measured | P2 |

---

## CATEGORY E: PERFORMANCE & EFFICIENCY TESTS (Features 19-22)

### Feature 19: Lazy Embedding Model Loading Tests

**Test File:** `lazy-loading.test.js` (to create) | `provider-chain.test.js` (exists)

**Current State:**
- Provider chain tests exist
- Lazy singleton pattern not tested
- Startup time not measured

**Target State:**
- Lazy loading verified
- <500ms startup verified
- First-search latency acceptable

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| LL-001 | Verify no model loading on MCP startup | P0 |
| LL-002 | Verify getEmbeddingProvider() lazy initialization | P0 |
| LL-003 | Verify <500ms MCP startup time | P0 |
| LL-004 | Verify cached instance returned on subsequent calls | P1 |
| LL-005 | Verify first-search triggers initialization | P1 |
| LL-006 | Verify 50-70% startup improvement | P1 |
| LL-007 | Verify concurrent first-calls don't double-init | P2 |
| LL-008 | Verify error handling during lazy init | P2 |

---

### Feature 20: Incremental Indexing Tests

**Test File:** `incremental-index.test.js` (exists)

**Current State:**
- Incremental index tests exist
- Content hash tests present
- Skip behavior tests needed

**Target State:**
- Hash + mtime check verified
- Skip unchanged files working
- 10-100x improvement verified

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| II-001 | Verify content_hash comparison | P0 |
| II-002 | Verify mtime comparison | P0 |
| II-003 | Verify unchanged files skipped | P0 |
| II-004 | Verify memory_index_scan returns { indexed, skipped, total } | P1 |
| II-005 | Verify hash change triggers re-index | P1 |
| II-006 | Verify mtime change triggers re-index | P1 |
| II-007 | Verify 10-100x speed improvement | P2 |
| II-008 | Verify new files detected and indexed | P2 |

---

### Feature 21: BM25-WASM Tests

**Test File:** `bm25-wasm.test.js` (to create)

**Current State:**
- No WASM implementation tests
- No fallback behavior tests
- No performance comparison tests

**Target State:**
- WASM implementation verified
- JS fallback working
- 5-10x performance improvement measured

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| BW-001 | Verify WASM BM25 produces correct scores | P0 |
| BW-002 | Verify JS fallback when WASM unavailable | P0 |
| BW-003 | Verify automatic selection of fastest implementation | P0 |
| BW-004 | Verify WASM and JS produce identical results | P1 |
| BW-005 | Verify 5-10x performance improvement with WASM | P1 |
| BW-006 | Verify graceful degradation | P1 |
| BW-007 | Verify WASM loading doesn't block startup | P2 |
| BW-008 | Verify memory usage acceptable | P2 |

---

### Feature 22: Compression Tiers Tests

**Test File:** `compression.test.js` (to create)

**Current State:**
- No compression tier tests
- No field filtering tests
- No token savings measurement

**Target State:**
- All 4 compression levels verified
- Field filtering working
- Token savings measured

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| CT-001 | Verify minimal tier (~100 tokens): id, title, tier | P0 |
| CT-002 | Verify compact tier (~200 tokens): + summary | P0 |
| CT-003 | Verify standard tier (~400 tokens): + anchors | P0 |
| CT-004 | Verify full tier (complete): all fields | P0 |
| CT-005 | Verify `compression` parameter on search | P1 |
| CT-006 | Verify _compression, _originalTokens, _compressedTokens metadata | P1 |
| CT-007 | Verify compressResult() function | P1 |
| CT-008 | Verify token savings per tier | P2 |

---

## CATEGORY F: USER EXPERIENCE & RECOVERY TESTS (Features 23-26)

### Feature 23: Recovery Hints in Errors Tests

**Test File:** `recovery-hints.test.js` (to create) | Related: errors.js

**Current State:**
- Basic error handling exists
- No recovery hint tests
- No hint lookup verification

**Target State:**
- Recovery hints in all errors
- Zero runtime cost verified
- AI self-healing enabled

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| RH-001 | Verify E041 includes "Run memory_index_scan" hint | P0 |
| RH-002 | Verify E001 includes API key guidance | P0 |
| RH-003 | Verify timeout errors include increase timeout hint | P0 |
| RH-004 | Verify RECOVERY_HINTS catalog completeness | P1 |
| RH-005 | Verify zero runtime cost (string lookup only) | P1 |
| RH-006 | Verify hints are actionable commands | P1 |
| RH-007 | Verify unknown errors have fallback hint | P2 |
| RH-008 | Verify hints included in error response structure | P2 |

---

### Feature 24: Recovery Hints Catalog Tests

**Test File:** `recovery-hints.test.js` (to create)

**Current State:**
- No catalog completeness tests
- No coverage verification
- No fallback tests

**Target State:**
- Complete catalog for all tools
- Default fallback verified
- AI agent recovery enabled

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| RC-001 | Verify memory_search error coverage | P0 |
| RC-002 | Verify checkpoint_restore error coverage | P0 |
| RC-003 | Verify memory_save error coverage | P0 |
| RC-004 | Verify default fallback: "Run memory_health()" | P1 |
| RC-005 | Verify all error codes mapped | P1 |
| RC-006 | Verify hints are actionable | P1 |
| RC-007 | Verify catalog documentation exists | P2 |
| RC-008 | Verify hints tested for accuracy | P2 |

---

### Feature 25: Pre-Flight Quality Gates Tests

**Test File:** `preflight.test.js` (exists)

**Current State:**
- Preflight tests exist
- Basic validation verified
- Fail-fast behavior tests needed

**Target State:**
- All validation checks verified
- Fail-fast before expensive operations
- API waste prevented

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| PF-001 | Verify anchor_format validation | P0 |
| PF-002 | Verify duplicate_check validation | P0 |
| PF-003 | Verify token_budget validation | P0 |
| PF-004 | Verify preflight returns { checks, proceed } | P0 |
| PF-005 | Verify fail-fast prevents API calls | P1 |
| PF-006 | Verify per-operation check definitions | P1 |
| PF-007 | Verify check reasons included | P1 |
| PF-008 | Verify partial pass scenario handling | P2 |

---

### Feature 26: Standardized Response Structure Tests

**Test File:** `response-structure.test.js` (to create)

**Current State:**
- Inconsistent response formats
- No envelope structure tests
- No metadata verification

**Target State:**
- Uniform envelope for all tools
- Summary, data, hints, meta verified
- AI parsing enabled

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| RS-001 | Verify response envelope: { summary, data, hints, meta } | P0 |
| RS-002 | Verify summary is human-readable string | P0 |
| RS-003 | Verify meta includes timing | P0 |
| RS-004 | Verify meta includes cached flag | P0 |
| RS-005 | Verify hints are suggestion array | P1 |
| RS-006 | Verify all tools use same envelope | P1 |
| RS-007 | Verify meta includes compression level | P1 |
| RS-008 | Verify backwards compatibility | P2 |

---

## CATEGORY G: ARCHITECTURE & ORGANIZATION TESTS (Features 27-30)

### Feature 27: Layered Tool Organization Tests

**Test File:** `tool-layers.test.js` (to create)

**Current State:**
- Flat tool organization
- No layer tests
- No token budget tests

**Target State:**
- 5 layers verified
- Token budgets documented
- AI routing enabled

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| LT-001 | Verify L1 tools (memory_context) | P0 |
| LT-002 | Verify L2 tools (match_triggers, stats) | P0 |
| LT-003 | Verify L3 tools (validate, delete, update) | P0 |
| LT-004 | Verify L4 tools (search, list) | P0 |
| LT-005 | Verify L5 tools (save, index_scan) | P0 |
| LT-006 | Verify token budgets per layer | P1 |
| LT-007 | Verify tool descriptions prefixed with layer | P1 |
| LT-008 | Verify progressive disclosure pattern | P2 |

---

### Feature 28: Protocol Abstractions Tests

**Test File:** `interfaces.test.js` (exists)

**Current State:**
- Interfaces tests exist
- Basic abstraction verified
- Swappable backend tests needed

**Target State:**
- IVectorStore interface verified
- IEmbeddingProvider interface verified
- Mock implementations working

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| PA-001 | Verify IVectorStore interface (search, upsert) | P0 |
| PA-002 | Verify IEmbeddingProvider interface (embed, batchEmbed) | P0 |
| PA-003 | Verify constructor injection pattern | P0 |
| PA-004 | Verify mock implementation for testing | P1 |
| PA-005 | Verify backend swapping works | P1 |
| PA-006 | Verify interface compliance validation | P1 |
| PA-007 | Verify error handling in abstractions | P2 |
| PA-008 | Verify LadybugDB migration path | P2 |

---

### Feature 29: 7-Layer MCP Architecture Tests

**Test File:** `mcp-architecture.test.js` (to create)

**Current State:**
- No architecture tests
- No layer hierarchy tests
- No recovery layer tests

**Target State:**
- Full 7 layers verified
- Recovery layer working
- Analysis layer working

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| MA-001 | Verify Layer 1: Orchestration | P0 |
| MA-002 | Verify Layer 2: Recovery | P0 |
| MA-003 | Verify Layer 3: Discovery | P0 |
| MA-004 | Verify Layer 4: Exploration | P0 |
| MA-005 | Verify Layer 5: Surgical | P0 |
| MA-006 | Verify Layer 6: Persistence | P0 |
| MA-007 | Verify Layer 7: Analysis | P0 |
| MA-008 | Verify token budgets per layer | P1 |

---

### Feature 30: Feature Flag Strategy Tests

**Test File:** `feature-flags.test.js` (to create)

**Current State:**
- No feature flag tests
- No gradual rollout tests
- No A/B testing infrastructure

**Target State:**
- All feature flags verified
- Enable/disable working
- Safe rollback enabled

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| FF-001 | Verify ENABLE_RRF_FUSION flag | P0 |
| FF-002 | Verify ENABLE_USAGE_TRACKING flag | P0 |
| FF-003 | Verify ENABLE_TYPE_DECAY flag | P0 |
| FF-004 | Verify ENABLE_RELATIONS flag | P0 |
| FF-005 | Verify DISABLE_LEGACY_SEARCH flag | P0 |
| FF-006 | Verify flag defaults (all false for safety) | P1 |
| FF-007 | Verify environment variable override | P1 |
| FF-008 | Verify feature behavior changes with flag | P2 |

---

## CATEGORY H: SPECIALIZED TOOLS TESTS (Features 31-33)

### Feature 31: memory_drift_context Tests

**Test File:** `drift-context.test.js` (to create)

**Current State:**
- No drift_context tests
- No intent-based context tests
- No depth parameter tests

**Target State:**
- Tool functionality verified
- Intent-aware context working
- File-specific context working

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| DC-001 | Verify memory_drift_context tool exists | P0 |
| DC-002 | Verify intent parameter affects results | P0 |
| DC-003 | Verify currentFile parameter scopes context | P0 |
| DC-004 | Verify depth parameter limits traversal | P1 |
| DC-005 | Verify fix_bug intent weights error memories | P1 |
| DC-006 | Verify default behavior without parameters | P1 |
| DC-007 | Verify response structure | P2 |
| DC-008 | Verify performance acceptable | P2 |

---

### Feature 32: memory_drift_why Tests

**Test File:** `drift-why.test.js` (to create)

**Current State:**
- No drift_why tests
- No causal chain tests
- No depth limit tests

**Target State:**
- Tool functionality verified
- Causal chain traversal working
- 3-hop limit enforced

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| DW-001 | Verify memory_drift_why tool exists | P0 |
| DW-002 | Verify causedBy relationships returned | P0 |
| DW-003 | Verify enabledBy relationships returned | P0 |
| DW-004 | Verify supersedes relationships returned | P0 |
| DW-005 | Verify maxDepth: 3 default | P1 |
| DW-006 | Verify maxDepthReached indicator | P1 |
| DW-007 | Verify empty graph returns empty relationships | P1 |
| DW-008 | Verify grouped results structure | P2 |

---

### Feature 33: memory_drift_learn Tests

**Test File:** `drift-learn.test.js` (to create)

**Current State:**
- No drift_learn tests
- No learning capture tests
- No category tests

**Target State:**
- Tool functionality verified
- Learning categories working
- Confidence parameter working

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| DL-001 | Verify memory_drift_learn tool exists | P0 |
| DL-002 | Verify learning parameter required | P0 |
| DL-003 | Verify 5 categories: pattern, mistake, optimization, constraint, insight | P0 |
| DL-004 | Verify confidence parameter (0-1) | P1 |
| DL-005 | Verify high-confidence memory created | P1 |
| DL-006 | Verify learning metadata attached | P1 |
| DL-007 | Verify feeds into consolidation pipeline | P2 |
| DL-008 | Verify response structure | P2 |

---

## CATEGORY I: EMBEDDING RESILIENCE TESTS (Features REQ-029 to REQ-033)

### Feature REQ-029: Pre-Flight API Key Validation Tests

**Test File:** `api-key-validation.test.js` (exists)

**Current State:**
- API key validation tests exist
- Basic validation verified
- Startup failure tests needed

**Target State:**
- Startup validation verified
- Actionable error messages
- Fail-fast behavior

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| AK-001 | Verify API key validated at MCP startup | P0 |
| AK-002 | Verify invalid key causes startup failure | P0 |
| AK-003 | Verify actionable error message | P0 |
| AK-004 | Verify error includes provider dashboard URL | P1 |
| AK-005 | Verify E050 error code for invalid key | P1 |
| AK-006 | Verify multiple provider keys checked | P1 |
| AK-007 | Verify missing key vs invalid key distinction | P2 |
| AK-008 | Verify key format validation (not just existence) | P2 |

---

### Feature REQ-030: Fallback Embedding Provider Chain Tests

**Test File:** `provider-chain.test.js` (exists)

**Current State:**
- Provider chain tests exist
- Basic fallback verified
- Complete chain tests needed

**Target State:**
- Full fallback chain verified
- Each step logged with reason
- BM25-only mode working

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| FC-001 | Verify fallback chain: Primary API -> Local -> BM25-only | P0 |
| FC-002 | Verify each fallback step logged with reason | P0 |
| FC-003 | Verify BM25-only mode searchable | P0 |
| FC-004 | Verify fallback completes within 100ms | P0 |
| FC-005 | Verify E051 error code for runtime key failure | P1 |
| FC-006 | Verify local model (nomic-embed-text) fallback | P1 |
| FC-007 | Verify E052 error code when local unavailable | P1 |
| FC-008 | Verify no cascading delays | P2 |

---

### Feature REQ-031: Deferred Indexing Tests

**Test File:** `deferred-indexing.test.js` (to create)

**Current State:**
- No deferred indexing tests
- No embedding_status tests
- No BM25-searchable verification

**Target State:**
- Deferred indexing working
- BM25 search for pending items
- Background retry verified

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| DI-001 | Verify memory saved with embedding_status: 'pending' | P0 |
| DI-002 | Verify pending memories searchable via BM25/FTS5 | P0 |
| DI-003 | Verify background retry when provider available | P0 |
| DI-004 | Verify embedding_status: 'failed' on permanent failure | P1 |
| DI-005 | Verify embedding_status: 'partial' on chunk failure | P1 |
| DI-006 | Verify warning surfaced in memory_save response | P1 |
| DI-007 | Verify retry queue management | P2 |
| DI-008 | Verify status transitions tracked | P2 |

---

### Feature REQ-032: Retry Logic with Exponential Backoff Tests

**Test File:** `retry.test.js` (exists)

**Current State:**
- Retry tests exist
- Basic backoff verified
- Fail-fast tests needed

**Target State:**
- 3 retries with backoff verified
- Transient vs permanent failure distinction
- Fail-fast for 401/403

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| RL-001 | Verify 3 retries for transient failures (5xx, timeouts) | P0 |
| RL-002 | Verify exponential backoff: 1s, 2s, 4s | P0 |
| RL-003 | Verify fail-fast for permanent failures (401, 403) | P0 |
| RL-004 | Verify timeout handling (30s per request) | P1 |
| RL-005 | Verify 2 consecutive timeouts trigger fallback | P1 |
| RL-006 | Verify retry count logged | P1 |
| RL-007 | Verify total retry time bounded | P2 |
| RL-008 | Verify retry state not persisted | P2 |

---

### Feature REQ-033: Memory Save Atomicity Tests

**Test File:** `transaction-manager.test.js` (exists)

**Current State:**
- Transaction manager tests exist
- Basic atomicity verified
- Rollback tests needed

**Target State:**
- Atomic file + index operations
- Rollback on failure
- _pending suffix for retry

**Key Test Cases:**
| Test ID | Description | Priority |
|---------|-------------|----------|
| AT-001 | Verify file creation atomic with index insert | P0 |
| AT-002 | Verify rollback file on indexing failure | P0 |
| AT-003 | Verify _pending suffix for retry-able files | P0 |
| AT-004 | Verify no orphaned files on failure | P1 |
| AT-005 | Verify no orphaned index entries on failure | P1 |
| AT-006 | Verify transaction isolation | P1 |
| AT-007 | Verify concurrent saves handled | P2 |
| AT-008 | Verify _pending files processed on restart | P2 |

---

## Test Coverage Summary

### By Category

| Category | Features | Total Tests | P0 Tests | P1 Tests | P2 Tests | Test Files |
|----------|----------|-------------|----------|----------|----------|------------|
| A: Search & Retrieval | 6 | 48 | 24 | 18 | 6 | 6 |
| B: Memory Decay & Lifecycle | 4 | 36 | 21 | 12 | 3 | 4 |
| C: Session Management | 4 | 32 | 16 | 12 | 4 | 4 |
| D: Graph & Relationships | 4 | 33 | 17 | 12 | 4 | 4 |
| E: Performance & Efficiency | 4 | 32 | 16 | 12 | 4 | 4 |
| F: User Experience & Recovery | 4 | 32 | 16 | 12 | 4 | 4 |
| G: Architecture & Organization | 4 | 32 | 20 | 8 | 4 | 4 |
| H: Specialized Tools | 3 | 24 | 12 | 9 | 3 | 3 |
| I: Embedding Resilience | 5 | 40 | 20 | 15 | 5 | 5 |
| **TOTAL** | **38** | **309** | **162** | **110** | **37** | **38** |

### Current vs Target State

| Dimension | Current | Target | Gap |
|-----------|---------|--------|-----|
| Test files existing | 29 | 38 | 9 new files needed |
| P0 tests passing | ~50% | 100% | ~81 tests to write/fix |
| P1 tests passing | ~30% | 100% | ~77 tests to write/fix |
| P2 tests passing | ~10% | 100% | ~33 tests to write/fix |
| Integration tests | Basic | Comprehensive | Full pipeline tests needed |
| Performance tests | None | Per-feature | Latency/throughput benchmarks |

### Test Files to Create

| File Name | Category | Priority | Estimated Tests |
|-----------|----------|----------|-----------------|
| `rrf-fusion.test.js` | A | P0 | 8 |
| `bm25-index.test.js` | A | P0 | 8 |
| `query-expansion.test.js` | A | P1 | 8 |
| `graph-search.test.js` | A | P1 | 8 |
| `access-tracker.test.js` | B | P1 | 8 |
| `session-dedup.test.js` | C | P0 | 8 |
| `learning.test.js` | D | P1 | 8 |
| `consolidation.test.js` | D | P0 | 9 |
| `lazy-loading.test.js` | E | P0 | 8 |
| `bm25-wasm.test.js` | E | P1 | 8 |
| `compression.test.js` | E | P1 | 8 |
| `recovery-hints.test.js` | F | P0 | 16 |
| `response-structure.test.js` | F | P1 | 8 |
| `tool-layers.test.js` | G | P0 | 8 |
| `mcp-architecture.test.js` | G | P1 | 8 |
| `feature-flags.test.js` | G | P0 | 8 |
| `drift-context.test.js` | H | P1 | 8 |
| `drift-why.test.js` | H | P1 | 8 |
| `drift-learn.test.js` | H | P1 | 8 |
| `deferred-indexing.test.js` | I | P0 | 8 |

---

## Implementation Priority

### Wave 1: Core Search & Decay (P0 Tests)
1. RRF fusion tests
2. Type-specific half-lives tests
3. 5-state memory model tests
4. Session deduplication tests
5. API key validation tests
6. Retry logic tests
7. Memory save atomicity tests

### Wave 2: Advanced Features (P0 + P1 Tests)
1. BM25 hybrid search tests
2. Cross-encoder reranking tests
3. Multi-factor decay tests
4. Tool output caching tests
5. Crash recovery tests
6. Causal memory graph tests
7. Provider chain tests

### Wave 3: Specialized & Architecture (P1 + P2 Tests)
1. Query expansion tests
2. Intent-aware retrieval tests
3. Graph-enhanced search tests
4. Consolidation pipeline tests
5. Layered tool organization tests
6. Protocol abstractions tests
7. Feature flag tests

### Wave 4: UX & Polish (Remaining Tests)
1. Recovery hints tests
2. Standardized response tests
3. Compression tiers tests
4. Specialized tool tests (drift_context, drift_why, drift_learn)
5. 7-layer MCP architecture tests

---

*Generated 2026-02-01 as part of 083-speckit-reimagined-test-suite spec documentation*
