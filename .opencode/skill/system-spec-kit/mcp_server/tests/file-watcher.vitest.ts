// @ts-nocheck
// ---------------------------------------------------------------
// TEST: File watcher reliability and path filtering
// ---------------------------------------------------------------

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { __testables, startFileWatcher } from '../lib/ops/file-watcher';

function createDeferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve!: () => void;
  const promise = new Promise<void>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

const tempDirs: string[] = [];
const activeWatchers: Array<{ close: () => Promise<void> }> = [];

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
    await delay(intervalMs);
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

  it('markdown detection is extension-based', () => {
    expect(__testables.isMarkdownPath('/workspace/specs/001-test/spec.md')).toBe(true);
    expect(__testables.isMarkdownPath('/workspace/specs/001-test/spec.txt')).toBe(false);
  });
});

describe('file-watcher runtime behavior', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(async () => {
    while (activeWatchers.length > 0) {
      const watcher = activeWatchers.pop();
      if (watcher) {
        await watcher.close();
      }
    }

    await Promise.all(tempDirs.map(async (dir) => {
      await fs.rm(dir, { recursive: true, force: true });
    }));
    tempDirs.length = 0;
  });

  it('forces reindex for repeated add events even when content is unchanged', async () => {
    const tempDir = await createTempDir();
    const filePath = path.join(tempDir, 'sample.md');
    const reindexFn = vi.fn(async () => undefined);

    const watcher = startFileWatcher({
      paths: [tempDir],
      reindexFn,
      debounceMs: 50,
    });
    activeWatchers.push(watcher);

    await delay(150);

    await fs.writeFile(filePath, 'same content', 'utf8');
    await waitFor(() => reindexFn.mock.calls.length >= 1, { timeoutMs: 4000 });
    const initialCallCount = reindexFn.mock.calls.length;

    await fs.unlink(filePath);
    await delay(1300);
    await fs.writeFile(filePath, 'same content', 'utf8');

    await waitFor(() => reindexFn.mock.calls.length > initialCallCount, { timeoutMs: 4000 });
    expect(reindexFn.mock.calls.length).toBeGreaterThan(initialCallCount);
  });

  it('waits for in-flight reindex to finish during close', async () => {
    const tempDir = await createTempDir();
    const filePath = path.join(tempDir, 'sample.md');
    const deferred = createDeferred();
    const reindexFn = vi.fn(async () => {
      await deferred.promise;
    });

    const watcher = startFileWatcher({
      paths: [tempDir],
      reindexFn,
      debounceMs: 30,
    });
    activeWatchers.push(watcher);

    await delay(150);

    await fs.writeFile(filePath, 'close-check', 'utf8');
    await waitFor(() => reindexFn.mock.calls.length >= 1, { timeoutMs: 4000 });

    let closeResolved = false;
    const closePromise = watcher.close().then(() => {
      closeResolved = true;
    });

    await delay(100);
    expect(closeResolved).toBe(false);

    deferred.resolve();
    await closePromise;

    expect(closeResolved).toBe(true);

    const watcherIndex = activeWatchers.indexOf(watcher);
    if (watcherIndex >= 0) {
      activeWatchers.splice(watcherIndex, 1);
    }
  });

  it('silently ignores ENOENT when file is removed before debounce execution', async () => {
    const filePath = await createTempMarkdown('delete-me');
    const tempDir = path.dirname(filePath);
    const reindexFn = vi.fn(async () => undefined);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const watcher = startFileWatcher({
      paths: [tempDir],
      reindexFn,
      debounceMs: 80,
    });
    activeWatchers.push(watcher);

    await delay(150);

    await fs.writeFile(filePath, 'delete-me-again', 'utf8');
    await delay(20);
    await fs.unlink(filePath);
    await delay(180);

    expect(reindexFn).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('calls removeFn when a markdown file is deleted', async () => {
    const filePath = await createTempMarkdown('remove-me');
    const tempDir = path.dirname(filePath);
    const reindexFn = vi.fn(async () => undefined);
    const removeFn = vi.fn(async () => undefined);

    const watcher = startFileWatcher({
      paths: [tempDir],
      reindexFn,
      removeFn,
      debounceMs: 50,
    });
    activeWatchers.push(watcher);

    await delay(150);

    await fs.unlink(filePath);
    await waitFor(() => removeFn.mock.calls.length >= 1, { timeoutMs: 4000 });

    expect(removeFn).toHaveBeenCalledWith(filePath);
  });

  it('retries SQLITE_BUSY with exponential backoff before succeeding', async () => {
    const filePath = await createTempMarkdown('retry-busy');
    const tempDir = path.dirname(filePath);
    const reindexFn = vi.fn(async () => undefined);
    const sqliteBusyError = Object.assign(new Error('busy'), { code: 'SQLITE_BUSY' });
    reindexFn
      .mockRejectedValueOnce(sqliteBusyError)
      .mockRejectedValueOnce(sqliteBusyError)
      .mockResolvedValueOnce(undefined);

    const watcher = startFileWatcher({
      paths: [tempDir],
      reindexFn,
      debounceMs: 30,
    });
    activeWatchers.push(watcher);

    await delay(150);

    await fs.writeFile(filePath, 'retry-busy-updated', 'utf8');

    await waitFor(() => reindexFn.mock.calls.length >= 3, { timeoutMs: 5500 });
    expect(reindexFn).toHaveBeenCalledTimes(3);

    const watcherIndex = activeWatchers.indexOf(watcher);
    if (watcherIndex >= 0) {
      activeWatchers.splice(watcherIndex, 1);
      await watcher.close();
    }
  });
});
