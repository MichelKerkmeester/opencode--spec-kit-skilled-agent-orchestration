// TEST: Phase D T037 — Contradiction Detection

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';

vi.mock('../lib/search/search-flags.js', () => ({
  isTemporalEdgesEnabled: vi.fn(() => true),
}));

vi.mock('../lib/graph/temporal-edges.js', () => ({
  invalidateEdge: vi.fn(),
  ensureTemporalColumns: vi.fn(),
}));

import type { ContradictionResult } from '../lib/graph/contradiction-detection.js';
import { detectContradictions } from '../lib/graph/contradiction-detection.js';
import { invalidateEdge } from '../lib/graph/temporal-edges.js';
import { isTemporalEdgesEnabled } from '../lib/search/search-flags.js';

type SqliteDatabase = InstanceType<typeof Database>;

let db: SqliteDatabase;

function createSchema(database: SqliteDatabase): void {
  database.exec(`
    CREATE TABLE causal_edges (
      source_id TEXT,
      target_id TEXT,
      relation TEXT,
      invalid_at TEXT
    );
  `);
}

function insertEdge(
  database: SqliteDatabase,
  sourceId: number,
  targetId: number,
  relation: string,
  invalidAt: string | null = null,
): void {
  database
    .prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, invalid_at)
      VALUES (?, ?, ?, ?)
    `)
    .run(String(sourceId), String(targetId), relation, invalidAt);
}

describe('detectContradictions', () => {
  beforeEach(() => {
    db = new Database(':memory:');
    createSchema(db);
    vi.mocked(isTemporalEdgesEnabled).mockReset();
    vi.mocked(invalidateEdge).mockReset();
    vi.mocked(isTemporalEdgesEnabled).mockReturnValue(true);
  });

  afterEach(() => {
    db.close();
  });

  it('returns empty when feature flag disabled', () => {
    vi.mocked(isTemporalEdgesEnabled).mockReturnValue(false);
    insertEdge(db, 1, 2, 'supports');

    const result = detectContradictions(db, 1, 2, 'contradicts');

    expect(result).toEqual([]);
    expect(invalidateEdge).not.toHaveBeenCalled();
  });

  it('returns empty when no existing edges', () => {
    const result = detectContradictions(db, 1, 2, 'supports');

    expect(result).toEqual([]);
    expect(invalidateEdge).not.toHaveBeenCalled();
  });

  it('detects supersedes contradiction', () => {
    insertEdge(db, 1, 2, 'enabled');

    const result = detectContradictions(db, 1, 2, 'supersedes');
    const expected: ContradictionResult[] = [
      {
        oldEdge: {
          sourceId: 1,
          targetId: 2,
          relation: 'enabled',
        },
        oldSourceId: 1,
        oldTargetId: 2,
        oldRelation: 'enabled',
        reason: "Superseded by new 'supersedes' edge",
      },
    ];

    expect(result).toEqual(expected);
    expect(invalidateEdge).toHaveBeenCalledWith(
      db,
      1,
      2,
      "Superseded by new 'supersedes' edge",
      'enabled',
    );
  });

  it('detects conflicting relation pairs (supports vs contradicts)', () => {
    insertEdge(db, 7, 8, 'supports');

    const result = detectContradictions(db, 7, 8, 'contradicts');

    expect(result).toEqual([
      {
        oldEdge: {
          sourceId: 7,
          targetId: 8,
          relation: 'supports',
        },
        oldSourceId: 7,
        oldTargetId: 8,
        oldRelation: 'supports',
        reason: "Conflicting relations: existing 'supports' vs new 'contradicts'",
      },
    ]);
    expect(invalidateEdge).toHaveBeenCalledWith(
      db,
      7,
      8,
      "Conflicting relations: existing 'supports' vs new 'contradicts'",
      'supports',
    );
  });

  it('does not flag non-conflicting relations', () => {
    insertEdge(db, 9, 10, 'supports');

    const result = detectContradictions(db, 9, 10, 'enabled');

    expect(result).toEqual([]);
    expect(invalidateEdge).not.toHaveBeenCalled();
  });
});
