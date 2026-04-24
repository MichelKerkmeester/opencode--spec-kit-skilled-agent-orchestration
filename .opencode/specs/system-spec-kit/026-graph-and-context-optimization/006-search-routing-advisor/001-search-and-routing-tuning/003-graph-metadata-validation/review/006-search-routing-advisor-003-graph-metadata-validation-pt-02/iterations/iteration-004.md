# Iteration 004 - Testing

## Scope

Reviewed the packet-owned Vitest files for coverage of the implementation claims. The pass focused on whether assertions cover both archive traversal branches and failure behavior.

## Verification

- Vitest: PASS, 2 files and 25 tests.
- Git log checked for scoped backfill implementation and tests.
- Grep/read checks inspected archive/future traversal coverage.

## Findings

### IMPL-P2-004 - Backfill tests name z_future coverage but only create z_archive fixtures

Severity: P2

Dimension: testing

Evidence:

- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:27` treats both `z_archive` and `z_future` as archive-like path segments.
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:60` creates the only archive-like fixture.
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:61` makes that fixture a `z_archive` packet.
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:78` says the default traversal includes archived and future folders.
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:117` says active-only skips archived packets.

The production regex covers both `z_archive` and `z_future`, and the test name claims future coverage, but the fixture tree never creates a `z_future` packet. A regression that accidentally drops or mishandles `z_future` could still pass all packet-owned backfill tests.

## Carried Findings

- IMPL-P1-001 remains open.
- IMPL-P2-002 remains open.
- IMPL-P2-003 remains open.

## Delta

- New findings: 1
- Carried findings: 3
- Severity-weighted new findings ratio: 0.10
- Churn: 0.25
