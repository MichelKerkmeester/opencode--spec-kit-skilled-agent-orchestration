# Iteration 017 — Dimension(s): D3

## Scope this iteration
This iteration followed the default D3 rotation and re-checked the Phase 025 observability fixes around static-vs-live telemetry separation, per-prompt aggregation, and live-session wrapper finalization. The focus was confirming DR-P1-003 stayed closed while probing whether the shipped runtime setup can actually exercise the repaired telemetry path.

## Evidence read
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:104-107` → static compliance now defaults to `.opencode/reports/smart-router-static/compliance.jsonl`, separating corpus runs from live telemetry.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:629-640` → measurement writes `unknown_unparsed` static compliance records to the separated static stream unless `liveStream` is enabled.
- `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:118-149` → wrapper configuration seeds one prompt-scoped state entry and starts per-prompt telemetry collection.
- `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:156-197` → `onToolCall()` records observations, and only `finalizePrompt()` flushes the aggregated prompt record through `finalizeSmartRouterCompliancePrompt()`.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:245-251` → persistence happens only in `recordSmartRouterCompliance()`, which appends JSONL immediately.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:254-300` → prompt observations stay in `activePromptInputs` until `finalizeSmartRouterCompliancePrompt()` is called.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:123-162` → analyzer now collapses rows by `promptId`, preserves `observedSkill(s)`, and treats baseline-only `SKILL.md` reads as compliant.
- `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:48-64` → the primary setup example configures a prompt and forwards `onToolCall('Read', ...)`, but does not show any finalization call.
- `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:68-124` → all four runtime-specific examples forward bare tool callbacks into `onToolCall()` and likewise omit `finalizeSmartRouterPrompt(promptId)`.
- `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:649-653` → product docs claim the wrapper writes one aggregate compliance record per prompt on finalization and that the setup guide documents the runtime integration.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/003-hook-parity-remediation/implementation-summary.md:45-49` → Phase 025 closure log marks DR-P1-003 closed based on the measurement split, wrapper finalization, prompt aggregation, and updated tests.
- `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts:149-166` → regression test locks the separated static stream path.
- `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:186-243` → regression tests lock zero-read finalization and multi-read prompt aggregation.
- `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts:75-103` → regression tests lock prompt-level collapse and baseline `SKILL.md` handling in the analyzer.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
**P1-017-01 (D3): The shipped live-session wrapper setup never calls the required per-prompt finalizer, so the Phase 025 prompt-aggregation fix is not operationally reachable from the documented runtime contract.** Evidence: the wrapper only writes a compliance JSONL row when `finalizePrompt()` delegates to `finalizeSmartRouterCompliancePrompt()` (`.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:190-197`) and the telemetry layer only persists records through `recordSmartRouterCompliance()` / `appendJsonl()` after that finalization step (`.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:245-251`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:254-300`). But the published setup guide shows only `configureSmartRouterSession()` plus `onToolCall()` in the generic example and in every Claude/Codex/Gemini/Copilot snippet, with no `finalizeSmartRouterPrompt(promptId)` call at all (`.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:48-64`, `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:68-124`). Impact: operators following the shipped integration guide will not flush one aggregate record per prompt, so zero-read prompts disappear entirely and multi-read prompts can remain stranded in in-memory state instead of reaching the analyzer/reporting path that Phase 025 claims to have fixed (`.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:649-653`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/003-hook-parity-remediation/implementation-summary.md:45-49`). Remediation: update the runtime setup contract to require exactly one `finalizeSmartRouterPrompt(promptId)` call when a prompt completes, and add an end-to-end integration/regression that follows the documented setup flow and proves a prompt produces a persisted compliance row.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-003 remains closed for static-vs-live telemetry separation.** Static corpus measurement still writes to `.opencode/reports/smart-router-static/compliance.jsonl` unless explicitly switched to live-stream mode, and the focused test suite locks that split (`.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:104-107`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:629-640`, `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts:149-166`).
- **DR-P1-003 remains closed for prompt-level aggregation and baseline SKILL.md handling inside telemetry analysis.** The telemetry layer still aggregates observations under one `promptId`, the analyzer collapses rows per prompt before scoring, and the tests lock both multi-read prompts and baseline-only `SKILL.md` reads (`.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:254-300`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:123-162`, `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:204-243`, `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts:75-103`).

## Metrics
- newInfoRatio: 0.06
- cumulative_p0: 0
- cumulative_p1: 3
- cumulative_p2: 3
- dimensions_advanced: [D3]
- stuck_counter: 0

## Next iteration focus
Rotate to D4 and inspect whether the post-025 maintainability cleanup left any strictness, dead-code, or standards-alignment gaps around the newly added observability surfaces.
