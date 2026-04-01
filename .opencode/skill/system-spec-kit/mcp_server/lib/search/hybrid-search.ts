// ───────────────────────────────────────────────────────────────
// MODULE: Hybrid Search
// ───────────────────────────────────────────────────────────────
// Combines vector, FTS, and BM25 search with fallback

// 1. IMPORTS

// Local
import { getIndex, isBm25Enabled } from './bm25-index.js';
import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
import { getAdaptiveWeights, isAdaptiveFusionEnabled } from '@spec-kit/shared/algorithms/adaptive-fusion';
import { CO_ACTIVATION_CONFIG, spreadActivation } from '../cognitive/co-activation.js';
import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
import { INTENT_LAMBDA_MAP, classifyIntent } from './intent-classifier.js';
import { fts5Bm25Search } from './sqlite-fts.js';
import { DEGREE_CHANNEL_WEIGHT } from './graph-search-fn.js';
import {
  isMMREnabled,
  isCrossEncoderEnabled,
  isLocalRerankerEnabled,
  isSearchFallbackEnabled,
  isDocscoreAggregationEnabled,
  isDegreeBoostEnabled,
  isContextHeadersEnabled,
} from './search-flags.js';
import { rerankLocal } from './local-reranker.js';
import { computeDegreeScores } from './graph-search-fn.js';
import type { GraphSearchFn } from './search-types.js';

// Feature catalog: Hybrid search pipeline

export type { GraphSearchFn } from './search-types.js';

import { routeQuery } from './query-router.js';
import { isComplexityRouterEnabled } from './query-classifier.js';
import { enforceChannelRepresentation } from './channel-enforcement.js';
import {
  truncateByConfidence,
  isConfidenceTruncationEnabled,
  DEFAULT_MIN_RESULTS,
  GAP_THRESHOLD_MULTIPLIER,
} from './confidence-truncation.js';
import {
  getDynamicTokenBudget,
  isDynamicTokenBudgetEnabled,
  DEFAULT_TOKEN_BUDGET_CONFIG,
} from './dynamic-token-budget.js';
import { ensureDescriptionCache, getSpecsBasePaths } from './folder-discovery.js';
import {
  isFolderScoringEnabled,
  lookupFolders,
  computeFolderRelevanceScores,
  enrichResultsWithFolderScores,
  twoPhaseRetrieval,
} from './folder-relevance.js';

import { collapseAndReassembleChunkResults } from '../scoring/mpab-aggregation.js';

// Type-only
import type Database from 'better-sqlite3';
import type { SpreadResult } from '../cognitive/co-activation.js';
import type { MMRCandidate } from '@spec-kit/shared/algorithms/mmr-reranker';
import type { FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
import type { ChannelName } from './query-router.js';
import type { EnforcementResult } from './channel-enforcement.js';
import type { TruncationResult } from './confidence-truncation.js';

// 2. INTERFACES

type VectorSearchFn = (
  embedding: Float32Array | number[],
  options: Record<string, unknown>
) => Array<Record<string, unknown>>;

interface HybridSearchOptions {
  limit?: number;
  specFolder?: string;
  minSimilarity?: number;
  useBm25?: boolean;
  useFts?: boolean;
  useVector?: boolean;
  useGraph?: boolean;
  includeArchived?: boolean;
  includeContent?: boolean;
  /**
   * Evaluation-only mode.
   * When true, preserve the requested top-K window by bypassing confidence
   * truncation and token-budget truncation without changing live defaults.
   */
  evaluationMode?: boolean;
  /** Classified query intent for adaptive fusion weight selection (e.g. 'understand', 'fix_bug'). */
  intent?: string;
  /** Optional trigger phrases for query-classifier trigger-match routing path. */
  triggerPhrases?: string[];
  /**
   * Internal fallback override: when true, bypass complexity routing and
   * enable all retrieval channels for this search call.
   */
  forceAllChannels?: boolean;
  /**
   * Internal raw-candidate mode used by the Stage 1 pipeline.
   * When true, stop after channel collection and return pre-fusion candidates.
   */
  skipFusion?: boolean;
  /**
   * Internal pipeline handoff mode.
   * When true, return immediately after adaptive/RRF fusion so Stage 2/3 can
   * apply the remaining pipeline scoring and aggregation steps.
   */
  stopAfterFusion?: boolean;
}

interface HybridSearchResult {
  id: number | string;
  /**
   * Normalized relevance score (0-1). Semantics depend on `source`:
   * - `'vector'` — cosine similarity from sqlite-vec (normalized from 0-100 to 0-1)
   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized per source group)
   * - `'fts'` — FTS5 rank score (absolute value, min-max normalized per source group)
   * - `'graph'` — graph traversal relevance
   *
   * After hybrid merge, all source scores are min-max normalized to 0-1 within
   * their source group to ensure fair cross-method comparison (see P3-02 fix).
   */
  score: number;
  source: string;
  title?: string;
  [key: string]: unknown;
}

/** Non-enumerable shadow metadata attached to result arrays via Object.defineProperty. */
interface ShadowMetaArray {
  _s4shadow?: unknown;
  _s4attribution?: unknown;
  _degradation?: unknown;
}

/** Normalize a fused RRF result to the HybridSearchResult contract. */
function toHybridResult(result: FusionResult): HybridSearchResult {
  const sourceCandidate = (result as { source?: unknown }).source;
  const primarySource = result.sources[0] ?? 'hybrid';
  const scoreCandidate = (result as { score?: unknown }).score;

  return {
    ...result,
    id: result.id,
    score: typeof scoreCandidate === 'number' ? scoreCandidate : result.rrfScore,
    source: typeof sourceCandidate === 'string' ? sourceCandidate : primarySource,
  };
}

// 3. SPRINT 3 PIPELINE METADATA

/**
 * Optional metadata about pipeline stages attached to enhanced search results.
 * Only populated when the corresponding feature flags are enabled.
 */
interface Sprint3PipelineMeta {
  /** Query complexity routing result (SPECKIT_COMPLEXITY_ROUTER). */
  routing?: {
    tier: string;
    channels: string[];
    skippedChannels: string[];
    featureFlagEnabled: boolean;
    confidence: string;
    features: Record<string, unknown>;
  };
  /** Channel enforcement result (SPECKIT_CHANNEL_MIN_REP). */
  enforcement?: { applied: boolean; promotedCount: number; underRepresentedChannels: string[] };
  /** Confidence truncation result (SPECKIT_CONFIDENCE_TRUNCATION). */
  truncation?: {
    truncated: boolean;
    originalCount: number;
    truncatedCount: number;
    medianGap: number;
    cutoffGap: number;
    cutoffIndex: number;
    thresholdMultiplier: number;
    minResultsGuaranteed: number;
    featureFlagEnabled: boolean;
  };
  /** Dynamic token budget result (SPECKIT_DYNAMIC_TOKEN_BUDGET). */
  tokenBudget?: {
    tier: string;
    budget: number;
    applied: boolean;
    featureFlagEnabled: boolean;
    configValues: Record<string, number>;
    headerOverhead: number;
    adjustedBudget: number;
  };
}

// 4. PI-A2: DEGRADATION TYPES

/** Fallback tier in the 3-tier degradation chain. */
type FallbackTier = 1 | 2 | 3;

/** Why degradation was triggered at a given tier. */
interface DegradationTrigger {
  reason: 'low_quality' | 'insufficient_results' | 'both';
  topScore: number;
  resultCount: number;
  relativeGap?: number;
}

/** Record of a single degradation event during tiered fallback. */
interface DegradationEvent {
  tier: FallbackTier;
  trigger: DegradationTrigger;
  resultCountBefore: number;
  resultCountAfter: number;
}

/**
 * Absolute quality floor for degradation checks.
 *
 * Raw RRF scores are typically small decimals (often <0.05), so a
 * high fixed threshold causes false degradations. Use a conservative floor and
 * pair it with a relative-gap check to avoid score-scale coupling.
 */
const DEGRADATION_QUALITY_THRESHOLD = 0.02;

/** Minimum relative separation between top-1 and top-2 scores. */
const DEGRADATION_MIN_RELATIVE_GAP = 0.2;

/** Minimum result count: must have >= this many results to stay at current tier. */
const DEGRADATION_MIN_RESULTS = 3;

// 5. MODULE STATE

/** Default result limit when none is specified by the caller. */
const DEFAULT_LIMIT = 20;
/** Primary vector similarity floor for hybrid fallback passes (percentage units). */
const PRIMARY_FALLBACK_MIN_SIMILARITY = 30;
/** Secondary vector similarity floor for adaptive retry passes (percentage units). */
const SECONDARY_FALLBACK_MIN_SIMILARITY = 17;
/** Tier-2 vector similarity floor for quality-aware fallback (percentage units). */
const TIERED_FALLBACK_MIN_SIMILARITY = 10;

/** Minimum MMR candidates required for diversity reranking to be worthwhile. */
const MMR_MIN_CANDIDATES = 2;

/** Fallback lambda (diversity vs relevance) when intent is not in INTENT_LAMBDA_MAP. */
const MMR_DEFAULT_LAMBDA = 0.7;

/** Number of top results used as seeds for co-activation spreading. */
const SPREAD_ACTIVATION_TOP_N = 5;

/** Maximum contextual tree header length prepended to content (including brackets). */
const CONTEXT_HEADER_MAX_CHARS = 100;
/** Header/content separator characters added during contextual tree injection. */
const CONTEXT_HEADER_SEPARATOR_CHARS = 1;
/** Reserved token overhead per contextual header, calibrated to max header length. */
const CONTEXT_HEADER_TOKEN_OVERHEAD = Math.ceil(
  (CONTEXT_HEADER_MAX_CHARS + CONTEXT_HEADER_SEPARATOR_CHARS) / 4
);

let db: Database.Database | null = null;
let vectorSearchFn: VectorSearchFn | null = null;
let graphSearchFn: GraphSearchFn | null = null;

// 6. GRAPH CHANNEL METRICS (T008)

interface GraphChannelMetrics {
  totalQueries: number;
  graphHits: number;
  graphOnlyResults: number;
  multiSourceResults: number;
}

const graphMetrics: GraphChannelMetrics = {
  totalQueries: 0,
  graphHits: 0,
  graphOnlyResults: 0,
  multiSourceResults: 0,
};

/**
 * Return current graph channel metrics for health check reporting.
 * graphHitRate is computed as graphHits / totalQueries.
 */
function getGraphMetrics(): GraphChannelMetrics & { graphHitRate: number } {
  return {
    ...graphMetrics,
    graphHitRate: graphMetrics.totalQueries > 0
      ? graphMetrics.graphHits / graphMetrics.totalQueries
      : 0,
  };
}

/** Reset all graph channel metrics counters to zero. */
function resetGraphMetrics(): void {
  graphMetrics.totalQueries = 0;
  graphMetrics.graphHits = 0;
  graphMetrics.graphOnlyResults = 0;
  graphMetrics.multiSourceResults = 0;
}

// 7. INITIALIZATION

/**
 * Initialize hybrid search with database, vector search, and optional graph search dependencies.
 * @param database - The better-sqlite3 database instance for FTS and graph queries.
 * @param vectorFn - Optional vector search function for semantic similarity.
 * @param graphFn - Optional graph search function for causal/structural retrieval.
 */
function init(
  database: Database.Database,
  vectorFn: VectorSearchFn | null = null,
  graphFn: GraphSearchFn | null = null
): void {
  db = database;
  vectorSearchFn = vectorFn;
  graphSearchFn = graphFn;
}

// 8. BM25 SEARCH

/**
 * Search the BM25 index with optional spec folder filtering.
 * @param query - The search query string.
 * @param options - Optional limit and specFolder filter.
 * @returns Array of BM25-scored results tagged with source 'bm25'.
 */
function bm25Search(
  query: string,
  options: { limit?: number; specFolder?: string } = {}
): HybridSearchResult[] {
  if (!isBm25Enabled()) {
    console.warn('[hybrid-search] BM25 not enabled — returning empty bm25Search results');
    return [];
  }

  const { limit = DEFAULT_LIMIT, specFolder } = options;

  try {
    const index = getIndex();
    const results = index.search(query, limit);

    // BM25 document IDs are stringified
    // Numeric memory IDs (e.g., "42"), not spec folder paths. The old filter compared
    // R.id against specFolder which never matched. Use DB lookup to resolve spec_folder.

    // B7 FIX: Batch-resolve spec folders for all result IDs (was N+1 individual queries)
    // T72 SECURITY: Spec-folder scope MUST fail closed — any error in scope
    // resolution returns [] rather than leaking unscoped BM25 candidates.
    let specFolderMap: Map<number, string | null> | null = null;
    if (specFolder) {
      if (!db) {
        const error = new Error('Database unavailable for spec-folder scope lookup');
        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
        return [];
      }

      try {
        const ids = results.map((r: { id: string }) => Number(r.id));
        if (ids.length === 0) {
          return [];
        }
        const placeholders = ids.map(() => '?').join(',');
        const rows = db.prepare(
          `SELECT id, spec_folder FROM memory_index WHERE id IN (${placeholders})`
        ).all(...ids) as Array<{ id: number; spec_folder: string | null }>;
        specFolderMap = new Map();
        for (const row of rows) {
          specFolderMap.set(row.id, row.spec_folder);
        }
      } catch (error: unknown) {
        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
        return [];
      }

      // T72 DEFENSE-IN-DEPTH: If specFolder was requested but specFolderMap
      // is still null after the resolution block, something unexpected happened.
      // Fail closed rather than falling through to unscoped results.
      if (!specFolderMap) {
        const error = new Error('specFolderMap unexpectedly null after scope resolution');
        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
        return [];
      }
    }

    return results
      .filter((r: { id: string }) => {
        if (!specFolder) return true;
        if (!specFolderMap) return false;
        const folder = specFolderMap.get(Number(r.id));
        if (!folder) return false;
        return folder === specFolder || folder.startsWith(specFolder + '/');
      })
      .map((r: { id: string; score: number }) => ({
        ...r,
        source: 'bm25',
      }));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[hybrid-search] BM25 search failed: ${msg}`);
    return [];
  }
}

/**
 * Check whether the BM25 index is populated and available for search.
 * @returns True if the BM25 index exists and contains at least one document.
 */
function isBm25Available(): boolean {
  if (!isBm25Enabled()) {
    return false;
  }

  try {
    const index = getIndex();
    return index.getStats().documentCount > 0;
  } catch (_err: unknown) {
    // Swallow index-not-initialized errors; caller treats absence as unavailable
    return false;
  }
}

// 9. FTS SEARCH

/**
 * Check whether the FTS5 full-text search table exists in the database.
 * @returns True if the memory_fts table exists in the connected database.
 */
function isFtsAvailable(): boolean {
  if (!db) {
    console.warn('[hybrid-search] db not initialized — isFtsAvailable returning false');
    return false;
  }

  try {
    const result = (db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'
    `) as Database.Statement).get() as { name: string } | undefined;
    return !!result;
  } catch (_err: unknown) {
    // Swallow DB errors; caller treats absence as unavailable
    return false;
  }
}

/**
 * Run FTS5 full-text search with weighted BM25 scoring and optional spec folder filtering.
 * @param query - The search query string.
 * @param options - Optional limit, specFolder filter, and includeArchived flag.
 * @returns Array of FTS-scored results tagged with source 'fts'.
 */
function ftsSearch(
  query: string,
  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
): HybridSearchResult[] {
  if (!db || !isFtsAvailable()) {
    console.warn('[hybrid-search] db not initialized or FTS unavailable — returning empty ftsSearch results');
    return [];
  }

  const { limit = DEFAULT_LIMIT, specFolder, includeArchived = false } = options;

  try {
    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
    // Uses bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) for per-column weighting
    // (title 10x, trigger_phrases 5x, file_path 2x, content 1x)
    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });

    return bm25Results.map(row => ({
      ...row,
      id: row.id as number,
      score: row.fts_score || 0,
      source: 'fts',
    }));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[hybrid-search] FTS search failed: ${msg}`);
    return [];
  }
}

// 10. COMBINED LEXICAL SEARCH

/**
 * Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores.
 * @param query - The search query string.
 * @param options - Optional limit, specFolder filter, and includeArchived flag.
 * @returns Deduplicated array of merged results sorted by score descending.
 */
function combinedLexicalSearch(
  query: string,
  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
): HybridSearchResult[] {
  const ftsResults = ftsSearch(query, options);
  const bm25Results = bm25Search(query, options);

  // Merge by canonical ID, prefer FTS scores.
  // CanonicalResultId() prevents duplicate rows when one channel emits
  // Numeric IDs (42) and another emits string IDs ("42" or "mem:42").
  const merged = new Map<string, HybridSearchResult>();

  for (const r of ftsResults) {
    merged.set(canonicalResultId(r.id), r);
  }

  for (const r of bm25Results) {
    const canonicalId = canonicalResultId(r.id);
    if (!merged.has(canonicalId)) {
      merged.set(canonicalId, r);
    }
  }

  return Array.from(merged.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, options.limit || DEFAULT_LIMIT);
}

type RawChannelList = {
  source: string;
  results: Array<{ id: number | string; [key: string]: unknown }>;
};

function resolveRawCandidateScore(result: { score?: unknown; similarity?: unknown }): number {
  if (typeof result.score === 'number' && Number.isFinite(result.score)) {
    return result.score;
  }
  if (typeof result.similarity === 'number' && Number.isFinite(result.similarity)) {
    return result.similarity / 100;
  }
  return 0;
}

function getCandidateSources(result: HybridSearchResult): string[] {
  const sourceList = (result as { sources?: unknown }).sources;
  if (Array.isArray(sourceList)) {
    return sourceList.filter((value): value is string => typeof value === 'string');
  }
  return typeof result.source === 'string' && result.source.length > 0
    ? [result.source]
    : [];
}

function getCandidateSourceScores(result: HybridSearchResult): Record<string, number> {
  const sourceScores = (result as { sourceScores?: unknown }).sourceScores;
  if (sourceScores && typeof sourceScores === 'object' && !Array.isArray(sourceScores)) {
    const normalizedScores: Record<string, number> = {};
    for (const [source, score] of Object.entries(sourceScores as Record<string, unknown>)) {
      if (typeof score === 'number' && Number.isFinite(score)) {
        normalizedScores[source] = score;
      }
    }
    return normalizedScores;
  }

  const fallbackScores: Record<string, number> = {};
  const resultScore = typeof result.score === 'number' && Number.isFinite(result.score)
    ? result.score
    : 0;
  for (const source of getCandidateSources(result)) {
    fallbackScores[source] = resultScore;
  }
  return fallbackScores;
}

function mergeRawCandidate(
  existing: HybridSearchResult | undefined,
  incoming: HybridSearchResult
): HybridSearchResult {
  if (!existing) {
    const sources = getCandidateSources(incoming);
    const channelCount = sources.length;
    return {
      ...incoming,
      sources,
      channelCount,
      sourceScores: getCandidateSourceScores(incoming),
      channelAttribution: sources,
    };
  }

  const existingScore = typeof existing.score === 'number' && Number.isFinite(existing.score)
    ? existing.score
    : 0;
  const incomingScore = typeof incoming.score === 'number' && Number.isFinite(incoming.score)
    ? incoming.score
    : 0;
  const primary = incomingScore > existingScore ? incoming : existing;
  const secondary = primary === incoming ? existing : incoming;
  const sources = Array.from(new Set([
    ...getCandidateSources(existing),
    ...getCandidateSources(incoming),
  ]));
  const channelCount = sources.length;
  const crossChannelBonus = Math.min(0.06, 0.02 * Math.max(0, channelCount - 1));
  const mergedScore = Math.max(0, Math.min(1, Math.max(existingScore, incomingScore) + crossChannelBonus));

  return {
    ...(secondary ?? {}),
    ...primary,
    score: mergedScore,
    source: typeof primary.source === 'string' ? primary.source : (sources[0] ?? 'hybrid'),
    sources,
    channelCount,
    sourceScores: {
      ...getCandidateSourceScores(existing),
      ...getCandidateSourceScores(incoming),
    },
    channelAttribution: sources,
  };
}

function collectCandidatesFromLists(
  lists: RawChannelList[],
  limit?: number
): HybridSearchResult[] {
  const deduped = new Map<string, HybridSearchResult>();

  for (const list of lists) {
    if (!Array.isArray(list.results) || list.results.length === 0) continue;

    const scored = list.results.map((result) => {
      const rawScore = resolveRawCandidateScore(result as { score?: unknown; similarity?: unknown });
      return { result, rawScore };
    });

    let min = Infinity;
    let max = -Infinity;
    for (const { rawScore } of scored) {
      if (rawScore < min) min = rawScore;
      if (rawScore > max) max = rawScore;
    }
    const range = max - min;

    for (const { result, rawScore } of scored) {
      const normalizedScore = range > 0 ? (rawScore - min) / range : (rawScore > 0 ? 1.0 : 0);
      const candidate: HybridSearchResult = {
        ...result,
        id: result.id,
        source: list.source,
        score: normalizedScore,
        sources: [list.source],
        sourceScores: { [list.source]: normalizedScore },
        channelAttribution: [list.source],
      };
      const key = canonicalResultId(candidate.id);
      deduped.set(key, mergeRawCandidate(deduped.get(key), candidate));
    }
  }

  return applyResultLimit(
    Array.from(deduped.values()).sort((a, b) => {
      const aScore = typeof a.score === 'number' && Number.isFinite(a.score) ? a.score : 0;
      const bScore = typeof b.score === 'number' && Number.isFinite(b.score) ? b.score : 0;
      return bScore - aScore;
    }),
    limit
  );
}

function mergeRawCandidateSets(
  existing: HybridSearchResult[],
  incoming: HybridSearchResult[],
  limit?: number
): HybridSearchResult[] {
  const merged = new Map<string, HybridSearchResult>();

  for (const result of [...existing, ...incoming]) {
    const key = canonicalResultId(result.id);
    merged.set(key, mergeRawCandidate(merged.get(key), result));
  }

  return applyResultLimit(
    Array.from(merged.values()).sort((a, b) => {
      const aScore = typeof a.score === 'number' && Number.isFinite(a.score) ? a.score : 0;
      const bScore = typeof b.score === 'number' && Number.isFinite(b.score) ? b.score : 0;
      return bScore - aScore;
    }),
    limit
  );
}

function getAllowedChannels(options: HybridSearchOptions): Set<ChannelName> {
  const allowed = new Set<ChannelName>(['vector', 'fts', 'graph', 'degree']);

  if (isBm25Enabled()) {
    allowed.add('bm25');
  }

  if (options.useVector === false) allowed.delete('vector');
  if (options.useBm25 === false) allowed.delete('bm25');
  if (options.useFts === false) allowed.delete('fts');
  if (options.useGraph === false) {
    allowed.delete('graph');
    allowed.delete('degree');
  }

  return allowed;
}

function applyAllowedChannelOverrides(
  options: HybridSearchOptions,
  allowedChannels: Set<ChannelName>,
  overrides: Partial<HybridSearchOptions> = {}
): HybridSearchOptions {
  return {
    ...options,
    ...overrides,
    useVector: allowedChannels.has('vector'),
    useBm25: allowedChannels.has('bm25'),
    useFts: allowedChannels.has('fts'),
    useGraph: allowedChannels.has('graph'),
  };
}

type FallbackPlanKind = 'adaptive' | 'tiered';
type FallbackStageName = 'primary' | 'retry';

interface FallbackPlanStage {
  stage: FallbackStageName;
  options: HybridSearchOptions;
  results: HybridSearchResult[];
  execution: HybridFusionExecution | null;
  trigger?: 'empty' | DegradationTrigger;
}

interface FallbackPlanExecution {
  allowedChannels: Set<ChannelName>;
  stages: FallbackPlanStage[];
}

interface HybridFusionExecution {
  evaluationMode: boolean;
  intent: string;
  lists: Array<{
    source: string;
    results: Array<{ id: number | string; [key: string]: unknown }>;
    weight?: number;
  }>;
  routeResult: ReturnType<typeof routeQuery>;
  budgetResult: ReturnType<typeof getDynamicTokenBudget>;
  s3meta: Sprint3PipelineMeta;
  fusedResults: HybridSearchResult[];
  vectorEmbeddingCache: Map<number, Float32Array>;
}

function markFallbackRetry(results: HybridSearchResult[]): HybridSearchResult[] {
  for (const result of results) {
    (result as Record<string, unknown>).fallbackRetry = true;
  }

  return results;
}

function toEmbeddingBufferView(value: unknown): Float32Array | null {
  if (value instanceof Float32Array) {
    return value;
  }

  if (Array.isArray(value)) {
    const asNumbers = value.every((entry) => typeof entry === 'number' && Number.isFinite(entry));
    return asNumbers ? new Float32Array(value) : null;
  }

  if (Buffer.isBuffer(value)) {
    return new Float32Array(value.buffer, value.byteOffset, value.byteLength / 4);
  }

  return null;
}

async function executeFallbackPlan(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {},
  planKind: FallbackPlanKind,
  overrides: Partial<HybridSearchOptions> = {}
): Promise<FallbackPlanExecution> {
  const allowedChannels = getAllowedChannels(options);
  const stages: FallbackPlanStage[] = [];

  const primaryOptions = applyAllowedChannelOverrides(options, allowedChannels, {
    minSimilarity: options.minSimilarity ?? PRIMARY_FALLBACK_MIN_SIMILARITY,
    ...overrides,
  });
  const primaryExecution = await collectAndFuseHybridResults(query, embedding, primaryOptions);
  const primaryResults = primaryExecution
    ? applyResultLimit(primaryExecution.fusedResults, primaryOptions.limit)
    : await hybridSearch(query, embedding, primaryOptions);
  stages.push({
    stage: 'primary',
    options: primaryOptions,
    results: primaryResults,
    execution: primaryExecution,
  });

  if (planKind === 'tiered') {
    const trigger = checkDegradation(primaryResults);
    if (!trigger) {
      return { allowedChannels, stages };
    }

    const retryOptions = applyAllowedChannelOverrides(options, allowedChannels, {
      ...overrides,
      minSimilarity: TIERED_FALLBACK_MIN_SIMILARITY,
      forceAllChannels: true,
    });
    const retryExecution = await collectAndFuseHybridResults(query, embedding, retryOptions);
    const retryResults = retryExecution
      ? applyResultLimit(retryExecution.fusedResults, retryOptions.limit)
      : await hybridSearch(query, embedding, retryOptions);
    stages.push({
      stage: 'retry',
      options: retryOptions,
      results: retryResults,
      execution: retryExecution,
      trigger,
    });
    return { allowedChannels, stages };
  }

  const primaryMinSimilarity = primaryOptions.minSimilarity ?? PRIMARY_FALLBACK_MIN_SIMILARITY;
  if (primaryResults.length === 0 && primaryMinSimilarity >= SECONDARY_FALLBACK_MIN_SIMILARITY) {
    const retryOptions = applyAllowedChannelOverrides(options, allowedChannels, {
      ...overrides,
      minSimilarity: SECONDARY_FALLBACK_MIN_SIMILARITY,
    });
    const retryExecution = await collectAndFuseHybridResults(query, embedding, retryOptions);
    const retryResultsBase = retryExecution
      ? applyResultLimit(retryExecution.fusedResults, retryOptions.limit)
      : await hybridSearch(query, embedding, retryOptions);
    const retryResults = retryResultsBase.length > 0
      ? markFallbackRetry(retryResultsBase)
      : retryResultsBase;
    stages.push({
      stage: 'retry',
      options: retryOptions,
      results: retryResults,
      execution: retryExecution,
      trigger: 'empty',
    });
  }

  return { allowedChannels, stages };
}

// 11. HYBRID SEARCH

/**
 * Run multi-channel hybrid search combining vector, FTS, BM25, and graph results with per-source normalization.
 * Prefer hybridSearchEnhanced() or searchWithFallback() instead. This function uses naive per-source
 * min-max normalization which produces different orderings than the RRF pipeline in hybridSearchEnhanced().
 * Retained as internal fallback only.
 */
async function hybridSearch(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  const {
    limit = DEFAULT_LIMIT,
    specFolder,
    minSimilarity = 0,
    useBm25 = isBm25Enabled(),
    useFts = true,
    useVector = true,
    useGraph = true,
    includeArchived = false,
  } = options;

  const results: HybridSearchResult[] = [];

  // Vector search
  if (useVector && embedding && vectorSearchFn) {
    try {
      const vectorResults = vectorSearchFn(embedding, {
        limit,
        specFolder,
        minSimilarity,
        includeConstitutional: false, // Handler manages constitutional separately
        includeArchived,
      });
      for (const r of vectorResults) {
        results.push({
          ...r,
          id: r.id as number,
          score: (r.similarity as number) || 0,
          source: 'vector',
        });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[hybrid-search] Vector search failed: ${msg}`);
    }
  }

  // FTS search
  if (useFts) {
    const ftsResults = ftsSearch(query, { limit, specFolder, includeArchived });
    results.push(...ftsResults);
  }

  // BM25 search
  if (useBm25) {
    const bm25Results = bm25Search(query, { limit, specFolder });
    results.push(...bm25Results);
  }

  // Graph search
  if (useGraph && graphSearchFn) {
    try {
      const graphResults = graphSearchFn(query, { limit, specFolder });
      for (const r of graphResults) {
        results.push({
          ...r,
          id: r.id as number | string,
          score: (r.score as number) || 0,
          source: 'graph',
        });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[hybrid-search] Graph search failed: ${msg}`);
    }
  }

  // Normalize scores per source before merging so one method's raw scale
  // Does not dominate others during final ranking.
  const bySource = new Map<string, HybridSearchResult[]>();
  for (const r of results) {
    const src = r.source || 'unknown';
    if (!bySource.has(src)) bySource.set(src, []);
    bySource.get(src)!.push(r); // non-null safe: has() guard above guarantees entry exists
  }

  const normalized: HybridSearchResult[] = [];
  for (const [, group] of bySource) {
    if (group.length === 0) continue;
    const scores = group.map(r => r.score);
    let min = Infinity;
    let max = -Infinity;
    for (const s of scores) {
      if (s < min) min = s;
      if (s > max) max = s;
    }
    const range = max - min;
    for (const r of group) {
      normalized.push({
        ...r,
        score: range > 0 ? (r.score - min) / range : (r.score > 0 ? 1.0 : 0),
      });
    }
  }

  // Deduplicate by ID (keep highest normalized score)
  // LIMITATION (P1-1): When a result appears in multiple sources (e.g., vector + fts),
  // Only the highest-scoring entry's `source` is preserved. Multi-source provenance
  // Is lost here. To fix properly, HybridSearchResult would need a `sources: string[]`
  // Field and downstream consumers would need to be updated accordingly.
  const deduped = new Map<string, HybridSearchResult>();
  for (const r of normalized) {
    const canonicalId = canonicalResultId(r.id);
    const existing = deduped.get(canonicalId);
    if (!existing || r.score > existing.score) {
      deduped.set(canonicalId, r);
    }
  }

  return Array.from(deduped.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Enhanced hybrid search with RRF fusion.
 * All search channels use synchronous better-sqlite3; sequential execution
 * is correct — Promise.all would add overhead without achieving parallelism.
 */
async function hybridSearchEnhanced(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  const execution = await collectAndFuseHybridResults(query, embedding, options);
  if (execution) {
    if (options.stopAfterFusion) {
      return applyResultLimit(execution.fusedResults, options.limit);
    }

    return enrichFusedResults(query, execution, options);
  }

  return hybridSearch(query, embedding, options);
}

async function collectAndFuseHybridResults(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridFusionExecution | null> {
  try {
    const evaluationMode = options.evaluationMode === true;
    const lists: HybridFusionExecution['lists'] = [];

    // Pipeline metadata collector (populated by flag-gated stages)
    const s3meta: Sprint3PipelineMeta = {};

    // -- Stage A: Query Classification + Routing (SPECKIT_COMPLEXITY_ROUTER) --
    // When enabled, classifies query complexity and restricts channels to a
    // Subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
    const routeResult = routeQuery(query, options.triggerPhrases);
    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
    const activeChannels = options.forceAllChannels
      ? new Set<ChannelName>(allPossibleChannels)
      : new Set<ChannelName>(routeResult.channels);

    // Respect explicit caller channel disables across both the primary route and
    // every fallback tier. useGraph=false also disables the dependent degree lane.
    const allowedChannels = getAllowedChannels(options);
    for (const channel of allPossibleChannels) {
      if (!allowedChannels.has(channel)) activeChannels.delete(channel);
    }

    const skippedChannels = allPossibleChannels.filter(ch => !activeChannels.has(ch));

    if (skippedChannels.length > 0) {
      s3meta.routing = {
        tier: routeResult.tier,
        channels: routeResult.channels,
        skippedChannels,
        featureFlagEnabled: isComplexityRouterEnabled(),
        confidence: routeResult.classification.confidence,
        features: routeResult.classification.features as Record<string, unknown>,
      };
    }

    // -- Stage E: Dynamic Token Budget (SPECKIT_DYNAMIC_TOKEN_BUDGET) --
    // Compute tier-aware budget early so it's available for downstream truncation.
    // When disabled, getDynamicTokenBudget returns the default 4000 budget with applied=false.
    const budgetResult = getDynamicTokenBudget(routeResult.tier);
    if (budgetResult.applied && !evaluationMode) {
      s3meta.tokenBudget = {
        tier: budgetResult.tier,
        budget: budgetResult.budget,
        applied: budgetResult.applied,
        featureFlagEnabled: isDynamicTokenBudgetEnabled(),
        configValues: DEFAULT_TOKEN_BUDGET_CONFIG as unknown as Record<string, number>,
        // headerOverhead and adjustedBudget are patched in below after they are computed
        headerOverhead: 0,
        adjustedBudget: budgetResult.budget,
      };
    }

    // Channel results collected independently, merged after all complete
    let semanticResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];
    let ftsChannelResults: HybridSearchResult[] = [];
    let bm25ChannelResults: HybridSearchResult[] = [];
    const vectorEmbeddingCache = new Map<number, Float32Array>();

    // All channels use synchronous better-sqlite3; sequential execution
    // Is correct — Promise.all adds overhead without parallelism.

    // Vector channel — gated by query-complexity routing
    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
      try {
        const vectorResults = vectorSearchFn(embedding, {
          limit: options.limit || DEFAULT_LIMIT,
          specFolder: options.specFolder,
          minSimilarity: options.minSimilarity || 0,
          includeConstitutional: false,
          includeArchived: options.includeArchived || false,
          includeEmbeddings: true,
        });
        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
          ...r,
          id: r.id as number | string,
          source: 'vector',
        }));
        for (const result of semanticResults) {
          if (typeof result.id !== 'number') continue;
          const embeddingCandidate = toEmbeddingBufferView(
            (result as Record<string, unknown>).embedding
            ?? (result as Record<string, unknown>).embeddingBuffer
          );
          if (embeddingCandidate) {
            vectorEmbeddingCache.set(result.id, embeddingCandidate);
          }
        }
        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
      } catch (_err: unknown) {
        // Non-critical — vector channel failure does not block pipeline
        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
      }
    }

    // FTS channel (internal error handling in ftsSearch) — gated by query-complexity routing
    if (activeChannels.has('fts')) {
      ftsChannelResults = ftsSearch(query, options);
      if (ftsChannelResults.length > 0) {
        // FTS weight reduced to 0.3 after ablation showed 0.8 was harmful,
        // flooding top-K with noisy lexical matches despite its exact-match value.
        lists.push({ source: 'fts', results: ftsChannelResults, weight: 0.3 });
      }
    }

    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
    if (activeChannels.has('bm25')) {
      bm25ChannelResults = bm25Search(query, options);
      if (bm25ChannelResults.length > 0) {
        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
        // Has less precise scoring than SQLite FTS5 BM25; kept for coverage breadth.
        lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
      }
    }

    // Graph channel — gated by query-complexity routing
    const useGraph = (options.useGraph !== false) && activeChannels.has('graph');
    if (useGraph && graphSearchFn) {
      try {
        graphMetrics.totalQueries++; // counted only if channel executes
        const graphResults = graphSearchFn(query, {
          limit: options.limit || DEFAULT_LIMIT,
          specFolder: options.specFolder,
          intent: options.intent,
        });
        if (graphResults.length > 0) {
          graphMetrics.graphHits++;
          lists.push({ source: 'graph', results: graphResults.map((r: Record<string, unknown>) => ({
            ...r,
            id: r.id as number | string,
          })), weight: 0.5 });
        }
      } catch (_err: unknown) {
        // Non-critical — graph channel failure does not block pipeline
        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
      }
    }

    // Degree channel re-ranks based on causal-edge connectivity.
    // Graduated: default-ON. Set SPECKIT_DEGREE_BOOST=false to disable.
    // Degree channel — also gated by query-complexity routing
    if (activeChannels.has('degree') && db && isDegreeBoostEnabled()) {
      try {
        // Collect all numeric IDs from existing channels
        const allResultIds = new Set<number>();
        for (const list of lists) {
          for (const r of list.results) {
            const id = r.id;
            if (typeof id === 'number') allResultIds.add(id);
          }
        }

        if (allResultIds.size > 0) {
          const degreeScores = computeDegreeScores(db, Array.from(allResultIds));

          // Build a ranked list sorted by degree score (highest first)
          const degreeItems: Array<{ id: number; degreeScore: number }> = [];
          for (const [idStr, score] of degreeScores) {
            const numId = Number(idStr);
            if (score > 0 && !isNaN(numId)) {
              degreeItems.push({ id: numId, degreeScore: score });
            }
          }
          degreeItems.sort((a, b) => b.degreeScore - a.degreeScore);

          if (degreeItems.length > 0) {
            lists.push({
              source: 'degree',
              results: degreeItems.map(item => ({
                id: item.id,
                degreeScore: item.degreeScore,
              })),
              weight: DEGREE_CHANNEL_WEIGHT,
            });
          }
        }
      } catch (_err: unknown) {
        // Non-critical — degree channel failure does not block pipeline
        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
      }
    }

    // Merge keyword results after all channels complete
    const keywordResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [
      ...ftsChannelResults,
      ...bm25ChannelResults,
    ];

    if (options.skipFusion) {
      return {
        evaluationMode,
        intent: options.intent || classifyIntent(query).intent,
        lists,
        routeResult,
        budgetResult,
        s3meta,
        vectorEmbeddingCache,
        fusedResults: collectCandidatesFromLists(
          lists.filter((list) => list.source !== 'degree'),
          options.limit ?? DEFAULT_LIMIT
        ),
      };
    }

    if (lists.length === 0) {
      return null;
    }

    // Track multi-source and graph-only results
    const sourceMap = new Map<string, Set<string>>();
    for (const list of lists) {
      for (const r of list.results) {
        const key = canonicalResultId(r.id);
        if (!sourceMap.has(key)) sourceMap.set(key, new Set());
        sourceMap.get(key)!.add(list.source); // non-null safe: has() guard above guarantees entry exists
      }
    }
    for (const [, sources] of sourceMap) {
      if (sources.size > 1) graphMetrics.multiSourceResults++;
      if (sources.size === 1 && sources.has('graph')) graphMetrics.graphOnlyResults++;
    }

    // C138/T315: Build weighted fusion lists once from lightweight adaptive
    // weights, avoiding the heavier hybridAdaptiveFuse() standard-first path.
    const intent = options.intent || classifyIntent(query).intent;
    const adaptiveEnabled = isAdaptiveFusionEnabled();
    const fusionWeights = adaptiveEnabled
      ? getAdaptiveWeights(intent)
      : { semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 };
    const { semanticWeight, keywordWeight, graphWeight: adaptiveGraphWeight } = fusionWeights;
    const keywordFusionResults = keywordResults.map((result) => ({
      ...result,
      source: 'keyword',
    }));
    const fusionLists = lists
      .filter((list) => list.source !== 'fts' && list.source !== 'bm25')
      .map((list) => {
        if (list.source === 'vector') {
          return { ...list, weight: semanticWeight };
        }
        if (list.source === 'graph' && typeof adaptiveGraphWeight === 'number') {
          return { ...list, weight: adaptiveGraphWeight };
        }
        return { ...list };
      });

    if (keywordFusionResults.length > 0 && keywordWeight > 0) {
      fusionLists.push({
        source: 'keyword',
        results: keywordFusionResults,
        weight: keywordWeight,
      });
    }

    const fused = fuseResultsMulti(fusionLists);

    const fusedResults = fused.map(toHybridResult).map((row) => {
      const rowRecord = row as Record<string, unknown>;
      if (rowRecord.parentMemoryId !== undefined) return row;
      const normalizedParentMemoryId = rowRecord.parent_id ?? rowRecord.parentId;
      if (normalizedParentMemoryId === undefined) return row;
      return {
        ...row,
        parentMemoryId: normalizedParentMemoryId,
      };
    });

    return {
      evaluationMode,
      intent,
      lists,
      routeResult,
      budgetResult,
      s3meta,
      vectorEmbeddingCache,
      fusedResults,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[hybrid-search] Enhanced search failed, falling back: ${msg}`);
    return null;
  }
}

async function enrichFusedResults(
  query: string,
  execution: HybridFusionExecution,
  options: HybridSearchOptions = {},
  initialResults: HybridSearchResult[] = execution.fusedResults
): Promise<HybridSearchResult[]> {
  const {
    evaluationMode,
    intent,
    lists,
    routeResult,
    budgetResult,
    s3meta,
    vectorEmbeddingCache,
  } = execution;
  let fusedHybridResults = initialResults;
  const limit = options.limit || DEFAULT_LIMIT;

  // -- Aggregation stage: MPAB chunk-to-memory aggregation (after fusion, before state filter) --
  // When enabled, collapses chunk-level results back to their parent memory
  // Documents using MPAB scoring (sMax + 0.3 * sum(remaining) / sqrt(N)). This prevents
  // Multiple chunks from the same document dominating the result list.
  // MINOR-1 fix: isMpabEnabled() and isDocscoreAggregationEnabled() check the same env var
  if (isDocscoreAggregationEnabled()) {
    try {
      const chunkResults = fusedHybridResults.filter(
        r => (r as Record<string, unknown>).parentMemoryId != null && (r as Record<string, unknown>).chunkIndex != null
      );
      if (chunkResults.length > 0) {
        const nonChunkResults = fusedHybridResults.filter(
          r => (r as Record<string, unknown>).parentMemoryId == null || (r as Record<string, unknown>).chunkIndex == null
        );
        const collapsed = collapseAndReassembleChunkResults(
          chunkResults.map(r => ({
            id: r.id,
            parentMemoryId: (r as Record<string, unknown>).parentMemoryId as number | string,
            chunkIndex: (r as Record<string, unknown>).chunkIndex as number,
            score: r.score,
          }))
        );
        // Merge collapsed chunk results with non-chunk results
        fusedHybridResults = [
          ...collapsed.map(c => ({
            id: c.parentMemoryId,
            score: c.mpabScore,
            source: 'mpab' as string,
            _chunkHits: c._chunkHits,
          } as HybridSearchResult)),
          ...nonChunkResults,
        ];
      }
    } catch (_mpabErr: unknown) {
      // Non-critical — MPAB failure does not block pipeline
      const msg = _mpabErr instanceof Error ? _mpabErr.message : String(_mpabErr);
      console.error('[hybrid-search] MPAB error (non-fatal):', msg);
    }
  }

  // -- Stage C: Channel Enforcement (SPECKIT_CHANNEL_MIN_REP) --
  // Ensures every channel that returned results has at least one representative
  // In the top-k window. Prevents single-channel dominance in fusion output.
  // When disabled, passes results through unchanged.
  try {
    const channelResultSets = new Map<string, Array<{ id: number | string; score: number; [key: string]: unknown }>>();
    for (const list of lists) {
      channelResultSets.set(list.source, list.results.map(r => ({
        ...r,
        id: r.id,
        score: typeof (r as Record<string, unknown>).score === 'number'
          ? (r as Record<string, unknown>).score as number
          : typeof (r as Record<string, unknown>).similarity === 'number'
            ? ((r as Record<string, unknown>).similarity as number) / 100
            : 0,
      })));
    }

    const enforcementResult: EnforcementResult = enforceChannelRepresentation(
      fusedHybridResults.map(r => ({ ...r, source: r.source || 'hybrid' })),
      channelResultSets,
      limit,
    );

    if (enforcementResult.enforcement.applied) {
      fusedHybridResults = enforcementResult.results as HybridSearchResult[];
      s3meta.enforcement = {
        applied: true,
        promotedCount: enforcementResult.enforcement.promotedCount,
        underRepresentedChannels: enforcementResult.enforcement.underRepresentedChannels,
      };
    }
  } catch (err: unknown) {
    // Non-critical — enforcement failure does not block pipeline
    console.warn('[hybrid-search] channel enforcement failed:', err instanceof Error ? err.message : String(err));
  }

  // Preserve non-enumerable eval metadata across later array reallocations.
  const shadowMeta = initialResults as HybridSearchResult[] & ShadowMetaArray;
  const s4shadowMeta = shadowMeta._s4shadow;
  const s4attributionMeta = shadowMeta._s4attribution;
  const degradationMeta = shadowMeta._degradation;

  // C138/T316: MMR reranking with request-scoped embedding cache.
  // Reuse embeddings already returned by the vector channel when present and
  // only query vec_memories for missing IDs.
  let reranked: HybridSearchResult[] = fusedHybridResults.slice(0, limit);

  // P1-5: Optional local GGUF reranking path (RERANKER_LOCAL=true).
  // Preserve cross-encoder gate semantics: when SPECKIT_CROSS_ENCODER=false, skip reranking.
  if (isCrossEncoderEnabled() && isLocalRerankerEnabled() && reranked.length >= MMR_MIN_CANDIDATES) {
    const localReranked = await rerankLocal(query, reranked, limit);
    if (localReranked !== reranked) {
      reranked = localReranked as HybridSearchResult[];
    }
  }

  if (db && isMMREnabled()) {
    const numericIds = reranked
      .map(r => r.id)
      .filter((id): id is number => typeof id === 'number');

    if (numericIds.length >= MMR_MIN_CANDIDATES) {
      try {
        const embeddingMap = new Map<number, Float32Array>(vectorEmbeddingCache);
        const missingIds = numericIds.filter((id) => !embeddingMap.has(id));

        if (missingIds.length > 0) {
          const placeholders = missingIds.map(() => '?').join(', ');
          const embRows = (db.prepare(
            `SELECT rowid, embedding FROM vec_memories WHERE rowid IN (${placeholders})`
          ) as Database.Statement).all(...missingIds) as Array<{ rowid: number; embedding: Buffer }>;

          for (const row of embRows) {
            if (Buffer.isBuffer(row.embedding)) {
              embeddingMap.set(
                row.rowid,
                new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)
              );
            }
          }
        }

        const mmrCandidates: MMRCandidate[] = [];
        for (const r of reranked) {
          const emb = embeddingMap.get(r.id as number);
          if (emb) {
            mmrCandidates.push({
              id: r.id as number,
              score: (r.score as number) ?? 0,
              embedding: emb,
            });
          }
        }

        if (mmrCandidates.length >= MMR_MIN_CANDIDATES) {
          const mmrLambda = INTENT_LAMBDA_MAP[intent] ?? MMR_DEFAULT_LAMBDA;
          const diversified = applyMMR(mmrCandidates, { lambda: mmrLambda, limit });

          // FIX #6: Same fix as stage3-rerank FIX #5 — MMR can only diversify
          // rows that have embeddings. Non-embedded rows (lexical-only hits,
          // graph injections) must be preserved and merged back in their
          // original relative order instead of being silently dropped.
          const embeddedIdSet = new Set(mmrCandidates.map(c => c.id));
          const nonEmbeddedRows = reranked.filter(r => !embeddedIdSet.has(r.id as number));
          const rerankedById = new Map<string, HybridSearchResult>(
            reranked.map((result) => [canonicalResultId(result.id), result])
          );

          const diversifiedRows = diversified.map((candidate): HybridSearchResult => {
            const existing = rerankedById.get(canonicalResultId(candidate.id));
            if (existing) {
              return existing;
            }

            return {
              id: candidate.id,
              score: candidate.score,
              source: 'vector',
            };
          });

          // Merge: diversified embedded rows first (MMR-ordered), then
          // non-embedded rows in their original relative order.
          reranked = [...diversifiedRows, ...nonEmbeddedRows];
        }
      } catch (embErr: unknown) {
        const msg = embErr instanceof Error ? embErr.message : String(embErr);
        console.warn(`[hybrid-search] MMR embedding retrieval failed: ${msg}`);
      }
    }
  }

  // C138: Co-activation spreading — enrich with temporal neighbors
  const topIds = reranked
    .slice(0, SPREAD_ACTIVATION_TOP_N)
    .map(r => r.id)
    .filter((id): id is number => typeof id === 'number');
  if (topIds.length > 0) {
    try {
      const spreadResults: SpreadResult[] = spreadActivation(topIds);
      // Boost scores of results that appear in co-activation graph
      if (spreadResults.length > 0) {
        const spreadMap = new Map(spreadResults.map(sr => [sr.id, sr.activationScore]));
        for (const result of reranked) {
          const boost = spreadMap.get(result.id as number);
          if (boost !== undefined) {
            // M10 FIX: Update all score aliases so downstream consumers see the boost
            const boostedScore = ((result.score as number) ?? 0) + boost * CO_ACTIVATION_CONFIG.boostFactor;
            (result as Record<string, unknown>).score = boostedScore;
            if ('rrfScore' in result) (result as Record<string, unknown>).rrfScore = boostedScore;
            if ('intentAdjustedScore' in result) (result as Record<string, unknown>).intentAdjustedScore = boostedScore;
          }
        }
      }
      // P1-2 FIX: Re-sort after co-activation boost to ensure boosted results
      // Are promoted to their correct position in the ranking
      reranked.sort((a, b) => ((b.score as number) ?? 0) - ((a.score as number) ?? 0));
    } catch (err: unknown) {
      // Non-critical enrichment — co-activation failure does not affect core ranking
      console.warn('[hybrid-search] co-activation enrichment failed:', err instanceof Error ? err.message : String(err));
    }
  }

  // Folder relevance / two-pass retrieval (SPECKIT_FOLDER_SCORING)
  if (db && isFolderScoringEnabled() && reranked.length > 0) {
    try {
      const numericIds = reranked
        .map(r => r.id)
        .filter((id): id is number => typeof id === 'number');

      if (numericIds.length > 0) {
        const folderMap = lookupFolders(db, numericIds);
        if (folderMap.size > 0) {
          const folderScores = computeFolderRelevanceScores(reranked, folderMap);
          const rawTopK = process.env.SPECKIT_FOLDER_TOP_K;
          const parsedTopK = rawTopK ? parseInt(rawTopK, 10) : NaN;
          const topK = Number.isFinite(parsedTopK) && parsedTopK > 0 ? parsedTopK : 5;

          const twoPhaseResults = twoPhaseRetrieval(reranked, folderScores, folderMap, topK);
          const postFolderResults = twoPhaseResults.length > 0 ? twoPhaseResults : reranked;
          reranked = enrichResultsWithFolderScores(postFolderResults, folderScores, folderMap) as HybridSearchResult[];
        }
      }
    } catch (_folderErr: unknown) {
      // Folder scoring is optional and must not break retrieval
    }
  }

  // -- Stage D: Confidence Truncation (SPECKIT_CONFIDENCE_TRUNCATION) --
  // Run after the ranking pipeline so later boosts/promotions can rescue
  // candidates before low-confidence tails are trimmed.
  if (!evaluationMode) {
    try {
      const truncationResult: TruncationResult = truncateByConfidence(
        reranked.map(r => ({ ...r, id: r.id, score: r.score })),
      );

      if (truncationResult.truncated) {
        reranked = truncationResult.results.map(r => r as HybridSearchResult);
        s3meta.truncation = {
          truncated: true,
          originalCount: truncationResult.originalCount,
          truncatedCount: truncationResult.truncatedCount,
          medianGap: truncationResult.medianGap,
          cutoffGap: truncationResult.cutoffGap,
          cutoffIndex: truncationResult.cutoffIndex,
          thresholdMultiplier: GAP_THRESHOLD_MULTIPLIER,
          minResultsGuaranteed: DEFAULT_MIN_RESULTS,
          featureFlagEnabled: isConfidenceTruncationEnabled(),
        };
      }
    } catch (err: unknown) {
      // Non-critical — truncation failure does not block pipeline
      console.warn('[hybrid-search] confidence truncation failed:', err instanceof Error ? err.message : String(err));
    }
  }

  // Preserve routing and Stage 4 trace metadata as explicit result fields so downstream
  // Formatters can opt-in to provenance-rich envelopes without relying on
  // Non-enumerable array shadow properties.
  if (reranked.length > 0) {
    reranked = reranked.map((row): HybridSearchResult => {
      const existingTraceMetadata =
        typeof row.traceMetadata === 'object' && row.traceMetadata !== null && !Array.isArray(row.traceMetadata)
          ? row.traceMetadata
          : {};

      return {
        ...row,
        traceMetadata: {
          ...existingTraceMetadata,
          ...(s4shadowMeta !== undefined ? { stage4: s4shadowMeta } : {}),
          ...(s4attributionMeta !== undefined ? { attribution: s4attributionMeta } : {}),
          ...(degradationMeta !== undefined ? { degradation: degradationMeta } : {}),
          evaluationMode,
          // Wire queryComplexity from router classification into trace
          queryComplexity: routeResult.tier,
          // Wire confidence truncation metadata into per-result trace (036)
          ...(s3meta.truncation ? {
            confidenceTruncation: {
              truncated: s3meta.truncation.truncated,
              originalCount: s3meta.truncation.originalCount,
              truncatedCount: s3meta.truncation.truncatedCount,
              medianGap: s3meta.truncation.medianGap,
              cutoffGap: s3meta.truncation.cutoffGap,
              cutoffIndex: s3meta.truncation.cutoffIndex,
              thresholdMultiplier: s3meta.truncation.thresholdMultiplier,
              minResultsGuaranteed: s3meta.truncation.minResultsGuaranteed,
            },
          } : {}),
        },
      };
    });
  }

  if (isContextHeadersEnabled() && reranked.length > 0) {
    const descriptionCache = buildDescriptionTailMap();
    if (descriptionCache.size > 0) {
      reranked = reranked.map((row) => injectContextualTree(row, descriptionCache));
    }
  }

  let budgetTruncated = false;
  let budgetLimit: number | undefined;
  if (evaluationMode) {
    reranked = applyResultLimit(reranked, options.limit);
  } else {
    // Apply token budget truncation after trace/header enrichment so token
    // estimates reflect the actual returned payload shape.
    const headerOverhead = isContextHeadersEnabled()
      ? reranked.length * CONTEXT_HEADER_TOKEN_OVERHEAD
      : 0;
    const adjustedBudget = Math.max(budgetResult.budget - headerOverhead, 200);

    if (s3meta.tokenBudget) {
      s3meta.tokenBudget.headerOverhead = headerOverhead;
      s3meta.tokenBudget.adjustedBudget = adjustedBudget;
    }

    const budgeted = truncateToBudget(reranked, adjustedBudget, {
      includeContent: options.includeContent ?? false,
      queryId: `hybrid-${Date.now()}`,
    });
    reranked = budgeted.results;
    budgetTruncated = budgeted.truncated;
    budgetLimit = budgetResult.budget;
  }

  if (reranked.length > 0) {
    reranked = reranked.map((row): HybridSearchResult => {
      const existingTraceMetadata =
        typeof row.traceMetadata === 'object' && row.traceMetadata !== null && !Array.isArray(row.traceMetadata)
          ? row.traceMetadata
          : {};

      return {
        ...row,
        traceMetadata: {
          ...existingTraceMetadata,
          budgetTruncated,
          ...(budgetLimit !== undefined ? { budgetLimit } : {}),
        },
      };
    });
  }

  if (s4shadowMeta !== undefined && reranked.length > 0) {
    Object.defineProperty(reranked, '_s4shadow', {
      value: s4shadowMeta,
      enumerable: false,
      configurable: true,
    });
  }

  if (s4attributionMeta !== undefined && reranked.length > 0) {
    Object.defineProperty(reranked, '_s4attribution', {
      value: s4attributionMeta,
      enumerable: false,
      configurable: true,
    });
  }

  // Attach pipeline metadata to results for eval/debugging
  // Metadata is attached as non-enumerable _s3meta property to avoid
  // Polluting result serialization while remaining accessible for debugging.
  if (Object.keys(s3meta).length > 0 && reranked.length > 0) {
    Object.defineProperty(reranked, '_s3meta', { value: s3meta, enumerable: false, configurable: true });
  }

  return reranked;
}

/**
 * Collect pipeline candidates through the adaptive fallback chain, returning
 * immediately after intra-query fusion and before downstream aggregation,
 * reranking, or post-processing.
 *
 * @param query - The search query string.
 * @param embedding - Optional embedding vector for semantic search.
 * @param options - Hybrid search configuration options.
 * @returns Unfused candidate results from the first non-empty collection stage.
 */
async function collectRawCandidates(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  const { allowedChannels, stages } = await executeFallbackPlan(
    query,
    embedding,
    options,
    isSearchFallbackEnabled() ? 'tiered' : 'adaptive',
    { stopAfterFusion: true }
  );

  const primaryResults = stages[0]?.results ?? [];
  const retryResults = stages[1]?.results ?? [];

  if (isSearchFallbackEnabled()) {
    const mergedResults = retryResults.length > 0
      ? mergeRawCandidateSets(primaryResults, retryResults, options.limit)
      : primaryResults;
    if (mergedResults.length > 0) return applyResultLimit(mergedResults, options.limit);
  } else {
    const stagedResults = retryResults.length > 0 ? retryResults : primaryResults;
    if (stagedResults.length > 0) return applyResultLimit(stagedResults, options.limit);
  }

  if (allowedChannels.has('fts')) {
    const ftsFallback = collectCandidatesFromLists(
      [{ source: 'fts', results: ftsSearch(query, options) }],
      options.limit
    );
    if (ftsFallback.length > 0) return ftsFallback;
  }

  if (allowedChannels.has('bm25')) {
    const bm25Fallback = collectCandidatesFromLists(
      [{ source: 'bm25', results: bm25Search(query, options) }],
      options.limit
    );
    if (bm25Fallback.length > 0) return bm25Fallback;
  }

  console.warn('[hybrid-search] Raw candidate collection returned empty results');
  return [];
}

/**
 * Search with automatic fallback chain.
 * When SPECKIT_SEARCH_FALLBACK=true: delegates to the 3-tier quality-aware
 * fallback (searchWithFallbackTiered). Otherwise: C138-P0 two-pass adaptive
 * fallback — primary at minSimilarity=30, retry at 17.
 *
 * @param query - The search query string.
 * @param embedding - Optional embedding vector for semantic search.
 * @param options - Hybrid search configuration options.
 * @returns Results from the first non-empty stage.
 */
async function searchWithFallback(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  // PI-A2: Delegate to tiered fallback when flag is enabled
  if (isSearchFallbackEnabled()) {
    return searchWithFallbackTiered(query, embedding, options);
  }

  // Primary 30 filters noise; fallback 17 widens recall for sparse corpora
  // Where no result exceeds the primary threshold — chosen empirically via eval.
  // P3-03 FIX: Use hybridSearchEnhanced (with RRF fusion) instead of
  // The naive hybridSearch that merges raw scores
  const { allowedChannels, stages } = await executeFallbackPlan(
    query,
    embedding,
    options,
    'adaptive'
  );
  const primaryStage = stages[0];
  const retryStage = stages[1];
  const finalStage = retryStage?.results.length ? retryStage : primaryStage;
  if (finalStage?.results.length) {
    return finalStage.execution
      ? enrichFusedResults(query, finalStage.execution, finalStage.options, finalStage.results)
      : finalStage.results;
  }

  // Fallback to FTS only
  if (allowedChannels.has('fts')) {
    const ftsResults = ftsSearch(query, options);
    if (ftsResults.length > 0) return ftsResults;
  }

  // Fallback to BM25 only
  if (allowedChannels.has('bm25')) {
    const bm25Results = bm25Search(query, options);
    if (bm25Results.length > 0) return bm25Results;
  }

  console.warn('[hybrid-search] All search methods returned empty results');
  return [];
}

// 12. STRUCTURAL SEARCH (PI-A2 TIER 3)

/**
 * PI-A2: Last-resort structural search against the memory_index table.
 * Retrieves memories ordered by importance tier and weight, without
 * requiring embeddings or text similarity. Pure SQL fallback.
 *
 * @param options - Search options (specFolder for filtering, limit for cap).
 * @returns Array of HybridSearchResult with source='structural'.
 */
function structuralSearch(
  options: Pick<HybridSearchOptions, 'specFolder' | 'limit'> = {}
): HybridSearchResult[] {
  if (!db) {
    console.warn('[hybrid-search] db not initialized — returning empty structuralSearch results');
    return [];
  }

  const limit = options.limit ?? DEFAULT_LIMIT;

  try {
    // Build SQL with optional specFolder filter
    // H13 FIX: Exclude archived rows unless explicitly requested
    const conditions = [
      `(importance_tier IS NULL OR importance_tier NOT IN ('deprecated', 'archived'))`,
      `(is_archived IS NULL OR is_archived = 0)`
    ];
    const params: unknown[] = [];

    if (options.specFolder) {
      conditions.push(`spec_folder = ?`);
      params.push(options.specFolder);
    }

    const whereClause = conditions.join(' AND ');

    const sql = `
      SELECT id, title, file_path, importance_tier, importance_weight, spec_folder
      FROM memory_index
      WHERE ${whereClause}
      ORDER BY
        CASE importance_tier
          WHEN 'constitutional' THEN 1
          WHEN 'critical' THEN 2
          WHEN 'important' THEN 3
          WHEN 'normal' THEN 4
          WHEN 'temporary' THEN 5
          ELSE 6
        END ASC,
        importance_weight DESC,
        created_at DESC
      LIMIT ?
    `;
    params.push(limit);

    const stmt = db.prepare(sql);
    const rows = stmt.all(...params) as Array<Record<string, unknown>>;

    return rows.map((row, index) => ({
      id: row.id as number,
      score: Math.max(0, 1.0 - index * 0.05),
      source: 'structural',
      title: (row.title as string) ?? undefined,
      file_path: row.file_path as string,
      importance_tier: row.importance_tier as string,
      spec_folder: row.spec_folder as string,
    }));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[hybrid-search] Structural search failed: ${msg}`);
    return [];
  }
}

/**
 * Normalize result IDs to a canonical key used for deduplication and source tracking.
 * Handles number-vs-string drift (`42` vs `"42"`) and legacy `mem:42` forms.
 */
function canonicalResultId(id: number | string): string {
  if (typeof id === 'number') {
    return String(id);
  }

  const raw = String(id).trim();
  const memPrefixed = /^mem:(\d+)$/i.exec(raw);
  if (memPrefixed) {
    return String(Number(memPrefixed[1]));
  }

  if (/^\d+$/.test(raw)) {
    return String(Number(raw));
  }

  return raw;
}

function truncateChars(input: string, maxChars: number): string {
  if (input.length <= maxChars) return input;
  if (maxChars <= 1) return input.slice(0, maxChars);
  return `${input.slice(0, maxChars - 1).trimEnd()}…`;
}

function extractSpecSegments(filePath: string): { left: string; right: string; tailKey: string } | null {
  const normalized = filePath.replace(/\\/g, '/');
  const splitToken = '/specs/';
  const splitIdx = normalized.lastIndexOf(splitToken);
  if (splitIdx < 0) return null;

  const relative = normalized.slice(splitIdx + splitToken.length).replace(/^\/+/, '');
  const parts = relative.split('/').filter(Boolean);
  if (parts.length < 2) return null;

  // Prefer spec-folder extraction up to /memory/ so we get [parent > child]
  // For canonical memory paths like:
  // .../specs/<parent>/<child>/memory/<file>.md
  const memoryIdx = parts.indexOf('memory');
  const scopeParts = memoryIdx >= 0 ? parts.slice(0, memoryIdx) : parts.slice(0, -1);
  const tailParts = scopeParts.slice(-2);
  if (tailParts.length < 2) return null;

  return {
    left: tailParts[0],
    right: tailParts[1],
    tailKey: tailParts.join('/'),
  };
}

// Memoize description map to avoid rebuilding on every search query.
// Cache invalidates after 60 seconds so folder renames are eventually picked up.
// M5 fix: Return stale cache immediately and refresh asynchronously to avoid
// Blocking the search hot path with synchronous filesystem crawls.
let descMapCache: { map: Map<string, string>; timestamp: number } | null = null;
let descMapRefreshing = false;
const DESC_MAP_TTL_MS = 60_000;

function rebuildDescriptionTailMap(): Map<string, string> {
  const descByTail = new Map<string, string>();
  const cache = ensureDescriptionCache(getSpecsBasePaths());
  if (!cache || !Array.isArray(cache.folders)) {
    return descByTail;
  }

  for (const entry of cache.folders) {
    const specFolder = typeof entry.specFolder === 'string' ? entry.specFolder : '';
    const description = typeof entry.description === 'string' ? entry.description : '';
    if (!specFolder || !description) continue;
    const folderParts = specFolder.split('/').filter(Boolean);
    if (folderParts.length < 2) continue;
    const tailKey = folderParts.slice(-2).join('/');
    if (!descByTail.has(tailKey)) {
      descByTail.set(tailKey, description);
    }
  }

  return descByTail;
}

function buildDescriptionTailMap(): Map<string, string> {
  // Fresh cache — return immediately
  if (descMapCache && (Date.now() - descMapCache.timestamp) < DESC_MAP_TTL_MS) {
    return descMapCache.map;
  }

  // Stale cache — return it and schedule async refresh (fail open)
  if (descMapCache) {
    if (!descMapRefreshing) {
      descMapRefreshing = true;
      setTimeout(() => {
        try {
          const freshMap = rebuildDescriptionTailMap();
          descMapCache = { map: freshMap, timestamp: Date.now() };
        } catch (_error: unknown) {
          // Non-fatal: stale cache remains usable
        } finally {
          descMapRefreshing = false;
        }
      }, 0);
    }
    return descMapCache.map;
  }

  // Cold start — synchronous build required (no stale data to return)
  const freshMap = rebuildDescriptionTailMap();
  descMapCache = { map: freshMap, timestamp: Date.now() };
  return freshMap;
}

function injectContextualTree(row: HybridSearchResult, descCache: Map<string, string>): HybridSearchResult {
  const rowData = row as Record<string, unknown>;
  const content = rowData.content;
  const filePath = typeof rowData.file_path === 'string' ? rowData.file_path : null;

  if (typeof content !== 'string' || content.length === 0 || !filePath) {
    return row;
  }

  const segments = extractSpecSegments(filePath);
  if (!segments) {
    return row;
  }

  const descriptionRaw = descCache.get(segments.tailKey) ?? '';
  const description = truncateChars(descriptionRaw, 60);
  const base = `[${segments.left} > ${segments.right}`;
  const withDesc = description.length > 0 ? `${base} — ${description}]` : `${base}]`;
  const header = truncateChars(withDesc, CONTEXT_HEADER_MAX_CHARS);

  return {
    ...row,
    content: `${header}\n${content}`,
  };
}

/** Apply caller limit after merges that can expand result count. */
function applyResultLimit(results: HybridSearchResult[], limit?: number): HybridSearchResult[] {
  if (typeof limit !== 'number' || !Number.isFinite(limit) || limit <= 0) {
    return results;
  }
  return results.slice(0, limit);
}

/** Tier-3 structural results are capped at this fraction of the top existing score. */
const TIER3_CAP_RATIO = 0.5;
/** Per-rank score decay for Tier-3 results, as a fraction of the top existing score. */
const TIER3_DECAY_PER_RANK = 0.08;

/**
 * Keep Tier 3 structural fallback scores below established Tier 1/2 confidence.
 * Prevents structural placeholders from outranking stronger semantic/lexical hits.
 */
function calibrateTier3Scores(
  existing: HybridSearchResult[],
  tier3: HybridSearchResult[]
): HybridSearchResult[] {
  const topExisting = existing.reduce((max, row) => {
    if (typeof row.score !== 'number' || !Number.isFinite(row.score)) {
      return max;
    }
    return Math.max(max, row.score);
  }, 0);

  if (topExisting <= 0) {
    return tier3;
  }

  const topCap = topExisting * TIER3_CAP_RATIO;
  const decayPerRank = topExisting * TIER3_DECAY_PER_RANK;

  return tier3.map((row, index) => {
    const calibrated = Math.max(0, topCap - (index * decayPerRank));
    return {
      ...row,
      score: Math.min(row.score, calibrated),
    };
  });
}

// 13. TIERED FALLBACK (PI-A2)

/**
 * Evaluate whether results meet quality thresholds.
 * Returns null if thresholds are met, or a DegradationTrigger if not.
 */
function checkDegradation(results: HybridSearchResult[]): DegradationTrigger | null {
  const scores = results
    .map(r => r.score)
    .filter((score): score is number => typeof score === 'number' && Number.isFinite(score))
    .sort((a, b) => b - a);

  const topScore = scores[0] ?? 0;
  const secondScore = scores[1] ?? 0;
  const relativeGap = topScore > 0 ? (topScore - secondScore) / topScore : 0;
  const count = results.length;

  const lowQuality =
    topScore < DEGRADATION_QUALITY_THRESHOLD
    && relativeGap < DEGRADATION_MIN_RELATIVE_GAP;
  const insufficientResults = count < DEGRADATION_MIN_RESULTS;

  if (!lowQuality && !insufficientResults) return null;

  return {
    reason: lowQuality && insufficientResults ? 'both'
      : lowQuality ? 'low_quality'
      : 'insufficient_results',
    topScore,
    resultCount: count,
    relativeGap,
  };
}

/**
 * Merge two result arrays, deduplicating by id and keeping the higher score.
 */
function mergeResults(
  existing: HybridSearchResult[],
  incoming: HybridSearchResult[]
): HybridSearchResult[] {
  const byId = new Map<string, HybridSearchResult>();

  for (const r of existing) {
    byId.set(canonicalResultId(r.id), r);
  }
  for (const r of incoming) {
    const key = canonicalResultId(r.id);
    const prev = byId.get(key);
    if (!prev || r.score > prev.score) {
      byId.set(key, r);
    }
  }

  return Array.from(byId.values()).sort((a, b) => b.score - a.score);
}

/**
 * PI-A2: Quality-aware 3-tier search fallback chain.
 *
 * TIER 1: hybridSearchEnhanced at minSimilarity=30
 *   → Pass if quality signal is healthy AND count >= 3
 *
 * TIER 2: hybridSearchEnhanced at minSimilarity=10, all allowed channels forced
 *   → Merge with Tier 1, dedup by id
 *   → Pass if quality signal is healthy AND count >= 3
 *
 * TIER 3: structuralSearch (pure SQL last-resort)
 *   → Merge with Tier 1+2 results after score calibration
 *   → Return capped set
 *
 * @param query - The search query string.
 * @param embedding - Optional embedding vector for semantic search.
 * @param options - Hybrid search configuration options.
 * @returns Results with _degradation metadata attached as non-enumerable property.
 */
async function searchWithFallbackTiered(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  const degradationEvents: DegradationEvent[] = [];
  const { stages } = await executeFallbackPlan(query, embedding, options, 'tiered');
  const tier1Stage = stages[0];
  const tier2Stage = stages[1];
  let results = tier1Stage?.results ?? [];

  const tier1Trigger = checkDegradation(results);
  if (!tier1Trigger) {
    const finalTier1 = tier1Stage?.execution
      ? await enrichFusedResults(query, tier1Stage.execution, tier1Stage.options, results)
      : applyResultLimit(results, options.limit);
    // Tier 1 passed quality thresholds — attach empty degradation metadata
    Object.defineProperty(finalTier1, '_degradation', {
      value: degradationEvents,
      enumerable: false,
      configurable: true,
    });
    return finalTier1;
  }

  // TIER 2: Widen search — lower similarity, force all channels
  const tier1CountBefore = results.length;

  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);

  const tier2Results = tier2Stage?.results ?? [];
  results = mergeResults(results, tier2Results);
  degradationEvents.push({
    tier: 1,
    trigger: tier1Trigger,
    resultCountBefore: tier1CountBefore,
    resultCountAfter: results.length,
  });

  const tier2Trigger = checkDegradation(results);
  if (!tier2Trigger) {
    const finalTier2 = tier2Stage?.execution
      ? await enrichFusedResults(query, tier2Stage.execution, tier2Stage.options, results)
      : applyResultLimit(results, options.limit);
    Object.defineProperty(finalTier2, '_degradation', {
      value: degradationEvents,
      enumerable: false,
      configurable: true,
    });
    return finalTier2;
  }

  // TIER 3: Structural search (pure SQL last-resort)
  const tier2CountBefore = results.length;

  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);

  const tier3Results = structuralSearch({ specFolder: options.specFolder, limit: options.limit });
  const calibratedTier3 = calibrateTier3Scores(results, tier3Results);
  results = mergeResults(results, calibratedTier3);
  degradationEvents.push({
    tier: 2,
    trigger: tier2Trigger,
    resultCountBefore: tier2CountBefore,
    resultCountAfter: results.length,
  });

  const finalResults = tier2Stage?.execution
    ? await enrichFusedResults(query, tier2Stage.execution, tier2Stage.options, results)
    : applyResultLimit(results, options.limit);

  Object.defineProperty(finalResults, '_degradation', {
    value: degradationEvents,
    enumerable: false,
    configurable: true,
  });

  return finalResults;
}

// 14. PRE-FLIGHT TOKEN BUDGET VALIDATION (T007)

/** Default token budget — configurable via SPECKIT_TOKEN_BUDGET env var. */
const DEFAULT_TOKEN_BUDGET = 2000;

/** Maximum characters for a summary fallback when a single result overflows the budget. */
const SUMMARY_MAX_CHARS = 400;

/** Overflow log entry recording budget truncation events for eval infrastructure. */
interface OverflowLogEntry {
  queryId: string;
  candidateCount: number;
  totalTokens: number;
  budgetLimit: number;
  truncatedToCount: number;
  timestamp: string;
}

/** Result of budget-aware truncation. */
interface TruncateToBudgetResult {
  results: HybridSearchResult[];
  truncated: boolean;
  overflow?: OverflowLogEntry;
}

/**
 * Estimate token count for a text string using a chars/4 heuristic.
 * @param text - The text to estimate tokens for.
 * @returns Approximate token count (ceiling of length / 4).
 */
function estimateTokenCount(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

function estimateStructuredValueChars(value: unknown, seen: WeakSet<object>): number {
  if (value == null) return 4;

  if (typeof value === 'string') return value.length + 2;
  if (typeof value === 'number' || typeof value === 'bigint') return String(value).length;
  if (typeof value === 'boolean') return value ? 4 : 5;

  if (Array.isArray(value)) {
    let chars = 2;
    for (const item of value) {
      chars += estimateStructuredValueChars(item, seen) + 1;
    }
    return chars;
  }

  if (typeof value !== 'object') return 0;
  if (seen.has(value)) return 8;
  seen.add(value);

  let chars = 2;
  for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
    chars += key.length + 3;
    chars += estimateStructuredValueChars(nestedValue, seen) + 1;
  }
  return chars;
}

/**
 * Estimate the token footprint of a single HybridSearchResult.
 * @param result - The search result to measure.
 * @returns Approximate token count based on serialized key-value lengths.
 */
function estimateResultTokens(result: HybridSearchResult): number {
  const record = result as Record<string, unknown>;
  const seen = new WeakSet<object>();
  const handledKeys = new Set([
    'id',
    'score',
    'source',
    'title',
    'content',
    'sources',
    'spec_folder',
    'file_path',
    'traceMetadata',
    'parentMemoryId',
    'chunkIndex',
    'similarity',
    'combined_lexical_score',
  ]);

  let chars = 0;
  for (const key of handledKeys) {
    if (!(key in record)) continue;
    chars += key.length + 3;
    chars += estimateStructuredValueChars(record[key], seen) + 1;
  }

  for (const key of Object.keys(record)) {
    if (handledKeys.has(key)) continue;
    const value = record[key];
    chars += key.length + 3;
    chars += estimateStructuredValueChars(value, seen) + 1;
  }

  return Math.ceil(chars / 4);
}

/**
 * Read the configured token budget from SPECKIT_TOKEN_BUDGET env var,
 * falling back to DEFAULT_TOKEN_BUDGET (2000).
 * @returns The effective token budget for result truncation.
 */
function getTokenBudget(): number {
  const envVal = process.env['SPECKIT_TOKEN_BUDGET'];
  if (envVal) {
    const parsed = parseInt(envVal, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return DEFAULT_TOKEN_BUDGET;
}

/**
 * Create a summary fallback for a single result whose content exceeds the token budget.
 */
function createSummaryFallback(result: HybridSearchResult, budget: number): HybridSearchResult {
  const content = typeof result['content'] === 'string' ? result['content'] as string : '';
  const title = typeof result['title'] === 'string' ? result['title'] : 'Untitled';

  const maxSummaryChars = Math.min(SUMMARY_MAX_CHARS, budget * 4);
  const truncatedContent = content.length > maxSummaryChars
    ? content.slice(0, maxSummaryChars) + '...'
    : content;

  return {
    ...result,
    content: `[Summary] ${title}: ${truncatedContent}`,
    _summarized: true,
  };
}

/**
 * Truncate a result set to fit within a token budget using greedy highest-scoring-first strategy.
 * @param results - The full result set to truncate.
 * @param budget - Optional token budget override (defaults to SPECKIT_TOKEN_BUDGET env / 2000).
 * @param options - Optional includeContent flag and queryId for overflow logging.
 * @returns Object with truncated results, truncation flag, and optional overflow log entry.
 */
function truncateToBudget(
  results: HybridSearchResult[],
  budget?: number,
  options?: { includeContent?: boolean; queryId?: string }
): TruncateToBudgetResult {
  const effectiveBudget = (budget && budget > 0) ? budget : getTokenBudget();
  const includeContent = options?.includeContent ?? false;
  const queryId = options?.queryId ?? `q-${Date.now()}`;

  if (results.length === 0) {
    return { results: [], truncated: false };
  }

  const sorted = [...results].sort((a, b) => b.score - a.score);
  const tokenEstimateCache = new Map<string, number>();
  const getTokenEstimate = (result: HybridSearchResult): number => {
    const cacheKey = canonicalResultId(result.id);
    const cached = tokenEstimateCache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const estimate = estimateResultTokens(result);
    tokenEstimateCache.set(cacheKey, estimate);
    return estimate;
  };

  const totalTokens = sorted.reduce((sum, result) => sum + getTokenEstimate(result), 0);

  if (totalTokens <= effectiveBudget) {
    return { results: sorted, truncated: false };
  }

  // Single-result overflow: summarize when content is included, otherwise keep
  // the lone result and mark the overflow for callers.
  if (sorted.length === 1) {
    const outputResult = includeContent
      ? createSummaryFallback(sorted[0]!, effectiveBudget)
      : sorted[0]!;
    const overflow: OverflowLogEntry = {
      queryId,
      candidateCount: 1,
      totalTokens,
      budgetLimit: effectiveBudget,
      truncatedToCount: 1,
      timestamp: new Date().toISOString(),
    };
    console.warn(
      `[hybrid-search] Token budget overflow (single-result fallback): ` +
      `${totalTokens} tokens > ${effectiveBudget} budget`
    );
    return { results: [outputResult], truncated: true, overflow };
  }

  // Greedy accumulation: take highest-scoring results until budget exhausted
  const accepted: HybridSearchResult[] = [];
  let accumulated = 0;

  for (const result of sorted) {
    const tokens = getTokenEstimate(result);
    if (accumulated + tokens > effectiveBudget) {
      if (accepted.length > 0) {
        break;
      }
      continue;
    }
    accepted.push(result);
    accumulated += tokens;
    if (accumulated >= effectiveBudget) break;
  }

  if (accepted.length === 0 && sorted.length > 0) {
    const outputResult = includeContent
      ? createSummaryFallback(sorted[0]!, effectiveBudget)
      : sorted[0]!;
    const overflow: OverflowLogEntry = {
      queryId,
      candidateCount: results.length,
      totalTokens,
      budgetLimit: effectiveBudget,
      truncatedToCount: 1,
      timestamp: new Date().toISOString(),
    };

    console.warn(
      `[hybrid-search] Token budget overflow (top-result fallback): ` +
      `${totalTokens} tokens > ${effectiveBudget} budget`
    );

    return { results: [outputResult], truncated: true, overflow };
  }

  const overflow: OverflowLogEntry = {
    queryId,
    candidateCount: results.length,
    totalTokens,
    budgetLimit: effectiveBudget,
    truncatedToCount: accepted.length,
    timestamp: new Date().toISOString(),
  };

  console.warn(
    `[hybrid-search] Token budget overflow: ${totalTokens} tokens > ${effectiveBudget} budget, ` +
    `truncated ${results.length} → ${accepted.length} results`
  );

  return { results: accepted, truncated: true, overflow };
}

// 15. EXPORTS

export const __testables = {
  canonicalResultId,
  truncateChars,
  extractSpecSegments,
  injectContextualTree,
  applyResultLimit,
  calibrateTier3Scores,
  checkDegradation,
  mergeResults,
  mergeRawCandidate,
};

export {
  init,
  bm25Search,
  isBm25Available,
  combinedLexicalSearch,
  collectRawCandidates,
  isFtsAvailable,
  ftsSearch,
  hybridSearch,
  hybridSearchEnhanced,
  searchWithFallback,
  getGraphMetrics,
  resetGraphMetrics,
  // Token budget validation
  estimateTokenCount,
  estimateResultTokens,
  truncateToBudget,
  getTokenBudget,
  DEFAULT_TOKEN_BUDGET,
  SUMMARY_MAX_CHARS,
  // Re-exported module functions for caller access
  routeQuery,
  getDynamicTokenBudget,
  isDynamicTokenBudgetEnabled,
  // PI-A2: Tiered fallback exports
  structuralSearch,
  DEGRADATION_QUALITY_THRESHOLD,
  DEGRADATION_MIN_RESULTS,
};

export type {
  HybridSearchOptions,
  HybridSearchResult,
  VectorSearchFn,
  // Token budget types
  OverflowLogEntry,
  TruncateToBudgetResult,
  // Pipeline metadata type
  Sprint3PipelineMeta,
  // PI-A2: Degradation types
  DegradationEvent,
  FallbackTier,
};
