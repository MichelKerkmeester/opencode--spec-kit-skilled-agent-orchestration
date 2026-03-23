// TEST: CAUSAL BOOST (T038-T044)
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import * as causalBoost from '../lib/search/causal-boost';
import type { RankedSearchResult } from '../lib/search/causal-boost';

function createDb() {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      extracted_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT
    );

    CREATE TABLE IF NOT EXISTS weight_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
      old_strength REAL NOT NULL,
      new_strength REAL NOT NULL,
      changed_by TEXT DEFAULT 'manual',
      changed_at TEXT DEFAULT (datetime('now')),
      reason TEXT
    );

    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT,
      title TEXT,
      importance_tier TEXT,
      trigger_phrases TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  causalBoost.init(db);
  return db;
}

describe('T038-T044 causal boost', () => {
  let db: Database.Database | null = null;
  const previousFlag = process.env.SPECKIT_CAUSAL_BOOST;

  beforeEach(() => {
    process.env.SPECKIT_CAUSAL_BOOST = 'true';
    db = createDb();
    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases)
      VALUES
      (1, 'spec', '/tmp/a.md', 'A', 'important', '[]'),
      (2, 'spec', '/tmp/b.md', 'B', 'important', '[]'),
      (3, 'spec', '/tmp/c.md', 'C', 'important', '[]'),
      (4, 'spec', '/tmp/d.md', 'D', 'important', '[]')
    `).run();
  });

  afterEach(() => {
    if (db) db.close();
    if (previousFlag === undefined) {
      delete process.env.SPECKIT_CAUSAL_BOOST;
    } else {
      process.env.SPECKIT_CAUSAL_BOOST = previousFlag;
    }
  });

  it('T039/T043: computes 1-hop and 2-hop neighbors from causal_edges', () => {
    db?.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation)
      VALUES ('1', '2', 'caused'), ('2', '3', 'supports')
    `).run();

    const boosts = causalBoost.getNeighborBoosts([1]);
    expect(boosts.get(2)?.boost).toBeCloseTo(0.05, 6);
    expect(boosts.get(2)?.hopCount).toBe(1);
    expect(boosts.get(3)?.boost).toBeCloseTo(0.025, 6);
    expect(boosts.get(3)?.hopCount).toBe(2);
  });

  it('T040/T044: applies bounded boost and deduplicates existing semantic results', () => {
    db?.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation)
      VALUES ('1', '2', 'caused'), ('1', '3', 'supports')
    `).run();

    const baseResults = [
      { id: 1, score: 0.9 },
      { id: 2, score: 0.6, sessionBoost: 0.1 },
    ];

    const { results, metadata } = causalBoost.applyCausalBoost(baseResults as unknown as RankedSearchResult[]);
    const idList = results.map((item) => item.id);

    expect(metadata.applied).toBe(true);
    expect(metadata.boostedCount).toBeGreaterThanOrEqual(1);
    expect(idList.filter((id) => id === 2)).toHaveLength(1);
    expect(idList.includes(3)).toBe(true);
  });

  it('T043: handles no edges and cyclic edges without duplication', () => {
    const empty = causalBoost.getNeighborBoosts([4]);
    expect(empty.size).toBe(0);

    db?.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation)
      VALUES ('1', '2', 'caused'), ('2', '1', 'supports')
    `).run();

    const cycle = causalBoost.getNeighborBoosts([1]);
    expect(cycle.get(2)?.boost).toBeCloseTo(0.05, 6);
  });
});

describe('T008 — Seed cap and multiplier precedence', () => {
  it('RELATION_WEIGHT_MULTIPLIERS covers all relation types from causal-edges', () => {
    const boostRelations = Object.keys(causalBoost.RELATION_WEIGHT_MULTIPLIERS);
    const expectedRelations = ['supersedes', 'contradicts', 'caused', 'enabled', 'derived_from', 'supports'];
    expect(boostRelations).toEqual(expect.arrayContaining(expectedRelations));
  });

  it('seed cap limits number of seed nodes used for graph walk', () => {
    const localDb = createDb();
    process.env.SPECKIT_CAUSAL_BOOST = 'true';
    // Disable typed traversal to test classic boost values (SPECKIT_TYPED_TRAVERSAL now defaults ON)
    const prevTyped = process.env.SPECKIT_TYPED_TRAVERSAL;
    process.env.SPECKIT_TYPED_TRAVERSAL = 'false';
    localDb.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases)
      VALUES
      (1, 'spec', '/tmp/1.md', '1', 'important', '[]'),
      (2, 'spec', '/tmp/2.md', '2', 'important', '[]'),
      (3, 'spec', '/tmp/3.md', '3', 'important', '[]'),
      (4, 'spec', '/tmp/4.md', '4', 'important', '[]'),
      (5, 'spec', '/tmp/5.md', '5', 'important', '[]'),
      (6, 'spec', '/tmp/6.md', '6', 'important', '[]'),
      (7, 'spec', '/tmp/7.md', '7', 'important', '[]'),
      (30, 'spec', '/tmp/30.md', '30', 'important', '[]'),
      (31, 'spec', '/tmp/31.md', '31', 'important', '[]')
    `).run();
    localDb.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, strength)
      VALUES
      ('5', '31', 'caused', 1.0),
      ('6', '30', 'caused', 1.0)
    `).run();
    causalBoost.init(localDb);

    const baseResults = Array.from({ length: 24 }, (_, index) => ({
      id: index + 1,
      score: 1 - index * 0.01,
    }));

    const { results } = causalBoost.applyCausalBoost(baseResults as RankedSearchResult[]);
    const injectedIds = results.filter((item) => item.injectedByCausalBoost).map((item) => item.id);

    expect(injectedIds).toContain(31);
    expect(injectedIds).not.toContain(30);

    const injectedResult = results.find((item) => item.id === 31);
    expect(injectedResult?.causalBoost).toBeCloseTo(0.05, 6);

    // Restore SPECKIT_TYPED_TRAVERSAL
    if (prevTyped === undefined) delete process.env.SPECKIT_TYPED_TRAVERSAL;
    else process.env.SPECKIT_TYPED_TRAVERSAL = prevTyped;
  });

  it('relation multipliers change boost precedence behavior', () => {
    const localDb = createDb();
    process.env.SPECKIT_CAUSAL_BOOST = 'true';
    localDb.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, strength)
      VALUES ('1', '2', 'supersedes', 1.0), ('1', '3', 'contradicts', 1.0)
    `).run();
    causalBoost.init(localDb);

    const boosts = causalBoost.getNeighborBoosts([1]);

    expect(boosts.get(2)?.boost).toBeCloseTo(0.05 * 1.5, 6);
    expect(boosts.get(3)?.boost).toBeCloseTo(0.05 * 0.8, 6);
    expect((boosts.get(2)?.boost ?? 0)).toBeGreaterThan(boosts.get(3)?.boost ?? 0);
  });
});
