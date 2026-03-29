// ───────────────────────────────────────────────────────────────
// MODULE: Search Utilities
// ───────────────────────────────────────────────────────────────
// Extracted from handlers/memory-search.ts
// Small, stateless utility functions used during search:
// quality filtering, threshold resolution, cache key building,
// context type resolution, and artifact routing helpers.

import { applyRoutingWeights } from './artifact-routing.js';
import type { RoutingResult, WeightedResult } from './artifact-routing.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

/**
 * Minimal row shape for search utility functions.
 * Mirrors the subset of MemorySearchRow fields that these helpers access.
 */
interface SearchUtilRow extends Record<string, unknown> {
  id: number;
  contextType?: string;
  context_type?: string;
  quality_score?: number;
}

interface CacheArgsInput {
  normalizedQuery: string | null;
  hasValidConcepts: boolean;
  concepts?: string[];
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  limit: number;
  mode?: string;
  tier?: string;
  contextType?: string;
  useDecay: boolean;
  includeArchived: boolean;
  qualityThreshold?: number;
  applyStateLimits: boolean | undefined;
  includeContiguity: boolean;
  includeConstitutional: boolean;
  includeContent: boolean;
  anchors?: string[] | string;
  detectedIntent: string | null;
  minState: string;
  rerank: boolean;
  applyLengthPenalty: boolean;
  sessionId?: string;
  enableSessionBoost: boolean;
  enableCausalBoost: boolean;
  includeTrace?: boolean;
}

/* ───────────────────────────────────────────────────────────────
   2. FUNCTIONS
──────────────────────────────────────────────────────────────── */

/**
 * Resolve the context type from a row, preferring camelCase over snake_case.
 */
function resolveRowContextType(row: SearchUtilRow): string | undefined {
  if (typeof row.contextType === 'string' && row.contextType.length > 0) {
    return row.contextType;
  }
  if (typeof row.context_type === 'string' && row.context_type.length > 0) {
    return row.context_type;
  }
  return undefined;
}

/**
 * Filter results by minimum quality score.
 * Returns all results if no valid threshold is provided.
 */
function filterByMinQualityScore(results: SearchUtilRow[], minQualityScore?: number): SearchUtilRow[] {
  if (typeof minQualityScore !== 'number' || !Number.isFinite(minQualityScore)) {
    return results;
  }

  const threshold = Math.max(0, Math.min(1, minQualityScore));
  return results.filter((result) => {
    const rawScore = result.quality_score as number | undefined;
    const score = typeof rawScore === 'number' && Number.isFinite(rawScore) ? rawScore : 0;
    return score >= threshold;
  });
}

/**
 * Resolve the quality threshold from camelCase or snake_case parameter.
 */
function resolveQualityThreshold(minQualityScore?: number, minQualityScoreSnake?: number): number | undefined {
  if (typeof minQualityScore === 'number' && Number.isFinite(minQualityScore)) {
    return minQualityScore;
  }

  if (typeof minQualityScoreSnake === 'number' && Number.isFinite(minQualityScoreSnake)) {
    return minQualityScoreSnake;
  }

  return undefined;
}

/**
 * Build a cache key arguments object from search parameters.
 */
function buildCacheArgs({
  normalizedQuery,
  hasValidConcepts,
  concepts,
  specFolder,
  tenantId,
  userId,
  agentId,
  sharedSpaceId,
  limit,
  mode,
  tier,
  contextType,
  useDecay,
  includeArchived,
  qualityThreshold,
  applyStateLimits,
  includeContiguity,
  includeConstitutional,
  includeContent,
  anchors,
  detectedIntent,
  minState,
  rerank,
  applyLengthPenalty,
  sessionId,
  enableSessionBoost,
  enableCausalBoost,
  includeTrace = false,
}: CacheArgsInput): Record<string, unknown> {
  return {
    query: normalizedQuery,
    concepts: hasValidConcepts ? concepts : undefined,
    specFolder,
    tenantId,
    userId,
    agentId,
    sharedSpaceId,
    limit,
    mode,
    tier,
    contextType,
    useDecay,
    includeArchived,
    qualityThreshold,
    applyStateLimits,
    includeContiguity,
    includeConstitutional,
    includeContent,
    anchors,
    intent: detectedIntent,
    minState,
    rerank,
    applyLengthPenalty,
    sessionId,
    enableSessionBoost,
    enableCausalBoost,
    includeTrace,
  };
}

/**
 * Resolve the best available query string for artifact routing.
 * Falls back to joining concepts if no query string is provided.
 */
function resolveArtifactRoutingQuery(query: string | null, concepts?: string[]): string {
  if (typeof query === 'string' && query.trim().length > 0) {
    return query;
  }

  if (Array.isArray(concepts) && concepts.length > 0) {
    return concepts.join(' ');
  }

  return '';
}

/**
 * Apply artifact routing weights to search results.
 * No-op if routing result is absent, unknown, or zero-confidence.
 */
function applyArtifactRouting(results: SearchUtilRow[], routingResult?: RoutingResult): SearchUtilRow[] {
  if (!Array.isArray(results) || results.length === 0) {
    return results;
  }

  if (!routingResult || routingResult.detectedClass === 'unknown' || routingResult.confidence <= 0) {
    return results;
  }

  return applyRoutingWeights(results as WeightedResult[], routingResult.strategy) as SearchUtilRow[];
}

/* ───────────────────────────────────────────────────────────────
   3. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  resolveRowContextType,
  filterByMinQualityScore,
  resolveQualityThreshold,
  buildCacheArgs,
  resolveArtifactRoutingQuery,
  applyArtifactRouting,
};

export type {
  SearchUtilRow,
  CacheArgsInput,
};
