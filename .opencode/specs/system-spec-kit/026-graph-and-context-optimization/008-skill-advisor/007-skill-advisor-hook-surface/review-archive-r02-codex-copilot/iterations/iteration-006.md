# Iteration 006 — Dimension(s): D6

## Scope this iteration
Reviewed D6 Test coverage + test-code quality because the default rotation for iteration 6 selects D6. I inventoried the advisor/runtime/plugin/telemetry/measurement Vitest surface and spot-checked plugin bridge failure tests plus runtime parity fixtures for coverage holes.

## Evidence read
- Test inventory from `.opencode/skill/system-spec-kit/mcp_server/tests`: advisor-timing, advisor-corpus-parity, advisor-prompt-policy, advisor-subprocess, advisor-runtime-parity, advisor-freshness, advisor-prompt-cache, advisor-privacy, advisor-renderer, advisor-brief-producer, advisor-observability, codex-hook-policy, codex-user-prompt-submit-hook, codex-prompt-wrapper, codex-pre-tool-use, copilot-hook-wiring, copilot-compact-cycle, copilot-user-prompt-submit-hook, claude-user-prompt-submit-hook, gemini-user-prompt-submit-hook, smart-router-telemetry, smart-router-measurement, retry-budget-telemetry, retrieval-telemetry, shared-payload-advisor, opencode-plugin, and spec-kit-skill-advisor-plugin suites.
- .opencode/plugins/spec-kit-skill-advisor.js:148 → invalid bridge JSON maps to `PARSE_FAIL`.
- .opencode/plugins/spec-kit-skill-advisor.js:219 → plugin parses bridge stdout when the child closes.
- .opencode/plugins/spec-kit-skill-advisor.js:220 → nonzero child exit is handled separately from fail-open JSON.
- .opencode/plugins/spec-kit-skill-advisor.js:223 → nonzero child exit is normalized to `NONZERO_EXIT`.
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:161 → plugin tests cover bridge timeout fail-open behavior.
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:179 → plugin tests cover spawn error fail-open behavior.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-fixtures/ambiguousTopTwo.json → existing fixture models the top-two ambiguity payload with tokenCap 120.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:41 → renderer unit tests cover the ambiguous fixture directly.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:47 → renderer emits the ambiguous form only when `{ tokenCap: 120 }` is supplied.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:26 → runtime parity canonical fixtures list omits `ambiguousTopTwo.json`.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:119 → runtime parity only compares visible brief text for those canonical fixtures.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:123 → ambiguous rendering depends on the caller passing a token cap above the default.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:83 → corpus parity reads the shipped 200-prompt fixture.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:111 → corpus parity fails on any direct-CLI versus hook top-1 mismatch.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-brief-producer.vitest.ts:58 → producer tests reset advisor mocks and clear cache before each test.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:71 → subprocess tests cover JSON parse failure at the lower-level subprocess boundary.
- .opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts:86 → measurement tests clean temporary workspace roots after each test.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-observability.vitest.ts:62 → observability tests validate JSONL serialization excludes prompt-bearing fields.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
id P2-006-01, dimension D6, OpenCode plugin tests do not exercise two bridge fail-open normalization branches. Evidence: .opencode/plugins/spec-kit-skill-advisor.js:148 returns `PARSE_FAIL` for invalid JSON, and .opencode/plugins/spec-kit-skill-advisor.js:220 through .opencode/plugins/spec-kit-skill-advisor.js:223 normalizes nonzero child exits to `NONZERO_EXIT`; the plugin test file covers timeout at .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:161 and spawn error at .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:179, while parse failure is only covered at the lower subprocess layer in .opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:71. Impact: regressions in the OpenCode plugin's own bridge parser or nonzero-exit status reporting can slip past focused plugin tests even though status telemetry exposes those error codes. Remediation: add plugin-level cases for invalid bridge stdout and a child close with nonzero exit code, asserting null `additionalContext`, fail-open status, and prompt-safe `last_error_code`.

id P2-006-02, dimension D6, runtime parity coverage omits the existing top-two ambiguity fixture. Evidence: .opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:41 tests `ambiguousTopTwo.json`, .opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:47 proves the ambiguous output requires `{ tokenCap: 120 }`, and .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:123 makes that token-cap request the branch condition. The runtime parity suite's canonical fixture list at .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:26 omits `ambiguousTopTwo.json`, and its parity assertion at .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:119 only runs over that list. Impact: adapter-level regressions around ambiguity propagation can remain invisible even when renderer unit tests cover the branch in isolation. Remediation: include `ambiguousTopTwo.json` in runtime parity and assert the model-visible cross-runtime output uses the intended ambiguous form when the producer reports tokenCap 120.

### Re-verified (no new severity)
P1-002 remains explained by fresh D6 evidence: the renderer has an ambiguity fixture and branch coverage, but runtime parity does not exercise that fixture across adapters.

## Metrics
- newInfoRatio: 0.62 (first D6 pass read the test inventory plus fresh plugin, runtime parity, renderer, corpus parity, subprocess, measurement, and observability evidence; it found two test coverage suggestions)
- cumulative_p0: 0
- cumulative_p1: 4
- cumulative_p2: 5
- dimensions_advanced: [D6]
- stuck_counter: 0

## Next iteration focus
Advance D7 Documentation accuracy by checking published hook docs, skill-advisor README/catalog/playbook, live-session wrapper setup, and command path existence.
