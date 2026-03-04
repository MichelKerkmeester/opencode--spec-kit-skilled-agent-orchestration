# Chunk collapse deduplication

## Current Reality

Duplicate chunk rows appeared in default search mode because the deduplication logic only ran when `includeContent=true`. Most queries use the default `includeContent=false` path, which means most users saw duplicates. The conditional gate was removed at the call site in `memory-search.ts` (not the function definition) so dedup runs on every search request regardless of content settings. A small fix, but one that affected every standard query.

## Source Metadata

- Group: Bug fixes and data integrity
- Source feature title: Chunk collapse deduplication
- Summary match found: Yes
- Summary source feature title: Chunk collapse deduplication
- Current reality source: feature_catalog.md
