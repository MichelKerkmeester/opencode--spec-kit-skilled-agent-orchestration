// TEST: FOLDER SCORING
import { describe, it, expect } from 'vitest';
import * as mod from '../lib/scoring/folder-scoring';

describe('Folder Scoring Tests (T506)', () => {
  type FolderMemory = Parameters<typeof mod.computeSingleFolderScore>[1][number];
  type FolderScore = ReturnType<typeof mod.computeFolderScores>[number];

  function createMemory(overrides: Partial<FolderMemory> = {}): FolderMemory {
    const now = new Date();
    return {
      id: 1,
      specFolder: 'test-spec',
      spec_folder: 'test-spec',
      title: 'Test Memory',
      importanceTier: 'normal',
      importance_tier: 'normal',
      updatedAt: now.toISOString(),
      updated_at: now.toISOString(),
      createdAt: now.toISOString(),
      created_at: now.toISOString(),
      ...overrides,
    };
  }

  function approxEqual(a: number, b: number, epsilon: number = 0.001): boolean {
    return Math.abs(a - b) < epsilon;
  }

  describe('Single Folder Ranking (T506-01)', () => {
    it('T506-01: Single folder ranking produces valid score', () => {
      const now = new Date();
      const memories = [
        createMemory({ updatedAt: now.toISOString(), importanceTier: 'important' }),
        createMemory({ updatedAt: now.toISOString(), importanceTier: 'normal' }),
      ];

      const score = mod.computeSingleFolderScore('test-spec', memories);
      expect(score).toBeDefined();
      expect(typeof score.score).toBe('number');
      expect(score.score).toBeGreaterThan(0);
      expect(score.score).toBeLessThanOrEqual(1);
    });

    it('T506-01b: All component scores are numbers', () => {
      const now = new Date();
      const memories = [
        createMemory({ updatedAt: now.toISOString(), importanceTier: 'important' }),
        createMemory({ updatedAt: now.toISOString(), importanceTier: 'normal' }),
      ];

      const score = mod.computeSingleFolderScore('test-spec', memories);
      const components: Array<'recencyScore' | 'importanceScore' | 'activityScore' | 'validationScore'> = ['recencyScore', 'importanceScore', 'activityScore', 'validationScore'];

      for (const c of components) {
        expect(typeof score[c]).toBe('number');
        expect(isNaN(score[c])).toBe(false);
      }
    });
  });

  describe('Multi-folder Comparison (T506-02)', () => {
    it('T506-02: Active project ranks higher than old project', () => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const memories = [
        createMemory({ specFolder: 'active-project', spec_folder: 'active-project', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'critical', importance_tier: 'critical' }),
        createMemory({ specFolder: 'active-project', spec_folder: 'active-project', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'important', importance_tier: 'important' }),
        createMemory({ specFolder: 'active-project', spec_folder: 'active-project', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'normal', importance_tier: 'normal' }),
        createMemory({ specFolder: 'old-project', spec_folder: 'old-project', updatedAt: weekAgo.toISOString(), updated_at: weekAgo.toISOString(), importanceTier: 'normal', importance_tier: 'normal' }),
      ];

      const scored = mod.computeFolderScores(memories);
      expect(Array.isArray(scored)).toBe(true);
      expect(scored.length).toBe(2);
      expect(scored[0].folder).toBe('active-project');
    });

    it('T506-02b: Folders sorted by score descending', () => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const memories = [
        createMemory({ specFolder: 'active-project', spec_folder: 'active-project', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'critical', importance_tier: 'critical' }),
        createMemory({ specFolder: 'old-project', spec_folder: 'old-project', updatedAt: weekAgo.toISOString(), updated_at: weekAgo.toISOString(), importanceTier: 'normal', importance_tier: 'normal' }),
      ];

      const scored = mod.computeFolderScores(memories);
      expect(scored[0].score).toBeGreaterThanOrEqual(scored[1].score);
    });
  });

  describe('Empty Folder Returns Zero/Default (T506-03)', () => {
    it('T506-03a: Empty folder returns score 0', () => {
      const score = mod.computeSingleFolderScore('empty-folder', []);
      expect(score).toBeDefined();
      expect(score.score).toBe(0);
    });

    it('T506-03b: Empty memories array returns empty folder list', () => {
      const scored = mod.computeFolderScores([]);
      expect(Array.isArray(scored)).toBe(true);
      expect(scored.length).toBe(0);
    });

    it('T506-03c: Null input returns empty folder list', () => {
      // @ts-expect-error Testing invalid input shape
      const scored = mod.computeFolderScores(null);
      expect(Array.isArray(scored)).toBe(true);
      expect(scored.length).toBe(0);
    });
  });

  describe('Archive Detection (T506-04)', () => {
    it('T506-04a: Archive detection identifies correct paths', () => {
      const archiveTests = [
        { path: 'specs/z_archive/old-project', expected: true },
        { path: 'specs/project/scratch/temp', expected: true },
        { path: 'specs/project/research/iterations/iteration-001', expected: true },
        { path: 'specs/project/review/iterations/iteration-001', expected: true },
        { path: 'specs/test-setup', expected: true },
        { path: 'specs/active-project', expected: false },
        { path: 'specs/production', expected: false },
      ];

      for (const { path: p, expected } of archiveTests) {
        expect(mod.isArchived(p)).toBe(expected);
      }
    });

    it('T506-04b: Archive multiplier reduces score', () => {
      const archiveMultiplier = mod.getArchiveMultiplier('specs/z_archive/old');
      const normalMultiplier = mod.getArchiveMultiplier('specs/active');

      expect(archiveMultiplier).toBeLessThan(1.0);
      expect(normalMultiplier).toBe(1.0);
    });

    it('T506-04c: Archived folders excluded by default', () => {
      const memories = [
        createMemory({ specFolder: 'z_archive/old', spec_folder: 'z_archive/old' }),
        createMemory({ specFolder: 'active', spec_folder: 'active' }),
      ];
      const withoutArchived = mod.computeFolderScores(memories);
      const withArchived = mod.computeFolderScores(memories, { includeArchived: true });

      expect(withArchived.length).toBeGreaterThanOrEqual(withoutArchived.length);
    });
  });

  describe('Ranking Stability (T506-05)', () => {
    it('T506-05: Same input produces same output', () => {
      const now = new Date();
      const memories = [
        createMemory({ specFolder: 'folder-a', spec_folder: 'folder-a', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'important', importance_tier: 'important' }),
        createMemory({ specFolder: 'folder-b', spec_folder: 'folder-b', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'normal', importance_tier: 'normal' }),
        createMemory({ specFolder: 'folder-c', spec_folder: 'folder-c', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'critical', importance_tier: 'critical' }),
      ];

      const run1 = mod.computeFolderScores(memories);
      const run2 = mod.computeFolderScores(memories);
      const run3 = mod.computeFolderScores(memories);

      const order1 = run1.map((f: FolderScore) => f.folder).join(',');
      const order2 = run2.map((f: FolderScore) => f.folder).join(',');
      const order3 = run3.map((f: FolderScore) => f.folder).join(',');

      expect(order1).toBe(order2);
      expect(order2).toBe(order3);
    });

    it('T506-05b: Scores are deterministic', () => {
      const now = new Date();
      const memories = [
        createMemory({ specFolder: 'folder-a', spec_folder: 'folder-a', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'important', importance_tier: 'important' }),
        createMemory({ specFolder: 'folder-b', spec_folder: 'folder-b', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'normal', importance_tier: 'normal' }),
      ];

      const run1 = mod.computeFolderScores(memories);
      const run2 = mod.computeFolderScores(memories);

      const scores1 = run1.map((f: FolderScore) => f.score);
      const scores2 = run2.map((f: FolderScore) => f.score);

      scores1.forEach((s: number, i: number) => {
        expect(s).toBe(scores2[i]);
      });
    });
  });

  describe('Score Factors (T506-06)', () => {
    it('T506-06a: Score weights sum to 1.0', () => {
      const weights = mod.SCORE_WEIGHTS;
      const sum = Object.values(weights).reduce((a: number, b: number) => a + b, 0) as number;
      expect(approxEqual(sum, 1.0)).toBe(true);
    });

    it('T506-06b: Recency has highest weight', () => {
      const weights = mod.SCORE_WEIGHTS;
      const maxWeight = Math.max(...Object.values(weights) as number[]);
      expect(weights.recency).toBe(maxWeight);
    });

    it('T506-06c: Constitutional tier exempt from recency decay', () => {
      const oldTimestamp = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const constRecency = mod.computeRecencyScore(oldTimestamp, 'constitutional');
      const normalRecency = mod.computeRecencyScore(oldTimestamp, 'normal');

      expect(constRecency).toBe(1.0);
      expect(normalRecency).toBeLessThan(1.0);
    });

    it('T506-06d: Tier weights configured correctly', () => {
      const tw = mod.TIER_WEIGHTS;
      expect(tw.constitutional).toBe(1.0);
      expect(tw.normal).toBe(0.5);
      expect(tw.deprecated).toBe(0.1);
    });

    it('T506-06e: DECAY_RATE exported', () => {
      expect(typeof mod.DECAY_RATE).toBe('number');
    });
  });
});
