# Local GGUF reranker via node-llama-cpp

## Current Reality

**IMPLEMENTED (Sprint 019).** Implements the `RERANKER_LOCAL` flag with `node-llama-cpp` in Stage 3 using `bge-reranker-v2-m3.Q4_K_M.gguf` (~350MB). Requires 4GB free memory, targets <500ms for top-20 candidates. Falls back to existing RRF scoring when local execution is unavailable. New file: `lib/search/local-reranker.ts`.

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: Local GGUF reranker via node-llama-cpp
- Summary match found: Yes
- Summary source feature title: Local GGUF reranker via node-llama-cpp
- Current reality source: feature_catalog.md
