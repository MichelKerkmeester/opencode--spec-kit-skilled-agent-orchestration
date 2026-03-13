// Converted from: unit-folder-scoring-types.test.ts (custom runner)
// TEST: FOLDER SCORING — TYPE UNIFICATION (FolderMemoryInput)
// Validates cast-removal: deprecated MemoryRecord → FolderMemoryInput
// Accepts partial objects, mixed casing, and extra arbitrary fields.
import { describe, it, expect } from 'vitest';
import {
  computeSingleFolderScore,
  computeFolderScores,
  ARCHIVE_PATTERNS,
  computeRecencyScore,
  DECAY_RATE,
} from '@spec-kit/shared/scoring/folder-scoring';

/* --- Helpers --- */

const now = Date.now();

function makeCamelCaseMemory(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    specFolder: 'specs/007-auth',
    importanceTier: 'important',
    importanceWeight: 0.7,
    createdAt: new Date(now - 7 * 86400000).toISOString(),
    updatedAt: new Date(now - 2 * 86400000).toISOString(),
    accessCount: 5,
    stability: 3.0,
    ...overrides,
  };
}

function makeSnakeCaseMemory(overrides: Record<string, unknown> = {}) {
  return {
    id: 2,
    spec_folder: 'specs/007-auth',
    importance_tier: 'important',
    importance_weight: 0.7,
    created_at: new Date(now - 7 * 86400000).toISOString(),
    updated_at: new Date(now - 2 * 86400000).toISOString(),
    access_count: 5,
    stability: 3.0,
    ...overrides,
  };
}

/* --- Tests --- */

describe('Folder Scoring — Type Unification (FolderMemoryInput)', () => {

  // 5.1 computeSingleFolderScore with FolderMemoryInput
  describe('computeSingleFolderScore with FolderMemoryInput', () => {
    it('T-FS-01: camelCase FolderMemoryInput', () => {
      const memories = [
        makeCamelCaseMemory({ id: 1 }),
        makeCamelCaseMemory({ id: 2, importanceTier: 'critical' }),
      ];
      const score = computeSingleFolderScore('specs/007-auth', memories);
      expect(typeof score).toBe('object');
      expect(typeof score.score).toBe('number');
    });

    it('T-FS-02: snake_case FolderMemoryInput', () => {
      const memories = [
        makeSnakeCaseMemory({ id: 1 }),
        makeSnakeCaseMemory({ id: 2, importance_tier: 'critical' }),
      ];
      const score = computeSingleFolderScore('specs/007-auth', memories);
      expect(typeof score).toBe('object');
      expect(typeof score.score).toBe('number');
    });

    it('T-FS-03: minimal {id} object', () => {
      const memories = [{ id: 1 }];
      const score = computeSingleFolderScore('specs/001', memories);
      expect(typeof score).toBe('object');
      expect(typeof score.score).toBe('number');
    });

    it('T-FS-04: extra arbitrary fields', () => {
      const memories = [{
        id: 1,
        specFolder: 'specs/001',
        importanceTier: 'normal',
        customField: 'hello',
        _searchScore: 0.95,
        similarity: 80,
      }];
      const score = computeSingleFolderScore('specs/001', memories);
      expect(typeof score).toBe('object');
      expect(typeof score.score).toBe('number');
    });
  });

  // 5.2 computeFolderScores with mixed camelCase/snake_case
  describe('computeFolderScores with mixed input shapes', () => {
    it('T-FS-05: mix of camelCase and snake_case memories', () => {
      const memories = [
        makeCamelCaseMemory({ id: 1, specFolder: 'specs/001' }),
        makeSnakeCaseMemory({ id: 2, spec_folder: 'specs/001' }),
        makeCamelCaseMemory({ id: 3, specFolder: 'specs/002', importanceTier: 'critical' }),
      ];

      const scores = computeFolderScores(memories);
      expect(typeof scores === 'object' || Array.isArray(scores)).toBe(true);
    });

    it('T-FS-06: empty array returns empty result', () => {
      const scores = computeFolderScores([]);
      if (Array.isArray(scores)) {
        expect(scores.length).toBe(0);
      } else {
        expect(Object.keys(scores).length).toBe(0);
      }
    });

    it('T-FS-07: only snake_case fields accepted', () => {
      const memories = [
        { id: 1, spec_folder: 'specs/010', importance_tier: 'normal', updated_at: new Date().toISOString() },
        { id: 2, spec_folder: 'specs/010', importance_tier: 'critical', updated_at: new Date().toISOString() },
      ];

      // Should not throw
      const scores = computeFolderScores(memories);
      expect(scores).toBeTruthy();
    });

    it('T-FS-08: only camelCase fields accepted', () => {
      const memories = [
        { id: 1, specFolder: 'specs/010', importanceTier: 'normal', updatedAt: new Date().toISOString() },
        { id: 2, specFolder: 'specs/010', importanceTier: 'critical', updatedAt: new Date().toISOString() },
      ];

      // Should not throw
      const scores = computeFolderScores(memories);
      expect(scores).toBeTruthy();
    });
  });

  // 5.3 Archive pattern detection with FolderMemoryInput
  describe('Archive detection with FolderMemoryInput', () => {
    it('T-FS-10: ARCHIVE_PATTERNS exported', () => {
      expect(Array.isArray(ARCHIVE_PATTERNS)).toBe(true);
      expect(ARCHIVE_PATTERNS.length).toBeGreaterThan(0);
    });

    it('T-FS-11: archive folder scoring works', () => {
      const memories = [makeCamelCaseMemory({ id: 1 })];
      const score = computeSingleFolderScore('z_archive/old-stuff', memories);
      expect(typeof score).toBe('object');
      expect(typeof score.score).toBe('number');
    });
  });

  // 5.5 computeRecencyScore and DECAY_RATE exports
  describe('Recency scoring exports', () => {
    it('T-FS-12: computeRecencyScore exported', () => {
      expect(typeof computeRecencyScore).toBe('function');
      const score = computeRecencyScore(new Date().toISOString());
      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('T-FS-13: DECAY_RATE exported', () => {
      expect(typeof DECAY_RATE).toBe('number');
    });
  });
});
