# Context Scan: Memory/Indexing Risks (scripts + mcp_server)

Scope: `.opencode/skill/system-spec-kit/scripts/**` and `.opencode/skill/system-spec-kit/mcp_server/**`.
Exclusion applied: node_modules relocation-only issues.

## Top risks

1. **CRITICAL - DB target drift between scripts and MCP runtime**
   - `scripts/memory/cleanup-orphaned-vectors.ts` hardcodes `.../mcp_server/database/context-index.sqlite` (`.../cleanup-orphaned-vectors.ts:33`).
   - `scripts/spec-folder/folder-detector.ts` hardcodes same DB for `session_learning` lookup (`.../folder-detector.ts:151-155`).
   - MCP runtime resolves DB dynamically (provider/profile/env-aware), not always `context-index.sqlite` (`.../mcp_server/lib/search/vector-index-impl.ts:150-163`, `.../mcp_server/lib/search/vector-index-impl.ts:847`).
   - Risk: cleanup/lookup operate on stale or wrong DB when provider-specific DB files are active.

2. **CRITICAL - Deleted-file path not reconciled in index scan flow**
   - Incremental logic emits `toDelete` (`.../mcp_server/lib/storage/incremental-index.ts:184-186`).
   - Scan handler only processes `toIndex + toUpdate` and does not consume `toDelete` (`.../mcp_server/handlers/memory-index.ts:313-314`).
   - Risk: stale `memory_index` records can persist after file deletion, causing stale retrieval/index integrity drift.

3. **HIGH - Documented partial-success window in atomic save**
   - `atomicSaveMemory` explicitly states file-write + DB index are not truly atomic; indexing happens after write (`.../mcp_server/handlers/memory-save.ts:1104-1109`, `.../mcp_server/handlers/memory-save.ts:1134-1147`).
   - Recovery flow targets `_pending` files, but post-write indexing failures return partial success and do not leave `_pending` artifact (`.../mcp_server/lib/storage/transaction-manager.ts:13`, `.../mcp_server/lib/storage/transaction-manager.ts:160-203`).
   - Risk: durable disk file may remain unindexed until later/manual scan.

4. **MEDIUM - Pending-file recovery is suffix-based, not memory-path constrained**
   - Startup recovery scans workspace and renames any file matching `_pending` suffix pattern (`.../mcp_server/context-server.ts:272-274`, `.../mcp_server/lib/storage/transaction-manager.ts:212-220`, `.../mcp_server/lib/storage/transaction-manager.ts:245-247`).
   - Risk: non-memory files using `_pending` naming convention could be unexpectedly renamed.

## Quick mitigation direction

- Centralize DB path resolution into one shared resolver used by scripts and MCP runtime.
- Add explicit deletion reconciliation step in `memory_index_scan` for `toDelete` files.
- Add a durable retry marker/queue for post-write indexing failures (not only `_pending` pre-rename cases).
- Restrict pending recovery to known memory directories/patterns before rename.
