// ───────────────────────────────────────────────────────────────
// 1. GRAPH FLAGS VITEST
// ───────────────────────────────────────────────────────────────
// TEST: Graph Search Feature Flag (Unified)
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isGraphUnifiedEnabled } from '../lib/search/graph-flags';

describe('Graph Feature Flag', () => {
  let originalUnified: string | undefined;

  beforeEach(() => {
    originalUnified = process.env.SPECKIT_GRAPH_UNIFIED;
  });

  afterEach(() => {
    if (originalUnified === undefined) {
      delete process.env.SPECKIT_GRAPH_UNIFIED;
    } else {
      process.env.SPECKIT_GRAPH_UNIFIED = originalUnified;
    }
  });

  it('returns true when SPECKIT_GRAPH_UNIFIED is undefined', () => {
    delete process.env.SPECKIT_GRAPH_UNIFIED;
    expect(isGraphUnifiedEnabled()).toBe(true);
  });

  it('returns true when SPECKIT_GRAPH_UNIFIED is empty', () => {
    process.env.SPECKIT_GRAPH_UNIFIED = '';
    expect(isGraphUnifiedEnabled()).toBe(true);
  });

  it("returns true when SPECKIT_GRAPH_UNIFIED is 'true'", () => {
    process.env.SPECKIT_GRAPH_UNIFIED = 'true';
    expect(isGraphUnifiedEnabled()).toBe(true);
  });

  it("returns false when SPECKIT_GRAPH_UNIFIED is 'false'", () => {
    process.env.SPECKIT_GRAPH_UNIFIED = 'false';
    expect(isGraphUnifiedEnabled()).toBe(false);
  });

  it("returns true for non-boolean values like '1' (only 'false'/'0' disable)", () => {
    process.env.SPECKIT_GRAPH_UNIFIED = '1';
    expect(isGraphUnifiedEnabled()).toBe(true);
  });
});
