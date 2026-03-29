import { beforeEach, describe, expect, it, vi } from 'vitest';

import { buildWeightedDocumentText, type WeightedDocumentSections } from '@spec-kit/shared/index';

const {
  generateEmbeddingMock,
  generateDocumentEmbeddingMock,
  indexMemoryMock,
  extractTriggerPhrasesMock,
} = vi.hoisted(() => ({
  generateEmbeddingMock: vi.fn(),
  generateDocumentEmbeddingMock: vi.fn(async () => new Float32Array([0.1, 0.2, 0.3])),
  indexMemoryMock: vi.fn(() => 42),
  extractTriggerPhrasesMock: vi.fn(() => []),
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

vi.mock('@spec-kit/shared/config', async () => {
  const actual = await vi.importActual<typeof import('@spec-kit/shared/config')>('@spec-kit/shared/config');
  return {
    ...actual,
    DB_UPDATED_FILE: '/tmp/spec-kit-test-db-updated',
  };
});

vi.mock('../lib/trigger-extractor', () => ({
  extractTriggerPhrases: extractTriggerPhrasesMock,
}));

import { indexMemory } from '../core/memory-indexer';

describe('memory-indexer weighting', () => {
  beforeEach(() => {
    generateEmbeddingMock.mockReset();
    generateDocumentEmbeddingMock.mockClear();
    indexMemoryMock.mockClear();
    extractTriggerPhrasesMock.mockClear();
  });

  // TCOV-005: Failure-path tests
  it('returns null when generateDocumentEmbedding returns null', async () => {
    generateDocumentEmbeddingMock.mockResolvedValueOnce(null);

    const memoryId = await indexMemory(
      '/tmp',
      'test-null-embedding.md',
      '# content',
      '010-test-spec',
    );

    expect(memoryId).toBeNull();
    expect(indexMemoryMock).not.toHaveBeenCalled();
  });

  it('returns null when generateDocumentEmbedding throws', async () => {
    generateDocumentEmbeddingMock.mockRejectedValueOnce(new Error('Embedding service unavailable'));

    const memoryId = await indexMemory(
      '/tmp',
      'test-throw-embedding.md',
      '# content',
      '010-test-spec',
    );

    expect(memoryId).toBeNull();
    expect(indexMemoryMock).not.toHaveBeenCalled();
  });

  it('returns null when vectorIndex.indexMemory throws', async () => {
    indexMemoryMock.mockImplementationOnce(() => {
      throw new Error('Database write failed');
    });

    const memoryId = await indexMemory(
      '/tmp',
      'test-throw-index.md',
      '# content',
      '010-test-spec',
    );

    expect(memoryId).toBeNull();
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

  it('falls back to manual trigger phrases when extraction throws', async () => {
    extractTriggerPhrasesMock.mockImplementationOnce(() => {
      throw new Error('Trigger extraction crashed');
    });

    const collectedData = {
      _manualTriggerPhrases: ['manual phrase one', 'manual phrase two'],
    } as any;

    const memoryId = await indexMemory(
      '/tmp',
      'test-trigger-fallback.md',
      '# content',
      '010-test-spec',
      collectedData,
    );

    expect(memoryId).toBe(42);
    expect(indexMemoryMock).toHaveBeenCalledWith(expect.objectContaining({
      triggerPhrases: expect.arrayContaining(['manual phrase one', 'manual phrase two']),
    }));
  });
});
