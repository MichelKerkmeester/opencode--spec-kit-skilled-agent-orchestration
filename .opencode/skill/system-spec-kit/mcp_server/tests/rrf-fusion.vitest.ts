// TEST: RRF FUSION
// Converted from: rrf-fusion.test.ts (custom runner)
import { describe, it, expect } from 'vitest';
import {
  fuseResults,
  fuseResultsMulti,
  unifiedSearch,
  fuseScoresAdvanced,
  countOriginalTermMatches,
  DEFAULT_K,
  CONVERGENCE_BONUS,
  GRAPH_WEIGHT_BOOST,
  SOURCE_TYPES,
  isRrfEnabled,
} from '@spec-kit/shared/algorithms/rrf-fusion';

type FusedResult = ReturnType<typeof fuseResults>[number];
type MultiFusedResult = ReturnType<typeof fuseResultsMulti>[number];

function expectDefined<T>(value: T | undefined, label: string): T {
  expect(value).toBeDefined();
  if (value === undefined) {
    throw new Error(`Expected ${label} to be defined`);
  }
  return value;
}

describe('RRF Fusion Core Tests (T021-T030)', () => {
  it('T021: RRF fusion with default k=40 parameter', () => {
    expect(DEFAULT_K).toBe(40);
  });

  it('T022: RRF score formula 1/(k+rank) produces correct values', () => {
    const vectorResults = [
      { id: 'doc1', content: 'test1' },
      { id: 'doc2', content: 'test2' },
      { id: 'doc3', content: 'test3' },
    ];
    const ftsResults = [
      { id: 'doc2', content: 'test2' },
      { id: 'doc1', content: 'test1' },
    ];

    const fused = fuseResults(vectorResults, ftsResults);

    const doc1 = expectDefined(fused.find((r: FusedResult) => r.id === 'doc1'), 'doc1');
    const doc3 = expectDefined(fused.find((r: FusedResult) => r.id === 'doc3'), 'doc3');

    // Doc1: vector rank=0, fts rank=1 => 1/61 + 1/62 + 0.10 convergence bonus
    const expectedDoc1Base = 1 / (DEFAULT_K + 0 + 1) + 1 / (DEFAULT_K + 1 + 1);
    const expectedDoc1WithBonus = expectedDoc1Base + 0.10;
    // Doc3: vector rank=2 only => 1/63
    const expectedDoc3 = 1 / (DEFAULT_K + 2 + 1);

    expect(doc1.rrfScore).toBeCloseTo(expectedDoc1WithBonus, 3);
    expect(doc3.rrfScore).toBeCloseTo(expectedDoc3, 3);
  });

  it('T023: Source tracking via sources array', () => {
    const lists = [
      { source: 'vector', results: [{ id: 'vec_only', content: 'vector only' }] },
      { source: 'fts', results: [{ id: 'fts_only', content: 'fts only' }] },
      { source: 'graph', results: [{ id: 'graph_only', content: 'graph only' }] },
    ];

    const fused = fuseResultsMulti(lists);

    const vecDoc = expectDefined(fused.find((r: MultiFusedResult) => r.id === 'vec_only'), 'vec_only');
    const ftsDoc = expectDefined(fused.find((r: MultiFusedResult) => r.id === 'fts_only'), 'fts_only');
    const graphDoc = expectDefined(fused.find((r: MultiFusedResult) => r.id === 'graph_only'), 'graph_only');

    expect(vecDoc.sources).toContain('vector');
    expect(ftsDoc.sources).toContain('fts');
    expect(graphDoc.sources).toContain('graph');
  });

  it('T024: sources.length correctly reflects number of sources', () => {
    const lists = [
      { source: 'vector', results: [{ id: 'multi', content: 'multi source' }, { id: 'vec_only', content: 'vector only' }] },
      { source: 'fts', results: [{ id: 'multi', content: 'multi source' }] },
      { source: 'graph', results: [{ id: 'multi', content: 'multi source' }] },
    ];

    const fused = fuseResultsMulti(lists);

    const multiDoc = expectDefined(fused.find((r: MultiFusedResult) => r.id === 'multi'), 'multi');
    const singleDoc = expectDefined(fused.find((r: MultiFusedResult) => r.id === 'vec_only'), 'vec_only');

    expect(multiDoc.sources.length).toBe(3);
    expect(singleDoc.sources.length).toBe(1);
  });

  it('T025: 10% convergence bonus applied when source_count >= 2', () => {
    const vectorResults = [{ id: 'dual', content: 'dual source' }];
    const ftsResults = [{ id: 'dual', content: 'dual source' }];

    const fused = fuseResults(vectorResults, ftsResults);
    const dualDoc = expectDefined(fused.find((r: FusedResult) => r.id === 'dual'), 'dual');

    const baseRrf = 1 / (DEFAULT_K + 0 + 1) + 1 / (DEFAULT_K + 0 + 1);
    const expectedWithBonus = baseRrf + CONVERGENCE_BONUS;

    expect(dualDoc.rrfScore).toBeCloseTo(expectedWithBonus, 3);
  });

  it('T026: Convergence bonus NOT applied for single-source results', () => {
    const vectorResults = [{ id: 'single', content: 'single source' }];
    const ftsResults: Array<{ id: string; content: string }> = [];

    const fused = fuseResults(vectorResults, ftsResults);
    const singleDoc = expectDefined(fused.find((r: FusedResult) => r.id === 'single'), 'single');

    const expectedNoBonus = 1 / (DEFAULT_K + 0 + 1);

    expect(singleDoc.rrfScore).toBeCloseTo(expectedNoBonus, 3);
  });

  it('T027: isRrfEnabled() feature flag function exported', () => {
    const isEnabled = isRrfEnabled();
    expect(typeof isEnabled).toBe('boolean');
  });

  it('T028: Single-source has no convergence bonus via fuseResultsMulti', () => {
    const lists = [
      { source: 'vector', results: [{ id: 'v1', content: 'test1' }, { id: 'v2', content: 'test2' }] },
    ];

    const fused = fuseResultsMulti(lists);

    expect(fused.length).toBe(2);
    expect(fused.every((r: MultiFusedResult) => r.convergenceBonus === 0)).toBe(true);
  });

  it('T029: fuseResultsMulti tracks sources correctly', () => {
    const lists = [
      { source: 'vector', results: [
        { id: 'doc1', content: 'first in vector' },
        { id: 'doc2', content: 'second in vector' },
        { id: 'doc3', content: 'third in vector' },
      ]},
      { source: 'fts', results: [
        { id: 'doc3', content: 'first in fts' },
        { id: 'doc1', content: 'second in fts' },
      ]},
      { source: 'graph', results: [
        { id: 'doc2', content: 'first in graph' },
      ]},
    ];

    const fused = fuseResultsMulti(lists);

    const doc1 = expectDefined(fused.find((r: MultiFusedResult) => r.id === 'doc1'), 'doc1');
    const doc2 = expectDefined(fused.find((r: MultiFusedResult) => r.id === 'doc2'), 'doc2');
    const doc3 = expectDefined(fused.find((r: MultiFusedResult) => r.id === 'doc3'), 'doc3');

    expect(doc1.sources).toContain('vector');
    expect(doc1.sources).toContain('fts');
    expect(doc2.sources).toContain('vector');
    expect(doc2.sources).toContain('graph');
    expect(doc3.sources).toContain('vector');
    expect(doc3.sources).toContain('fts');
  });

  it('T030: fuseResultsMulti() combines multiple sources', () => {
    const lists = [
      { source: 'vector', results: [
        { id: 'shared', content: 'shared doc' },
        { id: 'vec_only', content: 'vector only' },
      ]},
      { source: 'bm25', results: [
        { id: 'shared', content: 'shared doc' },
        { id: 'bm25_only', content: 'bm25 only' },
      ]},
      { source: 'graph', results: [
        { id: 'graph_only', content: 'graph only' },
      ]},
    ];

    const fused = fuseResultsMulti(lists);
    const ids = fused.map((r: MultiFusedResult) => r.id);

    expect(ids).toContain('shared');
    expect(ids).toContain('vec_only');
    expect(ids).toContain('bm25_only');
    expect(ids).toContain('graph_only');

    const sharedDoc = expectDefined(fused.find((r: MultiFusedResult) => r.id === 'shared'), 'shared');
    expect(sharedDoc.sources).toHaveLength(2);
    expect(sharedDoc.rrfScore).toBeGreaterThan(expectDefined(fused.find((r: MultiFusedResult) => r.id === 'vec_only'), 'vec_only').rrfScore);
    // Calibrated overlap bonus is graduated (default ON); bonus is positive but may differ from flat 0.10
    expect(sharedDoc.convergenceBonus).toBeGreaterThan(0);
  });
});

describe('Module Exports Verification', () => {
  const expectedExports = [
    { name: 'fuseResults', value: fuseResults },
    { name: 'fuseResultsMulti', value: fuseResultsMulti },
    { name: 'unifiedSearch', value: unifiedSearch },
    { name: 'fuseScoresAdvanced', value: fuseScoresAdvanced },
    { name: 'countOriginalTermMatches', value: countOriginalTermMatches },
    { name: 'DEFAULT_K', value: DEFAULT_K },
    { name: 'CONVERGENCE_BONUS', value: CONVERGENCE_BONUS },
    { name: 'GRAPH_WEIGHT_BOOST', value: GRAPH_WEIGHT_BOOST },
    { name: 'SOURCE_TYPES', value: SOURCE_TYPES },
    { name: 'isRrfEnabled', value: isRrfEnabled },
  ];

  for (const { name, value } of expectedExports) {
    it(`Export: ${name} is defined`, () => {
      expect(value).toBeDefined();
    });
  }
});
