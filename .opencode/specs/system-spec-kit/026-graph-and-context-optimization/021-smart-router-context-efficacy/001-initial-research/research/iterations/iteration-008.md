# Iteration 008 - Advisor OpenCode Plugin Shape

## Focus Questions

V8, V9, V10

## Tools Used

- Synthesis from plugin reference and advisor hook reference
- Static API shape inference from OpenCode plugin tests

## Sources Queried

- `.opencode/plugins/spec-kit-compact-code-graph.js`
- `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts`

## Findings

- Proposed plugin name: `spec-kit-skill-advisor`. It should be a thin OpenCode plugin that injects the same compact advisor brief into OpenCode-native context surfaces without requiring users to hand-edit runtime hook JSON. (sourceStrength: moderate)
- Proposed files: `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`, tests under `mcp_server/tests/opencode-skill-advisor-plugin.vitest.ts`, and optional marketplace metadata if the repo adopts `.codex-plugin/plugin.json` packaging later. (sourceStrength: moderate)
- The bridge should call built server code such as `buildSkillAdvisorBrief(prompt, { runtime: "codex" | "opencode", workspaceRoot })` or a dedicated stable handler, then return a minimal JSON envelope containing `brief`, `status`, `freshness`, `metrics`, and sanitized diagnostics. (sourceStrength: moderate)
- Plugin options should include `enabled`, `cacheTtlMs`, `nodeBinary`, `bridgeTimeoutMs`, `maxTokens`, `confidenceThreshold`, `uncertaintyThreshold`, `confidenceOnly`, and possibly `semantic` only if CocoIndex availability is explicit. (sourceStrength: moderate)
- The plugin should expose a status tool similar to `spec_kit_compact_code_graph_status`, e.g. `spec_kit_skill_advisor_status`, reporting runtime readiness, cache entries, disabled state, last error, p95-ish local durations if tracked, and freshness state. (sourceStrength: moderate)
- Opt-out should preserve the Phase 020 `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` flag and add plugin-level `enabled: false` for OpenCode-specific rollback. (sourceStrength: moderate)

## Novelty Justification

This pass converted plugin reference architecture into a concrete advisor package proposal.

## New Info Ratio

0.56

## Next Iteration Focus

Risk register for plugin and advisor deployment.
