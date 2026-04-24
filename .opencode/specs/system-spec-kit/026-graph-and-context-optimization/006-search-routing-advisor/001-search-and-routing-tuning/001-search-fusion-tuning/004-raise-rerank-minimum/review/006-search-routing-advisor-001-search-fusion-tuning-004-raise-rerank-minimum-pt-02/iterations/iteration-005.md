# Iteration 005 - Correctness

## Scope

Re-read Stage 3 together with the orchestrator and hybrid-search call path to determine whether IMPL-F002 is a true semantic defect or an intentional chunk-level policy.

## Verification

Scoped Vitest command: PASS, `2` files, `23` tests.

## Findings

No new correctness findings.

The full pipeline passes Stage 2 output into Stage 3 at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:118`, and Stage 3 intentionally states that cross-encoder scores raw chunks before parent reassembly at `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:123`. That weakens IMPL-F002 from a P1 semantic defect to a P2 rationale mismatch: the implementation can be defended, but the threshold's unit should be explicit.

The legacy hybrid-search path already slices to `limit` before its local reranker branch at `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1387`, so I did not record a separate candidate-volume finding for this packet.

## Delta

New findings: `0`. Churn: `0.00`.
