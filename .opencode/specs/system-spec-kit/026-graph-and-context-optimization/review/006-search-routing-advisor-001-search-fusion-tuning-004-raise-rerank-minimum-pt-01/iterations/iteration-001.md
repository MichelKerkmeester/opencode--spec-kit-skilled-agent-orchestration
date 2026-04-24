# Iteration 001: Correctness baseline for the Stage 3 rerank threshold

## Focus
Correctness review of the Stage 3 minimum rerank gate, the 3-row/4-row boundary assertions, and the shared threshold behavior across remote and local reranking paths.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts`

## Findings
### P0 Findings
- None.

### P1 Findings
- None.

### P2 Findings
- None.

## Ruled Out
- The packet did **not** accidentally ship the threshold at `5`; the runtime gate is `4` and the minimum guard fires before provider-specific reranking [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49-50,320-336].
- The local GGUF path does **not** bypass the Stage 3 minimum; the regression suite proves `3 => skip` and `4 => apply` on the local path too [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:165-191].

## Dead Ends
- Re-reading direct cross-encoder suites did not add packet-local correctness signal because this packet intentionally scoped those tests out.

## Recommended Next Focus
Rotate into **security** and confirm the threshold move did not widen the local/remote reranker trust boundary.

## Assessment
Dimensions addressed: correctness
Status: clean
New findings ratio: 0.00
