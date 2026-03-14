// TEST: direct remediation coverage for F04/F05/F16
import { describe, expect, it } from 'vitest';
import { enrichResultsWithAnchorMetadata } from '../lib/search/anchor-metadata';
import {
  extractValidationMetadata,
} from '../lib/search/validation-metadata';
import { __testables as stage2Testables } from '../lib/search/pipeline/stage2-fusion';
import type { PipelineRow } from '../lib/search/pipeline/types';
import { IVectorStore } from '../lib/interfaces/vector-store';
import { SQLiteVectorStore } from '../lib/search/vector-index';

describe('F04 remediation: template anchor optimization', () => {
  it('annotates anchor metadata without mutating score fields', () => {
    const row = {
      id: 10,
      score: 0.61,
      rrfScore: 0.57,
      similarity: 81,
      content: [
        '<!-- ANCHOR:DECISION-pipeline-004 -->',
        'Decision content.',
        '<!-- /ANCHOR:DECISION-pipeline-004 -->',
      ].join('\n'),
    } as PipelineRow;

    const [enriched] = enrichResultsWithAnchorMetadata([row]);
    const anchorMetadata = (enriched as PipelineRow & { anchorMetadata?: Array<{ type: string }> }).anchorMetadata;

    expect(anchorMetadata).toBeDefined();
    expect(anchorMetadata?.[0]?.type).toBe('DECISION');
    expect(enriched.score).toBe(row.score);
    expect(enriched.rrfScore).toBe(row.rrfScore);
    expect(enriched.similarity).toBe(row.similarity);
  });
});

describe('F05 remediation: validation signals as retrieval metadata', () => {
  it('applies bounded validation multiplier and preserves rank intent', () => {
    const highMeta = extractValidationMetadata({
      id: 1,
      importance_tier: 'constitutional',
      quality_score: 0.98,
      content: '<!-- SPECKIT_LEVEL: 3 -->\n<!-- VALIDATED -->',
      file_path: '/specs/100/checklist.md',
    } as PipelineRow);

    const lowMeta = extractValidationMetadata({
      id: 2,
      importance_tier: 'deprecated',
      quality_score: 0.1,
      content: 'stale content',
      file_path: '/specs/100/spec.md',
    } as PipelineRow);

    expect(highMeta).not.toBeNull();
    expect(lowMeta).not.toBeNull();

    const baseScore = 0.5;
    const adjusted = stage2Testables.applyValidationSignalScoring([
      { id: 1, score: baseScore, validationMetadata: highMeta! } as PipelineRow,
      { id: 2, score: baseScore, validationMetadata: lowMeta! } as PipelineRow,
    ]);

    for (const row of adjusted) {
      const ratio = (row.score as number) / baseScore;
      expect(ratio).toBeGreaterThanOrEqual(0.8);
      expect(ratio).toBeLessThanOrEqual(1.2);
    }

    expect((adjusted[0].score as number)).toBeGreaterThan(adjusted[1].score as number);
  });
});

describe('F16 remediation: backend storage adapter abstraction', () => {
  it('keeps SQLiteVectorStore aligned to IVectorStore contract', () => {
    expect(Object.getPrototypeOf(SQLiteVectorStore.prototype)).toBe(IVectorStore.prototype);
  });

  it('exposes required adapter methods without eager initialization', () => {
    const store = new SQLiteVectorStore();
    const expectedMethods = [
      'search',
      'upsert',
      'delete',
      'get',
      'getStats',
      'isAvailable',
      'getEmbeddingDimension',
      'close',
    ] as const;

    for (const method of expectedMethods) {
      expect(typeof (store as unknown as Record<string, unknown>)[method]).toBe('function');
    }

    expect((store as { _initialized?: boolean })._initialized).toBe(false);
  });
});
