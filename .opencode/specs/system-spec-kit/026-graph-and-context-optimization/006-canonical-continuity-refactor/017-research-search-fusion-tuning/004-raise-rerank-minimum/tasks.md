---
title: "Raise Minimum Rerank Candidate Threshold - Tasks"
status: planned
---
# Tasks
- [ ] T-01: Change `MIN_RESULTS_FOR_RERANK` from `2` to `4` in `mcp_server/lib/search/pipeline/stage3-rerank.ts:50,321`, following `../research/research.md:177-184`.
- [ ] T-02: Expand the first three threshold-sensitive fixtures in `mcp_server/tests/stage3-rerank-regression.vitest.ts:42,70,93` so they operate on 4-result sets instead of 2-result sets.
- [ ] T-03: Add explicit boundary assertions in `mcp_server/tests/stage3-rerank-regression.vitest.ts` for `3 results => applied === false` and `4 results => applied === true`, per `../research/research.md:179-184`.
- [ ] T-04: Verify that `mcp_server/tests/cross-encoder.vitest.ts:177` and `mcp_server/tests/cross-encoder-extended.vitest.ts:349` stay outside the threshold-sensitive patch unless the Stage 3 boundary moves.
- [ ] T-05: Add or update local-reranker coverage in `mcp_server/tests/local-reranker.vitest.ts` so the Stage 3 minimum change is proven against the GGUF path too.
## Verification
- [ ] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [ ] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/stage3-rerank-regression.vitest.ts tests/local-reranker.vitest.ts`
