// ---------------------------------------------------------------
// MODULE: Memory Search
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. DEPENDENCIES
--------------------------------------------------------------- */

import * as toolCache from '../lib/cache/tool-cache';
import * as sessionManager from '../lib/session/session-manager';
import * as intentClassifier from '../lib/search/intent-classifier';
// AI-WHY: tierClassifier, crossEncoder imports removed — only used by legacy V1 pipeline.
import { isEnabled as isSessionBoostEnabled } from '../lib/search/session-boost';
import { isEnabled as isCausalBoostEnabled } from '../lib/search/causal-boost';
// Sprint 5 (R6): 4-stage pipeline architecture
import { executePipeline } from '../lib/search/pipeline';
import type { PipelineConfig, PipelineResult } from '../lib/search/pipeline';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger';
// AI-TRACE:C136-09: Artifact-class routing (spec/plan/tasks/checklist/memory)
import { applyRoutingWeights, getStrategyForQuery } from '../lib/search/artifact-routing';

// AI-TRACE:T005: Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger';

// Core utilities
import { checkDatabaseUpdated, isEmbeddingModelReady, waitForEmbeddingModel } from '../core';

// Utils
import { validateQuery, requireDb, toErrorMessage } from '../utils';

// Response envelope
import { createMCPErrorResponse } from '../lib/response/envelope';

// Formatters
import { formatSearchResults } from '../formatters';

// Shared handler types
import type { MCPResponse, IntentClassification } from './types';

// AI-TRACE: Retrieval trace contracts (C136-08)
import { createTrace } from '@spec-kit/shared/contracts/retrieval-trace';

// Type imports for casting
import type { IntentType, IntentWeights as IntentClassifierWeights } from '../lib/search/intent-classifier';
import type { RawSearchResult } from '../formatters';
import type { RoutingResult, WeightedResult } from '../lib/search/artifact-routing';

/* ---------------------------------------------------------------
   2. TYPES
--------------------------------------------------------------- */

/**
 * Internal search result row — enriched DB row used within this handler.
 * NOT the same as the canonical SearchResult in shared/types.ts.
 * Self-contained: uses local types instead of deprecated MemoryRow/MemoryRecord (removed in Phase 6B).
 * Phase 6B will migrate this to MemoryDbRow & Record<string, unknown>.
 */
interface MemorySearchRow extends Record<string, unknown> {
  id: number;
  similarity?: number;
  importance_tier?: string;
  contextType?: string;
  context_type?: string;
  attentionScore?: number;
  retrievability?: number;
  stability?: number;
  last_review?: string | null;
  created_at?: string;
  last_accessed?: number;
  content?: string;
  memoryState?: string;
  file_path?: string;
  parent_id?: number | null;
  chunk_index?: number | null;
  chunk_label?: string | null;
  isChunk?: boolean;
  parentId?: number | null;
  chunkIndex?: number | null;
  chunkLabel?: string | null;
  chunkCount?: number | null;
  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
  precomputedContent?: string;
}

interface DedupResult {
  results: MemorySearchRow[];
  dedupStats: Record<string, unknown>;
}

interface ChunkReassemblyResult {
  results: MemorySearchRow[];
  stats: {
    collapsedChunkHits: number;
    chunkParents: number;
    reassembled: number;
    fallback: number;
  };
}

type IntentWeights = IntentClassifierWeights;

interface EvalChannelPayload {
  channel: string;
  resultMemoryIds: number[];
  scores: number[];
}

interface SearchArgs {
  query?: string;
  concepts?: string[];
  specFolder?: string;
  limit?: number;
  tier?: string;
  contextType?: string;
  useDecay?: boolean;
  includeContiguity?: boolean;
  includeConstitutional?: boolean;
  includeContent?: boolean;
  anchors?: string[];
  bypassCache?: boolean;
  sessionId?: string;
  enableDedup?: boolean;
  intent?: string;
  autoDetectIntent?: boolean;
  minState?: string;
  applyStateLimits?: boolean;
  rerank?: boolean;
  applyLengthPenalty?: boolean;
  trackAccess?: boolean; // AI-TRACE:P3-09: opt-in access tracking (default false)
  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
  enableSessionBoost?: boolean;
  enableCausalBoost?: boolean;
  minQualityScore?: number;
  min_quality_score?: number;
  mode?: string; // AI-TRACE:C138-P3: "deep" mode enables query expansion for multi-query RAG
  includeTrace?: boolean;
}

function resolveRowContextType(row: MemorySearchRow): string | undefined {
  if (typeof row.contextType === 'string' && row.contextType.length > 0) {
    return row.contextType;
  }
  if (typeof row.context_type === 'string' && row.context_type.length > 0) {
    return row.context_type;
  }
  return undefined;
}

function resolveEvalScore(row: Record<string, unknown>): number {
  const score = row.score;
  if (typeof score === 'number' && Number.isFinite(score)) {
    return score;
  }

  const similarity = row.similarity;
  if (typeof similarity === 'number' && Number.isFinite(similarity)) {
    return similarity;
  }

  const rrfScore = row.rrfScore;
  if (typeof rrfScore === 'number' && Number.isFinite(rrfScore)) {
    return rrfScore;
  }

  return 0;
}

function collectEvalChannelsFromRow(row: Record<string, unknown>): string[] {
  const channels = new Set<string>();

  if (Array.isArray(row.sources)) {
    for (const source of row.sources) {
      if (typeof source === 'string' && source.trim().length > 0) {
        channels.add(source.trim());
      }
    }
  }

  if (typeof row.source === 'string' && row.source.trim().length > 0) {
    channels.add(row.source.trim());
  }

  if (Array.isArray(row.channelAttribution)) {
    for (const source of row.channelAttribution) {
      if (typeof source === 'string' && source.trim().length > 0) {
        channels.add(source.trim());
      }
    }
  }

  if (channels.size === 0) {
    channels.add('hybrid');
  }

  return Array.from(channels);
}

function buildEvalChannelPayloads(rows: Array<Record<string, unknown>>): EvalChannelPayload[] {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [];
  }

  const byChannel = new Map<string, Map<number, number>>();

  for (const row of rows) {
    const rawId = row.id;
    if (typeof rawId !== 'number' || !Number.isInteger(rawId) || rawId <= 0) {
      continue;
    }

    const score = resolveEvalScore(row);
    const channels = collectEvalChannelsFromRow(row);

    for (const channel of channels) {
      const bucket = byChannel.get(channel) ?? new Map<number, number>();
      const existing = bucket.get(rawId);
      if (existing === undefined || score > existing) {
        bucket.set(rawId, score);
      }
      byChannel.set(channel, bucket);
    }
  }

  return Array.from(byChannel.entries()).map(([channel, idToScore]): EvalChannelPayload => {
    const entries = Array.from(idToScore.entries());
    return {
      channel,
      resultMemoryIds: entries.map(([id]) => id),
      scores: entries.map(([, score]) => score),
    };
  });
}

function filterByMinQualityScore(results: MemorySearchRow[], minQualityScore?: number): MemorySearchRow[] {
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

function resolveQualityThreshold(minQualityScore?: number, minQualityScoreSnake?: number): number | undefined {
  if (typeof minQualityScore === 'number' && Number.isFinite(minQualityScore)) {
    return minQualityScore;
  }

  if (typeof minQualityScoreSnake === 'number' && Number.isFinite(minQualityScoreSnake)) {
    return minQualityScoreSnake;
  }

  return undefined;
}

interface CacheArgsInput {
  normalizedQuery: string | null;
  hasValidConcepts: boolean;
  concepts?: string[];
  specFolder?: string;
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

function buildCacheArgs({
  normalizedQuery,
  hasValidConcepts,
  concepts,
  specFolder,
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

function resolveArtifactRoutingQuery(query: string | null, concepts?: string[]): string {
  if (typeof query === 'string' && query.trim().length > 0) {
    return query;
  }

  if (Array.isArray(concepts) && concepts.length > 0) {
    return concepts.join(' ');
  }

  return '';
}

function applyArtifactRouting(results: MemorySearchRow[], routingResult?: RoutingResult): MemorySearchRow[] {
  if (!Array.isArray(results) || results.length === 0) {
    return results;
  }

  if (!routingResult || routingResult.detectedClass === 'unknown' || routingResult.confidence <= 0) {
    return results;
  }

  return applyRoutingWeights(results as WeightedResult[], routingResult.strategy) as MemorySearchRow[];
}

function parseNullableInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && Number.isInteger(parsed)) {
      return parsed;
    }
  }
  return null;
}

function collapseAndReassembleChunkResults(results: MemorySearchRow[]): ChunkReassemblyResult {
  if (!Array.isArray(results) || results.length === 0) {
    return {
      results: [],
      stats: {
        collapsedChunkHits: 0,
        chunkParents: 0,
        reassembled: 0,
        fallback: 0,
      },
    };
  }

  const seenParents = new Set<number>();
  const parentIds = new Set<number>();
  const collapsed: MemorySearchRow[] = [];
  let collapsedChunkHits = 0;

  for (const row of results) {
    const parentId = parseNullableInt(row.parent_id);
    if (parentId !== null) {
      if (seenParents.has(parentId)) {
        collapsedChunkHits++;
        continue;
      }
      seenParents.add(parentId);
      parentIds.add(parentId);
      collapsed.push({
        ...row,
        isChunk: true,
        parentId,
        chunkIndex: parseNullableInt(row.chunk_index),
        chunkLabel: typeof row.chunk_label === 'string' ? row.chunk_label : null,
        chunkCount: null,
        contentSource: 'file_read_fallback',
      });
      continue;
    }

    collapsed.push({
      ...row,
      isChunk: false,
      parentId: null,
      chunkIndex: null,
      chunkLabel: null,
      chunkCount: null,
    });
  }

  if (parentIds.size === 0) {
    return {
      results: collapsed,
      stats: {
        collapsedChunkHits,
        chunkParents: 0,
        reassembled: 0,
        fallback: 0,
      },
    };
  }

  try {
    const database = requireDb();
    const ids = Array.from(parentIds);
    const placeholders = ids.map(() => '?').join(', ');
    const rows = database.prepare(`
      SELECT parent_id, chunk_index, chunk_label, content_text
      FROM memory_index
      WHERE parent_id IN (${placeholders})
      ORDER BY parent_id ASC, chunk_index ASC
    `).all(...ids) as Array<{
      parent_id: number;
      chunk_index: number | null;
      chunk_label: string | null;
      content_text: string | null;
    }>;

    const byParent = new Map<number, Array<{
      chunk_index: number | null;
      chunk_label: string | null;
      content_text: string | null;
    }>>();

    for (const row of rows) {
      const list = byParent.get(row.parent_id);
      if (list) {
        list.push(row);
      } else {
        byParent.set(row.parent_id, [row]);
      }
    }

    let reassembled = 0;
    let fallback = 0;
    const withContent: MemorySearchRow[] = collapsed.map((row): MemorySearchRow => {
      if (!row.isChunk || row.parentId == null) return row;

      const chunks = byParent.get(row.parentId) || [];
      const chunkCount = chunks.length;
      if (chunkCount === 0) {
        fallback++;
        return { ...row, chunkCount, contentSource: 'file_read_fallback' as const };
      }

      const normalizedChunks = chunks
        .slice()
        .sort((a, b) => (a.chunk_index ?? Number.MAX_SAFE_INTEGER) - (b.chunk_index ?? Number.MAX_SAFE_INTEGER));

      const hasMissingContent = normalizedChunks.some(
        (chunk) => typeof chunk.content_text !== 'string' || chunk.content_text.trim().length === 0
      );

      if (hasMissingContent) {
        fallback++;
        return { ...row, chunkCount, contentSource: 'file_read_fallback' as const };
      }

      const reassembledContent = normalizedChunks
        .map((chunk) => (chunk.content_text as string).trim())
        .filter(Boolean)
        .join('\n\n')
        .trim();

      if (!reassembledContent) {
        fallback++;
        return { ...row, chunkCount, contentSource: 'file_read_fallback' as const };
      }

      reassembled++;
      return {
        ...row,
        chunkCount,
        precomputedContent: reassembledContent,
        contentSource: 'reassembled_chunks' as const,
      };
    });

    return {
      results: withContent,
      stats: {
        collapsedChunkHits,
        chunkParents: parentIds.size,
        reassembled,
        fallback,
      },
    };
  } catch (error: unknown) {
    const message = toErrorMessage(error);
    console.warn('[memory-search] Failed to reassemble chunked results, falling back to file reads:', message);
    return {
      results: collapsed,
      stats: {
        collapsedChunkHits,
        chunkParents: parentIds.size,
        reassembled: 0,
        fallback: parentIds.size,
      },
    };
  }
}

/* ---------------------------------------------------------------
   3. CONFIGURATION
--------------------------------------------------------------- */

// AI-WHY: Sections 3–5 (STATE_PRIORITY, MAX_DEEP_QUERY_VARIANTS, buildDeepQueryVariants,
// strengthenOnAccess, applyTestingEffect, filterByMemoryState) removed in
// 017-refinement-phase-6 Sprint 1. These were only used by the legacy V1 pipeline.
// The V2 4-stage pipeline handles state filtering (Stage 4), testing effect, and
// query expansion through its own stages.

/* ---------------------------------------------------------------
   6. SESSION DEDUPLICATION UTILITIES
--------------------------------------------------------------- */

function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
    return {
      results,
      dedupStats: { enabled: false, sessionId: null }
    };
  }

  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);

  if (filtered.length > 0) {
    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
  }

  return {
    results: filtered as MemorySearchRow[],
    dedupStats: {
      ...dedupStats,
      sessionId
    }
  };
}

// AI-WHY: Sections 7–9 (applyCrossEncoderReranking, applyIntentWeightsToResults,
// shouldApplyPostSearchIntentWeighting, postSearchPipeline) removed in
// 017-refinement-phase-6 Sprint 1. These were only used by the legacy V1 pipeline
// path. The V2 4-stage pipeline handles all equivalent functionality.

/* ---------------------------------------------------------------
   10. MAIN HANDLER
--------------------------------------------------------------- */

/** Handle memory_search tool - performs hybrid vector/BM25 search with intent-aware ranking */
async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
  const _searchStartTime = Date.now();
  // BUG-001: Check for external database updates before processing
  await checkDatabaseUpdated();

  const {
    query,
    concepts,
    specFolder,
    limit: rawLimit = 10,
    tier,
    contextType,
    useDecay: useDecay = true,
    includeContiguity: includeContiguity = false,
    includeConstitutional: includeConstitutional = true,
    includeContent: includeContent = false,
    anchors,
    bypassCache: bypassCache = false,
    sessionId,
    enableDedup: enableDedup = true,
    intent: explicitIntent,
    autoDetectIntent: autoDetectIntent = true,
    minState: minState = 'WARM',
    applyStateLimits: applyStateLimits = false,
    rerank = true, // AI-TRACE:C138-P2: Enable reranking by default for better result quality
    applyLengthPenalty: applyLengthPenalty = true,
    trackAccess: trackAccess = false, // AI-TRACE:P3-09: opt-in, off by default
    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(),
    enableCausalBoost: enableCausalBoost = isCausalBoostEnabled(),
    minQualityScore,
    min_quality_score,
    mode,
    includeTrace: includeTraceArg = false,
  } = args;
  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
  const includeTrace = includeTraceByFlag || includeTraceArg === true;

  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);

  // AI-TRACE:T120: Validate numeric limit parameter
  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
    ? Math.min(Math.floor(rawLimit), 100)
    : 10;

  // BUG-007: Validate query first with proper error handling
  let normalizedQuery: string | null = null;
  if (query !== undefined) {
    try {
      normalizedQuery = validateQuery(query);
    } catch (validationError: unknown) {
      if (!concepts || !Array.isArray(concepts) || concepts.length < 2) {
        const message = toErrorMessage(validationError);
        return createMCPErrorResponse({
          tool: 'memory_search',
          error: message,
          code: 'E_VALIDATION',
          details: { parameter: 'query' },
          recovery: {
            hint: 'Provide a valid query string or use concepts array instead'
          }
        });
      }
      normalizedQuery = null;
    }
  }

  const hasValidQuery = normalizedQuery !== null;
  const hasValidConcepts = Array.isArray(concepts) && concepts.length >= 2;

  if (!hasValidQuery && !hasValidConcepts) {
    return createMCPErrorResponse({
      tool: 'memory_search',
      error: 'Either query (string) or concepts (array of 2-5 strings) is required',
      code: 'E_VALIDATION',
      details: { parameter: 'query' },
      recovery: {
        hint: 'Provide a query string or concepts array with 2-5 entries'
      }
    });
  }

  if (specFolder !== undefined && typeof specFolder !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_search',
      error: 'specFolder must be a string',
      code: 'E_VALIDATION',
      details: { parameter: 'specFolder' },
      recovery: {
        hint: 'Provide specFolder as a string path'
      }
    });
  }

  // AI-TRACE:T005: Eval logger — capture query at pipeline entry (fail-safe)
  let _evalQueryId = 0;
  let _evalRunId = 0;
  try {
    const evalEntry = logSearchQuery({
      query: normalizedQuery ?? (Array.isArray(concepts) ? concepts.join(', ') : ''),
      intent: explicitIntent ?? null,
      specFolder: specFolder ?? null,
    });
    _evalQueryId = evalEntry.queryId;
    _evalRunId = evalEntry.evalRunId;
  } catch { /* eval logging must never break search */ }

  const artifactRoutingQuery = resolveArtifactRoutingQuery(
    normalizedQuery,
    hasValidConcepts ? concepts : undefined
  );
  const artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder);

  // AI-TRACE:T039: Intent-aware retrieval
  let detectedIntent: string | null = null;
  let intentConfidence = 0;
  let intentWeights: IntentWeights | null = null;

  if (explicitIntent) {
    if (intentClassifier.isValidIntent(explicitIntent)) {
      detectedIntent = explicitIntent;
      intentConfidence = 1.0;
      intentWeights = intentClassifier.getIntentWeights(explicitIntent);
    } else {
      console.warn(`[memory-search] Invalid intent '${explicitIntent}', using auto-detection`);
    }
  }

  if (!detectedIntent && autoDetectIntent && hasValidQuery) {
    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedQuery!);
    detectedIntent = classification.intent;
    intentConfidence = classification.confidence;
    intentWeights = intentClassifier.getIntentWeights(classification.intent as IntentType);

    if (classification.fallback) {
      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
    } else {
      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
    }
  }

  // AI-TRACE:C136-08: Create retrieval trace at pipeline entry
  const trace = createTrace(
    normalizedQuery || (concepts ? concepts.join(', ') : ''),
    sessionId,
    detectedIntent || undefined
  );

  // AI-TRACE:T012-T015: Build cache key args
  const cacheArgs = buildCacheArgs({
    normalizedQuery,
    hasValidConcepts,
    concepts,
    specFolder,
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
    includeTrace,
  });

  let _evalChannelPayloads: EvalChannelPayload[] = [];

  // AI-TRACE:T012-T015: Use cache wrapper for search execution
  const cachedResult = await toolCache.withCache(
    'memory_search',
    cacheArgs,
    async () => {
      // AI-TRACE:P1-CODE-003: Wait for embedding model only on cache miss
      if (!isEmbeddingModelReady()) {
        const modelReady = await waitForEmbeddingModel(30000);
        if (!modelReady) {
          throw new Error('Embedding model not ready after 30s timeout. Try again later.');
        }
      }

      // AI-WHY: V2 pipeline is the only path (legacy V1 removed in 017-refinement-phase-6)
      {
        const pipelineConfig: PipelineConfig = {
          query: normalizedQuery || '',
          concepts: hasValidConcepts ? concepts : undefined,
          searchType: (hasValidConcepts && concepts!.length >= 2)
            ? 'multi-concept'
            : 'hybrid',
          mode,
          limit,
          specFolder,
          tier,
          contextType,
          includeArchived,
          includeConstitutional,
          includeContent,
          anchors,
          qualityThreshold,
          minState,
          applyStateLimits,
          useDecay,
          rerank,
          applyLengthPenalty,
          sessionId,
          enableDedup,
          enableSessionBoost,
          enableCausalBoost,
          trackAccess,
          detectedIntent,
          intentConfidence,
          intentWeights: intentWeights as unknown as PipelineConfig['intentWeights'],
          artifactRouting: artifactRouting as unknown as PipelineConfig['artifactRouting'],
          trace,
        };

        const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);

        // Build extra data from pipeline metadata for response formatting
        const extraData: Record<string, unknown> = {
          stateStats: pipelineResult.annotations.stateStats,
          featureFlags: {
            ...pipelineResult.annotations.featureFlags,
            pipelineV2: true,
          },
          pipelineMetadata: pipelineResult.metadata,
        };

        if (pipelineResult.annotations.evidenceGapWarning) {
          extraData.evidenceGapWarning = pipelineResult.annotations.evidenceGapWarning;
        }

        if (detectedIntent) {
          extraData.intent = {
            type: detectedIntent,
            confidence: intentConfidence,
            description: intentClassifier.getIntentDescription(detectedIntent as IntentType),
            weightsApplied: pipelineResult.metadata.stage2.intentWeightsApplied,
          };
        }

        if (artifactRouting) {
          extraData.artifactRouting = artifactRouting;
          extraData.artifact_routing = artifactRouting;
        }

        if (pipelineResult.metadata.stage2.feedbackSignalsApplied) {
          extraData.feedbackSignals = { applied: true };
          extraData.feedback_signals = { applied: true };
        }

        if (pipelineResult.metadata.stage3.rerankApplied) {
          extraData.rerankMetadata = {
            reranking_enabled: true,
            reranking_requested: true,
            reranking_applied: true,
          };
        }

        if (pipelineResult.metadata.stage3.chunkReassemblyStats.chunkParents > 0) {
          extraData.chunkReassembly = pipelineResult.metadata.stage3.chunkReassemblyStats;
          extraData.chunk_reassembly = pipelineResult.metadata.stage3.chunkReassemblyStats;
        }

        if (pipelineResult.trace) {
          extraData.retrievalTrace = pipelineResult.trace;
        }

        _evalChannelPayloads = buildEvalChannelPayloads(
          pipelineResult.results as unknown as Array<Record<string, unknown>>
        );

        const appliedBoosts = {
          session: { applied: pipelineResult.metadata.stage2.sessionBoostApplied },
          causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
        };
        extraData.appliedBoosts = appliedBoosts;
        extraData.applied_boosts = appliedBoosts;

        const formatted = await formatSearchResults(
          pipelineResult.results as unknown as RawSearchResult[],
          pipelineConfig.searchType,
          includeContent,
          anchors,
          null,
          null,
          extraData,
          includeTrace
        );

        // Prepend evidence gap warning if present
        if (pipelineResult.annotations.evidenceGapWarning && formatted?.content?.[0]?.text) {
          try {
            const parsed = JSON.parse(formatted.content[0].text) as Record<string, unknown>;
            if (typeof parsed.summary === 'string') {
              parsed.summary = `${pipelineResult.annotations.evidenceGapWarning}\n\n${parsed.summary}`;
              formatted.content[0].text = JSON.stringify(parsed, null, 2);
            }
          } catch {
            // Non-fatal
          }
        }

        return formatted;
      }
    },
    { bypassCache }
  );

  let responseToReturn: MCPResponse = cachedResult;

  // AI-TRACE:T123: Apply session deduplication AFTER cache
  if (sessionId && enableDedup && sessionManager.isEnabled()) {
    let resultsData: Record<string, unknown> | null = null;
    if (responseToReturn?.content?.[0]?.text && typeof responseToReturn.content[0].text === 'string') {
      try {
        resultsData = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        console.warn('[memory-search] Failed to parse cached response for dedup:', message);
        resultsData = null;
      }
    } else if (responseToReturn && typeof responseToReturn === 'object') {
      resultsData = responseToReturn as unknown as Record<string, unknown>;
    }

    // AI-GUARD: P1-018 — Validate response shape before dedup. If the cached response
    // doesn't have the expected data.results array, log a warning and skip dedup
    // rather than silently falling through to the un-deduped response.
    const data = (resultsData && typeof resultsData.data === 'object' && resultsData.data !== null)
      ? resultsData.data as Record<string, unknown>
      : null;
    const existingResults = Array.isArray(data?.results) ? data.results as MemorySearchRow[] : null;

    if (resultsData && !data) {
      console.warn('[memory-search] Cached response shape mismatch: missing "data" object, skipping dedup');
    } else if (data && !existingResults) {
      console.warn('[memory-search] Cached response shape mismatch: "data.results" is not an array, skipping dedup');
    }

    if (resultsData && data && existingResults && existingResults.length > 0) {
      const { results: dedupedResults } = applySessionDedup(
        existingResults,
        sessionId,
        enableDedup
      );

      const originalCount = existingResults.length;
      const dedupedCount = dedupedResults.length;
      const filteredCount = originalCount - dedupedCount;

      const tokensSaved = filteredCount * 200;
      const savingsPercent = originalCount > 0
        ? Math.round((filteredCount / originalCount) * 100)
        : 0;

      data.results = dedupedResults;
      data.count = dedupedCount;

      const dedupStats = {
        enabled: true,
        sessionId,
        originalCount: originalCount,
        returnedCount: dedupedCount,
        filteredCount: filteredCount,
        tokensSaved: tokensSaved,
        savingsPercent: savingsPercent,
        tokenSavingsEstimate: tokensSaved > 0 ? `~${tokensSaved} tokens` : '0'
      };
      resultsData.dedupStats = dedupStats;

      if (resultsData.meta && typeof resultsData.meta === 'object') {
        (resultsData.meta as Record<string, unknown>).dedupStats = dedupStats;
      }

      if (filteredCount > 0 && typeof resultsData.summary === 'string') {
        resultsData.summary += ` (${filteredCount} duplicates filtered, ~${tokensSaved} tokens saved)`;
      }

      responseToReturn = {
        ...responseToReturn,
        content: [{ type: 'text', text: JSON.stringify(resultsData, null, 2) }]
      } as MCPResponse;
    }
  }

  // AI-TRACE:T004: Consumption instrumentation — log search event (fail-safe, never throws)
  try {
    const db = (() => { try { return requireDb(); } catch { return null; } })();
    if (db) {
      initConsumptionLog(db);
      let resultIds: number[] = [];
      let resultCount = 0;
      try {
        if (responseToReturn?.content?.[0]?.text) {
          const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
          const data = parsed?.data as Record<string, unknown> | undefined;
          const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
          resultIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
          resultCount = Array.isArray(data?.results) ? (data.results as unknown[]).length : 0;
        }
      } catch { /* ignore parse errors */ }
      logConsumptionEvent(db, {
        event_type: 'search',
        query_text: normalizedQuery ?? (Array.isArray(concepts) ? concepts.join(', ') : null),
        intent: detectedIntent,
        result_count: resultCount,
        result_ids: resultIds,
        session_id: sessionId ?? null,
        latency_ms: Date.now() - _searchStartTime,
        spec_folder_filter: specFolder ?? null,
      });
    }
  } catch { /* instrumentation must never cause search to fail */ }

  // AI-TRACE:T005: Eval logger — capture final results at pipeline exit (fail-safe)
  try {
    if (_evalRunId && _evalQueryId) {
      let finalMemoryIds: number[] = [];
      let finalScores: number[] = [];
      try {
        if (responseToReturn?.content?.[0]?.text) {
          const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
          const data = parsed?.data as Record<string, unknown> | undefined;
          const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
          finalMemoryIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
          finalScores = results.map(r => (r.score ?? r.similarity ?? 0) as number);
        }
      } catch { /* ignore parse errors */ }
      logFinalResult({
        evalRunId: _evalRunId,
        queryId: _evalQueryId,
        resultMemoryIds: finalMemoryIds,
        scores: finalScores,
        fusionMethod: 'rrf',
        latencyMs: Date.now() - _searchStartTime,
      });

      for (const payload of _evalChannelPayloads) {
        logChannelResult({
          evalRunId: _evalRunId,
          queryId: _evalQueryId,
          channel: payload.channel,
          resultMemoryIds: payload.resultMemoryIds,
          scores: payload.scores,
          hitCount: payload.resultMemoryIds.length,
        });
      }
    }
  } catch { /* eval logging must never break search */ }

  return responseToReturn;
}

/* ---------------------------------------------------------------
   11. EXPORTS
--------------------------------------------------------------- */

export {
  handleMemorySearch,
};

export const __testables = {
  filterByMinQualityScore,
  resolveQualityThreshold,
  buildCacheArgs,
  resolveRowContextType,
  resolveArtifactRoutingQuery,
  applyArtifactRouting,
  collapseAndReassembleChunkResults,
  collectEvalChannelsFromRow,
  buildEvalChannelPayloads,
};

// AI-WHY: Backward-compatible aliases (snake_case)
const handle_memory_search = handleMemorySearch;

export {
  handle_memory_search,
};
