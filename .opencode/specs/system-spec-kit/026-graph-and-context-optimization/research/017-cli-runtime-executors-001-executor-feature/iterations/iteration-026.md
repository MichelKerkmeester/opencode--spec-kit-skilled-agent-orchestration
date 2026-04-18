# Iteration 026

## Focus

Q10 refinement: re-check whether the 10-minute continuity-freshness budget reflects any real same-save latency pattern in the live `026-graph-and-context-optimization` corpus, or whether it still behaves like a coarse policy guardrail that mostly masks stale and format-skewed packets.

## Actions Taken

1. Re-read the shipped validator in [continuity-freshness.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts) to confirm the exact contract, especially the 10-minute constant and the `deltaMs < 0` `clock_drift` branch.
2. Re-checked the write-path surfaces in [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts) and [graph-metadata-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts) to verify whether continuity and graph metadata are stamped inline or via an obviously delayed pipeline.
3. Ran a focused corpus scan across spec folders under `026-graph-and-context-optimization` that contain both `implementation-summary.md` and `graph-metadata.json`, then computed `graph-metadata.derived.last_save_at - _memory.continuity.last_updated_at` deltas.
4. Opened concrete outlier examples in [017-cli-runtime-executors/001-executor-feature/implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-cli-runtime-executors/001-executor-feature/implementation-summary.md), [017-cli-runtime-executors/001-executor-feature/graph-metadata.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-cli-runtime-executors/001-executor-feature/graph-metadata.json), [012-command-graph-consolidation/implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-command-graph-consolidation/implementation-summary.md), and [012-command-graph-consolidation/graph-metadata.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-command-graph-consolidation/graph-metadata.json) to anchor the distribution to real packet state rather than aggregate counts alone.

## Findings

### P1. The 10-minute budget still has no empirical support inside the live 026 corpus

Reproduction path:
- Read `CONTINUITY_STALENESS_THRESHOLD_MS = 10 * 60 * 1000` and the stale check in `continuity-freshness.ts`.
- Enumerate `026-graph-and-context-optimization/**/{implementation-summary.md,graph-metadata.json}` pairs.
- Parse `_memory.continuity.last_updated_at` and `derived.last_save_at`, then compute `graph - continuity`.

Evidence:
- The validator still hard-codes a 10-minute budget and only warns when `graphMs - continuityMs > 600000`.
- The focused 026 scan produced `total=60`, `negativeCount=10`, `zeroTo600Count=0`, and `over600Count=50`.
- The smallest positive delta found was `24327` seconds (about 6.8 hours) in `014-memory-save-rewrite`, not anything near the configured 10-minute boundary.

Why this matters:
- The checked-in packet family does not show a "normal same-save latency cluster" anywhere inside the intended 0-10 minute safe band.
- That makes the threshold look like a forgiving policy sentinel, not a boundary derived from observed canonical-save behavior.

Risk-ranked remediation candidates:
- P1: document the 10-minute value as an interim policy budget in Phase 019+ rather than implying it is calibrated.
- P1: collect actual paired save telemetry before tightening or defending the threshold as a latency-based SLA.

### P1. The live rule still blesses hours-scale negative deltas as benign `clock_drift`

Reproduction path:
- Read the `deltaMs < 0` branch in `continuity-freshness.ts`.
- Open `017-cli-runtime-executors/001-executor-feature/implementation-summary.md` and `017-cli-runtime-executors/001-executor-feature/graph-metadata.json`.

Evidence:
- The validator returns pass/`clock_drift` whenever continuity is newer than graph metadata, regardless of magnitude.
- Phase 018 currently has `_memory.continuity.last_updated_at = 2026-04-18T10:45:00Z` while `graph-metadata.json.derived.last_save_at = 2026-04-18T00:00:00Z`, a delta of `-38700` seconds (about 10.75 hours).
- The 026 scan found 10 negative-delta folders, with several additional large negative cases under `016-foundational-runtime` and its child phases.

Why this matters:
- The live contract is not a "same refresh window" invariant. It is a one-sided stale-after-graph warning that explicitly tolerates very large reverse drift.
- Any Phase 019+ wording that frames the threshold as general freshness equivalence remains misleading.

Risk-ranked remediation candidates:
- P1: rewrite Phase 019+ scoping language to describe the rule as one-sided and advisory.
- P1: if same-pass provenance actually matters, replace the drift heuristic with a shared save-lineage marker instead of relying on timestamp subtraction.

### P2. Date-only continuity timestamps create synthetic stale failures that the threshold cannot distinguish from real save lag

Reproduction path:
- Open `012-command-graph-consolidation/implementation-summary.md` and inspect `_memory.continuity.last_updated_at`.
- Open the matching `graph-metadata.json`.

Evidence:
- Phase 012 stores `last_updated_at: "2026-04-15"` with no time component.
- The matching graph metadata stores `derived.last_save_at: "2026-04-15T17:30:00.000Z"`.
- Parsed literally, that becomes a positive delta of `63000` seconds (17.5 hours), which lands in the same stale bucket as genuinely old packets.
- A second date-only example exists in `009-playbook-and-remediation/003-deep-review-remediation`, where the delta is `209895` seconds.

Why this matters:
- The current threshold conflates at least three regimes: genuinely stale continuity, intentionally newer continuity, and low-precision/date-only continuity formatting.
- That makes the validator weak as a calibration source because format noise dominates the same window it is supposed to measure.

Risk-ranked remediation candidates:
- P2: normalize continuity timestamps to full ISO datetime before relying on corpus deltas for calibration.
- P2: add a separate low-precision timestamp code path so date-only frontmatter is reported distinctly from true stale-after-save drift.

### P2. The write path still looks inline enough that a minutes-scale latency budget is hard to justify from code inspection alone

Reproduction path:
- Read `memory-save.ts:1234`, where continuity stamps `last_updated_at` with `new Date().toISOString()`.
- Read `refreshGraphMetadataForSpecFolder()` in `graph-metadata-parser.ts`, which refreshes and writes graph metadata inline via atomic temp-file swap.

Evidence:
- Continuity timestamps are created at write time rather than reconstructed later from an async queue.
- Graph metadata refresh is also performed in-process and synchronously writes the file immediately.
- No inspected code path explains why an ordinary same-invocation save should naturally drift by minutes, much less need a 10-minute tolerance.

Why this matters:
- Code inspection and corpus behavior point in the same direction: the threshold is most plausibly compensating for multi-step operator workflows, stale packets, or formatting skew, not real in-process refresh latency.

Risk-ranked remediation candidates:
- P2: emit paired continuity/graph timestamps during canonical save so Phase 019+ can measure same-invocation latency directly.
- P2: if the goal is to tolerate adjacent-but-separate operator actions, document that explicitly instead of implying the save path itself is slow.

## Questions Answered

- Q10 refined: the 10-minute continuity-freshness threshold still behaves like a loose policy guardrail, not a measured metadata-refresh latency budget. The live 026 corpus shows zero positive deltas inside the 0-10 minute band, large negative deltas that still pass as `clock_drift`, and date-only continuity values that create artificial stale readings.

## Questions Remaining

- Q1 remains open: the threshold result strengthens the case that sweep-order/provenance issues are being papered over by a coarse validator, but this pass did not yet isolate the two-batch 16-folder refresh ordering itself.
- An adjacent design question remains for Phase 019+: should freshness keep using timestamp comparison at all, or should canonical save emit an explicit shared provenance marker that makes threshold calibration mostly unnecessary?

## Next Focus

Shift to Q1 and inspect the 16-folder canonical-save sweep ordering invariants directly. The highest-value follow-up is to determine whether the stale/negative/date-only patterns above came from the H-56-1 aftermath batches, later manual continuity edits, or a broader preserve-field/write-order gap.
