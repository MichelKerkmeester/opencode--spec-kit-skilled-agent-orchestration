---
title: "Tasks: 138-hybrid-rag-fusion [002-hybrid-rag-fusion/tasks]"
description: "Target File: lib/search/hybrid-search.ts"
trigger_phrases:
  - "tasks"
  - "138"
  - "hybrid"
  - "rag"
  - "fusion"
  - "002"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Tasks: 138-hybrid-rag-fusion

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

<!-- ANCHOR: tasks-phase-0-138 -->
## Phase 0: Activate Assets
**Target File:** `lib/search/hybrid-search.ts`
- [x] **Refactor `hybridSearchEnhanced()`:** Replace hardcoded `[1.0, 0.8, 0.6]` weights with an invocation of `hybridAdaptiveFuse(intent)`.
- [x] **Activate Graph Routing:** Modify `hybridSearchEnhanced()` configuration object to default `useGraph: true`, mapping the causal relationships directly into the RRF fusion array.
- [x] **Activate Co-Activation:** In `hybridSearchEnhanced()`, inject `await spreadActivation(top5_ids)` after the RRF fusion step and before final metadata formatting.
- [x] **Implement Adaptive Fallback:** Wrap the primary `Promise.all` scatter block.
  ```typescript
  let results = await executeScatter(query, { min_similarity: 0.3 });
  if (results.length === 0) {
      results = await executeScatter(query, { min_similarity: 0.17 });
      metadata.fallbackRetry = true;
  }
  ```
<!-- /ANCHOR: tasks-phase-0-138 -->

<!-- ANCHOR: tasks-phase-1-138 -->
## Phase 1: Diversity and Confidence (TRM/MMR)
**Target Files:** `lib/search/mmr-reranker.ts` (NEW), `lib/search/evidence-gap-detector.ts` (NEW)
- [x] **MMR Algorithm Calculation:** Implement `applyMMR(candidates, lambda, limit)` utilizing a pairwise cosine similarity matrix on the returned `sqlite-vec` embeddings.
  ```typescript
  // Core MMR calculation loop snippet
  const sim = computeCosine(candidate.embedding, selectedMemory.embedding);
  const mmrScore = (lambda * candidate.score) - ((1 - lambda) * maxSimToSelected);
  ```
- [x] **Intent-Mapped Lambdas:** Create a configuration map where `intent="understand"` sets MMR `lambda=0.5` (high diversity), and `intent="fix_bug"` sets `lambda=0.85` (high relevance). *(Wired: `INTENT_LAMBDA_MAP` in intent-classifier.ts, consumed by hybrid-search.ts MMR call)*
- [x] **TRM Confidence Check:** Write `detectEvidenceGap(rrfScores: number[])` that calculates the Mean and Standard Deviation of the array. If `(topScore - mean) / stdDev < 1.5`, return `{ gapDetected: true }`.
- [x] **Warning Injection:** Modify the MCP markdown formatter in `memory-search.ts` to forcefuly prepend `> **⚠️ EVIDENCE GAP DETECTED:** Retrieved context has low mathematical confidence. Consider first principles.` if TRM returns true.
<!-- /ANCHOR: tasks-phase-1-138 -->

<!-- ANCHOR: tasks-phase-2-138 -->
## Phase 2: Graph & Weights
**Target Files:** `lib/search/sqlite-fts.ts`, `lib/search/causal-edges.ts`
- [x] **FTS5 SQL Upgrade:** Rewrite the standard `WHERE ... MATCH ?` SQL statement to use the native weighted `bm25()` ranker to elevate `title` matches 10x. *(Wired: ftsSearch() in hybrid-search.ts now delegates to fts5Bm25Search() from sqlite-fts.ts)*
  ```sql
  -- Target SQL Implementation
  SELECT m.id, m.title, bm25(memory_fts, 10.0, 5.0, 1.0, 2.0) AS fts_score
  FROM memory_fts
  JOIN memories m ON m.id = memory_fts.rowid
  WHERE memory_fts MATCH ?
  ORDER BY fts_score LIMIT ?;
  ```
- [x] **Graph Weights CTE:** Update `causal-edges.ts` SQL CTE. Add a multiplier directly into the accumulator:
  ```sql
  -- Add to the recursive CTE accumulator
  (cte.score * CASE WHEN relation = 'supersedes' THEN 1.5 
                    WHEN relation = 'contradicts' THEN 0.8 
                    ELSE 1.0 END * edgeStrength) AS new_score
  ```
<!-- /ANCHOR: tasks-phase-2-138 -->

<!-- ANCHOR: tasks-phase-3-138 -->
## Phase 3: Multi-Query (RAG Fusion)
**Target File:** `lib/search/query-expander.ts` (NEW), `handlers/memory-search.ts`
- [x] **Synonym Utility:** Build `expandQuery(query: string)` that splits compound terms using standard Regex (`/(\b\w+\b)/g`) and checks against a static JSON `DOMAIN_VOCABULARY_MAP`.
- [x] **Scatter-Gather Execution:** In the MCP handler for `mode="deep"`, execute:
  ```typescript
  const variants = expandQuery(originalPrompt); // returns max 3
  const nestedResults = await Promise.all(variants.map(v => executeScatter(v)));
  const flattened = nestedResults.flat();
  // Pass flattened array into Reciprocal Rank Fusion
  ```
- [x] **Cross-Variant RRF:** Modify `rrf-fusion.ts` to accept multi-dimensional arrays, grouping identical memory IDs across variants and applying the `+0.10` convergence bonus.
<!-- /ANCHOR: tasks-phase-3-138 -->

<!-- ANCHOR: tasks-phase-4-138 -->
## Phase 4: Indexing Quality & Cognitive Layer
**Target Files:** `scripts/lib/structure-aware-chunker.ts` (NEW), `lib/manage/pagerank.ts` (NEW), `lib/search/intent-classifier.ts`
- [x] **AST Parsing:** Integrate `remark` + `remark-gfm` syntax tree parsing during the `generate-context.js` ingest phase. Ensure any node of type `code` or `table` bypasses text splitting.
- [x] **Batch PageRank:** Write batch PageRank SQL logic to execute iteratively (10 iterations) during `memory_manage` runs, storing the float value in `memory_index.pagerank_score`.
- [x] **Embedding Centroids:** Refactor `intent-classifier.ts` to compute 7 centroid embeddings during initialization. Replace regex checks with `Math.max(...centroids.map(c => dotProduct(c, queryEmb)))`. *(Completed 2026-02-21 using deterministic centroid embeddings with exported `INTENT_CENTROIDS`, `dotProduct`, and `calculateCentroidScore`.)*
- [x] **Tier Decay Modulation:** Update `fsrs.ts` decay math: `new_stability = old_stability * (1.0 - (decay_rate * TIER_MULTIPLIER[tier]))`.
- [x] **Read-Time Prediction Error:** Pipe the retrieved context payload through `prediction-error-gate.ts` just before MMR to flag read-time contradictions.
<!-- /ANCHOR: tasks-phase-4-138 -->

<!-- ANCHOR: tasks-phase-5-138 -->
## Phase 5: Test Coverage
**Target Directory:** `mcp_server/tests/`

### Phase 0 Tests (Update Existing)
- [x] **Update `adaptive-fusion.vitest.ts`:** Add tests for intent-weighted RRF activation via `hybridAdaptiveFuse(intent)`. Verify weight vectors change per intent type (e.g., `find_spec` heavily weights FTS5, `explore` balances evenly).
- [x] **Update `hybrid-search.vitest.ts`:** Add tests for `useGraph: true` default routing. Verify causal edges are included in the scatter-gather `Promise.all` array as a primary source. *(Done: A1 added "C138-P0: useGraph:true Default Routing" suite with 5 tests)*
- [x] **Update `co-activation.vitest.ts`:** Add pipeline integration test verifying `spreadActivation(top5_ids)` runs post-RRF and enriches results with temporal neighbors. *(Done: co-activation.vitest.ts exists with 20 tests including C138 pipeline integration suite)*
- [x] **Create `adaptive-fallback.vitest.ts` (NEW):** Test two-pass fallback: verify 0-result at `min_similarity=0.3` triggers retry at `0.17`, verify `metadata.fallbackRetry=true` flag, verify non-zero results skip retry. *(Done: file exists, tests passing)*

### Phase 1 Tests (New Files)
- [x] **Create `mmr-reranker.vitest.ts` (NEW):** Test `applyMMR(candidates, lambda, limit)` — verify identical candidates are deduplicated, verify lambda=0.5 maximizes diversity, verify lambda=0.85 preserves relevance order, verify N=20 hardcap, verify O(N²) completes in <2ms for N=20, verify output limit is respected.
- [x] **Create `evidence-gap-detector.vitest.ts` (NEW):** Test `detectEvidenceGap(rrfScores)` — verify Z-score < 1.5 returns `gapDetected: true`, verify well-distributed scores return `gapDetected: false`, verify edge cases (single score, all identical scores, empty array).
- [x] **Update `intent-classifier.vitest.ts`:** Add tests for intent-to-lambda mapping configuration (`understand`→0.5, `fix_bug`→0.85, etc.).
- [x] **Update `handler-memory-search.vitest.ts`:** Add test verifying `[EVIDENCE GAP DETECTED]` warning is prepended to markdown payload when TRM flags low confidence. *(Done: handler-memory-search.vitest.ts exists with 10 tests including C138 evidence gap warning tests)*

### Phase 2 Tests (Update Existing)
- [x] **Update `bm25-index.vitest.ts`:** Add tests for weighted `bm25(memory_fts, 10.0, 5.0, 1.0, 2.0)` SQL. Verify title match (10x) outranks body match. Verify `trigger_phrases` match (5x) outranks generic content (2x).
- [x] **Update `causal-edges.vitest.ts` or `causal-edges-unit.vitest.ts`:** Add tests for relationship weight multipliers in recursive CTE: `supersedes`=1.5x, `contradicts`=0.8x, `caused`=1.3x. Verify `supersedes` chain outranks `caused` chain. *(Done: causal-edges-unit.vitest.ts + causal-boost.vitest.ts exist with multiplier tests)*

### Phase 3 Tests (New + Update)
- [x] **Create `query-expander.vitest.ts` (NEW):** Test `expandQuery(query)` — verify compound terms are split, verify synonym map lookups work, verify max 3 variants returned, verify original query is always included, verify unknown terms return only original.
- [x] **Update `unit-rrf-fusion.vitest.ts`:** Add tests for multi-dimensional array input (cross-variant RRF). Verify identical memory IDs across variants receive `+0.10` convergence bonus. Verify single-variant input behaves identically to current behavior. *(Done: A3 added 6 cross-variant RRF tests)*
- [x] **Update `hybrid-search.vitest.ts`:** Add test for `mode="deep"` scatter-gather execution verifying `Promise.all` parallelism with expanded query variants. *(Done: hybrid-search.vitest.ts updated with scatter-gather tests)*

### Phase 4 Tests (New + Update)
- [x] **Create `structure-aware-chunker.vitest.ts` (NEW):** Test AST-based chunking — verify markdown tables are never split mid-row, verify code blocks are kept atomic, verify headings stay with their content, verify chunk size limits are respected. *(Done: structure-aware-chunker.vitest.ts exists with 9 tests T1-T9)*
- [x] **Create `pagerank.vitest.ts` (NEW):** Test batch PageRank — verify 10 iterations converge, verify `pagerank_score` is written to `memory_index`, verify no `SQLITE_BUSY` errors during batch execution, verify isolated nodes get minimum score. *(Done: pagerank.vitest.ts exists with 10 tests T1-T10)*
- [x] **Update `intent-classifier.vitest.ts`:** Add tests for centroid-based classification replacing regex. Verify 7 centroid embeddings are computed at init. Verify `dotProduct` distance correctly classifies all 7 intent types. *(Completed: `C138-T0`, `C138-T0b`, `C138-T0c`; targeted run `vitest tests/intent-classifier.vitest.ts` = 54/54 passing.)*
- [x] **Update `fsrs-scheduler.vitest.ts`:** Add tests for tier decay modulation: verify Constitutional tier uses `TIER_MULTIPLIER=0.1` (minimal decay), verify Scratch tier uses `3.0` (rapid decay). Verify formula: `new_stability = old_stability * (1.0 - (decay_rate * TIER_MULTIPLIER[tier]))`. *(Done: fsrs-scheduler.vitest.ts exists with tier decay tests)*
- [x] **Update `prediction-error-gate.vitest.ts`:** Add read-time contradiction test: verify contradicting Constitutional+Scratch memories trigger explicit flag in response payload. *(Done: prediction-error-gate.vitest.ts exists with 49 tests including C138 read-time contradiction flagging suite)*

### Integration Tests
- [x] **Create `integration-138-pipeline.vitest.ts` (NEW):** End-to-end pipeline test covering the full `hybridSearchEnhanced()` flow: intent classification → scatter (vector + FTS5 + graph) → adaptive RRF fusion → co-activation → TRM check → MMR pruning → markdown serialization. Verify total latency < 120ms. Verify output respects 2000-token budget.
- [x] **Update `integration-search-pipeline.vitest.ts`:** Add regression guards ensuring the new pipeline doesn't break existing search behavior when feature flags are `false`. *(Done: integration-search-pipeline.vitest.ts + graph-regression-flag-off.vitest.ts 18 regression tests)*
<!-- /ANCHOR: tasks-phase-5-138 -->

## Consolidation Tasks (2026-02-22)

- [x] Merge command-alignment outcomes into `supplemental/command-alignment-summary.md`
- [x] Merge non-skill-graph outcomes into `supplemental/non-skill-graph-consolidation-summary.md`
- [x] Add `supplemental-index.md` and link consolidated evidence
- [x] Confirm this folder remains the only active RAG lifecycle set
