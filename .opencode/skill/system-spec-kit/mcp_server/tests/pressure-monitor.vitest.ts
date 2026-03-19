// TEST: Pressure Monitor
import { describe, it, expect } from 'vitest';
import {
  getPressureLevel,
  INACTIVE_POLICY_WARNING,
  FOCUSED_THRESHOLD,
  QUICK_THRESHOLD,
} from '../lib/cognitive/pressure-monitor';

describe('Pressure Monitor (T016-T017)', () => {
  it('uses caller tokenUsage when provided (55%, 65%, 85%, 95%)', () => {
    const low = getPressureLevel(0.55);
    expect(low.level).toBe('none');
    expect(low.ratio).toBe(0.55);
    expect(low.source).toBe('caller');

    const focused = getPressureLevel(0.65);
    expect(focused.level).toBe('focused');
    expect(focused.ratio).toBe(0.65);

    const quick = getPressureLevel(0.85);
    expect(quick.level).toBe('quick');
    expect(quick.ratio).toBe(0.85);

    const highQuick = getPressureLevel(0.95);
    expect(highQuick.level).toBe('quick');
    expect(highQuick.ratio).toBe(0.95);
  });

  it('clamps out-of-range caller tokenUsage to [0,1]', () => {
    expect(getPressureLevel(4.2).ratio).toBe(1);
    expect(getPressureLevel(-2).ratio).toBe(0);
  });

  it('derives pressure from runtimeContextStats when caller tokenUsage is missing', () => {
    const result = getPressureLevel(undefined, { tokenCount: 1300, tokenBudget: 2000 });
    expect(result.source).toBe('estimator');
    expect(result.ratio).toBe(0.65);
    expect(result.level).toBe('focused');
  });

  it('returns none + warning when caller and estimator are unavailable', () => {
    const result = getPressureLevel(undefined, { tokenCount: 2000 });
    expect(result.source).toBe('unavailable');
    expect(result.ratio).toBeNull();
    expect(result.level).toBe('none');
    expect(result.warning).toBe(INACTIVE_POLICY_WARNING);
  });

  it('exports threshold constants for policy decisions', () => {
    expect(FOCUSED_THRESHOLD).toBe(0.6);
    expect(QUICK_THRESHOLD).toBe(0.8);
  });
});
