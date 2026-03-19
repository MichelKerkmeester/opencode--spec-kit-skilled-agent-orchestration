# NEW-134 — Startup Pending-File Recovery Evidence

## Preconditions
- MCP server healthy (v1.7.2)
- Recovery logic exists in `transaction-manager.ts` and `context-server.ts`
- No MCP tool exposes startup recovery directly (internal server operation)

## Evidence Type
**Code analysis + unit test verification** — startup pending-file recovery is an internal server operation that runs at startup via `setImmediate()`. It cannot be triggered through MCP tools at runtime.

## Code Analysis

### 1. Recovery Function
**File:** `mcp_server/lib/storage/transaction-manager.ts`

`recoverAllPendingFiles(location, isCommittedInDb)`:
- Scans a given directory for `_pending` suffix files
- For each pending file, calls `isCommittedInDb(originalPath)` callback
- **Committed files**: renamed back to original path (recovered)
- **Stale files**: NOT deleted, left in place with explicit stale classification for manual review

**Pending file naming (lines 15-16, 87-105):**
```typescript
const PENDING_SUFFIX = '_pending';
// getPendingPath(): /path/file.md → /path/file_pending.md
// isPendingFile(): detects _pending suffix
// getOriginalPath(): reverses transformation
```

### 2. Committed vs Stale Detection
**File:** `mcp_server/context-server.ts` (lines 468-474)

```typescript
const isCommittedInDb = (originalPath: string): boolean => {
  const row = database.prepare('SELECT 1 FROM memory_index WHERE file_path = ?').get(originalPath);
  return !!row;
};
```
- Checks `memory_index` table for matching `file_path`
- Row exists → committed (will recover)
- No row → stale (left for manual review)

### 3. Scan Root Configuration
**File:** `mcp_server/context-server.ts` (lines 507-581, 1070)

```typescript
// Startup scan at server boot
setImmediate(() => startupScan(DEFAULT_BASE_PATH));
```
- Recovery called at line 525: `await recoverPendingFiles(basePath);`
- Scan root is `DEFAULT_BASE_PATH` (configured memory base)
- Covers `.opencode/specs` and constitutional locations within the configured base

### 4. Recovery Result Types
**File:** `mcp_server/lib/storage/transaction-manager.ts` (lines 39-43)

```typescript
interface RecoveryResult {
  path: string;
  recovered: boolean;
  error?: string;
}
```

**Aggregated (context-server.ts lines 112-118):**
```typescript
interface PendingRecoveryResult {
  found: number;
  processed: number;
  recovered: number;
  failed: number;
  results: unknown[];
}
```

### 5. Unit Test Coverage
**File:** `mcp_server/tests/transaction-manager-recovery.vitest.ts`

- **T007-R1 to R9**: Recovery with and without DB check
- **T007-R3**: Stale detection when `isCommittedInDb` returns false
- **T007-R4**: Stale pending files are NOT deleted, left for manual review
- **T007-R5**: `recoverAllPendingFiles` passes callback to each file
- **T007-R6**: Mixed committed/stale results handled correctly

## Expected Signals Checklist
- [x] Committed pending file recovers to original path (code: rename logic in recoverAllPendingFiles)
- [x] Stale pending file remains with explicit stale classification (code: T007-R4 test confirms no deletion)
- [x] Startup scan covers configured/allowed roots (code: DEFAULT_BASE_PATH at startup)
- [ ] Runtime observation of actual file recovery (requires server restart, not available via MCP)

## Observations
- Recovery is a startup-only operation — cannot be triggered through MCP tools
- Two-pass design: filesystem scan for `_pending` files + DB committed check
- Stale files are preserved for safety (manual review required)
- Comprehensive test coverage confirms behavior (T007-R1 through R9)
- Scan root is the configured memory base path, not arbitrary directories

## Verdict: **PARTIAL**
Core behavior confirmed via code analysis and unit test evidence: committed/stale divergence implemented correctly, scan roots are configured appropriately, stale files preserved for manual review. Not directly observable at runtime without server restart.
