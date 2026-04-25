# Iteration 028 — Dimension(s): D5

## Scope this iteration
Reviewed the Codex-specific detection and input-fallback paths to make sure native-hook detection, stdin/argv precedence, and Bash-only deny policy remain intentionally scoped.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:159-209` -> detector probes `codex --version` and `codex hooks list`, returning `live|partial|unavailable` without mutating runtime state beyond its per-process cache.
- `codex-user-prompt-submit-hook.vitest.ts:84-154` -> stdin wins when both stdin and argv JSON are present; invalid stdin does not silently fall through to argv.
- `codex-pre-tool-use.vitest.ts:20-90` -> PreToolUse deny logic intentionally applies only to the Bash tool and fails open when policy loading fails.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.02
- cumulative_p0: 0
- cumulative_p1: 5
- cumulative_p2: 2
- dimensions_advanced: [D5]
- stuck_counter: 12

## Next iteration focus
Check D6’s project-run wiring and isolation boundaries so the remaining late iterations do not assume test determinism without evidence.
