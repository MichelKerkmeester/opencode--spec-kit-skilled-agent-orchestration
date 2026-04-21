# Iteration 001 - Correctness

## Scope

Audited the Stage 3 threshold change in `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` and the new boundary assertions in `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts`.

## Verification

`cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/stage3-rerank-regression.vitest.ts tests/local-reranker.vitest.ts --reporter=default`

Result: PASS, `2` files, `23` tests.

## Findings

### IMPL-F002 - P2 - The minimum rerank gate counts raw rows, not distinct documents after chunk collapse

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:321`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:492`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:534`

The code raises `MIN_RESULTS_FOR_RERANK` to `4`, then gates on `results.length` before chunks are grouped by parent and reassembled. The rationale says reranking `2-3 docs` is not useful, but `results.length` is a raw row count. If the raw result set has four chunks from one to three parent documents, the reranker still runs before MPAB collapse. This may be the intended chunk-scoring policy, but the code does not encode or test that distinction.

## Delta

New findings: `1` P2. Churn: `1.00`.
