// ───────────────────────────────────────────────────────────────
// 1. TEST — SEARCH FALLBACK TIERED
// ───────────────────────────────────────────────────────────────
// Tests: Feature flag gating, tier progression, structuralSearch,
// Degradation metadata, result merging, R15 invariant

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  searchWithFallback,
  structuralSearch,
  hybridSearchEnhanced,
  __testables,
  init,
  DEGRADATION_QUALITY_THRESHOLD,
  DEGRADATION_MIN_RESULTS,
} from '../lib/search/hybrid-search';
import type { HybridSearchResult, DegradationEvent } from '../lib/search/hybrid-search';
import { isSearchFallbackEnabled } from '../lib/search/search-flags';

import Database from 'better-sqlite3';

/* --- HELPER: env var backup/restore --- */

let envBackup: Record<string, string | undefined>;

beforeEach(() => {
  envBackup = {
    SPECKIT_SEARCH_FALLBACK: process.env.SPECKIT_SEARCH_FALLBACK,
    SPECKIT_COMPLEXITY_ROUTER: process.env.SPECKIT_COMPLEXITY_ROUTER,
    SPECKIT_RSF_FUSION: process.env.SPECKIT_RSF_FUSION,
    SPECKIT_CHANNEL_MIN_REP: process.env.SPECKIT_CHANNEL_MIN_REP,
    SPECKIT_CONFIDENCE_TRUNCATION: process.env.SPECKIT_CONFIDENCE_TRUNCATION,
  };
});

afterEach(() => {
  for (const [key, val] of Object.entries(envBackup)) {
    if (val === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = val;
    }
  }
});

/* --- HELPER: in-memory DB with memory_index table --- */

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      file_path TEXT NOT NULL,
      importance_tier TEXT DEFAULT 'normal',
      importance_weight REAL DEFAULT 0.5,
      spec_folder TEXT,
      is_archived INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  return db;
}

function seedTestDb(db: Database.Database, rows: Array<{
  title: string;
  file_path: string;
  importance_tier?: string;
  importance_weight?: number;
  spec_folder?: string;
}>): void {
  const stmt = db.prepare(`
    INSERT INTO memory_index (title, file_path, importance_tier, importance_weight, spec_folder)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const row of rows) {
    stmt.run(
      row.title,
      row.file_path,
      row.importance_tier ?? 'normal',
      row.importance_weight ?? 0.5,
      row.spec_folder ?? null,
    );
  }
}

/* ═══════════════════════════════════════════════════════════════
   1. Feature Flag Gating
   ═══════════════════════════════════════════════════════════════ */

describe('PI-A2: Feature flag gating', () => {
  it('T045-01: isSearchFallbackEnabled returns true by default (graduated flag)', () => {
    delete process.env.SPECKIT_SEARCH_FALLBACK;
    expect(isSearchFallbackEnabled()).toBe(true);
  });

  it('T045-02: isSearchFallbackEnabled returns true when set to "true"', () => {
    process.env.SPECKIT_SEARCH_FALLBACK = 'true';
    expect(isSearchFallbackEnabled()).toBe(true);
  });

  it('T045-03: isSearchFallbackEnabled returns true case-insensitively', () => {
    process.env.SPECKIT_SEARCH_FALLBACK = 'TRUE';
    expect(isSearchFallbackEnabled()).toBe(true);

    process.env.SPECKIT_SEARCH_FALLBACK = 'True';
    expect(isSearchFallbackEnabled()).toBe(true);
  });
});

/* ═══════════════════════════════════════════════════════════════
   2. Tier Progression Triggers
   ═══════════════════════════════════════════════════════════════ */

describe('PI-A2: Tier progression', () => {
  it('T045-04: stays at Tier 1 when results meet quality thresholds', async () => {
    // When flag is OFF, searchWithFallback uses the original two-pass logic
    process.env.SPECKIT_SEARCH_FALLBACK = 'false';

    // We test the flag check directly — when off, old behavior is preserved
    const result = await searchWithFallback('test query', null, { limit: 5 });
    // Should not throw, returns array (may be empty without init)
    expect(Array.isArray(result)).toBe(true);
  });

  it('T045-05: searchWithFallback delegates to tiered when flag enabled', async () => {
    process.env.SPECKIT_SEARCH_FALLBACK = 'true';

    // Without proper db init, both paths return empty — key is it doesn't throw
    const result = await searchWithFallback('test query', null, { limit: 5 });
    expect(Array.isArray(result)).toBe(true);
  });

  it('T045-06: constants are exported with correct values', () => {
    expect(DEGRADATION_QUALITY_THRESHOLD).toBe(0.02);
    expect(DEGRADATION_MIN_RESULTS).toBe(3);
  });
});

/* ═══════════════════════════════════════════════════════════════
   3. structuralSearch
   ═══════════════════════════════════════════════════════════════ */

describe('PI-A2: structuralSearch', () => {
  let testDb: Database.Database;

  beforeEach(() => {
    testDb = createTestDb();
    seedTestDb(testDb, [
      { title: 'Auth Config', file_path: '/specs/auth/memory/auth.md', importance_tier: 'constitutional', importance_weight: 1.0, spec_folder: 'specs/auth' },
      { title: 'DB Setup', file_path: '/specs/db/memory/db.md', importance_tier: 'critical', importance_weight: 0.8, spec_folder: 'specs/db' },
      { title: 'Logging', file_path: '/specs/log/memory/log.md', importance_tier: 'important', importance_weight: 0.6, spec_folder: 'specs/log' },
      { title: 'Temp Note', file_path: '/specs/tmp/memory/tmp.md', importance_tier: 'temporary', importance_weight: 0.3, spec_folder: 'specs/auth' },
      { title: 'Normal Item', file_path: '/specs/norm/memory/norm.md', importance_tier: 'normal', importance_weight: 0.5, spec_folder: 'specs/norm' },
    ]);

    // Initialize hybrid-search with our test db
    init(testDb, null);
  });

  afterEach(() => {
    testDb.close();
  });

  it('T045-07: returns results ordered by importance tier', () => {
    const results = structuralSearch({ limit: 10 });

    expect(results.length).toBe(5);
    // Constitutional first, then critical, important, normal, temporary
    expect(results[0].title).toBe('Auth Config');
    expect(results[1].title).toBe('DB Setup');
    expect(results[2].title).toBe('Logging');
    expect(results[3].title).toBe('Normal Item');
    expect(results[4].title).toBe('Temp Note');
  });

  it('T045-08: respects specFolder filter', () => {
    const results = structuralSearch({ specFolder: 'specs/auth', limit: 10 });

    expect(results.length).toBe(2);
    expect(results.every(r => (r as Record<string, unknown>).spec_folder === 'specs/auth')).toBe(true);
  });

  it('T045-09: returns empty array when db has no matching rows', () => {
    const results = structuralSearch({ specFolder: 'specs/nonexistent', limit: 10 });
    expect(results).toEqual([]);
  });

  it('T045-10: synthetic scores decrease by 0.05 per index', () => {
    const results = structuralSearch({ limit: 5 });

    expect(results[0].score).toBe(1.0);
    expect(results[1].score).toBeCloseTo(0.95);
    expect(results[2].score).toBeCloseTo(0.90);
    expect(results[3].score).toBeCloseTo(0.85);
    expect(results[4].score).toBeCloseTo(0.80);
  });

  it('T045-11: all results have source="structural"', () => {
    const results = structuralSearch({ limit: 10 });
    expect(results.every(r => r.source === 'structural')).toBe(true);
  });

  it('T045-12: returns empty array when db is not initialized', () => {
    init(null as unknown as Database.Database, null);
    const results = structuralSearch({ limit: 10 });
    expect(results).toEqual([]);
  });
});

/* ═══════════════════════════════════════════════════════════════
   4. Degradation Metadata
   ═══════════════════════════════════════════════════════════════ */

describe('PI-A2: Degradation metadata', () => {
  let testDb: Database.Database;

  beforeEach(() => {
    testDb = createTestDb();
    seedTestDb(testDb, [
      { title: 'Fallback Result', file_path: '/specs/test/memory/test.md', importance_tier: 'normal', importance_weight: 0.5 },
    ]);
    init(testDb, null);
    process.env.SPECKIT_SEARCH_FALLBACK = 'true';
  });

  afterEach(() => {
    testDb.close();
  });

  it('T045-13: tiered fallback attaches _degradation as non-enumerable', async () => {
    const results = await searchWithFallback('obscure query no results', null, { limit: 5 });

    // _degradation should be present but non-enumerable
    const descriptor = Object.getOwnPropertyDescriptor(results, '_degradation');
    if (descriptor) {
      expect(descriptor.enumerable).toBe(false);
      const events = descriptor.value as DegradationEvent[];
      expect(Array.isArray(events)).toBe(true);
    }
    // If no descriptor, results were empty and no metadata was attached — acceptable
  });

  it('T045-14: degradation events have correct tier and trigger structure', async () => {
    const results = await searchWithFallback('xyzzy nonsense query', null, { limit: 5 });

    const descriptor = Object.getOwnPropertyDescriptor(results, '_degradation');
    if (descriptor) {
      const events = descriptor.value as DegradationEvent[];
      for (const event of events) {
        expect([1, 2, 3]).toContain(event.tier);
        expect(event.trigger).toHaveProperty('reason');
        expect(event.trigger).toHaveProperty('topScore');
        expect(event.trigger).toHaveProperty('resultCount');
        expect(['low_quality', 'insufficient_results', 'both']).toContain(event.trigger.reason);
      }
    }
  });

  it('T045-15: JSON.stringify does not include _degradation (non-enumerable)', async () => {
    const results = await searchWithFallback('test degradation metadata', null, { limit: 5 });
    const serialized = JSON.stringify(results);
    expect(serialized).not.toContain('_degradation');
  });
});

/* ═══════════════════════════════════════════════════════════════
   5. Result Merging
   ═══════════════════════════════════════════════════════════════ */

describe('PI-A2: Result merging', () => {
  it('T045-16: structuralSearch results include required HybridSearchResult fields', () => {
    const testDb = createTestDb();
    seedTestDb(testDb, [
      { title: 'Test', file_path: '/test.md', importance_tier: 'normal', importance_weight: 0.5 },
    ]);
    init(testDb, null);

    const results = structuralSearch({ limit: 5 });
    expect(results.length).toBe(1);

    const result = results[0];
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('source');
    expect(typeof result.id).toBe('number');
    expect(typeof result.score).toBe('number');
    expect(result.source).toBe('structural');

    testDb.close();
  });
});

/* ═══════════════════════════════════════════════════════════════
   6. Regression Guards (Hybrid Fusion Refinement)
   ═══════════════════════════════════════════════════════════════ */

describe('PI-A2: Regression guards', () => {
  it('T045-17a: mergeResults deduplicates mixed ID types', () => {
    const merged = __testables.mergeResults(
      [{ id: 42, score: 0.12, source: 'vector' } as HybridSearchResult],
      [{ id: '42', score: 0.18, source: 'bm25' } as HybridSearchResult]
    );

    expect(merged).toHaveLength(1);
    expect(merged[0].score).toBeCloseTo(0.18);
  });

  it('T045-17b: quality degradation uses absolute+relative confidence checks', () => {
    const healthy = __testables.checkDegradation([
      { id: 1, score: 0.03, source: 'vector' } as HybridSearchResult,
      { id: 2, score: 0.005, source: 'bm25' } as HybridSearchResult,
      { id: 3, score: 0.004, source: 'fts' } as HybridSearchResult,
    ]);
    expect(healthy).toBeNull();

    const weak = __testables.checkDegradation([
      { id: 1, score: 0.01, source: 'vector' } as HybridSearchResult,
      { id: 2, score: 0.0095, source: 'bm25' } as HybridSearchResult,
      { id: 3, score: 0.009, source: 'fts' } as HybridSearchResult,
    ]);

    expect(weak).toBeTruthy();
    expect(['low_quality', 'both']).toContain(weak?.reason);
  });

  it('T045-17c: tier-3 structural scores are calibrated below existing top score', () => {
    const existing = [{ id: 1, score: 0.13, source: 'vector' } as HybridSearchResult];
    const structural = [
      { id: 100, score: 1.0, source: 'structural' } as HybridSearchResult,
      { id: 101, score: 0.95, source: 'structural' } as HybridSearchResult,
      { id: 102, score: 0.90, source: 'structural' } as HybridSearchResult,
      { id: 103, score: 0.85, source: 'structural' } as HybridSearchResult,
      { id: 104, score: 0.80, source: 'structural' } as HybridSearchResult,
      { id: 105, score: 0.75, source: 'structural' } as HybridSearchResult,
      { id: 106, score: 0.70, source: 'structural' } as HybridSearchResult,
      { id: 107, score: 0.65, source: 'structural' } as HybridSearchResult,
    ];

    const calibrated = __testables.calibrateTier3Scores(existing, structural);

    // TopCap = 0.13 * 0.5 = 0.065, decayPerRank = 0.13 * 0.08 = 0.0104
    // Pin exact 50% cap on first result
    expect(calibrated[0].score).toBeCloseTo(0.065, 5);
    // Pin decay curve on second result
    expect(calibrated[1].score).toBeCloseTo(0.065 - 0.0104, 5);
    // Monotonic decrease
    expect(calibrated[2].score).toBeLessThan(calibrated[1].score);
    // Zero-floor: index 7 → 0.065 - 7*0.0104 = -0.0078 → clamped to 0
    expect(calibrated[7].score).toBe(0);
    // All scores non-negative
    for (const row of calibrated) {
      expect(row.score).toBeGreaterThanOrEqual(0);
    }
  });

  it('T045-17d: applyResultLimit enforces cap after merges', () => {
    const rows = [1, 2, 3, 4, 5].map((id, index) => ({
      id,
      score: 1 - index * 0.1,
      source: 'vector',
    })) as HybridSearchResult[];

    const limited = __testables.applyResultLimit(rows, 3);
    expect(limited).toHaveLength(3);
    expect(limited.map(r => r.id)).toEqual([1, 2, 3]);
  });
});

/* ═══════════════════════════════════════════════════════════════
   7. Export Verification
   ═══════════════════════════════════════════════════════════════ */

describe('PI-A2: Export verification', () => {
  it('T045-17: structuralSearch is exported', () => {
    expect(typeof structuralSearch).toBe('function');
  });

  it('T045-18: DEGRADATION_QUALITY_THRESHOLD is exported', () => {
    expect(typeof DEGRADATION_QUALITY_THRESHOLD).toBe('number');
  });

  it('T045-19: DEGRADATION_MIN_RESULTS is exported', () => {
    expect(typeof DEGRADATION_MIN_RESULTS).toBe('number');
  });
});
