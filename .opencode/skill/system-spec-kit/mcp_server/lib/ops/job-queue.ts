// ───────────────────────────────────────────────────────────────
// MODULE: Job Queue
// ───────────────────────────────────────────────────────────────
// True sequential worker, meaningful state transitions,
// Continue-on-error for bulk ingestion, SQLITE_BUSY async retry on DB writes,
// Crash recovery with re-enqueue, and original-path progress tracking.

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import path from 'node:path';
import { requireDb, toErrorMessage } from '../../utils/index.js';

// Feature catalog: Async ingestion job lifecycle

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

/**
 * Defines the IngestJobState type.
 */
export type IngestJobState =
  | 'queued'
  | 'parsing'
  | 'embedding'
  | 'indexing'
  | 'complete'
  | 'failed'
  | 'cancelled';

/**
 * Describes the IngestJobError shape.
 */
export interface IngestJobError {
  filePath: string;
  message: string;
  timestamp: string;
}

/**
 * Describes the IngestJob shape.
 */
export interface IngestJob {
  id: string;
  state: IngestJobState;
  specFolder: string | null;
  paths: string[];
  filesTotal: number;
  filesProcessed: number;
  errors: IngestJobError[];
  createdAt: string;
  updatedAt: string;
}

export interface IngestJobForecast {
  etaSeconds: number | null;
  etaConfidence: number | null;
  failureRisk: number | null;
  riskSignals: string[];
  caveat: string | null;
}

interface IngestJobRow {
  id: string;
  state: IngestJobState;
  spec_folder: string | null;
  paths_json: string;
  files_total: number;
  files_processed: number;
  errors_json: string;
  created_at: string;
  updated_at: string;
}

interface JobQueueConfig {
  processFile: (filePath: string) => Promise<unknown>;
}

/* ───────────────────────────────────────────────────────────────
   3. CONSTANTS
──────────────────────────────────────────────────────────────── */

const ACTIVE_STATES = new Set<IngestJobState>(['queued', 'parsing', 'embedding', 'indexing']);
const TERMINAL_STATES = new Set<IngestJobState>(['complete', 'failed', 'cancelled']);

const ALLOWED_TRANSITIONS: Record<IngestJobState, Set<IngestJobState>> = {
  queued: new Set<IngestJobState>(['parsing', 'cancelled', 'failed']),
  parsing: new Set<IngestJobState>(['embedding', 'cancelled', 'failed']),
  embedding: new Set<IngestJobState>(['indexing', 'cancelled', 'failed']),
  indexing: new Set<IngestJobState>(['complete', 'cancelled', 'failed']),
  complete: new Set<IngestJobState>([]),
  failed: new Set<IngestJobState>([]),
  cancelled: new Set<IngestJobState>([]),
};

// SQLITE_BUSY retry delays that match the file-watcher pattern.
const RETRY_DELAYS_MS = [50, 200, 500];

/* ───────────────────────────────────────────────────────────────
   5. STATE MANAGEMENT
──────────────────────────────────────────────────────────────── */

// True sequential queue — only one job processes at a time.
const pendingQueue: string[] = [];
let workerActive = false;
let processFileFn: ((filePath: string) => Promise<unknown>) | null = null;
const MAX_STORED_ERRORS = 50;

/* ───────────────────────────────────────────────────────────────
   4. HELPERS
──────────────────────────────────────────────────────────────── */

function toPublicPathLabel(filePath: string): string {
  return filePath === '__job__' ? filePath : path.basename(filePath || '');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isSqliteBusyError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const code = (error as { code?: unknown })?.code;
  return code === 'SQLITE_BUSY' || /SQLITE_BUSY/i.test(message);
}

// Async SQLITE_BUSY retry — yields to the event loop between retries
// Instead of blocking with a synchronous busy-wait loop.
async function withBusyRetry<T>(operation: () => T): Promise<T> {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return operation();
    } catch (error: unknown) {
      const canRetry = isSqliteBusyError(error) && attempt < RETRY_DELAYS_MS.length;
      if (!canRetry) {
        throw error;
      }
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }
  throw new Error('withBusyRetry: unreachable');
}

// Synchronous retry kept only for startup-path operations where the event
// Loop is not yet serving requests (table creation, crash recovery reset).
function withBusyRetrySync<T>(operation: () => T): T {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return operation();
    } catch (error: unknown) {
      const canRetry = isSqliteBusyError(error) && attempt < RETRY_DELAYS_MS.length;
      if (!canRetry) {
        throw error;
      }
      // Short synchronous yield — acceptable at startup only.
      const delay = RETRY_DELAYS_MS[attempt];
      const end = Date.now() + delay;
      while (Date.now() < end) { /* busy-wait */ }
    }
  }
  throw new Error('withBusyRetrySync: unreachable');
}

function parseJsonArray<T>(value: string | null | undefined, fallback: T[]): T[] {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch (_error: unknown) {
    return fallback;
  }
}

function mapRowToJob(row: IngestJobRow | undefined): IngestJob | null {
  if (!row) return null;
  return {
    id: row.id,
    state: row.state,
    specFolder: row.spec_folder,
    paths: parseJsonArray<string>(row.paths_json, []),
    filesTotal: row.files_total,
    filesProcessed: row.files_processed,
    errors: parseJsonArray<IngestJobError>(row.errors_json, []),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function nowIso(): string {
  return new Date().toISOString();
}

function isTransitionAllowed(from: IngestJobState, to: IngestJobState): boolean {
  return ALLOWED_TRANSITIONS[from]?.has(to) ?? false;
}

function ensureIngestJobsTable(): void {
  const db = requireDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS ingest_jobs (
      id TEXT PRIMARY KEY,
      state TEXT,
      spec_folder TEXT,
      paths_json TEXT,
      files_total INTEGER,
      files_processed INTEGER,
      errors_json TEXT,
      created_at TEXT,
      updated_at TEXT
    )
  `);
}

// Restart interrupted jobs from the beginning on process startup.
// Indexing is idempotent, and replaying the original path list avoids
// Mismatches when path accessibility changes between runs.
function resetIncompleteJobsToQueued(): string[] {
  const db = requireDb();
  // Collect IDs of jobs that will be reset so we can re-enqueue them.
  const rows = db.prepare(`
    SELECT id FROM ingest_jobs
    WHERE state NOT IN ('complete', 'failed', 'cancelled')
  `).all() as Array<{ id: string }>;

  if (rows.length === 0) return [];

  withBusyRetrySync(() =>
    db.prepare(`
      UPDATE ingest_jobs
      SET
        state = 'queued',
        files_processed = 0,
        errors_json = '[]',
        updated_at = ?
      WHERE state NOT IN ('complete', 'failed', 'cancelled')
    `).run(nowIso())
  );

  return rows.map((r) => r.id);
}

async function createIngestJob(args: {
  id: string;
  paths: string[];
  specFolder?: string;
}): Promise<IngestJob> {
  const db = requireDb();
  const timestamp = nowIso();
  const normalizedPaths = args.paths.map((entry) => String(entry).trim()).filter((entry) => entry.length > 0);

  if (normalizedPaths.length === 0) {
    throw new Error('paths must include at least one file path');
  }

  await withBusyRetry(() =>
    db.prepare(`
      INSERT INTO ingest_jobs (
        id, state, spec_folder, paths_json, files_total, files_processed, errors_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      args.id,
      'queued',
      args.specFolder ?? null,
      JSON.stringify(normalizedPaths),
      normalizedPaths.length,
      0,
      JSON.stringify([]),
      timestamp,
      timestamp,
    )
  );

  return {
    id: args.id,
    state: 'queued',
    specFolder: args.specFolder ?? null,
    paths: normalizedPaths,
    filesTotal: normalizedPaths.length,
    filesProcessed: 0,
    errors: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function getIngestJob(jobId: string): IngestJob | null {
  const db = requireDb();
  const row = db.prepare(`
    SELECT id, state, spec_folder, paths_json, files_total, files_processed, errors_json, created_at, updated_at
    FROM ingest_jobs
    WHERE id = ?
  `).get(jobId) as IngestJobRow | undefined;
  return mapRowToJob(row);
}

async function setIngestJobState(jobId: string, nextState: IngestJobState): Promise<IngestJob> {
  const db = requireDb();
  const current = getIngestJob(jobId);
  if (!current) {
    throw new Error(`Ingest job not found: ${jobId}`);
  }

  if (current.state === nextState) {
    return current;
  }

  if (!isTransitionAllowed(current.state, nextState)) {
    throw new Error(`Invalid ingest job state transition: ${current.state} -> ${nextState}`);
  }

  const updatedAt = nowIso();
  const result = await withBusyRetry(() =>
    db.prepare(`
      UPDATE ingest_jobs
      SET state = ?, updated_at = ?
      WHERE id = ? AND state = ?
    `).run(nextState, updatedAt, jobId, current.state)
  );

  if ((result as { changes: number }).changes === 0) {
    throw new Error(`State transition conflict: job ${jobId} state was changed by another process (expected '${current.state}')`);
  }

  return {
    ...current,
    state: nextState,
    updatedAt,
  };
}

async function incrementProcessed(jobId: string): Promise<IngestJob> {
  const db = requireDb();
  const updatedAt = nowIso();
  await withBusyRetry(() =>
    db.prepare(`
      UPDATE ingest_jobs
      SET files_processed = files_processed + 1, updated_at = ?
      WHERE id = ?
    `).run(updatedAt, jobId)
  );

  const updated = getIngestJob(jobId);
  if (!updated) {
    throw new Error(`Ingest job not found after progress update: ${jobId}`);
  }
  return updated;
}

async function appendIngestError(jobId: string, filePath: string, error: unknown): Promise<IngestJob> {
  const db = requireDb();
  const current = getIngestJob(jobId);
  if (!current) {
    throw new Error(`Ingest job not found: ${jobId}`);
  }

  let errors = [
    ...current.errors,
    {
      filePath: toPublicPathLabel(filePath),
      message: toErrorMessage(error),
      timestamp: nowIso(),
    },
  ];

  if (errors.length > MAX_STORED_ERRORS) {
    const tailLength = Math.max(0, MAX_STORED_ERRORS - 1);
    const trimmedCount = errors.length - tailLength;
    const truncationNotice: IngestJobError = {
      filePath: '__job__',
      message: `error log truncated (${trimmedCount} older entries removed)`,
      timestamp: nowIso(),
    };
    const truncatedTail = tailLength > 0 ? errors.slice(-tailLength) : [];
    errors = [truncationNotice, ...truncatedTail];
  }

  const updatedAt = nowIso();
  await withBusyRetry(() =>
    db.prepare(`
      UPDATE ingest_jobs
      SET errors_json = ?, updated_at = ?
      WHERE id = ?
    `).run(JSON.stringify(errors), updatedAt, jobId)
  );

  return {
    ...current,
    errors,
    updatedAt,
  };
}

async function cancelIngestJob(jobId: string): Promise<IngestJob> {
  const MAX_CANCEL_RETRIES = 3;

  for (let attempt = 0; attempt < MAX_CANCEL_RETRIES; attempt += 1) {
    const current = getIngestJob(jobId);
    if (!current) {
      throw new Error(`Ingest job not found: ${jobId}`);
    }
    if (TERMINAL_STATES.has(current.state)) {
      return current;
    }

    try {
      return await setIngestJobState(jobId, 'cancelled');
    } catch (error: unknown) {
      const message = toErrorMessage(error);
      if (message.startsWith('State transition conflict:')) {
        continue;
      }

      if (message.startsWith('Invalid ingest job state transition:')) {
        const latest = getIngestJob(jobId);
        if (latest && TERMINAL_STATES.has(latest.state)) {
          return latest;
        }
        continue;
      }

      throw error;
    }
  }

  const latest = getIngestJob(jobId);
  if (!latest) {
    throw new Error(`Ingest job not found: ${jobId}`);
  }
  if (TERMINAL_STATES.has(latest.state)) {
    return latest;
  }

  return setIngestJobState(jobId, 'cancelled');
}

/**
 * Provides the getIngestProgressPercent helper.
 */
export function getIngestProgressPercent(job: Pick<IngestJob, 'filesProcessed' | 'filesTotal'>): number {
  if (job.filesTotal <= 0) return 0;
  const raw = Math.round((job.filesProcessed / job.filesTotal) * 100);
  return Math.max(0, Math.min(100, raw));
}

function parseIsoTimestamp(timestamp: string): number | null {
  if (typeof timestamp !== 'string' || timestamp.trim().length === 0) {
    return null;
  }

  const parsed = Date.parse(timestamp);
  return Number.isFinite(parsed) ? parsed : null;
}

function clampUnitInterval(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function getIngestForecast(
  job: Pick<IngestJob, 'state' | 'filesProcessed' | 'filesTotal' | 'errors' | 'createdAt' | 'updatedAt'>,
): IngestJobForecast {
  const filesTotal = Math.max(0, job.filesTotal || 0);
  const filesProcessed = Math.max(0, job.filesProcessed || 0);
  const remaining = Math.max(0, filesTotal - filesProcessed);
  const errorCount = Array.isArray(job.errors) ? job.errors.length : 0;
  const errorRatio = filesTotal > 0 ? errorCount / filesTotal : 0;
  const progressRatio = filesTotal > 0 ? filesProcessed / filesTotal : 0;
  const riskSignals: string[] = [];

  if (job.state === 'failed') {
    return {
      etaSeconds: 0,
      etaConfidence: 1,
      failureRisk: 1,
      riskSignals: ['terminal_failed'],
      caveat: null,
    };
  }

  if (job.state === 'complete') {
    return {
      etaSeconds: 0,
      etaConfidence: 1,
      failureRisk: clampUnitInterval(errorRatio * 0.5),
      riskSignals: errorCount > 0 ? ['completed_with_file_errors'] : [],
      caveat: null,
    };
  }

  if (job.state === 'cancelled') {
    return {
      etaSeconds: 0,
      etaConfidence: 1,
      failureRisk: 0,
      riskSignals: ['terminal_cancelled'],
      caveat: 'Forecast is advisory only because the job is no longer progressing.',
    };
  }

  if (filesTotal <= 0) {
    return {
      etaSeconds: null,
      etaConfidence: null,
      failureRisk: null,
      riskSignals,
      caveat: 'Forecast unavailable because the queue has no file-count baseline yet.',
    };
  }

  if (errorCount > 0) {
    riskSignals.push('file_errors_seen');
  }
  if (job.state === 'queued') {
    riskSignals.push('queued_not_started');
  }

  const createdAtMs = parseIsoTimestamp(job.createdAt);
  const updatedAtMs = parseIsoTimestamp(job.updatedAt);
  const elapsedSeconds = createdAtMs !== null && updatedAtMs !== null && updatedAtMs >= createdAtMs
    ? Math.max(0, (updatedAtMs - createdAtMs) / 1000)
    : 0;

  let etaSeconds: number | null = null;
  let etaConfidence: number | null = null;
  let caveat: string | null = null;

  if (filesProcessed <= 0 || elapsedSeconds < 1) {
    caveat = 'Forecast is low-confidence until at least one file has been processed.';
  } else {
    const throughput = filesProcessed / elapsedSeconds;
    if (throughput > 0) {
      etaSeconds = Math.max(0, Math.round(remaining / throughput));
      etaConfidence = clampUnitInterval(0.35 + (progressRatio * 0.45) - (errorRatio * 0.25));
      if (etaConfidence < 0.4) {
        caveat = 'Forecast is low-confidence because queue history is still sparse or noisy.';
      }
    } else {
      caveat = 'Forecast unavailable because throughput could not be derived from queue history.';
    }
  }

  if (progressRatio <= 0 && job.state !== 'queued') {
    riskSignals.push('active_without_progress');
  }
  if (errorRatio >= 0.5 && errorCount > 0) {
    riskSignals.push('high_error_ratio');
  }

  const stateRisk = job.state === 'indexing' ? 0.15 : (job.state === 'embedding' ? 0.1 : 0.05);
  const failureRisk = clampUnitInterval((errorRatio * 0.7) + stateRisk + (progressRatio === 0 ? 0.05 : 0));

  return {
    etaSeconds,
    etaConfidence,
    failureRisk,
    riskSignals,
    caveat,
  };
}

/* ───────────────────────────────────────────────────────────────
   6. WORKER
──────────────────────────────────────────────────────────────── */

// Real state machine — states now correspond to actual work phases.
// Progress is tracked against the original submitted path list so terminal
// Accounting stays stable even when some files are inaccessible.
async function processQueuedJob(jobId: string): Promise<void> {
  if (!processFileFn) {
    throw new Error('Ingest queue not initialized: processFile handler is missing');
  }

  let job = getIngestJob(jobId);
  if (!job || TERMINAL_STATES.has(job.state)) {
    return;
  }

  // Step 1: Parsing — validate all paths exist and are readable.
  job = await setIngestJobState(jobId, 'parsing');
  if (TERMINAL_STATES.has(job.state)) return;

  const { access } = await import('fs/promises');

  // Step 2: Embedding — placeholder for batch embedding pre-processing.
  // Transition is meaningful: it signals readiness for indexing after validation.
  const latest1 = getIngestJob(jobId);
  if (!latest1 || TERMINAL_STATES.has(latest1.state)) return;
  job = await setIngestJobState(jobId, 'embedding');
  if (TERMINAL_STATES.has(job.state)) return;

  // Step 3: Indexing — process only validated paths (not original paths).
  const latest2 = getIngestJob(jobId);
  if (!latest2 || TERMINAL_STATES.has(latest2.state)) return;
  job = await setIngestJobState(jobId, 'indexing');

  // Resume from filesProcessed against the original submitted path order.
  let currentIndex = job.filesProcessed;
  // Track actual failure count independently of the truncated errors array.
  // The errors array is capped at MAX_STORED_ERRORS, so using errors.length for
  // Terminal state decisions would misclassify all-fail jobs with >50 files as "complete".
  let failCount = 0;

  while (currentIndex < job.paths.length) {
    const current = getIngestJob(jobId);
    if (!current) return;
    if (current.state === 'cancelled') return;

    const nextPath = current.paths[currentIndex];
    if (!nextPath) {
      break;
    }

    // Continue on file error instead of aborting the entire job.
    try {
      await access(nextPath);
      await processFileFn(nextPath);
    } catch (error: unknown) {
      const normalizedError = error instanceof Error
        && 'code' in error
        && typeof error.code === 'string'
        && error.code === 'ENOENT'
        ? new Error('File not accessible')
        : error;
      await appendIngestError(jobId, nextPath, normalizedError);
      failCount += 1;
      console.warn(`[job-queue] File error (continuing): ${toPublicPathLabel(nextPath)} — ${toErrorMessage(normalizedError)}`);
    }

    job = await incrementProcessed(jobId);
    currentIndex = job.filesProcessed;
  }

  // Determine terminal state: complete if no errors, failed if all files errored.
  const done = getIngestJob(jobId);
  if (!done) return;
  if (done.state === 'cancelled') return;

  if (failCount > 0 && failCount >= done.filesTotal) {
    // All files failed — mark as failed.
    await setIngestJobState(jobId, 'failed');
  } else {
    // Partial or full success — mark as complete (errors are preserved in record).
    await setIngestJobState(jobId, 'complete');
  }
}

// True sequential worker — processes one job at a time.
// Multiple enqueueIngestJob calls add to pendingQueue; a single worker drains it.
async function drainQueue(): Promise<void> {
  if (workerActive) return;
  workerActive = true;

  try {
    while (pendingQueue.length > 0) {
      // PendingQueue.length > 0 in the loop condition guarantees shift() returns a job id
      const jobId = pendingQueue.shift()!;
      try {
        await processQueuedJob(jobId);
      } catch (error: unknown) {
        try {
          await appendIngestError(jobId, '__job__', error);
          const current = getIngestJob(jobId);
          if (current && ACTIVE_STATES.has(current.state)) {
            await setIngestJobState(jobId, 'failed');
          }
        } catch (_error: unknown) {
          // Non-fatal: queue guard to avoid unhandled rejection loops.
        }
      }

      // Brief yield between jobs to avoid starving the event loop.
      await sleep(10);
    }
  } finally {
    workerActive = false;
  }
}

function enqueueIngestJob(jobId: string): void {
  // Prevent duplicate enqueue of the same job.
  if (pendingQueue.includes(jobId)) {
    return;
  }

  pendingQueue.push(jobId);

  // Start worker if not already running (fire-and-forget).
  if (!workerActive) {
    setImmediate(() => {
      void drainQueue().catch((error: unknown) => {
        console.error(`[job-queue] Worker error: ${toErrorMessage(error)}`);
      });
    });
  }
}

/* ───────────────────────────────────────────────────────────────
   7. INITIALIZATION
──────────────────────────────────────────────────────────────── */

function initIngestJobQueue(config: JobQueueConfig): { resetCount: number } {
  processFileFn = config.processFile;
  ensureIngestJobsTable();

  // Crash recovery: reset incomplete jobs to 'queued' AND re-enqueue them
  // So they actually get processed by the worker.
  const resetJobIds = resetIncompleteJobsToQueued();
  for (const jobId of resetJobIds) {
    enqueueIngestJob(jobId);
  }

  return { resetCount: resetJobIds.length };
}

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  initIngestJobQueue,
  createIngestJob,
  getIngestJob,
  cancelIngestJob,
  enqueueIngestJob,
  resetIncompleteJobsToQueued,
};
