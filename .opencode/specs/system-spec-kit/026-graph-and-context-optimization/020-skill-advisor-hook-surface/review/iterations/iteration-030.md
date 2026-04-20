# Iteration 030 — Dimension(s): D2

## Scope this iteration
This iteration followed the default D2 rotation and re-checked the post-025 correctness fixes around token-cap propagation, prompt-cache partitioning, cache-hit provenance restamping, and cross-runtime brief parity. The goal was to confirm DR-P1-002 is substantively closed on the current implementation rather than only covered by narrow happy-path tests.

## Evidence read
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/review/deep-review-strategy.md:21,30-34,79-82` -> D2 remains scoped to envelope contract, tokenCap from metrics, maxTokens cache partitioning, provenance restamping, and residual-gap hunting on fresh evidence.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/review/deep-review-state.jsonl:31` -> cumulative state entering this iteration was P0=0, P1=8, P2=4.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/review/iterations/iteration-029.md:44-45` -> prior iteration handed off a D2 re-check of tokenCap, cache-key partitioning, and provenance restamping.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:20-25,51-73` -> the prompt-cache key explicitly includes normalized `maxTokens` alongside canonical prompt, source signature, runtime, and thresholds.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:238-255,370-394,444-450` -> producer results persist `metrics.tokenCap`, key the cache with `options.maxTokens`, and restamp `sharedPayload.provenance.generatedAt` on cache hits before returning the cached value.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:111-137` -> the model-visible renderer consumes `result.metrics.tokenCap` first, then derives the compact vs ambiguous brief path from that stored metric rather than any caller-local option.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156-181` -> Claude rebuilds the visible brief from the typed result and emits that rendered brief as `additionalContext`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:170-195` -> Gemini follows the same build-then-render handoff and returns only the rendered brief.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:196-215,246-252` -> Copilot SDK uses the shared renderer output and publishes that rendered brief, not raw subprocess output, into `additionalContext`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:253-278` -> Codex also renders from the typed result before returning the hook payload.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:184-212` -> focused tests assert distinct cache entries for 80 vs 120 token requests and verify both top-level and envelope `generatedAt` are restamped on cache hits.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-219` -> runtime parity coverage asserts identical visible brief text across Claude, Gemini, Copilot, Codex, Copilot wrapper, and the plugin surface.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-002 remains closed for maxTokens cache partitioning.** The prompt-cache key includes normalized `maxTokens` in its HMAC payload (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:51-73`), the producer passes `options.maxTokens` into `cache.makeKey(...)` (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:372-378`), and the focused producer test confirms 80-token and 120-token requests do not share cache entries (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:184-197`).
- **DR-P1-002 remains closed for cache-hit provenance restamping.** On cache hits the producer mints a fresh `generatedAt`, preserves the cached value, and rewrites `sharedPayload.provenance.generatedAt` through `restampCachedSharedPayload(...)` before returning (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:303-317,379-394`). The producer test explicitly asserts the envelope `generatedAt` tracks the top-level timestamp on the cached path (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:199-212`).
- **DR-P1-002 remains closed for renderer token-cap correctness and runtime parity.** The renderer derives its cap from `result.metrics.tokenCap` before choosing compact vs ambiguous output (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:111-137`), and all four runtime hooks plus the Copilot/plugin surfaces return that rendered brief rather than an unsynchronized producer string (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156-181`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:170-195`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:196-215,246-252`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:253-278`). The parity test locks this by asserting identical visible text across every runtime surface (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-219`).

## Metrics
- newInfoRatio: 0.02
- cumulative_p0: 0
- cumulative_p1: 8
- cumulative_p2: 4
- dimensions_advanced: [D2]
- stuck_counter: 0

## Next iteration focus
Rotate to D3 and re-check the post-025 observability split between default-stream telemetry, finalizePrompt/live-session measurement, and analyzer promptId aggregation.
