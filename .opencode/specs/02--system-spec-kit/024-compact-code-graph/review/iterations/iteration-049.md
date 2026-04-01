# Review Iteration 049
## Dimension: D1 Correctness
## Focus: Phase 023 metrics — context-metrics.ts quality scoring logic, edge cases

## Findings

### [P2] F064 - computeRecency returns 0.0 for sessions that never made a tool call, but primed=true can still be set
- File: .opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:128-135
- Evidence: If `lastToolCallAt === null`, computeRecency returns 0. But in context-server.ts, the first tool call sets `lastToolCallAt` AND sets `primed = true` via `recordMetricEvent({ kind: 'tool_call' })`. So these are always synchronized — if primed is true, lastToolCallAt is set. However, there's a potential race: if `computeQualityScore()` is called between the priming check in memory-surface.ts (which sets `sessionPrimed = true`) and the first `recordMetricEvent` in context-server.ts, the score would show primed=true but recency=0.0. This is a minor timing edge case.
- Fix: Accept as-is — the race window is negligible in practice (both calls happen in the same tool dispatch cycle).

### [P2] F065 - Quality score weights don't sum to 1.0 (they sum to exactly 1.0, but the naming suggests otherwise)
- File: .opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:172-177
- Evidence: The weights are: recency (0.35) + recovery (0.20) + graphFreshness (0.20) + continuity (0.25) = 1.00. This is correct. However, the comment says "Weighted average" but doesn't document why these specific weights were chosen. The choice of graphFreshness at 0.20 means graph staleness has equal impact as memory recovery, which may not match user expectations (graph staleness is less critical than lost memory context).
- Fix: Add a brief rationale comment explaining weight choices. Consider whether graphFreshness weight should be lower (0.10) since auto-trigger (Phase 019) now keeps the graph fresh automatically.

### [P2] F066 - computeGraphFreshness uses 24-hour threshold which conflicts with auto-trigger's real-time freshness
- File: .opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:148-149
- Evidence: `computeGraphFreshness()` returns 1.0 if last scan is within 24 hours, 0.5 otherwise. But Phase 019's auto-trigger ensures the graph is always fresh before queries. This means `graphFreshness` will almost always be 1.0 when the auto-trigger is working, making this factor uninformative. The 24-hour threshold is too generous — it was probably set before auto-trigger existed.
- Fix: Tighten the threshold to match auto-trigger expectations (e.g., 1 hour for 1.0, 24 hours for 0.5, >24h for 0.0). Or remove graphFreshness from quality scoring since auto-trigger handles it.

## Verified Correct
- sessionId generation uses Date.now() base-36 + random suffix — unique enough for single-process MCP server
- recordMetricEvent correctly handles all 4 event kinds with appropriate state updates
- computeRecency: linear decay between 5 min and 60 min is reasonable for session health
- computeRecovery: binary (1.0 if any recovery, 0.0 otherwise) is a sensible first approximation
- computeContinuity: 3-tier step function (0-1 transitions: 1.0, 2-3: 0.5, >3: 0.0) matches intent
- Quality level thresholds: healthy (>0.7), degraded (0.4-0.7), critical (<0.4) are well-calibrated
- Score rounding: `Math.round(score * 1000) / 1000` provides 3 decimal precision — appropriate
- getSessionMetrics returns a clean snapshot with all relevant fields
- spec_folder_change tracking correctly avoids counting same-folder non-transitions

## Iteration Summary
- New findings: 3 (P2)
- Items verified correct: 9
- Reviewer: Claude Opus 4.6 (1M context)
