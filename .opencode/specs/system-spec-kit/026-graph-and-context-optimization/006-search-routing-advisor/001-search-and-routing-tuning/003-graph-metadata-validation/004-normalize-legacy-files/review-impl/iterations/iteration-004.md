# Iteration 004 - Testing

## Scope

Audited:
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`

## Verification

- Scoped vitest: PASS, `1` file and `3` tests.
- Grep checked all direct references to `collectSpecFolders`, `runBackfill`, `--active-only`, and `--include-archive`.

## Findings

### IMPL-TST-001 - P2 - Tests cover direct API options but not the CLI flag contract

Evidence:
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:78` covers default direct traversal.
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:95` covers direct non-dry-run backfill.
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:117` covers direct `activeOnly: true`.
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:70` keeps CLI parsing inside non-exported `parseArgs`.

Impact:
The regression suite does not directly verify the supported CLI flags, especially `--include-archive`, missing `--root` values, and unknown arguments.

Suggested fix:
Either export the parser for unit coverage or add subprocess-level tests for `--active-only`, `--include-archive`, bare `--root`, and unknown flags.

## Delta

New findings: P2: 1.

