# Iteration 2: Scoring System Deep Dive

## Focus
Deep analysis of the scoring subsystem: cataloging all scoring signals and their weights, tracing the 3 separate score resolution chains for consistency, and determining whether weights are data-driven or hardcoded.

## Findings

### Finding 1: Three Score Resolution Chains Have DIFFERENT Fallback Orders (BUG CONFIRMED)

The iteration-001 hypothesis is confirmed. There are three distinct functions that resolve "the best score" from a pipeline row, and they use **different field precedence orders**:

| Function | Location | Fallback Order | Clamps to [0,1]? |
|----------|----------|---------------|-------------------|
| `resolveEffectiveScore()` | types.ts:58 | intentAdjustedScore -> rrfScore -> score -> similarity/100 | YES |
| `compareDeterministicRows()` | ranking-contract.ts:36-49 | **score** -> intentAdjustedScore -> rrfScore -> similarity/100 | NO (raw compare) |
| `extractScoringValue()` | stage4-filter.ts:211 | **rrfScore** -> intentAdjustedScore -> score -> similarity (RAW, not /100) | NO |

**Critical discrepancy**: `compareDeterministicRows` checks `score` FIRST, while the other two check either `intentAdjustedScore` or `rrfScore` first. This means sorting via `sortDeterministicRows()` (used at the end of Stage 2) may produce a different ordering than what `resolveEffectiveScore()` would give for the same rows.

**Additionally**: `extractScoringValue` does NOT divide similarity by 100, while the other two do. If a row has only a raw `similarity` field (e.g., 85 for 85%), `extractScoringValue` returns 85 while the others return 0.85. This directly affects the evidence-gap detection in Stage 4 (TRM module) since it compares extracted scores to detect score distribution gaps.

[SOURCE: types.ts:58-68, ranking-contract.ts:36-49, stage4-filter.ts:211-216]

### Finding 2: All 15+ Scoring Weights Are Hardcoded Constants (No Data-Driven Calibration)

Every single scoring weight in the system is a hardcoded constant. There is no calibration mechanism, no A/B test framework for weights, and no historical optimization. Complete catalog:

**RRF Fusion Layer (rrf-fusion.ts)**:
| Constant | Value | Line | Origin/Justification |
|----------|-------|------|---------------------|
| `DEFAULT_K` | 60 | :36 | Literature (SIGIR 2009 Cormack et al.) |
| `CONVERGENCE_BONUS` | 0.10 | :37 | Hardcoded, no citation |
| `GRAPH_WEIGHT_BOOST` | 1.5 | :40 | AI-WHY comment: "graph edges encode curated human decisions" |
| `termMatchBonus` | 0.05 | :301 | Hardcoded default, overridable per-call |

**Composite Scoring Layer (composite-scoring.ts)**:
| Constant | Value | Line | Notes |
|----------|-------|------|-------|
| 5-Factor weights | temporal=0.25, usage=0.15, importance=0.25, pattern=0.20, citation=0.15 | :120-126 | Hardcoded, sum=1.0 |
| Legacy 6-factor weights | similarity=0.30, importance=0.25, recency=0.10, popularity=0.15, tierBoost=0.05, retrievability=0.15 | :129-136 | Hardcoded, sum=1.0 |
| IMPORTANCE_MULTIPLIERS | constitutional=2.0, critical=1.5, important=1.3, normal=1.0, temporary=0.6, deprecated=0.1 | :185-192 | Hardcoded |
| DOCUMENT_TYPE_MULTIPLIERS | spec=1.4, decision_record=1.4, plan=1.3, tasks=1.1, constitutional=2.0, scratch=0.6 | :201-212 | Hardcoded |
| PATTERN_ALIGNMENT_BONUSES | exact=0.3, partial=0.15, semantic=0.8, anchor=0.25, type=0.2 | :215-221 | Hardcoded |
| CITATION_DECAY_RATE | 0.1 | :195 | Hardcoded |
| CITATION_MAX_DAYS | 90 | :196 | Hardcoded |

**FSRS/Retrievability Layer**:
| Constant | Value | Line | Notes |
|----------|-------|------|-------|
| FSRS_FACTOR | 19/81 (~0.2346) | :143 | Literature (FSRS v4 paper) |
| FSRS_DECAY | -0.5 | :144 | Literature (FSRS v4 paper) |
| RETRIEVABILITY_TIER_MULTIPLIER | constitutional=0.1...scratch=3.0 | :146-153 | Hardcoded |
| CLASSIFICATION_CONTEXT_STABILITY | decision=Infinity, research=2.0, impl=1.0 | :155-161 | Hardcoded |
| CLASSIFICATION_TIER_STABILITY | constitutional=Infinity, critical=Infinity... | :163-171 | Hardcoded |

**Stage 2 Pipeline Layer**:
| Constant | Value | Line | Notes |
|----------|-------|------|-------|
| STAGE2_GRAPH_BONUS_CAP | 0.03 | ranking-contract.ts:11 | Hardcoded |
| SPREAD_ACTIVATION_TOP_N | 5 | stage2-fusion.ts:102 | Hardcoded |
| MIN_VALIDATION_MULTIPLIER | 0.8 | stage2-fusion.ts:104 | Hardcoded |
| MAX_VALIDATION_MULTIPLIER | 1.2 | stage2-fusion.ts:105 | Hardcoded |
| qualityFactor range | [0.9, 1.1] | stage2-fusion.ts:133 | Formula: 0.9 + quality * 0.2 |
| specLevelBonus | max 0.06 | stage2-fusion.ts:134-136 | (specLevel-1) * 0.02, capped |
| completionBonus | 0.04 (complete), 0.015 (partial) | stage2-fusion.ts:138-142 | Hardcoded |
| checklistBonus | 0.01 | stage2-fusion.ts:144 | Hardcoded |

**Total: 30+ distinct hardcoded scoring constants** across 4 layers. Only 2 have literature citations (DEFAULT_K=60 from SIGIR 2009, FSRS constants from FSRS v4). The rest appear to be engineering judgment.

[SOURCE: composite-scoring.ts:120-221, rrf-fusion.ts:36-40, ranking-contract.ts:11, stage2-fusion.ts:102-144]

### Finding 3: RSF Fusion Is Dormant/Shadow-Only (Not a Live Scoring Path)

The RSF (Relative Score Fusion) module header explicitly states: "Status: DORMANT / Shadow-only." It is NOT used in the live search pipeline. The `isRsfEnabled()` feature flag was already removed as dead code. RSF scores are only recorded in `Sprint3PipelineMeta.rsfShadow` for offline evaluation against RRF via Kendall tau correlation. This means the system currently has only ONE live fusion algorithm (RRF), not two as the architecture might suggest.

[SOURCE: rsf-fusion.ts:1-24]

### Finding 4: Intent Weight Application Has a Double-Counting Guard (G2 Prevention)

Stage 2 has an explicit architectural guard against applying intent weights to hybrid search results. The comment on line 35-38 of stage2-fusion.ts explains: "Hybrid search (RRF/RSF fusion) already incorporates intent-weighted signals during fusion. Calling this on hybrid results would double-count intent." The `applyIntentWeightsToResults` function is only called for non-hybrid search types (vector, multi-concept). This is well-documented with both code comments and the G2 label.

[SOURCE: stage2-fusion.ts:35-38, stage2-fusion.ts:293-348]

### Finding 5: Score Alias Synchronization Creates an Unusual Pattern

Stage 2 uses `withSyncedScoreAliases()` (stage2-fusion.ts:165-173) which sets ALL score fields (`score`, `rrfScore`, `intentAdjustedScore`, `attentionScore`) to the same value. There is also `syncScoreAliasesInPlace()` (lines 175-182) for bulk in-place sync. This means that after Stage 2 completes, all 4 score fields should contain the same value, which would make the different fallback orders in the 3 resolution functions moot -- BUT only if synchronization is always called. If any code path skips sync (e.g., error paths, early returns), the divergent fallback orders become a live bug.

[SOURCE: stage2-fusion.ts:165-182]

### Finding 6: RRF K=60 Is Overridable via Environment Variable but No Other Weight Is

The RRF smoothing constant K can be overridden via `SPECKIT_RRF_K` env var (rrf-fusion.ts:129-143). Score normalization can be toggled via `SPECKIT_SCORE_NORMALIZATION` (rrf-fusion.ts:464-466). Classification decay can be toggled via `SPECKIT_CLASSIFICATION_DECAY`. But none of the 25+ other weights (convergence bonus, graph boost, 5-factor weights, importance multipliers, etc.) are runtime-configurable. This makes it impossible to tune the system without code changes.

[SOURCE: rrf-fusion.ts:129-143, rrf-fusion.ts:464-466, composite-scoring.ts:272]

### Finding 7: Two Parallel Scoring Models Coexist (5-Factor vs Legacy 6-Factor)

The composite scoring module maintains two complete scoring models side by side:
- **5-Factor Decay Composite**: temporal(0.25) + usage(0.15) + importance(0.25) + pattern(0.20) + citation(0.15) = 1.0
- **Legacy 6-Factor**: similarity(0.30) + importance(0.25) + recency(0.10) + popularity(0.15) + tierBoost(0.05) + retrievability(0.15) = 1.0

The selection is via `use_five_factor_model` option in `ScoringOptions` (line 72). Both models share some underlying calculations (importance uses the same multipliers) but diverge in how they handle temporal signals (FSRS retrievability vs simple recency). Maintaining two models increases code complexity and testing surface without clear documentation of which is used when.

[SOURCE: composite-scoring.ts:49-55, composite-scoring.ts:57-64, composite-scoring.ts:68-73, composite-scoring.ts:120-136]

### Finding 8: Validation Signal Scoring Adds 4 More Sub-Signals in Stage 2

The `applyValidationSignalScoring` function (stage2-fusion.ts:121-153) adds quality metadata into scoring via a multiplicative approach: `qualityFactor` (0.9-1.1) + `specLevelBonus` (0-0.06) + `completionBonus` (0-0.04) + `checklistBonus` (0-0.01), all clamped to [0.8, 1.2] as a multiplier. This is a secondary scoring layer applied on top of the composite score, meaning total effective signals exceed 15.

[SOURCE: stage2-fusion.ts:121-153]

### Finding 9: The 12-Step Signal Application Order Is Strictly Documented

Stage 2 documents a precise 12-step signal application order (stage2-fusion.ts lines 20-33): session boost -> causal boost -> co-activation -> community co-retrieval -> graph signals -> FSRS testing effect -> intent weights -> artifact routing -> feedback signals -> artifact limiting -> anchor metadata -> validation metadata. The comment explicitly states "must not be reordered." This is a positive architectural decision, but the ordering is enforced only by code position, not by a framework or contract.

[SOURCE: stage2-fusion.ts:20-33]

### Finding 10: Cross-Variant Convergence Bonus Stacks Multiplicatively

In `fuseResultsCrossVariant` (rrf-fusion.ts:378-447), when multi-query RAG is used, the same memory appearing in N query variants gets `CONVERGENCE_BONUS * (N-1)` added as a bonus. Combined with the within-variant convergence bonus from `fuseResultsMulti`, a memory appearing in 3 channels across 3 variants would get: up to 0.10 * 2 (within-variant) per variant, plus 0.10 * 2 (cross-variant) = potentially +0.40 total convergence bonus on top of its base RRF score. This is significant and could dominate the ranking for highly-confirmed results.

[SOURCE: rrf-fusion.ts:266-276, rrf-fusion.ts:428-436]

## Sources Consulted
- `rrf-fusion.ts` (full file, 540 lines) -- RRF fusion algorithms and constants
- `rsf-fusion.ts` (full file, 431 lines) -- RSF shadow-mode fusion
- `composite-scoring.ts` (lines 1-400) -- Composite scoring models and constants
- `stage2-fusion.ts` (lines 1-350) -- Stage 2 pipeline scoring integration
- `ranking-contract.ts` (full file, 69 lines) -- Deterministic ranking and graph bonus cap
- `types.ts` (lines 28-88) -- Score resolution function and types
- `stage4-filter.ts` (lines 185-365) -- Stage 4 score extraction function

## Assessment
- New information ratio: 1.0
- Questions addressed: Q2 (scoring calibration), partially Q1 (pipeline score flow), partially Q4 (dead code: RSF dormant)
- Questions answered: Q2 is substantially answered -- all weights are hardcoded, no data-driven calibration exists

## Reflection
- What worked and why: Reading the three score-resolution functions side by side revealed the divergent fallback orders immediately. Starting from rrf-fusion.ts gave the RRF constants, then composite-scoring.ts gave the full weight catalog, and stage2-fusion.ts showed how they integrate.
- What did not work and why: N/A -- all reads were productive this iteration.
- What I would do differently: Could have also checked the intent-classifier.ts intent weight tables for per-intent weight overrides, which feed into applyIntentWeightsToResults. This is a natural extension for a future iteration.

## Recommended Next Focus
Iteration 3: Graph channel and search subsystem status -- investigate the graph channel's NULL state, dead code paths in graph-related modules, the community detection and graph signals modules referenced in Stage 2. Also check intent-classifier.ts for the per-intent weight configurations that feed into the scoring system.
