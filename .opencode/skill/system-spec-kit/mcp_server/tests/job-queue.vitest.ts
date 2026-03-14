// TEST: Ingest Job Queue
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

type JobQueueModule = typeof import('../lib/ops/job-queue');

const tempFiles: string[] = [];
const databases: Array<Database.Database> = [];

function createTempFile(content = 'job queue test'): string {
  const filePath = path.join(
    os.tmpdir(),
    `spec-kit-job-queue-${Date.now()}-${Math.random().toString(36).slice(2)}.md`
  );
  fs.writeFileSync(filePath, content, 'utf8');
  tempFiles.push(filePath);
  return filePath;
}

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE ingest_jobs (
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
  databases.push(db);
  return db;
}

async function loadJobQueueModule(db: Database.Database): Promise<JobQueueModule> {
  vi.resetModules();
  vi.doMock('../utils', () => ({
    requireDb: () => db,
    toErrorMessage: (error: unknown) => error instanceof Error ? error.message : String(error),
  }));
  return await import('../lib/ops/job-queue');
}

async function waitFor(
  predicate: () => boolean,
  options: { timeoutMs?: number; intervalMs?: number } = {}
): Promise<void> {
  const timeoutMs = options.timeoutMs ?? 3000;
  const intervalMs = options.intervalMs ?? 20;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (predicate()) {
      return;
    }
    await delay(intervalMs);
  }

  throw new Error(`Timed out waiting for condition after ${timeoutMs}ms`);
}

afterEach(() => {
  while (tempFiles.length > 0) {
    const filePath = tempFiles.pop();
    if (filePath) {
      try {
        fs.unlinkSync(filePath);
      } catch {
        // Ignore cleanup failures
      }
    }
  }

  while (databases.length > 0) {
    const db = databases.pop();
    if (db) {
      db.close();
    }
  }

  vi.resetModules();
  vi.restoreAllMocks();
});

describe('ingest job queue crash recovery', () => {
  it('resets incomplete jobs to queued from a clean cursor', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);

    db.prepare(`
      INSERT INTO ingest_jobs (
        id, state, spec_folder, paths_json, files_total, files_processed, errors_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'job_recover',
      'indexing',
      'specs/test',
      JSON.stringify(['/tmp/a.md', '/tmp/b.md']),
      2,
      1,
      JSON.stringify([{ filePath: '/tmp/a.md', message: 'boom', timestamp: '2026-03-06T00:00:00.000Z' }]),
      '2026-03-06T00:00:00.000Z',
      '2026-03-06T00:00:00.000Z',
    );

    expect(mod.resetIncompleteJobsToQueued()).toEqual(['job_recover']);

    const row = db.prepare(`
      SELECT state, files_processed, errors_json
      FROM ingest_jobs
      WHERE id = ?
    `).get('job_recover') as { state: string; files_processed: number; errors_json: string };

    expect(row.state).toBe('queued');
    expect(row.files_processed).toBe(0);
    expect(JSON.parse(row.errors_json)).toEqual([]);
  });
});

describe('ingest job queue processing', () => {
  it('marks partial-success jobs complete while preserving per-file errors', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);
    mod.initIngestJobQueue({
      processFile: async () => undefined,
    });

    const accessibleFile = createTempFile('accessible');
    const missingFile = path.join(os.tmpdir(), `spec-kit-missing-${Date.now()}.md`);

    const job = await mod.createIngestJob({
      id: 'job_partial',
      paths: [accessibleFile, missingFile],
      specFolder: 'specs/test',
    });

    mod.enqueueIngestJob(job.id);
    await waitFor(() => {
      const current = mod.getIngestJob(job.id);
      return current?.state === 'complete' || current?.state === 'failed';
    });

    const updated = mod.getIngestJob(job.id);
    expect(updated?.state).toBe('complete');
    expect(updated?.filesTotal).toBe(2);
    expect(updated?.filesProcessed).toBe(2);
    expect(updated?.errors).toHaveLength(1);
    expect(updated?.errors[0]?.filePath).toBe(path.basename(missingFile));
    expect(updated?.errors[0]?.filePath).not.toContain(path.sep);
    expect(updated?.errors[0]?.message).toBe('File not accessible');

    const storedRow = db.prepare(`
      SELECT errors_json
      FROM ingest_jobs
      WHERE id = ?
    `).get(job.id) as { errors_json: string };
    const storedErrors = JSON.parse(storedRow.errors_json) as Array<{ filePath: string; message: string }>;

    expect(storedErrors[0]?.filePath).toBe(path.basename(missingFile));
    expect(storedErrors[0]?.filePath).not.toContain(path.sep);
  });

  it('marks all-fail jobs failed when every file errors', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);
    mod.initIngestJobQueue({
      processFile: async () => {
        throw new Error('index failure');
      },
    });

    const accessibleFile = createTempFile('always-fails');
    const job = await mod.createIngestJob({
      id: 'job_failed',
      paths: [accessibleFile],
      specFolder: 'specs/test',
    });

    mod.enqueueIngestJob(job.id);
    await waitFor(() => {
      const current = mod.getIngestJob(job.id);
      return current?.state === 'complete' || current?.state === 'failed';
    });

    const updated = mod.getIngestJob(job.id);
    expect(updated?.state).toBe('failed');
    expect(updated?.filesTotal).toBe(1);
    expect(updated?.filesProcessed).toBe(1);
    expect(updated?.errors).toHaveLength(1);
    expect(updated?.errors[0]?.message).toBe('index failure');
  });
});

describe('ingest job queue batch processing (CHK-051)', () => {
  it('processes 120-file batch to completion without timeout', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);
    mod.initIngestJobQueue({
      processFile: async () => undefined,
    });

    const paths: string[] = [];
    for (let i = 0; i < 120; i++) {
      paths.push(createTempFile(`batch-file-${i}`));
    }

    const job = await mod.createIngestJob({
      id: 'job_batch_120',
      paths,
      specFolder: 'specs/test',
    });

    mod.enqueueIngestJob(job.id);
    await waitFor(() => {
      const current = mod.getIngestJob(job.id);
      return current?.state === 'complete' || current?.state === 'failed';
    }, { timeoutMs: 15000 });

    const updated = mod.getIngestJob(job.id);
    expect(updated?.state).toBe('complete');
    expect(updated?.filesTotal).toBe(120);
    expect(updated?.filesProcessed).toBe(120);
    expect(updated?.errors).toHaveLength(0);
  });
});

describe('SQLITE_BUSY retry with exponential backoff', () => {
  it('retries and completes when DB throws SQLITE_BUSY on first N writes', async () => {
    const db = createTestDb();

    // Track how many times prepare().run() has been called for UPDATE/INSERT
    // and throw SQLITE_BUSY on the first 2 write calls to exercise the
    // withBusyRetry path (retry delays: [50, 200, 500]ms).
    let writeCallCount = 0;
    const FAILURES_BEFORE_SUCCESS = 2;
    const originalPrepare = db.prepare.bind(db);

    db.prepare = function (sql: string) {
      const stmt = originalPrepare(sql);

      // Only intercept mutating statements (INSERT/UPDATE)
      if (/^\s*(INSERT|UPDATE)\b/i.test(sql)) {
        const originalRun = stmt.run.bind(stmt);
        stmt.run = function (...args: unknown[]) {
          writeCallCount += 1;
          if (writeCallCount <= FAILURES_BEFORE_SUCCESS) {
            const busyError = new Error('SQLITE_BUSY: database is locked');
            (busyError as unknown as { code: string }).code = 'SQLITE_BUSY';
            throw busyError;
          }
          return originalRun(...args);
        };
      }

      return stmt;
    } as typeof db.prepare;

    const mod = await loadJobQueueModule(db);
    mod.initIngestJobQueue({
      processFile: async () => undefined,
    });

    const filePath = createTempFile('busy-retry-test');

    // createIngestJob uses withBusyRetry internally for the INSERT.
    // The first 2 calls will throw SQLITE_BUSY, then succeed on attempt 3.
    const job = await mod.createIngestJob({
      id: 'job_busy_retry',
      paths: [filePath],
      specFolder: 'specs/test',
    });

    expect(job.state).toBe('queued');
    expect(writeCallCount).toBeGreaterThan(FAILURES_BEFORE_SUCCESS);

    mod.enqueueIngestJob(job.id);
    await waitFor(() => {
      const current = mod.getIngestJob(job.id);
      return current?.state === 'complete' || current?.state === 'failed';
    });

    const updated = mod.getIngestJob(job.id);
    expect(updated?.state).toBe('complete');
    expect(updated?.filesProcessed).toBe(1);
    expect(updated?.errors).toHaveLength(0);
  });
});

describe('sequential processing: only 1 job active at a time', () => {
  it('never runs two jobs concurrently', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);

    let activeConcurrent = 0;
    let maxConcurrent = 0;
    const processingOrder: string[] = [];

    mod.initIngestJobQueue({
      processFile: async (filePath: string) => {
        activeConcurrent += 1;
        maxConcurrent = Math.max(maxConcurrent, activeConcurrent);
        processingOrder.push(path.basename(filePath));
        // Small delay to create a window where overlap could occur
        await delay(30);
        activeConcurrent -= 1;
      },
    });

    // Create 3 jobs, each with 1 file
    const file1 = createTempFile('sequential-job-1');
    const file2 = createTempFile('sequential-job-2');
    const file3 = createTempFile('sequential-job-3');

    const job1 = await mod.createIngestJob({ id: 'seq_1', paths: [file1], specFolder: 'specs/test' });
    const job2 = await mod.createIngestJob({ id: 'seq_2', paths: [file2], specFolder: 'specs/test' });
    const job3 = await mod.createIngestJob({ id: 'seq_3', paths: [file3], specFolder: 'specs/test' });

    // Enqueue all 3 rapidly — the worker should still process them one at a time
    mod.enqueueIngestJob(job1.id);
    mod.enqueueIngestJob(job2.id);
    mod.enqueueIngestJob(job3.id);

    await waitFor(() => {
      const s1 = mod.getIngestJob(job1.id);
      const s2 = mod.getIngestJob(job2.id);
      const s3 = mod.getIngestJob(job3.id);
      return (
        (s1?.state === 'complete' || s1?.state === 'failed') &&
        (s2?.state === 'complete' || s2?.state === 'failed') &&
        (s3?.state === 'complete' || s3?.state === 'failed')
      );
    }, { timeoutMs: 5000 });

    // The critical assertion: no two processFile calls were active at the same time
    expect(maxConcurrent).toBe(1);

    // All 3 jobs completed successfully
    expect(mod.getIngestJob(job1.id)?.state).toBe('complete');
    expect(mod.getIngestJob(job2.id)?.state).toBe('complete');
    expect(mod.getIngestJob(job3.id)?.state).toBe('complete');

    // All 3 files were processed in order
    expect(processingOrder).toHaveLength(3);
  });
});
