# F37 type-safety fix report

## Completed
- Removed `@ts-nocheck` from these files and applied type-safe updates without changing test intent:
  - `mcp_server/tests/unit-composite-scoring-types.vitest.ts`
  - `mcp_server/tests/unit-folder-scoring-types.vitest.ts`
  - `mcp_server/tests/unit-normalization-roundtrip.vitest.ts`
  - `mcp_server/tests/unit-normalization.vitest.ts`
  - `mcp_server/tests/unit-path-security.vitest.ts`
  - `mcp_server/tests/unit-transaction-metrics-types.vitest.ts`
  - `mcp_server/tests/working-memory-event-decay.vitest.ts`
  - `scripts/tests/progressive-validation.vitest.ts`
- Replaced explicit `any` usages in:
  - `mcp_server/tests/unit-composite-scoring-types.vitest.ts`
  - `mcp_server/tests/unit-tier-classifier-types.vitest.ts`
  - `scripts/tests/progressive-validation.vitest.ts`
- Added typed/explicit invalid-shape handling with `@ts-expect-error` where tests intentionally pass invalid normalization inputs.
- Added explicit catch binding typing in `mcp_server/tests/unit-transaction-metrics-types.vitest.ts`.
- Strengthened normalization fixtures by importing `Memory` / `MemoryDbRow` types and using typed key iteration.

## Skipped
- `mcp_server/tests/vector-index-impl.vitest.ts`
  - Removing `@ts-nocheck` surfaced more than 20 TypeScript errors (26 during workspace typecheck), so this file was skipped per instructions and restored unchanged.

## Validation
- Ran workspace typecheck: `cd .opencode/skill/system-spec-kit && npm run -s typecheck`
- Result: no remaining typecheck hits in the assigned fixed files; workspace still reports unrelated pre-existing errors outside this partition.
