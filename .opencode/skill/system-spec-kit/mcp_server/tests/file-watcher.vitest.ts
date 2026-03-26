// TEST: File watcher reliability and path filtering
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  __testables,
  getWatcherMetrics,
  resetWatcherMetrics,
  startFileWatcher,
} from '../lib/ops/file-watcher';

interface MockFsWatcher {
  on: (event: string, listener: (...args: unknown[]) => void) => MockFsWatcher;
  close: () => Promise<void>;
}

function createWatchFactoryHarness(): {
  emit: (event: string, ...args: unknown[]) => void;
  listenerCount: (event: string) => number;
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
    emit: (event: string, ...args: unknown[]) => {
      for (const listener of listeners.get(event) ?? []) {
        listener(...args);
      }
    },
    listenerCount: (event: string) => (listeners.get(event) ?? []).length,
    watchFactory: () => {
      queueMicrotask(() => {
        for (const listener of listeners.get('ready') ?? []) {
          listener();
        }
      });
      return watcher;
    },
  };
}

function createDeferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve!: () => void;
  const promise = new Promise<void>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

const tempDirs: string[] = [];
const activeWatchers: Array<{ close: () => Promise<void> }> = [];
let usingFakeClock = false;

function trackWatcher<T extends { close: () => Promise<void> }>(watcher: T): T {
  activeWatchers.push(watcher);
  return watcher;
}

function sleepFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function advanceOrDelay(ms: number): Promise<void> {
  if (usingFakeClock) {
    await vi.advanceTimersByTimeAsync(ms);
    return;
  }

  await sleepFor(ms);
}

async function waitForWatcherReady(
  watcher: { on: (event: string, listener: (...args: unknown[]) => void) => unknown },
  timeoutMs = 5000
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Timed out waiting for watcher ready after ${timeoutMs}ms`));
    }, timeoutMs);

    watcher.on('ready', () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

async function closeTrackedWatcher(watcher: { close: () => Promise<void> }): Promise<void> {
  const watcherIndex = activeWatchers.indexOf(watcher);
  if (watcherIndex >= 0) {
    activeWatchers.splice(watcherIndex, 1);
  }
  await watcher.close();
}

async function cleanupWatchers(): Promise<void> {
  const watchersToClose = activeWatchers.splice(0, activeWatchers.length);
  const closeResults = await Promise.allSettled(watchersToClose.map(async (watcher) => watcher.close()));
  const failedClose = closeResults.find(
    (result): result is PromiseRejectedResult => result.status === 'rejected'
  );
  if (failedClose) {
    throw failedClose.reason;
  }
}

async function cleanupTempDirs(): Promise<void> {
  const dirsToRemove = tempDirs.splice(0, tempDirs.length);
  const removeResults = await Promise.allSettled(
    dirsToRemove.map(async (dir) => fs.rm(dir, { recursive: true, force: true }))
  );
  const failedRemove = removeResults.find(
    (result): result is PromiseRejectedResult => result.status === 'rejected'
  );
  if (failedRemove) {
    throw failedRemove.reason;
  }
}

async function createTempMarkdown(content = 'hello world'): Promise<string> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'spec-kit-watcher-'));
  tempDirs.push(tempDir);
  const filePath = path.join(tempDir, 'sample.md');
  await fs.writeFile(filePath, content, 'utf8');
  return filePath;
}

async function createTempDir(): Promise<string> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'spec-kit-watcher-'));
  tempDirs.push(tempDir);
  return tempDir;
}

async function waitFor(
  predicate: () => boolean,
  options: { timeoutMs?: number; intervalMs?: number } = {}
): Promise<void> {
  const timeoutMs = options.timeoutMs ?? 5000;
  const intervalMs = options.intervalMs ?? 25;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (predicate()) {
      return;
    }
    await advanceOrDelay(intervalMs);
  }

  throw new Error(`Timed out waiting for condition after ${timeoutMs}ms`);
}

describe('file-watcher path filters', () => {
  it('does not treat .opencode as a hidden path', () => {
    expect(__testables.isDotfilePath('/workspace/.opencode/specs/001-test/spec.md')).toBe(false);
  });

  it('treats dotfiles as hidden paths', () => {
    expect(__testables.isDotfilePath('/workspace/specs/001-test/.DS_Store')).toBe(true);
    expect(__testables.isDotfilePath('/workspace/specs/001-test/.git/config')).toBe(true);
  });

  it('keeps directory and non-dot targets watchable', () => {
    expect(__testables.shouldIgnoreWatchTarget('/workspace/.opencode/specs')).toBe(false);
    expect(__testables.shouldIgnoreWatchTarget('/workspace/specs')).toBe(false);
    expect(__testables.shouldIgnoreWatchTarget('/workspace/specs/001-test/spec.txt')).toBe(false);
  });

  it('scopes hidden-path checks relative to the watched root', () => {
    const watchRoot = '/workspace/.tmp-codex-vitest/project';
    const filePath = '/workspace/.tmp-codex-vitest/project/specs/001-test/spec.md';
    const scopedPath = __testables.getWatchScopedPath(filePath, [watchRoot]);

    expect(scopedPath).toBe('specs/001-test/spec.md');
    expect(__testables.shouldIgnoreWatchTarget(scopedPath ?? filePath)).toBe(false);
  });

  it('markdown detection is extension-based', () => {
    expect(__testables.isMarkdownPath('/workspace/specs/001-test/spec.md')).toBe(true);
    expect(__testables.isMarkdownPath('/workspace/specs/001-test/spec.txt')).toBe(false);
  });
});

describe('file-watcher runtime behavior', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    usingFakeClock = true;
    vi.useFakeTimers();
  });

  afterEach(async () => {
    await cleanupWatchers();
    await cleanupTempDirs();
    usingFakeClock = false;
    vi.useRealTimers();
  });

  it('forces reindex for repeated add events even when content is unchanged', async () => {
    const { emit, listenerCount, watchFactory } = createWatchFactoryHarness();
    const tempDir = await createTempDir();
    const filePath = path.join(tempDir, 'sample.md');
    const reindexFn = vi.fn(async () => undefined);

    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      debounceMs: 50,
    });
    trackWatcher(watcher);

    await waitForWatcherReady(watcher);
    expect(listenerCount('add')).toBeGreaterThan(0);

    await fs.writeFile(filePath, 'same content', 'utf8');
    emit('add', filePath);
    await waitFor(() => reindexFn.mock.calls.length >= 1, { timeoutMs: 4000 });
    const initialCallCount = reindexFn.mock.calls.length;

    await fs.unlink(filePath);
    await advanceOrDelay(1300);
    await fs.writeFile(filePath, 'same content', 'utf8');
    emit('add', filePath);

    await waitFor(() => reindexFn.mock.calls.length > initialCallCount, { timeoutMs: 4000 });
    expect(reindexFn.mock.calls.length).toBeGreaterThan(initialCallCount);
  });

  it('waits for in-flight reindex to finish during close', async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const tempDir = await createTempDir();
    const filePath = path.join(tempDir, 'sample.md');
    const deferred = createDeferred();
    const reindexFn = vi.fn(async () => {
      await deferred.promise;
    });

    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      debounceMs: 30,
    });
    trackWatcher(watcher);

    await waitForWatcherReady(watcher);

    await fs.writeFile(filePath, 'close-check', 'utf8');
    emit('add', filePath);
    await waitFor(() => reindexFn.mock.calls.length >= 1, { timeoutMs: 4000 });

    let closeResolved = false;
    const closePromise = closeTrackedWatcher(watcher).then(() => {
      closeResolved = true;
    });

    await advanceOrDelay(100);
    expect(closeResolved).toBe(false);

    deferred.resolve();
    await closePromise;

    expect(closeResolved).toBe(true);

  });

  it('silently ignores ENOENT when file is removed before debounce execution', async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const filePath = await createTempMarkdown('delete-me');
    const tempDir = path.dirname(filePath);
    const reindexFn = vi.fn(async () => undefined);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      debounceMs: 80,
    });
    trackWatcher(watcher);

    await waitForWatcherReady(watcher);

    await fs.writeFile(filePath, 'delete-me-again', 'utf8');
    emit('change', filePath);
    await advanceOrDelay(20);
    await fs.unlink(filePath);
    await advanceOrDelay(180);

    expect(reindexFn).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('calls removeFn when a markdown file is deleted', async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const filePath = await createTempMarkdown('remove-me');
    const tempDir = path.dirname(filePath);
    const reindexFn = vi.fn(async () => undefined);
    const removeFn = vi.fn(async () => undefined);

    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      removeFn,
      debounceMs: 50,
    });
    trackWatcher(watcher);

    await waitForWatcherReady(watcher);

    await fs.unlink(filePath);
    emit('unlink', filePath);
    await waitFor(() => removeFn.mock.calls.length >= 1, { timeoutMs: 4000 });

    expect(removeFn).toHaveBeenCalledWith(filePath);
  });

  it('retries SQLITE_BUSY with exponential backoff before succeeding', async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const filePath = await createTempMarkdown('retry-busy');
    const tempDir = path.dirname(filePath);
    const sqliteBusyError = Object.assign(new Error('busy'), { code: 'SQLITE_BUSY' });
    let reindexCallCount = 0;

    const reindexFn = async () => {
      reindexCallCount += 1;
      if (reindexCallCount < 3) {
        throw sqliteBusyError;
      }
    };

    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      debounceMs: 30,
    });
    trackWatcher(watcher);

    await waitForWatcherReady(watcher);

    await fs.writeFile(filePath, 'retry-busy-updated', 'utf8');
    emit('change', filePath);

    await waitFor(() => reindexCallCount >= 1, { timeoutMs: 1000 });
    await advanceOrDelay(3000);
    await waitFor(() => reindexCallCount >= 3, { timeoutMs: 500 });
    expect(reindexCallCount).toBe(3);

    await closeTrackedWatcher(watcher);
  });

  // CHK-077: File watcher timing test — changed file re-indexed within 5 seconds
  it('CHK-077: changed .md file re-indexed within 5 seconds of save', async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const tempDir = await createTempDir();
    const filePath = path.join(tempDir, 'timing-test.md');
    await fs.writeFile(filePath, 'initial content', 'utf8');
    const reindexFn = vi.fn(async () => undefined);

    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      debounceMs: 100,
    });
    trackWatcher(watcher);

    await waitForWatcherReady(watcher);

    const startTime = Date.now();
    await fs.writeFile(filePath, 'updated content for timing', 'utf8');
    emit('change', filePath);
    await waitFor(() => reindexFn.mock.calls.length >= 1, { timeoutMs: 5000 });
    const elapsed = Date.now() - startTime;

    expect(reindexFn).toHaveBeenCalled();
    expect(elapsed).toBeLessThan(5000);
  });

  // CHK-078: Debounce coalescing — 5 rapid writes produce exactly 1 reindex
  it('CHK-078: rapid consecutive saves debounced to exactly 1 re-index', async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const tempDir = await createTempDir();
    const filePath = path.join(tempDir, 'debounce-test.md');
    await fs.writeFile(filePath, 'initial', 'utf8');
    const reindexFn = vi.fn(async () => undefined);

    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      debounceMs: 200,
    });
    trackWatcher(watcher);

    await waitForWatcherReady(watcher);

    // Write 5 times rapidly (20ms gaps) with unique content each time
    for (let i = 0; i < 5; i++) {
      await fs.writeFile(filePath, `content-${i}-${Date.now()}`, 'utf8');
      emit('change', filePath);
      await advanceOrDelay(20);
    }

    // Wait for stability + debounce + buffer to settle
    await advanceOrDelay(1500);

    // Wait for at least one reindex call
    await waitFor(() => reindexFn.mock.calls.length >= 1, { timeoutMs: 3000 });

    // Give a bit more time to check no additional calls
    await advanceOrDelay(500);

    // Should have coalesced to exactly 1 reindex call
    expect(reindexFn.mock.calls.length).toBe(1);
  });

  it('removes old entry and indexes new entry on file rename', { timeout: 10000 }, async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const tempDir = await createTempDir();
    const oldPath = path.join(tempDir, 'rename-old.md');
    const newPath = path.join(tempDir, 'rename-new.md');
    await fs.writeFile(oldPath, 'rename-test', 'utf8');

    const indexedPaths = new Set<string>([oldPath]);
    const reindexFn = vi.fn(async (filePath: string) => {
      indexedPaths.add(filePath);
    });
    const removeFn = vi.fn(async (filePath: string) => {
      indexedPaths.delete(filePath);
    });

    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      removeFn,
      debounceMs: 80,
    });
    trackWatcher(watcher);

    try {
      await waitForWatcherReady(watcher);
      await fs.rename(oldPath, newPath);
      const resolvedNewPath = await fs.realpath(newPath);
      emit('unlink', oldPath);
      emit('add', newPath);

      await waitFor(
        () =>
          removeFn.mock.calls.some((call) => call[0] === oldPath) &&
          reindexFn.mock.calls.some((call) => call[0] === resolvedNewPath),
        { timeoutMs: 5000 }
      );

      expect(indexedPaths.has(oldPath)).toBe(false);
      expect(indexedPaths.has(resolvedNewPath)).toBe(true);
    } finally {
      await closeTrackedWatcher(watcher);
    }
  });

  it('debounces rapid changes within the 2-second default window to one reindex', { timeout: 10000 }, async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const tempDir = await createTempDir();
    const filePath = path.join(tempDir, 'debounce-default-window.md');
    await fs.writeFile(filePath, 'initial', 'utf8');

    const reindexFn = vi.fn(async () => undefined);
    const watcher = trackWatcher(startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
    }));

    try {
      await waitForWatcherReady(watcher);
      for (let i = 0; i < 3; i++) {
        await fs.writeFile(filePath, `burst-${i}`, 'utf8');
        emit('change', filePath);
        await advanceOrDelay(80);
      }

      await waitFor(() => reindexFn.mock.calls.length >= 1, { timeoutMs: 7000 });
      expect(reindexFn).toHaveBeenCalledTimes(1);
    } finally {
      await closeTrackedWatcher(watcher);
    }
  });

  it('handles burst renames and keeps only final path indexed', { timeout: 10000 }, async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const tempDir = await createTempDir();
    let currentPath = path.join(tempDir, 'burst-0.md');
    await fs.writeFile(currentPath, 'burst-0', 'utf8');

    const paths: string[] = [currentPath];
    const indexedPaths = new Set<string>([currentPath]);
    const reindexFn = vi.fn(async (filePath: string) => {
      indexedPaths.add(filePath);
    });
    const removeFn = vi.fn(async (filePath: string) => {
      indexedPaths.delete(filePath);
    });

    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      removeFn,
      debounceMs: 90,
    });
    trackWatcher(watcher);

    try {
      await waitForWatcherReady(watcher);

      for (let i = 1; i <= 3; i++) {
        const nextPath = path.join(tempDir, `burst-${i}.md`);
        const previousPath = currentPath;
        await fs.rename(currentPath, nextPath);
        currentPath = nextPath;
        paths.push(currentPath);
        emit('unlink', previousPath);
        emit('add', currentPath);
        await advanceOrDelay(40);
      }

      const finalPath = currentPath;
      const resolvedFinalPath = await fs.realpath(finalPath);
      await waitFor(() => reindexFn.mock.calls.some((call) => call[0] === resolvedFinalPath), { timeoutMs: 5000 });

      expect(indexedPaths.has(resolvedFinalPath)).toBe(true);
      for (const stalePath of paths.slice(0, -1)) {
        expect(indexedPaths.has(stalePath)).toBe(false);
      }
    } finally {
      await closeTrackedWatcher(watcher);
    }
  });

  it('handles concurrent renames across multiple files', { timeout: 10000 }, async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const tempDir = await createTempDir();
    const originals = ['alpha.md', 'beta.md', 'gamma.md'].map((name) => path.join(tempDir, name));
    const renamed = ['alpha-renamed.md', 'beta-renamed.md', 'gamma-renamed.md'].map((name) => path.join(tempDir, name));

    await Promise.all(
      originals.map((filePath, index) => fs.writeFile(filePath, `seed-${index}`, 'utf8'))
    );

    const indexedPaths = new Set<string>(originals);
    const reindexFn = vi.fn(async (filePath: string) => {
      indexedPaths.add(filePath);
    });
    const removeFn = vi.fn(async (filePath: string) => {
      indexedPaths.delete(filePath);
    });

    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      removeFn,
      debounceMs: 100,
    });
    trackWatcher(watcher);

    try {
      await waitForWatcherReady(watcher);

      await Promise.all(originals.slice(0, 2).map((oldPath, index) => fs.rename(oldPath, renamed[index])));
      await fs.rename(originals[2], renamed[2]);
      const resolvedRenamed = await Promise.all(renamed.map(async (filePath) => fs.realpath(filePath)));
      originals.forEach((oldPath) => emit('unlink', oldPath));
      renamed.forEach((newPath) => emit('add', newPath));

      await waitFor(
        () =>
          originals.every((oldPath) => removeFn.mock.calls.some((call) => call[0] === oldPath)) &&
          resolvedRenamed.every((newPath) => reindexFn.mock.calls.some((call) => call[0] === newPath)),
        { timeoutMs: 7000 }
      );

      for (const oldPath of originals) {
        expect(indexedPaths.has(oldPath)).toBe(false);
      }
      for (const newPath of resolvedRenamed) {
        expect(indexedPaths.has(newPath)).toBe(true);
      }
    } finally {
      await closeTrackedWatcher(watcher);
    }
  });

  it('reindexes symlinked files via their resolved path and deduplicates unchanged aliases', async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const tempDir = await createTempDir();
    const realPath = path.join(tempDir, 'real.md');
    const symlinkPath = path.join(tempDir, 'alias.md');
    await fs.writeFile(realPath, 'shared-target', 'utf8');
    await fs.symlink(realPath, symlinkPath);

    const reindexFn = vi.fn(async () => undefined);
    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      debounceMs: 50,
    });
    trackWatcher(watcher);

    try {
      await waitForWatcherReady(watcher);

      const resolvedRealPath = await fs.realpath(realPath);
      emit('change', symlinkPath);
      await waitFor(() => reindexFn.mock.calls.length >= 1, { timeoutMs: 4000 });
      expect(reindexFn).toHaveBeenCalledWith(resolvedRealPath);

      emit('change', realPath);
      await advanceOrDelay(250);
      expect(reindexFn).toHaveBeenCalledTimes(1);
    } finally {
      await closeTrackedWatcher(watcher);
    }
  });
});

describe('file-watcher metrics', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    usingFakeClock = true;
    vi.useFakeTimers();
    resetWatcherMetrics();
  });

  afterEach(async () => {
    await cleanupWatchers();
    await cleanupTempDirs();
    usingFakeClock = false;
    vi.useRealTimers();
  });

  it('returns zero metrics before any reindexing', async () => {
    expect(getWatcherMetrics()).toEqual({
      filesReindexed: 0,
      avgReindexTimeMs: 0,
    });
  });

  it('tracks filesReindexed after reindex operations', async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const filePath = await createTempMarkdown('metrics-count-start');
    const tempDir = path.dirname(filePath);
    const reindexFn = vi.fn(async () => undefined);

    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      debounceMs: 40,
    });
    trackWatcher(watcher);

    await waitForWatcherReady(watcher);
    await fs.writeFile(filePath, 'metrics-count-updated', 'utf8');
    emit('change', filePath);
    await waitFor(() => getWatcherMetrics().filesReindexed >= 1, { timeoutMs: 5000 });

    const metrics = getWatcherMetrics();
    expect(metrics.filesReindexed).toBeGreaterThanOrEqual(1);
    expect(metrics.filesReindexed).toBe(reindexFn.mock.calls.length);
  });

  it('computes avgReindexTimeMs as the running average of reindex timings', async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const filePath = await createTempMarkdown('metrics-avg-start');
    const tempDir = path.dirname(filePath);
    const configuredDelays = [30, 90];
    const observedDurations: number[] = [];
    let runIndex = 0;

    const reindexFn = vi.fn(async () => {
      const delayMs = configuredDelays[Math.min(runIndex, configuredDelays.length - 1)];
      runIndex += 1;
      const start = Date.now();
      await advanceOrDelay(delayMs);
      observedDurations.push(Date.now() - start);
    });

    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      debounceMs: 40,
    });
    trackWatcher(watcher);

    await waitForWatcherReady(watcher);
    await fs.writeFile(filePath, 'metrics-avg-1', 'utf8');
    emit('change', filePath);
    await waitFor(() => getWatcherMetrics().filesReindexed >= 1, { timeoutMs: 5000 });
    await fs.unlink(filePath);
    await advanceOrDelay(1300);
    await fs.writeFile(filePath, 'metrics-avg-2', 'utf8');
    emit('add', filePath);
    await waitFor(() => reindexFn.mock.calls.length >= 2, { timeoutMs: 7000 });

    const metrics = getWatcherMetrics();
    const observedAverage = Math.round(
      observedDurations.reduce((sum, duration) => sum + duration, 0) / observedDurations.length
    );

    expect(metrics.filesReindexed).toBeGreaterThanOrEqual(1);
    expect(metrics.avgReindexTimeMs).toBeGreaterThanOrEqual(Math.max(0, observedAverage - 40));
    expect(metrics.avgReindexTimeMs).toBeLessThanOrEqual(observedAverage + 80);
  });

  it('accumulates metrics across multiple reindex operations', async () => {
    const { emit, watchFactory } = createWatchFactoryHarness();
    const filePath = await createTempMarkdown('metrics-accumulate-start');
    const tempDir = path.dirname(filePath);
    const reindexFn = vi.fn(async () => {
      await advanceOrDelay(10);
    });

    const watcher = startFileWatcher({
      paths: [tempDir],
      watchFactory,
      reindexFn,
      debounceMs: 40,
    });
    trackWatcher(watcher);

    await waitForWatcherReady(watcher);
    await fs.writeFile(filePath, 'metrics-accumulate-1', 'utf8');
    emit('change', filePath);
    await waitFor(() => getWatcherMetrics().filesReindexed >= 1, { timeoutMs: 5000 });
    const afterFirst = getWatcherMetrics();

    await advanceOrDelay(1200);
    await fs.writeFile(filePath, 'metrics-accumulate-2', 'utf8');
    emit('change', filePath);
    await waitFor(() => getWatcherMetrics().filesReindexed >= 2, { timeoutMs: 5000 });
    const afterSecond = getWatcherMetrics();

    expect(afterFirst.filesReindexed).toBeGreaterThanOrEqual(1);
    expect(afterSecond.filesReindexed).toBeGreaterThan(afterFirst.filesReindexed);
    expect(afterSecond.filesReindexed).toBe(reindexFn.mock.calls.length);
  });
});
