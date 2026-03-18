---
title: "Watcher delete/rename cleanup"
description: "Watcher delete/rename cleanup purges stale index entries when memory files are deleted or renamed on disk."
---

# Watcher delete/rename cleanup

## 1. OVERVIEW

Watcher delete/rename cleanup purges stale index entries when memory files are deleted or renamed on disk.

When you delete or rename a file on your computer, the search index needs to clean up the old entry so it does not show stale results. This feature handles that cleanup automatically. Without it, you could search and find references to files that no longer exist, like a phone book that still lists people who have moved away.

---

## 2. CURRENT REALITY

The chokidar-based file watcher (`lib/ops/file-watcher.ts`) handles more than just add/change events. When a watched memory file is deleted or renamed, the watcher receives an `unlink` event and invokes the configured `removeFn` callback to purge the corresponding memory index entry, BM25 tokens and vector embedding from the database. This prevents orphaned index entries from appearing in search results after a file is moved or removed on disk.

Rename detection is handled as an unlink followed by an add, which means the memory gets a fresh index entry at the new path while the old entry is cleaned up. The 2-second debounce window collapses rapid rename sequences into a single reindex cycle.

Scenario coverage is defined in `mcp_server/tests/file-watcher.vitest.ts`, which exercises unlink cleanup, rename lifecycle handling, debounce behavior, burst rename deduplication and concurrent rename handling.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/ops/file-watcher.ts` | Lib | Filesystem watcher with delete/rename handling |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/file-watcher.vitest.ts` | Covered scenarios: delete/unlink callback (removeFn invocation), rename lifecycle (unlink+add pair, old-entry cleanup, new-entry creation), debounce stress (rapid rename sequence collapsed to single reindex), burst rename deduplication, concurrent rename handling |

---

## 4. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: Watcher delete/rename cleanup
- Current reality source: audit-D04 gap backfill
