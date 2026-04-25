# Iteration 023 — Dimension(s): D2

## Scope this iteration
Reviewed the D2 correctness path for advisor-envelope freshness because iteration 23 rotates to D2. This pass focused on whether cache hits preserve the shared-payload provenance contract or return logically stale envelope metadata.

## Evidence read
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:236-254 → `result()` stamps a fresh `generatedAt` and rebuilds `sharedPayload` from that timestamp for newly produced results.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:360-373 → the cache-hit branch only updates top-level `generatedAt` and metrics before returning `cached.value`.
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:203-205 → the advisor shared transport is meant to carry sanitized, typed metadata rather than ad hoc stale values.
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:856-858 → `provenance.generatedAt` is a required field on every shared-payload envelope.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:83-90 → the producer tests assert shared-payload presence for a fresh result.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:168-176 → the cache-hit test checks only brief equality and `cacheHit`, not whether cached shared-payload provenance is refreshed.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-023-01, dimension D2, cache-hit advisor results return a newly stamped top-level `generatedAt` while silently reusing the old `sharedPayload.provenance.generatedAt`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:236-254` shows the normal result path rebuilding `sharedPayload` from a fresh timestamp, but `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:360-373` skips that rebuild and returns `cached.value` unchanged except for top-level metrics and `generatedAt`. `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:856-858` makes `provenance.generatedAt` part of the required advisor-envelope contract, and `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:168-176` does not cover this cache-hit provenance mismatch. Impact: any consumer that trusts the shared-payload envelope for freshness, deduplication, or audit timing sees stale provenance even though the surrounding `AdvisorHookResult` advertises a fresh cache-hit timestamp, creating an internally inconsistent correctness contract. Remediation: on cache hits, rebuild the shared payload with the new `generatedAt` (or cache a payload-independent intermediate form), then add a regression asserting `second.sharedPayload.provenance.generatedAt !== first.sharedPayload.provenance.generatedAt` while `second.brief === first.brief`.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.08
- cumulative_p0: 0
- cumulative_p1: 14
- cumulative_p2: 12
- dimensions_advanced: [D2]
- stuck_counter: 0

## Next iteration focus
Advance D3 by checking whether cache/telemetry observability surfaces expose enough detail to detect this kind of shared-payload cache inconsistency in production.
