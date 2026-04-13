# Iteration 006: Backfill Contract Replay

## Focus
Compared the shipped backfill script, the dedicated regression suite, and the phase-004 packet docs to see whether they tell the same default-traversal story.

## Findings

### P0

### P1
- **F002**: Backfill verification still targets the pre-refactor active-only default — `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:78` — the script is inclusive by default, but the dedicated backfill test still expects archived packets to be skipped unless explicitly included, and phase `004-normalize-legacy-files` still documents that stale active-only behavior. The current backfill test run fails 2 of 3 cases in exactly that direction. [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:7] [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:107] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:78] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:95] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/004-normalize-legacy-files/tasks.md:6] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/004-normalize-legacy-files/implementation-summary.md:39]

```json
{"type":"claim-adjudication","findingId":"F002","claim":"Backfill verification still targets the old active-only default instead of the shipped inclusive default.","evidenceRefs":[".opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:7",".opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:78",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-continuity-research/003-graph-metadata-validation/004-normalize-legacy-files/tasks.md:6"],"counterevidenceSought":"Reran the dedicated backfill test and reread the aligned operator docs to see whether only one surface was stale.","alternativeExplanation":"This could have been documentation-only drift, but the executable regression suite fails in the same direction as the stale phase-004 packet docs.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Update the regression suite and packet docs, then rerun the backfill lane green against the current inclusive-default behavior."}
```

### P2

## Ruled Out
- Inclusive default being documented but unimplemented: the runtime script and aligned operator docs agree on the current contract.

## Dead Ends
- The failing backfill test is not a transient environment problem; the assertion mismatch is deterministic and reproduces immediately.

## Recommended Next Focus
Run strict validation on root 003 and inspect the 001-004 closeout docs to see whether the packet tree itself is actually complete.

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, traceability
- Novelty justification: This pass added a second must-fix issue backed by executable regression evidence and stale phase-local docs.
