# Iteration 005 - Correctness

## Scope Read

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts`

## Checks

- Reviewed Stage 3 compatibility forwarding at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:383` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:389`.
- Confirmed cross-encoder cache lookup/storage now uses the same key regardless of `applyLengthPenalty` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:433` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:485`.
- Confirmed `search-extended.vitest.ts` expectations still resolve through no-op constants at `.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:263`.

## Findings

No new correctness findings. Existing F-IMPL-P2-001 remains open as a compatibility cleanup risk, not an observed current ranking failure.

## Verification

- Scoped vitest command: PASS.

