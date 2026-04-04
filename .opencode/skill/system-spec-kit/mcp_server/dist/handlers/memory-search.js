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
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
// Artifact-class routing (spec/plan/tasks/checklist/memory)
import { getStrategyForQuery } from '../lib/search/artifact-routing.js';
// Chunk reassembly (extracted from this file)
import { collapseAndReassembleChunkResults } from '../lib/search/chunk-reassembly.js';
// Search utilities (extracted from this file)
import { filterByMinQualityScore, resolveQualityThreshold, buildCacheArgs, resolveRowContextType, resolveArtifactRoutingQuery, applyArtifactRouting, } from '../lib/search/search-utils.js';
// CacheArgsInput used internally by buildCacheArgs (lib/search/search-utils.ts)
// Eval channel tracking (extracted from this file)
import { collectEvalChannelsFromRow, buildEvalChannelPayloads, summarizeGraphWalkDiagnostics, } from '../lib/telemetry/eval-channel-tracking.js';
// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
import { logFeedbackEvents, isImplicitFeedbackLogEnabled, } from '../lib/feedback/feedback-ledger.js';
import { trackQueryAndDetect, logResultCited } from '../lib/feedback/query-flow-tracker.js';
// Core utilities
import { checkDatabaseUpdated, isEmbeddingModelReady, waitForEmbeddingModel } from '../core/index.js';
import { validateQuery, requireDb, toErrorMessage } from '../utils/index.js';
// Response envelope + formatters
import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
import { formatSearchResults } from '../formatters/index.js';
// Retrieval trace contracts (C136-08)
import { createTrace } from '@spec-kit/shared/contracts/retrieval-trace';
import { buildAdaptiveShadowProposal } from '../lib/cognitive/adaptive-ranking.js';
import { normalizeScopeContext } from '../lib/governance/scope-governance.js';
import { attachSessionTransitionTrace, } from '../lib/search/session-transition.js';
// REQ-D5-003: Mode-Aware Response Shape
import { applyProfileToEnvelope, isResponseProfileEnabled, } from '../lib/response/profile-formatters.js';
import { buildProgressiveResponse, extractSnippets, isProgressiveDisclosureEnabled, resolveCursor, } from '../lib/search/progressive-disclosure.js';
import { deduplicateResults as deduplicateWithSessionState, isSessionRetrievalStateEnabled, manager as retrievalSessionStateManager, refineForGoal, } from '../lib/search/session-state.js';
function toIntentWeightsConfig(weights) {
    if (!weights)
        return null;
    return {
        similarity: weights.similarity,
        importance: weights.importance,
        recency: weights.recency,
    };
}
// resolveRowContextType — now imported from lib/search/search-utils.ts
// resolveEvalScore, collectEvalChannelsFromRow — now imported from lib/telemetry/eval-channel-tracking.ts
function attachTelemetryMeta(response, telemetryPayload) {
    const firstEntry = response?.content?.[0];
    if (!firstEntry || typeof firstEntry.text !== 'string') {
        return response;
    }
    try {
        const envelope = JSON.parse(firstEntry.text);
        const meta = envelope.meta && typeof envelope.meta === 'object'
            ? envelope.meta
            : {};
        envelope.meta = {
            ...meta,
            _telemetry: telemetryPayload,
        };
        return {
            ...response,
            content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],
        };
    }
    catch (error) {
        const message = toErrorMessage(error);
        console.warn('[memory-search] Failed to attach telemetry payload:', message);
        return response;
    }
}
function extractResponseResults(response) {
    const firstEntry = response?.content?.[0];
    if (!firstEntry || typeof firstEntry.text !== 'string') {
        return [];
    }
    try {
        const envelope = JSON.parse(firstEntry.text);
        const data = envelope.data && typeof envelope.data === 'object'
            ? envelope.data
            : null;
        return Array.isArray(data?.results)
            ? data.results
            : [];
    }
    catch {
        return [];
    }
}
function extractSearchCachePayload(response) {
    const firstEntry = response?.content?.[0];
    if (!firstEntry || typeof firstEntry.text !== 'string') {
        return null;
    }
    try {
        const envelope = JSON.parse(firstEntry.text);
        const summary = typeof envelope.summary === 'string' ? envelope.summary : null;
        const data = envelope.data && typeof envelope.data === 'object'
            ? envelope.data
            : null;
        const hints = Array.isArray(envelope.hints)
            ? envelope.hints.filter((hint) => typeof hint === 'string')
            : [];
        if (!summary || !data) {
            return null;
        }
        return { summary, data, hints };
    }
    catch {
        return null;
    }
}
function parseResponseEnvelope(response) {
    const firstEntry = response?.content?.[0];
    if (!firstEntry || firstEntry.type !== 'text' || typeof firstEntry.text !== 'string') {
        return null;
    }
    try {
        return {
            firstEntry,
            envelope: JSON.parse(firstEntry.text),
        };
    }
    catch {
        return null;
    }
}
function replaceResponseEnvelope(response, firstEntry, envelope) {
    return {
        ...response,
        content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],
    };
}
function buildSessionStatePayload(sessionId) {
    const session = retrievalSessionStateManager.getOrCreate(sessionId);
    return {
        activeGoal: session.activeGoal,
        seenResultIds: Array.from(session.seenResultIds),
        openQuestions: [...session.openQuestions],
        preferredAnchors: [...session.preferredAnchors],
    };
}
function buildSearchResponseFromPayload(payload, startTime, cacheHit) {
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
function applySessionDedup(results, sessionId, enableDedup) {
    if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
        return {
            results,
            dedupStats: { enabled: false, sessionId: null }
        };
    }
    const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results);
    if (filtered.length > 0) {
        sessionManager.markResultsSent(sessionId, filtered);
    }
    return {
        results: filtered,
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
async function handleMemorySearch(args) {
    const _searchStartTime = Date.now();
    // BUG-001: Check for external database updates before processing
    await checkDatabaseUpdated();
    const { cursor, query, concepts, specFolder, folderBoost, tenantId, userId, agentId, sharedSpaceId, limit: rawLimit = 10, tier, contextType, useDecay: useDecay = true, includeContiguity: includeContiguity = false, includeConstitutional: includeConstitutional = true, includeContent: includeContent = false, anchors, bypassCache: bypassCache = false, sessionId, enableDedup: enableDedup = true, intent: explicitIntent, autoDetectIntent: autoDetectIntent = true, minState, // No default — memoryState column not yet in schema; defaulting to 'WARM' filters all rows
    applyStateLimits: applyStateLimits = false, rerank = true, // Enable reranking by default for better result quality
    applyLengthPenalty: applyLengthPenalty = true, trackAccess: trackAccess = false, // opt-in, off by default
    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(), enableCausalBoost: enableCausalBoost = isCausalBoostEnabled(), minQualityScore, min_quality_score, mode, includeTrace: includeTraceArg = false, sessionTransition, profile, retrievalLevel: retrievalLevel = 'auto', } = args;
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
    let normalizedQuery = null;
    if (query !== undefined) {
        try {
            normalizedQuery = validateQuery(query);
        }
        catch (validationError) {
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
    }
    catch (_error) { /* eval logging must never break search */ }
    const artifactRoutingQuery = resolveArtifactRoutingQuery(normalizedQuery, hasValidConcepts ? concepts : undefined);
    let artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder);
    // Intent-aware retrieval
    let detectedIntent = null;
    let intentConfidence = 0;
    let intentWeights = null;
    if (explicitIntent) {
        if (intentClassifier.isValidIntent(explicitIntent)) {
            detectedIntent = explicitIntent;
            intentConfidence = 1.0;
            intentWeights = intentClassifier.getIntentWeights(explicitIntent);
        }
        else {
            console.warn(`[memory-search] Invalid intent '${explicitIntent}', using auto-detection`);
        }
    }
    if (!detectedIntent && autoDetectIntent && hasValidQuery) {
        const classification = intentClassifier.classifyIntent(normalizedQuery);
        detectedIntent = classification.intent;
        intentConfidence = classification.confidence;
        intentWeights = intentClassifier.getIntentWeights(classification.intent);
        if (classification.fallback) {
            console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
        }
        else {
            console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
        }
    }
    // FIX RC3-B: Intent confidence floor — override low-confidence auto-detections to "understand"
    const INTENT_CONFIDENCE_FLOOR = parseFloat(process.env.SPECKIT_INTENT_CONFIDENCE_FLOOR || '0.25');
    if (detectedIntent && intentConfidence < INTENT_CONFIDENCE_FLOOR && !explicitIntent) {
        console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
        detectedIntent = 'understand';
        intentConfidence = 1.0;
        intentWeights = intentClassifier.getIntentWeights('understand');
    }
    // Phase C: Intent-to-profile auto-routing.
    // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
    let effectiveProfile = profile;
    if (!effectiveProfile && detectedIntent && isIntentAutoProfileEnabled()) {
        try {
            const autoProfile = intentClassifier.getProfileForIntent(detectedIntent);
            if (autoProfile) {
                effectiveProfile = autoProfile;
                console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
            }
        }
        catch (_autoProfileErr) {
            // Auto-profile is best-effort — never breaks search
        }
    }
    // Re-run artifact routing with detected intent for fallback coverage
    if (detectedIntent && artifactRouting?.detectedClass === 'unknown' && artifactRouting?.confidence === 0) {
        artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder, detectedIntent);
    }
    // Create retrieval trace at pipeline entry
    const trace = createTrace(effectiveQuery, sessionId, detectedIntent || undefined);
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
    let _evalChannelPayloads = [];
    const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
    const cacheEnabled = toolCache.isEnabled() && !bypassCache;
    const cachedPayload = cacheEnabled
        ? toolCache.get(cacheKey)
        : null;
    let responseToReturn;
    let goalRefinementPayload = null;
    if (cachedPayload) {
        responseToReturn = buildSearchResponseFromPayload(cachedPayload, _searchStartTime, true);
    }
    else {
        // Wait for embedding model only on cache miss
        if (!isEmbeddingModelReady()) {
            const modelReady = await waitForEmbeddingModel(30000);
            if (!modelReady) {
                throw new Error('Embedding model not ready after 30s timeout. Try again later.');
            }
        }
        // V2 pipeline is the only path (legacy V1 removed from the runtime pipeline)
        const pipelineConfig = {
            query: effectiveQuery,
            concepts: hasValidConcepts ? concepts : undefined,
            searchType: (hasValidConcepts && concepts.length >= 2)
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
            artifactRouting: artifactRouting,
            trace,
        };
        const pipelineResult = await executePipeline(pipelineConfig);
        let resultsForFormatting = pipelineResult.results;
        // Phase B T018/T019: Community search fallback — inject community members on weak results
        let communityFallbackApplied = false;
        const shouldRunCommunitySearch = (isDualRetrievalEnabled() &&
            isCommunitySearchFallbackEnabled() &&
            effectiveQuery.length > 0 &&
            (retrievalLevel === 'global' || retrievalLevel === 'auto'));
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
            `).all(...memberIds);
                        if (memberRows.length > 0) {
                            // Mark community-sourced results and assign a base score
                            const communityRows = memberRows.map((row) => ({
                                ...row,
                                similarity: typeof row.similarity === 'number' ? row.similarity : 0.5,
                                score: 0.45,
                                _communityFallback: true,
                            }));
                            // Merge: append community results not already in pipeline results
                            const existingIds = new Set(resultsForFormatting.map((r) => r.id));
                            const newRows = communityRows.filter((r) => !existingIds.has(r.id));
                            if (newRows.length > 0) {
                                resultsForFormatting = [...resultsForFormatting, ...newRows];
                                communityFallbackApplied = true;
                            }
                        }
                    }
                }
                catch (err) {
                    const msg = err instanceof Error ? err.message : String(err);
                    console.warn(`[memory-search] Community search fallback failed (fail-open): ${msg}`);
                }
            }
        }
        // Fix 4 (RC1-B): Apply folder boost — multiply similarity for results matching discovered folder
        if (folderBoost && folderBoost.folder && folderBoost.factor > 1) {
            let boostedCount = 0;
            for (const r of resultsForFormatting) {
                const filePath = r.file_path;
                if (filePath && filePath.includes(folderBoost.folder)) {
                    const raw = r;
                    if (typeof raw.similarity === 'number') {
                        raw.similarity = Math.min(raw.similarity * folderBoost.factor, 1.0);
                        boostedCount++;
                    }
                }
            }
            // Re-sort by similarity after boosting
            if (boostedCount > 0) {
                resultsForFormatting.sort((a, b) => {
                    const sa = a.similarity ?? 0;
                    const sb = b.similarity ?? 0;
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
            resultsForFormatting = goalRefinement.results;
            goalRefinementPayload = {
                activeGoal: goalRefinement.metadata.activeGoal,
                applied: goalRefinement.metadata.refined,
                boostedCount: goalRefinement.metadata.boostedCount,
            };
        }
        // Build extra data from pipeline metadata for response formatting
        const extraData = {
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
                description: intentClassifier.getIntentDescription(detectedIntent),
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
            const adaptiveShadow = buildAdaptiveShadowProposal(requireDb(), effectiveQuery, resultsForFormatting);
            if (adaptiveShadow) {
                extraData.adaptiveShadow = adaptiveShadow;
                extraData.adaptive_shadow = adaptiveShadow;
            }
        }
        catch (_error) {
            // Adaptive proposal logging is best-effort only
        }
        _evalChannelPayloads = buildEvalChannelPayloads(resultsForFormatting);
        const appliedBoosts = {
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
        let formatted = await formatSearchResults(resultsForFormatting, pipelineConfig.searchType, includeContent, anchors, null, null, extraData, includeTrace, normalizedQuery, // REQ-D5-001/D5-004: pass query for recovery + confidence context
        specFolder ?? null // REQ-D5-001: pass specFolder for recovery narrowing detection
        );
        // Prepend evidence gap warning if present
        if (pipelineResult.annotations.evidenceGapWarning && formatted?.content?.[0]?.text) {
            try {
                const parsed = JSON.parse(formatted.content[0].text);
                if (typeof parsed.summary === 'string') {
                    parsed.summary = `${pipelineResult.annotations.evidenceGapWarning}\n\n${parsed.summary}`;
                    formatted.content[0].text = JSON.stringify(parsed, null, 2);
                }
            }
            catch (_error) {
                // Non-fatal
            }
        }
        if (isProgressiveDisclosureEnabled()) {
            const parsedFormatted = parseResponseEnvelope(formatted);
            if (parsedFormatted) {
                const data = parsedFormatted.envelope.data && typeof parsedFormatted.envelope.data === 'object'
                    ? parsedFormatted.envelope.data
                    : {};
                data.progressiveDisclosure = buildProgressiveResponse(resultsForFormatting, undefined, effectiveQuery, { scopeKey: progressiveScopeKey });
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
            ? parsedResponse.envelope.data
            : null;
        const existingResults = Array.isArray(data?.results) ? data.results : null;
        if (parsedResponse && data && existingResults && existingResults.length > 0) {
            const deduped = deduplicateWithSessionState(existingResults, sessionId);
            data.results = deduped.results;
            data.count = deduped.results.length;
            data.sessionDedup = deduped.metadata;
            parsedResponse.envelope.data = data;
            responseToReturn = replaceResponseEnvelope(responseToReturn, parsedResponse.firstEntry, parsedResponse.envelope);
        }
    }
    // Apply session deduplication AFTER cache
    if (sessionId && enableDedup && sessionManager.isEnabled()) {
        let resultsData = null;
        if (responseToReturn?.content?.[0]?.text && typeof responseToReturn.content[0].text === 'string') {
            try {
                resultsData = JSON.parse(responseToReturn.content[0].text);
            }
            catch (err) {
                const message = toErrorMessage(err);
                console.warn('[memory-search] Failed to parse cached response for dedup:', message);
                resultsData = null;
            }
        }
        else if (responseToReturn && typeof responseToReturn === 'object') {
            resultsData = responseToReturn;
        }
        // P1-018 — Validate response shape before dedup. If the cached response
        // Doesn't have the expected data.results array, log a warning and skip dedup
        // Rather than silently falling through to the un-deduped response.
        const data = (resultsData && typeof resultsData.data === 'object' && resultsData.data !== null)
            ? resultsData.data
            : null;
        const existingResults = Array.isArray(data?.results) ? data.results : null;
        if (resultsData && !data) {
            console.warn('[memory-search] Cached response shape mismatch: missing "data" object, skipping dedup');
        }
        else if (data && !existingResults) {
            console.warn('[memory-search] Cached response shape mismatch: "data.results" is not an array, skipping dedup');
        }
        if (resultsData && data && existingResults && existingResults.length > 0) {
            const { results: dedupedResults } = applySessionDedup(existingResults, sessionId, enableDedup);
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
                resultsData.meta.dedupStats = dedupStats;
            }
            if (filteredCount > 0 && typeof resultsData.summary === 'string') {
                resultsData.summary += ` (${filteredCount} duplicates filtered, ~${tokensSaved} tokens saved)`;
            }
            responseToReturn = {
                ...responseToReturn,
                content: [{ type: 'text', text: JSON.stringify(resultsData, null, 2) }]
            };
        }
    }
    if (sessionId && isSessionRetrievalStateEnabled()) {
        const parsedResponse = parseResponseEnvelope(responseToReturn);
        const data = parsedResponse?.envelope.data && typeof parsedResponse.envelope.data === 'object'
            ? parsedResponse.envelope.data
            : null;
        const existingResults = Array.isArray(data?.results) ? data.results : [];
        if (parsedResponse && data) {
            const returnedIds = existingResults
                .map((result) => result.id ?? result.resultId)
                .filter((id) => typeof id === 'string' || typeof id === 'number');
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
        retrievalTelemetry.recordGraphWalkDiagnostics(telemetry, summarizeGraphWalkDiagnostics(extractResponseResults(responseToReturn)));
        responseToReturn = attachTelemetryMeta(responseToReturn, retrievalTelemetry.toJSON(telemetry));
    }
    // Consumption instrumentation — log search event (fail-safe, never throws)
    try {
        const db = (() => { try {
            return requireDb();
        }
        catch (_error) {
            return null;
        } })();
        if (db) {
            initConsumptionLog(db);
            let resultIds = [];
            let resultCount = 0;
            try {
                if (responseToReturn?.content?.[0]?.text) {
                    const parsed = JSON.parse(responseToReturn.content[0].text);
                    const data = parsed?.data;
                    const results = Array.isArray(data?.results) ? data.results : [];
                    resultIds = results.map(r => r.id).filter(id => typeof id === 'number');
                    resultCount = Array.isArray(data?.results) ? data.results.length : 0;
                }
            }
            catch (_error) { /* ignore parse errors */ }
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
    }
    catch (_error) { /* instrumentation must never cause search to fail */ }
    // Eval logger — capture final results at pipeline exit (fail-safe)
    try {
        if (_evalRunId && _evalQueryId) {
            let finalMemoryIds = [];
            let finalScores = [];
            try {
                if (responseToReturn?.content?.[0]?.text) {
                    const parsed = JSON.parse(responseToReturn.content[0].text);
                    const data = parsed?.data;
                    const results = Array.isArray(data?.results) ? data.results : [];
                    finalMemoryIds = results.map(r => r.id).filter(id => typeof id === 'number');
                    finalScores = results.map(r => (r.score ?? r.similarity ?? 0));
                }
            }
            catch (_error) { /* ignore parse errors */ }
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
    }
    catch (_error) { /* eval logging must never break search */ }
    // REQ-D4-001: Implicit feedback — log search_shown events for returned results
    // Shadow-only: no ranking side effects. Fail-safe, never throws.
    try {
        if (isImplicitFeedbackLogEnabled()) {
            const db = (() => { try {
                return requireDb();
            }
            catch (_error) {
                return null;
            } })();
            if (db) {
                let shownMemoryIds = [];
                try {
                    if (responseToReturn?.content?.[0]?.text) {
                        const parsed = JSON.parse(responseToReturn.content[0].text);
                        const data = parsed?.data;
                        const results = Array.isArray(data?.results) ? data.results : [];
                        shownMemoryIds = results.map(r => r.id).filter(id => typeof id === 'number');
                    }
                }
                catch (_error) { /* ignore parse errors */ }
                if (shownMemoryIds.length > 0) {
                    const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
                    const feedbackEvents = shownMemoryIds.map(memId => ({
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
    }
    catch (_error) { /* feedback logging must never break search */ }
    // REQ-014: Query flow tracking + result_cited for includeContent searches
    // Shadow-only: emits query_reformulated, same_topic_requery, and result_cited events.
    try {
        if (isImplicitFeedbackLogEnabled()) {
            const db = (() => { try {
                return requireDb();
            }
            catch (_error) {
                return null;
            } })();
            if (db) {
                // Extract shown memory IDs from response (reuse parsed data if available)
                let shownIds = [];
                try {
                    if (responseToReturn?.content?.[0]?.text) {
                        const parsed = JSON.parse(responseToReturn.content[0].text);
                        const data = parsed?.data;
                        const results = Array.isArray(data?.results) ? data.results : [];
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
                }
                catch (_error) { /* ignore parse errors */ }
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
    }
    catch (_error) { /* query flow tracking must never break search */ }
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
                    };
                }
            }
            catch (_profileError) {
                // Profile formatting is best-effort — never breaks search
            }
        }
    }
    return responseToReturn;
}
/* ───────────────────────────────────────────────────────────────
   11. EXPORTS
──────────────────────────────────────────────────────────────── */
export { handleMemorySearch, };
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
export { handle_memory_search, };
//# sourceMappingURL=memory-search.js.map