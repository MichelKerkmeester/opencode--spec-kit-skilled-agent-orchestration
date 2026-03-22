// TEST: Calibrated Overlap Bonus (REQ-D1-001)
// Feature flag: SPECKIT_CALIBRATED_OVERLAP_BONUS
// Tests: 0-channel, 1-channel, partial scaling, max scaling, clamp, flag OFF = flat +0.10
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  fuseResultsMulti,
  CONVERGENCE_BONUS,
  CALIBRATED_OVERLAP_BETA,
  CALIBRATED_OVERLAP_MAX,
  isCalibratedOverlapBonusEnabled,
  SOURCE_TYPES,
} from '@spec-kit/shared/algorithms/rrf-fusion';

/* ──────────────────────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────────────────────── */

/** Disable score normalization so we test raw convergence bonus values. */
const savedEnv: Record<string, string | undefined> = {};

function setEnv(vars: Record<string, string | undefined>): void {
  for (const [key, value] of Object.entries(vars)) {
    savedEnv[key] = process.env[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function restoreEnv(): void {
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

beforeEach(() => {
  // Disable normalization so raw bonus values are testable
  setEnv({ SPECKIT_SCORE_NORMALIZATION: 'false' });
});

afterEach(() => {
  restoreEnv();
});

/* ──────────────────────────────────────────────────────────────
   CONSTANTS
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-001 Constants', () => {
  it('CALIBRATED_OVERLAP_BETA default is 0.15', () => {
    expect(CALIBRATED_OVERLAP_BETA).toBe(0.15);
  });

  it('CALIBRATED_OVERLAP_MAX default is 0.06', () => {
    expect(CALIBRATED_OVERLAP_MAX).toBe(0.06);
  });
});

/* ──────────────────────────────────────────────────────────────
   FEATURE FLAG
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-001 Feature Flag (SPECKIT_CALIBRATED_OVERLAP_BONUS)', () => {
  it('D1-FF-1: flag is ON by default (graduated)', () => {
    delete process.env.SPECKIT_CALIBRATED_OVERLAP_BONUS;
    expect(isCalibratedOverlapBonusEnabled()).toBe(true);
  });

  it('D1-FF-2: flag is OFF when set to "false"', () => {
    process.env.SPECKIT_CALIBRATED_OVERLAP_BONUS = 'false';
    expect(isCalibratedOverlapBonusEnabled()).toBe(false);
  });

  it('D1-FF-3: flag is ON when set to "true"', () => {
    process.env.SPECKIT_CALIBRATED_OVERLAP_BONUS = 'true';
    expect(isCalibratedOverlapBonusEnabled()).toBe(true);
    delete process.env.SPECKIT_CALIBRATED_OVERLAP_BONUS;
  });
});

/* ──────────────────────────────────────────────────────────────
   FLAG OFF: PRESERVE FLAT CONVERGENCE BONUS
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-001 Flag OFF: flat +0.10 convergence bonus preserved', () => {
  beforeEach(() => {
    setEnv({ SPECKIT_CALIBRATED_OVERLAP_BONUS: 'false' });
  });

  it('D1-OFF-1: 0 channels (no candidate) produces no bonus', () => {
    const fused = fuseResultsMulti([]);
    expect(fused).toHaveLength(0);
  });

  it('D1-OFF-2: 1 channel, single candidate — no convergence bonus', () => {
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'a', title: 'A' }] },
    ]);
    expect(fused).toHaveLength(1);
    expect(fused[0].convergenceBonus).toBe(0);
  });

  it('D1-OFF-3: 2 channels sharing same candidate — flat +0.10 bonus', () => {
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'shared', title: 'S' }] },
      { source: SOURCE_TYPES.BM25,   results: [{ id: 'shared', title: 'S' }] },
    ]);
    const shared = fused.find(r => r.id === 'shared');
    expect(shared).toBeDefined();
    expect(shared!.convergenceBonus).toBeCloseTo(CONVERGENCE_BONUS, 5);
  });

  it('D1-OFF-4: 3 channels — flat bonus is 0.10 * (3-1) = 0.20', () => {
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR,  results: [{ id: 'shared', title: 'S' }] },
      { source: SOURCE_TYPES.BM25,    results: [{ id: 'shared', title: 'S' }] },
      { source: SOURCE_TYPES.KEYWORD, results: [{ id: 'shared', title: 'S' }] },
    ]);
    const shared = fused.find(r => r.id === 'shared');
    expect(shared).toBeDefined();
    expect(shared!.convergenceBonus).toBeCloseTo(CONVERGENCE_BONUS * 2, 5);
  });
});

/* ──────────────────────────────────────────────────────────────
   FLAG ON: CALIBRATED OVERLAP BONUS BEHAVIOR
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-001 Flag ON: calibrated overlap bonus', () => {
  beforeEach(() => {
    setEnv({ SPECKIT_CALIBRATED_OVERLAP_BONUS: 'true' });
  });

  it('D1-ON-1: 0 channels produces no results', () => {
    const fused = fuseResultsMulti([]);
    expect(fused).toHaveLength(0);
  });

  it('D1-ON-2: 1 channel, single candidate — zero overlap bonus', () => {
    // 1 channel hit → channelsHit=1 → (1-1)/(1-1)=0/0, but max(1,0)=1 → overlapRatio=0
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'solo', title: 'Solo' }] },
    ]);
    expect(fused).toHaveLength(1);
    expect(fused[0].convergenceBonus).toBe(0);
  });

  it('D1-ON-3: 2 channels (total=2) sharing candidate — overlapRatio=1.0, bonus bounded by beta*meanNorm', () => {
    // With k=60, top item score = 1/61 per channel (weight 1.0)
    // globalMaxRawScore = 2 * 1/61 (both channels hit item at rank 0)
    // But globalMax is computed after accumulation (1/61 + 1/61 = 2/61)
    // meanNorm = (1/61 / (2/61)) = 0.5  (each channel contributes 1/61 / max(2/61))
    // overlapRatio = (2-1) / max(1, 2-1) = 1.0
    // overlapScore = 0.15 * 1.0 * 0.5 = 0.075 → clamped to 0.06
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'x', title: 'X' }] },
      { source: SOURCE_TYPES.BM25,   results: [{ id: 'x', title: 'X' }] },
    ]);
    const item = fused.find(r => r.id === 'x');
    expect(item).toBeDefined();
    // Bonus must be in [0, CALIBRATED_OVERLAP_MAX]
    expect(item!.convergenceBonus).toBeGreaterThan(0);
    expect(item!.convergenceBonus).toBeLessThanOrEqual(CALIBRATED_OVERLAP_MAX);
  });

  it('D1-ON-4: bonus is clamped to CALIBRATED_OVERLAP_MAX (0.06)', () => {
    // Use very high beta to force clamping
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'y', title: 'Y' }] },
      { source: SOURCE_TYPES.BM25,   results: [{ id: 'y', title: 'Y' }] },
    ], { calibratedOverlapBeta: 999 }); // extreme beta
    const item = fused.find(r => r.id === 'y');
    expect(item).toBeDefined();
    expect(item!.convergenceBonus).toBeCloseTo(CALIBRATED_OVERLAP_MAX, 5);
  });

  it('D1-ON-5: bonus is zero when beta=0', () => {
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'z', title: 'Z' }] },
      { source: SOURCE_TYPES.BM25,   results: [{ id: 'z', title: 'Z' }] },
    ], { calibratedOverlapBeta: 0 });
    const item = fused.find(r => r.id === 'z');
    expect(item).toBeDefined();
    expect(item!.convergenceBonus).toBe(0);
  });

  it('D1-ON-6: single-source candidate has zero bonus even with flag ON', () => {
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'only-vec', title: 'V' }] },
      { source: SOURCE_TYPES.BM25,   results: [{ id: 'only-bm25', title: 'B' }] },
    ]);
    const vecOnly = fused.find(r => r.id === 'only-vec');
    const bm25Only = fused.find(r => r.id === 'only-bm25');
    expect(vecOnly?.convergenceBonus).toBe(0);
    expect(bm25Only?.convergenceBonus).toBe(0);
  });

  it('D1-ON-7: partial overlap — candidate in 2 of 3 channels gets intermediate bonus', () => {
    // totalChannels=3, channelsHit=2
    // overlapRatio = (2-1) / max(1, 3-1) = 0.5
    // So bonus < full-overlap candidate
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR,  results: [{ id: 'partial', title: 'P' }, { id: 'all', title: 'A' }] },
      { source: SOURCE_TYPES.BM25,    results: [{ id: 'partial', title: 'P' }, { id: 'all', title: 'A' }] },
      { source: SOURCE_TYPES.KEYWORD, results: [{ id: 'all', title: 'A' }] },
    ]);
    const partial = fused.find(r => r.id === 'partial');
    const all3 = fused.find(r => r.id === 'all');
    expect(partial).toBeDefined();
    expect(all3).toBeDefined();
    // Partial (2/3 channels) should have smaller or equal bonus than all-3
    expect(partial!.convergenceBonus).toBeLessThanOrEqual(all3!.convergenceBonus + 1e-9);
  });

  it('D1-ON-8: bonus does not go negative', () => {
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'neg-test', title: 'N' }] },
      { source: SOURCE_TYPES.BM25,   results: [{ id: 'neg-test', title: 'N' }] },
    ], { calibratedOverlapBeta: -999 }); // invalid negative beta → falls back to default
    // Invalid beta (< 0) is rejected; falls back to CALIBRATED_OVERLAP_BETA
    const item = fused.find(r => r.id === 'neg-test');
    expect(item).toBeDefined();
    expect(item!.convergenceBonus).toBeGreaterThanOrEqual(0);
  });

  it('D1-ON-9: results are still sorted by descending rrfScore', () => {
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [
        { id: 'shared', title: 'S' },
        { id: 'vec-only', title: 'V' },
      ]},
      { source: SOURCE_TYPES.BM25, results: [
        { id: 'shared', title: 'S' },
        { id: 'bm25-only', title: 'B' },
      ]},
    ]);
    for (let i = 0; i < fused.length - 1; i++) {
      expect(fused[i].rrfScore).toBeGreaterThanOrEqual(fused[i + 1].rrfScore);
    }
  });

  it('D1-ON-10: max-overlap (all channels hit) with non-zero scores produces positive bonus', () => {
    // 4 channels, all hit same candidate
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR,  results: [{ id: 'mega', title: 'M' }] },
      { source: SOURCE_TYPES.BM25,    results: [{ id: 'mega', title: 'M' }] },
      { source: SOURCE_TYPES.KEYWORD, results: [{ id: 'mega', title: 'M' }] },
      { source: SOURCE_TYPES.FTS,     results: [{ id: 'mega', title: 'M' }] },
    ]);
    const item = fused.find(r => r.id === 'mega');
    expect(item).toBeDefined();
    // Full overlap (4/4 channels) → overlapRatio=1.0 → max possible bonus
    expect(item!.convergenceBonus).toBeGreaterThan(0);
    expect(item!.convergenceBonus).toBeLessThanOrEqual(CALIBRATED_OVERLAP_MAX + 1e-9);
  });
});

/* ──────────────────────────────────────────────────────────────
   BACKWARDS COMPATIBILITY
   ────────────────────────────────────────────────────────────── */

describe('REQ-D1-001 Backwards compatibility', () => {
  it('D1-BC-1: flag unset (undefined) behaves identically to flag ON (graduated)', () => {
    delete process.env.SPECKIT_CALIBRATED_OVERLAP_BONUS;
    setEnv({ SPECKIT_SCORE_NORMALIZATION: 'false' });

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'bc', title: 'BC' }] },
      { source: SOURCE_TYPES.BM25,   results: [{ id: 'bc', title: 'BC' }] },
    ]);
    const item = fused.find(r => r.id === 'bc');
    expect(item).toBeDefined();
    // Calibrated bonus expected when flag is graduated (default ON)
    expect(item!.convergenceBonus).toBeGreaterThanOrEqual(0);
    expect(item!.convergenceBonus).toBeLessThanOrEqual(CALIBRATED_OVERLAP_MAX + 1e-9);
  });

  it('D1-BC-2: calibratedOverlapBeta option has no effect when flag is OFF', () => {
    setEnv({ SPECKIT_CALIBRATED_OVERLAP_BONUS: 'false' });

    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'beta-ignored', title: 'BI' }] },
      { source: SOURCE_TYPES.BM25,   results: [{ id: 'beta-ignored', title: 'BI' }] },
    ], { calibratedOverlapBeta: 999 }); // should be ignored when flag is OFF

    const item = fused.find(r => r.id === 'beta-ignored');
    expect(item).toBeDefined();
    // Flat bonus, beta is ignored
    expect(item!.convergenceBonus).toBeCloseTo(CONVERGENCE_BONUS, 5);
  });
});
