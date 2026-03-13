// TEST: INTEGRATION CHECKPOINT LIFECYCLE
import { describe, it, expect } from 'vitest';

import * as checkpointHandler from '../handlers/checkpoints';

type CheckpointCreateArgs = Parameters<typeof checkpointHandler.handleCheckpointCreate>[0];
type CheckpointListArgs = Parameters<typeof checkpointHandler.handleCheckpointList>[0];
type CheckpointRestoreArgs = Parameters<typeof checkpointHandler.handleCheckpointRestore>[0];
type CheckpointDeleteArgs = Parameters<typeof checkpointHandler.handleCheckpointDelete>[0];
type MemoryValidateArgs = Parameters<typeof checkpointHandler.handleMemoryValidate>[0];

function getErrorMessage(error: unknown): string | undefined {
  return error instanceof Error ? error.message : undefined;
}

function getErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return undefined;
  }

  const { code } = error as { code?: unknown };
  return typeof code === 'string' ? code : undefined;
}

describe('Integration Checkpoint Lifecycle (T529) [deferred - requires DB test fixtures]', () => {

  describe('Pipeline Module Loading', () => {
    it('T529-1: Checkpoint pipeline modules loaded', () => {
      expect(checkpointHandler).toBeDefined();
      expect(typeof checkpointHandler).toBe('object');
    });
  });

  describe('Lifecycle Handler Parameter Validation', () => {
    it('T529-2: Missing name for Create rejected', async () => {
      await expect(checkpointHandler.handleCheckpointCreate({} as CheckpointCreateArgs)).rejects.toThrow();
    });

    it('T529-3: CheckpointList accepts empty params', async () => {
      // Should either return a valid MCP response or throw a DB/infra error,
      // But NOT a parameter validation error
      try {
        const result = await checkpointHandler.handleCheckpointList({} as CheckpointListArgs);
        // If it succeeds, it should return content
        expect(result).toBeDefined();
      } catch (error: unknown) {
        // DB or infra errors are acceptable (no DB in test env)
        const message = getErrorMessage(error);
        const code = getErrorCode(error);
        const isInfraError = message &&
          (message.includes('database') || message.includes('SQLITE') ||
           message.includes('DB') || message.includes('no such table') ||
           message.includes('initialize'));
        const isCodedError = code && (code === 'E010' || code === 'E020');
        expect(isInfraError || isCodedError).toBe(true);
      }
    });

    it('T529-4: Missing name for Restore rejected', async () => {
      await expect(checkpointHandler.handleCheckpointRestore({} as CheckpointRestoreArgs)).rejects.toThrow();
    });

    it('T529-5: Missing name for Delete rejected', async () => {
      await expect(checkpointHandler.handleCheckpointDelete({} as CheckpointDeleteArgs)).rejects.toThrow();
    });
  });

  describe('Validate & Metadata Parameters', () => {
    it('T529-6: Missing params for Validate rejected', async () => {
      await expect(checkpointHandler.handleMemoryValidate({} as MemoryValidateArgs)).rejects.toThrow();
    });

    it('T529-7: Metadata parameter accepted for Create', async () => {
      // Metadata should not cause a validation error.
      // DB/infra errors are acceptable in test env.
      try {
        await checkpointHandler.handleCheckpointCreate({
          name: 'test-checkpoint-' + Date.now(),
          metadata: { reason: 'integration test', version: '1.0' },
        } as CheckpointCreateArgs);
      } catch (error: unknown) {
        // Metadata-specific rejection = real failure
        expect(getErrorMessage(error)).not.toMatch(/metadata/i);
      }
    });

    it('T529-8: specFolder filter accepted for List', async () => {
      // SpecFolder should not cause a validation error.
      // DB/infra errors are acceptable in test env.
      try {
        await checkpointHandler.handleCheckpointList({
          specFolder: 'specs/test-folder',
        } as CheckpointListArgs);
      } catch (error: unknown) {
        // SpecFolder-specific rejection = real failure
        expect(getErrorMessage(error)).not.toMatch(/specFolder/i);
      }
    });
  });
});
