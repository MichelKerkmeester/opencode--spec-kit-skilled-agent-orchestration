# Iteration 005 — Dimension(s): D5

## Scope this iteration
This iteration reviewed the Phase-025 D5 integration surfaces across the OpenCode plugin, the bridge-backed Codex adapter path, and the runtime-parity harness. The goal was to confirm DR-P1-004 is closed end-to-end and to look for any residual cross-runtime mismatch introduced by the remediation.

## Evidence read
- `.opencode/plugins/spec-kit-skill-advisor.js:19-27` -> the plugin now tracks the shared disable flag and hashes the bridge plus shipped advisor dist artifacts into the source-signature set.
- `.opencode/plugins/spec-kit-skill-advisor.js:50-52` -> `envDisablesPlugin()` honors both `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` and the legacy plugin-only opt-out.
- `.opencode/plugins/spec-kit-skill-advisor.js:64-80` -> `advisorSourceSignature()` fingerprints each shipped advisor artifact by path, mtime, and size so host-side cache keys roll when the advisor payload changes.
- `.opencode/plugins/spec-kit-skill-advisor.js:214-225` -> bridge timeouts escalate from `SIGTERM` to `SIGKILL` after one second instead of leaving the child process hanging.
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:93-128` -> the bridge still calls `buildSkillAdvisorBrief(... runtime: 'codex' ...)` and returns prompt-safe metadata, preserving the Codex integration path through the same renderer contract.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-195` -> plugin tests assert the shared disable flag bypasses spawn and timeout handling sends both `SIGTERM` and `SIGKILL` while fail-opening cleanly.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:264-274` -> plugin tests also verify source-signature changes invalidate the host cache instead of reusing stale advisor output.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-220` -> the parity harness includes `opencode-plugin` alongside Claude, Gemini, Copilot, Codex, and the Copilot wrapper, and asserts identical visible brief text across all variants.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl:1` -> the routing-accuracy corpus still contains 200 labeled prompts, matching the documented parity corpus size.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-004 (D5) remains closed.** The OpenCode plugin now respects the shared disable flag, escalates bridge timeouts to `SIGKILL`, keys its cache with a source signature derived from the shipped advisor artifacts, and is exercised as a first-class runtime in the parity harness (`.opencode/plugins/spec-kit-skill-advisor.js:19-27`, `.opencode/plugins/spec-kit-skill-advisor.js:50-52`, `.opencode/plugins/spec-kit-skill-advisor.js:64-80`, `.opencode/plugins/spec-kit-skill-advisor.js:214-225`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:93-128`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-195`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:264-274`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-220`).

## Metrics
- newInfoRatio: 0.12
- cumulative_p0: 0
- cumulative_p1: 0
- cumulative_p2: 0
- dimensions_advanced: [D5]
- stuck_counter: 0

## Next iteration focus
Rotate to D6 and spot-check whether the expanded negative-path and parity tests leave any residual coverage or fixture-staleness gaps.
