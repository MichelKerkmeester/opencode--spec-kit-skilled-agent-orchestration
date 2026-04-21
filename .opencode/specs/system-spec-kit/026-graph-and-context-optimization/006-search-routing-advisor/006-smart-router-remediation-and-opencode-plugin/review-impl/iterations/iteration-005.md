# Iteration 005 - Correctness Stabilization

Focus: revisit correctness after testing evidence.

Files read:
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`

Verification:
- Scoped vitest command passed.
- Native bridge smoke run returned `Advisor: stale; use system-spec-kit 0.92/0.00 pass.`

Findings:
- No new finding.

Refinement:
- F001 remains active because the handler supports `confidenceThreshold` and `uncertaintyThreshold` options at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:165`, but the bridge native path does not pass them at `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:189`.
- F002 remains active because the native bridge string is hard-coded at `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:122`.
