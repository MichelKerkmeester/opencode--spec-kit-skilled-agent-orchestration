# Iteration 1 (Codex 5.3): Context-Server + Checkpoint Safety Analysis

## Agent
Model: gpt-5.3-codex | Reasoning: high

## Focus
Context-server appendAutoSurfaceHints behavior, checkpoint confirmName safety, and test coverage gap analysis (Q3, Q4)

## Findings

### 1. [HIGH] Test contract gap for checkpoint_delete confirmName
`context-server.vitest.ts` tests for checkpoint delete only require `name`, not `confirmName`, so this suite would not catch a regression that removes `confirmName` from type contracts.
- [SOURCE: context-server.vitest.ts:1131, tools/types.ts:230-232, tool-schemas.ts:324]

### 2. [MEDIUM] Response object mutation risk in after-tool callbacks
After-tool callbacks receive the same mutable `result` object asynchronously. A callback can mutate response content/context after the main pipeline has prepared it.
- [SOURCE: context-server.ts:174, 176, 330]

### 3. [MEDIUM] Latency risk around hint appending is unbounded
Only pre-dispatch auto-surface is checked against 250ms (NFR-P01). The append + reparse + token-count sync can do repeated JSON serialize/parse cycles with no dedicated p95 guard.
- [SOURCE: context-server.ts:312, 314, 335, 343, 356; response-hints.ts:30, 39, 103]

### 4. [LOW] confirmName allows whitespace-only names
`confirmName` is strict for empty/null/case mismatch, but whitespace-only or unnormalized names pass if both fields match exactly.
- [SOURCE: checkpoints.ts:287, 290, 293, 107]

## Confirmed Behaviors (No Issues)
- `appendAutoSurfaceHints` called at correct position (before token-budget enforcement) [context-server.ts:334, 339]
- `autoSurfacedContext` is preserved on successful responses [context-server.ts:336]

## Test Coverage Gaps
- hooks-ux-feedback.vitest.ts: Missing large-payload latency tests, duplicate-append/idempotency tests, mixed-type hint-array edge cases
- context-server.vitest.ts: No explicit ordering assertion for appendAutoSurfaceHints vs budget enforcement, no runtime isError branch test, no >250ms warning test, confirmName contract gap

## Tests Run
Both suites pass: 344/344 tests across hooks-ux-feedback.vitest.ts and context-server.vitest.ts
