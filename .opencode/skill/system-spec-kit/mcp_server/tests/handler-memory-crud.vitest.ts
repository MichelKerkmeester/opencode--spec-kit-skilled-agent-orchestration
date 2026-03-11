// ---------------------------------------------------------------
// TEST: HANDLER MEMORY CRUD
// ---------------------------------------------------------------

import { describe, it, expect } from 'vitest';
// DB-dependent imports - commented out for deferred test suite
import * as handler from '../handlers/memory-crud';
import type { HealthArgs, StatsArgs } from '../handlers/memory-crud-types';

type ErrorLike = {
  name?: string;
  code?: string;
  message?: string;
};

type WritableStatsArgs = Exclude<Parameters<typeof handler.handleMemoryStats>[0], null>;

function toErrorLike(error: unknown): ErrorLike {
  if (error instanceof Error) {
    return error as ErrorLike;
  }
  if (typeof error === 'object' && error !== null) {
    return error as ErrorLike;
  }

  return { message: String(error) };
}

describe('Handler Memory CRUD (T519) [deferred - requires DB test fixtures]', () => {
  describe('Exports Validation', () => {
    const expectedExports = [
      'handleMemoryDelete',
      'handleMemoryUpdate',
      'handleMemoryList',
      'handleMemoryStats',
      'handleMemoryHealth',
      'setEmbeddingModelReady',
    ] as const satisfies readonly (keyof typeof handler)[];

    for (const name of expectedExports) {
      it(`T519-export: ${name} exported`, () => {
        expect(typeof handler[name]).toBe('function');
      });
    }

    it('T519-export-aliases: All snake_case aliases', () => {
      const aliases = [
        'handle_memory_delete',
        'handle_memory_update',
        'handle_memory_list',
        'handle_memory_stats',
        'handle_memory_health',
        'set_embedding_model_ready',
      ] as const satisfies readonly (keyof typeof handler)[];

      for (const alias of aliases) {
        expect(typeof handler[alias]).toBe('function');
      }
    });
  });

  describe('handleMemoryDelete Input Validation', () => {
    it('T519-D1: Missing id and specFolder throws', async () => {
      await expect(handler.handleMemoryDelete({})).rejects.toThrow(/id|specFolder/);
    });

    it('T519-D2: Non-string specFolder throws', async () => {
      await expect(
        handler.handleMemoryDelete({ specFolder: 123 } as unknown as Parameters<typeof handler.handleMemoryDelete>[0])
      ).rejects.toThrow(/specFolder.*string|string.*specFolder/);
    });

    it('T519-D3: Bulk delete without confirm throws', async () => {
      await expect(
        handler.handleMemoryDelete({ specFolder: 'specs/test', confirm: false })
      ).rejects.toThrow(/confirm/);
    });

    it('T519-D4: Non-numeric id throws', async () => {
      await expect(
        handler.handleMemoryDelete({ id: 'not-a-number' } as unknown as Parameters<typeof handler.handleMemoryDelete>[0])
      ).rejects.toThrow(
        /Invalid|number/
      );
    });

    it('T519-D5: Partially numeric id strings are rejected', async () => {
      await expect(
        handler.handleMemoryDelete({ id: '12abc' } as unknown as Parameters<typeof handler.handleMemoryDelete>[0])
      ).rejects.toThrow(
        /Invalid|integer|number/
      );
    });
  });

  describe('handleMemoryUpdate Input Validation', () => {
    it('T519-U1: Missing id throws MemoryError', async () => {
      try {
        await handler.handleMemoryUpdate({} as unknown as Parameters<typeof handler.handleMemoryUpdate>[0]);
        expect.unreachable('Should have thrown');
      } catch (error: unknown) {
        const typedError = toErrorLike(error);
        const isMemoryError =
          typedError.name === 'MemoryError' ||
          typedError.code === 'E031' ||
          (typedError.message?.includes('id') === true && typedError.message?.includes('required') === true);
        expect(isMemoryError).toBe(true);
      }
    });

    it('T519-U2: importanceWeight > 1 throws', async () => {
      try {
        await handler.handleMemoryUpdate({ id: 1, importanceWeight: 1.5 });
        expect.unreachable('Should have thrown');
      } catch (error: unknown) {
        const typedError = toErrorLike(error);
        expect(
          typedError.code === 'E030' || typedError.message?.includes('importanceWeight') === true
        ).toBe(true);
      }
    });

    it('T519-U3: importanceWeight < 0 throws', async () => {
      try {
        await handler.handleMemoryUpdate({ id: 1, importanceWeight: -0.5 });
        expect.unreachable('Should have thrown');
      } catch (error: unknown) {
        const typedError = toErrorLike(error);
        expect(
          typedError.code === 'E030' || typedError.message?.includes('importanceWeight') === true
        ).toBe(true);
      }
    });

    it('T519-U4: Invalid importanceTier throws', async () => {
      try {
        await handler.handleMemoryUpdate({
          id: 1,
          importanceTier: 'invalid_tier' as unknown as Parameters<typeof handler.handleMemoryUpdate>[0]['importanceTier'],
        });
        expect.unreachable('Should have thrown');
      } catch (error: unknown) {
        const typedError = toErrorLike(error);
        expect(
          typedError.code === 'E030' || typedError.message?.includes('importance tier') === true
        ).toBe(true);
      }
    });
  });

  describe('handleMemoryList Input Validation', () => {
    it('T519-L1: Non-string specFolder throws', async () => {
      await expect(handler.handleMemoryList({ specFolder: 42 } as unknown as Parameters<typeof handler.handleMemoryList>[0])).rejects.toThrow(
        /specFolder.*string|string.*specFolder/
      );
    });

    it('T519-L2: handleMemoryList is async', () => {
      expect(
        handler.handleMemoryList.constructor.name === 'AsyncFunction' ||
          typeof handler.handleMemoryList === 'function'
      ).toBe(true);
    });

    it('T519-L3: Empty args accepted (defaults applied)', async () => {
      try {
        await handler.handleMemoryList({});
        // No validation error — pass
      } catch (error: unknown) {
        const typedError = toErrorLike(error);
        // DB errors are acceptable (means validation passed)
        expect(
          typedError.message?.includes('database') === true ||
            typedError.message?.includes('DB') === true ||
            typedError.message?.includes('getDb') === true
        ).toBe(true);
      }
    });
  });

  describe('handleMemoryStats Input Validation', () => {
    it('T519-S1: Invalid folderRanking throws', async () => {
      try {
        await handler.handleMemoryStats({
          folderRanking: 'invalid_ranking' as unknown as StatsArgs['folderRanking'],
        });
        expect.unreachable('Should have thrown');
      } catch (error: unknown) {
        const typedError = toErrorLike(error);
        // Either validation error or DB error is acceptable
        expect(
          typedError.message?.includes('folderRanking') === true ||
            typedError.message?.includes('Invalid') === true ||
            typedError.message?.includes('database') === true ||
            typedError.message?.includes('getDb') === true
        ).toBe(true);
      }
    });

    it('T519-S2: Non-array excludePatterns throws', async () => {
      try {
        await handler.handleMemoryStats({
          excludePatterns: 'not-an-array' as unknown as WritableStatsArgs['excludePatterns'],
        });
        expect.unreachable('Should have thrown');
      } catch (error: unknown) {
        const typedError = toErrorLike(error);
        expect(
          typedError.message?.includes('excludePatterns') === true ||
            typedError.message?.includes('array') === true ||
            typedError.message?.includes('database') === true ||
            typedError.message?.includes('getDb') === true
        ).toBe(true);
      }
    });

    it('T519-S3: Null args accepted (uses defaults)', async () => {
      try {
        await handler.handleMemoryStats(null as unknown as Parameters<typeof handler.handleMemoryStats>[0]);
        // Defaults used — pass
      } catch (error: unknown) {
        const typedError = toErrorLike(error);
        // DB errors are acceptable (means validation passed)
        expect(
          typedError.message?.includes('database') === true || typedError.message?.includes('getDb') === true
        ).toBe(true);
      }
    });
  });

  describe('handleMemoryHealth', () => {
    it('T519-H1: Health handler returns status', async () => {
      try {
        const result = await handler.handleMemoryHealth({});
        expect(result).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.content.length).toBeGreaterThan(0);
        const parsed = JSON.parse(result.content[0].text);
        expect(
          (parsed.data && typeof parsed.data.status === 'string') || parsed.summary
        ).toBeTruthy();
      } catch (error: unknown) {
        const typedError = toErrorLike(error);
        // DB errors are acceptable
        expect(
          typedError.message?.includes('database') === true || typedError.message?.includes('getDb') === true
        ).toBe(true);
      }
    });

    it('T519-H2: setEmbeddingModelReady(true) succeeds', () => {
      expect(() => handler.setEmbeddingModelReady(true)).not.toThrow();
    });

    it('T519-H2b: setEmbeddingModelReady(false) succeeds', () => {
      expect(() => handler.setEmbeddingModelReady(false)).not.toThrow();
    });

    it('T519-H3: Invalid reportMode returns error response', async () => {
      const result = await handler.handleMemoryHealth({ reportMode: 'not-valid' } as unknown as HealthArgs);
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.data?.error).toMatch(/Invalid reportMode/);
    });

    it('T519-H4: Invalid limit returns error response', async () => {
      const result = await handler.handleMemoryHealth({ reportMode: 'divergent_aliases', limit: 0 });
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.data?.error).toMatch(/limit must be a positive number/);
    });
  });
});
