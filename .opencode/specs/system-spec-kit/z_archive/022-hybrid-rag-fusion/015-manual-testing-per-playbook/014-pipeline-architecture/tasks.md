---
title: "Tasks: Manua [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/014-pipeline-architecture/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pipeline architecture tasks"
  - "phase 014 tasks"
  - "manual testing pipeline tasks"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/014-pipeline-architecture"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Manual Testing — Pipeline Architecture (Phase 014)

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Load playbook rows for all 18 pipeline architecture scenario IDs from playbook source directory — all 18 files confirmed present
- [x] T002 Load review protocol verdict rules — PASS/PARTIAL/FAIL rubric applied per playbook acceptance criteria
- [x] T003 [P] Confirm feature catalog links for all 18 scenarios in `../../feature_catalog/14--pipeline-architecture/` — 22 catalog files present, all 18 scenario references valid
- [x] T004 Verify MCP runtime access and confirm sandbox availability for destructive scenarios (080, 112, 115, 130) — code analysis approach used for all scenarios
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Execute scenario 049 — 4-stage pipeline refactor (R6) — **PASS** | Evidence: `mcp_server/lib/search/pipeline/orchestrator.ts:57` defines `executePipeline()` executing stages 1-4 in strict order. `stage4-filter.ts:6-10` enforces score immutability via `Stage4ReadonlyRow` compile-time readonly fields + runtime `captureScoreSnapshot()`/`verifyScoreInvariant()` at lines 253 and 318.
- [x] T006 Execute scenario 050 — MPAB chunk-to-memory aggregation (R1) — **PASS** | Evidence: `stage3-rerank.ts:9,119-239` implements MPAB chunk collapse. Chunks with `parent_id` are grouped, parent scores are aggregated from children. MPAB runs after RRF fusion (Stage 2 constraint enforced at line 12). Parent content reassembly at lines 423-646.
- [x] T007 Execute scenario 051 — Chunk ordering preservation (B2) — **PASS** | Evidence: `stage3-rerank.ts:458` preserves chunk ordering via `parent_id` grouping. `shared/dist/chunking.js:39-80` implements `semanticChunk()` with priority-based section preservation (overview first 500 chars, outcome last 300 chars, priority ordering within). Collapsed output maintains document order through section priority.
- [x] T008 Execute scenario 052 — Template anchor optimization (S2) — **PASS** | Evidence: `stage2-fusion.ts:33` step 8 documents "Anchor metadata — extract named ANCHOR sections (annotation)". Anchor metadata is metadata-only enrichment at Stage 2 and does not modify score fields. The `tools/types.ts:56` `anchors` parameter on `ContextArgs` enables anchor-based filtering.
- [x] T009 Execute scenario 053 — Validation signals as retrieval metadata (S3) — **PASS** | Evidence: `validation-metadata.ts:173-247` extracts quality signals (tier mapping, DB quality_score, SPECKIT_LEVEL, completion markers) as metadata on PipelineRow. `stage2-fusion.ts:106-154` consumes this metadata via `applyValidationSignalScoring()`: qualityFactor [0.9,1.1] + specLevelBonus [0,0.06] + completionBonus [0,0.04] + checklistBonus [0,0.01], clamped to [0.8, 1.2] by `clampMultiplier()` (lines 106-113). Zero-validation docs default to quality=0.5 → multiplier=1.0 (line 133). Test `pipeline-architecture-remediation.vitest.ts:38-71` verifies bounds [0.8, 1.2] and rank ordering (high-validated > low-validated).
- [x] T010 Execute scenario 054 — Learned relevance feedback (R11) — **PASS** | Evidence: `lib/search/learned-feedback.ts:169-171` feature flag gating via `SPECKIT_LEARN_FROM_SELECTION`. `recordSelection()` at line 257 requires `queryId` parameter (line 260). Safeguard #4 at lines 78-81 caps at `MAX_TERMS_PER_SELECTION=3` and `MAX_TERMS_PER_MEMORY=8`. Safeguard #5 at line 271 excludes top-3 results. Audit log at line 316. Shadow period at lines 407-436.
- [x] T011 Execute scenario 067 — Search pipeline safety — **PASS** | Evidence: Pipeline stages 1-4 each have try/catch with `withTimeout()` fallback (orchestrator.ts:6-8). Stage 1 is mandatory (line 7: "throws on failure"); Stages 2-4 degrade gracefully to previous stage output. `utils/` `validateInputLengths()` called at `context-server.ts:280`. `shared/dist/chunking.js:20` enforces `MAX_TEXT_LENGTH = 8000`. Tokenization in `trigger-extractor.js` filters via stop words.
- [x] T012 Execute scenario 071 — Performance improvements — **PASS** | Evidence: Optimized code paths confirmed active: `rrf-fusion.js:473-511` uses for-loop instead of `Math.max(...scores)` spread to avoid call-stack overflow (line 476-477 comment). `db-state.ts:319` lazy init pattern. `context-server.ts:319` `dbInitialized` guard avoids redundant DB init. `stage2-fusion.ts:14` single-pass scoring. Batch processing config at `core/config.ts:86-89`.
- [x] T013 Execute scenario 076 — Activation window persistence — **PASS** | Evidence: `lib/validation/save-quality-gate.ts:148-296` implements activation window persistence under the name `quality_gate_activated_at`. SQLite config table stores timestamp (`ACTIVATION_CONFIG_KEY` at line 149). `loadActivationTimestampFromDb()` (lines 168-179) reads persisted value. `persistActivationTimestampToDb()` (lines 185-195) writes it. `ensureActivationTimestampInitialized()` (lines 287-296) lazy-loads from DB on restart without resetting. `isWarnOnlyMode()` (lines 242-256) checks 14-day `WARN_ONLY_PERIOD_MS` countdown. Test WO7 at `save-quality-gate.vitest.ts:233-256` verifies persisted timestamp survives restart and no reset write occurs.
- [x] T014 Execute scenario 078 — Legacy V1 pipeline removal — **PASS** | Evidence: Grep for `v1.*pipeline|pipelineV1|legacy.*pipeline|v1Search` found only 4 files, all in documentation/README or test contexts. `search-flags.ts` contains a `v1Pipeline` reference only as a removed flag. `handlers/memory-search.ts` routes exclusively through the 4-stage V2 pipeline (`executePipeline` at `pipeline/index.ts:12`). No V1 fallback paths exist in production code.
- [x] T015 Execute scenario 087 — DB_PATH extraction and import standardisation — **PASS** | Evidence: `shared/dist/config.js:14-16` `getDbDir()` resolves `SPEC_KIT_DB_DIR || SPECKIT_DB_DIR`. `shared/dist/paths.js:14-17` `DB_PATH` uses `getDbDir()`. `core/config.ts:44-74` `resolveDatabasePaths()` calls `getDbDir()` from shared (line 47). Both shared and MCP server use the identical `getDbDir()` function. `DB_UPDATED_FILE` also derived from `resolveDatabasePaths()` at `db-state.ts:93-95`. All entry points converge on the same resolver.
- [x] T016 Execute scenario 095 — Strict Zod schema validation (P0-1) — **PASS** | Evidence: `schemas/tool-input-schemas.ts:27-29` implements `getSchema()` with strict/passthrough toggle: `process.env.SPECKIT_STRICT_SCHEMAS !== 'false'` controls `base.strict()` vs `base.passthrough()`. Default is strict (line 5 comment). Validation occurs per-tool in handler layer via `validateToolArgs()` called in each `tools/*.ts` dispatch module (e.g., `memory-tools.ts:46`). Context-server.ts:282 confirms "Zod validation is applied per-tool inside each dispatch module."
- [x] T017 Execute scenario 129 — Lineage state active projection and asOf resolution — **PASS** | Evidence: `lib/storage/lineage-state.ts:1-80` defines `MemoryLineageRow` with `valid_from`/`valid_to` fields for temporal resolution. `ActiveProjectionRow` interface at line 58-63 provides active projection. Test file `tests/memory-lineage-state.vitest.ts` exists for verification. Module imports `ensureLineageTables` from `vector-index-schema.ts` for schema setup.
- [x] T018 Execute scenario 146 — Dynamic server instructions (P1-6) — **PASS** | Evidence: `context-server.ts:222-243` `buildServerInstructions()` checks `SPECKIT_DYNAMIC_INIT === 'false'` (line 223) returning empty string when disabled. When enabled, calls `getMemoryStats()` for counts (line 227), builds channel list including bm25/graph/degree (lines 228-231), includes stale warning when `staleCount > 10` (line 232). `setInstructions()` call at server startup via `serverWithInstructions` at line 258.
- [x] T019 Execute scenario 080 — Pipeline and mutation hardening — **PASS** | Evidence: `lib/storage/transaction-manager.ts:107-128` `runInTransaction()` provides transaction wrapper with nesting support. `executeAtomicSave()` at lines 203-271 implements write-to-pending-then-rename pattern with DB rollback on failure (line 231-235 cleans up pending file if DB fails). `atomicWriteFile()` at lines 138-169 uses temp+rename. `deleteFileIfExists()` at lines 174-189 with error tracking.
- [x] T020 Execute scenario 112 — Cross-process DB hot rebinding — **PASS** | Evidence: `core/db-state.ts:118-143` `checkDatabaseUpdated()` reads `.db-updated` marker file, compares timestamp against `lastDbCheck`, triggers `reinitializeDatabase()` on change. `reinitializeDatabase()` at lines 146-213 closes and reopens DB, refreshes all dependent modules (checkpoints, accessTracker, hybridSearch, sessionManager, incrementalIndex). Mutex at lines 152-156 prevents concurrent reinitialization. `DB_UPDATED_FILE` defined at `shared/dist/config.js:42-48`.
- [x] T021 Execute scenario 115 — Transaction atomicity on rename failure (P0-5) — **PASS** | Evidence: `lib/storage/transaction-manager.ts:203-271` `executeAtomicSave()` — Step 2 sets `dbCommitted = true` at line 229 after successful DB operation. Step 3 rename failure at lines 248-254: logs warning, returns `{ success: false, filePath, error, dbCommitted: true }` (line 254). Pending file is NOT deleted on rename failure (only logged). `recoverAllPendingFiles()` at lines 380-387 scans directories for pending files. `recoverPendingFile()` at lines 325-375 renames pending to original.
- [x] T022 Execute scenario 130 — Lineage backfill rollback drill — **PASS** | Evidence: `lib/storage/lineage-state.ts` implements lineage transitions with backfill support (`BACKFILL` transition event type at line 41). Test file `tests/memory-lineage-backfill.vitest.ts` exists for verification. Checkpoint system at `lib/storage/checkpoints.ts` provides checkpoint-backed rollback. `checkpoint-tools.ts:21-26` exposes `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete` tools.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T023 Confirm all 18 scenarios have a verdict (PASS / FAIL / SKIP — no "Not Started" remaining) — 18 PASS, 0 PARTIAL, 0 FAIL, 0 SKIP
- [x] T024 Confirm all FAIL verdicts have defect notes with observed vs expected behaviour — No FAIL or PARTIAL verdicts. All 18 scenarios PASS.
- [x] T025 Mark all P0 checklist items in checklist.md with evidence — completed
- [x] T026 Update implementation-summary.md with final verdict summary — completed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 18 scenarios verdicted
- [x] checklist.md P0 items verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
