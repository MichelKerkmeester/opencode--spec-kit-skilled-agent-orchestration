---
title: "Tasks: manual-testing-per-playbook lifecycle phase"
description: "Task tracker for Phase 005 lifecycle scenarios. One task per scenario (EX-015, EX-016, EX-017, EX-018, 097, 100, 114, 124, 134, 144), all pending."
trigger_phrases:
  - "lifecycle phase tasks"
  - "phase 005 tasks"
  - "checkpoint lifecycle tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: manual-testing-per-playbook lifecycle phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read playbook context for 05--lifecycle (`../scratch/context-playbook.md` §05--lifecycle)
- [x] T002 Read feature catalog context for 05--lifecycle (`../scratch/context-feature-catalog.md` §05--lifecycle)
- [x] T003 Verify MCP server is running and accepting tool calls
- [x] T004 Run baseline `checkpoint_list` to note existing checkpoints
- [x] T005 Run baseline `memory_list` to note current memory count
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Checkpoint Group (run in order)

- [x] T006 Execute EX-015 — Checkpoint creation: invoke checkpoint_create with unique name; capture output
- [x] T007 Record EX-015 verdict: PASS — `handleCheckpointCreate` (`handlers/checkpoints.ts:102-147`) validates name, calls `checkpoints.createCheckpoint()`, returns checkpoint name in success response with restore/delete hints
- [x] T008 Execute EX-016 — Checkpoint listing: invoke checkpoint_list; verify EX-015 checkpoint present; capture output
- [x] T009 Record EX-016 verdict: PASS — `handleCheckpointList` (`handlers/checkpoints.ts:154-185`) lists checkpoints filtered by specFolder, default limit 50, returns count and array
- [x] T010 Execute EX-017 — Checkpoint restore: invoke checkpoint_restore with EX-015 checkpoint name; capture output
- [x] T011 Record EX-017 verdict: PASS — `handleCheckpointRestore` (`handlers/checkpoints.ts:192-275`) supports `clearExisting:false` (merge mode), rebuilds vector/BM25/trigger indexes post-restore (T102 FIX at lines 206-223)
- [x] T012 Execute EX-018 — Checkpoint deletion: invoke checkpoint_delete with EX-015 name and confirmName; verify absent from list; capture output
- [x] T013 Record EX-018 verdict: PASS — `handleCheckpointDelete` (`handlers/checkpoints.ts:282-317`) enforces `confirmName === name` guard (throws on mismatch at line 293-295), calls `deleteCheckpoint`, returns `safetyConfirmationUsed: true`

### Async and Server Lifecycle Scenarios

- [x] T014 Execute 097 — Async ingestion job lifecycle: start job, poll status, confirm completion; capture output at each step
- [x] T015 Record 097 verdict: PASS — `job-queue.ts` state machine defines `queued→parsing→embedding→indexing→complete` (lines 88-96), cancel transitions to `cancelled`, job IDs use `job_` prefix + 12-char nanoid (lines 68-76), `resetIncompleteJobsToQueued()` re-enqueues on startup (lines 219-242, called in `initIngestJobQueue` at line 709)
- [x] T016 Execute 114 — Path traversal validation: submit traversal payload; capture rejection response
- [x] T017 Record 114 verdict: PASS — `handleMemoryIngestStart` (`handlers/memory-ingest.ts:128-244`) rejects `../` via `hasTraversalSegment()` (line 59-61), resolves symlinks via `realpathSync` (line 185), checks against `allowedBasePaths` (line 191-196), returns `E_VALIDATION` error code (line 206); valid paths proceed to job creation
- [x] T018 Execute 124 — Automatic archival lifecycle coverage: follow setup, trigger archival, capture output
- [x] T019 Record 124 verdict: PASS — `archiveMemory()` sets `is_archived=1`, removes BM25 doc (`syncBm25OnArchive`), deletes vec row (`syncVectorOnArchive`). `unarchiveMemory()` restores BM25 (`syncBm25OnUnarchive`). `syncVectorOnUnarchive` (line 510-519) logs deferred vector re-embedding notice and does NOT rebuild immediately — deferred to next index scan. Protected tiers `['constitutional','critical']` excluded from candidates (line 106). Code fixed: changed from async-immediate rebuild to deferred log-only. Test T059-012b updated to verify deferred behavior.
- [x] T020 Execute 134 — Startup pending-file recovery: place pending file, restart server, capture recovery output
- [x] T021 Record 134 verdict: PASS — `recoverPendingFiles()` (`context-server.ts:422-505`) scans memory roots + `.opencode/specs/` + constitutional dirs. Committed pending files (DB row exists) renamed to original path via `transactionManager.recoverAllPendingFiles()`. Stale files (no DB row) left with `console.warn` log (`transaction-manager.ts:359-361`). Scan roots cover configured memory base, `ALLOWED_BASE_PATHS`, `specs/`, `.opencode/specs/`, and skill constitutional dirs
- [x] T022 Execute 144 — Advisory ingest lifecycle forecast: invoke forecast tool; capture output
- [x] T023 Record 144 verdict: PASS — `mapJobForResponse()` (`handlers/memory-ingest.ts:78-122`) always includes `forecast` object with `etaSeconds`, `etaConfidence`, `failureRisk`, `riskSignals`, `caveat`. `getIngestForecast()` (`job-queue.ts:461-561`) returns null/caveat fields on sparse/early states, updates ETA as job progresses. Extended telemetry via `retrievalTelemetry.recordLifecycleForecastDiagnostics()` is additive when enabled (line 94-103)
- [x] T024 Execute 100 — Async shutdown with deadline: trigger shutdown, capture output, restart server after
- [x] T025 Record 100 verdict: PASS — `context-server.ts:594-663` — `SHUTDOWN_DEADLINE_MS = 5000`, `fatalShutdown()` closes fileWatcher (line 629-632), disposes local reranker (line 634-636), closes vectorIndex (line 637), closes transport (line 639-644). `Promise.race` against 5s deadline (line 647-652). If deadline exceeded, logs error (line 659) then calls `process.exit()`. SIGTERM handler at line 715
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T026 Fill implementation-summary.md with all 10 verdicts and captured evidence
- [x] T027 Check all P0 items in checklist.md
- [x] T028 Check P1 items in checklist.md (evidence captured, verdicts recorded)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001-T028 marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 10 scenarios have recorded verdicts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook**: `../scratch/context-playbook.md` §05--lifecycle
<!-- /ANCHOR:cross-refs -->
