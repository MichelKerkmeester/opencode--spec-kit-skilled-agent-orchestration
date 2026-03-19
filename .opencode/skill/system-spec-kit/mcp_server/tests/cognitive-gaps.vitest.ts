// TEST: COGNITIVE GAPS
import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import type { FsrsParams } from '../lib/cognitive/fsrs-scheduler';
import * as fsrs from '../lib/cognitive/fsrs-scheduler';
import * as archival from '../lib/cognitive/archival-manager';
import * as wm from '../lib/cognitive/working-memory';

interface TableInfoRow {
  name: string;
}

interface WorkingMemoryRow {
  session_id: string;
  memory_id: number;
}

/* ─────────────────────────────────────────────────────────────
   DB HELPERS
──────────────────────────────────────────────────────────────── */

/** Create in-memory DB with memory_index schema for archival-manager */
function createArchivalDb() {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      title TEXT,
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

/** Create in-memory DB with working_memory + memory_index schema */
function createWorkingMemoryDb() {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL DEFAULT 'test',
      file_path TEXT NOT NULL DEFAULT '/test.md',
      title TEXT
    )
  `);
  return db;
}

/* ═══════════════════════════════════════════════════════════════
   A. FSRS SCHEDULER — calculateElapsedDays
═══════════════════════════════════════════════════════════════ */

describe('A. calculateElapsedDays', () => {
  it('A-01: null lastReview returns 0', () => {
    const result = fsrs.calculateElapsedDays(null);
    expect(result).toBe(0);
  });

  it('A-02: recent date returns small fraction of a day', () => {
    const oneHourAgo = new Date(Date.now() - 3600_000).toISOString();
    const result = fsrs.calculateElapsedDays(oneHourAgo);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(0.1);
  });

  it('A-03: 10 days ago returns ~10', () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 86400_000).toISOString();
    const result = fsrs.calculateElapsedDays(tenDaysAgo);
    expect(result).toBeGreaterThanOrEqual(9.9);
    expect(result).toBeLessThanOrEqual(10.1);
  });

  it('A-04: 365 days ago returns ~365', () => {
    const oneYearAgo = new Date(Date.now() - 365 * 86400_000).toISOString();
    const result = fsrs.calculateElapsedDays(oneYearAgo);
    expect(result).toBeGreaterThanOrEqual(364.9);
    expect(result).toBeLessThanOrEqual(365.1);
  });

  it('A-05: future date returns 0 (clamped)', () => {
    const tomorrow = new Date(Date.now() + 86400_000).toISOString();
    const result = fsrs.calculateElapsedDays(tomorrow);
    expect(result).toBe(0);
  });

  it('A-06: current timestamp returns ~0', () => {
    const now = new Date().toISOString();
    const result = fsrs.calculateElapsedDays(now);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(0.01);
  });
});

/* ═══════════════════════════════════════════════════════════════
   B. FSRS SCHEDULER — getNextReviewDate
═══════════════════════════════════════════════════════════════ */

describe('B. getNextReviewDate', () => {
  it('B-01: returns valid ISO date string', () => {
    const result = fsrs.getNextReviewDate(1.0);
    const parsed = new Date(result);
    expect(isNaN(parsed.getTime())).toBe(false);
  });

  it('B-02: review date is in the future', () => {
    const result = fsrs.getNextReviewDate(1.0);
    const parsed = new Date(result);
    expect(parsed.getTime()).toBeGreaterThan(Date.now() - 1000);
  });

  it('B-03: higher stability pushes review further out', () => {
    const lowStab = new Date(fsrs.getNextReviewDate(1.0)).getTime();
    const highStab = new Date(fsrs.getNextReviewDate(50.0)).getTime();
    expect(highStab).toBeGreaterThan(lowStab);
  });

  it('B-04: lower retention gives longer interval', () => {
    const r90 = new Date(fsrs.getNextReviewDate(10.0, 0.9)).getTime();
    const r50 = new Date(fsrs.getNextReviewDate(10.0, 0.5)).getTime();
    expect(r50).toBeGreaterThan(r90);
  });

  it('B-05: very low stability still returns future date', () => {
    const result = fsrs.getNextReviewDate(0.1);
    const parsed = new Date(result);
    expect(parsed.getTime()).toBeGreaterThanOrEqual(Date.now() - 1000);
  });
});

/* ═══════════════════════════════════════════════════════════════
   C. FSRS SCHEDULER — createInitialParams
═══════════════════════════════════════════════════════════════ */

describe('C. createInitialParams', () => {
  it('C-01: returns object with all required fields', () => {
    const params = fsrs.createInitialParams();
    expect(typeof params).toBe('object');
    expect(params).not.toBeNull();
    expect(params).toHaveProperty('stability');
    expect(params).toHaveProperty('difficulty');
    expect(params).toHaveProperty('lastReview');
    expect(params).toHaveProperty('reviewCount');
  });

  it('C-02: stability matches DEFAULT_INITIAL_STABILITY', () => {
    const params = fsrs.createInitialParams();
    expect(params.stability).toBe(fsrs.DEFAULT_INITIAL_STABILITY);
  });

  it('C-03: difficulty matches DEFAULT_INITIAL_DIFFICULTY', () => {
    const params = fsrs.createInitialParams();
    expect(params.difficulty).toBe(fsrs.DEFAULT_INITIAL_DIFFICULTY);
  });

  it('C-04: lastReview is null', () => {
    const params = fsrs.createInitialParams();
    expect(params.lastReview).toBeNull();
  });

  it('C-05: reviewCount is 0', () => {
    const params = fsrs.createInitialParams();
    expect(params.reviewCount).toBe(0);
  });

  it('C-06: returns fresh object each call', () => {
    const a = fsrs.createInitialParams();
    const b = fsrs.createInitialParams();
    expect(a).not.toBe(b);
    a.stability = 999;
    expect(b.stability).not.toBe(999);
  });
});

/* ═══════════════════════════════════════════════════════════════
   D. FSRS SCHEDULER — processReview
═══════════════════════════════════════════════════════════════ */

describe('D. processReview', () => {
  let initial: FsrsParams;

  beforeEach(() => {
    initial = fsrs.createInitialParams();
  });

  it('D-01: returns ReviewResult with all fields', () => {
    const result = fsrs.processReview(initial, 3);
    expect(result).toHaveProperty('stability');
    expect(result).toHaveProperty('difficulty');
    expect(result).toHaveProperty('lastReview');
    expect(result).toHaveProperty('reviewCount');
    expect(result).toHaveProperty('nextReviewDate');
    expect(result).toHaveProperty('retrievability');
  });

  it('D-02: reviewCount increments by 1', () => {
    const result = fsrs.processReview(initial, 3);
    expect(result.reviewCount).toBe(initial.reviewCount + 1);
  });

  it('D-03: lastReview is set to recent timestamp', () => {
    const before = Date.now();
    const result = fsrs.processReview(initial, 3);
    const reviewTime = new Date(result.lastReview).getTime();
    expect(reviewTime).toBeGreaterThanOrEqual(before - 1000);
    expect(reviewTime).toBeLessThanOrEqual(Date.now() + 1000);
  });

  it('D-04: grade AGAIN decreases stability', () => {
    const params = { ...initial, stability: 5.0, lastReview: new Date().toISOString(), reviewCount: 1 };
    const result = fsrs.processReview(params, fsrs.GRADE_AGAIN);
    expect(result.stability).toBeLessThan(params.stability);
  });

  it('D-05: grade EASY increases stability', () => {
    const params = { ...initial, lastReview: new Date().toISOString(), reviewCount: 1 };
    const result = fsrs.processReview(params, fsrs.GRADE_EASY);
    expect(result.stability).toBeGreaterThan(initial.stability);
  });

  it('D-06: grade GOOD increases stability', () => {
    const params = { ...initial, lastReview: new Date().toISOString(), reviewCount: 1 };
    const result = fsrs.processReview(params, fsrs.GRADE_GOOD);
    expect(result.stability).toBeGreaterThan(initial.stability);
  });

  it('D-07: grade HARD gives <= stability than GOOD', () => {
    const params = { ...initial, lastReview: new Date().toISOString(), reviewCount: 1 };
    const resultHard = fsrs.processReview(params, fsrs.GRADE_HARD);
    const resultGood = fsrs.processReview(params, fsrs.GRADE_GOOD);
    expect(resultHard.stability).toBeLessThanOrEqual(resultGood.stability);
  });

  it('D-08: nextReviewDate is valid future date', () => {
    const result = fsrs.processReview(initial, 3);
    const nextDate = new Date(result.nextReviewDate);
    expect(isNaN(nextDate.getTime())).toBe(false);
    expect(nextDate.getTime()).toBeGreaterThanOrEqual(Date.now() - 1000);
  });

  it('D-09: retrievability is in [0, 1]', () => {
    const result = fsrs.processReview(initial, 3);
    expect(result.retrievability).toBeGreaterThanOrEqual(0);
    expect(result.retrievability).toBeLessThanOrEqual(1);
  });

  it('D-10: chaining reviews updates state', () => {
    const params = fsrs.createInitialParams();
    const result1 = fsrs.processReview(params, 3);
    const result2 = fsrs.processReview(result1, 4);
    expect(result2.reviewCount).toBe(2);
    expect(result2.stability).toBeGreaterThan(0);
  });
});

/* ═══════════════════════════════════════════════════════════════
   E. ARCHIVAL MANAGER — ensureArchivedColumn
═══════════════════════════════════════════════════════════════ */

describe('E. ensureArchivedColumn', () => {
  it('E-01: ensureArchivedColumn is idempotent', () => {
    const db = createArchivalDb();
    archival.init(db);
    archival.ensureArchivedColumn();
    archival.ensureArchivedColumn();
    const columns = (db.prepare('PRAGMA table_info(memory_index)').all() as TableInfoRow[]).map((column) => column.name);
    expect(columns).toContain('is_archived');
    archival.cleanup();
    db.close();
  });

  it('E-02: adds is_archived column when missing', () => {
    const db = new Database(':memory:');
    db.exec(`
      CREATE TABLE memory_index (
        id INTEGER PRIMARY KEY,
        title TEXT
      )
    `);
    const colsBefore = (db.prepare('PRAGMA table_info(memory_index)').all() as TableInfoRow[]).map((column) => column.name);
    expect(colsBefore).not.toContain('is_archived');

    archival.init(db);
    const colsAfter = (db.prepare('PRAGMA table_info(memory_index)').all() as TableInfoRow[]).map((column) => column.name);
    expect(colsAfter).toContain('is_archived');
    archival.cleanup();
    db.close();
  });

  it('E-03: no crash when db is null', () => {
    archival.cleanup();
    expect(() => archival.ensureArchivedColumn()).not.toThrow();
  });
});

/* ═══════════════════════════════════════════════════════════════
   F. ARCHIVAL MANAGER — getRecentErrors
═══════════════════════════════════════════════════════════════ */

describe('F. getRecentErrors', () => {
  it('F-01: returns empty array when no errors', () => {
    const db = createArchivalDb();
    archival.init(db);
    archival.resetStats();
    const errors = archival.getRecentErrors();
    expect(Array.isArray(errors)).toBe(true);
    expect(errors.length).toBe(0);
    archival.cleanup();
    db.close();
  });

  it('F-02: getRecentErrors returns array type', () => {
    const db = createArchivalDb();
    archival.init(db);
    archival.resetStats();
    const errors = archival.getRecentErrors();
    expect(Array.isArray(errors)).toBe(true);
    archival.cleanup();
    db.close();
  });

  it('F-03: default limit respects max of 10', () => {
    const db = createArchivalDb();
    archival.init(db);
    archival.resetStats();
    const errors = archival.getRecentErrors();
    expect(errors.length).toBeLessThanOrEqual(10);
    archival.cleanup();
    db.close();
  });

  it('F-04: custom limit parameter works', () => {
    const db = createArchivalDb();
    archival.init(db);
    archival.resetStats();
    const errors = archival.getRecentErrors(5);
    expect(errors.length).toBeLessThanOrEqual(5);
    archival.cleanup();
    db.close();
  });

  it('F-05: errors array contains strings', () => {
    const db = createArchivalDb();
    archival.init(db);
    archival.resetStats();
    const errors = archival.getRecentErrors();
    expect(errors.every((errorMessage) => typeof errorMessage === 'string')).toBe(true);
    archival.cleanup();
    db.close();
  });
});

/* ═══════════════════════════════════════════════════════════════
   G. WORKING MEMORY — cleanupOldSessions
═══════════════════════════════════════════════════════════════ */

describe('G. cleanupOldSessions', () => {
  it('G-01: returns 0 when no old sessions', () => {
    const db = createWorkingMemoryDb();
    wm.init(db);
    const removed = wm.cleanupOldSessions();
    expect(removed).toBe(0);
    db.close();
  });

  it('G-02: removes old sessions, keeps fresh ones', () => {
    const db = createWorkingMemoryDb();
    wm.init(db);

    db.exec(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (1, 'test', '/t.md', 'T1')`);
    db.exec(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (2, 'test', '/t2.md', 'T2')`);

    const oldTime = new Date(Date.now() - 7200_000).toISOString();
    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score, last_focused) VALUES ('old-session', 1, 0.5, '${oldTime}')`);
    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score, last_focused) VALUES ('fresh-session', 2, 0.8, '${new Date().toISOString()}')`);

    const removed = wm.cleanupOldSessions();
    expect(removed).toBe(1);

    const remaining = db.prepare('SELECT session_id, memory_id FROM working_memory').all() as WorkingMemoryRow[];
    expect(remaining.length).toBe(1);
    expect(remaining[0].session_id).toBe('fresh-session');
    db.close();
  });

  it('G-03: returns 0 without db', () => {
    wm.init(null as unknown as Database.Database);
    const removed = wm.cleanupOldSessions();
    expect(removed).toBe(0);
  });
});

/* ═══════════════════════════════════════════════════════════════
   H. WORKING MEMORY — enforceMemoryLimit
═══════════════════════════════════════════════════════════════ */

describe('H. enforceMemoryLimit', () => {
  it('H-01: returns 0 when under capacity', () => {
    const db = createWorkingMemoryDb();
    wm.init(db);

    db.exec(`INSERT INTO memory_index (id, spec_folder, file_path) VALUES (1, 'test', '/t.md')`);
    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s1', 1, 0.9)`);

    const removed = wm.enforceMemoryLimit('s1');
    expect(removed).toBe(0);
    db.close();
  });

  it('H-02: trims entries when at capacity', () => {
    const db = createWorkingMemoryDb();
    wm.init(db);

    const maxCap = wm.WORKING_MEMORY_CONFIG.maxCapacity;

    for (let i = 1; i <= maxCap + 2; i++) {
      db.exec(`INSERT INTO memory_index (id, spec_folder, file_path) VALUES (${i}, 'test', '/t${i}.md')`);
    }

    for (let i = 1; i <= maxCap; i++) {
      const score = (i / maxCap).toFixed(2);
      db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s1', ${i}, ${score})`);
    }

    const removed = wm.enforceMemoryLimit('s1');
    expect(removed).toBeGreaterThanOrEqual(1);
    db.close();
  });

  it('H-03: removes least recently focused entry (LRU)', () => {
    const db = createWorkingMemoryDb();
    wm.init(db);

    const maxCap = wm.WORKING_MEMORY_CONFIG.maxCapacity;

    for (let i = 1; i <= maxCap + 1; i++) {
      db.exec(`INSERT INTO memory_index (id, spec_folder, file_path) VALUES (${i}, 'test', '/t${i}.md')`);
    }

    for (let i = 1; i <= maxCap; i++) {
      db.exec(`
        INSERT INTO working_memory (session_id, memory_id, attention_score, last_focused)
        VALUES ('s1', ${i}, 0.9, datetime('now', '+${i} seconds'))
      `);
    }

    wm.enforceMemoryLimit('s1');

    const remaining = db.prepare('SELECT memory_id FROM working_memory WHERE session_id = ? ORDER BY memory_id').all('s1') as Array<Pick<WorkingMemoryRow, 'memory_id'>>;
    const remainingIds = remaining.map((row) => row.memory_id);
    expect(remainingIds).not.toContain(1);
    db.close();
  });

  it('H-04: returns 0 without db', () => {
    wm.init(null as unknown as Database.Database);
    const removed = wm.enforceMemoryLimit('any-session');
    expect(removed).toBe(0);
  });

  it('H-05: sessions are independent', () => {
    const db = createWorkingMemoryDb();
    wm.init(db);

    const maxCap = wm.WORKING_MEMORY_CONFIG.maxCapacity;

    for (let i = 1; i <= maxCap + 5; i++) {
      db.exec(`INSERT INTO memory_index (id, spec_folder, file_path) VALUES (${i}, 'test', '/t${i}.md')`);
    }

    for (let i = 1; i <= maxCap; i++) {
      db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s1', ${i}, 0.5)`);
    }
    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s2', ${maxCap + 1}, 0.5)`);
    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s2', ${maxCap + 2}, 0.5)`);

    const removedS2 = wm.enforceMemoryLimit('s2');
    expect(removedS2).toBe(0);

    const removedS1 = wm.enforceMemoryLimit('s1');
    expect(removedS1).toBeGreaterThanOrEqual(1);
    db.close();
  });
});
