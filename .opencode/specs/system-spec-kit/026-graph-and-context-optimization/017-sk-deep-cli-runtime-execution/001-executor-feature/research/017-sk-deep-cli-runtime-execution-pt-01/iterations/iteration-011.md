# Focus

Q10: continuity-freshness threshold calibration. Inspect whether the current 10-minute `_memory.continuity.last_updated_at` versus `graph-metadata.derived.last_save_at` threshold reflects real refresh latency or remains an unvalidated guess.

# Actions Taken

1. Inspected the shipped validator implementation and its threshold logic in `.opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts`.
2. Inspected the shipped vitest coverage in `.opencode/skill/system-spec-kit/scripts/tests/continuity-freshness.vitest.ts` to see whether the threshold is derived from observed save behavior or only from synthetic boundaries.
3. Reviewed the introducing commit `32a180bbaea85c16025b1f3e60dbe515578105d6` plus the Phase 017 plan text to locate any calibration rationale.
4. Sampled current checked-in `implementation-summary.md` continuity timestamps versus `graph-metadata.json.derived.last_save_at` across `026-graph-and-context-optimization/`, then widened the sample to all checked-in `system-spec-kit` spec folders.

# Findings

- P1: The 10-minute budget is a hardcoded policy constant, not an observed-latency-derived threshold. The validator defines `CONTINUITY_STALENESS_THRESHOLD_MS = 10 * 60 * 1000` with no adjacent calibration hook or telemetry source, then warns only when `graphMs - continuityMs > threshold` (`.opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts:13`, `.opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts:233`).

- P1: The shipped tests prove only synthetic boundary behavior, not real refresh latency. Coverage uses a `12:09:59Z` pass fixture and a `12:10:01Z` warn fixture, which validates the rule edge but does not justify why 10 minutes is the correct edge for real saves (`.opencode/skill/system-spec-kit/scripts/tests/continuity-freshness.vitest.ts:91`, `.opencode/skill/system-spec-kit/scripts/tests/continuity-freshness.vitest.ts:103`).

- P1: The contract is intentionally one-sided and therefore cannot validate symmetric freshness drift. Negative deltas are explicitly treated as benign `clock_drift`, so the rule only guards "continuity older than graph" and does not assert that the two timestamps were refreshed in the same save window (`.opencode/skill/system-spec-kit/scripts/validation/continuity-freshness.ts:251`, `.opencode/skill/system-spec-kit/scripts/tests/continuity-freshness.vitest.ts:151`). This matters because Phase 017 packet language often normalizes the threshold as a general freshness invariant rather than as a one-sided stale-after-save warning (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime/plan.md:229`).

- P1: Checked-in repository state does not show a positive-delta cluster anywhere near the 10-minute boundary. A repo-wide sample of 75 spec folders with both timestamps produced `neg=10`, `zeroTo600=0`, `sec601To3600=0`, `over3600=65`; the smallest positive delta found was `24327` seconds (about 6.8 hours) at `026/014-memory-save-rewrite`. That means the checked-in data supports only two regimes: very stale folders and negative-delta folders. It does not provide evidence that real canonical-save refresh latency naturally lands in the 0-10 minute band.

- P2: The live `026` sibling sample reinforces that conclusion and exposes format noise that the current rule tolerates. Examples from the current tree:
  `001` through `006` each lag by `496925` seconds,
  `014` lags by `24327` seconds,
  `013`, `016`, `017`, `018`, and `019` are negative-delta cases,
  `012` uses a date-only continuity value (`2026-04-15`) that parses as midnight and therefore appears `63000` seconds stale.
  This is consistent with a coarse sentinel budget, not a measured refresh-SLA.

- P2: The introduction trail contains no checked-in calibration evidence. Commit `32a180bbaea85c16025b1f3e60dbe515578105d6` adds only the validator and its boundary tests, while the Phase 017 plan states "Warn if `last_updated_at` older than `graph-metadata.json.derived.last_save_at` by more than 10m" without linking the choice to timing studies, telemetry, or a save-path benchmark (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime/plan.md:229`).

- P1 remediation candidate: Treat the current 10-minute value as an interim policy budget and add calibration evidence before Phase 019+ hardens it further. Low-risk options are:
  instrument canonical save to emit paired continuity/graph timestamps into a small audit log,
  collect an empirical delta distribution over real saves,
  then either tighten the threshold to the observed p95 or replace the static budget with a same-pass provenance marker (for example `derived.last_description_sync_at` or a continuity-write helper that runs in the canonical save path).

# Questions Answered

- Q10 answered: the 10-minute threshold currently looks policy-driven, not latency-calibrated. It is encoded as a static validator budget, tested only with synthetic 9:59 and 10:01 fixtures, and not backed by checked-in latency evidence from real refreshes.

# Questions Remaining

- Q1 remains open in full: the threshold finding strengthens the suspicion that sweep-order drift and calibration drift were conflated, but it does not yet prove whether the two-batch 16-folder refresh introduced ordering inconsistencies beyond the already-observed stale distributions.
- A follow-on design question remains for Phase 019+: should freshness stay one-sided and advisory, or should the system move to a same-save provenance contract that makes threshold tuning unnecessary?

# Next Focus

Return to Q1 and inspect the two-batch 16-folder canonical-save sweep ordering invariants directly. Focus on whether the refresh procedure itself introduced durable ordering asymmetry, date-format skew, or provenance gaps that the current 10-minute validator can only mask rather than diagnose.
