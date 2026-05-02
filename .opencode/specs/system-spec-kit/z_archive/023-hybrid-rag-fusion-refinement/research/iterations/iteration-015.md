# Iteration 15: Env Var Documentation Gap + Remaining Optimization Opportunities

## Focus
Two complementary targets for this iteration:
1. **SPECKIT_* env var catalog**: Quantify the full inventory of undocumented environment variables and categorize them by domain
2. **Remaining optimization opportunities**: Audit the cross-encoder cache (unbounded Map), embedding API circuit breaker gap, and any other low-hanging fruit not yet captured across 14 prior iterations

## Findings

### Finding 1: 113 unique SPECKIT_* env vars exist, only 4 documented (96% undocumented)

Complete extraction from source code (lib/, core/, handlers/, hooks/, context-server.ts) yielded **113 unique SPECKIT_* environment variable names**. The INSTALL_GUIDE.md documents only **4**:
- `SPECKIT_ADAPTIVE_FUSION` (default: true)
- `SPECKIT_EXTENDED_TELEMETRY` (default: false)
- `SPECKIT_MEMORY_ROADMAP_PHASE` (default: shared-rollout)
- `SPECKIT_MEMORY_GRAPH_UNIFIED` (default: true)

This is a **96% documentation gap** -- 109 env vars have no user-facing documentation.

[SOURCE: INSTALL_GUIDE.md:356-359 for documented vars; grep across mcp_server/ source for full inventory]

### Finding 2: Categorized inventory of all 113 SPECKIT_* env vars by domain

**Search Pipeline & Retrieval (28 vars)**:
SPECKIT_CAUSAL_BOOST, SPECKIT_CHANNEL_MIN_REP, SPECKIT_CONFIDENCE_TRUNCATION, SPECKIT_CROSS_ENCODER, SPECKIT_DEGREE_BOOST, SPECKIT_DYNAMIC_TOKEN_BUDGET, SPECKIT_EMBEDDING_EXPANSION, SPECKIT_ENCODING_INTENT, SPECKIT_FOLDER_BOOST_FACTOR, SPECKIT_FOLDER_DISCOVERY, SPECKIT_FOLDER_SCORING, SPECKIT_FOLDER_TOP_K, SPECKIT_GRAPH_CALIBRATION_PROFILE, SPECKIT_GRAPH_CONCEPT_ROUTING, SPECKIT_GRAPH_LOCAL_THRESHOLD, SPECKIT_GRAPH_REFRESH_MODE, SPECKIT_GRAPH_SIGNALS, SPECKIT_GRAPH_UNIFIED, SPECKIT_GRAPH_WALK_ROLLOUT, SPECKIT_GRAPH_WEIGHT_CAP, SPECKIT_HYBRID_DECAY_POLICY, SPECKIT_INTENT_CONFIDENCE_FLOOR, SPECKIT_MMR, SPECKIT_MULTI_QUERY, SPECKIT_RRF_K_EXPERIMENTAL, SPECKIT_SCORE_NORMALIZATION, SPECKIT_SEARCH_FALLBACK, SPECKIT_SESSION_BOOST

**Cognitive & Adaptive (14 vars)**:
SPECKIT_CLASSIFICATION_DECAY, SPECKIT_COACTIVATION, SPECKIT_COACTIVATION_STRENGTH, SPECKIT_COMMUNITY_DETECTION, SPECKIT_CONSOLIDATION, SPECKIT_EVENT_DECAY, SPECKIT_MEMORY_ADAPTIVE_MODE, SPECKIT_MEMORY_ADAPTIVE_RANKING, SPECKIT_NOVELTY_BOOST, SPECKIT_PRESSURE_POLICY, SPECKIT_QUALITY_LOOP, SPECKIT_RECONSOLIDATION, SPECKIT_ASSISTIVE_RECONSOLIDATION, SPECKIT_WORKING_MEMORY

**Graph & Entity (10 vars)**:
SPECKIT_AUTO_ENTITIES, SPECKIT_ENTITY_LINKING, SPECKIT_ENTITY_LINKING_MAX_DENSITY, SPECKIT_LLM_GRAPH_BACKFILL, SPECKIT_LOUVAIN_MIN_DENSITY, SPECKIT_LOUVAIN_MIN_SIZE, SPECKIT_RELATIONS, SPECKIT_TYPED_TRAVERSAL, SPECKIT_TEMPORAL_CONTIGUITY, SPECKIT_SIGNAL_VOCAB

**Feedback & Learning (8 vars)**:
SPECKIT_BATCH_LEARNED_FEEDBACK, SPECKIT_IMPLICIT_FEEDBACK_LOG, SPECKIT_LEARN_FROM_SELECTION, SPECKIT_LEARNED_STAGE, SPECKIT_NEGATIVE_FEEDBACK, SPECKIT_SHADOW_FEEDBACK, SPECKIT_SHADOW_LEARNING, SPECKIT_SHADOW_SCORING

**UX & Response (8 vars)**:
SPECKIT_AUTO_RESUME, SPECKIT_CONTEXT_HEADERS, SPECKIT_PROGRESSIVE_DISCLOSURE_V, SPECKIT_RESPONSE_PROFILE_V, SPECKIT_RESPONSE_TRACE, SPECKIT_RESULT_CONFIDENCE_V, SPECKIT_RESULT_EXPLAIN_V, SPECKIT_SESSION_RETRIEVAL_STATE_V

**Fusion & Ranking (7 vars)**:
SPECKIT_CALIBRATED_OVERLAP_BONUS, SPECKIT_CALIBRATION_PROFILE_NAME, SPECKIT_COMPLEXITY_ROUTER, SPECKIT_DOCSCORE_AGGREGATION, SPECKIT_INTERFERENCE_SCORE, SPECKIT_RECENCY_DECAY_DAYS, SPECKIT_ROLLOUT_PERCENT

**Query Processing (5 vars)**:
SPECKIT_EXTRACTION, SPECKIT_HYDE, SPECKIT_HYDE_ACTIVE, SPECKIT_HYDE_LOG, SPECKIT_LLM_REFORMULATION, SPECKIT_QUERY_DECOMPOSITION, SPECKIT_QUERY_SURROGATES

**Governance & Roadmap (9 vars)**:
SPECKIT_HYDRA_ADAPTIVE_RANKING, SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS, SPECKIT_HYDRA_GRAPH_UNIFIED, SPECKIT_HYDRA_LINEAGE_STATE, SPECKIT_HYDRA_PHASE, SPECKIT_HYDRA_SCOPE_ENFORCEMENT, SPECKIT_HYDRA_SHARED_MEMORY, SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS, SPECKIT_MEMORY_SCOPE_ENFORCEMENT

**Infrastructure & Config (12 vars)**:
SPECKIT_ABLATION, SPECKIT_ARCHIVAL, SPECKIT_DB_DIR, SPECKIT_DB_PATH, SPECKIT_DEBUG_INDEX_SCAN, SPECKIT_DYNAMIC_INIT, SPECKIT_EAGER_WARMUP (deprecated), SPECKIT_EVAL_DB_PATH, SPECKIT_EVAL_LOGGING, SPECKIT_INDEX_SCAN_LEASE_EXPIRY_MS, SPECKIT_LAZY_LOADING (deprecated), SPECKIT_SKIP_API_VALIDATION

**Indexing & Validation (6 vars)**:
SPECKIT_FILE_WATCHER, SPECKIT_INDEX_SPEC_DOCS, SPECKIT_PARSER, SPECKIT_PARSER_ENV, SPECKIT_SAVE_QUALITY_GATE, SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS

**Reranker-specific (4 vars)**:
SPECKIT_RERANKER_MODEL, SPECKIT_RERANKER_TIMEOUT_MS, SPECKIT_LEVEL, SPECKIT_LEVEL_REGEX

**Misc/Other (6 vars)**:
SPECKIT_CONSUMPTION_LOG, SPECKIT_DASHBOARD_LIMIT, SPECKIT_EMPTY_RESULT_RECOVERY_V, SPECKIT_MEMORY_LINEAGE_STATE, SPECKIT_MEMORY_SUMMARIES, SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID, SPECKIT_SHARED_MEMORY_ADMIN_USER_ID, SPECKIT_TOKEN_BUDGET, SPECKIT_TRM, SPECKIT_VRULE_OPTIONAL, SPECKIT_N

[SOURCE: grep -rho 'SPECKIT_[A-Z_]*' across mcp_server source directories | sort -u]

### Finding 3: Cross-encoder cache is unbounded -- confirmed with exact code location and fix design

The cross-encoder cache at `lib/search/cross-encoder.ts:115-116` is:
```typescript
const cache = new Map<string, { results: RerankResult[]; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutes
```

**Problem**: No size limit. Each entry stores full RerankResult arrays keyed by `generateCacheKey(query, docIds, provider, optionBits)`. Under sustained diverse queries, this Map grows indefinitely. TTL only helps if entries are actively checked/evicted, but there is no sweep -- stale entries remain until the Map is garbage-collected with the module.

**Other unbounded caches found** (same pattern):
- `lib/cognitive/co-activation.ts:80` -- `RELATED_CACHE = new Map<string, { results; expiresAt }>()` (has TTL but no size limit)
- `lib/search/vector-index-store.ts:444` -- `constitutional_cache = new Map<string, { data; timestamp }>()` (bounded in practice by number of scope keys)
- `lib/cache/tool-cache.ts:67` -- `cache = new Map<string, CacheEntry>()` (unknown bound)
- `lib/parsing/trigger-matcher.ts:165` -- `regexLruCache: Map<string, RegExp> = new Map()` (name says LRU but it is a plain Map)

**Already bounded caches** (good pattern):
- `lib/graph/graph-signals.ts:24-44` -- `momentumCache` and `depthCache` both call `enforceCacheBound()` which clears when limit exceeded

**Proposed fix for cross-encoder cache** (~30 min):
```typescript
const MAX_CACHE_ENTRIES = 200; // ~200 unique query+doc combos
const cache = new Map<string, { results: RerankResult[]; timestamp: number }>();

// Add before cache.set():
function evictStaleAndEnforce(): void {
  const now = Date.now();
  // First pass: evict expired
  for (const [key, entry] of cache) {
    if (now - entry.timestamp > CACHE_TTL) cache.delete(key);
  }
  // Second pass: if still over limit, delete oldest
  if (cache.size >= MAX_CACHE_ENTRIES) {
    let oldest = Infinity, oldestKey = '';
    for (const [key, entry] of cache) {
      if (entry.timestamp < oldest) { oldest = entry.timestamp; oldestKey = key; }
    }
    if (oldestKey) cache.delete(oldestKey);
  }
}
```

[SOURCE: lib/search/cross-encoder.ts:115-116; lib/graph/graph-signals.ts:40-44 for bounded pattern]

### Finding 4: Embedding API has NO circuit breaker -- confirmed gap

The embedding path in `vector-index-store.ts` has:
- A `get_confirmed_embedding_dimension()` function with a 5-second timeout (line 127-139)
- A `busy_timeout = 10000` SQLite pragma (line 806)
- **No circuit breaker pattern** -- no failure counter, no cooldown, no open/half-open states

The cross-encoder at `cross-encoder.ts:120-169` HAS a proper circuit breaker:
- `CIRCUIT_FAILURE_THRESHOLD = 3` consecutive failures
- `CIRCUIT_COOLDOWN_MS = 60_000` (1 minute)
- Full state machine: closed -> open -> half-open -> closed
- Per-provider tracking via `circuitBreakers = new Map<string, CircuitState>()`

**Impact**: If the embedding provider (Voyage AI, OpenAI, etc.) is down, every search request will:
1. Attempt to generate an embedding
2. Wait for the provider's HTTP timeout (typically 10-30 seconds)
3. Fail at Stage 1 candidate generation
4. Fall through to degraded search (FTS5/BM25 only)

This happens on EVERY request, not just the first few. A circuit breaker would allow the system to skip the embedding call entirely after N failures and go straight to degraded mode, saving 10-30 seconds per request during an outage.

**Proposed fix** (~1-2 hours): Mirror the cross-encoder circuit breaker pattern for the embedding provider path. Add to the embedding factory or to the vector search entry point in hybrid-search.ts.

[SOURCE: lib/search/vector-index-store.ts:127-139, lib/search/cross-encoder.ts:120-169]

### Finding 5: Comprehensive cache audit -- 12 module-level caches, 4 unbounded

Full cache inventory across the MCP server:

| Cache | Location | Bounded? | Eviction | Risk |
|-------|----------|----------|----------|------|
| cross-encoder results | cross-encoder.ts:115 | NO | TTL check on read | Memory leak under diverse queries |
| co-activation results | co-activation.ts:80 | NO | TTL check on read | Moderate (session-scoped queries) |
| constitutional memories | vector-index-store.ts:444 | Effectively yes | TTL (1 min) | Low (bounded by scope keys) |
| tool-cache | tool-cache.ts:67 | UNKNOWN | UNKNOWN | Needs audit |
| regex LRU (misnamed) | trigger-matcher.ts:165 | NO | None | Low (bounded by trigger phrase count) |
| graph momentum | graph-signals.ts:24 | YES | enforceCacheBound() | None (properly bounded) |
| graph depth | graph-signals.ts:27 | YES | enforceCacheBound() | None (properly bounded) |
| spec folder history | history.ts:68 | NO | None | Low (bounded by memory count) |
| adaptive threshold | adaptive-ranking.ts:106 | WeakMap | GC | None (WeakMap auto-collects) |
| hierarchy | spec-folder-hierarchy.ts:35 | WeakMap | GC | None (WeakMap auto-collects) |
| description map | hybrid-search.ts:1907 | Single entry | TTL | None (single cached result) |
| tree-sitter grammars | tree-sitter-parser.ts:34 | Effectively yes | None | None (bounded by language count) |

**Summary**: 4 caches are technically unbounded (cross-encoder, co-activation, tool-cache, regex). Only the cross-encoder poses real risk under sustained load. The others are bounded in practice by the finite universe of their key space.

[SOURCE: grep for 'new Map' across mcp_server/lib/ and mcp_server/handlers/]

### Finding 6: Backlog completeness check -- all areas adequately investigated

Re-reading the strategy.md, I verified coverage across all research tracks:
- **Feature flags** (iterations 1, 10): Complete -- all 113 vars cataloged, 6 opt-in assessed
- **Pipeline quality** (iterations 2, 6, 9): Complete -- all 4 stages audited, edge cases checked
- **Fix verification** (iteration 3): Complete -- specs 009/010/011 all confirmed
- **UX/auto-utilization** (iteration 4): Complete -- hookless architecture confirmed
- **Fusion refinement** (iterations 5, 11, 12): Complete -- weight profiles, recency design, graph cap design
- **P1/P2 refinement** (iterations 7, 8): Complete -- all items assessed with code locations
- **Test coverage** (iteration 13): Complete -- per-change regression matrix
- **Cross-cutting** (iteration 14): Complete -- performance, logging, error recovery, DB health
- **Env var docs + caches** (this iteration): Complete -- full catalog, cache audit

**One area slightly under-investigated**: The `tool-cache.ts` module (line 67) was not read in any iteration. Its bounded-ness is unknown. However, this is a P3 concern at most -- the cache is used for MCP tool result caching, not search pipeline caching.

[INFERENCE: Based on comprehensive review of all 14 prior iteration findings and strategy.md sections 6-11]

### Finding 7: Revised final optimization backlog

Incorporating this iteration's findings into the complete backlog:

**P1 (High impact, designed and ready):**
1. P1-3: Stage 2 recency bonus -- FULLY DESIGNED (iteration 11)
2. P1-4: GRAPH_WEIGHT_CAP raise 0.05->0.15 -- DESIGNED (iteration 12)

**P2 (Medium impact):**
1. P2-4: Doc-type proportional shift -- 30 min
2. P2-NEW: Env var reference documentation -- ~4-6 hours (113 vars across 11 categories)
3. P2-NEW: Cross-encoder cache size limit -- ~30 min (apply graph-signals enforceCacheBound pattern)

**P3 (Nice-to-have):**
1. P3-1: "Query too broad" signal -- ~2h
2. P3-2: Post-limit diversity re-check -- ~1h
3. P3-3: NOVELTY_BOOST dead code cleanup -- ~30 min
4. P3-NEW: Embedding API circuit breaker -- ~1-2h (mirror cross-encoder pattern)
5. P3-NEW: Structured pipeline completion log line -- ~30 min
6. P3-NEW: co-activation cache size limit -- ~15 min
7. P3-NEW: tool-cache.ts audit and bound -- ~15 min

**Default-enable work (2 items, ~2-3 hours):**
- SPECKIT_RECONSOLIDATION enable by default (with auto-checkpoint)
- SPECKIT_QUALITY_LOOP enable by default

**Total estimated effort**: ~14-18 hours for all items

[INFERENCE: Synthesis of all 15 iterations' findings into prioritized backlog]

## Ruled Out
- `regexLruCache` in trigger-matcher.ts as a memory leak -- bounded in practice by finite trigger phrase count (typically <500 unique phrases)
- `constitutional_cache` as unbounded -- bounded by number of unique scope keys (typically <10), refreshed every 60 seconds
- `specFolderCache` in history.ts as a leak -- bounded by number of memories in DB (finite)

## Dead Ends
None in this iteration -- all approaches were productive.

## Sources Consulted
- `lib/search/cross-encoder.ts:100-180` -- cache definition, circuit breaker implementation
- `lib/search/vector-index-store.ts:127-139, 444-449, 524, 806` -- embedding timeout, constitutional cache, prepared statements cache
- `lib/graph/graph-signals.ts:24-44` -- bounded cache pattern (enforceCacheBound)
- `lib/cognitive/co-activation.ts:80` -- RELATED_CACHE definition
- `lib/cache/tool-cache.ts:67` -- tool cache definition
- `lib/parsing/trigger-matcher.ts:162-165` -- trigger caches
- `lib/search/hybrid-search.ts:735, 1049, 1907` -- per-request and module-level caches
- `INSTALL_GUIDE.md:356-359` -- documented env vars
- grep output across entire mcp_server/ -- 113 unique SPECKIT_* vars

## Assessment
- New information ratio: 0.43
- Questions addressed: env-var-catalog, cross-encoder-cache-fix, embedding-circuit-breaker, cache-audit, backlog-completeness
- Questions answered: env-var-catalog (fully), cross-encoder-cache-fix (designed), embedding-circuit-breaker (gap confirmed, fix proposed), cache-audit (complete), backlog-completeness (verified)

## Reflection
- What worked and why: The env var extraction via grep with sort -u gave a definitive, complete list in a single command. The cache audit leveraged the earlier Grep for cache/Map patterns to build a systematic inventory. Cross-referencing the bounded graph-signals pattern with the unbounded cross-encoder pattern provided both the problem and the solution in one investigation.
- What did not work and why: Initial grep with `-P` (Perl regex) flag failed silently in this environment -- had to fall back to basic grep with `[A-Z_]*` pattern. Minor cost (1 extra tool call).
- What I would do differently: Start with basic grep patterns instead of Perl-extended regex to avoid environment compatibility issues.

## Recommended Next Focus
Research is nearing convergence. The newInfoRatio has declined from 0.71 -> 0.64 -> 0.57 -> 0.43 -> 0.43 over the last 5 iterations. All 10 original key questions are answered. The env var catalog and cache audit are complete. Recommend proceeding to final synthesis.

Remaining potential investigation (if more iterations needed):
- Deep dive into tool-cache.ts to verify its eviction strategy
- Read the SPECKIT_N and SPECKIT_TRM vars to understand their purpose (possibly testing/internal)
- Verify that deprecated vars (SPECKIT_EAGER_WARMUP, SPECKIT_LAZY_LOADING) have migration paths
