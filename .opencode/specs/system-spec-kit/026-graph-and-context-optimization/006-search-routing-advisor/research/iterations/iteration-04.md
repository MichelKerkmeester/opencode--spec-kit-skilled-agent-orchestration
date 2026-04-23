## Iteration 04

### Focus
Reranker boundary effects: how the rerank minimum and the retired length penalty change the system's ability to recover from Stage 2 fusion mistakes.

### Findings
- The length penalty was intentionally removed from live scoring while keeping the request surface compatible, so downstream callers can still pass `applyLengthPenalty` without changing output. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty/implementation-summary.md:39-41`
- Stage 3 still forwards `applyLengthPenalty` into `crossEncoder.rerankResults(...)`, which confirms the compatibility surface remains live even though the scoring effect is gone. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:383-390`
- Reranking is skipped entirely when the result set has fewer than four rows. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:320-323`
- The rerank-threshold phase explicitly made that skip behavior permanent for both cloud and local GGUF rerankers, which means 2-3 row ranking errors now survive unchanged. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum/implementation-summary.md:39-42`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum/implementation-summary.md:52`

### New Questions
- Are the most sensitive continuity and decision queries usually operating in the 2-3 row regime where reranking is now unavailable?
- Should any high-risk intents bypass the `MIN_RESULTS_FOR_RERANK=4` gate?
- Does the lack of a live length penalty increase the importance of better fusion ordering for long canonical docs?
- Are there fixtures that specifically test wrong-top-1 outcomes when only three results exist?

### Status
converging
