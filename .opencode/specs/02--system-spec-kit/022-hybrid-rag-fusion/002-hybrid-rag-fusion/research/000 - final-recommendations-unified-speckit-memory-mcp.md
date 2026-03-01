# Actionable Recommendations: system-speckit Memory MCP Upgrade Plan (Final & Expanded)

<!-- ANCHOR:summary-recommendations-138 -->
## 1. Executive Summary
This document synthesizes findings from an exhaustive multi-agent research sprint (encompassing external RAG repositories like `ragflow`, `WiredBrain-Hierarchical-Rag`, and `graphrag_mcp` alongside a deep-dive into the 11,000+ LOC `system-speckit` search pipeline). The resulting upgrade plan transforms the `system-speckit` memory MCP server from a disjointed collection of RAG engines into a **Unified Context Engine**.

**The critical constraint recognized in this sprint is that the upgrade requires ZERO schema migrations.** The current v15 SQLite schema already supports everything necessary. All 6 recommended patterns operate entirely at the search/reranking pipeline layer in TypeScript. The estimated total effort is ~720-1,080 LOC across 8-12 files, deployable in 4 non-breaking phases. The absolute highest ROI actions involve wiring existing, disabled modules (like adaptive fusion and graph retrieval) into the primary search execution path.
<!-- /ANCHOR:summary-recommendations-138 -->

<!-- ANCHOR:implementation-phase-0-138 -->
## 2. Phase 0: Quick Wins — Activate Existing Assets
**Impact: High | Effort: Low (~95 LOC) | Risk: Very Low**

These changes activate code that is fully tested and implemented but sits dormant in the current codebase.

### 2.1 Wire Adaptive Fusion into Pipeline
**The Problem:** `adaptive-fusion.ts` implements intent-aware weighted RRF fusion (e.g., scoring FTS5 higher for exploratory queries). However, it is hidden behind a feature flag and NOT integrated into the `hybridSearchEnhanced()` pipeline, which stubbornly relies on static weights (`vector=1.0, FTS=0.8, BM25=0.6`).
**The Fix:** Replace the static weight configuration in `hybridSearchEnhanced()` with an explicit call to `hybridAdaptiveFuse()` from `adaptive-fusion.ts`. 

### 2.2 Enable Graph as Primary Retrieval Channel
**The Problem:** Currently, `useGraph` defaults to `false`. Causal graph relationships (`supersedes`, `causedBy`) only apply post-retrieval boosts. If a memory is heavily related via causal edges but lacks vector proximity, it is discarded before the graph boost even occurs.
**The Fix:** Enable graph retrieval as a source in `fuseResultsMulti()` within `rrf-fusion.ts`. Set `useGraph: true` by default and pipe the SQLite recursive CTE results directly into RRF, allowing the graph to nominate entirely new chunks.

### 2.3 Activate Spreading Activation
**The Problem:** `co-activation.ts` implements a BFS spreading activation algorithm that discovers related memories through temporal and contextual co-occurrence. It is fully functional but NEVER called.
**The Fix:** Invoke `co-activation.spreadActivation()` on the top-5 seed results in the post-search pipeline (e.g., `memory-search.ts:457`), merging the spread results before final response formatting.

### 2.4 Adaptive Fallback Thresholds
**The Problem:** A query returning 0 results due to a strict similarity threshold causes a complete context collapse for the LLM.
**The Fix:** Implement a two-pass search logic (as seen in `ragflow`). First pass: `min_similarity=0.3`. If `results.length === 0`, trigger second pass: `min_similarity=0.17`. Append a `fallbackRetry: true` flag to the metadata so the LLM knows the context is a loose match.
<!-- /ANCHOR:implementation-phase-0-138 -->

<!-- ANCHOR:implementation-phase-1-138 -->
## 3. Phase 1: Diversity and Confidence
**Impact: Very High | Effort: Medium (~270 LOC) | Risk: Low**

### 3.1 Post-Fusion MMR Diversity Reranking
**The Problem:** `apply_diversity()` uses heuristic proxies (spec_folder match = 0.8, same date = 0.5) operating solely within the vector layer. The final result set returned to the LLM routinely wastes the ~2000-token budget on functionally identical memories.
**The Fix:** Implement true cosine-similarity Maximal Marginal Relevance (MMR) *after* RRF fusion. 

```typescript
function applyMMR(candidates: Memory[], lambda: number = 0.6, limit: number = 5): Memory[] {
    const selected: Memory[] = [];
    while (selected.length < limit && candidates.length > 0) {
        let bestIndex = -1;
        let maxMmr = -Infinity;

        for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];
            const relevance = candidate.score; // RRF Score

            let maxSimToSelected = 0;
            // Penalize if the embedding is too similar to what we already selected
            for (const s of selected) {
                const sim = computeCosine(candidate.embedding, s.embedding);
                if (sim > maxSimToSelected) maxSimToSelected = sim;
            }

            const mmrScore = (lambda * relevance) - ((1 - lambda) * maxSimToSelected);
            if (mmrScore > maxMmr) {
                maxMmr = mmrScore;
                bestIndex = i;
            }
        }
        selected.push(candidates[bestIndex]);
        candidates.splice(bestIndex, 1);
    }
    return selected;
}
```

### 3.2 TRM Evidence Gap Detection
**The Problem:** No mechanism exists to communicate retrieval quality to the LLM. The LLM hallucinates because it assumes provided context is factual.
**The Fix:** Compute a Gaussian Confidence Check on the RRF scores post-fusion. If the top score falls below a dynamically computed threshold (Z-score < 1.5 or absolute score < 0.01), inject a warning into the MCP response metadata:
`extraData.trm.warnings = ['[EVIDENCE GAP: Low confidence match. Consider first-principles reasoning.]']`
<!-- /ANCHOR:implementation-phase-1-138 -->

<!-- ANCHOR:implementation-phase-2-138 -->
## 4. Phase 2: Graph Intelligence and Field Weights
**Impact: Medium-High | Effort: Low (~80 LOC) | Risk: Low**

### 4.1 Multi-Field Weighted FTS5
**The Problem:** The `MATCH` query in SQLite FTS5 treats the `content` block identically to the `title` block.
**The Fix:** Utilize the native `bm25()` function in SQLite FTS5 to apply extreme multipliers to critical structural fields.
```sql
SELECT id, title, bm25(memory_fts, 10.0, 5.0, 1.0, 2.0) as weighted_rank
FROM memory_fts WHERE memory_fts MATCH ?
ORDER BY weighted_rank;
-- Field 1 (Title): 10x multiplier
-- Field 2 (Trigger Phrases): 5x multiplier
-- Field 3 (File Path): 1x multiplier
-- Field 4 (Content): 2x multiplier
```

### 4.2 Relationship-Type-Aware Graph Traversal
**The Problem:** The recursive CTE (`causal-edges.ts`) treats all 6 relationship types identically. A `contradicts` edge boosts a score just as much as a `supersedes` edge.
**The Fix:** Modify the SQL query to incorporate relationship type weights natively in the sum:
`CASE WHEN relation = 'supersedes' THEN 1.5 WHEN relation = 'contradicts' THEN 0.8 ... END * edgeStrength`
<!-- /ANCHOR:implementation-phase-2-138 -->

<!-- ANCHOR:implementation-phase-3-138 -->
## 5. Phase 3: Multi-Query Retrieval
**Impact: High | Effort: Medium (~250-350 LOC) | Risk: Medium**

### 5.1 Template-Based Query Expansion
**The Problem:** Standard vector search is completely blocked by vocabulary mismatch (e.g., querying "timeout issue" when the memory says "session expiry").
**The Fix:** Implement server-side rule-based query expansion for `mode="deep"`. Generate 2 variants using a static domain vocabulary map and regex-based term decomposition. Run all 3 queries (1 original + 2 variants) through the Tri-Hybrid pipeline in parallel (`Promise.all`), then fuse the aggregated arrays across queries using a global RRF sort.
<!-- /ANCHOR:implementation-phase-3-138 -->

<!-- ANCHOR:implementation-phase-4-138 -->
## 6. Phase 4: Indexing Quality & Authority Extraction
**Impact: Medium | Effort: High (~400 LOC) | Risk: Medium**

### 6.1 Pre-Computed PageRank Authority Scores
**The Problem:** Foundational architectural memories are weighted identically to scratch notes in RRF calculations, stripping the LLM of authority context.
**The Fix:** Compute a PageRank metric over the `causal_links` table during the asynchronous `memory_manage` batch job. Store this derived value as a `pagerank_score` column in the `memory_index` table. Inject this as a query-independent weight (e.g., +0.1) during RRF sorting.

### 6.2 Lightweight Entity Extraction for Causal Graph Densification
**The Problem:** The causal graph requires manual `/memory:link` commands, resulting in severe relational sparsity.
**The Fix:** Introduce an autonomous extraction pass during `memory_save`. Run a fast regex parser to detect specific spec-folder paths, function headers, or `REQ-###` IDs in the text payload. Automatically map and insert `derived_from` edges into the `causal_links` table for any newly saved memory sharing 2+ entities with an existing memory.

### 6.3 Structure-Aware Document Parsing
**The Problem:** Deep markdown parsing natively ignores table and codeblock boundaries, occasionally chunking mathematical functions in half and devastating semantic meaning.
**The Fix:** Upgrade the default chunker using `remark` + `remark-gfm` syntax tree parsing. Ensure code blocks and tables are marked as contiguous atomic blocks, preventing the embedding engine from generating split-context noise.
<!-- /ANCHOR:implementation-phase-4-138 -->

<!-- ANCHOR:implementation-cognitive-enhancements-138 -->
## 7. Enhancing Existing Cognitive Features
**Impact: High | Effort: Medium | Risk: Low**

### 7.1 Intent Classifier Prototype Matching
Transition `intent-classifier.ts` from fragile regex rules to embedding-based centroids. By computing an "average" embedding for the 7 intent types during initialization, the system can map complex, paraphrased queries to the correct intent dynamically via a simple dot product.

### 7.2 Prediction Error Gate for Retrieval
The `prediction-error-gate.ts` brilliantly detects contradictions at write-time. Extend this to read-time: if the top 5 retrieved memories contain direct contradictions (`contradicts` edges or opposing patterns), flag it in the MCP response: `[WARNING: Retrieved memories contain conflicting architectural decisions.]`

### 7.3 FSRS & Tier Integration
Link the FSRS attention decay velocity dynamically to the `importance_tier`. `Constitutional` and `Critical` memories should experience 0.1x decay velocity (remaining highly active over months), while `Scratch` memories decay at 3.0x velocity to clear out the working context rapidly.
<!-- /ANCHOR:implementation-cognitive-enhancements-138 -->

<!-- ANCHOR:decision-migration-pathways-138 -->
## 8. Migration and Adoption Pathways
1.  **Feature Flags:** Introduce Phase 0 and Phase 1 updates behind respective feature flags (`SPECKIT_MMR=true`, `SPECKIT_TRM=true`). 
2.  **Tool Cache Invalidation:** The addition of BM25 column weights and adaptive RRF will fundamentally alter ranking. Force a `bypassCache=true` override on the next client launch to prevent stale results.
3.  **Latency Profiling:** Monitor `memory_stats` to ensure the addition of MMR and Multi-Query execution keeps `mode="auto"` within 55-120ms latency bounds.
<!-- /ANCHOR:decision-migration-pathways-138 -->