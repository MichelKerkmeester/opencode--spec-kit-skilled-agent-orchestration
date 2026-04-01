// TEST: Phase D T038 — Usage-Weighted Ranking

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';

vi.mock('../lib/search/search-flags.js', () => ({
  isUsageRankingEnabled: vi.fn(() => true),
}));

import { getAccessCount, incrementAccessCount, ensureUsageColumn } from '../lib/graph/usage-tracking.js';
import { computeUsageBoost } from '../lib/graph/usage-ranking-signal.js';
import { isUsageRankingEnabled } from '../lib/search/search-flags.js';

type SqliteDatabase = InstanceType<typeof Database>;

let db: SqliteDatabase;

function createSchema(database: SqliteDatabase): void {
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      access_count INTEGER DEFAULT 0
    );
  `);
}

function insertMemory(database: SqliteDatabase, id: number, title: string): void {
  database
    .prepare(`
      INSERT INTO memory_index (id, title)
      VALUES (?, ?)
    `)
    .run(id, title);
}

describe('usage-weighted ranking', () => {
  beforeEach(() => {
    db = new Database(':memory:');
    createSchema(db);
    vi.mocked(isUsageRankingEnabled).mockReset();
    vi.mocked(isUsageRankingEnabled).mockReturnValue(true);
  });

  afterEach(() => {
    db.close();
  });

  it('ensureUsageColumn is idempotent', () => {
    expect(() => {
      ensureUsageColumn(db);
      ensureUsageColumn(db);
    }).not.toThrow();

    const columns = db.prepare(`PRAGMA table_info(memory_index)`).all() as Array<{ name: string }>;
    expect(columns.filter((column) => column.name === 'access_count')).toHaveLength(1);
  });

  it('incrementAccessCount increments from 0', () => {
    insertMemory(db, 1, 'Graph ranking memory');

    incrementAccessCount(db, 1);

    expect(getAccessCount(db, 1)).toBe(1);
  });

  it('getAccessCount returns 0 for missing ID', () => {
    expect(getAccessCount(db, 999)).toBe(0);
  });

  it('computeUsageBoost returns 0 for count=0', () => {
    expect(computeUsageBoost(0, 100)).toBe(0);
  });

  it('computeUsageBoost returns max 0.10 for very high counts', () => {
    expect(computeUsageBoost(1_000_000, 1_000)).toBeCloseTo(0.10, 12);
  });

  it('computeUsageBoost returns proportional value for moderate counts', () => {
    const accessCount = 25;
    const maxAccess = 100;
    const expectedBoost = (Math.log1p(accessCount) / Math.log1p(maxAccess)) * 0.10;

    expect(computeUsageBoost(accessCount, maxAccess)).toBeCloseTo(expectedBoost, 12);
  });
});
