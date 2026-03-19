# EX-004: Channel fusion sanity

## Preconditions
- MCP server running with default flags
- SPECKIT_SEARCH_FALLBACK=true (default)

## Commands Executed

1. `memory_search({ query:"graph search fallback tiers behavior", limit:25, includeTrace:true })`
2. `memory_search({ query:"graph search fallback tiers behavior", limit:25, bypassCache:true, includeTrace:true })`

## Raw Output Summary

### Step 1: Default search
- searchType: hybrid
- Results: 20 (limit 25, pipeline capped at 20 post-rerank)
- Top result: memoryId 16253, "Level 3 implementation summaries [chunk 9/13]", score rerank=0.338
- **Channels: r12-embedding-expansion + fts + bm25** (3 channels contributing)
- Cross-encoder reranking applied
- Stage1: 640ms, 26 candidates | Stage3: 278ms rerank
- Chunk reassembly: 1 parent, 1 reassembled
- No evidence gap detected
- Intent: understand (confidence 0.08)

### Step 2: bypassCache search
- Same top result: memoryId 16253, same scores (rerank=0.338)
- Same ranking order across all 20 results
- Stage1: 64ms (warm cache)
- All adaptive shadow rows: scoreDelta=0

### Channel Contribution Analysis
- r12-embedding-expansion: semantic channel active
- fts: full-text search channel active
- bm25: BM25 lexical channel active
- 3/3 channels contributed = no empty tail

## Signal Checklist
- [x] Multiple channels contribute (3 channels: r12-embedding-expansion, fts, bm25)
- [x] No empty tail in channel contribution
- [x] bypassCache produced consistent results
- [x] Cross-encoder reranking applied
- [x] Chunk reassembly functional

## Verdict: **PASS**
All three search channels (r12-embedding-expansion, fts, bm25) contributed to results. No empty tail observed. Rankings are stable between cached and cache-bypassed runs.
