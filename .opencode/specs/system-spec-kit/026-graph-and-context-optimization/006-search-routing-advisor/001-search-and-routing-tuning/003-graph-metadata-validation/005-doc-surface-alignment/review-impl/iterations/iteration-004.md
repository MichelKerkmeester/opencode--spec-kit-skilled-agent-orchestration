# Iteration 004 - Testing

## Scope

Audited the scoped test file against the production paths that produced findings in iterations 001-003.

## Verification

- Vitest: PASS, `scripts/tests/graph-metadata-backfill.vitest.ts` 3/3.
- Git history checked: `22c1c33a94`, `254461c386`.

## Findings

### DRIMPL-P1-003 - Regression tests cover happy-path backfill but not failure paths

Severity: P1

Evidence:

- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:89`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:126`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:208`
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:77`
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:126`

The test file covers default inclusive traversal, write behavior, and explicit `activeOnly` traversal. It does not assert invalid roots, malformed `--root` argument order, unreadable folders, or corrupt existing `graph-metadata.json` behavior. Those are the exact paths where the implementation currently fails open or aborts the whole batch.

## Convergence

New findings ratio: 0.20. All four dimensions have now been covered once. Continue for the requested 10-iteration artifact contract.
