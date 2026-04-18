# Iteration 005

## Focus

Q10: continuity-freshness threshold calibration. Inspect whether the 10-minute `_memory.continuity.last_updated_at` vs `graph-metadata.json.derived.last_save_at` tolerance is backed by observed save-path latency or only by packet-era intuition.

## Actions Taken

1. Read the live validator in `.opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts` and the continuity writer in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` to confirm the exact contract enforced in code.
2. Read the introduction diff for commit `32a180bba` plus the shipped test suite in `.opencode/skill/system-spec-kit/scripts/tests/continuity-freshness.vitest.ts` to see whether the 10-minute threshold came with empirical calibration evidence or only fixture-based boundaries.
3. Re-read iteration 001 and the Phase 017 packet references that cite FC-2 / T-W1-CNS-05 so the runtime contract could be compared against packet wording.
4. Sampled current spec folders under `.opencode/specs/system-spec-kit/` to measure real on-disk deltas between `_memory.continuity.last_updated_at` and `graph-metadata.json.derived.last_save_at`.

## Findings

### P1. The runtime contract is one-sided and policy-shaped, not a measured symmetric freshness window

Reproduction path:
- Read `.opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts`.
- The validator computes `deltaMs = graphMs - continuityMs` and warns only when `deltaMs > 10 * 60 * 1000`.
- If `deltaMs < 0`, it returns `code='clock_drift'` and treats continuity being newer than graph metadata as benign.

Evidence:
- The implementation enforces only "`continuity` must not lag `graph` by more than 10 minutes."
- This matches Phase 017 packet wording like `description.json.lastUpdated >= graph-metadata.json.derived.last_save_at - 10m` in `017-review-findings-remediation/spec.md` and `003-rollout-sweeps/spec.md`.
- It does **not** match the symmetric "`<= 10m divergent`" phrasing that iteration 001 already found in packet-era prose.

Impact:
- Q10 is partially answered: the live code does not implement a bidirectional freshness tolerance. It implements a one-sided stale-after-graph-save budget.
- Any Phase 019 scoping that still describes freshness as a symmetric divergence window is now contractually inaccurate.

Risk-ranked remediation candidates:
- P1: normalize all Phase 019 wording and downstream docs/tests to the one-sided contract if that is the intended policy.
- P1 alternative: if symmetric divergence is actually intended, the validator and tests must change, because current code explicitly blesses negative deltas.

### P1. No checked-in evidence shows the 10-minute number was calibrated from observed save-path latency

Reproduction path:
- Read `git show 32a180bba -- .opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts .opencode/skill/system-spec-kit/scripts/tests/continuity-freshness.vitest.ts`.
- Inspect the initial fixtures in `continuity-freshness.vitest.ts`.

Evidence:
- The introduction commit adds a hardcoded `10 * 60 * 1000` threshold and synthetic fixtures at `12:09:59Z` (pass) and `12:10:01Z` (warn).
- The commit diff contains no latency histogram, sampled save logs, benchmark note, packet rationale block, or empirical distribution explaining why ten minutes was chosen instead of one minute, five minutes, or fifteen minutes.
- The associated packet references in `017-review-findings-remediation/tasks.md` and feature-catalog prose describe the rule as a validator contract, not as a measured SLA derived from save-path timing.

Impact:
- The checked-in evidence supports "guardrail selected for operator tolerance" more strongly than "threshold calibrated from observed runtime latency."
- Phase 019 should treat the ten-minute value as a policy default whose justification is currently under-documented.

Risk-ranked remediation candidates:
- P1: add explicit provenance for the threshold in the Phase 019 scoping doc or ADR, including whether it is a human-edit tolerance, a save-path SLA, or a temporary heuristic.
- P2: if the team wants calibration, capture actual save-path timing around canonical saves before changing the threshold.

### P2. The existing same-workflow write surfaces suggest ordinary latency should be near-immediate, not minutes

Reproduction path:
- Read `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1234`, where `last_updated_at` is stamped with `new Date().toISOString()`.
- Read `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1156-1177`, where `refreshGraphMetadataForSpecFolder()` derives and writes metadata inline during the caller's invocation.

Evidence:
- Continuity timestamps are created at write time, not reconstructed from a queued background job.
- Graph metadata refresh is also an inline write path with no built-in delayed scheduler shown in the inspected function.
- The shipped tests model graph freshness by injecting a `now` value directly into `refreshGraphMetadataForSpecFolder()`, which reinforces that this validator is checking logical ordering, not waiting on a known slow async replication path.

Impact:
- Based on the inspected code, a ten-minute budget is much looser than the latency implied by the same-process write paths themselves.
- That does not prove the budget is wrong, but it does make "protect operators from occasional separate-step saves or manual continuity edits" a more plausible explanation than "the canonical save path routinely takes minutes."

Risk-ranked remediation candidates:
- P2: instrument canonical save to emit paired timestamps or elapsed-write telemetry if the team wants proof of actual latency.
- P2: document that the 10-minute budget is intentionally forgiving because continuity and graph refresh can be triggered in adjacent but distinct steps.

### P2. Current repo-wide timestamp pairs do not show a natural positive-delta cluster anywhere near 10 minutes

Reproduction path:
- Enumerate spec folders that contain both `implementation-summary.md` and `graph-metadata.json`.
- Parse `_memory.continuity.last_updated_at` and `derived.last_save_at`, then compute `graph - continuity` in minutes.

Observed sample from this iteration:
- `total_pairs = 73`
- `graph_newer_pairs = 63`
- `graph_newer_within_1_min = 0`
- `graph_newer_within_10_min = 0`
- Largest positive deltas are not near the boundary; they are massive stale gaps such as `9443.25` minutes and repeated `9258.25` minute clusters.
- Negative deltas also exist (`-25` to `-645` minutes in the top sampled rows), which the validator currently blesses as benign clock drift.

Impact:
- The present on-disk corpus does not reveal an empirical "normal save-path latency lives between 0 and 10 minutes" pattern.
- This does not isolate clean same-save events, so it is not enough to choose a better number by itself. It does, however, reinforce that the current threshold is not visibly grounded in an observed repository-wide latency band.

Risk-ranked remediation candidates:
- P2: capture dedicated same-save telemetry instead of inferring from long-lived drifted packets.
- P2: add a second diagnostic mode that reports positive-delta distributions separately from stale-policy failures, so future calibration is evidence-backed.

## Questions Answered

- Q10. Is the 10-minute continuity-freshness threshold calibrated to real metadata-refresh latency, or is it a guess?
  Partially answered: the checked-in evidence supports a policy/heuristic interpretation, not an empirically calibrated save-latency threshold. The runtime validator is one-sided, the introduction commit uses synthetic 9:59 and 10:01 fixtures, and no checked-in measurement artifact justifies the ten-minute number. The inspected write paths also look immediate enough that minutes-scale latency is not obviously the motivating constraint. What remains unproven is whether external operator workflow data exists outside the repo.

## Questions Remaining

- Is there any off-repo operator evidence, rollout note, or manual-testing record that originally motivated ten minutes as a human workflow buffer?
- Does `generate-context.js` always refresh graph metadata in the same invocation path as continuity writes, or are there supported workflows where graph refresh intentionally trails continuity by separate operator action?
- Should Phase 019 keep the current one-sided contract, tighten the threshold, or expose the threshold as a documented config/policy surface?

## Next Focus

Q5: retry-budget policy calibration. Inspect whether `N = 3` for `partial_causal_link_unresolved` is backed by observed failure-resolution distribution or, like Q10, currently functions as a policy default without empirical grounding.
