# Iteration 19: D4 Upstream Improve-Agent Journal Emission Path

## Focus
This iteration stayed on D4 and moved upstream from the dashboard into the improve-agent command contract, the journal emitter, the visible auto/confirm YAML workflows, and the reducer entrypoint. The goal was to determine whether exact stop reasons, session outcomes, and gate-result payloads are emitted correctly and then discarded, or whether the shipped workflow never emits the richer contract in the first place.

## Findings
- `.opencode/command/improve/agent.md` says the orchestrator MUST emit `candidate_scored`, `legal_stop_evaluated`, and `session_ended` journal events with `gateResults`, `stopReason`, and `sessionOutcome`, but the visible auto and confirm YAML workflows never call `improvement-journal.cjs`. Their loop records only baseline/prompt-score/benchmark ledger data into `agent-improvement-state.jsonl`, runs `reduce-state.cjs`, and makes decisions from registry/dashboard outputs, so the richer journal contract is not emitted on the shipped workflow path. (`.opencode/command/improve/agent.md:294-309`, `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:128-167`, `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:144-201`)
- The one concrete session-start journal example in `.opencode/command/improve/agent.md` is not executable as written. The docs show `--emit` plus `--event=session_initialized`, but `improvement-journal.cjs` reads the event type from `--emit <eventType>` and never parses an `--event` flag, so following the published command literally would reach the usage path instead of producing the intended event. (`.opencode/command/improve/agent.md:298-300`, `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:242-275`)
- The journal helper does not enforce the published gate-result contract. `validateEvent()` only checks `details.stopReason` and `details.sessionOutcome` for `session_ended`/`session_end`; it does not require or shape-check `details.gateResults` for `legal_stop_evaluated` or `blocked_stop`, even though the command contract says those events should carry gate results. On the visible helper path, incomplete gate payloads could therefore be emitted silently. (`.opencode/command/improve/agent.md:305-309`, `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:78-104`)
- `reduce-state.cjs` is not the first place where the rich stop/outcome contract disappears, because it never opens `improvement-journal.jsonl` at all. Its main path reads only `agent-improvement-state.jsonl`, config, and mirror-drift report, then writes `experiment-registry.json` and `agent-improvement-dashboard.md`; any exact stop/session journal events would remain out-of-band from the reducer-owned operator surfaces. (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:42-54`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`)
- The documented resume/lineage contract is also not exercised by the visible workflow. `.opencode/command/improve/agent.md` says `--session-id` should replay `improvement-journal.jsonl`, resume from `continuedFromIteration`, and support `new`, `resume`, `restart`, `fork`, and `completed-continue`, but the visible auto and confirm YAML phases contain no journal-read step, no `--session-id` propagation, and no branch that consumes prior session results. (`.opencode/command/improve/agent.md:330-339`, `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:111-167`, `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:148-201`)
- The visible stop/synthesis path collapses termination to reducer-generated stop-status booleans and free-text reasons rather than exact journal enums. Auto mode stops when `experiment-registry.json` reports `stopStatus.shouldStop`, confirm mode presents dashboard-driven approval choices, and the reducer renders only `Should stop`, `Drift ambiguity`, and concatenated reasons; there is no operator-facing consumption of `sessionOutcome` or enum-valued `stopReason` on the shipped path. (`.opencode/command/improve/assets/improve_agent-improver_auto.yaml:152-167`, `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:176-201`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:425-475`)

## Ruled Out
- This is not a reducer-only discard bug. The visible YAML workflow never emits journal events into the reducer input path in the first place, so the contract break begins upstream of `reduce-state.cjs`. (`.opencode/command/improve/assets/improve_agent-improver_auto.yaml:149-167`, `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:173-201`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:489-503`)

## Dead Ends
- I did not find a separate visible orchestrator runtime file that programmatically calls `emitEvent()` outside the command/YAML surfaces inspected here, so the conclusion stays scoped to the shipped command contract, journal helper, visible YAML workflow, and reducer path rather than every possible hidden executor implementation.

## Sources Consulted
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:44-47`
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-018.md:16-34`
- `.opencode/command/improve/agent.md:294-339`
- `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:111-167`
- `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:144-201`
- `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:78-104`
- `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:242-275`
- `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:42-54`
- `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:425-503`

## Reflection
- What worked and why: Reading the published command contract, the helper CLI/parser, the visible YAML workflow, and the reducer entrypoint together made it possible to pinpoint exactly where the richer contract stops being real.
- What did not work and why: I could not anchor the result to a single live orchestrator implementation file beyond the command/YAML surfaces, so the conclusion has to stay scoped to the visible shipped path.
- What I would do differently: I would next inspect whether D5 coverage-graph usage is similarly present in prose/helpers but absent from the visible improve-agent control flow so the final iteration can compare two forms of contract drift with the same upstream-to-downstream method.

## Recommended Next Focus
Rotate back to D5 and run one final upstream-to-downstream audit on improve-agent coverage-graph usage. The most productive closeout is to compare any graph-writing helpers or documented graph-aware claims against the visible `/improve:agent` command/YAML/reducer path, then determine whether graph events and coverage decisions actually influence focus selection, stop gating, or contradiction handling, or whether they remain helper-only capability that never enters the operator-visible loop.
