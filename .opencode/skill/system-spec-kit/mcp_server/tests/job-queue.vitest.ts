// @ts-nocheck
// ---------------------------------------------------------------
// TEST: Ingest Job Queue
// ---------------------------------------------------------------

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

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

async function loadJobQueueModule(db: Database.Database) {
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
        // ignore cleanup failures
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
    expect(updated?.errors[0]?.filePath).toBe(missingFile);
    expect(updated?.errors[0]?.message).toBe('File not accessible');
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
