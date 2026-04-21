---
title: "Raise Minimum Rerank Candidate Threshold - Execution Plan"
status: complete
parent_spec: 004-raise-rerank-minimum/spec.md
---
# Execution Plan
## Approach
This phase changes the Stage 3 gate only: raise `MIN_RESULTS_FOR_RERANK` from `2` to `4`, patch the threshold-sensitive regression fixtures, and leave direct `crossEncoder.rerankResults()` tests alone unless they start importing Stage 3 helpers. The research explicitly rejected `5` as the first step because it would also disable reranking on 4-result continuity queries.

The implementation should treat this as a Stage 3 policy change, not a provider optimization. That matters because the same guard also affects local GGUF reranking before provider selection happens.

## Steps
1. Change `MIN_RESULTS_FOR_RERANK` in `mcp_server/lib/search/pipeline/stage3-rerank.ts:50,321` from `2` to `4`, following `../../../../research/010-search-and-routing-tuning-pt-01/research.md:161-184,275-289`.
2. Expand the first three regression fixtures in `mcp_server/tests/stage3-rerank-regression.vitest.ts:42,70,93` to 4-result sets and add explicit 3-row / 4-row boundary assertions, as directed by `../../../../research/010-search-and-routing-tuning-pt-01/research.md:172-184`.
3. Leave direct reranker suites such as `mcp_server/tests/cross-encoder.vitest.ts:177` and `mcp_server/tests/cross-encoder-extended.vitest.ts:349` unchanged unless the Stage 3 helper boundary shifts.
4. Record in the implementation notes that the new minimum also changes local GGUF reranking behavior for 2-result and 3-result candidate sets, per `../../../../research/010-search-and-routing-tuning-pt-01/research.md:247-248,281-283`.

## Verification
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`.
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/stage3-rerank-regression.vitest.ts tests/local-reranker.vitest.ts`.
- Confirm 3-result candidate sets skip Stage 3 reranking while 4-result sets still apply reranking.

## Risks
- Accidentally changing the minimum to `5` would exceed the research-backed rollout and remove reranking from 4-result sets too.
- Missing the local GGUF fallout would make the change look narrower than it really is.
- Over-editing direct cross-encoder suites could blur the intended Stage 3-only boundary.
