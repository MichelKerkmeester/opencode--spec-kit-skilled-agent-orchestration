# Deep Review Iteration 001 - Correctness

## Focus

Dimension: correctness.

Files reviewed: `spec.md`, `implementation-summary.md`, `smart-router-measurement.ts`, `smart-router-analyze.ts`, `live-session-wrapper.ts`, `smart-router-measurement-report.md`.

## Findings

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| F003 | P2 | Static parser leaves a large unknown/zero-resource slice, limiting savings conclusions. The report shows 68 prompts with 0 allowed resources and an `UNKNOWN` bucket of 37 prompts, so savings summaries should be interpreted as partial parser coverage rather than full corpus route coverage. | `smart-router-measurement-report.md:23`, `smart-router-measurement-report.md:25`, `smart-router-measurement-report.md:30`, `smart-router-measurement-report.md:32`, `smart-router-measurement-report.md:38` |
| F006 | P2 | Live wrapper only observes exact `Read` tool names, so runtime aliases can silently evade telemetry. The wrapper exits unless `toolNameFor(tool) === 'Read'`, while the setup doc asks runtime wrappers to forward tool calls generically. | `live-session-wrapper.ts:156`, `live-session-wrapper.ts:158`, `LIVE_SESSION_WRAPPER_SETUP.md:48`, `LIVE_SESSION_WRAPPER_SETUP.md:52` |

## Adversarial Self-Check

No P0 findings were raised. Correctness issues are advisory because they affect interpretation and telemetry completeness, not shipped runtime mutation behavior.

## Delta

New findings: P0=0, P1=0, P2=2. Severity-weighted new findings ratio: 0.18.
