// ───────────────────────────────────────────────────────────────
// MODULE: Memory State Baseline Metrics
// ───────────────────────────────────────────────────────────────
// Feature catalog: Memory roadmap baseline snapshot
// Captures baseline retrieval/isolation metrics before phased rollout.
// Can optionally persist snapshots into eval_metric_snapshots.
import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';
import { getMemoryRoadmapDefaults } from '../config/capability-flags.js';
import { DEFAULT_DB_DIR, initEvalDb, getEvalDbPath } from './eval-db.js';

const CONTEXT_DB_FILENAME = 'context-index.sqlite';

interface MemoryStateBaselineSnapshot {
  capturedAt: string;
  evalRunId: number;
  specFolder: string | null;
  metrics: Record<string, number>;
  metadata: Record<string, unknown>;
  persistedRows?: number;
}

interface CaptureMemoryStateBaselineOptions {
  specFolder?: string | null;
  evalRunId?: number;
  persist?: boolean;
  metadata?: Record<string, unknown>;
  contextDbPath?: string;
}

function safeNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  return 0;
}

function safeScalarMetric(
  database: Database.Database,
  sql: string,
  params: unknown[] = [],
  field = 'value',
): number {
  try {
    const row = database.prepare(sql).get(...params) as Record<string, unknown> | undefined;
    if (!row) {
      return 0;
    }
    return safeNumber(row[field]);
  } catch (_error: unknown) {
    return 0;
  }
}

function resolveContextDbPath(explicitPath?: string): string {
  if (typeof explicitPath === 'string' && explicitPath.trim().length > 0) {
    return path.resolve(explicitPath.trim());
  }

  if (typeof process.env.MEMORY_DB_PATH === 'string' && process.env.MEMORY_DB_PATH.trim().length > 0) {
    return path.resolve(process.env.MEMORY_DB_PATH.trim());
  }

  return path.resolve(DEFAULT_DB_DIR, CONTEXT_DB_FILENAME);
}

function openContextDb(dbPath: string): Database.Database | null {
  if (!fs.existsSync(dbPath)) {
    return null;
  }

  try {
    return new Database(dbPath, { readonly: true, fileMustExist: true });
  } catch (_error: unknown) {
    return null;
  }
}

function buildMetrics(evalDb: Database.Database, contextDb: Database.Database | null): Record<string, number> {
  const metrics: Record<string, number> = {
    'retrieval.eval_queries_total': safeScalarMetric(
      evalDb,
      'SELECT COUNT(*) AS value FROM eval_queries',
    ),
    'retrieval.eval_channel_rows_total': safeScalarMetric(
      evalDb,
      'SELECT COUNT(*) AS value FROM eval_channel_results',
    ),
    'retrieval.avg_channel_hit_count': safeScalarMetric(
      evalDb,
      'SELECT COALESCE(AVG(hit_count), 0) AS value FROM eval_channel_results',
    ),
    'retrieval.avg_channel_latency_ms': safeScalarMetric(
      evalDb,
      'SELECT COALESCE(AVG(latency_ms), 0) AS value FROM eval_channel_results',
    ),
    'retrieval.eval_final_rows_total': safeScalarMetric(
      evalDb,
      'SELECT COUNT(*) AS value FROM eval_final_results',
    ),
    'retrieval.avg_final_latency_ms': safeScalarMetric(
      evalDb,
      'SELECT COALESCE(AVG(latency_ms), 0) AS value FROM eval_final_results',
    ),
  };

  if (!contextDb) {
    metrics['isolation.memory_rows_total'] = 0;
    metrics['isolation.distinct_spec_folders'] = 0;
    metrics['isolation.unscoped_rows'] = 0;
    metrics['isolation.missing_session_scope_rows'] = 0;
    metrics['isolation.unknown_context_type_rows'] = 0;
    metrics['schema.version'] = 0;
    return metrics;
  }

  metrics['isolation.memory_rows_total'] = safeScalarMetric(
    contextDb,
    'SELECT COUNT(*) AS value FROM memory_index',
  );
  metrics['isolation.distinct_spec_folders'] = safeScalarMetric(
    contextDb,
    "SELECT COUNT(DISTINCT spec_folder) AS value FROM memory_index WHERE spec_folder IS NOT NULL AND TRIM(spec_folder) != ''",
  );
  metrics['isolation.unscoped_rows'] = safeScalarMetric(
    contextDb,
    "SELECT COUNT(*) AS value FROM memory_index WHERE spec_folder IS NULL OR TRIM(spec_folder) = ''",
  );
  metrics['isolation.missing_session_scope_rows'] = safeScalarMetric(
    contextDb,
    "SELECT COUNT(*) AS value FROM memory_index WHERE session_id IS NULL OR TRIM(session_id) = ''",
  );
  metrics['isolation.unknown_context_type_rows'] = safeScalarMetric(
    contextDb,
    "SELECT COUNT(*) AS value FROM memory_index WHERE context_type IS NULL OR TRIM(context_type) = '' OR context_type NOT IN ('research','implementation','planning','general','decision','discovery')",
  );
  metrics['schema.version'] = safeScalarMetric(
    contextDb,
    'SELECT version AS value FROM schema_version WHERE id = 1',
  );

  return metrics;
}

/**
 * Persist a captured baseline snapshot into eval metric history.
 *
 * @param snapshot - Baseline snapshot to persist.
 * @param evalDb - Eval database that stores metric snapshots.
 * @returns Number of rows written to `eval_metric_snapshots`.
 */
function persistMemoryStateBaselineSnapshot(snapshot: MemoryStateBaselineSnapshot, evalDb: Database.Database): number {
  const insert = evalDb.prepare(`
    INSERT INTO eval_metric_snapshots (eval_run_id, metric_name, metric_value, channel, query_count, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const metadata = JSON.stringify(snapshot.metadata);
  let persisted = 0;

  for (const [metricName, metricValue] of Object.entries(snapshot.metrics)) {
    insert.run(snapshot.evalRunId, metricName, metricValue, 'memory-state-baseline', null, metadata);
    persisted += 1;
  }

  return persisted;
}

/**
 * Capture baseline retrieval and isolation metrics for readiness.
 *
 * @param options - Snapshot configuration and optional persistence controls.
 * @returns Baseline snapshot for the current eval and context databases.
 */
function captureMemoryStateBaselineSnapshot(
  options: CaptureMemoryStateBaselineOptions = {},
): MemoryStateBaselineSnapshot {
  const contextDbPath = resolveContextDbPath(options.contextDbPath);
  const targetEvalDbDir = path.dirname(contextDbPath);
  const previousEvalDbPath = getEvalDbPath();

  // H17 FIX: Wrap the entire path switch in try/finally so the previous DB is
  // restored even when initEvalDb() fails after closing the prior singleton.
  let evalDb: ReturnType<typeof initEvalDb> | null = null;
  let contextDb: ReturnType<typeof openContextDb> | null = null;
  try {
    evalDb = initEvalDb(targetEvalDbDir);
    contextDb = openContextDb(contextDbPath);
    const defaults = getMemoryRoadmapDefaults();
    const evalRunId = options.evalRunId ?? -Math.floor(Date.now() / 1000);

    const metrics = buildMetrics(evalDb, contextDb);
    const snapshot: MemoryStateBaselineSnapshot = {
      capturedAt: new Date().toISOString(),
      evalRunId,
      specFolder: options.specFolder ?? null,
      metrics,
      metadata: {
        source: 'memory-state-baseline',
        phase: defaults.phase,
        capabilities: defaults.capabilities,
        scopeDimensionsTracked: defaults.scopeDimensionsTracked,
        contextDbPath,
        ...options.metadata,
      },
    };

    if (options.persist) {
      snapshot.persistedRows = persistMemoryStateBaselineSnapshot(snapshot, evalDb);
    }

    return snapshot;
  } finally {
    try {
      contextDb?.close();
    } catch (_error: unknown) {
      // Ignore close failures in baseline capture path
    }

    if (previousEvalDbPath && previousEvalDbPath !== path.join(targetEvalDbDir, 'speckit-eval.db')) {
      try { initEvalDb(path.dirname(previousEvalDbPath)); } catch (_: unknown) { /* best-effort restore */ }
    }
  }
}

export {
  captureMemoryStateBaselineSnapshot,
  persistMemoryStateBaselineSnapshot,
};

export type {
  CaptureMemoryStateBaselineOptions,
  MemoryStateBaselineSnapshot,
};
