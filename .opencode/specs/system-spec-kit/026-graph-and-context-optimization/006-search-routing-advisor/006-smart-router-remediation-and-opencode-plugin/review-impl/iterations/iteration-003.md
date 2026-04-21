# Iteration 003 - Robustness

Focus: robustness across the plugin, bridge, and telemetry module.

Files read:
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts`

Verification:
- Scoped vitest command passed.
- `npm run typecheck` in `.opencode/skill/system-spec-kit` exited 0.

Findings:

| ID | Severity | Finding | Code evidence |
| --- | --- | --- | --- |
| F004 | P2 | The plugin spawns the bridge with stderr piped but never attaches a stderr reader. The bridge intentionally forwards `console.log/info/debug/warn` to stderr while it protects stdout JSON. A noisy advisor dependency can fill the stderr pipe and make the bridge hang until the timeout, causing avoidable fail-open behavior. | `.opencode/plugins/spec-kit-skill-advisor.js:213`, `.opencode/plugins/spec-kit-skill-advisor.js:216`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:40`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:45` |
| F005 | P2 | Telemetry prompt state is stored in a process-global `Map` and only deleted by `finalizeSmartRouterCompliancePrompt()`. If a wrapper never finalizes a prompt, prompt/resource metadata can accumulate for the life of the process. | `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:57`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:254`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:299` |

Ruled out:
- The telemetry writer intentionally catches append errors, and that matches the observe-only behavior. I did not mark fail-open append behavior as a defect by itself.
