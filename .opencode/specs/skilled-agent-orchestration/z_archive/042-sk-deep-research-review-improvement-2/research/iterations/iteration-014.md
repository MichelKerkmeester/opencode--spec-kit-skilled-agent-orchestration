# Iteration 14: D5 Convergence Weight vs Live Callers

## Focus
This pass stayed on D5 and traced the shipped graph-convergence math upward into the reducers and workflow callers that currently drive stop decisions. The goal was to determine whether coverage-graph signals materially change live stop gating or mostly remain advisory unless an upstream producer already folds them into `convergenceSignals.compositeStop`.

## Findings
- The standalone graph helper does have bounded weight, not runaway influence: `computeGraphConvergence()` builds `graphScore` from fragmentation (0.25), normalized depth (0.25), question coverage (0.30), and source diversity (0.20), then limits the merged result to `blendedScore = compositeStop * 0.6 + graphScore * 0.4`. Inside this helper, the coverage graph cannot contribute more than 40% of the final blended scalar (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:141-205`).
- That same helper keeps graph STOP vetoes outside the weighted blend. `evaluateGraphGates()` separately enforces `sourceDiversity >= 0.4` and `evidenceDepth >= 1.5`, returning `allPass` independently of `blendedScore`. In other words, the CJS layer has two graph pathways: a 40%-capped score and a hard blocker pair (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:220-258`).
- The shipped deep-research reducer does not consume either of those graph-specific outputs directly. Its registry `convergenceScore` is set from `latestIteration.convergenceSignals.compositeStop ?? latestIteration.newInfoRatio ?? 0`, and the trend block only prints that scalar plus `coverageBySources`. I found no reducer path in the inspected ranges that reads `graphScore`, `blendedScore`, or graph gate results, so graph math only reaches research state if some earlier producer already collapsed it into `convergenceSignals.compositeStop` (`.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:244-273`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:438-443`).
- The shipped deep-review reducer mirrors the same pattern. `computeConvergenceScore()` reads `latest.convergenceSignals.compositeStop` or falls back to `1 - newFindingsRatio`, and the reducer then publishes only that scalar as `convergenceScore`. No inspected review reducer code reconstructs a coverage graph or invokes graph convergence logic before writing the dashboard/registry (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:360-390`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:579-583`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:671-680`).
- The published convergence docs currently overstate reducer-side graph usage. Research docs say the reducer builds an in-memory graph from `graphEvents` and adds a `graphCoverage` sub-check to legal-stop evaluation; review docs make the same claim for `graphEvidence` under `findingStability`. But the workflow path I traced tells the LEAF agent to emit optional `graphEvents` and then runs `reduce-state.cjs`, while the inspected reducers themselves do not implement the documented graph rebuild or extra gate expansion (`.opencode/skill/sk-deep-research/references/convergence.md:1183-1205`, `.opencode/skill/sk-deep-review/references/convergence.md:661-683`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:322-331`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:432-437`).
- The "live" graph convergence path exists, but as a separate MCP decision engine rather than the reducer math the loops visibly consume here. The handler computes research/review thresholds, classifies signals as `weighted` vs `blocking_guard`, and can return `STOP_ALLOWED` only "pending newInfoRatio agreement." That means graph convergence is architecturally downstream-compatible with loop stop logic, but still not the same thing as the reducer's current `compositeStop` pass-through (`.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:58-118`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:183-239`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:290-379`).
- The two graph-convergence implementations are also not numerically interchangeable. The CJS helper defines `sourceDiversity` as a 0-1 ratio of unique source nodes to total nodes and blocks below `0.4`, while the MCP signal layer defines `sourceDiversity` as the average number of distinct source quality classes per question and the handler blocks below `1.5`. So even before caller wiring is considered, the repo currently ships two different graph-convergence regimes rather than one unified weight that the loops can rely on consistently (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:30-68`, `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:167-227`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:58-64`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:208-239`).

## Ruled Out
- "Coverage graph convergence is purely decorative in the codebase." Ruled out because both the CJS helper and the MCP handler contain real thresholds, weighted signals, and STOP-blocking branches; the gap is caller integration, not total absence (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:141-258`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:183-379`).

## Dead Ends
- Proving every possible runtime call site for `deep_loop_graph_convergence` from the workflow layer alone. The inspected YAML sections were enough to show the visible reducer path, but not enough to prove whether any hidden wrapper invokes the MCP handler elsewhere, so this pass stayed grounded in reducers plus directly cited workflow instructions.

## Sources Consulted
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:48-52`
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-013.md:38-39`
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:141-258`
- `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:167-227`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:58-118`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:183-379`
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:244-273`
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:438-443`
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:360-390`
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:579-583`
- `.opencode/skill/sk-deep-research/references/convergence.md:1183-1205`
- `.opencode/skill/sk-deep-review/references/convergence.md:661-683`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:322-331`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:432-437`

## Reflection
- What worked and why: Comparing the helper math, MCP handler, reducer reads, and workflow steps side by side made it possible to separate "graph capability exists" from "graph capability is actually on the live stop path."
- What did not work and why: The workflow YAML alone could not prove total absence of every possible MCP invocation, so negative claims had to stay scoped to the reducer and visible workflow surfaces I could cite.
- What I would do differently: I would next trace the remaining D5 question through prompt/runtime routing to see whether the loops are also underusing `code_graph_query` and related structural MCP tools, not just graph-convergence tooling.

## Recommended Next Focus
Stay on D5 for one more pass and audit missing structural-tool usage rather than convergence weight. The most productive next step is to compare the deep-research/deep-review agent and command prompts that advertise Code Graph routing against the actual loop workflow instructions and runtime wrappers, then determine whether `code_graph_query`, `code_graph_context`, or `deep_loop_graph_convergence` are expected but never called during live iterations. That would close the remaining D5 question without reopening already-settled contradiction or write-only `graphEvents` findings.
