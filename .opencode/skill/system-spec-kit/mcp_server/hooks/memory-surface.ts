// ───────────────────────────────────────────────────────────────
// MODULE: Memory Surface
// ───────────────────────────────────────────────────────────────
// Lib modules
import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
import { enrichWithRetrievalDirectives } from '../lib/search/retrieval-directives.js';
import * as graphDb from '../lib/code-graph/code-graph-db.js';
import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';
import { recordBootstrapEvent } from '../lib/session/context-metrics.js';
import * as workingMemory from '../lib/cognitive/working-memory.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';

import type { Database } from '@spec-kit/shared/types';
import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface ConstitutionalMemory {
  id: number;
  specFolder: string;
  filePath: string;
  title: string;
  importanceTier: string;
  /** PI-A4: LLM-consumable retrieval directive, e.g. "Always surface when: …" */
  retrieval_directive?: string;
}

interface AutoSurfaceResult {
  constitutional: ConstitutionalMemory[];
  triggered: {
    memory_id: number;
    spec_folder: string;
    title: string;
    matched_phrases: string[];
  }[];
  codeGraphStatus?: {
    status: 'ok' | 'error';
    data?: {
      totalFiles: number;
      totalNodes: number;
      totalEdges: number;
      staleFiles: number;
      lastScanAt: string | null;
      dbFileSize: number | null;
      schemaVersion: number;
      nodesByKind: Record<string, number>;
      edgesByType: Record<string, number>;
      parseHealth: Record<string, number>;
    };
    error?: string;
  };
  sessionPrimed?: boolean;
  primedTool?: string;
  /** T018: Structured Prime Package returned on first tool call */
  primePackage?: PrimePackage;
  surfaced_at: string;
  latencyMs: number;
}

/** T018: Structured session prime payload for non-hook CLI auto-priming */
interface PrimePackage {
  specFolder: string | null;
  currentTask: string | null;
  codeGraphStatus: 'fresh' | 'stale' | 'empty';
  cocoIndexAvailable: boolean;
  recommendedCalls: string[];
  /** Phase 027: Structural bootstrap contract for non-hook runtimes */
  structuralContext?: StructuralBootstrapContract;
  /** Phase 009 T041: Graph retrieval routing rules for AI session priming */
  routingRules?: {
    graphRetrieval: string;
    communitySearch: string;
    toolRouting: string;
  };
}

/* ───────────────────────────────────────────────────────────────
   2. MEMORY SURFACE HOOK CONFIGURATION
──────────────────────────────────────────────────────────────── */

const MEMORY_AWARE_TOOLS: Set<string> = new Set([
  'memory_context',
  'memory_search',
  'memory_quick_search',
  'memory_match_triggers',
  'memory_list',
  'memory_save',
  'memory_index_scan'
]);

// Token budgets for dual-scope lifecycle hooks (TM-05)
const TOOL_DISPATCH_TOKEN_BUDGET = 4000;
const COMPACTION_TOKEN_BUDGET = 4000;

// Constitutional memory cache
// Module-level mutable state: safe in a single-process MCP server.
// If the server ever runs multi-process, replace with a shared store.
let constitutionalCache: ConstitutionalMemory[] | null = null;
let constitutionalCacheTime = 0;
const CONSTITUTIONAL_CACHE_TTL = 60000; // 1 minute
// Per-session priming tracker: a Set of session IDs that have been primed.
// Replaces the previous process-global boolean to avoid skipping priming
// for new sessions on long-lived MCP servers.
const primedSessionIds: Set<string> = new Set();

// T018: Session-level tracking for prime package and session_health
const serverStartedAt = Date.now();
let lastToolCallAt = Date.now();
let lastActiveSessionId: string | null = null;

/** T018: Update last tool call timestamp (called from context-server dispatch). */
function recordToolCall(sessionId?: string): void {
  lastToolCallAt = Date.now();
  if (typeof sessionId === 'string' && sessionId.trim().length > 0) {
    lastActiveSessionId = sessionId.trim();
  }
}

/** T018: Get session tracking timestamps */
function getSessionTimestamps(): { serverStartedAt: number; lastToolCallAt: number } {
  return { serverStartedAt, lastToolCallAt };
}

/**
 * T018: Check if a specific session has been primed.
 * Session identity is required to avoid cross-session bleed-through.
 */
function isSessionPrimed(sessionId: string): boolean {
  return primedSessionIds.has(sessionId);
}

/** Mark a specific session as primed */
function markSessionPrimed(sessionId: string): void {
  primedSessionIds.add(sessionId);
  lastActiveSessionId = sessionId;
}

function getLastActiveSessionId(): string | null {
  return lastActiveSessionId;
}

/* ───────────────────────────────────────────────────────────────
   3. CONTEXT EXTRACTION
──────────────────────────────────────────────────────────────── */

function extractContextHint(args: Record<string, unknown> | null | undefined): string | null {
  if (!args || typeof args !== 'object') return null;

  const contextFields = ['input', 'query', 'prompt', 'specFolder', 'filePath'];
  for (const field of contextFields) {
    if (args[field] && typeof args[field] === 'string' && (args[field] as string).length >= 3) {
      return args[field] as string;
    }
  }

  // Join concepts array if present
  if (args.concepts && Array.isArray(args.concepts) && args.concepts.length > 0) {
    const strings = args.concepts.filter((c): c is string => typeof c === 'string');
    if (strings.length > 0) return strings.join(' ');
  }

  return null;
}

/* ───────────────────────────────────────────────────────────────
   4. CONSTITUTIONAL MEMORIES
──────────────────────────────────────────────────────────────── */

async function getConstitutionalMemories(): Promise<ConstitutionalMemory[]> {
  const now = Date.now();

  if (constitutionalCache && (now - constitutionalCacheTime) < CONSTITUTIONAL_CACHE_TTL) {
    return constitutionalCache;
  }

  try {
    const db: Database | null = vectorIndex.getDb();
    if (!db) return [];

    const rows = db.prepare(`
      SELECT id, spec_folder, file_path, title, trigger_phrases, importance_tier
      FROM memory_index
      WHERE importance_tier = 'constitutional'
      AND embedding_status IN ('success', 'pending', 'partial')
      ORDER BY created_at DESC
      LIMIT 10
    `).all();

    constitutionalCache = (rows as Record<string, unknown>[]).map((r) => ({
      id: r.id as number,
      specFolder: r.spec_folder as string,
      filePath: r.file_path as string,
      title: r.title as string,
      importanceTier: r.importance_tier as string
    }));
    constitutionalCacheTime = now;

    return constitutionalCache;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[SK-004] Failed to fetch constitutional memories:', message);
    return [];
  }
}

function clearConstitutionalCache(): void {
  constitutionalCache = null;
  constitutionalCacheTime = 0;
}

function getCodeGraphStatusSnapshot(): NonNullable<AutoSurfaceResult['codeGraphStatus']> {
  try {
    const stats = graphDb.getStats();
    const staleCount = (graphDb.getDb().prepare(`
      SELECT COUNT(*) as c FROM code_files
      WHERE parse_health = 'error' OR parse_health = 'recovered'
    `).get() as { c: number }).c;

    return {
      status: 'ok',
      data: {
        totalFiles: stats.totalFiles,
        totalNodes: stats.totalNodes,
        totalEdges: stats.totalEdges,
        staleFiles: staleCount,
        lastScanAt: stats.lastScanTimestamp,
        dbFileSize: stats.dbFileSize,
        schemaVersion: stats.schemaVersion,
        nodesByKind: stats.nodesByKind,
        edgesByType: stats.edgesByType,
        parseHealth: stats.parseHealthSummary,
      },
    };
  } catch (err: unknown) {
    return {
      status: 'error',
      error: `Code graph not initialized: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/* ───────────────────────────────────────────────────────────────
   5. AUTO-SURFACE MEMORIES
──────────────────────────────────────────────────────────────── */

function enforceAutoSurfaceTokenBudget(
  result: AutoSurfaceResult | null,
  tokenBudget: number,
  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware'
): AutoSurfaceResult | null {
  if (!result) {
    return null;
  }

  const measureTokens = (candidate: AutoSurfaceResult): number =>
    estimateTokenCount(JSON.stringify(candidate));

  const budgetLimit = Number.isFinite(tokenBudget) && tokenBudget > 0
    ? tokenBudget
    : TOOL_DISPATCH_TOKEN_BUDGET;

  let boundedResult: AutoSurfaceResult = result;
  let tokenCount = measureTokens(boundedResult);

  if (tokenCount <= budgetLimit) {
    return boundedResult;
  }

  const triggered = [...boundedResult.triggered];
  while (triggered.length > 0 && tokenCount > budgetLimit) {
    triggered.pop();
    boundedResult = { ...boundedResult, triggered };
    tokenCount = measureTokens(boundedResult);
  }

  const constitutional = [...boundedResult.constitutional];
  while (constitutional.length > 0 && tokenCount > budgetLimit) {
    constitutional.pop();
    boundedResult = { ...boundedResult, constitutional };
    tokenCount = measureTokens(boundedResult);
  }

  if (tokenCount > budgetLimit) {
    console.warn(
      `[SK-004] Auto-surface output exceeded ${hookName} token budget ` +
      `(${tokenCount} > ${budgetLimit}); dropping payload`
    );
    return null;
  }

  console.warn(
    `[SK-004] Auto-surface output truncated to fit ${hookName} token budget ` +
    `(${tokenCount}/${budgetLimit})`
  );
  return boundedResult;
}

/**
 * Phase C: Get top-N attention-weighted memory IDs from working memory.
 * Used to boost trigger-matched results that also appear in the active
 * working set, improving surface relevance.
 *
 * @param limit - Maximum number of memory IDs to return
 * @returns Set of memory IDs with high attention in working memory
 */
function getAttentionWeightedMemoryIds(limit: number = 5): Set<number> {
  try {
    const db: Database | null = vectorIndex.getDb();
    if (!db) return new Set();

    // Query top attention-weighted memories, scoped to the current session
    // by filtering to entries focused within the last hour. This prevents
    // stale cross-session entries from influencing auto-surface ordering.
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const rows = db.prepare(`
      SELECT DISTINCT wm.memory_id
      FROM working_memory wm
      WHERE wm.memory_id IS NOT NULL
        AND wm.attention_score > ?
        AND wm.last_focused >= ?
      ORDER BY wm.attention_score DESC, wm.last_focused DESC
      LIMIT ?
    `).all(workingMemory.DECAY_FLOOR, oneHourAgo, limit) as Array<{ memory_id: number }>;

    return new Set(rows.map(r => r.memory_id));
  } catch (_err: unknown) {
    // Graceful degradation — working memory boost is optional
    return new Set();
  }
}

/**
 * Phase C: Apply 1.3x boost to trigger-matched results that also appear
 * in the attention-weighted working memory set. Re-sorts results by
 * boosted composite score.
 *
 * @param triggered - Trigger-matched results from matchTriggerPhrases()
 * @param attentionIds - Set of memory IDs from working memory
 * @returns Re-sorted trigger matches with working memory boost applied
 */
const ATTENTION_BOOST_FACTOR = 1.3;

function applyAttentionBoost(
  triggered: triggerMatcher.TriggerMatch[],
  attentionIds: Set<number>,
): triggerMatcher.TriggerMatch[] {
  if (attentionIds.size === 0 || triggered.length === 0) return triggered;

  // Score each result: base = matchedPhrases.length + (importanceWeight * 0.1)
  // Apply 1.3x multiplier when memory is in working memory set.
  return [...triggered]
    .sort((a, b) => {
      const scoreA = (a.matchedPhrases.length + a.importanceWeight * 0.1) *
        (attentionIds.has(a.memoryId) ? ATTENTION_BOOST_FACTOR : 1.0);
      const scoreB = (b.matchedPhrases.length + b.importanceWeight * 0.1) *
        (attentionIds.has(b.memoryId) ? ATTENTION_BOOST_FACTOR : 1.0);
      return scoreB - scoreA;
    });
}

async function autoSurfaceMemories(
  contextHint: string,
  tokenBudget: number = TOOL_DISPATCH_TOKEN_BUDGET,
  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware' = 'memory-aware'
): Promise<AutoSurfaceResult | null> {
  const startTime = Date.now();

  try {
    // Get constitutional memories (always surface)
    const constitutional = await getConstitutionalMemories();

    // Get triggered memories via fast phrase matching
    let triggered = triggerMatcher.matchTriggerPhrases(contextHint, 5);

    // Phase C: Attention-enriched boost — re-rank triggered results that
    // also appear in the working memory active set.
    try {
      const attentionIds = getAttentionWeightedMemoryIds(5);
      if (attentionIds.size > 0 && triggered.length > 0) {
        triggered = applyAttentionBoost(triggered, attentionIds);
      }
    } catch (_boostErr: unknown) {
      // Graceful degradation — attention boost is optional
    }

    const latencyMs = Date.now() - startTime;

    // Only return if we have something to surface
    if (constitutional.length === 0 && triggered.length === 0) {
      return null;
    }

    // PI-A4: Enrich constitutional memories with retrieval_directive metadata.
    // Pure content transformation — scoring is unchanged.
    const enrichedConstitutional = enrichWithRetrievalDirectives(constitutional);

    return enforceAutoSurfaceTokenBudget({
      constitutional: enrichedConstitutional,
      triggered: triggered.map((t: triggerMatcher.TriggerMatch) => ({
        memory_id: t.memoryId,
        spec_folder: t.specFolder,
        title: t.title ?? 'Untitled',
        matched_phrases: t.matchedPhrases,
      })),
      surfaced_at: new Date().toISOString(),
      latencyMs: latencyMs,
    }, tokenBudget, hookName);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[SK-004] Auto-surface failed:', message);
    return null;
  }
}

/** T018: Build structured Prime Package for non-hook CLI auto-priming */
function buildPrimePackage(
  toolArgs: Record<string, unknown>,
  graphSnapshot: NonNullable<AutoSurfaceResult['codeGraphStatus']>,
): PrimePackage {
  // Derive specFolder from tool args if provided
  const specFolder = typeof toolArgs.specFolder === 'string' ? toolArgs.specFolder : null;

  // Derive currentTask from input/query/prompt fields
  const taskFields = ['input', 'query', 'prompt'] as const;
  let currentTask: string | null = null;
  for (const f of taskFields) {
    if (typeof toolArgs[f] === 'string' && (toolArgs[f] as string).length >= 3) {
      currentTask = (toolArgs[f] as string).slice(0, 200);
      break;
    }
  }

  // Code graph freshness
  let codeGraphStatus: PrimePackage['codeGraphStatus'] = 'empty';
  if (graphSnapshot.status === 'ok' && graphSnapshot.data) {
    const lastScan = graphSnapshot.data.lastScanAt;
    const totalFiles = graphSnapshot.data.totalFiles ?? 0;
    if (totalFiles === 0) {
      codeGraphStatus = 'empty';
    } else if (!lastScan || (Date.now() - new Date(lastScan).getTime() > 24 * 60 * 60 * 1000)) {
      codeGraphStatus = 'stale';
    } else {
      codeGraphStatus = 'fresh';
    }
  }

  // F046: CocoIndex availability via shared helper (no process.cwd())
  const cocoIndexAvailable = isCocoIndexAvailable();

  // Build recommended calls based on state
  const recommendedCalls: string[] = [];
  if (codeGraphStatus === 'stale' || codeGraphStatus === 'empty') {
    recommendedCalls.push('code_graph_scan');
  }
  if (!specFolder) {
    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
  }
  if (cocoIndexAvailable && recommendedCalls.length === 0) {
    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
  }

  const toolRoutingRules: string[] = [];
  if (cocoIndexAvailable) {
    toolRoutingRules.push('semantic/concept queries → mcp__cocoindex_code__search');
  }
  if (codeGraphStatus !== 'empty') {
    toolRoutingRules.push('structural queries (callers, deps) → code_graph_query');
  }
  toolRoutingRules.push('exact text/regex → Grep');

  // Phase 027: Structural bootstrap contract for auto-prime surface
  const structuralContext = buildStructuralBootstrapContract('auto-prime');

  return {
    specFolder, currentTask, codeGraphStatus, cocoIndexAvailable, recommendedCalls,
    structuralContext,
    routingRules: {
      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
      communitySearch: 'When primary search returns weak results, community search fallback activates automatically (SPECKIT_COMMUNITY_SEARCH_FALLBACK). Graph provenance is visible in graphEvidence field.',
      toolRouting: `SEARCH ROUTING: ${toolRoutingRules.join(' | ')}`,
    },
  };
}

async function primeSessionIfNeeded(
  toolName: string,
  toolArgs: Record<string, unknown>,
  sessionId?: string,
): Promise<AutoSurfaceResult | null> {
  // Derive a session key from explicit sessionId or tool args.
  const effectiveSessionId = sessionId
    ?? (typeof toolArgs.sessionId === 'string' ? toolArgs.sessionId : null)
    ?? (typeof toolArgs.session_id === 'string' ? toolArgs.session_id : null);

  if (!effectiveSessionId || effectiveSessionId.trim().length === 0) {
    return null;
  }

  if (isSessionPrimed(effectiveSessionId)) {
    return null;
  }

  const startTime = Date.now();
  const contextHint = extractContextHint(toolArgs);

  try {
    const constitutional = await getConstitutionalMemories();
    const enrichedConstitutional = enrichWithRetrievalDirectives(constitutional);
    const codeGraphStatus = getCodeGraphStatusSnapshot();
    const latencyMs = Date.now() - startTime;

    // T018: Build structured Prime Package
    const primePackage = buildPrimePackage(toolArgs, codeGraphStatus);

    // F045: Mark session as primed AFTER successful execution (not before try)
    markSessionPrimed(effectiveSessionId);

    // Phase 024 / Item 9: Record bootstrap telemetry for MCP auto-priming
    recordBootstrapEvent('mcp_auto', Date.now() - startTime, 'full');

    if (enrichedConstitutional.length === 0 && codeGraphStatus.status !== 'ok') {
      // Still return the prime package even when no constitutional memories
      return enforceAutoSurfaceTokenBudget({
        constitutional: [],
        triggered: [],
        codeGraphStatus,
        sessionPrimed: true,
        primedTool: toolName,
        primePackage,
        surfaced_at: new Date().toISOString(),
        latencyMs,
      }, TOOL_DISPATCH_TOKEN_BUDGET, 'tool-dispatch');
    }

    return enforceAutoSurfaceTokenBudget({
      constitutional: enrichedConstitutional,
      triggered: [],
      codeGraphStatus,
      sessionPrimed: true,
      primedTool: toolName,
      primePackage,
      surfaced_at: new Date().toISOString(),
      latencyMs,
    }, TOOL_DISPATCH_TOKEN_BUDGET, 'tool-dispatch');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(
      `[SK-004] Session priming failed on first tool call '${toolName}'` +
      `${contextHint ? ' with extracted context hint' : ''}: ${message}`
    );
    return null;
  }
}

/**
 * Reset priming state. When called with a sessionId, clears only that session.
 * When called without arguments, clears all sessions (backward-compatible).
 */
function resetSessionPrimed(sessionId?: string): void {
  if (sessionId) {
    primedSessionIds.delete(sessionId);
  } else {
    primedSessionIds.clear();
  }
}

/* ───────────────────────────────────────────────────────────────
   6. TOOL DISPATCH HOOK (TM-05)
──────────────────────────────────────────────────────────────── */

/**
 * autoSurfaceAtToolDispatch
 *
 * Fires at tool dispatch lifecycle points. Extracts a context hint from
 * the dispatched tool's arguments, then surfaces relevant memories via
 * the standard autoSurfaceMemories path.
 *
 * Skipped when:
 *   - toolName is in MEMORY_AWARE_TOOLS (prevents recursive surfacing)
 *   - No context hint can be extracted from args
 *   - enableToolDispatchHook is false in the integration config
 *
 * Token budget: TOOL_DISPATCH_TOKEN_BUDGET (4000 max)
 *
 * @param toolName   - Name of the tool being dispatched
 * @param toolArgs   - Arguments passed to the dispatched tool
 * @param options    - Optional integration-layer config flags
 * @returns AutoSurfaceResult or null if nothing to surface / hook disabled
 */
async function autoSurfaceAtToolDispatch(
  toolName: string,
  toolArgs: Record<string, unknown>,
  options?: { enableToolDispatchHook?: boolean }
): Promise<AutoSurfaceResult | null> {
  // Allow integration layer to disable this hook via config flag
  if (options && options.enableToolDispatchHook === false) {
    return null;
  }

  // Skip memory-aware tools to prevent recursive surfacing loops
  if (MEMORY_AWARE_TOOLS.has(toolName)) {
    return null;
  }

  const contextHint = extractContextHint(toolArgs);
  if (!contextHint) {
    return null;
  }

  // Delegate to the core surface function; token budget is explicitly
  // Enforced at the hook output boundary via estimateTokenCount().
  return autoSurfaceMemories(contextHint, TOOL_DISPATCH_TOKEN_BUDGET, 'tool-dispatch');
}

/* ───────────────────────────────────────────────────────────────
   7. COMPACTION HOOK (TM-05)
──────────────────────────────────────────────────────────────── */

/**
 * autoSurfaceAtCompaction
 *
 * Fires at session compaction lifecycle points. Surfaces memories relevant
 * to the ongoing session context so that critical knowledge is preserved
 * across the compaction boundary.
 *
 * Skipped when:
 *   - sessionContext is empty or too short to extract signal
 *   - enableCompactionHook is false in the integration config
 *
 * Token budget: COMPACTION_TOKEN_BUDGET (4000 max)
 *
 * @param sessionContext - A textual summary of the current session state
 * @param options        - Optional integration-layer config flags
 * @returns AutoSurfaceResult or null if nothing to surface / hook disabled
 */
async function autoSurfaceAtCompaction(
  sessionContext: string,
  options?: { enableCompactionHook?: boolean }
): Promise<AutoSurfaceResult | null> {
  // Allow integration layer to disable this hook via config flag
  if (options && options.enableCompactionHook === false) {
    return null;
  }

  // Require a meaningful context string (at least 3 characters)
  if (!sessionContext || typeof sessionContext !== 'string' || sessionContext.trim().length < 3) {
    return null;
  }

  // Delegate to the core surface function; token budget is explicitly
  // Enforced at the hook output boundary via estimateTokenCount().
  return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');
}

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  // Constants
  MEMORY_AWARE_TOOLS,
  CONSTITUTIONAL_CACHE_TTL,
  TOOL_DISPATCH_TOKEN_BUDGET,
  COMPACTION_TOKEN_BUDGET,

  // Functions
  extractContextHint,
  getConstitutionalMemories,
  clearConstitutionalCache,
  autoSurfaceMemories,
  primeSessionIfNeeded,
  resetSessionPrimed,
  autoSurfaceAtToolDispatch,
  autoSurfaceAtCompaction,

  // T018: Session tracking for session_health tool
  recordToolCall,
  getSessionTimestamps,
  getLastActiveSessionId,
  isSessionPrimed,
  markSessionPrimed,
  getCodeGraphStatusSnapshot,
};

// T018: Export types for session-health handler
export type { PrimePackage, AutoSurfaceResult };
