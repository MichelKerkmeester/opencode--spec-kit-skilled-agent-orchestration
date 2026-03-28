# P2 Deferred Agent 2 Summary

## Scope

Implemented the four deferred P2 fixes inside the allowed ownership set under `.opencode/skill/system-spec-kit/mcp_server/`.

## Changes

1. `lib/storage/lineage-state.ts`
   - Added a conflict-aware retry loop around lineage insert writes.
   - Retries up to 3 times when `UNIQUE(logical_key, version_number)` conflicts occur.
   - On retry, re-reads the latest lineage row for the logical key and inserts with `latest.version_number + 1`.
   - Logs each retry attempt.

2. `handlers/shared-memory.ts`
   - `handleSharedMemoryEnable()` now requires caller identity.
   - Reuses the shared admin auth path and rejects non-admin callers with `shared_memory_enable_admin_required`.
   - Preserves existing internal-error handling after auth succeeds.

3. Graph-walk rollout docs
   - Removed the unsupported `full` rollout state from owned documentation.
   - Kept the supported set aligned to `off`, `trace_only`, `bounded_runtime`.

4. Shared-memory default docs
   - Corrected owned documentation to show `SPECKIT_MEMORY_SHARED_MEMORY` defaulting to `false`.
   - Tightened the inline capability comment to match runtime/docs.

## Tests Added/Updated

- `tests/memory-lineage-state.vitest.ts`
  - Added coverage for the version-conflict retry path when two supersedes target the same predecessor.

- `tests/shared-memory-handlers.vitest.ts`
  - Added coverage for unauthenticated `shared_memory_enable`.
  - Added coverage for non-admin `shared_memory_enable`.
  - Updated the internal-error test to use an authenticated admin caller.

## Verification

Focused regression checks:

- `TMPDIR=$PWD/.tmp/vitest-tmp npx vitest run tests/memory-lineage-state.vitest.ts tests/shared-memory-handlers.vitest.ts`
  - Passed: `33 passed`

Requested commands:

- `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit 2>&1 | tail -5`
  - Produced no tailed output because of the pipe-to-`tail`.
  - Separate raw `npx tsc --noEmit` check still reports pre-existing type errors in `handlers/causal-graph.ts` outside this task's ownership.

- `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR=$PWD/.opencode/skill/system-spec-kit/mcp_server/.tmp/vitest-tmp npx vitest run 2>&1 | tail -15`
  - Completed with existing non-scope suite failures.
  - Tail summary: `9 failed | 319 passed | 1 skipped`, `33 failed | 8754 passed | 74 skipped | 26 todo`.

## Notes

- I did not modify `tool-schemas.ts` or schema files outside the owned file list.
- Handler enforcement is in place now; schema-surface changes, if still needed for end-to-end tool argument validation, must be handled by the owner of the schema files.
