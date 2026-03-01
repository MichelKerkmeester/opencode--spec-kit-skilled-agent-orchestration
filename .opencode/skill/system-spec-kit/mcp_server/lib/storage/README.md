---
title: "Storage Layer"
description: "Persistence layer for the Spec Kit Memory MCP server. Handles memory indexing, checkpoints, causal graphs and atomic file operations."
trigger_phrases:
  - "storage layer"
  - "memory indexing"
  - "checkpoints"
---

# Storage Layer

> Persistence layer for the Spec Kit Memory MCP server. Handles memory indexing, checkpoints, causal graphs and atomic file operations.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. TROUBLESHOOTING](#5--troubleshooting)
- [6. RELATED RESOURCES](#6--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The storage layer provides all persistence operations for the Spec Kit Memory MCP server. It manages memory state across sessions and tracks access patterns for relevance scoring. It also enables causal relationship mapping between memories.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 8 | Core persistence modules |
| Relationship Types | 6 | Causal edge types for decision lineage |

### Key Features

| Feature | Description |
|---------|-------------|
| **Incremental Indexing** | Mtime-based fast path skips unchanged files |
| **Causal Edges** | 6 relationship types model decision lineage between memories |
| **Spec Doc Edge Builder** | Auto-builds document edges across spec.md, plan.md, tasks.md, checklist.md, and decision records |
| **Checkpoints** | Gzip-compressed state snapshots for rollback |
| **Atomic Transactions** | File write + index insert with pending file recovery |
| **Access Tracking** | Batched accumulator updates minimize I/O while tracking usage for relevance boost |
| **Schema v15** | Current database schema version (v15) with causal graph and retrieval-index storage tables |
| **Graph Storage** | Persists causal graph edges and graph-related metadata for retrieval enrichment |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
storage/
 access-tracker.ts      # Track memory access for usage boost scoring
 causal-edges.ts        # Causal graph storage with 6 relationship types
 checkpoints.ts         # Gzip-compressed state snapshots
 history.ts             # Change history tracking (ADD/UPDATE/DELETE events)
 incremental-index.ts   # Mtime-based incremental indexing
 index-refresh.ts       # Embedding index freshness management
 mutation-ledger.ts     # Append-only audit trail with SQLite BEFORE triggers, hash chains, 7 mutation types
 transaction-manager.ts # Atomic file + index operations
 README.md              # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `access-tracker.ts` | Tracks memory access patterns with batched accumulator for usage boost |
| `causal-edges.ts` | Stores causal relationships (caused, enabled, supersedes, contradicts, derived_from, supports) |
| `checkpoints.ts` | Creates/restores gzip-compressed checkpoints with MAX_CHECKPOINTS (10) enforcement |
| `history.ts` | Tracks change history for memory entries (ADD, UPDATE, DELETE) with actor attribution |
| `incremental-index.ts` | Determines which files need re-indexing via mtime fast path |
| `index-refresh.ts` | Manages embedding index freshness: status tracking, retry logic and unindexed document querying |
| `mutation-ledger.ts` | Append-only audit trail with SQLite BEFORE triggers, hash chains, 7 mutation types |
| `transaction-manager.ts` | Atomic file writes (temp+rename) with pending file crash recovery |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Incremental Indexing (v1.2.0)

**Purpose**: Skip unchanged files during re-indexing via mtime comparison.

| Aspect | Details |
|--------|---------|
| **Fast Path** | If mtime unchanged (within 1s), skip file |
| **Embedding Check** | Even on mtime match, re-index if embedding status is `pending` or `failed` |
| **Return Type** | `IndexDecision` string: `'skip'` \| `'reindex'` \| `'new'` \| `'deleted'` \| `'modified'` \| `'unknown'` |

Decision logic (`shouldReindex(filePath)`):
1. File doesn't exist on disk + stored in DB -> `deleted`
2. File doesn't exist on disk + not stored -> `skip`
3. No stored metadata (new file) -> `new`
4. No stored mtime (legacy entry) -> `reindex`
5. Mtime unchanged (within 1s) -> `skip` (or `reindex` if embedding pending/failed)
6. Mtime changed -> `modified`

### Causal Edges (v1.2.0)

**Purpose**: Model decision lineage and memory relationships with 6 relationship types.

| Relation | Meaning |
|----------|---------|
| `caused` | A caused B to be created |
| `enabled` | A enabled/unlocked B |
| `supersedes` | A replaces/supersedes B |
| `contradicts` | A contradicts B |
| `derived_from` | A was derived from B |
| `supports` | A supports/reinforces B |

Supports depth-limited traversal (default 3 hops) for causal chain queries.

Structural helper APIs create deterministic relationships between core spec documents in the same folder, including dependencies and implementation progression edges.

### Checkpoints

**Purpose**: Create named snapshots of memory state for rollback/recovery.

| Aspect | Details |
|--------|---------|
| **Compression** | gzip compression of JSON snapshots |
| **Working Memory** | Optional backup of working_memory table |
| **Limit** | Max 10 checkpoints (oldest pruned when exceeded) |

Note: Restored checkpoints do **not** include embedding vectors. Run `memory_index_scan` after restore to regenerate embeddings for semantic search.

### Access Tracking

**Purpose**: Track memory access patterns for usage-based relevance boost.

| Aspect | Details |
|--------|---------|
| **Accumulator** | Increments by 0.1 per access, flushes to DB at threshold (0.5) |
| **Usage Boost** | `min(0.2, accessCount * 0.02)`, max +20% base boost |
| **Recency Multiplier** | 2x if accessed within 1 hour, 1.5x if within 24 hours |
| **Effective Max** | Up to +40% with recency multiplier |

### Transaction Manager

**Purpose**: Atomic file write operations with crash recovery.

| Aspect | Details |
|--------|---------|
| **Atomic Write** | Write to temp file (`.tmp`), then rename |
| **Pending Pattern** | Write to `_pending` path, run DB op, then rename to final |
| **Rollback** | Delete pending file on DB failure |
| **Recovery** | `findPendingFiles()` + `recoverPendingFile()` for crash recovery |
| **Metrics** | Tracks atomicWrites/deletes/recoveries/errors counts |

### History (v1.8.0)

**Purpose**: Track change history for memory entries with actor attribution.

| Aspect | Details |
|--------|---------|
| **Events** | `ADD`, `UPDATE`, `DELETE`, tracked per memory entry |
| **Actors** | `user`, `system`, `hook`, `decay`, identifies who made the change |
| **Storage** | `memory_history` table with foreign key to `memory_index` |
| **Diff Support** | Stores `prev_value` and `new_value` for change comparison |

**Exported functions:**

| Function | Purpose |
|----------|---------|
| `init(db)` | Initialize module and create `memory_history` table |
| `recordHistory(memoryId, event, prevValue, newValue, actor)` | Record a change event |
| `getHistory(memoryId, limit?)` | Retrieve history for a memory (newest first) |
| `getHistoryStats(specFolder?)` | Get aggregate counts (total, adds, updates, deletes) |
| `generateUuid()` | Generate a v4 UUID for history entry IDs |

**Exported types:** `HistoryEntry`, `HistoryStats`

### Index Refresh (v1.8.0)

**Purpose**: Manage embedding index freshness on the `memory_index` table.

| Aspect | Details |
|--------|---------|
| **Status Tracking** | Tracks `success`, `pending`, `retry`, `failed`, `partial` embedding states |
| **Retry Logic** | Up to 3 retries before marking as `failed` (configurable via `RETRY_THRESHOLD`) |
| **Prioritization** | Retry entries processed before pending entries |
| **Freshness Check** | `needsRefresh()` returns true if any non-success entries exist |

**Exported functions:**

| Function | Purpose |
|----------|---------|
| `init(db)` | Initialize module with database reference |
| `getIndexStats()` | Count rows grouped by `embedding_status` |
| `needsRefresh()` | Check if any pending/retry/partial entries exist |
| `getUnindexedDocuments()` | Get documents needing (re-)indexing, prioritized by status |
| `markIndexed(id, modelName)` | Mark a document as successfully indexed |
| `markFailed(id, reason)` | Increment retry count or mark as failed |
| `ensureIndexFresh()` | Return unindexed documents if refresh is needed |

**Exported types:** `IndexStats`, `UnindexedDocument`

<!-- /ANCHOR:features -->

---

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Check if File Needs Re-indexing

```typescript
import { shouldReindex } from './incremental-index';

const decision = shouldReindex('/path/to/file.md');

switch (decision) {
  case 'new':
    console.log('New file, needs indexing');
    break;
  case 'modified':
    console.log('File modified, needs re-indexing');
    break;
  case 'reindex':
    console.log('Re-index needed (legacy entry or embedding pending)');
    break;
  case 'deleted':
    console.log('File deleted from disk');
    break;
  case 'skip':
    console.log('Unchanged, skip');
    break;
}
```

### Example 2: Create and Traverse Causal Edges

```typescript
import { insertEdge, getCausalChain, RELATION_TYPES } from './causal-edges';

// Create edge (returns edge ID or null)
const edgeId = insertEdge(
  'memory-123',        // sourceId
  'memory-456',        // targetId
  RELATION_TYPES.CAUSED,
  0.9,                 // strength (0-1)
  'Decision A led to implementation B'  // evidence
);

// Traverse chain (default max 3 hops, 'forward' direction)
const chain = getCausalChain('memory-123', 3, 'forward');

console.log(`Root: ${chain.id}, children: ${chain.children.length}`);
```

### Example 3: Create and Restore Checkpoint

```typescript
import { createCheckpoint, restoreCheckpoint } from './checkpoints';

// Create checkpoint
const checkpoint = createCheckpoint({
  name: 'before-refactor',
  specFolder: 'specs/<###-spec-name>',
  metadata: { reason: 'Pre-refactoring snapshot' }
});

// Restore checkpoint (note: embeddings are NOT restored)
const result = restoreCheckpoint('before-refactor');
console.log(`Restored ${result.restored} memories, ${result.skipped} skipped`);
// Run memory_index_scan after restore to regenerate embeddings
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Batch categorize | `categorizeFilesForIndexing(filePaths)` | Pre-filter files before indexing |
| Track access | `trackAccess(memoryId)` | After memory is retrieved |
| Atomic save | `executeAtomicSave(filePath, content, dbOperation)` | File + DB operation together |
| Graph stats | `getGraphStats()` | Check causal graph health |
| Find orphans | `findOrphanedEdges()` | Detect edges referencing deleted memories |
| Record change | `recordHistory(memoryId, 'UPDATE', old, new, 'system')` | Audit trail for memory changes |
| Check index health | `getIndexStats()` | Monitor embedding status distribution |
| Get metrics | `getMetrics()` | Check transaction success/failure counts |

<!-- /ANCHOR:usage-examples -->

---

## 5. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Embeddings Not Working After Checkpoint Restore

**Symptom**: Semantic search returns no results after restoring checkpoint.

**Cause**: `restoreCheckpoint` restores memory metadata but does not restore embedding vectors.

**Solution**:
```bash
# Run memory_index_scan to regenerate embeddings
memory_index_scan({ specFolder: "specs/<###-spec-name>" })
```

#### Files Not Being Re-indexed

**Symptom**: Modified files not picked up during index scan.

**Cause**: Mtime within 1-second threshold (`MTIME_FAST_PATH_MS`).

**Solution**:
```typescript
import { shouldReindex, categorizeFilesForIndexing } from './incremental-index';

// Check individual file
const decision = shouldReindex('/path/to/file.md');
console.log(`Decision: ${decision}`);

// Batch check
const categorized = categorizeFilesForIndexing(['/path/to/file1.md', '/path/to/file2.md']);
console.log(`To index: ${categorized.toIndex.length}, To update: ${categorized.toUpdate.length}`);
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Stale mtime | Touch file to update mtime, or use force re-index |
| Orphaned edges | `findOrphanedEdges()` to detect, `deleteEdge(id)` to clean up |
| Transaction errors | Check `getMetrics()` for failure reasons |
| Pending files after crash | `findPendingFiles(dir)` + `recoverPendingFile(path)` |

### Diagnostic Commands

```typescript
// Check causal graph health
import { getGraphStats, findOrphanedEdges } from './causal-edges';
console.log(getGraphStats());
console.log(findOrphanedEdges());

// Check transaction metrics
import { getMetrics } from './transaction-manager';
console.log(getMetrics());

// Check access accumulator
import { getAccumulatorState, calculateUsageBoost } from './access-tracker';
console.log(getAccumulatorState(42));
console.log(calculateUsageBoost(10, Date.now()));

// Check change history
import { getHistory, getHistoryStats } from './history';
console.log(getHistory(42, 10));
console.log(getHistoryStats());

// Check embedding index health
import { getIndexStats, needsRefresh, getUnindexedDocuments } from './index-refresh';
console.log(getIndexStats());
console.log(`Needs refresh: ${needsRefresh()}`);
console.log(getUnindexedDocuments());
```

<!-- /ANCHOR:troubleshooting -->

---

## 6. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [../session/README.md](../session/README.md) | Session management modules |

### Related Modules

| Module | Purpose |
|--------|---------|
| `context-server.ts` | MCP server that uses storage layer |

<!-- /ANCHOR:related -->

---

*Documentation version: 1.7.3 | Last updated: 2026-02-21 | Storage layer v1.2.0 | Schema v15*
