---
title: "Storage Layer"
description: "Persistence helpers for checkpoints, lineage, reconsolidation, audit history, and post-insert metadata."
trigger_phrases:
  - "storage layer"
  - "lineage state"
  - "incremental index"
  - "post insert metadata"
---

# Storage Layer

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. IMPLEMENTED STATE](#3--implemented-state)
- [4. RELATED](#4--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/storage/` contains the persistence-side helpers that sit below handlers and above the raw vector-index schema/runtime. The directory currently contains 14 TypeScript modules.

Key responsibilities:

- Checkpoint persistence and restore helpers.
- Incremental indexing metadata and stale-record discovery.
- Append-first lineage tracking and mutation audit history.
- Shared post-insert metadata updates used by save/index flows.
- Reconsolidation, consolidation, and causal-edge persistence helpers.

Current schema note:

- The primary memory schema is at `SCHEMA_VERSION = 23` in `lib/search/vector-index-schema.ts`.
- Storage helpers assume document-aware columns such as `document_type`, `spec_level`, governance scope columns, and lineage metadata are available.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:structure -->
## 2. STRUCTURE

| File | Purpose |
|---|---|
| `access-tracker.ts` | Access-count persistence used by usage-based retrieval boosts |
| `causal-edges.ts` | Insert, query, and manage causal edge records |
| `checkpoints.ts` | Checkpoint creation, restore, pruning, and working-memory snapshot support |
| `consolidation.ts` | N3-lite contradiction, Hebbian, and stale-edge maintenance |
| `document-helpers.ts` | Document-type weighting and spec-document classification helpers used by save/update paths |
| `history.ts` | Append-only history events and lineage anchor lookup helpers |
| `incremental-index.ts` | Stored metadata lookup, content-hash-aware reindex decisions, and stale path discovery |
| `learned-triggers-schema.ts` | Migration helpers for the `learned_triggers` column and FTS isolation checks |
| `lineage-state.ts` | Append-first lineage transitions, active projection reads, backfill, and as-of resolution |
| `mutation-ledger.ts` | SQLite-backed mutation audit ledger with hash-chain support |
| `post-insert-metadata.ts` | Guarded dynamic post-insert metadata updates for `memory_index` rows |
| `reconsolidation.ts` | Similarity-based merge, conflict, or complement routing after saves |
| `schema-downgrade.ts` | Targeted downgrade helper for older schema rollbacks |
| `transaction-manager.ts` | Atomic pending-file workflow and crash-recovery support |

<!-- /ANCHOR:structure -->
<!-- ANCHOR:implemented-state -->
## 3. IMPLEMENTED STATE

- `incremental-index.ts` uses `file_mtime_ms`, `content_hash`, and `embedding_status` together, so unchanged-path fast paths still requeue rows whose embeddings are unhealthy.
- `document-helpers.ts` is now the canonical source for document-aware weighting, including lower weights for working artifacts and higher weights for constitutional/spec docs.
- `post-insert-metadata.ts` is the storage-safe bridge for save/index flows that need to write guarded metadata columns without reaching back into handler modules.
- `lineage-state.ts` owns append-first version transitions, active projections, integrity validation, and backfill helpers.
- `mutation-ledger.ts` and `history.ts` provide complementary audit trails: the former is low-level mutation provenance, the latter is higher-level history/event reporting.
- `reconsolidation.ts` and `consolidation.ts` remain feature-gated maintenance systems, but both are wired against the current lineage and interference-refresh behavior.
- `checkpoints.ts` supports working-memory snapshots, while restore flows still require a re-index pass to rebuild embeddings.

<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:related -->
## 4. RELATED

- `../README.md`
- `../search/README.md`
- `../../handlers/README.md`
- `../../database/README.md`

<!-- /ANCHOR:related -->
