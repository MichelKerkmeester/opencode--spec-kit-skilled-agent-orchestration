# Memory metadata update (memory_update)

## Current Reality

You can change the title, trigger phrases, importance weight or importance tier on any existing memory by its numeric ID. The system verifies the memory exists, validates your parameters (importance weight between 0 and 1, tier from the valid enum) and applies the changes.

When the title changes, the system regenerates the vector embedding to keep search results aligned. This is a critical detail: if you rename a memory from "Authentication setup guide" to "OAuth2 configuration reference", the old embedding no longer represents the content accurately. Automatic regeneration fixes that.

By default, if embedding regeneration fails (API timeout, provider outage), the entire update rolls back with no changes applied. Nothing happens. With `allowPartialUpdate` enabled, the metadata changes persist and the embedding is marked as pending for later re-indexing by the next `memory_index_scan`. That mode is useful when you need to fix metadata urgently and can tolerate a temporarily stale embedding.

A pre-update hash snapshot is captured for the mutation ledger. Every update records the prior hash, new hash, actor and decision metadata for full auditability.

## Source Metadata

- Group: Mutation
- Source feature title: Memory metadata update (memory_update)
- Current reality source: feature_catalog.md
