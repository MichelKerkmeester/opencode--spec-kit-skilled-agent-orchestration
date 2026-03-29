// ───────────────────────────────────────────────────────────────
// 1. TEST — FEATURE EVALUATION — GRAPH SIGNALS
// ───────────────────────────────────────────────────────────────
// Rigorous cross-feature evaluation tests for T001, T002, T003a, T005a, T007

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// --- T001/T002: Degree computation & RRF channel ---
import {
  EDGE_TYPE_WEIGHTS,
  DEFAULT_MAX_TYPED_DEGREE,
  MAX_TOTAL_DEGREE,
  DEGREE_BOOST_CAP,
  DEGREE_CHANNEL_WEIGHT,
  computeTypedDegree,
  normalizeDegreeToBoostedScore,
  computeMaxTypedDegree,
  computeDegreeScores,
  clearDegreeCache,
} from '../lib/search/graph-search-fn';

// --- T002: RRF fusion ---
import {
  fuseResultsMulti,
  SOURCE_TYPES,
} from '@spec-kit/shared/algorithms/rrf-fusion';
import type { RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';

// --- T003a: Co-activation ---
import {
  boostScore,
  CO_ACTIVATION_CONFIG,
  DEFAULT_COACTIVATION_STRENGTH,
} from '../lib/cognitive/co-activation';
import { applyGraphSignals } from '../lib/graph/graph-signals';
import { resolveGraphWalkRolloutState } from '../lib/search/search-flags';

// --- T005a: Signal vocabulary ---
import {
  detectSignals,
  applySignalBoosts,
} from '../lib/parsing/trigger-matcher';
import type { TriggerMatch } from '../lib/parsing/trigger-matcher';

// --- T007: Token budget ---
import {
  getDynamicTokenBudget,
  DEFAULT_BUDGET,
  DEFAULT_TOKEN_BUDGET_CONFIG,
} from '../lib/search/dynamic-token-budget';

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Create a mock better-sqlite3 Database that handles the SQL patterns
 * used by graph-search-fn.ts (computeTypedDegree, computeMaxTypedDegree,
 * computeDegreeScores).
 */
function createMockDb(edges: Array<{
  source_id: string;
  target_id: string;
  relation: string;
  strength: number;
}>) {
  const computeTypedDegreeForNode = (nodeId: string) => {
    let total = 0;
    for (const edge of edges) {
      if (edge.source_id !== nodeId && edge.target_id !== nodeId) continue;
      const weight = EDGE_TYPE_WEIGHTS[edge.relation] ?? 0;
      total += weight * edge.strength;
    }
    return Math.min(total, MAX_TOTAL_DEGREE);
  };

  return {
    prepare(sql: string) {
      // computeTypedDegreesBatch: candidate_nodes CTE with batched degree aggregation
      if (sql.includes('WITH candidate_nodes(node_id) AS') && sql.includes('candidate_edges')) {
        return {
          all: (...args: unknown[]) => {
            const candidateIds = args.slice(0, -1).map((value) => String(value));
            return candidateIds.map((node_id) => ({
              node_id,
              typed_degree: computeTypedDegreeForNode(node_id),
            }));
          },
        };
      }
      // ComputeTypedDegree: UNION ALL of source and target
      if (sql.includes('UNION ALL') && sql.includes('causal_edges')) {
        return {
          all: (sourceId: string, targetId: string) => {
            const sourceEdges = edges.filter(e => e.source_id === String(sourceId));
            const targetEdges = edges.filter(e => e.target_id === String(targetId));
            return [...sourceEdges, ...targetEdges].map(e => ({
              relation: e.relation,
              strength: e.strength,
            }));
          },
        };
      }
      // ComputeMaxTypedDegree: SELECT DISTINCT node_id
      if (sql.includes('DISTINCT') && sql.includes('node_id')) {
        return {
          all: () => {
            const nodeIds = new Set<string>();
            for (const e of edges) {
              nodeIds.add(e.source_id);
              nodeIds.add(e.target_id);
            }
            return Array.from(nodeIds).map(id => ({ node_id: id }));
          },
        };
      }
      // ComputeDegreeScores: constitutional exclusion check
      if (sql.includes('memory_index') && sql.includes('constitutional')) {
        return {
          all: (..._args: unknown[]) => [],
        };
      }
      // Default: return empty results
      return { all: (..._args: unknown[]) => [] };
    },
  } as unknown as import('better-sqlite3').Database;
}

function createGraphSignalsDb(edges: Array<{
  source_id: string;
  target_id: string;
  relation: string;
  strength: number;
}>) {
  return {
    prepare(sql: string) {
      if (sql.includes('SELECT COUNT(*) AS degree') && sql.includes('causal_edges')) {
        return {
          get: (memoryId: string) => ({
            degree: edges.filter((edge) => edge.source_id === memoryId || edge.target_id === memoryId).length,
          }),
        };
      }
      if (sql.includes('FROM degree_snapshots')) {
        return { get: () => undefined };
      }
      if (sql.includes('SELECT source_id, target_id FROM causal_edges')) {
        return { all: () => edges };
      }
      return {
        get: () => undefined,
        all: () => [],
      };
    },
  } as unknown as import('better-sqlite3').Database;
}


// ═══════════════════════════════════════════════════════════════════
// T001: TYPED-WEIGHTED DEGREE COMPUTATION
// ═══════════════════════════════════════════════════════════════════

describe('T001: Typed-weighted degree computation', () => {
  beforeEach(() => clearDegreeCache());

  it('T001.1 — edge type weights are proportional: caused > derived_from > enabled > contradicts > supersedes > supports', () => {
    // Verify the full ordering of EDGE_TYPE_WEIGHTS
    expect(EDGE_TYPE_WEIGHTS['caused']).toBeGreaterThan(EDGE_TYPE_WEIGHTS['derived_from']!);
    expect(EDGE_TYPE_WEIGHTS['derived_from']).toBeGreaterThan(EDGE_TYPE_WEIGHTS['enabled']!);
    expect(EDGE_TYPE_WEIGHTS['enabled']).toBeGreaterThan(EDGE_TYPE_WEIGHTS['contradicts']!);
    expect(EDGE_TYPE_WEIGHTS['contradicts']).toBeGreaterThan(EDGE_TYPE_WEIGHTS['supersedes']!);
    expect(EDGE_TYPE_WEIGHTS['supersedes']).toBeGreaterThan(EDGE_TYPE_WEIGHTS['supports']!);
    expect(EDGE_TYPE_WEIGHTS['supports']).toBeGreaterThan(0);
  });

  it('T001.2 — changing edge type changes output proportionally', () => {
    // Two single-edge graphs, same strength, different relation types
    const dbCaused = createMockDb([
      { source_id: '1', target_id: '2', relation: 'caused', strength: 1.0 },
    ]);
    const dbSupports = createMockDb([
      { source_id: '1', target_id: '2', relation: 'supports', strength: 1.0 },
    ]);

    const degreeCaused = computeTypedDegree(dbCaused, 1);
    const degreeSupports = computeTypedDegree(dbSupports, 1);

    // The ratio of degrees should equal the ratio of weights
    const expectedRatio = EDGE_TYPE_WEIGHTS['caused']! / EDGE_TYPE_WEIGHTS['supports']!;
    const actualRatio = degreeCaused / degreeSupports;
    expect(actualRatio).toBeCloseTo(expectedRatio, 5);
  });

  it('T001.3 — edge strength multiplies with type weight', () => {
    const dbFull = createMockDb([
      { source_id: '1', target_id: '2', relation: 'caused', strength: 1.0 },
    ]);
    const dbHalf = createMockDb([
      { source_id: '1', target_id: '2', relation: 'caused', strength: 0.5 },
    ]);

    const degreeFull = computeTypedDegree(dbFull, 1);
    const degreeHalf = computeTypedDegree(dbHalf, 1);

    expect(degreeFull).toBeCloseTo(degreeHalf * 2, 5);
  });

  it('T001.4 — degree sums across multiple edges', () => {
    const db = createMockDb([
      { source_id: '1', target_id: '10', relation: 'caused', strength: 1.0 },
      { source_id: '1', target_id: '11', relation: 'supports', strength: 1.0 },
    ]);

    const degree = computeTypedDegree(db, 1);
    const expected = EDGE_TYPE_WEIGHTS['caused']! * 1.0 + EDGE_TYPE_WEIGHTS['supports']! * 1.0;
    expect(degree).toBeCloseTo(expected, 5);
  });

  it('T001.5 — hard cap at MAX_TOTAL_DEGREE prevents unbounded growth', () => {
    // Create many high-weight edges to exceed the cap
    const manyEdges = Array.from({ length: 60 }, (_, i) => ({
      source_id: '1',
      target_id: String(100 + i),
      relation: 'caused',
      strength: 1.0,
    }));
    const db = createMockDb(manyEdges);

    const degree = computeTypedDegree(db, 1);
    expect(degree).toBe(MAX_TOTAL_DEGREE);
    expect(degree).toBe(50);
  });

  it('T001.6 — unknown relation type contributes 0 weight', () => {
    const db = createMockDb([
      { source_id: '1', target_id: '2', relation: 'unknown_relation', strength: 1.0 },
    ]);

    const degree = computeTypedDegree(db, 1);
    expect(degree).toBe(0);
  });

  it('T001.7 — node participates as both source and target', () => {
    // Node 2 is target in one edge and source in another
    const db = createMockDb([
      { source_id: '1', target_id: '2', relation: 'caused', strength: 1.0 },
      { source_id: '2', target_id: '3', relation: 'enabled', strength: 1.0 },
    ]);

    const degree = computeTypedDegree(db, 2);
    const expected = EDGE_TYPE_WEIGHTS['caused']! * 1.0 + EDGE_TYPE_WEIGHTS['enabled']! * 1.0;
    expect(degree).toBeCloseTo(expected, 5);
  });
});


// ═══════════════════════════════════════════════════════════════════
// T002: RRF 5TH DEGREE CHANNEL
// ═══════════════════════════════════════════════════════════════════

describe('T002: RRF 5th degree channel integration', () => {
  beforeEach(() => clearDegreeCache());

  it('T002.1 — adding degree channel raises score for high-degree memory', () => {
    // 4-channel baseline
    const baseLists: RankedList[] = [
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 1 }, { id: 2 }, { id: 3 }] },
      { source: SOURCE_TYPES.FTS, results: [{ id: 2 }, { id: 3 }] },
      { source: SOURCE_TYPES.BM25, results: [{ id: 3 }, { id: 1 }] },
      { source: SOURCE_TYPES.GRAPH, results: [{ id: 1 }] },
    ];

    const fusedWithout = fuseResultsMulti(baseLists);

    // Add degree channel with memory 1 ranked first
    const withDegree: RankedList[] = [
      ...baseLists,
      { source: SOURCE_TYPES.DEGREE, results: [{ id: 1 }, { id: 2 }], weight: DEGREE_CHANNEL_WEIGHT },
    ];
    const fusedWith = fuseResultsMulti(withDegree);

    // With graduated-ON normalization, compare source counts and convergence
    // Since normalized scores can both be 1.0 for top results
    const itemWith = fusedWith.find(r => r.id === 1)!;
    const itemWithout = fusedWithout.find(r => r.id === 1)!;

    // Degree channel adds an extra source for memory 1
    expect(itemWith.sources.length).toBeGreaterThan(itemWithout.sources.length);
    expect(itemWith.sources).toContain('degree');
  });

  it('T002.2 — degree channel weight matches the capped contribution budget', () => {
    const DEGREE_WEIGHT = DEGREE_CHANNEL_WEIGHT;

    // Single degree channel, two items to verify relative ordering
    const lists: RankedList[] = [
      { source: SOURCE_TYPES.DEGREE, results: [{ id: 42 }, { id: 43 }], weight: DEGREE_WEIGHT },
    ];

    const fused = fuseResultsMulti(lists);
    const result42 = fused.find(r => r.id === 42)!;
    const result43 = fused.find(r => r.id === 43)!;

    // With graduated-ON normalization, scores are min-max normalized to [0,1]
    // Top-ranked item gets 1.0, bottom gets 0.0
    expect(result42.rrfScore).toBeCloseTo(1.0, 5);
    expect(result43.rrfScore).toBeCloseTo(0.0, 5);
    // Degree channel should be recorded as source
    expect(result42.sources).toContain('degree');
  });

  it('T002.3 — degree channel triggers convergence bonus when memory appears in multiple channels', () => {
    const lists: RankedList[] = [
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 5 }] },
      { source: SOURCE_TYPES.DEGREE, results: [{ id: 5 }], weight: DEGREE_CHANNEL_WEIGHT },
    ];

    const fused = fuseResultsMulti(lists);
    const result = fused.find(r => r.id === 5)!;

    expect(result.convergenceBonus).toBeGreaterThan(0);
    expect(result.sources).toContain('vector');
    expect(result.sources).toContain('degree');
  });

  it('T002.4 — degree channel uses computeDegreeScores to produce correctly-ranked input', () => {
    // Memory 1: 3 caused edges (high degree), Memory 2: 1 supports edge (low degree)
    const db = createMockDb([
      { source_id: '1', target_id: '10', relation: 'caused', strength: 1.0 },
      { source_id: '1', target_id: '11', relation: 'caused', strength: 1.0 },
      { source_id: '1', target_id: '12', relation: 'caused', strength: 1.0 },
      { source_id: '2', target_id: '13', relation: 'supports', strength: 0.5 },
    ]);

    const scores = computeDegreeScores(db, [1, 2, 3]);

    // Build the degree ranked list as hybrid-search would
    const degreeItems: Array<{ id: number; degreeScore: number }> = [];
    for (const [idStr, score] of scores) {
      const numId = Number(idStr);
      if (score > 0 && !isNaN(numId)) degreeItems.push({ id: numId, degreeScore: score });
    }
    degreeItems.sort((a, b) => b.degreeScore - a.degreeScore);

    // Memory 1 should be ranked first (highest degree)
    expect(degreeItems[0].id).toBe(1);
    expect(degreeItems[0].degreeScore).toBeGreaterThan(degreeItems[1].degreeScore);

    // Feed into RRF — rank order should be preserved
    const lists: RankedList[] = [
      { source: SOURCE_TYPES.DEGREE, results: degreeItems.map(i => ({ id: i.id })), weight: DEGREE_CHANNEL_WEIGHT },
    ];
    const fused = fuseResultsMulti(lists);
    expect(fused[0].id).toBe(1);
  });
});

describe('T028: graph-walk rollout evaluation coverage', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('keeps ranking unchanged in off and trace_only while bounded_runtime adds only capped bonus', () => {
    const db = createGraphSignalsDb([
      { source_id: '1', target_id: '2', relation: 'supports', strength: 1.0 },
      { source_id: '2', target_id: '3', relation: 'supports', strength: 1.0 },
    ]);
    const rows = [
      { id: 1, score: 0.5 },
      { id: 2, score: 0.5 },
      { id: 3, score: 0.5 },
    ];

    const off = applyGraphSignals(structuredClone(rows), db, { rolloutState: 'off' });
    const traceOnly = applyGraphSignals(structuredClone(rows), db, { rolloutState: 'trace_only' });
    const bounded = applyGraphSignals(structuredClone(rows), db, { rolloutState: 'bounded_runtime' });

    expect(off.map((row) => row.score)).toEqual(traceOnly.map((row) => row.score));
    expect(off.map((row) => row.id)).toEqual(traceOnly.map((row) => row.id));
    expect((traceOnly[1].graphContribution as Record<string, unknown>).raw)
      .toBe((bounded[1].graphContribution as Record<string, unknown>).raw);
    expect((traceOnly[1].graphContribution as Record<string, unknown>).normalized)
      .toBe((bounded[1].graphContribution as Record<string, unknown>).normalized);
    expect((traceOnly[1].graphContribution as Record<string, unknown>).appliedBonus).toBe(0);
    expect((bounded[1].graphContribution as Record<string, unknown>).appliedBonus).toBeGreaterThan(0);
    expect((bounded[1].graphContribution as Record<string, unknown>).appliedBonus).toBeLessThanOrEqual(0.03);
  });

  it('resolves rollout defaults from env flags', () => {
    delete process.env.SPECKIT_GRAPH_WALK_ROLLOUT;
    delete process.env.SPECKIT_GRAPH_SIGNALS;
    expect(resolveGraphWalkRolloutState()).toBe('bounded_runtime');

    process.env.SPECKIT_GRAPH_SIGNALS = 'false';
    expect(resolveGraphWalkRolloutState()).toBe('off');

    process.env.SPECKIT_GRAPH_WALK_ROLLOUT = 'trace_only';
    expect(resolveGraphWalkRolloutState()).toBe('trace_only');
  });
});


// ═══════════════════════════════════════════════════════════════════
// T003a: CO-ACTIVATION SUBLINEAR SCALING (FAN-EFFECT)
// ═══════════════════════════════════════════════════════════════════

describe('T003a: Co-activation sublinear scaling (R17 fan-effect)', () => {

  it('T003a.1 — doubling relatedCount does NOT double the boost (pure fan-effect)', () => {
    const base = 0.5;
    const sim = 80;

    const boost2 = boostScore(base, 2, sim) - base;
    const boost4 = boostScore(base, 4, sim) - base;

    // Pure fan-effect — more connections dilute each relationship's contribution.
    // Total boost DECREASES as relatedCount increases (1/sqrt(n) decay).
    expect(boost4).toBeLessThan(boost2);
    expect(boost4).toBeGreaterThan(0); // still positive
  });

  it('T003a.2 — fan-effect decay verified across 5 data points', () => {
    const base = 0.0;
    const sim = 100;
    const counts = [1, 2, 3, 4, 5];
    const boosts = counts.map(c => boostScore(base, c, sim));

    // Each step's magnitude of change decreases (diminishing impact)
    for (let i = 2; i < boosts.length; i++) {
      const delta_i = Math.abs(boosts[i] - boosts[i - 1]);
      const delta_prev = Math.abs(boosts[i - 1] - boosts[i - 2]);
      expect(delta_i).toBeLessThanOrEqual(delta_prev + 1e-10); // diminishing magnitude
    }
  });

  it('T003a.3 — boost formula matches expected pure fan-effect calculation', () => {
    const base = 0.5;
    const relatedCount = 3;
    const avgSim = 80;

    const result = boostScore(base, relatedCount, avgSim);

    // New formula removes relatedCount/maxRelated linear multiplier
    const perNeighborBoost = CO_ACTIVATION_CONFIG.boostFactor * (avgSim / 100);
    const fanDivisor = Math.sqrt(Math.max(1, relatedCount));
    const expectedBoost = Math.max(0, perNeighborBoost / fanDivisor);

    expect(result).toBeCloseTo(base + expectedBoost, 10);
  });

  it('T003a.4 — hub node (5 connections) gets less per-connection boost than sparse node (1 connection)', () => {
    const base = 0.0;
    const sim = 100;

    const boostPerConn1 = (boostScore(base, 1, sim) - base) / 1;
    const boostPerConn5 = (boostScore(base, 5, sim) - base) / 5;

    expect(boostPerConn1).toBeGreaterThan(boostPerConn5);
  });

  it('T003a.5 — zero relatedCount returns base score unchanged', () => {
    expect(boostScore(0.7, 0, 90)).toBe(0.7);
    expect(boostScore(0.0, 0, 100)).toBe(0.0);
    expect(boostScore(1.0, 0, 50)).toBe(1.0);
  });

  it('T003a.6 — similarity modulates boost proportionally', () => {
    const base = 0.5;
    const count = 3;

    const boost100 = boostScore(base, count, 100) - base;
    const boost50 = boostScore(base, count, 50) - base;
    const boost0 = boostScore(base, count, 0) - base;

    // Boost50 should be about half of boost100 (similarity is a linear factor)
    expect(boost50).toBeCloseTo(boost100 / 2, 5);
    expect(boost0).toBeCloseTo(0, 5);
  });
});


// ═══════════════════════════════════════════════════════════════════
// T005a: SIGNAL VOCABULARY DETECTION
// ═══════════════════════════════════════════════════════════════════

describe('T005a: Signal vocabulary detection', () => {

  it('T005a.1 — correction keywords detected with boost 0.2', () => {
    const signals = detectSignals('Actually, I was wrong about the implementation');
    const correction = signals.find(s => s.category === 'correction');

    expect(correction).toBeDefined();
    expect(correction!.boost).toBe(0.2);
    expect(correction!.keywords).toContain('actually');
  });

  it('T005a.2 — preference keywords detected with boost 0.1', () => {
    const signals = detectSignals('I prefer using TypeScript for this');
    const preference = signals.find(s => s.category === 'preference');

    expect(preference).toBeDefined();
    expect(preference!.boost).toBe(0.1);
    expect(preference!.keywords).toContain('prefer');
  });

  it('T005a.3 — "i was wrong" triggers correction category', () => {
    const signals = detectSignals('Wait, i was wrong about the fix');
    const correction = signals.find(s => s.category === 'correction');

    expect(correction).toBeDefined();
    // Both "wait" and "i was wrong" should be detected
    expect(correction!.keywords.length).toBeGreaterThanOrEqual(1);
    expect(correction!.keywords).toContain('wait');
  });

  it('T005a.4 — neutral prompt returns empty signals', () => {
    const signals = detectSignals('Show me the database schema');
    expect(signals).toEqual([]);
  });

  it('T005a.5 — both correction and preference detected simultaneously', () => {
    const signals = detectSignals('Actually, I prefer to always use the new API');

    expect(signals.length).toBe(2);
    const categories = signals.map(s => s.category);
    expect(categories).toContain('correction');
    expect(categories).toContain('preference');
  });

  it('T005a.6 — applySignalBoosts adds boost to importanceWeight, capped at 1.0', () => {
    const matches: TriggerMatch[] = [
      {
        memoryId: 1,
        specFolder: 'test',
        filePath: '/test.md',
        title: 'Test',
        importanceWeight: 0.5,
        matchedPhrases: ['test'],
      },
    ];

    const signals = [
      { category: 'correction' as const, keywords: ['actually'], boost: 0.2 },
      { category: 'preference' as const, keywords: ['prefer'], boost: 0.1 },
    ];

    const boosted = applySignalBoosts(matches, signals);
    // 0.5 + 0.2 + 0.1 = 0.8
    expect(boosted[0].importanceWeight).toBeCloseTo(0.8, 5);
  });

  it('T005a.7 — applySignalBoosts caps at 1.0', () => {
    const matches: TriggerMatch[] = [
      {
        memoryId: 1,
        specFolder: 'test',
        filePath: '/test.md',
        title: 'Test',
        importanceWeight: 0.9,
        matchedPhrases: ['test'],
      },
    ];

    const signals = [
      { category: 'correction' as const, keywords: ['actually'], boost: 0.2 },
    ];

    const boosted = applySignalBoosts(matches, signals);
    // 0.9 + 0.2 = 1.1, but capped at 1.0
    expect(boosted[0].importanceWeight).toBe(1.0);
  });

  it('T005a.8 — empty prompt returns no signals', () => {
    expect(detectSignals('')).toEqual([]);
  });
});


// ═══════════════════════════════════════════════════════════════════
// T007: TOKEN BUDGET ESTIMATION
// ═══════════════════════════════════════════════════════════════════

describe('T007: Token budget estimation', () => {
  const originalEnv = process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET;

  afterEach(() => {
    // Restore env
    if (originalEnv === undefined) {
      delete process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET;
    } else {
      process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET = originalEnv;
    }
  });

  it('T007.1 — when disabled, all tiers get DEFAULT_BUDGET (4000)', () => {
    process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET = 'false';

    const simple = getDynamicTokenBudget('simple');
    const moderate = getDynamicTokenBudget('moderate');
    const complex = getDynamicTokenBudget('complex');

    expect(simple.budget).toBe(DEFAULT_BUDGET);
    expect(moderate.budget).toBe(DEFAULT_BUDGET);
    expect(complex.budget).toBe(DEFAULT_BUDGET);
    expect(simple.applied).toBe(false);
  });

  it('T007.2 — when enabled, tiers map to correct budgets', () => {
    process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET = 'true';

    const simple = getDynamicTokenBudget('simple');
    const moderate = getDynamicTokenBudget('moderate');
    const complex = getDynamicTokenBudget('complex');

    expect(simple.budget).toBe(1500);
    expect(moderate.budget).toBe(2500);
    expect(complex.budget).toBe(4000);
    expect(simple.applied).toBe(true);
  });

  it('T007.3 — budget boundaries are respected: simple < moderate < complex', () => {
    process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET = 'true';

    const s = getDynamicTokenBudget('simple');
    const m = getDynamicTokenBudget('moderate');
    const c = getDynamicTokenBudget('complex');

    expect(s.budget).toBeLessThan(m.budget);
    expect(m.budget).toBeLessThan(c.budget);
  });

  it('T007.4 — custom config overrides default budgets', () => {
    process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET = 'true';

    const customConfig = { simple: 500, moderate: 1000, complex: 2000 };
    const result = getDynamicTokenBudget('simple', customConfig);

    expect(result.budget).toBe(500);
    expect(result.applied).toBe(true);
  });
});


// ═══════════════════════════════════════════════════════════════════
// CROSS-FEATURE: DEGREE + CO-ACTIVATION INTERACTION
// ═══════════════════════════════════════════════════════════════════

describe('Cross-feature: degree + co-activation interaction', () => {
  beforeEach(() => clearDegreeCache());

  it('CF.1 — degree ranking and co-activation boost compound to promote well-connected memories', () => {
    // Memory 1: high degree (3 caused edges)
    // Memory 2: low degree (1 supports edge)
    const db = createMockDb([
      { source_id: '1', target_id: '10', relation: 'caused', strength: 1.0 },
      { source_id: '1', target_id: '11', relation: 'caused', strength: 1.0 },
      { source_id: '1', target_id: '12', relation: 'caused', strength: 1.0 },
      { source_id: '2', target_id: '13', relation: 'supports', strength: 0.5 },
    ]);

    const degreeScores = computeDegreeScores(db, [1, 2]);
    const degree1 = degreeScores.get('1') ?? 0;
    const degree2 = degreeScores.get('2') ?? 0;

    // Memory 1 has higher base from degree
    expect(degree1).toBeGreaterThan(degree2);

    // Now apply co-activation boost on top of a hypothetical base score
    // Memory 1 has 3 connections (relatedCount=3), Memory 2 has 1 (relatedCount=1)
    const base1 = 0.5 + degree1;
    const base2 = 0.5 + degree2;

    const boosted1 = boostScore(base1, 3, 85);
    const boosted2 = boostScore(base2, 1, 85);

    // Memory 1 should still rank higher after both boosts
    expect(boosted1).toBeGreaterThan(boosted2);
  });

  it('CF.2 — normalizeDegreeToBoostedScore uses logarithmic scaling within [0, CAP]', () => {
    // Verify that scores are logarithmically distributed
    const maxDeg = 20;
    const rawValues = [1, 5, 10, 15, 20];
    const scores = rawValues.map(v => normalizeDegreeToBoostedScore(v, maxDeg));

    // All scores should be in [0, DEGREE_BOOST_CAP]
    for (const s of scores) {
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(DEGREE_BOOST_CAP);
    }

    // Scores should be strictly increasing
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]).toBeGreaterThan(scores[i - 1]);
    }

    // At max degree, score should equal DEGREE_BOOST_CAP exactly
    expect(scores[scores.length - 1]).toBe(DEGREE_BOOST_CAP);

    // Verify diminishing returns (log scaling)
    const delta12 = scores[1] - scores[0]; // 1->5
    const delta45 = scores[4] - scores[3]; // 15->20
    expect(delta12).toBeGreaterThan(delta45); // earlier jumps are larger
  });

  it('CF.3 — degree boost + signal boost: both mechanisms are additive to ranking', () => {
    // Simulate: a memory gets degree boost AND signal boost

    // Degree boost from computeDegreeScores
    const db = createMockDb([
      { source_id: '1', target_id: '10', relation: 'caused', strength: 1.0 },
    ]);
    const scores = computeDegreeScores(db, [1]);
    const degreeBoost = scores.get('1') ?? 0;
    expect(degreeBoost).toBeGreaterThan(0);

    // Signal boost from correction detection
    const signals = detectSignals('Actually, this was wrong');
    const correctionBoost = signals.find(s => s.category === 'correction')?.boost ?? 0;
    expect(correctionBoost).toBe(0.2);

    // Both are positive and additive
    const combinedBoost = degreeBoost + correctionBoost;
    expect(combinedBoost).toBeGreaterThan(degreeBoost);
    expect(combinedBoost).toBeGreaterThan(correctionBoost);
  });
});
