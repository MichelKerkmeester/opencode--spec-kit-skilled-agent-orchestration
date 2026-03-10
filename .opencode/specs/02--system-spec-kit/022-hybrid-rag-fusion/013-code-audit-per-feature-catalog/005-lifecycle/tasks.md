# Tasks — Phase 005: Lifecycle

## Summary

| Priority | Count | Description                                      |
| -------- | ----- | ------------------------------------------------ |
| **P0**   | 5     | FAIL findings — correctness bugs, behavior drift |
| **P1**   | 0     | —                                                |
| **P2**   | 7     | WARN findings — test/doc gaps only               |
| **Total**| 12    |                                                  |

---

## P0 — FAIL (Immediate Fix Required)

### T-01: Unify ingest path limit to single constant
- **Priority:** P0
- **Feature:** F-05 Async ingestion job lifecycle
- **Status:** TODO
- **Source:** `handlers/memory-ingest.ts:34,74-76` vs `schemas/tool-input-schemas.ts:309-312`
- **Issue:** Handler allows 100 paths while tool schema caps at 50; behavior depends on which validation entrypoint is hit, violating single-source-of-truth.
- **Fix:** Define one shared `MAX_INGEST_PATHS` constant and consume it in both schema and handler.

### T-02: Add ingest path boundary and concurrency tests
- **Priority:** P0
- **Feature:** F-05 Async ingestion job lifecycle
- **Status:** TODO
- **Source:** `tests/handler-memory-ingest.vitest.ts:58-87`, `tests/job-queue.vitest.ts:132-226`
- **Issue:** Handler tests do not assert max-path boundary behavior; queue tests do not assert full state transition sequence or single-worker mutual exclusion under contention.
- **Fix:** Add boundary tests for 50/51 paths and schema/handler parity; add concurrency/state-transition assertions for sequential worker guarantees.

### T-03: Add stale-pending-file detection before rename
- **Priority:** P0
- **Feature:** F-06 Startup pending-file recovery
- **Status:** TODO
- **Source:** `lib/storage/transaction-manager.ts:317-337`, `context-server.ts:445-457`
- **Issue:** Pending recovery renames files to final paths without checking whether the corresponding DB write committed; feature spec says stale files should be logged for manual review, but implementation bulk-recovers all.
- **Fix:** Add stale detection (DB row/content-hash verification) before rename; leave unverifiable pending files untouched and report for manual review. Add integration tests covering committed-vs-uncommitted crash recovery branches.

### T-04: Add committed-vs-uncommitted crash recovery tests
- **Priority:** P0
- **Feature:** F-06 Startup pending-file recovery
- **Status:** TODO
- **Source:** `tests/transaction-manager.vitest.ts:153-191,293-391`, `tests/context-server.vitest.ts:1543-1563`
- **Issue:** Transaction manager tests cover successful rename but not stale/uncommitted differentiation; context-server checks are static source-pattern assertions, not behavioral recovery tests.
- **Fix:** Extend transaction manager and context-server test suites with committed-vs-uncommitted crash recovery branches.

### T-05: Implement vector archival cleanup path
- **Priority:** P0
- **Feature:** F-07 Automatic archival subsystem
- **Status:** TODO
- **Source:** `lib/cognitive/archival-manager.ts:367-427`
- **Issue:** Archival updates `memory_index.is_archived` and BM25 only; no `vec_memories` cleanup path exists despite feature claiming optional vector embedding removal.
- **Fix:** Implement configurable vector archival cleanup (delete/retain mode) in tandem with BM25 sync; add regression tests validating vec/BM25 behavior for archive/unarchive; replace placeholder search-archival tests with DB-backed assertions.

---

## P2 — WARN (Documentation / Test Gaps)

### T-06: Remove stale retry.vitest.ts reference and add checkpoint_create integration tests
- **Priority:** P2
- **Feature:** F-01 Checkpoint creation (checkpoint_create)
- **Status:** TODO
- **Source:** `feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md:113`, `tests/handler-checkpoints.vitest.ts:32`, `tests/integration-checkpoint-lifecycle.vitest.ts:28`
- **Issue:** Feature test inventory references nonexistent `mcp_server/tests/retry.vitest.ts`; handler/integration suites are deferred so tool-level behavior is not exercised against DB fixtures.
- **Fix:** Remove or replace stale `retry.vitest.ts` references; add non-deferred `checkpoint_create` integration coverage through the handler with real DB fixtures.

### T-07: Add deterministic checkpoint_list assertions
- **Priority:** P2
- **Feature:** F-02 Checkpoint listing (checkpoint_list)
- **Status:** TODO
- **Source:** `tests/handler-checkpoints.vitest.ts:183-212`, `tests/integration-checkpoint-lifecycle.vitest.ts:28`, `feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md:108`
- **Issue:** Boundary checks allow either throw or success; limit-clamp behavior not asserted deterministically; ordering/filter behavior under MCP wiring under-tested. Stale `retry.vitest.ts` reference present.
- **Fix:** Add deterministic assertions for default limit (50), max clamp (100), and descending `created_at` ordering; remove stale `retry.vitest.ts` references.

### T-08: Add post-restore cache/BM25 rebuild tests
- **Priority:** P2
- **Feature:** F-03 Checkpoint restore (checkpoint_restore)
- **Status:** TODO
- **Source:** `tests/handler-checkpoints.vitest.ts:17-20,218-279`, `tests/integration-checkpoint-lifecycle.vitest.ts:28`, `feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:114`
- **Issue:** Handler tests are validation-oriented with optional modules disabled; cache/BM25 rebuild side-effects after restore are not deeply validated; lifecycle integration remains deferred. Stale `retry.vitest.ts` reference present.
- **Fix:** Add integration tests that assert post-restore cache invalidation and BM25/trigger refresh behavior; remove stale `retry.vitest.ts` references.

### T-09: Add checkpoint_delete confirmName end-to-end test
- **Priority:** P2
- **Feature:** F-04 Checkpoint deletion (checkpoint_delete)
- **Status:** TODO
- **Source:** `tests/integration-checkpoint-lifecycle.vitest.ts:28`, `feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md:110`
- **Issue:** Integration checkpoint lifecycle suite is deferred; delete-confirm safety not validated in full pipeline flow. Stale `retry.vitest.ts` reference present.
- **Fix:** Add end-to-end test for `confirmName` mismatch/match paths through MCP tool dispatch; remove stale `retry.vitest.ts` references.

### T-10: Remove stale retry.vitest.ts reference (F-05)
- **Priority:** P2
- **Feature:** F-05 Async ingestion job lifecycle
- **Status:** TODO
- **Source:** `feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:92`
- **Issue:** Feature references nonexistent `mcp_server/tests/retry.vitest.ts`.
- **Fix:** Remove stale reference from feature inventory.

### T-11: Remove stale retry.vitest.ts reference (F-06)
- **Priority:** P2
- **Feature:** F-06 Startup pending-file recovery
- **Status:** TODO
- **Source:** `feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md`
- **Issue:** Feature references nonexistent `mcp_server/tests/retry.vitest.ts`.
- **Fix:** Remove stale reference from feature inventory.

### T-12: Remove stale retry.vitest.ts reference (F-07)
- **Priority:** P2
- **Feature:** F-07 Automatic archival subsystem
- **Status:** TODO
- **Source:** `feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md`
- **Issue:** Feature references nonexistent `mcp_server/tests/retry.vitest.ts`.
- **Fix:** Remove stale reference from feature inventory.
