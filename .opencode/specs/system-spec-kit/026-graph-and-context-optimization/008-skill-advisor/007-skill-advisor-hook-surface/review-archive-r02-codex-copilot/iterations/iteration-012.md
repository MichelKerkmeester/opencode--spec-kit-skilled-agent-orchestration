# Iteration 012 — Dimension(s): D5

## Scope this iteration
Reviewed D5 Integration + Cross-runtime because the default rotation for iteration 12 lands on D5. I focused on fresh parity-harness, plugin-bridge, and plugin-test evidence to check whether the shipped OpenCode plugin is covered by the same cross-runtime guarantees as Claude, Gemini, Copilot, and Codex.

## Evidence read
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:21 → the runtime parity harness enumerates only `claude`, `gemini`, `copilot`, and `codex`.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:121 → the parity variants add only `copilot-wrapper`, then assert identical visible brief text across those variants.
- .opencode/plugins/spec-kit-skill-advisor.js:291 → the shipped OpenCode plugin exposes model-visible advisor output through `onUserPromptSubmitted`.
- .opencode/plugins/spec-kit-skill-advisor-bridge.mjs:93 → the OpenCode bridge builds and renders advisor output through its own bridge path using compiled dist imports.
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:78 → the dedicated plugin suite exercises cache-hit, status, disable, and timeout behavior rather than cross-runtime parity against the native hook outputs.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
id P2-012-01, dimension D5, the shipped OpenCode plugin is outside the runtime parity harness, so bridge/runtime drift can ship without tripping the advertised cross-runtime comparator. Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:21 defines the parity runtime list as only `claude`, `gemini`, `copilot`, and `codex`, and .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:121 limits the asserted variants to those four plus `copilot-wrapper`. The OpenCode plugin still emits model-visible advisor context through `.opencode/plugins/spec-kit-skill-advisor.js:291` and routes it through a separate bridge path at `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:93` and `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:113`. Fresh test evidence shows the dedicated plugin suite at `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:78`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:120`, and `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:161` covers cache/status/timeout behavior, but not parity against native hook output. Impact: the OpenCode bridge can diverge from the shared renderer contract while `advisor-runtime-parity.vitest.ts` still passes, weakening the stated hook-surface parity claim for the full shipped integration set. Remediation: extend the parity harness (or add a dedicated comparator test) to normalize plugin output and compare it against the same canonical fixtures used for the native runtimes.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.16 (fresh D5 evidence surfaced one new parity-gap suggestion, but most integration behavior remained consistent with earlier passes)
- cumulative_p0: 0
- cumulative_p1: 8
- cumulative_p2: 7
- dimensions_advanced: [D5]
- stuck_counter: 0

## Next iteration focus
Advance D6 Test coverage + test-code quality by spot-checking whether the parity and plugin suites leave additional mock or negative-path gaps.
