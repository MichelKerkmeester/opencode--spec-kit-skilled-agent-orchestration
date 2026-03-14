// ───────────────────────────────────────────────────────────────
// 1. HYBRID SEARCH FEATURE FLAGS TESTS
// ───────────────────────────────────────────────────────────────
// TEST: Hybrid Search Feature Flags
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type Database from 'better-sqlite3';
import * as hybridSearch from '../lib/search/hybrid-search';

type HybridSearchOptions = NonNullable<Parameters<typeof hybridSearch.hybridSearchEnhanced>[2]>;
type VectorSearchFn = NonNullable<Parameters<typeof hybridSearch.init>[1]>;

interface VectorCandidate {
  id: number;
  similarity: number;
  score: number;
  source: 'vector';
}

const applyMMRMock = vi.fn((candidates: readonly VectorCandidate[], options?: { limit?: number }) => {
  const limit = options?.limit ?? candidates.length;
  return candidates.slice(0, limit);
});

vi.mock('@spec-kit/shared/algorithms/mmr-reranker', () => ({
  applyMMR: (...args: Parameters<typeof applyMMRMock>) => applyMMRMock(...args),
}));

function createMockDb(): Database.Database {
  return {
    prepare: vi.fn((sql) => ({
      get: () => {
        if (sql.includes('sqlite_master') && sql.includes('memory_fts')) {
          return null;
        }
        return null;
      },
      all: (...ids: number[]) => {
        if (sql.includes('vec_memories')) {
          return ids.map((id) => ({
            rowid: id,
            embedding: Buffer.alloc(16),
          }));
        }
        return [];
      },
    })),
  } as unknown as Database.Database;
}

const mockVectorSearch: VectorSearchFn = () => {
  return [
    { id: 1, similarity: 0.91, score: 0.91, source: 'vector' },
    { id: 2, similarity: 0.88, score: 0.88, source: 'vector' },
    { id: 3, similarity: 0.85, score: 0.85, source: 'vector' },
  ];
};

describe('Hybrid search feature flags', () => {
  beforeEach(() => {
    delete process.env.SPECKIT_MMR;
    applyMMRMock.mockClear();
    hybridSearch.init(createMockDb(), mockVectorSearch);
  });

  it('runs MMR by default when SPECKIT_MMR is unset', async () => {
    const embedding = new Float32Array([0.1, 0.2, 0.3, 0.4]);
    await hybridSearch.hybridSearchEnhanced('test query', embedding, { limit: 3 } satisfies HybridSearchOptions);
    expect(applyMMRMock).toHaveBeenCalled();
  });

  it('skips MMR when SPECKIT_MMR=false', async () => {
    process.env.SPECKIT_MMR = 'false';
    const embedding = new Float32Array([0.1, 0.2, 0.3, 0.4]);
    await hybridSearch.hybridSearchEnhanced('test query', embedding, { limit: 3 } satisfies HybridSearchOptions);
    expect(applyMMRMock).not.toHaveBeenCalled();
  });
});
