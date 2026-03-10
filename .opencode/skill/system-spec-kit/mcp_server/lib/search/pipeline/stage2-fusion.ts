// ---------------------------------------------------------------
// MODULE: Stage2 Fusion
// ---------------------------------------------------------------
// AI-GUARD: Sprint 5 (R6): 4-Stage Retrieval Pipeline
//
// I/O CONTRACT:
//   Input:  Stage2Input { candidates: PipelineRow[], config, stage1Metadata }
//   Output: Stage2Output { scored: PipelineRow[], metadata }
//   Key invariants:
//     - Every score modification in the pipeline happens exactly once here
//     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
//     - scored is sorted descending by effective composite score on exit
//   Side effects:
//     - FSRS write-back to memory_index (when trackAccess=true) — DB write
//     - Learned trigger and negative-feedback reads from DB
//
// PURPOSE: Single point for ALL scoring signals. Intent weights are
// applied ONCE here only — this is the architectural guard against
// the G2 double-weighting recurrence bug.
//
// SIGNAL APPLICATION ORDER (must not be reordered — 12 steps):
//   1.  Session boost           — working-memory attention amplification
//   2.  Causal boost            — graph-traversal neighbor amplification
//   2a. Co-activation spreading — spreading activation from top-N seeds
//   2b. Community co-retrieval  — N2c inject community co-members
//   2c. Graph signals           — N2a momentum + N2b causal depth
//   3.  Testing effect          — FSRS strengthening write-back (trackAccess)
//   4.  Intent weights          — non-hybrid search post-scoring adjustment
//   5.  Artifact routing        — class-based weight boosts
//   6.  Feedback signals        — learned trigger boosts + negative demotions
//   7.  Artifact limiting       — result count cap from routing strategy
//   8.  Anchor metadata         — extract named ANCHOR sections (annotation)
//   9.  Validation metadata     — spec quality signals enrichment + quality scoring
//
// AI-INVARIANT: Hybrid search already applies intent-aware scoring
// internally (RRF / RSF fusion). Post-search intent weighting is
// therefore ONLY applied for non-hybrid search types (vector,
// multi-concept). Applying it to hybrid results would double-count.
//
// SCORE IMMUTABILITY INVARIANT: Once a score field is written during
// fusion (steps 1–7 above), it must not be overwritten by later stages.
// Stage 3 (rerank) and Stage 4 (post-processing) MUST introduce new
// score fields (e.g. rerankScore, finalScore) rather than mutating the
// existing `score` produced here. This preserves auditability and
// prevents silent ranking regressions caused by in-place score mutation.

import type Database from 'better-sqlite3';

import { resolveEffectiveScore } from './types';
import type { Stage2Input, Stage2Output, PipelineRow, IntentWeightsConfig, ArtifactRoutingConfig } from './types';

import * as sessionBoost from '../session-boost';
import * as causalBoost from '../causal-boost';
import { isEnabled as isCoActivationEnabled, spreadActivation, CO_ACTIVATION_CONFIG } from '../../cache/cognitive/co-activation';
import type { SpreadResult } from '../../cache/cognitive/co-activation';
import * as fsrsScheduler from '../../cache/cognitive/fsrs-scheduler';
import { queryLearnedTriggers } from '../learned-feedback';
import { applyNegativeFeedback, getNegativeFeedbackStats } from '../../scoring/negative-feedback';
import { isNegativeFeedbackEnabled, isCommunityDetectionEnabled, isGraphSignalsEnabled } from '../search-flags';
import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
import { requireDb } from '../../../utils/db-helpers';
import { computeRecencyScore } from '../../scoring/folder-scoring';
import { enrichResultsWithAnchorMetadata } from '../anchor-metadata';
import { enrichResultsWithValidationMetadata } from '../validation-metadata';
import { applyCommunityBoost } from '../../graph/community-detection';
import { applyGraphSignals } from '../../graph/graph-signals';

// -- Internal type aliases --

/** A row with a resolved numeric base score for internal use. */
interface ScoredRow extends PipelineRow {
  intentAdjustedScore?: number;
}

/** Result of the strengthenOnAccess FSRS write-back. */
interface StrengthenResult {
  stability: number;
  difficulty: number;
}

interface ValidationMetadataLike {
  qualityScore?: number;
  specLevel?: number;
  completionStatus?: 'complete' | 'partial' | 'unknown';
  hasChecklist?: boolean;
}

// -- Constants --

/** Number of top results used as seeds for co-activation spreading. */
const SPREAD_ACTIVATION_TOP_N = 5;

const MIN_VALIDATION_MULTIPLIER = 0.8;
const MAX_VALIDATION_MULTIPLIER = 1.2;

function clampMultiplier(value: number): number {
  if (!Number.isFinite(value)) return 1;
  if (value < MIN_VALIDATION_MULTIPLIER) return MIN_VALIDATION_MULTIPLIER;
  if (value > MAX_VALIDATION_MULTIPLIER) return MAX_VALIDATION_MULTIPLIER;
  return value;
}

/**
 * Apply validation-signal scoring at the Stage 2 single scoring point.
 *
 * Uses quality metadata extracted from spec artifacts to apply a bounded
 * multiplier over the current composite score. This keeps S3 integrated
 * in ranking while preserving score stability.
 */
function applyValidationSignalScoring(results: PipelineRow[]): PipelineRow[] {
  if (!Array.isArray(results) || results.length === 0) return results;

  const adjusted = results.map((row) => {
    const metadata = row.validationMetadata as ValidationMetadataLike | undefined;
    if (!metadata || typeof metadata !== 'object') return row;

    const baseScore = resolveBaseScore(row);
    const quality = typeof metadata.qualityScore === 'number' && Number.isFinite(metadata.qualityScore)
      ? Math.max(0, Math.min(1, metadata.qualityScore))
      : 0.5;

    const qualityFactor = 0.9 + (quality * 0.2); // [0.9, 1.1]
    const specLevelBonus = typeof metadata.specLevel === 'number' && Number.isFinite(metadata.specLevel)
      ? Math.max(0, Math.min(0.06, (metadata.specLevel - 1) * 0.02))
      : 0;

    const completionBonus = metadata.completionStatus === 'complete'
      ? 0.04
      : metadata.completionStatus === 'partial'
        ? 0.015
        : 0;

    const checklistBonus = metadata.hasChecklist ? 0.01 : 0;
    const multiplier = clampMultiplier(qualityFactor + specLevelBonus + completionBonus + checklistBonus);
    const scored = Math.min(1, Math.max(0, baseScore * multiplier));

    if (scored === baseScore) return row;
    return withSyncedScoreAliases(row, scored);
  });

  return adjusted.sort((a, b) => resolveBaseScore(b) - resolveBaseScore(a));
}

// -- Internal helpers --

/**
 * AI-WHY: Fix #11 (017-refinement-phase-6) — Replaced with shared resolveEffectiveScore()
 * from types.ts. The shared function uses the correct fallback chain:
 * intentAdjustedScore → rrfScore → score → similarity/100, all clamped to [0,1].
 * This alias ensures all call sites use the shared implementation.
 */
const resolveBaseScore = resolveEffectiveScore;

function withSyncedScoreAliases(row: PipelineRow, score: number): PipelineRow {
  return {
    ...row,
    score,
    rrfScore: score,
    intentAdjustedScore: score,
    attentionScore: score,
  };
}

function syncScoreAliasesInPlace(rows: PipelineRow[]): void {
  for (const row of rows) {
    if (typeof row.score !== 'number' || !Number.isFinite(row.score)) continue;
    row.rrfScore = row.score;
    row.intentAdjustedScore = row.score;
    row.attentionScore = row.score;
  }
}

/**
 * Write an FSRS strengthening update for a single memory access.
 *
 * Mirrors the `strengthenOnAccess` logic from the legacy memory-search
 * handler. Uses GRADE_GOOD with a difficulty bonus inversely proportional
 * to current retrievability, so low-retrievability memories receive the
 * largest stability boost.
 *
 * @param db             - Active SQLite connection
 * @param memoryId       - ID of the memory being strengthened
 * @param retrievability - Current retrievability R(t) in [0, 1]
 */
function strengthenOnAccess(
  db: Database.Database,
  memoryId: number,
  retrievability: number
): StrengthenResult | null {
  if (typeof memoryId !== 'number' || !Number.isFinite(memoryId)) return null;

  const clampedR = (typeof retrievability === 'number' && retrievability >= 0 && retrievability <= 1)
    ? retrievability
    : 0.9;

  try {
    const memory = db.prepare(
      'SELECT stability, difficulty, review_count FROM memory_index WHERE id = ?'
    ).get(memoryId) as Record<string, unknown> | undefined;

    if (!memory) return null;

    const grade = fsrsScheduler.GRADE_GOOD;
    const difficultyBonus = Math.max(0, (0.9 - clampedR) * 0.5);

    const newStability = fsrsScheduler.updateStability(
      (memory.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY,
      (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
      grade,
      clampedR
    ) * (1 + difficultyBonus);

    db.prepare(`
      UPDATE memory_index
      SET stability = ?,
          last_review = CURRENT_TIMESTAMP,
          review_count = review_count + 1,
          access_count = access_count + 1,
          last_accessed = ?
      WHERE id = ?
    `).run(newStability, Date.now(), memoryId);

    return { stability: newStability, difficulty: (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[stage2-fusion] strengthenOnAccess failed for id ${memoryId}: ${message}`);
    return null;
  }
}

// -- Exported internal functions (also exposed via __testables) --

/**
 * Apply intent-based weights to search results.
 *
 * G2 PREVENTION: This function is ONLY called for non-hybrid search types.
 * Hybrid search (RRF / RSF) already incorporates intent-weighted signals
 * during fusion. Calling this on hybrid results would double-count intent.
 *
 * Weight combination:
 *   intentScore = similarity * w.similarity + importance * w.importance + recency * w.recency
 *
 * Similarity is normalised from the raw 0–100 scale to 0–1 before the
 * weighted combination so all three dimensions operate on the same scale.
 * Results are sorted descending by intentAdjustedScore.
 *
 * @param results - Pipeline rows to score
 * @param weights - Intent weight configuration {similarity, importance, recency}
 * @returns New array sorted by intentAdjustedScore descending
 */
function applyIntentWeightsToResults(
  results: PipelineRow[],
  weights: IntentWeightsConfig
): PipelineRow[] {
  if (!Array.isArray(results) || results.length === 0) return results;
  if (!weights) return results;

  const scored: ScoredRow[] = results.map((row) => {
    // Normalise similarity from 0–100 to 0–1 for proper weight combination
    const similarityRaw = typeof row.similarity === 'number' && Number.isFinite(row.similarity)
      ? row.similarity
      : resolveBaseScore(row) * 100; // fall back to base score rescaled

    const similarity = Math.max(0, Math.min(1, similarityRaw / 100));
    const importance = typeof row.importance_weight === 'number' && Number.isFinite(row.importance_weight)
      ? row.importance_weight
      : 0.5;

    // Recency: use created_at as the timestamp (ISO string stored in DB)
    const recencyTimestamp = (row.created_at as string | undefined) ?? '';
    const importanceTier = (row.importance_tier as string | undefined) ?? 'normal';
    const recency = computeRecencyScore(recencyTimestamp, importanceTier);

    const intentScore =
      similarity * weights.similarity +
      importance * weights.importance +
      recency * weights.recency;

    return {
      ...row,
      intentAdjustedScore: intentScore,
    };
  });

  return scored.sort((a, b) => {
    const aScore = typeof a.intentAdjustedScore === 'number' ? a.intentAdjustedScore : 0;
    const bScore = typeof b.intentAdjustedScore === 'number' ? b.intentAdjustedScore : 0;
    if (bScore === aScore) return (a.id ?? 0) - (b.id ?? 0);
    return bScore - aScore;
  });
}

/**
 * Apply artifact routing weight boosts to results.
 *
 * When the routing system detected a known artifact class with non-zero
 * confidence, the class strategy's `boostFactor` is applied to the
 * current composite score (`score`, then `rrfScore`, then `similarity`).
 * Results are re-sorted by score descending after boosting.
 *
 * @param results       - Pipeline rows to boost
 * @param routingResult - Artifact routing configuration from Stage 1
 * @returns New array with updated scores, sorted descending
 */
function applyArtifactRouting(
  results: PipelineRow[],
  routingResult: ArtifactRoutingConfig
): PipelineRow[] {
  if (!Array.isArray(results) || results.length === 0) return results;
  if (!routingResult || routingResult.confidence <= 0) return results;

  // Obtain boostFactor from the strategy object (passed through config)
  const strategy = routingResult.strategy as { boostFactor?: number; maxResults?: number };
  const boostFactor = typeof strategy?.boostFactor === 'number'
    ? Math.max(0, Math.min(2, strategy.boostFactor))
    : 1.0;

  if (boostFactor === 1.0) {
    // No boost; still re-sort for consistency
    return [...results].sort((a, b) => resolveBaseScore(b) - resolveBaseScore(a));
  }

  const boosted = results.map((row) => {
    const baseScore = resolveBaseScore(row);
    const boostedScore = baseScore * boostFactor;
    return {
      ...withSyncedScoreAliases(row, boostedScore),
      artifactBoostApplied: boostFactor,
    };
  });

  return boosted.sort((a, b) => resolveBaseScore(b) - resolveBaseScore(a));
}

/**
 * Apply feedback signals — learned trigger boosts and negative feedback demotions.
 *
 * Learned triggers: each memory that matches the query's learned terms receives
 * a proportional boost to its score (capped at 1.0). The boost magnitude uses
 * `match.weight` directly because queryLearnedTriggers already applies the
 * configured learned-trigger weighting (0.7x).
 *
 * Negative feedback: memories with wasUseful=false validations receive a
 * confidence-multiplier demotion. The multiplier is batch-loaded from the DB
 * then applied via applyNegativeFeedback. Feature-gated via
 * SPECKIT_NEGATIVE_FEEDBACK env var.
 *
 * @param results - Pipeline rows to adjust
 * @param query   - Original search query (used for learned trigger matching)
 * @returns New array with feedback-adjusted scores
 */
function applyFeedbackSignals(
  results: PipelineRow[],
  query: string
): PipelineRow[] {
  if (!Array.isArray(results) || results.length === 0) return results;

  let db: Database.Database | null = null;
  try {
    db = requireDb();
  } catch (error: unknown) {
    if (error instanceof Error) {
      // AI-WHY: DB not available — skip feedback signals gracefully
      return results;
    }
    // AI-WHY: DB not available — skip feedback signals gracefully
    return results;
  }

  // -- Learned trigger boosts --
  let learnedBoostMap = new Map<number, number>();
  try {
    const learnedMatches = queryLearnedTriggers(query, db as Parameters<typeof queryLearnedTriggers>[1]);
    for (const match of learnedMatches) {
      const boost = match.weight;
      const existing = learnedBoostMap.get(match.memoryId) ?? 0;
      learnedBoostMap.set(match.memoryId, Math.max(existing, boost));
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[stage2-fusion] learned trigger query failed: ${message}`);
    learnedBoostMap = new Map();
  }

  // -- Negative feedback stats (batch load) --
  let negativeFeedbackStats = new Map<number, { negativeCount: number; lastNegativeAt: number | null }>();
  if (isNegativeFeedbackEnabled()) {
    try {
      const memoryIds = results.map((r) => r.id);
      negativeFeedbackStats = getNegativeFeedbackStats(db as Parameters<typeof getNegativeFeedbackStats>[0], memoryIds);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] negative feedback stats failed: ${message}`);
    }
  }

  // -- Apply combined adjustments --
  return results.map((row) => {
    let currentScore = resolveBaseScore(row);

    // Apply learned trigger boost (additive to base score, capped at 1.0)
    const learnedBoost = learnedBoostMap.get(row.id) ?? 0;
    if (learnedBoost > 0) {
      currentScore = Math.min(1.0, currentScore + learnedBoost);
    }

    // Apply negative feedback demotion (multiplicative confidence multiplier)
    if (isNegativeFeedbackEnabled()) {
      const negStats = negativeFeedbackStats.get(row.id);
      if (negStats && negStats.negativeCount > 0) {
        currentScore = applyNegativeFeedback(
          currentScore,
          negStats.negativeCount,
          negStats.lastNegativeAt
        );
      }
    }

    if (currentScore === resolveBaseScore(row)) return row;

    return withSyncedScoreAliases(row, currentScore);
  });
}

/**
 * Apply FSRS testing effect (strengthening write-back) for all accessed memories.
 *
 * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
 * unintended write side-effects during read-only searches).
 *
 * For each result, the current retrievability R(t) is computed from the stored
 * stability and last_review fields, then `strengthenOnAccess` fires an FSRS
 * GRADE_GOOD update — increasing stability proportional to how much the memory
 * needed the review.
 *
 * Errors per-row are caught and logged; they do not abort the full set.
 *
 * @param db      - Active SQLite database connection
 * @param results - Pipeline rows that were accessed
 */
function applyTestingEffect(
  db: Database.Database,
  results: PipelineRow[]
): void {
  if (!db || !Array.isArray(results) || results.length === 0) return;

  for (const row of results) {
    try {
      const lastReview = (row.last_review as string | undefined | null) || (row.created_at as string | undefined);
      if (!lastReview) continue;

      const stability = typeof row.stability === 'number' && Number.isFinite(row.stability)
        ? row.stability
        : fsrsScheduler.DEFAULT_INITIAL_STABILITY;

      const elapsedDays = fsrsScheduler.calculateElapsedDays(lastReview);
      const currentR = fsrsScheduler.calculateRetrievability(
        stability,
        Math.max(0, elapsedDays)
      );

      strengthenOnAccess(db, row.id, currentR);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] applyTestingEffect failed for id ${row.id}: ${message}`);
    }
  }
}

// -- Main Stage 2 entry point --

/**
 * Execute Stage 2: Fusion + Signal Integration.
 *
 * This is the SINGLE authoritative point where all scoring signals are
 * applied. The ordering is fixed and must not be changed without updating
 * the architectural documentation (see types.ts Stage2 comment block).
 *
 * Signal application order (12 steps):
 *   1.  Session boost      (hybrid only — working memory attention)
 *   2.  Causal boost       (hybrid only — graph-traversal amplification)
 *   2a. Co-activation      (spreading activation from top-N seeds)
 *   2b. Community boost    (N2c — inject co-members)
 *   2c. Graph signals      (N2a+N2b — momentum + depth)
 *   3.  Testing effect     (all types, when trackAccess = true)
 *   4.  Intent weights     (non-hybrid only — G2 prevention)
 *   5.  Artifact routing   (all types, when routing confidence > 0)
 *   6.  Feedback signals   (all types — learned triggers + negative feedback)
 *   7.  Artifact limiting  (trim to strategy.maxResults if routing active)
 *   8.  Anchor metadata    (annotation — no score mutation)
 *   9.  Validation metadata (spec quality signals + quality scoring)
 *
 * @param input - Stage 2 input containing candidates and pipeline config
 * @returns Stage 2 output with scored results and per-signal metadata
 */
export async function executeStage2(input: Stage2Input): Promise<Stage2Output> {
  const { candidates, config } = input;
  const start = Date.now();

  const metadata: Stage2Output['metadata'] & { communityBoostApplied?: boolean; graphSignalsApplied?: boolean } = {
    sessionBoostApplied: false,
    causalBoostApplied: false,
    intentWeightsApplied: false,
    artifactRoutingApplied: false,
    feedbackSignalsApplied: false,
    qualityFiltered: 0,
    durationMs: 0,
  };

  let results: PipelineRow[] = [...candidates];
  const isHybrid = config.searchType === 'hybrid';

  // -- 1. Session boost --
  // Only for hybrid search type — session attention signals are most meaningful
  // when the full hybrid result set is available for ordering.
  if (isHybrid && config.enableSessionBoost && config.sessionId) {
    try {
      const { results: boosted, metadata: sbMeta } = sessionBoost.applySessionBoost(
        results,
        config.sessionId
      );
      results = boosted as PipelineRow[];
      metadata.sessionBoostApplied = sbMeta.applied;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] session boost failed: ${message}`);
    }
  }

  // -- 2. Causal boost --
  // Only for hybrid search type — causal graph traversal is seeded from the
  // top results after session boost has re-ordered them.
  if (isHybrid && config.enableCausalBoost) {
    try {
      const { results: boosted, metadata: cbMeta } = causalBoost.applyCausalBoost(results);
      results = boosted as PipelineRow[];
      metadata.causalBoostApplied = cbMeta.applied;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] causal boost failed: ${message}`);
    }
  }

  // -- 2a. Co-activation spreading --
  // Gated behind SPECKIT_COACTIVATION flag. Takes the top-N results as seeds,
  // performs spreading activation traversal, and boosts scores of results that
  // appear in the co-activation graph. Matches V1 hybrid-search behavior.
  if (isCoActivationEnabled()) {
    try {
      const topIds = results
        .slice(0, SPREAD_ACTIVATION_TOP_N)
        .map(r => r.id)
        .filter((id): id is number => typeof id === 'number');

      if (topIds.length > 0) {
        const spreadResults: SpreadResult[] = spreadActivation(topIds);
        if (spreadResults.length > 0) {
          const spreadMap = new Map(spreadResults.map(sr => [sr.id, sr.activationScore]));
          results = results.map((row) => {
            const boost = spreadMap.get(row.id);
            if (boost !== undefined) {
              const baseScore = resolveBaseScore(row);
              return withSyncedScoreAliases(row, baseScore + boost * CO_ACTIVATION_CONFIG.boostFactor);
            }
            return row;
          });
          // AI-GUARD: Re-sort after co-activation boost to ensure boosted results
          // are promoted to their correct position in the ranking
          results.sort((a, b) => resolveBaseScore(b) - resolveBaseScore(a));
          (metadata as Record<string, unknown>).coActivationApplied = true;
        }
      }
    } catch (err: unknown) {
      // AI-GUARD: Non-critical enrichment — co-activation failure does not affect core ranking
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] co-activation spreading failed: ${message}`);
    }
  }

  // -- 2b. Community co-retrieval (N2c) --
  // Inject community co-members into result set before graph signals
  // so injected rows also receive momentum/depth adjustments.
  if (isCommunityDetectionEnabled()) {
    try {
      const db = requireDb();
      const boosted = applyCommunityBoost(results, db);
      if (boosted.length > results.length) {
        results = boosted as PipelineRow[];
        (metadata as Record<string, unknown>).communityBoostApplied = true;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] community boost failed: ${message}`);
    }
  }

  // -- 2c. Graph signals (N2a + N2b) --
  // Additive score adjustments for graph momentum and causal depth.
  if (isGraphSignalsEnabled()) {
    try {
      const db = requireDb();
      const signaled = applyGraphSignals(results, db);
      results = signaled as PipelineRow[];
      (metadata as Record<string, unknown>).graphSignalsApplied = true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] graph signals failed: ${message}`);
    }
  }

  // AI-GUARD: -- 3. Testing effect (FSRS write-back) --
  // P3-09 FIX: Only when explicitly opted in via trackAccess.
  // Write-back is fire-and-forget; errors per-row are swallowed inside
  // applyTestingEffect so they never abort the pipeline.
  if (config.trackAccess) {
    try {
      const db = requireDb();
      applyTestingEffect(db, results);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] testing effect skipped (db unavailable): ${message}`);
    }
  }

  // AI-WHY: -- 4. Intent weights --
  // G2 PREVENTION: Only apply for non-hybrid search types.
  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —
  // applying it again here would double-count, causing the G2 bug.
  if (!isHybrid && config.intentWeights) {
    try {
      const weighted = applyIntentWeightsToResults(results, config.intentWeights);
      results = weighted.map((result) =>
        typeof result.intentAdjustedScore === 'number'
          ? withSyncedScoreAliases(result, result.intentAdjustedScore)
          : result
      );
      metadata.intentWeightsApplied = true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] intent weights failed: ${message}`);
    }
  }

  // -- 5. Artifact routing weights --
  if (config.artifactRouting && config.artifactRouting.confidence > 0) {
    try {
      const routed = applyArtifactRouting(results, config.artifactRouting);
      results = routed;
      metadata.artifactRoutingApplied = true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] artifact routing failed: ${message}`);
    }
  }

  // -- 6. Feedback signals --
  try {
    const withFeedback = applyFeedbackSignals(results, config.query);
    // Detect if any score actually changed
    const changed = withFeedback.some((r, i) => r !== results[i]);
    if (changed) {
      results = withFeedback;
      metadata.feedbackSignalsApplied = true;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[stage2-fusion] feedback signals failed: ${message}`);
  }

  // -- 7. Artifact-based result limiting --
  // The routing strategy may specify a maxResults count stricter than the
  // overall pipeline limit. Apply it here so Stage 3 reranks a pre-trimmed set.
  syncScoreAliasesInPlace(results);
  results.sort((a, b) => resolveEffectiveScore(b) - resolveEffectiveScore(a));
  if (
    config.artifactRouting &&
    config.artifactRouting.confidence > 0 &&
    typeof config.artifactRouting.strategy?.maxResults === 'number' &&
    config.artifactRouting.strategy.maxResults > 0 &&
    results.length > config.artifactRouting.strategy.maxResults
  ) {
    results = results.slice(0, config.artifactRouting.strategy.maxResults);
  }

  // AI-GUARD: -- 8. Anchor metadata annotation --
  // Pure annotation: attach AnchorMetadata[] to rows that contain ANCHOR tags.
  // No scores are changed — this satisfies the Stage 4 score-immutability
  // invariant and does not conflict with the G2 double-weighting guard.
  try {
    results = enrichResultsWithAnchorMetadata(results);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[stage2-fusion] anchor metadata enrichment failed: ${message}`);
  }

  // -- 9. Validation metadata enrichment + scoring --
  // Extract spec quality signals (SPECKIT_LEVEL, quality_score,
  // importance_tier, completion markers) and attach as `validationMetadata` key,
  // then apply bounded quality scoring multipliers at this single scoring point.
  try {
    results = enrichResultsWithValidationMetadata(results);
    results = applyValidationSignalScoring(results);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[stage2-fusion] validation metadata enrichment failed: ${message}`);
  }

  // Keep all score aliases aligned after late-stage score mutations.
  syncScoreAliasesInPlace(results);

  // -- Trace --
  if (config.trace) {
    addTraceEntry(
      config.trace,
      'fusion',
      candidates.length,
      results.length,
      Date.now() - start,
      {
        sessionBoostApplied: metadata.sessionBoostApplied,
        causalBoostApplied: metadata.causalBoostApplied,
        intentWeightsApplied: metadata.intentWeightsApplied,
        artifactRoutingApplied: metadata.artifactRoutingApplied,
        feedbackSignalsApplied: metadata.feedbackSignalsApplied,
        searchType: config.searchType,
        isHybrid,
      }
    );
  }

  metadata.durationMs = Date.now() - start;

  return {
    scored: results,
    metadata,
  };
}

// -- Test surface --

/**
 * Internal functions exposed for unit testing.
 *
 * These are NOT part of the public API and may change without notice.
 * Access only from `*.test.ts` / `*.vitest.ts` files.
 */
export const __testables = {
  resolveBaseScore,
  strengthenOnAccess,
  applyIntentWeightsToResults,
  applyArtifactRouting,
  applyFeedbackSignals,
  applyTestingEffect,
  enrichResultsWithAnchorMetadata,
  enrichResultsWithValidationMetadata,
  applyValidationSignalScoring,
};
