# Iteration 012 — Dimension(s): D5

## Scope this iteration
This iteration followed the default rotation to D5 integration and cross-runtime behavior. The pass re-verified the Phase 025 fixes around shared disable-flag parity, plugin bridge shutdown and cache invalidation, five-runtime parity coverage, and the Codex integration path.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:121-129` → Claude short-circuits on `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`, emits skipped diagnostics, and does not continue into brief generation.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:135-143` → Gemini applies the same shared disable flag before producer execution.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:161-169` → Copilot SDK/wrapper routing shares the same disable-flag gate in `buildRenderedBrief()`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:218-226` → Codex native hook also exits early on the shared disable flag.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:116-130` → Codex wrapper fallback only activates when native hooks are unavailable and still honors the shared disable flag.
- `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:145-210` → Codex policy detection is cached per process and distinguishes `live`, `partial`, and `unavailable` hook support from explicit version/hooks probes.
- `.opencode/skill/system-spec-kit/mcp_server/tests/codex-hook-policy.vitest.ts:35-131` → Regression coverage exercises live, partial, timeout, and cached policy paths for the Codex detector.
- `.opencode/plugins/spec-kit-skill-advisor.js:19-20` → Plugin defines both the shared `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` flag and the legacy plugin-specific flag.
- `.opencode/plugins/spec-kit-skill-advisor.js:50-60` → Plugin disable logic accepts the shared hook flag first and preserves the legacy env fallback.
- `.opencode/plugins/spec-kit-skill-advisor.js:64-80` → Plugin cache identity incorporates an advisor source signature derived from bridge/render/subprocess artifacts.
- `.opencode/plugins/spec-kit-skill-advisor.js:215-225` → Bridge timeout escalates from `SIGTERM` to `SIGKILL` after one second if the subprocess has not exited.
- `.opencode/plugins/spec-kit-skill-advisor.js:291-304` → Plugin cache keys include the source signature and repopulate only on successful bridge results.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-164` → Plugin tests verify the shared disable flag returns null context and surfaces `disabled_reason=SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:178-195` → Timeout coverage asserts both `SIGTERM` and `SIGKILL` fire and the plugin fail-opens with `TIMEOUT`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:264-273` → Source-signature change coverage forces a cache miss across plugin instances.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:32-35` → Runtime variants explicitly include `copilot-wrapper` and `opencode-plugin` in addition to the four core runtimes.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:185-219` → Parity coverage runs the plugin variant and asserts identical visible brief text across Claude, Gemini, Copilot, Codex, wrapper, and plugin outputs.
- `.opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts:99-117` → Claude hook test confirms the disable flag prevents producer invocation.
- `.opencode/skill/system-spec-kit/mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts:103-120` → Gemini hook test confirms the same shared disable-flag behavior.
- `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:186-201` → Copilot hook test confirms the same shared disable-flag behavior.
- `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:156-177` → Codex hook test confirms the same shared disable-flag behavior.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:37-45` → The corpus parity test is pinned to the Phase 019 hardening corpus path under the 026 research tree.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:76-85` → Corpus parity still requires exactly 200 prompts before comparing direct CLI and hook top-1 results.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl:1` → The referenced corpus file exists at the pinned path and contains labeled routing prompts.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-004 remains closed.** All four runtime hooks and the Codex wrapper now honor the shared `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` gate, the OpenCode plugin escalates timed-out bridge children from `SIGTERM` to `SIGKILL`, cache keys are invalidated by source-signature changes, and the parity harness continues to treat the plugin as a fifth runtime with identical visible brief output across the cross-runtime surface (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:121-129`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:135-143`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:161-169`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:218-226`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:116-130`, `.opencode/plugins/spec-kit-skill-advisor.js:19-20`, `.opencode/plugins/spec-kit-skill-advisor.js:50-60`, `.opencode/plugins/spec-kit-skill-advisor.js:64-80`, `.opencode/plugins/spec-kit-skill-advisor.js:215-225`, `.opencode/plugins/spec-kit-skill-advisor.js:291-304`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-164`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:178-195`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:264-273`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:32-35`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:185-219`).

## Metrics
- newInfoRatio: 0.03
- cumulative_p0: 0
- cumulative_p1: 1
- cumulative_p2: 1
- dimensions_advanced: [D5]
- stuck_counter: 0

## Next iteration focus
Rotate to D6 and spot-check whether the expanded parity, plugin, and telemetry suites still leave any fixture-staleness or mock-isolation gaps.
