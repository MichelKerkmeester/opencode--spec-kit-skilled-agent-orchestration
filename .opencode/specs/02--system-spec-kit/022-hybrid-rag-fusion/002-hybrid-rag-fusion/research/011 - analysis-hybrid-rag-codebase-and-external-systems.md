# Technical Analysis: Hybrid RAG Architecture — Codebase Deep-Dive and External System Comparison

**Spec:** 138 — Hybrid RAG Fusion
**Research Round:** 6 (Multi-Agent: Codebase + External + Feasibility)
**Date:** 2026-02-20
**Scope:** system-speckit memory MCP server vs. graphrag_mcp, WiredBrain-Hierarchical-Rag, RAGFlow

---

<!-- ANCHOR:research-executive-summary-138 -->
## 1. Executive Summary

This analysis is the product of a 3-agent parallel research sprint: a codebase explorer examining 18 source files (11,000+ LOC) of the system-speckit memory MCP server, an external researcher analyzing three open-source RAG repositories, and a technical analyzer performing pattern-by-pattern feasibility assessment.

**Central Finding:** The system-speckit memory MCP server is significantly more advanced than initial assessment suggests — it already has RRF fusion, BM25, FTS5, vector search, causal graph traversal, intent classification, adaptive fusion, cross-encoder reranking, and 10 cognitive modules. However, several **implemented-but-disconnected** subsystems represent the largest missed opportunity. Three production-ready modules (`adaptive-fusion.ts`, `co-activation.spreadActivation()`, graph retrieval channel) exist in the codebase but are either feature-flagged, defaulted off, or simply never called in the search pipeline. Activating these existing assets provides the highest return with the lowest risk.

Beyond activation, the analysis identifies **MMR diversity reranking** as the single highest-impact missing capability, and **adaptive fallback thresholds** (from RAGFlow) as the most impactful zero-effort win.

---
<!-- /ANCHOR:research-executive-summary-138 -->

<!-- ANCHOR:research-system-architecture-current-state-verified-138 -->
## 2. System Architecture: Current State (Verified)

### 2.1 Search Pipeline Architecture

The search pipeline spans 7,372 LOC across 11 files in `mcp_server/lib/search/`:

```
Query
  │
  ├─ L1: memory_context (handlers/memory-context.ts:350-597)
  │    ├─ Intent Classification (intent-classifier.ts) — 7 intents, keyword+pattern scoring
  │    ├─ Mode Selection — auto/quick/deep/focused/resume
  │    ├─ Pressure Policy — token usage can downgrade mode
  │    └─ Strategy Dispatch → L2
  │
  ├─ L2: memory_search (handlers/memory-search.ts:631-1005)
  │    ├─ Embedding Generation (providers/embeddings.ts)
  │    ├─ Hybrid Search (hybrid-search.ts:324-381)
  │    │    ├─ Vector Search — sqlite-vec, weight 1.0
  │    │    ├─ FTS5 Search — weight 0.8
  │    │    ├─ BM25 Search — in-memory, weight 0.6
  │    │    └─ Graph Search — ⚠️ DISABLED (useGraph=false, line 224)
  │    │
  │    ├─ RRF Fusion (rrf-fusion.ts:128) — k=60, convergence bonus 0.10
  │    │
  │    └─ Post-Search Pipeline (memory-search.ts:457-624):
  │         ├─ State Filtering
  │         ├─ Session Boost (session-boost.ts)
  │         ├─ Causal Boost (causal-boost.ts) — 2-hop, max 0.20
  │         ├─ FSRS Testing Effect
  │         ├─ Intent Weight Application
  │         ├─ Cross-Encoder Reranking (opt-in, default OFF)
  │         └─ Response Formatting
  │
  └─ Response Envelope → Token Budget Truncation → Client
```

[SOURCE: hybrid-search.ts:324-381, memory-search.ts:631-1005]

### 2.2 Cognitive Layer (3,537 LOC, 10 modules)

| Module | LOC | Purpose | Status |
|--------|-----|---------|--------|
| Working Memory | 681 | Session-scoped attention, Miller's Law (cap=7) | Active |
| Prediction Error Gate | 537 | Contradiction detection on WRITE | Active |
| Tier Classifier | 538 | Importance tier assignment | Active |
| Archival Manager | 515 | Memory lifecycle management | Active |
| Attention Decay | 389 | FSRS v4 power-law long-term decay | Active |
| Co-Activation | 295 | Spreading activation network | **EXISTS BUT NEVER CALLED IN SEARCH** |
| FSRS Scheduler | 265 | Spaced repetition algorithm | Active |

[SOURCE: mcp_server/lib/cognitive/]

### 2.3 Database Schema (v15, SQLite + sqlite-vec)

- **memory_index**: Primary table with 30+ columns (content, embeddings, FSRS, tiers, quality)
- **vec_memories**: sqlite-vec virtual table for vector operations
- **memory_fts**: FTS5 virtual table (title, trigger_phrases, file_path, content_text)
- **causal_edges**: 6 relationship types (caused, enabled, supersedes, contradicts, derived_from, supports)
- **30+ indexes**: Including partial indexes for pending/archived/active states
- **WAL mode**: With 64MB page cache, 256MB mmap

---
<!-- /ANCHOR:research-system-architecture-current-state-verified-138 -->

<!-- ANCHOR:research-critical-gap-analysis-implemented-but-disconnected-systems-138 -->
## 3. Critical Gap Analysis: Implemented-But-Disconnected Systems

### 3.1 Graph Retrieval Channel (Disabled)

**Finding:** The `hybridSearchEnhanced()` function at `hybrid-search.ts:324-381` accepts a `graphSearchFn` interface (line 19-22) but the `useGraph` parameter defaults to `false` (line 224). The graph is ONLY used for post-retrieval boosting via `causal-boost.ts`, not as an independent retrieval source.

**Impact:** The causal graph contains typed relationships (supersedes, caused, supports) that could directly answer queries like "What decision superseded X?" but this capability is unavailable in the main search pipeline.

**Activation Cost:** ~20 LOC to wire `useGraph: true` and implement the `graphSearchFn` callback using the existing `causal-edges.ts:getCausalChain()`.

[SOURCE: hybrid-search.ts:224, causal-boost.ts:74-103]

### 3.2 Adaptive Fusion (Feature-Flagged, Not Wired)

**Finding:** `adaptive-fusion.ts` (359 LOC) implements intent-aware weighted RRF fusion with per-intent weight profiles and document-type adjustments. It includes a dark-run mode for A/B comparison. However, it is behind a `SPECKIT_ADAPTIVE_FUSION` flag (line 72) and is NOT integrated into the `hybridSearchEnhanced()` pipeline.

**Impact:** Currently, hybrid search uses static weights (vector=1.0, FTS=0.8, BM25=0.6). The adaptive module would dynamically adjust these per query intent — e.g., `understand` queries would weight semantic 0.7 vs keyword 0.2, while `find_spec` queries would weight keyword higher.

**Activation Cost:** ~30 LOC to replace static weights in `hybridSearchEnhanced()` with `adaptiveFuse()` call.

[SOURCE: adaptive-fusion.ts:53-60, hybrid-search.ts:352-365]

### 3.3 Co-Activation Spreading (Exists, Never Called)

**Finding:** `co-activation.ts` implements a BFS/greedy best-first spreading activation algorithm (`spreadActivation()` at line 201-264) that traverses co-activation networks to discover related memories. It is fully functional but NEVER called in the search or context handlers.

**Impact:** Spreading activation would discover memories that are semantically connected to seed results through co-occurrence patterns — a form of associative retrieval that complements vector similarity.

**Activation Cost:** ~15 LOC to call `spreadActivation()` in the post-search pipeline at `memory-search.ts:457`.

[SOURCE: co-activation.ts:201-264]

---
<!-- /ANCHOR:research-critical-gap-analysis-implemented-but-disconnected-systems-138 -->

<!-- ANCHOR:research-external-system-architectures-138 -->
## 4. External System Architectures

### 4.1 graphrag_mcp

**Architecture:** Python MCP server combining Neo4j (graph) + Qdrant (vectors) + sentence-transformers (embeddings).

**Key Components:**
- `server.py` — MCP server entry point, 16 MCP tools
- `graphrag_mcp/__init__.py` — Core logic: `GraphRAGClient` orchestrating Neo4j + Qdrant
- Dependencies: `mcp[cli]>=1.6.0`, `neo4j>=5.14.0`, `qdrant-client>=1.7.0`

**Tools Exposed:** `search_nodes`, `get_node`, `open_nodes`, `add_nodes`, `add_relations`, `find_similar` (vector), `traverse_path` (graph path), community detection tools.

**Assessment:** Early-stage research project. No real fusion algorithm between graph and vector results — they are separate tools. The MCP tool surface is useful reference for graph-specific tool design. The separation of `search_nodes` (graph) vs `find_similar` (vector) vs `traverse_path` (graph traversal) provides a clean API model.

**Applicable Pattern:** Tool decomposition — exposing graph operations as separate MCP tools rather than hidden internal pipeline stages gives the LLM explicit control over retrieval strategy.

[SOURCE: graphrag_mcp/server.py, graphrag_mcp/__init__.py]

### 4.2 WiredBrain-Hierarchical-Rag

**Architecture:** Python system achieving 99.997% search space reduction (693K → 20K chunks) through 4-level hierarchical addressing `<Gate, Branch, Topic, Level>` with a SetFit neural classifier (<50ms).

**Key Innovations:**

1. **Hierarchical Pre-Filtering:** SetFit classifier routes queries to specific domain gates BEFORE vector search executes. This eliminates "context collision" where irrelevant but semantically similar documents crowd out results.

2. **Fusion Formula:** `score = 0.5 * vector_sim + 0.3 * graph_score + 0.2 * quality_score` — explicit weights combining three signals with a static quality score (content authority independent of query).

3. **Transparent Reasoning Module (TRM):** Gaussian Confidence Check analyzes the DISTRIBUTION of retrieval scores. If the top match falls below a dynamically computed threshold, the system aborts RAG injection and instructs the LLM to synthesize from first principles: `[EVIDENCE GAP DETECTED]`.

4. **Quality Score (Static Authority):** A query-independent content quality metric that boosts well-structured, well-sourced memories regardless of query similarity. [Assumes: equivalent to our `quality_score` column in v15 schema]

**Applicable Patterns:**
- TRM evidence gap detection → directly applicable as post-RRF confidence check
- Quality score as static authority signal → our v15 `quality_score` column exists but isn't used in search scoring
- Spec folder pre-filtering → our `spec_folder` column is an underutilized "gate"

[SOURCE: WiredBrain docs/ARCHITECTURE.md, docs/EVALUATION_RESULTS.md, src/retrieval/hybrid_retriever_v2.py]

### 4.3 RAGFlow (infiniflow/ragflow)

**Architecture:** Production-grade RAG engine with the most sophisticated retrieval pipeline of the three. Supports Elasticsearch, Infinity, and Qdrant as backends. Written in Python with 500K+ LOC.

**Key Innovations:**

1. **Two-Stage Retrieval:**
   - Stage 1 (Broad Recall): Loose thresholds, `min_match=0.3`, similarity floor 0.17. Optimizes for NOT missing relevant documents.
   - Stage 2 (Tight Reranking): Multi-factor scoring combining vector similarity (70% weight), token overlap with field-specific multipliers, PageRank, and tag relevance with Laplace smoothing.

2. **Field-Specific Token Multipliers:**
   ```python
   # From rag/nlp/search.py
   title_match_weight = 10    # Title matches worth 10x body matches
   anchor_match_weight = 30   # Anchor/trigger matches worth 30x
   ```
   This ensures that a query matching a memory's title or trigger phrase is dramatically boosted over a body-text match.

3. **PageRank Authority Score:** A query-independent authority metric computed from document linkage structure. Documents referenced by many other documents rank higher regardless of query similarity.

4. **Adaptive Fallback Thresholds:**
   ```python
   # If initial search returns 0 results, retry with relaxed thresholds
   if len(results) == 0:
       min_match = 0.1  # was 0.3
       similarity_threshold = 0.17  # was 0.5
       # Re-run search
   ```
   Simple but eliminates the frustrating "no results found" failure mode.

5. **Tag Relevance with Laplace Smoothing:** Documents tagged with terms matching the query receive a relevance boost. Laplace smoothing prevents zero-probability for unseen tags.

**Applicable Patterns:**
- Two-stage retrieval (broad + tight) → restructures our single-pass pipeline
- Adaptive fallback thresholds → zero-effort win
- Field-specific token multipliers → boost trigger_phrases and title matches
- PageRank from causal edge in-degree → uses existing `causal_edges` table

[SOURCE: RAGFlow rag/nlp/search.py]

---
<!-- /ANCHOR:research-external-system-architectures-138 -->

<!-- ANCHOR:research-cross-system-pattern-synthesis-138 -->
## 5. Cross-System Pattern Synthesis

### 5.1 Converging Patterns (All 3+ Systems)

| Pattern | graphrag_mcp | WiredBrain | RAGFlow | Our System |
|---------|-------------|------------|---------|------------|
| Multi-signal fusion | Separate tools | 3-weight formula | 2-stage + PageRank | RRF (vector+FTS+BM25) |
| Graph integration | Neo4j (primary) | Graph score (0.3w) | PageRank (authority) | Causal boost (post-retrieval) |
| Pre-filtering | None | Hierarchical (SetFit) | min_match threshold | spec_folder (underutilized) |
| Quality/authority score | None | Static quality (0.2w) | PageRank | quality_score (unused in search) |
| Confidence gating | None | TRM + Gaussian | None | Prediction error gate (write-only) |
| Diversity | None | None | None | None (critical gap) |

### 5.2 Unique Advantages of Our System (No Competitor Matches)

1. **FSRS Temporal Decay** — Cognitive science-based memory aging. No other system models "forgetting."
2. **Single-File SQLite Deployment** — Zero infrastructure. Competitors require Neo4j, Qdrant, Elasticsearch.
3. **22-Tool MCP Surface** — Most comprehensive tool set of any memory MCP server.
4. **6 Typed Causal Edges** — Richer relationship model than graphrag_mcp's generic edges.
5. **Cognitive Layer** — Working memory, attention decay, co-activation, prediction error gating.
6. **Constitutional Pinning** — Always-include tier for system rules, unique to our architecture.

### 5.3 Search Flow Comparison

**Current System (Single-Pass):**
```
Query → Embed → Vector+FTS+BM25 (parallel) → RRF Fusion → Post-Boost → Return
         └─ ~30-80ms total
```

**RAGFlow (Two-Stage):**
```
Query → Stage 1: Broad Recall (loose thresholds) → Candidate Pool (top-100)
                                                      │
         Stage 2: Multi-Factor Rerank ←──────────────┘
           ├─ Vector Similarity (70%)
           ├─ Token Overlap (field-weighted)
           ├─ PageRank (authority)
           └─ Tag Relevance (Laplace)
         → Final Top-K → Return
```

**Recommended Hybrid (Our Next Architecture):**
```
Query → Intent Classification → Adaptive Pre-Filter (spec_folder gate)
  │
  ├─ Stage 1: Tri-Hybrid Search (vector+FTS+BM25+graph)
  │    └─ Adaptive Fusion (intent-aware weights)
  │    └─ RRF Fusion → Top-20 Candidates
  │
  ├─ Stage 2: Multi-Factor Rerank
  │    ├─ Evidence Gap Detection (TRM) [P5]
  │    ├─ Enhanced Causal Boost (weighted edges) [P1]
  │    ├─ Field-Specific Boost (title 10x, triggers 30x)
  │    ├─ Quality/Authority Score
  │    └─ MMR Diversity Reranking [P4]
  │
  └─ Token Budget Enforcement → Return Top-5
       └─ ~55-165ms depending on mode
```

---
<!-- /ANCHOR:research-cross-system-pattern-synthesis-138 -->

<!-- ANCHOR:research-rrf-fusion-current-vs-enhanced-138 -->
## 6. RRF Fusion: Current vs. Enhanced

### 6.1 Current Implementation

[SOURCE: rrf-fusion.ts:128-175]

```typescript
// Current: fuseResultsMulti()
// Fixed weights: vector=1.0, FTS=0.8, BM25=0.6
// RRF score: 1/(k + rank + 1), k=60
// Convergence bonus: +0.10 for multi-source matches
// Graph weight boost: 1.5x (but graph source rarely active)
```

### 6.2 Gaps Identified

1. **Static Weights:** The vector=1.0, FTS=0.8, BM25=0.6 weights are hardcoded. The `adaptive-fusion.ts` module exists to make these dynamic but isn't wired in.

2. **No Term Match Bonus:** RAGFlow applies field-specific multipliers (title=10x, anchor=30x). Our RRF has a `termMatchBonus` concept in `fuseScoresAdvanced()` (line 176) but it's simplistic.

3. **No Authority Signal:** Neither quality_score nor in-degree (PageRank equivalent) is incorporated into fusion scoring.

4. **No Diversity Pass:** After RRF, the top results may be heavily redundant. No MMR or diversity mechanism exists.

---
<!-- /ANCHOR:research-rrf-fusion-current-vs-enhanced-138 -->

<!-- ANCHOR:research-intent-classification-keyword-vs-semantic-138 -->
## 7. Intent Classification: Keyword vs. Semantic

### 7.1 Current Implementation

[SOURCE: intent-classifier.ts:152-221]

The classifier uses pure keyword/regex matching across 7 intents:
```
Combined score = keywordScore * 0.6 + patternScore * 0.4
Minimum confidence: 0.08
```

### 7.2 Comparison

| Feature | Our System | WiredBrain | RAGFlow |
|---------|-----------|------------|---------|
| Method | Keyword + regex | SetFit neural classifier | Query analysis + heuristics |
| Intents | 7 fixed types | Domain-specific gates | N/A (query-dependent) |
| Latency | <1ms | <50ms | ~5ms |
| Accuracy | Medium (keyword match) | High (neural) | Medium (rule-based) |
| Adaptation | Static patterns | Trainable model | Static rules |

### 7.3 Recommendation

At our corpus size (50-500 memories), the keyword classifier is adequate. The WiredBrain SetFit approach is overkill (requires Python runtime, training data, model serving). Instead, enhance the existing classifier with:
1. **Embedding-based intent prototypes** — Compare query embedding to pre-computed intent centroids using the existing embedding infrastructure
2. **Query complexity estimation** — Short queries (<5 tokens) get `mode=quick`; long analytical queries get `mode=deep`

---
<!-- /ANCHOR:research-intent-classification-keyword-vs-semantic-138 -->

<!-- ANCHOR:research-causal-graph-current-vs-advanced-138 -->
## 8. Causal Graph: Current vs. Advanced

### 8.1 Current Implementation

[SOURCE: causal-boost.ts:74-103, causal-edges.ts:202-300]

- **Traversal:** 2-hop bidirectional BFS via `WITH RECURSIVE` CTE
- **Seed:** Top 25% of results (max 5)
- **Boost:** 0.05/hop, max combined 0.20
- **Injection:** Unseen neighbors at 50% of lowest score
- **Relationship types:** All 6 types treated equally
- **Edge strength:** `strength REAL DEFAULT 1.0` column exists but is IGNORED in boost computation

### 8.2 GraphRAG Comparison

graphrag_mcp uses Neo4j for graph operations with dedicated MCP tools:
- `traverse_path` — Explicit graph path queries
- `add_relations` — Typed relationship creation
- **Community Detection** — Leiden algorithm for hierarchical clustering

Our system lacks:
1. **Community detection** — No clustering of related memories
2. **Subgraph extraction** — No ability to extract a relevant subgraph as context
3. **Relationship-type-aware scoring** — All edge types scored identically
4. **Edge strength utilization** — The `strength` column is never read during search

### 8.3 Recommended Enhancement

**Weighted Graph Traversal** (Agent 3 finding: Feasibility 9/10, Impact 7/10):
```typescript
const RELATION_WEIGHTS = {
  supersedes: 1.5,   // Most important: indicates replacement
  caused: 1.3,       // High: indicates causation chain
  supports: 1.0,     // Baseline: corroborating evidence
  contradicts: 0.8,  // Lower: conflicting information (still valuable)
  derived_from: 1.1, // Medium: indicates ancestry
  enabled: 0.9       // Medium: indicates dependency
};

// Modify CTE to carry accumulated weight:
// boost = (edgeStrength * relationWeight) * (1 / hopDistance)
```

---
<!-- /ANCHOR:research-causal-graph-current-vs-advanced-138 -->

<!-- ANCHOR:research-performance-baseline-and-projections-138 -->
## 9. Performance Baseline and Projections

### 9.1 Current Latency Profile

| Operation | Latency (ms) | Source |
|-----------|-------------|--------|
| Intent classification | <1 | intent-classifier.ts (keyword matching) |
| Embedding generation | 100-500 | External API (Voyage/OpenAI) |
| Vector search | 10-50 | sqlite-vec, depends on corpus size |
| BM25 search | 1-10 | In-memory index |
| FTS5 search | 5-20 | SQLite virtual table |
| RRF fusion | 1-3 | In-memory computation |
| Causal boost | 10-20 | Recursive CTE SQL |
| Cross-encoder | 50-200 | External API (when enabled) |
| **Total (mode=auto)** | **30-80** | Parallel search + sequential post-processing |

### 9.2 Projected Latency with Enhancements

**Default mode (auto) — P1+P4+P5:**
```
Current:  30-80ms
+ P5 TRM Evidence Gap:     +0.5ms
+ P1 Enhanced Causal Boost: +5-15ms
+ P4 MMR Diversity:         +5-13ms
= Projected: 55-120ms
```

**Deep mode — ALL patterns:**
```
+ P3 Template Query Expansion: +5ms
+ 3x Parallel Tri-Hybrid:     +30-50ms (parallelized)
+ Cross-Variant RRF:          +3ms
= Projected: 105-165ms
```

Both projections are within acceptable thresholds (200ms for auto, 300ms for deep).

---
<!-- /ANCHOR:research-performance-baseline-and-projections-138 -->

<!-- ANCHOR:research-key-metrics-reference-table-138 -->
## 10. Key Metrics Reference Table

| Parameter | Current Value | Source |
|-----------|-------------|--------|
| Embedding dimension | 768/1024/1536 | vector-index-impl.ts:194-222 |
| RRF k parameter | 60 | rrf-fusion.ts:19 |
| RRF convergence bonus | 0.10 | rrf-fusion.ts:20 |
| Hybrid weights | vector=1.0, FTS=0.8, BM25=0.6 | hybrid-search.ts:352-365 |
| Max causal depth | 3 (chains), 2 (boost) | causal-edges.ts:23, causal-boost.ts:8 |
| Max causal boost | 0.05/hop, 0.20 combined | causal-boost.ts:9-10 |
| Session boost multiplier | 0.15 | session-boost.ts:8 |
| Working memory capacity | 7 | working-memory.ts:31 |
| Co-activation max hops | 2 | co-activation.ts:18 |
| Constitutional token budget | 2000 | vector-index-impl.ts:507 |
| Schema version | 15 | vector-index-impl.ts:319 |
| Intent types | 7 | intent-classifier.ts:26-34 |
| Causal relation types | 6 | causal-edges.ts:12-19 |
| Context modes | 5 | memory-context.ts:202-241 |

---
<!-- /ANCHOR:research-key-metrics-reference-table-138 -->

<!-- ANCHOR:research-source-inventory-138 -->
## 11. Source Inventory

### Codebase Files Analyzed (Agent 1)

| File | LOC | Key Findings |
|------|-----|-------------|
| `lib/search/hybrid-search.ts` | 430 | Graph channel disabled; static weights |
| `lib/search/vector-index-impl.ts` | 3,790 | Multi-dim support; decay at search-time |
| `lib/search/intent-classifier.ts` | 369 | Keyword/regex only; no semantic understanding |
| `lib/search/cross-encoder.ts` | 474 | Opt-in (default OFF); no diversity factor |
| `lib/search/rrf-fusion.ts` | 272 | Standard RRF; convergence bonus; term match |
| `lib/search/adaptive-fusion.ts` | 360 | Feature-flagged; not wired into pipeline |
| `lib/search/causal-boost.ts` | 237 | 2-hop BFS; ignores edge strength |
| `lib/search/session-boost.ts` | 210 | Attention-weighted; shares cap with causal |
| `lib/search/artifact-routing.ts` | 364 | 9 artifact classes; per-class weights |
| `lib/search/bm25-index.ts` | 312 | In-memory; simple stemmer |
| `lib/cognitive/co-activation.ts` | 296 | spreadActivation() exists but never called |
| `lib/cognitive/prediction-error-gate.ts` | 538 | Write-time only; not used for retrieval confidence |
| `lib/cognitive/working-memory.ts` | 682 | Session-scoped; Miller's Law capacity |
| `handlers/memory-context.ts` | 616 | L1 orchestration; 5 modes |
| `handlers/memory-search.ts` | 1,021 | L2 search; post-search pipeline |
| `tools/context-tools.ts` | 19 | Tool dispatch |

### External Repositories Analyzed (Agent 2)

| Repository | Focus | Key Pattern Extracted |
|-----------|-------|----------------------|
| graphrag_mcp | Graph + MCP integration | Tool decomposition; graph as separate tool |
| WiredBrain-Hierarchical-Rag | Hierarchical pre-routing | TRM evidence gap; quality authority score |
| RAGFlow | Production multi-engine RAG | Two-stage retrieval; adaptive fallback; field multipliers |

### Context Sources Analyzed

| Source | Type | Key Insight |
|--------|------|------------|
| reddit_post_1.md | Discussion | Tri-Hybrid (SQL+Vector+Sparse) is the production pattern |
| reddit_post_2.md | Article | RAG Fusion multi-query + RRF + MMR theory |
| research_final/ | Prior research | Unified theory document (validated by this round) |
<!-- /ANCHOR:research-source-inventory-138 -->

