# Iteration 1: Removed length-penalty code still fragments reranker cache buckets

## Focus
Review correctness and maintainability around the live no-op implementation in `cross-encoder.ts`, with emphasis on whether the retired `applyLengthPenalty` flag still changes runtime behavior outside of ranking math.

## Findings

### P0

### P1

### P2
- **F001**: Retired `applyLengthPenalty` flag still splits reranker cache keys — `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:432` — `calculateLengthPenalty()` now always returns `1.0` and `applyLengthPenalty()` just clones the results array, but `rerankResults()` still bakes the flag into `optionBits`, so identical rerank requests can populate separate cache entries and skew later cache telemetry even though the output is identical. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:230`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:432`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:485`]

## Ruled Out
- Live ranking regression: `applyLengthPenalty()` is a no-op clone and no longer changes scores. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:235`]

## Dead Ends
- Looking for a second hidden size-based scoring branch in Stage 3 did not surface anything beyond the compatibility plumbing. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:146`]

## Recommended Next Focus
Verify that the packet summary and focused tests agree with the compatibility-preserving no-op, then confirm the cache split is the only remaining consequence.

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, maintainability
- Novelty justification: This pass found one previously untracked cache-hygiene issue while ruling out any remaining live score penalty.
