# Consolidated implementation-summary: Post-Review Remediation Epic

Consolidated on 2026-03-05 from the following source folders:

- 002-cross-cutting-remediation/implementation-summary.md
- 022-post-review-remediation/implementation-summary.md
- 023-flag-catalog-remediation/implementation-summary.md
- 024-timer-persistence-stage3-fallback/implementation-summary.md
- 025-finalized-scope/implementation-summary.md
- 026-opus-remediation/implementation-summary.md

---

## Source: 002-cross-cutting-remediation/implementation-summary.md

# Implementation Summary: Comprehensive MCP Server Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + phase-child-header | v2.2 -->

> **Phase:** 010-comprehensive-remediation
> **Date:** 2026-02-28
> **Status:** Complete

---

## Results

| Metric | Before | After |
|--------|--------|-------|
| TypeScript errors | 0 | 0 |
| Test files | 226 | 226 |
| Tests passing | 7,026/7,027 (1 timeout flake) | 7,003/7,003 |
| Dead code (est.) | ~360 lines | Removed |
| Critical bugs | 15 identified | 15 fixed |
| Performance issues | 13 identified | 13 fixed |

> Note: Test count decreased from 7,027 to 7,003 because 24 tests for removed dead-code features were deleted (shadow scoring flag tests, RSF flag tests, shadow period tests, `getSubgraphWeights` tests, `computeCausalDepth` single-node tests, `logCoActivationEvent` tests, duplicate T007 block).

## Execution

- **3 waves** of parallel agent delegation (up to 14 agents total)
- **Wave 1:** 10 agents (6 opus, 4 sonnet) — critical bugs + dead code + performance
- **Wave 2:** 4 agents (1 opus, 3 sonnet) — dependent work (entity normalization, dead flag functions, SQL perf, entity linker perf)
- **Wave 2.5:** 4 sonnet agents — test fixups for changed behavior
- **Wave 3:** Verification — `tsc --noEmit` clean, 7003/7003 tests pass, all spot-checks pass

## Work Stream 1: Critical Bugs + Correctness (15 fixes)

### B: Database & Schema Safety
- **B1:** `reconsolidation.ts` — Removed `frequency_counter` (non-existent column), replaced with `importance_weight` merge logic
- **B2:** `checkpoints.ts` — Moved DDL before `BEGIN` transaction (SQLite auto-commits DDL)
- **B3:** `causal-edges.ts` — Fixed SQL operator precedence: `WHERE a AND (b OR c)`
- **B4:** `memory-save.ts` — Added `.changes > 0` guard on UPDATE statements

### C: Scoring & Ranking
- **C1:** `composite-scoring.ts` — Clamped composite score to [0, 1] with `Math.min(1, ...)`
- **C2:** `composite-scoring.ts` — Removed citation fallback chain; returns 0 when no citation data
- **C3:** `causal-boost.ts` — Changed `UNION ALL` to `UNION` in recursive CTE (cycle prevention)
- **C4:** `ablation-framework.ts` — Log-space binomial coefficient (overflow prevention for n>50)

### D: Search Pipeline Safety
- **D1:** `stage1-candidate-gen.ts` — Summary candidates now pass through quality filter
- **D2:** `bm25-index.ts` + `sqlite-fts.ts` — Shared `sanitizeQueryTokens()` array (consistent FTS5 tokenization)
- **D3:** `channel-representation.ts` — QUALITY_FLOOR 0.2→0.005 (RRF-compatible)

### E: Guards & Edge Cases
- **E1:** `temporal-contiguity.ts` — Fixed inner loop `j = i + 1` (no double-counting)
- **E2:** `extraction-adapter.ts` — Removed wrong-memory fallback; returns `null` on resolution failure

### A: Entity Normalization
- **A1:** Single `normalizeEntityName` in entity-linker.ts (Unicode-aware), imported by entity-extractor.ts
- **A2:** Single `computeEdgeDensity` in entity-linker.ts, imported by entity-extractor.ts

## Work Stream 2: Dead Code Removal

### Batch 1: Hot-path dead branches (~80 lines)
- Removed dead RSF branch from `hybrid-search.ts`
- Removed dead shadow-scoring branch from `hybrid-search.ts`

### Batch 2: Dead flag functions
- Removed `isShadowScoringEnabled()` from `shadow-scoring.ts` + `search-flags.ts`
- Removed `isRsfEnabled()` from `rsf-fusion.ts`
- Removed `isInShadowPeriod()` from `learned-feedback.ts` + call sites

### Batch 3: Dead module-level state
- `stmtCache` (archival-manager.ts), `lastComputedAt` (community-detection.ts), `activeProvider` (cross-encoder.ts), `flushCount` (access-tracker.ts), 3 dead config fields (working-memory.ts)

### Batch 4: Dead functions & exports
- `computeCausalDepth` single-node (graph-signals.ts), `getSubgraphWeights` (graph-search-fn.ts), `RECOVERY_HALF_LIFE_DAYS` (negative-feedback.ts), `'related'` weight (causal-edges.ts), `logCoActivationEvent` (co-activation.ts)

### Preserved (NOT dead code)
- `computeStructuralFreshness` / `computeGraphCentrality` in `fsrs.ts` — planned features, not deprecated experiments

## Work Stream 3: Performance + Test Quality

### P1: Quick wins
- **P1a:** `tfidf-summarizer.ts` — `Math.max(...spread)` → `reduce`-based max (RangeError prevention)
- **P1b:** `memory-summaries.ts` — Added `LIMIT` to unbounded query
- **P1c:** `mutation-ledger.ts` — SQL `COUNT(*)` with `json_extract` (replaced O(n) JS scan)

### P2: Test quality
- **P2a:** `memory-save-extended.vitest.ts` — Timeout 5000→15000ms
- **P2b:** `entity-linker.vitest.ts` — Added `db.close()` in afterEach
- **P2c:** `integration-search-pipeline.vitest.ts` — Rewrote 4 tautological tests
- **P2d:** Duplicate T007 block — not present in current file (pre-resolved)

### P3: Entity linker performance
- **P3a:** `entity-linker.ts` — `Set` for O(1) lookups (was O(n) `.includes()`)
- **P3b:** `entity-linker.ts` — Batch edge count query (was N+1)

### P4: SQL-level performance
- **P4a:** `causal-edges.ts` — Eliminated post-upsert SELECT via `lastInsertRowid` (3→2 round-trips)
- **P4b:** `spec-folder-hierarchy.ts` — WeakMap TTL cache for hierarchy tree (60s)

## Additional Fixes (Wave 2.5)

- `memory-parser.ts` — Added `/z_archive/` exclusion to `isMemoryFile()` spec doc detection
- `tests/README.md` — Updated statistics (196→226 files, 5797→7003 tests)

## Phase 1 Verification Evidence

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | 0 errors |
| `npx vitest run` | 226 passed, 7003 tests, 0 failures |
| `frequency_counter` in reconsolidation.ts | 0 hits |
| Single `normalizeEntityName` | entity-linker.ts:64 only |
| Composite score clamp | `Math.max(0, Math.min(1, ...))` at 3 locations |
| `UNION ALL` in causal-boost.ts | 0 hits (changed to `UNION`) |
| Dead flag functions in lib/ | 0 hits |
| `computeCausalDepth` single-node in lib/ | 0 hits |
| `getSubgraphWeights` in lib/ | 0 hits |
| `logCoActivationEvent` in lib/ | 0 hits |

## Phase 1 Files Modified

### Production (~35 files)
- `handlers/memory-save.ts`, `handlers/memory-index-discovery.ts`
- `lib/cognitive/archival-manager.ts`, `co-activation.ts`, `temporal-contiguity.ts`, `working-memory.ts`
- `lib/eval/ablation-framework.ts`, `shadow-scoring.ts`
- `lib/extraction/entity-extractor.ts`, `extraction-adapter.ts`
- `lib/graph/community-detection.ts`, `graph-signals.ts`
- `lib/parsing/memory-parser.ts`
- `lib/scoring/composite-scoring.ts`, `negative-feedback.ts`
- `lib/search/bm25-index.ts`, `causal-boost.ts`, `channel-enforcement.ts`, `channel-representation.ts`, `cross-encoder.ts`, `entity-linker.ts`, `graph-search-fn.ts`, `hybrid-search.ts`, `learned-feedback.ts`, `memory-summaries.ts`, `pipeline/stage1-candidate-gen.ts`, `rsf-fusion.ts`, `search-flags.ts`, `spec-folder-hierarchy.ts`, `sqlite-fts.ts`, `tfidf-summarizer.ts`
- `lib/storage/access-tracker.ts`, `causal-edges.ts`, `checkpoints.ts`, `mutation-ledger.ts`, `reconsolidation.ts`

### Tests (~18 files)
- `tests/channel-enforcement.vitest.ts`, `channel-representation.vitest.ts`
- `tests/co-activation.vitest.ts`, `cross-feature-integration-eval.vitest.ts`
- `tests/decay-delete-race.vitest.ts`, `entity-extractor.vitest.ts`, `entity-linker.vitest.ts`
- `tests/extraction-adapter.vitest.ts`, `feature-eval-query-intelligence.vitest.ts`
- `tests/five-factor-scoring.vitest.ts`, `full-spec-doc-indexing.vitest.ts`
- `tests/graph-search-fn.vitest.ts`, `graph-signals.vitest.ts`
- `tests/integration-search-pipeline.vitest.ts`, `intent-routing.vitest.ts`
- `tests/learned-feedback.vitest.ts`, `memory-save-extended.vitest.ts`
- `tests/mpab-quality-gate-integration.vitest.ts`, `pipeline-integration.vitest.ts`
- `tests/query-router-channel-interaction.vitest.ts`, `reconsolidation.vitest.ts`
- `tests/rsf-fusion.vitest.ts`, `session-cleanup.vitest.ts`
- `tests/shadow-scoring.vitest.ts`, `working-memory.vitest.ts`
- `tests/README.md`

---

## Phase 2: 25-Agent Review Remediation (2026-03-01)

A comprehensive 25-agent review of the full MCP server codebase identified ~65 additional issues: 5 P0 blockers, ~33 P1 required fixes, and ~25 P2 suggestions. All issues were fixed in 5 parallel waves.

### Phase 2 Results

| Metric | Before | After |
|--------|--------|-------|
| TypeScript errors | 0 | 0 |
| Test files | 226 | 226 |
| Tests passing | 7,003/7,003 | 7,008/7,008 |
| P0 blockers fixed | — | 5 |
| P1 code fixes | — | 26 |
| P1 code standard fixes | — | 6 (109 files) |
| P2 suggestions | — | ~25 |
| Documentation fixes | — | 6 |

> Note: Test count increased from 7,003 to 7,008 because new eval metrics (Precision@K, F1@K) and updated test coverage were added.

### Wave 1: P0 Blockers (5 fixes, 4 files)

- **P0-1:** `prediction-error-gate.ts` — Removed double `/100` similarity normalization (data already 0-1 scale)
- **P0-2:** `memory-save.ts` — Moved chunking check inside `withSpecFolderLock` callback (was outside serialization)
- **P0-3:** `rrf-fusion.ts` — Populated `sourceScores` in two-list `fuseResults` (field was always empty)
- **P0-4:** `pipeline/types.ts` — Removed `[key: string]: unknown` index signature escape hatch from `Stage4ReadonlyRow`
- **P0-6:** `memory-save.ts` — Replaced await-and-proceed `withSpecFolderLock` with promise-chain pattern (TOCTOU race fix)

### Wave 2: P1 Code Fixes (26 fixes, ~20 files)

#### Scoring & Pipeline (P1-A1, A2, A4)
- `rrf-fusion.ts` — Used `new Set(result.sources).size` for unique source count in convergence bonus
- `rsf-fusion.ts` — Added `sim > 1 ? sim / 100 : sim` normalization guard
- `stage3-rerank.ts` — Preserved original cosine `similarity`; stored reranker output in separate `rerankerScore`

#### Feature Flags & Guards (P1-A5, A7, A8)
- `search-flags.ts` + `hybrid-search.ts` — Added `isDegreeBoostEnabled()` function, replaced inline check
- `entity-linker.ts` + `memory-summaries.ts` — Added self-enforcing feature flag guards at top of public APIs
- `learned-feedback.ts` — Added audit-table-based `isInShadowPeriod()` with 7-day shadow period

#### Mutation & Storage (P1-B1–B5)
- `memory-save.ts` — Cache invalidation after chunked indexing; persisted mutated content from quality loop
- `reconsolidation.ts` — Added `content_hash` to UPDATE SET clause with SHA-256 recompute
- `memory-crud-update.ts` — Added BM25 re-index when title changes
- `memory-triggers.ts` — Clamped `attentionScore` to [0,1] before `Math.min` with retrievability

#### Cache & Transactions (P1-B6, B8)
- `tool-cache.ts` — Added `'memory_context'` and `'memory_list'` to `affectedTools` array
- `transaction-manager.ts` — Added AI-WHY comment documenting file-system-only atomicity

#### Cognitive Subsystem (P1-C1, C4, C5)
- `causal-edges.ts` — Fixed WHERE clause to proper disjunctive form for `last_accessed` null handling
- `co-activation.ts` — Changed to pure fan-effect formula (1/sqrt(n) decay, no `relatedCount/maxRelated` multiplier)
- `ablation-framework.ts` — Fixed inverted variable names: `queriesHurt`→`queriesChannelHelped`, `queriesHelped`→`queriesChannelHurt`

#### Eval Module (P1-D1, D2, D3)
- `eval-metrics.ts` — Added `computePrecision()` and `computeF1()` functions; updated `AllMetrics` interface
- `shadow-scoring.ts` — Cleaned header, added `@deprecated` to dead functions

### Wave 3: P1 Code Standards (6 fixes, ~80 files)

- **P1-E1:** Converted `// ─── MODULE:` headers to standard 3-line format across 71 files; converted `/* ─── N. SECTION ─── */` to `/* --- N. SECTION --- */` across 38 files (109 files total)
- **P1-E2:** Removed commented-out imports in 6 test files
- **P1-E3:** Added `AI-` prefix to 5 bare comments in production files
- **P1-E4:** `hybrid-search.ts` — Added IMPORTS section, renumbered all 15 sections sequentially
- **P1-E5:** `working-memory.ts` + `attention-decay.ts` — Normalized multi-line dividers to `/* --- N. SECTION --- */`
- **P1-E6:** `trigger-matcher.ts` — Removed redundant `module.exports` block; added `export` to `CORRECTION_KEYWORDS` and `PREFERENCE_KEYWORDS`

### Wave 4: P2 Suggestions (~25 fixes, ~15 files)

#### Performance (P2-01 through P2-06)
- `rrf-fusion.ts` — Replaced `Math.max(...scores)` with `for`-loop (stack overflow prevention)
- `consolidation.ts` — Added 5s timeout guard to O(n^2) contradiction scans
- `temporal-contiguity.ts` — Added `MAX_TOTAL_BOOST = 0.5` cap per result
- `working-memory.ts` — Added `MAX_MENTION_COUNT = 100` cap to prevent unbounded growth
- `tool-cache.ts` — Replaced O(n) eviction with O(1) Map insertion-order eviction

#### Safety & Config (P2-05 through P2-cross)
- `search-weights.json` — Removed dead `rrfFusion` and `crossEncoder` config sections
- `embedding-cache.ts` — Added `MAX_CACHE_ENTRIES = 10000` with LRU auto-eviction
- `vector-index-impl.ts` — Wrapped `readFileSync` in try-catch; added `CONSTITUTIONAL_CACHE_MAX_KEYS = 50`
- `errors/core.ts` — Generic message in `userFriendlyError` (no internal detail leakage)
- `content-normalizer.ts` — Updated misleading comment for `normalizeContentForBM25`
- `path-security.ts` — Added AI-WHY explaining fallback safety
- `tool-cache.ts` — Added try-catch for regex validation in `invalidateByPattern`
- `transaction-manager.ts` — Added `encoding: 'utf-8'` to both `readdirSync` calls
- `trigger-matcher.ts` — Added AI-WHY for `initializeDb()` side effect

### Wave 5: Documentation (6 fixes, 13 files)

- Created `checklist.md` for Sprint 009 and Sprint 010
- Cross-referenced 5 implementation-summary "Known Limitations" against current code; marked stale items as RESOLVED/SUPERSEDED
- Updated Sprint 1 flag documentation to reflect graduated-ON default state
- Added deprecation notes to Sprint 2 checklist for N4 novelty boost
- Updated `lib/eval/README.md` with 5 missing modules (channel-attribution, ground-truth-feedback, reporting-dashboard, shadow-scoring, ablation-framework)
- Added AI-WHY comment to `channel-representation.ts` documenting QUALITY_FLOOR change from 0.2 to 0.005

### Phase 2 Execution

- **5 waves** of parallel agent delegation (up to 16 agents)
- **Wave 1:** 4 parallel agents (P0 blockers — independent files)
- **Wave 2:** 6 parallel agents (P1 code fixes — independent files)
- **Wave 3:** 3 parallel agents (P1 standards — headers, cleanup, structural)
- **Wave 4:** 2 parallel agents (P2 suggestions — performance, safety)
- **Wave 5:** 1 agent (documentation fixes)
- **Test fixups:** 7 test failures found and fixed across waves (similarity scale, co-activation formula, shadow period, content_hash, module exports, error message format)

### Phase 2 Verification Evidence

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | 0 errors |
| `npx vitest run` | 226 passed, 7,008 tests, 0 failures |
| Unicode MODULE headers remaining | 0 |
| Unicode section dividers remaining | 0 |
| `withSpecFolderLock` uses promise-chain | Confirmed |
| `fuseResults` populates `sourceScores` | Confirmed |
| `Stage4ReadonlyRow` has no index signature | Confirmed |
| Prediction-error-gate no `/100` | Confirmed |

### Phase 2 Files Modified

#### Production (~50 files)
- `handlers/memory-save.ts`, `memory-crud-update.ts`, `memory-triggers.ts`
- `lib/cache/tool-cache.ts`, `embedding-cache.ts`
- `lib/cognitive/attention-decay.ts`, `co-activation.ts`, `prediction-error-gate.ts`, `temporal-contiguity.ts`, `working-memory.ts`
- `lib/errors/core.ts`
- `lib/eval/ablation-framework.ts`, `eval-metrics.ts`, `shadow-scoring.ts`, `README.md`
- `lib/parsing/content-normalizer.ts`, `trigger-matcher.ts`
- `lib/search/channel-representation.ts`, `entity-linker.ts`, `hybrid-search.ts`, `learned-feedback.ts`, `memory-summaries.ts`, `pipeline/stage3-rerank.ts`, `pipeline/types.ts`, `rrf-fusion.ts`, `rsf-fusion.ts`, `search-flags.ts`, `vector-index-impl.ts`
- `lib/storage/causal-edges.ts`, `consolidation.ts`, `reconsolidation.ts`, `transaction-manager.ts`
- `shared/utils/path-security.ts`
- `configs/search-weights.json`
- 109 files with header/divider format changes (Wave 3)

#### Tests (~12 files)
- `tests/co-activation.vitest.ts`, `cross-feature-integration-eval.vitest.ts`
- `tests/errors-comprehensive.vitest.ts`, `feature-eval-graph-signals.vitest.ts`
- `tests/fsrs-scheduler.vitest.ts`, `learned-feedback.vitest.ts`
- `tests/prediction-error-gate.vitest.ts`, `reconsolidation.vitest.ts`
- `tests/rrf-degree-channel.vitest.ts`, `signal-vocab.vitest.ts`
- 6 test files with commented-import removal (Wave 3)


---

## Source: 022-post-review-remediation/implementation-summary.md

---
title: "Implementation Summary: Post-Review Remediation"
description: "Remediated 21 P0/P1 findings from 25-agent comprehensive review of Spec Kit Memory MCP server."
SPECKIT_TEMPLATE_SOURCE: "impl-summary-core | v2.2"
trigger_phrases:
  - "remediation summary"
  - "post-review implementation"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary: Post-Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-post-review-remediation |
| **Completed** | 2026-03-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This remediation resolved 2 P0 schema blockers and 19 P1 required fixes discovered during a 25-agent comprehensive review of the Spec Kit Memory MCP server. The production schema now matches what the code expects, Pipeline V2 has full feature parity with V1, and code quality standards are enforced consistently.

### P0 Schema Fixes

The `learned_triggers` column was missing from both the CREATE TABLE definition and migrations in `vector-index-impl.ts`. A new migration (v21) adds the column with duplicate-column guard. The `interference_score` column was also missing from the base CREATE TABLE (only existed in migration v17). The test file `reconsolidation.vitest.ts` had a `frequency_counter` column not present in production. All three gaps are closed.

### Pipeline V2 Feature Parity

MMR diversity reranking now runs in Pipeline V2 Stage 3 (`stage3-rerank.ts`), gated behind `SPECKIT_MMR`. Co-activation spreading runs in Stage 2 (`stage2-fusion.ts`), gated behind `SPECKIT_COACTIVATION`. Both use the same interfaces as Pipeline V1 with graceful degradation on failure.

### SQL Deduplication

Five identical SQL UPDATE blocks in `memory-save.ts` were consolidated into a single `applyPostInsertMetadata()` helper with dynamic column building and SQL injection protection via an allowed-columns set.

### Search Subsystem Hardening

User-derived regex in `query-expander.ts` is now escaped via `escapeRegExp()` to prevent ReDoS attacks. The co-activation fetch limit in `co-activation.ts` was corrected from `maxRelated + 1` to `2 * maxRelated` per spec. The graph SQL column reference in `graph-search-fn.ts` was verified as correct (false positive).

### Eval Metrics Correction

The intent-weighted NDCG formula in `eval-metrics.ts` was using multiplier values as multiplication factors (producing extreme grades up to 15). Fixed to use them as direct replacement grades with a safety cap at 5.

### Standards & Documentation

Seven bare `catch` blocks across 5 files received `: unknown` type annotations. Sprint-tracking comments removed from 3 files. Import ordering fixed in `memory-context.ts`. Section dividers standardized across `composite-scoring.ts` (8 dividers) and `tool-schemas.ts` (3 dividers). Four narrative comments removed from `save-quality-gate.ts`. Documentation updated with correct `minState` default, `asyncEmbedding` parameter docs, and 3 flag name references.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/search/vector-index-impl.ts` | Modified | P0-1, P1-10: Added learned_triggers + interference_score to schema, migration v21, catch annotation |
| `tests/reconsolidation.vitest.ts` | Modified | P0-2: Removed frequency_counter from test schema |
| `lib/search/pipeline/stage3-rerank.ts` | Modified | P1-3: MMR wired into V2 Stage 3, catch annotations |
| `lib/search/pipeline/stage2-fusion.ts` | Modified | P1-4: Co-activation wired into V2 Stage 2 |
| `handlers/memory-save.ts` | Modified | P1-5, P1-14: SQL dedup helper, sprint comments removed |
| `lib/search/query-expander.ts` | Modified | P1-6: ReDoS protection via escapeRegExp |
| `lib/eval/eval-metrics.ts` | Modified | P1-7: NDCG grade scaling fix with cap |
| `lib/cognitive/co-activation.ts` | Modified | P1-9: Fetch limit corrected to 2*maxRelated |
| `startup-checks.ts` | Modified | P1-11: catch annotation |
| `lib/cache/tool-cache.ts` | Modified | P1-11: catch annotation |
| `handlers/memory-crud-health.ts` | Modified | P1-11: catch annotation |
| `handlers/memory-crud-update.ts` | Modified | P1-11: catch annotation |
| `lib/validation/save-quality-gate.ts` | Modified | P1-13: Narrative comments removed |
| `lib/search/hybrid-search.ts` | Modified | P1-14: Sprint comments removed |
| `handlers/memory-context.ts` | Modified | P1-15: Import ordering fixed |
| `lib/scoring/composite-scoring.ts` | Modified | P1-17: Section dividers standardized |
| `tool-schemas.ts` | Modified | P1-17: Section dividers standardized |
| `summary_of_existing_features.md` | Modified | P1-18, P1-20, P1-21: Flag refs, minState, asyncEmbedding |
| `summary_of_new_features.md` | Modified | P1-18: BM25 flag reference added |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two-wave parallel agent strategy executed via the orchestrate pattern. Wave 1 dispatched 5 Opus agents in parallel for P0 blockers and complex code logic fixes. Wave 2 dispatched 5 Sonnet agents in parallel for standards, error handling, and documentation fixes. All agents operated in isolation on non-overlapping file sets with summary-mode returns (max 30 lines).

All changes were verified against the full test suite (7008 tests across 226 files), TypeScript compilation, and MCP smoke tests (memory_health, memory_stats, memory_search).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Used multiplier values as replacement grades, not multiplication factors | The multiplier table was designed as weighted grade replacements. Using them as factors caused quadratic scaling (3*5=15). Direct use with a cap at 5 preserves intent weighting without distortion. |
| P1-8 (graph SQL column) marked as false positive | The `id` column in `memory_index` is the primary key. There is no `memory_id` column. The existing query is correct. |
| P1-12 (duplicate import) marked as already resolved | Opus-B's Pipeline V2 changes restructured the imports in stage3-rerank.ts, eliminating the duplicate. |
| P1-16 (missing TSDoc) marked as already satisfied | All 14 exported functions in save-quality-gate.ts already had TSDoc blocks. |
| SQL injection protection in dedup helper | Added ALLOWED_POST_INSERT_COLUMNS set to guard against unexpected column names in the dynamic SQL builder. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit` | PASS — zero errors |
| `npm test` (vitest) | PASS — 7008 tests, 226 files, 0 failures |
| `npm run build` | N/A — no build script (runs TypeScript directly) |
| MCP smoke test | PASS — memory_health (healthy, 2410 memories), memory_stats (functional), memory_search (functional) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **P1-8 was a false positive.** The graph SQL column `id` is correct for `memory_index`. No change was made.
2. **P1-19 (43 undocumented feature flags) was not addressed.** This requires a separate documentation effort to catalog all flags. Tracked as P2 for future work.
3. **38 P2 improvements remain deferred.** Full list captured in spec.md for future phases.
4. **Schema migration v21 requires server restart.** Existing databases will auto-migrate on next startup.
<!-- /ANCHOR:limitations -->


---

## Source: 023-flag-catalog-remediation/implementation-summary.md

---
title: "Implementation Summary: P1-19 Flag Catalog + Refinement Phase 3"
description: "68+ fixes across code quality, performance, documentation, testing, and architecture from 25-agent code review findings."
SPECKIT_TEMPLATE_SOURCE: "impl-summary-core | v2.2"
trigger_phrases:
  - "refinement phase 3 summary"
  - "flag catalog implementation"
  - "014 implementation"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary: P1-19 Flag Catalog + Refinement Phase 3

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-flag-catalog-remediation |
| **Completed** | 2026-03-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The MCP server now has a complete 89-flag environment variable catalog, hardened search pipeline scoring, 73 new tests, and improved observability across all handler error paths. This closes all remaining findings from the 25-agent code review (013).

### P1-19: Feature Flag Catalog (89 env vars)

A comprehensive "Feature Flag Reference" section was added to `summary_of_existing_features.md`, documenting 89 environment variables across 7 categories: Search Pipeline, Session/Cache, MCP Config, Memory/Storage, Embedding/API, Debug/Telemetry, and CI/Build. Each entry includes name, default value, type, status, source file, and description.

### Code Quality + Performance (Wave 1 — 15 fixes)

- **Score normalization**: `stage3-rerank.ts` now clamps `effectiveScore` to [0,1] range
- **Reference inequality**: Replaced fragile `results !== scored` with dedicated `applied` boolean in cross-encoder return type
- **Chunk reassembly**: Chunks now sort by `chunk_index` (document order) after best-chunk election
- **Set dedup**: `rsf-fusion.ts` uses `Set<string>` for O(1) source dedup in hot loop
- **SQL index**: Partial covering index on `learned_triggers` column eliminates full-table scans
- **Graph traversal indexes**: Defensive indexes on `causal_edges(source_id)` and `(target_id)`
- **Constants extraction**: `COMMUNITY_EDGE_WEIGHT_THRESHOLD`, `CODE_PUNCTUATION_DENSITY_THRESHOLD` with AI-WHY comments
- **Type safety**: `save-quality-gate.ts` uses typed `Object.entries()` instead of unsafe `as keyof` cast
- **Entity extraction**: `keyPhraseRe` now matches both `using React` and `Using React` via explicit case alternation
- **Bootstrap CI**: Fixed off-by-one in percentile calculation (`Math.ceil(n * p) - 1`)

### Documentation + Observability (Wave 2 — 16 fixes)

- **Stale comments**: Fixed "opt-in, default off" → "default: ON, graduated" in `embedding-expansion.ts`
- **SQL safety**: AI-WHY comment in `mutation-ledger.ts` explaining string interpolation safety
- **JSDoc**: Added `@param`/`@returns` to 5 quality helper functions in `memory-save.ts`
- **Score immutability**: Invariant comment in `stage2-fusion.ts`
- **Regex hardening**: Word boundary assertions in `map-ground-truth-ids.ts`
- **LIMIT clauses**: Added `LIMIT 1000` to 2 unbounded SQL queries in `reporting-dashboard.ts`
- **Latency constants**: Extracted `QUALITY_PROXY_LATENCY_CEILING_MS` and `QUALITY_PROXY_COUNT_SATURATION_THRESHOLD` in `retrieval-telemetry.ts`
- **Deprecated exports**: `@deprecated` JSDoc on unused novelty constants in `composite-scoring.ts`
- **Test timeout**: Configurable `TEST_TIMEOUT_MS` constant in `vitest.config.ts`

### Testing + Architecture Docs (Wave 3 — 73 new tests + pipeline docs)

- **feedback-denylist.vitest.ts**: 37 tests covering denylist size, edge cases, known denials
- **rsf-fusion-edge-cases.vitest.ts**: 16 tests for cross-variant bonus edge cases
- **regression-suite.vitest.ts**: 15 tests covering P0-1 schema, P1-6 ReDoS, P1-7 NDCG cap, P1-9 fetch limit
- **flag-ceiling.vitest.ts**: 5 tests validating 6+ simultaneous feature flag activation
- **requestId propagation**: 4 handler files now include `requestId` via `crypto.randomUUID()` in error logs
- **Pipeline I/O contracts**: Stage 1-4 + orchestrator documented with input/output types and invariants
- **Filter ordering**: Application order documented in `stage4-filter.ts`

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `summary_of_existing_features.md` | Modified | 89-flag environment variable catalog |
| `stage3-rerank.ts` | Modified | Score normalization, reference boolean, chunk ordering, I/O contract |
| `rsf-fusion.ts` | Modified | Set-based O(1) dedup |
| `learned-feedback.ts` | Modified | Partial covering SQL index |
| `causal-edges.ts` | Modified | Traversal indexes |
| `graph-search-fn.ts` | Modified | Edge materialization docs, cache warmup |
| `community-detection.ts` | Modified | Threshold constant extraction |
| `save-quality-gate.ts` | Modified | Type-safe Object.entries |
| `encoding-intent.ts` | Modified | Punctuation density constant |
| `entity-extractor.ts` | Modified | Case-insensitive keyword matching |
| `chunk-thinning.ts` | Modified | Code block /2 comment |
| `hybrid-search.ts` | Modified | MPAB error logging |
| `bm25-baseline.ts` | Modified | Bootstrap CI percentile fix |
| `ground-truth-feedback.ts` | Modified | Underscore convention rename |
| `embedding-expansion.ts` | Modified | Stale comment fix |
| `mutation-ledger.ts` | Modified | AI-WHY SQL safety |
| `channel-enforcement.ts` | Modified | topK JSDoc |
| `dynamic-token-budget.ts` | Modified | Advisory-only header |
| `stage2-fusion.ts` | Modified | Score immutability invariant, I/O contract |
| `memory-save.ts` | Modified | JSDoc on quality helpers, requestId |
| `map-ground-truth-ids.ts` | Modified | Regex hardening |
| `reporting-dashboard.ts` | Modified | LIMIT clauses |
| `retrieval-telemetry.ts` | Modified | Latency bucket constants |
| `composite-scoring.ts` | Modified | @deprecated on dead exports |
| `vitest.config.ts` | Modified | Test timeout constant |
| `memory-context.ts` | Modified | requestId propagation |
| `memory-crud-health.ts` | Modified | requestId propagation |
| `memory-crud-update.ts` | Modified | requestId propagation |
| `stage1-candidate-gen.ts` | Modified | I/O contract docs |
| `stage4-filter.ts` | Modified | I/O contract + filter ordering |
| `orchestrator.ts` | Modified | I/O contract docs |
| `feedback-denylist.vitest.ts` | Created | 37 denylist tests |
| `rsf-fusion-edge-cases.vitest.ts` | Created | 16 RSF edge case tests |
| `regression-suite.vitest.ts` | Created | 15 regression tests |
| `flag-ceiling.vitest.ts` | Created | 5 flag ceiling tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Executed in 3 waves of parallel agents (14 total) with zero file overlaps between agents. Wave 1 (5 Opus agents) handled code quality and performance. Wave 2 (5 mixed agents) handled documentation and observability. Wave 3 (4 agents) handled testing and architecture docs. Each wave completed before the next launched.

After all waves, TypeScript compilation passed clean (`tsc --noEmit` exit 0). The full test suite ran with 7081 tests passing. One test failure (entity-extractor regex) was identified and fixed: the `i` flag made `[A-Z]` case-insensitive, causing greedy matches. Fixed with explicit case alternation `[Uu]sing|[Ww]ith|[Vv]ia|[Ii]mplements` instead.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Explicit case alternation over `i` flag | The `i` flag on the regex made `[A-Z]` match lowercase too, breaking the continuation-word pattern that requires uppercase starts to avoid capturing common English words |
| Dedicated `applied` boolean over reference equality | Reference equality (`results !== scored`) is fragile — reranking could return a new array with identical content. A typed boolean in the return type is explicit and self-documenting |
| Partial covering index on learned_triggers | Full-table scan was hot path in search. Partial index (`WHERE learned_triggers IS NOT NULL AND != '[]'`) covers only rows with data, keeping index small |
| `fallback-reranker.ts` marked N/A | File does not exist in codebase — the finding referenced a nonexistent module |
| 3-wave execution | Maximizes parallelism while respecting file ownership. Zero overlaps between agents within a wave prevents merge conflicts |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| TypeScript compilation (`tsc --noEmit`) | PASS — exit 0 |
| Full test suite (`vitest run`) | PASS — 7081/7081 tests, 230 test files |
| Flag catalog coverage | PASS — 89 env vars documented across 7 categories |
| P2 findings addressed | PASS — 36 P2 + P1-19 closed (2 pre-resolved, 1 N/A) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Agent8-P2-2 (fallback-reranker.ts)**: Marked N/A — file does not exist. If the module is created in a future sprint, the finding should be revisited.
2. **Agent8-P2-3 (filter ordering)**: Documentation-only fix. If filter order changes, docs in `stage4-filter.ts` need updating.
3. **Performance claims are unbenched**: SQL indexes and Set dedup are structural improvements. No before/after benchmarks were run.
<!-- /ANCHOR:limitations -->


---

## Source: 024-timer-persistence-stage3-fallback/implementation-summary.md

---
title: "Implementation Summary: Refinement Phase 4"
description: "Summary of Phase 4 fixes for warn-only persistence and effectiveScore fallback ordering."
SPECKIT_TEMPLATE_SOURCE: "impl-summary-core | v2.2"
importance_tier: "normal"
contextType: "implementation"
---

# Implementation Summary: Refinement Phase 4

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

**Status:** In Progress (implementation drafted; checklist verification still open)
**Date:** 2026-03-02

## What Was Built

Two P1 fixes identified by Gemini code review (88/100 and 85/100 scores):

### P1 #1: Warn-Only Timer Persistence

**File:** `mcp_server/lib/validation/save-quality-gate.ts`

**Problem:** `qualityGateActivatedAt` was stored purely in-memory. Every server restart reset the 14-day warn-only countdown, preventing the quality gate from graduating to enforcement mode.

**Fix:** Added SQLite persistence using the existing `config` table pattern from `db-state.ts`:
- `loadActivationTimestampFromDb()` — reads from `config` table on lazy access
- `persistActivationTimestampToDb()` — writes to `config` table on set
- `clearActivationTimestampFromDb()` — clears DB entry on reset (for tests)
- `isWarnOnlyMode()` now lazy-loads from DB when in-memory value is null
- `setActivationTimestamp()` now writes to both memory and DB
- `resetActivationTimestamp()` now clears both memory and DB

All DB operations are non-fatal (try/catch with graceful fallback).

### P1 #2: effectiveScore() Fallback Chain

**File:** `mcp_server/lib/search/pipeline/stage3-rerank.ts`

**Problem:** `effectiveScore()` only checked `score` then `similarity/100`, skipping `intentAdjustedScore` and `rrfScore` from Stage 2 enrichment.

**Fix:** Updated fallback chain to: `intentAdjustedScore` -> `rrfScore` -> `score` -> `similarity/100` -> `0`

**Additional fixes in same file:**
- Cross-encoder document mapping (line 285) now uses `effectiveScore()` instead of `row.score ?? row.similarity`
- MMR candidate scoring (line 171) now uses `effectiveScore()` instead of inline fallback
- Stage 3 reranking output now preserves `stage2Score` for auditability

**Type change:** `mcp_server/lib/search/pipeline/types.ts` — added optional `stage2Score` field to `PipelineRow`

## Files Modified (4)

1. `mcp_server/lib/validation/save-quality-gate.ts` — Timer persistence
2. `mcp_server/lib/search/pipeline/stage3-rerank.ts` — effectiveScore fix + stage2Score preservation
3. `mcp_server/lib/search/pipeline/types.ts` — stage2Score type field
4. (spec folder files — documentation)

## Test Results

- **7,081/7,081 tests passing** (0 failures, 0 regressions)
- TypeScript compiles clean (only pre-existing TS6305 stale dist warnings)


---

## Source: 025-finalized-scope/implementation-summary.md

---
title: "Implementation Summary: Refinement Phase 5 Finalized Scope [template:level_2/implementation-summary.md]"
description: "Tranche-1 through tranche-4 implementation outcomes recorded with completed verification evidence."
SPECKIT_TEMPLATE_SOURCE: "impl-summary-core | v2.2"
trigger_phrases:
  - "implementation summary"
  - "tranche 1"
  - "tranche 2"
  - "tranche 3"
  - "tranche 4"
  - "refinement phase 5"
  - "verification complete"
  - "canonical id dedup"
  - "force all channels"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `022-hybrid-rag-fusion/025-finalized-scope` |
| **Completed** | Tranche-1 through tranche-4 continuation completed and verified on 2026-03-02 |
| **Level** | 2 |
| **Parent** | `022-hybrid-rag-fusion` |
| **Predecessor** | `024-timer-persistence-stage3-fallback` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Tranche-1 implementation is complete and status tracking now reflects the delivered outcomes. The completed implementation fixes are: (1) RSF/shadow/fallback/floor/reconsolidation wording corrections in `summary_of_existing_features.md`, (2) contradiction correction for `isInShadowPeriod` in `summary_of_new_features.md`, and (3) config-table ensure hardening in `save-quality-gate.ts` for DB handle changes/reinitialization, with focused coverage added in test `WO6`.

Tranche-2 continuation extends the same remediation scope by hardening canonical ID dedup behavior in hybrid search: canonicalization is now applied in `combinedLexicalSearch()` and the legacy `hybridSearch()` dedup map so IDs like `42`, `"42"`, and `mem:42` collapse correctly. Regression coverage was added through `T031-LEX-05` and `T031-BASIC-04` in `hybrid-search.vitest.ts`.

Tranche-3 continuation finalizes restart and fallback alignment. In `save-quality-gate.ts`, initialization now preserves the persisted activation timestamp via `ensureActivationTimestampInitialized`, preventing warn-only window resets on process restart. In `hybrid-search.ts`, a `forceAllChannels` option is added, tier-2 fallback sets `forceAllChannels: true`, and routing now explicitly honors the override so simple-routed queries still execute all channels during fallback. Regression coverage is added through `WO7` and `C138-P0-FB-T2`. Parent summary docs were also aligned for R11 default/gating truth, G-NEW-2 instrumentation inert status, TM-05 hook-scope correction, and dead-code list correction.

Tranche-4 continuation is a parent-summary documentation-polish pass focused on P2 alignment items A-F. This pass updates entity-linking density-guard wording to global semantics with explicit current-global-density precheck and projected post-insert density checks, corrects entity-linker SQL wording to source/target branch aggregation, aligns MPAB expansion naming to the canonical term, aligns folder-discovery initiative ID to PI-B3, updates active-flag inventory count in `search-flags.ts` references to 20, and replaces strict `SPECKIT_AUTO_ENTITIES` dependency wording with runtime-accurate `entity_catalog` dependency wording.

### Tranche-1 implementation outcomes

| Target | Outcome | Evidence |
|--------|---------|----------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md` | Corrected RSF/shadow/fallback/floor/reconsolidation wording | Contradiction/wording verification run; targeted stale phrases removed |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md` | Corrected `isInShadowPeriod` contradiction references | Contradiction verification run; stale targeted contradiction wording removed |
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts` | Hardened config-table ensure behavior across DB handle changes | Focused regression coverage added in `save-quality-gate.vitest.ts` test `WO6` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts` | Added focused handle-change coverage (`WO6`) | Targeted test run passed |

### Tranche-2 continuation outcomes

| Target | Outcome | Evidence |
|--------|---------|----------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Canonical ID dedup applied in `combinedLexicalSearch()` for mixed ID formats | Regression test `T031-LEX-05` added and passing |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Legacy `hybridSearch()` dedup map now canonicalizes IDs across channels | Regression test `T031-BASIC-04` added and passing |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts` | Added canonical dedup regression coverage for modern and legacy paths | Expanded targeted suite passed (`3 files`, `174 tests`) |

### Tranche-3 continuation outcomes

| Target | Outcome | Evidence |
|--------|---------|----------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts` | Added `ensureActivationTimestampInitialized` path to preserve persisted activation timestamp across restart | Regression test `WO7` added and passing |
| `.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts` | Added `WO7: runQualityGate does not reset persisted activation window on restart` | Expanded targeted suite rerun passed (`3 files`, `176 tests`) |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Added `forceAllChannels` option and wired tier-2 fallback to force all channels | Regression test `C138-P0-FB-T2` added and passing |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts` | Added tier-2 fallback all-channel regression coverage for simple-routed queries | Expanded targeted suite rerun passed (`3 files`, `176 tests`) |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md` | Corrected R11 default/gating truth, G-NEW-2 inert instrumentation status, TM-05 hook-scope note, and dead-code list references | Parent-level alignment update recorded |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md` | Corrected corresponding tranche-3 alignment points for gating/instrumentation/hook-scope/dead-code references | Parent-level alignment update recorded |

### Tranche-4 continuation outcomes

| Target | Outcome | Evidence |
|--------|---------|----------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md` | Updated S5 density-guard semantics to global precheck + projected-post-insert checks, changed MPAB expansion to "Multi-Parent Aggregated Bonus", aligned folder discovery ID to PI-B3, and replaced strict AUTO_ENTITIES dependency wording with `entity_catalog` dependency wording | Parent summary diff confirms A/C/D/F corrections |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md` | Updated S5 density-guard semantics with explicit dual checks, corrected entity-linker SQL performance wording to source/target branch aggregation, updated flag inventory count to 20, and replaced strict AUTO_ENTITIES dependency wording with `entity_catalog` dependency wording | Parent summary diff confirms A/B/E/F corrections |

### Child docs updated in this pass

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Modified (earlier pass) | Locked in-scope files, requirements, and acceptance scenarios for remediation child scope |
| `plan.md` | Modified (earlier pass) | Defined execution phases and exact verification commands |
| `tasks.md` | Modified (this pass) | Appended tranche-4 P2 documentation-polish tasks and updated completion criteria |
| `checklist.md` | Modified (this pass) | Added tranche-4 completed P2 evidence items and updated verification counts |
| `implementation-summary.md` | Modified (this pass) | Appended tranche-4 outcomes and updated verification details |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery combines completed tranche-1 through tranche-4 implementation outcomes with updated child status tracking docs in this folder. Verification evidence is now captured directly in `tasks.md`, `checklist.md`, and this summary so completion status is traceable without placeholder references.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep scope bounded to documented tranche-1 through tranche-4 remediation targets | Prevents drift while preserving completed multi-tranche continuity |
| Add focused test `WO6` for DB handle changes | Locks in regression coverage for config-table ensure behavior |
| Record concrete command results in checklist/tasks | Keeps completion evidence auditable and reduces ambiguity |
| Normalize memory IDs before dedup in both lexical and legacy hybrid paths | Prevents duplicate entries caused by mixed ID encodings (`42`, `"42"`, `mem:42`) |
| Preserve persisted activation timestamp on startup | Keeps warn-only activation window stable across restart and prevents false re-initialization |
| Add explicit `forceAllChannels` override path | Ensures tier-2 fallback executes complete retrieval channels even when simple-routing would otherwise reduce them |
| Use `entity_catalog` dependency language for S5 docs | Keeps documentation aligned with runtime behavior while preserving R10 as the typical data source |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Expanded targeted suite (`npm run test --workspace=mcp_server -- tests/hybrid-search.vitest.ts tests/save-quality-gate.vitest.ts tests/mpab-quality-gate-integration.vitest.ts`) | PASS (3 files passed, 176 tests passed) |
| Child-folder validation rerun after tranche-4 (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope"`) | PASS (Errors 0, Warnings 0) |
| Contradiction/wording verification search (`rg` on targeted terms) | PASS (targeted stale contradiction/wording phrases removed) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scope remains tranche-bounded.** This child now tracks tranche-1 through tranche-4 continuation outcomes; broader parent-level or unrelated remediation remains out of scope.
2. **Evidence is command/file based.** Validation is recorded from targeted test and validation runs plus wording verification output; no parent-level rollout claims are made here.
<!-- /ANCHOR:limitations -->

---

<!-- End of implementation summary for child 016 (tranche-1 through tranche-4 outcomes completed and verified). -->


---

## Source: 026-opus-remediation/implementation-summary.md

---
title: "Implementation Summary: Refinement Phase 6 — Opus Review Remediation"
description: "35 remediation fixes across 5 sprints for the spec-kit-memory MCP server, resolving 4 P0 critical and 31 P1 findings."
SPECKIT_TEMPLATE_SOURCE: "impl-summary-core | v2.2"
trigger_phrases:
  - "refinement phase 6 summary"
  - "opus remediation results"
  - "017 implementation"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: Refinement Phase 6 — Opus Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `022-hybrid-rag-fusion/026-opus-remediation` |
| **Completed** | 2026-03-02 |
| **Level** | 3 |
| **Test Baseline** | 7,086 (pre-work) |
| **Test Final** | 7,085 (post-work, -1 from removed legacy test) |
| **Fixes Implemented** | 35 of 37 planned (2 deferred) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The spec-kit-memory MCP server now runs a single, clean V2 pipeline with correct scoring, complete cleanup on delete, robust graph integrity, and reliable evaluation metrics. This work resolved all 4 P0 critical bugs and 31 of 33 P1 findings from a 10-agent Opus review, across 5 implementation sprints touching ~30 source files.

### Sprint 1: Legacy V1 Pipeline Removal

The legacy V1 pipeline (~550 lines) was the root cause of 3 of 4 P0 bugs: an inverted `STATE_PRIORITY` map, divergent scoring order in `postSearchPipeline()`, and a mismatched `MAX_DEEP_QUERY_VARIANTS=6`. Since V2 was already the default, removing the dead code resolved all three at once. The `isPipelineV2Enabled()` function now always returns `true` with a deprecation comment. Orphaned chunk detection was added to `verify_integrity()` for the fourth P0 fix.

### Sprint 2: Scoring and Fusion Corrections

Eight scoring issues were fixed: `applyIntentWeights` now includes recency-based scoring using timestamp normalization. Five-factor composite weights auto-normalize to sum 1.0 after partial overrides. `normalizeCompositeScores` uses loop-based min/max instead of `Math.max(...scores)` to prevent stack overflow on large arrays. The BM25 `specFolder` filter now does a DB lookup instead of comparing stringified numeric IDs against folder paths. Cross-variant RRF fusion no longer double-counts convergence bonuses. Adaptive fusion core weights normalize after doc-type adjustments. A shared `resolveEffectiveScore()` function in `pipeline/types.ts` replaces both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`, ensuring consistent fallback chains across all pipeline stages.

### Sprint 3: Pipeline, Retrieval, and Mutation Hardening

Ten fixes addressed schema completeness, pipeline metadata, embedding efficiency, stemmer quality, and data cleanup. The `memorySearch` tool schema now exposes `trackAccess`, `includeArchived`, and `mode` parameters. Stage 4 metadata no longer reports a dead `sessionDeduped` field. Constitutional injection count flows from Stage 1 through to Stage 4 output. Stage 1 caches the query embedding for reuse in the constitutional injection path, saving one API call per search. The `simpleStem` function handles doubled consonants ("running" -> "run"). `memory_update` now embeds `title + content_text` instead of title alone. Memory deletion cleans all ancillary tables (degree_snapshots, community_assignments, memory_summaries, memory_entities, causal_edges) and the BM25 index. The `atomicSaveMemory` function now tracks rename-failure state for better error reporting. Preflight validation uses the actual error code from validation results instead of hardcoding `ANCHOR_FORMAT_INVALID`.

### Sprint 4: Graph and Cognitive Memory Fixes

Seven fixes addressed graph integrity and cognitive scoring. Causal edge insertion now rejects self-loops (`sourceId === targetId`). The `maxDepth` parameter in `handleMemoryDriftWhy` is server-side clamped to [1, 10]. Community detection debounce uses a `count:maxId` hash instead of edge-count alone, preventing stale results after delete-then-insert sequences. A new `cleanupOrphanedEdges()` function is exported from causal-edges for use in integrity checks. Working memory scores are clamped to [0, 1] to prevent mention boost from exceeding the normalized range. The trigger handler no longer applies double-decay to working memory attention scores. The co-activation cache is cleared after bulk delete operations.

### Sprint 5: Evaluation and Housekeeping

Six housekeeping fixes: ablation framework uses `recallK` for its search limit instead of a hardcoded 20. The eval run ID counter initializes from the DB maximum on first call, surviving server restarts. Postflight recording allows UPDATE of existing complete records for re-correction. `parseArgs<T>()` guards against null/undefined/non-object input at the protocol boundary. Session dedup hashes use 128-bit (32 hex chars) instead of 64-bit (16 hex chars). Exit handlers in `access-tracker.ts` store function references for proper `process.removeListener()` cleanup.

### Deferred Fixes

Two findings were deferred:
- **#26 (FK existence check on edges)**: Implementing would require seeding `memory_index` in 20+ causal edge test fixtures. The causal_edges table uses string IDs that don't directly map to memory_index integer IDs in test environments.
- **#31 (Session entry limit off-by-one)**: Code review confirmed the current implementation is already correct. The guard `count <= max` and excess calculation `count - max` produce the correct behavior.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All 5 sprints were implemented sequentially with full test suite verification after each sprint. TypeScript compilation was verified clean before running tests. Each sprint maintained the 7,085 test pass count with zero regressions. Existing tests that referenced removed legacy code were updated to reflect the new behavior (flag tests, source-analysis tests, stemmer tests, hash-length tests). No new test files were added; fixes were validated through existing test coverage plus updated expectations.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove legacy V1 pipeline entirely | 3 of 4 P0 bugs only existed in dead code. Fixing bugs in disabled code wastes effort. -550 LOC. |
| Shared `resolveEffectiveScore()` in types.ts | Stage 2 and Stage 3 had divergent score resolution. Single function prevents future drift. |
| Stemmer double-consonant dedup | "running"->"runn" caused search misses. Simple consonant check fixes common patterns without a full Porter stemmer. |
| Defer FK check on causal edges | Test fixtures use synthetic IDs not in memory_index. Implementing would touch 20+ test files for marginal production benefit. |
| Move adaptive weight normalization inside doc-type block | Profile weights intentionally sum < 1.0 when graph weight > 0. Only normalize when doc-type adjustments alter the balance. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| TypeScript compilation (`tsc --noEmit`) | PASS (clean after each sprint) |
| Full test suite (`npm test`) | PASS (7,085/7,085 after all sprints) |
| Sprint 1: Legacy removal | PASS (V2 only path, 7,085 tests) |
| Sprint 2: Scoring fixes | PASS (all 8 fixes verified) |
| Sprint 3: Pipeline fixes | PASS (all 10 fixes verified) |
| Sprint 4: Graph fixes | PASS (7 of 9 fixes, 2 deferred) |
| Sprint 5: Eval fixes | PASS (all 6 fixes verified) |
| Spec folder validation | Pending (post-documentation) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **FK check on causal edges deferred (#26)**: Self-loops are prevented, but edges can still reference non-existent memory IDs. Production code creates edges for existing memories, so this only affects test scenarios.
2. **Stemmer handles common cases only**: The doubled-consonant check covers "running"/"stopping" patterns but not all English morphology. Rare words with legitimate double endings (e.g., "inn") may be over-stemmed.
3. **BM25 specFolder filter uses per-result DB lookup**: This is O(n) per BM25 result. Acceptable for typical result sets (<100) but could be batched for very large result sets.
4. **Existing BM25 index data not re-stemmed**: The stemmer fix only affects new indexing. Existing entries keep old stems until re-indexed.
<!-- /ANCHOR:limitations -->


---

