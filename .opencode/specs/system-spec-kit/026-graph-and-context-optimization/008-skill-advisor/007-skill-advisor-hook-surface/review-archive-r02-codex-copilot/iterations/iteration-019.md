# Iteration 019 — Dimension(s): D5

## Scope this iteration
Reviewed D5 Integration + Cross-runtime because iteration 19 rotates to D5. This pass focused on whether the shipped OpenCode plugin still shares the same operational kill-switch contract as the four native runtime hooks, which had not been checked in the earlier D5 passes.

## Evidence read
- .opencode/plugins/spec-kit-skill-advisor.js:18 -> the OpenCode plugin defines its own disable flag constant as `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED`.
- .opencode/plugins/spec-kit-skill-advisor.js:42-43 -> `envDisablesPlugin()` checks only the plugin-specific environment variable.
- .opencode/plugins/spec-kit-skill-advisor.js:287-294 -> plugin enablement and `onUserPromptSubmitted()` short-circuit on the plugin-specific flag, not the shared hook flag.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:121-128 -> Claude short-circuits on `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:135-142 -> Gemini short-circuits on the shared hook disable flag.
- .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:161-168 -> Copilot short-circuits on the shared hook disable flag.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:218-225 -> Codex short-circuits on the shared hook disable flag.
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:136-147 -> the plugin suite only verifies opt-out via `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED`.
- .opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts:99-117 -> Claude test coverage enforces `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`.
- .opencode/skill/system-spec-kit/mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts:103-120 -> Gemini test coverage enforces the same shared hook disable flag.
- .opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:186-201 -> Copilot test coverage enforces the shared hook disable flag.
- .opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:163-176 -> Codex test coverage enforces the shared hook disable flag.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-019-01, dimension D5, the shipped OpenCode plugin does not honor the same disable flag as the Claude/Gemini/Copilot/Codex hook surfaces. Evidence: the plugin defines and reads `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` at .opencode/plugins/spec-kit-skill-advisor.js:18, .opencode/plugins/spec-kit-skill-advisor.js:42-43, and .opencode/plugins/spec-kit-skill-advisor.js:287-294, while the native hooks short-circuit on `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` at .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:121-128, .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:135-142, .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:161-168, and .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:218-225. The tests reinforce that split: the plugin suite only checks the plugin-specific variable at .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:136-147, while each native runtime suite checks the shared hook flag at .opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts:99-117, .opencode/skill/system-spec-kit/mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts:103-120, .opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:186-201, and .opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:163-176. Impact: operators cannot disable all shipped prompt-time advisor integrations with one runtime-agnostic kill switch, so mixed-runtime rollouts can leave the OpenCode plugin still injecting advisor text after the native hook surfaces have been intentionally disabled. Remediation: make the plugin honor `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` as an alias or canonical flag and add a parity test that exercises the shared disable contract across the plugin and native runtimes.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.08 (fresh D5 evidence found one new cross-runtime parity gap late in the loop, but most integration behavior remained unchanged)
- cumulative_p0: 0
- cumulative_p1: 11
- cumulative_p2: 9
- dimensions_advanced: [D5]
- stuck_counter: 0

## Next iteration focus
Advance D6 by spot-checking whether the advisor/plugin/parity test suites still leave mock-leakage or negative-path holes.
