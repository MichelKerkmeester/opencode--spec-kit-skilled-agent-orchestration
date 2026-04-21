# Iteration 011 — Dimension(s): D4

## Scope this iteration
Reviewed D4 Maintainability + sk-code-opencode alignment because the default rotation for iteration 11 lands on D4. I focused on fresh renderer-authority and test-contract evidence across the skill-advisor producer and renderer surfaces to determine whether a new maintainability defect exists beyond the earlier split-renderer concern.

## Evidence read
- .opencode/skill/sk-code-opencode/references/shared/universal_patterns.md:92 → the standard requires the same concept to keep the same name across the codebase.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:141 → the producer still carries a private `renderBrief` helper.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:189 → the shared payload envelope serializes `args.brief`, so the producer-local rendering path feeds downstream metadata.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:401 → `buildSkillAdvisorBrief` still computes `brief` with the producer-local renderer before returning the result object.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:100 → the exported `renderAdvisorBrief` is the documented prompt-boundary renderer used for model-visible output.
- .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:196 → the Copilot hook resolves `renderAdvisorBrief` as its renderer dependency and uses it for emitted hook output.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156 → the Claude hook likewise renders model-visible output through `renderAdvisorBrief`.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:83 → producer tests validate `result.brief` directly, but only with loose content assertions.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:17 → renderer tests lock exact output strings for `renderAdvisorBrief`, including the ambiguity branch at line 41.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- P1-002-01 remains valid from a D4 maintainability angle: two renderer authorities still exist for the same advisor-brief concept. The producer keeps its own `renderBrief` at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:141 and still materializes `result.brief` with it at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:401, while the runtime hooks render model-visible output through the separate exported renderer at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:100, .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:196, and .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156. Fresh test evidence shows the two surfaces are exercised independently rather than by a single parity contract: producer tests only assert loose `result.brief` content at .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:83 and .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:127, while renderer tests lock exact strings separately at .opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:17 and .opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:41. This is not counted as a new finding because iteration 002 already captured the required remediation to make one renderer authoritative.

## Metrics
- newInfoRatio: 0.12 (fresh D4 evidence strengthened the existing split-renderer concern through hook-consumer and test-contract reads, but it did not surface a separate new maintainability defect)
- cumulative_p0: 0
- cumulative_p1: 8
- cumulative_p2: 6
- dimensions_advanced: [D4]
- stuck_counter: 1

## Next iteration focus
Advance D5 Integration + Cross-runtime with fresh evidence from the plugin bridge, Codex adapter, and runtime-parity harness surfaces.
