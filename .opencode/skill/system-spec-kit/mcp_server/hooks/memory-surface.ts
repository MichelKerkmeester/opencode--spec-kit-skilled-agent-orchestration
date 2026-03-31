// ───────────────────────────────────────────────────────────────
// MODULE: Memory Surface
// ───────────────────────────────────────────────────────────────
// Lib modules
import * as vectorIndex from '../lib/search/vector-index.js';
import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
import { enrichWithRetrievalDirectives } from '../lib/search/retrieval-directives.js';
import * as graphDb from '../lib/code-graph/code-graph-db.js';
import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';

import type { Database } from '@spec-kit/shared/types';

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
  surfaced_at: string;
  latencyMs: number;
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
let sessionPrimed = false;

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
    const triggered = triggerMatcher.matchTriggerPhrases(contextHint, 5);

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

async function primeSessionIfNeeded(
  toolName: string,
  toolArgs: Record<string, unknown>
): Promise<AutoSurfaceResult | null> {
  if (sessionPrimed) {
    return null;
  }

  sessionPrimed = true;
  const startTime = Date.now();
  const contextHint = extractContextHint(toolArgs);

  try {
    const constitutional = await getConstitutionalMemories();
    const enrichedConstitutional = enrichWithRetrievalDirectives(constitutional);
    const codeGraphStatus = getCodeGraphStatusSnapshot();
    const latencyMs = Date.now() - startTime;

    if (enrichedConstitutional.length === 0 && codeGraphStatus.status !== 'ok') {
      return null;
    }

    return enforceAutoSurfaceTokenBudget({
      constitutional: enrichedConstitutional,
      triggered: [],
      codeGraphStatus,
      sessionPrimed: true,
      primedTool: toolName,
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

function resetSessionPrimed(): void {
  sessionPrimed = false;
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
};
