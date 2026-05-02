# Iteration 10: D2 Dimension-Coverage Gate Effectiveness Audit

## Focus
This iteration stayed on D2 and shifted from reducer scale stability to legal-stop gate effectiveness under uneven review-dimension coverage. The goal was to locate a dimension-skewed review packet, then trace whether the documented blocked-stop bundle is both emitted by the active runtime path and preserved in reducer-owned recovery surfaces.

## Findings
- The published `sk-deep-review` contract makes the legal-stop bundle explicitly actionable: if any of the five review gates fail, the loop must persist `stopReason=blockedStop`, carry `legalStop.blockedBy`, copy full `gateResults`, snapshot replay inputs, and attach a gate-specific `recoveryStrategy`; for `dimensionCoverage`, the recovery action is to schedule the next uncovered review dimension immediately (`.opencode/skill/sk-deep-review/references/convergence.md:44-98`, `.opencode/skill/sk-deep-review/references/convergence.md:362-419`).
- The deep-loop optimizer fixture already contains the kind of uneven packet this iteration needed: after two iterations that only examined `correctness` and `security`, run 2 still had 6 active findings and emitted a `blocked_stop` event with `blockedBy:["dimensionCoverage","p0Resolution"]`, replay inputs showing only 2 of 4 review dimensions examined, and a recovery strategy telling the operator to cover `traceability` and `maintainability` before resolving the active P0 (`.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl:2-4`).
- The active auto workflow does not serialize that first-class blocked-stop bundle. Its convergence path still reduces stop legality to four binary `QUALITY GUARDS`, and when a guard fails it only logs `"Quality guard failed: {violations}. Overriding STOP to CONTINUE."`, sets `decision = "CONTINUE"`, and exposes only `decision` plus a human-readable `reason`; no `blocked_stop`, `blockedBy`, `gateResults`, or `recoveryStrategy` append exists in the live path I inspected (`.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:343-369`).
- The reducer cannot keep multi-gate blocks actionable even when the raw JSONL includes them. `renderDashboard()` builds progress rows only from iteration `run/focus/dimensions/newFindingsRatio/findingsSummary/status`, and its next-focus fallback is just the first uncovered required dimension rather than any persisted `legalStop.blockedBy` or `recoveryStrategy`, so a block like `["dimensionCoverage","p0Resolution"]` is flattened into generic coverage progress in reducer-owned outputs (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:484-520`).
- The reducer-owned state model reinforces that drift. `buildFindingRegistry()` tracks finding lifecycle from iteration files plus `resolvedFindings` IDs from iteration records, `buildRegistry()` stores dimension coverage as booleans and severity buckets, and the documented reducer-owned JSON surface mirrors that narrowed shape instead of carrying stop-bundle fields (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:236-295`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:377-390`, `.opencode/skill/sk-deep-review/references/state_format.md:336-352`). The result is that dimension coverage still blocks STOP in principle, but the `blockedBy` set is not preserved where operators actually resume work.

## Ruled Out
- This is not a bad gate taxonomy problem. The blocked-stop fixture uses the same gate names and recovery semantics the contract publishes, so the issue is persistence/consumption drift rather than mislabeled review gates (`.opencode/skill/sk-deep-review/references/convergence.md:362-419`, `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl:4`).
- This is not another reducer merge-stability regression. Iteration 9 already established that finding dedup and transition ordering stay stable at 50+ findings, which leaves observability and recovery handoff as the remaining D2 weakness (`.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-009.md:7-11`).

## Dead Ends
- I did not find a packet-local `blocked_stop` example under `.opencode/specs` review state logs, so the dimension-skewed evidence had to come from the deep-loop optimizer fixture rather than a live spec review packet.

## Sources Consulted
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:39-40
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-009.md:37-38
- .opencode/skill/sk-deep-review/references/convergence.md:44-98
- .opencode/skill/sk-deep-review/references/convergence.md:362-419
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:343-369
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:236-295
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:377-390
- .opencode/skill/sk-deep-review/scripts/reduce-state.cjs:484-520
- .opencode/skill/sk-deep-review/references/state_format.md:336-352
- .opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/sample-040-corpus.jsonl:1-6

## Reflection
- What worked and why: Using the existing blocked-stop fixture kept this pass read-only while still giving me a concrete uneven-dimension packet to compare against the live workflow and reducer surfaces.
- What did not work and why: I could not anchor the analysis to a packet-local review state log because no `blocked_stop` example surfaced under `.opencode/specs`, which limited the runtime evidence to the published path plus fixture coverage.
- What I would do differently: I would rotate to D3 next and inspect an interrupted `sk-improve-agent` session artifact set so the next pass also uses concrete runtime state instead of only contract-plus-fixture comparisons.

## Recommended Next Focus
Rotate to D3 and test whether `sk-improve-agent` actually preserves orchestrator-only journal state when a candidate session stops mid-flight. The most productive next pass is to inspect the improvement journal emitter, mutation coverage namespace writes, and any existing interrupted-session artifacts to determine whether partial candidate runs lose benchmark/trade-off context before the reducer or orchestrator can recover it.
