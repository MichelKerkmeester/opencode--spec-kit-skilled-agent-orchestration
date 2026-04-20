# Iteration 004 — Dimension(s): D4

## Scope this iteration
This iteration reviewed the Phase-025 D4 maintainability surfaces inside `mcp_server/lib/skill-advisor`, with emphasis on the newly-added cache bound, the deprecated normalizer alias, and the public API documentation sweep. The goal was to confirm DR-P2-001 is closed in code and tests, and to look for residual sk-code-opencode alignment gaps on the touched exports.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:8-12` -> the advisor prompt cache now exposes an explicit `MAX_CACHE_ENTRIES = 1000` bound alongside the token constants.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:103-125` -> `set()` sweeps expired rows before insert and only admits a new entry after running the overflow guard.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:163-170` -> `evictOldestUntilBelowLimit()` trims the oldest entry while the map is at or above the cap.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts:84-100` -> the cache test fills `MAX_CACHE_ENTRIES + 1` rows and asserts the oldest row is evicted while the newest remains addressable.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:62-119` -> `normalizeRuntimeOutput()` remains the canonical helper and the legacy `normalizeAdapterOutput` export is retained as an explicit `@deprecated` alias.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-policy.ts:121-128` -> the prompt-policy public helpers now carry focused JSDoc describing diagnostics extraction and fire/no-fire decisions.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:57-84` -> the source-cache public API is documented and bounded by TTL plus `ADVISOR_SOURCE_CACHE_MAX_ENTRIES`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts:151-186` -> the generation-counter public API (`getAdvisorGenerationPath`, `readAdvisorGeneration`, `incrementAdvisorGeneration`, `clearAdvisorGenerationMemory`) is documented and keeps typed recovery states.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:188-309` -> the metrics helpers and collector now expose JSDoc-backed, prompt-safe typed surfaces rather than ad hoc records.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:319-394` -> the public brief builder and cache-reset hook are documented, and the cached-return path still re-stamps generated timestamps without widening the surface.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P2-001 (D4) remains closed.** The prompt cache is now explicitly bounded and covered by eviction tests, the adapter normalizer preserves the legacy export behind an explicit `@deprecated` alias, and the Phase-025 public advisor helpers gained concise JSDoc across the touched files (`prompt-cache.ts:8-12`, `prompt-cache.ts:103-125`, `prompt-cache.ts:163-170`, `advisor-prompt-cache.vitest.ts:84-100`, `normalize-adapter-output.ts:62-119`, `prompt-policy.ts:121-128`, `source-cache.ts:57-84`, `generation.ts:151-186`, `metrics.ts:188-309`, `skill-advisor-brief.ts:319-394`).

## Metrics
- newInfoRatio: 0.14
- cumulative_p0: 0
- cumulative_p1: 0
- cumulative_p2: 0
- dimensions_advanced: [D4]
- stuck_counter: 0

## Next iteration focus
Rotate to D5 and verify the OpenCode plugin plus five-runtime parity surfaces still hold after the remediation-layer changes.
