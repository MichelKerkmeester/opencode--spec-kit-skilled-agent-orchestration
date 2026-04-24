# Iteration 005 - Correctness Stabilization

## Scope

Audited:
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`
- `.opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js`

## Verification

- Scoped vitest: PASS, `1` file and `3` tests.
- Source/dist parity checked for `parseArgs`, `activeOnly`, `collectSpecFolders`, and `runBackfill`.

## Findings

No new correctness findings.

Stabilization notes:
- The compiled runtime mirrors the source default: `.opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js:44` sets `activeOnly = false`, and `.opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js:146` defaults `runBackfill` to `activeOnly = false`.
- This reinforces IMPL-COR-001 as runtime behavior, not stale source-only text.

## Delta

New findings: none. Churn <= 0.05.

