// TEST: ARCHIVAL MANAGER
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const {
  mockClearDegreeCache,
  mockClearGraphSignalsCache,
} = vi.hoisted(() => ({
  mockClearDegreeCache: vi.fn(),
  mockClearGraphSignalsCache: vi.fn(),
}));

vi.mock('../lib/search/graph-search-fn', () => ({
  clearDegreeCache: mockClearDegreeCache,
}));

vi.mock('../lib/graph/graph-signals', () => ({
  clearGraphSignalsCache: mockClearGraphSignalsCache,
}));

import * as archivalManager from '../lib/cognitive/archival-manager';
import Database from 'better-sqlite3';

/* ─────────────────────────────────────────────────────────────
   TEST SETUP
──────────────────────────────────────────────────────────────── */

type TestDatabase = Database.Database;
type TestMemoryInput = {
  spec_folder?: string;
  file_path?: string;
  title?: string;
  content_text?: string;
  importance_tier?: string;
  created_at?: string;
  last_accessed?: number;
  access_count?: number;
  confidence?: number;
  is_pinned?: number;
  stability?: number;
  half_life_days?: number | null;
};

let db: TestDatabase | null = null;

afterEach(() => {
  archivalManager.__setEmbeddingsModuleForTests(null);
  mockClearDegreeCache.mockReset();
  mockClearGraphSignalsCache.mockReset();
});

function requireDb(): TestDatabase {
  if (!db) {
    throw new Error('Test database not initialized');
  }
  return db;
}

function toMemoryId(rowId: number | bigint): number {
  return typeof rowId === 'bigint' ? Number(rowId) : rowId;
}

function setupTestDb(): TestDatabase {
  db = new Database(':memory:');

  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      title TEXT,
      content_text TEXT,
      importance_tier TEXT DEFAULT 'normal',
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now')),
      last_accessed INTEGER DEFAULT 0,
      access_count INTEGER DEFAULT 0,
      confidence REAL DEFAULT 0.5,
      is_archived INTEGER DEFAULT 0,
      archived_at TEXT,
      is_pinned INTEGER DEFAULT 0,
      embedding_status TEXT DEFAULT 'pending',
      related_memories TEXT,
      stability REAL DEFAULT 1.0,
      half_life_days REAL,
      last_review TEXT
    )
  `);

  return db;
}

function teardownTestDb() {
  if (db) {
    db.close();
    db = null;
  }
}

function insertTestMemory(data: TestMemoryInput): Database.RunResult {
  if (!db) {
    throw new Error('Test database not initialized');
  }
  const stmt = db.prepare(`
    INSERT INTO memory_index (spec_folder, file_path, title, content_text, importance_tier, created_at, last_accessed, access_count, confidence, is_pinned, stability, half_life_days)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    data.spec_folder || 'test-spec',
    data.file_path || '/test/memory.md',
    data.title || 'Test Memory',
    data.content_text || 'Test memory content',
    data.importance_tier || 'normal',
    data.created_at || new Date().toISOString(),
    data.last_accessed || 0,
    data.access_count || 0,
    data.confidence || 0.5,
    data.is_pinned || 0,
    data.stability ?? 1.0,
    data.half_life_days ?? null
  );
}

/* ─────────────────────────────────────────────────────────────
   TESTS
──────────────────────────────────────────────────────────────── */

describe('Archival Manager (T059)', () => {
  // ───────────────────────────────────────────────────────────────
  // 1. INITIALIZATION TESTS
  // ───────────────────────────────────────────────────────────────
  describe('1. Initialization', () => {
    afterEach(() => {
      teardownTestDb();
    });

    it('T059-001: Init with valid database succeeds', () => {
      setupTestDb();
      expect(() => archivalManager.init(requireDb())).not.toThrow();
    });

    it('T059-002: is_archived column exists', () => {
      setupTestDb();
      const columns = requireDb().prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>;
      expect(columns.map(column => column.name)).toContain('is_archived');
    });

    it('T059-003: ARCHIVAL_CONFIG is exported', () => {
      expect(archivalManager.ARCHIVAL_CONFIG).toBeDefined();
      expect(typeof archivalManager.ARCHIVAL_CONFIG.scanIntervalMs).toBe('number');
    });

    it('T059-004: ARCHIVAL_CONFIG has expected fields', () => {
      const config = archivalManager.ARCHIVAL_CONFIG;
      expect(config.maxAgeDays).toBe(90);
      expect(Array.isArray(config.protectedTiers)).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 2. ARCHIVAL CANDIDATE DETECTION TESTS
  // ───────────────────────────────────────────────────────────────
  describe('2. Archival Candidate Detection', () => {
    beforeEach(() => {
      setupTestDb();
      archivalManager.init(requireDb());
    });

    afterEach(() => {
      teardownTestDb();
    });

    it('T059-005: Recent memory NOT in candidates', () => {
      insertTestMemory({
        title: 'Recent Memory',
        created_at: new Date().toISOString(),
        access_count: 10,
        confidence: 0.9,
      });

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 91);

      insertTestMemory({
        title: 'Old Memory',
        created_at: oldDate.toISOString(),
        access_count: 1,
        confidence: 0.2,
        stability: 0.001,
        half_life_days: 0.05,
      });

      const candidates = archivalManager.getArchivalCandidates(100);
      const candidateTitles = candidates.map(c => c.title);

      expect(candidateTitles).not.toContain('Recent Memory');
    });

    it('T059-006: Old memory (91 days) IS in candidates', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 91);

      insertTestMemory({
        title: 'Old Memory',
        created_at: oldDate.toISOString(),
        access_count: 1,
        confidence: 0.2,
        stability: 0.001,
        half_life_days: 0.05,
      });

      const candidates = archivalManager.getArchivalCandidates(100);
      const candidateTitles = candidates.map(c => c.title);

      expect(candidateTitles).toContain('Old Memory');
    });

    it('T059-007: Constitutional memory NOT in candidates (protected tier)', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 91);

      insertTestMemory({
        title: 'Constitutional Memory',
        created_at: oldDate.toISOString(),
        access_count: 0,
        confidence: 0.1,
        importance_tier: 'constitutional',
      });

      const candidates = archivalManager.getArchivalCandidates(100);
      const candidateTitles = candidates.map(c => c.title);

      expect(candidateTitles).not.toContain('Constitutional Memory');
    });

    it('T059-008: Critical memory NOT in candidates (protected tier)', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 91);

      insertTestMemory({
        title: 'Critical Memory',
        created_at: oldDate.toISOString(),
        access_count: 0,
        confidence: 0.1,
        importance_tier: 'critical',
      });

      const candidates = archivalManager.getArchivalCandidates(100);
      const candidateTitles = candidates.map(c => c.title);

      expect(candidateTitles).not.toContain('Critical Memory');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 3. ARCHIVAL ACTION TESTS
  // ───────────────────────────────────────────────────────────────
  describe('3. Archival Actions', () => {
    beforeEach(() => {
      setupTestDb();
      archivalManager.init(requireDb());
    });

    afterEach(() => {
      teardownTestDb();
    });

    it('T059-010: archiveMemory returns true on success', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      const result = insertTestMemory({
        title: 'To Archive',
        created_at: oldDate.toISOString(),
        importance_tier: 'normal',
      });
      const memory_id = toMemoryId(result.lastInsertRowid);

      const archiveResult = archivalManager.archiveMemory(memory_id);
      expect(archiveResult).toBe(true);
    });

    it('T059-011: is_archived flag set to 1', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      const result = insertTestMemory({
        title: 'To Archive',
        created_at: oldDate.toISOString(),
        importance_tier: 'normal',
      });
      const memory_id = toMemoryId(result.lastInsertRowid);

      archivalManager.archiveMemory(memory_id);
      const row = requireDb().prepare('SELECT is_archived FROM memory_index WHERE id = ?').get(memory_id) as { is_archived: number };
      expect(row.is_archived).toBe(1);
    });

    it('T059-012: unarchiveMemory succeeds', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      const result = insertTestMemory({
        title: 'To Archive',
        created_at: oldDate.toISOString(),
        importance_tier: 'normal',
      });
      const memory_id = toMemoryId(result.lastInsertRowid);

      archivalManager.archiveMemory(memory_id);
      const unarchiveResult = archivalManager.unarchiveMemory(memory_id);
      expect(unarchiveResult).toBe(true);

      const row = requireDb().prepare('SELECT is_archived FROM memory_index WHERE id = ?').get(memory_id) as { is_archived: number };
      expect(row.is_archived).toBe(0);
    });

    it('T059-012c: archive and unarchive invalidate graph caches on success', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      const result = insertTestMemory({
        title: 'Graph Cache Target',
        created_at: oldDate.toISOString(),
        importance_tier: 'normal',
      });
      const memory_id = toMemoryId(result.lastInsertRowid);

      expect(archivalManager.archiveMemory(memory_id)).toBe(true);
      expect(archivalManager.unarchiveMemory(memory_id)).toBe(true);

      expect(mockClearDegreeCache).toHaveBeenCalledTimes(2);
      expect(mockClearGraphSignalsCache).toHaveBeenCalledTimes(2);
    });

    it('T059-013: Batch archive succeeds', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      const idsToArchive: number[] = [];
      for (let i = 0; i < 3; i++) {
        const r = insertTestMemory({
          title: `Batch Memory ${i}`,
          created_at: oldDate.toISOString(),
          importance_tier: 'normal',
        });
        idsToArchive.push(toMemoryId(r.lastInsertRowid));
      }

      const batchResult = archivalManager.archiveBatch(idsToArchive);
      expect(batchResult.archived).toBe(3);
      expect(batchResult.failed).toBe(0);
    });

    it('T059-014: archiveMemory on already-archived returns false', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      const result = insertTestMemory({
        title: 'To Archive',
        created_at: oldDate.toISOString(),
        importance_tier: 'normal',
      });
      const memory_id = toMemoryId(result.lastInsertRowid);

      archivalManager.archiveMemory(memory_id);
      const alreadyArchived = archivalManager.archiveMemory(memory_id);
      expect(alreadyArchived).toBe(false);
    });

    it('T059-011b: archiveMemory removes vec_memories row but preserves memory_index archive state', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      const result = insertTestMemory({
        title: 'Vector Cleanup Target',
        created_at: oldDate.toISOString(),
        importance_tier: 'normal',
      });
      const memory_id = toMemoryId(result.lastInsertRowid);

      requireDb().exec('CREATE TABLE IF NOT EXISTS vec_memories (embedding BLOB)');
      requireDb()
        .prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)')
        .run(BigInt(memory_id), Buffer.from('test-vector'));

      const beforeArchive = requireDb()
        .prepare('SELECT rowid FROM vec_memories WHERE rowid = ?')
        .get(BigInt(memory_id));
      expect(beforeArchive).toBeDefined();

      const archiveResult = archivalManager.archiveMemory(memory_id);
      expect(archiveResult).toBe(true);

      const archivedRow = requireDb()
        .prepare('SELECT is_archived FROM memory_index WHERE id = ?')
        .get(memory_id) as { is_archived: number } | undefined;
      expect(archivedRow).toBeDefined();
      expect(archivedRow?.is_archived).toBe(1);

      const vectorRow = requireDb()
        .prepare('SELECT rowid FROM vec_memories WHERE rowid = ?')
        .get(BigInt(memory_id));
      expect(vectorRow).toBeUndefined();
    });

    it('T059-012b: unarchiveMemory defers vector re-embedding to next index scan', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      const result = insertTestMemory({
        title: 'Vector Rebuild Target',
        content_text: 'Rebuild vector content on unarchive',
        created_at: oldDate.toISOString(),
        importance_tier: 'normal',
      });
      const memory_id = toMemoryId(result.lastInsertRowid);

      requireDb().exec('CREATE TABLE IF NOT EXISTS vec_memories (embedding BLOB)');
      requireDb()
        .prepare('INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)')
        .run(BigInt(memory_id), Buffer.from('initial-vector'));

      let embeddingCalls = 0;
      archivalManager.__setEmbeddingsModuleForTests({
        generateDocumentEmbedding: async () => {
          embeddingCalls += 1;
          return new Float32Array([0.11, 0.22, 0.33]);
        },
      });

      expect(archivalManager.archiveMemory(memory_id)).toBe(true);

      const archivedVector = requireDb()
        .prepare('SELECT rowid FROM vec_memories WHERE rowid = ?')
        .get(BigInt(memory_id));
      expect(archivedVector).toBeUndefined();

      // Capture deferred-rebuild log emitted by syncVectorOnUnarchive
      const logSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      try {
        expect(archivalManager.unarchiveMemory(memory_id)).toBe(true);

        // Vector should NOT be rebuilt immediately — deferred to next index scan
        const vectorAfterUnarchive = requireDb()
          .prepare('SELECT rowid FROM vec_memories WHERE rowid = ?')
          .get(BigInt(memory_id));
        expect(vectorAfterUnarchive).toBeUndefined();

        // No embedding generation should have been called
        expect(embeddingCalls).toBe(0);

        // Deferred-rebuild log should have been emitted
        const hasDeferredLog = logSpy.mock.calls.some(([message]) => {
          const text = String(message ?? '');
          return text.includes('Deferred vector re-embedding') && text.includes(String(memory_id));
        });
        expect(hasDeferredLog).toBe(true);
      } finally {
        logSpy.mockRestore();
      }
    });

    it('T059-011c: archiveMemory suppresses vec_memories no-such-table cleanup errors', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      const result = insertTestMemory({
        title: 'No Vector Table Memory',
        created_at: oldDate.toISOString(),
        importance_tier: 'normal',
      });
      const memory_id = toMemoryId(result.lastInsertRowid);

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        const archiveResult = archivalManager.archiveMemory(memory_id);
        expect(archiveResult).toBe(true);

        const hasVectorWarning = warnSpy.mock.calls.some(([message]) => {
          const text = String(message ?? '');
          return text.includes('Vector archive sync failed')
            || text.includes('vec_memories')
            || text.includes('no such table');
        });
        expect(hasVectorWarning).toBe(false);
      } finally {
        warnSpy.mockRestore();
      }
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4. ARCHIVAL SCAN TESTS
  // ───────────────────────────────────────────────────────────────
  describe('4. Archival Scan', () => {
    beforeEach(() => {
      setupTestDb();
      archivalManager.init(requireDb());
      archivalManager.resetStats();
    });

    afterEach(() => {
      teardownTestDb();
    });

    it('T059-015: Archival scan archives candidates', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 91);

      insertTestMemory({
        title: 'Recent 1',
        created_at: new Date().toISOString(),
        access_count: 10,
        confidence: 0.9,
      });
      insertTestMemory({
        title: 'Recent 2',
        created_at: new Date().toISOString(),
        access_count: 10,
        confidence: 0.9,
      });
      insertTestMemory({
        title: 'Old 1',
        created_at: oldDate.toISOString(),
        access_count: 1,
        confidence: 0.2,
        stability: 0.001,
        half_life_days: 0.05,
      });
      insertTestMemory({
        title: 'Old 2',
        created_at: oldDate.toISOString(),
        access_count: 0,
        confidence: 0.1,
        stability: 0.001,
        half_life_days: 0.05,
      });

      const scanResult = archivalManager.runArchivalScan();
      expect(scanResult.archived).toBeGreaterThanOrEqual(1);
    });

    it('T059-016: Scan reports scanned count', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 91);

      insertTestMemory({
        title: 'Old 1',
        created_at: oldDate.toISOString(),
        access_count: 1,
        confidence: 0.2,
        stability: 0.001,
        half_life_days: 0.05,
      });

      const scanResult = archivalManager.runArchivalScan();
      expect(scanResult.scanned).toBeGreaterThanOrEqual(1);
    });

    it('T059-017: Second scan finds fewer candidates', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 91);

      insertTestMemory({
        title: 'Old 1',
        created_at: oldDate.toISOString(),
        access_count: 1,
        confidence: 0.2,
        stability: 0.001,
        half_life_days: 0.05,
      });

      const scanResult = archivalManager.runArchivalScan();
      const scan2Result = archivalManager.runArchivalScan();
      expect(scan2Result.archived).toBeLessThanOrEqual(scanResult.archived);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5. BACKGROUND JOB TESTS
  // ───────────────────────────────────────────────────────────────
  describe('5. Background Job', () => {
    beforeEach(() => {
      setupTestDb();
      archivalManager.init(requireDb());
    });

    afterEach(() => {
      archivalManager.stopBackgroundJob();
      teardownTestDb();
    });

    it('T059-018: Background job starts without error', () => {
      expect(() => archivalManager.startBackgroundJob(60000)).not.toThrow();
    });

    it('T059-019: isBackgroundJobRunning returns true', () => {
      archivalManager.startBackgroundJob(60000);
      expect(archivalManager.isBackgroundJobRunning()).toBe(true);
    });

    it('T059-020: Background job stops without error', () => {
      archivalManager.startBackgroundJob(60000);
      expect(() => archivalManager.stopBackgroundJob()).not.toThrow();
    });

    it('T059-021: Job not running after stop', () => {
      archivalManager.startBackgroundJob(60000);
      archivalManager.stopBackgroundJob();
      expect(archivalManager.isBackgroundJobRunning()).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 6. STATISTICS TESTS
  // ───────────────────────────────────────────────────────────────
  describe('6. Statistics', () => {
    beforeEach(() => {
      setupTestDb();
      archivalManager.init(requireDb());
      archivalManager.resetStats();
    });

    afterEach(() => {
      teardownTestDb();
    });

    it('T059-022: Stats include totalScanned', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      for (let i = 0; i < 5; i++) {
        insertTestMemory({
          title: `Stats Test ${i}`,
          created_at: oldDate.toISOString(),
          access_count: 0,
          confidence: 0.1,
          importance_tier: 'normal',
          stability: 0.001,
          half_life_days: 0.05,
        });
      }

      archivalManager.runArchivalScan();
      const stats = archivalManager.getStats();
      expect(stats.totalScanned).toBeGreaterThanOrEqual(1);
    });

    it('T059-023: Stats include totalArchived', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      for (let i = 0; i < 5; i++) {
        insertTestMemory({
          title: `Stats Test ${i}`,
          created_at: oldDate.toISOString(),
          access_count: 0,
          confidence: 0.1,
          importance_tier: 'normal',
          stability: 0.001,
          half_life_days: 0.05,
        });
      }

      archivalManager.runArchivalScan();
      const stats = archivalManager.getStats();
      expect(stats.totalArchived).toBeGreaterThanOrEqual(1);
    });

    it('T059-024: Stats include lastScanTime', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);

      insertTestMemory({
        title: 'Stats Test',
        created_at: oldDate.toISOString(),
        access_count: 0,
        confidence: 0.1,
        stability: 0.001,
        half_life_days: 0.05,
      });

      archivalManager.runArchivalScan();
      const stats = archivalManager.getStats();
      expect(stats.lastScanTime).toBeTruthy();
    });

    it('T059-025: Stats include errors array', () => {
      archivalManager.runArchivalScan();
      const stats = archivalManager.getStats();
      expect(Array.isArray(stats.errors)).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 7. CHECK MEMORY STATUS TESTS
  // ───────────────────────────────────────────────────────────────
  describe('7. Check Memory Status', () => {
    beforeEach(() => {
      setupTestDb();
      archivalManager.init(requireDb());
    });

    afterEach(() => {
      teardownTestDb();
    });

    it('T059-026: checkMemoryArchivalStatus returns correct shape', () => {
      const result = insertTestMemory({
        title: 'Recent Status',
        created_at: new Date().toISOString(),
        importance_tier: 'normal',
      });
      const recentId = toMemoryId(result.lastInsertRowid);

      const recentStatus = archivalManager.checkMemoryArchivalStatus(recentId);
      expect(typeof recentStatus.isArchived).toBe('boolean');
      expect(typeof recentStatus.shouldArchive).toBe('boolean');
    });

    it('T059-027: Recent memory isArchived=false', () => {
      const result = insertTestMemory({
        title: 'Recent Status',
        created_at: new Date().toISOString(),
        importance_tier: 'normal',
      });
      const recentId = toMemoryId(result.lastInsertRowid);

      const recentStatus = archivalManager.checkMemoryArchivalStatus(recentId);
      expect(recentStatus.isArchived).toBe(false);
    });

    it('T059-028: Non-existent memory returns defaults', () => {
      const missingStatus = archivalManager.checkMemoryArchivalStatus(99999);
      expect(missingStatus.isArchived).toBe(false);
      expect(missingStatus.shouldArchive).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 8. CLEANUP AND MODULE STATE TESTS
  // ───────────────────────────────────────────────────────────────
  describe('8. Cleanup and Module State', () => {
    afterEach(() => {
      teardownTestDb();
    });

    it('T059-029: cleanup stops background job', () => {
      setupTestDb();
      archivalManager.init(requireDb());
      archivalManager.startBackgroundJob(60000);
      archivalManager.cleanup();
      expect(archivalManager.isBackgroundJobRunning()).toBe(false);
    });

    it('T059-030: resetStats clears all stats', () => {
      setupTestDb();
      archivalManager.init(requireDb());
      archivalManager.resetStats();
      const stats = archivalManager.getStats();
      expect(stats.totalScanned).toBe(0);
      expect(stats.totalArchived).toBe(0);
      expect(stats.lastScanTime).toBeNull();
    });

    it('T059-031: getArchivalCandidates returns [] without db', () => {
      setupTestDb();
      archivalManager.init(requireDb());
      archivalManager.cleanup();
      const candidates = archivalManager.getArchivalCandidates();
      expect(Array.isArray(candidates)).toBe(true);
      expect(candidates.length).toBe(0);
    });

    it('T059-032: archiveMemory returns false without db', () => {
      setupTestDb();
      archivalManager.init(requireDb());
      archivalManager.cleanup();
      const result = archivalManager.archiveMemory(1);
      expect(result).toBe(false);
    });
  });
});
