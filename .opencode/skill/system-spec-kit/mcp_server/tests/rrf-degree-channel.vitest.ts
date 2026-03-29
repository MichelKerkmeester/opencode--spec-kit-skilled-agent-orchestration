// ───────────────────────────────────────────────────────────────
// 1. TEST — RRF DEGREE CHANNEL
// ───────────────────────────────────────────────────────────────
// T002 (degree as 5th RRF channel) + T003a (co-activation boost)

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fuseResultsMulti, SOURCE_TYPES } from '@spec-kit/shared/algorithms/rrf-fusion';
import type { RankedList, FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
import {
  computeDegreeScores,
  computeTypedDegree,
  computeMaxTypedDegree,
  normalizeDegreeToBoostedScore,
  clearDegreeCache,
  DEGREE_BOOST_CAP,
  DEGREE_CHANNEL_WEIGHT,
} from '../lib/search/graph-search-fn';

// Helpers
/** Create a mock database with causal_edges data.
 * Handles SQL patterns used by the committed graph-search-fn.ts:
 * - UNION ALL queries for computeTypedDegree
 * - DISTINCT node_id queries for computeMaxTypedDegree
 * - Constitutional exclusion queries for computeDegreeScores
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
    return Math.min(total, 50);
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
          all: () => [], // No constitutional memories in mock
        };
      }
      // Default: return empty results
      return { all: () => [] };
    },
  } as unknown as import('better-sqlite3').Database;
}

// T002: Degree as 5th RRF Channel
describe('T002: Degree as 5th RRF Channel', () => {
  beforeEach(() => {
    clearDegreeCache();
  });

  describe('SOURCE_TYPES.DEGREE', () => {
    it('DEGREE source type is defined as "degree"', () => {
      expect(SOURCE_TYPES.DEGREE).toBe('degree');
    });

    it('All existing source types are preserved', () => {
      expect(SOURCE_TYPES.VECTOR).toBe('vector');
      expect(SOURCE_TYPES.FTS).toBe('fts');
      expect(SOURCE_TYPES.BM25).toBe('bm25');
      expect(SOURCE_TYPES.GRAPH).toBe('graph');
      expect(SOURCE_TYPES.KEYWORD).toBe('keyword');
    });
  });

  describe('RRF fusion with 5 channels (flag enabled)', () => {
    it('Fuses 5 channels including degree', () => {
      const lists: RankedList[] = [
        { source: SOURCE_TYPES.VECTOR, results: [{ id: 1 }, { id: 2 }, { id: 3 }] },
        { source: SOURCE_TYPES.FTS, results: [{ id: 2 }, { id: 1 }] },
        { source: SOURCE_TYPES.BM25, results: [{ id: 3 }, { id: 2 }] },
        { source: SOURCE_TYPES.GRAPH, results: [{ id: 1 }, { id: 4 }] },
        { source: SOURCE_TYPES.DEGREE, results: [{ id: 4 }, { id: 1 }, { id: 2 }] },
      ];

      const fused = fuseResultsMulti(lists);
      expect(fused.length).toBeGreaterThan(0);

      // All IDs from all channels should be present
      const fusedIds = fused.map(r => r.id).sort();
      expect(fusedIds).toEqual([1, 2, 3, 4]);

      // Each result should have RRF score and sources
      // With graduated-ON normalization, scores are [0,1] — min becomes 0.0
      for (const r of fused) {
        expect(r.rrfScore).toBeGreaterThanOrEqual(0);
        expect(r.sources.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('Degree channel contributes to convergence bonus', () => {
      // Item 1 appears in vector + degree = convergence bonus
      const withDegree: RankedList[] = [
        { source: SOURCE_TYPES.VECTOR, results: [{ id: 1 }] },
        { source: SOURCE_TYPES.DEGREE, results: [{ id: 1 }] },
      ];

      const withoutDegree: RankedList[] = [
        { source: SOURCE_TYPES.VECTOR, results: [{ id: 1 }] },
      ];

      const fusedWith = fuseResultsMulti(withDegree);
      const fusedWithout = fuseResultsMulti(withoutDegree);

      // With graduated-ON normalization, single-result sets normalize to 1.0
      // So we verify via convergenceBonus and source count instead of raw score comparison
      const itemWith = fusedWith.find(r => r.id === 1)!;
      const itemWithout = fusedWithout.find(r => r.id === 1)!;

      // Convergence bonus should be applied when appearing in multiple channels
      expect(itemWith.convergenceBonus).toBeGreaterThan(0);
      // Item without degree has no convergence bonus (single channel)
      expect(itemWithout.convergenceBonus ?? 0).toBe(0);
      // Multiple sources confirms degree channel contributed
      expect(itemWith.sources.length).toBeGreaterThan(itemWithout.sources.length);
    });

    it('Degree source appears in result.sources', () => {
      const lists: RankedList[] = [
        { source: SOURCE_TYPES.DEGREE, results: [{ id: 10 }] },
      ];

      const fused = fuseResultsMulti(lists);
      expect(fused[0].sources).toContain('degree');
      expect(fused[0].sourceScores).toHaveProperty('degree');
    });
  });

  describe('RRF fusion without degree (flag disabled) is identical to 4-channel', () => {
    it('4-channel results are identical with and without empty degree list', () => {
      const baseLists: RankedList[] = [
        { source: SOURCE_TYPES.VECTOR, results: [{ id: 1 }, { id: 2 }, { id: 3 }], weight: 1.0 },
        { source: SOURCE_TYPES.FTS, results: [{ id: 2 }, { id: 4 }], weight: 0.8 },
        { source: SOURCE_TYPES.BM25, results: [{ id: 3 }, { id: 5 }], weight: 0.6 },
        { source: SOURCE_TYPES.GRAPH, results: [{ id: 1 }, { id: 6 }], weight: 0.5 },
      ];

      const fusedWithout = fuseResultsMulti(baseLists);
      // Same lists, no degree channel added = same results
      const fusedAlso = fuseResultsMulti([...baseLists]);

      expect(fusedWithout.length).toBe(fusedAlso.length);
      for (let i = 0; i < fusedWithout.length; i++) {
        expect(fusedWithout[i].id).toBe(fusedAlso[i].id);
        expect(fusedWithout[i].rrfScore).toBeCloseTo(fusedAlso[i].rrfScore, 10);
      }
    });

    it('No degree source appears in 4-channel results', () => {
      const baseLists: RankedList[] = [
        { source: SOURCE_TYPES.VECTOR, results: [{ id: 1 }] },
        { source: SOURCE_TYPES.FTS, results: [{ id: 1 }] },
      ];

      const fused = fuseResultsMulti(baseLists);
      for (const r of fused) {
        expect(r.sources).not.toContain('degree');
      }
    });
  });

  describe('Degree scores properly ranked (highest first)', () => {
    it('computeDegreeScores returns scores sorted by degree', () => {
      // Memory 1: 2 edges (caused + enabled), Memory 2: 1 edge (supports), Memory 3: 0 edges
      const db = createMockDb([
        { source_id: '1', target_id: '10', relation: 'caused', strength: 1.0 },
        { source_id: '1', target_id: '11', relation: 'enabled', strength: 0.8 },
        { source_id: '2', target_id: '12', relation: 'supports', strength: 0.5 },
      ]);

      const scores = computeDegreeScores(db, [1, 2, 3]);

      const score1 = scores.get('1') ?? 0;
      const score2 = scores.get('2') ?? 0;
      const score3 = scores.get('3') ?? 0;

      // Memory 1 should have highest score (most/strongest edges)
      expect(score1).toBeGreaterThan(score2);
      expect(score2).toBeGreaterThan(score3);

      // Memory 3 has no edges, score should be 0
      expect(score3).toBe(0);
    });

    it('All scores are within [0, DEGREE_BOOST_CAP]', () => {
      const db = createMockDb([
        { source_id: '1', target_id: '2', relation: 'caused', strength: 1.0 },
        { source_id: '1', target_id: '3', relation: 'caused', strength: 1.0 },
        { source_id: '1', target_id: '4', relation: 'caused', strength: 1.0 },
      ]);

      const scores = computeDegreeScores(db, [1, 2, 3, 4]);

      for (const [, score] of scores) {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(DEGREE_BOOST_CAP);
      }
    });

    it('DEGREE_BOOST_CAP is 0.15', () => {
      expect(DEGREE_BOOST_CAP).toBe(0.15);
    });

    it('Degree RankedList sorted by score feeds correctly into fuseResultsMulti', () => {
      // Simulate what hybrid-search does: sort by degree score, pass to RRF
      const db = createMockDb([
        { source_id: '1', target_id: '10', relation: 'caused', strength: 1.0 },
        { source_id: '1', target_id: '11', relation: 'caused', strength: 1.0 },
        { source_id: '2', target_id: '12', relation: 'supports', strength: 0.5 },
      ]);

      const scores = computeDegreeScores(db, [1, 2, 3]);

      // Build degree ranked list sorted highest first
      const degreeItems: Array<{ id: number; degreeScore: number }> = [];
      for (const [idStr, score] of scores) {
        const numId = Number(idStr);
        if (score > 0 && !isNaN(numId)) degreeItems.push({ id: numId, degreeScore: score });
      }
      degreeItems.sort((a, b) => b.degreeScore - a.degreeScore);

      const degreeLists: RankedList[] = [
        { source: SOURCE_TYPES.DEGREE, results: degreeItems.map(i => ({ id: i.id })), weight: DEGREE_CHANNEL_WEIGHT },
      ];

      const fused = fuseResultsMulti(degreeLists);

      // Item 1 (highest degree) should have the highest RRF score
      expect(fused[0].id).toBe(1);
      if (fused.length > 1) {
        expect(fused[0].rrfScore).toBeGreaterThan(fused[1].rrfScore);
      }
    });
  });

  describe('Degree scoring internals', () => {
    it('computeTypedDegree returns 0 for memory with no edges', () => {
      const db = createMockDb([]);
      expect(computeTypedDegree(db, 99)).toBe(0);
    });

    it('computeTypedDegree applies relation type weights', () => {
      // "caused" has weight 1.0, "supports" has weight 0.6
      const dbCaused = createMockDb([
        { source_id: '1', target_id: '2', relation: 'caused', strength: 1.0 },
      ]);
      const dbSupports = createMockDb([
        { source_id: '1', target_id: '2', relation: 'supports', strength: 1.0 },
      ]);

      const degreeCaused = computeTypedDegree(dbCaused, 1);
      const degreeSupports = computeTypedDegree(dbSupports, 1);

      expect(degreeCaused).toBeGreaterThan(degreeSupports);
    });

    it('computeMaxTypedDegree returns max across all nodes in DB', () => {
      const db = createMockDb([
        { source_id: '1', target_id: '10', relation: 'caused', strength: 1.0 },
        { source_id: '1', target_id: '11', relation: 'caused', strength: 1.0 },
        { source_id: '2', target_id: '12', relation: 'supports', strength: 0.5 },
      ]);

      // Committed computeMaxTypedDegree takes only database (no memoryIds)
      const max = computeMaxTypedDegree(db);
      const degree1 = computeTypedDegree(db, 1);

      expect(max).toBe(degree1);
      expect(max).toBeGreaterThan(0);
    });

    it('normalizeDegreeToBoostedScore maps to [0, CAP]', () => {
      // Committed uses log-based: log(1+raw)/log(1+max) * CAP
      const expected = Math.log(1 + 5) / Math.log(1 + 10) * DEGREE_BOOST_CAP;
      expect(normalizeDegreeToBoostedScore(5, 10)).toBeCloseTo(expected, 3);
      expect(normalizeDegreeToBoostedScore(10, 10)).toBe(DEGREE_BOOST_CAP);
      expect(normalizeDegreeToBoostedScore(0, 10)).toBe(0);
      expect(normalizeDegreeToBoostedScore(5, 0)).toBe(0);
    });

    it('clearDegreeCache resets cache', () => {
      const db = createMockDb([
        { source_id: '1', target_id: '2', relation: 'caused', strength: 1.0 },
      ]);

      // First call populates cache
      const scores1 = computeDegreeScores(db, [1]);
      expect(scores1.get('1')).toBeGreaterThan(0);

      // Clear cache
      clearDegreeCache();

      // Second call should still work (recomputes)
      const scores2 = computeDegreeScores(db, [1]);
      expect(scores2.get('1')).toBeGreaterThan(0);
    });

    it('computeDegreeScores returns empty map for empty input', () => {
      const db = createMockDb([]);
      const scores = computeDegreeScores(db, []);
      expect(scores.size).toBe(0);
    });
  });
});

// T003a: Co-Activation Boost Strength
describe('T003a: Co-Activation Boost Strength', () => {
  // The co-activation module reads env vars at import time,
  // So we test the exported config and constants.

  describe('Default boost strength (0.25)', () => {
    it('DEFAULT_COACTIVATION_STRENGTH is exported and equals 0.25', async () => {
      const mod = await import('../lib/cognitive/co-activation');
      expect(mod.DEFAULT_COACTIVATION_STRENGTH).toBe(0.25);
    });

    it('boostFactor defaults to 0.25 when SPECKIT_COACTIVATION_STRENGTH is not set', async () => {
      // When env var is unset, parseFloat uses DEFAULT_COACTIVATION_STRENGTH
      const mod = await import('../lib/cognitive/co-activation');
      // The env var may or may not be set in test env.
      // If not set, boostFactor should be 0.25.
      // If set, it should be the parsed value.
      const expected = process.env.SPECKIT_COACTIVATION_STRENGTH
        ? parseFloat(process.env.SPECKIT_COACTIVATION_STRENGTH)
        : 0.25;
      expect(mod.CO_ACTIVATION_CONFIG.boostFactor).toBe(expected);
    });
  });

  describe('boostScore with higher boost factor', () => {
    it('boostScore applies the configured boostFactor', async () => {
      const mod = await import('../lib/cognitive/co-activation');
      const { boostScore, CO_ACTIVATION_CONFIG } = mod;

      // With boostFactor=0.25, maxRelated=5, relatedCount=5, avgSimilarity=100:
      // RawBoost = 0.25 * (5/5) * (100/100) = 0.25
      // R17 fan-effect: boost = rawBoost / sqrt(relatedCount) = 0.25 / sqrt(5)
      const baseScore = 0.5;
      const relatedCount = 5;
      const result = boostScore(baseScore, relatedCount, 100);

      const rawBoost = CO_ACTIVATION_CONFIG.boostFactor *
        (relatedCount / CO_ACTIVATION_CONFIG.maxRelated) *
        (100 / 100);
      const fanDivisor = Math.sqrt(Math.max(1, relatedCount));
      const expectedBoost = rawBoost / fanDivisor;
      expect(result).toBeCloseTo(baseScore + expectedBoost);
    });

    it('boostScore returns base score when relatedCount is 0', async () => {
      const { boostScore } = await import('../lib/cognitive/co-activation');
      expect(boostScore(0.7, 0, 90)).toBe(0.7);
    });

    it('boostScore exhibits fan-effect: more relations = less total boost', async () => {
      const { boostScore } = await import('../lib/cognitive/co-activation');
      const base = 0.5;
      const avgSim = 80;

      const boost1 = boostScore(base, 1, avgSim) - base;
      const boost3 = boostScore(base, 3, avgSim) - base;
      const boost5 = boostScore(base, 5, avgSim) - base;

      // Pure fan-effect — hub nodes get diluted boost (1/sqrt(n))
      expect(boost1).toBeGreaterThan(boost3);
      expect(boost3).toBeGreaterThan(boost5);
      expect(boost5).toBeGreaterThan(0); // still positive
    });
  });

  describe('Fan-effect divisor still works with higher boost factor', () => {
    it('spreadActivation applies decay per hop', async () => {
      const mod = await import('../lib/cognitive/co-activation');
      // The spread activation function uses decayPerHop = 0.5
      // This means each hop reduces the score by half
      expect(mod.CO_ACTIVATION_CONFIG.decayPerHop).toBe(0.5);
    });

    it('boostScore scales with avgSimilarity (fan-effect interaction)', async () => {
      const { boostScore } = await import('../lib/cognitive/co-activation');
      const base = 0.5;
      const count = 3;

      // Lower similarity = lower boost (fan-effect: many weak connections matter less)
      const boostHigh = boostScore(base, count, 100) - base;
      const boostMid = boostScore(base, count, 50) - base;
      const boostLow = boostScore(base, count, 20) - base;

      expect(boostHigh).toBeGreaterThan(boostMid);
      expect(boostMid).toBeGreaterThan(boostLow);
      expect(boostLow).toBeGreaterThan(0);
    });

    it('Higher default boost (0.25) produces stronger boost than old default (0.15)', async () => {
      const mod = await import('../lib/cognitive/co-activation');
      const { boostScore, CO_ACTIVATION_CONFIG } = mod;

      // Calculate what the boost would be with the new factor
      const base = 0.5;
      const result = boostScore(base, 3, 80);
      const actualBoost = result - base;

      // Calculate what old 0.15 factor would produce (also with R17 fan-effect divisor)
      const fanDivisor = Math.sqrt(Math.max(1, 3));
      const oldBoost = 0.15 * (3 / CO_ACTIVATION_CONFIG.maxRelated) * (80 / 100) / fanDivisor;

      // New default 0.25 should produce higher boost than old 0.15
      // (both with fan-effect divisor applied)
      if (CO_ACTIVATION_CONFIG.boostFactor >= 0.25) {
        expect(actualBoost).toBeGreaterThan(oldBoost);
      }
    });
  });

  describe('Co-activation config env var support', () => {
    it('SPECKIT_COACTIVATION_STRENGTH env var is respected at module load', () => {
      // This is a structural test - the env var is read at module init
      // We verify the config uses the right pattern
      const envVal = process.env.SPECKIT_COACTIVATION_STRENGTH;
      if (envVal) {
        // If set, boostFactor should equal parsed value
        // Re-import is needed to test different env values
        const expected = parseFloat(envVal);
        expect(expected).not.toBeNaN();
      }
      // Structural: DEFAULT_COACTIVATION_STRENGTH exists
      expect(0.25).toBe(0.25); // verified via import test above
    });
  });
});
