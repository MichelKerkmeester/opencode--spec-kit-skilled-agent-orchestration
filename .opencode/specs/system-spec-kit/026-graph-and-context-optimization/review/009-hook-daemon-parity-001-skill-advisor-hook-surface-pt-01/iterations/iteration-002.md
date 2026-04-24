# Iteration 002 — Dimension(s): D2

## Scope this iteration
This iteration reviewed the post-Phase-025 D2 correctness surfaces around advisor brief production, renderer token-cap handling, prompt-cache key composition, and cross-runtime parity. The goal was to verify that DR-P1-002 is closed end-to-end and to check for residual contract drift on cache-hit and runtime-render paths.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:51-73` → prompt-cache keys now normalize `maxTokens` and include it in the opaque HMAC payload alongside prompt, source signature, runtime, and thresholds.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:236-245` → `result()` now derives `tokenCap` from `args.metrics?.tokenCap` before finalizing the typed metrics object.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:303-316` → cache-hit payload handling restamps `sharedPayload.provenance.generatedAt` for reused advisor results.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:372-394` → cache-hit results preserve the cached value, mark `cacheHit: true`, avoid subprocess invocation, regenerate top-level `generatedAt`, and apply payload restamping.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:422-440` → fresh results clamp the token cap before rendering and persist that cap into result metrics.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:111-136` → renderer now reads `result.metrics.tokenCap` first and only falls back to render options when metrics are absent.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:180-216` → shared-payload envelopes are rebuilt from the current brief and freshness snapshot, with typed metadata and provenance fields only.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:905-944` → the envelope factory validates provenance/metadata before returning the canonical summary/sections payload.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:173-212` → tests cover exact cache hits, distinct cache entries for `maxTokens` 80 vs 120, and regenerated `generatedAt` plus restamped payload provenance on cache hits.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:234-257` → the producer test enforces the hard 120-token cap in `result.metrics.tokenCap` and in the emitted brief length.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts:64-82` → prompt-cache tests assert distinct keys for normalized `maxTokens` values while preserving the default 80-token behavior.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:41-58` → renderer tests confirm ambiguous output is only emitted when the producer result carries the 120-token mode and otherwise compacts to the 80-token variant.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:105-118` → plugin parity harness forwards `tokenCap` and other typed metrics from the canonical result into runtime-visible metadata.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-242` → parity tests keep visible brief text identical across Claude, Gemini, Copilot, Codex, wrapper, and plugin, and exercise the real builder-to-renderer path with `maxTokens: 80`.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-002 (D2) remains closed.** The producer now records the clamped token cap into typed metrics, the renderer consumes `result.metrics.tokenCap` instead of trusting caller defaults, prompt-cache keys split 80-token and 120-token variants, and cache-hit results restamp both top-level and envelope provenance timestamps before reuse (`skill-advisor-brief.ts:236-245`, `skill-advisor-brief.ts:303-316`, `skill-advisor-brief.ts:372-394`, `skill-advisor-brief.ts:422-440`, `render.ts:111-136`, `prompt-cache.ts:51-73`, `advisor-brief-producer.vitest.ts:184-212`, `advisor-renderer.vitest.ts:41-58`).

## Metrics
- newInfoRatio: 0.27
- cumulative_p0: 0
- cumulative_p1: 0
- cumulative_p2: 0
- dimensions_advanced: [D2]
- stuck_counter: 0

## Next iteration focus
Rotate to D3 and verify that the Phase-025 telemetry split, `finalizePrompt()` path, and prompt-id aggregation changes hold across the observability toolchain.
