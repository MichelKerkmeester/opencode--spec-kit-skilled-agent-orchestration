# Checkpoint creation (checkpoint_create)

## Current Reality

Named snapshots capture the current memory state by serializing the `memory_index` table, `working_memory` table and vector embeddings from `vec_memories` into a gzip-compressed JSON blob stored in the `checkpoints` table. You can scope a snapshot to a specific spec folder if you only care about preserving one area of the system.

A maximum of 10 checkpoints are retained. When you create the 11th, the oldest is automatically purged. Each checkpoint records arbitrary metadata you provide, plus the current git branch from environment variables. The gzip compression keeps storage manageable even with large memory databases.

Checkpoints are the safety net for destructive operations. `memory_bulk_delete` auto-creates one before every bulk deletion. `checkpoint_restore` brings it all back. The cycle works because checkpoints include vector embeddings alongside metadata, so restored memories are immediately searchable without re-running embedding generation.

## Source Metadata

- Group: Lifecycle
- Source feature title: Checkpoint creation (checkpoint_create)
- Summary match found: No
- Current reality source: feature_catalog.md
