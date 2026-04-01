// ───────────────────────────────────────────────────────────────
// 1. TEST — COLD START (Score Cap)
// ───────────────────────────────────────────────────────────────
// Phase D cleanup: NOVELTY_BOOST dead code removed.
// Retained: score-cap assertions for calculateFiveFactorScore / calculateCompositeScore.
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
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

// Score cap at 0.95
describe('score cap at 0.95', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('five-factor score does not exceed 0.95 even with maximum inputs', () => {
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

  it('legacy composite score does not exceed 0.95 even with maximum inputs', () => {
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
