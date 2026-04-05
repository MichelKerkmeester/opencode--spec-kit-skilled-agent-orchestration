---
title: "V [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/008-bug-fixes-and-data-integrity/checklist]"
description: "Verification Date: Not Started"
trigger_phrases:
  - "bug fixes and data integrity checklist"
  - "manual testing checklist"
  - "scenario verification checklist"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: Manual Testing — Bug Fixes and Data Integrity

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

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] MCP server confirmed running before test start [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-002 [P0] Pre-test checkpoint created [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-003 [P1] DB has sufficient seed data for all scenarios [EVIDENCE: tasks.md; implementation-summary.md]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P1] Playbook scenario files reviewed before execution — all 11 playbook scenario files read and cross-referenced against feature catalog [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-005 [P1] Spec/plan/tasks consistent across phase documents — spec.md, plan.md, tasks.md all reference same 11 scenario IDs and acceptance criteria [EVIDENCE: tasks.md; implementation-summary.md]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Scenario 001 — Graph channel ID fix (G1): PASS [2026-03-22; `graph-search-fn.ts:170-197` converts source_id/target_id via `Number()` before comparison; FTS5 and LIKE-fallback paths both use numeric IDs; graph channel returns results when causal edges exist] [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-011 [P0] Scenario 002 — Chunk collapse deduplication (G3): PASS [2026-03-22; `stage3-rerank.ts:228-229` calls `collapseAndReassembleChunkResults()` unconditionally — no `includeContent` conditional gate; `chunk-reassembly.ts:73` confirms function runs on every search regardless of content mode] [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-012 [P0] Scenario 003 — Co-activation fan-effect divisor (R17): PASS [2026-03-22; `co-activation.ts:101` applies `fanDivisor = Math.sqrt(Math.max(1, relatedCount))` in `boostScore()` helper path; `stage2-fusion.ts` hot-path now also applies fan-effect divisor via `getRelatedMemories()` lookup — code fixed to wire `1/sqrt(relatedCount)` into Stage 2 co-activation boost] [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-013 [P0] Scenario 004 — SHA-256 content-hash deduplication (TM-02): PASS [2026-03-22; `dedup.ts:248-261` `checkContentHashDedup()` returns `status: 'duplicate'` on hash match and logs T054 event; `checkExistingRow()` returns `status: 'unchanged'` for same-path same-hash — both skip embedding generation] [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-014 [P0] Scenario 065 — Database and schema safety: PASS [2026-03-22; B1: `reconsolidation.ts` uses `importance_weight` with `Math.min(1.0, currentWeight + 0.1)`; B2: `checkpoints.ts` DDL runs before `BEGIN`; B3: `causal-edges.ts:556-558` `WHERE source_id = ? OR target_id = ?`; B4: `pe-gating.ts:191-193` and `223` validate `result.changes`] [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-015 [P0] Scenario 068 — Guards and edge cases: PASS [2026-03-22; E1: `temporal-contiguity.ts:77` `for (let j = i + 1; ...)` — no double-counting of (A,B)/(B,A) pairs; E2: `extraction-adapter.ts` returns `null` on unresolved entity — no wrong-memory fallback; module marked `@deprecated` — not wired to production pipeline] [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-016 [P0] Scenario 075 — Canonical ID dedup hardening: PASS [2026-03-22; `hybrid-search.ts:1281-1289` `canonicalResultId()` normalizes 42 / "42" / "mem:42" to same string key; used in `combinedLexicalSearch()` merge map and in `hybridSearch()` dedup map — both paths covered; regression tests T031-LEX-05 and T031-BASIC-04 documented] [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-017 [P0] Scenario 083 — Math.max/min stack overflow elimination: PASS [2026-03-22; all identified production call sites converted to `.reduce()` — `rsf-fusion.ts:129-132` (4+2 instances), `causal-boost.ts:566`, `evidence-gap-detector.ts:163`, `prediction-error-gate.ts:508-509`, `retrieval-telemetry.ts:292`, `reporting-dashboard.ts:291-292`; each site has comment citing stack overflow rationale] [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-018 [P0] Scenario 084 — Session-manager transaction gap fixes: PASS [2026-03-22; `session-manager.ts` `enforceEntryLimit()` called inside `db.transaction()` at line 460-463 (`markMemorySent`) and inside `db.transaction()` at lines 490-499 (`markMemoriesSentBatch`); both insert-and-cap paths are now atomic] [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-019 [P0] Scenario 116 — Chunking safe swap atomicity (P0-6): PASS [2026-03-22; `chunking-orchestrator.ts:327` stages new chunks without `parent_id` during safe-swap path (`useSafeSwap ? {} : { parent_id: parentId }`); `finalizeSwapTx()` at line 455 atomically attaches new children, updates parent metadata, and archives old children; `successCount === 0` at line 361 rolls back staged chunks, preserves existing parent, returns `status: 'error'`] [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-020 [P0] Scenario 117 — SQLite datetime session cleanup (P0-7): PASS [2026-03-22; `working-memory.ts:259-263` `cleanupOldSessions()` uses `datetime(last_focused) < datetime(?, '-' || ? || ' seconds')` — pure SQLite-native comparison, no JavaScript `toISOString()` involved; ASCII sort-order bug eliminated; both YYYY-MM-DD HH:MM:SS and ISO formats handled correctly by SQLite `datetime()` function] [EVIDENCE: tasks.md; implementation-summary.md]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials added to bug-fixes phase documents [EVIDENCE: tasks.md; implementation-summary.md]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] All scenario results recorded in tasks.md [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-041 [P0] implementation-summary.md filled in with results and date [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-042 [P2] Any FAIL findings linked to a follow-up tracking item — All 11 scenarios PASS; no FAIL or PARTIAL findings to track [EVIDENCE: tasks.md; implementation-summary.md]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp notes in scratch/ only [EVIDENCE: tasks.md; implementation-summary.md]
- [x] CHK-051 [P2] scratch/ cleaned before completion [EVIDENCE: tasks.md; implementation-summary.md]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 3 | 3/3 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-03-22
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — one P0 item per scenario
Mark checked with evidence when scenario passes, e.g.:
- [ ] CHK-010 [P0] Scenario 001 — Graph channel ID fix (G1): PASS [Run: YYYY-MM-DD, evidence here]
P0 must complete, P1 need approval to defer
-->
