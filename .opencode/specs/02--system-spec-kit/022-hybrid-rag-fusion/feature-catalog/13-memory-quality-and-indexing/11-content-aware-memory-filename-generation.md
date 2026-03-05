# Content-aware memory filename generation

## Current Reality

Memory filenames were previously derived solely from the spec folder name, producing identical slugs like `hybrid-rag-fusion-refinement.md` for every save in the same folder. The `generateContentSlug()` function in `scripts/utils/slug-utils.ts` now uses `implSummary.task` (the implementation task description available before filename construction) as the primary signal, falling back to the folder name only when the task is empty or matches a blocklist of generic terms (`development-session`, `session-summary`, `session-context`, `session`, `context`, `implementation`, `work-session`).

The slug is lowercased, non-alphanumeric characters replaced with hyphens, collapsed, and truncated at a word boundary (hyphen) to a maximum of 50 characters. A minimum length of 8 characters ensures slugs are meaningful. This produces filenames like `04-03-26_17-25__sprint-019-impl-3-phases-81-files.md` instead of `04-03-26_17-25__hybrid-rag-fusion-refinement.md`. Always active with no feature flag.

## Source Metadata

- Group: Memory quality and indexing
- Source feature title: Content-aware memory filename generation
- Current reality source: feature_catalog.md
