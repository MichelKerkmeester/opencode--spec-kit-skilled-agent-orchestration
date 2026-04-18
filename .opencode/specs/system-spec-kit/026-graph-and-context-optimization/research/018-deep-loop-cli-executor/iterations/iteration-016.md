# Iteration 016

## Focus

Q5 refinement: inspect whether the `N=3` retry budget for `partial_causal_link_unresolved` is empirically grounded or still a policy guess, and quantify the failure-resolution distribution if the checked-in artifacts allow it.

## Actions Taken

1. Re-read the earlier Q5 write-up in [iteration-006.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/018-deep-loop-cli-executor/iterations/iteration-006.md:1) so this pass would refine the evidence instead of repeating it.
2. Read the live implementation in [retry-budget.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/retry-budget.ts:1) and the scheduling gate in [post-insert.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:400) to confirm exactly when attempts are counted, when `runEnrichmentBackfill` is omitted, and when a success clears budget state.
3. Read the direct tests in [retry-budget.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retry-budget.vitest.ts:1) and [post-insert-deferred.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/post-insert-deferred.vitest.ts:383) to quantify the attempt distribution that is actually encoded in the checked-in corpus.
4. Read the introducing commit `61f93c9bf` plus the operator-facing feature/playbook docs in [09-post-insert-retry-budget.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/09-post-insert-retry-budget.md:1) and [268-post-insert-retry-budget.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/268-post-insert-retry-budget.md:1) to see whether any stronger rationale than bounded retry control was ever captured.
5. Searched the Phase 017/018 packet tree for checked-in traces, logs, JSONL, or operational notes containing `partial_causal_link_unresolved`, `Retry budget exhausted`, or `attempts=` outside code/tests/docs to determine whether any real failure-resolution histogram exists on disk.

## Findings

### P1. The only checked-in "distribution" is a synthetic boundary fixture: 3 unresolved retries allowed, 4th suppressed, 0 observed mixed-resolution cases

Reproduction path:
- Read [retry-budget.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retry-budget.vitest.ts:16).
- Read [post-insert-deferred.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/post-insert-deferred.vitest.ts:238) and [post-insert-deferred.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/post-insert-deferred.vitest.ts:383).

Evidence:
- The unit budget suite encodes a single outcome ladder for `partial_causal_link_unresolved`: before any failure the tuple is retryable, after failures 1 and 2 it is still retryable, after failure 3 `shouldRetry()` flips false, and there is no modeled "resolved on attempt 2" or "resolved on attempt 3" case.
- The post-insert deferred test repeats the same unresolved causal-link result four times for memory `#404`; the first three runs retain `followUpAction: 'runEnrichmentBackfill'`, while the fourth stays `partial` but omits the backfill action entirely.
- The only success/reset evidence is indirect: `buildExecutionStatus()` clears the budget when all steps finish `ran`, and the retry-budget unit tests separately prove `clearBudget()` / `clearAllBudgets()` reset state. There is still no end-to-end checked-in trace showing an unresolved tuple that later resolves on a second or third pass.

Quantified checked-in distribution:
- Retryable unresolved outcomes shown in artifacts: attempts `0`, `1`, and `2`
- Exhaustion boundary shown in artifacts: failure `3` causes the next check to deny retry, and the fourth end-to-end run suppresses `runEnrichmentBackfill`
- Mixed unresolved-to-resolved recovery examples shown in artifacts: `0`
- Real runtime or production-like histograms shown in artifacts: `0`

Impact:
- The repo can justify "deterministic cap after three failures," but not "three is where recovery probability meaningfully drops off."
- Phase 019 should treat the present distribution evidence as fixture-shaped, not workload-shaped.

Risk-ranked remediation candidates:
- P1: document that the shipped evidence proves bounded behavior only, not calibration.
- P1: add telemetry or sampled traces that record whether the same `(memoryId, step, reason)` tuple resolves on attempt 2 or 3 before changing the threshold.

### P1. Commit and packet-era prose still describe `3` as bounded hot-loop control, not as an empirically measured success curve

Reproduction path:
- Read commit `61f93c9bf`.
- Read [09-post-insert-retry-budget.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/09-post-insert-retry-budget.md:10).
- Read [268-post-insert-retry-budget.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/268-post-insert-retry-budget.md:17).

Evidence:
- The introduction commit message is framed as a fix for "retry-exhaustion budget" on the review finding, with no calibration note, histogram, rollout sample, or operator rationale for choosing `3` over any other bound.
- The feature card says the goal is to stop the same doomed repair work from looping forever and to give operators a deterministic reset point. That is a control-policy rationale.
- The manual playbook mirrors the same contract: "first three retries allowed; fourth skipped; successful completion clears the memory-specific budget." It validates behavior, not the choice of number.

Impact:
- This refinement strengthens iteration 006: every checked-in explanatory layer still points to a resilience heuristic rather than measured attempt-success data.
- If the team wants to preserve `3`, the honest Phase 019 framing is "policy default chosen for bounded churn."

Risk-ranked remediation candidates:
- P1: add an explicit ADR-style note or feature-card sentence labeling `3` as a heuristic/policy bound.
- P2: only promote the number to a config surface after there is evidence that different deployments materially need different caps.

### P2. The repo still contains no real on-disk attempt histogram for this path, so Q5 cannot be completed from artifact mining alone

Reproduction path:
- Search the packet and skill trees for `partial_causal_link_unresolved`, `Retry budget exhausted`, and `attempts=`.

Evidence:
- Outside code, tests, feature docs, playbook prose, and prior review/research notes, the search does not surface checked-in runtime logs showing actual tuples progressing from attempt 1 to resolution or exhaustion.
- The structured warning string in [post-insert.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:413) exists only as implementation text; there are no captured log files or JSONL traces using it.
- The deepest packet-local evidence remains the earlier Q5 state record in [deep-research-state.jsonl](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/018-deep-loop-cli-executor/deep-research-state.jsonl:8), which already classified the threshold as policy-driven. This pass found no newer artifact class to overturn that.

Impact:
- The checked-in corpus is sufficient to answer "policy or measurement?" but insufficient to infer a true failure-resolution distribution.
- Any tighter numeric recommendation in Phase 019 would still be speculative unless new telemetry or sampled logs are added.

Risk-ranked remediation candidates:
- P2: emit lightweight structured retry telemetry for `(memoryId, step, reason, attempt, outcome)` on this path.
- P2: capture a short operational sample and compute a simple resolution-by-attempt table before revisiting the cap.

## Questions Answered

- Q5 refinement: yes, the repo evidence now supports a tighter answer than iteration 006.
  - `N=3` is still policy-driven, not empirically calibrated.
  - The checked-in artifact distribution is synthetic only: attempts `0/1/2` retryable, failure `3` exhausts the budget, fourth end-to-end run skips backfill, and there are zero checked-in mixed-resolution examples showing later success.

## Questions Remaining

- Does any off-repo operator telemetry exist showing that unresolved causal-link tuples often recover on attempt 2 or 3?
- Are most `partial_causal_link_unresolved` cases truly transient (for example missing upstream memories arriving shortly after save), or mostly structural and therefore better served by a lower cap?
- If telemetry remains unavailable, should Phase 019 keep `3` as a documented heuristic or lower it to match the "structurally non-retryable" framing more aggressively?

## Next Focus

Q6: inspect whether AsyncLocalStorage caller-context propagation survives common async boundaries such as `setTimeout`, `Promise.all`, and deferred event-loop handoffs, or whether some Phase 017/018 paths still silently drop `getCallerContext()`.
