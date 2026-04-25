# Iteration 006 - Security

## Scope Read

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`

## Checks

- Rechecked outbound authorization header construction at `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:286`.
- Rechecked local reranker request shape at `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:366`.
- Rechecked no-op length penalty does not add logging or expose document content.

## Findings

No new security findings. The active P1 is categorized as test isolation and robustness because the external-call risk is triggered by tests inheriting environment, not by a new credential handling branch in production code.

## Verification

- Scoped vitest command: PASS.

