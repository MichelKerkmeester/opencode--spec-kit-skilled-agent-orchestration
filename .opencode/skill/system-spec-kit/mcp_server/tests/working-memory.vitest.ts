// TEST: WORKING MEMORY — vitest
// Aligned with production working-memory.ts named exports
import { describe, it, expect } from 'vitest';
import * as workingMemory from '../lib/cognitive/working-memory';
import * as checkpoints from '../lib/storage/checkpoints';
import BetterSqlite3 from 'better-sqlite3';

const workingMemoryModule = workingMemory as unknown as Record<string, unknown>;
type WorkingMemoryDb = Parameters<typeof workingMemory.init>[0];

describe('Working Memory Module', () => {

  /* ───────────────────────────────────────────────────────────────
     WORKING_MEMORY_CONFIG
  ──────────────────────────────────────────────────────────────── */

  describe('WORKING_MEMORY_CONFIG', () => {
    it('WORKING_MEMORY_CONFIG is exported', () => {
      expect(workingMemory.WORKING_MEMORY_CONFIG).toBeTruthy();
    });

    it('enabled is boolean', () => {
      expect(typeof workingMemory.WORKING_MEMORY_CONFIG.enabled).toBe('boolean');
    });

    // MaxCapacity (Miller's Law: 7)
    it('maxCapacity is valid', () => {
      expect(typeof workingMemory.WORKING_MEMORY_CONFIG.maxCapacity).toBe('number');
      expect(workingMemory.WORKING_MEMORY_CONFIG.maxCapacity).toBeGreaterThan(0);
    });

    it('sessionTimeoutMs is valid', () => {
      expect(typeof workingMemory.WORKING_MEMORY_CONFIG.sessionTimeoutMs).toBe('number');
      expect(workingMemory.WORKING_MEMORY_CONFIG.sessionTimeoutMs).toBeGreaterThan(0);
    });

  });

  /* ───────────────────────────────────────────────────────────────
     Utility Functions: isEnabled() and getConfig()
  ──────────────────────────────────────────────────────────────── */

  describe('Utility Functions', () => {
    it('isEnabled() returns boolean', () => {
      expect(typeof workingMemory.isEnabled()).toBe('boolean');
    });

    it('getConfig() returns object', () => {
      const config = workingMemory.getConfig();
      expect(typeof config).toBe('object');
      expect(config).not.toBeNull();
    });

    it('getConfig() returns copy (not reference)', () => {
      const config1 = workingMemory.getConfig();
      const config2 = workingMemory.getConfig();
      expect(config1).not.toBe(config2);
    });

    it('getConfig() has all expected keys', () => {
      const config = workingMemory.getConfig();
      const configRecord = config as unknown as Record<string, unknown>;
      const expectedKeys = ['enabled', 'maxCapacity', 'sessionTimeoutMs'];
      for (const key of expectedKeys) {
        expect(configRecord[key]).toBeDefined();
      }
    });
  });

  /* ───────────────────────────────────────────────────────────────
     calculateTier()
     Production: >= 0.8 = 'focused', >= 0.5 = 'active', >= 0.2 = 'peripheral', else 'fading'
  ──────────────────────────────────────────────────────────────── */

  describe('calculateTier()', () => {
    it('Score 1.0 = focused', () => {
      expect(workingMemory.calculateTier(1.0)).toBe('focused');
    });

    it('Score 0.9 = focused', () => {
      expect(workingMemory.calculateTier(0.9)).toBe('focused');
    });

    it('Score 0.8 = focused (threshold)', () => {
      expect(workingMemory.calculateTier(0.8)).toBe('focused');
    });

    it('Score 0.79 = active', () => {
      expect(workingMemory.calculateTier(0.79)).toBe('active');
    });

    it('Score 0.5 = active (threshold)', () => {
      expect(workingMemory.calculateTier(0.5)).toBe('active');
    });

    it('Score 0.49 = peripheral', () => {
      expect(workingMemory.calculateTier(0.49)).toBe('peripheral');
    });

    it('Score 0.2 = peripheral (threshold)', () => {
      expect(workingMemory.calculateTier(0.2)).toBe('peripheral');
    });

    it('Score 0.19 = fading', () => {
      expect(workingMemory.calculateTier(0.19)).toBe('fading');
    });

    it('Score 0.0 = fading', () => {
      expect(workingMemory.calculateTier(0.0)).toBe('fading');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     init()
     Production init(database) just sets db = database and calls ensureSchema()
     It does NOT throw on null - it silently sets db to null and ensureSchema returns early
  ──────────────────────────────────────────────────────────────── */

  describe('init()', () => {
    it('init(null) does not throw', () => {
      // Production silently accepts null (db becomes null, ensureSchema skips)
      expect(() => {
        workingMemory.init(null as unknown as WorkingMemoryDb);
      }).not.toThrow();
    });

    it('migrates legacy working_memory foreign keys to ON DELETE SET NULL', () => {
      const database = new BetterSqlite3(':memory:');
      database.pragma('foreign_keys = ON');

      try {
        database.exec(`
          CREATE TABLE memory_index (
            id INTEGER PRIMARY KEY,
            spec_folder TEXT NOT NULL,
            file_path TEXT NOT NULL,
            title TEXT NOT NULL
          );

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
        `);

        workingMemory.init(database);

        const fkRow = database.prepare(`
          PRAGMA foreign_key_list(working_memory)
        `).get() as { on_delete: string };
        const memoryIdColumn = database.prepare(`
          PRAGMA table_info(working_memory)
        `).all() as Array<{ name: string; notnull: number }>;
        const memoryIdInfo = memoryIdColumn.find((column) => column.name === 'memory_id');

        expect(fkRow.on_delete).toBe('SET NULL');
        expect(memoryIdInfo?.notnull).toBe(0);
      } finally {
        workingMemory.init(null as unknown as WorkingMemoryDb);
        database.close();
      }
    });

    it('preserves working_memory rows as detached entries when a memory is deleted', () => {
      const database = new BetterSqlite3(':memory:');
      database.pragma('foreign_keys = ON');

      try {
        database.exec(`
          CREATE TABLE memory_index (
            id INTEGER PRIMARY KEY,
            spec_folder TEXT NOT NULL,
            file_path TEXT NOT NULL,
            title TEXT NOT NULL
          );

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
        `);

        database.prepare(`
          INSERT INTO memory_index (id, spec_folder, file_path, title)
          VALUES (?, ?, ?, ?)
        `).run(101, 'specs/test', '/tmp/101.md', 'Memory 101');

        database.prepare(`
          INSERT INTO working_memory (session_id, memory_id, attention_score)
          VALUES (?, ?, ?)
        `).run('session-alpha', 101, 0.85);

        workingMemory.init(database);
        database.prepare('DELETE FROM memory_index WHERE id = ?').run(101);

        const detachedRow = database.prepare(`
          SELECT memory_id, attention_score
          FROM working_memory
          WHERE session_id = ?
        `).get('session-alpha') as { memory_id: number | null; attention_score: number } | undefined;

        expect(detachedRow).toBeDefined();
        expect(detachedRow?.memory_id).toBeNull();
        expect(detachedRow?.attention_score).toBeCloseTo(0.85, 5);
      } finally {
        workingMemory.init(null as unknown as WorkingMemoryDb);
        database.close();
      }
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Session Functions (no DB)
  ──────────────────────────────────────────────────────────────── */

  describe('Session Functions (no DB)', () => {
    it('getOrCreateSession(null) generates session ID', () => {
      const session = workingMemory.getOrCreateSession(null);
      expect(typeof session).toBe('string');
      expect(session.startsWith('wm-')).toBe(true);
    });

    it('getOrCreateSession("my-session") returns same ID', () => {
      expect(workingMemory.getOrCreateSession('my-session')).toBe('my-session');
    });

    it('clearSession returns 0 without DB', () => {
      expect(workingMemory.clearSession('test-session')).toBe(0);
    });

    it('getWorkingMemory returns [] without DB', () => {
      const wm = workingMemory.getWorkingMemory('test-session');
      expect(Array.isArray(wm)).toBe(true);
      expect(wm).toHaveLength(0);
    });

    it('getSessionMemories returns [] without DB', () => {
      const sm = workingMemory.getSessionMemories('test-session');
      expect(Array.isArray(sm)).toBe(true);
      expect(sm).toHaveLength(0);
    });

    it('setAttentionScore returns false without DB', () => {
      expect(workingMemory.setAttentionScore('test', 1, 0.5)).toBe(false);
    });

    it('getSessionStats returns null without DB', () => {
      expect(workingMemory.getSessionStats('test')).toBeNull();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Module Exports
  ──────────────────────────────────────────────────────────────── */

  describe('Module Exports', () => {
    const expectedExports = [
      'WORKING_MEMORY_CONFIG',
      'SCHEMA_SQL',
      'INDEX_SQL',
      'init',
      'ensureSchema',
      'getOrCreateSession',
      'clearSession',
      'cleanupOldSessions',
      'getWorkingMemory',
      'getSessionMemories',
      'calculateTier',
      'setAttentionScore',
      'enforceMemoryLimit',
      'batchUpdateScores',
      'isEnabled',
      'getConfig',
      'getSessionStats',
    ];

    for (const name of expectedExports) {
      it(`Export: ${name}`, () => {
        expect(workingMemoryModule[name]).toBeDefined();
      });
    }
  });

  /* ───────────────────────────────────────────────────────────────
     calculateTier() Edge Cases
  ──────────────────────────────────────────────────────────────── */

  describe('calculateTier() Edge Cases', () => {
    it('focused/active boundary at 0.8', () => {
      expect(workingMemory.calculateTier(0.80)).toBe('focused');
      expect(workingMemory.calculateTier(0.7999)).toBe('active');
    });

    it('active/peripheral boundary at 0.5', () => {
      expect(workingMemory.calculateTier(0.50)).toBe('active');
      expect(workingMemory.calculateTier(0.4999)).toBe('peripheral');
    });

    it('peripheral/fading boundary at 0.2', () => {
      expect(workingMemory.calculateTier(0.20)).toBe('peripheral');
      expect(workingMemory.calculateTier(0.1999)).toBe('fading');
    });

    it('Tiny value = fading', () => {
      expect(workingMemory.calculateTier(0.0000001)).toBe('fading');
    });

    it('0.9999999 = focused', () => {
      expect(workingMemory.calculateTier(0.9999999)).toBe('focused');
    });
  });
});

describe('Tool-result extraction provenance', () => {
  type TestDatabase = InstanceType<typeof BetterSqlite3>;
  type ExtractedRow = {
    session_id: string;
    memory_id: number;
    source_tool: string | null;
    source_call_id: string | null;
    extraction_rule_id: string | null;
    redaction_applied: number;
    focus_count: number;
  };

  function createTestDb(): TestDatabase {
    const database = new BetterSqlite3(':memory:');
    database.exec(`
      CREATE TABLE IF NOT EXISTS memory_index (
        id INTEGER PRIMARY KEY,
        spec_folder TEXT NOT NULL,
        file_path TEXT NOT NULL,
        title TEXT NOT NULL,
        importance_weight REAL DEFAULT 0.5,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        importance_tier TEXT DEFAULT 'normal'
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
    `);
    return database;
  }

  function seedMemory(database: TestDatabase, memoryId: number): void {
    const now = new Date().toISOString();
    database.prepare(`
      INSERT INTO memory_index (
        id, spec_folder, file_path, title, importance_weight, created_at, updated_at, importance_tier
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      memoryId,
      'specs/test-working-memory',
      `/tmp/memory-${memoryId}.md`,
      `Memory ${memoryId}`,
      0.5,
      now,
      now,
      'normal'
    );
  }

  function getExtractedRow(database: TestDatabase, sessionId: string, memoryId: number): ExtractedRow | undefined {
    return database.prepare(`
      SELECT
        session_id,
        memory_id,
        source_tool,
        source_call_id,
        extraction_rule_id,
        redaction_applied,
        focus_count
      FROM working_memory
      WHERE session_id = ? AND memory_id = ?
    `).get(sessionId, memoryId) as ExtractedRow | undefined;
  }

  it('init creates order-aligned working_memory indexes', () => {
    const database = createTestDb();
    try {
      workingMemory.init(database);
      const indexNames = (database.prepare(`PRAGMA index_list(working_memory)`).all() as Array<{ name: string }>)
        .map((row) => row.name);

      expect(indexNames).toEqual(expect.arrayContaining([
        'idx_wm_session_focus_lru',
        'idx_wm_session_attention_focus',
      ]));
    } finally {
      database.close();
    }
  });

  it('upsertExtractedEntry stores provenance fields', () => {
    const database = createTestDb();
    try {
      workingMemory.init(database);

      const sessionId = 'wm-provenance-session';
      const memoryId = 1001;
      seedMemory(database, memoryId);

      const ok = workingMemory.upsertExtractedEntry({
        sessionId,
        memoryId,
        attentionScore: 0.62,
        sourceTool: 'context_search',
        sourceCallId: 'call-001',
        extractionRuleId: 'rule-provenance',
        redactionApplied: true,
      });

      expect(ok).toBe(true);

      const row = getExtractedRow(database, sessionId, memoryId);
      expect(row).toBeDefined();
      expect(row?.source_tool).toBe('context_search');
      expect(row?.source_call_id).toBe('call-001');
      expect(row?.extraction_rule_id).toBe('rule-provenance');
      expect(row?.redaction_applied).toBe(1);
    } finally {
      database.close();
    }
  });

  it('upsertExtractedEntry avoids legacy COUNT existence probes and relies on conflict handling', () => {
    const database = createTestDb();
    try {
      workingMemory.init(database);

      const sessionId = 'wm-no-count-probe';
      const memoryId = 1004;
      seedMemory(database, memoryId);

      const originalPrepare = database.prepare.bind(database);
      (database as TestDatabase & { prepare: typeof database.prepare }).prepare = ((sql: string) => {
        if (sql.includes('SELECT COUNT(*) as cnt FROM working_memory WHERE session_id = ? AND memory_id = ?')) {
          throw new Error('legacy existence probe should not execute');
        }
        return originalPrepare(sql);
      }) as typeof database.prepare;

      const first = workingMemory.upsertExtractedEntry({
        sessionId,
        memoryId,
        attentionScore: 0.25,
        sourceTool: 'first_tool',
        sourceCallId: 'call-first',
        extractionRuleId: 'rule-first',
        redactionApplied: false,
      });
      const second = workingMemory.upsertExtractedEntry({
        sessionId,
        memoryId,
        attentionScore: 0.95,
        sourceTool: 'second_tool',
        sourceCallId: 'call-second',
        extractionRuleId: 'rule-second',
        redactionApplied: true,
      });

      expect(first).toBe(true);
      expect(second).toBe(true);

      const countRow = database.prepare(`
        SELECT COUNT(*) as cnt
        FROM working_memory
        WHERE session_id = ? AND memory_id = ?
      `).get(sessionId, memoryId) as { cnt: number };
      expect(countRow.cnt).toBe(1);
    } finally {
      database.close();
    }
  });

  it('upsertExtractedEntry conflict-update overwrites on same key', () => {
    const database = createTestDb();
    try {
      workingMemory.init(database);

      const sessionId = 'wm-provenance-update';
      const memoryId = 1002;
      seedMemory(database, memoryId);

      const first = workingMemory.upsertExtractedEntry({
        sessionId,
        memoryId,
        attentionScore: 0.25,
        sourceTool: 'first_tool',
        sourceCallId: 'call-first',
        extractionRuleId: 'rule-first',
        redactionApplied: false,
      });
      expect(first).toBe(true);

      const second = workingMemory.upsertExtractedEntry({
        sessionId,
        memoryId,
        attentionScore: 0.9,
        sourceTool: 'second_tool',
        sourceCallId: 'call-second',
        extractionRuleId: 'rule-second',
        redactionApplied: true,
      });
      expect(second).toBe(true);

      const countRow = database.prepare(`
        SELECT COUNT(*) as cnt
        FROM working_memory
        WHERE session_id = ? AND memory_id = ?
      `).get(sessionId, memoryId) as { cnt: number };
      expect(countRow.cnt).toBe(1);

      const row = getExtractedRow(database, sessionId, memoryId);
      expect(row).toBeDefined();
      expect(row?.source_tool).toBe('second_tool');
      expect(row?.source_call_id).toBe('call-second');
      expect(row?.extraction_rule_id).toBe('rule-second');
      expect(row?.redaction_applied).toBe(1);
      expect(row?.focus_count).toBe(2);
    } finally {
      database.close();
    }
  });

  it('extracted entries survive checkpoint save/restore with provenance', () => {
    const database = createTestDb();
    try {
      workingMemory.init(database);
      checkpoints.init(database);

      const sessionId = 'wm-provenance-checkpoint';
      const memoryId = 1003;
      seedMemory(database, memoryId);

      const inserted = workingMemory.upsertExtractedEntry({
        sessionId,
        memoryId,
        attentionScore: 0.7,
        sourceTool: 'checkpoint_tool',
        sourceCallId: 'call-checkpoint',
        extractionRuleId: 'rule-checkpoint',
        redactionApplied: true,
      });
      expect(inserted).toBe(true);

      const checkpointName = `wm-provenance-${Date.now()}`;
      const checkpoint = checkpoints.createCheckpoint({ name: checkpointName });
      expect(checkpoint).not.toBeNull();

      const removed = workingMemory.clearSession(sessionId);
      expect(removed).toBe(1);

      const restore = checkpoints.restoreCheckpoint(checkpointName, true);
      expect(restore.errors.length).toBe(0);
      expect(restore.workingMemoryRestored).toBe(1);

      const restoredRow = getExtractedRow(database, sessionId, memoryId);
      expect(restoredRow).toBeDefined();
      expect(restoredRow?.source_tool).toBe('checkpoint_tool');
      expect(restoredRow?.source_call_id).toBe('call-checkpoint');
      expect(restoredRow?.extraction_rule_id).toBe('rule-checkpoint');
      expect(restoredRow?.redaction_applied).toBe(1);
    } finally {
      database.close();
    }
  });
});
