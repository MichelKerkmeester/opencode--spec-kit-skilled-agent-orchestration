# Iteration 006 — Dimension(s): D6

## Scope this iteration
This iteration reviewed the D6 test-coverage surfaces added or expanded in Phase 025: plugin negative paths, subprocess error-code handling, telemetry path precedence, and the end-to-end runtime parity harness. The goal was to confirm DR-P2-002 is substantively closed and to check whether any newly added fixtures or cases had already drifted stale.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-195` -> plugin negative-path coverage asserts the shared disable flag bypasses spawn and timeout handling fail-opens after both `SIGTERM` and `SIGKILL`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:214-237` -> malformed JSON and non-zero bridge exits are covered as explicit fail-open paths with distinct error codes.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:65-144` -> subprocess tests cover stdin-only prompt transport plus `JSON_PARSE_FAILED`, `INVALID_JSON_SHAPE`, `NON_ZERO_EXIT`, and `SIGNAL_KILLED`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:146-207` -> retry and exhaustion cases are exercised for `SQLITE_BUSY_EXHAUSTED`, and missing-script handling short-circuits before spawn.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-242` -> the parity suite compares visible brief output across Claude, Gemini, Copilot, Codex, Copilot wrapper, and the OpenCode plugin, and also hits the real builder-to-renderer path once.
- `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:245-272` -> telemetry tests assert explicit output path, env path, and env dir precedence in that order.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:60-89` -> extra fixtures (`unicodeInstructionalSkillLabel`, `promptPoisoningAdversarial`, skip-policy cases) are still consumed by renderer coverage rather than going stale.
- `.opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts:75-148` -> hook-level tests still consume the skip-policy fixtures and verify fail-open timeout behavior independently of renderer-only coverage.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P2-002 (D6) remains closed.** The Phase-025 suite now exercises plugin negative paths, subprocess error-code branches, telemetry path precedence, and end-to-end runtime parity with direct file-backed assertions rather than shallow smoke coverage (`.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-195`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:214-237`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:65-144`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:146-207`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-242`, `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:245-272`).
- **No fixture-staleness gap surfaced in the sampled D6 surfaces.** The additional adversarial and skip-policy fixtures present in `advisor-fixtures/` are still referenced by current renderer and hook tests instead of sitting orphaned after remediation (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:60-89`, `.opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts:75-148`).

## Metrics
- newInfoRatio: 0.09
- cumulative_p0: 0
- cumulative_p1: 0
- cumulative_p2: 0
- dimensions_advanced: [D6]
- stuck_counter: 0

## Next iteration focus
Rotate to D7 and verify that the post-remediation documentation claims, file paths, and command snippets still match the shipped hook surfaces.
