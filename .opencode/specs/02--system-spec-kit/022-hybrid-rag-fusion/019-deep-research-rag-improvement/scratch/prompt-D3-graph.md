# Research Dimension D3: Graph-Augmented Retrieval & Knowledge Structure

> Mode: Deep | Framework: CRAFT | Perspectives: 5/5 | CLEAR: 43/50

## System Context

You are researching graph-augmented retrieval for a production Hybrid RAG Fusion system. The system maintains a causal knowledge graph alongside vector/lexical indexes, built in TypeScript with SQLite.

**Graph Infrastructure:**
- `causal_edges` table: stores typed edges between memory documents (relations: CORRECTION, PREFERENCE, DEPENDS_ON, EXTENDS, etc.)
- Graph search channel: traverses causal edges to find related documents
- Graph weight boost: 1.5x flat in RRF fusion for graph-sourced results
- Community detection: BFS components + Louvain fallback (pre-computed, not live in Stage 2)
- Co-activation spreading: from top-5 search seeds, spread activation to graph neighbors
- Graph signals in Stage 2: momentum (N2a) + causal depth (N2b)
- Typed-weighted degree (R4): 5th RRF channel added in Sprint 1

**Current State:**
- Graph was completely broken (0% hit rate) in Sprint 0 — fixed by correcting ID format
- Edge density measurement implemented but the density question remains open
- Community detection assignments are "stale" — pre-computed, not refreshed on query
- Sprint 6b (centrality measures, sophisticated community detection) is GATED on a feasibility spike
- Entity extraction is not automated — edges are manually curated or inferred from spec-kit metadata
- TM-08 signal vocabulary: CORRECTION, PREFERENCE types were added in Sprint 1

**Feature Flags:**
- `SPECKIT_CAUSAL_BOOST` — graph-traversal amplification
- `SPECKIT_CO_ACTIVATION` — spreading activation from top results
- `SPECKIT_COMMUNITY_DETECTION` — N2c community co-retrieval
- `SPECKIT_GRAPH_SIGNALS` — graph momentum + depth signals

## Current Reality (Feature Catalog Excerpts)

- **Graph Signal Activation** (feature category 10): 11 features covering typed-degree channel, edge density measurement, co-activation tuning, signal vocabulary expansion, graph momentum, causal depth signals
- **Cross-Document Entity Linking** (feature 15-06): Planned but not implemented. Would create entity nodes linking across documents.
- **Community Detection** (implemented): BFS + Louvain. Pre-computed. Stale data risk identified but not addressed.
- **Auto-Entity Extraction** (Sprint 6b R10): GATED. Requires feasibility spike. Rule-based vs lightweight NER vs LLM-extracted not yet decided.

## Research Questions

1. **Sparse Graph Strategies**: For organically-grown knowledge graphs with low edge density (typical of memory systems), what retrieval strategies are most effective? Connected components vs Louvain vs label propagation vs spectral clustering? What's the minimum edge density for community detection to add value?

2. **Community Refresh Strategy**: Should community assignments be refreshed on write (when new edges are added), on query (live computation), or on schedule (background job)? What's the latency impact of each? What does the literature say about incremental community detection?

3. **Graph Enrichment at Save Time**: What should be extracted and linked when a new document is saved? Entity extraction (rule-based vs NER vs LLM), relation extraction, concept linking? How do GraphRAG (Microsoft), RAPTOR, and KG-RAG approach this?

4. **Typed Graph Traversal**: The system has typed edges (CORRECTION, PREFERENCE, DEPENDS_ON, EXTENDS). How should edge types affect traversal priority and scoring? Should different query intents follow different edge types? (e.g., fix_bug → CORRECTION edges, add_feature → EXTENDS edges)

5. **Graph Signal Calibration**: Graph momentum (N2a) and causal depth (N2b) are two of 12 Stage 2 signals. How should they be weighted relative to the other 10 signals? Is 1.5x graph boost in RRF empirically justified or should it be data-driven?

6. **Hybrid Graph-Vector Retrieval**: What are proven patterns for combining graph signals with vector similarity? How do RAPTOR (tree-of-abstractions), GraphRAG (community summaries), and ColBERT-based approaches handle this integration?

## Constraints

- SQLite database (no Neo4j, no dedicated graph DB)
- Graph operations must not exceed 50ms for typical queries
- Edge density is low and organic (not a curated knowledge base)
- TypeScript implementation, single-threaded (better-sqlite3)
- Size recommendations as S (days), M (weeks), L (months)
- Feature flags available for gradual rollout

## Output Format

1. **Executive Summary** (3-5 bullet points)
2. **State of Art Survey** (GraphRAG, RAPTOR, KG-RAG, hybrid graph-vector systems — cite papers and implementations)
3. **Gap Analysis** (current graph utilization vs state of art)
4. **Recommendations** (priority-ordered with: description, rationale, S/M/L size, implementation sketch, expected impact, feature flag name)
5. **Risk Assessment** (graph sparsity risks, computation costs, stale data risks)
6. **Cross-Dimensional Dependencies** (how graph improvements connect to Fusion D1, Query D2, Feedback D4, UX D5)
