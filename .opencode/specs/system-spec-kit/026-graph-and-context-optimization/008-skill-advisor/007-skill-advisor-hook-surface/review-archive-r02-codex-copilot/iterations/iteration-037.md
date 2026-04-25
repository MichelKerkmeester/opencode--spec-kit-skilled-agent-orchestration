# Iteration 037 — Dimension(s): D2

## Scope this iteration
Reviewed the late-cycle D2 correctness surface because iteration 37 rotates back to correctness after iteration 36's D1 privacy check. This pass focused on fresh cache-key, shared-payload, and runtime-parity evidence to see whether previously logged envelope/tokencap correctness gaps were actually closed.

## Evidence read
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/deep-review-strategy.md:11-13 → D2 remains scoped to envelope contract, 4-runtime parity, fail-open behavior, freshness semantics, and UNKNOWN fallback.
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/deep-review-state.jsonl:38 → iteration 36 ended at cumulative P0=0, P1=18, P2=17 with `stuck=2`.
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/iterations/iteration-036.md:39-40 → prior iteration explicitly handed off to a D2 freshness/fail-open parity check.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:35-39,87-90 → `maxTokens` is an input to brief construction, and `clampTokenCap()` derives the final token budget from `options.maxTokens` plus ambiguity state.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:352-359,360-373,401-418 → the prompt-cache lookup happens before `tokenCap` is computed, the cache key includes canonical prompt/source/runtime/thresholds only, and cache hits return the cached value rather than rebuilding a token-cap-specific variant.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:17-22,47-57 → `AdvisorPromptCacheKeyParts` and `createAdvisorPromptCacheKey()` still omit any `maxTokens` or rendered-brief width discriminator.
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:845-868 → advisor shared-payload provenance still requires a non-empty `generatedAt`, so stale cached provenance timestamps remain contract-significant.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:168-221 → cache coverage still asserts only identical brief reuse plus `metrics.cacheHit`, while the explicit `maxTokens` path is tested in isolation rather than across repeated calls.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156-163; .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:170-177; .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:196-203; .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:253-260 → all four runtime hooks still call `renderAdvisorBrief(result)` without a token-cap override.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:111-137; .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:26-32,119-135 → ambiguity rendering still requires `tokenCap > DEFAULT_TOKEN_CAP`, and runtime parity still exercises only the canonical non-ambiguous fixture set.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **P1-009-01 (D2)** remains open: fresh cache-key evidence still shows `maxTokens` can affect the rendered brief but is not part of the prompt-cache identity. `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:35-39,87-90,352-359,360-373,401-418` derives `tokenCap` after the cache lookup, while `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:17-22,47-57` keys only on canonical prompt, source signature, runtime, and thresholds. `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:168-221` still lacks a regression that calls the producer twice with the same prompt but different `maxTokens`, so the previously logged cache-key omission is not closed.
- **P1-023-01 (D2)** remains open: the shared-payload contract still treats provenance timestamps as required correctness data, but cache-hit reuse still returns the cached envelope without rebuilding it. `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:845-868` requires a non-empty `provenance.generatedAt`, yet `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:360-373` only refreshes top-level metrics and `generatedAt` on cache hits. `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:168-176` still does not assert refreshed envelope provenance.
- **P1-002-01 (D2)** remains open: the ambiguity-render parity gap is still present across all four runtimes. `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156-163`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:170-177`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:196-203`, and `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:253-260` all render with default options, while `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:111-137` still requires `tokenCap > DEFAULT_TOKEN_CAP` to emit the ambiguity branch. `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:26-32,119-135` still covers only the canonical non-ambiguous fixtures, so runtime parity for the ambiguity path remains unproven.

## Metrics
- newInfoRatio: 0.04
- cumulative_p0: 0
- cumulative_p1: 18
- cumulative_p2: 17
- dimensions_advanced: [D2]
- stuck_counter: 3

## Next iteration focus
Advance D3 by checking whether observability surfaces can actually detect the still-open cache, provenance, and ambiguity-parity correctness gaps.
