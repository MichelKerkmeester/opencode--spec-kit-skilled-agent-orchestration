## Iteration 08

### Focus
Test and fixture coverage drift: which parity regressions are already protected, and which ones can silently ship because tests still target an older operator surface?

### Findings
- The Copilot hook tests are strong on writer behavior once the hook function is called, but they do not validate that `.claude/settings.local.json` still carries the top-level Copilot wrapper command fields. That leaves the 010/011 reversion invisible to the hook-level suite. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:78`, `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:93`, `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:149`, `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:186`
- The Codex hook tests likewise validate the compiled hook adapter itself, but not the documented activation prerequisites (`codex_hooks` feature flag and `hooks.json` wiring). Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:50`, `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:75`, `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:233`, `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:257`
- Gemini's runtime fixtures are now inconsistent with the checked-in runtime detector: the detector would read hooks from `.gemini/settings.json`, but the fixture hard-codes `unavailable`, so the cross-runtime suite no longer represents the repo's actual runtime surface. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:63`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:69`, `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts:59`, `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts:63`
- The cross-runtime fallback suite still treats Copilot readiness as "repo hook config exists" and Gemini readiness as "tool_fallback", so it protects older recovery assumptions rather than the remediated post-012 operator contract. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:54`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:58`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:93`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:102`

### New Questions
- Which regression suite should own wrapper-registration assertions for Copilot and activation-contract assertions for Codex?
- Should the cross-runtime fallback suite be split into "transport capability" and "repo wiring health" so it can express partial parity more accurately?
- Are there any downstream docs or playbooks generated from these stale fixtures that now inherit the same older assumptions?
- Would a small set of runtime-contract smoke tests against real config files catch most of the remaining parity drift?

### Status
converging
