# Tree thinning for spec folder consolidation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. IN SIMPLE TERMS](#5--in-simple-terms)

## 1. OVERVIEW

Tree thinning reduces token counts before spec-folder consolidation by classifying files and merging small ones into parent-level summaries.

## 2. CURRENT REALITY

Tree thinning is a pre-pipeline token-reduction step for spec-folder consolidation. `applyTreeThinning()` classifies files by token count, keeps larger files intact, uses content-as-summary for medium files and merges small files into parent-level summaries.

Integration happens in `scripts/core/workflow.ts` at Step 7.6, where rendered file changes are transformed into thinning inputs, processed through `applyTreeThinning()` and then applied back to the effective file set before downstream retrieval/scoring logic.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/core/tree-thinning.ts` | Core script (primary) | Tree thinning model and implementation (`applyTreeThinning()`, thresholds, parent merges) |
| `scripts/core/workflow.ts` | Core workflow (integration) | Step 7.6 integration (`applyTreeThinning()` and `applyThinningToFileChanges()`) |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/tree-thinning.vitest.ts` | Tree-thinning thresholds, merge behavior, boundary handling and invariants |

## 4. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: Tree thinning for spec folder consolidation
- Current reality source: feature_catalog.md

## 5. IN SIMPLE TERMS

Before the system processes a project folder, it trims down the content to a manageable size. Large files stay as they are, medium ones get condensed and small ones get merged together. Think of it like packing a suitcase: you keep the big items, fold the medium ones and bundle the small items into one bag so everything fits.
