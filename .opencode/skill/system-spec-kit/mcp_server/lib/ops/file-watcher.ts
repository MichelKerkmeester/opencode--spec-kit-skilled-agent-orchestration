// ---------------------------------------------------------------
// MODULE: File Watcher
// ---------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

export interface WatcherConfig {
  paths: string[];
  reindexFn: (filePath: string) => Promise<unknown>;
  removeFn?: (filePath: string) => Promise<unknown>;
  debounceMs?: number;
}

export interface FSWatcher {
  on: (event: string, listener: (...args: unknown[]) => void) => FSWatcher;
  close: () => Promise<void>;
}

const DEFAULT_DEBOUNCE_MS = 2000;
const RETRY_DELAYS_MS = [1000, 2000, 4000];
const MAX_BUSY_RETRIES = RETRY_DELAYS_MS.length;

// CHK-087: Watcher metrics counters
let filesReindexed = 0;
let totalReindexTimeMs = 0;

/** Return accumulated watcher metrics for diagnostics. */
export function getWatcherMetrics(): { filesReindexed: number; avgReindexTimeMs: number } {
  return {
    filesReindexed,
    avgReindexTimeMs: filesReindexed > 0 ? Math.round(totalReindexTimeMs / filesReindexed) : 0,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isDotfilePath(filePath: string): boolean {
  const parts = filePath
    .split(/[/\\]/)
    .filter((part) => part.length > 0);

  for (const part of parts) {
    if (!part.startsWith('.') || part.length <= 1) {
      continue;
    }

    // AI-WHY: .opencode is a first-class workspace root for Spec Kit assets.
    // Treating it as a dotfile path would suppress watcher events for
    // .opencode/specs/** and break auto re-indexing in default layouts.
    if (part === '.opencode') {
      continue;
    }

    return true;
  }

  return false;
}

function isMarkdownPath(filePath: string): boolean {
  return filePath.toLowerCase().endsWith('.md');
}

function shouldIgnoreWatchTarget(targetPath: string): boolean {
  if (isDotfilePath(targetPath)) return true;
  const basename = path.basename(targetPath);
  return basename.startsWith('.');
}

function isSqliteBusyError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const code = (error as { code?: unknown })?.code;
  return code === 'SQLITE_BUSY' || /SQLITE_BUSY/i.test(message);
}

async function hashFileContent(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  return createHash('sha256').update(content).digest('hex');
}

async function withBusyRetry(operation: () => Promise<void>): Promise<void> {
  let retryCount = 0;
  while (true) {
    try {
      await operation();
      return;
    } catch (error: unknown) {
      const shouldRetry = isSqliteBusyError(error) && retryCount < MAX_BUSY_RETRIES;
      if (!shouldRetry) {
        throw error;
      }
      await sleep(RETRY_DELAYS_MS[retryCount]);
      retryCount += 1;
    }
  }
}

export function startFileWatcher(config: WatcherConfig): FSWatcher {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const chokidar = require('chokidar') as {
    watch: (paths: string[], options: Record<string, unknown>) => FSWatcher;
  };

  const debounceMs = config.debounceMs ?? DEFAULT_DEBOUNCE_MS;
  const debounceTimers = new Map<string, NodeJS.Timeout>();
  const contentHashes = new Map<string, string>();
  const inFlightReindex = new Set<Promise<void>>();
  let isClosing = false;

  const trackInFlight = (task: Promise<void>): void => {
    inFlightReindex.add(task);
    void task.finally(() => {
      inFlightReindex.delete(task);
    });
  };

  const watcher = chokidar.watch(config.paths, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 1000 },
    ignored: shouldIgnoreWatchTarget,
  });

  const scheduleTask = (
    targetPath: unknown,
    operation: () => Promise<void>,
  ): void => {
    if (typeof targetPath !== 'string') {
      return;
    }
    if (isClosing) {
      return;
    }

    const filePath = targetPath;
    if (!isMarkdownPath(filePath) || isDotfilePath(filePath)) {
      return;
    }

    const existing = debounceTimers.get(filePath);
    if (existing) {
      clearTimeout(existing);
    }

    const timeout = setTimeout(() => {
      debounceTimers.delete(filePath);
      if (isClosing) {
        return;
      }

      const task = operation().catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[file-watcher] Watch task failed for ${filePath}: ${message}`);
      });
      trackInFlight(task);
    }, debounceMs);

    debounceTimers.set(filePath, timeout);
  };

  const scheduleReindex = (targetPath: unknown, options: { force?: boolean } = {}): void => {
    const filePath = typeof targetPath === 'string' ? targetPath : null;
    const forceReindex = options.force === true;

    scheduleTask(targetPath, async () => {
      if (!filePath) {
        return;
      }

      // Sprint 9 fix: Handle ENOENT gracefully when a file is rapidly
      // created then deleted before the debounce timer fires.
      let nextHash: string;
      try {
        nextHash = await hashFileContent(filePath);
      } catch (hashErr: unknown) {
        const code = (hashErr as { code?: string })?.code;
        if (code === 'ENOENT') return; // File was deleted — silently ignore
        throw hashErr;
      }

      if (!forceReindex) {
        const previousHash = contentHashes.get(filePath);
        if (previousHash && previousHash === nextHash) {
          return;
        }
      }

      const reindexStart = Date.now();
      await withBusyRetry(async () => {
        await config.reindexFn(filePath);
      });
      const reindexElapsed = Date.now() - reindexStart;
      filesReindexed++;
      totalReindexTimeMs += reindexElapsed;
      console.error(`[file-watcher] Reindexed ${filePath} in ${reindexElapsed}ms (total: ${filesReindexed} files, avg: ${Math.round(totalReindexTimeMs / filesReindexed)}ms)`);

      contentHashes.set(filePath, nextHash);
    });
  };

  const scheduleRemove = (targetPath: unknown): void => {
    const filePath = typeof targetPath === 'string' ? targetPath : null;

    scheduleTask(targetPath, async () => {
      if (!filePath) {
        return;
      }

      contentHashes.delete(filePath);
      if (!config.removeFn) {
        return;
      }

      await withBusyRetry(async () => {
        await config.removeFn?.(filePath);
      });
      console.error(`[file-watcher] Removed indexed entries for ${filePath}`);
    });
  };

  watcher.on('add', (targetPath: unknown) => {
    scheduleReindex(targetPath, { force: true });
  });
  watcher.on('change', (targetPath: unknown) => {
    scheduleReindex(targetPath);
  });
  watcher.on('unlink', (targetPath: unknown) => {
    scheduleRemove(targetPath);
  });
  watcher.on('error', (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[file-watcher] Watcher error: ${message}`);
  });

  const originalClose = watcher.close.bind(watcher);
  watcher.close = async () => {
    isClosing = true;
    for (const timeout of debounceTimers.values()) {
      clearTimeout(timeout);
    }
    debounceTimers.clear();

    while (inFlightReindex.size > 0) {
      await Promise.allSettled(Array.from(inFlightReindex));
    }

    await originalClose();
  };

  return watcher;
}

export const __testables = {
  isDotfilePath,
  isMarkdownPath,
  shouldIgnoreWatchTarget,
  isSqliteBusyError,
};
