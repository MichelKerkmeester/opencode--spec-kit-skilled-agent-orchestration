// TEST: Ingest Job Queue State + Edge Cases (T005b)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

type JobQueueModule = typeof import('../lib/ops/job-queue');

const tempFiles: string[] = [];
const databases: Array<Database.Database> = [];

function createTempFile(content = 'job queue edge test'): string {
  const filePath = path.join(
    os.tmpdir(),
    `spec-kit-job-queue-state-edge-${Date.now()}-${Math.random().toString(36).slice(2)}.md`
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

describe('ingest job queue state + edge tests (T005b)', () => {
  it('T005b-Q1: getIngestProgressPercent returns 0 when filesTotal is 0', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);

    expect(mod.getIngestProgressPercent({ filesProcessed: 5, filesTotal: 0 })).toBe(0);
  });

  it('T005b-Q2: getIngestProgressPercent returns 100 when all files are processed', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);

    expect(mod.getIngestProgressPercent({ filesProcessed: 8, filesTotal: 8 })).toBe(100);
  });

  it('T005b-Q3: getIngestProgressPercent returns 50 when half of files are processed', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);

    expect(mod.getIngestProgressPercent({ filesProcessed: 3, filesTotal: 6 })).toBe(50);
  });

  it('T005b-Q3b: getIngestProgressPercent clamps above 100 to 100', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);

    expect(mod.getIngestProgressPercent({ filesProcessed: 7, filesTotal: 3 })).toBe(100);
  });

  it('T005b-Q3c: getIngestProgressPercent clamps negative progress to 0', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);

    expect(mod.getIngestProgressPercent({ filesProcessed: -1, filesTotal: 3 })).toBe(0);
  });

  it('T005b-Q3d: getIngestForecast returns low-confidence caveat before progress starts', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);

    expect(mod.getIngestForecast({
      state: 'queued',
      filesProcessed: 0,
      filesTotal: 4,
      errors: [],
      createdAt: '2026-03-14T10:00:00.000Z',
      updatedAt: '2026-03-14T10:00:05.000Z',
    })).toEqual({
      etaSeconds: null,
      etaConfidence: null,
      failureRisk: 0.1,
      riskSignals: ['queued_not_started'],
      caveat: 'Forecast is low-confidence until at least one file has been processed.',
    });
  });

  it('T005b-Q3e: getIngestForecast derives ETA and bounded risk from observed throughput', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);

    const forecast = mod.getIngestForecast({
      state: 'indexing',
      filesProcessed: 3,
      filesTotal: 6,
      errors: [{ filePath: 'a.md', message: 'boom', timestamp: '2026-03-14T10:00:20.000Z' }],
      createdAt: '2026-03-14T10:00:00.000Z',
      updatedAt: '2026-03-14T10:00:30.000Z',
    });

    expect(forecast.etaSeconds).toBe(30);
    expect(forecast.etaConfidence).toBeCloseTo(0.5333333333, 8);
    expect(forecast.failureRisk).toBeCloseTo(0.2666666666, 8);
    expect(forecast.riskSignals).toEqual(['file_errors_seen']);
    expect(forecast.caveat).toBeNull();
  });

  it('T005b-Q4: createIngestJob throws when paths array is empty', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);

    await expect(mod.createIngestJob({
      id: 'job_empty_paths',
      paths: [],
      specFolder: 'specs/test',
    })).rejects.toThrow('paths must include at least one file path');
  });

  it('T005b-Q5: createIngestJob throws when whitespace-only inputs normalize to empty paths', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);

    // Pass raw whitespace strings — createIngestJob should reject these
    // (either by trimming internally or by failing on empty-after-filter)
    await expect(mod.createIngestJob({
      id: 'job_whitespace_paths',
      paths: ['   ', '\t', '\n'],
      specFolder: 'specs/test',
    })).rejects.toThrow('paths must include at least one file path');
  });

  it('T005b-Q6: getIngestJob returns null when job is not found', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);

    expect(mod.getIngestJob('job_missing')).toBeNull();
  });

  it('T005b-Q7: cancelIngestJob on terminal state returns existing terminal record', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);
    const filePath = createTempFile('terminal-state-file');

    const job = await mod.createIngestJob({
      id: 'job_terminal_complete',
      paths: [filePath],
      specFolder: 'specs/test',
    });

    db.prepare(`
      UPDATE ingest_jobs
      SET state = 'complete', files_processed = 1, updated_at = ?
      WHERE id = ?
    `).run(new Date().toISOString(), job.id);

    const cancelled = await mod.cancelIngestJob(job.id);
    expect(cancelled.id).toBe(job.id);
    expect(cancelled.state).toBe('complete');
  });

  it('T005b-Q8: resetIncompleteJobsToQueued returns empty array when no incomplete jobs exist', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);

    expect(mod.resetIncompleteJobsToQueued()).toEqual([]);
  });

  it('T005b-Q9: enqueueIngestJob ignores duplicate enqueues for the same job ID', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);
    const processFile = vi.fn(async () => undefined);

    mod.initIngestJobQueue({ processFile });

    const filePath = createTempFile('duplicate-enqueue');
    const job = await mod.createIngestJob({
      id: 'job_duplicate_enqueue',
      paths: [filePath],
      specFolder: 'specs/test',
    });

    mod.enqueueIngestJob(job.id);
    mod.enqueueIngestJob(job.id);
    mod.enqueueIngestJob(job.id);

    await waitFor(() => mod.getIngestJob(job.id)?.state === 'complete');

    const updated = mod.getIngestJob(job.id);
    expect(updated?.filesProcessed).toBe(1);
    expect(processFile).toHaveBeenCalledTimes(1);
  });

  it('T005b-Q10: job is failed when every file errors during processing', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);
    const processFile = vi.fn(async () => undefined);

    mod.initIngestJobQueue({ processFile });

    const missingA = path.join(os.tmpdir(), `spec-kit-missing-a-${Date.now()}-${Math.random().toString(36).slice(2)}.md`);
    const missingB = path.join(os.tmpdir(), `spec-kit-missing-b-${Date.now()}-${Math.random().toString(36).slice(2)}.md`);

    const job = await mod.createIngestJob({
      id: 'job_all_failed',
      paths: [missingA, missingB],
      specFolder: 'specs/test',
    });

    mod.enqueueIngestJob(job.id);

    await waitFor(() => {
      const state = mod.getIngestJob(job.id)?.state;
      return state === 'failed';
    });

    const updated = mod.getIngestJob(job.id);
    expect(updated?.state).toBe('failed');
    expect(updated?.errors.length).toBe(2);
    expect(processFile).toHaveBeenCalledTimes(0);
  });

  it('T005b-Q11: partial file failures still complete job with preserved errors', async () => {
    const db = createTestDb();
    const mod = await loadJobQueueModule(db);
    const processFile = vi.fn(async () => undefined);

    mod.initIngestJobQueue({ processFile });

    const validPath = createTempFile('partial-failure-valid');
    const missingPath = path.join(os.tmpdir(), `spec-kit-missing-c-${Date.now()}-${Math.random().toString(36).slice(2)}.md`);

    const job = await mod.createIngestJob({
      id: 'job_partial_failure',
      paths: [validPath, missingPath],
      specFolder: 'specs/test',
    });

    mod.enqueueIngestJob(job.id);

    await waitFor(() => {
      const state = mod.getIngestJob(job.id)?.state;
      return state === 'complete';
    });

    const updated = mod.getIngestJob(job.id);
    expect(updated?.state).toBe('complete');
    expect(updated?.filesProcessed).toBe(2);
    expect(updated?.errors.length).toBe(1);
    expect(updated?.errors[0]?.filePath).toBe(path.basename(missingPath));
    expect(processFile).toHaveBeenCalledTimes(1);
    expect(processFile).toHaveBeenCalledWith(validPath);
  });
});
