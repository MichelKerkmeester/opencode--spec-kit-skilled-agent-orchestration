# NEW-109: Quality-aware 3-tier search fallback

## Preconditions
- MCP server running with default flags
- SPECKIT_SEARCH_FALLBACK=true (default, graduated)
- isSearchFallbackEnabled() returns true (search-flags.ts:59)

## Commands Executed

1. `memory_search({ query:"zzz_nonexistent_term_zzz", limit:20, includeTrace:true })`

## Raw Output Summary

### Nonsense query results
- searchType: hybrid
- Results: 20 returned (despite nonsense query — fallback chain activated)
- Top result: memoryId 24772, fusion=0, rerank=0.320
- **channelsUsed: ["structural"]** — single structural SQL fallback channel
- pipelineStages: candidate, fusion, rerank, final-rank, filter (no double-candidate stage)
- Stage1: channelCount=1, 20 candidates, 357ms
- Stage2: graphSignalsApplied=true, rolloutState=bounded_runtime
- Stage3: rerankApplied=true, cross-encoder, 325ms
- No evidenceGapDetected (results were returned via structural fallback)

### Fallback Chain Evidence
- Normal queries use 2-3 channels (r12-embedding-expansion + fts/bm25)
- Nonsense query degraded to 1 channel: "structural" (SQL fallback)
- All fusion scores = 0 (no semantic or lexical match)
- Rerank scores still meaningful (0.289-0.320) — cross-encoder provides structural relevance
- fallbackTier: null (tier label not explicitly surfaced in trace)
- queryComplexity: null (not classifiable for nonsense input)

### Limitations
- `_degradation` property not visible at result level (may be internal-only)
- Cannot test SPECKIT_SEARCH_FALLBACK=false (requires env var in MCP server process, not accessible from tool context)
- Tier 2 (minSimilarity=0.1) and Tier 3 (SQL fallback + 50% cap) transitions are implicit — the structural channel IS the Tier 3 fallback
- Single-tier comparison (flag-off) not executable

## Signal Checklist
- [x] Nonsense query triggers fallback (structural channel instead of normal semantic/lexical)
- [x] Structural SQL fallback fires when normal channels produce no results
- [x] Results still returned via fallback chain
- [ ] Explicit _degradation property with tier labels (not surfaced at result level)
- [ ] SPECKIT_SEARCH_FALLBACK=false single-tier comparison (env var not accessible)

## Verdict: **PARTIAL**
The fallback chain demonstrably activates for low-quality queries — the structural SQL fallback channel fires when semantic and lexical channels produce no matches. However, two sub-checks could not be completed: (1) the `_degradation` property is not exposed at the result level, and (2) the flag-off comparison requires MCP server env var manipulation not available from the tool context.
