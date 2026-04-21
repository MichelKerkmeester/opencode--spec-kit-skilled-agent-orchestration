# Iteration 001 - Correctness

## Scope

Audited production implementation files claimed by the packet metadata and implementation summaries:

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts`

Spec docs were read only to determine the production-code scope. Findings below cite code/test files only.

## Verification

- Vitest: PASS, `../scripts/node_modules/.bin/vitest run tests/graph-metadata-schema.vitest.ts ../scripts/tests/graph-metadata-backfill.vitest.ts --reporter=default` from `mcp_server` reported 2 files and 25 tests passing.
- Git log checked for the scoped implementation files. Recent history includes `77b0f59e20`, `9d18b61f50`, `77f7bc5aba`, `1bdd1ed035`, and prior graph-metadata remediation commits.
- Grep/Glob checks used for parser/backfill/test symbols and graph-metadata call sites.

## Findings

### IMPL-P1-001 - Backfill aborts the entire corpus when one existing graph-metadata.json is invalid

Severity: P1

Dimension: correctness

Evidence:

- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:206` starts the per-folder loop.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:208` calls `loadGraphMetadata(graphPath)` without a per-folder guard.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:214` derives or refreshes only after that load succeeds.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:397` reads the existing metadata file.
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:401` throws on validation failure.

Expected behavior for a corpus backfill is to process all remaining packets and report invalid existing graph metadata as per-packet failures or review flags. Actual behavior is that one invalid existing file throws before the loop can continue, so later packets are neither refreshed nor counted. This is especially relevant because the packet summary itself records that unrelated invalid manual relationship arrays blocked a full-corpus backfill before being normalized.

## Delta

- New findings: 1
- Carried findings: 0
- Severity-weighted new findings ratio: 1.00
- Churn: 1.00
