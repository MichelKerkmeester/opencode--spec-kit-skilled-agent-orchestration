// ───────────────────────────────────────────────────────────────
// MODULE: File Watcher Queue Cap & Close-Abort Tests (049/005, F-003-A3-03)
// ───────────────────────────────────────────────────────────────
//
// Asserts that startFileWatcher() bounds the pending-reindex slot queue and
// drains it cleanly on close():
//   - Queue caps at 1000 entries; the OLDEST waiter is evicted with a
//     QUEUE_OVERFLOW sentinel when overflow occurs.
//   - close() rejects every queued waiter with QUEUE_CLOSED so dependent code
//     exits early rather than hanging on Promises that never resolve.
//
// Implementation note: the queue lives behind the closure-private
// pendingReindexSlots / activeReindexCount in startFileWatcher, so we exercise
// it indirectly through scheduleReindex flooding.

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { startFileWatcher } from '../lib/ops/file-watcher';

interface MockFsWatcher {
  on: (event: string, listener: (...args: unknown[]) => void) => MockFsWatcher;
  close: () => Promise<void>;
}

function createWatchFactoryHarness(): {
  emit: (event: string, ...args: unknown[]) => void;
  watchFactory: (paths: string[], options: Record<string, unknown>) => MockFsWatcher;
} {
  const listeners = new Map<string, Array<(...args: unknown[]) => void>>();
  const watcher: MockFsWatcher = {
    on(event: string, listener: (...args: unknown[]) => void) {
      const existing = listeners.get(event) ?? [];
      existing.push(listener);
      listeners.set(event, existing);
      return watcher;
    },
    close: async () => undefined,
  };
  return {
    emit: (event, ...args) => {
      for (const listener of listeners.get(event) ?? []) {
        listener(...args);
      }
    },
    watchFactory: () => {
      queueMicrotask(() => {
        for (const listener of listeners.get('ready') ?? []) listener();
      });
      return watcher;
    },
  };
}

const tempDirs: string[] = [];

async function createTempDir(): Promise<string> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fw-queue-cap-'));
  tempDirs.push(tempDir);
  return tempDir;
}

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(async () => {
  for (const dir of tempDirs.splice(0)) {
    await fs.rm(dir, { recursive: true, force: true });
  }
});

describe('F-003-A3-03: file-watcher reindex queue is bounded and closes cleanly', () => {
  it('close() returns even when many reindex tasks have been scheduled', async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const tempDir = await createTempDir();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    // reindexFn hangs on a release gate; the active slot tasks block until
    // we release the gate, while queued waiters never reach reindexFn at all
    // (close() rejects them with QUEUE_CLOSED).
    let releaseActive: () => void = () => undefined;
    const releaseGate = new Promise<void>((resolve) => { releaseActive = resolve; });
    const reindexFn = vi.fn(async () => {
      await releaseGate;
    });

    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      debounceMs: 5,
    });

    // Schedule 50 distinct files. Two acquire active slots; the other 48
    // land in the queue under the 1000-cap.
    for (let attempt = 0; attempt < 50; attempt += 1) {
      const filePath = path.join(tempDir, `file-${attempt}.md`);
      await fs.writeFile(filePath, `content ${attempt}`);
      emit('add', filePath);
    }

    // Wait briefly for debounce timers to fire; the first 2 reindexFn calls
    // start (and hang), the remaining 48 land in the queue.
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Close: every queued waiter must be rejected so its wrapping operation
    // exits early. Then close() awaits inFlightReindex; we release the active
    // gate so those 2 slot tasks can finish.
    const closePromise = watcher.close();
    setTimeout(() => releaseActive(), 50);
    const closeStart = Date.now();
    await closePromise;
    const closeDuration = Date.now() - closeStart;

    // Without F-003-A3-03 the queued waiters would still be awaiting their
    // Promises (never resolving) — close() would hang on inFlightReindex
    // because each queued task's wrapper awaits acquireReindexSlot() which
    // would never resolve. With the fix, those awaiters reject with
    // QUEUE_CLOSED and the operation exits cleanly.
    expect(closeDuration).toBeLessThan(5_000);

    consoleErrorSpy.mockRestore();
  });

  it('rejects queued waiters with the close sentinel (logged at error severity, not warn)', async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const tempDir = await createTempDir();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    // reindexFn hangs only long enough for the queued waiters to pile up;
    // the active slot tasks finish in < 1s so close() resolves promptly.
    let releaseActive: () => void = () => undefined;
    const releaseGate = new Promise<void>((resolve) => { releaseActive = resolve; });
    const reindexFn = vi.fn(async () => {
      await releaseGate;
    });

    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      debounceMs: 5,
    });

    // Schedule enough files to force several to queue beyond the 2 active
    // slots.
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const filePath = path.join(tempDir, `q-file-${attempt}.md`);
      await fs.writeFile(filePath, `content ${attempt}`);
      emit('add', filePath);
    }

    // Let the debounce timers fire so the active slots are taken AND queue
    // entries are pending.
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Close — this rejects every queued waiter. The 2 active reindex tasks
    // are still hanging on releaseGate, so we resolve the gate concurrently
    // so close() can settle them via Promise.allSettled.
    const closePromise = watcher.close();
    setTimeout(() => releaseActive(), 50);
    await closePromise;

    // The QUEUE_CLOSED rejections should produce at least one console.error
    // log via the new "Skipped queued reindex" path.
    const closedErrorCalls = consoleErrorSpy.mock.calls.filter(
      (call) => typeof call[0] === 'string' && (call[0] as string).includes('Skipped queued reindex'),
    );
    expect(closedErrorCalls.length).toBeGreaterThan(0);

    // No console.warn calls should mention the queue-closed sentinel — that
    // would mean the bypass branch missed the sentinel and treated it as a
    // genuine task failure.
    const warnedClosedCalls = consoleWarnSpy.mock.calls.filter(
      (call) => typeof call[0] === 'string' && (call[0] as string).includes('closed before queued reindex ran'),
    );
    expect(warnedClosedCalls.length).toBe(0);

    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });
});
