# Iteration 005 — Dimension(s): D5

## Scope this iteration
Reviewed cross-runtime integration surfaces beyond the four prompt hooks, with emphasis on the OpenCode plugin/bridge path and parity coverage. Focused on whether the plugin honors the same routing thresholds and runtime contract as the shipped hook stack.

## Evidence read
- `.opencode/plugins/spec-kit-skill-advisor.js:13-16` → plugin defaults include `DEFAULT_THRESHOLD_CONFIDENCE = 0.7`.
- `.opencode/plugins/spec-kit-skill-advisor.js:35-39` and `:51-60` → plugin normalizes configured threshold confidence and uses the 0.7 default when none is supplied.
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:86-90` and `:102-113` → bridge also falls back to `0.7` and forwards that into `buildSkillAdvisorBrief(... thresholdConfig.confidenceThreshold ...)`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:112-127` → core producer defaults to `confidence >= 0.8` and `uncertainty <= 0.35` when no explicit threshold config is passed.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:21-24` and `:114-136` → runtime parity coverage includes Claude, Gemini, Copilot, Codex, and Copilot wrapper fallback, but not the plugin path.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:78-118` → plugin tests exercise cache behavior and bridge status, but not parity against the core hook thresholds.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
[P1-005-01] [D5] OpenCode plugin defaults to a looser confidence threshold than the core hook stack
- **Evidence**: `.opencode/plugins/spec-kit-skill-advisor.js:13-16`; `.opencode/plugins/spec-kit-skill-advisor.js:51-60`; `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:86-90`; `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:102-113`; `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:112-127`
- **Impact**: The plugin path can surface a recommendation at `0.70 <= confidence < 0.80` that the main prompt-hook stack would suppress. That breaks cross-runtime parity for the same workspace and prompt, and it makes plugin-vs-hook behavior depend on transport rather than on one routing policy.
- **Remediation**: Promote one canonical default threshold constant and reuse it in both the plugin bridge and the core producer. Add an explicit parity test that compares plugin output against the hook renderer on the same fixture set.

### P2 (Suggestion)
None.

## Metrics
- newInfoRatio: 0.63 (new D5 evidence plus one plugin parity finding)
- cumulative_p0: 0
- cumulative_p1: 3
- cumulative_p2: 0
- dimensions_advanced: [D5]
- stuck_counter: 0

## Next iteration focus
Advance D6 test coverage next by checking whether the current suites cover the plugin path, measurement harness, and privacy/parity edge cases that the shipped code now depends on.
