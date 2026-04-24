# Iteration 007: Backfill Scope Reproducibility

## Focus
Compared the default dry-run backfill traversal against the active no-archive verification corpus.

## Findings

### P0

### P1

### P2
- **F001**: Default backfill dry-runs include archive and future packets by default — `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:16` — `collectSpecFolders()` skips only `memory`, `scratch`, `node_modules`, and dot-directories, so a raw dry-run refreshes `536` folders instead of the `360` active packets used to verify the zero-noise key-file result.

## Ruled Out
- A parser correctness issue in the predicate itself: the zero-noise active corpus result held once the verification scope matched the phase expectation.

## Dead Ends
- This does not invalidate the key-file sanitizer; it is a tooling and reproducibility concern.

## Recommended Next Focus
Run a skeptic pass on F001 and then close with packet-local rechecks.

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: maintainability, traceability
- Novelty justification: This was the first pass that tied the verification mismatch to one concrete backfill traversal rule.
