# Iteration 001 - Correctness

## Scope

Audited production code file:

- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`

Supporting test evidence:

- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts`

## Verification

- Vitest: PASS, `scripts/tests/graph-metadata-backfill.vitest.ts` 3/3.
- Git history checked: `22c1c33a94`, `254461c386`.
- Dry-run reproduction checked for missing root and malformed `--root` use.

## Findings

### DRIMPL-P1-001 - Unreadable or missing roots produce a successful zero-work backfill

Severity: P1

Evidence:

- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:126`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:129`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:148`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:239`

The traversal catches `readdirSync` failures and returns without recording an error. `collectSpecFolders` then returns an empty list, and `run()` prints the summary without setting a nonzero exit. A missing or unreadable root therefore looks like a successful backfill that found zero packets.

Reproduction:

`node .opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js --dry-run --root /tmp/speckit-missing-root-for-review` returned exit 0 with `totalSpecFolders: 0`.

### DRIMPL-P2-004 - `--root` consumes the next flag when its value is missing

Severity: P2

Evidence:

- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:89`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:90`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:91`

`parseArgs` treats `argv[index + 1]` as the root value without validating that it exists and is not another flag. `--root --active-only` resolves a path literally named `--active-only` and skips the intended `activeOnly` flag.

Reproduction:

`node .opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js --dry-run --root --active-only` returned `root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/--active-only`.

## Convergence

New findings ratio: 0.40. Continue.
