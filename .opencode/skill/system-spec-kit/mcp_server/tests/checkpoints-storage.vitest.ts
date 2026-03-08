// ---------------------------------------------------------------
// TEST: CHECKPOINTS STORAGE
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import * as mod from '../lib/storage/checkpoints';
import type { CheckpointInfo } from '../lib/storage/checkpoints';
import Database from 'better-sqlite3';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as zlib from 'zlib';

/* ─────────────────────────────────────────────────────────────
   DATABASE HELPERS
──────────────────────────────────────────────────────────────── */

let testDb: Database.Database | null = null;
let tmpDbPath: string = '';

function getTestDb(): Database.Database {
  if (!testDb) {
    throw new Error('Test database not initialized');
  }
  return testDb;
}

function requireValue<T>(value: T | null | undefined): T {
  expect(value).toBeDefined();
  if (value == null) {
    throw new Error('Expected value to be defined');
  }
  return value;
}

function createTestDb(): void {
  tmpDbPath = path.join(os.tmpdir(), `checkpoints-test-${Date.now()}.db`);
  testDb = new Database(tmpDbPath);
  const database = getTestDb();

  database.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      anchor_id TEXT,
      title TEXT,
      trigger_phrases TEXT,
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      embedding_model TEXT,
      embedding_generated_at TEXT,
      embedding_status TEXT DEFAULT 'success',
      importance_tier TEXT DEFAULT 'normal',
      confidence REAL DEFAULT 0.5,
      stability REAL DEFAULT 1.0,
      difficulty REAL DEFAULT 5.0,
      last_review TEXT,
      review_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS checkpoints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL,
      spec_folder TEXT,
      git_branch TEXT,
      memory_snapshot BLOB,
      file_snapshot BLOB,
      metadata TEXT
    );

    CREATE TABLE IF NOT EXISTS working_memory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL,
      value TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      extracted_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT,
      UNIQUE(source_id, target_id, relation)
    );
  `);

  // Seed some test memories
  const stmt = database.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title, created_at, importance_tier)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const now = new Date().toISOString();
  stmt.run(1, 'test-spec', '/test/memory/mem1.md', 'Test Memory 1', now, 'normal');
  stmt.run(2, 'test-spec', '/test/memory/mem2.md', 'Test Memory 2', now, 'important');
  stmt.run(3, 'other-spec', '/test/memory/mem3.md', 'Test Memory 3', now, 'critical');

  database.prepare(`
    INSERT INTO causal_edges (id, source_id, target_id, relation)
    VALUES (?, ?, ?, ?)
  `).run(1, '1', '2', 'supports');
  database.prepare(`
    INSERT INTO causal_edges (id, source_id, target_id, relation)
    VALUES (?, ?, ?, ?)
  `).run(2, '1', '3', 'derived_from');
  database.prepare(`
    INSERT INTO causal_edges (id, source_id, target_id, relation)
    VALUES (?, ?, ?, ?)
  `).run(3, '3', '3', 'supports');

  mod.init(database);
}

function cleanupDb(): void {
  if (testDb) {
    try { testDb.close(); } catch {}
  }
  if (tmpDbPath && fs.existsSync(tmpDbPath)) {
    try { fs.unlinkSync(tmpDbPath); } catch {}
  }
}

/* ─────────────────────────────────────────────────────────────
   TESTS
──────────────────────────────────────────────────────────────── */

describe('Checkpoints Storage (T503)', () => {
  beforeAll(() => {
    createTestDb();
  });

  afterAll(() => {
    cleanupDb();
  });

  // 5.1 CREATE CHECKPOINT (T503-01)
  describe('Create Checkpoint', () => {
    it('T503-01: Create checkpoint stores data', () => {
      const checkpoint = mod.createCheckpoint({
        name: 'test-checkpoint-1',
        metadata: { testKey: 'testValue' },
      });
      const createdCheckpoint = requireValue(checkpoint);

      expect(createdCheckpoint.name).toBe('test-checkpoint-1');
      expect(createdCheckpoint.id).toBeGreaterThan(0);
    });
  });

  // 5.2 LIST CHECKPOINTS (T503-02)
  describe('List Checkpoints', () => {
    it('T503-02: List checkpoints returns all', () => {
      const list = mod.listCheckpoints();

      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThanOrEqual(1);

      const first = list[0];
      expect(first.name).toBeDefined();
      expect(first.createdAt).toBeDefined();
      expect(typeof first.snapshotSize).toBe('number');
    });
  });

  // 5.3 RESTORE CHECKPOINT (T503-03)
  describe('Restore Checkpoint', () => {
    it('T503-03: Restore checkpoint retrieves data', () => {
      const result = mod.restoreCheckpoint('test-checkpoint-1');

      expect(result).toBeDefined();
      expect(result.errors.length).toBe(0);
    });
  });

  // 5.4 DELETE CHECKPOINT (T503-04)
  describe('Delete Checkpoint', () => {
    it('T503-04: Delete checkpoint removes data', () => {
      mod.createCheckpoint({ name: 'to-delete' });

      const deleted = mod.deleteCheckpoint('to-delete');
      expect(deleted).toBe(true);

      if (mod.getCheckpoint) {
        const cp = mod.getCheckpoint('to-delete');
        expect(cp).toBeFalsy();
      }
    });
  });

  // 5.5 NON-EXISTENT CHECKPOINT (T503-05)
  describe('Non-existent Checkpoint', () => {
    it('T503-05a: Non-existent checkpoint returns null', () => {
      if (!mod.getCheckpoint) return;

      const cp = mod.getCheckpoint('does-not-exist');
      expect(cp == null).toBe(true);
    });

    it('T503-05b: Restore non-existent checkpoint returns errors', () => {
      const result = mod.restoreCheckpoint('does-not-exist');
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  // 5.6 DELETE NON-EXISTENT (T503-06)
  describe('Delete Non-existent', () => {
    it('T503-06: Delete non-existent returns false', () => {
      const result = mod.deleteCheckpoint('never-existed');
      expect(result).toBe(false);
    });
  });

  // 5.7 MAX CHECKPOINTS LIMIT (T503-07)
  describe('Max Checkpoints Limit', () => {
    it('T503-07: Max checkpoints limit enforced', () => {
      if (!mod.MAX_CHECKPOINTS) return;

      const maxCp = mod.MAX_CHECKPOINTS;

      for (let i = 0; i < maxCp + 3; i++) {
        mod.createCheckpoint({ name: `overflow-cp-${i}` });
      }

      const list = mod.listCheckpoints();
      expect(list.length).toBeLessThanOrEqual(maxCp);
    });
  });

  // 5.8 CHECKPOINT METADATA PRESERVED (T503-08)
  describe('Checkpoint Metadata', () => {
    it('T503-08: Checkpoint metadata preserved', () => {
      if (!mod.getCheckpoint) return;

      const created = mod.createCheckpoint({
        name: 'metadata-test',
        specFolder: 'test-spec',
        metadata: { version: 2, author: 'test', tags: ['alpha', 'beta'] },
      });
      requireValue(created);

      const list = mod.listCheckpoints();
      const found = requireValue(list.find((cp: CheckpointInfo) => cp.name === 'metadata-test'));

      expect(found.metadata).toBeDefined();
      expect(found.metadata.version).toBe(2);
      expect(found.metadata.author).toBe('test');
      expect(found.metadata.memoryCount).toBeGreaterThanOrEqual(0);
    });
  });

  // 5.9 EMPTY DATABASE (T503-09)
  describe('Empty Database', () => {
    it('T503-09: Empty database returns empty list', () => {
      const emptyDbPath = path.join(os.tmpdir(), `empty-cp-test-${Date.now()}.db`);
      const emptyDb = new Database(emptyDbPath);
      emptyDb.exec(`
        CREATE TABLE IF NOT EXISTS memory_index (
          id INTEGER PRIMARY KEY, spec_folder TEXT, file_path TEXT,
          title TEXT, created_at TEXT, importance_tier TEXT DEFAULT 'normal',
          anchor_id TEXT, trigger_phrases TEXT, importance_weight REAL DEFAULT 0.5,
          updated_at TEXT, embedding_model TEXT, embedding_generated_at TEXT,
          embedding_status TEXT DEFAULT 'success', confidence REAL DEFAULT 0.5,
          stability REAL DEFAULT 1.0, difficulty REAL DEFAULT 5.0,
          last_review TEXT, review_count INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS checkpoints (
          id INTEGER PRIMARY KEY, name TEXT UNIQUE, created_at TEXT,
          spec_folder TEXT, git_branch TEXT, memory_snapshot BLOB,
          file_snapshot BLOB, metadata TEXT
        );
      `);

      mod.init(emptyDb);

      const list = mod.listCheckpoints();
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBe(0);

      emptyDb.close();
      fs.unlinkSync(emptyDbPath);

      // Re-init with original test database
       mod.init(getTestDb());
    });
  });

  // 5.10 SPEC FOLDER FILTERING (T503-10)
  describe('Spec Folder Filtering', () => {
    it('T503-10: Spec folder filtering', () => {
      mod.createCheckpoint({
        name: 'folder-filter-test',
        specFolder: 'test-spec',
      });

      const allCheckpoints = mod.listCheckpoints();
      const filteredCheckpoints = mod.listCheckpoints('test-spec');

      expect(Array.isArray(filteredCheckpoints)).toBe(true);
      const allWithFolder = filteredCheckpoints.every(cp => cp.specFolder === 'test-spec');
      expect(allWithFolder || filteredCheckpoints.length === 0).toBe(true);
    });
  });

  describe('Scoped causal edge snapshots', () => {
    it('T503-11: spec-folder checkpoint snapshots only in-folder causal edges', () => {
      const checkpoint = mod.createCheckpoint({
        name: 'scoped-edge-snapshot',
        specFolder: 'test-spec',
      });
      requireValue(checkpoint);

      const stored = requireValue(getTestDb().prepare(
        'SELECT memory_snapshot FROM checkpoints WHERE name = ?'
      ).get('scoped-edge-snapshot') as { memory_snapshot: Buffer } | undefined);
      const snapshot = JSON.parse(
        zlib.gunzipSync(stored.memory_snapshot).toString('utf-8')
      ) as { causalEdges?: Array<{ source_id: string; target_id: string }> };

      expect(snapshot.causalEdges).toEqual([
        expect.objectContaining({ source_id: '1', target_id: '2' }),
        expect.objectContaining({ source_id: '1', target_id: '3' }),
      ]);

      mod.deleteCheckpoint('scoped-edge-snapshot');
    });

    it('T503-12: scoped clearExisting restore preserves other spec data and unrelated edges', () => {
      const checkpoint = mod.createCheckpoint({
        name: 'scoped-edge-restore',
        specFolder: 'test-spec',
      });
      requireValue(checkpoint);

      const now = new Date().toISOString();
      getTestDb().prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, created_at, importance_tier)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(10, 'test-spec', '/test/memory/newer.md', 'Newer Memory', now, 'normal');
      getTestDb().prepare(`
        INSERT OR REPLACE INTO causal_edges (id, source_id, target_id, relation)
        VALUES (?, ?, ?, ?)
      `).run(10, '2', '10', 'supports');

      const result = mod.restoreCheckpoint('scoped-edge-restore', true);

      expect(result.errors).toEqual([]);
      expect(
        (getTestDb().prepare('SELECT COUNT(*) as cnt FROM memory_index WHERE spec_folder = ?').get('other-spec') as { cnt: number }).cnt
      ).toBe(1);
      expect(
        (getTestDb().prepare('SELECT COUNT(*) as cnt FROM memory_index WHERE spec_folder = ?').get('test-spec') as { cnt: number }).cnt
      ).toBe(2);
      expect(
        (getTestDb().prepare('SELECT COUNT(*) as cnt FROM causal_edges WHERE source_id = ? AND target_id = ?').get('1', '2') as { cnt: number }).cnt
      ).toBe(1);
      expect(
        (getTestDb().prepare('SELECT COUNT(*) as cnt FROM causal_edges WHERE source_id = ? AND target_id = ?').get('3', '3') as { cnt: number }).cnt
      ).toBe(1);
      expect(
        (getTestDb().prepare('SELECT COUNT(*) as cnt FROM causal_edges WHERE source_id = ? AND target_id = ?').get('1', '3') as { cnt: number }).cnt
      ).toBe(1);
      expect(
        (getTestDb().prepare('SELECT COUNT(*) as cnt FROM causal_edges WHERE source_id = ? AND target_id = ?').get('2', '10') as { cnt: number }).cnt
      ).toBe(0);

      mod.deleteCheckpoint('scoped-edge-restore');
    });

    it('T503-13: scoped merge restore replaces stale in-folder edges without touching unrelated ones', () => {
      const checkpoint = mod.createCheckpoint({
        name: 'scoped-edge-merge-restore',
        specFolder: 'test-spec',
      });
      requireValue(checkpoint);

      getTestDb().prepare('DELETE FROM causal_edges WHERE source_id = ? AND target_id = ?').run('1', '2');
      getTestDb().prepare(`
        INSERT OR REPLACE INTO causal_edges (id, source_id, target_id, relation)
        VALUES (?, ?, ?, ?)
      `).run(11, '2', '3', 'supports');

      const result = mod.restoreCheckpoint('scoped-edge-merge-restore', false);

      expect(result.errors).toEqual([]);
      expect(
        (getTestDb().prepare('SELECT COUNT(*) as cnt FROM causal_edges WHERE source_id = ? AND target_id = ?').get('1', '2') as { cnt: number }).cnt
      ).toBe(1);
      expect(
        (getTestDb().prepare('SELECT COUNT(*) as cnt FROM causal_edges WHERE source_id = ? AND target_id = ?').get('1', '3') as { cnt: number }).cnt
      ).toBe(1);
      expect(
        (getTestDb().prepare('SELECT COUNT(*) as cnt FROM causal_edges WHERE source_id = ? AND target_id = ?').get('2', '3') as { cnt: number }).cnt
      ).toBe(0);
      expect(
        (getTestDb().prepare('SELECT COUNT(*) as cnt FROM causal_edges WHERE source_id = ? AND target_id = ?').get('3', '3') as { cnt: number }).cnt
      ).toBe(1);

      mod.deleteCheckpoint('scoped-edge-merge-restore');
    });
  });
});
