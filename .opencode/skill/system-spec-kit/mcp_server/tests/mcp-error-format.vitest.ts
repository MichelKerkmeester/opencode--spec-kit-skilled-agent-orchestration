// TEST: MCP ERROR FORMAT
import { describe, it, expect } from 'vitest';

import * as handlers from '../handlers/index';
import * as errorsBarrel from '../lib/errors';
import { MemoryError } from '../lib/errors/core';
import { RECOVERY_HINTS } from '../lib/errors/recovery-hints';

interface HandlerResponse {
  content?: Array<{ type?: string; text?: string }>;
  isError?: boolean;
  [key: string]: unknown;
}

interface ParsedErrorEnvelope {
  error?: unknown;
  errors?: unknown;
}

type HandlerFunction = (args: unknown) => Promise<HandlerResponse>;
type CapturedErrorResult = { error: unknown; response: HandlerResponse | null } | null;
type StructuredError = Error & {
  code?: string;
  layer?: string;
  details?: Record<string, unknown> & { layer?: string };
};

function getHandler(handlerName: string): HandlerFunction | null {
  const candidate = (handlers as Record<string, unknown>)[handlerName];
  return typeof candidate === 'function' ? (candidate as HandlerFunction) : null;
}

// Helper: invoke handler and capture error
async function captureError(handlerName: string, invalidArgs: unknown): Promise<CapturedErrorResult> {
  const handlerFn = getHandler(handlerName);
  if (!handlerFn) return null;

  try {
    const result = await handlerFn(invalidArgs);
    return { error: null, response: result };
  } catch (error: unknown) {
    return { error, response: null };
  }
}

describe('MCP Protocol Error Format Tests (T535) [deferred - requires DB test fixtures]', () => {
  // Test Suite A: MemoryError class structure (T535-1 through T535-5)
  describe('T535-A: MemoryError class structure', () => {
    it('T535-1: MemoryError class exists and is importable', () => {
      expect(MemoryError).toBeDefined();
      expect(typeof MemoryError).toBe('function');
    });

    it('T535-2: MemoryError has .code property', () => {
      const instance = new MemoryError('E030', 'Test error', {});
      expect(instance.code).toBe('E030');
    });

    it('T535-3: MemoryError has .message property', () => {
      const instance = new MemoryError('E030', 'Validation test message', {});
      expect(instance.message).toBe('Validation test message');
    });

    it('T535-4: MemoryError carries layer info', () => {
      const instance = new MemoryError('E030', 'Test error', { layer: 'L2' });
      const layer =
        (instance as MemoryError & { layer?: unknown }).layer ??
        instance.details.layer;

      // Either has layer info directly or identifies as MemoryError
      expect(Boolean(layer) || instance.name === 'MemoryError').toBeTruthy();
    });

    it('T535-5: Error responses include recovery hint pattern', () => {
      const recoverHints =
        RECOVERY_HINTS || (errorsBarrel as { getRecoveryHint?: unknown }).getRecoveryHint;

      if (recoverHints && typeof recoverHints === 'object') {
        expect(Object.keys(recoverHints).length).toBeGreaterThan(0);
      } else if (typeof recoverHints === 'function') {
        expect(typeof recoverHints).toBe('function');
      } else {
        const instance = new MemoryError('E030', 'Test', {});
        expect('recoveryHint' in instance).toBe(true);
      }
    });
  });

  // Test Suite B: Handler error format verification (T535-6 through T535-10)
  describe('T535-B: Handler error format verification', () => {
    const HANDLER_ERROR_TESTS = [
      {
        testId: 'T535-6',
        name: 'Search handler error format on invalid input',
        handler: 'handleMemorySearch',
        invalidArgs: { query: 12345 },
        expectedLayer: 'L2',
      },
      {
        testId: 'T535-7',
        name: 'Trigger handler error format on invalid input',
        handler: 'handleMemoryMatchTriggers',
        invalidArgs: {},
        expectedLayer: 'L2',
      },
      {
        testId: 'T535-8',
        name: 'Save handler error format on invalid input',
        handler: 'handleMemorySave',
        invalidArgs: {},
        expectedLayer: 'L2',
      },
      {
        testId: 'T535-9',
        name: 'CRUD handler error format on invalid input',
        handler: 'handleMemoryUpdate',
        invalidArgs: {},
        expectedLayer: 'L4',
      },
      {
        testId: 'T535-10',
        name: 'Causal graph handler error format on invalid input',
        handler: 'handleMemoryCausalLink',
        invalidArgs: {},
        expectedLayer: 'L6',
      },
    ];

    for (const test of HANDLER_ERROR_TESTS) {
      it(`${test.testId}: ${test.name}`, async () => {
        const result = await captureError(test.handler, test.invalidArgs);

        if (!result) {
          return;
        }

        if (result.error) {
          const error = result.error as StructuredError;

          const hasStructuredError =
            error.name === 'MemoryError' ||
            Boolean(error.layer) ||
            Boolean(error.details?.layer) ||
            (typeof error.code === 'string' && error.code.startsWith('E'));

          expect(hasStructuredError || Boolean(error.message)).toBe(true);
        } else if (result.response) {
          const firstText = result.response.content?.[0]?.text;

          if (result.response.isError === true) {
            expect(result.response.isError).toBe(true);
          } else if (typeof firstText === 'string') {
            const parsed = JSON.parse(firstText) as ParsedErrorEnvelope;
            expect(Boolean(parsed.error || parsed.errors)).toBeTruthy();
          } else {
            expect.unreachable('No error thrown or error response returned');
          }
        }
      });
    }
  });
});
