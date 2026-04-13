# Iteration 17: Stage-3 Rerank Minimum Guard and Candidate-Size Edge Cases

## Focus
Map the exact Stage 3 threshold seam so phase `004-raise-rerank-minimum` can move from `2` to `4-5` without accidental behavioral regressions.

## Findings
1. The rerank minimum is enforced only in Stage 3, not in `cross-encoder.rerankResults()` itself. `applyCrossEncoderReranking()` exits early when `results.length < MIN_RESULTS_FOR_RERANK`, so the threshold change affects pipeline behavior but not direct cross-encoder unit tests. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:50] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:306] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:321]
2. The safest first move is `MIN_RESULTS_FOR_RERANK = 4`, not `5`. At `4`, two-document and three-document result sets skip reranking, but common `top-4`/`top-5` candidate windows still get neural ordering. At `5`, every 4-result continuity query would also skip reranking, which is a steeper unmeasured behavior change. [INFERENCE: conservative change while telemetry is still absent]
3. The important runtime edge cases at `4` are:
   - `results.length <= 3`: Stage 2 order becomes final
   - `results.length = 4`: reranking still runs, which is the new proving ground
   - local-gguf path shares the same Stage 3 guard, so the threshold change applies equally to remote and local rerankers. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:321] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:334]
4. Phase `004` therefore needs new threshold-specific tests, not just a constant edit: at minimum, add explicit "3 results => not applied" and "4 results => applied" assertions around `applyCrossEncoderReranking()`. [INFERENCE: current test coverage exercises rerank behavior, but not the boundary itself]

## Ruled Out
- Changing the threshold inside `cross-encoder.ts`; that would be the wrong layer and would break direct reranker tests unnecessarily.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `017-research-search-fusion-tuning/004-raise-rerank-minimum/spec.md`

## Assessment
- New information ratio: 0.62
- Questions addressed: `RQ-9`
- Questions answered: partially; the safest first threshold is now clear.

## Reflection
- What worked and why: Separating Stage 3 policy from cross-encoder behavior narrowed the expected fallout a lot.
- What did not work and why: The packet spec’s `4-5` range is still underdetermined without candidate-count telemetry.
- What I would do differently: Add threshold-boundary tests before changing any minimum guard in a multistage pipeline.

## Recommended Next Focus
Locate the existing Stage 3 regression tests that currently assume reranking happens with only 2 results.
