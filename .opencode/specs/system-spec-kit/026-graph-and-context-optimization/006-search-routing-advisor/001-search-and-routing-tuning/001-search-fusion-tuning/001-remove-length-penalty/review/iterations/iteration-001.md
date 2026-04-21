# Iteration 001 - Correctness

## Focus
- Dimension: `correctness`
- Goal: confirm the reranker no longer changes scores by content length while the inert flag path still works.

## Files reviewed
- `spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`

## Findings

No new correctness finding.

- `calculateLengthPenalty()` returns `1.0` and `applyLengthPenalty()` clones the results without mutation. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:230-239]
- Stage 3 still forwards `applyLengthPenalty` through the request path without introducing a new scoring branch. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:146-149] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:383-390]
- Tests explicitly check that short and long content now keep identical reranker scores. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:75-137]

## Iteration outcome
- Severity delta: `+0 P0 / +0 P1 / +0 P2`
- `newFindingsRatio`: `0.00`
- Next focus: `security`
