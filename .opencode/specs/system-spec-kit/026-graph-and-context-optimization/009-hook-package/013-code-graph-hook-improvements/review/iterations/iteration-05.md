## Iteration 05

### Focus

Startup runtime parity claims versus the packet's direct regression coverage.

### Files Audited

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/tasks.md:67-76`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/implementation-summary.md:55-104`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/resource-map.md:162-169`

### Findings

- `[P2][coverage] .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/implementation-summary.md:67-74 claims startup contract updates shipped across Claude, Gemini, Copilot, and Codex, but .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/resource-map.md:164-168 only records direct startup hook regressions for Claude and Codex.`
- `[P2][completeness] .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/tasks.md:74 names Gemini and Copilot adapters inside T011's parity contract, but the packet's test inventory never shows equivalent packet-local assertions for those two runtimes.`
- `[P2][verification-drift] .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/implementation-summary.md:99-102 reports startup parity inside a five-file Vitest sweep, which leaves Gemini/Copilot parity resting on implementation symmetry rather than explicit regression coverage.`

### Evidence

```md
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts` | Startup payload contract section |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts` | Startup payload contract banner transport |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts` | Claude startup payload contract regression |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts` | Codex startup payload contract regression |
```

### Recommended Fix

- Add packet-local Gemini and Copilot startup hook regressions, or narrow the closeout language so the packet does not claim parity beyond the runtimes with direct test evidence.
Target files:
`.opencode/skill/system-spec-kit/mcp_server/tests/`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/implementation-summary.md`
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/013-code-graph-hook-improvements/resource-map.md`

### Status

new-territory
