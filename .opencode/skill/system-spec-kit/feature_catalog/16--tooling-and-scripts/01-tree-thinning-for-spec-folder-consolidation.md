---
title: "Tree thinning for spec folder consolidation"
description: "Tree thinning reduces token counts before spec-folder consolidation by classifying files and merging small ones into parent-level summaries."
---

# Tree thinning for spec folder consolidation

## 1. OVERVIEW

Tree thinning reduces token counts before spec-folder consolidation by classifying files and merging small ones into parent-level summaries.

Before the system processes a project folder, it trims down the content to a manageable size. Large files stay as they are, medium ones get condensed and small ones get merged together. Think of it like packing a suitcase: you keep the big items, fold the medium ones and bundle the small items into one bag so everything fits.

---

## 2. CURRENT REALITY

Tree thinning is a pre-pipeline token-reduction step for spec-folder consolidation. `applyTreeThinning()` classifies files by token count, keeps larger files intact, uses content-as-summary for medium files and merges small files into parent-level summaries.

The current runtime safeguards also bound aggressive merging: files below the small-file threshold of `150` tokens are eligible for parent merges, no merged parent may absorb more than `3` children, and overflow children are upgraded to `keep` instead of being folded into an oversized `(merged-small-files)` summary. Those safeguards now matter directly to session-capturing memory-save quality as well as consolidation token control.

Integration happens in `scripts/core/workflow.ts` at Step 7.6, where rendered file changes are transformed into thinning inputs, processed through `applyTreeThinning()` and then applied back to the effective file set before downstream retrieval/scoring logic.

---

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

---

## 4. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: Tree thinning for spec folder consolidation
- Current reality source: FEATURE_CATALOG.md
