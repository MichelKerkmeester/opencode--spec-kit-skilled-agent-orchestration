// TEST: CHECKPOINT WORKING MEMORY
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as zlib from 'zlib';
import * as checkpointsMod from '../lib/storage/checkpoints';
import BetterSqlite3 from 'better-sqlite3';

type CheckpointsModule = typeof checkpointsMod;
type TestDatabase = InstanceType<typeof BetterSqlite3>;
type MemorySnapshotRow = { memory_snapshot: Buffer };
type CountRow = { cnt: number };
type WorkingMemoryRow = {
  session_id: string;
  memory_id: number;
  attention_score: number;
  focus_count: number;
};
type SnapshotWorkingMemoryEntry = {
  session_id: string;
  memory_id: number;
  attention_score: number;
};
type SnapshotPayload = {
  workingMemory: SnapshotWorkingMemoryEntry[];
};

function expectDefined<T>(value: T | null | undefined): T {
  expect(value).toBeDefined();
  return value as T;
}

describe('T213: Checkpoint Working Memory Restore', () => {
  let mod: CheckpointsModule;
  let testDb: TestDatabase;
  let tmpDbPath: string;

  function createTestDb() {
    tmpDbPath = path.join(os.tmpdir(), `t213-wm-checkpoint-${Date.now()}.db`);
    testDb = new BetterSqlite3(tmpDbPath);

    testDb.exec(`
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
        session_id TEXT NOT NULL,
        memory_id INTEGER NOT NULL,
        attention_score REAL DEFAULT 1.0,
        added_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_focused TEXT DEFAULT CURRENT_TIMESTAMP,
        focus_count INTEGER DEFAULT 1,
        UNIQUE(session_id, memory_id),
        FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE
      );
    `);

    const now = new Date().toISOString();
    const memStmt = testDb.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, title, created_at, importance_tier)
      VALUES (?, ?, ?, ?, ?)
    `);
    memStmt.run('test-spec', '/test/memory/mem1.md', 'Test Memory 1', now, 'normal');
    memStmt.run('test-spec', '/test/memory/mem2.md', 'Test Memory 2', now, 'important');

    mod = checkpointsMod;
    mod.init(testDb);
  }

  beforeAll(() => {
    createTestDb();
  });

  afterAll(() => {
    if (testDb) {
      try { testDb.close(); } catch {}
    }
    if (tmpDbPath && fs.existsSync(tmpDbPath)) {
      try { fs.unlinkSync(tmpDbPath); } catch {}
    }
    try { mod.deleteCheckpoint('t213-snapshot-test'); } catch {}
  });

  describe('Working memory included in checkpoint snapshot', () => {
    it('T213-01: Checkpoint created with working memory', () => {
      const now = new Date().toISOString();

      testDb.prepare(`
        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('session-alpha', 1, 0.85, now, now, 3);

      testDb.prepare(`
        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('session-alpha', 2, 0.6, now, now, 1);

      const checkpoint = expectDefined(mod.createCheckpoint({ name: 't213-snapshot-test' }));
      expect(checkpoint).not.toBeNull();
      expect(checkpoint.id).toBeDefined();
      expect(checkpoint.name).toBe('t213-snapshot-test');
    });

    it('T213-02: Snapshot contains correct working memory data', () => {
      const raw = expectDefined(testDb
        .prepare<unknown[], MemorySnapshotRow>('SELECT memory_snapshot FROM checkpoints WHERE name = ?')
        .get('t213-snapshot-test'));
      expect(raw.memory_snapshot).toBeDefined();

      const decompressed = zlib.gunzipSync(raw.memory_snapshot);
      const snapshot = JSON.parse(decompressed.toString()) as SnapshotPayload;

      expect(Array.isArray(snapshot.workingMemory)).toBe(true);
      expect(snapshot.workingMemory.length).toBe(2);

      const entry = expectDefined(snapshot.workingMemory.find(entry => entry.memory_id === 1));
      expect(entry.session_id).toBe('session-alpha');
      expect(entry.attention_score).toBe(0.85);
    });
  });

  describe('Working memory survives save/restore cycle', () => {
    it('T213-03: Working memory restored count correct', () => {
      const wmBefore = expectDefined(testDb.prepare<unknown[], CountRow>('SELECT COUNT(*) as cnt FROM working_memory').get());
      expect(wmBefore.cnt).toBeGreaterThanOrEqual(1);

      testDb.prepare('DELETE FROM working_memory').run();
      const wmAfterClear = expectDefined(testDb.prepare<unknown[], CountRow>('SELECT COUNT(*) as cnt FROM working_memory').get());
      expect(wmAfterClear.cnt).toBe(0);

      const result = mod.restoreCheckpoint('t213-snapshot-test');
      expect(result).toBeDefined();
      expect(result.errors.length).toBe(0);
      expect(result.workingMemoryRestored).toBe(2);
    });

    it('T213-04: Working memory table has correct row count', () => {
      const wmAfterRestore = testDb.prepare<unknown[], WorkingMemoryRow>('SELECT * FROM working_memory ORDER BY id').all();
      expect(wmAfterRestore.length).toBe(2);
    });

    it('T213-05: Working memory data integrity preserved', () => {
      const wmAfterRestore = testDb.prepare<unknown[], WorkingMemoryRow>('SELECT * FROM working_memory ORDER BY id').all();
      const entry1 = expectDefined(wmAfterRestore.find(entry => entry.memory_id === 1));
      expect(entry1.session_id).toBe('session-alpha');
      expect(entry1.attention_score).toBe(0.85);
      expect(entry1.focus_count).toBe(3);
    });
  });

  describe('clearExisting clears and restores working memory', () => {
    it('T213-06: clearExisting removed non-checkpoint working memory', () => {
      const now = new Date().toISOString();
      testDb.prepare(`
        INSERT OR REPLACE INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('session-beta', 2, 0.99, now, now, 10);

      const result = mod.restoreCheckpoint('t213-snapshot-test', true);
      expect(result).toBeDefined();
      expect(result.errors.length).toBe(0);

      const betaEntry = testDb.prepare<unknown[], WorkingMemoryRow>(
        "SELECT * FROM working_memory WHERE session_id = 'session-beta'"
      ).get();
      expect(betaEntry).toBeUndefined();

      const wmAfterRestore = expectDefined(testDb.prepare<unknown[], CountRow>('SELECT COUNT(*) as cnt FROM working_memory').get());
      expect(wmAfterRestore.cnt).toBe(2);
    });

    it('T213-07: clearExisting restore reports correct WM count', () => {
      const result = mod.restoreCheckpoint('t213-snapshot-test', true);
      expect(result.workingMemoryRestored).toBe(2);
    });
  });

  describe('RestoreResult interface', () => {
    it('T213-08: workingMemoryRestored field exists and is number', () => {
      const result = mod.restoreCheckpoint('t213-snapshot-test');
      expect(result).toBeDefined();
      expect(typeof result.workingMemoryRestored).toBe('number');
    });
  });

  describe('Checkpoint with empty working memory', () => {
    it('T213-09: Empty WM checkpoint restores without errors', () => {
      testDb.prepare('DELETE FROM working_memory').run();

      const cp = mod.createCheckpoint({ name: 't213-empty-wm' });
      expect(cp).not.toBeNull();

      const result = mod.restoreCheckpoint('t213-empty-wm');
      expect(result).toBeDefined();
      expect(result.errors.length).toBe(0);
      expect(result.workingMemoryRestored).toBe(0);

      mod.deleteCheckpoint('t213-empty-wm');
    });
  });
});
