// TEST: CONFIDENCE TRACKER
import { describe, it, expect, beforeAll, beforeEach, afterAll, afterEach, vi } from 'vitest';

import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as mod from '../lib/scoring/confidence-tracker';
import type {
  ConfidenceInfo,
  Database as ConfidenceTrackerDatabase,
  ValidationResult,
} from '../lib/scoring/confidence-tracker';
import Database from 'better-sqlite3';

// TEST: CONFIDENCE TRACKER
// Confidence scoring with validation and tier promotion
// Task ID: T510 (happy path), T103 (DB error safety)
type ConfidenceTrackerCall =
  | ((db: ConfidenceTrackerDatabase) => ValidationResult)
  | ((db: ConfidenceTrackerDatabase) => number)
  | ((db: ConfidenceTrackerDatabase) => boolean)
  | ((db: ConfidenceTrackerDatabase) => ConfidenceInfo);

type ClosableConfidenceTrackerDatabase = ConfidenceTrackerDatabase & { close: () => void };

const MEMORY_INDEX_SCHEMA = `
  CREATE TABLE IF NOT EXISTS memory_index (
    id INTEGER PRIMARY KEY,
    title TEXT,
    confidence REAL DEFAULT 0.5,
    validation_count INTEGER DEFAULT 0,
    importance_tier TEXT DEFAULT 'normal',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`;

const BASE_TEST_MEMORIES: Array<[number, string, number, number, string]> = [
  [1, 'Normal Memory', 0.5, 0, 'normal'],
  [2, 'High Confidence Memory', 0.85, 4, 'normal'],
  [3, 'Already Critical', 0.95, 10, 'critical'],
  [4, 'Low Confidence Memory', 0.1, 2, 'normal'],
  [5, 'Promotion Candidate', 0.88, 4, 'normal'],
];

let db: ClosableConfidenceTrackerDatabase | null = null;

function setupFreshDb(): ClosableConfidenceTrackerDatabase {
  const database = new Database(':memory:') as unknown as ClosableConfidenceTrackerDatabase;

  database.exec(MEMORY_INDEX_SCHEMA);

  const insert = database.prepare(
    'INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier) VALUES (?, ?, ?, ?, ?)'
  );

  for (const memory of BASE_TEST_MEMORIES) {
    insert.run(...memory);
  }

  return database;
}

/**
 * Create a mock DB object that throws SQLITE_BUSY on all operations.
 * Simulates a locked or temporarily unavailable database.
 */
function createBrokenDb(): ConfidenceTrackerDatabase {
  const busyError = new Error('SQLITE_BUSY: database is locked');
  return {
    prepare: () => { throw busyError; },
    transaction: () => { throw busyError; },
    exec: () => { throw busyError; },
  } as unknown as ConfidenceTrackerDatabase;
}

describe('Confidence Tracker Tests (T510)', () => {
  beforeEach(() => {
    db = setupFreshDb();
  });

  afterEach(() => {
    try {
      if (db) db.close();
    } catch { /* ignore cleanup errors */ }
    db = null;
  });

  // ───────────────────────────────────────────────────────────────
  // 1. INITIAL CONFIDENCE CONSTANTS (T510-01)
  // ───────────────────────────────────────────────────────────────
  describe('Initial Confidence Constants (T510-01)', () => {
    it('T510-01a: CONFIDENCE_BASE = 0.5', () => {
      expect(mod.CONFIDENCE_BASE).toBe(0.5);
    });

    it('T510-01b: CONFIDENCE_MAX = 1.0', () => {
      expect(mod.CONFIDENCE_MAX).toBe(1.0);
    });

    it('T510-01c: CONFIDENCE_MIN = 0.0', () => {
      expect(mod.CONFIDENCE_MIN).toBe(0.0);
    });

    it('T510-01d: getConfidenceScore returns base for new memory', () => {
      const score = mod.getConfidenceScore(db!, 1);
      expect(score).toBe(0.5);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 2. POSITIVE FEEDBACK ADJUSTS UP (T510-02)
  // ───────────────────────────────────────────────────────────────
  describe('Positive Feedback Adjusts Up (T510-02)', () => {
    it('T510-02a: Positive validation increases confidence', () => {
      const before = mod.getConfidenceScore(db!, 1);
      const result = mod.recordValidation(db!, 1, true);
      expect(result).toBeTruthy();
      expect(result.confidence).toBeGreaterThan(before);
    });

    it('T510-02b: Validation count incremented', () => {
      mod.recordValidation(db!, 1, true);
      const result = mod.getConfidenceInfo(db!, 1);
      expect(result).toBeTruthy();
      expect(result.validationCount).toBe(1);
    });

    it('T510-02c: Confidence increased by POSITIVE_INCREMENT', () => {
      mod.recordValidation(db!, 1, true);
      const expectedConfidence = 0.5 + mod.CONFIDENCE_POSITIVE_INCREMENT;
      const score = mod.getConfidenceScore(db!, 1);
      expect(score).toBeCloseTo(expectedConfidence, 3);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 3. NEGATIVE FEEDBACK ADJUSTS DOWN (T510-03)
  // ───────────────────────────────────────────────────────────────
  describe('Negative Feedback Adjusts Down (T510-03)', () => {
    it('T510-03a: Negative validation decreases confidence', () => {
      const before = mod.getConfidenceScore(db!, 4);
      const result = mod.recordValidation(db!, 4, false);
      expect(result).toBeTruthy();
      expect(result.confidence).toBeLessThan(before);
    });

    it('T510-03b: Confidence decreased by NEGATIVE_DECREMENT', () => {
      mod.recordValidation(db!, 4, false);
      const expectedConfidence = 0.1 - mod.CONFIDENCE_NEGATIVE_DECREMENT;
      const score = mod.getConfidenceScore(db!, 4);
      expect(score).toBeCloseTo(expectedConfidence, 3);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4. CONFIDENCE BOUNDS (T510-04)
  // ───────────────────────────────────────────────────────────────
  describe('Confidence Bounds (T510-04)', () => {
    it('T510-04a: Confidence never goes below CONFIDENCE_MIN (0.0)', () => {
      // Push memory 4 to minimum by recording many negative validations
      for (let i = 0; i < 10; i++) {
        mod.recordValidation(db!, 4, false);
      }
      const minScore = mod.getConfidenceScore(db!, 4);
      expect(minScore).toBeGreaterThanOrEqual(0.0);
    });

    it('T510-04b: Confidence never exceeds CONFIDENCE_MAX (1.0)', () => {
      // Push memory 2 to maximum by recording many positive validations
      for (let i = 0; i < 10; i++) {
        mod.recordValidation(db!, 2, true);
      }
      const maxScore = mod.getConfidenceScore(db!, 2);
      expect(maxScore).toBeLessThanOrEqual(1.0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5. PROMOTION TRACKING AND HISTORY (T510-05)
  // ───────────────────────────────────────────────────────────────
  describe('Promotion Tracking and History (T510-05)', () => {
    it('T510-05a: Promotion eligibility detected after meeting thresholds', () => {
      // Memory 5 has confidence=0.88, validation_count=4
      // Promotion requires confidence >= 0.9 AND validation_count >= 5
      const result = mod.recordValidation(db!, 5, true);
      expect(result).toBeTruthy();
      expect(result.promotionEligible).toBe(true);
    });

    it('T510-05b: Auto-promotion occurred', () => {
      if (!mod.checkPromotionEligible(db!, 5)) {
        const validation = mod.recordValidation(db!, 5, true);
        expect(validation.promotionEligible).toBe(true);
      }

      const promoted = mod.promoteToCritical(db!, 5);
      expect(promoted).toBe(true);

      const info = mod.getConfidenceInfo(db!, 5);
      expect(info).toBeTruthy();
      expect(info.importanceTier).toBe('critical');
    });

    it('T510-05c: getConfidenceInfo returns full info', () => {
      const info = mod.getConfidenceInfo(db!, 5);
      expect(info).toBeTruthy();
      expect(typeof info.confidence).toBe('number');
      expect(typeof info.validationCount).toBe('number');
    });

    it('T510-05d: Already-critical memory not eligible for promotion', () => {
      const critical = mod.checkPromotionEligible(db!, 3);
      expect(critical).toBe(false);
    });
  });
});

// T103: DB ERROR SAFE DEFAULTS (P0-06 Safety Fix)
// Verifies all 7 DB operations in confidence-tracker survive
// Database failures without crashing the server.
// Tests: closed DB handle, mock SQLITE_BUSY, error logging.
describe('DB Error Safe Defaults (T103)', () => {

  // ───────────────────────────────────────────────────────────────
  // 6. DB ERROR: CLOSED DB HANDLE (T103-01)
  // ───────────────────────────────────────────────────────────────
  describe('Closed DB Handle (T103-01)', () => {
    let closedDb: ClosableConfidenceTrackerDatabase | null = null;
    let closedDbPath: string;

    beforeAll(() => {
      closedDbPath = path.join(os.tmpdir(), `conf-tracker-closed-${Date.now()}.sqlite`);
      closedDb = new Database(closedDbPath) as unknown as ClosableConfidenceTrackerDatabase;
      closedDb.exec(`
        CREATE TABLE IF NOT EXISTS memory_index (
          id INTEGER PRIMARY KEY,
          title TEXT,
          confidence REAL DEFAULT 0.5,
          validation_count INTEGER DEFAULT 0,
          importance_tier TEXT DEFAULT 'normal',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);
      closedDb.close();
    });

    afterAll(() => {
      try {
        if (closedDbPath && fs.existsSync(closedDbPath)) fs.unlinkSync(closedDbPath);
      } catch { /* ignore */ }
    });

    it('T103-01b: recordValidation throws on closed DB (T-07: explicit failure signaling)', () => {
      expect(() => mod.recordValidation(closedDb!, 1, true)).toThrow();
    });

    it('T103-01c: getConfidenceScore returns CONFIDENCE_BASE on closed DB', () => {
      const score = mod.getConfidenceScore(closedDb!, 1);
      expect(score).toBe(0.5);
    });

    it('T103-01d: checkPromotionEligible returns false on closed DB', () => {
      const eligible = mod.checkPromotionEligible(closedDb!, 1);
      expect(eligible).toBe(false);
    });

    it('T103-01e: promoteToCritical returns false on closed DB', () => {
      const promoted = mod.promoteToCritical(closedDb!, 1);
      expect(promoted).toBe(false);
    });

    it('T103-01f: getConfidenceInfo throws on closed DB (T-07: explicit failure signaling)', () => {
      expect(() => mod.getConfidenceInfo(closedDb!, 42)).toThrow();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 7. DB ERROR: MOCK SQLITE_BUSY (T103-02)
  // ───────────────────────────────────────────────────────────────
  describe('Mock SQLITE_BUSY (T103-02)', () => {
    let brokenDb: ConfidenceTrackerDatabase;

    beforeAll(() => {
      brokenDb = createBrokenDb();
    });

    it('T103-02a: recordValidation throws on SQLITE_BUSY (T-07: explicit failure signaling)', () => {
      expect(() => mod.recordValidation(brokenDb, 100, true)).toThrow();
    });

    it('T103-02b: getConfidenceScore survives SQLITE_BUSY', () => {
      const result = mod.getConfidenceScore(brokenDb, 100);
      expect(result).toBe(0.5);
    });

    it('T103-02c: checkPromotionEligible survives SQLITE_BUSY', () => {
      const result = mod.checkPromotionEligible(brokenDb, 100);
      expect(result).toBe(false);
    });

    it('T103-02d: promoteToCritical survives SQLITE_BUSY', () => {
      const result = mod.promoteToCritical(brokenDb, 100);
      expect(result).toBe(false);
    });

    it('T103-02e: getConfidenceInfo throws on SQLITE_BUSY (T-07: explicit failure signaling)', () => {
      expect(() => mod.getConfidenceInfo(brokenDb, 100)).toThrow();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 8. DB ERROR: ERROR LOGGING VERIFICATION (T103-03)
  // ───────────────────────────────────────────────────────────────
  describe('Error Logging Verification (T103-03)', () => {
    let brokenDb: ConfidenceTrackerDatabase;

    beforeAll(() => {
      brokenDb = createBrokenDb();
    });

    const functions: Array<{ name: string; call: ConfidenceTrackerCall; tag: string }> = [
      { name: 'recordValidation', call: (brokenDatabase) => mod.recordValidation(brokenDatabase, 77, true), tag: 'recordValidation' },
      { name: 'getConfidenceScore', call: (brokenDatabase) => mod.getConfidenceScore(brokenDatabase, 77), tag: 'getConfidenceScore' },
      { name: 'checkPromotionEligible', call: (brokenDatabase) => mod.checkPromotionEligible(brokenDatabase, 77), tag: 'checkPromotionEligible' },
      { name: 'promoteToCritical', call: (brokenDatabase) => mod.promoteToCritical(brokenDatabase, 77), tag: 'promoteToCritical' },
      { name: 'getConfidenceInfo', call: (brokenDatabase) => mod.getConfidenceInfo(brokenDatabase, 77), tag: 'getConfidenceInfo' },
    ];

    for (const fn of functions) {
      it(`T103-03-${fn.name}: ${fn.name} logs error with function context`, () => {
        const captured: string[] = [];
        const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
          captured.push(args.map(String).join(' '));
        });

        // T-07: recordValidation now throws on DB errors (explicit failure signaling).
        // Other functions still return safe defaults.
        try {
          fn.call(brokenDb);
        } catch {
          // Expected for recordValidation
        }
        errorSpy.mockRestore();

        const hasContext = captured.some(msg => msg.includes(fn.tag));
        expect(hasContext).toBe(true);
      });
    }
  });

  // ───────────────────────────────────────────────────────────────
  // 9. DB ERROR: GETCONFIDENCEINFO FULL STRUCTURE (T103-04)
  // ───────────────────────────────────────────────────────────────
  describe('getConfidenceInfo Full Structure (T103-04)', () => {
    it('T103-04a: getConfidenceInfo throws on broken DB (T-07: explicit failure signaling)', () => {
      const brokenDb = createBrokenDb();
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      expect(() => mod.getConfidenceInfo(brokenDb, 55)).toThrow();

      errorSpy.mockRestore();
    });

    it('T103-04b: getConfidenceInfo error is logged before re-throw', () => {
      const brokenDb = createBrokenDb();
      const captured: string[] = [];
      const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
        captured.push(args.map(String).join(' '));
      });

      expect(() => mod.getConfidenceInfo(brokenDb, 55)).toThrow();

      errorSpy.mockRestore();

      const hasContext = captured.some(msg => msg.includes('getConfidenceInfo'));
      expect(hasContext).toBe(true);
    });
  });
});
