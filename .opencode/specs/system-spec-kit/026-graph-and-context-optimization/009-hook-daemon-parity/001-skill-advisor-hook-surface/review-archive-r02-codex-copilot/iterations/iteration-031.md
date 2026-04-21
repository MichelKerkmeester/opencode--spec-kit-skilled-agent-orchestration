# Iteration 031 — Dimension(s): D3

## Scope this iteration
Reviewed the live-session wrapper's state ownership and callback contract, because earlier D3 passes covered telemetry scoring but not whether reads can still be attributed to the right prompt once more than one prompt is active. This pass focused on fresh wrapper/runtime evidence rather than re-reading the analyzer math alone.

## Evidence read
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:14-28 → session state and configure input are prompt-scoped (`promptId`, `selectedSkill`), but the public tool-call path accepts no prompt identifier.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:98-121 → `createLiveSessionWrapper()` keeps one mutable `state`, and every `configure()` call overwrites it with the latest prompt/session tuple.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:128-154 → `onToolCall()` reads from the current singleton `state` and emits telemetry with `active.promptId` / `active.selectedSkill`, so the read attribution always follows the most recently configured session.
- .opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:167-179 → the exported `configureSmartRouterSession()` / `onToolCall()` helpers are wired to a single module-level `defaultWrapper`.
- .opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:48-66 → the published runtime contract tells hosts to call `configureSmartRouterSession()` once per user prompt and later call bare `onToolCall()` for reads.
- .opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:114-121 → the Copilot integration example forwards only tool name and arguments into `onToolCall()`, with no prompt/session token to disambiguate overlapping prompts.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-031-01, dimension D3, the published live-session wrapper API can misattribute compliance telemetry across overlapping prompts because it stores only one active session and the read callback carries no prompt identity. Evidence: `createLiveSessionWrapper()` keeps a single mutable `state` and overwrites it on every `configure()` call at `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:98-121`; `onToolCall()` then emits telemetry from that current `active.promptId` / `active.selectedSkill` at `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:128-154`; the exported helpers are a singleton wrapper at `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:167-179`; and the setup guide tells runtimes to call `configureSmartRouterSession()` per prompt, then later invoke bare `onToolCall()` callbacks that provide only tool name and arguments at `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:48-66` and `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:114-121`. Impact: if prompt B configures the wrapper before a delayed `Read` from prompt A arrives, prompt A's read is recorded under prompt B's promptId/skill/predicted route, skewing overload, under-load, and per-skill compliance conclusions in the very live-session telemetry this surface is meant to validate. Remediation: make the wrapper session-scoped (or key a session map by prompt ID) and require `onToolCall()` to receive that session identity, then add a regression that interleaves prompt A/B reads and proves attribution stays with the originating prompt.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.06
- cumulative_p0: 0
- cumulative_p1: 17
- cumulative_p2: 15
- dimensions_advanced: [D3]
- stuck_counter: 0

## Next iteration focus
Advance D4 by checking whether the late-added observability and wrapper surfaces still match sk-code-opencode maintainability expectations around API clarity, dead paths, and test-backed contracts.
