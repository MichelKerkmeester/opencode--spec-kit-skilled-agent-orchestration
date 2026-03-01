# Precision/Recall Benchmarks: Hybrid RAG Fusion

**Date:** 2026-02-20
**Scope:** Directional estimates for hybrid search pipeline quality improvement

---

## Methodology

- **Precision@5** = (relevant results in top 5) / 5
- **Recall@10** = (relevant results in top 10) / (total relevant documents in corpus)

These metrics measure retrieval quality at the ranked-list level. Precision captures how many top results are useful; recall captures how much of the total relevant corpus is surfaced.

---

## Baseline: Pre-Hybrid (Pure Vector Search)

| Metric | Estimated Value | Rationale |
|--------|----------------|-----------|
| Precision@5 | ~0.60 | Single-channel vector similarity. No keyword matching, no structural context. Semantic drift on technical terms (e.g., "AuthGuard" vs "authentication") reduces top-5 relevance. |
| Recall@10 | ~0.40 | Vector search misses exact keyword matches and structurally-connected documents that lack semantic overlap. No graph traversal to discover linked memories. |

**Limitations of pure vector search:**
- Misses exact keyword matches that BM25 would catch
- No structural/causal context (linked memories invisible)
- Semantic drift on domain-specific terms
- No redundancy removal (duplicate near-copies consume result slots)

---

## Post-Hybrid Estimates (FTS5 + Graph + MMR)

| Metric | Estimated Range | Rationale |
|--------|----------------|-----------|
| Precision@5 | 0.75 - 0.85 | Multi-channel fusion (vector + BM25 + graph) provides complementary signals. MMR removes redundant results, freeing slots for diverse relevant documents. Intent-weighted adaptive fusion selects optimal channel weights per query type. |
| Recall@10 | 0.60 - 0.70 | Graph channel surfaces structurally-connected results that pure vector misses. BM25 catches exact keyword matches. Multi-query expansion (up to 3 variants) broadens coverage. Co-activation spreads to temporal neighbors. |

### Component Contributions

| Component | Precision Impact | Recall Impact |
|-----------|-----------------|---------------|
| **FTS5 BM25** | +0.05-0.10 (exact keyword matches reduce noise) | +0.10-0.15 (catches terms vector search misses) |
| **Graph Channel** | +0.05-0.10 (structural relevance adds precision) | +0.10-0.15 (traverses causal/SGQS edges to linked docs) |
| **MMR Reranking** | +0.05-0.10 (removes redundancy, frees result slots) | Neutral (does not discover new results) |
| **Multi-Query Expansion** | Neutral to slight negative (more variants = more noise) | +0.05-0.10 (synonym/reformulation broadens coverage) |
| **Adaptive Fusion** | +0.05 (intent-matched weights reduce off-topic results) | +0.05 (correct channel emphasis surfaces more relevant) |
| **Co-Activation** | Neutral | +0.05 (temporal neighbors discovered) |

---

## Evidence (Qualitative)

1. **Graph channel fills structural gaps:** `createUnifiedGraphSearchFn()` queries both causal edges and SGQS skill graph. Memories linked via `supersedes`, `caused`, or skill-graph edges appear in results even with zero semantic overlap to the query. This directly improves recall.

2. **MMR removes redundancy:** `applyMMR()` with lambda=0.5 and N=20 hardcap eliminates near-duplicate results. In corpora with implementation summaries that share 80%+ content, this frees 1-2 result slots for genuinely different documents, improving precision.

3. **BM25 catches keyword matches:** SQLite FTS5 with `bm25(10.0, 5.0, 1.0, 2.0)` field weights ensures exact technical terms (class names, error codes, config keys) rank highly regardless of vector embedding similarity. Title matches weighted 10x over body.

4. **Adaptive fusion matches intent:** 6 intent profiles (technical, conceptual, procedural, debug, architectural, general) shift RRF weights to favor the most relevant channel per query type. Technical queries weight BM25 higher; conceptual queries weight vector higher.

5. **Evidence gap detection (TRM):** Z-score < 1.5 triggers explicit warning, preventing low-confidence results from being presented as authoritative. This is a precision guardrail rather than a retrieval improvement.

---

## Limitations and Future Work

**These are directional estimates, not measured values.** Full quantitative measurement requires:

1. **Labeled evaluation dataset** — A corpus of queries with ground-truth relevance judgments (e.g., 100 queries, each with manually labeled relevant/not-relevant documents).
2. **A/B comparison** — Run identical queries through pure-vector and hybrid pipelines, compare ranked results against ground truth.
3. **Statistical significance** — Sufficient query volume to establish confidence intervals on P@5 and R@10 differences.

This evaluation infrastructure is outside the current spec scope (138-hybrid-rag-fusion). A follow-up spec could establish:
- A labeled test corpus from existing memory databases
- Automated P@5/R@10 measurement in CI
- Regression detection for retrieval quality

---

## Summary

| Metric | Baseline (Vector Only) | Hybrid Estimate | Delta |
|--------|----------------------|-----------------|-------|
| Precision@5 | ~0.60 | ~0.80 | +0.20 |
| Recall@10 | ~0.40 | ~0.65 | +0.25 |

The hybrid pipeline is expected to improve both precision and recall through complementary multi-channel retrieval, redundancy removal, and structural graph traversal. Quantitative validation deferred pending labeled evaluation dataset.
