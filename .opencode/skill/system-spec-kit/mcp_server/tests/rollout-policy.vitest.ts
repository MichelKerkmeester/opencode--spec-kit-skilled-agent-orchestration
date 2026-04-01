// TEST: ROLLOUT POLICY (T061-T065 prep)
import { afterEach, describe, expect, it } from 'vitest';
import {
  deterministicBucket,
  getRolloutPercent,
  isFeatureEnabled,
  isIdentityInRollout,
} from '../lib/cognitive/rollout-policy';

const ROLLOUT_FLAGS = [
  'SPECKIT_ROLLOUT_PERCENT',
  'SPECKIT_EXTRACTION',
  'SPECKIT_SESSION_BOOST',
  'SPECKIT_PRESSURE_POLICY',
  'SPECKIT_EVENT_DECAY',
  'SPECKIT_CAUSAL_BOOST',
  'SPECKIT_AUTO_RESUME',
  'SPECKIT_ADAPTIVE_FUSION',
  'SPECKIT_EXTENDED_TELEMETRY',
] as const;

const originalEnv = Object.fromEntries(
  ROLLOUT_FLAGS.map((flag) => [flag, process.env[flag]])
) as Record<string, string | undefined>;

describe('rollout policy', () => {
  afterEach(() => {
    for (const flag of ROLLOUT_FLAGS) {
      const value = originalEnv[flag];
      if (value === undefined) {
        delete process.env[flag];
      } else {
        process.env[flag] = value;
      }
    }
  });

  it('uses full rollout when percent not configured', () => {
    delete process.env.SPECKIT_ROLLOUT_PERCENT;
    expect(getRolloutPercent()).toBe(100);
  });

  it('falls back to full rollout for malformed percent values', () => {
    process.env.SPECKIT_ROLLOUT_PERCENT = '50abc';
    expect(getRolloutPercent()).toBe(100);

    process.env.SPECKIT_ROLLOUT_PERCENT = '1e2';
    expect(getRolloutPercent()).toBe(100);
  });

  it('supports deterministic bucket assignment', () => {
    const bucketA = deterministicBucket('session-a');
    const bucketB = deterministicBucket('session-a');
    expect(bucketA).toBe(bucketB);
    expect(bucketA).toBeGreaterThanOrEqual(0);
    expect(bucketA).toBeLessThan(100);
  });

  it('gates identities by configured rollout percent', () => {
    process.env.SPECKIT_ROLLOUT_PERCENT = '0';
    expect(isIdentityInRollout('x')).toBe(false);

    process.env.SPECKIT_ROLLOUT_PERCENT = '100';
    expect(isIdentityInRollout('x')).toBe(true);
  });

  it('requires both feature flag and rollout membership', () => {
    process.env.SPECKIT_EXTRACTION = 'false';
    process.env.SPECKIT_ROLLOUT_PERCENT = '100';
    expect(isFeatureEnabled('SPECKIT_EXTRACTION', 'session-1')).toBe(false);

    process.env.SPECKIT_EXTRACTION = 'true';
    process.env.SPECKIT_ROLLOUT_PERCENT = '100';
    expect(isFeatureEnabled('SPECKIT_EXTRACTION', 'session-1')).toBe(true);
  });

  it('defaults new rollout features to enabled when unset', () => {
    delete process.env.SPECKIT_ROLLOUT_PERCENT;

    const featureFlags = [
      'SPECKIT_SESSION_BOOST',
      'SPECKIT_PRESSURE_POLICY',
      'SPECKIT_EVENT_DECAY',
      'SPECKIT_EXTRACTION',
      'SPECKIT_CAUSAL_BOOST',
      'SPECKIT_AUTO_RESUME',
      'SPECKIT_ADAPTIVE_FUSION',
      'SPECKIT_EXTENDED_TELEMETRY',
    ] as const;

    for (const flag of featureFlags) {
      delete process.env[flag];
      expect(isFeatureEnabled(flag, 'session-default-on')).toBe(true);
    }
  });

  it('defaults to enabled for partial rollout when identity is missing', () => {
    process.env.SPECKIT_ROLLOUT_PERCENT = '50';
    process.env.SPECKIT_EXTRACTION = 'true';

    // With no identity, rollout policy defaults to enabled (fail-open for missing identity)
    expect(isFeatureEnabled('SPECKIT_EXTRACTION')).toBe(true);
    expect(isFeatureEnabled('SPECKIT_EXTRACTION', '')).toBe(true);
    expect(isFeatureEnabled('SPECKIT_EXTRACTION', '   ')).toBe(true);
  });

  it("treats '0' as an explicit feature disable signal", () => {
    process.env.SPECKIT_ROLLOUT_PERCENT = '100';
    process.env.SPECKIT_EXTRACTION = '0';
    expect(isFeatureEnabled('SPECKIT_EXTRACTION', 'session-1')).toBe(false);
  });
});
