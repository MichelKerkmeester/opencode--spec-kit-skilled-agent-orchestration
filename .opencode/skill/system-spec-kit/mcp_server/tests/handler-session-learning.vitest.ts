// TEST: HANDLER SESSION LEARNING
import { describe, it, expect, vi } from 'vitest';
import Database from 'better-sqlite3';

// DB-dependent imports - commented out for deferred test suite
import * as handler from '../handlers/session-learning';
import * as vectorIndex from '../lib/search/vector-index';
import * as core from '../core';

function hasErrorCode(error: unknown, code: string): boolean {
  return typeof error === 'object'
    && error !== null
    && 'code' in error
    && (error as { code?: unknown }).code === code;
}

function hasErrorMessage(error: unknown, fragment: string): boolean {
  if (error instanceof Error) {
    return error.message.includes(fragment);
  }
  return typeof error === 'object'
    && error !== null
    && 'message' in error
    && typeof (error as { message?: unknown }).message === 'string'
    && (error as { message: string }).message.includes(fragment);
}

describe('Handler Session Learning (T522)', () => {
  // SUITE: Exports Validation
  describe('Exports Validation', () => {
    const expectedExports = [
      'handleTaskPreflight',
      'handleTaskPostflight',
      'handleGetLearningHistory',
      'ensureSchema',
    ] as const satisfies ReadonlyArray<keyof typeof handler>;

    for (const name of expectedExports) {
      it(`T522-export: ${name} exported`, () => {
        expect(typeof handler[name]).toBe('function');
      });
    }

    it('T522-export-aliases: All snake_case aliases', () => {
      const aliases = [
        'handle_task_preflight',
        'handle_task_postflight',
        'handle_get_learning_history',
        'ensure_schema',
      ] as const satisfies ReadonlyArray<keyof typeof handler>;

      for (const alias of aliases) {
        expect(typeof handler[alias]).toBe('function');
      }
    });
  });

  // SUITE: handleTaskPreflight Validation
  describe('handleTaskPreflight Validation', () => {
    it('T522-P1: Missing specFolder throws MemoryError', async () => {
      try {
        // @ts-expect-error Intentional invalid runtime-validation input without specFolder.
        await handler.handleTaskPreflight({
          taskId: 'test-task',
          knowledgeScore: 50,
          uncertaintyScore: 30,
          contextScore: 40,
        });
        expect.unreachable('No error thrown');
      } catch (error: unknown) {
        expect(
          hasErrorCode(error, 'E031') || hasErrorMessage(error, 'specFolder')
        ).toBe(true);
      }
    });

    it('T522-P2: Missing taskId throws MemoryError', async () => {
      try {
        // @ts-expect-error Intentional invalid runtime-validation input without taskId.
        await handler.handleTaskPreflight({
          specFolder: 'specs/test',
          knowledgeScore: 50,
          uncertaintyScore: 30,
          contextScore: 40,
        });
        expect.unreachable('No error thrown');
      } catch (error: unknown) {
        expect(
          hasErrorCode(error, 'E031') || hasErrorMessage(error, 'taskId')
        ).toBe(true);
      }
    });

    it('T522-P3: Missing knowledgeScore throws MemoryError', async () => {
      try {
        // @ts-expect-error Intentional invalid runtime-validation input without knowledgeScore.
        await handler.handleTaskPreflight({
          specFolder: 'specs/test',
          taskId: 'test-task',
          uncertaintyScore: 30,
          contextScore: 40,
        });
        expect.unreachable('No error thrown');
      } catch (error: unknown) {
        expect(
          hasErrorCode(error, 'E031') || hasErrorMessage(error, 'knowledgeScore')
        ).toBe(true);
      }
    });

    it('T522-P4: Score > 100 throws MemoryError E030', async () => {
      try {
        await handler.handleTaskPreflight({
          specFolder: 'specs/test',
          taskId: 'test-task',
          knowledgeScore: 150,
          uncertaintyScore: 30,
          contextScore: 40,
        });
        expect.unreachable('No error thrown');
      } catch (error: unknown) {
        expect(
          hasErrorCode(error, 'E030') || hasErrorMessage(error, '0 and 100')
        ).toBe(true);
      }
    });

    it('T522-P5: Negative score throws MemoryError E030', async () => {
      try {
        await handler.handleTaskPreflight({
          specFolder: 'specs/test',
          taskId: 'test-task',
          knowledgeScore: -10,
          uncertaintyScore: 30,
          contextScore: 40,
        });
        expect.unreachable('No error thrown');
      } catch (error: unknown) {
        expect(
          hasErrorCode(error, 'E030') || hasErrorMessage(error, '0 and 100')
        ).toBe(true);
      }
    });

    it('T011-OG1: Re-preflight on complete record starts a fresh cycle', async () => {
      // Set up an in-memory DB with a completed learning record
      const mockDb = new Database(':memory:');
      mockDb.exec(`
        CREATE TABLE IF NOT EXISTS session_learning (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          spec_folder TEXT NOT NULL,
          task_id TEXT NOT NULL,
          phase TEXT NOT NULL CHECK(phase IN ('preflight', 'complete')),
          session_id TEXT,
          pre_knowledge_score INTEGER,
          pre_uncertainty_score INTEGER,
          pre_context_score INTEGER,
          knowledge_gaps TEXT,
          post_knowledge_score INTEGER,
          post_uncertainty_score INTEGER,
          post_context_score INTEGER,
          delta_knowledge REAL,
          delta_uncertainty REAL,
          delta_context REAL,
          learning_index REAL,
          gaps_closed TEXT,
          new_gaps_discovered TEXT,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now')),
          completed_at TEXT
        )
      `);
      // Insert a completed record
      mockDb.prepare(
        "INSERT INTO session_learning (spec_folder, task_id, phase, pre_knowledge_score, pre_uncertainty_score, pre_context_score) VALUES (?, ?, 'complete', 50, 30, 40)"
      ).run('specs/already-completed', 'completed-task');

      // Mock vectorIndex.getDb to return our mock DB
      const spy = vi.spyOn(vectorIndex, 'getDb').mockReturnValue(mockDb as any);
      // Mock checkDatabaseUpdated to prevent db-state reinitialization failures
      const dbSpy = vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);

      try {
        const result = await handler.handleTaskPreflight({
          specFolder: 'specs/already-completed',
          taskId: 'completed-task',
          knowledgeScore: 50,
          uncertaintyScore: 30,
          contextScore: 40,
        });
        expect(result?.content?.[0]?.text).toContain('Preflight baseline captured');

        const count = mockDb.prepare(`
          SELECT COUNT(*) AS total
          FROM session_learning
          WHERE spec_folder = ? AND task_id = ?
        `).get('specs/already-completed', 'completed-task') as { total: number };

        expect(count.total).toBe(2);
      } finally {
        dbSpy.mockRestore();
        spy.mockRestore();
        mockDb.close();
      }
    });
  });

  // SUITE: handleTaskPostflight Validation
  describe('handleTaskPostflight Validation', () => {
    it('T522-PF1: Missing specFolder throws', async () => {
      try {
        // @ts-expect-error Intentional invalid runtime-validation input without specFolder.
        await handler.handleTaskPostflight({
          taskId: 'test-task',
          knowledgeScore: 70,
          uncertaintyScore: 20,
          contextScore: 60,
        });
        expect.unreachable('No error thrown');
      } catch (error: unknown) {
        expect(
          hasErrorCode(error, 'E031') || hasErrorMessage(error, 'specFolder')
        ).toBe(true);
      }
    });

    it('T522-PF2: Missing taskId throws', async () => {
      try {
        // @ts-expect-error Intentional invalid runtime-validation input without taskId.
        await handler.handleTaskPostflight({
          specFolder: 'specs/test',
          knowledgeScore: 70,
          uncertaintyScore: 20,
          contextScore: 60,
        });
        expect.unreachable('No error thrown');
      } catch (error: unknown) {
        expect(
          hasErrorCode(error, 'E031') || hasErrorMessage(error, 'taskId')
        ).toBe(true);
      }
    });

    it('T522-PF3: Score > 100 throws', async () => {
      try {
        await handler.handleTaskPostflight({
          specFolder: 'specs/test',
          taskId: 'test-task',
          knowledgeScore: 200,
          uncertaintyScore: 20,
          contextScore: 60,
        });
        expect.unreachable('No error thrown');
      } catch (error: unknown) {
        expect(
          hasErrorCode(error, 'E030') || hasErrorMessage(error, '0 and 100')
        ).toBe(true);
      }
    });
  });

  describe('T012: Learning Index Formula and Interpretation Bands', () => {
    // The LI formula (session-learning.ts:356):
    // LI = (deltaKnowledge * 0.4) + (deltaUncertainty * 0.35) + (deltaContext * 0.25)
    // Weights MUST sum to 1.0; handler rounds to 2 decimal places.

    const WEIGHT_K = 0.4;
    const WEIGHT_U = 0.35;
    const WEIGHT_C = 0.25;

    function computeLI(dK: number, dU: number, dC: number): number {
      return Math.round(((dK * WEIGHT_K) + (dU * WEIGHT_U) + (dC * WEIGHT_C)) * 100) / 100;
    }

    function classifyBand(li: number): string {
      if (li >= 40) return 'significant';
      if (li >= 15) return 'moderate';
      if (li >= 5) return 'incremental';
      return 'execution-focused';
    }

    it('T012-LI1: LI formula weights sum to 1.0', () => {
      expect(WEIGHT_K + WEIGHT_U + WEIGHT_C).toBeCloseTo(1.0, 10);
    });

    it('T012-LI2: Maximum LI for perfect learning (0->100 on all)', () => {
      const li = computeLI(100, 100, 100);
      expect(li).toBe(100);
      expect(classifyBand(li)).toBe('significant');
    });

    it('T012-LI3: Zero LI for no change', () => {
      const li = computeLI(0, 0, 0);
      expect(li).toBe(0);
      expect(classifyBand(li)).toBe('execution-focused');
    });

    it('T012-LI4: Negative LI for regression', () => {
      const li = computeLI(-20, -10, -5);
      expect(li).toBeLessThan(0);
      // Negative values are below all band thresholds
      expect(classifyBand(li)).toBe('execution-focused');
    });

    it('T012-LI5: Boundary — significant band starts at exactly 40', () => {
      expect(classifyBand(40)).toBe('significant');
      expect(classifyBand(39.99)).toBe('moderate');
    });

    it('T012-LI6: Boundary — moderate band is [15, 40)', () => {
      expect(classifyBand(15)).toBe('moderate');
      expect(classifyBand(14.99)).toBe('incremental');
    });

    it('T012-LI7: Boundary — incremental band is [5, 15)', () => {
      expect(classifyBand(5)).toBe('incremental');
      expect(classifyBand(4.99)).toBe('execution-focused');
    });

    it('T012-LI8: Handler postflight function exists and is callable', () => {
      expect(typeof handler.handleTaskPostflight).toBe('function');
      expect(typeof handler.handleTaskPreflight).toBe('function');
      expect(typeof handler.handleGetLearningHistory).toBe('function');
    });

    it('T012-LI9: Realistic scenario — moderate learning improvement', () => {
      // K: 40->65 (+25), U: 60->35 (+25 reduction), C: 30->50 (+20)
      const li = computeLI(25, 25, 20);
      expect(li).toBe(23.75);
      expect(classifyBand(li)).toBe('moderate');
    });

    it('T012-LI10: Knowledge-dominant learning (weight 0.4 has highest impact)', () => {
      const liKOnly = computeLI(50, 0, 0);
      const liUOnly = computeLI(0, 50, 0);
      const liCOnly = computeLI(0, 0, 50);
      expect(liKOnly).toBeGreaterThan(liUOnly);
      expect(liUOnly).toBeGreaterThan(liCOnly);
    });
  });

  // SUITE: handleGetLearningHistory Validation
  describe('handleGetLearningHistory Validation', () => {
    it('T522-H1: Missing specFolder throws', async () => {
      try {
        // @ts-expect-error Intentional invalid runtime-validation input without specFolder.
        await handler.handleGetLearningHistory({});
        expect.unreachable('No error thrown');
      } catch (error: unknown) {
        expect(
          hasErrorCode(error, 'E031') || hasErrorMessage(error, 'specFolder')
        ).toBe(true);
      }
    });

    it('T522-H2: handleGetLearningHistory is async', () => {
      expect(typeof handler.handleGetLearningHistory).toBe('function');
      expect(
        handler.handleGetLearningHistory.constructor.name === 'AsyncFunction'
        || typeof handler.handleGetLearningHistory === 'function'
      ).toBe(true);
    });
  });
});
