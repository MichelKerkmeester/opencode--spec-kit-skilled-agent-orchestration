# Iteration 001 - Correctness

## Inputs Read

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`

## Verification

- Vitest: PASS, 2 files, 61 tests.
- Git history checked: `d8ea31810c` added telemetry, `22c1c33a94` adjusted cache key option bits, `4e60c007fa` added follow-up tests.

## Findings

### DRI-F001 - P1 Correctness

The cache key is built from provider, query, and sorted document IDs only; it does not include document content or a content hash. A fresh request with the same IDs but changed text can hit the existing cache and return old reranker scores for up to `CACHE_TTL`.

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:254`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:257`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:434`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:439`

Expected: cache identity should include all inputs that affect reranker output, especially document text or a stable content hash.
Actual: cache identity ignores content and returns cached scores directly on hit.

## Convergence

New finding ratio: 1.00. Continue.
