import { afterEach, describe, expect, it, vi } from 'vitest';

import * as vectorIndex from '../lib/search/vector-index';
import { findSimilarMemories } from '../handlers/pe-gating';

function makeCandidate(
  id: number,
  overrides: Partial<{
    similarity: number;
    content_text: string;
    file_path: string;
    tenant_id: string | null;
    user_id: string | null;
    agent_id: string | null;
    session_id: string | null;
    shared_space_id: string | null;
  }> = {}
): Record<string, unknown> {
  return {
    id,
    similarity: 90,
    content_text: `candidate-${id}`,
    file_path: `/specs/026-memory-database-refinement/${id}.md`,
    tenant_id: 'tenant-a',
    user_id: null,
    agent_id: null,
    session_id: null,
    shared_space_id: null,
    ...overrides,
  };
}

describe('PE gating scoped similar-memory search', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('expands the vector window until an in-scope match is found', () => {
    const vectorSearchSpy = vi.spyOn(vectorIndex, 'vectorSearch')
      .mockImplementationOnce((_embedding, options) => {
        expect(options.limit).toBe(3);
        return [
          makeCandidate(1, { tenant_id: 'tenant-b' }),
          makeCandidate(2, { tenant_id: 'tenant-b' }),
          makeCandidate(3, { tenant_id: 'tenant-c' }),
        ] as ReturnType<typeof vectorIndex.vectorSearch>;
      })
      .mockImplementationOnce((_embedding, options) => {
        expect(options.limit).toBe(6);
        return [
          makeCandidate(1, { tenant_id: 'tenant-b' }),
          makeCandidate(2, { tenant_id: 'tenant-b' }),
          makeCandidate(3, { tenant_id: 'tenant-c' }),
          makeCandidate(4, { tenant_id: 'tenant-d' }),
          makeCandidate(99, {
            tenant_id: 'tenant-a',
            similarity: 91,
            content_text: 'in-scope memory',
            file_path: '/specs/026-memory-database-refinement/in-scope.md',
          }),
          makeCandidate(5, { tenant_id: 'tenant-e' }),
        ] as ReturnType<typeof vectorIndex.vectorSearch>;
      });

    const results = findSimilarMemories(new Float32Array([0.1, 0.2, 0.3]), {
      limit: 1,
      specFolder: 'specs/026-memory-database-refinement',
      tenantId: 'tenant-a',
    });

    expect(vectorSearchSpy).toHaveBeenCalledTimes(2);
    expect(results).toEqual([
      expect.objectContaining({
        id: 99,
        similarity: 0.91,
        content: 'in-scope memory',
        file_path: '/specs/026-memory-database-refinement/in-scope.md',
      }),
    ]);
  });

  it('stops expanding when the current candidate set is exhausted', () => {
    const vectorSearchSpy = vi.spyOn(vectorIndex, 'vectorSearch')
      .mockImplementationOnce((_embedding, options) => {
        expect(options.limit).toBe(6);
        return [
          makeCandidate(10, { tenant_id: 'tenant-a', similarity: 88 }),
          makeCandidate(11, { tenant_id: 'tenant-b' }),
          makeCandidate(12, { tenant_id: 'tenant-c' }),
        ] as ReturnType<typeof vectorIndex.vectorSearch>;
      });

    const results = findSimilarMemories(new Float32Array([0.5, 0.6, 0.7]), {
      limit: 2,
      specFolder: 'specs/026-memory-database-refinement',
      tenantId: 'tenant-a',
    });

    expect(vectorSearchSpy).toHaveBeenCalledTimes(1);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual(expect.objectContaining({ id: 10, similarity: 0.88 }));
  });
});
