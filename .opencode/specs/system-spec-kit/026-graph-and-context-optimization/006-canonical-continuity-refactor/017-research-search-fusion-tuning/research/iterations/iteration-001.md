# Iteration 1: Cross-Encoder Constant Inventory

## Focus
Document the hardcoded reranker values that directly affect provider selection, latency ceilings, cache behavior, fallback scoring, and the Stage 3 rerank threshold.

## Findings
1. The reranker provider ladder is hardcoded as Voyage then Cohere then Local, with per-provider limits of `100/100/50` documents and timeouts of `15s/15s/30s` respectively. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:35]
2. Cross-encoder length penalties are hardcoded at `<50 => 0.9` and `>2000 => 0.95`, while the Stage 3 pipeline invokes reranking as soon as at least 2 results survive fusion. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:62] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49]
3. The reranker keeps a 5-minute in-memory cache with a 200-entry bound and distinct fallback score band `0.0-0.5`, but it does not yet expose hit-rate telemetry. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:115] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:399]

## Ruled Out
- None this iteration.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:35`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:62`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49`

## Assessment
- New information ratio: 0.85
- Questions addressed: `RQ-3`, `RQ-4`, `RQ-5`
- Questions answered: none

## Reflection
- What worked and why: Reading the cross-encoder module plus the Stage 3 entrypoint exposed the real rerank knobs in one pass.
- What did not work and why: The packet spec understated the rerank surface by not mentioning the Stage 3 minimum-results guard.
- What I would do differently: Compare these constants against actual corpus shape before making any threshold recommendation.

## Recommended Next Focus
Inventory Stage 1, Stage 2, and `search-weights.json` so the packet can separate vector-only ranking knobs from hybrid fusion knobs.
