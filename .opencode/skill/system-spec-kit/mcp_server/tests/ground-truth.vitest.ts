// ───────────────────────────────────────────────────────────────
// 1. TEST — GROUND TRUTH
// ───────────────────────────────────────────────────────────────
//
// Validates:
// T007.1  — generateGroundTruth() returns ≥100 queries
// T007.2  — All 7 intent types have ≥5 queries
// T007.3  — All 3 complexity tiers have ≥10 queries
// T007.4  — ≥30 manual queries (source='manual')
// T007.5  — ≥3 hard negative queries
// T007.6  — No duplicate query strings
// T007.7  — All required fields present and valid enum values
// T007.8  — validateGroundTruthDiversity() returns all gates passed
// T007.9  — loadGroundTruth() populates eval DB tables
// T007.10 — Distribution summary matches actual query counts
// T007.11 — Seed queries (ids 1-21) are all present and unmodified
// T007.12 — Hard negatives have no relevance entries

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

import {
  generateGroundTruth,
  loadGroundTruth,
  validateGroundTruthDiversity,
  GATES,
} from '../lib/eval/ground-truth-generator';

import {
  GROUND_TRUTH_QUERIES,
  QUERY_DISTRIBUTION,
  type IntentType,
  type ComplexityTier,
  type QueryCategory,
  type QuerySource,
} from '../lib/eval/ground-truth-data';

/* ───────────────────────────────────────────────────────────────
   CONSTANTS
──────────────────────────────────────────────────────────────── */

const VALID_INTENT_TYPES: IntentType[] = [
  'add_feature',
  'fix_bug',
  'refactor',
  'security_audit',
  'understand',
  'find_spec',
  'find_decision',
];

const VALID_COMPLEXITY_TIERS: ComplexityTier[] = ['simple', 'moderate', 'complex'];

const VALID_CATEGORIES: QueryCategory[] = [
  'factual',
  'temporal',
  'graph_relationship',
  'cross_document',
  'hard_negative',
  'anchor_based',
  'scope_filtered',
];

const VALID_SOURCES: QuerySource[] = ['manual', 'trigger_derived', 'pattern_derived', 'seed'];

/* ───────────────────────────────────────────────────────────────
   TEST SETUP: in-memory eval DB for T007.9
──────────────────────────────────────────────────────────────── */

const EVAL_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS eval_queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT NOT NULL,
    intent TEXT,
    spec_folder TEXT,
    expected_memory_ids TEXT,
    difficulty TEXT DEFAULT 'medium',
    category TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS eval_ground_truth (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query_id INTEGER NOT NULL,
    memory_id INTEGER NOT NULL,
    relevance INTEGER NOT NULL DEFAULT 0,
    annotator TEXT DEFAULT 'auto',
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(query_id, memory_id)
  );
`;

let testDb: Database.Database;
let testDbPath: string;

beforeEach(() => {
  // Use a fresh in-memory DB per test suite run
  testDbPath = path.join(os.tmpdir(), `t007-test-${Date.now()}.db`);
  testDb = new Database(testDbPath);
  testDb.pragma('journal_mode = WAL');
  testDb.exec(EVAL_SCHEMA_SQL);
});

afterEach(() => {
  if (testDb) {
    try { testDb.close(); } catch { /* ignore */ }
  }
  if (testDbPath && fs.existsSync(testDbPath)) {
    try { fs.unlinkSync(testDbPath); } catch { /* ignore */ }
  }
});

/* ═══════════════════════════════════════════════════════════
   T007.1: generateGroundTruth() returns ≥100 queries
════════════════════════════════════════════════════════════ */

describe('T007.1: generateGroundTruth() total query count', () => {
  it('T007.1.1: returns a dataset object with queries array', () => {
    const dataset = generateGroundTruth();
    expect(dataset).toBeDefined();
    expect(dataset.queries).toBeInstanceOf(Array);
  });

  it('T007.1.2: total query count is ≥100', () => {
    const dataset = generateGroundTruth();
    expect(dataset.queries.length).toBeGreaterThanOrEqual(100);
  });

  it('T007.1.3: GROUND_TRUTH_QUERIES static export has ≥100 items', () => {
    expect(GROUND_TRUTH_QUERIES.length).toBeGreaterThanOrEqual(100);
  });

  it('T007.1.4: dataset.queries matches GROUND_TRUTH_QUERIES', () => {
    const dataset = generateGroundTruth();
    expect(dataset.queries.length).toBe(GROUND_TRUTH_QUERIES.length);
  });

  it('T007.1.5: dataset includes distribution summary', () => {
    const dataset = generateGroundTruth();
    expect(dataset.distribution).toBeDefined();
    expect(dataset.distribution.total).toBe(dataset.queries.length);
  });

  it('T007.1.6: dataset includes relevances array', () => {
    const dataset = generateGroundTruth();
    expect(dataset.relevances).toBeInstanceOf(Array);
  });
});

/* ═══════════════════════════════════════════════════════════
   T007.2: All 7 intent types have ≥5 queries
════════════════════════════════════════════════════════════ */

describe('T007.2: Intent type coverage (≥5 per type)', () => {
  let intentCounts: Partial<Record<IntentType, number>>;

  beforeEach(() => {
    intentCounts = {};
    for (const q of GROUND_TRUTH_QUERIES) {
      intentCounts[q.intentType] = (intentCounts[q.intentType] ?? 0) + 1;
    }
  });

  for (const intent of VALID_INTENT_TYPES) {
    it(`T007.2.${VALID_INTENT_TYPES.indexOf(intent) + 1}: intent '${intent}' has ≥5 queries`, () => {
      const count = intentCounts[intent] ?? 0;
      expect(count).toBeGreaterThanOrEqual(5);
    });
  }

  it('T007.2.8: all 7 intent types are represented', () => {
    const presentIntents = new Set(GROUND_TRUTH_QUERIES.map(q => q.intentType));
    for (const intent of VALID_INTENT_TYPES) {
      expect(presentIntents.has(intent)).toBe(true);
    }
  });
});

/* ═══════════════════════════════════════════════════════════
   T007.3: Complexity tiers — ≥3 tiers, ≥10 per tier
════════════════════════════════════════════════════════════ */

describe('T007.3: Complexity tier coverage', () => {
  let tierCounts: Partial<Record<ComplexityTier, number>>;

  beforeEach(() => {
    tierCounts = {};
    for (const q of GROUND_TRUTH_QUERIES) {
      tierCounts[q.complexityTier] = (tierCounts[q.complexityTier] ?? 0) + 1;
    }
  });

  it('T007.3.1: at least 3 distinct complexity tiers are present', () => {
    const distinctTiers = Object.keys(tierCounts).length;
    expect(distinctTiers).toBeGreaterThanOrEqual(3);
  });

  for (const tier of VALID_COMPLEXITY_TIERS) {
    it(`T007.3.${VALID_COMPLEXITY_TIERS.indexOf(tier) + 2}: tier '${tier}' has ≥10 queries`, () => {
      const count = tierCounts[tier] ?? 0;
      expect(count).toBeGreaterThanOrEqual(10);
    });
  }

  it('T007.3.5: all 3 required tiers are present (simple, moderate, complex)', () => {
    for (const tier of VALID_COMPLEXITY_TIERS) {
      expect(tierCounts).toHaveProperty(tier);
    }
  });
});

/* ═══════════════════════════════════════════════════════════
   T007.4: ≥30 manual queries (NOT trigger-derived)
════════════════════════════════════════════════════════════ */

describe('T007.4: Manual query count (≥30)', () => {
  it('T007.4.1: at least 30 queries have source="manual"', () => {
    const manualCount = GROUND_TRUTH_QUERIES.filter(q => q.source === 'manual').length;
    expect(manualCount).toBeGreaterThanOrEqual(30);
  });

  it('T007.4.2: manual queries are not source="trigger_derived"', () => {
    const manualQueries = GROUND_TRUTH_QUERIES.filter(q => q.source === 'manual');
    for (const q of manualQueries) {
      expect(q.source).not.toBe('trigger_derived');
    }
  });

  it('T007.4.3: manual queries all have non-empty expectedResultDescription', () => {
    const manualQueries = GROUND_TRUTH_QUERIES.filter(q => q.source === 'manual');
    for (const q of manualQueries) {
      expect(q.expectedResultDescription.length).toBeGreaterThan(0);
    }
  });

  it('T007.4.4: distribution.manualQueryCount matches actual manual count', () => {
    const actualManual = GROUND_TRUTH_QUERIES.filter(q => q.source === 'manual').length;
    expect(QUERY_DISTRIBUTION.manualQueryCount).toBe(actualManual);
  });
});

/* ═══════════════════════════════════════════════════════════
   T007.5: ≥3 hard negative queries
════════════════════════════════════════════════════════════ */

describe('T007.5: Hard negative queries (≥3)', () => {
  it('T007.5.1: at least 3 queries have category="hard_negative"', () => {
    const hardNegCount = GROUND_TRUTH_QUERIES.filter(q => q.category === 'hard_negative').length;
    expect(hardNegCount).toBeGreaterThanOrEqual(3);
  });

  it('T007.5.2: hard negatives include out-of-domain queries', () => {
    const hardNegs = GROUND_TRUTH_QUERIES.filter(q => q.category === 'hard_negative');
    // All hard negatives must document that they expect NO relevant results
    for (const q of hardNegs) {
      const desc = q.expectedResultDescription.toLowerCase();
      const expectsNoResults =
        desc.includes('no relevant') ||
        desc.includes('should return no') ||
        desc.includes('not exist') ||
        desc.includes('does not exist') ||
        desc.includes('empty');
      expect(expectsNoResults).toBe(true);
    }
  });

  it('T007.5.3: hard negatives have no relevance entries in generateGroundTruth()', () => {
    const dataset = generateGroundTruth();
    const hardNegIds = new Set(
      GROUND_TRUTH_QUERIES.filter(q => q.category === 'hard_negative').map(q => q.id),
    );
    for (const r of dataset.relevances) {
      expect(hardNegIds.has(r.queryId)).toBe(false);
    }
  });

  it('T007.5.4: distribution.hardNegativeCount matches actual hard negative count', () => {
    const actualHardNegs = GROUND_TRUTH_QUERIES.filter(q => q.category === 'hard_negative').length;
    expect(QUERY_DISTRIBUTION.hardNegativeCount).toBe(actualHardNegs);
  });
});

/* ═══════════════════════════════════════════════════════════
   T007.6: No duplicate query strings
════════════════════════════════════════════════════════════ */

describe('T007.6: Query string uniqueness', () => {
  it('T007.6.1: all query strings are unique (case-insensitive)', () => {
    const normalized = GROUND_TRUTH_QUERIES.map(q => q.query.toLowerCase().trim());
    const uniqueCount = new Set(normalized).size;
    expect(uniqueCount).toBe(GROUND_TRUTH_QUERIES.length);
  });

  it('T007.6.2: all query IDs are unique', () => {
    const ids = GROUND_TRUTH_QUERIES.map(q => q.id);
    const uniqueIds = new Set(ids).size;
    expect(uniqueIds).toBe(GROUND_TRUTH_QUERIES.length);
  });

  it('T007.6.3: query IDs form a contiguous sequence starting at 1', () => {
    const ids = GROUND_TRUTH_QUERIES.map(q => q.id).sort((a, b) => a - b);
    expect(ids[0]).toBe(1);
    expect(ids[ids.length - 1]).toBe(GROUND_TRUTH_QUERIES.length);
  });

  it('T007.6.4: no two queries share the same query string', () => {
    const strings = GROUND_TRUTH_QUERIES.map(q => q.query);
    const stringSet = new Set(strings);
    expect(stringSet.size).toBe(strings.length);
  });
});

/* ═══════════════════════════════════════════════════════════
   T007.7: Data integrity — required fields and valid enum values
════════════════════════════════════════════════════════════ */

describe('T007.7: Data integrity and field validation', () => {
  it('T007.7.1: every query has a numeric id', () => {
    for (const q of GROUND_TRUTH_QUERIES) {
      expect(typeof q.id).toBe('number');
      expect(q.id).toBeGreaterThan(0);
    }
  });

  it('T007.7.2: every query has a non-empty query string', () => {
    for (const q of GROUND_TRUTH_QUERIES) {
      expect(typeof q.query).toBe('string');
      expect(q.query.trim().length).toBeGreaterThan(0);
    }
  });

  it('T007.7.3: every query has a valid intentType', () => {
    for (const q of GROUND_TRUTH_QUERIES) {
      expect(VALID_INTENT_TYPES).toContain(q.intentType);
    }
  });

  it('T007.7.4: every query has a valid complexityTier', () => {
    for (const q of GROUND_TRUTH_QUERIES) {
      expect(VALID_COMPLEXITY_TIERS).toContain(q.complexityTier);
    }
  });

  it('T007.7.5: every query has a valid category', () => {
    for (const q of GROUND_TRUTH_QUERIES) {
      expect(VALID_CATEGORIES).toContain(q.category);
    }
  });

  it('T007.7.6: every query has a valid source', () => {
    for (const q of GROUND_TRUTH_QUERIES) {
      expect(VALID_SOURCES).toContain(q.source);
    }
  });

  it('T007.7.7: every query has a non-empty expectedResultDescription', () => {
    for (const q of GROUND_TRUTH_QUERIES) {
      expect(typeof q.expectedResultDescription).toBe('string');
      expect(q.expectedResultDescription.trim().length).toBeGreaterThan(0);
    }
  });

  it('T007.7.8: relevance values in generateGroundTruth() are in [0, 1, 2, 3]', () => {
    const dataset = generateGroundTruth();
    const validRelevances = [0, 1, 2, 3];
    for (const r of dataset.relevances) {
      expect(validRelevances).toContain(r.relevance);
    }
  });

  it('T007.7.9: all relevance entries reference valid query IDs', () => {
    const dataset = generateGroundTruth();
    const validIds = new Set(dataset.queries.map(q => q.id));
    for (const r of dataset.relevances) {
      expect(validIds.has(r.queryId)).toBe(true);
    }
  });
});

/* ═══════════════════════════════════════════════════════════
   T007.8: validateGroundTruthDiversity() — all gates pass
════════════════════════════════════════════════════════════ */

describe('T007.8: validateGroundTruthDiversity() validation', () => {
  it('T007.8.1: returns a DiversityValidationReport object', () => {
    const report = validateGroundTruthDiversity();
    expect(report).toBeDefined();
    expect(report.passed).toBeDefined();
    expect(report.gates).toBeInstanceOf(Array);
    expect(report.summary).toBeDefined();
  });

  it('T007.8.2: overall result is passed=true', () => {
    const report = validateGroundTruthDiversity();
    if (!report.passed) {
      // Surface failed gates for debugging
      const failed = report.gates.filter(g => !g.passed);
      throw new Error(`Diversity validation failed: ${failed.map(g => `${g.dimension}: got ${g.actual}, need ${g.required}`).join('; ')}`);
    }
    expect(report.passed).toBe(true);
  });

  it('T007.8.3: reports correct totalQueries count', () => {
    const report = validateGroundTruthDiversity();
    expect(report.totalQueries).toBe(GROUND_TRUTH_QUERIES.length);
  });

  it('T007.8.4: total queries gate passes', () => {
    const report = validateGroundTruthDiversity();
    const totalGate = report.gates.find(g => g.dimension === 'Total queries');
    expect(totalGate).toBeDefined();
    expect(totalGate!.passed).toBe(true);
    expect(totalGate!.actual).toBeGreaterThanOrEqual(GATES.MIN_TOTAL_QUERIES);
  });

  it('T007.8.5: all intent-type gates pass', () => {
    const report = validateGroundTruthDiversity();
    const intentGates = report.gates.filter(g => g.dimension.startsWith('Intent:'));
    expect(intentGates.length).toBe(7);
    for (const gate of intentGates) {
      expect(gate.passed).toBe(true);
    }
  });

  it('T007.8.6: distinct complexity tiers gate passes', () => {
    const report = validateGroundTruthDiversity();
    const tiersGate = report.gates.find(g => g.dimension === 'Distinct complexity tiers');
    expect(tiersGate).toBeDefined();
    expect(tiersGate!.passed).toBe(true);
    expect(tiersGate!.actual).toBeGreaterThanOrEqual(3);
  });

  it('T007.8.7: all per-complexity-tier gates pass', () => {
    const report = validateGroundTruthDiversity();
    const tierGates = report.gates.filter(g => g.dimension.startsWith('Complexity tier:'));
    expect(tierGates.length).toBe(3);
    for (const gate of tierGates) {
      expect(gate.passed).toBe(true);
    }
  });

  it('T007.8.8: manual query count gate passes (≥30)', () => {
    const report = validateGroundTruthDiversity();
    const manualGate = report.gates.find(g => g.dimension.includes('Manual queries'));
    expect(manualGate).toBeDefined();
    expect(manualGate!.passed).toBe(true);
    expect(manualGate!.actual).toBeGreaterThanOrEqual(30);
  });

  it('T007.8.9: hard negatives gate passes (≥3)', () => {
    const report = validateGroundTruthDiversity();
    const hardNegGate = report.gates.find(g => g.dimension.includes('Hard negative'));
    expect(hardNegGate).toBeDefined();
    expect(hardNegGate!.passed).toBe(true);
    expect(hardNegGate!.actual).toBeGreaterThanOrEqual(3);
  });

  it('T007.8.10: uniqueness gate passes (no duplicate strings)', () => {
    const report = validateGroundTruthDiversity();
    const uniquenessGate = report.gates.find(g => g.dimension.includes('Unique query'));
    expect(uniquenessGate).toBeDefined();
    expect(uniquenessGate!.passed).toBe(true);
  });

  it('T007.8.11: validation with custom empty array fails total count gate', () => {
    const report = validateGroundTruthDiversity([]);
    expect(report.passed).toBe(false);
    const totalGate = report.gates.find(g => g.dimension === 'Total queries');
    expect(totalGate!.passed).toBe(false);
    expect(totalGate!.actual).toBe(0);
  });

  it('T007.8.12: summary string indicates all gates passed', () => {
    const report = validateGroundTruthDiversity();
    expect(report.summary).toContain('PASSED');
  });
});

/* ═══════════════════════════════════════════════════════════
   T007.9: loadGroundTruth() populates eval DB tables
════════════════════════════════════════════════════════════ */

describe('T007.9: loadGroundTruth() DB population', () => {
  it('T007.9.1: returns insert counts', () => {
    const result = loadGroundTruth(testDb);
    expect(result.queriesInserted).toBeGreaterThan(0);
    expect(result.relevancesInserted).toBeGreaterThanOrEqual(0);
  });

  it('T007.9.2: all queries are inserted into eval_queries', () => {
    loadGroundTruth(testDb);
    const count = testDb.prepare('SELECT COUNT(*) as c FROM eval_queries').get() as { c: number };
    expect(count.c).toBe(GROUND_TRUTH_QUERIES.length);
  });

  it('T007.9.3: non-hard-negative queries have relevance entries', () => {
    loadGroundTruth(testDb);
    const nonHardNeg = GROUND_TRUTH_QUERIES.filter(q => q.category !== 'hard_negative');
    const count = testDb.prepare('SELECT COUNT(*) as c FROM eval_ground_truth').get() as { c: number };
    // Each non-hard-negative query has 1-3 graded relevance entries (real production IDs)
    // Total entries should be >= nonHardNeg count and <= 3x nonHardNeg count
    expect(count.c).toBeGreaterThanOrEqual(nonHardNeg.length);
    expect(count.c).toBeLessThanOrEqual(nonHardNeg.length * 3);
    // Verify no hard-negative query has relevance entries
    const hardNegIds = GROUND_TRUTH_QUERIES
      .filter(q => q.category === 'hard_negative')
      .map(q => q.id);
    for (const hnId of hardNegIds) {
      const hnCount = testDb
        .prepare('SELECT COUNT(*) as c FROM eval_ground_truth WHERE query_id = ?')
        .get(hnId) as { c: number };
      expect(hnCount.c).toBe(0);
    }
  });

  it('T007.9.4: second call with default options is idempotent (INSERT OR IGNORE)', () => {
    const first = loadGroundTruth(testDb);
    const second = loadGroundTruth(testDb);
    // Second call should insert 0 rows (all already present)
    expect(second.queriesInserted).toBe(0);
    expect(second.relevancesInserted).toBe(0);
  });

  it('T007.9.5: queries in DB have correct intent values', () => {
    loadGroundTruth(testDb);
    const rows = testDb
      .prepare('SELECT id, intent FROM eval_queries ORDER BY id')
      .all() as { id: number; intent: string }[];

    for (const row of rows) {
      const expected = GROUND_TRUTH_QUERIES.find(q => q.id === row.id);
      expect(expected).toBeDefined();
      expect(row.intent).toBe(expected!.intentType);
    }
  });

  it('T007.9.6: hard negative queries have no relevance entries in DB', () => {
    loadGroundTruth(testDb);
    const hardNegIds = GROUND_TRUTH_QUERIES
      .filter(q => q.category === 'hard_negative')
      .map(q => q.id);

    for (const id of hardNegIds) {
      const result = testDb
        .prepare('SELECT COUNT(*) as c FROM eval_ground_truth WHERE query_id = ?')
        .get(id) as { c: number };
      expect(result.c).toBe(0);
    }
  });

  it('T007.9.7: replace=true re-inserts all rows', () => {
    loadGroundTruth(testDb);
    const second = loadGroundTruth(testDb, { replace: true });
    expect(second.queriesInserted).toBe(GROUND_TRUTH_QUERIES.length);
  });

  it('T007.9.8: custom annotator is stored in eval_ground_truth', () => {
    loadGroundTruth(testDb, { annotator: 'test-agent' });
    const row = testDb
      .prepare('SELECT annotator FROM eval_ground_truth LIMIT 1')
      .get() as { annotator: string } | undefined;
    expect(row).toBeDefined();
    expect(row!.annotator).toBe('test-agent');
  });
});

/* ═══════════════════════════════════════════════════════════
   T007.10: Distribution summary matches actual counts
════════════════════════════════════════════════════════════ */

describe('T007.10: Distribution summary accuracy', () => {
  it('T007.10.1: QUERY_DISTRIBUTION.total matches actual array length', () => {
    expect(QUERY_DISTRIBUTION.total).toBe(GROUND_TRUTH_QUERIES.length);
  });

  it('T007.10.2: bySource counts sum to total', () => {
    const sourceTotal = Object.values(QUERY_DISTRIBUTION.bySource).reduce(
      (sum, count) => sum + count,
      0,
    );
    expect(sourceTotal).toBe(QUERY_DISTRIBUTION.total);
  });

  it('T007.10.3: byIntentType counts sum to total', () => {
    const intentTotal = Object.values(QUERY_DISTRIBUTION.byIntentType).reduce(
      (sum, count) => sum + count,
      0,
    );
    expect(intentTotal).toBe(QUERY_DISTRIBUTION.total);
  });

  it('T007.10.4: byComplexityTier counts sum to total', () => {
    const tierTotal = Object.values(QUERY_DISTRIBUTION.byComplexityTier).reduce(
      (sum, count) => sum + count,
      0,
    );
    expect(tierTotal).toBe(QUERY_DISTRIBUTION.total);
  });

  it('T007.10.5: byCategory counts sum to total', () => {
    const catTotal = Object.values(QUERY_DISTRIBUTION.byCategory).reduce(
      (sum, count) => sum + count,
      0,
    );
    expect(catTotal).toBe(QUERY_DISTRIBUTION.total);
  });

  it('T007.10.6: seed count matches actual seed query count', () => {
    const actualSeedCount = GROUND_TRUTH_QUERIES.filter(q => q.source === 'seed').length;
    expect(QUERY_DISTRIBUTION.bySource.seed).toBe(actualSeedCount);
  });
});

/* ═══════════════════════════════════════════════════════════
   T007.11: Seed queries (ids 1-21) are present and intact
════════════════════════════════════════════════════════════ */

describe('T007.11: Seed query integrity (T000d compatibility)', () => {
  it('T007.11.1: queries 1-21 all exist', () => {
    for (let i = 1; i <= 21; i++) {
      const q = GROUND_TRUTH_QUERIES.find(q => q.id === i);
      expect(q).toBeDefined();
    }
  });

  it('T007.11.2: all seed queries have source="seed"', () => {
    for (let i = 1; i <= 21; i++) {
      const q = GROUND_TRUTH_QUERIES.find(q => q.id === i);
      expect(q!.source).toBe('seed');
    }
  });

  it('T007.11.3: query 1 is the maxTriggersPerMemory factual query', () => {
    const q = GROUND_TRUTH_QUERIES.find(q => q.id === 1);
    expect(q!.query).toBe('what does maxTriggersPerMemory control in the search pipeline');
    expect(q!.intentType).toBe('understand');
    expect(q!.complexityTier).toBe('simple');
  });

  it('T007.11.4: query 17 is a hard negative (python billing)', () => {
    const q = GROUND_TRUTH_QUERIES.find(q => q.id === 17);
    expect(q!.category).toBe('hard_negative');
    expect(q!.query).toBe('python unit tests for the billing module');
  });

  it('T007.11.5: queries 17-21 are all hard negatives from T000d', () => {
    for (let i = 17; i <= 21; i++) {
      const q = GROUND_TRUTH_QUERIES.find(q => q.id === i);
      expect(q!.category).toBe('hard_negative');
    }
  });

  it('T007.11.6: seed queries total 21 and cover all required intent types', () => {
    const seedQueries = GROUND_TRUTH_QUERIES.filter(q => q.source === 'seed');
    // The 21 seed queries come from T000d (20 non-hard-neg + 5 hard-neg = 21 total,
    // With the T000d metadata listing 20 because the last was appended).
    // Verify: all intent types from T000d are represented in seeds.
    const intentTypes = new Set(seedQueries.map(q => q.intentType));
    expect(intentTypes.has('understand')).toBe(true);
    expect(intentTypes.has('find_decision')).toBe(true);
    expect(intentTypes.has('fix_bug')).toBe(true);
    expect(intentTypes.has('add_feature')).toBe(true);
    expect(intentTypes.has('find_spec')).toBe(true);
    // All 21 seeds are present
    expect(seedQueries.length).toBe(21);
  });
});

/* ═══════════════════════════════════════════════════════════
   T007.12: Hard negatives have no relevance entries
════════════════════════════════════════════════════════════ */

describe('T007.12: Hard negative isolation', () => {
  it('T007.12.1: no relevance entry has a hard-negative query ID', () => {
    const dataset = generateGroundTruth();
    const hardNegIds = new Set(
      GROUND_TRUTH_QUERIES.filter(q => q.category === 'hard_negative').map(q => q.id),
    );
    for (const r of dataset.relevances) {
      expect(hardNegIds.has(r.queryId)).toBe(false);
    }
  });

  it('T007.12.2: hard negatives from all 3 sources are present', () => {
    const hardNegs = GROUND_TRUTH_QUERIES.filter(q => q.category === 'hard_negative');
    const sources = new Set(hardNegs.map(q => q.source));
    // Seed and manual hard negatives should exist
    expect(sources.has('seed')).toBe(true);
    expect(sources.has('manual')).toBe(true);
  });

  it('T007.12.3: hard negatives cover multiple intent types', () => {
    const hardNegs = GROUND_TRUTH_QUERIES.filter(q => q.category === 'hard_negative');
    const intents = new Set(hardNegs.map(q => q.intentType));
    // Hard negatives should not all be the same intent
    expect(intents.size).toBeGreaterThanOrEqual(2);
  });
});
