import { beforeEach, describe, expect, it, vi } from 'vitest';

import { buildWeightedDocumentText, type WeightedDocumentSections } from '@spec-kit/shared/index';

const {
  generateEmbeddingMock,
  generateDocumentEmbeddingMock,
  indexMemoryMock,
} = vi.hoisted(() => ({
  generateEmbeddingMock: vi.fn(),
  generateDocumentEmbeddingMock: vi.fn(async () => new Float32Array([0.1, 0.2, 0.3])),
  indexMemoryMock: vi.fn(() => 42),
}));

vi.mock('../lib/embeddings', async () => {
  const actual = await vi.importActual<typeof import('../lib/embeddings')>('../lib/embeddings');
  return {
    ...actual,
    generateEmbedding: generateEmbeddingMock,
    generateDocumentEmbedding: generateDocumentEmbeddingMock,
  };
});

vi.mock('@spec-kit/mcp-server/api/search', () => ({
  vectorIndex: {
    indexMemory: indexMemoryMock,
  },
}));

vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof import('fs')>('fs');
  return {
    ...actual,
    existsSync: vi.fn(() => true),
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
  };
});

vi.mock('@spec-kit/shared/config', () => ({
  DB_UPDATED_FILE: '/tmp/spec-kit-test-db-updated',
}));

import { indexMemory } from '../core/memory-indexer';

describe('memory-indexer weighting', () => {
  beforeEach(() => {
    generateEmbeddingMock.mockReset();
    generateDocumentEmbeddingMock.mockClear();
    indexMemoryMock.mockClear();
  });

  it('routes scripts indexing through generateDocumentEmbedding with weighted content', async () => {
    const sections: WeightedDocumentSections = {
      title: 'Embedding optimization memory',
      decisions: ['Use weighted document input'],
      outcomes: ['Decision-heavy queries rank more strongly'],
      general: 'General implementation notes for the scripts indexing path.',
    };

    const memoryId = await indexMemory(
      '/tmp',
      'embedding-memory.md',
      '# raw markdown content',
      '009-embedding-optimization',
      null,
      [],
      sections
    );

    expect(memoryId).toBe(42);
    expect(generateDocumentEmbeddingMock).toHaveBeenCalledWith(buildWeightedDocumentText(sections));
    expect(generateEmbeddingMock).not.toHaveBeenCalled();
    expect(indexMemoryMock).toHaveBeenCalledWith(expect.objectContaining({
      specFolder: '009-embedding-optimization',
      title: 'raw markdown content',
      embedding: expect.any(Float32Array),
    }));
  });
});
