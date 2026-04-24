# Iteration 004 - Testing

## Scope

Audited whether the tests prove the production Stage 3 boundary, including the order of rerank before MPAB collapse.

## Verification

Scoped Vitest command: PASS, `2` files, `23` tests.

## Findings

### IMPL-F001 - P1 - No executeStage3 boundary test covers the rerank threshold before MPAB chunk collapse

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:146`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:253`
- `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:137`
- `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:165`

The new tests call `__testables.applyCrossEncoderReranking()` directly, proving the isolated raw-row guard. Production `executeStage3()` applies the guard before MPAB (`applyCrossEncoderReranking` at line 146; chunk collapse at line 253). There is no full-stage test that makes this order explicit for chunk rows. That leaves the threshold's most important edge unprotected: raw four-row sets that collapse to fewer than four final documents.

This is a P1 testing gap because the packet's purpose is a cost/quality threshold, and the missing test is the natural boundary where the implementation can still spend reranker work on fewer final documents than the comment says.

## Delta

New findings: `1` P1. Churn: `0.50`.
