import { afterEach, describe, expect, it } from 'vitest';

import {
  HYBRID_FSRS_CONTEXT_TYPES,
  HYBRID_NO_DECAY_CONTEXT_TYPES,
  NO_DECAY,
  applyClassificationDecay,
  applyHybridDecayPolicy,
  getHybridDecayMultiplier,
  isHybridDecayPolicyEnabled,
} from '../lib/cognitive/fsrs-scheduler';

describe('FSRS hybrid decay policy', () => {
  afterEach(() => {
    delete process.env.SPECKIT_HYBRID_DECAY_POLICY;
    delete process.env.SPECKIT_CLASSIFICATION_DECAY;
  });

  it('assigns NO_DECAY to decision, constitutional, and critical context types', () => {
    // Flag is now ON by default (graduated), explicit set kept for clarity
    expect(HYBRID_NO_DECAY_CONTEXT_TYPES.has('decision')).toBe(true);
    expect(HYBRID_NO_DECAY_CONTEXT_TYPES.has('constitutional')).toBe(true);
    expect(HYBRID_NO_DECAY_CONTEXT_TYPES.has('critical')).toBe(true);
    expect(getHybridDecayMultiplier('decision', 'normal')).toBe(NO_DECAY);
    expect(getHybridDecayMultiplier('constitutional', 'normal')).toBe(NO_DECAY);
    expect(getHybridDecayMultiplier('critical', 'normal')).toBe(NO_DECAY);
    expect(applyHybridDecayPolicy(4, 'decision', 'normal')).toBe(NO_DECAY);
  });

  it('routes session, scratch, and transient documents through standard FSRS scheduling', () => {
    // Flag is now ON by default (graduated), explicit set kept for clarity
    expect(HYBRID_FSRS_CONTEXT_TYPES.has('session')).toBe(true);
    expect(HYBRID_FSRS_CONTEXT_TYPES.has('scratch')).toBe(true);
    expect(HYBRID_FSRS_CONTEXT_TYPES.has('transient')).toBe(true);
    expect(getHybridDecayMultiplier('session', 'critical')).toBe(1);
    expect(getHybridDecayMultiplier('scratch', 'constitutional')).toBe(1);
    expect(applyHybridDecayPolicy(6, 'transient', 'critical')).toBe(6);
  });

  it('makes applyClassificationDecay honor the hybrid no-decay override when enabled', () => {
    // Flag is now ON by default (graduated); SPECKIT_CLASSIFICATION_DECAY=false to isolate test
    process.env.SPECKIT_CLASSIFICATION_DECAY = 'false';

    expect(applyClassificationDecay(2.5, 'critical', 'temporary')).toBe(NO_DECAY);
    expect(applyClassificationDecay(2.5, 'session', 'constitutional')).toBe(2.5);
  });

  it('gates hybrid behavior behind SPECKIT_HYBRID_DECAY_POLICY', () => {
    // Flag is now ON by default (graduated)
    expect(isHybridDecayPolicyEnabled()).toBe(true);
    expect(getHybridDecayMultiplier('decision', 'normal')).toBe(NO_DECAY);
    expect(applyHybridDecayPolicy(3, 'decision', 'normal')).toBe(NO_DECAY);

    // Explicitly disable
    process.env.SPECKIT_HYBRID_DECAY_POLICY = 'false';

    expect(isHybridDecayPolicyEnabled()).toBe(false);
    expect(getHybridDecayMultiplier('decision', 'normal')).toBe(1);
  });
});
