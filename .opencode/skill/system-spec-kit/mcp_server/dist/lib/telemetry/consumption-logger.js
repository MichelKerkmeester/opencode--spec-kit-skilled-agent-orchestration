// ───────────────────────────────────────────────────────────────
// MODULE: Consumption Logger (T004 — Agent Ux Instrumentation)
// ───────────────────────────────────────────────────────────────
// Feature catalog: Agent consumption instrumentation
// Logs agent consumption events to a SQLite table for G-NEW-2
// Requirement analysis: what agents query, what results they get,
// And (via hooks) which results they actually use.
//
// Table: consumption_log
// Feature flag: SPECKIT_CONSUMPTION_LOG (graduated, default ON)
import Database from 'better-sqlite3';
import { isFeatureEnabled } from '../cognitive/rollout-policy.js';
/* ───────────────────────────────────────────────────────────────
   2. FEATURE FLAG
──────────────────────────────────────────────────────────────── */
/**
 * Returns true when SPECKIT_CONSUMPTION_LOG is enabled (graduated, default ON).
 */
function isConsumptionLogEnabled() {
    return isFeatureEnabled('SPECKIT_CONSUMPTION_LOG');
}
/* ───────────────────────────────────────────────────────────────
   3. TABLE INITIALIZATION
──────────────────────────────────────────────────────────────── */
/**
 * Create consumption_log table if it doesn't exist.
 * Safe to call multiple times (idempotent).
 */
function initConsumptionLog(db) {
    db.exec(`
    CREATE TABLE IF NOT EXISTS consumption_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      query_text TEXT,
      intent TEXT,
      mode TEXT,
      result_count INTEGER,
      result_ids TEXT,
      session_id TEXT,
      timestamp TEXT,
      latency_ms REAL,
      spec_folder_filter TEXT,
      metadata TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_consumption_log_event_type
      ON consumption_log (event_type);

    CREATE INDEX IF NOT EXISTS idx_consumption_log_session_id
      ON consumption_log (session_id);

    CREATE INDEX IF NOT EXISTS idx_consumption_log_timestamp
      ON consumption_log (timestamp);
  `);
}
/* ───────────────────────────────────────────────────────────────
   4. EVENT LOGGING
──────────────────────────────────────────────────────────────── */
/**
 * Insert a consumption event row.
 * FAIL-SAFE: never throws — all errors are swallowed to ensure
 * instrumentation never causes the calling handler to fail.
 */
function logConsumptionEvent(db, event) {
    if (!isConsumptionLogEnabled())
        return;
    try {
        const resultIdsJson = Array.isArray(event.result_ids) && event.result_ids.length > 0
            ? JSON.stringify(event.result_ids)
            : null;
        const metadataJson = event.metadata && typeof event.metadata === 'object'
            ? JSON.stringify(event.metadata)
            : null;
        db.prepare(`
      INSERT INTO consumption_log
        (event_type, query_text, intent, mode, result_count, result_ids,
         session_id, timestamp, latency_ms, spec_folder_filter, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(event.event_type, event.query_text ?? null, event.intent ?? null, event.mode ?? null, event.result_count ?? null, resultIdsJson, event.session_id ?? null, new Date().toISOString(), event.latency_ms ?? null, event.spec_folder_filter ?? null, metadataJson);
    }
    catch (err) {
        console.warn('[consumption-logger] logConsumptionEvent warning:', err instanceof Error ? err.message : String(err));
    }
}
/* ───────────────────────────────────────────────────────────────
   5. STATS AGGREGATION
──────────────────────────────────────────────────────────────── */
/**
 * Return aggregate statistics from consumption_log.
 * Returns default empty stats if the table doesn't exist or query fails.
 */
function getConsumptionStats(db, options = {}) {
    const defaultStats = {
        total_events: 0,
        by_event_type: {},
        avg_result_count: 0,
        avg_latency_ms: 0,
        zero_result_queries: 0,
        unique_sessions: 0,
    };
    try {
        const conditions = [];
        const params = [];
        if (options.event_type) {
            conditions.push('event_type = ?');
            params.push(options.event_type);
        }
        if (options.session_id) {
            conditions.push('session_id = ?');
            params.push(options.session_id);
        }
        if (options.since) {
            conditions.push('timestamp >= ?');
            params.push(options.since);
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        // Total events
        const totalRow = db.prepare(`SELECT COUNT(*) as cnt FROM consumption_log ${whereClause}`).get(...params);
        const total = totalRow?.cnt ?? 0;
        if (total === 0)
            return defaultStats;
        // By event type
        const byTypeRows = db.prepare(`
      SELECT event_type, COUNT(*) as cnt
      FROM consumption_log ${whereClause}
      GROUP BY event_type
    `).all(...params);
        const by_event_type = {};
        for (const row of byTypeRows) {
            by_event_type[row.event_type] = row.cnt;
        }
        // Averages
        const avgRow = db.prepare(`
      SELECT
        AVG(result_count) as avg_results,
        AVG(latency_ms) as avg_latency
      FROM consumption_log ${whereClause}
    `).get(...params);
        // Zero-result queries
        const zeroResultConditions = [...conditions, 'result_count = 0'];
        const zeroWhereClause = `WHERE ${zeroResultConditions.join(' AND ')}`;
        const zeroRow = db.prepare(`SELECT COUNT(*) as cnt FROM consumption_log ${zeroWhereClause}`).get(...params);
        // Unique sessions (add session_id IS NOT NULL to existing conditions)
        const sessionConditions = [...conditions, 'session_id IS NOT NULL'];
        const sessionWhereClause = `WHERE ${sessionConditions.join(' AND ')}`;
        const sessionRow = db.prepare(`
      SELECT COUNT(DISTINCT session_id) as cnt
      FROM consumption_log ${sessionWhereClause}
    `).get(...params);
        return {
            total_events: total,
            by_event_type,
            avg_result_count: Number((avgRow?.avg_results ?? 0).toFixed(2)),
            avg_latency_ms: Number((avgRow?.avg_latency ?? 0).toFixed(2)),
            zero_result_queries: zeroRow?.cnt ?? 0,
            unique_sessions: sessionRow?.cnt ?? 0,
        };
    }
    catch (err) {
        console.warn('[consumption-logger] getConsumptionStats warning:', err instanceof Error ? err.message : String(err));
        return defaultStats;
    }
}
/* ───────────────────────────────────────────────────────────────
   6. PATTERN DETECTION
──────────────────────────────────────────────────────────────── */
/**
 * Identify consumption pattern categories from logged events.
 *
 * Returns at least 5 categories:
 * 1. high-frequency-query   — queries repeated >3 times
 * 2. zero-result            — queries returning 0 results
 * 3. low-selection          — result_count < threshold (proxy for low relevance)
 * 4. intent-mismatch        — same query_text with different intents across calls
 * 5. session-heavy          — sessions with >10 queries
 */
function getConsumptionPatterns(db, options = {}) {
    const exampleLimit = options.limit ?? 5;
    const patterns = [];
    try {
        // 1. High-frequency queries (repeated >3 times)
        try {
            const highFreqRows = db.prepare(`
        SELECT query_text, COUNT(*) as cnt
        FROM consumption_log
        WHERE query_text IS NOT NULL AND query_text != ''
        GROUP BY query_text
        HAVING COUNT(*) > 3
        ORDER BY cnt DESC
        LIMIT ?
      `).all(exampleLimit);
            patterns.push({
                category: 'high-frequency-query',
                description: 'Queries repeated more than 3 times — may indicate missing context or poor result quality',
                count: highFreqRows.length,
                examples: highFreqRows.map(r => `"${r.query_text}" (${r.cnt}x)`),
            });
        }
        catch (err) {
            console.warn('[consumption-logger] getConsumptionPatterns high-frequency warning:', err instanceof Error ? err.message : String(err));
            patterns.push({ category: 'high-frequency-query', description: 'Queries repeated more than 3 times', count: 0, examples: [] });
        }
        // 2. Zero-result queries
        try {
            const zeroRows = db.prepare(`
        SELECT query_text, COUNT(*) as cnt
        FROM consumption_log
        WHERE result_count = 0
          AND query_text IS NOT NULL
        GROUP BY query_text
        ORDER BY cnt DESC
        LIMIT ?
      `).all(exampleLimit);
            const totalZeroRow = db.prepare(`SELECT COUNT(*) as cnt FROM consumption_log WHERE result_count = 0`).get();
            patterns.push({
                category: 'zero-result',
                description: 'Queries that returned 0 results — gaps in memory coverage',
                count: totalZeroRow?.cnt ?? 0,
                examples: zeroRows.map(r => `"${r.query_text}" (${r.cnt}x)`),
            });
        }
        catch (err) {
            console.warn('[consumption-logger] getConsumptionPatterns zero-result warning:', err instanceof Error ? err.message : String(err));
            patterns.push({ category: 'zero-result', description: 'Queries returning 0 results', count: 0, examples: [] });
        }
        // 3. Low-selection queries (result_count > 0 but ≤ 2 — proxy for low relevance)
        try {
            const lowSelectRows = db.prepare(`
        SELECT query_text,
               MIN(result_count) as min_result_count,
               MAX(result_count) as max_result_count,
               COUNT(*) as cnt
        FROM consumption_log
        WHERE result_count > 0 AND result_count <= 2
          AND query_text IS NOT NULL
        GROUP BY query_text
        ORDER BY cnt DESC
        LIMIT ?
      `).all(exampleLimit);
            const totalLowRow = db.prepare(`SELECT COUNT(*) as cnt FROM consumption_log WHERE result_count > 0 AND result_count <= 2`).get();
            patterns.push({
                category: 'low-selection',
                description: 'Queries returning ≤2 results — potential relevance issues or sparse index coverage',
                count: totalLowRow?.cnt ?? 0,
                examples: lowSelectRows.map(r => {
                    if (r.min_result_count === r.max_result_count) {
                        return `"${r.query_text}" (${r.min_result_count} results)`;
                    }
                    return `"${r.query_text}" (${r.min_result_count}-${r.max_result_count} results)`;
                }),
            });
        }
        catch (err) {
            console.warn('[consumption-logger] getConsumptionPatterns low-selection warning:', err instanceof Error ? err.message : String(err));
            patterns.push({ category: 'low-selection', description: 'Queries returning fewer than 3 results', count: 0, examples: [] });
        }
        // 4. Intent-mismatch queries (same query_text with different intents)
        try {
            const mismatchRows = db.prepare(`
        SELECT query_text, COUNT(DISTINCT intent) as intent_variants, GROUP_CONCAT(DISTINCT intent) as intents
        FROM consumption_log
        WHERE query_text IS NOT NULL AND intent IS NOT NULL
        GROUP BY query_text
        HAVING COUNT(DISTINCT intent) > 1
        ORDER BY intent_variants DESC
        LIMIT ?
      `).all(exampleLimit);
            patterns.push({
                category: 'intent-mismatch',
                description: 'Queries classified with different intents across calls — unstable intent classification',
                count: mismatchRows.length,
                examples: mismatchRows.map(r => `"${r.query_text}" → [${r.intents}]`),
            });
        }
        catch (err) {
            console.warn('[consumption-logger] getConsumptionPatterns intent-mismatch warning:', err instanceof Error ? err.message : String(err));
            patterns.push({ category: 'intent-mismatch', description: 'Same query classified with different intents', count: 0, examples: [] });
        }
        // 5. Session-heavy (sessions with >10 queries)
        try {
            const heavySessionRows = db.prepare(`
        SELECT session_id, COUNT(*) as query_count
        FROM consumption_log
        WHERE session_id IS NOT NULL
        GROUP BY session_id
        HAVING COUNT(*) > 10
        ORDER BY query_count DESC
        LIMIT ?
      `).all(exampleLimit);
            patterns.push({
                category: 'session-heavy',
                description: 'Sessions with >10 queries — may indicate context thrashing or inefficient retrieval patterns',
                count: heavySessionRows.length,
                examples: heavySessionRows.map(r => {
                    const sid = r.session_id.length > 36 ? r.session_id.substring(0, 36) + '...' : r.session_id;
                    return `session:${sid} (${r.query_count} queries)`;
                }),
            });
        }
        catch (err) {
            console.warn('[consumption-logger] getConsumptionPatterns session-heavy warning:', err instanceof Error ? err.message : String(err));
            patterns.push({ category: 'session-heavy', description: 'Sessions with more than 10 queries', count: 0, examples: [] });
        }
    }
    catch (err) {
        console.warn('[consumption-logger] getConsumptionPatterns warning:', err instanceof Error ? err.message : String(err));
    }
    return patterns;
}
/* ───────────────────────────────────────────────────────────────
   7. EXPORTS
──────────────────────────────────────────────────────────────── */
export { isConsumptionLogEnabled, initConsumptionLog, logConsumptionEvent, getConsumptionStats, getConsumptionPatterns, };
//# sourceMappingURL=consumption-logger.js.map