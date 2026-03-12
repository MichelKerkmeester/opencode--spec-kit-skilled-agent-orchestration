# Tree thinning for spec folder consolidation

## Current Reality

Tree thinning is a pre-pipeline token-reduction step for spec-folder consolidation. `applyTreeThinning()` classifies files by token count, keeps larger files intact, uses content-as-summary for medium files, and merges small files into parent-level summaries.

Integration happens in `scripts/core/workflow.ts` at Step 7.6, where rendered file changes are transformed into thinning inputs, processed through `applyTreeThinning()`, and then applied back to the effective file set before downstream retrieval/scoring logic.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/core/tree-thinning.ts` | Core script (primary) | Tree thinning model and implementation (`applyTreeThinning()`, thresholds, parent merges) |
| `scripts/core/workflow.ts` | Core workflow (integration) | Step 7.6 integration (`applyTreeThinning()` and `applyThinningToFileChanges()`) |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/tree-thinning.vitest.ts` | Tree-thinning thresholds, merge behavior, boundary handling, and invariants |

## Source Metadata

- Group: Tooling and scripts
- Source feature title: Tree thinning for spec folder consolidation
- Current reality source: feature_catalog.md
