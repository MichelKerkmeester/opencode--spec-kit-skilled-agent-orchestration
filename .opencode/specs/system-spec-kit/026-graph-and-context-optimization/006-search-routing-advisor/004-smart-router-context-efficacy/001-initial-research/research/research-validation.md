# Research Validation

## Decision Table

| ID | Call | Evidence | Limitation |
|----|------|----------|------------|
| V1_baseline | adopt-now | Static corpus upper-bound: mean 289,442 bytes, p50 217,001 bytes, p90 580,304 bytes. | Not direct transcript telemetry. |
| V2_with_hook_steering | adopt-now | Renderer and runtime parity tests emit compact advisor text across runtimes. | Does not prove assistant compliance. |
| V3_savings_quantification | adopt-now | Projected mean savings 289,122 bytes against upper-bound baseline. | Latency savings are inferred. |
| V4_miss_rate | prototype-later | Replay found 80 label mismatches to corpus labels. | Corpus labels may be stale; override behavior unmeasured. |
| V5_adversarial | adopt-now | Renderer suppresses prompt text, reason text, stdout/stderr, instruction-shaped labels, and newline labels. | Needs dedicated adversarial prompt corpus. |
| V6_cross_runtime | adopt-now | Runtime parity includes Claude, Gemini, Copilot, Codex, and Copilot wrapper. | Operator registration completeness varies. |
| V7_skip_skill_md | prototype-later | Prior artifact scan suggests skill reads are common. | No hook-era transcript proof of reduction. |
| V8_plugin_architecture | adopt-now | Working compact code-graph plugin provides bridge/caching/status pattern. | Advisor plugin still unimplemented. |
| V9_plugin_design | adopt-now | Proposed thin plugin, bridge, options, status tool, opt-out, and tests. | Needs implementation packet. |
| V10_risks | adopt-now | Existing fail-open, privacy, freshness, renderer, and cache controls map to risks. | Blind-following remains behavioral. |

## OpenCode Plugin Proposal

Name: `spec-kit-skill-advisor`.

Files:

- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/plugins/spec-kit-skill-advisor.manifest.json`
- `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-skill-advisor-plugin.vitest.ts`

Manifest:

- `id`: `spec-kit-skill-advisor`
- `entrypoint`: `.opencode/plugins/spec-kit-skill-advisor.js`
- `bridgeCommand`: `node .opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
- `hooks`: `onSessionStart`, `onUserPromptSubmitted`, `onSessionEnd`
- `tools`: `spec_kit_skill_advisor_status`
- `settings`: `enabled`, `cacheTTLMs`, `nodeBinaryOverride`, `bridgeTimeoutMs`, `maxTokens`, `thresholdConfidence`, `sourceSignatureOverride`
- `disable`: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` or `enabled: false`

Hook shape:

- Register `onUserPromptSubmitted(input)` as the prompt hook.
- Extract the submitted prompt from `input.prompt`, `input.text`, `input.userPrompt`, `input.message`, or equivalent nested request fields.
- Call the bridge with `{ prompt, workspaceRoot: ctx.directory, runtime: "codex", maxTokens, thresholdConfidence }`.
- Return `{ additionalContext: brief }` when the bridge status is `ok`; return `{ additionalContext: null }` for skipped, degraded, fail-open, disabled, or empty-prompt cases.
- Reuse Phase 020 `buildSkillAdvisorBrief()` and `renderAdvisorBrief()` inside the bridge.
- Do not persist prompts.
- Fail open on bridge, Python, SQLite, or freshness failures.

Settings:

- `enabled`
- `cacheTtlMs`
- `nodeBinary`
- `bridgeTimeoutMs`
- `maxTokens`
- `confidenceThreshold`
- `uncertaintyThreshold`
- `confidenceOnly`

Status tool:

- `spec_kit_skill_advisor_status`
- Reports plugin id, enabled state, cache TTL, bridge timeout, runtime readiness, freshness, cache entries, last sanitized error, invocation counts, cache hits, and fail-open count.

Install steps:

1. Build the MCP server: `npm run --workspace=@spec-kit/mcp-server build`.
2. Add plugin and bridge files under `.opencode/plugins/`.
3. Enable the plugin through OpenCode's plugin configuration.
4. Run plugin tests and advisor privacy/timing/parity tests.
5. Validate rollback with `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and plugin `enabled: false`.

## Measurement Follow-Up

Required before making strong production claims:

- Transcript-level file-read counts.
- Model-visible context bytes.
- First useful action latency.
- Advisor top-1 versus frozen gold labels.
- Assistant override quality on wrong or ambiguous advisor output.
- Cross-runtime replay for Claude, Gemini, Copilot, Codex, and OpenCode.
