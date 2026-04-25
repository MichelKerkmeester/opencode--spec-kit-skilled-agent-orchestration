# Iteration 019 — Dimension(s): D5

## Scope this iteration
This iteration followed the default D5 rotation and re-checked the Phase 025 integration surfaces around the OpenCode plugin, cross-runtime parity harness, Codex integration, and corpus-backed parity coverage. The goal was to confirm the documented D5 fixes stayed closed while probing for residual cache-boundary issues introduced by the new plugin path.

## Evidence read
- `.opencode/plugins/spec-kit-skill-advisor.js:29-37` → the plugin keeps a process-global `advisorCache` and shared runtime counters outside the exported factory.
- `.opencode/plugins/spec-kit-skill-advisor.js:114-125` → `cacheKeyForPrompt()` hashes only prompt, threshold, maxTokens, and `sourceSignature`, then prefixes `sessionID`; it does not include `projectDir` or any workspace identifier.
- `.opencode/plugins/spec-kit-skill-advisor.js:290-313` → `getAdvisorContext()` computes the cache key before calling the bridge and returns the cached response directly on hits.
- `.opencode/plugins/spec-kit-skill-advisor.js:332-357` → each plugin instance captures its own `projectDir` from `ctx.directory`, but `onUserPromptSubmitted()` passes that workspace only into `getAdvisorContext()`.
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:103-128` → the bridge passes `input.workspaceRoot` into `buildSkillAdvisorBrief()`, so advisor output is workspace-dependent.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:239-274` → regression coverage proves session isolation and source-signature invalidation, but there is no assertion that separate plugin `ctx.directory` values get separate cache entries.
- `.opencode/plugins/spec-kit-skill-advisor.js:19-20` → the plugin still defines both the shared hook-disable env var and the legacy plugin-disable env var.
- `.opencode/plugins/spec-kit-skill-advisor.js:50-60` → `envDisablesPlugin()` and `disabledEnvName()` still honor `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:120-129` → Claude hook still short-circuits on `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:134-143` → Gemini hook still short-circuits on `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:160-169` → Copilot hook still short-circuits on `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:217-226` → Codex hook still short-circuits on `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-194` → plugin tests still assert shared-env disable behavior and SIGTERM-to-SIGKILL timeout escalation.
- `.opencode/plugins/spec-kit-skill-advisor.js:64-80` → `advisorSourceSignature()` still fingerprints the shipped bridge/build/render/subprocess artifacts.
- `.opencode/plugins/spec-kit-skill-advisor.js:215-225` → plugin timeout handling still escalates from `SIGTERM` to `SIGKILL`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-218` → parity harness still includes `opencode-plugin` alongside Claude, Gemini, Copilot, Codex, and the Copilot wrapper.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:76-85` → corpus parity test still asserts a 200-prompt corpus before comparing direct CLI vs hook top-1 outputs.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
**P1-019-01 (D5): The OpenCode plugin cache is not scoped by workspace, so one repository can receive another repository's cached advisor brief when the same session/prompt/config tuple is reused across plugin instances.** Evidence: the cache is process-global (`.opencode/plugins/spec-kit-skill-advisor.js:29-37`), the cache key omits `projectDir`/workspace and uses only `sessionID`, prompt, threshold, maxTokens, and `sourceSignature` (`.opencode/plugins/spec-kit-skill-advisor.js:114-125`), and cached hits return immediately before the bridge sees `projectDir` (`.opencode/plugins/spec-kit-skill-advisor.js:290-313`). Yet each plugin instance captures its own `projectDir` from `ctx.directory` (`.opencode/plugins/spec-kit-skill-advisor.js:332-357`), and the bridge feeds `workspaceRoot` into `buildSkillAdvisorBrief()`, making the resulting brief workspace-dependent (`.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:103-128`). The current tests only cover session and source-signature isolation, not cross-workspace isolation (`.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:239-274`). Impact: in a long-lived OpenCode process or harness that instantiates the plugin for multiple repos, the second workspace can receive stale skill recommendations computed for the first workspace, which breaks repository-local routing correctness and undermines the new plugin parity surface. Remediation: include a normalized workspace identifier in the plugin cache key and add a regression test that instantiates two plugin contexts with different `ctx.directory` values but the same session/prompt to prove cache separation.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-004 remains closed for shared disable-flag parity and teardown escalation.** The plugin still honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, every shipped runtime hook still short-circuits on that same flag, and the plugin timeout path still escalates from `SIGTERM` to `SIGKILL` with regression coverage asserting both signals (`.opencode/plugins/spec-kit-skill-advisor.js:19-20`, `.opencode/plugins/spec-kit-skill-advisor.js:50-60`, `.opencode/plugins/spec-kit-skill-advisor.js:215-225`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:120-129`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:134-143`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:160-169`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:217-226`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-194`).
- **DR-P1-004 remains closed for source-signature invalidation.** The plugin still fingerprints the bridge/build/render/subprocess artifacts into `advisorSourceSignature()`, and the dedicated regression still proves a changed source signature forces a cache miss (`.opencode/plugins/spec-kit-skill-advisor.js:64-80`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:264-274`).
- **The 5-runtime/plugin parity and 200-prompt corpus checks remain wired.** The parity suite still compares the plugin alongside the four runtime hooks and wrapper path, and the corpus parity test still asserts the 200-row labeled corpus before executing direct CLI vs hook comparisons (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-218`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:76-85`).

## Metrics
- newInfoRatio: 0.05
- cumulative_p0: 0
- cumulative_p1: 5
- cumulative_p2: 3
- dimensions_advanced: [D5]
- stuck_counter: 0

## Next iteration focus
Rotate to D6 and check whether the current Vitest coverage actually exercises the new cross-workspace plugin cache boundary and other post-025 negative paths.
