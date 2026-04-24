# Iteration 004 - Testing

## Inputs Read

- Prior iterations: 001-003
- Registry
- Scoped test files and relevant production branches

## Verification

- Vitest: PASS, 2 files, 61 tests.
- Git history checked.

## Findings

### DRI-F002 - P1 Testing

The base cross-encoder tests do not isolate provider environment variables. In an environment with `VOYAGE_API_KEY`, `COHERE_API_KEY`, or `RERANKER_LOCAL`, nominal fallback tests can exercise live provider resolution and fetch behavior instead of deterministic no-provider fallback.

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:218`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:221`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:405`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:206`

Observed during iteration 001: the scoped run emitted `fetch failed` warnings from `cross-encoder.vitest.ts`, proving the test entered the provider path under the current environment.

### DRI-F003 - P1 Testing

The telemetry feature exposes `staleHits` and `evictions`, but scoped tests only assert fresh hit/miss and `useCache=false` behavior. There is no test for stale cache expiry or `enforceCacheBound()` incrementing eviction telemetry.

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:152`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:442`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:445`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:433`

## Convergence

New finding ratio: 0.50. Continue.
