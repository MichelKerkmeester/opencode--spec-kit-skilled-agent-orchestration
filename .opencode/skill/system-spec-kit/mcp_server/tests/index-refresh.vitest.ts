// TEST: INDEX REFRESH
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

import * as mod from '../lib/storage/index-refresh';

let Database: any = null;
let db: any = null;
let dbPath: string = '';

describe('Index Refresh (T509)', () => {
  beforeAll(() => {
    Database = require('better-sqlite3');
    dbPath = path.join(os.tmpdir(), `index-refresh-test-${Date.now()}.sqlite`);
    db = new Database(dbPath);

    db.exec(`
      CREATE TABLE IF NOT EXISTS memory_index (
        id INTEGER PRIMARY KEY,
        spec_folder TEXT,
        file_path TEXT,
        embedding_status TEXT DEFAULT 'pending',
        embedding_model TEXT,
        embedding_generated_at TEXT,
        retry_count INTEGER DEFAULT 0,
        last_retry_at TEXT,
        failure_reason TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const insert = db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, embedding_status, retry_count)
      VALUES (?, ?, ?, ?, ?)
    `);
    insert.run(1, 'specs/001-test', 'memory/001.md', 'success', 0);
    insert.run(2, 'specs/001-test', 'memory/002.md', 'pending', 0);
    insert.run(3, 'specs/002-other', 'memory/003.md', 'retry', 1);
    insert.run(4, 'specs/002-other', 'memory/004.md', 'failed', 4);
    insert.run(5, 'specs/003-more', 'memory/005.md', 'partial', 0);
    insert.run(6, 'specs/003-more', 'memory/006.md', 'success', 0);

    mod.init(db);
  });

  afterAll(() => {
    try {
      if (db) db.close();
      if (dbPath && fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
    } catch { /* ignore cleanup errors */ }
  });

  describe('Get Index Stats (T509-01)', () => {
    it('T509-01a: getIndexStats returns correct total', () => {
      const stats = mod.getIndexStats();
      expect(stats).toBeDefined();
      expect(typeof stats.total).toBe('number');
      expect(stats.total).toBe(6);
    });

    it('T509-01b: Stats breakdown by embedding status', () => {
      const stats = mod.getIndexStats();
      expect(stats.success).toBe(2);
      expect(stats.pending).toBe(1);
      expect(stats.retry).toBe(1);
      expect(stats.failed).toBe(1);
      expect(stats.partial).toBe(1);
    });
  });

  describe('Needs Refresh Detection (T509-02)', () => {
    it('T509-02: needsRefresh detects stale entries', () => {
      const needs = mod.needsRefresh();
      expect(needs).toBe(true);
    });
  });

  describe('Get Unindexed Documents (T509-03)', () => {
    it('T509-03a: getUnindexedDocuments returns array', () => {
      const docs = mod.getUnindexedDocuments();
      expect(Array.isArray(docs)).toBe(true);
      expect(docs.length).toBeGreaterThan(0);
    });

    it('T509-03b: Excludes success and failed entries', () => {
      const docs = mod.getUnindexedDocuments();
      const statuses = docs.map((d: any) => d.embedding_status);
      const hasNonRefreshable = statuses.some((s: any) => s === 'success' || s === 'failed');
      expect(hasNonRefreshable).toBe(false);
    });

    it('T509-03c: Priority ordering: retry before pending', () => {
      const docs = mod.getUnindexedDocuments();
      if (docs.length < 2) return;

      const retryIdx = docs.findIndex((d: any) => d.embedding_status === 'retry');
      const pendingIdx = docs.findIndex((d: any) => d.embedding_status === 'pending');

      if (retryIdx < 0 || pendingIdx < 0) return;
      expect(retryIdx).toBeLessThan(pendingIdx);
    });
  });

  describe('Mark Indexed (T509-04)', () => {
    it('T509-04a: markIndexed returns true on success', () => {
      const result = mod.markIndexed(2, 'test-model-v1');
      expect(result).toBe(true);
    });

    it('T509-04b: Database updated to success status', () => {
      const row = db.prepare('SELECT embedding_status, embedding_model FROM memory_index WHERE id = 2').get();
      expect(row).toBeDefined();
      expect(row.embedding_status).toBe('success');
    });

    it('T509-04c: retry-recovered entries are marked indexed and removed from refresh queue', () => {
      const updated = mod.markIndexed(3, 'retry-recovered-model');
      expect(updated).toBe(true);

      const row = db.prepare('SELECT embedding_status, embedding_model FROM memory_index WHERE id = 3').get();
      expect(row).toBeDefined();
      expect(row.embedding_status).toBe('success');
      expect(row.embedding_model).toBe('retry-recovered-model');

      const unindexedIds = mod.getUnindexedDocuments().map((doc: { id: number }) => doc.id);
      expect(unindexedIds).not.toContain(3);
    });
  });

  describe('Mark Failed with Retry Logic (T509-05)', () => {
    it('T509-05a: markFailed returns true', () => {
      const resultRetry = mod.markFailed(5, 'Embedding API timeout');
      expect(resultRetry).toBe(true);
    });

    it('T509-05b: Status set to retry when retry_count < 3', () => {
      const row = db.prepare('SELECT embedding_status, retry_count, failure_reason FROM memory_index WHERE id = 5').get();
      expect(row).toBeDefined();
      expect(row.embedding_status).toBe('retry');
    });

    it('T509-05c: Failure reason stored', () => {
      const row = db.prepare('SELECT failure_reason FROM memory_index WHERE id = 5').get();
      expect(row).toBeDefined();
      expect(row.failure_reason).toBeTruthy();
    });
  });

  describe('Refresh with Empty/All-Success Index (T509-06)', () => {
    it('T509-06a: needsRefresh returns false when all indexed', () => {
      db.exec("UPDATE memory_index SET embedding_status = 'success' WHERE embedding_status != 'success' AND embedding_status != 'failed'");
      const needs = mod.needsRefresh();
      expect(needs).toBe(false);
    });

    it('T509-06b: ensureIndexFresh returns empty when nothing to refresh', () => {
      const docs = mod.ensureIndexFresh();
      expect(Array.isArray(docs)).toBe(true);
      expect(docs.length).toBe(0);
    });
  });
});
