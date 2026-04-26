---
title: "Indexing runtime bootstrap API"
description: "Covers the public bootstrap surface that initializes indexing dependencies, warms embeddings, runs index scans, and closes the shared runtime."
audited_post_018: true
---
# Indexing runtime bootstrap API
## TABLE OF CONTENTS
- [1. OVERVIEW](#1-overview)
- [2. CURRENT REALITY](#2-current-reality)
- [3. SOURCE FILES](#3-source-files)
- [4. SOURCE METADATA](#4-source-metadata)
## 1. OVERVIEW
`mcp_server/api/indexing.ts` is a deliberately narrow public API for operational scripts that need to bring the indexing runtime up without importing `core/` or handler internals directly. Instead of exposing the full storage and search subsystem, it packages the minimum lifecycle hooks into four exports: runtime initialization, embedding warmup, scan execution, and shutdown.

The module is mostly orchestration glue, but the glue matters. `initializeIndexingRuntime()` wires the vector database, checkpoint storage, access tracking, and hybrid-search state into the shared db-state singleton before any scan work runs. `warmEmbeddingModel()` is intentionally separate, so callers can choose whether to pay the embedding startup cost ahead of time or let the first embedding request do that work. `runMemoryIndexScan()` then hands control to the full indexing handler, which means this API is small on the surface while still activating the real incremental-scan, deduplication, stale-delete, and response-envelope behavior deeper in the stack.

---
## 2. CURRENT REALITY
The public type surface is one interface plus four functions. `MemoryIndexScanArgs` accepts `specFolder`, `force`, `includeConstitutional`, `includeSpecDocs`, and `incremental`, all optional and shaped to match the scan handler input. `initializeIndexingRuntime()` first calls `vectorIndex.initializeDb()`, then registers runtime dependencies with `initDbState()` using the `vectorIndex` facade plus storage and search init hooks. After that registration step it immediately reads back the database handle with `vectorIndex.getDb()` and throws if the handle is still missing. On success it eagerly initializes checkpoints, access tracking, and hybrid search against the live database, passing `vectorIndex.vectorSearch` into `initHybridSearch()`. The bootstrap is intentionally minimal: it does not bind session-manager or incremental-index dependencies here, and it does not warm embeddings.

`warmEmbeddingModel(input = 'warmup test')` is an async warmup helper with no internal recovery path. It awaits `generateEmbedding(input)`, sets the global embedding readiness flag through `setEmbeddingModelReady(true)`, and returns `getEmbeddingProfile()` cast to `EmbeddingProfile | null`. If embedding generation throws, the error bubbles to the caller and the readiness flag is not flipped. `closeIndexingRuntime()` is equally narrow and only calls `vectorIndex.closeDb()`, so it closes the shared database connection without resetting db-state caches or readiness flags on its own.

`runMemoryIndexScan(args)` is a thin delegate to `handleMemoryIndexScan(args)`, so the real runtime behavior comes from the handler pipeline. The handler logs the active embedding profile when available, checks for external database updates through `checkDatabaseUpdated()`, enforces the persisted `INDEX_SCAN_COOLDOWN`, collects memory files plus optional constitutional and spec-document files, deduplicates them by canonical path, and in incremental mode categorizes files into index, update, skip, and stale-delete buckets. It batch-processes remaining files through `indexMemoryFile()`, updates stored mtimes only after successful indexing outcomes, optionally creates causal chains for changed spec documents, runs post-mutation invalidation hooks, records the last scan time, and returns standardized MCP success or error envelopes. Spec documents remain part of that scan by default, and the handler passes them through `memory_save` in warn-only quality mode rather than bypassing indexing.

**Index-scope invariants (Packet 026/010/002):** file collection is governed by the shared path-policy module `mcp_server/lib/utils/index-scope.ts`. Its `shouldIndexForMemory()` and `shouldIndexForCodeGraph()` predicates permanently exclude `z_future/` and `/external/` subtrees across memory discovery, spec-doc classification, parser admissibility, and code-graph recursive scanning (plus `specificFiles` refreshes). `resolveCanonicalPath()` hardens the exclusion check against symlink escapes before policy evaluation. The constitutional tier is restricted to real rule files under `.opencode/skill/system-spec-kit/constitutional/` — the constitutional `README.md` stays excluded per ADR-005. Defense-in-depth runs at save time: `memory-save.ts` rejects excluded paths and downgrades non-constitutional `importanceTier: constitutional` to `important` before persistence, recording a `tier_downgrade_non_constitutional_path` row in the governance audit. A walker DoS cap prevents pathological scan fan-out. Operator maintenance for pre-existing pollution lives in `scripts/dist/memory/cleanup-index-scope-violations.js` (`--apply` / `--verify`); verify counts should be `constitutional_total=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0`.

**Scan-originated `fromScan` contract (Packet 026/010/001):** when `handleMemoryIndexScan` delegates a file to `memory_save`, it tags the save with `fromScan: true`. The save handler uses that flag to skip only the transactional complement-recheck path that previously fired `candidate_changed` false-positives on scan-originated saves. Interactive (non-scan) saves retain the full recheck. In parallel, the PE orchestration path now compares `SimilarMemory.canonical_file_path` to the current target: cross-file `UPDATE` / `REINFORCE` candidates are downgraded to `CREATE`, which prevents sibling packet docs from driving lineage-bearing updates across files (the prior `E_LINEAGE` class). The default `BATCH_SIZE` was restored — an earlier `scanBatchSize = 1` serialization approach was rolled back in favor of the `fromScan` bypass.
---
## 3. SOURCE FILES
### Implementation
| File | Layer | Role |
|------|-------|------|
| `mcp_server/api/indexing.ts` | API | Public bootstrap, warmup, scan, and shutdown surface |
| `mcp_server/api/providers.ts` | API | Public embedding provider re-export used for warmup/profile access |
| `mcp_server/api/search.ts` | API | Public search surface supplying hybrid-search init and vector index facade |
| `mcp_server/api/storage.ts` | API | Public checkpoint and access-tracker init hooks |
| `mcp_server/core/index.ts` | Core | Barrel exposing db-state init and embedding readiness helpers |
| `mcp_server/core/db-state.ts` | Core | Shared runtime dependency registry, DB rebind logic, and readiness state |
| `mcp_server/handlers/memory-index.ts` | Handler | Actual memory index scan implementation delegated to by the API |
---
## 4. SOURCE METADATA
- Group: Memory Quality and Indexing
- Source feature title: Indexing runtime bootstrap API
- Source spec: Deep research remediation 2026-03-26
