# Iteration 008 - Security Extension

## Scope

- Dimension: `security`
- Reviewed surfaces:
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts`
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/21-gemini-cli-hooks.md`

## Findings

### P0

- None.

### P1

- None.

### P2

- None.

## Notes

- The Claude stop hook still fails closed on autosave inputs: it requires both a tracked spec folder and session summary, resolves autosave scripts from an explicit candidate set, and downgrades autosave failures to logged warnings instead of executing arbitrary fallback paths [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:37] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:60] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:69].
- The Gemini SessionStart hook still rejects stale cached compact payloads and only clears cached recovery state after emitting formatted output, preserving the same cache-safety boundary as the Claude flow [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:55] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:58] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:211] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:214].
- The test coverage around stop-hook replay and runtime detection still exercises the ambiguity guard and producer-metadata persistence paths that would have exposed the most obvious trust-boundary regressions [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:38] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:14] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:55] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:95].
