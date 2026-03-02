---
title: "Implementation Plan: Refinement Phase 6 — Opus Review Remediation"
description: "5-sprint plan implementing 37 remediation fixes (4 P0 + 33 P1) for spec-kit-memory MCP server."
trigger_phrases:
  - "refinement phase 6 plan"
  - "opus remediation sprints"
  - "legacy pipeline removal"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Refinement Phase 6 — Opus Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | MCP Server (Model Context Protocol) |
| **Storage** | SQLite (better-sqlite3) |
| **Testing** | Vitest (7,081+ tests baseline) |

### Overview
Implements 37 remediation fixes across 5 sprints. Sprint 1 removes the legacy V1 pipeline (~600 LOC) which resolves all 4 P0 critical issues. Sprints 2–5 address P1 findings in scoring/fusion, pipeline/mutation, graph/cognitive, and evaluation domains. Each sprint is independently committable.

**Base path:** `.opencode/skill/system-spec-kit/mcp_server/`
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (7,081+ tests pass, 50+ new tests)
- [x] Dependencies identified (Sprint 1 blocks 2–4; Sprint 5 independent)

### Definition of Done
- [ ] All 37 fixes implemented with tests
- [ ] Full test suite passes (>= 7,081 existing + new)
- [ ] Each sprint committed independently
- [ ] `implementation-summary.md` written
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single MCP server with modular pipeline architecture (Stage 1–4).

### Key Components
- **Pipeline Stages**: Stage 1 (candidate generation) → Stage 2 (fusion) → Stage 3 (rerank) → Stage 4 (filter)
- **Search**: Hybrid search (vector + BM25 + FTS5 + graph + trigger channels)
- **Scoring**: Composite scoring, RRF fusion, adaptive fusion, interference scoring
- **Storage**: SQLite with transaction manager, causal edges, session manager
- **Cognitive**: Working memory, co-activation, session learning

### Data Flow
Query → Stage 1 (candidates + constitutional) → Stage 2 (fusion + intent weights) → Stage 3 (rerank + MMR) → Stage 4 (filter + dedup) → Results
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Sprint 1: Legacy Pipeline Removal + P0 Critical Fixes
**Fixes:** P0-1, P0-2, P0-3, P0-4, #17 | **Risk:** MEDIUM-HIGH | **~650 removed, ~80 added**

- [ ] Remove legacy `STATE_PRIORITY` map from `memory-search.ts`
- [ ] Remove `MAX_DEEP_QUERY_VARIANTS=6` constant
- [ ] Delete functions: `buildDeepQueryVariants()`, `strengthenOnAccess()`, `applyTestingEffect()`, `filterByMemoryState()`, `applySessionDedup()`, `applyCrossEncoderReranking()`, `applyIntentWeightsToResults()`, `shouldApplyPostSearchIntentWeighting()`, `postSearchPipeline()`
- [ ] Remove `if (isPipelineV2Enabled())` branch — make V2 the only path
- [ ] Mark `isPipelineV2Enabled()` as always-true with deprecation comment in `search-flags.ts`
- [ ] Add orphaned chunk detection to `verify_integrity()` in `vector-index-impl.ts`
- [ ] Add tests for orphaned chunk detection
- [ ] Verify no test depends on `SPECKIT_PIPELINE_V2=false`
- [ ] Run full test suite — confirm >= 7,081 passing

### Sprint 2: Scoring & Fusion Fixes (8 findings)
**Fixes:** #5–#12 | **Risk:** MEDIUM | **~120 modified, ~50 added**

- [ ] #5: Add recency scoring to `applyIntentWeights` in `intent-classifier.ts`
- [ ] #6: Normalize five-factor weights to sum 1.0 in `composite-scoring.ts`
- [ ] #7: Replace spread-based min/max with loop in `composite-scoring.ts`
- [ ] #8: Fix BM25 specFolder filter with DB lookup in `hybrid-search.ts`
- [ ] #9: Fix convergence double-counting in `rrf-fusion.ts`
- [ ] #10: Normalize adaptive fusion core weights in `adaptive-fusion.ts`
- [ ] #11: Create shared `resolveEffectiveScore()` in `types.ts`; replace Stage 2's `resolveBaseScore()`
- [ ] #12: Add optional `threshold` param to `computeInterferenceScoresBatch()`
- [ ] Add tests for all 8 fixes
- [ ] Run full test suite

### Sprint 3: Pipeline, Retrieval, and Mutation Fixes (10 findings)
**Fixes:** #13–#16, #18–#23 | **Risk:** MEDIUM | **~200 modified, ~100 added**

- [ ] #13: Add hidden params to `memorySearch.inputSchema` in `tool-schemas.ts`
- [ ] #14: Remove dead `sessionDeduped` from Stage 4 metadata
- [ ] #15: Pass constitutional count from Stage 1 through to Stage 4
- [ ] #16: Cache embedding in Stage 1 for constitutional reuse
- [ ] #18: Fix `simpleStem` double-consonant handling in `bm25-index.ts`
- [ ] #19: Embed full content (not title only) in `memory-crud-update.ts`
- [ ] #20: Clean all ancillary records on delete in `vector-index-impl.ts`
- [ ] #21: Clean BM25 index on delete in `vector-index-impl.ts`
- [ ] #22: Add SAVEPOINT to `atomicSaveMemory` in `transaction-manager.ts`
- [ ] #23: Use dynamic error code in `memory-save.ts` preflight
- [ ] Add tests for all 10 fixes
- [ ] Run full test suite

### Sprint 4: Graph/Causal + Cognitive Memory Fixes (9 findings)
**Fixes:** #24–#32 | **Risk:** LOW-MEDIUM | **~150 modified, ~80 added**

- [ ] #24: Prevent self-loops in `causal-edges.ts`
- [ ] #25: Clamp maxDepth to [1,10] in `causal-graph.ts`
- [ ] #26: Add FK/existence check in `causal-edges.ts`
- [ ] #27: Replace edge-count debounce with count:maxId in `community-detection.ts`
- [ ] #28: Add `cleanupOrphanedEdges()` in `causal-edges.ts`
- [ ] #29: Clamp WM scores to [0,1] in `working-memory.ts`
- [ ] #30: Remove double-decay in `memory-triggers.ts`
- [ ] #31: Fix off-by-one in `session-manager.ts`
- [ ] #32: Export `clearRelatedCache()` from `co-activation.ts`; call after bulk ops
- [ ] Add tests for all 9 fixes
- [ ] Run full test suite

### Sprint 5: Evaluation Framework + Housekeeping (6 findings)
**Fixes:** #33–#38 | **Risk:** LOW | **~80 modified, ~40 added**

- [ ] #33: Use `recallK` for ablation limit in `eval-reporting.ts`
- [ ] #34: Initialize `_evalRunCounter` from DB in `eval-logger.ts`
- [ ] #35: Allow postflight UPDATE in `session-learning.ts`
- [ ] #36: Add input guard to `parseArgs<T>()` in `tools/types.ts`
- [ ] #37: Extend dedup hash to 128-bit in `session-manager.ts`
- [ ] #38: Add `cleanupExitHandlers()` in `access-tracker.ts`
- [ ] Add tests for all 6 fixes
- [ ] Run full test suite
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Individual fix verification | Vitest |
| Regression | Full suite (7,081+ tests) | `npm test` |
| Integration | Pipeline end-to-end scoring | Existing integration tests |

**Per-Sprint Test Requirements:**
- Sprint 1: Orphaned chunk detection test, verify no legacy pipeline test dependencies
- Sprint 2: Stack overflow with 200K array, weight normalization sums, BM25 filter effectiveness
- Sprint 3: Embedding call count, stemmer symmetry, delete cleanup completeness, SAVEPOINT rollback
- Sprint 4: Self-loop rejection, depth clamping, score bounds, decay correctness
- Sprint 5: Ablation limit, evalRunId persistence, hash length, handler removal
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 1 completion | Internal | Pending | Blocks Sprints 2–4 |
| 015 effectiveScore fix | Internal | Complete | Sprint 2 #11 scope reduced |
| 016 hybrid-search changes | Internal | Complete | Verify line numbers in Sprint 2 #8 |
| Test baseline (7,081+) | Internal | Verified | Regression threshold |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Test suite drops below 7,081 passing tests after any sprint
- **Procedure**: `git revert` the sprint commit; investigate failures before re-attempting
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Sprint 1 (P0 + Legacy)  ──┬──> Sprint 2 (Scoring)
                           ├──> Sprint 3 (Pipeline + Mutation)
                           └──> Sprint 4 (Graph + Cognitive)

Sprint 5 (Eval + Housekeeping)  ──> Independent (parallel with 2–4)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Sprint 1 | None | Sprints 2, 3, 4 |
| Sprint 2 | Sprint 1 | None |
| Sprint 3 | Sprint 1 | None |
| Sprint 4 | Sprint 1 | None |
| Sprint 5 | None | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated LOC |
|-------|------------|---------------|
| Sprint 1: Legacy Removal | High | ~730 (650 removed, 80 added) |
| Sprint 2: Scoring/Fusion | Medium | ~170 (120 modified, 50 added) |
| Sprint 3: Pipeline/Mutation | Medium | ~300 (200 modified, 100 added) |
| Sprint 4: Graph/Cognitive | Medium | ~230 (150 modified, 80 added) |
| Sprint 5: Eval/Housekeeping | Low | ~120 (80 modified, 40 added) |
| **Total** | | **~1,550 LOC** |
<!-- /ANCHOR:effort -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Remove Legacy V1 Pipeline Entirely

**Status**: Accepted

**Context**: The V1 pipeline has been default-off since `SPECKIT_PIPELINE_V2=true` became the default. It contains 3 of 4 P0 bugs (inverted STATE_PRIORITY, different scoring order, MAX_DEEP_QUERY_VARIANTS mismatch). Maintaining it doubles the surface area for bugs.

**Decision**: Delete all legacy pipeline code (~600 LOC) rather than fixing the bugs in it.

**Consequences**:
- Eliminates 3 P0 bugs at once
- Reduces codebase by ~600 lines
- `SPECKIT_PIPELINE_V2=false` no longer functional (acceptable — it was already default-on)

### ADR-002: Shared resolveEffectiveScore() Function

**Status**: Accepted

**Context**: Stage 2's `resolveBaseScore()` and Stage 3's `effectiveScore()` compute the same concept with different logic. Stage 3 was fixed by 015 to use the correct fallback chain. Stage 2 still uses wrong order and no clamping.

**Decision**: Create shared `resolveEffectiveScore()` in `pipeline/types.ts` based on Stage 3's corrected pattern. Replace both functions.

**Consequences**:
- Consistent scoring across all pipeline stages
- Single point of change for future score resolution updates
- 9+ call sites in Stage 2 need updating

### ADR-003: Stemmer Double-Consonant Handling

**Status**: Accepted

**Context**: `simpleStem()` strips `-ing`/`-ed` suffixes but doesn't handle doubled consonants, producing "runn" from "running" instead of "run".

**Decision**: Add double-consonant reduction after suffix stripping. Check if the last two characters are identical consonants and remove one.

**Consequences**:
- "running"→"run", "stopped"→"stop" work correctly
- Only affects new indexing; existing BM25 data unchanged until re-index
- Minor risk of over-stemming rare words

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
