# Iteration 037 — Dimension(s): D2

## Scope this iteration
This iteration followed the default D2 rotation and re-verified the post-025 correctness path across the advisor envelope, token-cap propagation, cache-key partitioning, and cross-runtime rendering parity. The focus was to confirm DR-P1-002 is closed in live code paths rather than only in isolated remediation notes.

## Evidence read
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/review/deep-review-strategy.md:21-25,30-34,79-81` → D2 is the correctness dimension for the envelope contract, tokenCap-from-metrics, cache maxTokens keying, provenance restamping, and runtime parity.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/review/deep-review-state.jsonl:38` → cumulative state entering iteration 37 was P0=0, P1=8, P2=4.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/review/iterations/iteration-036.md:34-48` → prior iteration handed focus to a D2 re-check of the envelope/renderer correctness path.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:370-378,421-440` → the builder still includes `maxTokens` in the cache key and records the computed `tokenCap` in `result.metrics`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:20-25,51-73` → the prompt-cache key schema still includes normalized `maxTokens`, so 80-token and 120-token briefs hash to different cache entries.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:184-197` → the producer test still asserts different `maxTokens` values trigger separate subprocess executions rather than reusing one cached result.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:100-137` → the renderer still derives its token budget from `result.metrics.tokenCap` first and only emits the ambiguous two-skill branch when that budget exceeds the default cap.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:41-58` → renderer coverage still proves the same result renders compact output at `tokenCap=80` and the ambiguity variant at `tokenCap=120`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:303-317,379-394` → cache-hit responses still restamp `generatedAt` and `sharedPayload.provenance.generatedAt` before returning the cached envelope.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:199-213` → the cache-hit test still verifies both top-level and envelope provenance timestamps are refreshed on reuse.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-579` → the shared advisor envelope still enforces the typed metadata/source-ref contract, including sanitized `skillLabel` and rejection of prompt-derived provenance refs.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:80-86`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:94-100`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:126-132`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:131-137` → all four runtime hooks still prefer the shared-payload metadata label before falling back to the raw recommendation, preserving one typed envelope contract across runtimes.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-242` → the parity harness still requires identical visible brief output across Claude, Gemini, Copilot, Codex, wrapper fallback, and the plugin, including a real builder-to-renderer path.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-002 remains closed for cache-key correctness.** The builder still passes `maxTokens` into the cache key, the prompt-cache key builder still normalizes and hashes that field, and the producer test still proves 80-token and 120-token requests do not alias to the same cached brief (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:370-378`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:51-73`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:184-197`).
- **DR-P1-002 remains closed for renderer token-cap correctness.** The renderer still reads the authoritative token budget from `result.metrics.tokenCap`, and the focused renderer test still distinguishes the compact and ambiguity branches using that stored metric rather than any out-of-band option (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:100-137`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:41-58`).
- **DR-P1-002 remains closed for cached-envelope provenance restamping and runtime parity.** Cache hits still refresh both `generatedAt` surfaces before returning, the shared envelope still enforces typed metadata/source-ref validation, and the runtime parity harness still keeps all runtime surfaces on the same visible brief contract (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:303-317,379-394`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:199-213`, `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-579`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-242`).

## Metrics
- newInfoRatio: 0.01
- cumulative_p0: 0
- cumulative_p1: 8
- cumulative_p2: 4
- dimensions_advanced: [D2]
- stuck_counter: 0

## Next iteration focus
Rotate to D3 and re-check the post-025 smart-router telemetry split, finalizePrompt flow, and promptId aggregation for any residual observability drift.
