// @ts-nocheck
// ---------------------------------------------------------------
// MODULE: Hybrid Search Feature Flags Tests
// ---------------------------------------------------------------
// TEST: Hybrid Search Feature Flags
// ---------------------------------------------------------------

import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as hybridSearch from '../lib/search/hybrid-search';

const applyMMRMock = vi.fn((candidates, options) => {
  const limit = options?.limit ?? candidates.length;
  return candidates.slice(0, limit);
});

vi.mock('../../shared/algorithms/mmr-reranker', () => ({
  applyMMR: (...args) => applyMMRMock(...args),
}));

function createMockDb() {
  return {
    prepare: vi.fn((sql) => ({
      get: () => {
        if (sql.includes('sqlite_master') && sql.includes('memory_fts')) {
          return null;
        }
        return null;
      },
      all: (...ids) => {
        if (sql.includes('vec_memories')) {
          return ids.map((id) => ({
            rowid: id,
            embedding: Buffer.alloc(16),
          }));
        }
        return [];
      },
    })),
  };
}

function mockVectorSearch() {
  return [
    { id: 1, similarity: 0.91, score: 0.91, source: 'vector' },
    { id: 2, similarity: 0.88, score: 0.88, source: 'vector' },
    { id: 3, similarity: 0.85, score: 0.85, source: 'vector' },
  ];
}

describe('Hybrid search feature flags', () => {
  beforeEach(() => {
    delete process.env.SPECKIT_MMR;
    applyMMRMock.mockClear();
    hybridSearch.init(createMockDb(), mockVectorSearch, null);
  });

  it('runs MMR by default when SPECKIT_MMR is unset', async () => {
    const embedding = new Float32Array([0.1, 0.2, 0.3, 0.4]);
    await hybridSearch.hybridSearchEnhanced('test query', embedding, { limit: 3 });
    expect(applyMMRMock).toHaveBeenCalled();
  });

  it('skips MMR when SPECKIT_MMR=false', async () => {
    process.env.SPECKIT_MMR = 'false';
    const embedding = new Float32Array([0.1, 0.2, 0.3, 0.4]);
    await hybridSearch.hybridSearchEnhanced('test query', embedding, { limit: 3 });
    expect(applyMMRMock).not.toHaveBeenCalled();
  });
});
