---
title: "Remove Cross-Encoder Length Penalty - Tasks"
status: planned
---
# Tasks
- [ ] T-01: Delete `LENGTH_PENALTY`, `calculateLengthPenalty()`, and `applyLengthPenalty()` from `mcp_server/lib/search/cross-encoder.ts:62-218` per `../research/research.md:81-93`.
- [ ] T-02: Remove the live scoring branch from `mcp_server/lib/search/cross-encoder.ts:392-455` while keeping the `applyLengthPenalty` option accepted and inert across the Stage 3 call path in `mcp_server/lib/search/pipeline/stage3-rerank.ts:148,311-389`.
- [ ] T-03: Replace the threshold-math assertions in `mcp_server/tests/cross-encoder.vitest.ts:8-21,150-177` with compatibility-only assertions that prove content length no longer changes reranker scores.
- [ ] T-04: Replace the helper-behavior assertions in `mcp_server/tests/cross-encoder-extended.vitest.ts:74-141` and any related expectations in `mcp_server/tests/search-extended.vitest.ts:199` and `mcp_server/tests/search-limits-scoring.vitest.ts:158`.
- [ ] T-05: Re-check the request contract surfaces cited in `../research/research.md:85-86` and confirm this phase does not remove schema, tool metadata, handler defaults, or shadow-replay support.
## Verification
- [ ] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [ ] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/cross-encoder.vitest.ts tests/cross-encoder-extended.vitest.ts tests/search-extended.vitest.ts tests/search-limits-scoring.vitest.ts`
