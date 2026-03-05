# Actionable Recommendations: Hybrid RAG Fusion Refinement

> **Prioritized implementation strategies** for improving the spec-kit memory MCP server based on patterns extracted from zvec, LightRAG, and PageIndex.
>
> **Revision 2** — Corrected after ultra-think review and codebase verification.

| Field | Value |
|-------|-------|
| Recommendations ID | 140-REC-001-R2 |
| Date | 2026-02-26 |
| Target System | spec-kit memory MCP server (context-server v1.7.2) |
| Input | Research reports for zvec, LightRAG, PageIndex, internal architecture |
| Classification | Retrieval quality, storage optimization, scoring improvements |
| Review Status | Ultra-think reviewed, codebase-verified |

---

## Executive Summary

From the analysis of three external systems against our internal architecture, **13 recommendations** emerge across four categories: retrieval quality (5), scoring improvements (3), storage optimization (2), and indexing enhancements (3). The highest-impact, lowest-effort changes are: implementing the DocScore aggregation formula (P0), adding a causal-degree ranking boost (P0), and activating the dormant learned relevance feedback mechanism (P1). Together, these changes would improve ranking quality and behavioral learning with minimal code changes.

> **Note on metrics**: No baseline MRR@10 or Recall@5 measurements exist for this system. All impact assessments are qualitative and directional. Establishing retrieval evaluation infrastructure is a prerequisite for quantitative validation. Specific percentage improvement claims are intentionally omitted.

---

## Recommendation Matrix

| # | Recommendation | Source | Impact | Effort | Risk | Priority | Scale Threshold |
|---|---------------|--------|--------|--------|------|----------|-----------------|
| R1 | DocScore chunk-to-memory aggregation | PageIndex | HIGH | LOW | LOW | **P0** | Immediate |
| R4 | Causal-degree ranking boost | LightRAG | HIGH | LOW | LOW | **P0** | Immediate |
| R11 | Activate learned relevance feedback | Internal | HIGH | LOW | LOW | **P1** | Immediate |
| R2 | Channel minimum-representation constraint | LightRAG | MEDIUM | MEDIUM | LOW | **P1** | 1K+ memories |
| R12 | Embedding-based query expansion | Internal+zvec | MEDIUM | MEDIUM | LOW | **P1** | Immediate |
| R5 | INT8 per-record quantization | zvec | HIGH | MEDIUM | LOW | **P2** | 10K+ memories |
| R6 | 4-stage pipeline refactor | LightRAG | HIGH | HIGH | MEDIUM | **P2** | Immediate |
| R7 | Anchor-aware chunk thinning | PageIndex | MEDIUM | MEDIUM | LOW | **P2** | Immediate |
| R8 | Memory summary generation | PageIndex | MEDIUM | MEDIUM | MEDIUM | **P2** | 1K+ memories |
| R3 | Pre-normalize embeddings at insert | zvec | LOW | LOW | NONE | **P3** | 10K+ (pending sqlite-vec IP mode) |
| R9 | Spec folder description pre-filter | PageIndex | LOW-MED | LOW | LOW | **P3** | 1K+ memories |
| R10 | Auto entity extraction for causal links | LightRAG | MEDIUM | HIGH | MEDIUM | **P3** | Immediate |
| R13 | Retrieval evaluation infrastructure | Internal | HIGH | MEDIUM | LOW | **P1** | Prerequisite |

---

## P0: Immediate Wins (High Impact, Low Effort)

### R1: DocScore Chunk-to-Memory Aggregation

**Problem**: The existing `collapseAndReassembleChunkResults()` function in `handlers/memory-search.ts:303` keeps only the **first** chunk hit per parent memory, discarding subsequent chunk scores. This means a memory with 5 highly-relevant chunks gets the same score as one with a single match — all multi-chunk relevance signal is lost.

**Pattern source**: PageIndex's `DocScore = (1/sqrt(N+1)) * SUM(ChunkScore)` formula. [Evidence: Grade A, tutorial documentation]

**Verified against codebase**: YES — `collapseAndReassembleChunkResults` at line 303 uses `seenParents: Set<number>` and `continue` to skip duplicate parent hits.

**Conflicts with**: Existing chunk collapsing flow — aggregation MUST happen BEFORE collapsing, not after.

**Implementation**:

```typescript
// Insert BEFORE collapseAndReassembleChunkResults() in memory-search.ts:
function aggregateChunkScoresToParent(results: SearchResult[]): SearchResult[] {
  // Step 1: Group chunk scores by parent_id
  const parentScores = new Map<number, { scores: number[]; bestRow: SearchResult }>();
  const nonChunkResults: SearchResult[] = [];

  for (const row of results) {
    if (row.parent_id) {
      const entry = parentScores.get(row.parent_id);
      if (entry) {
        entry.scores.push(row.similarity ?? 0);
        // Keep the row with the highest individual score as representative
        if ((row.similarity ?? 0) > (entry.bestRow.similarity ?? 0)) {
          entry.bestRow = row;
        }
      } else {
        parentScores.set(row.parent_id, {
          scores: [row.similarity ?? 0],
          bestRow: row,
        });
      }
    } else {
      nonChunkResults.push(row);
    }
  }

  // Step 2: Compute DocScore per parent and emit one result per parent
  const aggregatedResults: SearchResult[] = [];
  for (const [parentId, { scores, bestRow }] of parentScores) {
    const sum = scores.reduce((a, b) => a + b, 0);
    const docScore = sum / Math.sqrt(scores.length + 1);
    aggregatedResults.push({
      ...bestRow,
      similarity: docScore,
      // Preserve chunk count for downstream use
      _chunkHits: scores.length,
    });
  }

  // Step 3: Merge with non-chunk results, re-sort by score
  return [...nonChunkResults, ...aggregatedResults]
    .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));
}
```

**Where to insert**: Call `aggregateChunkScoresToParent(results)` BEFORE `collapseAndReassembleChunkResults()` in `handlers/memory-search.ts`. The existing collapsing logic then becomes a no-op for chunks (already one per parent) but still handles any edge cases.

**Files to modify**: `handlers/memory-search.ts` (add aggregation before collapsing)
**Effort**: ~50 LOC. Additive — can be feature-flagged.
**Risk**: Low. The existing collapsing logic acts as a safety net after aggregation.
**Confidence**: HIGH — formula is mathematically sound.

---

### R4: Causal-Degree Ranking Boost

**Problem**: Memories with many causal edges (high connectivity in the knowledge graph) don't receive any ranking advantage. The causal graph is used as a search channel (BFS traversal) but connectivity count is not a scoring signal.

**Pattern source**: LightRAG's graph-degree-weighted ranking — sort by `(degree, weight)`. [Evidence: Grade A, `lightrag/operate.py:4264-4317`]

**Verified against codebase**: YES — `lib/scoring/composite-scoring.ts` computes a 5-factor score; none of the factors use causal edge count. `lib/storage/causal-edges.ts` has `getCausalChain()` but no degree-counting query.

**Conflicts with**: None. Additive to existing composite scoring.

**Implementation**:

```typescript
// In lib/scoring/composite-scoring.ts, add to computeCompositeScore():
const CAUSAL_DEGREE_WEIGHT = 0.05; // Configurable, start conservative

function getCausalDegree(memoryId: number): number {
  const result = db.prepare(
    `SELECT COUNT(*) as cnt FROM causal_edges
     WHERE source_id = ? OR target_id = ?`
  ).get(memoryId, memoryId) as { cnt: number } | undefined;
  return result?.cnt ?? 0;
}

// In the composite score computation:
const degreeBoost = Math.log(1 + getCausalDegree(memoryId)) * CAUSAL_DEGREE_WEIGHT;
const finalScore = baseCompositeScore * (1 + degreeBoost);
```

**Performance note**: For batch scoring of N results, use a single batch query:
```sql
SELECT COALESCE(source_id, target_id) as memory_id, COUNT(*) as degree
FROM causal_edges
WHERE source_id IN (?, ?, ...) OR target_id IN (?, ?, ...)
GROUP BY memory_id
```

**Files to modify**: `lib/scoring/composite-scoring.ts` (add degree factor), `lib/storage/causal-edges.ts` (add batch degree query)
**Effort**: ~40 LOC. Single SQL query + logarithmic scaling.
**Risk**: Low. Logarithmic scaling prevents extreme boosts. Feature-flaggable via config.
**Confidence**: HIGH — validated in LightRAG; aligns with PageRank-style graph centrality.

---

## P1: High-Value Improvements (Medium Impact, Low-Medium Effort)

### R11: Activate Learned Relevance Feedback (NEW)

**Problem**: `learnFromSelection()` is implemented in `vector-index-impl.ts:3882` — it extracts novel terms from search queries and enriches memory trigger phrases. But it is **never called** from any handler or tool. Behavioral learning data is being discarded.

**Pattern source**: Internal — the function already exists. [Evidence: Grade A, verified in codebase]

**Verified against codebase**: YES — `learnFromSelection` is exported from `vector-index-impl.ts` but grep across `handlers/`, `tools/`, and `core/` returns zero call sites.

**Conflicts with**: None. Purely additive.

**Implementation**:

```typescript
// In handlers/memory-search.ts, after returning search results:
// When the caller later indicates which result was used (via memory_validate),
// call learnFromSelection to enrich trigger phrases.

// Option A: Call in memory_validate handler when wasUseful=true
// In the validate handler:
if (wasUseful) {
  // If we know the original query that surfaced this memory:
  const lastQuery = getLastQueryForMemory(memoryId); // from search_cache or session
  if (lastQuery) {
    learnFromSelection(memoryId, lastQuery);
  }
}

// Option B: Call in memory_search handler with a "selected" callback
// Store search context in session, trigger learn on next interaction
```

**Files to modify**: `handlers/memory-validate.ts` or `handlers/memory-search.ts` (add call site)
**Effort**: ~20 LOC. The function is already implemented; just needs to be called.
**Risk**: Low. Enriches trigger phrases incrementally. Worst case: slightly broader trigger matching.
**Confidence**: HIGH — proven mechanism, just dormant.

---

### R2: Channel Minimum-Representation Constraint

**Problem**: RRF fusion produces a quality-ordered ranking, but doesn't guarantee representation from all contributing channels. In theory, a single dominant channel could supply all top results.

**Pattern source**: LightRAG's round-robin interleaving with deduplication. [Evidence: Grade A, `lightrag/operate.py:3561-3616`]

**Verified against codebase**: YES — `rrf-fusion.ts` returns a flat `FusionResult[]` with per-result `sources[]` and `sourceScores{}` attribution but no per-channel minimum. The `CONVERGENCE_BONUS = 0.10` rewards multi-channel presence but doesn't guarantee it.

**Conflicts with**: A naive round-robin post-RRF would **undo** the quality ranking. Must be implemented as a constraint within RRF, not after it.

> **Important**: The original recommendation proposed post-hoc round-robin interleaving which conflicts with RRF's quality ordering and requires exposing per-channel results (currently merged internally). The corrected approach uses the existing `sources[]` attribution to enforce a soft minimum without restructuring the fusion layer.

**Implementation**:

```typescript
// In rrf-fusion.ts, after fuseResults() produces the ranked list:
function enforceChannelDiversity(
  results: FusionResult[],
  minPerChannel: number = 1,
  limit: number
): FusionResult[] {
  const channelCounts = new Map<string, number>();
  const guaranteed: FusionResult[] = [];
  const remainder: FusionResult[] = [];

  // First pass: identify results that are the sole representative of a channel
  for (const result of results) {
    const isNeeded = result.sources.some(src => {
      const count = channelCounts.get(src) ?? 0;
      return count < minPerChannel;
    });

    if (isNeeded) {
      guaranteed.push(result);
      for (const src of result.sources) {
        channelCounts.set(src, (channelCounts.get(src) ?? 0) + 1);
      }
    } else {
      remainder.push(result);
    }
  }

  // Guaranteed results first (in their RRF quality order), then remainder
  return [...guaranteed, ...remainder].slice(0, limit);
}
```

**Files to modify**: `lib/search/rrf-fusion.ts` (add diversity enforcement post-fusion)
**Effort**: ~60 LOC. Works with existing `sources[]` attribution.
**Risk**: Low. Soft guarantee — only promotes results that RRF already scored. Feature-flaggable.
**Confidence**: MEDIUM — the need for this is theoretical; should be validated with empirical measurement (see R13).

---

### R12: Embedding-Based Query Expansion (NEW)

**Problem**: Query expansion in `lib/search/query-expander.ts` uses only ~25 static domain term mappings with max 3 variants. Novel phrasings not in the vocabulary are never expanded.

**Pattern source**: Internal gap (IMPROVE-004) combined with zvec's embedding-based similarity patterns. [Evidence: Grade A, verified in codebase]

**Verified against codebase**: YES — `query-expander.ts` contains hard-coded `DOMAIN_VOCAB` map.

**Conflicts with**: None. Augments existing expansion.

**Implementation**:

```typescript
// In lib/search/query-expander.ts, add after rule-based expansion:
async function expandViaEmbedding(
  query: string,
  existingTerms: string[],
  topK: number = 3
): Promise<string[]> {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Search trigger_phrases index for similar terms
  // (This reuses existing infrastructure — no new index needed)
  const similar = await vectorSearch(queryEmbedding, {
    limit: topK * 2,
    minSimilarity: 0.7,  // High threshold to avoid noise
    columnsOnly: ['trigger_phrases'],
  });

  // Extract unique trigger phrases not already in the query
  const expansions: string[] = [];
  for (const result of similar) {
    const phrases = JSON.parse(result.trigger_phrases || '[]');
    for (const phrase of phrases) {
      if (!existingTerms.includes(phrase) && !query.includes(phrase)) {
        expansions.push(phrase);
        if (expansions.length >= topK) return expansions;
      }
    }
  }
  return expansions;
}
```

**Files to modify**: `lib/search/query-expander.ts`
**Effort**: ~80 LOC. Reuses existing embedding + vector search infrastructure.
**Risk**: Low. Expansion terms come from existing trigger phrases, so they're known-good vocabulary.
**Confidence**: MEDIUM — needs empirical validation but the approach is sound.

---

### R13: Retrieval Evaluation Infrastructure (NEW — Prerequisite)

**Problem**: No baseline retrieval quality metrics exist. Without MRR@10, Recall@5, or NDCG measurements, we cannot validate whether any recommendation actually improves search quality.

**Pattern source**: Internal gap (IMPROVE-012). [Evidence: Grade A, verified]

**Verified against codebase**: YES — `lib/telemetry/retrieval-telemetry.ts` collects data but no evaluation framework exists.

**Implementation**:
1. Log query-result-selection triples (hook into `memory_validate` and `learnFromSelection`)
2. Build offline evaluation script that computes MRR@10, Recall@5, NDCG from logged data
3. Run evaluation before and after each recommendation to measure delta
4. Surface in `memory_health` tool or dedicated analytics

**Files to modify**: New script + `handlers/memory-validate.ts` (logging)
**Effort**: ~150 LOC for evaluation script + ~30 LOC for logging hooks.
**Risk**: Low. Read-only analysis of existing data.
**Confidence**: HIGH — standard IR evaluation methodology.

---

## P2: Architectural Improvements (High Impact, Higher Effort)

### R5: INT8 Per-Record Quantization

**Problem**: Each 768-dim FP32 embedding consumes 3,072 bytes. At current scale (~100-1000 memories), this is 300KB-3MB — **trivial**. At 10K+ memories, vector data becomes ~30MB and storage optimization becomes meaningful.

**Pattern source**: zvec's per-record streaming quantization. [Evidence: Grade A, `src/core/quantizer/record_quantizer.h`]

**Verified against codebase**: YES — `vec_memories` stores FP32 vectors via sqlite-vec. No quantization exists.

**Conflicts with**: R3 (pre-normalization) — if both are implemented, R5 already includes norm in the quantized BLOB, making R3's separate `embedding_norm` column redundant.

**Scale threshold**: ROI becomes positive at **10K+ memories**. Below this, implementation complexity exceeds storage benefit.

**Implementation**: (Unchanged from original — the code sketch is correct)

```typescript
interface QuantizedEmbedding {
  data: Int8Array;     // 768 bytes
  scaleRecip: number;  // 4 bytes
  bias: number;        // 4 bytes
  sum: number;         // 4 bytes
  norm: number;        // 4 bytes
}

function quantizeRecord(vec: Float32Array): QuantizedEmbedding {
  let normSq = 0;
  for (let i = 0; i < vec.length; i++) normSq += vec[i] * vec[i];
  const norm = Math.sqrt(normSq);

  let min = Infinity, max = -Infinity;
  for (let i = 0; i < vec.length; i++) {
    const v = vec[i] / norm;
    min = Math.min(min, v);
    max = Math.max(max, v);
  }

  const scale = 254 / Math.max(max - min, 1e-7);
  const biasVal = -min * scale - 127;

  const data = new Int8Array(vec.length);
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    const v = Math.round((vec[i] / norm) * scale + biasVal);
    data[i] = Math.max(-127, Math.min(127, v));
    sum += data[i];
  }

  return { data, scaleRecip: 1 / scale, bias: -biasVal / scale, sum, norm };
}
```

**Migration path**: Dual-store (add `embedding_q BLOB` alongside `vec_memories`), validate, then optionally drop FP32.
**Files to modify**: `shared/embeddings.ts`, `lib/search/vector-index-impl.ts`
**Effort**: ~200 LOC + schema migration.
**Risk**: Low. ~1-2% recall loss (model-dependent — validate per embedding provider).
**Confidence**: HIGH for the algorithm; accuracy impact is estimated and should be measured per model.

---

### R6: 4-Stage Query Pipeline Refactor

**Problem**: `handlers/memory-context.ts` is a 616-line file. While `handleMemoryContext` already dispatches to different strategies per mode, the search/truncate/merge/format concerns are interleaved within each mode's implementation.

**Pattern source**: LightRAG's Search → Truncate → Merge → Build Context. [Evidence: Grade A]

**Verified against codebase**: YES — `memory-context.ts` routes by mode but each mode branch mixes search + format logic.

**Conflicts with**: Should incorporate R1, R2, R4 into its clean pipeline stages.

**Proposed architecture**:

```
memory_context(input, mode)
  │
  ├─ Stage 1: SEARCH (parallel)
  │    ├─ Trigger matching  → local_results
  │    ├─ Semantic search   → global_results
  │    ├─ Causal traversal  → graph_results
  │    └─ Intent detection  → weights
  │
  ├─ Stage 2: SCORE & AGGREGATE
  │    ├─ DocScore aggregation (R1)
  │    ├─ Causal-degree boost (R4)
  │    ├─ Channel diversity constraint (R2)
  │    └─ Composite scoring
  │
  ├─ Stage 3: TRUNCATE & FILTER
  │    ├─ Constitutional injection (always)
  │    ├─ Session dedup
  │    └─ Dynamic token budget allocation
  │
  └─ Stage 4: BUILD CONTEXT
       ├─ Format results
       └─ Token budget enforcement
```

**Files to modify**: `handlers/memory-context.ts` (refactor into stages)
**Effort**: ~400 LOC refactor (restructuring existing logic, not net-new).
**Risk**: Medium. Core retrieval path — requires comprehensive testing via existing vitest suite.
**Confidence**: HIGH — cleaner architecture, easier to test and extend.

---

### R7: Anchor-Aware Chunk Thinning

**Problem**: Small anchor-delimited sections become tiny, low-signal chunks that dilute search results.

**Pattern source**: PageIndex's bottom-up tree thinning with token threshold. [Evidence: Grade A, `page_index_md.py:97-142`]

**Verified against codebase**: YES — `lib/chunking/anchor-chunker.ts` splits but never merges small sections.

**Conflicts with**: None. Only affects new indexing.

**Implementation**: During `memory_index_scan`, after anchor parsing:
1. Calculate token count per section
2. If section < 100 tokens, merge with adjacent section
3. Only create separate chunks for sections > threshold

**Files to modify**: `lib/chunking/anchor-chunker.ts`
**Effort**: ~100 LOC. Bottom-up pass after initial chunking.
**Risk**: Low. Only affects new indexing; existing chunks unchanged until re-index.

---

### R8: Memory Summary Generation

**Problem**: No auto-generated summaries for search pre-filtering.

**Pattern source**: PageIndex's node summaries with short-text optimization. [Evidence: Grade A]

**Verified against codebase**: YES — `memory_index` table has no `summary` column.

**Conflicts with**: None.

**Scale threshold**: Overhead only justified at 1K+ memories where pre-filtering saves computation.

**Implementation**: During `memory_save`/`memory_index_scan`:
- Files < 200 tokens: content IS the summary (store directly)
- Files >= 200 tokens: Generate 1-2 sentence summary (LLM or extractive)
- Store in new `memory_index.summary` column

**Files to modify**: `lib/search/vector-index-impl.ts` (schema), handlers (generation logic)
**Effort**: ~150 LOC + schema migration.
**Risk**: Medium. LLM dependency adds latency to indexing. Mitigated by making it optional and async.

[Assumes: LLM access during indexing is acceptable for the async embedding path]

---

## P3: Future Enhancements (Lower Priority)

### R3: Pre-Normalize Embeddings at Insert Time

**Problem (corrected)**: Our primary vector search uses sqlite-vec's `vec_distance_cosine()` which handles normalization internally. Our `computeCosine()` in `mmr-reranker.ts:45` normalizes per call but only operates on ~20 candidates during MMR diversity reranking — negligible overhead.

**Pattern source**: zvec's `CosineConverter`. [Evidence: Grade A, `src/core/quantizer/cosine_converter.cc`]

**Verified against codebase**: YES — sqlite-vec uses `vec_distance_cosine()` at line 2199. `computeCosine()` at `mmr-reranker.ts:45` is used only for MMR on ~20 candidates.

**Conflicts with**: R5 (INT8 quantization) already includes norm storage, making a separate norm column redundant.

**Why downgraded**: The claimed benefit for main search path was incorrect — sqlite-vec handles this internally. Pre-normalization would only help if: (a) sqlite-vec adds inner product mode, or (b) we replace sqlite-vec with custom search. Neither is planned.

**Effort**: ~30 LOC + schema migration. **Deferred** pending sqlite-vec inner product support.

---

### R9: Spec Folder Description Pre-Filter

Generate and cache a one-sentence description per spec folder from memory titles. Use as a first-pass filter to skip irrelevant folders.

**Scale threshold**: Only valuable at 1K+ memories across many spec folders.

**Files to modify**: `lib/search/vector-index-impl.ts`, `handlers/memory-search.ts`
**Effort**: ~80 LOC. Generate descriptions during `memory_index_scan`.

---

### R10: Auto Entity Extraction for Causal Links

Adapt LightRAG's entity extraction to auto-generate causal links between memories sharing entities.

- **Lightweight** (no LLM): Extract named entities via regex/NLP, match across memories, suggest links with strength 0.3
- **Full** (with LLM): Use LightRAG-style extraction prompt, create links with evidence strings

**Files to modify**: `lib/storage/causal-edges.ts`, `handlers/memory-save.ts`
**Effort**: 200-500 LOC depending on approach.
**Risk**: Medium. False positive links could degrade graph quality. Mitigation: low default strength + user confirmation.

---

## Implementation Roadmap

### Phase 1: Quick Wins (1-2 days each)

```
R1 (DocScore aggregation) → R4 (Causal-degree boost) → R11 (Activate learnFromSelection)
```

These three are independent, low-risk, and touch different parts of the codebase. R11 is the lowest-effort change (the function already exists — just add a call site).

### Phase 2: Measurement + Optimization (3-5 days)

```
R13 (Evaluation infra) → R2 (Channel diversity) → R12 (Query expansion)
```

R13 first — establish baseline metrics before making changes that need measurement. Then R2 and R12, which should be validated against the new baseline.

### Phase 3: Architecture (5-10 days)

```
R6 (4-stage pipeline) → R7 (Thinning) → R8 (Summaries)
```

R6 is a major refactor that should incorporate R1, R2, R4 into clean pipeline stages. R7 and R8 fit naturally into the new indexing path.

### Phase 4: Scale (When needed)

```
R5 (INT8 quantization) → R3 (Pre-normalize) → R9 (Folder descriptions) → R10 (Auto entities)
```

These become valuable at 10K+ memories or when storage/latency constraints appear.

---

## Risks and Considerations

### Migration Risk

- **INT8 quantization** (R5): Requires re-indexing all embeddings. Mitigated by dual-store approach. Defer until scale justifies.
- **4-stage refactor** (R6): Highest-risk change. Run full vitest suite before/after. Compare output on a test corpus.

### Performance Risk

- **DocScore aggregation** (R1): O(C) per memory where C = chunk count — negligible.
- **Causal-degree query** (R4): Single SQL query per result. Batch for N results. Sub-millisecond.
- **Summary generation** (R8): LLM latency during indexing. Mitigate by making async/optional.

### Quality Risk

- **INT8 quantization** (R5): ~1-2% recall loss estimated (model-dependent — validate per provider).
- **Channel diversity** (R2): May promote lower-scored results. Mitigated by soft constraint + reranking.
- **Chunk thinning** (R7): May merge semantically distinct sections. Mitigated by respecting anchor boundaries.

### What NOT to Do

1. **Do NOT apply round-robin interleaving after RRF** — it undoes quality ranking. Use minimum-representation constraint instead.
2. **Do NOT replace sqlite-vec's cosine with custom inner product** — sqlite-vec doesn't support IP mode; pre-normalization won't help main search.
3. **Do NOT add HNSW indexing yet** — brute-force is sufficient for < 10K memories.
4. **Do NOT add LLM calls to the search hot path** — latency budget is tight. LLM operations belong in indexing only.
5. **Do NOT remove any existing search channels** — all 4 contribute. Goal is better scoring, not fewer signals.
6. **Do NOT adopt PageIndex's vectorless approach** — embedding-based search is faster, cheaper, and more scalable.
7. **Do NOT claim specific percentage improvements** without establishing baseline metrics first (R13).

---

## Validation Strategy

> **Prerequisite**: R13 (Evaluation Infrastructure) must be implemented before quantitative validation is possible.

| Metric | Method | Baseline | Target |
|--------|--------|----------|--------|
| **MRR@10** | Log query-result-selection triples → compute offline | Establish first | Improvement over baseline |
| **Recall@5** | Percentage of useful memories in top 5 results | Establish first | Improvement over baseline |
| **Storage size** | Database file size (MB) | Measure current | -60-70% for vectors (at scale) |
| **Search latency** | End-to-end search time (p50, p95) | Measure current | No regression (< 500ms) |
| **Channel diversity** | % of results with multi-channel attribution | Measure via `sources[]` | All channels represented |
| **Chunk quality** | Average chunk token count | Measure current | Min 100, target 500 |
| **Trigger phrase growth** | Avg trigger phrases per memory over time (R11) | Count current | Gradual increase |

Ground truth for relevance judgments will come from: (1) `memory_validate` wasUseful=true signals, (2) `learnFromSelection` query-memory pairs, and (3) manual curation of a small test set (~50 query-result pairs).

---

## Missed Opportunities Noted (For Future Investigation)

These patterns were identified during review but are not yet actionable recommendations:

| Pattern | Source | Potential |
|---------|--------|-----------|
| **Matryoshka embeddings** | General literature | Dimension truncation as complementary approach to quantization |
| **SPLADE / learned sparse** | General literature | Could replace hand-crafted BM25 channel |
| **ColBERT multi-vector** | Internal IMPROVE-010 | Multi-representation per memory for richer matching |
| **Working memory → search feedback** | Internal cognitive layer | Sustained attention signals as scoring boost |
| **RRF K-value tuning** | Internal | K=60 may not be optimal; investigate K=30-100 range |
| **Two-stage search** | zvec + PageIndex combo | Summary pre-filter (full precision) → INT8 detail search |

---

*Recommendations derived from cross-system analysis of alibaba/zvec, HKUDS/LightRAG, and VectifyAI/PageIndex repositories. All code examples are TypeScript sketches — not production-ready. Each recommendation has been verified against the actual codebase. Full research reports available in `scratch/` directory.*
