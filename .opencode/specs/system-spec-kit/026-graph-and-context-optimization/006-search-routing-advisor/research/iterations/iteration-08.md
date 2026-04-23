## Iteration 08

### Focus
OpenCode adapter-tier boundary drift: whether the plugin packet's documentation still matches the tested OpenCode hook contract.

### Findings
- The Phase 023 implementation summary documents the plugin lifecycle with `onSessionStart`, `onUserPromptSubmitted`, and `onSessionEnd`. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/implementation-summary.md:117-123`
- The plugin tests assert the actual OpenCode hook contract is `event`, `experimental.chat.system.transform`, and `tool`, and explicitly assert that the old lifecycle names are absent. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:126-135`
- The same tests show the advisor brief is injected through the system-transform output, which confirms the tested runtime path differs from the packet's prose description. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:138-145`
- This is an adapter-tier boundary issue inside the same phase: runtime behavior and tests are aligned, but the implementation summary still points operators at obsolete hook names. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/implementation-summary.md:117-126`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:126-145`

### New Questions
- Are any operator docs or setup snippets copied from the stale lifecycle names in the implementation summary?
- Does the bridge/plugin code itself still contain compatibility shims for the older names, or is the drift documentation-only?
- Should the packet closeout docs be amended to reflect the `experimental.chat.system.transform` contract explicitly?
- Are there similar adapter-tier drifts in the live-session wrapper setup docs?

### Status
new-territory
