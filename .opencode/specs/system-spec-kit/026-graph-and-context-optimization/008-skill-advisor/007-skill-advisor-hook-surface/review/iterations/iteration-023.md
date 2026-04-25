# Iteration 023 — Dimension(s): D2

## Scope this iteration
This iteration followed the default D2 rotation and re-checked the post-025 correctness path around the advisor envelope contract, token-cap propagation, cache-key partitioning, and cached-payload provenance restamping. The goal was to verify DR-P1-002 is closed end-to-end and that the parity/contract surfaces still agree after remediation.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:180-216` → shared payload creation still derives metadata/provenance from typed advisor output, including `metadata.skillLabel`, `metadata.status`, freshness, and repository-backed source refs.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:238-245,370-394` → result metrics persist `tokenCap`, cache keys include `maxTokens`, and cache-hit returns re-stamp both top-level `generatedAt` and `sharedPayload.provenance.generatedAt`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:111-137` → renderer now reads token-cap from `result.metrics.tokenCap` before choosing compact vs ambiguous output shape.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:20-25,51-74` → prompt-cache key parts explicitly include `maxTokens`, normalized into the HMAC payload so 80-token and 120-token renders cannot collide.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-542,555-579` → advisor envelope metadata remains schema-validated and source refs still reject prompt-derived provenance, preserving the envelope contract at the shared-payload boundary.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:184-213` → regression tests lock separate cache entries for differing `maxTokens` values and assert cache-hit restamping of both `generatedAt` fields.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:41-58` → renderer tests assert the ambiguous two-skill brief appears only when the producer result carries the 120-token mode and falls back to compact output at 80.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts:64-82` → cache tests assert normalized `maxTokens` participates in key generation, with defaulted and explicit-80 values aligning while 120 remains distinct.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-219` → parity harness still requires identical visible brief text across Claude, Gemini, Copilot, Codex, wrapper fallback, and plugin for canonical fixtures.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-002 remains closed for token-cap correctness.** The builder persists `tokenCap` into typed result metrics, the renderer consumes `result.metrics.tokenCap` rather than an external option, and the renderer regression test proves the 120-token ambiguous branch only triggers when the producer marks that mode (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:238-245`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:111-137`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:41-58`).
- **DR-P1-002 remains closed for prompt-cache partitioning.** Cache-key construction includes normalized `maxTokens`, and both producer-level and cache-level tests confirm 80-token and 120-token requests do not reuse the same entry (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:20-25,51-74`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts:64-82`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:184-197`).
- **DR-P1-002 remains closed for cached provenance restamping.** On cache hits the builder reissues a fresh top-level `generatedAt` and rewrites `sharedPayload.provenance.generatedAt` to the same timestamp, with regression coverage pinning both fields (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:303-317,379-394`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:199-213`).
- **D2 envelope/parity contract still holds.** The advisor shared payload remains schema-validated at the metadata/provenance boundary, and the runtime parity harness still enforces identical visible brief text across all runtime adapters plus the plugin (`.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-542,555-579`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-219`).

## Metrics
- newInfoRatio: 0.02
- cumulative_p0: 0
- cumulative_p1: 7
- cumulative_p2: 3
- dimensions_advanced: [D2]
- stuck_counter: 0

## Next iteration focus
Rotate to D3 and re-check the post-025 observability split between default-stream output, live-session finalization, and promptId-based telemetry aggregation.
