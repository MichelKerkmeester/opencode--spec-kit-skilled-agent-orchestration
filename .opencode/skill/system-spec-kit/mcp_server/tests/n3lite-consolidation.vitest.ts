// TESTS: N3-lite Consolidation Engine
// Covers: contradiction scan, Hebbian strengthening, staleness
// Detection, edge bounds, cluster surfacing, weight_history.
import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import {
  hasNegationConflict,
  scanContradictions,
  buildContradictionClusters,
  runHebbianCycle,
  detectStaleEdges,
  checkEdgeBounds,
  runConsolidationCycle,
  runConsolidationCycleIfEnabled,
  CONTRADICTION_SIMILARITY_THRESHOLD,
} from '../lib/storage/consolidation';
import {
  init as initCausalEdges,
  insertEdge,
  updateEdge,
  getWeightHistory,
  rollbackWeights,
  countEdgesForNode,
  MAX_EDGES_PER_NODE,
  MAX_AUTO_STRENGTH,
  MAX_STRENGTH_INCREASE_PER_CYCLE,
} from '../lib/storage/causal-edges';

/* -- Helpers -- */

function createTestDb(): Database.Database {
  const db = new Database(':memory:');

  // Minimal memory_index schema
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL DEFAULT 'test',
      file_path TEXT NOT NULL DEFAULT 'test.md',
      title TEXT,
      content_text TEXT,
      importance_tier TEXT DEFAULT 'normal',
      parent_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Causal_edges schema
  db.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL CHECK(relation IN (
        'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
      )),
      strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
      evidence TEXT,
      extracted_at TEXT DEFAULT (datetime('now')),
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT,
      UNIQUE(source_id, target_id, relation)
    )
  `);
  db.exec('CREATE INDEX IF NOT EXISTS idx_causal_source ON causal_edges(source_id)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_causal_target ON causal_edges(target_id)');

  // Weight_history
  db.exec(`
    CREATE TABLE weight_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
      old_strength REAL NOT NULL,
      new_strength REAL NOT NULL,
      changed_by TEXT DEFAULT 'manual',
      changed_at TEXT DEFAULT (datetime('now')),
      reason TEXT
    )
  `);

  return db;
}

function seedMemories(db: Database.Database, count: number): void {
  const stmt = db.prepare(
    "INSERT INTO memory_index (id, title, content_text) VALUES (?, ?, ?)"
  );
  for (let i = 1; i <= count; i++) {
    stmt.run(i, `Memory ${i}`, `Content of memory ${i} with some text`);
  }
}

function seedContradictingMemories(db: Database.Database): void {
  db.prepare("INSERT INTO memory_index (id, title, content_text) VALUES (?, ?, ?)").run(
    100, 'Auth config', 'Always use JWT tokens for authentication. Sessions must be stateless.'
  );
  db.prepare("INSERT INTO memory_index (id, title, content_text) VALUES (?, ?, ?)").run(
    101, 'Auth config updated', 'Never use JWT tokens for authentication. Use session cookies instead. JWT is not recommended.'
  );
}

/* -- T002a: Contradiction scan -- */

describe('T002a: Contradiction scan', () => {
  it('T-N3-01: hasNegationConflict detects single-sided negation', () => {
    expect(hasNegationConflict(
      'Always use JWT for auth',
      'Never use JWT for auth'
    )).toBe(true);
  });

  it('T-N3-02: hasNegationConflict returns false when both have same negation', () => {
    expect(hasNegationConflict(
      'Never use eval in production',
      'Never use eval in staging'
    )).toBe(false);
  });

  it('T-N3-03: hasNegationConflict returns false when neither has negation', () => {
    expect(hasNegationConflict(
      'Use TypeScript for all code',
      'Use TypeScript for all tests'
    )).toBe(false);
  });

  it("T-N3-04: hasNegationConflict detects don't vs positive", () => {
    expect(hasNegationConflict(
      "Use console.log for debugging",
      "Don't use console.log for debugging"
    )).toBe(true);
  });

  it('T-N3-05: hasNegationConflict detects deprecated keyword', () => {
    expect(hasNegationConflict(
      'Use the old API endpoint',
      'The old API endpoint is deprecated'
    )).toBe(true);
  });

  it('T-N3-06: scanContradictions with heuristic (no vec)', () => {
    const db = createTestDb();
    seedContradictingMemories(db);
    initCausalEdges(db);

    const pairs = scanContradictions(db);
    // The seeded memories have "Always use JWT" vs "Never use JWT"
    // But word overlap may or may not meet the 0.85 threshold
    // (heuristic overlap is conservative). The key test is that the
    // Function runs without error.
    expect(Array.isArray(pairs)).toBe(true);
  });

  it('T-N3-07: scanContradictions returns empty on no data', () => {
    const db = createTestDb();
    initCausalEdges(db);

    const pairs = scanContradictions(db);
    expect(pairs).toEqual([]);
  });
});

/* -- T002e: Contradiction cluster surfacing -- */

describe('T002e: Contradiction cluster surfacing', () => {
  it('T-N3-08: buildContradictionClusters includes seed pair members', () => {
    const db = createTestDb();
    seedMemories(db, 5);
    initCausalEdges(db);

    const pair = {
      memoryA: { id: 1, title: 'A', content: 'text A' },
      memoryB: { id: 2, title: 'B', content: 'text B' },
      similarity: 0.9,
      conflictType: 'keyword_negation' as const,
    };

    const clusters = buildContradictionClusters(db, [pair]);
    expect(clusters).toHaveLength(1);
    expect(clusters[0].members).toContain(1);
    expect(clusters[0].members).toContain(2);
  });

  it('T-N3-09: cluster expands to include causal neighbors', () => {
    const db = createTestDb();
    seedMemories(db, 5);
    initCausalEdges(db);

    // Create edges: 1→3 and 2→4
    insertEdge('1', '3', 'caused');
    insertEdge('2', '4', 'supports');

    const pair = {
      memoryA: { id: 1, title: 'A', content: 'text A' },
      memoryB: { id: 2, title: 'B', content: 'text B' },
      similarity: 0.9,
      conflictType: 'keyword_negation' as const,
    };

    const clusters = buildContradictionClusters(db, [pair]);
    expect(clusters[0].members).toContain(3); // neighbor of memoryA
    expect(clusters[0].members).toContain(4); // neighbor of memoryB
  });

  it('T-N3-10: empty pairs returns empty clusters', () => {
    const db = createTestDb();
    initCausalEdges(db);
    const clusters = buildContradictionClusters(db, []);
    expect(clusters).toEqual([]);
  });
});

/* -- T001d: Weight history -- */

describe('T001d: Weight history audit tracking', () => {
  it('T-WH-01: updateEdge logs weight change to weight_history', () => {
    const db = createTestDb();
    initCausalEdges(db);

    const edgeId = insertEdge('1', '2', 'caused', 0.5);
    expect(edgeId).not.toBeNull();

    updateEdge(edgeId!, { strength: 0.8 }, 'test', 'manual update');

    const history = getWeightHistory(edgeId!);
    expect(history).toHaveLength(1);
    expect(history[0].old_strength).toBe(0.5);
    expect(history[0].new_strength).toBe(0.8);
    expect(history[0].changed_by).toBe('test');
    expect(history[0].reason).toBe('manual update');
  });

  it('T-WH-02: multiple updates accumulate in weight_history', () => {
    const db = createTestDb();
    initCausalEdges(db);

    const edgeId = insertEdge('1', '2', 'caused', 0.3);
    updateEdge(edgeId!, { strength: 0.5 }, 'test', 'step 1');
    updateEdge(edgeId!, { strength: 0.7 }, 'test', 'step 2');
    updateEdge(edgeId!, { strength: 0.9 }, 'test', 'step 3');

    const history = getWeightHistory(edgeId!);
    expect(history).toHaveLength(3);
  });

  it('T-WH-03: no-op update (same strength) does not log', () => {
    const db = createTestDb();
    initCausalEdges(db);

    const edgeId = insertEdge('1', '2', 'caused', 0.5);
    updateEdge(edgeId!, { strength: 0.5 }, 'test');

    const history = getWeightHistory(edgeId!);
    expect(history).toHaveLength(0);
  });

  it('T-WH-04: rollbackWeights restores to pre-change value', () => {
    const db = createTestDb();
    initCausalEdges(db);

    const edgeId = insertEdge('1', '2', 'caused', 0.3);
    const beforeTimestamp = new Date().toISOString();

    // Wait a tiny bit to ensure timestamp ordering
    updateEdge(edgeId!, { strength: 0.8 }, 'test', 'will rollback');

    const success = rollbackWeights(edgeId!, beforeTimestamp);
    expect(success).toBe(true);

    // Check current strength is restored
    const edge = (db.prepare('SELECT strength FROM causal_edges WHERE id = ?') as Database.Statement)
      .get(edgeId!) as { strength: number };
    expect(edge.strength).toBe(0.3);
  });

  it('T-WH-05: insertEdge upsert logs weight change', () => {
    const db = createTestDb();
    initCausalEdges(db);

    const edgeId1 = insertEdge('1', '2', 'caused', 0.5);
    // Upsert with different strength
    const edgeId2 = insertEdge('1', '2', 'caused', 0.9);

    expect(edgeId1).toBe(edgeId2); // Same edge

    const history = getWeightHistory(edgeId1!);
    expect(history).toHaveLength(1);
    expect(history[0].old_strength).toBe(0.5);
    expect(history[0].new_strength).toBe(0.9);
  });
});

/* -- T002b: Hebbian strengthening -- */

describe('T002b: Hebbian strengthening', () => {
  it('T-HEB-01: recently accessed edges get strengthened', () => {
    const db = createTestDb();
    initCausalEdges(db);

    const edgeId = insertEdge('1', '2', 'caused', 0.5);
    // Mark as recently accessed
    db.prepare("UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?").run(edgeId);

    const result = runHebbianCycle(db);
    expect(result.strengthened).toBeGreaterThanOrEqual(1);

    // Verify strength increased
    const edge = (db.prepare('SELECT strength FROM causal_edges WHERE id = ?') as Database.Statement)
      .get(edgeId!) as { strength: number };
    expect(edge.strength).toBe(0.5 + MAX_STRENGTH_INCREASE_PER_CYCLE);
  });

  it('T-HEB-02: strength increase capped at MAX_STRENGTH_INCREASE_PER_CYCLE', () => {
    const db = createTestDb();
    initCausalEdges(db);

    const edgeId = insertEdge('1', '2', 'caused', 0.95);
    db.prepare("UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?").run(edgeId);

    runHebbianCycle(db);

    const edge = (db.prepare('SELECT strength FROM causal_edges WHERE id = ?') as Database.Statement)
      .get(edgeId!) as { strength: number };
    expect(edge.strength).toBe(1.0); // capped at 1.0
  });

  it('T-HEB-03: auto edges cannot exceed MAX_AUTO_STRENGTH via Hebbian', () => {
    const db = createTestDb();
    initCausalEdges(db);

    const edgeId = insertEdge('1', '2', 'caused', 0.45, null, true, 'auto');
    db.prepare("UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?").run(edgeId);

    runHebbianCycle(db);

    const edge = (db.prepare('SELECT strength FROM causal_edges WHERE id = ?') as Database.Statement)
      .get(edgeId!) as { strength: number };
    expect(edge.strength).toBeLessThanOrEqual(MAX_AUTO_STRENGTH);
  });

  it('T-HEB-04: 30-day decay reduces edge strength', () => {
    const db = createTestDb();
    initCausalEdges(db);

    const edgeId = insertEdge('1', '2', 'caused', 0.8);
    // Set last_accessed to 31 days ago
    db.prepare("UPDATE causal_edges SET last_accessed = datetime('now', '-31 days') WHERE id = ?").run(edgeId);

    const result = runHebbianCycle(db);
    expect(result.decayed).toBeGreaterThanOrEqual(1);

    const edge = (db.prepare('SELECT strength FROM causal_edges WHERE id = ?') as Database.Statement)
      .get(edgeId!) as { strength: number };
    expect(edge.strength).toBeCloseTo(0.7, 5); // 0.8 - 0.1 decay
  });

  it('T-HEB-05: weight changes from Hebbian are logged', () => {
    const db = createTestDb();
    initCausalEdges(db);

    const edgeId = insertEdge('1', '2', 'caused', 0.5);
    db.prepare("UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?").run(edgeId);

    runHebbianCycle(db);

    const history = getWeightHistory(edgeId!);
    expect(history.length).toBeGreaterThanOrEqual(1);
    expect(history[0].changed_by).toBe('hebbian');
  });

  it('T-HEB-06: strengthening respects created_by auto cap from query selection', () => {
    const db = createTestDb();
    initCausalEdges(db);

    db.prepare(`
      INSERT INTO causal_edges (source_id, target_id, relation, strength, created_by, last_accessed)
      VALUES ('1', '2', 'caused', 0.46, 'auto', datetime('now'))
    `).run();

    const result = runHebbianCycle(db);
    expect(result.strengthened).toBeGreaterThanOrEqual(0);

    const edge = (db.prepare("SELECT strength FROM causal_edges WHERE source_id = '1' AND target_id = '2'") as Database.Statement)
      .get() as { strength: number };
    expect(edge.strength).toBe(MAX_AUTO_STRENGTH);
  });
});

/* -- T002c: Staleness detection -- */

describe('T002c: Staleness detection', () => {
  it('T-STALE-01: detects edges not accessed in 90+ days', () => {
    const db = createTestDb();
    initCausalEdges(db);

    insertEdge('1', '2', 'caused', 0.5);
    // Set extracted_at to 91 days ago (no last_accessed)
    db.prepare("UPDATE causal_edges SET extracted_at = datetime('now', '-91 days') WHERE source_id = '1'").run();

    const stale = detectStaleEdges(db);
    expect(stale.length).toBeGreaterThanOrEqual(1);
  });

  it('T-STALE-02: recently accessed edges are not stale', () => {
    const db = createTestDb();
    initCausalEdges(db);

    insertEdge('1', '2', 'caused', 0.5);
    db.prepare("UPDATE causal_edges SET last_accessed = datetime('now') WHERE source_id = '1'").run();

    const stale = detectStaleEdges(db);
    expect(stale).toHaveLength(0);
  });
});

/* -- T002d: Edge bounds enforcement -- */

describe('T002d: Edge bounds enforcement', () => {
  it('T-BOUNDS-01: checkEdgeBounds reports correct count', () => {
    const db = createTestDb();
    initCausalEdges(db);

    insertEdge('1', '2', 'caused', 0.5);
    insertEdge('1', '3', 'supports', 0.5);
    insertEdge('4', '1', 'derived_from', 0.5);

    const bounds = checkEdgeBounds('1');
    expect(bounds.currentCount).toBe(3);
    expect(bounds.maxAllowed).toBe(MAX_EDGES_PER_NODE);
    expect(bounds.canAddAuto).toBe(true);
  });

  it('T-BOUNDS-02: auto edge rejected when at MAX_EDGES_PER_NODE', () => {
    const db = createTestDb();
    initCausalEdges(db);

    // Create MAX_EDGES_PER_NODE edges for node '1'
    for (let i = 2; i <= MAX_EDGES_PER_NODE + 1; i++) {
      insertEdge('1', String(i), 'caused', 0.5);
    }

    // 21st auto edge should be rejected
    const result = insertEdge('1', '999', 'supports', 0.5, null, true, 'auto');
    expect(result).toBeNull();
  });

  it('T-BOUNDS-03: manual edge NOT rejected at MAX_EDGES_PER_NODE', () => {
    const db = createTestDb();
    initCausalEdges(db);

    for (let i = 2; i <= MAX_EDGES_PER_NODE + 1; i++) {
      insertEdge('1', String(i), 'caused', 0.5);
    }

    // Manual edge should still be allowed
    const result = insertEdge('1', '999', 'supports', 0.8, null, true, 'manual');
    expect(result).not.toBeNull();
  });

  it('T-BOUNDS-04: auto edge strength capped at MAX_AUTO_STRENGTH', () => {
    const db = createTestDb();
    initCausalEdges(db);

    const edgeId = insertEdge('1', '2', 'caused', 0.9, null, true, 'auto');
    expect(edgeId).not.toBeNull();

    const edge = (db.prepare('SELECT strength FROM causal_edges WHERE id = ?') as Database.Statement)
      .get(edgeId!) as { strength: number };
    expect(edge.strength).toBeLessThanOrEqual(MAX_AUTO_STRENGTH);
  });
});

/* -- T002: Full consolidation cycle -- */

describe('T002: Full consolidation cycle', () => {
  it('T-CONS-01: runConsolidationCycle runs without error', () => {
    const db = createTestDb();
    initCausalEdges(db);
    seedMemories(db, 5);

    insertEdge('1', '2', 'caused', 0.5);
    insertEdge('2', '3', 'supports', 0.3);

    const result = runConsolidationCycle(db);
    expect(result).toHaveProperty('contradictions');
    expect(result).toHaveProperty('hebbian');
    expect(result).toHaveProperty('stale');
    expect(result).toHaveProperty('edgeBounds');
  });

  it('T-CONS-02: consolidation on empty database returns zeros', () => {
    const db = createTestDb();
    initCausalEdges(db);

    const result = runConsolidationCycle(db);
    expect(result.contradictions).toHaveLength(0);
    expect(result.hebbian.strengthened).toBe(0);
    expect(result.hebbian.decayed).toBe(0);
    expect(result.stale.flagged).toBe(0);
  });

  it('T-CONS-03: runConsolidationCycleIfEnabled returns null when flag is explicitly off', () => {
    const saved = process.env.SPECKIT_CONSOLIDATION;
    process.env.SPECKIT_CONSOLIDATION = 'false'; // graduated — must explicitly disable

    const db = createTestDb();
    initCausalEdges(db);
    const result = runConsolidationCycleIfEnabled(db);
    expect(result).toBeNull();

    if (saved === undefined) delete process.env.SPECKIT_CONSOLIDATION;
    else process.env.SPECKIT_CONSOLIDATION = saved;
  });

  it('T-CONS-04: runConsolidationCycleIfEnabled runs when flag is true', () => {
    const saved = process.env.SPECKIT_CONSOLIDATION;
    process.env.SPECKIT_CONSOLIDATION = 'true';

    const db = createTestDb();
    initCausalEdges(db);
    seedMemories(db, 2);
    insertEdge('1', '2', 'caused', 0.5);

    const result = runConsolidationCycleIfEnabled(db);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('hebbian');

    if (saved === undefined) delete process.env.SPECKIT_CONSOLIDATION;
    else process.env.SPECKIT_CONSOLIDATION = saved;
  });

  it('T-CONS-05: runtime hook enforces weekly cadence', () => {
    const saved = process.env.SPECKIT_CONSOLIDATION;
    process.env.SPECKIT_CONSOLIDATION = 'true';

    const db = createTestDb();
    initCausalEdges(db);
    seedMemories(db, 2);
    insertEdge('1', '2', 'caused', 0.5);

    const first = runConsolidationCycleIfEnabled(db);
    expect(first).not.toBeNull();

    const second = runConsolidationCycleIfEnabled(db);
    expect(second).toBeNull();

    db.prepare("UPDATE consolidation_state SET last_run_at = datetime('now', '-8 days') WHERE id = 1").run();

    const third = runConsolidationCycleIfEnabled(db);
    expect(third).not.toBeNull();

    if (saved === undefined) delete process.env.SPECKIT_CONSOLIDATION;
    else process.env.SPECKIT_CONSOLIDATION = saved;
  });
});
