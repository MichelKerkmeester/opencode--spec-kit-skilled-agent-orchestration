# Iteration 018 — Dimension(s): D2

## Scope this iteration
Focused on freshness recovery and cache-key invalidation to verify that malformed generation state degrades safely and does not accidentally report live trust.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:276-310` -> recovered generations force `live -> stale`, while corrupt unrecoverable generation state maps to `unavailable`.
- `advisor-freshness.vitest.ts:211-238` -> recovered `generation.json` must not return live; unrecoverable corruption fails closed as `unavailable`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:313-318` -> cache keys include `workspaceRoot`, `sourceSignature`, and generation number before reuse.

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
- newInfoRatio: 0.04
- cumulative_p0: 0
- cumulative_p1: 5
- cumulative_p2: 2
- dimensions_advanced: [D2]
- stuck_counter: 2

## Next iteration focus
Return to D3 and test the token-cap and byte-accounting edges directly rather than through the higher-level docs alone.
