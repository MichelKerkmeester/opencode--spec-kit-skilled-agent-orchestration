// ───────────────────────────────────────────────────────────────
// MODULE: Eval Logger
// ───────────────────────────────────────────────────────────────
// Feature catalog: Evaluation database and schema
// Non-blocking, fail-safe logging hooks for search, context,
// And trigger handlers. All writes go to the eval DB (speckit-eval.db).
//
// CRITICAL: Logging must NEVER break production search.
// Every public function is wrapped in try-catch and is a no-op
// When SPECKIT_EVAL_LOGGING is not set to "true".
import { initEvalDb } from './eval-db.js';

/* ───────────────────────────────────────────────────────────────
   1. FEATURE FLAG
──────────────────────────────────────────────────────────────── */

/**
 * Returns true only when SPECKIT_EVAL_LOGGING=true (case-insensitive).
 * Anything else (undefined, "false", "1", …) disables logging.
 */
function isEvalLoggingEnabled(): boolean {
  return process.env.SPECKIT_EVAL_LOGGING?.toLowerCase() === 'true';
}

/* ───────────────────────────────────────────────────────────────
   2. EVAL RUN ID GENERATOR
   A monotonically increasing counter is sufficient for within-
   process correlation. It resets on process restart — that is
   acceptable because eval data is append-only and the DB ID
   provides global uniqueness.
──────────────────────────────────────────────────────────────── */

// Initialize from DB MAX to survive restarts
let _evalRunCounter = 0;
let _evalRunCounterInitialized = false;

/**
 * Generate a new eval_run_id for a single search invocation.
 * Callers should capture this once at the start of a handler
 * and pass it to every logChannelResult / logFinalResult call
 * for that same invocation.
 *
 * Returns 0 when eval logging is disabled (no-op sentinel).
 */
function generateEvalRunId(): number {
  if (!isEvalLoggingEnabled()) return 0;
  // Lazy init from DB on first call to survive server restarts
  if (!_evalRunCounterInitialized) {
    try {
      const db = getDb();
      if (db) {
        const channelMax = db.prepare('SELECT MAX(eval_run_id) as maxId FROM eval_channel_results').get() as { maxId: number | null } | undefined;
        const finalMax = db.prepare('SELECT MAX(eval_run_id) as maxId FROM eval_final_results').get() as { maxId: number | null } | undefined;
        const maxId = Math.max(channelMax?.maxId ?? 0, finalMax?.maxId ?? 0);

        if (maxId > _evalRunCounter) {
          _evalRunCounter = maxId;
        }
      }
      _evalRunCounterInitialized = true;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn('[eval-logger] generateEvalRunId bootstrap warning:', msg);
      // Keep _evalRunCounterInitialized=false so next call can retry bootstrap.
    }
  }
  return ++_evalRunCounter;
}

/* ───────────────────────────────────────────────────────────────
   3. PARAMETER TYPES
──────────────────────────────────────────────────────────────── */

interface LogSearchQueryParams {
  /** Raw query text as supplied by the caller. */
  query: string;
  /** Intent label, e.g. "understand" or "fix_bug". */
  intent?: string | null;
  /** Spec folder filter, if any. */
  specFolder?: string | null;
}

interface LogSearchQueryResult {
  /** Inserted row ID in eval_queries. 0 means logging is disabled or failed. */
  queryId: number;
  /** Eval run ID to pass to channel / final result loggers. */
  evalRunId: number;
}

interface LogChannelResultParams {
  evalRunId: number;
  queryId: number;
  /** Channel name: "vector", "bm25", "graph", or "trigger". */
  channel: string;
  /** Memory IDs returned by this channel. */
  resultMemoryIds?: number[];
  /** Per-result scores (same order as resultMemoryIds). */
  scores?: number[];
  /** Wall-clock latency for this channel in milliseconds. */
  latencyMs?: number;
  /** Number of results that are judged hits (when known). */
  hitCount?: number;
}

interface LogFinalResultParams {
  evalRunId: number;
  queryId: number;
  /** Memory IDs in the fused / final ranked list. */
  resultMemoryIds?: number[];
  /** Per-result scores in the final list. */
  scores?: number[];
  /** Fusion method used, e.g. "rrf". */
  fusionMethod?: string;
  /** Total end-to-end latency in milliseconds. */
  latencyMs?: number;
}

/* ───────────────────────────────────────────────────────────────
   4. HELPER — lazy DB acquisition
   We call initEvalDb() with no args so it uses the same DB
   directory resolution as the main DB (env-var precedence).
   initEvalDb() is idempotent, so repeated calls are safe.
──────────────────────────────────────────────────────────────── */

function getDb() {
  return initEvalDb();
}

/* ───────────────────────────────────────────────────────────────
   5. PUBLIC API
──────────────────────────────────────────────────────────────── */

/**
 * Log a search query to eval_queries.
 *
 * Should be called at the entry point of each handler (search,
 * context, triggers). Returns the queryId and evalRunId that
 * must be forwarded to channel / final result loggers.
 *
 * Fail-safe: never throws. Returns { queryId: 0, evalRunId: 0 }
 * when logging is disabled or an error occurs.
 */
function logSearchQuery(params: LogSearchQueryParams): LogSearchQueryResult {
  const noop: LogSearchQueryResult = { queryId: 0, evalRunId: 0 };

  if (!isEvalLoggingEnabled()) return noop;

  try {
    const db = getDb();

    const result = db.prepare(`
      INSERT INTO eval_queries (query, intent, spec_folder)
      VALUES (?, ?, ?)
    `).run(
      params.query ?? '',
      params.intent ?? null,
      params.specFolder ?? null
    );

    const queryId = typeof result.lastInsertRowid === 'bigint'
      ? Number(result.lastInsertRowid)
      : result.lastInsertRowid as number;

    // Use queryId as the canonical per-invocation run ID.
    // This guarantees uniqueness across concurrent processes that share the DB.
    const evalRunId = queryId > 0 ? queryId : generateEvalRunId();

    return { queryId, evalRunId };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[eval-logger] logSearchQuery failed (non-fatal):', msg);
    return noop;
  }
}

/**
 * Log the result set from a single retrieval channel.
 *
 * Fail-safe: never throws.
 */
function logChannelResult(params: LogChannelResultParams): void {
  if (!isEvalLoggingEnabled()) return;
  if (!params.evalRunId || !params.queryId) return;

  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO eval_channel_results
        (eval_run_id, query_id, channel, result_memory_ids, scores, latency_ms, hit_count)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      params.evalRunId,
      params.queryId,
      params.channel ?? 'unknown',
      params.resultMemoryIds ? JSON.stringify(params.resultMemoryIds) : null,
      params.scores ? JSON.stringify(params.scores) : null,
      params.latencyMs ?? null,
      params.hitCount ?? 0
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[eval-logger] logChannelResult failed (non-fatal):', msg);
  }
}

/**
 * Log the fused / final ranked result list.
 *
 * Fail-safe: never throws.
 */
function logFinalResult(params: LogFinalResultParams): void {
  if (!isEvalLoggingEnabled()) return;
  if (!params.evalRunId || !params.queryId) return;

  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO eval_final_results
        (eval_run_id, query_id, result_memory_ids, scores, fusion_method, latency_ms)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      params.evalRunId,
      params.queryId,
      params.resultMemoryIds ? JSON.stringify(params.resultMemoryIds) : null,
      params.scores ? JSON.stringify(params.scores) : null,
      params.fusionMethod ?? 'rrf',
      params.latencyMs ?? null
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[eval-logger] logFinalResult failed (non-fatal):', msg);
  }
}

/* ───────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  isEvalLoggingEnabled,
  generateEvalRunId,
  logSearchQuery,
  logChannelResult,
  logFinalResult,
};

export type {
  LogSearchQueryParams,
  LogSearchQueryResult,
  LogChannelResultParams,
  LogFinalResultParams,
};
