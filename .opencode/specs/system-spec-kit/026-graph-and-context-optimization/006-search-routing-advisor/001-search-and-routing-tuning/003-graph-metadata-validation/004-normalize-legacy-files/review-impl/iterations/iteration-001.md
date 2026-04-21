# Iteration 001 - Correctness

## Scope

Audited implementation code claimed by the packet:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | Backfill traversal and CLI implementation |
| `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts` | Regression coverage for traversal behavior |

## Verification

- Scoped vitest: PASS, `1` file and `3` tests.
- Git history checked: `git log` shows `22c1c33a94 fix(026): resolve all 7 deep review findings + keep backfill inclusive`, `23815c6958 fix(026): resolve all 15 review findings across 017-019`, and `77b0f59e20 feat(027/000): migrate scripts/ to ESM for Node 25 compat`.

## Findings

### IMPL-COR-001 - P1 - Backfill still defaults to archive-inclusive traversal

Evidence:
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:70` defines the parser return shape with `activeOnly`.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:73` initializes `activeOnly` to `false`.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:85` makes `--include-archive` set `activeOnly` to `false`, which is already the default.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:193` defaults `runBackfill(... activeOnly = false)`.
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:78` names the default test as archive-inclusive.
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:84` calls `runBackfill({ dryRun: true, root })` without `activeOnly` and expects archive-inclusive totals.

Impact:
If this packet's production intent is active-only traversal by default with deliberate archive opt-in, the shipped code has the wrong default branch and the tests lock in the opposite behavior.

Suggested fix:
Set `activeOnly` to `true` by default, make `--include-archive` the explicit opt-in to `false`, and invert the default traversal expectations in the test suite.

## Delta

New findings: P1: 1, P2: 0.

