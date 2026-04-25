## Iteration 02

### Focus
Threshold parity and recommendation-quality drift on the OpenCode plugin/bridge path.

### Findings
- The OpenCode plugin ships a different default confidence threshold from the native/hook stack: plugin default is `0.7`, while the native subprocess runner, docs, and Python shim default to `0.8`. Citation: `.opencode/plugins/spec-kit-skill-advisor.js:28`, `.opencode/plugins/spec-kit-skill-advisor.js:51`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts:79`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1613`.
- The plugin forwards `thresholdConfidence` into the bridge payload, but the native bridge path ignores it when it calls `handleAdvisorRecommend`, so the configured threshold only affects the legacy path. Citation: `.opencode/plugins/spec-kit-skill-advisor.js:306`, `.opencode/plugins/spec-kit-skill-advisor.js:312`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:191`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:236`.
- The bridge’s own feature catalog and tests encode the `0.7` OpenCode default, which means this is institutionalized drift rather than a one-off implementation oversight. Citation: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md:31`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:21`.
- Hook reference examples reinforce the split by showing `thresholdConfidence: 0.7` for the OpenCode bridge while documenting `--threshold` default `0.8` for the shared shim. Citation: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:136`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:154`.

### New Questions
- Should OpenCode follow the shared `0.8/0.35` Gate 2 default, or should every runtime accept an explicit common threshold source?
- Was the `0.7` OpenCode default meant as a product decision, or did it survive from an older plugin-only era?
- Should `advisor_recommend` expose the effective threshold it used so parity drift becomes operator-visible?
- Are there runtime tests that assert threshold parity across native, legacy, and plugin paths?

### Status
new-territory
