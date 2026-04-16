import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const bridgeMocks = vi.hoisted(() => ({
  appendMutationLedgerSafe: vi.fn(() => true),
  bm25Enabled: vi.fn(() => false),
  bm25GetIndex: vi.fn(),
  hasCheckpoint: vi.fn(() => true),
  indexMemory: vi.fn(() => 901),
  isAssistiveReconsolidationEnabled: vi.fn(() => true),
  isEncodingIntentEnabled: vi.fn(() => false),
  isReconsolidationEnabled: vi.fn(() => false),
  isSaveReconsolidationEnabled: vi.fn(() => false),
  reconsolidate: vi.fn(),
  vectorSearch: vi.fn(),
}));

vi.mock('../lib/search/vector-index', () => ({
  vectorSearch: bridgeMocks.vectorSearch,
  indexMemory: bridgeMocks.indexMemory,
}));

vi.mock('../lib/providers/embeddings', () => ({
  generateDocumentEmbedding: vi.fn(),
}));

vi.mock('../lib/search/bm25-index', () => ({
  isBm25Enabled: bridgeMocks.bm25Enabled,
  buildBm25DocumentText: vi.fn(() => 'bm25 text'),
  getIndex: bridgeMocks.bm25GetIndex,
}));

vi.mock('../lib/cognitive/fsrs-scheduler', () => ({
  DEFAULT_INITIAL_STABILITY: 5,
  DEFAULT_INITIAL_DIFFICULTY: 5,
}));

vi.mock('../lib/storage/incremental-index', () => ({
  getFileMetadata: vi.fn(() => null),
}));

vi.mock('../lib/storage/reconsolidation', () => ({
  reconsolidate: bridgeMocks.reconsolidate,
}));

vi.mock('../lib/search/encoding-intent', () => ({
  classifyEncodingIntent: vi.fn(() => 'document'),
}));

vi.mock('../lib/search/search-flags', () => ({
  isEncodingIntentEnabled: bridgeMocks.isEncodingIntentEnabled,
  isReconsolidationEnabled: bridgeMocks.isReconsolidationEnabled,
  isAssistiveReconsolidationEnabled: bridgeMocks.isAssistiveReconsolidationEnabled,
  isSaveReconsolidationEnabled: bridgeMocks.isSaveReconsolidationEnabled,
}));

vi.mock('../handlers/save/db-helpers', () => ({
  ALLOWED_POST_INSERT_COLUMNS: new Set<string>(),
  applyPostInsertMetadata: vi.fn(),
  hasReconsolidationCheckpoint: bridgeMocks.hasCheckpoint,
}));

vi.mock('../lib/storage/history', () => ({
  recordHistory: vi.fn(),
}));

vi.mock('../handlers/memory-crud-utils', () => ({
  appendMutationLedgerSafe: bridgeMocks.appendMutationLedgerSafe,
}));

vi.mock('../handlers/pe-gating', () => ({
  calculateDocumentWeight: vi.fn(() => 0.5),
  isSpecDocumentType: vi.fn(() => true),
}));

vi.mock('../handlers/handler-utils', () => ({
  detectSpecLevelFromParsed: vi.fn(() => null),
}));

vi.mock('../utils', () => ({
  toErrorMessage: vi.fn((error: unknown) => error instanceof Error ? error.message : String(error)),
}));

import { runReconsolidationIfEnabled } from '../handlers/save/reconsolidation-bridge';

function buildParsedMemory(overrides: Record<string, unknown> = {}) {
  return {
    title: 'Canonical implementation summary',
    content: 'Base canonical doc content.',
    specFolder: 'specs/025-gate-d',
    filePath: '/tmp/specs/025/implementation-summary.md',
    triggerPhrases: ['canonical', 'doc'],
    importanceTier: 'normal',
    contentHash: 'sha256:gate-d-regression',
    contextType: 'implementation',
    memoryType: 'memory',
    memoryTypeSource: 'test',
    documentType: 'implementation-summary',
    qualityScore: 1,
    qualityFlags: [],
    ...overrides,
  } as any;
}

describe('Gate D regression reconsolidation', () => {
  beforeEach(() => {
    bridgeMocks.appendMutationLedgerSafe.mockClear();
    bridgeMocks.bm25Enabled.mockClear();
    bridgeMocks.bm25GetIndex.mockClear();
    bridgeMocks.hasCheckpoint.mockClear();
    bridgeMocks.indexMemory.mockClear();
    bridgeMocks.isAssistiveReconsolidationEnabled.mockClear();
    bridgeMocks.isAssistiveReconsolidationEnabled.mockReturnValue(true);
    bridgeMocks.isEncodingIntentEnabled.mockClear();
    bridgeMocks.isEncodingIntentEnabled.mockReturnValue(false);
    bridgeMocks.isReconsolidationEnabled.mockClear();
    bridgeMocks.isReconsolidationEnabled.mockReturnValue(false);
    bridgeMocks.isSaveReconsolidationEnabled.mockClear();
    bridgeMocks.isSaveReconsolidationEnabled.mockReturnValue(true);
    bridgeMocks.reconsolidate.mockClear();
    bridgeMocks.vectorSearch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps >0.96 in the high-similarity note tier and preserves review-band recommendations for canonical doc writes', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const database = {} as any;

    bridgeMocks.vectorSearch.mockReturnValueOnce([
      {
        id: 11,
        similarity: 96.1,
        content_text: 'Older canonical content.',
      },
    ]);

    const autoMergeResult = await runReconsolidationIfEnabled(
      database,
      buildParsedMemory({
        content: 'New canonical content with the same intent.',
      }),
      '/tmp/specs/025/implementation-summary.md',
      false,
      new Float32Array([0.1, 0.2, 0.3]),
    );

    expect(autoMergeResult.earlyReturn).toBeNull();
    expect(autoMergeResult.assistiveRecommendation).toBeNull();
    expect(autoMergeResult.warnings).toHaveLength(0);
    expect(bridgeMocks.vectorSearch).toHaveBeenCalledWith(
      expect.any(Float32Array),
      expect.objectContaining({
        limit: 3,
        specFolder: 'specs/025-gate-d',
        minSimilarity: 88,
        includeConstitutional: false,
      }),
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('assistive high-similarity compatibility note'),
    );

    warnSpy.mockClear();
    bridgeMocks.vectorSearch.mockReturnValueOnce([
      {
        id: 12,
        similarity: 95.9,
        content_text: 'Short canonical review-band text.',
      },
    ]);

    const reviewResult = await runReconsolidationIfEnabled(
      database,
      buildParsedMemory({
        content:
          'Short canonical review-band text. This canonical doc write adds substantially more detail so the recommendation should remain in review-band behavior.',
      }),
      '/tmp/specs/025/implementation-summary.md',
      false,
      new Float32Array([0.4, 0.5, 0.6]),
    );

    expect(reviewResult.earlyReturn).toBeNull();
    expect(reviewResult.assistiveRecommendation).toMatchObject({
      action: 'review',
      olderMemoryId: 12,
      newerMemoryId: null,
      classification: 'complement',
    });
    expect(reviewResult.assistiveRecommendation?.similarity).toBeCloseTo(0.959, 6);
    expect(reviewResult.warnings).toHaveLength(0);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('assistive recommendation'),
    );

    warnSpy.mockRestore();
  });
});
