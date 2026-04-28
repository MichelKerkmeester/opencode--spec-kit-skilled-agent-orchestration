// ───────────────────────────────────────────────────────────────
// MODULE: MCP Caller Context
// ───────────────────────────────────────────────────────────────

import { AsyncLocalStorage } from 'node:async_hooks';

export interface MCPCallerContext {
  /** Session identifier bound by the MCP transport layer on connection. */
  readonly sessionId: string | null;
  /** Transport type: 'stdio' | 'sse' | 'ws' | 'unknown'. */
  readonly transport: 'stdio' | 'sse' | 'ws' | 'unknown';
  /** Timestamp when the caller connected (ISO 8601). */
  readonly connectedAt: string;
  /** Process PID of the caller (if available from transport). */
  readonly callerPid?: number;
  /** Whether this caller is authorized for mutable maintenance operations. */
  readonly trusted?: boolean;
  /** Arbitrary transport-provided metadata. */
  readonly metadata: Record<string, unknown>;
}

const storage = new AsyncLocalStorage<MCPCallerContext>();

/** Run a callback inside a caller context. All downstream async operations see the context. */
export function runWithCallerContext<T>(ctx: MCPCallerContext, fn: () => T): T {
  return storage.run(ctx, fn);
}

/** Get the current caller context, or null if not inside a callerContext.run(). */
export function getCallerContext(): MCPCallerContext | null {
  return storage.getStore() ?? null;
}

/** Assert-style access — throws if no context. Use at MCP handler boundaries where context is guaranteed. */
export function requireCallerContext(): MCPCallerContext {
  const ctx = storage.getStore();
  if (!ctx) {
    throw new Error('MCP caller context missing — handler called outside runWithCallerContext()');
  }
  return ctx;
}
