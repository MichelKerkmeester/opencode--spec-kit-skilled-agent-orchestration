# Iteration 009 - Correctness

## Scope Read

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts`

## Checks

- Rechecked threshold boundary behavior at `.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:263`.
- Rechecked direct scoring effect test at `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:193`.
- Rechecked fallback score generation in no-provider and circuit-open paths at `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:408` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:421`.

## Findings

No new correctness findings. The length-penalty removal itself appears behaviorally consistent: no-op constants, no-op helper, cache key unification, and Stage 3 option compatibility are aligned.

## Verification

- Scoped vitest command: PASS.

