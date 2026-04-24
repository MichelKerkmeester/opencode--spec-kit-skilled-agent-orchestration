# Iteration 009 — Dimension(s): D2

## Scope this iteration
This iteration followed the default rotation back to D2 correctness. The focus was to re-verify the Phase 025 fixes around token-cap propagation, maxTokens-sensitive prompt-cache keys, cache-hit provenance restamping, and shared-payload envelope correctness using fresh source and test evidence.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:236-245` -> result construction now derives `tokenCap` from `args.metrics?.tokenCap` and writes it into the normalized metrics block.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:370-379` -> prompt-cache keys include canonical prompt, freshness `sourceSignature`, runtime, `maxTokens`, and threshold config before lookup.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:303-316` -> cache-hit shared payloads are restamped by cloning the envelope and replacing `provenance.generatedAt`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:383-394` -> cache hits now restamp both top-level `generatedAt` and the nested shared-payload provenance while marking `cacheHit: true`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:421-450` -> live subprocess results clamp `tokenCap`, render with that value, and only cache the resulting typed payload after the final metrics block is built.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:51-73` -> `normalizeMaxTokens()` canonicalizes the token budget, and the HMAC key payload includes the normalized `maxTokens` component.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:111-136` -> renderer now reads `result.metrics?.tokenCap` before falling back to options and uses that same cap for compact vs ambiguous output branches.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-540` -> advisor envelope metadata is schema-checked, rejects unknown keys, and sanitizes `skillLabel` before accepting metadata into the shared payload.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:555-579` -> provenance `sourceRefs` reject prompt-derived refs and only accept validated structured sources.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:173-213` -> tests assert cache hits avoid subprocess reruns, keep distinct entries for different `maxTokens`, and restamp both top-level and envelope timestamps.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts:64-82` -> the cache-key test proves `maxTokens` participates in key derivation and that defaulted 80-token mode matches the compact branch.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:41-58` -> renderer tests verify ambiguity rendering uses the producer-carried `metrics.tokenCap` to distinguish 80-token and 120-token modes.
- `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:43-54` -> the shared-payload round-trip test preserves the typed advisor metadata contract.
- `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:71-138` -> contract tests reject unknown metadata keys, prompt-derived provenance refs, and unsanitized skill labels.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-241` -> parity coverage still exercises identical visible brief output across Claude, Gemini, Copilot, Codex, wrapper, and plugin, plus one real builder-to-renderer path with `maxTokens: 80`.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-002 remains closed for token-cap propagation.** The builder writes `metrics.tokenCap` from the normalized result path, and the renderer consumes `result.metrics.tokenCap` rather than relying on caller defaults (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:236-245`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:111-136`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:41-58`).
- **DR-P1-002 remains closed for cache-key separation by `maxTokens`.** Cache lookups include the normalized token budget in the HMAC payload, and tests still show 80-token and 120-token requests do not alias to the same cached result (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:51-73`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:370-379`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts:64-82`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:184-197`).
- **DR-P1-002 remains closed for cache-hit provenance restamping.** Cache hits replace both top-level `generatedAt` and `sharedPayload.provenance.generatedAt`, so reused payloads do not masquerade as freshly-produced envelopes from the prior invocation (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:303-316`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:383-394`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:199-213`).
- **The D2 envelope contract remains intact.** Shared-payload coercion still rejects unknown advisor metadata keys, prompt-derived provenance refs, and unsanitized labels while preserving the typed advisor metadata on valid round-trips (`.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-540`, `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:555-579`, `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:43-54`, `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:71-138`).

## Metrics
- newInfoRatio: 0.07
- cumulative_p0: 0
- cumulative_p1: 1
- cumulative_p2: 1
- dimensions_advanced: [D2]
- stuck_counter: 0

## Next iteration focus
Rotate to D3 and re-check whether the post-025 observability split still keeps measurement, live-session wrapping, and prompt-level telemetry aggregation semantically aligned.
