---
title: "Tasks: Sprint 2 — Scoring Calibration"
description: "Task breakdown for Sprint 2: embedding cache, cold-start boost, G2 investigation, score normalization"
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
trigger_phrases:
  - "sprint 2 tasks"
  - "scoring calibration tasks"
  - "embedding cache tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Sprint 2 — Scoring Calibration

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
| `[GATE]` | Sprint exit gate |

**Task Format**: `T### [P?] Description (file path) [effort] {dependencies} — Requirement`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Embedding Cache (R18)

- [x] T001 [P] Create `embedding_cache` table with migration — schema: `content_hash TEXT, model_id TEXT, embedding BLOB, dimensions INT, created_at TEXT, last_used_at TEXT, PRIMARY KEY (content_hash, model_id)` [8-12h] — R18 (REQ-S2-001)
  - [x] T001a Create table migration with backup protocol — Implementation hint: Use `db.exec('CREATE TABLE IF NOT EXISTS embedding_cache ...')` pattern from existing migrations in `db.ts`
  - [x] T001b Implement cache lookup logic in embedding pipeline — Implementation hint: Check `SELECT embedding FROM embedding_cache WHERE content_hash = ? AND model_id = ?` before calling embedding API; update `last_used_at` on hit
  - [x] T001c Implement cache store logic on embedding generation — Implementation hint: After successful embedding generation, `INSERT OR REPLACE INTO embedding_cache ...`
  - [x] T001d Add `last_used_at` update for cache eviction support — Enables future LRU eviction; `UPDATE embedding_cache SET last_used_at = datetime('now') WHERE content_hash = ? AND model_id = ?`
  - Acceptance: Cache hit rate >90% on re-index of unchanged content; cache lookup adds <1ms p95; model_id change triggers cache miss (correct behavior)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Cold-Start Boost (N4)

- [x] T002 [P] Implement cold-start boost with exponential decay behind `SPECKIT_NOVELTY_BOOST` flag (`composite-scoring.ts`) [3-5h] — N4 (REQ-S2-002)
  - Formula: `boost = 0.15 * exp(-elapsed_hours / 12)`
  - Applied BEFORE FSRS temporal decay
  - Combined score cap at 0.95
  - Acceptance: Boost at 0h = 0.15, at 12h = ~0.055, at 24h = ~0.020, at 48h = ~0.003 (effectively zero); dark-run passes
  - Implementation hint: In `composite-scoring.ts`, compute `elapsed_hours = (Date.now() - created_at_ms) / 3600000`; apply boost only when `process.env.SPECKIT_NOVELTY_BOOST === 'true'` and `elapsed_hours < 48`
  - Empirically verify: N4/FSRS interaction via dark-run (assertion alone insufficient — 0.95 cap creates interaction surface). Note: cap clipping is asymmetric — high-scoring memories (>0.80) receive less effective boost. This is expected behavior.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: G2 Investigation

- [x] T003 [P] Investigate double intent weighting — trace intent weight application through full pipeline (`hybrid-search.ts`) [4-6h] — G2 (REQ-S2-003)
  - [x] T003a Identify all locations where intent weights are applied — Implementation hint: Search for `intent` weight application in 3 files: `hybrid-search.ts`, `intent-classifier.ts`, `adaptive-fusion.ts`. Trace the data flow from classification through to final scoring.
  - [x] T003b Determine: bug or intentional design — Decision criteria: If weights are applied once in classification AND once in fusion, it is likely a bug (double-counting). If applied in classification for channel selection AND in fusion for score weighting (different purposes), it may be intentional.
  - [x] T003c If bug: fix. If intentional: document rationale — Either way, dark-run comparison before/after to verify no MRR@5 regression
  - [x] T003d Select normalization method — measure actual RRF and composite score distributions on 100-query sample; compare linear scaling vs. min-max output stability; document selection in decision record before Phase 4 begins [1-2h] {T003b} — OQ-S2-003 resolution
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Score Normalization (depends on Phase 3)

- [x] T004 Implement score normalization — both RRF and composite to [0,1] range (`rrf-fusion.ts`, `composite-scoring.ts`) [4-6h] {T003} — Calibration (REQ-S2-004)
  - Note: Normalization approach may depend on G2 outcome
- [x] T004a [P] Investigate RRF K-value sensitivity — grid search K ∈ {20, 40, 60, 80, 100}, measure MRR@5 delta per value [2-3h] {T004} — Calibration (REQ-S2-005)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Interference Scoring (TM-01)

- [x] T005 [P] Implement interference scoring — add `interference_score` column to `memory_index` (migration), compute at index time by counting memories with cosine similarity > 0.75 in same `spec_folder`, apply as `-0.08 * interference_score` in `composite-scoring.ts` behind `SPECKIT_INTERFERENCE_SCORE` flag [4-6h] — TM-01 (REQ-S2-006)
  - Note: 0.75 similarity threshold and -0.08 penalty coefficient are initial calibration values, subject to tuning after 2 eval cycles. N4 boost is applied BEFORE TM-01 penalty in composite scoring pipeline (N4 establishes floor, TM-01 penalizes cluster density).
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Classification-Based Decay (TM-03)

- [x] T006 [P] Implement classification-based decay in `fsrs-scheduler.ts` — decay policy multipliers by `context_type` (decisions: no decay, research: 2x stability, implementation/discovery/general: standard) and `importance_tier` (constitutional/critical: no decay, important: 1.5x, normal: standard, temporary: 0.5x) [3-5h] — TM-03 (REQ-S2-007)
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: Verification

- [x] T007 Verify dark-run results for N4, normalization, and TM-01 — new memories visible, old not displaced, MRR@5 not regressed, interference penalty correct [included] {T002, T004, T005}
- [x] T-FS2 Feature flag sunset review at Sprint 2 exit — review all active feature flags; permanently enable flags with positive metrics, remove flags with negative metrics, extend measurement window (max 14 days) for inconclusive flags; ensure ≤6 simultaneous active flags [0.5-1h] {T007} — NFR-O01/O02/O03
- [x] T008 [GATE] Sprint 2 exit gate verification [0h] {T001, T002, T003, T004, T004a, T005, T006, T007, T-FS2}
  - [x] R18 cache hit >90% on unchanged content re-index
  - [x] N4 dark-run passes
  - [x] G2 resolved: fixed or documented as intentional
  - [x] Score distributions normalized to [0,1]
  - [x] RRF K-value investigation completed; optimal K documented
  - [x] TM-01 interference penalty active; high-similarity cluster scores reduced; no false penalties
  - [x] TM-03 classification-based decay verified — constitutional/critical memories not decaying; temporary memories decaying faster
<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:phase-8 -->
## Phase 8 (PI-A1): Folder-Level Relevance Scoring via DocScore Aggregation

- [x] T009 [P] Implement folder-level relevance scoring in reranker — compute `FolderScore(F) = (1/sqrt(M+1)) * SUM(MemoryScore(m))` by grouping normalized memory scores by `spec_folder`; expose FolderScore as metadata on each search result; implement two-phase retrieval path (top-K folders by FolderScore then within-folder search) [4-8h] {T004} — PI-A1
  - Formula: `FolderScore = (1 / sqrt(M + 1)) * SUM(MemoryScore(m) for m in folder F)` where M = memory count in F
  - Damping factor `1/sqrt(M+1)` is mandatory — prevents large folders from dominating by volume
  - Pure scoring addition to existing reranker — no schema changes, no new tables
  - Requires [0,1]-normalized MemoryScore values from score normalization (T004) to be meaningful
  - Extends R-006 (weight rebalancing surface) and R-007 (post-reranker stage in scoring pipeline)
- [x] T010 [P] Add lightweight observability — log N4 boost values and TM-01 interference scores at query time, sampled at 5% of queries [2-4h] {T002, T005} — Observability (P2)
<!-- /ANCHOR:phase-8 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001-T009 (including T004a, T005, T006) marked `[x]` — T009 is required (PI-A1, P1)
- [x] T010 completed or deferred with documented reason (observability, P2 — optional)
- [x] No `[B]` blocked tasks remaining
- [x] Sprint 2 exit gate (T008) passed
- [x] 18-26 new tests added and passing
- [x] 158+ existing tests still passing
- [x] Feature flag `SPECKIT_NOVELTY_BOOST` enabled (or decision to keep disabled documented)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:task-id-mapping -->
## Task ID Mapping (Child → Parent)

Child tasks use local IDs; parent `../tasks.md` uses global IDs. Cross-reference table:

| Child Task ID | Parent Task ID | Description |
|---------------|----------------|-------------|
| T001 | T015 | Embedding cache (R18) |
| T002 | T016 | Cold-start boost with decay (N4) |
| T003 | T017 | Investigate double intent weighting (G2) |
| T004 | T018 | Score normalization |
| T004a | T020a | RRF K-value sensitivity |
| T005 | T056 | Interference scoring (TM-01) |
| T006 | T057 | Classification-based decay (TM-03) |
| T007 | T019 | Dark-run verification (N4 + normalization) |
| T-FS2 | T-FS2 | Feature flag sunset review (Sprint 2 exit) |
| T008 | T020 | Sprint 2 exit gate verification |
| T009 | PI-A1 | Folder-level DocScore aggregation (PI-A1) |
| T010 | *(not in parent)* | Observability logging (N4/TM-01 query-time) |
<!-- /ANCHOR:task-id-mapping -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Tasks**: See `../tasks.md`
- **Predecessor Tasks**: See `../001-sprint-0-measurement-foundation/tasks.md` (direct dependency — Sprint 1 is a parallel sibling)
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — Phase 3 of 8
- 12 tasks across 8 phases (T001-T010 + T004a + T-FS2)
- Phase 1-2: T001-T002 parallelizable (R18, N4 independent)
- Phase 3: T003 parallelizable (G2 independent)
- Phase 4: T004, T004a depend on T003 (G2 outcome influences normalization)
- Phase 5: T005 parallelizable (TM-01 independent)
- Phase 6: T006 parallelizable (TM-03 independent)
- Phase 7: T007, T-FS2, T008 verification + feature flag sunset + exit gate
- Phase 8: T009 (PI-A1, required), T010 (observability, P2 optional)
-->
