// ---------------------------------------------------------------
// MODULE: Memory Context
// ---------------------------------------------------------------

import { randomUUID } from 'crypto';

// Layer definitions
import * as layerDefs from '../lib/architecture/layer-definitions';
import { checkDatabaseUpdated } from '../core';
import { toErrorMessage } from '../utils';

// Intent classifier
import * as intentClassifier from '../lib/search/intent-classifier';

// Core handlers for routing
import { handleMemorySearch } from './memory-search';
import { handleMemoryMatchTriggers } from './memory-triggers';

// Response envelope
import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope';

// Token estimation
import { estimateTokens } from '../formatters/token-metrics';
import {
  getPressureLevel,
  type RuntimeContextStats,
} from '../lib/cache/cognitive/pressure-monitor';
import * as workingMemory from '../lib/cache/cognitive/working-memory';
import { isIdentityInRollout } from '../lib/cache/cognitive/rollout-policy';

// Telemetry
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger';

// AI-TRACE: T005: Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger';
import * as vectorIndex from '../lib/search/vector-index';

// Shared handler types
import type { MCPResponse, IntentClassification } from './types';

// PI-B3: Folder discovery integration
import { discoverSpecFolder, getSpecsBasePaths } from '../lib/search/folder-discovery';
import { isFolderDiscoveryEnabled } from '../lib/search/search-flags';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

interface ContextMode {
  readonly name: string;
  readonly description: string;
  readonly strategy: string;
  readonly tokenBudget?: number;
}

interface ContextOptions {
  specFolder?: string;
  limit?: number;
  sessionId?: string;
  enableDedup?: boolean;
  includeContent?: boolean;
  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
  anchors?: string[];
}

interface SessionLifecycleMetadata {
  sessionScope: 'caller' | 'ephemeral';
  requestedSessionId: string | null;
  effectiveSessionId: string;
  resumed: boolean;
  eventCounterStart: number;
  resumedContextCount: number;
}

interface ContextResult extends Record<string, unknown> {
  strategy: string;
  mode: string;
}

interface LayerInfo {
  tokenBudget?: number;
}

interface ContextArgs {
  input: string;
  mode?: string;
  intent?: string;
  specFolder?: string;
  limit?: number;
  sessionId?: string;
  enableDedup?: boolean;
  includeContent?: boolean;
  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
  tokenUsage?: number;
  anchors?: string[];
}

/** T205: Token budget enforcement metadata */
interface TokenBudgetEnforcement {
  budgetTokens: number;
  actualTokens: number;
  enforced: boolean;
  truncated: boolean;
  originalResultCount?: number;
  returnedResultCount?: number;
}

function extractResultRowsFromContextResponse(responseText: string): Array<Record<string, unknown>> {
  try {
    const parsed = JSON.parse(responseText) as Record<string, unknown>;
    const outerData = parsed?.data as Record<string, unknown> | undefined;

    const directRows = Array.isArray(outerData?.results)
      ? outerData.results as Array<Record<string, unknown>>
      : null;
    if (directRows) {
      return directRows;
    }

    const nestedContent = Array.isArray(outerData?.content)
      ? outerData.content as Array<{ type?: string; text?: string }>
      : [];
    const nestedText = nestedContent[0]?.text;
    if (typeof nestedText !== 'string' || nestedText.length === 0) {
      return [];
    }

    const nestedEnvelope = JSON.parse(nestedText) as Record<string, unknown>;
    const nestedData = nestedEnvelope?.data as Record<string, unknown> | undefined;
    return Array.isArray(nestedData?.results)
      ? nestedData.results as Array<Record<string, unknown>>
      : [];
  } catch {
    return [];
  }
}

/* ---------------------------------------------------------------
   2. TOKEN BUDGET ENFORCEMENT (T205)
   
   Enforces per-layer/per-mode token budgets by estimating the
   token count of strategy results and truncating when exceeded.
   Uses character-based estimation: 1 token ≈ 4 chars.
--------------------------------------------------------------- */

/**
 * T205: Enforce token budget on strategy results.
 * 
 * Estimates the token count of the serialized result. If over budget,
 * parses embedded result arrays and removes lowest-priority items
 * until within budget. Higher-scored results are preserved.
 */
function enforceTokenBudget(result: ContextResult, budgetTokens: number): { result: ContextResult; enforcement: TokenBudgetEnforcement } {
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
  let originalResultCount: number | undefined;
  let returnedResultCount: number | undefined;

  const fallbackToCharacterBudget = (baseResult: ContextResult): ContextResult => {
    const fallbackResult = { ...baseResult } as ContextResult;
    const fallbackContent = (fallbackResult as Record<string, unknown>).content;

    if (Array.isArray(fallbackContent) && fallbackContent.length > 0) {
      const firstEntry = fallbackContent[0] as Record<string, unknown> | undefined;
      const originalText = typeof firstEntry?.text === 'string' ? firstEntry.text : null;

      if (originalText !== null) {
        const contentClone = fallbackContent.map((entry) => ({ ...(entry as Record<string, unknown>) }));
        let bestText = '';
        let low = 0;
        let high = originalText.length;

        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          const candidateText = originalText.slice(0, mid);
          contentClone[0] = { ...contentClone[0], text: candidateText };
          (fallbackResult as Record<string, unknown>).content = contentClone;

          const candidateTokens = estimateTokens(JSON.stringify(fallbackResult));
          if (candidateTokens <= budgetTokens) {
            bestText = candidateText;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }

        contentClone[0] = { ...contentClone[0], text: bestText };
        (fallbackResult as Record<string, unknown>).content = contentClone;
      }
    }

    return fallbackResult;
  };

  const compactStructuredResult = (
    innerEnvelope: Record<string, unknown>,
    currentResults: Array<Record<string, unknown>>,
    contentEntries: Array<{ type: string; text: string }>,
  ): { result: ContextResult; actualTokens: number } | null => {
    const truncateKeys = ['content', 'snippet', 'summary', 'text'] as const;
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

      let bestResult: ContextResult | null = null;
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
          ...((innerEnvelope.data as Record<string, unknown>) ?? {}),
          results: candidateResults,
          count: candidateResults.length,
        };

        const candidateContent = contentEntries.map((entry, index) => (
          index === 0 ? { type: entry.type, text: JSON.stringify(innerEnvelope) } : { ...entry }
        ));
        const candidateResult = {
          ...truncatedResult,
          content: candidateContent,
        } as ContextResult;
        const candidateTokens = estimateTokens(JSON.stringify(candidateResult));

        if (candidateTokens <= budgetTokens) {
          bestResult = candidateResult;
          bestTokens = candidateTokens;
          low = mid + 1;
        } else {
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
  const contentArr = (truncatedResult as Record<string, unknown>).content as Array<{ type: string; text: string }> | undefined;
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

        while (currentResults.length > 1 && currentTokens > budgetTokens) {
          // Remove the last (lowest-scored) result
          const removed = currentResults.pop();
          const removedTokens = estimateTokens(JSON.stringify(removed));
          currentTokens -= removedTokens;
        }

        // Update the inner envelope
        innerEnvelope.data.results = currentResults;
        innerEnvelope.data.count = currentResults.length;
        returnedResultCount = currentResults.length;

        // Re-serialize
        contentArr[0] = { type: 'text', text: JSON.stringify(innerEnvelope) };
        (truncatedResult as Record<string, unknown>).content = contentArr;

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
    } catch {
      parseFailed = true;
      // JSON parse failed — fall through to character-level truncation
    }
  }

  // AI-WHY: Fallback when parsing fails or a structured response still exceeds budget
  // after result-array truncation. Character-level binary search guarantees the
  // returned payload is as large as possible while respecting the budget.
  const fallbackResult = parseFailed
    ? fallbackToCharacterBudget(result)
    : fallbackToCharacterBudget(truncatedResult);

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


/* ---------------------------------------------------------------
   3. CONTEXT MODE DEFINITIONS
--------------------------------------------------------------- */

const CONTEXT_MODES: Record<string, ContextMode> = {
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
    tokenBudget: 2000
  },

  // Focused: Intent-specific search with optimized weights
  focused: {
    name: 'Focused',
    description: 'Intent-aware search with task-specific optimization',
    strategy: 'intent-search',
    tokenBudget: 1500
  },

  // Resume: Session recovery mode
  resume: {
    name: 'Resume',
    description: 'Resume previous work with state and next-steps anchors',
    strategy: 'resume',
    tokenBudget: 1200
  }
};

/* ---------------------------------------------------------------
   4. INTENT-TO-MODE ROUTING
--------------------------------------------------------------- */

const INTENT_TO_MODE: Record<string, string> = {
  add_feature: 'deep',
  fix_bug: 'focused',
  refactor: 'deep',
  security_audit: 'deep',
  understand: 'focused',
  find_spec: 'deep',
  find_decision: 'focused'
};

/* ---------------------------------------------------------------
   5. CONTEXT STRATEGY EXECUTORS
--------------------------------------------------------------- */

async function executeQuickStrategy(input: string, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemoryMatchTriggers({
    prompt: input,
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

async function executeDeepStrategy(input: string, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemorySearch({
    query: input,
    specFolder: options.specFolder,
    limit: options.limit || 10,
    includeConstitutional: true,
    includeContent: options.includeContent || false,
    includeTrace: options.includeTrace || false, // CHK-040
    anchors: options.anchors,
    sessionId: options.sessionId,
    enableDedup: options.enableDedup !== false,
    useDecay: true,
    minState: 'COLD'
  });

  return {
    strategy: 'deep',
    mode: 'deep',
    ...result
  };
}

async function executeFocusedStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemorySearch({
    query: input,
    specFolder: options.specFolder,
    limit: options.limit || 8,
    includeConstitutional: true,
    includeContent: options.includeContent || false,
    includeTrace: options.includeTrace || false, // CHK-040
    anchors: options.anchors,
    sessionId: options.sessionId,
    enableDedup: options.enableDedup !== false,
    intent: intent ?? undefined,
    autoDetectIntent: false,
    useDecay: true,
    minState: 'WARM'
  });

  return {
    strategy: 'focused',
    mode: 'focused',
    intent: intent,
    ...result
  };
}

async function executeResumeStrategy(input: string, options: ContextOptions): Promise<ContextResult> {
  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];

  const result = await handleMemorySearch({
    query: input || 'resume work continue session',
    specFolder: options.specFolder,
    limit: options.limit || 5,
    includeConstitutional: false,
    includeContent: true,
    includeTrace: options.includeTrace || false, // CHK-040
    anchors: resumeAnchors,
    sessionId: options.sessionId,
    enableDedup: false,
    useDecay: false,
    minState: 'WARM'
  });

  return {
    strategy: 'resume',
    mode: 'resume',
    resumeAnchors: resumeAnchors,
    ...result
  };
}

/* ---------------------------------------------------------------
   6. MAIN HANDLER
--------------------------------------------------------------- */

/** Handle memory_context tool - L1 orchestration layer that routes to optimal retrieval strategy */
async function handleMemoryContext(args: ContextArgs): Promise<MCPResponse> {
  const _contextStartTime = Date.now();
  await checkDatabaseUpdated();
  const {
    input,
    mode: requested_mode = 'auto',
    intent: explicit_intent,
    specFolder: spec_folder,
    limit,
    sessionId: session_id,
    enableDedup: enableDedup = true,
    includeContent: include_content = false,
    tokenUsage,
    anchors
  } = args;

  // A7-P2-1: Generate requestId for incident correlation in error responses
  const requestId = randomUUID();

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

  // AI-TRACE: T005: Eval logger — capture context query at entry (fail-safe)
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
  } catch {
    // AI-WHY: Intentional no-op — error deliberately discarded
  }

  const requestedSessionId = typeof session_id === 'string' && session_id.trim().length > 0
    ? session_id.trim()
    : null;
  const resumedSession = requestedSessionId ? workingMemory.sessionExists(requestedSessionId) : false;
  const effectiveSessionId = requestedSessionId ?? randomUUID();
  const eventCounterStart = resumedSession && requestedSessionId
    ? workingMemory.getSessionEventCounter(requestedSessionId)
    : 0;
  const sessionLifecycle: SessionLifecycleMetadata = {
    sessionScope: requestedSessionId ? 'caller' : 'ephemeral',
    requestedSessionId,
    effectiveSessionId,
    resumed: resumedSession,
    eventCounterStart,
    resumedContextCount: 0,
  };

  // Get layer info for response metadata
  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
  const tokenBudget = layerInfo?.tokenBudget ?? 2000;

  const runtimeContextStats: RuntimeContextStats = {
    tokenBudget,
  };
  try {
    runtimeContextStats.tokenCount = estimateTokens(normalizedInput);
  } catch {
    runtimeContextStats.tokenCount = undefined;
  }

  // Resolve token pressure (caller -> estimator -> unavailable)
  const rolloutEnabled = process.env.SPECKIT_ROLLOUT_PERCENT
    ? isIdentityInRollout(effectiveSessionId)
    : true;
  const pressurePolicyEnabled = process.env.SPECKIT_PRESSURE_POLICY !== 'false' && rolloutEnabled;
  const autoResumeEnabled = process.env.SPECKIT_AUTO_RESUME !== 'false' && rolloutEnabled;

  const pressurePolicy = pressurePolicyEnabled
    ? getPressureLevel(tokenUsage, runtimeContextStats)
    : {
        level: 'none' as const,
        ratio: null,
        source: 'unavailable' as const,
        warning: null,
      };
  if (pressurePolicy.warning) {
    console.warn(pressurePolicy.warning);
  }

  // Build options object for strategy executors
  const options: ContextOptions = {
    specFolder: spec_folder,
    limit,
    sessionId: effectiveSessionId,
    enableDedup: enableDedup,
    includeContent: include_content,
    includeTrace: (args as unknown as Record<string, unknown>).includeTrace === true, // CHK-040
    anchors
  };

  // Determine effective mode
  let effectiveMode = requested_mode;
  let detectedIntent: string | undefined = explicit_intent;
  let intentConfidence = explicit_intent ? 1.0 : 0;

  let pressureOverrideTargetMode: 'quick' | 'focused' | null = null;
  let pressureOverrideApplied = false;
  let pressureWarning: string | null = null;

  // Handle auto mode: detect intent and select mode
  if (requested_mode === 'auto') {
    if (!detectedIntent) {
      const classification: IntentClassification = intentClassifier.classifyIntent(normalizedInput);
      detectedIntent = classification.intent;
      intentConfidence = classification.confidence;
    }

    effectiveMode = INTENT_TO_MODE[detectedIntent!] || 'focused';

    if (normalizedInput.length < 50 || /^(what|how|where|when|why)\s/i.test(normalizedInput)) {
      effectiveMode = 'focused';
    }

    if (/\b(resume|continue|pick up|where was i|what's next)\b/i.test(normalizedInput)) {
      effectiveMode = 'resume';
    }

    const prePressureMode = effectiveMode;
    if (pressurePolicy.level === 'quick') {
      pressureOverrideTargetMode = 'quick';
    } else if (pressurePolicy.level === 'focused') {
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

  // Validate mode
  if (!CONTEXT_MODES[effectiveMode]) {
    effectiveMode = 'focused';
  }

  // PI-B3: Automatic spec folder discovery when no folder is specified
  let discoveredFolder: string | null = null;
  if (!spec_folder && isFolderDiscoveryEnabled()) {
    try {
      const basePaths = getSpecsBasePaths();
      discoveredFolder = discoverSpecFolder(normalizedInput, basePaths);
      if (discoveredFolder) {
        options.specFolder = discoveredFolder;
      }
    } catch (err: unknown) {
      // AI-GUARD: CHK-PI-B3-004: never block context retrieval
      console.error('[memory-context] folder discovery failed (non-critical):',
        err instanceof Error ? err.message : String(err));
    }
  }

  // Execute the selected strategy
  let result: ContextResult;
  try {
    switch (effectiveMode) {
      case 'quick':
        result = await executeQuickStrategy(normalizedInput, options);
        break;

      case 'deep':
        result = await executeDeepStrategy(normalizedInput, options);
        break;

      case 'resume':
        result = await executeResumeStrategy(normalizedInput, options);
        break;

      case 'focused':
      default:
        result = await executeFocusedStrategy(normalizedInput, detectedIntent || null, options);
        break;
    }
  } catch (error: unknown) {
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

  // T205: Determine effective token budget from mode or layer definitions
  const modeTokenBudget = CONTEXT_MODES[effectiveMode]?.tokenBudget;
  const effectiveBudget = modeTokenBudget || tokenBudget;

  // T205: Enforce token budget on strategy results
  const { result: budgetedResult, enforcement } = enforceTokenBudget(result, effectiveBudget);

  if (autoResumeEnabled && effectiveMode === 'resume' && requestedSessionId) {
    const resumeContextItems = workingMemory.getSessionPromptContext(requestedSessionId, workingMemory.DECAY_FLOOR, 5);
    if (resumeContextItems.length > 0) {
      sessionLifecycle.resumedContextCount = resumeContextItems.length;
      (budgetedResult as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
        memoryId: item.memoryId,
        title: item.title,
        filePath: item.filePath,
        attentionScore: item.attentionScore,
      }));
      (budgetedResult as Record<string, unknown>).systemPromptContextInjected = true;
    }
  }

  // Build response with layer metadata
  const _contextResponse = createMCPResponse({
    tool: 'memory_context',
    summary: enforcement.truncated
      ? `Context retrieved via ${effectiveMode} mode (${budgetedResult.strategy} strategy) [truncated${enforcement.originalResultCount !== undefined ? `: ${enforcement.originalResultCount} → ${enforcement.returnedResultCount} results` : ''} to fit ${effectiveBudget} token budget]`
      : `Context retrieved via ${effectiveMode} mode (${budgetedResult.strategy} strategy)`,
    data: budgetedResult,
    hints: [
      `Mode: ${CONTEXT_MODES[effectiveMode].description}`,
      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
      `Token budget: ${effectiveBudget} (${effectiveMode} mode)`,
      ...(pressureWarning ? [pressureWarning] : [])
    ],
    extraMeta: {
      layer: 'L1:Orchestration',
      mode: effectiveMode,
      requestedMode: requested_mode,
      strategy: budgetedResult.strategy,
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
        source: explicit_intent ? 'explicit' : 'auto-detected'
      } : null,
      // PI-B3: Folder discovery observability
      folderDiscovery: discoveredFolder ? {
        discovered: true,
        specFolder: discoveredFolder,
        source: 'folder-discovery',
      } : null,
      // C136-12: Retrieval telemetry at L1 orchestration level
      ...(retrievalTelemetry.isExtendedTelemetryEnabled() ? (() => {
        const t = retrievalTelemetry.createTelemetry();
        retrievalTelemetry.recordMode(
          t,
          effectiveMode,
          pressureOverrideApplied,
          pressurePolicy.level,
          pressurePolicy.ratio ?? undefined,
        );
        if (effectiveMode !== requested_mode && pressureOverrideApplied) {
          retrievalTelemetry.recordFallback(t, `pressure override: ${requested_mode} -> ${effectiveMode}`);
        }
        return { _telemetry: retrievalTelemetry.toJSON(t) };
      })() : {}),
    }
  });

  // AI-TRACE: T004: Consumption instrumentation — log context event (fail-safe, never throws)
  try {
    const db = vectorIndex.getDb();
    if (db) {
      initConsumptionLog(db);
      let resultIds: number[] = [];
      let resultCount = 0;
      try {
        if (_contextResponse?.content?.[0]?.text) {
          const innerResults = extractResultRowsFromContextResponse(_contextResponse.content[0].text);
          resultIds = innerResults.map(r => r.id as number).filter(id => typeof id === 'number');
          resultCount = innerResults.length;
        }
      } catch {
        // AI-WHY: Intentional no-op — error deliberately discarded
      }
      logConsumptionEvent(db, {
        event_type: 'context',
        query_text: normalizedInput,
        intent: detectedIntent ?? null,
        mode: effectiveMode,
        result_count: resultCount,
        result_ids: resultIds,
        session_id: requestedSessionId,
        latency_ms: Date.now() - _contextStartTime,
        spec_folder_filter: spec_folder ?? null,
      });
    }
  } catch {
    // AI-WHY: Intentional no-op — error deliberately discarded
  }

  // AI-TRACE: T005: Eval logger — capture final context results at exit (fail-safe)
  try {
    if (_evalRunId && _evalQueryId) {
      let finalMemoryIds: number[] = [];
      let finalScores: number[] = [];
      try {
        if (_contextResponse?.content?.[0]?.text) {
          const innerResults = extractResultRowsFromContextResponse(_contextResponse.content[0].text);
          finalMemoryIds = innerResults.map(r => (r.id ?? r.memoryId) as number).filter(id => typeof id === 'number');
          finalScores = innerResults.map(r => (r.score ?? r.similarity ?? 0) as number);
        }
      } catch {
        // AI-WHY: Intentional no-op — error deliberately discarded
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
  } catch {
    // AI-WHY: Intentional no-op — error deliberately discarded
  }

  return _contextResponse;
}

/* ---------------------------------------------------------------
   7. EXPORTS
--------------------------------------------------------------- */

export {
  handleMemoryContext,
  CONTEXT_MODES,
  INTENT_TO_MODE,
  enforceTokenBudget,
};

// AI-WHY: Backward-compatible aliases (snake_case)
const handle_memory_context = handleMemoryContext;

export {
  handle_memory_context,
};
