# Iteration 019 — Add A Lightweight Timing Guard To Long Loops

Date: 2026-04-10

## Research question
Does Babysitter surface a small but important resilience feature that `system-spec-kit` currently lacks in unattended loops?

## Hypothesis
Babysitter's session timing helpers will reveal a useful low-cost safeguard against runaway or degenerate loop behavior.

## Method
I reviewed Babysitter's session-state timing helpers and compared them with the current deep-research loop controls in `system-spec-kit`.

## Evidence
- Babysitter stores per-session iteration timing metadata and exposes `updateIterationTimes()` plus `isIterationTooFast()` to detect suspiciously fast repeated iterations. [SOURCE: external/packages/sdk/src/session/write.ts:153-189]
- Its default session state also includes iteration counters and timestamps as first-class continuity fields. [SOURCE: external/packages/sdk/src/session/parse.ts:13-21] [SOURCE: external/packages/sdk/src/session/parse.ts:97-105]
- `system-spec-kit` deep research tracks `maxIterations`, `stuckThreshold`, `maxDurationMinutes`, and `stuck_count`, but its stop logic is driven by information ratios and question coverage, not by observed timing anomalies. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:157-169] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:371-380]

## Analysis
This is a smaller signal than the architectural findings, but it is still valuable. Babysitter recognizes a concrete failure mode: a loop can technically "progress" while actually spinning too fast to be meaningful. `system-spec-kit`'s convergence logic is sophisticated, yet it does not currently appear to look at wall-clock iteration cadence. [SOURCE: external/packages/sdk/src/session/write.ts:178-189] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277]

Adding a lightweight timing guard would not replace convergence detection. It would complement it, especially for unattended or partially broken loops where repeated shallow iterations could otherwise consume the full iteration budget before someone notices. [SOURCE: external/packages/sdk/src/session/parse.ts:13-21] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:157-169]

## Conclusion
confidence: medium

finding: `system-spec-kit` should add a simple iteration-cadence safeguard to long-running autonomous workflows. Babysitter's session timing utilities show that this protection can be lightweight and operationally useful without becoming another heavy subsystem.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/skill/sk-deep-research/`
- **Change type:** added option
- **Blast radius:** small
- **Prerequisites:** decide the threshold semantics and whether the guard halts, warns, or forces recovery mode
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for an existing time-based runaway detector in the deep-research command and found duration limits plus convergence/stuck logic, but not a guard based on recent iteration cadence. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:157-169] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277]

## Follow-up questions for next iteration
- Would importing Babysitter's compression stack solve a primary Spec Kit bottleneck, or just add another subsystem?
- If compression is useful at all, should it live in Spec Kit or at the harness layer?
- Which of the Phase 2 findings should rise to the top of the merged priority queue?
