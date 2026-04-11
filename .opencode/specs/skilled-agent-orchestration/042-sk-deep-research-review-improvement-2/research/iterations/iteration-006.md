# Iteration 6: D5 Contradiction-Aware Stop Wiring Audit

## Focus
This iteration investigated D5 by tracing the active deep-research and deep-review stop path from the live auto YAML convergence steps into any shared convergence or contradiction helpers. The goal was to verify whether contradiction-aware blocking is live before STOP, or whether it still depends on shared graph wiring that the current workflows never invoke.

## Findings
- The live deep-research stop path still uses an inline 3-signal vote plus `checkQualityGuards(state, strategy)` and never names any graph or contradiction helper in the active convergence step, even while calling the graph-aware model "experimental/reference-only" for live runs (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277`).
- The live deep-review stop path is likewise inline: rolling-average, MAD, dimension-coverage, and four binary quality guards determine whether STOP is allowed, but there is no graph-aware or contradiction-specific call before `if_stop` transfers control to synthesis (`.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:343-375`).
- Contradiction-aware blocking does exist in shared infrastructure, but only behind separate graph helpers. `coverage-graph-contradictions.cjs` scans `CONTRADICTS` edges and computes contradiction density (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:37-158`), and the MCP convergence handler blocks when `findContradictions(ns)` returns contradictions above threshold (`.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:200-264`).
- The published deep-research contract says that when `graphEvents` exist, "the reducer builds an in-memory coverage graph and derives additional signals for the legal-stop gate evaluation," including graph coverage sub-checks (`.opencode/skill/sk-deep-research/references/convergence.md:1181-1205`). The live research reducer does not implement that bridge: its only imports are `fs` and `path`, and its convergence score is taken from `latestIteration.convergenceSignals?.compositeStop` or `latestIteration?.newInfoRatio` rather than any graph helper (`.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:11-13`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:244-249`).
- The same contract/runtime gap exists on the review side. The review convergence reference says `graphEvents` should feed structural signals into the `findingStability` gate (`.opencode/skill/sk-deep-review/references/convergence.md:661-683`), but the live review reducer imports only `fs` and `path`, computes convergence from `latest?.convergenceSignals?.compositeStop` or `1 - newFindingsRatio`, and renders dashboards from plain iteration records without any graph-helper bridge (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:11-12`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:359-368`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:484-490`).

## Ruled Out
- This is not because contradiction tooling is missing. The shared contradiction scanner and MCP convergence handler already implement contradiction-aware blocking logic (`.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:37-158`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:200-264`).
- This is not limited to one loop. Both research and review convergence references promise graph-aware gate participation, but both active auto workflows keep STOP evaluation inline and local (`.opencode/skill/sk-deep-research/references/convergence.md:1181-1205`, `.opencode/skill/sk-deep-review/references/convergence.md:661-683`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:343-375`).

## Dead Ends
- I did not inspect confirm-mode YAMLs in this pass because the strategy explicitly targeted the active runtime path, and the auto workflows plus reducers were already sufficient to determine whether contradiction-aware blocking is reachable before STOP.

## Sources Consulted
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:44-49
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-005.md:31-32
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:343-375
- .opencode/skill/sk-deep-research/references/convergence.md:1181-1205
- .opencode/skill/sk-deep-review/references/convergence.md:661-683
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:11-13
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:244-249
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:359-368
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:484-490
- .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:37-158
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:200-264

## Reflection
- What worked and why: Reading the live auto YAML convergence steps beside the reducer imports made the reachable stop path much clearer than repo-wide helper searches alone.
- What did not work and why: The published graph-aware sections are detailed enough to sound implemented, so I had to keep separating contract language from active callsites.
- What I would do differently: I would compare confirm-mode entrypoints next only if we need to prove whether this contradiction-gap is universal across all command surfaces or specific to auto mode.

## Recommended Next Focus
Rotate to D1 and test whether the research loop is missing convergence signals that the shared graph stack already knows how to compute. The next productive pass is to compare the live deep-research 3-signal stop math against the shared graph/MCP signal set (`contradictionDensity`, `sourceDiversity`, `evidenceDepth`, `claimVerificationRate`) and determine which of those are now concrete runtime gaps versus deliberate non-adoption.
