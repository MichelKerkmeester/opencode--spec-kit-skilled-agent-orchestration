# Iteration 008 - Testing

## Scope Read

- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`

## Checks

- Reviewed provider response tests for success, non-OK, and network-error cases.
- Cross-checked them against unvalidated response parsing in the production provider helpers.

## Findings

### F-IMPL-P2-003 [P2] Malformed provider response paths are not covered by packet-linked tests

- File: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:150`
- Evidence: The provider tests cover ordinary successful responses at `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:150`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:226`, and `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:271`, plus non-OK/network errors. They do not cover malformed 200 response bodies, while production parsing assumes `data.data` / `data.results` and valid indexes at `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:302`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:344`, and `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:380`.
- Risk: F-IMPL-P2-002 can regress silently because the tests only exercise happy-path response arrays.
- Recommendation: Add tests for missing arrays, non-array values, out-of-range indexes, and invalid relevance scores for all three provider helpers.

## Verification

- Scoped vitest command: PASS.

