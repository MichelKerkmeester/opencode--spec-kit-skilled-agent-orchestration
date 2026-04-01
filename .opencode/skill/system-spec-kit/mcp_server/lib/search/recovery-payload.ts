// ───────────────────────────────────────────────────────────────
// MODULE: Recovery Payload
// ───────────────────────────────────────────────────────────────
// REQ-D5-001: Empty/Weak Result Recovery UX
//
// PURPOSE: Generate structured recovery payloads when search returns
// no results, very low-confidence results, or only partial matches.
// Provides the calling agent with actionable next steps.
//
// FEATURE FLAG: SPECKIT_EMPTY_RESULT_RECOVERY_V1 (default ON, graduated)
//
// OUTPUT SHAPE:
// {
//   "status": "no_results" | "low_confidence" | "partial",
//   "reason": "spec_filter_too_narrow" | "low_signal_query" | "knowledge_gap",
//   "suggestedQueries": ["broader alternative 1", "rephrased alternative 2"],
//   "recommendedAction": "retry_broader" | "switch_mode" | "save_memory" | "ask_user"
// }

// -- Types --

/** The retrieval outcome state. */
export type RecoveryStatus = 'no_results' | 'low_confidence' | 'partial';

/** Root cause classification of the failure. */
export type RecoveryReason = 'spec_filter_too_narrow' | 'low_signal_query' | 'knowledge_gap';

/** Recommended next action for the calling agent. */
export type RecoveryAction = 'retry_broader' | 'switch_mode' | 'save_memory' | 'ask_user';

/** Structured recovery payload attached to search responses. */
export interface RecoveryPayload {
  status: RecoveryStatus;
  reason: RecoveryReason;
  suggestedQueries: string[];
  recommendedAction: RecoveryAction;
}

/** Input context used to build the recovery payload. */
export interface RecoveryContext {
  /** The original search query (may be null/empty if concepts were used). */
  query: string | null;
  /** Whether a specFolder filter was applied. */
  hasSpecFolderFilter: boolean;
  /** Whether upstream search logic detected an evidence gap for this result set. */
  evidenceGap?: boolean;
  /** How many results were returned (0 = no_results, 1–N = partial/low_confidence). */
  resultCount: number;
  /** Average confidence value across returned results (0–1). Only meaningful when resultCount > 0. */
  avgConfidence?: number;
  /** Low-confidence threshold — results below this trigger recovery. */
  lowConfidenceThreshold?: number;
}

// -- Constants --

const DEFAULT_LOW_CONFIDENCE_THRESHOLD = 0.4;

// Minimum result count considered "good enough" — fewer than this triggers partial recovery.
const PARTIAL_RESULT_MIN = 3;

// -- Internal helpers --

/**
 * Classify retrieval status based on result count and confidence signals.
 */
function classifyStatus(ctx: RecoveryContext): RecoveryStatus {
  const threshold = ctx.lowConfidenceThreshold ?? DEFAULT_LOW_CONFIDENCE_THRESHOLD;

  if (ctx.resultCount === 0) return 'no_results';
  if (ctx.evidenceGap) return 'partial';
  if (
    typeof ctx.avgConfidence === 'number' &&
    Number.isFinite(ctx.avgConfidence) &&
    ctx.avgConfidence < threshold
  ) return 'low_confidence';
  if (ctx.resultCount < PARTIAL_RESULT_MIN) return 'partial';
  return 'low_confidence'; // fallback — should only be called when recovery is warranted
}

/**
 * Classify root cause from context signals.
 */
function classifyReason(ctx: RecoveryContext, status: RecoveryStatus): RecoveryReason {
  // If a narrow filter was applied and no results returned, that is most likely the cause
  if (ctx.hasSpecFolderFilter && status === 'no_results') {
    return 'spec_filter_too_narrow';
  }
  // Very short or generic queries (< 3 words) suggest low signal
  const wordCount = ctx.query ? ctx.query.trim().split(/\s+/).filter(Boolean).length : 0;
  if (wordCount > 0 && wordCount <= 2) {
    return 'low_signal_query';
  }
  // Default to knowledge_gap — the information may simply not be indexed
  return 'knowledge_gap';
}

/**
 * Generate suggested reformulations from the original query.
 *
 * Heuristics applied (in order):
 * 1. Remove parenthetical or bracketed clauses (focus term extraction)
 * 2. Keep only the first N words (shorten complex queries)
 * 3. Strip trailing conjunctions / stop words
 * 4. Suggest dropping the spec folder constraint when it was set
 */
function generateSuggestedQueries(ctx: RecoveryContext): string[] {
  const suggestions: string[] = [];
  const q = ctx.query?.trim() ?? '';

  if (q.length === 0) {
    suggestions.push('memory save context', 'recent decisions', 'project overview');
    return suggestions.slice(0, 2);
  }

  // 1. Remove parentheticals/brackets — often over-specifying
  const withoutParens = q.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').replace(/\s{2,}/g, ' ').trim();
  if (withoutParens.length > 0 && withoutParens !== q) {
    suggestions.push(withoutParens);
  }

  // 2. Shorten: keep first 3 words
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 4) {
    suggestions.push(words.slice(0, 3).join(' '));
  }

  // 3. Remove trailing stop-words (and, or, the, in, for, with, to, of, a)
  const stopWords = new Set(['and', 'or', 'the', 'in', 'for', 'with', 'to', 'of', 'a', 'an']);
  const trimmedWords = [...words].reverse().reduce<string[]>((acc, word) => {
    if (acc.length === 0 && stopWords.has(word.toLowerCase())) return acc;
    return [word, ...acc];
  }, []);
  const stopTrimmed = trimmedWords.join(' ');
  if (stopTrimmed.length > 0 && stopTrimmed !== q && !suggestions.includes(stopTrimmed)) {
    suggestions.push(stopTrimmed);
  }

  // 4. If spec folder filter was active, suggest the same query without it
  if (ctx.hasSpecFolderFilter && !suggestions.includes(q)) {
    suggestions.push(q); // exact same query but without folder constraint
  }

  // Deduplicate, remove empties, cap at 3
  const unique = [...new Set(suggestions.filter((s) => s.length > 0))];
  return unique.slice(0, 3);
}

/**
 * Map status + reason to a recommended next action.
 */
function recommendAction(status: RecoveryStatus, reason: RecoveryReason): RecoveryAction {
  if (status === 'no_results') {
    if (reason === 'spec_filter_too_narrow') return 'retry_broader';
    if (reason === 'low_signal_query') return 'switch_mode';
    return 'save_memory'; // knowledge_gap — user may need to add context first
  }
  if (status === 'low_confidence') {
    if (reason === 'knowledge_gap') return 'ask_user';
    return 'switch_mode';
  }
  // partial
  return 'retry_broader';
}

// -- Graph-Expanded Fallback (Phase B T017) -----------------------------------

import type Database from 'better-sqlite3';
import { routeQueryConcepts } from './entity-linker.js';
import { isGraphFallbackEnabled } from './search-flags.js';

/**
 * Phase B T017: Build graph-expanded fallback query terms on zero/weak results.
 *
 * When the search produces no results or low-confidence results, this function
 * queries the causal_edges table for nodes related to the matched concepts from
 * concept routing, returning up to 5 expanded query terms derived from neighbor
 * node titles.
 *
 * Feature-gated by SPECKIT_GRAPH_FALLBACK (default ON).
 * Fail-open: returns empty array on any error.
 *
 * @param ctx - Recovery context with query and result state.
 * @param db - SQLite database instance for graph lookups.
 * @returns Array of up to 5 expanded query terms from graph neighbors.
 */
export function buildGraphExpandedFallback(
  ctx: RecoveryContext,
  db: Database.Database,
): string[] {
  if (!isGraphFallbackEnabled()) return [];

  const status = classifyStatus(ctx);
  if (status !== 'no_results' && status !== 'low_confidence') return [];

  try {
    const routing = routeQueryConcepts(ctx.query ?? '', db);
    if (!routing.graphActivated || routing.concepts.length === 0) return [];

    // Find memory IDs matching the routed concepts via title keyword search,
    // then walk causal_edges to find neighbors with distinct titles.

    // Step 1: Find seed memory IDs whose titles contain matched concepts
    const likeClauses = routing.concepts.map(() => 'LOWER(mi.title) LIKE ?').join(' OR ');
    const likeParams = routing.concepts.map((c) => `%${c.toLowerCase()}%`);

    const seedRows = (db.prepare(`
      SELECT mi.id FROM memory_index mi
      WHERE (${likeClauses})
      LIMIT 10
    `) as Database.Statement).all(...likeParams) as Array<{ id: number }>;

    if (seedRows.length === 0) return [];

    const seedIds = seedRows.map((r) => String(r.id));
    const seedPlaceholdersSql = seedIds.map(() => '?').join(', ');

    // Step 2: Walk 1-hop causal edges from seeds to find neighbor nodes
    const neighborRows = (db.prepare(`
      SELECT DISTINCT mi.title
      FROM causal_edges ce
      JOIN memory_index mi ON (
        (ce.source_id IN (${seedPlaceholdersSql}) AND mi.id = CAST(ce.target_id AS INTEGER))
        OR
        (ce.target_id IN (${seedPlaceholdersSql}) AND mi.id = CAST(ce.source_id AS INTEGER))
      )
      WHERE mi.id NOT IN (${seedPlaceholdersSql})
      LIMIT 10
    `) as Database.Statement).all(
      ...seedIds,
      ...seedIds,
      ...seedIds,
    ) as Array<{ title: string }>;

    if (neighborRows.length === 0) return [];

    // Step 3: Extract short keyword phrases from neighbor titles
    const terms: string[] = [];
    const seen = new Set<string>();

    for (const row of neighborRows) {
      if (!row.title || terms.length >= 5) break;
      // Take the first 3 words of the title as a search term
      const words = row.title.trim().split(/\s+/).slice(0, 3).join(' ').toLowerCase();
      if (words.length > 0 && !seen.has(words)) {
        seen.add(words);
        terms.push(words);
      }
    }

    return terms;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[recovery-payload] buildGraphExpandedFallback failed (fail-open): ${message}`);
    return [];
  }
}

// -- Public API --

/**
 * Build a structured recovery payload for a failed or weak retrieval.
 *
 * Call this when:
 *  - No results are returned (resultCount === 0)
 *  - Results are returned but avgConfidence < threshold
 *  - Fewer than PARTIAL_RESULT_MIN results (partial match)
 *
 * @param ctx - Retrieval outcome context
 * @returns Structured recovery payload
 */
export function buildRecoveryPayload(ctx: RecoveryContext): RecoveryPayload {
  const status = classifyStatus(ctx);
  const reason = classifyReason(ctx, status);
  const suggestedQueries = generateSuggestedQueries(ctx);
  const recommendedAction = recommendAction(status, reason);

  return {
    status,
    reason,
    suggestedQueries,
    recommendedAction,
  };
}

/**
 * Determine whether a search result set warrants recovery.
 *
 * Returns true when:
 *  - No results returned, OR
 *  - Average confidence below threshold, OR
 *  - Fewer than PARTIAL_RESULT_MIN results and avgConfidence is below mid-range
 *
 * @param ctx - Retrieval outcome context
 */
export function shouldTriggerRecovery(ctx: RecoveryContext): boolean {
  if (ctx.resultCount === 0) return true;
  if (ctx.evidenceGap) return true;

  const threshold = ctx.lowConfidenceThreshold ?? DEFAULT_LOW_CONFIDENCE_THRESHOLD;

  if (
    typeof ctx.avgConfidence === 'number' &&
    Number.isFinite(ctx.avgConfidence) &&
    ctx.avgConfidence < threshold
  ) return true;

  if (ctx.resultCount < PARTIAL_RESULT_MIN) return true;

  return false;
}

/**
 * Check whether the empty-result recovery feature flag is enabled.
 * Default: ON (graduated). Set SPECKIT_EMPTY_RESULT_RECOVERY_V1=false to disable.
 */
export { isEmptyResultRecoveryEnabled } from './search-flags.js';
