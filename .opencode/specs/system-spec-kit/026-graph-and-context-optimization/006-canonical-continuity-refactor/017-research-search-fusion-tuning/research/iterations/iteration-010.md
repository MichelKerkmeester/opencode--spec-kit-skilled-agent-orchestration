# Iteration 10: Final Synthesis Pass

## Focus
Consolidate the cross-file evidence into question-by-question answers and final implementation-facing recommendations.

## Findings
1. `RQ-1` is best answered by reframing the tuning target: leave `search-weights.json` for vector smart-ranking, but tune continuity precision through adaptive intent weights, graph bias, and intent-specific RRF K. [SOURCE: research/iterations/iteration-004.md] [SOURCE: research/iterations/iteration-006.md]
2. `RQ-2` is a "do not retune here" result: FSRS `0.2346` is a canonical scheduler invariant rather than a continuity-search heuristic. [SOURCE: research/iterations/iteration-003.md]
3. `RQ-3` and `RQ-5` are bounded by instrumentation gaps: fixture comparisons support provider-quality ordering, but live latency distribution and cache hit rate both require telemetry that the current code does not expose. [SOURCE: research/iterations/iteration-007.md] [SOURCE: research/iterations/iteration-008.md]
4. `RQ-4` produces the clearest actionable threshold change: the long-document penalty should be raised or removed for spec-doc continuity retrieval because the threshold currently matches the dominant corpus shape. [SOURCE: research/iterations/iteration-008.md] [SOURCE: research/iterations/iteration-009.md]

## Ruled Out
- None this iteration.

## Dead Ends
- None this iteration.

## Sources Consulted
- `research/iterations/iteration-003.md`
- `research/iterations/iteration-004.md`
- `research/iterations/iteration-006.md`
- `research/iterations/iteration-007.md`
- `research/iterations/iteration-008.md`
- `research/iterations/iteration-009.md`

## Assessment
- New information ratio: 0.12
- Questions addressed: `RQ-1`, `RQ-2`, `RQ-3`, `RQ-4`, `RQ-5`
- Questions answered: `RQ-1`, `RQ-2`, `RQ-3`, `RQ-4`, `RQ-5`

## Reflection
- What worked and why: The packet converged once the research target moved from "edit one JSON file" to "follow the real control surfaces."
- What did not work and why: The current repo cannot answer every performance question empirically because some metrics are simply not recorded.
- What I would do differently: The next packet should add instrumentation first, then iterate on thresholds with a corpus-specific evaluation harness.

## Recommended Next Focus
Session complete. Hand off to implementation planning with a dedicated continuity-fusion config surface, telemetry additions, and a long-penalty A/B experiment.
