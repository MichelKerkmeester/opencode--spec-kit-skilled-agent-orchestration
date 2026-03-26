---
title: "Checkpoint creation (checkpoint_create)"
description: "Covers the checkpoint creation tool that captures gzip-compressed memory state snapshots for rollback safety."
---

# Checkpoint creation (checkpoint_create)

## 1. OVERVIEW

Covers the checkpoint creation tool that captures gzip-compressed memory state snapshots for rollback safety.

This takes a snapshot of your entire knowledge base at a point in time, like a save point in a video game. If something goes wrong later (an accidental deletion or a bad import), you can restore back to this snapshot. The system keeps up to 10 snapshots and automatically removes the oldest one when you create a new one.

---

## 2. CURRENT REALITY

Named snapshots capture the current memory state by serializing all 21 tables listed in `CHECKPOINT_MANIFEST.snapshot` (`memory_index`, `vec_memories`, `vec_metadata`, `working_memory`, `causal_edges`, `weight_history`, `memory_history`, `mutation_ledger`, `memory_conflicts`, `memory_corrections`, `adaptive_signal_events`, `negative_feedback_events`, `learned_feedback_audit`, `session_learning`, `governance_audit`, `shared_spaces`, `shared_space_members`, `shared_space_conflicts`, `session_state`, `session_sent_memories`, `memory_summaries`) into a gzip-compressed JSON blob stored in the `checkpoints` table, not just a small core subset. The checkpoint metadata also records the manifest for the 7 derived tables in `CHECKPOINT_MANIFEST.rebuild` (`memory_lineage`, `active_memory_projection`, `memory_entities`, `entity_catalog`, `degree_snapshots`, `community_assignments`, `memory_fts`), so restore knows which tables must be regenerated rather than restored verbatim. You can scope a snapshot to a specific spec folder if you only care about preserving one area of the system.

A maximum of 10 checkpoints are retained. When you create the 11th, the oldest is automatically purged. Each checkpoint records arbitrary metadata you provide, plus the current git branch from environment variables. The gzip compression keeps storage manageable even with large memory databases.

Checkpoints are the safety net for destructive operations. `memory_bulk_delete` creates one by default before bulk deletion, unless explicitly skipped for lower-risk tiers. `checkpoint_restore` brings it all back. The cycle works because checkpoints include vector embeddings alongside metadata, so restored memories are immediately searchable without re-running embedding generation.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/checkpoints.ts` | Checkpoint handler: create, list, restore, delete orchestration |
| `mcp_server/lib/storage/checkpoints.ts` | Checkpoint storage: `CHECKPOINT_MANIFEST`, gzip serialization, table snapshotting, MAX_CHECKPOINTS purge |
| `mcp_server/core/db-state.ts` | Database state management and connection access |
| `mcp_server/lib/response/envelope.ts` | MCP success/error envelope helpers |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for checkpoint arguments |
| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `checkpoint_create` |
| `mcp_server/tools/lifecycle-tools.ts` | Lifecycle tool dispatcher for checkpoint tools |
| `mcp_server/utils/json-helpers.ts` | JSON utility helpers for snapshot serialization |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-checkpoints.vitest.ts` | Checkpoint handler validation |
| `mcp_server/tests/handler-checkpoints-edge.vitest.ts` | Checkpoint lifecycle edge coverage (create/list/restore/delete) |
| `mcp_server/tests/checkpoints-extended.vitest.ts` | Checkpoint extended tests |
| `mcp_server/tests/checkpoints-storage.vitest.ts` | Checkpoint storage tests |
| `mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts` | Checkpoint lifecycle integration |

---

## 4. SOURCE METADATA

- Group: Lifecycle
- Source feature title: Checkpoint creation (checkpoint_create)
- Current reality source: FEATURE_CATALOG.md
