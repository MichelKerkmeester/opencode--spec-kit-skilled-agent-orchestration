// TEST: RETRY MANAGER
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import type Database from 'better-sqlite3';
import * as mod from '../lib/providers/retry-manager';
import * as vectorIndex from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';

type RetryFunctionExportName =
  | 'getRetryQueue'
  | 'getFailedEmbeddings'
  | 'getRetryStats'
  | 'retryEmbedding'
  | 'markAsFailed'
  | 'resetForRetry'
  | 'processRetryQueue'
  | 'startBackgroundJob'
  | 'stopBackgroundJob'
  | 'isBackgroundJobRunning'
  | 'runBackgroundJob';

type RetryDb = Database.Database;
type RetryQueueItem = ReturnType<typeof mod.getRetryQueue>[number];
type FailedEmbeddingItem = ReturnType<typeof mod.getFailedEmbeddings>[number];
type RetryContentLoader = NonNullable<Parameters<typeof mod.processRetryQueue>[1]>;
type EmbeddingStatus = RetryQueueItem['embedding_status'];

describe('retry-manager [deferred - requires DB test fixtures]', () => {

  // ═══════════════════════════════════════════════════════════
  // ───────────────────────────────────────────────────────────────
  // 1. MODULE EXPORTS
  // ───────────────────────────────────────────────────────────────  // ═══════════════════════════════════════════════════════════

  describe('1. Module Exports', () => {
    it('T01: All 11 function exports are functions', () => {
      const functionExports: RetryFunctionExportName[] = [
        'getRetryQueue', 'getFailedEmbeddings', 'getRetryStats',
        'retryEmbedding', 'markAsFailed', 'resetForRetry',
        'processRetryQueue', 'startBackgroundJob', 'stopBackgroundJob',
        'isBackgroundJobRunning', 'runBackgroundJob',
      ];
      for (const fn of functionExports) {
        expect(typeof mod[fn]).toBe('function');
      }
    });

    it('T02: BACKGROUND_JOB_CONFIG exported as object', () => {
      expect(typeof mod.BACKGROUND_JOB_CONFIG).toBe('object');
      expect(mod.BACKGROUND_JOB_CONFIG).not.toBeNull();
    });

    it('T03: BACKOFF_DELAYS exported as array', () => {
      expect(Array.isArray(mod.BACKOFF_DELAYS)).toBe(true);
    });

    it('T04: MAX_RETRIES exported as number', () => {
      expect(typeof mod.MAX_RETRIES).toBe('number');
    });
  });

  // ═══════════════════════════════════════════════════════════
  // ───────────────────────────────────────────────────────────────
  // 2. CONSTANTS
  // ───────────────────────────────────────────────────────────────  // ═══════════════════════════════════════════════════════════

  describe('2. Constants', () => {
    it('T05: BACKOFF_DELAYS has 3 entries', () => {
      expect(mod.BACKOFF_DELAYS.length).toBe(3);
    });

    it('T06: BACKOFF_DELAYS[0] = 60000ms (1 min)', () => {
      expect(mod.BACKOFF_DELAYS[0]).toBe(60 * 1000);
    });

    it('T07: BACKOFF_DELAYS[1] = 300000ms (5 min)', () => {
      expect(mod.BACKOFF_DELAYS[1]).toBe(5 * 60 * 1000);
    });

    it('T08: BACKOFF_DELAYS[2] = 900000ms (15 min)', () => {
      expect(mod.BACKOFF_DELAYS[2]).toBe(15 * 60 * 1000);
    });

    it('T09: MAX_RETRIES = 3', () => {
      expect(mod.MAX_RETRIES).toBe(3);
    });

    it('T10: BACKGROUND_JOB_CONFIG.intervalMs = 300000ms', () => {
      expect(mod.BACKGROUND_JOB_CONFIG.intervalMs).toBe(5 * 60 * 1000);
    });

    it('T11: BACKGROUND_JOB_CONFIG.batchSize = 5', () => {
      expect(mod.BACKGROUND_JOB_CONFIG.batchSize).toBe(5);
    });

    it('T12: BACKGROUND_JOB_CONFIG.enabled = true', () => {
      expect(mod.BACKGROUND_JOB_CONFIG.enabled).toBe(true);
    });

    it('T13: All BACKOFF_DELAYS entries are numbers', () => {
      for (const d of mod.BACKOFF_DELAYS) {
        expect(typeof d).toBe('number');
      }
    });

    it('T14: BACKOFF_DELAYS in ascending order', () => {
      expect(mod.BACKOFF_DELAYS[0]).toBeLessThan(mod.BACKOFF_DELAYS[1]);
      expect(mod.BACKOFF_DELAYS[1]).toBeLessThan(mod.BACKOFF_DELAYS[2]);
    });
  });

  describe('2b. Sanitization', () => {
    it('T14b: sanitizeAndLogEmbeddingFailure redacts raw provider payloads from operator logs', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const raw = new Error('OpenAI 401 unauthorized: sk-secret-value');

      const message = mod.sanitizeAndLogEmbeddingFailure(
        '[retry-manager] Embedding retry failed for #42',
        raw,
        { provider: 'text-embedding-3-large', force: true },
      );

      expect(message).toBe('EMBEDDING_PROVIDER_ERROR (provider=openai, type=auth)');
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        '[retry-manager] Embedding retry failed for #42',
        {
          sanitized: {
            code: 'EMBEDDING_PROVIDER_ERROR',
            provider: 'openai',
            errorType: 'auth',
          },
          redacted: true,
        },
      );
      expect(JSON.stringify(errorSpy.mock.calls)).not.toContain('sk-secret-value');
      expect(JSON.stringify(errorSpy.mock.calls)).not.toContain('401 unauthorized');
    });
  });

  // ═══════════════════════════════════════════════════════════
  // ───────────────────────────────────────────────────────────────
  // 3. BACKGROUND JOB LIFECYCLE
  // ───────────────────────────────────────────────────────────────  // ═══════════════════════════════════════════════════════════

  describe('3. Background Job Lifecycle', () => {
    beforeEach(() => {
      mod.stopBackgroundJob();
    });

    it('T15: isBackgroundJobRunning() initially false', () => {
      expect(mod.isBackgroundJobRunning()).toBe(false);
    });

    it('T16: stopBackgroundJob() returns false when not running', () => {
      const result = mod.stopBackgroundJob();
      expect(result).toBe(false);
    });

    it('T17: startBackgroundJob() returns true', () => {
      const result = mod.startBackgroundJob({ intervalMs: 999999999 });
      expect(result).toBe(true);
    });

    it('T18: isBackgroundJobRunning() true after start', () => {
      mod.startBackgroundJob({ intervalMs: 999999999 });
      expect(mod.isBackgroundJobRunning()).toBe(true);
    });

    it('T19: startBackgroundJob() returns false when already running', () => {
      mod.startBackgroundJob({ intervalMs: 999999999 });
      const result = mod.startBackgroundJob({ intervalMs: 999999999 });
      expect(result).toBe(false);
    });

    it('T20: stopBackgroundJob() returns true when running', () => {
      mod.startBackgroundJob({ intervalMs: 999999999 });
      const result = mod.stopBackgroundJob();
      expect(result).toBe(true);
    });

    it('T21: isBackgroundJobRunning() false after stop', () => {
      mod.startBackgroundJob({ intervalMs: 999999999 });
      mod.stopBackgroundJob();
      expect(mod.isBackgroundJobRunning()).toBe(false);
    });

    it('T22: startBackgroundJob({ enabled: false }) returns false', () => {
      const result = mod.startBackgroundJob({ enabled: false });
      expect(result).toBe(false);
      expect(mod.isBackgroundJobRunning()).toBe(false);
    });

    it('T23: start/stop/start cycle works correctly', () => {
      const r1 = mod.startBackgroundJob({ intervalMs: 999999999 });
      expect(r1).toBe(true);
      const r2 = mod.stopBackgroundJob();
      expect(r2).toBe(true);
      const r3 = mod.startBackgroundJob({ intervalMs: 999999999 });
      expect(r3).toBe(true);
      mod.stopBackgroundJob(); // cleanup
    });
  });

  // ═══════════════════════════════════════════════════════════
  // 4. DB-DEPENDENT TESTS (WITH REAL vectorIndex DB)
  // ═══════════════════════════════════════════════════════════

  describe('4. DB-Dependent Tests', () => {
    let db: RetryDb | null = null;
    let testDbPath: string | null = null;

    function getDbOrThrow(): RetryDb {
      if (!db) {
        throw new Error('Test database was not initialized');
      }
      return db;
    }

    function insertTestMemory(
      id: number,
      filePath: string,
      status: EmbeddingStatus = 'pending',
      retryCount: number = 0,
      lastRetryAt: string | null = null,
      failureReason: string | null = null,
    ) {
      const now = new Date().toISOString();
      const activeDb = getDbOrThrow();
      try {
        activeDb.prepare(`
          INSERT OR REPLACE INTO memory_index
            (id, spec_folder, file_path, title, created_at, updated_at,
             embedding_status, retry_count, last_retry_at, failure_reason,
             importance_weight, importance_tier)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         `).run(
           id, 'test/spec', filePath, `Test Memory ${id}`,
          now, now, status, retryCount, lastRetryAt, failureReason,
           0.5, 'normal',
         );
      } catch (_error: unknown) {
        activeDb.prepare(`
          UPDATE memory_index
          SET embedding_status = ?, retry_count = ?, last_retry_at = ?,
              failure_reason = ?, updated_at = ?
          WHERE id = ?
        `).run(status, retryCount, lastRetryAt, failureReason, now, id);
      }
    }

    function clearTestMemories() {
      const activeDb = getDbOrThrow();
      try {
        activeDb.prepare("DELETE FROM memory_index WHERE spec_folder = 'test/spec'").run();
      } catch { /* table might not exist yet */ }
    }

    beforeEach(() => {
      if (!vectorIndex || typeof vectorIndex.initializeDb !== 'function') return;
      if (!db) {
        testDbPath = path.join(os.tmpdir(), `retry-mgr-test-${Date.now()}.sqlite`);
        const previousMemoryDbPath = process.env.MEMORY_DB_PATH;
        process.env.MEMORY_DB_PATH = testDbPath;
        try { vectorIndex.closeDb(); } catch { /* ignore */ }
        const initializedDb = vectorIndex.initializeDb();
        if (previousMemoryDbPath === undefined) {
          delete process.env.MEMORY_DB_PATH;
        } else {
          process.env.MEMORY_DB_PATH = previousMemoryDbPath;
        }
        if (!initializedDb) {
          throw new Error('Failed to initialize retry-manager test database');
        }
        db = initializedDb;
      }
      if (db) clearTestMemories();
    });

    afterAll(() => {
      mod.stopBackgroundJob();
      try { vectorIndex.closeDb(); } catch { /* ignore */ }
      if (testDbPath && fs.existsSync(testDbPath)) {
        try { fs.unlinkSync(testDbPath); } catch { /* ignore */ }
        try { fs.unlinkSync(testDbPath + '-wal'); } catch { /* ignore */ }
        try { fs.unlinkSync(testDbPath + '-shm'); } catch { /* ignore */ }
      }
    });

    // 4a. getRetryStats
    describe('4a. getRetryStats', () => {
      it('T24: getRetryStats() returns correct shape', () => {
        const stats = mod.getRetryStats();
        expect(typeof stats).toBe('object');
        expect(typeof stats.pending).toBe('number');
        expect(typeof stats.retry).toBe('number');
        expect(typeof stats.failed).toBe('number');
        expect(typeof stats.success).toBe('number');
        expect(typeof stats.total).toBe('number');
        expect(typeof stats.queue_size).toBe('number');
      });

      it('T25: getRetryStats() counts by status correctly', () => {
        insertTestMemory(1001, '/tmp/test1.md', 'pending');
        insertTestMemory(1002, '/tmp/test2.md', 'pending');
        insertTestMemory(1003, '/tmp/test3.md', 'retry', 1);
        insertTestMemory(1004, '/tmp/test4.md', 'failed', 3, null, 'max retries');
        insertTestMemory(1005, '/tmp/test5.md', 'success');

        const stats = mod.getRetryStats();
        expect(stats.pending).toBeGreaterThanOrEqual(2);
        expect(stats.retry).toBeGreaterThanOrEqual(1);
        expect(stats.failed).toBeGreaterThanOrEqual(1);
        expect(stats.success).toBeGreaterThanOrEqual(1);
        expect(stats.queue_size).toBeGreaterThanOrEqual(3);
      });

      it('T26: queue_size = pending + retry', () => {
        insertTestMemory(1001, '/tmp/test1.md', 'pending');
        insertTestMemory(1003, '/tmp/test3.md', 'retry', 1);
        const stats = mod.getRetryStats();
        expect(stats.queue_size).toBe(stats.pending + stats.retry);
      });
    });

    // 4b. getRetryQueue
    describe('4b. getRetryQueue', () => {
      it('T27: getRetryQueue() returns array', () => {
        const queue = mod.getRetryQueue();
        expect(Array.isArray(queue)).toBe(true);
      });

      it('T28: getRetryQueue() finds pending items', () => {
        insertTestMemory(2001, '/tmp/pending1.md', 'pending');
        insertTestMemory(2002, '/tmp/pending2.md', 'pending');

        const queue = mod.getRetryQueue(10);
        const testIds = queue.map((r) => r.id);
        expect(testIds).toContain(2001);
        expect(testIds).toContain(2002);
      });

      it('T29: getRetryQueue() excludes items at MAX_RETRIES', () => {
        insertTestMemory(2010, '/tmp/maxed.md', 'retry', 3);
        insertTestMemory(2011, '/tmp/ok.md', 'pending', 0);

        const queue = mod.getRetryQueue(10);
        const ids = queue.map((r) => r.id);
        expect(ids).not.toContain(2010);
        expect(ids).toContain(2011);
      });

      it('T30: getRetryQueue() respects limit parameter', () => {
        for (let i = 0; i < 5; i++) {
          insertTestMemory(2020 + i, `/tmp/limit${i}.md`, 'pending');
        }

        const queue = mod.getRetryQueue(2);
        expect(queue.length).toBeLessThanOrEqual(2);
      });

      it('T31: getRetryQueue() prioritizes pending over retry', () => {
        const oldDate = new Date(Date.now() - 3600000).toISOString();
        insertTestMemory(2030, '/tmp/retry_item.md', 'retry', 1, oldDate);
        insertTestMemory(2031, '/tmp/pending_item.md', 'pending');

        const queue = mod.getRetryQueue(10);
        if (queue.length >= 2) {
          const pendingIdx = queue.findIndex((r) => r.id === 2031);
          const retryIdx = queue.findIndex((r) => r.id === 2030);
          if (pendingIdx >= 0 && retryIdx >= 0) {
            expect(pendingIdx).toBeLessThan(retryIdx);
          }
        }
      });

      it('T32: getRetryQueue() respects backoff delay', () => {
        const recentRetry = new Date().toISOString();
        insertTestMemory(2040, '/tmp/recent_retry.md', 'retry', 1, recentRetry);

        const oldRetry = new Date(Date.now() - 120000).toISOString();
        insertTestMemory(2041, '/tmp/old_retry.md', 'retry', 1, oldRetry);

        const queue = mod.getRetryQueue(10);
        const ids = queue.map((r) => r.id);
        expect(ids).not.toContain(2040);
        expect(ids).toContain(2041);
      });

      it('T33: getRetryQueue() returns array (possibly empty) on clean state', () => {
        const queue = mod.getRetryQueue(10);
        expect(Array.isArray(queue)).toBe(true);
      });
    });

    // 4c. getFailedEmbeddings
    describe('4c. getFailedEmbeddings', () => {
      it('T34: getFailedEmbeddings() returns array', () => {
        const result = mod.getFailedEmbeddings();
        expect(Array.isArray(result)).toBe(true);
      });

      it('T35: getFailedEmbeddings() returns only failed items', () => {
        insertTestMemory(3001, '/tmp/failed1.md', 'failed', 3, null, 'Test failure reason');
        insertTestMemory(3002, '/tmp/success1.md', 'success');

        const failed = mod.getFailedEmbeddings();
        const ids = failed.map((r) => r.id);
        expect(ids).toContain(3001);
        expect(ids).not.toContain(3002);
      });

      it('T36: getFailedEmbeddings() preserves failure_reason', () => {
        insertTestMemory(3001, '/tmp/failed1.md', 'failed', 3, null, 'Test failure reason');
        const failed = mod.getFailedEmbeddings();
        const item = failed.find((r) => r.id === 3001);
        if (item) {
          expect(item.failure_reason).toBe('Test failure reason');
        }
      });
    });

    // 4d. markAsFailed
    describe('4d. markAsFailed', () => {
      it('T37: markAsFailed() sets status and failure_reason', () => {
        insertTestMemory(4001, '/tmp/tofail.md', 'pending');

        mod.markAsFailed(4001, 'Intentional test failure');

        const activeDb = getDbOrThrow();
        const row = activeDb.prepare('SELECT embedding_status, failure_reason FROM memory_index WHERE id = ?').get(4001) as {
          embedding_status: string;
          failure_reason: string | null;
        };
        expect(row.embedding_status).toBe('failed');
        expect(row.failure_reason).toBe('Intentional test failure');
      });

      it('T38: markAsFailed() on non-existent row does not throw', () => {
        expect(() => mod.markAsFailed(99999, 'Non-existent')).not.toThrow();
      });

      it('T39: markAsFailed() updates updated_at timestamp', () => {
        const oldDate = '2020-01-01T00:00:00.000Z';
        insertTestMemory(4010, '/tmp/timestamp.md', 'pending');
        const activeDb = getDbOrThrow();
        activeDb.prepare("UPDATE memory_index SET updated_at = ? WHERE id = ?").run(oldDate, 4010);

        mod.markAsFailed(4010, 'Testing timestamp');

        const row = activeDb.prepare('SELECT updated_at FROM memory_index WHERE id = ?').get(4010) as {
          updated_at: string;
        };
        expect(row.updated_at).not.toBe(oldDate);
      });
    });

    // 4e. resetForRetry
    describe('4e. resetForRetry', () => {
      it('T40: resetForRetry() resets failed item correctly', () => {
        insertTestMemory(5001, '/tmp/toreset.md', 'failed', 3, null, 'Previous failure');

        const result = mod.resetForRetry(5001);
        expect(result).toBe(true);

        const activeDb = getDbOrThrow();
        const row = activeDb.prepare('SELECT embedding_status, retry_count, last_retry_at, failure_reason FROM memory_index WHERE id = ?').get(5001) as {
          embedding_status: string;
          retry_count: number;
          last_retry_at: string | null;
          failure_reason: string | null;
        };
        expect(row.embedding_status).toBe('retry');
        expect(row.retry_count).toBe(0);
        expect(row.last_retry_at).toBeNull();
        expect(row.failure_reason).toBeNull();
      });

      it('T41: resetForRetry() returns false for non-failed items', () => {
        insertTestMemory(5010, '/tmp/notfailed.md', 'pending');

        const result = mod.resetForRetry(5010);
        expect(result).toBe(false);
      });

      it('T42: resetForRetry() returns false for non-existent id', () => {
        const result = mod.resetForRetry(99999);
        expect(result).toBe(false);
      });
    });

    // 4f. retryEmbedding
    describe('4f. retryEmbedding', () => {
      it('T43: retryEmbedding() with non-existent id returns failure', async () => {
        const result = await mod.retryEmbedding(88888, 'some content');
        expect(result.success).toBe(false);
        expect(result.error).toBeTruthy();
      });

      it('T44: retryEmbedding() returns {success, error?} shape', async () => {
        const result = await mod.retryEmbedding(88888, 'content');
        expect(typeof result).toBe('object');
        expect(typeof result.success).toBe('boolean');
      });

      it('T45: retryEmbedding() returns valid result for max-retry item', async () => {
        insertTestMemory(6001, '/tmp/maxretry.md', 'retry', 3);

        const memory = vectorIndex.getMemory(6001);
        if (memory) {
          const result = await mod.retryEmbedding(6001, 'some content');
          expect(typeof result).toBe('object');
          expect(typeof result.success).toBe('boolean');
        }
      });

      it('T45b: save-succeeded pending rows schedule retry when embedding generation fails', async () => {
        const activeDb = getDbOrThrow();
        activeDb.exec(`
          CREATE TABLE IF NOT EXISTS vec_memories (
            rowid INTEGER PRIMARY KEY,
            embedding BLOB NOT NULL
          );
          CREATE TABLE IF NOT EXISTS embedding_cache (
            content_hash TEXT NOT NULL,
            model_id TEXT NOT NULL,
            embedding BLOB NOT NULL,
            dimensions INTEGER NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
            PRIMARY KEY (content_hash, model_id)
          );
        `);

        insertTestMemory(6002, '/tmp/pending-embed-failure.md', 'pending', 0);
        const embeddingSpy = vi.spyOn(embeddings, 'generateDocumentEmbedding').mockResolvedValue(null);

        const result = await mod.retryEmbedding(6002, `retry-content-${Date.now()}`);
        expect(result.success).toBe(false);
        expect(embeddingSpy).toHaveBeenCalledTimes(1);

        const row = activeDb.prepare(
          'SELECT embedding_status, retry_count, failure_reason FROM memory_index WHERE id = ?'
        ).get(6002) as {
          embedding_status: string;
          retry_count: number;
          failure_reason: string | null;
        } | undefined;

        expect(row).toBeDefined();
        expect(row?.embedding_status).toBe('retry');
        expect(row?.retry_count).toBe(1);
        expect(row?.failure_reason).toContain('Embedding generation returned null');
      });

      it('T45c: max-retry exhaustion records a terminal failed state', async () => {
        insertTestMemory(6003, '/tmp/max-retry-terminal.md', 'retry', mod.MAX_RETRIES);

        const result = await mod.retryEmbedding(6003, 'unreachable-content');
        expect(result.success).toBe(false);
        expect(result.permanent).toBe(true);
        expect(result.error).toContain('Maximum retries exceeded');

        const activeDb = getDbOrThrow();
        const row = activeDb.prepare(
          'SELECT embedding_status, failure_reason FROM memory_index WHERE id = ?'
        ).get(6003) as {
          embedding_status: string;
          failure_reason: string | null;
        } | undefined;

        expect(row).toBeDefined();
        expect(row?.embedding_status).toBe('failed');
        expect(row?.failure_reason).toBe('Maximum retry attempts exceeded');
      });
    });

    // 4g. processRetryQueue
    describe('4g. processRetryQueue', () => {
      it('T46: processRetryQueue() with empty queue returns zeros', async () => {
        const result = await mod.processRetryQueue(3);
        expect(typeof result).toBe('object');
        expect(result.processed).toBe(0);
        expect(result.succeeded).toBe(0);
        expect(result.failed).toBe(0);
      });

      it('T47: processRetryQueue() returns { processed, succeeded, failed }', async () => {
        const result = await mod.processRetryQueue(1);
        expect(typeof result.processed).toBe('number');
        expect(typeof result.succeeded).toBe('number');
        expect(typeof result.failed).toBe('number');
      });

      it('T48: processRetryQueue() calls custom contentLoader', async () => {
        insertTestMemory(7001, '/tmp/withloader.md', 'pending');

        let loaderCalled = false;
        const contentLoader: RetryContentLoader = async (_memory: RetryQueueItem): Promise<string | null> => {
          loaderCalled = true;
          return null;
        };

        const result = await mod.processRetryQueue(1, contentLoader);
        if (result.processed > 0) {
          expect(loaderCalled).toBe(true);
        }
      });
    });

    // 4h. runBackgroundJob
    describe('4h. runBackgroundJob', () => {
      it('T49: runBackgroundJob() with empty queue reports empty', async () => {
        // Mock getDb to return null so getRetryStats() reports an empty queue,
        // Avoiding interference from the real production database.
        // @ts-expect-error testing runtime null-db fallback despite non-null typing
        const spy = vi.spyOn(vectorIndex, 'getDb').mockReturnValue(null);
        try {
          const result = await mod.runBackgroundJob(5);
          expect(typeof result).toBe('object');
          if (result.queue_empty !== undefined) {
            expect(result.queue_empty).toBe(true);
          } else {
            expect(result.processed).toBe(0);
          }
        } finally {
          spy.mockRestore();
        }
      });

      it('T50: runBackgroundJob() returns an object', async () => {
        const result = await mod.runBackgroundJob(1);
        expect(typeof result).toBe('object');
      });
    });

    // 4i. Edge Cases
    describe('4i. Edge Cases', () => {
      it('T51: Multiple markAsFailed() calls update reason', () => {
        insertTestMemory(8001, '/tmp/multifail.md', 'pending');

        mod.markAsFailed(8001, 'First failure');
        mod.markAsFailed(8001, 'Second failure');

        const activeDb = getDbOrThrow();
        const row = activeDb.prepare('SELECT failure_reason FROM memory_index WHERE id = ?').get(8001) as {
          failure_reason: string | null;
        };
        expect(row.failure_reason).toBe('Second failure');
      });

      it('T52: resetForRetry() -> markAsFailed() cycle works', () => {
        insertTestMemory(8010, '/tmp/cycle.md', 'failed', 3, null, 'initial');

        const resetResult = mod.resetForRetry(8010);
        expect(resetResult).toBe(true);

        const activeDb = getDbOrThrow();
        const row1 = activeDb.prepare('SELECT embedding_status FROM memory_index WHERE id = ?').get(8010) as {
          embedding_status: string;
        };
        expect(row1.embedding_status).toBe('retry');

        mod.markAsFailed(8010, 'failed again');
        const row2 = activeDb.prepare('SELECT embedding_status FROM memory_index WHERE id = ?').get(8010) as {
          embedding_status: string;
        };
        expect(row2.embedding_status).toBe('failed');
      });

      it('T53: getRetryQueue() excludes success and failed statuses', () => {
        insertTestMemory(8020, '/tmp/success_item.md', 'success');
        insertTestMemory(8021, '/tmp/failed_item.md', 'failed', 3, null, 'done');
        insertTestMemory(8022, '/tmp/pending_item.md', 'pending');

        const queue = mod.getRetryQueue(10);
        const ids = queue.map((r) => r.id);
        expect(ids).not.toContain(8020);
        expect(ids).not.toContain(8021);
        expect(ids).toContain(8022);
      });

      it('T54: getRetryStats().total >= sum of individual statuses', () => {
        insertTestMemory(8030, '/tmp/s1.md', 'pending');
        insertTestMemory(8031, '/tmp/s2.md', 'retry', 1);
        insertTestMemory(8032, '/tmp/s3.md', 'failed', 3, null, 'err');
        insertTestMemory(8033, '/tmp/s4.md', 'success');

        const stats = mod.getRetryStats();
        const sumStatuses = stats.pending + stats.retry + stats.failed + stats.success;
        expect(stats.total).toBeGreaterThanOrEqual(sumStatuses);
      });

      it('T55: getRetryQueue() rows have id, file_path, embedding_status', () => {
        insertTestMemory(8040, '/tmp/fields.md', 'pending');

        const queue = mod.getRetryQueue(10);
        const item = queue.find((r) => r.id === 8040);
        if (item) {
          expect(typeof item.id).toBe('number');
          expect(typeof item.file_path).toBe('string');
          expect(['pending', 'retry']).toContain(item.embedding_status);
        }
      });
    });
  });
});
