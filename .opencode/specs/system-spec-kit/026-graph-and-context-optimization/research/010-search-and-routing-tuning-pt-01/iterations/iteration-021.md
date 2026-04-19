# Iteration 21: Contradiction Audit Across Prior Findings

## Focus
Cross-validate the phase `001`-`004` guidance against the current repo state and against each other to confirm whether any recommendation now conflicts with another recommendation.

## Findings
1. There is no contradiction between "remove the length penalty" and "keep `applyLengthPenalty` as a compatibility no-op". The scoring behavior is localized inside `cross-encoder.ts`, while the flag still appears in schemas, handler defaults, and cache-key construction. That means behavior can be removed without deleting the public contract in the same phase. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:212] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:389] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:160] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:642]
2. There is no contradiction between "keep continuity narrow first" and "extend continuity-specific K sweeps now". `adaptive-fusion.ts` and `optimizeKValuesByIntent()` both accept plain strings today, while public intent surfaces remain locked to the current 7-intent universe. [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60] [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:137] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:402] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:494] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7]
3. The only meaningful inconsistency found in this convergence pass is packet-local, not runtime-local: the research config still capped the loop at 10 and the dashboard still reported 10/10 even though 20 iterations already existed. The runtime conclusions remained coherent; the packet artifacts did not. [SOURCE: research/deep-research-config.json:3] [SOURCE: research/deep-research-dashboard.md:10]
4. The prior conclusions therefore reinforce one another into a single sequencing story rather than competing directions: telemetry first, length-penalty behavior removal second, Stage 3 minimum rerank threshold third, and continuity-profile work last once scope is explicit.

## Ruled Out
- Reopening FSRS or `search-weights.json` as unresolved convergence topics.

## Dead Ends
- None this iteration.

## Sources Consulted
- `research/deep-research-config.json`
- `research/deep-research-dashboard.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts`

## Assessment
- New information ratio: 0.24
- Questions addressed: `RQ-6`, `RQ-7`, `RQ-8`, `RQ-9`, `RQ-10`
- Questions answered: none newly answered; this was a contradiction audit

## Reflection
- What worked and why: Re-checking the current code and test surfaces against the packet’s own conclusions made it easy to separate real runtime contradictions from packet-local artifact drift.
- What did not work and why: The stale config and dashboard made the packet look less converged than the actual state log.
- What I would do differently: Verify reducer-owned packet surfaces before starting the final convergence pass so meta-drift is caught earlier.

## Recommended Next Focus
Turn the consistency check into an explicit phase ranking based on direct continuity impact, implementation risk, and sequencing value.
