# Actionable Recommendations: system-speckit Memory MCP Upgrade Plan

**Spec:** 138 — Hybrid RAG Fusion
**Research Round:** 6 (Multi-Agent Synthesis)
**Date:** 2026-02-20
**Target:** system-speckit memory MCP server (v15 schema, ~11K LOC search pipeline)

---

<!-- ANCHOR:decision-executive-summary-138 -->
## 1. Executive Summary

This document synthesizes findings from 3 parallel research agents (codebase exploration, external repository analysis, technical feasibility assessment) into a prioritized, implementation-ready upgrade plan for the system-speckit memory MCP server.

**The upgrade requires ZERO schema migrations** (v15 stays as-is). All 6 recommended patterns operate at the search/reranking pipeline level, not the storage layer. The estimated total effort is ~720-1,080 LOC across 8-12 files, deployable in 4 phases.

**Top 3 Actions by Impact/Effort Ratio:**

| Rank | Action | Impact | Effort | Why |
|------|--------|--------|--------|-----|
| **1** | Activate disconnected modules (graph channel, adaptive fusion, co-activation) | High | ~65 LOC | Already built, just needs wiring |
| **2** | Add MMR diversity reranking | Very High | ~120 LOC | Directly maximizes 2000-token budget |
| **3** | Add adaptive fallback thresholds | High | ~30 LOC | Eliminates zero-result failures |

---
<!-- /ANCHOR:decision-executive-summary-138 -->

<!-- ANCHOR:decision-priority-matrix-138 -->
## 2. Priority Matrix

```
                    HIGH IMPACT
                        │
     ┌──────────────────┼──────────────────┐
     │                  │                  │
     │  P4: MMR (9/10)  │  P3: RAG Fusion  │
     │  P0: Activate    │      (8/10)      │
     │  disconnected    │                  │
     │  modules         │                  │
     │                  │                  │
─────┼──LOW EFFORT──────┼────HIGH EFFORT───┼─
     │                  │                  │
     │  P5: TRM (7/10)  │  P6: Template    │
     │  P0: Fallback    │  Parse (6/10)    │
     │  thresholds      │                  │
     │  P1: Graph (7/10)│  P2: Hierarchical│
     │                  │      (3/10)      │
     │                  │                  │
     └──────────────────┼──────────────────┘
                        │
                    LOW IMPACT
```

---
<!-- /ANCHOR:decision-priority-matrix-138 -->

<!-- ANCHOR:decision-phase-0-quick-wins-activate-existing-assets-week-1-138 -->
## 3. Phase 0: Quick Wins — Activate Existing Assets (Week 1)

**Impact: High | Effort: ~95 LOC | Risk: Very Low**

These changes activate already-implemented, already-tested code that is currently disconnected from the search pipeline. No new algorithms needed.

### 3.1 Enable Graph as Retrieval Channel

**File:** `lib/search/hybrid-search.ts:224`
**Change:** Set `useGraph: true` by default in `hybridSearchEnhanced()`
**LOC:** ~20 (implement `graphSearchFn` callback using existing `causal-edges.ts:getCausalChain()`)

```typescript
// Before: useGraph defaults to false
// After: useGraph defaults to true, using causal graph as 4th retrieval channel
const graphResults = await causalEdges.getNeighborsByQuery(queryEmbedding, {
  maxHops: 2,
  minStrength: 0.5,
  limit: searchOptions.limit
});
```

### 3.2 Wire Adaptive Fusion into Pipeline

**File:** `lib/search/hybrid-search.ts:352-365`
**Change:** Replace static weights with `adaptive-fusion.ts:hybridAdaptiveFuse()` call
**LOC:** ~30 (replace weight constants with adaptive function call)

```typescript
// Before: fixed weights vector=1.0, FTS=0.8, BM25=0.6
// After: intent-aware dynamic weights
const weights = adaptiveFusion.getWeightsForIntent(intent, documentType);
```

### 3.3 Activate Spreading Activation in Search

**File:** `handlers/memory-search.ts:457`
**Change:** Call `co-activation.spreadActivation()` on top-k seed results in post-search pipeline
**LOC:** ~15

```typescript
// After state filtering, before response formatting:
if (results.length > 0 && options.enableCoActivation !== false) {
  const spreadResults = await coActivation.spreadActivation(
    results.slice(0, 5).map(r => r.id),
    { maxHops: 2, maxResults: 20 }
  );
  results = mergeSpreadResults(results, spreadResults);
}
```

### 3.4 Adaptive Fallback Thresholds (from RAGFlow)

**File:** `lib/search/hybrid-search.ts:386-406` (in `searchWithFallback()`)
**Change:** If initial search returns 0 results, retry with relaxed thresholds
**LOC:** ~30

```typescript
// Pattern from RAGFlow rag/nlp/search.py
async function searchWithFallback(query, options) {
  let results = await hybridSearchEnhanced(query, options);

  if (results.length === 0 && options.minSimilarity > 0.17) {
    // Retry with relaxed thresholds
    results = await hybridSearchEnhanced(query, {
      ...options,
      minSimilarity: Math.max(0.17, options.minSimilarity * 0.5),
      limit: options.limit * 2  // Cast wider net
    });
    if (results.length > 0) {
      results[0]._meta = { ...(results[0]._meta || {}), fallbackRetry: true };
    }
  }

  return results;
}
```

---
<!-- /ANCHOR:decision-phase-0-quick-wins-activate-existing-assets-week-1-138 -->

<!-- ANCHOR:decision-phase-1-diversity-and-confidence-week-2-3-138 -->
## 4. Phase 1: Diversity and Confidence (Week 2-3)

**Impact: Very High | Effort: ~270 LOC | Risk: Low**

### 4.1 MMR Diversity Reranking (NEW MODULE)

**New File:** `lib/search/mmr-reranker.ts` (~120 LOC)
**Integration:** After RRF fusion, before response formatting
**Feature Flag:** `SPECKIT_MMR` (default: `true`)

**Rationale:** The 2000-token budget is the hardest constraint. Without MMR, 5 near-duplicate results waste 80% of the context window. Prior research (research_final) explicitly states: "MMR is not optional for production memory systems; it is mandatory."

**Algorithm:**
```typescript
function applyMMR(
  candidates: SearchResult[],
  embeddings: Map<string, Float32Array>,
  lambda: number = 0.6,  // Slight relevance bias
  limit: number = 5       // Fits ~2000 tokens
): SearchResult[] {
  const selected: SearchResult[] = [];
  const remaining = [...candidates];

  while (selected.length < limit && remaining.length > 0) {
    let bestIdx = -1;
    let maxMmr = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const relevance = remaining[i].score;  // RRF score

      let maxSimToSelected = 0;
      for (const s of selected) {
        const sim = cosineSimilarity(
          embeddings.get(remaining[i].id)!,
          embeddings.get(s.id)!
        );
        maxSimToSelected = Math.max(maxSimToSelected, sim);
      }

      const mmr = (lambda * relevance) - ((1 - lambda) * maxSimToSelected);
      if (mmr > maxMmr) { maxMmr = mmr; bestIdx = i; }
    }

    selected.push(remaining[bestIdx]);
    remaining.splice(bestIdx, 1);
  }

  return selected;
}
```

**Performance:** For top-20 candidates with 1024-dim embeddings:
- 20 * 5 = 100 cosine similarity computations (worst case)
- Each: 1024 multiplications + accumulation = ~0.01ms
- Total: ~1-2ms computation + 3-8ms embedding fetch = **5-13ms**

### 4.2 TRM Evidence Gap Detection (NEW MODULE)

**New File:** `lib/search/evidence-gap-detector.ts` (~150 LOC)
**Integration:** After RRF fusion, before MMR
**Feature Flag:** `SPECKIT_TRM` (default: `true`)

**Rationale:** From WiredBrain: "Integrity over Speed." Low-confidence retrieval that gets silently injected into the LLM prompt causes hallucination. Better to warn the LLM explicitly.

**Algorithm:**
```typescript
function detectEvidenceGap(rrfScores: number[]): EvidenceGapResult {
  if (rrfScores.length < 2) {
    return { gapDetected: true, confidence: 0, recommendation: EVIDENCE_GAP_WARNING };
  }

  const mean = rrfScores.reduce((a, b) => a + b) / rrfScores.length;
  const stdDev = Math.sqrt(
    rrfScores.reduce((a, b) => a + (b - mean) ** 2, 0) / rrfScores.length
  );

  const topScore = rrfScores[0];
  const zScore = (topScore - mean) / (stdDev || 0.001);

  return {
    gapDetected: zScore < 1.5 || topScore < 0.01,
    confidence: Math.min(1, zScore / 3),
    threshold: mean + 1.5 * stdDev,
    recommendation: zScore < 1.5
      ? '[EVIDENCE GAP: Low confidence match. Consider first-principles reasoning.]'
      : 'High confidence retrieval'
  };
}
```

**Performance:** Pure arithmetic on ~20 numbers = **<0.5ms**

---
<!-- /ANCHOR:decision-phase-1-diversity-and-confidence-week-2-3-138 -->

<!-- ANCHOR:decision-phase-2-graph-intelligence-week-4-138 -->
## 5. Phase 2: Graph Intelligence (Week 4)

**Impact: Medium-High | Effort: ~80 LOC | Risk: Low**

### 5.1 Relationship-Type-Aware Graph Scoring

**File:** `lib/search/causal-boost.ts`
**Change:** Modify `computeBoostByHop()` to incorporate relationship type and edge strength

```typescript
const RELATION_WEIGHTS: Record<string, number> = {
  supersedes: 1.5,    // Most important: indicates replacement
  caused: 1.3,        // Causation chain
  supports: 1.0,      // Corroborating evidence (baseline)
  derived_from: 1.1,  // Ancestry
  enabled: 0.9,       // Dependency
  contradicts: 0.8    // Conflicting (still valuable for context)
};

function computeWeightedBoost(
  hopDistance: number,
  relation: string,
  edgeStrength: number
): number {
  const relationWeight = RELATION_WEIGHTS[relation] || 1.0;
  const baseBoost = MAX_BOOST_PER_HOP / hopDistance;
  return baseBoost * relationWeight * edgeStrength;
}
```

### 5.2 Dynamic Hop Depth

**Change:** `MAX_HOPS` becomes mode-dependent:
- `mode="auto"`: 2 hops (current default)
- `mode="deep"`: 3 hops
- `mode="quick"`: 1 hop

### 5.3 Field-Specific Token Multipliers (from RAGFlow)

**File:** `lib/search/rrf-fusion.ts:176` (in `fuseScoresAdvanced()`)
**Change:** Boost results where query terms match title or trigger_phrases

```typescript
const FIELD_MULTIPLIERS = {
  title: 10,            // Title match worth 10x body
  trigger_phrases: 30,  // Trigger match worth 30x body
  anchor_id: 20,        // Anchor match worth 20x body
  content_text: 1       // Baseline
};
```

**LOC:** ~40 (add field-match detection in post-fusion scoring)

---
<!-- /ANCHOR:decision-phase-2-graph-intelligence-week-4-138 -->

<!-- ANCHOR:decision-phase-3-multi-query-retrieval-week-5-6-138 -->
## 6. Phase 3: Multi-Query Retrieval (Week 5-6)

**Impact: High | Effort: ~250-350 LOC | Risk: Medium**

### 6.1 Template-Based Query Expansion (No LLM Required)

**New File:** `lib/search/query-expander.ts` (~150 LOC)
**Feature Flag:** `SPECKIT_QUERY_EXPANSION` (default: `false`, enabled for `mode="deep"`)

**LLM-in-MCP Paradox:** The MCP server is called BY the LLM. Having it call an LLM internally creates circular dependency and latency. Template-based expansion avoids this entirely.

**Expansion Strategies:**

```typescript
function expandQuery(query: string): string[] {
  const variants = [query]; // Original always included

  // Strategy 1: Acronym expansion
  // "auth" -> "authentication", "config" -> "configuration"
  const expanded = expandAcronyms(query, DOMAIN_ACRONYMS);
  if (expanded !== query) variants.push(expanded);

  // Strategy 2: Concept broadening
  // "fix login bug" -> "authentication error resolution"
  const broadened = broadenConcepts(query, CONCEPT_MAP);
  if (broadened) variants.push(broadened);

  // Strategy 3: Anchor-style reformulation
  // "how does caching work" -> "caching architecture implementation"
  const reformulated = reformulateAsSearch(query);
  if (reformulated !== query) variants.push(reformulated);

  return variants.slice(0, 3); // Max 3 variants
}
```

**Execution:**
```typescript
// In memory_context handler, when mode="deep":
const variants = expandQuery(originalQuery);
const allResults = await Promise.all(
  variants.map(v => hybridSearchEnhanced(v, searchOptions))
);
const fused = fuseResultsMulti(allResults, { k: 60 }); // Cross-variant RRF
```

**Performance:**
- Template expansion: +5-10ms
- 3x parallel search: +30-50ms (parallelized via Promise.all in WAL mode)
- Cross-variant RRF: +3ms
- **Total: +38-63ms for mode="deep"**

### 6.2 Future: Client-Side Expansion (Architectural Note)

For long-term, the cleaner architecture is client-side expansion where the LLM generates query variants BEFORE calling `memory_context`. This could be enabled by:
1. Adding a `queryVariants: string[]` parameter to `memory_context`
2. Documenting the pattern in tool descriptions
3. The LLM naturally generates variants as part of its reasoning

This approach has zero server-side latency cost and leverages the LLM's full reasoning capability for query reformulation.

---
<!-- /ANCHOR:decision-phase-3-multi-query-retrieval-week-5-6-138 -->

<!-- ANCHOR:decision-phase-4-indexing-quality-deferred-138 -->
## 7. Phase 4: Indexing Quality (Deferred)

**Impact: Medium | Effort: ~300-400 LOC | Risk: Medium (requires re-indexing)**

### 7.1 Structure-Aware Document Parsing

**New File:** `scripts/lib/structure-aware-chunker.ts` (~300 LOC)
**Dependencies:** `remark` + `remark-gfm` (small npm packages)

**Rules:**
1. Keep code blocks as atomic chunks (never split mid-block)
2. Keep tables as single chunks
3. Respect heading hierarchy for chunk boundaries
4. Don't split mid-paragraph
5. Preserve ANCHOR tags as chunk boundaries (already partially supported)

**Migration:** Existing memories need re-embedding. Can be done as background job using `memory_index_scan` with a flag to force re-indexing.

**Timing:** Schedule during next major version bump or when corpus exceeds 1,000 memories.

---
<!-- /ANCHOR:decision-phase-4-indexing-quality-deferred-138 -->

<!-- ANCHOR:decision-deferred-hierarchical-pre-routing-138 -->
## 8. Deferred: Hierarchical Pre-Routing

**Impact: Low at current scale | Revisit at 5,000+ memories**

At 50-500 memories, pre-routing overhead exceeds search-space reduction benefit. The existing `spec_folder` SQL filter (Phase 0.4) already provides the most impactful "gate." Full hierarchical addressing (WiredBrain's `<Gate, Branch, Topic, Level>`) should be triggered automatically when `memory_stats` reports corpus size exceeding 5,000.

---
<!-- /ANCHOR:decision-deferred-hierarchical-pre-routing-138 -->

<!-- ANCHOR:decision-backward-compatibility-138 -->
## 9. Backward Compatibility

### Schema Impact: NONE

All 6 patterns operate at the search/reranking level. No changes to the v15 schema.

### API Compatibility: FULL

All 22 MCP tools remain backward compatible. Internal result ordering may change (MMR, TRM), but the response envelope format is unchanged. New optional metadata fields:

```typescript
interface EnhancedResultMeta {
  evidenceGap?: boolean;      // P5: TRM detected low confidence
  mmrApplied?: boolean;       // P4: MMR reranking was applied
  causalBoostWeight?: number; // P1: Enhanced graph boost score
  fallbackRetry?: boolean;    // P0: Adaptive fallback was triggered
  queryVariants?: string[];   // P3: Query expansion variants used
}
```

### Feature Flag Summary

| Flag | Phase | Default | Description |
|------|-------|---------|-------------|
| `useGraph` | 0 | `true` | Enable graph as retrieval channel |
| `SPECKIT_ADAPTIVE_FUSION` | 0 | `true` | Intent-aware weight adaptation |
| `enableCoActivation` | 0 | `true` | Spreading activation in search |
| `SPECKIT_MMR` | 1 | `true` | MMR diversity reranking |
| `SPECKIT_TRM` | 1 | `true` | Evidence gap detection |
| `SPECKIT_CAUSAL_BOOST` | 2 | `true` | Enhanced weighted graph traversal |
| `SPECKIT_QUERY_EXPANSION` | 3 | `false` | Template-based multi-query |
| `SPECKIT_STRUCTURE_PARSE` | 4 | `false` | Structure-aware chunking |

---
<!-- /ANCHOR:decision-backward-compatibility-138 -->

<!-- ANCHOR:decision-risk-registry-138 -->
## 10. Risk Registry

| ID | Risk | Phase | Probability | Impact | Mitigation |
|----|------|-------|-------------|--------|------------|
| R1 | MMR removes relevant results (false redundancy) | 1 | Low | Medium | Tunable lambda (0.5-0.8); dark-run A/B testing |
| R2 | TRM evidence gap false positives | 1 | Medium | Medium | Warning-only (not blocking); calibrate z-score empirically |
| R3 | Enhanced graph traversal exceeds 20ms at 3-hop | 2 | Medium | Low | Keep 2-hop default; 3-hop only for deep mode |
| R4 | Template query expansion generates irrelevant variants | 3 | Medium | Low | Conservative rules; original always included |
| R5 | Adaptive fusion degrades for unknown intent types | 0 | Low | Low | Fallback to static weights when intent confidence < 0.3 |
| R6 | Combined latency exceeds 200ms for auto mode | ALL | Medium | Medium | Progressive enablement; measure at each phase |
| R7 | Co-activation discovers too many tangential results | 0 | Low | Low | Cap at maxResults=20; apply after state filtering |

---
<!-- /ANCHOR:decision-risk-registry-138 -->

<!-- ANCHOR:decision-implementation-roadmap-summary-138 -->
## 11. Implementation Roadmap Summary

| Phase | Week | LOC | Files Changed | New Files | Key Deliverable |
|-------|------|-----|--------------|-----------|----------------|
| **0** | 1 | ~95 | 3 | 0 | Activate graph + adaptive fusion + co-activation + fallback |
| **1** | 2-3 | ~270 | 2 | 2 | MMR diversity + TRM evidence gap |
| **2** | 4 | ~120 | 2 | 0 | Weighted graph + field multipliers |
| **3** | 5-6 | ~250 | 3 | 1 | Template query expansion for deep mode |
| **4** | Deferred | ~300 | 2 | 1 | Structure-aware parsing |
| **Total** | 6 weeks | ~1,035 | 12 | 4 | Full hybrid RAG upgrade |

---
<!-- /ANCHOR:decision-implementation-roadmap-summary-138 -->

<!-- ANCHOR:decision-success-metrics-138 -->
## 12. Success Metrics

| Metric | Current Baseline | Phase 0 Target | Phase 1 Target | Phase 3 Target |
|--------|-----------------|---------------|---------------|---------------|
| Zero-result rate | Unknown | <5% | <2% | <1% |
| Token utilization (diversity) | ~40% unique info | 60% | 80% | 85% |
| Causal context coverage | 20% (boost only) | 40% (channel) | 50% | 60% |
| Search latency (auto) | 30-80ms | 35-85ms | 55-120ms | 55-120ms |
| Search latency (deep) | 30-80ms | 35-85ms | 55-120ms | 105-165ms |
| Evidence gap warnings | 0 | 0 | ~10% of queries | ~10% |

---
<!-- /ANCHOR:decision-success-metrics-138 -->

<!-- ANCHOR:decision-next-steps-138 -->
## 13. Next Steps

| Action | Command | When |
|--------|---------|------|
| Create implementation plan | `/spec_kit:plan "Hybrid RAG Phase 0-1 upgrade"` | After review |
| Start Phase 0 implementation | `/spec_kit:implement` | After plan approval |
| Save research context | `/memory:save 138-hybrid-rag-fusion` | Now |
| Create handover for Phase 2+ | `/spec_kit:handover 138-hybrid-rag-fusion` | After Phase 1 |
<!-- /ANCHOR:decision-next-steps-138 -->

