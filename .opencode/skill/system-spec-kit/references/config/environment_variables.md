---
title: Environment Variables Reference
description: Configuration options via environment variables for the Spec Kit system
---

# Environment Variables Reference

Configuration options via environment variables for the Spec Kit system.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

These variables control memory system behavior, token budgets, script execution, and batch processing.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:memory-system-mcp-server -->
## 2. MEMORY SYSTEM (MCP SERVER)

| Variable | Default | Purpose |
|----------|---------|---------|
| `MEMORY_DB_PATH` | `mcp_server/dist/database/context-index.sqlite` | Override database location |
| `MEMORY_BASE_PATH` | Current working directory | Workspace root path |
| `MEMORY_ALLOWED_PATHS` | `specs/,.opencode/` | Additional allowed paths (colon-separated) |
| `DEBUG_TRIGGER_MATCHER` | `false` | Enable verbose trigger matching logs |
| `ENABLE_RERANKER` | `false` | Enable experimental ML reranking (requires Python) |
| `SPECKIT_STRICT_SCHEMAS` | `true` | Enforce strict Zod MCP tool input validation for all 33 tools (`false` allows unknown passthrough keys) |
| `SPECKIT_RESPONSE_TRACE` | `false` | Include provenance-rich `scores`/`source`/`trace` fields by default in search responses |
| `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR` | Auto-detected | Fallback chain for database directory path. `SPEC_KIT_DB_DIR` checked first, then `SPECKIT_DB_DIR` |
| `DISABLE_SESSION_DEDUP` | `false` | Disables session-level deduplication when set to `true` |
| `ENABLE_TOOL_CACHE` | `true` | Enables tool-level TTL cache for repeated MCP tool lookups |
| `SPECKIT_DYNAMIC_INIT` | `true` | Inject dynamic startup instructions with memory/index summary at MCP initialization |
| `SPECKIT_CONTEXT_HEADERS` | `true` | Prepend contextual tree headers to markdown search content chunks |
| `SPECKIT_FILE_WATCHER` | `false` | Enable chokidar-based real-time markdown re-indexing |
| `RERANKER_LOCAL` | `false` | Enable local GGUF reranker path in Stage 3 (`node-llama-cpp`) |
| `SPECKIT_RERANKER_MODEL` | `models/bge-reranker-v2-m3.Q4_K_M.gguf` | Optional model path override for local reranker |

---

<!-- /ANCHOR:memory-system-mcp-server -->
<!-- ANCHOR:embedding-providers -->
## 3. EMBEDDING PROVIDERS

The MCP server supports multiple embedding providers for semantic search. Provider selection follows this precedence:
1. Explicit `EMBEDDINGS_PROVIDER` setting
2. `VOYAGE_API_KEY` detected (auto-selects Voyage)
3. `OPENAI_API_KEY` detected (auto-selects OpenAI)
4. Falls back to `hf-local` (Hugging Face local inference)

### Provider Selection

| Variable | Default | Purpose |
|----------|---------|---------|
| `EMBEDDINGS_PROVIDER` | `auto` | Explicit provider: `voyage`, `openai`, `hf-local`, or `auto` |

### Voyage AI Provider

| Variable | Default | Purpose |
|----------|---------|---------|
| `VOYAGE_API_KEY` | - | API key for Voyage AI embeddings (required for `voyage` provider) |
| `VOYAGE_EMBEDDINGS_MODEL` | `voyage-4` | Voyage model name (1024 dimensions) |

### OpenAI Provider

| Variable | Default | Purpose |
|----------|---------|---------|
| `OPENAI_API_KEY` | - | API key for OpenAI embeddings (required for `openai` provider) |
| `OPENAI_EMBEDDINGS_MODEL` | `text-embedding-3-small` | OpenAI model name (1536 dimensions) |

### Hugging Face Local Provider

| Variable | Default | Purpose |
|----------|---------|---------|
| `HF_EMBEDDINGS_MODEL` | `nomic-ai/nomic-embed-text-v1.5` | Local model name (768 dimensions) |

### Rate Limiting

| Variable | Default | Purpose |
|----------|---------|---------|
| `EMBEDDING_BATCH_DELAY_MS` | `100` | Delay between batch embedding requests (ms) |

---

<!-- /ANCHOR:embedding-providers -->
<!-- ANCHOR:token-budget -->
## 4. TOKEN BUDGET

| Variable | Default | Purpose |
|----------|---------|---------|
| `MCP_MAX_TOKENS` | `25000` | Maximum response token budget |
| `MCP_TOKEN_SAFETY_BUFFER` | `0.8` | Safety buffer multiplier (80%) |
| `MCP_CHARS_PER_TOKEN` | `4` | Token estimation ratio shared by pre-flight validation and the quality loop |
| `MCP_MIN_ITEMS` | `1` | Minimum items to return |

---

<!-- /ANCHOR:token-budget -->
<!-- ANCHOR:scripts -->
## 5. SCRIPTS

| Variable | Default | Purpose |
|----------|---------|---------|
| `DEBUG` | `false` | Enable debug logging in generate-context.ts |
| `AUTO_SAVE_MODE` | `false` | Skip alignment check in hooks |
| `SPECKIT_QUIET` | `false` | Suppress non-essential output |
| `SPECKIT_TEMPLATES_DIR` | Auto-detected | Override templates directory |
| `SPECKIT_TEMPLATE_STYLE` | `minimal` | Template style (currently only `minimal` supported) |

---

<!-- /ANCHOR:scripts -->
<!-- ANCHOR:batch-processing -->
## 6. BATCH PROCESSING

| Variable | Default | Purpose |
|----------|---------|---------|
| `SPEC_KIT_BATCH_SIZE` | `5` | Batch size for memory_index_scan |
| `SPEC_KIT_BATCH_DELAY_MS` | `100` | Delay between batches (ms) |

---

<!-- /ANCHOR:batch-processing -->
<!-- ANCHOR:usage-examples -->
## 7. USAGE EXAMPLES

```bash
# JSON mode (preferred for routine saves)
node scripts/dist/memory/generate-context.js --json '{"specFolder":"001-feature","sessionSummary":"..."}' specs/001-feature/

# Stdin mode with debug logging
DEBUG=1 echo '{"specFolder":"001-feature","sessionSummary":"..."}' | node scripts/dist/memory/generate-context.js --stdin

# Use custom database location
MEMORY_DB_PATH=/tmp/test-db.sqlite node mcp_server/context-server.ts

# Enable experimental reranker
ENABLE_RERANKER=true node mcp_server/context-server.ts

# Quiet mode for CI/CD
SPECKIT_QUIET=true bash scripts/spec/validate.sh specs/001-feature/

# Use Voyage AI embeddings (high quality, cloud-based)
VOYAGE_API_KEY=your-key-here node mcp_server/context-server.ts

# Use OpenAI embeddings
OPENAI_API_KEY=your-key-here node mcp_server/context-server.ts

# Force local embeddings (no API key required)
EMBEDDINGS_PROVIDER=hf-local node mcp_server/context-server.ts

# Use specific embedding model
VOYAGE_EMBEDDINGS_MODEL=voyage-4-large VOYAGE_API_KEY=your-key node mcp_server/context-server.ts
```

---

<!-- /ANCHOR:usage-examples -->
<!-- ANCHOR:feature-flags -->
## 8. FEATURE FLAGS

Feature flags control experimental and optional functionality. All flags default to production-safe values.

### 8.1 Core System Flags (SPEC_KIT_ prefix)

| Flag | Default | Purpose |
|------|---------|---------|
| `SPEC_KIT_ENABLE_DEDUP` | `true` | Session deduplication (removes redundant memory entries) |
| `SPEC_KIT_ENABLE_DECAY` | `true` | Attention decay system (time-weighted memory retrieval) |
| `SPEC_KIT_ENABLE_EMBEDDING` | `true` | Vector embeddings for semantic search |
| `SPEC_KIT_ENABLE_CHECKPOINT` | `true` | Incremental checkpointing (save context at intervals) |
| `SPEC_KIT_ENABLE_CAUSAL` | `false` | Enables causal graph system (link/unlink/stats/drift-why tools) for decision dependency tracking. Mature — used by `/memory:analyze` |
| `SPEC_KIT_ENABLE_VALIDATION` | `true` | Auto-validation on memory save |
| `SPEC_KIT_ENABLE_INDEXING` | `true` | Automatic re-indexing after memory updates |
| `SPEC_KIT_ENABLE_TRIGGERS` | `true` | Proactive memory surfacing via trigger matching |
| `SPEC_KIT_VERBOSE_LOGGING` | `false` | Debug logging (detailed diagnostic output) |
| `SPEC_KIT_OFFLINE_MODE` | `false` | Offline-first operation (no external API calls) |
| `SPEC_KIT_LAZY_EMBEDDING` | `true` | Lazy embedding model loading (reduces startup time) |
| `SPEC_KIT_PROVIDER_FALLBACK` | `true` | Auto-switch embedding providers on failure |

### 8.2 Graduated Search Pipeline Flags (SPECKIT_ prefix)

All graduated flags use `!== 'false'` semantics: **enabled by default**, set to `false` to disable.
These flags are managed via `isFeatureEnabled()` in `rollout-policy.ts` with 100% rollout.

#### Search & Ranking

| Flag | Default | Sprint | Purpose |
|------|---------|--------|---------|
| `SPECKIT_PIPELINE_V2` | ON | S3 | Legacy flag — always `true`; v1 pipeline has been removed. Retained for backward compatibility; setting to `false` has no effect |
| `SPECKIT_RRF` | ON | S0 | Reciprocal Rank Fusion for multi-channel result merging |
| `SPECKIT_SCORE_NORMALIZATION` | ON | S1 | Min-max normalization of scores to [0,1] range (both RRF and composite) |
| `SPECKIT_MMR` | ON | S1 | Graph-guided MMR diversity reranking |
| `SPECKIT_CROSS_ENCODER` | ON | S1 | Cross-encoder reranking gate |
| `RERANKER_LOCAL` | OFF | S9 | Route Stage 3 reranking to local GGUF model instead of remote provider |
| `SPECKIT_RERANKER_MODEL` | `models/bge-reranker-v2-m3.Q4_K_M.gguf` | S9 | Relative or absolute model path for local reranker |
| `SPECKIT_MULTI_QUERY` | ON | S1 | Multi-query expansion for deep-mode retrieval |
| `SPECKIT_SEARCH_FALLBACK` | ON | S2 | Quality-aware 3-tier search fallback chain (PI-A2) |
| `SPECKIT_EMBEDDING_EXPANSION` | ON | S3 | Query expansion for embedding retrieval. Suppressed when classification = "simple" |
| `SPECKIT_CONFIDENCE_TRUNCATION` | ON | S4 | Confidence-based result truncation |
| `SPECKIT_DYNAMIC_TOKEN_BUDGET` | ON | S4 | Dynamic token budget allocation based on query complexity |
| `SPECKIT_COMPLEXITY_ROUTER` | ON | S4 | Query complexity classification and routing |
| `SPECKIT_RESPONSE_TRACE` | OFF | S9 | Include provenance-rich `scores` / `source` / `trace` response envelopes by default |
| `SPECKIT_DYNAMIC_INIT` | ON | S9 | Inject dynamic startup instructions with live memory/index counts |
| `SPECKIT_CONTEXT_HEADERS` | ON | S9 | Prepend contextual tree headers to markdown content results |
| `SPECKIT_FILE_WATCHER` | OFF | S9 | Enable chokidar watcher for auto re-index on markdown changes |
| `SPECKIT_ADAPTIVE_FUSION` | ON | S5 | Intent-aware weighted RRF with 7 task-type profiles |
| `SPECKIT_TRM` | ON | S5 | Transparent Reasoning Module (evidence-gap detection) |
| `ENABLE_BM25` | ON | S3 | Enables in-memory BM25 scoring channel. Set `false` to disable |
| `SPECKIT_SHADOW_SCORING` | OFF | S7 | Shadow A/B scoring (attribution-only mode; scoring comparison permanently disabled) |
| `SPECKIT_DASHBOARD_LIMIT` | `100` | S7 | Row cap for `eval_reporting_dashboard` queries |
| `SPECKIT_GRAPH_UNIFIED` | ON | S7 | Unified graph retrieval with deterministic ranking, explainability trace, and rollback support |

#### Scoring & Feedback

| Flag | Default | Sprint | Purpose |
|------|---------|--------|---------|
| `SPECKIT_DOCSCORE_AGGREGATION` | ON | S3 | Document-level chunk-to-memory score aggregation (R1 MPAB) |
| `SPECKIT_INTERFERENCE_SCORE` | ON | S5 | Interference scoring for conflicting memory detection |
| `SPECKIT_CLASSIFICATION_DECAY` | ON | S6 | Context-type-aware decay rates in FSRS scheduling |
| `SPECKIT_NEGATIVE_FEEDBACK` | ON | S6 | Negative-feedback confidence demotion in ranking (T002b/A4) |

#### Cognitive & Graph

| Flag | Default | Sprint | Purpose |
|------|---------|--------|---------|
| `SPECKIT_COACTIVATION` | ON | S1 | Spreading activation for related memory co-retrieval |
| `SPECKIT_COACTIVATION_STRENGTH` | `0.25` | S1 | Numeric boost factor for co-activation (default 0.25) |
| `SPECKIT_CAUSAL_BOOST` | ON | S3 | Causal-neighbor boost (2-hop traversal on causal_edges) |
| `SPECKIT_SESSION_BOOST` | ON | S3 | Session-based score boost from working_memory attention signals |
| `SPECKIT_EVENT_DECAY` | ON | S3 | Event-driven attention decay in working memory (requires sessionId) |
| `SPECKIT_WORKING_MEMORY` | ON | S2 | Working memory subsystem (session-scoped attention tracking) |
| `SPECKIT_ARCHIVAL` | ON | S2 | Archival manager for memory lifecycle transitions |
| `SPECKIT_GRAPH_SIGNALS` | ON | S5 | Graph momentum scoring and causal depth signals (N2a+N2b) |
| `SPECKIT_COMMUNITY_DETECTION` | ON | S5 | Community detection via BFS connected components + Louvain (N2c) |
| `SPECKIT_CONSOLIDATION` | ON | S4 | Consolidation engine: contradiction scan, Hebbian strengthening, staleness detection |

#### Indexing & Extraction

| Flag | Default | Sprint | Purpose |
|------|---------|--------|---------|
| `SPECKIT_SAVE_QUALITY_GATE` | ON | S4 | Pre-storage quality gate for memory saves (TM-04) |
| `SPECKIT_PRE_SAVE_DEDUP` | ON | S9 | Script-side save-pipeline overlap advisory. Default ON unless explicitly set to `false` or `0`. Runs an exact-match SHA1 comparison against the 20 most recent sibling memories before write and logs a warning without blocking the save. |
| `SPECKIT_RECONSOLIDATION` | OFF | S4 | Reconsolidation-on-save for memory deduplication (TM-06). Opt in with `SPECKIT_RECONSOLIDATION=true` |
| `SPECKIT_ENCODING_INTENT` | ON | S5 | Encoding-intent capture at index time (document, code, structured_data) |
| `SPECKIT_AUTO_ENTITIES` | ON | S6 | Rule-based noun-phrase entity extraction at save time (R10) |
| `SPECKIT_ENTITY_LINKING` | ON | S6 | Cross-document entity linking via entity-based edges (S5). Requires R10 |
| `SPECKIT_MEMORY_SUMMARIES` | ON | S5 | TF-IDF extractive summary generation as search channel (R8) |
| `SPECKIT_INDEX_SPEC_DOCS` | ON | S7 | Spec document indexing in `memory_index_scan()` with document-type scoring |
| `SPECKIT_SIGNAL_VOCAB` | ON | S5 | Signal vocabulary expansion in trigger matching |

#### Retrieval & Discovery

| Flag | Default | Sprint | Purpose |
|------|---------|--------|---------|
| `SPECKIT_FOLDER_DISCOVERY` | ON | S2 | Automatic spec folder discovery via description cache (PI-B3) |
| `SPECKIT_FOLDER_SCORING` | ON | S3 | Folder relevance scoring and two-phase retrieval |
| `SPECKIT_FOLDER_TOP_K` | `5` | S3 | Numeric: top-K folder candidates for folder-scoped retrieval |
| `SPECKIT_DEGREE_BOOST` | ON | S3 | Degree-centrality boost for highly-connected memories |
| `SPECKIT_CHANNEL_MIN_REP` | ON | S4 | Channel minimum representation: promotes best result from under-represented channels |
| `SPECKIT_LEARN_FROM_SELECTION` | ON | S6 | Learned feedback from user result selections (set `false` to disable) |
| `SPECKIT_AUTO_RESUME` | ON | S7 | Auto-resume session detection in `memory_context()` |
| `SPECKIT_PRESSURE_POLICY` | ON | S7 | Context pressure policy for token budget management |

#### Observability & Evaluation

| Flag | Default | Sprint | Purpose |
|------|---------|--------|---------|
| `SPECKIT_EXTENDED_TELEMETRY` | OFF | S5 | Opt-in 4-dimension retrieval metrics (latency, mode, fallback, quality) plus architecture snapshots |
| `SPECKIT_HYDRA_PHASE` | `baseline` | S7 | Records the active Hydra roadmap phase in telemetry, eval baselines, and migration checkpoint metadata |
| `SPECKIT_HYDRA_LINEAGE_STATE` | OFF | S7 | Opt-in Hydra roadmap metadata for the lineage-state milestone |
| `SPECKIT_HYDRA_GRAPH_UNIFIED` | OFF | S7 | Opt-in Hydra roadmap metadata for the unified-graph milestone; distinct from runtime `SPECKIT_GRAPH_UNIFIED` |
| `SPECKIT_HYDRA_ADAPTIVE_RANKING` | OFF | S7 | Opt-in Hydra roadmap metadata for adaptive-ranking experiments |
| `SPECKIT_HYDRA_SCOPE_ENFORCEMENT` | OFF | S7 | Opt-in Hydra roadmap metadata for scope-enforcement tracking |
| `SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS` | OFF | S7 | Opt-in Hydra roadmap metadata for governance-guardrail tracking |
| `SPECKIT_HYDRA_SHARED_MEMORY` | OFF | S7 | Opt-in Hydra roadmap metadata for the shared-memory milestone |
| `SPECKIT_RELATIONS` | ON | S4 | Enables relation extraction in learning/corrections module |
| `SPECKIT_ABLATION` | OFF | S7 | Ablation testing framework (opt-in) |
| `SPECKIT_EVAL_LOGGING` | OFF | S7 | Evaluation metric logging (opt-in) |
| `SPECKIT_QUALITY_LOOP` | OFF | S7 | Verify-fix-verify quality loop for `memory_save` (opt-in) |
| `SPECKIT_SKIP_API_VALIDATION` | OFF | S0 | Skip API key validation at startup (development only) |
| `SPECKIT_DEBUG_INDEX_SCAN` | OFF | S7 | Debug logging for index scan operations (opt-in) |
| `SPECKIT_ROLLOUT_PERCENT` | `100` | S3 | Numeric: graduated rollout percentage (0-100) for deterministic feature bucketing |

### Usage Examples

```bash
# Disable a graduated feature
SPECKIT_PIPELINE_V2=false node mcp_server/context-server.ts

# Enable an opt-in feature
SPECKIT_ABLATION=true node mcp_server/context-server.ts

# Adjust numeric parameters
SPECKIT_COACTIVATION_STRENGTH=0.3 SPECKIT_FOLDER_TOP_K=10 node mcp_server/context-server.ts

# Disable deduplication for testing
SPEC_KIT_ENABLE_DEDUP=false node mcp_server/context-server.ts

# Offline mode (no API calls, local embeddings only)
SPEC_KIT_OFFLINE_MODE=true EMBEDDINGS_PROVIDER=hf-local node mcp_server/context-server.ts
```

### Production Recommendations

**Always Enabled (graduated defaults):** All `SPECKIT_*` graduated-ON flags should remain at their defaults in production.

**Development/Testing:**
- `SPEC_KIT_VERBOSE_LOGGING=true` — Detailed diagnostics
- `SPECKIT_ABLATION=true` — A/B testing framework
- `SPECKIT_EVAL_LOGGING=true` — Retrieval quality metrics
- `SPECKIT_DEBUG_INDEX_SCAN=true` — Index scan diagnostics

**Disable Only If:**
- `SPECKIT_PIPELINE_V2=false` — No effect (v1 pipeline removed; flag is inert)
- `SPEC_KIT_OFFLINE_MODE=true` — No network access
- `SPEC_KIT_LAZY_EMBEDDING=false` — Faster first query (slower startup)

---

<!-- /ANCHOR:feature-flags -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

- [Execution Methods](../workflows/execution_methods.md)
- [Troubleshooting](../debugging/troubleshooting.md)
- [Quick Reference](../workflows/quick_reference.md)
- [Memory System Architecture](../memory/memory_system.md)
<!-- /ANCHOR:related-resources -->
