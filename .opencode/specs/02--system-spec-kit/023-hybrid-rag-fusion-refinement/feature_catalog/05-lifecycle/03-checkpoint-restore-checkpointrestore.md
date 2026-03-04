# Checkpoint restore (checkpoint_restore)

## Current Reality

Restoring from a named checkpoint decompresses the gzip snapshot, validates every row against the database schema (a T107 fix that catches corrupted snapshots before they damage the database) and either merges with existing data or clears existing data first.

The `clearExisting` mode deserves explanation. When true, the entire restore runs inside a database transaction. If the restore encounters an error halfway through, the transaction rolls back and existing data is untouched. This atomicity guarantee (a T101 fix) is critical because clearing existing data and then failing to restore would leave you with an empty database and no way back.

When merging (the default), the system checks for duplicates using a logical key of `spec_folder + file_path + anchor_id`. Existing memories that match the logical key are skipped rather than duplicated.

After restore, all search indexes are rebuilt from scratch: the vector index is cleared and repopulated, the BM25 index is rebuilt from database content, the trigger matcher cache is refreshed and the constitutional cache is invalidated. This rebuild ensures that restored memories are immediately findable through every search channel.

## Source Metadata

- Group: Lifecycle
- Source feature title: Checkpoint restore (checkpoint_restore)
- Summary match found: No
- Current reality source: feature_catalog.md
