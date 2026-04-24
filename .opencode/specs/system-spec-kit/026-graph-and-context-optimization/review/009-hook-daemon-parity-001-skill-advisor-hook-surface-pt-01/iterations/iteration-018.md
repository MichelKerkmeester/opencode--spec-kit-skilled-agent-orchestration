# Iteration 018 — Dimension(s): D4

## Scope this iteration
This iteration followed the default D4 rotation and probed the post-025 maintainability/error-handling surface around the advisor producer, freshness probe, and generation helpers. The goal was to confirm the earlier cache/JSDoc cleanup stayed closed while checking for residual sk-code-opencode alignment gaps in the newly touched production paths.

## Evidence read
- `.opencode/skill/sk-code-opencode/references/typescript/quality_standards.md:526-547` → repo TypeScript standards require `catch (error: unknown)` with narrowing instead of untyped catch-all handling.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:288-294` → `getAdvisorFreshness()` catches any probe exception and collapses it to `ADVISOR_FRESHNESS_PROBE_FAILED`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts:124-145` → generation recovery/write helpers catch all write failures and collapse them to `GENERATION_COUNTER_CORRUPT` or `GENERATION_COUNTER_UNAVAILABLE`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:430-462` → producer success paths preserve stale/policy diagnostics, but the top-level catch returns only `UNCAUGHT_EXCEPTION`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:203-230` → diagnostics contract explicitly supports sanitized `errorDetails`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:163-170` → hook diagnostics only forward `policyReason` or `staleReason` into `errorDetails`, so producer catch-all failures emit no root-cause detail.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:8-12` → prompt cache still exposes the explicit `MAX_CACHE_ENTRIES = 1000` bound.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:103-125` → cache insertions still sweep expired entries and evict overflow before storing new rows.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:163-170` → oldest-entry eviction remains explicit and bounded.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts:84-100` → regression test still proves overflow eviction at `MAX_CACHE_ENTRIES + 1`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:62-119` → `normalizeRuntimeOutput()` remains canonical and `normalizeAdapterOutput` is still an explicit `@deprecated` alias.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:93-140` → renderer public API still has focused JSDoc and retains the prompt-boundary guard behavior.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
**P1-018-01 (D4): The post-025 advisor producer stack still uses bare catch-all handlers that discard root-cause detail, so the shipped diagnostics contract cannot explain fail-open freshness/producer failures.** Evidence: the repo TypeScript standard requires `catch (error: unknown)` with narrowing (`.opencode/skill/sk-code-opencode/references/typescript/quality_standards.md:526-547`), but `getAdvisorFreshness()` collapses any probe exception to `ADVISOR_FRESHNESS_PROBE_FAILED` (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:288-294`), generation recovery/write helpers collapse all write failures to generic counter-status reasons (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts:124-145`), and `buildSkillAdvisorBrief()` converts every uncaught producer exception into `UNCAUGHT_EXCEPTION` with no accompanying detail (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:454-462`). The metrics layer explicitly supports sanitized `errorDetails` (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:203-230`), but the runtime hook emission path only forwards `policyReason` or `staleReason` into that field (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:163-170`), so these catch-all failures arrive at diagnostics with no actionable cause text. Impact: production fail-open/unavailable incidents in the remediated advisor path become materially harder to triage, which undercuts the claimed sk-code-opencode-aligned maintainability surface and slows recovery when the hook degrades. Remediation: replace the bare catches with `catch (error: unknown)`, narrow and sanitize non-prompt error messages into diagnostics, and add regression coverage asserting probe/producer exceptions preserve root-cause detail in emitted diagnostics.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P2-001 remains closed for cache bounds.** The prompt cache still enforces the explicit `MAX_CACHE_ENTRIES` ceiling with pre-insert overflow eviction, and the focused regression still proves the oldest entry is evicted when the cap is exceeded (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:8-12`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:103-125`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:163-170`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts:84-100`).
- **DR-P2-001 remains closed for the deprecated normalizer alias and renderer documentation surface.** `normalizeRuntimeOutput()` is still the canonical API with `normalizeAdapterOutput` retained as an explicit deprecated compatibility alias, and the renderer entry point still carries the focused prompt-boundary JSDoc added during the remediation sweep (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:62-119`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:93-140`).

## Metrics
- newInfoRatio: 0.04
- cumulative_p0: 0
- cumulative_p1: 4
- cumulative_p2: 3
- dimensions_advanced: [D4]
- stuck_counter: 0

## Next iteration focus
Rotate to D5 and re-check whether the plugin/runtime integration surfaces preserved disable-flag parity and teardown robustness after the Phase 025 changes.
