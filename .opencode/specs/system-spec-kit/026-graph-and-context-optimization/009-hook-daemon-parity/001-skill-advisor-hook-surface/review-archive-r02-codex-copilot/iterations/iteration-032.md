# Iteration 032 — Dimension(s): D4

## Scope this iteration
Reviewed the late-added adapter-normalization surface for D4 maintainability, because earlier D4 passes mostly covered documentation gaps and renderer authority. This pass checked whether the exported API stays minimal and aligned with sk-code-opencode's "delete unused code" guidance.

## Evidence read
- .opencode/skill/sk-code-opencode/references/typescript/style_guide.md:557 → TypeScript guidance says unused code should be deleted rather than preserved.
- .opencode/skill/sk-code-opencode/assets/checklists/typescript_checklist.md:99 → the checklist repeats the same rule: delete unused code because git preserves history.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:62-118 → the module defines `normalizeRuntimeOutput()` as the real implementation, then exports a second alias `normalizeAdapterOutput = normalizeRuntimeOutput`.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:11-14 → parity tests import `normalizeRuntimeOutput`, not the alias.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:92-111 → every runtime-parity execution path calls `normalizeRuntimeOutput(...)` directly.
- .opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:15 → Copilot hook tests also import `normalizeRuntimeOutput`.
- .opencode/skill/system-spec-kit/mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts:10 → Gemini hook tests also import `normalizeRuntimeOutput`.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
id P2-032-01, dimension D4, `normalize-adapter-output.ts` exposes an orphaned second export name for the same normalization contract, which expands the public surface without any in-repo consumer. Evidence: the file's canonical implementation is `normalizeRuntimeOutput()` and it then adds `export const normalizeAdapterOutput = normalizeRuntimeOutput` at `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:62-118`; meanwhile downstream consumers keep importing and calling only `normalizeRuntimeOutput` in `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:11-14` and `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:92-111`, with the same canonical name used in `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:15` and `.opencode/skill/system-spec-kit/mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts:10`. The maintainability standard says unused code should be removed at `.opencode/skill/sk-code-opencode/references/typescript/style_guide.md:557` and `.opencode/skill/sk-code-opencode/assets/checklists/typescript_checklist.md:99`. Impact: keeping two public names for one helper makes future renames, docs, and test imports harder to keep authoritative even though only one name is actually exercised today. Remediation: remove `normalizeAdapterOutput` if it is not part of a compatibility contract, or switch all intended consumers/docs to that alias and document it as the single authoritative export.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.04
- cumulative_p0: 0
- cumulative_p1: 17
- cumulative_p2: 16
- dimensions_advanced: [D4]
- stuck_counter: 0

## Next iteration focus
Advance D5 by checking whether the plugin, bridge, and runtime-hook integration surfaces still share one authoritative cross-runtime contract.
