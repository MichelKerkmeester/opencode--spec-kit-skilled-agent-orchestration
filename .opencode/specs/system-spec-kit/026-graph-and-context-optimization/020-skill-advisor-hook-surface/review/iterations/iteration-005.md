# Iteration 005 — Dimension(s): D5

## Scope this iteration
Reviewed D5 Integration + Cross-runtime because the default rotation for iteration 5 selects D5. I focused on the OpenCode plugin/bridge, four runtime hook adapters, Codex policy probing, runtime parity tests, and the 200-prompt corpus parity surface.

## Evidence read
- .opencode/plugins/spec-kit-skill-advisor.js:158 → OpenCode plugin bridge execution is centralized in `runBridge`.
- .opencode/plugins/spec-kit-skill-advisor.js:171 → timeout handler starts a timer around the child process.
- .opencode/plugins/spec-kit-skill-advisor.js:176 → timeout handler sends `SIGTERM` to the bridge child.
- .opencode/plugins/spec-kit-skill-advisor.js:181 → timeout handler resolves the hook response immediately after marking fail-open.
- .opencode/plugins/spec-kit-skill-advisor.js:212 → child `close` handler is ignored after the timeout path has already settled.
- .opencode/plugins/spec-kit-skill-advisor.js:291 → OpenCode prompt submission path returns model-visible `additionalContext`.
- .opencode/plugins/spec-kit-skill-advisor-bridge.mjs:93 → bridge imports the compiled advisor producer and renderer.
- .opencode/plugins/spec-kit-skill-advisor-bridge.mjs:103 → bridge builds the advisor brief with runtime `codex`.
- .opencode/plugins/spec-kit-skill-advisor-bridge.mjs:113 → bridge renders through the shared advisor renderer.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156 → Claude uses the shared producer and renderer dependency seam.
- .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:170 → Gemini uses the shared producer and renderer dependency seam.
- .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:196 → Copilot uses the shared producer and renderer dependency seam.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:253 → Codex uses the shared producer and renderer dependency seam.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:107 → Codex accepts argv JSON when stdin is empty.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:166 → Codex makes stdin canonical when present.
- .opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:159 → Codex policy detector first probes `codex --version`.
- .opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:184 → Codex policy detector then probes `codex hooks list`.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:21 → runtime parity suite covers Claude, Gemini, Copilot, and Codex.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:119 → canonical fixtures must produce identical visible brief text across all runtime variants.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:38 → corpus parity test points at the shipped 200-prompt corpus path.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:83 → corpus parity suite loads the corpus before comparing direct CLI and hook output.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:84 → corpus parity suite asserts the corpus has exactly 200 rows.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:111 → corpus parity suite fails on any top-1 mismatch.
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:161 → plugin test covers bridge timeout fail-open behavior.
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:173 → plugin timeout test asserts only `SIGTERM` is sent to the child.
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:176 → plugin timeout test validates `last_error_code=TIMEOUT`.
- .opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:107 → Codex tests cover both stdin and argv being present.
- .opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:127 → Codex tests verify stdin wins over argv.
- .opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:102 → Copilot SDK path returns model-visible `additionalContext`.
- .opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:133 → Copilot wrapper fallback creates an in-memory prompt preamble.
- .opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:173 → Copilot tests reject notification-only success as model-visible injection.
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/graph-metadata.json:43 → graph metadata lists a corpus path under `research/019-system-hardening-001-initial-research-005-routing-accuracy`.
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/graph-metadata.json:55 → graph metadata repeats that stale corpus path in the derived entity entry.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-005-01, dimension D5, OpenCode plugin timeout path does not ensure the bridge child actually exits. Evidence: .opencode/plugins/spec-kit-skill-advisor.js:171 starts the timeout, .opencode/plugins/spec-kit-skill-advisor.js:176 sends `SIGTERM`, .opencode/plugins/spec-kit-skill-advisor.js:181 resolves the hook immediately with fail-open output, and .opencode/plugins/spec-kit-skill-advisor.js:212 ignores the eventual `close` event because `settled` is already true. The only timeout test asserts `child.kill` was called with `SIGTERM` at .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:173 and validates the timeout status at .opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:176. Impact: a stuck or SIGTERM-ignoring bridge process can outlive the prompt hook in a long-running OpenCode host, creating resource leakage and making later status telemetry report fail-open while the child is still running. Remediation: after timeout, wait briefly for child exit and escalate to `SIGKILL` or explicitly unref/cleanup the process, with a test covering the non-closing child branch.

### P2 (Suggestion)
id P2-005-01, dimension D5, renderer harness graph metadata points at the retired corpus location. Evidence: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/graph-metadata.json:43 lists `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl`, and .opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/graph-metadata.json:55 repeats the same path in the entity record. The active parity suite uses `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl` at .opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:38, asserts 200 rows at .opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:84, and fails on any mismatch at .opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:111. Impact: graph/search consumers following the metadata get a dead corpus pointer even though the runtime test harness is correct. Remediation: refresh the spec folder metadata so `key_files` and entity paths match the shipped `019-system-hardening-pt-03` corpus location.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.64 (first D5 pass read fresh plugin, bridge, four-runtime hook, Codex policy, parity, and corpus evidence; it found one required plugin lifecycle issue and one metadata drift suggestion)
- cumulative_p0: 0
- cumulative_p1: 4
- cumulative_p2: 3
- dimensions_advanced: [D5]
- stuck_counter: 0

## Next iteration focus
Advance D6 Test coverage + test-code quality by inventorying the advisor/runtime/plugin/telemetry Vitest suites and spot-checking mock leakage and fixture staleness.
