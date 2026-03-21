---
title: "Implementation Summary: Research-Based Refinement — Wave 1 Phase A"
description: "Wave 1 Phase A implementation across all 5 dimensions (D1-D5): fusion calibration, query intelligence, graph traversal, feedback ledger, and retrieval UX."
# SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2
trigger_phrases:
  - "wave 1 implementation"
  - "phase A implementation"
  - "10 agent dispatch"
  - "D1 D2 D3 D4 D5 phase A"
importance_tier: "important"
contextType: "implementation"
---

# Implementation Summary

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `011-research-based-refinement` |
| **Level** | 2 |
| **Scope** | Wave 1 Phase A (all 5 dimensions) + D2 Phase A (accelerated) |
| **Status** | Complete — Wave 1 foundations delivered |
| **Date** | 2026-03-21 |
| **Commit** | `347d17c3c` |
| **LOC Added** | ~3,600+ (implementation) + ~2,600+ (tests) |
| **Files Changed** | 15 modified + 7 created (impl) + 23 test files |
| **Feature Flags** | 10 of 28 created |
| **Tests** | ~330+ new tests, 0 regressions |
| **Agent Dispatch** | 5 Sonnet (native worktree) + 5 GPT-5.4 (copilot worktree) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

### D4: Feedback & Quality Learning (P0 — Foundational)

**New:** `mcp_server/lib/feedback/feedback-ledger.ts` (349 lines)
- Implicit feedback event ledger with SQLite `feedback_events` table
- 5 event types: `search_shown`, `result_cited`, `query_reformulated`, `same_topic_requery`, `follow_on_tool_use`
- Confidence tiers: citation/follow_on = strong, reformulation = medium, shown/requery = weak
- API: `initFeedbackLedger`, `logFeedbackEvent`, `logFeedbackEvents` (batch), `getFeedbackEvents`, `getFeedbackEventCount`, `getMemoryFeedbackSummary`
- Wired into `memory-search.ts` at pipeline exit (shadow-only, fail-safe)

**Modified:** `mcp_server/lib/cognitive/fsrs-scheduler.ts` (+85 lines)
- FSRS hybrid decay: no-decay for `decision`, `constitutional`, `critical` context types
- `classifyHybridDecay()` + `applyHybridDecayPolicy()` functions
- Separate from existing TM-03 classification decay (different flag, different axis)

**Modified:** `mcp_server/lib/validation/save-quality-gate.ts` (+103 lines)
- Short-critical quality gate exception: bypass 50-char minimum for decisions with ≥2 structural signals
- `countStructuralSignals()`, `isShortCriticalException()` functions
- Warn-only mode via `console.warn` on each bypass

**Feature Flags:** `SPECKIT_IMPLICIT_FEEDBACK_LOG`, `SPECKIT_HYBRID_DECAY_POLICY`, `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS` (all default OFF)

### D1: Fusion & Scoring Intelligence

**Modified:** `shared/algorithms/rrf-fusion.ts` (+102 lines)
- Calibrated overlap bonus: replaces flat +0.10 with `beta * overlapRatio * meanTopNormScore`, clamped to [0, 0.06]
- `CALIBRATED_OVERLAP_BETA = 0.15`, `CALIBRATED_OVERLAP_MAX = 0.06`
- Tracks per-source raw scores for `meanTopNormScore` computation
- Full backward compatibility when flag OFF

**New/Extended:** `mcp_server/lib/eval/k-value-analysis.ts` (+307 lines)
- K-optimization with judged relevance: NDCG@10 and MRR@5 computation
- Per-intent K sweep over {10, 20, 40, 60, 80, 100, 120}
- `argmaxNdcg10()` with tie-break to lower K
- `IntentClass` type, `JudgedQuery` type, full eval framework

**Feature Flags:** `SPECKIT_CALIBRATED_OVERLAP_BONUS`, `SPECKIT_RRF_K_EXPERIMENTAL` (all default OFF)

### D3: Graph-Augmented Retrieval

**Modified:** `mcp_server/lib/search/causal-boost.ts` (+285 lines)
- Sparse-first policy: density threshold (0.5), 1-hop typed expansion when sparse
- Intent-aware edge traversal: `INTENT_EDGE_PRIORITY` mapping, `EDGE_LABEL_ALIASES`, `EDGE_PRIOR_TIERS`
- Composite scoring: `seedScore * edgePrior * hopDecay * freshness`
- `resolveEdgePrior()`, `computeHopDecay()`, `computeIntentTraversalScore()` functions
- Extended `applyCausalBoost()` with `CausalBoostOptions { graphDensity?, intent?, freshness? }`

**Feature Flag:** `SPECKIT_TYPED_TRAVERSAL` (extends existing `SPECKIT_CAUSAL_BOOST`, default OFF)

### D5: Retrieval UX & Result Presentation

**New:** `mcp_server/lib/search/recovery-payload.ts` (222 lines)
- Empty/weak result recovery: classifies outcome as `no_results`, `low_confidence`, `partial`
- Infers root cause, generates up to 3 reformulated query suggestions
- Recommends next action (`retry_broader`, `switch_mode`, `save_memory`, `ask_user`)

**New:** `mcp_server/lib/search/confidence-scoring.ts` (298 lines)
- Per-result calibrated confidence: margin (35%), channel agreement (30%), reranker support (20%), anchor density (15%)
- Coarse labels: high ≥ 0.7, medium 0.4–0.7, low < 0.4
- `drivers` list and `requestQuality` assessment (good/weak/gap)

**Modified:** `mcp_server/formatters/search-results.ts` (+81 lines)
- Extended `formatSearchResults()` with recovery and confidence integration

**Modified:** `mcp_server/handlers/memory-search.ts` (+41 lines)
- Passes query and specFolder context to formatters

**Feature Flags:** `SPECKIT_EMPTY_RESULT_RECOVERY_V1`, `SPECKIT_RESULT_CONFIDENCE_V1` (all default OFF)

### D2: Query Intelligence & Reformulation

**New:** `mcp_server/lib/search/query-decomposer.ts` (297 lines)
- Multi-facet detection: conjunction detection, multiple wh-words, sentence boundary splitting
- Decomposition: splits into up to 3 facets with deduplication
- `mergeByFacetCoverage()`: prioritises items appearing in multiple facets

**Modified:** `mcp_server/lib/search/entity-linker.ts` (+288 lines)
- Graph concept routing: `nounPhrases()`, `matchAliases()`, `loadConceptAliasTable()`, `routeQueryConcepts()`
- Built-in `BUILTIN_CONCEPT_ALIASES` table covering memory/search/graph/pipeline/session domains
- Fail-open design for database unavailability

**Modified:** `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` (+105 lines)
- Wired concept routing before channel selection
- Wired decomposition in deep-mode path with 5000ms timeout
- Trace logging for matched concepts

**Modified:** `mcp_server/lib/search/search-flags.ts` (+60 lines)
- Registered all new feature flags for centralized discoverability

**Feature Flags:** `SPECKIT_QUERY_DECOMPOSITION`, `SPECKIT_GRAPH_CONCEPT_ROUTING` (all default OFF)
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Parallel Agent Dispatch (10 Agents)

| Agent | Type | Model | Dimension | Focus | Duration | Tests |
|-------|------|-------|-----------|-------|----------|-------|
| Sonnet-D4 | Native worktree | Claude Sonnet 4.6 | D4 Feedback (P0) | Implementation + tests | ~14.5m | 101 |
| Sonnet-D1 | Native worktree | Claude Sonnet 4.6 | D1 Fusion | Implementation + tests | ~7.2m | 58 |
| Sonnet-D3 | Native worktree | Claude Sonnet 4.6 | D3 Graph | Implementation + tests | ~6.1m | 32 |
| Sonnet-D5 | Native worktree | Claude Sonnet 4.6 | D5 UX | Implementation + tests | ~6.4m | 74 |
| Sonnet-D2 | Native worktree | Claude Sonnet 4.6 | D2 Query | Implementation + tests | ~12.4m | 65 |
| GPT5.4-D4 | Copilot worktree | GPT-5.4 high | D4 Feedback | Tests + seams | ~10m | 16 |
| GPT5.4-D1 | Copilot worktree | GPT-5.4 high | D1 Fusion | Tests + seams | ~8.2m | 99 |
| GPT5.4-D3 | Copilot worktree | GPT-5.4 high | D3 Graph | Tests + seams | ~8.1m | ✓ |
| GPT5.4-D5 | Copilot worktree | GPT-5.4 high | D5 UX | Tests | ~11m | ✓ |
| GPT5.4-D2 | Copilot worktree | GPT-5.4 high | D2 Query | Tests + seams | ~8m | ✓ |

**Strategy:** Sonnet agents handled core implementation; GPT-5.4 agents wrote additional test suites from a different perspective. Each dimension isolated in its own git worktree to prevent conflicts.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

1. **All features default OFF** — Every new capability is behind a feature flag that defaults to OFF, ensuring zero behavior change without explicit opt-in.

2. **D2 Phase A accelerated into Wave 1** — Though originally Wave 2 in the plan, D2's Phase A (decomposition + concept routing) has no Wave 1 dependencies and was implemented in parallel. [DEVIATION: Implemented ahead of schedule for efficiency]

3. **Shadow-only for feedback** — The event ledger logs events but has no ranking side effects, matching the "log before changing" architectural principle.

4. **Heuristic-only for confidence** — V1 confidence scoring uses heuristic factors (margin, agreement, reranker, anchors) with no model calls in the hot path, preserving latency.

5. **Separate FSRS hybrid from existing TM-03** — The new hybrid decay policy uses a separate feature flag and axis from the existing classification decay, avoiding coupling.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

### Test Coverage

| Dimension | Sonnet Tests | GPT-5.4 Tests | Total | Status |
|-----------|-------------|---------------|-------|--------|
| D4 Feedback | 101 | 16 | 117 | All pass |
| D1 Fusion | 58 | 99 | 157 | All pass |
| D3 Graph | 32 | ✓ | 32+ | All pass |
| D5 UX | 74 | ✓ | 74+ | All pass |
| D2 Query | 65 | ✓ | 65+ | All pass |
| **Total** | **330** | **115+** | **445+** | **0 regressions** |

### Checklist Status (Pre-Implementation Items)

- [x] All 5 child folders have spec.md, plan.md, tasks.md, checklist.md
- [x] All 29 recommendations assigned to exactly one child
- [x] Cross-phase dependencies documented in parent plan.md
- [x] Phase Documentation Map matches actual child folders
- [ ] Eval baseline recorded before Wave 1 (deferred — T001 in Phase 0)

### Feature Flag Summary

| Flag | Dimension | Default | Status |
|------|-----------|---------|--------|
| `SPECKIT_IMPLICIT_FEEDBACK_LOG` | D4 | OFF | Created |
| `SPECKIT_HYBRID_DECAY_POLICY` | D4 | OFF | Created |
| `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS` | D4 | OFF | Created |
| `SPECKIT_CALIBRATED_OVERLAP_BONUS` | D1 | OFF | Created |
| `SPECKIT_RRF_K_EXPERIMENTAL` | D1 | OFF | Created |
| `SPECKIT_TYPED_TRAVERSAL` | D3 | OFF | Created |
| `SPECKIT_EMPTY_RESULT_RECOVERY_V1` | D5 | OFF | Created |
| `SPECKIT_RESULT_CONFIDENCE_V1` | D5 | OFF | Created |
| `SPECKIT_QUERY_DECOMPOSITION` | D2 | OFF | Created |
| `SPECKIT_GRAPH_CONCEPT_ROUTING` | D2 | OFF | Created |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Wave 1 only** — This implementation covers Phase A across all dimensions. Phases B/C/D require Wave 2-4 execution with their cross-dependencies.
2. **Eval baseline not yet recorded** — T001 (Phase 0) was not executed; baseline metrics needed before activating any feature flags for comparison.
3. **GPT-5.4 test files may need alignment** — Some GPT-5.4 test files write against spec expectations rather than the exact implementation, since they were generated in separate worktrees without seeing the Sonnet implementation.
4. **18 remaining feature flags** — 10 of 28 planned flags were created; the remaining 18 cover Waves 2-4 features.
5. **No live ranking changes** — All features are shadow-only or gated OFF; no production behavior is affected.

### Remaining Waves

| Wave | Dimensions | Items | Status |
|------|-----------|-------|--------|
| Wave 2 | D2.A✓, D3.B, D4.B | 7 items | D2.A complete, D3.B/D4.B pending |
| Wave 3 | D1.B+C, D5.B, D2.B | 9 items | Pending |
| Wave 4 | D1.D, D4.C, D3.C, D2.C, D5.C | 10 items | Pending |
<!-- /ANCHOR:limitations -->
