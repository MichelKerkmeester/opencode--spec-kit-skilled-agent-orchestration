# Iteration 004 - Testing

## Scope Read

- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`

## Checks

- Ran the scoped vitest command and observed fallback tests emitting Voyage fetch-failure and circuit-breaker warnings.
- Traced those warnings to tests that call `rerankResults()` without clearing provider environment first.

## Findings

### F-IMPL-P1-001 [P1] Fallback tests inherit live provider environment and can call external rerankers

- File: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:213`
- Evidence: `cross-encoder.vitest.ts` calls `rerankResults()` in fallback-style tests at `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:213`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:228`, and `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:246` without any local env cleanup. `search-limits-scoring.vitest.ts` also calls `rerankResults()` in fallback assertions at `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:231` and `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:291`. Production provider resolution will select Voyage when `VOYAGE_API_KEY` exists at `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:219`.
- Risk: In a developer or CI environment with reranker env vars, these tests can make external network calls, consume provider quota, become flaky, or pass only because fetch fails and the fallback catches it. The iteration-001 run showed this exact path through stderr warnings.
- Recommendation: Add `beforeEach`/`afterEach` cleanup for `VOYAGE_API_KEY`, `COHERE_API_KEY`, and `RERANKER_LOCAL`, plus `resetProvider()` and `resetSession()`, around every fallback-oriented test block.

## Verification

- Scoped vitest command: PASS, with provider fallback warnings observed in the visible iteration-001 run.

