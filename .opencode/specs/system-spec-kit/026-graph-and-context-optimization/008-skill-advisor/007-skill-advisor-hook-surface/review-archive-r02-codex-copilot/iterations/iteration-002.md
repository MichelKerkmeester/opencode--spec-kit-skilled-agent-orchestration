# Iteration 002 — Dimension(s): D2

## Scope this iteration
Reviewed D2 Correctness because the default rotation for iteration 2 selects D2. I focused on the advisor envelope contract, freshness semantics, fail-open behavior, cross-runtime rendering parity, and the UNKNOWN/ambiguity fallback path.

## Evidence read
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:182 → advisor envelope freshness is constrained to `live`, `stale`, `absent`, or `unavailable`.
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:191 → advisor status is constrained to `ok`, `skipped`, `degraded`, or `fail_open`.
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:506 → `validateAdvisorEnvelopeMetadata` rejects non-object metadata and enforces the typed advisor metadata boundary.
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:522 → advisor metadata must include all allowed keys, preventing partial envelope metadata from being accepted silently.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:214 → freshness derivation maps missing advisor sources to `absent`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:225 → JSON fallback without SQLite is treated as `stale`, not `live`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:244 → source files newer than `skill-graph.sqlite` are treated as stale.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:273 → absent freshness returns `skipped` with no brief.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:283 → unavailable freshness returns `degraded` with no brief and an advisor freshness error code.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:382 → subprocess failures return `fail_open` and null brief.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:400 → passing recommendations are filtered before rendering.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:401 → producer raises `tokenCap` to 120 when `hasAmbiguitySignal(recommendations)` is true.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:111 → runtime renderer defaults to an 80-token cap when no render option is passed.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:123 → ambiguous top-two output is emitted only when `tokenCap > DEFAULT_TOKEN_CAP`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:162 → Claude hook calls `renderAdvisorBrief(result)` with no token-cap option.
- .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:176 → Gemini hook calls `renderAdvisorBrief(result)` with no token-cap option.
- .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:202 → Copilot hook calls `renderAdvisorBrief(result)` with no token-cap option.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:259 → Codex hook calls `renderAdvisorBrief(result)` with no token-cap option.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:41 → renderer coverage proves ambiguity appears only when callers explicitly pass `{ tokenCap: 120 }`.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:93 → producer coverage verifies fail-open timeout behavior.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:113 → producer coverage verifies JSON fallback freshness is stale and still returns ok output.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:140 → producer coverage verifies absent freshness skips without invoking the subprocess.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-002-01, dimension D2, ambiguous top-two advisor results are never rendered through the shipped runtime hooks. Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:401 raises `tokenCap` to 120 when `hasAmbiguitySignal(recommendations)` is true, while .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:123 only emits the ambiguous form when `tokenCap > DEFAULT_TOKEN_CAP`; however the runtime hooks call `renderAdvisorBrief(result)` without that token cap at .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:162, .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:176, .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:202, and .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:259. Impact: close top-two recommendations are surfaced as a single confident skill choice in every runtime, so the model does not see the intended ambiguity/UNKNOWN-style fallback signal. Remediation: make one renderer authoritative by either passing `{ tokenCap: result.metrics.tokenCap }` from all hooks or reusing the producer-rendered brief, then add a cross-runtime ambiguous fixture test that expects the `ambiguous:` brief.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.68 (first D2 pass read fresh correctness evidence and found one cross-runtime ambiguity bug)
- cumulative_p0: 0
- cumulative_p1: 2
- cumulative_p2: 0
- dimensions_advanced: [D2]
- stuck_counter: 0

## Next iteration focus
Advance D3 Performance + Observability with fresh evidence around advisor cache metrics, telemetry naming, measurement scripts, and live-session-wrapper behavior.
