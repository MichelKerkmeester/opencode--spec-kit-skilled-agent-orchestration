# S4.2 Checkpoint Restore Completeness Design

## Scope

This inventory covers the checkpointed memory store, not every SQLite table in the repo. Concretely, it includes tables created directly by `create_schema()` and its companion helpers in `vector-index-schema.ts`, plus the requested storage/runtime tables from `checkpoints.ts`, `causal-edges.ts`, `mutation-ledger.ts`, `access-tracker.ts`, `history.ts`, and `working-memory.ts`. I am intentionally excluding unrelated eval/telemetry/session tables because the restore bug in F1.16 is about the memory DB state, not the entire application database surface.

One important non-gap: `access-tracker.ts` does not define its own table. It only mutates `memory_index.access_count` and `memory_index.last_accessed`, so its state already lives inside `memory_index` and is covered when `memory_index` is restored. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:143-156`]

## 1. Full Table Inventory

### Primary tables (must snapshot)

| Table | Why it is primary | Evidence |
| --- | --- | --- |
| `memory_index` | Canonical source of stored memories and most ranking/governance columns. Everything else hangs off it. | `create_schema()` creates it as the base table. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1841-1903`] |
| `vec_memories` | Canonical persisted embedding payloads. Losing it changes semantic-search behavior immediately. | Created by `create_schema()` when `sqlite_vec_available`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1905-1924`] |
| `vec_metadata` | Stores the embedding dimension used to validate `vec_memories`; restore without it can leave stale/mismatched vector metadata. | Created in `create_schema()` and read by `validate_embedding_dimension()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1913-1922`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:175-205`] |
| `working_memory` | Session attention state is not derivable from durable memory rows; checkpoint code already treats it as state worth preserving. | Canonical schema in `working-memory.ts`; checkpoint restore recreates/restores it explicitly. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:45-68`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:640-689`] |
| `causal_edges` | The live graph is queried directly and not deterministically recoverable from `memory_index` alone because many edges are manual or feature-generated. | Schema is first-class migration state; restore already snapshots it. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:331-360`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:439-458`] |
| `memory_history` | Strictly speaking this is audit data, but in this codebase it is also an input to lineage backfill/replay and is the only source of high-fidelity transition timestamps. If we want rebuilt lineage to match pre-checkpoint state, this table must be preserved. | History table and lineage replay helper. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:78-172`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:357-400`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:891-1030`] |

### Derived tables (can rebuild)

| Table | Why it is derived | Existing rebuild path |
| --- | --- | --- |
| `memory_fts` | FTS5 mirror over `memory_index`. It is maintained by triggers, so restoring `memory_index` rows repopulates it automatically. | `memory_fts_insert`, `memory_fts_update`, `memory_fts_delete` triggers. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1926-1955`] |
| `memory_lineage` | Append-first version chain derived from current `memory_index` rows plus history timestamps. | `seedLineageFromCurrentState()`, `recordLineageTransition()`, `backfillLineageState()`, `runLineageBackfill()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:419-557`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:891-1030`] |
| `active_memory_projection` | Current-version projection over lineage state; core queries join it but it can be regenerated from lineage. | `backfillLineageState()` upserts it, and normal writes call `upsertActiveProjection()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:253-269`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1019-1026`] |
| `memory_entities` | Extracted from `memory_index.content_text`; not authoritative on its own. | `rebuildAutoEntities()` re-extracts from current `memory_index.content_text`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:350-425`] |
| `entity_catalog` | Aggregation/projection over `memory_entities`. | `rebuildEntityCatalog()` or `rebuildAutoEntities()` which calls it. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:272-339`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:424-425`] |
| `memory_summaries` | Derived summary text/embeddings from `memory_index.content_text`. | Per-row helper exists: `generateAndStoreSummary()`. There is no bulk rebuild helper yet. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:82-145`] |
| `community_assignments` | Persisted projection of graph clustering over `causal_edges`. | Persistence helper exists: `storeCommunityAssignments()`. A batch recompute wrapper still needs to be wired in. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:439-474`] |
| `degree_snapshots` | Materialized graph metric snapshots over `causal_edges`. | `snapshotDegrees()` can recreate today's snapshot from current edges. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:59-107`] |

### Operational tables (skip by default)

| Table | Why it is operational | Evidence |
| --- | --- | --- |
| `checkpoints` | The checkpoint archive itself. Restoring it inside a checkpoint is recursive and unnecessary. | Companion table definition. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1714-1725`] |
| `mutation_ledger` | Append-only audit trail of mutations; useful for forensics, not needed to make restored memories queryable. | Schema + append-only triggers. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:89-131`] |
| `memory_conflicts` | Prediction-error / conflict audit. Important for learning telemetry, not for restoring base memory visibility. | Created by companion schema/migrations. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1727-1745`] |
| `memory_corrections` | Correction workflow/audit table. It can influence learning workflows, but current memory rows and graph edges are the state that retrieval depends on. | Migration-created table. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:367-392`] |
| `weight_history` | Audit trail for causal edge strength changes. The current graph lives in `causal_edges`; this table is rollback/history support. | Migration-created table and write-path logging. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:659-679`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:691-713`] |
| `schema_version` | Migration bookkeeping only. | `ensure_schema_version()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:898-930`] |
| `governance_audit` | Governance decision log. | `ensureGovernanceTables()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1078-1114`] |
| `shared_spaces` | Shared-space control plane/config, not per-memory derived state. | `ensureSharedSpaceTables()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1116-1131`] |
| `shared_space_members` | Shared-space membership config. | `ensureSharedSpaceTables()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1133-1143`] |
| `shared_space_conflicts` | Shared-space conflict log/queue. | `ensureSharedSpaceTables()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1145-1157`] |
| `embedding_cache` | Pure performance cache; safe to cold-start after restore. | `initEmbeddingCache()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:27-43`] |

## 2. Current Checkpoint Coverage

### What is snapshotted now

`createCheckpoint()` only serializes four state buckets into `CheckpointSnapshot`: `memories` (`memory_index` rows), `vectors` (`vec_memories` rows), `workingMemory` (`working_memory` rows), and `causalEdges` (`causal_edges` rows). There is no snapshot field for lineage, projection, entity, summary, history, metadata, or any other table. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:389-458`]

### What is restored now

`restoreCheckpoint()` only:

1. Validates and restores `memory_index`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:612-818`]
2. Restores `vec_memories` when vector payloads are present. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:585-587`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:826-849`]
3. Recreates/restores `working_memory`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:640-689`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:852-891`]
4. Clears/restores `causal_edges`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:707-708`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:722-723`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:894-944`]

### Indirect coverage

`memory_fts` is not explicitly snapshot/restored, but it is effectively rebuilt during `memory_index` inserts because the FTS triggers are defined on `memory_index`. That means FTS is not the broken part of F1.16. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1934-1955`]

### Not covered at all

No path in `checkpoints.ts` snapshots or restores:

- `vec_metadata`
- `memory_history`
- `memory_lineage`
- `active_memory_projection`
- `memory_entities`
- `entity_catalog`
- `memory_summaries`
- `community_assignments`
- `degree_snapshots`
- `mutation_ledger`
- `memory_conflicts`
- `memory_corrections`
- `weight_history`
- governance/shared-space/embedding-cache tables

## 3. Gap Analysis

### P0 gap: `active_memory_projection` is required for core reads

Core prepared statements in `vector-index-store.ts` join `memory_index` to `active_memory_projection` for `count_all`, `count_by_folder`, `get_by_path`, `get_by_folder_and_path`, `get_stats`, and `list_base`. If checkpoint restore repopulates `memory_index` but leaves `active_memory_projection` empty/stale, large parts of the read path can return zero rows or incomplete results even though the memories exist. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:393-438`]

This is the highest-impact completeness bug.

### P0 gap: `memory_lineage` is the only supported way to rebuild the projection correctly

The codebase already has a real backfill path: `backfillLineageState()` groups `memory_index` rows by logical key, reconstructs `memory_lineage`, and upserts `active_memory_projection`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:891-1030`]

So the restore gap is not "we cannot rebuild lineage"; it is "restore never calls the rebuild."

### P1 gap: `memory_history` is missing, so lineage rebuild loses fidelity

`backfillLineageState()` prefers chronological `memory_history` events to compute `valid_from`; without history it falls back to `created_at`/`updated_at`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:357-400`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:927-943`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:969-1012`]

That means a rebuild-only strategy can recreate a usable active projection, but not necessarily the original lineage timing.

### P1 gap: entity infrastructure is not restored

`memory_entities` and `entity_catalog` are missing from checkpoints, and entity-linking treats `entity_catalog` population as infrastructure readiness. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:272-425`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:463-479`]

Existing rebuild hooks:

- `rebuildAutoEntities()` re-extracts auto entities from `memory_index.content_text` and then calls `rebuildEntityCatalog()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:350-425`]
- `rebuildEntityCatalog()` can rebuild the catalog exactly from `memory_entities`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:272-339`]

### P1 gap: summary-search state is not restored

`memory_summaries` is not restored, yet stage-1 candidate generation uses `querySummaryEmbeddings()` when summaries are enabled and the scale gate passes. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:98-145`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:600-620`]

There is a per-memory rebuild primitive (`generateAndStoreSummary()`), but there is no batch rebuild helper today. That is the main missing rebuild primitive for a hybrid design.

### P2 gap: graph-analytics side tables are not restored

`community_assignments` and `degree_snapshots` are missing from checkpoints. Existing hooks are partial:

- `storeCommunityAssignments()` persists assignments once some caller recomputes communities. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:439-474`]
- `snapshotDegrees()` can regenerate today's `degree_snapshots` rows from `causal_edges`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:59-107`]

Important nuance: historical degree snapshots are not reconstructable from current `causal_edges`. A rebuild can restore current-day graph metrics, but not the old time series.

### P2 gap: `vec_metadata` is omitted

Vectors are restored, but the stored embedding dimension metadata is not. If the database/provider pairing changes, `validate_embedding_dimension()` uses `vec_metadata` to detect mismatches. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:175-205`]

This is a small table with high leverage, so omitting it is unnecessary risk.

### P3 gap: operational/audit tables are also missing

`mutation_ledger`, `memory_conflicts`, `memory_corrections`, and `weight_history` are all omitted. None are required to make restored memories visible, but restore is currently not "forensically complete." That is probably acceptable for the default path, but it should be a conscious design choice, not an accident.

### Existing code already hints there are more ancillary tables than checkpoints handles

`deleteAncillaryMemoryRows()` in `vector-index-mutations.ts` cleans `degree_snapshots`, `community_assignments`, `memory_summaries`, `memory_entities`, `memory_lineage`, `shared_space_conflicts`, `active_memory_projection`, and `causal_edges` when deleting a memory. That is strong evidence the write path already recognizes more side tables than checkpoint restore currently manages. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:35-63`]

## 4. Proposed Fix

### Option A: extend snapshot to every table

This would produce the most exact replay, but I do not recommend it as the default design.

Pros:

- Exact replay, including audits and derived caches.
- No post-restore rebuild latency.

Cons:

- `checkpoints.ts` becomes tightly coupled to every future schema addition.
- Spec-folder scoped checkpoints become awkward for global/control-plane tables such as `shared_spaces` or `shared_space_members`.
- It snapshots caches/logs that are not required for correctness.

### Option B: rebuild everything after restoring only base tables

This is too weak on its own.

Pros:

- Small checkpoints.
- Less schema drift in the snapshot format.

Cons:

- `vec_metadata` is not rebuilt today.
- `memory_history` is needed for faithful lineage timing; without it, backfill is only approximate.
- `memory_summaries` has no batch rebuild helper yet.
- Historical `degree_snapshots` are not reconstructable from current `causal_edges`.

### Option C: hybrid snapshot + rebuild (recommended)

This is the best fit for the current architecture.

#### Snapshot directly

Snapshot and restore these tables explicitly:

- `memory_index`
- `vec_memories`
- `vec_metadata`
- `working_memory`
- `causal_edges`
- `memory_history`

Rationale:

- These are either true source-of-truth tables or necessary inputs for a faithful derived rebuild.
- `vec_metadata` and `memory_history` are both small enough that there is little downside to capturing them.

#### Rebuild after restore

After the base restore succeeds, rebuild these tables in order:

1. `memory_lineage` + `active_memory_projection` via `runLineageBackfill()` / `backfillLineageState()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:891-1030`]
2. `memory_entities` + `entity_catalog` via `rebuildAutoEntities()` (which already calls `rebuildEntityCatalog()`). [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:350-425`]
3. `memory_summaries` via a new batch helper built on `generateAndStoreSummary()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:98-145`]
4. `community_assignments` via a new recompute wrapper that ends by calling `storeCommunityAssignments()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:439-474`]
5. `degree_snapshots` via `snapshotDegrees()` for current-day graph metrics. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:59-107`]
6. `memory_fts` needs no explicit step because inserts into `memory_index` already fire the FTS triggers. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1934-1955`]

#### Skip by default

Keep these out of the default checkpoint restore path:

- `checkpoints`
- `mutation_ledger`
- `memory_conflicts`
- `memory_corrections`
- `weight_history`
- `schema_version`
- `governance_audit`
- `shared_spaces`
- `shared_space_members`
- `shared_space_conflicts`
- `embedding_cache`

These are either forensic logs, control-plane config, or performance caches. If the project later needs forensic-grade restore, add a separate opt-in "full snapshot" mode rather than forcing the default path to carry everything.

#### Two implementation details that matter

1. Before rebuilding derived tables, `clearExisting=true` restore must also purge stale derived rows for the affected memory IDs/logical keys. Otherwise old `active_memory_projection`, `memory_entities`, `memory_summaries`, `community_assignments`, or `degree_snapshots` rows can survive and disagree with the restored base state.
2. If `memory_history` is restored from snapshot, the current `recordHistory(... 'DELETE' ...)` writes in the pre-clear path should be suppressed or moved behind a feature flag for checkpoint restore. Otherwise the restore itself pollutes the history that lineage backfill depends on. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:699-714`]

## 5. Implementation Plan

1. Extend `CheckpointSnapshot` and capture helpers in `checkpoints.ts` to include `vecMetadata` and `history`, plus a small manifest of which tables were included. Estimated 140-180 LOC.
2. Add scoped purge helpers in `checkpoints.ts` for derived tables (`memory_lineage`, `active_memory_projection`, `memory_entities`, `memory_summaries`, `community_assignments`, `degree_snapshots`) and gate the synthetic history writes during restore. Estimated 100-140 LOC.
3. Add a post-restore rebuild orchestrator in `checkpoints.ts` that runs lineage backfill, entity rebuild, summary rebuild, community rebuild, and degree snapshot refresh in that order. Estimated 120-180 LOC.
4. Add a batch summary rebuild helper in `memory-summaries.ts` that iterates `memory_index` rows in scope and calls `generateAndStoreSummary()`. Estimated 70-110 LOC.
5. Add a small graph/community rebuild wrapper, likely in `community-detection.ts` or a new graph-maintenance helper, that recomputes communities from `causal_edges` and persists them through `storeCommunityAssignments()`. Estimated 80-120 LOC.
6. Add restore-completeness tests that assert:
   - core list/count/get-by-path queries work after restore because `active_memory_projection` exists;
   - lineage APIs return rows after restore;
   - entity infrastructure comes back;
   - summary-search channel has rows again;
   - graph analytics tables are repopulated as designed;
   - operational tables are intentionally excluded. Estimated 220-320 LOC.

### Estimated total

Roughly 730-1,050 LOC across `checkpoints.ts`, `memory-summaries.ts`, graph helpers, and tests.

## Recommendation

Recommend Option C.

It fixes the actual correctness bug in F1.16 without turning checkpoints into a mirror of every table in the database. The key idea is:

- snapshot the small set of true source tables plus the one audit table (`memory_history`) that derived rebuilds need for fidelity;
- rebuild the projections that already have deterministic recovery paths;
- explicitly leave purely operational tables out of scope.
