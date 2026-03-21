# Research Dimension D1: Advanced Fusion & Scoring Intelligence

> Mode: Deep | Framework: CRAFT | Perspectives: 5/5 | CLEAR: 43/50

## System Context

You are researching a production Hybrid RAG Fusion system built in TypeScript with SQLite (better-sqlite3 + sqlite-vec + FTS5). The system retrieves from a corpus of hundreds to low thousands of structured markdown documents (spec-kit memories, not web pages).

**4-Stage Retrieval Pipeline:**
- **Stage 1 — Candidate Generation**: Executes 4 retrieval channels in parallel, then fuses via RRF
- **Stage 2 — Fusion & Scoring**: Single scoring point applying 12 signals (session boost, causal boost, co-activation, community co-retrieval, graph signals, FSRS write-back, intent weights, artifact routing, feedback signals, validation metadata)
- **Stage 3 — Reranking**: Optional cross-encoder, MMR diversity reranking
- **Stage 4 — Filtering**: Read-only (architectural invariant: no score changes). Quality threshold, tier limiting, chunk reassembly, context budget

**4 Retrieval Channels:**
1. Vector Search — sqlite-vec, 768-dim embeddings (Voyage 1024, OpenAI 1536 supported)
2. FTS5 Search — SQLite FTS5 with weighted BM25 (title=10x, triggers=5x, path=2x, content=1x)
3. BM25 Search — In-memory BM25 index with per-field weighting
4. Graph Search — Causal relationship traversal via `causal_edges` table

**Current Fusion:**
- Reciprocal Rank Fusion (RRF) with k=60 (Cormack et al., SIGIR 2009)
- `rrfScore = Σ 1/(k + rank_i)` per channel
- Convergence bonus: +0.10 flat when result appears in ≥2 channels
- Graph weight boost: 1.5x for curated causal edges
- Per-source min-max normalization before fusion
- Deterministic stable sort after fusion

**Adaptive Fusion (intent-aware):**
- Intent classifier routes to: understand, fix_bug, add_feature (+ others)
- Per-intent lambda mapping adjusts channel contributions (diversity vs relevance tradeoff)
- Applied as post-hybrid weight adjustment in Stage 2, not pre-fusion

**RSF (Relative Score Fusion):**
- Was implemented as shadow/eval mode — comparing RSF vs RRF scores
- Sprint 8 removed the runtime path entirely — RSF is now dead code
- RSF preserves score magnitude information that RRF discards

## Current Reality (Feature Catalog Excerpts)

- **RRF K-Value Sensitivity Analysis** (feature 11-08): Investigation planned but not yet executed. Default k=60 is empirical, not data-driven for this corpus.
- **Relative Score Fusion in Shadow Mode** (feature 12-02): Was shadow-mode evaluation. Runtime path removed in Sprint 8. No production data was collected comparing RSF vs RRF.
- **Scoring and Fusion Corrections** (feature 11-13): Applied corrections for double-counting, magnitude mismatch (was 15:1 between channels), and per-source normalization.
- **Adaptive Fusion** (implemented): Intent-aware weighting via `adaptive-fusion.ts`. 7 intent classes map to lambda values.

## Research Questions

1. **RRF vs RSF vs Learned Fusion**: Under what query conditions does RSF outperform RRF for structured document retrieval? Should RSF be resurrected from dead code? What is the state of art in learned fusion (Condorcet, neural fusion, score-distribution-aware fusion)?

2. **K-Value Optimization**: Is k=60 optimal for a 4-channel system with heterogeneous score distributions? How should k vary by channel count, corpus size, or query type? What does the literature say about adaptive k?

3. **Convergence Bonus Calibration**: The +0.10 flat bonus for multi-channel convergence is uncalibrated. Should it be proportional to the number of converging channels? Per-channel calibrated? What is the empirical evidence for convergence bonuses in hybrid search?

4. **Signal Weighting**: The 12 Stage 2 scoring signals appear to have static weights. Should they be learned? What feature importance analysis approaches work for retrieval scoring signals? How to prevent overfitting at small corpus scale?

5. **Graph Channel Integration**: The graph boost is 1.5x flat. How should graph channel weight scale with graph density, edge type quality, and query specificity? When should graph be promoted vs demoted?

6. **Per-Query Fusion Strategy Selection**: Can the intent router (7 classes) dynamically select not just channel weights but entire fusion strategies (RRF for some queries, RSF for others, weighted combination for others)?

## Constraints

- TypeScript/SQLite implementation (no external services except optional embedding API)
- ~15 feature flags available for experimentation and gradual rollout
- Corpus: hundreds to low thousands structured markdown documents
- Single developer implementation capacity — size recommendations as S (days), M (weeks), L (months)
- Must be backwards-compatible via feature flags
- Evidence-based: cite papers, benchmarks, or comparable systems for every recommendation

## Output Format

1. **Executive Summary** (3-5 bullet points of key findings)
2. **State of Art Survey** (what modern hybrid retrieval systems do for fusion — cite papers and systems)
3. **Gap Analysis** (current system vs state of art, with severity ratings)
4. **Recommendations** (priority-ordered, each with: description, rationale, effort size S/M/L, implementation sketch in TypeScript pseudocode, expected impact on MRR@5/NDCG@10/Recall@20, feature flag name)
5. **Risk Assessment** (what could go wrong with each recommendation)
6. **Cross-Dimensional Dependencies** (how fusion improvements connect to Query Intelligence D2, Graph Retrieval D3, Feedback Learning D4, and UX D5)
