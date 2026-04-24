# Iteration 016 — Dimension(s): D2

## Scope this iteration
Reviewed D2 Correctness because iteration 16 rotates back to D2. This pass focused on fresh envelope-contract and freshness-mapping evidence so the late-loop correctness check covered typed metadata, non-live status transitions, and current hook-test behavior rather than rehashing the earlier renderer/cache findings.

## Evidence read
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:182-217 → advisor envelopes still constrain freshness/status to typed enums and only allow numeric trust fields plus a sanitized single-line `skillLabel`.
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:506-537 → `validateAdvisorEnvelopeMetadata` still rejects unknown or missing keys before coercing freshness/confidence/uncertainty/skillLabel/status.
- .opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:43-54 → shared-payload tests still round-trip a valid advisor envelope and preserve typed metadata values.
- .opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:71-137 → tests still reject unknown metadata keys, prompt-derived provenance refs, multiline skill labels, and out-of-range confidence values.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:214-254 → freshness derivation still maps missing sources to `absent`, JSON fallback to `stale`, source-newer-than-sqlite to `stale`, and only fully fresh sqlite state to `live`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:257-280 → probe failure and recovered generation counters still degrade to `unavailable`/non-live rather than silently reporting `live`.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-freshness.vitest.ts:98-177 → freshness tests still cover the live, stale, absent, unavailable, and JSON-fallback branches explicitly.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-freshness.vitest.ts:211-237 → malformed generation recovery still degrades the result instead of returning `live`, and unrecoverable corruption still fails closed as `unavailable`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:268-297 → `nonLiveResult` still maps `absent` to `skipped` and `unavailable` to `degraded`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:378-429 → subprocess failure still returns `fail_open`, while successful stale/live runs still build the brief/shared payload and cache only cacheable `ok` results.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:93-166 → producer tests still cover timeout fail-open, stale JSON fallback, absent skip, and unavailable-to-degraded transitions.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:168-221 → cache coverage still exercises only an identical second call, while the hard-cap test stays isolated to a single explicit-`maxTokens` invocation.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- P1-009-01 remains valid: fresh producer-test evidence still does not exercise a same-prompt cache hit across differing token-cap requests, so the previously logged cache-key omission around `maxTokens` is neither contradicted nor closed by current coverage. Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:168-221; .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:352-359,423-429.

## Metrics
- newInfoRatio: 0.06 (fresh D2 evidence on envelope validation and freshness mapping, but no new severity beyond already logged correctness findings)
- cumulative_p0: 0
- cumulative_p1: 9
- cumulative_p2: 8
- dimensions_advanced: [D2]
- stuck_counter: 2

## Next iteration focus
Return to D3 Performance + Observability and probe fresh cache/telemetry evidence for any remaining metric or latency mismatches.
