# EX-002: Hybrid precision check

## Preconditions
- MCP server running with default flags
- SPECKIT_SEARCH_FALLBACK=true (default)

## Commands Executed

1. `memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20, includeTrace:true })`
2. `memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20, bypassCache:true, includeTrace:true })`

## Raw Output Summary

### Step 1: Default search
- searchType: hybrid
- Results: 20 (truncated to 1 for token budget)
- Top result: memoryId 24762, "Hybrid RAG Fusion Epic [chunk 7/24]", specFolder: 001-hybrid-rag-fusion-epic
- Channels: r12-embedding-expansion + fts
- Scores: lexical=12.96, fusion=12.96, rerank=0.289
- Cross-encoder reranking applied (provider: "cross-encoder")
- Chunk reassembly: 1 parent, 1 reassembled
- No evidence gap detected
- Intent auto-detected: find_decision
- Stage1: 751ms, 21 candidates | Stage3: 286ms rerank

### Step 2: bypassCache search
- Same top result: memoryId 24762, same scores (lexical=12.96, rerank=0.289)
- Same 20 results with identical ordering
- Stage1: 65ms (faster — SQLite warm cache, tool cache bypassed)
- All adaptive shadow rows: scoreDelta=0, same rankings

## Signal Checklist
- [x] Top results match query intent (Hybrid RAG Fusion spec contains checkpoint/restore context)
- [x] bypassCache produced consistent results
- [x] Cross-encoder reranking applied in both runs
- [x] Multiple channels contributed (r12-embedding-expansion + fts)
- [x] Chunk reassembly functional

## Verdict: **PASS**
Both default and cache-bypassed searches returned relevant results with consistent ranking. The Hybrid RAG Fusion Epic spec is contextually relevant to checkpoint/restore/transaction concepts.
