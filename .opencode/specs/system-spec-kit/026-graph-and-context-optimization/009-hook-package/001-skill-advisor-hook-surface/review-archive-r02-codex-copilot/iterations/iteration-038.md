# Iteration 038 — Dimension(s): D3

## Scope this iteration
Reviewed the late-cycle D3 observability surface because iteration 38 rotates back to performance and telemetry after iteration 37's correctness pass. This pass focused on whether the live wrapper and predicted-route model agree about baseline skill resources, rather than rehashing the earlier prompt/session accounting issues.

## Evidence read
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/deep-review-state.jsonl:39 → iteration 37 ended at cumulative P0=0, P1=18, P2=17 with `stuck=3`.
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/iterations/iteration-037.md:43 → prior iteration explicitly handed off to a D3 observability check.
- .opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:3-12 → the wrapper records `.opencode/skill/*` reads and uses the resulting JSONL for overload and under-load conclusions.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:76-95 → `normalizeReadPath()` accepts any path under `.opencode/skill/<skill>/...` and records the trailing path segment as the observed resource, so `SKILL.md` is a valid live-session read.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:146-154 → each observed read is emitted as `actualReads: [read.resource]` against the selected skill's predicted allow-list.
- .opencode/skill/system-spec-kit/SKILL.md:115-118 → the smart-router contract says `SKILL.md` is part of the ALWAYS-loaded baseline for every skill invocation.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:206-217,249-259 → predicted resources are normalized only when they live under `references/` or `assets/`, so `SKILL.md` is excluded from extracted allow-lists.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:495-519 → `allowedResources` are built only from extracted always/conditional/on-demand resources, while byte accounting still treats `SKILL.md` separately.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:171-179 → any observed read that is absent from `allowedByPath` is classified as `extra`.
- .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:77-87 → tests lock the current classifier behavior that unexpected reads become `extra`.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-038-01, dimension D3, live-session telemetry can over-report overload for compliant skill sessions because `SKILL.md` reads are observable but impossible to classify as allowed. Evidence: the wrapper records any `.opencode/skill/<skill>/...` read as a telemetry resource at `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:76-95` and emits that raw resource in `actualReads` at `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:146-154`; the smart-router contract simultaneously says `SKILL.md` belongs to the ALWAYS baseline at `.opencode/skill/system-spec-kit/SKILL.md:115-118`. But the predicted allow-list extractor rejects anything outside `references/` or `assets/` at `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:206-217` and `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:249-259`, so `predictSmartRouterRoute()` builds `allowedResources` without any `SKILL.md` entry at `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:495-519`. The classifier then marks any such unmatched read as `extra` at `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:171-179`, and tests lock that branch at `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:77-87`. Impact: a runtime that observes baseline `SKILL.md` loads can inflate overload rate and mislabel otherwise compliant sessions as `extra`, undermining the live-session compliance telemetry used to validate smart-router behavior. Remediation: either explicitly include `SKILL.md` in the predicted ALWAYS allow-list (and route accounting), or suppress baseline `SKILL.md` reads from wrapper telemetry and document that exclusion; then add a regression that proves a session reading only `SKILL.md` plus allowed routed resources does not count as overload.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.05
- cumulative_p0: 0
- cumulative_p1: 19
- cumulative_p2: 17
- dimensions_advanced: [D3]
- stuck_counter: 0

## Next iteration focus
Advance D4 by checking whether the late-cycle advisor and observability modules still miss sk-code-opencode maintainability contracts around exported API documentation and dead/internal paths.
