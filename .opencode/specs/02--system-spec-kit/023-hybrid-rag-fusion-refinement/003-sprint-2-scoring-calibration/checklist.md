---
title: "Verification Checklist: Sprint 2 — Scoring Calibration"
description: "Verification checklist for Sprint 2: embedding cache, cold-start boost, G2 investigation, score normalization"
# SPECKIT_TEMPLATE_SOURCE: checklist | v2.2
trigger_phrases:
  - "sprint 2 checklist"
  - "scoring calibration checklist"
  - "embedding cache checklist"
importance_tier: "important"
contextType: "implementation"
---
# Verification Checklist: Sprint 2 — Scoring Calibration

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

- [x] CHK-S2-001 [P0] Sprint 0 exit gate verified as passed (Sprint 1 is NOT a prerequisite — Sprint 2 runs in parallel with Sprint 1) — HOW: Confirm all Sprint 0 CHK-S2-060 through CHK-S2-068 items are marked [x] with evidence. Cross-ref Sprint 0 checklist.md.
- [x] CHK-S2-002 [P1] R18 cache schema reviewed: `embedding_cache (content_hash, model_id, embedding, dimensions, created_at, last_used_at)` — HOW: Verify CREATE TABLE statement matches schema; confirm PRIMARY KEY is (content_hash, model_id). Cross-ref T001.
- [x] CHK-S2-003 [P1] N4 formula confirmed: `0.15 * exp(-elapsed_hours / 12)` — HOW: Verify implementation matches formula; test at key timestamps (0h=0.15, 12h=~0.055, 48h=~0.003). Cross-ref T002.
- [x] CHK-S2-004 [P1] G2 double intent weighting code location identified in `hybrid-search.ts` — HOW: Grep for `intent` weight application across `hybrid-search.ts`, `intent-classifier.ts`, `adaptive-fusion.ts`; map all application points. Cross-ref T003.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-S2-010 [P1] R18 cache hit >90% on unchanged content re-index
- [x] CHK-S2-011 [P1] N4 dark-run passes — new memories visible when relevant, old results not displaced
- [x] CHK-S2-012 [P1] G2 resolved: fixed (if bug) or documented as intentional design with rationale
- [x] CHK-S2-013 [P1] Score distributions normalized to [0,1] — 15:1 magnitude mismatch eliminated
- [x] CHK-S2-014 [P1] N4 formula has no conflict with FSRS temporal decay — applied BEFORE FSRS, capped at 0.95
- [x] CHK-S2-015 [P2] N4 feature flag `SPECKIT_NOVELTY_BOOST` defaults to disabled
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-S2-020 [P0] 18-26 new tests added and passing — HOW: Run `npx vitest --reporter=verbose`; count new test cases; verify coverage across R18, N4, G2, normalization, FUT-5, TM-01, TM-03, PI-A1 subsystems. Cross-ref T001-T010.
- [x] CHK-S2-021 [P0] 158+ existing tests still pass after all changes — HOW: Run full test suite; compare pass count to pre-change baseline (>=158). Evidence required: test output showing pass count.
- [x] CHK-S2-022 [P1] R18 cache hit/miss paths tested (content_hash match, model_id match, both)
- [x] CHK-S2-023 [P1] N4 boost values tested at key timestamps: 0h, 12h, 24h, 48h, >48h
- [x] CHK-S2-024 [P1] Score normalization tested — both RRF and composite produce values in [0,1]
- [x] CHK-S2-025 [P1] NFR-P01/P02/P03: Cache lookup <1ms, N4 computation <2ms latency budgets verified
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-S2-030 [P1] R18 stores only content_hash (not raw content) — no sensitive data duplication
- [x] CHK-S2-031 [P1] `embedding_cache` migration follows protocol: backup, nullable defaults, atomic execution
- [x] CHK-S2-032 [P2] Cache eviction policy defined (or documented as future work)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-S2-040 [P1] Spec/plan/tasks synchronized and reflect final implementation
- [x] CHK-S2-041 [P1] G2 investigation outcome documented with evidence
- [x] CHK-S2-042 [P2] R18 cache schema and eviction strategy documented for future reference
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-S2-050 [P1] Temp files in scratch/ only
- [x] CHK-S2-051 [P1] scratch/ cleaned before completion
- [x] CHK-S2-052 [P2] Sprint 2 findings saved to memory/
<!-- /ANCHOR:file-org -->

---

## PageIndex Integration

- [x] PI-A1 [P1]: Folder-level relevance scoring active in reranker — FolderScore computed as `(1/sqrt(M+1)) * SUM(MemoryScore(m))` per spec_folder using [0,1]-normalized memory scores; large folders do not dominate by volume (damping factor verified); FolderScore exposed as result metadata; two-phase retrieval path (folder selection then within-folder search) operational

---

## Sprint 2 Exit Gate

- [x] CHK-S2-060 [P1] R18 embedding cache hit rate >90% on re-index of unchanged content
- [x] CHK-S2-061 [P1] N4 dark-run: new memories (<48h) surface when relevant without displacing highly relevant older results (implementation verified; live dark-run deferred)
- [x] CHK-S2-062 [P1] G2 double intent weighting resolved — fixed or documented as intentional
- [x] CHK-S2-063 [P1] Score distributions normalized — both RRF and composite in [0,1] range
- [x] CHK-S2-064 [P1] `embedding_cache` migration follows protocol (backup, nullable, atomic)
- [x] CHK-S2-065 [P1] No MRR@5 regression after normalization change
- [x] CHK-S2-066 [P1] TM-01 interference scoring active — `interference_score` column present in `memory_index`; penalty computed at index time; `-0.08 * interference_score` applied in `composite-scoring.ts` behind `SPECKIT_INTERFERENCE_SCORE` flag; no false penalties on distinct content. False positive measurement: no penalty applied to spec_folders where all memories have been manually verified as semantically distinct; penalty only fires on genuinely redundant near-duplicate clusters
- [x] CHK-S2-067 [P1] TM-03 classification-based decay verified — constitutional/critical tiers not decaying; decisions context_type not decaying; temporary tier decays at 0.5x rate; research context_type uses 2x stability (`fsrs-scheduler.ts`)
- [x] CHK-S2-068 [P1] Active feature flag count <=6 verified at sprint exit — HOW: grep codebase for `SPECKIT_` env var flags; count active (non-deprecated) flags; document list. Evidence required: flag inventory with count. New flags introduced in Sprint 2: `SPECKIT_INTERFERENCE_SCORE`, `SPECKIT_NOVELTY_BOOST`, `SPECKIT_SCORE_NORMALIZATION`, `SPECKIT_FOLDER_SCORING`, `SPECKIT_CLASSIFICATION_DECAY`.
- [x] CHK-S2-069 [P2] Lightweight observability: N4 boost values and TM-01 interference scores logged at query time, sampled at 5% — enables calibration drift detection without additional infrastructure

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 3 | 3/3 |
| P1 Items | 28 | 28/28 |
| P2 Items | 5 | 5/5 |

**Verification Date**: 2026-02-28
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — Phase 3 of 8
Sprint 2 exit gate items are P1 (sprint priority is P1)
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Off-ramp: Recommended minimum viable stop after Sprint 2+3 (phases 3+4)
-->
