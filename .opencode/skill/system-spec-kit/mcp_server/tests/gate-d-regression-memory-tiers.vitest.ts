import { describe, expect, it } from 'vitest';

import { applyCompositeScoring } from '../lib/scoring/composite-scoring';
import { isExcludedFromSearch } from '../lib/scoring/importance-tiers';

type SearchableRow = {
  id: number;
  title: string;
  file_path: string;
  document_type: string;
  anchor_id?: string;
  importance_tier: string;
  importance_weight: number;
  similarity: number;
  updated_at: string;
  created_at: string;
  access_count: number;
  stability: number;
  lastReview: string;
};

function buildCanonicalRow(overrides: Partial<SearchableRow>): SearchableRow {
  return {
    id: 0,
    title: 'Canonical reader-ready row',
    file_path: '/tmp/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/spec.md',
    document_type: 'spec',
    importance_tier: 'normal',
    importance_weight: 0.4,
    similarity: 32,
    updated_at: '2026-03-21T12:00:00Z',
    created_at: '2026-03-21T12:00:00Z',
    access_count: 0,
    stability: 1,
    lastReview: '2026-03-21T12:00:00Z',
    ...overrides,
  };
}

describe('Gate D regression 7 — memory tiers', () => {
  it('preserves canonical tier priority with anchor-level overrides and no legacy fallback surfaces', () => {
    const sameTopicRows: SearchableRow[] = [
      buildCanonicalRow({
        id: 701,
        title: 'Constitutional reader-ready contract',
        file_path: '/tmp/.opencode/skill/system-spec-kit/constitutional/reader-ready-rules.md',
        document_type: 'constitutional',
        importance_tier: 'constitutional',
        importance_weight: 1,
      }),
      buildCanonicalRow({
        id: 702,
        title: 'Critical anchor override for resume contract',
        anchor_id: 'DECISION-reader-ready-priority',
        importance_tier: 'critical',
        importance_weight: 0.5,
      }),
      buildCanonicalRow({
        id: 703,
        title: 'Normal anchor in the same spec doc',
        anchor_id: 'notes-reader-ready-follow-up',
        importance_tier: 'normal',
        importance_weight: 0.5,
      }),
      buildCanonicalRow({
        id: 704,
        title: 'Deprecated row should stay hidden',
        file_path: '/tmp/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/tasks.md',
        document_type: 'tasks',
        importance_tier: 'deprecated',
        importance_weight: 1,
        similarity: 99,
      }),
    ];

    const searchableRows = sameTopicRows.filter((row) => !isExcludedFromSearch(row.importance_tier));
    const ranked = applyCompositeScoring(searchableRows, {
      query: 'reader ready canonical continuity contract',
    });

    expect(searchableRows).toHaveLength(3);
    expect(searchableRows.every((row) => row.document_type !== 'memory')).toBe(true);
    expect(searchableRows.every((row) => !row.file_path.includes('/memory/'))).toBe(true);

    expect(ranked.map((row) => row.id)).toEqual([701, 702, 703]);
    expect(ranked[0].importance_tier).toBe('constitutional');
    expect(ranked[1].anchor_id).toBe('DECISION-reader-ready-priority');
    expect(ranked[2].anchor_id).toBe('notes-reader-ready-follow-up');
    expect(ranked[1].file_path).toBe(ranked[2].file_path);
    expect(ranked[1].composite_score).toBeGreaterThan(ranked[2].composite_score);
    expect(ranked.some((row) => row.id === 704)).toBe(false);
  });
});
