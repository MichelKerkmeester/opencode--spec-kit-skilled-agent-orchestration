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

import { __testables } from '../lib/search/pipeline/stage3-rerank';

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
});
