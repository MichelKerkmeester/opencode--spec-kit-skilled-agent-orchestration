# Iteration 002: MCP Pipeline/Retrieval Correctness

## Findings

### P1-002-1: The live Stage 1 hybrid path never executes RRF or adaptive fusion
- Severity: P1
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:641-648`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:955-959`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:593-605`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:544-568`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:100-115`, `.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:262-388`
- Evidence: The runtime Stage 1 path calls `hybridSearch.collectRawCandidates(...)`, not a fused search entrypoint. `collectRawCandidates()` sets `skipFusion: true`, and `hybridSearchEnhanced()` returns early through `collectCandidatesFromLists(...)` before the RRF/adaptive fusion branch. That raw-candidate merge normalizes each channel independently, then `mergeRawCandidate()` keeps `score: Math.max(existingScore, incomingScore)` for duplicates instead of combining cross-channel evidence. The documented Stage 2 contract says fusion should be the authoritative scoring point, but the live handoff into Stage 2 is already a best-single-channel score.
- Impact: Hybrid ranking is incorrect at the core algorithm level. A memory hit by vector, BM25, FTS5, and graph does not gain the expected fused advantage over a memory that is strong in only one channel. This breaks result ranking, channel combination logic, and signal weighting assumptions throughout the rest of the pipeline.
- Fix: Either move real RRF/adaptive fusion into the live Stage 1 -> Stage 2 handoff, preserving per-channel postings and provenance for Stage 2 to combine, or stop using the `skipFusion` raw-candidate path for the production hybrid pipeline.

### P1-002-2: Stage 3 does not apply the documented MPAB aggregation formula
- Severity: P1
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:489-523`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:603-627`, `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:78-125`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:114-115`
- Evidence: The documented MPAB implementation computes `sMax + 0.3 * sum(remaining) / sqrt(N)`. The live Stage 3 path groups chunks by parent, elects `bestChunk`, reassembles the parent row from that chunk, then merges parent and non-chunk rows by whichever row already has the higher score. No call to `computeMPAB()` appears in this runtime path, and no equivalent aggregate score is computed from the rest of the chunk group before the parent row is ranked.
- Impact: Multi-chunk documents are under-scored versus the documented contract. Documents with several relevant chunks lose the intended aggregate bonus and can rank below weaker single-chunk results, which is a direct result-ranking correctness defect.
- Fix: Apply `computeMPAB()` across each chunk group before reassembly, then sync the parent row's score aliases (`score`, `rrfScore`, `intentAdjustedScore` when present) to the aggregated parent score before the final merge/sort.

### P1-002-3: Community injection can introduce partial rows that bypass min-state filtering
- Severity: P1
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:527-555`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:820-829`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:87-97`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:157-162`
- Evidence: `applyCommunityBoost()` injects rows that contain only `id`, `score`, and `_communityBoosted`. Stage 2 passes those rows onward with only graph-contribution metadata added. Stage 4 then resolves missing `memoryState` by falling back to the caller's minimum state, so a row with no hydrated state is treated as if it already satisfies the filter.
- Impact: Graph-injected rows with unknown state can survive Stage 4 even when the contract says final results should honor `minState`. Those same rows can also reach formatting without path, content, or other row metadata, producing incomplete or misleading final search results.
- Fix: Hydrate injected community members from `memory_index` before they re-enter the ranking pipeline, and treat missing `memoryState` as unknown or filter-fail until hydration is complete.

### P1-002-4: MMR always pushes non-embedded results behind embedded results
- Severity: P1
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:163-223`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:482-484`
- Evidence: The MMR step only diversifies rows that have embeddings. After MMR finishes, the code rebuilds the result list as `[...]diversifiedRows, ...nonEmbeddedRows]`, which appends every lexical-only or graph-only row after the full embedded set. When there are no chunk rows to collapse, Stage 3 returns that ordering unchanged.
- Impact: High-quality non-embedded candidates are systematically demoted below all embedded candidates whenever MMR is enabled. That is a ranking bug, not just a diversity preference, because it discards the original relevance ordering for an entire class of results.
- Fix: Reinsert non-embedded rows by their prior rank or score order instead of always appending them to the tail, or run diversity on the embedded subset while preserving the original global ordering boundaries for rows that MMR could not score.

### P2-002-5: The degree channel is built, then explicitly discarded in the live raw-candidate path
- Severity: P2
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:909-941`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:955-959`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:641-648`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:87-98`
- Evidence: `hybridSearchEnhanced()` constructs a `degree` ranked list when the feature is enabled, but the `skipFusion` return path filters `lists` to `list.source !== 'degree'` before candidates are returned. The live Stage 1 pipeline uses that raw-candidate path through `collectRawCandidates(...)`.
- Impact: Degree-only structural discoveries never reach later stages of the production 4-stage pipeline. Even if the broader fusion defect is fixed, the documented five-channel candidate stage is still incomplete in the current runtime path.
- Fix: Preserve `degree` candidates in the raw-candidate return path, or move degree postings into the real fusion stage so they participate in ranking like the other documented channels.

## Summary

- Reviewed the live retrieval path under `.opencode/skill/system-spec-kit/mcp_server/lib/`, with focus on Stage 1 to Stage 4 pipeline flow, hybrid fusion, scoring, graph integration, and result ranking.
- The main correctness issue is that the production hybrid path does not currently perform real multi-channel fusion. Additional ranking defects exist in MPAB aggregation, MMR reinsertion, and graph community injection.
- No pipeline-related root `.js` files were present directly under `.opencode/skill/system-spec-kit/mcp_server/` in the current tree, so this pass focused on the TypeScript runtime files that actually implement the pipeline.
- Findings in this pass: 5 total (`P0`: 0, `P1`: 4, `P2`: 1).

## JSONL

```jsonl
{"type":"iteration","run":2,"mode":"review","dimensions":["correctness"],"findingsSummary":{"P0":0,"P1":4,"P2":1},"findings":[{"id":"P1-002-1","severity":"P1","title":"The live Stage 1 hybrid path never executes RRF or adaptive fusion","file":"mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:641-648"},{"id":"P1-002-2","severity":"P1","title":"Stage 3 does not apply the documented MPAB aggregation formula","file":"mcp_server/lib/search/pipeline/stage3-rerank.ts:489-523"},{"id":"P1-002-3","severity":"P1","title":"Community injection can introduce partial rows that bypass min-state filtering","file":"mcp_server/lib/graph/community-detection.ts:527-555"},{"id":"P1-002-4","severity":"P1","title":"MMR always pushes non-embedded results behind embedded results","file":"mcp_server/lib/search/pipeline/stage3-rerank.ts:163-223"},{"id":"P2-002-5","severity":"P2","title":"The degree channel is built, then explicitly discarded in the live raw-candidate path","file":"mcp_server/lib/search/hybrid-search.ts:909-959"}]}
```
