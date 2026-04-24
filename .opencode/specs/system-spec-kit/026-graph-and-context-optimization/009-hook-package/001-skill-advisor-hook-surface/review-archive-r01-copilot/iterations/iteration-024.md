# Iteration 024 — Dimension(s): D1

## Scope this iteration
Inspected the session/lifecycle side of prompt privacy: process-local prompt-cache secret derivation and per-session plugin cache cleanup.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:33-36` -> prompt-cache HMAC secret is process-local, not persisted, and rotates on process start.
- `.opencode/plugins/spec-kit-skill-advisor.js:63-83` -> plugin cache keys are session-scoped via `sessionIdFrom()` plus a hashed prompt/options key.
- `.opencode/plugins/spec-kit-skill-advisor.js:323-332` -> `onSessionEnd()` clears all cache keys prefixed by the ending session ID and fully resets global state for `__global__`.

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
- newInfoRatio: 0.03
- cumulative_p0: 0
- cumulative_p1: 5
- cumulative_p2: 2
- dimensions_advanced: [D1]
- stuck_counter: 8

## Next iteration focus
Return to D2 and inspect source-cache reuse/invalidation behavior under signature changes rather than generation corruption alone.
