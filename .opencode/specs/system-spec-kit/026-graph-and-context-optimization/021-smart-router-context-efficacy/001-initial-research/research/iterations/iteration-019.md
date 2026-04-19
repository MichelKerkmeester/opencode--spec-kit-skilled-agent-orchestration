# Iteration 019 - Final Plugin Recommendation

## Focus Questions

V8, V9, V10

## Tools Used

- Architecture synthesis from plugin pattern and risk register

## Sources Queried

- `.opencode/plugins/spec-kit-compact-code-graph.js`
- `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs`
- `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts`
- Iterations 007-015

## Findings

- Recommendation: implement the advisor as a thin OpenCode plugin plus bridge, not as a direct import into OpenCode, because the bridge pattern already solves native-module ABI risk. (sourceStrength: primary)
- First hook target should be a prompt/message context injection surface that can prepend or append sanitized advisor context before model planning. It should not mutate user prompt text unless the host lacks safer context fields. (sourceStrength: moderate)
- The plugin should share the Phase 020 renderer and advisor producer rather than creating a new recommendation format. New format drift would weaken cross-runtime parity. (sourceStrength: primary)
- The plugin should ship with one diagnostic tool and no write-capable tools. This keeps the plugin packaging bounded to context routing, not spec or memory mutation. (sourceStrength: moderate)
- Default rollout should be opt-in or guarded by feature flag for one packet, then default-on only after OpenCode replay telemetry confirms no measurable slowdown and no prompt leakage. (sourceStrength: moderate)

## Novelty Justification

This pass finalized the plugin recommendation and rollout posture.

## New Info Ratio

0.08

## Next Iteration Focus

Convergence check and synthesis finalization.
