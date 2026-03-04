// ---------------------------------------------------------------
// MODULE: File Watcher
// ---------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

export interface WatcherConfig {
  paths: string[];
  reindexFn: (filePath: string) => Promise<unknown>;
  debounceMs?: number;
}

export interface FSWatcher {
  on: (event: string, listener: (...args: unknown[]) => void) => FSWatcher;
  close: () => Promise<void>;
}

const DEFAULT_DEBOUNCE_MS = 2000;
const RETRY_DELAYS_MS = [1000, 2000, 4000];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isDotfilePath(filePath: string): boolean {
  return filePath.split(path.sep).some((part) => part.startsWith('.') && part.length > 1);
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
  for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      await operation();
      return;
    } catch (error: unknown) {
      const shouldRetry = isSqliteBusyError(error) && attempt < RETRY_DELAYS_MS.length - 1;
      if (!shouldRetry) {
        throw error;
      }
      await sleep(RETRY_DELAYS_MS[attempt]);
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

  const watcher = chokidar.watch(config.paths, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 1000 },
    ignored: (targetPath: string) => {
      if (isDotfilePath(targetPath)) return true;
      const basename = path.basename(targetPath);
      if (basename.startsWith('.')) return true;
      return !targetPath.endsWith('.md');
    },
  });

  const scheduleReindex = (targetPath: unknown): void => {
    if (typeof targetPath !== 'string') {
      return;
    }
    const filePath = targetPath;
    if (!filePath.endsWith('.md') || isDotfilePath(filePath)) {
      return;
    }

    const existing = debounceTimers.get(filePath);
    if (existing) {
      clearTimeout(existing);
    }

    const timeout = setTimeout(() => {
      debounceTimers.delete(filePath);

      void (async () => {
        try {
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

          const previousHash = contentHashes.get(filePath);
          if (previousHash && previousHash === nextHash) {
            return;
          }

          await withBusyRetry(async () => {
            await config.reindexFn(filePath);
          });

          contentHashes.set(filePath, nextHash);
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error);
          console.warn(`[file-watcher] Re-index failed for ${filePath}: ${message}`);
        }
      })();
    }, debounceMs);

    debounceTimers.set(filePath, timeout);
  };

  // Codex fix: Seed the dedup hash cache for newly added files so the first
  // subsequent 'change' event can properly deduplicate. Without seeding, the
  // cache is empty at startup and every first change triggers a redundant reindex.
  const seedHash = (targetPath: unknown): void => {
    if (typeof targetPath !== 'string') return;
    const filePath = targetPath;
    if (!filePath.endsWith('.md') || isDotfilePath(filePath)) return;
    if (contentHashes.has(filePath)) return;

    void hashFileContent(filePath)
      .then((hash) => { contentHashes.set(filePath, hash); })
      .catch(() => { /* file may not exist yet — ignore */ });
  };

  watcher.on('add', (targetPath: unknown) => {
    seedHash(targetPath);
    scheduleReindex(targetPath);
  });
  watcher.on('change', scheduleReindex);
  watcher.on('error', (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[file-watcher] Watcher error: ${message}`);
  });

  const originalClose = watcher.close.bind(watcher);
  watcher.close = async () => {
    for (const timeout of debounceTimers.values()) {
      clearTimeout(timeout);
    }
    debounceTimers.clear();
    await originalClose();
  };

  return watcher;
}
