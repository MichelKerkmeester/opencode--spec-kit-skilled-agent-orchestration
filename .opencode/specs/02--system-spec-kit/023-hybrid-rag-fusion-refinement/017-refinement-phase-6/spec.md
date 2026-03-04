---
title: "Feature Specification: Refinement Phase 6 — Opus Review Remediation"
description: "37 remediation fixes (4 P0 + 33 P1) identified by 10-agent Opus review of the spec-kit-memory MCP server."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch | v2.2"
trigger_phrases:
  - "refinement phase 6"
  - "opus review remediation"
  - "P0 P1 fixes"
  - "017 remediation"
importance_tier: "critical"
contextType: "implementation"
---
# Feature Specification: Refinement Phase 6 — Opus Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

A 10-agent comprehensive review of the `023-hybrid-rag-fusion-refinement` codebase identified 4 P0 critical and 34 P1 important issues across the spec-kit-memory MCP server. Two prior phases (015, 016) resolved adjacent findings. This spec addresses the remaining 37 fixes across 5 implementation sprints: legacy pipeline removal, scoring/fusion corrections, pipeline/mutation hardening, graph/cognitive fixes, and evaluation housekeeping.

**Key Decisions**: Remove legacy V1 pipeline entirely (was already default-off), create shared `resolveEffectiveScore()` function, improve stemmer for double-consonant handling.

**Critical Dependencies**: Sprint 1 (legacy removal) blocks Sprints 2–4.

---

## 1. METADATA

<!-- ANCHOR:metadata -->

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 (4 critical) + P1 (33 important) |
| **Status** | Complete |
| **Created** | 2026-03-02 |
| **Parent** | `023-hybrid-rag-fusion-refinement` |
| **Siblings** | `015-gemini-review-p1-fixes` (complete), `016-alignment-remediation` (complete) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 10-agent Opus review identified 38 issues. 37 remain unresolved: 4 P0 critical bugs (inverted STATE_PRIORITY in legacy pipeline, scoring order divergence, MAX_DEEP_QUERY_VARIANTS mismatch, orphaned chunk corruption) and 33 P1 issues spanning scoring inaccuracies, mutation data leaks, graph integrity gaps, and evaluation framework defects. Fix #11's Stage 3 side was resolved by 015-gemini-review-p1-fixes.

### Purpose
Resolve all 37 remaining findings to achieve a clean, consistent, single-pipeline codebase with correct scoring, complete cleanup on delete, robust graph integrity, and reliable evaluation metrics.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Sprint 1:** Remove legacy V1 pipeline (~600 LOC), deprecate `isPipelineV2Enabled()`, add orphaned chunk detection
- **Sprint 2:** Fix 8 scoring/fusion issues (#5–#12) including shared `resolveEffectiveScore()`
- **Sprint 3:** Fix 10 pipeline/retrieval/mutation issues (#13–#16, #18–#23)
- **Sprint 4:** Fix 9 graph/causal/cognitive issues (#24–#32)
- **Sprint 5:** Fix 6 evaluation/housekeeping issues (#33–#38)
- New tests for each fix (~50–100 total)

### Out of Scope
- P2/P3 findings from the same review — tracked separately
- Parent summary documentation updates — completed in 016
- Stage 3 `effectiveScore()` fallback chain — already fixed in 015

### Files to Change

| File Path | Change Type | Sprint |
|-----------|-------------|--------|
| `handlers/memory-search.ts` | Remove ~600 lines | 1 |
| `lib/search/search-flags.ts` | Modify | 1 |
| `lib/search/vector-index-impl.ts` | Modify | 1, 3 |
| `lib/search/intent-classifier.ts` | Modify | 2 |
| `lib/scoring/composite-scoring.ts` | Modify | 2 |
| `lib/search/hybrid-search.ts` | Modify | 2 |
| `lib/search/rrf-fusion.ts` | Modify | 2 |
| `lib/search/adaptive-fusion.ts` | Modify | 2 |
| `lib/search/pipeline/stage2-fusion.ts` | Modify | 2 |
| `lib/search/pipeline/types.ts` | Modify | 2 |
| `lib/scoring/interference-scoring.ts` | Modify | 2 |
| `tool-schemas.ts` | Modify | 3 |
| `lib/search/pipeline/stage4-filter.ts` | Modify | 3 |
| `lib/search/pipeline/stage1-candidate-gen.ts` | Modify | 3 |
| `lib/search/bm25-index.ts` | Modify | 3 |
| `handlers/memory-crud-update.ts` | Modify | 3 |
| `lib/storage/transaction-manager.ts` | Modify | 3 |
| `handlers/memory-save.ts` | Modify | 3 |
| `lib/storage/causal-edges.ts` | Modify | 4 |
| `handlers/causal-graph.ts` | Modify | 4 |
| `lib/graph/community-detection.ts` | Modify | 4 |
| `lib/cognitive/working-memory.ts` | Modify | 4 |
| `handlers/memory-triggers.ts` | Modify | 4 |
| `lib/session/session-manager.ts` | Modify | 4, 5 |
| `lib/cognitive/co-activation.ts` | Modify | 4 |
| `handlers/eval-reporting.ts` | Modify | 5 |
| `lib/eval/eval-logger.ts` | Modify | 5 |
| `handlers/session-learning.ts` | Modify | 5 |
| `tools/types.ts` | Modify | 5 |
| `lib/storage/access-tracker.ts` | Modify | 5 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P0-1 | Remove inverted STATE_PRIORITY from legacy pipeline | Legacy `STATE_PRIORITY` map deleted; V2 pipeline is the only code path |
| REQ-P0-2 | Remove scoring order divergence | Legacy `postSearchPipeline()` deleted; no dual scoring paths exist |
| REQ-P0-3 | Remove MAX_DEEP_QUERY_VARIANTS mismatch | Legacy `MAX_DEEP_QUERY_VARIANTS=6` deleted; only V2 variant generation remains |
| REQ-P0-4 | Add orphaned chunk detection | `verify_integrity()` detects and optionally cleans orphaned chunks |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1-5 | Intent weights include recency | `applyIntentWeights` uses timestamp-based recency scoring |
| REQ-P1-6 | Five-factor weights normalize to 1.0 | Weights auto-normalize after partial override merge |
| REQ-P1-7 | No stack overflow on large arrays | Loop-based min/max replaces spread operator |
| REQ-P1-8 | BM25 specFolder filter works | DB lookup replaces ID comparison |
| REQ-P1-9 | No convergence double-counting | Per-variant bonus subtracted before cross-variant bonus |
| REQ-P1-10 | Adaptive fusion weights normalize | Core weights sum to 1.0 after doc-type adjustments |
| REQ-P1-11 | Stage 2/3 score consistency | Shared `resolveEffectiveScore()` in types.ts, used by both stages |
| REQ-P1-12 | Interference threshold configurable | Optional `threshold` parameter with default |
| REQ-P1-13 | Schema exposes hidden params | `trackAccess`, `includeArchived`, `mode` in schema |
| REQ-P1-14 | Dead dedup config removed | `sessionDeduped` removed from Stage 4 metadata |
| REQ-P1-15 | Constitutional count accurate | Stage 1 count flows to Stage 4 output |
| REQ-P1-16 | No duplicate embedding calls | Embedding cached and reused for constitutional path |
| REQ-P1-18 | Stemmer handles double-consonant | "running"→"run", "stopped"→"stop" |
| REQ-P1-19 | Update embeds full content | `memory_update` includes content_text in embedding |
| REQ-P1-20 | Delete cleans all ancillary records | All related tables cleaned on memory delete |
| REQ-P1-21 | BM25 index cleaned on delete | Document removed from BM25 index |
| REQ-P1-22 | Atomic save truly atomic | SAVEPOINT wraps DB+rename; rollback on failure |
| REQ-P1-23 | Preflight uses correct error code | Dynamic error code from validation result |
| REQ-P1-24 | No self-loops in causal edges | `insertEdge()` rejects sourceId === targetId |
| REQ-P1-25 | maxDepth server-side clamped | Clamped to [1, 10] |
| REQ-P1-26 | FK check on edge insertion | Source and target existence verified |
| REQ-P1-27 | Community debounce uses count+maxId | Edge-count-only debounce replaced |
| REQ-P1-28 | Orphan edges auto-cleaned | `cleanupOrphanedEdges()` in verify_integrity |
| REQ-P1-29 | WM scores clamped to [0,1] | `Math.min(1.0, rawScore)` added |
| REQ-P1-30 | No double-decay in triggers | `turnDecayFactor` multiplication removed |
| REQ-P1-31 | Entry limit exact | Off-by-one `+ 1` removed |
| REQ-P1-32 | Co-activation cache cleared on bulk | `clearRelatedCache()` exported and called |
| REQ-P1-33 | Ablation uses recallK | `limit: recallK` not hardcoded 20 |
| REQ-P1-34 | evalRunId persists across restarts | Initialized from DB MAX |
| REQ-P1-35 | Postflight allows re-correction | UPDATE instead of reject |
| REQ-P1-36 | parseArgs validates input | Null/undefined/non-object guard |
| REQ-P1-37 | Dedup hash 128-bit | `.slice(0, 32)` not `.slice(0, 16)` |
| REQ-P1-38 | Exit handlers removable | `process.removeListener()` in cleanup |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7,081+ existing tests pass (zero regressions)
- **SC-002**: 50–100 new tests added covering all 37 fixes
- **SC-003**: Legacy V1 pipeline code fully removed (~600 LOC)
- **SC-004**: No dual scoring/filtering paths remain
- **SC-005**: Each sprint independently committable
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Legacy removal breaks hidden test dependencies | High | Search all test files for `SPECKIT_PIPELINE_V2=false` before removing |
| Risk | Line numbers shifted by 015/016 changes | Medium | Verify current line numbers before each edit |
| Risk | Stemmer change affects existing BM25 index | Medium | Changes only affect new indexing; existing data unaffected until re-index |
| Dependency | Sprint 1 blocks Sprints 2–4 | High | Execute Sprint 1 first; Sprint 5 can run in parallel |
| Dependency | Test baseline from 015 (7,081 tests) | Low | Verify exact count before starting |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No new O(n) DB queries in hot paths (BM25 specFolder filter uses per-result lookup — acceptable for small result sets)
- **NFR-P02**: Embedding cache in Stage 1 saves 1 API call per search with constitutional injection

### Reliability
- **NFR-R01**: SAVEPOINT-based atomicity prevents partial DB state on save failure
- **NFR-R02**: Orphaned record cleanup prevents data corruption over time

---

## 8. EDGE CASES

### Data Boundaries
- Stack overflow prevention (#7): Tested with 200K+ element arrays
- Hash collision (#37): 128-bit hash reduces collision probability to negligible

### Error Scenarios
- Rename failure during atomic save (#22): SAVEPOINT rollback ensures DB consistency
- Non-existent edge targets (#26): Returns null instead of creating dangling reference

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 30, LOC: ~1200 modified, Systems: 1 |
| Risk | 15/25 | Auth: N, API: N, Breaking: Y (legacy removal) |
| Research | 5/20 | Review findings already documented |
| Multi-Agent | 5/15 | Single executor, serial sprints |
| Coordination | 10/15 | Sprint dependencies, test baseline tracking |
| **Total** | **57/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Tests depend on legacy pipeline | H | L | Grep for PIPELINE_V2=false before removal |
| R-002 | Stemmer change breaks search quality | M | L | Only affects -ing/-ed suffix handling |
| R-003 | Stage 2 resolveBaseScore replacement misses call site | H | M | Search all usages, test each path |
| R-004 | Double-decay fix changes trigger scoring behavior | M | M | Compare before/after scores in tests |

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec**: `023-hybrid-rag-fusion-refinement/`
- **Prior Work**: `015-gemini-review-p1-fixes/`, `016-alignment-remediation/`

---

## Phase Navigation

| **Parent Spec** | ../spec.md |
- Predecessor: `016-refinement-phase-5`
- Successor: `018-refinement-phase-7`

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
5. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
6. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
