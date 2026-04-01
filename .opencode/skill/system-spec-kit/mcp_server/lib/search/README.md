---
title: "Search Subsystem"
description: "5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval with Reciprocal Rank Fusion (RRF) and Adaptive Fusion."
trigger_phrases:
  - "search subsystem"
  - "hybrid search"
  - "vector search"
---

# Search Subsystem

> 5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval, fused with Reciprocal Rank Fusion (RRF) and Adaptive Fusion.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
  - [4-STAGE PIPELINE ARCHITECTURE](#4--stage-pipeline-architecture)
- [2. KEY CONCEPTS](#2--key-concepts)
- [3. MODULE STRUCTURE](#3--module-structure)
- [4. FEATURES](#4--features)
  - [GRAPH SIGNAL FEATURES](#graph-signal-features)
  - [SAVE-TIME PROCESSING PIPELINE](#save-time-processing-pipeline)
  - [SCORING ENHANCEMENTS](#scoring-enhancements)
- [5. USAGE EXAMPLES](#5--usage-examples)
- [6. RECENT CHANGES (SPRINT 8)](#6--recent-changes-sprint-8)
- [7. RELATED RESOURCES](#7--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The search subsystem provides production-grade hybrid search capabilities with multiple retrieval methods fused via RRF scoring. It handles query expansion, intent classification, typo tolerance and optional cross-encoder reranking.

**Core Capabilities:**
- **5-Channel Hybrid Search**: Vector (semantic) + BM25/FTS5 (lexical) + Graph (relationship-based) + Graph Structure (structural)
- **RRF Score Fusion**: Industry-standard k=40 with convergence bonuses
- **Intent Classification**: 7 intent types route to task-specific retrieval weights
- **Query Enhancement**: Fuzzy matching (Levenshtein) + acronym expansions (via hybrid-search.ts inline logic)
- **Reranking Pipeline**: Optional cross-encoder with length penalties
- **MMR Diversity Reranking**: Maximal Marginal Relevance to reduce redundancy in result sets
- **Evidence Gap Detection**: Identifies missing context and suggests follow-up queries
- **Schema Management**: sqlite-vec schema v15 (current) with document-type fields, event-based decay and phase-aware columns

**Architecture Pattern:**
```text
Query Input
    |
Intent Classifier -> Task-specific weights
    |
Parallel Search (5 channels)
|---> Vector (sqlite-vec)       -> Semantic matches
|---> BM25 (Pure JS)            -> Keyword matches
|---> Graph (Co-activation)     -> Relationship matches
|---> Graph Structure           -> Structural matches
    |
RRF Fusion (k=40) + Adaptive Fusion -> Unified scores
    |
MMR Diversity Reranking -> Redundancy reduction
    |
Cross-Encoder Rerank (optional) -> Relevance refinement
    |
Recency Boost + Co-activation -> Final adjustments
    |
Final Results
```

**Architecture Note:**
`vector-index.ts` is the primary typed export surface for the vector index and re-exports the split schema, query, mutation, store and alias modules. `vector-index-impl.ts` is now a 14-line backward-compatibility shim that simply re-exports `vector-index.ts` for older import paths.

<a id="4-stage-pipeline-architecture"></a>
### 4-Stage Pipeline Architecture

The search pipeline (R6) decomposes retrieval into four bounded stages with strict responsibilities. Each stage has clear input/output contracts defined in `pipeline/types.ts`.

```text
Stage 1                Stage 2                 Stage 3              Stage 4
CANDIDATE GEN    -->   FUSION + SIGNALS   -->  RERANK + AGGREGATE  -->  FILTER + ANNOTATE
(no score changes)     (single scoring point)  (score changes: YES)    (score changes: NO)
```

**Stage 1 — Candidate Generation** (`stage1-candidate-gen.ts`):
Executes 5 search channels in parallel and collects raw candidates with no scoring modifications.

| Channel | Source | Description |
|---------|--------|-------------|
| Vector | `vector-index.ts` | Semantic similarity via sqlite-vec through the split vector-index modules |
| BM25 | `bm25-index.ts` | Pure TypeScript keyword matching |
| FTS5 | `sqlite-fts.ts` | SQLite FTS5 BM25 weighted scoring |
| Graph | `graph-search-fn.ts` | Causal edge traversal + typed-weighted degree (R4) |
| Degree | `graph-search-fn.ts` | Structural graph discovery via typed-weighted degree |

Post-channel: constitutional memory injection, quality score filtering, tier/contextType filtering.

**Stage 2 — Fusion + Signal Integration** (`stage2-fusion.ts`):
Single authoritative point for ALL scoring signals. Signal application order is fixed:

1. Session boost — working-memory attention amplification
2. Causal boost — graph-traversal neighbor amplification
3. Community co-retrieval (N2c) — inject community co-members
4. Graph signals (N2a + N2b) — momentum + causal depth
5. Testing effect — FSRS strengthening write-back (opt-in via `trackAccess`)
6. Intent weights — non-hybrid only (G2 double-weighting prevention: `isHybrid` boolean guard)
7. Artifact routing — class-based weight boosts
8. Feedback signals — learned trigger boosts (0.7x weight) + negative demotions
9. Anchor metadata — extract named ANCHOR sections (annotation only)
10. Validation signals — quality scoring multiplier (clamped 0.8-1.2)

**Stage 3 — Rerank + Aggregate** (`stage3-rerank.ts`):
Cross-encoder reranking (optional, min 2 results) followed by MPAB chunk-to-memory aggregation. Aggregation formula: `parentScore = sMax + 0.3 * Sum(rest) / sqrt(N)` where `sMax` is the best chunk score and N is the remaining chunk count. Chunk ordering preserves `chunk_index` document order (B2 guarantee). `contentSource` metadata marks provenance (`reassembled_chunks` or `file_read_fallback`).

**Stage 4 — Filter + Annotate** (`stage4-filter.ts`):
**Score immutability invariant**: Stage 4 MUST NOT modify scores. Enforced via compile-time `Stage4ReadonlyRow` readonly fields and runtime `captureScoreSnapshot` / `verifyScoreInvariant` defence-in-depth. Applies memory-state filtering (HOT/WARM/COLD/DORMANT/ARCHIVED with per-tier limits), evidence gap detection (Z-score confidence check), quality floor (`QUALITY_FLOOR=0.005`), and token budget truncation.

<!-- /ANCHOR:overview -->

---

## 2. KEY CONCEPTS
<!-- ANCHOR:key-concepts -->

### Reciprocal Rank Fusion (RRF)

**Formula**: `score = Sum 1/(k + rank_i)` where k=40 (tuned for ~1000-memory corpus)

**Why RRF?**
- Parameter-free fusion (no weight tuning required)
- Resilient to retrieval method failures (graceful degradation)
- Citation: Cormack et al. "RRF outperforms Condorcet" (SIGIR 2009)

**Enhancements (REQ-011):**
- **10% Convergence Bonus**: Results in multiple sources get +10% score boost
- **1.5x Graph Weight**: Graph-exclusive discoveries weighted higher for novelty
- **Adaptive Fusion**: Intent-aware weighted RRF with dark-run mode (feature flag `SPECKIT_ADAPTIVE_FUSION`)
- **MMR Diversity**: Maximal Marginal Relevance reranking reduces near-duplicate results
- **Recency Boost**: Time-aware score adjustment favoring recently updated memories
- **Co-activation Boost**: Graph-neighbor score propagation via 2-hop causal traversal

**Example:**
```javascript
// Vector rank: 2, BM25 rank: 5, Graph rank: 1
// RRF score = 1/(40+2) + 1/(40+5) + 1.5/(40+1)
//           = 0.0238 + 0.0222 + 0.0366 = 0.0826
// Convergence bonus: 0.0826 * 1.10 = 0.0909 (final)
```

### BM25 (Best Matching 25)

**Formula**:
```text
score(D, Q) = Sum IDF(qi) * (tf(qi,D) * (k1+1)) / (tf(qi,D) + k1 * (1-b + b*|D|/avgdl))
```

**Parameters:**
- `k1 = 1.2`: Term frequency saturation (higher = less saturation)
- `b = 0.75`: Length normalization (0=ignore length, 1=full penalty)
- `tf(qi,D)`: Term frequency of query term qi in document D
- `|D|`: Document length, `avgdl`: Average document length
- `IDF(qi)`: Inverse document frequency: `log((N - n(qi) + 0.5) / (n(qi) + 0.5) + 1)`

**Why BM25?**
- Handles term frequency saturation (repeated words don't dominate)
- Length normalization (short docs not penalized unfairly)
- Pure JavaScript implementation (REQ-028, no Python dependency)

### Intent-Aware Retrieval

**7 Intent Types** (REQ-012, T036-T039):

| Intent           | Description                  | Prioritizes                         |
| ---------------- | ---------------------------- | ----------------------------------- |
| `add_feature`    | Building new functionality   | Patterns, examples, architecture    |
| `fix_bug`        | Debugging issues             | Error history, root cause, patches  |
| `refactor`       | Restructuring code           | Patterns, dependencies, design docs |
| `security_audit` | Security review              | Vulnerabilities, audit logs         |
| `understand`     | Learning/exploring (default) | Explanations, context, decisions    |
| `find_spec`      | Spec document retrieval      | Boosts spec-doc source weights      |
| `find_decision`  | Decision rationale lookup    | Boosts decision-record source weights |

**Detection**: Keyword matching with primary (2x weight) and secondary (1x weight) terms.

**Example**:
```javascript
// Query: "add user registration feature"
// Intent: add_feature
// Boosts: architecture memories, pattern docs, examples
```

### Cross-Encoder Reranking

**Purpose**: Refine top results using query-document pair scoring.

**Providers** (REQ-013):
- **Voyage rerank-2**: API-based, max 100 docs
- **Cohere rerank-english-v3.0**: API-based, max 100 docs
- **Local GGUF path**: `node-llama-cpp` with `bge-reranker-v2-m3.Q4_K_M.gguf` when `RERANKER_LOCAL=true` and the runtime/model guards pass

**Length Penalty** (REQ-008): Short content (<50 chars) is penalized to `0.9x`; very long content (>2000 chars) is penalized to `0.95x`.

**Latency Protection**:
- Feature gate: `SPECKIT_CROSS_ENCODER` (default on, disable with `false`)
- Per-provider circuit breaker: opens after 3 consecutive failures, 60s cooldown
- Cache TTL: 5 minutes (300,000ms)

**Trade-off**: Adds 200-500ms latency but improves precision by 15-25%.

<!-- /ANCHOR:key-concepts -->

---

## 3. MODULE STRUCTURE
<!-- ANCHOR:structure -->

### Migration Status

**TypeScript migration is COMPLETE.** All source files are TypeScript (0 `.js` source files remain).

| Status               | Files                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------- |
| **TypeScript**       | `hybrid-search.ts`, `cross-encoder.ts`, `intent-classifier.ts`, `bm25-index.ts`             |
| **TypeScript**       | `vector-index.ts` (typed export surface) + `vector-index-impl.ts` (14-line compatibility shim) |
| **TypeScript**       | `reranker.ts` (local reranking utility); `rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts` relocated to `shared/algorithms/` |
| **TypeScript**       | `query-classifier.ts`, `query-router.ts`, `query-expander.ts` (query pipeline)               |
| **TypeScript**       | `channel-representation.ts`, `channel-enforcement.ts`, `confidence-truncation.ts` (quality)   |
| **TypeScript**       | `dynamic-token-budget.ts`, `folder-discovery.ts`, `folder-relevance.ts` (budget & discovery)  |

### Facade Pattern: vector-index

```text
Consumers
    |
    v
vector-index.ts          (166 LOC)
  - Primary typed export surface
  - Re-exports the split implementation modules:
    - vector-index-types.ts
    - vector-index-schema.ts
    - vector-index-mutations.ts
    - vector-index-queries.ts
    - vector-index-store.ts
    - vector-index-aliases.ts
    |
    v
vector-index-impl.ts     (14 LOC)
  - Backward-compatibility shim
  - Re-exports from './vector-index'
  - Keeps legacy import paths working
```

**NOTE**: Most vector-index logic now lives in the split `vector-index-*` modules. `vector-index-impl.ts` is only a compatibility adapter, so runtime changes should be made in `vector-index.ts` or the underlying split modules.

### Module Listing

| File                       | LOC    | Language   | Purpose                                             |
| -------------------------- | ------ | ---------- | --------------------------------------------------- |
| `vector-index.ts`          | 166    | TypeScript | Typed export surface re-exporting the split vector-index modules |
| `vector-index-impl.ts`     | 14     | TypeScript | Backward-compatibility shim that re-exports `vector-index.ts` |
| `vector-index-types.ts`    | -      | TypeScript | Shared type definitions for vector index modules    |
| `vector-index-schema.ts`   | -      | TypeScript | Schema creation and migration logic                 |
| `vector-index-mutations.ts`| -      | TypeScript | Insert, update, and delete operations for vector index |
| `vector-index-queries.ts`  | -      | TypeScript | Query builders and search operations for vector index |
| `vector-index-aliases.ts`  | -      | TypeScript | Re-export aliases for backward-compatible imports   |
| `vector-index-store.ts`    | -      | TypeScript | Low-level storage operations and reconsolidation helpers |
| `hybrid-search.ts`         | ~900   | TypeScript | Orchestrates vector/FTS/BM25/graph/degree fusion via adaptive RRF |
| `cross-encoder.ts`         | ~433   | TypeScript | Reranking with Voyage/Cohere providers              |
| `local-reranker.ts`        | -      | TypeScript | Local GGUF-based cross-encoder reranking fallback   |
| `intent-classifier.ts`     | ~500   | TypeScript | 7 intent types with keyword patterns                |
| `bm25-index.ts`            | ~280   | TypeScript | Pure TypeScript BM25 (REQ-028, v1.2.0)              |
| `reranker.ts`              | -      | TypeScript | Score-based reranking utility (sort + truncate)     |
| `artifact-routing.ts`      | -      | TypeScript | 9 artifact classes with per-type retrieval strategy routing |
| `causal-boost.ts`          | -      | TypeScript | Causal-neighbor score boosting for graph traversal  |
| `session-boost.ts`         | -      | TypeScript | Session-attention score boosting                    |
| `graph-search-fn.ts`       | -      | TypeScript | Graph-structure search channel with typed-weighted degree computation |
| `query-classifier.ts`      | -      | TypeScript | Routes queries by complexity tier (simple <=3 tokens, moderate, complex >8) (Sprint 3) |
| `query-router.ts`          | -      | TypeScript | Tier-to-channel-subset routing for selective pipeline execution (Sprint 3) |
| `query-expander.ts`        | -      | TypeScript | Rule-based synonym expansion for mode="deep" multi-query RAG |
| `channel-representation.ts`| -      | TypeScript | Ensures minimum channel representation in top-k results (QUALITY_FLOOR=0.005) (Sprint 3) |
| `channel-enforcement.ts`   | -      | TypeScript | Pipeline-ready wrapper around channel min-representation check (Sprint 3) |
| `confidence-truncation.ts` | -      | TypeScript | Removes low-confidence tail using 2x median gap heuristic (min 3 results) (Sprint 3) |
| `dynamic-token-budget.ts`  | -      | TypeScript | Per-tier token budgets: simple=3500, moderate=3500, complex=4000 (Sprint 3) |
| `folder-discovery.ts`      | -      | TypeScript | Spec folder description discovery: per-folder `description.json` CRUD, centralized cache aggregation, staleness detection, `slugifyFolderName()` helper, keyword-overlap relevance scoring (PI-B3) |
| `folder-relevance.ts`      | -      | TypeScript | Folder-level relevance scoring via damped DocScore aggregation |
| `evidence-gap-detector.ts` | -      | TypeScript | Z-score confidence check on RRF scores to detect low-confidence retrieval |
| `fsrs.ts`                  | -      | TypeScript | Temporal-structural coherence: FSRS stability augmented with graph centrality |
| `sqlite-fts.ts`            | -      | TypeScript | SQLite FTS5 BM25 weighted scoring, extracted from hybrid-search for independent use |
| `search-flags.ts`          | -      | TypeScript | Default-on runtime feature flags for search pipeline controls |
| `search-types.ts`          | -      | TypeScript | Shared type definitions and interfaces for search modules |
| `graph-flags.ts`           | -      | TypeScript | Legacy compatibility shim for graph channel gate (SPECKIT_GRAPH_UNIFIED) |
| `tfidf-summarizer.ts`      | -      | TypeScript | TF-IDF extractive summarizer for memory content, produces key sentences (R8) |
| `memory-summaries.ts`      | -      | TypeScript | Summary storage, embedding, and search channel for memory summaries (R8) |
| `entity-linker.ts`         | -      | TypeScript | Cross-document entity linking via shared entities across spec folders (S5) |
| `auto-promotion.ts`        | -      | TypeScript | Validation-count-based tier promotion engine (normal->important->critical) |
| `learned-feedback.ts`      | -      | TypeScript | Selection-based relevance feedback with learned triggers (R11) |
| `feedback-denylist.ts`     | -      | TypeScript | Stop-word denylist for learned feedback term filtering |
| `anchor-metadata.ts`       | -      | TypeScript | ANCHOR tag extraction and metadata annotation for retrieval results |
| `validation-metadata.ts`   | -      | TypeScript | Validation signal scoring multiplier for retrieval results |
| `embedding-expansion.ts`   | -      | TypeScript | Embedding-based query expansion for R12 multi-vector retrieval |
| `encoding-intent.ts`       | -      | TypeScript | Heuristic classification of memory content intent at index time (R16) |
| `retrieval-directives.ts`  | -      | TypeScript | Retrieval directive parsing and application for search configuration |
| `spec-folder-hierarchy.ts` | -      | TypeScript | Spec folder parent-child hierarchy resolution with WeakMap caching (S4) |

**Additional root files in the current directory:**

| File                       | LOC    | Language   | Purpose                                             |
| -------------------------- | ------ | ---------- | --------------------------------------------------- |
| `chunk-reassembly.ts`      | -      | TypeScript | Reassembles chunk-level hits into parent result content |
| `confidence-scoring.ts`    | -      | TypeScript | Computes calibrated confidence scores for retrieval results |
| `deterministic-extractor.ts` | -    | TypeScript | Extracts deterministic signals and fields for search processing |
| `graph-calibration.ts`     | -      | TypeScript | Calibrates graph-channel scoring inputs and weights |
| `graph-lifecycle.ts`       | -      | TypeScript | Manages graph refresh, rebuild, and lifecycle operations |
| `hyde.ts`                  | -      | TypeScript | HyDE-style hypothetical document generation for query expansion |
| `llm-cache.ts`             | -      | TypeScript | Caches LLM-assisted search transforms and helper outputs |
| `llm-reformulation.ts`     | -      | TypeScript | Reformulates search queries with LLM-assisted variants |
| `progressive-disclosure.ts` | -     | TypeScript | Supports progressive-disclosure result paging and response shaping |
| `query-decomposer.ts`      | -      | TypeScript | Decomposes complex queries into smaller retrieval units |
| `query-surrogates.ts`      | -      | TypeScript | Builds surrogate query forms for alternate retrieval passes |
| `community-search.ts`      | -      | TypeScript | Community-level search fallback — keyword-matches community summaries, returns member IDs |
| `recovery-payload.ts`      | -      | TypeScript | Builds structured recovery payloads for weak or empty results |
| `result-explainability.ts` | -      | TypeScript | Attaches explainability metadata to result ranking signals |
| `search-utils.ts`          | -      | TypeScript | Shared utility helpers used across search modules |
| `session-state.ts`         | -      | TypeScript | Tracks per-session search state and retrieval context |
| `session-transition.ts`    | -      | TypeScript | Handles session-state transition rules during retrieval flows |
| `surrogate-storage.ts`     | -      | TypeScript | Persists generated query surrogates and related metadata |

**Total**: ~10,000+ LOC across 62 root files + 9 pipeline files (all TypeScript)

**Relocated to `shared/algorithms/`**: `rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts` -- these are now imported from `@spec-kit/shared/algorithms/`.

### Data Flow

```text
1. QUERY PREPROCESSING
   hybrid-search.ts -> Expand acronyms + fix typos (inline)
   intent-classifier.ts -> Detect task intent

         |
         v

2. PARALLEL RETRIEVAL (5 channels)
   vector-index.ts -> Vector search (semantic)
   bm25-index.ts -> BM25 search (keyword)
   graph (via ../cognitive/co-activation.ts) -> Relationship search
   graph-search-fn.ts (graph structure) -> Structural graph search

         |
         v

3. SCORE FUSION
   rrf-fusion.ts -> RRF with k=40, convergence bonus
   adaptive-fusion.ts -> Intent-aware weighted fusion
   hybrid-search.ts -> Orchestrate multi-source fusion

         |
         v

4. POST-FUSION ENHANCEMENTS
   MMR diversity reranking -> Reduce near-duplicate results
   Co-activation boost -> Graph-neighbor score propagation
   Recency boost -> Time-aware score adjustment

         |
         v

5. RERANKING (Optional)
   cross-encoder.ts -> API or local reranker
   Apply length penalty for short content

         |
         v

   Final Results
```

<!-- /ANCHOR:structure -->

---

## 4. FEATURES
<!-- ANCHOR:features -->

### Configuration Options

**Environment Variables:**

| Variable                 | Default  | Purpose                             |
| ------------------------ | -------- | ----------------------------------- |
| `ENABLE_BM25`            | `true`   | Enable BM25 lexical search (legacy compatibility gate) |
| `SPECKIT_CROSS_ENCODER`  | `true`   | Enable cross-encoder reranking gate |
| `VOYAGE_API_KEY`         | _(unset)_| Select Voyage reranker provider when set |
| `COHERE_API_KEY`         | _(unset)_| Select Cohere reranker provider when set |
| `RERANKER_LOCAL`         | `false`  | Enable local GGUF reranker path |
| `EMBEDDING_DIM`          | `768`    | Fallback embedding dimension        |
| `SPECKIT_MEMORY_SUMMARIES`| `true`  | Enable memory summary generation and search channel (R8) |
| `SPECKIT_ENTITY_LINKING`  | `true`  | Enable cross-document entity linking (S5, requires R10) |
| `SPECKIT_SAVE_QUALITY_GATE`| `true` | Enable 3-layer pre-storage quality gate (TM-04) |
| `SPECKIT_RECONSOLIDATION` | `false` | Enable similarity-based merge/conflict routing on save (TM-06). Opt in with `SPECKIT_RECONSOLIDATION=true` |
| `SPECKIT_NEGATIVE_FEEDBACK`| `true` | Enable negative feedback demotion multiplier (A4) |
| `SPECKIT_LEARN_FROM_SELECTION`| `true`  | Enable learned relevance feedback from selections (R11). Disable with `SPECKIT_LEARN_FROM_SELECTION=false` |
| `SPECKIT_EMBEDDING_EXPANSION`| `true` | Enable R12 embedding-based query expansion |
| `SPECKIT_AUTO_ENTITIES`   | `true`  | Enable auto entity extraction at save time (R10) |
| `SPECKIT_GRAPH_SIGNALS`   | `true`  | Enable N2a momentum + N2b causal depth scoring |
| `SPECKIT_COMMUNITY_DETECTION`| `true`| Enable N2c BFS/Louvain community detection |

**RRF Parameters** (hardcoded, REQ-011):
```javascript
const DEFAULT_K = 40;              // Tuned for ~1000-memory corpus
const CONVERGENCE_BONUS = 0.10;    // 10% boost for multi-source
const GRAPH_WEIGHT_BOOST = 1.5;    // 1.5x for graph discoveries
```

**BM25 Parameters** (hardcoded, tuned):
```javascript
const DEFAULT_K1 = 1.2;   // Term frequency saturation
const DEFAULT_B = 0.75;    // Length normalization
```

### Vector Index Features

**Schema Versions** (v1-v9, v12-v15. Note: v10-v11 are skipped):

| Version | Migration                                                                    |
| ------- | ---------------------------------------------------------------------------- |
| v1      | Initial schema (no-op, base tables created by `create_schema()`)             |
| v2      | Add `idx_history_timestamp` index on `memory_history`                        |
| v3      | Add `related_memories` column to `memory_index`                              |
| v4      | FSRS columns (`stability`, `difficulty`, `last_review`, `review_count`) + `memory_conflicts` table + FSRS indexes |
| v5      | `memory_type` column (9 cognitive types) + `half_life_days` + `type_inference_source` |
| v6      | `file_mtime_ms` column for incremental indexing (REQ-023, T064-T066)         |
| v7      | `partial` embedding_status + `idx_embedding_pending` + `idx_fts_fallback` (REQ-031, T096) |
| v8      | `causal_edges` table with 6 relationship types (REQ-012, T043-T047)          |
| v9      | `memory_corrections` table for learning from corrections (REQ-015, REQ-026, T052-T055) |
| v10-v11 | **Skipped** (no migration functions exist. Version jumps from 9 to 12)       |
| v12     | Unified `memory_conflicts` DDL: drop and recreate with canonical schema (KL-1) |
| v13     | Add `document_type` + `spec_level` columns and indexes for spec-doc indexing and document-type scoring |
| v14     | Follow-up schema updates after v13                                                           |
| v15     | Event-based decay columns (spec 136), HVR integration fields (spec 137), phase-aware scoring columns (spec 139) — **current schema** |

**Document-type indexing references:**
- `tests/full-spec-doc-indexing.vitest.ts`: validates 8 spec document types, scoring multipliers and new intents.
- `handlers/memory-index.ts`: keeps 3-source indexing and `includeSpecDocs` wiring aligned with search expectations.

**Multi-Provider Support**:
- Voyage AI: 1024-dim (default)
- OpenAI: 1536-dim
- Auto-detection via API keys

**Buffer Handling**:
```javascript
// Float32Array -> Buffer conversion for sqlite-vec
function toEmbeddingBuffer(embedding) {
  return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
}
```

### BM25 Index Features

**Pure JavaScript Implementation**:
- No Python dependencies (REQ-028)
- In-memory index for fast retrieval
- Simple stemming (15+ suffix rules)
- 44-word stopword list

**Tokenization**:
```javascript
// Preserves code identifiers (underscores), removes punctuation
"user_authentication_flow" -> ["user", "authent", "flow"]
```

**IDF Calculation**:
```javascript
// Inverse document frequency with smoothing
IDF = log((N - n(qi) + 0.5) / (n(qi) + 0.5) + 1)
```

### Hybrid Search Features

**5-Channel Fusion**:
```javascript
// unifiedSearch() orchestrates:
// 1. Vector search (semantic similarity)
// 2. BM25/FTS5 search (keyword matching)
// 3. Graph search (relationship traversal, 1.5x boost)
// 4. Graph-structure search (structural discovery)
// -> RRF + Adaptive Fusion -> MMR diversity -> Sorted by combined score
```

**Spec Folder Scoping**:
```javascript
// Filter to specific project context
hybridSearch("authentication", { specFolder: "specs/<###-spec-name>" })
```

**Graceful Degradation**:
- If BM25 disabled: Vector + FTS5 only
- If RRF disabled: Vector-only with basic metadata
- If no graph: Vector + Lexical fusion
- If no structural graph channel: Vector + Lexical + Co-activation (3-channel fallback)

### Intent Classification Features

**Keyword Weighting**:
```javascript
// Primary keywords: 2x weight
// Secondary keywords: 1x weight
// Threshold: 3.0 for confident detection
```

**Example Detection**:
```javascript
// Query: "fix login crash after update"
// Matches: "fix" (primary, 2.0) + "crash" (primary, 2.0) + "login" (secondary, 1.0)
// Total: 5.0 -> fix_bug intent
```

**Fallback**: `understand` intent if no match (score < 3.0).

### Cross-Encoder Features

**Provider Auto-Detection**:
```javascript
// Checks API keys in order:
// 1. VOYAGE_API_KEY -> Voyage rerank-2
// 2. COHERE_API_KEY -> Cohere v3.5
// 3. Python available -> Local (unimplemented)
```

**Caching**:
```javascript
// Cache key: SHA-256(query + document IDs)
// Avoids redundant API calls for identical searches
```

**Latency Monitoring**:
```javascript
// Track P95 latency (last 100 searches)
// Auto-disable if P95 > threshold
// Log warning with recovery hint
```

**Length Penalty** (REQ-008):
```javascript
// content_length < 100 chars -> penalty 0.8x - 1.0x
// Linear interpolation: penalty = 0.8 + (len/100) * 0.2
```

### Memory Summaries (R8)

**Purpose**: Generate TF-IDF extractive summaries of memory content and expose them as a search channel. Gated via `SPECKIT_MEMORY_SUMMARIES`.

**TF-IDF Summarizer** (`tfidf-summarizer.ts`):

| Aspect | Details |
|--------|---------|
| **Algorithm** | TF-IDF sentence scoring with markdown stripping and tokenization |
| **Output** | Key sentences extracted from content (default top 3) |
| **Dependencies** | Pure TypeScript, zero npm dependencies |
| **Sentence Bounds** | Min 10 chars, max 500 chars per sentence |

**Key exports:**

| Export | Signature | Description |
|--------|-----------|-------------|
| `computeTfIdf` | `(sentences: string[]) => ScoredSentence[]` | Score sentences by TF-IDF |
| `extractKeySentences` | `(content: string, n?: number) => string[]` | Extract top-N key sentences |
| `generateSummary` | `(content: string) => { summary, keySentences }` | Generate full summary with key sentences |

**Memory Summary Storage** (`memory-summaries.ts`):

| Aspect | Details |
|--------|---------|
| **Storage** | Summaries stored with embeddings in SQLite for vector search |
| **Search Channel** | `querySummaryEmbeddings()` provides cosine similarity search over stored summaries |
| **Scale Gate** | `checkScaleGate()` validates database is ready for summary operations |
| **Pipeline** | `generateAndStoreSummary()` combines TF-IDF extraction with embedding and persistence |

**Key exports:**

| Export | Signature | Description |
|--------|-----------|-------------|
| `generateAndStoreSummary` | `async (db, memoryId, content, embedFn) => void` | Generate, embed, and store a summary |
| `querySummaryEmbeddings` | `(db, queryEmbedding, limit?) => SummarySearchResult[]` | Search summaries by embedding similarity |
| `checkScaleGate` | `(db) => boolean` | Check if summary infrastructure is ready |

### Cross-Document Entity Linking (S5)

**Purpose**: Create causal edges between memories that share extracted entities across spec folders. Gated via `SPECKIT_ENTITY_LINKING`. Requires R10 (`SPECKIT_AUTO_ENTITIES`) to also be enabled.

**Entity Linker** (`entity-linker.ts`):

| Aspect | Details |
|--------|---------|
| **Entity Catalog** | Builds catalog from `memory_entities` table, grouped by normalized canonical name |
| **Cross-Doc Matching** | Identifies entities appearing in 2+ spec folders |
| **Edge Creation** | Creates `supports` causal edges between memories sharing entities |
| **Density Guard** | Max 20 edges per node to prevent graph density explosion |
| **Infrastructure Check** | `hasEntityInfrastructure()` validates required tables exist |

**Key exports:**

| Export | Signature | Description |
|--------|-----------|-------------|
| `normalizeEntityName` | `(name: string) => string` | Normalize entity name for matching |
| `buildEntityCatalog` | `(db) => Map<string, { memoryIds, specFolders }>` | Build entity catalog from database |
| `findCrossDocumentMatches` | `(db) => EntityMatch[]` | Find entities shared across spec folders |
| `createEntityLinks` | `(db, matches) => EntityLinkResult` | Create causal edges for cross-doc matches |
| `getEntityLinkStats` | `(db) => EntityLinkStats` | Get statistics about entity linking |
| `hasEntityInfrastructure` | `(db) => boolean` | Check if required tables exist |
| `runEntityLinking` | `(db) => EntityLinkResult` | Run full entity linking pipeline |

<a id="graph-signal-features"></a>
### Graph Signal Features

Graph-based scoring signals applied during Stage 2 fusion. Gated via `SPECKIT_GRAPH_SIGNALS` (N2a + N2b) and `SPECKIT_COMMUNITY_DETECTION` (N2c).

**R4: Typed-Weighted Degree** (`graph-search-fn.ts`):
The 5th RRF channel computes degree centrality with per-edge-type weights:

| Edge Type | Weight | Description |
|-----------|--------|-------------|
| `caused` | 1.0 | Strongest causal signal |
| `derived_from` | 0.9 | Derivation relationship |
| `enabled` | 0.8 | Enablement relationship |
| `contradicts` | 0.7 | Contradiction signal |
| `supersedes` | 0.6 | Version supersession |
| `supports` | 0.5 | Supporting evidence |

Hub caps prevent high-degree nodes from dominating: `MAX_TYPED_DEGREE=15` (default max before normalization), `MAX_TOTAL_DEGREE=50` (hard cap on raw degree). Normalized boost capped at `DEGREE_BOOST_CAP=0.15`.

**A7: Co-Activation Boost** (`../cognitive/co-activation.ts` + Stage 2 fusion):
Top-ranked results seed a 2-hop BFS traversal over causal edges. Discovered neighbors receive a score boost with `SEED_FRACTION=0.25` strength. A `1/sqrt(neighbor_count)` fan-effect divisor (R17) prevents hub nodes from appearing in every co-activation result.

**N2a: Graph Momentum** (`graph-signals.ts`):
Tracks degree change over a 7-day rolling window using the `degree_snapshots` table. Momentum = currentDegree - pastDegree. Nodes gaining connections receive a score bonus: `clamp(momentum * 0.01, 0, 0.05)` — additive cap of +0.05.

**N2b: Causal Depth** (`graph-signals.ts`):
The causal graph is condensed into strongly connected components, then longest-path depth is computed across the resulting DAG. Shortcut edges do not collapse deeper chains; cycle members share one bounded depth layer, and the final depth is normalized by the deepest reachable component chain (`maxDepth`). Score bonus: `normalizedDepth * 0.05` — rewards structurally deep nodes in the causal chain.

**N2c: Community Detection** (`community-detection.ts`):
BFS connected-component labelling assigns community IDs. When the largest component contains >50% of all nodes, escalates to Louvain modularity optimization for finer-grained communities. Community co-members are injected into Stage 2 results before graph signal scoring. Gated via `SPECKIT_COMMUNITY_DETECTION`.

**Edge Density Monitoring** (`edge-density.ts`):
Measures graph density and reports metrics used for R10 entity extraction escalation decisions.

<a id="save-time-processing-pipeline"></a>
### Save-Time Processing Pipeline

Processing steps applied during `memory_save` before a memory is persisted.

**PI-A5: Verify-Fix-Verify Loop** (`memory-save.ts` / `quality-loop.ts`):
Opt-in quality loop gated by `SPECKIT_QUALITY_LOOP`. When enabled, the save path performs 1 initial evaluation plus up to 2 immediate auto-fix retries by default. The reported `attempts` count reflects actual evaluations used, so early-break cases can stop before the configured ceiling. Accepted saves persist metadata fixes and carry rewritten body content in-memory until later hard-reject gates clear under lock. Rejected memories return structured rejection feedback instead of continuing to storage.

**TM-02: Same-Path and Hash Dedup Hardening** (`save/dedup.ts`):
Same-path `unchanged` only applies to healthy existing rows (`success`, `pending`, `partial`), so unhealthy embedding states still re-enter indexing. Cross-path content-hash dedup accepts chunked parents only when the parent row is in valid `partial` state and ignores invalid parent rows marked `complete`.

**TM-04: Quality Gate** (`save-quality-gate.ts`):
3-layer pre-storage validation gated via `SPECKIT_SAVE_QUALITY_GATE` (default ON, graduated Sprint 4):

| Layer | Check | Details |
|-------|-------|---------|
| 1. Structural | Title, content length, spec folder format | Min content: 50 chars |
| 2. Content Quality | 5-dimension weighted signal density | Dimensions: title (0.25), triggers (0.20), length (0.20), anchors (0.15), metadata (0.20) |
| 3. Semantic Dedup | Cosine similarity against existing memories | Threshold: 0.92 rejects near-duplicates |

Signal density threshold: **0.4** — below this, content quality is too low. 14-day warn-only period (MR12 mitigation): logs scores but does not block saves during ramp-up.

**TM-06: Reconsolidation** (`reconsolidation.ts`):
Similarity-based merge/conflict/complement routing gated via `SPECKIT_RECONSOLIDATION` (default OFF, opt in with `SPECKIT_RECONSOLIDATION=true`):

| Similarity | Action | Behavior |
|-----------|--------|----------|
| >= 0.88 | **Merge** | Append unique content lines, boost importance_weight +0.1 |
| 0.75 - 0.88 | **Conflict** | Supersede: deprecate existing, create `supersedes` causal edge |
| < 0.75 | **Complement** | Store as new memory unchanged |

Checks top-3 most similar memories in the spec folder.

**R7: Chunk Thinning** (`chunk-thinning.ts`):
Scores chunks by anchor presence + content density. Composite score: `anchorScore * ANCHOR_WEIGHT + densityScore * DENSITY_WEIGHT`. Chunks below the `DEFAULT_THINNING_THRESHOLD=0.3` are dropped before indexing.

**Embedding Cache Consistency** (`save/embedding-pipeline.ts` + chunking path):
Embedding cache keys now hash normalized content in both the primary and chunked embedding paths, so equivalent normalized content shares cache entries.

**R16: Encoding-Intent Classification** (`encoding-intent.ts`):
Heuristic classification of memory content intent at index time. Stored in the `encoding_intent` column for retrieval-time filtering. Gated via `SPECKIT_ENCODING_INTENT`.

**R10: Auto Entity Extraction** (`extraction/`):
NER + key-phrase rules extract entities at save time and populate the `memory_entities` table. Density guard limits extraction volume. Gated via `SPECKIT_AUTO_ENTITIES`. Upstream dependency for S5 entity linking.

**PI-A3: Token Budget Validation**:
Pre-save check validates content fits within tier-specific token budgets. Greedy truncation strategy applied when content overflows.

**Lexical Normalization + BM25 Document Text** (`bm25-index.ts`):
`buildBm25DocumentText()` builds the canonical lexical document from title, content, trigger phrases, and folder metadata. `normalizeLexicalQueryTokens()` is shared by BM25 and SQLite FTS flows so lexical matching stays aligned across search channels.

**Reindex Save Parity** (`ops/file-watcher.ts` / ingest reindex callers):
Watcher- and ingest-triggered reindex paths now use the normal synchronous embedding cache-miss flow. Deferred embeddings remain opt-in via `asyncEmbedding` or failure fallback.

**Scan Invalidation Hooks** (`handlers/memory-index.ts` / `handlers/mutation-hooks.ts`):
`memory_index_scan` now runs the broader post-mutation invalidation hook behavior whenever a scan indexes, updates, or stale-deletes rows.

<a id="scoring-enhancements"></a>
### Scoring Enhancements

**Score Normalization** (`composite-scoring.ts`):
Min-max normalization maps composite scores to [0,1], fixing 15:1 magnitude mismatches between scoring dimensions. Gated via `SPECKIT_SCORE_NORMALIZATION` (default ON, graduated Sprint 4). Single-result sets normalize to 1.0; equal scores normalize to 1.0.

**TM-01: Interference Scoring** (`../scoring/interference-scoring.ts`):
Counts similar memories in the same spec folder using Jaccard word-overlap similarity. Threshold: **0.75**. Penalty: **-0.08** per interfering memory (additive, clamped to [0,1]). Gated via `SPECKIT_INTERFERENCE_SCORE` (default ON).

**Degree Cache Invalidation** (`graph-search-fn.ts`):
Typed-degree ranking is cached per database connection and invalidated through `clearDegreeCache()` / `clearDegreeCacheForDb()` after causal-edge and mutation flows, so the degree channel stays in sync with recent graph writes.

**TM-03: Classification-Based Decay** (`composite-scoring.ts`):
FSRS stability is adjusted by a 2D multiplier matrix of context type x importance tier:

| | constitutional | critical | important | normal | temporary | deprecated |
|---|---|---|---|---|---|---|
| **decision** | Inf | Inf | 1.5x | 1.0x | 0.5x | 0.25x |
| **research** | Inf | Inf | 3.0x | 2.0x | 1.0x | 0.5x |
| **implementation** | Inf | Inf | 1.5x | 1.0x | 0.5x | 0.25x |

`Infinity` strategy: constitutional and critical tiers with decision/research context never decay. Gated via `SPECKIT_CLASSIFICATION_DECAY` (default ON).

**A4: Negative Feedback** (`negative-feedback.ts`):
`wasUseful=false` validations apply a demotion multiplier to composite scores. Penalty: -0.1 per negative validation, floor at 0.3 (never suppress below 30%). 30-day half-life recovery: penalty halves over time if no further negative feedback. Gated via `SPECKIT_NEGATIVE_FEEDBACK` (default ON).

**T002a: Auto-Promotion** (`auto-promotion.ts`):
Validation-count-based tier promotion engine. Thresholds: **5** positive validations = normal -> important, **10** = important -> critical. Throttle safeguard: max **3** promotions per **8-hour** rolling window. `NON_PROMOTABLE_TIERS`: critical, constitutional, temporary, deprecated. Promotion audit logged to `memory_promotion_audit` table.

**R11: Learned Relevance Feedback** (`learned-feedback.ts`):
Selection tracking writes to a separate `learned_triggers` column (NOT FTS5 index). 10 safeguards: separate column, 30-day TTL, 100+ stop words denylist, rate cap (3 terms/selection, 8 terms/memory), top-3 exclusion, 1-week shadow period, <72h memory exclusion, sprint gate review, rollback mechanism, provenance audit log. Query weight: **0.7x** of organic triggers. Gated via `SPECKIT_LEARN_FROM_SELECTION` (default ON; set to `false` to disable).

<!-- /ANCHOR:features -->

---

## 5. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Basic Hybrid Search

```typescript
import { initializeDb } from './vector-index';
import { init, unifiedSearch } from './hybrid-search';
import { vectorSearch } from './vector-index';
import Database from 'better-sqlite3';

// Initialize
const db = initializeDb();
init(db, vectorSearch);

// Search with all methods
const results = await unifiedSearch('authentication flow', {
  limit: 10,
  specFolder: 'specs/<###-spec-name>',  // Optional: scope to project
  enableGraph: true,              // Include graph search
});

// Results include:
// - rrfScore: Combined score
// - sources: ['vector', 'bm25', 'graph']
// - vectorRank, bm25Rank, graphRank
// - sourceCount: How many methods found this result
```

### Intent-Aware Search

```typescript
import { classifyIntent } from './intent-classifier';
import { unifiedSearch } from './hybrid-search';

// Classify query intent
const query = 'add dark mode feature';
const intent = classifyIntent(query);
// -> { type: 'add_feature', confidence: 0.85 }

// Adjust retrieval weights based on intent
const results = await unifiedSearch(query, {
  intent: intent.type,  // Boosts relevant memory types
  limit: 10,
});
```

### Cross-Encoder Reranking

```typescript
import { rerankResults } from './cross-encoder';

// Get initial results
const initial = await unifiedSearch('user authentication', { limit: 20 });

// Rerank top 20 with cross-encoder
const reranked = await rerankResults('user authentication', initial, {
  topK: 10,  // Return top 10 after reranking
  provider: 'voyage',
});

// Results include:
// - crossEncoderScore: Reranker score
// - lengthPenalty: Applied penalty (if <100 chars)
// - finalScore: crossEncoderScore * lengthPenalty
```

### BM25 Direct Access

```typescript
import * as bm25Index from './bm25-index';

// Check availability
if (bm25Index.isBm25Enabled()) {
  // Search directly
  const results = bm25Index.getIndex().search('authentication', {
    limit: 10,
    specFolder: 'specs/<###-spec-name>',
  });

  // Results: [{ id, score, rank }]
}
```

### Vector Index Schema Migration

```typescript
import { initializeDb, getDb } from './vector-index';

// Initialize DB (auto-runs migrations to current schema, including v13+)
initializeDb();

// Check current version
const db = getDb();
const version = db.prepare('PRAGMA user_version').pluck().get() as number;
console.log(`Schema version: ${version}`);
```

<!-- /ANCHOR:usage-examples -->

---

## 6. RECENT CHANGES (SPRINT 8)
<!-- ANCHOR:recent-changes -->

Sprint 8 delivered a comprehensive remediation pass across the search subsystem:

**Bug Fixes (15 items):**
- SQL operator precedence fixes in scoring and reconsolidation queries (B3)
- Guard clauses added for missing data, null embeddings, and edge cases (B4)
- Composite score overflow clamped to [0,1] — doc-type multipliers could push above 1.0 (C1)
- Causal-boost cycle amplification fix prevents unbounded score growth (C3)
- Ablation binomial overflow fix for n>50 via log-space computation (C4)
- FTS5 double-tokenization fix in learned feedback isolation (D2)
- Quality floor corrected from 0.2 to 0.005 (D3) — aligns with RRF score range
- Temporal contiguity double-counting eliminated (E1)
- Divergent `normalizeEntityName` implementations consolidated (A1)
- Duplicate `computeEdgeDensity` implementations consolidated (A2)
- Dead code removal: ~360 lines across scoring, search, and graph modules

**Performance Improvements (13 items):**
- `Math.max(...spread)` replaced with iterative loop for large arrays
- LIMIT clauses added to unbounded SQL queries
- Batch query consolidation in interference scoring
- WeakMap caching for spec folder hierarchy lookups (S4)

**Test Quality:**
- 226 test files, 7,008 tests passing
- Deterministic test isolation improved (no shared mutable state leaks)

<!-- /ANCHOR:recent-changes -->

---

## 7. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Dependencies

| Module           | Purpose                           |
| ---------------- | --------------------------------- |
| `../cognitive/`  | Tier classifier, attention decay  |
| `../utils/`      | Format helpers, path security     |
| `@spec-kit/shared/embeddings` | Embeddings provider abstraction   |
| `../errors/`     | Recovery hints for error handling |
| Search weights configuration | Loaded via SERVER_DIR in the split vector-index modules (compat imports still route through `vector-index-impl.ts`) |

### External Dependencies

| Library          | Purpose                 |
| ---------------- | ----------------------- |
| `better-sqlite3` | SQLite database driver  |
| `sqlite-vec`     | Vector search extension |

### Configuration Files

| File                          | Purpose                                  |
| ----------------------------- | ---------------------------------------- |
| `configs/search-weights.json` | Max triggers per memory, scoring weights (loaded via SERVER_DIR) |

### Related Documentation

- `../cognitive/README.md`: Cognitive layer (attention, tier classification)
- `../storage/README.md`: Storage layer (checkpoints, history, access tracking)
- `../parsing/README.md`: Parsing layer (memory parser, trigger matcher)
- `../graph/`: Graph signals (N2a momentum, N2b causal depth) and community detection (N2c)
- `../extraction/README.md`: Entity extraction (R10) — upstream for entity linking (S5)
- `context-server.ts`: MCP integration and API endpoints

### Research References

- **RRF**: Cormack et al. "Reciprocal Rank Fusion outperforms Condorcet" (SIGIR 2009)
- **BM25**: Robertson & Walker "Okapi at TREC-3" (1994)
- **Cross-Encoders**: Nogueira et al. "Document Ranking with Neural Networks" (2019)

### REQ Tracking

| REQ     | Feature                          | Files                           |
| ------- | -------------------------------- | ------------------------------- |
| REQ-008 | Length penalty for short content | cross-encoder.ts                |
| REQ-011 | RRF fusion enhancement           | hybrid-search.ts                |
| REQ-012 | Intent classification            | intent-classifier.ts            |
| REQ-013 | Cross-encoder reranking          | cross-encoder.ts                |
| REQ-014 | BM25 hybrid search               | bm25-index.ts, hybrid-search.ts |
| REQ-018 | Query expansion (fuzzy)          | hybrid-search.ts                |
| REQ-027 | Fuzzy acronym matching           | hybrid-search.ts                |
| REQ-028 | Pure TypeScript BM25             | bm25-index.ts                   |

<!-- /ANCHOR:related -->

---

**Version**: 2.1.0
**Last Updated**: 2026-03-11
**Maintainer**: system-spec-kit MCP server

**Migration Status**:
- TypeScript migration is **complete**: all 62 root + 9 pipeline code files are TypeScript (0 `.js` source files)
- `vector-index.ts` is the primary typed export surface. `vector-index-impl.ts` is a 14-line compatibility shim, and the core implementation lives in the split vector-index modules for types, schema, mutations, queries, aliases, and store
- `rrf-fusion.ts`, `adaptive-fusion.ts`, and `mmr-reranker.ts` relocated to `shared/algorithms/`
- Query pipeline additions: query complexity routing, channel representation, confidence truncation, dynamic token budgets, folder discovery
- Implemented: TF-IDF memory summaries (R8), cross-document entity linking (S5), graph signals (N2a/N2b/N2c), 4-stage pipeline (R6)
- Sprint 8 remediation: 15 bug fixes, ~360 lines dead code removed, 13 performance improvements
