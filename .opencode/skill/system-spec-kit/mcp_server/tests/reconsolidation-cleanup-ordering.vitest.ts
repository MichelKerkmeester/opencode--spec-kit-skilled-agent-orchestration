import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/storage/history', () => ({
  recordHistory: vi.fn(),
}));

vi.mock('../lib/storage/causal-edges', () => ({
  insertEdge: vi.fn(() => {
    throw new Error('forced edge failure');
  }),
}));

import { recordHistory } from '../lib/storage/history';
import { reconsolidate } from '../lib/storage/reconsolidation';

describe('Reconsolidation cleanup ordering', () => {
  const originalEnv = process.env.SPECKIT_RECONSOLIDATION;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.SPECKIT_RECONSOLIDATION;
    } else {
      process.env.SPECKIT_RECONSOLIDATION = originalEnv;
    }
    vi.clearAllMocks();
  });

  it('skips DELETE history when orphan cleanup does not delete a row', async () => {
    process.env.SPECKIT_RECONSOLIDATION = 'true';

    const fakeDb = {
      transaction: ((fn: () => unknown) => () => fn()),
      prepare: (sql: string) => {
        if (sql.includes('UPDATE memory_index')) {
          return { run: () => ({ changes: 1 }) };
        }
        if (sql.includes('DELETE FROM memory_index WHERE id = ?')) {
          return { run: () => ({ changes: 0 }) };
        }
        return { run: () => ({ changes: 0 }) };
      },
    };

    await expect(reconsolidate(
      {
        title: 'Incoming memory',
        content: 'Incoming conflicting content',
        specFolder: 'test-spec',
        filePath: '/tmp/incoming.md',
        embedding: [1, 2, 3],
        triggerPhrases: [],
        importanceTier: 'normal',
      },
      fakeDb as never,
      {
        findSimilar: () => [{
          id: 42,
          file_path: '/tmp/existing.md',
          title: 'Existing memory',
          content_text: 'Existing content',
          similarity: 0.8,
          spec_folder: 'test-spec',
          importance_weight: 0.5,
        }],
        storeMemory: () => 99,
      }
    )).rejects.toThrow('forced edge failure');

    expect(vi.mocked(recordHistory)).not.toHaveBeenCalled();
  });
});
