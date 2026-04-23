## Iteration 03

### Focus
Graph-calibration boundary correctness: whether the Stage 2 graph caps actually constrain the full graph contribution described by the calibration module.

### Findings
- The calibration module promises caps for `graphWeightBoost`, `n2aScore`, `n2bScore`, and `communityBoost`, with a `GRAPH_WEIGHT_CAP` default of `0.15`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:24-30`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:340-349`
- Stage 2 admits it lacks per-signal attribution and feeds the same aggregate `graphSignalDelta` through the `graphWeightBoost`, `n2aScore`, and `n2bScore` caps. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:361-369`
- After calibration, Stage 2 only replaces `graphSignalDelta` and `communityDelta`; it recomputes `totalDelta` by adding untouched `causalDelta` and `coActivationDelta` back in. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:377-390`
- The only nearby runtime diagnostic warns when the graph channel contributes nothing, not when total graph influence exceeds the calibrated surface. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1333-1345`

### New Questions
- Are `causalDelta` and `coActivationDelta` already bounded earlier, or can they still push total graph influence beyond the intended cap?
- Should calibration move earlier so each graph sub-signal is bounded before aggregation?
- Is there a regression test that asserts graph `totalDelta` stays inside an expected envelope after calibration?
- Does this cap mismatch materially affect continuity or decision-heavy queries that rely more on graph relationships?

### Status
new-territory
