// ───────────────────────────────────────────────────────────────
// 1. TEST — FOLDER RELEVANCE
// ───────────────────────────────────────────────────────────────
// Validates FolderScore formula, damping, enrichment, two-phase
// Retrieval, and feature flag gating.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type Database from 'better-sqlite3';

import {
  isFolderScoringEnabled,
  computeFolderRelevanceScores,
  lookupFolders,
  enrichResultsWithFolderScores,
  twoPhaseRetrieval,
} from '../lib/search/folder-relevance';

/* ───────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────── */

/** Build a minimal scored result */
function makeResult(id: number, score: number, extra: Record<string, unknown> = {}) {
  return { id, score, ...extra };
}

/** Build a folderMap from array of [id, folder] pairs */
function buildFolderMap(pairs: Array<[number, string]>): Map<number, string> {
  return new Map(pairs);
}

/** Approximate equality for floating-point comparisons */
function approxEqual(a: number, b: number, epsilon = 1e-9): boolean {
  return Math.abs(a - b) < epsilon;
}

/* ───────────────────────────────────────────────────────────────
   Tests
   ──────────────────────────────────────────────────────────────── */

describe('Folder Relevance Scoring (t020)', () => {
  /* ───────────────────────────────────────────────────────────────
     T020-01: FolderScore formula verification
     ──────────────────────────────────────────────────────────────── */
  describe('FolderScore formula', () => {
    it('T020-01: computes (1/sqrt(M+1)) * SUM(scores) for known inputs', () => {
      // Folder "alpha" has 2 results with scores 0.8 and 0.6
      // M = 2, damping = 1/sqrt(3), sum = 1.4
      // Expected: 1.4 / sqrt(3) = 0.80829...
      const results = [
        makeResult(1, 0.8),
        makeResult(2, 0.6),
      ];
      const folderMap = buildFolderMap([
        [1, 'alpha'],
        [2, 'alpha'],
      ]);

      const scores = computeFolderRelevanceScores(results, folderMap);

      const expected = (1 / Math.sqrt(3)) * 1.4;
      expect(scores.get('alpha')).toBeDefined();
      expect(approxEqual(scores.get('alpha')!, expected)).toBe(true);
    });

    it('T020-01b: single result folder computes correctly', () => {
      // Folder "solo" has 1 result with score 0.9
      // M = 1, damping = 1/sqrt(2), sum = 0.9
      // Expected: 0.9 / sqrt(2) = 0.63639...
      const results = [makeResult(10, 0.9)];
      const folderMap = buildFolderMap([[10, 'solo']]);

      const scores = computeFolderRelevanceScores(results, folderMap);

      const expected = (1 / Math.sqrt(2)) * 0.9;
      expect(approxEqual(scores.get('solo')!, expected)).toBe(true);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T020-02: Damping factor verification
     ──────────────────────────────────────────────────────────────── */
  describe('Damping factor', () => {
    it('T020-02: folder with 9 results (damping=1/sqrt(10)) vs 1 result (damping=1/sqrt(2))', () => {
      // Folder "large" has 9 results, each score 0.5 → sum = 4.5
      // FolderScore = (1/sqrt(10)) * 4.5 = 1.4230...
      // Folder "small" has 1 result, score 0.9 → sum = 0.9
      // FolderScore = (1/sqrt(2)) * 0.9 = 0.6363...

      const results = [
        ...Array.from({ length: 9 }, (_, i) => makeResult(i + 1, 0.5)),
        makeResult(100, 0.9),
      ];
      const folderMap = buildFolderMap([
        ...Array.from({ length: 9 }, (_, i): [number, string] => [i + 1, 'large']),
        [100, 'small'],
      ]);

      const scores = computeFolderRelevanceScores(results, folderMap);

      const largeDamping = 1 / Math.sqrt(10);
      const smallDamping = 1 / Math.sqrt(2);
      const expectedLarge = largeDamping * 4.5;
      const expectedSmall = smallDamping * 0.9;

      expect(approxEqual(scores.get('large')!, expectedLarge)).toBe(true);
      expect(approxEqual(scores.get('small')!, expectedSmall)).toBe(true);

      // Large folder still wins here due to volume, but damping reduces its advantage
      expect(scores.get('large')!).toBeGreaterThan(scores.get('small')!);
      // Verify damping is applied (raw sum 4.5 >> 0.9 but damped score ratio is much closer)
      const rawRatio = 4.5 / 0.9; // 5.0
      const dampedRatio = scores.get('large')! / scores.get('small')!;
      expect(dampedRatio).toBeLessThan(rawRatio);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T020-03: Large folder damping — quality over quantity
     ──────────────────────────────────────────────────────────────── */
  describe('Large folder damping', () => {
    it('T020-03: folder with 100 low-score results does NOT dominate small high-quality folder', () => {
      // Folder "massive" has 100 results each with score 0.1 → sum = 10.0
      // FolderScore = (1/sqrt(101)) * 10.0 = 0.9950...
      // Folder "quality" has 3 results each with score 0.95 → sum = 2.85
      // FolderScore = (1/sqrt(4)) * 2.85 = 1.425

      const results = [
        ...Array.from({ length: 100 }, (_, i) => makeResult(i + 1, 0.1)),
        makeResult(201, 0.95),
        makeResult(202, 0.95),
        makeResult(203, 0.95),
      ];
      const folderMap = buildFolderMap([
        ...Array.from({ length: 100 }, (_, i): [number, string] => [i + 1, 'massive']),
        [201, 'quality'],
        [202, 'quality'],
        [203, 'quality'],
      ]);

      const scores = computeFolderRelevanceScores(results, folderMap);

      // Small high-quality folder should beat large low-quality folder
      expect(scores.get('quality')!).toBeGreaterThan(scores.get('massive')!);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T020-04: Single folder — all results in one folder
     ──────────────────────────────────────────────────────────────── */
  describe('Single folder', () => {
    it('T020-04: all results in one folder returns single entry', () => {
      const results = [
        makeResult(1, 0.7),
        makeResult(2, 0.5),
        makeResult(3, 0.3),
      ];
      const folderMap = buildFolderMap([
        [1, 'only-folder'],
        [2, 'only-folder'],
        [3, 'only-folder'],
      ]);

      const scores = computeFolderRelevanceScores(results, folderMap);

      expect(scores.size).toBe(1);
      expect(scores.has('only-folder')).toBe(true);

      const expected = (1 / Math.sqrt(4)) * 1.5;
      expect(approxEqual(scores.get('only-folder')!, expected)).toBe(true);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T020-05: Empty results
     ──────────────────────────────────────────────────────────────── */
  describe('Empty results', () => {
    it('T020-05a: empty results array returns empty map', () => {
      const scores = computeFolderRelevanceScores([], new Map());
      expect(scores.size).toBe(0);
    });

    it('T020-05b: results with no matching folderMap entries returns empty map', () => {
      const results = [makeResult(1, 0.5), makeResult(2, 0.8)];
      const folderMap = buildFolderMap([]); // No mappings

      const scores = computeFolderRelevanceScores(results, folderMap);
      expect(scores.size).toBe(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T020-06: Mixed folders — 3+ folders with different sizes and scores
     ──────────────────────────────────────────────────────────────── */
  describe('Mixed folders', () => {
    it('T020-06: three folders with different sizes and scores computed correctly', () => {
      const results = [
        // Folder-a: 1 result, score 0.9
        makeResult(1, 0.9),
        // Folder-b: 3 results, scores 0.6, 0.5, 0.4
        makeResult(2, 0.6),
        makeResult(3, 0.5),
        makeResult(4, 0.4),
        // Folder-c: 2 results, scores 0.8, 0.7
        makeResult(5, 0.8),
        makeResult(6, 0.7),
      ];
      const folderMap = buildFolderMap([
        [1, 'folder-a'],
        [2, 'folder-b'],
        [3, 'folder-b'],
        [4, 'folder-b'],
        [5, 'folder-c'],
        [6, 'folder-c'],
      ]);

      const scores = computeFolderRelevanceScores(results, folderMap);

      expect(scores.size).toBe(3);

      // Folder-a: (1/sqrt(2)) * 0.9
      const expectedA = (1 / Math.sqrt(2)) * 0.9;
      expect(approxEqual(scores.get('folder-a')!, expectedA)).toBe(true);

      // Folder-b: (1/sqrt(4)) * 1.5
      const expectedB = (1 / Math.sqrt(4)) * 1.5;
      expect(approxEqual(scores.get('folder-b')!, expectedB)).toBe(true);

      // Folder-c: (1/sqrt(3)) * 1.5
      const expectedC = (1 / Math.sqrt(3)) * 1.5;
      expect(approxEqual(scores.get('folder-c')!, expectedC)).toBe(true);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T020-07: folderRank ordering — rank 1 = highest FolderScore
     ──────────────────────────────────────────────────────────────── */
  describe('folderRank ordering', () => {
    it('T020-07: rank 1 assigned to highest FolderScore', () => {
      const results = [
        makeResult(1, 0.9),   // folder-x
        makeResult(2, 0.1),   // folder-y
        makeResult(3, 0.5),   // folder-z
      ];
      const folderMap = buildFolderMap([
        [1, 'folder-x'],
        [2, 'folder-y'],
        [3, 'folder-z'],
      ]);

      const folderScores = computeFolderRelevanceScores(results, folderMap);
      const enriched = enrichResultsWithFolderScores(results, folderScores, folderMap);

      // All single-result folders have same damping (1/sqrt(2))
      // So ranking follows raw score: folder-x > folder-z > folder-y

      const xResult = enriched.find(r => r.id === 1)!;
      const yResult = enriched.find(r => r.id === 2)!;
      const zResult = enriched.find(r => r.id === 3)!;

      expect(xResult.folderRank).toBe(1);
      expect(zResult.folderRank).toBe(2);
      expect(yResult.folderRank).toBe(3);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T020-08: Feature flag — disabled returns original results
     ──────────────────────────────────────────────────────────────── */
  describe('Feature flag', () => {
    const originalEnv = process.env.SPECKIT_FOLDER_SCORING;

    afterEach(() => {
      if (originalEnv === undefined) {
        delete process.env.SPECKIT_FOLDER_SCORING;
      } else {
        process.env.SPECKIT_FOLDER_SCORING = originalEnv;
      }
    });

    it('T020-08a: isFolderScoringEnabled returns true by default (graduated flag)', () => {
      delete process.env.SPECKIT_FOLDER_SCORING;
      expect(isFolderScoringEnabled()).toBe(true);
    });

    it('T020-08b: isFolderScoringEnabled returns true when set to "true"', () => {
      process.env.SPECKIT_FOLDER_SCORING = 'true';
      expect(isFolderScoringEnabled()).toBe(true);
    });

    it('T020-08c: isFolderScoringEnabled returns false for "false"', () => {
      process.env.SPECKIT_FOLDER_SCORING = 'false';
      expect(isFolderScoringEnabled()).toBe(false);
    });

    it('T020-08d: isFolderScoringEnabled returns true for arbitrary string (graduated flag)', () => {
      process.env.SPECKIT_FOLDER_SCORING = 'yes';
      expect(isFolderScoringEnabled()).toBe(true);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T020-09: Two-phase retrieval — only results from top-K folders
     ──────────────────────────────────────────────────────────────── */
  describe('Two-phase retrieval', () => {
    it('T020-09: filters to results from top-K folders only', () => {
      const results = [
        makeResult(1, 0.9),   // folder-a
        makeResult(2, 0.8),   // folder-a
        makeResult(3, 0.7),   // folder-b
        makeResult(4, 0.3),   // folder-c
        makeResult(5, 0.2),   // folder-d
      ];
      const folderMap = buildFolderMap([
        [1, 'folder-a'],
        [2, 'folder-a'],
        [3, 'folder-b'],
        [4, 'folder-c'],
        [5, 'folder-d'],
      ]);

      const folderScores = computeFolderRelevanceScores(results, folderMap);

      // Top 2 folders
      const filtered = twoPhaseRetrieval(results, folderScores, folderMap, 2);

      // Should only include results from the top-2 scored folders
      const includedFolders = new Set(
        filtered.map(r => {
          const nId = typeof r.id === 'string' ? Number(r.id) : r.id;
          return folderMap.get(nId);
        })
      );

      expect(includedFolders.size).toBeLessThanOrEqual(2);
      // Results should be sorted by score descending
      for (let i = 1; i < filtered.length; i++) {
        expect(filtered[i - 1].score).toBeGreaterThanOrEqual(filtered[i].score);
      }
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T020-10: Two-phase with K=1 — single folder
     ──────────────────────────────────────────────────────────────── */
  describe('Two-phase K=1', () => {
    it('T020-10: K=1 returns results from only the top folder', () => {
      const results = [
        makeResult(1, 0.9),   // folder-top
        makeResult(2, 0.8),   // folder-top
        makeResult(3, 0.6),   // folder-low
        makeResult(4, 0.5),   // folder-low
      ];
      const folderMap = buildFolderMap([
        [1, 'folder-top'],
        [2, 'folder-top'],
        [3, 'folder-low'],
        [4, 'folder-low'],
      ]);

      const folderScores = computeFolderRelevanceScores(results, folderMap);
      const filtered = twoPhaseRetrieval(results, folderScores, folderMap, 1);

      // All returned results must belong to the single top folder
      const folders = new Set(
        filtered.map(r => folderMap.get(typeof r.id === 'string' ? Number(r.id) : r.id as number))
      );
      expect(folders.size).toBe(1);

      // Verify the top folder is folder-top (higher individual scores + same damping)
      expect(folders.has('folder-top')).toBe(true);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T020-11: lookupFolders with mock DB
     ──────────────────────────────────────────────────────────────── */
  describe('lookupFolders', () => {
    it('T020-11a: returns correct mapping from mock database', () => {
      const mockRows = [
        { id: 1, spec_folder: 'specs/001-feature' },
        { id: 2, spec_folder: 'specs/002-bugfix' },
        { id: 3, spec_folder: 'specs/001-feature' },
      ];

      const mockStmt = {
        all: vi.fn((..._args: unknown[]) => mockRows),
      };

      const mockDb = {
        prepare: vi.fn((_sql: string) => mockStmt),
      } as unknown as Database.Database;

      const result = lookupFolders(mockDb, [1, 2, 3]);

      expect(mockDb.prepare).toHaveBeenCalledOnce();
      expect(mockStmt.all).toHaveBeenCalledWith(1, 2, 3);
      expect(result.size).toBe(3);
      expect(result.get(1)).toBe('specs/001-feature');
      expect(result.get(2)).toBe('specs/002-bugfix');
      expect(result.get(3)).toBe('specs/001-feature');
    });

    it('T020-11b: empty ids returns empty map without querying', () => {
      const mockDb = {
        prepare: vi.fn(),
      } as unknown as Database.Database;

      const result = lookupFolders(mockDb, []);

      expect(result.size).toBe(0);
      expect(mockDb.prepare).not.toHaveBeenCalled();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T020-12: enrichResults preserves original fields
     ──────────────────────────────────────────────────────────────── */
  describe('enrichResults preserves original fields', () => {
    it('T020-12: original fields are not lost after enrichment', () => {
      const results = [
        makeResult(1, 0.9, { title: 'Memory One', source: 'vector', customField: 42 }),
        makeResult(2, 0.7, { title: 'Memory Two', source: 'bm25' }),
      ];
      const folderMap = buildFolderMap([
        [1, 'alpha'],
        [2, 'beta'],
      ]);
      const folderScores = computeFolderRelevanceScores(results, folderMap);
      const enriched = enrichResultsWithFolderScores(results, folderScores, folderMap);

      // Original fields preserved (access via Record cast since spread extras aren't tracked)
      expect((enriched[0] as Record<string, unknown>).title).toBe('Memory One');
      expect((enriched[0] as Record<string, unknown>).source).toBe('vector');
      expect((enriched[0] as Record<string, unknown>).customField).toBe(42);
      expect((enriched[1] as Record<string, unknown>).title).toBe('Memory Two');
      expect((enriched[1] as Record<string, unknown>).source).toBe('bm25');

      // New fields added
      expect(enriched[0].folderScore).toBeDefined();
      expect(enriched[0].folderRank).toBeDefined();
      expect(enriched[0].specFolder).toBeDefined();
      expect(typeof enriched[0].folderScore).toBe('number');
      expect(typeof enriched[0].folderRank).toBe('number');
      expect(typeof enriched[0].specFolder).toBe('string');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T020-13: two-phase retrieval with empty inputs
     ──────────────────────────────────────────────────────────────── */
  describe('Two-phase edge cases', () => {
    it('T020-13a: empty results returns empty array', () => {
      const result = twoPhaseRetrieval([], new Map(), new Map());
      expect(result).toEqual([]);
    });

    it('T020-13b: empty folderScores returns empty array', () => {
      const results = [makeResult(1, 0.5)];
      const result = twoPhaseRetrieval(results, new Map(), new Map());
      expect(result).toEqual([]);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T020-14: enrichResults with empty input
     ──────────────────────────────────────────────────────────────── */
  describe('enrichResults edge cases', () => {
    it('T020-14: empty results returns empty array', () => {
      const enriched = enrichResultsWithFolderScores([], new Map(), new Map());
      expect(enriched).toEqual([]);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     T020-15: string IDs handled correctly
     ──────────────────────────────────────────────────────────────── */
  describe('String ID handling', () => {
    it('T020-15: string IDs are converted to numbers for folderMap lookup', () => {
      const results = [
        { id: '1' as unknown as number, score: 0.8 },
        { id: '2' as unknown as number, score: 0.6 },
      ];
      const folderMap = buildFolderMap([
        [1, 'alpha'],
        [2, 'beta'],
      ]);

      const scores = computeFolderRelevanceScores(
        results as Array<{ id: number | string; score: number }>,
        folderMap,
      );

      expect(scores.size).toBe(2);
      expect(scores.has('alpha')).toBe(true);
      expect(scores.has('beta')).toBe(true);
    });
  });
});
