# Iteration 2: Telemetry, rerank minimum, and Tier 3 save routing landed cleanly

## Focus
Check the other shipped runtime changes named in scope so the active problem set distinguishes the Stage 3 continuity defect from already-correct telemetry, rerank-gate, save-routing, and config behavior.

## Findings

### P0

### P1

### P2

## Ruled Out
- Reranker telemetry regression: `getRerankerStatus()` still exposes `hits`, `misses`, `staleHits`, `evictions`, `entries`, `maxEntries`, and `ttlMs`, and `resetSession()` clears the counters with the cache state. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:431`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:516`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:551`]
- Rerank-threshold drift: Stage 3 still skips reranking below four rows and forwards the compatibility `applyLengthPenalty` flag without reintroducing length-based scoring. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:321`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:383`]
- Tier 3 feature-flag residue in the live stack: the save handler now wires Tier 3 routing unconditionally, and the active configs describe it as always on with fail-open Tier 2 fallback. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1005`] [SOURCE: `.mcp.json:24`]

## Dead Ends
- Searching the five live MCP config surfaces for `SPECKIT_TIER3_ROUTING` did not reveal an active config defect; remaining hits were historical packet docs outside this review target. [SOURCE: `.mcp.json:24`]

## Recommended Next Focus
Compare the shipped doc surfaces against the live Stage 3 code path, especially where they now mention continuity-specific reranking behavior.

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: correctness, security
- Novelty justification: This pass narrowed the defect surface by confirming the other named runtime changes match the shipped behavior.
