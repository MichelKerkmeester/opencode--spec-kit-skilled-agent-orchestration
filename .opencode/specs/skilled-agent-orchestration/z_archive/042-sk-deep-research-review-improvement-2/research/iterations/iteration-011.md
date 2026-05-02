# Iteration 11: D3 Mid-Flight Journal Recovery Audit

## Focus
This iteration rotated to D3 and tested whether `sk-improve-agent` preserves enough orchestrator-owned state to recover a candidate session that stops before normal completion. The investigation focused on the journal emitter, mutation-coverage persistence, and the strongest existing improvement artifacts to see whether benchmark and trade-off context survives an interrupted run.

## Findings
- The published CLI example for journal emission does not match the actual emitter interface. The command guide shows `--emit --journal=... --event=session_initialized`, but `improvement-journal.cjs` only accepts `--emit <eventType> --journal <path>` and never parses `--event`, so the documented invocation falls through to the usage/error path instead of writing a journal record (`.opencode/command/improve/agent.md:296-300`, `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:243-245`, `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:251-275`).
- The resume contract promises richer recovery than the shipped journal helpers provide. The skill says resume replays the journal, coverage graph, and registry before dispatch, but the journal module only exposes raw-event readback, `getLastIteration()`, and `getSessionResult()`. If an interruption happens before a `session_ended` event is written, `getSessionResult()` returns `{ stopReason: null, sessionOutcome: null }`, so the helper surface itself does not reconstruct candidate, gate, benchmark, or trade-off state (`.opencode/skill/sk-improve-agent/SKILL.md:290-300`, `.opencode/command/improve/agent.md:332-339`, `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:148-203`).
- Benchmark and trade-off context currently has no guaranteed durable handoff at mid-flight boundaries. The command contract explicitly documents emits for `session_initialized`, `candidate_scored`, `legal_stop_evaluated`, and `session_ended`, but not `benchmark_completed` or `trade_off_detected`; meanwhile `trade-off-detector.cjs` reconstructs trajectory only from `candidate_scored` journal events, and `benchmark-stability.cjs` operates entirely on in-memory replay result arrays with no persistence helper of its own (`.opencode/command/improve/agent.md:296-309`, `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:47-67`, `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs:130-172`, `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:95-171`).
- The mutation-coverage substrate is durable in a weaker way than the journal and is vulnerable to partial-write loss. Both `recordMutation()` and `recordTrajectory()` load the whole JSON document and rewrite it with `writeFileSync`, while the config explicitly marks `mutation-coverage.json` as `mutable` rather than append-only. A crash during rewrite can therefore lose prior mutation/exhausted/trajectory context that resume depends on (`.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:50-53`, `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:80-93`, `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:192-205`, `.opencode/skill/sk-improve-agent/assets/improvement_config.json:92-95`, `.opencode/skill/sk-improve-agent/assets/improvement_config.json:124-129`).
- The strongest existing repo artifact set does not demonstrate the new recovery surfaces in practice. The persisted self-test improvement state under packet 041 still contains only legacy `agent-improvement-state.jsonl` score snapshots with iteration, candidate file, score, recommendation, dimensions, and timestamp fields; there are no persisted `stopReason`, `sessionOutcome`, `blocked_stop`, or trade-off records in that artifact, so there is no in-repo interrupted-session example proving that the new journal-based recovery path actually preserves mid-flight context (`.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-agent-improver-self-test/improvement/agent-improvement-state.jsonl:1-3`).

## Ruled Out
- The main D3 risk is not proposal-agent side effects; the failure surface here is orchestrator wiring and persistence fidelity, not the proposal-only boundary itself.

## Dead Ends
- I did not find a packet-local `improvement-journal.jsonl` or `mutation-coverage.json` artifact to inspect directly, so this pass had to infer interrupted-session behavior from the shipped helper surfaces plus the remaining legacy self-test state.

## Sources Consulted
- `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:47-67`
- `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:148-203`
- `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:243-275`
- `.opencode/command/improve/agent.md:296-339`
- `.opencode/skill/sk-improve-agent/SKILL.md:246-300`
- `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:50-53`
- `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:80-93`
- `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:192-205`
- `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs:130-172`
- `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:95-171`
- `.opencode/skill/sk-improve-agent/assets/improvement_config.json:80-95`
- `.opencode/skill/sk-improve-agent/assets/improvement_config.json:124-129`
- `.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-agent-improver-self-test/improvement/agent-improvement-state.jsonl:1-3`

## Reflection
- What worked and why: Tracing the documented emit commands against the actual helper interfaces exposed the mid-flight recovery gap much faster than searching for every possible artifact.
- What did not work and why: There was no persisted `improvement-journal.jsonl` fixture in the repo to validate against, so the evidence had to come from runtime helper surfaces rather than a completed interrupted-session replay.
- What I would do differently: I would next inspect reducer or orchestrator consumers directly to see whether any higher layer compensates for the thin helper surface by reconstructing blocked-stop and benchmark context manually.

## Recommended Next Focus
Stay on D3 for one more pass, but shift from persistence primitives to the consumer side: inspect the orchestrator or reducer code paths that claim to replay journal + coverage graph + registry and verify whether they actually rebuild candidate lineage, blocked-stop evidence, benchmark stability warnings, and trade-off decisions from raw files. If no such reconstruction exists, that closes the remaining D3 questions around benchmark false positives versus stability gating and clarifies whether the current recovery design is merely under-documented or fundamentally under-persisted.
