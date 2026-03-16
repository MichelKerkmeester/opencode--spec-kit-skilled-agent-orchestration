import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ParsedMemory } from '../lib/parsing/memory-parser';

const {
  lookupEmbeddingMock,
  computeContentHashMock,
  storeEmbeddingMock,
} = vi.hoisted(() => ({
  lookupEmbeddingMock: vi.fn(),
  computeContentHashMock: vi.fn(() => 'cache-key'),
  storeEmbeddingMock: vi.fn(),
}));

vi.mock('../lib/cache/embedding-cache', () => ({
  computeContentHash: computeContentHashMock,
  lookupEmbedding: lookupEmbeddingMock,
  storeEmbedding: storeEmbeddingMock,
}));

vi.mock('../lib/providers/embeddings', async () => {
  const actual = await vi.importActual<typeof import('../lib/providers/embeddings')>('../lib/providers/embeddings');
  return {
    ...actual,
    getModelName: vi.fn(() => 'test-model'),
    buildWeightedDocumentText: vi.fn(actual.buildWeightedDocumentText),
    generateDocumentEmbedding: vi.fn(async () => new Float32Array([0.1, 0.2, 0.3])),
  };
});

import * as embeddings from '../lib/providers/embeddings';
import { generateOrCacheEmbedding } from '../handlers/save/embedding-pipeline';

function createParsedMemory(): ParsedMemory {
  return {
    filePath: '/tmp/009-embedding-optimization/memory.md',
    specFolder: '009-embedding-optimization',
    title: 'Embedding optimization memory',
    triggerPhrases: ['embedding optimization', 'rollback decision'],
    contextType: 'implementation',
    importanceTier: 'important',
    contentHash: 'hash',
    content: [
      '---',
      'title: "Embedding optimization memory"',
      '---',
      '',
      '# Embedding optimization memory',
      '',
      '## Decisions',
      '',
      '- Use weighted document embeddings',
      '- Keep retrieval-time decay unchanged',
      '',
      '## Key Outcomes',
      '',
      '- Decision-heavy memories rank more strongly',
      '',
      '## Detailed Changes',
      '',
      'General implementation notes for the indexing pipeline and save path.',
    ].join('\n'),
    fileSize: 0,
    lastModified: new Date().toISOString(),
    memoryType: 'implementation',
    memoryTypeSource: 'manual',
    memoryTypeConfidence: 0.9,
    causalLinks: {
      caused_by: [],
      supersedes: [],
      derived_from: [],
      blocks: [],
      related_to: [],
    },
    hasCausalLinks: false,
    documentType: 'memory',
    qualityScore: 1,
    qualityFlags: [],
  };
}

describe('Embedding pipeline weighting', () => {
  beforeEach(() => {
    lookupEmbeddingMock.mockReset();
    computeContentHashMock.mockClear();
    storeEmbeddingMock.mockReset();
    vi.mocked(embeddings.buildWeightedDocumentText).mockClear();
    vi.mocked(embeddings.generateDocumentEmbedding).mockClear();
    lookupEmbeddingMock.mockReturnValue(null);
  });

  it('builds weighted sections before calling generateDocumentEmbedding on the save path', async () => {
    const parsed = createParsedMemory();

    const result = await generateOrCacheEmbedding({} as never, parsed, parsed.filePath, false);

    expect(result.status).toBe('success');
    expect(embeddings.buildWeightedDocumentText).toHaveBeenCalledTimes(1);
    expect(vi.mocked(embeddings.buildWeightedDocumentText).mock.calls[0]?.[0]).toEqual(expect.objectContaining({
      title: 'Embedding optimization memory',
      decisions: [
        'Use weighted document embeddings',
        'Keep retrieval-time decay unchanged',
      ],
      outcomes: [
        'Decision-heavy memories rank more strongly',
      ],
    }));
    expect((vi.mocked(embeddings.buildWeightedDocumentText).mock.calls[0]?.[0] as any)?.general).toContain('General implementation notes');
    expect(embeddings.generateDocumentEmbedding).toHaveBeenCalledWith(
      vi.mocked(embeddings.buildWeightedDocumentText).mock.results[0]?.value
    );
  });
});
