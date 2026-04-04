// ────────────────────────────────────────────────────────────────
// MODULE: Memory Context
// ────────────────────────────────────────────────────────────────
import { randomUUID } from 'crypto';
// Layer definitions
import * as layerDefs from '../lib/architecture/layer-definitions.js';
import { checkDatabaseUpdated } from '../core/index.js';
import { toErrorMessage } from '../utils/index.js';
// Intent classifier
import * as intentClassifier from '../lib/search/intent-classifier.js';
// Query-intent routing (Phase 020: structural/semantic/hybrid classification)
import { classifyQueryIntent } from '../lib/code-graph/query-intent-classifier.js';
import { buildContext } from '../lib/code-graph/code-graph-context.js';
// Core handlers for routing
import { handleMemorySearch } from './memory-search.js';
import { handleMemoryMatchTriggers } from './memory-triggers.js';
// Response envelope
import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope.js';
// Token estimation
import { estimateTokens } from '../formatters/token-metrics.js';
import { getPressureLevel, } from '../lib/cognitive/pressure-monitor.js';
import * as workingMemory from '../lib/cognitive/working-memory.js';
import * as sessionManager from '../lib/session/session-manager.js';
// Telemetry
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
import { attachSessionTransitionTrace, buildSessionTransitionTrace, } from '../lib/search/session-transition.js';
// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
import * as vectorIndex from '../lib/search/vector-index.js';
// PI-B3: Folder discovery integration
import { discoverSpecFolder, getSpecsBasePaths } from '../lib/search/folder-discovery.js';
import { isAutoResumeEnabled, isFolderDiscoveryEnabled, isPressurePolicyEnabled, isIntentAutoProfileEnabled, } from '../lib/search/search-flags.js';
function extractResultRowsFromContextResponse(responseText) {
    try {
        const parsed = JSON.parse(responseText);
        const outerData = parsed?.data;
        const directRows = Array.isArray(outerData?.results)
            ? outerData.results
            : null;
        if (directRows) {
            return directRows;
        }
        const nestedContent = Array.isArray(outerData?.content)
            ? outerData.content
            : [];
        const nestedText = nestedContent[0]?.text;
        if (typeof nestedText !== 'string' || nestedText.length === 0) {
            return [];
        }
        const nestedEnvelope = JSON.parse(nestedText);
        const nestedData = nestedEnvelope?.data;
        return Array.isArray(nestedData?.results)
            ? nestedData.results
            : [];
    }
    catch {
        return [];
    }
}
function extractStrategyError(result) {
    if (result.isError !== true) {
        return null;
    }
    const content = Array.isArray(result.content)
        ? result.content
        : [];
    const responseText = content[0]?.text;
    if (typeof responseText !== 'string' || responseText.length === 0) {
        return {
            error: 'Context strategy failed',
            code: 'E_STRATEGY',
            details: {},
            hints: [],
            severity: null,
        };
    }
    try {
        const parsed = JSON.parse(responseText);
        return {
            error: parsed.data?.error ?? 'Context strategy failed',
            code: parsed.data?.code ?? 'E_STRATEGY',
            details: parsed.data?.details ?? {},
            hints: Array.isArray(parsed.hints) ? parsed.hints : [],
            severity: parsed.meta?.severity ?? null,
        };
    }
    catch {
        return {
            error: 'Context strategy failed',
            code: 'E_STRATEGY',
            details: {},
            hints: [],
            severity: null,
        };
    }
}
/* ───────────────────────────────────────────────────────────────
   2. TOKEN BUDGET ENFORCEMENT (T205)
   
   Enforces per-layer/per-mode token budgets by estimating the
   token count of strategy results and truncating when exceeded.
   Uses character-based estimation: 1 token ≈ 4 chars.
──────────────────────────────────────────────────────────────── */
/**
 * T205: Enforce token budget on strategy results.
 *
 * Estimates the token count of the serialized result. If over budget,
 * parses embedded result arrays and removes lowest-priority items
 * until within budget. Higher-scored results are preserved.
 */
function enforceTokenBudget(result, budgetTokens) {
    const serialized = JSON.stringify(result);
    const actualTokens = estimateTokens(serialized);
    // Under budget — no enforcement needed
    if (actualTokens <= budgetTokens) {
        return {
            result,
            enforcement: {
                budgetTokens,
                actualTokens,
                enforced: false,
                truncated: false,
            }
        };
    }
    // Over budget — attempt to truncate embedded results
    // Strategy results contain an embedded MCPResponse with content[0].text as JSON
    // That JSON has a .data.results array we can truncate
    const truncatedResult = { ...result };
    let parseFailed = false;
    let originalResultCount;
    let returnedResultCount;
    const fallbackToStructuredBudget = (baseResult, parseFailedInnerText) => {
        const fallbackResult = { ...baseResult };
        const fallbackContent = Array.isArray(fallbackResult.content)
            ? fallbackResult.content
            : [];
        const contentClone = fallbackContent.map((entry) => ({ ...entry }));
        const candidateInnerStates = [
            {
                summary: 'Context truncated to fit token budget',
                data: {
                    count: 0,
                    results: [],
                },
                meta: {
                    tool: 'memory_search',
                    truncated: true,
                    parseFailed: Boolean(parseFailedInnerText),
                },
            },
            {
                data: {
                    count: 0,
                    results: [],
                },
                meta: {
                    tool: 'memory_search',
                    truncated: true,
                },
            },
            {
                data: {
                    count: 0,
                    results: [],
                },
            },
        ];
        if (parseFailedInnerText) {
            const meta = candidateInnerStates[0].meta;
            meta.parseFailedPreview = parseFailedInnerText.slice(0, 120);
        }
        for (const innerEnvelope of candidateInnerStates) {
            if (contentClone.length > 0) {
                contentClone[0] = { ...contentClone[0], text: JSON.stringify(innerEnvelope) };
                fallbackResult.content = contentClone;
            }
            else {
                fallbackResult.content = [
                    { type: 'text', text: JSON.stringify(innerEnvelope) },
                ];
            }
            if (estimateTokens(JSON.stringify(fallbackResult)) <= budgetTokens) {
                return fallbackResult;
            }
        }
        return {
            strategy: baseResult.strategy,
            mode: baseResult.mode,
            content: [{
                    type: 'text',
                    text: JSON.stringify({ data: { count: 0, results: [] } }),
                }],
        };
    };
    const compactStructuredResult = (innerEnvelope, currentResults, contentEntries) => {
        const truncateKeys = ['content', 'snippet', 'summary', 'text'];
        const lastIndex = currentResults.length - 1;
        if (lastIndex < 0) {
            return null;
        }
        const lastResult = currentResults[lastIndex];
        if (!lastResult || typeof lastResult !== 'object') {
            return null;
        }
        for (const key of truncateKeys) {
            const originalValue = lastResult[key];
            if (typeof originalValue !== 'string' || originalValue.length === 0) {
                continue;
            }
            let bestResult = null;
            let bestTokens = Number.POSITIVE_INFINITY;
            let low = 0;
            let high = originalValue.length;
            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                const candidateResults = [...currentResults];
                candidateResults[lastIndex] = {
                    ...lastResult,
                    [key]: originalValue.slice(0, mid),
                };
                innerEnvelope.data = {
                    ...(innerEnvelope.data ?? {}),
                    results: candidateResults,
                    count: candidateResults.length,
                };
                const candidateContent = contentEntries.map((entry, index) => (index === 0 ? { type: entry.type, text: JSON.stringify(innerEnvelope) } : { ...entry }));
                const candidateResult = {
                    ...truncatedResult,
                    content: candidateContent,
                };
                const candidateTokens = estimateTokens(JSON.stringify(candidateResult));
                if (candidateTokens <= budgetTokens) {
                    bestResult = candidateResult;
                    bestTokens = candidateTokens;
                    low = mid + 1;
                }
                else {
                    high = mid - 1;
                }
            }
            if (bestResult) {
                return {
                    result: bestResult,
                    actualTokens: bestTokens,
                };
            }
        }
        return null;
    };
    // Try to find and truncate the inner results array
    const contentArr = truncatedResult.content;
    let parseFailedInnerText;
    if (contentArr && Array.isArray(contentArr) && contentArr.length > 0 && contentArr[0]?.text) {
        try {
            const innerEnvelope = JSON.parse(contentArr[0].text);
            const innerResults = innerEnvelope?.data?.results;
            if (Array.isArray(innerResults) && innerResults.length > 0) {
                originalResultCount = innerResults.length;
                // Results should already be sorted by score (highest first)
                // Remove items from the end until we fit within budget
                const currentResults = [...innerResults];
                let currentTokens = actualTokens;
                // Phase 1: Adaptive content truncation — truncate content fields before dropping results
                const MAX_CONTENT_CHARS = 500;
                for (const r of currentResults) {
                    if (r.content && typeof r.content === 'string' && r.content.length > MAX_CONTENT_CHARS) {
                        r.content = r.content.substring(0, MAX_CONTENT_CHARS) + '...';
                        r.contentTruncated = true;
                    }
                }
                // Re-estimate after content truncation
                innerEnvelope.data.results = currentResults;
                innerEnvelope.data.count = currentResults.length;
                currentTokens = estimateTokens(JSON.stringify(innerEnvelope));
                // Phase 2: Drop lowest-scored results if still over budget
                while (currentResults.length > 1 && currentTokens > budgetTokens) {
                    // Remove the last (lowest-scored) result
                    const removed = currentResults.pop();
                    const removedTokens = estimateTokens(JSON.stringify(removed));
                    currentTokens -= removedTokens;
                }
                // Phase 3: Two-tier response — append metadata-only entries for dropped results
                const droppedResults = innerResults.slice(currentResults.length);
                if (droppedResults.length > 0) {
                    const metadataOnly = droppedResults.map((r) => ({
                        id: r.id,
                        title: r.title,
                        similarity: r.similarity,
                        specFolder: r.specFolder,
                        confidence: r.confidence,
                        importanceTier: r.importanceTier,
                        isConstitutional: r.isConstitutional,
                        metadataOnly: true,
                    }));
                    const metadataTokens = estimateTokens(JSON.stringify(metadataOnly));
                    if (currentTokens + metadataTokens <= budgetTokens) {
                        currentResults.push(...metadataOnly);
                        currentTokens += metadataTokens;
                    }
                }
                // Update the inner envelope
                innerEnvelope.data.results = currentResults;
                innerEnvelope.data.count = currentResults.length;
                returnedResultCount = currentResults.length;
                // Re-serialize
                contentArr[0] = { type: 'text', text: JSON.stringify(innerEnvelope) };
                truncatedResult.content = contentArr;
                // Recalculate actual tokens after truncation
                const newSerializedTokens = estimateTokens(JSON.stringify(truncatedResult));
                if (newSerializedTokens <= budgetTokens) {
                    return {
                        result: truncatedResult,
                        enforcement: {
                            budgetTokens,
                            actualTokens: newSerializedTokens,
                            enforced: true,
                            truncated: true,
                            originalResultCount,
                            returnedResultCount,
                        }
                    };
                }
                const compacted = compactStructuredResult(innerEnvelope, currentResults, contentArr);
                if (compacted) {
                    return {
                        result: compacted.result,
                        enforcement: {
                            budgetTokens,
                            actualTokens: compacted.actualTokens,
                            enforced: true,
                            truncated: true,
                            originalResultCount,
                            returnedResultCount,
                        }
                    };
                }
            }
        }
        catch {
            parseFailed = true;
            parseFailedInnerText = contentArr[0].text;
            // JSON parse failed — fall through to structural truncation
        }
    }
    // Fallback when parsing fails or a structured response still exceeds budget.
    // Always emit valid nested JSON rather than raw character slices.
    const fallbackResult = fallbackToStructuredBudget(parseFailed ? result : truncatedResult, parseFailedInnerText);
    const fallbackTokens = estimateTokens(JSON.stringify(fallbackResult));
    return {
        result: fallbackResult,
        enforcement: {
            budgetTokens,
            actualTokens: fallbackTokens,
            enforced: true,
            truncated: true,
            originalResultCount,
            returnedResultCount,
        }
    };
}
/* ───────────────────────────────────────────────────────────────
   3. CONTEXT MODE DEFINITIONS
──────────────────────────────────────────────────────────────── */
const CONTEXT_MODES = {
    // Auto-detect: Let the system determine the best approach
    auto: {
        name: 'Auto',
        description: 'Automatically detect intent and route to optimal strategy',
        strategy: 'adaptive'
    },
    // Quick: Fast trigger-based matching for reactive context
    quick: {
        name: 'Quick',
        description: 'Fast trigger matching for real-time context (low latency)',
        strategy: 'triggers',
        tokenBudget: 800
    },
    // Deep: Comprehensive semantic search with full context
    deep: {
        name: 'Deep',
        description: 'Semantic search with full context retrieval',
        strategy: 'search',
        tokenBudget: 3500
    },
    // Focused: Intent-specific search with optimized weights
    focused: {
        name: 'Focused',
        description: 'Intent-aware search with task-specific optimization',
        strategy: 'intent-search',
        tokenBudget: 3000
    },
    // Resume: Session recovery mode
    resume: {
        name: 'Resume',
        description: 'Resume previous work with state and next-steps anchors',
        strategy: 'resume',
        tokenBudget: 2000
    }
};
/* ───────────────────────────────────────────────────────────────
   4. INTENT-TO-MODE ROUTING
──────────────────────────────────────────────────────────────── */
const INTENT_TO_MODE = {
    add_feature: 'deep',
    fix_bug: 'focused',
    refactor: 'deep',
    security_audit: 'deep',
    understand: 'focused',
    find_spec: 'deep',
    find_decision: 'focused'
};
/* ───────────────────────────────────────────────────────────────
   5. CONTEXT STRATEGY EXECUTORS
──────────────────────────────────────────────────────────────── */
async function executeQuickStrategy(input, options) {
    const result = await handleMemoryMatchTriggers({
        prompt: input,
        specFolder: options.specFolder,
        tenantId: options.tenantId,
        userId: options.userId,
        agentId: options.agentId,
        sharedSpaceId: options.sharedSpaceId,
        limit: options.limit || 5,
        session_id: options.sessionId,
        include_cognitive: true
    });
    return {
        strategy: 'quick',
        mode: 'quick',
        ...result
    };
}
async function executeDeepStrategy(input, intent, options) {
    const result = await handleMemorySearch({
        query: input,
        specFolder: options.specFolder,
        folderBoost: options.folderBoost,
        tenantId: options.tenantId,
        userId: options.userId,
        agentId: options.agentId,
        sharedSpaceId: options.sharedSpaceId,
        limit: options.limit || 10,
        includeConstitutional: true,
        includeContent: options.includeContent || false,
        includeTrace: options.includeTrace || false, // CHK-040
        anchors: options.anchors,
        sessionId: options.sessionId,
        sessionTransition: options.sessionTransition,
        enableDedup: options.enableDedup !== false,
        profile: options.profile,
        intent: intent ?? undefined,
        autoDetectIntent: intent ? false : true,
        useDecay: true,
        // minState omitted — memoryState column not yet in schema
    });
    return {
        strategy: 'deep',
        mode: 'deep',
        ...result
    };
}
async function executeFocusedStrategy(input, intent, options) {
    const result = await handleMemorySearch({
        query: input,
        specFolder: options.specFolder,
        folderBoost: options.folderBoost,
        tenantId: options.tenantId,
        userId: options.userId,
        agentId: options.agentId,
        sharedSpaceId: options.sharedSpaceId,
        limit: options.limit || 8,
        includeConstitutional: true,
        includeContent: options.includeContent || false,
        includeTrace: options.includeTrace || false, // CHK-040
        anchors: options.anchors,
        sessionId: options.sessionId,
        sessionTransition: options.sessionTransition,
        enableDedup: options.enableDedup !== false,
        profile: options.profile,
        intent: intent ?? undefined,
        autoDetectIntent: intent ? false : true,
        useDecay: true,
        // minState omitted — memoryState column not yet in schema
    });
    return {
        strategy: 'focused',
        mode: 'focused',
        intent: intent,
        ...result
    };
}
async function executeResumeStrategy(input, intent, options) {
    const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
    const result = await handleMemorySearch({
        query: input || 'resume work continue session',
        specFolder: options.specFolder,
        folderBoost: options.folderBoost,
        tenantId: options.tenantId,
        userId: options.userId,
        agentId: options.agentId,
        sharedSpaceId: options.sharedSpaceId,
        limit: options.limit || 5,
        includeConstitutional: false,
        includeContent: true,
        includeTrace: options.includeTrace || false, // CHK-040
        anchors: resumeAnchors,
        sessionId: options.sessionId,
        sessionTransition: options.sessionTransition,
        enableDedup: false,
        profile: options.profile,
        intent: intent ?? undefined,
        autoDetectIntent: intent ? false : true,
        useDecay: false,
        // minState omitted — memoryState column not yet in schema
    });
    return {
        strategy: 'resume',
        mode: 'resume',
        resumeAnchors: resumeAnchors,
        ...result
    };
}
/* ───────────────────────────────────────────────────────────────
   6. HANDLER HELPERS
──────────────────────────────────────────────────────────────── */
function resolveSessionLifecycle(args, db) {
    void db;
    // Security: session scope derived from server context, not caller input
    const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
        tenantId: args.tenantId,
        userId: args.userId,
        agentId: args.agentId,
    });
    if (trustedSession.error) {
        return {
            requestedSessionId: trustedSession.requestedSessionId,
            effectiveSessionId: '',
            resumed: false,
            priorMode: null,
            counter: 0,
            error: trustedSession.error,
        };
    }
    const requestedSessionId = trustedSession.requestedSessionId;
    const effectiveSessionId = trustedSession.effectiveSessionId;
    const resumed = trustedSession.trusted;
    const priorMode = resumed
        ? workingMemory.getSessionInferredMode(effectiveSessionId)
        : null;
    const counter = resumed
        ? workingMemory.getSessionEventCounter(effectiveSessionId)
        : 0;
    return {
        requestedSessionId,
        effectiveSessionId,
        resumed,
        priorMode,
        counter,
    };
}
function resolveEffectiveMode(args, session, pressurePolicy) {
    const requestedMode = args.mode ?? 'auto';
    const explicitIntent = args.intent;
    const normalizedInput = args.input.trim();
    let effectiveMode = requestedMode;
    let detectedIntent = explicitIntent;
    let intentConfidence = explicitIntent ? 1.0 : 0;
    let pressureOverrideTargetMode = null;
    let pressureOverrideApplied = false;
    let pressureWarning = null;
    let resumeHeuristicApplied = false;
    if (!detectedIntent && requestedMode !== 'quick') {
        const classification = intentClassifier.classifyIntent(normalizedInput);
        detectedIntent = classification.intent;
        intentConfidence = classification.confidence;
    }
    if (requestedMode === 'auto') {
        effectiveMode = INTENT_TO_MODE[detectedIntent] || 'focused';
        if (normalizedInput.length < 50 || /^(what|how|where|when|why)\s/i.test(normalizedInput)) {
            effectiveMode = 'focused';
        }
        const hasResumeKeywords = /\b(resume|continue|pick up|where was i|what(?:'s| is) next)\b/i.test(normalizedInput);
        const hasResumeContext = session.resumed ||
            session.priorMode === 'resume' ||
            (Boolean(args.specFolder) &&
                normalizedInput.length <= 120 &&
                /\b(next(?:\s+steps?)?|status|state|blockers|where\b|left off|what changed)\b/i.test(normalizedInput));
        if (hasResumeKeywords || hasResumeContext) {
            effectiveMode = 'resume';
            resumeHeuristicApplied = true;
        }
        const prePressureMode = effectiveMode;
        if (pressurePolicy.level === 'quick') {
            pressureOverrideTargetMode = 'quick';
        }
        else if (pressurePolicy.level === 'focused') {
            pressureOverrideTargetMode = 'focused';
        }
        if (pressureOverrideTargetMode) {
            effectiveMode = pressureOverrideTargetMode;
            pressureOverrideApplied = prePressureMode !== pressureOverrideTargetMode;
            if (pressureOverrideApplied) {
                pressureWarning = `Pressure policy override applied: ${pressurePolicy.level} pressure (${pressurePolicy.ratio}) forced mode ${pressureOverrideTargetMode} from ${prePressureMode}.`;
            }
        }
    }
    if (!CONTEXT_MODES[effectiveMode]) {
        effectiveMode = 'focused';
    }
    return {
        effectiveMode,
        pressureOverrideApplied,
        pressureOverrideTargetMode,
        pressureWarning,
        intentClassification: {
            detectedIntent,
            intentConfidence,
            resumeHeuristicApplied,
            source: explicitIntent ? 'explicit' : 'auto-detected',
        },
    };
}
function maybeDiscoverSpecFolder(options, args) {
    if (args.specFolder || !isFolderDiscoveryEnabled()) {
        return undefined;
    }
    try {
        const basePaths = getSpecsBasePaths();
        const discoveredFolder = discoverSpecFolder(args.input.trim(), basePaths) || undefined;
        if (discoveredFolder) {
            options.folderBoost = {
                folder: discoveredFolder,
                factor: parseFloat(process.env.SPECKIT_FOLDER_BOOST_FACTOR || '1.3'),
            };
        }
        return discoveredFolder;
    }
    catch (error) {
        console.error('[memory-context] folder discovery failed (non-critical):', error instanceof Error ? error.message : String(error));
        return undefined;
    }
}
async function executeStrategy(effectiveMode, options, args) {
    const normalizedInput = args.input.trim();
    switch (effectiveMode) {
        case 'quick':
            return executeQuickStrategy(normalizedInput, options);
        case 'deep':
            return executeDeepStrategy(normalizedInput, args.intent || null, options);
        case 'resume':
            return executeResumeStrategy(normalizedInput, args.intent || null, options);
        case 'focused':
        default:
            return executeFocusedStrategy(normalizedInput, args.intent || null, options);
    }
}
function buildResponseMeta(params) {
    const { effectiveMode, requestedMode, tracedResult, pressurePolicy, pressureOverrideApplied, pressureOverrideTargetMode, pressureWarning, sessionLifecycle, effectiveBudget, enforcement, intentClassification, discoveredFolder, includeTrace, sessionTransition, } = params;
    const { detectedIntent, intentConfidence, source } = intentClassification;
    const telemetryMeta = retrievalTelemetry.isExtendedTelemetryEnabled()
        ? (() => {
            try {
                const t = retrievalTelemetry.createTelemetry();
                retrievalTelemetry.recordMode(t, effectiveMode, pressureOverrideApplied, pressurePolicy.level, pressurePolicy.ratio ?? undefined);
                if (effectiveMode !== requestedMode && pressureOverrideApplied) {
                    retrievalTelemetry.recordFallback(t, `pressure override: ${requestedMode} -> ${effectiveMode}`);
                }
                retrievalTelemetry.recordTransitionDiagnostics(t, includeTrace === true ? sessionTransition : undefined);
                return { _telemetry: retrievalTelemetry.toJSON(t) };
            }
            catch (error) {
                void error;
                // Telemetry must never crash the handler
                return {};
            }
        })()
        : {};
    return {
        layer: 'L1:Orchestration',
        mode: effectiveMode,
        requestedMode,
        strategy: tracedResult.strategy,
        tokenUsageSource: pressurePolicy.source,
        tokenUsagePressure: pressurePolicy.ratio,
        pressureLevel: pressurePolicy.level,
        pressure_level: pressurePolicy.level,
        pressurePolicy: {
            applied: pressureOverrideApplied,
            overrideMode: pressureOverrideApplied ? pressureOverrideTargetMode : null,
            warning: pressureWarning,
        },
        sessionLifecycle,
        tokenBudget: effectiveBudget,
        tokenBudgetEnforcement: enforcement,
        intent: detectedIntent ? {
            type: detectedIntent,
            confidence: intentConfidence,
            source,
        } : null,
        folderDiscovery: discoveredFolder ? {
            discovered: true,
            specFolder: discoveredFolder,
            source: 'folder-discovery',
        } : null,
        ...telemetryMeta,
    };
}
/* ───────────────────────────────────────────────────────────────
   7. MAIN HANDLER
──────────────────────────────────────────────────────────────── */
/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
 * @param args - Context retrieval arguments (intent, mode, specFolder, anchors, etc.)
 * @returns MCP response with context-aware memory results
 */
async function handleMemoryContext(args) {
    const _contextStartTime = Date.now();
    const requestId = randomUUID();
    try {
        try {
            await checkDatabaseUpdated();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return createMCPErrorResponse({
                tool: 'memory_context',
                error: `Database state check failed: ${message}`,
                code: 'E_INTERNAL',
                details: { requestId, layer: 'L1:Orchestration' },
                recovery: {
                    hint: 'The memory database may be unavailable. Retry or check database connectivity.',
                },
            });
        }
        const { input, mode: requested_mode = 'auto', intent: explicit_intent, specFolder: spec_folder, limit, enableDedup: enableDedup = true, includeContent: include_content = false, tokenUsage, anchors } = args;
        // Validate input
        if (!input || typeof input !== 'string' || input.trim().length === 0) {
            return createMCPErrorResponse({
                tool: 'memory_context',
                error: 'Input is required and must be a non-empty string',
                code: 'E_VALIDATION',
                details: { requestId, layer: 'L1:Orchestration' },
                recovery: {
                    hint: 'Provide a query, prompt, or context description'
                }
            });
        }
        const normalizedInput = input.trim();
        // ── Phase 020: Query-Intent Routing ──────────────────────────
        // Classify query intent and optionally augment response with code
        // graph context for structural/hybrid queries. Entire block is
        // wrapped in try/catch — any failure silently falls through to
        // existing semantic logic.
        let queryIntentMetadata = null;
        let graphContextResult = null;
        if (requested_mode !== 'resume') {
            try {
                const classification = classifyQueryIntent(normalizedInput);
                queryIntentMetadata = {
                    queryIntent: classification.intent,
                    routedBackend: classification.intent === 'structural' && classification.confidence > 0.65
                        ? 'structural'
                        : classification.intent === 'hybrid'
                            ? 'hybrid'
                            : 'semantic',
                    confidence: classification.confidence,
                    matchedKeywords: classification.matchedKeywords,
                };
                // F050: Extract a symbol-like token from the query instead of passing
                // raw prose to buildContext({ subject }). resolveSubjectToRef() matches
                // against code_nodes.name / fq_name, so prose never resolves.
                // Heuristic: pick the first token that looks like a code identifier
                // (contains uppercase, underscore, or dot — e.g. "buildContext", "fq_name",
                // "code-graph-db.ts"). Falls back to first matched keyword, then normalizedInput.
                const codeIdentifierPattern = /[A-Z_.]|^[a-z]+[A-Z]/;
                const inputTokens = normalizedInput.split(/\s+/).filter(t => t.length >= 2);
                const extractedSubject = inputTokens.find(t => codeIdentifierPattern.test(t)) ??
                    (classification.matchedKeywords?.[0]) ??
                    normalizedInput;
                if (classification.intent === 'structural' && classification.confidence > 0.65) {
                    try {
                        const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
                        if (cgResult.metadata.totalNodes > 0) {
                            graphContextResult = {
                                graphContext: cgResult.graphContext,
                                textBrief: cgResult.textBrief,
                                combinedSummary: cgResult.combinedSummary,
                                nextActions: cgResult.nextActions,
                                metadata: cgResult.metadata,
                            };
                        }
                    }
                    catch {
                        // Code graph unavailable — fall through to semantic
                    }
                }
                else if (classification.intent === 'hybrid') {
                    try {
                        const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
                        if (cgResult.metadata.totalNodes > 0) {
                            graphContextResult = {
                                graphContext: cgResult.graphContext,
                                textBrief: cgResult.textBrief,
                                combinedSummary: cgResult.combinedSummary,
                                nextActions: cgResult.nextActions,
                                metadata: cgResult.metadata,
                            };
                        }
                    }
                    catch {
                        // Code graph unavailable — hybrid degrades to semantic-only
                    }
                }
                // 'semantic' or low-confidence: no graph context, fall through
            }
            catch {
                // Classification failed — fall through to existing logic entirely
            }
        }
        // Eval logger — capture context query at entry (fail-safe)
        let _evalQueryId = 0;
        let _evalRunId = 0;
        try {
            const evalEntry = logSearchQuery({
                query: normalizedInput,
                intent: explicit_intent ?? null,
                specFolder: spec_folder ?? null,
            });
            _evalQueryId = evalEntry.queryId;
            _evalRunId = evalEntry.evalRunId;
        }
        catch {
            // Intentional no-op — error deliberately discarded
        }
        const { requestedSessionId, effectiveSessionId, resumed: resumedSession, priorMode: previousState, counter: eventCounterStart, error: sessionScopeError, } = resolveSessionLifecycle(args, null);
        if (sessionScopeError) {
            return createMCPErrorResponse({
                tool: 'memory_context',
                error: sessionScopeError,
                code: 'E_SESSION_SCOPE',
                details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
                recovery: {
                    hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
                },
            });
        }
        const sessionLifecycle = {
            sessionScope: requestedSessionId ? 'caller' : 'ephemeral',
            requestedSessionId,
            effectiveSessionId,
            resumed: resumedSession,
            eventCounterStart,
            resumedContextCount: 0,
        };
        // Get layer info for response metadata
        const layerInfo = layerDefs.getLayerInfo('memory_context');
        const tokenBudget = layerInfo?.tokenBudget ?? 2000;
        const runtimeContextStats = {
            tokenBudget,
        };
        try {
            runtimeContextStats.tokenCount = estimateTokens(normalizedInput);
        }
        catch {
            runtimeContextStats.tokenCount = undefined;
        }
        // Resolve token pressure (caller -> estimator -> unavailable)
        const pressurePolicyEnabled = isPressurePolicyEnabled(effectiveSessionId);
        const autoResumeEnabled = isAutoResumeEnabled(effectiveSessionId);
        const pressurePolicy = pressurePolicyEnabled
            ? getPressureLevel(tokenUsage, runtimeContextStats)
            : {
                level: 'none',
                ratio: null,
                source: 'unavailable',
                warning: null,
            };
        if (pressurePolicy.warning) {
            console.warn(pressurePolicy.warning);
        }
        // Build options object for strategy executors
        const options = {
            specFolder: spec_folder,
            tenantId: args.tenantId,
            userId: args.userId,
            agentId: args.agentId,
            sharedSpaceId: args.sharedSpaceId,
            limit,
            sessionId: effectiveSessionId,
            enableDedup: enableDedup,
            includeContent: include_content,
            includeTrace: args.includeTrace === true, // CHK-040
            anchors,
            profile: args.profile,
        };
        const { effectiveMode, pressureOverrideApplied, pressureOverrideTargetMode, pressureWarning, intentClassification, } = resolveEffectiveMode({ ...args, input: normalizedInput }, {
            requestedSessionId,
            effectiveSessionId,
            resumed: resumedSession,
            priorMode: previousState,
            counter: eventCounterStart,
        }, pressurePolicy);
        const { detectedIntent, intentConfidence, resumeHeuristicApplied, source: intentSource, } = intentClassification;
        // Phase C: Intent-to-profile auto-routing for memory_context.
        // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
        // Skip for 'quick' mode: quick routes through handleMemoryMatchTriggers which does not
        // support profile formatting — setting a profile there would be a no-op.
        if (!options.profile && detectedIntent && effectiveMode !== 'quick' && isIntentAutoProfileEnabled()) {
            try {
                const autoProfile = intentClassifier.getProfileForIntent(detectedIntent);
                if (autoProfile) {
                    options.profile = autoProfile;
                    console.error(`[memory-context] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
                }
            }
            catch (_autoProfileErr) {
                // Auto-profile is best-effort — never breaks context retrieval
            }
        }
        const sessionTransition = buildSessionTransitionTrace({
            previousState,
            resumedSession,
            effectiveMode,
            requestedMode: requested_mode,
            detectedIntent: detectedIntent ?? null,
            pressureOverrideApplied,
            queryHeuristicApplied: resumeHeuristicApplied,
        });
        options.sessionTransition = options.includeTrace === true ? sessionTransition : undefined;
        const discoveredFolder = maybeDiscoverSpecFolder(options, { ...args, input: normalizedInput });
        // FIX P0: Folder discovery sets options.folderBoost for scoring only.
        // Do NOT propagate as options.specFolder — that becomes an exact-match filter
        // in vector-index-queries.ts (m.spec_folder = ?) which silently drops all
        // results when the discovered path has no indexed memories.
        const sessionStateResult = sessionManager.saveSessionState(effectiveSessionId, {
            specFolder: options.specFolder ?? discoveredFolder ?? spec_folder,
            tenantId: args.tenantId,
            userId: args.userId,
            agentId: args.agentId,
            currentTask: normalizedInput.slice(0, 500),
        });
        if (!sessionStateResult.success) {
            console.warn(`[memory-context] Failed to persist session identity for ${effectiveSessionId}: ${sessionStateResult.error ?? 'unknown error'}`);
        }
        let result;
        try {
            result = await executeStrategy(effectiveMode, options, {
                ...args,
                input: normalizedInput,
                intent: detectedIntent,
            });
        }
        catch (error) {
            console.error(`[memory-context] Strategy execution failed [requestId=${requestId}]:`, toErrorMessage(error));
            return createMCPErrorResponse({
                tool: 'memory_context',
                error: toErrorMessage(error),
                code: 'E_STRATEGY',
                details: {
                    requestId,
                    layer: 'L1:Orchestration',
                    mode: effectiveMode,
                    alternativeLayers: layerDefs.getRecommendedLayers('search')
                },
                recovery: {
                    hint: 'Try a different mode or check your input'
                }
            });
        }
        const strategyError = extractStrategyError(result);
        if (strategyError) {
            return createMCPErrorResponse({
                tool: 'memory_context',
                error: strategyError.error,
                code: strategyError.code,
                details: {
                    requestId,
                    layer: 'L1:Orchestration',
                    mode: effectiveMode,
                    upstream: strategyError.details,
                },
                recovery: {
                    hint: strategyError.hints[0] ?? 'Try a different mode or check your input',
                    actions: strategyError.hints.slice(1),
                    severity: strategyError.severity ?? 'error',
                },
            });
        }
        // FIX RC1-A (superseded by P0 fix): Folder discovery no longer promotes to
        // options.specFolder, so the recovery retry is no longer needed. The folder
        // boost still applies via options.folderBoost for scoring prioritization.
        try {
            workingMemory.setSessionInferredMode(effectiveSessionId, effectiveMode);
        }
        catch (error) {
            void error;
            // Best-effort session state write — do not fail the handler
        }
        // T205: Determine effective token budget from mode or layer definitions
        const modeTokenBudget = CONTEXT_MODES[effectiveMode]?.tokenBudget;
        const effectiveBudget = modeTokenBudget || tokenBudget;
        // M1 FIX: Inject auto-resume context BEFORE budget enforcement
        // so the final response respects the advertised token budget.
        const tracedResult0 = effectiveMode === 'quick' && options.includeTrace === true
            ? attachSessionTransitionTrace(result, sessionTransition)
            : result;
        if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
            const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
            if (resumeContextItems.length > 0) {
                sessionLifecycle.resumedContextCount = resumeContextItems.length;
                tracedResult0.systemPromptContext = resumeContextItems.map((item) => ({
                    memoryId: item.memoryId,
                    title: item.title,
                    filePath: item.filePath,
                    attentionScore: item.attentionScore,
                }));
                tracedResult0.systemPromptContextInjected = true;
            }
        }
        // T205: Enforce token budget AFTER all context injection
        const { result: budgetedResult, enforcement } = enforceTokenBudget(tracedResult0, effectiveBudget);
        const tracedResult = budgetedResult;
        // Phase 020: Attach graph context and query-intent routing metadata
        const responseData = { ...tracedResult };
        if (graphContextResult) {
            responseData.graphContext = graphContextResult;
        }
        if (queryIntentMetadata) {
            responseData.queryIntentRouting = queryIntentMetadata;
        }
        // Build response with layer metadata
        const _contextResponse = createMCPResponse({
            tool: 'memory_context',
            summary: enforcement.truncated
                ? `Context retrieved via ${effectiveMode} mode (${tracedResult.strategy} strategy) [truncated${enforcement.originalResultCount !== undefined ? `: ${enforcement.originalResultCount} → ${enforcement.returnedResultCount} results` : ''} to fit ${effectiveBudget} token budget]`
                : `Context retrieved via ${effectiveMode} mode (${tracedResult.strategy} strategy)`,
            data: responseData,
            hints: [
                `Mode: ${CONTEXT_MODES[effectiveMode].description}`,
                `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
                `Token budget: ${effectiveBudget} (${effectiveMode} mode)`,
                ...(pressureWarning ? [pressureWarning] : [])
            ],
            extraMeta: buildResponseMeta({
                effectiveMode,
                requestedMode: requested_mode,
                tracedResult,
                pressurePolicy,
                pressureOverrideApplied,
                pressureOverrideTargetMode,
                pressureWarning,
                sessionLifecycle,
                effectiveBudget,
                enforcement,
                intentClassification: {
                    detectedIntent,
                    intentConfidence,
                    resumeHeuristicApplied,
                    source: intentSource,
                },
                discoveredFolder,
                includeTrace: options.includeTrace === true,
                sessionTransition,
            })
        });
        // Consumption instrumentation — log context event (fail-safe, never throws)
        try {
            const db = vectorIndex.getDb();
            if (db) {
                initConsumptionLog(db);
                let resultIds = [];
                let resultCount = 0;
                try {
                    if (_contextResponse?.content?.[0]?.text) {
                        const innerResults = extractResultRowsFromContextResponse(_contextResponse.content[0].text);
                        resultIds = innerResults.map(r => r.id).filter(id => typeof id === 'number');
                        resultCount = innerResults.length;
                    }
                }
                catch {
                    // Intentional no-op — error deliberately discarded
                }
                logConsumptionEvent(db, {
                    event_type: 'context',
                    query_text: normalizedInput,
                    intent: detectedIntent ?? null,
                    mode: effectiveMode,
                    result_count: resultCount,
                    result_ids: resultIds,
                    session_id: effectiveSessionId,
                    latency_ms: Date.now() - _contextStartTime,
                    spec_folder_filter: spec_folder ?? null,
                });
            }
        }
        catch {
            // Intentional no-op — error deliberately discarded
        }
        // Eval logger — capture final context results at exit (fail-safe)
        try {
            if (_evalRunId && _evalQueryId) {
                let finalMemoryIds = [];
                let finalScores = [];
                try {
                    if (_contextResponse?.content?.[0]?.text) {
                        const innerResults = extractResultRowsFromContextResponse(_contextResponse.content[0].text);
                        finalMemoryIds = innerResults.map(r => (r.id ?? r.memoryId)).filter(id => typeof id === 'number');
                        finalScores = innerResults.map(r => (r.score ?? r.similarity ?? 0));
                    }
                }
                catch {
                    // Intentional no-op — error deliberately discarded
                }
                logFinalResult({
                    evalRunId: _evalRunId,
                    queryId: _evalQueryId,
                    resultMemoryIds: finalMemoryIds,
                    scores: finalScores,
                    fusionMethod: effectiveMode,
                    latencyMs: Date.now() - _contextStartTime,
                });
                const strategy = typeof budgetedResult?.strategy === 'string' && budgetedResult.strategy.length > 0
                    ? budgetedResult.strategy
                    : effectiveMode;
                logChannelResult({
                    evalRunId: _evalRunId,
                    queryId: _evalQueryId,
                    channel: `context_${strategy}`,
                    resultMemoryIds: finalMemoryIds,
                    scores: finalScores,
                    hitCount: finalMemoryIds.length,
                    latencyMs: Date.now() - _contextStartTime,
                });
            }
        }
        catch {
            // Intentional no-op — error deliberately discarded
        }
        return _contextResponse;
    }
    catch (error) {
        console.error(`[memory-context] Unexpected failure [requestId=${requestId}]:`, error);
        return createMCPErrorResponse({
            tool: 'memory_context',
            error: 'memory_context failed due to an internal error',
            code: 'E_INTERNAL',
            details: { requestId, layer: 'L1:Orchestration' },
            recovery: {
                hint: 'Retry the request. If the problem persists, inspect stderr logs for the full error details.',
            },
        });
    }
}
/* ───────────────────────────────────────────────────────────────
   7. EXPORTS
──────────────────────────────────────────────────────────────── */
export { handleMemoryContext, CONTEXT_MODES, INTENT_TO_MODE, enforceTokenBudget, };
// Backward-compatible aliases (snake_case)
const handle_memory_context = handleMemoryContext;
export { handle_memory_context, };
//# sourceMappingURL=memory-context.js.map