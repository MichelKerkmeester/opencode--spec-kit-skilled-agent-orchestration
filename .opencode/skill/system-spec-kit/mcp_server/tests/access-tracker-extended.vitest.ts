// TEST: ACCESS TRACKER EXTENDED
import { describe, it, expect, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import * as mod from '../lib/storage/access-tracker';
import * as compositeScoring from '../lib/scoring/composite-scoring';
import * as folderScoring from '../lib/scoring/folder-scoring';

/* ─────────────────────────────────────────────────────────────
   TESTS: ACCESS TRACKER — Extended Coverage
   Covers functions NOT (or only indirectly) tested in access-tracker.test.ts:
     flushAccessCounts   — direct call, no-DB, valid, non-existent ID, DB error
     initExitHandlers    — listener registration, idempotency guard
     cleanupExitHandlers — flag reset enables re-registration
     MAX_ACCUMULATOR_SIZE — overflow triggers auto-flush and clear
     reset               — flushes pending accumulators before clearing
──────────────────────────────────────────────────────────────── */

type TestDatabase = Database.Database;
type AccessRow = {
  access_count: number;
  last_accessed: string | null;
};

let testDb: TestDatabase | null = null;

function requireTestDb(): TestDatabase {
  if (!testDb) {
    throw new Error('Test database not initialized');
  }
  return testDb;
}

/** Create an in-memory DB with the memory_index table and N seed rows. */
function createDb(rowCount = 10): TestDatabase {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      access_count INTEGER DEFAULT 0,
      last_accessed TEXT DEFAULT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  const ins = db.prepare('INSERT INTO memory_index (id, title) VALUES (?, ?)');
  for (let i = 1; i <= rowCount; i++) {
    ins.run(i, `Memory ${i}`);
  }
  return db;
}

function teardown() {
  try { mod.reset(); } catch (_: unknown) { /* ignore */ }
  try { if (testDb) { testDb.close(); testDb = null; } } catch (_: unknown) { /* ignore */ }
}

/* ─────────────────────────────────────────────────────────────
   1. flushAccessCounts — DIRECT TESTS
──────────────────────────────────────────────────────────────── */

describe('Access Tracker Extended', () => {
  afterEach(() => {
    teardown();
  });

  describe('flushAccessCounts — direct calls', () => {
    it('flushAccessCounts with closed DB returns false', () => {
      teardown();
      const tempDb = createDb(1);
      mod.init(tempDb);
      mod.reset();
      tempDb.close();
      // Now the internal db handle is closed/broken
      const result = mod.flushAccessCounts(1);
      expect(result).toBe(false);
    });

    it('flushAccessCounts with valid ID updates DB', () => {
      testDb = createDb(5);
      mod.init(testDb);

      const result = mod.flushAccessCounts(1);
      const row = requireTestDb().prepare('SELECT access_count, last_accessed FROM memory_index WHERE id = 1').get() as AccessRow;
      expect(result).toBe(true);
      expect(row.access_count).toBe(1);
      expect(row.last_accessed).not.toBeNull();
    });

    it('flushAccessCounts increments access_count cumulatively', () => {
      testDb = createDb(5);
      mod.init(testDb);

      mod.flushAccessCounts(1);
      mod.flushAccessCounts(1);
      mod.flushAccessCounts(1);
      const row = requireTestDb().prepare('SELECT access_count FROM memory_index WHERE id = 1').get() as Pick<AccessRow, 'access_count'>;
      expect(row.access_count).toBe(3);
    });

    it('flushAccessCounts with non-existent ID returns false', () => {
      testDb = createDb(5);
      mod.init(testDb);

      const result = mod.flushAccessCounts(99999);
      expect(result).toBe(false);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     2. initExitHandlers — REGISTRATION & IDEMPOTENCY
  ──────────────────────────────────────────────────────────────── */

  describe('initExitHandlers — registration & idempotency', () => {
    it('initExitHandlers registers beforeExit, SIGTERM, SIGINT listeners', () => {
      mod.cleanupExitHandlers();
      testDb = createDb(1);

      const baseBeforeExit = process.listenerCount('beforeExit');
      const baseSIGTERM = process.listenerCount('SIGTERM');
      const baseSIGINT = process.listenerCount('SIGINT');

      mod.init(testDb); // init calls initExitHandlers internally

      expect(process.listenerCount('beforeExit')).toBeGreaterThan(baseBeforeExit);
      expect(process.listenerCount('SIGTERM')).toBeGreaterThan(baseSIGTERM);
      expect(process.listenerCount('SIGINT')).toBeGreaterThan(baseSIGINT);
    });

    it('initExitHandlers is idempotent (no duplicate listeners)', () => {
      mod.cleanupExitHandlers();
      testDb = createDb(1);
      mod.init(testDb);

      const beforeSecond = process.listenerCount('beforeExit');
      mod.initExitHandlers(); // should be no-op since flag is already true
      const afterSecond = process.listenerCount('beforeExit');

      expect(afterSecond).toBe(beforeSecond);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     3. cleanupExitHandlers — FLAG RESET
  ──────────────────────────────────────────────────────────────── */

  describe('cleanupExitHandlers — flag reset', () => {
    it('cleanupExitHandlers allows re-registration of exit handlers', () => {
      mod.cleanupExitHandlers();
      testDb = createDb(1);

      const before = process.listenerCount('beforeExit');
      mod.init(testDb);
      const after = process.listenerCount('beforeExit');

      expect(after).toBeGreaterThan(before);
    });

    it('cleanupExitHandlers is safe to call multiple times', () => {
      expect(() => {
        mod.cleanupExitHandlers();
        mod.cleanupExitHandlers();
        mod.cleanupExitHandlers();
      }).not.toThrow();
    });
  });

  /* ─────────────────────────────────────────────────────────────
     4. MAX_ACCUMULATOR_SIZE — OVERFLOW BEHAVIOR
  ──────────────────────────────────────────────────────────────── */

  describe('MAX_ACCUMULATOR_SIZE — overflow behavior', () => {
    it('MAX_ACCUMULATOR_SIZE is exported as number', () => {
      expect(typeof mod.MAX_ACCUMULATOR_SIZE).toBe('number');
    });

    it('MAX_ACCUMULATOR_SIZE overflow triggers flush-all and clear', () => {
      const MAX = mod.MAX_ACCUMULATOR_SIZE;
      testDb = createDb(5);
      mod.init(testDb);
      mod.reset();
      mod.init(testDb);

      // Fill accumulator to exactly MAX + 1 entries
      for (let i = 1; i <= MAX + 1; i++) {
        mod.trackAccess(i);
      }

      // The next trackAccess should trigger the overflow guard
      const overflowId = MAX + 2;
      const result = mod.trackAccess(overflowId);

      const state = mod.getAccumulatorState(overflowId);
      expect(result).toBe(true);
      expect(state.accumulated).toBeGreaterThan(0);
    });

    it('After overflow, old accumulator entries are cleared', () => {
      const MAX = mod.MAX_ACCUMULATOR_SIZE;
      testDb = createDb(5);
      mod.init(testDb);
      mod.reset();
      mod.init(testDb);

      for (let i = 1; i <= MAX + 1; i++) {
        mod.trackAccess(i);
      }
      mod.trackAccess(MAX + 2);

      // Entry #1 was in the accumulator before overflow; should be cleared now
      const oldState = mod.getAccumulatorState(1);
      expect(oldState.accumulated).toBe(0);
    });

    it('MAX_ACCUMULATOR_SIZE is 10000', () => {
      expect(mod.MAX_ACCUMULATOR_SIZE).toBe(10000);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     5. reset — FLUSH-BEFORE-CLEAR BEHAVIOR
  ──────────────────────────────────────────────────────────────── */

  describe('reset — flush-before-clear behavior', () => {
    it('reset() flushes pending accumulators to DB before clearing', () => {
      testDb = createDb(5);
      mod.init(testDb);

      // Accumulate 4 accesses for ID 2 (below threshold, stays in accumulator)
      for (let i = 0; i < 4; i++) {
        mod.trackAccess(2);
      }

      const before = mod.getAccumulatorState(2);
      expect(before.accumulated).toBeGreaterThan(0);

      mod.reset();
      mod.init(testDb);

      const row = requireTestDb().prepare('SELECT access_count FROM memory_index WHERE id = 2').get() as Pick<AccessRow, 'access_count'>;
      expect(row.access_count).toBeGreaterThanOrEqual(1);
    });

    it('After reset(), accumulator is empty', () => {
      testDb = createDb(5);
      mod.init(testDb);

      for (let i = 0; i < 4; i++) {
        mod.trackAccess(2);
      }
      mod.reset();
      mod.init(testDb);

      const state = mod.getAccumulatorState(2);
      expect(state.accumulated).toBe(0);
    });

    it('reset() with empty accumulator does not throw', () => {
      testDb = createDb(5);
      mod.init(testDb);

      expect(() => mod.reset()).not.toThrow();
    });

    it('init() clears pending accumulator state when rebinding to a different database', () => {
      const firstDb = createDb(5);
      const secondDb = createDb(5);

      mod.init(firstDb);
      for (let i = 0; i < 4; i++) {
        mod.trackAccess(2);
      }

      expect(mod.getAccumulatorState(2).accumulated).toBeGreaterThan(0);

      mod.init(secondDb);

      const firstDbRow = firstDb.prepare('SELECT access_count FROM memory_index WHERE id = 2').get() as Pick<AccessRow, 'access_count'>;
      const secondDbRow = secondDb.prepare('SELECT access_count FROM memory_index WHERE id = 2').get() as Pick<AccessRow, 'access_count'>;

      expect(mod.getAccumulatorState(2).accumulated).toBe(0);
      expect(firstDbRow.access_count).toBe(0);
      expect(secondDbRow.access_count).toBe(0);

      firstDb.close();
      secondDb.close();
      testDb = null;
    });
  });

  /* ─────────────────────────────────────────────────────────────
     6. trackMultipleAccesses — THRESHOLD FLUSH REGRESSIONS
  ──────────────────────────────────────────────────────────────── */

  describe('trackMultipleAccesses — threshold flush regressions', () => {
    it('preserves accumulator state when threshold flush fails', () => {
      mod.dispose();

      for (const memoryId of [1, 2]) {
        for (let i = 0; i < 4; i++) {
          mod.trackAccess(memoryId);
        }
      }

      const result = mod.trackMultipleAccesses([1, 2]);

      expect(result).toEqual({ tracked: 2, flushed: 0 });
      expect(mod.getAccumulatorState(1).accumulated).toBeCloseTo(mod.ACCUMULATOR_THRESHOLD, 8);
      expect(mod.getAccumulatorState(2).accumulated).toBeCloseTo(mod.ACCUMULATOR_THRESHOLD, 8);
    });

    it('deletes accumulator entries only after successful threshold flush', () => {
      testDb = createDb(5);
      mod.init(testDb);

      for (const memoryId of [1, 2]) {
        for (let i = 0; i < 4; i++) {
          mod.trackAccess(memoryId);
        }
      }

      const result = mod.trackMultipleAccesses([1, 2]);
      const rows = requireTestDb().prepare(
        'SELECT id, access_count FROM memory_index WHERE id IN (1, 2) ORDER BY id'
      ).all() as Array<{ id: number; access_count: number }>;

      expect(result).toEqual({ tracked: 2, flushed: 2 });
      expect(mod.getAccumulatorState(1).accumulated).toBe(0);
      expect(mod.getAccumulatorState(2).accumulated).toBe(0);
      expect(rows).toEqual([
        { id: 1, access_count: 1 },
        { id: 2, access_count: 1 },
      ]);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     7. flushAccessCounts — ERROR HANDLING
  ──────────────────────────────────────────────────────────────── */

  describe('flushAccessCounts — error handling', () => {
    it('flushAccessCounts returns false when DB is closed', () => {
      testDb = createDb(3);
      mod.init(testDb);
      testDb.close();

      const result = mod.flushAccessCounts(1);
      expect(result).toBe(false);
    });

    it('flushAccessCounts with id=0 returns false (no matching row)', () => {
      testDb = createDb(3);
      mod.init(testDb);

      const result = mod.flushAccessCounts(0);
      expect(result).toBe(false);
    });

    it('flushAccessCounts with negative id returns false', () => {
      testDb = createDb(3);
      mod.init(testDb);

      const result = mod.flushAccessCounts(-1);
      expect(result).toBe(false);
    });
  });

  /* ─────────────────────────────────────────────────────────────
     8. EXPORTED CONSTANTS VALIDATION
   ──────────────────────────────────────────────────────────────── */

  describe('Exported constants validation', () => {
    it('ACCUMULATOR_THRESHOLD is 0.5', () => {
      expect(mod.ACCUMULATOR_THRESHOLD).toBe(0.5);
    });

    it('INCREMENT_VALUE is 0.1', () => {
      expect(mod.INCREMENT_VALUE).toBe(0.1);
    });

    it('All expected functions are exported', () => {
      expect(typeof mod.init).toBe('function');
      expect(typeof mod.trackAccess).toBe('function');
      expect(typeof mod.trackMultipleAccesses).toBe('function');
      expect(typeof mod.flushAccessCounts).toBe('function');
      expect(typeof mod.getAccumulatorState).toBe('function');
      expect(typeof mod.calculatePopularityScore).toBe('function');
      expect(typeof mod.calculateUsageBoost).toBe('function');
      expect(typeof mod.reset).toBe('function');
      expect(typeof mod.initExitHandlers).toBe('function');
      expect(typeof mod.cleanupExitHandlers).toBe('function');
    });
  });

  /* ─────────────────────────────────────────────────────────────
     9. COMPOSITE SCORING + ARCHIVAL INTEGRATION
   ──────────────────────────────────────────────────────────────── */

  describe('Composite scoring + archival integration', () => {
    const DAY_MS = 1000 * 60 * 60 * 24;

    it('Composite recency delegates to shared folder recency scoring', () => {
      const timestamp = new Date(Date.now() - (3 * DAY_MS)).toISOString();
      const compositeRecency = compositeScoring.calculateRecencyScore(timestamp, 'normal');
      const sharedRecency = folderScoring.computeRecencyScore(
        timestamp,
        'normal',
        folderScoring.DECAY_RATE
      );

      expect(compositeRecency).toBeCloseTo(sharedRecency, 8);
    });

    it('Decay-rate boundaries: rate=0 no decay, rate=1.0 near-complete decay', () => {
      const staleTimestamp = new Date(Date.now() - (3650 * DAY_MS)).toISOString();
      const noDecay = folderScoring.computeRecencyScore(staleTimestamp, 'normal', 0);
      const fullDecay = folderScoring.computeRecencyScore(staleTimestamp, 'normal', 1.0);

      expect(noDecay).toBe(1);
      expect(fullDecay).toBeGreaterThan(0);
      expect(fullDecay).toBeLessThan(0.001);
    });

    it('Old timestamps remain above floor while approaching zero', () => {
      const veryOldTimestamp = new Date(Date.now() - (3650 * DAY_MS)).toISOString();
      const recency = compositeScoring.calculateRecencyScore(veryOldTimestamp, 'normal');

      expect(recency).toBeGreaterThan(0);
      expect(recency).toBeLessThan(0.01);
    });

    it('Tier boundary edges: constitutional stays max and critical outranks important', () => {
      const oldTimestamp = new Date(Date.now() - (365 * DAY_MS)).toISOString();
      const constitutionalRecency = compositeScoring.calculateRecencyScore(oldTimestamp, 'constitutional');
      const criticalRecency = compositeScoring.calculateRecencyScore(oldTimestamp, 'critical');

      expect(constitutionalRecency).toBe(1);
      expect(criticalRecency).toBeLessThan(1);

      const nowIso = new Date().toISOString();
      const folderScores = folderScoring.computeFolderScores(
        [
          { id: 101, spec_folder: 'tiers/critical', updated_at: nowIso, created_at: nowIso, importance_tier: 'critical' },
          { id: 102, spec_folder: 'tiers/important', updated_at: nowIso, created_at: nowIso, importance_tier: 'important' },
        ],
        { includeArchived: true }
      );

      const criticalFolder = folderScores.find(folder => folder.folder === 'tiers/critical');
      const importantFolder = folderScores.find(folder => folder.folder === 'tiers/important');

      expect(criticalFolder).toBeDefined();
      expect(importantFolder).toBeDefined();
      expect(criticalFolder?.score ?? 0).toBeGreaterThan(importantFolder?.score ?? 0);
    });

    it('Archival paths are deprioritized by archive multipliers', () => {
      const nowIso = new Date().toISOString();
      const folderScores = folderScoring.computeFolderScores(
        [
          { id: 201, spec_folder: 'specs/z_archive/legacy', updated_at: nowIso, created_at: nowIso, importance_tier: 'critical' },
          { id: 202, spec_folder: 'specs/active/project', updated_at: nowIso, created_at: nowIso, importance_tier: 'critical' },
        ],
        { includeArchived: true }
      );

      const archivedFolder = folderScores.find(folder => folder.folder === 'specs/z_archive/legacy');
      const activeFolder = folderScores.find(folder => folder.folder === 'specs/active/project');

      expect(archivedFolder).toBeDefined();
      expect(activeFolder).toBeDefined();
      expect(archivedFolder?.score ?? 1).toBeLessThan(activeFolder?.score ?? 0);
    });
  });
});
