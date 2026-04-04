// ───────────────────────────────────────────────────────────────
// MODULE: Shadow Evaluation Runtime
// ───────────────────────────────────────────────────────────────
import { isEmbeddingModelReady, waitForEmbeddingModel, checkDatabaseUpdated, } from '../../core/index.js';
import { buildAdaptiveShadowProposal, getAdaptiveMode, tuneAdaptiveThresholdsAfterEvaluation, } from '../cognitive/adaptive-ranking.js';
import { isSessionBoostEnabled, isCausalBoostEnabled } from '../search/search-flags.js';
import { executePipeline } from '../search/pipeline/index.js';
import { initConsumptionLog } from '../telemetry/consumption-logger.js';
import { DEFAULT_HOLDOUT_PERCENT, EVALUATION_WINDOW_MS, getCycleResults, isShadowFeedbackEnabled, runShadowEvaluation, selectHoldoutQueries, } from './shadow-scoring.js';
/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */
/** Re-check weekly due status every hour while the server is running. */
const DEFAULT_SCHEDULER_INTERVAL_MS = 60 * 60 * 1000;
/** Build holdout candidate pools from the last 30 days of search traffic. */
const DEFAULT_QUERY_LOOKBACK_MS = 30 * 24 * 60 * 60 * 1000;
/** Upper bound on distinct replayed queries available to the holdout sampler. */
const DEFAULT_MAX_QUERY_POOL_SIZE = 100;
/** Use the same top-k depth as normal interactive search responses. */
const DEFAULT_SEARCH_LIMIT = 10;
/** Deterministic seed so weekly holdout selection is stable across restarts. */
const DEFAULT_SEED = 42;
/* ───────────────────────────────────────────────────────────────
   3. MODULE STATE
──────────────────────────────────────────────────────────────── */
let schedulerTimer = null;
let evaluationInFlight = false;
/* ───────────────────────────────────────────────────────────────
   4. HELPERS
──────────────────────────────────────────────────────────────── */
function normalizeMemoryId(value) {
    if (typeof value === 'number' && Number.isSafeInteger(value) && value > 0) {
        return value;
    }
    if (typeof value === 'string' && /^\d+$/.test(value)) {
        const parsed = Number.parseInt(value, 10);
        return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
    }
    return null;
}
function getRelevanceFeedback(database, memoryIds, queryText) {
    if (memoryIds.length === 0) {
        return new Map();
    }
    const adaptiveSignalEventsTable = database.prepare(`
    SELECT 1
    FROM sqlite_master
    WHERE type = 'table'
      AND name = 'adaptive_signal_events'
    LIMIT 1
  `).get();
    if (!adaptiveSignalEventsTable) {
        return new Map();
    }
    const placeholders = memoryIds.map(() => '?').join(', ');
    const queryFilterClause = queryText == null
        ? ''
        : ` AND (
      query = ?
      OR json_extract(metadata, '$.queryText') = ?
    )`;
    const signalRows = database.prepare(`
    SELECT
      memory_id,
      COALESCE(SUM(CASE WHEN signal_type = 'outcome' THEN signal_value ELSE 0 END), 0) AS outcome_total,
      COALESCE(SUM(CASE WHEN signal_type = 'correction' THEN signal_value ELSE 0 END), 0) AS correction_total
    FROM adaptive_signal_events
    WHERE signal_type IN ('outcome', 'correction')
      AND memory_id IN (${placeholders})
      ${queryFilterClause}
    GROUP BY memory_id
  `).all(...memoryIds, ...(queryText == null ? [] : [queryText, queryText]));
    if (signalRows.length === 0) {
        return new Map();
    }
    const rawSignalTotals = signalRows.map((row) => ({
        memoryId: row.memory_id,
        raw: row.outcome_total - row.correction_total,
    }));
    const maxAbsoluteSignalTotal = Math.max(...rawSignalTotals.map((row) => Math.abs(row.raw)), 0);
    const relevanceByMemoryId = new Map();
    if (maxAbsoluteSignalTotal === 0) {
        for (const row of rawSignalTotals) {
            relevanceByMemoryId.set(row.memoryId, 0.5);
        }
        return relevanceByMemoryId;
    }
    for (const row of rawSignalTotals) {
        const normalizedScore = (row.raw + maxAbsoluteSignalTotal) / (2 * maxAbsoluteSignalTotal);
        relevanceByMemoryId.set(row.memoryId, normalizedScore);
    }
    return relevanceByMemoryId;
}
/**
 * Determine whether a new weekly evaluation cycle is due.
 */
function isShadowEvaluationDue(db, now = Date.now()) {
    const cycles = getCycleResults(db);
    if (cycles.length === 0) {
        return true;
    }
    const latestCycle = cycles[0];
    return now - latestCycle.evaluatedAt >= EVALUATION_WINDOW_MS;
}
/**
 * Load a recent pool of distinct production queries from consumption telemetry.
 */
function loadRecentSearchQueries(db, now, queryLookbackMs, maxQueryPoolSize) {
    initConsumptionLog(db);
    const sinceIso = new Date(now - queryLookbackMs).toISOString();
    return db.prepare(`
    SELECT MAX(id) AS id, query_text
    FROM consumption_log
    WHERE event_type = 'search'
      AND query_text IS NOT NULL
      AND TRIM(query_text) != ''
      AND COALESCE(result_count, 0) > 0
      AND timestamp >= ?
    GROUP BY query_text
    ORDER BY MAX(timestamp) DESC
    LIMIT ?
  `).all(sinceIso, maxQueryPoolSize);
}
/**
 * Convert a production query text into the side-effect-free pipeline config
 * used for scheduled shadow replay.
 */
function buildReplayPipelineConfig(query, searchLimit) {
    return {
        query,
        searchType: 'hybrid',
        limit: searchLimit,
        includeArchived: false,
        includeConstitutional: true,
        includeContent: false,
        minState: 'ARCHIVED',
        applyStateLimits: false,
        useDecay: true,
        rerank: true,
        applyLengthPenalty: true,
        enableDedup: false,
        enableSessionBoost: isSessionBoostEnabled(),
        enableCausalBoost: isCausalBoostEnabled(),
        trackAccess: false,
        detectedIntent: null,
        intentConfidence: 0,
        intentWeights: null,
    };
}
/**
 * Extract live results plus the adaptive shadow proposal from a replayed query.
 */
function buildReplayRanks(database, liveRows, shadowRows, queryText) {
    if (liveRows.length === 0 || shadowRows.length === 0) {
        return null;
    }
    const memoryIds = Array.from(new Set([
        ...liveRows
            .map((row) => normalizeMemoryId(row.id))
            .filter((memoryId) => memoryId !== null),
        ...shadowRows
            .map((row) => normalizeMemoryId(row.memoryId))
            .filter((memoryId) => memoryId !== null),
    ]));
    const relevanceFeedbackById = getRelevanceFeedback(database, memoryIds, queryText);
    if (relevanceFeedbackById.size === 0) {
        return null;
    }
    const live = [];
    for (let index = 0; index < liveRows.length; index += 1) {
        const row = liveRows[index];
        if (typeof row.id !== 'number' && typeof row.id !== 'string') {
            continue;
        }
        const resultId = String(row.id);
        const memoryId = normalizeMemoryId(row.id);
        const relevanceScore = memoryId !== null
            ? relevanceFeedbackById.get(memoryId)
            : undefined;
        live.push({
            resultId,
            rank: index + 1,
            relevanceScore,
        });
    }
    const shadow = [...shadowRows]
        .filter((row) => (typeof row.memoryId === 'number'
        && typeof row.shadowRank === 'number'
        && typeof row.shadowScore === 'number'))
        .sort((a, b) => a.shadowRank - b.shadowRank)
        .map((row) => ({
        resultId: String(row.memoryId),
        rank: row.shadowRank,
        relevanceScore: (() => {
            const memoryId = normalizeMemoryId(row.memoryId);
            return memoryId !== null
                ? relevanceFeedbackById.get(memoryId)
                : undefined;
        })(),
    }));
    if (live.length === 0 || shadow.length === 0) {
        return null;
    }
    return { live, shadow };
}
/**
 * Replay one query without emitting consumption or feedback side effects.
 */
async function replayQueryForShadowEvaluation(db, queryText, searchLimit) {
    const pipelineResult = await executePipeline(buildReplayPipelineConfig(queryText, searchLimit));
    const liveRows = pipelineResult.results;
    const shadowProposal = buildAdaptiveShadowProposal(db, queryText, pipelineResult.results);
    if (!shadowProposal) {
        return null;
    }
    return buildReplayRanks(db, liveRows, shadowProposal.rows, queryText);
}
/**
 * Prepare replay ranks for the deterministic holdout subset only.
 */
async function buildHoldoutReplayMap(db, queries, holdoutPercent, seed, searchLimit) {
    const queryIdToText = new Map();
    const allQueryIds = queries.map((row) => {
        const queryId = `consumption:${row.id}`;
        queryIdToText.set(queryId, row.query_text);
        return queryId;
    });
    const holdoutQueryIds = selectHoldoutQueries(allQueryIds, { holdoutPercent, seed });
    const replayed = new Map();
    for (const queryId of holdoutQueryIds) {
        const queryText = queryIdToText.get(queryId);
        if (!queryText) {
            continue;
        }
        try {
            const ranks = await replayQueryForShadowEvaluation(db, queryText, searchLimit);
            if (ranks) {
                replayed.set(queryId, ranks);
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.warn(`[shadow-evaluation-runtime] query replay failed for ${queryId}: ${message}`);
        }
    }
    return replayed;
}
/* ───────────────────────────────────────────────────────────────
   5. RUNTIME
──────────────────────────────────────────────────────────────── */
/**
 * Run one fail-safe production shadow evaluation cycle when a weekly run is due.
 */
async function runScheduledShadowEvaluationCycle(db, options = {}) {
    if (!isShadowFeedbackEnabled()) {
        return null;
    }
    if (evaluationInFlight) {
        return null;
    }
    const now = Date.now();
    const holdoutPercent = options.holdoutPercent ?? DEFAULT_HOLDOUT_PERCENT;
    const maxQueryPoolSize = options.maxQueryPoolSize ?? DEFAULT_MAX_QUERY_POOL_SIZE;
    const queryLookbackMs = options.queryLookbackMs ?? DEFAULT_QUERY_LOOKBACK_MS;
    const searchLimit = options.searchLimit ?? DEFAULT_SEARCH_LIMIT;
    const seed = options.seed ?? DEFAULT_SEED;
    if (!isShadowEvaluationDue(db, now)) {
        return null;
    }
    evaluationInFlight = true;
    try {
        await checkDatabaseUpdated();
        if (!isEmbeddingModelReady()) {
            const modelReady = await waitForEmbeddingModel(30_000);
            if (!modelReady) {
                console.warn('[shadow-evaluation-runtime] skipped cycle: embedding model not ready');
                return null;
            }
        }
        const queryRows = loadRecentSearchQueries(db, now, queryLookbackMs, maxQueryPoolSize);
        if (queryRows.length === 0) {
            console.warn('[shadow-evaluation-runtime] skipped cycle: no recent search queries available');
            return null;
        }
        const replayed = await buildHoldoutReplayMap(db, queryRows, holdoutPercent, seed, searchLimit);
        if (replayed.size === 0) {
            console.warn('[shadow-evaluation-runtime] skipped cycle: no holdout queries produced shadow proposals');
            return null;
        }
        const evaluatedQueryIds = [...replayed.keys()];
        const evaluatedAt = Date.now();
        const cycleId = `shadow-eval-${evaluatedAt}`;
        const report = runShadowEvaluation(db, evaluatedQueryIds, (queryId) => replayed.get(queryId)?.live ?? [], (queryId) => replayed.get(queryId)?.shadow ?? [], {
            holdoutPercent: 1,
            seed,
            cycleId,
            evaluatedAt,
        });
        if (report) {
            console.warn(`[shadow-evaluation-runtime] cycle ${report.cycleId}: ${report.cycleResult.queryCount} holdout queries, `
                + `meanNdcgDelta=${report.cycleResult.meanNdcgDelta.toFixed(4)}, `
                + `recommendation=${report.promotionGate.recommendation}`);
            if (getAdaptiveMode() !== 'disabled' && report.promotionGate) {
                try {
                    tuneAdaptiveThresholdsAfterEvaluation(db, report.promotionGate);
                }
                catch (err) {
                    console.warn('[shadow-evaluation-runtime] threshold tuning skipped/failed:', err);
                }
            }
        }
        return report;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn('[shadow-evaluation-runtime] scheduled cycle failed:', message);
        return null;
    }
    finally {
        evaluationInFlight = false;
    }
}
/**
 * Start the production shadow evaluation scheduler.
 */
function startShadowEvaluationScheduler(db, options = {}) {
    if (!isShadowFeedbackEnabled()) {
        return false;
    }
    if (schedulerTimer) {
        return false;
    }
    const intervalMs = options.intervalMs ?? DEFAULT_SCHEDULER_INTERVAL_MS;
    void runScheduledShadowEvaluationCycle(db, options);
    schedulerTimer = setInterval(() => {
        void runScheduledShadowEvaluationCycle(db, options);
    }, intervalMs);
    if (typeof schedulerTimer.unref === 'function') {
        schedulerTimer.unref();
    }
    return true;
}
/**
 * Stop the production shadow evaluation scheduler.
 */
function stopShadowEvaluationScheduler() {
    if (!schedulerTimer) {
        return false;
    }
    clearInterval(schedulerTimer);
    schedulerTimer = null;
    return true;
}
/**
 * Check whether the shadow evaluation scheduler is currently running.
 */
function isShadowEvaluationSchedulerRunning() {
    return schedulerTimer !== null;
}
/* ───────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */
export { DEFAULT_SCHEDULER_INTERVAL_MS, DEFAULT_QUERY_LOOKBACK_MS, DEFAULT_MAX_QUERY_POOL_SIZE, DEFAULT_SEARCH_LIMIT, DEFAULT_SEED, isShadowEvaluationDue, isShadowEvaluationSchedulerRunning, runScheduledShadowEvaluationCycle, startShadowEvaluationScheduler, stopShadowEvaluationScheduler, };
//# sourceMappingURL=shadow-evaluation-runtime.js.map