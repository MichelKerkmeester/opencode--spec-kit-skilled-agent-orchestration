# Iteration 010 — Lifecycle Hook Surface

Date: 2026-04-09

## Research question
Should `system-spec-kit` promote command-phase lifecycle hooks as first-class extension points instead of relying mainly on response and mutation hooks?

## Hypothesis
Babysitter's richer lifecycle hooks will show that `system-spec-kit` can become more observable and extensible if command phases emit first-class lifecycle events instead of only post-processing results.

## Method
I reviewed Babysitter's runtime hook calls and hook type definitions, then compared them with `system-spec-kit`'s exported hook surface and mutation-hook handling.

## Evidence
- Babysitter emits runtime hooks on run start, iteration start, run complete, run fail, and iteration end from the execution path itself. [SOURCE: external/packages/sdk/src/runtime/createRun.ts:73-94] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:57-68] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:88-101] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:126-139] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:156-168]
- Hook types are formalized as named lifecycle events with explicit payload contracts such as `on-run-start`, `on-run-complete`, `on-iteration-start`, `on-iteration-end`, and `on-breakpoint`. [SOURCE: external/packages/sdk/src/hooks/types.ts:7-22] [SOURCE: external/packages/sdk/src/hooks/types.ts:46-115]
- `system-spec-kit`'s exported hook surface currently centers on memory auto-surface helpers, session tracking, mutation feedback, and response hints. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4-25]
- Its mutation-hook handler is focused on cache invalidation after writes, not on command-phase lifecycle extensibility. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20-105]

## Analysis
Babysitter's hook design matters because hooks fire from the same path that enforces the workflow. That makes observability, notifications, metrics, and approvals extensions of the orchestration engine rather than bolt-on post-processors. [SOURCE: external/packages/sdk/src/runtime/createRun.ts:73-94] [SOURCE: external/packages/sdk/src/runtime/orchestrateIteration.ts:57-68] [SOURCE: external/packages/sdk/src/hooks/types.ts:7-22]

`system-spec-kit` already has useful hook-style helpers, but they are narrower and later in the lifecycle. If the project adds runtime-enforced workflow phases or a headless runner, it will also need a richer lifecycle hook surface so external tooling can observe and react to phase boundaries consistently. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4-25] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20-105]

## Conclusion
confidence: high

finding: `system-spec-kit` should grow from response/mutation hooks into a command-phase lifecycle hook surface for workflow init, iteration dispatch, approval handling, convergence, synthesis, and save. This is a strong fit with the other Babysitter-inspired recommendations because hooks become much more valuable once workflows are more deterministic.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/mcp_server/hooks/`, `.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`, and `.opencode/command/spec_kit/assets/*.yaml`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a lifecycle event vocabulary and decide which events belong to command workflows versus MCP handlers
- **Priority:** should-have

## Counter-evidence sought
I looked for existing command-lifecycle hook contracts in `system-spec-kit` comparable to `on-run-start` or `on-iteration-end` and found response and mutation hooks, but not a phase-lifecycle contract. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4-25] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20-105]

## Follow-up questions for next iteration
- Which lifecycle hooks should be mandatory before any headless runner prototype ships?
- Should lifecycle hooks write into the proposed event journal or remain derived outputs?
- How should cross-phase research prompts encode the difference between orchestration research and transport research?
