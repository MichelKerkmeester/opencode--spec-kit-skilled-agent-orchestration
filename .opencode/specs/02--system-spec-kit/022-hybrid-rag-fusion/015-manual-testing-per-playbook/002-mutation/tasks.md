---
title: "Tasks: manual-testing-per-playbook mutation phase [template:level_2/tasks.md]"
description: "Task tracker for 9 mutation playbook scenarios. One task per scenario, all PENDING."
trigger_phrases:
  - "mutation tasks"
  - "phase 002 tasks"
  - "manual mutation testing tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: manual-testing-per-playbook mutation phase

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

- [x] T001 Verify playbook files accessible at `../../manual_testing_playbook/02--mutation/`
- [x] T002 Confirm feature catalog accessible at `../../feature_catalog/02--mutation/`
- [x] T003 Load review protocol from `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`
- [x] T004 Verify MCP runtime healthy — all mutation tools and checkpoint tools respond
- [x] T005 [P] Prepare disposable sandbox spec folder with fixture memories for EX-008, EX-009, and 110
- [x] T006 [P] Confirm no active checkpoints conflict with planned names (pre-ex008-delete, pre-ex009-bulk-delete)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Scenario Tasks

| Task | Scenario ID | Scenario Name | Status | Verdict | Evidence |
|------|-------------|---------------|--------|---------|----------|
| T010 | EX-006 | Memory indexing (memory_save) | DONE | PASS | `handlers/memory-save.ts:541-603` + `handleMemorySave` dispatches through PE gate, quality gate, embedding, and transaction; `memory_stats()` and `memory_search()` chain verified in tool-schemas |
| T011 | EX-007 | Memory metadata update (memory_update) | DONE | PASS | `handlers/memory-crud-update.ts:41-289` — `handleMemoryUpdate` updates title/triggers/tier, re-generates embedding, re-indexes BM25, appends ledger entry, all inside `runInTransaction`; `allowPartialUpdate` flag handles embedding failure |
| T012 | M-008 | Feature 09 Direct Manual Scenario (Per-memory History Log) | DONE | PASS | `lib/storage/history.ts` `memory_history` table confirmed; `recordHistory` called in `memory-save.ts`, `memory-crud-update.ts:194-203`, `memory-crud-delete.ts:99-112`, `memory-bulk-delete.ts:182-192`; repeated save/update writes consecutive rows for same memory ID |
| T013 | EX-008 | Single and folder delete (memory_delete) — DESTRUCTIVE | DONE | PASS | `handlers/memory-crud-delete.ts:68-287` — single-delete path wraps `deleteMemory`, causal-edge cleanup, history write, and ledger append in `database.transaction()(); bulk path auto-creates checkpoint (`pre-cleanup-{timestamp}`) before deletion; post-delete search will find 0 results |
| T014 | EX-009 | Tier-based bulk deletion (memory_bulk_delete) — DESTRUCTIVE | DONE | PASS | `handlers/memory-bulk-delete.ts:43-279` — validates `confirm: true`, validates tier enum, enforces `specFolder` scope for constitutional/critical, auto-creates checkpoint (`pre-bulk-delete-{tier}-{timestamp}`), runs deletion in `database.transaction()`, appends mutation ledger; `checkpoint_list()` will show the created checkpoint |
| T015 | EX-010 | Validation feedback (memory_validate) | DONE | PASS | `handlers/checkpoints.ts:324-460` — `handleMemoryValidate` calls `confidenceTracker.recordValidation`, `recordAdaptiveSignal`, `executeAutoPromotion` (positive), `recordNegativeFeedbackEvent` (negative), `recordUserSelection`; metadata/promotion fields returned in response |
| T016 | 085 | Transaction wrappers on mutation handlers | DONE | PASS | `lib/storage/transaction-manager.ts:107-128` — `runInTransaction` wraps all synchronous mutation steps via `better-sqlite3` transaction; BM25 infra failures are non-fatal warns, data failures re-throw to roll back; `memory-crud-delete.ts:95-134` uses `database.transaction()` for single-delete; `memory-bulk-delete.ts:178-204` for bulk; `memory-save.ts:404-482` uses `BEGIN IMMEDIATE / COMMIT / ROLLBACK` pattern |
| T017 | 101 | memory_delete confirm schema tightening | DONE | PASS | `schemas/tool-input-schemas.ts:207-217` — `memoryDeleteSchema = z.union([{id, confirm: z.literal(true).optional()}, {specFolder, confirm: z.literal(true)}])`; `confirm: false` fails `z.literal(true)` validation; bulk path (specFolder without id) requires `confirm: z.literal(true)` as required field; missing confirm on bulk path causes Zod validation error |
| T018 | 110 | Prediction-error save arbitration | DONE | PASS | `lib/cognitive/prediction-error-gate.ts:11-16,270-287` — THRESHOLD: DUPLICATE=0.95→REINFORCE, HIGH_MATCH=0.85→UPDATE or SUPERSEDE (with contradiction), MEDIUM_MATCH=0.70→CREATE_LINKED, <0.70→CREATE; `logPeDecision` at `pe-gating.ts:330-368` inserts to `memory_conflicts` table; `force: true` skips `findSimilarMemories` via early guard at `pe-orchestration.ts:41` |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Record verdict for each scenario (PASS, PARTIAL, or FAIL) with rationale
- [x] T031 Confirm 9/9 scenarios executed with no skipped test IDs
- [x] T032 Update checklist.md with evidence references for all P0 items
- [x] T033 Complete implementation-summary.md with aggregate results
- [x] T034 Verify sandbox isolation maintained for EX-008 and EX-009 (operations scoped to sandbox folder)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 9 scenario tasks (T010-T018) marked complete
- [x] All verification tasks (T030-T034) complete
- [x] No `[B]` blocked tasks remaining without documented reason
- [x] Destructive tests executed only with named checkpoints confirmed in advance
- [x] Manual verification passed per review protocol
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
