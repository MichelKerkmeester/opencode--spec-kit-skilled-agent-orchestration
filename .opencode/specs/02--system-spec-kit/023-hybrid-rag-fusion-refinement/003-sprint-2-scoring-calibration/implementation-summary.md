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
- R18 cache has no automatic eviction policy by default; `evictOldEntries()` must be called explicitly
- G2 double intent weighting investigation and FUT-5 K-value sensitivity are tracked in requirements but not detailed in implementation files reviewed

## Exit Gate Status
| Gate | Criterion | Result |
|------|-----------|--------|
| 1 | R18 cache hit >90% on re-index of unchanged content | PASS |
| 2 | N4 dark-run passes -- new memories visible, old results not displaced | PASS |
| 3 | Score distributions normalized to [0,1] range | PASS |
| 4 | TM-01 interference penalty active; no false penalties on distinct content | PASS |
| 5 | TM-03 classification-based decay operational; constitutional/critical never decay | PASS |
| 6 | Scoring observability logging at 5% sample rate | PASS |
