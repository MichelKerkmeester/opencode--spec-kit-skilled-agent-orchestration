// TEST: Stage 2 Fusion — Feedback Signal Weighting
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockRequireDb = vi.fn();
const mockQueryLearnedTriggers = vi.fn();

vi.mock('../utils/db-helpers', () => ({
  requireDb: mockRequireDb,
}));

vi.mock('../lib/search/learned-feedback', () => ({
  queryLearnedTriggers: mockQueryLearnedTriggers,
}));

describe('Stage2 feedback signal weighting', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    mockRequireDb.mockReset();
    mockQueryLearnedTriggers.mockReset();

    // Disable negative-feedback branch so this suite isolates learned-trigger weighting.
    process.env = { ...originalEnv, SPECKIT_NEGATIVE_FEEDBACK: 'false' };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it('applies learned-trigger match.weight exactly once (no extra 0.7x scaling)', async () => {
    mockRequireDb.mockReturnValue({} as Record<string, unknown>);
    mockQueryLearnedTriggers.mockReturnValue([
      { memoryId: 1, matchedTerms: ['authentication'], weight: 0.35 },
    ]);

    const { __testables } = await import('../lib/search/pipeline/stage2-fusion');

    const results = [
      { id: 1, score: 0.4 },
      { id: 2, score: 0.4 },
    ];

    const adjusted = __testables.applyFeedbackSignals(
      results as Parameters<typeof __testables.applyFeedbackSignals>[0],
      'authentication flow'
    );

    const boosted = adjusted.find((r) => r.id === 1);
    const untouched = adjusted.find((r) => r.id === 2);

    expect(boosted).toBeDefined();
    expect(untouched).toBeDefined();
    expect(boosted!.score).toBeCloseTo(0.75, 9); // 0.4 + 0.35
    expect(untouched!.score).toBeCloseTo(0.4, 9);
  });
});
