# Watcher delete/rename cleanup

## Current Reality

The chokidar-based file watcher (`lib/ops/file-watcher.ts`) handles more than just add/change events. When a watched memory file is deleted or renamed, the watcher receives an `unlink` event and invokes the configured `removeFn` callback to purge the corresponding memory index entry, BM25 tokens, and vector embedding from the database. This prevents orphaned index entries from appearing in search results after a file is moved or removed on disk.

Rename detection is handled as an unlink followed by an add, which means the memory gets a fresh index entry at the new path while the old entry is cleaned up. The 2-second debounce window collapses rapid rename sequences into a single reindex cycle.

Scenario coverage is defined in `mcp_server/tests/file-watcher.vitest.ts`, but watcher-suite reliability is currently being remediated by Agent R2; do not treat these checks as fully verified until that reliability work is merged and green.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/ops/file-watcher.ts` | Lib | Filesystem watcher with delete/rename handling |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/file-watcher.vitest.ts` | Declared scenarios: delete/unlink callback (removeFn invocation), rename lifecycle (unlink+add pair, old-entry cleanup, new-entry creation), debounce stress (rapid rename sequence collapsed to single reindex), burst rename deduplication, concurrent rename handling — verification status pending Agent R2 reliability fixes |

## Source Metadata

- Group: Tooling and scripts
- Source feature title: Watcher delete/rename cleanup
- Current reality source: audit-D04 gap backfill
