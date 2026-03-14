---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Phase 002-mutation code audit - original remediation plus March 11 re-audit closure across mutation handlers, history coverage, and verification evidence."
trigger_phrases: ["implementation", "summary", "template", "impl summary core"]
importance_tier: "normal"
contextType: "general"
---
# Implementation Summary
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-mutation |
| **Completed** | 2026-03-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every delete path in the Spec Kit Memory MCP server now records history. Before this audit, `recordHistory()` existed but was never wired into runtime mutation handlers, so deletes, updates, and save-path writes often left no lifecycle trail. This phase closed that gap across handler flows, raw SQL cleanup paths, and module-level mutation APIs while also fixing contract drift and transaction-boundary mismatches found in the mutation feature catalog.

### olderThanDays Validation + Bulk-Delete History (WS-1/T-01)

We aligned `olderThanDays` validation so schema and runtime behavior agree. `tool-input-schemas.ts` now enforces `min(1)` to match JSON schema and handler expectations. In the same workstream, `memory-bulk-delete.ts` was updated so bulk delete transactions write `recordHistory('DELETE')` entries with consistent null coalescing for optional payload fields.

### Correction Undo Relation-Scoped (WS-2/T-02)

`undoCorrection` in `corrections.ts` now scopes causal-edge deletion by relation type (`supersedes` and `derived_from`) instead of deleting by source/target only. That prevents over-deletion when multiple relation types exist for the same pair. The empty catch was replaced with `console.warn` so edge-removal failures are visible.

### recordHistory Wired Across All Mutation Paths (WS-3/T-03, WS-4/T-05, WS-5/T-06, WS-8, WS-9)

History logging is now integrated end to end:

- Save/update/delete handlers now write history in live flows:
  - `create-record.ts` writes `recordHistory('ADD')`.
  - `memory-crud-update.ts` writes `recordHistory('UPDATE')` and keeps BM25 re-index failures transactional for data errors.
  - `memory-crud-delete.ts` and `memory-bulk-delete.ts` now enforce safer delete behavior and record delete history only after confirmed handler-level deletion.
- History schema/runtime initialization is now safe for real actors and deletion auditing:
  - `history.ts` removed restrictive actor constraints and legacy foreign-key assumptions that blocked durable delete history.
  - `vector-index-schema.ts` initializes history tables at DB setup via `initHistory(database)`.
  - `vector-index-mutations.ts` no longer wipes `memory_history` rows in `delete_memory()` and `delete_memories()`.
- Cross-AI follow-up rounds closed uncovered delete paths:
  - `context-server.ts` file watcher deletes (`mcp:file_watcher`)
  - `cli.ts` CLI bulk deletes (`mcp:cli_bulk_delete`)
  - `handlers/memory-index.ts` stale-record cleanup (`mcp:memory_index_scan`)
  - `handlers/chunking-orchestrator.ts` force re-chunk, rollback, safe-swap child cleanup, and failed finalize cleanup (`mcp:chunking_reindex`, `mcp:chunking_rollback`)
  - `lib/storage/reconsolidation.ts` orphan conflict cleanup (`mcp:reconsolidation_cleanup`)
  - `lib/storage/checkpoints.ts` restore checkpoint clear-existing deletes (`mcp:checkpoint_restore`)
  - `lib/search/vector-index-queries.ts` integrity auto-clean orphan deletes (`mcp:integrity_check`)
  - Mutation APIs now self-record where required (`mcp:delete_memories`, `mcp:delete_by_path`)

### Reconsolidation Canonical Gate + Defensive Guard + Confidence Tracker (WS-6/T-04, T-07)

`reconsolidation-bridge.ts` now routes enablement through canonical `search-flags.ts:isReconsolidationFlagEnabled()`, and the internal `reconsolidate()` guard now matches the same explicit opt-in semantics (`SPECKIT_RECONSOLIDATION=true`, default OFF) as a defensive second gate. `confidence-tracker.ts` now throws on DB errors in `recordValidation` instead of returning success-shaped fallback values, so downstream steps cannot proceed on stale assumptions. `confidence-tracker.vitest.ts` was updated to assert throw behavior in three targeted cases.

### PE Decision Logging + Doc Fixes (WS-7/T-08, T-09)

`prediction-error-gate.ts` now logs all PE decisions, including no-candidate and filtered-out paths, so behavior matches the documented "all decisions logged" contract. The save-integration suite was rewritten from placeholder assertions to concrete PE/save arbitration checks, and mutation feature-catalog files were corrected for reconsolidation semantics, duplicate `retry-manager.vitest.ts` entries, stale test references, and transaction-wrapper/null-DB behavior notes.

### Re-audit Closure for Remaining Mutation Gaps (WS-8/T-10)

The March 11, 2026 re-audit found four remaining gaps after the earlier closeout: `delete_memory_by_path()` and `delete_memories()` still recorded DELETE history before confirmed deletion, reconsolidation guard semantics still needed canonical alignment, `memory_bulk_delete.confirm` was still only typed as boolean at the schema layer, and supporting tests/docs still pointed at older verification snapshots. Those gaps are now closed. Helper delete APIs record history only after confirmed deletion, reconsolidation now consistently uses explicit opt-in/default OFF semantics in both bridge and internal guard, `memory_bulk_delete` now requires `confirm: true` in both schema layers, and mutation-focused suites cover the repaired behavior directly.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/schemas/tool-input-schemas.ts` | Modified | Align `olderThanDays` runtime schema minimum with handler/schema contract |
| `mcp_server/tool-schemas.ts` | Modified | Enforce `memory_bulk_delete.confirm` as schema-level `const: true` |
| `mcp_server/handlers/memory-bulk-delete.ts` | Modified | Record delete history in bulk flows and harden handler delete sequencing |
| `mcp_server/lib/learning/corrections.ts` | Modified | Scope undo causal-edge deletion by relation and surface failures |
| `mcp_server/lib/storage/history.ts` | Modified | Relax legacy constraints and preserve history rows for delete auditing |
| `mcp_server/lib/storage/reconsolidation.ts` | Modified | Align internal defensive guard with canonical reconsolidation opt-in/default OFF semantics and confirmed-delete history ordering in orphan cleanup |
| `mcp_server/handlers/save/create-record.ts` | Modified | Write `recordHistory('ADD')` inside save transaction |
| `mcp_server/handlers/memory-crud-update.ts` | Modified | Add `recordHistory('UPDATE')` and enforce transactional BM25 data-failure rollback |
| `mcp_server/handlers/memory-crud-delete.ts` | Modified | Prevent unsafe no-DB bulk path and add confirmed delete history writes |
| `mcp_server/handlers/save/reconsolidation-bridge.ts` | Modified | Use canonical reconsolidation gate in the bridge while retaining internal guard safety net |
| `mcp_server/lib/scoring/confidence-tracker.ts` | Modified | Throw on `recordValidation` DB failures for explicit failure signaling |
| `mcp_server/lib/cognitive/prediction-error-gate.ts` | Modified | Log all PE decisions, including early-return branches |
| `mcp_server/handlers/chunking-orchestrator.ts` | Modified | Add history coverage for `deleteMemory()` and raw SQL chunk-delete paths |
| `mcp_server/lib/storage/checkpoints.ts` | Modified | Add checkpoint-restore delete history coverage for scoped and full clears |
| `mcp_server/lib/search/vector-index-mutations.ts` | Modified | Record helper DELETE history only after confirmed deletion |
| `mcp_server/tests/confidence-tracker.vitest.ts` | Modified | Update 3 tests to assert throw behavior in validation error paths |
| `mcp_server/tests/history.vitest.ts` | Modified | Add migration, actor-format, and bulk-delete boundary regression coverage |
| `mcp_server/tests/memory-save-ux-regressions.vitest.ts` | Modified | Update cleanup ordering for schema without history foreign keys |
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Modified | Validate metadata update rollback semantics used by BM25 transactional fixes |
| `mcp_server/tests/reconsolidation.vitest.ts` | Modified | Assert canonical/default OFF reconsolidation gate alignment and checkpoint-enable behavior |
| `mcp_server/tests/reconsolidation-cleanup-ordering.vitest.ts` | Added | Assert no DELETE history is written when orphan cleanup delete does not actually delete a row |
| `mcp_server/tests/search-flags.vitest.ts` | Modified | Add reconsolidation opt-in flag coverage (default OFF, explicit ON) |
| `mcp_server/tests/tool-input-schema.vitest.ts` | Modified | Add `memory_bulk_delete` confirm/olderThanDays schema contract tests |
| `mcp_server/tests/chunking-orchestrator-swap.vitest.ts` | Modified | Fix transaction mock typing and add delete-history assertions for safe-swap and rollback cleanup paths |
| `mcp_server/tests/memory-save-integration.vitest.ts` | Modified | Replace placeholder assertions with concrete PE/save arbitration integration tests |
| `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/*.md` | Modified | Correct reconsolidation semantics, remove stale/duplicate test references, and align transaction-wrapper/null-DB documentation with implementation |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery started as an iterative cross-AI review loop, with GPT-5.4 review rounds R1 through R11 raising quality from 72/100 to 98/100. The March 11, 2026 re-audit then closed the remaining mutation-specific gaps still present after that snapshot. Current verification is `npx tsc --noEmit` clean, focused mutation verification run green (`8 files`, `167 tests`), and the broader repository test suite at `254 passed files / 5 failed files` and `7331 passed / 8 failed / 1 skipped / 30 todo` tests, with remaining failures outside this mutation scope.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Standardize `recordHistory` actor format as `mcp:<tool_name>` and keep a single call signature `(memoryId, event, prevValue, newValue, actor)` | This keeps history rows queryable across more than 20 runtime call sites and removes ambiguity across handler, module, and raw SQL paths. |
| Distinguish BM25 infrastructure failures from data failures in update flows | Infrastructure gaps in test/mocks should not abort user writes, but data-path re-index failures must roll back to avoid stale searchable state. |
| Make `recordValidation` throw instead of returning success-shaped fallback values | Explicit failure propagation prevents downstream side effects from running on invalid or stale confidence state. |
| Route reconsolidation bridge checks through canonical `search-flags.ts` gate while retaining internal `reconsolidate()` guard with matching semantics | Canonical bridge gating removes contradictory bridge checks, and matching explicit opt-in/default OFF behavior in the internal guard preserves defensive safety without semantic drift. |
| Use migration rebuild strategy (`sqlite_master` detection + rename/create/insert/drop) for legacy history constraints | Rebuild migration is deterministic in SQLite and cleanly removes legacy CHECK/FK constraints without partial schema drift. |
| Initialize history tables during DB setup via `initHistory(database)` next to companion-table initialization | Runtime mutation handlers can call `recordHistory()` immediately without depending on manual initialization or ordering assumptions. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| TypeScript (`npx tsc --noEmit`) | PASS - clean, 0 errors |
| Targeted history suite (`npx vitest run tests/history.vitest.ts --reporter=verbose`) | PASS - `35 passed` |
| Focused mutation verification run | PASS - `8 files`, `167 tests` passed |
| Full repository suite (`npx vitest run --reporter=verbose`) | PARTIAL - `254 passed files / 5 failed files`, `7331 passed / 8 failed / 1 skipped / 30 todo`; failing files are outside mutation scope (`tests/checkpoints-storage.vitest.ts`, `tests/file-watcher.vitest.ts`, `tests/five-factor-scoring.vitest.ts`, `tests/rrf-fusion.vitest.ts`, `tests/unit-rrf-fusion.vitest.ts`) |
| Historical cross-AI reference (pre re-audit) | Earlier rounds included `Claude @review 82/100` and `GPT-5.4 R11 98/100`; these are historical snapshots, not the current March 11 verification state |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **5 non-mutation full-suite failures remain.** The current repository-wide Vitest run still reports failures outside 002-mutation in: `tests/checkpoints-storage.vitest.ts`, `tests/file-watcher.vitest.ts` (3 failures), `tests/five-factor-scoring.vitest.ts`, `tests/rrf-fusion.vitest.ts`, and `tests/unit-rrf-fusion.vitest.ts`. These should be addressed separately so the broader baseline catches up with the mutation slice.
2. **`getHistoryStats(specFolder)` still undercounts delete history for fully removed memories.** The current implementation joins `memory_history` against live `memory_index` rows, so spec-folder stats cannot attribute deleted rows once the parent memory is gone. This is a reporting limitation, not a data-loss issue.
3. **Two lower-priority history improvements remain deferred.** `prevValue` normalization edge cases and per-row history insert performance tuning remain follow-up work.
<!-- /ANCHOR:limitations -->

---

## Historical Review History (Pre Re-Audit)

These score entries are retained as historical context from earlier review rounds.

| Reviewer | Score | Verdict | P0 | P1 | P2 |
|----------|-------|---------|----|----|-----|
| Claude @review | 82/100 | APPROVE | 0 | 2 (mitigated) | 5 |
| GPT-5.4 cross-AI R1 | 72/100 | REQUEST_CHANGES | 0 | 2 | 1 |
| GPT-5.4 cross-AI R2 | 84/100 | REQUEST_CHANGES | 0 | 1 (init gap) | 1 |
| GPT-5.4 cross-AI R3 | 74/100 | REQUEST_CHANGES | 0 | 3 (FK/order) | 0 |
| GPT-5.4 cross-AI R4 | 82/100 | REQUEST_CHANGES | 0 | 1 (deleteMemories) | 0 |
| GPT-5.4 cross-AI R5 | 78/100 | REQUEST_CHANGES | 0 | 4 (unaudited delete paths) | 1 |
| GPT-5.4 cross-AI R6 | 82/100 | REQUEST_CHANGES | 0 | 2 (raw SQL delete paths) | 1 |
| GPT-5.4 cross-AI R7 | 78/100 | REQUEST_CHANGES | 0 | 2 (checkpoint restore + integrity check) | 1 |
| GPT-5.4 cross-AI R8 | 88/100 | REQUEST_CHANGES | 0 | 2 (mutation module APIs) | 1 |
| GPT-5.4 cross-AI R9 | 88/100 | REQUEST_CHANGES | 0 | 1 (checkpoint false history) | 0 |
| GPT-5.4 cross-AI R10 | 89/100 | REQUEST_CHANGES | 0 | 1 (false DELETE history) | 0 |
| **GPT-5.4 cross-AI R11** | **98/100** | **APPROVE** | **0** | **0** | **0** |

**GPT-5.4 findings resolved across 5 rounds:**
1. R1-P1-1: Reconsolidation conflict pre-store missing `recordHistory('ADD')` -> **Fixed**
2. R1-P1-2: History schema migration for legacy CHECK constraint -> **Fixed**
3. R2-P1: Runtime `history.init(db)` never called -> **Fixed** via `initHistory(database)` in schema setup
4. R3-P1-1: `recordHistory('DELETE')` after `deleteMemory()` FK-fails -> **Fixed**: removed FK, reordered calls, history persists
5. R3-P1-2: Reconsolidation flag regression -> **Intentional** (T-04 design, internal guard retained)
6. R3-P1-3: Reconsolidation conflict cleanup FK-fail -> **Fixed** by FK removal
7. R4-P1: `deleteMemories()` still wiped `memory_history` -> **Fixed**: removed `DELETE FROM memory_history`
8. R5-P1-1: `context-server.ts` file-watcher delete path unaudited -> **Fixed**: added `recordHistory('DELETE')` with `mcp:file_watcher` actor
9. R5-P1-2: `cli.ts` CLI bulk-delete path unaudited -> **Fixed**: added `recordHistory('DELETE')` with `mcp:cli_bulk_delete` actor
10. R5-P1-3: `handlers/memory-index.ts` stale-record cleanup unaudited -> **Fixed**: added `recordHistory('DELETE')` with `mcp:memory_index_scan` actor
11. R5-P1-4: `handlers/chunking-orchestrator.ts` force re-chunk and rollback paths unaudited -> **Fixed**: added `recordHistory('DELETE')` with `mcp:chunking_reindex` and `mcp:chunking_rollback` actors
12. R5-P2: `getHistoryStats(specFolder)` inner join loses deleted memories' history -> **Deferred** (stats reporting, not data loss)
13. R6-P1-1: `chunking-orchestrator.ts:445` safe-swap raw SQL deletes old children without history -> **Fixed**: select old child IDs + `recordHistory` per child before delete
14. R6-P1-2: `chunking-orchestrator.ts:496` failed finalize cleanup raw SQL deletes staged chunks without history -> **Fixed**: `recordHistory` per child before raw delete
15. R6-P1-3: `reconsolidation.ts:519` orphan conflict cleanup raw SQL without history -> **Fixed**: added `recordHistory('DELETE')` with `mcp:reconsolidation_cleanup` actor
16. R7-P1-1: `checkpoints.ts:704,706` restoreCheckpoint clearExisting raw SQL without history -> **Fixed**: record delete for scoped/all memories before raw delete with `mcp:checkpoint_restore` actor
17. R7-P1-2: `vector-index-queries.ts:1360` `verify_integrity` autoClean raw SQL without history -> **Fixed**: record delete per orphaned chunk before raw delete with `mcp:integrity_check` actor
18. R8-P1-1: `delete_memories()` not self-recording delete history -> **Fixed**: added `recordHistory` per memory inside function with `mcp:delete_memories` actor, and the March 11 re-audit moved it after confirmed deletion
19. R8-P1-2: `delete_memory_by_path()` not self-recording delete history -> **Fixed**: added `recordHistory` with `mcp:delete_by_path` actor, and the March 11 re-audit moved it after confirmed deletion
20. R9-P1: `checkpoints.ts` false delete history for snapshot-only IDs -> **Fixed**: iterate `currentScopedMemoryIds` instead of `scopedMemoryIdsToReplace`
21. R10-P1: `memory-crud-delete.ts` and `memory-bulk-delete.ts` recorded delete history before confirming `deleteMemory()` success -> **Fixed**: moved `recordHistory` after confirmed deletion in all 3 handler paths
22. 2026-03-11 re-audit: reconsolidation guard semantics still needed canonical alignment -> **Fixed**: bridge and internal guard now use the same explicit opt-in/default OFF semantics
23. 2026-03-11 re-audit: `memory_bulk_delete.confirm` accepted `false` at schema level and bulk-delete boundary coverage remained thin -> **Fixed**: schema now requires literal/const `true`, with new schema + handler boundary tests

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
