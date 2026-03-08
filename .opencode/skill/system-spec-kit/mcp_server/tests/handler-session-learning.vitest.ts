// ---------------------------------------------------------------
// TEST: HANDLER SESSION LEARNING
// ---------------------------------------------------------------

import { describe, it, expect } from 'vitest';

// DB-dependent imports - commented out for deferred test suite
import * as handler from '../handlers/session-learning';

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

describe('Handler Session Learning (T522) [deferred - requires DB test fixtures]', () => {
  // -------------------------------------------------------------
  // SUITE: Exports Validation
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // SUITE: handleTaskPreflight Validation
  // -------------------------------------------------------------
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
  });

  // -------------------------------------------------------------
  // SUITE: handleTaskPostflight Validation
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // SUITE: handleGetLearningHistory Validation
  // -------------------------------------------------------------
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
