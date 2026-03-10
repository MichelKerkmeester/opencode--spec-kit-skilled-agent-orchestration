# Tasks: 002-Mutation Phase

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0       | 3     | FAIL status findings (correctness bugs, behavior mismatches) |
| P1       | 6     | WARN with behavior mismatch or significant code issues |
| P2       | 0     | WARN with documentation/test gaps only |
| **Total** | **9** | |

---

## P0 — Critical / Correctness

### T-01: Align olderThanDays validation across JSON schema, Zod, and handler
- **Priority:** P0
- **Feature:** F-04 Tier-based bulk deletion (memory_bulk_delete)
- **Status:** TODO
- **Source:** `mcp_server/tool-schemas.ts:268`, `mcp_server/schemas/tool-input-schemas.ts:187`, `mcp_server/handlers/memory-bulk-delete.ts:67-69`
- **Issue:** Contract drift on `olderThanDays`: JSON schema enforces `minimum: 1`, Zod runtime schema allows `0`, and handler rejects `<1`. Validation is duplicated across three layers without a shared constant, creating inconsistent behavior.
- **Fix:** Use a single shared constant for `olderThanDays` minimum across all three layers. Add boundary tests for values `0`, negative, `NaN`, and non-integer at both schema and handler layers. Remove stale `retry.vitest.ts` catalog entry.

### T-02: Make correction undo relation-scoped to prevent over-deletion
- **Priority:** P0
- **Feature:** F-09 Correction tracking with undo
- **Status:** TODO
- **Source:** `mcp_server/lib/learning/corrections.ts:461-478,592-598`, `mcp_server/lib/storage/causal-edges.ts:182-185`
- **Issue:** `undoCorrection` deletes causal edges by `(source_id, target_id)` only, while correction creation is relation-specific (`supersedes`/`derived_from`). If multiple relations exist for the same pair, undo removes unrelated links. Undo path silently swallows edge deletion errors.
- **Fix:** Persist correction edge identifier or relation in `memory_corrections` and delete by that exact key during undo. Add regression test with multiple relations between same pair. Surface edge-removal failures in response/logging.

### T-03: Wire recordHistory into live mutation handlers
- **Priority:** P0
- **Feature:** F-10 Per-memory history log
- **Status:** TODO
- **Source:** `mcp_server/lib/storage/history.ts:107-123`, `mcp_server/lib/search/vector-index-schema.ts:1073-1079`
- **Issue:** `recordHistory()` exists but is not invoked by runtime mutation handlers; call sites are limited to tests/docs, so the lifecycle log is never populated by save/update/session-learning flows. Event schema allows only `ADD|UPDATE|DELETE` but docs describe `created, updated, merged, archived, restored`. Feature source table omits the actual history module and has incorrect script path.
- **Fix:** Wire `recordHistory` into save/update/delete/session-learning/archival mutation points. Align event taxonomy between docs and schema. Correct feature catalog source table paths. Add end-to-end tests asserting `memory_history` rows on save/update/delete.

---

## P1 — Behavior Mismatch / Significant Code Issues

### T-04: Unify reconsolidation gating to single source of truth
- **Priority:** P1
- **Feature:** F-01 Memory indexing (memory_save)
- **Status:** TODO
- **Source:** `mcp_server/lib/search/search-flags.ts:77-83`, `mcp_server/lib/storage/reconsolidation.ts:119-127`, `mcp_server/handlers/save/reconsolidation-bridge.ts:16-19,44`
- **Issue:** Reconsolidation enablement is split across two conflicting gates: rollout flags treat it as graduated/default-on, but storage reconsolidation requires explicit `SPECKIT_RECONSOLIDATION=true`. Feature doc says "default ON" but implementation/tests define it as explicit opt-in. Integration suite is largely deferred placeholders.
- **Fix:** Collapse reconsolidation gating to a single contract matching the documented default-on behavior. Replace deferred integration placeholders with real fixture-backed assertions. Return explicit warning/error metadata when hooks or ledger writes fail.

### T-05: Treat BM25 re-index failure as transactional on metadata update
- **Priority:** P1
- **Feature:** F-02 Memory metadata update (memory_update)
- **Status:** TODO
- **Source:** `mcp_server/handlers/memory-crud-update.ts:145-163`
- **Issue:** BM25 re-index errors are caught and only logged while the metadata update still commits, leaving keyword search stale after a successful update. Bare catch in post-mutation hook fallback suppresses failure context.
- **Fix:** Treat BM25 re-index failure as transactional failure when title/trigger fields change, or mark an explicit "search-index-dirty" state. Add direct `memory_update` coverage for `allowPartialUpdate` and embedding-regeneration rollback. Remove stale `retry.vitest.ts` references.

### T-06: Prevent partial bulk-folder deletes without DB handle
- **Priority:** P1
- **Feature:** F-03 Single and folder delete (memory_delete)
- **Status:** TODO
- **Source:** `mcp_server/handlers/memory-crud-delete.ts:192-199`
- **Issue:** Bulk-folder delete has a no-DB fallback that still calls `deleteMemory` but skips causal-edge cleanup and mutation-ledger writes, weakening atomic cleanup guarantees. Feature doc claims atomic bulk delete with per-memory edge cleanup. Post-mutation hook errors are swallowed behind synthetic success defaults.
- **Fix:** Align bulk path with single-delete safety policy: abort when DB handle is unavailable. Add regression test for DB-unavailable bulk delete. Clean stale test-file references.

### T-07: Expand validation feedback transaction boundaries
- **Priority:** P1
- **Feature:** F-05 Validation feedback (memory_validate)
- **Status:** TODO
- **Source:** `mcp_server/handlers/checkpoints.ts:342-408`, `mcp_server/lib/scoring/confidence-tracker.ts:100-154`
- **Issue:** Only `recordValidation` runs transactionally; auto-promotion, negative-feedback persistence, learned feedback, and ground-truth logging execute afterward, allowing partial side effects on downstream failure. `recordValidation` catches failures and returns fallback default values instead of propagating failure. Feature claims "single transaction" but only confidence read/compute/write is atomic.
- **Fix:** Wrap full `memory_validate` side-effect set in a broader transaction or make every step idempotent with compensating retry. Add targeted tests for learned-feedback branching, ground-truth logging, and auto-promotion throttling. Replace success-shaped fallback with explicit failure signaling.

### T-08: Correct transaction-wrapper feature source table
- **Priority:** P1
- **Feature:** F-06 Transaction wrappers on mutation handlers
- **Status:** TODO
- **Source:** `feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md:5,13-37`
- **Issue:** Feature "Current Reality" references wrapper additions in `memory-crud-update.ts` and `memory-crud-delete.ts`, but those files are absent from this feature's listed implementation table. Listed tests focus on transaction-manager primitives, not handler wrappers.
- **Fix:** Update feature source table to include `handlers/memory-crud-update.ts` and `handlers/memory-crud-delete.ts`. Add handler-level rollback tests (BM25 failure, causal-edge failure, ledger failure). Remove stale `retry.vitest.ts` catalog entry.

### T-09: Align PE decision logging with documented "all decisions logged" contract
- **Priority:** P1
- **Feature:** F-08 Prediction-error save arbitration
- **Status:** TODO
- **Source:** `mcp_server/lib/cognitive/prediction-error-gate.ts:267-281`
- **Issue:** Feature text says "all decisions are logged" to `memory_conflicts`, but implementation logs only when similarity >= 0.50 (low-match threshold), so low/no-match CREATE decisions are silently dropped. Integration suite is deferred placeholders.
- **Fix:** Either log every PE decision (including low/no-match CREATE) or narrow feature text to match implemented behavior. Replace deferred integration placeholders with concrete PE decision-path assertions for CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED.
