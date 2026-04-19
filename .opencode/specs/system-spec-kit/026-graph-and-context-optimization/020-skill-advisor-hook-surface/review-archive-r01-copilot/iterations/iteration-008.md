# Iteration 008 — Dimension(s): D1

## Scope this iteration
Ran a narrow privacy recheck against the already-identified subprocess boundary to confirm whether any additional non-persistence leak surfaces exist beyond the argv exposure recorded in iteration 001.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:231-245` → raw prompt still enters `commandArgs` directly and is only protected after process launch.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:549-599` → documented privacy contract is scoped to persisted hook surfaces and verification sources.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:77-114` → privacy suite continues to validate persisted/logged surfaces only.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

## Metrics
- newInfoRatio: 0.03 (confirmatory re-read only; no new privacy issue beyond P1-001-01)
- cumulative_p0: 0
- cumulative_p1: 3
- cumulative_p2: 1
- dimensions_advanced: [D1]
- stuck_counter: 2

## Next iteration focus
Run a final D5 parity recheck to confirm no additional integration drift beyond the plugin-threshold mismatch before stopping.
