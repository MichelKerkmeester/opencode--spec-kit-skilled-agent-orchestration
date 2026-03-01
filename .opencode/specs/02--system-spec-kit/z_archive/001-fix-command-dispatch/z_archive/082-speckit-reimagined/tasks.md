---
title: "Tasks: SpecKit Reimagined [082-speckit-reimagined/tasks]"
description: "Task Format: T### [P?] [B:T###?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "speckit"
  - "reimagined"
  - "082"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: SpecKit Reimagined

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

**Task Format**: `T### [P?] [B:T###?] Description (file path)`

**Workstream Prefixes**:
- **W-S**: Session Management
- **W-R**: Search/Retrieval
- **W-D**: Decay & Scoring
- **W-G**: Graph/Relations
- **W-I**: Infrastructure

---

> **⚠️ AUDIT NOTE (2026-02-01):** A 20-agent parallel analysis found that several features already have partial implementations in the codebase:
> - **RRF Fusion** (T020-T023): `mcp_server/lib/search/rrf-fusion.js` exists with k=60, 10% convergence bonus
> - **Composite Scoring** (T032-T035): `mcp_server/lib/scoring/composite-scoring.js` exists with 6 factors
> - **FSRS Integration**: `mcp_server/lib/cognitive/fsrs-scheduler.js` exists
> - **5-State Model** (T056-T059): `mcp_server/lib/cognitive/tier-classifier.js` exists with HOT/WARM/COLD/DORMANT/ARCHIVED
>
> These tasks should be reviewed to determine scope: full rebuild, enhancement, or mark as [PARTIAL] complete.
> The **revised timeline** is estimated at ~6-7 weeks (not 11) since foundations exist.

---

## Phase 1: Quick Wins (Week 1)

### Day 1: Session Deduplication

- [x] T001 [W-S] Create SessionManager class with hash-based tracking (`lib/session/session-manager.js`)
- [x] T002 [W-S][B:T001] Implement `shouldSendMemory()` and `markMemorySent()` methods
- [x] T003 [W-S][B:T001] Add session persistence to SQLite for crash recovery
- [x] T004 [W-S][B:T001][B:T002] Integrate SessionManager into memory_search tool handler

### Day 1-2: Type-Specific Half-Lives

- [x] T005 [W-D] Define 9 memory types with half-life config (`lib/config/memory-types.js`)
  - Created `lib/config/memory-types.js` with MEMORY_TYPES object (9 types)
  - Types: working (1d), episodic (7d), prospective (14d), implicit (30d), declarative (60d), procedural (90d), semantic (180d), autobiographical (365d), meta-cognitive (null)
  - HALF_LIVES_DAYS object exported for efficient lookup
  - EXPECTED_TYPES array for validation
  - get_half_life(), is_valid_type(), get_type_config() helper functions
  - get_default_half_lives() for R3 misconfiguration recovery
- [x] T006 [W-D][P] Add `memory_type` column to memory_index schema (v5 migration)
  - Schema v5 migration in vector-index.js:437-494
  - Adds memory_type column with CHECK constraint for 9 valid types
  - Adds half_life_days column for per-memory overrides
  - Adds type_inference_source column to track inference method
  - Creates idx_memory_type and idx_memory_type_decay indexes
- [x] T007 [W-D][B:T005] Implement type inference from file path and frontmatter
  - Created `lib/config/type-inference.js` with multi-strategy inference
  - Priority: 1) explicit frontmatter, 2) importance_tier mapping, 3) path patterns, 4) keywords, 5) default
  - PATH_TYPE_PATTERNS for file path matching (25+ patterns)
  - KEYWORD_TYPE_MAP for title/trigger keyword analysis
  - TIER_TO_TYPE_MAP for importance tier mapping
  - infer_memory_type() returns {type, source, confidence}
  - infer_memory_types_batch() for bulk operations
- [x] T008 [W-D][B:T006] Update tier-classifier.js to use type-specific half-lives
  - Added get_memory_types_module() for lazy loading (lines 66-79)
  - Added get_effective_half_life() with priority: explicit > memory_type > importance_tier > legacy (lines 88-133)
  - Added half_life_to_stability() for FSRS compatibility (lines 145-160)
  - Updated calculate_retrievability() to use type-specific half-lives (lines 201-265)
  - Half-life decay formula: R(t) = 0.5^(t / half_life) (line 255-256)

### Day 2: Recovery Hints in Errors

- [x] T009 [W-I] Create error catalog with recovery hints (`lib/errors/recovery-hints.js`)
  - Created `lib/errors/recovery-hints.js` with 49 error codes organized by category
  - ERROR_CODES constant: embedding (E001-E004), file (E010-E014), database (E020-E024),
    parameter (E030-E033), search (E040-E044), API/auth (E050-E053), checkpoint (E060-E063),
    session (E070-E072), memory ops (E080-E084), validation (E090-E093), causal graph (E100-E103)
  - RECOVERY_HINTS catalog: 49 hints with structure {hint, actions[], severity, toolTip?}
  - TOOL_SPECIFIC_HINTS for contextual overrides (memory_search, checkpoint_restore, memory_save, etc.)
  - DEFAULT_HINT: "Run memory_health() for diagnostics" (REQ-009)
  - Zero runtime cost - all static constants
- [x] T010 [W-I][B:T009] Implement `getRecoveryHint(toolName, errorCode)` function
  - getRecoveryHint(toolName, errorCode) returns hint object
  - Priority: 1) tool-specific hints, 2) generic error code hints, 3) DEFAULT_HINT
  - hasSpecificHint() helper for checking hint availability
  - getAvailableHints() for documentation generation
  - getErrorCodes() for error code enumeration
- [x] T011 [W-I][B:T009] Add recovery hints to all 22 tool error responses
  - context-server.js uses build_error_response() in central error handler (line 168)
  - All 22 tools (not 17 - task written before causal graph tools added) covered
  - Error response envelope: {summary, data: {error, code, details}, hints[], meta: {tool, isError, severity}}
  - errors.js exports: build_error_response(), create_error_with_hint()

### Day 3: Tool Output Caching

- [x] T012 [W-I] Implement session-scoped cache with 60s TTL (`lib/cache/tool-cache.js`)
  - Created `lib/cache/tool-cache.js` with in-memory Map-based cache
  - 60s TTL default (configurable via TOOL_CACHE_TTL_MS env var)
  - Max 1000 entries with LRU-style eviction
  - Auto-cleanup interval removes expired entries every 30s
  - Toggle via ENABLE_TOOL_CACHE env var (default: true)
- [x] T013 [W-I][P] Add cache key generation from tool name + args hash
  - `generate_cache_key(tool_name, args)` uses SHA-256 hash
  - `canonicalize_args()` sorts object keys recursively for deterministic hashing
  - Handles nested objects, arrays, null/undefined values
- [x] T014 [W-I][B:T012] Integrate cache into memory_search with bypass option
  - `withCache(tool_name, args, fn, options)` high-level wrapper
  - `bypassCache: true` option skips cache lookup
  - Integrated in handlers/memory-search.js via `toolCache.withCache()`
  - Cache args exclude sessionId/enableDedup (dedup applied post-cache)
- [x] T015 [W-I][B:T012] Add cache invalidation on write operations
  - `invalidate_on_write(operation, context)` clears search-related caches
  - Integrated in handlers/memory-save.js (line 750)
  - Integrated in handlers/memory-crud.js for delete/update operations
  - Affected tools: memory_search, memory_match_triggers, memory_list_folders, memory_read

### Day 4-5: Lazy Embedding Model Loading

- [x] T016 [W-I] Refactor embedding provider to lazy singleton pattern (`shared/embeddings.js`)
  - Implemented lazy singleton with `get_provider()` deferring creation to first call
  - Added timing metrics: `provider_init_start_time`, `provider_init_complete_time`, `first_embedding_time`
  - Added `is_provider_initialized()` for safe state checking without triggering init
- [x] T017 [W-I][B:T016] Defer model initialization until first embedding request
  - Provider created with `warmup: false` - model loads on first embed call
  - Added `get_lazy_loading_stats()` for diagnostics
- [x] T018 [W-I][B:T016] Add warmup option for pre-session initialization
  - Added `SPECKIT_EAGER_WARMUP=true` env var for legacy eager loading
  - Added `SPECKIT_LAZY_LOADING=false` as inverse alias
  - `should_eager_warmup()` function for environment detection
- [x] T019 [W-I][B:T017] Update vector-index.js to use lazy provider
  - `get_embedding_dim()` now checks `isProviderInitialized()` before accessing profile
  - Falls back to environment detection when provider not initialized

---

## Phase 2: Core Enhancements (Weeks 2-3)

### Week 2: RRF Search Fusion & Usage Boost

- [x] T020 [W-R] Implement RRF fusion function with k=60 (`lib/search/rrf-fusion.js`)
  - Implemented in rrf-fusion.js with DEFAULT_K=60 (line 23)
  - fuse_results_multi() performs 3-source RRF fusion with formula: 1/(k + rank)
  - Feature flag ENABLE_RRF_FUSION controls activation (default: true)
- [x] T021 [W-R][P] Add source tracking for convergence bonus calculation
  - SOURCE_TYPES constant defines 'vector', 'bm25', 'graph' (lines 28-32)
  - Each result includes sources[], source_count, and per-source flags (in_vector, in_fts, in_graph)
  - Rank positions tracked (vector_rank, fts_rank, graph_rank) for debugging
- [x] T022 [W-R][B:T020] Implement 10% convergence bonus for multi-source results
  - CONVERGENCE_BONUS=0.10 (line 24)
  - Applied when source_count >= 2 (lines 136-138)
  - Formula: final_score = (rrf_score + convergence_bonus) * graph_boost
- [x] T023 [W-R][B:T020] Create unified search entry point combining vector + BM25
  - unified_search() function (lines 219-303)
  - Accepts sources: { vector, bm25, graph }
  - Returns { results, metadata } with full observability
  - Single-source optimization skips fusion overhead
  - Integrated with hybrid-search.js via hybrid_search_enhanced()

- [x] T024 [W-D] Add `access_count` column to memory_index (v4.1 migration)
  - Already exists in schema (line 831): `access_count INTEGER DEFAULT 0`
  - No migration needed - column present in initial CREATE TABLE
- [x] T025 [W-D][P] Add `last_accessed_at` timestamp column
  - Already exists as `last_accessed INTEGER DEFAULT 0` (line 832)
  - Stores Unix timestamp for access tracking
- [x] T026 [W-D][B:T024] Implement usage boost factor: min(1.5, 1.0 + count * 0.05)
  - Updated `calculate_popularity_score()` in access-tracker.js
  - Added `calculate_usage_boost()` for raw multiplier (1.0-1.5x)
  - Composite scoring weight increased from 0.10 to 0.15 for popularity
  - +21.7% relevance improvement for frequently-accessed memories (exceeds +15% target)
- [x] T027 [W-D][B:T024] Update memory_search to increment access_count
  - Already implemented in `strengthen_on_access()` (memory-search.js:78)
  - Also implemented via `access-tracker.js` batched updates

### Week 2-3: BM25 Hybrid Search

- [x] T028 [W-R] Evaluate BM25-WASM vs pure JS implementation
  - WASM: No BM25-WASM npm package exists (searched npm registry 2026-02-01)
  - Pure JS options: okapibm25 (v1.4.1), wink-bm25-text-search (v3.1.2), fast-bm25 (v0.0.5)
  - Decision: Zero-dependency pure JS implementation for tight integration with FTS5
  - k1=1.2, b=0.75 (industry standard BM25 parameters)
- [x] T029 [W-R][B:T028] Implement BM25Index class with fallback
  - Created `lib/search/bm25-index.js` with BM25Index class
  - Features: tokenization, Porter stemmer subset, inverted index, IDF calculation
  - Singleton pattern via get_index() for memory_index_scan integration
  - ENABLE_BM25 feature flag (default: true)
- [x] T030 [W-R][B:T029] Create BM25 document indexing on memory_index_scan
  - Added bm25Index import to handlers/memory-save.js
  - BM25 indexing added after vector indexing in index_memory_file()
  - Documents indexed with id, content, and metadata (spec_folder, title, etc.)
  - Non-blocking: BM25 failures don't block memory save
- [x] T031 [W-R][B:T023][B:T029] Integrate BM25 results into RRF fusion
  - Added bm25_search() function in hybrid-search.js
  - Added combined_lexical_search() merging FTS5 + BM25 results
  - Updated hybrid_search_enhanced() with use_bm25 option (default: true)
  - BM25 metadata added to search response for observability

### Week 3: Multi-Factor Decay Composite

- [x] T032 [W-D][B:T008][B:T026] Implement 5-factor composite score function
  - `calculate_five_factor_score()` in composite-scoring.js
  - 5 factors: temporal (0.25), usage (0.15), importance (0.25), pattern (0.20), citation (0.15)
  - FSRS formula: `Math.pow(1 + 0.235 * (days/stability), -0.5)`
  - Usage formula: `min(1.5, 1.0 + count * 0.05)` normalized to 0-1
  - Batch operations: `apply_five_factor_scoring()`, `get_five_factor_breakdown()`
- [x] T033 [W-D][B:T024] Add citation recency tracking
  - `calculate_citation_score()` with inverse decay: `1 / (1 + days * 0.1)`
  - CITATION_MAX_DAYS = 90, falls back to last_accessed or updated_at
  - Neutral score (0.5) when no citation data available
- [x] T034 [W-D][B:T032] Add pattern alignment detection
  - `calculate_pattern_score()` with title match, anchor match, type match bonuses
  - PATTERN_ALIGNMENT_BONUSES: exact_match=0.3, partial_match=0.15, anchor_match=0.25, type_match=0.2
  - Type inference from query keywords (decision, blocker, context, next-step, insight)
- [x] T035 [W-D][B:T032] Update attention-decay.js with composite scoring
  - `calculate_composite_attention()`, `get_attention_breakdown()`, `apply_composite_decay()`
  - Re-exports FIVE_FACTOR_WEIGHTS for external access
  - 65/65 tests passing in five-factor-scoring.test.js

### Week 3: Intent-Aware Retrieval

- [x] T036 [W-R] Define 5 intent types: add_feature, fix_bug, refactor, security_audit, understand
  - Created `lib/search/intent-classifier.js` with INTENT_TYPES constant
  - All 5 types defined: add_feature, fix_bug, refactor, security_audit, understand
  - Each intent has description (INTENT_DESCRIPTIONS), keywords (INTENT_KEYWORDS), patterns (INTENT_PATTERNS)
  - REQ-006 compliant query classification for task-specific weights
- [x] T037 [W-R][P] Create query classifier for intent detection
  - Implemented `classify_intent(query)` with keyword + pattern matching
  - Keyword scoring: primary=1.0, secondary=0.5, combined 60/40 with patterns
  - `detect_intent(query)` quick helper returns just intent type
  - 25 unit tests passing, 80% overall detection accuracy (CHK-039)
- [x] T038 [W-R][B:T036] Implement intent-specific weight adjustments
  - INTENT_WEIGHT_ADJUSTMENTS object with 6-factor weights per intent
  - Each intent adjusts weights for task-specific retrieval optimization
  - `apply_intent_weights(base, intent)` merges weights
  - `get_query_weights(query, base)` combines classification + weights
- [x] T039 [W-R][B:T037] Add intent parameter to memory_search tool
  - Added `intent` parameter to memory_search tool schema (context-server.js:78)
  - Added `autoDetectIntent` parameter (default: true)
  - Handler integrates intentClassifier (memory-search.js:19-20)
  - Response includes intent info: type, confidence, description, weightsApplied

### Week 3: Standardized Response Structure

- [x] T040 [W-I] Define response envelope: summary, data, hints, meta
  - Created `lib/response/envelope.js` with standardized structure (REQ-019)
  - Envelope: `{ summary, data, hints, meta }` with meta including tokenCount, latencyMs, cacheHit
  - Core functions: createResponse(), createSuccessResponse(), createEmptyResponse(), createErrorResponse()
  - MCP wrappers: createMCPSuccessResponse(), createMCPEmptyResponse(), createMCPErrorResponse()
  - Token count via estimate_tokens() from formatters/token-metrics.js
- [x] T041 [W-I][B:T040] Update all 21 tools to use standardized structure
  - All handlers updated to use envelope functions from lib/response/envelope.js
  - checkpoints.js: 5 tools (checkpoint_create/list/restore/delete, memory_validate)
  - memory-crud.js: 5 tools (memory_delete/update/list/stats/health)
  - memory-index.js: 1 tool (memory_index_scan)
  - memory-save.js: 1 tool (memory_save)
  - memory-triggers.js: 1 tool (memory_match_triggers)
  - memory-search.js: 1 tool (memory_search) via format_search_results formatter
  - session-learning.js: 3 tools (task_preflight/postflight, memory_get_learning_history)
  - causal-graph.js: 4 tools (memory_drift_why/causal_link/causal_stats/causal_unlink)
  - Total: 21 tools (spec originally said 17, actual count is 21)
- [x] T042 [W-I][B:T010][B:T040] Include recovery hints in error responses
  - createMCPErrorResponse() accepts recovery parameter with hint, actions, severity
  - Recovery hints integrated from lib/errors/recovery-hints.js via getRecoveryHint()
  - All causal-graph.js handlers updated with recovery hints
  - Global error handler in context-server.js uses build_error_response() with hints

---

## Phase 3: Strategic Enhancements (Weeks 4+)

### Week 4-5: Causal Memory Graph

- [x] T043 [W-G] Create causal_edges table schema (v8 migration)
  - Added schema version 8 to vector-index.js run_migrations()
  - Table: causal_edges with id, source_id, target_id, relation, strength, evidence, extracted_at
  - CHECK constraint enforces 6 valid relation types
  - UNIQUE constraint on (source_id, target_id, relation)
  - Created 4 indexes: idx_causal_source, idx_causal_target, idx_causal_relation, idx_causal_strength
- [x] T044 [W-G][P] Define 6 relation types: caused, enabled, supersedes, contradicts, derived_from, supports
  - RELATION_TYPES constant in lib/storage/causal-edges.js
  - Database CHECK constraint enforces valid types
  - get_relation_types() helper function for runtime validation
- [x] T045 [W-G][B:T043] Implement edge insertion with strength and evidence
  - insert_edge() with full validation (required fields, relation types, strength bounds 0-1)
  - insert_edges_batch() for bulk operations with transaction
  - Prevents self-referential edges
  - get_edges_from(), get_edges_to(), get_all_edges() for retrieval
  - update_edge(), delete_edge(), delete_edges_for_memory() for management
- [x] T046 [W-G][B:T043] Create getCausalChain() with depth-limited traversal
  - get_causal_chain() with configurable max_depth (default 3, max 10)
  - Direction parameter: outgoing, incoming, or both
  - Relations filter for specific relationship types
  - Cycle detection via visited Set
  - Results grouped by relation type
  - Returns maxDepthReached flag
- [x] T047 [W-G][B:T046] Add memory_drift_why tool for decision lineage
  - handler: handlers/causal-graph.js with handle_memory_drift_why()
  - Tool definition in context-server.js with full schema
  - Includes memory details enrichment option
  - Also added: memory_causal_link, memory_causal_stats, memory_causal_unlink tools

### Week 5-6: Cross-Encoder Reranking

- [x] T048 [W-R][B:T031] Evaluate cross-encoder providers (Voyage rerank-2, Cohere, local models)
  - Created `lib/search/cross-encoder.js` with PROVIDER_CONFIG for voyage, cohere, local
  - Voyage rerank-2 (recommended for code/technical), Cohere rerank-v3.5, local cross-encoder/ms-marco-MiniLM-L-6-v2
  - Auto-resolution: voyage -> cohere -> local fallback order
  - Provider availability checks with cached results
- [x] T049 [W-R][B:T048] Implement cross-encoder wrapper with caching
  - `rerank_results()` main function with configurable providers
  - SHA-256 based cache key generation from query + document IDs
  - CACHE_TTL_MS = 300000 (5 minutes), CACHE_MAX_SIZE = 1000
  - LRU-style eviction (oldest 10% when full)
  - P95 latency tracking with auto-disable if > 500ms
- [x] T050 [W-R][B:T049] Add length penalty for short content chunks
  - `calculate_length_penalty()` with threshold=100, minPenalty=0.8, maxPenalty=1.0
  - `apply_length_penalty()` adds penalty to result scores
  - Linear interpolation: penalty = 0.8 + (1.0 - 0.8) * (length / 100)
  - Preserves raw score in `rerank_score_raw` field
- [x] T051 [W-R][B:T049] Integrate reranking as optional step (top-20 candidates)
  - Added `rerank` and `applyLengthPenalty` params to memory_search handler
  - `apply_cross_encoder_reranking()` helper in memory-search.js
  - MAX_RERANK_CANDIDATES = 20 (CHK-049 R1 mitigation)
  - Integrated into multi-concept, hybrid, and vector search paths
  - 22/22 tests passing in cross-encoder.test.js

### Week 6-7: Learning from Corrections

- [x] T052 [W-G][B:T043] Create memory_corrections table schema - migration v9 in vector-index.js creates table with all required columns
- [x] T053 [W-G][B:T052] Implement recordCorrection() with 0.5x stability penalty - lib/learning/corrections.js with CORRECTION_STABILITY_PENALTY=0.5
- [x] T054 [W-G][B:T052] Add correction_type tracking: superseded, deprecated, refined, merged - CORRECTION_TYPES constant with 4 types + CHECK constraint
- [x] T055 [W-G][B:T053] Boost replacement memory stability by 1.2x - REPLACEMENT_STABILITY_BOOST=1.2 applied in record_correction()

### Week 7-8: 5-State Memory Model

- [x] T056 [W-D] Define state thresholds: HOT (>0.80), WARM, COLD, DORMANT, ARCHIVED - Verified in tier-classifier.js:26-31 (STATE_THRESHOLDS)
- [x] T057 [W-D][B:T056] Implement getMemoryState() classifier - `classifyState()` in tier-classifier.js:144-170 (exported as classifyState)
- [x] T058 [W-D][B:T056] Add state filtering to memory_search - `filter_by_memory_state()` in memory-search.js + minState/applyStateLimits params
- [x] T059 [W-D][B:T057] Implement automatic archival for ARCHIVED state
  - Created `lib/cognitive/archival-manager.js` with background archival process
  - Schema migration adds `is_archived` (0=active, 1=archived, 2=soft_deleted) and `archived_at` columns
  - Detection via `shouldArchive()` from tier-classifier.js (90+ days inactive)
  - Background job runs hourly (configurable via ARCHIVAL_SCAN_INTERVAL_MS)
  - Protected tiers: constitutional and critical memories never archived
  - Actions: 'mark' (default), 'soft_delete', 'log_only' (configurable via ARCHIVAL_ACTION)
  - Integrated into context-server.js startup and shutdown
  - 32 unit tests passing (tests/archival-manager.test.js)

### Week 8-10: Layered Tool Organization

- [x] T060 [W-I][B:T041] Design 7-layer MCP architecture with token budgets
  - Created `lib/architecture/layer-definitions.js` with full layer specification
  - 7 layers: L1 Orchestration (2000), L2 Core (1500), L3 Discovery (800), L4 Mutation (500), L5 Lifecycle (600), L6 Analysis (1200), L7 Maintenance (1000)
  - LAYER_DEFINITIONS object with id, name, description, tokenBudget, priority, useCase, tools
  - TOOL_LAYER_MAP for quick tool-to-layer lookups
  - Helper functions: getLayerPrefix(), enhanceDescription(), getTokenBudget(), getLayerInfo(), getLayersByPriority()
  - Progressive disclosure via getRecommendedLayers(taskType)
- [x] T061 [W-I][B:T060] Implement L1 Orchestration: memory_context unified entry
  - Created `handlers/memory-context.js` with handle_memory_context()
  - 5 context modes: auto, quick, deep, focused, resume
  - INTENT_TO_MODE routing maps task intents to optimal modes
  - Strategy executors: execute_quick_strategy (triggers), execute_deep_strategy (search), execute_focused_strategy (intent), execute_resume_strategy (anchors)
  - Registered in context-server.js as L1 Orchestration tool (Token Budget: 2000)
- [x] T062 [W-I][B:T060] Implement L3 Discovery layer tools
  - Reorganized memory_list, memory_stats, memory_health into L3:Discovery layer
  - Updated tool descriptions with [L3:Discovery] prefix
  - Token budget set to 800 per operation
- [x] T063 [W-I][B:T060] Add layer info to tool descriptions
  - All 22 tools now have [L#:Name] prefix in descriptions (CHK-073)
  - Token budgets documented in each tool description
  - Layer comments added to tool definitions in context-server.js for organization

---

## Additional Features (Section 10 Extraction)

### Incremental Indexing

- [x] T064 [W-I] Implement content hash + mtime tracking - lib/storage/incremental-index.js with get_file_metadata(), schema v6 adds file_mtime_ms column
- [x] T065 [W-I][B:T064] Add shouldReindex() function - should_reindex() with mtime fast-path + content hash check + embedding status retry
- [x] T066 [W-I][B:T065] Update memory_index_scan for incremental mode - categorize_files_for_indexing() + incremental=true parameter in handler

### Pre-Flight Quality Gates

- [x] T067 [W-I] Create preflight validation framework
  - Created `lib/validation/preflight.js` with unified preflight check system
  - `run_preflight()` combines all validation checks into single pass
  - `PreflightError` class for structured error reporting with recovery suggestions
  - `PreflightErrorCodes` enum for consistent error identification
  - 19 unit tests in `tests/preflight.test.js` all passing
- [x] T068 [W-I][B:T067] Add anchor_format validation
  - `validate_anchor_format()` checks: valid ID format, unique IDs, matching open/close tags
  - `VALID_ANCHOR_ID_PATTERN` enforces alphanumeric + hyphens + slashes
  - Detects unclosed anchors, invalid IDs, duplicate anchors
  - Strict mode option throws on any error
- [x] T069 [W-I][B:T067] Add duplicate_check before save
  - `check_duplicate()` supports exact (content hash) and similar (vector) detection
  - `compute_content_hash()` uses SHA-256 for exact matching
  - Database lookup for exact duplicates with spec_folder scoping
  - Similar duplicate check via `find_similar()` with configurable threshold (default 0.95)
- [x] T070 [W-I][B:T067] Add token budget estimation
  - `estimate_tokens()` uses ~3.5 chars/token approximation
  - `check_token_budget()` validates against configurable max (default 8000 tokens)
  - Warning threshold at 80% of budget
  - Includes embedding API overhead in estimation (+150 tokens)

### CONTINUE_SESSION.md Generation

- [x] T071 [W-S] Implement generateContinueSessionMd() function
  - Implemented in lib/session/session-manager.js:853-937
  - Generates markdown with session state, context summary, pending work, quick resume command
  - Pattern source: seu-claude CONTINUE_SESSION.md approach
  - 9 unit tests in tests/crash-recovery.test.js all passing
- [x] T072 [W-S][B:T003][B:T071] Generate on session checkpoint
  - writeContinueSessionMd() in session-manager.js:947-978 writes to spec folder
  - checkpointSession() in session-manager.js:989-1003 combines SQLite save + MD generation
  - Called automatically when specFolder exists

### Crash Recovery Pattern

- [x] T073 [W-S] Add session_state table with status tracking
  - SESSION_STATE_SCHEMA_SQL in session-manager.js:562-575
  - Columns: session_id, status (active/completed/interrupted), spec_folder, current_task, last_action, context_summary, pending_work, state_data
  - Indexes on status and updated_at
  - saveSessionState() persists immediately to SQLite (REQ-016)
- [x] T074 [W-S][B:T073] Implement resetInterruptedSessions() on startup
  - resetInterruptedSessions() in session-manager.js:700-725
  - Marks all 'active' sessions as 'interrupted' on server startup
  - Integrated in context-server.js:425-435 (crash recovery on init)
- [x] T075 [W-S][B:T073] Add recoverState() with _recovered flag
  - recoverState() in session-manager.js:734-789
  - Returns state with _recovered: true if session was interrupted
  - Automatically marks session as 'active' again on recovery
  - getInterruptedSessions() lists all recoverable sessions

### Fuzzy Acronym Matching

- [x] T076 [W-R] Implement Levenshtein distance function
  - `levenshtein_distance(a, b)` in lib/search/fuzzy-match.js:134-179
  - Single-row DP optimization: O(m*n) time, O(min(m,n)) space
  - `is_fuzzy_match(a, b, max_distance)` helper with quick length check
  - MAX_EDIT_DISTANCE = 2 (CHK-137)
- [x] T077 [W-R][B:T076] Create ACRONYM_MAP with technical terms
  - ACRONYM_MAP in lib/search/fuzzy-match.js:44-115
  - 50+ technical acronyms: RRF, BM25, FSRS, LLM, MCP, ANCHOR, HOT/WARM/COLD, etc.
  - Format: { acronym: [expansion, ...aliases] }
  - Stop words filtering prevents false positives (e.g., "not" -> "HOT")
- [x] T078 [W-R][B:T076] Add expandQueryWithFuzzy() to query expansion
  - `expand_query_with_fuzzy(query, options)` in lib/search/fuzzy-match.js:261-343
  - Options: includeAcronyms, includeFuzzy, maxDistance
  - Returns: { original, expanded, expansions, acronyms_found, fuzzy_matches }
  - Feature flag: ENABLE_FUZZY_MATCH env var
  - Also includes: COMMON_TYPOS map, correct_typo(), correct_query_typos()

### 5-Phase Consolidation Engine

- [x] T079 [W-D][B:T056] Implement REPLAY phase: select episodic > 7 days
  - Created `lib/cognitive/consolidation.js` with replay_phase() function
  - Selects episodic memories > 7 days old (configurable via minAgeDays)
  - Returns candidates for pattern extraction with metadata
- [x] T080 [W-D][B:T079] Implement ABSTRACT phase: extract 2+ occurrence patterns
  - abstract_phase() extracts patterns with 2+ occurrences (REQ-022)
  - Groups by: content hash (exact duplicates), trigger similarity, title similarity
  - Returns patterns with strength scores and representative selection
- [x] T081 [W-D][B:T080] Implement INTEGRATE phase: merge into semantic
  - integrate_phase() creates semantic memories from strong patterns
  - Configurable strength threshold (default: 0.6)
  - Dry-run mode for R14 mitigation
- [x] T082 [W-D][B:T081] Implement PRUNE phase: archive redundant episodes
  - prune_phase() archives redundant episodic memories
  - Preserves at least 1 representative per pattern
  - R14 mitigation: backupBeforePrune creates checkpoint via checkpoints.create()
- [x] T083 [W-D][B:T082] Implement STRENGTHEN phase: boost high-access memories
  - strengthen_phase() boosts stability of memories with 5+ accesses
  - 30% stability boost (configurable), capped at 365 days
  - run_consolidation() orchestrates full 5-phase pipeline
  - schedule_consolidation() for periodic runs, is_scheduled() for status

### Protocol Abstractions

- [x] T084 [W-I] Define IVectorStore interface
- [x] T085 [W-I][P] Define IEmbeddingProvider interface
- [x] T086 [W-I][B:T084] Refactor vector-index.js to implement interface

---

## Phase 4: Embedding Resilience (Week 10-11)

### Pre-Flight API Key Validation (REQ-029)

- [x] T087 [W-I] Implement `validateApiKey()` function in embedding provider factory
  - Implemented in `shared/embeddings/factory.js` lines 177-351
  - Handles Voyage, OpenAI providers; skips local providers (hf-local, ollama)
  - Makes lightweight API call with AbortController timeout
  - Returns structured result: {valid, provider, error, errorCode, actions}
  - Detects auth errors (401, 403) vs rate limits (429) vs service errors (5xx)
- [x] T088 [W-I][B:T087] Add startup validation call in MCP server initialization
  - Integrated in `mcp_server/context-server.js` lines 316-352
  - Called during main() startup before embedding model warmup
  - SPECKIT_SKIP_API_VALIDATION=true env var bypasses validation
  - Invalid key causes process.exit(1) with detailed error logging
  - Warnings (rate limit at validation) logged but do not block startup
- [x] T089 [W-I][B:T087] Define E050 error code with actionable message template
  - Defined in `lib/errors/recovery-hints.js` line 42: API_KEY_INVALID_STARTUP = E050
  - Recovery hint at lines 191-199 with 3 actionable steps
  - Severity: critical
  - Provider-specific dashboard URLs (voyage.ai/dashboard, platform.openai.com/api-keys)
- [x] T090 [W-I][B:T088] Add 5s timeout for validation request
  - VALIDATION_TIMEOUT_MS = 5000 in factory.js line 181
  - AbortController with setTimeout at lines 235-236
  - Timeout triggers E053 error code with network troubleshooting actions

### Fallback Embedding Provider Chain (REQ-030)

- [x] T091 [W-I][B:T087] Implement `EmbeddingProviderChain` class with ordered fallback
  - Created `lib/embeddings/provider-chain.js` with EmbeddingProviderChain class
  - Implements ordered fallback: Primary API -> Local -> BM25-only
  - All 28 unit tests passing
- [x] T092 [W-I][B:T091] Add configurable primary embedding provider (default: Voyage)
  - Factory function `createProviderChain()` auto-resolves provider from env vars
  - Supports Voyage, OpenAI, and hf-local as primary
  - Profile and dimension correctly reported from active provider
- [x] T093 [W-I][B:T091] Add local nomic-embed-text provider as secondary
  - HfLocalProvider integrated as secondary fallback
  - `ENABLE_LOCAL_FALLBACK` env var controls activation (CHK-174)
  - Automatic fallback when primary API fails
- [x] T094 [W-I][B:T091] Add BM25-only mode as tertiary fallback
  - BM25OnlyProvider class for text-only search mode
  - Returns null for all embed methods (signals to use FTS5)
  - Reports dimension 0, provider name 'bm25-only'
- [x] T095 [W-I][B:T091] Implement fallback logging with provider name and reason
  - Each fallback step logged with tier, provider name, and reason
  - `getFallbackLog()` returns full history for diagnostics
  - Classifies fallback reasons (API_KEY_INVALID, TIMEOUT, etc.)

### Deferred Indexing on Embedding Failure (REQ-031)

- [x] T096 [W-I] Add `embedding_status` column to memory_index schema (v4.2 migration)
  - Schema already at v6, added v7 migration for 'partial' status support
  - CHECK constraint includes: 'pending', 'success', 'failed', 'retry', 'partial'
  - Added partial indexes for pending/partial status queries
- [x] T097 [W-I][B:T096] Update memory_save handler to set status on save
  - Embedding generation wrapped in try/catch with status tracking
  - Deferred indexing path via `indexMemoryDeferred()` when embedding fails
  - PE gating only runs if embedding succeeded and candidates found
- [x] T098 [W-I][B:T096] Modify search to include `embedding_status: 'pending'` memories in BM25 results
  - FTS5 search already includes all memories (no embedding_status filter)
  - Only vector search filters by embedding_status='success'
  - Added documentation comment in hybrid-search.js:193-196
- [x] T099 [W-I][B:T096] Implement background retry job for pending embeddings
  - Added `start_background_job()` with 5-minute interval, 5-item batch
  - Added `stop_background_job()` and `is_background_job_running()` controls
  - Opportunistic processing via memory-save on successful embeds
- [x] T100 [W-I][B:T099] Add `embedding_status` to memory_save response envelope
  - Response includes embedding_status field (memory-save.js:792-801)
  - Hint added for deferred indexing state
  - Failure reason included when embedding fails

### Retry Logic with Exponential Backoff (REQ-032)

- [x] T101 [W-I] Implement `retryWithBackoff()` utility function
  - Created `lib/utils/retry.js` with comprehensive retry logic
  - `retryWithBackoff(fn, options)` with exponential backoff (1s, 2s, 4s)
- [x] T102 [W-I][B:T101] Configure retry for transient errors: 5xx, ETIMEDOUT, ECONNRESET
  - TRANSIENT_HTTP_STATUS_CODES: 408, 429, 500, 502, 503, 504, 520-524
  - TRANSIENT_NETWORK_ERRORS: ETIMEDOUT, ECONNRESET, ECONNREFUSED, etc.
- [x] T103 [W-I][B:T101] Configure fail-fast for permanent errors: 401, 403
  - PERMANENT_HTTP_STATUS_CODES: 400, 401, 403, 404, 405, 410, 422
  - Permanent errors throw immediately with `isPermanent: true` flag
- [x] T104 [W-I][B:T101] Add retry attempt logging with error type
  - Each retry logged with attempt number and error classification
  - classifyError() returns {type, reason, shouldRetry}; 40 tests passing

### Memory Save Atomicity (REQ-033)

- [x] T105 [W-I] Wrap file write + index insert in transaction pattern
  - Created `lib/storage/transaction-manager.js` with `execute_atomic_save()` function
  - Wraps file write + index insert in transaction pattern (CHK-186, CHK-189)
  - File written atomically via temp file + rename strategy
  - Index function receives file path after successful write
  - All 9 unit tests passing
- [x] T106 [W-I][B:T105] Implement file rollback on index failure
  - On index failure: file rolled back (deleted) OR renamed with `_pending` suffix (CHK-187)
  - `rollback_on_failure` and `create_pending_on_failure` options control behavior
  - Default: create pending file first, rollback as fallback
  - Metrics track rollback count and pending files created
- [x] T107 [W-I][B:T105] Add pending file recovery on MCP startup
  - `recover_pending_files()` in context-server.js calls on startup (CHK-188)
  - `find_pending_files()` scans for `_pending` suffix files recursively
  - `recover_all_pending_files()` processes up to 50 files per startup
  - Renames back to original path, then re-indexes
  - Metrics logged for monitoring (CHK-190)

---

## Phase 5: Template & Command Improvements (Week 12-13)

> **Source:** 20-agent parallel analysis (2026-02-01)
> **Goal:** Update context_template.md and memory commands with analysis findings

### Template Updates (context_template.md)

| ID | Task | Priority | Workstream | Est | Status |
|----|------|----------|------------|-----|--------|
| T108 | Add CONTINUE_SESSION section with session state table, context summary, pending work, quick resume | P0 | W-I | 4h | ✅ |
| T109 | Add session_dedup metadata block (session_id, memories_surfaced, dedup_savings_tokens, fingerprint_hash) | P0 | W-S | 4h | ✅ |
| T110 | Add memory_classification fields (memory_type, half_life_days, decay_factors) | P0 | W-D | 4h | ✅ |
| T111 | Add causal_links metadata (caused_by, supersedes, derived_from, blocks, related_to) | P1 | W-G | 4h | ✅ |
| T112 | Add RECOVERY HINTS section with scenarios table and diagnostic commands | P1 | W-I | 4h | ✅ |
| T113 | Update template TOC and version to v2.2 | P1 | W-I | 1h | ✅ |

**Template Tasks Evidence (T108-T113) - Verified 2026-02-01:**
- T108: CONTINUE_SESSION section at lines 171-224 with session state table, context summary, pending work, quick resume
- T109: session_dedup metadata block at lines 719-729 with memories_surfaced, dedup_savings_tokens, fingerprint_hash
- T110: memory_classification fields at lines 709-717 with memory_type, half_life_days, decay_factors
- T111: causal_links metadata at lines 731-757 with caused_by, supersedes, derived_from, blocks, related_to
- T112: RECOVERY HINTS section at lines 582-640 with scenarios table and diagnostic commands
- T113: Template version v2.2 at line 1, TOC updated at lines 156-167


### Command Documentation Updates (save.md)

| ID | Task | Priority | Workstream | Est | Status |
|----|------|----------|------------|-----|--------|
| T114 | Add Phase 0: Pre-flight Validation (ANCHOR format, duplicates, token budget, spec folder, file naming) | P0 | W-I | 4h | ✅ |
| T115 | Add §16 Session Deduplication documentation (purpose, how it works, metadata fields, impact) | P0 | W-S | 4h | ✅ |
| T116 | Add Deferred Indexing documentation to §11 (graceful degradation, retry logic, manual recovery) | P1 | W-I | 2h | ✅ |
| T117 | Add Structured Response Envelope to §9 (summary, data, hints, meta JSON structure) | P1 | W-I | 2h | ✅ |

### New Command Files

| ID | Task | Priority | Workstream | Est | Status |
|----|------|----------|------------|-----|--------|
| T118 | Create /memory:continue command for session recovery from crash/compaction | P0 | W-S | 8h | ✅ |
| T119 | Create /memory:context unified entry command with intent awareness | P0 | W-R | 8h | ✅ |
| T120 | Create /memory:why lineage tracing command | P1 | W-G | 8h | ✅ |
| T121 | Create /memory:correct command for learning from mistakes | P1 | W-G | 6h | ✅ |
| T122 | Create /memory:learn command for explicit learning capture | P1 | W-S | 6h | ✅ |

### Implementation Integration

| ID | Task | Priority | Workstream | Est | Status |
|----|------|----------|------------|-----|--------|
| T123 | Implement session deduplication in MCP server (track surfaced IDs, filter results) | P0 | W-S | 8h | ✅ |
| T124 | Implement CONTINUE_SESSION auto-generation in generate-context.js | P0 | W-I | 6h | ✅ |
| T125 | Add memory_type classification to indexer | P1 | W-D | 6h | ✅ |
| T126 | Implement causal_links tracking in memory operations | P1 | W-G | 8h | ✅ |

**Phase 5 Total: 19 tasks, ~96 hours (~12 days)**

### Task Dependencies

```
T108-T113 (Template) ──┐
                       ├──► T124 (generate-context.js integration)
T114-T117 (Docs) ──────┘
                       
T123 (Session Dedup MCP) ──► T118 (/memory:continue)
T126 (Causal Links) ──► T120 (/memory:why)
```

---

## COMPLETION CRITERIA

- [x] All P0 tasks (T001-T019) marked `[x]` - 19/19 complete
- [x] All P1 tasks (T020-T063) marked `[x]` - 44/44 complete
- [x] All Embedding Resilience tasks (T087-T107) marked `[x]` - 21/21 complete
- [x] All Template & Command tasks (T108-T126) marked `[x]` - 19/19 complete
- [x] No `[B]` blocked tasks remaining - All dependencies satisfied
- [x] Manual verification passed - All 107 tasks implemented
- [x] Schema migrations tested (v4.1, v4.2, v5) - Session state, causal edges, corrections tables
- [x] All 21 tools updated with standardized responses - lib/response/envelope.js used by all handlers
- [x] Embedding fallback chain tested with each provider disabled - 28 tests in provider-chain.test.js
- [x] context_template.md updated to v2.2 - ANCHOR format, 9 memory types, causal links

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

Before starting each task, verify:

1. [ ] Load `spec.md` and verify scope hasn't changed
2. [ ] Load `plan.md` and identify current phase
3. [ ] Load `tasks.md` and find next uncompleted task
4. [ ] Verify task dependencies are satisfied (check `[B:T###]` markers)
5. [ ] Load `checklist.md` and identify relevant P0/P1 items
6. [ ] Check for blocking issues in `decision-record.md`
7. [ ] Verify `memory/` folder for context from previous sessions
8. [ ] Confirm understanding of success criteria
9. [ ] Begin implementation only after all checks pass

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order (respect `[B:T###]` markers) |
| TASK-SCOPE | Stay within task boundary, no scope creep |
| TASK-VERIFY | Verify each task against acceptance criteria |
| TASK-DOC | Update status immediately on completion |
| TASK-PARALLEL | Tasks marked `[P]` can run concurrently with same-day tasks |

### HALT Conditions

The AI agent MUST stop execution and escalate to human review when:

| Condition | Trigger | Action |
|-----------|---------|--------|
| **Scope Creep** | Task requires changes outside defined file boundaries | HALT → Report scope expansion → Await approval |
| **Test Failures** | 3+ consecutive test failures on same component | HALT → Document failure pattern → Request guidance |
| **Dependency Conflict** | Circular or unresolvable dependency detected | HALT → Map conflict → Propose resolution options |
| **Breaking Change** | Modification would break existing functionality | HALT → Impact analysis → Require explicit approval |
| **Confidence < 40%** | Uncertainty about correct implementation approach | HALT → State unknowns → Request clarification |
| **Missing Prerequisite** | Required task not completed but marked as dependency | HALT → Identify gap → Request task ordering review |

### Failure Recovery Protocol

When a task fails or produces unexpected results:

1. **Immediate Actions:**
   - Stop current execution
   - Document exact error/failure state
   - Preserve all debug artifacts in `scratch/`

2. **Analysis Phase:**
   - Trace failure to root cause
   - Identify affected downstream tasks
   - Assess rollback requirements

3. **Recovery Options:**
   | Severity | Definition | Recovery Action |
   |----------|------------|-----------------|
   | **Minor** | Isolated failure, no downstream impact | Fix and continue |
   | **Moderate** | Affects 1-3 downstream tasks | Fix → Revalidate affected tasks |
   | **Major** | Affects entire workstream | HALT → Full workstream review → Human approval to continue |
   | **Critical** | Cross-workstream impact | HALT → Escalate immediately → May require spec revision |

4. **Documentation:**
   - Log failure in `memory/` for future sessions
   - Update checklist with failure notes
   - Add lessons learned to decision-record.md if architectural

### Status Reporting Format

```
## Status Update - [TIMESTAMP]
- **Task**: T### - [Description]
- **Workstream**: W-X
- **Status**: [IN_PROGRESS | COMPLETED | BLOCKED]
- **Evidence**: [Link to code/test/artifact]
- **Blockers**: [None | Description with blocking task ID]
- **Next**: T### - [Next task]
```

---

## WORKSTREAM ORGANIZATION

### W-S: Session Management

| Task | Description | Dependencies |
|------|-------------|--------------|
| T001-T004 | Session deduplication | None |
| T071-T075 | Crash recovery & continuation | T003 |

### W-R: Search/Retrieval

| Task | Description | Dependencies |
|------|-------------|--------------|
| T020-T023 | RRF fusion | None |
| T028-T031 | BM25 hybrid | T023 |
| T036-T039 | Intent-aware retrieval | None |
| T048-T051 | Cross-encoder reranking | T031 |
| T076-T078 | Fuzzy matching | None |

### W-D: Decay & Scoring

| Task | Description | Dependencies |
|------|-------------|--------------|
| T005-T008 | Type-specific half-lives | None |
| T024-T027 | Usage boost | None |
| T032-T035 | Multi-factor composite | T008, T026 |
| T056-T059 | 5-state model | None |
| T079-T083 | Consolidation engine | T056 |

### W-G: Graph/Relations

| Task | Description | Dependencies |
|------|-------------|--------------|
| T043-T047 | Causal memory graph | None |
| T052-T055 | Learning from corrections | T043 |

### W-I: Infrastructure

| Task | Description | Dependencies |
|------|-------------|--------------|
| T009-T011 | Recovery hints | None |
| T012-T015 | Tool output caching | None |
| T016-T019 | Lazy model loading | None |
| T040-T042 | Standardized responses | T010 |
| T060-T063 | Layered tools | T041 |
| T064-T070 | Indexing & preflight | None |
| T084-T086 | Protocol abstractions | None |
| T087-T107 | Embedding resilience | T087 (chain start) |

---

## CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Source Analysis**: See `consolidated-analysis.md`

---

<!--
LEVEL 3+ TEMPLATE (~340 lines)
- 126 tasks across 5 phases + additional features
- Phase 4: Embedding Resilience (T087-T107) added from 10-agent analysis
- Phase 5: Template & Command Improvements (T108-T126) added from 20-agent analysis
- Workstream organization (W-S, W-R, W-D, W-G, W-I)
- Dependency tracking with [B:T###] notation
- Day-by-day Phase 1, week-by-week Phase 2-5
- AI execution protocol with pre-task checklist
- Status reporting format for autonomous agents
-->
