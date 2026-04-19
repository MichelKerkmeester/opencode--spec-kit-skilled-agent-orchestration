# Iteration 33: Second-Order Effects of the 4-Result Rerank Gate

## Focus
Determine whether raising `MIN_RESULTS_FOR_RERANK` to `4` introduced behavior changes beyond "fewer reranker calls".

## Findings
1. The change is broader than a pure cost optimization. Stage 3 now skips reranking for 2-3 result sets, but MMR still activates at 2+ candidates. So small result sets can still be reordered; they are just reordered from Stage 2 scores instead of reranker scores when MMR is enabled. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:206] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:320]
2. The regression tests cover the threshold behavior for both cloud and local rerankers at 3 vs 4 results, but they do not cover the small-result-set-plus-MMR branch. That means the shipped minimum is tested, while the most subtle remaining behavior change is still inferred from code rather than locked by a targeted regression. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:136] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:164] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:193]
3. The continuity split matters here too. When a search call carries `adaptiveFusionIntent='continuity'` but `detectedIntent='understand'`, Stage 2 will score/fuse with continuity weights and Stage 3 small-set MMR will still diversify with the `understand` lambda. This is the clearest remaining behavioral mismatch after implementation. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:260] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209]

## Ruled Out
- Treating `MIN_RESULTS_FOR_RERANK = 4` as only a reranker-cost optimization with no relevance-side consequences.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`

## Assessment
- New information ratio: 0.12
- Questions addressed: `RQ-14`
- Questions answered: `RQ-14` — the shipped changes are stable, but the small-result-set Stage 3 path still has a real intent-signal mismatch and an uncovered MMR branch

## Reflection
- What worked and why: Looking at `MMR_MIN_CANDIDATES` separately from `MIN_RESULTS_FOR_RERANK` surfaced the subtle behavior change that the threshold tests alone do not describe.
- What did not work and why: The natural shorthand for this change is "rerank at 4", which hides that MMR can still move results below that threshold.
- What I would do differently: Any threshold change in Stage 3 should be documented as a full stage-policy change, not as a reranker-only tweak.

## Recommended Next Focus
Synthesize the remaining post-implementation gaps and turn them into a concrete next-phase research agenda.
