// TEST: FSRS FORMULA (vitest migration POC)
// Converted from: unit-fsrs-formula.test.ts (custom runner)
import { describe, it, expect } from 'vitest';
import { halfLifeToStability, calculateRetrievability } from '../lib/cognitive/tier-classifier';

// FSRS v4 constants
const HALF_LIFE_COEFFICIENT = 19 / 243;

describe('FSRS Formula (T001-T007)', () => {
  it('T001: halfLifeToStability uses FSRS power-law formula: (19/243) * halfLife', () => {
    const testCases = [1, 7, 30, 60, 90, 365];

    for (const halfLife of testCases) {
      const expected = HALF_LIFE_COEFFICIENT * halfLife;
      const actual = halfLifeToStability(halfLife);
      expect(actual).toBeCloseTo(expected, 4);
    }
  });

  it('T002: halfLifeToStability(60) ≈ 4.69 (not 86.56 old exponential bug)', () => {
    const actual = halfLifeToStability(60);
    const expected = (19 / 243) * 60; // ≈ 4.6913
    const oldBugValue = 60 / Math.LN2; // ≈ 86.5617

    expect(actual).toBeCloseTo(expected, 2);
    // Must NOT match the old buggy formula
    expect(Math.abs(actual - oldBugValue)).toBeGreaterThan(1.0);
  });

  it('T003: Retrievability at t=0 equals 1.0', () => {
    const stability = halfLifeToStability(60);
    const r = calculateRetrievability(stability, 0);
    expect(r).toBeCloseTo(1.0, 3);
  });

  it('T004: Retrievability at t=halfLife ≈ 0.5', () => {
    const halfLife = 60;
    const stability = halfLifeToStability(halfLife);
    const r = calculateRetrievability(stability, halfLife);

    expect(r).toBeLessThan(1.0);
    expect(r).toBeGreaterThan(0);
    expect(r).toBeCloseTo(0.5, 2);
  });

  it('T005: Retrievability decreases monotonically with time', () => {
    const stability = halfLifeToStability(60);
    const timePoints = [0, 1, 7, 14, 30, 60, 90, 180, 365];
    const rValues = timePoints.map(t => calculateRetrievability(stability, t));

    for (let i = 0; i < rValues.length - 1; i++) {
      expect(rValues[i]).toBeGreaterThanOrEqual(rValues[i + 1]);
    }
    expect(rValues[0]).toBeGreaterThan(rValues[rValues.length - 1]);
  });

  it('T006: Very old memories (365+ days, low stability) have retrievability near 0', () => {
    const stability = halfLifeToStability(7); // short half-life
    const r365 = calculateRetrievability(stability, 365);
    const r730 = calculateRetrievability(stability, 730);

    expect(r365).toBeLessThan(0.1);
    expect(r730).toBeLessThan(r365);
    expect(r365).toBeGreaterThanOrEqual(0);
    expect(r730).toBeGreaterThanOrEqual(0);
  });

  it('T007: Stability=0 edge case handled (no division by zero)', () => {
    expect(halfLifeToStability(null)).toBe(999999);
    expect(halfLifeToStability(0)).toBe(999999);
    expect(halfLifeToStability(-1)).toBe(999999);

    const r = calculateRetrievability(0, 30);
    expect(r).not.toBeNaN();
    expect(typeof r).toBe('number');
    expect(Number.isFinite(r)).toBe(true);
  });
});
