---
title: "Decision Record: 138-hybrid-rag-fusion [002-hybrid-rag-fusion/decision-record]"
description: "Context: The RAG pipeline requires Tri-Hybrid execution (Dense, Sparse, Graph), leading to initial assumptions that the system must migrate to Qdrant (vectors), Neo4j (graph), a..."
trigger_phrases:
  - "decision"
  - "record"
  - "138"
  - "hybrid"
  - "rag"
  - "decision record"
  - "002"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Decision Record: 138-hybrid-rag-fusion

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR: decision-architecture-138 -->
## D1: Utilizing Native SQLite over External Databases
**Context:** The RAG pipeline requires Tri-Hybrid execution (Dense, Sparse, Graph), leading to initial assumptions that the system must migrate to Qdrant (vectors), Neo4j (graph), and Elasticsearch (BM25 keyword search) to achieve scale.
**Decision:** Maintain the v15 SQLite database schema exclusively.
**Rationale:** 
1. SQLite `FTS5` provides enterprise-grade, high-performance BM25 sparse retrieval natively. 
2. SQLite `sqlite-vec` extension handles dense embeddings locally with SIMD acceleration. 
3. SQLite `WITH RECURSIVE` CTEs execute incredibly fast 2-hop graph traversals. 
Keeping the stack strictly inside SQLite guarantees zero schema migrations, avoids massive distributed-transaction logic (preventing orphaned records across 3 different database platforms), and keeps the MCP server hyper-portable for offline and edge deployment. The administrative overhead of managing Neo4j for a local memory MCP is unacceptable.
<!-- /ANCHOR: decision-architecture-138 -->

<!-- ANCHOR: decision-fusion-algorithm-138 -->
## D2: Reciprocal Rank Fusion (RRF) over Min-Max Scaling
**Context:** The MCP server must fuse scores from FTS5 (BM25 scores are unbounded [0, ∞)) and Vector search (Cosine embeddings are bounded [-1, 1]). Normalizing these via standard mathematics is virtually impossible due to score compression.
**Decision:** Exclusively use Ordinal Reciprocal Rank Fusion (`Σ 1 / (60 + rank)`).
**Rationale:** Attempting to mathematically normalize highly divergent score distributions (Min-Max scaling) introduces extreme volatility and breaks down entirely when one search method returns anomalous spikes. RRF bypasses the absolute scores entirely, focusing solely on the ordinal rankings. A document that ranks 3rd in Vector and 2nd in FTS5 receives a massive cumulative score. This protects the system from extreme outliers and guarantees highly reliable consensus matching across completely disjointed data structures.
<!-- /ANCHOR: decision-fusion-algorithm-138 -->

<!-- ANCHOR: decision-diversity-138 -->
## D3: Post-Fusion Maximal Marginal Relevance (MMR)
**Context:** Standard vector search frequently returns 5 near-identical versions of the same file or implementation summary. This wastes the strict 2000-token LLM payload budget of the MCP server, directly contributing to "Lost in the Middle" LLM amnesia.
**Decision:** Introduce true cosine-similarity MMR logic *after* RRF fusion, written in pure TypeScript.
**Rationale:** Sending redundant information severely dilutes the LLM's attention mechanism. MMR mathematically penalizes candidates that are too semantically similar to documents already selected for the final payload. This squeezes maximum informational diversity into the smallest possible token footprint. 

**Rejection of Vector-Level MMR:** We rejected running MMR at the database level because we need to calculate MMR on the *fused* array (which contains FTS5 and Graph results, not just vectors). The O(N²) calculation cost of doing this in TypeScript is completely mitigated because it only runs on the top-20 truncated RRF candidates (N=20). 20² = 400 operations, which executes in <2ms in Node.js, eliminating any risk of blocking the single-threaded event loop.
<!-- /ANCHOR: decision-diversity-138 -->

<!-- ANCHOR: decision-query-expansion-138 -->
## D4: Server-Side Template Expansion over LLM Expansion
**Context:** RAG Fusion (Multi-Query Retrieval) requires generating 3 derivative queries from the user's single prompt to maximize recall and bypass vocabulary mismatch. Typically, this is done by prompting a fast LLM.
**Decision:** Use a rule-based/template-based synonym and decomposition generator on the server side instead of an LLM.
**Rationale:** The **"LLM-in-MCP Paradox"** states that the MCP server is called *by* the LLM. If the MCP server pauses to call an LLM internally to generate query variants, it introduces a circular dependency, and network latency skyrockets into the multi-second range (breaking the 120ms max-latency budget for `mode="auto"`). Template-based regex rules and domain vocabularies add <5ms overhead, keeping the system highly responsive while still achieving the recall benefits of multi-query routing.
<!-- /ANCHOR: decision-query-expansion-138 -->

<!-- ANCHOR: decision-graph-traversal-138 -->
## D5: BFS over DFS for Spreading Activation
**Context:** The `co-activation.ts` module traverses the memory graph to find temporally or contextually related memories.
**Decision:** Exclusively use Breadth-First Search (BFS) bounded by a hard `maxDepth=2` and `maxResults=20`.
**Rationale:** Depth-First Search (DFS) on an unconstrained causal graph risks "topic drift"—navigating so far down a causal chain that the retrieved memory has zero relevance to the user's initial query. BFS ensures that spreading activation stays strictly adjacent to the highly relevant "seed" nodes retrieved by the Tri-Hybrid search, pulling in immediate context rather than tangential history.
<!-- /ANCHOR: decision-graph-traversal-138 -->

## Context

This phase consolidates hybrid-retrieval intelligence features under strict latency and compatibility constraints.

## Consequences

- Positive: improved intent classification precision through centroid scoring.
- Positive: stronger evidence-based closure with explicit test coverage.
- Tradeoff: additional scoring internals increase module complexity slightly.

## D6: Consolidate Child Folders into Canonical 001/002 Layout

**Context:** The parent spec folder carried multiple active child folders and duplicate lifecycle surfaces, which made active-state ownership unclear after skill-graph deprecation.

**Decision:** Keep exactly two active children: `001-deprecated-skill-graph-experiment` and `002-hybrid-rag-fusion`; record merged non-lifecycle evidence in `002-hybrid-rag-fusion/supplemental/`.

**Rationale:** This removes duplicate active lifecycle surfaces, preserves evidence, and keeps deprecation and RAG tracks clearly separated.

**Consequences:**
- Positive: single canonical active RAG lifecycle set in `002-hybrid-rag-fusion`.
- Positive: deprecated skill-graph track remains isolated in `001-deprecated-skill-graph-experiment`.
- Tradeoff: historical references in legacy memory artifacts remain descriptive rather than authoritative.
