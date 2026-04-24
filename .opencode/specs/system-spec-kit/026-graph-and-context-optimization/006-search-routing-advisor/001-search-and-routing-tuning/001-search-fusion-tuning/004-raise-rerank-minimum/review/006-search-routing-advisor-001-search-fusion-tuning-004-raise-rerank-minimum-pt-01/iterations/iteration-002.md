# Iteration 002: Security review of rerank gating and local fallback

## Focus
Security review of the rerank gate, provider selection order, and local GGUF fallback behavior after the minimum threshold increase.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts`

## Findings
### P0 Findings
- None.

### P1 Findings
- None.

### P2 Findings
- None.

## Ruled Out
- The threshold change does not create a new injection path or credential-exposure surface; the change only adjusts the candidate-count gate before rerank provider selection [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:315-336].
- The local reranker still fails closed to original ordering when model loading fails, so the threshold change does not create a partial-order security hazard [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:178-203].

## Dead Ends
- Searching for packet-local auth or secret-handling changes produced no relevant surface because the packet owns ranking policy, not credential logic.

## Recommended Next Focus
Rotate into **traceability** and verify that the packet migration preserved ancestry metadata and evidence references.

## Assessment
Dimensions addressed: security
Status: clean
New findings ratio: 0.00
