# Iteration 003 - Robustness

## Scope Read

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`

## Checks

- Reviewed provider response parsing for Voyage, Cohere, and local providers.
- Compared normal-response tests in `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`.

## Findings

### F-IMPL-P2-002 [P2] Direct provider helpers trust reranker response indexes without validating bounds

- File: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:304`
- Evidence: Voyage maps `data.data` and dereferences `documents[item.index]`, then reads `documents[item.index].id` at `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:308`. Cohere and local follow the same pattern at `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:346` / `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:350` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:382` / `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:386`.
- Risk: A malformed 200 response with an out-of-range index can throw a TypeError in the direct exported provider helpers. `rerankResults()` catches provider errors and falls back, but the direct helpers are exported and covered as public-ish test surfaces.
- Recommendation: Validate that each response item has an integer index within `documents.length` before dereferencing.

## Verification

- Scoped vitest command: PASS.

