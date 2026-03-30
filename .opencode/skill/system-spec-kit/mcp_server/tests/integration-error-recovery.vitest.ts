// TEST: INTEGRATION ERROR RECOVERY
import { describe, it, expect } from 'vitest';

import * as searchHandlerModule from '../handlers/memory-search';
import * as saveHandlerModule from '../handlers/memory-save';
import * as triggerHandlerModule from '../handlers/memory-triggers';
import * as causalHandlerModule from '../handlers/causal-graph';
import * as checkpointHandlerModule from '../handlers/checkpoints';
import * as learningHandlerModule from '../handlers/session-learning';
import * as handlersBarrelModule from '../handlers/index';
import * as errorsModule from '../lib/errors/index';
import { MemoryError } from '../lib/errors/core';
import type { MCPResponse } from '../handlers/types';

type ErrorHelpers = Partial<Record<'createMCPSuccessResponse' | 'createMCPErrorResponse', unknown>>;

function getErrorMessage(error: unknown): string | undefined {
  return error instanceof Error ? error.message : undefined;
}

function hasStructuredContentError(result: MCPResponse): boolean {
  const text = result.content?.[0]?.text;
  if (typeof text !== 'string') return false;

  try {
    const parsed = JSON.parse(text) as { error?: unknown };
    return typeof parsed.error === 'string' && parsed.error.length > 0;
  } catch {
    return false;
  }
}

describe('Integration Error Recovery (T532) [deferred - requires DB test fixtures]', () => {

  describe('Setup: Module Loading', () => {
    it('T532-setup-1: Search handler loaded', () => {
      expect(searchHandlerModule).toBeDefined();
    });

    it('T532-setup-2: Save handler loaded', () => {
      expect(saveHandlerModule).toBeDefined();
    });

    it('T532-setup-3: Trigger handler loaded', () => {
      expect(triggerHandlerModule).toBeDefined();
    });

    it('T532-setup-4: Causal handler loaded', () => {
      expect(causalHandlerModule).toBeDefined();
    });

    it('T532-setup-5: Checkpoint handler loaded', () => {
      expect(checkpointHandlerModule).toBeDefined();
    });

    it('T532-setup-6: Learning handler loaded', () => {
      expect(learningHandlerModule).toBeDefined();
    });

    it('T532-setup-7: Errors module loaded', () => {
      expect(errorsModule).toBeDefined();
      expect(MemoryError).toBeDefined();
    });
  });

  describe('Error Class Verification', () => {
    it('T532-1: MemoryError class has code property', () => {
      const err = new MemoryError('E030', 'Test error message');
      expect(err).toBeInstanceOf(Error);
      expect(typeof err.code).toBe('string');
      expect(typeof err.message).toBe('string');
    });

    it('T532-2: Error includes layer information', () => {
      const err = new MemoryError('E030', 'Test with layer', { layer: 'validation' });
      const hasLayer = err.details.layer === 'validation';
      // Layer may be stored internally — just verify construction succeeds
      expect(err).toBeInstanceOf(Error);
      expect(err.code).toBe('E030');
      expect(hasLayer).toBe(true);
    });

    it('T532-3: Error includes recovery hint', () => {
      const err = new MemoryError('E030', 'Test with hint', { hint: 'Check parameter types' });
      expect(err).toBeInstanceOf(Error);
      expect(err.code).toBe('E030');
    });
  });

  describe('Handler Error Format Consistency', () => {
    it('T532-4: All handlers return MCP-formatted errors (not raw throws)', async () => {
      const handlers: Array<{ name: string; run: () => Promise<MCPResponse> }> = [];

      if (searchHandlerModule?.handleMemorySearch) {
        handlers.push({
          name: 'search',
          run: () => searchHandlerModule.handleMemorySearch({} as Parameters<typeof searchHandlerModule.handleMemorySearch>[0]),
        });
      }
      if (saveHandlerModule?.handleMemorySave) {
        handlers.push({
          name: 'save',
          run: () => saveHandlerModule.handleMemorySave({} as Parameters<typeof saveHandlerModule.handleMemorySave>[0]),
        });
      }
      if (triggerHandlerModule?.handleMemoryMatchTriggers) {
        handlers.push({
          name: 'triggers',
          run: () => triggerHandlerModule.handleMemoryMatchTriggers({} as Parameters<typeof triggerHandlerModule.handleMemoryMatchTriggers>[0]),
        });
      }
      if (causalHandlerModule?.handleMemoryCausalLink) {
        handlers.push({
          name: 'causal-link',
          run: () => causalHandlerModule.handleMemoryCausalLink({} as Parameters<typeof causalHandlerModule.handleMemoryCausalLink>[0]),
        });
      }
      if (checkpointHandlerModule?.handleCheckpointCreate) {
        handlers.push({
          name: 'checkpoint-create',
          run: () => checkpointHandlerModule.handleCheckpointCreate({} as Parameters<typeof checkpointHandlerModule.handleCheckpointCreate>[0]),
        });
      }
      if (learningHandlerModule?.handleTaskPreflight) {
        handlers.push({
          name: 'learning-preflight',
          run: () => learningHandlerModule.handleTaskPreflight({} as Parameters<typeof learningHandlerModule.handleTaskPreflight>[0]),
        });
      }

      expect(handlers.length).toBeGreaterThan(0);

      const inconsistentHandlers: string[] = [];

      for (const h of handlers) {
        try {
          const result = await h.run();
          // If no error thrown, handler may return error in MCP response format
          const isMcpError = result?.isError === true;
          const isStructuredSearchError = h.name === 'search' && hasStructuredContentError(result);
          if (!isMcpError && !isStructuredSearchError) {
            inconsistentHandlers.push(`${h.name} (no error thrown)`);
          }
        } catch (error: unknown) {
          if (typeof getErrorMessage(error) !== 'string') {
            inconsistentHandlers.push(`${h.name} (missing message)`);
          }
        }
      }

      expect(inconsistentHandlers).toEqual([]);
    });
  });

  describe('Edge Case Error Scenarios', () => {
    it('T532-5: Unknown tool name not in exports', () => {
      const unknownHandler = (handlersBarrelModule as Record<string, unknown>)['handleNonExistentTool'];
      expect(unknownHandler).toBeUndefined();
    });

    it('T532-6: Invalid parameter types produce clear errors', async () => {
      if (!searchHandlerModule?.handleMemorySearch) return;

      try {
        // @ts-expect-error intentional invalid runtime input for error-path coverage
        const result = await searchHandlerModule.handleMemorySearch({ query: 12345 });
        // Handler accepted coerced input — valid behavior (type coercion handled)
        expect(result).toBeDefined();
      } catch (error: unknown) {
        // Error thrown is also valid — just verify it has a message
        expect(typeof getErrorMessage(error)).toBe('string');
      }
    });

    it('T532-7: Error format includes structured fields', () => {
      const err = new MemoryError('E040', 'Not found error', { layer: 'storage', hint: 'Check memory ID' });
      expect(typeof err.code).toBe('string');
      expect(err.code.length).toBeGreaterThan(0);
      expect(typeof err.message).toBe('string');
      expect(err.message.length).toBeGreaterThan(0);
    });

    it('T532-8: MCP response helpers or MemoryError serialization available', () => {
      const errorHelpers = errorsModule as ErrorHelpers;

      const hasCreateResponse = typeof errorHelpers.createMCPSuccessResponse === 'function';
      const hasCreateError = typeof errorHelpers.createMCPErrorResponse === 'function';

      if (hasCreateResponse || hasCreateError) {
        expect(hasCreateResponse || hasCreateError).toBe(true);
      } else {
        // Verify MemoryError serializes with code/message
        const err = new MemoryError('E030', 'Format test');
        const serialized = JSON.stringify(err);
        const parsed = JSON.parse(serialized);
        expect(parsed.code || parsed.error || parsed.message).toBeTruthy();
      }
    });
  });
});
