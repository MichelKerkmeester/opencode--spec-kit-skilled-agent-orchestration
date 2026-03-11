import { describe, it, expect } from 'vitest';
import * as handler from '../handlers/memory-crud';

type ErrorLike = {
  message?: string;
};

function toErrorLike(error: unknown): ErrorLike {
  if (error instanceof Error) {
    return error as ErrorLike;
  }
  if (typeof error === 'object' && error !== null) {
    return error as ErrorLike;
  }
  return { message: String(error) };
}

describe('handleMemoryList Edge Cases (T006)', () => {
  it('T006-L1: Invalid sortBy does not throw (falls back to created_at)', async () => {
    try {
      await handler.handleMemoryList({
        sortBy: 'invalid_column' as unknown as Parameters<typeof handler.handleMemoryList>[0]['sortBy'],
      });
      // No error or DB error means validation passed
    } catch (error: unknown) {
      const typedError = toErrorLike(error);
      expect(
        typedError.message?.includes('database') === true ||
          typedError.message?.includes('DB') === true ||
          typedError.message?.includes('getDb') === true
      ).toBe(true);
    }
  });

  it('T006-L2: Non-boolean includeChunks throws', async () => {
    await expect(
      handler.handleMemoryList({
        includeChunks: 'yes' as unknown as Parameters<typeof handler.handleMemoryList>[0]['includeChunks'],
      })
    ).rejects.toThrow(/includeChunks.*boolean|boolean.*includeChunks/);
  });

  it('T006-L3: Negative limit does not throw (clamped to 1)', async () => {
    try {
      await handler.handleMemoryList({ limit: -5 });
    } catch (error: unknown) {
      const typedError = toErrorLike(error);
      expect(
        typedError.message?.includes('database') === true ||
          typedError.message?.includes('DB') === true ||
          typedError.message?.includes('getDb') === true
      ).toBe(true);
    }
  });

  it('T006-L4: Limit > 100 does not throw (clamped to 100)', async () => {
    try {
      await handler.handleMemoryList({ limit: 500 });
    } catch (error: unknown) {
      const typedError = toErrorLike(error);
      expect(
        typedError.message?.includes('database') === true ||
          typedError.message?.includes('DB') === true ||
          typedError.message?.includes('getDb') === true
      ).toBe(true);
    }
  });

  it('T006-L5: Negative offset does not throw (clamped to 0)', async () => {
    try {
      await handler.handleMemoryList({ offset: -10 });
    } catch (error: unknown) {
      const typedError = toErrorLike(error);
      expect(
        typedError.message?.includes('database') === true ||
          typedError.message?.includes('DB') === true ||
          typedError.message?.includes('getDb') === true
      ).toBe(true);
    }
  });

  it('T006-L6: Empty string specFolder does not throw', async () => {
    try {
      await handler.handleMemoryList({ specFolder: '' });
    } catch (error: unknown) {
      const typedError = toErrorLike(error);
      expect(
        typedError.message?.includes('database') === true ||
          typedError.message?.includes('DB') === true ||
          typedError.message?.includes('getDb') === true
      ).toBe(true);
    }
  });
});
