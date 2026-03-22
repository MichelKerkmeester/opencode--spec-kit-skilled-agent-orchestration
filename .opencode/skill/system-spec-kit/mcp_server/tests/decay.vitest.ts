// ───────────────────────────────────────────────────────────────
// 1. TEST — CLASSIFICATION DECAY (TM-03)
// ───────────────────────────────────────────────────────────────
// Tests for CONTEXT_TYPE_STABILITY_MULTIPLIER,
// IMPORTANCE_TIER_STABILITY_MULTIPLIER, getClassificationDecayMultiplier,
// ApplyClassificationDecay, and the SPECKIT_CLASSIFICATION_DECAY feature flag.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  CONTEXT_TYPE_STABILITY_MULTIPLIER,
  IMPORTANCE_TIER_STABILITY_MULTIPLIER,
  getClassificationDecayMultiplier,
  applyClassificationDecay,
  calculateRetrievability,
} from '../lib/cognitive/fsrs-scheduler';

// Helpers
function withFlag(value: string | undefined, fn: () => void): void {
  const original = process.env.SPECKIT_CLASSIFICATION_DECAY;
  if (value === undefined) {
    delete process.env.SPECKIT_CLASSIFICATION_DECAY;
  } else {
    process.env.SPECKIT_CLASSIFICATION_DECAY = value;
  }
  try {
    fn();
  } finally {
    if (original === undefined) {
      delete process.env.SPECKIT_CLASSIFICATION_DECAY;
    } else {
      process.env.SPECKIT_CLASSIFICATION_DECAY = original;
    }
  }
}

// T020-1: Constitutional / critical importance tier — no decay
describe('T020-1: Constitutional and critical tiers never decay', () => {
  it('constitutional importance_tier multiplier is Infinity', () => {
    expect(IMPORTANCE_TIER_STABILITY_MULTIPLIER['constitutional']).toBe(Infinity);
  });

  it('critical importance_tier multiplier is Infinity', () => {
    expect(IMPORTANCE_TIER_STABILITY_MULTIPLIER['critical']).toBe(Infinity);
  });

  it('getClassificationDecayMultiplier returns Infinity for constitutional + general', () => {
    const mult = getClassificationDecayMultiplier('general', 'constitutional');
    expect(mult).toBe(Infinity);
  });

  it('getClassificationDecayMultiplier returns Infinity for critical + implementation', () => {
    const mult = getClassificationDecayMultiplier('implementation', 'critical');
    expect(mult).toBe(Infinity);
  });

  it('applyClassificationDecay returns Infinity for constitutional tier (flag=true)', () => {
    withFlag('true', () => {
      const result = applyClassificationDecay(10, 'implementation', 'constitutional');
      expect(result).toBe(Infinity);
    });
  });

  it('calculateRetrievability with Infinity stability returns 1.0 regardless of elapsed days', () => {
    // When applyClassificationDecay returns Infinity, plug into calculateRetrievability
    const elapsedValues = [0, 1, 30, 365, 10000];
    for (const elapsed of elapsedValues) {
      const r = calculateRetrievability(Infinity, elapsed);
      expect(r).toBeCloseTo(1.0, 6);
    }
  });
});

// T020-2: Decision context_type — no decay
describe('T020-2: Decision context_type never decays', () => {
  it('decision context_type multiplier is Infinity', () => {
    expect(CONTEXT_TYPE_STABILITY_MULTIPLIER['decision']).toBe(Infinity);
  });

  it('getClassificationDecayMultiplier returns Infinity for decision + normal tier', () => {
    const mult = getClassificationDecayMultiplier('decision', 'normal');
    expect(mult).toBe(Infinity);
  });

  it('applyClassificationDecay returns Infinity for decision context (flag=true)', () => {
    withFlag('true', () => {
      const result = applyClassificationDecay(5, 'decision', 'normal');
      expect(result).toBe(Infinity);
    });
  });
});

// T020-3: Temporary tier — faster decay
describe('T020-3: Temporary tier decays faster than normal', () => {
  it('temporary tier multiplier is 0.5', () => {
    expect(IMPORTANCE_TIER_STABILITY_MULTIPLIER['temporary']).toBe(0.5);
  });

  it('deprecated tier multiplier is 0.25', () => {
    expect(IMPORTANCE_TIER_STABILITY_MULTIPLIER['deprecated']).toBe(0.25);
  });

  it('applyClassificationDecay halves stability for temporary (flag=true)', () => {
    withFlag('true', () => {
      const baseStability = 10;
      const result = applyClassificationDecay(baseStability, 'general', 'temporary');
      expect(result).toBeCloseTo(5.0, 6);
    });
  });

  it('temporary decays faster than normal: retrievability at 30 days', () => {
    withFlag('true', () => {
      const baseStability = 10;
      const elapsed = 30;

      const normalStability = applyClassificationDecay(baseStability, 'general', 'normal');
      const temporaryStability = applyClassificationDecay(baseStability, 'general', 'temporary');

      const rNormal = calculateRetrievability(normalStability, elapsed);
      const rTemporary = calculateRetrievability(temporaryStability, elapsed);

      expect(temporaryStability).toBeLessThan(normalStability);
      expect(rTemporary).toBeLessThan(rNormal);
    });
  });
});

// T020-4: Combined multipliers
describe('T020-4: Combined context_type and importance_tier multipliers', () => {
  it('research + important = 2.0 * 1.5 = 3.0', () => {
    const mult = getClassificationDecayMultiplier('research', 'important');
    expect(mult).toBeCloseTo(3.0, 6);
  });

  it('implementation + normal = 1.0 * 1.0 = 1.0 (standard)', () => {
    const mult = getClassificationDecayMultiplier('implementation', 'normal');
    expect(mult).toBeCloseTo(1.0, 6);
  });

  it('research + normal = 2.0 stability increase (slower decay than standard)', () => {
    withFlag('true', () => {
      const baseStability = 10;
      const researchStability = applyClassificationDecay(baseStability, 'research', 'normal');
      const normalStability = applyClassificationDecay(baseStability, 'general', 'normal');

      expect(researchStability).toBeCloseTo(20.0, 6);
      expect(researchStability).toBeGreaterThan(normalStability);

      // Higher stability = higher retrievability at same elapsed time
      const elapsed = 30;
      expect(calculateRetrievability(researchStability, elapsed))
        .toBeGreaterThan(calculateRetrievability(normalStability, elapsed));
    });
  });

  it('decision + constitutional = Infinity (both are no-decay; Infinity wins)', () => {
    const mult = getClassificationDecayMultiplier('decision', 'constitutional');
    expect(mult).toBe(Infinity);
  });
});

// T020-5: Unknown types default to 1.0
describe('T020-5: Unknown context_type and importance_tier default to 1.0', () => {
  it('unknown context_type defaults to 1.0', () => {
    const mult = getClassificationDecayMultiplier('unknown_type', 'normal');
    expect(mult).toBeCloseTo(1.0, 6);
  });

  it('unknown importance_tier defaults to 1.0', () => {
    const mult = getClassificationDecayMultiplier('general', 'unknown_tier');
    expect(mult).toBeCloseTo(1.0, 6);
  });

  it('both unknown default to 1.0 * 1.0 = 1.0', () => {
    const mult = getClassificationDecayMultiplier('unknown_ctx', 'unknown_tier');
    expect(mult).toBeCloseTo(1.0, 6);
  });

  it('applyClassificationDecay with unknown types returns unchanged stability', () => {
    withFlag('true', () => {
      const result = applyClassificationDecay(7, 'unknown_ctx', 'unknown_tier');
      expect(result).toBeCloseTo(7.0, 6);
    });
  });
});

// T020-6: Feature flag gating (SPECKIT_CLASSIFICATION_DECAY)
describe('T020-6: SPECKIT_CLASSIFICATION_DECAY feature flag gating', () => {
  it('flag unset → applyClassificationDecay applies multiplier (graduated: default ON)', () => {
    withFlag(undefined, () => {
      const result = applyClassificationDecay(10, 'decision', 'constitutional');
      // Graduated flag: unset means enabled. decision+constitutional → Infinity
      expect(result).toBe(Infinity);
    });
  });

  it('flag="false" → applyClassificationDecay returns stability unchanged', () => {
    const originalHybrid = process.env.SPECKIT_HYBRID_DECAY_POLICY;
    process.env.SPECKIT_HYBRID_DECAY_POLICY = 'false';
    try {
      withFlag('false', () => {
        const result = applyClassificationDecay(10, 'decision', 'constitutional');
        expect(result).toBe(10);
      });
    } finally {
      if (originalHybrid === undefined) {
        delete process.env.SPECKIT_HYBRID_DECAY_POLICY;
      } else {
        process.env.SPECKIT_HYBRID_DECAY_POLICY = originalHybrid;
      }
    }
  });

  it('flag="0" → applyClassificationDecay returns stability unchanged', () => {
    withFlag('0', () => {
      const result = applyClassificationDecay(10, 'temporary', 'normal');
      expect(result).toBe(10);
    });
  });

  it('flag="true" → applyClassificationDecay applies multiplier', () => {
    withFlag('true', () => {
      const result = applyClassificationDecay(10, 'general', 'temporary');
      expect(result).toBeCloseTo(5.0, 6);
    });
  });

  it('flag="1" → applyClassificationDecay applies multiplier', () => {
    withFlag('1', () => {
      const result = applyClassificationDecay(10, 'research', 'normal');
      expect(result).toBeCloseTo(20.0, 6);
    });
  });

  it('getClassificationDecayMultiplier is NOT gated (pure computation, no env check)', () => {
    // GetClassificationDecayMultiplier should always return values regardless of flag
    withFlag(undefined, () => {
      expect(getClassificationDecayMultiplier('decision', 'normal')).toBe(Infinity);
      expect(getClassificationDecayMultiplier('temporary', 'normal')).toBeCloseTo(1.0, 6);
    });
    withFlag('false', () => {
      expect(getClassificationDecayMultiplier('research', 'important')).toBeCloseTo(3.0, 6);
    });
  });
});
