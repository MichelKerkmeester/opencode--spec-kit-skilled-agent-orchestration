# Iteration 025 — Dimension(s): D4

## Scope this iteration
Reviewed D4 Maintainability + sk-code-opencode alignment because iteration 25 rotates to D4. This pass focused on whether the core exported advisor APIs, beyond the already-audited cache/generation helpers, keep a consistent TSDoc contract.

## Evidence read
- .opencode/skill/sk-code-opencode/references/typescript/style_guide.md:580-609 → the TypeScript standard expects TSDoc comments on exported APIs, including `@param`/`@returns` guidance.
- .opencode/skill/sk-code-opencode/SKILL.md:425-428 → documentation for public functions is a P1 quality gate in the OpenCode standards.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:93-100 → `renderAdvisorBrief()` already demonstrates the expected documented public API pattern on this surface.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-policy.ts:121-126 → exported `extractMetalinguisticSkillMentions()` and `shouldFireAdvisor()` begin without a preceding TSDoc block.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:208-211 → exported `runAdvisorSubprocess()` is public but undocumented.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:303-307 → exported `clearAdvisorBriefCacheForTests()` and `buildSkillAdvisorBrief()` also have no TSDoc contract.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:188-201 → exported metrics helpers start without TSDoc, and the exported collector class at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:276-302 is likewise undocumented.
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/iterations/iteration-018.md:7-24 → prior D4 coverage only captured the same documentation gap for cache/generation utilities, not these core advisor entrypoints.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
id P2-025-01, dimension D4, TSDoc coverage is still uneven across the core exported advisor APIs. Evidence: the repo standard says public functions need doc comments at .opencode/skill/sk-code-opencode/SKILL.md:425-428, and the TypeScript style guide shows the expected TSDoc format at .opencode/skill/sk-code-opencode/references/typescript/style_guide.md:580-609. Within the same advisor surface, `renderAdvisorBrief()` already follows that pattern at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:93-100, but exported entrypoints such as `extractMetalinguisticSkillMentions()` / `shouldFireAdvisor()` at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-policy.ts:121-126, `runAdvisorSubprocess()` at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:208-211, `clearAdvisorBriefCacheForTests()` / `buildSkillAdvisorBrief()` at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:303-307, plus the metrics helpers and collector at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:188-201 and .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:276-302 expose reusable contracts without comparable TSDoc. Impact: behavior stays correct, but maintainers have to infer core advisor contracts from implementation details while adjacent modules already publish clearer API boundaries. Remediation: add concise TSDoc to the exported prompt-policy, subprocess, brief, and metrics entrypoints, or explicitly mark them internal if they are not meant to be reused.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.06
- cumulative_p0: 0
- cumulative_p1: 15
- cumulative_p2: 13
- dimensions_advanced: [D4]
- stuck_counter: 0

## Next iteration focus
Advance D5 by checking for fresh integration drift across the plugin, bridge, runtime hooks, and Codex policy surfaces.
