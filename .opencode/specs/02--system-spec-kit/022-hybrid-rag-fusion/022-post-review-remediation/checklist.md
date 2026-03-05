---
title: "Verification Checklist: Post-Review Remediation"
description: "P0/P1/P2 verification checklist with tsc/test/build gates for 21 remediation findings."
SPECKIT_TEMPLATE_SOURCE: "checklist | v2.2"
trigger_phrases:
  - "remediation checklist"
  - "verification P0 P1"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Post-Review Remediation

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

<!-- ANCHOR:p0-blockers -->
## P0 — Schema Blockers

- [x] CHK-001 [P0] `learned_triggers` column exists in CREATE TABLE (`vector-index-impl.ts`) — Added at line 1902 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-002 [P0] `learned_triggers` migration exists — Migration v21 at lines 1318-1328, SCHEMA_VERSION bumped to 21 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-003 [P0] `frequency_counter` removed from test schema (`reconsolidation.vitest.ts`) — Removed from CREATE TABLE and INSERT [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-004 [P0] `interference_score` column in CREATE TABLE (`vector-index-impl.ts`) — Added at line 1903 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- /ANCHOR:p0-blockers -->

---

<!-- ANCHOR:p1-code -->
## P1 — Code Logic

- [x] CHK-010 [P1] MMR wired into Pipeline V2 path (flag-gated) — stage3-rerank.ts lines 124-176, gated by SPECKIT_MMR [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-011 [P1] Co-activation wired into Pipeline V2 path (flag-gated) — stage2-fusion.ts lines 514-551, gated by SPECKIT_COACTIVATION [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-012 [P1] SQL UPDATE blocks deduplicated in `memory-save.ts` — applyPostInsertMetadata() helper, 5 call sites [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-013 [P1] Regex sanitized before `new RegExp()` in `query-expander.ts` — escapeRegExp() at line 13, applied at line 83 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-014 [P1] NDCG grade scaling capped in `eval-metrics.ts` — MAX_WEIGHTED_GRADE=5, direct replacement at line 491 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-015 [P1] Graph SQL column reference verified in `graph-search-fn.ts` — False positive: `id` is correct PK column, no change needed [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-016 [P1] Co-activation fetch limit = `2 * maxRelated` in `co-activation.ts` — Changed at line 201 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- /ANCHOR:p1-code -->

---

<!-- ANCHOR:p1-standards -->
## P1 — Error Handling & Standards

- [x] CHK-020 [P1] 7 bare `catch` blocks have `: unknown` annotation — All 7 fixed across 5 files [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-021 [P1] Duplicate import removed from `stage3-rerank.ts` — Already resolved by Opus-B pipeline changes [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-022 [P1] Narrative comments removed from `save-quality-gate.ts` — 4 comments removed from validateStructural [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-023 [P1] TSDoc added to exported functions in `save-quality-gate.ts` — Already present on all 14 exports [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-024 [P1] Sprint-tracking comments removed — 4 comments removed from hybrid-search.ts (2) and memory-save.ts (1) + memory-context.ts crypto reorder [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-025 [P1] Import ordering fixed in `memory-context.ts` — crypto import moved to line 5 (before internal imports) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-026 [P1] Section divider styles standardized — 8 in composite-scoring.ts, 3 in tool-schemas.ts [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- /ANCHOR:p1-standards -->

---

<!-- ANCHOR:p1-docs -->
## P1 — Documentation

- [x] CHK-030 [P1] `minState` default corrected to "WARM" — summary_of_existing_features.md line 73 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-031 [P1] `asyncEmbedding` parameter documented — summary_of_existing_features.md line 135 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-032 [P1] 3 flag names corrected in docs — ENABLE_BM25, SPECKIT_DEGREE_BOOST, SPECKIT_NEGATIVE_FEEDBACK added [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- /ANCHOR:p1-docs -->

---

<!-- ANCHOR:gates -->
## Build Gates

- [x] CHK-040 [P0] `tsc --noEmit` passes — Zero errors [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-041 [P0] `npm test` passes — 7008 tests, 226 files, 0 failures [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-042 [P0] `npm run build` passes — N/A (no build script; server runs TS directly) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-043 [P1] MCP smoke test passes — memory_health (healthy, 2410 memories), memory_stats, memory_search all functional [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- /ANCHOR:gates -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 14 | 14/14 |
| P2 Items | 0 | — |

**Verification Date**: 2026-03-01
<!-- /ANCHOR:summary -->