# Internal Architecture Analysis: Spec-Kit Memory MCP Server

> **Purpose**: Baseline architecture document for comparing against external patterns (zvec, LightRAG, PageIndex)
> **Server**: context-server v1.7.2
> **Date**: 2026-02-26
> **Source**: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/`

---

## 1. Executive Summary

The spec-kit memory MCP server is a **Model Context Protocol** server providing persistent, searchable, semantically-indexed memory for AI coding agents. It exposes 23 tools over stdio transport, backed by a SQLite database with sqlite-vec for vector search and FTS5 for keyword search.

**Key characteristics:**
- **4-channel hybrid search**: vector (sqlite-vec), FTS5, BM25 (in-memory), causal graph
- **RRF fusion** with adaptive intent-aware weight profiles (7 intent types)
- **FSRS v4** spaced-repetition scheduler for temporal decay
- **Cognitive working memory** with Miller's Law capacity (7 +/- 2 items)
- **6-tier importance model**: constitutional, critical, important, normal, temporary, deprecated
- **5-state lifecycle**: HOT, WARM, COLD, DORMANT, ARCHIVED
- **Multi-provider embeddings**: HuggingFace local (768-dim), Voyage (1024-dim), OpenAI (1536-dim)
- **Causal graph** with 6 relation types and BFS traversal (max 3 hops)
- **Schema version 16** with incremental migrations

The system is production-grade for single-user agent workflows but shows scaling limitations in its in-memory BM25 index, session management, and embedding pipeline. Search quality is strong for intent-aware retrieval but lacks learned relevance feedback and cross-session learning.

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MCP TRANSPORT (stdio)                            │
│                     context-server.ts (v1.7.2)                          │
│                        23 registered tools                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   HANDLERS   │  │   HOOKS      │  │  FORMATTERS  │  │   TOOLS     │ │
│  │              │  │              │  │              │  │  (schemas)  │ │
│  │ memory-ctx   │  │ memory-      │  │ search-      │  │ causal-     │ │
│  │ memory-search│  │ surface      │  │ results      │  │ checkpoint- │ │
│  │ memory-save  │  │              │  │ token-       │  │ context-    │ │
│  │ memory-crud  │  │              │  │ metrics      │  │ lifecycle-  │ │
│  │ memory-index │  │              │  │              │  │ memory-     │ │
│  │ memory-trigg │  │              │  │              │  │             │ │
│  │ causal-graph │  │              │  │              │  │             │ │
│  │ session-learn│  │              │  │              │  │             │ │
│  │ checkpoints  │  │              │  │              │  │             │ │
│  └──────┬───────┘  └──────────────┘  └──────────────┘  └─────────────┘ │
│         │                                                               │
├─────────┼───────────────────────────────────────────────────────────────┤
│         │              CORE LIBRARY LAYER                               │
│         ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    SEARCH PIPELINE                               │   │
│  │                                                                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │   │
│  │  │ Vector   │  │ FTS5     │  │ BM25     │  │ Graph        │   │   │
│  │  │ Channel  │  │ Channel  │  │ Channel  │  │ Channel      │   │   │
│  │  │(sqlt-vec)│  │(sqlite)  │  │(in-mem)  │  │(causal BFS)  │   │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │   │
│  │       │              │             │               │            │   │
│  │       ▼              ▼             ▼               ▼            │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │              RRF FUSION (K=60)                           │   │   │
│  │  │         + Adaptive Intent-Aware Weights                  │   │   │
│  │  │         + Convergence Bonus (0.10)                       │   │   │
│  │  └────────────────────┬────────────────────────────────────┘   │   │
│  │                       ▼                                        │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │           RERANKING PIPELINE                             │   │   │
│  │  │  1. Cross-encoder (Voyage/Cohere/local)                  │   │   │
│  │  │  2. MMR diversity (lambda per intent)                    │   │   │
│  │  │  3. Composite scoring (5-factor)                         │   │   │
│  │  │  4. Co-activation spreading                              │   │   │
│  │  └────────────────────┬────────────────────────────────────┘   │   │
│  │                       ▼                                        │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │           POST-PROCESSING                                │   │   │
│  │  │  - Session dedup (working memory filter)                 │   │   │
│  │  │  - Token budget truncation                               │   │   │
│  │  │  - Result formatting                                     │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌────────────────────┐  ┌────────────────────┐  ┌──────────────────┐ │
│  │   COGNITIVE LAYER   │  │   SCORING LAYER    │  │  STORAGE LAYER   │ │
│  │                     │  │                    │  │                  │ │
│  │ working-memory      │  │ composite-scoring  │  │ causal-edges     │ │
│  │ attention-decay     │  │ confidence-tracker │  │ checkpoints      │ │
│  │ co-activation       │  │ folder-scoring     │  │ access-tracker   │ │
│  │ fsrs-scheduler      │  │ importance-tiers   │  │ history          │ │
│  │ prediction-error    │  │                    │  │ incremental-idx  │ │
│  │ pressure-monitor    │  │                    │  │ mutation-ledger  │ │
│  │ tier-classifier     │  │                    │  │ transaction-mgr  │ │
│  │ archival-manager    │  │                    │  │ schema-downgrade │ │
│  │ temporal-contiguity │  │                    │  │                  │ │
│  └────────────────────┘  └────────────────────┘  └──────────────────┘ │
│                                                                         │
│  ┌────────────────────┐  ┌────────────────────┐  ┌──────────────────┐ │
│  │   EMBEDDING LAYER   │  │   PARSING LAYER    │  │  UTILITY LAYER   │ │
│  │                     │  │                    │  │                  │ │
│  │ shared/embeddings   │  │ memory-parser      │  │ path-security    │ │
│  │ (multi-provider)    │  │ trigger-matcher    │  │ canonical-path   │ │
│  │ LRU cache (1000)    │  │ entity-scope       │  │ logger           │ │
│  │ retry-manager       │  │ anchor-chunker     │  │ retry            │ │
│  │                     │  │ query-expander     │  │ batch-processor  │ │
│  │                     │  │ intent-classifier  │  │ json-helpers     │ │
│  └────────────────────┘  └────────────────────┘  └──────────────────┘ │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                         DATABASE LAYER                                  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │               SQLite (better-sqlite3) + sqlite-vec              │   │
│  │                                                                  │   │
│  │  Tables:                                                         │   │
│  │  - memory_index (40+ cols)     - vec_memories (sqlite-vec)      │   │
│  │  - memory_fts (FTS5)           - vec_metadata                   │   │
│  │  - causal_edges                - working_memory                 │   │
│  │  - checkpoints                 - memory_corrections             │   │
│  │  - memory_conflicts            - memory_history                 │   │
│  │  - search_learning             - memory_access_log              │   │
│  │  - sessions                    - search_cache                   │   │
│  │                                                                  │   │
│  │  Schema Version: 16 (incremental migrations)                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component-by-Component Analysis

### 3.1 Entry Point: context-server.ts

**File**: `context-server.ts` (684 lines)
**Role**: MCP server initialization, tool dispatch, lifecycle management

**Key functions:**
- `main()` — Server bootstrap: opens DB, initializes all subsystems, registers 23 tools, starts stdio transport
- `getTokenBudget(toolName)` — Per-tool token budget enforcement (500-2000 tokens)
- Startup sequence: `initializeDb()` → `startupScan()` → cognitive module init → `sessionManager.resetInterruptedSessions()`
- Graceful shutdown: `closeDb()`, `archivalManager.shutdown()`, `process.exit(0)`

**Subsystem initialization order:**
1. `initializeDb()` — SQLite + sqlite-vec + schema migrations
2. Checkpoint table init
3. `initAccessTracker()`
4. `setHybridSearchEnabled(true)`
5. Session boost, causal boost flags from env
6. `BM25Index.rebuildFromDatabase()` — Full in-memory index rebuild
7. Cognitive modules: co-activation, FSRS, prediction-error-gate, pressure-monitor, archival-manager
8. `RetryManager` for failed embeddings
9. `SessionManager.resetInterruptedSessions()`
10. `ExtractionAdapter` initialization

**Token budget map:**
| Tool Layer | Budget |
|-----------|--------|
| L1 (context) | 2000 |
| L2 (search) | 1500 |
| L3 (discovery) | 800 |
| L4 (mutation) | 500 |
| L5 (lifecycle) | 600 |
| L6 (analysis) | 1200 |
| L7 (maintenance) | 1000 |

### 3.2 Database Schema: vector-index-impl.ts

**File**: `lib/search/vector-index-impl.ts` (1800+ lines)
**Role**: Core database implementation — schema, migrations, CRUD, search

**Primary table: `memory_index`**
```sql
CREATE TABLE IF NOT EXISTS memory_index (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  spec_folder           TEXT NOT NULL,
  file_path             TEXT NOT NULL,
  canonical_file_path   TEXT,
  anchor_id             TEXT,
  title                 TEXT,
  trigger_phrases       TEXT,          -- JSON array
  importance_weight     REAL DEFAULT 0.5,
  importance_tier       TEXT DEFAULT 'normal',
  memory_state          TEXT DEFAULT 'WARM',
  created_at            TEXT DEFAULT (datetime('now')),
  updated_at            TEXT DEFAULT (datetime('now')),
  embedding_model       TEXT,
  embedding_generated_at TEXT,
  embedding_status      TEXT DEFAULT 'pending',
  retry_count           INTEGER DEFAULT 0,
  last_retry_at         TEXT,
  failure_reason        TEXT,
  access_count          INTEGER DEFAULT 0,
  last_accessed         INTEGER,       -- Unix timestamp
  confidence            REAL DEFAULT 0.5,
  validation_count      INTEGER DEFAULT 0,
  is_pinned             INTEGER DEFAULT 0,
  -- FSRS v4 columns
  stability             REAL DEFAULT 1.0,
  difficulty            REAL DEFAULT 0.3,
  last_review           TEXT,
  review_count          INTEGER DEFAULT 0,
  -- Content columns
  memory_type           TEXT DEFAULT 'memory',
  document_type         TEXT DEFAULT 'generic',
  content_text          TEXT,
  content_hash          TEXT,
  quality_score         REAL DEFAULT 0.5,
  quality_flags         TEXT,          -- JSON array
  -- Chunking columns
  parent_id             INTEGER,
  chunk_index           INTEGER,
  chunk_label           TEXT,
  -- Spec level
  spec_level            INTEGER,
  UNIQUE(spec_folder, file_path, anchor_id)
);
```

**Vector table (sqlite-vec):**
```sql
CREATE VIRTUAL TABLE IF NOT EXISTS vec_memories
USING vec0(embedding FLOAT[{dim}]);
```

**Full-text search (FTS5):**
```sql
CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts
USING fts5(title, trigger_phrases, file_path, content_text);
```
- Synchronized via INSERT/UPDATE/DELETE triggers on `memory_index`

**Companion tables:**
| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `vec_metadata` | Embedding dimension tracking | `key, value` |
| `causal_edges` | Causal graph relationships | `source_id, target_id, relation, strength, evidence` |
| `working_memory` | Session attention tracking | `session_id, memory_id, attention_score, event_counter` |
| `checkpoints` | Named state snapshots | `name, spec_folder, data (JSON), metadata` |
| `memory_corrections` | Edit history | `memory_id, field, old_value, new_value` |
| `memory_conflicts` | Contradiction tracking | `memory_id_a, memory_id_b, conflict_type, resolution` |
| `memory_history` | State change log | `memory_id, action, old_state, new_state` |
| `search_learning` | Relevance feedback | `query_hash, selected_memory_id, score_boost` |
| `memory_access_log` | Access tracking | `memory_id, accessed_at, tool_name` |
| `sessions` | Session dedup | `session_id, sent_memory_ids (JSON), state` |
| `search_cache` | Query result cache | `cache_key, results (JSON), expires_at` |

**Index coverage:**
```sql
CREATE INDEX idx_memory_index_spec_folder ON memory_index(spec_folder);
CREATE INDEX idx_memory_index_file_path ON memory_index(file_path);
CREATE INDEX idx_memory_index_importance ON memory_index(importance_tier, importance_weight);
CREATE INDEX idx_memory_index_state ON memory_index(memory_state);
CREATE INDEX idx_memory_index_embedding_status ON memory_index(embedding_status);
CREATE INDEX idx_memory_index_content_hash ON memory_index(content_hash);
CREATE INDEX idx_memory_index_parent_id ON memory_index(parent_id);
CREATE INDEX idx_memory_index_canonical ON memory_index(canonical_file_path);
CREATE INDEX idx_causal_edges_source ON causal_edges(source_id);
CREATE INDEX idx_causal_edges_target ON causal_edges(target_id);
CREATE UNIQUE INDEX idx_causal_edges_unique ON causal_edges(source_id, target_id, relation);
```

**Schema migration system:**
- Version stored in `PRAGMA user_version`
- 16 incremental migrations applied sequentially
- Migrations include: adding FSRS columns, content_text, chunking support, quality scoring, canonical paths, working_memory table, causal_edges refinements

### 3.3 Embedding Pipeline: shared/embeddings.ts + providers

**File**: `shared/embeddings.ts`
**Role**: Multi-provider embedding generation with caching and rate limiting

**Providers:**
| Provider | Model | Dimensions | Local? | Notes |
|----------|-------|-----------|--------|-------|
| HuggingFace | @xenova/all-MiniLM-L6-v2 (or similar) | 768 | Yes | Default, no API key needed |
| Voyage | voyage-3-lite / voyage-code-3 | 1024 | No | Requires VOYAGE_API_KEY |
| OpenAI | text-embedding-3-small | 1536 | No | Requires OPENAI_API_KEY |

**Architecture:**
```
Query/Content → SHA256 Hash → LRU Cache Check (1000 entries)
                                    │
                          ┌─────────┴──────────┐
                          │  Cache HIT         │  Cache MISS
                          │  Return cached     │  │
                          └────────────────────┘  ▼
                                           Provider Factory
                                           (env-based selection)
                                                  │
                                          ┌───────┴───────┐
                                          │ Rate Limiter  │
                                          │ (100ms delay) │
                                          └───────┬───────┘
                                                  ▼
                                          Float32Array (N-dim)
                                                  │
                                          Store in LRU Cache
```

**Key characteristics:**
- LRU cache keyed by `SHA256(provider + text)`, max 1000 entries
- Rate limiting: configurable `BATCH_DELAY_MS` (default 100ms between calls)
- Retry manager handles failed embeddings with exponential backoff
- `indexMemoryDeferred()` allows saving memory without embedding (status: 'pending')
- Dimension mismatch detection via `vec_metadata` table
- `getConfirmedEmbeddingDimension()` with timeout for dimension negotiation at startup

**Deferred embedding flow:**
```
Save Request → indexMemoryDeferred(no embedding) → status='pending'
                        │
              RetryManager (background) → generateEmbedding() → updateEmbedding()
                        │                                            │
                   On failure:                               On success:
              retry_count++, status='retry'             status='success'
              failure_reason logged                     embedding stored in vec_memories
```

### 3.4 Search Pipeline: hybrid-search.ts

**File**: `lib/search/hybrid-search.ts` (688 lines)
**Role**: Multi-channel hybrid search with fusion and reranking

**Primary function**: `hybridSearchEnhanced(query, options)`

**Full search data flow:**
```
User Query
    │
    ▼
┌──────────────────────────┐
│   Intent Classification   │  (intent-classifier.ts)
│   7 types + confidence    │  keyword + regex + centroid scoring
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│   Query Expansion         │  (query-expander.ts)
│   Rule-based synonyms     │  max 3 variants, ~25 domain terms
│   (NO LLM calls)          │
└────────────┬─────────────┘
             │
    ┌────────┼────────┬──────────────┐
    ▼        ▼        ▼              ▼
┌────────┐ ┌──────┐ ┌──────┐ ┌───────────┐
│ Vector │ │ FTS5 │ │ BM25 │ │   Graph   │
│sqlite- │ │      │ │(mem) │ │  (causal  │
│  vec   │ │      │ │      │ │   BFS)    │
│        │ │      │ │      │ │           │
│ cosine │ │rank  │ │TF-IDF│ │ relation  │
│ sim.   │ │score │ │score │ │ weights   │
└───┬────┘ └──┬───┘ └──┬───┘ └─────┬─────┘
    │         │        │            │
    │   Base weights:  │            │
    │   vec=1.0        │            │
    │   fts=0.8        │            │
    │   bm25=0.6       │            │
    │   graph=0.5      │            │
    ▼         ▼        ▼            ▼
┌──────────────────────────────────────────┐
│         RRF FUSION (K=60)                 │
│                                           │
│  score = Σ (weight / (K + rank_i))        │
│  + convergence_bonus (0.10) if in 2+ lists│
│  + graph_weight_boost (1.5x)              │
│                                           │
│  OR: Adaptive Fusion (if feature flag ON) │
│  - Intent-specific weight profiles        │
│  - Document-type adjustments              │
│  - Dark-run mode for A/B testing          │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│         RERANKING PIPELINE                │
│                                           │
│  1. Cross-encoder reranking (optional)    │
│     - Voyage rerank-2                     │
│     - Cohere rerank-english-v3.0          │
│     - Local ms-marco-MiniLM-L-6-v2       │
│     - Positional fallback if unavailable  │
│                                           │
│  2. Composite scoring (5-factor)          │
│     - temporal: 0.25 (FSRS decay)         │
│     - usage: 0.15 (access_count log)      │
│     - importance: 0.25 (tier + weight)    │
│     - pattern: 0.20 (exact/partial match) │
│     - citation: 0.15 (validation_count)   │
│                                           │
│  3. MMR diversity reranking               │
│     - lambda per intent type              │
│     - understand=0.5, fix_bug=0.85        │
│     - greedy selection, cosine sim        │
│     - max 20 candidates                   │
│                                           │
│  4. Co-activation spreading (optional)    │
│     - Related memory score boost          │
│     - From working_memory attention       │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│         POST-PROCESSING                   │
│                                           │
│  1. Session dedup (filter sent memories)  │
│  2. Constitutional injection (always top) │
│  3. Token budget truncation               │
│  4. Result formatting + metadata          │
└──────────────────────────────────────────┘
```

**Adaptive fallback mechanism:**
```
Pass 1: minSimilarity = 0.30
    │
    ├── results >= limit → return
    │
    └── results < limit → Pass 2: minSimilarity = 0.17
                              │
                              └── return whatever found
```

### 3.5 Intent Classification: intent-classifier.ts

**File**: `lib/search/intent-classifier.ts` (547 lines)
**Role**: Classify user queries into 7 intent types for weight optimization

**Intent types:**
| Intent | Description | MMR Lambda | Example Triggers |
|--------|-------------|-----------|-----------------|
| `add_feature` | New functionality | 0.70 | "add", "create", "implement", "build" |
| `fix_bug` | Bug resolution | 0.85 | "fix", "bug", "error", "broken" |
| `refactor` | Code improvement | 0.75 | "refactor", "cleanup", "reorganize" |
| `security_audit` | Security review | 0.80 | "security", "vulnerability", "audit" |
| `understand` | Comprehension | 0.50 | "how does", "explain", "what is" |
| `find_spec` | Find specification | 0.65 | "spec", "specification", "requirement" |
| `find_decision` | Find decision | 0.60 | "decision", "why did", "rationale" |

**Scoring formula:**
```
final_score = (centroid_score * 0.50) + (keyword_score * 0.35) + (pattern_score * 0.15)
```

- **Centroid scoring**: 128-dim hashed bag-of-words vectors, cosine similarity against pre-computed intent centroids
- **Keyword scoring**: Weighted term frequency with boosted trigger words
- **Pattern scoring**: Regex patterns with negative penalties (e.g., "how to fix" penalizes "understand")
- **Minimum confidence threshold**: 0.08 (below this, defaults to "understand")

### 3.6 RRF Fusion: rrf-fusion.ts

**File**: `lib/search/rrf-fusion.ts` (362 lines)
**Role**: Reciprocal Rank Fusion for merging multi-channel results

**Functions:**
| Function | Purpose | Input |
|----------|---------|-------|
| `fuseResults()` | 2-list fusion | vector + keyword results |
| `fuseResultsMulti()` | N-list weighted fusion | Array of {results, weight} |
| `fuseResultsCrossVariant()` | Multi-query RAG fusion | Multiple query variants |
| `fuseScoresAdvanced()` | Enhanced fusion | Includes term-match bonus |

**Core formula:**
```
RRF_score(d) = Σ (channel_weight / (K + rank_in_channel))
```

**Parameters:**
- `DEFAULT_K = 60` — Standard RRF constant (higher K = less top-rank dominance)
- `CONVERGENCE_BONUS = 0.10` — Bonus when document appears in 2+ channels
- `GRAPH_WEIGHT_BOOST = 1.5` — Multiplier for graph channel weight

### 3.7 Adaptive Fusion: adaptive-fusion.ts

**File**: `lib/search/adaptive-fusion.ts` (377 lines)
**Role**: Intent-aware dynamic weight adjustment for search channels

**Feature flag**: `SPECKIT_ADAPTIVE_FUSION` (env var, default off)

**Intent weight profiles:**
| Intent | Semantic | Keyword | Recency | Graph |
|--------|----------|---------|---------|-------|
| `understand` | 0.70 | 0.20 | 0.10 | 0.15 |
| `add_feature` | 0.50 | 0.30 | 0.20 | 0.10 |
| `fix_bug` | 0.40 | 0.35 | 0.25 | 0.10 |
| `refactor` | 0.45 | 0.30 | 0.15 | 0.20 |
| `security_audit` | 0.55 | 0.25 | 0.10 | 0.20 |
| `find_spec` | 0.35 | 0.45 | 0.10 | 0.15 |
| `find_decision` | 0.30 | 0.30 | 0.10 | 0.40 |

**Document-type adjustments:**
- `decision` → keyword boost +0.1
- `implementation` → recency boost +0.1
- `research` → semantic boost +0.1

**Degraded mode**: When a channel fails, remaining weights are proportionally redistributed with a `confidence_impact` penalty.

**Dark-run mode**: Runs adaptive fusion in parallel with standard fusion for A/B comparison without affecting results.

### 3.8 BM25 Index: bm25-index.ts

**File**: `lib/search/bm25-index.ts` (332 lines)
**Role**: In-memory BM25 text search index

**Characteristics:**
- **Fully in-memory** — rebuilt from database on startup via `rebuildFromDatabase()`
- Custom tokenizer with stop word removal and simple suffix-stripping stemmer
- **Field weights**: title=10, trigger_phrases=5, content_generic=2, body=1
- Standard BM25 formula: `k1=1.2, b=0.75`
- FTS5 query sanitization (strips operators, double-quotes)

**Limitations:**
- No persistence — full rebuild required on every server restart
- Memory proportional to corpus size (all document terms held in RAM)
- Simple stemmer (not linguistic — just suffix removal)
- No incremental updates — rebuild after bulk changes

### 3.9 Causal Graph: causal-edges.ts

**File**: `lib/storage/causal-edges.ts` (471 lines)
**Role**: Directed graph of memory relationships for lineage tracking

**Relation types:**
| Relation | Weight Multiplier | Semantics |
|----------|------------------|-----------|
| `supersedes` | 1.5 | Memory replaces another |
| `caused` | 1.3 | Decision led to outcome |
| `enabled` | 1.1 | Prerequisite relationship |
| `supports` | 1.0 | Corroborating evidence |
| `derived_from` | 1.0 | Source relationship |
| `contradicts` | 0.8 | Conflicting information |

**Storage**: `causal_edges` table with UNIQUE constraint on `(source_id, target_id, relation)`

**Traversal**: BFS with visited set, configurable max depth (default 3, max 10)
```
getCausalChain(memoryId, direction, maxDepth, relations?)
    │
    ├── direction: 'outgoing' | 'incoming' | 'both'
    ├── maxDepth: 1-10 (default 3)
    └── relations: optional filter (e.g., ['caused', 'enabled'])
```

**Auto-linking**: `createSpecDocumentChain()` automatically links spec folder documents in order: `spec.md → plan.md → tasks.md → implementation-summary.md`

**Graph search function** (`graph-search-fn.ts`): Used as the 4th search channel — traverses causal neighbors of top vector results to find related memories.

### 3.10 Composite Scoring: composite-scoring.ts

**File**: `lib/scoring/composite-scoring.ts` (593 lines)
**Role**: Multi-factor relevance scoring

**5-Factor Model (REQ-017) — Primary:**
| Factor | Weight | Source | Formula |
|--------|--------|--------|---------|
| Temporal | 0.25 | FSRS retrievability | `R = (1 + 0.235 * t/S)^(-0.5)` |
| Usage | 0.15 | access_count | `min(1.0, log2(access_count + 1) / 5)` |
| Importance | 0.25 | tier + weight | Tier multiplier + weight |
| Pattern | 0.20 | Query alignment | exact=0.3, partial=0.15, anchor=0.25 |
| Citation | 0.15 | validation_count | `min(1.0, validation_count / 5)` |

**Importance tier multipliers:**
| Tier | Multiplier |
|------|-----------|
| constitutional | 2.0 |
| critical | 1.5 |
| important | 1.2 |
| normal | 1.0 |
| temporary | 0.7 |
| deprecated | 0.3 |

**Document type multipliers:**
| Type | Multiplier |
|------|-----------|
| constitutional | 2.0 |
| spec | 1.4 |
| decision_record | 1.4 |
| plan | 1.3 |
| tasks | 1.2 |
| implementation_summary | 1.1 |
| checklist | 1.1 |
| memory | 1.0 |
| generic | 1.0 |
| scratch | 0.6 |

**Legacy 6-Factor Model (still available):**
| Factor | Weight |
|--------|--------|
| similarity | 0.30 |
| importance | 0.25 |
| recency | 0.10 |
| popularity | 0.15 |
| tierBoost | 0.05 |
| retrievability | 0.15 |

### 3.11 Cognitive Layer: working-memory.ts + modules

**File**: `lib/cognitive/working-memory.ts` (682 lines)
**Role**: Session-based attention tracking with Miller's Law capacity

**Working memory model:**
- Max capacity: 7 items (configurable, Miller's Law 7 +/- 2)
- Session timeout: 30 minutes
- Attention decay: `score * pow(0.85, events_elapsed)` — exponential per-event decay
- Decay floor: 0.05 (minimum attention before eligible for eviction)
- Delete threshold: 0.01 (below this, item is removed)
- LRU eviction when capacity exceeded

**Cognitive modules:**
| Module | File | Purpose |
|--------|------|---------|
| `attention-decay.ts` | Exponential attention decay per event distance |
| `co-activation.ts` | Related memory score boost from graph neighbors |
| `fsrs-scheduler.ts` | FSRS v4 spaced repetition scheduling |
| `prediction-error-gate.ts` | Surprise-based attention amplification |
| `pressure-monitor.ts` | Memory pressure detection and policy override |
| `tier-classifier.ts` | Automatic importance tier assignment |
| `archival-manager.ts` | Background COLD→DORMANT→ARCHIVED transitions |
| `temporal-contiguity.ts` | Time-adjacent memory association |
| `rollout-policy.ts` | Retrieval mode selection policy |

**Session dedup flow:**
```
Search Results → Check session.sent_memory_ids
                     │
              ┌──────┴──────┐
              │ Already sent │  Not sent
              │ → Filter out │  → Include
              └──────────────┘  → Add to sent_memory_ids
```

### 3.12 Retrieval Modes: memory-context.ts

**File**: `handlers/memory-context.ts` (616 lines)
**Role**: L1 orchestration — top-level context retrieval with mode routing

**Modes:**
| Mode | Token Budget | Strategy | When Used |
|------|-------------|----------|-----------|
| `auto` | varies | Intent classify → route to best mode | Default |
| `quick` | 800 | Trigger matching only | Fast lookups, known patterns |
| `deep` | 2000 | Full hybrid search + reranking | Comprehensive investigation |
| `focused` | 1500 | Intent-specific hybrid search | Task-specific retrieval |
| `resume` | 1200 | Anchor-filtered search (state, next-steps) | Session continuation |

**Auto-mode routing:**
```
Input → Intent Classification
    │
    ├── Confidence > threshold → Route to focused mode with intent
    ├── Contains "resume"/"continue" keywords → Route to resume mode
    ├── Pressure monitor HIGH → Override to quick mode
    └── Default → Route to deep mode
```

### 3.13 Indexing Pipeline: memory-save + index-scan

**Indexing flow:**
```
Memory File (*.md)
    │
    ▼
┌────────────────────────┐
│   Content Extraction    │
│   - extractTitle()      │
│   - extractSnippet()    │
│   - extractTags()       │
│   - extractDate()       │
│   - Trigger phrase      │
│     extraction          │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Preflight Validation  │  (lib/validation/preflight.ts)
│   - Anchor format check │
│   - Duplicate detection │
│   - Token budget est.   │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Chunking (if needed)  │  (lib/chunking/anchor-chunker.ts)
│   - Threshold: 50K chars│
│   - Target: 4K chars    │
│   - Max: 12K chars      │
│   - Anchor boundaries   │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Embedding Generation  │
│   - Provider selection  │
│   - LRU cache check    │
│   - Rate limited API    │
│   - OR: deferred mode   │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Database Insertion    │
│   - memory_index INSERT │
│   - vec_memories INSERT │
│   - FTS5 auto-sync      │
│   - content_hash stored │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Post-Save Operations  │
│   - linkRelatedOnSave() │  (auto-link similar memories)
│   - BM25 index update   │
│   - Causal chain auto-  │
│     linking (spec docs)  │
└────────────────────────┘
```

**Incremental index scan:**
- `memory_index_scan` tool scans workspace directories
- Skips files with unchanged `mtime` + `content_hash`
- Cooldown: 60 seconds between scans (configurable)
- Scans: `specs/**/memory/`, `.opencode/specs/**/memory/`, `.opencode/skill/*/constitutional/`, spec documents (spec.md, plan.md, etc.)

### 3.14 Session Management: session-manager.ts

**File**: `lib/session/session-manager.ts`
**Role**: Session tracking, deduplication, crash recovery

**Key features:**
- Session TTL with configurable max entries
- `sent_memory_ids` tracking per session (JSON array in `sessions` table)
- Session state tracking: `specFolder, currentTask, lastAction, contextSummary, pendingWork`
- `resetInterruptedSessions()` on startup — recovers from crashes
- Per-session token usage tracking

---

## 4. Scoring System Deep Dive

### 4.1 FSRS v4 Retrievability

The temporal scoring uses Free Spaced Repetition Scheduler v4:

```
R(t) = (1 + 0.235 * t / S) ^ (-0.5)

Where:
  t = time since last review (days)
  S = stability (initial: 1.0, increases with successful recalls)
  R = retrievability (0.0 to 1.0)
```

**Properties:**
- Power-law decay (slower than exponential for large t)
- Stability increases on successful retrieval (access tracking)
- Difficulty parameter (0.3 default) modulates learning rate
- Review count tracks total retrievals

### 4.2 Constitutional Memory Handling

Constitutional memories receive special treatment:
- **Always surfaced** at top of search results (regardless of query relevance)
- **Cached** with 5-minute TTL and thundering herd protection
- **Tier multiplier**: 2.0x in composite scoring
- **Cannot be bulk-deleted** without explicit scoping
- **Max token budget**: ~2000 tokens for constitutional injection

### 4.3 Length Penalty (Cross-Encoder)

```
if content.length < 50:   penalty = 0.90
if content.length > 2000: penalty = 0.95
```

Applied during cross-encoder reranking to penalize very short (likely low-information) or very long (likely unfocused) memories.

---

## 5. Performance Characteristics

### 5.1 Startup Performance

| Operation | Estimated Time | Notes |
|-----------|---------------|-------|
| SQLite open + migrations | <100ms | Schema version check, incremental |
| sqlite-vec initialization | <50ms | Extension loading |
| BM25 full rebuild | O(N) — scales with corpus | All documents loaded into memory |
| Cognitive module init | <50ms | In-memory structures |
| Session recovery | <10ms | Single query |
| Startup index scan | 1-30s | Depends on file count, cooldown applies |

### 5.2 Search Performance

| Operation | Complexity | Notes |
|-----------|-----------|-------|
| Vector search (sqlite-vec) | O(N) brute-force | No ANN index — linear scan |
| FTS5 keyword search | O(log N) | B-tree indexed |
| BM25 search | O(V * Q) | V=vocabulary, Q=query terms |
| Causal graph traversal | O(V + E) per hop | BFS, max 3 hops default |
| RRF fusion | O(R * C) | R=results, C=channels |
| MMR reranking | O(N^2) | Pairwise cosine, max 20 candidates |
| Cross-encoder | O(N) | API call per result |
| Composite scoring | O(N) | Per-result computation |

### 5.3 Memory Footprint

| Component | Memory Usage | Notes |
|-----------|-------------|-------|
| BM25 index | Proportional to corpus | All terms + document vectors in RAM |
| Embedding cache | Up to 1000 * dim * 4 bytes | ~3MB for 768-dim |
| Constitutional cache | Small, bounded | 5-minute TTL |
| Working memory | 7 items per session | Miller's Law cap |
| SQLite mmap | OS-managed | better-sqlite3 default |
| Search cache | Unbounded (TTL-based) | Potential issue for long-running servers |

### 5.4 Database Size Scaling

| Corpus Size | Estimated DB Size | Notes |
|------------|------------------|-------|
| 100 memories | ~5 MB | With 768-dim vectors |
| 1,000 memories | ~50 MB | Linear growth |
| 10,000 memories | ~500 MB | Vector data dominates |
| 100,000 memories | ~5 GB | Beyond typical use case |

---

## 6. Strengths

### S-001: Multi-Channel Hybrid Search
4-channel search (vector, FTS5, BM25, graph) provides robust retrieval that combines semantic understanding with exact keyword matching and relationship awareness. This is architecturally sound and aligns with modern RAG best practices.

### S-002: Intent-Aware Retrieval
The 7-intent classification system with per-intent weight profiles and MMR lambda values allows the search pipeline to adapt its behavior based on what the user is trying to accomplish. This is a sophisticated approach rarely seen in similar systems.

### S-003: FSRS v4 Temporal Scoring
Using spaced-repetition science (FSRS v4) for temporal decay is elegant and well-motivated. Power-law decay is more realistic than exponential for knowledge systems where older memories can still be highly relevant.

### S-004: Cognitive Architecture
The working memory model with Miller's Law capacity, attention decay, and session dedup demonstrates thoughtful cognitive science-informed design. Session dedup alone provides ~50% token savings on follow-up queries.

### S-005: Constitutional Memory Tier
The always-surface constitutional tier ensures critical system rules and constraints are never lost, regardless of search query. This is essential for AI agent safety.

### S-006: Comprehensive Schema Design
The 40+ column memory_index table with FSRS columns, chunking support, quality scoring, and content hashing shows mature schema design that has evolved through 16 migration versions.

### S-007: Graceful Degradation
The adaptive fallback mechanism (0.30 → 0.17 similarity threshold), degraded fusion mode, and positional cross-encoder fallback ensure the system continues functioning when components are unavailable or underperforming.

### S-008: Causal Graph
Decision lineage tracking through 6 relation types with auto-linking of spec documents provides unique value for understanding "why was this decision made?" queries.

---

## 7. Weaknesses and Improvement Opportunities

### [IMPROVE-001] Vector Search is Brute-Force O(N)
**Component**: `lib/search/vector-index-impl.ts` → `vectorSearch()`
**Issue**: sqlite-vec performs linear scan over all vectors. No approximate nearest neighbor (ANN) index.
**Impact**: Search latency grows linearly with corpus size. At 10K+ memories, vector search will become the bottleneck.
**Severity**: Medium (acceptable for current use case, blocking for scale)
**Recommendation**: Investigate HNSW or IVF indexing. sqlite-vec may support this in future versions. Alternatively, consider external vector index (FAISS, usearch) for large corpora.

### [IMPROVE-002] BM25 Index is Fully In-Memory with No Persistence
**Component**: `lib/search/bm25-index.ts` → `rebuildFromDatabase()`
**Issue**: Entire BM25 index is rebuilt from database on every server restart. Not incrementally updated during runtime.
**Impact**: Startup time scales linearly with corpus size. After bulk indexing, BM25 index may be stale until rebuild.
**Severity**: Medium
**Recommendation**: Implement incremental BM25 updates on memory CRUD operations. Consider persistent BM25 storage or leveraging FTS5's built-in BM25 ranking more heavily.

### [IMPROVE-003] Search Cache is Unbounded
**Component**: `lib/search/vector-index-impl.ts` → `search_cache` table
**Issue**: Search cache has TTL-based expiration but no size limit. Long-running servers may accumulate large cache.
**Impact**: Potential database bloat and degraded SQLite performance.
**Severity**: Low
**Recommendation**: Add max cache size with LRU eviction. Consider in-memory cache instead of SQLite table for search results.

### [IMPROVE-004] Query Expansion is Rule-Based Only
**Component**: `lib/search/query-expander.ts`
**Issue**: Only ~25 domain term mappings, max 3 variants. No learned synonyms, no embedding-based expansion.
**Impact**: Misses semantic equivalences not covered by the static vocabulary map.
**Severity**: Medium
**Recommendation**: Add embedding-based query expansion (find terms with similar embeddings). Consider PRF (Pseudo-Relevance Feedback) from top results.

### [IMPROVE-005] Cross-Encoder Reranking Has No Local Fallback Model
**Component**: `lib/search/cross-encoder.ts`
**Issue**: Local cross-encoder (ms-marco-MiniLM-L-6-v2) is listed but may not be implemented for local inference. Fallback is positional scoring (not semantic).
**Impact**: Without API keys, cross-encoder reranking degrades to position-based scoring which adds no semantic value.
**Severity**: Low-Medium
**Recommendation**: Ensure local cross-encoder inference works via HuggingFace transformers.js. Consider lightweight alternatives like TinyBERT for reranking.

### [IMPROVE-006] Learned Relevance Feedback Function Is Dormant
**Component**: `lib/search/vector-index-impl.ts:3882` → `learnFromSelection()`
**Issue**: `learnFromSelection()` is implemented and exported — it extracts novel terms from search queries, filters stop words, and enriches the selected memory's `trigger_phrases` JSON array via `UPDATE memory_index SET trigger_phrases = ?`. However, it is **never called** from any handler, tool, or entry point. There is no separate `search_learning` table — the function works directly on `memory_index.trigger_phrases`.
**Impact**: Behavioral learning data is being discarded. Trigger phrases are never enriched from actual search patterns. Search quality does not improve from usage.
**Severity**: Medium-High
**Recommendation**: Add a call site in `memory_validate` handler (when `wasUseful=true`) or in the search handler's selection callback. The function is production-ready — it just needs to be wired in. Store the originating query in session context so it's available when validation occurs.

### [IMPROVE-007] Intent Classifier Uses Heuristic Centroids
**Component**: `lib/search/intent-classifier.ts`
**Issue**: Intent centroids are 128-dim hashed bag-of-words vectors, not learned embeddings. Keyword scoring uses hard-coded term lists.
**Impact**: Intent classification accuracy is limited by hand-crafted features. Novel phrasings may be misclassified.
**Severity**: Low-Medium
**Recommendation**: Consider fine-tuning intent classifier on actual query logs. Alternatively, use embedding-based nearest-centroid with real embedding vectors instead of hashed BoW.

### [IMPROVE-008] No Graph-Aware Embedding
**Component**: `lib/search/graph-search-fn.ts`, `lib/storage/causal-edges.ts`
**Issue**: Causal graph is only used as a 4th search channel via BFS neighbor expansion. Graph structure is not incorporated into embeddings or scoring.
**Impact**: Rich relational information is underutilized. Graph channel weight (0.5) is lowest of all channels.
**Recommendation**: Investigate graph-aware embedding techniques (e.g., TransE, GraphSAGE) or at minimum increase graph channel weight for `find_decision` intent. Consider PageRank-based memory importance scoring.

### [IMPROVE-009] Chunking Strategy is Size-Based Only
**Component**: `lib/chunking/anchor-chunker.ts`
**Issue**: Chunking triggers only on file size (>50K chars). Chunk boundaries prefer anchor markers but fall back to size-based splitting.
**Impact**: Smaller files with multiple semantic sections are not chunked. Chunk quality depends on anchor marker placement.
**Severity**: Low
**Recommendation**: Consider semantic chunking based on topic shifts or embedding similarity between paragraphs. Add support for header-based chunking as a middle ground.

### [IMPROVE-010] No Multi-Vector Representation per Memory
**Component**: `lib/search/vector-index-impl.ts`
**Issue**: Each memory (or chunk) gets exactly one embedding vector. No support for multiple representations (e.g., title embedding + content embedding + summary embedding).
**Impact**: Single vector cannot capture all semantic facets of a complex memory. ColBERT-style multi-vector matching could improve retrieval for longer documents.
**Severity**: Medium
**Recommendation**: Investigate ColBERT-style late interaction or at minimum dual-vector (title + content) indexing. The `vec_memories` table would need to support multiple vectors per memory_id.

### [IMPROVE-011] Embedding Dimension Lock-In
**Component**: `shared/embeddings.ts`, `lib/search/vector-index-impl.ts`
**Issue**: Embedding dimension is set at DB creation time and stored in `vec_metadata`. Changing providers requires re-indexing all memories.
**Impact**: Migration between embedding providers is expensive. Cannot mix providers within one database.
**Severity**: Low (by design, but limits flexibility)
**Recommendation**: Consider dimension-agnostic storage (e.g., Matryoshka embeddings that can be truncated) or a migration tool that re-embeds incrementally.

### [IMPROVE-012] No Retrieval Telemetry Dashboard
**Component**: `lib/telemetry/retrieval-telemetry.ts`
**Issue**: Telemetry is collected but there is no visibility into search quality metrics (MRR, NDCG, recall@K) over time.
**Impact**: Cannot measure whether search changes improve or degrade quality.
**Severity**: Medium
**Recommendation**: Add offline evaluation framework. Log query-result-selection triples. Compute MRR/NDCG periodically. Surface in `memory_health` or dedicated analytics tool.

### [IMPROVE-013] Session Manager Lacks Multi-Agent Coordination
**Component**: `lib/session/session-manager.ts`
**Issue**: Sessions are single-agent. No support for concurrent agent sessions accessing the same memory store.
**Impact**: In multi-agent orchestration scenarios, agents may see inconsistent views or duplicate each other's work.
**Severity**: Low-Medium (depends on usage pattern)
**Recommendation**: Add session namespacing per agent. Consider read-write locks or optimistic concurrency for shared memory updates.

### [IMPROVE-014] Adaptive Fusion is Behind Feature Flag (Not Default)
**Component**: `lib/search/adaptive-fusion.ts`
**Issue**: `SPECKIT_ADAPTIVE_FUSION` flag defaults to off. Users must opt in.
**Impact**: Most users get the simpler, less adaptive RRF fusion. Intent-aware weight optimization is not being utilized.
**Severity**: Low
**Recommendation**: Graduate adaptive fusion to default-on after sufficient dark-run A/B data confirms improvement. Provide telemetry on fusion quality comparison.

### [IMPROVE-015] No Hybrid Retrieval for Multi-Modal Content
**Component**: Entire search pipeline
**Issue**: System is text-only. No support for code embeddings (specialized models), diagram/image references, or structured data.
**Impact**: Code-heavy memories may benefit from code-specific embedding models. Structured data (JSON configs, API schemas) may not embed well as plain text.
**Severity**: Low (text works well for current use case)
**Recommendation**: Consider code-specific embedding models (e.g., CodeBERT, StarCoder embeddings) for memories containing primarily code. Add structured data extraction for JSON/YAML content.

### [IMPROVE-016] Constitutional Cache Thundering Herd Protection is Basic
**Component**: `lib/search/vector-index-impl.ts`
**Issue**: Thundering herd protection uses a simple boolean flag. Under high concurrency, multiple cache misses could still trigger parallel rebuilds.
**Impact**: Minimal for single-agent use. Could cause issues if multiple tools fire simultaneously.
**Severity**: Very Low
**Recommendation**: Use proper mutex/semaphore if concurrency becomes a concern. Current approach is adequate for single-agent stdio transport.

---

## 8. Technical Debt

### [DEBT-001] Dual Scoring Models
Both 5-factor (REQ-017) and legacy 6-factor scoring models coexist in `composite-scoring.ts`. The legacy model should be deprecated and removed once 5-factor is validated.

### [DEBT-002] TypeScript Facade Pattern
`vector-index.ts` is a thin typed wrapper around `vector-index-impl.ts` (JavaScript). The impl file is 1800+ lines of untyped JavaScript. Migrating the impl to TypeScript would improve maintainability and catch type errors.

### [DEBT-003] Hardcoded Configuration
Many constants are hardcoded in source files rather than centralized in `core/config.ts`:
- BM25 field weights in `bm25-index.ts`
- RRF K value in `rrf-fusion.ts`
- MMR lambda values in `intent-classifier.ts`
- Chunking thresholds in `anchor-chunker.ts`
- FSRS parameters in `composite-scoring.ts`

### [DEBT-004] ~~Test Coverage Unknown~~ CORRECTED
**Original claim was incorrect.** The codebase has a comprehensive vitest test suite:
- **94+ test files** in `mcp_server/tests/` using `*.vitest.ts` naming convention
- **vitest ^4.0.18** listed as devDependency in `package.json`
- **Scripts**: `"test": "vitest run"`, `"test:watch": "vitest"`
- Coverage includes: RRF fusion, composite scoring, FSRS formula, MMR reranker, BM25 index, hybrid search, query expansion, and integration tests
- Test coverage depth and line coverage percentage are not assessed here but the framework and structure are production-grade.

### [DEBT-005] Error Recovery Gaps
While `retry-manager.ts` handles embedding failures and `session-manager.ts` handles crash recovery, there is no comprehensive error recovery for:
- Corrupted sqlite-vec data
- FTS5 index desynchronization
- Partial writes during indexing

---

## 9. Key File Reference

| Component | File Path (relative to mcp_server/) | Lines | Key Functions |
|-----------|-------------------------------------|-------|---------------|
| Entry point | `context-server.ts` | 684 | `main()`, `getTokenBudget()` |
| Config | `core/config.ts` | ~100 | `DATABASE_PATH`, `INPUT_LIMITS` |
| DB state | `core/db-state.ts` | ~150 | `checkDatabaseUpdated()` |
| DB impl | `lib/search/vector-index-impl.ts` | 1800+ | `initializeDb()`, `vectorSearch()`, `indexMemory()` |
| DB facade | `lib/search/vector-index.ts` | 511 | All typed wrappers |
| Hybrid search | `lib/search/hybrid-search.ts` | 688 | `hybridSearchEnhanced()`, `searchWithFallback()` |
| RRF fusion | `lib/search/rrf-fusion.ts` | 362 | `fuseResults()`, `fuseResultsMulti()` |
| Adaptive fusion | `lib/search/adaptive-fusion.ts` | 377 | `adaptiveFusion()` |
| BM25 | `lib/search/bm25-index.ts` | 332 | `BM25Index`, `rebuildFromDatabase()` |
| Intent | `lib/search/intent-classifier.ts` | 547 | `classifyIntent()` |
| MMR | `lib/search/mmr-reranker.ts` | 134 | `applyMMR()` |
| Cross-encoder | `lib/search/cross-encoder.ts` | ~200 | `crossEncoderRerank()` |
| Query expand | `lib/search/query-expander.ts` | ~150 | `expandQuery()` |
| Causal edges | `lib/storage/causal-edges.ts` | 471 | `getCausalChain()`, `addEdge()` |
| Composite score | `lib/scoring/composite-scoring.ts` | 593 | `computeCompositeScore()` |
| Working memory | `lib/cognitive/working-memory.ts` | 682 | `WorkingMemory`, `addItem()`, `decay()` |
| Context handler | `handlers/memory-context.ts` | 616 | `handleMemoryContext()` |
| Search handler | `handlers/memory-search.ts` | ~300 | `handleMemorySearch()` |
| Embeddings | `shared/embeddings.ts` | ~300 | `generateEmbedding()`, LRU cache |
| Chunker | `lib/chunking/anchor-chunker.ts` | ~200 | `chunkByAnchors()` |
| Sessions | `lib/session/session-manager.ts` | ~300 | `SessionManager`, `resetInterruptedSessions()` |

---

## 10. Data Flow Summaries

### 10.1 Memory Save Flow
```
User calls memory_save(filePath)
  → validateFilePath() → security check
  → Read file content
  → extractTitle(), extractTags(), trigger phrase extraction
  → Preflight validation (anchor format, duplicates, token budget)
  → If >50K chars: anchor chunking → parent + child records
  → generateEmbedding() → LRU cache check → provider API
  → indexMemory() → INSERT memory_index + vec_memories
  → FTS5 auto-sync via triggers
  → linkRelatedOnSave() → find similar, create relationships
  → BM25 index update
  → createSpecDocumentChain() → auto-link spec docs
```

### 10.2 Memory Search Flow
```
User calls memory_search(query, options)
  → Intent classification (7 types)
  → Query expansion (rule-based synonyms)
  → Parallel channel execution:
      Channel 1: vectorSearch(embedding, options)
      Channel 2: FTS5 keywordSearch(query, options)
      Channel 3: BM25 bm25Index.search(query)
      Channel 4: graphSearch(top vector results)
  → RRF fusion (K=60, channel weights)
  → Optional: adaptive fusion (intent-aware weights)
  → Cross-encoder reranking (if available)
  → Composite scoring (5-factor)
  → MMR diversity reranking (lambda per intent)
  → Co-activation spreading (from working memory)
  → Session dedup (filter already-sent)
  → Constitutional injection (always at top)
  → Token budget truncation
  → Format and return
```

### 10.3 Memory Context Flow (L1 Orchestration)
```
User calls memory_context(input, mode)
  → If mode=auto: classify intent → select mode
  → If mode=quick: trigger matching only (800 tokens)
  → If mode=deep: full hybrid search (2000 tokens)
  → If mode=focused: intent-specific search (1500 tokens)
  → If mode=resume: anchor-filtered search (1200 tokens)
  → Apply pressure monitor policy (may override mode)
  → Execute selected retrieval strategy
  → Apply token budget
  → Record session metadata
  → Return results
```

---

## 11. Comparison-Ready Summary

For use when comparing against external patterns (zvec, LightRAG, PageIndex):

| Dimension | Current Implementation | Notes |
|-----------|----------------------|-------|
| **Vector Index** | sqlite-vec (brute-force) | O(N), no ANN |
| **Keyword Search** | FTS5 + in-memory BM25 | Dual keyword channels |
| **Fusion** | RRF (K=60) + adaptive weights | 4-channel, intent-aware |
| **Reranking** | Cross-encoder + MMR + composite | 3-stage pipeline |
| **Temporal** | FSRS v4 power-law decay | Spaced repetition science |
| **Graph** | SQLite causal_edges, BFS | 6 relation types, max 3 hops |
| **Embeddings** | Multi-provider, 768/1024/1536-dim | LRU cached, rate limited |
| **Chunking** | Anchor-aware, size-based trigger | 50K threshold, 4K target |
| **Session** | Working memory, dedup, crash recovery | Miller's Law (7 items) |
| **Scoring** | 5-factor composite | Temporal, usage, importance, pattern, citation |
| **Storage** | SQLite (single file) | Schema v16, 40+ columns |
| **Scale** | Single-user, <10K memories optimal | Linear vector search limits |
| **Learning** | search_learning table (unused) | Data collected but not applied |
| **Telemetry** | Retrieval traces collected | No quality metrics dashboard |

---

*End of Internal Architecture Analysis*
