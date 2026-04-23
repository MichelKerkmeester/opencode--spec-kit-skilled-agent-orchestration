## Iteration 05

### Focus
Concurrent-write safety after B2: inspect the lock hierarchy and whether skipping the transactional recheck leaves any unprotected race window.

### Findings
- The scan itself is lease-protected up front by `acquireIndexScanLease()`, which prevents overlapping top-level `memory_index_scan` runs from starting inside the configured cooldown window. (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:197-220`)
- Per-save in-process serialization still exists because `processPreparedMemory()` runs under `withSpecFolderLock(prepared.parsed.specFolder, ...)`, and the mutex chains saves per spec folder rather than globally. (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2536-2540`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:9-27`)
- The write path also keeps a `BEGIN IMMEDIATE`-style SQLite transaction as defense in depth for multi-process races, and the source comment explicitly calls out that division of labor. (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2342-2348`)
- Because A2 already converts unsafe cross-file `UPDATE`/`REINFORCE` into `CREATE`, the remaining scan-time concurrency surface is reduced to same-path/version ordering rather than sibling-doc lineage corruption. (`.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:77-95`, `spec.md §2. PROBLEM & PURPOSE`)

### New Questions
- What guarantees keep same-path version chains coherent if multiple callers reach the write transaction across processes?
- Does lineage-state itself enforce logical identity strongly enough to reject a missed cross-path predecessor?
- Is there evidence that scan batch concurrency still propagates `fromScan` to every file instead of just some paths?
- Could any internal caller other than `memory_index_scan` opt into `fromScan` and bypass the guard incorrectly?

### Status
converging
