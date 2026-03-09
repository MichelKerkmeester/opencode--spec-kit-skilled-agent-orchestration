import { describe, expect, it } from 'vitest';

describe('memorySequence Number(x) || 0 coercion boundaries', () => {
  it('Number(undefined) || 0 -> 0', () => {
    expect(Number(undefined) || 0).toBe(0);
  });

  it('Number(NaN) || 0 -> 0', () => {
    expect(Number(Number.NaN) || 0).toBe(0);
  });

  it('Number(Infinity) || 0 -> Infinity', () => {
    expect(Number(Infinity) || 0).toBe(Infinity);
  });

  it("Number('5') || 0 -> 5", () => {
    expect(Number('5') || 0).toBe(5);
  });

  it('Number(MAX_SAFE_INTEGER) + 1 demonstrates precision loss', () => {
    const unsafe = Number(Number.MAX_SAFE_INTEGER) + 1;
    expect(Number.isSafeInteger(unsafe)).toBe(false);
    expect(unsafe + 1).toBe(unsafe);
  });

  it('Number(null) || 0 -> 0', () => {
    expect(Number(null) || 0).toBe(0);
  });
});
