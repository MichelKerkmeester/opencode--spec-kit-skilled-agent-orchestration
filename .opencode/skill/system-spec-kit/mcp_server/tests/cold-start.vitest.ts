// ───────────────────────────────────────────────────────────────
// 1. TEST — COLD START (N4)
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calculateNoveltyBoost,
  calculateFiveFactorScore,
  calculateCompositeScore,
} from '../lib/scoring/composite-scoring';

// Helpers
/** Build a minimal ScoringInput row with a given created_at timestamp. */
function makeRow(createdAtMs: number, overrides: Record<string, unknown> = {}) {
  return {
    created_at: new Date(createdAtMs).toISOString(),
    importance_tier: 'normal',
    importance_weight: 0.5,
    access_count: 0,
    similarity: 0,
    ...overrides,
  };
}

/** Return a timestamp that is `hours` hours in the past relative to Date.now(). */
function hoursAgo(hours: number): number {
  return Date.now() - hours * 3600000;
}

// N4: calculateNoveltyBoost
describe('calculateNoveltyBoost — flag disabled (default)', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns 0 when SPECKIT_NOVELTY_BOOST is not set', () => {
    const boost = calculateNoveltyBoost(new Date(hoursAgo(0)).toISOString());
    expect(boost).toBe(0);
  });

  it('returns 0 when SPECKIT_NOVELTY_BOOST is "false"', () => {
    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'false');
    const boost = calculateNoveltyBoost(new Date(hoursAgo(0)).toISOString());
    expect(boost).toBe(0);
  });
});

describe('calculateNoveltyBoost — feature removed (always returns 0)', () => {
  beforeEach(() => {
    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'true');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('at 0h returns 0 (feature removed)', () => {
    const createdAt = new Date(Date.now() - 1000).toISOString();
    const boost = calculateNoveltyBoost(createdAt);
    expect(boost).toBe(0);
  });

  it('at 12h returns 0 (feature removed)', () => {
    const createdAt = new Date(hoursAgo(12)).toISOString();
    const boost = calculateNoveltyBoost(createdAt);
    expect(boost).toBe(0);
  });

  it('at 24h returns 0 (feature removed)', () => {
    const createdAt = new Date(hoursAgo(24)).toISOString();
    const boost = calculateNoveltyBoost(createdAt);
    expect(boost).toBe(0);
  });

  it('at 48h returns 0 (feature removed)', () => {
    const createdAt = new Date(hoursAgo(48)).toISOString();
    const boost = calculateNoveltyBoost(createdAt);
    expect(boost).toBe(0);
  });

  it('returns 0 for null/undefined created_at', () => {
    expect(calculateNoveltyBoost(undefined)).toBe(0);
    expect(calculateNoveltyBoost(null as unknown as string)).toBe(0);
  });

  it('returns 0 for invalid date string', () => {
    expect(calculateNoveltyBoost('not-a-date')).toBe(0);
    expect(calculateNoveltyBoost('')).toBe(0);
  });

  it('returns 0 for future timestamps (elapsed < 0)', () => {
    const futurestamp = new Date(Date.now() + 3600000).toISOString();
    expect(calculateNoveltyBoost(futurestamp)).toBe(0);
  });

  it('returns 0 for timestamps older than 48h', () => {
    const oldStamp = new Date(hoursAgo(49)).toISOString();
    expect(calculateNoveltyBoost(oldStamp)).toBe(0);
  });
});

// N4: Score cap at 0.95
describe('score cap at 0.95', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('five-factor score does not exceed 0.95 even with boost', () => {
    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'true');

    // High base score: constitutional tier, high importance, high similarity
    const row = makeRow(Date.now() - 500, {
      importance_tier: 'constitutional',
      importance_weight: 1.0,
      similarity: 100,
      access_count: 100,
    });

    const score = calculateFiveFactorScore(row);
    expect(score).toBeLessThanOrEqual(0.95);
  });

  it('legacy composite score does not exceed 0.95 even with boost', () => {
    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'true');

    const row = makeRow(Date.now() - 500, {
      importance_tier: 'constitutional',
      importance_weight: 1.0,
      similarity: 100,
      access_count: 100,
    });

    const score = calculateCompositeScore(row);
    expect(score).toBeLessThanOrEqual(0.95);
  });
});

// N4: Both scoring paths apply the boost
describe('five-factor path — novelty boost removed', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('score is identical with or without flag (feature removed)', () => {
    const fixedNow = Date.now();
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(fixedNow);
    const createdAt = new Date(fixedNow - 100).toISOString(); // essentially 0h
    const row = {
      created_at: createdAt,
      importance_tier: 'normal',
      importance_weight: 0.5,
      access_count: 0,
      similarity: 0,
    };

    vi.unstubAllEnvs();
    const scoreWithout = calculateFiveFactorScore(row);

    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'true');
    const scoreWith = calculateFiveFactorScore(row);

    // Novelty boost removed — flag has no effect, scores are identical.
    // Date.now is fixed so this assertion is deterministic.
    expect(scoreWith).toBe(scoreWithout);
    nowSpy.mockRestore();
  });
});

describe('legacy composite path — novelty boost removed', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('score is identical with or without flag (feature removed)', () => {
    const fixedNow = Date.now();
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(fixedNow);
    const createdAt = new Date(fixedNow - 100).toISOString();
    const row = {
      created_at: createdAt,
      importance_tier: 'normal',
      importance_weight: 0.5,
      access_count: 0,
      similarity: 0,
    };

    vi.unstubAllEnvs();
    const scoreWithout = calculateCompositeScore(row);

    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'true');
    const scoreWith = calculateCompositeScore(row);

    // Novelty boost removed — flag has no effect, scores are identical.
    // Date.now is fixed so this assertion is deterministic.
    expect(scoreWith).toBe(scoreWithout);
    nowSpy.mockRestore();
  });
});
