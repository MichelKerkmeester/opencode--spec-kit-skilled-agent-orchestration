import { describe, expect, it } from 'vitest';

import * as publicApi from '../api';
import * as evalApi from '../api/eval';
import * as searchApi from '../api/search';

describe('public API surfaces', () => {
  it('exposes the documented search barrel contract from api/search.ts', () => {
    expect(searchApi.initHybridSearch).toBeTypeOf('function');
    expect(searchApi.hybridSearchEnhanced).toBeTypeOf('function');
    expect(searchApi.fts5Bm25Search).toBeTypeOf('function');
    expect(searchApi.isFts5Available).toBeTypeOf('function');
    expect(searchApi.vectorIndex).toBeDefined();
    expect(searchApi.vectorIndex.initializeDb).toBeTypeOf('function');
    expect(searchApi.vectorIndex.closeDb).toBeTypeOf('function');
  });

  it('keeps the top-level public barrel aligned with the eval and search facades', () => {
    expect(publicApi.hybridSearchEnhanced).toBe(searchApi.hybridSearchEnhanced);
    expect(publicApi.initHybridSearch).toBe(searchApi.initHybridSearch);
    expect(publicApi.fts5Bm25Search).toBe(searchApi.fts5Bm25Search);
    expect(publicApi.vectorIndex).toBe(searchApi.vectorIndex);
    expect(publicApi.runAblation).toBe(evalApi.runAblation);
    expect(publicApi.loadGroundTruth).toBe(evalApi.loadGroundTruth);
    expect(publicApi.initEvalDb).toBe(evalApi.initEvalDb);
  });
});
