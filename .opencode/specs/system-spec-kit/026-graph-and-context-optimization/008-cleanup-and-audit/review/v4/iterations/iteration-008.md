# Iteration 008: Maintainability pass on tests and mocks

## Focus
Maintainability review of save-pipeline and context-server test surfaces for stale comments, dead mocks, and residual drift from the cleanup.

## Findings
### P2 - Suggestion
- **F009**: `memory-save-pipeline-enforcement.vitest.ts` still carries a stale comment saying `isMemoryFile` checks for a `specs/*/memory/` pattern even though the runtime now rejects the retired `memory/` surface and classifies canonical spec documents instead. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:396]

## Ruled Out
- NF003 remains closed: the active `context-server.vitest.ts` mocks in this area target the session-snapshot structural bootstrap contract, not a retired `findMemoryFiles` seam. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1088] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1092] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1220]

## Dead Ends
- A direct search for `findMemoryFiles` in `context-server.vitest.ts` produced no hits, so the maintainability drift in this pass is limited to the stale save-pipeline comment rather than an active dead-mock dependency.

## Recommended Next Focus
Stabilization pass 1: rescan the open blockers and the broader command surfaces to confirm no additional P1 drift appears after full-dimension coverage.
