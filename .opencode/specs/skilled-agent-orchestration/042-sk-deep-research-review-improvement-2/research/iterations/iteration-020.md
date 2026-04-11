# Iteration 20: D5 Improve-Agent Coverage Graph Visible Loop Audit

## Focus
This iteration rotated back to D5 for one final upstream-to-downstream audit of `sk-improve-agent` coverage-graph usage. The scope was limited to documented graph-aware claims versus the visible `/improve:agent` command, autonomous workflow, and reducer path to determine whether coverage data actually influences focus selection, stop gating, or contradiction-style blocking.

## Findings
- `SKILL.md` says resume replays the journal, coverage graph, and registry before dispatch and that the orchestrator skips mutation types already in the exhausted log, but the visible autonomous loop never invokes `mutation-coverage.cjs` before candidate generation. The shipped loop proceeds from integration scan directly to candidate generation, scoring, benchmarking, ledger append, reducer refresh, and reducer-driven stop check, so coverage state does not visibly steer mutation focus selection. (`.opencode/skill/sk-improve-agent/SKILL.md:294-300`, `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:137-158`)
- The runtime config enables a coverage-graph file and the strategy template reserves reducer-populated `Mutation Coverage` and `Convergence Eligibility` sections, but `reduce-state.cjs` never opens `mutation-coverage.json`. Its main path reads only `agent-improvement-state.jsonl`, config, and mirror-drift report before writing `experiment-registry.json` and `agent-improvement-dashboard.md`, so graph data does not enter the operator-visible dashboard or recommendation surfaces. (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:92-99`, `.opencode/skill/sk-improve-agent/assets/improvement_strategy.md:114-123`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`)
- The helper itself does contain graph-aware logic: it records mutation attempts, exhaustion state, and per-iteration trajectories, and it computes convergence eligibility from recent dimension stability. But that logic remains encapsulated inside `mutation-coverage.cjs`; the visible command/workflow/reducer path inspected here exposes no step that consumes those helper outputs during the live loop. (`.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:80-92`, `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:192-204`, `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:229-290`, `.opencode/command/improve/agent.md:272-286`, `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:137-158`)
- Visible stop gating is reducer-driven rather than graph-driven. `checkConvergenceEligibility()` would reject convergence for insufficient or unstable trajectory data, and the strategy template expects a verdict derived from trajectory plus exhaustion, but the actual stop path uses only trailing ties, infra failures, weak benchmark runs, drift ambiguity, and dimension plateau from the JSONL ledger. Coverage-graph convergence eligibility never feeds `step_stop_check`. (`.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:229-272`, `.opencode/skill/sk-improve-agent/assets/improvement_strategy.md:116-123`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:259-332`, `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:152-158`)
- I found no visible contradiction-oriented graph gate in the operator path. The published improve-agent workflow enumerates scan, propose, score, benchmark, append, reduce, and stop steps, and the reducer’s stop evaluator uses no contradiction input or graph query surface, so contradiction handling remains absent from the visible coverage-graph loop rather than participating in stop blocking. (`.opencode/command/improve/agent.md:272-286`, `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:137-158`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:259-325`)

## Ruled Out
- This is not because the graph was disabled in configuration. The shipped config explicitly enables `coverageGraph` and points it at `improvement/mutation-coverage.json`, so the gap is consumption in the visible loop, not a disabled feature flag. (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:92-95`)

## Dead Ends
- I did not locate a separate visible orchestrator runtime file beyond the published command/YAML surfaces that might call `mutation-coverage.cjs` programmatically, so the conclusion stays scoped to the shipped operator-facing path rather than every possible hidden executor.

## Sources Consulted
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:48-52`
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-019.md:36-37`
- `.opencode/command/improve/agent.md:272-286`
- `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:137-167`
- `.opencode/skill/sk-improve-agent/SKILL.md:294-300`
- `.opencode/skill/sk-improve-agent/assets/improvement_config.json:92-99`
- `.opencode/skill/sk-improve-agent/assets/improvement_strategy.md:114-123`
- `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:80-92`
- `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:192-204`
- `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:229-290`
- `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:259-332`
- `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`

## Reflection
- What worked and why: Comparing the helper contract, runtime template expectations, and the visible YAML/reducer execution path made it easy to separate “graph exists” from “graph influences decisions.”
- What did not work and why: Negative evidence still depends on the published operator path, so I cannot prove that no hidden executor ever calls the helper elsewhere.
- What I would do differently: I would inspect `score-candidate.cjs` and any unseen orchestrator wrapper next if a follow-on phase needs to test whether graph-aware decisions exist off the documented path.

## Recommended Next Focus
If this research spins into a follow-on packet, the next productive move is not another broad loop audit but a narrow implementation-gap triage for `sk-improve-agent`: inspect `score-candidate.cjs`, any hidden orchestrator wrapper, and the confirm-mode workflow for off-path graph consumption, then decide whether to wire `mutation-coverage.cjs` into live focus/stop decisions or downgrade the docs/templates so they stop implying graph-driven behavior that the visible loop does not perform.
