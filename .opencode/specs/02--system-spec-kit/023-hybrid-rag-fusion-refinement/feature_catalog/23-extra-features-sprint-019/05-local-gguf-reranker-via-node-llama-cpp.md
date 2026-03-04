# Local GGUF reranker via node-llama-cpp

## Current Reality

**IMPLEMENTED (Sprint 019).** Implements the `RERANKER_LOCAL` flag with `node-llama-cpp` in Stage 3 using `bge-reranker-v2-m3.Q4_K_M.gguf` (~350MB). Default 4GB free memory requirement (lower 512MB threshold when custom `SPECKIT_RERANKER_MODEL` is set). Sequential per-candidate inference; on Apple Silicon with small GGUF (~100MB) expect 200-400ms for top-20 (CHK-113). Falls back to existing RRF scoring when local execution is unavailable. New file: `lib/search/local-reranker.ts`.

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: Local GGUF reranker via node-llama-cpp
- Current reality source: feature_catalog.md
