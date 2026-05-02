---
title: "Storage Layer: Persistence Helpers"
description: "Code-folder guide for storage helpers that persist checkpoints, lineage, history, incremental indexing metadata, audit rows and maintenance state."
trigger_phrases:
  - "storage layer"
  - "lineage state"
  - "incremental index"
  - "post insert metadata"
---

# Storage Layer: Persistence Helpers

> Persistence helpers for checkpoints, lineage, history, incremental indexing metadata, audit rows and maintenance state.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. ARCHITECTURE](#2-architecture)
- [3. PACKAGE TOPOLOGY](#3-package-topology)
- [4. DIRECTORY TREE](#4-directory-tree)
- [5. KEY FILES](#5-key-files)
- [6. BOUNDARIES AND FLOW](#6-boundaries-and-flow)
- [7. ENTRYPOINTS](#7-entrypoints)
- [8. VALIDATION](#8-validation)
- [9. RELATED](#9-related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/storage/` contains persistence helpers that sit below MCP handlers and above the raw SQLite-backed memory/search schema. The folder owns durable state that is not a search algorithm by itself: checkpoints, incremental index metadata, lineage transitions, mutation history, causal edges, consolidation state and guarded post-insert metadata updates.

Current responsibilities:

- Provide storage-safe helpers that handlers can call without embedding SQL rules in orchestration code.
- Keep lineage, history and mutation ledger records append-first where auditability matters.
- Support reindex decisions with stored file metadata, content hashes and embedding health.
- Guard dynamic metadata writes to known `memory_index` columns.
- Keep maintenance systems feature-gated where they refresh or consolidate existing records.

The primary memory schema is defined in `../search/vector-index-schema.ts`. Storage helpers assume the current schema includes document type, spec level, governance scope, lineage and embedding-status columns.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         LIB / STORAGE                            │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ handlers         │ ───▶ │ storage helpers  │ ───▶ │ SQLite tables    │
│ save/search/etc. │      │ lib/storage/*    │      │ memory + audit   │
└────────┬─────────┘      └────────┬─────────┘      └────────┬─────────┘
         │                         │                         │
         │                         ▼                         ▼
         │               ┌──────────────────┐      ┌──────────────────┐
         └──────────▶    │ search schema    │ ───▶ │ retrieval state  │
                         │ vector-index     │      │ FTS/BM25/vector  │
                         └────────┬─────────┘      └──────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ maintenance jobs │
                         └──────────────────┘

Dependency direction:
handlers ───▶ lib/storage ───▶ lib/search schema and database handles
lib/storage does not import handler modules.
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
lib/storage/
+-- access-tracker.ts          # Access count updates
+-- causal-edges.ts            # Causal edge persistence
+-- checkpoints.ts             # Checkpoint create, restore and pruning
+-- consolidation.ts           # Maintenance for stale and contradictory links
+-- document-helpers.ts        # Document classification and weighting helpers
+-- history.ts                 # Append-only history events
+-- incremental-index.ts       # Content-hash and embedding-health reindex checks
+-- learned-triggers-schema.ts # Learned trigger schema checks
+-- lineage-state.ts           # Append-first lineage state and projections
+-- mutation-ledger.ts         # Hash-chained mutation audit log
+-- post-insert-metadata.ts    # Guarded memory_index metadata updates
+-- reconsolidation.ts         # Similarity merge and conflict routing
+-- schema-downgrade.ts        # Targeted schema rollback helper
+-- transaction-manager.ts     # Pending-file atomic workflow support
`-- README.md
```

Allowed dependency direction:

```text
handlers → lib/storage → lib/search/vector-index-schema
handlers → lib/storage → SQLite database handles
maintenance tools → lib/storage
```

Disallowed dependency direction:

```text
lib/storage → handlers/save
lib/storage → MCP transport response builders
lib/storage → spec packet files
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 4. DIRECTORY TREE

```text
lib/storage/
+-- access-tracker.ts
+-- causal-edges.ts
+-- checkpoints.ts
+-- consolidation.ts
+-- document-helpers.ts
+-- history.ts
+-- incremental-index.ts
+-- learned-triggers-schema.ts
+-- lineage-state.ts
+-- mutation-ledger.ts
+-- post-insert-metadata.ts
+-- reconsolidation.ts
+-- schema-downgrade.ts
+-- transaction-manager.ts
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Responsibility |
|---|---|
| `access-tracker.ts` | Persists access counts used by retrieval scoring and usage-based boosts. |
| `causal-edges.ts` | Inserts, queries and manages causal relationship rows between memory records. |
| `checkpoints.ts` | Creates, restores and prunes checkpoints, including working-memory snapshot support. |
| `consolidation.ts` | Runs maintenance for contradiction, Hebbian and stale-edge consolidation paths. |
| `document-helpers.ts` | Classifies spec documents and calculates document-aware weighting for save/update flows. |
| `history.ts` | Records higher-level history events and resolves lineage anchors for reporting. |
| `incremental-index.ts` | Compares stored file metadata, content hashes and embedding status to decide whether reindexing is needed. |
| `learned-triggers-schema.ts` | Maintains learned-trigger column and FTS isolation schema checks. |
| `lineage-state.ts` | Records append-first lineage transitions, active projections, integrity checks and backfill state. |
| `mutation-ledger.ts` | Writes mutation-audit rows with hash-chain continuity for low-level provenance. |
| `post-insert-metadata.ts` | Applies guarded dynamic updates to allowed `memory_index` metadata columns. |
| `reconsolidation.ts` | Routes similar saves through merge, conflict or complement decisions when enabled. |
| `schema-downgrade.ts` | Provides targeted downgrade support for older schema rollback workflows. |
| `transaction-manager.ts` | Manages pending-file paths and crash-recovery support for atomic save flows. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Storage helpers may depend on database handles, search schema utilities, governance helpers and shared utilities. |
| Exports | Each module exposes focused helpers. There is no folder-level barrel for broad runtime imports. |
| Handler boundary | Storage modules must not build MCP responses or call handler-only save orchestration. |
| Schema boundary | New persisted fields must align with `../search/vector-index-schema.ts` before helpers read or write them. |
| Audit boundary | Lineage, history and mutation ledger helpers append records rather than rewriting provenance in place. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ handler or maintenance caller             │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ choose focused storage helper             │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ validate schema column or state contract  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ write checkpoint, lineage, audit or meta  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ return storage result to caller           │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ handler formats user-visible response     │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `applyPostInsertMetadata()` | Function | Writes allowed metadata fields to `memory_index` after a row is inserted. |
| `recordLineageTransition()` | Function | Appends lineage state transitions and updates active projections. |
| `recordHistory()` | Function | Writes higher-level memory history events. |
| `appendMutationLedger()` | Function | Records mutation provenance in the audit ledger. |
| `shouldReindexFile()` | Function | Uses stored path metadata and embedding state to decide whether indexing work is needed. |
| `createCheckpoint()` | Function | Persists a named checkpoint for memory state recovery. |
| `runReconsolidation()` | Function | Evaluates similarity-based merge or conflict decisions when reconsolidation is enabled. |
| `getPendingPath()` | Function | Builds pending-file paths used by atomic save promotion. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 8. VALIDATION

Run from the repository root unless noted.

```bash
python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md
```

Expected result: the document is detected as a README and the extracted structure has no critical section or HVR issues.

Focused code checks for this folder normally run through the package test suite that covers storage helpers and memory-index behavior.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 9. RELATED

- [`../README.md`](../README.md)
- [`../search/README.md`](../search/README.md)
- [`../../handlers/README.md`](../../handlers/README.md)
- [`../../database/README.md`](../../database/README.md)
- [`../../handlers/save/README.md`](../../handlers/save/README.md)

<!-- /ANCHOR:related -->
