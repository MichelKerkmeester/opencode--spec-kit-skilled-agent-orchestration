# Iteration 34: Post-Implementation Gap Synthesis

## Focus
Turn the post-implementation findings into a single picture of what is complete, what is still misaligned, and what does not need more tuning.

## Findings
1. The shipped search tuning is mostly correct and verified: continuity weights exist, the Stage 3 rerank gate is `4`, the length penalty is compatibility-only, cache telemetry fields exist, and the targeted reranker and resume/adaptive-intent test slices both passed in this run. [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:50] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:230] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:136] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts:6]
2. The primary remaining technical gap is intent-signal inconsistency: Stage 1/2 can use `adaptiveFusionIntent='continuity'`, but Stage 3 MMR still reads `detectedIntent`. Meanwhile the canonical resume ladder bypasses the search pipeline entirely. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:914]
3. The secondary remaining gap is observability semantics, not missing counters. `getRerankerStatus()` is useful for local inspection, but it still conflates stale cleanup with cache-pressure eviction and omits provider/failure/reset context needed for dashboard interpretation. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:140] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:442] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:551]
4. The doc surface is mixed rather than broadly stale: `SKILL.md` is aligned, while `ARCHITECTURE.md` and `configs/README.md` currently describe the continuity lambda more strongly than the live control flow supports. That is now a wording-and-contract problem, not a weight-tuning problem. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:592] [SOURCE: .opencode/skill/system-spec-kit/ARCHITECTURE.md:150] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/README.md:50]

## Ruled Out
- Reopening broad fusion-weight tuning as the next research target; the remaining gaps are about signal wiring, observability semantics, and wording precision instead.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/ARCHITECTURE.md`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/system-spec-kit/mcp_server/configs/README.md`

## Assessment
- New information ratio: 0.07
- Questions addressed: `RQ-11`, `RQ-12`, `RQ-13`, `RQ-14`, `RQ-15`
- Questions answered: none newly answered; this was a synthesis pass

## Reflection
- What worked and why: Grouping the findings into signal wiring, observability semantics, and doc wording made the post-implementation state much easier to reason about.
- What did not work and why: It is tempting to stop at "tests pass", but that would have missed the contract-level gap between continuity fusion and Stage 3 intent selection.
- What I would do differently: Plan one explicit post-implementation contract audit whenever a packet intentionally ships compatibility shims plus doc updates in the same wave.

## Recommended Next Focus
Define the next research phase around Stage 3 intent unification, operator-facing continuity semantics, and dashboard-grade reranker telemetry.
