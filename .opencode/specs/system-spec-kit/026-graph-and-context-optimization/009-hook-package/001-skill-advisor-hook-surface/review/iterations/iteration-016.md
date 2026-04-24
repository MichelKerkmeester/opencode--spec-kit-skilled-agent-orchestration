# Iteration 016 — Dimension(s): D2

## Scope this iteration
This iteration followed the default D2 rotation and re-verified the post-025 correctness fixes around prompt-cache partitioning, renderer token-cap sourcing, and cache-hit shared-payload provenance restamping. The goal was to confirm DR-P1-002 stayed closed and that the remediation still preserves envelope correctness across cached and uncached paths.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:372-378` → cache keys now include `sourceSignature`, `runtime`, `maxTokens`, and threshold config before lookup.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:383-394` → cache-hit results restamp top-level `generatedAt`, preserve `metrics.cacheHit=true`, and restamp `sharedPayload.provenance.generatedAt`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:421-440` → the producer computes `tokenCap` once from `options.maxTokens` plus ambiguity and stores it in `metrics.tokenCap`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:111-136` → the renderer reads `result.metrics?.tokenCap ?? options.tokenCap`, so visible brief selection follows the producer result instead of a caller-side default.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:51-73` → `normalizeMaxTokens()` canonicalizes the value and `createAdvisorPromptCacheKey()` hashes normalized `maxTokens` into the prompt-cache key payload.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-508` → advisor envelope metadata still validates `skillLabel` through `sanitizeSkillLabel()` before accepting it.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:861-905` → shared-payload envelopes require non-empty `provenance.generatedAt`, preserve `lastUpdated`, and validate provenance through `createSharedPayloadEnvelope()`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:184-213` → focused tests assert different `maxTokens` values miss the cache and cache hits restamp both top-level and envelope `generatedAt`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:234-257` → the producer test proves `metrics.tokenCap` is clamped to 120 and the emitted brief obeys that cap.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts:64-99` → cache tests prove normalized `maxTokens` participates in the key and bounded eviction still behaves deterministically.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:41-58` → renderer tests prove the same result object flips between compact and ambiguity output solely from `metrics.tokenCap`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-219` → parity tests still require identical visible brief text across Claude, Gemini, Copilot, Codex, wrapper, and plugin surfaces.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-002 remains closed for cache partitioning.** The prompt cache key now includes normalized `maxTokens`, so 80-token and 120-token brief variants do not alias each other, and the focused cache tests still assert that behavior (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:372-378`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:51-73`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:184-197`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts:64-82`).
- **DR-P1-002 remains closed for token-cap sourcing.** The producer persists `tokenCap` into `result.metrics`, and the renderer now consumes that stored metric to decide whether to render the compact or ambiguity form, which the renderer and producer suites both cover (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:421-440`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:111-136`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:41-58`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:234-257`).
- **DR-P1-002 remains closed for cache-hit provenance correctness.** Cached results still get a fresh top-level timestamp and a matching `sharedPayload.provenance.generatedAt`, while the envelope validator continues to require non-empty provenance timestamps before emission (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:383-394`, `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:861-905`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:199-213`).
- **D2 runtime parity remains intact.** The parity harness still asserts identical visible brief text across all four core runtimes plus wrapper and plugin, so the post-025 correctness changes are not introducing runtime-specific rendering drift (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-219`).

## Metrics
- newInfoRatio: 0.02
- cumulative_p0: 0
- cumulative_p1: 2
- cumulative_p2: 3
- dimensions_advanced: [D2]
- stuck_counter: 0

## Next iteration focus
Rotate to D3 and re-check the post-025 smart-router telemetry split, finalizePrompt plumbing, and promptId aggregation paths for residual observability drift.
