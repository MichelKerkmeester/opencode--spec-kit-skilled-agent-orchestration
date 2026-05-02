# Iteration 2: D5 Coverage Graph Read-Path Audit

## Focus
This iteration investigated D5 by tracing whether the current deep-loop runtimes actually read coverage-graph state or `graphEvents` during convergence and stop-gating, or whether graph data is only emitted and left for optional downstream tooling. The scope covered the active deep-research and deep-review workflow surfaces plus the shared convergence and contradiction modules they would need to call.

## Findings
- The shared graph-convergence handler does implement real stop-gating against persisted graph state: it computes graph signals, then evaluates research/review blockers using `findCoverageGaps()`, `findContradictions()`, and `findUnverifiedClaims()` before returning `STOP_ALLOWED`, `STOP_BLOCKED`, or `CONTINUE` (.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:20-25; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:109-163; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:245-275; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:343-355).
- The active loop workflow surfaces I inspected only require agents to emit `graphEvents`; they do not show any corresponding `deep_loop_graph_upsert`, `deep_loop_graph_query`, or `deep_loop_graph_convergence` invocation in the same runtime path. In the checked YAMLs, graph handling appears as an iteration-record output contract, not a read-back decision step (.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:326; .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:436-437).
- The deep-research reducer still operates on iteration markdown sections plus JSONL rows filtered to `type === "iteration"`, then rebuilds packet outputs from those inputs; there is no reducer-owned path here that parses or promotes `graphEvents` into strategy, registry, or dashboard state. That means the synchronized packet surfaces remain blind to graph-aware stop evidence unless some other process reads the graph separately (.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:103-127; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-502).
- Contradiction handling is split across layers: the CJS helper can scan in-memory `CONTRADICTS` edges, but the active convergence handler actually blocks on contradictions through the TypeScript query layer (`findContradictions(ns)`), which implies graph-aware contradiction blocking depends on a populated persisted namespace rather than on raw JSONL `graphEvents` alone (.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:37-67; .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:85-129; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:20-25; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:255-257; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:353-355).

## Ruled Out
- The graph layer is not purely nominal overall; the shared MCP convergence handler can block STOP on graph-derived coverage gaps, contradictions, unverified claims, source diversity, and evidence depth when it is actually invoked (.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:122-163; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:225-275; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:330-355).

## Dead Ends

## Sources Consulted
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:48-52
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-001.md:7-10
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:326
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:436-437
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:103-127
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-502
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:20-25
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:109-163
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:245-275
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:343-355
- .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:37-67
- .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs:85-129

## Reflection
- What worked and why: Comparing the loop workflow surfaces against the shared convergence handler made the missing runtime bridge visible quickly.
- What did not work and why: Broad repository grep added noise from specs and playbooks before I narrowed to active runtime files.
- What I would do differently: I would inspect the graph-upsert call chain earlier so I could prove the exact handoff boundary in the same pass.

## Recommended Next Focus
Stay on D5 for one more pass and trace the missing bridge explicitly: inspect whether any reducer, orchestrator, or wrapper outside the loop-local YAMLs is calling `deep_loop_graph_upsert` to translate emitted `graphEvents` into the persisted namespace that `deep_loop_graph_convergence` reads. If no such bridge exists, the next recommendation can be precise: current deep loops emit graph-shaped evidence and ship graph-aware stop logic, but they do not yet wire the two together in the normal runtime path.
