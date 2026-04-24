# Iteration 027 — Dimension(s): D6

## Scope this iteration
This iteration followed the default D6 rotation and re-checked the post-025 test surfaces that were supposed to lock the remediation in place: plugin negative paths, subprocess error-code handling, telemetry path precedence, and end-to-end runtime parity. The rationale was to verify that the claimed closures from R02 are backed by current regression coverage rather than by one-off source edits.

## Evidence read
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/deep-review-strategy.md:25,30-34,79-81` -> R03 still scopes D6 to plugin negative-paths, subprocess error-codes, telemetry path-precedence, end-to-end parity, and residual-gap checking on fresh evidence.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:235-250` -> the subprocess runner still invokes `skill_advisor.py` with `--stdin` and writes the prompt through stdin instead of argv.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:65-81,111-145,171-208` -> subprocess tests still assert prompt-free argv, stdin delivery, nonzero-exit handling, SIGKILL timeout handling, retry exhaustion, and missing-script fail-open behavior.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-225` -> plugin tests still cover shared disable-flag opt-out, timeout fail-open with SIGTERM+SIGKILL escalation, spawn errors, parse failures, and nonzero-exit handling.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:129-145,245-301` -> telemetry still resolves output-path precedence explicitly and aggregates per-prompt observations before finalizing one JSONL record.
- `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:186-272` -> telemetry tests still lock zero-read finalization, multi-read aggregation, cross-skill classification, and output/env path precedence.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-242` -> the parity suite still compares visible brief output across Claude, Gemini, Copilot, Codex, Copilot-wrapper, and the OpenCode plugin, plus one real builder-to-renderer path.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-001 remains closed for prompt-safe subprocess invocation.** The runner still builds argv with `--stdin` only and streams the prompt through stdin, while the focused test still asserts the prompt is absent from argv and present on stdin (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:235-250`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:65-81`).
- **DR-P2-002 remains closed for subprocess and plugin negative paths.** Current tests still cover subprocess nonzero-exit/timeout/retry-exhaustion/missing-script cases and plugin disable/timeout/spawn-error/parse-failure/nonzero-exit cases, so the fail-open/error-code remediation remains regression-guarded (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:111-145,171-208`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-225`).
- **DR-P2-002 remains closed for telemetry path precedence and prompt aggregation.** The telemetry module still prioritizes explicit output path over env path over env dir over default, and the tests still verify finalized single-record aggregation plus that precedence ladder (`.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:129-145,245-301`, `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:186-272`).
- **DR-P2-002 remains closed for end-to-end parity coverage.** The parity harness still includes the plugin alongside the four runtime hooks and Copilot wrapper, and it still exercises one real builder-to-renderer path on Codex output instead of mocking the entire flow (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-242`).

## Metrics
- newInfoRatio: 0.02
- cumulative_p0: 0
- cumulative_p1: 7
- cumulative_p2: 3
- dimensions_advanced: [D6]
- stuck_counter: 0

## Next iteration focus
Rotate to D7 and verify that the current docs still point to valid commands, artifact names, and runtime-status expectations after Phase 025.
