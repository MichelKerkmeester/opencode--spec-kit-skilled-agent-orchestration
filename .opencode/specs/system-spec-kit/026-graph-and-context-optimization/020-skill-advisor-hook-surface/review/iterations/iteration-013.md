# Iteration 013 — Dimension(s): D6

## Scope this iteration
This iteration followed the default rotation to D6 test coverage and quality. The pass spot-checked the Phase 025-expanded regression suites around subprocess error-code handling, telemetry path precedence, cross-runtime parity, and plugin negative paths to verify the remediation is locked in by tests rather than only by implementation.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:65-208` → The subprocess regression suite now covers strict JSON parsing, invalid shape rejection, non-busy nonzero exits, timeout kill handling, SQLITE_BUSY retry/exhaustion, and script-missing fail-open behavior.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:22-31` → The subprocess error-code surface still includes `PYTHON_MISSING` and `SPAWN_ERROR` alongside the Phase 025 cases.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:170-183` → The runtime maps child-process `error` events to `PYTHON_MISSING` for `ENOENT` and `SPAWN_ERROR` otherwise.
- `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:261-272` → Telemetry precedence coverage asserts explicit output path, env-path override, and env-dir fallback ordering.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:129-145` → `telemetryFilePath()` has a fourth branch that falls back to `repoRoot/.opencode/skill/.smart-router-telemetry/compliance.jsonl` when no overrides are set.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-242` → The parity suite compares visible brief output across Claude, Gemini, Copilot, Codex, wrapper, and plugin variants, plus one real builder-to-renderer codex path.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-236` → Plugin negative-path tests now cover the shared disable flag, timeout escalation through `SIGTERM`/`SIGKILL`, spawn errors, invalid JSON, and nonzero exit fail-open behavior.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:76-120` → The corpus parity suite still executes the 200-prompt CLI-vs-hook top-1 comparison against the pinned routing corpus.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
#### P2-013-01 (D6) Default telemetry-path fallback is still untested
Evidence: `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:129-145`, `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:261-272`.

Impact: The precedence test locks in the explicit-path, env-path, and env-dir branches, but it never exercises the final repo-root fallback branch. A future refactor to `locateRepoRoot()` or the default `.smart-router-telemetry/compliance.jsonl` location could silently break zero-config telemetry persistence without tripping the current test suite.

Remediation: Add one no-env assertion that pins `process.cwd()` to a temporary repo fixture and verifies the default fallback path.

#### P2-013-02 (D6) Subprocess spawn-error classification still lacks direct regression coverage
Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:170-183`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:83-208`.

Impact: The Phase 025 suite covers parse failures, nonzero exits, timeouts, retry exhaustion, and script absence, but it does not directly exercise the child-process `error` event branches that classify `ENOENT` as `PYTHON_MISSING` and other failures as `SPAWN_ERROR`. Those fail-open classifications could regress unnoticed.

Remediation: Add mocked child-process `error` cases for `ENOENT` and a generic spawn error to lock the remaining error-code surface.

### Re-verified (no new severity)
- **DR-P2-002 remains closed at required severity.** Phase 025 added real regression coverage for plugin negative paths, 200-prompt CLI-vs-hook corpus parity, six-variant visible-brief parity, and the core telemetry precedence branches; the residual items above are suggestion-level branch-coverage gaps rather than reopeners (`.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-236`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-242`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:76-120`, `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:261-272`).

## Metrics
- newInfoRatio: 0.04
- cumulative_p0: 0
- cumulative_p1: 1
- cumulative_p2: 3
- dimensions_advanced: [D6]
- stuck_counter: 0

## Next iteration focus
Rotate to D7 and verify the Phase 025 documentation fixes still match the shipped commands, paths, runtime status claims, and artifact names.
