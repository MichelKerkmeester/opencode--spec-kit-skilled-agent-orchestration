// TEST: QUERY DECOMPOSITION (D2 Phase A)
// REQ-D2-001: Decomposition + facet-coverage merge behavior.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { __testables } from '../lib/search/pipeline/stage1-candidate-gen';
import type { PipelineRow } from '../lib/search/pipeline/types';

const FEATURE_FLAG = 'SPECKIT_QUERY_DECOMPOSITION';

describe('D2 query decomposition', () => {
  let originalFlag: string | undefined;

  beforeEach(() => {
    originalFlag = process.env[FEATURE_FLAG];
    process.env[FEATURE_FLAG] = 'true';
  });

  afterEach(() => {
    if (originalFlag === undefined) {
      delete process.env[FEATURE_FLAG];
    } else {
      process.env[FEATURE_FLAG] = originalFlag;
    }
  });

  it('returns a single-facet query unchanged', () => {
    expect(__testables.decomposeQueryFacets('graph pruning')).toEqual(['graph pruning']);
  });

  it('splits multi-facet AND queries into distinct facets', () => {
    expect(
      __testables.decomposeQueryFacets(
        'what decisions were made about scoring and graph pruning?',
      ),
    ).toEqual(['scoring', 'graph pruning']);
  });

  it('detects multiple noun facets from list-like queries', () => {
    expect(
      __testables.decomposeQueryFacets(
        'scoring, graph pruning, concept routing, and embeddings',
      ),
    ).toEqual(['scoring', 'graph pruning', 'concept routing']);
  });

  it('enforces the facet cap at 3', () => {
    const facets = __testables.decomposeQueryFacets(
      'scoring, graph pruning, concept routing, embeddings, and bm25',
    );

    expect(facets).toHaveLength(__testables.MAX_QUERY_DECOMPOSITION_FACETS);
    expect(facets).toEqual(['scoring', 'graph pruning', 'concept routing']);
  });

  it('deduplicates overlapping results when merging facet coverage pools', () => {
    const merged = __testables.mergeByFacetCoverage([
      [
        { id: 1, title: 'baseline', score: 0.9 },
        { id: 2, title: 'shared', score: 0.8 },
      ] satisfies PipelineRow[],
      [
        { id: 2, title: 'shared-duplicate', score: 0.7 },
        { id: 3, title: 'facet-only', score: 0.6 },
      ] satisfies PipelineRow[],
    ]);

    expect(merged.map((row) => row.id)).toEqual([1, 2, 3]);
    expect(merged[1]?.title).toBe('shared');
  });

  it('always includes the original query in the decomposition pool', () => {
    const pool = __testables.buildQueryDecompositionPool(
      'what decisions were made about scoring and graph pruning?',
      'deep',
    );

    expect(pool[0]).toBe('what decisions were made about scoring and graph pruning');
    expect(pool).toContain('scoring');
    expect(pool).toContain('graph pruning');
  });

  it('only decomposes when running in deep mode', () => {
    const pool = __testables.buildQueryDecompositionPool(
      'what decisions were made about scoring and graph pruning?',
      'focused',
    );

    expect(pool).toEqual(['what decisions were made about scoring and graph pruning']);
  });

  it('skips decomposition when SPECKIT_QUERY_DECOMPOSITION is false', () => {
    process.env[FEATURE_FLAG] = 'false';

    const pool = __testables.buildQueryDecompositionPool(
      'what decisions were made about scoring and graph pruning?',
      'deep',
    );

    expect(pool).toEqual(['what decisions were made about scoring and graph pruning']);
  });
});
