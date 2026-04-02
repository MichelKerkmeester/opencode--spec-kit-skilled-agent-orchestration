# Iteration 020

## Scope
Independent verification command matrix.

## Verdict
findings

## Findings

### P0
1. Task-enrichment guardrail regression in runtime tests.
- Command:
  - `TMPDIR="$PWD/.tmp" npm run --workspaces=false test:task-enrichment`
- Evidence:
  - ../../../../skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:735
  - ../../../../skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1222

### P1
1. Root command surface breaks under current npm workspace behavior (`Missing script` for workspace-level dispatch).
- Commands:
  - `npm run typecheck`
  - `npm run test:task-enrichment`
- Workaround:
  - `npm run --workspaces=false typecheck`

2. Legacy extractor/loader suite failures.
- Command:
  - `node scripts/tests/test-extractors-loaders.js`

3. Naming-migration regression suite failures.
- Command:
  - `node scripts/tests/test-naming-migration.js`

4. Tests mutate tracked fixture content.
- Evidence:
  - ../../../../skill/system-spec-kit/scripts/test-fixtures/002-valid-level1/implementation-summary.md

### P2
1. CocoIndex daemon/client mismatch prevented semantic path checks in this slice.
- Evidence signature:
  - `Daemon version mismatch (daemon=0.2.3, client=0.2.10)`

## Passing checks observed
- `npm run build` passed in `system-spec-kit` workspace.
- `node scripts/tests/test-scripts-modules.js` passed.
- `npx vitest run tests/handler-memory-search.vitest.ts tests/mcp-response-envelope.vitest.ts` passed.
