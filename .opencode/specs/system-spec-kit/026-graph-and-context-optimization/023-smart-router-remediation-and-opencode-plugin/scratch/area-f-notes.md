# Area F Notes - Spec Kit Skill Advisor OpenCode Plugin

## Scope

- Created `.opencode/plugins/spec-kit-skill-advisor.js`.
- Created `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`.
- Created `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts`.

## Decisions

- Mirrored the compact-code-graph plugin split: OpenCode host stays thin, and the bridge loads compiled Spec Kit MCP server code in a separate Node process.
- Passed prompts to the bridge over stdin instead of argv so raw prompts do not appear in process arguments or the prompt-safe status tool.
- Kept prompt cache keys internal only; status exposes cache counts and hit rate but no raw prompt text, stdout/stderr, or prompt fingerprints.
- Implemented both opt-outs: `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED=1` and plugin config `{ enabled: false }`.

## Verification

- PASS: `npx vitest run spec-kit-skill-advisor-plugin` from `mcp_server` (7 tests).
- PASS: `npx tsc --noEmit` from `mcp_server`.
- PASS: direct bridge smoke check returned `{ brief, status, metadata }` JSON.
