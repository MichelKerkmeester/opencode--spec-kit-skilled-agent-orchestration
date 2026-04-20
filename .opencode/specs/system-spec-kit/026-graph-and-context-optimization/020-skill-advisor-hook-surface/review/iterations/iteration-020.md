# Iteration 020 — Dimension(s): D6

## Scope this iteration
This iteration followed the default D6 rotation and audited the post-025 regression suite instead of the production code paths themselves. The focus was whether the new tests actually cover the risky plugin, subprocess, telemetry, and parity paths that Phase 025 claimed to close.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:67-69` → `makePlugin()` always instantiates the plugin with `{ directory: process.cwd() }`, so the suite never varies workspace roots.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:239-274` → cache regression coverage checks session isolation and source-signature invalidation only; there is no two-workspace cache test.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:185-191` → the parity harness builds the plugin variant with `SpecKitSkillAdvisorPlugin({ directory: process.cwd() }, ...)`, so parity also runs in a single workspace.
- `.opencode/plugins/spec-kit-skill-advisor.js:114-125` → `cacheKeyForPrompt()` hashes prompt, thresholds, maxTokens, and source signature, but not workspace.
- `.opencode/plugins/spec-kit-skill-advisor.js:280-302` → the bridge payload includes `workspaceRoot: projectDir`, proving the rendered brief is workspace-dependent while cache lookup happens before the bridge runs.
- `.opencode/plugins/spec-kit-skill-advisor.js:332-354` → plugin instances derive `projectDir` from `ctx.directory` and pass it into `getAdvisorContext()`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:140-236` → plugin negative-path tests still cover env disable, timeout escalation, spawn error, parse failure, and nonzero exit handling.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:83-195` → subprocess tests still cover JSON parse failure, invalid shape, nonzero exit, timeout kill, SQLITE_BUSY retry, and exhaustion.
- `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:261-271` → telemetry path-precedence coverage still asserts explicit path > env path > env dir ordering.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-218` → runtime parity still includes the `opencode-plugin` variant alongside the four runtime hooks and wrapper.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
**P1-020-01 (D6): The post-025 regression suite still does not exercise the plugin's cross-workspace cache boundary, so it cannot catch the live cross-repo cache bleed.** Evidence: the plugin test factory always uses `process.cwd()` for `ctx.directory` (`.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:67-69`), the cache-focused tests only vary `sessionId` and `sourceSignature` (`.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:239-274`), and the parity harness also runs the plugin from a single `process.cwd()` workspace (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:185-191`). Meanwhile, production behavior is workspace-sensitive because `ctx.directory` becomes `projectDir`, the bridge payload includes `workspaceRoot: projectDir`, and cache lookup still uses a key that omits workspace (`.opencode/plugins/spec-kit-skill-advisor.js:114-125`, `.opencode/plugins/spec-kit-skill-advisor.js:280-302`, `.opencode/plugins/spec-kit-skill-advisor.js:332-354`). Impact: the R03 post-remediation suite can pass even while a long-lived OpenCode host serves another repository's cached advisor brief, leaving the D5 defect with no regression guardrail. Remediation: add a regression that instantiates two plugin contexts with different directories but identical session/prompt/options and asserts separate cache entries / bridge invocations; keep that boundary in either the plugin suite or the parity harness.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P2-002 remains closed for plugin negative paths and subprocess error-code handling.** The plugin suite still covers disable, timeout, parse-fail, spawn-error, and nonzero-exit behavior, while the subprocess suite still covers parse/schema failures, timeout kill, and SQLITE_BUSY retry/exhaustion (`.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:140-236`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:83-195`).
- **DR-P2-002 remains closed for telemetry path precedence.** The telemetry suite still asserts the fixed precedence order of explicit output path, env path, then env dir (`.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts:261-271`).
- **DR-P2-002 remains closed for end-to-end parity wiring.** The parity suite still includes the `opencode-plugin` runtime in the shared visible-brief comparison matrix (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-218`).

## Metrics
- newInfoRatio: 0.04
- cumulative_p0: 0
- cumulative_p1: 6
- cumulative_p2: 3
- dimensions_advanced: [D6]
- stuck_counter: 0

## Next iteration focus
Rotate to D7 and verify that the post-025 documentation claims, commands, and referenced paths still match the current repo state.
