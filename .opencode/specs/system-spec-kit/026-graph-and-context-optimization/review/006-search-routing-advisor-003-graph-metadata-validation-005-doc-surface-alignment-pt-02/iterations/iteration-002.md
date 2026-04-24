# Iteration 002 - Security

## Scope

Audited the backfill script for injection, path traversal, write-boundary, and denial-of-service risk. Read supporting write-boundary code in the graph metadata parser because non-dry-run writes delegate there.

## Verification

- Vitest: PASS, `scripts/tests/graph-metadata-backfill.vitest.ts` 3/3.
- Git history checked: `22c1c33a94`, `254461c386`.

## Findings

### DRIMPL-P2-005 - Traversal is synchronous and unbounded for operator-supplied roots

Severity: P2

Evidence:

- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:121`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:137`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:144`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:148`

`collectSpecFolders` recursively walks every non-excluded directory below the selected root using synchronous filesystem calls. There is no maximum depth, maximum folder count, elapsed-time budget, or explicit guard against accidentally broad roots. This is not an external exploit, but it is a local operator denial-of-service risk for a maintenance script.

## Non-Findings

- No command injection path found: the script does not shell out.
- No secret handling found.
- Non-dry-run writes delegate to graph metadata refresh/write helpers rather than constructing write commands directly.

## Convergence

New findings ratio: 0.20. Continue.
