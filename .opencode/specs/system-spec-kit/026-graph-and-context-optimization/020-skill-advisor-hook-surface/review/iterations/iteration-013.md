# Iteration 013 — Dimension(s): D6

## Scope this iteration
Reviewed D6 Test coverage + test-code quality because iteration 13 rotates back to D6. I used the current Vitest inventory to pick a fresh plugin-session-cache spot-check, then cross-checked a separate producer suite for mock-reset hygiene so this pass added new coverage evidence instead of repeating iteration 6.

## Evidence read
- inventory from `.opencode/skill/system-spec-kit/mcp_server/tests/{advisor,copilot,claude,gemini,codex,plugin,telemetry,measurement,analyzer}-*.vitest.ts` → advisor-brief-producer.vitest.ts, advisor-corpus-parity.vitest.ts, advisor-freshness.vitest.ts, advisor-observability.vitest.ts, advisor-privacy.vitest.ts, advisor-prompt-cache.vitest.ts, advisor-prompt-policy.vitest.ts, advisor-renderer.vitest.ts, advisor-runtime-parity.vitest.ts, advisor-subprocess.vitest.ts, advisor-timing.vitest.ts, claude-user-prompt-submit-hook.vitest.ts, codex-hook-policy.vitest.ts, codex-pre-tool-use.vitest.ts, codex-prompt-wrapper.vitest.ts, codex-user-prompt-submit-hook.vitest.ts, copilot-compact-cycle.vitest.ts, copilot-hook-wiring.vitest.ts, copilot-user-prompt-submit-hook.vitest.ts, gemini-user-prompt-submit-hook.vitest.ts
- .opencode/plugins/spec-kit-skill-advisor.js:63-83 → plugin cache keys are partitioned by `sessionIdFrom()` output before the prompt hash is computed.
- .opencode/plugins/spec-kit-skill-advisor.js:323-332 → `onSessionEnd()` selectively deletes entries for the supplied session prefix and only resets all runtime state for `__global__`.
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:69-76 → suite setup resets state with `onSessionEnd()` and no session payload, so only the global cleanup path is exercised in setup.
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:82-87 → the repeat-prompt cache test drives cache reuse without any session identifier on the input objects.
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:109-110 → the hit-rate trace also reuses a single implicit session, so it never compares cache partitioning across two sessions.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:58-64 → the producer suite clears the brief cache and resets both mocked dependencies before each test case, which limits mock leakage there.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
id P2-013-01, dimension D6, the OpenCode plugin suite does not test session-scoped cache isolation or targeted cache eviction even though the production cache is keyed and cleared by session. Evidence: `.opencode/plugins/spec-kit-skill-advisor.js:63-83` builds cache keys from `sessionIdFrom()` plus the prompt hash, and `.opencode/plugins/spec-kit-skill-advisor.js:323-332` only deletes cache entries matching the provided session prefix unless the special `__global__` path is used. The dedicated plugin tests never provide distinct session identifiers: setup calls `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:69-76` reset with `onSessionEnd()` and no payload, while the cache reuse checks at `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:82-87` and `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:109-110` exercise only one implicit session. Impact: a regression that leaks cached advisor briefs across sessions, or fails to evict only the ended session, could ship undetected while the current plugin suite still passes. Remediation: add plugin-level cases that submit the same prompt under two distinct session IDs, assert separate cache behavior per session, and verify `onSessionEnd({ sessionId: ... })` clears only that session's entries.

### Re-verified (no new severity)
The producer suite still appears clean on mock leakage: `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:58-64` resets the brief cache plus both mocked modules before each case, so this pass did not surface a new isolation problem there.

## Metrics
- newInfoRatio: 0.12 (late-cycle D6 pass with one fresh coverage-gap suggestion and one clean re-verification)
- cumulative_p0: 0
- cumulative_p1: 8
- cumulative_p2: 8
- dimensions_advanced: [D6]
- stuck_counter: 0

## Next iteration focus
Advance D7 Documentation accuracy by verifying the published hook/reference/setup docs against the shipped files and command paths.
