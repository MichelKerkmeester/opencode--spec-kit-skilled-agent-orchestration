# Generation-time duplicate and empty content prevention

## Current Reality

Two pre-write quality gates in `scripts/core/file-writer.ts` prevent empty and duplicate memory files at generation time, complementing the existing index-time dedup in `memory-save.ts`. The empty content gate (`validateContentSubstance`) strips YAML frontmatter, HTML comments, anchor markers, empty headings, table rows and empty list items, then rejects files with fewer than 200 characters of remaining substance. The duplicate gate (`checkForDuplicateContent`) computes a SHA-256 hash of the file content and compares it against all existing `.md` files in the target memory directory, rejecting exact matches.

Both gates run inside `writeFilesAtomically()` before the atomic write operation, after the existing `validateNoLeakedPlaceholders` check. Failures throw descriptive errors that halt the save and report which validation failed. This catches the two most common quality problems — SGQS-template-only files and repeated saves of identical content — at the earliest possible point. Always active with no feature flag.

## Source Metadata

- Group: Memory quality and indexing
- Source feature title: Generation-time duplicate and empty content prevention
- Current reality source: feature_catalog.md
