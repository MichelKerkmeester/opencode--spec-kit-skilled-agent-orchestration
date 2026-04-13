---
title: "Remove Cross-Encoder Length Penalty - Tasks"
status: complete
---
# Tasks
- [x] T-01: Neutralize the length-penalty helpers in `mcp_server/lib/search/cross-encoder.ts:62-218` so the compatibility surface remains available while penalty math returns a no-op, per `../research/research.md:81-93`.
- [x] T-02: Remove the live scoring effect from `mcp_server/lib/search/cross-encoder.ts:392-455` while keeping the `applyLengthPenalty` option accepted and inert across the Stage 3 call path in `mcp_server/lib/search/pipeline/stage3-rerank.ts:148,311-389`.
- [x] T-03: Replace the threshold-math assertions in `mcp_server/tests/cross-encoder.vitest.ts:8-21,150-177` with compatibility-only assertions that prove content length no longer changes reranker scores.
- [x] T-04: Replace the helper-behavior assertions in `mcp_server/tests/cross-encoder-extended.vitest.ts:74-141` and refresh the related no-op compatibility expectations in the surrounding search-scoring suites.
- [x] T-05: Re-check the request contract surfaces cited in `../research/research.md:85-86` and confirm this phase does not remove schema, tool metadata, handler defaults, or shadow-replay support.
## Verification
- [x] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/cross-encoder.vitest.ts tests/cross-encoder-extended.vitest.ts tests/search-extended.vitest.ts tests/search-limits-scoring.vitest.ts`
