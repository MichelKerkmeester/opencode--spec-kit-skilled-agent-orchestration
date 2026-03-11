import { describe, expect, it } from 'vitest';
import {
  computeRecencyScore,
  computeSingleFolderScore,
  findLastActivity,
} from '@spec-kit/shared/scoring/folder-scoring';

type FolderMemory = Parameters<typeof computeSingleFolderScore>[1][number];

function createLargeMemories(size: number = 150_001): FolderMemory[] {
  const base = Date.now() - 10_000;
  const memories = Array.from({ length: size }, (_, i) => ({
    updatedAt: new Date(base - (i + 1) * 1000).toISOString(),
    importanceTier: 'normal',
  }));

  // Put the true maximum timestamp at the tail to ensure full-array scanning.
  memories[size - 1] = {
    ...memories[size - 1],
    updatedAt: new Date(base + 60_000).toISOString(),
    importanceTier: 'critical',
  };

  return memories;
}

describe('folder-scoring large-array safety (T011)', () => {
  it('computeSingleFolderScore handles >100K memories without RangeError', () => {
    const memories = createLargeMemories();

    expect(() => computeSingleFolderScore('test/folder', memories)).not.toThrow();

    const result = computeSingleFolderScore('test/folder', memories);
    const expectedMaxRecency = memories.reduce((max, memory) => {
      const score = computeRecencyScore(memory.updatedAt as string, memory.importanceTier as string);
      return score > max ? score : max;
    }, -Infinity);

    expect(result.recencyScore).toBeGreaterThan(0);
    expect(result.recencyScore).toBe(Math.round(expectedMaxRecency * 1000) / 1000);
  });

  it('findLastActivity handles >100K memories without RangeError', () => {
    const memories = createLargeMemories().map((memory) => ({ updatedAt: memory.updatedAt }));

    expect(() => findLastActivity(memories)).not.toThrow();

    const expectedLatestTimestamp = memories.reduce((max, memory) => {
      const timestamp = new Date(memory.updatedAt as string).getTime();
      return timestamp > max ? timestamp : max;
    }, -Infinity);

    expect(findLastActivity(memories)).toBe(new Date(expectedLatestTimestamp).toISOString());
  });
});
