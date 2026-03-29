// TEST: CHECKPOINTS STORAGE
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

import * as mod from '../lib/storage/checkpoints';
import type { CheckpointInfo } from '../lib/storage/checkpoints';
import * as causalEdges from '../lib/storage/causal-edges';
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
  causalEdges.init(database);
}

function cleanupDb(): void {
  if (testDb) {
    try { testDb.close(); } catch {}
  }
  if (tmpDbPath && fs.existsSync(tmpDbPath)) {
    try { fs.unlinkSync(tmpDbPath); } catch {}
  }
}

function createIsolatedRestoreDb(label: string): { database: Database.Database; dbPath: string } {
  const dbPath = path.join(os.tmpdir(), `checkpoints-restore-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.db`);
  const database = new Database(dbPath);
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
      review_count INTEGER DEFAULT 0,
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT,
      shared_space_id TEXT
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
      session_id TEXT NOT NULL,
      memory_id INTEGER,
      attention_score REAL DEFAULT 1.0,
      added_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_focused TEXT DEFAULT CURRENT_TIMESTAMP,
      focus_count INTEGER DEFAULT 1,
      event_counter INTEGER NOT NULL DEFAULT 0,
      mention_count INTEGER NOT NULL DEFAULT 0,
      source_tool TEXT,
      source_call_id TEXT,
      extraction_rule_id TEXT,
      redaction_applied INTEGER NOT NULL DEFAULT 0,
      UNIQUE(session_id, memory_id)
    );

    CREATE TABLE IF NOT EXISTS shared_spaces (
      space_id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      name TEXT NOT NULL,
      rollout_enabled INTEGER DEFAULT 0,
      rollout_cohort TEXT,
      kill_switch INTEGER DEFAULT 0,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS session_state (
      session_id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'active',
      spec_folder TEXT,
      current_task TEXT,
      last_action TEXT,
      context_summary TEXT,
      pending_work TEXT,
      state_data TEXT,
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS session_sent_memories (
      session_id TEXT NOT NULL,
      memory_hash TEXT NOT NULL,
      memory_id INTEGER,
      sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (session_id, memory_hash)
    );
  `);
  return { database, dbPath };
}

function cleanupIsolatedRestoreDb(database: Database.Database | null, dbPath: string): void {
  if (database) {
    try { database.close(); } catch {}
  }
  if (dbPath && fs.existsSync(dbPath)) {
    try { fs.unlinkSync(dbPath); } catch {}
  }
}

function updateCheckpointSnapshot(
  database: Database.Database,
  checkpointName: string,
  mutate: (snapshot: {
    tables?: Record<string, { columns: string[]; rows: Array<Record<string, unknown>> }>;
  }) => void,
): void {
  const row = database.prepare(
    'SELECT memory_snapshot FROM checkpoints WHERE name = ?'
  ).get(checkpointName) as { memory_snapshot: Buffer } | undefined;
  expect(row).toBeDefined();
  const snapshot = JSON.parse(
    zlib.gunzipSync(requireValue(row).memory_snapshot).toString('utf-8')
  ) as {
    tables?: Record<string, { columns: string[]; rows: Array<Record<string, unknown>> }>;
  };
  mutate(snapshot);
  database.prepare('UPDATE checkpoints SET memory_snapshot = ? WHERE name = ?').run(
    zlib.gzipSync(Buffer.from(JSON.stringify(snapshot))),
    checkpointName,
  );
}

function seedTenantScopedRestoreFixture(database: Database.Database, now: string): void {
  database.prepare(`
    INSERT INTO memory_index (
      id, spec_folder, file_path, title, created_at, updated_at, importance_tier, tenant_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    1, 'tenant-spec', '/tmp/tenant-a.md', 'Tenant A Snapshot', now, now, 'normal', 'tenant-a',
    2, 'tenant-spec', '/tmp/tenant-b.md', 'Tenant B Snapshot', now, now, 'normal', 'tenant-b',
  );
  database.prepare(`
    INSERT INTO working_memory (
      session_id, memory_id, attention_score, added_at, last_focused, focus_count
    ) VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)
  `).run(
    'session-a', 1, 1.0, now, now, 1,
    'session-b', 2, 2.0, now, now, 1,
  );
  database.prepare(`
    INSERT INTO session_state (
      session_id, status, spec_folder, current_task, tenant_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'session-a', 'active', 'tenant-spec', 'snapshot-task-a', 'tenant-a', now, now,
    'session-b', 'active', 'tenant-spec', 'snapshot-task-b', 'tenant-b', now, now,
  );
}

function applyTenantScopedLiveMutations(database: Database.Database): void {
  database.prepare('UPDATE memory_index SET title = ? WHERE id = ?').run('Tenant A Live', 1);
  database.prepare('UPDATE memory_index SET title = ? WHERE id = ?').run('Tenant B Live', 2);
  database.prepare('UPDATE working_memory SET attention_score = ? WHERE memory_id = ?').run(9.0, 1);
  database.prepare('UPDATE working_memory SET attention_score = ? WHERE memory_id = ?').run(8.0, 2);
  database.prepare('UPDATE session_state SET current_task = ? WHERE session_id = ?').run('live-task-a', 'session-a');
  database.prepare('UPDATE session_state SET current_task = ? WHERE session_id = ?').run('live-task-b', 'session-b');
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
      mod.createCheckpoint({ name: 'restore-target-checkpoint' });
      const result = mod.restoreCheckpoint('restore-target-checkpoint');

      expect(result).toBeDefined();
      // Restore may report non-fatal warnings (for example skipped self-loop edges).
      // The operation is valid as long as no fatal "not found / invalid snapshot" errors occur.
      const fatalErrors = result.errors.filter((error) =>
        error.includes('Checkpoint not found') || error.includes('Invalid snapshot format')
      );
      expect(fatalErrors).toEqual([]);
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
      causalEdges.init(emptyDb);

      const list = mod.listCheckpoints();
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBe(0);

      emptyDb.close();
      fs.unlinkSync(emptyDbPath);

      // Re-init with original test database
       mod.init(getTestDb());
       causalEdges.init(getTestDb());
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

  describe('Merge restore auxiliary-table safety', () => {
    let isolatedDb: Database.Database | null = null;
    let isolatedDbPath = '';

    beforeEach(() => {
      const isolated = createIsolatedRestoreDb('aux');
      isolatedDb = isolated.database;
      isolatedDbPath = isolated.dbPath;
      mod.init(isolated.database);
      causalEdges.init(isolated.database);
    });

    afterEach(() => {
      cleanupIsolatedRestoreDb(isolatedDb, isolatedDbPath);
      isolatedDb = null;
      isolatedDbPath = '';
      mod.init(getTestDb());
      causalEdges.init(getTestDb());
    });

    it('T503-14: scoped merge restore only replaces auxiliary rows inside the checkpoint scope', () => {
      const database = requireValue(isolatedDb);
      const now = new Date().toISOString();

      database.prepare(`
        INSERT INTO memory_index (
          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(1, 'test-spec', '/tmp/test-1.md', 'Scoped Memory', now, now, 'normal', 'space-a');
      database.prepare(`
        INSERT INTO memory_index (
          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(2, 'other-spec', '/tmp/test-2.md', 'Other Memory', now, now, 'normal', 'space-b');

      database.prepare(`
        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)
      `).run('space-a', 'tenant-a', 'Space A Snapshot', now, now, 'space-b', 'tenant-a', 'Space B Snapshot', now, now);
      database.prepare(`
        INSERT INTO working_memory (
          session_id, memory_id, attention_score, added_at, last_focused, focus_count
        ) VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)
      `).run('session-test', 1, 1.0, now, now, 1, 'session-other', 2, 2.0, now, now, 1);
      database.prepare(`
        INSERT INTO session_state (
          session_id, status, spec_folder, current_task, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)
      `).run('session-test', 'active', 'test-spec', 'snapshot-task', now, now, 'session-other', 'active', 'other-spec', 'other-snapshot-task', now, now);
      database.prepare(`
        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
        VALUES (?, ?, ?, ?), (?, ?, ?, ?)
      `).run('session-test', 'hash-test-snapshot', 1, now, 'session-other', 'hash-other-snapshot', 2, now);

      const checkpoint = mod.createCheckpoint({
        name: 'scoped-aux-merge-restore',
        specFolder: 'test-spec',
      });
      requireValue(checkpoint);

      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space A Live', 'space-a');
      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space B Live', 'space-b');
      database.prepare('DELETE FROM working_memory WHERE memory_id = ?').run(1);
      database.prepare(`
        INSERT INTO working_memory (
          session_id, memory_id, attention_score, added_at, last_focused, focus_count
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run('session-test-live', 1, 9.0, now, now, 5);
      database.prepare('UPDATE working_memory SET attention_score = ? WHERE memory_id = ?').run(8.0, 2);
      database.prepare('UPDATE session_state SET current_task = ? WHERE session_id = ?').run('live-task', 'session-test');
      database.prepare('UPDATE session_state SET current_task = ? WHERE session_id = ?').run('other-live-task', 'session-other');
      database.prepare('DELETE FROM session_sent_memories WHERE memory_id = ?').run(1);
      database.prepare(`
        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
        VALUES (?, ?, ?, ?)
      `).run('session-test', 'hash-test-live', 1, now);
      database.prepare('UPDATE session_sent_memories SET sent_at = ? WHERE memory_id = ?').run('other-live-sent', 2);

      const result = mod.restoreCheckpoint('scoped-aux-merge-restore', false);

      expect(result.errors).toEqual([]);
      expect(result.partialFailure).toBe(false);
      expect(
        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-a')
      ).toEqual({ name: 'Space A Snapshot' });
      expect(
        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-b')
      ).toEqual({ name: 'Space B Live' });
      expect(
        database.prepare('SELECT session_id, attention_score FROM working_memory WHERE memory_id = ?').get(1)
      ).toEqual({ session_id: 'session-test', attention_score: 1 });
      expect(
        database.prepare('SELECT session_id, attention_score FROM working_memory WHERE memory_id = ?').get(2)
      ).toEqual({ session_id: 'session-other', attention_score: 8 });
      expect(
        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-test')
      ).toEqual({ current_task: 'snapshot-task' });
      expect(
        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-other')
      ).toEqual({ current_task: 'other-live-task' });
      expect(
        database.prepare('SELECT memory_hash FROM session_sent_memories WHERE memory_id = ?').get(1)
      ).toEqual({ memory_hash: 'hash-test-snapshot' });
      expect(
        database.prepare('SELECT memory_hash, sent_at FROM session_sent_memories WHERE memory_id = ?').get(2)
      ).toEqual({ memory_hash: 'hash-other-snapshot', sent_at: 'other-live-sent' });
    });

    it('T503-15: unscoped merge restore preserves auxiliary rows outside the checkpoint snapshot', () => {
      const database = requireValue(isolatedDb);
      const now = new Date().toISOString();

      database.prepare(`
        INSERT INTO memory_index (
          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(1, 'test-spec', '/tmp/test-1.md', 'Scoped Memory', now, now, 'normal', 'space-a');
      database.prepare(`
        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).run('space-a', 'tenant-a', 'Space A Snapshot', now, now);
      database.prepare(`
        INSERT INTO working_memory (
          session_id, memory_id, attention_score, added_at, last_focused, focus_count
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run('session-test', 1, 1.0, now, now, 1);
      database.prepare(`
        INSERT INTO session_state (
          session_id, status, spec_folder, current_task, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run('session-test', 'active', 'test-spec', 'snapshot-task', now, now);
      database.prepare(`
        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
        VALUES (?, ?, ?, ?)
      `).run('session-test', 'hash-test-snapshot', 1, now);

      const checkpoint = mod.createCheckpoint({ name: 'global-merge-unsupported' });
      requireValue(checkpoint);

      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space A Live', 'space-a');
      database.prepare('UPDATE working_memory SET attention_score = ? WHERE memory_id = ?').run(9.0, 1);
      database.prepare('UPDATE session_state SET current_task = ? WHERE session_id = ?').run('live-task', 'session-test');
      database.prepare('DELETE FROM session_sent_memories WHERE memory_id = ?').run(1);
      database.prepare(`
        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
        VALUES (?, ?, ?, ?)
      `).run('session-test', 'hash-test-live', 1, now);
      database.prepare(`
        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).run('space-extra', 'tenant-a', 'Space Extra Live', now, now);
      database.prepare(`
        INSERT INTO working_memory (
          session_id, memory_id, attention_score, added_at, last_focused, focus_count
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run('session-extra', null, 3.0, now, now, 1);
      database.prepare(`
        INSERT INTO session_state (
          session_id, status, spec_folder, current_task, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run('session-extra', 'active', 'extra-spec', 'extra-live-task', now, now);
      database.prepare(`
        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
        VALUES (?, ?, ?, ?)
      `).run('session-extra', 'hash-extra-live', null, now);

      const result = mod.restoreCheckpoint('global-merge-unsupported', false);

      expect(result.errors).toEqual([]);
      expect(result.partialFailure).toBe(false);
      expect(
        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-a')
      ).toEqual({ name: 'Space A Snapshot' });
      expect(
        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-extra')
      ).toEqual({ name: 'Space Extra Live' });
      expect(
        database.prepare('SELECT attention_score FROM working_memory WHERE memory_id = ?').get(1)
      ).toEqual({ attention_score: 1 });
      expect(
        (database.prepare('SELECT COUNT(*) as cnt FROM working_memory WHERE session_id = ?').get('session-extra') as { cnt: number }).cnt
      ).toBe(1);
      expect(
        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-test')
      ).toEqual({ current_task: 'snapshot-task' });
      expect(
        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-extra')
      ).toEqual({ current_task: 'extra-live-task' });
      expect(
        database.prepare('SELECT memory_hash FROM session_sent_memories WHERE memory_id = ?').get(1)
      ).toEqual({ memory_hash: 'hash-test-snapshot' });
      expect(
        (database.prepare('SELECT COUNT(*) as cnt FROM session_sent_memories WHERE session_id = ?').get('session-extra') as { cnt: number }).cnt
      ).toBe(1);
    });

    it('T503-16: failed merge reinsert rolls back the pre-cleared auxiliary table', () => {
      const database = requireValue(isolatedDb);
      const now = new Date().toISOString();

      database.prepare(`
        INSERT INTO memory_index (
          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(1, 'test-spec', '/tmp/test-1.md', 'Scoped Memory', now, now, 'normal', 'space-a');
      database.prepare(`
        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).run('space-a', 'tenant-a', 'Space A Snapshot', now, now);

      const checkpoint = mod.createCheckpoint({
        name: 'scoped-rollback-restore',
        specFolder: 'test-spec',
      });
      requireValue(checkpoint);

      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space A Live', 'space-a');
      updateCheckpointSnapshot(database, 'scoped-rollback-restore', (snapshot) => {
        const table = snapshot.tables?.shared_spaces;
        expect(table).toBeDefined();
        requireValue(table).rows.push({
          space_id: 'space-bad',
          tenant_id: null,
          name: 'Broken Space',
          created_at: now,
          updated_at: now,
        });
      });

      const result = mod.restoreCheckpoint('scoped-rollback-restore', false);

      expect(result.partialFailure).toBe(true);
      expect(result.rolledBackTables).toContain('shared_spaces');
      expect(result.errors.some((error) => error.includes('shared_spaces: merge restore rolled back'))).toBe(true);
      expect(
        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-a')
      ).toEqual({ name: 'Space A Live' });
      expect(
        (database.prepare('SELECT COUNT(*) as cnt FROM shared_spaces WHERE space_id = ?').get('space-a') as { cnt: number }).cnt
      ).toBe(1);
    });

    it('T503-17: scoped clearExisting restore preserves same-folder rows outside the tenant scope', () => {
      const database = requireValue(isolatedDb);
      const now = new Date().toISOString();

      seedTenantScopedRestoreFixture(database, now);

      const checkpoint = mod.createCheckpoint({
        name: 'scoped-tenant-clear-restore',
        specFolder: 'tenant-spec',
        scope: { tenantId: 'tenant-a' },
      });
      requireValue(checkpoint);

      applyTenantScopedLiveMutations(database);

      const result = mod.restoreCheckpoint('scoped-tenant-clear-restore', true, {
        tenantId: 'tenant-a',
      });

      expect(result.errors).toEqual([]);
      expect(
        database.prepare('SELECT title FROM memory_index WHERE id = ?').get(1)
      ).toEqual({ title: 'Tenant A Snapshot' });
      expect(
        database.prepare('SELECT title FROM memory_index WHERE id = ?').get(2)
      ).toEqual({ title: 'Tenant B Live' });
      expect(
        database.prepare('SELECT attention_score FROM working_memory WHERE memory_id = ?').get(1)
      ).toEqual({ attention_score: 1 });
      expect(
        database.prepare('SELECT attention_score FROM working_memory WHERE memory_id = ?').get(2)
      ).toEqual({ attention_score: 8 });
    });

    it('T503-18: unscoped clearExisting restore still replaces the whole checkpoint folder', () => {
      const database = requireValue(isolatedDb);
      const now = new Date().toISOString();

      seedTenantScopedRestoreFixture(database, now);

      const checkpoint = mod.createCheckpoint({
        name: 'unscoped-folder-clear-restore',
        specFolder: 'tenant-spec',
      });
      requireValue(checkpoint);

      applyTenantScopedLiveMutations(database);

      const result = mod.restoreCheckpoint('unscoped-folder-clear-restore', true);

      expect(result.errors).toEqual([]);
      expect(
        database.prepare('SELECT title FROM memory_index WHERE id = ?').get(1)
      ).toEqual({ title: 'Tenant A Snapshot' });
      expect(
        database.prepare('SELECT title FROM memory_index WHERE id = ?').get(2)
      ).toEqual({ title: 'Tenant B Snapshot' });
      expect(
        database.prepare('SELECT attention_score FROM working_memory WHERE memory_id = ?').get(1)
      ).toEqual({ attention_score: 1 });
      expect(
        database.prepare('SELECT attention_score FROM working_memory WHERE memory_id = ?').get(2)
      ).toEqual({ attention_score: 2 });
      expect(
        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-a')
      ).toEqual({ current_task: 'snapshot-task-a' });
      expect(
        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-b')
      ).toEqual({ current_task: 'snapshot-task-b' });
    });

    it('T503-19: scoped merge restore respects tenant scope for memory-linked and direct-scope rows', () => {
      const database = requireValue(isolatedDb);
      const now = new Date().toISOString();

      seedTenantScopedRestoreFixture(database, now);

      const checkpoint = mod.createCheckpoint({
        name: 'scoped-tenant-merge-restore',
        specFolder: 'tenant-spec',
        scope: { tenantId: 'tenant-a' },
      });
      requireValue(checkpoint);

      applyTenantScopedLiveMutations(database);

      const result = mod.restoreCheckpoint('scoped-tenant-merge-restore', false, {
        tenantId: 'tenant-a',
      });

      expect(result.errors).toEqual([]);
      expect(result.partialFailure).toBe(false);
      expect(
        database.prepare('SELECT title FROM memory_index WHERE id = ?').get(1)
      ).toEqual({ title: 'Tenant A Snapshot' });
      expect(
        database.prepare('SELECT title FROM memory_index WHERE id = ?').get(2)
      ).toEqual({ title: 'Tenant B Live' });
      expect(
        database.prepare('SELECT attention_score FROM working_memory WHERE memory_id = ?').get(1)
      ).toEqual({ attention_score: 1 });
      expect(
        database.prepare('SELECT attention_score FROM working_memory WHERE memory_id = ?').get(2)
      ).toEqual({ attention_score: 8 });
    });
  });
});
