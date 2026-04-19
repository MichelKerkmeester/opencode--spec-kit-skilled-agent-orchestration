# Iteration 011 — Dimension(s): D2

## Scope this iteration
Reviewed the UNKNOWN-fallback and freshness transition surfaces to verify that the deeper correctness pass does not mistake intentionally degraded measurement output for a hook-state regression.

## Evidence read
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:607-647` -> static measurement records `selectedSkill: 'UNKNOWN'`, empty `actualReads`, and an explicit methodology caveat.
- `advisor-brief-producer.vitest.ts:140-166` -> absent freshness maps to `status: 'skipped'`, unavailable maps to `status: 'degraded'`, and both suppress visible brief emission.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:182-198` -> advisor freshness/status enums stay closed to `live|stale|absent|unavailable` and `ok|skipped|degraded|fail_open`.

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
- newInfoRatio: 0.07
- cumulative_p0: 0
- cumulative_p1: 3
- cumulative_p2: 1
- dimensions_advanced: [D2]
- stuck_counter: 2

## Next iteration focus
Move to D5 and inspect the plugin bridge timeout/process lifecycle, which was only lightly exercised in the breadth-first pass.
