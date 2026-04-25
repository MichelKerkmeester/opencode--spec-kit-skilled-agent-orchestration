# Iteration 024 — Dimension(s): D3

## Scope this iteration
Reviewed the D3 live-session telemetry path because iteration 24 rotates back to Performance + Observability. This pass focused on whether the wrapper and analyzer measure whole prompt sessions or accidentally score individual `Read` calls as if they were complete sessions.

## Evidence read
- .opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:48-64 → the runtime contract says `configureSmartRouterSession()` runs once per user prompt, then `onToolCall()` is invoked for subsequent `Read` calls.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:128-154 → every observed `Read` immediately calls `recordSmartRouterCompliance()` with `actualReads: [read.resource]`.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:199-213 → `recordSmartRouterCompliance()` classifies the supplied read set immediately and appends one JSONL row per call.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:128-146 → analyzer totals, overload rate, and underload rate are computed over raw record counts grouped by `selectedSkill`, not by distinct `promptId`.
- .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts:45-69 → analyzer tests lock the current rate math against per-record counts only.
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/iterations/iteration-010.md:33-34 → prior D3 coverage already established the separate zero-read blind spot, so this iteration targeted nonzero multi-read session accounting instead.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-024-01, dimension D3, live-session compliance rates are computed per observed `Read` row instead of per prompt session. Evidence: the setup contract defines the wrapper lifecycle as one `configureSmartRouterSession()` call per user prompt followed by `onToolCall()` for each `Read` at `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:48-64`, and the implementation records a fresh compliance event on every `Read` with only that single resource in `actualReads` at `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:128-154`. `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:199-213` then classifies and persists each row immediately, while `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:128-146` computes totals, overload rate, and underload rate from raw record counts grouped by `selectedSkill` rather than collapsing rows by `promptId`. The analyzer test at `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts:45-69` locks that per-record interpretation and does not cover multiple rows from the same prompt. Impact: a single prompt that reads multiple predicted resources contributes multiple compliance records, so intermediate partial rows can inflate overload/underload percentages and the reported live-session compliance rates do not actually represent session-level behavior. Remediation: accumulate reads by `promptId` and emit one finalized record per prompt (or have the analyzer collapse rows by `promptId` before scoring), then add a regression covering a multi-read prompt that should count as one compliant session.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.07
- cumulative_p0: 0
- cumulative_p1: 15
- cumulative_p2: 12
- dimensions_advanced: [D3]
- stuck_counter: 0

## Next iteration focus
Advance D4 by checking whether the remaining skill-advisor modules still carry maintainability or TS-discipline issues that escaped the earlier audit passes.
