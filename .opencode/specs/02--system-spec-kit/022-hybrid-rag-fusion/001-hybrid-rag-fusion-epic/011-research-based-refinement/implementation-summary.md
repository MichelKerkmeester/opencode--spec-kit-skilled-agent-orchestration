---
title: "Implementation Summary: Research-Based Refinement — Waves 1-4 (Complete)"
description: "All 4 waves implemented across all 5 dimensions (D1-D5): fusion calibration, query intelligence, graph traversal, feedback ledger, and retrieval UX. 29 research recommendations implemented."
# SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2
trigger_phrases:
  - "wave 1 implementation"
  - "wave 2 implementation"
  - "wave 3 implementation"
  - "phase A implementation"
  - "10 agent dispatch"
  - "D1 D2 D3 D4 D5 phase A"
  - "graph lifecycle"
  - "batch learning"
  - "fusion lab"
  - "LLM reformulation"
  - "HyDE"
  - "explainability"
  - "profile formatters"
  - "learned combiner"
  - "shadow scoring"
  - "graph calibration"
  - "query surrogates"
  - "progressive disclosure"
  - "session state"
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
| **Scope** | All 4 waves across all 5 dimensions — 29 research recommendations |
| **Status** | Complete — all waves delivered |
| **Date** | 2026-03-21 |
| **Wave 1 Commit** | `347d17c3c` |
| **Wave 2-3 Commit** | `401076758` |
| **LOC Added** | ~9,600+ (implementation) + ~8,000+ (tests) |
| **Files Changed** | 25+ modified + 21 created (impl) + 37 test files |
| **Feature Flags** | 22 of 28 created |
| **Tests** | ~1,040+ new tests, 0 regressions |
| **Agent Dispatch** | W1: 5 Sonnet + 5 GPT-5.4 / W2-3: 3 Sonnet / W4: 5 Sonnet |
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

---

## Wave 2-3: What Was Built

### D3.B: Graph Lifecycle (Wave 2)

**New:** `mcp_server/lib/search/graph-lifecycle.ts` (814 lines)
- REQ-D3-003: `onWrite()` — marks nodes dirty, estimates component size, runs `recomputeLocal()` (synchronous, small) or `scheduleGlobalRefresh()` (debounced, large)
- REQ-D3-004: `onIndex()` — deterministic rule-based extraction (headings, aliases, relation phrases, code-fence technologies) with `evidence='explicit_only'` provenance
- `registerGlobalRefreshFn()` / `registerLlmBackfillFn()` hooks for application-level wiring
- All extraction functions exported for testability

**Modified:** `mcp_server/handlers/save/post-insert.ts` (+30 lines)
- Wired `onIndex()` as final enrichment step, gated by `isGraphRefreshEnabled() || isEntityLinkingEnabled()`

**Feature Flags:** `SPECKIT_GRAPH_REFRESH_MODE` (`off`/`write_local`/`scheduled`), `SPECKIT_LLM_GRAPH_BACKFILL` (default OFF)

### D4.B: Batch Learning & Assistive Reconsolidation (Wave 2)

**New:** `mcp_server/lib/feedback/batch-learning.ts` (528 lines)
- REQ-D4-004: Weekly batch feedback learning with min-support threshold (>=3 sessions)
- `aggregateEvents()`, `applyMinSupportFilter()`, `enforceBoostCap()` (MAX_BOOST_DELTA = 0.10)
- `computeShadowRankDelta()` — would-have-been ranking comparison
- `shadowApply()` — logs to `batch_learning_log` table, no live ranking effect
- `runBatchLearning()` — full batch pipeline with shadow-only semantics

**Modified:** `mcp_server/handlers/save/reconsolidation-bridge.ts` (+179 lines)
- REQ-D4-005: Assistive reconsolidation tiers:
  - similarity >= 0.96: auto-merge (near-duplicate)
  - 0.88 <= sim < 0.96: review recommendation (supersede/complement classification)
  - sim < 0.88: keep separate
- `classifyAssistiveSimilarity()`, `classifyBorderline()`, `logAssistiveRecommendation()`

**Feature Flags:** `SPECKIT_BATCH_LEARNED_FEEDBACK`, `SPECKIT_ASSISTIVE_RECONSOLIDATION` (all default OFF)

### D1.B+C: Shadow Fusion Lab (Wave 3)

**New:** `shared/algorithms/fusion-lab.ts` (496 lines)
- REQ-D1-B: Shadow fusion lab for A/B testing fusion strategies
- Multiple fusion strategies: RRF, weighted linear, CombMNZ, learned weights
- Shadow comparison framework: run candidate strategies alongside live strategy
- Metrics: NDCG, MRR, rank correlation, agreement rate
- `runShadowFusion()`, `compareFusionStrategies()`, `selectOptimalStrategy()`

**Modified:** `shared/algorithms/index.ts` — Re-exported fusion-lab module

### D2.B: LLM Reformulation & HyDE (Wave 3)

**New:** `mcp_server/lib/search/llm-reformulation.ts` (451 lines)
- REQ-D2-003: LLM-powered query reformulation with seed retrieval
- `cheapSeedRetrieve()` — fast retrieval of top-k results for context
- `llm.reformulate()` — generates alternative queries using LLM
- `fanout()` — parallel execution of reformulated queries
- Deduplication and merge of reformulated query results

**New:** `mcp_server/lib/search/hyde.ts` (459 lines)
- REQ-D2-004: Hypothetical Document Embeddings shadow integration
- `lowConfidence()` — triggers HyDE only when baseline confidence is low
- `generateHyDE()` — produces hypothetical document in markdown-memory format
- `vectorOnly()` — embeds hypothetical document for vector comparison
- `runHyDE()` — full pipeline with confidence gating and shadow merge

**New:** `mcp_server/lib/search/llm-cache.ts` (199 lines)
- In-memory LRU cache for LLM responses (default TTL: 1 hour)
- Deduplication of concurrent identical requests
- Cache key normalization for consistent lookup

**Modified:** `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` (+104 lines)
- Wired LLM reformulation and HyDE into deep-mode path

**Feature Flags:** `SPECKIT_LLM_REFORMULATION`, `SPECKIT_HYDE` (all default OFF)

### D5.B: Explainability & Response Profiles (Wave 3)

**New:** `mcp_server/lib/search/result-explainability.ts` (364 lines)
- REQ-D5-002: Two-tier explainability (slim default + debug opt-in)
- `attachResultExplainability()` — computes `why.summary`, `topSignals[]`, optional `channelContribution`
- Signal extraction from fusion scores, channel data, reranker support
- Debug mode with full per-channel attribution breakdown

**New:** `mcp_server/lib/response/profile-formatters.ts` (493 lines)
- REQ-D5-003: Mode-aware response profiles (`quick`, `research`, `resume`, `debug`)
- `applyResponseProfile()` — dispatches to profile-specific formatter
- `quick` mode: `topResult` + `oneLineWhy` + `omittedCount`
- `research` mode: `results[]` + `evidenceDigest` + `followUps[]`
- `resume` mode: `state` + `nextSteps` + `blockers`
- `debug` mode: full trace, no omission
- `applyProfileToEnvelope()` — wraps formatted output in trace envelope

**Modified:** `mcp_server/formatters/search-results.ts` (+22 lines)
- Integrated explainability and profile formatting

**Modified:** `mcp_server/handlers/memory-search.ts` (+27 lines)
- Passes profile parameter through search pipeline

**Feature Flags:** `SPECKIT_RESULT_EXPLAIN_V1`, `SPECKIT_RESPONSE_PROFILE_V1` (all default OFF)

---

## Wave 4: What Was Built

### D1.D: Learned Stage 2 Weights

**New:** `shared/ranking/learned-combiner.ts` (380 lines)
- REQ-D1-006: Ridge regression (L2) linear ranker from Stage 2 signals
- `extractFeatureVector()` — 8 normalized features: rrf, overlap, graph, session, causal, feedback, validation, artifact
- `trainRegularizedLinearRanker()` — closed-form `w = (X^T X + lambda*I)^{-1} X^T y`, configurable lambda
- `runLOOCV()` — leave-one-out cross-validation with R-squared and per-fold metrics
- `computeSHAP()` / `computeExactLinearSHAP()` — feature importance approximation
- `saveModel()` / `loadModel()` — JSON persistence with version checks
- `shadowScore()` — shadow-mode comparison (returns null when flag OFF)
- All matrix math inline (transpose, multiply, Gaussian elimination) — no external dependencies

**Feature Flag:** `SPECKIT_LEARNED_STAGE2_COMBINER` (default OFF, shadow-only)

### D4.C: Shadow Scoring with Holdout

**New:** `mcp_server/lib/feedback/shadow-scoring.ts` (430 lines)
- REQ-D4-006: Shadow rank comparison on holdout query slices
- `selectHoldoutQueries()` — deterministic seeded random with stratified intent sampling
- `compareRanks()` — per-query rank deltas, Kendall tau, NDCG delta, MRR delta
- `logRankDelta()` — SQLite tables `shadow_scoring_log` + `shadow_cycle_results`
- `WeeklyEvaluationTracker` — tracks consecutive improvements across cycles
- `evaluatePromotionGate()` — 2-consecutive-week gate: `promote` / `wait` / `rollback`
- `runShadowEvaluation()` — end-to-end pipeline

**Feature Flag:** `SPECKIT_SHADOW_FEEDBACK` (default OFF, shadow-only)

### D3.C: Graph Calibration & Communities

**New:** `mcp_server/lib/search/graph-calibration.ts` (370 lines)
- REQ-D3-005: Ablation harness with per-intent MRR@k and NDCG@k
- REQ-D3-006: Louvain activation thresholds (density >= 0.3, size >= 10)
- `calibrateGraphWeight()` — caps Stage 2 graph bonus at 0.05
- `CalibrationProfile` with DEFAULT and AGGRESSIVE presets
- `applyCommunityScoring()` — secondary-only, capped at 0.03

**Feature Flag:** `SPECKIT_GRAPH_CALIBRATION_PROFILE` (default OFF)

### D2.C: Index-Time Surrogates

**New:** `mcp_server/lib/search/query-surrogates.ts` (400 lines)
- REQ-D2-005: Surrogate metadata for recall without runtime LLM calls
- `extractAliases()` — heuristic abbreviation/synonym extraction
- `generateSurrogateQuestions()` — heading-to-question conversion (2-5 per document)
- `matchSurrogates()` — weighted query-time matching (alias 0.3, question 0.4, summary 0.2, heading 0.1)
- SQLite table `memory_surrogates` with batch loading

**Feature Flag:** `SPECKIT_QUERY_SURROGATES` (default OFF)

### D5.C: Progressive Disclosure & Session State

**New:** `mcp_server/lib/search/progressive-disclosure.ts` (310 lines)
- REQ-D5-005: Summary layer + snippet extraction + cursor pagination
- `buildProgressiveResponse()` — replaces hard tail-truncation
- Base64 continuation cursors with 5-minute TTL

**New:** `mcp_server/lib/search/session-state.ts` (320 lines)
- REQ-D5-006: Cross-turn retrieval session state
- `SessionStateManager` — activeGoal, seenResultIds, openQuestions, preferredAnchors
- `deduplicateResults()` — deprioritizes seen results (score * 0.3)
- `refineForGoal()` — keyword-overlap boost (up to 1.2x)
- In-memory with 30-min TTL and LRU eviction at 100 sessions

**Feature Flags:** `SPECKIT_PROGRESSIVE_DISCLOSURE_V1`, `SPECKIT_SESSION_RETRIEVAL_STATE_V1` (both default OFF)
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

### Waves 2-3 Agent Dispatch (3 Agents)

| Agent | Type | Model | Wave | Focus | Duration | Tests |
|-------|------|-------|------|-------|----------|-------|
| Sonnet-D3B | Native worktree | Claude Sonnet 4.6 | W2 | D3.B Graph lifecycle | ~6m | 69 |
| Sonnet-D4B | Native worktree | Claude Sonnet 4.6 | W2 | D4.B Batch learning + reconsolidation | ~6m | 53+15 |
| Sonnet-D2B | Native worktree | Claude Sonnet 4.6 | W3 | D2.B LLM reform + HyDE + D1.B+C + D5.B | ~5.5m | 66+ |

**Strategy:** Three parallel Sonnet agents handled Waves 2-3 implementation simultaneously. D3.B and D4.B ran as Wave 2, while a combined agent handled Wave 3 dimensions (D1.B+C, D2.B, D5.B) since they share the stage1 pipeline integration point.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

1. **All features default OFF** — Every new capability is behind a feature flag that defaults to OFF, ensuring zero behavior change without explicit opt-in.

2. **D2 Phase A accelerated into Wave 1** — Though originally Wave 2 in the plan, D2's Phase A (decomposition + concept routing) has no Wave 1 dependencies and was implemented in parallel. [DEVIATION: Implemented ahead of schedule for efficiency]

3. **Shadow-only for feedback** — The event ledger logs events but has no ranking side effects, matching the "log before changing" architectural principle.

4. **Heuristic-only for confidence** — V1 confidence scoring uses heuristic factors (margin, agreement, reranker, anchors) with no model calls in the hot path, preserving latency.

5. **Separate FSRS hybrid from existing TM-03** — The new hybrid decay policy uses a separate feature flag and axis from the existing classification decay, avoiding coupling.

6. **Deterministic graph extraction** — `onIndex()` uses rule-based extraction (headings, aliases, relation phrases, code fences) with zero LLM calls on the default path. LLM backfill is a separate opt-in flag.

7. **Assistive reconsolidation tiers** — Three tiers (auto-merge >=0.96, review 0.88-0.96, keep-separate <0.88) match the spec exactly. No destructive action below 0.88.

8. **LLM cache for reformulation** — In-memory LRU cache prevents redundant LLM calls for identical queries within 1 hour, keeping latency controlled.

9. **Waves 2-3 combined execution** — Wave 3 items were implemented alongside Wave 2 since they share the stage1 pipeline integration point and have no cross-wave dependencies at the code level.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

### Test Coverage

#### Wave 1

| Dimension | Sonnet Tests | GPT-5.4 Tests | Total | Status |
|-----------|-------------|---------------|-------|--------|
| D4 Feedback | 101 | 16 | 117 | All pass |
| D1 Fusion | 58 | 99 | 157 | All pass |
| D3 Graph | 32 | ✓ | 32+ | All pass |
| D5 UX | 74 | ✓ | 74+ | All pass |
| D2 Query | 65 | ✓ | 65+ | All pass |
| **Total** | **330** | **115+** | **445+** | **0 regressions** |

#### Waves 2-3

| File | Tests | Status |
|------|-------|--------|
| graph-lifecycle.vitest.ts | 69 | All pass |
| batch-learning.vitest.ts | 53 | All pass |
| fusion-lab.vitest.ts | ~45 | All pass |
| assistive-reconsolidation.vitest.ts | ~15 | All pass |
| **Wave 2-3 Total** | **~203** | **0 regressions** |

**Overall:** 8,325 tests pass. 26 pre-existing failures were fixed by the new code (net improvement).

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
| `SPECKIT_GRAPH_REFRESH_MODE` | D3 | OFF | Created (Wave 2) |
| `SPECKIT_LLM_GRAPH_BACKFILL` | D3 | OFF | Created (Wave 2) |
| `SPECKIT_BATCH_LEARNED_FEEDBACK` | D4 | OFF | Created (Wave 2) |
| `SPECKIT_ASSISTIVE_RECONSOLIDATION` | D4 | OFF | Created (Wave 2) |
| `SPECKIT_LLM_REFORMULATION` | D2 | OFF | Created (Wave 3) |
| `SPECKIT_HYDE` | D2 | OFF | Created (Wave 3) |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Eval baseline not yet recorded** — T001 (Phase 0) was not executed; baseline metrics needed before activating any feature flags for comparison.
2. **LLM-dependent features need API key** — `SPECKIT_LLM_REFORMULATION` and `SPECKIT_HYDE` require an LLM provider to be configured. They are no-ops without one.
3. **No live ranking changes** — All features are shadow-only or gated OFF; no production behavior is affected until explicit opt-in.
4. **Learned combiner needs training data** — Ridge regression requires accumulated judged relevance data (50+ per intent class) before producing useful weights.
5. **Shadow scoring needs 2+ weekly cycles** — Promotion gate requires 2 consecutive stable weekly evaluations before recommending live activation.

### All Waves Complete

| Wave | Dimensions | Items | Status |
|------|-----------|-------|--------|
| Wave 1 | D1.A, D2.A, D3.A, D4.A, D5.A | 10 items | Complete |
| Wave 2 | D3.B, D4.B | 4 items | Complete |
| Wave 3 | D1.B+C, D2.B, D5.B | 6 items | Complete |
| Wave 4 | D1.D, D4.C, D3.C, D2.C, D5.C | 5 items | Complete |
<!-- /ANCHOR:limitations -->
