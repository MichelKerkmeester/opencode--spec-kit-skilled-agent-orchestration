// ────────────────────────────────────────────────────────────────
// MODULE: Search Results Formatter
// ────────────────────────────────────────────────────────────────
// Node stdlib
import fs from 'fs';
// Internal modules
import { estimateTokens } from './token-metrics.js';
// Import path security utilities (migrated from shared/utils.js)
import { validateFilePath } from '../lib/utils/path-security.js';
import { readSessionTransitionTrace, } from '../lib/search/session-transition.js';
// Import memory parser for anchor extraction (SK-005)
import * as memoryParser from '../lib/parsing/memory-parser.js';
// REQ-019: Standardized Response Structure
import { createMCPSuccessResponse, createMCPEmptyResponse, } from '../lib/response/envelope.js';
// REQ-D5-001: Empty/Weak Result Recovery UX
import { buildRecoveryPayload, shouldTriggerRecovery, isEmptyResultRecoveryEnabled, } from '../lib/search/recovery-payload.js';
// REQ-D5-004: Per-Result Calibrated Confidence
import { computeResultConfidence, assessRequestQuality, isResultConfidenceEnabled, } from '../lib/search/confidence-scoring.js';
// REQ-D5-002: Two-Tier Explainability
import { attachExplainabilityToResults, isResultExplainEnabled, } from '../lib/search/result-explainability.js';
// Consolidated path validation from core/config.js (single source of truth)
import { ALLOWED_BASE_PATHS } from '../core/config.js';
// ────────────────────────────────────────────────────────────────
// 2. PATH VALIDATION 
// ────────────────────────────────────────────────────────────────
export function validateFilePathLocal(filePath) {
    const result = validateFilePath(filePath, ALLOWED_BASE_PATHS);
    if (result === null) {
        throw new Error('Access denied: Path outside allowed directories');
    }
    // Additional check for .. patterns (not just null bytes which shared handles)
    if (filePath.includes('..')) {
        throw new Error('Access denied: Invalid path pattern');
    }
    return result;
}
// ────────────────────────────────────────────────────────────────
// 3. HELPER UTILITIES 
// ────────────────────────────────────────────────────────────────
export function safeJsonParse(str, fallback) {
    if (!str)
        return fallback;
    try {
        return JSON.parse(str);
    }
    catch (_error) {
        return fallback;
    }
}
function toNullableNumber(value) {
    if (typeof value === 'number' && Number.isFinite(value))
        return value;
    if (typeof value === 'string' && value.trim().length > 0) {
        const parsed = Number(value);
        if (Number.isFinite(parsed))
            return parsed;
    }
    return null;
}
function resolveCompositeScore(rawResult) {
    const intentAdjusted = toNullableNumber(rawResult.intentAdjustedScore);
    if (intentAdjusted !== null)
        return intentAdjusted;
    const fusion = toNullableNumber(rawResult.rrfScore);
    if (fusion !== null)
        return fusion;
    const score = toNullableNumber(rawResult.score);
    if (score !== null)
        return score;
    const similarity = toNullableNumber(rawResult.similarity ?? rawResult.averageSimilarity);
    if (similarity !== null)
        return Math.max(0, Math.min(1, similarity / 100));
    return null;
}
function resolveScoreResolution(rawResult) {
    if (toNullableNumber(rawResult.intentAdjustedScore) !== null)
        return 'intentAdjusted';
    if (toNullableNumber(rawResult.rrfScore) !== null)
        return 'fusion';
    if (toNullableNumber(rawResult.score) !== null)
        return 'score';
    if (toNullableNumber(rawResult.similarity ?? rawResult.averageSimilarity) !== null)
        return 'semantic';
    return 'none';
}
function extractAnchorDetails(rawResult) {
    const metadata = Array.isArray(rawResult.anchorMetadata)
        ? rawResult.anchorMetadata
        : [];
    const anchorIds = metadata
        .map((entry) => (typeof entry.id === 'string' ? entry.id : null))
        .filter((entry) => entry !== null);
    const anchorTypes = metadata
        .map((entry) => (typeof entry.type === 'string' ? entry.type : null))
        .filter((entry) => entry !== null);
    return { anchorIds, anchorTypes };
}
function addChannel(channelsUsed, candidate) {
    if (typeof candidate !== 'string')
        return;
    const normalized = candidate.trim();
    if (normalized.length === 0)
        return;
    channelsUsed.add(normalized);
}
function extractAttributedChannels(rawResult) {
    const channels = new Set();
    const numericId = toNullableNumber(rawResult.id);
    const traceMetadata = rawResult.traceMetadata;
    const attribution = traceMetadata?.attribution;
    if (!attribution || typeof attribution !== 'object') {
        return [];
    }
    for (const [channel, memoryIds] of Object.entries(attribution)) {
        if (!Array.isArray(memoryIds) || numericId === null) {
            continue;
        }
        const matchesResult = memoryIds.some((memoryId) => toNullableNumber(memoryId) === numericId);
        if (matchesResult) {
            addChannel(channels, channel);
        }
    }
    return Array.from(channels);
}
function extractTrace(rawResult, extraData) {
    const rootTrace = extraData?.retrievalTrace;
    const retrievalTrace = rawResult.retrievalTrace ?? rootTrace;
    const stages = Array.isArray(retrievalTrace?.stages) ? retrievalTrace.stages : [];
    const pipelineStages = stages
        .map((entry) => (typeof entry.stage === 'string' ? entry.stage : null))
        .filter((entry) => entry !== null);
    const channelsUsed = new Set();
    const expansionTerms = new Set();
    let fallbackTier = null;
    let queryComplexity = null;
    let budgetTruncated = false;
    let graphContribution;
    let adaptiveMode = null;
    for (const stage of stages) {
        const meta = stage.metadata ?? {};
        const channel = typeof meta.channel === 'string' ? meta.channel : null;
        if (channel)
            channelsUsed.add(channel);
        if (Array.isArray(meta.channels)) {
            for (const item of meta.channels) {
                if (typeof item === 'string')
                    channelsUsed.add(item);
            }
        }
        if (Array.isArray(meta.expandedTerms)) {
            for (const term of meta.expandedTerms) {
                if (typeof term === 'string')
                    expansionTerms.add(term);
            }
        }
        if (typeof meta.tier === 'number' && Number.isFinite(meta.tier)) {
            fallbackTier = meta.tier;
        }
        if (typeof meta.fallbackTier === 'number' && Number.isFinite(meta.fallbackTier)) {
            fallbackTier = meta.fallbackTier;
        }
        if (typeof meta.queryComplexity === 'string' && meta.queryComplexity.length > 0) {
            queryComplexity = meta.queryComplexity;
        }
        if (meta.budgetTruncated === true || meta.truncated === true) {
            budgetTruncated = true;
        }
    }
    if (rawResult.fallbackRetry === true) {
        fallbackTier = fallbackTier ?? 2;
    }
    addChannel(channelsUsed, rawResult.source);
    if (Array.isArray(rawResult.sources)) {
        for (const source of rawResult.sources) {
            addChannel(channelsUsed, source);
        }
    }
    for (const channel of extractAttributedChannels(rawResult)) {
        addChannel(channelsUsed, channel);
    }
    // CHK-038: Fallback — read queryComplexity from traceMetadata if not found in stages
    if (!queryComplexity) {
        const tm = rawResult.traceMetadata;
        if (typeof tm?.queryComplexity === 'string' && tm.queryComplexity.length > 0) {
            queryComplexity = tm.queryComplexity;
        }
    }
    const adaptiveShadow = extraData?.adaptiveShadow;
    if (typeof adaptiveShadow?.mode === 'string') {
        adaptiveMode = adaptiveShadow.mode;
    }
    if (rawResult.graphContribution && typeof rawResult.graphContribution === 'object') {
        const contribution = rawResult.graphContribution;
        graphContribution = {
            sources: Array.isArray(contribution.sources)
                ? contribution.sources.filter((value) => typeof value === 'string')
                : [],
            totalDelta: typeof contribution.totalDelta === 'number' ? contribution.totalDelta : 0,
            injected: contribution.injected === true,
            raw: typeof contribution.raw === 'number' ? contribution.raw : undefined,
            normalized: typeof contribution.normalized === 'number' ? contribution.normalized : undefined,
            appliedBonus: typeof contribution.appliedBonus === 'number' ? contribution.appliedBonus : undefined,
            capApplied: contribution.capApplied === true,
            rolloutState: typeof contribution.rolloutState === 'string' ? contribution.rolloutState : null,
        };
    }
    const sessionTransition = readSessionTransitionTrace(extraData?.sessionTransition) ?? undefined;
    return {
        channelsUsed: Array.from(channelsUsed),
        pipelineStages,
        fallbackTier,
        queryComplexity,
        expansionTerms: Array.from(expansionTerms),
        budgetTruncated,
        scoreResolution: resolveScoreResolution(rawResult),
        graphContribution,
        adaptiveMode,
        sessionTransition,
    };
}
// ────────────────────────────────────────────────────────────────
// 4. SEARCH RESULTS FORMATTING 
// ────────────────────────────────────────────────────────────────
export async function formatSearchResults(results, searchType, include_content = false, anchors = null, parserOverride = null, startTime = null, extraData = {}, includeTrace = false, query = null, specFolder = null) {
    const startMs = startTime || Date.now();
    const includeContent = include_content;
    if (!results || results.length === 0) {
        // REQ-D5-001: Attach recovery payload when flag is enabled
        let recoveryPayload = null;
        const requestQualityData = isResultConfidenceEnabled()
            ? assessRequestQuality([], [])
            : null;
        if (isEmptyResultRecoveryEnabled()) {
            recoveryPayload = buildRecoveryPayload({
                query,
                hasSpecFolderFilter: specFolder !== null && specFolder.length > 0,
                resultCount: 0,
            });
        }
        // REQ-019: Use standardized empty response envelope
        return createMCPEmptyResponse({
            tool: 'memory_search',
            summary: 'No matching memories found',
            data: {
                searchType: searchType,
                constitutionalCount: 0,
                ...(requestQualityData ?? {}),
                // Always spread caller-provided extraData (pipeline trace, timing, evidence gaps, etc.)
                ...(extraData ?? {}),
                // REQ-D5-001: Attach recovery payload (additive, only when flag enabled)
                ...(recoveryPayload !== null ? { recovery: recoveryPayload } : {}),
            },
            hints: [
                'Try broadening your search query',
                'Use memory_list() to browse available memories',
                'Check if specFolder filter is too restrictive'
            ],
            startTime: startMs
        });
    }
    // Count constitutional results
    const constitutionalCount = results.filter(rawResult => rawResult.isConstitutional).length;
    const formatted = await Promise.all(results.map(async (rawResult) => {
        const formattedResult = {
            id: typeof rawResult.id === 'number' ? rawResult.id : Number.parseInt(rawResult.id, 10),
            specFolder: rawResult.spec_folder ?? String(rawResult.specFolder ?? ''),
            filePath: rawResult.file_path ?? String(rawResult.filePath ?? ''),
            title: rawResult.title ?? null,
            similarity: rawResult.similarity ?? rawResult.averageSimilarity,
            isConstitutional: rawResult.isConstitutional || false,
            importanceTier: rawResult.importance_tier,
            triggerPhrases: Array.isArray(rawResult.triggerPhrases) ? rawResult.triggerPhrases :
                safeJsonParse(rawResult.triggerPhrases, []),
            createdAt: rawResult.created_at,
            isChunk: rawResult.isChunk === true,
            parentId: toNullableNumber(rawResult.parentId ?? rawResult.parent_id),
            chunkIndex: toNullableNumber(rawResult.chunkIndex ?? rawResult.chunk_index),
            chunkLabel: (typeof rawResult.chunkLabel === 'string'
                ? rawResult.chunkLabel
                : (typeof rawResult.chunk_label === 'string' ? rawResult.chunk_label : null)),
            chunkCount: toNullableNumber(rawResult.chunkCount ?? rawResult.chunk_count),
            contentSource: (rawResult.contentSource === 'reassembled_chunks' || rawResult.contentSource === 'file_read_fallback')
                ? rawResult.contentSource
                : undefined,
        };
        if (includeTrace) {
            const anchorsInfo = extractAnchorDetails(rawResult);
            formattedResult.scores = {
                semantic: toNullableNumber(rawResult.similarity ?? rawResult.averageSimilarity),
                lexical: toNullableNumber(rawResult.fts_score ?? rawResult.bm25_score ?? rawResult.sourceScores?.keyword ?? rawResult.sourceScores?.fts ?? rawResult.sourceScores?.bm25),
                fusion: toNullableNumber(rawResult.rrfScore),
                intentAdjusted: toNullableNumber(rawResult.intentAdjustedScore),
                composite: resolveCompositeScore(rawResult),
                rerank: toNullableNumber(rawResult.rerankerScore),
                attention: toNullableNumber(rawResult.attentionScore),
            };
            formattedResult.source = {
                file: typeof rawResult.file_path === 'string' ? rawResult.file_path : null,
                anchorIds: anchorsInfo.anchorIds,
                anchorTypes: anchorsInfo.anchorTypes,
                lastModified: typeof rawResult.updated_at === 'string'
                    ? rawResult.updated_at
                    : (typeof rawResult.created_at === 'string' ? rawResult.created_at : null),
                memoryState: typeof rawResult.memoryState === 'string' ? rawResult.memoryState : null,
            };
            formattedResult.trace = extractTrace(rawResult, extraData);
        }
        // Phase C T029: Include graphEvidence provenance when present on the pipeline row.
        // The field is populated by Stage 2 when SPECKIT_RESULT_PROVENANCE is enabled.
        if (rawResult.graphEvidence && typeof rawResult.graphEvidence === 'object') {
            const evidence = rawResult.graphEvidence;
            formattedResult.graphEvidence = {
                edges: Array.isArray(evidence.edges)
                    ? evidence.edges.map((e) => ({
                        sourceId: typeof e.sourceId === 'number' ? e.sourceId : 0,
                        targetId: typeof e.targetId === 'number' ? e.targetId : 0,
                        relation: typeof e.relation === 'string' ? e.relation : 'unknown',
                        strength: typeof e.strength === 'number' ? e.strength : 1.0,
                    }))
                    : [],
                communities: Array.isArray(evidence.communities)
                    ? evidence.communities.map((c) => ({
                        communityId: typeof c.communityId === 'number' ? c.communityId : 0,
                        ...(typeof c.summary === 'string' ? { summary: c.summary } : {}),
                    }))
                    : [],
                boostFactors: Array.isArray(evidence.boostFactors)
                    ? evidence.boostFactors.map((b) => ({
                        type: typeof b.type === 'string' ? b.type : 'unknown',
                        delta: typeof b.delta === 'number' ? b.delta : 0,
                    }))
                    : [],
            };
        }
        // Include file content if requested.
        // Prefer precomputed chunk reassembly from memory-search to avoid disk reads.
        if (includeContent) {
            try {
                let content = null;
                if (typeof rawResult.precomputedContent === 'string' && rawResult.precomputedContent.length > 0) {
                    content = rawResult.precomputedContent;
                    if (!formattedResult.contentSource) {
                        formattedResult.contentSource = 'reassembled_chunks';
                    }
                }
                else if (rawResult.file_path) {
                    // SEC-002: Validate DB-stored file paths before reading (CWE-22 defense-in-depth)
                    const validatedPath = validateFilePathLocal(rawResult.file_path);
                    content = await fs.promises.readFile(validatedPath, 'utf-8');
                    if (!formattedResult.contentSource) {
                        formattedResult.contentSource = 'file_read_fallback';
                    }
                }
                else {
                    formattedResult.content = null;
                    formattedResult.contentError = 'File not found';
                    return formattedResult;
                }
                // SK-005: Anchor System Implementation
                const parser = parserOverride || memoryParser;
                if (anchors && Array.isArray(anchors) && anchors.length > 0 && parser && typeof content === 'string') {
                    // BUG-017 FIX: Capture original tokens BEFORE any content reassignment
                    const originalTokens = estimateTokens(content);
                    const extracted = parser.extractAnchors(content);
                    const filteredParts = [];
                    let foundCount = 0;
                    for (const anchorId of anchors) {
                        // SK-005 Prefix matching: try exact match first, then fall back to
                        // Prefix match for composite anchor IDs (e.g. 'summary' matches
                        // 'summary-session-1770903150838-...'). Prefers shortest match to
                        // Select the most specific key when multiple keys share a prefix.
                        const matchingKey = extracted[anchorId] !== undefined
                            ? anchorId
                            : Object.keys(extracted)
                                .filter(key => key.startsWith(anchorId + '-'))
                                .sort((a, b) => a.length - b.length)[0] ?? undefined;
                        if (matchingKey !== undefined) {
                            filteredParts.push(`<!-- ANCHOR:${matchingKey} -->\n${extracted[matchingKey]}\n<!-- /ANCHOR:${matchingKey} -->`);
                            foundCount++;
                        }
                    }
                    if (filteredParts.length > 0) {
                        // SK-005 Fix: Warn about missing anchors in partial match
                        // Use same prefix-matching logic for consistency
                        const missingAnchors = anchors.filter(a => {
                            if (extracted[a] !== undefined)
                                return false;
                            return !Object.keys(extracted).some(key => key.startsWith(a + '-'));
                        });
                        if (missingAnchors.length > 0) {
                            filteredParts.push(`<!-- WARNING: Requested anchors not found: ${missingAnchors.join(', ')} -->`);
                        }
                        content = filteredParts.join('\n\n');
                        const newTokens = estimateTokens(content);
                        const savings = Math.round((1 - newTokens / Math.max(originalTokens, 1)) * 100);
                        formattedResult.tokenMetrics = {
                            originalTokens: originalTokens,
                            returnedTokens: newTokens,
                            savingsPercent: savings,
                            anchorsRequested: anchors.length,
                            anchorsFound: foundCount
                        };
                    }
                    else {
                        // No anchors found - return warning
                        content = `<!-- WARNING: Requested anchors not found: ${anchors.join(', ')} -->`;
                        formattedResult.tokenMetrics = {
                            originalTokens: originalTokens,
                            returnedTokens: 0,
                            savingsPercent: 100,
                            anchorsRequested: anchors.length,
                            anchorsFound: 0
                        };
                    }
                }
                formattedResult.content = content;
            }
            catch (err) {
                formattedResult.content = null;
                const message = err instanceof Error ? err.message : String(err);
                // BUG-023 FIX: Sanitize error messages to prevent information leakage
                formattedResult.contentError = message.includes('Access denied')
                    ? 'Security: Access denied'
                    : message.includes('ENOENT')
                        ? 'File not found'
                        : 'Failed to read file';
            }
        }
        return formattedResult;
    }));
    // REQ-D5-004: Compute per-result confidence when flag is enabled (additive, no side-effects)
    const confidenceEnabled = isResultConfidenceEnabled();
    let confidenceData = null;
    let requestQualityData = null;
    if (confidenceEnabled) {
        // Cast to ScoredResult — RawSearchResult extends Record<string,unknown> and has the same shape
        const scoredResults = results;
        confidenceData = computeResultConfidence(scoredResults);
        requestQualityData = assessRequestQuality(scoredResults, confidenceData);
    }
    // REQ-D5-001: Compute recovery payload for weak/partial results when flag is enabled
    let recoveryPayload = null;
    if (isEmptyResultRecoveryEnabled() && formatted.length > 0) {
        // Compute average confidence for recovery decision
        let avgConfidence;
        if (confidenceData && confidenceData.length > 0) {
            const sum = confidenceData.reduce((acc, c) => acc + c.confidence.value, 0);
            avgConfidence = sum / confidenceData.length;
        }
        const recoveryCtx = {
            query,
            hasSpecFolderFilter: specFolder !== null && specFolder.length > 0,
            evidenceGap: Boolean(extraData?.evidenceGap),
            resultCount: formatted.length,
            avgConfidence,
        };
        if (shouldTriggerRecovery(recoveryCtx)) {
            recoveryPayload = buildRecoveryPayload(recoveryCtx);
        }
    }
    // REQ-019: Build summary based on result characteristics
    const summary = constitutionalCount > 0
        ? `Found ${formatted.length} memories (${constitutionalCount} constitutional)`
        : `Found ${formatted.length} memories`;
    // REQ-019: Build hints based on context
    const hints = [];
    if (includeContent && anchors && anchors.length > 0) {
        hints.push('Anchor filtering applied for token efficiency');
    }
    if (!includeContent && formatted.length > 0) {
        hints.push('Use includeContent: true to embed file contents in results');
    }
    if (formatted.some(r => r.contentError)) {
        hints.push('Some files could not be read - check file paths');
    }
    // Merge per-result confidence into the formatted result array (additive)
    const resultsWithConfidence = formatted.map((r, i) => {
        if (!confidenceData)
            return r;
        const conf = confidenceData[i];
        if (!conf)
            return r;
        return { ...r, ...conf };
    });
    // REQ-D5-002: Attach explainability (slim tier) to every result when flag is ON.
    // Pass results as PipelineRow-compatible — they share the same Record<string,unknown> base.
    // Debug tier is opt-in via SPECKIT_RESULT_EXPLAIN_DEBUG env var.
    const explainOptions = {
        debugEnabled: process.env.SPECKIT_RESULT_EXPLAIN_DEBUG?.toLowerCase().trim() === 'true',
    };
    const resultsWithExplain = isResultExplainEnabled()
        ? attachExplainabilityToResults(resultsWithConfidence, explainOptions)
        : resultsWithConfidence;
    // REQ-019: Use standardized success response envelope
    const responseData = {
        searchType: searchType,
        count: formatted.length,
        constitutionalCount: constitutionalCount,
        results: resultsWithExplain,
        // REQ-D5-004: Request-level quality assessment (additive)
        ...(requestQualityData !== null ? requestQualityData : {}),
        // REQ-D5-001: Recovery payload for weak/partial results (additive)
        ...(recoveryPayload !== null ? { recovery: recoveryPayload } : {}),
    };
    // Always spread caller-provided extraData (pipeline trace, timing, evidence gaps, etc.).
    // Spread extraData first, then re-assert canonical keys to prevent overwrites.
    if (extraData && Object.keys(extraData).length > 0) {
        const { searchType: _s, count: _c, constitutionalCount: _cc, results: _r, ...safeExtra } = extraData;
        Object.assign(responseData, safeExtra);
    }
    return createMCPSuccessResponse({
        tool: 'memory_search',
        summary,
        data: responseData,
        hints,
        startTime: startMs
    });
}
/* ───────────────────────────────────────────────────────────────
   5. (ESM exports above — no CommonJS module.exports needed)
   ──────────────────────────────────────────────────────────────── */
//# sourceMappingURL=search-results.js.map