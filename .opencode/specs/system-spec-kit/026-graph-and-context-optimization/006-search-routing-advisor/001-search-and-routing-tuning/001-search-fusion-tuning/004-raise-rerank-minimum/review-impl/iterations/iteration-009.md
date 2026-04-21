# Iteration 009 - Correctness

## Scope

Final correctness pass, focused on whether any P0/P1 semantic bug survives after re-checking direct branch behavior and full-stage behavior.

## Verification

Scoped Vitest command: PASS, `2` files, `23` tests.

## Findings

No new correctness findings.

No P0 survived adversarial review. The isolated threshold behavior is correct for raw rows: three rows skip and four rows apply in `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:145` through `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:162`. The remaining correctness issue is IMPL-F002, which is intentionally kept at P2 because the production comments also say reranking raw chunks before parent aggregation is intentional at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:123`.

## Delta

New findings: `0`. Churn: `0.00`.
