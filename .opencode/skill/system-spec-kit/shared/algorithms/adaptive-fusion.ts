// ---------------------------------------------------------------
// MODULE: Adaptive Fusion
// ---------------------------------------------------------------
// Local
import { fuseResultsMulti } from './rrf-fusion.js';

// Type-only
import type { RrfItem, FusionResult, RankedList } from './rrf-fusion.js';

// Feature catalog: Hybrid search pipeline
// Feature catalog: Adaptive shadow ranking, bounded proposals, and rollback


/* --- 1. INTERFACES --- */

/** Represents fusion weights. */
export interface FusionWeights {
  /** Weight for semantic/vector search results (0-1) */
  semanticWeight: number;
  /** Weight for keyword/lexical search results (0-1) */
  keywordWeight: number;
  /** Weight for recency-based scoring (0-1) */
  recencyWeight: number;
  /** Weight for graph channel results (0-1). Only used when graph channel active. */
  graphWeight?: number;
  /** Bias toward causal-edge signals within graph-assisted ranking (0-1). */
  graphCausalBias?: number;
}

/** Represents degraded mode contract. */
export interface DegradedModeContract {
  /** What failed */
  failureMode: string;
  /** What was used instead */
  fallbackMode: string;
  /** Impact on result confidence (0-1, where 0 = no impact, 1 = total loss) */
  confidenceImpact: number;
  /** Retry guidance for callers and typed trace contracts */
  retryRecommendation: 'immediate' | 'delayed' | 'none';
}

/** Represents adaptive fusion result. */
export interface AdaptiveFusionResult {
  results: FusionResult[];
  weights: FusionWeights;
  degraded?: DegradedModeContract;
  darkRunDiff?: DarkRunDiff;
}

/** Represents dark run diff. */
export interface DarkRunDiff {
  standardCount: number;
  adaptiveCount: number;
  orderDifferences: number;
  topResultChanged: boolean;
}

/* --- 2. WEIGHT PROFILES --- */

const INTENT_WEIGHT_PROFILES: Record<string, FusionWeights> = {
  understand:      { semanticWeight: 0.7, keywordWeight: 0.2, recencyWeight: 0.1, graphWeight: 0.15, graphCausalBias: 0.10 },
  find_spec:       { semanticWeight: 0.7, keywordWeight: 0.2, recencyWeight: 0.1, graphWeight: 0.30, graphCausalBias: 0.10 },
  fix_bug:         { semanticWeight: 0.4, keywordWeight: 0.4, recencyWeight: 0.2, graphWeight: 0.10, graphCausalBias: 0.15 },
  add_feature:     { semanticWeight: 0.5, keywordWeight: 0.3, recencyWeight: 0.2, graphWeight: 0.20, graphCausalBias: 0.15 },
  refactor:        { semanticWeight: 0.6, keywordWeight: 0.3, recencyWeight: 0.1, graphWeight: 0.15, graphCausalBias: 0.10 },
  security_audit:  { semanticWeight: 0.3, keywordWeight: 0.5, recencyWeight: 0.2, graphWeight: 0.15, graphCausalBias: 0.10 },
  find_decision:   { semanticWeight: 0.3, keywordWeight: 0.2, recencyWeight: 0.1, graphWeight: 0.50, graphCausalBias: 0.15 },
};

const DEFAULT_WEIGHTS: FusionWeights = {
  semanticWeight: 0.5,
  keywordWeight: 0.3,
  recencyWeight: 0.2,
  graphWeight: 0.15,
  graphCausalBias: 0.10,
};

/* --- 3. FEATURE FLAG --- */

const FEATURE_FLAG = 'SPECKIT_ADAPTIVE_FUSION';

/** Proportional weight shift factor applied per document type to fine-tune intent weights.
 *  Multiplied against the base weight (20% shift) so small weights aren't disproportionately affected.
 *  Env-tunable via SPECKIT_DOC_TYPE_WEIGHT_FACTOR (default 1.2 = 20% proportional shift). */
const DOC_TYPE_WEIGHT_FACTOR = parseFloat(process.env.SPECKIT_DOC_TYPE_WEIGHT_FACTOR || '') || 1.2;

/** Scaling factor applied to recency freshness before adding to RRF score. */
const RECENCY_BOOST_SCALE = 0.1;

function isFeatureEnabled(flagName: string, identity?: string): boolean {
  const rawFlag = process.env[flagName]?.toLowerCase();
  if (rawFlag === 'false') return false;

  const flagEnabled = rawFlag === undefined || rawFlag.trim().length === 0 || rawFlag === 'true';
  if (!flagEnabled) return false;

  const rawRollout = process.env.SPECKIT_ROLLOUT_PERCENT;
  const rolloutPercent = typeof rawRollout === 'string' && rawRollout.trim().length > 0
    ? Number.parseInt(rawRollout, 10)
    : 100;
  const clampedRollout = Number.isFinite(rolloutPercent)
    ? Math.max(0, Math.min(100, rolloutPercent))
    : 100;

  if (clampedRollout >= 100) return true;
  if (clampedRollout <= 0) return false;
  if (!identity || identity.trim().length === 0) return false;

  let hash = 0;
  for (let i = 0; i < identity.length; i += 1) {
    hash = (hash * 31 + identity.charCodeAt(i)) >>> 0;
  }
  return (hash % 100) < clampedRollout;
}

/**
 * Check whether adaptive fusion is enabled via the feature flag and rollout policy.
 *
 * @param identity - Optional identity string for rollout targeting
 * @returns True if adaptive fusion is enabled
 */
export function isAdaptiveFusionEnabled(identity?: string): boolean {
  return isFeatureEnabled(FEATURE_FLAG, identity);
}

/* --- 4. WEIGHT COMPUTATION --- */

/**
 * Compute adaptive fusion weights based on intent and optional document type.
 * Document type can shift weights: e.g., 'decision' docs favour keywords,
 * 'implementation' docs favour recency.
 *
 * @param intent - Classified query intent type
 * @param documentType - Optional document type for weight adjustment
 * @returns Computed fusion weights
 */
export function getAdaptiveWeights(
  intent: string,
  documentType?: string
): FusionWeights {
  const base = INTENT_WEIGHT_PROFILES[intent] ?? { ...DEFAULT_WEIGHTS };
  const weights: FusionWeights = { ...base };

  // Document-type adjustments (proportional shifts, keep sum <= 1.0)
  // Uses DOC_TYPE_WEIGHT_FACTOR (default 1.2 = 20% proportional shift) so
  // small weights aren't disproportionately affected by flat additive shifts.
  if (documentType) {
    const inverseFactor = 2 - DOC_TYPE_WEIGHT_FACTOR; // e.g. 0.8 when factor is 1.2
    switch (documentType) {
      case 'decision':
        // Decisions are best found by exact keyword matches
        weights.keywordWeight = Math.min(1.0, weights.keywordWeight * DOC_TYPE_WEIGHT_FACTOR);
        weights.semanticWeight = Math.max(0, weights.semanticWeight * inverseFactor);
        break;
      case 'implementation':
        // Implementation docs: recency matters more
        weights.recencyWeight = Math.min(1.0, weights.recencyWeight * DOC_TYPE_WEIGHT_FACTOR);
        weights.semanticWeight = Math.max(0, weights.semanticWeight * inverseFactor);
        break;
      case 'research':
        // Research docs: semantic similarity is paramount
        weights.semanticWeight = Math.min(1.0, weights.semanticWeight * DOC_TYPE_WEIGHT_FACTOR);
        weights.keywordWeight = Math.max(0, weights.keywordWeight * inverseFactor);
        break;
      // No default adjustment needed
    }
  }

  const activeGraphWeight = typeof weights.graphWeight === 'number' && Number.isFinite(weights.graphWeight) && weights.graphWeight > 0
    ? weights.graphWeight
    : 0;
  const activeSum =
    weights.semanticWeight +
    weights.keywordWeight +
    weights.recencyWeight +
    activeGraphWeight;
  if (activeSum > 0 && Math.abs(activeSum - 1.0) > 0.001) {
    weights.semanticWeight /= activeSum;
    weights.keywordWeight /= activeSum;
    weights.recencyWeight /= activeSum;
    if (activeGraphWeight > 0) {
      weights.graphWeight = activeGraphWeight / activeSum;
    }
  }

  return weights;
}

/* --- 5. ADAPTIVE FUSION --- */

/**
 * Weighted RRF fusion. Applies FusionWeights to source lists before
 * passing to `fuseResultsMulti`. The semanticWeight/keywordWeight map
 * to vector/lexical list weights; recencyWeight is applied as a
 * post-fusion boost based on item timestamps.
 *
 * @param semanticResults - Results from vector/semantic search
 * @param keywordResults - Results from keyword/lexical search
 * @param weights - Fusion weights for each channel
 * @returns Fused and scored results sorted by RRF score
 */
export function adaptiveFuse(
  semanticResults: RrfItem[],
  keywordResults: RrfItem[],
  weights: FusionWeights
): FusionResult[] {
  const lists: RankedList[] = [];

  if (semanticResults.length > 0 && weights.semanticWeight > 0) {
    lists.push({
      source: 'vector',
      results: semanticResults,
      weight: weights.semanticWeight,
    });
  }

  if (keywordResults.length > 0 && weights.keywordWeight > 0) {
    lists.push({
      source: 'keyword',
      results: keywordResults,
      weight: weights.keywordWeight,
    });
  }

  if (lists.length === 0) {
    // AI: Fix F3 — return empty on all-zero weights.
    return [];
  }

  const fused = fuseResultsMulti(lists);

  // Apply recency boost if recencyWeight > 0, then re-normalize to [0,1]
  // P1-007: Boost MUST be followed by normalization to keep scores in [0,1]
  if (weights.recencyWeight > 0) {
    applyRecencyBoost(fused, weights.recencyWeight);

    const maxScore = fused.reduce((mx, r) => Math.max(mx, r.rrfScore), 0);
    if (maxScore > 1.0) {
      for (const r of fused) {
        r.rrfScore /= maxScore;
      }
    }
  }

  // Re-sort after recency boost
  fused.sort((a, b) => b.rrfScore - a.rrfScore);

  return fused;
}

/**
 * Apply a recency boost to fused results. Items with a `created_at`
 * timestamp receive a bonus proportional to how recent they are.
 * Falls back gracefully when no timestamps are present.
 */
function applyRecencyBoost(results: FusionResult[], recencyWeight: number): void {
  const now = Date.now();
  const ONE_DAY_MS = 86_400_000;
  const MAX_AGE_DAYS = 365;

  for (const r of results) {
    const createdAt = r.created_at as string | undefined;
    if (!createdAt) continue;

    try {
      const ts = new Date(createdAt).getTime();
      if (Number.isNaN(ts)) continue;

      const ageDays = Math.max(0, (now - ts) / ONE_DAY_MS);
      // Exponential decay: recent items get higher boost
      const freshness = Math.exp(-ageDays / MAX_AGE_DAYS);
      r.rrfScore += freshness * recencyWeight * RECENCY_BOOST_SCALE;
    } catch (_err: unknown) {
      if (_err instanceof Error) {
        void _err.message;
      }
      /* AI-GUARD: Skip items with invalid dates — never fail the fusion pipeline */
    }
  }
}

/* --- 6. STANDARD FALLBACK --- */

/**
 * Standard RRF fusion without adaptive weighting (deterministic fallback).
 * Uses equal weights for all sources.
 *
 * @param semanticResults - Results from vector/semantic search
 * @param keywordResults - Results from keyword/lexical search
 * @returns Fused results with equal-weight RRF scores
 */
export function standardFuse(
  semanticResults: RrfItem[],
  keywordResults: RrfItem[]
): FusionResult[] {
  const lists: RankedList[] = [];

  if (semanticResults.length > 0) {
    lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
  }

  if (keywordResults.length > 0) {
    lists.push({ source: 'keyword', results: keywordResults, weight: 1.0 });
  }

  if (lists.length === 0) return [];

  return fuseResultsMulti(lists);
}

/* --- 7. DARK-RUN MODE --- */

function computeDarkRunDiff(
  standardResults: FusionResult[],
  adaptiveResults: FusionResult[]
): DarkRunDiff {
  let orderDifferences = 0;
  const maxLen = Math.max(standardResults.length, adaptiveResults.length);

  for (let i = 0; i < maxLen; i++) {
    const stdId = standardResults[i]?.id;
    const adpId = adaptiveResults[i]?.id;
    if (stdId !== adpId) {
      orderDifferences++;
    }
  }

  const topResultChanged =
    standardResults.length > 0 &&
    adaptiveResults.length > 0 &&
    standardResults[0].id !== adaptiveResults[0].id;

  return {
    standardCount: standardResults.length,
    adaptiveCount: adaptiveResults.length,
    orderDifferences,
    topResultChanged,
  };
}

/* --- 8. MAIN ENTRY POINT --- */

/**
 * Adaptive hybrid fusion entry point.
 *
 * - Feature flag ON  -> use adaptive weighted fusion
 * - Feature flag OFF -> deterministic standard RRF fallback
 * - Dark-run mode: compute both, log diff, return standard
 *
 * @param semanticResults - Results from vector/semantic search
 * @param keywordResults  - Results from keyword/lexical search
 * @param intent          - Classified intent of the query
 * @param options         - Optional: documentType, identity, darkRun
 */
export function hybridAdaptiveFuse(
  semanticResults: RrfItem[],
  keywordResults: RrfItem[],
  intent: string,
  options: {
    documentType?: string;
    identity?: string;
    darkRun?: boolean;
  } = {}
): AdaptiveFusionResult {
  const { documentType, identity, darkRun = false } = options;
  const weights = getAdaptiveWeights(intent, documentType);
  const enabled = isAdaptiveFusionEnabled(identity);

  const computeStandardSafe = (): AdaptiveFusionResult => {
    try {
      return {
        results: standardFuse(semanticResults, keywordResults),
        weights: { semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 },
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      return {
        results: [],
        weights,
        degraded: {
          failureMode: `standard_fusion_error: ${msg}`,
          fallbackMode: 'empty_results',
          confidenceImpact: 1.0,
          retryRecommendation: 'immediate',
        },
      };
    }
  };

  // Feature disabled: return deterministic standard RRF without adaptive work.
  if (!enabled && !darkRun) {
    return computeStandardSafe();
  }

  let adaptiveResults: FusionResult[];
  try {
    adaptiveResults = adaptiveFuse(semanticResults, keywordResults, weights);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    const standardFallback = computeStandardSafe();
    return {
      ...standardFallback,
      weights,
      degraded: {
        failureMode: `adaptive_fusion_error: ${msg}`,
        fallbackMode: standardFallback.results.length > 0 ? 'standard_rrf' : 'empty_results',
        confidenceImpact: 0.3,
        retryRecommendation: standardFallback.results.length > 0 ? 'none' : 'immediate',
      },
    };
  }

  if (!darkRun) {
    return {
      results: adaptiveResults,
      weights,
    };
  }

  const standardForDiff = computeStandardSafe();
  const diff = computeDarkRunDiff(standardForDiff.results, adaptiveResults);
  return {
    results: enabled ? adaptiveResults : standardForDiff.results,
    weights,
    darkRunDiff: diff,
    degraded: standardForDiff.degraded,
  };
}

/* --- 9. EXPORTS --- */

// Named exports above via `export` keyword. Re-export for convenience:
export {
  INTENT_WEIGHT_PROFILES,
  DEFAULT_WEIGHTS,
  FEATURE_FLAG,
};
