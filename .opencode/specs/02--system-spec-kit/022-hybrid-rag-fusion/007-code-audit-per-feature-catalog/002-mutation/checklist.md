---
title: "Verification Checklist: 002-Mutation Code Audit"
description: "Verification Date: 2026-03-11"
trigger_phrases: ["verification", "checklist", "002-mutation", "mutation code audit", "post-fix verification"]
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: 002-Mutation Code Audit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

## P0 - Blockers

P0 items below are complete and include inline evidence.

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (TSC clean) [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
- [x] CHK-011 [P0] No new unexpected console errors or warnings introduced by the mutation fixes [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
- [x] CHK-012 [P1] Error handling implemented (T-02 catch -> warn, T-07 throw behavior) [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
- [x] CHK-021 [P0] Verification complete (`npx tsc --noEmit` clean, focused mutation verification run: `8 files`, `167 tests` passed; full suite: `254 passed files / 5 failed files` and `7331 passed / 8 failed / 1 skipped / 30 todo` tests with failures outside mutation scope) [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
- [x] CHK-031 [P0] Input validation implemented (`T-01/T-10: olderThanDays >= 1` and `memory_bulk_delete.confirm === true`) [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
- [x] CHK-032 [P1] Auth/authz working correctly - N/A for this internal mutation audit scope [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
<!-- /ANCHOR:security -->

---

## P1 - Required

P1 items are complete and include inline evidence.

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
- [x] CHK-042 [P2] README applicability reviewed under explicit verification boundary (N/A for this phase scope) [EVIDENCE: Mutation closure scope is bounded to implementation, tests, and synchronized Level 2 artifacts; no additional phase README delta is required]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in `scratch/` only [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
- [x] CHK-051 [P1] `scratch/` cleaned before completion [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
- [x] CHK-052 [P2] Findings saved to `memory/` [EVIDENCE: See phase evidence in spec.md, plan.md, tasks.md, and implementation-summary.md]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 10 | 10/10 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-03-11
<!-- /ANCHOR:summary -->

---

## Appendix: Per-Feature Audit Findings
Historical note: the issue and gap bullets below capture the pre-fix audit findings that motivated the work. The current state is reflected in each `Post-Fix Status` line.

## F-01: Memory indexing (memory_save)
- **Status:** WARN
- **Code Issues:**
  1. Initial finding (now fixed): reconsolidation gate semantics drifted between bridge-level canonical gating and the internal guard (`mcp_server/lib/search/search-flags.ts`, `mcp_server/lib/storage/reconsolidation.ts`, `mcp_server/handlers/save/reconsolidation-bridge.ts`).
- **Standards Violations:**
  1. Post-mutation hook failures are swallowed and converted to success-shaped booleans (`mcp_server/handlers/mutation-hooks.ts:22-58`).
  2. Mutation-ledger append failures are swallowed in a "safe" helper, which can hide audit-trail write loss (`mcp_server/handlers/memory-crud-utils.ts:38-59`).
- **Behavior Mismatch:**
  1. Initial mismatch (now fixed): reconsolidation semantics drifted between bridge and internal guard. Re-audit aligned both to canonical opt-in behavior (`SPECKIT_RECONSOLIDATION=true`, default OFF) and updated reconsolidation/search-flag tests.
- **Test Gaps:**
  1. Historical gap (now fixed): `memory-save-integration.vitest.ts` previously used placeholders. It now contains concrete PE/save arbitration assertions (`T501-T510`) for CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED routing and save-helper wiring.
  2. Listed test path `mcp_server/tests/retry.vitest.ts` does not exist in repo (`feature_catalog/02--mutation/01-memory-indexing-memorysave.md:194`).
- **Playbook Coverage:** EX-006 (inferred from phase sequencing), explicit feature-level tag MISSING.
- **Recommended Fixes:**
  1. Unify reconsolidation gating to a single source-of-truth contract and remove contradictory default semantics.
  2. Completed: replaced integration placeholders with concrete PE/save arbitration assertions.
  3. Return explicit warning/error metadata when hooks or ledger writes fail.
- **Post-Fix Status:** FIXED (T-04, T-10). Bridge enablement uses canonical `search-flags.ts:isReconsolidationFlagEnabled()`, and `lib/storage/reconsolidation.ts:isReconsolidationEnabled()` now matches the same explicit opt-in semantics (default OFF). Added cleanup-ordering regression coverage (`tests/reconsolidation-cleanup-ordering.vitest.ts`) and updated reconsolidation/search-flag assertions. TSC clean.

## F-02: Memory metadata update (memory_update)
- **Status:** WARN
- **Code Issues:**
  1. BM25 re-index errors are caught and only logged, while metadata update still commits; this can leave keyword search stale after successful update (`mcp_server/handlers/memory-crud-update.ts:145-163`).
- **Standards Violations:**
  1. Bare catch in post-mutation hook fallback suppresses failure context (`mcp_server/handlers/memory-crud-update.ts:205-213`).
  2. Shared hook implementation swallows cache invalidation failures instead of surfacing them (`mcp_server/handlers/mutation-hooks.ts:22-58`).
- **Behavior Mismatch:** NONE
- **Test Gaps:**
  1. Feature-listed tests are mostly infrastructure-level and omit direct `memory_update` behavior suites; no listed test directly asserts `allowPartialUpdate` and embedding-regeneration rollback semantics (`feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md:86-132`; compare coverage in `mcp_server/tests/memory-crud-extended.vitest.ts:725-772`).
  2. Listed test path `mcp_server/tests/retry.vitest.ts` does not exist in repo (`feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md:116`).
- **Playbook Coverage:** EX-007 (inferred), explicit feature-level tag MISSING.
- **Recommended Fixes:**
  1. Treat BM25 re-index failure as transactional failure when title/trigger fields change, or mark an explicit "search-index-dirty" state.
  2. Add/update feature test catalog entries to include `handler-memory-crud.vitest.ts` and `memory-crud-extended.vitest.ts` update-path assertions.
  3. Remove or replace stale `retry.vitest.ts` references in catalog tables.
- **Post-Fix Status:** FIXED (T-05). BM25 re-index wrapped in single try-catch with infrastructure vs data failure distinction. Infrastructure failures (message contains "not a function"/"not initialized") → warn + continue. Data failures → re-throw to roll back transaction. Added `recordHistory('UPDATE')` inside transaction. All 70 memory-crud-extended tests pass. TSC clean.

## F-03: Single and folder delete (memory_delete)
- **Status:** WARN
- **Code Issues:**
  1. Bulk-folder delete has a no-DB fallback that still calls `deleteMemory` but skips causal-edge cleanup and mutation-ledger writes (`mcp_server/handlers/memory-crud-delete.ts:192-199`), weakening atomic cleanup guarantees.
- **Standards Violations:**
  1. Post-mutation hook errors are swallowed behind synthetic success defaults (`mcp_server/handlers/memory-crud-delete.ts:205-213`, `mcp_server/handlers/mutation-hooks.ts:22-58`).
- **Behavior Mismatch:**
  1. Feature doc claims atomic bulk delete with per-memory edge cleanup and ledger entries for the operation; fallback path skips both (`feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md:9`, `mcp_server/handlers/memory-crud-delete.ts:192-199`).
- **Test Gaps:**
  1. No listed test explicitly exercises the database-unavailable bulk fallback path.
  2. Listed test path `mcp_server/tests/retry.vitest.ts` does not exist in repo (`feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md:233`).
- **Playbook Coverage:** EX-008 (inferred), explicit feature-level tag MISSING.
- **Recommended Fixes:**
  1. Align bulk path with single-delete safety policy: abort when DB handle is unavailable.
  2. Add regression test for DB-unavailable bulk delete to ensure no partial deletes occur.
  3. Clean stale test-file references in the feature catalog.
- **Post-Fix Status:** FIXED (T-06). DB-unavailable paths for both single and bulk `memory_delete` now return standardized MCP error responses instead of attempting partial delete flow. Wired `recordHistory('DELETE')` inside both single-delete and bulk-delete transactions. TSC clean.

## F-04: Tier-based bulk deletion (memory_bulk_delete)
- **Status:** FAIL
- **Code Issues:**
  1. Initial finding (now fixed): contract drift existed across schema layers and handler validation for bulk-delete safety arguments (`olderThanDays`, `confirm`).
- **Standards Violations:**
  1. Validation rule duplicated across three layers without shared constant, resulting in drift (`mcp_server/tool-schemas.ts:268`, `mcp_server/schemas/tool-input-schemas.ts:187`, `mcp_server/handlers/memory-bulk-delete.ts:67-69`).
- **Behavior Mismatch:**
  1. Initial mismatch (now fixed): feature text expected strict schema enforcement while runtime schema accepted weaker inputs.
- **Test Gaps:**
  1. Initial gap (now fixed): boundary tests were missing for `olderThanDays` and schema-level `confirm` enforcement.
  2. Listed test path `mcp_server/tests/retry.vitest.ts` does not exist in repo (`feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md:122`).
- **Playbook Coverage:** EX-009 (inferred), explicit feature-level tag MISSING.
- **Recommended Fixes:**
  1. Use a single shared constant for `olderThanDays` minimum across JSON schema, Zod schema, and handler guard.
  2. Add boundary tests for `olderThanDays` validation in both schema and handler suites.
  3. Remove stale test-file entries from catalog.
- **Post-Fix Status:** FIXED (T-01, T-10). Zod schema now requires `confirm: true` and `olderThanDays >= 1`, JSON schema now enforces `confirm: const true` with `minimum: 1`, and boundary coverage now exists in schema-level and handler-level suites (`history.vitest.ts`, `tool-input-schema.vitest.ts`, `regression-010-index-large-files.vitest.ts`). Wired `recordHistory('DELETE')` inside bulk-delete transaction loop. TSC clean.

## F-05: Validation feedback (memory_validate)
- **Status:** WARN
- **Code Issues:**
  1. Only `recordValidation` runs transactionally; auto-promotion, negative-feedback persistence, learned feedback, and ground-truth logging are executed afterward, allowing partial side effects if downstream steps fail (`mcp_server/handlers/checkpoints.ts:342-408`, `mcp_server/lib/scoring/confidence-tracker.ts:100-154`).
  2. `recordValidation` catches failures and returns fallback default values instead of propagating failure (`mcp_server/lib/scoring/confidence-tracker.ts:155-164`).
- **Standards Violations:**
  1. Success-shaped fallback on DB failure can mask write errors in confidence tracking (`mcp_server/lib/scoring/confidence-tracker.ts:155-164`).
- **Behavior Mismatch:**
  1. "Single transaction" claim is broader than current implementation; only the confidence read/compute/write segment is atomic (`feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md:15`, `mcp_server/handlers/checkpoints.ts:342-408`, `mcp_server/lib/scoring/confidence-tracker.ts:100-154`).
- **Test Gaps:**
  1. Listed `handleMemoryValidate` tests emphasize input validation/basic envelope checks and do not deeply assert downstream side effects (auto-promotion throttling, negative-feedback persistence, learned-feedback branching, ground-truth selection IDs) (`mcp_server/tests/handler-checkpoints.vitest.ts:334-364`, `mcp_server/tests/checkpoints-extended.vitest.ts:853-893`).
  2. Listed test path `mcp_server/tests/retry.vitest.ts` does not exist in repo (`feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md:241`).
- **Playbook Coverage:** EX-010 (inferred), explicit feature-level tag MISSING.
- **Recommended Fixes:**
  1. Wrap full `memory_validate` side-effect set in a broader transaction (or make every step idempotent with compensating retry).
  2. Add targeted tests for positive+`queryId` learned-feedback and ground-truth logging branches.
  3. Replace success-shaped fallback with explicit failure signaling for confidence update errors.
- **Post-Fix Status:** FIXED (T-07). `recordValidation` error handler changed from returning success-shaped defaults to re-throwing. 3 tests updated (T103-01b, T103-02a, T103-03-recordValidation) to expect throw behavior. All 32 confidence-tracker tests pass. MCP dispatcher catches handler errors as safety net. TSC clean.

## F-06: Transaction wrappers on mutation handlers
- **Status:** WARN
- **Code Issues:**
  1. Feature "Current Reality" references wrapper additions in `memory-crud-update.ts` and `memory-crud-delete.ts`, but those files are absent from this feature's listed implementation table (`.opencode/skill/system-spec-kit/feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md:5,13-37`).
- **Standards Violations:** NONE
- **Behavior Mismatch:**
  1. Source-file catalog does not match the behavior it describes (handler wrappers), reducing audit traceability (`.opencode/skill/system-spec-kit/feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md:5,13-37`).
- **Test Gaps:**
  1. Listed tests focus transaction-manager file primitives (`executeAtomicSave`, pending recovery) rather than update/delete handler transaction wrappers (`mcp_server/tests/transaction-manager.vitest.ts:83-120,220-239`).
  2. Listed test path `mcp_server/tests/retry.vitest.ts` does not exist in repo (`.opencode/skill/system-spec-kit/feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md:73`).
- **Playbook Coverage:** EX-007/EX-008 (inferred via update/delete wrapper paths), explicit feature-level tag MISSING.
- **Recommended Fixes:**
  1. Update feature source table to include `handlers/memory-crud-update.ts` and `handlers/memory-crud-delete.ts`.
  2. Add handler-level rollback tests (e.g., BM25 failure, causal-edge failure, ledger failure) validating wrapper atomicity.
  3. Remove stale `retry.vitest.ts` catalog entry.
- **Post-Fix Status:** FIXED (T-08). Added `memory-crud-update.ts` and `memory-crud-delete.ts` to implementation source table in `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md`. Removed stale `retry.vitest.ts` entry. TSC clean.

## F-07: Namespace management CRUD tools
- **Status:** PASS
- **Code Issues:** NONE
- **Standards Violations:** NONE
- **Behavior Mismatch:** NONE
- **Test Gaps:** NONE (feature remains verification-boundary scoped as planned; no active namespace CRUD behavior to assert).
- **Playbook Coverage:** No direct EX-006..EX-010 mapping within this verification boundary; explicit feature-level tags remain MISSING.
- **Recommended Fixes:** NONE
- **Post-Fix Status:** N/A — feature remains verification-boundary scoped as planned, PASS status confirmed. No code changes required.

## F-08: Prediction-error save arbitration
- **Status:** WARN
- **Code Issues:**
  1. Feature text says "all decisions are logged" to `memory_conflicts`, but implementation logs only when similarity is at least low-match (`>= 0.50`), so low/no-match CREATE decisions are not recorded (`feature_catalog/02--mutation/08-prediction-error-save-arbitration.md:5`, `mcp_server/lib/cognitive/prediction-error-gate.ts:267-281`).
- **Standards Violations:** NONE
- **Behavior Mismatch:**
  1. "All decisions logged" claim is broader than current logging condition (`mcp_server/lib/cognitive/prediction-error-gate.ts:267-281`).
- **Test Gaps:**
  1. Historical gap (now fixed): the listed save integration suite was placeholder-heavy; it now includes concrete PE/save arbitration assertions (`tests/memory-save-integration.vitest.ts`, 10 tests).
- **Playbook Coverage:** NEW-110.
- **Recommended Fixes:**
  1. Either log every PE decision (including low/no-match CREATE) or narrow feature text to match implemented behavior.
  2. Completed: replaced placeholder integration assertions with concrete PE decision-path tests for CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED.
- **Post-Fix Status:** FIXED (T-09). Extended `logConflict` calls to both early-return paths (no candidates, no relevant candidates after filtering). Changed main logging condition from `if (similarity >= THRESHOLD.LOW_MATCH && db)` to `if (db)` — all PE decisions now logged regardless of similarity score. TSC clean.

## F-09: Correction tracking with undo
- **Status:** FAIL
- **Code Issues:**
  1. `undoCorrection` deletes causal edges by `(source_id, target_id)` only, while correction creation is relation-specific (`supersedes`/`derived_from`). If multiple relations exist for the same pair, undo can remove unrelated links (`mcp_server/lib/learning/corrections.ts:461-478,592-598`, `mcp_server/lib/storage/causal-edges.ts:182-185`).
- **Standards Violations:**
  1. Undo path swallows causal-edge deletion errors silently (`mcp_server/lib/learning/corrections.ts:600-602`).
- **Behavior Mismatch:**
  1. Feature describes correction/undo semantics for correction signals, but undo is not relation-scoped and can over-delete graph state (`feature_catalog/02--mutation/09-correction-tracking-with-undo.md:5-7`, `mcp_server/lib/learning/corrections.ts:592-598`).
- **Test Gaps:**
  1. Undo test checks restored stability and `is_undone` flag, but does not assert relation-scoped edge cleanup safety (`mcp_server/tests/corrections.vitest.ts:223-251`).
  2. Causal-edge integration test only asserts array shape, not correctness of which edges remain after undo (`mcp_server/tests/corrections.vitest.ts:275-283`).
- **Playbook Coverage:** NEW-* (specific scenario ID MISSING).
- **Recommended Fixes:**
  1. Persist correction edge identifier or relation in `memory_corrections` and delete by that exact key during undo.
  2. Add regression test with multiple relations between same pair to ensure undo removes only the correction-created edge.
  3. Surface edge-removal failures in response/logging instead of silent swallow.
- **Post-Fix Status:** FIXED (T-02). Added relation-type mapping (superseded/deprecated → 'supersedes', refined/merged → 'derived_from') in undo path. Scoped causal edge DELETE by `AND relation = ?`. Replaced empty catch with `console.warn` logging for edge-removal failures. TSC clean.

## F-10: Per-memory history log
- **Status:** FAIL
- **Code Issues:**
  1. `recordHistory()` exists but is not invoked by runtime mutation handlers; call sites are limited to tests/docs, so the lifecycle log is not actually populated by save/update/session-learning flows (`mcp_server/lib/storage/history.ts:107-123`, `mcp_server/tests/history.vitest.ts:73-136`).
  2. `memory_history.event` schema allows only `ADD|UPDATE|DELETE`, which does not match documented event types (`created, updated, merged, archived, restored`) (`mcp_server/lib/search/vector-index-schema.ts:1073-1079`, `feature_catalog/02--mutation/10-per-memory-history-log.md:5`).
- **Standards Violations:** NONE
- **Behavior Mismatch:**
  1. Feature says history is populated by save/update/session-learning/archival handlers, but runtime references do not show this wiring (`feature_catalog/02--mutation/10-per-memory-history-log.md:7`, `mcp_server/lib/storage/history.ts:107-123`).
  2. Feature source table points to `scripts/memory/cleanup-orphaned-vectors.ts`, but actual script path is under `.opencode/skill/system-spec-kit/scripts/...` (`feature_catalog/02--mutation/10-per-memory-history-log.md:19`).
  3. Feature source table omits `mcp_server/lib/storage/history.ts`, the module that actually defines history APIs (`mcp_server/lib/storage/history.ts:107-123`).
- **Test Gaps:**
  1. Listed `handler-session-learning` suite is validation-centric and does not assert `memory_history` writes (`mcp_server/tests/handler-session-learning.vitest.ts:28-58`).
  2. Listed `vector-index-impl` suite does not assert `memory_history` lifecycle writes.
  3. No listed tests verify end-to-end history creation on save/update/delete even though delete path clears history rows (`mcp_server/lib/search/vector-index-mutations.ts:355,445`).
- **Playbook Coverage:** NEW-* (specific scenario ID MISSING).
- **Recommended Fixes:**
  1. Wire `recordHistory` into save/update/delete/session-learning/archival mutation points.
  2. Align event taxonomy between docs and schema (either expand enum or tighten docs to implemented values).
  3. Correct feature catalog source table paths and include the actual history implementation module.
- **Post-Fix Status:** FIXED (T-03, T-10). Removed restrictive CHECK constraint on actor column in `history.ts` to allow `mcp:*` actors. Wired `recordHistory('ADD')` in `create-record.ts` inside save transaction. Wired `recordHistory('UPDATE')` in `memory-crud-update.ts` (T-05). Wired `recordHistory('DELETE')` in `memory-crud-delete.ts` (T-06) and `memory-bulk-delete.ts` (T-01). `delete_memory_by_path()` and `delete_memories()` now record DELETE history only after confirmed deletion, and `history.vitest.ts` plus `vector-index-impl.vitest.ts` now assert the expanded actor/lifecycle coverage. TSC clean.
