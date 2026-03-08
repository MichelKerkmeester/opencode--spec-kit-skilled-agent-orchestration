# Fix F33

## Completed work
- Removed `@ts-nocheck` from:
  - `handler-checkpoints.vitest.ts`
  - `handler-memory-ingest.vitest.ts`
  - `handler-memory-save.vitest.ts`
  - `handler-memory-triggers.vitest.ts`
  - `hybrid-search-context-headers.vitest.ts`
  - `hybrid-search-flags.vitest.ts`
- Replaced explicit `any` usage in:
  - `handler-checkpoints.vitest.ts` (`any[]` -> `unknown[]` for mock rest args)
  - `handler-memory-triggers.vitest.ts` (`any[]`/`any` -> structured `Array<Record<string, unknown>>`/`unknown`)
- Audited the remaining assigned files for `@ts-nocheck`, `any`, and untyped `catch` usage.

## Remaining items
Skipped for this pass due the 12-call cap and/or likely higher-effort follow-up work after preliminary diagnostics:
- `ground-truth.vitest.ts`
- `handler-causal-graph.vitest.ts`
- `handler-helpers.vitest.ts`
- `handler-memory-context.vitest.ts`
- `handler-memory-crud.vitest.ts`
- `handler-memory-search.vitest.ts`
- `handler-session-learning.vitest.ts`
- `hybrid-search.vitest.ts`
- `history.vitest.ts`
- `handler-memory-index.vitest.ts`

Likely follow-up themes:
- add `catch (error: unknown)` plus safe narrowing before reading `.message`/`.code`/`.name`
- replace remaining `any` declarations with concrete import-based types
- add targeted `// @ts-expect-error Testing invalid input shape` where invalid inputs are intentional test coverage
- decide whether some large files should be skipped under the `>20 errors` rule after project-aware typecheck

## Verification
- No project-aware typecheck or Vitest verification was run in this pass because the task hit the tool-call budget.

## Estimated remaining calls
- Approximately 4-6 additional tool calls to finish the remaining files responsibly.
