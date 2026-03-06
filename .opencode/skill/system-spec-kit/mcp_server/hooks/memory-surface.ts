// ---------------------------------------------------------------
// MODULE: Memory Surface
// ---------------------------------------------------------------

// Lib modules
import * as vectorIndex from '../lib/search/vector-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import { enrichWithRetrievalDirectives } from '../lib/search/retrieval-directives';

import type { Database } from '@spec-kit/shared/types';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

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
  surfaced_at: string;
  latencyMs: number;
}

/* ---------------------------------------------------------------
   2. MEMORY SURFACE HOOK CONFIGURATION
--------------------------------------------------------------- */

const MEMORY_AWARE_TOOLS: Set<string> = new Set([
  'memory_context',
  'memory_search',
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

/* ---------------------------------------------------------------
   3. CONTEXT EXTRACTION
--------------------------------------------------------------- */

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
    return (args.concepts as string[]).join(' ');
  }

  return null;
}

/* ---------------------------------------------------------------
   4. CONSTITUTIONAL MEMORIES
--------------------------------------------------------------- */

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
      AND embedding_status = 'success'
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

/* ---------------------------------------------------------------
   5. AUTO-SURFACE MEMORIES
--------------------------------------------------------------- */

async function autoSurfaceMemories(contextHint: string): Promise<AutoSurfaceResult | null> {
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

    return {
      constitutional: enrichedConstitutional,
      triggered: triggered.map((t: triggerMatcher.TriggerMatch) => ({
        memory_id: t.memoryId,
        spec_folder: t.specFolder,
        title: t.title ?? 'Untitled',
        matched_phrases: t.matchedPhrases,
      })),
      surfaced_at: new Date().toISOString(),
      latencyMs: latencyMs,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[SK-004] Auto-surface failed:', message);
    return null;
  }
}

/* ---------------------------------------------------------------
   6. TOOL DISPATCH HOOK (TM-05)
--------------------------------------------------------------- */

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

  // Delegate to the core surface function; token budget is enforced by
  // the trigger-matcher limit (5 results) and constitutional cache cap (10)
  // which together stay well within TOOL_DISPATCH_TOKEN_BUDGET = 4000.
  return autoSurfaceMemories(contextHint);
}

/* ---------------------------------------------------------------
   7. COMPACTION HOOK (TM-05)
--------------------------------------------------------------- */

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

  // Delegate to the core surface function; same budget constraints apply
  // as for tool dispatch: COMPACTION_TOKEN_BUDGET = 4000.
  return autoSurfaceMemories(sessionContext.trim());
}

/* ---------------------------------------------------------------
   8. EXPORTS
--------------------------------------------------------------- */

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
  autoSurfaceAtToolDispatch,
  autoSurfaceAtCompaction,
};
