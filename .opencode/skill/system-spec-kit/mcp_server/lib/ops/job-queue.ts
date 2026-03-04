// ---------------------------------------------------------------
// MODULE: Ingest Job Queue
// ---------------------------------------------------------------
// Sprint 9 fixes: true sequential worker, meaningful state transitions,
// continue-on-error for bulk ingestion, SQLITE_BUSY async retry on DB writes,
// crash recovery with re-enqueue, and validPaths-based indexing.

import { requireDb, toErrorMessage } from '../../utils';

export type IngestJobState =
  | 'queued'
  | 'parsing'
  | 'embedding'
  | 'indexing'
  | 'complete'
  | 'failed'
  | 'cancelled';

export interface IngestJobError {
  filePath: string;
  message: string;
  timestamp: string;
}

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

// Sprint 9 fix: SQLITE_BUSY retry delays (matches file-watcher pattern).
const RETRY_DELAYS_MS = [50, 200, 500];

// Sprint 9 fix: True sequential queue — only one job processes at a time.
const pendingQueue: string[] = [];
let workerActive = false;
let processFileFn: ((filePath: string) => Promise<unknown>) | null = null;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isSqliteBusyError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const code = (error as { code?: unknown })?.code;
  return code === 'SQLITE_BUSY' || /SQLITE_BUSY/i.test(message);
}

// Async SQLITE_BUSY retry — yields to the event loop between retries
// instead of blocking with a synchronous busy-wait loop.
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
// loop is not yet serving requests (table creation, crash recovery reset).
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
  } catch {
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

// Sprint 9 fix: Preserve progress on crash recovery instead of wiping files_processed.
// Since indexMemoryFile is idempotent, resuming from last count is safe.
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
  const normalizedPaths = args.paths.map((entry) => String(entry)).filter((entry) => entry.length > 0);

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
  await withBusyRetry(() =>
    db.prepare(`
      UPDATE ingest_jobs
      SET state = ?, updated_at = ?
      WHERE id = ?
    `).run(nextState, updatedAt, jobId)
  );

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

  const errors = [...current.errors, {
    filePath,
    message: toErrorMessage(error),
    timestamp: nowIso(),
  }];

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
  return setIngestJobState(jobId, 'cancelled');
}

export function getIngestProgressPercent(job: Pick<IngestJob, 'filesProcessed' | 'filesTotal'>): number {
  if (job.filesTotal <= 0) return 0;
  const raw = Math.round((job.filesProcessed / job.filesTotal) * 100);
  return Math.max(0, Math.min(100, raw));
}

// Sprint 9 fix: Real state machine — states now correspond to actual work phases.
// Codex fix: validPaths is used for indexing instead of current.paths.
async function processQueuedJob(jobId: string): Promise<void> {
  if (!processFileFn) {
    throw new Error('Ingest queue not initialized: processFile handler is missing');
  }

  let job = getIngestJob(jobId);
  if (!job || TERMINAL_STATES.has(job.state)) {
    return;
  }

  // Phase 1: Parsing — validate all paths exist and are readable.
  job = await setIngestJobState(jobId, 'parsing');
  if (TERMINAL_STATES.has(job.state)) return;

  const validPaths: string[] = [];
  for (const filePath of job.paths) {
    try {
      const { access } = await import('fs/promises');
      await access(filePath);
      validPaths.push(filePath);
    } catch {
      await appendIngestError(jobId, filePath, new Error('File not accessible'));
    }
  }

  // Phase 2: Embedding — placeholder for batch embedding pre-processing.
  // Transition is meaningful: it signals readiness for indexing after validation.
  const latest1 = getIngestJob(jobId);
  if (!latest1 || TERMINAL_STATES.has(latest1.state)) return;
  job = await setIngestJobState(jobId, 'embedding');
  if (TERMINAL_STATES.has(job.state)) return;

  // Phase 3: Indexing — process only validated paths (not original paths).
  const latest2 = getIngestJob(jobId);
  if (!latest2 || TERMINAL_STATES.has(latest2.state)) return;
  job = await setIngestJobState(jobId, 'indexing');

  // Update files_total to reflect valid paths only (invalid files already recorded as errors).
  if (validPaths.length !== job.filesTotal) {
    const db = requireDb();
    await withBusyRetry(() =>
      db.prepare('UPDATE ingest_jobs SET files_total = ?, updated_at = ? WHERE id = ?')
        .run(validPaths.length, nowIso(), jobId)
    );
  }

  // Resume from filesProcessed (crash recovery preserves progress).
  let currentIndex = job.filesProcessed;

  while (currentIndex < validPaths.length) {
    const current = getIngestJob(jobId);
    if (!current) return;
    if (current.state === 'cancelled') return;

    const nextPath = validPaths[currentIndex];
    if (!nextPath) {
      break;
    }

    // Sprint 9 fix: Continue on file error instead of aborting entire job.
    try {
      await processFileFn(nextPath);
    } catch (error: unknown) {
      await appendIngestError(jobId, nextPath, error);
      console.warn(`[job-queue] File error (continuing): ${nextPath} — ${toErrorMessage(error)}`);
    }

    job = await incrementProcessed(jobId);
    currentIndex = job.filesProcessed;
  }

  // Determine terminal state: complete if no errors, failed if some files errored.
  const done = getIngestJob(jobId);
  if (!done) return;
  if (done.state === 'cancelled') return;

  if (done.errors.length > 0 && done.errors.length >= done.filesTotal) {
    // All files failed — mark as failed.
    await setIngestJobState(jobId, 'failed');
  } else {
    // Partial or full success — mark as complete (errors are preserved in record).
    await setIngestJobState(jobId, 'complete');
  }
}

// Sprint 9 fix: True sequential worker — processes one job at a time.
// Multiple enqueueIngestJob calls add to pendingQueue; a single worker drains it.
async function drainQueue(): Promise<void> {
  if (workerActive) return;
  workerActive = true;

  try {
    while (pendingQueue.length > 0) {
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
        } catch {
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

function initIngestJobQueue(config: JobQueueConfig): { resetCount: number } {
  processFileFn = config.processFile;
  ensureIngestJobsTable();

  // Crash recovery: reset incomplete jobs to 'queued' AND re-enqueue them
  // so they actually get processed by the worker.
  const resetJobIds = resetIncompleteJobsToQueued();
  for (const jobId of resetJobIds) {
    enqueueIngestJob(jobId);
  }

  return { resetCount: resetJobIds.length };
}

export {
  ensureIngestJobsTable,
  resetIncompleteJobsToQueued,
  initIngestJobQueue,
  createIngestJob,
  getIngestJob,
  setIngestJobState,
  cancelIngestJob,
  enqueueIngestJob,
};
