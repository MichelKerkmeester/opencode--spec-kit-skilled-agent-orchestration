# Iteration 035 — Dimension(s): D5

## Scope this iteration
Reviewed the Copilot SDK activation path and version posture to make sure the integration docs still reflect the actual runtime/probe logic.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/package.json:43-55` -> `@github/copilot-sdk` remains installed as a direct dependency with range `^0.2.2`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:29-33` and `:85-106` -> adapter probes a bounded candidate list and exposes the resolved SDK availability at module load.
- `copilot-user-prompt-submit-hook.vitest.ts:66-99` -> tests cover both the installed SDK path and the fallback path when the SDK cannot be resolved.

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
- stuck_counter: 19

## Next iteration focus
Move to the last D6 slot and verify isolated-vs-project-run behavior for the observability scripts and their test locations.
