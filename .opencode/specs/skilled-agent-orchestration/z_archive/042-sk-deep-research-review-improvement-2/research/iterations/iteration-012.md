# Iteration 12: D3 Recovery Consumer Reconstruction Audit

## Focus
This iteration stayed on D3 and shifted from persistence primitives to the consumer side. The goal was to verify whether any shipped orchestrator or reducer path actually reconstructs candidate lineage, blocked-stop evidence, trade-off decisions, and benchmark-stability warnings from the raw journal, registry, and graph-adjacent files during resume or post-run recovery.

## Findings
- The published resume contract promises more reconstruction than the shipped recovery helper exposes. Both the command and skill say resume replays the journal, coverage graph, and registry before dispatch, but the only recovery-facing journal helpers return the max iteration number and the terminal `stopReason/sessionOutcome`; there is no helper that rebuilds blocked-stop payloads, trade-off state, benchmark warnings, or lineage context from raw journal events (`.opencode/command/improve/agent.md:334-339`, `.opencode/skill/sk-improve-agent/SKILL.md:290-295`, `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:168-203`).
- The shipped reducer is not that missing reconstruction layer. `reduce-state.cjs` builds its registry solely from `agent-improvement-state.jsonl`, then derives stop status from recommendation tallies, benchmark fail counts, plateau detection, and mirror-drift text; its `main()` reads only the state log, config, and optional drift report before writing the dashboard and registry. That leaves journal-only events such as `blocked_stop`, `trade_off_detected`, or `benchmark_completed` details outside reducer-owned recovery surfaces (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:145-235`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:259-332`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`).
- Candidate lineage is persisted but not rebuilt or consumed by any shipped recovery/reporting path I inspected. `candidate-lineage.cjs` is a standalone JSON helper that records nodes and can answer lineage queries, but the reducer never reads `candidate-lineage.json`, and the runtime-truth playbook frames lineage creation as something the orchestrator must invoke after each evaluation rather than something a downstream consumer can reconstruct from existing state (`.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs:47-109`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md:28-34`).
- Trade-off decisions are documented as reducer-visible, but the shipped consumer path does not ingest them. The strategy asset says the reducer populates the trade-off table when `trade-off-detector.cjs` flags a Pareto trade-off, and the playbook expects dashboard trade-off annotations, yet the actual reducer renders only dimensional score tables, failure modes, benchmark counts, and generic stop recommendations. The detector itself can only reconstruct trajectory from `candidate_scored` journal events, not from the reducer’s state log (`.opencode/skill/sk-improve-agent/assets/improvement_strategy.md:123-136`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md:20-28`, `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs:130-172`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:371-475`).
- Benchmark-stability gating is similarly under-consumed on the recovery side. The module can compute per-dimension `stabilityWarning` messages only when a caller supplies replay result arrays, and the changelog says this should gate promotion on measurement reliability, but the reducer only counts benchmark pass/fail records from the state log and never reads stability coefficients or warning payloads. As shipped, post-run recovery can say “weak benchmark runs” while still losing the evidence needed to distinguish unstable measurement from ordinary benchmark failure (`.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:27-35`, `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:95-171`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:173-186`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:286-289`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:431-437`).

## Ruled Out
- This is not just a missing-event-taxonomy problem. The journal already recognizes `benchmark_completed`, `blocked_stop`, and `trade_off_detected`, so the main gap is consumer reconstruction and surfacing rather than missing event names (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:47-67`).
- This is not merely reducer documentation drift. The reducer’s own file inputs and registry builder omit the journal, lineage graph, and mutation-coverage artifacts entirely, so the current recovery gap is structural, not just under-explained (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:145-235`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`).

## Dead Ends
- I did not find a shipped orchestrator implementation file that performs the promised “replay journal + coverage graph + registry before dispatch,” so this pass had to prove absence via reducer inputs and helper interfaces rather than a single end-to-end resume driver.
- Repo-wide symbol search for the new D3 modules surfaced mostly docs, specs, changelog entries, and tests, which limited negative-proof evidence to the runtime files that do exist.

## Sources Consulted
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:41-43`
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-011.md:37-40`
- `.opencode/command/improve/agent.md:294-339`
- `.opencode/skill/sk-improve-agent/SKILL.md:270-322`
- `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:47-67`
- `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:168-203`
- `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:145-235`
- `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:259-332`
- `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:371-503`
- `.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs:47-109`
- `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs:130-172`
- `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:95-171`
- `.opencode/skill/sk-improve-agent/assets/improvement_strategy.md:123-136`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md:20-35`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/024-candidate-lineage.md:20-34`
- `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md:24-35`

## Reflection
- What worked and why: Reading the reducer inputs and the standalone D3 helper APIs side by side made it easy to prove that the current consumer layer never hydrates most of the newly persisted state.
- What did not work and why: I could not anchor the “promised replay” to a concrete orchestrator implementation file, so part of the evidence had to come from omission patterns across the runtime files that are present.
- What I would do differently: I would rotate next to D4 and inspect reducer write scopes directly so we can determine whether any of these loops also violate their machine-owned-anchor contracts while trying to summarize state.

## Recommended Next Focus
Rotate to D4 and audit reducer write boundaries against the published machine-owned anchor contracts. The most productive next pass is to compare the deep-research, deep-review, and sk-improve-agent reducers against their target markdown/state assets and verify whether they ever rewrite human-owned sections or anchor ranges outside the declared machine-owned zones. That would close the remaining self-compliance question without reopening the already-settled D3 persistence analysis.
