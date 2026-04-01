// ───────────────────────────────────────────────────────────────
// MODULE: Stage2 Fusion
// ───────────────────────────────────────────────────────────────
// the rollout (R6): 4-Stage Retrieval Pipeline
//
// I/O CONTRACT:
// Input:  Stage2Input { candidates: PipelineRow[], config, stage1Metadata }
// Output: Stage2Output { scored: PipelineRow[], metadata }
// Key invariants:
//     - Every score modification in the pipeline happens exactly once here
//     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
//     - scored is sorted descending by effective composite score on exit
// Side effects:
//     - FSRS write-back to memory_index (when trackAccess=true) — DB write
//     - Learned trigger and negative-feedback reads from DB
//
// PURPOSE: Single point for ALL scoring signals. Intent weights are
// Applied ONCE here only — this is the architectural guard against
// The G2 double-weighting recurrence bug.
//
// SIGNAL APPLICATION ORDER (must not be reordered — 12 steps):
// 1.  Session boost           — working-memory attention amplification
// 2.  Causal boost            — graph-traversal neighbor amplification
// 2a. Co-activation spreading — spreading activation from top-N seeds
// 2b. Community co-retrieval  — N2c inject community co-members
// 2c. Graph signals           — N2a momentum + N2b causal depth
// 3.  Testing effect          — FSRS strengthening write-back (trackAccess)
// 4.  Intent weights          — non-hybrid search post-scoring adjustment
// 5.  Artifact routing        — class-based weight boosts
// 6.  Feedback signals        — learned trigger boosts + negative demotions
// 7.  Artifact limiting       — result count cap from routing strategy
// 8.  Anchor metadata         — extract named ANCHOR sections (annotation)
// 9.  Validation metadata     — spec quality signals enrichment + quality scoring
//
// Hybrid search already applies intent-aware scoring
// Internally (RRF / RSF fusion). Post-search intent weighting is
// Therefore ONLY applied for non-hybrid search types (vector,
// Multi-concept). Applying it to hybrid results would double-count.
//
// SCORE AUDIT CONTRACT: Stage 2 writes the fused `score` field (steps 1-7).
// Stage 3 (rerank) MAY overwrite `score` with the reranked value and MUST
// preserve the original in `stage2Score` for auditability (see F2.02 fix).
// Stage 4 (filter) MUST NOT mutate any score fields — it is read-only.
// The canonical reranker output is `rerankerScore`; `score` is synced to it
// for downstream consumer compatibility.

import type Database from 'better-sqlite3';
import path from 'path';
import { readFile } from 'fs/promises';

import { resolveEffectiveScore } from './types.js';
import type { Stage2Input, Stage2Output, PipelineRow, IntentWeightsConfig, ArtifactRoutingConfig } from './types.js';

import * as sessionBoost from '../session-boost.js';
import * as causalBoost from '../causal-boost.js';
import {
  isEnabled as isCoActivationEnabled,
  spreadActivation,
  getRelatedMemoryCounts,
  resolveCoActivationBoostFactor,
} from '../../cognitive/co-activation.js';
import type { SpreadResult } from '../../cognitive/co-activation.js';
import { ensureAdaptiveTables, getAdaptiveMode } from '../../cognitive/adaptive-ranking.js';
import * as fsrsScheduler from '../../cognitive/fsrs-scheduler.js';
import { queryLearnedTriggers } from '../learned-feedback.js';
import { applyNegativeFeedback, getNegativeFeedbackStats } from '../../scoring/negative-feedback.js';
import {
  isNegativeFeedbackEnabled,
  isCommunityDetectionEnabled,
  isGraphCalibrationProfileEnabled,
  isGraphSignalsEnabled,
  resolveGraphWalkRolloutState,
  isLearnedStage2CombinerEnabled,
} from '../search-flags.js';
import { applyCalibrationProfile } from '../graph-calibration.js';
import { shadowScore, extractFeatureVector, loadModel } from '@spec-kit/shared/ranking/learned-combiner';
import type { LearnedModel } from '@spec-kit/shared/ranking/learned-combiner';
import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
import { requireDb } from '../../../utils/db-helpers.js';
import { computeRecencyScore } from '../../scoring/folder-scoring.js';
import { enrichResultsWithAnchorMetadata } from '../anchor-metadata.js';
import { enrichResultsWithValidationMetadata } from '../validation-metadata.js';
// B4: Stage 2b enrichment extracted for decomposition clarity
import { executeStage2bEnrichment } from './stage2b-enrichment.js';
import { applyCommunityBoost } from '../../graph/community-detection.js';
import { applyGraphSignals } from '../../graph/graph-signals.js';
import { isGraphUnifiedEnabled } from '../graph-flags.js';
import { sortDeterministicRows } from './ranking-contract.js';

// Feature catalog: 4-stage pipeline architecture
// Feature catalog: MPAB chunk-to-memory aggregation


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
const DEFAULT_LEARNED_STAGE2_MODEL_RELATIVE_PATH = path.join('models', 'learned-stage2-combiner.json');

const MIN_VALIDATION_MULTIPLIER = 0.8;
const MAX_VALIDATION_MULTIPLIER = 1.2;

type LearnedStage2ModelCacheEntry = {
  path: string;
  model: LearnedModel | null;
};

let cachedLearnedStage2Model: LearnedStage2ModelCacheEntry | null = null;
let learnedStage2ModelLoadPromise: Promise<LearnedStage2ModelCacheEntry> | null = null;
let learnedStage2ModelLoadPromisePath: string | null = null;

function clampMultiplier(value: number): number {
  if (!Number.isFinite(value)) return 1;
  if (value < MIN_VALIDATION_MULTIPLIER) return MIN_VALIDATION_MULTIPLIER;
  if (value > MAX_VALIDATION_MULTIPLIER) return MAX_VALIDATION_MULTIPLIER;
  return value;
}

function isShadowLearningModelLoadEnabled(): boolean {
  return process.env.SPECKIT_SHADOW_LEARNING?.toLowerCase().trim() === 'true';
}

function resolveLearnedStage2ModelPath(): string {
  const configured = process.env.SPECKIT_LEARNED_STAGE2_MODEL?.trim();
  if (!configured) {
    return path.resolve(process.cwd(), DEFAULT_LEARNED_STAGE2_MODEL_RELATIVE_PATH);
  }
  if (path.isAbsolute(configured)) {
    return configured;
  }
  return path.resolve(process.cwd(), configured);
}

async function loadPersistedLearnedStage2Model(): Promise<LearnedModel | null> {
  if (!isShadowLearningModelLoadEnabled()) {
    return null;
  }

  const modelPath = resolveLearnedStage2ModelPath();
  if (cachedLearnedStage2Model?.path === modelPath) {
    return cachedLearnedStage2Model.model;
  }

  if (learnedStage2ModelLoadPromise && learnedStage2ModelLoadPromisePath === modelPath) {
    return (await learnedStage2ModelLoadPromise).model;
  }

  if (learnedStage2ModelLoadPromisePath !== modelPath) {
    learnedStage2ModelLoadPromise = null;
    learnedStage2ModelLoadPromisePath = null;
  }

  learnedStage2ModelLoadPromisePath = modelPath;
  learnedStage2ModelLoadPromise = (async (): Promise<LearnedStage2ModelCacheEntry> => {
    try {
      const json = await readFile(modelPath, 'utf8');
      const model = loadModel(json);
      if (!model) {
        console.warn(`[stage2-fusion] learned stage2 model at ${modelPath} is invalid; shadow scoring will use manual-only fallback`);
      }
      const entry = { path: modelPath, model };
      cachedLearnedStage2Model = entry;
      return entry;
    } catch (err: unknown) {
      const entry = { path: modelPath, model: null };
      cachedLearnedStage2Model = entry;

      const code = typeof err === 'object' && err !== null && 'code' in err
        ? String((err as { code?: unknown }).code)
        : '';
      if (code !== 'ENOENT') {
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`[stage2-fusion] learned stage2 model load failed: ${message}`);
      }
      return entry;
    } finally {
      learnedStage2ModelLoadPromise = null;
      learnedStage2ModelLoadPromisePath = null;
    }
  })();

  return (await learnedStage2ModelLoadPromise).model;
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

  return sortDeterministicRows(adjusted as Array<PipelineRow & { id: number }>);
}

// -- Internal helpers --

/**
 * Replaced with shared resolveEffectiveScore()
 * from types.ts. The shared function uses the correct fallback chain:
 * intentAdjustedScore → rrfScore → score → similarity/100, all clamped to [0,1].
 * This alias ensures all call sites use the shared implementation.
 */
const resolveBaseScore = resolveEffectiveScore;

function withSyncedScoreAliases(row: PipelineRow, score: number): PipelineRow {
  // F2.03 fix: Clamp to [0,1] so downstream consumers never see raw boosted values > 1.
  const clamped = Math.max(0, Math.min(1, score));
  return {
    ...row,
    score: clamped,
    rrfScore: clamped,
    intentAdjustedScore: clamped,
    // Preserve attentionScore — it is set by the attention-decay module and
    // must not be overwritten with the fusion/ranking score.
  };
}

function syncScoreAliasesInPlace(rows: PipelineRow[]): void {
  for (const row of rows) {
    if (typeof row.score !== 'number' || !Number.isFinite(row.score)) continue;
    // F2.03 fix: Clamp to [0,1] during in-place sync.
    const clamped = Math.max(0, Math.min(1, row.score));
    row.score = clamped;
    row.rrfScore = clamped;
    row.intentAdjustedScore = clamped;
    // Preserve attentionScore — it is set by the attention-decay module and
    // must not be overwritten with the fusion/ranking score.
  }
}

type GraphContributionKey = 'causalDelta' | 'coActivationDelta' | 'communityDelta' | 'graphSignalDelta';

function withGraphContribution(
  row: PipelineRow,
  key: GraphContributionKey,
  delta: number,
  source: string,
  injected: boolean = false,
): PipelineRow {
  const current = (row.graphContribution && typeof row.graphContribution === 'object')
    ? row.graphContribution as Record<string, unknown>
    : {};
  const sources = Array.isArray(current.sources)
    ? current.sources.filter((value): value is string => typeof value === 'string')
    : [];
  const nextSources = sources.includes(source) ? sources : [...sources, source];
  const currentValue = typeof current[key] === 'number' && Number.isFinite(current[key]) ? current[key] : 0;
  const totalDelta = ['causalDelta', 'coActivationDelta', 'communityDelta', 'graphSignalDelta']
    .reduce((sum, field) => {
      const existing = field === key ? currentValue + delta : current[field];
      return sum + (typeof existing === 'number' && Number.isFinite(existing) ? existing : 0);
    }, 0);
  return {
    ...row,
    graphContribution: {
      ...current,
      [key]: currentValue + delta,
      totalDelta,
      sources: nextSources,
      injected: current.injected === true || injected,
    },
  };
}

function countGraphContribution(rows: PipelineRow[], key: GraphContributionKey): number {
  return rows.filter((row) => {
    const graphContribution = row.graphContribution as Record<string, unknown> | undefined;
    return typeof graphContribution?.[key] === 'number' && Math.abs(graphContribution[key] as number) > 0;
  }).length;
}

function countGraphInjected(rows: PipelineRow[]): number {
  return rows.filter((row) => {
    const graphContribution = row.graphContribution as Record<string, unknown> | undefined;
    return graphContribution?.injected === true;
  }).length;
}

function resolveGraphContributionValue(
  graphContribution: Record<string, unknown> | undefined,
  key: GraphContributionKey,
): number {
  const value = graphContribution?.[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function applyGraphCalibrationProfileToResults(results: PipelineRow[]): PipelineRow[] {
  return results.map((row) => {
    const graphContribution = row.graphContribution as Record<string, unknown> | undefined;
    const originalGraphSignalDelta = Math.max(0, resolveGraphContributionValue(graphContribution, 'graphSignalDelta'));
    const originalCommunityDelta = Math.max(0, resolveGraphContributionValue(graphContribution, 'communityDelta'));

    if (originalGraphSignalDelta === 0 && originalCommunityDelta === 0) {
      return row;
    }

    const calibrated = applyCalibrationProfile({
      graphWeightBoost: originalGraphSignalDelta,
      // Stage 2 currently tracks graph-signal contribution as one aggregate delta.
      // Feed the same bounded value through the N2a/N2b caps until per-signal
      // attribution is exposed on PipelineRow graphContribution.
      n2aScore: originalGraphSignalDelta,
      n2bScore: originalGraphSignalDelta,
      communityBoost: originalCommunityDelta,
    });

    const adjustedScore = resolveBaseScore(row)
      - originalGraphSignalDelta
      - originalCommunityDelta
      + calibrated.graphWeightBoost
      + calibrated.communityBoost;

    const calibratedRow = withSyncedScoreAliases(row, adjustedScore);
    const causalDelta = resolveGraphContributionValue(graphContribution, 'causalDelta');
    const coActivationDelta = resolveGraphContributionValue(graphContribution, 'coActivationDelta');

    return {
      ...calibratedRow,
      graphContribution: {
        ...(graphContribution ?? {}),
        graphSignalDelta: calibrated.graphWeightBoost,
        communityDelta: calibrated.communityBoost,
        totalDelta: causalDelta
          + coActivationDelta
          + calibrated.communityBoost
          + calibrated.graphWeightBoost,
      },
    };
  });
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
    return sortDeterministicRows(results as Array<PipelineRow & { id: number }>);
  }

  const boosted = results.map((row) => {
    const baseScore = resolveBaseScore(row);
    const boostedScore = baseScore * boostFactor;
    return {
      ...withSyncedScoreAliases(row, boostedScore),
      artifactBoostApplied: boostFactor,
    };
  });

  return sortDeterministicRows(boosted as Array<PipelineRow & { id: number }>);
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
      // DB not available — skip feedback signals gracefully
      return results;
    }
    // DB not available — skip feedback signals gracefully
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

function recordAdaptiveAccessSignals(
  db: Database.Database,
  results: PipelineRow[],
  query: string | undefined
): void {
  if (!db || !Array.isArray(results) || results.length === 0) return;

  if (getAdaptiveMode() === 'disabled') return;

  ensureAdaptiveTables(db);
  const insertAdaptiveSignal = db.prepare(`
    INSERT INTO adaptive_signal_events (memory_id, signal_type, signal_value, query, actor, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const writeAdaptiveSignals = db.transaction((accessedResults: PipelineRow[]) => {
    for (const result of accessedResults) {
      insertAdaptiveSignal.run(
        result.id,
        'access',
        1.0,
        query || '',
        '',
        '{}',
      );
    }
  });

  try {
    writeAdaptiveSignals(results);
  } catch (err: unknown) {
    // Adaptive signal capture must never block the core search pipeline.
    console.warn('[stage2-fusion] adaptive access signal write failed:', (err as Error)?.message ?? err);
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
    sessionBoostApplied: 'off',
    causalBoostApplied: 'off',
    intentWeightsApplied: 'off',
    artifactRoutingApplied: 'off',
    feedbackSignalsApplied: 'off',
    graphContribution: {
      killSwitchActive: !isGraphUnifiedEnabled(),
      causalBoosted: 0,
      coActivationBoosted: 0,
      communityInjected: 0,
      graphSignalsBoosted: 0,
      totalGraphInjected: 0,
      rolloutState: resolveGraphWalkRolloutState(),
    },
    qualityFiltered: 0,
    durationMs: 0,
  };

  // FIX #3: Deep clone candidates so in-place mutations (e.g., syncScoreAliasesInPlace)
  // cannot corrupt the original Stage 1 output. A shallow copy ([...candidates]) shares
  // the same row objects, creating a race condition if the orchestrator's timeout fallback
  // uses the original Stage 1 candidates array.
  let results: PipelineRow[] = candidates.map(row => ({ ...row }));
  const isHybrid = config.searchType === 'hybrid';

  // -- 1. Session boost --
  // Only for hybrid search type — session attention signals are most meaningful
  // When the full hybrid result set is available for ordering.
  if (isHybrid && config.enableSessionBoost && config.sessionId) {
    try {
      const { results: boosted, metadata: sbMeta } = sessionBoost.applySessionBoost(
        results,
        config.sessionId
      );
      results = boosted as PipelineRow[];
      // FIX #4: Sync aliases immediately after session boost score mutations
      // so rrfScore/intentAdjustedScore are not stale for subsequent steps.
      syncScoreAliasesInPlace(results);
      metadata.sessionBoostApplied = sbMeta.applied ? 'applied' : 'enabled';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] session boost failed: ${message}`);
      metadata.sessionBoostApplied = 'failed';
    }
  }

  // -- 2. Causal boost --
  // Only for hybrid search type — causal graph traversal is seeded from the
  // Top results after session boost has re-ordered them.
  if (isHybrid && config.enableCausalBoost && isGraphUnifiedEnabled()) {
    try {
      const beforeScores = new Map(results.map((row) => [row.id, resolveBaseScore(row)]));
      const { results: boosted, metadata: cbMeta } = causalBoost.applyCausalBoost(results);
      results = (boosted as PipelineRow[]).map((row) => {
        const previous = beforeScores.get(row.id) ?? resolveBaseScore(row);
        const next = resolveBaseScore(row);
        return next !== previous
          ? withGraphContribution(row, 'causalDelta', next - previous, 'causal', row.injectedByCausalBoost === true)
          : row;
      });
      // FIX #4: Sync aliases immediately after causal boost score mutations.
      syncScoreAliasesInPlace(results);
      metadata.causalBoostApplied = cbMeta.applied ? 'applied' : 'enabled';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] causal boost failed: ${message}`);
      metadata.causalBoostApplied = 'failed';
    }
  }

  // -- 2a. Co-activation spreading --
  // Gated behind SPECKIT_COACTIVATION flag. Takes the top-N results as seeds,
  // Performs spreading activation traversal, and boosts scores of results that
  // Appear in the co-activation graph. Matches V1 hybrid-search behavior.
  if (isCoActivationEnabled() && isGraphUnifiedEnabled()) {
    try {
      const topIds = results
        .slice(0, SPREAD_ACTIVATION_TOP_N)
        .map(r => r.id)
        .filter((id): id is number => typeof id === 'number');

      if (topIds.length > 0) {
        const spreadResults: SpreadResult[] = spreadActivation(topIds);
        if (spreadResults.length > 0) {
          const spreadMap = new Map(spreadResults.map(sr => [sr.id, sr.activationScore]));
          const relatedCounts = getRelatedMemoryCounts([...new Set(spreadResults.map((result) => result.id))]);
          results = results.map((row) => {
            const boost = spreadMap.get(row.id);
            if (boost !== undefined) {
              const baseScore = resolveBaseScore(row);
              // R17 fan-effect divisor: dampen hub nodes proportionally to their
              // fan-out degree so no single hub dominates the top-N results.
              // Uses the same sqrt scaling as co-activation.ts boostScore().
              const relatedCount = typeof row.id === 'number' ? (relatedCounts.get(row.id) ?? 0) : 0;
              const fanDivisor = Math.sqrt(Math.max(1, relatedCount));
              const updated = withSyncedScoreAliases(row, baseScore + (boost * resolveCoActivationBoostFactor()) / fanDivisor);
              return withGraphContribution(updated, 'coActivationDelta', resolveBaseScore(updated) - baseScore, 'co-activation');
            }
            return row;
          });
          // Re-sort after co-activation boost to ensure boosted results
          // Are promoted to their correct position in the ranking
          results = sortDeterministicRows(results as Array<PipelineRow & { id: number }>);
          (metadata as Record<string, unknown>).coActivationApplied = true;
        }
      }
    } catch (err: unknown) {
      // Non-critical enrichment — co-activation failure does not affect core ranking
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] co-activation spreading failed: ${message}`);
    }
  }

  // -- 2b. Community co-retrieval (N2c) --
  // Inject community co-members into result set before graph signals
  // So injected rows also receive momentum/depth adjustments.
  if (isCommunityDetectionEnabled() && isGraphUnifiedEnabled()) {
    const beforeCommunityIds = new Set(results.map((row) => row.id));
    try {
      const db = requireDb();
      const boosted = applyCommunityBoost(results, db);
      if (boosted.length > results.length) {
        results = (boosted as PipelineRow[]).map((row) => beforeCommunityIds.has(row.id)
          ? row
          : withGraphContribution(row, 'communityDelta', 0, 'community', true));
        (metadata as Record<string, unknown>).communityBoostApplied = true;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] community boost failed: ${message}`);
    }

    const injectedIds = results
      .filter((row) => !beforeCommunityIds.has(row.id) && typeof row.id === 'number')
      .map((row) => row.id);
    if (injectedIds.length > 0) {
      try {
        const db = requireDb();
        const placeholders = injectedIds.map(() => '?').join(',');
        const stateRows = db.prepare(
          `SELECT id, memory_state FROM memory_index WHERE id IN (${placeholders})`
        ).all(...injectedIds) as Array<{ id: number; memory_state?: string }>;
        const stateMap = new Map(stateRows.map((row) => [row.id, row.memory_state]));
        const injectedIdSet = new Set(injectedIds);
        for (const row of results) {
          const rowId = typeof row.id === 'number' ? row.id : null;
          if (rowId === null || !injectedIdSet.has(rowId)) {
            continue;
          }
          const hydratedState = stateMap.get(rowId);
          if (typeof hydratedState === 'string') {
            row.memoryState = hydratedState;
          }
        }
      } catch (err: unknown) {
        console.warn('[stage2] Community state hydration failed:', err instanceof Error ? err.message : err);
      }
    }
  }

  // -- 2c. Graph signals (N2a + N2b) --
  // Additive score adjustments for graph momentum and causal depth.
  if (isGraphSignalsEnabled() && isGraphUnifiedEnabled()) {
    try {
      const db = requireDb();
      const beforeScores = new Map(results.map((row) => [row.id, resolveBaseScore(row)]));
      const signaled = applyGraphSignals(results, db, {
        rolloutState: resolveGraphWalkRolloutState(),
      });
      results = (signaled as PipelineRow[]).map((row) => {
        const previous = beforeScores.get(row.id) ?? resolveBaseScore(row);
        const next = resolveBaseScore(row);
        return next !== previous
          ? withGraphContribution(row, 'graphSignalDelta', next - previous, 'graph-signals')
          : row;
      });
      // FIX #4: Sync aliases immediately after graph signal score mutations.
      syncScoreAliasesInPlace(results);
      if (isGraphCalibrationProfileEnabled()) {
        results = applyGraphCalibrationProfileToResults(results);
        syncScoreAliasesInPlace(results);
      }
      (metadata as Record<string, unknown>).graphSignalsApplied = true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] graph signals failed: ${message}`);
    }
  }

  // -- 3. Testing effect (FSRS write-back) --
  // P3-09 FIX: Only when explicitly opted in via trackAccess.
  // Write-back is fire-and-forget; errors per-row are swallowed inside
  // ApplyTestingEffect so they never abort the pipeline.
  if (config.trackAccess) {
    try {
      const db = requireDb();
      applyTestingEffect(db, results);
      recordAdaptiveAccessSignals(db, results, config.query);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] testing effect skipped (db unavailable): ${message}`);
    }
  }

  // -- 4. Intent weights --
  // G2 PREVENTION: Only apply for non-hybrid search types.
  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —
  // Applying it again here would double-count, causing the G2 bug.
  if (!isHybrid && config.intentWeights) {
    try {
      const weighted = applyIntentWeightsToResults(results, config.intentWeights);
      results = weighted.map((result) =>
        typeof result.intentAdjustedScore === 'number'
          ? withSyncedScoreAliases(result, result.intentAdjustedScore)
          : result
      );
      metadata.intentWeightsApplied = 'applied';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] intent weights failed: ${message}`);
      metadata.intentWeightsApplied = 'failed';
    }
  }

  // -- 5. Artifact routing weights --
  if (config.artifactRouting && config.artifactRouting.confidence > 0) {
    try {
      const routed = applyArtifactRouting(results, config.artifactRouting);
      results = routed;
      metadata.artifactRoutingApplied = 'applied';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] artifact routing failed: ${message}`);
      metadata.artifactRoutingApplied = 'failed';
    }
  }

  // -- 6. Feedback signals --
  try {
    const withFeedback = applyFeedbackSignals(results, config.query);
    // Detect if any score actually changed
    const changed = withFeedback.some((r, i) => r !== results[i]);
    if (changed) {
      results = withFeedback;
      metadata.feedbackSignalsApplied = 'applied';
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[stage2-fusion] feedback signals failed: ${message}`);
    metadata.feedbackSignalsApplied = 'failed';
  }

  // -- 6a. Learned Stage 2 shadow scoring --
  // REQ-D1-006: Runs the learned linear ranker in parallel with the manual combiner.
  // Shadow-only — scores are logged for comparison but never affect live ranking.
  // Gated behind SPECKIT_LEARNED_STAGE2_COMBINER (default ON, graduated).
  if (isLearnedStage2CombinerEnabled()) {
    try {
      const learnedShadowModel = await loadPersistedLearnedStage2Model();
      for (const row of results) {
        const features = extractFeatureVector({
          rrfScore: row.rrfScore,
          overlapScore: typeof row.overlapScore === 'number' ? row.overlapScore : undefined,
          graphScore: (() => {
            const gc = row.graphContribution as Record<string, unknown> | undefined;
            const delta = typeof gc?.totalDelta === 'number' ? gc.totalDelta : 0;
            return Math.max(0, Math.min(1, delta + 0.5));
          })(),
          sessionScore: typeof row.sessionScore === 'number' ? row.sessionScore : undefined,
          causalScore: typeof row.causalScore === 'number' ? row.causalScore : undefined,
          feedbackScore: typeof row.feedbackScore === 'number' ? row.feedbackScore : undefined,
          validationScore: (() => {
            const vm = row.validationMetadata as Record<string, unknown> | undefined;
            return typeof vm?.qualityScore === 'number' ? vm.qualityScore : undefined;
          })(),
          artifactScore: typeof row.artifactBoostApplied === 'number'
            ? Math.min(1, row.artifactBoostApplied / 2)
            : undefined,
        });
        const shadow = shadowScore(learnedShadowModel, features, resolveBaseScore(row), true);
        if (shadow) {
          console.warn(
            `[stage2-fusion] shadow-learned id=${row.id} manual=${shadow.manualScore.toFixed(4)} learned=${shadow.learnedScore.toFixed(4)} delta=${shadow.delta.toFixed(4)}`
          );
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] learned stage2 shadow scoring failed: ${message}`);
    }
  }

  // -- 7. Artifact-based result limiting --
  // The routing strategy may specify a maxResults count stricter than the
  // Overall pipeline limit. Apply it here so Stage 3 reranks a pre-trimmed set.
  syncScoreAliasesInPlace(results);
  results = sortDeterministicRows(results as Array<PipelineRow & { id: number }>);
  if (
    config.artifactRouting &&
    config.artifactRouting.confidence > 0 &&
    typeof config.artifactRouting.strategy?.maxResults === 'number' &&
    config.artifactRouting.strategy.maxResults > 0 &&
    results.length > config.artifactRouting.strategy.maxResults
  ) {
    results = results.slice(0, config.artifactRouting.strategy.maxResults);
  }

  // -- Steps 8-9: Enrichment (B4 decomposition → stage2b-enrichment.ts) --
  // Pure annotation: anchor metadata + validation metadata.
  // Validation signal SCORING (applyValidationSignalScoring) stays here
  // because it's a scoring step, not a pure enrichment.
  results = executeStage2bEnrichment(results);
  try {
    results = applyValidationSignalScoring(results);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[stage2-fusion] validation signal scoring failed: ${message}`);
  }

  // Keep all score aliases aligned after late-stage score mutations.
  syncScoreAliasesInPlace(results);
  if (metadata.graphContribution) {
    metadata.graphContribution.causalBoosted = countGraphContribution(results, 'causalDelta');
    metadata.graphContribution.coActivationBoosted = countGraphContribution(results, 'coActivationDelta');
    metadata.graphContribution.communityInjected = countGraphContribution(results, 'communityDelta');
    metadata.graphContribution.graphSignalsBoosted = countGraphContribution(results, 'graphSignalDelta');
    metadata.graphContribution.totalGraphInjected = countGraphInjected(results);
  }

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
        graphContribution: metadata.graphContribution,
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
