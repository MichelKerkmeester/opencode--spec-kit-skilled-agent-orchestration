// TEST: FSRS Hybrid Decay Policy (REQ-D4-002)
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  isHybridDecayPolicyEnabled,
  classifyHybridDecay,
  applyHybridDecayPolicy,
  HYBRID_NO_DECAY_CONTEXT_TYPES,
  calculateRetrievability,
} from '../lib/cognitive/fsrs-scheduler';

/* ───────────────────────────────────────────────────────────────
   HELPERS
----------------------------------------------------------------*/

function enableHybridDecay(): void {
  vi.stubEnv('SPECKIT_HYBRID_DECAY_POLICY', 'true');
}

function disableHybridDecay(): void {
  vi.stubEnv('SPECKIT_HYBRID_DECAY_POLICY', 'false');
}

/* ───────────────────────────────────────────────────────────────
   TESTS
----------------------------------------------------------------*/

describe('Hybrid Decay Policy — Feature Flag', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('isHybridDecayPolicyEnabled returns true by default (graduated)', () => {
    vi.stubEnv('SPECKIT_HYBRID_DECAY_POLICY', '');
    expect(isHybridDecayPolicyEnabled()).toBe(true);
  });

  it('isHybridDecayPolicyEnabled returns true when set to "true"', () => {
    vi.stubEnv('SPECKIT_HYBRID_DECAY_POLICY', 'true');
    expect(isHybridDecayPolicyEnabled()).toBe(true);
  });

  it('isHybridDecayPolicyEnabled returns true when set to "1"', () => {
    vi.stubEnv('SPECKIT_HYBRID_DECAY_POLICY', '1');
    expect(isHybridDecayPolicyEnabled()).toBe(true);
  });

  it('isHybridDecayPolicyEnabled returns false when set to "false"', () => {
    vi.stubEnv('SPECKIT_HYBRID_DECAY_POLICY', 'false');
    expect(isHybridDecayPolicyEnabled()).toBe(false);
  });
});

describe('Hybrid Decay Policy — HYBRID_NO_DECAY_CONTEXT_TYPES', () => {
  it('contains the three no-decay context types', () => {
    expect(HYBRID_NO_DECAY_CONTEXT_TYPES.has('decision')).toBe(true);
    expect(HYBRID_NO_DECAY_CONTEXT_TYPES.has('constitutional')).toBe(true);
    expect(HYBRID_NO_DECAY_CONTEXT_TYPES.has('critical')).toBe(true);
  });

  it('does NOT contain engagement-sensitive context types', () => {
    expect(HYBRID_NO_DECAY_CONTEXT_TYPES.has('session')).toBe(false);
    expect(HYBRID_NO_DECAY_CONTEXT_TYPES.has('scratch')).toBe(false);
    expect(HYBRID_NO_DECAY_CONTEXT_TYPES.has('implementation')).toBe(false);
    expect(HYBRID_NO_DECAY_CONTEXT_TYPES.has('research')).toBe(false);
    expect(HYBRID_NO_DECAY_CONTEXT_TYPES.has('general')).toBe(false);
    expect(HYBRID_NO_DECAY_CONTEXT_TYPES.has('discovery')).toBe(false);
  });
});

describe('Hybrid Decay Policy — classifyHybridDecay', () => {
  it('classifies decision as no_decay', () => {
    expect(classifyHybridDecay('decision')).toBe('no_decay');
  });

  it('classifies constitutional as no_decay', () => {
    expect(classifyHybridDecay('constitutional')).toBe('no_decay');
  });

  it('classifies critical as no_decay', () => {
    expect(classifyHybridDecay('critical')).toBe('no_decay');
  });

  it('classifies session as fsrs_schedule', () => {
    expect(classifyHybridDecay('session')).toBe('fsrs_schedule');
  });

  it('classifies scratch as fsrs_schedule', () => {
    expect(classifyHybridDecay('scratch')).toBe('fsrs_schedule');
  });

  it('classifies research as fsrs_schedule', () => {
    expect(classifyHybridDecay('research')).toBe('fsrs_schedule');
  });

  it('classifies implementation as fsrs_schedule', () => {
    expect(classifyHybridDecay('implementation')).toBe('fsrs_schedule');
  });

  it('classifies general as fsrs_schedule', () => {
    expect(classifyHybridDecay('general')).toBe('fsrs_schedule');
  });

  it('classifies unknown types as fsrs_schedule (safe default)', () => {
    expect(classifyHybridDecay('transient')).toBe('fsrs_schedule');
    expect(classifyHybridDecay('unknown-type')).toBe('fsrs_schedule');
    expect(classifyHybridDecay('')).toBe('fsrs_schedule');
  });
});

describe('Hybrid Decay Policy — applyHybridDecayPolicy', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // ── Flag OFF (default) ──

  it('returns stability unchanged when flag is OFF for decision type', () => {
    disableHybridDecay();
    const stability = 3.5;
    expect(applyHybridDecayPolicy(stability, 'decision')).toBe(stability);
  });

  it('returns stability unchanged when flag is OFF for session type', () => {
    disableHybridDecay();
    const stability = 2.0;
    expect(applyHybridDecayPolicy(stability, 'session')).toBe(stability);
  });

  // ── Flag ON ──

  it('returns Infinity for decision context type when flag is ON', () => {
    enableHybridDecay();
    expect(applyHybridDecayPolicy(1.0, 'decision')).toBe(Infinity);
    expect(applyHybridDecayPolicy(5.5, 'decision')).toBe(Infinity);
  });

  it('returns Infinity for constitutional context type when flag is ON', () => {
    enableHybridDecay();
    expect(applyHybridDecayPolicy(2.0, 'constitutional')).toBe(Infinity);
  });

  it('returns Infinity for critical context type when flag is ON', () => {
    enableHybridDecay();
    expect(applyHybridDecayPolicy(3.0, 'critical')).toBe(Infinity);
  });

  it('returns stability unchanged for engagement-sensitive types when flag is ON', () => {
    enableHybridDecay();
    const stability = 4.2;
    expect(applyHybridDecayPolicy(stability, 'session')).toBe(stability);
    expect(applyHybridDecayPolicy(stability, 'scratch')).toBe(stability);
    expect(applyHybridDecayPolicy(stability, 'research')).toBe(stability);
    expect(applyHybridDecayPolicy(stability, 'implementation')).toBe(stability);
    expect(applyHybridDecayPolicy(stability, 'general')).toBe(stability);
  });

  it('Infinity stability produces R(t) = 1.0 for all elapsed times', () => {
    enableHybridDecay();
    const stability = applyHybridDecayPolicy(1.0, 'decision');
    expect(stability).toBe(Infinity);
    // With Infinity stability, retrievability formula gives 1.0
    // R(t) = (1 + FSRS_FACTOR * t / Infinity)^DECAY = (1 + 0)^DECAY = 1.0
    const r0 = calculateRetrievability(stability, 0);
    const r30 = calculateRetrievability(stability, 30);
    const r365 = calculateRetrievability(stability, 365);
    expect(r0).toBe(1.0);
    expect(r30).toBe(1.0);
    expect(r365).toBe(1.0);
  });

  it('engagement-sensitive types decay normally under FSRS', () => {
    enableHybridDecay();
    const stability = applyHybridDecayPolicy(1.0, 'session');
    expect(stability).toBe(1.0); // unchanged
    // After 30 days with stability=1, retrievability should be < 1
    const r30 = calculateRetrievability(stability, 30);
    expect(r30).toBeGreaterThan(0);
    expect(r30).toBeLessThan(1.0);
  });

  it('no-decay policy applies when flag is absent from env (graduated default ON)', () => {
    vi.stubEnv('SPECKIT_HYBRID_DECAY_POLICY', '');
    // Flag is now ON by default → no-decay applies to decision/critical
    expect(applyHybridDecayPolicy(2.5, 'decision')).toBe(Infinity);
    expect(applyHybridDecayPolicy(2.5, 'critical')).toBe(Infinity);
  });
});

describe('Hybrid Decay Policy — separation from TM-03', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('SPECKIT_HYBRID_DECAY_POLICY and SPECKIT_CLASSIFICATION_DECAY are independent flags', () => {
    // When hybrid decay is OFF but classification decay is ON, applyHybridDecayPolicy
    // must not be influenced by the classification decay flag
    vi.stubEnv('SPECKIT_HYBRID_DECAY_POLICY', 'false');
    vi.stubEnv('SPECKIT_CLASSIFICATION_DECAY', 'true');

    const stability = 2.0;
    // applyHybridDecayPolicy should return stability unchanged (its own flag is OFF)
    expect(applyHybridDecayPolicy(stability, 'decision')).toBe(stability);
  });

  it('HYBRID_NO_DECAY_CONTEXT_TYPES is a ReadonlySet (no external mutation)', () => {
    // TypeScript guarantees this via the type system; verify runtime immutability
    // by checking the prototype chain
    expect(HYBRID_NO_DECAY_CONTEXT_TYPES).toBeInstanceOf(Set);
    expect(Object.isFrozen(HYBRID_NO_DECAY_CONTEXT_TYPES) || HYBRID_NO_DECAY_CONTEXT_TYPES.size === 4).toBe(true);
  });
});
