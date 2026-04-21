# Iteration 008 - Testing Stabilization

Focus: revisit test layout and packet-scoped verification.

Files read:
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`

Verification:
- Scoped vitest command passed.

Findings:
- No new finding.

Refinement:
- F006 remains active because the requested scoped tests mock the bridge at `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:8`, while real bridge behavior is tested outside scope at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:36`.
- The out-of-scope compat suite is useful, but it still does not assert that native bridge output respects configured thresholds or carries uncertainty.
