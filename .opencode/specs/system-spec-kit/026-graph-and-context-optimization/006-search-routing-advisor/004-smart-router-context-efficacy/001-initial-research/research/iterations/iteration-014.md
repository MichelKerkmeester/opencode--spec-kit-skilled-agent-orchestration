# Iteration 014 - Plugin Install and Operator Workflow

## Focus Questions

V8, V9

## Tools Used

- OpenCode plugin pattern synthesis
- Hook reference setup review

## Sources Queried

- `.opencode/plugins/spec-kit-compact-code-graph.js`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md`

## Findings

- The advisor plugin should be installable by copying or enabling a single plugin file plus bridge file under `.opencode/plugins/`, then referencing it from OpenCode plugin configuration using the repo's existing plugin loading conventions. (sourceStrength: moderate)
- Operator setup should require `npm run --workspace=@spec-kit/mcp-server build` before plugin enablement, because Phase 020 runtime hooks also require compiled server output. (sourceStrength: primary)
- The plugin should fail open: if the bridge file, Node binary, Python, advisor script, skill graph, or compiled server is unavailable, the plugin injects nothing and reports details only through status tooling. (sourceStrength: moderate)
- Settings should include conservative defaults: `enabled: true`, `cacheTtlMs: 5000`, `bridgeTimeoutMs: 1000-3000`, `maxTokens: 80`, `confidenceThreshold: 0.8`, `uncertaintyThreshold: 0.35`, `nodeBinary: process.env.SPEC_KIT_PLUGIN_NODE_BINARY || "node"`. (sourceStrength: moderate)
- The install guide should preserve per-runtime native hook docs for Claude/Gemini/Copilot/Codex; OpenCode plugin packaging is additive, not a replacement for those runtime adapters. (sourceStrength: moderate)

## Novelty Justification

This pass specified install assumptions, defaults, fail-open behavior, and relationship to Phase 020 runtime adapters.

## New Info Ratio

0.24

## Next Iteration Focus

Evaluate naming, options, and telemetry contracts.
