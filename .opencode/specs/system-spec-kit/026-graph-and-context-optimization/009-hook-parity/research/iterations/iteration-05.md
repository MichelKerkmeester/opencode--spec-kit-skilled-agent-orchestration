## Iteration 05

### Focus
Gemini cross-runtime drift: compare the checked-in Gemini config and hook implementation to the docs and test fixtures after 012.

### Findings
- The checked-in Gemini config wires `SessionStart`, `PreCompress`, `BeforeAgent`, and `SessionEnd`, with the advisor brief attached to `BeforeAgent`. Evidence: `.gemini/settings.json:70`, `.gemini/settings.json:83`, `.gemini/settings.json:95`, `.gemini/settings.json:105`, `.gemini/settings.json:113`
- The Gemini prompt-hook implementation agrees with that config, explicitly describing itself as running on Gemini's "prompt-equivalent BeforeAgent surface" rather than a literal `UserPromptSubmit` event. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:3`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:5`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:43`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:45`
- The docs do not currently mirror those Gemini names. The runtime matrix still calls the Gemini prompt hook `UserPromptSubmit`, compaction hook `PreCompact`, and stop hook `Stop`, which is now a naming mismatch against the checked-in Gemini surface. Evidence: `.opencode/skill/system-spec-kit/references/config/hook_system.md:26`, `.opencode/skill/system-spec-kit/references/config/hook_system.md:59`, `.opencode/skill/system-spec-kit/references/config/hook_system.md:62`
- The test layer is also behind the checked-in runtime: `runtime-detection.ts` would report Gemini hooks as enabled when `.gemini/settings.json` contains `hooks` or `hooksConfig`, but the fixtures and fallback tests still hard-code Gemini as `unavailable` / `tool_fallback`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:60`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:69`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:74`, `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts:58`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:58`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:102`

### New Questions
- Should the docs be rewritten to use Gemini-native event names (`BeforeAgent`, `PreCompress`, `SessionEnd`) instead of abstracting them to Claude-shaped names?
- Are the Gemini fallback fixtures stale because they assume the test environment lacks `.gemini/settings.json`, or because the intended contract never got updated after hook wiring landed?
- Would a normalized internal vocabulary help here, or is the operator-facing docs surface better when it uses the runtime's actual hook names?
- Is there any downstream code besides docs/tests that still assumes Gemini is hookless or prompt-hooked through `UserPromptSubmit`?

### Status
new-territory
