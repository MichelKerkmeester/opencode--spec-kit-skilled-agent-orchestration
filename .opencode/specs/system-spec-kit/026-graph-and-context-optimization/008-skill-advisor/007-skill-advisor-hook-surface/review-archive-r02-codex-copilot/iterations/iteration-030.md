# Iteration 030 — Dimension(s): D2

## Scope this iteration
Reviewed the late-cycle D2 correctness surface around freshness derivation and runtime parity, because iteration 29 handed off to D2 and the remaining open questions were whether newer coverage closes previously logged ambiguity and shared-payload timestamp gaps. This pass focused on fresh producer, freshness, and parity evidence rather than re-reading the already-reviewed hook transport code alone.

## Evidence read
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:273-295 → absent freshness still maps to `skipped`/null brief, while unavailable freshness maps to `degraded`/null brief with `ADVISOR_FRESHNESS_UNAVAILABLE`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:335-349 → `buildSkillAdvisorBrief()` still short-circuits non-live freshness before subprocess execution and carries forward freshness diagnostics.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:360-373 → cache hits still return `cached.value` with refreshed top-level metrics and `generatedAt`, but without rebuilding the cached envelope.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:214-254 → freshness derivation still distinguishes `live`, `stale`, and `absent` strictly from artifact presence/mtime.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:288-318 → freshness probe caching is keyed by workspace root, source signature, and generation, and recovered/unavailable generations bypass the TTL cache.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:113-166 → producer tests cover stale, absent, and unavailable freshness behavior, but do not assert envelope regeneration on cache-hit reuse.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:168-176 → the cache-hit regression still asserts only brief equality plus `metrics.cacheHit`.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:26-32,78-111,119-135 → runtime parity still compares only canonical fixture outputs rendered through `renderAdvisorBrief`, with no ambiguous fixture in the parity set.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:111-137 → the ambiguity branch still requires an explicit token cap above the default and a close top-two recommendation pair.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **P1-023-01 (D2)** remains open: the cache-hit branch still reuses the cached shared-payload envelope instead of rebuilding it (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:360-373`), `provenance.generatedAt` is still required on the envelope contract (`.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:856-858`), and the current cache-hit regression still stops at `brief` equality plus `cacheHit` (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:168-176`).
- **P1-002-01 (D2)** remains open: runtime parity still drives only the canonical non-ambiguous fixtures through `renderAdvisorBrief` (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:26-32,78-111,119-135`), while the renderer still requires `tokenCap > DEFAULT_TOKEN_CAP` plus a close second recommendation to emit the ambiguity path (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:111-137`).

## Metrics
- newInfoRatio: 0.03
- cumulative_p0: 0
- cumulative_p1: 16
- cumulative_p2: 15
- dimensions_advanced: [D2]
- stuck_counter: 1

## Next iteration focus
Advance D3 by checking whether telemetry and measurement surfaces can detect the still-open cache/provenance and ambiguity-contract gaps in live observability.
