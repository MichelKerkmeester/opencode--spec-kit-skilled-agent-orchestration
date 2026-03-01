---
title: "Handover: Spec 126 — CONTINUATION - Attempt 4 [126-full-spec-doc-indexing/handover]"
description: "Restart Verification: COMPLETE — DB health confirmed, 760 scanned (0 indexed), 7 updated, 753 unchanged, 0 failed"
trigger_phrases:
  - "handover"
  - "spec"
  - "126"
  - "continuation"
  - "attempt"
  - "full"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Handover: Spec 126 — CONTINUATION - Attempt 4

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v2.2 -->

## Status

**Restart Verification**: COMPLETE — DB health confirmed, 760 scanned (0 indexed), 7 updated, 753 unchanged, 0 failed
**Legacy Cleanup**: COMPLETE — Group A and B files deleted; Backup C retained for audit trail
**Single-Daemon Hardening**: COMPLETE — Duplicate daemons collapsed, fresh runtime launched, startup integrity 761/761, BM25 rebuild 761 docs
**Active Database**: `.opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite` (runtime, single target)
**Health Metrics**: schema_version 14, 761 total rows, 0 stale, 100% content_text populated (761 NOT NULL, 0 NULL), memory_fts 761
**Remaining**: Hand control back to OpenCode-managed MCP lifecycle (optional manual daemon cleanup)

---

## Attempt 4: Post-Restart Verification + Legacy DB Cleanup + Single-Daemon Hardening (2026-02-16)

### Verification Completed

**Health Endpoint**
- Ran `memory_health()`: DB path confirms runtime location `.opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite`
- All embedding provider and vector index fields healthy

**Index Scan**
- Ran `memory_index_scan({})`: scanned 760, indexed 0, updated 7, unchanged 753, failed 0
- All current project files already indexed; 0 new additions needed

**Direct SQLite Metrics** (via manual query)
- `schema_version`: 14
- `total_rows` (memory_index): 761
- `workspace_rows`: 761
- `stale_rows`: 0
- `content_text NOT NULL`: 761 (100%)
- `content_text NULL`: 0
- `memory_fts` row count: 761

**Hybrid Search Verification**
- Ran `memory_search({ query: "typescript schema", limit: 5 })`: returned results
- BM25 ranking operational, FTS5 + vector search functional
- No corruption errors

### Legacy DB File Cleanup Completed

**Group A — Stale development DB** (under `mcp_server/database/`)
- Deleted: `context-index.sqlite`, `context-index.sqlite-shm`, `context-index.sqlite-wal`
- Deleted: `context-index__voyage__voyage-4__1024.sqlite`, `context-index__voyage__voyage-4__1024.sqlite-shm`, `context-index__voyage__voyage-4__1024.sqlite-wal`

**Group B — Stale voyage embedding file** (under `mcp_server/dist/database/`)
- Deleted: `context-index__voyage__voyage-4__1024.sqlite`, `context-index__voyage__voyage-4__1024.sqlite-shm`, `context-index__voyage__voyage-4__1024.sqlite-wal`

**Backup C — Retained for audit trail** (under `mcp_server/dist/database/backups/`)
- Kept: `.opencode/skill/system-spec-kit/mcp_server/dist/database/backups/context-index-pre-runtime-cleanup-20260216.sqlite`

### Single-Daemon Hardening Completed

**Prior Duplicate Daemons**
- Multiple daemon processes were running simultaneously; visibility checks were normalized by consolidating to a single runtime daemon

**Consolidation**
- Terminated all duplicate daemon instances
- Launched one fresh MCP runtime daemon for stabilization

**Startup Log Verification** (from `/tmp/spec-kit-mcp.log`)
- Integrity check: `761 / 761` (all rows accounted for)
- BM25 rebuild: `761 documents` processed
- No startup errors or inconsistencies

### Next Session Checklist

1. [ ] Restart OpenCode → MCP lifecycle will be managed by client (no manual daemon required)
2. [ ] Stop any manual keepalive daemon process if still running
3. [ ] Re-run smoke test:
   ```
   memory_health()           # Confirm DB path and all metrics
   memory_index_scan({})     # Verify no new orphaned files
   memory_search({ query: "typescript schema", limit: 5 })  # Confirm search functional
   ```
4. [ ] If all smoke tests pass, close Spec 126 (optional: clean up manual logs in `/tmp/`)

---

## Attempt 3: FTS5 Corruption Repair & Runtime DB Finalization (2026-02-16, Post-Cleanup)

### Problem Summary

After Schema v14 migration and initial cleanup, `memory_fts` table showed corruption (`database disk image is malformed`). Additionally, the runtime database at `.opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite` contained stale rows from old projects and files no longer on disk. The system had multiple database paths creating confusion about which DB was authoritative.

### Solution: Single Runtime Target + FTS Rebuild + Stale Cleanup

**Phase 1: Identify & Preserve**
- Confirmed runtime DB is the only active target: `.opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite`
- Backed up pre-cleanup state to `.opencode/skill/system-spec-kit/mcp_server/dist/database/backups/context-index-pre-runtime-cleanup-20260216.sqlite`

**Phase 2: Repair FTS5**
- Ran FTS5 rebuild command to repair `memory_fts` table corruption
- Validated 761 documents loaded into BM25 index

**Phase 3: Clean Stale Data**
- Removed all rows pointing to files not in current workspace
- Deleted entries for projects from old sessions
- Result: 0 stale rows, 100% workspace alignment

**Phase 4: Code Patches**
- `mcp_server/handlers/memory-save.ts`: persist `content_text` in update/reinforce flows (not only create/deferred paths)
- `mcp_server/handlers/memory-crud.ts`: `memory_health` now reports actual active DB path (runtime location)

### Current Runtime DB State

```
schema_version:      14
total_rows:          761
workspace_rows:      761
stale_rows:          0
content_text NOT NULL: 761 (100%)
content_text NULL:   0
memory_fts rows:     761
bm25_rebuild docs:   761
```

### Build & Test Status

All components build cleanly and tests pass:
```bash
cd .opencode/skill/system-spec-kit

# Build
npx tsc --noEmit ✅

# Extended memory tests
npx vitest run tests/memory-save-extended.vitest.ts ✅
npx vitest run tests/handler-memory-crud.vitest.ts ✅

# Full build
npm run build ✅
```

### Next Session: MCP Restart Verification Checklist

**⚠️ After restarting the MCP server, run in order:**

1. **Verify health endpoint** (embedding provider DB path):
   ```bash
   memory_health()
   # Confirm: embeddingProvider.databasePath = ".opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite"
   ```

2. **Scan current project files**:
   ```bash
   memory_index_scan({})
   # Monitor output for files indexed and content_text populated
   ```

3. **Verify post-scan metrics** (run memory_health again):
   ```bash
   memory_health()
   # Confirm: all 761 rows present, schema_version = 14, memory_fts and bm25 operational
   ```

4. **Test search functionality** (FTS5 + BM25 + vector):
   ```bash
   memory_search({ query: "typescript schema", limit: 5 })
   # Should return results with proper BM25 ranking
   ```

### Legacy File Cleanup (Status: A/B Complete, Backup Retention Policy Active)

**Group A & B files: ALREADY DELETED in Attempt 4.** No action needed.

**Backup Retention Policy:**
- **Kept for audit trail**: `.opencode/skill/system-spec-kit/mcp_server/dist/database/backups/context-index-pre-runtime-cleanup-20260216.sqlite`
- Rationale: Archive of pre-runtime-cleanup state for incident investigation if needed in future sessions
- Retention: Keep indefinitely or until Spec 126 is formally archived

### Files Modified

| File | Changes |
|------|---------|
| `mcp_server/handlers/memory-save.ts` | Persist `content_text` on update/reinforce paths to keep existing rows BM25/FTS-ready |
| `mcp_server/handlers/memory-crud.ts` | `memory_health` reports active runtime DB path via `vectorIndex.getDbPath()` |

---

## Attempt 2: Schema v14 — BM25 Full-Text Search Fix (2026-02-16)

### Problem

BM25 in-memory search index failed to rebuild on MCP server startup. `rebuildFromDatabase()` in `bm25-index.ts:208` queried a `content` column that didn't exist in `memory_index`, and referenced a `status` column that also didn't exist. Result: BM25 index started empty every session, hybrid search lost its lexical ranking layer.

Root cause: `memory_index` stores only metadata — no document body text. Content was read from disk during indexing and passed to BM25 at runtime, but discarded after the process ended.

### Solution: Schema v14

Added `content_text TEXT` column to `memory_index` so document text persists in the database, surviving server restarts and enabling BM25 + FTS5 full-text search.

### Key Decisions

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Add `content_text TEXT` column via migration v14 | BM25 needs document body text to rebuild from DB | Schema change, FTS5 rebuild, 3 trigger updates |
| Backfill from disk during migration | Populate existing rows without re-indexing | Only 2/293 files found on disk (others from old projects) |
| Fix BM25 query: `content_text` not `content`, `is_archived=0` not `status != 'deleted'` | Both columns referenced were non-existent | BM25 now loads 293 docs (was 0) |
| Pass `contentText: parsed.content` from memory-save handler | New saves store full content alongside metadata | Forward-compatible: all future saves populate content_text |

### Files Modified

| File | Changes | Status |
|------|---------|--------|
| `mcp_server/lib/search/vector-index-impl.ts` | Schema v14 bump, migration (column + FTS5 rebuild + disk backfill), create_schema DDL, index_memory, index_memory_deferred, update_memory all pass contentText | COMPLETE |
| `mcp_server/lib/search/vector-index.ts` | `contentText?: string \| null` on IndexMemoryParams and UpdateMemoryParams | COMPLETE |
| `mcp_server/lib/search/bm25-index.ts` | `rebuildFromDatabase()` — fixed SQL columns and WHERE clause | COMPLETE |
| `mcp_server/handlers/memory-save.ts` | Pass `contentText: parsed.content` to indexMemory() and indexMemoryDeferred() | COMPLETE |
| `mcp_server/tests/bm25-security.vitest.ts` | Updated RD03-RD06 mocks to use `content_text`, `file_path` | COMPLETE |

### Blockers

| Blocker | Status | Resolution |
|---------|--------|------------|
| FTS5 SQLITE_CORRUPT_VTAB after migration | RESOLVED | Ran FTS5 rebuild command to repair content sync |
| 291/293 memories have NULL content_text | OPEN | Files from other projects, not on disk. Need `memory_index_scan` for current project |
| 0 file_paths point to current project | OPEN | All memories from old projects. 85+ spec files on disk unindexed |

### Full Audit Results

Comprehensive audit confirmed all other features healthy:

| Component | Status |
|-----------|--------|
| SQLite integrity | PASS |
| FTS5 (293 entries, 4 columns) | PASS |
| BM25 (293 docs, 1366 terms) | PASS (was 0 before fix) |
| sqlite-vec (v0.1.7-alpha.2, 280 embeddings) | PASS |
| All 22 DB tables | intact |
| All 3 FTS5 triggers (include content_text) | correct |
| All 42 indexes | present |
| 0 orphaned vectors | clean |
| 50+ SQL statements audited | all valid columns |
| `memory_corrections` table | missing by design (feature-flagged) |
| `vec_metadata` table | missing by design (created at runtime with sqlite-vec) |

### For Next Session

**Priority 1:** Run `memory_index_scan` via MCP to populate database with current project files. This will index `.opencode/specs/**/*.md`, skill READMEs, and constitutional files — all with `content_text` populated.

**Priority 2:** Verify end-to-end search after scan. Test FTS5, BM25, and vector search for "typescript" — should return results from the 85+ spec files that reference TypeScript.

**Priority 3:** Consider cleanup of 293 stale memories from other projects via `/memory:manage cleanup`.

**Priority 4:** Commit the 5 modified files to git.

### Verification Commands

```bash
cd .opencode/skill/system-spec-kit/mcp_server

# Build check
npx tsc --noEmit

# BM25 tests
npx vitest run tests/bm25-security.vitest.ts

# Schema version
sqlite3 database/context-index.sqlite "SELECT version FROM schema_version"
# Expected: 14

# Content text population
sqlite3 database/context-index.sqlite "SELECT COUNT(*) FROM memory_index WHERE content_text IS NOT NULL"
# Currently: 2 (will increase after memory_index_scan)
```

---

## Attempt 1: Spec 126 — Verification Follow-up (Previous Session)

### Previous Status

**Implementation**: Complete (75/75 tasks, all code merged)
**Spec 126 Unit Tests**: 143/143 passing in `spec126-full-spec-doc-indexing.vitest.ts`
**Full Suite**: `npm test` passing (122 files, 4184 tests; 72 skipped)
**Remaining**: 3 optional hardening areas for additional direct coverage (filesystem/live DB focused)

---

## Gap 1: `detectSpecLevelFromParsed()` — Private Function

**File**: `mcp_server/handlers/memory-save.ts:547-581`
**Why untested**: Private function (not exported), requires filesystem access

### What It Does

Reads sibling `spec.md` in the same directory to detect the spec documentation level:
1. Opens `spec.md`, reads first 2KB for `<!-- SPECKIT_LEVEL: N -->` marker
2. Maps `3+` → 4, otherwise parses integer 1-3
3. Heuristic fallback: checks sibling filenames (`decision-record.md` → 3, `checklist.md` → 2, else → 1)
4. Returns `null` on any error or missing file

### Called From

`indexMemoryFile()` at line 741-742 — only invoked when `parsed.documentType` is a spec document type (not `memory`, `readme`, or `constitutional`).

### How to Test

**Option A — Export it** (recommended):
```typescript
// Add to export block at line 1258:
export { ..., detectSpecLevelFromParsed };
```
Then test directly with temp directories containing spec.md files with/without markers.

**Option B — Test indirectly** through `indexMemoryFile()`:
- Requires full DB setup (vectorIndex.init, SQLite)
- Create a temp spec folder with spec.md containing `<!-- SPECKIT_LEVEL: 2 -->`
- Call `indexMemoryFile()` on a sibling `plan.md`
- Verify the DB row has `spec_level = 2`

### Test Cases Needed

| # | Input | Expected |
|---|-------|----------|
| 1 | spec.md with `<!-- SPECKIT_LEVEL: 1 -->` | `1` |
| 2 | spec.md with `<!-- SPECKIT_LEVEL: 2 -->` | `2` |
| 3 | spec.md with `<!-- SPECKIT_LEVEL: 3 -->` | `3` |
| 4 | spec.md with `<!-- SPECKIT_LEVEL: 3+ -->` | `4` |
| 5 | spec.md without marker, sibling `decision-record.md` | `3` |
| 6 | spec.md without marker, sibling `checklist.md` | `2` |
| 7 | spec.md without marker, no siblings | `1` |
| 8 | No spec.md in directory | `null` |
| 9 | Unreadable spec.md (permission denied) | `null` |

---

## Gap 2: Schema v13 Migration

**File**: `mcp_server/lib/search/vector-index-impl.ts:735-782`
**Why untested**: `schema-migration.vitest.ts` contains only stubs (`expect(true).toBe(true)`)

### What It Does

Migration from schema v12 → v13:
1. `ALTER TABLE memory_index ADD COLUMN document_type TEXT DEFAULT 'memory'`
2. `ALTER TABLE memory_index ADD COLUMN spec_level INTEGER`
3. `CREATE INDEX IF NOT EXISTS idx_document_type ON memory_index(document_type)`
4. `CREATE INDEX IF NOT EXISTS idx_doc_type_folder ON memory_index(document_type, spec_folder)`
5. Backfill: rows with `importance_tier = 'constitutional'` → `document_type = 'constitutional'`
6. Backfill: rows with `file_path LIKE '%readme.md'` → `document_type = 'readme'`

Each step wrapped in try/catch, gracefully handles `duplicate column` errors for idempotency.

### Fresh DB DDL

`create_schema()` at lines 1211-1212 includes both columns in the table definition:
```sql
document_type TEXT DEFAULT 'memory',
spec_level INTEGER,
```

Index definitions at lines 1346-1347.

### Existing Test File

`mcp_server/tests/schema-migration.vitest.ts` — **ALL STUBS** (lines 7-290). Contains describe blocks for T701-T750 but every `it()` block just does `expect(true).toBe(true)`. This affects all migrations, not just v13.

### How to Test

Requires `better-sqlite3` with an in-memory or temp file database:

```typescript
import Database from 'better-sqlite3';

// 1. Create a v12 schema DB (pre-migration)
// 2. Insert sample rows (constitutional, readme, memory)
// 3. Run migration 13
// 4. Verify columns exist, indexes exist, backfill correct
```

### Test Cases Needed

| # | Scenario | Verify |
|---|----------|--------|
| 1 | Fresh v13 DB | `document_type` and `spec_level` columns exist in DDL |
| 2 | v12 → v13 migration | Both columns added |
| 3 | Migration idempotency | Running migration twice doesn't error |
| 4 | Backfill: constitutional | Rows with `importance_tier='constitutional'` get `document_type='constitutional'` |
| 5 | Backfill: readme | Rows with `file_path LIKE '%readme.md'` get `document_type='readme'` |
| 6 | Backfill: memory unchanged | Other rows keep `document_type='memory'` |
| 7 | Index creation | `idx_document_type` and `idx_doc_type_folder` exist |
| 8 | SCHEMA_VERSION = 13 | Constant is correct |
| 9 | `spec_level` is nullable | INSERT with `spec_level = NULL` succeeds |
| 10 | Default value | INSERT without `document_type` defaults to `'memory'` |

---

## Gap 3: Phase 3 Discovery — `findSpecDocuments()` and `detectSpecLevel()`

**File**: `mcp_server/handlers/memory-index.ts:57-149`
**Why untested**: Requires filesystem (directory walking, file reads)

### findSpecDocuments() (lines 57-107)

Walks `.opencode/specs/` and `specs/` directories to find spec folder documents.

**Signature**: `findSpecDocuments(workspacePath: string, options?: { specFolder?: string | null }): string[]`

**Key behaviors**:
- Checks both `.opencode/specs/` and `specs/` roots
- Matches filenames against `SPEC_DOCUMENT_FILENAMES` set (8 files)
- Excludes: `z_archive/`, `scratch/`, `memory/`, `node_modules/`, hidden dirs (`.xxx`)
- Supports `specFolder` filter (only returns files under matching path)
- Feature flag: returns `[]` when `SPECKIT_INDEX_SPEC_DOCS=false`
- Silently skips unreadable directories

### detectSpecLevel() (lines 114-149)

Same logic as `detectSpecLevelFromParsed()` but designed for standalone use.

**Signature**: `detectSpecLevel(specPath: string): number | null`

Both functions **are exported** (lines 617-625).

### Integration Point

In `handleMemoryIndexScan()` at lines 383-384:
```typescript
const specDocFiles = include_spec_docs ? findSpecDocuments(workspacePath, { specFolder }) : [];
const files = [...specFiles, ...constitutionalFiles, ...readmeFiles, ...projectReadmeFiles, ...specDocFiles];
```

Causal chain creation at lines 527-568 groups indexed spec docs by folder and creates chains.

### How to Test

Create temp directory structures with `fs.mkdtempSync()`:

```typescript
import fs from 'fs';
import path from 'path';
import os from 'os';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spec126-'));
// Create .opencode/specs/003/100-feature/ with spec.md, plan.md, etc.
// Call findSpecDocuments(tmpDir)
// Verify returned paths
```

### Test Cases Needed

**findSpecDocuments():**

| # | Scenario | Expected |
|---|----------|----------|
| 1 | Folder with all 8 spec docs | Returns 8 paths |
| 2 | Folder with only spec.md + plan.md | Returns 2 paths |
| 3 | Folder in z_archive/ | Excluded (0 results) |
| 4 | Folder in scratch/ | Excluded |
| 5 | Folder in memory/ | Excluded |
| 6 | Hidden directory (.draft/) | Excluded |
| 7 | Non-.md file named spec.txt | Excluded |
| 8 | `specFolder` filter matches | Only matching folder's files returned |
| 9 | `specFolder` filter doesn't match | Empty array |
| 10 | `SPECKIT_INDEX_SPEC_DOCS=false` | Empty array |
| 11 | Both `.opencode/specs/` and `specs/` exist | Returns from both |
| 12 | Neither specs directory exists | Empty array |

**detectSpecLevel():**

Same test cases as Gap 1 (tests 1-9), since logic is identical.

---

## Priority & Effort Estimate

| Gap | Priority | Effort | Blocker? |
|-----|----------|--------|----------|
| Gap 1: detectSpecLevelFromParsed | P2 | Low (export + 9 tests) | No — tested indirectly |
| Gap 2: Schema v13 migration | P1 | Medium (DB setup + 10 tests) | No — but schema-migration.vitest.ts is entirely stubbed |
| Gap 3: findSpecDocuments + detectSpecLevel | P1 | Medium (temp dirs + 12+9 tests) | No — functions are exported and working |

**Total new tests needed**: ~40

## Dependencies

- `better-sqlite3` (for Gap 2 — already a project dependency)
- `fs`, `os`, `path` (for Gaps 1 and 3 — Node.js built-ins)
- Temp directory cleanup in `afterAll()` hooks

## Cross-References

- **Spec**: `spec.md`
- **Tasks**: `tasks.md` (T061-T075, all marked complete with caveats noted)
- **Checklist**: `checklist.md` (all verification items marked complete)
- **Test suite**: `mcp_server/tests/spec126-full-spec-doc-indexing.vitest.ts` (143 tests)
- **Stub file**: `mcp_server/tests/schema-migration.vitest.ts` (needs full implementation beyond Spec 126)

<!--
HANDOVER: Spec 126 verification follow-up and optional hardening backlog
3 gaps: private function, schema migration, filesystem discovery
~40 additional tests needed
All implementation code and full-suite verification are complete
-->
