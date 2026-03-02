# Wave 1: Correction Validation Report

> **Date:** 2026-02-26
> **Scope:** Validate 6 corrections claimed by document 141 against document 140
> **Method:** Direct codebase verification against source files

---

## Summary

| # | Correction | Verdict | Notes |
|---|---|---|---|
| 1 | LightRAG uses raw degree, not log(1+degree) | VALID | 140 misattributed formula; 141's correction is accurate |
| 2 | PageIndex DocScore penalizes N=1 by 29% | VALID | Math is correct; replacement formula (MPAB) is sound |
| 3 | Two parallel disconnected scoring systems | PARTIALLY VALID | Systems exist but "disconnected" overstates the gap |
| 4 | Chunk collapsing only runs when includeContent=true | VALID | Directly confirmed in source code |
| 5 | sqlite-vec INT8 incompatible with per-record quantization | VALID | Technical assessment is accurate |
| 6 | memory-indexer.ts compile-time import into MCP server | VALID | Confirmed via direct import statement |

---

## Correction 1: LightRAG Degree Ranking

### Original 140 Claim
Document 140, Section 3.3, states:
> "Node degree (number of connections) serves as a ranking signal: highly-connected entities are considered more important. Relationships are sorted by `(degree, weight)`."

And in Section 3.3's relevance note proposes:
```
causal_boost = log(1 + causal_edge_count) * causal_boost_weight
```

This implies LightRAG uses `log(1 + degree)` as a boost formula.
[SOURCE: 140-analysis, lines 217-222]

### 141 Correction
LightRAG does NOT use `log(1 + degree)` anywhere. The formula appears in the Microsoft GraphRAG paper, not LightRAG. Degree is used ONLY as a secondary sort key for edge ranking (simple integer sort), not as a multiplicative boost in fusion scoring. Entity ranking does NOT use degree at all.
[SOURCE: 141-analysis, lines 276-285]

### Verification
Document 140 does NOT explicitly claim `log(1+degree)` is LightRAG's formula. It states the PATTERN from LightRAG (degree as ranking signal) and then PROPOSES a `log(1+degree)` formula as its own recommendation for the spec-kit system. However, the presentation is misleading -- it appears under the "LightRAG" pattern heading and is easily read as LightRAG's actual implementation.

Document 141 is correct that:
- LightRAG uses raw degree as an integer sort key for edges
- The `log(1+degree)` formula is NOT from LightRAG
- The formula is more reminiscent of Microsoft GraphRAG

However, 141 slightly overstates the correction. Document 140 proposes the formula under "Relevance: HIGH" as a suggested adaptation, not as a direct LightRAG quote. The misattribution is real but the framing is "pattern inspired by" rather than "exact copy of."

### Verdict: VALID

The correction is factually justified. Document 140's proposed `log(1+degree)` formula was presented in a way that implies it derives from LightRAG's approach, when LightRAG actually uses raw integer sorting only. The distinction matters for implementation -- a raw sort key vs. a logarithmic boost serve different purposes.

### Additional Note
Document 140 also claims in Section 2.2: "Sort relationships by `(degree, weight)` descending" as LightRAG behavior. Document 141 confirms degree IS used for edge sorting, so this specific claim in 140 is correct. The error is specifically in the recommended adoption formula, not the observation.

---

## Correction 2: PageIndex DocScore N=1 Penalty

### Original 140 Claim
Document 140, Section 2.3, presents the DocScore formula:
```
DocScore = (1 / sqrt(N + 1)) * SUM(ChunkScore(n))  for n=1..N
```
And states it "provides diminishing returns -- a document with 2 highly-relevant chunks scores higher than one with 10 weakly-relevant chunks."
[SOURCE: 140-analysis, lines 186-194]

Document 140 recommends this formula for multi-chunk scoring in the spec-kit system (Section 3.4, Section 6.1).

### 141 Correction
For a single-chunk memory (N=1):
```
DocScore = 1/sqrt(2) * ChunkScore = 0.707 * ChunkScore
```
This is a 29% penalty on unchunked memories. Since ~90% of memories are unchunked, this would systematically degrade rankings.
[SOURCE: 141-analysis, lines 307-313]

### Verification
The math is correct: `1/sqrt(1+1) = 1/sqrt(2) = 0.7071`, meaning a 29.3% penalty for any N=1 memory.

Document 140 never addresses the N=1 case explicitly. It focuses on the "diminishing returns" property without analyzing the base case behavior. This is a genuine analytical gap in document 140.

The proposed MPAB replacement formula in 141 is mathematically sound:
- For N=1: `MPAB = S_max` (no penalty) -- correct
- For N>1: bonus attenuated by `sqrt(N)` -- provides diminishing returns without base penalty

### Verdict: VALID

This is a clear analytical error in document 140. The DocScore formula was recommended without analyzing its behavior at the system's most common case (single-chunk memories). The 141 correction and proposed MPAB alternative are both well-reasoned.

---

## Correction 3: Two Parallel Disconnected Scoring Systems

### Original 140 Claim
Document 140 describes a unified pipeline in Section 1.4:
> "4-channel hybrid search [...] RRF fusion (K=60) with adaptive intent-aware weight profiles [...] 3-stage reranking: cross-encoder, MMR diversity, composite scoring (5-factor)"

This implies composite scoring is integrated as the third reranking stage in a single pipeline.
[SOURCE: 140-analysis, lines 88-96]

### 141 Correction
Two parallel, disconnected scoring systems exist:
- System A: Hybrid Search RRF (real-time, per-query) in `rrf-fusion.ts`, `adaptive-fusion.ts`
- System B: Composite Factor-Based (batch-style, per-memory) in `composite-scoring.ts`

"These two systems are NOT integrated."
[SOURCE: 141-analysis, lines 158-176]

### Verification
Direct codebase investigation confirms:

1. **System A (RRF pipeline) exists**: `hybridSearchEnhanced()` in `hybrid-search.ts`, `fuseResultsMulti()` in `rrf-fusion.ts`, `hybridAdaptiveFuse()` in `adaptive-fusion.ts`.
   [SOURCE: memory-search.ts:790-1000]

2. **System B (composite scoring) exists**: `calculateFiveFactorScore()` and `calculateCompositeScore()` in `composite-scoring.ts`, with two distinct weight configurations (5-factor REQ-017 and 6-factor legacy).
   [SOURCE: composite-scoring.ts:82-127, 393-533]

3. **The connection between them is NOT zero**: `calculateFiveFactorScore` IS imported and called by `attention-decay.ts` (line 245-246), which is part of the cognitive layer. This means System B scores DO influence working memory attention signals, which in turn affect the session boost applied in `postSearchPipeline`.
   [SOURCE: attention-decay.ts:28, 245-246]

4. **However**, composite scoring functions (`applyFiveFactorScoring`, `applySixFactorScoring`) are NOT called directly from `memory-search.ts` or the `postSearchPipeline()`. A grep of the handlers directory for these function names returns zero hits.
   [SOURCE: Grep of handlers/ for calculateCompositeScore, calculateFiveFactorScore, applyFiveFactorScoring -- no matches in memory-search.ts]

5. **The claim about "two parallel scoring systems" is accurate** in that the RRF pipeline and the composite scoring engine produce independent rankings. However, they are not COMPLETELY disconnected -- there is an indirect connection through the attention decay system.

### Verdict: PARTIALLY VALID

The two scoring systems do exist and they are not directly integrated in the search pipeline. However, calling them "disconnected" slightly overstates the case -- there is an indirect connection through the cognitive layer (attention-decay.ts uses `calculateFiveFactorScore`). The core observation is correct: composite scoring is not applied as a stage in the `postSearchPipeline()` function, which is the main search path.

### Additional Note
Document 141 claims `postSearchPipeline()` "applies System B scores as post-hoc adjustments to System A results, but the interaction is additive and poorly calibrated." This specific sub-claim appears INCORRECT based on the code review -- `postSearchPipeline()` does NOT call any composite scoring functions directly. The pipeline applies session boost, causal boost, intent weights, artifact routing, cross-encoder reranking, and evidence gap detection -- but NOT composite scoring. The interaction 141 describes may not actually exist in the search path.

---

## Correction 4: Chunk Collapsing Only Runs When includeContent=true

### Original 140 Claim
Document 140, Section 6.1, states:
> "`collapseAndReassembleChunkResults()` keeps only the first chunk hit per parent, discarding subsequent chunk scores"

This implies chunk collapsing runs as part of the normal search pipeline.
[SOURCE: 140-analysis, line 339]

### 141 Correction
Chunk collapsing only runs when `includeContent=true`. The default path (`includeContent=false`) returns raw chunk rows WITHOUT parent deduplication.
[SOURCE: 141-analysis, lines 212-219]

### Verification
Direct source code confirms this EXACTLY:

```typescript
// memory-search.ts, lines 1002-1012
const chunkPrep = includeContent
    ? collapseAndReassembleChunkResults(finalResults)
    : {
        results: finalResults,
        stats: {
          collapsedChunkHits: 0,
          chunkParents: 0,
          reassembled: 0,
          fallback: 0,
        },
      };
```
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1002-1012]

When `includeContent=false` (the default), the results pass through completely unmodified -- no chunk collapsing occurs. This means duplicate parent entries from different chunks appear as separate results.

### Verdict: VALID

This correction is directly confirmed by the source code. Document 140's framing implied chunk collapsing was always active, which is materially misleading for anyone planning improvements to the chunk scoring pipeline.

---

## Correction 5: sqlite-vec INT8 Incompatible with Per-Record Quantization

### Original 140 Claim
Document 140, Section 2.1, describes zvec's per-record INT8 quantization and positions it as transferable:
> "zvec's most transferable pattern is per-record streaming quantization"

Section 6.2 rates it as a scale-dependent enhancement with "LOW now, HIGH at 10K+" impact.
[SOURCE: 140-analysis, lines 105-135, 350]

Document 140 does acknowledge "No SIMD in Node.js" as a constraint (Section 5.1) but frames INT8 as primarily a storage optimization rather than analyzing sqlite-vec compatibility.

### 141 Correction
sqlite-vec's built-in `vec_quantize_i8` uses a FIXED range [-1.0, 1.0] with uniform scaling. For pre-normalized embeddings where dimensions range from -0.3 to 0.3, most of the INT8 range is wasted. This makes sqlite-vec INT8 fundamentally incompatible with per-record quantization (which requires per-record min/max to maximize precision).
[SOURCE: 141-analysis, lines 337-347]

### Verification
Document 140 does NOT discuss sqlite-vec's quantization approach at all. It describes zvec's quantization (which computes per-record scale/bias) but never analyzes whether this can be achieved within sqlite-vec's constraints.

A grep of the MCP server codebase for `vec_quantize_i8`, `int8`, or `INT8` returns zero hits in the search/storage code -- only `Uint8Array` usage in the co-activation module for reading raw embedding bytes. This confirms sqlite-vec is currently used purely in FP32 mode with no existing quantization infrastructure.

Document 141's assessment that implementing per-record quantization would require custom JS-side computation (bypassing sqlite-vec's built-in quantization) is technically sound. The recommendation to defer is well-supported by the scale analysis.

### Verdict: VALID

Document 140 failed to analyze the compatibility gap between zvec's per-record quantization approach and sqlite-vec's fixed-range quantization. Document 141 correctly identifies this as a fundamental incompatibility that makes the "quick win" framing misleading.

### Additional Note
Document 140's storage reduction table (Section 2.1) IS mathematically correct for zvec's per-record approach. The error is in implying this directly translates to the spec-kit system's sqlite-vec backend.

---

## Correction 6: memory-indexer.ts Compile-Time Import into MCP Server

### Original 140 Claim
Document 140 does NOT explicitly claim clean separation. However, Section 1.4 describes the "spec-kit Memory MCP (Internal Baseline)" as a self-contained system without noting the cross-boundary coupling.
[SOURCE: 140-analysis, lines 83-98]

### 141 Correction
`memory-indexer.ts` directly imports `vectorIndex.indexMemory()` from the MCP server's internal module via compile-time import, NOT via MCP protocol. They also share the same SQLite database file.
[SOURCE: 141-analysis, lines 248-260]

### Verification
Direct source code confirms:

```typescript
// memory-indexer.ts, lines 13-14
import * as vectorIndex from '@spec-kit/mcp-server/lib/search/vector-index';
import { DB_UPDATED_FILE } from '@spec-kit/mcp-server/core/config';
```
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:13-14]

Additional compile-time imports from MCP server internals also found in:
- `scripts/lib/retry-manager.ts` (re-exports from `@spec-kit/mcp-server/lib/providers/retry-manager`)
- `scripts/evals/run-performance-benchmarks.ts` (imports session-boost, causal-boost, working-memory, extraction-adapter directly)
[SOURCE: Grep results across scripts/ directory]

### Verdict: VALID

The compile-time coupling is real and documented in the import statements. This is not just `memory-indexer.ts` -- multiple scripts in the spec-kit logic layer directly import MCP server internals, making the boundary permeable.

### Additional Note
This is less of a "correction" to document 140 and more of a NEW finding, since document 140 never made an explicit claim about clean separation. Document 140's architecture description simply didn't cover the boundary. Calling it a "correction" slightly mischaracterizes what 140 said; it is more accurately a "gap" in 140's coverage.

---

## Uncorrected Claims in Document 140 That Should Be Questioned

### Q1: "10-hop causal traversal" (Section 6.3)
Document 140 claims: "10-hop causal traversal" as a strength.
Document 141 references: "2-hop BFS" in causal-boost.ts (line 137).

The max depth parameter in `memory_drift_why` allows up to 10 hops (MCP tool parameter), but `causal-boost.ts` uses `maxHops: 2` for the actual search-time boost. Document 140 conflates the analysis tool's capability with the search-time implementation. Neither document explicitly reconciles this discrepancy.

### Q2: "3-stage reranking: cross-encoder, MMR diversity, composite scoring" (Section 1.4)
Document 140 describes composite scoring as the 3rd reranking stage. Based on codebase verification, composite scoring is NOT called in the `postSearchPipeline()` function at all. The actual post-search stages are: state filtering, session boost, causal boost, intent weighting, artifact routing, cross-encoder reranking, and evidence gap detection. Composite scoring exists separately in the attention-decay cognitive layer. This claim in 140 is misleading.

### Q3: BM25 as separate channel (Section 1.4)
Document 140 lists "4-channel hybrid search: vector, FTS5, in-memory BM25, causal graph." Document 141 notes HIGH correlation between FTS5 and BM25 (Section 5.2) but does not question whether BM25 is truly a separate channel or a redundant one. The claim should be scrutinized: if FTS5 is "effectively a superset" of BM25 (as 141 states), then calling it "4-channel" may overstate the effective diversity.

### Q4: "learnFromSelection() at line 3882" (Section 6.1)
Document 140 cites `vector-index-impl.ts:3882` as the location. Document 141 cites `vector-index-impl.ts:2872`. The actual export is at line 3882 (confirmed by grep). The implementation function `learn_from_selection` that gets aliased to `learnFromSelection` may be at a different line. Both documents agree the function is never called; the line number discrepancy is minor but suggests 141 may have been looking at a different version or alias.

### Q5: Convergence Bonus characterization
Document 140 states: "CONVERGENCE_BONUS = 0.10" as part of RRF fusion (Section 1.4). Neither document analyzes whether this 10% bonus for multi-channel presence is sufficient, too weak, or well-calibrated. Given 141's finding of HIGH FTS5/BM25 correlation, many results may receive convergence bonuses from essentially redundant channels, inflating scores without genuine diversity signal.

### Q6: "No memory summaries" gap (Section 6.1)
Document 140 flags this as a HIGH-impact gap. Document 141 does not correct it but also does not investigate whether trigger phrases effectively serve as lightweight summaries already. Given that trigger phrases are used for pattern matching and attention signals, they partially fulfill the "pre-filter" role that summaries would serve.

---

## Cross-Document Consistency Issues

### Issue 1: Line Number Discrepancies
- 140 cites `learnFromSelection` at line 3882
- 141 cites it at line 2872
- Actual export at line 3882 (grep-confirmed)

### Issue 2: Composite Scoring Factor Count
- 140 describes "5-factor composite" in Section 1.4
- 141 initially says "6 factors" in Section 3.2, then describes both the 5-factor (REQ-017) and 6-factor-legacy models
- Source code confirms BOTH exist: 5-factor at line 393 and 6-factor-legacy at line 426
- Neither document clearly states which model is actually used in the search path (answer: neither directly)

### Issue 3: Co-activation Multiplier
- 141 states co-activation boost is "nearly invisible at 0.1x" (Section 3.2)
- This is presented as a finding but not as a correction to 140
- Document 140 does not mention co-activation at all, which is itself a gap

---

## Final Assessment

**Document 140** is a solid architectural survey with good pattern identification but makes several presentation errors that imply closer alignment between external systems and the spec-kit codebase than actually exists. Its most significant omissions are: (a) failure to analyze the N=1 case for DocScore, (b) failure to analyze sqlite-vec INT8 compatibility, and (c) incorrectly describing composite scoring as part of the search pipeline.

**Document 141** provides mostly accurate corrections supported by Grade A evidence (direct codebase analysis). Its main weakness is occasional overstatement -- particularly claiming "disconnected" systems when there is indirect coupling, and framing the compile-time import as a "correction" when 140 never made the opposing claim.

**Overall: 5 of 6 corrections are VALID, 1 is PARTIALLY VALID. Document 141 reliably improves upon document 140's accuracy.**
