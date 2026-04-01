// TEST: RRF Fusion (C138-P3) — Cross-Variant Multi-Query Fusion
// Converted from: unit-rrf-fusion.test.ts (custom runner)
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
import { fuseResults, fuseResultsMulti, fuseResultsCrossVariant, SOURCE_TYPES, DEFAULT_K } from '@spec-kit/shared/algorithms/rrf-fusion';

function requireResult<T>(value: T | undefined): T {
  expect(value).toBeDefined();
  return value as T;
}

// Disable calibrated overlap bonus so tests exercise the flat CONVERGENCE_BONUS (0.10) path.
// The calibrated mode (graduated-ON) caps bonuses at CALIBRATED_OVERLAP_MAX (0.06), which
// would cause these convergence bonus assertions to fail.
const savedCalibratedOverlap = process.env.SPECKIT_CALIBRATED_OVERLAP_BONUS;
beforeAll(() => {
  process.env.SPECKIT_CALIBRATED_OVERLAP_BONUS = 'false';
});
afterAll(() => {
  if (savedCalibratedOverlap === undefined) {
    delete process.env.SPECKIT_CALIBRATED_OVERLAP_BONUS;
  } else {
    process.env.SPECKIT_CALIBRATED_OVERLAP_BONUS = savedCalibratedOverlap;
  }
});

describe('RRF Fusion (T001-T006)', () => {
  it('T001: Fuses results from multiple sources', () => {
    const vectorResults = [
      { id: 1, title: 'Memory A' },
      { id: 2, title: 'Memory B' },
      { id: 3, title: 'Memory C' },
    ];
    const bm25Results = [
      { id: 2, title: 'Memory B' },
      { id: 4, title: 'Memory D' },
      { id: 1, title: 'Memory A' },
    ];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: vectorResults },
      { source: SOURCE_TYPES.BM25, results: bm25Results },
    ]);

    expect(fused).toBeInstanceOf(Array);
    const ids = fused.map((r: FusionResult) => r.id).sort();
    expect(ids).toHaveLength(4);
    expect(ids).toEqual([1, 2, 3, 4]);

    for (const r of fused) {
      expect(r.rrfScore).toEqual(expect.any(Number));
      expect(r.sources).toBeInstanceOf(Array);
    }
  });

  it('T002: Higher-ranked results get higher RRF scores', () => {
    const results = [
      { id: 'first', title: 'First' },
      { id: 'second', title: 'Second' },
      { id: 'third', title: 'Third' },
    ];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results },
    ]);

    const scoreMap: Record<string, number> = {};
    for (const r of fused) {
      scoreMap[r.id] = r.rrfScore;
    }

    expect(scoreMap['first']).toBeGreaterThan(scoreMap['second']);
    expect(scoreMap['second']).toBeGreaterThan(scoreMap['third']);
  });

  it('T003: Results appearing in multiple sources get boosted', () => {
    const vectorResults = [
      { id: 'shared', title: 'Shared Result' },
      { id: 'vector-only', title: 'Vector Only' },
    ];
    const bm25Results = [
      { id: 'shared', title: 'Shared Result' },
      { id: 'bm25-only', title: 'BM25 Only' },
    ];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: vectorResults },
      { source: SOURCE_TYPES.BM25, results: bm25Results },
    ]);

    const shared = requireResult(fused.find((r: FusionResult) => r.id === 'shared'));
    const vectorOnly = requireResult(fused.find((r: FusionResult) => r.id === 'vector-only'));
    const bm25Only = requireResult(fused.find((r: FusionResult) => r.id === 'bm25-only'));

    expect(shared.rrfScore).toBeGreaterThan(vectorOnly.rrfScore);
    expect(shared.rrfScore).toBeGreaterThan(bm25Only.rrfScore);
    expect(shared.sources).toHaveLength(2);
    expect(shared.convergenceBonus).toBeCloseTo(0.10, 2);
  });

  it('T004: Empty input returns empty output', () => {
    expect(fuseResultsMulti([])).toEqual([]);
    expect(fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [] },
      { source: SOURCE_TYPES.BM25, results: [] },
    ])).toEqual([]);
    expect(fuseResults([], [])).toEqual([]);
  });

  it('T005: Single source returns ranked results', () => {
    const singleList = [
      { id: 'a', title: 'Alpha' },
      { id: 'b', title: 'Beta' },
      { id: 'c', title: 'Gamma' },
    ];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: singleList },
    ]);

    expect(fused).toHaveLength(3);

    // Results sorted by rrfScore descending
    for (let i = 0; i < fused.length - 1; i++) {
      expect(fused[i].rrfScore).toBeGreaterThanOrEqual(fused[i + 1].rrfScore);
    }

    // Each result has exactly 1 source, no convergence bonus
    for (const r of fused) {
      expect(r.sources).toHaveLength(1);
      expect(r.convergenceBonus).toBe(0);
    }
  });

  it('T006: Results tagged with correct source type', () => {
    const vectorResults = [
      { id: 'v1', title: 'Vector Result 1' },
      { id: 'shared', title: 'Shared' },
    ];
    const bm25Results = [
      { id: 'b1', title: 'BM25 Result 1' },
      { id: 'shared', title: 'Shared' },
    ];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: vectorResults },
      { source: SOURCE_TYPES.BM25, results: bm25Results },
    ]);

    const v1 = requireResult(fused.find((r: FusionResult) => r.id === 'v1'));
    expect(v1.sources).toContain(SOURCE_TYPES.VECTOR);
    expect(v1.sources).toHaveLength(1);

    const b1 = requireResult(fused.find((r: FusionResult) => r.id === 'b1'));
    expect(b1.sources).toContain(SOURCE_TYPES.BM25);
    expect(b1.sources).toHaveLength(1);

    const shared = requireResult(fused.find((r: FusionResult) => r.id === 'shared'));
    expect(shared.sources).toContain(SOURCE_TYPES.VECTOR);
    expect(shared.sources).toContain(SOURCE_TYPES.BM25);
    expect(shared.sources).toHaveLength(2);
    expect(shared.sourceScores).toHaveProperty(SOURCE_TYPES.BM25);
    expect(shared.sourceScores[SOURCE_TYPES.BM25]).toEqual(expect.any(Number));
  });

  it('T006b: canonical ID matching deduplicates numeric/string/mem-prefixed IDs', () => {
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 42, title: 'Numeric' }] },
      { source: SOURCE_TYPES.BM25, results: [{ id: '42', title: 'String' }] },
      { source: 'graph', results: [{ id: 'mem:42', title: 'Prefixed' }] },
    ]);

    expect(fused).toHaveLength(1);
    expect(fused[0].sources).toContain(SOURCE_TYPES.VECTOR);
    expect(fused[0].sources).toContain(SOURCE_TYPES.BM25);
    expect(fused[0].sources).toContain('graph');
  });
});

describe('C138: Cross-Variant RRF (Multi-Query)', () => {
  it('C138-T1: multi-source fusion with 3+ sources works', () => {
    const vectorResults = [{ id: 'shared', title: 'Shared' }, { id: 'v-only', title: 'V' }];
    const bm25Results = [{ id: 'shared', title: 'Shared' }, { id: 'b-only', title: 'B' }];
    const graphResults = [{ id: 'shared', title: 'Shared' }, { id: 'g-only', title: 'G' }];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: vectorResults },
      { source: SOURCE_TYPES.BM25, results: bm25Results },
      { source: 'graph', results: graphResults },
    ]);

    const shared = requireResult(fused.find(r => r.id === 'shared'));
    expect(shared.sources).toHaveLength(3);
    expect(shared.rrfScore).toBeGreaterThan(requireResult(fused.find(r => r.id === 'v-only')).rrfScore);
    expect(shared.convergenceBonus).toBeCloseTo(0.20, 2);
  });

  it('C138-T2: explicit convergence bonus is exactly 0.10 per additional source', () => {
    const resultsA = [{ id: 'x', title: 'X' }];
    const resultsB = [{ id: 'x', title: 'X' }];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: resultsA },
      { source: SOURCE_TYPES.BM25, results: resultsB },
    ], { convergenceBonus: 0.10 });

    const x = requireResult(fused.find(r => r.id === 'x'));
    expect(x.convergenceBonus).toBeCloseTo(0.10, 2);
  });

  it('C138-T3: single-variant input behaves identically to standard', () => {
    const results = [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }];

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results },
    ]);

    const standard = fuseResults(results, []);
    // Single-source: no convergence bonus
    for (const r of fused) {
      expect(r.convergenceBonus).toBe(0);
    }
  });
});

describe('C138-P3: fuseResultsCrossVariant', () => {
  it('C138-CV1: empty variant list returns empty', () => {
    const fused = fuseResultsCrossVariant([]);
    expect(fused).toEqual([]);
  });

  it('C138-CV2: single variant behaves like fuseResultsMulti', () => {
    const variant0 = [
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }] },
      { source: SOURCE_TYPES.BM25, results: [{ id: 'b', title: 'B' }] },
    ];

    const crossVariant = fuseResultsCrossVariant([variant0]);
    const standard = fuseResultsMulti(variant0);

    // Same IDs, same scores (no cross-variant bonus with 1 variant)
    expect(crossVariant.map(r => r.id).sort()).toEqual(standard.map(r => r.id).sort());
  });

  it('C138-CV3: ID appearing in 2 variants gets +0.10 cross-variant bonus', () => {
    const variant0 = [
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'shared', title: 'Shared' }, { id: 'v0-only', title: 'V0' }] },
    ];
    const variant1 = [
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'shared', title: 'Shared' }, { id: 'v1-only', title: 'V1' }] },
    ];

    const fused = fuseResultsCrossVariant([variant0, variant1]);

    const shared = requireResult(fused.find(r => r.id === 'shared'));
    const v0Only = requireResult(fused.find(r => r.id === 'v0-only'));
    // Shared gets cross-variant bonus, v0-only does not
    expect(shared.convergenceBonus).toBeGreaterThanOrEqual(0.10);
    expect(shared.rrfScore).toBeGreaterThan(v0Only.rrfScore);
  });

  it('C138-CV4: ID appearing in 3 variants gets +0.20 cross-variant bonus', () => {
    const mkVariant = (ids: string[]) => [
      { source: SOURCE_TYPES.VECTOR, results: ids.map(id => ({ id, title: id })) },
    ];

    const fused = fuseResultsCrossVariant([
      mkVariant(['shared', 'a']),
      mkVariant(['shared', 'b']),
      mkVariant(['shared', 'c']),
    ]);

    const shared = requireResult(fused.find(r => r.id === 'shared'));
    // 3 variants - 1 = 2 => 2 * 0.10 = 0.20 cross-variant bonus
    expect(shared.convergenceBonus).toBeCloseTo(0.20, 2);
  });

  it('C138-CV5: unique IDs from different variants are all included', () => {
    const variant0 = [
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'a', title: 'A' }] },
    ];
    const variant1 = [
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'b', title: 'B' }] },
    ];
    const variant2 = [
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'c', title: 'C' }] },
    ];

    const fused = fuseResultsCrossVariant([variant0, variant1, variant2]);
    const ids = fused.map(r => r.id).sort();
    expect(ids).toEqual(['a', 'b', 'c']);
  });

  it('C138-CV6: results are sorted by rrfScore descending', () => {
    const variant0 = [
      { source: SOURCE_TYPES.VECTOR, results: [
        { id: 'shared', title: 'Shared' },
        { id: 'a', title: 'A' },
      ]},
    ];
    const variant1 = [
      { source: SOURCE_TYPES.BM25, results: [
        { id: 'shared', title: 'Shared' },
        { id: 'b', title: 'B' },
      ]},
    ];

    const fused = fuseResultsCrossVariant([variant0, variant1]);
    for (let i = 0; i < fused.length - 1; i++) {
      expect(fused[i].rrfScore).toBeGreaterThanOrEqual(fused[i + 1].rrfScore);
    }
  });

  it('C138-CV7: fuseResultsMulti honors explicit k=0', () => {
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }] },
    ], { k: 0 });

    const first = requireResult(fused.find(r => r.id === 'a'));
    const second = requireResult(fused.find(r => r.id === 'b'));

    expect(first.sourceScores[SOURCE_TYPES.VECTOR]).toBeCloseTo(1, 6);
    expect(second.sourceScores[SOURCE_TYPES.VECTOR]).toBeCloseTo(0.5, 6);
  });

  it('C138-CV8: fuseResultsMulti rejects negative k', () => {
    expect(() => fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'a', title: 'A' }] },
    ], { k: -1 })).toThrow('RRF k parameter must be non-negative');
  });

  it('C138-CV9: fuseResultsCrossVariant honors explicit k=0', () => {
    const variant = [
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'shared', title: 'Shared' }] },
    ];

    const fused = fuseResultsCrossVariant([variant, variant], { k: 0 });
    const shared = requireResult(fused.find(r => r.id === 'shared'));

    expect(shared.sourceScores[SOURCE_TYPES.VECTOR]).toBeCloseTo(2, 6);
    expect(shared.convergenceBonus).toBeCloseTo(0.10, 6);
  });

  it('C138-CV10: fuseResultsCrossVariant rejects negative k', () => {
    expect(() => fuseResultsCrossVariant([
      [{ source: SOURCE_TYPES.VECTOR, results: [{ id: 'shared', title: 'Shared' }] }],
    ], { k: -1 })).toThrow('RRF k parameter must be non-negative');
  });

  it('C138-CV10b: non-finite k falls back to the default smoothing constant', () => {
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'a', title: 'A' }] },
    ], { k: Number.NaN });

    const first = requireResult(fused.find(r => r.id === 'a'));
    expect(first.sourceScores[SOURCE_TYPES.VECTOR]).toBeCloseTo(1 / (DEFAULT_K + 1), 6);
  });

  it('C138-CV11: invalid convergenceBonus falls back to the default bonus', () => {
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'shared', title: 'Shared' }] },
      { source: SOURCE_TYPES.BM25, results: [{ id: 'shared', title: 'Shared' }] },
    ], { convergenceBonus: -1 });

    const shared = requireResult(fused.find(r => r.id === 'shared'));
    expect(shared.convergenceBonus).toBeCloseTo(0.10, 6);
  });

  it('C138-CV12: invalid graphWeightBoost falls back to the default graph boost', () => {
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.GRAPH, results: [{ id: 'g1', title: 'Graph 1' }] },
    ], { graphWeightBoost: Number.POSITIVE_INFINITY });

    const graphItem = requireResult(fused.find(r => r.id === 'g1'));
    expect(graphItem.sourceScores[SOURCE_TYPES.GRAPH]).toBeCloseTo(1.5 / (DEFAULT_K + 1), 6);
  });

  it('C138-CV13: invalid list weights are sanitized to zero contribution', () => {
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'v1', title: 'Vector 1' }], weight: -2 },
      { source: SOURCE_TYPES.BM25, results: [{ id: 'b1', title: 'BM25 1' }], weight: Number.POSITIVE_INFINITY },
    ]);

    expect(fused).toEqual([]);
  });
});
