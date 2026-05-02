# Iteration 006 - Traceability Extension

## Scope

- Dimension: `traceability`
- Reviewed surfaces:
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/spec.md`
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md`
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md`
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/21-gemini-cli-hooks.md`
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/253-runtime-detection.md`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/README.md`
  - `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

## Findings

### P0

- None.

### P1

- None.

### P2

- P2-005: The root packet still frames Gemini CLI as a future hook-adapter candidate even though the shipped packet history and runtime surfaces now document Gemini-native hook delivery. The root spec still says Gemini remains `tool fallback by policy` and a `Hook adapter candidate` [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/spec.md:227], while the implementation summary records Phase 022 as shipped Gemini hook porting [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:120], the Gemini feature card describes live lifecycle hooks [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/21-gemini-cli-hooks.md:11] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/21-gemini-cli-hooks.md:13], and the runtime hook entrypoint exists as a real SessionStart injector [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:5]. This leaves the root packet behind current reality on one of its advertised runtime-support surfaces.
- P2-006: The cross-runtime fallback feature summary overstates hook parity by claiming Claude Code, Codex CLI, Copilot CLI, and Gemini CLI all use shell-script `session-prime.ts` hooks [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md:14]. The runtime detector still reports Codex as hook-unavailable [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:38] and treats Copilot and Gemini as config-driven rather than always-on [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:43] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:50]. The packet playbooks already describe the correct dynamic fallback model for Codex, Copilot, and Gemini [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md:18] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/253-runtime-detection.md:26], so the feature summary is now the stale mirror.
- P2-007: The root implementation summary undercounts the shipped structural tool surface by saying "Three MCP tools expose the graph" while the same sentence and canonical tool registrations include `code_graph_context` as a fourth public tool [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:94] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:988] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:1003] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:848] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:851]. The packet still points readers to the right feature family, but its root summary no longer gives a replayable count of the public structural interface.

## Notes

- The packet-local playbooks for cross-runtime fallback and runtime detection already reflect the current dynamic hook-policy model for Codex, Copilot, and Gemini [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md:18] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/253-runtime-detection.md:17].
- The extension pass added documentation-parity findings only; it did not uncover a runtime bug in the Gemini hook entrypoint or the runtime-detection logic.
