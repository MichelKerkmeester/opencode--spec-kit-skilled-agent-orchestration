import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { classifyState } from '../lib/cognitive/tier-classifier.js';
import {
  calculateCompositeScore,
  calculateRetrievabilityScore,
} from '../lib/scoring/composite-scoring.js';

interface CanonicalDecayRow {
  id: number;
  document_type: 'spec_doc' | 'continuity';
  title: string;
  file_path: string;
  spec_folder: string;
  anchor_id: string | null;
  similarity: number;
  importance_weight: number;
  importance_tier: string;
  context_type: string;
  access_count: number;
  created_at: string;
  updated_at: string;
  last_review: string;
  stability: number;
  review_count: number;
}

const FIXTURE_SPEC_FOLDER =
  'system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/004-gate-d-reader-ready';
const BASE_NOW = new Date('2026-04-11T12:00:00.000Z');

function buildCanonicalRow(overrides: Partial<CanonicalDecayRow>): CanonicalDecayRow {
  const documentType = overrides.document_type ?? 'spec_doc';
  const basename = documentType === 'continuity'
    ? 'implementation-summary.md'
    : 'tasks.md';
  const anchorId = documentType === 'continuity' ? '_memory.continuity' : null;

  return {
    id: overrides.id ?? 1,
    document_type: documentType,
    title: overrides.title ?? (documentType === 'continuity' ? 'Thin continuity' : 'Canonical doc'),
    file_path: overrides.file_path
      ?? `/.opencode/specs/${FIXTURE_SPEC_FOLDER}/${basename}`,
    spec_folder: overrides.spec_folder ?? FIXTURE_SPEC_FOLDER,
    anchor_id: overrides.anchor_id ?? anchorId,
    similarity: overrides.similarity ?? 97,
    importance_weight: overrides.importance_weight ?? 0.75,
    importance_tier: overrides.importance_tier ?? 'normal',
    context_type: overrides.context_type ?? 'implementation',
    access_count: overrides.access_count ?? 2,
    created_at: overrides.created_at ?? '2026-03-01T09:00:00.000Z',
    updated_at: overrides.updated_at ?? '2026-03-01T09:00:00.000Z',
    last_review: overrides.last_review ?? '2026-03-01T09:00:00.000Z',
    stability: overrides.stability ?? 1.2,
    review_count: overrides.review_count ?? 1,
  };
}

describe('Gate D regression FSRS cognitive decay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(BASE_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('keeps FSRS decay canonical-only, content-agnostic across spec_doc and continuity, and lets fresher canonical rows outrank stale ones', () => {
    const staleSpecDoc = buildCanonicalRow({
      id: 801,
      document_type: 'spec_doc',
      title: 'Stale canonical tasks',
      file_path: `/.opencode/specs/${FIXTURE_SPEC_FOLDER}/tasks.md`,
      last_review: '2026-02-20T09:00:00.000Z',
      updated_at: '2026-02-20T09:00:00.000Z',
      stability: 1.2,
      review_count: 1,
    });
    const staleContinuity = buildCanonicalRow({
      id: 802,
      document_type: 'continuity',
      title: 'Stale thin continuity',
      file_path: `/.opencode/specs/${FIXTURE_SPEC_FOLDER}/implementation-summary.md`,
      last_review: '2026-02-20T09:00:00.000Z',
      updated_at: '2026-02-20T09:00:00.000Z',
      stability: 1.2,
      review_count: 1,
    });
    const freshCanonical = buildCanonicalRow({
      id: 803,
      document_type: 'spec_doc',
      title: 'Fresh canonical summary',
      file_path: `/.opencode/specs/${FIXTURE_SPEC_FOLDER}/implementation-summary.md`,
      last_review: '2026-04-10T09:00:00.000Z',
      updated_at: '2026-04-10T09:00:00.000Z',
      stability: 6.5,
      review_count: 7,
    });

    const staleSpecAtBase = calculateRetrievabilityScore(staleSpecDoc);
    const staleContinuityAtBase = calculateRetrievabilityScore(staleContinuity);
    const freshAtBase = calculateRetrievabilityScore(freshCanonical);

    expect(staleSpecAtBase).toBeCloseTo(staleContinuityAtBase, 8);
    expect(freshAtBase).toBeGreaterThan(staleSpecAtBase);

    const staleSpecCompositeAtBase = calculateCompositeScore(staleSpecDoc);
    const staleContinuityCompositeAtBase = calculateCompositeScore(staleContinuity);
    const freshCompositeAtBase = calculateCompositeScore(freshCanonical);

    expect(staleSpecCompositeAtBase).toBeCloseTo(staleContinuityCompositeAtBase, 8);
    expect(freshCompositeAtBase).toBeGreaterThan(staleSpecCompositeAtBase);

    vi.setSystemTime(new Date('2026-05-21T12:00:00.000Z'));

    const staleSpecAtLater = calculateRetrievabilityScore(staleSpecDoc);
    const staleContinuityAtLater = calculateRetrievabilityScore(staleContinuity);
    const freshAtLater = calculateRetrievabilityScore(freshCanonical);

    expect(staleSpecAtLater).toBeLessThan(staleSpecAtBase);
    expect(staleContinuityAtLater).toBeLessThan(staleContinuityAtBase);
    expect(staleSpecAtLater).toBeCloseTo(staleContinuityAtLater, 8);
    expect(freshAtLater).toBeLessThan(freshAtBase);
    expect(freshAtLater).toBeGreaterThan(staleSpecAtLater);

    const staleElapsedDays = 90;
    const freshElapsedDays = 41;

    expect(classifyState(staleSpecAtLater, staleElapsedDays)).not.toBe('HOT');
    expect(classifyState(staleContinuityAtLater, staleElapsedDays)).toBe(
      classifyState(staleSpecAtLater, staleElapsedDays),
    );
    expect(['HOT', 'WARM']).toContain(classifyState(freshAtLater, freshElapsedDays));
  });
});
