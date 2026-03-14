// TEST: SCORING GAPS
import { describe, it, expect, beforeAll } from 'vitest';

import * as confMod from '../lib/scoring/confidence-tracker';
import * as tierMod from '../lib/scoring/importance-tiers';
import Database from 'better-sqlite3';

/* ───────────────────────────────────────────────────────────────
   DB HELPER
──────────────────────────────────────────────────────────────── */

function createTestDb() {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      confidence REAL DEFAULT 0.5,
      validation_count INTEGER DEFAULT 0,
      importance_tier TEXT DEFAULT 'normal',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
  return db;
}

function insertMemory(db: InstanceType<typeof Database>, id: number, opts: {
  confidence?: number;
  validation_count?: number;
  importance_tier?: string;
  title?: string;
} = {}) {
  db.prepare(
    'INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier) VALUES (?, ?, ?, ?, ?)'
  ).run(
    id,
    opts.title ?? `Memory ${id}`,
    opts.confidence ?? 0.5,
    opts.validation_count ?? 0,
    opts.importance_tier ?? 'normal',
  );
}

/* ───────────────────────────────────────────────────────────────
   CONFIDENCE-TRACKER TESTS
──────────────────────────────────────────────────────────────── */

describe('Scoring Gaps', () => {
  describe('PROMOTION_CONFIDENCE_THRESHOLD', () => {
    it('T-CT01 is a number', () => {
      const val = confMod.PROMOTION_CONFIDENCE_THRESHOLD;
      expect(typeof val).toBe('number');
    });

    it('T-CT02 in (0,1]', () => {
      const val = confMod.PROMOTION_CONFIDENCE_THRESHOLD;
      expect(val).toBeGreaterThan(0);
      expect(val).toBeLessThanOrEqual(1);
    });

    it('T-CT03 equals 0.9', () => {
      expect(confMod.PROMOTION_CONFIDENCE_THRESHOLD).toBe(0.9);
    });
  });

  describe('PROMOTION_VALIDATION_THRESHOLD', () => {
    it('T-CT04 is a number', () => {
      const val = confMod.PROMOTION_VALIDATION_THRESHOLD;
      expect(typeof val).toBe('number');
    });

    it('T-CT05 is a positive integer', () => {
      const val = confMod.PROMOTION_VALIDATION_THRESHOLD;
      expect(val).toBeGreaterThan(0);
      expect(Number.isInteger(val)).toBe(true);
    });

    it('T-CT06 equals 5', () => {
      expect(confMod.PROMOTION_VALIDATION_THRESHOLD).toBe(5);
    });
  });

  describe('promoteToCritical', () => {
    it('T-CT07 returns true for eligible memory', () => {
      const db = createTestDb();
      insertMemory(db, 1, { confidence: 0.95, validation_count: 6, importance_tier: 'normal' });

      const result = confMod.promoteToCritical(db, 1);
      expect(result).toBe(true);

      const row = db.prepare('SELECT importance_tier FROM memory_index WHERE id = 1').get() as { importance_tier: string };
      expect(row.importance_tier).toBe('critical');
      db.close();
    });

    it('T-CT08 DB tier updated to critical after promotion', () => {
      const db = createTestDb();
      insertMemory(db, 1, { confidence: 0.95, validation_count: 7, importance_tier: 'important' });

      confMod.promoteToCritical(db, 1);
      const row = db.prepare('SELECT importance_tier FROM memory_index WHERE id = 1').get() as { importance_tier: string };
      expect(row.importance_tier).toBe('critical');
      db.close();
    });

    it('T-CT09 updated_at refreshed after promotion', () => {
      const db = createTestDb();
      db.prepare(
        'INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(1, 'Old', 0.95, 6, 'normal', '2020-01-01T00:00:00.000Z');

      confMod.promoteToCritical(db, 1);
      const row = db.prepare('SELECT updated_at FROM memory_index WHERE id = 1').get() as { updated_at: string };
      expect(row.updated_at).not.toBe('2020-01-01T00:00:00.000Z');
      db.close();
    });

    it('T-CT10 returns false for already-critical memory', () => {
      const db = createTestDb();
      insertMemory(db, 1, { confidence: 0.99, validation_count: 10, importance_tier: 'critical' });

      const result = confMod.promoteToCritical(db, 1);
      expect(result).toBe(false);
      db.close();
    });

    it('T-CT11 returns false for constitutional memory', () => {
      const db = createTestDb();
      insertMemory(db, 1, { confidence: 0.99, validation_count: 10, importance_tier: 'constitutional' });

      const result = confMod.promoteToCritical(db, 1);
      expect(result).toBe(false);
      db.close();
    });

    it('T-CT12 returns false for ineligible memory', () => {
      const db = createTestDb();
      insertMemory(db, 1, { confidence: 0.3, validation_count: 1, importance_tier: 'normal' });

      const result = confMod.promoteToCritical(db, 1);
      expect(result).toBe(false);
      db.close();
    });

    it('T-CT13 returns false for non-existent memory', () => {
      const db = createTestDb();
      const result = confMod.promoteToCritical(db, 999);
      expect(result).toBe(false);
      db.close();
    });

    it('T-CT14 ineligible memory tier unchanged after failed promotion', () => {
      const db = createTestDb();
      insertMemory(db, 1, { confidence: 0.4, validation_count: 2, importance_tier: 'normal' });

      try { confMod.promoteToCritical(db, 1); } catch {}
      const row = db.prepare('SELECT importance_tier FROM memory_index WHERE id = 1').get() as { importance_tier: string };
      expect(row.importance_tier).toBe('normal');
      db.close();
    });

    it('T-CT15 succeeds at exact threshold boundary', () => {
      const db = createTestDb();
      const ct = confMod.PROMOTION_CONFIDENCE_THRESHOLD;  // 0.9
      const vt = confMod.PROMOTION_VALIDATION_THRESHOLD;  // 5
      insertMemory(db, 1, { confidence: ct, validation_count: vt, importance_tier: 'normal' });

      const result = confMod.promoteToCritical(db, 1);
      expect(result).toBe(true);
      db.close();
    });

    it('T-CT16 fails just below confidence threshold', () => {
      const db = createTestDb();
      const ct = confMod.PROMOTION_CONFIDENCE_THRESHOLD;
      const vt = confMod.PROMOTION_VALIDATION_THRESHOLD;
      insertMemory(db, 1, { confidence: ct - 0.01, validation_count: vt, importance_tier: 'normal' });

      const result = confMod.promoteToCritical(db, 1);
      expect(result).toBe(false);
      db.close();
    });

    it('T-CT17 fails just below validation threshold', () => {
      const db = createTestDb();
      const ct = confMod.PROMOTION_CONFIDENCE_THRESHOLD;
      const vt = confMod.PROMOTION_VALIDATION_THRESHOLD;
      insertMemory(db, 1, { confidence: ct, validation_count: vt - 1, importance_tier: 'normal' });

      const result = confMod.promoteToCritical(db, 1);
      expect(result).toBe(false);
      db.close();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     IMPORTANCE-TIERS TESTS
  ──────────────────────────────────────────────────────────────── */

  describe('getConstitutionalFilter', () => {
    it('T-IT01 returns a string', () => {
      const sql = tierMod.getConstitutionalFilter();
      expect(typeof sql).toBe('string');
    });

    it('T-IT02 contains "constitutional"', () => {
      const sql = tierMod.getConstitutionalFilter();
      expect(sql).toContain('constitutional');
    });

    it('T-IT03 references importance_tier column', () => {
      const sql = tierMod.getConstitutionalFilter();
      expect(sql).toContain('importance_tier');
    });
  });

  describe('getSearchableTiersFilter', () => {
    it('T-IT04 returns a string', () => {
      const sql = tierMod.getSearchableTiersFilter();
      expect(typeof sql).toBe('string');
    });

    it('T-IT05 references deprecated tier', () => {
      const sql = tierMod.getSearchableTiersFilter();
      expect(sql).toContain('deprecated');
    });

    it('T-IT06 uses exclusion operator', () => {
      const sql = tierMod.getSearchableTiersFilter();
      const excludes = sql.includes('!=') || sql.toLowerCase().includes('not');
      expect(excludes).toBe(true);
    });
  });

  describe('shouldAlwaysSurface', () => {
    it('T-IT07 constitutional returns true', () => {
      expect(tierMod.shouldAlwaysSurface('constitutional')).toBe(true);
    });

    it('T-IT08 normal returns false', () => {
      expect(tierMod.shouldAlwaysSurface('normal')).toBe(false);
    });

    it('T-IT09 critical returns false', () => {
      expect(tierMod.shouldAlwaysSurface('critical')).toBe(false);
    });

    it('T-IT10 deprecated returns false', () => {
      expect(tierMod.shouldAlwaysSurface('deprecated')).toBe(false);
    });

    it('T-IT11 unknown tier returns false', () => {
      expect(tierMod.shouldAlwaysSurface('nonexistent')).toBe(false);
    });
  });

  describe('getMaxTokens', () => {
    it('T-IT12 constitutional returns positive number', () => {
      const val = tierMod.getMaxTokens('constitutional');
      expect(typeof val).toBe('number');
      expect(val).toBeGreaterThan(0);
    });

    it('T-IT13 constitutional equals 2000', () => {
      expect(tierMod.getMaxTokens('constitutional')).toBe(2000);
    });

    it('T-IT14 normal returns null', () => {
      expect(tierMod.getMaxTokens('normal')).toBeNull();
    });

    it('T-IT15 critical returns null', () => {
      expect(tierMod.getMaxTokens('critical')).toBeNull();
    });

    it('T-IT16 temporary returns null', () => {
      expect(tierMod.getMaxTokens('temporary')).toBeNull();
    });

    it('T-IT17 unknown tier returns null', () => {
      expect(tierMod.getMaxTokens('bogus')).toBeNull();
    });
  });

  describe('getExpiredTemporaryFilter', () => {
    it('T-IT18 returns a string', () => {
      const sql = tierMod.getExpiredTemporaryFilter();
      expect(typeof sql).toBe('string');
    });

    it('T-IT19 contains "temporary"', () => {
      const sql = tierMod.getExpiredTemporaryFilter();
      expect(sql).toContain('temporary');
    });

    it('T-IT20 contains date comparison', () => {
      const sql = tierMod.getExpiredTemporaryFilter();
      const hasDate = sql.includes('datetime') || sql.includes('date') || sql.includes('now');
      expect(hasDate).toBe(true);
    });

    it('T-IT21 uses 7-day expiry', () => {
      const sql = tierMod.getExpiredTemporaryFilter();
      expect(sql).toContain('7');
    });

    it('T-IT22 references created_at', () => {
      const sql = tierMod.getExpiredTemporaryFilter();
      expect(sql).toContain('created_at');
    });

    it('T-IT23 uses < for expiry', () => {
      const sql = tierMod.getExpiredTemporaryFilter();
      expect(sql).toContain('<');
    });
  });
});
