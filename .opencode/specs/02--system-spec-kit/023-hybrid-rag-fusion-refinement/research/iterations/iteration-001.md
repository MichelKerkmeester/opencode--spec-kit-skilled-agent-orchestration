# Iteration 1: Feature Flag Audit -- Defaults and Opt-in/Opt-out Status

## Focus
Comprehensive audit of all SPECKIT_* feature flags, environment variables, and configuration defaults across the MCP server codebase to answer Q1 (which features are NOT enabled by default) and Q2 (are session boost, causal boost, intent weights, feedback signals, and graph signals all enabled by default).

## Findings

### 1. Rollout Policy Architecture (Default-ON by design)

The entire feature flag system is built on `isFeatureEnabled()` in `lib/cognitive/rollout-policy.ts`. The function treats **undefined/missing env vars as ENABLED** (default ON). Only explicit `false` or `0` disables a feature. A global `SPECKIT_ROLLOUT_PERCENT` (default 100%) gates deterministic bucket rollout.

**Implication**: Any flag using `isFeatureEnabled()` is ON by default unless the code explicitly checks for `=== 'true'` instead.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:53-74]

### 2. Complete Feature Flag Inventory -- DEFAULT ON (Graduated)

All of the following flags use `isFeatureEnabled()` via `search-flags.ts` and are **DEFAULT ON**:

| Flag | Function | Category |
|------|----------|----------|
| `SPECKIT_SESSION_BOOST` | Session attention boost | Boost |
| `SPECKIT_CAUSAL_BOOST` | Causal graph traversal boost | Boost |
| `SPECKIT_DYNAMIC_INIT` | Dynamic startup instruction injection | Core |
| `SPECKIT_PRESSURE_POLICY` | Token-pressure policy | Core |
| `SPECKIT_AUTO_RESUME` | Auto session resume context | Core |
| `SPECKIT_MMR` | Graph-guided MMR diversity reranking | Core |
| `SPECKIT_TRM` | Transparent Reasoning Module | Core |
| `SPECKIT_MULTI_QUERY` | Multi-query expansion (deep mode) | Core |
| `SPECKIT_CROSS_ENCODER` | Cross-encoder reranking | Core |
| `SPECKIT_SEARCH_FALLBACK` | 3-tier search fallback chain | Core |
| `SPECKIT_FOLDER_DISCOVERY` | Spec folder discovery | Core |
| `SPECKIT_DOCSCORE_AGGREGATION` | Document-level chunk-to-memory aggregation | Fusion |
| `SPECKIT_SAVE_QUALITY_GATE` | Pre-storage quality gate | Save |
| `SPECKIT_DYNAMIC_TOKEN_BUDGET` | Dynamic token budget by complexity | Fusion |
| `SPECKIT_CONFIDENCE_TRUNCATION` | Confidence-gap tail truncation | Fusion |
| `SPECKIT_CHANNEL_MIN_REP` | Channel minimum-representation promotion | Fusion |
| `SPECKIT_NEGATIVE_FEEDBACK` | Negative-feedback confidence demotion | Feedback |
| `SPECKIT_EMBEDDING_EXPANSION` | Query expansion for embedding retrieval | Pipeline |
| `SPECKIT_CONSOLIDATION` | Consolidation engine (contradiction scan, Hebbian) | Indexing |
| `SPECKIT_ENCODING_INTENT` | Encoding-intent capture at index time | Indexing |
| `SPECKIT_GRAPH_SIGNALS` | Graph momentum scoring + causal depth | Graph |
| `SPECKIT_COMMUNITY_DETECTION` | BFS components + Louvain community detection | Graph |
| `SPECKIT_MEMORY_SUMMARIES` | Memory summary generation (TF-IDF) | Graph |
| `SPECKIT_TEMPORAL_CONTIGUITY` | Temporal contiguity boost | Graph |
| `SPECKIT_AUTO_ENTITIES` | Auto entity extraction at save time | Graph |
| `SPECKIT_ENTITY_LINKING` | Cross-document entity linking | Graph |
| `SPECKIT_DEGREE_BOOST` | Causal-edge degree-based re-ranking | Graph |
| `SPECKIT_CONTEXT_HEADERS` | Contextual tree headers (Stage 4) | Sprint 9 |
| `SPECKIT_QUERY_DECOMPOSITION` | Query decomposition (deep mode) | D2 Query |
| `SPECKIT_GRAPH_CONCEPT_ROUTING` | Graph concept routing | D2 Query |
| `SPECKIT_QUERY_SURROGATES` | Index-time surrogates for recall | D2 Query |
| `SPECKIT_IMPLICIT_FEEDBACK_LOG` | Implicit feedback event ledger | D4 Feedback |
| `SPECKIT_HYBRID_DECAY_POLICY` | Type-aware no-decay for permanent artifacts | D4 Feedback |
| `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS` | Short-critical quality gate exception | D4 Feedback |
| `SPECKIT_LLM_REFORMULATION` | Corpus-grounded LLM query reformulation | D2 LLM |
| `SPECKIT_HYDE` | HyDE (Hypothetical Document Embeddings) | D2 LLM |
| `SPECKIT_LLM_GRAPH_BACKFILL` | Async LLM graph backfill | D3 Graph |
| `SPECKIT_GRAPH_CALIBRATION_PROFILE` | Graph calibration profiles + community thresholds | D3 Graph |
| `SPECKIT_LEARNED_STAGE2_COMBINER` | Learned Stage 2 weight combiner (shadow mode) | D1 Ranking |
| `SPECKIT_SHADOW_FEEDBACK` | Shadow scoring with holdout evaluation | D4 Shadow |
| `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` | Progressive disclosure for search results | D5 UX |
| `SPECKIT_SESSION_RETRIEVAL_STATE_V1` | Cross-turn retrieval session state | D5 UX |
| `SPECKIT_CALIBRATED_OVERLAP_BONUS` | Calibrated overlap bonus (multi-channel) | Spec 011 |
| `SPECKIT_RRF_K_EXPERIMENTAL` | Per-intent RRF K selection | Spec 011 |
| `SPECKIT_TYPED_TRAVERSAL` | Sparse-first + intent-aware typed traversal | Spec 011 |
| `SPECKIT_EMPTY_RESULT_RECOVERY_V1` | Empty/weak result recovery UX | Spec 011 |
| `SPECKIT_RESULT_CONFIDENCE_V1` | Per-result calibrated confidence scoring | Spec 011 |
| `SPECKIT_BATCH_LEARNED_FEEDBACK` | Weekly batch feedback learning pipeline | Spec 011 |
| `SPECKIT_ASSISTIVE_RECONSOLIDATION` | Assistive reconsolidation for dedup | Spec 011 |
| `SPECKIT_RESULT_EXPLAIN_V1` | Two-tier result explainability | Spec 011 |
| `SPECKIT_RESPONSE_PROFILE_V1` | Mode-aware response profile formatting | Spec 011 |

**Total default-ON flags: 50**

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:1-575]

### 3. Features that are DEFAULT OFF (Opt-in)

| Flag | Function | Reason |
|------|----------|--------|
| `SPECKIT_RECONSOLIDATION` | Reconsolidation-on-save for memory dedup | Explicit opt-in (`=== 'true'`) |
| `SPECKIT_FILE_WATCHER` | Real-time file watcher for markdown reindexing | Explicit opt-in (`=== 'true'`) |
| `RERANKER_LOCAL` | Local GGUF reranker | Explicit opt-in (`=== 'true'`) |
| `SPECKIT_QUALITY_LOOP` | Verify-fix-verify memory quality loop | Explicit opt-in (`=== 'true'`) |
| `SPECKIT_NOVELTY_BOOST` | Cold-start novelty boost | Opt-in (test evidence: returns 0 when not set) |

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:161-318, tests/cold-start.vitest.ts:35-41]

### 4. Roadmap Capability Flags (Mixed defaults)

From `capability-flags.ts`, the roadmap-level capability flags have mixed defaults:

| Flag | Default | Note |
|------|---------|------|
| `SPECKIT_MEMORY_LINEAGE_STATE` | ON (defaultValue=true) | Lineage state tracking |
| `SPECKIT_MEMORY_GRAPH_UNIFIED` | ON (defaultValue=true) | Graph unified search |
| `SPECKIT_MEMORY_ADAPTIVE_RANKING` | **OFF (defaultValue=false)** | Adaptive ranking NOT enabled by default |
| `SPECKIT_MEMORY_SCOPE_ENFORCEMENT` | ON (defaultValue=true) but runtime check is OFF | See finding 5 |
| `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS` | ON (defaultValue=true) but runtime check is OFF | See finding 5 |
| `SPECKIT_MEMORY_SHARED_MEMORY` | OFF (defaultValue=false) | Expected -- shared memory excluded |

**Key discovery: `adaptiveRanking` defaults to FALSE** in the roadmap flags. This may be intentional or a gap.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:134-164]

### 5. Governance Flags -- Dual Default Pattern (Roadmap ON, Runtime OFF)

There is a discrepancy for scope enforcement and governance guardrails:
- **Roadmap flags** (`capability-flags.ts`): `defaultValue=true` -- they appear ON
- **Runtime checks** (`scope-governance.ts`): Explicit opt-in pattern:
  - `SPECKIT_MEMORY_SCOPE_ENFORCEMENT`: "Default: OFF -- scope enforcement is opt-in" (line 185)
  - `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS`: "Default: OFF -- governance guardrails are opt-in" (line 200)

The runtime `isDefaultOffFlagEnabled()` function likely requires explicit `true` to enable. The roadmap flags say ON, but the actual runtime gate says OFF. **The runtime behavior (OFF) takes precedence** since that is the code path that guards actual functionality.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:185-206]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:148-155]

### 6. opencode.json Explicit Configuration

The `opencode.json` env section explicitly sets:
```
SPECKIT_ADAPTIVE_FUSION=true
SPECKIT_SESSION_BOOST=true
SPECKIT_CAUSAL_BOOST=true
```
And documents: "Opt-out flags (all default ON): SPECKIT_ADAPTIVE_FUSION, SPECKIT_EXTENDED_TELEMETRY, SPECKIT_SESSION_BOOST, SPECKIT_CAUSAL_BOOST"

**These are redundant** since the code already defaults them ON. They serve as documentation-in-config.

[SOURCE: opencode.json:28-37]

### 7. Other Operational/Debug Flags (Not Feature Flags)

| Flag | Purpose | Default |
|------|---------|---------|
| `SPECKIT_SKIP_API_VALIDATION` | Skip API key validation | OFF (testing only) |
| `SPECKIT_EVAL_LOGGING` | Eval logging | OFF (opt-in) |
| `SPECKIT_ABLATION` | Ablation studies | OFF (opt-in) |
| `SPECKIT_RESPONSE_TRACE` | Include trace data in results | OFF (opt-in) |
| `SPECKIT_RESULT_EXPLAIN_DEBUG` | Debug tier in explain | OFF (opt-in) |
| `SPECKIT_DEBUG_INDEX_SCAN` | Debug index scan output | OFF (opt-in) |
| `SPECKIT_INDEX_SPEC_DOCS` | Index spec docs | ON (set `false` to disable) |
| `SPECKIT_STRICT_SCHEMAS` | Strict schema validation | ON (set `false` to disable) |
| `SPECKIT_PARSER` | Parser backend (treesitter/regex) | `treesitter` |
| `SPECKIT_GRAPH_REFRESH_MODE` | Graph refresh mode | `write_local` |
| `SPECKIT_RELATIONS` | Causal edge creation during corrections | ON (set `false` to disable) |
| `SPECKIT_GRAPH_UNIFIED` | Unified graph search (db-state.ts) | ON (set `false` to disable) |
| `SPECKIT_INTENT_CONFIDENCE_FLOOR` | Intent confidence floor | `0.25` |
| `SPECKIT_MEMORY_ROADMAP_PHASE` | Roadmap phase | `shared-rollout` |
| `SPECKIT_ROLLOUT_PERCENT` | Global rollout percentage | `100` |
| `SPECKIT_INDEX_SCAN_LEASE_EXPIRY_MS` | Index scan lease expiry | (code-configured) |
| `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR` | Database directory | (auto-resolved) |
| `SPECKIT_GRAPH_WALK_ROLLOUT` | Graph walk rollout state | `bounded_runtime` (when GRAPH_SIGNALS=true) |
| `SPECKIT_SHADOW_SCORING` | Shadow scoring mode | OFF (opt-in) |
| `SPECKIT_BATCH_LEARNED_FEEDBACK` | Batch learned feedback | ON (graduated) |
| `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` | Co-activation regex pattern | (has default pattern) |
| `SPECKIT_COGNITIVE_COACTIVATION_FLAGS` | Co-activation regex flags | (has default) |
| `SPECKIT_SHARED_MEMORY_ADMIN_USER_ID` | Shared memory admin user | (must configure) |
| `SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID` | Shared memory admin agent | (must configure) |

[SOURCE: Multiple files across mcp_server/]

### 8. Answer to Q2: Are session boost, causal boost, intent weights, feedback signals, and graph signals all enabled by default?

**YES for all five**:
- **Session boost**: `SPECKIT_SESSION_BOOST` -- default ON via `isFeatureEnabled()`, also explicitly set in opencode.json
- **Causal boost**: `SPECKIT_CAUSAL_BOOST` -- default ON via `isFeatureEnabled()`, also explicitly set in opencode.json
- **Intent weights**: Intent auto-detection is ON by default in `memory_search` tool schema (`autoDetectIntent: true`), and intent confidence floor defaults to 0.25
- **Feedback signals**: `SPECKIT_NEGATIVE_FEEDBACK` (ON), `SPECKIT_IMPLICIT_FEEDBACK_LOG` (ON), `SPECKIT_BATCH_LEARNED_FEEDBACK` (ON), `SPECKIT_SHADOW_FEEDBACK` (ON)
- **Graph signals**: `SPECKIT_GRAPH_SIGNALS` (ON), `SPECKIT_COMMUNITY_DETECTION` (ON), `SPECKIT_DEGREE_BOOST` (ON), `SPECKIT_TYPED_TRAVERSAL` (ON)

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:27-37, 169-171, 230-232, 361-363, opencode.json:28-37]

## Ruled Out
None -- this was the first iteration; all approaches were productive.

## Dead Ends
None identified yet.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts` (canonical flag registry)
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts` (rollout infrastructure)
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts` (roadmap capability flags)
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` (governance runtime)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts` (session boost)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts` (causal boost)
- `opencode.json` (deployed env var configuration)
- `.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts` (novelty boost tests)
- Full SPECKIT_* grep across all .ts/.js files (120+ matches)
- Full process.env.SPECKIT_* grep (150+ matches)

## Assessment
- New information ratio: 1.0
- Questions addressed: Q1, Q2
- Questions answered: Q2 (fully answered), Q1 (substantially answered -- full inventory complete)

## Reflection
- What worked and why: Grep-based search for SPECKIT_* across the entire mcp_server directory yielded a complete inventory quickly. Reading the three core files (search-flags.ts, rollout-policy.ts, capability-flags.ts) gave the complete architectural picture.
- What did not work and why: N/A -- first iteration, all approaches productive.
- What I would do differently: Could have also checked .mcp.json files for additional env var definitions to ensure no configs are missing.

## Recommended Next Focus
Investigate Q3 (remaining search quality issues) and Q5 (bugs in fusion pipeline stages). Examine the actual pipeline code in stage1-candidate-gen.ts, stage2-fusion.ts, stage3-rerank.ts, stage4-filter.ts for correctness and potential issues. Also explore the `SPECKIT_MEMORY_ADAPTIVE_RANKING=false` default and the governance flag discrepancy -- determine if these are intentional or bugs.
