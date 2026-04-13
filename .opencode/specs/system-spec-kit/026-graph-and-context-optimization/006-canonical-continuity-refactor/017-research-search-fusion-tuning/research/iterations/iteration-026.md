# Iteration 26: Search-Pipeline Trace for Continuity Intent

## Focus
Trace a continuity-oriented search call through the live search pipeline and verify whether the new continuity profile actually reaches Stage 3 MMR.

## Findings
1. `handleMemorySearch()` now keeps two separate intent values in play: `detectedIntent` remains the public classifier result, while `adaptiveFusionIntent` is rewritten to `continuity` when `effectiveProfile === 'resume'`. Both values are then copied into the cache key and the pipeline config. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:816] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:846] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:900]
2. Stage 1 does consume the continuity-specific value: it passes `config.adaptiveFusionIntent` into hybrid search, and the hybrid fusion path uses that string to load the continuity weights from `adaptive-fusion.ts`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:534] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221] [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:53]
3. Stage 3 does not use the same signal. The orchestrator forwards the unchanged `PipelineConfig`, but the MMR branch reads `config.detectedIntent` rather than `config.adaptiveFusionIntent`, so a `profile: 'resume'` search can fuse as `continuity` and still diversify as `understand` (or whatever public intent was detected). [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:153] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:113] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:206]

## Ruled Out
- Assuming that adding `continuity` to `INTENT_LAMBDA_MAP` was enough to make the continuity lambda live end to end in Stage 3.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`

## Assessment
- New information ratio: 0.42
- Questions addressed: `RQ-11`
- Questions answered: none fully; this pass isolated the search-path wiring gap but not the operator-facing resume path

## Reflection
- What worked and why: Following the split between `detectedIntent` and `adaptiveFusionIntent` exposed the real handoff point much faster than reading doc summaries.
- What did not work and why: The docs make the continuity lambda sound fully live, which initially hides that Stage 1 and Stage 3 are reading different intent fields.
- What I would do differently: Check the operator-facing resume surface immediately after tracing the pipeline so the search-path finding is interpreted in the right user-facing context.

## Recommended Next Focus
Verify whether the canonical `/spec_kit:resume` path actually hits this pipeline or bypasses it entirely.
