# Content-aware memory filename generation

## Current Reality

Memory filenames were previously derived solely from the spec folder name, producing identical slugs like `hybrid-rag-fusion-refinement.md` for every save in the same folder. The workflow now uses `enrichedTask` as the primary signal for slug/title generation in `generateContentSlug()`. In stateless mode, generic task strings can be enriched from the `spec.md` frontmatter title before slug generation. In JSON/file-backed mode, enrichment is explicitly disabled (behavior unchanged). Generic detection used by enrichment includes `implementation-and-updates`, and slug fallback still uses the generic terms list (`development-session`, `session-summary`, `session-context`, `session`, `context`, `implementation`, `work-session`).

The slug is lowercased, non-alphanumeric characters replaced with hyphens, collapsed, and truncated at a word boundary (hyphen) to a maximum of 50 characters. A minimum length of 8 characters ensures slugs are meaningful. This produces filenames like `04-03-26_17-25__sprint-019-impl-3-phases-81-files.md` instead of `04-03-26_17-25__hybrid-rag-fusion-refinement.md`. Always active with no feature flag.

## Source Metadata

- Group: Memory quality and indexing
- Source feature title: Content-aware memory filename generation
- Current reality source: feature_catalog.md
