// TEST: TYPED TRAVERSAL — D3 Phase A (REQ-D3-001 + REQ-D3-002)
// ───────────────────────────────────────────────────────────────
// Tests for Sparse-First Graph Policy (REQ-D3-001) and
// Intent-Aware Edge Traversal (REQ-D3-002), gated by SPECKIT_TYPED_TRAVERSAL.
// ───────────────────────────────────────────────────────────────
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import * as causalBoost from '../lib/search/causal-boost';
import type { RankedSearchResult } from '../lib/search/causal-boost';

// ───────────────────────────────────────────────────────────────
// HELPERS
// ───────────────────────────────────────────────────────────────

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

function seedMemories(db: Database.Database, count: number = 10): void {
  const values = Array.from({ length: count }, (_, i) =>
    `(${i + 1}, 'spec', '/tmp/${i + 1}.md', 'Memory ${i + 1}', 'important', '[]')`
  ).join(', ');
  db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title, importance_tier, trigger_phrases)
    VALUES ${values}
  `).run();
}

function makeResults(count: number, startScore: number = 0.9): RankedSearchResult[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    score: startScore - i * 0.05,
  }));
}

// ───────────────────────────────────────────────────────────────
// SUITE 1: REQ-D3-001 — Sparse-First Policy
// ───────────────────────────────────────────────────────────────

describe('REQ-D3-001: Sparse-First Policy', () => {
  const prevFlag = process.env.SPECKIT_TYPED_TRAVERSAL;
  const prevCausalFlag = process.env.SPECKIT_CAUSAL_BOOST;
  let db: Database.Database | null = null;

  beforeEach(() => {
    process.env.SPECKIT_CAUSAL_BOOST = 'true';
    process.env.SPECKIT_TYPED_TRAVERSAL = 'true';
    db = createDb();
    seedMemories(db, 6);
    db.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, strength)
      VALUES ('1', '2', 'caused', 1.0), ('2', '3', 'supports', 1.0)
    `).run();
  });

  afterEach(() => {
    db?.close();
    if (prevFlag === undefined) delete process.env.SPECKIT_TYPED_TRAVERSAL;
    else process.env.SPECKIT_TYPED_TRAVERSAL = prevFlag;
    if (prevCausalFlag === undefined) delete process.env.SPECKIT_CAUSAL_BOOST;
    else process.env.SPECKIT_CAUSAL_BOOST = prevCausalFlag;
  });

  it('isSparseMode returns false when flag is OFF', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'false';
    expect(causalBoost.isSparseMode(0.1)).toBe(false);
    expect(causalBoost.isSparseMode(0.9)).toBe(false);
  });

  it('isSparseMode returns false when density >= 0.5, even with flag ON', () => {
    expect(causalBoost.isSparseMode(0.5)).toBe(false);
    expect(causalBoost.isSparseMode(1.0)).toBe(false);
    expect(causalBoost.isSparseMode(0.7)).toBe(false);
  });

  it('isSparseMode returns true when flag is ON and density < 0.5', () => {
    expect(causalBoost.isSparseMode(0.0)).toBe(true);
    expect(causalBoost.isSparseMode(0.1)).toBe(true);
    expect(causalBoost.isSparseMode(0.499)).toBe(true);
  });

  it('isSparseMode returns false when density is not a number', () => {
    expect(causalBoost.isSparseMode(undefined)).toBe(false);
    expect(causalBoost.isSparseMode(NaN)).toBe(false);
    expect(causalBoost.isSparseMode(Infinity)).toBe(false);
  });

  it('sparse mode: traversal depth = 1 — 2-hop neighbors NOT reached', () => {
    // With density < 0.5, only 1-hop neighbors should be reached.
    // Node 1 is the seed. Node 2 is 1-hop away. Node 3 is 2-hops away.
    const results = makeResults(3);
    const { metadata } = causalBoost.applyCausalBoost(results, { graphDensity: 0.3 });

    expect(metadata.sparseModeActive).toBe(true);
    expect(metadata.traversalDepth).toBe(1);
  });

  it('sparse mode: 1-hop typed expansion reaches direct neighbor', () => {
    // Node 1 → Node 2 (1-hop). With sparse mode (depth=1), node 2 should be boosted.
    const results = [{ id: 1, score: 0.9 }];
    const { results: boosted, metadata } = causalBoost.applyCausalBoost(
      results as RankedSearchResult[],
      { graphDensity: 0.2 }
    );

    expect(metadata.sparseModeActive).toBe(true);
    // Node 2 should be injected as a causal neighbor at hop 1
    const injected = boosted.find((r) => r.id === 2);
    expect(injected).toBeDefined();
  });

  it('dense mode (density >= 0.5): traversal depth = MAX_HOPS (2)', () => {
    const results = makeResults(3);
    const { metadata } = causalBoost.applyCausalBoost(results, { graphDensity: 0.8 });

    expect(metadata.sparseModeActive).toBe(false);
    expect(metadata.traversalDepth).toBe(2);
  });

  it('sparse mode metadata: sparseModeActive is false when flag is OFF', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'false';
    const results = makeResults(3);
    const { metadata } = causalBoost.applyCausalBoost(results, { graphDensity: 0.1 });

    // Flag off: sparse mode should not be active
    expect(metadata.sparseModeActive).toBe(false);
    expect(metadata.traversalDepth).toBe(2);
  });

  it('SPECKIT_TYPED_TRAVERSAL OFF: no changes to existing getNeighborBoosts behavior', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'false';
    // 1-hop and 2-hop should both be reachable with original MAX_HOPS=2
    const boosts = causalBoost.getNeighborBoosts([1]);
    expect(boosts.get(2)?.boost).toBeCloseTo(0.05, 5); // 1-hop neighbor
    expect(boosts.get(2)?.hopCount).toBe(1);
    expect(boosts.get(3)?.boost).toBeCloseTo(0.025, 5); // 2-hop neighbor
    expect(boosts.get(3)?.hopCount).toBe(2);
  });
});

// ───────────────────────────────────────────────────────────────
// SUITE 2: REQ-D3-002 — Intent-Aware Edge Traversal
// ───────────────────────────────────────────────────────────────

describe('REQ-D3-002: Intent-Aware Edge Traversal', () => {
  const prevFlag = process.env.SPECKIT_TYPED_TRAVERSAL;

  beforeEach(() => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'true';
  });

  afterEach(() => {
    if (prevFlag === undefined) delete process.env.SPECKIT_TYPED_TRAVERSAL;
    else process.env.SPECKIT_TYPED_TRAVERSAL = prevFlag;
  });

  // --- Intent-to-edge priority mapping ---

  it('fix_bug: CORRECTION (supersedes) is highest priority', () => {
    const supersedes = causalBoost.resolveEdgePrior('supersedes', 'fix_bug');
    const dependsOn = causalBoost.resolveEdgePrior('caused', 'fix_bug');
    const random = causalBoost.resolveEdgePrior('supports', 'fix_bug');

    expect(supersedes).toBe(1.0); // CORRECTION → supersedes → tier 0
    expect(dependsOn).toBeGreaterThan(random);
  });

  it('fix_bug: CORRECTION covers contradicts as well', () => {
    const contradicts = causalBoost.resolveEdgePrior('contradicts', 'fix_bug');
    // CORRECTION alias covers both supersedes and contradicts at tier 0
    expect(contradicts).toBe(1.0);
  });

  it('add_feature: EXTENDS (enabled, derived_from) is highest priority', () => {
    const enabled = causalBoost.resolveEdgePrior('enabled', 'add_feature');
    const derivedFrom = causalBoost.resolveEdgePrior('derived_from', 'add_feature');
    const caused = causalBoost.resolveEdgePrior('caused', 'add_feature');

    expect(enabled).toBe(1.0);    // EXTENDS → enabled → tier 0
    expect(derivedFrom).toBe(1.0); // EXTENDS → derived_from → tier 0
    expect(caused).toBe(0.75);     // DEPENDS_ON → caused → tier 1
  });

  it('find_decision: PREFERENCE (supports) is highest priority', () => {
    const supports = causalBoost.resolveEdgePrior('supports', 'find_decision');
    const supersedes = causalBoost.resolveEdgePrior('supersedes', 'find_decision');

    expect(supports).toBe(1.0); // PREFERENCE → supports → tier 0
    expect(supersedes).toBe(0.75); // CORRECTION → supersedes/contradicts → tier 1
  });

  it('unknown intent falls back to DEFAULT_EDGE_PRIORITY', () => {
    const caused = causalBoost.resolveEdgePrior('caused', 'unknown_intent');
    const supports = causalBoost.resolveEdgePrior('supports', 'unknown_intent');

    // DEFAULT: ['caused', 'enabled', 'derived_from', 'supports', 'supersedes', 'contradicts']
    expect(caused).toBe(1.0);   // tier 0
    expect(supports).toBe(0.5); // tier 2 (index >= 2)
  });

  it('resolveEdgePrior returns 1.0 when SPECKIT_TYPED_TRAVERSAL is OFF', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'false';
    // All relations should return 1.0 (no intent weighting)
    expect(causalBoost.resolveEdgePrior('supports', 'fix_bug')).toBe(1.0);
    expect(causalBoost.resolveEdgePrior('caused', 'add_feature')).toBe(1.0);
    expect(causalBoost.resolveEdgePrior('supersedes', 'find_decision')).toBe(1.0);
  });

  // --- Hop decay ---

  it('computeHopDecay: 1-hop = 1.0, 2-hop = 0.5', () => {
    expect(causalBoost.computeHopDecay(1)).toBeCloseTo(1.0, 6);
    expect(causalBoost.computeHopDecay(2)).toBeCloseTo(0.5, 6);
  });

  it('computeHopDecay: invalid inputs return 0', () => {
    expect(causalBoost.computeHopDecay(0)).toBe(0);
    expect(causalBoost.computeHopDecay(-1)).toBe(0);
    expect(causalBoost.computeHopDecay(NaN)).toBe(0);
  });

  // --- Traversal scoring formula ---

  it('computeIntentTraversalScore: formula = seedScore * edgePrior * hopDecay * freshness', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'true';
    // fix_bug, supersedes (CORRECTION tier 0 → edgePrior=1.0), 1-hop (decay=1.0), freshness=0.8
    const score = causalBoost.computeIntentTraversalScore(0.9, 'supersedes', 1, 0.8, 'fix_bug');
    // 0.9 * 1.0 * 1.0 * 0.8 = 0.72
    expect(score).toBeCloseTo(0.72, 6);
  });

  it('computeIntentTraversalScore: 2-hop with lower priority edge', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'true';
    // add_feature, supports (tier 2 → edgePrior=0.5), 2-hop (decay=0.5), freshness=1.0
    const score = causalBoost.computeIntentTraversalScore(0.8, 'supports', 2, 1.0, 'add_feature');
    // 0.8 * 0.5 * 0.5 * 1.0 = 0.2
    expect(score).toBeCloseTo(0.2, 6);
  });

  it('computeIntentTraversalScore: freshness=0 yields 0', () => {
    const score = causalBoost.computeIntentTraversalScore(0.9, 'caused', 1, 0, 'understand');
    expect(score).toBe(0);
  });

  it('computeIntentTraversalScore: seedScore=0 yields 0', () => {
    const score = causalBoost.computeIntentTraversalScore(0, 'caused', 1, 1.0, 'understand');
    expect(score).toBe(0);
  });

  // --- Integration: intent-aware vs classic behavior ---

  it('SPECKIT_TYPED_TRAVERSAL OFF: applyCausalBoost does not set intentUsed', () => {
    process.env.SPECKIT_TYPED_TRAVERSAL = 'false';
    process.env.SPECKIT_CAUSAL_BOOST = 'true';

    const localDb = createDb();
    seedMemories(localDb, 4);
    localDb.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, strength)
      VALUES ('1', '2', 'caused', 1.0)
    `).run();
    causalBoost.init(localDb);

    const results = makeResults(2);
    const { metadata } = causalBoost.applyCausalBoost(results, { intent: 'fix_bug' });
    expect(metadata.intentUsed).toBeUndefined();

    localDb.close();
    delete process.env.SPECKIT_CAUSAL_BOOST;
  });

  it('SPECKIT_TYPED_TRAVERSAL ON: applyCausalBoost sets intentUsed to passed intent', () => {
    process.env.SPECKIT_CAUSAL_BOOST = 'true';

    const localDb = createDb();
    seedMemories(localDb, 4);
    localDb.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, strength)
      VALUES ('1', '2', 'supersedes', 1.0)
    `).run();
    causalBoost.init(localDb);

    const results = makeResults(2);
    const { metadata } = causalBoost.applyCausalBoost(results, {
      intent: 'fix_bug',
      graphDensity: 0.8,
    });
    expect(metadata.intentUsed).toBe('fix_bug');

    localDb.close();
    delete process.env.SPECKIT_CAUSAL_BOOST;
  });
});

// ───────────────────────────────────────────────────────────────
// SUITE 3: Feature Flag OFF — No behavioral changes
// ───────────────────────────────────────────────────────────────

describe('Feature flag OFF: SPECKIT_TYPED_TRAVERSAL=false — no regressions', () => {
  const prevFlag = process.env.SPECKIT_TYPED_TRAVERSAL;
  const prevCausalFlag = process.env.SPECKIT_CAUSAL_BOOST;
  let db: Database.Database | null = null;

  beforeEach(() => {
    process.env.SPECKIT_CAUSAL_BOOST = 'true';
    process.env.SPECKIT_TYPED_TRAVERSAL = 'false';
    db = createDb();
    seedMemories(db, 5);
    db.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, strength)
      VALUES ('1', '2', 'caused', 1.0), ('2', '3', 'supports', 1.0)
    `).run();
  });

  afterEach(() => {
    db?.close();
    if (prevFlag === undefined) delete process.env.SPECKIT_TYPED_TRAVERSAL;
    else process.env.SPECKIT_TYPED_TRAVERSAL = prevFlag;
    if (prevCausalFlag === undefined) delete process.env.SPECKIT_CAUSAL_BOOST;
    else process.env.SPECKIT_CAUSAL_BOOST = prevCausalFlag;
  });

  it('classic 2-hop traversal still works when flag is OFF', () => {
    const boosts = causalBoost.getNeighborBoosts([1]);
    // 1-hop: node 2 → 0.05, 2-hop: node 3 → 0.025
    expect(boosts.get(2)?.boost).toBeCloseTo(0.05, 5);
    expect(boosts.get(2)?.hopCount).toBe(1);
    expect(boosts.get(3)?.boost).toBeCloseTo(0.025, 5);
    expect(boosts.get(3)?.hopCount).toBe(2);
  });

  it('applyCausalBoost with flag OFF ignores graphDensity and intent options', () => {
    const results = makeResults(2);
    const { results: boostedResults, metadata } = causalBoost.applyCausalBoost(results, {
      graphDensity: 0.1,  // Would trigger sparse mode if flag were ON
      intent: 'fix_bug',
    });

    // Flag is OFF — sparse mode not active, traversalDepth is MAX_HOPS
    expect(metadata.sparseModeActive).toBe(false);
    expect(metadata.traversalDepth).toBe(2);
    expect(metadata.intentUsed).toBeUndefined();

    // Results should still be produced (classic behavior)
    expect(Array.isArray(boostedResults)).toBe(true);
  });

  it('applyCausalBoost with flag OFF: no options object — backward compatible', () => {
    const results = makeResults(2);
    // This is the existing call signature — must not throw
    expect(() => causalBoost.applyCausalBoost(results)).not.toThrow();
  });

  it('RELATION_WEIGHT_MULTIPLIERS: existing constants unmodified', () => {
    expect(causalBoost.RELATION_WEIGHT_MULTIPLIERS['supersedes']).toBe(1.5);
    expect(causalBoost.RELATION_WEIGHT_MULTIPLIERS['contradicts']).toBe(0.8);
    expect(causalBoost.RELATION_WEIGHT_MULTIPLIERS['caused']).toBe(1.0);
  });
});

// ───────────────────────────────────────────────────────────────
// SUITE 4: D3-001 constants exported correctly
// ───────────────────────────────────────────────────────────────

describe('D3 Phase A: exported constants', () => {
  it('SPARSE_DENSITY_THRESHOLD is 0.5', () => {
    expect(causalBoost.SPARSE_DENSITY_THRESHOLD).toBe(0.5);
  });

  it('SPARSE_MAX_HOPS is 1', () => {
    expect(causalBoost.SPARSE_MAX_HOPS).toBe(1);
  });

  it('EDGE_PRIOR_TIERS has 3 entries: 1.0, 0.75, 0.5', () => {
    expect(causalBoost.EDGE_PRIOR_TIERS).toEqual([1.0, 0.75, 0.5]);
  });

  it('INTENT_EDGE_PRIORITY covers fix_bug, add_feature, find_decision', () => {
    expect(causalBoost.INTENT_EDGE_PRIORITY).toHaveProperty('fix_bug');
    expect(causalBoost.INTENT_EDGE_PRIORITY).toHaveProperty('add_feature');
    expect(causalBoost.INTENT_EDGE_PRIORITY).toHaveProperty('find_decision');
  });

  it('EDGE_LABEL_ALIASES covers CORRECTION, DEPENDS_ON, EXTENDS, PREFERENCE', () => {
    expect(causalBoost.EDGE_LABEL_ALIASES).toHaveProperty('CORRECTION');
    expect(causalBoost.EDGE_LABEL_ALIASES).toHaveProperty('DEPENDS_ON');
    expect(causalBoost.EDGE_LABEL_ALIASES).toHaveProperty('EXTENDS');
    expect(causalBoost.EDGE_LABEL_ALIASES).toHaveProperty('PREFERENCE');
  });
});
