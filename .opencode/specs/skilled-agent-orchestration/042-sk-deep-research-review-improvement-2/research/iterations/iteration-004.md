# Iteration 4: D4 Lineage Modes and Blocked-Stop Persistence

## Focus
This iteration investigated D4 contract self-compliance in the live deep-research and deep-review workflows. The goal was to verify whether documented lineage branches (`resume`, `restart`, `fork`, `completed-continue`) and blocked-stop gate bundles are actually serialized through the normal YAML -> JSONL -> reducer path, or whether they remain mostly contractual behavior.

## Findings
- The live auto workflows classify `resume`, `restart`, `fork`, and `completed-session`, but the active YAML evidence I inspected does not append first-class `resumed`, `restarted`, `forked`, or `completed_continue` events during those branches. In `sk-deep-research`, the runtime branches only log/skip (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-153`), while the only explicit event appends in the file are `migration`, `paused`, and `synthesis_complete` (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:126`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:244`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:445`). `sk-deep-review` shows the same pattern: lifecycle branches are classified (`.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:155-177`), but the concrete event appends I found are `migration`, `paused`, `stuck_recovery`, and `synthesis_complete` only (`.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:149`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:329`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:382`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:661`).
- `sk-deep-research`'s persisted lineage metadata stays wired to fresh-session defaults in the normal runtime path I inspected. The auto workflow seeds `lineage.lineageMode: "new"`, `lineage.parentSessionId: null`, and `lineage.continuedFromRun: null` during config creation (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:157-180`), then later uses a synthesis fallback of `'completed-continue'` if no stop reason is found (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:390-409`). The reducer's status view reads lifecycle mode only from `config.lineage.lineageMode`, while its JSONL load drops all non-`iteration` records (`.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:405-414`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-490`). That means resume/reopen semantics can influence control flow without updating reducer-visible lineage state away from `new`.
- `sk-deep-review` exposes lifecycle intent more explicitly, but the live path still does not exercise it. The YAML advertises a `lineage_mode` input (`.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:33`), yet the initialization path writes `parentSessionId: null`, `lineageMode: "new"`, and `continuedFromRun: null` into both config and the first JSONL row (`.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:258-260`), and the reducer status panel reads lifecycle mode from `config.lineageMode || 'new'` while likewise filtering its summaries to `type === 'iteration'` rows (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:485-487`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:539-548`). I found no active YAML step in the inspected path that consumes the declared `lineage_mode` input to persist `resume`, `restart`, `fork`, or `completed-continue`.
- The blocked-stop contract is much richer than the live workflow outputs. Deep research requires a replayable legal-stop bundle and says any failed gate must append a `blocked_stop` event carrying `stopReason: "blockedStop"`, `legalStop.blockedBy`, full `legalStop.gateResults`, and a `recoveryStrategy` (`.opencode/skill/sk-deep-research/references/convergence.md:214-220`, `.opencode/skill/sk-deep-research/references/convergence.md:305-309`). Deep review documents the same shape, including a full `gateResults` map and replay inputs (`.opencode/skill/sk-deep-review/references/convergence.md:58-85`, `.opencode/skill/sk-deep-review/references/convergence.md:411-411`). But the live auto workflows emit only `decision` plus a human-readable `reason` from convergence (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:268-286`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:356-372`), so the documented gate bundle never appears in the reducer-facing runtime outputs I inspected.
- Because both reducers collapse JSONL to iteration rows only, even a correctly emitted blocked-stop event would not survive into the synchronized dashboard/strategy surfaces without separate promotion logic. Deep research loads `parseJsonl(...).filter((record) => record.type === 'iteration')` before rendering status and metrics (`.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:405-414`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-490`), and deep review derives both dashboard and status output from the same iteration-only view (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:485-487`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:539-548`). So full `gateResults` and lifecycle events are currently dropped twice: first by the flat YAML outputs, then again by reducer ingestion rules.

## Ruled Out
- This is not just a documentation omission. Both convergence references are explicit about first-class blocked-stop persistence and full gate bundles, so the drift is between published contract and live workflow serialization, not between two equally vague docs (`.opencode/skill/sk-deep-research/references/convergence.md:305-309`, `.opencode/skill/sk-deep-review/references/convergence.md:58-85`).
- This is not isolated to one loop. The research and review auto YAMLs both classify the same lineage branches while only surfacing a smaller event set in the active runtime path (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-153`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:155-177`).

## Dead Ends
- I did not inspect confirm-mode YAMLs in this pass because the strategy focus was the normal runtime path, and the auto workflows plus reducers were enough to establish the serialization gap.

## Sources Consulted
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:44-47
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-003.md:38-39
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-180
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:390-445
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:155-177
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:258-260
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:566-580
- .opencode/skill/sk-deep-research/references/loop_protocol.md:46-91
- .opencode/skill/sk-deep-research/references/state_format.md:234-246
- .opencode/skill/sk-deep-research/references/convergence.md:214-220
- .opencode/skill/sk-deep-research/references/convergence.md:305-309
- .opencode/skill/sk-deep-review/references/loop_protocol.md:503-522
- .opencode/skill/sk-deep-review/references/convergence.md:50-85
- .opencode/skill/sk-deep-review/references/convergence.md:403-411
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:405-414
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-490
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:485-487
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:539-548

## Reflection
- What worked and why: Comparing the auto YAML branches against the reducer ingestion rules made it easy to separate control-flow promises from persisted runtime evidence.
- What did not work and why: Contract terminology is more detailed than the live YAML outputs, so I had to keep checking whether a documented event was actually serialized or merely described.
- What I would do differently: I would inspect confirm-mode and command-wrapper surfaces next only if the goal is to prove whether this drift is specific to auto mode or shared across all entrypoints.

## Recommended Next Focus
Rotate to the remaining D4 question about stop-reason liveness. The next productive pass is to trace whether `blockedStop`, `userPaused`, and `stuckRecovery` are merely documented stop reasons or whether they are actually converted into terminal/recovery state across synthesis, dashboards, and pause handling. That should include checking whether sentinel pauses ever become `userPaused` in persisted state, whether `stuck_recovery` is normalized to `stuckRecovery` beyond raw event rows, and whether any wrapper or reducer path promotes those reasons into a stable stop-reason enum consumers can rely on.
