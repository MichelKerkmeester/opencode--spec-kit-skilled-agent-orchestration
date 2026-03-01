# Technical Analysis: Cross-System Deep Dive — Hybrid RAG Patterns for Memory MCP

> **Spec:** 138-hybrid-rag-fusion | **Round:** research_5
> **Date:** 2026-02-20 | **Status:** Complete
> **Sources:** graphrag_mcp, WiredBrain-Hierarchical-Rag, ragflow, Reddit posts (2), system-speckit codebase

---

<!-- ANCHOR:research-executive-summary-138 -->
## 1. Executive Summary

This analysis represents the fifth and deepest research round for spec 138, conducted after confirming that the system-speckit memory MCP server has already implemented many Phase 1-3 recommendations from prior rounds (hybrid search with RRF, FTS5, BM25, causal graph, FSRS cognitive memory). The focus shifts from "what to build" to "what's broken, disconnected, or underperforming" — identifying specific gaps between the implemented architecture and the patterns observed in three production-grade RAG systems.

**Central Finding:** The system-speckit MCP server possesses more architectural components than any single reference system, but suffers from **integration fragmentation** — advanced modules exist in isolation without being wired into the primary search pipeline. Specifically: adaptive fusion is implemented but disconnected, graph search is structurally supported but operationally disabled, and MMR diversity exists only as a heuristic proxy within the vector layer rather than as a post-fusion pipeline stage.

The three analyzed repositories reveal that the competitive edge in modern RAG is not in having more components, but in **orchestration quality** — how retrieval stages compose, how confidence propagates through the pipeline, and how the system degrades gracefully when evidence is insufficient.

---
<!-- /ANCHOR:research-executive-summary-138 -->

<!-- ANCHOR:research-cross-system-architecture-comparison-138 -->
## 2. Cross-System Architecture Comparison

### 2.1 The System-Speckit Memory MCP Server (Current State)

The current system is the most feature-rich of all analyzed systems, with 22 MCP tools across L1-L4 orchestration layers, powered by SQLite + sqlite-vec + FTS5. Key components:

| Component | Status | Integration |
|-----------|--------|-------------|
| Vector search (sqlite-vec) | Operational | Primary retrieval path |
| FTS5 full-text search | Operational | Parallel with vector |
| BM25 lexical search | Operational | Sequential after FTS5 |
| RRF fusion (k=60) | Operational | Merges vector + FTS + BM25 |
| Causal graph (6 relations, 2-hop) | Operational | Post-retrieval boost only |
| FSRS spaced repetition | Operational | Decay scoring |
| Working memory (7-item Miller's Law) | Operational | Session-scoped |
| Adaptive fusion (intent-aware weights) | **Implemented but disconnected** | Not in main pipeline |
| MMR diversity | **Heuristic proxy only** | Vector layer only |
| Query expansion | **Not implemented** | — |
| Confidence scoring (TRM) | **Not implemented** | — |

[SOURCE: hybrid-search.ts:324-381, adaptive-fusion.ts:272-348, vector-index-impl.ts:2687-2725]

### 2.2 graphrag_mcp — Thin MCP Wrapper (13 files, 390 lines total)

The simplest architecture. A Python MCP server wrapping Neo4j (graph) + Qdrant (vectors). Its value lies in the **MCP resource pattern** — exposing graph schema and collection metadata as discoverable resources (`@mcp.resource("graphrag://schema/neo4j")`), allowing LLMs to understand the knowledge structure before querying.

**Novel pattern:** Relevance-by-path-frequency scoring: graph expansion scores documents by `count(*)` of distinct paths reaching them, creating a natural PageRank-like signal from graph topology.

[SOURCE: graphrag_mcp/server.py:42-83, documentation_tool.py:98-145]

### 2.3 WiredBrain-Hierarchical-Rag — Production Pipeline (HIGHEST VALUE)

A 6-stage production pipeline achieving 13x latency reduction and 99.9% search space reduction on 4GB VRAM hardware. Three patterns stand out:

**Hierarchical Pre-filtering:** The `retrieve_by_hierarchy()` method filters by Gate/Branch/Topic/Level via SQL WHERE clauses *before* any vector search executes. This reduces the candidate set from 693K to ~20 chunks, eliminating "context collision" where semantically similar but irrelevant documents crowd out accurate results.

```python
# hybrid_retriever_v2.py:55-116
WHERE gate_id = %s AND depth BETWEEN %s AND %s AND difficulty_id <= %s
```

**Quality-Weighted Fusion:** Instead of equal-weight RRF, WiredBrain uses NDCG-optimized weights calibrated on 500 validation queries: `0.5 * vector_score + 0.3 * graph_score + 0.2 * quality_score`. The graph score itself decomposes into prerequisite coverage (40%), example availability (30%), and verifier presence (30%).

[SOURCE: hybrid_retriever_v2.py:474-478, 570-592]

**Transparent Reasoning Module (TRM):** Multi-temperature sampling at [0.2, 0.4, 0.6, 0.8] with Jaccard similarity measurement. When variance < 0.05, the system is confident; when variance is high, it triggers an `EVIDENCE GAP DETECTED` fallback. This prevents silent hallucination from low-quality retrieval.

[SOURCE: trm_engine_v2.py:295-351]

**Entity Extraction Pipeline:** GLiNER (`urchade/gliner_medium-v2.1`) with 20 entity types and threshold 0.5, combined with spaCy noun chunks and LLM-based relation extraction across 16 constrained relation types. Followed by Louvain community detection via NetworkX.

[SOURCE: stage4_5_kg_extraction.py:179-365]

### 2.4 RAGFlow — Enterprise-Scale Orchestration (73.4K GitHub stars)

A DAG-based ingestion pipeline with deep document parsing (MinerU/Docling for vision-based structure extraction). Three actionable patterns:

**Multi-Field Weighted FTS5:** RAGFlow assigns dramatically different weights per field: `title_tks^10`, `important_kwd^30`, `content_ltks^2`. This is directly implementable in SQLite FTS5 via the `bm25()` function with column weights:

```sql
SELECT *, bm25(memories_fts, 10.0, 5.0, 1.0) as weighted_rank
FROM memories_fts WHERE memories_fts MATCH ?
ORDER BY weighted_rank;
-- Column weights: title=10x, trigger_phrases=5x, content=1x
```

**PageRank as Ranking Feature:** The `Dealer` class computes: `rank = dot(tag_vector, query_tag_vector) * 10 + pagerank_score`. PageRank provides a query-independent authority signal — memories that are frequently referenced (high in-degree in the causal graph) get a static boost regardless of query similarity.

**Adaptive Fallback Thresholds:** Two-pass search with strict thresholds first (`min_match=0.3`), falling back to relaxed thresholds (`min_match=0.1`) if zero results are returned. This eliminates the zero-result failure mode that frustrates users.

[SOURCE: ragflow/rag/svr/search.py, ragflow/rag/svr/query.py]

---
<!-- /ANCHOR:research-cross-system-architecture-comparison-138 -->

<!-- ANCHOR:research-critical-gap-analysis-what-s-broken-or-disconnected-138 -->
## 3. Critical Gap Analysis: What's Broken or Disconnected

### 3.1 The Adaptive Fusion Disconnect (P0)

The most impactful finding: `adaptive-fusion.ts` implements intent-aware weighted RRF with 6 intent profiles, a dark-run A/B testing mode, and a feature flag (`SPECKIT_ADAPTIVE_FUSION`). This module is **not wired into the main search pipeline**. The `hybridSearchEnhanced()` function in `hybrid-search.ts:324-381` still uses static weights (vector=1.0, FTS=0.8, BM25=0.6).

[Assumes: The adaptive fusion module was developed as a prototype but never integrated — possibly due to the complexity of threading intent classification results through the search pipeline.]

**Impact:** Every search query uses suboptimal static weights. An `understand` intent query receives the same vector/FTS/BM25 balance as a `fix_bug` query, even though exploratory queries benefit from higher FTS diversity while precise queries benefit from stronger vector weighting.

### 3.2 Graph Search as Post-Boost Only (P1)

The `useGraph` option defaults to `false` in `HybridSearchOptions` [hybrid-search.ts:31]. The causal graph is used exclusively for post-retrieval boosting (`causal-boost.ts:142-222`) — it multiplies existing result scores and injects neighbor rows at 50% of the lowest score. It is never used as a **first-class retrieval source** feeding results into RRF alongside vector/FTS/BM25.

**Impact:** Causally-relevant memories with low lexical/semantic overlap to the query are invisible. If memory A caused memory B, and the user queries about A's effects, B may not appear in vector or FTS results. The causal graph knows about B, but because graph retrieval isn't a RRF source, B only appears if A is already retrieved.

### 3.3 MMR Diversity Gap (P1)

The `apply_diversity()` function in `vector-index-impl.ts:2687-2725` uses a heuristic proxy: spec_folder match scores 0.8 similarity, same-date scores 0.5. It does **not** compute actual embedding cosine similarity between candidates. Furthermore, this diversity filter operates only within the vector search layer — it is not applied post-fusion.

**Impact:** The final result set returned to the LLM may contain 5 highly similar memories from different retrieval sources (vector found them all, FTS found them all, RRF ranked them all highly). Without post-fusion MMR, the 2000-token budget is wasted on redundant context.

### 3.4 No Query Expansion (P0)

There is no implementation of multi-query generation, synonym expansion, HyDE (Hypothetical Document Embeddings), or any form of query augmentation. A single user query maps to a single embedding and a single FTS/BM25 search string.

**Impact:** Recall is bottlenecked by the user's exact phrasing. If the memory uses "authentication" but the query says "login flow," vector similarity may bridge the gap, but FTS5 and BM25 will miss entirely. With 3 sources (vector, FTS, BM25), the convergence bonus in RRF rewards multi-source hits — but without query expansion, FTS and BM25 rarely match on paraphrased queries, reducing convergence signal.

---
<!-- /ANCHOR:research-critical-gap-analysis-what-s-broken-or-disconnected-138 -->

<!-- ANCHOR:research-cross-system-pattern-synthesis-138 -->
## 4. Cross-System Pattern Synthesis

### 4.1 The "Confidence Propagation" Pattern

WiredBrain's TRM, RAGFlow's adaptive thresholds, and the Reddit tri-hybrid discussion all converge on a single insight: **retrieval systems must know when they don't know**. The current system has no mechanism to communicate retrieval confidence to the LLM consumer.

The prediction-error-gate.ts handles write-time conflict detection (8 contradiction patterns, 4 similarity thresholds), but nothing analogous exists at search-time. The MCP response includes rich metadata (`retrievalTrace`, `appliedBoosts`, `rerankMetadata`) but no confidence score or evidence gap warning.

**Synthesis:** Implement a lightweight confidence scorer operating on RRF score distributions. Score gap analysis (large gap between top-1 and top-2 indicates high confidence), score entropy (low entropy = concentrated relevance), and score clustering (bimodal distribution = clear relevant/irrelevant separation). Inject as `trm.confidence` in the MCP response metadata.

### 4.2 The "Pre-Filter Then Search" Pattern

Both WiredBrain (hierarchical addressing) and RAGFlow (metadata filtering) demonstrate that reducing the search space before expensive operations is the single highest-impact optimization. The current system filters by `importance_tier` and `state` (HOT/WARM/COLD/DORMANT) but does not use spec-folder paths as a pre-filter gate.

**Synthesis:** Use the existing `spec_folder` column as a hierarchical pre-filter. When `memory_context` receives a query with spec folder context, pre-filter the FTS5 and vector search to that spec folder's memories first, expanding only if insufficient results are found.

### 4.3 The "Earned Authority" Pattern

RAGFlow's PageRank and WiredBrain's graph scoring both implement query-independent authority signals. In memory systems, frequently-referenced memories (high in-degree in the causal graph) are inherently more valuable — they represent foundational decisions that influence many subsequent memories.

**Synthesis:** Pre-compute a PageRank-like authority score on the causal_links table during `memory_manage` operations. Store as a column in `memory_index`. Add as a weighted signal to the RRF pipeline (small weight, ~0.1, to avoid dominating query-specific relevance).

---
<!-- /ANCHOR:research-cross-system-pattern-synthesis-138 -->

<!-- ANCHOR:research-technical-dependencies-and-constraints-138 -->
## 5. Technical Dependencies and Constraints

### 5.1 SQLite Constraints

- **Recursive CTE depth:** No hard limit, but bidirectional traversal doubles branching factor per hop. Safe up to 3 hops with LIMIT clauses; risky beyond that.
- **FTS5 column weights:** Natively supported via `bm25()` function — zero dependency cost for multi-field weighting.
- **Synchronous I/O:** better-sqlite3 blocks the event loop. Graph traversals beyond 3 hops on dense graphs (>5000 edges) risk perceptible UI lag.

### 5.2 Available Dependencies

- `@huggingface/transformers` (^3.8.1) — already installed, enables ML-based intent classification via ONNX models if rule-based proves insufficient.
- `sqlite-vec` — already provides vector operations needed for true cosine-based MMR.
- No new dependencies required for Phase 1-2 improvements.

### 5.3 Compute Budget

| Operation | Current Latency | With Improvements |
|-----------|----------------|-------------------|
| Intent classification | <1ms (rule-based) | <1ms (enhanced rules) / 20-80ms (ML) |
| Vector search | 10-30ms | 10-30ms (unchanged) |
| FTS5 search | 5-15ms | 5-15ms (unchanged, but with column weights) |
| BM25 search | 5-15ms | 5-15ms (unchanged) |
| RRF fusion | <1ms | <2ms (with adaptive weights) |
| Causal boost | 5-10ms | 10-30ms (3-hop + graph-as-source) |
| MMR post-fusion | 0ms (not implemented) | <5ms (N=50, D=1024) |
| Query expansion | 0ms (not implemented) | +50-100ms (embedding generation for variants) |
| TRM confidence | 0ms (not implemented) | +5-15ms (statistical computation) |
| **Total pipeline** | **~30-70ms** | **~80-200ms** |

[Assumes: 2-3x latency increase is acceptable for coding agent use cases where quality > speed.]

---
<!-- /ANCHOR:research-technical-dependencies-and-constraints-138 -->

<!-- ANCHOR:research-key-learnings-138 -->
## 6. Key Learnings

1. **Integration > Implementation:** The system has more components than any reference system, but many are disconnected. The highest ROI improvements are wiring existing modules (adaptive fusion, graph-as-source) rather than building new ones.

2. **Confidence is not optional:** All three reference systems implement retrieval confidence mechanisms. Silent failure (injecting poor context without warning) is the primary cause of LLM hallucination in RAG systems.

3. **FTS5 column weights are free performance:** RAGFlow's multi-field weighting (`title^10`, `keywords^30`, `content^2`) is directly implementable in SQLite FTS5 at zero dependency cost. The current system treats all FTS5 fields equally.

4. **Pre-filtering > post-filtering:** Reducing the search space before expensive operations (as WiredBrain demonstrates) provides 13x latency improvement and eliminates context collision. The existing spec_folder metadata enables this pattern.

5. **Authority signals complement similarity:** PageRank-like scores on the causal graph provide a query-independent quality signal that pure similarity search cannot capture. Foundational decisions that influence many memories should rank higher.

6. **MMR is mandatory for token-constrained systems:** With a ~2000 token budget, sending 5 highly similar memories is catastrophically wasteful. Post-fusion MMR with intent-adaptive lambda values ensures maximum information density per token.

---
<!-- /ANCHOR:research-key-learnings-138 -->

<!-- ANCHOR:research-appendix-source-reference-index-138 -->
## 7. Appendix: Source Reference Index

| Source | Type | Key Patterns Extracted |
|--------|------|----------------------|
| graphrag_mcp/server.py | GitHub repo | MCP resource pattern, path-frequency scoring |
| WiredBrain/hybrid_retriever_v2.py | GitHub repo | Hierarchical pre-filtering, quality-weighted fusion, multi-gate retrieval |
| WiredBrain/trm_engine_v2.py | GitHub repo | TRM confidence scoring, Gaussian Confidence Check |
| WiredBrain/stage4_5_kg_extraction.py | GitHub repo | GLiNER NER, Louvain communities, LLM triplet extraction |
| ragflow/rag/svr/search.py | GitHub repo | PageRank ranking, adaptive fallback thresholds |
| ragflow/rag/svr/query.py | GitHub repo | Multi-field weighted FTS5 |
| Reddit post 1 | Discussion | Tri-hybrid SQL+Vector+Sparse pattern |
| Reddit post 2 | Article | RAG Fusion, RRF mathematics, MMR theory |
| hybrid-search.ts | Codebase | Static weights, disabled graph search |
| adaptive-fusion.ts | Codebase | Disconnected intent-aware fusion |
| causal-boost.ts | Codebase | Post-retrieval-only graph boost |
| vector-index-impl.ts | Codebase | Heuristic MMR proxy |
| rrf-fusion.ts | Codebase | RRF k=60, convergence bonus |
| intent-classifier.ts | Codebase | Rule-based 7-intent classification |
| memory-search.ts | Codebase | Post-search pipeline, intent weight application |
<!-- /ANCHOR:research-appendix-source-reference-index-138 -->

