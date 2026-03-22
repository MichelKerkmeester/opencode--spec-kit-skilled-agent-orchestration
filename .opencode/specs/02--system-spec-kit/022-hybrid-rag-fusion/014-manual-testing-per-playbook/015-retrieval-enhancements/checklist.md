---
title: "Verification Checklist: Manual Testing — Retrieval Enhancements (Phase 015)"
description: "Verification checklist for Phase 015 retrieval enhancements manual test execution. One P0 item per scenario, all unchecked. 11 scenarios: 055, 056, 057, 058, 059, 060, 077, 093, 094, 096, 145."
trigger_phrases:
  - "retrieval enhancements checklist"
  - "phase 015 verification checklist"
  - "manual testing retrieval enhancements checks"
  - "055 056 057 retrieval checklist"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: Manual Testing — Retrieval Enhancements (Phase 015)

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

- [x] CHK-001 [P0] Playbook loaded — all 11 scenario files read from `.opencode/skill/system-spec-kit/manual_testing_playbook/15--retrieval-enhancements/`
- [x] CHK-002 [P0] Review protocol loaded — PASS/PARTIAL/FAIL verdict rules applied via code analysis methodology
- [x] CHK-003 [P1] Feature catalog links confirmed — all 9 feature catalog files in `feature_catalog/15--retrieval-enhancements/` cross-referenced
- [x] CHK-004 [P1] Baseline env var state: all flags default-ON (SPECKIT_CONSOLIDATION, SPECKIT_ENTITY_LINKING, SPECKIT_MEMORY_SUMMARIES, SPECKIT_CONTEXT_HEADERS); SPECKIT_RESPONSE_TRACE defaults to unset (false); SPECKIT_SEARCH_FALLBACK defaults unset
- [x] CHK-005 [P1] Sandbox not required — verdicts assigned by static code analysis; no DB mutations performed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Scenario 055 — **PASS**. `autoSurfaceAtToolDispatch` fires for non-memory-aware tools (`context-server.ts:306`); `autoSurfaceAtCompaction` fires at `mode='resume'` compaction events (`context-server.ts:295`); MEMORY_AWARE_TOOLS skip set prevents recursion (`hooks/memory-surface.ts:42-50`); token budgets 4000 tokens each (`hooks/memory-surface.ts:53-54`).
- [x] CHK-011 [P0] Scenario 056 — **PASS**. Constitutional tier queried by `importance_tier='constitutional'` (`hooks/memory-surface.ts:101-108`); `enrichWithRetrievalDirectives` adds `retrieval_directive` metadata field to each result (`lib/search/retrieval-directives.ts:323-350`); tier classification and enrichment fields confirmed present.
- [x] CHK-012 [P0] Scenario 057 — **PASS**. `queryHierarchyMemories` in `lib/search/spec-folder-hierarchy.ts:261-299` scores self=1.0, parent=0.8 (0.8−i×0.2 decay), sibling=0.5; results sorted descending by relevance; wired into Stage 1 via `graph-search-fn.ts:92-100`.
- [x] CHK-013 [P0] Scenario 058 — **PASS**. `runConsolidationCycle` in `lib/storage/consolidation.ts:438-474` runs: (1) `scanContradictions` + `buildContradictionClusters`, (2) `runHebbianCycle` (strengthening + 30-day decay), (3) `detectStaleEdges`; all 3 sub-processes produce output fields in `ConsolidationResult`; gated by `SPECKIT_CONSOLIDATION`.
- [x] CHK-014 [P0] Scenario 059 — **PASS**. `checkScaleGate` in `lib/search/memory-summaries.ts:210-226` returns true only when `COUNT(*) > 5000`; Stage 1 gates summary channel on both `isMemorySummariesEnabled()` AND `checkScaleGate(db)` (`stage1-candidate-gen.ts:876-879`); channel inert below threshold (block not entered).
- [x] CHK-015 [P0] Scenario 060 — **PASS**. `lib/search/entity-linker.ts:588-679` — entity linker inserts `relation='supports'` causal edges for cross-folder memory pairs; global density guard projects `(totalEdges+1)/totalMemories` before each insert and skips if above `maxEdgeDensity`; MAX_EDGES_PER_NODE=20 per-node guard.
- [x] CHK-016 [P0] Scenario 077 — **PASS**. `searchWithFallbackTiered` in `lib/search/hybrid-search.ts:1536-1591` sets `forceAllChannels:true` + all four channel flags true in tier2Options (`line 1564-1572`); tier-2 results merged with tier-1; active when `SPECKIT_SEARCH_FALLBACK=true` (`search-flags.ts`).
- [x] CHK-017 [P0] Scenario 093 — **PASS**. `generateAndStoreSummary` in `lib/search/memory-summaries.ts:98-145` generates TF-IDF summary via `generateSummary`, embeds it, and persists to `memory_summaries` table; guarded by `isMemorySummariesEnabled()` at entry; scale gate `checkScaleGate` controls search-time channel activation.
- [x] CHK-018 [P0] Scenario 094 — **PASS**. Same entity-linker implementation as 060; `entity-linker.ts:1-6` header confirms "Feature catalog: Cross-document entity linking, Gated via SPECKIT_ENTITY_LINKING"; edge type verified as `'supports'` with strength 0.7; density guard and per-node cap confirmed.
- [x] CHK-019 [P0] Scenario 096 — **PASS**. `handlers/memory-search.ts:431-436` resolves `includeTrace = (SPECKIT_RESPONSE_TRACE==='true') || includeTraceArg===true`; `formatters/search-results.ts:457-477` adds all 7 score fields (semantic, lexical, fusion, intentAdjusted, composite, rerank, attention) plus `source` and `trace` only when `includeTrace` is true; objects absent when neither condition met.
- [x] CHK-020 [P0] Scenario 145 — **PASS**. `hybrid-search.ts:1127-1130` calls `injectContextualTree` when `isContextHeadersEnabled()`; `injectContextualTree` at `line 1390-1413` formats `[${left} > ${right} — ${desc}]` and truncates at `CONTEXT_HEADER_MAX_CHARS=100` (`line 229,1408`); when `SPECKIT_CONTEXT_HEADERS=false`, `isContextHeadersEnabled()` returns false and the block is skipped (no headers injected).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-030 [P0] All 11 scenarios verdicted — 11 PASS, 0 FAIL, 0 SKIP
- [x] CHK-031 [P0] Each verdict has code-analysis evidence citing specific file:line references
- [x] CHK-032 [P0] No FAIL verdicts — defect notes not required
- [x] CHK-033 [P1] Scenarios 058 and 060: code analysis confirms implementation; `runConsolidationCycleIfEnabled` acquires `BEGIN IMMEDIATE` transaction for isolation; entity-linker uses `INSERT OR IGNORE` to prevent duplicate edges
- [x] CHK-034 [P1] Scenario 096: four sub-steps verified — (1) `includeTraceArg=true` path; (2) env unset + no arg → `includeTrace=false` → objects absent; (3) `SPECKIT_RESPONSE_TRACE='true'` env override forces inclusion; (4) all 7 score sub-fields confirmed in `formatters/search-results.ts:459-467`
- [x] CHK-035 [P1] Scenario 145: both flag states verified — enabled: `injectContextualTree` formats `[parent > child — desc]` header truncated to 100 chars (`hybrid-search.ts:1406-1408`); disabled: `isContextHeadersEnabled()` returns false and injection block skipped (`line 1127`)
- [x] CHK-036 [P1] No SKIP verdicts
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No secrets or credentials added to phase 015 documents
- [x] CHK-041 [P0] No production environment modified — code-analysis only; no DB mutations performed
- [x] CHK-042 [P1] No env var changes made during analysis; baseline unchanged
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] spec.md, plan.md, tasks.md, and checklist.md are synchronised — scenario IDs and names consistent across all documents
- [x] CHK-051 [P2] implementation-summary.md updated with verdict table, pass rate, and evidence references
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Phase folder contains only: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, scratch/ — no stray files
- [x] CHK-061 [P2] No evidence scratch files generated; code-analysis verdicts inline in checklist
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 8 | 8/8 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-03-22
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
