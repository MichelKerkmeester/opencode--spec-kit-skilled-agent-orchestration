# Iteration 004 — Dimension(s): D4

## Scope this iteration
Reviewed D4 Maintainability + sk-code-opencode alignment because the default rotation for iteration 4 selects D4. I focused on the `mcp_server/lib/skill-advisor/*.ts` modules for strict-type escape hatches, dead exports, comment discipline, duplicated rendering responsibilities, and alignment with the OpenCode TypeScript standards.

## Evidence read
- .opencode/skill/sk-code-opencode/references/typescript/style_guide.md:30 → TypeScript source files should begin with a module header block.
- .opencode/skill/sk-code-opencode/references/typescript/style_guide.md:72 → large TypeScript files should use numbered section dividers for imports, types, constants, helpers, core logic, and exports.
- .opencode/skill/sk-code-opencode/references/typescript/quality_standards.md:34 → object shapes and data structures should use `interface`.
- .opencode/skill/sk-code-opencode/references/typescript/quality_standards.md:64 → public API surfaces should use `unknown` over `any`.
- .opencode/skill/sk-code-opencode/references/shared/universal_patterns.md:89 → comments should explain why, not obvious mechanics.
- .opencode/skill/system-spec-kit/tsconfig.json:6 → the system-spec-kit TypeScript baseline enables `strict`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-policy.ts:7 → prompt policy exports a readonly object-shape interface.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-policy.ts:97 → prompt normalization is centralized through `canonicalFold`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:29 → freshness uses small documented interfaces for fingerprint and diagnostic shapes.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:111 → signature hashing helper is typed without `any`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:18 → normalizer defines the runtime-neutral output contract with a documented interface.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:62 → `normalizeRuntimeOutput` is the exported implementation used by runtime parity tests and hooks.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:118 → `normalizeAdapterOutput` is exported as an alias to `normalizeRuntimeOutput`.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:12 → parity tests import `normalizeRuntimeOutput`, not `normalizeAdapterOutput`.
- .opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:11 → Codex hook tests import `normalizeRuntimeOutput`, not `normalizeAdapterOutput`.
- .opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts:10 → Claude hook tests import `normalizeRuntimeOutput`, not `normalizeAdapterOutput`.
- .opencode/skill/system-spec-kit/mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts:10 → Gemini hook tests import `normalizeRuntimeOutput`, not `normalizeAdapterOutput`.
- .opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:15 → Copilot hook tests import `normalizeRuntimeOutput`, not `normalizeAdapterOutput`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:111 → metrics maintain a closed forbidden-field set for prompt-bearing diagnostic fields.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:141 → the producer has an internal `renderBrief` helper.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:151 → the producer helper formats `top.skill` directly into `result.brief`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:93 → the runtime renderer documents itself as the prompt-boundary guard.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:118 → the runtime renderer sanitizes the selected skill label before emitting model-visible text.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:162 → Claude uses the shared runtime renderer before emitting hook output.
- .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:176 → Gemini uses the shared runtime renderer before emitting hook output.
- .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:202 → Copilot uses the shared runtime renderer before emitting hook output.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:259 → Codex uses the shared runtime renderer before emitting hook output.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:121 → subprocess execution keeps spawn-attempt state local and typed.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:28 → source-cache eviction logic is separated into helpers.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:60 → prompt-cache is encapsulated in a generic class.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
id P2-004-01, dimension D4, unused normalizer alias should be removed or documented. Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:62 exports the implementation as `normalizeRuntimeOutput`, and .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:118 exports `normalizeAdapterOutput` as a second name for the same function. Fresh in-repo evidence shows runtime parity and hook tests import `normalizeRuntimeOutput` at .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:12, .opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:11, .opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts:10, .opencode/skill/system-spec-kit/mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts:10, and .opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:15. Impact: the alias looks like an active public API but has no observed in-repo consumer, adding a small dead-code/compatibility ambiguity to a file whose job is runtime contract clarity. Remediation: remove the alias if there is no external compatibility requirement, or add a short comment/test explaining the compatibility contract it preserves.

### Re-verified (no new severity)
- P1-002-01 remains the active renderer-responsibility issue from a D4 maintainability angle: .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:141 keeps a producer-local `renderBrief`, while .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:93 identifies the shared renderer as the prompt-boundary guard and the runtime hooks call that shared renderer at .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:162, .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:176, .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:202, and .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:259. This is not counted as a new finding because iteration 002 already recorded the required remediation to make one renderer authoritative.

## Metrics
- newInfoRatio: 0.56 (first D4 pass read all skill-advisor TypeScript modules plus TypeScript standards and fresh usage evidence; one small dead-export/compatibility ambiguity was new, while the renderer split re-verifies prior P1 evidence)
- cumulative_p0: 0
- cumulative_p1: 3
- cumulative_p2: 2
- dimensions_advanced: [D4]
- stuck_counter: 0

## Next iteration focus
Advance D5 Integration + Cross-runtime with fresh evidence from the OpenCode plugin, bridge, runtime hooks, Codex policy, renderer parity tests, and the labeled prompt corpus.
