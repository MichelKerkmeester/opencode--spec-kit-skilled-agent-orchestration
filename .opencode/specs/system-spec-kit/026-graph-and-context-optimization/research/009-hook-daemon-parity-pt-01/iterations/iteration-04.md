## Iteration 04

### Focus
Copilot runtime detection and readiness reporting: does the operator-facing status surface actually detect Spec Kit Copilot parity, or just "some Copilot hook exists"?

### Findings
- `detectCopilotHookPolicy()` does not inspect `.claude/settings.local.json` at all. It scans `.github/hooks/*.json` for a `sessionStart` entry and returns `enabled` if any such entry exists. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:82`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:88`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:94`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:98`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:99`
- The repository does contain `.github/hooks/superset-notify.json` with Copilot `sessionStart` and `userPromptSubmitted` commands, so the detector can return `enabled` based on Superset hook presence alone. Evidence: `.github/hooks/superset-notify.json:3`, `.github/hooks/superset-notify.json:4`, `.github/hooks/superset-notify.json:7`, `.github/hooks/superset-notify.json:18`, `.github/hooks/superset-notify.json:21`
- That detection logic is now out of sync with the remediated docs, which say the effective Copilot writer path is the outer `.claude/settings.local.json` wrapper carrying top-level `type`/`bash`/`timeoutSec` fields. Evidence: `.opencode/skill/system-spec-kit/references/config/hook_system.md:22`, `.opencode/skill/system-spec-kit/references/config/hook_system.md:61`, `.opencode/skill/system-spec-kit/references/config/hook_system.md:67`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:27`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:64`
- The tests reinforce the stale detector contract: `cross-runtime-fallback.vitest.ts` still treats "repo hook config exists" as sufficient for Copilot hook readiness, without proving the Spec Kit wrapper is present. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:54`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:56`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:93`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:97`

### New Questions
- Should Copilot readiness be keyed to `.claude/settings.local.json` wrapper presence instead of `.github/hooks/*.json`?
- Is there still any supported path where `.github/hooks/*.json` alone should count as Spec Kit Copilot parity?
- Do the fallback tests need a fixture that differentiates "Superset-only Copilot hooks" from "Spec Kit Copilot wrapper installed"?
- Could this same false-positive pattern affect operator decisions elsewhere, such as startup recovery messaging?

### Status
converging
