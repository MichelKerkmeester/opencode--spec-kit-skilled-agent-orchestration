# Iteration 006

## Focus

Q5: retry-budget policy calibration. Inspect whether `N = 3` for `partial_causal_link_unresolved` is backed by observed failure-resolution distribution or, like Q10, currently functions as a policy default without empirical grounding.

## Actions Taken

1. Read the live retry-budget implementation in [retry-budget.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/retry-budget.ts:1) and the consuming save-path logic in [post-insert.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:256) to confirm exactly when attempts are counted and when requeueing stops.
2. Read the shipped tests in [retry-budget.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retry-budget.vitest.ts:1) and [post-insert-deferred.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/post-insert-deferred.vitest.ts:383) to see whether attempt `2` or `3` success is demonstrated anywhere or whether the suite only encodes deterministic exhaustion.
3. Read the introducing commit `61f93c9bf` plus downstream documentation in the Phase 017 tasks/checklist and the lifecycle feature card [09-post-insert-retry-budget.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/09-post-insert-retry-budget.md:1) to inspect how `N=3` was justified in packet-era prose.
4. Searched the repo for `partial_causal_link_unresolved`, the structured exhaustion log string, and related attempt markers to determine whether any checked-in traces capture a real failure-resolution distribution outside tests and docs.

## Findings

### P1. `N=3` is implemented as a fixed policy constant with no checked-in empirical calibration artifact

Reproduction path:
- Read [retry-budget.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/retry-budget.ts:32-50).
- Read the introducing commit `61f93c9bf`.
- Read the feature card [09-post-insert-retry-budget.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/09-post-insert-retry-budget.md:16-24).

Evidence:
- The runtime hardcodes `const MAX_RETRIES = 3` with no config surface, no inline rationale comment, and no link to a measured success-rate distribution.
- Commit `61f93c9bf` adds the constant and wiring, but the diff only proves behavior, not why `3` was chosen instead of `1`, `2`, `5`, or time-based backoff.
- The feature card frames the purpose as stopping "structurally non-retryable" failures from looping indefinitely and giving operators a deterministic reset point. That is a policy justification about bounded churn, not an empirical statement that retries commonly recover by attempt two or three.

Impact:
- Q5 is partially answered: the checked-in repo evidence supports "guardrail default chosen to stop hot-loop retry churn" much more strongly than "number derived from observed resolution-rate data."
- Phase 019 should treat `3` as a policy default whose calibration remains undocumented, not as a measured retry-success threshold.

Risk-ranked remediation candidates:
- P1: explicitly document the basis for `3` in Phase 019 as a policy choice if that is intentional.
- P1 alternative: if empirical grounding is desired, instrument and sample real retry outcomes before changing the budget.

### P1. The shipped tests validate deterministic exhaustion only; they do not demonstrate a real failure-resolution distribution

Reproduction path:
- Read [retry-budget.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retry-budget.vitest.ts:20-30).
- Read [post-insert-deferred.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/post-insert-deferred.vitest.ts:383-440).

Evidence:
- The unit suite encodes only one boundary: first three attempts allowed, fourth denied.
- The integration-style post-insert test mocks the exact same unresolved causal-link result four times in a row, then asserts the first three schedule `runEnrichmentBackfill` and the fourth omits it.
- No shipped test models "attempt 1 unresolved, attempt 2 resolved" or any other mixed outcome frequency from real workloads.

Impact:
- The tests prove the budget is deterministic and correctly wired, but they do not provide any evidence that attempts two or three are materially useful in practice.
- Any claim that `3` is calibrated from observed retry recovery would currently overstate what the suite proves.

Risk-ranked remediation candidates:
- P1: add telemetry-backed assertions or at least a fixture corpus representing plausible attempt-2 / attempt-3 recoveries if those are expected.
- P2: add a tiny operator-facing note distinguishing "behavior verified" from "threshold calibrated."

### P2. Repo-wide artifacts contain almost no runtime traces for this failure mode, so there is no on-disk resolution histogram to mine

Reproduction path:
- Search the repo for `partial_causal_link_unresolved` and `Retry budget exhausted for memory`.

Evidence:
- The overwhelming majority of hits are code, tests, packet docs, or review artifacts; the densest bucket is [retry-budget.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retry-budget.vitest.ts:1).
- The structured warning log exists in [post-insert.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:407-428), but there are no checked-in runtime log captures showing actual attempt counts converging before exhaustion.
- The only adjacent non-test evidence is documentation describing the intended contract and one review-delta note about restart wiping an in-memory budget; none of it measures success-by-attempt frequency.

Impact:
- There is no credible checked-in dataset from which to infer whether attempt two or three meaningfully improves resolution odds.
- Q5 therefore remains bounded by code-and-doc evidence only.

Risk-ranked remediation candidates:
- P2: emit lightweight structured retry telemetry for this path, including `(memoryId, reason, attempt, outcome)` and whether a later attempt resolved the same tuple.
- P2: capture a short operational sample before Phase 019 locks any stricter policy or tunable config.

### P2. The current design reads as "allow a few retries, then stop" rather than "retry until the observed success curve flattens"

Reproduction path:
- Read [post-insert.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:256-263) and [post-insert.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:407-449).
- Read [09-post-insert-retry-budget.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/09-post-insert-retry-budget.md:10-24).

Evidence:
- The code increments attempts only for `partial_causal_link_unresolved`, keeps requeueing while the budget says yes, and clears the budget on any fully successful enrichment run.
- The feature card explicitly says the budget exists to prevent the same doomed repair work from being rescheduled forever inside one MCP process.
- Later Phase 018 follow-up work tightened the API to emphasize process-local ephemerality, but still did not add calibration data or a policy note about why three attempts is optimal.

Impact:
- The evidence points to a resilience heuristic: preserve a small chance that a transient prerequisite appears on a later pass, but cap the hot-loop quickly.
- That is a defensible design, but it is not the same as empirical calibration.

Risk-ranked remediation candidates:
- P2: keep `3` but document it explicitly as a resilience heuristic.
- P2 alternative: expose the budget as a config surface only after telemetry shows real variation by deployment or workload.

## Questions Answered

- Q5. Is the N=3 retry budget for `partial_causal_link_unresolved` empirically justified or arbitrary? What's the actual failure-resolution distribution?
  Partially answered: inside the checked-in repo, `N=3` behaves like a policy default rather than an empirically calibrated threshold. The code hardcodes the constant, the introduction commit and feature docs justify it in terms of stopping indefinite retry churn, and the tests only verify deterministic exhaustion. No checked-in runtime traces or datasets show how often attempt two or three actually resolves the same failure tuple.

## Questions Remaining

- Is there any off-repo operator evidence, production log sample, or rollout note that motivated choosing three retries specifically for this failure mode?
- Are `partial_causal_link_unresolved` cases expected to resolve because upstream memories may arrive shortly after save, or are most of them structurally non-retryable and therefore candidates for a lower budget?
- Should Phase 019 preserve `3` as a documented heuristic, lower it, or make it tunable only after telemetry exists?

## Next Focus

Q6: AsyncLocalStorage caller-context propagation edge cases. Inspect whether the Phase 017/018 caller-context path survives common async boundaries such as `setTimeout`, `Promise.all`, and deferred event-loop handoffs, or whether there are still execution paths where `getCallerContext()` silently falls back to `null`.
