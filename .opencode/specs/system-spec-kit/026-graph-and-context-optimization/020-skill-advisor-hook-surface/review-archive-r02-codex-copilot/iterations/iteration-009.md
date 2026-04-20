# Iteration 009 — Dimension(s): D2

## Scope this iteration
Reviewed D2 Correctness because the default rotation for iteration 9 selects D2. I focused on fresh evidence around the producer cache contract, token-cap semantics, and cross-runtime fail-open paths while avoiding a rehash of the prior ambiguity-rendering finding.

## Evidence read
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/review/iterations/iteration-002.md:36 -> prior D2 finding already covered ambiguous top-two results not being rendered by shipped runtime hooks.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:35 -> `SkillAdvisorBriefOptions` exposes caller-provided producer options.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:38 -> `maxTokens` is one of those options.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:87 -> token-cap clamping accepts `maxTokens` and the ambiguity state.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:88 -> `maxTokens` overrides the ambiguity/default token-cap selection.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:354 -> the producer creates a cache key before invoking the advisor subprocess.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:355 -> the cache key includes `canonicalPrompt`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:356 -> the cache key includes `sourceSignature`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:357 -> the cache key includes `runtime`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:358 -> the cache key includes `thresholdConfig`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:360 -> matching entries return the cached result path.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:364 -> the cache hit returns `cached.value`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:366 -> cache-hit metrics copy the cached result metrics.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:401 -> uncached results compute `tokenCap` from `options.maxTokens` and ambiguity.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:402 -> the computed token cap affects the produced brief.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:415 -> uncached result metrics include the computed token cap.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:423 -> cache storage runs for cacheable ok results.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:427 -> the cached value is the full ok result, including brief/sharedPayload/metrics.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:17 -> cache key parts define the key contract.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:18 -> cache key parts include `canonicalPrompt`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:19 -> cache key parts include `sourceSignature`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:20 -> cache key parts include `runtime`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:21 -> cache key parts include `thresholdConfig`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:51 -> HMAC payload construction starts from the key parts.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:52 -> HMAC payload includes the canonical prompt.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:53 -> HMAC payload includes the source signature.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:54 -> HMAC payload includes the runtime.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:55 -> HMAC payload includes the stable threshold config.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:168 -> cache-hit coverage exercises an identical second call only.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:173 -> the second call asserts ok status.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:174 -> the second call asserts the brief equals the first brief.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:175 -> the second call asserts `cacheHit` is true.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:198 -> token-cap coverage exists separately.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:215 -> token-cap coverage calls the producer with a custom `maxTokens`.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:220 -> token-cap coverage asserts the hard cap.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:221 -> token-cap coverage asserts the brief length respects that cap.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156 -> Claude hook uses the shared producer.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:162 -> Claude hook renders the producer result.
- .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:170 -> Gemini hook uses the shared producer.
- .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:176 -> Gemini hook renders the producer result.
- .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:196 -> Copilot hook uses the shared producer.
- .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:202 -> Copilot hook renders the producer result.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:253 -> Codex hook uses the shared producer.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:259 -> Codex hook renders the producer result.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-009-01, dimension D2, the producer cache key ignores `maxTokens`, so later calls with the same prompt/runtime/source/thresholds can receive a cached brief, shared payload, and `metrics.tokenCap` produced under a different token-cap contract. Evidence: `SkillAdvisorBriefOptions` exposes `maxTokens` at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:35 through .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:39, and uncached results compute token behavior from it at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:87 through .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:89 plus .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:401 through .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:419. The cache key built at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:354 through .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:359 omits `maxTokens`, matching the key contract in .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:17 through .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:21 and HMAC payload in .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:51 through .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:55. Cache hits then return `cached.value` at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:360 through .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:373, while cache storage preserves the full ok result at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:423 through .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:429. Impact: a first call with a small or explicit token budget can poison the exact-prompt cache for a later default/ambiguous call, or the reverse, making the envelope and metrics report the wrong model-visible contract without rerunning the advisor. Remediation: include the normalized token-cap request in `AdvisorPromptCacheKeyParts` and the HMAC payload, or stop caching producer results when `options.maxTokens` is provided; add a regression test that calls the same prompt twice with different `maxTokens` values and asserts distinct `brief`/`metrics.tokenCap` behavior.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- P1-002-01 remains valid: all four runtime hooks still call `renderAdvisorBrief(result)` without passing a token-cap option at .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:162, .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:176, .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:202, and .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:259, while ambiguity rendering still requires `tokenCap > DEFAULT_TOKEN_CAP` at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:123.

## Metrics
- newInfoRatio: 0.36 (fresh D2 evidence identified a separate cache-key/token-cap correctness defect and re-verified the prior ambiguity issue without double-counting it)
- cumulative_p0: 0
- cumulative_p1: 7
- cumulative_p2: 6
- dimensions_advanced: [D2]
- stuck_counter: 0

## Next iteration focus
Advance D3 Performance + Observability by checking cache metrics, telemetry names, measurement scripts, and whether the new cache-key finding also distorts observed token-cap/cache-hit signals.
