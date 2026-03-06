# Consolidated tasks: Post-Review Remediation Epic

Consolidated on 2026-03-05 from the following source folders:

- 002-cross-cutting-remediation/tasks.md
- 022-post-review-remediation/tasks.md
- 023-flag-catalog-remediation/tasks.md
- 024-timer-persistence-stage3-fallback/tasks.md
- 025-finalized-scope/tasks.md
- 026-opus-remediation/tasks.md

---

## Source: 002-cross-cutting-remediation/tasks.md

---
title: "Tasks: Comprehensive MCP Server Remediation"
description: "Task Format: T### [P?] Description (file path)"
# SPECKIT_TEMPLATE_SOURCE: tasks-core + phase-child-header | v2.2
trigger_phrases:
  - "phase 006 tasks"
  - "remediation tasks"
  - "wave tracking"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Comprehensive MCP Server Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + phase-child-header | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:wave-1 -->
## Wave 1 - Parallel Execution

- [x] T001 [P] WS1-B Database and schema safety
- [x] T002 [P] WS1-C and 1c scoring and ranking corrections
- [x] T003 [P] WS1-C2 causal-boost and ablation fixes
- [x] T004 [P] WS1-D search pipeline safety
- [x] T005 [P] WS1-E guards and edge cases
- [x] T006 [P] WS2-1 dead hot-path branch cleanup
- [x] T007 [P] WS2-3 dead module-state cleanup
- [x] T008 [P] WS2-4 dead function and export cleanup
- [x] T009 [P] WS3-P1 quick performance wins
- [x] T010 [P] WS3-P2 test-quality corrections
<!-- /ANCHOR:wave-1 -->

---

<!-- ANCHOR:wave-2 -->
## Wave 2 - Dependent Work

- [x] T011 WS1-A entity normalization
- [x] T012 WS2-2 dead flag-function removal
- [x] T013 WS3-P4 SQL-level performance work
- [x] T014 WS3-P3 entity-linker performance work
<!-- /ANCHOR:wave-2 -->

---

<!-- ANCHOR:wave-2-5 -->
## Wave 2.5 - Test Fixups

- [x] T015 Reconsolidation test updates for `importance_weight`
- [x] T016 Scoring test updates for citation fallback removal
- [x] T017 Working-memory/session-cleanup test updates
- [x] T018 Channel quality-floor test updates
- [x] T019 Entity extraction and adapter behavior updates
- [x] T020 Routing/parser cleanup tests
<!-- /ANCHOR:wave-2-5 -->

---

<!-- ANCHOR:wave-3 -->
## Wave 3 - Verification

- [x] T021 TypeScript compile check complete
- [x] T022 Full test suite passes
- [x] T023 Critical fix spot checks complete
- [x] T024 Dead code verification checks complete
- [x] T025 Implementation summary captured
<!-- /ANCHOR:wave-3 -->

---

<!-- ANCHOR:wave-4 -->
## Wave 4 - Phase 2 Remediation (25-Agent Review)

- [x] T026 [P] P0 blockers: withSpecFolderLock race, double normalization, sourceScores, index signature, chunking lock
- [x] T027 [P] P1 scoring: convergence bonus unique count, similarity normalization, preserve cosine similarity
- [x] T028 [P] P1 feature flags: isDegreeBoostEnabled, entity-linker/memory-summaries guards, shadow period
- [x] T029 [P] P1 mutation: cache invalidation, quality loop content, reconsolidation hash, BM25 re-index, attention clamp
- [x] T030 [P] P1 cache/transactions: affectedTools, AI-WHY documentation
- [x] T031 [P] P1 cognitive: causal-edges WHERE clause, co-activation fan-effect, ablation variable names
- [x] T032 [P] P1 eval: Precision@K, F1@K, shadow-scoring @deprecated
- [x] T033 [P] P1 standards: header conversion (109 files), comment prefixes, structural fixes, module.exports removal
- [x] T034 [P] P2 performance: Math.max loop, timeout guard, boost cap, mention cap, O(1) eviction
- [x] T035 [P] P2 safety: dead config removal, cache bounds, readFileSync try-catch, generic error, AI-WHY comments
- [x] T036 Documentation: checklists, impl-summary updates, flag docs, eval README, deprecation notes
<!-- /ANCHOR:wave-4 -->

---

<!-- ANCHOR:wave-5 -->
## Wave 5 - Phase 2 Verification

- [x] T037 TypeScript compile check (0 errors)
- [x] T038 Full test suite passes (226 files, 7,008/7,008 tests)
- [x] T039 Test fixups for changed behavior (7 failures fixed across waves)
<!-- /ANCHOR:wave-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All required validation-blocking documentation issues are resolved
- [x] Recursive spec validation exits with code 0 or 1
- [x] Any remaining warnings are non-blocking and documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->


---

## Source: 022-post-review-remediation/tasks.md

---
title: "Tasks: Post-Review Remediation"
description: "Task breakdown for 2-wave remediation of 21 P0/P1 findings."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "remediation tasks"
  - "T001 T010"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Post-Review Remediation

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Wave 1: P0 + Complex P1 Code Fixes

- [ ] T001 [P] Schema & DB fixes — P0-1, P0-2, P1-10 (`vector-index-impl.ts`, `reconsolidation.vitest.ts`)
- [ ] T002 [P] Pipeline V2 integration — P1-3, P1-4 (`memory-search.ts`, `mmr-reranker.ts`, `co-activation.ts`)
- [ ] T003 [P] Memory save SQL dedup — P1-5 (`memory-save.ts`)
- [ ] T004 [P] Search subsystem fixes — P1-6, P1-8, P1-9 (`query-expander.ts`, `graph-search-fn.ts`, `co-activation.ts`)
- [ ] T005 [P] Eval metrics fix — P1-7 (`eval-metrics.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Wave 2: P1 Standards + Documentation

- [ ] T006 [P] Error handling — P1-11, P1-12 (5 files + `stage3-rerank.ts`)
- [ ] T007 [P] Comment standards — P1-13, P1-16 (`save-quality-gate.ts`)
- [ ] T008 [P] Import & comment cleanup — P1-14, P1-15 (`memory-context.ts`, `hybrid-search.ts`, `memory-save.ts`)
- [ ] T009 [P] Section dividers — P1-17 (`composite-scoring.ts`, `tool-schemas.ts`)
- [ ] T010 [P] Documentation fixes — P1-18, P1-20, P1-21 (`summary_of_*.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 TypeScript compilation passes (`tsc --noEmit`)
- [ ] T012 Full test suite passes (`npm test`)
- [ ] T013 Build check passes (`npm run build`)
- [ ] T014 MCP smoke test passes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks marked `[x]`
- [ ] All P1 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Verification suite passed
- [ ] `implementation-summary.md` filled
- [ ] `checklist.md` verified
<!-- /ANCHOR:completion -->


---

## Source: 023-flag-catalog-remediation/tasks.md

---
title: "Tasks: P1-19 Flag Catalog + Refinement Phase 3"
description: "14 agents across 3 waves — all tasks completed"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "refinement phase 3 tasks"
  - "014 tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: P1-19 Flag Catalog + Refinement Phase 3

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create 023-flag-catalog-remediation spec sub-folder
- [x] T002 Verify all target files exist (found fallback-reranker.ts N/A)
- [x] T003 [P] Gather env var inventory for flag catalog
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave 1 — Code Quality + Performance (5 Opus agents)

- [x] T004 [P] Opus-A: Pipeline Stage 3 — score normalization, reference boolean, chunk ordering (stage3-rerank.ts)
- [x] T005 [P] Opus-B: Search Performance — Set dedup, SQL index (rsf-fusion.ts, learned-feedback.ts)
- [x] T006 [P] Opus-C: Graph & Causal — traversal indexes, threshold constant (causal-edges.ts, community-detection.ts)
- [x] T007 [P] Opus-D: Validation & Extraction — type safety, constants, entity regex, code block comment (save-quality-gate.ts, encoding-intent.ts, entity-extractor.ts, chunk-thinning.ts)
- [x] T008 [P] Opus-E: Hybrid Search + Eval — MPAB logging, CI percentile fix, underscore rename (hybrid-search.ts, bm25-baseline.ts, ground-truth-feedback.ts)

### Wave 2 — Documentation + Observability (5 agents)

- [x] T009 [P] Sonnet-A: Feature Flag Catalog P1-19 — 89 env vars documented (summary_of_existing_features.md)
- [x] T010 [P] Sonnet-B: Inline Docs — stale comments, AI-WHY, JSDoc, score immutability (5 files)
- [x] T011 [P] Sonnet-C: JSDoc Quality Helpers — @param/@returns on 5 functions (memory-save.ts)
- [x] T012 [P] Opus-F: Observability & Reporting — regex hardening, LIMIT clauses, latency constants (3 files)
- [x] T013 [P] Opus-G: Remaining Fixes — @deprecated exports, test timeout, N/A investigation (composite-scoring.ts, vitest.config.ts)

### Wave 3 — Testing + Architecture Docs (4 agents)

- [x] T014 [P] Opus-H: Denylist + RSF Tests — 53 new tests (2 new test files)
- [x] T015 [P] Opus-I: Quality Gate + Regression Tests — 15 regression tests (1 new test file)
- [x] T016 [P] Opus-J: Error Telemetry + CI — requestId propagation, 5 flag ceiling tests (4 handlers + 1 test file)
- [x] T017 [P] Sonnet-D: Pipeline I/O Docs — stage contracts, filter ordering (5 pipeline files)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 TypeScript compilation (`tsc --noEmit` → exit 0)
- [x] T019 Full test suite (`vitest run` → 7081/7081 passed)
- [x] T020 Fix entity-extractor regex regression (explicit case alternation)
- [x] T021 Populate implementation-summary.md
- [x] T022 Verify checklist.md with evidence
- [x] T023 Save context via generate-context.js
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — 7081 tests, tsc clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: 022-post-review-remediation
<!-- /ANCHOR:cross-refs -->


---

## Source: 024-timer-persistence-stage3-fallback/tasks.md

---
title: "Tasks: Refinement Phase 4"
description: "Task list for Phase 4 persistence and fallback remediation."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
importance_tier: "normal"
contextType: "implementation"
---

# Tasks: Refinement Phase 4

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:summary -->

## Status: Superseded by 025/026

> **Phase 024 was not independently executed.** All planned work was absorbed by subsequent phases:
> - Timer persistence (T1–T4) → Completed in **025-finalized-scope** (T018–T019, CHK-017)
> - effectiveScore fallback (T5–T8) → Completed in **026-opus-remediation** (T024, CHK-026–027)
> - Verification (T9–T10) → Verified in **026-opus-remediation** (T017/T027, 7,085 tests passing)

## P1 #1: Warn-Only Timer Persistence

- [~] T1: SUPERSEDED — Completed in 025 (T018, CHK-017)
- [~] T2: SUPERSEDED — Completed in 025 (T018)
- [~] T3: SUPERSEDED — Completed in 025 (T018)
- [~] T4: SUPERSEDED — Completed in 025 (T019, CHK-017)

## P1 #2: effectiveScore() Fallback Chain

- [~] T5: SUPERSEDED — Completed in 026 (T024, CHK-026)
- [~] T6: SUPERSEDED — Completed in 026 (T024, CHK-027)
- [~] T7: SUPERSEDED — Completed in 026 (T024)
- [~] T8: SUPERSEDED — Completed in 026 (T026)

## Verification

- [~] T9: SUPERSEDED — Verified in 026 (T027, 7,085 tests passing)
- [~] T10: SUPERSEDED — Verified in 026 (T017, tsc clean)
<!-- /ANCHOR:summary -->


---

## Source: 025-finalized-scope/tasks.md

---
title: "Tasks: Refinement Phase 5 Finalized Scope [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path) + verification command when applicable; includes tranche-4 continuation coverage."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "refinement phase 5 tasks"
  - "tranche 1 tasks"
  - "tranche 2 tasks"
  - "tranche 3 tasks"
  - "tranche 4 tasks"
  - "isInShadowPeriod correction"
  - "save-quality-gate robustness"
  - "canonical id dedup"
  - "force all channels"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Refinement Phase 5 Finalized Scope

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Child Doc Alignment (Completed)

- [x] T001 Lock tranche-1 scope to the three implementation fixes (`spec.md`)
- [x] T002 Define phase plan and test commands tied to exact target files (`plan.md`)
- [x] T003 [P] Update checklist P0/P1 mappings for each fix with evidence placeholders (`checklist.md`)
- [x] T004 Initialize implementation-summary tracking and reference tranche continuity targets (`implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation Tranche (Completed)

- [x] T005 Correct RSF/shadow/fallback/floor/reconsolidation wording (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md`)
- [x] T006 Correct contradiction around `isInShadowPeriod` (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md`)
- [x] T007 Harden config-table ensure behavior across DB reinit/handle changes (`.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts`)
- [x] T008 [P] Add focused handle-change coverage test `WO6` (`.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification and Evidence (Completed)

- [x] T009 Run targeted quality-gate tests (`npm run test --workspace=mcp_server -- tests/save-quality-gate.vitest.ts tests/mpab-quality-gate-integration.vitest.ts`) [Result: PASS, 2 files passed, 102 tests passed]
- [x] T010 Run child-folder validation (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope"`) [Result: PASS, Errors 0, Warnings 0]
- [x] T011 Run contradiction/wording verification search (`rg -n "RSF|shadow|fallback|floor|reconsolidation" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md && rg -n "isInShadowPeriod" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md`) [Result: PASS, targeted contradiction/stale wording removed]
- [x] T012 Finalize evidence links and status (`checklist.md`, `implementation-summary.md`) [Result: Completed in child status docs]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Tranche-2 Canonical Dedup Continuation (Completed)

- [x] T013 Apply canonical ID dedup in `combinedLexicalSearch()` for mixed ID representations (`.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`)
- [x] T014 Apply canonical ID dedup in legacy `hybridSearch()` dedup map for mixed ID representations (`.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`)
- [x] T015 [P] Add regression test `T031-LEX-05` for canonical dedup in `combined_lexical_search()` (`.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts`)
- [x] T016 [P] Add regression test `T031-BASIC-04` for canonical dedup across channels in legacy `hybridSearch()` (`.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts`)
- [x] T017 Run expanded targeted suite including hybrid-search + quality-gate coverage (`npm run test --workspace=mcp_server -- tests/hybrid-search.vitest.ts tests/save-quality-gate.vitest.ts tests/mpab-quality-gate-integration.vitest.ts`) [Result: PASS, 3 files passed, 174 tests passed]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Tranche-3 Continuation (Completed)

- [x] T018 Preserve persisted activation timestamp across restart so warn-only window is not reset (`.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts`)
- [x] T019 [P] Add regression test `WO7: runQualityGate does not reset persisted activation window on restart` (`.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts`)
- [x] T020 Add and plumb `forceAllChannels` so tier-2 fallback can bypass simple-routing channel reduction (`.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`)
- [x] T021 [P] Add regression test `C138-P0-FB-T2: tier-2 fallback forces all channels for simple-routed queries` (`.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts`)
- [x] T022 Align parent feature summaries for R11 default/gating truth, G-NEW-2 instrumentation inert status, TM-05 hook-scope correction, and dead-code list correction (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md`)
- [x] T023 Re-run expanded targeted suite including hybrid-search + quality-gate coverage (`npm run test --workspace=mcp_server -- tests/hybrid-search.vitest.ts tests/save-quality-gate.vitest.ts tests/mpab-quality-gate-integration.vitest.ts`) [Result: PASS, 3 files passed, 176 tests passed]
- [x] T024 Re-run child-folder validation (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope"`) [Result: PASS, Errors 0, Warnings 0]
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Tranche-4 P2 Documentation Polish (Completed)

- [x] T025 Apply parent-summary P2 polish updates A/C/D/F (MPAB naming, PI-B3 folder-discovery ID, global density-guard wording, entity-linking dependency wording) in existing-features summary (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md`)
- [x] T026 Apply parent-summary P2 polish updates A/B/E/F (global density-guard checks, SQL wording accuracy, active-flag inventory count to 20, entity-linking dependency wording) in new-features summary (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md`)
- [x] T027 [P] Update child checklist with tranche-4 completed P2 entries and evidence references to both parent summary files (`checklist.md`)
- [x] T028 [P] Update implementation summary with tranche-4 outcomes and evidence references to both parent summary files (`implementation-summary.md`)
- [x] T029 Re-run child-folder validation after tranche-4 doc-polish updates (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope"`) [Result: PASS, Errors 0, Warnings 0]
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0-mapped tasks across tranche-1 through tranche-4 (T005-T029) are complete with evidence.
- [x] No `[B]` blockers remain for save-quality-gate robustness verification.
- [x] Canonical ID dedup behavior is covered in both `combined_lexical_search()` and legacy `hybridSearch()` regression tests.
- [x] Tier-2 fallback channel forcing behavior is covered in regression tests and routed through `forceAllChannels`.
- [x] Checklist P0/P1 items include command output or file diff evidence.
- [x] Tranche-4 P2 parent-summary documentation polish items (A-F) are completed with evidence links in child tracking docs.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent**: `../000-feature-overview/spec.md`
- **Predecessor**: `../024-timer-persistence-stage3-fallback/spec.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- End of filled Level 2 task list for child 016 (tranche-1 through tranche-4 aligned). -->


---

## Source: 026-opus-remediation/tasks.md

---
title: "Tasks: Refinement Phase 6 — Opus Review Remediation"
description: "35 completed tasks across 5 sprints for P0+P1 remediation fixes."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "refinement phase 6 tasks"
  - "opus remediation tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Refinement Phase 6 — Opus Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[~]` | Deferred |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Sprint 1: Legacy Pipeline Removal + P0 Critical Fixes

- [x] T001 [P0] Remove legacy `STATE_PRIORITY` map (`handlers/memory-search.ts`)
- [x] T002 [P0] Remove `MAX_DEEP_QUERY_VARIANTS=6` constant (`handlers/memory-search.ts`)
- [x] T003 [P0] Delete `buildDeepQueryVariants()` function (`handlers/memory-search.ts`)
- [x] T004 [P0] Delete `strengthenOnAccess()` function (`handlers/memory-search.ts`)
- [x] T005 [P0] Delete `applyTestingEffect()` function (`handlers/memory-search.ts`)
- [x] T006 [P0] Delete `filterByMemoryState()` function (`handlers/memory-search.ts`)
- [x] T007 [P0] Keep `applySessionDedup()` — still used by post-cache dedup
- [x] T008 [P0] Delete `applyCrossEncoderReranking()` function (`handlers/memory-search.ts`)
- [x] T009 [P0] Delete `applyIntentWeightsToResults()` function (`handlers/memory-search.ts`)
- [x] T010 [P0] Delete `shouldApplyPostSearchIntentWeighting()` function (`handlers/memory-search.ts`)
- [x] T011 [P0] Delete `postSearchPipeline()` function (`handlers/memory-search.ts`)
- [x] T012 [P0] Remove `if (isPipelineV2Enabled())` branch — V2 only path (`handlers/memory-search.ts`)
- [x] T013 Deprecate `isPipelineV2Enabled()` as always-true (`lib/search/search-flags.ts`)
- [x] T014 [P0] Add orphaned chunk detection to `verify_integrity()` (`lib/search/vector-index-impl.ts`)
- [x] T015 Update tests for deprecated `isPipelineV2Enabled()` behavior
- [x] T016 Verify and update tests depending on `SPECKIT_PIPELINE_V2=false`
- [x] T017 Full test suite passes — 7,085 passing
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Sprint 2: Scoring & Fusion Fixes

- [x] T018 #5 Add recency scoring to `applyIntentWeights` (`lib/search/intent-classifier.ts`)
- [x] T019 #6 Normalize five-factor weights to sum 1.0 (`lib/scoring/composite-scoring.ts`)
- [x] T020 #7 Replace spread-based min/max with loop (`lib/scoring/composite-scoring.ts`)
- [x] T021 #8 Fix BM25 specFolder filter with DB lookup (`lib/search/hybrid-search.ts`)
- [x] T022 #9 Fix convergence double-counting in RRF fusion (`lib/search/rrf-fusion.ts`)
- [x] T023 #10 Normalize adaptive fusion core weights (`lib/search/adaptive-fusion.ts`)
- [x] T024 #11 Create shared `resolveEffectiveScore()` in `types.ts`; replace Stage 2 + Stage 3
- [x] T025 #12 Add optional `threshold` param to interference batch (`lib/scoring/interference-scoring.ts`)
- [x] T026 Update intent-weighting test for recency inclusion
- [x] T027 Full test suite passes — 7,085 passing
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Sprint 3: Pipeline, Retrieval, and Mutation Fixes

- [x] T028 #13 Add hidden params to schema (`tool-schemas.ts`)
- [x] T029 #14 Remove dead `sessionDeduped` from Stage 4 (`pipeline/stage4-filter.ts`)
- [x] T030 #15 Pass constitutional count from Stage 1 to Stage 4 (`pipeline/stage4-filter.ts`, `orchestrator.ts`, `types.ts`)
- [x] T031 #16 Cache embedding for constitutional reuse (`pipeline/stage1-candidate-gen.ts`)
- [x] T032 #18 Fix `simpleStem` double-consonant handling (`lib/search/bm25-index.ts`)
- [x] T033 #19 Embed full content on update (`handlers/memory-crud-update.ts`)
- [x] T034 #20 Clean all ancillary records on delete (`lib/search/vector-index-impl.ts`)
- [x] T035 #21 Clean BM25 index on delete (`lib/search/vector-index-impl.ts`)
- [x] T036 #22 Add rename-failure state tracking to atomicSaveMemory (`lib/storage/transaction-manager.ts`)
- [x] T037 #23 Use dynamic error code in preflight (`handlers/memory-save.ts`)
- [x] T038 Update stemmer and pipeline tests for new behavior
- [x] T039 Full test suite passes — 7,085 passing
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Sprint 4: Graph/Causal + Cognitive Memory Fixes

- [x] T040 #24 Prevent self-loops in `insertEdge()` (`lib/storage/causal-edges.ts`)
- [x] T041 #25 Clamp maxDepth to [1,10] (`handlers/causal-graph.ts`)
- [~] T042 #26 FK/existence check on edges — DEFERRED (test fixtures use synthetic IDs)
- [x] T043 #27 Replace edge-count debounce with count:maxId (`lib/graph/community-detection.ts`)
- [x] T044 #28 Add `cleanupOrphanedEdges()` (`lib/storage/causal-edges.ts`)
- [x] T045 #29 Clamp WM scores to [0,1] (`lib/cognitive/working-memory.ts`)
- [x] T046 #30 Remove double-decay in triggers (`handlers/memory-triggers.ts`)
- [~] T047 #31 Off-by-one in `enforceEntryLimit` — DEFERRED (code already correct)
- [x] T048 #32 Clear co-activation cache after bulk ops (`handlers/memory-bulk-delete.ts`)
- [x] T049 Full test suite passes — 7,085 passing
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Sprint 5: Evaluation Framework + Housekeeping

- [x] T050 #33 Use `recallK` for ablation limit (`handlers/eval-reporting.ts`)
- [x] T051 #34 Initialize `_evalRunCounter` from DB (`lib/eval/eval-logger.ts`)
- [x] T052 #35 Allow postflight UPDATE (`handlers/session-learning.ts`)
- [x] T053 #36 Add input guard to `parseArgs<T>()` (`tools/types.ts`)
- [x] T054 #37 Extend dedup hash to 128-bit (`lib/session/session-manager.ts`)
- [x] T055 #38 Add `cleanupExitHandlers()` with handler removal (`lib/storage/access-tracker.ts`)
- [x] T056 Update session-manager tests for 32-char hash length
- [x] T057 Full test suite passes — 7,085 passing
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` or `[~]` (deferred with reason)
- [x] No blocked tasks remaining
- [x] Full test suite passes: 7,085/7,085
- [x] `implementation-summary.md` written
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->


---

