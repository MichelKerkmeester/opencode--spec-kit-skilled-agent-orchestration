# Local Reranker Models

This directory stores optional local GGUF models used by Stage 3 reranking.

## Required file for Sprint 9 P1-5

- File name: `bge-reranker-v2-m3.Q4_K_M.gguf`
- Approx size: `~350MB`
- Expected default path:
  `.opencode/skill/system-spec-kit/models/bge-reranker-v2-m3.Q4_K_M.gguf`

## Setup

1. Download `bge-reranker-v2-m3.Q4_K_M.gguf` from your approved artifact source.
2. Place the file in this `models/` directory.
3. Enable local reranking:
   - `RERANKER_LOCAL=true`
   - `SPECKIT_RERANKER_MODEL=models/bge-reranker-v2-m3.Q4_K_M.gguf`

## Notes

- Do not commit model binaries to git.
- If you store the model elsewhere, set `SPECKIT_RERANKER_MODEL` to an absolute path.
