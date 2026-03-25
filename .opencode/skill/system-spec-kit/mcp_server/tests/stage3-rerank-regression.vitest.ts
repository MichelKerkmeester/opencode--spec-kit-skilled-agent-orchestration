// TEST: Stage 3 Rerank Regression
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PipelineRow } from '../lib/search/pipeline/types';

const flagState = {
  crossEncoder: true,
  mmr: false,
  localReranker: false,
};

const rerankResultsMock = vi.fn();
const rerankLocalMock = vi.fn();
const applyMMRMock = vi.fn();
const requireDbMock = vi.fn();

vi.mock('../lib/search/search-flags', () => ({
  isCrossEncoderEnabled: () => flagState.crossEncoder,
  isMMREnabled: () => flagState.mmr,
  isLocalRerankerEnabled: () => flagState.localReranker,
}));

vi.mock('../lib/search/cross-encoder', () => ({
  rerankResults: (...args: unknown[]) => rerankResultsMock(...args),
}));

vi.mock('../lib/search/local-reranker', () => ({
  rerankLocal: (...args: unknown[]) => rerankLocalMock(...args),
}));

vi.mock('@spec-kit/shared/algorithms/mmr-reranker', () => ({
  applyMMR: (...args: unknown[]) => applyMMRMock(...args),
}));

vi.mock('../utils', () => ({
  requireDb: () => requireDbMock(),
  toErrorMessage: (error: unknown) => error instanceof Error ? error.message : String(error),
}));

import { __testables } from '../lib/search/pipeline/stage3-rerank';
import { executeStage3 } from '../lib/search/pipeline/stage3-rerank';

const RERANK_OPTIONS = {
  rerank: true,
  applyLengthPenalty: false,
  limit: 5,
} as const;

describe('stage3-rerank regression (F-16)', () => {
  beforeEach(() => {
    flagState.crossEncoder = true;
    flagState.mmr = false;
    flagState.localReranker = false;
    rerankResultsMock.mockReset();
    rerankLocalMock.mockReset();
    applyMMRMock.mockReset();
    requireDbMock.mockReset();
  });

  it('floors negative cross-encoder scores at rerank output boundary', async () => {
    rerankResultsMock.mockResolvedValue([
      { id: 1, score: -0.9, rerankerScore: -0.7 },
      { id: 2, score: -0.5, rerankerScore: -0.4 },
    ]);

    const input: PipelineRow[] = [
      { id: 1, score: 0.8, content: 'alpha' },
      { id: 2, score: 0.7, content: 'beta' },
    ];

    const result = await __testables.applyCrossEncoderReranking('query', input, RERANK_OPTIONS);

    expect(result.applied).toBe(true);
    for (const row of result.rows) {
      const score = typeof row.score === 'number' ? row.score : Number.NaN;
      const rerankerScore = typeof row.rerankerScore === 'number' ? row.rerankerScore : Number.NaN;
      expect(score).toBeGreaterThanOrEqual(0);
      expect(rerankerScore).toBeGreaterThanOrEqual(0);
    }
  });

  it('floors negative local-reranker scores at rerank output boundary', async () => {
    flagState.localReranker = true;
    rerankLocalMock.mockResolvedValue([
      { id: 1, score: -0.3, rerankerScore: -0.2, content: 'alpha' },
      { id: 2, score: -0.1, rerankerScore: -0.05, content: 'beta' },
    ]);

    const input: PipelineRow[] = [
      { id: 1, score: 0.6, content: 'alpha' },
      { id: 2, score: 0.5, content: 'beta' },
    ];

    const result = await __testables.applyCrossEncoderReranking('query', input, RERANK_OPTIONS);

    expect(result.applied).toBe(true);
    expect(rerankLocalMock).toHaveBeenCalledOnce();
    for (const row of result.rows) {
      const score = typeof row.score === 'number' ? row.score : Number.NaN;
      const rerankerScore = typeof row.rerankerScore === 'number' ? row.rerankerScore : Number.NaN;
      expect(score).toBeGreaterThanOrEqual(0);
      expect(rerankerScore).toBeGreaterThanOrEqual(0);
    }
  });

  it('preserves attentionScore as an independent signal after reranking', async () => {
    rerankResultsMock.mockResolvedValue([
      { id: 1, score: 0.92, rerankerScore: 0.92 },
      { id: 2, score: 0.61, rerankerScore: 0.61 },
    ]);

    const input: PipelineRow[] = [
      { id: 1, score: 0.6, attentionScore: 0.17, content: 'alpha' },
      { id: 2, score: 0.5, attentionScore: 0.04, content: 'beta' },
    ];

    const result = await __testables.applyCrossEncoderReranking('query', input, RERANK_OPTIONS);

    expect(result.applied).toBe(true);
    expect(result.rows[0]?.score).toBe(0.92);
    expect(result.rows[0]?.rerankerScore).toBe(0.92);
    expect(result.rows[0]?.attentionScore).toBe(0.17);
  });

  it('keeps non-embedded rows near their original rank after MMR diversification', async () => {
    flagState.crossEncoder = false;
    flagState.mmr = true;
    applyMMRMock.mockReturnValue([
      { id: 30, score: 0.74, embedding: new Float32Array([0.3, 0.3]) },
      { id: 10, score: 0.93, embedding: new Float32Array([0.1, 0.1]) },
    ]);
    requireDbMock.mockReturnValue({
      prepare: () => ({
        all: (...ids: number[]) => ids
          .filter((id) => id !== 20)
          .map((id) => ({
            rowid: id,
            embedding: Buffer.from(new Float32Array([id / 100, id / 100]).buffer),
          })),
      }),
    });

    const result = await executeStage3({
      scored: [
        { id: 20, score: 0.91, content: 'lexical-only-hit' },
        { id: 10, score: 0.93, content: 'embedded-alpha' },
        { id: 30, score: 0.74, content: 'embedded-beta' },
      ],
      config: {
        query: 'query',
        searchType: 'hybrid',
        limit: 5,
        includeArchived: false,
        includeConstitutional: false,
        includeContent: false,
        minState: 'WARM',
        applyStateLimits: false,
        useDecay: true,
        rerank: false,
        applyLengthPenalty: false,
        enableDedup: false,
        enableSessionBoost: false,
        enableCausalBoost: false,
        trackAccess: false,
        detectedIntent: null,
        intentConfidence: 0,
        intentWeights: null,
      },
    });

    expect(applyMMRMock).toHaveBeenCalledOnce();
    expect(result.reranked.map((row) => row.id)).toEqual([30, 20, 10]);
  });
});
