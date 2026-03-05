# Wave 2: Implementation Feasibility Assessment

> **Date:** 2026-02-26
> **Scope:** Code sketches from 140-recommendations and 141-deep-dive documents
> **Method:** Type checking, integration point verification, edge case analysis, performance review

---

## 1. Evaluation Matrix

| Rec | Code Sketch | Quality | Ready? | Issues | Fix Required |
|-----|-------------|---------|--------|--------|--------------|
| **R1 (140)** | `aggregateChunkScoresToParent()` | **B** | Near | Wrong type (`SearchResult` vs `MemorySearchRow`); `_chunkHits` not on type | Change type to `MemorySearchRow`; add `_chunkHits` to interface or use `metadata` |
| **R1 (141-MPAB)** | `S_max + 0.3 * SUM(S_remaining) / sqrt(N)` | **C** | No | **Division by zero when N=0** (empty scores after removing max); formula is pseudocode not TypeScript; no function body provided | Write actual function; guard `N=0` case (return `S_max` directly) |
| **R4 (140)** | `getCausalDegree()` + batch SQL | **B** | Near | References `db` without import; batch SQL uses `IN (?, ?, ...)` placeholder which needs dynamic binding; `causal_edges` uses `source_id TEXT` not `INTEGER` | Fix column type awareness; use parameterized batch query builder |
| **R4 (141-typed)** | `computeDegreeScore()` | **C** | No | **`MAX_TYPED_DEGREE` is undefined** -- neither constant nor computed; `getCausalEdges()` does not exist as a function (actual API is `getCausalChain()`); edge object shape mismatch (`e.relation` vs actual causal_edges schema) | Define `MAX_TYPED_DEGREE` as a computed global or per-query max; replace `getCausalEdges` with actual DB query; verify edge shape |
| **R5 (140)** | `quantizeRecord()` | **A** | Yes | Mathematically sound; handles norm=0 implicitly via `1e-7` floor; correct clamping | Minor: add explicit `norm === 0` guard for clarity; otherwise production-ready algorithm |
| **R11 (140)** | `learnFromSelection` caller sketch | **C** | No | `getLastQueryForMemory()` does not exist; no query-memory provenance tracking in current codebase; "Option A" and "Option B" are both incomplete | Must build query provenance tracking first (store last query per session) |
| **R11 (141-safeguards)** | Safeguard rules (top-3 threshold) | **C** | No | **"Only learn when NOT in top 3" requires knowing the rank at validation time**, but `memory_validate` has no `rank` or `query` parameter; no mechanism to pass search context to validate handler | Must add `query_text` and `result_rank` fields to validate handler or build session-level provenance store |
| **R12 (140)** | `expandViaEmbedding()` | **C** | No | `vectorSearch()` with `columnsOnly` parameter does not exist in actual API; `generateEmbedding()` is async but sketch does not show integration with sync trigger-matching path; `JSON.parse(result.trigger_phrases)` assumes string but type is `string[] \| null` | Rewrite against actual `enhancedSearch()` or `vector_search_enriched()` API; fix type assumptions |
| **R2 (140)** | `enforceChannelDiversity()` | **B** | Near | Logic is sound; operates on `FusionResult` which has `sources[]` (verified); edge case: if all results come from single channel and `minPerChannel=1`, guaranteed list equals full list (correct behavior) | Minor: add early-return when `results.length <= limit` to avoid unnecessary processing |
| **N1 (141-RSF)** | RSF formula pseudocode | **B** | Near | Formula is mathematically correct; `epsilon` prevents div-by-zero; but no TypeScript implementation provided -- only mathematical notation | Need to write actual function; straightforward translation from formula |
| **N4 (141-cold-start)** | `alpha * exp(-elapsed_hours / tau)` | **B** | Near | **Does NOT conflict with FSRS** -- different domains (FSRS uses power-law on days with stability parameter; N4 uses exponential on hours with fixed tau); formula is additive not multiplicative so no interference; edge case: `elapsed_hours=0` yields full boost (correct) | Add to `composite-scoring.ts` as 6th factor; ensure `created_at` timestamp is always available |
| **R18 (141-cache)** | `embedding_cache` schema | **A** | Yes | **Hash collision on `PRIMARY KEY (content_hash, model_id)`**: SHA-256 collision probability is ~1 in 2^128 for random inputs -- effectively zero for this corpus size; schema is clean and correct; `content_hash` already exists in `memory_index` table | Production-ready schema; add `UNIQUE` constraint on query as safeguard; consider TTL column for cache eviction |
| **R17 (141-fan)** | Fan-effect divisor | **A** | Yes | 5-LOC change; `Math.sqrt(neighborMap.size)` is correct; when `neighborMap.size=0` there are no neighbors so loop body never executes (safe); when `size=1`, divisor is 1.0 (no effect, correct) | Production-ready; add test case |
| **R15 (141-router)** | Query complexity router | **B** | Near | Conceptually sound; reuses intent classifier; no code sketch provided in detail -- only routing table | Write ~100 LOC implementation; straightforward conditional logic |

---

## 2. Detailed Analysis of Specific Questions

### Q1: R1 (MPAB) -- Division by zero when N=0?

**Formula:** `S_max + 0.3 * SUM(S_remaining) / sqrt(N)`

**Answer: YES, this is a bug.** When `scores` has exactly 1 element, `S_remaining` is empty (length 0), and `N` (count of remaining scores) is 0. `sqrt(0) = 0`, causing division by zero.

**However:** The doc-141 text says "N=1: MPAB = S_max (no penalty)" -- implying the N=0 case is handled by an implicit guard. The formula as written does not encode this guard. The text-level specification is correct but the formula notation is incomplete.

**Fix:** The implementation MUST include:
```typescript
if (scores.length <= 1) return scores[0] ?? 0;
const sMax = Math.max(...scores);
const remaining = scores.filter(s => s !== sMax); // or splice after finding max index
const N = remaining.length;
return sMax + 0.3 * remaining.reduce((a, b) => a + b, 0) / Math.sqrt(N);
```

**Note:** There is a secondary issue -- if multiple scores equal `sMax`, `filter(s => s !== sMax)` removes ALL of them. Use index-based removal instead.

**Grade: C** -- Requires implementation with guards before use.

### Q2: R4 -- Where does MAX_TYPED_DEGREE come from?

**Answer: Undefined in both documents.** Neither doc-140 nor doc-141 specifies whether `MAX_TYPED_DEGREE` is:
- (a) A hardcoded constant (like `MAX_TYPED_DEGREE = 50`)
- (b) Computed per-query as `max(typed_degree)` across all result candidates
- (c) A global statistic updated periodically

**Impact:** This is a normalization denominator. If hardcoded too low, high-degree nodes saturate at 1.0. If computed per-query, the degree score becomes relative (a node with degree 3 scores differently depending on whether the result set includes a degree-50 node).

**Recommendation:** Compute as `log(1 + max_observed_degree)` from a cached global query:
```sql
SELECT MAX(cnt) FROM (
  SELECT COUNT(*) as cnt FROM causal_edges GROUP BY source_id
  UNION ALL
  SELECT COUNT(*) as cnt FROM causal_edges GROUP BY target_id
)
```
Cache this value and refresh every N minutes or on graph mutation. This is O(E) but runs infrequently.

**Grade: C** -- Critical design decision missing; must be resolved before implementation.

### Q3: R11 -- How is "not in top 3" determined post-hoc?

**Answer: It cannot be determined with the current architecture.** The `memory_validate` handler receives only `{ id: number, wasUseful: boolean }`. It has:
- No `query` parameter (does not know what search produced this result)
- No `rank` parameter (does not know where the memory appeared in results)
- No session linkage to the search that surfaced the memory

**The doc-141 safeguard "only learn when selected memory was NOT in top 3" requires provenance tracking that does not exist.** Specifically, the system needs:

1. A session-scoped query log: `{ query_text, result_ids_ordered, timestamp }`
2. A way to correlate `memory_validate(id=X)` with the search that surfaced memory X
3. Rank lookup: `result_ids_ordered.indexOf(X) + 1`

**This is a prerequisite dependency on R13 (eval infrastructure).** Without R13's query logging, R11's safeguard cannot be implemented.

**Grade: C** -- Safeguard is architecturally sound but has an unacknowledged dependency.

### Q4: R18 -- Hash collision on PRIMARY KEY?

**Answer: Not a practical concern.** The `content_hash` in the existing codebase uses SHA-256 (verified from `memory-crud-types.ts` and save handlers). The probability of a SHA-256 collision for `content_hash + model_id` composite key is approximately 2^-128 for birthday-attack resistance at the corpus sizes involved (< 1M memories).

**However, there is a semantic concern:** If a user modifies a memory file, then reverts it, the cache returns the old embedding (correct behavior -- same content, same embedding). If the embedding MODEL changes but `model_id` stays the same (e.g., provider silently updates their model), the cache returns stale embeddings. **Mitigation:** Include model version hash in `model_id`, not just provider name.

**Grade: A** -- Schema is production-ready. Add model version awareness as defense-in-depth.

### Q5: N4 -- Conflict with FSRS v4 temporal decay?

**Answer: NO conflict.** The two decay functions operate in orthogonal domains:

| Property | FSRS v4 | N4 Cold-Start |
|----------|---------|---------------|
| **Formula** | `R(t) = (1 + 19/81 * t/S)^(-0.5)` | `boost = 0.15 * exp(-t/12)` |
| **Domain** | Power-law decay over days | Exponential decay over hours |
| **Parameter** | `S` (stability, grows with reviews) | `tau=12` (fixed half-life) |
| **Effect** | Decreases retrievability over time | Increases visibility of new items |
| **Application** | Factor in `calculateTemporalScore()` | Additive to composite score |
| **Interaction** | For new memories: S is small, R(t) starts near 1.0 and drops fast | For new memories: boost is 0.15, decays to negligible in 48h |

The two functions are **complementary, not conflicting:**
- FSRS penalizes new memories (low stability = fast decay = low retrievability)
- N4 counteracts this penalty temporarily (12-hour half-life boost)
- Net effect: new memories get a brief window of elevated visibility, then FSRS takes over

**Edge case:** A memory created, never accessed, with `stability=1.0`: After 24 hours, FSRS gives `R = (1 + 19/81 * 1/1)^(-0.5) = 0.635`. N4 gives `boost = 0.15 * exp(-24/12) = 0.020`. Total boost is negligible. FSRS dominates as intended.

**Grade: B** -- No conflict. Formula is sound. Implement as additive 6th factor in composite scoring.

---

## 3. TOP 3 Most Production-Ready Code Sketches

| Rank | Rec | Why |
|------|-----|-----|
| **1** | **R18 (embedding cache schema)** | Clean SQL schema; uses existing `content_hash` pattern; composite PK prevents duplicates; zero collision risk; ~50 LOC integration |
| **2** | **R17 (fan-effect divisor)** | 5 LOC; mathematically correct; all edge cases safe (empty neighbors, single neighbor); drop-in replacement in `co-activation.ts` |
| **3** | **R5 (INT8 quantization algorithm)** | Algorithm is textbook-correct; proper clamping, norm handling, scale computation; the function itself is production-ready even though the integration (schema migration, dual-store) needs more work |

---

## 4. TOP 3 Needing Most Rework

| Rank | Rec | Why |
|------|-----|-----|
| **1** | **R11 (safeguards)** | The "not in top 3" safeguard requires a query provenance system that does not exist; the `learnFromSelection` function itself works but has no safe invocation path; needs R13 as prerequisite; needs new handler parameters |
| **2** | **R4 (141-typed degree)** | Three simultaneous problems: `MAX_TYPED_DEGREE` undefined, `getCausalEdges()` API does not exist, edge object shape does not match codebase schema (`source_id` is TEXT not number); needs complete rewrite against actual `causal-edges.ts` API |
| **3** | **R12 (embedding expansion)** | References non-existent API (`vectorSearch` with `columnsOnly`); sync/async mismatch with trigger-matching pipeline; type assumptions wrong (`trigger_phrases` is already parsed in some paths, JSON string in others); needs rewrite against actual search infrastructure |

---

## 5. Cross-Document Conflicts

| Item | Doc-140 Says | Doc-141 Says | Resolution |
|------|-------------|-------------|------------|
| **R1 formula** | `sum / sqrt(N+1)` (DocScore) | `S_max + 0.3 * SUM(remaining) / sqrt(N)` (MPAB) | **Doc-141 is correct** -- DocScore penalizes N=1 by 29%; MPAB preserves single-chunk scores |
| **R4 approach** | Multiplicative boost in `composite-scoring.ts` | 5th RRF channel via typed-weighted degree | **Doc-141 is better** -- avoids double-counting with composite score; integrates naturally into fusion pipeline |
| **R1 type** | Uses `SearchResult` (shared type) | Does not provide code | **Neither is correct** -- actual function `collapseAndReassembleChunkResults` operates on `MemorySearchRow` (handler-local type), not `SearchResult` |
| **R4 SQL** | `SELECT COUNT(*) FROM causal_edges WHERE source_id = ? OR target_id = ?` with numeric params | `getCausalEdges(memoryId)` function call | **Doc-140 SQL is closer** but uses wrong column type (causal_edges uses TEXT ids, not INTEGER); doc-141 function does not exist |

---

## 6. Performance Assessment (at 1000+ memories)

| Rec | Complexity | At 1K Memories | Concern? |
|-----|-----------|----------------|----------|
| R1 (MPAB) | O(C) per parent, C = chunk count | ~5ms for 100 chunk hits | No |
| R4 (degree) | O(E) for batch, E = edges | ~10ms for 500 edges | No (batch query) |
| R4 (typed-degree per-item) | O(N * E/N) per query | ~20ms for 50 candidates | Marginal -- batch is preferred |
| R5 (quantize) | O(D) per record, D = dimensions | ~0.5ms per record | No |
| R11 (learn) | O(1) per selection | ~1ms | No |
| R12 (expansion) | O(K * search_cost) | ~200ms for K=3 expansions | **Yes** -- 3x embedding generation + 3x vector search; must be lazy/conditional |
| R18 (cache lookup) | O(1) hash lookup | ~0.1ms | No |
| N1 (RSF) | O(C * N) per fusion, C = channels, N = results | ~5ms | No |
| N4 (cold-start) | O(1) per result | ~0.01ms | No |

---

## 7. Summary Verdicts

### Production-Ready (Grade A): 3
- R18 (embedding cache schema), R17 (fan-effect divisor), R5 (quantization algorithm)

### Near-Ready (Grade B, minor fixes): 5
- R1-140 (type fix), R4-140 (column type fix), R2-140 (minor optimization), N1-RSF (needs code), N4-cold-start (needs integration code)

### Needs Significant Rework (Grade C): 5
- R1-141 MPAB (div-by-zero, no code body), R4-141 typed (undefined constant, wrong API), R11-safeguards (missing provenance), R12 (wrong API), R11-140 caller (missing infrastructure)

### Not Evaluable (no code provided): Remaining
- R6, R7, R8, R9, R10, R13, R15, R16, N2, N3, N5 -- these are architectural descriptions, not code sketches

---

*Assessment based on codebase verification against:*
- `handlers/memory-search.ts` (1526 lines, `MemorySearchRow` at line 65, `collapseAndReassembleChunkResults` at line 303)
- `lib/search/rrf-fusion.ts` (`FusionResult` interface at line 37, `RrfItem` at line 31)
- `lib/scoring/composite-scoring.ts` (`calculateFiveFactorScore` at line 399)
- `lib/cognitive/fsrs-scheduler.ts` (`calculateRetrievability` at line 83, power-law formula)
- `lib/search/vector-index-impl.ts` (`learn_from_selection` at line 2872)
- `lib/storage/causal-edges.ts` (`getCausalChain`, TEXT-typed `source_id`/`target_id`)
- `shared/types.ts` (`SearchResult` at line 198)
