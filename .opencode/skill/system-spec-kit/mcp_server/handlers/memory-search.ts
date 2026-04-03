// ───────────────────────────────────────────────────────────────
// MODULE: Memory Search
// ───────────────────────────────────────────────────────────────
/* ───────────────────────────────────────────────────────────────
   1. DEPENDENCIES
──────────────────────────────────────────────────────────────── */

import * as toolCache from '../lib/cache/tool-cache.js';
import * as sessionManager from '../lib/session/session-manager.js';
import * as intentClassifier from '../lib/search/intent-classifier.js';
// TierClassifier, crossEncoder imports removed — only used by legacy V1 pipeline.
import { isSessionBoostEnabled, isCausalBoostEnabled, isCommunitySearchFallbackEnabled, isDualRetrievalEnabled, isIntentAutoProfileEnabled } from '../lib/search/search-flags.js';
import { searchCommunities } from '../lib/search/community-search.js';
// 4-stage pipeline architecture
import { executePipeline } from '../lib/search/pipeline/index.js';
import type { PipelineConfig, PipelineResult } from '../lib/search/pipeline/index.js';
import type { IntentWeightsConfig } from '../lib/search/pipeline/types.js';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
// Artifact-class routing (spec/plan/tasks/checklist/memory)
import { getStrategyForQuery } from '../lib/search/artifact-routing.js';
// Chunk reassembly (extracted from this file)
import { collapseAndReassembleChunkResults } from '../lib/search/chunk-reassembly.js';
// Search utilities (extracted from this file)
import {
  filterByMinQualityScore,
  resolveQualityThreshold,
  buildCacheArgs,
  resolveRowContextType,
  resolveArtifactRoutingQuery,
  applyArtifactRouting,
} from '../lib/search/search-utils.js';
// CacheArgsInput used internally by buildCacheArgs (lib/search/search-utils.ts)
// Eval channel tracking (extracted from this file)
import {
  collectEvalChannelsFromRow,
  buildEvalChannelPayloads,
  summarizeGraphWalkDiagnostics,
} from '../lib/telemetry/eval-channel-tracking.js';
import type { EvalChannelPayload } from '../lib/telemetry/eval-channel-tracking.js';

// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
import {
  logFeedbackEvents,
  isImplicitFeedbackLogEnabled,
} from '../lib/feedback/feedback-ledger.js';
import type { FeedbackEvent } from '../lib/feedback/feedback-ledger.js';
import { trackQueryAndDetect, logResultCited } from '../lib/feedback/query-flow-tracker.js';

// Core utilities
import { checkDatabaseUpdated, isEmbeddingModelReady, waitForEmbeddingModel } from '../core/index.js';
import { validateQuery, requireDb, toErrorMessage } from '../utils/index.js';

// Response envelope + formatters
import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
import { formatSearchResults } from '../formatters/index.js';

// Shared handler types
import type { MCPResponse, IntentClassification } from './types.js';

// Retrieval trace contracts (C136-08)
import { createTrace } from '@spec-kit/shared/contracts/retrieval-trace';
import { buildAdaptiveShadowProposal } from '../lib/cognitive/adaptive-ranking.js';
import { normalizeScopeContext } from '../lib/governance/scope-governance.js';
import {
  attachSessionTransitionTrace,
  type SessionTransitionTrace,
} from '../lib/search/session-transition.js';

// REQ-D5-003: Mode-Aware Response Shape
import {
  applyProfileToEnvelope,
  isResponseProfileEnabled,
} from '../lib/response/profile-formatters.js';
import {
  buildProgressiveResponse,
  extractSnippets,
  isProgressiveDisclosureEnabled,
  resolveCursor,
} from '../lib/search/progressive-disclosure.js';
import {
  deduplicateResults as deduplicateWithSessionState,
  isSessionRetrievalStateEnabled,
  manager as retrievalSessionStateManager,
  refineForGoal,
} from '../lib/search/session-state.js';

// Type imports for casting
import type { IntentType, IntentWeights as IntentClassifierWeights } from '../lib/search/intent-classifier.js';
import type { RawSearchResult } from '../formatters/index.js';
// RoutingResult, WeightedResult — now used internally by lib/search/search-utils.ts

// Feature catalog: Semantic and lexical search (memory_search)
// Feature catalog: Hybrid search pipeline
// Feature catalog: 4-stage pipeline architecture
// Feature catalog: Quality-aware 3-tier search fallback


/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

/**
 * Internal search result row — enriched DB row used within this handler.
 * NOT the same as the canonical SearchResult in shared/types.ts.
 * Self-contained: uses local types instead of the deprecated MemoryRow/MemoryRecord shapes.
 * This can migrate to MemoryDbRow & Record<string, unknown> later without changing the handler contract.
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

interface SearchCachePayload {
  summary: string;
  data: Record<string, unknown>;
  hints: string[];
}

type SessionAwareResult = Record<string, unknown> & {
  id: number | string;
  score?: number;
  content?: string;
};

// ChunkReassemblyResult — now imported from lib/search/chunk-reassembly.ts

type IntentWeights = IntentClassifierWeights;

function toIntentWeightsConfig(weights: IntentWeights | null): IntentWeightsConfig | null {
  if (!weights) return null;
  return {
    similarity: weights.similarity,
    importance: weights.importance,
    recency: weights.recency,
  };
}

// EvalChannelPayload — now imported from lib/telemetry/eval-channel-tracking.ts

interface SearchArgs {
  cursor?: string;
  query?: string;
  concepts?: string[];
  specFolder?: string;
  folderBoost?: { folder: string; factor: number };
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
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
  trackAccess?: boolean; // opt-in access tracking (default false)
  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
  enableSessionBoost?: boolean;
  enableCausalBoost?: boolean;
  minQualityScore?: number;
  min_quality_score?: number;
  mode?: string; // "deep" mode enables query expansion for multi-query RAG
  includeTrace?: boolean;
  sessionTransition?: SessionTransitionTrace;
  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
  profile?: string;
  /** Phase B T019: Dual-level retrieval — 'local' (entity), 'global' (community), 'auto' (local + fallback). */
  retrievalLevel?: 'local' | 'global' | 'auto';
}

// resolveRowContextType — now imported from lib/search/search-utils.ts
// resolveEvalScore, collectEvalChannelsFromRow — now imported from lib/telemetry/eval-channel-tracking.ts

function attachTelemetryMeta(
  response: MCPResponse,
  telemetryPayload: Record<string, unknown>,
): MCPResponse {
  const firstEntry = response?.content?.[0];
  if (!firstEntry || typeof firstEntry.text !== 'string') {
    return response;
  }

  try {
    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
    const meta = envelope.meta && typeof envelope.meta === 'object'
      ? envelope.meta as Record<string, unknown>
      : {};
    envelope.meta = {
      ...meta,
      _telemetry: telemetryPayload,
    };

    return {
      ...response,
      content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],
    };
  } catch (error: unknown) {
    const message = toErrorMessage(error);
    console.warn('[memory-search] Failed to attach telemetry payload:', message);
    return response;
  }
}

function extractResponseResults(response: MCPResponse): Array<Record<string, unknown>> {
  const firstEntry = response?.content?.[0];
  if (!firstEntry || typeof firstEntry.text !== 'string') {
    return [];
  }

  try {
    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
    const data = envelope.data && typeof envelope.data === 'object'
      ? envelope.data as Record<string, unknown>
      : null;
    return Array.isArray(data?.results)
      ? data.results as Array<Record<string, unknown>>
      : [];
  } catch {
    return [];
  }
}

function extractSearchCachePayload(response: MCPResponse): SearchCachePayload | null {
  const firstEntry = response?.content?.[0];
  if (!firstEntry || typeof firstEntry.text !== 'string') {
    return null;
  }

  try {
    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
    const summary = typeof envelope.summary === 'string' ? envelope.summary : null;
    const data = envelope.data && typeof envelope.data === 'object'
      ? envelope.data as Record<string, unknown>
      : null;
    const hints = Array.isArray(envelope.hints)
      ? envelope.hints.filter((hint): hint is string => typeof hint === 'string')
      : [];

    if (!summary || !data) {
      return null;
    }

    return { summary, data, hints };
  } catch {
    return null;
  }
}

function parseResponseEnvelope(
  response: MCPResponse,
): { firstEntry: { type: 'text'; text: string }; envelope: Record<string, unknown> } | null {
  const firstEntry = response?.content?.[0];
  if (!firstEntry || firstEntry.type !== 'text' || typeof firstEntry.text !== 'string') {
    return null;
  }

  try {
    return {
      firstEntry,
      envelope: JSON.parse(firstEntry.text) as Record<string, unknown>,
    };
  } catch {
    return null;
  }
}

function replaceResponseEnvelope(
  response: MCPResponse,
  firstEntry: { type: 'text'; text: string },
  envelope: Record<string, unknown>,
): MCPResponse {
  return {
    ...response,
    content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],
  };
}

function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
  const session = retrievalSessionStateManager.getOrCreate(sessionId);
  return {
    activeGoal: session.activeGoal,
    seenResultIds: Array.from(session.seenResultIds),
    openQuestions: [...session.openQuestions],
    preferredAnchors: [...session.preferredAnchors],
  };
}

function buildSearchResponseFromPayload(
  payload: SearchCachePayload,
  startTime: number,
  cacheHit: boolean,
): MCPResponse {
  return createMCPSuccessResponse({
    tool: 'memory_search',
    summary: payload.summary,
    data: payload.data,
    hints: payload.hints,
    startTime,
    cacheHit,
  });
}

// summarizeGraphWalkDiagnostics, buildEvalChannelPayloads — now imported from lib/telemetry/eval-channel-tracking.ts

// filterByMinQualityScore, resolveQualityThreshold, buildCacheArgs,
// resolveArtifactRoutingQuery, applyArtifactRouting — now imported from lib/search/search-utils.ts
// CacheArgsInput — now imported from lib/search/search-utils.ts
// parseNullableInt, collapseAndReassembleChunkResults — now imported from lib/search/chunk-reassembly.ts

/* ───────────────────────────────────────────────────────────────
   3. CONFIGURATION
──────────────────────────────────────────────────────────────── */

// Sections 3–5 (STATE_PRIORITY, MAX_DEEP_QUERY_VARIANTS, buildDeepQueryVariants,
// StrengthenOnAccess, applyTestingEffect, filterByMemoryState) removed in
// These were only used by the legacy V1 pipeline.
// The V2 4-stage pipeline handles state filtering (Stage 4), testing effect, and
// Query expansion through its own stages.

/* ───────────────────────────────────────────────────────────────
   6. SESSION DEDUPLICATION UTILITIES
──────────────────────────────────────────────────────────────── */

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

// Sections 7–9 (applyCrossEncoderReranking, applyIntentWeightsToResults,
// ShouldApplyPostSearchIntentWeighting, postSearchPipeline) removed in
// These were only used by the legacy V1 pipeline
// Path. The V2 4-stage pipeline handles all equivalent functionality.

/* ───────────────────────────────────────────────────────────────
   10. MAIN HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
 * @param args - Search arguments (query, concepts, mode, specFolder, etc.)
 * @returns MCP response with ranked search results
 */
async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
  const _searchStartTime = Date.now();
  // BUG-001: Check for external database updates before processing
  await checkDatabaseUpdated();

  const {
    cursor,
    query,
    concepts,
    specFolder,
    folderBoost,
    tenantId,
    userId,
    agentId,
    sharedSpaceId,
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
    minState,  // No default — memoryState column not yet in schema; defaulting to 'WARM' filters all rows
    applyStateLimits: applyStateLimits = false,
    rerank = true, // Enable reranking by default for better result quality
    applyLengthPenalty: applyLengthPenalty = true,
    trackAccess: trackAccess = false, // opt-in, off by default
    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(),
    enableCausalBoost: enableCausalBoost = isCausalBoostEnabled(),
    minQualityScore,
    min_quality_score,
    mode,
    includeTrace: includeTraceArg = false,
    sessionTransition,
    profile,
    retrievalLevel: retrievalLevel = 'auto',
  } = args;
  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
  const includeTrace = includeTraceByFlag || includeTraceArg === true;
  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
  const progressiveScopeKey = JSON.stringify({
    tenantId: normalizedScope.tenantId ?? null,
    userId: normalizedScope.userId ?? null,
    agentId: normalizedScope.agentId ?? null,
    sessionId: normalizedScope.sessionId ?? null,
    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
  });

  // Validate at least one search input is provided (moved from schema superRefine for GPT compatibility)
  const hasCursor = typeof cursor === 'string' && cursor.trim().length > 0;
  const hasQuery = typeof query === 'string' && query.trim().length > 0;
  const hasConcepts = Array.isArray(concepts) && concepts.length >= 2;
  if (!hasCursor && !hasQuery && !hasConcepts) {
    return { content: [{ type: 'text', text: JSON.stringify({ error: 'Either "query" (string), "concepts" (array with 2-5 items), or "cursor" (string) is required.' }) }] };
  }

  if (hasCursor) {
    const resolved = resolveCursor(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
    if (!resolved) {
      return createMCPErrorResponse({
        tool: 'memory_search',
        error: 'Cursor is invalid, expired, or out of scope',
        code: 'E_VALIDATION',
        details: { parameter: 'cursor' },
        recovery: {
          hint: 'Retry the original search to generate a fresh continuation cursor',
        },
      });
    }

    const snippetResults = extractSnippets(resolved.results);
    return createMCPSuccessResponse({
      tool: 'memory_search',
      summary: `Returned ${snippetResults.length} continuation results`,
      data: {
        count: snippetResults.length,
        results: snippetResults,
        continuation: resolved.continuation,
      },
      startTime: _searchStartTime,
      cacheHit: false,
    });
  }

  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);

  // Validate numeric limit parameter
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
  const effectiveQuery = normalizedQuery ?? (hasValidConcepts ? concepts.join(', ') : '');

  if (!hasValidQuery && !hasValidConcepts) {
    return createMCPErrorResponse({
      tool: 'memory_search',
      error: 'Either query (string), concepts (array of 2-5 strings), or cursor (string) is required',
      code: 'E_VALIDATION',
      details: { parameter: 'query' },
      recovery: {
        hint: 'Provide a query string, concepts array with 2-5 entries, or a continuation cursor'
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

  // Eval logger — capture query at pipeline entry (fail-safe)
  let _evalQueryId = 0;
  let _evalRunId = 0;
  try {
    const evalEntry = logSearchQuery({
      query: effectiveQuery,
      intent: explicitIntent ?? null,
      specFolder: specFolder ?? null,
    });
    _evalQueryId = evalEntry.queryId;
    _evalRunId = evalEntry.evalRunId;
  } catch (_error: unknown) { /* eval logging must never break search */ }

  const artifactRoutingQuery = resolveArtifactRoutingQuery(
    normalizedQuery,
    hasValidConcepts ? concepts : undefined
  );
  let artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder);

  // Intent-aware retrieval
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

  // FIX RC3-B: Intent confidence floor — override low-confidence auto-detections to "understand"
  const INTENT_CONFIDENCE_FLOOR = parseFloat(process.env.SPECKIT_INTENT_CONFIDENCE_FLOOR || '0.25');
  if (detectedIntent && intentConfidence < INTENT_CONFIDENCE_FLOOR && !explicitIntent) {
    console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
    detectedIntent = 'understand';
    intentConfidence = 1.0;
    intentWeights = intentClassifier.getIntentWeights('understand' as IntentType);
  }

  // Phase C: Intent-to-profile auto-routing.
  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
  let effectiveProfile: string | undefined = profile;
  if (!effectiveProfile && detectedIntent && isIntentAutoProfileEnabled()) {
    try {
      const autoProfile = intentClassifier.getProfileForIntent(detectedIntent as IntentType);
      if (autoProfile) {
        effectiveProfile = autoProfile;
        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
      }
    } catch (_autoProfileErr: unknown) {
      // Auto-profile is best-effort — never breaks search
    }
  }

  // Re-run artifact routing with detected intent for fallback coverage
  if (detectedIntent && artifactRouting?.detectedClass === 'unknown' && artifactRouting?.confidence === 0) {
    artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder, detectedIntent);
  }

  // Create retrieval trace at pipeline entry
  const trace = createTrace(
    effectiveQuery,
    sessionId,
    detectedIntent || undefined
  );

  // Build cache key args
  const cacheArgs = buildCacheArgs({
    normalizedQuery,
    hasValidConcepts,
    concepts,
    specFolder,
    tenantId: normalizedScope.tenantId,
    userId: normalizedScope.userId,
    agentId: normalizedScope.agentId,
    sharedSpaceId: normalizedScope.sharedSpaceId,
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
    minState: minState ?? '',
    rerank,
    applyLengthPenalty,
    sessionId,
    enableSessionBoost,
    enableCausalBoost,
    includeTrace,
  });

  let _evalChannelPayloads: EvalChannelPayload[] = [];
  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
  const cacheEnabled = toolCache.isEnabled() && !bypassCache;
  const cachedPayload = cacheEnabled
    ? toolCache.get<SearchCachePayload>(cacheKey)
    : null;

  let responseToReturn: MCPResponse;
  let goalRefinementPayload: Record<string, unknown> | null = null;

  if (cachedPayload) {
    responseToReturn = buildSearchResponseFromPayload(cachedPayload, _searchStartTime, true);
  } else {
    // Wait for embedding model only on cache miss
    if (!isEmbeddingModelReady()) {
      const modelReady = await waitForEmbeddingModel(30000);
      if (!modelReady) {
        throw new Error('Embedding model not ready after 30s timeout. Try again later.');
      }
    }

    // V2 pipeline is the only path (legacy V1 removed from the runtime pipeline)
    const pipelineConfig: PipelineConfig = {
      query: effectiveQuery,
      concepts: hasValidConcepts ? concepts : undefined,
      searchType: (hasValidConcepts && concepts!.length >= 2)
        ? 'multi-concept'
        : 'hybrid',
      mode,
      limit,
      specFolder,
      tenantId: normalizedScope.tenantId,
      userId: normalizedScope.userId,
      agentId: normalizedScope.agentId,
      sharedSpaceId: normalizedScope.sharedSpaceId,
      tier,
      contextType,
      includeArchived,
      includeConstitutional,
      includeContent,
      anchors,
      qualityThreshold,
      minState: minState ?? '',
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
      intentWeights: toIntentWeightsConfig(intentWeights),
      artifactRouting: artifactRouting as unknown as PipelineConfig['artifactRouting'],
      trace,
    };

    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
    let resultsForFormatting = pipelineResult.results as unknown as SessionAwareResult[];

    // Phase B T018/T019: Community search fallback — inject community members on weak results
    let communityFallbackApplied = false;
    const shouldRunCommunitySearch = (
      isDualRetrievalEnabled() &&
      isCommunitySearchFallbackEnabled() &&
      effectiveQuery.length > 0 &&
      (retrievalLevel === 'global' || retrievalLevel === 'auto')
    );
    if (shouldRunCommunitySearch) {
      const isWeakResult = resultsForFormatting.length === 0 ||
        (retrievalLevel === 'global') ||
        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
      if (isWeakResult) {
        try {
          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
          if (communityResults.totalMemberIds.length > 0) {
            // Fetch the actual memory rows for community member IDs
            const memberIds = communityResults.totalMemberIds.slice(0, 20);
            const placeholders = memberIds.map(() => '?').join(', ');
            const db = requireDb();
            const memberRows = db.prepare(`
              SELECT id, title, similarity, content, file_path, importance_tier, context_type,
                     quality_score, created_at
              FROM memory_index
              WHERE id IN (${placeholders})
            `).all(...memberIds) as Array<Record<string, unknown> & { id: number }>;

            if (memberRows.length > 0) {
              // Mark community-sourced results and assign a base score
              const communityRows = memberRows.map((row) => ({
                ...row,
                similarity: typeof row.similarity === 'number' ? row.similarity : 0.5,
                score: 0.45,
                _communityFallback: true,
              }));
              // Merge: append community results not already in pipeline results
              const existingIds = new Set(resultsForFormatting.map((r) => (r as Record<string, unknown>).id as number));
              const newRows = communityRows.filter((r) => !existingIds.has(r.id));
              if (newRows.length > 0) {
                resultsForFormatting = [...resultsForFormatting, ...newRows as unknown as SessionAwareResult[]];
                communityFallbackApplied = true;
              }
            }
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          console.warn(`[memory-search] Community search fallback failed (fail-open): ${msg}`);
        }
      }
    }

    // Fix 4 (RC1-B): Apply folder boost — multiply similarity for results matching discovered folder
    if (folderBoost && folderBoost.folder && folderBoost.factor > 1) {
      let boostedCount = 0;
      for (const r of resultsForFormatting) {
        const filePath = (r as Record<string, unknown>).file_path as string | undefined;
        if (filePath && filePath.includes(folderBoost.folder)) {
          const raw = (r as Record<string, unknown>);
          if (typeof raw.similarity === 'number') {
            raw.similarity = Math.min(raw.similarity * folderBoost.factor, 1.0);
            boostedCount++;
          }
        }
      }
      // Re-sort by similarity after boosting
      if (boostedCount > 0) {
        resultsForFormatting.sort((a, b) => {
          const sa = (a as Record<string, unknown>).similarity as number ?? 0;
          const sb = (b as Record<string, unknown>).similarity as number ?? 0;
          return sb - sa;
        });
      }
    }

    if (sessionId && isSessionRetrievalStateEnabled()) {
      const activeGoal = effectiveQuery.trim().length > 0 ? effectiveQuery : null;
      if (activeGoal) {
        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
      }
      if (Array.isArray(anchors) && anchors.length > 0) {
        retrievalSessionStateManager.setAnchors(sessionId, anchors);
      }

      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
      resultsForFormatting = goalRefinement.results as SessionAwareResult[];
      goalRefinementPayload = {
        activeGoal: goalRefinement.metadata.activeGoal,
        applied: goalRefinement.metadata.refined,
        boostedCount: goalRefinement.metadata.boostedCount,
      };
    }

    // Build extra data from pipeline metadata for response formatting
    const extraData: Record<string, unknown> = {
      stateStats: pipelineResult.annotations.stateStats,
      featureFlags: {
        ...pipelineResult.annotations.featureFlags,
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

    if (pipelineResult.metadata.stage2.feedbackSignalsApplied === 'applied') {
      extraData.feedbackSignals = { applied: true };
      extraData.feedback_signals = { applied: true };
    }

    if (pipelineResult.metadata.stage2.graphContribution) {
      extraData.graphContribution = pipelineResult.metadata.stage2.graphContribution;
      extraData.graph_contribution = pipelineResult.metadata.stage2.graphContribution;
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
    try {
      const adaptiveShadow = buildAdaptiveShadowProposal(
        requireDb(),
        effectiveQuery,
        resultsForFormatting as Array<Record<string, unknown> & { id: number }>,
      );
      if (adaptiveShadow) {
        extraData.adaptiveShadow = adaptiveShadow;
        extraData.adaptive_shadow = adaptiveShadow;
      }
    } catch (_error: unknown) {
      // Adaptive proposal logging is best-effort only
    }

    _evalChannelPayloads = buildEvalChannelPayloads(resultsForFormatting);

    const appliedBoosts: Record<string, unknown> = {
      session: { applied: pipelineResult.metadata.stage2.sessionBoostApplied },
      causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
    };
    if (folderBoost && folderBoost.folder) {
      appliedBoosts.folder = { applied: true, folder: folderBoost.folder, factor: folderBoost.factor };
    }
    if (communityFallbackApplied) {
      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
    }
    extraData.appliedBoosts = appliedBoosts;
    extraData.applied_boosts = appliedBoosts;

    let formatted = await formatSearchResults(
      resultsForFormatting as RawSearchResult[],
      pipelineConfig.searchType,
      includeContent,
      anchors,
      null,
      null,
      extraData,
      includeTrace,
      normalizedQuery,   // REQ-D5-001/D5-004: pass query for recovery + confidence context
      specFolder ?? null // REQ-D5-001: pass specFolder for recovery narrowing detection
    );

    // Prepend evidence gap warning if present
    if (pipelineResult.annotations.evidenceGapWarning && formatted?.content?.[0]?.text) {
      try {
        const parsed = JSON.parse(formatted.content[0].text) as Record<string, unknown>;
        if (typeof parsed.summary === 'string') {
          parsed.summary = `${pipelineResult.annotations.evidenceGapWarning}\n\n${parsed.summary}`;
          formatted.content[0].text = JSON.stringify(parsed, null, 2);
        }
      } catch (_error: unknown) {
        // Non-fatal
      }
    }

    if (isProgressiveDisclosureEnabled()) {
      const parsedFormatted = parseResponseEnvelope(formatted);
      if (parsedFormatted) {
        const data = parsedFormatted.envelope.data && typeof parsedFormatted.envelope.data === 'object'
          ? parsedFormatted.envelope.data as Record<string, unknown>
          : {};
        data.progressiveDisclosure = buildProgressiveResponse(
          resultsForFormatting,
          undefined,
          effectiveQuery,
          { scopeKey: progressiveScopeKey },
        );
        parsedFormatted.envelope.data = data;
        formatted = replaceResponseEnvelope(formatted, parsedFormatted.firstEntry, parsedFormatted.envelope);
      }
    }

    const cachePayload = extractSearchCachePayload(formatted);
    if (cachePayload && cacheEnabled) {
      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
    }

    responseToReturn = cachePayload
      ? buildSearchResponseFromPayload(cachePayload, _searchStartTime, false)
      : formatted;
  }

  if (sessionId && isSessionRetrievalStateEnabled() && !sessionManager.isEnabled()) {
    const parsedResponse = parseResponseEnvelope(responseToReturn);
    const data = parsedResponse?.envelope.data && typeof parsedResponse.envelope.data === 'object'
      ? parsedResponse.envelope.data as Record<string, unknown>
      : null;
      const existingResults = Array.isArray(data?.results) ? data.results as SessionAwareResult[] : null;

    if (parsedResponse && data && existingResults && existingResults.length > 0) {
      const deduped = deduplicateWithSessionState(existingResults, sessionId);
      data.results = deduped.results as SessionAwareResult[];
      data.count = deduped.results.length;
      data.sessionDedup = deduped.metadata;
      parsedResponse.envelope.data = data;
      responseToReturn = replaceResponseEnvelope(responseToReturn, parsedResponse.firstEntry, parsedResponse.envelope);
    }
  }

  // Apply session deduplication AFTER cache
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

    // P1-018 — Validate response shape before dedup. If the cached response
    // Doesn't have the expected data.results array, log a warning and skip dedup
    // Rather than silently falling through to the un-deduped response.
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

  if (sessionId && isSessionRetrievalStateEnabled()) {
    const parsedResponse = parseResponseEnvelope(responseToReturn);
    const data = parsedResponse?.envelope.data && typeof parsedResponse.envelope.data === 'object'
      ? parsedResponse.envelope.data as Record<string, unknown>
      : null;
    const existingResults = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];

    if (parsedResponse && data) {
      const returnedIds = existingResults
        .map((result) => result.id ?? result.resultId)
        .filter((id): id is string | number => typeof id === 'string' || typeof id === 'number');

      if (returnedIds.length > 0) {
        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
      }

      data.sessionState = buildSessionStatePayload(sessionId);
      if (goalRefinementPayload) {
        data.goalRefinement = goalRefinementPayload;
      }

      parsedResponse.envelope.data = data;
      responseToReturn = replaceResponseEnvelope(responseToReturn, parsedResponse.firstEntry, parsedResponse.envelope);
    }
  }

  if (includeTrace && sessionTransition) {
    responseToReturn = attachSessionTransitionTrace(responseToReturn, sessionTransition);
  }

  if (retrievalTelemetry.isExtendedTelemetryEnabled()) {
    const telemetry = retrievalTelemetry.createTelemetry();
    retrievalTelemetry.recordTransitionDiagnostics(telemetry, sessionTransition);
    retrievalTelemetry.recordGraphWalkDiagnostics(
      telemetry,
      summarizeGraphWalkDiagnostics(extractResponseResults(responseToReturn)),
    );
    responseToReturn = attachTelemetryMeta(responseToReturn, retrievalTelemetry.toJSON(telemetry));
  }

  // Consumption instrumentation — log search event (fail-safe, never throws)
  try {
    const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
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
      } catch (_error: unknown) { /* ignore parse errors */ }
      logConsumptionEvent(db, {
        event_type: 'search',
        query_text: effectiveQuery || null,
        intent: detectedIntent,
        result_count: resultCount,
        result_ids: resultIds,
        session_id: sessionId ?? null,
        latency_ms: Date.now() - _searchStartTime,
        spec_folder_filter: specFolder ?? null,
      });
    }
  } catch (_error: unknown) { /* instrumentation must never cause search to fail */ }

  // Eval logger — capture final results at pipeline exit (fail-safe)
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
      } catch (_error: unknown) { /* ignore parse errors */ }
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
  } catch (_error: unknown) { /* eval logging must never break search */ }

  // REQ-D4-001: Implicit feedback — log search_shown events for returned results
  // Shadow-only: no ranking side effects. Fail-safe, never throws.
  try {
    if (isImplicitFeedbackLogEnabled()) {
      const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
      if (db) {
        let shownMemoryIds: number[] = [];
        try {
          if (responseToReturn?.content?.[0]?.text) {
            const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
            const data = parsed?.data as Record<string, unknown> | undefined;
            const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
            shownMemoryIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
          }
        } catch (_error: unknown) { /* ignore parse errors */ }

        if (shownMemoryIds.length > 0) {
          const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
          const feedbackEvents: FeedbackEvent[] = shownMemoryIds.map(memId => ({
            type: 'search_shown',
            memoryId: String(memId),
            queryId,
            confidence: 'weak',
            timestamp: _searchStartTime,
            sessionId: sessionId ?? null,
          }));
          logFeedbackEvents(db, feedbackEvents);
        }
      }
    }
  } catch (_error: unknown) { /* feedback logging must never break search */ }

  // REQ-014: Query flow tracking + result_cited for includeContent searches
  // Shadow-only: emits query_reformulated, same_topic_requery, and result_cited events.
  try {
    if (isImplicitFeedbackLogEnabled()) {
      const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
      if (db) {
        // Extract shown memory IDs from response (reuse parsed data if available)
        let shownIds: string[] = [];
        try {
          if (responseToReturn?.content?.[0]?.text) {
            const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
            const data = parsed?.data as Record<string, unknown> | undefined;
            const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
            shownIds = results.flatMap((result) => {
              const candidate = result.id;
              if (typeof candidate !== 'number' && typeof candidate !== 'string') {
                return [];
              }
              const normalizedId = String(candidate).trim();
              if (!normalizedId || normalizedId === 'undefined' || normalizedId === 'null') {
                return [];
              }
              return [normalizedId];
            });
          }
        } catch (_error: unknown) { /* ignore parse errors */ }

        const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);

        // Track query flow — detects reformulations and same-topic re-queries
        if (normalizedQuery) {
          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
        }

        // Log result_cited for includeContent searches (content was embedded = cited)
        if (includeContent && shownIds.length > 0) {
          logResultCited(db, sessionId ?? null, queryId, shownIds);
        }
      }
    }
  } catch (_error: unknown) { /* query flow tracking must never break search */ }

  // REQ-D5-003: Apply presentation profile when flag is enabled and profile is specified.
  // Phase C: effectiveProfile includes auto-routed profile from intent detection.
  if (effectiveProfile && typeof effectiveProfile === 'string' && isResponseProfileEnabled()) {
    const firstEntry = responseToReturn?.content?.[0];
    if (firstEntry && typeof firstEntry.text === 'string') {
      try {
        const profiled = applyProfileToEnvelope(effectiveProfile, firstEntry.text);
        if (profiled !== firstEntry.text) {
          responseToReturn = {
            ...responseToReturn,
            content: [{ ...firstEntry, text: profiled }],
          } as MCPResponse;
        }
      } catch (_profileError: unknown) {
        // Profile formatting is best-effort — never breaks search
      }
    }
  }

  return responseToReturn;
}

/* ───────────────────────────────────────────────────────────────
   11. EXPORTS
──────────────────────────────────────────────────────────────── */

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

// Backward-compatible aliases (snake_case)
const handle_memory_search = handleMemorySearch;

export {
  handle_memory_search,
};
