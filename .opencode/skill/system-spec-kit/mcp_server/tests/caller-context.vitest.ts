// ───────────────────────────────────────────────────────────────
// MODULE: Caller Context Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  getCallerContext,
  requireCallerContext,
  runWithCallerContext,
} from '../lib/context/caller-context.js';
import type { MCPCallerContext } from '../lib/context/caller-context.js';

function makeCallerContext(overrides: Partial<MCPCallerContext> = {}): MCPCallerContext {
  return {
    sessionId: 'session-123',
    transport: 'stdio',
    connectedAt: '2026-04-17T15:03:56.239Z',
    callerPid: 4242,
    metadata: {
      pid: 4242,
      source: 'vitest',
    },
    ...overrides,
  };
}

describe('caller-context', () => {
  it('sets the store correctly inside runWithCallerContext', () => {
    const callerContext = makeCallerContext();

    const activeContext = runWithCallerContext(callerContext, () => getCallerContext());

    expect(activeContext).toBe(callerContext);
  });

  it('returns null outside a run', () => {
    expect(getCallerContext()).toBeNull();
  });

  it('returns the active context inside a run', () => {
    const callerContext = makeCallerContext();

    runWithCallerContext(callerContext, () => {
      expect(getCallerContext()).toBe(callerContext);
    });
  });

  it('throws outside a run when requireCallerContext is used', () => {
    expect(() => requireCallerContext()).toThrow(
      'MCP caller context missing — handler called outside runWithCallerContext()',
    );
  });

  it('returns the active context from requireCallerContext inside a run', () => {
    const callerContext = makeCallerContext();

    const activeContext = runWithCallerContext(callerContext, () => requireCallerContext());

    expect(activeContext).toBe(callerContext);
  });

  it('propagates context across await boundaries', async () => {
    const callerContext = makeCallerContext();

    await runWithCallerContext(callerContext, async () => {
      await Promise.resolve();
      expect(getCallerContext()).toBe(callerContext);
      expect(requireCallerContext()).toBe(callerContext);
    });
  });

  it('propagates context into setTimeout callbacks', async () => {
    const callerContext = makeCallerContext();

    await runWithCallerContext(callerContext, async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(getCallerContext()).toBe(callerContext);
          resolve();
        }, 0);
      });
    });
  });

  it('propagates context into setImmediate callbacks', async () => {
    const callerContext = makeCallerContext();

    await runWithCallerContext(callerContext, async () => {
      await new Promise<void>((resolve) => {
        setImmediate(() => {
          expect(getCallerContext()).toBe(callerContext);
          resolve();
        });
      });
    });
  });

  it('propagates context into queueMicrotask callbacks', async () => {
    const callerContext = makeCallerContext();

    await runWithCallerContext(callerContext, async () => {
      await new Promise<void>((resolve) => {
        queueMicrotask(() => {
          expect(getCallerContext()).toBe(callerContext);
          resolve();
        });
      });
    });
  });

  it('propagates context across node:timers/promises helpers', async () => {
    const callerContext = makeCallerContext();

    await runWithCallerContext(callerContext, async () => {
      await import('node:timers/promises').then(async ({ setImmediate, setTimeout }) => {
        await setImmediate();
        expect(getCallerContext()).toBe(callerContext);

        await setTimeout(0);
        expect(getCallerContext()).toBe(callerContext);
      });
    });
  });

  it('overrides nested runs and restores the parent context afterwards', () => {
    const parentContext = makeCallerContext({ sessionId: 'parent-session' });
    const childContext = makeCallerContext({ sessionId: 'child-session' });

    runWithCallerContext(parentContext, () => {
      expect(requireCallerContext()).toBe(parentContext);

      runWithCallerContext(childContext, () => {
        expect(requireCallerContext()).toBe(childContext);
      });

      expect(requireCallerContext()).toBe(parentContext);
    });
  });

  it('does not leak context between concurrent runs', async () => {
    const firstContext = makeCallerContext({ sessionId: 'first-session', callerPid: 1001 });
    const secondContext = makeCallerContext({ sessionId: 'second-session', callerPid: 1002 });

    const [firstResult, secondResult] = await Promise.all([
      runWithCallerContext(firstContext, async () => {
        await new Promise((resolve) => setTimeout(resolve, 5));
        return requireCallerContext();
      }),
      runWithCallerContext(secondContext, async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        return requireCallerContext();
      }),
    ]);

    expect(firstResult).toBe(firstContext);
    expect(secondResult).toBe(secondContext);
  });

  it('models all public fields as readonly', () => {
    expectTypeOf<MCPCallerContext>().toEqualTypeOf<{
      readonly sessionId: string | null;
      readonly transport: 'stdio' | 'sse' | 'ws' | 'unknown';
      readonly connectedAt: string;
      readonly callerPid?: number;
      readonly trusted?: boolean;
      readonly metadata: Record<string, unknown>;
    }>();
  });

  it('returns callback results unchanged', async () => {
    const callerContext = makeCallerContext();

    const result = await runWithCallerContext(callerContext, async () => 'dispatch-result');

    expect(result).toBe('dispatch-result');
  });

  it('clears the active store after a failed run', async () => {
    const callerContext = makeCallerContext();

    await expect(runWithCallerContext(callerContext, async () => {
      throw new Error('boom');
    })).rejects.toThrow('boom');

    expect(getCallerContext()).toBeNull();
  });
});
