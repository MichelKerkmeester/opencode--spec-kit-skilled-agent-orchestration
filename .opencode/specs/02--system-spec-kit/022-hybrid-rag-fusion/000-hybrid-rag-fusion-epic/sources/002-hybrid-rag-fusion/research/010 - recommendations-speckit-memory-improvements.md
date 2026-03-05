# Actionable Recommendations: System-Speckit Memory MCP Server Improvements

> **Spec:** 138-hybrid-rag-fusion | **Round:** research_5
> **Date:** 2026-02-20 | **Status:** Complete
> **Builds on:** research_final (unified analysis), codebase deep-dive, 3 GitHub repos, 2 Reddit posts

---

<!-- ANCHOR:decision-executive-summary-138 -->
## 1. Executive Summary

The system-speckit memory MCP server has reached a critical inflection point. It possesses more architectural components than any analyzed reference system (graphrag_mcp, WiredBrain, ragflow) — hybrid search with 4 retrieval methods, FSRS cognitive memory, causal graph, adaptive fusion module — but these components operate in partial isolation. The highest-ROI improvements are **integration-focused**, not feature-additive.

This document provides 12 specific, prioritized recommendations across 3 implementation phases. Phase 1 requires **zero new dependencies** and delivers the largest quality improvement by wiring existing disconnected modules into the primary search pipeline.

---
<!-- /ANCHOR:decision-executive-summary-138 -->

<!-- ANCHOR:decision-phase-1-wire-the-disconnected-architecture-days-1-5-138 -->
## 2. Phase 1: Wire the Disconnected Architecture (Days 1-5)

**Theme:** Maximum impact with minimum new code. Connect what already exists.

### R1. Activate Adaptive Fusion in Main Pipeline (P0)

**The Problem:** `adaptive-fusion.ts` implements intent-aware weighted RRF with 6 intent profiles and A/B testing capability. It is not called from `hybridSearchEnhanced()` in `hybrid-search.ts`, which uses static weights (1.0/0.8/0.6).

**The Fix:** Replace the static weight arrays in `hybridSearchEnhanced()` with a call to `hybridAdaptiveFuse()` from `adaptive-fusion.ts`, passing the detected intent from the upstream classifier. Enable via the existing `SPECKIT_ADAPTIVE_FUSION` feature flag.

**LOC:** ~50-80 (wiring, not new logic)
**Impact:** Intent-appropriate retrieval weighting for every query. Exploratory queries get FTS-heavy weights; precise queries get vector-heavy weights.
**Risk:** Low — module already has tests and A/B testing infrastructure.

### R2. Promote Graph to First-Class RRF Source (P1)

**The Problem:** `useGraph` defaults to `false`. Causal graph only applies post-retrieval boosts. Causally-related memories with low lexical/semantic overlap are invisible.

**The Fix:** Enable graph retrieval as a source in `fuseResultsMulti()` within `rrf-fusion.ts`. The causal-boost module already fetches 2-hop neighbors — pipe those results into RRF with the existing `GRAPH_WEIGHT_BOOST = 1.5` multiplier instead of applying them as post-retrieval score adjustments.

**LOC:** ~100-150
**Impact:** Memories connected by causal relationships surface even when query phrasing doesn't match their content.
**Risk:** Low-medium — may increase result set size; mitigate with strict hop limits.

### R3. Implement Post-Fusion MMR (P1)

**The Problem:** `apply_diversity()` uses heuristic proxy (spec_folder match = 0.8, same date = 0.5) and operates only within vector results. No post-fusion diversity enforcement.

**The Fix:** Implement true cosine-similarity MMR after RRF fusion. Pass embeddings through from vector search results (currently discarded after scoring). Apply intent-adaptive lambda: `understand`=0.5, `fix_bug`=0.8, `find_decision`=0.6.

```typescript
// Post-fusion MMR with intent-adaptive lambda
function postFusionMMR(
  results: SearchResult[],
  intent: IntentType,
  limit: number = 5
): SearchResult[] {
  const lambda = INTENT_LAMBDA_MAP[intent] ?? 0.7;
  // Select diverse top-K using actual embedding cosine similarity
  return selectDiverseMMR(results, lambda, limit);
}
```

**LOC:** ~150-200
**Impact:** Maximizes information density within the ~2000 token budget. Eliminates redundant memories in result sets.
**Risk:** Low — O(N²) cosine is <5ms for N≤50 with 1024d embeddings.

### R4. Add Multi-Field Weighted FTS5 (P0)

**The Problem:** FTS5 query treats all columns equally. Title matches and trigger phrase matches should score much higher than content body matches.

**The Fix:** Replace `MATCH` scoring with weighted `bm25()`:

```sql
SELECT *, bm25(memory_fts, 10.0, 5.0, 1.0, 2.0) as weighted_rank
FROM memory_fts WHERE memory_fts MATCH ?
ORDER BY weighted_rank;
-- Weights: title=10x, trigger_phrases=5x, file_path=1x, content_text=2x
```

**LOC:** ~20-30 (SQL query modification)
**Impact:** Title and trigger phrase matches dominate, improving precision for targeted queries.
**Risk:** Negligible — uses native FTS5 functionality.

---
<!-- /ANCHOR:decision-phase-1-wire-the-disconnected-architecture-days-1-5-138 -->

<!-- ANCHOR:decision-phase-2-add-missing-capabilities-days-6-15-138 -->
## 3. Phase 2: Add Missing Capabilities (Days 6-15)

**Theme:** Fill the most impactful functional gaps.

### R5. Implement Rule-Based Query Expansion (P0)

**The Problem:** Single queries limit recall. FTS5 and BM25 miss paraphrased content entirely.

**The Fix:** Server-side query expansion using 3 strategies:
1. **Synonym expansion:** Extract key terms, generate synonym variants from a curated domain vocabulary
2. **Term decomposition:** Split compound queries into sub-queries ("authentication error handling" → ["authentication", "error handling"])
3. **Embedding perturbation:** Generate 2 embedding variants by adding small random vectors to the query embedding

Run expanded queries through the hybrid pipeline in parallel, then fuse all results with RRF.

**LOC:** ~200-300
**Impact:** Estimated 20-40% recall improvement for paraphrased queries.
**Risk:** Medium — latency increase of 50-100ms for embedding generation.

### R6. Add Retrieval Confidence Scoring (P1)

**The Problem:** No mechanism to communicate retrieval quality to the LLM consumer. Low-quality results are silently injected.

**The Fix:** Compute 3 confidence metrics on the post-fusion result set:
- **Score gap ratio:** `(top1 - top2) / top1` — large gap = high confidence
- **Normalized entropy:** Low entropy in top-N scores = concentrated relevance
- **Multi-source convergence:** Percentage of top results appearing in 2+ retrieval sources

Inject as metadata in MCP response:
```typescript
extraData.trm = {
  confidence: 0.73,
  gapRatio: 0.15,
  convergenceRate: 0.60,
  warnings: score < threshold ? ['Low confidence - consider broader search'] : []
};
```

**LOC:** ~200-300
**Impact:** LLMs can decide whether to trust retrieval results or fall back to first-principles reasoning.
**Risk:** Low — purely additive metadata, no behavioral change unless consumer acts on it.

### R7. Extend Causal Graph to 3-Hop with LIMIT (P1)

**The Problem:** 2-hop traversal misses transitive relationships (A→B→C→D).

**The Fix:** Increase `MAX_HOPS` from 2 to 3 in `causal-boost.ts`. Add a `LIMIT 50` clause to the recursive CTE to prevent combinatorial explosion on dense subgraphs. Ensure index exists on `causal_edges(source_id, target_id)`.

**LOC:** ~30-50 (parameter change + LIMIT clause)
**Impact:** Captures transitive causal chains without significant latency increase.
**Risk:** Low — LIMIT clause bounds worst-case behavior.

### R8. Add Adaptive Fallback Thresholds (P1)

**The Problem:** When no results meet the minimum similarity threshold, the system returns empty results. [Assumes: This happens with niche or novel queries.]

**The Fix:** Two-pass search: first with standard thresholds (`min_similarity=0.3`), if zero results, retry with relaxed thresholds (`min_similarity=0.1`) and add a warning to the response metadata.

**LOC:** ~50-80
**Impact:** Eliminates zero-result failure mode.
**Risk:** Negligible — strictly better than returning nothing.

---
<!-- /ANCHOR:decision-phase-2-add-missing-capabilities-days-6-15-138 -->

<!-- ANCHOR:decision-phase-3-advanced-enhancements-days-16-30-138 -->
## 4. Phase 3: Advanced Enhancements (Days 16-30)

**Theme:** Research-grade improvements with higher implementation complexity.

### R9. Pre-Computed PageRank Authority Scores (P2)

**The Problem:** All memories are weighted equally by RRF regardless of their structural importance in the knowledge graph.

**The Fix:** Compute PageRank on the `causal_edges` table during `memory_manage` operations (batch job, not real-time). Store as `pagerank_score` column in `memory_index`. Add as a small-weight signal (~0.1) to RRF.

**LOC:** ~200-300
**Impact:** Foundational decisions that influence many subsequent memories rank higher.
**Risk:** Medium — requires schema migration and batch computation scheduling.

### R10. Lightweight Entity Extraction for Causal Graph (P2)

**The Problem:** Causal graph construction requires manual `memory_causal_link` calls. Graph is likely sparse.

**The Fix:** During `memory_save`, extract entities using:
1. Regex patterns for spec folders, file paths, function names, IDs (`REQ-006`)
2. Markdown header parsing (headers as entity names)
3. Existing trigger phrase decomposition

Auto-create `derived_from` edges between memories sharing 2+ extracted entities.

**LOC:** ~200-300
**Impact:** Automatic graph densification without heavy NLP dependencies.
**Risk:** Medium — false positive edges could introduce noise.

### R11. Auto-Populate Co-Activation Graph (P2)

**The Problem:** `co-activation.ts` requires explicit `populateRelatedMemories()` calls. The `related_memories` JSON field in `memory_index` is likely empty for most memories.

**The Fix:** Add a trigger in `memory_save` to compute and store related memories for newly indexed content. Run a one-time backfill during `memory_manage` for existing memories.

**LOC:** ~100-150
**Impact:** Enables spreading activation to work as designed.
**Risk:** Low — existing infrastructure, just needs automation.

### R12. Enhanced Intent Classification (P2)

**The Problem:** Rule-based keyword + regex matching at `intent-classifier.ts` misclassifies paraphrased queries.

**The Fix:** Phase A (immediate): Add TF-IDF weighting and bigram patterns to existing classifier. Phase B (if needed): Use `@huggingface/transformers` (already a dependency) for ONNX-based text classification with a quantized 25MB model.

**LOC:** Phase A: ~200-300; Phase B: ~400-600
**Impact:** More accurate intent routing → better adaptive fusion weights → better results.
**Risk:** Phase A: Low; Phase B: Medium (model loading latency 5-15s cold start).

---
<!-- /ANCHOR:decision-phase-3-advanced-enhancements-days-16-30-138 -->

<!-- ANCHOR:decision-implementation-priority-matrix-138 -->
## 5. Implementation Priority Matrix

| # | Recommendation | Phase | LOC | Latency Impact | Dependencies | Priority |
|---|---------------|-------|-----|----------------|--------------|----------|
| R1 | Activate adaptive fusion | 1 | 50-80 | ~0ms | None | **P0** |
| R4 | Multi-field weighted FTS5 | 1 | 20-30 | ~0ms | None | **P0** |
| R5 | Query expansion | 2 | 200-300 | +50-100ms | None | **P0** |
| R2 | Graph as RRF source | 1 | 100-150 | +5-15ms | None | **P1** |
| R3 | Post-fusion MMR | 1 | 150-200 | +2-5ms | None | **P1** |
| R6 | Confidence scoring | 2 | 200-300 | +5-15ms | None | **P1** |
| R7 | 3-hop causal traversal | 2 | 30-50 | +5-20ms | None | **P1** |
| R8 | Adaptive fallback | 2 | 50-80 | ~0ms | None | **P1** |
| R9 | PageRank scores | 3 | 200-300 | Batch only | Schema migration | **P2** |
| R10 | Entity extraction | 3 | 200-300 | +5ms (save) | None | **P2** |
| R11 | Co-activation auto-populate | 3 | 100-150 | +10ms (save) | None | **P2** |
| R12 | Enhanced intent classifier | 3 | 200-600 | <1ms / 20-80ms | None / Transformers.js | **P2** |

**Total Phase 1 LOC:** ~320-460 (zero new dependencies)
**Total Phase 2 LOC:** ~480-730
**Total Phase 3 LOC:** ~700-1350

---
<!-- /ANCHOR:decision-implementation-priority-matrix-138 -->

<!-- ANCHOR:decision-risks-and-mitigations-138 -->
## 6. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Latency regression from query expansion | Medium | Medium | Feature flag, cache expanded queries |
| Graph traversal event loop blocking (3-hop) | Low | High | LIMIT clause, edge count threshold |
| False positive causal edges from entity extraction | Medium | Low | Confidence threshold, manual review flag |
| Adaptive fusion weight miscalibration | Low | Medium | A/B testing via existing dark-run mode |
| MMR over-diversifying results | Low | Low | Intent-adaptive lambda, tunable per intent |

---
<!-- /ANCHOR:decision-risks-and-mitigations-138 -->

<!-- ANCHOR:decision-success-metrics-138 -->
## 7. Success Metrics

| Metric | Current Baseline | Phase 1 Target | Phase 2 Target |
|--------|-----------------|----------------|----------------|
| Retrieval relevance (manual assessment) | — | +15% | +30% |
| Zero-result queries | Unknown | 0% (with R8) | 0% |
| Context diversity (unique topics per result set) | Low (heuristic MMR) | +40% (post-fusion MMR) | +50% |
| FTS5 precision (title/tag matches ranked higher) | Equal weight | 10x title boost | 10x title boost |
| Causal graph coverage | ~60% (manual) | ~60% | ~80% (with R10, R11) |
| Pipeline latency (p50) | ~50ms | ~60ms | ~120ms |

---
<!-- /ANCHOR:decision-success-metrics-138 -->

<!-- ANCHOR:decision-next-steps-138 -->
## 8. Next Steps

1. **Immediate:** Wire `adaptive-fusion.ts` into `hybridSearchEnhanced()` behind feature flag → validate with `memory_stats` metrics
2. **Immediate:** Add FTS5 column weights to BM25 queries → zero-risk improvement
3. **Plan:** Create spec folder for Phase 1 implementation (`/spec_kit:plan "Wire disconnected search modules into main pipeline"`)
4. **Track:** Measure retrieval quality before/after each change using `task_postflight` learning metrics
<!-- /ANCHOR:decision-next-steps-138 -->

