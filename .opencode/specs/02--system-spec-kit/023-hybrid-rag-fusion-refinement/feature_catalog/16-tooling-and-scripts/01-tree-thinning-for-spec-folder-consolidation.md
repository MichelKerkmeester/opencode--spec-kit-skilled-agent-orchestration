# Tree thinning for spec folder consolidation

## Current Reality

A bottom-up merge strategy thins small files during spec folder context loading. Files under 200 tokens have their summary merged into the parent document. Files under 500 tokens use their content directly as the summary, skipping separate summary generation.

Memory file thresholds differ: under 100 tokens for content-as-summary, 100-300 tokens for merged-into-parent, 300+ tokens kept as-is. The `applyTreeThinning()` function runs in `workflow.ts` at Step 7.6 before pipeline stages and is applied to the rendered context payload. Stats track total files, thinned count, merged count and tokens saved.

## Source Metadata

- Group: Tooling and scripts
- Source feature title: Tree thinning for spec folder consolidation
- Summary match found: Yes
- Summary source feature title: Tree thinning for spec folder consolidation
- Current reality source: feature_catalog.md
