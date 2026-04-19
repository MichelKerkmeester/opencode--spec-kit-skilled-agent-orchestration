# Iteration 018 — Dimension(s): D4

## Scope this iteration
Reviewed D4 Maintainability + sk-code-opencode alignment because iteration 18 rotates to D4. This pass focused on fresh API-discipline evidence across the skill-advisor cache and generation helpers to check whether the exported TypeScript surface still matches the repo's documented JS/TS documentation standards.

## Evidence read
- .opencode/skill/sk-code-opencode/assets/checklists/javascript_checklist.md:231-235 -> the repo checklist recommends JSDoc on public functions.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:93-99 -> `renderAdvisorBrief` already carries a public-facing JSDoc block in the same advisor surface.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:57-61 -> exported `getOrCompute()` is public but has no JSDoc contract.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:81-83 -> exported `clearAdvisorSourceCache()` is public but undocumented.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:47-50 -> exported `createAdvisorPromptCacheKey()` is public but undocumented.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:60-66 -> exported `AdvisorPromptCache` class is public but lacks class-level JSDoc.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts:151-181 -> exported generation helpers (`getAdvisorGenerationPath`, `readAdvisorGeneration`, `incrementAdvisorGeneration`, `clearAdvisorGenerationMemory`) are public but undocumented.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
id P2-018-01, dimension D4, several public skill-advisor utility APIs skip JSDoc even though the repo's JS/TS checklist expects it. Evidence: the standard explicitly calls for "Public functions have JSDoc documentation" at .opencode/skill/sk-code-opencode/assets/checklists/javascript_checklist.md:231-235, and the same advisor surface already follows that pattern for `renderAdvisorBrief` at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:93-99. In contrast, exported helpers such as `getOrCompute()` at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:57-61, `clearAdvisorSourceCache()` at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:81-83, `createAdvisorPromptCacheKey()` at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:47-50, the exported `AdvisorPromptCache` class at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:60-66, and the generation helpers at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts:151-181 expose reusable contracts without comparable API documentation. Impact: this does not break runtime behavior, but it makes the cache/generation contracts harder to reuse and maintain consistently than the already-documented renderer boundary. Remediation: add concise JSDoc to the exported cache and generation APIs, or explicitly document why those surfaces are intentionally internal despite being exported.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.09 (fresh D4 evidence across public cache/generation APIs surfaced one small new documentation-discipline gap late in the loop)
- cumulative_p0: 0
- cumulative_p1: 10
- cumulative_p2: 9
- dimensions_advanced: [D4]
- stuck_counter: 0

## Next iteration focus
Advance D5 Integration + Cross-runtime with fresh evidence from the plugin, bridge, Codex policy, and runtime parity surfaces.
