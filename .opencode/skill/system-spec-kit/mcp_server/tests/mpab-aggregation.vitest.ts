// TEST: MPAB AGGREGATION
// Multi-Parent Aggregated Bonus chunk-to-memory score aggregation
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  computeMPAB,
  isMpabEnabled,
  collapseAndReassembleChunkResults,
  MPAB_BONUS_COEFFICIENT,
} from '../lib/scoring/mpab-aggregation';
import type {
  ChunkResult,
} from '../lib/scoring/mpab-aggregation';

// Helpers
/** Create a minimal chunk result for testing. */
function makeChunk(
  parentMemoryId: number | string,
  chunkIndex: number,
  score: number,
  id?: number | string,
): ChunkResult {
  return {
    id: id ?? `chunk-${parentMemoryId}-${chunkIndex}`,
    parentMemoryId,
    chunkIndex,
    score,
  };
}

// ComputeMPAB — Core Algorithm
describe('computeMPAB', () => {
  it('N=0: returns 0 (no chunks = no signal)', () => {
    expect(computeMPAB([])).toBe(0);
  });

  it('N=1: returns raw score (no bonus)', () => {
    expect(computeMPAB([0.75])).toBe(0.75);
  });

  it('N=1: returns exact score value without modification', () => {
    expect(computeMPAB([0.0])).toBe(0.0);
    expect(computeMPAB([1.0])).toBe(1.0);
    expect(computeMPAB([0.123456])).toBe(0.123456);
  });

  it('N=2: correct MPAB calculation', () => {
    const scores = [0.8, 0.4];
    // Sorted desc: [0.8, 0.4]
    // SMax = 0.8, remaining = [0.4]
    // N = 2, bonus = 0.3 * 0.4 / sqrt(2) = 0.12 / 1.41421356... = 0.08485281...
    // Result = 0.8 + 0.08485281... = 0.88485281...
    const expected = 0.8 + (0.3 * 0.4) / Math.sqrt(2);
    expect(computeMPAB(scores)).toBeCloseTo(expected, 10);
  });

  it('N=2: order of input does not matter', () => {
    const a = computeMPAB([0.4, 0.8]);
    const b = computeMPAB([0.8, 0.4]);
    expect(a).toBeCloseTo(b, 10);
  });

  it('N=10: correct MPAB calculation with known values', () => {
    const scores = [0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
    // Sorted desc: [0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]
    // SMax = 0.9
    // Remaining = [0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]
    // Sum(remaining) = 4.45
    // N = 10, bonus = 0.3 * 4.45 / sqrt(10) = 1.335 / 3.16227766... = 0.42213203...
    // Result = 0.9 + 0.42213203... = 1.32213203...
    const sumRemaining = 0.85 + 0.8 + 0.7 + 0.6 + 0.5 + 0.4 + 0.3 + 0.2 + 0.1;
    const expected = 0.9 + (0.3 * sumRemaining) / Math.sqrt(10);
    expect(computeMPAB(scores)).toBeCloseTo(expected, 10);
  });

  it('N=10: result can exceed 1.0 for multi-chunk documents', () => {
    const scores = [0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
    const result = computeMPAB(scores);
    expect(result).toBeGreaterThan(1.0);
  });

  it('index-based max removal: tied scores handled correctly', () => {
    // All three scores are 0.5 — value-based removal would remove ALL of them
    // Index-based removal should remove only sorted[0] and keep sorted[1..N-1]
    const scores = [0.5, 0.5, 0.5];
    // Sorted desc: [0.5, 0.5, 0.5]
    // SMax = 0.5 (index 0)
    // Remaining = [0.5, 0.5] (indices 1, 2)
    // N = 3, bonus = 0.3 * 1.0 / sqrt(3) = 0.3 / 1.73205... = 0.17320508...
    // Result = 0.5 + 0.17320508... = 0.67320508...
    const expected = 0.5 + (0.3 * 1.0) / Math.sqrt(3);
    expect(computeMPAB(scores)).toBeCloseTo(expected, 10);
    // Crucially, result must be > 0.5 (proves remaining chunks contributed)
    expect(computeMPAB(scores)).toBeGreaterThan(0.5);
  });

  it('index-based max removal: two tied max values, only one removed', () => {
    const scores = [0.9, 0.9, 0.3];
    // Sorted desc: [0.9, 0.9, 0.3]
    // SMax = 0.9 (index 0)
    // Remaining = [0.9, 0.3] (the second 0.9 stays)
    // N = 3, bonus = 0.3 * 1.2 / sqrt(3) = 0.36 / 1.73205... = 0.20784609...
    // Result = 0.9 + 0.20784609... = 1.10784609...
    const expected = 0.9 + (0.3 * (0.9 + 0.3)) / Math.sqrt(3);
    expect(computeMPAB(scores)).toBeCloseTo(expected, 10);
  });

  it('does not mutate the input array', () => {
    const scores = [0.3, 0.9, 0.5];
    const copy = [...scores];
    computeMPAB(scores);
    expect(scores).toEqual(copy);
  });

  it('bonus coefficient matches exported constant', () => {
    expect(MPAB_BONUS_COEFFICIENT).toBe(0.3);
  });

  it('all-zero scores returns 0', () => {
    expect(computeMPAB([0, 0, 0])).toBe(0);
  });

  it('non-finite chunk scores are sanitized to zero before aggregation', () => {
    const result = computeMPAB([0.8, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]);
    expect(result).toBeCloseTo(0.8, 10);
  });
});

// IsMpabEnabled — Feature Flag
describe('isMpabEnabled', () => {
  const ENV_KEY = 'SPECKIT_DOCSCORE_AGGREGATION';
  let originalValue: string | undefined;

  beforeEach(() => {
    originalValue = process.env[ENV_KEY];
  });

  afterEach(() => {
    if (originalValue === undefined) {
      delete process.env[ENV_KEY];
    } else {
      process.env[ENV_KEY] = originalValue;
    }
  });

  it('returns true when env var is not set (graduated — default ON)', () => {
    delete process.env[ENV_KEY];
    expect(isMpabEnabled()).toBe(true);
  });

  it('returns true when env var is "true"', () => {
    process.env[ENV_KEY] = 'true';
    expect(isMpabEnabled()).toBe(true);
  });

  it('returns true when env var is "TRUE" (case-insensitive)', () => {
    process.env[ENV_KEY] = 'TRUE';
    expect(isMpabEnabled()).toBe(true);
  });

  it('returns true when env var is "True"', () => {
    process.env[ENV_KEY] = 'True';
    expect(isMpabEnabled()).toBe(true);
  });

  it('returns false when env var is "false"', () => {
    process.env[ENV_KEY] = 'false';
    expect(isMpabEnabled()).toBe(false);
  });

  it('returns true when env var is empty string (graduated — treated as enabled)', () => {
    process.env[ENV_KEY] = '';
    expect(isMpabEnabled()).toBe(true);
  });

  it('returns true when env var is arbitrary string (graduated — only "false" disables)', () => {
    process.env[ENV_KEY] = 'yes';
    expect(isMpabEnabled()).toBe(true);
  });
});

// CollapseAndReassembleChunkResults — T001a
describe('collapseAndReassembleChunkResults', () => {
  it('empty input returns empty array', () => {
    expect(collapseAndReassembleChunkResults([])).toEqual([]);
  });

  it('single chunk returns single collapsed result with raw score', () => {
    const chunks: ChunkResult[] = [makeChunk('mem-1', 0, 0.8)];
    const result = collapseAndReassembleChunkResults(chunks);

    expect(result).toHaveLength(1);
    expect(result[0].parentMemoryId).toBe('mem-1');
    expect(result[0].mpabScore).toBe(0.8);
    expect(result[0]._chunkHits).toBe(1);
    expect(result[0].chunks).toHaveLength(1);
  });

  it('_chunkHits metadata is preserved correctly', () => {
    const chunks: ChunkResult[] = [
      makeChunk('mem-1', 0, 0.9),
      makeChunk('mem-1', 1, 0.7),
      makeChunk('mem-1', 2, 0.5),
    ];
    const result = collapseAndReassembleChunkResults(chunks);

    expect(result).toHaveLength(1);
    expect(result[0]._chunkHits).toBe(3);
  });

  it('multiple chunks from same parent are collapsed with MPAB', () => {
    const chunks: ChunkResult[] = [
      makeChunk('mem-1', 0, 0.8),
      makeChunk('mem-1', 1, 0.4),
    ];
    const result = collapseAndReassembleChunkResults(chunks);

    expect(result).toHaveLength(1);
    const expected = 0.8 + (0.3 * 0.4) / Math.sqrt(2);
    expect(result[0].mpabScore).toBeCloseTo(expected, 10);
  });

  it('chunks from different parents produce separate collapsed results', () => {
    const chunks: ChunkResult[] = [
      makeChunk('mem-1', 0, 0.9),
      makeChunk('mem-2', 0, 0.7),
      makeChunk('mem-3', 0, 0.5),
    ];
    const result = collapseAndReassembleChunkResults(chunks);

    expect(result).toHaveLength(3);
    // Sorted by MPAB score descending
    expect(result[0].parentMemoryId).toBe('mem-1');
    expect(result[1].parentMemoryId).toBe('mem-2');
    expect(result[2].parentMemoryId).toBe('mem-3');
  });

  it('collapsed results sorted by MPAB score descending', () => {
    const chunks: ChunkResult[] = [
      // Mem-2 has lower individual scores but more chunks
      makeChunk('mem-2', 0, 0.5),
      makeChunk('mem-2', 1, 0.5),
      makeChunk('mem-2', 2, 0.5),
      makeChunk('mem-2', 3, 0.5),
      // Mem-1 has single high score
      makeChunk('mem-1', 0, 0.6),
    ];
    const result = collapseAndReassembleChunkResults(chunks);

    expect(result).toHaveLength(2);
    // Mem-2 MPAB: 0.5 + 0.3 * 1.5 / sqrt(4) = 0.5 + 0.45/2 = 0.725
    // Mem-1 MPAB: 0.6 (single chunk)
    expect(result[0].parentMemoryId).toBe('mem-2');
    expect(result[1].parentMemoryId).toBe('mem-1');
  });

  it('T001a: chunks maintain document position order (by chunkIndex), NOT score order', () => {
    // Chunks arrive in arbitrary order from retrieval pipeline
    const chunks: ChunkResult[] = [
      makeChunk('mem-1', 3, 0.9),   // chunk 3 had highest score
      makeChunk('mem-1', 0, 0.3),   // chunk 0 had lowest score
      makeChunk('mem-1', 2, 0.7),   // chunk 2
      makeChunk('mem-1', 1, 0.5),   // chunk 1
    ];
    const result = collapseAndReassembleChunkResults(chunks);

    expect(result).toHaveLength(1);
    const reassembled = result[0].chunks;

    // Chunks MUST be in document position order (ascending chunkIndex)
    expect(reassembled[0].chunkIndex).toBe(0);
    expect(reassembled[1].chunkIndex).toBe(1);
    expect(reassembled[2].chunkIndex).toBe(2);
    expect(reassembled[3].chunkIndex).toBe(3);

    // Verify they are NOT in score order (descending would be 3,2,1,0)
    expect(reassembled[0].score).toBe(0.3);  // lowest score first (position 0)
    expect(reassembled[3].score).toBe(0.9);  // highest score last (position 3)
  });

  it('T001a: multi-parent collapse preserves document order per parent', () => {
    const chunks: ChunkResult[] = [
      // Mem-1 chunks arrive out of order
      makeChunk('mem-1', 2, 0.8),
      makeChunk('mem-1', 0, 0.6),
      makeChunk('mem-1', 1, 0.7),
      // Mem-2 chunks arrive out of order
      makeChunk('mem-2', 1, 0.9),
      makeChunk('mem-2', 0, 0.4),
    ];
    const result = collapseAndReassembleChunkResults(chunks);

    expect(result).toHaveLength(2);

    // Each parent's chunks should be in chunkIndex order
    for (const collapsed of result) {
      for (let i = 1; i < collapsed.chunks.length; i++) {
        expect(collapsed.chunks[i].chunkIndex).toBeGreaterThan(
          collapsed.chunks[i - 1].chunkIndex,
        );
      }
    }
  });

  it('numeric parentMemoryId grouping works correctly', () => {
    const chunks: ChunkResult[] = [
      makeChunk(42, 0, 0.8),
      makeChunk(42, 1, 0.6),
      makeChunk(99, 0, 0.5),
    ];
    const result = collapseAndReassembleChunkResults(chunks);

    expect(result).toHaveLength(2);
    // Mem 42 has higher MPAB than mem 99
    expect(result[0].parentMemoryId).toBe(42);
    expect(result[0]._chunkHits).toBe(2);
    expect(result[1].parentMemoryId).toBe(99);
    expect(result[1]._chunkHits).toBe(1);
  });

  it('does not mutate input chunk array', () => {
    const chunks: ChunkResult[] = [
      makeChunk('mem-1', 2, 0.5),
      makeChunk('mem-1', 0, 0.8),
      makeChunk('mem-1', 1, 0.3),
    ];
    const copy = chunks.map(c => ({ ...c }));
    collapseAndReassembleChunkResults(chunks);
    expect(chunks).toEqual(copy);
  });
});

// Type Exports Verification
describe('Module Exports', () => {
  it('exports computeMPAB function', () => {
    expect(typeof computeMPAB).toBe('function');
  });

  it('exports isMpabEnabled function', () => {
    expect(typeof isMpabEnabled).toBe('function');
  });

  it('exports collapseAndReassembleChunkResults function', () => {
    expect(typeof collapseAndReassembleChunkResults).toBe('function');
  });

  it('exports MPAB_BONUS_COEFFICIENT constant', () => {
    expect(typeof MPAB_BONUS_COEFFICIENT).toBe('number');
    expect(MPAB_BONUS_COEFFICIENT).toBe(0.3);
  });
});
