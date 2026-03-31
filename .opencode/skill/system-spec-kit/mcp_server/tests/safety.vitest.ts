// TEST: SAFETY
import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { processBatches } from '../utils/batch-processor';
import * as incMod from '../lib/storage/incremental-index';
import Database from 'better-sqlite3';
import type { MemoryDbRow } from '@spec-kit/shared/types';

type TestDb = Database.Database;
type EmbeddingStatus = MemoryDbRow['embedding_status'];
type FileMtimeRow = { file_mtime_ms: number | null };

describe('T105 + T106 Safety Tests', () => {
  /* ═══════════════════════════════════════════════════════════
     T105: batchSize Validation (P0-08)
  ═══════════════════════════════════════════════════════════ */

  describe('T105: batchSize Validation', () => {
    const identity = async <T>(x: T): Promise<T> => x;

    it('CHK-114: batchSize=0 → immediate throw', async () => {
      await expect(processBatches([1, 2, 3], identity, 0)).rejects.toThrow('positive integer');
    });

    it('CHK-115: batchSize=-1 → immediate throw', async () => {
      await expect(processBatches([1], identity, -1)).rejects.toThrow();
    });

    it('T105-NaN: batchSize=NaN → immediate throw', async () => {
      await expect(processBatches([1, 2], identity, NaN)).rejects.toThrow('positive integer');
    });

    it('T105-Infinity: batchSize=Infinity → immediate throw', async () => {
      await expect(processBatches([1], identity, Infinity)).rejects.toThrow();
    });

    it('T105-NegInfinity: batchSize=-Infinity → immediate throw', async () => {
      await expect(processBatches([1], identity, -Infinity)).rejects.toThrow();
    });

    it('T105-Float: batchSize=2.5 → immediate throw', async () => {
      await expect(processBatches([1, 2, 3], identity, 2.5)).rejects.toThrow();
    });

    it('T105-FloatSmall: batchSize=0.5 → immediate throw', async () => {
      await expect(processBatches([1], identity, 0.5)).rejects.toThrow();
    });

    it('T105-Valid1: batchSize=1 works (smallest valid)', async () => {
      const results = await processBatches([42], identity, 1, 0);
      expect(results.length).toBe(1);
      expect(results[0]).toBe(42);
    });

    it('T105-Valid10: batchSize=10 works (normal)', async () => {
      const items = [1, 2, 3, 4, 5];
      const results = await processBatches(items, identity, 10, 0);
      expect(results).toEqual([1, 2, 3, 4, 5]);
    });

    it('T105-Valid100: batchSize=100 works (large)', async () => {
      const items = Array.from({ length: 50 }, (_, i) => i);
      const results = await processBatches(items, identity, 100, 0);
      expect(results.length).toBe(50);
    });

    it('T105-Empty0: batchSize=0 throws even with empty items', async () => {
      await expect(processBatches([], identity, 0)).rejects.toThrow();
    });

    it('T105-NoHang: batchSize=0 throws within 100ms (no infinite loop)', async () => {
      const start = Date.now();
      await expect(processBatches([1, 2, 3], identity, 0)).rejects.toThrow();
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(100);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     T106: Mtime Update After Successful Indexing (P0-09)
  ═══════════════════════════════════════════════════════════ */

  describe('T106: Mtime Update After Successful Indexing', () => {
    function createTestDb(): TestDb {
      const db = new Database(':memory:');
      db.exec(`
        CREATE TABLE memory_index (
          id INTEGER PRIMARY KEY,
          spec_folder TEXT NOT NULL,
          file_path TEXT NOT NULL,
          anchor_id TEXT,
          title TEXT,
          trigger_phrases TEXT,
          importance_weight REAL DEFAULT 0.5,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          embedding_model TEXT,
          embedding_generated_at TEXT,
          embedding_status TEXT DEFAULT 'pending'
            CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry', 'partial')),
          retry_count INTEGER DEFAULT 0,
          last_retry_at TEXT,
          failure_reason TEXT,
          base_importance REAL DEFAULT 0.5,
          decay_half_life_days REAL DEFAULT 90.0,
          is_pinned INTEGER DEFAULT 0,
          access_count INTEGER DEFAULT 0,
          last_accessed INTEGER DEFAULT 0,
          importance_tier TEXT DEFAULT 'normal'
            CHECK(importance_tier IN ('constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated')),
          session_id TEXT,
          context_type TEXT DEFAULT 'general'
            CHECK(context_type IN ('research', 'implementation', 'planning', 'general', 'decision', 'discovery')),
          channel TEXT DEFAULT 'default',
          content_hash TEXT,
          expires_at DATETIME,
          confidence REAL DEFAULT 0.5,
          validation_count INTEGER DEFAULT 0,
          stability REAL DEFAULT 1.0,
          difficulty REAL DEFAULT 5.0,
          last_review TEXT,
          review_count INTEGER DEFAULT 0,
          file_mtime_ms INTEGER,
          UNIQUE(spec_folder, file_path, anchor_id)
        )
      `);
      db.exec('CREATE INDEX IF NOT EXISTS idx_file_mtime ON memory_index(file_mtime_ms)');
      return db;
    }

    function insertRow(db: TestDb, opts: {
      file_path: string;
      file_mtime_ms?: number | null;
      embedding_status?: EmbeddingStatus;
      spec_folder?: string;
    }): number {
      const stmt = db.prepare(`
        INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, embedding_status)
        VALUES (?, ?, ?, ?)
      `);
      const result = stmt.run(
        opts.spec_folder ?? 'specs/test',
        opts.file_path,
        opts.file_mtime_ms ?? null,
        opts.embedding_status ?? 'success',
      );
      return result.lastInsertRowid as number;
    }

    function createTempFile(content = 'test content'): string {
      const name = `t106-test-${Date.now()}-${Math.random().toString(36).slice(2)}.md`;
      const p = path.join(os.tmpdir(), name);
      fs.writeFileSync(p, content, 'utf-8');
      return p;
    }

    function removeTempFile(p: string) {
      try { fs.unlinkSync(p); } catch {}
    }

    it('CHK-116: Successful indexing → mtime marker updated → skipped on next scan', () => {
      const db = createTestDb();
      incMod.init(db);

      const tmpFile = createTempFile('successfully indexed content');
      insertRow(db, { file_path: tmpFile, file_mtime_ms: 0, embedding_status: 'success' });

      const result = incMod.batchUpdateMtimes([tmpFile]);
      expect(result.updated).toBe(1);

      const row = db.prepare('SELECT file_mtime_ms FROM memory_index WHERE file_path = ?').get(tmpFile) as FileMtimeRow | undefined;
      const stats = fs.statSync(tmpFile);
      expect(row?.file_mtime_ms).toBe(stats.mtimeMs);

      const decision = incMod.shouldReindex(tmpFile);
      expect(decision).toBe('skip');

      removeTempFile(tmpFile);
      db.close();
    });

    it('CHK-117: Failed file → mtime NOT updated → retried on next scan', () => {
      const db = createTestDb();
      incMod.init(db);

      const successFile = createTempFile('success file content');
      const failFile = createTempFile('fail file content');

      insertRow(db, { file_path: successFile, file_mtime_ms: 1000000000000, embedding_status: 'success' });
      insertRow(db, { file_path: failFile, file_mtime_ms: 1000000000000, embedding_status: 'success' });

      const successOnly = [successFile];
      const result = incMod.batchUpdateMtimes(successOnly);
      expect(result.updated).toBe(1);

      const successDecision = incMod.shouldReindex(successFile);
      expect(successDecision).toBe('skip');

      const failDecision = incMod.shouldReindex(failFile);
      expect(failDecision).toBe('modified');

      removeTempFile(successFile);
      removeTempFile(failFile);
      db.close();
    });

    it('T106-Categorize: File with stale mtime re-categorized as toUpdate', () => {
      const db = createTestDb();
      incMod.init(db);

      const file = createTempFile('content for categorize test');
      insertRow(db, { file_path: file, file_mtime_ms: 1000000000000, embedding_status: 'success' });

      const categorized = incMod.categorizeFilesForIndexing([file]);
      expect(categorized.toUpdate).toContain(file);
      expect(categorized.toSkip.length).toBe(0);

      removeTempFile(file);
      db.close();
    });

    it('T106-PendingRetry: File with pending embedding → reindex on next scan', () => {
      const db = createTestDb();
      incMod.init(db);

      const file = createTempFile('pending embedding content');
      const stats = fs.statSync(file);
      insertRow(db, { file_path: file, file_mtime_ms: stats.mtimeMs, embedding_status: 'pending' });

      const decision = incMod.shouldReindex(file);
      expect(decision).toBe('reindex');

      removeTempFile(file);
      db.close();
    });

    it('T106-FailedRetry: File with failed embedding → reindex on next scan', () => {
      const db = createTestDb();
      incMod.init(db);

      const file = createTempFile('failed embedding content');
      const stats = fs.statSync(file);
      insertRow(db, { file_path: file, file_mtime_ms: stats.mtimeMs, embedding_status: 'failed' });

      const decision = incMod.shouldReindex(file);
      expect(decision).toBe('reindex');

      removeTempFile(file);
      db.close();
    });

    it('T106-BatchMix: Mixed batch → only successful files get mtime updated', () => {
      const db = createTestDb();
      incMod.init(db);

      const files = Array.from({ length: 5 }, (_, i) =>
        createTempFile(`batch mix file ${i}`)
      );

      for (const f of files) {
        insertRow(db, { file_path: f, file_mtime_ms: 1000000000000, embedding_status: 'success' });
      }

      const successFiles = [files[0], files[2], files[4]];
      const updateResult = incMod.batchUpdateMtimes(successFiles);
      expect(updateResult.updated).toBe(3);

      for (const f of successFiles) {
        const decision = incMod.shouldReindex(f);
        expect(decision).toBe('skip');
      }

      const failFiles = [files[1], files[3]];
      for (const f of failFiles) {
        const decision = incMod.shouldReindex(f);
        expect(decision).toBe('modified');
      }

      for (const f of files) removeTempFile(f);
      db.close();
    });

    it('T106-NullDb: batchUpdateMtimes with null db → all failed', () => {
      // @ts-expect-error exercising the module's null-db guard path
      incMod.init(null);
      const result = incMod.batchUpdateMtimes(['/some/file.md', '/another/file.md']);
      expect(result.updated).toBe(0);
      expect(result.failed).toBe(2);
    });
  });
});
