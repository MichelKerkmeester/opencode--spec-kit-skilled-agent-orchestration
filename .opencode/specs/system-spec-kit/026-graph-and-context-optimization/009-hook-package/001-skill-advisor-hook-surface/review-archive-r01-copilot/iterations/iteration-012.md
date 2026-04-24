# Iteration 012 — Dimension(s): D5

## Scope this iteration
Focused on the OpenCode plugin bridge lifecycle under timeout pressure. The deeper question was whether a timed-out bridge is fully reaped or whether the host resolves fail-open before the child process has actually exited.

## Evidence read
- `.opencode/plugins/spec-kit-skill-advisor.js:171-186` -> timeout path sets `settled = true`, sends `child.kill('SIGTERM')`, and resolves `fail_open` immediately.
- `.opencode/plugins/spec-kit-skill-advisor.js:212-230` -> the `close` handler exits early when `settled` is already true, so the timeout path never waits for confirmed child termination.
- `spec-kit-skill-advisor-plugin.vitest.ts:161-177` -> timeout coverage asserts only the single `SIGTERM` send and the null-context response.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
[P1-012-01] [D5] Plugin bridge timeout resolves before child exit and never escalates past SIGTERM
- **Evidence**: `.opencode/plugins/spec-kit-skill-advisor.js:171-186`; `.opencode/plugins/spec-kit-skill-advisor.js:212-230`; `spec-kit-skill-advisor-plugin.vitest.ts:161-177`
- **Impact**: A hung or SIGTERM-ignoring bridge can outlive the failed request. Repeated timeout bursts can leave lingering bridge subprocesses behind, causing avoidable resource churn and transport-specific instability in the plugin path.
- **Remediation**: On timeout, send SIGTERM, wait for `close` with a short grace window, escalate to SIGKILL if the child does not exit, and only resolve once termination is confirmed. Add a regression test for the non-exiting-child path.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.24
- cumulative_p0: 0
- cumulative_p1: 4
- cumulative_p2: 1
- dimensions_advanced: [D5]
- stuck_counter: 0

## Next iteration focus
Stay near the plugin path and audit whether its negative-path test coverage actually reaches the bridge parser and nonzero-exit branches.
