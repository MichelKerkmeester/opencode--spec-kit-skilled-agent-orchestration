# Checkpoint restore (checkpoint_restore)

## Current Reality

Restoring from a named checkpoint decompresses the gzip snapshot, validates every row against the database schema (a T107 fix that catches corrupted snapshots before they damage the database) and either merges with existing data or clears existing data first.

The `clearExisting` mode deserves explanation. When true, the entire restore runs inside a database transaction. If the restore encounters an error halfway through, the transaction rolls back and existing data is untouched. This atomicity guarantee (a T101 fix) is critical because clearing existing data and then failing to restore would leave you with an empty database and no way back.

When merging (the default), the system checks for duplicates using a logical key of `spec_folder + file_path + anchor_id`. Existing memories that match the logical key are skipped rather than duplicated.

After restore, vectors are restored from the checkpoint snapshot when vector payloads are present. The restore handler then clears in-memory search/constitutional caches, rebuilds BM25 from live DB content when BM25 is enabled, and refreshes the trigger cache. This keeps restored memories immediately discoverable without forcing a full re-embedding pass.

## Source Metadata

- Group: Lifecycle
- Source feature title: Checkpoint restore (checkpoint_restore)
- Current reality source: feature_catalog.md
