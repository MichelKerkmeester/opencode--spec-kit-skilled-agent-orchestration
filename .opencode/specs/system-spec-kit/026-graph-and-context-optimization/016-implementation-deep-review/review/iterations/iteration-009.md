# Iteration 9 - correctness - lib

## Dispatcher
- iteration: 9 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:31:36.517Z

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/deterministic-extractor.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts`

## Findings - New
### P0 Findings
- None.

### P1 Findings
#### P1-001 - Tier 3 routing cache can replay the wrong destination for the same text in a different context
- **Evidence:** `createContentRouter()` hashes only normalized chunk text into `chunkHash`, but the Tier 3 request also depends on `source_field`, `packet_level`, and `likely_phase_anchor`; the cache lookup/store path reuses only that text hash inside a session/spec-folder scope. A repeated sentence can therefore inherit a stale target doc/anchor from an earlier classification even when the surrounding routing context changed. `[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:480-505,511-515,586-605,748-808,1146-1169,1240-1242]`
- **Impact:** Misroutes canonical saves to the wrong document or phase anchor without re-running Tier 3, which is a correctness break for exactly the ambiguous chunks the cache is meant to accelerate.
- **Why tests missed it:** The cache test only verifies a same-context cache hit; it does not vary `sourceField`, `likely_phase_anchor`, or packet metadata while keeping the text identical. `[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:296-335]`

```json
{
  "claim": "Tier 3 cache identity is under-scoped: identical normalized text within the same session/spec-folder reuses a prior Tier 3 decision even when source_field or routing context changes.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:483-505",
    ".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:586-605",
    ".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:748-808",
    ".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1146-1169",
    ".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1240-1242",
    ".opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:296-335"
  ],
  "counterevidenceSought": "Checked whether RouterCache.buildKey folded in source_field, likely_phase_anchor, or any other routing inputs; it only scopes by session/spec-folder plus the text hash.",
  "alternativeExplanation": "This would be harmless only if routing were a pure function of normalized text, but the classifier input and target selection explicitly incorporate context and phase hints.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if another layer guarantees identical normalized text can never be classified under different source/context combinations before cache lookup."
}
```

#### P1-002 - Cross-encoder cache violates the `originalRank` contract when callers rerank the same document set in a different order
- **Evidence:** `generateCacheKey()` sorts document IDs before hashing, and `rerankResults()` returns cached `RerankResult[]` objects verbatim. That cache entry includes `originalRank`, which provider implementations derive from the caller's input order. A second call with the same IDs in a different order will hit the same cache key and receive stale `originalRank` values from the first call. `[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:246-266,280-311,322-353,362-389,431-449,482-491]`
- **Impact:** Any downstream logic or diagnostics relying on `originalRank` sees the wrong pre-rerank position, breaking the module's own documented/tested behavior on cache hits.
- **Why tests missed it:** Existing tests assert `originalRank` only on direct uncached provider calls; there is no permutation-through-cache case for `rerankResults()`. `[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:173-195,292-310]`

```json
{
  "claim": "rerankResults caches order-sensitive RerankResult payloads behind an order-insensitive cache key, so cached originalRank metadata becomes wrong when the same document IDs are supplied in a different order.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:246-266",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:280-311",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:322-353",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:362-389",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:431-449",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:482-491",
    ".opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:173-195",
    ".opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:292-310"
  ],
  "counterevidenceSought": "Checked whether cached results are re-mapped to the current input order on read or whether originalRank is recomputed after a cache hit; neither happens.",
  "alternativeExplanation": "If no caller ever inspects originalRank, the bug is latent, but the exported type and tests both treat originalRank as part of the contract.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade if originalRank is explicitly documented as best-effort debug metadata and all consumers ignore it on cache hits."
}
```

### P2 Findings
- **deterministic-extractor parenthetical alias support is missing despite the module contract saying it exists.** `extractAliases()` documents support for `"X (Y)"`, but the implementation only handles `also known as` / `aka` and YAML alias lists, so save-time graph enrichment silently misses the most common abbreviation form. The graph-lifecycle tests only cover `aka` and YAML, while the sibling query-surrogates extractor does test parenthetical abbreviations. `[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/deterministic-extractor.ts:114-141; .opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:521-538; .opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:126-147,844-849]`

## Traceability Checks
- The Tier 3 router is intended to be context-aware: the prompt and target builder both consume `source_field`, packet level, and phase-anchor hints, but the cache identity does not, so the cache path does not fully implement the routing contract. `[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:586-605,1053-1078,1269-1315]`
- The cross-encoder contract says `originalRank` reflects the caller's input order, and the tests explicitly assert that behavior; the cached path currently breaks that promise. `[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:88-97,280-311,322-353,362-389; .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:173-195,292-310]`

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts` - tier normalization/defaulting and SQL helper outputs were internally consistent on the reviewed paths.
- `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts` - sibling filtering, deprecated-tier exclusion, and batch/single interference calculations aligned cleanly.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts` - scoped BM25 lookup fails closed when the DB cannot resolve `spec_folder`, and warmup cancellation logic looked coherent.
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts` - canonical frontmatter-vs-continuity precedence matched the reviewed implementation and regression tests.
- `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts` - stable-read fingerprinting and handover/continuity/spec-doc fallback precedence were consistent with the code path reviewed.

## Next Focus
- Iteration 10 should inspect the caller side of these cache contracts (`lib/search/pipeline/*`, save routing entrypoints) and add permutation/context-variance regression coverage where these P1s currently slip through.
