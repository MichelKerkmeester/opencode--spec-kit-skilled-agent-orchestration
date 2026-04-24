# Iteration 008 - Testing

## Scope

Audited the packet-named local reranker test file for threshold-adjacent and cap-adjacent test quality.

## Verification

Scoped Vitest command: PASS, `2` files, `23` tests.

## Findings

### IMPL-F003 - P2 - Local reranker candidate-cap test does not exercise the production cap path

Evidence:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:259`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:292`
- `.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:291`
- `.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:306`

The production cap is applied by slicing `candidates` to `MAX_RERANK_CANDIDATES`, then iterating over `rerankCandidates.slice(0, rerankCount)`. The test named for MAX_RERANK_CANDIDATES enforcement never reaches that loop: it expects fallback because `node-llama-cpp` is unavailable, then manually checks that a local `candidates.slice(0, 50)` has length 50. This can pass even if the production cap regresses.

This is P2 because it is a test fidelity issue outside the exact raised-minimum line, but it sits in the same provider/candidate-count surface this packet relies on.

## Delta

New findings: `1` P2. Churn: `0.333`.
