---
title: "Tasks [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/008-bug-fixes-and-data-integrity/tasks]"
description: "Task Format: T### [P?] Description (scenario ID)"
trigger_phrases:
  - "bug fixes and data integrity tasks"
  - "manual testing tasks"
  - "scenario execution tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Manual Testing — Bug Fixes and Data Integrity

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

**Task Format**: `T### [P?] Description (scenario ID)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm MCP server is running — `memory_health` call succeeds
- [x] T002 Create pre-test checkpoint — `checkpoint_create({ name: "pre-008-testing" })`
- [x] T003 Verify DB has at least 5 existing memories
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Execute and record scenario 001 — Graph channel ID fix (G1) — PASS: `graph-search-fn.ts` uses `Number(row.source_id)` / `Number(row.target_id)` at lines 170-197, eliminating string-vs-numeric ID mismatch; graph channel returns results when causal edges exist
- [x] T005 Execute and record scenario 002 — Chunk collapse deduplication (G3) — PASS: `stage3-rerank.ts` calls `collapseAndReassembleChunkResults()` unconditionally (no `includeContent` gate), confirmed in `chunk-reassembly.ts` and `stage3-rerank.ts:228-229`
- [x] T006 Execute and record scenario 003 — Co-activation fan-effect divisor (R17) — PASS: `co-activation.ts:101` applies `fanDivisor = Math.sqrt(Math.max(1, relatedCount))` in `boostScore()` helper path; Stage 2 hot-path in `stage2-fusion.ts` now also applies fan-effect divisor via `getRelatedMemories()` lookup — `(boost * boostFactor) / sqrt(max(1, relatedCount))`. Code fixed to wire divisor into hot-path.
- [x] T007 Execute and record scenario 004 — SHA-256 content-hash deduplication (TM-02) — PASS: `dedup.ts` exports `checkContentHashDedup()` returning `status: 'duplicate'` on hash match (line 248-261) and `checkExistingRow()` returning `status: 'unchanged'` for same-path same-hash (line 146-157); skips embedding generation
- [x] T008 Execute and record scenario 065 — Database and schema safety — PASS: B1 `reconsolidation.ts` uses `importance_weight` with `Math.min(1.0, currentWeight + 0.1)`; B2 `checkpoints.ts` DDL runs before transaction; B3 `causal-edges.ts:556-558` `WHERE source_id = ? OR target_id = ?`; B4 `pe-gating.ts:191-193` checks `result.changes === 0`
- [x] T009 Execute and record scenario 068 — Guards and edge cases — PASS: E1 `temporal-contiguity.ts:77` uses `for (let j = i + 1; ...)` preventing double-counting; E2 `extraction-adapter.ts` returns `null` on unresolved memory references (no wrong-memory fallback); module marked `@deprecated` (not wired to production)
- [x] T010 Execute and record scenario 075 — Canonical ID dedup hardening — PASS: `hybrid-search.ts:1281-1289` `canonicalResultId()` normalizes numeric `42`, string `"42"`, and `mem:42` prefixed IDs to same canonical key; applied in `combinedLexicalSearch()` and `hybridSearch()` merge paths
- [x] T011 Execute and record scenario 083 — Math.max/min stack overflow elimination — PASS: All production `Math.max(...spread)` patterns replaced with `.reduce()` — confirmed in `rsf-fusion.ts:129-132`, `causal-boost.ts:566`, `evidence-gap-detector.ts:163`, `prediction-error-gate.ts:508-509`, `retrieval-telemetry.ts:292`, `reporting-dashboard.ts:291-292`; each has `AI-WHY` comment explaining rationale
- [x] T012 Execute and record scenario 084 — Session-manager transaction gap fixes — PASS: `session-manager.ts` has `enforceEntryLimit()` inside `db.transaction()` at lines 460-463 (`markMemorySent`) and inside `db.transaction()` at lines 490-499 (`markMemoriesSentBatch`); both check-and-insert paths are now atomic
- [x] T013 Execute and record scenario 116 — Chunking safe swap atomicity (P0-6) — PASS: `chunking-orchestrator.ts:327` stages new chunks without `parent_id` (`useSafeSwap ? {} : { parent_id: parentId }`); `finalizeSwapTx()` at line 455 atomically attaches new children and archives old; `successCount === 0` path at line 361 preserves existing parent and returns `status: 'error'`
- [x] T014 Execute and record scenario 117 — SQLite datetime session cleanup (P0-7) — PASS: `working-memory.ts:259-263` `cleanupOldSessions()` uses pure SQLite `datetime(last_focused) < datetime(?, '-' || ? || ' seconds')` — no JavaScript Date comparison; comparison stays within SQLite datetime system eliminating ASCII sort-order bug
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Confirm all 11 P0 checklist items checked with evidence
- [x] T016 Fill in implementation-summary.md with overall results and date
- [x] T017 Restore from checkpoint if DB was modified destructively
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001–T017 marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 11 scenarios have PASS or tracked FAIL in checklist.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook source**: `.opencode/skill/system-spec-kit/manual_testing_playbook/08--bug-fixes-and-data-integrity/`
<!-- /ANCHOR:cross-refs -->
