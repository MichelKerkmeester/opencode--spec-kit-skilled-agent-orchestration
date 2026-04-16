import { beforeEach, describe, expect, it, vi } from 'vitest';

const storeMocks = vi.hoisted(() => ({
  initializeDb: vi.fn(),
  getEmbeddingDim: vi.fn(() => 128),
  getConstitutionalMemories: vi.fn(() => []),
  initPreparedStatements: vi.fn(),
  validateFilePathLocal: vi.fn(),
  safeReadFileAsync: vi.fn(),
  safeParseJson: vi.fn(),
  sqliteVecAvailable: vi.fn(() => true),
}));

vi.mock('../lib/search/vector-index-store.js', () => ({
  initialize_db: storeMocks.initializeDb,
  get_embedding_dim: storeMocks.getEmbeddingDim,
  get_constitutional_memories: storeMocks.getConstitutionalMemories,
  init_prepared_statements: storeMocks.initPreparedStatements,
  validate_file_path_local: storeMocks.validateFilePathLocal,
  safe_read_file_async: storeMocks.safeReadFileAsync,
  safe_parse_json: storeMocks.safeParseJson,
  search_weights: {},
  sqlite_vec_available: storeMocks.sqliteVecAvailable,
}));

import { getConstitutionalMemories } from '../lib/search/vector-index-queries.js';

describe('constitutional filtering contract', () => {
  const fakeDb = { prepare: vi.fn() };

  beforeEach(() => {
    storeMocks.initializeDb.mockReset();
    storeMocks.initializeDb.mockReturnValue(fakeDb);
    storeMocks.getConstitutionalMemories.mockReset();
  });

  it('forwards includeArchived=true to the store layer instead of hard-coding compatibility output', () => {
    storeMocks.getConstitutionalMemories.mockReturnValue([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ]);

    const result = getConstitutionalMemories(
      {
        specFolder: 'packet-015',
        maxTokens: 250,
        includeArchived: true,
      },
      fakeDb as any,
    );

    expect(storeMocks.getConstitutionalMemories).toHaveBeenCalledWith(
      fakeDb,
      'packet-015',
      true,
    );
    expect(result).toHaveLength(2);
  });

  it('defaults includeArchived to false when callers omit the option', () => {
    storeMocks.getConstitutionalMemories.mockReturnValue([{ id: 1 }]);

    getConstitutionalMemories(
      {
        specFolder: 'packet-015',
        maxTokens: 200,
      },
      fakeDb as any,
    );

    expect(storeMocks.getConstitutionalMemories).toHaveBeenCalledWith(
      fakeDb,
      'packet-015',
      false,
    );
  });
});
