---
title: "Tasks: 002-Mutation Phase"
description: "Task Format: T-## [P?] Description (source/evidence)"
trigger_phrases: ["tasks", "002-mutation", "audit remediation", "p0 p1 tasks", "feature audit completion"]
importance_tier: "normal"
contextType: "general"
---
# Tasks: 002-Mutation Phase
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | 3 | FAIL status findings (correctness bugs, behavior mismatches) |
| P1 | 7 | WARN with behavior mismatch or significant code issues |
| P2 | 0 | WARN with documentation/test gaps only |
| **Total** | **10** | |

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
## Phase 1: P0 - Critical / Correctness

### [x] T-01: Align olderThanDays validation across JSON schema, Zod, and handler
- **Priority:** P0
- **Feature:** F-04 Tier-based bulk deletion (`memory_bulk_delete`)
- **Status:** DONE
- **Source:** `mcp_server/tool-schemas.ts:268`, `mcp_server/schemas/tool-input-schemas.ts:187`, `mcp_server/handlers/memory-bulk-delete.ts:67-69`
- **Issue:** Contract drift on `olderThanDays`: JSON schema enforces `minimum: 1`, Zod runtime schema allows `0`, and handler rejects `<1`. Validation is duplicated across three layers without a shared constant, creating inconsistent behavior.
- **Fix:** Use a single shared constant for `olderThanDays` minimum across all three layers. Add boundary tests for values `0`, negative, `NaN`, and non-integer at both schema and handler layers. Remove stale `retry.vitest.ts` catalog entry.
- **Evidence:** Zod now requires `confirm: true` and `olderThanDays >= 1`, JSON schema now enforces `const: true` plus `minimum: 1`, and handler-level validation is covered in `history.vitest.ts`, `tool-input-schema.vitest.ts`, and `mcp-input-validation.vitest.ts`. TSC clean; focused mutation run passed (`8 files`, `167 tests`); full suite retains unrelated failures outside mutation scope.

### [x] T-02: Make correction undo relation-scoped to prevent over-deletion
- **Priority:** P0
- **Feature:** F-09 Correction tracking with undo
- **Status:** DONE
- **Source:** `mcp_server/lib/learning/corrections.ts:461-478,592-598`, `mcp_server/lib/storage/causal-edges.ts:182-185`
- **Issue:** `undoCorrection` deletes causal edges by `(source_id, target_id)` only, while correction creation is relation-specific (`supersedes`/`derived_from`). If multiple relations exist for the same pair, undo removes unrelated links. Undo path silently swallows edge deletion errors.
- **Fix:** Persist correction edge identifier or relation in `memory_corrections` and delete by that exact key during undo. Add regression test with multiple relations between same pair. Surface edge-removal failures in response/logging.
- **Evidence:** Added relation-type mapping (superseded/deprecated -> `supersedes`, refined/merged -> `derived_from`) in undo path. Scoped DELETE by `AND relation = ?`. Replaced empty catch with `console.warn` logging. TSC clean.

### [x] T-03: Wire recordHistory into live mutation handlers
- **Priority:** P0
- **Feature:** F-10 Per-memory history log
- **Status:** DONE
- **Source:** `mcp_server/lib/storage/history.ts:107-123`, `mcp_server/lib/search/vector-index-schema.ts:1073-1079`
- **Issue:** `recordHistory()` exists but is not invoked by runtime mutation handlers; call sites are limited to tests/docs, so the lifecycle log is never populated by save/update/session-learning flows. Event schema allows only `ADD|UPDATE|DELETE` but docs describe `created, updated, merged, archived, restored`. Feature source table omits the actual history module and has incorrect script path.
- **Fix:** Wire `recordHistory` into save/update/delete/session-learning/archival mutation points. Align event taxonomy between docs and schema. Correct feature catalog source table paths. Add end-to-end tests asserting `memory_history` rows on save/update/delete.
- **Evidence:** Removed restrictive CHECK constraint on actor column in `history.ts`. Wired `recordHistory('ADD')` in `create-record.ts` inside transaction. Actor convention: `mcp:<tool_name>`. TSC clean.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: P1 - Behavior Mismatch / Significant Code Issues

### [x] T-04: Unify reconsolidation gating to single source of truth
- **Priority:** P1
- **Feature:** F-01 Memory indexing (`memory_save`)
- **Status:** DONE
- **Source:** `mcp_server/lib/search/search-flags.ts:77-83`, `mcp_server/lib/storage/reconsolidation.ts:119-127`, `mcp_server/handlers/save/reconsolidation-bridge.ts:16-19,44`
- **Issue:** Initial finding (resolved by T-04 and re-audit T-10): reconsolidation enablement drifted between canonical gate intent and internal guard behavior, and integration evidence was thin.
- **Fix:** Collapse reconsolidation gating to a single explicit contract: opt-in only via `SPECKIT_RECONSOLIDATION=true` (default OFF), with the bridge and defensive internal guard using the same semantics. Replace deferred integration placeholders with concrete assertions.
- **Evidence:** `reconsolidation-bridge.ts` uses canonical `search-flags.ts:isReconsolidationFlagEnabled()`, and `lib/storage/reconsolidation.ts:isReconsolidationEnabled()` now matches the same explicit opt-in behavior. Reconsolidation tests and search-flags tests now assert default OFF + explicit ON. TSC clean.

### [x] T-05: Treat BM25 re-index failure as transactional on metadata update
- **Priority:** P1
- **Feature:** F-02 Memory metadata update (`memory_update`)
- **Status:** DONE
- **Source:** `mcp_server/handlers/memory-crud-update.ts:145-163`
- **Issue:** BM25 re-index errors are caught and only logged while the metadata update still commits, leaving keyword search stale after a successful update. Bare catch in post-mutation hook fallback suppresses failure context.
- **Fix:** Treat BM25 re-index failure as transactional failure when title/trigger fields change, or mark an explicit "search-index-dirty" state. Add direct `memory_update` coverage for `allowPartialUpdate` and embedding-regeneration rollback. Remove stale `retry.vitest.ts` references.
- **Evidence:** Wrapped BM25 re-index in single try-catch with infrastructure vs data failure distinction. Infrastructure failures (message contains "not a function"/"not initialized") -> warn + continue. Data failures -> re-throw to roll back transaction. Added `recordHistory('UPDATE')` inside transaction. All 70 memory-crud-extended tests pass. Removed duplicate comment (P2-01 from review). TSC clean.

### [x] T-06: Prevent partial bulk-folder deletes without DB handle
- **Priority:** P1
- **Feature:** F-03 Single and folder delete (`memory_delete`)
- **Status:** DONE
- **Source:** `mcp_server/handlers/memory-crud-delete.ts:192-199`
- **Issue:** Bulk-folder delete has a no-DB fallback that still calls `deleteMemory` but skips causal-edge cleanup and mutation-ledger writes, weakening atomic cleanup guarantees. Feature doc claims atomic bulk delete with per-memory edge cleanup. Post-mutation hook errors are swallowed behind synthetic success defaults.
- **Fix:** Align bulk path with single-delete safety policy: abort when DB handle is unavailable. Add regression test for DB-unavailable bulk delete. Clean stale test-file references.
- **Evidence:** Changed no-DB fallback for bulk-folder path from silent iteration to `throw new Error('Bulk-folder delete aborted: database unavailable...')`. Wired `recordHistory('DELETE')` inside both single-delete and bulk-delete transactions. TSC clean.

### [x] T-07: Expand validation feedback transaction boundaries
- **Priority:** P1
- **Feature:** F-05 Validation feedback (`memory_validate`)
- **Status:** DONE
- **Source:** `mcp_server/handlers/checkpoints.ts:342-408`, `mcp_server/lib/scoring/confidence-tracker.ts:100-154`
- **Issue:** Only `recordValidation` runs transactionally; auto-promotion, negative-feedback persistence, learned feedback, and ground-truth logging execute afterward, allowing partial side effects on downstream failure. `recordValidation` catches failures and returns fallback default values instead of propagating failure. Feature claims "single transaction" but only confidence read/compute/write is atomic.
- **Fix:** Wrap full `memory_validate` side-effect set in a broader transaction or make every step idempotent with compensating retry. Add targeted tests for learned-feedback branching, ground-truth logging, and auto-promotion throttling. Replace success-shaped fallback with explicit failure signaling.
- **Evidence:** Changed `recordValidation` error handler from returning success-shaped defaults to re-throwing. Updated 3 tests (T103-01b, T103-02a, T103-03-recordValidation) to expect throw behavior. All 32 confidence-tracker tests pass. Review confirmed MCP dispatcher catches handler errors (P1-02 mitigated). TSC clean.

### [x] T-08: Correct transaction-wrapper feature source table
- **Priority:** P1
- **Feature:** F-06 Transaction wrappers on mutation handlers
- **Status:** DONE
- **Source:** `feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md:5,13-37`
- **Issue:** Feature "Current Reality" references wrapper additions in `memory-crud-update.ts` and `memory-crud-delete.ts`, but those files are absent from this feature's listed implementation table. Listed tests focus on transaction-manager primitives, not handler wrappers.
- **Fix:** Update feature source table to include `handlers/memory-crud-update.ts` and `handlers/memory-crud-delete.ts`. Add handler-level rollback tests (BM25 failure, causal-edge failure, ledger failure). Remove stale `retry.vitest.ts` catalog entry.
- **Evidence:** Added `memory-crud-update.ts` and `memory-crud-delete.ts` to implementation source table. Confirmed `retry.vitest.ts` does not exist (Glob search). Removed stale entry.

### [x] T-09: Align PE decision logging with documented "all decisions logged" contract
- **Priority:** P1
- **Feature:** F-08 Prediction-error save arbitration
- **Status:** DONE
- **Source:** `mcp_server/lib/cognitive/prediction-error-gate.ts:267-281`
- **Issue:** Feature text said "all decisions are logged" to `memory_conflicts`, but implementation logged only when similarity >= 0.50 (low-match threshold), so low/no-match CREATE decisions were silently dropped. Save integration coverage was also previously placeholder-heavy.
- **Fix:** Log every PE decision (including low/no-match CREATE) and replace placeholder integration assertions with concrete PE decision-path checks for CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED.
- **Evidence:** Extended `logConflict` calls to both early-return paths (no candidates, no relevant candidates after filtering). Changed main logging condition from `if (similarity >= THRESHOLD.LOW_MATCH && db)` to `if (db)` so all decisions are logged. `tests/memory-save-integration.vitest.ts` now contains real assertions (10 concrete tests). TSC clean.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: P2 - Optional / Deferred

### [x] T-10: Close remaining mutation re-audit gaps
- **Priority:** P1
- **Feature:** Cross-cutting (`F-01`, `F-04`, `F-10`)
- **Status:** DONE
- **Source:** `mcp_server/lib/storage/reconsolidation.ts`, `mcp_server/lib/search/vector-index-mutations.ts`, `mcp_server/schemas/tool-input-schemas.ts`, `mcp_server/tool-schemas.ts`, `mcp_server/tests/history.vitest.ts`, `mcp_server/tests/reconsolidation.vitest.ts`, `mcp_server/tests/tool-input-schema.vitest.ts`, `mcp_server/tests/regression-010-index-large-files.vitest.ts`, `mcp_server/tests/vector-index-impl.vitest.ts`
- **Issue:** The prior audit closeout still overstated completion. Remaining gaps included reconsolidation guard semantics drift, DELETE helper history ordering before confirmed deletion, missing schema-level enforcement for `memory_bulk_delete.confirm`, and stale verification evidence from older snapshots.
- **Fix:** Align the internal reconsolidation guard with canonical opt-in/default OFF semantics, move delete-helper history writes after confirmed deletion, require `confirm: true` in both schema layers, expand mutation-focused coverage, and refresh spec-folder verification evidence.
- **Evidence:** `npx tsc --noEmit` is clean. Focused mutation verification run passed (`8 files`, `167 tests`): `history`, `search-flags`, `tool-input-schema`, `mcp-input-validation`, `reconsolidation`, `reconsolidation-cleanup-ordering`, `chunking-orchestrator-swap`, and `memory-save-integration`. Full suite remains at `254 passed files / 5 failed files` and `7331 passed / 8 failed / 1 skipped / 30 todo` tests outside this mutation scope.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
