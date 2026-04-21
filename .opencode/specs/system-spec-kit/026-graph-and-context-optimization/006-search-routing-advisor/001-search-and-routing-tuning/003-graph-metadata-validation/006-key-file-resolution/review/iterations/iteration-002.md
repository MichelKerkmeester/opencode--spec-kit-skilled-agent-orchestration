# Iteration 002 - Security

## Scope

Reviewed key-file filtering and resolution in `graph-metadata-parser.ts`, focused tests in `graph-metadata-schema.vitest.ts`, and the security checklist claim.

## Findings

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| DR-SEC-001 | P1 | Embedded parent-directory segments can escape intended key-file lookup roots. `keepKeyFile()` rejects candidates starting with `../`, but not paths such as `a/../../target.ts`; `buildKeyFileLookupPaths()` then applies `path.resolve()` under multiple roots without a containment check. | `graph-metadata-parser.ts:557`, `graph-metadata-parser.ts:730`, `graph-metadata-parser.ts:747`, `checklist.md:18` |

## Notes

The risk requires a malicious or malformed packet reference, but it contradicts the checklist's claim that resolution stays bounded. Add segment normalization/rejection plus a regression test for embedded `..` segments.

## Convergence

New findings ratio: `0.40`. Continue.
