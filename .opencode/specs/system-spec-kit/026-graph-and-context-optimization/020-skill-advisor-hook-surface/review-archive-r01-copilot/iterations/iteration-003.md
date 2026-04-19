# Iteration 003 — Dimension(s): D3

## Scope this iteration
Reviewed the shipped performance and observability surfaces for the advisor hook and the follow-on smart-router measurement tooling. Focused on prompt-cache behavior, metric/diagnostic schema coverage, and whether the 024 measurement scripts match their stated non-live scope.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:8-17` and `:60-129` → prompt cache is an in-memory HMAC-keyed exact-match cache with a 5-minute TTL and source-signature invalidation.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:15-30` and `:78-126` → observability contract closes runtime/status/freshness/errorCode labels under the `speckit_advisor_hook_*` namespace.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:249-302` → diagnostics serialize to prompt-free JSONL and health summaries are computed from in-memory records.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-observability.vitest.ts:15-134` → tests enforce the metric namespace, forbidden-field policy, rolling health calculations, and env-overridable thresholds.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:294-380` → operator doc frames observability as a contract over diagnostics/health summaries rather than a live exporter implementation.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:591-640` → static measurement runs `buildSkillAdvisorBrief` in-process, predicts allowed resources, and records telemetry with `actualReads: []` plus the `UNKNOWN` sentinel by design.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:654-706` → report caveats explicitly say the measurement does not observe real AI tool reads or route-following.
- `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:5-6` and `:128-157` → live wrapper is observe-only, records `Read` calls, and intentionally never blocks runtime behavior.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:247-255` → analyzer warns that static-measurement records intentionally show up as `unknown_unparsed` and must not be mixed with live-session conclusions.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

## Metrics
- newInfoRatio: 0.39 (new D3 evidence, no new shipped defect beyond the existing D1 finding)
- cumulative_p0: 0
- cumulative_p1: 1
- cumulative_p2: 0
- dimensions_advanced: [D3]
- stuck_counter: 2

## Next iteration focus
Advance D4 maintainability and code-quality alignment next by checking dead code, helper reuse, and whether the shipped TypeScript surfaces still carry avoidable duplication or unused pathways.
