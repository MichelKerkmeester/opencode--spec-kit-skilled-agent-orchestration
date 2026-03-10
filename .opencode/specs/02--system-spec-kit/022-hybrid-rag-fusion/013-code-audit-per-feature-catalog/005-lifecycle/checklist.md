## F-01: Checkpoint creation (checkpoint_create)
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:**
  1. Feature test inventory references `mcp_server/tests/retry.vitest.ts`, but the file is absent (`feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md:113`; filesystem check found only `tests/retry-manager.vitest.ts`).
  2. Handler/integration suites are still marked deferred, so tool-level behavior is not fully exercised against DB fixtures (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:32`, `.opencode/skill/system-spec-kit/mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts:28`).
- **Playbook Coverage:** EX-023..EX-027 (phase-level mapping present; per-feature scenario mapping is MISSING).
- **Recommended Fixes:**
  1. Remove or replace stale `retry.vitest.ts` references in feature source tables.
  2. Add non-deferred `checkpoint_create` integration coverage through the handler with real DB fixtures.

## F-02: Checkpoint listing (checkpoint_list)
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:**
  1. Feature references missing `mcp_server/tests/retry.vitest.ts` (`feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md:108`).
  2. Boundary checks in handler tests allow either throw or success, so limit-clamp behavior is not asserted deterministically (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:183-212`).
  3. Deferred integration suite leaves ordering/filter behavior under real MCP wiring under-tested (`.opencode/skill/system-spec-kit/mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts:28`).
- **Playbook Coverage:** EX-023..EX-027 (phase-level mapping present; per-feature scenario mapping is MISSING).
- **Recommended Fixes:**
  1. Add deterministic assertions for default limit (50), max clamp (100), and descending `created_at` ordering.
  2. Remove stale `retry.vitest.ts` references from the feature inventory.

## F-03: Checkpoint restore (checkpoint_restore)
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:**
  1. Feature references missing `mcp_server/tests/retry.vitest.ts` (`feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:114`).
  2. Handler tests are mostly validation-oriented and run with optional modules effectively disabled (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:17-20,218-279`), so cache/BM25 rebuild side-effects after restore are not deeply validated.
  3. End-to-end lifecycle integration suite remains deferred (`.opencode/skill/system-spec-kit/mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts:28`).
- **Playbook Coverage:** EX-023..EX-027 (phase-level mapping present; per-feature scenario mapping is MISSING).
- **Recommended Fixes:**
  1. Add integration tests that assert post-restore cache invalidation and BM25/trigger refresh behavior.
  2. Remove stale `retry.vitest.ts` references in feature metadata.

## F-04: Checkpoint deletion (checkpoint_delete)
- **Status:** WARN
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:**
  1. Feature references missing `mcp_server/tests/retry.vitest.ts` (`feature_catalog/05--lifecycle/04-checkpoint-deletion-checkpointdelete.md:110`).
  2. Integration checkpoint lifecycle suite is deferred, so delete-confirm safety is not validated in full pipeline flow (`.opencode/skill/system-spec-kit/mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts:28`).
- **Playbook Coverage:** EX-023..EX-027 (phase-level mapping present; per-feature scenario mapping is MISSING).
- **Recommended Fixes:**
  1. Add end-to-end test for `confirmName` mismatch/match paths through MCP tool dispatch.
  2. Remove stale `retry.vitest.ts` references from feature docs.

## F-05: Async ingestion job lifecycle
- **Status:** FAIL
- **Code Issues:**
  1. Inconsistent ingest path limit: handler allows 100 (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:34,74-76`) while tool schema caps at 50 (`.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:309-312`).
- **Standards Violations:**
  1. Input constraints are duplicated in multiple layers without a shared constant, causing drift and inconsistent behavior (`handlers/memory-ingest.ts` vs `schemas/tool-input-schemas.ts`).
- **Behavior Mismatch:**
  1. The externally declared contract (schema max 50) and internal guard (max 100) diverge, so behavior depends on validation entrypoint rather than a single source of truth.
- **Test Gaps:**
  1. Feature references missing `mcp_server/tests/retry.vitest.ts` (`feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:92`).
  2. Handler tests do not assert max-path boundary behavior (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:58-87`).
  3. Queue tests validate outcomes but do not assert full state transition sequence or explicit single-worker mutual exclusion under contention (`.opencode/skill/system-spec-kit/mcp_server/tests/job-queue.vitest.ts:132-226`).
- **Playbook Coverage:** EX-023..EX-027 (phase-level mapping present; per-feature scenario mapping is MISSING).
- **Recommended Fixes:**
  1. Define one shared `MAX_INGEST_PATHS` constant and consume it in both schema and handler.
  2. Add boundary tests for 50/51 paths and schema/handler parity.
  3. Add concurrency/state-transition assertions for sequential worker guarantees.

## F-06: Startup pending-file recovery
- **Status:** FAIL
- **Code Issues:**
  1. Pending recovery renames pending files to final paths without checking whether the corresponding DB write actually committed (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:317-337`).
- **Standards Violations:** NONE
- **Behavior Mismatch:**
  1. Feature states stale pending files should be logged and left for manual review (`feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md:7`), but startup currently bulk-recovers via rename (`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:445-457`) and `recoverPendingFile` does not implement stale classification (`transaction-manager.ts:317-337`).
- **Test Gaps:**
  1. Transaction manager tests cover successful rename recovery but not stale/uncommitted differentiation (`.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:153-191,293-391`).
  2. Context-server pending recovery checks are static source-pattern assertions rather than behavioral recovery tests (`.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1543-1563`).
- **Playbook Coverage:** EX-023..EX-027 (phase-level mapping present; per-feature scenario mapping is MISSING).
- **Recommended Fixes:**
  1. Add stale detection (e.g., DB row/content-hash verification) before rename.
  2. Keep unverifiable pending files untouched and report them for manual review.
  3. Add integration tests covering committed-vs-uncommitted crash recovery branches.

## F-07: Automatic archival subsystem
- **Status:** FAIL
- **Code Issues:**
  1. Archival path updates `memory_index.is_archived` and BM25 only; no vector embedding cleanup path exists (`.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:367-427`; no `vec_memories` operations in module).
- **Standards Violations:** NONE
- **Behavior Mismatch:**
  1. Feature claims archival can optionally remove BM25 entries and vector embeddings (`feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md:5`), but implementation only synchronizes BM25 (`archival-manager.ts:367-407`) and leaves vector rows untouched.
- **Test Gaps:**
  1. Archival tests assert flags/stats but not vector cleanup semantics (`.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:240-307,456-520`).
  2. Search archival suite is largely deferred placeholder assertions (`.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:21-58`).
- **Playbook Coverage:** EX-023..EX-027 (phase-level mapping present; per-feature scenario mapping is MISSING).
- **Recommended Fixes:**
  1. Implement configurable vector archival cleanup (delete/retain mode) in tandem with BM25 sync.
  2. Add regression tests validating vec/BM25 behavior for archive/unarchive.
  3. Replace placeholder search-archival tests with DB-backed assertions.
