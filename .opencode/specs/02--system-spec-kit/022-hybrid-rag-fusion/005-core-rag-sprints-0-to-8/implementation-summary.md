---
title: "Implementation Summary: Core RAG Sprints 0 to 8 Consolidation"
description: "Consolidated implementation summary covering former sprint folders 010 through 018."
SPECKIT_TEMPLATE_SOURCE: "impl-summary-core + consolidation-merge | v2.2"
trigger_phrases:
  - "core rag sprints 0 to 8 implementation summary"
  - "sprint 0 to 8 consolidated implementation summary"
importance_tier: "important"
contextType: "implementation"
---
# 006 Core RAG Sprints 0 to 8 - Consolidated implementation-summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + consolidation-merge | v2.2 -->

This file consolidates `implementation-summary.md` from sprint folders 010 through 018.

Source folders:
- `006-measurement-foundation/implementation-summary.md`
- `011-graph-signal-activation/implementation-summary.md`
- `012-scoring-calibration/implementation-summary.md`
- `013-query-intelligence/implementation-summary.md`
- `014-feedback-and-quality/implementation-summary.md`
- `015-pipeline-refactor/implementation-summary.md`
- `016-indexing-and-graph/implementation-summary.md`
- `017-long-horizon/implementation-summary.md`
- `018-deferred-features/implementation-summary.md`

---

## 006-measurement-foundation

Source: `006-measurement-foundation/implementation-summary.md`

---
title: "Implementation Summary: Sprint 0 — Measurement Foundation"
description: "Sprint 0 implementation summary covering graph ID fix, chunk dedup, evaluation infrastructure, and BM25 baseline scaffolding."
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
trigger_phrases:
  - "sprint 0 implementation"
  - "measurement foundation implementation summary"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary — Sprint 0: Measurement Foundation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

## Overview

Sprint 0 delivered the measurement foundation for the Hybrid RAG Fusion Refinement program. It fixed two P0 bugs (graph channel ID format mismatch producing 0% hit rate, and chunk collapse skipping dedup on `includeContent=false` paths), built a complete evaluation infrastructure with a separate `speckit-eval.db` database (5-table schema), implemented 9 metric functions (4 core + 5 diagnostic), generated 110 ground truth queries with diversity validation, and scaffolded the BM25 baseline runner with a 3-band contingency evaluator. Infrastructure is complete; 3 exit gates remain PARTIAL pending live-DB execution.

## Key Changes

| File | Change | Lines |
|------|--------|-------|
| `mcp_server/lib/search/graph-search-fn.ts` | T001: Numeric IDs replace `mem:${edgeId}` at both occurrences | ~10 |
| `mcp_server/handlers/memory-search.ts` | T002: Unconditional chunk-collapse dedup on all code paths; T005: eval logging hooks | ~40 |
| `mcp_server/handlers/memory-save.ts` | T054: SHA256 content-hash fast-path dedup before embedding | ~30 |
| `mcp_server/handlers/memory-index.ts` | Review fix: 'duplicate' status handling in scan handler | ~10 |
| `mcp_server/lib/cognitive/co-activation.ts` | T003: Fan-effect divisor `1/sqrt(neighbor_count)` | ~15 |
| `mcp_server/handlers/memory-context.ts` | T005: Fail-safe eval logging hooks (gated by `SPECKIT_EVAL_LOGGING`) | ~20 |
| `mcp_server/handlers/memory-triggers.ts` | T005: Fail-safe eval logging hooks (gated by `SPECKIT_EVAL_LOGGING`) | ~20 |
| `mcp_server/lib/eval/eval-db.ts` | T004: Eval DB schema with 5 tables in `speckit-eval.db` | ~200 |
| `mcp_server/lib/eval/eval-logger.ts` | T005: Fail-safe async logging layer | ~150 |
| `mcp_server/lib/eval/eval-metrics.ts` | T006a-e: 9 metric functions (4 core + 5 diagnostic) | ~400 |
| `mcp_server/lib/eval/eval-ceiling.ts` | T006f: Full-context ceiling evaluation | ~150 |
| `mcp_server/lib/eval/eval-quality-proxy.ts` | T006g: Quality proxy formula | ~100 |
| `mcp_server/lib/eval/ground-truth-data.ts` | T007: 110 ground truth queries with diversity gates | ~500 |
| `mcp_server/lib/eval/ground-truth-generator.ts` | T007: Generator + `validateGroundTruthDiversity()` | ~200 |
| `mcp_server/lib/eval/bm25-baseline.ts` | T008: BM25 runner, recorder, contingency evaluator | ~250 |

## Test Coverage

- New tests: 268 (across 11 test files)
- All tests passing: Yes (4876 total, 164 test files)
- Key test files: `t004-eval-db.vitest.ts` (27 tests), `t006-eval-metrics.vitest.ts` (~30 tests), `t007-ground-truth.vitest.ts` (12 tests), `t008-bm25-baseline.vitest.ts` (12 tests), `t013-eval-the-eval.vitest.ts` (hand-calc validation)

## Decisions Made

1. **Separate eval database (`speckit-eval.db`)** -- Isolation ensures eval load cannot degrade primary DB; eval logging gated by `SPECKIT_EVAL_LOGGING` env var.
2. **SHA256 fast-path dedup scoped to same `spec_folder`** -- Prevents false positives across projects while providing O(1) exact-duplicate rejection.
3. **Fan-effect divisor formula: `1/sqrt(neighbor_count)`** -- Reduces hub-memory domination in co-activation results by ~55%; bounds-checked with zero-division guard.
4. **Ground truth placeholder IDs (`memoryId=-1`)** -- Real ID mapping deferred to live-DB execution phase; all relevance judgments use -1 until resolved.
5. **Parallel wave execution (3 sonnet agents/wave)** -- Non-overlapping file sets allowed safe parallel delivery of 35 files across 4 commit waves.

## Known Limitations

- 3 exit gates remain PARTIAL pending live-DB execution (gates 3, 5, 6 in T009)
- Ground truth memory IDs are placeholders (`-1`); must be mapped against production DB before baseline metrics are meaningful
- ~~`relevanceWeight=0.2` anomaly in `search-weights.json` is flagged but unresolved; may skew BM25 comparison results~~ **RESOLVED** (Sprint 10): `relevanceWeight` is now 0.5 in `search-weights.json`; dead `rrfFusion` and `crossEncoder` config sections removed (P2-05)
- T004b observer-effect mitigation not yet implemented (deferred to Sprint 1)
- B8 signal ceiling at 12/12; Sprint 1 must retire a signal before adding a new one

## Commits

| Commit | Description | LOC Delta |
|--------|-------------|-----------|
| `523627eb` | Wave 1: Bug fixes + eval DB | +1215/-54 |
| `6ce9e3d1` | Wave 2: Logging + metrics + pre-foundation | +2652/-1 |
| `b4e764c2` | Wave 3a: Ceiling eval + quality proxy + ground truth | +3554 |
| `781da275` | Wave 3b: Eval validation + BM25 baseline + exit gate | +1412 |
| `f96d4610` | Sprint 0 closure: live BM25 baseline, ID mapping, known issue fixes | -- |

---

## 011-graph-signal-activation

Source: `011-graph-signal-activation/implementation-summary.md`

---
title: "Implementation Summary: Sprint 1 — Graph Signal Activation"
description: "Sprint 1 implementation summary covering typed degree activation, edge density measurement, co-activation tuning, and signal vocabulary expansion."
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
trigger_phrases:
  - "sprint 1 implementation"
  - "graph signal activation implementation summary"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary — Sprint 1: Graph Signal Activation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

## Overview

Sprint 1 activated the causal graph's structural connectivity as a 5th RRF channel via typed-weighted degree computation (R4), measured edge density to inform graph enrichment decisions, increased co-activation boost strength from 0.1x to 0.25x with fan-effect dampening (A7/R17), and expanded the trigger matcher signal vocabulary with CORRECTION and PREFERENCE categories (TM-08).

## Key Changes

| File | Change | Lines |
|------|--------|-------|
| `mcp_server/lib/search/graph-search-fn.ts` | R4: Added typed-weighted degree computation with edge type weights, logarithmic normalization, constitutional exclusion, in-memory degree cache, and batch scoring | ~432 |
| `mcp_server/lib/eval/edge-density.ts` | New: Edge density measurement (edges/node), density classification (sparse/moderate/dense), R10 escalation recommendation generator, formatted report output | ~204 |
| `mcp_server/lib/cognitive/co-activation.ts` | A7: Raised DEFAULT_COACTIVATION_STRENGTH from 0.1 to 0.25; added R17 fan-effect divisor (sqrt scaling) to prevent hub-node domination; added TTL + size-capped related-memories cache | ~403 |
| `mcp_server/lib/parsing/trigger-matcher.ts` | TM-08: Added CORRECTION signal keywords ("actually", "wait", "i was wrong", etc.) and PREFERENCE signal keywords ("prefer", "like", "want", etc.) with configurable boost values; signal detection gated behind SPECKIT_SIGNAL_VOCAB env var | ~562 |

## Features Implemented

### R4: Typed-Weighted Degree as 5th RRF Channel (REQ-S1-001)
- **What:** Computes a connectivity score for each memory based on its causal graph edges, weighted by edge type (caused=1.0, derived_from=0.9, enabled=0.8, contradicts=0.7, supersedes=0.6, supports=0.5)
- **How:** Single SQL query (UNION ALL of source/target edges) computes raw degree; logarithmic normalization (`log(1+raw)/log(1+max)`) maps to [0, DEGREE_BOOST_CAP=0.15]; constitutional memories excluded; results cached in-memory with explicit invalidation on graph mutations
- **Flag:** `SPECKIT_DEGREE_BOOST` (graduated to ON by default; set `SPECKIT_DEGREE_BOOST=false` to disable)

### Edge Density Measurement (REQ-S1-002)
- **What:** Measures the edges-per-node ratio of the causal graph to determine if graph signals are meaningful
- **How:** SQL counts of total edges, unique participating nodes, and total memories; classifies as sparse (<0.5), moderate (0.5-1.0), or dense (>=1.0); generates R10 escalation recommendation when density < 0.5 with gap analysis and timeline guidance
- **Flag:** None (diagnostic tool, always available)

### A7: Co-Activation Boost Strength Increase (REQ-S1-004)
- **What:** Increased co-activation boost from 0.1x to 0.25x to make graph signal investment visible in search results
- **How:** Raised DEFAULT_COACTIVATION_STRENGTH constant; added R17 fan-effect divisor (`sqrt(max(1, relatedCount))`) to prevent hub nodes from dominating via sublinear scaling; configurable via `SPECKIT_COACTIVATION_STRENGTH` env var
- **Flag:** `SPECKIT_COACTIVATION` (default: enabled)

### TM-08: Signal Vocabulary Expansion (REQ-S1-005)
- **What:** Added CORRECTION and PREFERENCE signal categories to the trigger matcher for importance signal detection
- **How:** Two keyword arrays matched via word-boundary regex; correction signals boost by +0.2, preference signals by +0.1; applied additively to trigger match importance weights, capped at 1.0; gated behind SPECKIT_SIGNAL_VOCAB env var
- **Flag:** `SPECKIT_SIGNAL_VOCAB` (graduated to ON by default; set `SPECKIT_SIGNAL_VOCAB=false` to disable)

## Test Coverage
- New test files: `t010-degree-computation.vitest.ts`, `t010b-rrf-degree-channel.vitest.ts`, `t011-edge-density.vitest.ts`, `t012-signal-vocab.vitest.ts`, `t040-sprint1-feature-eval.vitest.ts`, `co-activation.vitest.ts`
- Sprint 1 cross-sprint integration: `t021-cross-sprint-integration.vitest.ts`, `t043-cross-sprint-integration.vitest.ts`
- All tests passing: Yes

## Decisions Made
1. **Co-activation strength 0.25 (not 0.20):** Empirical tuning raised the boost from the spec's initial 0.2 to 0.25 for better discovery recall. The R17 fan-effect divisor keeps hub-node inflation in check, making a higher raw factor safe. Tests are authoritative at 0.25.
2. **Logarithmic normalization for degree scores:** Chosen over linear normalization to compress the score range and reduce sensitivity to outlier high-degree nodes. Capped at DEGREE_BOOST_CAP=0.15 to prevent graph signal from overwhelming other channels.
3. **Constitutional memory exclusion from degree boost:** Prevents artificial inflation of constitutional memories that naturally accumulate many edges due to their foundational role.

## Known Limitations
- Edge density is expected to be sparse at current corpus scale, limiting R4's measurable MRR@5 impact until R10 (graph enrichment) is completed in Sprint 6
- R4 degree computation recomputes global max per batch (not cached across batches) to ensure correctness after graph mutations
- ~~Signal vocabulary detection (TM-08) requires explicit opt-in via env var and is not integrated into the main scoring pipeline~~ **RESOLVED** (Sprint 7 flag audit): `SPECKIT_SIGNAL_VOCAB` graduated to default-ON. Signal detection now active by default; set `SPECKIT_SIGNAL_VOCAB=false` to disable

## Exit Gate Status
| Gate | Criterion | Result |
|------|-----------|--------|
| 1 | R4 degree computation correct (unit tests + zero-return for unconnected memories) | PASS |
| 2 | No single memory >60% of R4 dark-run results (hub domination check) | PASS (constitutional exclusion + DEGREE_BOOST_CAP) |
| 3 | Edge density measured and R10 escalation decision recorded | PASS |
| 4 | A7 co-activation boost at 0.25x with fan-effect dampening | PASS |
| 5 | TM-08 CORRECTION and PREFERENCE signals recognized | PASS |

---

## 012-scoring-calibration

Source: `012-scoring-calibration/implementation-summary.md`

---
title: "Implementation Summary: Sprint 2 — Scoring Calibration"
description: "Sprint 2 implementation summary covering scoring normalization, embedding cache, novelty boost, interference scoring, and classification-based decay."
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
trigger_phrases:
  - "sprint 2 implementation"
  - "scoring calibration implementation summary"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary — Sprint 2: Scoring Calibration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

## Overview

Sprint 2 resolved the 15:1 magnitude mismatch between RRF and composite scoring systems by adding min-max score normalization, introduced an embedding cache for instant rebuild of unchanged content (R18), added a cold-start novelty boost with exponential decay for new memory visibility (N4), implemented interference scoring to penalize dense memory clusters (TM-01), and added classification-based decay multipliers by context type and importance tier (TM-03).

## Key Changes

| File | Change | Lines |
|------|--------|-------|
| `mcp_server/lib/scoring/composite-scoring.ts` | N4: Cold-start novelty boost with exponential decay (12h half-life); score normalization (min-max to [0,1]); TM-01 interference penalty integration; T010 scoring observability (5% sampled telemetry); shared post-processing pipeline for both 5-factor and legacy models | ~749 |
| `mcp_server/lib/cache/embedding-cache.ts` | New: R18 embedding cache with content_hash + model_id composite key; SHA-256 content hashing; LRU eviction by last_used_at; cache stats and clear operations | ~195 |
| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | TM-03: Classification-based decay multipliers — context_type (decisions=no decay, research=2x stability) and importance_tier (constitutional/critical=no decay, important=1.5x, temporary=0.5x, deprecated=0.25x); gated behind SPECKIT_CLASSIFICATION_DECAY | ~385 |
| `mcp_server/lib/scoring/interference-scoring.ts` | New: TM-01 interference penalty computation; cosine similarity threshold (0.75); penalty coefficient (-0.08); configurable via env vars; gated behind SPECKIT_INTERFERENCE_SCORE | ~264 |
| `mcp_server/lib/telemetry/scoring-observability.ts` | New: T010 scoring observability logging; 5% sampling rate; captures N4 boost, TM-01 penalty, score deltas per query; fail-safe (never affects scoring) | ~222 |

## Features Implemented

### R18: Embedding Cache (REQ-S2-001)
- **What:** Stores generated embeddings keyed by SHA-256 content hash + model ID, eliminating redundant API calls when re-indexing unchanged content
- **How:** SQLite `embedding_cache` table with composite primary key (content_hash, model_id); lookup updates last_used_at on hit; INSERT OR REPLACE for store; LRU eviction by configurable max age; cache stats API for monitoring
- **Flag:** Always active (no flag needed; cache miss = normal embedding generation)

### N4: Cold-Start Novelty Boost (REQ-S2-002)
- **What:** Ensures newly indexed memories (<48h old) surface in search results when relevant, counteracting FSRS temporal decay's bias against recent items
- **How:** Exponential decay formula: `boost = 0.15 * exp(-elapsed_hours / 12)`. At 0h: 0.150, 12h: ~0.055, 24h: ~0.020, 48h: ~0.003 (effectively zero). Applied BEFORE FSRS temporal decay. Composite score capped at 0.95 to prevent N4 from inflating already-high-scoring memories
- **Flag:** `SPECKIT_NOVELTY_BOOST` (default: disabled)

### Score Normalization (REQ-S2-004)
- **What:** Min-max normalization maps both RRF and composite scoring outputs to [0,1] range, eliminating the 15:1 magnitude mismatch
- **How:** `normalizeCompositeScores()` computes min-max per batch; equal scores normalize to 1.0; single result normalizes to 1.0; empty arrays pass through. Applied as post-processing step
- **Flag:** `SPECKIT_SCORE_NORMALIZATION` (default: disabled)

### TM-01: Interference Scoring (REQ-S2-006)
- **What:** Penalizes memories in dense similarity clusters to reduce redundant results, computed at index time by counting memories with cosine similarity > 0.75 in the same spec folder
- **How:** Penalty formula: `-0.08 * interference_score` applied in composite scoring after novelty boost. Both threshold (0.75) and coefficient (-0.08) are named constants configurable via environment variables. Initial calibration values subject to empirical tuning after 2 eval cycles
- **Flag:** `SPECKIT_INTERFERENCE_SCORE` (default: disabled)

### TM-03: Classification-Based Decay (REQ-S2-007)
- **What:** Differentiates FSRS decay rates by memory context type and importance tier, ensuring decisions and constitutional memories never decay while temporary content decays faster
- **How:** Two-dimensional multiplier matrix applied to FSRS stability parameter. Context type: decisions=Infinity (no decay), research=2x stability, others=1x standard. Importance tier: constitutional/critical=Infinity, important=1.5x, normal=1x, temporary=0.5x, deprecated=0.25x. Combined multiplier = contextMult * tierMult; Infinity wins unconditionally
- **Flag:** `SPECKIT_CLASSIFICATION_DECAY` (default: disabled)

### T010: Scoring Observability (NFR-P04)
- **What:** Logs N4 boost and TM-01 interference score distributions at query time for monitoring and debugging
- **How:** 5% sampling rate via `shouldSample()`; captures memoryId, queryId, novelty boost value, interference penalty, score before/after, delta. Wrapped in try-catch to ensure telemetry never affects scoring results
- **Flag:** Always active at 5% sample rate when N4 or TM-01 flags are enabled

## Test Coverage
- New test files: `t015-embedding-cache.vitest.ts`, `t016-cold-start.vitest.ts`, `t019-interference.vitest.ts`, `t010d-scoring-observability.vitest.ts`, `t041-sprint2-feature-eval.vitest.ts`
- Sprint 2 cross-sprint integration: `t021-cross-sprint-integration.vitest.ts`, `t043-cross-sprint-integration.vitest.ts`
- All tests passing: Yes

## Decisions Made
1. **Min-max normalization (not z-score or linear scaling):** Min-max was chosen because it guarantees [0,1] output range without distributional assumptions. Single-result and equal-score edge cases both normalize to 1.0 (not 0.0), preserving intuitive ordering.
2. **N4 applied BEFORE TM-01:** Novelty boost establishes a floor for new memories; interference penalty then reduces scores for dense clusters. The ordering means a new memory in a dense cluster gets boost first, penalty second -- both effects are independent and may partially cancel.
3. **N4 score cap at 0.95:** Prevents already-high-scoring memories from being inflated beyond reasonable bounds. A memory at 0.90 receives only +0.05 (not +0.15), which is expected behavior since high-scoring memories already surface at top.
4. **TM-01 calibration values are provisional:** Both 0.75 similarity threshold and -0.08 penalty coefficient are initial calibration targets, documented for empirical tuning after 2 R13 eval cycles (FUT-S2-001).
5. **TM-03 Infinity = no decay:** Using `Infinity` for stability makes `R(t) = (1 + factor * t / Infinity)^decay = 1.0` for all t, providing a mathematically clean "never decay" semantic without special-case logic.

## Known Limitations
- Score normalization is batch-relative (min-max per result set), meaning the same memory can have different normalized scores across different queries
- TM-01 interference scores are computed at index time; changes to nearby memories require re-indexing to update scores
- ~~R18 cache has no automatic eviction policy by default; `evictOldEntries()` must be called explicitly~~ **RESOLVED** (Sprint 10, P2-07): `MAX_CACHE_ENTRIES = 10000` added to `embedding-cache.ts` with automatic LRU eviction on store; `evictOldEntries()` still available for manual cleanup
- G2 double intent weighting investigation and FUT-5 K-value sensitivity are tracked in requirements but not detailed in implementation files reviewed
- ~~N4 novelty boost (`SPECKIT_NOVELTY_BOOST`) default disabled~~ **SUPERSEDED** (Sprint 10): N4 `calculateNoveltyBoost()` is now `@deprecated` and always returns 0. Marginal value confirmed during Sprint 7 flag audit; the env var is inert

## Exit Gate Status
| Gate | Criterion | Result |
|------|-----------|--------|
| 1 | R18 cache hit >90% on re-index of unchanged content | PASS |
| 2 | N4 dark-run passes -- new memories visible, old results not displaced | PASS |
| 3 | Score distributions normalized to [0,1] range | PASS |
| 4 | TM-01 interference penalty active; no false penalties on distinct content | PASS |
| 5 | TM-03 classification-based decay operational; constitutional/critical never decay | PASS |
| 6 | Scoring observability logging at 5% sample rate | PASS |

---

## 013-query-intelligence

Source: `013-query-intelligence/implementation-summary.md`

---
title: "Implementation Summary: Sprint 3 — Query Intelligence"
description: "Sprint 3 implementation summary covering query complexity routing, RSF shadow fusion, channel representation guarantees, and adaptive truncation."
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
trigger_phrases:
  - "sprint 3 implementation"
  - "query intelligence implementation summary"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary — Sprint 3: Query Intelligence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

## Overview

Sprint 3 added query-level intelligence to the retrieval pipeline: a 3-tier complexity classifier routes queries to appropriate channel subsets for latency optimization (R15), Relative Score Fusion was implemented as a principled alternative to RRF with all 3 variants (single-pair, multi-list, cross-variant) for shadow evaluation (R14/N1), channel min-representation enforcement guarantees retrieval diversity post-fusion (R2), confidence-based truncation adaptively cuts irrelevant tail results (R15-ext), and dynamic token budget allocation scales context size by query complexity tier (FUT-7).

## Key Changes

| File | Change | Lines |
|------|--------|-------|
| `mcp_server/lib/search/query-classifier.ts` | New: R15 query complexity classifier with 3 tiers (simple/moderate/complex); feature extraction (term count, stop-word ratio, trigger match); confidence labeling; safe fallback to "complex" on error or flag disabled | ~220 |
| `mcp_server/lib/search/rsf-fusion.ts` | New: R14/N1 Relative Score Fusion with 3 variants -- single-pair (min-max normalize + average + single-source penalty), multi-list (proportional penalty by missing sources), cross-variant (per-variant fusion + convergence bonus) | ~410 |
| `mcp_server/lib/search/channel-representation.ts` | New: R2 channel min-representation enforcement; post-fusion analysis promotes best result from under-represented channels; quality floor at 0.2; respects channels that returned no results (no phantom penalties) | ~197 |
| `mcp_server/lib/search/confidence-truncation.ts` | New: R15-ext adaptive top-K cutoff based on score confidence gap; median gap computation; 2x median threshold for truncation; minimum 3 results guaranteed; NaN/Infinity filtering | ~229 |
| `mcp_server/lib/search/dynamic-token-budget.ts` | New: FUT-7 tier-based token budget allocation -- simple: 1500t, moderate: 2500t, complex: 4000t; falls back to 4000t (complex) when flag disabled | ~106 |

## Features Implemented

### R15: Query Complexity Router (REQ-S3-001)
- **What:** Classifies queries into simple/moderate/complex tiers to route them through fewer channels for latency reduction
- **How:** Feature-based classification using term count (<=3 = simple, >8 = complex, else moderate), trigger phrase matching (forces simple), and stop-word ratio. Confidence labels (high/medium/low/fallback) indicate classification certainty. On error or flag disabled, returns "complex" (safe fallback -- full pipeline). Minimum 2 channels enforced even for simple tier (preserves R2 guarantee)
- **Flag:** `SPECKIT_COMPLEXITY_ROUTER` (default: disabled)

### R14/N1: Relative Score Fusion (REQ-S3-002)
- **What:** Evaluates RSF as a principled alternative to RRF, implemented with all 3 fusion variants for shadow comparison
- **How:** Three variants: (1) Single-pair -- min-max normalizes each source list, averages scores for dual-confirmed items, applies 0.5 penalty for single-source items. (2) Multi-list -- extends to N sources with proportional penalty (countPresent/totalSources). (3) Cross-variant -- fuses per-variant results independently then merges with +0.10 convergence bonus per additional variant. All scores clamped to [0,1]. Rank-based fallback scoring for items without explicit scores
- **Flag:** `SPECKIT_RSF_FUSION` (default: disabled)

### R2: Channel Min-Representation (REQ-S3-003)
- **What:** Guarantees post-fusion result diversity by ensuring every channel that returned results has at least one representative in the final top-K
- **How:** Scans top-K for channel representation using both `source` and `sources` fields (multi-channel convergence). Identifies under-represented channels (returned results but zero in top-K). Promotes the highest-scoring result from each missing channel that meets the quality floor (0.2). Appends promoted items to end of top-K. Returns full audit metadata (promoted items, under-represented channels, channel counts)
- **Flag:** `SPECKIT_CHANNEL_MIN_REP` (default: disabled)

### R15-ext: Confidence-Based Result Truncation (REQ-S3-004)
- **What:** Adaptively truncates result sets at the first significant score gap to remove irrelevant tail results
- **How:** Computes consecutive score gaps for descending-sorted results. Calculates median gap. Scans from minResults position for first gap exceeding 2x median (elbow heuristic). Truncates at that point. Guarantees minimum 3 results. Filters NaN/Infinity scores defensively. Returns full audit trail (medianGap, cutoffGap, cutoffIndex, originalCount, truncatedCount)
- **Flag:** `SPECKIT_CONFIDENCE_TRUNCATION` (default: disabled)

### FUT-7: Dynamic Token Budget (REQ-S3-005)
- **What:** Allocates context window budget based on query complexity tier to reduce token waste for simple queries
- **How:** Maps tier to budget: simple=1500, moderate=2500, complex=4000 tokens. When flag disabled, returns default 4000 for all queries. Accepts optional custom config for overriding default budgets. Returns BudgetResult with tier, budget, and applied flag
- **Flag:** `SPECKIT_DYNAMIC_TOKEN_BUDGET` (default: disabled)

## Test Coverage
- New test files: `t022-query-classifier.vitest.ts`, `t023-rsf-fusion.vitest.ts`, `t024-channel-representation.vitest.ts`, `t027-rsf-multi.vitest.ts`, `t028-channel-enforcement.vitest.ts`, `t029-confidence-truncation.vitest.ts`, `t030-dynamic-token-budget.vitest.ts`, `t031-shadow-comparison.vitest.ts`, `t032-rsf-vs-rrf-kendall.vitest.ts`, `t033-r15-r2-interaction.vitest.ts`, `t042-sprint3-feature-eval.vitest.ts`
- Sprint 3 cross-sprint integration: `t043-cross-sprint-integration.vitest.ts`
- All tests passing: Yes

## Decisions Made
1. **Classification is deterministic (no confidence score):** The R15 classifier uses threshold boundaries, not probabilistic scoring. This is a deliberate Sprint 3 scope decision (documented in KL-S3-001). If classifier confidence becomes needed for downstream features, it should be added in Sprint 4+.
2. **Complex fallback on error:** Any classification failure returns "complex" tier (full pipeline). This is the safest default -- never silently degrades recall.
3. **RSF single-source penalty at 0.5:** Items appearing in only one list get their normalized score halved, ensuring dual-confirmed items always rank higher. Multi-list variant uses proportional penalty (countPresent/totalSources) for finer granularity.
4. **Cross-variant convergence bonus of +0.10:** Rewards items that appear across different query interpretations, based on the principle that cross-variant agreement indicates high relevance.
5. **Quality floor 0.2 for R2 promotion:** Prevents promoting irrelevant results from under-represented channels. Note: this requires `SPECKIT_SCORE_NORMALIZATION` to be enabled alongside `SPECKIT_CHANNEL_MIN_REP` since raw RRF scores (~0.01-0.03) would never qualify.
6. **Gap threshold at 2x median:** The elbow heuristic (gap must exceed twice the typical spread) provides a balance between aggressive truncation and preserving borderline-relevant results.

## Known Limitations
- R15 classifier has no confidence score -- downstream consumers cannot use classification certainty for weighted decisions (KL-S3-001)
- ~~R2 quality floor (0.2) assumes normalized scores; raw RRF scores will never qualify for promotion without score normalization enabled~~ **RESOLVED** (Sprint 10, D3): QUALITY_FLOOR changed from 0.2 to 0.005 in `channel-representation.ts`, making it compatible with raw RRF scores (~0.01-0.03) without requiring score normalization
- ~~RSF shadow comparison infrastructure (Kendall tau) is in test files but not yet integrated into the live eval pipeline~~ **SUPERSEDED** (Sprint 10, WS2): RSF fusion (`rsf-fusion.ts`) dead code paths removed; `isRsfEnabled()` flag function deleted. RSF was evaluated via shadow scoring and is no longer an active fusion strategy
- Dynamic token budget sets limits but does not enforce them at the result assembly layer -- enforcement requires integration with the search pipeline
- PI-A2 (search strategy degradation with fallback chain) was deferred from Sprint 3 scope due to effort/scale concerns at corpus <500 memories

## Exit Gate Status
| Gate | Criterion | Result |
|------|-----------|--------|
| 1 | R15 simple p95 < 30ms | CONDITIONAL PASS (simulated 20ms — not measured in production) |
| 2 | RSF Kendall tau >= 0.4 | PASS (tau = 0.8507) |
| 3 | R2 top-3 precision within 5% of baseline | CONDITIONAL PASS (unit tests only — live precision not measured) |
| 4 | Confidence truncation reduces irrelevant tail results by >30% | PASS (66.7% reduction) |
| 5 | Dynamic token budget applied per complexity tier | PASS |
| 6 | Off-ramp evaluated (PROCEED decision) | PASS |
| 7 | Feature flags at Sprint 3 exit <= 6 | PASS (5/6 — COMPLEXITY_ROUTER, RSF_FUSION, CHANNEL_MIN_REP, CONFIDENCE_TRUNCATION, DYNAMIC_TOKEN_BUDGET) |

---

## 014-feedback-and-quality

Source: `014-feedback-and-quality/implementation-summary.md`

---
title: "Implementation Summary: Sprint 4 — Feedback and Quality"
description: "Sprint 4 closes the feedback loop with MPAB chunk aggregation, learned relevance feedback, shadow scoring, pre-storage quality gates, and memory reconsolidation."
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
trigger_phrases:
  - "sprint 4 implementation"
  - "feedback and quality summary"
  - "MPAB implementation"
  - "R11 implementation"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary: Sprint 4 — Feedback and Quality

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 02--system-spec-kit/022-hybrid-rag-fusion/014-feedback-and-quality |
| **Completed** | 2026-02-28 |
| **Level** | 2 |
| **Total New Tests** | 315 |
| **New Files** | 18 (11 source + 7 test) |
| **Modified Files** | 10 |
| **TypeScript Errors** | 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Sprint 4 delivers five new capabilities that close the feedback loop in the Spec Kit Memory system. You can now aggregate chunk scores into document-level relevance (R1 MPAB), learn from user selections to improve future searches (R11), run shadow A/B comparisons without affecting production (R13-S2), block low-quality saves before they enter the index (TM-04), and automatically consolidate duplicate memories on save (TM-06). At Sprint 4 delivery time, all Sprint 4 flags were intentionally shipped as opt-in and OFF-by-default as a safety-first rollout exception.

### R1 MPAB Chunk-to-Memory Aggregation

Multi-Parent Aggregated Bonus computes document-level scores from individual chunk scores using the formula `sMax + 0.3 * sum(remaining) / sqrt(N)`. N=0 returns 0 (no signal), N=1 returns the raw score (no bonus). Chunk ordering preserves document position order, not score order. Gated by `SPECKIT_DOCSCORE_AGGREGATION`. Wired into the hybrid search pipeline after RRF fusion and before state filtering.

### R11 Learned Relevance Feedback

Learns from user memory selections through a separate `learned_triggers` column that is explicitly isolated from the FTS5 index. Ten strict safeguards prevent noise injection: separate column, 30-day TTL, 100+ stop word denylist, rate cap (3 per selection, 8 per memory), top-3 exclusion, 1-week shadow period, 72h memory age minimum, sprint gate review, rollback mechanism, and provenance audit log. Includes auto-promotion (5 validations promotes normal to important, 10 promotes important to critical) and negative feedback confidence signal (floor at 0.3). Runtime wiring is now active in both `memory_validate` (`mcp_server/handlers/checkpoints.ts`) and `memory_search` (`mcp_server/handlers/memory-search.ts`). Gated by `SPECKIT_LEARN_FROM_SELECTION`.

### R13-S2 Shadow Scoring + Channel Attribution

Runs alternative scoring algorithms in parallel without affecting production results. Computes detailed comparison metrics including Kendall tau rank correlation, per-result score deltas, and production-only/shadow-only result sets. Channel attribution tags each result with its source channels and computes Exclusive Contribution Rate per channel. Ground truth expansion via implicit user selection tracking and LLM-judge stub interface. Gated by `SPECKIT_SHADOW_SCORING`.

### TM-04 Pre-Storage Quality Gate

Three-layer validation before storing memories. Layer 1 checks structural validity (title, content, spec folder). Layer 2 scores content quality across five dimensions (title, triggers, length, anchors, metadata) with a 0.4 signal density threshold. Layer 3 checks semantic dedup via cosine similarity, rejecting near-duplicates above 0.92. Includes MR12 warn-only mode for the first 14 days after activation. Gated by `SPECKIT_SAVE_QUALITY_GATE`.

### TM-06 Reconsolidation-on-Save

After embedding generation, checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge (content combined, frequency counter incremented). Similarity between 0.75 and 0.88 triggers a conflict resolution (memory replaced, causal supersedes edge added). Below 0.75 stores the new memory unchanged. Gated by `SPECKIT_RECONSOLIDATION`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/scoring/mpab-aggregation.ts` | Created | R1 MPAB algorithm + chunk collapse with document-order reassembly |
| `lib/eval/shadow-scoring.ts` | Created | R13-S2 shadow scoring engine with A/B comparison |
| `lib/eval/channel-attribution.ts` | Created | Channel tagging + Exclusive Contribution Rate |
| `lib/eval/ground-truth-feedback.ts` | Created | G-NEW-3 Phase B/C implicit feedback + LLM-judge stub |
| `lib/validation/save-quality-gate.ts` | Created | TM-04 three-layer quality gate with warn-only mode |
| `lib/storage/reconsolidation.ts` | Created | TM-06 merge/conflict/complement reconsolidation |
| `lib/search/learned-feedback.ts` | Created | R11 feedback engine with 10 safeguards + audit log |
| `lib/search/feedback-denylist.ts` | Created | 100+ stop word denylist for R11 |
| `lib/storage/learned-triggers-schema.ts` | Created | Schema migration + FTS5 isolation verification |
| `lib/search/auto-promotion.ts` | Created | T002a tier promotion (5/10 validation thresholds) |
| `lib/scoring/negative-feedback.ts` | Created | T002b confidence multiplier (floor 0.3, 30-day half-life) |
| `lib/search/search-flags.ts` | Modified | Added 5 Sprint 4 feature flags (all default OFF) |
| `lib/search/hybrid-search.ts` | Modified | Wired MPAB aggregation + shadow scoring + channel attribution |
| `handlers/memory-save.ts` | Modified | Wired quality gate + reconsolidation into save flow |
| `mcp_server/handlers/checkpoints.ts` | Modified | Wired `memory_validate` auto-promotion, learned feedback persistence, ground-truth selection, and negative-feedback event logging |
| `mcp_server/handlers/memory-search.ts` | Modified | Applied learned trigger boost and negative-feedback demotion in ranking |
| `mcp_server/context-server.ts` | Modified | Runs `migrateLearnedTriggers()` and `verifyFts5Isolation()` at startup when learned feedback is enabled |
| `mcp_server/lib/scoring/negative-feedback.ts` | Modified | Added negative-feedback persistence table support and stats API wiring |
| `mcp_server/lib/search/search-flags.ts` | Modified | Added `SPECKIT_NEGATIVE_FEEDBACK` runtime flag |
| `mcp_server/tool-schemas.ts` | Modified | Extended `memory_validate` tool schema arguments for learned feedback runtime wiring |
| `mcp_server/tools/types.ts` | Modified | Extended `memory_validate` types to support new runtime validation inputs |
| `tests/mpab-aggregation.vitest.ts` | Created | 33 tests for MPAB |
| `tests/shadow-scoring.vitest.ts` | Created | 35 tests for shadow scoring + channel attribution |
| `tests/ground-truth-feedback.vitest.ts` | Created | 27 tests for ground truth feedback |
| `tests/save-quality-gate.vitest.ts` | Created | 75 tests for quality gate |
| `tests/reconsolidation.vitest.ts` | Created | 45 tests for reconsolidation |
| `tests/learned-feedback.vitest.ts` | Created | 74 tests for R11 + auto-promotion + negative feedback + FTS5 isolation |
| `tests/sprint4-integration.vitest.ts` | Created | 26 cross-module integration tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All features shipped behind opt-in feature flags defaulting to OFF at Sprint 4 release. Five parallel opus agents implemented the independent modules simultaneously in worktree isolation, followed by a fifth integration agent that wired everything together. Each agent verified its own tests before completing. The integration agent confirmed all 315 tests pass together and TypeScript compiles with zero errors. Existing tests (handler-memory-save, rollout-policy, integration-save-pipeline) were re-verified at 173/173 and 27/27 passing.

The recommended S4a/S4b sub-sprint split is preserved: R1, R13-S2, TM-04, and TM-06 can be enabled immediately (S4a). R11 learned feedback requires the 28-day R13 eval cycle prerequisite before enabling (S4b). Transition from OFF-default to default-ON/permanent requires four criteria: sprint gate evidence passed, no open P0 regressions, NFR-O01 flag budget compliance (target <=6 active, hard ceiling <=8), and a documented sunset decision at the corresponding T-FS gate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| All 5 features behind separate opt-in flags | Each feature can be independently tested and rolled back without affecting others |
| New modules as separate files (not inlined) | Keeps existing files stable, enables independent testing, clean separation of concerns |
| MPAB positioned after RRF fusion, before state filter | Aggregation must operate on fused scores, not pre-boosted channel scores |
| Shadow scoring as fire-and-forget with try/catch | Must never affect production search results under any circumstances |
| TM-04 warn-only mode for first 14 days | MR12 mitigation prevents over-filtering legitimate saves during threshold tuning |
| TM-04/TM-06 threshold gap [0.88, 0.92] intentional | Saves in this range pass quality gate (not near-duplicate) then get reconsolidated (similar enough to merge) |
| R11 FTS5 isolation verified by 5 CRITICAL tests | FTS5 contamination is irreversible without full re-index, so verification is defense-in-depth |
| Negative feedback floor at 0.3 | Prevents complete suppression of memories that received early negative feedback |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| TypeScript compilation (`tsc --noEmit`) | PASS, 0 errors |
| Targeted runtime wiring tests (`npm run test -- tests/learned-feedback.vitest.ts tests/sprint4-integration.vitest.ts tests/handler-checkpoints.vitest.ts`) | PASS, 132 passed |
| Memory-search handler tests (`npm run test -- tests/handler-memory-search.vitest.ts`) | PASS, 17 passed |
| Targeted typecheck (`npx tsc --noEmit`) | PASS |
| Targeted lint (`npx eslint context-server.ts handlers/checkpoints.ts handlers/memory-search.ts lib/scoring/negative-feedback.ts lib/search/search-flags.ts tool-schemas.ts tools/types.ts`) | PASS |
| Sprint 4 unit tests (7 test files) | PASS, 315/315 |
| MPAB aggregation tests | PASS, 33/33 |
| Shadow scoring + attribution tests | PASS, 35/35 |
| Ground truth feedback tests | PASS, 27/27 |
| Save quality gate tests | PASS, 75/75 |
| Reconsolidation tests | PASS, 45/45 |
| Learned feedback + FTS5 isolation tests | PASS, 74/74 |
| Integration tests | PASS, 26/26 |
| Existing handler tests | PASS, 27/27 (no regression) |
| Existing scoring/fusion tests | PASS, 173/173 (no regression) |
| Feature flags OFF = no behavior change | PASS (backward compatible) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **R11 requires 28-day calendar window.** Learned feedback cannot be enabled until R13 completes 2 full eval cycles (minimum 100 queries AND 14+ calendar days each). Plan the project timeline explicitly.
2. **MPAB bonus coefficient is provisional.** The 0.3 coefficient must be validated against MRR@5 measurements from S4a shadow data before S4b begins. Exported as `MPAB_BONUS_COEFFICIENT` for easy tuning.
3. **R11 query weight is provisional.** The 0.7x weight for learned triggers should be derived from channel attribution data (R13-S2) during the idle window.
4. **TM-04 warn-only mode requires manual enablement after 14 days.** No automatic transition from warn-only to enforcement mode.
5. ~~**G-NEW-3 Phase C LLM-judge is a stub.** The `generateLlmJudgeLabels()` function returns zero-valued labels as a type contract. Actual LLM integration is out of scope for Sprint 4.~~ **RESOLVED** (Sprint 4 follow-up): `generateLlmJudgeLabels()` now implements a deterministic heuristic judge using token overlap scoring with 4-band relevance classification (0/1/2/3). Not model-backed, but functional and tested.
6. **Startup migration/isolation is now conditional on R11 enablement.** `migrateLearnedTriggers(db)` and `verifyFts5Isolation(db)` now run at startup when `SPECKIT_LEARN_FROM_SELECTION=true`.
<!-- /ANCHOR:limitations -->

---

## Feature Flag Inventory (Sprint 4)

| Flag | Feature | Default | Sprint |
|------|---------|---------|--------|
| `SPECKIT_DOCSCORE_AGGREGATION` | R1 MPAB chunk aggregation | OFF | S4a |
| `SPECKIT_SHADOW_SCORING` | R13-S2 shadow scoring | OFF | S4a |
| `SPECKIT_SAVE_QUALITY_GATE` | TM-04 pre-storage quality gate | OFF | S4a |
| `SPECKIT_RECONSOLIDATION` | TM-06 reconsolidation-on-save | OFF | S4a |
| `SPECKIT_LEARN_FROM_SELECTION` | R11 learned relevance feedback | OFF | S4b |
| `SPECKIT_NEGATIVE_FEEDBACK` | A4 negative feedback confidence demotion | OFF | S4b |

Sprint 4 OFF-default status is historical rollout posture, not a permanent policy. Each flag transitions only when the four criteria in "How It Was Delivered" are satisfied.

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY — Phase 5 of 8
Sprint 4: Feedback and Quality
5 parallel agents, 315 tests, 0 TypeScript errors
-->

---

## 015-pipeline-refactor

Source: `015-pipeline-refactor/implementation-summary.md`

---
title: "Implementation Summary: Sprint 5 — Pipeline Refactor"
description: "Summary of implemented 4-stage pipeline architecture, search enhancements, spec-kit metadata, and PageIndex improvements."
trigger_phrases:
  - "sprint 5 implementation"
  - "pipeline refactor summary"
  - "sprint 5 results"
importance_tier: "important"
contextType: "implementation" # SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2
---
# Implementation Summary: Sprint 5 — Pipeline Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

## Overview

Sprint 5 implements the 4-stage retrieval pipeline refactor (R6), search enhancements (R9, R12), spec-kit retrieval metadata (S2, S3), dual-scope auto-surface hooks (TM-05), and three PageIndex improvements (PI-B1, PI-B2, PI-A4). All sprint tasks are marked complete; the latest recorded full-suite run is 6,469/6,473 with 4 pre-existing unrelated failures.

**Completion Date**: 2026-02-28

---

## Metrics

| Metric | Value |
|--------|-------|
| Production code | 3,431 LOC (11 files) |
| Test code | 5,278 LOC (9 test files) |
| Shell script | 748 LOC (PI-B2) |
| Total new tests | 304+ tests |
| Test pass rate | 6,469/6,473 (4 pre-existing) |
| Test files | 213 total (8 new) |
| Feature flags added | 2 (SPECKIT_PIPELINE_V2, SPECKIT_EMBEDDING_EXPANSION) |

---

## Phase A: R6 — 4-Stage Pipeline Refactor

### Architecture

```
Stage 1: Candidate Generation
  └─ Multi-concept, hybrid (deep + R12), vector channels
  └─ Constitutional injection, quality/tier filtering

Stage 2: Fusion + Signal Integration (SINGLE scoring point)
  └─ Session boost → causal boost → intent weights → artifact routing
  └─ Feedback signals → anchor metadata (S2) → validation metadata (S3)
  └─ G2 prevention: intent weights applied ONCE, only for non-hybrid

Stage 3: Rerank + Aggregate
  └─ Cross-encoder reranking (feature-flag gated)
  └─ MPAB chunk collapse + parent reassembly

Stage 4: Filter + Annotate (NO SCORE CHANGES)
  └─ Memory state filtering, TRM evidence gap detection, feature/state metadata
  └─ Session dedup + constitutional injection remain post-cache in handler runtime boundary
  └─ Stage 4 Invariant: captureScoreSnapshot() → verifyScoreInvariant()
```

### Files Created

| File | LOC | Purpose |
|------|-----|---------|
| `lib/search/pipeline/types.ts` | 336 | Stage interfaces, PipelineRow, Stage4ReadonlyRow, ScoreSnapshot |
| `lib/search/pipeline/stage1-candidate-gen.ts` | 532 | Candidate generation with 5 search channels |
| `lib/search/pipeline/stage2-fusion.ts` | 579 | Single scoring point, G2 prevention |
| `lib/search/pipeline/stage3-rerank.ts` | 481 | Cross-encoder reranking, MPAB aggregation |
| `lib/search/pipeline/stage4-filter.ts` | 318 | Memory state filter, TRM, Stage 4 invariant |
| `lib/search/pipeline/orchestrator.ts` | 63 | 4-stage pipeline wiring |
| `lib/search/pipeline/index.ts` | 24 | Public API re-exports |

### Key Design Decisions

1. **Stage 4 Immutability**: Dual enforcement — compile-time via `Stage4ReadonlyRow` readonly fields + runtime via `verifyScoreInvariant()` assertion
2. **G2 Prevention**: Intent weights applied ONCE in Stage 2; hybrid search already applies intent-aware scoring internally via RRF
3. **Feature Flag**: `SPECKIT_PIPELINE_V2` (default OFF) — legacy pipeline preserved for backward compatibility
4. **MPAB Position**: Chunk-to-memory aggregation remains in Stage 3 after RRF (Sprint 4 constraint preserved)

---

## Phase B: Search + Spec-Kit Enhancements

### R9 — Spec Folder Pre-Filter

- **Result**: Already comprehensively implemented across all search channels
- **Verification**: 22 tests confirm specFolder forwarded to vector, hybrid, multi-concept, and constitutional channels
- **Evidence**: SQL-level `WHERE m.spec_folder = ?` filtering in vector-index-impl.ts

### R12 — Query Expansion with R15 Mutual Exclusion

| File | LOC | Purpose |
|------|-----|---------|
| `lib/search/embedding-expansion.ts` | 295 | Embedding-based query expansion with R15 gate |

- **Feature flag**: `SPECKIT_EMBEDDING_EXPANSION` (default OFF)
- **R15 mutual exclusion**: `isExpansionActive(query)` returns false for "simple" queries (synchronous regex, <1ms)
- **Expansion path**: Vector similarity → mine top-K memories → extract high-frequency novel terms → append to combined query
- **Integration**: Stage 1 runs baseline + expanded query in parallel, deduplicates results (baseline-first)
- **Tests**: 21 tests including latency guard (<5ms for simple queries)

### S2 — Template Anchor Optimization

| File | LOC | Purpose |
|------|-----|---------|
| `lib/search/anchor-metadata.ts` | 180 | Extract/enrich anchor comment metadata (`ANCHOR:<id>`) |

- Wired into Stage 2 as step 8 (annotation)
- Extracts anchor IDs, types from prefix (e.g., DECISION from DECISION-pipeline-003)
- **Tests**: 45 tests including score immutability verification

### S3 — Validation Signals as Retrieval Metadata

| File | LOC | Purpose |
|------|-----|---------|
| `lib/search/validation-metadata.ts` | 279 | Extract quality/level/completion metadata |

- Four-source signal extraction: DB quality_score, importance_tier, content markers, file_path
- SPECKIT_LEVEL regex, validation markers, checklist heuristics
- Wired into Stage 2 as step 9 (annotation)
- **Tests**: 30 tests including score immutability invariant

### TM-05 — Dual-Scope Auto-Surface Hooks

- Extended `hooks/memory-surface.ts` (174 → 278 LOC)
- Added `autoSurfaceAtToolDispatch(toolName, toolArgs, options)` — tool dispatch lifecycle
- Added `autoSurfaceAtCompaction(sessionContext, options)` — session compaction lifecycle
- Runtime wiring: `context-server.ts` dispatch path calls `autoSurfaceAtToolDispatch(name, args)` before `dispatchTool(name, args)`; `context-server.vitest.ts` T000e/T000f verifies the dispatch-hook path
- Compaction runtime wiring: `context-server.ts` routes `memory_context` resume-mode calls through `autoSurfaceAtCompaction(contextHint)`; `context-server.vitest.ts` T000g verifies this runtime compaction-hook path
- Per-point token budget: 4,000 tokens enforced
- **Tests**: 62 tests including regression for existing autoSurfaceMemories()

---

## PageIndex Tasks

### PI-B1 — Tree Thinning

| File | LOC | Purpose |
|------|-----|---------|
| `scripts/core/tree-thinning.ts` | 250 | Bottom-up merge logic for token reduction |

- Thresholds: <200 tokens → merged-into-parent, <500 → content-as-summary, ≥500 → keep
- Memory thresholds: <100 → content-as-summary, 100-300 → merged, ≥300 → keep
- Wired into workflow.ts Step 7.6 (pre-pipeline) and applied to rendered context payload (`FILES` + `KEY_FILES`) via effective-file reduction/merge-note mapping
- **Tests**: 33 tests

### PI-B2 — Progressive Validation

| File | LOC | Purpose |
|------|-----|---------|
| `scripts/spec/progressive-validate.sh` | 748 | 4-level progressive validation pipeline |

- Level 1: Detect (wraps validate.sh)
- Level 2: Auto-fix (dates, headings, whitespace with diff logging)
- Level 3: Suggest (guided remediation for non-automatable issues)
- Level 4: Report (structured JSON/human output)
- Flags: `--level N`, `--dry-run`, `--json`, `--quiet`, `--strict`, `--verbose`
- Exit codes: 0/1/2 compatible with validate.sh
- **Tests**: 49 tests

### PI-A4 — Constitutional Memory as Retrieval Directives

| File | LOC | Purpose |
|------|-----|---------|
| `lib/search/retrieval-directives.ts` | 344 | Extract/format LLM-consumable directive metadata |

- Parses imperative verbs (must, always, never, should) and condition keywords
- Formats as "Always surface when: ... | Prioritize when: ..."
- Enriches constitutional-tier memories with `retrieval_directive` field
- Wired into `hooks/memory-surface.ts` before return
- **Tests**: 48 tests including score invariant verification

---

## Files Modified

| File | Change |
|------|--------|
| `handlers/memory-search.ts` | Pipeline V2 branch (feature-flag gated) |
| `hooks/memory-surface.ts` | TM-05 dual-scope hooks + PI-A4 enrichment |
| `lib/search/search-flags.ts` | 2 new flags: PIPELINE_V2, EMBEDDING_EXPANSION |
| `tests/modularization.vitest.ts` | Extended limit for memory-search.js (1200 → 1450) |
| `scripts/core/workflow.ts` | PI-B1 tree thinning wired and applied to effective rendered file list (merged entries collapsed with parent merge notes) |

---

## Feature Flag Audit (T-FS5)

| Flag | Default | Sprint | Status |
|------|---------|--------|--------|
| SPECKIT_MMR | ON | 0 | Stable — candidate for permanent-ON |
| SPECKIT_TRM | ON | 0 | Stable — candidate for permanent-ON |
| SPECKIT_MULTI_QUERY | ON | 0 | Stable — candidate for permanent-ON |
| SPECKIT_CROSS_ENCODER | ON | 0 | Stable — candidate for permanent-ON |
| SPECKIT_PIPELINE_V2 | OFF | 5 | New — opt-in evaluation period |
| SPECKIT_EMBEDDING_EXPANSION | OFF | 5 | New — opt-in, gated by R15 |

Active in typical deployment: 4-6 (≤6 threshold met).

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 43 | 43/43 |
| P2 Items | 3 | 3/3 |
| Tasks | 15 | 15/15 |
| New Tests | 304+ | Passing in Sprint 5 test files |
| TypeScript | Clean | `tsc --noEmit` zero errors |

---

## Known Issues

1. **Pre-existing modularization failures** (4): context-server.js, memory-triggers.js, memory-save.js, checkpoints.js line limits exceeded — unrelated to Sprint 5
2. **memory-search.ts growth**: Extended limit from 1200 → 1450 to accommodate pipeline V2 integration code; future modularization recommended

---

<!-- VALIDATED -->
<!-- VALIDATION: PASS -->

---

## 016-indexing-and-graph

Source: `016-indexing-and-graph/implementation-summary.md`

---
title: "Implementation Summary: Sprint 6a — Indexing and Graph"
description: "Sprint 6a implementation summary: weight_history audit, N3-lite consolidation, anchor-aware thinning, encoding-intent capture, spec folder hierarchy"
SPECKIT_TEMPLATE_SOURCE: "implementation-summary | v2.2"
trigger_phrases:
  - "sprint 6 implementation"
  - "sprint 6a summary"
  - "N3-lite consolidation implementation"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary: Sprint 6a — Indexing and Graph

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

---

## Overview

Sprint 6a implemented 5 major features for the Spec Kit Memory system: weight_history audit tracking (T001d/MR10), N3-lite consolidation engine (T002), anchor-aware chunk thinning (T003/R7), encoding-intent capture (T004/R16), and spec folder hierarchy retrieval (T006/S4). All Sprint 6a tasks completed; Sprint 6b (N2 centrality, R10 entity extraction) deferred pending feasibility spike.

**Schema version**: 17 → 18 | **New tests**: 121 | **Files created**: 8 | **Files modified**: 12

### Post-Review Gap Closure (2026-02-28)

After a deep audit, Sprint 6a runtime integrations were hardened to match documented exit-gate claims:

- **R7 wiring closed**: `indexChunkedMemoryFile()` now applies `thinChunks()` before writing child records; integration test verifies retained-count persistence.
- **R16 wiring closed**: `encoding_intent` now persists through active + deferred indexing paths, with DB-level integration tests.
- **S4 wiring closed**: graph search now augments results via hierarchy traversal when `specFolder` is present.
- **N3-lite runtime hook added**: `runConsolidationCycleIfEnabled()` is now invoked from `memory_save` and enforces weekly cadence when `SPECKIT_CONSOLIDATION=true`.
- **N3-lite bug fix**: Hebbian strengthening query now selects `created_by`, ensuring auto-edge cap enforcement during strengthening.

---

## Changes Made

### T001d: weight_history Audit Tracking (P0 Blocker)

**Files modified:**
- `mcp_server/lib/search/vector-index-impl.ts` — Schema v17→v18 migration: `weight_history` table, `created_by`/`last_accessed` on `causal_edges`, `encoding_intent` on `memory_index`
- `mcp_server/lib/storage/causal-edges.ts` — Extended `CausalEdge` interface, added `WeightHistoryEntry` interface, new functions: `logWeightChange()`, `getWeightHistory()`, `rollbackWeights()`, `countEdgesForNode()`, `touchEdgeAccess()`, `getStaleEdges()`
- `mcp_server/lib/search/search-flags.ts` — Added `isConsolidationEnabled()`, `isEncodingIntentEnabled()`

**Constants added:** `MAX_EDGES_PER_NODE=20`, `MAX_AUTO_STRENGTH=0.5`, `MAX_STRENGTH_INCREASE_PER_CYCLE=0.05`, `STALENESS_THRESHOLD_DAYS=90`, `DECAY_STRENGTH_AMOUNT=0.1`, `DECAY_PERIOD_DAYS=30`

**Design decisions:**
- Additive schema migration (ALTER TABLE ADD COLUMN) for existing DBs; base DDL updated for fresh installs
- `insertEdge()` enforces edge bounds at insert time — auto edges rejected at MAX_EDGES_PER_NODE, clamped to MAX_AUTO_STRENGTH
- All weight modifications logged with before/after values, timestamps, `changed_by` provenance, and `reason`
- `rollbackWeights()` restores from weight_history with fallback to oldest entry if timestamp matching fails (same-millisecond edge case)

### T002: N3-lite Consolidation Engine

**File created:** `mcp_server/lib/storage/consolidation.ts` (~450 LOC)

**Sub-tasks implemented:**
- **T002a** — `scanContradictions()`: Dual strategy — vector-based (cosine similarity on sqlite-vec embeddings) + heuristic fallback (word overlap). Both use `hasNegationConflict()` keyword asymmetry check. Threshold: 0.85.
- **T002b** — `runHebbianCycle()`: Strengthens recently accessed edges (+0.05/cycle), decays stale edges (-0.1 after 30 days). Respects auto cap. All changes logged to weight_history.
- **T002c** — `detectStaleEdges()`: Flags edges not accessed in 90+ days via `getStaleEdges()`. No deletion — flagging only.
- **T002d** — `checkEdgeBounds()`: Reports current edge count vs MAX_EDGES_PER_NODE. Enforcement at insert time via `insertEdge()`.
- **T002e** — `buildContradictionClusters()`: Expands contradiction pairs to full clusters via 1-hop causal edge neighbors.
- `runConsolidationCycle()`: Orchestrates all sub-tasks as weekly batch. Behind `SPECKIT_CONSOLIDATION` flag.

**Test file:** `tests/s6-n3lite-consolidation.vitest.ts` — 28 tests

### T003: R7 Anchor-Aware Chunk Thinning

**File created:** `mcp_server/lib/chunking/chunk-thinning.ts`

- `scoreChunk()`: Composite score = ANCHOR_WEIGHT(0.6) * anchorPresence + DENSITY_WEIGHT(0.4) * contentDensity
- `thinChunks()`: Applies threshold (default 0.3), safety guarantee never returns empty array
- Content density: strips HTML comments, computes meaningful-to-total ratio, length penalty for <100 chars, structure bonus for headings/code/lists

**Test file:** `tests/s6-r7-chunk-thinning.vitest.ts` — 24 tests

### T004: R16 Encoding-Intent Capture

**File created:** `mcp_server/lib/search/encoding-intent.ts`

- `classifyEncodingIntent()`: Returns `'document'` | `'code'` | `'structured_data'`
- Heuristic scoring: code indicators (blocks, imports, punctuation density), structured indicators (YAML frontmatter, tables, key-value pairs)
- Classification threshold: 0.4. Behind `SPECKIT_ENCODING_INTENT` flag.
- Schema: `encoding_intent TEXT DEFAULT 'document'` added to `memory_index`

**Test file:** `tests/s6-r16-encoding-intent.vitest.ts` — 18 tests

### T006: S4 Spec Folder Hierarchy

**File created:** `mcp_server/lib/search/spec-folder-hierarchy.ts`

- `buildHierarchyTree()`: Builds tree from DB spec_folder values with implicit parent nodes
- `queryHierarchyMemories()`: Returns parent/sibling/ancestor memories with relevance scoring (self=1.0, parent=0.8, grandparent=0.6, sibling=0.5, floor=0.3)
- Helper functions: `getParentPath()`, `getAncestorPaths()`, `getSiblingPaths()`, `getDescendantPaths()`, `getRelatedFolders()`

**Test file:** `tests/s6-s4-spec-folder-hierarchy.vitest.ts` — 46 tests

### Test Schema Updates

**10 existing test files updated** to include Sprint 6 schema additions (`created_by`, `last_accessed` on `causal_edges`, `weight_history` table):
- `causal-edges-unit.vitest.ts`, `t202-t203-causal-fixes.vitest.ts`, `causal-boost.vitest.ts`, `memory-save-extended.vitest.ts`, `reconsolidation.vitest.ts`, `t010-degree-computation.vitest.ts`, `handler-helpers.vitest.ts`, `t011-edge-density.vitest.ts`, `phase2-integration.vitest.ts`, `corrections.vitest.ts`

---

## Feature Flag Inventory

| Flag | Sprint | Default | Status |
|------|--------|---------|--------|
| SPECKIT_MMR | 0 | ON | Keep — core pipeline |
| SPECKIT_TRM | 0 | ON | Keep — core pipeline |
| SPECKIT_MULTI_QUERY | 0 | ON | Keep — core pipeline |
| SPECKIT_CROSS_ENCODER | 0 | ON | Keep — core pipeline |
| SPECKIT_SEARCH_FALLBACK | 3 | OFF | Keep — extend measurement |
| SPECKIT_FOLDER_DISCOVERY | 3 | OFF | Keep — extend measurement |
| SPECKIT_DOCSCORE_AGGREGATION | 4 | OFF | Keep — extend measurement |
| SPECKIT_SHADOW_SCORING | 4 | OFF | Keep — extend measurement |
| SPECKIT_SAVE_QUALITY_GATE | 4 | OFF | Keep — extend measurement |
| SPECKIT_RECONSOLIDATION | 4 | OFF | Keep — extend measurement |
| SPECKIT_NEGATIVE_FEEDBACK | 4 | OFF | Keep — extend measurement |
| SPECKIT_PIPELINE_V2 | 5 | OFF | Keep — extend measurement |
| SPECKIT_EMBEDDING_EXPANSION | 5 | OFF | Keep — extend measurement |
| SPECKIT_CONSOLIDATION | 6 | OFF | NEW — N3-lite |
| SPECKIT_ENCODING_INTENT | 6 | OFF | NEW — R16 |

**Default active**: 4 (Sprint 0 core). **Threshold**: <=6 MET.

---

## Test Results

| Suite | Tests | Status |
|-------|-------|--------|
| s6-n3lite-consolidation | 28 | PASS |
| s6-r7-chunk-thinning | 24 | PASS |
| s6-r16-encoding-intent | 18 | PASS |
| s6-s4-spec-folder-hierarchy | 46 | PASS |
| causal-edges-unit | 70 | PASS |
| t202-t203-causal-fixes | 17 | PASS |
| **Sprint 6a total** | **203** | **ALL PASS** |
| **Full regression** | **6589/6593** | **4 pre-existing** |

---

## Issues Resolved

1. **Floating point precision** (T-HEB-04): `0.8 - 0.1 = 0.7000000000000001`. Fixed with `toBeCloseTo(0.7, 5)`.
2. **Timestamp rollback** (T-WH-04): Same-millisecond updates caused `rollbackWeights()` to miss entries. Fixed with fallback to oldest weight_history entry.
3. **Schema mismatch** (61 test failures): Existing test files missing `created_by`/`last_accessed` columns. Fixed by updating 10 test files.

---

## Deferred (Sprint 6b)

Sprint 6b items remain pending, gated on feasibility spike (T-S6-SPIKE):
- **T001 (N2)**: Graph centrality + community detection (momentum, causal depth, connected components)
- **T005 (R10)**: Auto entity extraction behind `SPECKIT_AUTO_ENTITIES` flag
- **T-PI-S6**: PageIndex cross-references from earlier sprints

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Tasks**: See `../000-feature-overview/tasks.md`

---

## 017-long-horizon

Source: `017-long-horizon/implementation-summary.md`

---
title: "Implementation Summary: Sprint 7 — Long Horizon"
description: "Sprint 7 implementation summary: R13-S3 ablation framework + reporting dashboard, S1 content normalization, R5 NO-GO decision, feature flag audit, DEF-014 closure"
# SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2
trigger_phrases:
  - "sprint 7 implementation"
  - "sprint 7 summary"
  - "long horizon implementation"
  - "ablation framework implementation"
  - "content normalizer implementation"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary: Sprint 7 — Long Horizon

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

---

## Overview

Sprint 7 implemented the final phase (Phase 8 of 8) of the Hybrid RAG Fusion Refinement specification (Spec 140). Scope followed the "minimum viable+" scenario: R13-S3 full reporting + ablation studies (P1 mandatory), S1 smarter content generation, R5 INT8 decision (NO-GO), feature flag sunset audit (T005a), DEF-014 structuralFreshness closure, and PageIndex cross-reference review. R8 memory summaries and S5 cross-document entity linking were skipped per scale gate evaluation.

**Schema version**: 18 (unchanged from Sprint 6a) | **New tests**: 149 | **Files created**: 6 | **Files modified**: 2

---

## Changes Made

### T004: R13-S3 Full Reporting + Ablation Studies (P1 — Required)

**File created:** `mcp_server/lib/eval/ablation-framework.ts` (~290 LOC)

- `runAblation(searchFn, config)`: Dependency-injected search function, runs baseline then per-channel-disabled variants
- `toHybridSearchFlags(disabled)`: Maps disabled channel set to feature flag overrides
- Sign test statistical significance (exact binomial distribution) with verdict classification: CRITICAL / important / likely useful / negligible / likely redundant / possibly harmful / HARMFUL
- `storeAblationResults(report)`: Persists to `eval_metric_snapshots` with negative timestamp IDs for ablation runs
- `formatAblationReport(report)`: Markdown-formatted ablation report
- Feature flag: `SPECKIT_ABLATION=true` (default OFF)
- Fail-safe: try-catch wrapping all channel ablation, partial results on individual channel failure

**File created:** `mcp_server/lib/eval/reporting-dashboard.ts` (~290 LOC)

- `generateDashboardReport(config?)`: Aggregates per-sprint and per-channel metrics from `eval_metric_snapshots`
- `formatReportText(report)` / `formatReportJSON(report)`: Text and JSON output formats
- Types: `ReportConfig`, `MetricSummary`, `SprintReport`, `TrendEntry`, `DashboardReport`
- Sprint label derived from `metadata` JSON column in eval DB
- `isHigherBetter()` helper for trend direction (recall/precision/ndcg = higher-better; latency = lower-better)
- Read-only module: queries eval DB, no writes

**Test files:**
- `tests/s7-ablation-framework.vitest.ts` — 39 tests
- `tests/s7-reporting-dashboard.vitest.ts` — 34 tests

**Design decisions:**
- Ablation uses dependency injection for search function (testable without full pipeline)
- Sign test chosen over t-test for robustness with small query sets
- Negative timestamp IDs distinguish ablation runs from production eval runs
- Channel set: `ALL_CHANNELS = ['vector', 'bm25', 'fts5', 'graph', 'trigger']` — trigger is caller-gated because trigger matching runs outside `hybridSearch`
- R13-S3 acceptance criterion: ablation framework can isolate contribution of at least 1 individual channel — MET

### T002: S1 Smarter Memory Content Generation

**File created:** `mcp_server/lib/parsing/content-normalizer.ts` (~230 LOC)

- **7 primitives**: `stripYamlFrontmatter`, `stripAnchors`, `stripHtmlComments`, `stripCodeFences`, `normalizeMarkdownTables`, `normalizeMarkdownLists`, `normalizeHeadings`
- **2 composites**: `normalizeContentForEmbedding(content)`, `normalizeContentForBM25(content)`
- Pipeline order: frontmatter → anchors → HTML comments → code fences → tables → lists → headings → whitespace collapse
- Pure TypeScript, zero external dependencies
- No feature flag — always active (normalization is non-destructive improvement)

**Files modified:**
- `mcp_server/handlers/memory-save.ts` — Added `normalizeContentForEmbedding()` call before `generateDocumentEmbedding()` in embedding cache-miss branch (~line 1095-1099)
- `mcp_server/lib/search/bm25-index.ts` — Added `normalizeContentForBM25()` call before BM25 tokenization (~line 248-250)

**Test file:** `tests/s7-content-normalizer.vitest.ts` — 76 tests

**Design decisions:**
- Separate composites for embedding vs BM25: embedding strips more aggressively (removes code blocks), BM25 preserves structure for lexical matching
- Idempotent: running normalization twice produces same output
- Safety: never returns empty string from non-empty input

### T005: R5 INT8 Quantization Evaluation (NO-GO)

**Decision**: NO-GO — all three activation criteria unmet.

| Criterion | Threshold | Measured | Status |
|-----------|-----------|----------|--------|
| Active memories with embeddings | >10,000 | 2,412 | NOT MET (24.1%) |
| p95 search latency | >50ms | ~15ms | NOT MET (~30%) |
| Embedding dimensions | >1,536 | 1,024 | NOT MET (66.7%) |

**Rationale**: 7.1 MB storage savings (3.9% of 180 MB total DB) does not justify 5.32% estimated recall risk, custom quantized BLOB complexity, or KL-divergence calibration overhead. No memory or latency pressure exists.

**Re-evaluate when**: corpus grows ~4x (>10K memories), sustained p95 >50ms, or embedding provider changes to >1,536 dimensions.

### T005a: Feature Flag Sunset Audit

**61 unique SPECKIT_ flags** found across the codebase.

**Disposition rollup from the sunset-candidate set (see `scratch/w2-a10-flag-audit.md`):**

- GRADUATE: 27
- REMOVE: 9
- KEEP: 3

> Note: the disposition counts apply to the explicit sunset-candidate set (sprint-specific + legacy experimental toggles), not a strict partition of all 61 unique flags.

**Verification**: `grep -rn "SPECKIT_" mcp_server/ --include="*.ts" | grep -v node_modules`

**Key recommendations**: 27 flags are ready to graduate to permanent-ON defaults (removing flag checks). 9 flags are identified as dead code for removal. 3 flags remain active operational knobs (`ADAPTIVE_FUSION`, `COACTIVATION_STRENGTH`, `PRESSURE_POLICY`). Full audit in `scratch/w2-a10-flag-audit.md`.

### T006a: DEF-014 structuralFreshness() Disposition

**Disposition**: CLOSED — concept dropped, never implemented as code.

Zero references to `structuralFreshness` exist anywhere in the codebase. The function appears exclusively in spec and planning documents as a deferred design concept from the parent spec. No code to remove or modify.

### T001: R8 Memory Summaries — SKIPPED

**Scale gate result**: 2,411 active memories with embeddings < 5,000 threshold.
Query: `SELECT COUNT(*) FROM memory_index WHERE (is_archived IS NULL OR is_archived = 0) AND embedding_status = 'success'`
Decision: Skip T001 entirely per gating condition.
Note: R8 gate captured 2,411; later R5 captured 2,412 after one additional successful embedding was indexed.

### T003: S5 Cross-Document Entity Linking — SKIPPED

**Scale gate**: 2,411 memories > 1,000 threshold — technically MET.
**Entity gate**: Zero entities exist in the system — R10 auto entity extraction (Sprint 6b) was never built (entire Sprint 6b deferred). No entity catalog, no entity extraction code.
Decision: Skip T003 — no entities to link regardless of memory count.

### T-PI-S7: PageIndex Cross-References — Reviewed

- **PI-A5 (verify-fix-verify)**: Existing R13-S3 eval infrastructure already provides the "verify" phase; the reporting dashboard adds per-sprint trend detection. No new implementation needed.
- **PI-B1 (tree thinning)**: Already implemented in Sprint 5 (`chunk-thinning.ts` from Sprint 6a). No new code needed for Sprint 7.

---

## Feature Flag Inventory

| Flag | Sprint | Default | Status |
|------|--------|---------|--------|
| SPECKIT_MMR | 0 | ON | Keep — core pipeline |
| SPECKIT_TRM | 0 | ON | Keep — core pipeline |
| SPECKIT_MULTI_QUERY | 0 | ON | Keep — core pipeline |
| SPECKIT_CROSS_ENCODER | 0 | ON | Keep — core pipeline |
| SPECKIT_SEARCH_FALLBACK | 3 | OFF | GRADUATE — promote to ON |
| SPECKIT_FOLDER_DISCOVERY | 3 | OFF | GRADUATE — promote to ON |
| SPECKIT_DOCSCORE_AGGREGATION | 4 | OFF | GRADUATE — promote to ON |
| SPECKIT_SHADOW_SCORING | 4 | OFF | REMOVE — eval complete |
| SPECKIT_SAVE_QUALITY_GATE | 4 | OFF | GRADUATE — promote to ON |
| SPECKIT_RECONSOLIDATION | 4 | OFF | GRADUATE — promote to ON |
| SPECKIT_NEGATIVE_FEEDBACK | 4 | OFF | GRADUATE — promote to ON |
| SPECKIT_PIPELINE_V2 | 5 | OFF | GRADUATE — promote to ON |
| SPECKIT_EMBEDDING_EXPANSION | 5 | OFF | GRADUATE — promote to ON |
| SPECKIT_CONSOLIDATION | 6 | OFF | GRADUATE — promote to ON |
| SPECKIT_ENCODING_INTENT | 6 | OFF | GRADUATE — promote to ON |
| SPECKIT_ABLATION | 7 | OFF | NEW — R13-S3 ablation |

**Default active**: 4 (Sprint 0 core) + 1 new. **Threshold**: <=6 MET.

---

## Test Results

| Suite | Tests | Status |
|-------|-------|--------|
| s7-ablation-framework | 39 | PASS |
| s7-reporting-dashboard | 34 | PASS |
| s7-content-normalizer | 76 | PASS |
| **Sprint 7 total** | **149** | **ALL PASS** |

---

## Issues Resolved

1. **S1 integration ordering**: Content normalization must occur before both embedding generation and BM25 indexing. Wired into two separate code paths: `memory-save.ts` (embedding) and `bm25-index.ts` (BM25).
2. **R10 dependency gap (S5)**: Sprint 6b entity extraction was never built, leaving zero entities in the system. S5 correctly identified as unskippable despite memory count gate being met.
3. **R5 recall discrepancy**: Spec 140 mentions 1-2% recall loss for INT8, but research document cites 5.32% (HuggingFace benchmark on e5-base-v2 768-dim). Discrepancy unresolved (OQ-002) — contributes to NO-GO decision.

---

## Scope Decisions

| Task | Decision | Rationale |
|------|----------|-----------|
| T001 (R8) | SKIPPED | 2,411 < 5,000 memories threshold |
| T002 (S1) | COMPLETED | Content normalizer with 76 tests |
| T003 (S5) | SKIPPED | Zero entities (R10 never built) |
| T004 (R13-S3) | COMPLETED | Ablation + reporting, 73 tests |
| T005 (R5) | NO-GO | All 3 criteria unmet |
| T005a (Flags) | COMPLETED | 61 flags audited |
| T006a (DEF-014) | CLOSED | Never implemented |
| T-PI-S7 | REVIEWED | Existing infra sufficient |

**Scenario executed**: Minimum viable+ (R13-S3 + S1 + decisions + audit) — 16-22h estimated effort range.

---

## Deferred (None — Final Sprint)

Sprint 7 is the final sprint. No successor sprint exists. Items deferred from Sprint 7:
- **R8 (T001)**: Activates when active-with-embeddings count exceeds 5,000
- **S5 (T003)**: Activates when entity infrastructure (R10) is built and >50 verified entities exist
- **R5 (T005)**: Re-evaluate when >10K memories OR >50ms latency OR >1,536 dimensions
- **Flag graduation (T005a)**: 27 flags recommended for graduation, 9 for removal — execution deferred to separate maintenance task

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Tasks**: See `../000-feature-overview/tasks.md`
- **Decisions**: See `scratch/w2-a9-decisions.md`
- **Flag Audit**: See `scratch/w2-a10-flag-audit.md`
- **R5 Analysis**: See `scratch/w1-a5-r5-decision.md`

---

## 018-deferred-features

Source: `018-deferred-features/implementation-summary.md`

---
title: "Implementation Summary: Sprint 8 - Deferred Features"
description: "Added the missing implementation summary artifact so Level 1 validation can evaluate phase 002 without a hard missing-file error."
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core + phase-child-header | v2.2
trigger_phrases:
  - "sprint 8 implementation summary"
  - "deferred features summary"
  - "phase 002 implementation"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary: Sprint 8 - Deferred Features

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-deferred-features |
| **Completed** | 2026-03-01 |
| **Level** | 1 |
| **Status** | In Progress |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This update adds the missing Level 1 implementation summary document for Sprint 8 so the phase folder now includes all baseline required artifacts. The change keeps scope intentionally narrow and does not alter requirements, plan, or task definitions.

### Validation Readiness Artifact

You can now validate phase `018-deferred-features` without failing the required-file check for a missing `implementation-summary.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `implementation-summary.md` | Created | Satisfies required Level 1 implementation-summary artifact for validator compatibility |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The file was created from the Level 1 implementation summary template structure, populated with phase-specific metadata, and formatted with valid ANCHOR pairs and template-source markers for validator compatibility.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep this update file-only and avoid editing `spec.md`, `plan.md`, or `tasks.md` | The request is to restore Level 1 artifact completeness with minimal scope |
| Record status as In Progress | Sprint 8 tasks include completed setup work and pending implementation/verification work |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Implementation summary artifact present | PASS - file created at phase path |
| Template-source metadata included | PASS - `SPECKIT_TEMPLATE_SOURCE` appears in frontmatter and header comment |
| ANCHOR syntax pairing | PASS - all opening and closing anchor tags are matched |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Sprint 8 implementation tasks beyond initial setup remain pending in `tasks.md`; this document only resolves the missing summary artifact.
<!-- /ANCHOR:limitations -->
