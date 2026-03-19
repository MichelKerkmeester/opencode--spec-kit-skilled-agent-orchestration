// TEST: SESSION CLEANUP
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as sm from '../lib/session/session-manager';
import * as wm from '../lib/cognitive/working-memory';
import BetterSqlite3 from 'better-sqlite3';

describe('T302: Session Cleanup Tests', () => {
  type TestDatabase = InstanceType<typeof BetterSqlite3>;
  let testDb: TestDatabase | null = null;
  let tmpDbPath: string = '';

  function getTestDb(): TestDatabase {
    if (!testDb) {
      throw new Error('Test database not initialized');
    }
    return testDb;
  }

  function insertWorkingMemory(sessionId: string, memoryId: number, score: number = 0.8) {
    getTestDb().prepare(`
      INSERT OR REPLACE INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)
    `).run(sessionId, memoryId, score);
  }

  function countWorkingMemory(sessionId: string): number {
    const row = getTestDb().prepare(
      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ?'
    ).get(sessionId) as { count: number } | undefined;
    return row ? row.count : 0;
  }

  beforeAll(() => {
    tmpDbPath = path.join(os.tmpdir(), `t302-session-cleanup-${Date.now()}.db`);
    testDb = new BetterSqlite3(tmpDbPath);
    const database = getTestDb();

    // Create memory_index table (needed for FK reference in working_memory)
    database.exec(`
      CREATE TABLE IF NOT EXISTS memory_index (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spec_folder TEXT NOT NULL,
        file_path TEXT NOT NULL,
        title TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        importance_tier TEXT DEFAULT 'normal',
        anchor_id TEXT,
        trigger_phrases TEXT,
        importance_weight REAL DEFAULT 0.5,
        embedding_model TEXT,
        embedding_generated_at TEXT,
        embedding_status TEXT DEFAULT 'success',
        confidence REAL DEFAULT 0.5,
        stability REAL DEFAULT 1.0,
        difficulty REAL DEFAULT 5.0,
        last_review TEXT,
        review_count INTEGER DEFAULT 0
      );
    `);

    // Seed test memories for FK references
    const now = new Date().toISOString();
    for (let i = 1; i <= 10; i++) {
      database.prepare(`
        INSERT INTO memory_index (id, spec_folder, file_path, title, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(i, 'test-spec', `/test/mem${i}.md`, `Memory ${i}`, now);
    }

    // Init working memory module first (creates working_memory table)
    wm.init(database);

    // Init session manager (creates session_sent_memories, session_state, sets up intervals)
    const smResult = sm.init(database as unknown as Parameters<typeof sm.init>[0]);
    expect(smResult.success).toBe(true);
  });

  afterAll(() => {
    sm.shutdown();
    if (testDb) { try { testDb.close(); } catch { } }
    if (tmpDbPath && fs.existsSync(tmpDbPath)) { try { fs.unlinkSync(tmpDbPath); } catch { } }
  });

  describe('T302-GAP1: shutdown() clears intervals', () => {
    it('T302-01: shutdown() executes without error', () => {
      expect(() => sm.shutdown()).not.toThrow();
    });

    it('T302-02: shutdown() is idempotent (safe to call twice)', () => {
      expect(() => sm.shutdown()).not.toThrow();
    });

    it('T302-03: init() succeeds after shutdown() (intervals re-created)', () => {
      const result = sm.init(getTestDb() as unknown as Parameters<typeof sm.init>[0]);
      expect(result.success).toBe(true);
    });
  });

  describe('T302-GAP2a: completeSession() clears working memory', () => {
    it('T302-04 to T302-06: completeSession() clears working memory entries', () => {
      const sessionId = 'complete-test-session';

      // Setup: seed working memory entries
      insertWorkingMemory(sessionId, 1, 0.9);
      insertWorkingMemory(sessionId, 2, 0.7);
      insertWorkingMemory(sessionId, 3, 0.5);

      const countBefore = countWorkingMemory(sessionId);
      expect(countBefore).toBe(3);

      // Save session state first (completeSession updates session_state)
      sm.saveSessionState(sessionId, { currentTask: 'testing' });

      // Call completeSession — should clear working memory
      const result = sm.completeSession(sessionId);
      expect(result.success).toBe(true);

      // Verify working memory entries are gone
      const countAfter = countWorkingMemory(sessionId);
      expect(countAfter).toBe(0);

      // Cleanup
      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
      getTestDb().prepare('DELETE FROM session_state WHERE session_id = ?').run(sessionId);
    });
  });

  describe('T302-GAP2b: clearSession() clears working memory', () => {
    it('T302-07 to T302-10: clearSession() clears both working memory and sent_memories', () => {
      const sessionId = 'clear-test-session';

      // Seed working memory entries
      insertWorkingMemory(sessionId, 4, 0.8);
      insertWorkingMemory(sessionId, 5, 0.6);

      const countBefore = countWorkingMemory(sessionId);
      expect(countBefore).toBe(2);

      // Also add a sent_memories entry
      getTestDb().prepare(`
        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `).run(sessionId, 'test-hash-123', 4);

      // Call clearSession — should clear both sent_memories AND working memory
      const result = sm.clearSession(sessionId);
      expect(result.success).toBe(true);

      // Verify working memory entries are gone
      const countAfter = countWorkingMemory(sessionId);
      expect(countAfter).toBe(0);

      // Verify sent_memories also cleared
      const sentCount = getTestDb().prepare(
        'SELECT COUNT(*) as count FROM session_sent_memories WHERE session_id = ?'
      ).get(sessionId) as { count: number };
      expect(sentCount.count).toBe(0);

      // Cleanup
      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
      getTestDb().prepare('DELETE FROM session_sent_memories WHERE session_id = ?').run(sessionId);
    });
  });

  describe('T302-GAP3: Dead config property removed', () => {
    it('T302-11: WORKING_MEMORY_CONFIG does NOT have cleanupIntervalMs', () => {
      const config = wm.WORKING_MEMORY_CONFIG;
      expect(config).not.toHaveProperty('cleanupIntervalMs');
    });

    it('T302-12: All expected config keys present', () => {
      const config = wm.WORKING_MEMORY_CONFIG;
      const expectedKeys = ['enabled', 'maxCapacity', 'sessionTimeoutMs'];
      for (const key of expectedKeys) {
        expect(config).toHaveProperty(key);
      }
    });

    it('T302-13: getConfig() copy does NOT have cleanupIntervalMs', () => {
      const configCopy = wm.getConfig();
      expect(configCopy).not.toHaveProperty('cleanupIntervalMs');
    });
  });

  describe('T002: Working memory schema migration compatibility', () => {
    it('adds event_counter and mention_count to legacy working_memory tables', () => {
      const legacyDb = new BetterSqlite3(':memory:');
      legacyDb.exec(`
        CREATE TABLE memory_index (
          id INTEGER PRIMARY KEY,
          spec_folder TEXT NOT NULL,
          file_path TEXT NOT NULL,
          created_at TEXT NOT NULL
        );

        INSERT INTO memory_index (id, spec_folder, file_path, created_at)
        VALUES (1, 'test-spec', '/legacy/memory.md', CURRENT_TIMESTAMP);

        CREATE TABLE working_memory (
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

        INSERT INTO working_memory (session_id, memory_id, attention_score, focus_count)
        VALUES ('legacy-session', 1, 0.75, 2);
      `);

      wm.init(legacyDb);

      const columns = legacyDb.prepare('PRAGMA table_info(working_memory)').all() as Array<{ name: string }>;
      const columnNames = columns.map(column => column.name);
      expect(columnNames).toContain('event_counter');
      expect(columnNames).toContain('mention_count');

      const migratedRow = legacyDb.prepare(`
        SELECT event_counter, mention_count
        FROM working_memory
        WHERE session_id = 'legacy-session' AND memory_id = 1
      `).get() as { event_counter: number; mention_count: number };

      expect(migratedRow.event_counter).toBe(0);
      expect(migratedRow.mention_count).toBe(0);
      legacyDb.close();
    });
  });
});
