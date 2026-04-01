// ───────────────────────────────────────────────────────────────
// MODULE: Composite Scoring
// ───────────────────────────────────────────────────────────────
import { getTierConfig } from './importance-tiers.js';
import { calculatePopularityScore } from '../storage/access-tracker.js';
// HIGH-003 FIX: Import unified recency scoring from folder-scoring
import { computeRecencyScore, DECAY_RATE } from './folder-scoring.js';
// Interference scoring penalty
import { applyInterferencePenalty, INTERFERENCE_PENALTY_COEFFICIENT } from './interference-scoring.js';
// Scoring observability (N4 + TM-01 logging, 5% sampled)
import { shouldSample, logScoringObservation } from '../telemetry/scoring-observability.js';

import type { MemoryDbRow } from '@spec-kit/shared/types';

// Feature catalog: Score normalization
// Feature catalog: Interference scoring
// Feature catalog: Negative feedback confidence signal


/**
 * Loose input type for scoring functions.
 * Accepts any partial DB row plus arbitrary extra fields (camelCase
 * fallbacks, search-enriched properties like similarity, etc.).
 */
export type ScoringInput = Partial<MemoryDbRow> & Record<string, unknown>;

// COGNITIVE-079: FSRS Scheduler for retrievability calculations
// Try to import, fallback to inline calculation if not yet available
interface FsrsSchedulerModule {
  calculateRetrievability: (stability: number, elapsedDays: number) => number;
  applyClassificationDecay?: (stability: number, contextType: string, importanceTier: string) => number;
  FSRS_FACTOR: number;
  FSRS_DECAY: number;
  TIER_MULTIPLIER?: Readonly<Record<string, number>>;
}

let fsrsScheduler: FsrsSchedulerModule | null = null;
let fsrsSchedulerPromise: Promise<FsrsSchedulerModule | null> | null = null;
let fsrsSchedulerLoadError: string | null = null;

async function loadFsrsScheduler(): Promise<FsrsSchedulerModule | null> {
  if (fsrsScheduler !== null) {
    return fsrsScheduler;
  }
  if (fsrsSchedulerPromise !== null) {
    return fsrsSchedulerPromise;
  }

  const loadPromise = (async (): Promise<FsrsSchedulerModule | null> => {
    try {
      fsrsScheduler = await import('../cognitive/fsrs-scheduler.js') as FsrsSchedulerModule;
      fsrsSchedulerLoadError = null;
      return fsrsScheduler;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      fsrsSchedulerLoadError = msg;
      console.warn('[composite-scoring] FSRS scheduler lazy import failed:', msg);
      return null;
    }
  })();

  fsrsSchedulerPromise = loadPromise;
  try {
    return await loadPromise;
  } finally {
    if (fsrsSchedulerPromise === loadPromise) {
      fsrsSchedulerPromise = null;
    }
  }
}

function getFsrsScheduler(): FsrsSchedulerModule | null {
  if (fsrsScheduler !== null) {
    return fsrsScheduler;
  }
  if (fsrsSchedulerLoadError) {
    console.warn(`[composite-scoring] fsrs-scheduler unavailable; using inline fallback: ${fsrsSchedulerLoadError}`);
    fsrsSchedulerLoadError = null;
  }
  if (fsrsSchedulerPromise === null) {
    void loadFsrsScheduler();
  }
  return null;
}

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
export interface FiveFactorWeights {
  temporal: number;
  usage: number;
  importance: number;
  pattern: number;
  citation: number;
}

export interface LegacyWeights {
  similarity: number;
  importance: number;
  recency: number;
  popularity: number;
  tierBoost: number;
  retrievability: number;
}

// ScoringInput is defined above; deprecated MemoryRow was removed.

export interface ScoringOptions {
  weights?: Partial<FiveFactorWeights> | Partial<LegacyWeights>;
  query?: string;
  anchors?: string | string[];
  use_five_factor_model?: boolean;
}

export interface FactorDetail {
  value: number;
  weight: number;
  contribution: number;
  description?: string;
}

export interface FiveFactorBreakdown {
  factors: {
    temporal: FactorDetail;
    usage: FactorDetail;
    importance: FactorDetail;
    pattern: FactorDetail;
    citation: FactorDetail;
  };
  total: number;
  model: '5-factor';
}

export interface LegacyScoreBreakdown {
  factors: {
    similarity: FactorDetail;
    importance: FactorDetail;
    recency: FactorDetail;
    popularity: FactorDetail;
    tierBoost: FactorDetail;
    retrievability: FactorDetail;
  };
  total: number;
  model: '6-factor-legacy';
}

export interface PatternAlignmentBonuses {
  exact_match: number;
  partial_match: number;
  semantic_threshold: number;
  anchor_match: number;
  type_match: number;
}

// ───────────────────────────────────────────────────────────────
// 2. CONFIGURATION

// ───────────────────────────────────────────────────────────────
// 5-Factor Decay Composite weights
export const FIVE_FACTOR_WEIGHTS: FiveFactorWeights = {
  temporal: 0.25,
  usage: 0.15,
  importance: 0.25,
  pattern: 0.20,
  citation: 0.15,
};

// Legacy 6-factor weights for backward compatibility
export const DEFAULT_WEIGHTS: LegacyWeights = {
  similarity: 0.30,
  importance: 0.25,
  recency: 0.10,
  popularity: 0.15,
  tierBoost: 0.05,
  retrievability: 0.15,
};

// HIGH-003 FIX: Re-export DECAY_RATE for backward compatibility
export const RECENCY_SCALE_DAYS: number = 1 / DECAY_RATE;

// T301: FSRS constants imported from canonical source (fsrs-scheduler.ts)
// Re-exported for backward compatibility — consumers may import from here
export const FSRS_FACTOR: number = 19 / 81;
export const FSRS_DECAY: number = -0.5;

const RETRIEVABILITY_TIER_MULTIPLIER: Readonly<Record<string, number>> = {
  constitutional: 0.1,
  critical: 0.3,
  important: 0.5,
  normal: 1.0,
  temporary: 2.0,
  scratch: 3.0,
};

const CLASSIFICATION_CONTEXT_STABILITY_MULTIPLIER: Readonly<Record<string, number>> = {
  decision: Infinity,
  research: 2.0,
  implementation: 1.0,
  discovery: 1.0,
  general: 1.0,
};

const CLASSIFICATION_TIER_STABILITY_MULTIPLIER: Readonly<Record<string, number>> = {
  constitutional: Infinity,
  critical: Infinity,
  important: 1.5,
  normal: 1.0,
  scratch: 0.5,
  temporary: 0.5,
  deprecated: 0.25,
};

function applyClassificationDecayFallback(stability: number, contextType: string, importanceTier: string): number {
  const contextMult = CLASSIFICATION_CONTEXT_STABILITY_MULTIPLIER[contextType] ?? 1.0;
  const tierMult = CLASSIFICATION_TIER_STABILITY_MULTIPLIER[importanceTier] ?? 1.0;

  if (!isFinite(contextMult) || !isFinite(tierMult)) {
    return Infinity;
  }

  return stability * contextMult * tierMult;
}

// Importance weight multipliers
export const IMPORTANCE_MULTIPLIERS: Readonly<Record<string, number>> = {
  constitutional: 2.0,
  critical: 1.5,
  important: 1.3,
  normal: 1.0,
  temporary: 0.6,
  deprecated: 0.1,
};

// Citation recency decay constants
export const CITATION_DECAY_RATE: number = 0.1;
export const CITATION_MAX_DAYS: number = 90;

// Document type scoring multipliers.
// Applied as a final multiplier to composite scores so spec documents
// Rank higher than regular memory files for relevant queries.
export const DOCUMENT_TYPE_MULTIPLIERS: Readonly<Record<string, number>> = {
  spec: 1.4,
  decision_record: 1.4,
  plan: 1.3,
  tasks: 1.1,
  implementation_summary: 1.1,
  checklist: 1.0,
  handover: 1.0,
  memory: 1.0,
  constitutional: 2.0,
  scratch: 0.6,
};

// Pattern alignment bonus configuration
export const PATTERN_ALIGNMENT_BONUSES: PatternAlignmentBonuses = {
  exact_match: 0.3,
  partial_match: 0.15,
  semantic_threshold: 0.8,
  anchor_match: 0.25,
  type_match: 0.2,
};

// TM-01: Re-export interference penalty coefficient for test access
export { INTERFERENCE_PENALTY_COEFFICIENT } from './interference-scoring.js';

// ───────────────────────────────────────────────────────────────
// 3. SCORE CALCULATIONS

// ───────────────────────────────────────────────────────────────
/**
 * Parse last_accessed value that may be:
 * - An ISO date string (new format from access-tracker)
 * - A millisecond epoch number (legacy format)
 * - null/undefined
 * Returns epoch milliseconds or null.
 */
function parseLastAccessed(value: number | string | undefined | null): number | null {
  if (value == null) return null;

  // If it's already a number, treat as epoch ms directly
  if (typeof value === 'number') return value;

  // Try ISO string parse first
  const parsed = Date.parse(value);
  if (!isNaN(parsed)) return parsed;

  // Maybe it's a stringified epoch number (legacy data)
  const asNum = Number(value);
  if (!isNaN(asNum) && asNum > 1e12) return asNum; // Reasonable ms epoch (after ~2001)

  return null;
}

/**
 * T032: Calculate temporal/retrievability score (REQ-017 Factor 1)
 * Uses FSRS v4 power-law formula: R = (1 + 0.235 * t/S)^-0.5
 */
export function calculateRetrievabilityScore(row: ScoringInput): number {
  const scheduler = getFsrsScheduler();
  let stability = (row.stability as number | undefined) || 1.0;
  if (!isFinite(stability)) stability = 1.0;
  const lastReview = (row.lastReview as string | undefined) || (row.last_review as string | undefined) || row.updated_at || row.created_at;
  const contextType = typeof row.context_type === 'string'
    ? row.context_type.toLowerCase()
    : typeof row.contextType === 'string'
      ? row.contextType.toLowerCase()
      : 'general';
  const tier = typeof row.importance_tier === 'string'
    ? row.importance_tier.toLowerCase()
    : 'normal';
  // Graduated-ON semantics — classification decay is active unless explicitly disabled.
  // Aligned with fsrs-scheduler.ts:337 which uses the same !== 'false' convention.
  const classificationDecayEnabled = process.env.SPECKIT_CLASSIFICATION_DECAY !== 'false';

  // Return neutral 0.5 when no timestamp — prevents NaN propagation
  if (!lastReview) {
    return 0.5;
  }

  const timestamp = new Date(lastReview).getTime();
  if (isNaN(timestamp)) return 0.5; // Neutral score for invalid dates

  const elapsedMs = Date.now() - timestamp;
  const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));

  // TM-03: Classification decay applies at stability-level; when enabled do not
  // Additionally apply elapsed-time tier multipliers to avoid double decay.
  let adjustedStability = stability;
  if (classificationDecayEnabled) {
    if (scheduler?.applyClassificationDecay) {
      adjustedStability = scheduler.applyClassificationDecay(stability, contextType, tier);
    } else {
      adjustedStability = applyClassificationDecayFallback(stability, contextType, tier);
    }
    if (!isFinite(adjustedStability)) {
      return 1;
    }
  }

  let adjustedElapsedDays = elapsedDays;
  if (!classificationDecayEnabled) {
    const tierMultiplier = scheduler?.TIER_MULTIPLIER?.[tier]
      ?? RETRIEVABILITY_TIER_MULTIPLIER[tier]
      ?? RETRIEVABILITY_TIER_MULTIPLIER.normal;
    adjustedElapsedDays = elapsedDays * tierMultiplier;
  }

  adjustedStability = Math.max(0.001, adjustedStability);

  if (scheduler && typeof scheduler.calculateRetrievability === 'function') {
    const score = scheduler.calculateRetrievability(adjustedStability, adjustedElapsedDays);
    return Number.isFinite(score) ? score : 0;
  }

  // Inline FSRS power-law formula used when fsrs-scheduler module unavailable
  const retrievability = Math.pow(1 + FSRS_FACTOR * (adjustedElapsedDays / adjustedStability), FSRS_DECAY);
  const score = Math.max(0, Math.min(1, retrievability));
  return Number.isFinite(score) ? score : 0;
}

export const calculateTemporalScore = calculateRetrievabilityScore;

/**
 * T032: Calculate usage score (REQ-017 Factor 2)
 * Formula: min(1.5, 1.0 + accessCount * 0.05)
 * Normalized to 0-1 range for composite scoring
 */
export function calculateUsageScore(accessCount: number): number {
  accessCount = Math.max(0, accessCount);
  const count = accessCount || 0;
  const usageBoost = Math.min(1.5, 1.0 + count * 0.05);
  return (usageBoost - 1.0) / 0.5;
}

/**
 * T032: Calculate importance score with multiplier (REQ-017 Factor 3)
 */
export function calculateImportanceScore(tier: string, baseWeight: number | undefined): number {
  const tierLower = (tier || 'normal').toLowerCase();
  const multiplier = IMPORTANCE_MULTIPLIERS[tierLower] || IMPORTANCE_MULTIPLIERS.normal;
  const base = baseWeight ?? 0.5;

  return Math.min(1, (base * multiplier) / 2.0);
}

/**
 * T033: Calculate citation recency score (REQ-017 Factor 5)
 */
export function calculateCitationScore(row: ScoringInput): number {
  // C2 FIX: Only use actual citation data (lastCited / last_cited).
  // Never fall back to last_accessed or updated_at — those conflate
  // General recency with citation recency. Uncited memories score 0.
  const lastCited = (row.lastCited as string | undefined)
    || (row.last_cited as string | undefined);

  if (!lastCited) {
    return 0;
  }

  const timestamp = new Date(lastCited).getTime();
  if (isNaN(timestamp)) return 0; // No valid citation date → score 0

  const elapsedMs = Date.now() - timestamp;
  const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));

  if (elapsedDays >= CITATION_MAX_DAYS) {
    return 0;
  }

  return 1 / (1 + elapsedDays * CITATION_DECAY_RATE);
}

/**
 * T034: Calculate pattern alignment score (REQ-017 Factor 4)
 */
export function calculatePatternScore(row: ScoringInput, options: ScoringOptions = {}): number {
  let score = 0;
  const query = options.query || '';
  const queryLower = query.toLowerCase();

  const similarity = (Number(row.similarity ?? 0) || 0) / 100;
  score = similarity * 0.5;

  if (row.title && typeof row.title === 'string' && queryLower) {
    const titleLower = row.title.toLowerCase();
    if (titleLower.includes(queryLower) || queryLower.includes(titleLower)) {
      score += PATTERN_ALIGNMENT_BONUSES.exact_match;
    } else {
      // Partial match: check for word overlap
      const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
      const titleWords = titleLower.split(/\s+/);
      const matches = queryWords.filter(qw => titleWords.some(tw => tw.includes(qw)));
      if (matches.length > 0 && queryWords.length > 0) {
        score += PATTERN_ALIGNMENT_BONUSES.partial_match * (matches.length / queryWords.length);
      }
    }
  }

  if (row.anchors && options.anchors) {
    const rowAnchors: string[] = Array.isArray(row.anchors)
      ? (row.anchors as unknown[]).filter((a): a is string => typeof a === 'string')
      : typeof row.anchors === 'string' ? [row.anchors] : [];
    const queryAnchors: string[] = Array.isArray(options.anchors) ? options.anchors : [options.anchors];
    const anchorMatches = queryAnchors.filter(qa =>
      rowAnchors.some(ra => ra && qa && ra.toLowerCase().includes(qa.toLowerCase()))
    );
    if (anchorMatches.length > 0 && queryAnchors.length > 0) {
      score += PATTERN_ALIGNMENT_BONUSES.anchor_match * (anchorMatches.length / queryAnchors.length);
    }
  }

  if (row.memory_type && queryLower) {
    const typeMap: Record<string, string[]> = {
      'decision': ['why', 'decided', 'chose', 'reason'],
      'blocker': ['stuck', 'blocked', 'issue', 'problem'],
      'context': ['context', 'background', 'overview'],
      'next-step': ['next', 'todo', 'action', 'plan'],
      'insight': ['learned', 'insight', 'discovery', 'found'],
    };
    const intentKeywords = typeMap[row.memory_type as string] || [];
    const hasTypeMatch = intentKeywords.some(kw => queryLower.includes(kw));
    if (hasTypeMatch) {
      score += PATTERN_ALIGNMENT_BONUSES.type_match;
    }
  }

  if (similarity >= PATTERN_ALIGNMENT_BONUSES.semantic_threshold) {
    score += (similarity - PATTERN_ALIGNMENT_BONUSES.semantic_threshold) * 0.5;
  }

  // Document-type pattern alignment bonus.
  // Boost score when query keywords match the document type
  if (queryLower && row.document_type) {
    const docType = row.document_type as string;
    const DOC_TYPE_QUERY_MAP: Record<string, string[]> = {
      'spec': ['spec', 'specification', 'requirements', 'scope', 'what'],
      'decision_record': ['decision', 'why', 'rationale', 'chose', 'alternative'],
      'plan': ['plan', 'approach', 'how', 'strategy', 'phase'],
      'tasks': ['task', 'todo', 'work', 'remaining', 'progress'],
      'implementation_summary': ['implementation', 'summary', 'built', 'completed', 'result'],
      'checklist': ['checklist', 'verify', 'check', 'qa', 'quality'],
      'research': ['research', 'investigate', 'analysis', 'findings', 'experiment'],
    };
    const matchKeywords = DOC_TYPE_QUERY_MAP[docType];
    if (matchKeywords) {
      const hasDocTypeMatch = matchKeywords.some(kw => queryLower.includes(kw));
      if (hasDocTypeMatch) {
        score += PATTERN_ALIGNMENT_BONUSES.type_match;
      }
    }
  }

  return Math.max(0, Math.min(1, score));
}

/**
 * HIGH-003 FIX: Wrapper around unified compute_recency_score from folder-scoring.
 *
 * @param timestamp - ISO timestamp of last update
 * @param tier - Importance tier (defaults to 'normal')
 * @returns Recency score 0-1
 */
export function calculateRecencyScore(timestamp: string | undefined, tier: string = 'normal'): number {
  return computeRecencyScore(timestamp || '', tier, DECAY_RATE);
}

// ───────────────────────────────────────────────────────────────
// 3a. (NOVELTY BOOST removed — Phase D cleanup)
// ───────────────────────────────────────────────────────────────

/**
 * BUG-013 FIX: Use centralized tier values from importance-tiers.js.
 *
 * @param tier - Importance tier string
 * @returns Boost value for the tier
 */
export function getTierBoost(tier: string): number {
  const tierConfig = getTierConfig(tier);
  return tierConfig.value;
}

// ───────────────────────────────────────────────────────────────
// 3b. SHARED POST-PROCESSING
// ───────────────────────────────────────────────────────────────
/**
 * Apply doc-type multiplier, interference penalty, and
 * observability telemetry to an already-computed weighted composite score.
 *
 * Called by both calculateFiveFactorScore ('5f') and calculateCompositeScore ('cs').
 * The queryIdPrefix is the only difference between the two call sites.
 *
 * @param composite  Raw weighted-sum composite score (pre-multiplier)
 * @param row        Scoring input row (used for doc type, interference, telemetry)
 * @param queryIdPrefix  Short label identifying the scoring model ('5f' | 'cs')
 * @returns Final clamped score in [0, 1]
 */
function applyPostProcessingAndObserve(
  composite: number,
  row: ScoringInput,
  queryIdPrefix: string,
): number {
  // Apply the document type multiplier.
  const docType = (row.document_type as string) || 'memory';
  const docMultiplier = DOCUMENT_TYPE_MULTIPLIERS[docType] ?? 1.0;
  composite *= docMultiplier;

  // Capture pre-penalty composite for telemetry (before interference + clamp)
  const scoreBeforePenalties = composite;

  // TM-01: Apply interference penalty (after doc multiplier)
  const interferenceScore = (row.interference_score as number) || 0;
  composite = applyInterferencePenalty(composite, interferenceScore);

  // C1 FIX: Clamp to [0, 1] — doc-type multipliers can push composite above 1.0
  const finalScore = Math.max(0, Math.min(1, composite));

  // Scoring observability (5% sampled, fail-safe)
  try {
    if (shouldSample()) {
      const createdMs = row.created_at ? new Date(row.created_at).getTime() : Date.now();
      logScoringObservation({
        memoryId: (row.id as number) || 0,
        queryId: `${queryIdPrefix}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        memoryAgeDays: isNaN(createdMs) ? 0 : (Date.now() - createdMs) / 86400000,
        // Graduated flag — default ON. Use !== 'false' to match graduated semantics (BUG-4 fix).
        interferenceApplied: interferenceScore > 0 && process.env.SPECKIT_INTERFERENCE_SCORE?.toLowerCase() !== 'false',
        interferenceScore,
        interferencePenalty: process.env.SPECKIT_INTERFERENCE_SCORE?.toLowerCase() !== 'false' && interferenceScore > 0
          ? INTERFERENCE_PENALTY_COEFFICIENT * interferenceScore : 0,
        scoreBeforeBoosts: scoreBeforePenalties,
        scoreAfterBoosts: finalScore,
        scoreDelta: finalScore - scoreBeforePenalties,
      });
    }
  } catch (_err: unknown) { /* Telemetry must never affect scoring — fail-safe swallow */ }

  return finalScore;
}

// ───────────────────────────────────────────────────────────────
// 4. COMPOSITE SCORING FUNCTIONS

// ───────────────────────────────────────────────────────────────
/**
 * T032: Calculate 5-factor composite score (REQ-017)
 *
 * Returns a single 0-1 score combining five weighted factors:
 * temporal (FSRS retrievability), usage (access frequency),
 * importance (tier-based), pattern (query alignment), and citation (recency).
 *
 * @param row - Scoring input row with memory fields
 * @param options - Optional weights, query, anchors, model selection
 * @returns Composite score 0-1
 */
export function calculateFiveFactorScore(row: ScoringInput, options: ScoringOptions = {}): number {
  const rawWeights: FiveFactorWeights = { ...FIVE_FACTOR_WEIGHTS, ...(options.weights as Partial<FiveFactorWeights>) };
  // Normalize weights to sum 1.0 after
  // Merging partial overrides. Without this, partial overrides break weighted-average semantics.
  const wSum = rawWeights.temporal + rawWeights.usage + rawWeights.importance + rawWeights.pattern + rawWeights.citation;
  const weights: FiveFactorWeights = Math.abs(wSum - 1.0) > 0.001 && wSum > 0
    ? {
        temporal: rawWeights.temporal / wSum,
        usage: rawWeights.usage / wSum,
        importance: rawWeights.importance / wSum,
        pattern: rawWeights.pattern / wSum,
        citation: rawWeights.citation / wSum,
      }
    : rawWeights;
  const tier = row.importance_tier || 'normal';

  const temporalScore = calculateTemporalScore(row);
  const usageScore = calculateUsageScore(row.access_count || 0);
  const importanceScore = calculateImportanceScore(tier, row.importance_weight);
  const patternScore = calculatePatternScore(row, options);
  const citationScore = calculateCitationScore(row);

  const composite = (
    temporalScore * weights.temporal +
    usageScore * weights.usage +
    importanceScore * weights.importance +
    patternScore * weights.pattern +
    citationScore * weights.citation
  );

  return applyPostProcessingAndObserve(composite, row, '5f');
}

/**
 * Legacy 6-factor composite score for backward compatibility.
 *
 * Returns a single 0-1 score combining six weighted factors:
 * similarity, importance, recency, popularity, tierBoost, and retrievability.
 * Set `options.use_five_factor_model = true` to use the newer 5-factor model instead.
 *
 * @param row - Scoring input row with memory fields
 * @param options - Optional weights, query, anchors, model selection
 * @returns Composite score 0-1
 */
export function calculateCompositeScore(row: ScoringInput, options: ScoringOptions = {}): number {
  if (options.use_five_factor_model) {
    return calculateFiveFactorScore(row, options);
  }

  const rawWeights: LegacyWeights = { ...DEFAULT_WEIGHTS, ...(options.weights as Partial<LegacyWeights>) };
  // Normalize weights to sum 1.0 after merging partial overrides.
  // Without this, partial overrides break weighted-average semantics.
  const wSum = rawWeights.similarity + rawWeights.importance + rawWeights.recency
    + rawWeights.popularity + rawWeights.tierBoost + rawWeights.retrievability;
  const weights: LegacyWeights = Math.abs(wSum - 1.0) > 0.001 && wSum > 0
    ? {
        similarity: rawWeights.similarity / wSum,
        importance: rawWeights.importance / wSum,
        recency: rawWeights.recency / wSum,
        popularity: rawWeights.popularity / wSum,
        tierBoost: rawWeights.tierBoost / wSum,
        retrievability: rawWeights.retrievability / wSum,
      }
    : rawWeights;

  const similarity = (Number(row.similarity) || 0) / 100;
  const importance = row.importance_weight || 0.5;
  const timestamp = row.updated_at || row.created_at;
  const tier = row.importance_tier || 'normal';
  // HIGH-003 FIX: Pass tier for constitutional exemption
  const recencyScore = calculateRecencyScore(timestamp, tier);
  const popularityScore = calculatePopularityScore(row.access_count || 0, parseLastAccessed(row.last_accessed), row.created_at || null);
  const tierBoost = getTierBoost(tier);
  const retrievabilityScore = calculateRetrievabilityScore(row);

  const composite = (
    similarity * weights.similarity +
    importance * weights.importance +
    recencyScore * weights.recency +
    popularityScore * weights.popularity +
    tierBoost * weights.tierBoost +
    retrievabilityScore * weights.retrievability
  );

  return applyPostProcessingAndObserve(composite, row, 'cs');
}

// ───────────────────────────────────────────────────────────────
// 5. BATCH OPERATIONS

// ───────────────────────────────────────────────────────────────
/**
 * T032: Apply 5-factor scoring to a batch of results.
 *
 * Each result is augmented with:
 * - `composite_score`: Five-factor composite (0-1) combining retrievability,
 *   usage, importance, pattern alignment, and citation recency scores.
 * - `_scoring`: Breakdown of individual factor values for diagnostics.
 *
 * Results are sorted descending by composite_score.
 *
 * @param results - Array of scoring input rows
 * @param options - Optional scoring configuration
 * @returns Scored and sorted results with composite_score and _scoring breakdown
 */
export function applyFiveFactorScoring(
  results: ScoringInput[],
  options: ScoringOptions = {}
): (ScoringInput & { composite_score: number; _scoring: Record<string, number> })[] {
  const scored = results.map(row => ({
    ...row,
    composite_score: calculateFiveFactorScore(row, options),
    _scoring: {
      temporal: calculateTemporalScore(row),
      usage: calculateUsageScore(row.access_count || 0),
      importance: calculateImportanceScore(row.importance_tier || 'normal', row.importance_weight),
      pattern: calculatePatternScore(row, options),
      citation: calculateCitationScore(row),
    },
  }));

  return scored.sort((a, b) => b.composite_score - a.composite_score);
}

/**
 * Legacy batch scoring for backward compatibility.
 *
 * Each result is augmented with:
 * - `composite_score`: Six-factor composite (0-1) combining similarity,
 *   importance, recency, popularity, tierBoost, and retrievability scores.
 * - `_scoring`: Breakdown of individual factor values for diagnostics.
 *
 * Results are sorted descending by composite_score.
 *
 * @param results - Array of scoring input rows
 * @param options - Optional scoring configuration
 * @returns Scored and sorted results with composite_score and _scoring breakdown
 */
export function applyCompositeScoring(
  results: ScoringInput[],
  options: ScoringOptions = {}
): (ScoringInput & { composite_score: number; _scoring: Record<string, number> })[] {
  if (options.use_five_factor_model) {
    return applyFiveFactorScoring(results, options);
  }

  const scored = results.map(row => {
    const tier = row.importance_tier || 'normal';
    return {
      ...row,
      composite_score: calculateCompositeScore(row, options),
      _scoring: {
        similarity: (Number(row.similarity) || 0) / 100,
        importance: row.importance_weight || 0.5,
        recency: calculateRecencyScore(row.updated_at || row.created_at, tier),
        popularity: calculatePopularityScore(row.access_count || 0, parseLastAccessed(row.last_accessed), row.created_at || null),
        tierBoost: getTierBoost(tier),
        retrievability: calculateRetrievabilityScore(row),
      },
    };
  });

  return scored.sort((a, b) => b.composite_score - a.composite_score);
}

/**
 * T032: Get 5-factor score breakdown.
 *
 * @param row - Scoring input row with memory fields
 * @param options - Optional scoring configuration
 * @returns Detailed breakdown of each factor's value, weight, and contribution
 */
export function getFiveFactorBreakdown(row: ScoringInput, options: ScoringOptions = {}): FiveFactorBreakdown {
  const rawWeights: FiveFactorWeights = { ...FIVE_FACTOR_WEIGHTS, ...(options.weights as Partial<FiveFactorWeights>) };
  const wSum = rawWeights.temporal + rawWeights.usage + rawWeights.importance + rawWeights.pattern + rawWeights.citation;
  const weights: FiveFactorWeights = Math.abs(wSum - 1.0) > 0.001 && wSum > 0
    ? {
        temporal: rawWeights.temporal / wSum,
        usage: rawWeights.usage / wSum,
        importance: rawWeights.importance / wSum,
        pattern: rawWeights.pattern / wSum,
        citation: rawWeights.citation / wSum,
      }
    : rawWeights;
  const tier = row.importance_tier || 'normal';

  const temporal = calculateTemporalScore(row);
  const usage = calculateUsageScore(row.access_count || 0);
  const importance = calculateImportanceScore(tier, row.importance_weight);
  const pattern = calculatePatternScore(row, options);
  const citation = calculateCitationScore(row);

  return {
    factors: {
      temporal: { value: temporal, weight: weights.temporal, contribution: temporal * weights.temporal, description: 'FSRS retrievability decay' },
      usage: { value: usage, weight: weights.usage, contribution: usage * weights.usage, description: 'Access frequency boost' },
      importance: { value: importance, weight: weights.importance, contribution: importance * weights.importance, description: 'Tier-based importance' },
      pattern: { value: pattern, weight: weights.pattern, contribution: pattern * weights.pattern, description: 'Query pattern alignment' },
      citation: { value: citation, weight: weights.citation, contribution: citation * weights.citation, description: 'Citation recency' },
    },
    total: calculateFiveFactorScore(row, options),
    model: '5-factor',
  };
}

/**
 * Legacy score breakdown for backward compatibility.
 *
 * @param row - Scoring input row with memory fields
 * @param options - Optional scoring configuration
 * @returns Detailed breakdown of each factor (5-factor or 6-factor-legacy)
 */
export function getScoreBreakdown(row: ScoringInput, options: ScoringOptions = {}): FiveFactorBreakdown | LegacyScoreBreakdown {
  if (options.use_five_factor_model) {
    return getFiveFactorBreakdown(row, options);
  }

  const rawWeights: LegacyWeights = { ...DEFAULT_WEIGHTS, ...(options.weights as Partial<LegacyWeights>) };
  const wSum = rawWeights.similarity + rawWeights.importance + rawWeights.recency
    + rawWeights.popularity + rawWeights.tierBoost + rawWeights.retrievability;
  const weights: LegacyWeights = Math.abs(wSum - 1.0) > 0.001 && wSum > 0
    ? {
        similarity: rawWeights.similarity / wSum,
        importance: rawWeights.importance / wSum,
        recency: rawWeights.recency / wSum,
        popularity: rawWeights.popularity / wSum,
        tierBoost: rawWeights.tierBoost / wSum,
        retrievability: rawWeights.retrievability / wSum,
      }
    : rawWeights;
  const tier = row.importance_tier || 'normal';

  const similarity = (Number(row.similarity) || 0) / 100;
  const importance = row.importance_weight || 0.5;
  const recency = calculateRecencyScore(row.updated_at || row.created_at, tier);
  const popularity = calculatePopularityScore(row.access_count || 0, parseLastAccessed(row.last_accessed), row.created_at || null);
  const tierBoost = getTierBoost(tier);
  const retrievability = calculateRetrievabilityScore(row);

  return {
    factors: {
      similarity: { value: similarity, weight: weights.similarity, contribution: similarity * weights.similarity },
      importance: { value: importance, weight: weights.importance, contribution: importance * weights.importance },
      recency: { value: recency, weight: weights.recency, contribution: recency * weights.recency },
      popularity: { value: popularity, weight: weights.popularity, contribution: popularity * weights.popularity },
      tierBoost: { value: tierBoost, weight: weights.tierBoost, contribution: tierBoost * weights.tierBoost },
      retrievability: { value: retrievability, weight: weights.retrievability, contribution: retrievability * weights.retrievability },
    },
    total: calculateCompositeScore(row, options),
    model: '6-factor-legacy',
  };
}

// ───────────────────────────────────────────────────────────────
// 6. SCORE NORMALIZATION

// ───────────────────────────────────────────────────────────────
/**
 * Check if composite score normalization is enabled.
 * Default: TRUE. Set SPECKIT_SCORE_NORMALIZATION=false to disable.
 *
 * @returns True if normalization is enabled (default: ON)
 */
export function isCompositeNormalizationEnabled(): boolean {
  return process.env.SPECKIT_SCORE_NORMALIZATION?.toLowerCase() !== 'false';
}

/**
 * Apply min-max normalization to composite scores, mapping to [0,1].
 * Gated behind SPECKIT_SCORE_NORMALIZATION env var — returns unchanged when disabled.
 *
 * - If all scores are equal, they normalize to 0.0 (no meaningful differentiation).
 * - If a single result, it normalizes to 0.0.
 * - Returns empty array when given empty array.
 *
 * @param scores - Array of raw composite scores
 * @returns Normalized scores mapped to [0, 1] (or unchanged when disabled)
 */
export function normalizeCompositeScores(scores: number[]): number[] {
  if (scores.length === 0) return [];
  if (!isCompositeNormalizationEnabled()) return scores;

  // Use loop-based min/max instead of
  // Math.max(...scores) / Math.min(...scores) which causes stack overflow on arrays
  // Larger than ~100K elements (exceeds JS call-stack argument limit).
  let maxScore = -Infinity;
  let minScore = Infinity;
  let hasFiniteScore = false;
  for (const s of scores) {
    if (!Number.isFinite(s)) continue;
    hasFiniteScore = true;
    if (s > maxScore) maxScore = s;
    if (s < minScore) minScore = s;
  }
  if (!hasFiniteScore) return scores.map(() => 0);
  const range = maxScore - minScore;

  if (range > 0) {
    return scores.map(s => Number.isFinite(s) ? (s - minScore) / range : 0);
  } else {
    return scores.map(s => Number.isFinite(s) ? 0.0 : 0);
  }
}
