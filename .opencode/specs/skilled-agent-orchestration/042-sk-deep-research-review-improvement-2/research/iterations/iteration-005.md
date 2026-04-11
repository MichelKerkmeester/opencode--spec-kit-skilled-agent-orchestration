# Iteration 5: D4 Stop-Reason Liveness Audit

## Focus
This iteration stayed on D4 and traced stop-reason liveness from the published convergence contracts into the live auto workflows and reducer/dashboard consumers. The goal was to determine whether `blockedStop`, `userPaused`, and `stuckRecovery` become stable persisted/runtime-visible state, or whether they remain mostly documented normalization targets.

## Findings
- Both convergence contracts publish `userPaused`, `blockedStop`, and `stuckRecovery` as shared `stopReason` enum values, and both also publish explicit legacy-label normalization tables that say raw labels like `paused`, `sentinel file detected`, `stuck_detected`, and `stuck_unrecoverable` should map into that shared enum (.opencode/skill/sk-deep-research/references/convergence.md:21-31; .opencode/skill/sk-deep-research/references/convergence.md:77-90; .opencode/skill/sk-deep-review/references/convergence.md:44-56; .opencode/skill/sk-deep-review/references/convergence.md:427-439).
- Sentinel pauses do not become persisted `userPaused` state in the live auto workflows. Both loops only append `{"type":"event","event":"paused","reason":"sentinel file detected"}` and halt, with no `stopReason` field on the pause record despite the contract mapping that pair to `userPaused` (.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:240-246; .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:325-331; .opencode/skill/sk-deep-research/references/convergence.md:84-85; .opencode/skill/sk-deep-review/references/convergence.md:434-434).
- `stuckRecovery` is also not promoted consistently in live control flow. Deep review appends a raw `stuck_recovery` event with `strategy`, `targetDimension`, and `outcome`, but without `stopReason`; deep research's active `if_stuck_recovery` branch only logs, rewrites `next_focus`, and resets `stuck_count` without appending any recovery event at all (.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:375-383; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:282-290; .opencode/skill/sk-deep-research/references/convergence.md:88-89; .opencode/skill/sk-deep-review/references/convergence.md:157-157; .opencode/skill/sk-deep-review/references/convergence.md:438-439).
- `blockedStop` remains contractual rather than live in the inspected auto paths. The research and review convergence references require a first-class `blocked_stop` event carrying `stopReason=blockedStop` plus full legal-stop payloads, but the active auto YAMLs emit no `blocked_stop`/`blockedStop` record; their only explicit terminal stop-reason persistence is the later `synthesis_complete.stopReason` field (.opencode/skill/sk-deep-research/references/convergence.md:305-309; .opencode/skill/sk-deep-review/references/convergence.md:411-411; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:445-445; .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:661-661).
- The only persisted consumer-facing stop-reason field in the live auto workflows is a free-form `{reason}` string copied into `synthesis_complete.stopReason`, and both workflows explicitly default that value to `completed-continue` when no later stop reason is found. That fallback is outside the published shared enum, so even the terminal stop-reason field can drift away from `converged|maxIterationsReached|userPaused|blockedStop|stuckRecovery|error|manualStop` (.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:409-445; .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:580-661; .opencode/skill/sk-deep-research/references/convergence.md:890-890; .opencode/skill/sk-deep-review/references/convergence.md:565-565).
- The reducer/dashboard layer does not repair that drift. Deep research filters JSONL down to `record.type === 'iteration'` before building registry/dashboard state and only exposes lifecycle metadata from config, while deep review renders dashboard progress from iteration rows and exposes lifecycle mode from config without surfacing any `stopReason` field. In practice, that means no reducer-owned surface normalizes or republishes `userPaused`, `blockedStop`, or `stuckRecovery` for downstream consumers (.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:407-414; .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-502; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:484-548; .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:625-638).

## Ruled Out
- This is not a documentation-gap false alarm: both convergence references already define the shared enum, the legacy-label normalization rules, and the required blocked-stop persistence shape in detail (.opencode/skill/sk-deep-research/references/convergence.md:21-31; .opencode/skill/sk-deep-review/references/convergence.md:44-56).
- `stuckRecovery` is not entirely absent from runtime serialization, but the only concrete live record I found is review's raw `stuck_recovery` event; that is weaker than the documented shared enum contract and does not prove consumer-visible normalization (.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:375-383).

## Dead Ends
- I did not inspect confirm-mode YAMLs in this pass because the active auto workflows plus reducer consumers were already sufficient to determine whether the shared stop-reason enum is promoted into persisted state.

## Sources Consulted
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:44-47
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-004.md:45-46
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:240-246
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:282-290
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:409-445
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:325-331
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:375-383
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:580-661
- .opencode/skill/sk-deep-research/references/convergence.md:21-31
- .opencode/skill/sk-deep-research/references/convergence.md:77-90
- .opencode/skill/sk-deep-research/references/convergence.md:305-309
- .opencode/skill/sk-deep-research/references/convergence.md:890-890
- .opencode/skill/sk-deep-review/references/convergence.md:44-56
- .opencode/skill/sk-deep-review/references/convergence.md:411-439
- .opencode/skill/sk-deep-review/references/convergence.md:565-565
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:407-414
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:489-502
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:484-548
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:625-638

## Reflection
- What worked and why: Tracing the contract tables directly against the live auto YAML append points made it easy to distinguish raw event labels from truly promoted shared stop reasons.
- What did not work and why: The reducer files barely mention stop reasons explicitly, so proving the consumer gap required reading dashboard/render paths rather than relying on symbol search alone.
- What I would do differently: I would compare the confirm-mode workflows next only if we need to know whether this liveness gap is auto-only or universal across all command entrypoints.

## Recommended Next Focus
Rotate to D5 and trace whether contradiction-aware convergence is live or still mostly contractual. The next productive pass is to follow the active runtime path from deep-research/deep-review YAML convergence steps into any shared convergence helpers and verify whether `coverage-graph-contradictions.cjs` or the MCP convergence handler is actually consulted before STOP, or whether contradiction blocking still depends on graph wiring that the current workflows never invoke.
