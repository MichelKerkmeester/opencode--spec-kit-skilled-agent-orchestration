import { describe, expect, it } from 'vitest';

import {
  comparePrecisionAware,
  isLowPrecision,
  normalizeTimestampPrecision,
} from '../../lib/continuity/timestamp-normalize.js';

describe('timestamp precision normalization', () => {
  it('detects date-only timestamps as low precision', () => {
    expect(isLowPrecision('2026-04-18')).toBe(true);
  });

  it('detects midnight Z timestamps as low precision', () => {
    expect(isLowPrecision('2026-04-18T00:00:00Z')).toBe(true);
  });

  it('detects midnight +00:00 timestamps as low precision', () => {
    expect(isLowPrecision('2026-04-18T00:00:00+00:00')).toBe(true);
  });

  it('keeps precise timestamps out of the low-precision bucket', () => {
    expect(isLowPrecision('2026-04-18T14:30:45.123Z')).toBe(false);
  });

  it('normalizes date-only timestamps to canonical UTC midnight', () => {
    expect(normalizeTimestampPrecision('2026-04-18')).toBe('2026-04-18T00:00:00Z');
  });

  it('bypasses strict comparisons when either timestamp is low precision', () => {
    expect(comparePrecisionAware(
      '2026-04-18',
      '2026-04-18T14:30:45.123Z',
      600000,
    )).toBe('low_precision_bypass');
  });

  it('marks large precise deltas as stale', () => {
    expect(comparePrecisionAware(
      '2026-04-18T14:30:45.123Z',
      '2026-04-18T13:30:45.123Z',
      600000,
    )).toBe('stale');
  });

  it('marks small precise deltas as fresh', () => {
    expect(comparePrecisionAware(
      '2026-04-18T14:30:45.123Z',
      '2026-04-18T14:25:45.123Z',
      600000,
    )).toBe('fresh');
  });
});
